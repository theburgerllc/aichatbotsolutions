
'use client';
import React, { useEffect, useRef } from 'react';

type Props = { url: string; open: boolean; onClose: () => void };

export default function TavusModal({ url, open, onClose }: Props) {
  const firstButton = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (open) firstButton.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Video chat demo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-[92%] md:w-[980px] h-[640px] bg-black rounded-2xl overflow-hidden border border-zinc-800">
        <button ref={firstButton} onClick={onClose} aria-label="Close video chat"
          className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700">
          ✕
        </button>
        <a href="#contact" className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700">Book a call</a>
        <iframe
          src={url}
          title="Tavus Video Chat"
          allow="camera; microphone; autoplay; clipboard-read; clipboard-write; encrypted-media; fullscreen; display-capture"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
