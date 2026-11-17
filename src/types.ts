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
  /** Placeholder scene. Also the fallback when the video is missing. */
  Scene: ComponentType
  /**
   * Real footage. Drop the files in `public/reels/` and this is all the wiring
   * needed: the panel plays the video, the fold halves use the poster still and
   * the scene above stays as the fallback.
   */
  video?: { src: string; poster: string }
}
