"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Check } from "lucide-react"

import { WordsPullUp } from "@/components/landing/motion-text"

const features = [
  {
    title: "Extract structured data",
    description:
      "Pull prices, listings, and records into clean JSON you can pipe anywhere.",
    learnMore: "Explore extraction",
  },
  {
    title: "Act on any site",
    description:
      "Click buttons, fill forms, and complete flows across the web — reliably.",
    learnMore: "See the actions",
  },
  {
    title: "Run on a schedule",
    description:
      "Trigger workflows on a timer, a webhook, or whenever your data changes.",
    learnMore: "Automate your runs",
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group relative flex flex-col justify-between rounded-2xl bg-card-ink p-6 transition-colors duration-300 hover:bg-[#2a2a2a]"
    >
      <div>
        <div className="flex size-8 items-center justify-center rounded-full bg-white">
          <Check className="size-4 text-black" strokeWidth={3} aria-hidden />
        </div>
        <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          {feature.description}
        </p>
      </div>
      <Link
        href="#"
        className="mt-6 flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-white"
      >
        {feature.learnMore}
        <ArrowRight
          className="size-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0"
          aria-hidden
        />
      </Link>
    </motion.div>
  )
}

export function PrismaFeatures() {
  return (
    <section id="features" className="relative scroll-mt-24 bg-black py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <WordsPullUp
          text="Everything a browser can do. Now on autopilot."
          className="max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex flex-col justify-end overflow-hidden rounded-2xl bg-ink p-6 lg:row-span-2 lg:p-8"
          >
            <div className="noise-overlay" aria-hidden />
            <h3 className="text-lg font-semibold tracking-tight text-white">
              Watch it work, live
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Every step of your workflow runs in a real browser session you
              can follow in real time. No black boxes, no mystery — full
              visibility into what your automation is doing.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                "A real Chromium session you can watch",
                "Step-by-step logs as your workflow runs",
                "Live screenshots at every stage",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/80"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-white">
                    <Check className="size-3 text-black" strokeWidth={3} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
