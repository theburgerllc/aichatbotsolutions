import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionId = body?.session_id as string | undefined;
    const customerId = body?.customer_id as string | undefined;
    const secret = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.STRIPE_PORTAL_RETURN_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!secret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    const stripe = new Stripe(secret);

    let custId = customerId;
    if (!custId && sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      custId = typeof session.customer === 'string' ? session.customer : session.customer?.id || undefined;
    }
    if (!custId) return NextResponse.json({ error: 'Missing customer' }, { status: 400 });

    const portal = await stripe.billingPortal.sessions.create({
      customer: custId,
      return_url: appUrl,
    });
    return NextResponse.json({ url: portal.url });
  } catch (e:any) {
    console.error('stripe portal error', e);
    return NextResponse.json({ error: 'Portal failed' }, { status: 500 });
  }
}
