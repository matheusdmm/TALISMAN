"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Track, Album, albums } from "@/data/albums";

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  currentAlbum: Album | null;
  playNext: () => void;
  playPrevious: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const currentAlbum = currentTrack 
    ? albums.find(a => a.id === currentTrack.albumId) || null 
    : null;

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(prev => {
      if (prev?.id === track.id) {
        setIsPlaying(p => !p);
        return prev;
      }
      setIsPlaying(true);
      return track;
    });
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const playNext = useCallback(() => {
    if (!currentTrack || !currentAlbum) return;
    const currentIndex = currentAlbum.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < currentAlbum.tracks.length - 1) {
      setCurrentTrack(currentAlbum.tracks[currentIndex + 1]);
      setIsPlaying(true);
    }
  }, [currentTrack, currentAlbum]);

  const playPrevious = useCallback(() => {
    if (!currentTrack || !currentAlbum) return;
    const currentIndex = currentAlbum.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(currentAlbum.tracks[currentIndex - 1]);
      setIsPlaying(true);
    }
  }, [currentTrack, currentAlbum]);

  return (
    <AudioContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      volume, 
      playTrack, 
      togglePlay, 
      setVolume,
      currentAlbum,
      playNext,
      playPrevious
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
