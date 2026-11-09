"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(min-width: 768px)"

function subscribe(cb: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", cb)
  return () => mql.removeEventListener("change", cb)
}

/** Mounts children only on md+ screens (nothing is mounted/connected on phones). */
export function DesktopOnly({ children }: { children: React.ReactNode }) {
  const isDesktop = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
  return isDesktop ? <>{children}</> : null
}
