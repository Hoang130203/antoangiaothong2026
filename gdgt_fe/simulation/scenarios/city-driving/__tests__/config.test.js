import { describe, it, expect } from 'vitest'
import { metadata, violations } from '../config'

describe('city-driving config', () => {
  it('metadata has all required fields', () => {
    expect(metadata.id).toBe('city-driving')
    expect(metadata.title).toBeTruthy()
    expect(metadata.difficulty).toMatch(/^(easy|medium|hard)$/)
    expect(typeof metadata.durationSeconds).toBe('number')
  })

  it('has exactly 4 violation rules', () => {
    expect(violations).toHaveLength(4)
  })

  it('speeding detect fires when speed > 60', () => {
    const rule = violations.find((v) => v.id === 'speeding')
    expect(rule.detect({ speed: 61 })).toBe(true)
    expect(rule.detect({ speed: 60 })).toBe(false)
    expect(rule.detect({ speed: 30 })).toBe(false)
  })

  it('event-based rules (red-light, wrong-lane, collision) have no detect fn', () => {
    ['red-light', 'wrong-lane', 'collision'].forEach((id) => {
      const rule = violations.find((v) => v.id === id)
      expect(rule, `rule ${id} not found`).toBeTruthy()
      expect(rule.detect).toBeUndefined()
    })
  })

  it('all rules have label, penalty, lesson, lawReference', () => {
    violations.forEach((v) => {
      expect(v.label).toBeTruthy()
      expect(typeof v.penalty).toBe('number')
      expect(v.penalty).toBeGreaterThan(0)
      expect(v.lesson).toBeTruthy()
      expect(v.lawReference).toBeTruthy()
    })
  })
})
