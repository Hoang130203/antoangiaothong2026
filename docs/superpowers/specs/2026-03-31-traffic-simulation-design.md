# Traffic Simulation Module — An Toàn Giao Thông

**Date:** 2026-03-31
**Status:** Draft — awaiting user review

---

## Summary

Thêm trang `/simulation` vào frontend Next.js hiện tại: một module mô phỏng giao thông 3D tương tác chạy trên browser (WebGL) với tuỳ chọn VR qua WebXR. Kiến trúc Scenario Registry cho phép thêm kịch bản mới mà không sửa engine. Không có backend — hoàn toàn frontend-only.

---

## 1. Tech Stack

### Packages cần cài thêm

| Package | Mục đích |
|---------|----------|
| `@react-three/fiber` | React wrapper cho Three.js (R3F) |
| `@react-three/drei` | Helpers: Sky, Environment, Text3D, useGLTF... |
| `@react-three/rapier` | Vật lý xe cộ (WASM Rapier, nhẹ hơn Cannon) |
| `@react-three/xr` | WebXR / VR headset support |
| `nipplejs` | Virtual joystick cho mobile/tablet |
| `zustand` | Game state management (chưa có trong project — cần cài) |

### Packages hiện tại giữ nguyên

`next` 14, `tailwindcss`, `framer-motion`, `lucide-react`, `next-auth`, `axios`.

---

## 2. Cấu trúc file

```
gdgt_fe/
├── app/
│   └── simulation/
│       ├── page.js                        # Hub: list kịch bản từ registry
│       └── [id]/
│           └── page.js                    # Dynamic route: load scenario theo ID
│
└── simulation/
    ├── registry.js                        # Danh sách tất cả kịch bản (entry point duy nhất)
    │
    ├── engine/                            # Core engine — không sửa khi thêm kịch bản
    │   ├── SimulationCanvas.jsx           # R3F Canvas + WebXR provider
    │   ├── VehicleController.jsx          # Input: WASD keyboard + virtual joystick
    │   ├── PhysicsWorld.jsx               # Rapier Physics wrapper
    │   ├── ViolationDetector.jsx          # Kiểm tra rules, emit violation events
    │   ├── ReplaySystem.jsx               # Circular buffer 5s, slow-motion playback
    │   ├── HUD.jsx                        # HTML overlay: timer, score, warning toast, speedometer
    │   └── useGameStore.js                # Zustand store: game state machine
    │
    └── scenarios/
        └── city-driving/
            ├── index.jsx                  # R3F scene: đường, đèn, NPC, xe player
            └── config.js                  # Metadata + violation rules
```

**Quy tắc thêm kịch bản mới:** tạo thư mục mới trong `scenarios/`, viết `index.jsx` + `config.js`, đăng ký 1 object vào `registry.js`. Engine tự nhận, không cần sửa file nào khác.

---

## 3. ScenarioConfig Interface

Mỗi kịch bản export một object theo interface sau (định nghĩa ở `registry.js`):

```js
{
  id: string,               // URL slug: 'city-driving'
  title: string,            // Tên hiển thị: 'Lái xe thành phố'
  description: string,      // Mô tả ngắn
  difficulty: 'easy' | 'medium' | 'hard',
  thumbnail: string,        // Đường dẫn ảnh thumbnail public/
  durationSeconds: number,  // Thời gian mỗi lượt (mặc định 180)
  component: React.Component, // R3F scene component
  violations: ViolationRule[], // Danh sách luật cần kiểm tra
}
```

```js
// ViolationRule — 2 loại trigger
{
  id: string,
  label: string,            // 'Vượt đèn đỏ'
  penalty: number,          // Điểm trừ (ví dụ: -20)
  lesson: string,           // Giải thích hiện trong overlay
  lawReference: string,     // 'Điều 9, Luật GTĐB 2008'

  // Loại 1 — State-based (kiểm tra mỗi frame):
  detect?: (gameState) => boolean,  // VD: state.speed > 60

  // Loại 2 — Event-based (Rapier sensor callbacks trong scene):
  // Scene gọi triggerViolation('red-light') khi onIntersectionEnter
  // detect không cần thiết cho loại này
}
```

**Quy tắc:** `ViolationDetector.jsx` polling state-based rules mỗi frame. Event-based rules được fire trực tiếp từ Rapier sensor `onIntersectionEnter` / `onCollisionEnter` trong `index.jsx` của kịch bản bằng cách gọi `useGameStore.getState().triggerViolation(ruleId)`. Cả hai đều dẫn đến cùng một luồng: `PLAYING → VIOLATION → REPLAY`.

---

## 4. Game State Machine

Zustand store (`useGameStore.js`) quản lý các trạng thái:

```
IDLE → (start) → PLAYING → (violation) → VIOLATION → (auto 0.5s) → REPLAY
                                                                      ↓ (xem xong)
                                                                    PLAYING
PLAYING → (hết giờ) → SUMMARY → (restart | hub) → IDLE
```

State shape:
```js
{
  status: 'idle' | 'playing' | 'violation' | 'replay' | 'summary',
  score: number,          // Bắt đầu từ 100, trừ theo penalty
  timeLeft: number,       // Countdown seconds
  speed: number,          // km/h (từ physics)
  violations: [],         // Log các vi phạm đã xảy ra
  replayBuffer: [],       // Circular buffer snapshots
  currentViolation: null, // ViolationRule đang replay
}
```

---

## 5. VehicleController — Điều khiển

Tự động detect thiết bị và kích hoạt input phù hợp:

| Thiết bị | Input |
|----------|-------|
| Desktop | WASD / mũi tên — tăng tốc, phanh, lái |
| Mobile/Tablet | nipplejs joystick ảo góc dưới-trái màn hình |
| VR | Controller thumbstick (react-xr) |

Controller emit normalized `{ forward, turn }` values → PhysicsWorld apply lực lên Rapier RigidBody của xe.

---

## 6. ReplaySystem

**Ghi (khi PLAYING):**
- Mỗi frame lưu snapshot: `{ t, position, rotation, speed, lightColor, laneId }`
- Circular buffer giữ 5 giây gần nhất (~300 frames @ 60fps)
- Khi vi phạm: freeze buffer tại thời điểm đó

**Phát lại (khi REPLAY):**
- Rewind về snapshot tại `t - 3s` so với vi phạm
- Phát lại ở `0.3x` time scale bằng cách interpolate snapshots
- Highlight xe player bằng outline đỏ (drei `Outlines`)
- HUD hiện overlay giải thích vi phạm + law reference
- Sau khi phát hết: tự động quay về PLAYING

---

## 7. HUD (HTML Overlay)

HTML overlay tuyệt đối lên canvas, không phải 3D objects:

| Vùng | Nội dung |
|------|----------|
| Top-left | ⏱️ Countdown timer |
| Top-center | Tên kịch bản |
| Top-right | ⭐ Điểm hiện tại |
| Bottom-right | Đồng hồ tốc độ (km/h) |
| Bottom-left | Nút "🥽 Enter VR" (ẩn nếu WebXR không được hỗ trợ) |
| Center (toast) | Warning khi vi phạm: tên vi phạm + điểm trừ, tự ẩn sau 2s |

---

## 8. Chất lượng đồ họa

**Mục tiêu:** Stylized low-poly sắc nét — chất lượng game mobile hiện đại (tham chiếu: Monument Valley, Mini Motor Racing). Không dùng placeholder geometry (cube, cylinder làm xe), không voxel/Minecraft style.

**Assets 3D (GLTF/GLB — free, license CC0):**

| Asset | Nguồn | Ghi chú |
|-------|-------|---------|
| Xe ô tô / xe máy player | [Kenney Car Kit](https://kenney.nl/assets/car-kit) | CC0, ~50 mẫu xe sắc nét |
| Xe NPC | Kenney Car Kit (variant khác màu) | |
| Tòa nhà, vỉa hè, đường | [Kenney City Kit](https://kenney.nl/assets/city-kit-commercial) | CC0 |
| Đèn tín hiệu | [Kenney Road Textures](https://kenney.nl/assets/road-textures) | CC0 |
| Cây xanh, bụi cây | [Kenney Nature Kit](https://kenney.nl/assets/nature-kit) | CC0 |

**Rendering quality:**
- PBR materials (`MeshStandardMaterial`) với roughness/metalness map
- Shadow maps bật: `DirectionalLight` với `castShadow`, `receiveShadow` trên mặt đường + xe
- `Environment` preset (`city` hoặc `sunset`) từ drei cho ambient lighting
- Post-processing nhẹ (drei `EffectComposer`): bloom + anti-aliasing (SMAA)
- Mặt đường: texture asphalt thực (không solid color), lane markings rõ
- Skybox: drei `Sky` component (gradient tự nhiên)

**Performance target:** 60fps trên máy mid-range, tắt post-processing tự động nếu FPS < 30.

---

## 9. City Driving — Kịch bản đầu tiên

**Scene 3D (index.jsx):**
- Đường thẳng 2 làn, 200m, vỉa hè 2 bên — dùng Kenney City Kit GLB
- 1 đèn tín hiệu Kenney: xanh 8s → vàng 2s → đỏ 8s (loop, đổi màu emissive material)
- 3-5 xe NPC Kenney Car Kit di chuyển ngược chiều (Rapier KinematicPositionBased)
- Xe player: Kenney Car Kit GLB + Rapier RigidBody với bánh xe friction đơn giản
- Tòa nhà + cây ven đường từ Kenney để scene không trống rỗng
- Environment: drei `Sky` + `DirectionalLight` với shadow

**Camera:** Third-person follow camera, nhìn từ sau-trên xe player, smooth lerp. Trong VR mode: first-person từ cabin xe.

**Collision zones (invisible Rapier sensors):**
| Zone | Vi phạm khi |
|------|------------|
| StopLineSensor | Player vượt qua khi `lightColor === 'red'` |
| SpeedZoneSensor | `speed > 60 km/h` |
| LaneBoundarySensor (trái/phải) | Player ra khỏi làn đường |
| NPCSensor | Va chạm với xe NPC |

**config.js violations:**
```
red-light   → -20đ | "Vượt đèn đỏ" | Điều 9 Luật GTĐB
speeding    → -15đ | "Chạy quá tốc độ" | Điều 12 Luật GTĐB
wrong-lane  → -10đ | "Lấn làn" | Điều 13 Luật GTĐB
collision   → -25đ | "Va chạm xe" | Điều 9 Luật GTĐB
```

---

## 9. Hub Page — /simulation

- Theme navy/orange nhất quán với phần còn lại của site
- Header + Footer hiện tại dùng lại
- Hero section: tiêu đề + mô tả ngắn
- Grid các scenario cards: thumbnail, tên, độ khó (Badge component hiện tại), nút "Bắt đầu"
- Các kịch bản chưa có hiện card mờ + badge "Sắp ra mắt"
- Dùng `PageWrapper` + `Card` component có sẵn

---

## 10. Dynamic Route — /simulation/[id]

- `app/simulation/[id]/page.js` là Client Component (`'use client'`) vì R3F Canvas dùng browser APIs
- `app/simulation/page.js` (hub) là Server Component — không cần `'use client'`
- Load scenario từ registry theo `params.id`
- Nếu không tìm thấy: redirect về `/simulation`
- Render `SimulationCanvas` với `scenario.component` và `scenario.violations`
- Canvas chiếm toàn màn hình (`100vw × 100vh`), HUD overlay lên trên
- Không render Header/Footer trong khi chơi (full-screen immersive)
- Tất cả engine components (`SimulationCanvas`, `HUD`, v.v.) đều là Client Components

---

## 11. Out of Scope

- Backend / API / lưu kết quả vào tài khoản
- Asset GLB tự vẽ / custom — dùng Kenney CC0 trước
- Realistic photogrammetry (quá nặng cho web)
- Âm thanh / nhạc nền
- Leaderboard / ranking
- Multiplayer
- Mobile AR (WebAR)
- Các kịch bản ngoài `city-driving` (sẽ thêm sau theo registry pattern)
- CI/CD changes

---

## 12. .gitignore

Thêm `.superpowers/` vào `.gitignore` nếu chưa có.
