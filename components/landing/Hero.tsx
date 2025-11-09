import Link from 'next/link'

interface HeroContent {
  title: string
  subtitle: string
  button_text: string
  media_url?: string
}

interface Package {
  id: string
  name: string
  credits: number
  price_usd: string
  price_try: string
  is_active: boolean
  display_order: number
}

export default function Hero({ content, packages = [] }: { content?: HeroContent; packages?: Package[] }) {
  // Varsayılan değerler
  const title = content?.title || 'Expert Feedback for Your Sketches'
  const subtitle = content?.subtitle || 'Elevate your art with professional critiques from seasoned artists. Transform your practice with personalized, in-depth guidance.'
  const buttonText = content?.button_text || 'Get Feedback Now'
  const mediaUrl = content?.media_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBhqcJPuHfQ-yt3Y13dZv6a8q_5HPR0SkBCmCpYk7raY4HKk2ivqgbN8y1ntE6SwF2hR7rfAHMv38XEPOvW6Y1v8IKmeJU2Z5-fsYyS3AMvyXWXG4X2QcS87KIqbgNILPg0ofv9LVhq2SVLiXsvuIavZJlDiy8PshU-crkEpN1BKNXzaErWg6fhCw54BqTyGjni3-9gPC4pbsol0n1-fK95Ck_n1aGlwYoybjfyrJHAa4Ho-pl5C3XjbMquBeechBb9xMKZbAFb5o'

  return (
    <section>
        <div className="flex flex-col gap-6 px-4 py-10 md:gap-8 md:flex-row md:items-center">
          {/* Sol taraf */}
          <div className="flex flex-col gap-6 md:min-w-[400px] md:gap-8 md:justify-center md:flex-1">
            <div className="flex flex-col gap-4 text-left">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
                {title}
              </h1>
              <h2 className="text-white/80 text-base md:text-lg">
                {subtitle}
              </h2>
            </div>

            {/* CTA */}
            <div className="relative max-w-[480px]">
              <Link
                href="/auth/signup"
                className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 md:h-12 md:px-5 bg-[#9F2241] text-white text-sm font-bold md:text-base transition-colors hover:bg-[#A45D40]"
              >
                <span className="truncate">{buttonText}</span>
              </Link>
              <div className="absolute -top-4 -left-4 -rotate-12 pointer-events-none">
                <svg className="drop-shadow-lg" height="80" width="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M82.8,22.2C72.3,13.1,59.2,12.7,47.9,18.1C36.6,23.5,28.8,34.4,29.9,46.7 C31.1,59.0,41.1,69.5,53.8,71.1C66.5,72.8,78.8,65.3,85.5,54.5 C92.2,43.7,93.3,31.3,82.8,22.2Z" fill="#D8753B" stroke="#221010" strokeWidth="2.5" />
                </svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-[#221010]">Free</span>
              </div>
            </div>

            {/* Chip fiyatlar - Dinamik */}
            {packages.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 px-4 sm:justify-start">
                {packages.map((pkg, index) => {
                  // İkinci paket (index 1) featured olacak
                  const isFeatured = index === 1
                  
                  return (
                    <div key={pkg.id} className="flex items-center gap-4">
                      {index > 0 && <div className="hidden sm:block w-px h-6 bg-white/10" />}
                      
                      <div className={`relative flex items-center justify-center gap-4 rounded-lg px-4 py-2 text-center text-white backdrop-blur-sm transition-all ${
                        isFeatured 
                          ? 'bg-white/10 border-2 border-[#D8753B]/60 hover:bg-white/15 scale-105 shadow-lg shadow-[#D8753B]/10'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}>
                        {isFeatured && (
                          <div className="absolute -top-3 -right-3 rotate-12">
                            <svg className="text-[#D8753B] drop-shadow-md" fill="currentColor" height="32" width="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </div>
                        )}
                        <span className="text-sm font-bold">{pkg.name}</span>
                        <span className="font-bold text-[#D8753B]">${pkg.price_usd}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sağda görsel - background-image */}
          <div className="w-full aspect-square rounded-xl bg-center bg-no-repeat bg-cover md:min-w-[400px] md:flex-1" style={{
            backgroundImage: `url(${mediaUrl})`
          }} />
        </div>
    </section>
  )
}

