import { createClient } from '@/lib/supabase/server'
import { getTranslations, getLocaleFromParams } from '@/lib/i18n'
import { generateMetadata as createMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'
import SignupForm from '@/components/auth/SignupForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const localeTyped = locale as 'tr' | 'en'
  
  if (localeTyped === 'tr') {
    return createMetadata({
      title: 'Kaydol',
      description: 'SketchSage\'e katılın ve sanatınızı bir üst seviyeye taşıyın. Profesyonel feedback almak için hemen hesap oluşturun.',
      locale: 'tr',
      alternateLocales: ['en'],
      noindex: true,
      path: '/auth/signup',
    })
  }
  
  return createMetadata({
    title: 'Sign Up',
    description: 'Join SketchSage and take your art to the next level. Create an account now to receive professional feedback.',
    locale: 'en',
    alternateLocales: ['tr'],
    noindex: true,
    path: '/auth/signup',
  })
}

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeTyped = getLocaleFromParams({ locale })
  const supabase = await createClient()
  const t = await getTranslations({ locale })
  
  // OAuth ayarlarını server-side çek
  const { data: settings } = await supabase
    .from('system_settings')
    .select('key, value')
    .in('key', ['google_oauth_enabled', 'facebook_oauth_enabled'])

  // Ayarları parse et
  const googleEnabled = settings?.find(s => s.key === 'google_oauth_enabled')?.value ?? true
  const facebookEnabled = settings?.find(s => s.key === 'facebook_oauth_enabled')?.value ?? true

  return (
    <SignupForm 
      googleOAuthEnabled={googleEnabled as boolean}
      facebookOAuthEnabled={facebookEnabled as boolean}
      translations={t}
    />
  )
}

