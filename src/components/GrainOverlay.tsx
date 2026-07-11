const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter>
    <rect width="100%" height="100%" filter="url(#n)"/>
  </svg>`,
)

/**
 * Fixed, whole-viewport paper-grain texture. Sits above content, ignores
 * pointer events, and stays extremely faint — a tactile paper feel without
 * ever reading as "noisy".
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.04] mix-blend-multiply"
      style={{ backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")` }}
    />
  )
}
