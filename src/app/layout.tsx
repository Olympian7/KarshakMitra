import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import VirtualKeyboard from '@/components/virtual-keyboard';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Karshak Mitra',
  description: "An AI-powered personal farming assistant for Kerala's farmers.",
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
          <main className="transition-[padding] duration-300 ease-in-out pb-[var(--virtual-keyboard-height,0px)]">
            {children}
          </main>
          <VirtualKeyboard />
        </Providers>
      </body>
    </html>
  );
}
