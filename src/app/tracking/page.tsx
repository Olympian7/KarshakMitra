'use client';

import React from 'react';
import {
  ClipboardList,
  Mic,
  CalendarDays,
  ListChecks,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getActivities, Activity } from '@/services/activity';
import { logActivityFlow } from '@/ai/flows/activity-flow';
import { toast } from '@/components/ui/use-toast';
import AppShell from '@/components/app-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';

function ActivityTimeline() {
  const { language } = useLanguage();
  const t = translations[language];

  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const fetchActivities = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedActivities = await getActivities();
      setActivities(fetchedActivities || []); // Ensure we have an array
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load activities.',
      });
      setActivities([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleLogActivity = async (text: string) => {
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      const newActivity = await logActivityFlow({ note: text });
      // After logging, refetch all activities to ensure consistency
      await fetchActivities();
      toast({
        title: t.activityLogged,
        description: newActivity.text,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: t.failedToLogActivity,
      });
    } finally {
      setIsSubmitting(false);
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
          const transcribedText = prompt(t.promptForActivity);
          if (transcribedText) {
            await handleLogActivity(transcribedText);
          }
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({ title: t.recording, description: t.stopRecording });
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          variant: 'destructive',
          title: t.micAccessDenied,
          description: t.enableMic,
        });
      }
    }
  };

  const lastActivityDate = activities.length > 0 ? new Date(activities[0].date).toLocaleDateString() : 'N/A';

  return (
    <div className="grid gap-6 md:grid-cols-3">
    <div className="md:col-span-2">
      <Card className="w-full flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t.activityLog}</CardTitle>
            <CardDescription>{t.activityLogDesc}</CardDescription>
          </div>
          <Button
            onClick={handleMicClick}
            size="icon"
            variant={isRecording ? 'destructive' : 'default'}
            disabled={isLoading || isSubmitting}
            className="rounded-full h-12 w-12 flex-shrink-0"
          >
            <Mic className="h-6 w-6" />
            <span className="sr-only">{isRecording ? t.stopRecording : t.logActivity}</span>
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto min-h-[400px]">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-3/4" />
            </div>
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
                <p>{t.noActivitiesLogged}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
      <div className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>{t.activitySummary}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ListChecks className="h-5 w-5 text-accent"/>
                      <span className="text-sm text-muted-foreground">{t.totalActivities}</span>
                    </div>
                    <span className="font-semibold">{isLoading ? <Skeleton className="h-5 w-8" /> : activities.length}</span>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-accent"/>
                      <span className="text-sm text-muted-foreground">{t.lastEntry}</span>
                    </div>
                    <span className="font-semibold">{isLoading ? <Skeleton className="h-5 w-20" /> : lastActivityDate}</span>
                </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">{t.keepLogging}</p>
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}


export default function TrackingPage() {
  const [isClient, setIsClient] = React.useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <AppShell title={t.activityTracking} activePage="tracking">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {isClient ? <ActivityTimeline /> : 
             <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-3/4" />
                </CardContent>
              </Card>
          }
        </main>
    </AppShell>
  );
}
