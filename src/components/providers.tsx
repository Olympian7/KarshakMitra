'use client';

import { LanguageProvider } from '@/context/language-context';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/toaster';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
        <Toaster />
      </LanguageProvider>
    </AuthProvider>
  );
}
