CREATE TABLE "invite_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"max_uses" integer DEFAULT 1,
	"used_count" integer DEFAULT 0,
	"created_by" varchar(255),
	"note" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	CONSTRAINT "invite_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"email" varchar(255),
	"invite_code" varchar(50),
	"vps_ip" varchar(50),
	"vps_password" varchar(255),
	"hetzner_server_id" varchar(255),
	"gateway_token" varchar(255),
	"status" varchar(50) DEFAULT 'pending',
	"telegram_paired" varchar(50) DEFAULT 'false',
	"discord_connected" varchar(50) DEFAULT 'false',
	"whatsapp_connected" varchar(50) DEFAULT 'false',
	"feishu_app_id" varchar(255),
	"feishu_app_secret" varchar(255),
	"feishu_verify_token" varchar(255),
	"feishu_encrypt_key" varchar(255),
	"feishu_connected" varchar(50) DEFAULT 'false',
	"selected_model" varchar(50) DEFAULT 'claude',
	"source" varchar(50) DEFAULT 'agentputer',
	"stripe_customer_id" varchar(255),
	"stripe_subscription_id" varchar(255),
	"subscription_status" varchar(50),
	"subscription_current_period_end" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
