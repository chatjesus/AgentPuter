CREATE TABLE "credit_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"model" varchar(100) NOT NULL,
	"credits" integer DEFAULT 0 NOT NULL,
	"usage_date" date NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "credit_usage_user_date_idx" ON "credit_usage" USING btree ("user_id","usage_date");