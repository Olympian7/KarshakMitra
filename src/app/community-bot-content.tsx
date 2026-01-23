'use client';

import React, { useRef } from 'react';
import AppShell from '@/components/app-shell';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Expand } from 'lucide-react';

export default function CommunityBotContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if ((iframe as any).mozRequestFullScreen) {
      /* Firefox */
      (iframe as any).mozRequestFullScreen();
    } else if ((iframe as any).webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      (iframe as any).webkitRequestFullscreen();
    } else if ((iframe as any).msRequestFullscreen) {
      /* IE/Edge */
      (iframe as any).msRequestFullscreen();
    }
  };

  return (
    <AppShell title={t.communityBot} activePage="community-bot">
      <main className="flex flex-1 flex-col relative">
        <Button
          onClick={handleFullscreen}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
          aria-label="Enter fullscreen"
        >
          <Expand className="h-5 w-5" />
          <span className="sr-only">Enter Fullscreen</span>
        </Button>
        <iframe
          ref={iframeRef}
          src="https://mitra-ai-antibot.vercel.app/"
          className="w-full h-full border-0"
          title="Nanban Community Bot"
          allow="microphone; fullscreen"
        ></iframe>
      </main>
    </AppShell>
  );
}
