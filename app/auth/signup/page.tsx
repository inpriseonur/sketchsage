import { createClient } from '@/lib/supabase/server'
import SignupForm from '@/components/auth/SignupForm'

export default async function SignupPage() {
  const supabase = await createClient()
  
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
    />
  )
}
