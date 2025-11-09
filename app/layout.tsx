import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import DevLanguageSwitcher from '@/components/DevLanguageSwitcher'
import { getLocale } from '@/lib/i18n'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400','500','700'] })

// Default metadata (fallback)
export const metadata: Metadata = genMeta({
  title: 'SketchSage - Sanat Feedback Platformu',
  description: 'Kara kalem, sulu boya, yağlı boya ve pastel boya çalışmalarınıza profesyonel feedback alın.',
  locale: 'tr',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  
  return (
    <html lang={locale}>
      <head>
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'SketchSage',
              url: process.env.NEXT_PUBLIC_APP_URL || 'https://sketchsage.vercel.app',
              logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://sketchsage.vercel.app'}/logo.png`,
              description: locale === 'tr' 
                ? 'Profesyonel sanat feedback platformu'
                : 'Professional art feedback platform',
              sameAs: [
                // Social media links eklenebilir
              ],
            }),
          }}
        />
      </head>
      <body className={`${spaceGrotesk.className} bg-[#221010]`}> {/* koyu arka plan */}
        {children}
        <Toaster position="top-right" />
        <DevLanguageSwitcher />
      </body>
    </html>
  )
}

