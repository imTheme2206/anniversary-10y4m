import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap'
import { story } from '../../content/story'
import { SectionLabel } from '../SectionLabel'

export function Milestones() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLDivElement>('.milestone-item', sectionRef.current!)

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        items.forEach((item) => {
          const numEl = item.querySelector<HTMLElement>('.counter-num')
          const value = Number(item.dataset.value ?? 0)
          const isInfinity = item.dataset.infinity === 'true'

          if (!numEl) return

          if (isInfinity) {
            numEl.textContent = '∞'
            gsap.from(numEl, {
              opacity: 0,
              scale: 0.7,
              duration: 0.6,
              ease: 'back.out(1.7)',
              scrollTrigger: { trigger: item, start: 'top 82%', once: true },
            })
            return
          }

          const counter = { val: 0 }
          gsap.to(counter, {
            val: value,
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 82%', once: true },
            onUpdate: () => {
              numEl.textContent = Math.round(counter.val).toLocaleString('en-US')
            },
          })
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        items.forEach((item) => {
          const numEl = item.querySelector<HTMLElement>('.counter-num')
          if (!numEl) return
          const isInfinity = item.dataset.infinity === 'true'
          numEl.textContent = isInfinity
            ? '∞'
            : Number(item.dataset.value ?? 0).toLocaleString('en-US')
        })
      })

      return undefined
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      aria-label="By the numbers"
      className="story-section relative border-y border-line bg-cream/75 py-20 md:py-40"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-5 min-[360px]:px-6 md:px-10">
        <SectionLabel tone="sage">By The Numbers</SectionLabel>

        <div className="mt-10 grid grid-cols-3 gap-3 md:mt-12 md:gap-8">
          {story.milestones.map((milestone) => {
            const isInfinity = 'displayInfinity' in milestone && milestone.displayInfinity
            return (
              <div
                key={milestone.label}
                className="milestone-item min-w-0 border-t border-line pt-5 md:min-h-52 md:pt-6"
                data-value={milestone.value}
                data-infinity={isInfinity ? 'true' : 'false'}
              >
                <div className="font-display text-4xl italic text-ink min-[360px]:text-5xl md:text-8xl">
                  <span className="counter-num">0</span>
                  {!isInfinity && <span>{milestone.suffix}</span>}
                </div>
                <SectionLabel className="mt-3 block">{milestone.label}</SectionLabel>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
