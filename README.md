# Soulora

Soulora 是一个以倾听、许可式记忆和清晰边界为核心的 AI 虚拟伴侣产品概念官网。

当前仓库交付的是产品预览和可选的预发布调研收集能力，不包含真实 AI 服务、产品账号、长期记忆或音频播放。未配置并显式开启 Supabase 时，表单仍是本地预览；页面不会假装已保存反馈。

## 体验内容

- Nocturne Presence 全屏视频首屏（使用项目所有者制作的 7.04 秒 `soulora-hero-background` 视频，优先使用 WebM，保留 MP4 兼容回退，并使用无损 WebP 静态海报；视频以原始清晰度全屏呈现，不叠加模糊、雾层或粒子遮罩）
- 实时形象实验室：四种可切换陪伴人格、Vidu 角色媒体、声波反馈，以及鼠标与方向键操作
- Vidu Stream Avatar 技术接入目标展示：540P、25 FPS、长时生成和音色定制；当前均明确标注为计划接入的概念能力
- 倾听、记忆、呼吸、声音四种可操作 App 概念
- 陪伴上下文、分层记忆、边界开关和回应节奏展示
- 日常陪伴时间轴
- 隐私控制中心概念
- 两步式用户意向与反馈表单：使用场景、简短期待、首选平台、邮箱和可选访谈许可，并包含校验、加载、透明预览、真实成功和接口失败状态
- 键盘导航、移动菜单、低动态模式与响应式适配

页面没有热链媒体。Vidu 素材已下载到 `assets/vidu/`，其使用依据为项目所有者确认的授权；Animates 仍只作为首屏构图、层级与动效节奏参考，没有复制其 Logo、品牌文案或下载入口。

## 本地预览

```bash
python3 -m http.server 4173
```

打开 `http://127.0.0.1:4173`。

## 部署

官网没有构建步骤或运行时依赖，可直接导入 Vercel 部署。`api/feedback.js` 是零依赖 Vercel Function；`.vercelignore` 排除独立后台与迁移文件。根目录 `404.html` 用作 Vercel 静态站错误页；保持真实 404 响应，不添加指向首页的通配重写。错误页带有 `noindex`，不加入站点地图。

## 调研收集与管理后台

表单只收集场景（最多两项）、期望（可选，最多 320 字）、首选平台、邮箱及独立的访谈许可。聊天演示、记忆输入、声音等内容不会发送。服务端校验、去重、简单蜜罐与 Supabase RLS 已实现；只有管理员可读和修改处理状态。后台位于 `dashboard/`，作为独立静态项目部署，不需要把高权限密钥发给浏览器。完整启用步骤和限制见 [`docs/research-backend-setup.md`](docs/research-backend-setup.md)。

飞书邮箱域名已验证，`support@soulora.ai` 已由项目所有者确认创建并通过外部收件测试。DNS 与后续 DKIM/DMARC 检查见 [`docs/support-mail-setup.md`](docs/support-mail-setup.md)。官网公开客服及隐私请求地址已统一为 `support@soulora.ai`。

## 上线前配置

1. 在新加坡 `ap-southeast-1` 创建 Soulora 专用 Supabase 项目、应用 SQL 迁移、配置 Vercel 环境变量并审核隐私与保留期，再显式启用 `FEEDBACK_COLLECTION_ENABLED=true`。站点会先检查服务可用性，没准备好时保持本地预览。
2. 邮箱域名验证和 `support@soulora.ai` 收件测试已完成；发信后继续核对 DKIM/DMARC 对齐和实际投递结果。
3. 补充真实的运营主体、注册地区、地址、Supabase 地区和数据保留期。正式域名为 `https://soulora.ai/`。
4. 在上线真实产品前，由实际运营地区的合格法律顾问审核并完善隐私政策、服务条款、数据保留、导出与删除说明。当前页面只覆盖开发中概念网站的可验证行为。
5. 对真实产品的记忆、加密、危机响应和模型供应商进行合规与安全验证。
6. 在有证据后再添加用户规模、商店下载、合作品牌或认证信息。

## SEO 配置与验证

- 首页使用原生 HTML metadata、自引用 canonical、绝对地址的 Open Graph/Twitter 分享图，以及与概念预览状态一致的 `WebSite` / `WebPage` JSON-LD。
- `robots.txt` 允许公开页面抓取并声明 `sitemap.xml`；站点地图包含首页、使用流程、选择指南和三份当前网站信任页面，不包含页内锚点、追踪参数或尚未存在的语言页面。
- `vercel.json` 声明 `www.soulora.ai` 到非 www 域名的永久跳转。部署后需确认 Vercel 域名层配置没有优先返回原有的 307 临时跳转。
- 新增真实可索引页面时，同步维护唯一 metadata、自引用 canonical、站点地图和内部链接；只有发布完整语言版本后才配置对应 hreflang。
- 未添加软件评分、下载地址、运营主体 schema 或定价，因为当前没有对应的真实产品信息。
- 外部脚本成功初始化内容显现后才移除 `no-js`，脚本加载失败时保留可阅读正文。

项目没有 `package.json`、lint/typecheck 脚本或 build 步骤。不要把这些缺失的命令记录为通过。可运行 `node --test tests/feedback.test.js`、`node --check script.js`、`node --check dashboard/app.js` 与 `python3 scripts/verify_site.py`；线上 Supabase 与邮件收发仍需另行验证。

上线后复查 `/`、`/robots.txt`、`/sitemap.xml` 的响应、主域跳转和 CDN 标头。搜索引擎收录、Core Web Vitals 与 AI 搜索引用需要另外测量，不能由静态验证推断。

## 内容页面

- `/how-it-works`（`how-it-works.html`）：介绍当前可尝试的演示、许可式记忆设计、语音/形象概念，以及平台、语言和产品状态。
- `/guides/choose-ai-companion`（`guides/choose-ai-companion.html`）：按会话用途、记忆控制、语音/语言、数据处理、平台和费用提供选择清单。不是产品排名或未实测的竞品比较。
- `/privacy`（`privacy.html`）：记录开发中概念网站当前处理的技术请求信息、客服邮件、Vercel 托管和未启用的跟踪能力，并明确列出待补法律信息。
- `/terms`（`terms.html`）：仅覆盖当前信息展示与本地交互预览，不把尚未上线的产品、账号、付费或能力写成已提供服务。
- `/data-requests`（`data-requests.html`）：提供当前客服邮件与技术记录的访问、导出、更正和删除申请步骤，并标明真实产品上线前仍需实现的账号与内容控制。
- `content.css` 复用现有设计变量；新页面只用原生 HTML/CSS，不加载主页业务脚本。每页都有独立 metadata、canonical、WebPage/WebSite 和 BreadcrumbList。
- 新页面通过 Vercel 原生 `cleanUrls` 使用不带 `.html`、不带尾斜杠的路径。Python 简单文件服务器预览时，直接访问 `/how-it-works.html` 和 `/guides/choose-ai-companion.html`；它不会自动模拟 Vercel 的无扩展名路由。
- 首页和新页面互相链接。当前仍只有英文；新加坡网站内容也使用英文，不加入指向不存在翻译页的 hreflang。产品语言能力、地区政策和下载渠道准备好后，再创建相应页面。
- 发布真实产品服务时，同步更新首页产品状态、使用流程中的可用性表格与 FAQ、选择指南的 Soulora 状态及对应 metadata。调研收集不同于产品账号或正式等候名单。
- CSS、JavaScript 和首屏媒体使用带版本的 URL，并由 Vercel 返回一年 `immutable` 浏览器缓存。修改这些文件时必须同时更换对应 HTML/CSS 中的版本参数，避免用户继续使用旧资源。
- 站点地图的 `lastmod` 表示可见正文的实际更新时间，不使用构建或部署时间自动覆盖。

首页主按钮直接进入互动预览；反馈表单沿用原有锚点、校验和提交流程，但明确显示为预览。接入真实服务时应一起更新按钮、邮箱提示、同意选项和状态说明。

运行 `python3 scripts/verify_site.py` 可复查本地页面 metadata、结构化数据、站点地图、内部链接和资源引用；它不代替真实部署的 HTTP、抓取或排名验证。

## 设计与实施文档

- [`DESIGN.md`](DESIGN.md)
- [`docs/plans/2026-09-16-soulora-cinematic-redesign-design.md`](docs/plans/2026-09-16-soulora-cinematic-redesign-design.md)
- [`docs/plans/2026-09-16-soulora-cinematic-redesign.md`](docs/plans/2026-09-16-soulora-cinematic-redesign.md)
