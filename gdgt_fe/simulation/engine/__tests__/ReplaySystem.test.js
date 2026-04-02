import { describe, it, expect } from 'vitest'
import { createReplayBuffer } from '../ReplaySystem'

describe('createReplayBuffer', () => {
  it('stores items up to capacity', () => {
    const buf = createReplayBuffer(5)
    for (let i = 0; i < 5; i++) buf.push({ t: i })
    expect(buf.getAll()).toHaveLength(5)
  })

  it('evicts oldest item when over capacity', () => {
    const buf = createReplayBuffer(3)
    buf.push({ t: 0 })
    buf.push({ t: 1 })
    buf.push({ t: 2 })
    buf.push({ t: 3 })
    const all = buf.getAll()
    expect(all).toHaveLength(3)
    expect(all[0].t).toBe(1)
    expect(all[2].t).toBe(3)
  })

  it('getLastN returns correct tail slice', () => {
    const buf = createReplayBuffer(10)
    for (let i = 0; i < 8; i++) buf.push({ t: i })
    const last3 = buf.getLastN(3)
    expect(last3).toHaveLength(3)
    expect(last3[0].t).toBe(5)
    expect(last3[2].t).toBe(7)
  })

  it('getLastN with n > length returns all items', () => {
    const buf = createReplayBuffer(10)
    buf.push({ t: 1 })
    expect(buf.getLastN(5)).toHaveLength(1)
  })

  it('freeze prevents new pushes', () => {
    const buf = createReplayBuffer(5)
    buf.push({ t: 1 })
    buf.freeze()
    buf.push({ t: 2 })
    expect(buf.getAll()).toHaveLength(1)
  })

  it('isFrozen reflects freeze/thaw state', () => {
    const buf = createReplayBuffer(5)
    expect(buf.isFrozen()).toBe(false)
    buf.freeze()
    expect(buf.isFrozen()).toBe(true)
    buf.thaw()
    expect(buf.isFrozen()).toBe(false)
  })

  it('thaw clears buffer and allows new pushes', () => {
    const buf = createReplayBuffer(5)
    buf.push({ t: 1 })
    buf.freeze()
    buf.thaw()
    buf.push({ t: 2 })
    expect(buf.getAll()).toHaveLength(1)
    expect(buf.getAll()[0].t).toBe(2)
  })
})
