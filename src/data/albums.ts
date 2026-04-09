export interface Track {
  id: string;
  albumId: string;
  title: string;
  audioUrl: string;
  duration: number; // in seconds
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  releaseYear: number;
  tracks: Track[];
}

export const albums: Album[] = [
  {
    id: "echoes-of-tomorrow",
    title: "Echoes of Tomorrow",
    artist: "Talisman",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80",
    releaseYear: 2024,
    tracks: [
      {
        id: "eot-1",
        albumId: "echoes-of-tomorrow",
        title: "The Awakening",
        audioUrl: "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3",
        duration: 27,
      },
      {
        id: "eot-2",
        albumId: "echoes-of-tomorrow",
        title: "Neon Skies",
        audioUrl: "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample2.mp3",
        duration: 35,
      },
      {
        id: "eot-3",
        albumId: "echoes-of-tomorrow",
        title: "Starlight Voyage",
        audioUrl: "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3",
        duration: 27,
      },
    ],
  },
  {
    id: "midnight-pulse",
    title: "Midnight Pulse",
    artist: "Talisman",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    releaseYear: 2023,
    tracks: [
      {
        id: "mp-1",
        albumId: "midnight-pulse",
        title: "Shadow Dance",
        audioUrl: "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample2.mp3",
        duration: 35,
      },
      {
        id: "mp-2",
        albumId: "midnight-pulse",
        title: "Electric Pulse",
        audioUrl: "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3",
        duration: 27,
      },
    ],
  },
];
