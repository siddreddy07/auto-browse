import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { PricingTable } from "@clerk/nextjs"
import {
  ArrowRight,
  Briefcase,
  Code2,
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
      "Start from a template or a blank canvas and give your automation a name.",
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
      "Capture competitor pages, screenshots, and research before they disappear — then reuse it in seconds.",
  },
  {
    icon: Headset,
    title: "Sales & Support",
    description:
      "Enrich leads, auto-fill CRMs, and pull customer answers without switching tabs or digging through history.",
  },
  {
    icon: Briefcase,
    title: "Founders & Operators",
    description:
      "Monitor competitors, run pricing sweeps, and keep investor notes in one searchable, visual history.",
  },
  {
    icon: User,
    title: "Personal use",
    description:
      "Handle bill pay, form filling, and data entry that no one else wants to do — automatically.",
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

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-white/10 bg-black py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <WordsPullUp
          as="h2"
          text="From idea to running in minutes."
          className="max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
        />
        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-start gap-3">
              <span className="text-5xl text-white/25" aria-hidden>
                0{index + 1}
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UseCases() {
  return (
    <section id="use-cases" className="scroll-mt-24 bg-black py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <WordsPullUpMultiStyle
          as="h2"
          className="max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
          segments={[
            { text: "One workflow. For" },
            { text: "everyone" },
            { text: "who clicks." },
          ]}
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl bg-card-ink p-6 transition-colors duration-300 hover:bg-[#2a2a2a]"
            >
              <div className="flex size-9 items-center justify-center rounded-full ring-1 ring-white/20">
                <item.icon className="size-4 text-white/70" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {item.description}
              </p>
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
      className="scroll-mt-24 border-t border-white/10 bg-black py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <WordsPullUp
          as="h2"
          text="Simple pricing. Upgrade when you're ready."
          className="max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
        />
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
          Start free, no credit card required. Pro unlocks premium Agent nodes
          and session replays for teams that need more.
        </p>
        <div className="mt-14 flex justify-center">
          <PricingTable
            for="organization"
            highlightedPlan="pro"
            newSubscriptionRedirectUrl="/pricing"
          />
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-white/10 bg-black py-24 sm:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <div className="flex flex-col items-start">
          <WordsPullUpMultiStyle
            as="h2"
            className="text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
            segments={[
              { text: "Questions," },
              { text: "answered." },
            ]}
          />
          <p className="mt-6 max-w-sm text-base leading-relaxed text-white/60">
            Everything you need to know before getting started with AutoBrowse.
            Can&rsquo;t find your answer here? We&rsquo;re one message away.
          </p>
          <div className="mt-10 w-full rounded-2xl bg-card-ink p-6 sm:max-w-sm">
            <p className="text-sm font-semibold text-white">Built in the open</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              AutoBrowse is open source — explore the code and contribute on
              GitHub.
            </p>
            <Link
              href="https://github.com/siddreddy07/auto-browse"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:opacity-70"
            >
              GitHub
              <ArrowRight
                className="size-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0"
                aria-hidden
              />
            </Link>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="border-white/10"
            >
              <AccordionTrigger className="py-5 text-left text-base font-medium text-white">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pr-6 text-white/60">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Workflows", href: "/workflows" },
      { label: "Agents", href: "/agents" },
      { label: "Marketplace", href: "/marketplace" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Sign up", href: "/sign-up" },
    ],
  },
]

function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.25fr_1fr_1fr_1fr] md:gap-8">
          <div className="max-w-xs space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold tracking-tight text-white"
            >
              <Image
                src="/assets/auto_browse_fav-removebg-preview.png"
                alt="AutoBrowse logo"
                width={30}
                height={17}
                className="h-4 w-auto object-contain"
              />
              AutoBrowse
            </Link>
            <p className="text-sm leading-relaxed text-white/50">
              Design multi-step automations that browse, extract, and act on
              the web — powered by Stagehand.
            </p>
          </div>
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                {column.title}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-white/50 sm:flex-row">
          <span>© 2026 AutoBrowse</span>
          <span className="flex items-center gap-1.5">
            Made with <span className="animate-heartbeat">❤️</span> by
            Siddharth
          </span>
          <span>Powered by Stagehand</span>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-black font-display">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CinematicNav />
      <main id="main" className="flex flex-1 flex-col scroll-mt-24">
        <CinematicHero />
        <div className="dark">
          <PrismaFeatures />
          <HowItWorks />
          <UseCases />
          <Pricing />
          <Faq />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
