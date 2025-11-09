'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import ReviewCard from './ReviewCard'
import NewReviewModal from './NewReviewModal'
import EmptyState from './EmptyState'

type ReviewType = 'image' | 'video'
type ReviewStatus = 'pending' | 'in_progress' | 'completed'
type FeedbackType = 'text' | 'audio' | null

interface Review {
  id: string
  title: string
  type: ReviewType
  submittedAt: string
  questions: { answered: number; total: number }
  status: ReviewStatus
  thumbnail: string
  feedbackType: FeedbackType
}

// Sort: completed first, then by date descending
const sortReviews = (reviews: Review[]) => {
  return [...reviews].sort((a, b) => {
    // Completed items first
    if (a.status === 'completed' && b.status !== 'completed') return -1
    if (a.status !== 'completed' && b.status === 'completed') return 1
    
    // Then by date descending
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  })
}

export default function MyReviewsClient({ 
  credits, 
  initialReviews 
}: { 
  credits: number
  initialReviews: Review[]
}) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    const filtered = initialReviews.filter((review) =>
      review.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return sortReviews(filtered)
  }, [initialReviews, searchQuery])

  const handleReviewSuccess = () => {
    // Refresh the page to get updated reviews list and credits
    router.refresh()
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-50">
          My Reviews
        </h1>
        <div className="flex items-center gap-4">
          {/* Credits Box */}
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-700/50 bg-[#161a25]/60 px-5 py-4 text-center backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Credits Left
            </p>
            <p className="text-2xl font-bold leading-tight text-[#E29D83]">
              {credits}
            </p>
          </div>

          {/* Get Review Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-brush-stroke flex h-12 min-w-[120px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-transform hover:scale-105"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="truncate hidden sm:inline">Get a New Review</span>
            <span className="truncate sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div>
        <label className="flex h-12 w-full min-w-40 flex-col">
          <div className="flex h-full w-full flex-1 items-stretch rounded-full border border-slate-700/50 bg-[#161a25]/60 backdrop-blur-sm">
            <div className="flex items-center justify-center rounded-l-full border-r border-slate-700/50 px-4 text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              placeholder="Search reviews by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-full flex-1 rounded-r-full border-0 bg-transparent px-4 text-base text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </label>
      </div>

      {/* Reviews List or Empty State */}
      {filteredReviews.length === 0 ? (
        searchQuery ? (
          <div className="py-12 text-center">
            <p className="text-slate-400">No reviews found matching "{searchQuery}"</p>
          </div>
        ) : (
          <EmptyState onGetStarted={() => setIsModalOpen(true)} />
        )
      ) : (
        <div className="flex flex-col gap-6">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* New Review Modal */}
      <NewReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        userCredits={credits}
        onSuccess={handleReviewSuccess}
      />
    </div>
  )
}
