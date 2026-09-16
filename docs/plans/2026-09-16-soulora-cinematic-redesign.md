# Soulora Cinematic Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task.

**Goal:** Build a commercial-grade dark cinematic Soulora landing page with an honest early-access funnel and an interactive AI companion App concept.

**Architecture:** Keep the zero-dependency static architecture. Use semantic HTML for the content and progressive-enhancement fallbacks, a tokenized CSS system for the visual language and responsive behavior, and small modular vanilla-JavaScript controllers for navigation, scenario switching, concept interactions, motion, and form states.

**Tech Stack:** HTML5, CSS custom properties/grid/container queries/media queries, vanilla JavaScript, Vercel static hosting.

---

### Task 1: Establish the project design system

**Files:**
- Create: `DESIGN.md`
- Reference: `docs/plans/2026-09-16-soulora-cinematic-redesign-design.md`

**Steps:**
1. Define product identity, deep-sea semantic colors, typography, spacing, radii, motion, and accessibility rules.
2. Record Runway as a structural reference and explicitly list prohibited copying.
3. Verify all tokens map to roles rather than page-specific color names.

### Task 2: Rebuild the semantic page and commercial narrative

**Files:**
- Modify: `index.html`

**Steps:**
1. Add metadata, skip link, sticky navigation, and accessible mobile controls.
2. Implement the cinematic hero and living App concept visual.
3. Add the four-mode experience studio, companion-system section, daily timeline, safety section, FAQ, and preview application form.
4. Remove unverified metrics and ensure every product-status claim is honest.
5. Verify one H1, logical heading hierarchy, labels, landmarks, live regions, and valid anchor targets.

### Task 3: Build the deep-sea aurora visual and responsive system

**Files:**
- Modify: `styles.css`

**Steps:**
1. Define semantic tokens and reset/focus/reduced-motion foundations.
2. Style the cinematic canvas, immersive light fields, companion core, App preview, and product panels.
3. Implement motion states using transform and opacity.
4. Create responsive layouts for 360, 768, 1024, and 1440px with 44px controls and no overflow.
5. Add no-JavaScript and reduced-motion fallbacks.

### Task 4: Implement progressive product interactions

**Files:**
- Modify: `script.js`

**Steps:**
1. Add document-ready enhancement and resilient IntersectionObserver fallback.
2. Implement sticky navigation state and accessible mobile navigation.
3. Implement roving scenario tabs and synchronized panels.
4. Implement conversation state, memory permission state, breathing timer, and voice playback simulation.
5. Implement pointer-light effects only for fine pointers and disable them for reduced motion.
6. Implement honest form validation/loading/preview success and failure states without claiming transmission.

### Task 5: Verify, fix, and document delivery

**Files:**
- Modify as required: `index.html`, `styles.css`, `script.js`, `README.md`

**Steps:**
1. Run `node --check script.js` and validate `vercel.json`.
2. Serve locally and inspect runtime logs.
3. Visually review 360, 768, 1024, and 1440px in representative page segments.
4. Test mobile navigation, keyboard tabs, FAQ, breathing controls, voice controls, and every form state.
5. Test reduced motion and a 640px reflow proxy for 200% zoom.
6. Fix every clipping, overflow, contrast, focus, and unstable-layout issue found.
7. Update README with the interaction inventory, local preview, deployment, and remaining production integrations.

