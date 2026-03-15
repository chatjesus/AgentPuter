/**
 * 生成邀请码脚本
 *
 * 用法:
 *   npx tsx scripts/generate-invite-codes.ts [数量] [最大使用次数] [备注]
 *
 * 示例:
 *   npx tsx scripts/generate-invite-codes.ts 10 1 "早期测试用户"
 *   npx tsx scripts/generate-invite-codes.ts 1 -1 "无限次数内部测试码"
 *   npx tsx scripts/generate-invite-codes.ts 5 1 "Twitter 推广"
 */

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { pgTable, uuid, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import * as crypto from "crypto";

// 内联 schema（避免路径别名问题）
const inviteCodes = pgTable("invite_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  maxUses: integer("max_uses").default(1),
  usedCount: integer("used_count").default(0),
  createdBy: varchar("created_by", { length: 255 }),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// 生成格式: XXXX-XXXX-XXXX
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 去掉易混淆字符
  const segments = [];
  for (let s = 0; s < 3; s++) {
    let segment = "";
    for (let i = 0; i < 4; i++) {
      segment += chars[crypto.randomInt(chars.length)];
    }
    segments.push(segment);
  }
  return segments.join("-");
}

async function main() {
  const count = parseInt(process.argv[2] || "10");
  const maxUses = parseInt(process.argv[3] || "1");
  const note = process.argv[4] || "初始批次";

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    // 尝试从 .env.local 读取
    const fs = await import("fs");
    const envContent = fs.readFileSync(".env.local", "utf-8");
    const match = envContent.match(/DATABASE_URL=(.+)/);
    if (!match) {
      console.error("DATABASE_URL 未设置");
      process.exit(1);
    }
    process.env.DATABASE_URL = match[1].trim();
  }

  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client, { schema: { inviteCodes } });

  console.log(`\n🔑 生成 ${count} 个邀请码 (最大使用次数: ${maxUses === -1 ? "无限" : maxUses})\n`);

  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = generateCode();
    await db.insert(inviteCodes).values({
      code,
      maxUses,
      usedCount: 0,
      createdBy: "admin-script",
      note,
    });
    codes.push(code);
    console.log(`  ✅ ${code}`);
  }

  console.log(`\n📋 复制粘贴格式:\n`);
  codes.forEach((c) => console.log(c));

  console.log(`\n共 ${count} 个邀请码已写入数据库\n`);

  await client.end();
}

main().catch(console.error);
