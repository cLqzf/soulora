# Soulora Design System

## Product definition

- Product: Soulora
- Purpose: an AI companion concept that listens, remembers with permission, and respects personal boundaries.
- Primary audience: adults exploring calm, private, everyday AI companionship.
- Primary conversion: 申请首批体验.
- Personality: intimate, cinematic, minimal, human, quietly futuristic.
- Density: spacious marketing canvas with compact App concept surfaces.
- Primary Web reference: Animates, for full-screen character-led storytelling, near-black restraint, white typography, minimal chrome, and high-contrast conversion controls.
- Secondary component and licensed-media source: Vidu Stream Avatar, used for the realtime-avatar selector, authorized character imagery, character-library structure, and clearly attributed capability targets (540P, 25 FPS, long-form generation, and voice customization).
- Never copy: unlicensed third-party logos, assets, typefaces, brand colors as exact values, proprietary copy, or interface screenshots. Vidu imagery stored under `assets/vidu/` is included under the product owner's confirmed usage authorization.

## Visual theme — Nocturne Presence

Soulora uses a near-black cinematic canvas with warm-white rim light, restrained midnight blue, and a trace of muted wine red. The companion silhouette is the dominant emotional image. UI color is intentionally sparse: white carries hierarchy and conversion, while blue and red appear only as atmospheric light or state context.

### Semantic color tokens

| Role | Value | Usage |
|---|---|---|
| Canvas | `#080809` | Primary page background |
| Canvas deep | `#020203` | Hero and footer depth |
| Surface | `#0D0D10` | Product panels and cards |
| Surface raised | `#151519` | Selected and floating controls |
| Surface glass | `rgba(8, 8, 10, .78)` | Navigation and overlays |
| Text primary | `#FFFDFA` | Headings and essential content |
| Text secondary | `#C5C1BD` | Body copy |
| Text tertiary | `#817E7B` | Labels and metadata |
| Border | `rgba(255, 252, 247, .13)` | Hairlines |
| Border strong | `rgba(255, 252, 247, .28)` | Hover and selected borders |
| Accent | `#F1EEE8` | Primary interactive color |
| Accent strong | `#FFFFFF` | High-emphasis state |
| Mist | `#7690C9` | Restrained midnight-blue atmosphere |
| Warm | `#A84758` | Restrained wine-red atmosphere |
| Success | `#A9CFB8` | Confirmed local state |
| Warning | `#D7C49D` | Preview and pending state |
| Danger | `#E58B95` | Invalid and destructive state |
| Focus | `#FFFFFF` | Keyboard focus ring |

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
- Hero atmosphere: three authorized Vidu portraits crossfade across an 18s cycle with subtle camera breathing, while 11–18s luminous-blue ground fog, boundary-free 6–9s rim-light pulses, and right-biased warm canvas embers continue independently. Reduced motion fixes the hero on the first portrait.
- Animate transform, opacity, filter, and custom gradient positions where practical.
- Reduced motion removes continuous animation, smooth scrolling, parallax, staged delays, and auto-progress.

## Components

- Primary CTA: light accent surface, dark label, minimum 48px height.
- Secondary CTA: transparent/raised surface with hairline border, minimum 48px height.
- Product panels: dark surface, subtle top-edge highlight, 18–28px radius.
- Tabs: real buttons with `aria-selected`, visible focus, and a selected spectral edge.
- Realtime avatar lab: licensed Vidu character media paired with four keyboard-accessible Soulora presence options. Character, tone, dialogue, and image change together; supplier capabilities are labeled as planned integration targets, never as shipped functionality.
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
