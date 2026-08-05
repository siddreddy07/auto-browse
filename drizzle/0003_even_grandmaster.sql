CREATE TYPE "public"."run_status" AS ENUM('idle', 'success', 'failed', 'running');--> statement-breakpoint
ALTER TABLE "runs" ADD COLUMN "status" "run_status" DEFAULT 'idle' NOT NULL;