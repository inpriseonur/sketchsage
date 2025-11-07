import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function LandingManagement() {
  const supabase = createClient()

  // Landing content verilerini çek
  const { data: landingContent } = await supabase
    .from('landing_content')
    .select('*')
    .order('language')

  // Paketleri çek
  const { data: packages } = await supabase
    .from('credit_packages')
    .select('*')
    .order('credit_amount')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Landing Page Yönetimi</h1>
          <p className="text-gray-400">Ana sayfa içeriklerini buradan yönetin</p>
        </div>
      </div>

      {/* Hero Alan Yönetimi */}
      <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Hero Alanı</h2>
          <Link
            href="/admin/landing/hero"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Düzenle
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {landingContent?.map((content) => (
            <div key={content.id} className="bg-[#0f1117] border border-gray-700 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-400">{content.language}</span>
              </div>
              <h3 className="text-white font-semibold mb-1">{content.hero_title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{content.hero_subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Paket Yönetimi */}
      <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Feedback Paketleri</h2>
          <Link
            href="/admin/packages"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Yönet
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {packages?.map((pkg) => (
            <div key={pkg.id} className="bg-[#0f1117] border border-gray-700 rounded p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{pkg.credit_amount}</div>
                <div className="text-sm text-gray-400 mb-3">Feedback</div>
                <div className="text-2xl font-bold text-orange-400">${pkg.price_usd}</div>
                <div className="text-sm text-gray-500 mt-1">₺{pkg.price_try}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Gallery */}
      <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Quality Gallery</h2>
          <Link
            href="/admin/gallery"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Yönet
          </Link>
        </div>
        <p className="text-gray-400 text-sm">
          "See the Quality of Feedback" bölümündeki örnek görselleri ve videoları yönetin
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">How It Works</h2>
          <Link
            href="/admin/landing/how-it-works"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Düzenle
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {landingContent?.map((content) => (
            <div key={content.id} className="bg-[#0f1117] border border-gray-700 rounded p-4">
              <span className="text-sm font-medium text-blue-400 block mb-2">{content.language}</span>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• {content.how_it_works_step1_title}</p>
                <p>• {content.how_it_works_step2_title}</p>
                <p>• {content.how_it_works_step3_title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">FAQ</h2>
          <Link
            href="/admin/landing/faq"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Düzenle
          </Link>
        </div>
        <p className="text-gray-400 text-sm">
          Sık Sorulan Sorular bölümünü yönetin
        </p>
      </div>
    </div>
  )
}

