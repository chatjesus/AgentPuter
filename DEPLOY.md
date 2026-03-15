# 部署到 Cloudflare Pages

## 方法一：通过 Cloudflare Dashboard 直接上传

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create**
3. 选择 **Pages** → **Upload assets**
4. 上传 `dist/` 目录中的所有文件
5. 项目名称设置为 `agentputer`
6. 部署完成后获取 `.pages.dev` 预览链接

## 方法二：通过 Git 仓库自动部署（推荐）

### 步骤 1: 初始化 Git 仓库

```bash
cd /Users/mac/Desktop/AgentPuter
git init
git add .
git commit -m "feat: AgentPuter landing page"
```

### 步骤 2: 推送到 GitHub

```bash
# 在 GitHub 创建新仓库 agentputer-landing
gh repo create agentputer-landing --public --source=. --push
# 或手动添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/agentputer-landing.git
git push -u origin main
```

### 步骤 3: 连接 Cloudflare Pages

1. 进入 Cloudflare Dashboard → **Workers & Pages** → **Create**
2. 选择 **Pages** → **Connect to Git**
3. 授权 GitHub 并选择 `agentputer-landing` 仓库
4. 构建设置:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. 点击 **Save and Deploy**

## 方法三：使用 Wrangler CLI

```bash
# 安装 wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy dist --project-name=agentputer
```

---

## 绑定自定义域名 agentputer.com

### 前提条件
- 域名 `agentputer.com` 的 DNS 已经托管在 Cloudflare
- Pages 项目已成功部署

### 步骤

1. 进入 Pages 项目 → **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入 `agentputer.com`
4. 点击 **Continue** → **Activate domain**
5. 如果提示添加 DNS 记录，按提示操作

Cloudflare 会自动:
- 配置 DNS CNAME 记录
- 申请并配置 SSL 证书
- 启用 HTTPS

---

## 配置邮箱收集后端 (KV Storage)

1. 进入 Cloudflare Dashboard → **Workers & Pages** → **KV**
2. 点击 **Create a namespace**
3. 名称: `agentputer-subscribers`
4. 进入 Pages 项目 → **Settings** → **Functions** → **KV namespace bindings**
5. 添加绑定:
   - Variable name: `SUBSCRIBERS`
   - KV namespace: `agentputer-subscribers`
6. 重新部署项目

---

## 验证部署

部署成功后可以访问：
- 预览链接: `https://agentputer.pages.dev`
- 自定义域名: `https://agentputer.com`

### 测试邮箱收集

```bash
curl -X POST https://agentputer.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## 常见问题

### Q: 构建失败？
检查 Node.js 版本，推荐 18.x 或以上。

### Q: API 不工作？
确保 `functions/api/subscribe.js` 存在，并且 KV binding 配置正确。

### Q: 域名无法访问？
检查 DNS 是否已完全生效（最多需要 24 小时）。
