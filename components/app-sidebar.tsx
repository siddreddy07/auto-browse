import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SidebarHeaderContent } from "@/components/sidebar-header-content"
import { SidebarFooterContent } from "@/components/sidebar-footer-content"
import { SidebarWorkflowSection } from "@/features/workflows/components/sidebar-workflow-section"
import { SidebarAgentSection } from "@/features/agents/components/sidebar-agent-section"
import type { Agent, Workflow } from "@/lib/schema"

export async function AppSidebar({ workflows, agents }: { workflows: Workflow[]; agents: Agent[] }) {

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-between p-2">
        <SidebarHeaderContent />
      </SidebarHeader>
      <SidebarContent className="gap-2">
        <SidebarWorkflowSection workflows={workflows} />
        <SidebarAgentSection agents={agents} />
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-center p-2">
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  )
}
