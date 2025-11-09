import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminQuestionsPage() {
  const supabase = await createClient()

  // Tüm soruları çek - cevapsız olanlar önce
  const { data: questions } = await supabase
    .from('evaluation_questions')
    .select(`
      *,
      evaluations!evaluation_questions_evaluation_id_fkey (
        id,
        user_message,
        media_url,
        media_type,
        users_profile!evaluations_user_id_fkey (
          email,
          full_name
        )
      )
    `)
    .order('answer', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Kullanıcı Soruları</h1>
        <div className="text-sm text-slate-400">
          Bekleyen:{' '}
          <span className="font-bold text-orange-500">
            {questions?.filter((q) => !q.answer).length || 0}
          </span>
          {' '}/{' '}
          <span className="font-bold text-white">{questions?.length || 0}</span>
        </div>
      </div>

      {/* Questions List */}
      <div className="grid gap-4">
        {questions?.map((question) => {
          const evaluation = question.evaluations as any
          const user = evaluation?.users_profile as any
          const isAnswered = !!question.answer

          // Parse title from evaluation
          let title = 'Untitled'
          if (evaluation?.user_message) {
            const titleMatch = evaluation.user_message.match(/TITLE:\s*(.+?)(?:\n|$)/)
            if (titleMatch && titleMatch[1]) {
              title = titleMatch[1].trim()
            }
          }

          return (
            <Link
              key={question.id}
              href={`/admin/evaluations/${evaluation.id}`}
              className={`flex flex-col gap-4 rounded-lg border p-4 backdrop-blur-sm transition-shadow hover:shadow-xl hover:shadow-black/20 ${
                isAnswered
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-orange-500/30 bg-orange-500/5'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm text-slate-400">
                      person
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {user?.full_name || user?.email || 'Unknown User'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(question.created_at).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    isAnswered
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-orange-500/10 text-orange-400'
                  }`}
                >
                  <div
                    className={`size-2 rounded-full ${
                      isAnswered ? 'bg-green-400' : 'bg-orange-400'
                    }`}
                  ></div>
                  {isAnswered ? 'Cevaplanmış' : 'Bekliyor'}
                </div>
              </div>

              {/* Evaluation Info */}
              <div className="flex items-center gap-3 rounded-lg bg-[#0f1119] p-3">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded">
                  {evaluation?.media_type === 'video' ? (
                    <>
                      <video src={evaluation.media_url} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="material-symbols-outlined text-2xl text-white">
                          play_circle
                        </span>
                      </div>
                    </>
                  ) : (
                    <img
                      src={evaluation?.media_url}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-300 truncate">{title}</p>
                  <p className="text-xs text-slate-500">Evaluation ID: {evaluation?.id?.slice(0, 8)}...</p>
                </div>
              </div>

              {/* Question */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400">Soru:</p>
                <p className="text-sm text-white">{question.question}</p>
              </div>

              {/* Answer (if exists) */}
              {isAnswered && (
                <div className="space-y-2 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                  <p className="text-xs font-medium text-green-400">Cevabınız:</p>
                  <p className="text-sm text-slate-200">{question.answer}</p>
                </div>
              )}
            </Link>
          )
        })}

        {(!questions || questions.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-slate-700/50 bg-[#161a25]/60 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">
              inbox
            </span>
            <p className="text-slate-400">Henüz soru bulunmuyor</p>
          </div>
        )}
      </div>
    </div>
  )
}

