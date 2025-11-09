'use client'

import { useState, useEffect } from 'react'
import tr from '@/messages/tr.json'
import en from '@/messages/en.json'

export type Locale = 'tr' | 'en'

const translations = { tr, en }

function getLocaleFromCookie(): Locale {
  if (typeof document === 'undefined') return 'tr'
  
  const locale = document.cookie
    .split('; ')
    .find((row) => row.startsWith('locale='))
    ?.split('=')[1] as Locale
  
  return locale || 'tr'
}

export function useTranslations() {
  const [locale, setLocale] = useState<Locale>('tr')

  useEffect(() => {
    setLocale(getLocaleFromCookie())
  }, [])

  return translations[locale]
}

