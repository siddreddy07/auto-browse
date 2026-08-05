import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { SidebarHeaderContent } from "@/components/sidebar-header-content"
import { SidebarFooterContent } from "@/components/sidebar-footer-content"
import { SidebarWorkflowSection } from "@/features/workflows/components/sidebar-workflow-section"
import { SidebarAgentSection } from "@/features/agents/components/sidebar-agent-section"
import type { Workflow } from "@/lib/schema"

export async function AppSidebar({ workflows }: { workflows: Workflow[] }) {

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-between p-2">
        <SidebarHeaderContent />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="gap-2">
        <SidebarWorkflowSection workflows={workflows} />
        <SidebarAgentSection />
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-center p-2">
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  )
}
