'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Keyboard, X, Delete, ArrowUp, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simplified Malayalam Keyboard Layout
const malayalamLayout = [
  ['്', 'ാ', 'ി', 'ീ', 'ു', 'ൂ', 'ൃ', 'െ', 'േ', 'ൈ', 'ൊ', 'ോ', 'ൌ'],
  ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ', 'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ'],
  ['ത', 'ഥ', 'ദ', 'ധ', 'ന', 'പ', 'ഫ', 'ബ', 'ഭ', 'മ'],
  ['യ', 'ര', 'ല', 'വ', 'ശ', 'ഷ', 'സ', 'ഹ', 'ള', 'ഴ', 'റ'],
];

const shiftedLayout = [
  ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'],
  ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ'],
  ['ൺ', 'ൻ', 'ർ', 'ൽ', 'ൾ', 'ക്ക', 'ങ്ക', 'ങ്ങ', 'ച്ച', 'ഞ്ച', 'ഞ്ഞ'],
  ['ട്ട', 'ണ്ട', 'ണ്ണ', 'ത്ത', 'ന്ത', 'ന്ന', 'പ്പ', 'മ്പ', 'മ്മ', 'യ്യ'],
];

export default function VirtualKeyboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isShifted, setIsShifted] = useState(false);
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const keyboardRef = useRef<HTMLDivElement | null>(null);
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

    return () => {
      document.removeEventListener('focusin', handleFocus);
    };
  }, [isClient, handleFocus]);

  useEffect(() => {
    if (keyboardRef.current) {
      const keyboardHeight = isOpen ? keyboardRef.current.offsetHeight : 0;
      document.documentElement.style.setProperty('--virtual-keyboard-height', `${keyboardHeight}px`);
    }
  }, [isOpen]);

  const handleKeyPress = (key: string) => {
    const input = activeInputRef.current;
    if (!input) return;

    const { selectionStart, selectionEnd, value } = input;
    
    if (selectionStart === null || selectionEnd === null) return;

    const newValue = 
      value.substring(0, selectionStart) + 
      key + 
      value.substring(selectionEnd);
      
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
  
  const handleSpacebar = () => {
    handleKeyPress(' ');
  };
  
  if (!isClient) {
    return null;
  }

  const currentLayout = isShifted ? shiftedLayout : malayalamLayout;

  return (
    <>
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

      <div
        ref={keyboardRef}
        className={cn(
          'sticky bottom-0 left-0 right-0 z-[60] bg-muted/95 backdrop-blur-sm border-t border-border shadow-2xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="container mx-auto p-2 sm:p-4 max-w-4xl">
          <div className="flex justify-between items-center mb-2">
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
          
          <div className="space-y-1 sm:space-y-2">
            {currentLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2">
                {row.map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className="h-10 text-lg flex-1 bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground shadow"
                  >
                    {key}
                  </Button>
                ))}
              </div>
            ))}
            <div className="flex justify-center gap-1 sm:gap-2">
               <Button onClick={() => setIsShifted(!isShifted)} className="h-10 w-16 shadow" variant={isShifted ? "default" : "secondary"}>
                  <ArrowUp className="h-5 w-5" />
               </Button>
               <Button onClick={handleSpacebar} className="h-10 flex-1 shadow" variant="secondary">
                  <Type className="h-5 w-5" />
               </Button>
               <Button onClick={handleBackspace} className="h-10 w-16 shadow" variant="secondary">
                  <Delete className="h-5 w-5" />
               </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
