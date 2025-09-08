
import { LanguageProvider } from '@/context/language-context';
import MarketContent from '@/app/market-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function MarketPage() {
  return (
    <LanguageProvider>
      <MarketContent />
    </LanguageProvider>
  );
}
