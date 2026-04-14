"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
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
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Load initial volume from localStorage on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem("talisman-volume");
    if (savedVolume !== null) {
      const vol = parseFloat(savedVolume);
      setVolumeState(vol);
      if (audioRef.current) audioRef.current.volume = vol;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem("talisman-volume", newVolume.toString());
    if (audioRef.current) audioRef.current.volume = newVolume;
  }, []);

  const playTrack = useCallback((track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack?.id === track.id) {
      if (audio.paused) {
        audio.play().catch(() => {});
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
      return;
    }

    // New track: change source and play immediately
    audio.pause();
    audio.src = track.audioUrl;
    // Don't call .load() on iOS unless necessary, src change + play() is more direct
    audio.play().catch(err => {
      console.error("Playback failed on track change:", err);
    });
    
    setCurrentTrack(track);
    setIsPlaying(true);
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, []);

  const playNext = useCallback(() => {
    if (!currentTrack) return;
    const album = albums.find(a => a.id === currentTrack.albumId);
    if (!album) return;
    
    const currentIndex = album.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < album.tracks.length - 1) {
      const nextTrack = album.tracks[currentIndex + 1];
      playTrack(nextTrack);
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [currentTrack, playTrack]);

  const playPrevious = useCallback(() => {
    if (!currentTrack) return;
    const album = albums.find(a => a.id === currentTrack.albumId);
    if (!album) return;

    const currentIndex = album.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      const prevTrack = album.tracks[currentIndex - 1];
      playTrack(prevTrack);
    } else {
      if (audioRef.current) audioRef.current.currentTime = 0;
    }
  }, [currentTrack, playTrack]);

  const currentAlbum = currentTrack 
    ? albums.find(a => a.id === currentTrack.albumId) || null 
    : null;

  // Stable ended event handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      // In mobile Safari, triggering playNext() from 'ended' should work 
      // if the session was previously blessed by user interaction.
      playNext();
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [playNext]);

  // Sync state with audio element events to keep UI in sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

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
      playPrevious,
      audioRef
    }}>
      {children}
      <audio 
        ref={audioRef} 
        preload="auto"
        style={{ display: 'none' }}
      />
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
