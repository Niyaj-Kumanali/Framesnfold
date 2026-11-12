import { useEffect, useRef, type RefObject } from 'react'

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)

/**
 * Counts up a 30fps timecode inside every `.tc` element under `ref`
 * while the reel is active. Starts from zero each time it turns on and
 * holds while paused. Writes straight to the DOM to avoid re-rendering
 * 30 times a second.
 */
export function useTimecode(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  paused: boolean,
  enabled: boolean,
) {
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const root = ref.current
    if (!active || !enabled || !root) return

    const targets = root.querySelectorAll<HTMLElement>('.tc')
    let elapsed = 0
    let last = performance.now()
    let raf = 0

    const write = () => {
      const s = Math.floor(elapsed) % 60
      const f = Math.floor((elapsed % 1) * 30)
      const text = `00:00:${pad(s)}:${pad(f)}`
      targets.forEach((el) => {
        el.textContent = text
      })
    }

    const loop = (now: number) => {
      if (!pausedRef.current) elapsed += (now - last) / 1000
      last = now
      write()
      raf = requestAnimationFrame(loop)
    }

    write()
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ref, active, enabled])
}
