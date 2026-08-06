import { auth } from "@clerk/nextjs/server"
import { APIError, Browserbase } from "@browserbasehq/sdk"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

const PRO_PLAN = "org:pro" as const

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { orgId, has } = await auth()

  if (!orgId) {
    return new Response("Unauthorized", { status: 401 })
  }

  if (!has({ plan: PRO_PLAN })) {
    return new Response("Session replay requires the Pro plan", { status: 403 })
  }

  const { sessionId } = await params
  const pageId = request.nextUrl.searchParams.get("pageId") ?? "0"

  const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY })

  try {
    const response = await bb.sessions.replays.retrievePage(sessionId, pageId)
    const playlist = await response.text()

    return new Response(playlist, {
      status: response.status,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    if (error instanceof APIError) {
      return new Response(error.message ?? "Replay not ready", {
        status: error.status ?? 502,
        headers: { "Cache-Control": "no-store" },
      })
    }

    return new Response("Failed to fetch replay", { status: 502 })
  }
}
