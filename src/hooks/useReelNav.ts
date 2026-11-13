import { useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react'

/** Horizontal distance a pointer must travel before it counts as a swipe. */
const SWIPE = 46

/**
 * Non-mouse navigation for the reel deck:
 *  - wheel / trackpad scroll steps through reels (only when the page itself
 *    cannot scroll, so a short viewport never traps the user)
 *  - ArrowLeft/ArrowRight (and Up/Down) step through reels
 *  - horizontal drag or swipe on the deck steps through reels
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
      const pageScrolls = document.documentElement.scrollHeight > window.innerHeight + 2
      if (!pageScrolls) e.preventDefault()
      if (locked) return

      acc += Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
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

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      }
    }

    hero.addEventListener('wheel', onWheel, { passive: false })
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
