
import { LanguageProvider } from '@/context/language-context';
import DiagnosisTrainingGraphContent from '@/app/diagnosis-training-graph-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function DiagnosisTrainingGraphPage() {
  return (
    <LanguageProvider>
      <DiagnosisTrainingGraphContent />
    </LanguageProvider>
  );
}
