import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { story } from '../../content/story'

export function VideoFinale() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const activeRef = useRef(false)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)

  const play = () => {
    activeRef.current = true
    void videoRef.current?.play().catch(() => {})
  }

  const pause = () => {
    activeRef.current = false
    videoRef.current?.pause()
  }

  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: play,
        onEnterBack: play,
        onLeave: pause,
        onLeaveBack: pause,
      })

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.video-finale-copy', {
          y: 28,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        })
      })

      return () => {
        trigger.kill()
        mm.revert()
        pause()
      }
    },
    { scope: sectionRef },
  )

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setMuted(nextMuted)
    if (video.paused) void video.play().catch(() => {})
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Our video"
      data-scene="finale"
      className="relative h-dvh min-h-[32rem] overflow-hidden bg-ink text-ivory"
    >
      {!failed && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={story.finale.video}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => {
            if (activeRef.current) void videoRef.current?.play().catch(() => {})
          }}
          onError={() => setFailed(true)}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-ink/25" />

      <div className="video-finale-copy absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 p-5 min-[360px]:p-6 md:p-10">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-ivory/70">
            {story.finale.eyebrow}
          </p>
          <h2 className="mt-2 max-w-2xl text-balance font-display text-4xl leading-none text-ivory min-[360px]:text-5xl md:text-7xl">
            {story.finale.title}
          </h2>
        </div>

        {!failed && (
          <button
            type="button"
            onClick={toggleSound}
            className="flex min-h-11 shrink-0 items-center border border-ivory/50 px-4 font-body text-[10px] uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-ivory hover:text-ink"
            aria-label={muted ? 'Turn video sound on' : 'Mute video'}
          >
            {muted ? 'Sound on' : 'Mute'}
          </button>
        )}
      </div>
    </section>
  )
}
