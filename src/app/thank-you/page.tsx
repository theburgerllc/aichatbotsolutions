'use client';
import { useEffect } from 'react';
import { gaEvent } from '@/lib/analytics';

export default function ThankYouPage() {
  useEffect(() => {
    gaEvent({ action: 'thank_you_view', category: 'conversion' });
  }, []);
  return (
    <section className="container py-20">
      <h1 className="text-4xl font-bold">Thanks — we’ll be in touch!</h1>
      <p className="mt-3 text-zinc-300 max-w-2xl">
        We’ve received your details. In the meantime, you can watch the Tavus-powered demo again or jump to pricing.
      </p>
      <div className="mt-6 flex gap-3">
        <a className="btn" href="/#pricing">See Plans</a>
        <a className="btn secondary" href="/demo">Watch the demo</a>
      </div>
    </section>
  );
}
