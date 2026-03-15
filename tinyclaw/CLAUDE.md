# TinyClaw — Project Guidelines for AI Assistants

> **Stack:** Next.js 15 (App Router) · TypeScript · Drizzle ORM · Neon PostgreSQL · Clerk Auth · Stripe · Vercel
> **Infrastructure:** Shared VPS (Docker containers per user) · OpenClaw agents · SSH2

---

## 🔴 Red Lines — Never Cross

1. **절대 `main` 브랜치에서 직접 개발하지 않는다** — all dev work on `dev` branch
2. **`vercel --prod` 없이 테스트하지 않은 코드를 배포하지 않는다** — use `vercel` (preview) first
3. **DB 破坏性迁移禁止在生产直接执行** — no DROP COLUMN / RENAME COLUMN / NOT NULL without default
4. **`vps/create/route.ts` 的改动必须用测试账号跑完整流程才能上线** — new user onboarding is critical
5. **Stripe webhook 逻辑修改必须 code review** — payment errors cannot be rolled back

---

## Branch & Deploy Workflow

```
Development:
  git checkout dev
  # make changes, commit
  vercel            → Preview URL (safe, doesn't affect tinyclaw.dev)

Release to production:
  git checkout main
  git merge dev
  npm run typecheck  # must pass
  vercel --prod      → tinyclaw.dev

Emergency rollback:
  vercel rollback    # instant rollback, no git revert needed
```

---

## Database — Drizzle ORM

### Schema file
`src/lib/db.ts` — single source of truth for all table definitions.

### Migration workflow (always follow this)

```bash
# 1. Edit src/lib/db.ts (add columns, etc.)
# 2. Generate migration file
npm run db:generate

# 3. Review generated SQL in drizzle/migrations/
# 4. Apply to production
npm run db:migrate

# Dev shortcut (skip migration file, push directly — dev only)
npm run db:push
```

### Safe vs dangerous schema changes

| Change | Safety | Notes |
|--------|--------|-------|
| `ADD COLUMN` (nullable or with default) | ✅ Safe | Always preferred |
| `ADD COLUMN NOT NULL` (no default) | ❌ Dangerous | Locks table, rewrites all rows |
| `DROP COLUMN` | ❌ Dangerous | Remove app code first, deploy, then drop |
| `RENAME COLUMN` | ❌ Dangerous | Use expand-contract: add new → backfill → drop old |
| `CREATE INDEX` | ⚠️ Use CONCURRENTLY | drizzle-kit handles this |

### Expand-contract pattern for column renames
```
Step 1: ADD new column (migration)
Step 2: Deploy code that writes to BOTH columns
Step 3: Backfill old rows
Step 4: Deploy code that reads from new column only
Step 5: DROP old column (separate migration, next deploy)
```

---

## Architecture — Key Files

```
tinyclaw/
  src/
    app/
      (auth)/
        creating/page.tsx     # Container provisioning progress page
        dashboard/            # User dashboard + channel setup components
      api/
        vps/create/route.ts   # ⚠️ CRITICAL — Docker container provisioning
        vps/status/route.ts   # Container health check
        webhooks/stripe/      # ⚠️ CRITICAL — Payment events
        telegram/             # Telegram bot pairing
        discord/              # Discord bot setup
        feishu/               # Feishu (Lark) webhook bridge
    lib/
      db.ts                   # Drizzle schema (users + invite_codes)
      i18n.ts                 # Translation type definitions
    locales/
      en.json                 # Base translations (English)
      zh.json                 # Simplified Chinese
      zh-tw.json              # Traditional Chinese
      # Other locales fall back to en.json via deepMerge
  drizzle/
    migrations/               # Migration files — commit these, never edit deployed ones
  drizzle.config.ts           # Drizzle Kit config
```

---

## Internationalization (i18n)

- `en.json` is the base/fallback — always add keys here first
- `zh.json` and `zh-tw.json` should have translations for all user-facing strings
- Other locales (`fr`, `de`, `es`, etc.) fall back to `en.json` via `deepMerge` automatically
- **Never hardcode UI strings** — all text must go through `t.dashboard.*` or other `t.*` keys
- Add type definitions to `src/lib/i18n.ts` for every new key

---

## VPS / Docker Container System

Each paying user gets a Docker container on the shared VPS:
- Container name: `tc-{shortId}` (first 12 chars of clerkId, alphanumeric)
- User workspace: `/opt/tinyclaw/users/{shortId}/`
- Gateway port: 19000–19100 range (allocated by `allocate-port.sh`)
- Platform credentials: `/opt/tc/{shortId}/gcp-sa.json` + `/opt/tc/openai.key` (read-only mount)

### Container lifecycle
```
Stripe checkout.session.completed
  → vps/create/route.ts: provision container
  → DB: status = "creating" → "ready"
  → creating/page.tsx: polls status, redirects to /dashboard

customer.subscription.deleted
  → stripe webhook: cleanup container, reset DB status to "pending"
```

### SSH commands use executeSSHCommand() from shared-util — never spawn raw SSH

---

## Channels Supported

| Channel | Status | Auth Method |
|---------|--------|-------------|
| WebChat | ✅ Built-in | Gateway token in URL |
| Telegram | ✅ Active | BotFather token + pairing code |
| Discord | ✅ Active | Bot token |
| WhatsApp | ✅ Active | QR code scan |
| Feishu (Lark) | ✅ Active | App ID + App Secret + Verify Token |

---

## Pre-Deploy Checklist

Run before every `vercel --prod`:

```
□ npm run typecheck        — zero TypeScript errors
□ DB migration is additive only (ADD COLUMN, not DROP/RENAME)
□ Tested with a real Stripe test-mode subscription
□ New user onboarding flow tested (register → pay → container created → WebChat works)
□ Existing user dashboard unaffected (check oscarzamora199907@gmail.com equivalent)
□ No hardcoded secrets in committed code
```

---

## Security Rules

- **Never** store API keys in `openclaw.json` or the user's workspace — use `/opt/tc/{shortId}/`
- **Never** pass `OPENAI_API_KEY` as Docker environment variable — mount as file
- **Never** log gateway tokens or user secrets — use partial masking if needed
- **Never** trust client-side subscription status — always verify from DB (synced by Stripe webhook)
- All API routes must call `auth()` from `@clerk/nextjs/server` first

---

## Commit Message Format

```
Feat(scope): description
Fix(scope): description
Refactor(scope): description
Docs(scope): description
Chore(scope): description

Examples:
  Feat(channel): add Feishu Lark webhook bridge
  Fix(vps): fix ERR_CONNECTION_RESET for new users
  Chore(deps): update drizzle-orm to 0.39
```

---

## Environment Variables

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database (Neon PostgreSQL)
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Shared VPS
SHARED_VPS_HOST=          # e.g. 178.156.252.255
SHARED_VPS_PASSWORD=

# Platform AI Keys (injected into containers as files, not env vars)
GOOGLE_VERTEX_SA_JSON_B64=
OPENAI_API_KEY=
```

---

## Common Operations

```bash
# Local development
npm run dev               # http://localhost:3099

# Type checking
npm run typecheck

# DB: add a new column
# 1. Edit src/lib/db.ts
# 2. npm run db:generate
# 3. npm run db:migrate

# DB: interactive browser
npm run db:studio

# Deploy preview (safe)
vercel

# Deploy production (after testing)
vercel --prod

# Rollback production
vercel rollback
```
