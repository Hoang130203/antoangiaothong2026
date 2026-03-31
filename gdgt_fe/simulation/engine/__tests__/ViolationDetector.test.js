import { describe, it, expect } from 'vitest'
import { checkStateBasedViolations } from '../ViolationDetector'
import { violations } from '../../scenarios/city-driving/config'

describe('checkStateBasedViolations', () => {
  it('returns speeding rule when speed > 60', () => {
    const result = checkStateBasedViolations({ speed: 70 }, violations)
    expect(result?.id).toBe('speeding')
  })

  it('returns null when speed is within limit', () => {
    const result = checkStateBasedViolations({ speed: 50 }, violations)
    expect(result).toBeNull()
  })

  it('returns null for event-based rules even if state matches', () => {
    const result = checkStateBasedViolations({ speed: 0, lightColor: 'red' }, violations)
    expect(result).toBeNull()
  })

  it('returns first matching rule', () => {
    const rules = [
      { id: 'a', detect: () => false },
      { id: 'b', detect: (s) => s.speed > 60 },
      { id: 'c', detect: (s) => s.speed > 50 },
    ]
    const result = checkStateBasedViolations({ speed: 65 }, rules)
    expect(result.id).toBe('b')
  })

  it('returns null for empty rules array', () => {
    expect(checkStateBasedViolations({ speed: 100 }, [])).toBeNull()
  })
})
