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
  desc: string
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
    desc: "Entry point of the workflow. A run begins here and flows through the connected nodes.",
    fields: [],
    output: [],
  },
  {
    type: "openurl",
    kind: "action",
    label: "Open URL",
    icon: Globe,
    accent: "#3b82f6",
    desc: "Opens a page in the browser and captures the resulting URL and page title.",
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
    desc: "Sends an email to the given recipient with a subject and body.",
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
    label: "Agent",
    icon: Bot,
    accent: "#8b5cf6",
    desc: "Runs an autonomous, multi-step browser task from a plain-language instruction.",
    fields: [
      { key: "instruction", label: "Instruction", type: "string", placeholder: "Navigate to the dashboard and export this month's report. Use {{outputKey}} to reference an upstream output.", multiline: true, required: true },
    ],
    output: [
      { path: "success", label: "Succeeded" },
      { path: "message", label: "Summary" },
      { path: "completed", label: "Completed" },
    ],
  },
  {
    type: "extract",
    kind: "action",
    label: "Extract Data",
    icon: Database,
    accent: "#f59e0b",
    desc: "Pulls data off the current page by describing what you want in plain language.",
    fields: [
      { key: "instruction", label: "Instruction", type: "string", placeholder: "Extract all product names and prices. Use {{outputKey}} to reference an upstream output.", multiline: true, required: true },
    ],
    output: [
      { path: "extraction", label: "Extracted Data" },
    ],
  },
  {
    type: "observe",
    kind: "action",
    label: "Observe",
    icon: Eye,
    accent: "#06b6d4",
    desc: "Finds the actionable elements matching a plain-language instruction and returns their selectors and descriptions.",
    fields: [
      { key: "instruction", label: "Instruction", type: "string", placeholder: "Find the sign in button and the search input. Use {{outputKey}} to reference an upstream output.", multiline: true, required: true },
    ],
    output: [
      { path: "matches", label: "Matches" },
    ],
  },
  {
    type: "act",
    kind: "action",
    label: "Act",
    icon: MousePointerClick,
    accent: "#f97316",
    desc: "Performs an action on the page (click, type, scroll) from a plain-language instruction.",
    fields: [
      { key: "instruction", label: "Instruction", type: "string", placeholder: "Click the sign in button. Use {{outputKey}} to reference an upstream output.", multiline: true, required: true },
    ],
    output: [
      { path: "success", label: "Succeeded" },
      { path: "message", label: "Message" },
      { path: "url", label: "Page URL" },
    ],
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
  durationMs?: number
  [key: string]: string | unknown | undefined
}

export type StepNodeType = Node<StepNodeData>
