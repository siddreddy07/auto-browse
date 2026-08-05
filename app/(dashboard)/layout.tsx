import { auth } from "@clerk/nextjs/server"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { listWorkflows } from "@/features/workflows/data"
import { listAgents } from "@/features/agents/data"
import { AgentsProvider } from "@/features/agents/components/agents-provider"
import { WorkflowsProvider } from "@/features/workflows/components/workflows-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { orgId, userId } = await auth()
  const workflows = orgId ? await listWorkflows(orgId) : []
  const agents = userId ? await listAgents(orgId ?? null, userId) : []

  return (
      <SidebarProvider className="h-svh">
        <AppSidebar workflows={workflows} />
        <SidebarInset>
          <WorkflowsProvider workflows={workflows}>
            <AgentsProvider agents={agents}>
              {children}
            </AgentsProvider>
          </WorkflowsProvider>
        </SidebarInset>
      </SidebarProvider>
  )
}
