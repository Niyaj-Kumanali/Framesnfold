import { useEffect, useState } from 'react'

/** Page distance before the bar is allowed to hide. */
const THRESHOLD = 72
/** Ignore movement smaller than this, so trackpad jitter does not flicker. */
const JITTER = 6
/** Any scroll past this means content is passing underneath the bar. */
const STUCK = 8

/**
 * Sticky-bar behaviour: hides while the page scrolls down, comes back when it
 * scrolls up or reaches the top. `stuck` turns on once the page has moved, so
 * the bar only grows its backdrop and hairline when something is under it.
 */
export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    let raf = 0

    const read = () => {
      raf = 0
      const y = window.scrollY
      const dy = y - last

      setStuck(y > STUCK)
      if (Math.abs(dy) < JITTER) return

      last = y
      if (y <= THRESHOLD) setHidden(false)
      else setHidden(dy > 0)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { hidden, stuck }
}
