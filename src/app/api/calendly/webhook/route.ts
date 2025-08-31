import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

type CalendlyPayload = {
  event: string; // "invitee.created" | "invitee.canceled"
  payload: {
    event_type?: { name?: string; };
    event?: { start_time?: string; start_time_pretty?: string; };
    invitee?: { name?: string; email?: string; timezone?: string; };
    questions_and_answers?: Array<{ question: string; answer: string }>;
    uri?: string;
  };
};

function verifySignature(req: NextRequest, rawBody: string): boolean {
  // Basic bearer token verification (fallback). Calendly also supports HMAC signatures; implement if signing key provided.
  const token = process.env.CALENDLY_WEBHOOK_TOKEN;
  const hdr = req.headers.get('authorization') || req.headers.get('x-webhook-token');
  if (token && hdr) return hdr.replace(/^Bearer\s+/i,'') === token || hdr === token;
  return true; // allow if no token configured (not recommended for prod)
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifySignature(req, raw)) return new NextResponse('Unauthorized', { status: 401 });

  let data: CalendlyPayload | null = null;
  try { data = JSON.parse(raw); } catch { return new NextResponse('Bad JSON', { status: 400 }); }
  const ev = data?.event || 'invitee.created';
  const name = data?.payload?.invitee?.name || 'Unknown';
  const email = data?.payload?.invitee?.email || '';
  const eventName = data?.payload?.event_type?.name || 'Meeting';
  const start = data?.payload?.event?.start_time || '';
  const tz = data?.payload?.invitee?.timezone || '';
  const qas = (data?.payload?.questions_and_answers || []).map(q => `- ${q.question}: ${q.answer}`).join('\n');

  try {
    const sgKey = process.env.SENDGRID_API_KEY;
    const from = process.env.SENDGRID_FROM_EMAIL;
    const notify = process.env.LEADS_NOTIFICATION_EMAIL || from;
    if (sgKey && from) {
      sgMail.setApiKey(sgKey);
      // Email the lead (confirmation)
      if (email) {
        await sgMail.send({
          to: email,
          from,
          subject: `Confirmed: ${eventName}`,
          text: `Thanks ${name}! You're booked.\n\nWhen: ${start} (${tz})\n\nWe look forward to meeting you.\n\n— Team`,
        });
      }
      // Email internal team (notification)
      await sgMail.send({
        to: notify!,
        from,
        subject: `New booking: ${eventName} — ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nWhen: ${start} (${tz})\n\nQ&A:\n${qas}`
      });
    }
  } catch (e) {
    console.error('Calendly webhook SendGrid error', e);
  }

  // Optional: HubSpot upsert
  try {
    const hsToken = process.env.HUBSPOT_ACCESS_TOKEN;
    if (hsToken && email) {
      await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${hsToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: { email, firstname: name } })
      });
    }
  } catch (e) {
    console.warn('Calendly webhook HubSpot warning', e);
  }

  return NextResponse.json({ ok: true });
}
