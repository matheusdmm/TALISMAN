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
      <div className="px-8 py-6 flex-none">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Discography
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-12 px-8 pt-8 flex-1 overflow-y-auto scrollbar-hide">
        {/* Album Artwork */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative aspect-square rounded-sm overflow-hidden shadow-2xl border border-border/50">
            <Image
              src={album.coverUrl}
              alt={album.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-8">
            <h1 className="text-4xl font-extrabold tracking-tighter">
              {album.title}
            </h1>
            <p className="text-xl text-muted-foreground mt-1">{album.artist}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>{album.releaseYear}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
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
