"use client"

import { useEffect, useState, useCallback } from "react"
import {
  ReactFlow,
  Controls,
  ConnectionLineType,
  Panel,
  useReactFlow,
} from "@xyflow/react"
import type { ColorMode } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"

import { ResizablePanel } from "@/components/ui/resizable"
import { useTheme } from "next-themes"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import { StepNode } from "../step-node"
import { nodeDefinitions, type StepNodeData } from "../nodes/node-registry"
import { AvatarStack } from "@liveblocks/react-ui"

export type AddNodeResult = { success: boolean; reason?: string }
export type AddNodeFn = (type: string) => AddNodeResult

const nodeTypes = { step: StepNode }

export function Canvas({ onAddNodeReady }: { onAddNodeReady?: (fn: AddNodeFn) => void }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const reactFlow = useReactFlow()

  useEffect(() => setMounted(true), [])

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDelete,
  } = useLiveblocksFlow({
    suspense: true,
  })

  const addNode = useCallback((type: string) => {
    const def = nodeDefinitions.find((d) => d.type === type)
    if (!def) return { success: false, reason: `Unknown node type: ${type}` }

    if (def.kind === "trigger" && nodes.some((n) => n.data && n.data.type === type)) {
      return { success: false, reason: `Only one "${def.label}" trigger allowed` }
    }

    const sameTypeCount = nodes.filter((n) => n.data && n.data.type === type).length
    const label = def.kind === "action" && sameTypeCount > 0
      ? `${def.label} ${sameTypeCount + 1}`
      : def.label

    const center = reactFlow.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })

    const initialData: Record<string, string> = { type }
    for (const field of def.fields) {
      initialData[field.key] = ""
    }

    const newNode = {
      id: crypto.randomUUID(),
      type: "step" as const,
      position: { x: center.x - 100, y: center.y - 50 },
      data: { ...initialData, displayLabel: label } as Record<string, unknown>,
    }

    onNodesChange([{ type: "add", item: newNode } as any])
    return { success: true }
  }, [nodes, onNodesChange, reactFlow])

  useEffect(() => {
    onAddNodeReady?.(addNode)
  }, [addNode, onAddNodeReady])

  return (
    <ResizablePanel minSize={288}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={["Delete", "Backspace"]}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          type: "smoothstep",
        }}
        className="size-full"
        style={
          {
          "--xy-background-color": "var(--background)",
        } as React.CSSProperties
      }

        maxZoom={1}
        colorMode={mounted ? (resolvedTheme as ColorMode) : undefined}
      >
        {mounted && <Controls />}
        <Cursors />
        <style>
          {`
            .react-flow {
              position: relative;
            }
            .react-flow__edge.selected .react-flow__edge-path {
              stroke: #3b82f6 !important;
              stroke-width: 3 !important;
              filter: drop-shadow(0 0 4px #3b82f6);
            }
            .lb-react-flow-cursors {
              z-index: 9999 !important;
            }
            .lb-cursor svg {
              width: 14px !important;
              height: 20px !important;
            }
          `}
        </style>
        <Panel position="top-right">
          <AvatarStack size={24}/>
        </Panel>
      </ReactFlow>
    </ResizablePanel>
  )
}
