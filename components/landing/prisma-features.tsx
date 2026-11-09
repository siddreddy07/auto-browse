import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"

import { MobileTabs } from "@/components/landing/mobile-tabs"
import { Reveal } from "@/components/landing/reveal"

/* -------------------------------------------------------------------------- */
/*  Choose your autopilot                                                     */
/* -------------------------------------------------------------------------- */

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-zinc-300">
      <Plus
        className="mt-0.5 size-3.5 shrink-0 text-indigo-300"
        strokeWidth={3}
        aria-hidden
      />
      {children}
    </li>
  )
}

function MiniSteps() {
  const rows = ["open", "act", "extract"]
  return (
    <div
      aria-hidden
      className="absolute -right-10 bottom-0 top-8 hidden w-56 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:block"
    >
      <div className="flex gap-1.5">
        <span className="size-2 rounded-full bg-zinc-700" />
        <span className="size-2 rounded-full bg-zinc-700" />
        <span className="size-2 rounded-full bg-zinc-700" />
      </div>
      <div className="mt-5 space-y-3 font-mono text-[11px] text-zinc-500">
        {rows.map((r) => (
          <div
            key={r}
            className="rounded-md border border-white/[0.07] bg-black/40 px-2.5 py-2"
          >
            <span className="text-indigo-300">{r}</span>
            <span className="ml-2 inline-block h-1.5 w-12 rounded-full bg-zinc-700 align-middle" />
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamArt() {
  const seats = ["A", "B", "C"]
  return (
    <div
      aria-hidden
      className="absolute -right-10 bottom-0 top-8 hidden w-56 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:block"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        shared workspace
      </p>
      <div className="mt-5 space-y-3">
        {seats.map((s, i) => (
          <div
            key={s}
            className="flex items-center gap-3 rounded-md border border-white/[0.07] bg-black/40 px-2.5 py-2"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-zinc-800 text-[10px] text-zinc-300">
              {s}
            </span>
            <span
              className="h-1.5 rounded-full bg-zinc-700"
              style={{ width: `${70 - i * 16}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const cardClass =
  "relative h-full overflow-hidden rounded-3xl bg-[#111113] p-6 sm:p-8 md:min-h-[320px] md:p-9"

function BuildersCard() {
  return (
    <div className={cardClass}>
      <h3 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
        For builders
      </h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-400 md:max-w-[16rem]">
        Turn the chores you repeat every week into one-click runs.
      </p>
      <ul className="mt-5 max-w-sm space-y-3 md:mt-6 md:max-w-[16rem]">
        <Bullet>Describe steps in plain language</Bullet>
        <Bullet>Watch each session live</Bullet>
        <Bullet>Replay any run, any time</Bullet>
      </ul>
      <Link
        href="/workflows"
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-200 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white md:mt-8"
      >
        Open the canvas
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
      <MiniSteps />
    </div>
  )
}

function TeamsCard() {
  return (
    <div className={cardClass}>
      <h3 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
        For teams
      </h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-400 md:max-w-[16rem]">
        One shared workspace for every automation your team runs.
      </p>
      <ul className="mt-5 max-w-sm space-y-3 md:mt-6 md:max-w-[16rem]">
        <Bullet>Co-edit workflows in real time</Bullet>
        <Bullet>Schedule runs and collect results</Bullet>
        <Bullet>Premium agents &amp; session replays</Bullet>
      </ul>
      <Link
        href="#pricing"
        className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 md:mt-8"
      >
        Compare plans
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
      <TeamArt />
    </div>
  )
}

export function PickPilot() {
  return (
    <section
      id="features"
      className="scroll-mt-24 px-4 pb-4 pt-12 sm:px-6 md:pt-24 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal className="text-center">
          <h2 className="text-[2rem] font-medium tracking-[-0.035em] text-zinc-900 sm:text-6xl">
            Choose your <span className="text-indigo-600">autopilot</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-500 sm:text-base">
            From a one-off errand to a nightly fleet — AutoBrowse scales with
            whoever is clicking.
          </p>
        </Reveal>

        <Reveal className="mt-7 md:mt-10" delay={0.08}>
          <MobileTabs
            bp="md"
            labels={["For builders", "For teams"]}
            panels={[<BuildersCard key="b" />, <TeamsCard key="t" />]}
            gridClassName="md:grid-cols-2 md:gap-4"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Agent board (flat)                                                        */
/* -------------------------------------------------------------------------- */

type Task = { title: string; meta: string; progress?: number }

const columns: { name: string; tone: string; tasks: Task[] }[] = [
  {
    name: "Queued",
    tone: "bg-zinc-600",
    tasks: [
      {
        title: "Collect pricing from 12 competitor pages",
        meta: "Mon 09:00 · daily",
      },
      {
        title: "Check 40 product listings for stock changes",
        meta: "Hourly",
      },
    ],
  },
  {
    name: "Running",
    tone: "bg-indigo-300",
    tasks: [
      {
        title: "Log in, export the invoice report, extract totals",
        meta: "Step 3 of 5 · live",
        progress: 3,
      },
    ],
  },
  {
    name: "Delivered",
    tone: "bg-emerald-400",
    tasks: [
      { title: "24 records captured · 0 errors", meta: "JSON · 2.1 KB" },
      { title: "Weekly lead enrichment", meta: "118 rows · CSV" },
    ],
  },
]

function BoardColumn({ col }: { col: (typeof columns)[number] }) {
  return (
    <div className="md:p-5">
      <p className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400 md:flex">
        <span className={`size-1.5 rounded-full ${col.tone}`} />
        {col.name}
        <span className="ml-auto font-mono text-zinc-600">
          {col.tasks.length}
        </span>
      </p>
      <div className="space-y-3 md:mt-4">
        {col.tasks.map((task) => (
          <div
            key={task.title}
            className="rounded-xl border border-white/10 bg-[#0b0b0d] p-4"
          >
            <p className="text-sm leading-snug text-white">{task.title}</p>
            {task.progress ? (
              <div className="mt-3 flex gap-1" aria-hidden>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={
                      "h-1 flex-1 rounded-full " +
                      (n <= task.progress! ? "bg-indigo-300" : "bg-zinc-800")
                    }
                  />
                ))}
              </div>
            ) : null}
            <p className="mt-3 font-mono text-[11px] text-zinc-500">
              {task.meta}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AgentBoard() {
  return (
    <section className="bg-black px-4 py-12 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
          <h2 className="max-w-2xl text-balance text-[2rem] font-medium leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl">
            Agents take the busywork.{" "}
            <span className="text-zinc-500">You keep the thinking.</span>
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
            Queue the repetitive clicks, hand them to an AutoBrowse agent, and
            come back to clean, structured results.
          </p>
        </Reveal>

        <Reveal className="mt-7 md:mt-12" delay={0.1}>
          <MobileTabs
            bp="md"
            tone="dark"
            labels={columns.map((c) => `${c.name} · ${c.tasks.length}`)}
            panels={columns.map((c) => (
              <BoardColumn key={c.name} col={c} />
            ))}
            gridClassName="md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10 md:overflow-hidden md:rounded-2xl md:border md:border-white/10"
          />
        </Reveal>
      </div>
    </section>
  )
}
