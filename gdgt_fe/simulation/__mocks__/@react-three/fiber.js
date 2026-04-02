// Mock for '@react-three/fiber' — prevents WebGL reconciler crash in test environment
import React from 'react'
export const Canvas = ({ children }) => React.createElement('div', null, children)
export const useFrame = () => {}
export const useThree = () => ({ camera: {}, gl: {}, scene: {}, size: { width: 0, height: 0 } })
export const useLoader = () => null
export const extend = () => {}
export const createPortal = () => null
export default { Canvas, useFrame, useThree, useLoader, extend }
