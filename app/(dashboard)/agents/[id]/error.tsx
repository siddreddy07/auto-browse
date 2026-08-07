"use client"

import { Bot } from "@/components/animate-ui/icons/bot"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"

export default function AgentError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bot />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            Failed to load agent.{" "}
            <button
              onClick={reset}
              className="cursor-pointer underline underline-offset-4 hover:text-primary"
            >
              Try again
            </button>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
