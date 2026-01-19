
import { LanguageProvider } from '@/context/language-context';
import LstmLossGraphContent from '@/app/lstm-loss-graph-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function LstmLossGraphPage() {
  return (
    <LanguageProvider>
      <LstmLossGraphContent />
    </LanguageProvider>
  );
}
