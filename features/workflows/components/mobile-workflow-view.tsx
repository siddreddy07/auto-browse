"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Copy, Mail, Monitor, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { nodeDefinitions } from "../nodes/node-registry"

export type MobileStep = {
  id: string
  type: string
  label?: string
  detail?: string
}

export function MobileWorkflowView({
  name,
  steps,
}: {
  name: string
  steps: MobileStep[]
}) {
  const [copied, setCopied] = useState(false)

  const url = () => window.location.href

  async function copy() {
    await navigator.clipboard.writeText(url())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${name} · Auto Browse`, url: url() })
        return
      } catch {
        return
      }
    }
    await copy()
  }

  function email() {
    const subject = encodeURIComponent(`Open "${name}" on desktop`)
    const body = encodeURIComponent(
      `Sign in on your computer and open this workflow:\n${url()}`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 pb-8">
      <Link
        href="/workflows"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" /> Workflows
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
        <p className="text-sm text-muted-foreground">
          {steps.length} {steps.length === 1 ? "step" : "steps"} · read-only on
          mobile
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-5">
        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Monitor className="size-5" />
        </div>
        <h2 className="text-base font-semibold">Build this on desktop</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The visual canvas, live cursors and session replays need room to
          breathe. Sign in on your computer to edit and run this workflow.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={share}>
            <Share2 className="size-4" /> Share
          </Button>
          <Button size="sm" onClick={email}>
            <Mail className="size-4" /> Email me
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Flow
        </h3>
        {steps.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No steps yet. Add some from your desktop.
          </p>
        ) : (
          <ol className="relative space-y-3">
            <span
              aria-hidden
              className="absolute top-4 bottom-4 left-[19px] w-px bg-border"
            />
            {steps.map((step, i) => {
              const def = nodeDefinitions.find((d) => d.type === step.type)
              if (!def) return null
              return (
                <li key={step.id} className="relative flex gap-3">
                  <div
                    className="z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border bg-card"
                    style={{ color: def.accent, backgroundColor: def.accent + "1a" }}
                  >
                    <def.icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1 rounded-xl border bg-card p-3">
                    <p className="text-[11px] text-muted-foreground">
                      Step {i + 1}
                    </p>
                    <p className="truncate text-sm font-medium">
                      {step.label || def.label}
                    </p>
                    {step.detail && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {step.detail}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </div>
  )
}
