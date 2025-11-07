import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface AuthExample {
  id: string
  image_url: string
  title: string
  description: string
  display_order: number
}

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Auth sayfası örneklerini çek
  const { data: examples } = await supabase
    .from('auth_page_examples')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
    .limit(3)

  return (
    <div className="min-h-screen bg-[#1a1d2e] text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-8 py-6">
        <Link href="/" className="flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xl font-semibold">SketchSage</span>
        </Link>
      </header>

      <div className="flex min-h-screen">
        {/* Sol Taraf - Örnekler */}
        <div className="hidden lg:flex lg:w-1/2 flex-col p-12 pt-24">
          {/* Üst bilgi alanı */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Sanatçılardan kişisel yorum al.
            </h2>
            <p className="text-gray-400">
              Fotoğraf oeya kısa video yükle.<br />
              6 saat içinde geri dönüş.
            </p>
          </div>

          {/* İkonlar */}
          <div className="flex gap-8 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-xs">Çizimini Yükle</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="text-xs">Paket Seç & Öde</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xs">Video Yorumunu Al</div>
            </div>
          </div>

          {/* Başlık */}
          <h3 className="text-xl font-bold mb-6">Paketler</h3>

          {/* 3 Örnek Kart - Yan Yana */}
          <div className="grid grid-cols-3 gap-4">
            {examples?.map((example: AuthExample) => (
              <div key={example.id} className="group">
                <div className="relative overflow-hidden rounded-xl bg-gray-800 mb-3">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={example.image_url}
                      alt={example.title}
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />
                  </div>
                </div>
                <h4 className="font-semibold text-sm mb-1">{example.title}</h4>
                <p className="text-gray-400 text-xs">{example.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Taraf - Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

