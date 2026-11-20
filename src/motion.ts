export type LayerState = {
  x: number
  y: number
  z: number
  rx: number
  ry: number
  rz: number
  scale: number
  opacity: number
  blur: number
  brightness: number
}

export type MotionStop = Partial<LayerState> & { at: number }

const BASE: LayerState = {
  x: 0,
  y: 0,
  z: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  scale: 1,
  opacity: 1,
  blur: 0,
  brightness: 1,
}

const lerp = (from: number, to: number, t: number) => from + (to - from) * t
const smooth = (t: number) => t * t * (3 - 2 * t)

function stateAt(stop: MotionStop): LayerState {
  return {
    x: stop.x ?? BASE.x,
    y: stop.y ?? BASE.y,
    z: stop.z ?? BASE.z,
    rx: stop.rx ?? BASE.rx,
    ry: stop.ry ?? BASE.ry,
    rz: stop.rz ?? BASE.rz,
    scale: stop.scale ?? BASE.scale,
    opacity: stop.opacity ?? BASE.opacity,
    blur: stop.blur ?? BASE.blur,
    brightness: stop.brightness ?? BASE.brightness,
  }
}

export function sampleLayer(stops: MotionStop[], progress: number): LayerState {
  const first = stops[0]
  const last = stops[stops.length - 1]
  if (!first || !last) return BASE
  if (progress <= first.at) return stateAt(first)
  if (progress >= last.at) return stateAt(last)

  for (let i = 0; i < stops.length - 1; i += 1) {
    const a = stops[i]
    const b = stops[i + 1]
    if (progress >= a.at && progress <= b.at) {
      const span = b.at - a.at
      const t = span === 0 ? 1 : smooth((progress - a.at) / span)
      const from = stateAt(a)
      const to = stateAt(b)
      return {
        x: lerp(from.x, to.x, t),
        y: lerp(from.y, to.y, t),
        z: lerp(from.z, to.z, t),
        rx: lerp(from.rx, to.rx, t),
        ry: lerp(from.ry, to.ry, t),
        rz: lerp(from.rz, to.rz, t),
        scale: lerp(from.scale, to.scale, t),
        opacity: lerp(from.opacity, to.opacity, t),
        blur: lerp(from.blur, to.blur, t),
        brightness: lerp(from.brightness, to.brightness, t),
      }
    }
  }

  return stateAt(last)
}

export const LAYER_STOPS: Record<string, MotionStop[]> = {
  ambient: [
    { at: 0, opacity: 0.45, scale: 0.94 },
    { at: 0.36, opacity: 0.9, scale: 1.02 },
    { at: 0.62, opacity: 0.55, scale: 0.98 },
    { at: 1, opacity: 1, scale: 1.08 },
  ],
  title: [
    { at: 0, z: 0, y: -10, scale: 1, opacity: 1, blur: 0 },
    { at: 0.08, z: 0, y: 0, scale: 1, opacity: 1 },
    { at: 0.2, z: -420, y: -110, scale: 0.72, opacity: 0, blur: 10 },
    { at: 1, z: -420, y: -110, scale: 0.72, opacity: 0, blur: 10 },
  ],
  portrait: [
    { at: 0, x: 16, y: 0, z: 0, ry: -4, scale: 1, opacity: 1, blur: 0 },
    { at: 0.08, x: 8, y: 0, z: 0, ry: -2, scale: 1.02, opacity: 1 },
    { at: 0.2, x: 100, y: -40, z: -200, ry: 4, scale: 0.85, opacity: 0, blur: 10 },
    { at: 1, x: 100, y: -40, z: -200, ry: 4, scale: 0.85, opacity: 0, blur: 10 },
  ],
  work: [
    { at: 0, z: -220, y: 36, opacity: 0, blur: 8 },
    { at: 0.12, z: 0, y: 0, opacity: 1, blur: 0 },
    { at: 0.5, z: 0, y: 0, opacity: 1 },
    { at: 0.56, z: 260, y: -40, opacity: 0, blur: 10 },
    { at: 1, z: 260, y: -40, opacity: 0, blur: 10 },
  ],
  'work-heading': [
    { at: 0, y: 20, opacity: 0, blur: 6 },
    { at: 0.12, y: 0, opacity: 1, blur: 0 },
    { at: 0.3, y: 0, opacity: 1 },
    { at: 0.44, y: -16, opacity: 0, blur: 8 },
    { at: 1, y: -16, opacity: 0, blur: 8 },
  ],
  closeup: [
    { at: 0, z: -1200, x: 80, scale: 0.7, opacity: 0, blur: 16 },
    { at: 0.44, z: -700, x: 60, scale: 0.8, opacity: 0, blur: 12 },
    { at: 0.5, z: -700, x: 60, scale: 0.8, opacity: 0, blur: 12 },
    { at: 0.56, z: 0, x: 0, scale: 1, opacity: 1, blur: 0 },
    { at: 0.64, z: 60, x: 0, scale: 1.04, opacity: 1 },
    { at: 0.72, z: 460, x: -90, scale: 1.14, opacity: 0, blur: 14 },
    { at: 1, z: 460, x: -90, scale: 1.14, opacity: 0, blur: 14 },
  ],
  services: [
    { at: 0, z: -1300, y: 70, ry: 14, opacity: 0, blur: 14 },
    { at: 0.54, z: -800, y: 50, ry: 10, opacity: 0, blur: 10 },
    { at: 0.66, z: 0, y: 0, ry: 0, opacity: 1, blur: 0 },
    { at: 0.78, z: 50, y: 0, ry: -4, opacity: 1 },
    { at: 0.9, z: 520, y: -70, ry: -12, opacity: 0, blur: 14 },
    { at: 1, z: 520, y: -70, ry: -12, opacity: 0, blur: 14 },
  ],
  contact: [
    { at: 0, z: -1500, scale: 0.72, opacity: 0, blur: 18 },
    { at: 0.78, z: -900, scale: 0.82, opacity: 0, blur: 12 },
    { at: 0.89, z: 0, scale: 1, opacity: 1, blur: 0 },
    { at: 1, z: 140, scale: 1.03, opacity: 1, blur: 0 },
  ],
}

// The current renderer still expects a work-ring layer. The original pre-orbit
// animation has no ring, so this keeps that layer neutral and invisible-free.
export function ringStops(): MotionStop[] {
  return [
    {
      at: 0,
      x: 0,
      y: 0,
      z: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      scale: 1,
      opacity: 1,
      blur: 0,
      brightness: 1,
    },
    {
      at: 1,
      x: 0,
      y: 0,
      z: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      scale: 1,
      opacity: 1,
      blur: 0,
      brightness: 1,
    },
  ]
}

export function cardStops(index: number, centerX: number): MotionStop[] {
  const passStart = 0.105 + index * 0.045
  const arrive = passStart + 0.013
  const depart = arrive + 0.019
  const passEnd = depart + 0.013
  const settleStart = 0.377
  const settleEnd = 0.398 + index * 0.002
  const depth = index * 18

  return [
    { at: 0, x: -1400, y: 24, z: -700 - depth, scale: 0.92, opacity: 0, blur: 10 },
    { at: passStart, x: -1400, y: 24, z: -400 - depth, scale: 0.92, opacity: 1, blur: 0 },
    { at: arrive, x: centerX, y: 0, z: 0, scale: 1.08, opacity: 1, blur: 0 },
    { at: depart, x: centerX, y: 0, z: 0, scale: 1.08, opacity: 1, blur: 0 },
    { at: passEnd, x: 1400, y: -24, z: -400 - depth, scale: 0.92, opacity: 1, blur: 0 },
    { at: settleStart, x: 1400, y: -24, z: -400 - depth, scale: 0.92, opacity: 1, blur: 0 },
    { at: settleEnd, x: 0, y: 0, z: 0, scale: 1, opacity: 1, blur: 0 },
    { at: 0.5, x: 0, y: 0, z: 0, scale: 1, opacity: 1, blur: 0 },
    { at: 0.56, z: 300 + depth, y: -60, scale: 1.12, opacity: 0, blur: 10 },
    { at: 1, z: 300 + depth, y: -60, scale: 1.12, opacity: 0, blur: 10 },
  ]
}

export function serviceStops(index: number): MotionStop[] {
  const offset = (index - 1) * 26
  return [
    { at: 0, z: -900 + offset, x: offset, opacity: 0, blur: 12 },
    { at: 0.6, z: -500 + offset, x: offset, opacity: 0, blur: 8 },
    { at: 0.68, z: offset, x: offset * 0.3, opacity: 1, blur: 0 },
    { at: 0.78, z: offset, x: 0, opacity: 1 },
    { at: 0.9, z: 400 + offset, x: -offset, opacity: 0, blur: 12 },
    { at: 1, z: 400 + offset, x: -offset, opacity: 0, blur: 12 },
  ]
}
