import { useRef } from 'react'
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
  const reduced = useReducedMotion()
  const active = index === current
  useTimecode(ref, active, paused, !reduced)

  const { Scene } = reel
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

  return (
    <button
      ref={ref}
      type="button"
      className={active ? 'reel on' : 'reel'}
      style={style}
      aria-label={`${reel.label}, sample reel`}
      aria-pressed={active}
      onClick={() => onSelect(index)}
      onFocus={() => {
        onSelect(index)
        onFocusChange(true)
      }}
      onBlur={() => onFocusChange(false)}
    >
      <div className="fold">
        <div className="half l">
          <Scene />
        </div>
        <div className="half r">
          <Scene />
          <div className="shade" />
        </div>
      </div>
    </button>
  )
}
