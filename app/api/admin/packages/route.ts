import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
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

    const { data: packages, error } = await supabase
      .from('credit_packages')
      .select('*')
      .order('display_order')

    if (error) throw error

    return NextResponse.json({ packages })
  } catch (error) {
    console.error('Packages fetch error:', error)
    return NextResponse.json(
      { error: 'Fetch failed' },
      { status: 500 }
    )
  }
}

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
    const { 
      name, 
      credits, 
      price_usd, 
      price_try, 
      stripe_price_id_usd,
      stripe_price_id_try,
      is_active,
      display_order 
    } = body

    // Validation
    if (!name || !credits || !price_usd || !price_try || !display_order) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('credit_packages')
      .insert({
        name,
        credits: parseInt(credits),
        price_usd,
        price_try,
        stripe_price_id_usd: stripe_price_id_usd || null,
        stripe_price_id_try: stripe_price_id_try || null,
        is_active: is_active ?? true,
        display_order: parseInt(display_order),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ package: data })
  } catch (error) {
    console.error('Package create error:', error)
    return NextResponse.json(
      { error: 'Create failed' },
      { status: 500 }
    )
  }
}

