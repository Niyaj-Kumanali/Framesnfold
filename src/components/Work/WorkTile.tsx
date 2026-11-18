import { useEffect, useRef, useState } from 'react'
import type { WorkReel } from '../../data/work'

type Props = {
  reel: WorkReel
  /** Only this tile plays; the parent owns the single-video rule. */
  active: boolean
  reduced: boolean
  onHover: (id: string | null) => void
  onFocusChange: (id: string | null) => void
  onOpen: (reel: WorkReel, tile: HTMLButtonElement) => void
}

type VideoStatus = 'loading' | 'ready' | 'failed'
type PosterStatus = 'loading' | 'ok' | 'failed'

/** Backstop for a request that stalls without firing `error`. */
const FALLBACK_MS = 4000

/** One 9:16 tile: poster at rest, one shared playback slot when engaged. */
export default function WorkTile({
  reel,
  active,
  reduced,
  onHover,
  onFocusChange,
  onOpen,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoStatus, setVideoStatus] = useState<VideoStatus>('loading')
  const [poster, setPoster] = useState<PosterStatus>('loading')

  /* A poster checked as an Image never paints a broken-image icon. */
  useEffect(() => {
    let alive = true
    const img = new Image()
    img.onload = () => {
      if (alive) setPoster('ok')
    }
    img.onerror = () => {
      if (alive) setPoster('failed')
    }
    img.src = reel.poster
    return () => {
      alive = false
    }
  }, [reel.poster])

  useEffect(() => {
    if (reduced || videoStatus !== 'loading') return
    const timer = window.setTimeout(() => setVideoStatus('failed'), FALLBACK_MS)
    return () => window.clearTimeout(timer)
  }, [reduced, videoStatus])

  /* The parent hands out one playback slot; this effect only obeys it. */
  useEffect(() => {
    const el = videoRef.current
    if (!el || videoStatus !== 'ready') return
    if (!active || document.hidden) {
      el.pause()
      return
    }
    el.play().catch(() => {})
  }, [active, videoStatus])

  const failed = reduced ? poster === 'failed' : videoStatus === 'failed'

  return (
    <button
      type="button"
      className={active ? 'work-tile playing' : 'work-tile'}
      data-reel-id={reel.id}
      aria-label={`Open ${reel.title} reel`}
      onClick={(e) => onOpen(reel, e.currentTarget)}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') onHover(reel.id)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') onHover(null)
      }}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) onFocusChange(reel.id)
      }}
      onBlur={() => onFocusChange(null)}
    >
      <span className="work-frame">
        {poster === 'ok' && (
          <img className="work-poster" src={reel.poster} alt="" aria-hidden="true" />
        )}

        {!reduced && videoStatus !== 'failed' && (
          <video
            ref={videoRef}
            className="work-video"
            src={reel.src}
            poster={poster === 'ok' ? reel.poster : undefined}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            disablePictureInPicture
            onLoadedData={() => setVideoStatus('ready')}
            onError={() => setVideoStatus('failed')}
          />
        )}

        {failed && (
          <span className="work-placeholder" aria-hidden="true">
            <span className="work-placeholder-title">{reel.title}</span>
          </span>
        )}

        <span className="work-play" aria-hidden="true" />
      </span>

      <span className="work-caption">{reel.title}</span>
    </button>
  )
}
