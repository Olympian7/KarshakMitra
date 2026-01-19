
import { LanguageProvider } from '@/context/language-context';
import DiagnosisTrainingLossGraphContent from '@/app/diagnosis-training-loss-graph-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function DiagnosisTrainingLossGraphPage() {
  return (
    <LanguageProvider>
      <DiagnosisTrainingLossGraphContent />
    </LanguageProvider>
  );
}
