'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type Step = {
  title: string
  description: string
  icon: string
  order: number
}

type HowItWorksContent = {
  steps: Step[]
}

const ICON_OPTIONS = [
  { value: 'upload', label: 'Upload (Yükleme)' },
  { value: 'clipboard', label: 'Clipboard (Pano)' },
  { value: 'lightbulb', label: 'Lightbulb (Ampul)' },
]

export default function HowItWorksEditor({
  enContent,
  trContent,
}: {
  enContent?: HowItWorksContent
  trContent?: HowItWorksContent
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'en' | 'tr'>('en')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [enSteps, setEnSteps] = useState<Step[]>(enContent?.steps || [])
  const [trSteps, setTrSteps] = useState<Step[]>(trContent?.steps || [])

  const currentSteps = activeTab === 'en' ? enSteps : trSteps
  const setCurrentSteps = activeTab === 'en' ? setEnSteps : setTrSteps

  const addStep = () => {
    const newStep: Step = {
      title: '',
      description: '',
      icon: 'lightbulb',
      order: currentSteps.length + 1,
    }
    setCurrentSteps([...currentSteps, newStep])
  }

  const updateStep = (index: number, field: keyof Step, value: string | number) => {
    const updated = [...currentSteps]
    updated[index] = { ...updated[index], [field]: value }
    setCurrentSteps(updated)
  }

  const removeStep = (index: number) => {
    const updated = currentSteps.filter((_, i) => i !== index)
    updated.forEach((step, i) => {
      step.order = i + 1
    })
    setCurrentSteps(updated)
  }

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === currentSteps.length - 1)
    ) {
      return
    }

    const updated = [...currentSteps]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    
    updated.forEach((step, i) => {
      step.order = i + 1
    })
    
    setCurrentSteps(updated)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/admin/landing/how-it-works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          en: { steps: enSteps },
          tr: { steps: trSteps },
        }),
      })

      if (!res.ok) throw new Error('Kaydetme başarısız')

      toast.success('How It Works güncellendi')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab('en')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'en'
              ? 'border-b-2 border-[#D41111] text-white'
              : 'text-white/60 hover:text-white'
          }`}
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => setActiveTab('tr')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'tr'
              ? 'border-b-2 border-[#D41111] text-white'
              : 'text-white/60 hover:text-white'
          }`}
        >
          🇹🇷 Türkçe
        </button>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {currentSteps.map((step, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#D41111]/20 rounded-lg flex items-center justify-center text-2xl font-bold text-white">
                {step.order}
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => updateStep(index, 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D41111]"
                      placeholder="Send Your Sketch"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      İkon
                    </label>
                    <select
                      value={step.icon}
                      onChange={(e) => updateStep(index, 'icon', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D41111]"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D41111] resize-none"
                    placeholder="Upload your artwork easily through our secure portal."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => moveStep(index, 'up')}
                  disabled={index === 0}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveStep(index, 'down')}
                  disabled={index === currentSteps.length - 1}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => removeStep(index)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addStep}
          className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl text-white/60 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Adım Ekle
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#D41111] text-white font-semibold hover:bg-[#B00E0E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kaydediliyor...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Kaydet
            </>
          )}
        </button>
      </div>
    </div>
  )
}

