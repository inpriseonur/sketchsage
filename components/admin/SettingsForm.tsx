'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface SettingsFormProps {
  initialSettings: {
    default_welcome_credits: string
    max_image_size_mb: string
    max_video_size_mb: string
    questions_per_evaluation: string
    stripe_publishable_key: string
    stripe_secret_key: string
    stripe_webhook_secret: string
    google_oauth_enabled: boolean
    facebook_oauth_enabled: boolean
  }
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState(initialSettings)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update settings')
      }

      toast.success('Ayarlar başarıyla güncellendi!')
    } catch (error: any) {
      toast.error(error.message || 'Ayarlar güncellenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Genel Ayarlar */}
      <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          Genel Ayarlar
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hoş Geldin Kredisi */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hoş Geldin Kredisi
            </label>
            <input
              type="number"
              min="0"
              value={settings.default_welcome_credits}
              onChange={(e) => updateSetting('default_welcome_credits', e.target.value)}
              className="w-full px-4 py-3 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Yeni üyelere verilecek kredi sayısı
            </p>
          </div>

          {/* Maksimum Resim Boyutu */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Resim Boyutu (MB)
            </label>
            <input
              type="number"
              min="1"
              value={settings.max_image_size_mb}
              onChange={(e) => updateSetting('max_image_size_mb', e.target.value)}
              className="w-full px-4 py-3 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kullanıcıların yükleyebileceği maksimum resim boyutu
            </p>
          </div>

          {/* Maksimum Video Boyutu */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Video Boyutu (MB)
            </label>
            <input
              type="number"
              min="1"
              value={settings.max_video_size_mb}
              onChange={(e) => updateSetting('max_video_size_mb', e.target.value)}
              className="w-full px-4 py-3 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="30"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kullanıcıların yükleyebileceği maksimum video boyutu
            </p>
          </div>

          {/* Değerlendirme Başına Soru Sayısı */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Değerlendirme Başına Soru Hakkı
            </label>
            <input
              type="number"
              min="0"
              value={settings.questions_per_evaluation}
              onChange={(e) => updateSetting('questions_per_evaluation', e.target.value)}
              className="w-full px-4 py-3 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Her değerlendirme için kullanıcıya tanınan soru hakkı
            </p>
          </div>
        </div>
      </div>

      {/* Stripe Ayarları */}
      <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">💳</span>
          Stripe Ödeme Ayarları
        </h2>
        
        <div className="space-y-6">
          {/* Stripe Publishable Key */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stripe Publishable Key
            </label>
            <input
              type="text"
              value={settings.stripe_publishable_key}
              onChange={(e) => updateSetting('stripe_publishable_key', e.target.value)}
              className="w-full px-4 py-3 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono text-sm"
              placeholder="pk_test_..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Stripe&apos;dan alınan public anahtarınız (pk_test_... veya pk_live_...)
            </p>
          </div>

          {/* Stripe Secret Key */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stripe Secret Key
            </label>
            <input
              type="password"
              value={settings.stripe_secret_key}
              onChange={(e) => updateSetting('stripe_secret_key', e.target.value)}
              className="w-full px-4 py-3 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono text-sm"
              placeholder="sk_test_..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Stripe&apos;dan alınan gizli anahtarınız (sk_test_... veya sk_live_...)
            </p>
          </div>

          {/* Stripe Webhook Secret */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stripe Webhook Secret
            </label>
            <input
              type="password"
              value={settings.stripe_webhook_secret}
              onChange={(e) => updateSetting('stripe_webhook_secret', e.target.value)}
              className="w-full px-4 py-3 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono text-sm"
              placeholder="whsec_..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Webhook imzası doğrulama için webhook secret (whsec_...)
            </p>
          </div>

          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              <strong>Not:</strong> Stripe ayarlarınızı güncelledikten sonra, uygulamanızı 
              yeniden başlatmanız gerekebilir. Canlı ortamda (production) bu anahtarları 
              environment variables olarak kullanmanız önerilir.
            </p>
          </div>
        </div>
      </div>

      {/* OAuth Ayarları */}
      <div className="bg-[#1a1d2e] border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">🔐</span>
          OAuth Giriş Ayarları
        </h2>
        
        <div className="space-y-4">
          {/* Google OAuth */}
          <div className="flex items-center justify-between p-4 bg-[#252837] rounded-lg">
            <div>
              <h3 className="text-white font-medium mb-1">Google ile Giriş</h3>
              <p className="text-sm text-gray-400">
                Kullanıcıların Google hesaplarıyla giriş yapmasına izin ver
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.google_oauth_enabled}
                onChange={(e) => updateSetting('google_oauth_enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Facebook OAuth */}
          <div className="flex items-center justify-between p-4 bg-[#252837] rounded-lg">
            <div>
              <h3 className="text-white font-medium mb-1">Facebook ile Giriş</h3>
              <p className="text-sm text-gray-400">
                Kullanıcıların Facebook hesaplarıyla giriş yapmasına izin ver
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.facebook_oauth_enabled}
                onChange={(e) => updateSetting('facebook_oauth_enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-300">
              <strong>Not:</strong> OAuth sağlayıcılarını devre dışı bırakmak, 
              kullanıcıların bu yöntemlerle giriş yapmasını engelleyecektir. 
              Mevcut kullanıcıların hesapları etkilenmez.
            </p>
          </div>
        </div>
      </div>

      {/* Kaydet Butonu */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-colors"
        >
          {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </button>
      </div>
    </form>
  )
}

