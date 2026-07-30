export interface FieldDefinition {
  key: string
  label: string
  placeholder?: string
  multiline?: boolean
  required?: boolean
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
}

export const nodeDefinitions: NodeDefinition[] = [
  {
    type: "start",
    kind: "trigger",
    label: "Start",
    icon: Play,
    accent: "#22c55e",
    fields: [],
  },
  {
    type: "openurl",
    kind: "action",
    label: "Open URL",
    icon: Globe,
    accent: "#3b82f6",
    fields: [
      { key: "url", label: "URL", placeholder: "https://example.com", required: true },
    ],
  },
  {
    type: "send-email",
    kind: "action",
    label: "Send Email",
    icon: Mail,
    accent: "#ef4444",
    fields: [
      { key: "to", label: "To", placeholder: "user@example.com", required: true },
      { key: "subject", label: "Subject", placeholder: "Workflow completed" },
      { key: "body", label: "Body", placeholder: "Your workflow has finished.", multiline: true },
    ],
  },
  {
    type: "agent",
    kind: "action",
    label: "AI Agent",
    icon: Bot,
    accent: "#8b5cf6",
    fields: [
      { key: "model", label: "Model", placeholder: "gpt-4o", required: true },
      { key: "apiKey", label: "API Key", placeholder: "sk-..." },
      { key: "prompt", label: "Prompt", placeholder: "Analyze the page content...", multiline: true, required: true },
    ],
  },
  {
    type: "extract",
    kind: "action",
    label: "Extract Data",
    icon: Database,
    accent: "#f59e0b",
    fields: [
      { key: "selector", label: "CSS Selector", placeholder: "table tr", required: true },
      { key: "variable", label: "Save as", placeholder: "extractedData" },
    ],
  },
  {
    type: "observe",
    kind: "action",
    label: "Observe",
    icon: Eye,
    accent: "#06b6d4",
    fields: [
      { key: "selector", label: "Element Selector", placeholder: ".target-class" },
      { key: "event", label: "Event Type", placeholder: "click, change, mutation" },
    ],
  },
  {
    type: "act",
    kind: "action",
    label: "Act",
    icon: MousePointerClick,
    accent: "#f97316",
    fields: [
      { key: "action", label: "Action", placeholder: "click, type, scroll", required: true },
      { key: "selector", label: "Target Selector", placeholder: "#my-button", required: true },
      { key: "value", label: "Value (optional)", placeholder: "text to type" },
    ],
  },
]
