import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from '@/lib/i18n'
import { redirect } from 'next/navigation'

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  const supabase = await createClient()
  const t = await getTranslations()
  
  const { data: { user } } = await supabase.auth.getUser()

  // Kullanıcının güncel credit bilgisini çek
  let credits = 0
  if (user) {
    const { data: profile } = await supabase
      .from('users_profile')
      .select('credits')
      .eq('id', user.id)
      .single()
    
    credits = profile?.credits || 0
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1d2e] border border-gray-800 rounded-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3">
          {t.payment.success.title}
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-6">
          {t.payment.success.message}
        </p>

        {/* Credits Info */}
        {user && (
          <div className="bg-[#0f1117] border border-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-1">{t.credits.balance}</p>
            <p className="text-4xl font-bold text-white">{credits}</p>
            <p className="text-sm text-gray-500">{t.credits.buy.split(' ')[1]}</p>
          </div>
        )}

        {/* Session ID (for reference) */}
        {session_id && (
          <p className="text-xs text-gray-600 mb-6">
            Transaction ID: {session_id.slice(0, 16)}...
          </p>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/my-reviews"
            className="block w-full py-3 bg-[#A94438] hover:bg-[#b94848] text-white font-semibold rounded-lg transition-colors"
          >
            {t.payment.success.button}
          </Link>
          <Link
            href="/"
            className="block w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-gray-700 rounded-lg transition-colors"
          >
            {t.payment.cancelled.button}
          </Link>
        </div>
      </div>
    </div>
  )
}

