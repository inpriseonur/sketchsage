'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { 
    href: '/admin/landing', 
    label: 'Landing Page', 
    icon: '🏠',
    subItems: [
      { href: '/admin/landing/hero', label: 'Hero Alanı' },
      { href: '/admin/landing/quality', label: 'Quality Gallery' },
      { href: '/admin/landing/how-it-works', label: 'How It Works' },
      { href: '/admin/landing/faq', label: 'FAQ' },
    ]
  },
  { href: '/admin/packages', label: 'Paketler', icon: '💰' },
  { href: '/admin/evaluations', label: 'Değerlendirmeler', icon: '📝' },
  { href: '/admin/questions', label: 'Sorular', icon: '❓' },
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
          const isSubActive = item.subItems?.some(sub => pathname === sub.href)
          
          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive || isSubActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
              
              {item.subItems && (isActive || isSubActive) && (
                <div className="ml-4 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                        pathname === subItem.href
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <span className="text-xs">→</span>
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
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

