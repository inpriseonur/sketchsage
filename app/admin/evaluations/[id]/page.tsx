import EvaluationForm from '@/components/admin/EvaluationForm'
import AdminQuestions from '@/components/admin/AdminQuestions'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function AdminEvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Evaluation verisini kullanıcı bilgileriyle çek
  const { data: evaluation, error } = await supabase
    .from('evaluations')
    .select(`
      *,
      users_profile!evaluations_user_id_fkey (
        id,
        email,
        full_name
      )
    `)
    .eq('id', id)
    .single()

  if (error || !evaluation) {
    notFound()
  }

  const user = evaluation.users_profile as any

  // Parse title and description
  let title = 'Untitled'
  let description = ''
  
  if (evaluation.user_message) {
    const titleMatch = evaluation.user_message.match(/TITLE:\s*(.+?)(?:\n|$)/)
    const descMatch = evaluation.user_message.match(/DESCRIPTION:\s*([\s\S]+?)$/)
    
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim()
    }
    if (descMatch && descMatch[1]) {
      description = descMatch[1].trim()
    }
  }

  // Soruları çek
  const { data: questions } = await supabase
    .from('evaluation_questions')
    .select('*')
    .eq('evaluation_id', id)
    .order('created_at', { ascending: true })

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/evaluations" className="text-slate-400 hover:text-white">
          Değerlendirmeler
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-white">{title}</span>
      </div>

      {/* User Info */}
      <div className="rounded-lg border border-slate-700/50 bg-[#161a25]/60 p-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-400">person</span>
          </div>
          <div>
            <p className="font-semibold text-white">{user?.full_name || 'Unknown User'}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Media Preview */}
      <div className="rounded-lg border border-slate-700/50 bg-[#161a25]/60 p-4">
        <h2 className="text-lg font-semibold text-white mb-3">Yüklenen İçerik</h2>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
          {evaluation.media_type === 'video' ? (
            <video
              src={evaluation.media_url}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={evaluation.media_url}
              alt={title}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>

      {/* User Message */}
      <div className="rounded-lg border border-slate-700/50 bg-[#161a25]/60 p-4">
        <h2 className="text-lg font-semibold text-white mb-3">Kullanıcı Mesajı</h2>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-slate-400">Başlık:</p>
            <p className="text-white">{title}</p>
          </div>
          {description && (
            <div>
              <p className="text-sm text-slate-400">Açıklama:</p>
              <p className="text-white whitespace-pre-wrap">{description}</p>
            </div>
          )}
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Gönderilme: {new Date(evaluation.created_at).toLocaleString('tr-TR')}
        </div>
      </div>

      {/* Feedback Form */}
      <EvaluationForm
        evaluationId={evaluation.id}
        currentStatus={evaluation.status as 'pending' | 'in_progress' | 'completed'}
        currentFeedbackType={evaluation.feedback_type as 'text' | 'audio' | null}
        currentFeedbackContent={evaluation.feedback_content}
      />

      {/* Questions & Answers */}
      <AdminQuestions
        evaluationId={evaluation.id}
        questions={(questions || []).map((q) => ({
          id: q.id,
          question: q.question,
          answer: q.answer,
          createdAt: q.created_at,
        }))}
      />
    </div>
  )
}

