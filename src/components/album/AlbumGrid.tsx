"use client";

import React from "react";
import { albums } from "@/data/albums";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export function AlbumGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
      {albums.map((album) => (
        <Link key={album.id} href={`/album/${album.id}`}>
          <Card className="group cursor-pointer overflow-hidden border-none bg-transparent hover:bg-accent/10 transition-colors">
            <CardContent className="p-0">
              <div className="relative aspect-square rounded-md overflow-hidden mb-3">
                <Image
                  src={album.coverUrl}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col space-y-1 px-1">
                <h3 className="font-bold text-lg leading-none">{album.title}</h3>
                <p className="text-sm text-muted-foreground">{album.releaseYear}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
