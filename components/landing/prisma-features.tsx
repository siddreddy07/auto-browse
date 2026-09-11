"use client"

import Link from "next/link"
import { motion, MotionConfig } from "motion/react"
import {
  ArrowRight,
  CalendarClock,
  Check,
  FileJson,
  MousePointerClick,
  Terminal,
} from "lucide-react"

import { WordsPullUp } from "@/components/landing/motion-text"

const terminalLines = [
  { text: "> open https://shop.example.com", status: "done" },
  { text: "> act \"click 'Add to cart'\"", status: "done" },
  { text: "> extract product prices", status: "running" },
  { text: "> observe pagination state", status: "waiting" },
] as const

function LivePanel() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-zinc-950 ring-1 ring-zinc-800">
            <Terminal className="size-4 text-indigo-400" aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white">
              Watch it work, live
            </h3>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
              console · live session
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-emerald-500">
          <span className="size-1 animate-pulse rounded-full bg-emerald-500 motion-reduce:hidden" />
          LIVE
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">
            Every step of your workflow runs in a real browser session you can
            follow in real time. No black boxes, no mystery.
          </p>
          <ul className="mt-6 space-y-3.5">
            {[
              "A real Chromium session you can watch",
              "Step-by-step logs as your workflow runs",
              "Live screenshots at every stage",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-emerald-500"
                  strokeWidth={3}
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs">
          <p className="pb-2.5 text-[11px] uppercase tracking-[0.18em] text-zinc-600">
            step log
          </p>
          <div className="space-y-2.5 border-t border-zinc-900 pt-3">
            {terminalLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-center gap-2"
              >
                {line.status === "done" ? (
                  <Check
                    className="size-3.5 shrink-0 text-emerald-500"
                    strokeWidth={3}
                    aria-hidden
                  />
                ) : line.status === "running" ? (
                  <span className="relative flex size-3.5 shrink-0 items-center justify-center">
                    <span className="absolute size-3.5 animate-ping rounded-full bg-indigo-500/40 motion-reduce:hidden" />
                    <span className="size-1.5 rounded-full bg-indigo-400" />
                  </span>
                ) : (
                  <span className="size-1.5 shrink-0 rounded-full bg-zinc-600" />
                )}
                <span
                  className={
                    line.status === "waiting" ? "text-zinc-600" : "text-zinc-300"
                  }
                >
                  {line.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: FileJson,
    title: "Extract structured data",
    description:
      "Pull prices, listings, and records into clean JSON you can pipe anywhere.",
    learnMore: "Explore extraction",
    spec: (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-zinc-500">
        <span className="text-zinc-400">{"{ "}</span>
        <span className="text-indigo-400">&quot;title&quot;</span>
        <span className="text-zinc-400">: &quot;iPhone 15&quot; </span>
        <span className="text-zinc-400">{"}"}</span>
      </div>
    ),
  },
  {
    icon: MousePointerClick,
    title: "Act on any site",
    description:
      "Click buttons, fill forms, and complete flows across the web — reliably.",
    learnMore: "See the actions",
    spec: (
      <div className="flex flex-wrap gap-1.5">
        {["Click", "Type", "Select", "Scroll"].map((action) => (
          <span
            key={action}
            className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-zinc-500"
          >
            {action}
          </span>
        ))}
      </div>
    ),
  },
  {
    icon: CalendarClock,
    title: "Run on a schedule",
    description:
      "Trigger workflows on a timer, a webhook, or whenever your data changes.",
    learnMore: "Automate your runs",
    spec: (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5">
        <span className="font-mono text-[11px] text-zinc-500">
          cron: every 6 hours
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden />
      </div>
    ),
  },
]

export function PrismaFeatures() {
  return (
    <section
      id="features"
      className="scroll-mt-24 bg-zinc-950 px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-24"
    >
      <MotionConfig reducedMotion="user">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-indigo-400">
                <span className="text-zinc-600" aria-hidden>
                  01
                </span>
                Features
              </p>
              <WordsPullUp
                as="h2"
                text="Everything a browser can do. Now on autopilot."
                className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl"
              />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-500 md:pb-1">
              Compose workflow steps by describing them in plain English — then
              watch a real browser carry them out.
            </p>
          </div>
          <div className="mt-8 border-t border-zinc-900" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-10 lg:mt-14"
          >
            <LivePanel />
          </motion.div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-950 ring-1 ring-zinc-800">
                    <feature.icon
                      className="size-5 text-indigo-400"
                      aria-hidden
                    />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600" aria-hidden>
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
                <div className="mt-auto pt-5">{feature.spec}</div>
                <Link
                  href="#"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors group-hover:text-indigo-400"
                >
                  {feature.learnMore}
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}