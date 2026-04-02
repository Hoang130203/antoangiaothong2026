'use client'
import { useEffect, useRef } from 'react'

/**
 * Renders a nipplejs joystick in the bottom-left corner.
 * Writes { forward, turn } into the provided inputRef.
 * Only mounts on touch devices.
 */
export function VirtualJoystick({ inputRef }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isMobile) return

    let manager
    // @ts-ignore
    import('nipplejs').then(({ default: nipplejs }) => {
      manager = nipplejs.create({
        zone: containerRef.current,
        mode: 'static',
        position: { left: '80px', bottom: '80px' },
        color: 'rgba(255,255,255,0.6)',
        size: 100,
      })

      manager.on('move', (_evt, data) => {
        if (!data || !data.angle) return
        const angle = data.angle.radian
        const force = Math.min(data.force, 1)
        inputRef.current.forward = force * Math.sin(angle)
        inputRef.current.turn = force * Math.cos(angle)
      })

      manager.on('end', () => {
        inputRef.current.forward = 0
        inputRef.current.turn = 0
      })
    })

    return () => manager?.destroy()
  }, [inputRef])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '200px',
        height: '200px',
        zIndex: 20,
      }}
    />
  )
}
