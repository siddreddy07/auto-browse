"use client"

import Link from "next/link"
import Image from "next/image"
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs"

const CTA_GRADIENT = "linear-gradient(to bottom, #2B2B2B, #101010)"

function GetStartedButton({ className }: { className?: string }) {
  return (
    <SignUpButton mode="modal">
      <button
        type="button"
        className={className}
        style={{ background: CTA_GRADIENT }}
      >
        Get started
      </button>
    </SignUpButton>
  )
}

export function CinematicHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <Image
        aria-hidden
        src="/assets/moonlit.png"
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"
      />

      <div className="relative z-10 flex h-full flex-col">
        <main className="mt-auto flex flex-col gap-6 px-5 pb-8 sm:gap-8 sm:px-8 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-16">
          <div className="max-w-xl">
            <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-[3.5rem]">
              <span className="text-white">Anything a browser can do.</span>
              <span className="block bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                On autopilot.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:mt-8 sm:text-lg">
              Describe the task in plain English. AutoBrowse drives a real
              browser through logins, searches, checkouts, and scrapes — then
              hands you the results. No code required.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
              <Show when="signed-out">
                <SignUpButton>
                  <GetStartedButton className="rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90" />
                </SignUpButton>
                <SignInButton>
                  <button
                    type="button"
                    className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    Sign in
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/workflows"
                  className="flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: CTA_GRADIENT }}
                >
                  Go to Workflows
                </Link>
              </Show>
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}
