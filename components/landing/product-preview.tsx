"use client"

import { motion, MotionConfig } from "motion/react"
import { Check, Play } from "lucide-react"

import { cn } from "@/lib/utils"

const nodes = [
  { label: "Open", detail: "news.ycombinator.com", status: "done" as const },
  {
    label: "Act",
    detail: "Click \u2018top stories\u2019",
    status: "done" as const,
  },
  {
    label: "Extract",
    detail: "Collect top 10 titles + points",
    status: "running" as const,
  },
  {
    label: "Observe",
    detail: "Watch for pagination changes",
    status: "waiting" as const,
  },
]

function StatusDot({ status }: { status: (typeof nodes)[number]["status"] }) {
  if (status === "done")
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600">
        <Check className="size-3 text-white" strokeWidth={3} aria-hidden />
      </span>
    )
  if (status === "running")
    return (
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <span className="absolute size-5 animate-ping rounded-full bg-indigo-500/40 motion-reduce:hidden" />
        <span className="flex size-5 items-center justify-center rounded-full bg-indigo-500">
          <Play className="relative ml-0.5 size-2.5 text-white" aria-hidden />
        </span>
      </span>
    )
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-800">
      <span className="size-1.5 rounded-full bg-zinc-500" />
    </span>
  )
}

function WorkflowPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-zinc-700" />
        <span className="size-2.5 rounded-full bg-zinc-700" />
        <span className="size-2.5 rounded-full bg-zinc-700" />
        <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-zinc-950 px-3 py-1 text-center font-mono text-xs text-zinc-500">
          autobrowse.app/workflows/daily-sweep
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white">
              Daily competitor sweep
            </h4>
            <p className="mt-0.5 font-mono text-[11px] text-zinc-500">
              Auto-extract competitor pricing daily
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 font-mono text-[11px] text-indigo-400">
            <span className="size-1 animate-pulse rounded-full bg-indigo-400 motion-reduce:hidden" />
            RUNNING
          </span>
        </div>

        <div className="mt-5">
          {nodes.map((node, i) => (
            <div key={node.label} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center">
                <StatusDot status={node.status} />
                {i < nodes.length - 1 && (
                  <div
                    className={cn(
                      "my-1 w-px flex-1",
                      node.status === "done" ? "bg-emerald-600/40" : "bg-zinc-800"
                    )}
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-2 pb-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                  0{i + 1}
                </span>
                <span className="shrink-0 text-xs font-semibold text-white">
                  {node.label}
                </span>
                <span className="truncate text-xs text-zinc-500">
                  {node.detail}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5">
          <span className="flex items-center gap-2 text-xs font-medium text-emerald-500">
            <Check className="size-3.5" strokeWidth={3} aria-hidden />
            24 records captured
          </span>
          <span className="font-mono text-[11px] text-zinc-500">
            0 errors · live on Stagehand
          </span>
        </div>
      </div>
    </div>
  )
}

export function ProductPreview() {
  return (
    <section className="bg-zinc-950 px-4 pb-12 sm:px-6 md:pb-16 lg:px-8 lg:pb-24">
      <MotionConfig reducedMotion="user">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
              Product preview
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Your workflow, running live
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Every step executes in a real browser session you can follow in
              real time — no black boxes.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-10 w-full max-w-3xl"
          >
            <WorkflowPreview />
          </motion.div>
        </div>
      </MotionConfig>
    </section>
  )
}