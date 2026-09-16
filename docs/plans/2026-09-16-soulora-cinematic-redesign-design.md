# Soulora Cinematic Companion OS — Design Specification

## Product goal

Transform Soulora from a visual concept landing page into a commercial-grade product preview whose primary conversion is **申请首批体验**. The site must build trust through an interactive product concept, clear data boundaries, and honest product-state messaging rather than fabricated metrics or certifications.

## Direction

- Surface: responsive Web marketing site with an embedded App concept experience.
- Personality: cinematic, intimate, precise, calm, quietly futuristic.
- Visual system: **深海极光** — obsidian canvas with deep teal, mist blue, and restrained warm-gold light.
- Reference: Runway-inspired cinematic hierarchy, large product imagery, editorial pacing, and low-chrome presentation. Do not copy its brand, assets, font, color values, or language.
- Primary action: 申请首批体验.
- Product state: clearly identified as a concept preview; no false implication that an App Store release or live AI service already exists.

## Information architecture

1. Sticky navigation with product status and a single primary CTA.
2. Cinematic hero combining the value proposition, living companion core, and App conversation preview.
3. Interactive experience studio with four modes: 倾听、记忆、呼吸、声音.
4. Companion system explaining context, boundaries, response, and user-controlled memory.
5. Day-in-the-life timeline with concrete morning, work, and night moments.
6. Privacy and safety controls with honest statements and no unverifiable claims.
7. FAQ and early-access form with explicit preview behavior until a real endpoint is configured.
8. Commercial footer with product-state and contact placeholders.

## Interaction system

- Pointer-responsive ambient light and subtle depth in the hero; touch devices receive a stable composition.
- Low-frequency breathing and refraction for the companion core.
- Progressive section reveal using opacity and transform only.
- Interactive scenario tabs with visible selected state and keyboard support.
- Conversation concept with staged listening/thinking/responding feedback.
- Memory permission controls that can allow, edit, or reject a proposed memory.
- A controllable breathing timer with start, pause, resume, and finish states.
- A voice concept with animated waveform, play/pause state, and a transcript.
- Mobile navigation with focus-safe open/close behavior.
- Every animation has a `prefers-reduced-motion` equivalent.

## Trust boundaries

- Remove the unverified “12,000+” claim and all implied certifications.
- Describe security and memory behavior as design principles or intended controls, not shipped guarantees.
- Identify Soulora as AI and state that it does not replace professional medical or psychological services.
- Do not persist or transmit email until a real backend is configured; the preview form must say so.
- Do not create fake customer logos, testimonials, downloads, ratings, or store badges.

## Responsive and accessibility requirements

- Validate at 360, 768, 1024, and 1440px.
- Maintain minimum 44px touch targets and a visible 2px `:focus-visible` ring.
- No horizontal page overflow; product previews may recompose but must not crop essential controls.
- Preserve usability at a 640px reflow proxy for 200% desktop zoom.
- Use semantic landmarks, one H1, logical headings, skip navigation, persistent input labels, and live regions.
- Core content must remain readable when JavaScript is unavailable.

## Success criteria

- Visitors can understand the product, operate at least four concept interactions, and reach the early-access CTA without ambiguity.
- The site looks intentional and complete across target sizes.
- All shipped claims are supportable by the current repository state.
- JavaScript and JSON pass static validation; runtime has no project-originated console errors.

