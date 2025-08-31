
'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import TavusModal from '@/components/TavusModal';
import { gaEvent, EV } from '@/lib/analytics';
import PlansTable from '@/components/pricing/PlansTable';
import { getVariant } from '@/lib/experiments';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';
import ExitIntent from '@/components/ExitIntent';
import ScheduleModal from '@/components/ScheduleModal';
import StickyCTA from '@/components/StickyCTA';

const HeroScene = dynamic(() => import('@/components/HeroScene'), { ssr: false });

function useScroll75Event() {
  useEffect(() => {
    let fired = false;
    function onScroll() {
      const h = document.documentElement;
      const percent = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      if (!fired && percent >= 75) {
        fired = true;
        gaEvent({ action: EV.Scroll75, category: 'engagement', nonInteraction: true });
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [openSched, setOpenSched] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useScroll75Event();

  const heroVar = getVariant('hero');

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > window.innerHeight * 0.4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function startDemo() {
    try {
      gaEvent({ action: EV.TavusDemoClick, category: 'demo' });
      setLoading(true);
      const resp = await fetch('/api/tavus/start', { method: 'POST' });
      const data = await resp.json();
      if (!resp.ok || !data?.url) throw new Error(data?.error || 'Failed to create conversation');
      setUrl(data.url);
      setOpen(true);
      gaEvent({ action: EV.TavusDemoStart, category: 'demo', params: { conversation_id: data.id } });
    } catch (e: any) {
      gaEvent({ action: EV.TavusDemoError, category: 'demo', label: e?.message });
      alert('Unable to start the video demo. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const closeDemo = () => {
    setOpen(false);
    gaEvent({ action: EV.TavusDemoClose, category: 'demo' });
    // Auto-open scheduler for follow-up booking
    setTimeout(() => setOpenSched(true), 400);
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-zinc-800">
        <HeroScene />
        <div className="container hero py-20 md:py-28 relative">
          <span className="badge">Tavus-Powered Digital Human</span>
          <h1 className="mt-4 text-5xl md:text-6xl font-extrabold">
            Enterprise AI <span className="text-brand-600">Video</span> Chatbots that Convert
          </h1>
          <p className="max-w-2xl mt-4 text-lg text-zinc-300">
            Tavus‑powered digital human that qualifies, answers objections, and books meetings automatically — 24/7, on‑brand, on your site.
          </p>
          <div className="mt-8 flex gap-4 flex-wrap">{heroVar==='b' ? null : undefined}
            <button className="btn" onClick={startDemo} disabled={loading}>
              {loading ? 'Starting…' : 'Watch the AI talk now'}
            </button>
            <button className="btn secondary" onClick={() => setOpenSched(true)}>Book a strategy call</button>
            <a className="btn secondary" href="/demo">Open live demo page</a>
          </div>
          <div className="mt-3 text-sm text-zinc-400">GDPR-aware • Encrypted in transit • Deployed on your domain</div>
        </div>
      </section>

      <section id="features" className="container py-12 space-y-8">
        <h2 className="text-3xl font-bold">Built to Convert — Not Just Converse</h2>
        <div className="grid-3">
          <div className="card"><h3 className="font-semibold text-xl">Lifelike engagement</h3><p className="mt-2 text-zinc-300">Face‑to‑face video presence that builds trust and keeps visitors engaged.</p></div>
          <div className="card"><h3 className="font-semibold text-xl">Conversion engine</h3><p className="mt-2 text-zinc-300">Intent‑aware prompts, objection handling, and instant scheduling to move buyers forward.</p></div>
          <div className="card"><h3 className="font-semibold text-xl">Enterprise trust</h3><p className="mt-2 text-zinc-300">SSO, role‑based controls, and white‑label UI to fit your brand and stack.</p></div>
        </div>
      </section>

      <section className="container py-12 space-y-6">
        <h2 className="text-3xl font-bold">Customer Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/case-studies/saas-a" className="card hover:bg-zinc-900 transition block">
            <div className="text-sm text-zinc-400">+38% booked demos</div>
            <h3 className="mt-3 text-lg font-semibold">SaaS A — Qualifies 24/7</h3>
            <p className="mt-2 text-zinc-300">AI video concierge that handles FAQs and pushes high-intent leads to sales.</p>
          </a>
          <a href="/case-studies/ecomm-b" className="card hover:bg-zinc-900 transition block">
            <div className="text-sm text-zinc-400">-22% return rate</div>
            <h3 className="mt-3 text-lg font-semibold">E-comm B — Reduces returns</h3>
            <p className="mt-2 text-zinc-300">Guided try-on and sizing advice via digital human assistant.</p>
          </a>
          <a href="/case-studies/edu-c" className="card hover:bg-zinc-900 transition block">
            <div className="text-sm text-zinc-400">+31% apply-start</div>
            <h3 className="mt-3 text-lg font-semibold">Edu C — Boosts applications</h3>
            <p className="mt-2 text-zinc-300">Personalized Q&A and next-step nudges increased conversions.</p>
          </a>
        </div>
      </section>

      <section id="pricing" className="container py-12 space-y-8">
        <h2 className="text-3xl font-bold">Pricing</h2>
        <PlansTable />
        <p className="text-sm text-zinc-400">Prices shown in USD. Annual billing saves 15%.</p>
        <div className="mt-8">
          <TestimonialsCarousel />
        </div>
      </section>

      <section id="faq" className="container py-12">
        <h2 className="text-3xl font-bold">FAQ</h2>
        <div className="mt-6 grid gap-4">
          <div className="card"><h3 className="font-semibold">How fast can we launch?</h3><p className="text-zinc-300 mt-2">Same-day — paste keys, drop the embed, you’re live.</p></div>
          <div className="card"><h3 className="font-semibold">Is our data safe?</h3><p className="text-zinc-300 mt-2">Yes — encrypted in transit; secrets never exposed client-side.</p></div>
          <div className="card"><h3 className="font-semibold">Can we use our own persona?</h3><p className="text-zinc-300 mt-2">Yes — provide Persona & Replica IDs.</p></div>
          <div className="card"><h3 className="font-semibold">Does it book meetings?</h3><p className="text-zinc-300 mt-2">Yes — link your calendaring tool for instant scheduling.</p></div>
        </div>
      </section>

      <section id="contact" className="container py-16">
        <div className="card">
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <p className="text-zinc-300 mt-2">Tell us about your use case and we’ll reach out.</p>
          <form className="mt-6 grid gap-3 max-w-xl" onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget as HTMLFormElement);
            const utm = (() => { try { return JSON.parse(localStorage.getItem('last_utm') || '{}'); } catch { return {}; } })();
            const payload = { name: String(fd.get('name')||''), email: String(fd.get('email')||''), message: String(fd.get('message')||''), utm };
            try {
              const res = await fetch('/api/contact', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
              if (res.ok) { gaEvent({action: EV.LeadSubmitSuccess, category:'lead'}); window.location.href = '/thank-you'; }
              else { throw new Error('Send failed'); }
            } catch (err:any) {
              gaEvent({action: EV.LeadSubmitError, category:'lead', label: err?.message});
              alert('Send failed.');
            }
          }}>
            <input name="name" required placeholder="Your name" className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800" />
            <input name="email" type="email" required placeholder="Email" className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800" />
            <textarea name="message" required placeholder="What do you want to build?" className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 h-28"></textarea>
            <button className="btn w-fit" type="submit">Send</button>
          </form>
        </div>
      </section>

      {showSticky && (
        <div className="sticky-cta">
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-300">Ready to see it in action?</span>
            <button className="btn" onClick={startDemo} disabled={loading}>
              {loading ? 'Starting…' : 'Watch the AI talk now'}
            </button>
          </div>
        </div>
      )}

      <ExitIntent onCTA={startDemo} />
      <TavusModal url={url} open={open} onClose={closeDemo} />
          <ScheduleModal open={openSched} onClose={() => setOpenSched(false)} />
          <StickyCTA onDemo={() => setOpen(true)} onSchedule={() => setOpenSched(true)} />
      <ScheduleModal open={openSched} onClose={() => setOpenSched(false)} />
    </>
  );
}
