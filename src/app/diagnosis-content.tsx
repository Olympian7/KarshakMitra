
'use client';

import React from 'react';
import AppShell from '@/components/app-shell';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';

export default function DiagnosisContent() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <AppShell title={t.diagnosis} activePage="diagnosis">
      <main className="flex flex-1 flex-col">
        <iframe
          // The user-provided URL is for a font, which won't render a website.
          // This should be replaced with the actual diagnosis website URL.
          // For now, using the provided URL as requested.
          src="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap"
          className="w-full h-full border-0"
          title="Pest & Disease Diagnosis"
          allow="microphone; camera"
        ></iframe>
      </main>
    </AppShell>
  );
}
