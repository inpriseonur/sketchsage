import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import QualitySection from '@/components/landing/QualitySection'
import HowItWorks from '@/components/landing/HowItWorks'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'
import { createClient } from '@/lib/supabase/server'
import { getLocaleFromParams } from '@/lib/i18n'
import { generateMetadata as createMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const localeTyped = locale as 'tr' | 'en'
  
  if (localeTyped === 'tr') {
    return createMetadata({
      title: 'SketchSage - Sanat Feedback Platformu',
      description: 'Kara kalem, sulu boya, yağlı boya ve pastel boya çalışmalarınıza profesyonel feedback alın. Uzman sanatçılardan detaylı geri bildirim ve yapıcı eleştiriler.',
      keywords: ['sanat feedback', 'çizim değerlendirme', 'resim eleştirisi', 'sanat eğitimi', 'profesyonel feedback', 'kara kalem', 'sulu boya', 'yağlı boya', 'pastel boya'],
      locale: 'tr',
      alternateLocales: ['en'],
      path: '',
    })
  }
  
  return createMetadata({
    title: 'SketchSage - Professional Art Feedback Platform',
    description: 'Get professional feedback on your pencil, watercolor, oil, and pastel artwork. Receive detailed critiques and constructive feedback from expert artists.',
    keywords: ['art feedback', 'drawing review', 'art critique', 'art education', 'professional feedback', 'pencil drawing', 'watercolor', 'oil painting', 'pastel'],
    locale: 'en',
    alternateLocales: ['tr'],
    path: '',
  })
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeTyped = getLocaleFromParams({ locale })
  const supabase = await createClient()
  
  // Hero içeriğini çek
  const { data: heroData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'hero')
    .eq('language', localeTyped)
    .single()

  const heroContent = heroData?.content as any

  // Aktif paketleri çek
  const { data: packages } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  // Quality section içeriğini çek
  const { data: qualityData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'quality')
    .eq('language', localeTyped)
    .single()

  const qualityContent = qualityData?.content as any

  // How It Works içeriğini çek
  const { data: howItWorksData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'how_it_works')
    .eq('language', localeTyped)
    .single()

  const howItWorksContent = howItWorksData?.content as any

  // FAQ içeriğini çek
  const { data: faqData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'faq')
    .eq('language', localeTyped)
    .single()

  const faqContent = faqData?.content as any
  
  return (
    <div style={{ backgroundColor: '#221010', minHeight: '100vh', width: '100%' }}>
      <div style={{ 
        maxWidth: '1440px', 
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <Header />
        <main style={{ 
          paddingTop: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '80px'
        }}>
          <Hero content={heroContent} packages={packages || []} />
          <QualitySection content={qualityContent} />
          <HowItWorks content={howItWorksContent} />
          <FAQ content={faqContent} />
        </main>
        <Footer />
      </div>
    </div>
  )
}

