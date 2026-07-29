export interface FieldDefinition {
  key: string
  label: string
  placeholder?: string
}

import { Play, Square, Globe, Mail, MessageSquare, Bot, Database, Camera } from "lucide-react"
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
    type: "stop",
    kind: "trigger",
    label: "Stop",
    icon: Square,
    accent: "#ef4444",
    fields: [],
  },
  {
    type: "open-url",
    kind: "action",
    label: "Open URL",
    icon: Globe,
    accent: "#3b82f6",
    fields: [
      { key: "url", label: "URL", placeholder: "https://example.com" },
    ],
  },
  {
    type: "send-email",
    kind: "action",
    label: "Send Email",
    icon: Mail,
    accent: "#ef4444",
    fields: [
      { key: "to", label: "To", placeholder: "user@example.com" },
      { key: "subject", label: "Subject", placeholder: "Workflow completed" },
      { key: "body", label: "Body", placeholder: "Your workflow has finished." },
    ],
  },
  {
    type: "send-slack",
    kind: "action",
    label: "Send Slack Message",
    icon: MessageSquare,
    accent: "#f43f5e",
    fields: [
      { key: "channel", label: "Channel", placeholder: "#general" },
      { key: "message", label: "Message", placeholder: "Task completed successfully" },
    ],
  },
  {
    type: "ai-agent",
    kind: "action",
    label: "AI Agent",
    icon: Bot,
    accent: "#8b5cf6",
    fields: [
      { key: "model", label: "Model", placeholder: "gpt-4o" },
      { key: "prompt", label: "Prompt", placeholder: "Analyze the page content..." },
      { key: "apiKey", label: "API Key", placeholder: "sk-..." },
    ],
  },
  {
    type: "extract-data",
    kind: "action",
    label: "Extract Data",
    icon: Database,
    accent: "#f59e0b",
    fields: [
      { key: "selector", label: "CSS Selector", placeholder: "table tr" },
      { key: "variable", label: "Save as", placeholder: "extractedData" },
    ],
  },
  {
    type: "screenshot",
    kind: "action",
    label: "Screenshot",
    icon: Camera,
    accent: "#ec4899",
    fields: [
      { key: "selector", label: "Element (optional)", placeholder: "body" },
      { key: "variable", label: "Save as", placeholder: "screenshotData" },
    ],
  },
]
