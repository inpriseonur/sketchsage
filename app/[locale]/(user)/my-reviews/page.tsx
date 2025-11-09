import MyReviewsClient from '@/components/user/MyReviewsClient'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLocaleFromParams, getTranslations } from '@/lib/i18n'

export default async function MyReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/auth/login`)
  }

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

  // Tüm evaluation'ların soru sayılarını tek sorguda al
  const evaluationIds = evaluations?.map(e => e.id) || []
  const { data: questionCounts } = await supabase
    .from('evaluation_questions')
    .select('evaluation_id, answer')
    .in('evaluation_id', evaluationIds)

  // Her evaluation için soru sayılarını hesapla
  const questionStats = (questionCounts || []).reduce((acc, q) => {
    if (!acc[q.evaluation_id]) {
      acc[q.evaluation_id] = { total: 0, answered: 0 }
    }
    acc[q.evaluation_id].total++
    if (q.answer) {
      acc[q.evaluation_id].answered++
    }
    return acc
  }, {} as Record<string, { total: number; answered: number }>)

  // System settings'den soru limitini çek
  const { data: settings } = await supabase
    .from('system_settings')
    .select('value')
    .eq('key', 'questions_per_evaluation')
    .single()
  
  const maxQuestions = settings ? Number(settings.value) : 2

  // Locale'i al
  const localeTyped = getLocaleFromParams({ locale })
  const t = await getTranslations({ locale })
  
  // Evaluations verisini component'in beklediği formata dönüştür
  const formattedReviews = (evaluations || []).map((evaluation) => {
    // Title'ı user_message'dan parse et
    let title = t.myReviews.untitled
    if (evaluation.user_message) {
      const titleMatch = evaluation.user_message.match(/TITLE:\s*(.+?)(?:\n|$)/)
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim()
      } else {
        // Eğer format yoksa ilk satırı al
        title = evaluation.user_message.split('\n')[0]?.slice(0, 50) || t.myReviews.untitled
      }
    }

    const questionData = questionStats[evaluation.id] || { total: 0, answered: 0 }
    
    return {
      id: evaluation.id,
      title,
      type: evaluation.media_type as 'image' | 'video',
      submittedAt: new Date(evaluation.created_at).toISOString().split('T')[0],
      questions: { 
        answered: questionData.answered, 
        total: questionData.total 
      },
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

