import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    alias: {
      '@react-three/fiber': path.resolve('./simulation/__mocks__/@react-three/fiber.js'),
      '@react-three/drei': path.resolve('./simulation/__mocks__/@react-three/drei.js'),
      '@react-three/rapier': path.resolve('./simulation/__mocks__/@react-three/rapier.js'),
      '@react-three/postprocessing': path.resolve('./simulation/__mocks__/@react-three/postprocessing.js'),
      'three': path.resolve('./simulation/__mocks__/three.js'),
    },
  },
})
