
'use client';
import { useEffect, useState } from 'react';
import TavusModal from '@/components/TavusModal';
import { gaEvent, EV } from '@/lib/analytics';

export default function DemoPage() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  useEffect(() => {
    (async () => {
      try {
        gaEvent({ action: EV.TavusDemoClick, category: 'demo', label: 'deep-link' });
        const resp = await fetch('/api/tavus/start', { method: 'POST' });
        const data = await resp.json();
        if (resp.ok && data?.url) {
          setUrl(data.url);
          setOpen(true);
          gaEvent({ action: EV.TavusDemoStart, category: 'demo', params: { conversation_id: data.id, source: 'deep-link' } });
        }
      } catch {}
    })();
  }, []);
  return (
    <section className="container py-20">
      <h1 className="text-3xl font-bold">Live Demo</h1>
      <p className="text-zinc-300 mt-2">The AI video chatbot will start automatically, or use the homepage button.</p>
      <TavusModal url={url} open={open} onClose={() => { setOpen(false); gaEvent({action:EV.TavusDemoClose, category:'demo'}) }} />
    </section>
  );
}
