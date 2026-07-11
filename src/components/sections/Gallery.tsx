import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap'
import { story } from '../../content/story'
import { Figure } from '../Figure'
import { SectionLabel } from '../SectionLabel'

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Every motion-capable viewport uses the same vertical-to-horizontal
      // choreography: scrolling down pins the section and advances the rail.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current
        if (!track) return

        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - track.clientWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${track.scrollWidth - track.clientWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        return () => tween.scrollTrigger?.kill()
      })

      return undefined
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      aria-label="Moments"
      data-scene="gallery"
      className="story-section relative h-dvh min-h-[32rem] overflow-hidden bg-ink/95 py-0 text-ivory"
    >
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-5 min-[360px]:px-6 md:px-10">
        <div className="mb-6 md:mb-8">
          <SectionLabel tone="gold">Moments</SectionLabel>
          <h2 className="mt-3 text-balance font-display text-5xl text-ivory md:text-7xl">
            The moments
          </h2>
          <div className="mt-4 flex items-center gap-3 md:hidden" aria-hidden="true">
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-ivory/65">
              Scroll
            </span>
            <span className="h-px w-8 bg-ivory/45" />
            <span className="font-body text-sm text-gold">↓</span>
          </div>
        </div>

        <div
          ref={trackRef}
          className="gallery-rail no-scrollbar -mx-5 flex snap-x snap-mandatory flex-row gap-4 px-5 pb-3 motion-safe:overflow-visible motion-reduce:overflow-x-auto min-[360px]:-mx-6 min-[360px]:px-6 md:mx-0 md:flex-nowrap md:items-center md:gap-6 md:px-0 md:pb-0"
        >
          {story.gallery.map((item, i) => (
            <div
              key={item.src + i}
              className={`gallery-card w-[82vw] max-w-[20rem] flex-shrink-0 snap-center md:w-[38vw] md:max-w-md ${i % 2 ? 'md:-translate-y-8' : 'md:translate-y-8'}`}
            >
              <div className="gallery-parallax">
                <Figure
                  src={item.src}
                  alt={item.caption}
                  caption={item.caption}
                  aspect="aspect-[4/3]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
