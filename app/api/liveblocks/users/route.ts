import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const { orgId } = await auth()

  if (!orgId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { userIds } = (await request.json()) as { userIds: string[] }

  const client = await clerkClient()

  const users = await Promise.all(
    userIds.map(async (id) => {
      try {
        const user = await client.users.getUser(id)
        return {
          name: user.firstName ?? user.username ?? user.emailAddresses[0]?.emailAddress ?? "Unknown",
          avatar: user.imageUrl,
        }
      } catch {
        return null
      }
    }),
  )

  return Response.json(users)
}
