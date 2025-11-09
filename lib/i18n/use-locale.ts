'use client'

import { useParams } from 'next/navigation'
import type { Locale } from './index'

export function useLocale(): Locale {
  const params = useParams()
  const locale = params?.locale as string
  return (locale === 'tr' || locale === 'en') ? locale : 'tr'
}

