import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

// 用户表
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }),
  inviteCode: varchar('invite_code', { length: 50 }), // 使用的邀请码
  vpsIp: varchar('vps_ip', { length: 50 }),
  vpsPassword: varchar('vps_password', { length: 255 }),
  hetznerServerId: varchar('hetzner_server_id', { length: 255 }),
  gatewayToken: varchar('gateway_token', { length: 255 }), // OpenClaw gateway auth token
  status: varchar('status', { length: 50 }).default('pending'),
  // pending → subscribed → creating → ready → error
  // pending: 注册了但没有订阅
  // subscribed: Stripe 订阅成功，可以创建 VPS
  // creating: VPS 正在创建
  // ready: VPS 已就绪
  // error: 创建失败
  telegramPaired: varchar('telegram_paired', { length: 50 }).default('false'),
  // Stripe 字段
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  subscriptionStatus: varchar('subscription_status', { length: 50 }), // active, canceled, past_due, trialing
  subscriptionCurrentPeriodEnd: timestamp('subscription_current_period_end'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 邀请码表
export const inviteCodes = pgTable('invite_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).unique().notNull(),
  maxUses: integer('max_uses').default(1), // 最大使用次数，-1 表示无限
  usedCount: integer('used_count').default(0), // 已使用次数
  createdBy: varchar('created_by', { length: 255 }), // 谁创建的（管理备注）
  note: varchar('note', { length: 500 }), // 备注（给谁的、什么渠道）
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'), // 过期时间，null 表示永不过期
});

// Database connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema: { users, inviteCodes } });
