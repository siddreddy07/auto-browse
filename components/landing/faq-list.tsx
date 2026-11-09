"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"

export function FaqList({
  items,
}: {
  items: { question: string; answer: string }[]
}) {
  const [open, setOpen] = React.useState<number | null>(0)

  return (
    <ul className="border-t border-white/15">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <li key={item.question} className="border-b border-white/15">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span
                className={cn(
                  "text-sm transition-colors sm:text-base",
                  isOpen
                    ? "text-white"
                    : "text-zinc-500 group-hover:text-zinc-200"
                )}
              >
                {item.question}
              </span>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-white">
                <Plus
                  className={cn(
                    "size-4 transition-transform duration-300",
                    isOpen && "rotate-45"
                  )}
                  aria-hidden
                />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                isOpen
                  ? "grid-rows-[1fr] pb-5 opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <p className="overflow-hidden pr-12 text-sm leading-relaxed text-zinc-400">
                {item.answer}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
