import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';
import { AudioPlayer } from '@/components/layout/AudioPlayer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Talisman | Official Website',
  description:
    'Official website for the band Talisman. High-fidelity audio sharing and discography.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground [padding-top:env(safe-area-inset-top)] [padding-bottom:env(safe-area-inset-bottom)]">
        <AudioProvider>
          <header className="h-16 border-b border-border flex items-center px-8 sticky top-0 bg-background/80 backdrop-blur-md z-40">
            <h1 className="text-3xl font-bold tracking-tighter uppercase">
              Talisman
            </h1>
          </header>
          <main className="flex-1 pb-24">
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </main>
          <AudioPlayer />
        </AudioProvider>
      </body>
    </html>
  );
}
