import dynamic from 'next/dynamic'
import { metadata, violations } from './scenarios/city-driving/config.js'

// Use next/dynamic with ssr: false so R3F (Three.js) never runs on the server
const CityDrivingScene = dynamic(
  () => import('./scenarios/city-driving/index.jsx'),
  { ssr: false }
)

const videoScenarios = [
  { id: 'video-1', type: 'video', title: 'Tình huống mô phỏng 1', description: 'Trải nghiệm tình huống giao thông thực tế', difficulty: 'medium', durationSeconds: 60, thumbnail: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400', videoUrl: 'https://drive.google.com/file/d/1gClMWYWnLOTR-2KhOSTFwFkrkYNJr8hm/preview' },
  { id: 'video-2', type: 'video', title: 'Tình huống mô phỏng 2', description: 'Trải nghiệm tình huống giao thông thực tế', difficulty: 'easy', durationSeconds: 60, thumbnail: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400', videoUrl: 'https://drive.google.com/file/d/1_7MLMBk6MOwI6dVV7-iXv5k5MhO0pIdK/preview' },
  { id: 'video-3', type: 'video', title: 'Tình huống mô phỏng 3', description: 'Trải nghiệm tình huống giao thông thực tế', difficulty: 'hard', durationSeconds: 60, thumbnail: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400', videoUrl: 'https://drive.google.com/file/d/1N-qhFu4-0Ybv90lN5galQVJAbHagVEDT/preview' },
  { id: 'video-4', type: 'video', title: 'Tình huống mô phỏng 4', description: 'Trải nghiệm tình huống giao thông thực tế', difficulty: 'medium', durationSeconds: 60, thumbnail: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400', videoUrl: 'https://drive.google.com/file/d/1Qwui7lyz87wjMAZdTCHXy-avlZennOoa/preview' },
  { id: 'video-5', type: 'video', title: 'Tình huống mô phỏng 5', description: 'Trải nghiệm tình huống giao thông thực tế', difficulty: 'easy', durationSeconds: 60, thumbnail: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400', videoUrl: 'https://drive.google.com/file/d/1oNhWAm77rywOGLiRV6EbpUhuPb4Gj4ZJ/preview' },
  { id: 'video-6', type: 'video', title: 'Tình huống mô phỏng 6', description: 'Trải nghiệm tình huống giao thông thực tế', difficulty: 'hard', durationSeconds: 60, thumbnail: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400', videoUrl: 'https://drive.google.com/file/d/1xjjPZ0NJqIJCiflakt_3N0XP4VxBdANh/preview' },
  { id: 'video-7', type: 'video', title: 'Tình huống mô phỏng 7', description: 'Trải nghiệm tình huống giao thông thực tế', difficulty: 'medium', durationSeconds: 60, thumbnail: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400', videoUrl: 'https://drive.google.com/file/d/1wMz2BgYcNm2cIcTBiDNDItgQ1C6k8-Eq/preview' },
  { id: 'video-8', type: 'video', title: 'Tình huống mô phỏng 8', description: 'Trải nghiệm tình huống giao thông thực tế', difficulty: 'easy', durationSeconds: 60, thumbnail: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400', videoUrl: 'https://drive.google.com/file/d/1BlcsFCqyQ8wELofDVOLB4iOn_fkM7nuG/preview' },
  { id: 'video-9', type: 'video', title: 'Tình huống mô phỏng 9', description: 'Trải nghiệm tình huống giao thông thực tế', difficulty: 'hard', durationSeconds: 60, thumbnail: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400', videoUrl: 'https://drive.google.com/file/d/12bDyFP39E_bnJ359wdJMQISVcXWob5yZ/preview' },
]

const scenarios = [
  { ...metadata, component: CityDrivingScene, violations },
  ...videoScenarios
]

export const getAllScenarios = () => scenarios

export const getScenarioById = (id) => scenarios.find((s) => s.id === id) ?? null
