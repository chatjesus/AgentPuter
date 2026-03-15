import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // 仅追踪 users 和 invite_codes 两张表
  tablesFilter: ["users", "invite_codes", "credit_usage"],
  verbose: true,
  strict: true,
});
