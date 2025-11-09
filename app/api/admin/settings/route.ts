import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Tüm ayarları getir
export async function GET() {
  try {
    const supabase = await createClient()

    // Kullanıcı kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin kontrolü
    const { data: profile } = await supabase
      .from('users_profile')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Tüm ayarları getir
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('key')

    if (error) throw error

    // Ayarları daha kullanışlı bir formata dönüştür
    const settingsMap = settings.reduce((acc: any, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    return NextResponse.json(settingsMap)
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT - Ayarları güncelle
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    // Kullanıcı kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin kontrolü
    const { data: profile } = await supabase
      .from('users_profile')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    console.log('Received settings update:', body)
    
    // Her ayarı güncelle
    const updatePromises = Object.entries(body).map(async ([key, value]) => {
      console.log(`Updating ${key}:`, value, typeof value)
      
      const { data, error } = await supabase
        .from('system_settings')
        .update({ value })
        .eq('key', key)
        .select()

      if (error) {
        console.error(`Error updating ${key}:`, error)
        throw error
      }
      
      console.log(`Updated ${key}:`, data)
    })

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true, message: 'Settings updated successfully' })
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    )
  }
}

