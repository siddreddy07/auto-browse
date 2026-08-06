import { PricingTable } from "@clerk/nextjs"
import { Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PricingPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <Badge variant="outline" className="gap-1.5 rounded-full text-[11px] font-medium">
          <Crown className="size-3 text-amber-500" />
          Pro unlocks premium nodes
        </Badge>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Choose the plan that fits your organization. Upgrade, downgrade, or cancel
            anytime.
          </p>
        </div>
      </div>
      <PricingTable
        for="organization"
        highlightedPlan="pro"
        newSubscriptionRedirectUrl="/pricing"
      />
    </div>
  )
}
