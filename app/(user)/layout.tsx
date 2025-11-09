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
    <div className="flex min-h-screen bg-[#0f1117]">
      <Sidebar user={user} credits={profile?.credits || 0} />
      <main className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

