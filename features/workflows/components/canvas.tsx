"use client"

import { useEffect, useState, useCallback } from "react"
import {
  ReactFlow,
  Controls,
  ConnectionLineType,
  Panel,
  useReactFlow,
  type Node as FlowNode
} from "@xyflow/react"
import type { ColorMode } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"

import { ResizablePanel } from "@/components/ui/resizable"
import { useTheme } from "next-themes"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import { useParams } from "next/navigation"
import { StepNode } from "../step-node"
import { nodeDefinitions } from "../node-registry"
import { AvatarStack } from "@liveblocks/react-ui"
import { useNodeSelection } from "./workflows-provider"

const nodeTypes = { step: StepNode }

export function Canvas() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { selectedNode, setSelectedNode, registerAddNode } = useNodeSelection()
  const reactFlow = useReactFlow()

  useEffect(() => setMounted(true), [])

  const params = useParams()
  const workflowId = params?.id as string

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: FlowNode) => {
    console.log(`[Canvas] Workflow ${workflowId}: clicked node`, (({ id, type, data, position }) => ({ id, type, data, position }))(node as any))
    setSelectedNode(node)
  }, [workflowId, setSelectedNode])

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDelete,
  } = useLiveblocksFlow({
    suspense: true,
    nodes: {
      initial: [
        {
          id: "n1",
          position: { x: 50, y: 80 },
          data: { type: "start" },
          type: "step",
        },
        {
          id: "n2",
          position: { x: 350, y: 80 },
          data: { type: "openurl", url: "https://example.com" },
          type: "step",
        },
        {
          id: "n3",
          position: { x: 650, y: 80 },
          data: { type: "agent", model: "gpt-4o", prompt: "", apiKey: "" },
          type: "step",
        },
        {
          id: "n4",
          position: { x: 950, y: 80 },
          data: { type: "send-email", to: "", subject: "", body: "" },
          type: "step",
        },
      ],
    },
    edges: {
      initial: [
        { id: "e1", source: "n1", target: "n2", type: "smoothstep" },
        { id: "e2", source: "n2", target: "n3", type: "smoothstep" },
        { id: "e3", source: "n3", target: "n4", type: "smoothstep" },
      ],
    },
  })

  useEffect(() => {
    if (selectedNode && !nodes.some((n) => n.id === selectedNode.id)) {
      setSelectedNode(null)
    }
  }, [nodes, selectedNode, setSelectedNode])

  const addNode = useCallback((type: string) => {
    const def = nodeDefinitions.find((d) => d.type === type)
    if (!def) return { success: false, reason: `Unknown node type: ${type}` }

    if (def.kind === "trigger" && nodes.some((n) => n.data && n.data.type === type)) {
      return { success: false, reason: `Only one "${def.label}" trigger allowed` }
    }

    const sameTypeCount = nodes.filter((n) => n.data && n.data.type === type).length
    const label = def.kind === "action"
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
    registerAddNode(addNode)
  }, [addNode, registerAddNode])

  return (
    <ResizablePanel minSize={288}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        onNodeClick={handleNodeClick}
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
