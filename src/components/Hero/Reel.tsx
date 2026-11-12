import { useRef } from 'react'
import type { CSSVars, ReelData } from '../../types'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useTimecode } from '../../hooks/useTimecode'

type Props = {
  reel: ReelData
  index: number
  active: boolean
  paused: boolean
  onSelect: (index: number) => void
  onFocusChange: (focused: boolean) => void
}

/** One vertical 9:16 panel that starts folded in half and opens on load. */
export default function Reel({
  reel,
  index,
  active,
  paused,
  onSelect,
  onFocusChange,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()
  useTimecode(ref, active, paused, !reduced)

  const { Scene } = reel
  const style: CSSVars = { '--i': index }

  return (
    <button
      ref={ref}
      type="button"
      className={active ? 'reel on' : 'reel'}
      style={style}
      aria-label={`${reel.label}, sample reel`}
      aria-pressed={active}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') onSelect(index)
      }}
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
