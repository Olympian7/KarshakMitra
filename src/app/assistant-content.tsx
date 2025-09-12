
'use client';

import Link from 'next/link';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Sparkles, MessageCircle, User, Send } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface OfflineMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

const offlineResponses = {
    en: {
        welcome: "I am an offline assistant. I can help with basic questions. For anything complex, please use the Advanced AI Assistant.",
        weather: "You can find the latest weather information on the Dashboard.",
        market: "For the latest crop prices, please visit the Market Trends page.",
        schemes: "Details about government schemes are available on the Government Schemes page.",
        profile: "You can view and edit your farm details on the Farm Profile page.",
        default: "I can only answer basic questions about where to find information in the app. For detailed farming advice, please use the Advanced AI Assistant.",
        greeting: "Hello! How can I help you find something in the app today?"
    },
    ml: {
        welcome: "ഞാനൊരു ഓഫ്‌ലൈൻ സഹായിയാണ്. അടിസ്ഥാനപരമായ ചോദ്യങ്ങൾക്ക് ഞാൻ സഹായിക്കാം. സങ്കീർണ്ണമായവയ്ക്ക്, ദയവായി അഡ്വാൻസ്ഡ് AI അസിസ്റ്റൻ്റ് ഉപയോഗിക്കുക.",
        weather: "ഏറ്റവും പുതിയ കാലാവസ്ഥാ വിവരങ്ങൾ ഡാഷ്‌ബോർഡിൽ കാണാം.",
        market: "ഏറ്റവും പുതിയ വിള വിലകൾക്കായി, മാർക്കറ്റ് ട്രെൻഡ്സ് പേജ് സന്ദർശിക്കുക.",
        schemes: "സർക്കാർ പദ്ധതികളെക്കുറിച്ചുള്ള വിവരങ്ങൾ ഗവൺമെൻ്റ് സ്കീംസ് പേജിൽ ലഭ്യമാണ്.",
        profile: "നിങ്ങളുടെ ഫാം വിവരങ്ങൾ ഫാം പ്രൊഫൈൽ പേജിൽ കാണാനും എഡിറ്റ് ചെയ്യാനും സാധിക്കും.",
        default: "ആപ്പിൽ വിവരങ്ങൾ എവിടെ കണ്ടെത്താം എന്നതിനെക്കുറിച്ചുള്ള അടിസ്ഥാന ചോദ്യങ്ങൾക്ക് മാത്രമേ എനിക്ക് ഉത്തരം നൽകാൻ കഴിയൂ. വിശദമായ കാർഷിക ഉപദേശത്തിനായി, ദയവായി അഡ്വാൻസ്ഡ് AI അസിസ്റ്റൻ്റ് ഉപയോഗിക്കുക.",
        greeting: "നമസ്കാരം! ഇന്ന് ആപ്പിൽ എന്തെങ്കിലും കണ്ടെത്താൻ ഞാൻ എങ്ങനെ സഹായിക്കണം?"
    }
};

function getOfflineResponse(query: string, lang: 'en' | 'ml'): string {
    const lowerQuery = query.toLowerCase();
    const responses = offlineResponses[lang];

    if (lowerQuery.includes('weather') || lowerQuery.includes('കാലാവസ്ഥ')) return responses.weather;
    if (lowerQuery.includes('market') || lowerQuery.includes('price') || lowerQuery.includes('വിപണി') || lowerQuery.includes('വില')) return responses.market;
    if (lowerQuery.includes('scheme') || lowerQuery.includes('പദ്ധതി')) return responses.schemes;
    if (lowerQuery.includes('profile') || lowerQuery.includes('ഫാം')) return responses.profile;
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('നമസ്കാരം')) return responses.greeting;
    
    return responses.default;
}

function OfflineAssistantChat() {
    const { language } = useLanguage();
    const t = translations[language];
    const offlineT = offlineResponses[language];

    const getInitialMessage = (): OfflineMessage => ({
        id: 'init',
        text: offlineT.welcome,
        sender: 'assistant',
    });

    const [messages, setMessages] = useState<OfflineMessage[]>([getInitialMessage()]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    // Update welcome message if language changes
    useEffect(() => {
        setMessages([getInitialMessage()]);
    }, [language, offlineT.welcome]);


    const handleSend = () => {
        if (input.trim() === '') return;

        const userMessage: OfflineMessage = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
        };
        
        const responseText = getOfflineResponse(input, language);
        const assistantMessage: OfflineMessage = {
            id: (Date.now() + 1).toString(),
            text: responseText,
            sender: 'assistant',
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                 <Button asChild className="w-full">
                    <a href="https://karshakmitra-bot.vercel.app/" target="_blank" rel="noopener noreferrer">
                        <Sparkles className="mr-2 h-4 w-4" /> Launch Advanced Assistant
                    </a>
                </Button>
            </div>
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
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                        >
                        <p className="text-sm">{message.text}</p>
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
                />
                <Button
                    type="submit"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={handleSend}
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
        <OfflineAssistantChat />
      </main>
    </AppShell>
  );
}
