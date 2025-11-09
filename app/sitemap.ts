import { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sketchsage.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
      alternates: {
        languages: {
          tr: `${siteUrl}?locale=tr`,
          en: `${siteUrl}?locale=en`,
        },
      },
    },
    {
      url: `${siteUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          tr: `${siteUrl}/auth/login?locale=tr`,
          en: `${siteUrl}/auth/login?locale=en`,
        },
      },
    },
    {
      url: `${siteUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          tr: `${siteUrl}/auth/signup?locale=tr`,
          en: `${siteUrl}/auth/signup?locale=en`,
        },
      },
    },
  ]

  return baseRoutes
}

