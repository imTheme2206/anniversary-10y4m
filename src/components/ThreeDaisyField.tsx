import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '../lib/gsap'

type ScenePhase = 'cover' | 'intro' | 'timeline' | 'gallery' | 'reasons' | 'letter' | 'finale'

const COLORS = {
  ivory: 0xfffdf7,
  cream: 0xf4ecd9,
  gold: 0xe8b23a,
  goldDeep: 0xc8922a,
  sage: 0x8c9a6b,
  blush: 0xe7a79c,
}

function makePetalGeometry() {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(-0.22, 0.18, -0.32, 0.78, 0, 1.15)
  shape.bezierCurveTo(0.32, 0.78, 0.22, 0.18, 0, 0)
  return new THREE.ShapeGeometry(shape, 8)
}

function createDaisy(
  petalGeometry: THREE.ShapeGeometry,
  petalMaterial: THREE.MeshBasicMaterial,
  centerMaterial: THREE.MeshBasicMaterial,
  petals = 12,
) {
  const flower = new THREE.Group()
  for (let i = 0; i < petals; i += 1) {
    const petal = new THREE.Mesh(petalGeometry, petalMaterial)
    petal.rotation.z = (i / petals) * Math.PI * 2
    petal.scale.set(0.8, 0.8, 0.8)
    petal.position.z = -0.02
    flower.add(petal)
  }
  const center = new THREE.Mesh(new THREE.CircleGeometry(0.23, 24), centerMaterial)
  center.position.z = 0.04
  flower.add(center)
  return flower
}

/**
 * A single transparent WebGL scene shared by the whole story. The page keeps
 * all meaning in normal HTML; this layer only carries the flower narrative.
 */
export function ThreeDaisyField() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 767px)').matches
    let renderer: THREE.WebGLRenderer

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: 'high-performance' })
    } catch {
      setFailed(true)
      return
    }

    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.65))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault()
      setFailed(true)
    })
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(0, 0, 11)

    const petalGeometry = makePetalGeometry()
    const petalMaterial = new THREE.MeshBasicMaterial({ color: COLORS.ivory, transparent: true, opacity: 0.92, side: THREE.DoubleSide })
    const warmPetalMaterial = new THREE.MeshBasicMaterial({ color: COLORS.cream, transparent: true, opacity: 0.82, side: THREE.DoubleSide })
    const centerMaterial = new THREE.MeshBasicMaterial({ color: COLORS.gold })
    const fieldPetalMaterial = new THREE.MeshBasicMaterial({ color: COLORS.ivory, transparent: true, opacity: 0.42, side: THREE.DoubleSide })
    const fieldWarmMaterial = new THREE.MeshBasicMaterial({ color: COLORS.cream, transparent: true, opacity: 0.42, side: THREE.DoubleSide })

    const world = new THREE.Group()
    scene.add(world)

    const heroFlower = createDaisy(petalGeometry, petalMaterial, centerMaterial, 14)
    heroFlower.position.set(2.65, -0.15, -1)
    heroFlower.scale.setScalar(2.2)
    world.add(heroFlower)

    const stemGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(2.65, -0.25, -1.1),
      new THREE.Vector3(2.45, -1.6, -1.1),
      new THREE.Vector3(2.9, -3.5, -1.1),
      new THREE.Vector3(2.6, -6.5, -1.1),
    ])
    const stem = new THREE.Line(stemGeometry, new THREE.LineBasicMaterial({ color: COLORS.sage, transparent: true, opacity: 0.48 }))
    world.add(stem)

    const field = new THREE.Group()
    const fieldCount = mobile ? 7 : 18
    for (let i = 0; i < fieldCount; i += 1) {
      const flower = createDaisy(petalGeometry, i % 3 === 0 ? fieldWarmMaterial : fieldPetalMaterial, centerMaterial, 9)
      const x = ((i * 47) % 100) / 10 - 5
      const y = ((i * 31) % 70) / 10 - 4.1
      const scale = 0.18 + (i % 5) * 0.055
      flower.position.set(x, y, -2.5 - (i % 4) * 0.3)
      flower.scale.setScalar(scale)
      flower.rotation.z = (i * 0.61) % Math.PI
      field.add(flower)
    }
    field.position.y = -1
    world.add(field)

    const driftingPetals = new THREE.Group()
    const driftCount = mobile ? 4 : 10
    for (let i = 0; i < driftCount; i += 1) {
      const mesh = new THREE.Mesh(petalGeometry, i % 4 === 0 ? warmPetalMaterial : petalMaterial)
      mesh.scale.setScalar(0.12 + (i % 3) * 0.04)
      mesh.position.set(((i * 41) % 100) / 10 - 5, ((i * 67) % 80) / 10 - 4, -0.8 - (i % 3))
      mesh.rotation.z = i * 0.8
      driftingPetals.add(mesh)
    }
    driftingPetals.visible = !reducedMotion
    world.add(driftingPetals)

    const orbit = new THREE.Group()
    const orbitCount = mobile ? 8 : 18
    const orbitGeometry = new THREE.CircleGeometry(0.045, 10)
    for (let i = 0; i < orbitCount; i += 1) {
      const dot = new THREE.Mesh(orbitGeometry, new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? COLORS.blush : COLORS.goldDeep, transparent: true, opacity: 0.68 }))
      const angle = (i / orbitCount) * Math.PI * 2
      const radius = 2.2 + (i % 3) * 0.42
      dot.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, -0.4)
      orbit.add(dot)
    }
    orbit.position.set(1.2, 0, 0)
    orbit.scale.setScalar(0)
    world.add(orbit)

    const coverScale = mobile ? 1.25 : 2.2
    const state = { heroScale: reducedMotion ? coverScale : 0, heroX: mobile ? 2.4 : 2.65, heroY: mobile ? 0.65 : -0.15, fieldScale: 1, fieldOpacity: 0.42, orbitScale: 0, worldY: 0, rotation: 0 }
    const phaseTargets: Record<ScenePhase, Partial<typeof state>> = {
      cover: { heroScale: coverScale, heroX: mobile ? 2.4 : 2.65, heroY: mobile ? 0.65 : -0.15, fieldScale: 1, fieldOpacity: 0.28, orbitScale: 0, worldY: 0, rotation: 0 },
      intro: { heroScale: mobile ? 0.36 : 0.8, heroX: mobile ? -3.2 : -3.4, heroY: mobile ? 1.8 : 0.4, fieldScale: 1, fieldOpacity: 0.25, orbitScale: 0, worldY: 0.2, rotation: -0.15 },
      timeline: { heroScale: mobile ? 0.18 : 0.28, heroX: mobile ? -3.4 : -3.8, heroY: 1.7, fieldScale: 1, fieldOpacity: mobile ? 0.3 : 0.52, orbitScale: 0, worldY: 0.8, rotation: 0.08 },
      gallery: { heroScale: 0, heroX: 0, heroY: 0, fieldScale: 0, fieldOpacity: 0, orbitScale: mobile ? 0.72 : 1, worldY: 0, rotation: 0.24 },
      reasons: { heroScale: mobile ? 0.2 : 0.34, heroX: mobile ? 3.2 : 3.8, heroY: -1.8, fieldScale: 1, fieldOpacity: mobile ? 0.28 : 0.46, orbitScale: mobile ? 0.2 : 0.35, worldY: -0.5, rotation: -0.08 },
      letter: { heroScale: mobile ? 0.58 : 1.05, heroX: mobile ? 2.9 : 3.25, heroY: mobile ? 2.2 : 1.2, fieldScale: 1, fieldOpacity: 0.16, orbitScale: 0, worldY: 0, rotation: 0 },
      finale: { heroScale: 0, fieldScale: 0, fieldOpacity: 0, orbitScale: 0 },
    }

    const applyPhase = (phase: ScenePhase) => {
      gsap.to(state, { ...phaseTargets[phase], duration: reducedMotion ? 0 : 1.5, ease: 'power3.inOut', overwrite: 'auto' })
      gsap.to(mount, { opacity: phase === 'finale' ? 0 : 1, duration: reducedMotion ? 0 : 0.7, overwrite: 'auto' })
    }

    const triggers: ScrollTrigger[] = []
    ;(['cover', 'intro', 'timeline', 'gallery', 'reasons', 'letter', 'finale'] as ScenePhase[]).forEach((phase) => {
      const element = document.querySelector(`[data-scene="${phase}"]`)
      if (!element) return
      triggers.push(ScrollTrigger.create({
        trigger: element,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => applyPhase(phase),
        onEnterBack: () => applyPhase(phase),
      }))
    })

    if (!reducedMotion) {
      gsap.to(state, { heroScale: coverScale, duration: 1.7, ease: 'back.out(1.1)', delay: 0.1 })
    }

    const pointer = new THREE.Vector2()
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.28
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.2
    }
    if (!reducedMotion) window.addEventListener('pointermove', onPointerMove, { passive: true })

    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 768 ? 1.25 : 1.65))
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    let frame = 0
    let hidden = document.hidden
    const clock = new THREE.Clock()
    const onVisibility = () => {
      hidden = document.hidden
      if (hidden) {
        window.cancelAnimationFrame(frame)
        frame = 0
      } else {
        clock.start()
        if (!reducedMotion && frame === 0) frame = window.requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    const render = () => {
      if (!reducedMotion && !hidden) frame = window.requestAnimationFrame(render)
      if (hidden) return
      const elapsed = clock.getElapsedTime()
      heroFlower.scale.setScalar(state.heroScale)
      heroFlower.position.x += (state.heroX + pointer.x - heroFlower.position.x) * 0.06
      heroFlower.position.y += (state.heroY - pointer.y - heroFlower.position.y) * 0.06
      field.scale.setScalar(state.fieldScale)
      field.children.forEach((child) => {
        const flower = child as THREE.Group
        flower.children.forEach((part) => {
          const material = (part as THREE.Mesh).material as THREE.MeshBasicMaterial
          if (material?.transparent) material.opacity = state.fieldOpacity
        })
      })
      orbit.scale.setScalar(state.orbitScale)
      orbit.rotation.z = reducedMotion ? 0 : elapsed * 0.08
      world.position.y += (state.worldY - world.position.y) * 0.04
      world.rotation.z += (state.rotation - world.rotation.z) * 0.035
      if (!reducedMotion) {
        heroFlower.rotation.z = Math.sin(elapsed * 0.35) * 0.035
        driftingPetals.children.forEach((child, i) => {
          child.position.y += Math.sin(elapsed * 0.45 + i) * 0.0008
          child.rotation.z += 0.0008 + (i % 3) * 0.00035
        })
      }
      renderer.render(scene, camera)
    }
    render()

    return () => {
      window.cancelAnimationFrame(frame)
      triggers.forEach((trigger) => trigger.kill())
      gsap.killTweensOf(state)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      petalGeometry.dispose()
      stemGeometry.dispose()
      orbitGeometry.dispose()
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Line)) return
        const material = object.material
        if (Array.isArray(material)) material.forEach((item) => item.dispose())
        else material.dispose()
        if (object.geometry !== petalGeometry && object.geometry !== orbitGeometry && object.geometry !== stemGeometry) object.geometry.dispose()
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[5] overflow-hidden transition-opacity duration-700 ${failed ? 'three-fallback' : ''}`}
    />
  )
}
