# Soulora

Soulora 是一个以倾听、许可式记忆和清晰边界为核心的 AI 虚拟伴侣产品概念官网。

当前仓库交付的是商业级静态产品预览，不包含真实 AI 服务、用户账号、长期记忆、音频播放或邮件收集后端。页面会明确标识这些边界，不使用虚构下载入口、用户数字或安全认证。

## 体验内容

- Nocturne Presence 全屏视频首屏（使用项目所有者制作的 7.04 秒 `soulora-hero-background` 视频，提供 MP4 主源、WebM 兼容回退与 PNG 静态海报；视频以原始清晰度全屏呈现，不叠加模糊、雾层或粒子遮罩）
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

项目没有构建步骤或运行时依赖，可直接导入 Vercel 部署。

## 上线前配置

1. 为 `#access-form` 的 `data-endpoint` 配置真实、受保护的申请接口。接口接收 `email`、`moments`、`feedback`、`platform`、`researchOptIn`、`source` 与 `submittedAt` JSON 字段。
2. 补充正式域名的 canonical、Open Graph 分享图和联系主体。
3. 发布完整的隐私政策、服务条款、数据保留与删除说明。
4. 对真实产品的记忆、加密、危机响应和模型供应商进行合规与安全验证。
5. 在有证据后再添加用户规模、商店下载、合作品牌或认证信息。

## 设计与实施文档

- [`DESIGN.md`](DESIGN.md)
- [`docs/plans/2026-09-16-soulora-cinematic-redesign-design.md`](docs/plans/2026-09-16-soulora-cinematic-redesign-design.md)
- [`docs/plans/2026-09-16-soulora-cinematic-redesign.md`](docs/plans/2026-09-16-soulora-cinematic-redesign.md)
