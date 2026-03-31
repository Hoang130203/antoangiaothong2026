/**
 * Fixed-capacity circular buffer for storing per-frame snapshots.
 * Snapshot shape: { t, position: [x,y,z], rotation: [x,y,z,w], speed, lightColor }
 */
export function createReplayBuffer(capacity = 300) {
  let items = []
  let frozen = false

  return {
    push(snapshot) {
      if (frozen) return
      items.push(snapshot)
      if (items.length > capacity) {
        items = items.slice(items.length - capacity)
      }
    },
    getAll() { return [...items] },
    getLastN(n) { return items.slice(Math.max(0, items.length - n)) },
    freeze() { frozen = true },
    thaw() { frozen = false; items = [] },
    isFrozen() { return frozen },
    clear() { items = []; frozen = false },
  }
}
