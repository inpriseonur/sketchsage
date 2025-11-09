import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Kullanıcı kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { packageId } = await request.json()

    // Package bilgisini çek
    const { data: pkg, error: pkgError } = await supabase
      .from('credit_packages')
      .select('*')
      .eq('id', packageId)
      .single()

    if (pkgError || !pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    // Stripe ayarlarını çek
    const { data: stripeSettings } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['stripe_secret_key'])
      .single()

    const stripeSecretKey = stripeSettings?.value as string

    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    // Stripe client oluştur
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-10-29.clover',
    })

    // Kullanıcının ülkesini belirle (şimdilik basit - daha sonra IP'ye göre yapılabilir)
    // Varsayılan olarak USD kullanalım
    const currency = 'usd'
    const price = pkg.price_usd
    const stripePriceId = pkg.stripe_price_id_usd

    // Stripe Price ID yoksa hata ver
    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Stripe Price ID not configured for this package' },
        { status: 400 }
      )
    }

    // Kullanıcı profilini çek (email için)
    const { data: profile } = await supabase
      .from('users_profile')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    // Checkout session oluştur
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/payment/cancelled`,
      customer_email: profile?.email || user.email,
      client_reference_id: user.id, // Kullanıcı ID'sini saklıyoruz
      metadata: {
        user_id: user.id,
        package_id: packageId,
        credits: pkg.credits.toString(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

