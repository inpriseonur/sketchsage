import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import DevLanguageSwitcher from '@/components/DevLanguageSwitcher'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400','500','700'] })

export const metadata: Metadata = {
  title: 'SketchSage - Sanat Feedback Platformu',
  description: 'Kara kalem, sulu boya, yağlı boya ve pastel boya çalışmalarınıza profesyonel feedback alın.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${spaceGrotesk.className} bg-[#221010]`}> {/* koyu arka plan */}
        {children}
        <Toaster position="top-right" />
        <DevLanguageSwitcher />
      </body>
    </html>
  )
}

