import Link from "next/link"
import { ArrowRight, CalendarClock, Check } from "lucide-react"

import { Reveal } from "@/components/landing/reveal"
import { MobileTabs } from "@/components/landing/mobile-tabs"

function Pill({
  children,
  tone = "plain",
}: {
  children: React.ReactNode
  tone?: "plain" | "accent"
}) {
  return (
    <span
      className={
        tone === "accent"
          ? "rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
          : "rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm"
      }
    >
      {children}
    </span>
  )
}

function Bubble({
  who,
  children,
}: {
  who: "user" | "bot"
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        {who === "bot" ? (
          <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-900 text-[10px] font-semibold text-white">
            AB
          </span>
        ) : (
          <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-100 text-[10px] font-semibold text-zinc-600">
            YOU
          </span>
        )}
        <span className="text-xs font-semibold text-zinc-900">
          {who === "bot" ? "AutoBrowse" : "You"}
        </span>
      </div>
      <div className="mt-3 text-sm leading-snug text-zinc-700">{children}</div>
    </div>
  )
}

function CardShell({
  index,
  title,
  body,
  dark,
  children,
}: {
  index: string
  title: string
  body: string
  dark?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={
        "flex h-full flex-col rounded-3xl p-5 sm:p-7 " +
        (dark ? "bg-[#111113] text-white" : "bg-white text-zinc-900")
      }
    >
      <p
        className={
          "font-mono text-[11px] tracking-[0.2em] uppercase " +
          (dark ? "text-zinc-500" : "text-zinc-400")
        }
      >
        {index}
      </p>
      <h3 className="mt-3 text-xl font-medium tracking-tight">{title}</h3>
      <p
        className={
          "mt-2 max-w-xs text-sm leading-relaxed " +
          (dark ? "text-zinc-400" : "text-zinc-500")
        }
      >
        {body}
      </p>
      <div className="mt-5 flex-1 sm:mt-7">{children}</div>
    </div>
  )
}

export function FeatureCards() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 px-4 pt-12 pb-6 sm:px-6 md:pt-24 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-indigo-600 uppercase">
              02 &nbsp;How it works
            </p>
            <h2 className="mt-4 max-w-2xl text-[2rem] leading-[1.05] font-medium tracking-[-0.03em] text-balance text-zinc-900 sm:text-6xl">
              From a sentence to a running automation.
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="text-sm leading-relaxed text-zinc-500">
              Describe, run, watch, and automate. That&rsquo;s the whole loop —
              no code required.
            </p>
            <Link
              href="/workflows"
              className="group mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Start building
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-7 md:mt-12" delay={0.08}>
          <MobileTabs
            bp="lg"
            labels={["Create", "Run", "Automate"]}
            gridClassName="mx-auto max-w-2xl lg:max-w-none lg:grid-cols-3"
            panels={[
              <CardShell
                key="create"
                index="01 · Create"
                title="Compose your workflow"
                body="Start from a template or a blank canvas, then add steps in plain language."
              >
                <div className="flex flex-wrap gap-2">
                  <Pill tone="accent">Open</Pill>
                  <Pill>Act</Pill>
                  <Pill>Extract</Pill>
                  <Pill>Observe</Pill>
                  <Pill>Agent</Pill>
                </div>
                <div className="mt-5">
                  <Bubble who="user">
                    Open Hacker News, click &lsquo;top stories&rsquo; and
                    collect the first 10 titles with their points.
                  </Bubble>
                </div>
              </CardShell>,
              <CardShell
                key="run"
                dark
                index="02 · Run"
                title="Watch it run, live"
                body="Every step executes in a real Chromium session you can follow in real time."
              >
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    Daily competitor sweep · live
                  </p>
                  <dl className="mt-5 space-y-4">
                    {[
                      ["24", "Records captured"],
                      ["0", "Errors"],
                      ["1.8s", "Avg. step time"],
                    ].map(([value, label]) => (
                      <div key={label} className="flex items-baseline gap-4">
                        <dd className="w-20 text-4xl font-light tracking-tight">
                          {value}
                        </dd>
                        <dt className="text-xs text-zinc-400">{label}</dt>
                      </div>
                    ))}
                  </dl>
                </div>
              </CardShell>,
              <CardShell
                key="automate"
                index="03 · Automate"
                title="Put it on a schedule"
                body="Run on a schedule, share with your team, and scale it up."
              >
                <Bubble who="user">
                  Run this every weekday at 9:00 and send me the results.
                </Bubble>
                <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <p className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                    <CalendarClock
                      className="size-4 text-indigo-600"
                      aria-hidden
                    />
                    Scheduled · Mon–Fri 09:00
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                    <Check className="size-3.5 text-emerald-600" aria-hidden />
                    Results saved as structured JSON
                  </p>
                </div>
              </CardShell>,
            ]}
          />
        </Reveal>
      </div>
    </section>
  )
}
