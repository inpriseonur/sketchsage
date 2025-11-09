import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400','500','700'] })

// Default metadata (fallback)
export const metadata: Metadata = genMeta({
  title: 'SketchSage - Sanat Feedback Platformu',
  description: 'Kara kalem, sulu boya, yağlı boya ve pastel boya çalışmalarınıza profesyonel feedback alın.',
  locale: 'tr',
})

// Root layout - admin ve API routes için
// Locale-based sayfalar app/[locale]/layout.tsx'de
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${spaceGrotesk.className} bg-[#221010]`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

