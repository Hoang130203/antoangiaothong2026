// Mock for '@react-three/postprocessing' — prevents WebGL errors in test environment
import React from 'react'
const noop = () => null
export const EffectComposer = ({ children }) => React.createElement('div', null, children)
export const Bloom = noop
export const SMAA = noop
export const Vignette = noop
export const ChromaticAberration = noop
