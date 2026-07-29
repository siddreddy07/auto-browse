"use client"

import { useCallback, useEffect, useState } from "react"
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType
} from "@xyflow/react"
import type { ColorMode, Connection } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { ResizablePanel } from "@/components/ui/resizable"
import { useTheme } from "next-themes"

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" }, type: "input" },
  { id: "n2", position: { x: 100, y: 100 }, data: { label: "Node 2" }, type: "output" },
]

const initialEdges = [
  { id: "n1-n2", source: "n1", target: "n2", type: "smoothstep", style: { stroke: "var(--border)" } },
]

export function Canvas() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  )

  return (
    <ResizablePanel minSize={288}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{stroke: "var(--border)"}}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: {stroke: "var(--border)"}
        }}
        style={
          {
          "--xy-background-color": "var(--background)",
          "--xy-edge-stroke-width": 2,
          "--xy-connectionline-stroke-width":2
        } as React.CSSProperties
      }

        maxZoom={1}
        colorMode={mounted ? (resolvedTheme as ColorMode) : undefined}
        className="size-full"
      >
        <Controls />
      </ReactFlow>
    </ResizablePanel>
  )
}
