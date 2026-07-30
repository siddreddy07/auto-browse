"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { nodeDefinitions } from "../node-registry"
import type { Node as FlowNode } from "@xyflow/react"

const modelCategories: Record<string, string[]> = {
  Groq: ["llama-3.3-70b-versatile"],
  Google: ["gemini-3.1-flash-lite"],
}

function ModelSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [selected, setSelected] = useState(value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring text-left">
        {selected || <span className="text-muted-foreground">Select model</span>}
        <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
        {Object.entries(modelCategories).map(([category, models], idx) => (
          <div key={category}>
            {idx > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel>{category}</DropdownMenuLabel>
            {models.map((model) => (
              <DropdownMenuItem key={model} onSelect={() => { setSelected(model); onChange(model) }}>
                <span className="flex-1">{model}</span>
                {selected === model && <Check className="size-3 shrink-0" />}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Editor({ node }: { node?: FlowNode | null }) {
  if (!node) {
    return (
      <div className="text-sm text-muted-foreground">
        Select a node to edit
      </div>
    )
  }

  const def = nodeDefinitions.find((d) => d.type === (node.data.type || (node.data as any).definition?.type))
  const isLongText = (key: string) => ["body", "prompt"].includes(key)

  return (
    <div className="space-y-4 text-sm">
      {def && (
        <div className="flex items-center gap-2 border-b pb-3">
          <div
            className="flex size-6 items-center justify-center rounded-md"
            style={{ backgroundColor: def.accent + "20", color: def.accent }}
          >
            <def.icon className="size-4" />
          </div>
          <span className="text-sm font-medium">{def.label}</span>
        </div>
      )}
      {def?.fields.map((field) =>
        field.key === "model" ? (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
            <ModelSelect
              value={String(node.data[field.key] ?? "")}
              onChange={() => {}}
            />
          </div>
        ) : isLongText(field.key) ? (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
            <textarea
              className="min-h-[120px] w-full resize-y rounded-md border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring"
              placeholder={field.placeholder}
              defaultValue={String(node.data[field.key] ?? "")}
            />
          </div>
        ) : (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring"
              placeholder={field.placeholder}
              defaultValue={String(node.data[field.key] ?? "")}
            />
          </div>
        )
      )}
    </div>
  )
}
