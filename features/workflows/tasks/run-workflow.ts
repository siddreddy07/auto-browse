import toposort from "toposort"
import {logger,task} from "@trigger.dev/sdk"
import type { LiveObject, LiveMap, LsonObject } from "@liveblocks/node"
import { getWorkflow, saveWorkflowGraph } from "../data"
import { getStagehand } from "@/lib/stagehand"
import { liveblocks } from "@/lib/liveblocks"
import { executeNode, type NodeContext } from "../nodes/node-executor"
import { nodeDefinitions, type NodeStatus, type StepNodeData } from "../nodes/node-registry"

export const runWorkflowTask = task({
    id:'run-workflow',
    run: async({workflowId,orgId} : {workflowId:string, orgId:string}) => {

        const workflow = await getWorkflow(orgId,workflowId)

        if(!workflow?.graph) throw new Error(`Workflow ${workflowId} has no graph`)

        let {nodes} = workflow.graph
        const {edges} = workflow.graph

        const connected = new Set(edges.flatMap((e)=> [e.source,e.target]))

        const order = toposort
                        .array(
                            nodes.map((n)=> n.id),
                            edges.map((e)=> [e.source,e.target])
                        )
                        .filter((id)=> connected.has(id))

        console.log('Order :',order)

        logger.info(`Running Workflow ${workflow.name} : `,{steps:order.length})

        const stagehand = await getStagehand()

        const byId = new Map(nodes.map((n)=> [n.id,n]))

        const actionableIds = order.filter((id)=>{
            const data = byId.get(id)?.data
            if(!data) return false
            return nodeDefinitions.find((d)=> d.type === data.type)?.kind !== "trigger"
        })

        await resetRunStatus(workflowId, actionableIds)

        try {
            for(const id of order){
                const node = byId.get(id)
                const data = node?.data
                if(!data) continue

                const def = nodeDefinitions.find((d)=> d.type === data.type)
                if(def?.kind === "trigger") continue

                const context: NodeContext = {
                    from: edges.filter((e)=> e.target === id).map((e)=> byId.get(e.source)?.data).filter((d): d is NonNullable<typeof d> => Boolean(d)),
                    to: edges.filter((e)=> e.source === id).map((e)=> ({ id: e.target, data: byId.get(e.target)?.data })).filter((t): t is { id: string; data: NonNullable<StepNodeData> } => Boolean(t.data)),
                }

                logger.info(`Running Step : ${data.displayLabel || data.type}`)

                const nodeData = attachOutput(data, id, byId, edges, nodeDefinitions)

                await syncNodeFields(workflowId, id, nodeData, nodeDefinitions)
                await setNodeStatus(workflowId, id, "running")

                try {
                    const result = await executeNode(stagehand, nodeData, context)
                    logger.info(`Step ${data.displayLabel || data.type} completed`, {result})

                    const nodeWithResult = { ...node, data: { ...nodeData, output: result, status: "done" as NodeStatus } }
                    nodes = nodes.map((n) => n.id === id ? nodeWithResult : n)
                    byId.set(id, nodeWithResult)

                    await setNodeStatus(workflowId, id, "done", undefined, result)
                } catch (error) {
                    const message = error instanceof Error ? error.message : String(error)
                    logger.error(`Step ${data.displayLabel || data.type} failed`, {error})

                    const nodeWithError = { ...node, data: { ...nodeData, status: "failed" as NodeStatus, error: message } }
                    nodes = nodes.map((n) => n.id === id ? nodeWithError : n)
                    byId.set(id, nodeWithError)

                    await setNodeStatus(workflowId, id, "failed", message)

                    throw error
                }
            }

            const dbNodes = nodes.map((n) => {
                if(!n.data) return n
                const clean = { ...n.data }
                delete clean.status
                delete clean.error
                return { ...n, data: clean }
            })

            await saveWorkflowGraph({orgId, id: workflowId, graph: {nodes: dbNodes, edges}})
        } finally {
            await stagehand.close()
        }

        return {steps:order.length}

    }
})

function attachOutput(
    data: StepNodeData,
    nodeId: string,
    byId: Map<string, { data: StepNodeData }>,
    edges: { source: string; target: string }[],
    defs: typeof nodeDefinitions,
): StepNodeData {
    const def = defs.find((d) => d.type === data.type)
    const fieldKeys = new Set((def?.fields ?? []).map((f) => f.key))
    let merged = data

    for (const edge of edges) {
        if (edge.target !== nodeId) continue
        const output = byId.get(edge.source)?.data.output as Record<string, unknown> | undefined
        if (!output) continue
        if (output.id !== undefined && output.id !== nodeId) continue
        merged = {
            ...merged,
            ...Object.fromEntries(Object.entries(output).filter(([key]) => fieldKeys.has(key))),
        }
    }

    return merged
}

type FlowNode = LiveObject<LsonObject>
type FlowStorage = LiveObject<{
    nodes: LiveMap<string, FlowNode>
    edges: LiveMap<string, FlowNode>
}>

async function resetRunStatus(workflowId: string, nodeIds: string[]) {
    try {
        await liveblocks.mutateStorage(workflowId, ({ root }) => {
            const flow = (root as unknown as LiveObject<{ flow: FlowStorage }>).get("flow")
            if (!flow) return

            const liveNodes = flow.get("nodes")
            if (!liveNodes) return

            for (const nodeId of nodeIds) {
                const liveNode = liveNodes.get(nodeId)
                if (!liveNode) continue
                const data = liveNode.get("data")
                if (!data) continue
                ;(data as unknown as FlowNode).update({
                    status: "pending",
                    error: undefined,
                } as unknown as Partial<LsonObject>)
            }
        })
    } catch (error) {
        logger.warn(`Failed to reset run status in Liveblocks room ${workflowId}`, { error })
    }
}

async function syncNodeFields(
    workflowId: string,
    nodeId: string,
    data: StepNodeData,
    defs: typeof nodeDefinitions,
) {
    try {
        const def = defs.find((d) => d.type === data.type)
        if (!def) return

        const patch: Record<string, unknown> = {}
        for (const field of def.fields) {
            patch[field.key] = data[field.key]
        }

        await liveblocks.mutateStorage(workflowId, ({ root }) => {
            const flow = (root as unknown as LiveObject<{ flow: FlowStorage }>).get("flow")
            if (!flow) return

            const liveNodes = flow.get("nodes")
            if (!liveNodes) return

            const liveNode = liveNodes.get(nodeId)
            if (!liveNode) return
            const nodeData = liveNode.get("data")
            if (!nodeData) return

            ;(nodeData as unknown as FlowNode).update(patch as unknown as Partial<LsonObject>)
        })
    } catch (error) {
        logger.warn(`Failed to sync node fields to Liveblocks room ${workflowId}`, { error })
    }
}

async function setNodeStatus(
    workflowId: string,
    nodeId: string,
    status: NodeStatus,
    error?: string,
    output?: unknown,
) {
    try {
        await liveblocks.mutateStorage(workflowId, ({ root }) => {
            const flow = (root as unknown as LiveObject<{ flow: FlowStorage }>).get("flow")
            if (!flow) return

            const liveNodes = flow.get("nodes")
            if (!liveNodes) return

            const liveNode = liveNodes.get(nodeId)
            if (!liveNode) return
            const data = liveNode.get("data")
            if (!data) return

            const patch: Record<string, unknown> = { status }
            if (error !== undefined) patch.error = error
            if (output !== undefined) patch.output = output

            ;(data as unknown as FlowNode).update(patch as unknown as Partial<LsonObject>)
        })
    } catch (error) {
        logger.warn(`Failed to sync node status to Liveblocks room ${workflowId}`, { error })
    }
}
