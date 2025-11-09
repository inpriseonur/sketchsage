import { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sketchsage.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      path: '',
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      path: '/auth/login',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      path: '/auth/signup',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Her route için her iki dil versiyonunu oluştur
  const sitemapEntries: MetadataRoute.Sitemap = []

  routes.forEach((route) => {
    const trUrl = `${siteUrl}/tr${route.path}`
    const enUrl = `${siteUrl}/en${route.path}`

    // Türkçe versiyon
    sitemapEntries.push({
      url: trUrl,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          tr: trUrl,
          en: enUrl,
        },
      },
    })

    // İngilizce versiyon
    sitemapEntries.push({
      url: enUrl,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          tr: trUrl,
          en: enUrl,
        },
      },
    })
  })

  return sitemapEntries
}

