import { lazy, Suspense, useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './Scene3D.css'

type Props = {
  active: number
  paused: boolean
}

/** Three.js is heavy, so it only loads when the browser can use it. */
const WebGLScene = lazy(() => import('./WebGLScene'))

function supportsWebGL() {
  const hints = navigator as Navigator & {
    connection?: { saveData?: boolean }
    hardwareConcurrency?: number
  }
  if (hints.connection?.saveData) return false
  if (typeof hints.hardwareConcurrency === 'number' && hints.hardwareConcurrency <= 2) return false

  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Decorative WebGL atmosphere behind the real reel buttons. The gate keeps the
 * initial bundle small and leaves the CSS fold alone when motion is reduced.
 */
export default function Scene3D({ active, paused }: Props) {
  const reduced = useReducedMotion()
  const [supported] = useState(supportsWebGL)
  const [ready, setReady] = useState(false)

  /* Let the hero type and buttons paint before fetching the 3D chunk. */
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    let idle = 0
    let timer = 0
    if (w.requestIdleCallback) {
      idle = w.requestIdleCallback(() => setReady(true), { timeout: 1500 })
    } else {
      timer = window.setTimeout(() => setReady(true), 300)
    }

    return () => {
      if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle)
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  if (reduced || !supported) return null

  return <Suspense fallback={null}>{ready && <WebGLScene active={active} paused={paused} />}</Suspense>
}
