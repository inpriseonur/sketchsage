import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import QualitySection from '@/components/landing/QualitySection'
import HowItWorks from '@/components/landing/HowItWorks'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#221010]">
      <div className="flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[1200px] flex-1">
            <Header />
            <main className="flex flex-col gap-12 md:gap-16 lg:gap-20">
              <Hero />
              <QualitySection />
              <HowItWorks />
              <FAQ />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  )
}

