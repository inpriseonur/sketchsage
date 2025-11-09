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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Reviews</h1>
          <p className="text-sm text-white/60 mt-1">
            Track your artwork feedback and progress
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
            <span className="text-sm text-white/60">Credits Left</span>
            <span className="text-2xl font-bold text-[#D41111]">{credits}</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D41111] to-[#9F2241] text-white font-semibold rounded-lg hover:brightness-110 transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Get a New Review</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search reviews by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D41111] focus:border-transparent transition-all"
        />
      </div>

      {/* Reviews List or Empty State */}
      {filteredReviews.length === 0 ? (
        searchQuery ? (
          <div className="text-center py-12">
            <p className="text-white/60">No reviews found matching "{searchQuery}"</p>
          </div>
        ) : (
          <EmptyState onGetStarted={() => setIsModalOpen(true)} />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* New Review Modal */}
      <NewReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

