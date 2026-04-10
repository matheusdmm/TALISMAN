import data from "./albums.json";

export interface Track {
  id: string;
  albumId: string;
  title: string;
  audioUrl: string;
  duration: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  releaseYear: number;
  tracks: Track[];
}

export const albums: Album[] = data as Album[];
