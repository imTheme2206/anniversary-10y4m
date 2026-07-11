import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

/**
 * The single Lenis smooth-scroll instance for the whole app.
 * Mount once at the app root. GSAP's ticker drives Lenis's RAF loop,
 * and Lenis's scroll event drives ScrollTrigger.update() — one clock,
 * two consumers, no drift between smooth scroll and scroll-triggered motion.
 *
 * Under `prefers-reduced-motion: reduce` we skip Lenis entirely and fall
 * back to native scrolling; ScrollTrigger still works fine off native scroll.
 */
export function useLenis() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      return
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
    }
  }, [])
}
