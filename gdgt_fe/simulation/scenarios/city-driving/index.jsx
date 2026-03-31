'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { XROrigin } from '@react-three/xr'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useGameStore } from '../../engine/useGameStore'
import { FollowCamera } from '../../engine/FollowCamera'
import { checkStateBasedViolations } from '../../engine/ViolationDetector'
import { PostProcessing } from '../../engine/PostProcessing'

// ─── Traffic Light ────────────────────────────────────────────────────────────
const LIGHT_GREEN = 8
const LIGHT_YELLOW = 2
const LIGHT_RED = 8
const CYCLE = LIGHT_GREEN + LIGHT_YELLOW + LIGHT_RED

// Shared traffic light phase ref — readable by sensors
const trafficLightPhase = { current: 'green' }

function TrafficLight({ position }) {
  const greenRef = useRef()
  const yellowRef = useRef()
  const redRef = useRef()
  const timer = useRef(0)

  useFrame((_, delta) => {
    timer.current = (timer.current + delta) % CYCLE
    const t = timer.current
    const phase = t < LIGHT_GREEN ? 'green' : t < LIGHT_GREEN + LIGHT_YELLOW ? 'yellow' : 'red'
    trafficLightPhase.current = phase

    if (greenRef.current) {
      greenRef.current.material.emissive.set(phase === 'green' ? '#16a34a' : '#111')
      greenRef.current.material.emissiveIntensity = phase === 'green' ? 1.5 : 0
    }
    if (yellowRef.current) {
      yellowRef.current.material.emissive.set(phase === 'yellow' ? '#f59e0b' : '#111')
      yellowRef.current.material.emissiveIntensity = phase === 'yellow' ? 1.5 : 0
    }
    if (redRef.current) {
      redRef.current.material.emissive.set(phase === 'red' ? '#dc2626' : '#111')
      redRef.current.material.emissiveIntensity = phase === 'red' ? 1.5 : 0
    }
  })

  return (
    <group position={position}>
      {/* Pole */}
      <mesh castShadow position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Housing */}
      <mesh castShadow position={[0, 5.2, 0]}>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Red light */}
      <mesh ref={redRef} position={[0, 5.6, 0.21]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0} />
      </mesh>
      {/* Yellow light */}
      <mesh ref={yellowRef} position={[0, 5.2, 0.21]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0} />
      </mesh>
      {/* Green light */}
      <mesh ref={greenRef} position={[0, 4.8, 0.21]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#16a34a" emissive="#16a34a" emissiveIntensity={0} />
      </mesh>
    </group>
  )
}

// ─── Road ────────────────────────────────────────────────────────────────────
function Road() {
  return (
    <group>
      {/* Asphalt surface */}
      <RigidBody type="fixed">
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -50]}>
          <planeGeometry args={[10, 200]} />
          <meshStandardMaterial color="#374151" roughness={0.9} metalness={0.0} />
        </mesh>
        <CuboidCollider args={[5, 0.1, 100]} position={[0, -0.1, -50]} />
      </RigidBody>

      {/* Left sidewalk */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-7, 0.05, -50]}>
        <planeGeometry args={[4, 200]} />
        <meshStandardMaterial color="#6b7280" roughness={1.0} />
      </mesh>
      {/* Right sidewalk */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[7, 0.05, -50]}>
        <planeGeometry args={[4, 200]} />
        <meshStandardMaterial color="#6b7280" roughness={1.0} />
      </mesh>

      {/* Center lane divider dashes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -i * 10 - 3]}>
          <planeGeometry args={[0.15, 3]} />
          <meshStandardMaterial color="#f9fafb" />
        </mesh>
      ))}
    </group>
  )
}

// ─── Buildings ───────────────────────────────────────────────────────────────
const BUILDING_COLORS = ['#1e3a5f', '#312e81', '#1a2b4a', '#1e40af', '#0f172a', '#134e4a']

function Buildings() {
  const buildings = [
    { x: -14, z: -10, h: 12, w: 6, d: 8, c: 0 },
    { x: -14, z: -25, h: 18, w: 5, d: 7, c: 1 },
    { x: -14, z: -40, h: 10, w: 7, d: 9, c: 2 },
    { x: -14, z: -56, h: 22, w: 6, d: 8, c: 3 },
    { x: -14, z: -72, h: 14, w: 5, d: 6, c: 4 },
    { x: 14, z: -10, h: 15, w: 6, d: 8, c: 5 },
    { x: 14, z: -26, h: 20, w: 5, d: 7, c: 0 },
    { x: 14, z: -42, h: 11, w: 7, d: 9, c: 1 },
    { x: 14, z: -58, h: 16, w: 6, d: 8, c: 2 },
    { x: 14, z: -74, h: 9, w: 5, d: 6, c: 3 },
  ]

  return (
    <>
      {buildings.map((b, i) => (
        <mesh key={i} castShadow position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color={BUILDING_COLORS[b.c]} roughness={0.7} metalness={0.2} />
        </mesh>
      ))}
    </>
  )
}

// ─── NPC Vehicle ─────────────────────────────────────────────────────────────
function NpcVehicle({ startZ, speed, color, violations }) {
  const bodyRef = useRef()
  const LANE_X = -2.5
  const RESET_Z = 5
  const { triggerViolation } = useGameStore()

  useFrame(() => {
    if (!bodyRef.current) return
    const pos = bodyRef.current.translation()
    if (pos.z > RESET_Z) {
      bodyRef.current.setTranslation({ x: LANE_X, y: 0.4, z: startZ }, true)
    }
    bodyRef.current.setLinvel({ x: 0, y: 0, z: speed }, true)
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicVelocity"
      position={[LANE_X, 0.4, startZ]}
      onCollisionEnter={() => {
        const rule = violations.find(v => v.id === 'collision')
        if (rule) triggerViolation(rule)
      }}
    >
      <CuboidCollider args={[0.9, 0.6, 2]} />
      {/* Car body */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 0.7, 4]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Cabin */}
      <mesh castShadow position={[0, 0.6, -0.2]}>
        <boxGeometry args={[1.5, 0.6, 2.4]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Headlights */}
      <mesh position={[0.6, 0, -1.9]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.6, 0, -1.9]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={1} />
      </mesh>
    </RigidBody>
  )
}

// ─── Player Vehicle ───────────────────────────────────────────────────────────
function PlayerVehicle({ violations, inputRef, vehicleMeshRef }) {
  const bodyRef = useRef()
  const { triggerViolation, setSpeed, pushSnapshot, tickTimer, status } = useGameStore()

  useFrame((_, delta) => {
    if (!bodyRef.current) return
    if (status === 'violation' || status === 'replay' || status === 'summary') return

    const { forward, turn } = inputRef.current
    const vel = bodyRef.current.linvel()
    const currentSpeed = Math.sqrt(vel.x ** 2 + vel.z ** 2)

    // Velocity-based control — not affected by mass or frame rate
    const MAX_SPEED = 14 // ~50 km/h
    if (forward !== 0) {
      const targetZ = -forward * MAX_SPEED
      bodyRef.current.setLinvel({ x: vel.x, y: vel.y, z: vel.z + (targetZ - vel.z) * 0.12 }, true)
    } else {
      bodyRef.current.setLinvel({ x: vel.x * 0.88, y: vel.y, z: vel.z * 0.88 }, true)
    }

    const angVel = bodyRef.current.angvel()
    if (turn !== 0 && currentSpeed > 0.5) {
      bodyRef.current.setAngvel({ x: 0, y: -turn * 1.5, z: 0 }, true)
    } else {
      bodyRef.current.setAngvel({ x: 0, y: angVel.y * 0.85, z: 0 }, true)
    }

    const kmh = currentSpeed * 3.6
    setSpeed(kmh)
    tickTimer(delta)

    // State-based violation check
    const hit = checkStateBasedViolations({ speed: kmh }, violations)
    if (hit) triggerViolation(hit)

    // Sync mesh for camera
    const pos = bodyRef.current.translation()
    const rot = bodyRef.current.rotation()
    if (vehicleMeshRef.current) {
      vehicleMeshRef.current.position.set(pos.x, pos.y, pos.z)
      vehicleMeshRef.current.quaternion.set(rot.x, rot.y, rot.z, rot.w)
    }

    pushSnapshot({
      t: performance.now(),
      position: [pos.x, pos.y, pos.z],
      rotation: [rot.x, rot.y, rot.z, rot.w],
      speed: kmh,
    })
  })

  return (
    <>
      <RigidBody
        ref={bodyRef}
        position={[2.5, 0.5, 0]}
        mass={50}
        linearDamping={0.2}
        angularDamping={0.5}
      >
        <CuboidCollider args={[0.9, 0.6, 2]} />
      </RigidBody>
      {/* Visual mesh separate from physics body for camera tracking */}
      <group ref={vehicleMeshRef} position={[2.5, 0.5, 0]}>
        {/* Car body */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.7, 4]} />
          <meshStandardMaterial color="#f97316" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Cabin */}
        <mesh castShadow position={[0, 0.65, -0.2]}>
          <boxGeometry args={[1.5, 0.6, 2.4]} />
          <meshStandardMaterial color="#f97316" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Wheels */}
        {[[-0.95, -0.25, 1.3], [0.95, -0.25, 1.3], [-0.95, -0.25, -1.3], [0.95, -0.25, -1.3]].map((pos, i) => (
          <mesh key={i} castShadow position={pos} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </>
  )
}

// ─── Sensors ─────────────────────────────────────────────────────────────────
function StopLineSensor({ position, violations }) {
  const { triggerViolation, status } = useGameStore()

  return (
    <RigidBody type="fixed" position={position} sensor>
      <CuboidCollider
        args={[4, 0.5, 0.2]}
        sensor
        onIntersectionEnter={() => {
          if (status !== 'playing') return
          if (trafficLightPhase.current === 'red') {
            const rule = violations.find(v => v.id === 'red-light')
            if (rule) triggerViolation(rule)
          }
        }}
      />
    </RigidBody>
  )
}

function LaneBoundarySensors({ violations }) {
  const { triggerViolation, status } = useGameStore()

  const onEnter = () => {
    if (status !== 'playing') return
    const rule = violations.find(v => v.id === 'wrong-lane')
    if (rule) triggerViolation(rule)
  }

  return (
    <>
      {/* Left boundary */}
      <RigidBody type="fixed" position={[-5, 0.5, -50]} sensor>
        <CuboidCollider args={[0.1, 1, 100]} sensor onIntersectionEnter={onEnter} />
      </RigidBody>
      {/* Center divider — prevents lane crossing */}
      <RigidBody type="fixed" position={[0, 0.5, -50]} sensor>
        <CuboidCollider args={[0.1, 1, 100]} sensor onIntersectionEnter={onEnter} />
      </RigidBody>
    </>
  )
}

// ─── Main Scene ───────────────────────────────────────────────────────────────
export default function CityDrivingScene({ violations, inputRef }) {
  const vehicleMeshRef = useRef()
  const xrOriginRef = useRef()

  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[50, 80, 30]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />

      <Road />
      <Buildings />
      <TrafficLight position={[5, 0, -30]} />

      <StopLineSensor position={[0, 0.1, -27]} violations={violations} />
      <LaneBoundarySensors violations={violations} />

      <NpcVehicle startZ={-60}  speed={7}  color="#3b82f6" violations={violations} />
      <NpcVehicle startZ={-90}  speed={9}  color="#10b981" violations={violations} />
      <NpcVehicle startZ={-120} speed={6}  color="#8b5cf6" violations={violations} />

      <PlayerVehicle
        violations={violations}
        inputRef={inputRef}
        vehicleMeshRef={vehicleMeshRef}
      />

      <XROrigin ref={xrOriginRef} />
      <FollowCamera targetRef={vehicleMeshRef} xrOriginRef={xrOriginRef} />
      <PostProcessing />
    </>
  )
}
