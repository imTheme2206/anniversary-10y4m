import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'

interface PetalSeed {
  id: number
  top: string
  left: string
  size: number
  color: string
  rotate: number
  /** Extra petals only rendered from md breakpoint up, per the brief (≤4 mobile, 6–10 desktop). */
  desktopOnly: boolean
}

const COLORS = ['var(--gold)', 'var(--sage)', 'var(--blush)']

const SEEDS: PetalSeed[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  top: `${8 + ((i * 37) % 84)}%`,
  left: `${4 + ((i * 53) % 92)}%`,
  size: 14 + (i % 3) * 4,
  color: COLORS[i % COLORS.length],
  rotate: (i * 41) % 360,
  desktopOnly: i >= 4,
}))

/**
 * Ambient drifting petals — a quiet background layer, never the focus.
 * Fixed positioning, transform-only motion, pointer-events-none.
 * Gated behind `prefers-reduced-motion: no-preference`; hidden entirely
 * (both via CSS and by never starting tweens) under reduced motion.
 */
export function Petals() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = containerRef.current
      if (!root) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const petals = gsap.utils.toArray<HTMLDivElement>('.petal', root)

        petals.forEach((petal, i) => {
          const driftX = 18 + (i % 4) * 10
          const driftY = 26 + (i % 5) * 8
          const duration = 7 + (i % 4) * 1.8

          gsap.to(petal, {
            x: `+=${driftX}`,
            y: `+=${driftY}`,
            rotation: `+=${20 + (i % 3) * 15}`,
            duration,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.35,
          })
        })
      })

      return () => mm.revert()
    },
    { scope: containerRef },
  )

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="motion-reduce:hidden pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {SEEDS.map((seed) => (
        <div
          key={seed.id}
          className={`petal absolute opacity-[0.22] ${seed.desktopOnly ? 'hidden md:block' : ''}`}
          style={{ top: seed.top, left: seed.left }}
        >
          <svg
            viewBox="0 0 24 24"
            width={seed.size}
            height={seed.size}
            style={{ transform: `rotate(${seed.rotate}deg)` }}
          >
            <ellipse cx="12" cy="12" rx="5" ry="11" fill={seed.color} />
          </svg>
        </div>
      ))}
    </div>
  )
}
