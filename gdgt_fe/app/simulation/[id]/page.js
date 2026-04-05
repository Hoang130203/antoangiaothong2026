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

  if (scenario.type === 'video') {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', display: 'flex', zIndex: 10 }}>
          <button onClick={() => router.push('/simulation')} style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            ← Quay lại
          </button>
        </div>
        <div style={{ flex: 1, marginTop: '-50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <iframe style={{ border: 'none', width: '100%', maxWidth: '1200px', height: '80vh' }} src={scenario.videoUrl} allow="autoplay" allowFullScreen></iframe>
        </div>
      </div>
    )
  }

  return <SimulationCanvas scenario={scenario} />
}
