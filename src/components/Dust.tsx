import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  r: number
  drift: number
  seed: number
  alpha: number
}

export default function Dust() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const cores = navigator.hardwareConcurrency ?? 8
    if (reduce || connection?.saveData || cores <= 2) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let particles: Particle[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = width < 700 ? 14 : 36
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * 1.1,
        drift: 0.3 + Math.random() * 0.9,
        seed: i * 0.618,
        alpha: 0.12 + Math.random() * 0.36,
      }))
    }

    const draw = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      ctx.clearRect(0, 0, width, height)

      for (const particle of particles) {
        const y = (((particle.y - progress * particle.drift * height) % height) + height) % height
        const x = particle.x + Math.sin((progress * 6 + particle.seed) * Math.PI) * 8
        ctx.beginPath()
        ctx.arc(x, y, particle.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 90, 31, ${particle.alpha})`
        ctx.fill()
      }
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('resize', draw)
    window.addEventListener('scroll', draw, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', draw)
      window.removeEventListener('scroll', draw)
    }
  }, [])

  return <canvas ref={ref} className="dust" aria-hidden="true" />
}
