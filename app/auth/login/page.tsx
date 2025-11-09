import { createClient } from '@/lib/supabase/server'
import { getTranslations, getLocale } from '@/lib/i18n'
import { generateMetadata as createMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  
  if (locale === 'tr') {
    return createMetadata({
      title: 'Giriş Yap',
      description: 'SketchSage hesabınıza giriş yapın ve sanat çalışmalarınız için profesyonel feedback almaya başlayın.',
      locale: 'tr',
      noindex: true, // Login sayfası indexlenmesin
    })
  }
  
  return createMetadata({
    title: 'Login',
    description: 'Sign in to your SketchSage account and start receiving professional feedback on your artwork.',
    locale: 'en',
    noindex: true,
  })
}

export default async function LoginPage() {
  const supabase = await createClient()
  const t = await getTranslations()
  
  // OAuth ayarlarını server-side çek
  const { data: settings } = await supabase
    .from('system_settings')
    .select('key, value')
    .in('key', ['google_oauth_enabled', 'facebook_oauth_enabled'])

  // Ayarları parse et
  const googleEnabled = settings?.find(s => s.key === 'google_oauth_enabled')?.value ?? true
  const facebookEnabled = settings?.find(s => s.key === 'facebook_oauth_enabled')?.value ?? true

  return (
    <LoginForm 
      googleOAuthEnabled={googleEnabled as boolean}
      facebookOAuthEnabled={facebookEnabled as boolean}
      translations={t}
    />
  )
}
