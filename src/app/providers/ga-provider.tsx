
'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { gaPageview } from '@/lib/analytics';

export default function GAProvider() {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    if (!pathname) return;
    gaPageview(pathname + (search?.toString() ? `?${search}` : ''));
  }, [pathname, search]);
  return null;
}
