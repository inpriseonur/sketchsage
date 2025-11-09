import { createClient } from '@/lib/supabase/server'
import { getTranslations } from '@/lib/i18n'
import LoginForm from '@/components/auth/LoginForm'

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
