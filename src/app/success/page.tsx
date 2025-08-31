'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { gaEvent } from '@/lib/analytics';

export default function SuccessPage() {
  useEffect(() => { gaEvent({ action: 'purchase_success', category: 'conversion' }); }, []);
  const sp = useSearchParams();
  const sessionId = sp?.get('session_id') || '';
  const [loading, setLoading] = useState(false);
  const manage = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stripe/portal', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ session_id: sessionId }) });
      const data = await res.json();
      if (res.ok && data?.url) window.location.href = data.url;
      else alert(data?.error || 'Unable to open portal');
    } finally { setLoading(false); }
  };
  return (
    <section className="container py-24">
      <h1 className="text-4xl font-bold">You’re in 🎉</h1>
      <p className="mt-3 text-zinc-300">Thanks for subscribing. We’ll email setup details shortly.</p>
      <div className="mt-6 flex gap-3">
        <a className="btn inline-block" href="/thank-you">Back to home</a>
        <button className="btn secondary" onClick={manage} disabled={loading}>
          {loading ? 'Opening…' : 'Manage subscription'}
        </button>
      </div>
    </section>
  );
}
