"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { nodeDefinitions } from "./nodes/node-registry"

export function StepNode({ data, selected }: NodeProps) {
  const definition = nodeDefinitions.find((n) => n.type === (data.type || (data.definition as any)?.type))
  if (!definition) return null
  const isStart = definition.type === "start"

  return (
    <div
      className={`w-[200px] rounded-md border bg-card shadow-sm ${
        selected ? "ring-2 ring-ring" : ""
      }`}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <div
          className="flex size-6 items-center justify-center rounded-md"
          style={{ backgroundColor: definition.accent + "20", color: definition.accent }}
        >
          <definition.icon className="size-4" />
        </div>
        <span className="truncate text-sm font-medium">{String(data.displayLabel || definition.label)}</span>
      </div>

      {definition.fields.length > 0 && (
        <div className="space-y-2 p-3">
          {definition.fields.map((field) => (
            <div key={field.key} className="space-y-1">
              <label className="truncate text-xs text-muted-foreground">{field.label}</label>
              <span className="block w-full truncate rounded-md border bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                {String(data[field.key] || field.placeholder || "")}
              </span>
            </div>
          ))}
        </div>
      )}

      {!isStart && (
        <Handle type="target" position={Position.Left} className="!h-4 !w-2 !rounded-sm !border-2 !border-background" />
      )}
      <Handle type="source" position={Position.Right} className="!h-4 !w-2 !rounded-sm !border-2 !border-background" />
    </div>
  )
}
