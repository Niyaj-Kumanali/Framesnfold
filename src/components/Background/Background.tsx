import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './Background.css'

type Spark = {
  x: number
  y: number
  size: number
  drift: number
  rise: number
  alpha: number
  phase: number
}

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean }
  hardwareConcurrency?: number
}

/** Low-end devices get a still glow instead of an animation loop. */
function canAnimate() {
  const hints = navigator as NavigatorWithHints
  if (hints.connection?.saveData) return false
  if (typeof hints.hardwareConcurrency === 'number' && hints.hardwareConcurrency <= 2) return false
  return true
}

function makeSpark(index: number, width: number, height: number): Spark {
  /* Even spacing with a small wobble: stable enough to look like dust, not a grid. */
  const seed = Math.sin(index * 91.7) * 43758.5453
  const jitter = seed - Math.floor(seed)
  return {
    x: ((index + 0.5) / 36 + jitter * 0.012) * width,
    y: (1 - ((index * 7) % 11) / 11) * height,
    size: 0.7 + jitter * 1.1,
    drift: 0.06 + jitter * 0.12,
    rise: 0.1 + jitter * 0.16,
    alpha: 0.12 + jitter * 0.2,
    phase: jitter * Math.PI * 2,
  }
}

/**
 * One fixed layer behind the page: a cursor-following ember glow (--mx/--my are
 * viewport pixels written by usePointerFx) and a quiet Canvas 2D spark field.
 * It never takes a pointer event and never owns a video.
 */
export default function Background() {
  const reduced = useReducedMotion()
  const [enabled] = useState(canAnimate)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const showSparks = !reduced && enabled

  useEffect(() => {
    const canvas = canvasRef.current
    if (!showSparks || !canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let frame = 0
    let visible = !document.hidden
    let inView = true
    let width = 0
    let height = 0
    let sparks: Spark[] = []
    let time = 0

    const resize = () => {
      const box = canvas.getBoundingClientRect()
      width = box.width || window.innerWidth
      height = box.height || window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = window.innerWidth <= 760 ? 14 : 36
      sparks = Array.from({ length: count }, (_, i) => makeSpark(i, width, height))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      for (const spark of sparks) {
        spark.y -= spark.rise
        spark.x += Math.sin(time + spark.phase) * spark.drift
        if (spark.y < -12) {
          spark.y = height + 12
          spark.x = Math.random() * width
        }
        ctx.beginPath()
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 90, 31, ${spark.alpha.toFixed(3)})`
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = () => {
      frame = 0
      if (!visible || !inView) return
      time += 0.006
      draw()
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (!frame && visible && inView) frame = requestAnimationFrame(loop)
    }

    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    const onVisibility = () => {
      visible = !document.hidden
      if (visible) start()
      else stop()
    }

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting
            if (inView) start()
            else stop()
          })
        : null

    resize()
    start()
    observer?.observe(canvas)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      observer?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [showSparks])

  return (
    <div className="bg-layer" aria-hidden="true">
      {showSparks && <canvas ref={canvasRef} className="bg-sparks" />}
    </div>
  )
}
