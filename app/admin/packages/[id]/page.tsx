import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PackageForm from '@/components/admin/PackageForm'

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: pkg, error } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !pkg) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/packages"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Paket Düzenle</h1>
          <p className="mt-2 text-sm text-white/60">
            {pkg.name} paketini düzenleyin
          </p>
        </div>
      </div>

      {/* Form */}
      <PackageForm initialData={pkg} />
    </div>
  )
}

