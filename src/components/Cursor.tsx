import { useEffect, useRef } from 'react'

type CursorState = 'default' | 'link' | 'view'

export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reducedMotion.matches) return

    const root = rootRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!root || !dot || !ring || !label) return

    document.body.classList.add('has-custom-cursor')

    let state: CursorState = 'default'
    let visible = false

    const setState = (next: CursorState) => {
      if (state === next) return
      state = next
      root.dataset.state = state
      label.textContent = state === 'view' ? 'VIEW' : ''
    }

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true
        root.dataset.visible = 'true'
      }

      const position = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`
      dot.style.transform = position
      ring.style.transform = position

      const target = event.target
      if (!(target instanceof Element)) {
        setState('default')
        return
      }

      if (target.closest('.work-card')) {
        setState('view')
      } else if (target.closest('a, button, [role="button"]')) {
        setState('link')
      } else {
        setState('default')
      }
    }

    const onOut = (event: PointerEvent) => {
      if (event.relatedTarget) return
      visible = false
      root.dataset.visible = 'false'
      setState('default')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
    }
  }, [])

  return (
    <div className="cursor" ref={rootRef} data-state="default" data-visible="false" aria-hidden="true">
      <div className="cursor-ring" ref={ringRef}>
        <span className="cursor-label" ref={labelRef} />
      </div>
      <div className="cursor-dot" ref={dotRef} />
    </div>
  )
}
