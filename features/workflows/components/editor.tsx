"use client"

import { useEffect, useState } from "react"
import { useStore, useReactFlow } from "@xyflow/react"
import { ChevronDown, Check, Eye } from "lucide-react"
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
import { useNodeConnections, type NodeConnection } from "../hooks/use-node-connections"

const modelCategories: Record<string, string[]> = {
  Groq: ["llama-3.3-70b-versatile"],
  Google: ["gemini-3.1-flash-lite"],
}

function ModelSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring text-left">
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

  useEffect(() => {
    if (node) console.log("selected node:", node)
  }, [node])

  useEffect(() => {
    if (ancestors.length > 0) console.log("previous nodes:", ancestors)
  }, [ancestors])

  if (!node) {
    return (
      <div className="text-sm text-muted-foreground">
        Select a node to edit
      </div>
    )
  }

  const def = nodeDefinitions.find((d) => d.type === (node.data.type || (node.data as any).definition?.type))

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
          <span className="text-sm font-medium">{String((node.data as any).displayLabel || def.label)}</span>
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
              {field.required && <span className="ml-0.5 text-destructive">*</span>}
            </label>
            <ModelSelect
              value={String(node.data[field.key] ?? "")}
              onChange={(v) => updateNodeData(node.id, { [field.key]: v })}
            />
          </div>
        ) : field.multiline ? (
          <div key={field.key} className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {field.label}
                {field.required && <span className="ml-0.5 text-destructive">*</span>}
              </label>
              {!!node.data[field.key] && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="xs" className="h-5 gap-1 px-1 text-[10px] text-muted-foreground" title="View in Markdown">
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
                      <MarkdownViewer content={String(node.data[field.key] ?? "")} />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <textarea
              className="min-h-28 w-full resize-y rounded-md border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring"
              placeholder={field.placeholder}
              value={String(node.data[field.key] ?? "")}
              onChange={(e) => updateNodeData(node.id, { [field.key]: e.target.value })}
            />
          </div>
        ) : (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {field.label}
              {field.required && <span className="ml-0.5 text-destructive">*</span>}
            </label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring"
              placeholder={field.placeholder}
              value={String(node.data[field.key] ?? "")}
              onChange={(e) => updateNodeData(node.id, { [field.key]: e.target.value })}
            />
          </div>
        )
      )}

      <ConnectionList ancestors={ancestors} />
    </div>
  )
}

function ConnectionCard({ connection }: { connection: NodeConnection }) {
  const [open, setOpen] = useState(true)
  const { label, accent, icon: Icon, output } = connection

  return (
    <div className="rounded-md border bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center gap-1.5 px-2 py-1.5"
      >
        <span
          className="flex size-4 shrink-0 items-center justify-center rounded"
          style={{ backgroundColor: accent + "20", color: accent }}
        >
          <Icon className="size-2.5" />
        </span>
        <span className="truncate text-[11px] font-medium">{label}</span>
        <ChevronDown
          className={`ml-auto size-3 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="space-y-2 border-t px-2 py-1.5">
          <div>
            <span className="text-[10px] font-medium text-muted-foreground">Outputs</span>
            {output.length > 0 ? (
              <div className="mt-1 flex flex-col gap-1">
                {output.map((out) => (
                  <span
                    key={out.path}
                    className="inline-flex max-w-full items-center gap-1 truncate rounded border bg-muted/50 px-1.5 py-0.5 text-[10px]"
                    title={`${label} -> ${out.path}`}
                  >
                    <span className="truncate text-muted-foreground">{out.label}</span>
                    <code className="truncate text-[9px] text-muted-foreground">{out.path}</code>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[10px] text-muted-foreground">No outputs</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ConnectionList({
  ancestors,
}: {
  ancestors: ReturnType<typeof useNodeConnections>["ancestors"]
}) {
  if (ancestors.length === 0) {
    return (
      <div className="border-t pt-3">
        <span className="text-xs font-medium text-muted-foreground">Connections</span>
        <p className="mt-1 text-[10px] text-muted-foreground">No connected nodes</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 border-t pt-3">
      <span className="text-xs font-medium text-muted-foreground">Connections</span>
      {ancestors.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-medium text-muted-foreground">Previous</span>
          <div className="space-y-1.5">
            {ancestors.map((c) => (
              <ConnectionCard key={c.id} connection={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
