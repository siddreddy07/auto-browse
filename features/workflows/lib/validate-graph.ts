import { workflowGraph } from "@/lib/schema";
import { nodeDefinitions } from "@/features/workflows/node-registry";
import toposort from "toposort"


export function validateGraph({nodes,edges}:workflowGraph): string[] {

    const problems : string[] = []

    const triggers = nodes.filter((n) => {
      const def = nodeDefinitions.find(d => d.type === n.data.type)
      return def?.kind === "trigger"
    }).length

    if(triggers !== 1){
        problems.push(`A Workflow needs to have exactly one Start trigger (found ${triggers})`)
    }

    if(edges.length === 0){
        problems.push("Connect your nodes before running")
    }

    else{

        try {

            toposort(edges.map((e)=> [e.source,e.target]))

        } catch (error) {
                problems.push('Workflow has a cycle - remvoe the loop before running !')
        }

    }

    return problems

}