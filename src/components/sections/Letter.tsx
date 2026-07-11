import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap'
import { story } from '../../content/story'
import { DaisyBloom } from '../DaisyBloom'
import { SectionLabel } from '../SectionLabel'

export function Letter() {
  const sectionRef = useRef<HTMLElement>(null)
  const paragraphs = story.letter.body.split('\n\n').filter(Boolean)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.letter-line', {
          y: 18,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.16,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
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
      aria-label="The letter"
      data-scene="letter"
      className="story-section relative bg-ivory/80 py-20 md:py-52"
    >
      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center min-[360px]:px-6 md:px-10 md:text-left">
        <DaisyBloom
          trigger="scroll"
          size={110}
          petals={14}
          petalColor="var(--cream-2)"
          className="mx-auto mb-10 md:mx-0"
        />

        <SectionLabel tone="gold" as="div" className="mb-8">
          The Letter
        </SectionLabel>

        <p className="letter-line font-hand text-2xl leading-snug text-ink min-[360px]:text-3xl md:text-4xl">
          {story.letter.salutation}
        </p>

        <div className="mt-7 space-y-5 rounded-sm border border-line/70 bg-ivory/70 p-5 shadow-[0_30px_90px_rgba(46,40,34,0.08)] min-[360px]:p-6 md:mt-8 md:space-y-6 md:p-10">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="letter-line text-pretty font-hand text-xl leading-relaxed text-ink-soft min-[360px]:text-[1.375rem] md:text-3xl"
            >
              {para}
            </p>
          ))}
        </div>

        <p className="letter-line mt-10 font-hand text-2xl text-ink md:text-3xl">
          {story.letter.signoff}
        </p>
        <p className="letter-line mt-1 font-hand text-4xl text-gold-deep md:text-5xl">
          {story.letter.signature}
        </p>

        <p className="letter-line mt-16 font-body text-xs uppercase tracking-[0.2em] text-ink-soft">
          Here&rsquo;s to forever
        </p>
      </div>
    </section>
  )
}
