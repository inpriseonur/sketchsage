import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminEvaluationsPage() {
  const supabase = await createClient()

  // Tüm evaluations'ları kullanıcı bilgileriyle çek
  const { data: evaluations } = await supabase
    .from('evaluations')
    .select(`
      *,
      users_profile!evaluations_user_id_fkey (
        id,
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  const statusColors = {
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-300', label: 'Beklemede' },
    in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-300', label: 'İşleniyor' },
    completed: { bg: 'bg-green-500/10', text: 'text-green-300', label: 'Tamamlandı' },
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Değerlendirmeler</h1>
        <div className="text-sm text-slate-400">
          Toplam: <span className="font-bold text-white">{evaluations?.length || 0}</span>
        </div>
      </div>

      {/* Evaluations List */}
      <div className="grid gap-4">
        {evaluations?.map((evaluation) => {
          const user = evaluation.users_profile as any
          const status = evaluation.status as 'pending' | 'in_progress' | 'completed'
          const statusInfo = statusColors[status]

          // Parse title from user_message
          let title = 'Untitled'
          if (evaluation.user_message) {
            const titleMatch = evaluation.user_message.match(/TITLE:\s*(.+?)(?:\n|$)/)
            if (titleMatch && titleMatch[1]) {
              title = titleMatch[1].trim()
            }
          }

          return (
            <Link
              key={evaluation.id}
              href={`/admin/evaluations/${evaluation.id}`}
              className="flex flex-col gap-4 rounded-lg border border-slate-700/50 bg-[#161a25]/60 p-4 backdrop-blur-sm transition-shadow hover:shadow-xl hover:shadow-black/20 md:flex-row md:items-center"
            >
              {/* Thumbnail */}
              <div className="relative h-32 w-full shrink-0 overflow-hidden rounded md:h-24 md:w-32">
                {evaluation.media_type === 'video' ? (
                  <>
                    <video
                      src={evaluation.media_url}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="material-symbols-outlined text-4xl text-white">
                        play_circle
                      </span>
                    </div>
                  </>
                ) : (
                  <img
                    src={evaluation.media_url}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="text-sm text-slate-400">
                    {user?.full_name || user?.email || 'Unknown User'}
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(evaluation.created_at).toLocaleString('tr-TR')}
                </p>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-4">
                {evaluation.feedback_type && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined text-sm">
                      {evaluation.feedback_type === 'audio' ? 'mic' : 'chat_bubble'}
                    </span>
                    <span className="text-xs">
                      {evaluation.feedback_type === 'audio' ? 'Sesli' : 'Yazılı'}
                    </span>
                  </div>
                )}
                
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                  <div className={`size-2 rounded-full ${statusInfo.text.replace('text-', 'bg-')}`}></div>
                  {statusInfo.label}
                </div>
              </div>
            </Link>
          )
        })}

        {(!evaluations || evaluations.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-slate-700/50 bg-[#161a25]/60 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">
              inbox
            </span>
            <p className="text-slate-400">Henüz değerlendirme bulunmuyor</p>
          </div>
        )}
      </div>
    </div>
  )
}

