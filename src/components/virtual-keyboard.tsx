'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Keyboard, X, Delete, ArrowUp, Type, Minus, Plus, GripVertical } from 'lucide-react';
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

type KeyboardSize = 'sm' | 'md' | 'lg';
const SIZES: KeyboardSize[] = ['sm', 'md', 'lg'];

export default function VirtualKeyboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isShifted, setIsShifted] = useState(false);
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const keyboardRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // State for dragging
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // State for resizing
  const [size, setSize] = useState<KeyboardSize>('md');

  useEffect(() => {
    setIsClient(true);
    // Center keyboard on first open
    if (typeof window !== 'undefined') {
        setPosition({ x: window.innerWidth / 2 - 250, y: window.innerHeight / 2 - 150 });
    }
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

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!keyboardRef.current) return;
    setIsDragging(true);
    const rect = keyboardRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  }, [isDragging, offset]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);


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
  
  const cycleSize = () => {
    const currentIndex = SIZES.indexOf(size);
    const nextIndex = (currentIndex + 1) % SIZES.length;
    setSize(SIZES[nextIndex]);
  };

  if (!isClient) return null;

  const currentLayout = isShifted ? shiftedLayout : malayalamLayout;

  const sizeClasses = {
    sm: { container: 'w-[400px]', key: 'h-8 text-sm', gap: 'gap-0.5' },
    md: { container: 'w-[550px]', key: 'h-10 text-base', gap: 'gap-1' },
    lg: { container: 'w-[700px]', key: 'h-12 text-lg', gap: 'gap-1.5' },
  };

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
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        className={cn(
          'fixed z-[60] bg-muted/95 backdrop-blur-sm border border-border shadow-2xl rounded-lg transition-opacity duration-300 ease-in-out',
          sizeClasses[size].container,
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
            className="flex justify-between items-center p-1 border-b cursor-move"
            onMouseDown={onMouseDown}
        >
            <div className="flex items-center gap-1">
                 <GripVertical className="h-5 w-5 text-muted-foreground" />
                 <h3 className="font-semibold text-sm text-foreground">
                    Virtual Malayalam Keyboard
                </h3>
            </div>
            <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cycleSize}>
                   {size === 'sm' && <Minus className="h-4 w-4" />}
                   {size === 'md' && <span className="font-bold text-xs">M</span>}
                   {size === 'lg' && <Plus className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close Keyboard</span>
                </Button>
            </div>
        </div>

        <div className={cn('p-2 space-y-1', sizeClasses[size].gap)}>
          {currentLayout.map((row, rowIndex) => (
            <div key={rowIndex} className={cn('flex justify-center', sizeClasses[size].gap)}>
              {row.map((key) => (
                <Button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={cn('flex-1 bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground shadow-sm', sizeClasses[size].key)}
                >
                  {key}
                </Button>
              ))}
            </div>
          ))}
          <div className={cn('flex justify-center', sizeClasses[size].gap)}>
            <Button onClick={() => setIsShifted(!isShifted)} className={cn('w-16 shadow', sizeClasses[size].key)} variant={isShifted ? "default" : "secondary"}>
              <ArrowUp className="h-5 w-5" />
            </Button>
            <Button onClick={handleSpacebar} className={cn('flex-1 shadow', sizeClasses[size].key)} variant="secondary">
              <Type className="h-5 w-5" />
            </Button>
            <Button onClick={handleBackspace} className={cn('w-16 shadow', sizeClasses[size].key)} variant="secondary">
              <Delete className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
