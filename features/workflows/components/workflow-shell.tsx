"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Canvas } from "./canvas"
import { RightSidebar } from "./right-sidebar"
import { NodeSelectionProvider } from "./workflows-provider"

export function WorkflowShell({ workflowId }: { workflowId: string }) {
  return (
    <NodeSelectionProvider>
      <div className="flex flex-1">
        <ResizablePanelGroup orientation="horizontal" className="flex flex-1">
          <ResizablePanel minSize={480}>
            <ResizablePanelGroup orientation="vertical" className="flex flex-1 flex-col">
              <Canvas />
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={128} minSize={96} className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                Output
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <RightSidebar />
        </ResizablePanelGroup>
      </div>
    </NodeSelectionProvider>
  )
}
