ALTER TABLE "places" ADD COLUMN "open_time" text DEFAULT '09:00 AM' NOT NULL;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "close_time" text DEFAULT '05:00 PM' NOT NULL;