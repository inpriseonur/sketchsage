import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-b-[#482323]">
      <div className="px-4 sm:px-10 py-3 flex items-center justify-between">
        {/* Sol: logo */}
        <div className="flex items-center gap-4 text-white">
          <div className="w-4 h-4 text-[#D8753B]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">SketchSage</h2>
        </div>

        {/* Sağ: nav */}
        <nav className="hidden sm:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9 text-white text-sm font-medium">
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <Link href="/auth/login">Login</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

