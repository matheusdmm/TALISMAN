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
      <div className="px-6 md:px-8 py-6 flex-none">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Discography
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-12 md:gap-16 px-6 md:px-8 pt-4 md:pt-8 flex-1">
        {/* Album Artwork & Info Header */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="flex flex-row md:flex-col gap-8 md:gap-8 items-center md:items-start">
            <div className="relative w-32 h-32 xs:w-40 xs:h-40 md:w-full md:h-auto md:aspect-square rounded-sm overflow-hidden shadow-2xl border border-border/50 flex-shrink-0">
              <Image
                src={album.coverUrl}
                alt={album.title}
                fill
                sizes="(max-width: 768px) 160px, (max-width: 1200px) 33vw, 25vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h1 className="text-2xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] break-words">
                {album.title}
              </h1>
              <p className="text-lg md:text-2xl text-muted-foreground mt-1 font-medium">{album.artist}</p>
            </div>
          </div>
          
          <div className="hidden md:block">
            {album.description && (
              <p className="mt-4 text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                {album.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
              <span>{album.releaseYear}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>{album.tracks.length} Tracks</span>
            </div>
          </div>
          
          {/* Mobile Description (smaller) */}
          <div className="md:hidden mt-6">
            {album.description && (
              <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1 mb-4">
                {album.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest font-bold">
              <span>{album.releaseYear}</span>
              <span>•</span>
              <span>{album.tracks.length} Tracks</span>
            </div>
          </div>
        </div>

        {/* Tracklist */}
        <div className="flex-1">
          <div className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Tracklist
            </h2>
            <TrackList tracks={album.tracks} />
          </div>
        </div>
      </div>
    </div>
  );
}
