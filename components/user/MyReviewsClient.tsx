'use client'

import { useState, useMemo } from 'react'
import ReviewCard from './ReviewCard'
import NewReviewModal from './NewReviewModal'
import EmptyState from './EmptyState'

// Mock data - will be replaced with real data later
const mockReviews = [
  {
    id: '1',
    title: 'Abstract Flow Study',
    type: 'image' as const,
    submittedAt: '2024-05-24',
    questions: { answered: 2, total: 2 },
    status: 'completed' as const,
    thumbnail: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=300&h=300&fit=crop',
    feedbackType: 'text' as const,
  },
  {
    id: '2',
    title: 'Character Walk Cycle',
    type: 'video' as const,
    submittedAt: '2024-05-30',
    questions: { answered: 0, total: 2 },
    status: 'in_progress' as const,
    thumbnail: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=300&fit=crop',
    feedbackType: 'audio' as const,
  },
  {
    id: '3',
    title: 'Portrait Sketch',
    type: 'image' as const,
    submittedAt: '2024-06-02',
    questions: { answered: 0, total: 2 },
    status: 'pending' as const,
    thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=300&fit=crop',
    feedbackType: 'text' as const,
  },
  {
    id: '4',
    title: 'Landscape Oil Painting',
    type: 'image' as const,
    submittedAt: '2024-05-15',
    questions: { answered: 2, total: 2 },
    status: 'completed' as const,
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop',
    feedbackType: 'audio' as const,
  },
]

// Sort: completed first, then by date descending
const sortReviews = (reviews: typeof mockReviews) => {
  return [...reviews].sort((a, b) => {
    // Completed items first
    if (a.status === 'completed' && b.status !== 'completed') return -1
    if (a.status !== 'completed' && b.status === 'completed') return 1
    
    // Then by date descending
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  })
}

export default function MyReviewsClient({ credits }: { credits: number }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    const filtered = mockReviews.filter((review) =>
      review.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return sortReviews(filtered)
  }, [searchQuery])

  return (
    <div className="textured-bg flex-1 overflow-y-auto p-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-50">
            My Reviews
          </h1>
          <div className="flex items-center gap-4">
            {/* Credits Box */}
            <div className="flex flex-col gap-2 rounded-lg border border-slate-700/50 bg-[#161a25]/60 p-4 text-center backdrop-blur-sm">
              <p className="text-base font-medium leading-normal text-slate-200">
                Credits Left
              </p>
              <p className="text-2xl font-bold leading-tight tracking-light text-[#E29D83]">
                {credits}
              </p>
            </div>

            {/* Get Review Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-brush-stroke flex h-12 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-transform hover:scale-105"
            >
              <span className="material-symbols-outlined">add</span>
              <span className="truncate hidden sm:inline">Get a New Review</span>
              <span className="truncate sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <label className="flex h-12 w-full min-w-40 flex-col">
            <div className="flex h-full w-full flex-1 items-stretch rounded-lg">
              <div className="flex items-center justify-center rounded-l-lg border-y border-l border-slate-700/50 bg-[#161a25]/60 pl-4 text-slate-400 backdrop-blur-sm">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                type="text"
                placeholder="Search reviews by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border border-slate-700/50 bg-[#161a25]/60 px-4 pl-2 text-base font-normal leading-normal text-slate-100 placeholder:text-slate-400 focus:border-[#A94438] focus:outline-0 focus:ring-0"
              />
            </div>
          </label>
        </div>

        {/* Reviews List or Empty State */}
        {filteredReviews.length === 0 ? (
          searchQuery ? (
            <div className="text-center py-12">
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
      </div>

      {/* New Review Modal */}
      <NewReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
