
import type { Metadata } from 'next';

type Props = { params: { slug: string } };

const DB: Record<string, { title: string; deck: string[]; metrics: string[]; }> = {
  'saas-a': { title: 'SaaS A — Video Concierge for Demos', deck: ['Problem → long response times', 'Solution → Tavus video concierge'], metrics: ['+38% demos', '-18% time-to-first-response'] },
  'ecomm-b': { title: 'E-comm B — Guided Try-On', deck: ['Problem → high returns', 'Solution → sizing Q&A'], metrics: ['-22% returns', '+12% AOV'] },
  'edu-c': { title: 'Edu C — Application Uplift', deck: ['Problem → drop-offs', 'Solution → personalized nudges'], metrics: ['+31% apply-start'] }
};

export function generateMetadata({ params }: Props): Metadata {
  const d = DB[params.slug];
  return { title: d ? `${d.title} — Case Study` : 'Case Study' };
}

export default function CaseStudyPage({ params }: Props) {
  const data = DB[params.slug];
  if (!data) return <section className="container py-16"><h1 className="text-3xl font-bold">Case Study</h1><p className="text-zinc-300">Coming soon.</p></section>;
  return (
    <section className="container py-16 space-y-6">
      <h1 className="text-4xl font-bold">{data.title}</h1>
      <ul className="list-disc list-inside text-zinc-300">{data.deck.map((x,i)=><li key={i}>{x}</li>)}</ul>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.metrics.map((m,i)=><div key={i} className="card text-center text-xl font-semibold">{m}</div>)}
      </div>
    </section>
  );
}
