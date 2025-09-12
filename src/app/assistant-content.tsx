
'use client';

import Link from 'next/link';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Sparkles } from 'lucide-react';

function AssistantPlaceholder() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t.conversationalAssistant}</CardTitle>
                    <CardDescription>A simple offline assistant is coming soon.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        In the meantime, you can try our advanced, tool-enabled AI assistant.
                    </p>
                    <Button asChild>
                        <Link href="/advanced-assistant">
                            <Sparkles className="mr-2 h-4 w-4" /> Tap for Advanced AI
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    )
}


export default function AssistantContent() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <AppShell title={t.conversationalAssistant} activePage="assistant">
      <AssistantPlaceholder />
    </AppShell>
  );
}
