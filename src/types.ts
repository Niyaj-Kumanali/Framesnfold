import type { ComponentType, CSSProperties } from 'react'

/** CSSProperties plus custom properties such as `--i`. */
export type CSSVars = CSSProperties & {
  [key: `--${string}`]: string | number
}

export type ReelData = {
  id: string
  /** Accessible name of the panel. */
  label: string
  /** Text shown in the cycling headline. */
  phrase: string
  /** Placeholder scene. Replace with real footage later. */
  Scene: ComponentType
}
