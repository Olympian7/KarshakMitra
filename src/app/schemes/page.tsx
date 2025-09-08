
import { LanguageProvider } from '@/context/language-context';
import SchemesContent from '@/app/schemes-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function SchemesPage() {
  return (
    <LanguageProvider>
      <SchemesContent />
    </LanguageProvider>
  );
}
