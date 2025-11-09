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

  // Kullanıcının tüm değerlendirmelerini çek
  const { data: evaluations } = await supabase
    .from('evaluations')
    .select(`
      id,
      media_url,
      media_type,
      user_message,
      status,
      feedback_type,
      created_at
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  // Evaluations verisini component'in beklediği formata dönüştür
  const formattedReviews = (evaluations || []).map((evaluation) => {
    // Title'ı user_message'dan parse et
    let title = 'Untitled Review'
    if (evaluation.user_message) {
      const titleMatch = evaluation.user_message.match(/TITLE:\s*(.+?)(?:\n|$)/)
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim()
      } else {
        // Eğer format yoksa ilk satırı al
        title = evaluation.user_message.split('\n')[0]?.slice(0, 50) || 'Untitled Review'
      }
    }
    
    return {
      id: evaluation.id,
      title,
      type: evaluation.media_type as 'image' | 'video',
      submittedAt: new Date(evaluation.created_at).toISOString().split('T')[0],
      questions: { answered: 0, total: 2 }, // TODO: Gerçek soru sayısını al
      status: evaluation.status as 'pending' | 'in_progress' | 'completed',
      thumbnail: evaluation.media_url,
      feedbackType: evaluation.feedback_type as 'text' | 'audio' | null,
    }
  })

  return (
    <MyReviewsClient 
      credits={profile?.credits || 0} 
      initialReviews={formattedReviews}
    />
  )
}

