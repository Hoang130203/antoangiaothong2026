'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import * as THREE from 'three'

const _targetPos = new THREE.Vector3()
const _cameraPos = new THREE.Vector3()
const OFFSET = new THREE.Vector3(0, 4, 9)
// In XR the origin sits behind/above the vehicle — user looks forward naturally
const XR_OFFSET = new THREE.Vector3(0, 1.5, 5)

/**
 * Smooth third-person follow camera.
 * Non-XR: lerps the R3F camera directly.
 * XR: lerps the XROrigin group so the headset follows the vehicle.
 */
export function FollowCamera({ targetRef, xrOriginRef }) {
  const { camera } = useThree()
  const { isPresenting } = useXR()
  const lookAt = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    if (!targetRef.current) return
    targetRef.current.getWorldPosition(_targetPos)

    const alpha = 1 - Math.exp(-5 * delta)

    if (isPresenting && xrOriginRef?.current) {
      // XR mode: move the XROrigin — headset position is relative to it
      _cameraPos.copy(_targetPos).add(XR_OFFSET)
      xrOriginRef.current.position.lerp(_cameraPos, alpha)
    } else {
      // Non-XR: move camera directly
      _cameraPos.copy(_targetPos).add(OFFSET)
      camera.position.lerp(_cameraPos, alpha)
      lookAt.current.copy(_targetPos).add(new THREE.Vector3(0, 1, 0))
      camera.lookAt(lookAt.current)
    }
  })

  return null
}
