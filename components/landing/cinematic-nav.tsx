"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"
import { Show, SignUpButton } from "@clerk/nextjs"

import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

function PrimaryButton({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-400",
        className
      )}
    >
      {children}
    </button>
  )
}

export function CinematicNav() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [open])

  const handleHashClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return
    const target = document.getElementById(href.slice(1))
    if (!target) return
    event.preventDefault()
    if (open) setOpen(false)
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }, open ? 150 : 0)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-900 bg-zinc-950">
      <div aria-hidden className="h-0.5 w-full bg-indigo-500" />
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/assets/auto_browse_fav-removebg-preview.png"
            alt="AutoBrowse logo"
            width={36}
            height={20}
            className="h-5 w-auto object-contain"
          />
          <span className="text-base font-semibold tracking-tight text-white">
            AutoBrowse
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(event) => handleHashClick(event, link.href)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-2 hidden md:block">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <PrimaryButton>
                Get started
                <ArrowRight
                  className="size-4"
                  aria-hidden
                />
              </PrimaryButton>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/workflows"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-400"
            >
              Go to Workflows
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Show>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white md:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden />
          ) : (
            <Menu className="size-5" aria-hidden />
          )}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-zinc-900 bg-zinc-950 md:hidden"
        >
          <div className="mx-auto max-w-[1200px] space-y-1 px-4 py-4 sm:px-6 lg:px-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(event) => handleHashClick(event, link.href)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3">
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <PrimaryButton className="w-full py-3">
                    Get started
                    <ArrowRight className="size-4" aria-hidden />
                  </PrimaryButton>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/workflows"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-400"
                >
                  Go to Workflows
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Show>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}