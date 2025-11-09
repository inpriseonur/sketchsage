import Sidebar from '@/components/user/Sidebar'
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
    <div className="flex min-h-screen w-full textured-bg">
      {/* Sidebar Section */}
      <section className="hidden lg:block w-64 shrink-0">
        <Sidebar user={user} credits={profile?.credits || 0} />
      </section>
      
      {/* Mobile Sidebar (fixed overlay) */}
      <div className="lg:hidden">
        <Sidebar user={user} credits={profile?.credits || 0} />
      </div>
      
      {/* Main Content Section */}
      <section className="flex-1 min-h-screen w-full lg:w-auto">
        {children}
      </section>
    </div>
  )
}

