import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  /** Index of the reel the CSS deck has selected. */
  active: number
  /** Hover/keyboard pause freezes the scene too. */
  paused: boolean
}

const INK = new THREE.Color('#0e0d0c')
const EMBER = new THREE.Color('#ff5a1f')
const PAPER = new THREE.Color('#f2ede6')

/** Shared by every half-frame; one geometry for the whole scene. */
const HALF_EDGES = new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.08, 1.92))

/** One folded 9:16 card. Two halves hinge at the centre, like the CSS panels. */
function FoldedCard({ index, active }: { index: number; active: number }) {
  const group = useRef<THREE.Group>(null)
  const left = useRef<THREE.Mesh>(null)
  const right = useRef<THREE.Mesh>(null)
  const hinge = useRef<THREE.Mesh>(null)
  const leftMat = useRef<THREE.MeshBasicMaterial>(null)
  const rightMat = useRef<THREE.MeshBasicMaterial>(null)
  const hingeMat = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return

    const on = index === active
    const side = index - 1
    const fold = on ? 0.18 : 0.62

    g.position.x = THREE.MathUtils.damp(g.position.x, side * 1.95, 4, delta)
    g.position.z = THREE.MathUtils.damp(g.position.z, on ? 0.7 : -1.2, 4, delta)
    g.position.y = THREE.MathUtils.damp(g.position.y, on ? 0.08 : -0.18, 4, delta)
    const scale = THREE.MathUtils.damp(g.scale.x, on ? 1.12 : 0.78, 4, delta)
    g.scale.setScalar(scale)

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, on ? 0 : side * -0.34, 3.5, delta)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, side * 0.07, 3.5, delta)

    if (left.current && right.current) {
      left.current.rotation.y = THREE.MathUtils.damp(left.current.rotation.y, fold, 5, delta)
      right.current.rotation.y = THREE.MathUtils.damp(right.current.rotation.y, -fold, 5, delta)
    }

    const face = leftMat.current
    const shade = rightMat.current
    if (face && shade) {
      face.color.lerpColors(INK, on ? EMBER : PAPER, on ? 0.72 : 0.12)
      shade.color.lerpColors(INK, on ? EMBER : PAPER, on ? 0.28 : 0.06)
      face.opacity = THREE.MathUtils.damp(face.opacity, on ? 0.42 : 0.13, 4, delta)
      shade.opacity = THREE.MathUtils.damp(shade.opacity, on ? 0.2 : 0.07, 4, delta)
    }

    if (hinge.current && hingeMat.current) {
      hinge.current.rotation.y = THREE.MathUtils.damp(hinge.current.rotation.y, fold, 5, delta)
      hingeMat.current.opacity = THREE.MathUtils.damp(hingeMat.current.opacity, on ? 0.9 : 0.3, 4, delta)
      hingeMat.current.color.lerpColors(PAPER, EMBER, on ? 1 : 0)
    }
  })

  return (
    <group ref={group} position={[(index - 1) * 1.95, -0.18, -1.2]} scale={0.78}>
      <mesh ref={left} position={[-0.54, 0, 0]}>
        <planeGeometry args={[1.08, 1.92]} />
        <meshBasicMaterial
          ref={leftMat}
          color="#0e0d0c"
          transparent
          opacity={0.13}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
        <lineSegments geometry={HALF_EDGES} position={[0, 0, 0.004]}>
          <lineBasicMaterial color="#f2ede6" transparent opacity={0.2} depthWrite={false} />
        </lineSegments>
      </mesh>

      <mesh ref={right} position={[0.54, 0, 0]}>
        <planeGeometry args={[1.08, 1.92]} />
        <meshBasicMaterial
          ref={rightMat}
          color="#0e0d0c"
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
        <lineSegments geometry={HALF_EDGES} position={[0, 0, 0.004]}>
          <lineBasicMaterial color="#f2ede6" transparent opacity={0.12} depthWrite={false} />
        </lineSegments>
      </mesh>

      <mesh ref={hinge} position={[0, 0, 0.02]}>
        <boxGeometry args={[0.012, 1.92, 0.012]} />
        <meshBasicMaterial ref={hingeMat} color="#f2ede6" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

/** Stable pseudo-random: the dust must not change when React re-renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

/** Slow ember dust, so the dark space around the panels feels alive. */
function Dust({ paused }: { paused: boolean }) {
  const points = useRef<THREE.Points>(null)
  const time = useRef(0)

  const geometry = useMemo(() => {
    const count = 64
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 2.4 + rand(i + 1) * 4.2
      const angle = rand(i + 101) * Math.PI * 2
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (rand(i + 201) - 0.5) * 5.2
      positions[i * 3 + 2] = Math.sin(angle) * radius - 1.6
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, delta) => {
    if (!points.current || paused) return
    time.current += delta
    points.current.rotation.y += delta * 0.035
    points.current.rotation.x = Math.sin(time.current * 0.18) * 0.06
    points.current.position.y = Math.sin(time.current * 0.4) * 0.06
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.022}
        color="#ff5a1f"
        transparent
        opacity={0.4}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/** The moving camera rig: pointer parallax plus a slow idle drift. */
function Rig({ active, paused }: Props) {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const time = useRef(0)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((_, delta) => {
    if (!paused) time.current += delta
    const t = time.current

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        pointer.current.x * 0.24 + Math.sin(t * 0.22) * 0.05,
        2.6,
        delta,
      )
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        -pointer.current.y * 0.16 + Math.sin(t * 0.17) * 0.025,
        2.6,
        delta,
      )
      group.current.position.y = Math.sin(t * 0.45) * 0.05
    }

    if (ring.current && !paused) ring.current.rotation.z += delta * 0.06
  })

  return (
    <group ref={group}>
      <mesh ref={ring} position={[0, 0, -2.4]} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.9, 0.006, 6, 140]} />
        <meshBasicMaterial color="#ff5a1f" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <FoldedCard key={i} index={i} active={active} />
      ))}
    </group>
  )
}

/** WebGL scene. The parent gate decides whether this chunk is worth loading. */
export default function WebGLScene({ active, paused }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(() => document.hidden)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  /* Once the hero scrolls away there is no reason to keep a GL loop alive. */
  useEffect(() => {
    const host = hostRef.current
    if (!host || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={hostRef} className="scene3d" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 8.4], fov: 38 }}
        frameloop={hidden || !inView ? 'never' : 'always'}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[2.5, 1.5, 4]} intensity={14} color="#ff5a1f" distance={12} />
        <Rig active={active} paused={paused || hidden} />
        <Dust paused={paused || hidden} />
      </Canvas>
    </div>
  )
}
