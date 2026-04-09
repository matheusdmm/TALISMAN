import React from "react";
import { albums } from "@/data/albums";
import { notFound } from "next/navigation";
import Image from "next/image";
import { TrackList } from "@/components/album/TrackList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params;
  const album = albums.find((a) => a.id === id);

  if (!album) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header / Back Link */}
      <div className="px-8 py-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Discography
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-12 px-8 pb-12">
        {/* Album Artwork */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={album.coverUrl}
              alt={album.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-extrabold tracking-tight">{album.title}</h2>
            <p className="text-xl text-muted-foreground">{album.artist}</p>
            <p className="text-sm text-muted-foreground mt-2">{album.releaseYear}</p>
          </div>
        </div>

        {/* Tracklist */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-border">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tracks</h3>
            <span className="text-xs text-muted-foreground">{album.tracks.length} Songs</span>
          </div>
          <TrackList tracks={album.tracks} />
        </div>
      </div>
    </div>
  );
}
