import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../useGameStore'

const reset = () => useGameStore.getState().resetGame()

describe('useGameStore', () => {
  beforeEach(reset)

  it('starts in idle state with score 100', () => {
    const s = useGameStore.getState()
    expect(s.status).toBe('idle')
    expect(s.score).toBe(100)
  })

  it('idle → playing on startGame()', () => {
    useGameStore.getState().startGame(180)
    const s = useGameStore.getState()
    expect(s.status).toBe('playing')
    expect(s.timeLeft).toBe(180)
  })

  it('playing → violation on triggerViolation(), deducts penalty', () => {
    useGameStore.getState().startGame(180)
    const rule = { id: 'red-light', label: 'Vượt đèn đỏ', penalty: 20, lesson: 'x', lawReference: 'Điều 9' }
    useGameStore.getState().triggerViolation(rule)
    const s = useGameStore.getState()
    expect(s.status).toBe('violation')
    expect(s.score).toBe(80)
    expect(s.currentViolation.id).toBe('red-light')
    expect(s.violations).toHaveLength(1)
  })

  it('violation → replay on startReplay()', () => {
    useGameStore.getState().startGame(180)
    const rule = { id: 'red-light', label: 'x', penalty: 20, lesson: 'x', lawReference: 'x' }
    useGameStore.getState().triggerViolation(rule)
    useGameStore.getState().startReplay()
    expect(useGameStore.getState().status).toBe('replay')
  })

  it('replay → playing on endReplay(), clears currentViolation', () => {
    useGameStore.getState().startGame(180)
    const rule = { id: 'red-light', label: 'x', penalty: 20, lesson: 'x', lawReference: 'x' }
    useGameStore.getState().triggerViolation(rule)
    useGameStore.getState().startReplay()
    useGameStore.getState().endReplay()
    const s = useGameStore.getState()
    expect(s.status).toBe('playing')
    expect(s.currentViolation).toBeNull()
  })

  it('playing → summary on endGame()', () => {
    useGameStore.getState().startGame(180)
    useGameStore.getState().endGame()
    expect(useGameStore.getState().status).toBe('summary')
  })

  it('resetGame returns to idle with score 100', () => {
    useGameStore.getState().startGame(180)
    useGameStore.getState().endGame()
    useGameStore.getState().resetGame()
    const s = useGameStore.getState()
    expect(s.status).toBe('idle')
    expect(s.score).toBe(100)
  })

  it('debounces same violation within 2 seconds', () => {
    useGameStore.getState().startGame(180)
    const rule = { id: 'speeding', label: 'x', penalty: 15, lesson: 'x', lawReference: 'x' }
    useGameStore.getState().triggerViolation(rule)
    useGameStore.getState().startReplay()
    useGameStore.getState().endReplay()
    useGameStore.getState().triggerViolation(rule)
    expect(useGameStore.getState().score).toBe(85)
  })

  it('clamps score to 0 minimum', () => {
    useGameStore.getState().startGame(180)
    const rule = { id: 'collision', label: 'x', penalty: 200, lesson: 'x', lawReference: 'x' }
    useGameStore.getState().triggerViolation(rule)
    expect(useGameStore.getState().score).toBe(0)
  })
})
