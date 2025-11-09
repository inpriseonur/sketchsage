import Link from 'next/link'
import { getTranslations, getLocaleFromParams } from '@/lib/i18n'

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeTyped = getLocaleFromParams({ locale })
  const t = await getTranslations({ locale })
  
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold">{t.auth.verifyEmail.title}</h1>
        <p className="text-gray-400">
          {t.auth.verifyEmail.message}
        </p>
      </div>

      <div className="bg-[#252837] border border-gray-700 rounded-lg p-6 space-y-4">
        <h2 className="font-semibold">{t.auth.verifyEmail.notReceived}</h2>
        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
          <li>{t.auth.verifyEmail.checkSpam}</li>
          <li>{t.auth.verifyEmail.checkEmail}</li>
          <li>{t.auth.verifyEmail.wait}</li>
        </ul>
      </div>

      <Link
        href={`/${locale}/auth/login`}
        className="block w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors text-center"
      >
        {t.auth.verifyEmail.backToLogin}
      </Link>
    </div>
  )
}

