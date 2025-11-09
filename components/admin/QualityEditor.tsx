'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type QualityItem = {
  image_url: string
  alt: string
  order: number
}

type QualityContent = {
  items: QualityItem[]
}

export default function QualityEditor({
  enContent,
  trContent,
}: {
  enContent?: QualityContent
  trContent?: QualityContent
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'en' | 'tr'>('en')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [enItems, setEnItems] = useState<QualityItem[]>(
    enContent?.items || []
  )
  const [trItems, setTrItems] = useState<QualityItem[]>(
    trContent?.items || []
  )

  const currentItems = activeTab === 'en' ? enItems : trItems
  const setCurrentItems = activeTab === 'en' ? setEnItems : setTrItems

  const addItem = () => {
    const newItem: QualityItem = {
      image_url: '',
      alt: '',
      order: currentItems.length + 1,
    }
    setCurrentItems([...currentItems, newItem])
  }

  const updateItem = (index: number, field: keyof QualityItem, value: string | number) => {
    const updated = [...currentItems]
    updated[index] = { ...updated[index], [field]: value }
    setCurrentItems(updated)
  }

  const removeItem = (index: number) => {
    const updated = currentItems.filter((_, i) => i !== index)
    // Re-order
    updated.forEach((item, i) => {
      item.order = i + 1
    })
    setCurrentItems(updated)
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === currentItems.length - 1)
    ) {
      return
    }

    const updated = [...currentItems]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    
    // Update orders
    updated.forEach((item, i) => {
      item.order = i + 1
    })
    
    setCurrentItems(updated)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/admin/landing/quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          en: { items: enItems },
          tr: { items: trItems },
        }),
      })

      if (!res.ok) throw new Error('Kaydetme başarısız')

      toast.success('Quality gallery güncellendi')
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

      {/* Items */}
      <div className="space-y-4">
        {currentItems.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                {item.image_url ? (
                  <div
                    className="w-32 h-40 bg-center bg-cover rounded-lg"
                    style={{ backgroundImage: `url(${item.image_url})` }}
                  />
                ) : (
                  <div className="w-32 h-40 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Fields */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Görsel URL
                  </label>
                  <input
                    type="text"
                    value={item.image_url}
                    onChange={(e) => updateItem(index, 'image_url', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D41111]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Alt Text (Açıklama)
                  </label>
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(e) => updateItem(index, 'alt', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D41111]"
                    placeholder="Portrait sketch"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Yukarı taşı"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === currentItems.length - 1}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Aşağı taşı"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                  title="Sil"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Button */}
        <button
          onClick={addItem}
          className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl text-white/60 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Görsel Ekle
        </button>
      </div>

      {/* Save Button */}
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

