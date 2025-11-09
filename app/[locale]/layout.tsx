import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import '../globals.css'
import { Toaster } from 'react-hot-toast'
import DevLanguageSwitcher from '@/components/DevLanguageSwitcher'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400','500','700'] })

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const localeTyped = locale as 'tr' | 'en'
  
  if (localeTyped === 'tr') {
    return genMeta({
      title: 'SketchSage - Sanat Feedback Platformu',
      description: 'Kara kalem, sulu boya, yağlı boya ve pastel boya çalışmalarınıza profesyonel feedback alın.',
      locale: 'tr',
    })
  }
  
  return genMeta({
    title: 'SketchSage - Professional Art Feedback Platform',
    description: 'Get professional feedback on your pencil, watercolor, oil, and pastel artwork.',
    locale: 'en',
  })
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Direkt params'dan al, type assertion yap
  const localeTyped = (locale === 'tr' || locale === 'en') ? locale : 'tr'
  
  // Structured data'yı önceden oluştur
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SketchSage',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://sketchsage.vercel.app',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://sketchsage.vercel.app'}/logo.png`,
    description: localeTyped === 'tr' 
      ? 'Profesyonel sanat feedback platformu'
      : 'Professional art feedback platform',
    sameAs: [] as string[],
  }
  
  return (
    <html lang={localeTyped} suppressHydrationWarning>
      <head>
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
          suppressHydrationWarning
        />
      </head>
      <body className={`${spaceGrotesk.className} bg-[#221010]`} suppressHydrationWarning>
        {children}
        <Toaster position="top-right" />
        <DevLanguageSwitcher />
      </body>
    </html>
  )
}

