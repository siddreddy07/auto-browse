import Image from "next/image"
import Link from "next/link"
import { Check, Rocket, Sparkles, X } from "lucide-react"

import { MobileTabs } from "@/components/landing/mobile-tabs"

type Feature = { label: string; included: boolean }

function PlanCard({
  icon: Icon,
  name,
  blurb,
  price,
  features,
  cta,
  href,
  recommended,
}: {
  icon: React.ComponentType<{ className?: string }>
  name: string
  blurb: string
  price: string
  features: Feature[]
  cta: string
  href: string
  recommended?: boolean
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#07090f] p-6 sm:p-7">
      <div className="flex items-start justify-between">
        <Icon className="size-7 text-zinc-200" aria-hidden />
        {recommended ? (
          <span className="rounded-full bg-indigo-300 px-3 py-1 text-xs font-semibold text-black">
            Recommended
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{name}</h3>
      <p className="mt-2 min-h-11 text-sm leading-relaxed text-zinc-400">
        {blurb}
      </p>
      <p className="mt-6 flex items-baseline gap-2 border-b border-white/10 pb-6">
        <span className="text-5xl font-medium tracking-tight text-white">
          {price}
        </span>
        <span className="text-sm text-zinc-400">/ per month</span>
      </p>
      <ul className="mt-6 flex-1 space-y-3.5">
        {features.map((f) => (
          <li
            key={f.label}
            className={
              "flex items-center gap-3 text-sm " +
              (f.included ? "text-zinc-300" : "text-zinc-600")
            }
          >
            {f.included ? (
              <Check className="size-4 shrink-0" aria-hidden />
            ) : (
              <X className="size-4 shrink-0" aria-hidden />
            )}
            {f.label}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-zinc-200 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white"
      >
        {cta}
      </Link>
    </div>
  )
}

export function PricingCards() {
  return (
    <MobileTabs
      bp="md"
      tone="dark"
      labels={["Free", "Pro"]}
      leadingClassName="hidden lg:block"
      gridClassName="md:grid-cols-2 md:gap-4 lg:grid-cols-3"
      leading={
        <div className="relative isolate flex h-full min-h-[400px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-3">
          <Image
            src="/assets/moonlit.png"
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="-z-10 object-cover object-[75%_20%]"
          />
          <div className="rounded-xl bg-black/85 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/logo.png"
                alt="AutoBrowse"
                width={2052}
                height={400}
                className="h-5 w-auto"
              />
              <span className="rounded-full bg-indigo-300 px-2 py-0.5 text-[10px] font-bold text-black">
                FREE
              </span>
            </div>
            <p className="mt-4 text-lg leading-snug font-medium text-white">
              Start on the free tier — <b>no credit card</b> needed.
            </p>
            <Link
              href="/sign-up"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-zinc-200 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white"
            >
              Create account
            </Link>
            <p className="mt-3 text-center text-xs text-zinc-500">
              Cancel anytime
            </p>
          </div>
        </div>
      }
      panels={[
        <PlanCard
          key="free"
          icon={Rocket}
          name="Free"
          blurb="Everything you need to build and run your first automations."
          price="$0"
          cta="Get started"
          href="/sign-up"
          features={[
            { label: "Visual workflow canvas", included: true },
            { label: "Open, act, extract & observe", included: true },
            { label: "Live cloud browser sessions", included: true },
            { label: "Premium Agent nodes", included: false },
            { label: "Session replays", included: false },
          ]}
        />,
        <PlanCard
          key="pro"
          recommended
          icon={Sparkles}
          name="Pro"
          blurb="For teams that need agents and replays on every run."
          price="$10"
          cta="Upgrade to Pro"
          href="/pricing"
          features={[
            { label: "Everything in Free", included: true },
            { label: "Premium Agent nodes", included: true },
            { label: "Session replays", included: true },
            { label: "Team collaboration", included: true },
            { label: "Organization billing", included: true },
          ]}
        />,
      ]}
    />
  )
}
