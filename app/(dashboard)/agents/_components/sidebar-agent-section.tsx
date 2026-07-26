"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot } from "@/components/animate-ui/icons/bot"
import { Plus } from "@/components/animate-ui/icons/plus"
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

interface Agent {
  id: string
  name: string
}

export function SidebarAgentSection({ agents }: { agents: Agent[] }) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isActive = pathname.startsWith("/agents")

  if (state === "expanded") {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Agents</SidebarGroupLabel>
        <SidebarGroupAction asChild tooltip="Create Agent">
          <button>
            <Plus animateOnHover />
          </button>
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            {agents.map((agent) => (
              <SidebarMenuItem key={agent.id}>
                <SidebarMenuButton tooltip={agent.name} asChild>
                  <Link href="/agents">
                    <Bot />
                    <span>{agent.name}</span>
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
              tooltip="Agents"
              className="justify-center"
            >
              <Bot />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-56">
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent">
              <Plus className="h-4 w-4" />
              Create new Agent
            </button>
            <hr className="my-1 border-border" />
            <div className="px-2 text-xs font-medium text-muted-foreground">
              Recent
            </div>
            {agents.map((agent) => (
              <Link
                key={agent.id}
                href="/agents"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
              >
                <Bot className="h-4 w-4" />
                {agent.name}
              </Link>
            ))}
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
