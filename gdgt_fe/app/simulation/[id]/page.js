'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getScenarioById } from '@/simulation/registry'
import { SimulationCanvas } from '@/simulation/engine/SimulationCanvas'

export default function SimulationRunnerPage() {
  const { id } = useParams()
  const router = useRouter()
  const [scenario, setScenario] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const found = getScenarioById(id)
    if (!found) {
      setNotFound(true)
      router.replace('/simulation')
    } else {
      setScenario(found)
    }
  }, [id, router])

  if (notFound) return null

  if (!scenario) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: '#1a2b4a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', flexDirection: 'column', gap: '12px',
      }}>
        <div style={{ fontSize: '48px' }}>🚗</div>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Đang tải kịch bản...</p>
      </div>
    )
  }

  return <SimulationCanvas scenario={scenario} />
}
