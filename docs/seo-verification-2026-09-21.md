# Soulora SEO 修复与复核

日期：2026-09-21。正式域名：https://soulora.ai/ 。本次为本地实现与验证，未部署、未提交 sitemap 或请求索引。

目标市场：美国、日本、韩国、东南亚、欧洲。当前内容仍为英文；东南亚具体语言与欧洲非英语需求待明确。产品仍为 AI 虚拟伴侣概念预览。

## 修改范围

| 文件 | 修改 |
| --- | --- |
| `index.html` | 明确概念预览状态的 title/description；canonical；一致的 OG/Twitter 元信息及绝对分享图 URL；WebSite/WebPage JSON-LD；脚本版本更新 |
| `robots.txt` | 允许公开内容抓取，声明 sitemap |
| `sitemap.xml` | 仅列入真实存在的规范首页，不含片段、参数和未发布页面 |
| `vercel.json` | 声明 www 到非 www 主域的永久跳转，保留原安全标头 |
| `script.js` | 显现功能初始化成功后才移除 no-js，保留脚本失败时的正文回退 |
| `README.md` | 更新配置、验证及上线复查说明 |

未新增依赖，未改变 CSS、可见正文、H1、业务表单接口、产品能力或下载行为。通过与修改前 Git 版本比较，确认 body 仅改变脚本缓存版本；业务 JS 仅增加 no-js 就绪处理。

## 已解决（本地）

- P2：缺失的 canonical、robots、sitemap、JSON-LD 已补齐。
- P2：metadata 与概念预览状态一致，不再把未配置的申请作为搜索摘要承诺。
- P2：脚本加载失败导致正文透明的回退问题已修复。
- P3：OG/Twitter 分享图使用绝对地址，补充 og:url、og:site_name、Twitter 图片说明。
- 主域永久跳转规则已写入配置；运行效果待部署验证，不能记为线上已解决。

## 验证记录

| 检查 | 结果 |
| --- | --- |
| `npm run lint`、`npm run typecheck`、`npm run build` | 均已尝试，均因不存在 package.json 返回 ENOENT；未记为通过。使用临时 npm cache，没有安装依赖。 |
| `node --check script.js` | 通过 |
| `git diff --check` | 通过 |
| seo-master 静态审计脚本 | 发现唯一 title、description、H1、canonical；JSON-LD 可解析；没有缺少 alt 属性的图片 |
| metadata 交叉检查 | title/description、OG、Twitter、JSON-LD 的标题与摘要一致；规范域名一致 |
| JSON-LD | WebSite/WebPage 类型、稳定且唯一的 @id、isPartOf 引用及页面语言检查通过；未虚构组织、价格、评分、下载地址 |
| robots / sitemap | 文本声明和 XML 解析通过；仅包含 https://soulora.ai/；本地 HTTP 均为 200 |
| 索引信号 | 未发现 noindex；未新增无必要的 meta robots。缺少显式 index,follow 不是问题。 |
| 内部链接与资源 | 33 个链接中的 32 个片段链接均有目标；无重复 ID；引用的本地静态资源和分享图存在 |
| 桌面浏览器 | title、canonical、JSON-LD 与源码一致；H1 可见；控制台未见错误；隐藏标签页状态正常 |
| 390px 移动端 | scrollWidth 为 390，无横向溢出；申请入口跳到 #early-access，目标可见且焦点正确 |
| 脚本加载失败回归 | 用仓库外临时页面引用不存在的脚本；no-js 保留，21 个 reveal 元素计算 opacity 均为 1，正文可读 |

本地 HTTP 服务器不执行 Vercel 重定向规则，不能用本地成功代替部署验证。JSON-LD 结构检查不等于搜索引擎富媒体结果资格或实际展示。

## 仍存在

- P0：真实账号、AI 服务、申请接收接口和下载渠道未上线。修复需要产品与后端工作，超出保持业务逻辑不变的约束。
- P1：日语、韩语及其他目标语言内容、语言导航及对应 hreflang 未建立；不能只加入指向不存在页面的语言标签。
- P1：功能、供应状态、下载、帮助等独立页面与跨页内部链接尚未建设。
- P1：运营主体、联系方式、正式隐私政策、条款和真实数据处理说明待提供；不能用猜测填充这些信息。
- P2：正文中的产品事实仍较分散，GEO 所需的第一手证明、实际能力说明和主体信息仍不完整。
- P2：首屏视频与海报体积、头像预加载、样式清理和浏览器缓存仍有优化空间；本次保留原有媒体及加载逻辑。
- P3：响应式图片变体和品牌化 404 页面尚未新增。

## 无法验证 / 部署后检查

- www 当前已知线上行为为 307。本地新增永久跳转规则后，仍需确认 Vercel 域名层是否优先执行旧配置。
- 正式域名的 metadata、robots、sitemap、响应标头和索引信号需要部署后重新抓取。本次修改尚未上线。
- 搜索引擎实际抓取、收录、选用的 canonical、排名、搜索量、自然流量与转化率：Unknown。
- Core Web Vitals：Not measured。前次审计的 PageSpeed API 返回 429 配额限制，没有有效 LCP/INP/CLS 数据。
- Google AI、ChatGPT、Gemini、Perplexity 引用及真实爬虫可达性：Unknown。

后续部署检查应覆盖首页、robots、sitemap、HTTP、www、index.html、追踪参数 URL 和随机不存在路径。多语言发布后再检查互相对应的 hreflang、自引用 canonical 和完整翻译。上述技术修复不保证收录、排名或 AI 引用。
