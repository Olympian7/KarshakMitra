'use client';

import { useAuth } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      const next = pathname ? encodeURIComponent(pathname) : '';
      router.replace(next ? `/login?next=${next}` : '/login');
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading) return null;
  if (!user) return null;
  return <>{children}</>;
}

