
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';

const E2E = process.env.E2E_MODE === '1';
const useEU = process.env.SENDGRID_EU === '1';

if (useEU) {
  // @ts-ignore runtime method
  sgClient.setDefaultRequest('baseUrl','https://api.eu.sendgrid.com');
}
if (process.env.SENDGRID_API_KEY) {
  sgClient.setApiKey(process.env.SENDGRID_API_KEY);
  // @ts-ignore present at runtime
  sgMail.setClient?.(sgClient);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(req: Request) {
  const cookie = (req.headers.get('cookie')||'');
  const utmCookie = cookie.split(';').find(c=>c.trim().startsWith('utm_params='));
  let utmFromCookie: any = undefined;
  try { if (utmCookie) utmFromCookie = JSON.parse(Buffer.from(utmCookie.split('=')[1], 'base64').toString('utf8')); } catch {}
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;
  const hsToken = process.env.HUBSPOT_ACCESS_TOKEN;
  try {
    const { name, email, message, utm } = await req.json();
    const utmFinal = utm && Object.keys(utm).length ? utm : (utmFromCookie || {});
    if (!name || !email || !message) return NextResponse.json({ error:'Missing fields' }, { status:400 });
    if (E2E) return NextResponse.json({ ok: true });

    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
      return NextResponse.json({ error:'Email not configured' }, { status:503 });
    }
    // Fire-and-forget HubSpot forms submission (if configured)
    try {
      if (portalId && formId) {
        const cookie = (req.headers.get('cookie') || '').split(';').find(c => c.trim().startsWith('hubspotutk='));
        const hutk = cookie ? cookie.split('=')[1] : undefined;
        const pageUri = req.headers.get('referer') || (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
        const payload = {
          fields: [
            { name: 'email', value: email },
            { name: 'firstname', value: name },
            { name: 'message', value: message }, ...Object.entries(utmFinal||{}).map(([k,v])=>({ name: k, value: String(v) }))
          ],
          context: { hutk, pageUri, pageName: 'AI Chatbot Solutions' }
        };
        const hsEndpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
        await fetch(hsEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else if (hsToken) {
        // fallback: create/update contact via CRM API
        await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${hsToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ properties: { email, firstname: name, message } })
        });
      }
    } catch (e) { console.warn('HubSpot submission warning:', e); }

    await sgMail.send({
      to: 'you@yourdomain.com',
      from: process.env.SENDGRID_FROM_EMAIL!,
      replyTo: email,
      subject: `New lead from ${name}`,
      text: `From: ${email}\n\n${message}\n\nUTM: ${JSON.stringify(utmFinal||{}, null, 2)}`,
      html: `<p><strong>From:</strong> ${email}</p><p>${String(message).replace(/\n/g,'<br/>')}</p><pre style='background:#0b0b0e;color:#e5e7eb;padding:12px;border-radius:12px;border:1px solid #27272a;'>UTM: ${`${JSON.stringify(utmFinal||{}, null, 2)}`}</pre>`
    });
    return NextResponse.json({ ok:true });
  } catch (err:any) {
    console.error('SendGrid error:', err?.response?.body || err?.message || err);
    return NextResponse.json({ error:'Email failed' }, { status:500 });
  }
}
