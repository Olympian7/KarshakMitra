
'use client';

import {
  MessageCircle,
  Send,
  User,
  Languages,
  Sparkles,
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
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  // For user messages, text is the direct input.
  // For assistant messages, this will be dynamically set based on language.
  text: string; 
  malayalamText?: string;
  englishText?: string;
}

function AssistantChat() {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const getInitialMessage = (): Message => ({
    id: 'init',
    text: '', // Text will be derived during render
    sender: 'assistant',
    malayalamText: translations.ml.assistantWelcome,
    englishText: translations.en.assistantWelcome,
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
  }, [messages, language]);


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
        text: '', // Text will be derived during render
        sender: 'assistant',
        malayalamText: result.malayalamResponse,
        englishText: result.englishResponse,
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
  
  const getMessageText = (message: Message) => {
    if (message.sender === 'user' || (!message.englishText && !message.malayalamText)) {
      return message.text;
    }
    return language === 'ml' ? message.malayalamText : message.englishText;
  }

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
              <p className="text-sm">{getMessageText(message)}</p>
               {message.sender === 'assistant' && message.englishText && message.malayalamText && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={toggleLanguage} // Use the global toggle function
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
        <Button asChild className="w-full mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
            <Link href="/advanced-assistant.html" target="_blank" rel="noopener noreferrer">
              Tap for Advanced AI
              <Sparkles className="ml-2 h-4 w-4" />
            </Link>
        </Button>
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
