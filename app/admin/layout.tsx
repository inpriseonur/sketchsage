import Sidebar from '@/components/admin/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Cookie'den locale'i al, yoksa default 'tr' kullan
    const cookieStore = await cookies()
    const locale = cookieStore.get('locale')?.value || 'tr'
    redirect(`/${locale}/auth/login?redirectTo=/admin`)
  }

  // Admin kontrolü yapabiliriz
  const { data: profile } = await supabase
    .from('users_profile')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-[#0f1117]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

