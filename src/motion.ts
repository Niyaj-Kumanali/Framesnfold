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
    { at: 0, z: -520, y: 44, scale: 0.9, opacity: 0, blur: 10 },
    { at: 0.12, z: 0, y: 0, scale: 1, opacity: 1, blur: 0 },
    { at: 0.42, z: 0, y: 0, scale: 1, opacity: 1 },
    { at: 0.48, z: 260, y: -40, opacity: 0, blur: 10 },
    { at: 1, z: 260, y: -40, opacity: 0, blur: 10 },
  ],
  'work-heading': [
    { at: 0, y: 28, opacity: 0, blur: 8 },
    { at: 0.3, y: 28, opacity: 0, blur: 8 },
    { at: 0.36, y: 0, opacity: 1, blur: 0 },
    { at: 0.42, y: 0, opacity: 1 },
    { at: 0.48, y: -24, opacity: 0, blur: 8 },
    { at: 1, y: -24, opacity: 0, blur: 8 },
  ],
  closeup: [
    { at: 0, z: -1200, x: 80, scale: 0.7, opacity: 0, blur: 16 },
    { at: 0.34, z: -700, x: 60, scale: 0.8, opacity: 0, blur: 12 },
    { at: 0.45, z: 0, x: 0, scale: 1, opacity: 1, blur: 0 },
    { at: 0.56, z: 60, x: 0, scale: 1.04, opacity: 1 },
    { at: 0.7, z: 460, x: -90, scale: 1.14, opacity: 0, blur: 14 },
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

export function cardStops(index: number): MotionStop[] {
  const width = typeof window === 'undefined' ? 1440 : window.innerWidth
  const height = typeof window === 'undefined' ? 900 : window.innerHeight
  const columns = width <= 700 ? 2 : 3
  const rows = Math.ceil(6 / columns)
  const column = index % columns
  const row = Math.floor(index / columns)
  const wrapWidth = Math.min(width * 0.92, width - 48, 1100)
  const gap = Math.min(20, Math.max(10, width * 0.015))
  const cardWidth = (wrapWidth - gap * (columns - 1)) / columns
  const cardHeight = cardWidth * (9 / 16)
  const baseX = (column - (columns - 1) / 2) * (cardWidth + gap)
  const baseY = (row - (rows - 1) / 2) * (cardHeight + gap)
  const stride = cardWidth + gap
  const lineSpacing = Math.min(width * 0.16, stride * 0.62)
  const lineScale = Math.min(1, lineSpacing / stride)
  const lineOffX = -width * 0.95 + index * lineSpacing
  const lineOnX = (index - 2.5) * lineSpacing
  const tx = (targetX: number) => targetX - baseX
  const ty = (targetY: number) => targetY - baseY
  const radius = Math.min(width * 0.22, height * 0.32, 260)

  const circle = (offsetDeg: number, centerX: number) => {
    const degrees = index * 60 + offsetDeg
    const radians = (degrees - 90) * (Math.PI / 180)
    return {
      x: centerX + Math.cos(radians) * radius,
      y: Math.sin(radians) * radius * 0.48,
      rz: degrees * 0.35,
    }
  }

  const circleRight = circle(0, width * 0.22)
  const circleLeft = circle(-60, -width * 0.05)

  return [
    {
      at: 0,
      x: tx(0),
      y: ty(0),
      z: -1800 - index * 50,
      scale: 0.38,
      opacity: 0,
      blur: 22,
    },
    {
      at: 0.08,
      x: tx((index - 2.5) * 18),
      y: ty(0),
      z: -950 - index * 30,
      scale: 0.45,
      opacity: 0.25,
      blur: 14,
    },
    {
      at: 0.14,
      x: tx(lineOffX),
      y: ty(0),
      z: -320,
      scale: lineScale * 0.9,
      opacity: 1,
      blur: 5,
    },
    {
      at: 0.19,
      x: tx(lineOnX),
      y: ty(0),
      z: -180,
      scale: lineScale,
      opacity: 1,
      blur: 0,
    },
    {
      at: 0.23,
      x: tx(circleRight.x),
      y: ty(circleRight.y),
      z: -60,
      rx: 58,
      rz: circleRight.rz,
      scale: 0.8,
      opacity: 1,
    },
    {
      at: 0.29,
      x: tx(circleLeft.x),
      y: ty(circleLeft.y),
      z: -60,
      rx: 58,
      rz: circleLeft.rz,
      scale: 0.8,
      opacity: 1,
    },
    { at: 0.35, x: 0, y: 0, z: 0, rx: 0, rz: 0, scale: 1, opacity: 1 },
    { at: 0.42, x: 0, y: 0, z: 0, scale: 1, opacity: 1 },
    { at: 0.48, x: 0, y: -46, z: 300 + index * 20, scale: 1.1, opacity: 0, blur: 10 },
    { at: 1, x: 0, y: -46, z: 300 + index * 20, scale: 1.1, opacity: 0, blur: 10 },
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
