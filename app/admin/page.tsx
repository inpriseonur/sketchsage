import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // İstatistikler
  const { count: totalEvaluations } = await supabase
    .from('evaluations')
    .select('*', { count: 'exact', head: true })

  const { count: pendingEvaluations } = await supabase
    .from('evaluations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: totalUsers } = await supabase
    .from('users_profile')
    .select('*', { count: 'exact', head: true })

  const { count: unansweredQuestions } = await supabase
    .from('evaluation_questions')
    .select('*', { count: 'exact', head: true })
    .is('answer', null)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">SketchSage yönetim paneline hoş geldiniz</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Toplam Kullanıcı</h3>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalUsers || 0}</p>
        </div>

        <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Bekleyen Değerlendirme</h3>
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-3xl font-bold text-yellow-500">{pendingEvaluations || 0}</p>
        </div>

        <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Toplam Değerlendirme</h3>
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalEvaluations || 0}</p>
        </div>

        <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Bekleyen Soru</h3>
            <span className="text-2xl">❓</span>
          </div>
          <p className="text-3xl font-bold text-orange-500">{unansweredQuestions || 0}</p>
        </div>
      </div>

      {/* Hızlı Erişim */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/landing"
            className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🏠</span>
              <div>
                <h3 className="text-white font-semibold mb-1">Landing Page Yönetimi</h3>
                <p className="text-gray-400 text-sm">Hero, paketler, FAQ düzenle</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/evaluations"
            className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">📝</span>
              <div>
                <h3 className="text-white font-semibold mb-1">Değerlendirmeler</h3>
                <p className="text-gray-400 text-sm">Bekleyen talepleri incele</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/packages"
            className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">💰</span>
              <div>
                <h3 className="text-white font-semibold mb-1">Paket Yönetimi</h3>
                <p className="text-gray-400 text-sm">Fiyatları ve paketleri düzenle</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">⚙️</span>
              <div>
                <h3 className="text-white font-semibold mb-1">Sistem Ayarları</h3>
                <p className="text-gray-400 text-sm">Genel ayarları yapılandır</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

