// Mock for '@react-three/drei' — prevents WebGL errors in test environment
import React from 'react'
const noop = () => null
export const Sky = noop
export const Environment = noop
export const OrbitControls = noop
export const Html = noop
export const Text = noop
export const useGLTF = () => ({ scene: null, nodes: {}, materials: {} })
export const useTexture = () => null
export const PerspectiveCamera = noop
export const EffectComposer = ({ children }) => React.createElement('div', null, children)
export const Bloom = noop
export const SSAO = noop
