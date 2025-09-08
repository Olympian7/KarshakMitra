
import { LanguageProvider } from '@/context/language-context';
import AssistantContent from '@/app/assistant-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function AssistantPage() {
  return (
    <LanguageProvider>
      <AssistantContent />
    </LanguageProvider>
  );
}
