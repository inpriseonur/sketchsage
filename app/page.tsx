import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import QualitySection from '@/components/landing/QualitySection'
import HowItWorks from '@/components/landing/HowItWorks'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1b0f0f]">
      <Header />
      <Hero />
      <QualitySection />
      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  )
}

