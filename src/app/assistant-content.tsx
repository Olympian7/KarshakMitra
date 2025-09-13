
'use client';

import React, { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { MessageCircle, User, Send, Languages, Loader2, ExternalLink, Speaker, Square } from 'lucide-react';
import { assistantFlow, AssistantOutput } from '@/ai/flows/assistant-flow';
import { generateSpeech } from '@/ai/flows/tts-flow';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { getOfflineResponse } from '@/lib/offline-data';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  englishText: string;
  malayalamText: string;
  link?: string;
}

const initialMessage: Message = {
  id: `assistant-initial-${Date.now()}`,
  sender: 'assistant',
  englishText: "Hello! I am your Karshak Mitra assistant. How can I help you today?",
  malayalamText: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കർഷക മിത്രയാണ്. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കണം?",
};


function AdvancedAssistantChat() {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, boolean>>({});
  const [isOnline, setIsOnline] = useState(true);

  const [audioState, setAudioState] = useState<{ [key: string]: 'idle' | 'loading' | 'playing' }>({});
  const [audioData, setAudioData] = useState<{ [key: string]: string }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Set initial online state
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Audio cleanup
    const audioEl = audioRef.current;
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (audioEl) {
        audioEl.pause();
        audioEl.src = '';
      }
    };
  }, []);


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
        let assistantMessage: Message;
        if (!isOnline) {
            const offlineResponse = getOfflineResponse(input);
            assistantMessage = {
                id: `assistant-${Date.now()}`,
                sender: 'assistant',
                englishText: offlineResponse.en,
                malayalamText: offlineResponse.ml,
            };
        } else {
            const result: AssistantOutput = await assistantFlow({ query: input });
            assistantMessage = {
                id: `assistant-${Date.now()}`,
                sender: 'assistant',
                englishText: result.englishResponse,
                malayalamText: result.malayalamResponse,
                link: result.link,
            };
        }
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
      stopAudio();
      setTranslatedMessages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const stopAudio = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    setAudioState(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => {
            if (newState[key] === 'playing') newState[key] = 'idle';
        });
        return newState;
    });
  };

  const handlePlayAudio = async (messageId: string, text: string, lang: 'en' | 'ml') => {
    stopAudio();
    const uniqueId = `${messageId}-${lang}`;

    if (audioData[uniqueId]) {
      // Audio is cached, just play it
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = stopAudio;
      }
      audioRef.current.src = audioData[uniqueId];
      audioRef.current.play();
      setAudioState(prev => ({ ...prev, [uniqueId]: 'playing' }));
      return;
    }

    setAudioState(prev => ({ ...prev, [uniqueId]: 'loading' }));
    try {
        const result = await generateSpeech({ text, language: lang });
        if (result && result.audioDataUri) {
            setAudioData(prev => ({ ...prev, [uniqueId]: result.audioDataUri }));
            
            if (!audioRef.current) {
                audioRef.current = new Audio();
                audioRef.current.onended = stopAudio;
            }
            audioRef.current.src = result.audioDataUri;
            audioRef.current.play();
            setAudioState(prev => ({ ...prev, [uniqueId]: 'playing' }));
        } else {
            throw new Error("No audio data received.");
        }
    } catch (error) {
        console.error("Error generating speech:", error);
        toast({
            variant: "destructive",
            title: "Speech Error",
            description: "Could not generate audio for this message.",
        });
        setAudioState(prev => ({ ...prev, [uniqueId]: 'idle' }));
    }
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
            const isTranslated = translatedMessages[message.id];
            const currentLang = language === 'en' ? (isTranslated ? 'ml' : 'en') : (isTranslated ? 'en' : 'ml');
            const currentText = currentLang === 'en' ? message.englishText : message.malayalamText;
            const uniqueId = `${message.id}-${currentLang}`;
            const currentAudioState = audioState[uniqueId] || 'idle';

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
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => currentAudioState === 'playing' ? stopAudio() : handlePlayAudio(message.id, currentText, currentLang)}
                                className="flex items-center gap-1 text-xs h-auto py-1 px-2 text-muted-foreground"
                            >
                                {currentAudioState === 'loading' && <Loader2 className="h-3 w-3 animate-spin" />}
                                {currentAudioState === 'playing' && <Square className="h-3 w-3" />}
                                {currentAudioState === 'idle' && <Speaker className="h-3 w-3" />}
                                {t.playAudio}
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
         {!isOnline && (
            <div className="text-center text-xs text-muted-foreground mb-2">
              You are currently offline. Responses are limited.
            </div>
          )}
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
