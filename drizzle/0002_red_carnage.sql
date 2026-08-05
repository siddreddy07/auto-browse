CREATE TABLE "runs" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text,
	"org_id" text NOT NULL,
	"workflow_id" text NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflows" ALTER COLUMN "graph" DROP NOT NULL;