import { useEffect, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

const clamp = (v: number) => Math.max(-1, Math.min(1, v))

/**
 * Mouse-only effects, written as CSS variables so React never re-renders:
 *  - app:   --mx / --my  (viewport pixels, drives the full-viewport glow)
 *  - deck:  --nx / --ny  (-1..1, drives the panel tilt)
 *           --gx / --gy  (percentage, drives the glare on the active panel)
 */
export function usePointerFx(
  heroRef: RefObject<HTMLElement | null>,
  reelsRef: RefObject<HTMLElement | null>,
) {
  const reduced = useReducedMotion()

  useEffect(() => {
    const hero = heroRef.current
    const reels = reelsRef.current
    if (!hero || !reels || reduced) return

    /* The glow is on .app as a fixed layer, so it needs viewport coordinates,
       not hero-relative ones. Listen on the window so it also follows the
       cursor over the header and the side gutters. */
    const app = hero.closest<HTMLElement>('.app')

    let raf = 0
    let px = 0
    let py = 0

    const frame = () => {
      raf = 0
      const h = hero.getBoundingClientRect()
      const r = reels.getBoundingClientRect()
      app?.style.setProperty('--mx', `${px}px`)
      app?.style.setProperty('--my', `${py}px`)
      reels.style.setProperty(
        '--nx',
        clamp((px - (r.left + r.width / 2)) / (h.width / 2)).toFixed(3),
      )
      reels.style.setProperty(
        '--ny',
        clamp((py - (r.top + r.height / 2)) / (h.height / 2)).toFixed(3),
      )
      reels.style.setProperty('--gx', `${(((px - r.left) / r.width) * 100).toFixed(2)}%`)
      reels.style.setProperty('--gy', `${(((py - r.top) / r.height) * 100).toFixed(2)}%`)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      px = e.clientX
      py = e.clientY
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      reels.style.setProperty('--nx', '0')
      reels.style.setProperty('--ny', '0')
      reels.style.setProperty('--gx', '50%')
      reels.style.setProperty('--gy', '50%')
    }

    window.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [heroRef, reelsRef, reduced])
}
