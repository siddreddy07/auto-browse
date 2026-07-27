import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
