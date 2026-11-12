import { useEffect, useRef } from 'react'
import type { CSSVars } from '../../types'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * The big wordmark. Letters rise in once on load. With a mouse, letters
 * near the cursor lift and turn orange (--p is 0..1 per letter).
 */
export default function Wordmark({ text }: { text: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const masks = useRef<(HTMLSpanElement | null)[]>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    const heading = headingRef.current
    if (!heading || reduced) return

    let raf = 0
    let px = 0
    let py = 0

    const frame = () => {
      raf = 0
      const reach = (heading.getBoundingClientRect().width || 1) * 0.3
      masks.current.forEach((m) => {
        if (!m) return
        const b = m.getBoundingClientRect()
        const d = Math.hypot(px - (b.left + b.width / 2), py - (b.top + b.height / 2))
        m.style.setProperty('--p', Math.max(0, 1 - d / reach).toFixed(3))
      })
    }

    const reset = () => {
      masks.current.forEach((m) => m?.style.setProperty('--p', '0'))
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      px = e.clientX
      py = e.clientY
      if (!raf) raf = requestAnimationFrame(frame)
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('mouseleave', reset)
    window.addEventListener('blur', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', reset)
      window.removeEventListener('blur', reset)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <h1 ref={headingRef} className="wordmark" aria-label={text}>
      {text.split('').map((char, j) => {
        const style: CSSVars = { '--j': j }
        return (
          <span
            key={j}
            className="mask"
            aria-hidden="true"
            ref={(el) => {
              masks.current[j] = el
            }}
          >
            <span className="ch" style={style}>
              {char}
            </span>
          </span>
        )
      })}
    </h1>
  )
}
