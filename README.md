# Auto Browse

Build and run **AI-powered browser automation workflows** on a visual canvas. Compose a graph of steps — open a URL, act, extract, observe, or run an autonomous agent — and execute it in a cloud browser powered by [Stagehand V3](https://stagehand.dev) and [Browserbase](https://www.browserbase.com). Runs stream live status and output back onto the canvas in real time, and every run can be replayed as video.

## Features

- **Visual workflow builder** — a collaborative [React Flow](https://reactflow.dev) canvas where you wire a single start trigger to action nodes: `open-url`, `act`, `extract`, `observe`, `agent`, and `send-email`. Editable node fields, cycle detection, and graph validation.
- **Token piping** — chain node outputs into downstream inputs with `{{outputKey}}` substitution.
- **Live run execution** — runs execute as [trigger.dev](https://trigger.dev) background tasks with real-time status, per-node output, and error reporting streamed to the canvas.
- **Session replay** — each run records its Browserbase session and can be replayed as HLS video (via `hls.js`).
- **Multi-tenant & realtime collaboration** — [Clerk](https://clerk.com) org-based auth plus [Liveblocks](https://liveblocks.io) rooms with cursors, presence, and avatars.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui
- **Automation:** Stagehand V3 + Browserbase SDK (Gemini model via Browserbase)
- **Backend:** Neon serverless Postgres with Drizzle ORM, trigger.dev background tasks
- **Auth & collaboration:** Clerk (orgs), Liveblocks (realtime), React Flow

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Signed-in users land on `/workflows`, where you can create a workflow, add nodes, and hit **Run**.

## Scripts

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Start the Next.js dev server                 |
| `npm run trigger`| Start the trigger.dev dev server             |
| `npm run build`  | Production build                             |
| `npm run lint`   | Lint with ESLint                             |
| `npm run typecheck` | TypeScript type check                     |
| `npm run db:push`| Push Drizzle schema to Neon                  |
| `npm run db:studio` | Open Drizzle Studio                       |

## Environment

Requires credentials for Browserbase, Clerk, Liveblocks, Neon, and a trigger.dev project (`trigger.config.ts`). See `.env.local` for local configuration.
