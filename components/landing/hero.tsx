"use client"

import * as React from "react"
import Link from "next/link"
import { motion, MotionConfig, type Variants } from "motion/react"
import { Show, SignUpButton } from "@clerk/nextjs"
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Play,
  ScanSearch,
  Send,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot } from "@/components/animate-ui/icons/bot"

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const steps = [
  {
    icon: Globe,
    title: "Navigate to the store",
    caption: "Open example.com/products",
  },
  {
    icon: ScanSearch,
    title: "Extract prices",
    caption: "Collect name, price, and stock",
  },
  {
    icon: Send,
    title: "Send the summary",
    caption: "Post the results to Slack",
  },
]

function WorkflowMock() {
  return (
    <div className="relative mx-auto w-full max-w-2xl text-start" aria-hidden>
      <div className="absolute -inset-x-8 -top-8 -bottom-8 -z-10 rounded-[3rem] bg-gradient-to-b from-foreground/10 via-foreground/[0.04] to-transparent blur-2xl" />
      <div className="rounded-2xl bg-background p-2 shadow-2xl shadow-black/10 ring-1 ring-foreground/10">
        <div className="flex items-center gap-1.5 px-2 pb-2">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <div className="ml-2 flex h-6 min-w-0 flex-1 items-center rounded-lg bg-muted px-2.5 text-xs text-muted-foreground">
            <Bot className="me-1.5 size-3.5 shrink-0" />
            <span className="truncate">autobrowse.app/workflows</span>
          </div>
          <div className="flex h-6 shrink-0 items-center gap-1 rounded-lg bg-foreground px-2 text-xs font-medium text-background">
            <Play className="size-3 fill-current" />
            Run
          </div>
        </div>
        <div className="rounded-lg bg-muted/60 p-1.5">
          <div className="flex flex-col gap-1.5">
            {steps.map((step, index) => (
              <React.Fragment key={step.title}>
                {index > 0 ? <div className="mx-auto h-3 w-px bg-border" /> : null}
                <div className="flex items-center gap-3 rounded-md bg-background p-2.5 ring-1 ring-foreground/5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                    <step.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{step.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {step.caption}
                    </p>
                  </div>
                  <CheckCircle2 className="size-4 shrink-0 text-muted-foreground/60" />
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between rounded-md bg-background px-2.5 py-2 ring-1 ring-foreground/5">
            <span className="text-xs text-muted-foreground">Completed in 12s</span>
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium">
              3 steps · 8 runs
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[30rem] [background-image:radial-gradient(circle,var(--color-border)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black_20%,transparent_75%)]" />
        <div className="absolute top-[-18rem] left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-foreground/[0.04] blur-3xl" />
      </div>

      <MotionConfig reducedMotion="user">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 pb-20 text-center sm:pt-32 sm:pb-24">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex max-w-3xl flex-col items-center gap-6"
          >
            <motion.div variants={item}>
              <Badge
                variant="outline"
                className="h-6 cursor-default gap-1.5 px-3 text-xs"
              >
                <span className="relative flex size-2" aria-hidden>
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                Now in beta · Powered by Stagehand
              </Badge>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-balance text-5xl leading-[1.02] font-semibold tracking-tighter sm:text-7xl"
            >
              Anything a browser can do.
              <span className="block bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                On autopilot.
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              Describe the task in plain English. AutoBrowse drives a real browser
              through logins, searches, checkouts, and scrapes — then hands you
              the results. No code required.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Show when="signed-out">
                <SignUpButton>
                  <Button size="lg" className="cursor-pointer">
                    Start building free
                  </Button>
                </SignUpButton>
                <Button size="lg" variant="outline" asChild className="cursor-pointer">
                  <Link href="#features">
                    See how it works
                    <ArrowRight />
                  </Link>
                </Button>
              </Show>
              <Show when="signed-in">
                <Button size="lg" asChild className="cursor-pointer">
                  <Link href="/workflows">
                    Go to Workflows
                    <ArrowRight />
                  </Link>
                </Button>
              </Show>
            </motion.div>

            <motion.div
              variants={item}
              className="flex flex-col items-center gap-1.5 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-0.5 text-foreground/80">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" aria-hidden />
                ))}
              </div>
              <p>Loved by early users · Free to start · No credit card required</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              className="w-full pt-8"
            >
              <WorkflowMock />
            </motion.div>
          </motion.div>
        </div>
      </MotionConfig>
    </section>
  )
}
