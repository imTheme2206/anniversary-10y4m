/**
 * Single place GSAP plugins get registered for the whole app.
 * Import `gsap` and `ScrollTrigger` from here (not directly from "gsap")
 * so registration always happens before first use.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Sensible, editorial-feeling defaults used across sections.
gsap.defaults({
  ease: 'power3.out',
  duration: 0.7,
})

export { gsap, ScrollTrigger }
