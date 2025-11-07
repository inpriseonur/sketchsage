import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#2a1a1a] to-[#1a1212] text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Sol Taraf */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Expert Feedback for<br />Your Sketches
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Elevate your art with professional critiques from seasoned artists. Transform your practice with personalized, in-depth guidance.
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href="/auth/signup"
                className="inline-block bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all relative"
              >
                <span className="absolute -top-2 -left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                  Free
                </span>
                Get Feedback Now
              </Link>
            </div>

            {/* Pricing Cards */}
            <div id="pricing" className="grid grid-cols-3 gap-4 pt-8">
              {/* 1 Feedback */}
              <div className="bg-[#3a2a2a] border border-gray-700 rounded-xl p-4 hover:border-orange-500 transition-all">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">1</div>
                  <div className="text-sm text-gray-400 mb-3">Feedback</div>
                  <div className="text-2xl font-bold text-orange-400">$9.99</div>
                </div>
              </div>

              {/* 5 Feedback - Popular */}
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 border-2 border-orange-400 rounded-xl p-4 relative transform scale-105 shadow-xl">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <span>⭐</span>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">5</div>
                  <div className="text-sm mb-3">Feedback</div>
                  <div className="text-2xl font-bold">$39.99</div>
                </div>
              </div>

              {/* 10 Feedback */}
              <div className="bg-[#3a2a2a] border border-gray-700 rounded-xl p-4 hover:border-orange-500 transition-all">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">10</div>
                  <div className="text-sm text-gray-400 mb-3">Feedback</div>
                  <div className="text-2xl font-bold text-orange-400">$69.99</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Örnek Görsel */}
          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl">
              <Image
                src="/images/hero-example.jpg"
                alt="Example artwork"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

