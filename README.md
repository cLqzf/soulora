# Soulora

Soulora 是一个以倾听、许可式记忆和清晰边界为核心的 AI 虚拟伴侣产品概念官网。

当前仓库交付的是商业级静态产品预览，不包含真实 AI 服务、用户账号、长期记忆、音频播放或邮件收集后端。页面会明确标识这些边界，不使用虚构下载入口、用户数字或安全认证。

## 体验内容

- 深海极光电影化品牌首屏
- 倾听、记忆、呼吸、声音四种可操作 App 概念
- 陪伴上下文、分层记忆、边界开关和回应节奏展示
- 日常陪伴时间轴
- 隐私控制中心概念
- 申请体验表单的校验、加载、预览成功和接口失败状态
- 键盘导航、移动菜单、低动态模式与响应式适配

## 本地预览

```bash
python3 -m http.server 4173
```

打开 `http://127.0.0.1:4173`。

## 部署

项目没有构建步骤或运行时依赖，可直接导入 Vercel 部署。

## 上线前配置

1. 为 `#access-form` 的 `data-endpoint` 配置真实、受保护的申请接口。
2. 补充正式域名的 canonical、Open Graph 分享图和联系主体。
3. 发布完整的隐私政策、服务条款、数据保留与删除说明。
4. 对真实产品的记忆、加密、危机响应和模型供应商进行合规与安全验证。
5. 在有证据后再添加用户规模、商店下载、合作品牌或认证信息。

## 设计与实施文档

- [`DESIGN.md`](DESIGN.md)
- [`docs/plans/2026-09-16-soulora-cinematic-redesign-design.md`](docs/plans/2026-09-16-soulora-cinematic-redesign-design.md)
- [`docs/plans/2026-09-16-soulora-cinematic-redesign.md`](docs/plans/2026-09-16-soulora-cinematic-redesign.md)
