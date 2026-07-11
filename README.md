# love-u — an anniversary keepsake, built to scroll through

A hand-pressed daisy keepsake you scroll through: a love letter where flowers
bloom, petals drift, and memories develop like film as you move down the
page.

Built with Vite, React 18, TypeScript, Tailwind CSS, Three.js, GSAP +
ScrollTrigger, and Lenis smooth scroll.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint      # oxlint
```

## How to personalize

Everything you'd want to change — names, dates, copy, photos, counters —
lives in **one file**: [`src/content/story.ts`](./src/content/story.ts).

1. Open `src/content/story.ts` and replace every `{{PLACEHOLDER}}` value:
   your name, her name, the date you got together, the story chapters, the
   gallery captions, the "reasons I love you" lines, the milestone counters,
   and the closing letter.
2. Drop your real photos into `public/assets/couple/`, using the **same
   filenames** already referenced in `story.ts` (`photo-01.svg` →
   `photo-01.jpg`, `gallery-03.svg` → `gallery-03.jpg`, etc. — any image
   format works, just update the extension in `story.ts` to match). Swapping
   a filename just works: the `Figure` component renders your photo as soon
   as the file exists, and falls back to an on-theme placeholder (never a
   broken image) if it's missing.
   Add the closing video as `public/assets/couple/ending.mp4`; it fills the
   final screen, plays muted when scrolled into view, and includes a sound toggle.
3. That's it — every section (cover, prologue, timeline, gallery, reasons,
   milestones, letter, footer) reads from that one object, so there's
   nothing else to touch.

### Notes

- The live "days together" counter on the cover is computed from
  `anniversary.togetherSince` (ISO date) — no manual updating needed.
- `milestones` entries render as tweened counters; set `displayInfinity:
  true` to show `∞` instead of a number (see the "inside jokes" example).
- The placeholder photos shipped in `public/assets/couple/` are generated,
  on-theme SVG illustrations (daisy motif on cream paper) — they exist so
  the layout reads as finished immediately; swap them for real photos
  whenever you're ready.

## Motion & accessibility

- All scroll choreography (ambient petals, scrub/pin effects, reveal
  animations) is gated behind `prefers-reduced-motion: no-preference` via
  `gsap.matchMedia()`. With reduced motion enabled at the OS level, content
  still appears — just without animation.
- Desktop-only choreography (the pinned horizontal gallery) is gated behind
  a `(min-width: 768px)` media query; mobile gets a natural vertical layout.
- Lenis smooth scroll is skipped entirely under reduced motion, falling back
  to native scrolling.
- One transparent Three.js canvas carries the daisy field through the whole
  story. It caps device pixel ratio, reduces geometry on mobile, pauses while
  the tab is hidden, and falls back to a static flower if WebGL is unavailable.

## Project structure

```
src/
  components/         ThreeDaisyField, DaisyBloom, Figure, SectionLabel, GrainOverlay, Footer
  components/sections/ Cover, Intro, Timeline, Gallery, Reasons, Milestones, Letter
  content/story.ts     the single content config — edit this to personalize
  hooks/               useLenis, useDayCounter
  lib/gsap.ts          one-time GSAP/ScrollTrigger plugin registration
public/assets/couple/  photo placeholders — replace with real photos
```
