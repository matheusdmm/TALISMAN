"use client";

import React from "react";
import { useAudio } from "@/context/AudioContext";
import { Play, Pause, Volume2, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { WaveformPlayer } from "@/components/audio/WaveformPlayer";
import Image from "next/image";

export function AudioPlayer() {
  const { 
    currentTrack, 
    currentAlbum, 
    isPlaying, 
    togglePlay, 
    volume, 
    setVolume,
    playNext,
    playPrevious
  } = useAudio();

  if (!currentTrack) return null;

  const currentIndex = currentAlbum?.tracks.findIndex(t => t.id === currentTrack.id) ?? -1;
  const isFirstTrack = currentIndex === 0;
  const isLastTrack = currentIndex === (currentAlbum?.tracks.length ?? 0) - 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-background border-t border-border px-4 py-2 flex items-center justify-between z-50">
      {/* Current Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        {currentAlbum && (
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src={currentAlbum.coverUrl}
              alt={currentAlbum.title}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-sm truncate">{currentTrack.title}</span>
          <span className="text-xs text-muted-foreground truncate">{currentAlbum?.title}</span>
        </div>
      </div>

      {/* Waveform & Playback Controls */}
      <div className="flex flex-col flex-1 max-w-2xl items-center gap-1">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={playPrevious}
            disabled={isFirstTrack}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            onClick={togglePlay} 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:text-background"
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={playNext}
            disabled={isLastTrack}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <WaveformPlayer />
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 w-1/4 justify-end">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={(val) => setVolume(Array.isArray(val) ? val[0] : val)}
          className="w-24"
        />
      </div>
    </div>
  );
}
