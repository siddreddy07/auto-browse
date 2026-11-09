import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  Briefcase,
  Code2,
  Headset,
  Megaphone,
  Palette,
  User,
} from "lucide-react"

import { CinematicHero } from "@/components/landing/cinematic-hero"
import { CinematicNav } from "@/components/landing/cinematic-nav"
import { Reveal } from "@/components/landing/reveal"
import { ScrollStory } from "@/components/landing/product-preview"
import { AgentBoard, PickPilot } from "@/components/landing/prisma-features"
import { FeatureCards } from "@/components/landing/feature-cards"
import { PricingCards } from "@/components/landing/pricing-cards"
import { FaqList } from "@/components/landing/faq-list"

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
    siteName: "AutoBrowse",
    type: "website",
    images: [
      {
        url: "/assets/og.png",
        width: 1200,
        height: 630,
        alt: "AutoBrowse — AI browser automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Browser Automation Workflows",
    description:
      "Describe a task in plain English — AutoBrowse drives a real cloud browser through it, live.",
    images: ["/assets/og.png"],
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

function Eyebrow({
  index,
  children,
  dark,
}: {
  index: string
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <p
      className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] ${
        dark ? "text-indigo-300" : "text-indigo-600"
      }`}
    >
      <span className={dark ? "text-zinc-600" : "text-zinc-400"} aria-hidden>
        {index}
      </span>
      {children}
    </p>
  )
}

function UseCases() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-20 px-4 pb-12 pt-10 sm:px-6 md:pb-24 md:pt-20 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow index="03">Use cases</Eyebrow>
            <h2 className="mt-4 max-w-xl text-balance text-[1.75rem] font-medium leading-[1.08] tracking-[-0.03em] text-zinc-900 sm:text-5xl">
              One workflow. For{" "}
              <span className="text-indigo-600">everyone who clicks.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
            Built for the people tired of doing the repetitive clicks.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 lg:mt-10">
          {useCases.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08} className="h-full">
              <div className="group h-full rounded-2xl bg-white p-4 transition-colors duration-300 hover:bg-zinc-900 sm:rounded-3xl sm:p-6">
                <item.icon
                  className="size-5 text-indigo-600 transition-colors group-hover:text-indigo-300 sm:size-6"
                  aria-hidden
                />
                <h3 className="mt-3 text-sm font-medium tracking-tight text-zinc-900 transition-colors group-hover:text-white sm:mt-5 sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-1.5 line-clamp-4 text-xs leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400 sm:mt-2 sm:line-clamp-none sm:text-sm">
                  {item.description}
                </p>
              </div>
            </Reveal>
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
      className="scroll-mt-20 bg-black px-4 pb-12 pt-12 sm:px-6 md:pt-24 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal className="mb-6 flex md:mb-10 flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow index="04" dark>
              Pricing
            </Eyebrow>
            <h2 className="mt-4 max-w-2xl text-balance text-[2rem] font-medium leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl">
              Start free.{" "}
              <span className="text-zinc-500">
                Upgrade when you&rsquo;re ready.
              </span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
            Pro unlocks premium Agent nodes and session replays for teams that
            need more.
          </p>
        </Reveal>
        <PricingCards />
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 bg-black px-4 pb-12 pt-10 sm:px-6 md:pb-20 md:pt-24 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[2.6rem] font-light uppercase leading-[0.95] tracking-tight sm:text-8xl">
            <span className="block text-zinc-300">Answers</span>
            <span className="block text-zinc-600">start here</span>
          </h2>
          <p className="max-w-[16rem] text-sm font-light uppercase leading-relaxed tracking-wide text-zinc-500 md:text-right">
            The questions people ask most &mdash; made simple.
          </p>
        </Reveal>

        <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 md:mt-10 text-xs uppercase tracking-[0.18em] text-zinc-500">
          <span>FAQ</span>
          <span>Your question</span>
        </div>

        <div className="mt-4 grid gap-10 lg:mt-8 lg:grid-cols-2 lg:gap-24">
          <div className="hidden lg:block">
            <p className="text-3xl font-light uppercase leading-tight tracking-tight sm:text-4xl">
              <span className="block text-zinc-300">Not found?</span>
              <span className="block text-zinc-600">Still curious?</span>
            </p>
          </div>
          <FaqList items={faqs} />
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="bg-black px-4 pb-10 sm:px-6 md:pb-16 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-between gap-8 rounded-3xl bg-[#111113] px-6 py-9 md:flex-row md:items-center md:px-14 md:py-16">
        <div>
          <h2 className="max-w-xl text-balance text-[1.9rem] font-medium leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl">
            Put your browser on{" "}
            <span className="text-indigo-300">autopilot today.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
            Create your first workflow in minutes. Free to start — no credit
            card required.
          </p>
        </div>
        <Link
          href="/sign-up"
          className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-zinc-200 px-7 md:w-auto py-3.5 text-sm font-medium text-black transition-colors hover:bg-white"
        >
          Start free
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  )
}

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Workflows", href: "/workflows" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Sign up", href: "/sign-up" },
    ],
  },
  {
    title: "Built with",
    links: [
      { label: "Stagehand", href: "https://www.stagehand.dev" },
      { label: "Browserbase", href: "https://www.browserbase.com" },
      { label: "Trigger.dev", href: "https://trigger.dev" },
    ],
  },
]

function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black">
      <div className="mx-auto grid w-full max-w-[1200px] gap-7 px-4 pb-6 pt-9 sm:px-6 md:grid-cols-[1.3fr_2fr] md:gap-10 md:pb-8 md:pt-12 lg:px-8">
        <div>
          <Image
            src="/assets/logo.png"
            alt="AutoBrowse"
            width={2052}
            height={400}
            className="h-7 w-auto"
          />
          <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-zinc-500">
            Describe it in plain English. A real browser does the rest.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-3 gap-6 text-sm"
        >
          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="font-medium text-white">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-500 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-2 border-t border-white/10 px-4 py-5 text-xs text-zinc-600 sm:flex-row sm:px-6 lg:px-8">
        <span>© 2026 AutoBrowse</span>
        <span className="flex items-center gap-1.5">
          Made with <span className="animate-heartbeat">❤️</span> by Siddharth
        </span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none hidden h-[8.5vw] select-none overflow-hidden md:block"
      >
        <p className="text-center text-[16vw] font-semibold leading-[0.85] tracking-[-0.05em] text-zinc-900">
          AutoBrowse
        </p>
      </div>
    </footer>
  )
}

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-1.5 rounded-[2rem] bg-[#f4f4f1] text-zinc-900 sm:mx-3 md:rounded-[3rem]">
      {children}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CinematicNav />
      <main id="main" className="flex flex-1 flex-col">
        <CinematicHero />
        <div className="-mt-20 md:-mt-28">
          <Sheet>
            <PickPilot />
            <ScrollStory />
          </Sheet>
        </div>
        <AgentBoard />
        <Sheet>
          <FeatureCards />
          <UseCases />
        </Sheet>
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
