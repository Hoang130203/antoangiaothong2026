'use client'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing'

const FPS_SAMPLE_INTERVAL = 2
const FPS_THRESHOLD = 30

/**
 * Bloom + SMAA post-processing.
 * Auto-disables if FPS drops below 30.
 */
export function PostProcessing() {
  const [enabled, setEnabled] = useState(true)
  const frames = useRef(0)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    frames.current++
    elapsed.current += delta
    if (elapsed.current >= FPS_SAMPLE_INTERVAL) {
      const fps = frames.current / elapsed.current
      if (fps < FPS_THRESHOLD && enabled) setEnabled(false)
      frames.current = 0
      elapsed.current = 0
    }
  })

  if (!enabled) return null

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.25} luminanceThreshold={0.8} luminanceSmoothing={0.9} />
      <SMAA />
    </EffectComposer>
  )
}
