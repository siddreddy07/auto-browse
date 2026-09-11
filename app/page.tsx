import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { PricingTable } from "@clerk/nextjs"
import {
  ArrowRight,
  Briefcase,
  Code2,
  ExternalLink,
  Headset,
  Megaphone,
  Palette,
  User,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CinematicHero } from "@/components/landing/cinematic-hero"
import { CinematicNav } from "@/components/landing/cinematic-nav"
import {
  WordsPullUp,
  WordsPullUpMultiStyle,
} from "@/components/landing/motion-text"
import { ProductPreview } from "@/components/landing/product-preview"
import { PrismaFeatures } from "@/components/landing/prisma-features"

export const metadata: Metadata = {
  title: "AI Browser Automation Workflows",
  description:
    "Build and run AI-powered browser automation workflows on a visual canvas. Describe a task in plain English — AutoBrowse drives a real cloud browser through open, act, extract, and observe steps, live.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Browser Automation Workflows",
    description:
      "Compose open, act, extract, observe, and agent steps on a visual canvas — then run them live in a real cloud browser.",
    url: "/",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AutoBrowse",
  url: "https://auto-browse-seven.vercel.app",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Build and run AI-powered browser automation workflows on a visual canvas. Compose open, act, extract, observe, and agent steps, then run them live in a real cloud browser.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
}

const steps = [
  {
    title: "Create a workflow",
    description:
      "Start from a template or blank canvas and give your automation a name.",
  },
  {
    title: "Add steps",
    description:
      "Compose navigate, extract, and act steps in plain language — no code.",
  },
  {
    title: "Run it",
    description:
      "Watch Stagehand drive a real browser through every step, live.",
  },
  {
    title: "Automate it",
    description:
      "Run on a schedule, share with your team, and scale it up.",
  },
]

const useCases = [
  {
    icon: Palette,
    title: "Designers",
    description:
      "Automate repetitive UI checks, screenshot flows, and handoff tasks so you can focus on the actual design.",
  },
  {
    icon: Code2,
    title: "Developers",
    description:
      "Turn manual QA, API digging, and form-filling into nightly checks and scripts you can trust.",
  },
  {
    icon: Megaphone,
    title: "Content & Marketing",
    description:
      "Capture competitor pages and research before they disappear — then reuse it in seconds.",
  },
  {
    icon: Headset,
    title: "Sales & Support",
    description:
      "Enrich leads, auto-fill CRMs, and pull customer answers without switching tabs.",
  },
  {
    icon: Briefcase,
    title: "Founders & Operators",
    description:
      "Monitor competitors, run pricing sweeps, and keep investor notes in one visual history.",
  },
  {
    icon: User,
    title: "Personal use",
    description:
      "Handle bill pay, form filling, and data entry no one else wants to do — automatically.",
  },
]

const faqs = [
  {
    question: "What is AutoBrowse?",
    answer:
      "AutoBrowse is a browser automation platform. You describe a task in plain English and it drives a real browser through it — navigating, extracting data, filling forms, and reporting back — no code required.",
  },
  {
    question: "Do I need to write any code?",
    answer:
      "No. Workflows are composed from navigate, extract, and act steps written in natural language. If you do want to go further, results are structured so you can pipe them anywhere.",
  },
  {
    question: "Which sites does it work with?",
    answer:
      "Because AutoBrowse runs a real browser, it works with any site — including ones behind logins, payments, or JavaScript-heavy apps that plain scrapers can't handle.",
  },
  {
    question: "How is the browser automation powered?",
    answer:
      "Under the hood it uses Stagehand, an AI-driven browser automation framework, to plan and execute each step in a real Chromium session you can watch live.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Workflows and their results belong to you. Sessions run in isolated browser contexts and we never sell or share your data. You can delete anything at any time.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Start on the free tier with no credit card. Upgrade to a paid plan only when you're ready, and cancel whenever you like.",
  },
]

function SectionHeader({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-indigo-400">
          <span className="text-zinc-600" aria-hidden>
            {index}
          </span>
          {eyebrow}
        </p>
        <WordsPullUp
          as="h2"
          text={title}
          className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl"
        />
      </div>
      {description ? (
        <p className="max-w-sm text-sm leading-relaxed text-zinc-500 md:pb-1">
          {description}
        </p>
      ) : null}
    </div>
  )
}

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-zinc-950 px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHeader
          index="02"
          eyebrow="How it works"
          title="From idea to running in minutes."
          description="Four steps between you and an automation that works while you sleep."
        />
        <div className="mt-8 border-t border-zinc-900" />

        <div className="mt-10 flex flex-col lg:mt-14 lg:grid lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="mb-10 lg:mb-0 lg:sticky lg:top-32 lg:self-start">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
              No code required
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
              Describe, run, watch, and automate. That&rsquo;s the whole loop.
            </p>
            <Link
              href="/workflows"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Start building
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>

          <ol className="flex-1 space-y-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex items-stretch gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors duration-300 hover:border-zinc-700 sm:gap-6 sm:p-6"
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500 font-mono text-xs font-semibold text-white"
                  aria-hidden
                >
                  0{index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function UseCases() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-24 bg-zinc-950 px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-indigo-400">
              <span className="text-zinc-600" aria-hidden>
                03
              </span>
              Use cases
            </p>
            <WordsPullUpMultiStyle
              as="h2"
              className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl"
              segments={[
                { text: "One workflow. For" },
                { text: "everyone", className: "text-indigo-400" },
                { text: "who clicks." },
              ]}
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-500 md:pb-1">
            Built for the people who are tired of doing the repetitive clicks.
          </p>
        </div>
        <div className="mt-8 border-t border-zinc-900" />

        <div className="mt-10 grid gap-x-14 gap-y-0 sm:grid-cols-2 lg:mt-14">
          {useCases.map((item) => (
            <div
              key={item.title}
              className="group border-t border-zinc-900 py-6 transition-colors duration-300 last:border-b hover:border-zinc-700"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 ring-1 ring-zinc-800">
                  <item.icon
                    className="size-4 text-indigo-400"
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 bg-zinc-950 px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHeader
          index="04"
          eyebrow="Pricing"
          title="Simple pricing. Upgrade when you're ready."
          description="Start free, no credit card required. Pro unlocks premium Agent nodes and session replays for teams that need more."
        />
        <div className="mt-8 border-t border-zinc-900" />

        <div className="mt-10 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-10 sm:px-8 lg:mt-14 sm:py-14">
          <div className="dark">
            <PricingTable
              for="organization"
              highlightedPlan="pro"
              newSubscriptionRedirectUrl="/pricing"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 bg-zinc-950 px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-indigo-400">
              <span className="text-zinc-600" aria-hidden>
                05
              </span>
              FAQ
            </p>
            <WordsPullUp
              as="h2"
              text="Questions, answered."
              className="mt-4 max-w-md text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
              Everything you need to know before getting started. Can&rsquo;t
              find your answer here? We&rsquo;re one message away.
            </p>
            <Link
              href="https://github.com/siddreddy07/auto-browse"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              <ExternalLink
                className="size-4 text-indigo-400 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
              Open source on GitHub
            </Link>
          </div>

          <div className="mt-10 border-t border-zinc-900 lg:mt-0 lg:border-t-0">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={faq.question}
                  className="border-zinc-800"
                >
                  <AccordionTrigger className="gap-4 py-5 text-left text-sm font-semibold text-white sm:text-base">
                    <span className="shrink-0 font-mono text-xs text-zinc-600" aria-hidden>
                      0{index + 1}
                    </span>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pl-9 text-sm leading-relaxed text-zinc-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="bg-zinc-950 px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="flex flex-col gap-8 px-6 py-12 sm:px-10 md:flex-row md:items-center md:justify-between md:py-16 lg:px-14">
            <div className="max-w-lg">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-indigo-400">
                Final step
              </p>
              <h2 className="mt-4 text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl">
                Put your browser on{" "}
                <span className="text-indigo-400">autopilot today.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
                Create your first workflow in minutes. Free to start — no
                credit card required.
              </p>
            </div>

            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto">
              <Link
                href="/sign-up"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-7 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-400 sm:w-auto"
              >
                Start free
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <p className="text-center font-mono text-xs text-zinc-500 sm:text-left">
                Free to start · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const footerLinks = [
  { label: "Workflows", href: "/workflows" },
  { label: "Agents", href: "/agents" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Pricing", href: "/pricing" },
  { label: "Sign in", href: "/sign-in" },
  { label: "Sign up", href: "/sign-up" },
]

function SiteFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/auto_browse_fav-removebg-preview.png"
              alt="AutoBrowse logo"
              width={30}
              height={17}
              className="h-4 w-auto object-contain"
            />
            <span className="text-sm font-semibold tracking-tight text-white">
              AutoBrowse
            </span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-zinc-900 pt-6 text-xs text-zinc-500 sm:flex-row">
          <span>© 2026 AutoBrowse</span>
          <span className="flex items-center gap-1.5">
            Made with <span className="animate-heartbeat">❤️</span> by
            Siddharth
          </span>
          <span className="font-mono">Powered by Stagehand</span>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CinematicNav />
      <main id="main" className="flex flex-1 flex-col">
        <CinematicHero />
        <ProductPreview />
        <PrismaFeatures />
        <HowItWorks />
        <UseCases />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}