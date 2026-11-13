import { useCallback, useState } from 'react'

/**
 * Tracks which reel is on. The CSS progress bar drives the timing:
 * when it finishes, the Hero calls `next()`. Hovering or focusing a
 * reel sets `paused`, which the CSS uses to freeze the bar.
 */
export function useCycle(count: number) {
  const [current, setCurrent] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [focusing, setFocusing] = useState(false)

  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count])

  return {
    current,
    select: setCurrent,
    next,
    prev,
    paused: hovering || focusing,
    setHovering,
    setFocusing,
  }
}
