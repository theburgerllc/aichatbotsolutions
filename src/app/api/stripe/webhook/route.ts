import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function hsUpsert(email: string, properties: Record<string, any>) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token || !email) return;
  const headers: any = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  try {
    // Search by email
    const search = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers,
      body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }]}], properties: ['email','lifecyclestage'] })
    }).then(r => r.json()).catch(() => ({} as any));
    const id = search?.results?.[0]?.id;
    if (id) {
      await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ properties })
      });
    } else {
      await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ properties: { email, ...properties } })
      });
    }
  } catch (e) { console.warn('hubspot upsert warning', e); }
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !whSecret) return NextResponse.json({ ok: true });

  const sig = req.headers.get('stripe-signature') || '';
  const raw = await req.text();

  const stripe = new Stripe(secret);
  const toMs = (s?: number|null) => typeof s === 'number' ? s * 1000 : undefined;
  const centsToDollars = (c?: number|null) => (typeof c === 'number' ? Math.round((c / 100) * 100) / 100 : undefined);
  const computeMRR = (unitAmountCents?: number|null, interval?: 'month'|'year'|'week'|'day') => {
    if (typeof unitAmountCents !== 'number') return undefined;
    const monthlyCents = interval === 'year' ? unitAmountCents / 12
                         : interval === 'week' ? unitAmountCents * (52/12)
                         : interval === 'day' ? unitAmountCents * 30
                         : unitAmountCents;
    return Math.round((monthlyCents / 100) * 100) / 100;
  };
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err:any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Basic log — adapt to your needs (e.g., upsert to DB)
  switch (event.type) {
    case 'checkout.session.completed':
    case 'invoice.paid': {
      const inv = event.data.object as any;
      const email = inv?.customer_email as string | undefined;
      const subId = typeof inv?.subscription === 'string' ? inv.subscription : inv?.subscription?.id;
      const invoiceId = inv?.id as string | undefined;
      try {
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          const item = sub.items?.data?.[0];
          const price = item?.price;
          const planId = price?.id as string | undefined;
          const unitAmount = price?.unit_amount as number | undefined;
          const interval = price?.recurring?.interval as any;
          const mrr = computeMRR(unitAmount, interval);
          const periodEnd = toMs(sub?.current_period_end);
          const status = sub?.status as string | undefined;
          if (email) {
            await hsUpsert(email, {
              stripe_subscription_id: subId,
              stripe_plan: planId,
              stripe_status: status,
              stripe_current_period_end: periodEnd,
              last_payment_date: toMs(inv?.status_transitions?.paid_at || inv?.created),
              last_invoice_id: invoiceId,
              mrr: mrr
            });
          }
        }
      } catch (e) { console.warn('invoice.paid enrichment warn', e); }
      break;
    }
    case 'customer.subscription.created': {
      const sub = event.data.object as any;
      const customerId = sub?.customer as string | undefined;
      // We cannot reliably fetch email without extra API calls; rely on checkout.session.completed for email capture.
      console.log('stripe event', event.type, sub?.id, customerId);
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      console.log('stripe event', event.type, event.data.object['id']);
      break;
  }

  return NextResponse.json({ received: true });
}
