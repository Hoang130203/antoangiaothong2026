'use client'
import { useEffect } from 'react'
import { useGameStore } from './useGameStore'

function pad(n) {
  return String(Math.floor(n)).padStart(2, '0')
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${pad(m)}:${pad(s)}`
}

/**
 * HTML overlay on top of the R3F Canvas.
 * Timer, score, speedometer, violation toast, replay lesson, summary screen.
 */
export function HUD({ durationSeconds, xrStore }) {
  const { status, score, timeLeft, speed, currentViolation, violations } = useGameStore()

  // Auto-start game when HUD mounts
  useEffect(() => {
    if (status === 'idle') {
      useGameStore.getState().startGame(durationSeconds)
    }
  }, [durationSeconds, status])

  // VIOLATION → REPLAY after 0.5s
  useEffect(() => {
    if (status !== 'violation') return
    const t = setTimeout(() => useGameStore.getState().startReplay(), 500)
    return () => clearTimeout(t)
  }, [status])

  // REPLAY → PLAYING after 4s (show lesson, then resume)
  useEffect(() => {
    if (status !== 'replay') return
    const t = setTimeout(() => useGameStore.getState().endReplay(), 4000)
    return () => clearTimeout(t)
  }, [status])

  const supportsXR = typeof navigator !== 'undefined' && 'xr' in navigator

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
        color: 'white', fontFamily: 'monospace', fontSize: '14px',
      }}>
        <span>⏱ {formatTime(Math.max(0, timeLeft))}</span>
        <span style={{ color: '#f97316', fontWeight: 'bold' }}>AN TOÀN GIAO THÔNG</span>
        <span>⭐ {score} điểm</span>
      </div>

      {/* Speedometer — bottom right */}
      <div style={{
        position: 'absolute', bottom: '20px', right: '20px',
        background: 'rgba(0,0,0,0.6)', color: 'white',
        padding: '10px 16px', borderRadius: '10px', textAlign: 'center',
        fontFamily: 'monospace',
      }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: speed > 60 ? '#dc2626' : 'white' }}>
          {Math.round(speed)}
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>km/h</div>
      </div>

      {/* VR button — bottom left */}
      {supportsXR && xrStore && (
        <button
          onClick={() => xrStore.enterVR()}
          style={{
            position: 'absolute', bottom: '20px', left: '20px',
            background: 'rgba(99,102,241,0.85)', color: 'white',
            border: 'none', borderRadius: '8px', padding: '10px 18px',
            fontSize: '13px', cursor: 'pointer', pointerEvents: 'auto',
          }}
        >
          🥽 Enter VR
        </button>
      )}

      {/* Violation toast — center top */}
      {(status === 'violation' || status === 'replay') && currentViolation && (
        <div style={{
          position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)',
          background: '#dc2626', color: 'white',
          padding: '10px 24px', borderRadius: '24px',
          fontWeight: 'bold', fontSize: '15px', whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(220,38,38,0.5)',
        }}>
          ⚠️ {currentViolation.label} — -{currentViolation.penalty} điểm
        </div>
      )}

      {/* Replay lesson overlay — bottom center */}
      {status === 'replay' && currentViolation && (
        <div style={{
          position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.75)', color: 'white',
          padding: '16px 24px', borderRadius: '12px', maxWidth: '380px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
            {currentViolation.lawReference}
          </div>
          <div style={{ fontSize: '14px' }}>{currentViolation.lesson}</div>
        </div>
      )}

      {/* Summary screen */}
      {status === 'summary' && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'auto',
          background: 'rgba(26,43,74,0.95)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white', gap: '12px',
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>Kết quả của bạn</div>
          <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#f97316' }}>{score}</div>
          <div style={{ fontSize: '13px', color: '#f59e0b' }}>điểm</div>

          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '10px',
            padding: '14px 24px', maxWidth: '340px', width: '100%',
          }}>
            {violations.length === 0 ? (
              <p style={{ color: '#4ade80', textAlign: 'center', margin: 0 }}>✅ Không có vi phạm!</p>
            ) : (
              <>
                <div style={{ fontSize: '12px', color: '#fca5a5', marginBottom: '8px' }}>
                  ⚠️ Vi phạm đã ghi nhận:
                </div>
                {violations.map((v, i) => (
                  <div key={i} style={{ fontSize: '13px', marginBottom: '4px' }}>
                    • {v.label} — {v.lawReference}
                  </div>
                ))}
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={() => useGameStore.getState().resetGame()}
              style={{
                background: '#f97316', color: 'white', border: 'none',
                padding: '12px 28px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
              }}
            >
              Chơi lại
            </button>
            <a
              href="/simulation"
              style={{
                background: 'rgba(255,255,255,0.15)', color: 'white',
                padding: '12px 28px', borderRadius: '8px', fontSize: '14px',
                textDecoration: 'none', display: 'inline-block',
              }}
            >
              Về trang chủ
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
