import { cookies } from 'next/headers'
import tr from '@/messages/tr.json'
import en from '@/messages/en.json'

export type Locale = 'tr' | 'en'

const translations = { tr, en }

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value as Locale
  return locale || 'tr'
}

export async function getTranslations() {
  const locale = await getLocale()
  return translations[locale]
}

export function setLocale(locale: Locale) {
  // Client-side'da cookie set et
  document.cookie = `locale=${locale}; path=/; max-age=31536000` // 1 yıl
}

