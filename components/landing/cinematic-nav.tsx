"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, LayoutDashboard, User } from "lucide-react"
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs"
import { AnimatePresence, MotionConfig, motion } from "motion/react"

import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Product", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

const PRIMARY =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-400 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-indigo-300"
const TEXT_LINK =
  "inline-flex items-center gap-1.5 text-sm font-medium text-zinc-200 transition-colors hover:text-white"

const EASE = [0.76, 0, 0.24, 1] as const
const EASE_OUT = [0.22, 1, 0.36, 1] as const

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="AutoBrowse home" className="shrink-0">
      <Image
        src="/assets/logo.png"
        alt="AutoBrowse"
        width={2052}
        height={400}
        priority
        className={className}
      />
    </Link>
  )
}

/** Two bars that rotate into an X — no icon swapping. */
function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block size-5">
      <motion.span
        className="absolute right-0.5 left-0.5 h-[1.5px] rounded-full bg-current"
        initial={false}
        animate={
          open
            ? { top: "50%", rotate: 45, y: "-50%" }
            : { top: "32%", rotate: 0, y: "-50%" }
        }
        transition={{ duration: 0.4, ease: EASE }}
      />
      <motion.span
        className="absolute right-0.5 left-0.5 h-[1.5px] rounded-full bg-current"
        initial={false}
        animate={
          open
            ? { top: "50%", rotate: -45, y: "-50%" }
            : { top: "68%", rotate: 0, y: "-50%" }
        }
        transition={{ duration: 0.4, ease: EASE }}
      />
    </span>
  )
}

export function CinematicNav() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const onResize = () => window.innerWidth >= 1024 && setOpen(false)
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
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
    window.setTimeout(
      () => target.scrollIntoView({ behavior: "smooth", block: "start" }),
      open ? 450 : 0
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className={cn(
            "mx-auto grid h-14 w-full max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center rounded-2xl border px-3 backdrop-blur-xl transition-colors duration-500 sm:h-16 sm:px-5",
            open ? "border-white/20 bg-black" : "border-white/10 bg-black/60"
          )}
        >
          {/* left */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                TEXT_LINK,
                "-ml-1 gap-2 rounded-lg p-1.5 lg:hidden"
              )}
            >
              <BurgerIcon open={open} />
              <span className="relative inline-block h-5 w-11 overflow-hidden text-left">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={open ? "close" : "menu"}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="absolute inset-0 leading-5"
                  >
                    {open ? "Close" : "Menu"}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
            <div className="hidden lg:block">
              <Logo className="h-9 w-auto" />
            </div>
          </div>

          {/* center */}
          <div className="flex items-center justify-center">
            <div className="lg:hidden">
              <Logo className="h-6 w-auto sm:h-7" />
            </div>
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(event) => handleHashClick(event, link.href)}
                  className="rounded-lg px-3.5 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* right */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button type="button" className={TEXT_LINK}>
                  <User className="size-[18px] lg:hidden" aria-hidden />
                  <span className="lg:hidden">Login</span>
                  <span className="hidden lg:inline">Log in</span>
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className={cn(PRIMARY, "hidden lg:inline-flex")}
                >
                  Get started
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/workflows" className={cn(TEXT_LINK, "lg:hidden")}>
                <LayoutDashboard className="size-[18px]" aria-hidden />
                Workflows
              </Link>
              <Link
                href="/workflows"
                className={cn(PRIMARY, "hidden lg:inline-flex")}
              >
                Go to Workflows
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Show>
          </div>
        </motion.div>
      </header>

      {/* full-screen menu: mobile + tablet */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            id="mobile-nav"
            initial={{
              clipPath: "inset(0% 0% 100% 0% round 0px 0px 36px 36px)",
            }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)" }}
            exit={{
              clipPath: "inset(0% 0% 100% 0% round 0px 0px 36px 36px)",
              transition: { duration: 0.5, ease: EASE, delay: 0.08 },
            }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-black px-5 pt-24 pb-8 lg:hidden"
          >
            <nav className="mx-auto w-full max-w-md flex-1 overflow-y-auto">
              <ul className="border-t border-white/10">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.6,
                        ease: EASE_OUT,
                        delay: 0.25 + i * 0.07,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      y: -12,
                      transition: { duration: 0.2, delay: (4 - i) * 0.02 },
                    }}
                    className="border-b border-white/10"
                  >
                    <Link
                      href={link.href}
                      onClick={(event) => handleHashClick(event, link.href)}
                      className="group flex items-center justify-between py-5 text-[1.75rem] font-medium tracking-tight text-white sm:text-4xl"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-zinc-600 transition-colors group-hover:text-indigo-300">
                          0{i + 1}
                        </span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          {link.label}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-5 text-zinc-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-300"
                        aria-hidden
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: EASE_OUT, delay: 0.65 },
              }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
              className="mx-auto mt-6 flex w-full max-w-md flex-col gap-3"
            >
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className={cn(PRIMARY, "w-full py-3.5 text-base")}
                  >
                    Get started free
                    <ArrowRight className="size-4" aria-hidden />
                  </button>
                </SignUpButton>
                <p className="text-center text-xs text-zinc-500">
                  No credit card required
                </p>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/workflows"
                  className={cn(PRIMARY, "w-full py-3.5 text-base")}
                >
                  Go to Workflows
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Show>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </MotionConfig>
  )
}
