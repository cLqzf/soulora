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

### Brand mark

- The approved Soulora mark is a fluid, luminous 3D `S` on a deep-ocean background.
- The sole owner-supplied master is preserved without redrawing at `assets/brand/soulora-mark-master.png`.
- Navigation and footer wordmarks use the transparent `assets/brand/soulora-mark-ui-512.webp` as the first letter of `Soulora`, followed by the visible text `oulora`.
- Product-avatar and conversion placements reuse the same transparent cutout instead of showing the mark inside a square tile.
- Hover and keyboard focus may wake the mark with a restrained tilt. The `S` mark and `oulora` share one exact 4.5-second sweep timeline, with content-masked highlights that illuminate both simultaneously without brightening the surrounding background, then rest for approximately three seconds. The `oulora` wordmark also carries a faint downward cool-blue/violet glyph glow for atmosphere, with only a slight focus/hover lift. Reduced-motion mode removes the idle pulse, tilt, and sweep.
- The light-sweep mask is `assets/brand/soulora-mark-mask-256.png`; browser, home-screen, PWA, and social-sharing variants live beside it and must be regenerated from `soulora-mark-master.png` when the master changes.
- Keep the mark's aspect ratio intact and do not recolor, stretch, rotate, mask into a circle, or place it over a competing blue glow.

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
- Hero display: extra-bold, tightly tracked system sans with one restrained script-style keyword for human warmth; the script treatment is an owned visual device, not a copied third-party font file. Stacked display lines keep a small responsive gap so dense letterforms never collide.
- Display: fluid `48–118px`, 520–850 weight, line-height `0.86–1.08`, tight tracking.
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

### Editorial chapter rhythm

- Everything after the Hero follows a consistent editorial chapter cadence: a quiet eyebrow, one dominant statement, supporting copy, then the interactive product surface.
- Section boundaries use restrained hairlines and atmospheric tonal shifts instead of boxed page bands. Anchor targets reserve the fixed-header safe area at every supported breakpoint.
- On desktop, a compact right-edge chapter navigator appears only after the Hero has mostly left the viewport. It mirrors the active chapter with `aria-current` and remains hidden on narrower screens where it would compete with content.
- The System chapter uses an asymmetric 12-column composition: Context is the primary seven-column canvas, Memory and Boundary are supporting modules, and Response Rhythm spans the full row.
- Everyday Moments uses a staggered three-panel storyboard on desktop. At tablet and mobile widths it becomes a keyboard-accessible horizontal `scroll-snap` sequence that deliberately reveals part of the next card as a swipe cue.

## Motion

- Fast feedback: 160–220ms.
- Standard transition: 320–480ms.
- Section reveal: 700–900ms.
- Ambient motion: 8–24s and low amplitude.
- The header brand lockup uses synchronized, content-masked 45° highlights across the `S` and `oulora`, followed by approximately three seconds of stillness. It is decorative, non-blocking, and disabled by reduced-motion preferences.
- On desktop and landscape tablet, the three Hero product principles sit in a centered bottom safe area without a divider line. Portrait tablet keeps the principles anchored within the lower Hero grid; mobile omits this secondary group to protect the primary message and actions.
- Hero atmosphere: the user-authored 7.04s `soulora-hero-background` video fills the hero as a crisp, full-bleed background, with H.264 MP4 as the primary source, VP9 WebM compatibility fallback, and a static PNG poster. WeChat/X5 inline attributes, `WeixinJSBridgeReady`, visibility recovery, and first-interaction retry support embedded-browser autoplay; if playback is still policy-blocked, the matching poster remains visible instead of a black frame. All legacy blur, fog, rim, ground-glow, particle, and hero-mask layers are disabled so the source video renders cleanly without a softening overlay. Reduced motion pauses the video on its first frame.
- Animate transform, opacity, filter, and custom gradient positions where practical.
- Reduced motion removes continuous animation, smooth scrolling, parallax, staged delays, and auto-progress.
- Chapter arrival feedback is a brief opacity/translate transition and never blocks reading or interaction. Hover, focus, click, and scroll all resolve to the same visible state for interactive story cards.

## Components

- Primary CTA: light accent surface, dark label, minimum 48px height.
- Secondary CTA: transparent/raised surface with hairline border, minimum 48px height.
- Product panels: dark surface, subtle top-edge highlight, 18–28px radius.
- Tabs: real buttons with `aria-selected`, visible focus, and a selected spectral edge.
- Realtime avatar lab: licensed Vidu character media paired with four keyboard-accessible Soulora presence options. Character, tone, dialogue, and image change together; supplier capabilities are labeled as planned integration targets, never as shipped functionality.
- Inputs: persistent visible labels; default, focus, invalid, loading, success, and disabled states.
- Status must never rely on color alone.
- In-page navigation is intercepted only for same-document hash links. Each public hash ID lives on the chapter's real core-content element rather than its padded outer section, so native anchor fallback also removes decorative top whitespace. Ordinary chapters align their headings 12–14px below the fixed header. Early Access prefers its complete `.access-inner` conversion block 12–28px from the top of the desktop visual viewport—where the transparent header leaves the center clear—while mobile retains a header-safe offset. Its section fills at least the visual viewport and its scroll destination stays between both section boundaries, so neither the previous chapter above nor the next chapter below is exposed on arrival. A post-animation measurement corrects every chapter for font, browser-chrome, or visual-viewport drift unless the user has deliberately interrupted the scroll.

## Accessibility and responsive behavior

- WCAG AA contrast for all essential text and controls.
- Minimum 44×44px pointer/touch target.
- Visible 2px `:focus-visible` ring with offset.
- One H1 and logical headings; skip link and semantic landmarks.
- Baseline widths: 360, 768, 1024, 1440px; usable 640px reflow proxy for 200% zoom.
- At widths up to 720px, the complete Hero message and CTA group is vertically centered in the space below the navigation rather than resting against the lower edge.
- Mobile Hero height follows the visible/dynamic viewport instead of enforcing an 800px minimum, honors notch and home-indicator safe areas, compresses typography and controls on screens up to 700px tall, and uses a dedicated compact landscape layout up to 520px tall.
- At 721–980px in portrait orientation, the Hero message remains centered in the upper reading field while the three product principles anchor to the lower edge of the first viewport.
- No essential information appears only on hover or through motion.
- Mobile navigation preserves current location and the primary CTA.
