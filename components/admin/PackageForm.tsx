'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type PackageData = {
  id?: string
  name: string
  credits: number
  price_usd: string
  price_try: string
  stripe_price_id_usd: string
  stripe_price_id_try: string
  is_active: boolean
  display_order: number
}

type Props = {
  initialData?: PackageData
}

export default function PackageForm({ initialData }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<PackageData>({
    name: initialData?.name || '',
    credits: initialData?.credits || 1,
    price_usd: initialData?.price_usd || '',
    price_try: initialData?.price_try || '',
    stripe_price_id_usd: initialData?.stripe_price_id_usd || '',
    stripe_price_id_try: initialData?.stripe_price_id_try || '',
    is_active: initialData?.is_active ?? true,
    display_order: initialData?.display_order || 1,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Paket adı gerekli'
    }

    if (formData.credits < 1) {
      newErrors.credits = 'Kredi sayısı en az 1 olmalı'
    }

    const usdPrice = parseFloat(formData.price_usd)
    if (isNaN(usdPrice) || usdPrice <= 0) {
      newErrors.price_usd = 'Geçerli bir USD fiyatı girin'
    }

    const tryPrice = parseFloat(formData.price_try)
    if (isNaN(tryPrice) || tryPrice <= 0) {
      newErrors.price_try = 'Geçerli bir TRY fiyatı girin'
    }

    if (formData.display_order < 1) {
      newErrors.display_order = 'Sıra en az 1 olmalı'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      toast.error('Lütfen tüm alanları doğru şekilde doldurun')
      return
    }

    setIsSubmitting(true)

    try {
      const url = initialData?.id 
        ? `/api/admin/packages/${initialData.id}`
        : '/api/admin/packages'
      
      const method = initialData?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'İşlem başarısız')
      }

      toast.success(initialData?.id ? 'Paket güncellendi' : 'Paket oluşturuldu')
      router.push('/admin/packages')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main Info Card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
          <div className="p-2 bg-[#D41111]/20 rounded-lg">
            <svg className="w-5 h-5 text-[#D41111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Temel Bilgiler
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Package Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
              Paket Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.name ? 'border-red-500' : 'border-white/20'
              } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D41111] focus:border-transparent transition-colors`}
              placeholder="örn: 5 Credits"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* Credits */}
          <div>
            <label htmlFor="credits" className="block text-sm font-medium text-white/90 mb-2">
              Kredi Sayısı <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="credits"
              min="1"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.credits ? 'border-red-500' : 'border-white/20'
              } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D41111] focus:border-transparent transition-colors`}
              placeholder="1"
            />
            {errors.credits && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errors.credits}
              </p>
            )}
          </div>

          {/* Display Order */}
          <div>
            <label htmlFor="display_order" className="block text-sm font-medium text-white/90 mb-2">
              Görüntülenme Sırası <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="display_order"
              min="1"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.display_order ? 'border-red-500' : 'border-white/20'
              } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D41111] focus:border-transparent transition-colors`}
              placeholder="1"
            />
            {errors.display_order && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errors.display_order}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
          <div className="p-2 bg-[#D41111]/20 rounded-lg">
            <svg className="w-5 h-5 text-[#D41111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Fiyatlandırma
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* USD Price */}
          <div>
            <label htmlFor="price_usd" className="block text-sm font-medium text-white/90 mb-2">
              USD Fiyat <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg">$</span>
              <input
                type="number"
                id="price_usd"
                step="0.01"
                min="0"
                value={formData.price_usd}
                onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                  errors.price_usd ? 'border-red-500' : 'border-white/20'
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D41111] focus:border-transparent transition-colors`}
                placeholder="9.99"
              />
            </div>
            {errors.price_usd && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errors.price_usd}
              </p>
            )}
          </div>

          {/* TRY Price */}
          <div>
            <label htmlFor="price_try" className="block text-sm font-medium text-white/90 mb-2">
              TRY Fiyat <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg">₺</span>
              <input
                type="number"
                id="price_try"
                step="0.01"
                min="0"
                value={formData.price_try}
                onChange={(e) => setFormData({ ...formData, price_try: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                  errors.price_try ? 'border-red-500' : 'border-white/20'
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D41111] focus:border-transparent transition-colors`}
                placeholder="349.99"
              />
            </div>
            {errors.price_try && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errors.price_try}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stripe Integration Card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
          <div className="p-2 bg-[#635BFF]/20 rounded-lg">
            <svg className="w-5 h-5 text-[#635BFF]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
            </svg>
          </div>
          Stripe Entegrasyonu
        </h2>
        <p className="text-sm text-white/60 mb-6 ml-12">
          Ödeme işlemleri için Stripe Price ID'lerini girin (opsiyonel)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stripe USD Price ID */}
          <div>
            <label htmlFor="stripe_price_id_usd" className="block text-sm font-medium text-white/90 mb-2">
              Stripe USD Price ID
            </label>
            <input
              type="text"
              id="stripe_price_id_usd"
              value={formData.stripe_price_id_usd}
              onChange={(e) => setFormData({ ...formData, stripe_price_id_usd: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition-colors font-mono text-sm"
              placeholder="price_xxxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          {/* Stripe TRY Price ID */}
          <div>
            <label htmlFor="stripe_price_id_try" className="block text-sm font-medium text-white/90 mb-2">
              Stripe TRY Price ID
            </label>
            <input
              type="text"
              id="stripe_price_id_try"
              value={formData.stripe_price_id_try}
              onChange={(e) => setFormData({ ...formData, stripe_price_id_try: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition-colors font-mono text-sm"
              placeholder="price_xxxxxxxxxxxxxxxxxxxxx"
            />
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
          <div className="p-2 bg-[#D41111]/20 rounded-lg">
            <svg className="w-5 h-5 text-[#D41111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          Durum
        </h2>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#D41111] focus:ring-offset-2 focus:ring-offset-[#221010] ${
              formData.is_active ? 'bg-green-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                formData.is_active ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <div>
            <p className="text-sm font-medium text-white">
              {formData.is_active ? 'Aktif' : 'Devre Dışı'}
            </p>
            <p className="text-xs text-white/60">
              {formData.is_active 
                ? 'Paket kullanıcılara görünür' 
                : 'Paket kullanıcılara görünmez'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/admin/packages')}
          disabled={isSubmitting}
          className="px-6 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          İptal
        </button>
        <button
          type="submit"
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
              {initialData ? 'Güncelle' : 'Oluştur'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

