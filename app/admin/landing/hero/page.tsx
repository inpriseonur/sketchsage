import { createClient } from '@/lib/supabase/server'
import HeroEditor from '@/components/admin/HeroEditor'
import Link from 'next/link'

export default async function HeroManagementPage() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('landing_content')
    .select('*')
    .eq('section', 'hero')
    .order('language')

  if (error) {
    console.error('Hero data fetch error:', error)
  }

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/landing"
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Geri
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Hero Alanı Düzenle</h1>
          <p className="text-gray-400 mt-1">
            Ana sayfanın hero bölümündeki başlık, açıklama ve buton yazısını düzenleyin
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
        {data && data.length > 0 ? (
          <HeroEditor data={data} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Hero içeriği bulunamadı.</p>
            <p className="text-sm text-gray-500 mt-2">
              Lütfen veritabanında landing_content tablosunu kontrol edin.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

