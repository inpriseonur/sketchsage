'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface HeroContent {
  title: string
  subtitle: string
  button_text: string
  media_url?: string
}

interface HeroData {
  id: string
  language: string
  content: HeroContent
}

export default function HeroEditor({ data }: { data: HeroData[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'tr' | 'en'>('tr')

  const trData = data.find((d) => d.language === 'tr')
  const enData = data.find((d) => d.language === 'en')

  const [trForm, setTrForm] = useState<HeroContent>(
    trData?.content || { title: '', subtitle: '', button_text: '', media_url: '' }
  )
  const [enForm, setEnForm] = useState<HeroContent>(
    enData?.content || { title: '', subtitle: '', button_text: '', media_url: '' }
  )

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/landing/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tr: { id: trData?.id, content: trForm },
          en: { id: enData?.id, content: enForm },
        }),
      })

      if (res.ok) {
        alert('✅ Hero içeriği güncellendi!')
        router.refresh()
      } else {
        throw new Error('Kayıt başarısız')
      }
    } catch (error) {
      alert('❌ Hata: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const currentForm = activeTab === 'tr' ? trForm : enForm
  const setCurrentForm = activeTab === 'tr' ? setTrForm : setEnForm

  return (
    <div className="space-y-6">
      {/* Dil Seçimi */}
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('tr')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'tr'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🇹🇷 Türkçe
        </button>
        <button
          onClick={() => setActiveTab('en')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'en'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🇬🇧 English
        </button>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Başlık */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ana Başlık
          </label>
          <input
            type="text"
            value={currentForm.title}
            onChange={(e) =>
              setCurrentForm({ ...currentForm, title: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#0f1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Expert Feedback for Your Sketches"
          />
        </div>

        {/* Alt Başlık */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Alt Başlık / Açıklama
          </label>
          <textarea
            value={currentForm.subtitle}
            onChange={(e) =>
              setCurrentForm({ ...currentForm, subtitle: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-3 bg-[#0f1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Elevate your art with professional critiques..."
          />
        </div>

        {/* Buton Yazısı */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            CTA Buton Yazısı
          </label>
          <input
            type="text"
            value={currentForm.button_text}
            onChange={(e) =>
              setCurrentForm({ ...currentForm, button_text: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#0f1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Get Feedback Now"
          />
        </div>

        {/* Hero Görseli/Videosu URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hero Medya URL (Görsel veya Video)
          </label>
          <input
            type="url"
            value={currentForm.media_url || ''}
            onChange={(e) =>
              setCurrentForm({ ...currentForm, media_url: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#0f1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Şimdilik doğrudan URL girebilirsiniz. İleride dosya yükleme özelliği eklenecek.
          </p>
        </div>

        {/* Önizleme */}
        {currentForm.media_url && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Medya Önizleme
            </label>
            <div className="bg-[#0f1117] border border-gray-700 rounded-lg p-4">
              <img
                src={currentForm.media_url}
                alt="Preview"
                className="max-w-md rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Kaydet Butonu */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-700">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          İptal
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
        >
          {loading ? 'Kaydediliyor...' : '💾 Kaydet'}
        </button>
      </div>
    </div>
  )
}

