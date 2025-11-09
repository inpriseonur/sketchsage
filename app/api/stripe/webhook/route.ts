import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const sig = headersList.get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const supabase = await createClient()

    // Stripe ayarlarını çek
    const { data: stripeSettings } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['stripe_secret_key', 'stripe_webhook_secret'])

    const settingsMap = stripeSettings?.reduce((acc: any, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    const stripeSecretKey = settingsMap?.stripe_secret_key as string
    const webhookSecret = settingsMap?.stripe_webhook_secret as string

    if (!stripeSecretKey || !webhookSecret) {
      console.error('Stripe not configured')
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-10-29.clover',
    })

    // Webhook imzasını doğrula
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Event tipine göre işlem yap
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const userId = session.metadata?.user_id || session.client_reference_id
        const packageId = session.metadata?.package_id
        const creditsToAdd = parseInt(session.metadata?.credits || '0')

        if (!userId || !packageId || !creditsToAdd) {
          console.error('Missing metadata in session:', session.id)
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
        }

        // Kullanıcının mevcut kredisini al
        const { data: profile, error: profileError } = await supabase
          .from('users_profile')
          .select('credits')
          .eq('id', userId)
          .single()

        if (profileError || !profile) {
          console.error('User profile not found:', userId)
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Kredileri ekle
        const { error: updateError } = await supabase
          .from('users_profile')
          .update({ 
            credits: profile.credits + creditsToAdd,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (updateError) {
          console.error('Failed to update credits:', updateError)
          return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 })
        }

        // Transaction kaydı oluştur
        const { error: txError } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            package_id: packageId,
            stripe_payment_intent_id: session.payment_intent as string,
            amount: session.amount_total! / 100, // Cent'ten dolara çevir
            currency: session.currency!,
            credits_added: creditsToAdd,
            status: 'completed',
          })

        if (txError) {
          console.error('Failed to create transaction:', txError)
          // Credits eklendi ama transaction kaydedilemedi - log'la ama hata verme
        }

        console.log(`✅ Credits added: ${creditsToAdd} to user ${userId}`)
        break
      }

      case 'payment_intent.succeeded': {
        console.log('Payment intent succeeded:', event.data.object.id)
        break
      }

      case 'payment_intent.payment_failed': {
        console.log('Payment intent failed:', event.data.object.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

