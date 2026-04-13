"use client";

import React from "react";
import { albums } from "@/data/albums";
import Image from "next/image";
import Link from "next/link";

export function AlbumGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-t border-l border-border/50">
      {albums.map((album) => (
        <Link key={album.id} href={`/album/${album.id}`} className="group relative aspect-square overflow-hidden border-r border-b border-border/50 bg-background">
          {/* Cover Image */}
          <div className="absolute inset-0 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out opacity-60 group-hover:opacity-100">
            <Image
              src={album.coverUrl}
              alt={album.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Monumental Text Overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-background/80 via-transparent to-transparent group-hover:from-background/95 transition-all duration-500">
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="block text-[10px] font-black tracking-[0.3em] text-primary mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                RELEASED {album.releaseYear}
              </span>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-[0.85] text-foreground">
                {album.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h3>
            </div>
          </div>

          {/* Brutalist Border Accent */}
          <div className="absolute inset-0 border-[16px] border-foreground opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
          
          {/* Index Number */}
          <div className="absolute top-6 right-6 text-[10px] font-black tracking-widest text-muted-foreground/30 group-hover:text-primary transition-colors">
            VOL. {(albums.indexOf(album) + 1).toString().padStart(2, '0')}
          </div>
        </Link>
      ))}
    </div>
  );
}
