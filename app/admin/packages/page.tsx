import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PackageList from '@/components/admin/PackageList'

export default async function PackagesPage() {
  const supabase = await createClient()
  
  const { data: packages } = await supabase
    .from('credit_packages')
    .select('*')
    .order('display_order')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Paket Yönetimi</h1>
          <p className="mt-2 text-sm text-white/60">
            Kredi paketlerini düzenleyin, fiyatları güncelleyin
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#D41111] px-6 py-3 text-sm font-semibold text-white hover:bg-[#B00E0E] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Paket Ekle
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D41111]/20 rounded-lg">
              <svg className="w-6 h-6 text-[#D41111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-white/60">Toplam Paket</p>
              <p className="text-2xl font-bold text-white">{packages?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-white/60">Aktif Paket</p>
              <p className="text-2xl font-bold text-white">
                {packages?.filter(p => p.is_active).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-white/60">En Düşük Fiyat</p>
              <p className="text-2xl font-bold text-white">
                {packages && packages.length > 0 
                  ? `$${Math.min(...packages.map(p => parseFloat(p.price_usd)))}`
                  : '$0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Package List */}
      <PackageList packages={packages || []} />
    </div>
  )
}

