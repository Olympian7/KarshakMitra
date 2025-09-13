import { LanguageProvider } from '@/context/language-context';
import LiveMarketContent from '@/app/live-market-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function LiveMarketPage() {
  return (
    <LanguageProvider>
      <LiveMarketContent />
    </Language-Provider>
  );
}
