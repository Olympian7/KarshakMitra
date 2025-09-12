
'use client';

import React, { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { MessageCircle, User, Send, Languages, Loader2, ExternalLink } from 'lucide-react';
import { assistantFlow, AssistantOutput } from '@/ai/flows/assistant-flow';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  englishText: string;
  malayalamText: string;
  link?: string;
}

function AdvancedAssistantChat() {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, boolean>>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;
    setIsLoading(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      englishText: input,
      malayalamText: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const result: AssistantOutput = await assistantFlow({ query: input });
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        englishText: result.englishResponse,
        malayalamText: result.malayalamResponse,
        link: result.link,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling assistant flow:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: t.assistantError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };
  
  const toggleTranslation = (id: string) => {
      setTranslatedMessages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
            const isTranslated = translatedMessages[message.id];
            const currentText = language === 'en' 
                ? (isTranslated ? message.malayalamText : message.englishText)
                : (isTranslated ? message.englishText : message.malayalamText);

            return (
                <div
                    key={message.id}
                    className={`flex flex-col gap-2 ${
                        message.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                >
                    <div className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {message.sender === 'assistant' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <MessageCircle size={18} />
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            message.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                        >
                            <p className="text-sm">{currentText}</p>
                        </div>
                        {message.sender === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    <User size={18} />
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                    {message.sender === 'assistant' && (
                        <div className="flex items-center gap-2 -mt-1 ml-12">
                            <Button variant="ghost" size="sm" onClick={() => toggleTranslation(message.id)} className="flex items-center gap-1 text-xs h-auto py-1 px-2 text-muted-foreground">
                               <Languages className="h-3 w-3" />
                               {language === 'en' ? (isTranslated ? 'Show in English' : 'Malayalam') : (isTranslated ? 'Show in Malayalam' : 'English')}
                            </Button>
                            {message.link && (
                                <Button asChild variant="outline" size="sm" className="flex items-center gap-1 text-xs h-auto py-1 px-2 text-muted-foreground">
                                    <Link href={message.link} target="_blank" rel="noopener noreferrer">
                                        {t.learnMore} <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )
        })}
        {isLoading && (
            <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        <MessageCircle size={18} />
                    </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-background">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.askYourAssistant}
            className="pr-12"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleSend}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AssistantContent() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <AppShell title={t.conversationalAssistant} activePage="assistant">
      <main className="flex flex-1 flex-col bg-muted/20 h-full">
        <AdvancedAssistantChat />
      </main>
    </AppShell>
  );
}
