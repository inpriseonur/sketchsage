'use client'

import Link from 'next/link'
import { useTranslations } from '@/lib/i18n/client'
import { useLocale } from '@/lib/i18n/use-locale'

type ReviewStatus = 'pending' | 'in_progress' | 'completed'
type ReviewType = 'image' | 'video'
type FeedbackType = 'text' | 'audio' | null

type Review = {
  id: string
  title: string
  type: ReviewType
  submittedAt: string
  questions: {
    answered: number
    total: number
  }
  status: ReviewStatus
  thumbnail: string
  feedbackType: FeedbackType
}

export default function ReviewCard({ review }: { review: Review }) {
  const t = useTranslations()
  const locale = useLocale()
  
  const statusConfig = {
    pending: {
      label: t.myReviews.status.pending,
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-300',
      dotColor: 'bg-yellow-400',
    },
    in_progress: {
      label: t.myReviews.status.inProgress,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-300',
      dotColor: 'bg-blue-400',
    },
    completed: {
      label: t.myReviews.status.completed,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-300',
      dotColor: 'bg-green-400',
    },
  }
  
  const statusInfo = statusConfig[review.status]

  return (
    <Link
      href={`/${locale}/my-reviews/${review.id}`}
      className="flex flex-col gap-4 rounded-lg border border-slate-700/50 bg-[#161a25]/60 p-4 backdrop-blur-sm transition-shadow hover:shadow-2xl hover:shadow-black/20 md:flex-row md:items-center"
    >
      {/* Thumbnail */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded md:h-24 md:w-24">
        <img
          src={review.thumbnail}
          alt={review.title}
          className="h-full w-full object-cover"
        />
        {review.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="material-symbols-outlined text-4xl text-white">
              play_circle
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex flex-col">
          <p className="font-semibold text-slate-100">{review.title}</p>
          <p className="text-sm text-slate-400">
            {t.myReviews.submitted}: {new Date(review.submittedAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Feedback Type & Questions */}
        <div className="flex items-center gap-4">
          {/* Feedback Type Icons */}
          {review.feedbackType === 'audio' && (
            <span 
              className="material-symbols-outlined text-slate-400" 
              title="Audio Feedback"
            >
              graphic_eq
            </span>
          )}
          {review.feedbackType === 'text' && (
            <span 
              className="material-symbols-outlined text-slate-400" 
              title="Text Feedback"
            >
              chat_bubble
            </span>
          )}

          <div className="h-6 w-px bg-slate-700/50"></div>

          {/* Questions */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="material-symbols-outlined text-base">help</span>
            <span>{t.myReviews.questionsAnswered.replace('{answered}', review.questions.answered.toString()).replace('{total}', review.questions.total.toString())}</span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-start md:justify-end">
        <div className={`inline-flex items-center gap-2 rounded-full ${statusInfo.bgColor} px-3 py-1 text-sm font-medium ${statusInfo.textColor}`}>
          <div className={`size-2 rounded-full ${statusInfo.dotColor}`}></div>
          {statusInfo.label}
        </div>
      </div>
    </Link>
  )
}
