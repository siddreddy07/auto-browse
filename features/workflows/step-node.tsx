"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { nodeDefinitions } from "./node-registry"

export function StepNode({ data, selected }: NodeProps) {
  const definition = nodeDefinitions.find((n) => n.type === (data.type || (data.definition as any)?.type))!
  const isStart = definition.type === "start"
  const isStop = definition.type === "stop"

  return (
    <div
      className={`min-w-[200px] rounded-md border bg-card shadow-sm ${
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
        <span className="text-sm font-medium">{definition.label}</span>
      </div>

      {definition.fields.length > 0 && (
        <div className="space-y-2 p-3">
          {definition.fields.map((field) => (
            <div key={field.key} className="space-y-1">
              <label className="text-xs text-muted-foreground">{field.label}</label>
              <input
                className="w-full rounded-md border bg-transparent px-2 py-1 text-xs outline-none focus:border-ring"
                placeholder={field.placeholder}
                defaultValue={String(data[field.key] ?? "")}
              />
            </div>
          ))}
        </div>
      )}

      {!isStart && (
        <Handle type="target" position={Position.Left} className="!h-4 !w-2 !rounded-sm !border-2 !border-background" />
      )}
      {!isStop && (
        <Handle type="source" position={Position.Right} className="!h-4 !w-2 !rounded-sm !border-2 !border-background" />
      )}
    </div>
  )
}
