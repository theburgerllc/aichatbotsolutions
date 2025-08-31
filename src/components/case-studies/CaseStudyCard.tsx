
import Image from 'next/image';

export type CaseStudy = {
  slug: string;
  logoSrc: string;
  title: string;
  metric: string;
  summary: string;
  href: string;
};

export default function CaseStudyCard({ logoSrc, title, metric, summary, href }: CaseStudy) {
  return (
    <a href={href} className="card hover:bg-zinc-900 transition block">
      <div className="flex items-center gap-3">
        <Image src={logoSrc} alt="" width={40} height={40} className="rounded-md border border-zinc-800" />
        <div className="text-sm text-zinc-400">{metric}</div>
      </div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-zinc-300">{summary}</p>
      <div className="mt-4 text-brand-600 font-medium">Read the story →</div>
    </a>
  );
}
