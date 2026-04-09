"use client";

import React, { useState } from "react";
import { useAudio } from "@/context/AudioContext";
import { Play, Pause, Volume2, SkipBack, SkipForward, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { WaveformPlayer } from "@/components/audio/WaveformPlayer";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) return null;

  const currentIndex = currentAlbum?.tracks.findIndex(t => t.id === currentTrack.id) ?? -1;
  const isFirstTrack = currentIndex === 0;
  const isLastTrack = currentIndex === (currentAlbum?.tracks.length ?? 0) - 1;

  return (
    <>
      {/* Mobile Expanded View */}
      <div 
        className={cn(
          "fixed inset-0 bg-background z-[100] transition-all duration-500 ease-in-out flex flex-col md:hidden",
          isExpanded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none invisible"
        )}
      >
        <div className="flex flex-col h-full px-8 pt-4 pb-12">
          {/* Header/Minimize */}
          <div className="flex justify-center mb-8">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(false)}
              className="h-10 w-10 text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="h-8 w-8" />
            </Button>
          </div>

          {/* Large Artwork */}
          <div className="flex-1 flex items-center justify-center mb-12">
            {currentAlbum && (
              <div className="relative aspect-square w-full max-w-[320px] rounded-xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50">
                <Image
                  src={currentAlbum.coverUrl}
                  alt={currentAlbum.title}
                  fill
                  sizes="(max-width: 768px) 320px"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight truncate">{currentTrack.title}</h2>
            <p className="text-lg text-muted-foreground font-medium truncate">{currentAlbum?.title}</p>
          </div>

          {/* Waveform (Full Width on Mobile) */}
          <div className="mb-8">
            <WaveformPlayer />
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between px-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12" 
                onClick={playPrevious}
                disabled={isFirstTrack}
              >
                <SkipBack className="h-8 w-8 fill-current" />
              </Button>
              <Button 
                onClick={togglePlay} 
                variant="outline" 
                size="icon" 
                className="h-20 w-20 rounded-full bg-foreground text-background"
              >
                {isPlaying ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12" 
                onClick={playNext}
                disabled={isLastTrack}
              >
                <SkipForward className="h-8 w-8 fill-current" />
              </Button>
            </div>

            {/* Volume in Full Screen */}
            <div className="flex items-center gap-4 px-4">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={(val) => setVolume(Array.isArray(val) ? val[0] : val)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Standard Bar (Minimized/Desktop) */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 h-24 bg-background/95 backdrop-blur-lg border-t border-border z-[90] transition-opacity duration-300",
          isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <div 
          className="max-w-7xl mx-auto h-full flex items-center justify-between gap-6 px-4"
          onClick={() => {
            if (window.innerWidth < 768) setIsExpanded(true);
          }}
        >
          {/* Current Track Info */}
          <div className="flex items-center gap-4 w-full md:w-1/4 min-w-[140px] md:min-w-[180px] cursor-pointer md:cursor-default">
            {currentAlbum && (
              <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0 border border-border/50">
                <Image
                  src={currentAlbum.coverUrl}
                  alt={currentAlbum.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col overflow-hidden flex-1">
              <span className="font-bold text-sm truncate">{currentTrack.title}</span>
              <span className="text-xs text-muted-foreground truncate">{currentAlbum?.title}</span>
            </div>
            {/* Mobile-only play button in minimized bar */}
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }} 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full md:hidden"
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </Button>
          </div>

          {/* Waveform & Playback Controls (Hidden/Visible on Desktop) */}
          <div className="hidden md:flex flex-col flex-1 max-w-2xl items-center gap-1">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-accent/20" 
                onClick={playPrevious}
                disabled={isFirstTrack}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                onClick={togglePlay} 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-foreground text-background hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-accent/20" 
                onClick={playNext}
                disabled={isLastTrack}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <WaveformPlayer />
          </div>

          {/* Volume Control (Desktop Only) */}
          <div className="hidden md:flex items-center gap-3 w-1/4 justify-end">
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
      </div>
    </>
  );
}
