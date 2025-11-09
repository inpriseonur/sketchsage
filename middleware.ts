import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Auth sayfalarını middleware'den geçirme
  if (pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  const { supabaseResponse, user } = await updateSession(request)

  // Vercel geo-location'dan ülke bilgisini al ve locale cookie set et
  const country = request.headers.get('x-vercel-ip-country') || 'US'
  const existingLocale = request.cookies.get('locale')?.value
  
  // Eğer locale cookie yoksa, ülkeye göre belirle
  if (!existingLocale) {
    const locale = country === 'TR' ? 'tr' : 'en'
    supabaseResponse.cookies.set('locale', locale, {
      path: '/',
      maxAge: 31536000, // 1 yıl
    })
  }

  // User routes - auth gerekir
  if (pathname.startsWith('/user') || 
      pathname.startsWith('/profile') ||
      pathname.startsWith('/my-reviews') ||
      pathname.startsWith('/buy-credits')) {
    if (!user) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Admin routes - admin auth gerekir
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}


