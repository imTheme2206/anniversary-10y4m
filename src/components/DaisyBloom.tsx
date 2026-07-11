import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'

interface DaisyBloomProps {
  /** Pixel size of the square SVG viewport. */
  size?: number
  petals?: number
  className?: string
  /** "load" blooms immediately on mount (hero); "scroll" blooms when scrolled into view (closing letter, chapter nodes). */
  trigger?: 'load' | 'scroll'
  delay?: number
  petalColor?: string
  centerColor?: string
}

let daisyUid = 0

/**
 * The site's signature motion moment: a daisy whose petals scale + rotate in
 * from the center. Reused for the hero bloom, chapter nodes, and the closing
 * letter. Fully static (final pose, no animation) under `prefers-reduced-motion`.
 */
export function DaisyBloom({
  size = 200,
  petals = 12,
  className = '',
  trigger = 'scroll',
  delay = 0,
  petalColor = 'var(--ivory)',
  centerColor = 'var(--gold)',
}: DaisyBloomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(`daisy-${daisyUid++}`)

  useGSAP(
    () => {
      const root = containerRef.current
      if (!root) return

      const petalEls = gsap.utils.toArray<SVGEllipseElement>('.daisy-petal', root)
      const centerEl = root.querySelector('.daisy-center')

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(petalEls, { scale: 0, opacity: 0, transformOrigin: '50% 100%' })
        gsap.set(centerEl, { scale: 0, opacity: 0, transformOrigin: '50% 50%' })

        const tl = gsap.timeline({
          paused: true,
          delay,
          defaults: { ease: 'back.out(1.6)' },
        })

        tl.to(petalEls, { scale: 1, opacity: 1, duration: 0.55, stagger: 0.045 }).to(
          centerEl,
          { scale: 1, opacity: 1, duration: 0.4 },
          '-=0.3',
        )

        if (trigger === 'load') {
          tl.play()
        } else {
          ScrollTrigger.create({
            trigger: root,
            start: 'top 82%',
            once: true,
            onEnter: () => tl.play(),
          })
        }

        return () => {
          tl.kill()
        }
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(petalEls, { scale: 1, opacity: 1 })
        gsap.set(centerEl, { scale: 1, opacity: 1 })
      })

      return () => mm.revert()
    },
    { scope: containerRef, dependencies: [trigger, delay, petals] },
  )

  const angleStep = 360 / petals

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <g id={idRef.current}>
          {Array.from({ length: petals }).map((_, i) => (
            <ellipse
              key={i}
              className="daisy-petal"
              cx="100"
              cy="62"
              rx="13"
              ry="36"
              fill={petalColor}
              transform={`rotate(${i * angleStep} 100 100)`}
            />
          ))}
          <circle className="daisy-center" cx="100" cy="100" r="22" fill={centerColor} />
        </g>
      </svg>
    </div>
  )
}
