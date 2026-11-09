"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Small-screen pattern: a segmented control that shows ONE panel at a time
 * (no stacking, no horizontal scrolling). From the chosen breakpoint upwards
 * the control disappears and every panel is shown in a normal grid.
 */
const SHOW_ALL = {
  md: "md:block",
  lg: "lg:block",
} as const

const HIDE_CONTROL = {
  md: "md:hidden",
  lg: "lg:hidden",
} as const

const NO_MARGIN = {
  md: "md:mt-0",
  lg: "lg:mt-0",
} as const

const LEADING = {
  md: "hidden md:block",
  lg: "hidden lg:block",
} as const

export function MobileTabs({
  labels,
  panels,
  leading,
  leadingClassName,
  bp = "lg",
  tone = "light",
  gridClassName,
  className,
}: {
  labels: string[]
  panels: React.ReactNode[]
  /** Rendered only at the breakpoint and above (e.g. a decorative card). */
  leading?: React.ReactNode
  leadingClassName?: string
  bp?: "md" | "lg"
  tone?: "light" | "dark"
  gridClassName?: string
  className?: string
}) {
  const [active, setActive] = React.useState(0)
  const id = React.useId()
  const dark = tone === "dark"

  return (
    <div className={className}>
      <div
        role="tablist"
        className={cn(
          "grid gap-1 rounded-full p-1",
          dark ? "bg-white/[0.08]" : "bg-zinc-200/80",
          HIDE_CONTROL[bp]
        )}
        style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
      >
        {labels.map((label, i) => {
          const on = active === i
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(i)}
              className={cn(
                "relative rounded-full px-2 py-2.5 text-[13px] font-medium transition-colors sm:text-sm",
                on
                  ? dark
                    ? "text-black"
                    : "text-white"
                  : dark
                    ? "text-zinc-400"
                    : "text-zinc-600"
              )}
            >
              {on ? (
                <motion.span
                  layoutId={`${id}-pill`}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className={cn(
                    "absolute inset-0 rounded-full",
                    dark ? "bg-indigo-300" : "bg-zinc-900"
                  )}
                />
              ) : null}
              <span className="relative">{label}</span>
            </button>
          )
        })}
      </div>

      <div className={cn("mt-4 grid gap-4", NO_MARGIN[bp], gridClassName)}>
        {leading ? (
          <div className={leadingClassName ?? LEADING[bp]}>
            {leading}
          </div>
        ) : null}
        {panels.map((panel, i) => (
          <div
            key={labels[i]}
            role="tabpanel"
            className={cn(active === i ? "block" : "hidden", SHOW_ALL[bp])}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  )
}
