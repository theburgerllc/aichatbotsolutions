'use client';
import { useEffect, useState } from 'react';
import { gaEvent } from '@/lib/analytics';

export default function StickyCTA({ onDemo, onSchedule }: { onDemo: () => void; onSchedule: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => { setShow(true); gaEvent({ action: 'sticky_cta_show', category: 'engagement' }); }, 30000);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="card shadow-xl flex items-center gap-3">
        <div>
          <div className="badge mb-1">Try it live</div>
          <div className="text-sm text-zinc-200">See the AI talk — or book a call</div>
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={() => { gaEvent({ action: 'sticky_cta_demo', category: 'engagement' }); onDemo(); }}>Demo</button>
          <button className="btn secondary" onClick={() => { gaEvent({ action: 'sticky_cta_book', category: 'engagement' }); onSchedule(); }}>Book</button>
        </div>
      </div>
    </div>
  );
}
