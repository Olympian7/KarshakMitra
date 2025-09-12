'use client';

import AppShell from '@/components/app-shell';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Card, CardContent } from '@/components/ui/card';

export default function CommunityBotContent() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <AppShell title={t.communityBot} activePage="community-bot">
      <main className="flex flex-1 flex-col p-4 lg:p-6">
        <Card className="flex-1">
            <CardContent className="p-0 h-full">
                 <iframe
                    src="https://karshakmitra-bot.vercel.app/"
                    className="w-full h-full border-0"
                    title="Karshak Mitra Community Bot"
                    allow="microphone"
                ></iframe>
            </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
