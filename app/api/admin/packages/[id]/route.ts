import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const { data, error } = await supabase
      .from('credit_packages')
      .update({
        name,
        credits: parseInt(credits),
        price_usd,
        price_try,
        stripe_price_id_usd: stripe_price_id_usd || null,
        stripe_price_id_try: stripe_price_id_try || null,
        is_active: is_active ?? true,
        display_order: parseInt(display_order),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ package: data })
  } catch (error) {
    console.error('Package update error:', error)
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const { data, error } = await supabase
      .from('credit_packages')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ package: data })
  } catch (error) {
    console.error('Package patch error:', error)
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const { error } = await supabase
      .from('credit_packages')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Package delete error:', error)
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    )
  }
}

