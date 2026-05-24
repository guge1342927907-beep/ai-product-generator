# Pixora — AI Product Image Generator

AI 驱动的电商产品图生成平台。上传产品照片，选择风格，即可生成摄影棚级别的高质量商品图。

## 技术栈

- **Next.js 16** (App Router + Turbopack)
- **React 19**
- **Tailwind CSS v4** (CSS-based config, `@theme` directive)
- **Framer Motion** (动画)
- **Lucide React** (图标)
- **TypeScript** (strict mode)

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx            # 首页
│   ├── generate/           # AI 生图
│   ├── clone/              # AI 克隆图片
│   ├── diy/                # DIY 自由生图
│   ├── video/              # AI 视频
│   ├── describe/           # 智能商品描述
│   ├── watermark/          # 水印模板管理
│   ├── removewatermark/    # 智能去水印
│   ├── tasks/              # 任务队列
│   ├── works/              # 我的作品
│   ├── points/             # 积分流水
│   ├── recharge/           # 充值记录
│   ├── aftersales/         # 售后记录
│   ├── invite/             # 邀请好友
│   └── layout.tsx          # 根布局
├── components/             # 共享组件
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── GlowOrb.tsx
│   ├── ScrollToTop.tsx
│   ├── FloatingActions.tsx
│   ├── LoginModal.tsx
│   └── InviteModal.tsx
└── app/globals.css         # 全局样式 + Tailwind v4 主题
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器 (Turbopack)
npm run dev

# 访问 http://localhost:3000
```

## 构建 & 生产

```bash
npm run build   # TypeScript 检查 + 生产构建
npm start       # 启动生产服务器 (需要先 build)
```

> **注意：** 当前所有数据均为 Mock 数据，无后端依赖。

## 部署到 Vercel

### 一键部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/ai-product-generator)

### 手动部署步骤

1. **将项目推送到 GitHub / GitLab**

   ```bash
   git init
   git add .
   git commit -m "feat: Pixora initial release"
   git remote add origin https://github.com/你的用户名/ai-product-generator.git
   git push -u origin main
   ```

2. **在 Vercel 中导入项目**
   - 访问 [vercel.com/new](https://vercel.com/new)
   - 选择你的 Git 仓库
   - Vercel 会自动识别 Next.js 项目

3. **构建配置（无需修改，Vercel 自动检测）**
   - Framework: Next.js
   - Build Command: `next build`（自动）
   - Output Directory: `.next`（自动）
   - Install Command: `npm install`（自动）

4. **点击 Deploy，等待 1-2 分钟即可上线**

### 部署后注意事项

| 项目 | 说明 |
|------|------|
| **自定义域名** | Vercel 项目设置 → Domains → 添加你的域名，按提示配置 DNS |
| **SSL** | Vercel 自动提供 Let's Encrypt 证书，无需额外配置 |
| **环境变量** | 当前无需任何环境变量（纯前端 Mock 数据）。后续接入真实 API 时，在 Vercel Settings → Environment Variables 中添加 |
| **免费额度** | Vercel Hobby 计划：100 GB 带宽/月，6000 构建分钟/月 |

### 部署后如何更新

推送新代码到 Git 仓库的 `main` 分支，Vercel 会自动触发重新部署。无需手动操作。

## 配置说明

| 文件 | 说明 |
|------|------|
| `next.config.ts` | Next.js 配置（当前使用默认配置） |
| `postcss.config.mjs` | PostCSS 配置（Tailwind CSS v4 插件） |
| `tsconfig.json` | TypeScript 配置（strict 模式，路径别名 `@/`） |
| `src/app/globals.css` | Tailwind v4 主题定义 (`@theme` 指令) |

### 主题色

```
背景色:   #030014
紫色:     #8B5CF6 (--color-purple-accent)
青色:     #06B6D4 (--color-cyber-blue)
文字色:   #E8E6F0
次要文字: #7B7890
```

修改 `src/app/globals.css` 中的 `@theme` 块即可全局替换主题色。

## 依赖

| 包 | 版本 | 用途 |
|----|------|------|
| next | ^16.2.6 | React 框架 |
| react | ^19.2.4 | UI 库 |
| framer-motion | ^12.40.0 | 动画 |
| lucide-react | ^1.16.0 | 图标 |
| tailwindcss | ^4 | CSS 框架 |
| typescript | ^5 | 类型检查 |
