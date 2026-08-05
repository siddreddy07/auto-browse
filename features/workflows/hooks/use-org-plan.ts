"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

const PRO_PLAN = "org:pro" as const
const PRICING_PATH = "/pricing" as const

export function useOrgPlan() {
  const { isLoaded, isSignedIn, has } = useAuth()
  const router = useRouter()

  const isPro = isLoaded && isSignedIn && has({ plan: PRO_PLAN })

  const upgrade = useCallback(() => {
    router.push(PRICING_PATH)
  }, [router])

  return { isLoaded, isPro, upgrade }
}
