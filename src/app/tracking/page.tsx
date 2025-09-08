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
  Plus,
  User,
} from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getActivities, Activity } from '@/services/activity';
import { logActivityFlow } from '@/ai/flows/activity-flow';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

function ActivityTimeline() {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRecording, setIsRecording] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const { toast } = useToast();

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const fetchedActivities = await getActivities();
      setActivities(fetchedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load activities.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchActivities();
  }, []);

  const handleLogActivity = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const newActivity = await logActivityFlow({ note: text });
      setActivities((prev) => [newActivity, ...prev]);
      toast({
        title: 'Activity Logged',
        description: newActivity.text,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to log the activity.',
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
          // In a real app, you'd send this blob to a speech-to-text API.
          // For this demo, we'll use a placeholder and let the user type.
          const transcribedText = prompt("Please type your activity note:", "Watered the coconut trees in the west field.");
          if (transcribedText) {
            await handleLogActivity(transcribedText);
          }
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({ title: 'Recording...', description: 'Click the mic again to stop.' });
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

  return (
    <Card className="border-primary w-full flex-1 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            A timeline of all your farming activities. Click the mic to log a new one.
          </CardDescription>
        </div>
        <Button
          onClick={handleMicClick}
          size="icon"
          variant={isRecording ? 'destructive' : 'default'}
          disabled={isLoading}
          className="rounded-full h-12 w-12"
        >
          <Mic className="h-6 w-6" />
          <span className="sr-only">{isRecording ? 'Stop Recording' : 'Log Activity'}</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {isLoading && activities.length === 0 ? (
          <p>Loading activities...</p>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-px bg-primary/20" />
            {activities.map((activity) => (
              <div key={activity.id} className="relative mb-8 pl-4">
                <div className="absolute -left-7 top-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <p className="font-semibold">{activity.text}</p>
                <p className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleString()}</p>
              </div>
            ))}
            {activities.length === 0 && !isLoading && (
              <p>No activities logged yet. Click the microphone to add your first one!</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default function TrackingPage() {
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
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BotMessageSquare className="h-4 w-4" />
                Conversational Assistant
              </Link>
              <Link
                href="/tracking"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
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
              Activity Tracking
            </h1>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {isClient ? <ActivityTimeline /> : <p>Loading...</p>}
        </main>
      </div>
       <Toaster />
    </div>
  );
}
