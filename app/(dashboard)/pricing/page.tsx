import { PricingTable } from "@clerk/nextjs"

export default function PricingPage() {
  return (
    <div className="flex flex-1 py-10 px-36 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-sm text-muted-foreground">
          Choose the plan that fits your organization. Upgrade, downgrade, or
          cancel anytime.
        </p>
      </div>
      <PricingTable
        for="organization"
        highlightedPlan="pro"
        newSubscriptionRedirectUrl="/pricing"
      />
    </div>
  )
}
