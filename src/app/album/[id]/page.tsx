import React from 'react';
import { albums } from '@/data/albums';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { TrackList } from '@/components/album/TrackList';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params;
  const album = albums.find((a) => a.id === id);
  const showMovingBg = true;

  if (!album) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {showMovingBg && <div className="bg-depth-animate" />}

      {/* Header / Back Link */}
      <div className="px-6 md:px-8 py-8 flex-none border-b border-border/50">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all group"
        >
          <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-2" />
          Back to Discography
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row min-h-0 flex-1">
        {/* Left Column: Album Info & Artwork */}
        <div className="w-full lg:w-[45%] border-b lg:border-b-0 lg:border-r border-border/50 flex flex-col">
          <div className="p-8 md:p-12 space-y-12">
            {/* Massive Title */}
            <div className="space-y-4">
              <span className="block text-xs font-black tracking-[0.5em] text-primary uppercase">
                {album.artist} / {album.releaseYear}
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-[10vw] font-black tracking-tighter leading-[0.8] uppercase break-words">
                {album.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
            </div>

            {/* Description */}
            {album.description && (
              <div className="max-w-md">
                <p className="text-lg md:text-xl text-muted-foreground leading-tight italic font-medium border-l-4 border-primary/30 pl-6 py-2">
                  {album.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Tracklist */}
        <div className="flex-1 flex flex-col bg-accent/5">
          <div className="p-8 md:p-12 flex-1">
            {/* Brutalist Artwork Block - Moved Here */}
            <div className="relative aspect-square w-full max-w-md mx-auto lg:mx-0 border-[12px] md:border-[20px] border-foreground shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)] mb-12">
              <Image
                src={album.coverUrl}
                alt={album.title}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                priority
              />
            </div>

            <div className="flex items-center justify-between mb-12">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-foreground flex items-center gap-4">
                <span className="w-8 h-px bg-foreground" />
                Tracklist Specification
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground">
                TOTAL TRACKS: {album.tracks.length.toString().padStart(2, '0')}
              </span>
            </div>
            
            <div className="border-l-4 md:border-l-8 border-foreground">
              <TrackList tracks={album.tracks} />
            </div>

            {/* Technical Footer Detail */}
            <div className="mt-12 pt-12 border-t border-border/50 grid grid-cols-2 gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
              <div className="space-y-1">
                <p>Format: High-Fidelity Waveform</p>
                <p>Copyright: (c) {album.releaseYear} Talisman Records</p>
              </div>
              <div className="text-right space-y-1">
                <p>Encoding: 24-bit Analog Capture</p>
                <p>Project: ECHOES-VOID-{album.id.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
