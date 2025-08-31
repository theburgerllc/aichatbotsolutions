
export default function NotFound() {
  return (
    <section className="container py-24">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-2 text-zinc-300">Let’s get you back to the demo or pricing.</p>
      <div className="mt-6 flex gap-3">
        <a href="/demo" className="btn">Watch the demo</a>
        <a href="/pricing" className="btn secondary">See pricing</a>
      </div>
    </section>
  );
}
