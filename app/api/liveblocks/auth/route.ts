import { auth, currentUser } from "@clerk/nextjs/server"
import { liveblocks } from "@/lib/liveblocks"

export async function POST() {
  const { userId, orgId } = await auth()

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const user = await currentUser()

  const groupIds: string[] = []

  if (orgId) {
    groupIds.push(orgId)
  }

  const { status, body } = await liveblocks.identifyUser(
    {
      userId,
      groupIds,
    },
    {
      userInfo: {
        name:
          user?.fullName ??
          user?.username ??
          user?.primaryEmailAddress?.emailAddress ??
          "Anonymous",
        avatar: user?.imageUrl ?? "",
      },
    }
  )

  return new Response(body, { status })
}
