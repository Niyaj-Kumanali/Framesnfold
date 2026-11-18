import { useCallback, useRef, useState } from 'react'
import { bookLink } from '../../config'
import { useCycle } from '../../hooks/useCycle'
import { usePointerFx } from '../../hooks/usePointerFx'
import { useReelNav } from '../../hooks/useReelNav'
import type { CSSVars } from '../../types'
import Reel from './Reel'
import Wordmark from './Wordmark'
import { REELS } from './reels'
import './Hero.css'

/* WhatsApp when a number is configured, an Instagram DM until then. */
const BOOKING = bookLink()

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const { current, select, next, prev, paused, setHovering, setFocusing } = useCycle(REELS.length)
  const swipe = useReelNav(heroRef, next, prev)

  /* A real clip sets its own dwell (clamped in Reel.tsx). Stored per reel so a
     switch applies the new length in the same render as the new `on` classes;
     without one, the 3.8s token in index.css still drives the placeholders. */
  const [durations, setDurations] = useState<Record<string, number | undefined>>({})
  const setReelDuration = useCallback((id: string, seconds: number | null) => {
    setDurations((d) => ({ ...d, [id]: seconds ?? undefined }))
  }, [])
  const dwell = durations[REELS[current].id]
  const heroStyle: CSSVars | undefined = dwell === undefined ? undefined : { '--dwell': `${dwell}s` }

  usePointerFx(heroRef, deckRef)

  return (
    <main ref={heroRef} className={paused ? 'hero paused' : 'hero'} style={heroStyle}>
      <div className="copy">
        <Wordmark text="framesnfold" />

        <p className="pitch">
          <span className="sr">
            Reels for bike and car pages, shop openings and weekend offers.
          </span>
          <span className="for" aria-hidden="true">
            Reels for
          </span>
          {/* The progress underline finishes, then the next phrase comes on. */}
          <span
            className="swap"
            aria-hidden="true"
            onAnimationEnd={(e) => {
              if (
                e.animationName === 'dwell' &&
                (e.target as HTMLElement).classList.contains('on')
              ) {
                next()
              }
            }}
          >
            {REELS.map((reel, i) => (
              <span key={reel.id} className={i === current ? 'w on' : 'w'}>
                {reel.phrase}
              </span>
            ))}
          </span>
        </p>

        <p className="lead">
          Edits for bike and car pages, shop openings and offer announcements. Shot and cut by
          Nawaz Kumanali.
        </p>

        <div className="cta">
          <a className="btn primary" href="#work">
            Watch the reels
          </a>
          <a className="btn ghost" href={BOOKING.href} target="_blank" rel="noopener noreferrer">
            {BOOKING.label}
          </a>
        </div>
      </div>

      <div className="stage">
        <div
          ref={deckRef}
          className="deck"
          role="group"
          aria-label="Sample reels"
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') setHovering(true)
          }}
          onPointerLeave={() => setHovering(false)}
          {...swipe}
        >
          {REELS.map((reel, i) => (
            <Reel
              key={reel.id}
              reel={reel}
              index={i}
              current={current}
              count={REELS.length}
              paused={paused}
              onSelect={(i) => {
                select(i)
                /* A click means "play this one", so drop the hover pause. The
                   pointer is still over the deck, so it stays unpaused until it
                   leaves and comes back. */
                setHovering(false)
              }}
              onFocusChange={setFocusing}
              onDuration={setReelDuration}
            />
          ))}
        </div>
        <p className="hint">
          <span className="keys" aria-hidden="true">
            ← →
          </span>
          <span>Swipe sideways or tap a panel</span>
        </p>
      </div>
    </main>
  )
}
