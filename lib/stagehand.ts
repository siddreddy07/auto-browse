import { Stagehand, type V3Options } from "@browserbasehq/stagehand"

// Runs entirely on Browserbase cloud. Get your key at
// https://browserbase.com/settings and set BROWSERBASE_API_KEY in your .env.
export const stagehandConfig = {
  env: "BROWSERBASE",
  apiKey: process.env.BROWSERBASE_API_KEY,
  disablePino: true,
  model: "google/gemini-2.5-flash",
} satisfies Pick<V3Options, "env" | "apiKey" | "model" | "disablePino">

// To run a LOCAL model instead (no cloud LLM, browser still on Browserbase):
// 1. Install Ollama from https://ollama.com and pull a model, e.g.
//    `ollama pull qwen3.5:9b`
// 2. Replace the `model` string above with:
//    model: {
//      modelName: "ollama/qwen3.5:9b",
//      baseURL: "http://localhost:11434",
//    }
// 3. Keep BROWSERBASE_API_KEY set (browser automation still runs there).

export async function getStagehand() {
  const stagehand = new Stagehand(stagehandConfig)
  await stagehand.init()
  return stagehand
}

export type StagehandInstance = Awaited<ReturnType<typeof getStagehand>>
