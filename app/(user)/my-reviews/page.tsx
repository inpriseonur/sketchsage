import MyReviewsClient from '@/components/user/MyReviewsClient'
import { createClient } from '@/lib/supabase/server'

export default async function MyReviewsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Kullanıcı kredi bilgisini çek
  const { data: profile } = await supabase
    .from('users_profile')
    .select('credits')
    .eq('id', user?.id)
    .single()

  return <MyReviewsClient credits={profile?.credits || 0} />
}

