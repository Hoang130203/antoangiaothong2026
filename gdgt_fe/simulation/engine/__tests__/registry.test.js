import { describe, it, expect } from 'vitest'
import { getAllScenarios, getScenarioById } from '../../registry'

describe('scenario registry', () => {
  it('getAllScenarios returns an array', () => {
    expect(Array.isArray(getAllScenarios())).toBe(true)
  })

  it('getScenarioById returns null for unknown id', () => {
    expect(getScenarioById('nonexistent')).toBeNull()
  })

  it('every registered scenario has required fields', () => {
    const required = ['id', 'title', 'description', 'difficulty', 'thumbnail', 'durationSeconds', 'component', 'violations']
    getAllScenarios().forEach((s) => {
      required.forEach((field) => {
        expect(s, `scenario "${s.id}" missing field "${field}"`).toHaveProperty(field)
      })
    })
  })

  it('no duplicate scenario ids', () => {
    const ids = getAllScenarios().map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
