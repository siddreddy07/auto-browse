"use client"

import { useRef, useCallback } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Canvas } from "./canvas"
import { RightSidebar } from "./right-sidebar"
import type { AddNodeFn } from "./canvas"

export function WorkflowShell({ workflowId }: { workflowId: string }) {
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
              <Canvas onAddNodeReady={handleAddNodeReady} />
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={128} minSize={96} className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                Output
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
