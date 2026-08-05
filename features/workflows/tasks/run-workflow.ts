import toposort from "toposort"
import {logger,task} from "@trigger.dev/sdk"
import type { LiveObject, LiveMap, LsonObject } from "@liveblocks/node"
import { createRun, getWorkflow, saveWorkflowGraph, updateRunStatus } from "../data"
import { getStagehand } from "@/lib/stagehand"
import { liveblocks } from "@/lib/liveblocks"
import { executeNode, type NodeContext } from "../nodes/node-executor"
import { nodeDefinitions, type NodeStatus, type StepNodeData } from "../nodes/node-registry"

export const runWorkflowTask = task({
    id:'run-workflow',
    run: async({workflowId,orgId,userId} : {workflowId:string, orgId:string, userId?:string}) => {

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

        let browserbaseSessionId = stagehand.browserbaseSessionID

        if (browserbaseSessionId) {
            await createRun({ id: browserbaseSessionId, orgId, workflowId, userId })
        }

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

                const nodeData = resolveTokens(
                    data,
                    nodeDefinitions,
                    context.from,
                )

                await syncNodeFields(workflowId, id, nodeData, nodeDefinitions)
                await setNodeStatus(workflowId, id, "running")

                const startedAt = Date.now()
                try {
                    const result = await executeNode(stagehand, nodeData, context)
                    const durationMs = Date.now() - startedAt
                    logger.info(`Step ${data.displayLabel || data.type} completed`, {result, durationMs})

                    const nodeWithResult = { ...node, data: { ...nodeData, output: result, status: "done" as NodeStatus, durationMs } }
                    nodes = nodes.map((n) => n.id === id ? nodeWithResult : n)
                    byId.set(id, nodeWithResult)

                    await setNodeStatus(workflowId, id, "done", undefined, result, durationMs)
                } catch (error) {
                    const durationMs = Date.now() - startedAt
                    const message = error instanceof Error ? error.message : String(error)
                    logger.error(`Step ${data.displayLabel || data.type} failed`, {error, durationMs})

                    const nodeWithError = { ...node, data: { ...nodeData, status: "failed" as NodeStatus, error: message, durationMs } }
                    nodes = nodes.map((n) => n.id === id ? nodeWithError : n)
                    byId.set(id, nodeWithError)

                    await setNodeStatus(workflowId, id, "failed", message, undefined, durationMs)

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

            if (browserbaseSessionId) {
                await updateRunStatus(browserbaseSessionId, "success")
            }
        } catch (error) {
            if (browserbaseSessionId) {
                await updateRunStatus(browserbaseSessionId, "failed")
            }
            throw error
        } finally {
            browserbaseSessionId = browserbaseSessionId ?? stagehand.browserbaseSessionID
            await stagehand.close()
        }

        return { steps: order.length, browserbaseSessionId }

    }
})

function resolveTokens(
    data: StepNodeData,
    defs: typeof nodeDefinitions,
    from: StepNodeData[],
): StepNodeData {
    const upstreamValues = collectUpstreamOutputs(from)
    const nodeName = data.displayLabel || data.type
    const fields = defs.find((d) => d.type === data.type)?.fields ?? []

    const resolved = { ...data }
    for (const field of fields) {
        const value = resolved[field.key]
        if (typeof value !== "string") continue
        resolved[field.key] = replaceTokens(value, upstreamValues, nodeName, field.label)
    }
    return resolved
}

function collectUpstreamOutputs(from: StepNodeData[]): Record<string, unknown> {
    const values: Record<string, unknown> = {}
    for (const node of from) {
        const output = node.output
        if (output && typeof output === "object") {
            Object.assign(values, output as Record<string, unknown>)
        }
    }
    return values
}

function replaceTokens(
    value: string,
    values: Record<string, unknown>,
    nodeName: string,
    fieldLabel: string,
): string {
    return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, token) => {
        if (values[token] === undefined) {
            throw new Error(`Missing output "${token}" for field "${fieldLabel}" of node "${nodeName}". Connect the node that produces "${token}".`)
        }
        return String(values[token])
    })
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
                    durationMs: undefined,
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
    durationMs?: number,
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
            if (durationMs !== undefined) patch.durationMs = durationMs

            ;(data as unknown as FlowNode).update(patch as unknown as Partial<LsonObject>)
        })
    } catch (error) {
        logger.warn(`Failed to sync node status to Liveblocks room ${workflowId}`, { error })
    }
}
