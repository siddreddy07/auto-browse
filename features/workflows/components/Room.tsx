"use client";

import { Spinner } from "@/components/ui/spinner"
import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({ roomId, children }: {roomId:string, children: ReactNode }) {
  return (
    <LiveblocksProvider
      throttle={20}
      authEndpoint="/api/liveblocks/auth"
      resolveUsers={async ({ userIds }) => {
        const res = await fetch("/api/liveblocks/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds }),
        })
        return res.json()
      }}
    >
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<div className="flex h-screen w-screen items-center justify-center"><Spinner className="size-6" /></div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}