import toposort from "toposort"
import {logger,task} from "@trigger.dev/sdk"
import { getWorkflow } from "../data"
import { getStagehand } from "@/lib/stagehand"
import { executeNode } from "../nodes/node-executor"
import { nodeDefinitions } from "../nodes/node-registry"



export const runWorkflowTask = task({
    id:'run-workflow',
    run: async({workflowId,orgId} : {workflowId:string, orgId:string}) => {

        const workflow = await getWorkflow(orgId,workflowId)

        if(!workflow?.graph) throw new Error(`Workflow ${workflowId} has no graph`)

        const {nodes,edges} = workflow.graph

        const byId = new Map(nodes.map((n)=> [n.id,n]))


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

        try {
            for(const id of order){
                const node = byId.get(id)
                const data = node?.data
                if(!data) continue

                const def = nodeDefinitions.find((d)=> d.type === data.type)
                if(def?.kind === "trigger") continue

                logger.info(`Running Step : ${data.displayLabel || data.type}`)

                const result = await executeNode(stagehand, data)
                logger.info(`Step ${data.displayLabel || data.type} completed`, {result})
            }
        } finally {
            await stagehand.close()
        }

        return {steps:order.length}

    }
})
