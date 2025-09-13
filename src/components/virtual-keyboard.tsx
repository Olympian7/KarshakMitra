'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Keyboard, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VirtualKeyboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This component should only render on the client to avoid hydration errors
    // with logic that might depend on window/document.
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button to toggle the keyboard */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Virtual Keyboard"
        >
          <Keyboard className="h-6 w-6" />
        </Button>
      </div>

      {/* The Keyboard Panel */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[60] bg-muted border-t border-border shadow-2xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="container mx-auto p-4 max-w-4xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-foreground">
              Virtual Malayalam Keyboard
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close Keyboard</span>
            </Button>
          </div>
          
          {/* Keyboard Body - Placeholder for now */}
          <div className="flex items-center justify-center h-48 bg-background/50 rounded-lg">
            <p className="text-muted-foreground">Keyboard keys will be added here in the next step.</p>
          </div>

        </div>
      </div>
    </>
  );
}
