
'use client';

import React, { useState } from 'react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { queryHuggingFaceModel } from '@/services/huggingface';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Send } from 'lucide-react';

export default function HuggingFaceContent() {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setResponseText('');
    try {
      const result = await queryHuggingFaceModel(inputText);
      setResponseText(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Error Querying Model',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell title="Hugging Face Integration" activePage="huggingface">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Your Hugging Face Model</CardTitle>
            <CardDescription>
              Enter some text below to send it to your deployed model. The response will appear in the card below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex items-center gap-4">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your prompt here..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send'}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Response</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[150px]">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : responseText ? (
              <p className="whitespace-pre-wrap">{responseText}</p>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                <Bot className="h-10 w-10 mb-2" />
                <p>The model's response will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
