
'use client';
import { useEffect, useRef, useState } from 'react';

type Item = { quote: string; author: string; role: string; initials: string };
const DATA: Item[] = [
  { quote: "Our demo-to-meeting rate jumped immediately. The video concierge qualifies and books like a top SDR.", author: "Jordan M.", role: "VP Sales, B2B SaaS", initials: "JM" },
  { quote: "Customers finally 'get' the product in 60 seconds. Returns dropped and AOV is up.", author: "Priya R.", role: "Head of CX, E-comm", initials: "PR" },
  { quote: "Prospects ask deeper questions and move faster. The human feel matters.", author: "Luis G.", role: "Growth Lead, EdTech", initials: "LG" },
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % DATA.length);
  const prev = () => setIndex((i) => (i - 1 + DATA.length) % DATA.length);
  const timer = useRef<any>(null);

  useEffect(() => {
    timer.current = setInterval(next, 6000);
    return () => clearInterval(timer.current);
  }, []);

  const item = DATA[index]!;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">What customers say</h3>
        <div className="flex gap-2" role="group" aria-label="Testimonials controls">
          <button aria-label="Previous" className="btn secondary px-3 py-2" onClick={() => { clearInterval(timer.current); prev(); }}>‹</button>
          <button aria-label="Next" className="btn secondary px-3 py-2" onClick={() => { clearInterval(timer.current); next(); }}>›</button>
        </div>
      </div>

      <blockquote className="mt-4 text-lg text-zinc-200">“{item.quote}”</blockquote>
      <div className="mt-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-600/20 border border-zinc-700 flex items-center justify-center text-sm">{item.initials}</div>
        <div>
          <div className="font-medium">{item.author}</div>
          <div className="text-sm text-zinc-400">{item.role}</div>
        </div>
      </div>

      <div className="mt-4 flex gap-1" aria-label="Slides">
        {DATA.map((_, i) => (
          <span key={i} aria-current={i === index} className={`inline-block w-2 h-2 rounded-full ${i===index ? 'bg-brand-600' : 'bg-zinc-700'}`} />
        ))}
      </div>
    </div>
  );
}
