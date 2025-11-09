import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Public ayarları getir (OAuth durumları gibi)
export async function GET() {
  try {
    const supabase = await createClient()

    // OAuth ayarlarını getir
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['google_oauth_enabled', 'facebook_oauth_enabled'])

    if (error) throw error

    // Ayarları obje formatına dönüştür
    const settingsMap = settings.reduce((acc: any, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    return NextResponse.json(settingsMap)
  } catch (error: any) {
    console.error('Error fetching public settings:', error)
    // Hata durumunda varsayılan olarak her şeyi aktif göster
    return NextResponse.json({
      google_oauth_enabled: true,
      facebook_oauth_enabled: true,
    })
  }
}

