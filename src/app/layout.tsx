import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import VirtualKeyboard from '@/components/virtual-keyboard';
import { KeyboardProvider } from '@/context/keyboard-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'உழவர் நண்பன்',
  description: "An AI-powered personal farming assistant for Tamilnadu, Tenkasi's farmers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <KeyboardProvider>
            {children}
            <VirtualKeyboard />
          </KeyboardProvider>
        </Providers>
      </body>
    </html>
  );
}
