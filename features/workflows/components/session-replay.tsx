"use client"

import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { Loader2, VideoOff } from "lucide-react"
import { cn } from "@/lib/utils"

type ReplayStatus = "loading" | "waiting" | "ready" | "error"

const POLL_INTERVAL_MS = 3000
const MAX_ATTEMPTS = 60

export function SessionReplay({
  sessionId,
  pageId = "0",
  playlist,
  className,
}: {
  sessionId: string
  pageId?: string
  playlist?: string
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [status, setStatus] = useState<ReplayStatus>("loading")

  useEffect(() => {
    let cancelled = false
    let attempts = 0
    let interval: ReturnType<typeof setInterval> | undefined

    const fail = () => {
      if (!cancelled) setStatus("error")
    }

    const playPlaylist = (playlist: string) => {
      const video = videoRef.current
      if (!video || cancelled) return

      const blobUrl = URL.createObjectURL(
        new Blob([playlist], { type: "application/vnd.apple.mpegurl" }),
      )

      if (Hls.isSupported()) {
        const hls = new Hls()
        hlsRef.current = hls
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) fail()
        })
        hls.loadSource(blobUrl)
        hls.attachMedia(video)
        if (!cancelled) setStatus("ready")
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = blobUrl
        if (!cancelled) setStatus("ready")
      } else {
        URL.revokeObjectURL(blobUrl)
        fail()
      }
    }

    const tryLoad = async () => {
      if (cancelled) return
      try {
        const res = await fetch(`/api/replays/${sessionId}?pageId=${pageId}`)
        if (cancelled) return

        if (res.ok) {
          const text = await res.text()
          if (cancelled) return
          if (text.trim()) {
            clearInterval(interval)
            playPlaylist(text)
            return
          }
        }

        attempts += 1
        if (!cancelled) setStatus("waiting")
        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(interval)
          fail()
        }
      } catch {
        if (cancelled) return
        attempts += 1
        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(interval)
          fail()
        }
      }
    }

    if (playlist && playlist.trim()) {
      playPlaylist(playlist)
    } else {
      interval = setInterval(tryLoad, POLL_INTERVAL_MS)
      void tryLoad()
    }

    return () => {
      cancelled = true
      clearInterval(interval)
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
  }, [sessionId, pageId, playlist])

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <video ref={videoRef} controls playsInline preload="auto" className="size-full bg-black" />
      {status !== "ready" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
          {status === "error" ? (
            <>
              <VideoOff className="size-4 text-destructive" />
              <span>Recording unavailable</span>
            </>
          ) : (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{status === "loading" ? "Preparing playback..." : "Recording is still being processed..."}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
