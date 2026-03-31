import dynamic from 'next/dynamic'
import { metadata, violations } from './scenarios/city-driving/config.js'

// Use next/dynamic with ssr: false so R3F (Three.js) never runs on the server
const CityDrivingScene = dynamic(
  () => import('./scenarios/city-driving/index.jsx'),
  { ssr: false }
)

const scenarios = [
  { ...metadata, component: CityDrivingScene, violations },
]

export const getAllScenarios = () => scenarios

export const getScenarioById = (id) => scenarios.find((s) => s.id === id) ?? null
