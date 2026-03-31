'use client'
import { Physics } from '@react-three/rapier'

/**
 * Wraps children in a Rapier physics world.
 * gravity: -9.81 on Y axis (standard driving sim).
 * timeStep 'vary' adapts to frame rate.
 */
export function PhysicsWorld({ children }) {
  return (
    <Physics gravity={[0, -9.81, 0]} timeStep="vary">
      {children}
    </Physics>
  )
}
