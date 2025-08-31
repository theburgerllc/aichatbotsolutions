
'use client';
import { useEffect, useState } from 'react';
import { gaEvent } from '@/lib/analytics';

export default function ExitIntent({ onCTA }: { onCTA: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (e.clientY < 10) setOpen(true); };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove as any);
  }, []);
  useEffect(() => { if (open) gaEvent({ action: 'exit_intent_open', category: 'engagement' }); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center">
      <div className="card max-w-md">
        <h3 className="text-xl font-semibold">Before you go — 15% off your first month</h3>
        <p className="mt-2 text-zinc-300">Use code <strong>SAVE15</strong> at checkout. Or watch a 60‑second face‑to‑face demo.</p>
        <div className="mt-4 flex gap-3">
          <button className="btn" onClick={() => { try { localStorage.setItem('discount_code','SAVE15'); } catch {} onCTA(); setOpen(false); }}>
            Watch the AI talk now
          </button>
          <button className="btn secondary" onClick={() => setOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
}
