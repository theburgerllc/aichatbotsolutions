
import CaseStudyCard, { CaseStudy } from './CaseStudyCard';

export default function CaseStudyGrid({ items }: { items: CaseStudy[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map(cs => <CaseStudyCard key={cs.slug} {...cs} />)}
    </div>
  );
}
