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

type OrbitGeometry = {
  width: number
  columns: number
  baseX: (index: number) => number
  baseY: (index: number) => number
  lineSpacing: number
  lineScale: number
  ellipseScale: number
  radiusX: number
  radiusZ: number
  tilt: number
  centerRight: number
  centerLeft: number
  lineLeft: number
}

function orbitGeometry(): OrbitGeometry {
  const width = typeof window === 'undefined' ? 1440 : window.innerWidth
  const height = typeof window === 'undefined' ? 900 : window.innerHeight
  const columns = width <= 700 ? 2 : 3
  const rows = Math.ceil(6 / columns)
  const wrapWidth = Math.min(width * 0.92, width - 48, 1100)
  const gap = Math.min(20, Math.max(10, width * 0.015))
  const cardWidth = (wrapWidth - gap * (columns - 1)) / columns
  const cardHeight = cardWidth * (9 / 16)
  const stride = cardWidth + gap
  const lineSpacing = Math.min(width * 0.16, stride * 0.62)
  const lineScale = Math.min(1, lineSpacing / stride)
  const ellipseScale = Math.min(0.78, Math.max(0.42, lineScale * 1.15))
  const radiusX = Math.min(width * 0.27, height * 0.42, 340)
  const radiusZ = Math.min(radiusX * 0.5, height * 0.3, 190)
  const tilt = -58
  const halfCard = (cardWidth * ellipseScale) / 2
  const rightLimit = width / 2 - radiusX - halfCard - 16
  const centerRight = Math.max(width * 0.06, Math.min(width * 0.2, rightLimit))
  const centerLeft = -Math.min(width * 0.14, radiusX * 0.62)
  const lineLeft = -Math.min(width * 0.16, radiusX * 0.7)

  return {
    width,
    columns,
    baseX: (index) => ((index % columns) - (columns - 1) / 2) * stride,
    baseY: (index) => (Math.floor(index / columns) - (rows - 1) / 2) * (cardHeight + gap),
    lineSpacing,
    lineScale,
    ellipseScale,
    radiusX,
    radiusZ,
    tilt,
    centerRight,
    centerLeft,
    lineLeft,
  }
}

export function ringStops(): MotionStop[] {
  const { centerRight, centerLeft, tilt } = orbitGeometry()
  return [
    { at: 0, x: 0, rx: 0 },
    { at: 0.2, x: 0, rx: 0 },
    { at: 0.235, x: centerRight * 0.45, rx: tilt * 0.45 },
    { at: 0.27, x: centerRight, rx: tilt },
    { at: 0.34, x: centerLeft, rx: tilt },
    { at: 0.415, x: 0, rx: 0 },
    { at: 1, x: 0, rx: 0 },
  ]
}

export function cardStops(index: number): MotionStop[] {
  const geo = orbitGeometry()
  const angle = (240 + index * 60) * (Math.PI / 180)
  const sin = Math.sin(angle)
  const cos = Math.cos(angle)
  const tx = (x: number) => x - geo.baseX(index)
  const ty = (y: number) => y - geo.baseY(index)
  const lineX = (centerX: number) => centerX + (index - 2.5) * geo.lineSpacing

  // The orbit lies on a tilted X/Z plane. The ring parent applies the tilt;
  // these are the card positions on that plane before projection.
  const orbitX = cos * geo.radiusX
  const orbitZ = sin * geo.radiusZ
  const orbit = {
    x: tx(orbitX),
    y: ty(0),
    z: orbitZ,
    rx: 34 + sin * 4,
    ry: -cos * 14,
    rz: sin * 5,
    scale: geo.ellipseScale * (1 + sin * 0.08),
    brightness: 1 + sin * 0.18,
  }

  const curl = {
    x: tx(orbitX * 0.72),
    y: ty(0),
    z: orbitZ * 0.55,
    rx: orbit.rx * 0.5,
    ry: orbit.ry * 0.5,
    rz: orbit.rz * 0.5,
    scale: ((geo.lineScale + geo.ellipseScale) / 2) * (1 + sin * 0.04),
    brightness: 1 + sin * 0.09,
  }

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
      brightness: 0.7 + index * 0.05,
    },
    {
      at: 0.08,
      x: tx(0),
      y: ty(0),
      z: -1050 + index * 35,
      scale: 0.46 + index * 0.012,
      opacity: 0.7 + index * 0.05,
      blur: 12,
      brightness: 0.9 + index * 0.015,
    },
    {
      at: 0.14,
      x: tx(lineX(0)),
      y: ty(0),
      z: -260,
      scale: geo.lineScale,
      opacity: 1,
      blur: 0,
      brightness: 1,
    },
    {
      at: 0.2,
      x: tx(lineX(geo.lineLeft)),
      y: ty(0),
      z: -220,
      scale: geo.lineScale,
      opacity: 1,
      brightness: 1,
    },
    { at: 0.235, ...curl, opacity: 1 },
    { at: 0.27, ...orbit, opacity: 1 },
    // Local orbit values stay identical through the sweep: the ring parent
    // translates the whole tilted X/Z system from right to left.
    { at: 0.34, ...orbit, opacity: 1 },
    { at: peelStart, ...orbit, opacity: 1 },
    {
      at: peelEnd,
      x: 0,
      y: 0,
      z: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      scale: 1,
      opacity: 1,
      brightness: 1,
    },
    { at: 0.45, x: 0, y: 0, z: 0, scale: 1, opacity: 1, brightness: 1 },
    {
      at: 0.58,
      x: 0,
      y: -46,
      z: 300 + index * 20,
      scale: 1.1,
      opacity: 0,
      blur: 10,
      brightness: 1,
    },
    {
      at: 1,
      x: 0,
      y: -46,
      z: 300 + index * 20,
      scale: 1.1,
      opacity: 0,
      blur: 10,
      brightness: 1,
    },
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
