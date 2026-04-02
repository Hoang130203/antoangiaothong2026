# Traffic Simulation Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modular 3D traffic simulation page at `/simulation` using React Three Fiber with physics, PBR graphics (Kenney CC0 assets), violation detection, slow-motion replay, and WebXR VR support — all frontend-only, no backend.

**Architecture:** Scenario Registry pattern — a core engine handles physics/rendering/replay while each scenario is a self-contained module registered into a central list. Adding a new scenario requires only creating one folder and one registry entry.

**Tech Stack:** Next.js 14, React Three Fiber, @react-three/rapier (physics), @react-three/drei (helpers), @react-three/xr (VR), nipplejs (joystick), zustand (game state), Vitest (tests), Kenney CC0 assets (GLB models).

---

## File Map

```
gdgt_fe/
├── vitest.config.js                              NEW
├── package.json                                  MODIFY (add deps + test script)
│
├── app/simulation/
│   ├── page.js                                   NEW (Hub — Server Component)
│   └── [id]/page.js                              NEW (Runner — Client Component)
│
└── simulation/
    ├── registry.js                               NEW
    ├── engine/
    │   ├── useGameStore.js                       NEW (Zustand state machine)
    │   ├── ViolationDetector.js                  NEW (pure logic + React hook)
    │   ├── ReplaySystem.js                       NEW (circular buffer + hook)
    │   ├── useVehicleInput.js                    NEW (keyboard + joystick hook)
    │   ├── VirtualJoystick.jsx                   NEW (nipplejs component)
    │   ├── SimulationCanvas.jsx                  NEW (R3F Canvas + XR + Physics)
    │   ├── FollowCamera.jsx                      NEW (third-person camera)
    │   ├── HUD.jsx                               NEW (HTML overlay)
    │   └── __tests__/
    │       ├── useGameStore.test.js               NEW
    │       ├── ViolationDetector.test.js          NEW
    │       └── ReplaySystem.test.js               NEW
    └── scenarios/
        └── city-driving/
            ├── config.js                         NEW (metadata + violation rules)
            ├── index.jsx                         NEW (R3F scene)
            └── __tests__/
                └── config.test.js                NEW

gdgt_fe/public/assets/simulation/               NEW (Kenney GLB files)
```

---

## Task 1: Install packages and set up Vitest

**Files:**
- Modify: `gdgt_fe/package.json`
- Create: `gdgt_fe/vitest.config.js`

- [ ] **Step 1: Install runtime dependencies**

```bash
cd gdgt_fe
npm install @react-three/fiber @react-three/drei @react-three/rapier @react-three/xr nipplejs zustand
```

Expected: packages added to `node_modules`, no peer-dep errors.

- [ ] **Step 2: Install test dependencies**

```bash
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react
```

- [ ] **Step 3: Create vitest config**

Create `gdgt_fe/vitest.config.js`:

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 4: Add test script to package.json**

In `gdgt_fe/package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify test runner works**

```bash
npx vitest run --reporter=verbose
```

Expected: "No test files found" (0 tests, no errors).

- [ ] **Step 6: Commit**

```bash
git add gdgt_fe/package.json gdgt_fe/package-lock.json gdgt_fe/vitest.config.js
git commit -m "chore: add R3F/physics/XR packages and Vitest setup"
```

---

## Task 2: useGameStore — Zustand state machine

**Files:**
- Create: `gdgt_fe/simulation/engine/__tests__/useGameStore.test.js`
- Create: `gdgt_fe/simulation/engine/useGameStore.js`

- [ ] **Step 1: Create test file**

Create `gdgt_fe/simulation/engine/__tests__/useGameStore.test.js`:

```js
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
    // same rule fired immediately again — should be debounced
    useGameStore.getState().triggerViolation(rule)
    expect(useGameStore.getState().score).toBe(85) // only deducted once
  })

  it('clamps score to 0 minimum', () => {
    useGameStore.getState().startGame(180)
    const rule = { id: 'collision', label: 'x', penalty: 200, lesson: 'x', lawReference: 'x' }
    useGameStore.getState().triggerViolation(rule)
    expect(useGameStore.getState().score).toBe(0)
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd gdgt_fe && npx vitest run simulation/engine/__tests__/useGameStore.test.js --reporter=verbose
```

Expected: `Error: Cannot find module '../useGameStore'`

- [ ] **Step 3: Implement useGameStore.js**

Create `gdgt_fe/simulation/engine/useGameStore.js`:

```js
import { create } from 'zustand'

const VIOLATION_DEBOUNCE_MS = 2000

export const useGameStore = create((set, get) => ({
  status: 'idle',       // 'idle' | 'playing' | 'violation' | 'replay' | 'summary'
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run simulation/engine/__tests__/useGameStore.test.js --reporter=verbose
```

Expected: all 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add gdgt_fe/simulation/engine/useGameStore.js gdgt_fe/simulation/engine/__tests__/useGameStore.test.js
git commit -m "feat(sim): add Zustand game state machine with violation/replay states"
```

---

## Task 3: Scenario registry

**Files:**
- Create: `gdgt_fe/simulation/engine/__tests__/registry.test.js`
- Create: `gdgt_fe/simulation/registry.js`

- [ ] **Step 1: Write failing test**

Create `gdgt_fe/simulation/engine/__tests__/registry.test.js`:

```js
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
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run simulation/engine/__tests__/registry.test.js --reporter=verbose
```

Expected: `Error: Cannot find module '../../registry'`

- [ ] **Step 3: Implement registry.js**

Create `gdgt_fe/simulation/registry.js`:

```js
// Register new scenarios by importing config+component and adding to this array.
// The engine discovers them automatically — no other file needs to change.
//
// Example (uncomment when city-driving is built in Task 7):
// import CityDrivingScene from './scenarios/city-driving/index.jsx'
// import { metadata, violations } from './scenarios/city-driving/config.js'
// { ...metadata, component: CityDrivingScene, violations }

const scenarios = []

export const getAllScenarios = () => scenarios

export const getScenarioById = (id) => scenarios.find((s) => s.id === id) ?? null
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run simulation/engine/__tests__/registry.test.js --reporter=verbose
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add gdgt_fe/simulation/registry.js gdgt_fe/simulation/engine/__tests__/registry.test.js
git commit -m "feat(sim): add scenario registry with validation"
```

---

## Task 4: city-driving config — violation rules

**Files:**
- Create: `gdgt_fe/simulation/scenarios/city-driving/__tests__/config.test.js`
- Create: `gdgt_fe/simulation/scenarios/city-driving/config.js`

- [ ] **Step 1: Write failing test**

Create `gdgt_fe/simulation/scenarios/city-driving/__tests__/config.test.js`:

```js
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
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run simulation/scenarios/city-driving/__tests__/config.test.js --reporter=verbose
```

Expected: `Error: Cannot find module '../config'`

- [ ] **Step 3: Implement config.js**

Create `gdgt_fe/simulation/scenarios/city-driving/config.js`:

```js
export const metadata = {
  id: 'city-driving',
  title: 'Lái xe thành phố',
  description: 'Điều hướng qua đường phố đông đúc, tuân thủ đèn tín hiệu và giới hạn tốc độ.',
  difficulty: 'medium',
  thumbnail: '/assets/simulation/city-driving-thumb.jpg',
  durationSeconds: 180,
}

export const violations = [
  {
    id: 'red-light',
    label: 'Vượt đèn đỏ',
    penalty: 20,
    lesson: 'Vượt đèn đỏ vi phạm Luật GTĐB, gây nguy hiểm cho bản thân và người tham gia giao thông khác.',
    lawReference: 'Điều 9, Luật Giao thông Đường bộ 2008',
    // Event-based: StopLineSensor fires onIntersectionEnter when light is red
  },
  {
    id: 'speeding',
    label: 'Chạy quá tốc độ',
    penalty: 15,
    lesson: 'Tốc độ tối đa trong khu vực đông dân cư là 60 km/h. Chạy nhanh rút ngắn thời gian phản ứng.',
    lawReference: 'Điều 12, Luật Giao thông Đường bộ 2008',
    detect: (state) => state.speed > 60,
  },
  {
    id: 'wrong-lane',
    label: 'Lấn làn đường',
    penalty: 10,
    lesson: 'Đi đúng làn giúp tránh va chạm với phương tiện ngược chiều.',
    lawReference: 'Điều 13, Luật Giao thông Đường bộ 2008',
    // Event-based: LaneBoundarySensor fires onIntersectionEnter
  },
  {
    id: 'collision',
    label: 'Va chạm xe khác',
    penalty: 25,
    lesson: 'Giữ khoảng cách an toàn. Luôn quan sát gương chiếu hậu trước khi chuyển làn.',
    lawReference: 'Điều 9, Luật Giao thông Đường bộ 2008',
    // Event-based: NPCSensor fires onCollisionEnter
  },
]
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run simulation/scenarios/city-driving/__tests__/config.test.js --reporter=verbose
```

Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add gdgt_fe/simulation/scenarios/city-driving/config.js gdgt_fe/simulation/scenarios/city-driving/__tests__/config.test.js
git commit -m "feat(sim): add city-driving scenario config and violation rules"
```

---

## Task 5: ViolationDetector — state-based polling logic

**Files:**
- Create: `gdgt_fe/simulation/engine/__tests__/ViolationDetector.test.js`
- Create: `gdgt_fe/simulation/engine/ViolationDetector.js`

- [ ] **Step 1: Write failing test**

Create `gdgt_fe/simulation/engine/__tests__/ViolationDetector.test.js`:

```js
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
    // red-light has no detect fn — should never be returned here
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
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run simulation/engine/__tests__/ViolationDetector.test.js --reporter=verbose
```

Expected: `Error: Cannot find module '../ViolationDetector'`

- [ ] **Step 3: Implement ViolationDetector.js**

Create `gdgt_fe/simulation/engine/ViolationDetector.js`:

```js
/**
 * Checks state-based violation rules each frame.
 * Event-based rules (no detect fn) are handled by Rapier sensors in the scene.
 *
 * @param {object} gameState - { speed, ... } from useGameStore
 * @param {Array} violationRules - ViolationRule[] from scenario config
 * @returns {ViolationRule|null} first matching rule, or null
 */
export function checkStateBasedViolations(gameState, violationRules) {
  for (const rule of violationRules) {
    if (typeof rule.detect === 'function' && rule.detect(gameState)) {
      return rule
    }
  }
  return null
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run simulation/engine/__tests__/ViolationDetector.test.js --reporter=verbose
```

Expected: all 5 tests PASS.

- [ ] **Step 5: Run all tests to confirm nothing broken**

```bash
npx vitest run --reporter=verbose
```

Expected: all previous tests still PASS.

- [ ] **Step 6: Commit**

```bash
git add gdgt_fe/simulation/engine/ViolationDetector.js gdgt_fe/simulation/engine/__tests__/ViolationDetector.test.js
git commit -m "feat(sim): add ViolationDetector state-based polling logic"
```

---

## Task 6: ReplaySystem — circular buffer

**Files:**
- Create: `gdgt_fe/simulation/engine/__tests__/ReplaySystem.test.js`
- Create: `gdgt_fe/simulation/engine/ReplaySystem.js`

- [ ] **Step 1: Write failing test**

Create `gdgt_fe/simulation/engine/__tests__/ReplaySystem.test.js`:

```js
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
    buf.push({ t: 3 }) // t:0 evicted
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
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run simulation/engine/__tests__/ReplaySystem.test.js --reporter=verbose
```

Expected: `Error: Cannot find module '../ReplaySystem'`

- [ ] **Step 3: Implement ReplaySystem.js**

Create `gdgt_fe/simulation/engine/ReplaySystem.js`:

```js
/**
 * Creates a fixed-capacity circular buffer for storing per-frame snapshots.
 * Used by the replay system to record the last N seconds of gameplay.
 *
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
    getAll() {
      return [...items]
    },
    getLastN(n) {
      return items.slice(Math.max(0, items.length - n))
    },
    freeze() {
      frozen = true
    },
    thaw() {
      frozen = false
      items = []
    },
    isFrozen() {
      return frozen
    },
    clear() {
      items = []
      frozen = false
    },
  }
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run simulation/engine/__tests__/ReplaySystem.test.js --reporter=verbose
```

Expected: all 7 tests PASS.

- [ ] **Step 5: Run full test suite**

```bash
npx vitest run --reporter=verbose
```

Expected: all tests PASS, 0 failures.

- [ ] **Step 6: Commit**

```bash
git add gdgt_fe/simulation/engine/ReplaySystem.js gdgt_fe/simulation/engine/__tests__/ReplaySystem.test.js
git commit -m "feat(sim): add circular replay buffer with freeze/thaw"
```

---

## Task 7: Download and place Kenney CC0 assets

This is a manual download task. No code written here — just asset preparation.

- [ ] **Step 1: Create asset directories**

```bash
mkdir -p gdgt_fe/public/assets/simulation/models
mkdir -p gdgt_fe/public/assets/simulation/textures
```

- [ ] **Step 2: Download Kenney Car Kit**

Go to https://kenney.nl/assets/car-kit — click Download (free, CC0).
Extract ZIP. From the `Models/GLTF format/` folder, copy these files to `gdgt_fe/public/assets/simulation/models/`:
- `car-sedan.glb` (player vehicle)
- `car-police.glb`, `car-taxi.glb`, `car-truck.glb` (NPC variants)

- [ ] **Step 3: Download Kenney City Kit (Commercial)**

Go to https://kenney.nl/assets/city-kit-commercial — click Download (free, CC0).
Extract ZIP. From `Models/GLTF format/`, copy to `gdgt_fe/public/assets/simulation/models/`:
- `road-straight.glb`
- `road-intersection.glb`
- `building-a.glb`, `building-b.glb`, `building-c.glb`
- `sidewalk.glb`
- `traffic-light.glb`

- [ ] **Step 4: Download road texture**

Go to https://kenney.nl/assets/road-textures — click Download (free, CC0).
From the ZIP, copy `asphalt.png` to `gdgt_fe/public/assets/simulation/textures/asphalt.png`.

- [ ] **Step 5: Create placeholder thumbnail**

Copy any of the downloaded renders (or take a screenshot) and save as:
`gdgt_fe/public/assets/simulation/city-driving-thumb.jpg` (any 400×225 image works for now).

- [ ] **Step 6: Commit**

```bash
git add gdgt_fe/public/assets/simulation/
git commit -m "feat(sim): add Kenney CC0 3D assets for city-driving scenario"
```

---

## Task 8: useVehicleInput + VirtualJoystick

**Files:**
- Create: `gdgt_fe/simulation/engine/useVehicleInput.js`
- Create: `gdgt_fe/simulation/engine/VirtualJoystick.jsx`

- [ ] **Step 1: Implement useVehicleInput.js**

Create `gdgt_fe/simulation/engine/useVehicleInput.js`:

```js
'use client'
import { useEffect, useRef } from 'react'

/**
 * Returns a ref with normalized { forward: number, turn: number } in range [-1, 1].
 * Reads from keyboard on desktop, updated by VirtualJoystick on mobile.
 */
export function useVehicleInput() {
  const input = useRef({ forward: 0, turn: 0 })

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    if (isMobile) return // mobile input handled by VirtualJoystick component

    const keys = {}
    const onKeyDown = (e) => { keys[e.code] = true }
    const onKeyUp = (e) => { keys[e.code] = false }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    let raf
    const tick = () => {
      const fwd = (keys['ArrowUp'] || keys['KeyW']) ? 1 : (keys['ArrowDown'] || keys['KeyS']) ? -1 : 0
      const trn = (keys['ArrowRight'] || keys['KeyD']) ? 1 : (keys['ArrowLeft'] || keys['KeyA']) ? -1 : 0
      input.current.forward = fwd
      input.current.turn = trn
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return input
}
```

- [ ] **Step 2: Implement VirtualJoystick.jsx**

Create `gdgt_fe/simulation/engine/VirtualJoystick.jsx`:

```jsx
'use client'
import { useEffect, useRef } from 'react'

/**
 * Renders a nipplejs joystick in the bottom-left of the screen.
 * Writes { forward, turn } into the provided inputRef.
 * Only mounts on touch devices.
 */
export function VirtualJoystick({ inputRef }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isMobile) return

    let manager
    import('nipplejs').then(({ default: nipplejs }) => {
      manager = nipplejs.create({
        zone: containerRef.current,
        mode: 'static',
        position: { left: '80px', bottom: '80px' },
        color: 'rgba(255,255,255,0.6)',
        size: 100,
      })

      manager.on('move', (_evt, data) => {
        const angle = data.angle.radian       // 0 = right, π/2 = up
        const force = Math.min(data.force, 1)
        inputRef.current.forward = force * Math.sin(angle)
        inputRef.current.turn = force * Math.cos(angle)
      })

      manager.on('end', () => {
        inputRef.current.forward = 0
        inputRef.current.turn = 0
      })
    })

    return () => manager?.destroy()
  }, [inputRef])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '200px',
        height: '200px',
        zIndex: 20,
      }}
    />
  )
}
```

- [ ] **Step 3: Verify build passes**

```bash
cd gdgt_fe && npm run build
```

Expected: build succeeds. If `nipplejs` types complain, add `// @ts-ignore` above the dynamic import.

- [ ] **Step 4: Commit**

```bash
git add gdgt_fe/simulation/engine/useVehicleInput.js gdgt_fe/simulation/engine/VirtualJoystick.jsx
git commit -m "feat(sim): add keyboard + virtual joystick vehicle input"
```

---

## Task 9: SimulationCanvas — R3F Canvas + XR + Physics

**Files:**
- Create: `gdgt_fe/simulation/engine/SimulationCanvas.jsx`
- Create: `gdgt_fe/simulation/engine/PhysicsWorld.jsx`

- [ ] **Step 1: Implement PhysicsWorld.jsx**

Create `gdgt_fe/simulation/engine/PhysicsWorld.jsx`:

```jsx
'use client'
import { Physics } from '@react-three/rapier'

/**
 * Wraps children in a Rapier physics world with gravity set for driving simulation.
 * Gravity: -9.81 on Y axis (standard). timeStep 'vary' lets it adapt to frame rate.
 */
export function PhysicsWorld({ children }) {
  return (
    <Physics gravity={[0, -9.81, 0]} timeStep="vary">
      {children}
    </Physics>
  )
}
```

- [ ] **Step 2: Implement SimulationCanvas.jsx**

Create `gdgt_fe/simulation/engine/SimulationCanvas.jsx`:

```jsx
'use client'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Suspense, useMemo } from 'react'
import { PhysicsWorld } from './PhysicsWorld'
import { HUD } from './HUD'

/**
 * Top-level simulation wrapper.
 * Renders the R3F Canvas (with XR + Physics) and HTML HUD overlay.
 *
 * Props:
 *   scenario — { component: React.Component, violations: ViolationRule[], durationSeconds: number }
 */
export function SimulationCanvas({ scenario }) {
  const xrStore = useMemo(() => createXRStore(), [])
  const SceneComponent = scenario.component

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000' }}>
      <Canvas
        shadows
        camera={{ position: [0, 4, 10], fov: 60 }}
        gl={{ antialias: false }} // SMAA post-processing handles AA
      >
        <XR store={xrStore}>
          <PhysicsWorld>
            <Suspense fallback={null}>
              <SceneComponent violations={scenario.violations} />
            </Suspense>
          </PhysicsWorld>
        </XR>
      </Canvas>

      <HUD
        durationSeconds={scenario.durationSeconds}
        xrStore={xrStore}
      />
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: build succeeds (the new files are not yet imported anywhere, so Next.js won't bundle them).

- [ ] **Step 4: Commit**

```bash
git add gdgt_fe/simulation/engine/SimulationCanvas.jsx gdgt_fe/simulation/engine/PhysicsWorld.jsx
git commit -m "feat(sim): add R3F Canvas with WebXR and Rapier physics"
```

---

## Task 10: HUD — HTML overlay

**Files:**
- Create: `gdgt_fe/simulation/engine/HUD.jsx`

- [ ] **Step 1: Implement HUD.jsx**

Create `gdgt_fe/simulation/engine/HUD.jsx`:

```jsx
'use client'
import { useEffect, useRef } from 'react'
import { useGameStore } from './useGameStore'

function pad(n) {
  return String(Math.floor(n)).padStart(2, '0')
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${pad(m)}:${pad(s)}`
}

/**
 * HTML overlay rendered on top of the R3F Canvas.
 * Timer, score, speedometer, violation toast, VR entry button.
 */
export function HUD({ durationSeconds, xrStore }) {
  const { status, score, timeLeft, speed, currentViolation, violations } = useGameStore()

  // Auto-start game when canvas mounts
  useEffect(() => {
    if (status === 'idle') {
      useGameStore.getState().startGame(durationSeconds)
    }
  }, [durationSeconds, status])

  // Auto-transition: VIOLATION → REPLAY after 0.5s
  useEffect(() => {
    if (status !== 'violation') return
    const t = setTimeout(() => useGameStore.getState().startReplay(), 500)
    return () => clearTimeout(t)
  }, [status])

  // Auto-transition: REPLAY → PLAYING after 4s (show lesson, then resume)
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
      {supportsXR && (
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

      {/* Violation toast — center */}
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

      {/* Replay overlay */}
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
          background: 'rgba(26,43,74,0.95)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
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
              <p style={{ color: '#4ade80', textAlign: 'center' }}>✅ Không có vi phạm!</p>
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
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add gdgt_fe/simulation/engine/HUD.jsx
git commit -m "feat(sim): add HTML HUD overlay with timer, score, violation toast, summary"
```

---

## Task 11: FollowCamera — third-person camera

**Files:**
- Create: `gdgt_fe/simulation/engine/FollowCamera.jsx`

- [ ] **Step 1: Implement FollowCamera.jsx**

Create `gdgt_fe/simulation/engine/FollowCamera.jsx`:

```jsx
'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const _targetPos = new THREE.Vector3()
const _cameraPos = new THREE.Vector3()
const OFFSET = new THREE.Vector3(0, 4, 9)  // behind and above the vehicle

/**
 * Attaches to the R3F scene and smoothly follows a target object.
 * Pass `targetRef` — a ref to the vehicle mesh (not RigidBody).
 */
export function FollowCamera({ targetRef }) {
  const { camera } = useThree()
  const lookAt = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    if (!targetRef.current) return

    targetRef.current.getWorldPosition(_targetPos)

    // Desired camera position = vehicle pos + fixed offset (world space)
    _cameraPos.copy(_targetPos).add(OFFSET)

    // Smooth lerp toward desired position (speed 5/s feels natural)
    camera.position.lerp(_cameraPos, 1 - Math.exp(-5 * delta))

    // Look at a point slightly above the vehicle
    lookAt.current.copy(_targetPos).add(new THREE.Vector3(0, 1, 0))
    camera.lookAt(lookAt.current)
  })

  return null
}
```

- [ ] **Step 2: Commit**

```bash
git add gdgt_fe/simulation/engine/FollowCamera.jsx
git commit -m "feat(sim): add smooth third-person follow camera"
```

---

## Task 12: City Driving scene — 3D environment

**Files:**
- Create: `gdgt_fe/simulation/scenarios/city-driving/index.jsx`

- [ ] **Step 1: Implement city-driving/index.jsx**

Create `gdgt_fe/simulation/scenarios/city-driving/index.jsx`:

```jsx
'use client'
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Sky, Environment } from '@react-three/drei'
import { RigidBody, CuboidCollider, useRapier } from '@react-three/rapier'
import * as THREE from 'three'
import { useGameStore } from '../../engine/useGameStore'
import { useVehicleInput } from '../../engine/useVehicleInput'
import { VirtualJoystick } from '../../engine/VirtualJoystick'
import { FollowCamera } from '../../engine/FollowCamera'
import { checkStateBasedViolations } from '../../engine/ViolationDetector'
import { PostProcessing } from '../../engine/PostProcessing'

// Traffic light cycle durations (seconds)
const LIGHT_GREEN = 8
const LIGHT_YELLOW = 2
const LIGHT_RED = 8
const CYCLE = LIGHT_GREEN + LIGHT_YELLOW + LIGHT_RED

const LIGHT_COLORS = {
  green: new THREE.Color('#16a34a'),
  yellow: new THREE.Color('#f59e0b'),
  red: new THREE.Color('#dc2626'),
  off: new THREE.Color('#111111'),
}

function TrafficLight({ position }) {
  const lightTimer = useRef(0)
  const [phase, setPhase] = useState('green')
  const greenRef = useRef()
  const yellowRef = useRef()
  const redRef = useRef()
  const { nodes } = useGLTF('/assets/simulation/models/traffic-light.glb')

  useFrame((_, delta) => {
    lightTimer.current += delta
    const t = lightTimer.current % CYCLE
    const newPhase = t < LIGHT_GREEN ? 'green' : t < LIGHT_GREEN + LIGHT_YELLOW ? 'yellow' : 'red'
    if (newPhase !== phase) setPhase(newPhase)

    // Update emissive color to simulate light glow
    if (greenRef.current) greenRef.current.emissive = phase === 'green' ? LIGHT_COLORS.green : LIGHT_COLORS.off
    if (yellowRef.current) yellowRef.current.emissive = phase === 'yellow' ? LIGHT_COLORS.yellow : LIGHT_COLORS.off
    if (redRef.current) redRef.current.emissive = phase === 'red' ? LIGHT_COLORS.red : LIGHT_COLORS.off
  })

  return (
    <group position={position}>
      <primitive object={nodes.Scene ?? nodes[Object.keys(nodes)[0]]} scale={1} />
    </group>
  )
}

function Road() {
  const { scene } = useGLTF('/assets/simulation/models/road-straight.glb')
  // Tile 5 road segments along Z axis
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <primitive
          key={i}
          object={scene.clone()}
          position={[0, 0, -i * 20]}
          scale={1}
        />
      ))}
    </>
  )
}

function Buildings() {
  const a = useGLTF('/assets/simulation/models/building-a.glb')
  const b = useGLTF('/assets/simulation/models/building-b.glb')
  return (
    <>
      {[-12, 12].map((x, xi) =>
        [0, -20, -40, -60, -80].map((z, zi) => (
          <primitive
            key={`${xi}-${zi}`}
            object={(zi % 2 === 0 ? a : b).scene.clone()}
            position={[x, 0, z]}
            scale={1}
          />
        ))
      )}
    </>
  )
}

function NpcCar({ startZ, model, speed = 8 }) {
  const { scene } = useGLTF(`/assets/simulation/models/${model}`)
  const bodyRef = useRef()

  useFrame(() => {
    if (!bodyRef.current) return
    const pos = bodyRef.current.translation()
    // Reset NPC to far end when it passes the start
    if (pos.z > 10) bodyRef.current.setTranslation({ x: pos.x, y: pos.y, z: startZ }, true)
    bodyRef.current.setLinvel({ x: 0, y: 0, z: speed }, true)
  })

  return (
    <RigidBody ref={bodyRef} type="kinematicVelocity" position={[-3, 0.3, startZ]} colliders="hull">
      <primitive object={scene.clone()} scale={1} rotation={[0, Math.PI, 0]} />
    </RigidBody>
  )
}

function PlayerVehicle({ violations, inputRef, vehicleMeshRef }) {
  const bodyRef = useRef()
  const { triggerViolation } = useGameStore()

  useFrame((_, delta) => {
    if (!bodyRef.current) return

    const { forward, turn } = inputRef.current

    // Apply driving forces
    const vel = bodyRef.current.linvel()
    const currentSpeed = Math.sqrt(vel.x ** 2 + vel.z ** 2)

    // Forward impulse
    if (forward !== 0) {
      bodyRef.current.applyImpulse({ x: 0, y: 0, z: -forward * 15 * delta }, true)
    } else {
      // Friction brake when no input
      bodyRef.current.setLinvel({ x: vel.x * 0.95, y: vel.y, z: vel.z * 0.95 }, true)
    }

    // Steering torque (only when moving)
    if (turn !== 0 && currentSpeed > 0.5) {
      bodyRef.current.applyTorqueImpulse({ x: 0, y: -turn * 5 * delta, z: 0 }, true)
    }

    // Clamp Y angular velocity to prevent rolling
    const angVel = bodyRef.current.angvel()
    bodyRef.current.setAngvel({ x: 0, y: angVel.y * 0.9, z: 0 }, true)

    // Update speed in store (m/s → km/h)
    const kmh = currentSpeed * 3.6
    useGameStore.getState().setSpeed(kmh)

    // Check state-based violations
    const hit = checkStateBasedViolations({ speed: kmh }, violations)
    if (hit) triggerViolation(hit)

    // Push replay snapshot
    const pos = bodyRef.current.translation()
    const rot = bodyRef.current.rotation()
    useGameStore.getState().pushSnapshot({ t: performance.now(), position: [pos.x, pos.y, pos.z], rotation: [rot.x, rot.y, rot.z, rot.w], speed: kmh })

    // Sync mesh ref for follow camera
    if (vehicleMeshRef.current && bodyRef.current) {
      vehicleMeshRef.current.position.set(pos.x, pos.y, pos.z)
    }
  })

  const { scene } = useGLTF('/assets/simulation/models/car-sedan.glb')

  return (
    <RigidBody
      ref={bodyRef}
      position={[0, 0.5, 0]}
      mass={1200}
      linearDamping={0.5}
      angularDamping={0.8}
      colliders="hull"
    >
      <primitive object={scene.clone()} scale={1} />
    </RigidBody>
  )
}

function StopLineSensor({ position, violations }) {
  const lightTimerRef = useRef(0)
  const phaseRef = useRef('green')
  const { triggerViolation, status } = useGameStore()

  // Keep track of light phase via ref (avoids re-renders)
  useFrame((_, delta) => {
    lightTimerRef.current += delta
    const t = lightTimerRef.current % CYCLE
    phaseRef.current = t < LIGHT_GREEN ? 'green' : t < LIGHT_GREEN + LIGHT_YELLOW ? 'yellow' : 'red'
  })

  return (
    <RigidBody type="fixed" position={position} sensor>
      <CuboidCollider
        args={[3, 0.5, 0.1]}
        sensor
        onIntersectionEnter={() => {
          if (status !== 'playing') return
          if (phaseRef.current === 'red') {
            const rule = violations.find((v) => v.id === 'red-light')
            if (rule) triggerViolation(rule)
          }
        }}
      />
    </RigidBody>
  )
}

/**
 * Main city-driving scene component.
 * Receives violations[] from registry via SimulationCanvas.
 */
export default function CityDrivingScene({ violations }) {
  const inputRef = useVehicleInput()
  const vehicleMeshRef = useRef()

  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[50, 100, 50]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />

      {/* Ground plane (invisible physics floor) */}
      <RigidBody type="fixed">
        <CuboidCollider args={[100, 0.1, 200]} position={[0, -0.1, -50]} />
      </RigidBody>

      <Road />
      <Buildings />
      <TrafficLight position={[5, 0, -30]} />

      {/* Stop line sensor positioned just before the traffic light */}
      <StopLineSensor position={[0, 0.1, -26]} violations={violations} />

      {/* NPC vehicles in opposing lane */}
      <NpcCar startZ={-90} model="car-police.glb" speed={8} />
      <NpcCar startZ={-60} model="car-taxi.glb" speed={9} />
      <NpcCar startZ={-120} model="car-truck.glb" speed={6} />

      {/* Player */}
      <group ref={vehicleMeshRef}>
        <PlayerVehicle
          violations={violations}
          inputRef={inputRef}
          vehicleMeshRef={vehicleMeshRef}
        />
      </group>

      <FollowCamera targetRef={vehicleMeshRef} />
      <PostProcessing />
      <VirtualJoystick inputRef={inputRef} />
    </>
  )
}

// Preload assets
useGLTF.preload('/assets/simulation/models/car-sedan.glb')
useGLTF.preload('/assets/simulation/models/car-police.glb')
useGLTF.preload('/assets/simulation/models/car-taxi.glb')
useGLTF.preload('/assets/simulation/models/car-truck.glb')
useGLTF.preload('/assets/simulation/models/road-straight.glb')
useGLTF.preload('/assets/simulation/models/building-a.glb')
useGLTF.preload('/assets/simulation/models/building-b.glb')
useGLTF.preload('/assets/simulation/models/traffic-light.glb')
```

- [ ] **Step 2: Commit**

```bash
git add gdgt_fe/simulation/scenarios/city-driving/index.jsx
git commit -m "feat(sim): add city-driving 3D scene with physics, NPCs, traffic light, sensors"
```

---

## Task 13: Post-processing (bloom + SMAA, auto-disable on low FPS)

**Files:**
- Create: `gdgt_fe/simulation/engine/PostProcessing.jsx`

- [ ] **Step 1: Implement PostProcessing.jsx**

Create `gdgt_fe/simulation/engine/PostProcessing.jsx`:

```jsx
'use client'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing'

const FPS_SAMPLE_INTERVAL = 2   // seconds between FPS checks
const FPS_THRESHOLD = 30         // disable post-processing below this FPS

/**
 * Bloom + SMAA post-processing.
 * Auto-disables if average FPS drops below 30 to maintain playability.
 */
export function PostProcessing() {
  const [enabled, setEnabled] = useState(true)
  const frames = useRef(0)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    frames.current++
    elapsed.current += delta
    if (elapsed.current >= FPS_SAMPLE_INTERVAL) {
      const fps = frames.current / elapsed.current
      if (fps < FPS_THRESHOLD && enabled) setEnabled(false)
      frames.current = 0
      elapsed.current = 0
    }
  })

  if (!enabled) return null

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.25} luminanceThreshold={0.8} luminanceSmoothing={0.9} />
      <SMAA />
    </EffectComposer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add gdgt_fe/simulation/engine/PostProcessing.jsx
git commit -m "feat(sim): add bloom + SMAA post-processing with auto-disable on low FPS"
```

---

## Task 14: Register city-driving in registry

**Files:**
- Modify: `gdgt_fe/simulation/registry.js`

- [ ] **Step 1: Update registry.js to include city-driving**

Replace the entire contents of `gdgt_fe/simulation/registry.js` with:

```js
import CityDrivingScene from './scenarios/city-driving/index.jsx'
import { metadata, violations } from './scenarios/city-driving/config.js'

const scenarios = [
  { ...metadata, component: CityDrivingScene, violations },
]

export const getAllScenarios = () => scenarios

export const getScenarioById = (id) => scenarios.find((s) => s.id === id) ?? null
```

- [ ] **Step 2: Run tests — registry tests should still pass**

```bash
cd gdgt_fe && npx vitest run --reporter=verbose
```

Expected: all tests PASS. The registry "every scenario has required fields" test now validates city-driving.

- [ ] **Step 3: Commit**

```bash
git add gdgt_fe/simulation/registry.js
git commit -m "feat(sim): register city-driving scenario in registry"
```

---

## Task 15: Hub page — /simulation

**Files:**
- Create: `gdgt_fe/app/simulation/page.js`

- [ ] **Step 1: Implement hub page**

Create `gdgt_fe/app/simulation/page.js`:

```js
import Link from 'next/link'
import { getAllScenarios } from '@/simulation/registry'

const difficultyLabel = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' }
const difficultyColor = { easy: 'bg-green-100 text-green-800', medium: 'bg-amber-100 text-amber-800', hard: 'bg-red-100 text-red-800' }

export const metadata = {
  title: 'Mô phỏng Giao thông | An Toàn Giao Thông',
}

export default function SimulationHubPage() {
  const scenarios = getAllScenarios()

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-[#2d3f6b] text-white py-16 px-6 text-center">
        <h1 className="text-3xl font-bold mb-3">🚗 Mô phỏng Giao thông</h1>
        <p className="text-slate-300 max-w-xl mx-auto">
          Luyện tập xử lý tình huống giao thông thực tế trong môi trường 3D an toàn.
          Hỗ trợ kính VR và điều khiển cảm ứng.
        </p>
      </section>

      {/* Scenario grid */}
      <section className="max-w-4xl mx-auto py-12 px-6">
        <h2 className="text-xl font-semibold text-navy mb-6">Chọn kịch bản</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <Link key={scenario.id} href={`/simulation/${scenario.id}`} className="group block">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-40 bg-navy overflow-hidden">
                  <img
                    src={scenario.thumbnail}
                    alt={scenario.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-navy">{scenario.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${difficultyColor[scenario.difficulty]}`}>
                      {difficultyLabel[scenario.difficulty]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{scenario.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>⏱ {Math.floor(scenario.durationSeconds / 60)} phút</span>
                    <span className="text-orange font-medium group-hover:underline">Bắt đầu →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Coming soon placeholder */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm opacity-50 cursor-not-allowed">
            <div className="h-40 bg-slate-200 flex items-center justify-center text-4xl">🔒</div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-400">Ngã tư đèn tín hiệu</h3>
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Sắp ra mắt</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd gdgt_fe && npm run build
```

Expected: builds without error.

- [ ] **Step 3: Commit**

```bash
git add gdgt_fe/app/simulation/page.js
git commit -m "feat(sim): add /simulation hub page with scenario grid"
```

---

## Task 16: Dynamic route — /simulation/[id]

**Files:**
- Create: `gdgt_fe/app/simulation/[id]/page.js`

- [ ] **Step 1: Implement dynamic route**

Create `gdgt_fe/app/simulation/[id]/page.js`:

```js
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
      <div className="fixed inset-0 bg-navy flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🚗</div>
          <p>Đang tải kịch bản...</p>
        </div>
      </div>
    )
  }

  return <SimulationCanvas scenario={scenario} />
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build succeeds with no warnings about missing modules.

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```

Open `http://localhost:3000/simulation` — should show the hub page with the "Lái xe thành phố" card.
Click "Bắt đầu" — should navigate to `http://localhost:3000/simulation/city-driving` and render the 3D scene.
Press W/S/A/D — vehicle should move.
Drive past the stop line on red light — warning toast should appear, replay should trigger.

- [ ] **Step 4: Commit**

```bash
git add gdgt_fe/app/simulation/[id]/page.js
git commit -m "feat(sim): add /simulation/[id] dynamic route with loading state"
```

---

## Task 17: Add "Mô phỏng" to site navigation

**Files:**
- Modify: `gdgt_fe/components/Header.jsx`

- [ ] **Step 1: Read existing Header to find nav links array**

```bash
grep -n "Bài viết\|Video\|href" gdgt_fe/components/Header.jsx | head -20
```

- [ ] **Step 2: Add simulation link**

In `gdgt_fe/components/Header.jsx`, the `navLinks` array starts at line 8. Add `{ href: '/simulation', label: 'Mô phỏng' }` between `'Video'` and `'Hình ảnh'`:

```js
const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/posts', label: 'Bài viết' },
  { href: '/videos', label: 'Video' },
  { href: '/simulation', label: 'Mô phỏng' },   // ADD THIS LINE
  { href: '/images', label: 'Hình ảnh' },
  { href: '/documents', label: 'Tài liệu' },
  { href: '/exams', label: 'Thi thử' },
];
```

- [ ] **Step 3: Verify header renders correctly**

```bash
npm run dev
```

Visit `http://localhost:3000` — "Mô phỏng" should appear in the nav bar and link to `/simulation`.

- [ ] **Step 4: Commit**

```bash
git add gdgt_fe/components/Header.jsx
git commit -m "feat(sim): add Mô phỏng link to site navigation"
```

---

## Task 18: Final build + smoke test

- [ ] **Step 1: Run full test suite**

```bash
cd gdgt_fe && npx vitest run --reporter=verbose
```

Expected: all tests PASS (useGameStore × 8, registry × 4, ViolationDetector × 5, ReplaySystem × 7, city-driving config × 5 = 29 tests).

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: build succeeds, no TypeScript or module errors.

- [ ] **Step 3: Manual smoke test checklist**

Start dev server: `npm run dev`

| Test | Expected |
|------|----------|
| Visit `/simulation` | Hub page renders, "Lái xe thành phố" card visible |
| Click "Bắt đầu" | Navigates to `/simulation/city-driving`, 3D scene loads |
| Scene visible | Road, buildings, traffic light, sky rendered (not blank) |
| Press W | Vehicle moves forward |
| Press A/D | Vehicle turns left/right |
| Drive into stop line on red | Warning toast appears, scene slows down, lesson text visible |
| After replay | Returns to PLAYING state |
| Timer counts down | Reaches 0, summary screen appears |
| Summary screen | Score, violations list, "Chơi lại" and "Về trang chủ" buttons |
| "Chơi lại" | Resets game, returns to IDLE → re-starts |
| Visit `/simulation/nonexistent` | Redirects to `/simulation` |
| Open on mobile | Virtual joystick visible in bottom-left |

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete traffic simulation module with Scenario Registry, city-driving scene, VR support"
```

> **Do NOT push until the user reviews.**
