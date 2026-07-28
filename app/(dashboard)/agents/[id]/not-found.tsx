import Link from "next/link"
import { Bot } from "@/components/animate-ui/icons/bot"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

export default function AgentNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bot />
          </EmptyMedia>
          <EmptyTitle>Agent not found</EmptyTitle>
          <EmptyDescription>
            The agent you&apos;re looking for doesn&apos;t exist or has been removed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/agents">Go to Agents</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
