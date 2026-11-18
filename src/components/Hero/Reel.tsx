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
  /** Real footage sets the shared --dwell; the callback is stable. */
  onDuration: (id: string, seconds: number | null) => void
}

/** `loading` keeps the drawn scene; `ready` means the first frame is decoded. */
type Status = 'loading' | 'ready' | 'failed'

/** Only a timeout is worth retrying; an error event is permanent. */
type Failure = 'timeout' | 'error' | null

/**
 * Backstop for a request that stalls without firing `error`, such as the dev
 * server answering a missing file with index.html and a 200.
 */
const FALLBACK_MS = 4000
const MIN_DWELL = 3
const MAX_DWELL = 8

/** One vertical 9:16 panel that starts folded in half and opens on load. */
export default function Reel({
  reel,
  index,
  current,
  count,
  paused,
  onSelect,
  onFocusChange,
  onDuration,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const retried = useRef(false)
  const reduced = useReducedMotion()
  const active = index === current
  useTimecode(ref, active, paused, !reduced)

  const [status, setStatus] = useState<Status>('loading')
  const [failure, setFailure] = useState<Failure>(null)
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

  /* A stalled download falls back, but is not doomed: the retry effect below
     gives it one more go when this reel is on screen. Only reels expected to
     load start the timer, otherwise the third (metadata only) would time out
     before it ever becomes active. */
  useEffect(() => {
    if (!video || status !== 'loading' || preload !== 'auto') return
    const timer = window.setTimeout(() => {
      setStatus('failed')
      setFailure('timeout')
      onDuration(reel.id, null)
    }, FALLBACK_MS)
    return () => window.clearTimeout(timer)
  }, [video, status, preload, onDuration, reel.id])

  /* A timeout can be a slow network, so retry once on activation by reloading
     the same element. An `error` (404, bad codec) is permanent and never gets
     here. A second timeout sticks: `retried` is never reset. */
  useEffect(() => {
    if (!video || !active || status !== 'failed' || failure !== 'timeout' || retried.current) return
    const el = videoRef.current
    if (!el) return

    retried.current = true
    el.load()
    const timer = window.setTimeout(() => {
      setStatus('failed')
      setFailure('timeout')
      onDuration(reel.id, null)
    }, FALLBACK_MS)
    return () => window.clearTimeout(timer)
  }, [active, failure, status, video, onDuration, reel.id])

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
       frame stays up; a tap calls play() in the gesture itself below. */
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
      onClick={() => {
        onSelect(index)
        /* iOS only allows play() inside a real user gesture. The effect above
           runs after React's state update, which is too late on some devices. */
        if (status !== 'failed') videoRef.current?.play().catch(() => {})
      }}
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
          so it stays put and stays on top. The element stays mounted after a
          failure so the retry can reload it in place. */}
      <div className={live ? 'scene live' : 'scene'}>
        {video && (
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
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration
              onDuration(
                reel.id,
                Number.isFinite(d) ? Math.min(MAX_DWELL, Math.max(MIN_DWELL, d)) : null,
              )
            }}
            onLoadedData={() => {
              setStatus('ready')
              setFailure(null)
            }}
            onError={() => {
              setStatus('failed')
              setFailure('error')
              onDuration(reel.id, null)
            }}
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
