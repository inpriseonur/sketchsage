import Link from 'next/link'

type ReviewStatus = 'pending' | 'in_progress' | 'completed'
type ReviewType = 'image' | 'video'
type FeedbackType = 'text' | 'audio'

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

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-500/20 text-yellow-500',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-blue-500/20 text-blue-500',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-500/20 text-green-500',
  },
}

export default function ReviewCard({ review }: { review: Review }) {
  const statusInfo = statusConfig[review.status]

  return (
    <Link
      href={`/my-reviews/${review.id}`}
      className="block bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all duration-200 hover:border-white/20"
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-white/5">
          <img
            src={review.thumbnail}
            alt={review.title}
            className="w-full h-full object-cover"
          />
          {review.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <svg
                className="w-10 h-10 text-white drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1 truncate">
              {review.title}
            </h3>
            <p className="text-xs text-white/60 mb-2">
              Submitted: {new Date(review.submittedAt).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {statusInfo.label}
            </span>

            {/* Questions */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-white/80">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {review.questions.answered}/{review.questions.total}
            </span>

            {/* Feedback Type */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-white/80">
              {review.feedbackType === 'audio' ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  Audio
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Text
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

