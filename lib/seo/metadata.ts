import { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sketchsage.vercel.app'
const siteName = 'SketchSage'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  locale?: Locale
  alternateLocales?: Locale[]
  noindex?: boolean
  nofollow?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  path?: string // URL path (locale hariç)
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = `${siteUrl}/og-image.jpg`,
    locale = 'tr',
    alternateLocales = ['tr', 'en'],
    noindex = false,
    nofollow = false,
    type = 'website',
    publishedTime,
    modifiedTime,
    path = '',
  } = config

  const fullTitle = `${title} | ${siteName}`
  const keywordsString = keywords.length > 0 ? keywords.join(', ') : undefined

  // Mevcut sayfanın canonical URL'i
  const currentUrl = `${siteUrl}/${locale}${path}`

  // Hreflang alternatifleri - URL-based
  const alternates: Record<string, string> = {}
  alternateLocales.forEach((altLocale) => {
    alternates[`languages.${altLocale}`] = `${siteUrl}/${altLocale}${path}`
  })

  return {
    title: fullTitle,
    description,
    keywords: keywordsString,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: currentUrl,
      languages: alternates,
    },
    openGraph: {
      type,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      url: currentUrl,
      siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@sketchsage',
      site: '@sketchsage',
    },
    metadataBase: new URL(siteUrl),
    verification: {
      // Google Search Console verification code (eklenecek)
      // google: 'your-google-verification-code',
      // Yandex verification (Türkiye için)
      // yandex: 'your-yandex-verification-code',
    },
  }
}

// Türkçe metadata
export const trMetadata = {
  home: generateMetadata({
    title: 'SketchSage - Sanat Feedback Platformu',
    description: 'Kara kalem, sulu boya, yağlı boya ve pastel boya çalışmalarınıza profesyonel feedback alın. Uzman sanatçılardan detaylı geri bildirim ve yapıcı eleştiriler.',
    keywords: ['sanat feedback', 'çizim değerlendirme', 'resim eleştirisi', 'sanat eğitimi', 'profesyonel feedback', 'kara kalem', 'sulu boya', 'yağlı boya', 'pastel boya'],
    locale: 'tr',
  }),
  login: generateMetadata({
    title: 'Giriş Yap',
    description: 'SketchSage hesabınıza giriş yapın ve sanat çalışmalarınız için profesyonel feedback almaya başlayın.',
    locale: 'tr',
  }),
  signup: generateMetadata({
    title: 'Kaydol',
    description: 'SketchSage\'e katılın ve sanatınızı bir üst seviyeye taşıyın. Profesyonel feedback almak için hemen hesap oluşturun.',
    locale: 'tr',
  }),
}

// İngilizce metadata
export const enMetadata = {
  home: generateMetadata({
    title: 'SketchSage - Professional Art Feedback Platform',
    description: 'Get professional feedback on your pencil, watercolor, oil, and pastel artwork. Receive detailed critiques and constructive feedback from expert artists.',
    keywords: ['art feedback', 'drawing review', 'art critique', 'art education', 'professional feedback', 'pencil drawing', 'watercolor', 'oil painting', 'pastel'],
    locale: 'en',
  }),
  login: generateMetadata({
    title: 'Login',
    description: 'Sign in to your SketchSage account and start receiving professional feedback on your artwork.',
    locale: 'en',
  }),
  signup: generateMetadata({
    title: 'Sign Up',
    description: 'Join SketchSage and take your art to the next level. Create an account now to receive professional feedback.',
    locale: 'en',
  }),
}

