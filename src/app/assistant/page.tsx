'use client';

import Link from 'next/link';
import {
  Bell,
  BotMessageSquare,
  ClipboardList,
  Home,
  Landmark,
  LineChart,
  Mic,
  Send,
  User,
  Volume2,
  Languages,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { assistantFlow, textToSpeechFlow, translateFlow } from '@/ai/flows/assistant-flow';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Toaster } from '@/components/ui/toaster';

type Message = {
  role: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  language?: 'english' | 'malayalam';
  translatedText?: string;
  isTranslated?: boolean;
};

function AssistantChat() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const audioPlayerRef = React.useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const assistantResult = await assistantFlow({ query: text });
      const audioUrl = await textToSpeechFlow(assistantResult.response);

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: assistantResult.response,
          audioUrl,
          language: assistantResult.language,
        },
      ]);

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioPlayerRef.current = audio;
        audio.play();
      }
    } catch (error) {
      console.error('Error with assistant flow:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the assistant. Have you set your API Key?',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const transcribedText = "Placeholder for transcribed audio"; 
          await handleSendMessage(transcribedText);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser.',
        });
      }
    }
  };

  const playAudio = (audioUrl?: string) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      audio.play();
    }
  };

  const handleTranslate = async (index: number) => {
    const message = messages[index];
    if (message.role !== 'assistant' || !message.language) return;

    if (message.translatedText) {
        const newMessages = [...messages];
        newMessages[index].isTranslated = !newMessages[index].isTranslated;
        setMessages(newMessages);
        return;
    }

    setIsLoading(true);
    try {
        const targetLanguage = message.language === 'english' ? 'malayalam' : 'english';
        const translated = await translateFlow({ text: message.text, targetLanguage });
        
        const newMessages = [...messages];
        newMessages[index].translatedText = translated;
        newMessages[index].isTranslated = true;
        setMessages(newMessages);

    } catch (error) {
        console.error('Translation error:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to translate the message.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="flex-1 flex flex-col border-primary">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <CardDescription>
          Ask me anything about your farm, weather, or market prices.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {msg.role === 'assistant' && (
                  <Avatar>
                    <AvatarFallback>KM</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{msg.isTranslated ? msg.translatedText : msg.text}</p>
                   {msg.role === 'assistant' && msg.audioUrl && (
                    <div className="flex items-center gap-2 mt-2">
                        <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => playAudio(msg.audioUrl)}
                        >
                        <Volume2 className="h-4 w-4" />
                        </Button>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleTranslate(index)}
                        >
                        <Languages className="h-4 w-4" />
                        </Button>
                    </div>
                  )}
                </div>
                 {msg.role === 'user' && (
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3">
                    <Avatar>
                        <AvatarFallback>KM</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-muted max-w-[80%]">
                        <p>Thinking...</p>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="mt-4 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder="Type your message or use the microphone..."
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendMessage(input)}
            disabled={isLoading || !input.trim()}
            aria-label="Send Message"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleMicClick}
            disabled={isLoading}
            variant={isRecording ? 'destructive' : 'outline'}
            aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


export default function AssistantPage() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

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
                href="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <User className="h-4 w-4" />
                Farm Profile
              </Link>
              <Link
                href="/assistant"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <BotMessageSquare className="h-4 w-4" />
                Conversational Assistant
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
        <main className="flex-1 flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-hidden">
           {isClient ? <AssistantChat /> : null}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
