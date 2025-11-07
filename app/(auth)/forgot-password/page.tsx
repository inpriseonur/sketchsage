'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setSubmitted(true)
      toast.success('Şifre sıfırlama linki gönderildi! Email\'inizi kontrol edin.')
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Email Gönderildi</h1>
          <p className="text-gray-400">
            <span className="font-medium text-white">{email}</span> adresine şifre sıfırlama linki gönderdik.
            Lütfen email'inizi kontrol edin.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="block w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors text-center"
          >
            Giriş Sayfasına Dön
          </Link>

          <button
            onClick={() => setSubmitted(false)}
            className="w-full text-gray-400 hover:text-white text-sm"
          >
            Email'i tekrar gönder
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>

      {/* Başlık */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">
          Forgot Password?
        </h1>
        <p className="text-gray-400 text-lg">
          No worries! Enter your email and we'll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center text-gray-400">
        Remember your password?{' '}
        <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 font-medium">
          Log In
        </Link>
      </p>
    </div>
  )
}

