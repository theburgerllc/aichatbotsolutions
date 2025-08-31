import React from 'react';

'use client';
import Check from '@/components/icons/Check';
import { gaEvent, EV } from '@/lib/analytics';

type Row = { feature: string; starter?: boolean | string; growth?: boolean | string; enterprise?: boolean | string; note?: string };
const rows: Row[] = [
  { feature: 'Tavus video minutes / mo', starter: '100', growth: '500', enterprise: 'Unmetered*', note: '*fair use' },
  { feature: 'Website embed', starter: true, growth: true, enterprise: true },
  { feature: 'Lead capture, routing & booking', starter: true, growth: true, enterprise: true },
  { feature: 'Calendly scheduling', starter: true, growth: true, enterprise: true },
  { feature: 'White-label', starter: false, growth: 'Light brand controls', enterprise: 'Full' },
  { feature: 'Advanced analytics', starter: false, growth: true, enterprise: true },
  { feature: 'SSO (SAML/OIDC)', starter: false, growth: false, enterprise: true },
  { feature: 'Priority SLA', starter: false, growth: false, enterprise: true },
];

function CellVal(v?: boolean | string) {
  if (v === true) return <Check className="w-5 h-5 text-emerald-400" />;
  if (v === false) return <span className="text-zinc-500">—</span>;
  return <span className="text-zinc-200">{v}</span>;
}

export default function PlansTable() {
  const [openSched, setOpenSched] = React.useState(false) as any;
  const buy = async (plan: 'starter'|'growth') => {
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ plan, discount_code: (typeof window!=='undefined' ? (localStorage.getItem('discount_code')||'') : '') }) });
      const data = await res.json();
      if (res.ok && data?.url) { window.location.href = data.url; }
      else { alert(data?.error || 'Unable to start checkout'); }
    } catch { alert('Unable to start checkout'); }
  };
  const onClick = (plan: 'Starter'|'Growth'|'Enterprise') =>
    gaEvent({ action: EV.PricingCtaClick, category: 'pricing', label: plan });

  return (
    <>

    <div className="overflow-x-auto border border-zinc-800 rounded-2xl" role="region" aria-label="Compare plans">
      <table className="min-w-full text-left">
        <caption className="sr-only">Compare plans</caption>
        <thead className="bg-zinc-900/60">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Features</th>
            <th scope="col" className="px-4 py-3">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm text-zinc-400">Starter</div>
                  <div className="text-2xl font-extrabold">$199<span className="text-sm font-medium">/mo</span></div>
                </div>
                <a href="#contact" onClick={(e) => { e.preventDefault(); onClick('Starter'); buy('starter'); }} className="btn" role="button">Buy Starter</a>
              </div>
            </th>
            <th scope="col" className="px-4 py-3">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm text-zinc-400">Growth</div>
                  <div className="text-2xl font-extrabold">$699<span className="text-sm font-medium">/mo</span></div>
                </div>
                <a href="#contact" onClick={(e) => { e.preventDefault(); onClick('Growth'); buy('growth'); }} className="btn" role="button">Buy Growth</a>
              </div>
            </th>
            <th scope="col" className="px-4 py-3">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm text-zinc-400">Enterprise</div>
                  <div className="text-2xl font-extrabold">$1,199<span className="text-sm font-medium">/mo</span></div>
                </div>
                <a href="#contact" onClick={(e) => { e.preventDefault(); onClick('Enterprise'); setOpenSched(true); }} className="btn" role="button">Talk to Sales</a>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.feature} className="border-t border-zinc-800">
              <th scope="row" className="px-4 py-3 font-medium text-zinc-200">
                <div className="flex items-center gap-2">
                  <span>{r.feature}</span>
                  {r.note && <span className="text-xs badge">{r.note}</span>}
                </div>
              </th>
              <td className="px-4 py-3">{CellVal(r.starter)}</td>
              <td className="px-4 py-3">{CellVal(r.growth)}</td>
              <td className="px-4 py-3">{CellVal(r.enterprise)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      <div>
        {openSched && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="card max-w-xl w-[92%]">
              <h3 className="text-xl font-semibold">Book a call</h3>
              <iframe title="Calendly" src={process.env.NEXT_PUBLIC_CALENDLY_URL || ''} className="w-full h-[600px] mt-3 rounded-xl border border-zinc-800" />
              <div className="mt-4 text-right">
                <button className="btn secondary" onClick={() => setOpenSched(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
