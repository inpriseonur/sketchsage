'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Evaluation {
  id: string
  title: string
  description: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  status: 'pending' | 'in_progress' | 'completed'
  feedbackType: 'text' | 'audio' | null
  feedbackContent: string | null
  createdAt: string
}

interface Question {
  id: string
  question: string
  answer: string | null
  createdAt: string
}

interface Props {
  evaluation: Evaluation
  questions: Question[]
  questionsLimit: number
  questionsCount: number
}

export default function EvaluationDetail({
  evaluation,
  questions,
  questionsLimit,
  questionsCount,
}: Props) {
  const router = useRouter()
  const [newQuestion, setNewQuestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const supabase = createClient()
  const remainingQuestions = questionsLimit - questionsCount

  const statusColors = {
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-300', label: 'Beklemede' },
    in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-300', label: 'İşleniyor' },
    completed: { bg: 'bg-green-500/10', text: 'text-green-300', label: 'Tamamlandı' },
  }

  const statusInfo = statusColors[evaluation.status]

  const handleQuestionSubmit = async () => {
    if (!newQuestion.trim() || remainingQuestions <= 0) return

    setIsSubmitting(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Kullanıcı oturumu bulunamadı')
      }

      const { error } = await supabase
        .from('evaluation_questions')
        .insert({
          evaluation_id: evaluation.id,
          user_id: user.id,
          question: newQuestion.trim(),
          answer: null,
        })

      if (error) throw error

      toast.success('Sorunuz gönderildi!')
      setNewQuestion('')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Soru gönderilemedi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 && isFinite(duration) ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap gap-2 px-4">
        <Link
          href="/my-reviews"
          className="text-slate-400 text-base font-medium leading-normal hover:text-white transition-colors"
        >
          Tüm Değerlendirmelerim
        </Link>
        <span className="text-slate-400 text-base font-medium leading-normal">/</span>
        <span className="text-white text-base font-medium leading-normal">{evaluation.title}</span>
      </div>

      {/* Media Preview */}
      <div className="px-4">
        <div className="relative flex items-center justify-center bg-cover bg-center aspect-video rounded-xl shadow-lg border border-slate-700/50 overflow-hidden">
          {evaluation.mediaType === 'video' ? (
            <>
              <video
                ref={videoRef}
                src={evaluation.mediaUrl}
                className="w-full h-full object-cover"
                controls
              />
            </>
          ) : (
            <Image
              src={evaluation.mediaUrl}
              alt={evaluation.title}
              fill
              className="object-cover"
            />
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="px-4">
        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
          <div className={`size-2 rounded-full ${statusInfo.text.replace('text-', 'bg-')}`}></div>
          {statusInfo.label}
        </div>
      </div>

      {/* Title & Description */}
      <div className="px-4">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
          İlk Mesajın
        </h2>
        <p className="text-slate-300 text-base font-normal leading-normal">
          {evaluation.description || 'Açıklama eklenmemiş.'}
        </p>
      </div>

      <div className="w-full h-px bg-slate-700/30 my-4"></div>

      {/* Feedback Section */}
      <div className="px-4">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
          Değerlendirme
        </h2>

        {evaluation.status === 'completed' && evaluation.feedbackContent ? (
          <>
            {evaluation.feedbackType === 'audio' ? (
              <div className="flex items-center gap-4 rounded-xl bg-[#161a25]/60 border border-slate-700/50 p-4 backdrop-blur-sm">
                <audio
                  ref={audioRef}
                  src={evaluation.feedbackContent}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onLoadedMetadata={handleAudioLoadedMetadata}
                  onDurationChange={handleAudioLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="hidden"
                  preload="metadata"
                />
                <button
                  onClick={handleAudioPlay}
                  className="flex shrink-0 items-center justify-center rounded-full size-12 bg-[#A94438] text-white hover:bg-[#b94848] transition-colors"
                >
                  <span className="material-symbols-outlined text-3xl">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                <div className="flex flex-1 flex-col justify-center gap-2 min-w-0">
                  <div className="relative h-2 w-full">
                    {/* Background track */}
                    <div className="absolute inset-0 bg-slate-700/50 rounded-full overflow-hidden">
                      {/* Progress fill */}
                      <div
                        className="h-full bg-[#A94438] transition-all duration-100"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    
                    {/* Scrubber */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 size-3.5 rounded-full bg-white shadow-lg transition-all duration-100"
                      style={{ left: `${progressPercent}%`, transform: 'translate(-50%, -50%)' }}
                    ></div>
                    
                    {/* Invisible input for seeking */}
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      step="0.1"
                      value={currentTime}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 tabular-nums">{formatTime(currentTime)}</span>
                    <span className="text-xs text-slate-400 tabular-nums">{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-[#161a25]/60 border border-slate-700/50 p-4 backdrop-blur-sm">
                <p className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
                  {evaluation.feedbackContent}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl bg-[#161a25]/60 border border-slate-700/50 p-6 text-center backdrop-blur-sm">
            <span className="material-symbols-outlined text-5xl text-slate-500 mb-2">pending</span>
            <p className="text-slate-400 text-base">
              {evaluation.status === 'in_progress'
                ? 'Değerlendirme işleniyor...'
                : 'Değerlendirme bekleniyor...'}
            </p>
          </div>
        )}
      </div>

      <div className="w-full h-px bg-slate-700/30 my-4"></div>

      {/* Questions Section */}
      <div className="px-4">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
          Ek Sorular
        </h2>
        <p className="text-sm font-medium text-slate-400 pb-4">
          Kalan soru hakkı:{' '}
          <span className="text-white font-bold">{remainingQuestions}</span> / {questionsLimit}
        </p>

        {remainingQuestions > 0 && evaluation.status === 'completed' && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuestionSubmit()}
              placeholder="Yeni bir soru sor..."
              className="flex-1 rounded-xl border-none bg-[#161a25]/60 border border-slate-700/50 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-[#A94438] backdrop-blur-sm"
              disabled={isSubmitting}
            />
            <button
              onClick={handleQuestionSubmit}
              disabled={isSubmitting || !newQuestion.trim()}
              className="rounded-xl bg-[#A94438] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#b94848] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Sor'}
            </button>
          </div>
        )}

        {questions.length > 0 ? (
          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-slate-400">Soru:</p>
                  <p className="rounded-xl bg-[#161a25]/40 border border-slate-700/30 p-4 text-white backdrop-blur-sm">
                    {q.question}
                  </p>
                </div>
                {q.answer ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-slate-400">Cevap:</p>
                    <p className="rounded-xl bg-[#161a25]/60 border border-slate-700/50 p-4 text-white backdrop-blur-sm">
                      {q.answer}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <p className="text-sm italic">Cevap bekleniyor...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">Henüz soru sorulmamış.</p>
          </div>
        )}
      </div>
    </div>
  )
}

