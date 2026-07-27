import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SidebarHeaderContent } from "@/components/sidebar-header-content"
import { SidebarFooterContent } from "@/components/sidebar-footer-content"
import { SidebarWorkflowSection } from "@/app/(dashboard)/workflows/_components/sidebar-workflow-section"
import { SidebarAgentSection } from "@/app/(dashboard)/agents/_components/sidebar-agent-section"

const dummyAgents = [
  { id: "1", name: "Support Bot" },
  { id: "2", name: "Sales Agent" },
]

export async function AppSidebar() {
  const agents = dummyAgents

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-between p-2">
        <SidebarHeaderContent />
      </SidebarHeader>
      <SidebarContent className="gap-2">
        <SidebarWorkflowSection />
        <SidebarAgentSection agents={agents} />
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-center p-2">
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  )
}
