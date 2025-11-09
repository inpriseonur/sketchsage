'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/my-reviews', label: 'My Reviews', icon: 'rate_review' },
  { href: '/buy-credits', label: 'Buy Credits', icon: 'credit_card' },
  { href: '/profile', label: 'Profile', icon: 'person' },
]

export default function Sidebar({ user, credits }: { user: User; credits: number }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Logout failed')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#161a25] rounded-lg text-slate-200"
      >
        <span className="material-symbols-outlined">
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#161a25] border-r border-slate-700/50 p-4 z-30 transition-transform duration-300 flex flex-col justify-between text-slate-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-2">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: user.user_metadata?.avatar_url 
                  ? `url(${user.user_metadata.avatar_url})` 
                  : 'url(https://api.dicebear.com/7.x/initials/svg?seed=' + user.email + ')'
              }}
            />
            <div className="flex flex-col min-w-0">
              <h1 className="text-base font-medium leading-normal text-slate-100 truncate">
                {user.user_metadata?.full_name || 'User'}
              </h1>
              <p className="text-sm font-normal leading-normal text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-full px-3 py-2 ${
                    isActive
                      ? 'bg-[#A94438]/20 text-[#E29D83]'
                      : 'text-slate-200 hover:bg-slate-700/30'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <p className="text-sm font-medium leading-normal">{item.label}</p>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-1">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 rounded-full px-3 py-2 text-slate-200 hover:bg-slate-700/30 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium leading-normal">
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </p>
          </button>
        </div>
      </aside>
    </>
  )
}

