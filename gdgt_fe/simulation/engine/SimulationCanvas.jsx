'use client'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Suspense, useMemo } from 'react'
import { PhysicsWorld } from './PhysicsWorld'
import { HUD } from './HUD'
import { useVehicleInput } from './useVehicleInput'
import { VirtualJoystick } from './VirtualJoystick'

/**
 * Top-level simulation wrapper.
 * Renders R3F Canvas (XR + Physics) and HTML overlays (HUD, VirtualJoystick).
 * VirtualJoystick is intentionally outside the Canvas — HTML cannot render inside R3F Canvas.
 *
 * Props:
 *   scenario — { component: React.Component, violations: ViolationRule[], durationSeconds: number }
 */
export function SimulationCanvas({ scenario }) {
  const xrStore = useMemo(() => createXRStore({ hand: false, controller: false }), [])
  const inputRef = useVehicleInput()
  const SceneComponent = scenario.component

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000' }}>
      <Canvas
        shadows
        camera={{ position: [0, 4, 10], fov: 60 }}
        gl={{ antialias: false }}
      >
        <XR store={xrStore}>
          <PhysicsWorld>
            <Suspense fallback={null}>
              <SceneComponent violations={scenario.violations} inputRef={inputRef} />
            </Suspense>
          </PhysicsWorld>
        </XR>
      </Canvas>

      {/* HTML overlays — must be outside Canvas */}
      <HUD durationSeconds={scenario.durationSeconds} xrStore={xrStore} />
      <VirtualJoystick inputRef={inputRef} />
    </div>
  )
}
