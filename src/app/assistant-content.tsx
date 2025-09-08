'use client';

import {
  MessageCircle,
  Send,
  User,
  Languages,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { assistantFlow } from '@/ai/flows/assistant-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  malayalamText?: string;
  englishText?: string;
  currentLang?: 'ml' | 'en';
}

function AssistantChat() {
  const { language } = useLanguage();
  const t = translations[language];

  const getInitialMessage = (): Message => ({
    id: 'init',
    text: language === 'ml' ? translations.ml.assistantWelcome : translations.en.assistantWelcome,
    sender: 'assistant',
    malayalamText: translations.ml.assistantWelcome,
    englishText: translations.en.assistantWelcome,
    currentLang: language,
  });

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update welcome message text when language changes
  useEffect(() => {
    setMessages(prev => {
        if (prev.length > 0 && prev[0].id === 'init') {
            return [getInitialMessage(), ...prev.slice(1)];
        }
        return [getInitialMessage()];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);


  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await assistantFlow({ query: input });
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'ml' ? result.malayalamResponse : result.englishResponse,
        sender: 'assistant',
        malayalamText: result.malayalamResponse,
        englishText: result.englishResponse,
        currentLang: language,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response from assistant:', error);
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t.assistantError,
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const handleTranslate = (messageId: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId && msg.sender === 'assistant') {
        const newLang = msg.currentLang === 'ml' ? 'en' : 'ml';
        return {
          ...msg,
          currentLang: newLang,
          text: newLang === 'ml' ? msg.malayalamText! : msg.englishText!,
        };
      }
      return msg;
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'justify-end' : ''
            }`}
          >
            {message.sender === 'assistant' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <MessageCircle size={18} />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] relative group ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.text}</p>
               {message.sender === 'assistant' && message.englishText && message.malayalamText && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleTranslate(message.id)}
                  title={t.translate}
                  >
                  <Languages className="h-4 w-4" />
                </Button>
              )}
            </div>
             {message.sender === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User size={18} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-3">
                 <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-primary text-primary-foreground">
                         <MessageCircle size={18} />
                     </AvatarFallback>
                 </Avatar>
                 <div className="rounded-lg px-4 py-2 bg-muted w-40">
                    <Skeleton className="h-4 w-full" />
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
            <Send className="h-4 w-4" />
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
        <AssistantChat />
      </main>
    </AppShell>
  );
}
