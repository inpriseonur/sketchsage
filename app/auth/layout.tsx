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
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 p-12 pt-32">
          <div className="w-full max-w-lg mx-auto space-y-6">
            {examples?.map((example: AuthExample) => (
              <div key={example.id} className="group relative overflow-hidden rounded-2xl bg-gray-800">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={example.image_url}
                    alt={example.title}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-semibold mb-1">{example.title}</h3>
                  <p className="text-gray-300 text-sm">{example.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Taraf - Form */}
        <div className="flex-1 flex items-center justify-center p-8 pt-32">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

