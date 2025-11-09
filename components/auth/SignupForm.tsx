'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useLocale } from '@/lib/i18n/use-locale'

interface SignupFormProps {
  googleOAuthEnabled: boolean
  facebookOAuthEnabled: boolean
  translations: any
}

export default function SignupForm({ googleOAuthEnabled, facebookOAuthEnabled, translations }: SignupFormProps) {
  const t = translations.auth.signup
  const router = useRouter()
  const locale = useLocale()
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
      router.push(`/${locale}/auth/verify-email`)
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
    <div className="flex flex-col gap-6">
      {/* Başlık */}
      <div className="flex flex-col gap-2">
        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
          {t.title}
        </h1>
        <p className="text-slate-400 text-base font-normal leading-normal">
          {t.subtitle}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-white text-base font-medium leading-normal pb-2">{t.email}</p>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={t.emailPlaceholder}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-slate-700 bg-slate-800/50 focus:border-blue-500 h-12 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal"
          />
        </label>

        {/* Password */}
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-white text-base font-medium leading-normal pb-2">{t.password}</p>
          <input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder={t.passwordPlaceholder}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-slate-700 bg-slate-800/50 focus:border-blue-500 h-12 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal"
          />
        </label>

        {/* Submit Button - Landing page butonu gibi */}
        <button
          type="submit"
          disabled={loading}
          className="flex mt-2 w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#9F2241] hover:bg-[#A45D40] disabled:bg-[#7a1a32] disabled:cursor-not-allowed text-white text-base font-bold leading-normal tracking-[0.015em] focus:outline-none focus:ring-2 focus:ring-[#9F2241]/50 transition-all"
        >
          <span className="truncate">{loading ? t.submitting : t.submit}</span>
        </button>

        {/* Terms and Privacy Policy */}
        <p className="text-center text-xs text-slate-400">
          {t.termsText || 'By creating an account, you agree to our '}
          {t.termsLink && (
            <>
              <Link href={`/${locale}/terms`} className="underline hover:text-blue-400 transition-colors">
                {t.termsLink}
              </Link>
              {' and '}
            </>
          )}
          {t.privacyLink && (
            <Link href={`/${locale}/privacy`} className="underline hover:text-blue-400 transition-colors">
              {t.privacyLink}
            </Link>
          )}
        </p>
      </form>

      {/* Divider - Sadece en az bir OAuth aktifse göster */}
      {(googleOAuthEnabled || facebookOAuthEnabled) && (
        <div className="flex items-center gap-4">
          <hr className="flex-1 border-t border-slate-700"/>
          <p className="text-slate-400 text-sm">{t.or}</p>
          <hr className="flex-1 border-t border-slate-700"/>
        </div>
      )}

      {/* OAuth Buttons */}
      {(googleOAuthEnabled || facebookOAuthEnabled) && (
        <div className="flex flex-col gap-4">
          {googleOAuthEnabled && (
            <button
              onClick={handleGoogleSignup}
              type="button"
              className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5777 12.2577C22.5777 11.4177 22.5077 10.6077 22.3877 9.81773H12.2477V14.4577H18.1677C17.8977 15.8677 17.0677 17.0977 15.8477 17.9177V20.5177H19.5677C21.5077 18.7377 22.5777 15.8277 22.5777 12.2577Z" fill="#4285F4"></path>
                <path d="M12.2477 23.0077C15.2577 23.0077 17.7677 22.0177 19.5677 20.5177L15.8477 17.9177C14.8577 18.5977 13.6677 19.0177 12.2477 19.0177C9.52773 19.0177 7.21773 17.2277 6.37773 14.8177H2.54773V17.5077C4.31773 20.7677 7.97773 23.0077 12.2477 23.0077Z" fill="#34A853"></path>
                <path d="M6.3777 14.8177C6.1477 14.1277 6.0177 13.3877 6.0177 12.6277C6.0177 11.8677 6.1477 11.1277 6.3777 10.4377V7.7477H2.5477C1.8277 9.1277 1.4177 10.8277 1.4177 12.6277C1.4177 14.4277 1.8277 16.1277 2.5477 17.5077L6.3777 14.8177Z" fill="#FBBC05"></path>
                <path d="M12.2477 6.23773C13.7377 6.23773 15.0277 6.75773 16.1077 7.77773L19.6477 4.31773C17.7577 2.55773 15.2577 1.24773 12.2477 1.24773C7.97773 1.24773 4.31773 3.48773 2.54773 6.74773L6.37773 9.43773C7.21773 7.02773 9.52773 5.23773 12.2477 5.23773V6.23773Z" fill="#EA4335"></path>
              </svg>
              <span className="truncate">{t.googleButton}</span>
            </button>
          )}

          {facebookOAuthEnabled && (
            <button
              onClick={handleFacebookSignup}
              type="button"
              className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
              </svg>
              <span className="truncate">{t.facebookButton}</span>
            </button>
          )}
        </div>
      )}

      {/* Login Link */}
      <p className="text-center text-slate-400 text-sm">
        {t.hasAccount}{' '}
        <Link href={`/${locale}/auth/login`} className="text-blue-500 hover:text-blue-400 font-medium underline">
          {t.loginLink}
        </Link>
      </p>
    </div>
  )
}

