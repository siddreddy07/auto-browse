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
import { Route } from "@/components/animate-ui/icons/route"

export default function WorkflowsPage() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-screen">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Route />
          </EmptyMedia>
          <EmptyTitle>No Workflow Selected</EmptyTitle>
          <EmptyDescription>
            Select a workflow from the sidebar or create a new one to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/workflows/new">Create Workflow</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
