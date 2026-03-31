'use client'
import { useEffect, useRef } from 'react'

/**
 * Returns a ref with normalized { forward: number, turn: number } in range [-1, 1].
 * Reads from keyboard on desktop; updated by VirtualJoystick on mobile.
 */
export function useVehicleInput() {
  const input = useRef({ forward: 0, turn: 0 })

  useEffect(() => {
    const keys = {}
    const onKeyDown = (e) => { keys[e.code] = true }
    const onKeyUp = (e) => { keys[e.code] = false }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    let raf
    const tick = () => {
      const fwd = (keys['ArrowUp'] || keys['KeyW']) ? 1 : (keys['ArrowDown'] || keys['KeyS']) ? -1 : 0
      const trn = (keys['ArrowRight'] || keys['KeyD']) ? 1 : (keys['ArrowLeft'] || keys['KeyA']) ? -1 : 0
      input.current.forward = fwd
      input.current.turn = trn
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return input
}
