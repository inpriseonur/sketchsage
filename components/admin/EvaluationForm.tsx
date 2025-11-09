'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import AudioRecorder from './AudioRecorder'

interface Props {
  evaluationId: string
  currentStatus: 'pending' | 'in_progress' | 'completed'
  currentFeedbackType: 'text' | 'audio' | null
  currentFeedbackContent: string | null
}

export default function EvaluationForm({
  evaluationId,
  currentStatus,
  currentFeedbackType,
  currentFeedbackContent,
}: Props) {
  const router = useRouter()
  const supabase = createClient()
  
  const [status, setStatus] = useState(currentStatus)
  const [feedbackType, setFeedbackType] = useState<'text' | 'audio'>(
    currentFeedbackType || 'text'
  )
  const [textFeedback, setTextFeedback] = useState(currentFeedbackContent || '')
  const [audioFile, setAudioFile] = useState<File | Blob | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAudioRecordingComplete = (audioBlob: Blob) => {
    setAudioFile(audioBlob)
  }

  const handleSubmit = async () => {
    if (feedbackType === 'text' && !textFeedback.trim()) {
      toast.error('Lütfen yazılı değerlendirme girin')
      return
    }

    if (feedbackType === 'audio' && !audioFile && !currentFeedbackContent) {
      toast.error('Lütfen ses dosyası yükleyin')
      return
    }

    setIsSubmitting(true)

    try {
      let feedbackUrl = currentFeedbackContent

      // Upload audio file if selected
      if (feedbackType === 'audio' && audioFile) {
        // Determine file extension
        let fileExtension = 'webm'
        if (audioFile instanceof File) {
          fileExtension = audioFile.name.split('.').pop() || 'webm'
        }
        
        const fileName = `${evaluationId}_${Date.now()}.${fileExtension}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user')
          .upload(`admin/audio/${fileName}`, audioFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('user')
          .getPublicUrl(uploadData.path)

        feedbackUrl = urlData.publicUrl
      }

      // Update evaluation
      const { error: updateError } = await supabase
        .from('evaluations')
        .update({
          status,
          feedback_type: feedbackType,
          feedback_content: feedbackType === 'text' ? textFeedback : feedbackUrl,
        })
        .eq('id', evaluationId)

      if (updateError) throw updateError

      toast.success('Değerlendirme kaydedildi!')
      router.refresh()
    } catch (error: any) {
      console.error('Submit error:', error)
      toast.error(error.message || 'Değerlendirme kaydedilemedi')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-700/50 bg-[#161a25]/60 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Değerlendirme Yap</h2>

      <div className="space-y-6">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Durum
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full rounded-lg border border-slate-700 bg-[#0f1119] px-4 py-2 text-white focus:border-[#A94438] focus:ring-1 focus:ring-[#A94438]"
          >
            <option value="pending">Beklemede</option>
            <option value="in_progress">İşleniyor</option>
            <option value="completed">Tamamlandı</option>
          </select>
        </div>

        {/* Feedback Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Değerlendirme Tipi
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFeedbackType('text')}
              className={`flex-1 rounded-lg border px-4 py-3 transition-colors ${
                feedbackType === 'text'
                  ? 'border-[#A94438] bg-[#A94438]/20 text-white'
                  : 'border-slate-700 bg-[#0f1119] text-slate-400 hover:border-slate-600'
              }`}
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              <p className="mt-1 text-sm font-medium">Yazılı</p>
            </button>
            <button
              type="button"
              onClick={() => setFeedbackType('audio')}
              className={`flex-1 rounded-lg border px-4 py-3 transition-colors ${
                feedbackType === 'audio'
                  ? 'border-[#A94438] bg-[#A94438]/20 text-white'
                  : 'border-slate-700 bg-[#0f1119] text-slate-400 hover:border-slate-600'
              }`}
            >
              <span className="material-symbols-outlined">mic</span>
              <p className="mt-1 text-sm font-medium">Sesli</p>
            </button>
          </div>
        </div>

        {/* Text Feedback */}
        {feedbackType === 'text' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Yazılı Değerlendirme
            </label>
            <textarea
              value={textFeedback}
              onChange={(e) => setTextFeedback(e.target.value)}
              rows={10}
              placeholder="Detaylı değerlendirmenizi buraya yazın..."
              className="w-full rounded-lg border border-slate-700 bg-[#0f1119] px-4 py-3 text-white placeholder-slate-500 focus:border-[#A94438] focus:ring-1 focus:ring-[#A94438]"
            />
            <p className="mt-1 text-xs text-slate-500">
              {textFeedback.length} karakter
            </p>
          </div>
        )}

        {/* Audio Feedback */}
        {feedbackType === 'audio' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sesli Değerlendirme
            </label>
            
            <AudioRecorder 
              onRecordingComplete={handleAudioRecordingComplete}
              currentAudioUrl={currentFeedbackContent}
            />
            
            {audioFile && (
              <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <p className="text-sm">
                    Ses dosyası hazır: {audioFile instanceof File ? audioFile.name : 'Kaydedilen ses'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-[#A94438] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#b94848] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet ve Gönder'}
          </button>
          <button
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-50"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  )
}

