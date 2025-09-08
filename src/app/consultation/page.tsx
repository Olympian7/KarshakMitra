
import { LanguageProvider } from '@/context/language-context';
import ConsultationContent from '@/app/consultation-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function ConsultationPage() {
  return (
    <LanguageProvider>
      <ConsultationContent />
    </LanguageProvider>
  );
}
