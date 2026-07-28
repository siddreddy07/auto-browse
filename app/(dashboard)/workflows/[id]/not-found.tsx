import Link from "next/link"
import { Route } from "@/components/animate-ui/icons/route"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

export default function WorkflowNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Route />
          </EmptyMedia>
          <EmptyTitle>Workflow not found</EmptyTitle>
          <EmptyDescription>
            The workflow you&apos;re looking for doesn&apos;t exist or has been removed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/workflows">Go to Workflows</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
