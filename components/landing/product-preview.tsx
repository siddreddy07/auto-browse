"use client"

import * as React from "react"
import {
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react"
import { Check, Globe, Play } from "lucide-react"

import { cn } from "@/lib/utils"

const statements = [
  {
    lead: "Describe it.",
    body: "Type the task the way you'd tell a teammate. No selectors, no scripts.",
  },
  {
    lead: "Watch it run.",
    body: "A real Chromium session opens, clicks and reads — every step streamed live.",
  },
  {
    lead: "Keep the data.",
    body: "Structured results land in your history, ready to schedule, share or pipe anywhere.",
  },
]

const nodes = [
  { label: "Open", detail: "news.ycombinator.com" },
  { label: "Act", detail: "Click ‘top stories’" },
  { label: "Extract", detail: "Top 10 titles + points" },
  { label: "Observe", detail: "Watch for pagination" },
]

type NodeState = "done" | "running" | "waiting"

function Dot({ state }: { state: NodeState }) {
  if (state === "done")
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
        <Check className="size-3 text-black" strokeWidth={3.5} aria-hidden />
      </span>
    )
  if (state === "running")
    return (
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <span className="absolute size-5 animate-ping rounded-full bg-indigo-400/40 motion-reduce:hidden" />
        <span className="flex size-5 items-center justify-center rounded-full bg-indigo-400">
          <Play className="ml-0.5 size-2.5 text-black" aria-hidden />
        </span>
      </span>
    )
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-800">
      <span className="size-1.5 rounded-full bg-zinc-500" />
    </span>
  )
}

function WorkflowCard({ active }: { active: number }) {
  // active 0..2 maps to how many nodes are done
  const doneCount = active === 0 ? 0 : active === 1 ? 2 : 4
  const runningIndex = active === 0 ? 0 : active === 1 ? 2 : -1

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b10] ">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-3">
        <span className="size-2.5 rounded-full bg-zinc-700" />
        <span className="size-2.5 rounded-full bg-zinc-700" />
        <span className="size-2.5 rounded-full bg-zinc-700" />
        <span className="ml-3 flex min-w-0 flex-1 items-center gap-2 truncate rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-zinc-500">
          <Globe className="size-3 shrink-0" aria-hidden />
          autobrowse.app/workflows/daily-sweep
        </span>
      </div>

      <div className="p-4 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold text-white">
              Daily competitor sweep
            </h4>
            <p className="mt-1 font-mono text-[11px] text-zinc-500">
              Auto-extract competitor pricing daily
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors duration-500",
              active === 2
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-indigo-400/30 bg-indigo-500/10 text-indigo-300"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                active === 2
                  ? "bg-emerald-400"
                  : "animate-pulse bg-indigo-300 motion-reduce:animate-none"
              )}
            />
            {active === 2 ? "COMPLETE" : "RUNNING"}
          </span>
        </div>

        <div className="mt-7">
          {nodes.map((node, i) => {
            const state: NodeState =
              i < doneCount ? "done" : i === runningIndex ? "running" : "waiting"
            return (
              <div key={node.label} className="flex items-stretch gap-4">
                <div className="flex flex-col items-center">
                  <Dot state={state} />
                  {i < nodes.length - 1 && (
                    <div
                      className={cn(
                        "my-1 w-px flex-1 transition-colors duration-500",
                        state === "done" ? "bg-emerald-500/50" : "bg-zinc-800"
                      )}
                    />
                  )}
                </div>
                <div
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-3 pb-4 transition-opacity duration-500",
                    state === "waiting" && "opacity-40"
                  )}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                    0{i + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {node.label}
                  </span>
                  <span className="truncate text-sm text-zinc-500">
                    {node.detail}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
          <span
            className={cn(
              "flex items-center gap-2 text-xs font-medium transition-colors duration-500",
              active === 2 ? "text-emerald-400" : "text-zinc-500"
            )}
          >
            <Check className="size-3.5" strokeWidth={3} aria-hidden />
            {active === 2 ? "24 records captured" : "Capturing records…"}
          </span>
          <span className="font-mono text-[11px] text-zinc-600">
            0 errors · live on Stagehand
          </span>
        </div>
      </div>
    </div>
  )
}


export function ScrollStory() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  // Desktop: scroll drives the story. Below lg the section is compact and the
  // steps are chosen with tabs instead.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return
    const next = v < 0.34 ? 0 : v < 0.68 ? 1 : 2
    setActive((prev) => (prev === next ? prev : next))
  })

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className="relative lg:h-[200vh]">
        <div className="px-4 py-10 sm:px-6 lg:sticky lg:top-0 lg:flex lg:min-h-svh lg:items-center lg:px-8 lg:py-12">
          <div className="mx-auto grid w-full max-w-[1200px] items-center gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-20 [&>*]:min-w-0">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-indigo-600">
                One loop
              </p>
              <h2 className="mt-3 text-balance text-[1.9rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-zinc-900 sm:text-5xl lg:mt-4">
                Your browser, working while{" "}
                <span className="text-indigo-600">you don&rsquo;t.</span>
              </h2>

              {/* mobile + tablet: compact tabs instead of a long list */}
              <div className="mt-5 lg:hidden">
                <div
                  role="tablist"
                  className="grid grid-cols-3 gap-2"
                >
                  {statements.map((item, i) => (
                    <button
                      key={item.lead}
                      type="button"
                      role="tab"
                      aria-selected={active === i}
                      onClick={() => setActive(i)}
                      className={cn(
                        "rounded-full border px-2 py-2.5 text-[13px] font-medium transition-colors sm:text-sm",
                        active === i
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-300 text-zinc-600"
                      )}
                    >
                      {item.lead.replace(".", "")}
                    </button>
                  ))}
                </div>
                <p className="mt-4 min-h-[3.5rem] text-sm leading-relaxed text-zinc-500">
                  {statements[active].body}
                </p>
              </div>

              <ol className="mt-10 hidden space-y-6 lg:block">
                {statements.map((item, i) => (
                  <li
                    key={item.lead}
                    className={cn(
                      "transition-all duration-500",
                      i <= active
                        ? "opacity-100"
                        : "opacity-25 blur-[1.5px] motion-reduce:blur-none"
                    )}
                  >
                    <p className="flex items-baseline gap-3 text-2xl font-bold tracking-tight text-zinc-900">
                      <span className="font-mono text-xs font-normal text-indigo-600">
                        0{i + 1}
                      </span>
                      {item.lead}
                    </p>
                    <p className="mt-1.5 max-w-sm pl-8 text-sm leading-relaxed text-zinc-500">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <WorkflowCard active={active} />
            </motion.div>
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
