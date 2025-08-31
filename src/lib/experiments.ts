export type Variant = 'a' | 'b';

/** Client-side helper: read query param, then localStorage, then cookie fallback */
export function getVariant(key: string): Variant {
  if (typeof window === 'undefined') return 'a';
  const sp = new URLSearchParams(window.location.search);
  const qp = sp.get(key);
  if (qp === 'b' || qp === 'a') {
    try { localStorage.setItem(`exp_${key}`, qp); } catch {}
    return qp;
  }
  try {
    const v = localStorage.getItem(`exp_${key}`);
    if (v === 'b' || v === 'a') return v as Variant;
  } catch {}
  // cookie fallback (set by middleware/edge-config)
  const m = document.cookie.match(new RegExp('(?:^|; )exp_' + key + '=([^;]*)'));
  if (m && (m[1] === 'a' || m[1] === 'b')) return m[1] as Variant;
  return 'a';
}
