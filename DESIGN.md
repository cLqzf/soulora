# Soulora Design System

## Product definition

- Product: Soulora
- Purpose: an AI companion concept that listens, remembers with permission, and respects personal boundaries.
- Primary audience: adults exploring calm, private, everyday AI companionship.
- Primary conversion: 申请首批体验.
- Personality: cinematic, intimate, precise, calm, quietly futuristic.
- Density: spacious marketing canvas with compact App concept surfaces.
- Primary Web reference: Runway, for cinematic hierarchy, low-chrome presentation, and product imagery as narrative.
- Never copy: third-party logos, assets, typefaces, brand colors, proprietary copy, or interface screenshots.

## Visual theme — Deep Sea Aurora

Soulora uses an obsidian-blue canvas illuminated by controlled deep teal, mist blue, and rare warm-gold light. Gradients communicate presence and state; they are not decorative fills applied to every component.

### Semantic color tokens

| Role | Value | Usage |
|---|---|---|
| Canvas | `#05080B` | Primary page background |
| Canvas deep | `#020405` | Hero and footer depth |
| Surface | `#0B1115` | Product panels and cards |
| Surface raised | `#10191E` | Selected and floating controls |
| Surface glass | `rgba(13, 24, 29, .72)` | Navigation and overlays |
| Text primary | `#F4F8F7` | Headings and essential content |
| Text secondary | `#A7B6B8` | Body copy |
| Text tertiary | `#728488` | Labels and metadata |
| Border | `rgba(190, 225, 221, .13)` | Hairlines |
| Border strong | `rgba(190, 225, 221, .26)` | Hover and selected borders |
| Accent | `#85D8D0` | Primary interactive color |
| Accent strong | `#B8F2EB` | High-emphasis state |
| Mist | `#82A9BF` | Secondary spectral color |
| Warm | `#D8BE8B` | Rare warmth and human presence |
| Success | `#8ED6B0` | Confirmed local state |
| Warning | `#E0C386` | Preview and pending state |
| Danger | `#F08E8E` | Invalid and destructive state |
| Focus | `#B8F2EB` | Keyboard focus ring |

## Typography

- Font stack: `Inter`, `SF Pro Display`, `PingFang SC`, `Microsoft YaHei`, system UI. No remote font dependency.
- Display: fluid `48–96px`, 520 weight, line-height `0.98–1.08`, tight tracking.
- Section title: fluid `36–64px`, 520 weight, line-height `1.08`.
- Card title: `18–24px`, 560 weight.
- Body: `16–18px`, line-height `1.7`.
- Compact body: `14px`, line-height `1.6`.
- Labels: `11–13px`, 600 weight, positive tracking where uppercase.
- Numeric data uses tabular figures.

## Geometry and spacing

- Base unit: 4px.
- Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 112, 144.
- Compact radius: 10px.
- Standard card radius: 18px.
- Prominent panel radius: 28px.
- Pills are reserved for statuses, filters, and compact actions.
- Depth comes from surface contrast, light, blur, and hairlines; avoid heavy drop shadows.

## Motion

- Fast feedback: 160–220ms.
- Standard transition: 320–480ms.
- Section reveal: 700–900ms.
- Ambient motion: 8–24s and low amplitude.
- Animate transform, opacity, filter, and custom gradient positions where practical.
- Reduced motion removes continuous animation, smooth scrolling, parallax, staged delays, and auto-progress.

## Components

- Primary CTA: light accent surface, dark label, minimum 48px height.
- Secondary CTA: transparent/raised surface with hairline border, minimum 48px height.
- Product panels: dark surface, subtle top-edge highlight, 18–28px radius.
- Tabs: real buttons with `aria-selected`, visible focus, and a selected spectral edge.
- Inputs: persistent visible labels; default, focus, invalid, loading, success, and disabled states.
- Status must never rely on color alone.

## Accessibility and responsive behavior

- WCAG AA contrast for all essential text and controls.
- Minimum 44×44px pointer/touch target.
- Visible 2px `:focus-visible` ring with offset.
- One H1 and logical headings; skip link and semantic landmarks.
- Baseline widths: 360, 768, 1024, 1440px; usable 640px reflow proxy for 200% zoom.
- No essential information appears only on hover or through motion.
- Mobile navigation preserves current location and the primary CTA.

