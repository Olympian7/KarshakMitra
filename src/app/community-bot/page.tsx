import { LanguageProvider } from '@/context/language-context';
import CommunityBotContent from '@/app/community-bot-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function CommunityBotPage() {
  return (
    <LanguageProvider>
      <CommunityBotContent />
    </Language-Provider>
  );
}
