"use client"

import Link from "next/link"
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs"
import { PanelLeftIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

export function SidebarHeaderContent() {
  const { state, toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()
  const { isLoaded: orgLoaded } = useOrganization()

  if (state === "expanded") {
    return (
      <div className="flex w-full items-center justify-between">
        {orgLoaded ? (
          <OrganizationSwitcher />
        ) : (
          <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        )}
        {!isMobile && <SidebarTrigger className="shrink-0" />}
      </div>
    )
  }

  if (isMobile) return null

  return (
    <SidebarMenu className="w-full gap-1">
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Expand Sidebar" asChild>
          <Link
            href="#"
            className="flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault()
              toggleSidebar()
            }}
          >
            <PanelLeftIcon />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
