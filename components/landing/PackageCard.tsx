'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from '@/lib/i18n/client'
import { useLocale } from '@/lib/i18n/use-locale'

interface Package {
  id: string
  name: string
  credits: number
  price_usd: string
  price_try: string
  is_active: boolean
  display_order: number
}

interface PackageCardProps {
  pkg: Package
  isFeatured: boolean
  showDivider: boolean
}

export default function PackageCard({ pkg, isFeatured, showDivider }: PackageCardProps) {
  const t = useTranslations()
  const router = useRouter()
  const locale = useLocale()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
      if (!user) {
        // Package ID'yi session storage'a kaydet
        sessionStorage.setItem('pendingPackageId', pkg.id)
        toast(t.credits.loginRequired)
        router.push(`/${locale}/auth/login`)
        return
      }

      // Checkout session oluştur
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: pkg.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()

      // Stripe checkout sayfasına yönlendir
      if (url) {
        window.location.href = url
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error(error.message || t.credits.checkoutError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {showDivider && <div className="hidden sm:block w-px h-6 bg-white/10" />}
      
      <button
        onClick={handleClick}
        disabled={loading}
        className={`relative flex items-center justify-center gap-4 rounded-lg px-4 py-2 text-center text-white backdrop-blur-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          isFeatured 
            ? 'bg-white/10 border-2 border-[#D8753B]/60 hover:bg-white/15 scale-105 shadow-lg shadow-[#D8753B]/10'
            : 'bg-white/5 hover:bg-white/10'
        }`}
      >
        {isFeatured && (
          <div className="absolute -top-3 -right-3 rotate-12">
            <svg className="text-[#D8753B] drop-shadow-md" fill="currentColor" height="32" width="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </div>
        )}
        {loading ? (
          <>
            <span className="text-sm font-bold">{t.credits.loading}</span>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </>
        ) : (
          <>
            <span className="text-sm font-bold">{pkg.name}</span>
            <span className="font-bold text-[#D8753B]">${pkg.price_usd}</span>
          </>
        )}
      </button>
    </div>
  )
}

