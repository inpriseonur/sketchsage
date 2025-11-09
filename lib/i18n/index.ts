import { cookies } from 'next/headers'
import tr from '@/messages/tr.json'
import en from '@/messages/en.json'

export type Locale = 'tr' | 'en'

const translations = { tr, en }

// URL'den locale al (params'dan)
export function getLocaleFromParams(params?: { locale?: string }): Locale {
  if (params?.locale && (params.locale === 'tr' || params.locale === 'en')) {
    return params.locale as Locale
  }
  return 'tr'
}

// Cookie'den locale al (fallback)
export async function getLocaleFromCookie(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value as Locale
  return locale || 'tr'
}

// Öncelikle params'dan, yoksa cookie'den locale al
export async function getLocale(params?: { locale?: string }): Promise<Locale> {
  if (params?.locale && (params.locale === 'tr' || params.locale === 'en')) {
    return params.locale as Locale
  }
  return await getLocaleFromCookie()
}

export async function getTranslations(params?: { locale?: string }) {
  const locale = await getLocale(params)
  return translations[locale]
}

export function setLocale(locale: Locale) {
  // Client-side'da cookie set et
  document.cookie = `locale=${locale}; path=/; max-age=31536000` // 1 yıl
}

