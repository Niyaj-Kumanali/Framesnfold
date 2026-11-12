import { useEffect, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

const clamp = (v: number) => Math.max(-1, Math.min(1, v))

/**
 * Mouse-only effects, written as CSS variables so React never re-renders:
 *  - hero:  --mx / --my  (cursor position, drives the orange light)
 *  - reels: --nx / --ny  (-1..1, drives the panel tilt)
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

    let raf = 0
    let px = 0
    let py = 0

    const frame = () => {
      raf = 0
      const h = hero.getBoundingClientRect()
      const r = reels.getBoundingClientRect()
      hero.style.setProperty('--mx', `${px - h.left}px`)
      hero.style.setProperty('--my', `${py - h.top}px`)
      reels.style.setProperty(
        '--nx',
        clamp((px - (r.left + r.width / 2)) / (h.width / 2)).toFixed(3),
      )
      reels.style.setProperty(
        '--ny',
        clamp((py - (r.top + r.height / 2)) / (h.height / 2)).toFixed(3),
      )
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
    }

    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    return () => {
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [heroRef, reelsRef, reduced])
}
