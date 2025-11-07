import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import QualitySection from '@/components/landing/QualitySection'
import HowItWorks from '@/components/landing/HowItWorks'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'

export default function Home() {
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
          <Hero />
          <QualitySection />
          <HowItWorks />
          <FAQ />
        </main>
        <Footer />
      </div>
    </div>
  )
}

