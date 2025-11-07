import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="bg-[#1b0f0f] text-white pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Sol Taraf */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight">
                Expert Feedback for
                <br />
                Your Sketches
              </h1>
              <p className="text-base text-[#cfc5c5] max-w-md">
                Elevate your art with professional critiques from seasoned artists. Transform your practice with personalized, in-depth guidance.
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center relative px-6 py-3 rounded-md bg-[#e2465b] hover:bg-[#d23b50] transition-colors font-semibold"
              >
                <span className="absolute -left-6 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-yellow-400 text-black text-[10px] font-extrabold grid place-items-center shadow">free</span>
                Get Feedback Now
              </Link>
            </div>

            {/* Pricing Chips */}
            <div id="pricing" className="flex flex-wrap gap-3 pt-2">
              {/* Chip */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#2a1717] border border-[#4b2b2b] px-3 py-1 text-sm">
                <span className="inline-flex items-center gap-1">
                  <span className="rounded bg-black/60 px-2 py-0.5 text-[11px]">1</span>
                  <span className="text-[#cfc5c5]">Feedback</span>
                </span>
                <span className="font-semibold text-[#f1996b]">$9.99</span>
              </div>

              <div className="relative inline-flex items-center gap-2 rounded-full bg-[#2a1717] border-2 border-[#eaa24f] px-3 py-1 text-sm shadow">
                <span className="inline-flex items-center gap-1">
                  <span className="rounded bg-black/60 px-2 py-0.5 text-[11px]">5</span>
                  <span>Feedback</span>
                </span>
                <span className="font-semibold">$39.99</span>
                <span className="absolute -right-2 -top-2 text-yellow-400">★</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#2a1717] border border-[#4b2b2b] px-3 py-1 text-sm">
                <span className="inline-flex items-center gap-1">
                  <span className="rounded bg-black/60 px-2 py-0.5 text-[11px]">10</span>
                  <span className="text-[#cfc5c5]">Feedback</span>
                </span>
                <span className="font-semibold text-[#f1996b]">$69.99</span>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Örnek Görsel */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl max-w-[420px] ml-auto">
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

