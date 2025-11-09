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

type SidebarProps = {
  user: User
  credits: number
}

type SidebarContentProps = SidebarProps & {
  pathname: string
  onNavigate?: () => void
  onLogout: () => Promise<void> | void
  isLoggingOut: boolean
}

function SidebarContent({
  user,
  credits,
  pathname,
  onNavigate,
  onLogout,
  isLoggingOut,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div
              className="size-11 rounded-full bg-cover bg-center bg-no-repeat ring-2 ring-slate-700/60"
              style={{
                backgroundImage: user.user_metadata?.avatar_url
                  ? `url(${user.user_metadata.avatar_url})`
                  : `url(https://api.dicebear.com/7.x/initials/svg?seed=${user.email})`,
              }}
            />
            <div className="flex min-w-0 flex-col">
              <span className="text-base font-semibold text-slate-100 truncate">
                {user.user_metadata?.full_name || 'User'}
              </span>
              <span className="text-sm text-slate-400 truncate">{user.email}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-[#1b202f]/70 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Credits Left
            </p>
            <p className="text-2xl font-bold text-[#E29D83]">{credits}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onNavigate?.()}
                className={`flex items-center gap-3 rounded-full px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-[#A94438]/25 text-[#E29D83]'
                    : 'text-slate-200 hover:bg-slate-700/30'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <button
        onClick={onLogout}
        disabled={isLoggingOut}
        className="mt-8 flex items-center gap-3 rounded-full px-3 py-2 text-slate-200 transition-colors hover:bg-slate-700/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="material-symbols-outlined">logout</span>
        <span className="text-sm font-medium">
          {isLoggingOut ? 'Logging out...' : 'Log Out'}
        </span>
      </button>
    </div>
  )
}

async function performLogout(
  router: ReturnType<typeof useRouter>,
  setIsLoggingOut: (state: boolean) => void,
) {
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

export function SidebarDesktop({ user, credits }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col rounded-3xl border border-slate-700/50 bg-[#161a25]/85 px-5 py-8 shadow-2xl shadow-black/30">
      <SidebarContent
        user={user}
        credits={credits}
        pathname={pathname}
        onLogout={() => performLogout(router, setIsLoggingOut)}
        isLoggingOut={isLoggingOut}
      />
    </aside>
  )
}

export function SidebarMobile({ user, credits }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] rounded-full bg-[#161a25]/90 p-2 text-slate-100 shadow-lg shadow-black/40"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-[60] h-full w-64 bg-[#161a25]/95 px-5 py-8 transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-100">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full bg-slate-800/80 p-1 text-slate-200"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <SidebarContent
          user={user}
          credits={credits}
          pathname={pathname}
          onNavigate={() => setIsOpen(false)}
          onLogout={() => performLogout(router, setIsLoggingOut)}
          isLoggingOut={isLoggingOut}
        />
      </aside>
    </>
  )
}

