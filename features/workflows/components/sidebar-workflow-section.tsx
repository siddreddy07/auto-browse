"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransition } from "react"
import { Plus } from "@/components/animate-ui/icons/plus"
import { Route, RouteIcon } from "@/components/animate-ui/icons/route"
import { Loader2, Menu } from "lucide-react"
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
import type { Workflow } from "@/lib/schema"
import { createWorkflowAction } from "../actions"
import { generateSlug } from "../lib/generate-slug"
import { Ellipsis } from "@/components/animate-ui/icons/ellipsis"

export function SidebarWorkflowSection({ workflows }: { workflows: Workflow[] }) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isActive = pathname.startsWith("/workflows")
  const [isPending, startTransition] = useTransition()

  function handleCreateWorkflow() {
    startTransition(() => {
      createWorkflowAction(generateSlug())
    })
  }

  if (state === "expanded") {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Workflows</SidebarGroupLabel>
        <SidebarGroupAction asChild>
          <button className="cursor-pointer" onClick={handleCreateWorkflow} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus animateOnHover />}
          </button>
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            {workflows.length === 0 ? (
              <SidebarMenuItem>
                <span className="px-2 py-1.5 text-xs text-muted-foreground">
                  No workflows yet
                </span>
              </SidebarMenuItem>
            ) : (
              workflows.map((workflow) => (
                <SidebarMenuItem key={workflow.id}>
                  <SidebarMenuButton tooltip={workflow.name} asChild isActive={pathname === `/workflows/${workflow.id}`}>
                    
                    <div className="w-full flex items-center justify-between"> 
                      <Link className="flex items-center gap-2" href={`/workflows/${workflow.id}`}>
                      <RouteIcon animateOnHover/>
                      <span>{workflow.name}</span>
                    </Link>
                    <span className="cursor-pointer hover:bg-zinc-900 p-1 rounded-full"><Ellipsis animateOnHover /></span>  
                      </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
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
            <button onClick={handleCreateWorkflow} disabled={isPending} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create new Workflow
            </button>
            <hr className="my-1 border-border" />
            <div className="px-2 text-xs flex items-center justify-between font-medium text-muted-foreground">
                <span>
              Recent
                </span>
                <Link href="/workflows" className="underline cursor-pointer hover:text-zinc-500">
                Go to workflows
              </Link>
            </div>
            {workflows.length === 0 ? (
              <span className="block px-2 py-1.5 text-xs text-muted-foreground">
                No workflows yet
              </span>
            ) : (
              workflows.map((workflow) => (
                <Link
                  key={workflow.id}
                  href={`/workflows/${workflow.id}`}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent ${pathname === `/workflows/${workflow.id}` ? "bg-accent text-accent-foreground" : ""}`}
                >
                  <Route className="h-4 w-4" />
                  {workflow.name}
                </Link>
              ))
            )}
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
