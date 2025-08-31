
import PlansTable from '@/components/pricing/PlansTable';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';

export default function PricingPage() {
  return (
    <section className="container py-16 space-y-8">
      <h1 className="text-4xl font-bold">Pricing</h1>
      <p className="text-zinc-300">Choose a plan and launch your Tavus‑powered video sales rep today. Buy online or book a call for tailored deployment.</p>
      <PlansTable />
      <p className="text-sm text-zinc-400">Prices in USD. Annual billing saves 15%.</p>
      <div className="mt-8">
        <TestimonialsCarousel />
      </div>
    </section>
  );
}
