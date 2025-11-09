import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const locales = ['tr', 'en']
const defaultLocale = 'tr'

function getLocale(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && locales.includes(segments[0])) {
    return segments[0]
  }
  return null
}

function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && locales.includes(segments[0])) {
    return '/' + segments.slice(1).join('/')
  }
  return pathname
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Static files, API routes, ve _next dosyalarını geç
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  // Admin routes - locale olmadan çalışır
  if (pathname.startsWith('/admin')) {
    const { supabaseResponse, user } = await updateSession(request)
    if (!user) {
      // Cookie'den locale'i al, yoksa default 'tr' kullan
      const locale = request.cookies.get('locale')?.value || 'tr'
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url))
    }
    return supabaseResponse
  }

  // Mevcut locale'i kontrol et
  const currentLocale = getLocale(pathname)
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname)

  // Eğer locale yoksa, Vercel geo'ya göre yönlendir
  if (!currentLocale) {
    const country = request.headers.get('x-vercel-ip-country') || 'US'
    const locale = country === 'TR' ? 'tr' : 'en'
    
    // Root path ise direkt locale'e yönlendir
    if (pathname === '/') {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }
    
    // Diğer path'ler için locale ekle
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }

  // Session update
  const { supabaseResponse, user } = await updateSession(request)

  // Locale cookie'yi set et
  supabaseResponse.cookies.set('locale', currentLocale, {
    path: '/',
    maxAge: 31536000, // 1 yıl
  })

  // User routes - auth gerekir (locale ile)
  if (pathnameWithoutLocale.startsWith('/my-reviews') || 
      pathnameWithoutLocale.startsWith('/buy-credits')) {
    if (!user) {
      const redirectUrl = new URL(`/${currentLocale}/auth/login`, request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
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


