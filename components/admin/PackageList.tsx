'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type Package = {
  id: string
  name: string
  credits: number
  price_usd: string
  price_try: string
  stripe_price_id_usd: string | null
  stripe_price_id_try: string | null
  is_active: boolean
  display_order: number
}

export default function PackageList({ packages }: { packages: Package[] }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" paketini silmek istediğinize emin misiniz?`)) {
      return
    }

    setIsDeleting(id)
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Silme başarısız')

      toast.success('Paket başarıyla silindi')
      router.refresh()
    } catch (error) {
      toast.error('Silme işlemi başarısız')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleActive = async (id: string, currentState: boolean) => {
    setIsToggling(id)
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentState }),
      })

      if (!res.ok) throw new Error('Güncelleme başarısız')

      toast.success(currentState ? 'Paket devre dışı bırakıldı' : 'Paket aktif edildi')
      router.refresh()
    } catch (error) {
      toast.error('İşlem başarısız')
    } finally {
      setIsToggling(null)
    }
  }

  if (!packages || packages.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white/5 rounded-full">
            <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Henüz paket yok</h3>
            <p className="text-sm text-white/60 mb-6">İlk kredi paketinizi oluşturun</p>
            <Link
              href="/admin/packages/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#D41111] px-6 py-3 text-sm font-semibold text-white hover:bg-[#B00E0E] transition-colors"
            >
              Yeni Paket Ekle
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                Sıra
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                Paket Adı
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                Kredi
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                USD Fiyat
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                TRY Fiyat
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {packages.map((pkg) => (
              <tr 
                key={pkg.id} 
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-medium text-white">
                    {pkg.display_order}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D41111] to-[#9F2241] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{pkg.name}</div>
                      {pkg.stripe_price_id_usd && (
                        <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Stripe bağlı
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D41111]/20 text-[#D41111] text-sm font-medium">
                    {pkg.credits} Kredi
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white font-semibold">${pkg.price_usd}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white font-semibold">₺{pkg.price_try}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(pkg.id, pkg.is_active)}
                    disabled={isToggling === pkg.id}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#D41111] focus:ring-offset-2 focus:ring-offset-[#221010] ${
                      pkg.is_active ? 'bg-green-500' : 'bg-white/20'
                    } ${isToggling === pkg.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        pkg.is_active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/packages/${pkg.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      disabled={isDeleting === pkg.id}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-500 text-sm font-medium hover:bg-red-500/30 transition-colors ${
                        isDeleting === pkg.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

