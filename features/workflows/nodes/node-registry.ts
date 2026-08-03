export interface FieldDefinition {
  key: string
  label: string
  type: string
  placeholder?: string
  multiline?: boolean
  required?: boolean
}

export interface NodeOutput {
  path: string
  label: string
}

import { Play, Globe, Mail, Bot, Database, Eye, MousePointerClick } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface NodeDefinition {
  type: string
  kind: "trigger" | "action"
  label: string
  icon: LucideIcon
  accent: string
  fields: FieldDefinition[]
  output: NodeOutput[]
}

export const nodeDefinitions: NodeDefinition[] = [
  {
    type: "start",
    kind: "trigger",
    label: "Start",
    icon: Play,
    accent: "#22c55e",
    fields: [],
    output: [],
  },
  {
    type: "openurl",
    kind: "action",
    label: "Open URL",
    icon: Globe,
    accent: "#3b82f6",
    fields: [
      { key: "url", label: "URL", type: "url", placeholder: "https://example.com", required: true },
    ],
    output: [
      { path: "url", label: "Page URL" },
      { path: "title", label: "Page Title" },
    ],
  },
  {
    type: "send-email",
    kind: "action",
    label: "Send Email",
    icon: Mail,
    accent: "#ef4444",
    fields: [
      { key: "to", label: "To", type: "email", placeholder: "user@example.com", required: true },
      { key: "subject", label: "Subject", type: "string", placeholder: "Workflow completed" },
      { key: "body", label: "Body", type: "markdown", placeholder: "Your workflow has finished.", multiline: true },
    ],
    output: [
      { path: "to", label: "Recipient" },
      { path: "subject", label: "Subject" },
      { path: "body", label: "Body" },
    ],
  },
  {
    type: "agent",
    kind: "action",
    label: "AI Agent",
    icon: Bot,
    accent: "#8b5cf6",
    fields: [
      { key: "model", label: "Model", type: "string", placeholder: "qwen3.5:9b" },
      { key: "apiKey", label: "API Key", type: "string", placeholder: "sk-..." },
      { key: "prompt", label: "Prompt", type: "string", placeholder: "Analyze the page content...", multiline: true, required: true },
    ],
    output: [
      { path: "response", label: "AI Response" },
      { path: "model", label: "Model Used" },
    ],
  },
  {
    type: "extract",
    kind: "action",
    label: "Extract Data",
    icon: Database,
    accent: "#f59e0b",
    fields: [
      { key: "selector", label: "CSS Selector", type: "string", placeholder: "table tr", required: true },
      { key: "variable", label: "Save as", type: "string", placeholder: "extractedData" },
    ],
    output: [],
  },
  {
    type: "observe",
    kind: "action",
    label: "Observe",
    icon: Eye,
    accent: "#06b6d4",
    fields: [
      { key: "selector", label: "Element Selector", type: "string", placeholder: ".target-class" },
      { key: "event", label: "Event Type", type: "string", placeholder: "click, change, mutation" },
    ],
    output: [],
  },
  {
    type: "act",
    kind: "action",
    label: "Act",
    icon: MousePointerClick,
    accent: "#f97316",
    fields: [
      { key: "action", label: "Action", type: "string", placeholder: "click, type, scroll", required: true },
      { key: "selector", label: "Target Selector", type: "string", placeholder: "#my-button", required: true },
      { key: "value", label: "Value (optional)", type: "string", placeholder: "text to type" },
    ],
    output: [],
  },
]


import type { Node } from "@xyflow/react"

export type NodeStatus = "pending" | "running" | "done" | "failed"

export type StepNodeData = {
  type: string
  displayLabel?: string
  output?: unknown
  status?: NodeStatus
  error?: string
  [key: string]: string | unknown | undefined
}

export type StepNodeType = Node<StepNodeData>
