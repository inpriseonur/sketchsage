'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CallbackHandler() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Pending package var mı kontrol et
        const pendingPackageId = sessionStorage.getItem('pendingPackageId')
        
        if (pendingPackageId) {
          sessionStorage.removeItem('pendingPackageId')
          
          // Checkout session oluştur
          const response = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              packageId: pendingPackageId,
            }),
          })

          if (response.ok) {
            const { url } = await response.json()
            if (url) {
              window.location.href = url
              return
            }
          } else {
            toast.error('Failed to start checkout, redirecting to reviews...')
          }
        }

        // Pending package yoksa veya hata olursa my-reviews'a yönlendir
        router.push('/my-reviews')
      } catch (error) {
        console.error('Callback handler error:', error)
        toast.error('An error occurred, redirecting...')
        router.push('/my-reviews')
      } finally {
        setChecking(false)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-white">Yönlendiriliyor...</p>
      </div>
    </div>
  )
}

