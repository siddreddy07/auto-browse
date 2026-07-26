"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function SidebarFooterContent() {
  const { state } = useSidebar()
  const { user, isLoaded: userLoaded } = useUser()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip="Account"
          className={state === "expanded" ? "" : "justify-center"}
        >
          {userLoaded ? (
            <>
              <UserButton />
              {state === "expanded" && user && (
                <span className="truncate text-sm">{user.fullName}</span>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              {state === "expanded" && (
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              )}
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
