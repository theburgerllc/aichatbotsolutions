'use client';
import { useEffect, useMemo, useState } from 'react';
import ScheduleModal from '@/components/ScheduleModal';
import { gaEvent } from '@/lib/analytics';

function parseUTM(search: string) {
  const p = new URLSearchParams(search);
  const obj: Record<string,string> = {};
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'].forEach(k => {
    const v = p.get(k);
    if (v) obj[k] = v;
  });
  return obj;
}

export default function BookPage() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const utm = parseUTM(window.location.search);
    if (Object.keys(utm).length) {
      try { localStorage.setItem('last_utm', JSON.stringify({ ...utm, ts: Date.now() })); } catch {}
    }
    gaEvent({ action: 'book_page_open', category: 'booking' });
  }, []);

  return (
    <section className="container py-16">
      <h1 className="text-3xl font-bold">Book a Strategy Call</h1>
      <p className="text-zinc-300 mt-2">Pick a time below. We’ll tailor the session to your funnel and use case.</p>
      <div className="mt-6">
        <iframe title="Calendly" src={process.env.NEXT_PUBLIC_CALENDLY_URL || ''} className="w-full h-[780px] rounded-2xl border border-zinc-800" />
      </div>
    </section>
  );
}
