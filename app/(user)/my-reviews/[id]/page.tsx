import EvaluationDetail from '@/components/user/EvaluationDetail'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

export default async function EvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Evaluation verisini çek
  const { data: evaluation, error: evalError } = await supabase
    .from('evaluations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id) // Kullanıcı sadece kendi evaluationlarını görebilir
    .single()

  if (evalError || !evaluation) {
    notFound()
  }

  // Questions verisini çek
  const { data: questions } = await supabase
    .from('evaluation_questions')
    .select('*')
    .eq('evaluation_id', id)
    .order('created_at', { ascending: true })

  // System settings'den soru limitini çek
  const { data: settings } = await supabase
    .from('system_settings')
    .select('value')
    .eq('key', 'questions_per_evaluation')
    .single()

  const questionsLimit = settings ? Number(settings.value) : 2
  const questionsCount = questions?.length || 0

  // Title ve description'ı parse et
  let title = 'Untitled Review'
  let description = ''
  
  if (evaluation.user_message) {
    const titleMatch = evaluation.user_message.match(/TITLE:\s*(.+?)(?:\n|$)/)
    const descMatch = evaluation.user_message.match(/DESCRIPTION:\s*(.+?)$/s)
    
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim()
    }
    if (descMatch && descMatch[1]) {
      description = descMatch[1].trim()
    }
  }

  return (
    <EvaluationDetail
      evaluation={{
        id: evaluation.id,
        title,
        description,
        mediaUrl: evaluation.media_url,
        mediaType: evaluation.media_type as 'image' | 'video',
        status: evaluation.status as 'pending' | 'in_progress' | 'completed',
        feedbackType: evaluation.feedback_type as 'text' | 'audio' | null,
        feedbackContent: evaluation.feedback_content,
        createdAt: evaluation.created_at,
      }}
      questions={(questions || []).map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        createdAt: q.created_at,
      }))}
      questionsLimit={questionsLimit}
      questionsCount={questionsCount}
    />
  )
}

