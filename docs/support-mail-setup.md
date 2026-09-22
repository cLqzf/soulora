# support@soulora.ai 邮箱开通清单

最初检查时 Cloudflare 只有根域与 `www` 两条指向 Vercel 的 CNAME，以及 Google Search Console TXT。用户随后完成 DNS 配置；2026-09-22 复查 Cloudflare 权威服务器和 1.1.1.1，以下五条飞书记录均已可见。不要改动网站 CNAME，也不要删除 Google 的验证 TXT。

## 截图要求的记录

在 Cloudflare → `soulora.ai` → DNS → 记录中逐条新增：

| 名称 | 类型 | 内容 | 优先级 | TTL |
| --- | --- | --- | ---: | --- |
| `@` | TXT | `verification-code-site-App_lark=lLu6qBeLUZDby9Z0Tfwd` | — | 10 分钟 |
| `@` | TXT | `v=spf1 +include:spf.onlarksuite.com -all` | — | 10 分钟 |
| `@` | MX | `mx1.larksuite.com` | 1 | 10 分钟 |
| `@` | MX | `mx2.larksuite.com` | 5 | 10 分钟 |
| `@` | MX | `mx3.larksuite.com` | 10 | 10 分钟 |

Cloudflare 的 MX 与 TXT 记录没有橙云代理选项。根域允许多条不同用途的 TXT，但只能有一条 `v=spf1`；如果将来另有发信平台，应合并进同一条 SPF，而不是再新增一条。Cloudflare 如不支持指定 600 秒，选择最接近的可用 TTL，通常 Auto 也能正常验证。不要在 Cloudflare 同时启用 Email Routing，否则可能与飞书 MX 冲突。

公共 TXT 验证码开头是小写字母 `l`、大写字母 `L`（`lLu6…`），容易与大写 `I` 混淆。用户已确认飞书域名验证通过，`support@soulora.ai` 已创建并从外部邮箱成功收到测试邮件。仍需按飞书管理后台提供的 DKIM selector 与值配置 DKIM；DMARC 可从 `_dmarc` TXT 的 `v=DMARC1; p=none; rua=mailto:...` 监控策略起步，确认发信对齐后再收紧，不要臆造 DKIM 公钥或报告地址。

基于用户确认的外部收件测试，全站客服与隐私请求联系方式已切换为 `support@soulora.ai`。域名验证与收件成功不自动证明外发认证已完成；在正式对外发信前，仍应做发件测试并检查 SPF、DKIM、DMARC 结果。
