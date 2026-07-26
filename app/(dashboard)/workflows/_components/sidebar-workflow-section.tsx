"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus } from "@/components/animate-ui/icons/plus"
import { Route } from "@/components/animate-ui/icons/route"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface Workflow {
  id: string
  name: string
}

export function SidebarWorkflowSection({
  workflows,
}: {
  workflows: Workflow[]
}) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isActive = pathname.startsWith("/workflows")

  if (state === "expanded") {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Workflows</SidebarGroupLabel>
        <SidebarGroupAction asChild tooltip="Create Workflow">
          <button>
            <Plus animateOnHover />
          </button>
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            {workflows.map((workflow) => (
              <SidebarMenuItem key={workflow.id}>
                <SidebarMenuButton tooltip={workflow.name} asChild>
                  <Link href="/workflows">
                    <Route />
                    <span>{workflow.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  return (
    <SidebarMenu className="flex items-center justify-center gap-1">
      <SidebarMenuItem>
        <Popover>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              isActive={isActive}
              tooltip="Workflows"
              className="justify-center"
            >
              <Route />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-56">
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent">
              <Plus className="h-4 w-4" />
              Create new Workflow
            </button>
            <hr className="my-1 border-border" />
            <div className="px-2 text-xs font-medium text-muted-foreground">
              Recent
            </div>
            {workflows.map((workflow) => (
              <Link
                key={workflow.id}
                href="/workflows"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
              >
                <Route className="h-4 w-4" />
                {workflow.name}
              </Link>
            ))}
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
