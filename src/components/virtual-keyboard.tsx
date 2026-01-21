
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Keyboard, X, Delete, ArrowUp, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useKeyboard } from '@/context/keyboard-context';

// Standard Tamil 99 Keyboard Layout (Simplified)
const tamilLayout = [
  ['க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர'],
  ['வ', 'ள', 'ழ', 'ற', 'ன', 'ஜ', 'ஷ', 'ஸ', 'ஹ', 'ஸ்ரீ'],
  ['ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ப்', 'க்', 'ச்', 'ஞ்', 'ட்', 'ண்'],
  ['த்', 'ந்', 'ப்', 'ம்', 'ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்', 'ற்', 'ன்'],
];

const shiftedLayout = [
  ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'ஃ'],
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'],
  ['-', '=', '{', '}', '[', ']', '|', '\\', ';', ':', "'", '"', ',', '.', '/'],
];

export default function VirtualKeyboard() {
  const { isOpen, setIsOpen } = useKeyboard();
  const [isShifted, setIsShifted] = useState(false);
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFocus = useCallback((event: FocusEvent) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      activeInputRef.current = target;
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, [isClient, handleFocus]);

  const handleKeyPress = (key: string) => {
    const input = activeInputRef.current;
    if (!input) return;

    const { selectionStart, selectionEnd, value } = input;
    if (selectionStart === null || selectionEnd === null) return;

    const newValue = value.substring(0, selectionStart) + key + value.substring(selectionEnd);
    input.value = newValue;
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
    
    const newCursorPosition = selectionStart + key.length;
    input.focus();
    input.setSelectionRange(newCursorPosition, newCursorPosition);
  };
  
  const handleBackspace = () => {
    const input = activeInputRef.current;
    if (!input) return;

    const { selectionStart, selectionEnd, value } = input;
    if (selectionStart === null || selectionEnd === null) return;

    let newValue;
    let newCursorPosition;

    if (selectionStart === selectionEnd && selectionStart > 0) {
      newValue = value.substring(0, selectionStart - 1) + value.substring(selectionEnd);
      newCursorPosition = selectionStart - 1;
    } else {
      newValue = value.substring(0, selectionStart) + value.substring(selectionEnd);
      newCursorPosition = selectionStart;
    }
    
    input.value = newValue;
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);

    input.focus();
    input.setSelectionRange(newCursorPosition, newCursorPosition);
  };
  
  const handleSpacebar = () => handleKeyPress(' ');

  if (!isClient) return null;

  const currentLayout = isShifted ? shiftedLayout : tamilLayout;

  return (
    <>
      <div
        className={cn(
          'fixed z-[60] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted/95 backdrop-blur-sm border border-border shadow-2xl rounded-lg transition-opacity duration-300 ease-in-out',
          'min-w-min max-w-3xl', // Increased max-width for better layout
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex justify-between items-center p-1 border-b">
            <h3 className="font-semibold text-sm text-foreground pl-2">
                Virtual Tamil Keyboard
            </h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close Keyboard</span>
            </Button>
        </div>

        <div className={'p-2 space-y-1'}>
          {currentLayout.map((row, rowIndex) => (
            <div key={rowIndex} className={'flex justify-center gap-1'}>
              {row.map((key) => (
                <Button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={cn('h-10 text-base flex-1 min-w-[36px] bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground shadow-sm')}
                >
                  {key}
                </Button>
              ))}
            </div>
          ))}
          <div className={'flex justify-center gap-1'}>
            <Button onClick={() => setIsShifted(!isShifted)} className={cn('w-16 shadow h-10')} variant={isShifted ? "default" : "secondary"}>
              <ArrowUp className="h-5 w-5" />
            </Button>
            <Button onClick={handleSpacebar} className={cn('flex-1 shadow h-10')} variant="secondary">
              <Type className="h-5 w-5" />
            </Button>
            <Button onClick={handleBackspace} className={cn('w-16 shadow h-10')} variant="secondary">
              <Delete className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
