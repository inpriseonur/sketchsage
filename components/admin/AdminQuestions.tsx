'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

interface Question {
  id: string
  question: string
  answer: string | null
  createdAt: string
}

interface Props {
  evaluationId: string
  questions: Question[]
}

export default function AdminQuestions({ evaluationId, questions }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submittingId, setSubmittingId] = useState<string | null>(null)

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleAnswerSubmit = async (questionId: string) => {
    const answer = answers[questionId]
    if (!answer?.trim()) {
      toast.error('Lütfen cevap girin')
      return
    }

    setSubmittingId(questionId)
    try {
      const { error } = await supabase
        .from('evaluation_questions')
        .update({ answer: answer.trim() })
        .eq('id', questionId)

      if (error) throw error

      toast.success('Cevap gönderildi!')
      setAnswers((prev) => {
        const newAnswers = { ...prev }
        delete newAnswers[questionId]
        return newAnswers
      })
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Cevap gönderilemedi')
    } finally {
      setSubmittingId(null)
    }
  }

  if (questions.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-slate-700/50 bg-[#161a25]/60 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        Kullanıcı Soruları ({questions.length})
      </h2>

      <div className="space-y-6">
        {questions.map((q) => (
          <div
            key={q.id}
            className="rounded-lg border border-slate-700/50 bg-[#0f1119] p-4"
          >
            {/* Question */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-slate-400">Soru:</p>
                <p className="text-xs text-slate-600">
                  {new Date(q.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
              <p className="text-white">{q.question}</p>
            </div>

            {/* Answer Section */}
            {q.answer ? (
              <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-4">
                <p className="text-sm font-medium text-green-400 mb-2">Cevabınız:</p>
                <p className="text-slate-200">{q.answer}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-400">
                  Cevap Girin:
                </label>
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  rows={4}
                  placeholder="Kullanıcının sorusuna detaylı cevap yazın..."
                  className="w-full rounded-lg border border-slate-700 bg-[#161a25] px-4 py-3 text-white placeholder-slate-500 focus:border-[#A94438] focus:ring-1 focus:ring-[#A94438]"
                  disabled={submittingId === q.id}
                />
                <button
                  onClick={() => handleAnswerSubmit(q.id)}
                  disabled={submittingId === q.id || !answers[q.id]?.trim()}
                  className="rounded-lg bg-[#A94438] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#b94848] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingId === q.id ? 'Gönderiliyor...' : 'Cevabı Gönder'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

