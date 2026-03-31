'use client'

import Link from 'next/link'

const difficultyLabel = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' }
const difficultyColor = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-amber-100 text-amber-800',
  hard: 'bg-red-100 text-red-800',
}

export default function ScenarioCard({ scenario }) {
  return (
    <Link href={`/simulation/${scenario.id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative h-40 bg-[#1a2b4a] overflow-hidden">
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
            <h3 className="font-semibold text-slate-800 text-sm">{scenario.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${difficultyColor[scenario.difficulty]}`}>
              {difficultyLabel[scenario.difficulty]}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">{scenario.description}</p>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>⏱ {Math.floor(scenario.durationSeconds / 60)} phút</span>
            <span className="text-orange-500 font-medium group-hover:underline">Bắt đầu →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
