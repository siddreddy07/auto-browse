import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Bot } from "@/components/animate-ui/icons/bot"

export default function AgentsPage() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-screen">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bot />
          </EmptyMedia>
          <EmptyTitle>No Agent Selected</EmptyTitle>
          <EmptyDescription>
            Select an agent from the sidebar or create a new one to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/agents/new">Create Agent</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
