import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import QualitySection from '@/components/landing/QualitySection'
import HowItWorks from '@/components/landing/HowItWorks'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'
import { createClient } from '@/lib/supabase/server'
import { getLocale } from '@/lib/i18n'

export default async function Home() {
  const supabase = await createClient()
  
  // Kullanıcının dilini al
  const locale = await getLocale()
  
  // Hero içeriğini çek
  const { data: heroData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'hero')
    .eq('language', locale)
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
    .eq('language', locale)
    .single()

  const qualityContent = qualityData?.content as any

  // How It Works içeriğini çek
  const { data: howItWorksData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'how_it_works')
    .eq('language', locale)
    .single()

  const howItWorksContent = howItWorksData?.content as any

  // FAQ içeriğini çek
  const { data: faqData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'faq')
    .eq('language', locale)
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

