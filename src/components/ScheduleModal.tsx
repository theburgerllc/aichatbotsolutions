'use client';
import React, { useEffect } from 'react';
import { gaEvent } from '@/lib/analytics';

type Props = { open: boolean; onClose: () => void };

export default function ScheduleModal({ open, onClose }: Props) {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL || '';
  useEffect(() => { if (open) gaEvent({ action: 'scheduler_open', category: 'booking' });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Schedule a call"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-[92%] md:w-[980px] h-[700px] bg-black rounded-2xl overflow-hidden border border-zinc-800">
        <button onClick={onClose} aria-label="Close scheduler"
          className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700">
          ✕
        </button>
        {url ? (
          <iframe
            title="Schedule a call"
            src={url}
            className="w-full h-full"
            allow="fullscreen"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300">
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold">Add your Calendly URL</h3>
              <p className="mt-2">Set <code className="text-zinc-200">NEXT_PUBLIC_CALENDLY_URL</code> in your environment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
