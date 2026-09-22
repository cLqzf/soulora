# Soulora 发布前调研后台

## 收集边界

首页只有 `#access-form` 是可提交的真实调研入口。其他聊天/记忆/语音组件仍是本地产品演示。表单不代表产品账号、等候名单或营销订阅。管理员可以筛选、查看、标记处理状态、导出当前页 CSV；没有公开读取接口。

## 启用顺序

1. 新建 Soulora 专用 Supabase 项目，区域选 **Southeast Asia (Singapore) / AWS `ap-southeast-1`**。不要复用现有 FaceEnjoy 项目或把调研个人信息写入其他产品数据库。创建后在新项目的 SQL Editor 执行 [`supabase/migrations/202609220001_feedback.sql`](../supabase/migrations/202609220001_feedback.sql)，确认 RLS 已开启。不要把数据库密码或任何服务角色密钥提交到仓库。
2. Supabase Authentication 中禁用公开自助注册，仅邀请管理员，使用强密码。创建管理员后查其 `auth.users.id`，用 SQL Editor 执行 `insert into public.admin_users (user_id) values ('管理员的 UUID');`。只有列入此表的用户可以看反馈；从表中删除即撤销查询权限（已有 JWT 失效前仍可通过其他授权渠道登录，但 RLS 立即拒绝读取）。当前控制台只实现密码登录，尚未实现 MFA 挑战流程；若要求强制 MFA，须先补齐该流程或采用部署侧身份访问控制。
3. 补齐公开运营主体、联系地址、适用法律、新加坡数据处理与可能的跨境访问说明、具体保留期限和删除执行办法，请适用地区的法律顾问核对隐私告知；在 Vercel 防火墙为 `/api/feedback` 配置限流/反滥用规则。现有蜜罐和邮箱唯一约束不等于完整的垃圾提交防护。
4. 网站 Vercel 项目的 Production/Preview 环境变量配置 `SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`（服务角色仅在服务器端），重新部署；变量清单可参考根目录 `.env.example`。默认 `FEEDBACK_COLLECTION_ENABLED` 缺失时接口仍禁用。准备好后只在目标环境设 `FEEDBACK_COLLECTION_ENABLED=true` 并重新部署。
5. `GET https://soulora.ai/api/feedback` 应返回 `{ "available": true }`；现场测试表单提交、管理员查询、无管理员读取被 RLS 拒绝、重复邮箱的统一成功响应、失败时表单保留原值，以及数据请求的查找与删除流程。不要用真实访客信息做测试。

独立后台位于 `dashboard/`。把它作为另一个 Vercel 项目的根目录部署，配置该项目的 `SUPABASE_URL` 和 **`SUPABASE_ANON_KEY`**（这是公开客户端密钥，不是 service_role），`dashboard/api/config.js` 会提供浏览器配置。不要在后台项目里配置 service_role。若本地只用静态服务器预览，可复制 `dashboard/config.example.js` 为 `dashboard/config.js` 并填写公开配置，文件已被 `.gitignore` 排除。独立项目需要 HTTPS，建议加访问控制与 `noindex`。后台 JWT 仅在页面内存中，刷新会退出；不要在公共电脑登录，CSV 导出是敏感个人信息，应存放在受控设备并及时销毁。

## 运维与数据请求

- 管理台分页每页 50 条；“Export displayed CSV”仅导出当前筛选的这一页，不是全库备份。CSV 单元格做了公式注入转义。
- 访谈邀约只联系 `research_opt_in=true` 的记录。其他邮箱只用于调研记录管理/身份核对，不作群发营销。
- 按已公布的保留期限定期清理。核验请求人身份后，在 Supabase 管理后台用该邮箱定位记录并处理访问/更正/删除；若需要 SQL 删除，先确认精确邮箱与影响行数，再执行精确目标删除，记录处理结果。邮件往来和托管日志还需分别处理。
- 目前不收集表单 IP，也不自动发确认邮件。分析指标应优先使用聚合数据；未经新告知和许可，不把这批调研信息并入未来的聊天/记忆数据库。
