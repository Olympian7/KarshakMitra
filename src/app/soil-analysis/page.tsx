
import { LanguageProvider } from '@/context/language-context';
import SoilAnalysisContent from '@/app/soil-analysis-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function SoilAnalysisPage() {
  return (
    <LanguageProvider>
      <SoilAnalysisContent />
    </LanguageProvider>
  );
}
