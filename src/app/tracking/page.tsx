
import { LanguageProvider } from '@/context/language-context';
import TrackingContent from '@/app/tracking-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function TrackingPage() {
  return (
    <LanguageProvider>
      <TrackingContent />
    </LanguageProvider>
  );
}
