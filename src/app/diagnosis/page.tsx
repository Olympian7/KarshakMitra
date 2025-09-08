
import { LanguageProvider } from '@/context/language-context';
import DiagnosisContent from '@/app/diagnosis-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function DiagnosisPage() {
  return (
    <LanguageProvider>
      <DiagnosisContent />
    </LanguageProvider>
  );
}
