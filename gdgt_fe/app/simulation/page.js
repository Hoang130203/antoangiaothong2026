import { getAllScenarios } from '@/simulation/registry'
import ScenarioCard from './ScenarioCard'

export const metadata = {
  title: 'Mô phỏng Giao thông | An Toàn Giao Thông',
}

export default function SimulationHubPage() {
  const scenarios = getAllScenarios()

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a2b4a] to-[#2d3f6b] text-white py-16 px-6 text-center">
        <h1 className="text-3xl font-bold mb-3">🚗 Mô phỏng Giao thông</h1>
        <p className="text-slate-300 max-w-xl mx-auto text-sm">
          Luyện tập xử lý tình huống giao thông thực tế trong môi trường 3D an toàn.
          Hỗ trợ kính VR và điều khiển cảm ứng.
        </p>
      </section>

      {/* Scenario grid */}
      <section className="max-w-4xl mx-auto py-12 px-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Chọn kịch bản</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map(({ id, title, description, difficulty, thumbnail, durationSeconds }) => (
            <ScenarioCard key={id} scenario={{ id, title, description, difficulty, thumbnail, durationSeconds }} />
          ))}

          {/* Coming soon placeholder */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm opacity-50">
            <div className="h-40 bg-slate-200 flex items-center justify-center text-4xl">🔒</div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-400 text-sm">Ngã tư đèn tín hiệu</h3>
              <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full mt-1 inline-block">
                Sắp ra mắt
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
