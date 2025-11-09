import { SidebarDesktop, SidebarMobile } from '@/components/user/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Kullanıcı profilini ve kredi bilgisini çek
  const { data: profile } = await supabase
    .from('users_profile')
    .select('credits')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen w-full textured-bg">
      <SidebarMobile user={user} credits={profile?.credits || 0} />

      <div className="mx-auto flex min-h-screen max-w-6xl gap-8 px-6 py-10 lg:px-10">
        <SidebarDesktop user={user} credits={profile?.credits || 0} />

        <main className="flex-1 rounded-3xl border border-slate-700/40 bg-[#161a25]/75 px-6 py-8 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.5)]">
          {children}
        </main>
      </div>
    </div>
  )
}

