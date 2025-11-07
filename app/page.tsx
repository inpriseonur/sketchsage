import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#1a1d2e] text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h1 className="text-5xl font-bold">
            SketchSage
          </h1>
        </div>

        {/* Ana Mesaj */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">
            Sanatınıza Profesyonel Feedback Alın
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Kara kalem, sulu boya, yağlı boya ve pastel boya çalışmalarınıza
            uzman sanatçılardan yapıcı geri bildirimler alın.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center pt-8">
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors"
          >
            Hemen Başla
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-[#252837] hover:bg-[#2d3142] border border-gray-700 rounded-lg font-semibold text-lg transition-colors"
          >
            Giriş Yap
          </Link>
        </div>

        {/* Info */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl">🎨</div>
            <h3 className="font-semibold">Uzman Feedback</h3>
            <p className="text-sm text-gray-400">
              Deneyimli sanatçılardan profesyonel geri bildirim
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">💬</div>
            <h3 className="font-semibold">Soru Sor</h3>
            <p className="text-sm text-gray-400">
              Aldığınız feedback'e soru sorma hakkı
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">🚀</div>
            <h3 className="font-semibold">Hızlı İnceleme</h3>
            <p className="text-sm text-gray-400">
              24-48 saat içinde detaylı değerlendirme
            </p>
          </div>
        </div>

        {/* Status */}
        <p className="text-sm text-gray-500 pt-8">
          🔧 Platform geliştirme aşamasında - Beta testi yakında!
        </p>
      </div>
    </main>
  )
}

