# love-u — Anniversary Storytelling Site · Design Brief

> Author: Orchestrator (Opus). Implementer: Sonnet. This is the source of truth for the build.
> The feeling in one sentence: **a hand-pressed daisy keepsake you scroll through — a love letter where flowers bloom, petals drift, and memories develop like film as you move down the page.**

---

## 0. Role split
- **Design (done, this doc):** concept, art direction, palette, type, motion system, section specs.
- **Implementation (Sonnet):** scaffold the project, build every section per spec, wire GSAP + Lenis, create elegant on-theme placeholders, expose a single content config for later personalization.
- **Audit (Orchestrator):** run build + dev server, browser-check desktop & mobile, feed back fixes.

---

## 1. Stack (non-negotiable)
- **Vite + React 18 + TypeScript**
- **Tailwind CSS v3** (stable; not v4) with a custom theme (tokens below)
- **GSAP** + **ScrollTrigger** + **@gsap/react** (`useGSAP`)
- **Lenis** (`lenis` package) as the single smooth-scroll transport, synced to ScrollTrigger
- Google Fonts via `<link>` in `index.html` (Fraunces, Inter, Caveat)
- No component libraries, no state managers. Keep it lean.

Registration: register GSAP plugins **once** at app root. One Lenis instance in a provider/hook, RAF loop drives `ScrollTrigger.update()`.

---

## 2. Art direction — "Daisy-tone"
Soft, warm, editorial, tactile paper. Ivory/cream ground, warm ink, butter-gold daisy accent, sage stem green, a whisper of blush. NO purple gradients, NO glassmorphism, NO neon glow. Think pressed-flower journal + fine stationery.

### Color tokens (define as CSS variables + Tailwind theme)
```
--cream:      #FBF6EA   /* page background, paper */
--cream-2:    #F4ECD9   /* alt band background */
--ivory:      #FFFDF7   /* cards / lifted surfaces */
--ink:        #2E2822   /* primary text, warm near-black */
--ink-soft:   #6B5F4E   /* secondary text, taupe */
--gold:       #E8B23A   /* daisy center — primary accent */
--gold-deep:  #C8922A   /* accent hover/pressed */
--sage:       #8C9A6B   /* stem green — secondary accent */
--sage-deep:  #6E7C4E
--blush:      #E7A79C   /* tender accent, use sparingly */
--line:       #E2D6BE   /* hairline rules, borders */
```
Tailwind names: `bg-cream`, `bg-cream-2`, `bg-ivory`, `text-ink`, `text-ink-soft`, `text-gold`, `bg-gold`, `text-sage`, `border-line`, etc.

Contrast: body text = `--ink` on `--cream` (passes AA). Gold is decorative/emphasis, never small body text on cream.

### Texture
- Subtle paper grain: one tiling SVG/PNG noise at very low opacity (`~4%`) as a fixed overlay, `pointer-events-none`, `mix-blend-multiply`. Keep it faint. Generate as an inline SVG feTurbulence data-uri — no external asset.

### Typography
- **Display:** `Fraunces` (variable) — headings, oversized editorial type. Use optical sizing, weight 300–600, allow the "soft"/wonky character. `text-balance` on headings.
- **Body / UI / metadata:** `Inter` — captions, labels, dates, counters. Uppercase tracked labels for metadata (`tracking-[0.2em]`, `text-xs`).
- **Handwriting accent:** `Caveat` — ONLY for the closing letter body + signature and a couple of small margin notes. Never for long UI text.
- Line-height: headings tight (`leading-[0.95]`–`1.05`), body relaxed (`leading-relaxed`). Never letter-spacing below 0.

---

## 3. Motion system
- **Transport:** Lenis smooth scroll. Do not add native `scroll-behavior: smooth`.
- **Choreography:** GSAP timelines via `useGSAP`, scoped to each section ref; ScrollTriggers cleaned up by `useGSAP` context.
- **Primary reveal** per section: oversized heading + key media. **Secondary:** metadata/caption stagger. **Tertiary:** hover/pointer micro-response.
- Defaults:
  - Reveals: `y: 32, opacity: 0 → `, `duration 0.7`, `power3.out`, `toggleActions: "play none none reverse"`, `start: "top 78%"`.
  - Metadata stagger `0.05`; cards/list `0.1`.
  - Cinematic scrubs: `scrub: 1`. Exact-sync only where physical.
  - Transforms/opacity only. Animate width/height/top/left **never** during scroll.
- **Signature motion:** an animated **daisy bloom** — an inline SVG daisy whose petals scale+rotate in from center on load (hero) and again at the closing. Reusable `<DaisyBloom/>` component driven by GSAP.
- **Ambient petals:** a few (`6–10` desktop, `≤4` mobile) SVG petals drifting slowly with GSAP (`x/y/rotation`, yoyo/repeat), `position:fixed`, `pointer-events-none`, behind content, very low opacity. Isolated layer; must not cause layout thrash.
- **Reduced motion:** wrap ambient + scrub choreography in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. Under reduced motion: content appears with simple fades or no motion; no petals, no pin scrubs.
- **Desktop-only pinning:** any pinned/horizontal choreography gated with `matchMedia` `(min-width: 768px)`. Mobile = clean natural-flow vertical reveals.

---

## 4. Mobile-first rules
- Design and verify at **375px first**, then enhance up.
- `min-h-dvh` / `h-dvh` for full-screen sections (handles mobile browser chrome).
- No fixed-height cards for variable copy. Use `min-h`, aspect ratios, grid `minmax(0,1fr)`, wrapping text.
- Type scales via discrete breakpoints (`text-4xl md:text-6xl lg:text-8xl`), not raw viewport units for body.
- Touch targets ≥ 44px. Hover content must also be reachable/visible on touch (no hover-only critical info).
- Ambient/pinned effects reduced or disabled on mobile.

---

## 5. Content model — SINGLE source the user edits later
Create `src/content/story.ts` exporting one typed object. ALL copy, names, dates, image paths, and counts live here so the user personalizes in one file. Use clearly-marked placeholder values now.

```ts
export const story = {
  couple: { you: "{{YOUR_NAME}}", her: "{{HER_NAME}}" },
  anniversary: {
    label: "Our Anniversary",
    togetherSince: "2023-07-10", // ISO; used for the live day-counter
    headline: "Happy Anniversary",
  },
  intro: {
    kicker: "Every love has a beginning",
    body: "{{One or two warm sentences about how it started.}}",
    image: "/assets/couple/photo-01.jpg",
  },
  chapters: [ // 4–5 memory chapters for the timeline
    { date: "Jul 2023", title: "The day we met", body: "{{...}}", image: "/assets/couple/photo-02.jpg" },
    // ...
  ],
  gallery: [ // 5–8 images
    { src: "/assets/couple/gallery-01.jpg", caption: "{{...}}" },
  ],
  reasons: [ // "reasons I love you" — 5–7 short lines
    "{{Your laugh}}", "{{The way you...}}",
  ],
  milestones: [ // counters "by the numbers"
    { value: 365, suffix: "", label: "days together" },
    { value: 12,  suffix: "", label: "trips taken" },
    { value: 0,   suffix: "∞", label: "inside jokes", displayInfinity: true },
  ],
  letter: {
    salutation: "My dearest {{HER_NAME}},",
    body: "{{The heartfelt letter — a few short paragraphs.}}",
    signoff: "Forever yours,",
    signature: "{{YOUR_NAME}}",
  },
} as const;
```
Add a short `README.md` section: "How to personalize — edit `src/content/story.ts` and drop your photos in `public/assets/couple/` using the same filenames."

---

## 6. Placeholder assets (build now, swap later)
Do NOT ship broken image boxes. Create a `Figure`/`Placeholder` component that renders an elegant on-theme placeholder when the real image is missing: cream-2 fill, a faint centered `<DaisyBloom/>` glyph, and a tiny caption chip like `photo-01 · replace me`, correct aspect ratio. Real `<img>` (lazy, `object-cover`, meaningful `alt`) is used when present. Also drop a few actual placeholder files in `public/assets/couple/` (generated SVGs saved as `.svg`, or reference-safe) so layout reads as real. Keep filenames matching `story.ts`.

---

## 7. Section-by-section spec (one strong scroll narrative)
Order matters; this is the whole page. Keep it cohesive — the daisy-field journey.

1. **Cover (hero)** — `min-h-dvh`, cream. Oversized Fraunces headline (`story.anniversary.headline`) revealed by line-mask on load. Couple names + `togetherSince` as tracked metadata. A `<DaisyBloom/>` blooms center/behind on load. Live **day-counter** ("N days, and counting"). Ambient petals begin. Scroll cue at bottom. Useful first viewport — no pure splash.

2. **Intro / Prologue** — cream. Editorial two-column on desktop (kicker + body on one side, masked photo reveal on the other), single-column stacked on mobile. Clip-path/`scaleY` mask reveal on the image tied to scroll (`scrub`). Big pull-quote in Fraunces.

3. **Our Story — timeline** — the centerpiece. Sticky **date rail** (left column desktop; top sticky chip on mobile) showing the current chapter's date. Chapters flow in **natural height** (no fixed cards). Each chapter: date label, Fraunces title, body, and a `Figure`. Scroll-reveal per chapter (`toggleActions`). A thin vertical **stem line** with a small daisy node at each chapter marker that "blooms" as it enters. 4–5 chapters from `story.chapters`.

4. **Moments — gallery** — desktop: horizontal scroll-scrub gallery (pinned, `matchMedia ≥768px`, total content width measured; never taller than viewport). Mobile: clean vertical stack with gentle parallax per image (transform only). Captions visible, not hover-only.

5. **Reasons I love you** — cream-2 band. Numbered list (`01, 02, …`) of short lines from `story.reasons`, revealed with word/line stagger (short lines only — safe for SplitText-style, but prefer simple line reveal). Oversized index numerals in gold/sage.

6. **By the numbers — milestones** — 3 counters from `story.milestones`. Numbers tween up on enter (ScrollTrigger, once). `displayInfinity` shows `∞`. Sage/gold accents, hairline rules, editorial metadata character.

7. **The letter — closing** — ivory/paper, warmest moment. `Caveat` letter revealed line-by-line as it enters. Salutation, body paragraphs, signoff, handwritten signature. A final `<DaisyBloom/>` blooms on entry. Small closing line (e.g. "Here's to forever"). This is the emotional payoff — give it room and calm.

Footer: minimal — a tiny daisy glyph + `{{YOUR_NAME}} ♥ {{HER_NAME}}` + year. No social spam.

---

## 8. Structure & quality
- `src/components/` (sections + `DaisyBloom`, `Figure`, `Petals`, `SectionLabel`), `src/hooks/` (`useLenis`), `src/content/story.ts`, `src/lib/gsap.ts` (registration).
- Semantic landmarks (`<main>`, `<section aria-label>`, `<h1>` once), focus-visible states, `alt` text from captions, external links `rel="noreferrer"` (none expected).
- `overflow-x: hidden` on the root to catch petal/drift bleed; body must never scroll horizontally.
- Provide `npm run dev`, `npm run build`, `npm run lint`. Build must pass clean.
- Create `.claude/launch.json` with a `dev` config (vite, port 5173) for audit.

## 9. Definition of done (Sonnet self-check before handoff)
- [ ] `npm run build` passes; `npm run dev` serves with no console errors.
- [ ] 375px: no clipped text, no horizontal scroll, motion is simple/natural, all copy visible.
- [ ] Desktop: hero bloom + line reveal, timeline sticky rail, gallery scrub, counters, letter reveal all work.
- [ ] `prefers-reduced-motion` path verified (no petals/scrubs, content still fully visible).
- [ ] All content pulls from `story.ts`; swapping a photo filename Just Works.
- [ ] Report anything skipped or uncertain for the orchestrator's audit.
</content>
</invoke>
