
'use client';
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html><body>
      <section className="container py-24">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-zinc-300">We’ve been notified. Try again or return home.</p>
        <div className="mt-6 flex gap-3">
          <button className="btn" onClick={() => reset()}>Try again</button>
          <a href="/" className="btn secondary">Home</a>
        </div>
      </section>
    </body></html>
  );
}
