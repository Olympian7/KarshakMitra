
'use client';

import React, { useState } from 'react';
import AppShell from '@/components/app-shell';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CommunityBotContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  const [textToCopy, setTextToCopy] = useState('');

  const handleCopy = () => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: 'Copied!',
        description: 'Text has been copied to your clipboard.',
      });
    }
  };

  return (
    <AppShell title={t.communityBot} activePage="community-bot">
      <main className="flex flex-1 flex-col">
        <div className="p-4 border-b bg-muted/40">
            <label htmlFor="bot-input" className="text-sm font-medium text-muted-foreground pb-2 block">
                Use the virtual keyboard to type here, then copy and paste into the chat below.
            </label>
            <div className="flex gap-2">
                <Input 
                    id="bot-input"
                    placeholder="Type your message for the bot..." 
                    value={textToCopy}
                    onChange={(e) => setTextToCopy(e.target.value)}
                />
                <Button onClick={handleCopy} disabled={!textToCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                </Button>
            </div>
        </div>
        <iframe
          src="https://karshakmitra-bot.vercel.app/"
          className="w-full h-full border-0"
          title="Karshak Mitra Community Bot"
          allow="microphone"
        ></iframe>
      </main>
    </AppShell>
  );
}
