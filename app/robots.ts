import { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sketchsage.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/callback',
          '/auth/callback-handler',
          '/my-reviews/',
          '/user/',
          '/profile/',
          '/buy-credits',
          '/payment/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/callback',
          '/auth/callback-handler',
          '/my-reviews/',
          '/user/',
          '/profile/',
          '/buy-credits',
          '/payment/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

