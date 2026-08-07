"use client"

import { useEffect, useRef, useState } from "react"
import { useStore, useReactFlow } from "@xyflow/react"
import { ChevronDown, Check, Eye, Circle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MarkdownViewer } from "@/components/ui/markdown"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { nodeDefinitions } from "../nodes/node-registry"
import {
  useNodeConnections,
  type NodeConnection,
} from "../hooks/use-node-connections"

const modelCategories: Record<string, string[]> = {
  Groq: ["llama-3.3-70b-versatile"],
  Google: ["gemini-3.1-flash-lite"],
}

function ModelSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-left text-xs outline-none focus:ring-1 focus:ring-ring">
        {value || <span className="text-muted-foreground">Select model</span>}
        <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
        {Object.entries(modelCategories).map(([category, models], idx) => (
          <div key={category}>
            {idx > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel>{category}</DropdownMenuLabel>
            {models.map((model) => (
              <DropdownMenuItem key={model} onSelect={() => onChange(model)}>
                <span className="flex-1">{model}</span>
                {value === model && <Check className="size-3 shrink-0" />}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Editor() {
  const node = useStore((s) => s.nodes.find((n) => n.selected))
  const { updateNodeData } = useReactFlow()
  const { ancestors } = useNodeConnections(node?.id)
  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({})

  useEffect(() => {
    if (node) console.log("selected node:", node)
  }, [node])

  useEffect(() => {
    if (ancestors.length > 0) console.log("previous nodes:", ancestors)
  }, [ancestors])

  if (!node) {
    return (
      <div className="text-sm text-muted-foreground">Select a node to edit</div>
    )
  }

  const def = nodeDefinitions.find(
    (d) =>
      d.type ===
      (node.data.type ||
        (node.data as { definition?: { type?: string } }).definition?.type)
  )

  const insertToken = (fieldKey: string, token: string) => {
    const el = inputRefs.current[fieldKey]
    const current = String(node.data[fieldKey] ?? "")
    if (el) {
      const start = el.selectionStart ?? current.length
      const end = el.selectionEnd ?? current.length
      const next = current.slice(0, start) + token + current.slice(end)
      updateNodeData(node.id, { [fieldKey]: next })
      requestAnimationFrame(() => {
        el.focus()
        const pos = start + token.length
        el.setSelectionRange(pos, pos)
      })
    } else {
      updateNodeData(node.id, { [fieldKey]: current + token })
    }
  }

  const actionableAncestors = ancestors.filter(
    (c) => nodeDefinitions.find((d) => d.type === c.type)?.kind === "action"
  )

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
          <span className="text-sm font-medium">
            {String(node.data.displayLabel || def.label)}
          </span>
        </div>
      )}
      {def?.fields.length === 0 && (
        <div className="text-xs text-muted-foreground">No properties</div>
      )}
      {def?.fields.map((field) =>
        field.key === "model" ? (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {field.label}
              {field.required && (
                <span className="ml-0.5 text-destructive">*</span>
              )}
            </label>
            <ModelSelect
              value={String(node.data[field.key] ?? "")}
              onChange={(v) => updateNodeData(node.id, { [field.key]: v })}
            />
          </div>
        ) : (
          <div key={field.key} className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {field.label}
                {field.required && (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </label>
              {field.multiline && !!node.data[field.key] && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="h-5 gap-1 px-1 text-[10px] text-muted-foreground"
                      title="View in Markdown"
                    >
                      <Eye className="size-3" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{field.label}</DialogTitle>
                      <DialogDescription>Markdown preview</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto rounded-md border bg-muted/30 p-4">
                      <MarkdownViewer
                        content={String(node.data[field.key] ?? "")}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            {field.multiline ? (
              <textarea
                ref={(el) => {
                  inputRefs.current[field.key] = el
                }}
                className="min-h-28 w-full resize-y rounded-md border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring"
                placeholder={field.placeholder}
                value={String(node.data[field.key] ?? "")}
                onChange={(e) =>
                  updateNodeData(node.id, { [field.key]: e.target.value })
                }
              />
            ) : (
              <input
                ref={(el) => {
                  inputRefs.current[field.key] = el
                }}
                className="w-full rounded-md border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring"
                placeholder={field.placeholder}
                value={String(node.data[field.key] ?? "")}
                onChange={(e) =>
                  updateNodeData(node.id, { [field.key]: e.target.value })
                }
              />
            )}
            {field.references && actionableAncestors.length > 0 && (
              <ReferenceChips
                ancestors={actionableAncestors}
                onInsert={(token) => insertToken(field.key, token)}
              />
            )}
          </div>
        )
      )}
    </div>
  )
}

function ReferenceChips({
  ancestors,
  onInsert,
}: {
  ancestors: NodeConnection[]
  onInsert: (token: string) => void
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-1.5 rounded-md border bg-muted/30 p-1.5">
      <span className="text-[10px] font-medium text-muted-foreground">
        Reference a previous output
      </span>
      <div className="flex flex-wrap gap-1">
        {ancestors.map((c) => {
          const expanded = expandedId === c.id
          const Icon = c.icon ?? Circle
          return (
            <span key={c.id} className="flex flex-col items-stretch gap-0.5">
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : c.id)}
                className="flex cursor-pointer items-center gap-1 rounded-full border bg-card px-2 py-0.5 text-[10px] hover:bg-muted"
                title={
                  expanded ? "Collapse outputs" : `Insert ${c.label} outputs`
                }
              >
                <span
                  className="flex size-3 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: c.accent + "20", color: c.accent }}
                >
                  <Icon className="size-2" />
                </span>
                <span className="truncate">{c.label}</span>
                <ChevronDown
                  className={`size-2.5 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>
              {expanded && (
                <span className="flex flex-col gap-0.5 border-l pl-2">
                  {c.output.length > 0 ? (
                    c.output.map((out) => (
                      <button
                        key={out.path}
                        type="button"
                        onClick={() => onInsert(`{{${c.id}.${out.path}}}`)}
                        className="flex cursor-pointer items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-[9px] text-muted-foreground hover:bg-muted"
                        title={`Insert {{${c.id}.${out.path}}}`}
                      >
                        <span className="truncate">{out.label}</span>
                        <code className="truncate">{out.path}</code>
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => onInsert(`{{${c.id}}}`)}
                      className="cursor-pointer rounded border bg-background px-1.5 py-0.5 text-[9px] text-muted-foreground hover:bg-muted"
                    >
                      Insert node
                    </button>
                  )}
                </span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
