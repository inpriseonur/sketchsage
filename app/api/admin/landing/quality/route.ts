import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Auth kontrolü
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
    const { tr, en } = body

    // Türkçe güncelle
    if (tr) {
      const { error: trError } = await supabase
        .from('landing_content')
        .update({ content: tr })
        .eq('section', 'quality')
        .eq('language', 'tr')

      if (trError) throw trError
    }

    // İngilizce güncelle
    if (en) {
      const { error: enError } = await supabase
        .from('landing_content')
        .update({ content: en })
        .eq('section', 'quality')
        .eq('language', 'en')

      if (enError) throw enError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Quality update error:', error)
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    )
  }
}

