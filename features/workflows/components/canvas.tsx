"use client"

import { useEffect, useState } from "react"
import {
  ReactFlow,
  Controls,
  ConnectionLineType,
  Panel
} from "@xyflow/react"
import type { ColorMode } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"

import { ResizablePanel } from "@/components/ui/resizable"
import { useTheme } from "next-themes"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import { StepNode } from "../step-node"
import {AvatarStack} from "@liveblocks/react-ui"

const nodeTypes = { step: StepNode }

export function Canvas() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

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
          data: { type: "open-url", url: "https://example.com" },
          type: "step",
        },
        {
          id: "n3",
          position: { x: 650, y: 80 },
          data: { type: "ai-agent", model: "gpt-4o", prompt: "", apiKey: "" },
          type: "step",
        },
        {
          id: "n4",
          position: { x: 950, y: 80 },
          data: { type: "send-email", to: "", subject: "", body: "" },
          type: "step",
        },
        {
          id: "n5",
          position: { x: 1100, y: 200 },
          data: { type: "stop" },
          type: "step",
        },
      ],
    },
    edges: {
      initial: [
        { id: "e1", source: "n1", target: "n2", type: "smoothstep" },
        { id: "e2", source: "n2", target: "n3", type: "smoothstep" },
        { id: "e3", source: "n3", target: "n4", type: "smoothstep" },
        { id: "e4", source: "n4", target: "n5", type: "smoothstep" },
      ],
    },
  })

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
