# Frontend Redesign: An Toàn Giao Thông — Traffic Safety Theme

**Date:** 2026-03-30
**Status:** Approved

## Summary

Full UI overhaul of the Next.js 14 frontend:
- Replace MUI v5 + Bulma with Tailwind CSS
- Change brand/theme from "giáo dục giới tính" → "an toàn giao thông" (traffic safety)
- Add dynamic, energetic animations via Framer Motion
- Fix API base URL to use environment variable pointing to backend at port 8086
- Deploy via Vercel (npm build, no Docker)

## 1. Tech Stack Changes

| Action | Package |
|--------|---------|
| Remove | `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `bulma`, `react-typical` |
| Add | `tailwindcss`, `@tailwindcss/typography`, `postcss`, `autoprefixer`, `framer-motion`, `lucide-react` |
| Keep | `next` 14, `axios`, `next-auth`, `cloudinary` / `next-cloudinary`, `react`, `react-dom` |

## 2. Color Palette

| Role | Token | Hex |
|------|-------|-----|
| Primary (navy) | `navy` | `#1a2b4a` |
| Accent (orange) | `orange` | `#f97316` |
| Warning (amber) | `amber` | `#f59e0b` |
| Success (green) | `green` | `#16a34a` |
| Danger (red) | `red` | `#dc2626` |
| Background | `bg` | `#f8fafc` |
| Surface | `white` | `#ffffff` |

Defined as Tailwind theme extensions in `tailwind.config.js`.

## 3. API Fix

`gdgt_fe/app/api/api.js`:
- Replace `const base_url = "https://gdgt.maiminhhoang.id.vn"` with:
  ```js
  const base_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8086';
  ```
- `.env.local` (gitignored): `NEXT_PUBLIC_API_URL=http://localhost:8086`
- Vercel env var for production deployment

## 4. Shared UI Components

Built in `gdgt_fe/components/ui/`:

| Component | Purpose |
|-----------|---------|
| `Button.jsx` | primary / secondary / ghost / danger variants, Framer Motion `whileTap` |
| `Card.jsx` | White surface, drop shadow, `whileHover` scale + shadow lift |
| `Badge.jsx` | Traffic-signal color chips (green/amber/red/navy) |
| `PageWrapper.jsx` | Wraps every page with fade-in + slide-up entry animation |
| `SectionTitle.jsx` | Styled section heading with orange underline accent |

## 5. Layout Components

### Header (`gdgt_fe/components/Header.jsx`)
- Sticky, dark navy background
- Logo: shield icon (lucide) + "An Toàn Giao Thông" text in orange
- Nav links: Trang chủ / Bài viết / Video / Hình ảnh / Tài liệu / Thi thử
- Hover: orange underline slide-in
- Mobile: hamburger with Framer Motion slide-down menu
- Scroll shadow: adds box-shadow after 10px scroll
- Auth buttons: Đăng nhập / Đăng xuất

### Footer (`gdgt_fe/components/Footer.jsx`)
- Dark navy background
- Logo + short tagline "Cùng nhau xây dựng văn hóa giao thông an toàn"
- Nav links row
- Copyright line

## 6. Pages

### Home (`gdgt_fe/app/page.js`)
- Full-height hero: animated traffic light SVG (red→amber→green loop), Framer Motion staggered text reveal, orange CTA button with pulse
- Stats marquee: animated horizontal scroll of key numbers
- Feature section: 3 cards (Bài viết / Video / Thi thử) with scroll-triggered fade-in
- Replace EmojiRain and react-typical with Framer Motion equivalents

### Posts (`gdgt_fe/app/posts/page.js`)
- Feed of Card components, stagger animation on list
- Create post form (for authenticated users) — orange accent styling
- Remove all "giáo dục giới tính" placeholder text

### Videos (`gdgt_fe/app/videos/page.js`)
- Responsive grid of video cards
- Admin upload form with Cloudinary integration
- Hover overlay with play button

### Exams list (`gdgt_fe/app/exams/page.js`)
- Replace "sức khỏe sinh sản" → "an toàn giao thông" everywhere
- Tab: Danh sách đề thi / Kết quả của tôi
- Card per exam with traffic-signal badge for difficulty

### Exam detail (`gdgt_fe/app/exams/[id]/page.js`)
- Replace "Cuộc thi tìm hiểu về sức khỏe sinh sản" → "Bài kiểm tra an toàn giao thông"
- Timer bar animated with Framer Motion
- Question cards with green/red flash on answer selection

### Login (`gdgt_fe/app/login/page.js`)
- Clean centered card, navy + orange theme
- Remove MUI components, replace with Tailwind inputs + Button component

### Signup (`gdgt_fe/app/signup/page.js`)
- Same style as login — centered card, navy + orange theme, Tailwind inputs + Button

### Posts detail (`gdgt_fe/app/posts/detail/[id]/page.js`)
- Apply Card + PageWrapper, replace old-theme text

### Videos detail (`gdgt_fe/app/videos/detail/[id]/page.js`)
- Apply Card + PageWrapper, replace old-theme text

### Info / Friends / Images / Documents pages
- Apply Card + PageWrapper + SectionTitle consistently
- Replace any remaining old-theme text

## 7. Animation Patterns (Framer Motion)

| Pattern | Usage |
|---------|-------|
| Page entry | `initial={{ opacity:0, y:20 }}` → `animate={{ opacity:1, y:0 }}` — every page via `PageWrapper` |
| Stagger list | `staggerChildren: 0.08` on list containers (posts, videos, exams) |
| `whileHover` | `scale: 1.02` + shadow on all Card components |
| `whileTap` | `scale: 0.97` on all Button components |
| Scroll reveal | `useInView` + `animate` on home feature section |
| Traffic light | Infinite loop animation on home hero SVG |
| Text sequence | Framer Motion `animate` on hero headline |

## 8. Content Changes (Vietnamese text)

| Old | New |
|-----|-----|
| "Trang thông tin giáo dục" (layout title) | "An Toàn Giao Thông" |
| "giáo dục giới tính" (any occurrence) | "an toàn giao thông" |
| "sức khỏe sinh sản" (any occurrence) | "an toàn giao thông" |
| "Cuộc thi tìm hiểu về sức khỏe sinh sản" | "Bài kiểm tra an toàn giao thông" |
| "Create by Trần Thị Tuyết" (footer) | keep as-is |
| Nav: "Hình ảnh" / "Tài liệu" | keep (still relevant) |

## 9. File Structure (new/modified)

```
gdgt_fe/
├── tailwind.config.js          NEW
├── postcss.config.js           NEW
├── .env.local                  NEW (gitignored)
├── package.json                MODIFY (deps)
├── app/
│   ├── globals.css             MODIFY (Tailwind directives, remove old vars)
│   ├── layout.js               MODIFY (title, remove MUI ThemeProvider)
│   ├── page.js                 MODIFY (home hero)
│   ├── posts/page.js           MODIFY
│   ├── videos/page.js          MODIFY
│   ├── exams/page.js           MODIFY
│   ├── exams/[id]/page.js      MODIFY
│   ├── login/page.js           MODIFY
│   ├── signup/page.js          MODIFY
│   ├── posts/detail/[id]/page.js  MODIFY
│   └── videos/detail/[id]/page.js MODIFY
├── components/
│   ├── Header.jsx              MODIFY
│   ├── Footer.jsx              MODIFY
│   └── ui/
│       ├── Button.jsx          NEW
│       ├── Card.jsx            NEW
│       ├── Badge.jsx           NEW
│       ├── PageWrapper.jsx     NEW
│       └── SectionTitle.jsx    NEW
└── app/api/api.js              MODIFY (base_url)
```

## 10. Out of Scope

- Backend changes
- next-auth provider configuration changes
- Cloudinary setup changes
- CI/CD pipeline
- BCrypt / JWT auth
- Images / Documents pages full redesign (apply shared components only, no structural change)
