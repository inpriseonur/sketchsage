'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export type Locale = 'tr' | 'en'

const localeNames: Record<Locale, string> = {
  tr: 'TR',
  en: 'EN',
}

export default function LanguageSwitcher() {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState<Locale>('tr')

  useEffect(() => {
    // Cookie'den mevcut dili al
    const locale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('locale='))
      ?.split('=')[1] as Locale || 'tr'
    
    setCurrentLocale(locale)
  }, [])

  const changeLocale = (locale: Locale) => {
    // Cookie'ye kaydet
    document.cookie = `locale=${locale}; path=/; max-age=31536000`
    setCurrentLocale(locale)
    
    // Sayfayı yenile
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
      {(['tr', 'en'] as Locale[]).map((locale) => (
        <button
          key={locale}
          onClick={() => changeLocale(locale)}
          className={`px-3 py-1 rounded text-sm font-medium transition-all ${
            currentLocale === locale
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          {localeNames[locale]}
        </button>
      ))}
    </div>
  )
}

