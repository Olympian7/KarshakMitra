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
          src="https://cropsense-rho.vercel.app/"
          className="w-full h-full border-0"
          title="Pest & Disease Diagnosis"
          allow="microphone; camera"
        ></iframe>
      </main>
    </AppShell>
  );
}
