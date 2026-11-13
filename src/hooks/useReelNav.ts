import { useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react'

/** Horizontal distance a pointer must travel before it counts as a swipe. */
const SWIPE = 46

/**
 * Non-mouse navigation for the reel deck:
 *  - horizontal wheel / trackpad scroll steps through reels
 *  - ArrowLeft/ArrowRight step through reels
 *  - horizontal drag or swipe on the deck steps through reels
 *
 * Vertical intent is always left alone, so the page can scroll to the next
 * section later. Nothing here calls preventDefault.
 */
export function useReelNav(
  heroRef: RefObject<HTMLElement | null>,
  next: () => void,
  prev: () => void,
) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    let acc = 0
    let locked = false
    let unlock = 0

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return

      /* Only a clearly horizontal gesture belongs to the deck. Anything else
         is page scroll, which this hook never touches. */
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.2) {
        acc = 0
        return
      }
      if (locked) return

      /* A change of direction starts a fresh gesture rather than cancelling
         out the distance already travelled. */
      if (acc !== 0 && Math.sign(e.deltaX) !== Math.sign(acc)) acc = 0

      acc += e.deltaX
      if (Math.abs(acc) < 36) return

      if (acc > 0) next()
      else prev()
      acc = 0
      locked = true
      window.clearTimeout(unlock)
      unlock = window.setTimeout(() => {
        locked = false
      }, 420)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return
      const target = e.target as HTMLElement | null
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')) {
        return
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }

    hero.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      hero.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(unlock)
    }
  }, [heroRef, next, prev])

  return {
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      start.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
    },
    onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => {
      const s = start.current
      start.current = null
      if (!s || s.id !== e.pointerId) return

      const dx = e.clientX - s.x
      const dy = e.clientY - s.y
      if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy) * 1.15) return

      if (dx < 0) next()
      else prev()
    },
    onPointerCancel: () => {
      start.current = null
    },
  }
}
