import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const plan = String(body?.plan || '').toLowerCase();
    const secret = process.env.STRIPE_SECRET_KEY;
    const priceStarter = process.env.STRIPE_PRICE_STARTER;
    const priceGrowth = process.env.STRIPE_PRICE_GROWTH;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!secret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    const stripe = new Stripe(secret);

    const price =
      plan === 'starter' ? priceStarter :
      plan === 'growth' ? priceGrowth :
      null;
    if (!price) return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing#cancelled`,
      allow_promotion_codes: true,
      ui_mode: 'hosted',
      billing_address_collection: 'auto',
      subscription_data: { trial_period_days: 7 }
    });

    return NextResponse.json({ url: session.url });
  } catch (e:any) {
    console.error('stripe checkout error', e);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
