import { Store } from "lucide-react"

export default function MarketplacePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Marketplace</h1>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Store className="size-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Marketplace</h2>
          <p className="text-sm text-muted-foreground">
            Coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}
