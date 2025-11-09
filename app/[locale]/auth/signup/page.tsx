import { createClient } from '@/lib/supabase/server'
import { getTranslations, getLocaleFromParams } from '@/lib/i18n'
import { generateMetadata as createMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'
import SignupForm from '@/components/auth/SignupForm'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const localeTyped = locale as 'tr' | 'en'
  
  if (localeTyped === 'tr') {
    return createMetadata({
      title: 'Kaydol',
      description: 'SketchSage\'e katılın ve sanatınızı bir üst seviyeye taşıyın. Profesyonel feedback almak için hemen hesap oluşturun.',
      locale: 'tr',
      alternateLocales: ['en'],
      noindex: true,
      path: '/auth/signup',
    })
  }
  
  return createMetadata({
    title: 'Sign Up',
    description: 'Join SketchSage and take your art to the next level. Create an account now to receive professional feedback.',
    locale: 'en',
    alternateLocales: ['tr'],
    noindex: true,
    path: '/auth/signup',
  })
}

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeTyped = getLocaleFromParams({ locale })
  const supabase = await createClient()
  const t = await getTranslations({ locale })
  
  // OAuth ayarlarını server-side çek
  const { data: settings } = await supabase
    .from('system_settings')
    .select('key, value')
    .in('key', ['google_oauth_enabled', 'facebook_oauth_enabled'])

  // Ayarları parse et
  const googleEnabled = settings?.find(s => s.key === 'google_oauth_enabled')?.value ?? true
  const facebookEnabled = settings?.find(s => s.key === 'facebook_oauth_enabled')?.value ?? true

  return (
    <div style={{ backgroundColor: '#221010', minHeight: '100vh', width: '100%' }}>
      {/* Header */}
      <header className="border-b border-b-[#482323]">
        <div className="px-4 sm:px-10 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-4 text-white">
            <div className="w-5 h-5 text-[#D8753B]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">SketchSage</h2>
          </Link>

          {/* Log In Button */}
          <Link
            href={`/${locale}/auth/login`}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="truncate">{t.nav.login}</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Section - Art Style Cards */}
          <div className="lg:col-span-3">
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-full items-stretch p-4 gap-6">
                {/* Charcoal Sketches Card */}
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div 
                    className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl flex flex-col"
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsVmR3qcTgdMiw53dA8kc74W1ab5Y5GAwp8X8K20D3LOersNEsO3TE2MWYfHXNBFCaMQgi6orbpiDCDCFGsFSe3qKz250FJ1AynlA4zusyMybkrdmPc2XLMb11WZ7cqA4ZmqE2snTrIi56WfMmv-GRP7F6fZ2de66eCqw6kQg8fowbjBHE_a6ceOQTKmU02X7c51Zvp75NiLbJEMGtOnksX3107S99c_jLq8_VhCswfNNTl8B_o4_WLXz1loosH0zgShLYGrQ91F8')` }}
                  ></div>
                  <div>
                    <p className="text-white text-base font-medium leading-normal">Charcoal Sketches</p>
                    <p className="text-slate-400 text-sm font-normal leading-normal">Get feedback on your portraiture.</p>
                  </div>
                </div>

                {/* Watercolor Paintings Card */}
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div 
                    className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl flex flex-col"
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDq7Prld5JpYLG-Br35WpC9pIyLtNuM5knwVqf0StJ7PEyniP1oEoIotpn7iVsNUZwZrGIyZQ0JVDehdoMdcXoKEdEFg-JuktLMxXNwWuoWCTU-09J85m0NPbRTJsBCmFGvnqQiYCbSTGyLjpxMcQp4vyS3RkjdSQsuVZHbEYK4-s40-eSsGdzknX9erHe9iIGVHGhVzaCjLtvim-q2FagRF0nwMHoujnx8ruF4OpiCXbos7xW6YOot-1uFZafgnhiqTRxUui7G08A')` }}
                  ></div>
                  <div>
                    <p className="text-white text-base font-medium leading-normal">Watercolor Paintings</p>
                    <p className="text-slate-400 text-sm font-normal leading-normal">Refine your landscape techniques.</p>
                  </div>
                </div>

                {/* Intricate Line Art Card */}
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div 
                    className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl flex flex-col"
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDDFLMS9ECmlltRXp5s3mD8Anrj50rv03Eb6VR_0Q2ckgFv_4RgkvOqPqUzP6bMBDi1hayx0cC5hooz-HZCzH1uKszFdBL-L_-kEnCH9QU5EArbgu8rrsHUYzYL9U5BjywdWEcNgPbQx4CgwP0E8tAIXLW2SUrmEH4Z8UqOU6E73M7q60pj0TrJHzGgJKtPIrxk30lM1eALBx-gDM81mPg3hvjVFb4raFvQMOn-zsxt_9LEhgZTicy_KVymv66O0yGSnpSxOaU-SNw')` }}
                  ></div>
                  <div>
                    <p className="text-white text-base font-medium leading-normal">Intricate Line Art</p>
                    <p className="text-slate-400 text-sm font-normal leading-normal">Perfect your detailed illustrations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Signup Form */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-6 p-4">
              <SignupForm 
                googleOAuthEnabled={googleEnabled as boolean}
                facebookOAuthEnabled={facebookEnabled as boolean}
                translations={t}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

