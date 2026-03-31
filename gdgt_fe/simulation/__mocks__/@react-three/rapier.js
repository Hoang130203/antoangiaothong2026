// Mock for '@react-three/rapier' — prevents physics engine crash in test environment
import React from 'react'
const noop = () => null
export const RigidBody = ({ children }) => React.createElement('div', null, children)
export const CuboidCollider = noop
export const BallCollider = noop
export const Physics = ({ children }) => React.createElement('div', null, children)
export const useRapier = () => ({})
