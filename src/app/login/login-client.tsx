'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const nextPath = useMemo(() => {
    if (!nextParam) return '/';
    try {
      const decoded = decodeURIComponent(nextParam);
      return decoded.startsWith('/') ? decoded : '/';
    } catch {
      return '/';
    }
  }, [nextParam]);

  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && user) {
    router.replace(nextPath);
    return null;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      router.replace(nextPath);
    } catch (err: any) {
      const message =
        typeof err?.message === 'string'
          ? err.message
          : 'Authentication failed. Please try again.';
      toast({ variant: 'destructive', title: 'Auth error', description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === 'signin' ? 'Sign in' : 'Create account'}</CardTitle>
          <CardDescription>
            {mode === 'signin'
              ? 'Use your email and password to continue.'
              : 'Create an account to save your farm profile and activities.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="text-primary underline underline-offset-4"
                onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
              >
                {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
              </button>
              <Link className="text-muted-foreground hover:text-foreground" href="/">
                Go to dashboard
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

