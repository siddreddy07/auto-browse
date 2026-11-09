import { auth } from "@clerk/nextjs/server"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
  const agents = userId ? await listAgents(orgId ?? null) : []

  return (
    <SidebarProvider className="h-svh">
      <AppSidebar workflows={workflows} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3 md:hidden">
          <SidebarTrigger />
          <span className="text-sm font-semibold">Auto Browse</span>
        </header>
        <WorkflowsProvider workflows={workflows}>
          <AgentsProvider agents={agents}>{children}</AgentsProvider>
        </WorkflowsProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
