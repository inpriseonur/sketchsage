'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/landing', label: 'Landing Page', icon: '🏠' },
  { href: '/admin/packages', label: 'Paketler', icon: '💰' },
  { href: '/admin/evaluations', label: 'Değerlendirmeler', icon: '📝' },
  { href: '/admin/gallery', label: 'Quality Gallery', icon: '🖼️' },
  { href: '/admin/settings', label: 'Ayarlar', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#1a1d2e] border-r border-gray-800 min-h-screen p-6">
      <div className="mb-8">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <h1 className="text-xl font-bold text-white">SketchSage Admin</h1>
        </Link>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-xl">🏠</span>
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>
    </aside>
  )
}

