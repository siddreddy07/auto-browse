"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Store } from "lucide-react"
import { Bot } from "@/components/animate-ui/icons/bot"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function SidebarAgentSection() {
  const pathname = usePathname()
  const { state } = useSidebar()

  if (state === "expanded") {
    return null
  }

  return (
    <SidebarMenu className="flex items-center justify-center gap-1">
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname.startsWith("/agents")}
          tooltip="Agents"
          className="justify-center"
        >
          <Link href="/agents">
            <Bot />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname.startsWith("/marketplace")}
          tooltip="Marketplace"
          className="justify-center cursor-pointer"
        >
          <Link href="/marketplace">
            <Store />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
