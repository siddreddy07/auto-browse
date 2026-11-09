"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { Show, SignUpButton } from "@clerk/nextjs"
import { MotionConfig, motion } from "motion/react"

import GradientASCII from "@/components/landing/GradientASCII"

const MONO_FALLBACK = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"

const subscribeNoop = () => () => {}

function readMonoFont() {
  const family = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-mono")
    .trim()
  return family ? `${family}, ${MONO_FALLBACK}` : MONO_FALLBACK
}

const RUN_CLASS =
  "inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-400 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-indigo-300"

function Line({
  children,
  delay,
  className,
}: {
  children: React.ReactNode
  delay: number
  className?: string
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={"block " + (className ?? "")}
    >
      {children}
    </motion.span>
  )
}

export function CinematicHero() {
  const fontFamily = React.useSyncExternalStore(
    subscribeNoop,
    readMonoFont,
    () => MONO_FALLBACK
  )

  return (
    <section className="relative isolate overflow-hidden bg-black px-4 pb-40 pt-32 sm:px-6 sm:pt-36 md:pb-56 md:pt-44 lg:px-8">
      {/* React Bits GradientASCII background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-45 [mask-image:linear-gradient(to_bottom,black_70%,transparent)] md:opacity-100"
      >
        <GradientASCII
          colors={["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"]}
          shape="horizon"
          characters=" =+xX0S8#@"
          cellSize={16}
          density={0.8}
          glyphOpacity={0.7}
          gradientOpacity={0.6}
          fontFamily={fontFamily}
        />
      </div>

      <MotionConfig reducedMotion="user">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center text-center">
          <h1 className="text-balance text-[2.6rem] font-medium leading-[1] tracking-[-0.045em] sm:text-7xl lg:text-[6.25rem]">
            <Line delay={0.1} className="text-white">
              Describe the task.
            </Line>
            <Line delay={0.28} className="text-zinc-400 md:text-zinc-500">
              Watch a real browser do it.
            </Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg"
          >
            AutoBrowse turns plain English into live browser automations —
            logins, searches and scrapes, with the results handed back to you.
          </motion.p>

          {/* prompt box: the CTA */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 w-full max-w-2xl"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/70 p-2 pl-5 text-left backdrop-blur-md">
              <span className="font-mono text-sm text-indigo-300" aria-hidden>
                &gt;
              </span>
              <p className="min-w-0 flex-1 truncate text-sm text-zinc-200 sm:text-base">
                Open Hacker News and collect the top 10 titles with points
                <span
                  aria-hidden
                  className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-zinc-300 motion-reduce:animate-none"
                />
              </p>
              <Show when="signed-out">
                <SignUpButton>
                  <button type="button" className={RUN_CLASS}>
                    <Play className="size-3.5 fill-current" aria-hidden />
                    Run it free
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/workflows" className={RUN_CLASS}>
                  Go to Workflows
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Show>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              Free to start · No credit card required
            </p>
          </motion.div>
        </div>
      </MotionConfig>
    </section>
  )
}
