
import { LanguageProvider } from '@/context/language-context';
import AdvancedAssistantContent from '@/app/advanced-assistant-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function AdvancedAssistantPage() {
  return (
    <LanguageProvider>
      <AdvancedAssistantContent />
    </LanguageProvider>
  );
}
