"use client"

import { useRef, useCallback } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Canvas } from "./canvas"
import { RightSidebar } from "./right-sidebar"
import { TopologyPanel } from "./topology-panel"
import type { AddNodeFn } from "./canvas"

export function WorkflowShell({ workflowId, name }: { workflowId: string; name?: string }) {
  const addNodeRef = useRef<AddNodeFn>(undefined)

  const handleAddNodeReady = useCallback((fn: AddNodeFn) => {
    addNodeRef.current = fn
  }, [])

  return (
    <ReactFlowProvider>
      <div className="flex flex-1">
        <ResizablePanelGroup orientation="horizontal" className="flex flex-1">
          <ResizablePanel minSize={480}>
            <ResizablePanelGroup orientation="vertical" className="flex flex-1 flex-col">
              <Canvas onAddNodeReady={handleAddNodeReady} name={name} />
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={320} minSize={260} className="overflow-hidden">
                <TopologyPanel workflowId={workflowId} name={name} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <RightSidebar workflowId={workflowId} addNode={(type) => addNodeRef.current?.(type) ?? { success: false, reason: "Not ready" }} />
        </ResizablePanelGroup>
      </div>
    </ReactFlowProvider>
  )
}
