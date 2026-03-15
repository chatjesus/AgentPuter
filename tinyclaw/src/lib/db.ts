import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  date,
  index,
} from "drizzle-orm/pg-core";

// 用户表（与 AgentPuter 共用同一张表，加 source 字段区分来源）
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }),
  inviteCode: varchar("invite_code", { length: 50 }),
  vpsIp: varchar("vps_ip", { length: 50 }),
  vpsPassword: varchar("vps_password", { length: 255 }),
  hetznerServerId: varchar("hetzner_server_id", { length: 255 }),
  gatewayToken: varchar("gateway_token", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"),
  telegramPaired: varchar("telegram_paired", { length: 50 }).default("false"),
  discordConnected: varchar("discord_connected", { length: 50 }).default("false"),
  whatsappConnected: varchar("whatsapp_connected", { length: 50 }).default("false"),
  feishuAppId: varchar("feishu_app_id", { length: 255 }),
  feishuAppSecret: varchar("feishu_app_secret", { length: 255 }),
  feishuVerifyToken: varchar("feishu_verify_token", { length: 255 }),
  feishuEncryptKey: varchar("feishu_encrypt_key", { length: 255 }),
  feishuConnected: varchar("feishu_connected", { length: 50 }).default("false"),
  // 模型选择
  selectedModel: varchar("selected_model", { length: 50 }).default("claude"),
  // 来源标记
  source: varchar("source", { length: 50 }).default("agentputer"),
  // Stripe
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  subscriptionStatus: varchar("subscription_status", { length: 50 }),
  subscriptionCurrentPeriodEnd: timestamp("subscription_current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 邀请码表
export const inviteCodes = pgTable("invite_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  maxUses: integer("max_uses").default(1),
  usedCount: integer("used_count").default(0),
  createdBy: varchar("created_by", { length: 255 }),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Desktop credit 用量表
export const creditUsage = pgTable(
  "credit_usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    model: varchar("model", { length: 100 }).notNull(),
    credits: integer("credits").notNull().default(0),
    usageDate: date("usage_date").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("credit_usage_user_date_idx").on(t.userId, t.usageDate),
  ]
);

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema: { users, inviteCodes, creditUsage } });
