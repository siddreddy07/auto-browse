CREATE TYPE "public"."share_level" AS ENUM('org', 'restrict', 'all');--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "workflow_id" text;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "graph" jsonb;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "share_level" "share_level" DEFAULT 'restrict' NOT NULL;--> statement-breakpoint
ALTER TABLE "agents" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "agents" DROP COLUMN "api_key";--> statement-breakpoint
ALTER TABLE "agents" DROP COLUMN "prompt";--> statement-breakpoint
ALTER TABLE "agents" DROP COLUMN "model_name";