"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { Store } from "lucide-react"
import { Bot } from "@/components/animate-ui/icons/bot"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

export function SidebarFooterContent() {
  const { state } = useSidebar()
  const { user, isLoaded: userLoaded } = useUser()
  const pathname = usePathname()
  const router = useRouter()

  const expanded = state === "expanded"

  const activeTab = pathname.startsWith("/agents")
    ? "agents"
    : pathname.startsWith("/marketplace")
      ? "marketplace"
      : ""

  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center gap-2 overflow-hidden">
      {expanded && (
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            router.push(value === "agents" ? "/agents" : "/marketplace")
          }
          orientation="horizontal"
          className="min-w-0 w-full items-center justify-center overflow-hidden"
        >
          <TabsList className="min-w-0 w-full overflow-hidden">
            <TabsTrigger
              value="agents"
              className="gap-1.5 cursor-pointer overflow-hidden data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-active:border-transparent data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-sidebar-accent"
            >
              <Bot className="size-4 shrink-0" />
              <span className="truncate">Agents</span>
            </TabsTrigger>
            <TabsTrigger
              value="marketplace"
              className="gap-1.5 cursor-pointer overflow-hidden data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-active:border-transparent data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-sidebar-accent"
            >
              <Store className="size-4 shrink-0" />
              <span className="truncate">Marketplace</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      {expanded && <SidebarSeparator />}
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Account"
            className={expanded ? "" : "justify-center"}
          >
            {userLoaded ? (
              <>
                <UserButton />
                {expanded && user && (
                  <span className="truncate text-sm">{user.fullName}</span>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="size-8 animate-pulse rounded-full bg-muted" />
                {expanded && (
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                )}
              </div>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
