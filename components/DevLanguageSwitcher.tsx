'use client'

import { useTranslations } from '@/lib/i18n/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function DevLanguageSwitcher() {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState<'tr' | 'en'>('tr')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Cookie'den mevcut dili al
    const locale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('locale='))
      ?.split('=')[1] as 'tr' | 'en' || 'tr'
    
    setCurrentLocale(locale)
  }, [])

  const changeLocale = (locale: 'tr' | 'en') => {
    // Cookie'ye kaydet
    document.cookie = `locale=${locale}; path=/; max-age=31536000`
    setCurrentLocale(locale)
    
    // Sayfayı yenile
    router.refresh()
    window.location.reload()
  }

  if (!mounted) return null

  // Sadece development'da göster
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-3">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-400 font-semibold mb-1 px-2">
          🌍 DEV: Dil Seçici
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => changeLocale('tr')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentLocale === 'tr'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🇹🇷 Türkçe
          </button>
          <button
            onClick={() => changeLocale('en')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentLocale === 'en'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1 px-2">
          Aktif: {currentLocale === 'tr' ? 'Türkçe' : 'English'}
        </div>
      </div>
    </div>
  )
}

