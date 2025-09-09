
import { LanguageProvider } from '@/context/language-context';
import FarmViewerContent from '@/app/farm-viewer-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function FarmViewerPage() {
  return (
    <LanguageProvider>
      <FarmViewerContent />
    </Language-Provider>
  );
}
