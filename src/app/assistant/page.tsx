'use client';

import Link from 'next/link';
import {
  Bell,
  ClipboardList,
  Home,
  Landmark,
  LineChart,
  MessageCircle,
  Send,
  User,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { assistantFlow } from '@/ai/flows/assistant-flow';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Set an initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'init',
        text: "Hello! I am your Karshak Mitra assistant. How can I help you today? You can ask me about the weather, market prices, or government schemes.",
        sender: 'assistant',
      },
    ]);
  }, []);


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
        text: result.response,
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response from assistant:', error);
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
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
                <AvatarFallback className="bg-accent text-accent-foreground">
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
            placeholder="Ask your assistant..."
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


export default function AssistantPage() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-primary-foreground md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 4c-2.3 0-4.4.9-6 2.5-1.6 1.6-2.5 3.7-2.5 6 0 2.3.9 4.4 2.5 6 1.6 1.6 3.7 2.5 6 2.5s4.4-.9 6-2.5c1.6-1.6 2.5-3.7 2.5-6 0-2.3-.9-4.4-2.5-6C16.4 4.9 14.3 4 12 4z" />
                <path d="M12 12c-2.3 0-4.4-.9-6-2.5" />
                <path d="M12 12c2.3 0-4.4-.9 6-2.5" />
                <path d="M12 12v10" />
                <path d="M12 12c-2.3 0-4.4.9-6 2.5" />
                <path d="m12 12 6 2.5" />
                <path d="m6 9.5 6 2.5" />
              </svg>
              </div>
              <span className="">Karshak Mitra</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
               <Link
                href="/assistant"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
                Conversational Assistant
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <User className="h-4 w-4" />
                Farm Profile
              </Link>
              <Link
                href="/tracking"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ClipboardList className="h-4 w-4" />
                Activity Tracking
              </Link>
              <Link
                href="/schemes"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Landmark className="h-4 w-4" />
                Government Schemes
              </Link>
              <Link
                href="/market"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Market Trends
              </Link>
            </nav>
          </div>
           <div className="mt-auto p-4">
              <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">N</AvatarFallback>
              </Avatar>
           </div>
        </div>
      </div>
      <div className="flex flex-col h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">
              Conversational Assistant
            </h1>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col bg-muted/40">
          <AssistantChat />
        </main>
      </div>
    </div>
  );
}
