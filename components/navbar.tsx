"use client"

import { SignInButton, SignUpButton, Show, UserButton, OrganizationSwitcher } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-white/10 bg-background/60 p-4 backdrop-blur-xl">
      <span className="font-semibold text-lg">Auto Browse</span>
      <div className="flex items-center gap-2">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <OrganizationSwitcher />
          <UserButton />
        </Show>
      </div>
    </header>
  )
}
