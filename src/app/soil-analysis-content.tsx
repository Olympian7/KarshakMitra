'use client';

import React from 'react';
import AppShell from '@/components/app-shell';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';

export default function SoilAnalysisContent() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <AppShell title={t.soilAnalysis} activePage="soil-analysis">
      <main className="flex flex-1 flex-col">
        <iframe
          src="https://agrivision-five.vercel.app/"
          className="w-full h-full border-0"
          title="Soil Analysis"
          allow="microphone; camera"
        ></iframe>
      </main>
    </AppShell>
  );
}
