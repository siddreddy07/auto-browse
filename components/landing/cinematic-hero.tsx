"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs"
import { MotionConfig, motion } from "motion/react"

export function CinematicHero() {
  return (
    <section className="bg-zinc-950 px-4 pb-16 pt-32 sm:px-6 md:pb-24 md:pt-44 lg:px-8">
      <MotionConfig reducedMotion="user">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-[1200px] flex-col items-start"
        >
          <p className="font-mono text-[13px] tracking-tight text-zinc-500">
            <span className="text-emerald-500">$</span> autobrowse run
            workflow --live
          </p>

          <h1 className="mt-5 max-w-4xl font-display text-[2.6rem] leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.5rem]">
            Anything a browser can do.{" "}
            <span className="text-indigo-400">On autopilot.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg">
            Describe the task in plain English. AutoBrowse drives a real
            browser through logins, searches, and scrapes — then hands you the
            results. No code required.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center">
            <Show when="signed-out">
              <SignUpButton>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-400 sm:w-auto"
                >
                  Start free
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              </SignUpButton>
              <SignInButton>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-800 px-6 py-3 text-sm font-medium text-zinc-300 shadow-sm transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-white sm:w-auto"
                >
                  Sign in
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/workflows"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-400 sm:w-auto"
              >
                Go to Workflows
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Show>
          </div>

          <p className="mt-6 text-xs text-zinc-500">
            Free to start · No credit card required
          </p>
        </motion.div>
      </MotionConfig>
    </section>
  )
}