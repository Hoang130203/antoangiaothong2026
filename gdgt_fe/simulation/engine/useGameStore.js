import { create } from 'zustand'

const VIOLATION_DEBOUNCE_MS = 2000

export const useGameStore = create((set, get) => ({
  status: 'idle',
  score: 100,
  timeLeft: 180,
  speed: 0,
  violations: [],
  replayBuffer: [],
  currentViolation: null,
  _lastViolationTime: {},

  startGame: (durationSeconds) => set({
    status: 'playing',
    score: 100,
    timeLeft: durationSeconds,
    violations: [],
    replayBuffer: [],
    currentViolation: null,
    _lastViolationTime: {},
  }),

  triggerViolation: (rule) => {
    const { status, _lastViolationTime } = get()
    if (status !== 'playing') return
    const now = Date.now()
    if (_lastViolationTime[rule.id] && now - _lastViolationTime[rule.id] < VIOLATION_DEBOUNCE_MS) return
    set((s) => ({
      status: 'violation',
      score: Math.max(0, s.score - rule.penalty),
      violations: [...s.violations, { ...rule, timestamp: now }],
      currentViolation: rule,
      _lastViolationTime: { ...s._lastViolationTime, [rule.id]: now },
    }))
  },

  startReplay: () => set({ status: 'replay' }),
  endReplay: () => set({ status: 'playing', currentViolation: null }),
  setSpeed: (speed) => set({ speed }),

  tickTimer: (delta) => {
    const { status, timeLeft } = get()
    if (status !== 'playing') return
    const next = timeLeft - delta
    if (next <= 0) {
      set({ timeLeft: 0, status: 'summary' })
    } else {
      set({ timeLeft: next })
    }
  },

  pushSnapshot: (snapshot) => set((s) => {
    const buf = [...s.replayBuffer, snapshot]
    return { replayBuffer: buf.length > 300 ? buf.slice(buf.length - 300) : buf }
  }),

  endGame: () => set({ status: 'summary' }),

  resetGame: () => set({
    status: 'idle',
    score: 100,
    timeLeft: 180,
    speed: 0,
    violations: [],
    replayBuffer: [],
    currentViolation: null,
    _lastViolationTime: {},
  }),
}))
