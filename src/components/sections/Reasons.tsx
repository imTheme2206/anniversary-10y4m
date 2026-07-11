import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap'
import { story } from '../../content/story'
import { SectionLabel } from '../SectionLabel'

export function Reasons() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.reason-item', {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.reasons-list',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      })

      return undefined
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      aria-label="Reasons I love you"
      data-scene="reasons"
      className="story-section relative bg-cream-2/80 py-20 md:py-44"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-5 min-[360px]:px-6 md:px-10">
        <SectionLabel tone="sage">Reasons I Love You</SectionLabel>
        <h2 className="mt-3 text-balance font-display text-4xl text-ink md:text-6xl">
          A few, of many
        </h2>

        <ul className="reasons-list mt-10 grid gap-x-16 md:mt-16 md:grid-cols-2">
          {story.reasons.map((reason, i) => (
            <li key={reason} className="reason-item group flex items-start gap-4 border-t border-line py-5 md:gap-8 md:py-9">
              <span
                className={`shrink-0 font-display text-2xl min-[360px]:text-3xl md:text-5xl ${
                  i % 2 === 0 ? 'text-gold' : 'text-sage'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-pretty font-display text-lg leading-snug text-ink transition-transform duration-500 ease-power3-out group-hover:translate-x-2 min-[360px]:text-xl md:text-2xl">
                {reason}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
