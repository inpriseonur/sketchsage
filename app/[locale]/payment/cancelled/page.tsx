import Link from 'next/link'
import { getTranslations, getLocaleFromParams } from '@/lib/i18n'

export default async function PaymentCancelledPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  
  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1d2e] border border-gray-800 rounded-lg p-8 text-center">
        {/* Cancel Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3">
          {t.payment.cancelled.title}
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-8">
          {t.payment.cancelled.message}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href={`/${locale}`}
            className="block w-full py-3 bg-[#A94438] hover:bg-[#b94848] text-white font-semibold rounded-lg transition-colors"
          >
            {t.payment.cancelled.button}
          </Link>
          <Link
            href={`/${locale}`}
            className="block w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-gray-700 rounded-lg transition-colors"
          >
            {t.payment.cancelled.button}
          </Link>
        </div>
      </div>
    </div>
  )
}

