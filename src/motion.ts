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
    { at: 0.5, z: 0, y: 0, scale: 1, opacity: 1 },
    { at: 0.58, z: 260, y: -40, opacity: 0, blur: 10 },
    { at: 1, z: 260, y: -40, opacity: 0, blur: 10 },
  ],
  'work-heading': [
    { at: 0, y: 28, opacity: 0, blur: 8 },
    { at: 0.45, y: 28, opacity: 0, blur: 8 },
    { at: 0.51, y: 0, opacity: 1, blur: 0 },
    { at: 0.54, y: 0, opacity: 1 },
    { at: 0.58, y: -24, opacity: 0, blur: 8 },
    { at: 1, y: -24, opacity: 0, blur: 8 },
  ],
  closeup: [
    { at: 0, z: -1200, x: 80, scale: 0.7, opacity: 0, blur: 16 },
    { at: 0.52, z: -700, x: 60, scale: 0.8, opacity: 0, blur: 12 },
    { at: 0.6, z: 0, x: 0, scale: 1, opacity: 1, blur: 0 },
    { at: 0.62, z: 60, x: 0, scale: 1.04, opacity: 1 },
    { at: 0.74, z: 460, x: -90, scale: 1.14, opacity: 0, blur: 14 },
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
  const ellipseScale = Math.min(0.78, Math.max(0.42, lineScale * 1.15))
  const radiusX = Math.min(width * 0.26, height * 0.42, 340)
  const radiusY = radiusX * 0.42
  const halfEllipseCard = (cardWidth * ellipseScale) / 2
  const rightLimit = width / 2 - radiusX - halfEllipseCard - 18
  const centerRight = Math.max(width * 0.04, Math.min(width * 0.2, rightLimit))
  const centerLeft = -Math.min(width * 0.14, radiusX * 0.7)
  const lineLeft = -Math.min(width * 0.18, radiusX * 0.85)
  const angle = (240 + index * 60) * (Math.PI / 180)
  const tx = (x: number) => x - baseX
  const ty = (y: number) => y - baseY

  const ellipsePoint = (centerX: number, rx: number, ry: number, tilt: number) => ({
    x: centerX + Math.cos(angle) * rx,
    y: Math.sin(angle) * ry,
    rx: tilt,
    ry: Math.cos(angle) * 10,
    rz: Math.sin(angle) * 9,
  })

  const ellipseRight = ellipsePoint(centerRight, radiusX, radiusY, 16)
  const ellipseLeft = ellipsePoint(centerLeft, radiusX, radiusY, 16)
  const ellipseCurl = ellipsePoint(
    (lineLeft + centerRight) / 2,
    radiusX * 0.72,
    radiusY * 0.55,
    9,
  )
  const lineX = (centerX: number) => centerX + (index - 2.5) * lineSpacing
  const peelStart = 0.345 + index * 0.008
  const peelEnd = 0.415 + index * 0.006

  return [
    {
      at: 0,
      x: tx(0),
      y: ty(0),
      z: -1850 + index * 55,
      scale: 0.34 + index * 0.018,
      opacity: 0,
      blur: 22,
    },
    {
      at: 0.08,
      x: tx(0),
      y: ty(0),
      z: -1050 + index * 35,
      scale: 0.46 + index * 0.012,
      opacity: 0.7 + index * 0.05,
      blur: 12,
    },
    { at: 0.14, x: tx(lineX(0)), y: ty(0), z: -260, scale: lineScale, opacity: 1, blur: 0 },
    { at: 0.2, x: tx(lineX(lineLeft)), y: ty(0), z: -220, scale: lineScale, opacity: 1 },
    {
      at: 0.235,
      x: tx(ellipseCurl.x),
      y: ty(ellipseCurl.y),
      z: -140,
      rx: ellipseCurl.rx,
      ry: ellipseCurl.ry,
      rz: ellipseCurl.rz,
      scale: (lineScale + ellipseScale) / 2,
      opacity: 1,
    },
    {
      at: 0.27,
      x: tx(ellipseRight.x),
      y: ty(ellipseRight.y),
      z: -90,
      rx: ellipseRight.rx,
      ry: ellipseRight.ry,
      rz: ellipseRight.rz,
      scale: ellipseScale,
      opacity: 1,
    },
    {
      at: 0.34,
      x: tx(ellipseLeft.x),
      y: ty(ellipseLeft.y),
      z: -90,
      rx: ellipseLeft.rx,
      ry: ellipseLeft.ry,
      rz: ellipseLeft.rz,
      scale: ellipseScale,
      opacity: 1,
    },
    {
      at: peelStart,
      x: tx(ellipseLeft.x),
      y: ty(ellipseLeft.y),
      z: -90,
      rx: ellipseLeft.rx,
      ry: ellipseLeft.ry,
      rz: ellipseLeft.rz,
      scale: ellipseScale,
      opacity: 1,
    },
    { at: peelEnd, x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, scale: 1, opacity: 1 },
    { at: 0.45, x: 0, y: 0, z: 0, scale: 1, opacity: 1 },
    { at: 0.58, x: 0, y: -46, z: 300 + index * 20, scale: 1.1, opacity: 0, blur: 10 },
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
