import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { RightSidebar } from "./right-sidebar"

export function WorkflowShell({ workflowId }: { workflowId: string }) {
  return (
    <div className="flex flex-1">
      <ResizablePanelGroup orientation="horizontal" className="flex flex-1">
        <ResizablePanel minSize={480}>
          <ResizablePanelGroup orientation="vertical" className="flex flex-1 flex-col">
            <ResizablePanel minSize={288} className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              Canvas
            </ResizablePanel>
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
  )
}
