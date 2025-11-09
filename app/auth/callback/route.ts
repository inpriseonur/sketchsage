import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Locale'i cookie'den al veya default olarak 'tr' kullan
  const locale = request.cookies.get('locale')?.value || 'tr'

  // Callback handler sayfasına yönlendir (pending package kontrolü için)
  return NextResponse.redirect(`${origin}/${locale}/auth/callback-handler`)
}

