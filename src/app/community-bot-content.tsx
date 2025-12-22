
'use client';

import React from 'react';
import AppShell from '@/components/app-shell';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';

export default function CommunityBotContent() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <AppShell title={t.communityBot} activePage="community-bot">
      <main className="flex flex-1 flex-col">
        <iframe
          src="https://karshakmitra-bot.vercel.app/"
          className="w-full h-full border-0"
          title="உழவர் நண்பன் Community Bot"
          allow="microphone"
        ></iframe>
      </main>
    </AppShell>
  );
}
