import { useEffect, useRef, useState } from 'react'
import { WORK_FILTERS, WORK_REELS } from '../../data/work'
import type { WorkFilter, WorkReel } from '../../data/work'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import WorkTile from './WorkTile'
import './Work.css'

/** Lowest share of a tile that counts as "the one in view" on touch. */
const IN_VIEW = 0.3

export default function Work() {
  const reduced = useReducedMotion()
  const [touch] = useState(() => window.matchMedia('(hover: none)').matches)
  const [filter, setFilter] = useState<WorkFilter>('all')
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [inViewId, setInViewId] = useState<string | null>(null)
  const [tabHidden, setTabHidden] = useState(() => document.hidden)
  const [openReel, setOpenReel] = useState<WorkReel | null>(null)

  const gridRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)

  /* Nothing plays on touch until a tile is mostly on screen, and only the most
     visible one gets the slot. Mouse and keyboard use hover/focus instead. */
  useEffect(() => {
    if (!touch || reduced || !('IntersectionObserver' in window)) return
    const grid = gridRef.current
    if (!grid) return

    const ratios = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.reelId
          if (!id) continue
          if (entry.isIntersecting) ratios.set(id, entry.intersectionRatio)
          else ratios.delete(id)
        }
        let best: string | null = null
        let top = IN_VIEW
        ratios.forEach((ratio, id) => {
          if (ratio > top) {
            top = ratio
            best = id
          }
        })
        setInViewId(best)
      },
      { threshold: [0, IN_VIEW, 0.6, 0.9] },
    )

    grid.querySelectorAll<HTMLElement>('[data-reel-id]').forEach((tile) => observer.observe(tile))
    return () => {
      observer.disconnect()
      ratios.clear()
    }
  }, [touch, reduced, filter])

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (openReel && dialog && !dialog.open) dialog.showModal()
  }, [openReel])

  const playingId =
    tabHidden || openReel || reduced
      ? null
      : (focusId ?? hoverId ?? (touch ? inViewId : null))

  const shown = filter === 'all' ? WORK_REELS : WORK_REELS.filter((reel) => reel.kind === filter)

  const clearEngagement = () => {
    setHoverId(null)
    setFocusId(null)
    setInViewId(null)
  }

  const closeLightbox = () => {
    dialogRef.current?.querySelector('video')?.pause()
    setOpenReel(null)
    /* Native dialogs restore focus as they close; wait for that to settle so
       the tile we opened from gets it last. */
    const tile = openerRef.current
    if (tile) window.setTimeout(() => tile.focus(), 0)
  }

  return (
    <section id="work" className="section work-section">
      <h2>Recent work</h2>
      <p className="work-context">Reels for bike and car pages, shops and offers.</p>

      <div className="work-filters" role="group" aria-label="Filter work">
        {WORK_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="work-filter"
            aria-pressed={filter === item.id}
            onClick={() => {
              setFilter(item.id)
              clearEngagement()
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="work-grid" ref={gridRef}>
        {shown.map((reel) => (
          <WorkTile
            key={reel.id}
            reel={reel}
            active={playingId === reel.id}
            reduced={reduced}
            onHover={setHoverId}
            onFocusChange={setFocusId}
            onOpen={(chosen, tile) => {
              tile.focus()
              openerRef.current = tile
              setOpenReel(chosen)
            }}
          />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={openReel ? `${openReel.title} reel` : 'Reel'}
        onClose={closeLightbox}
      >
        {openReel && (
          <>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => dialogRef.current?.close()}
            >
              Close
            </button>
            <video
              key={openReel.id}
              className="lightbox-video"
              src={openReel.src}
              poster={openReel.poster}
              controls
              loop
              playsInline
              disablePictureInPicture
            />
            <p className="lightbox-caption">{openReel.title}</p>
          </>
        )}
      </dialog>
    </section>
  )
}
