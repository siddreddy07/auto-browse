"use client"

import { SignInButton, SignUpButton, Show, UserButton, OrganizationSwitcher } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="flex items-center justify-between border-b p-4">
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
