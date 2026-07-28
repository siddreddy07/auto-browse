"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransition } from "react"
import { Bot } from "@/components/animate-ui/icons/bot"
import { Plus } from "@/components/animate-ui/icons/plus"
import { Loader2 } from "lucide-react"
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
import type { Agent } from "@/lib/schema"
import { createAgentAction } from "@/features/agents/actions"

export function SidebarAgentSection({ agents }: { agents: Agent[] }) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isActive = pathname.startsWith("/agents")
  const [isPending, startTransition] = useTransition()

  function handleCreateAgent() {
    startTransition(async () => {
      await createAgentAction({
        name: "New Agent",
        apiKey: "",
        modelName: "",
        prompt: "",
      })
    })
  }

  if (state === "expanded") {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Agents</SidebarGroupLabel>
        <SidebarGroupAction asChild>
          <button onClick={handleCreateAgent} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus animateOnHover />}
          </button>
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            {agents.length === 0 ? (
              <SidebarMenuItem>
                <span className="px-2 py-1.5 text-xs text-muted-foreground">
                  No agents yet
                </span>
              </SidebarMenuItem>
            ) : (
              agents.map((agent) => (
                <SidebarMenuItem key={agent.id}>
                  <SidebarMenuButton tooltip={agent.name} asChild isActive={pathname === `/agents/${agent.id}`}>
                    <Link href={`/agents/${agent.id}`}>
                      <Bot animateOnHover />
                      <span>{agent.name}</span>
                    </Link>
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
              tooltip="Agents"
              className="justify-center"
            >
              <Bot animateOnHover />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-56">
            <button
              onClick={handleCreateAgent}
              disabled={isPending}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create new Agent
            </button>
            <hr className="my-1 border-border" />
            <div className="px-2 text-xs flex items-center justify-between font-medium text-muted-foreground">
              <span>
                Recent
              </span>
              <Link href={'agents'} className="underline cursor-pointer hover:text-zinc-500">
                Go to agents
              </Link>
            </div>
            {agents.length === 0 ? (
              <span className="block px-2 py-1.5 text-xs text-muted-foreground">
                No agents yet
              </span>
            ) : (
              agents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent ${pathname === `/agents/${agent.id}` ? "bg-accent text-accent-foreground" : ""}`}
                >
                  <Bot className="h-4 w-4" />
                  {agent.name}
                </Link>
              ))
            )}
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
