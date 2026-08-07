"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Show, SignUpButton } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"

const CTA_GRADIENT = "linear-gradient(to bottom, #2B2B2B, #101010)"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

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

export function CinematicNav() {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
    }, open ? 300 : 0)
  }

  const solid = scrolled || open

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "border-b border-white/10 bg-ink/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/auto_browse_fav-removebg-preview.png"
            alt="AutoBrowse logo"
            width={36}
            height={20}
            className="h-5 w-auto object-contain"
          />
          <span
            className={cn(
              "text-lg font-semibold transition-colors",
              solid ? "text-white" : "text-[#010101] lg:text-white"
            )}
          >
            AutoBrowse
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <div
            className={cn(
              "flex items-center gap-1 rounded-full p-1.5 backdrop-blur-lg transition-colors",
              solid ? "bg-[#212121]/80" : "bg-white/10"
            )}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(event) => handleHashClick(event, link.href)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  solid
                    ? "text-white/70 hover:bg-white/10 hover:text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Show when="signed-out">
            <SignUpButton>
              <GetStartedButton className="self-stretch rounded-full px-5 text-sm font-medium text-white transition-opacity hover:opacity-90" />
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/workflows"
              className="flex items-center self-stretch rounded-full px-5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: CTA_GRADIENT }}
            >
              Go to Workflows
            </Link>
          </Show>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "relative z-50 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-lg transition-colors md:hidden",
            solid
              ? "bg-[#212121] text-white"
              : "bg-white/10 text-[#010101] lg:text-white"
          )}
        >
          <Menu
            className={`absolute size-5 transition-all duration-300 ${open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
          />
          <X
            className={`absolute size-5 transition-all duration-300 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
          />
        </button>
      </nav>

      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <div
        className={`fixed top-0 right-0 z-40 flex h-full w-72 flex-col bg-black/90 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col gap-2 px-6 pt-24">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(event) => handleHashClick(event, link.href)}
              style={{ transitionDelay: open ? `${(index + 1) * 60}ms` : "0ms" }}
              className={`rounded-xl px-4 py-3.5 text-base font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white ${open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div
          style={{
            transitionDelay: open ? "300ms" : "0ms",
            transitionDuration: "400ms",
          }}
          className={`mt-auto px-6 pb-10 transition-all ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <Show when="signed-out">
            <SignUpButton>
              <GetStartedButton className="w-full rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90" />
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/workflows"
              className="flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: CTA_GRADIENT }}
            >
              Go to Workflows
            </Link>
          </Show>
        </div>
      </div>
    </header>
  )
}
