import { useEffect, useRef, useState } from 'react'
import type { CSSVars, ReelData } from '../../types'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useTimecode } from '../../hooks/useTimecode'

type Props = {
  reel: ReelData
  index: number
  current: number
  count: number
  paused: boolean
  onSelect: (index: number) => void
  onFocusChange: (focused: boolean) => void
}

/** `loading` keeps the drawn scene; `ready` means the first frame is decoded. */
type Status = 'loading' | 'ready' | 'failed'

/**
 * Backstop for the dev server, which answers a missing file with index.html and
 * a 200 instead of a 404. `error` usually fires first; this catches the rest.
 */
const FALLBACK_MS = 4000

/** One vertical 9:16 panel that starts folded in half and opens on load. */
export default function Reel({
  reel,
  index,
  current,
  count,
  paused,
  onSelect,
  onFocusChange,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const active = index === current
  useTimecode(ref, active, paused, !reduced)

  const [status, setStatus] = useState<Status>('loading')
  const [loadedPoster, setLoadedPoster] = useState<string | null>(null)

  const { Scene, video } = reel
  const live = status === 'ready'
  const posterOk = video !== undefined && loadedPoster === video.poster

  /* Circular offset keeps one panel on each side of the active one, so the
     deck always reads as a fan instead of drifting to one edge. */
  const raw = (index - current + count) % count
  const offset = raw > count / 2 ? raw - count : raw
  const distance = Math.abs(offset)
  const style: CSSVars = {
    '--i': index,
    '--o': offset,
    '--d': distance,
    '--z': offset === 0 ? 5 : offset > 0 ? 4 : 3,
  }

  /* The active reel and the one after it warm up; the third only fetches
     metadata so a phone is not downloading three clips at once. */
  const preload = active || offset === 1 ? 'auto' : 'metadata'

  /* The fold halves need the poster as an image, not a <video>: two videos for
     the two halves would drift apart and leave a hairline at the crease. */
  useEffect(() => {
    const poster = video?.poster
    if (!poster) return

    let alive = true
    const img = new Image()
    img.onload = () => {
      if (alive) setLoadedPoster(poster)
    }
    img.src = poster
    return () => {
      alive = false
    }
  }, [video?.poster])

  /* Missing file, unreadable codec or a stalled request: fall back for good.
     Only runs while the reel is expected to load, otherwise the third reel
     (metadata only) would time out before it ever becomes active. */
  useEffect(() => {
    if (!video || status !== 'loading' || preload !== 'auto') return
    const timer = window.setTimeout(() => {
      setStatus((s) => (s === 'loading' ? 'failed' : s))
    }, FALLBACK_MS)
    return () => window.clearTimeout(timer)
  }, [video, status, preload])

  /* Reset before play so the footage starts where the progress bar does. */
  useEffect(() => {
    const el = videoRef.current
    if (!el || status !== 'ready' || !active) return
    el.currentTime = 0
  }, [active, status])

  /* Only the active reel decodes. Hover/keyboard pause freezes the video at the
     same moment the CSS progress bar freezes. */
  useEffect(() => {
    const el = videoRef.current
    if (!el || status !== 'ready') return

    if (reduced || !active || paused) {
      el.pause()
      return
    }

    /* Autoplay can be refused (iOS low power mode, data saver). The poster
       frame stays up; a later click is a gesture and may be allowed. */
    el.play().catch(() => {})
  }, [active, paused, reduced, status])

  const posterStyle: CSSVars | undefined =
    posterOk && video ? { '--poster': `url("${video.poster}")` } : undefined

  return (
    <button
      ref={ref}
      type="button"
      className={active ? 'reel on' : 'reel'}
      style={style}
      aria-label={`${reel.label}, sample reel`}
      aria-pressed={active}
      onClick={() => onSelect(index)}
      onFocus={(e) => {
        onSelect(index)
        /* A click focuses the button too. Only keyboard focus should hold the
           cycle; otherwise a click pauses it until the user clicks elsewhere. */
        if (e.currentTarget.matches(':focus-visible')) onFocusChange(true)
      }}
      onBlur={() => onFocusChange(false)}
    >
      {/* One continuous scene. The two folded halves behind it are only for the
          intro; two halves rasterise separately and leave a hairline at the
          join, so this layer takes over once the fold has finished.
          With real footage the <video> sits under the drawn scene, which steps
          aside once the first frame is decoded. The HUD lives inside the scene,
          so it stays put and stays on top. */}
      <div className={live ? 'scene live' : 'scene'}>
        {video && status !== 'failed' && (
          <video
            ref={videoRef}
            className="vid"
            src={video.src}
            poster={video.poster}
            muted
            loop
            playsInline
            preload={preload}
            aria-hidden="true"
            disablePictureInPicture
            onLoadedData={() => setStatus('ready')}
            onError={() => setStatus('failed')}
          />
        )}
        <Scene />
      </div>
      <div className="fold">
        <div className={posterOk ? 'half l has-poster' : 'half l'} style={posterStyle}>
          {!posterOk && <Scene />}
        </div>
        <div className={posterOk ? 'half r has-poster' : 'half r'} style={posterStyle}>
          {!posterOk && <Scene />}
          <div className="shade" />
        </div>
      </div>
    </button>
  )
}
