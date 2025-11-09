'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface SignupFormProps {
  googleOAuthEnabled: boolean
  facebookOAuthEnabled: boolean
  translations: any
}

export default function SignupForm({ googleOAuthEnabled, facebookOAuthEnabled, translations }: SignupFormProps) {
  const t = translations.auth.signup
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast.success(t.success)
      router.push('/auth/verify-email')
    } catch (error: any) {
      toast.error(error.message || t.error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || t.googleError)
    }
  }

  const handleFacebookSignup = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || t.facebookError)
    }
  }

  return (
    <div className="space-y-10">
      {/* Başlık */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold leading-tight">
          {t.title}
        </h1>
        <p className="text-gray-400 text-lg">
          {t.subtitle}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-3">
            {t.email}
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={t.emailPlaceholder}
            className="w-full px-4 py-4 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 text-base"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-3">
            {t.password}
          </label>
          <input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder={t.passwordPlaceholder}
            className="w-full px-4 py-4 bg-[#252837] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 text-base"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-semibold text-base transition-colors"
        >
          {loading ? t.submitting : t.submit}
        </button>
      </form>

      {/* Divider - Sadece en az bir OAuth aktifse göster */}
      {(googleOAuthEnabled || facebookOAuthEnabled) && (
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#1a1d2e] text-gray-500">{t.or}</span>
          </div>
        </div>
      )}

      {/* OAuth Buttons */}
      {(googleOAuthEnabled || facebookOAuthEnabled) && (
        <div className="space-y-4">
          {googleOAuthEnabled && (
            <button
              onClick={handleGoogleSignup}
              type="button"
              className="w-full py-3 bg-[#252837] hover:bg-[#2d3142] border border-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t.googleButton}
            </button>
          )}

          {facebookOAuthEnabled && (
            <button
              onClick={handleFacebookSignup}
              type="button"
              className="w-full py-3 bg-[#252837] hover:bg-[#2d3142] border border-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {t.facebookButton}
            </button>
          )}
        </div>
      )}

      {/* Login Link */}
      <p className="text-center text-gray-400">
        {t.hasAccount}{' '}
        <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 font-medium">
          {t.loginLink}
        </Link>
      </p>
    </div>
  )
}

