"use client";

import React, { useState } from "react";
import { useAudio } from "@/context/AudioContext";
import { Play, Pause, Volume2, SkipBack, SkipForward, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import DynamicWaveformPlayer from "@/components/audio/DynamicWaveformPlayer";
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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [prevVolume, setPrevVolume] = useState(0.8);

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientY);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart !== null) {
      const touchEnd = e.changedTouches[0].clientY;
      const distance = touchEnd - touchStart;
      // Close if swipe distance is more than 80px
      if (distance > 80) {
        setIsExpanded(false);
      }
    }
    setTouchStart(null);
  };

  // Return null immediately if no track is active to avoid any "ghost" boxes or shadows
  if (!currentTrack) return null;

  const currentIndex = currentAlbum?.tracks.findIndex(t => t.id === currentTrack.id) ?? -1;
  const isFirstTrack = currentIndex === 0;
  const isLastTrack = currentIndex === (currentAlbum?.tracks.length ?? 0) - 1;

  return (
    <>
      {/* Mobile Expanded View */}
      <div 
        className={cn(
          "fixed inset-0 bg-background z-[100] transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col md:hidden",
          isExpanded ? "translate-y-0" : "translate-y-full"
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col h-[100svh] px-8 pt-2 pb-16 relative">
          {/* Drag Handle */}
          <div className="w-full flex justify-center py-4 absolute top-0 left-0 right-0 z-10" onClick={() => setIsExpanded(false)}>
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* Header/Minimize - Added more spacing */}
          <div className="flex justify-center mb-6 mt-12 min-h-[48px]">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(false)}
              className="h-12 w-12 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
            >
              <ChevronDown className="h-10 w-10" />
            </Button>
          </div>

          {/* Large Artwork */}
          <div className="flex-1 flex items-center justify-center min-h-0 py-4">
            {currentAlbum && (
              <div className="relative aspect-square w-full max-w-[300px] xs:max-w-[320px] rounded-xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50">
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

          {/* Track Info - Only Track Title */}
          <div className="flex flex-col items-center justify-center py-6 text-center z-10">
            <h2 className="text-3xl xs:text-5xl font-black tracking-tighter leading-tight text-white mb-2 drop-shadow-sm px-4">
              {currentTrack.title}
            </h2>
          </div>

          {/* Waveform (Full Width on Mobile) */}
          <div className="w-full px-4 mb-8">
            <DynamicWaveformPlayer />
          </div>

          {/* Controls */}
          <div className="mt-auto pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-around max-w-sm mx-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-16 w-16 text-muted-foreground hover:text-foreground active:scale-90 transition-all" 
                onClick={(e) => { e.stopPropagation(); playPrevious(); }}
                disabled={isFirstTrack}
              >
                <SkipBack className="h-8 w-8 fill-current" />
              </Button>
              <Button 
                onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
                variant="outline" 
                size="icon" 
                className="h-24 w-24 rounded-full bg-foreground text-background active:scale-95 transition-all shadow-2xl border-none"
              >
                {isPlaying ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-16 w-16 text-muted-foreground hover:text-foreground active:scale-90 transition-all" 
                onClick={(e) => { e.stopPropagation(); playNext(); }}
                disabled={isLastTrack}
              >
                <SkipForward className="h-8 w-8 fill-current" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Standard Bar (Minimized/Desktop) */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 h-28 bg-background/95 backdrop-blur-lg border-t border-border z-[90] transition-all duration-500 ease-in-out",
          isExpanded ? "opacity-0 pointer-events-none translate-y-full" : "opacity-100 translate-y-0",
          !currentTrack && "translate-y-full opacity-0"
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
              {currentAlbum?.description && (
                <span className="text-[10px] text-muted-foreground/50 truncate italic hidden md:block">
                  {currentAlbum.description}
                </span>
              )}
            </div>
            {/* Mobile-only play button in minimized bar */}
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }} 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full md:hidden active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </Button>
          </div>

          {/* Vertical Separator 1 */}
          <div className="hidden md:block h-12 w-px bg-border/50 shrink-0" />

          {/* Waveform & Playback Controls (Hidden/Visible on Desktop) */}
          <div className="hidden md:flex flex-col flex-1 max-w-2xl items-center gap-2 px-2">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-accent/20 active:scale-95 transition-transform" 
                onClick={playPrevious}
                disabled={isFirstTrack}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                onClick={togglePlay} 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-foreground text-background hover:scale-105 transition-transform active:scale-95 mx-2"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-accent/20 active:scale-95 transition-transform" 
                onClick={playNext}
                disabled={isLastTrack}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="hidden md:block w-full px-4">
              <DynamicWaveformPlayer />
            </div>
          </div>

          {/* Vertical Separator 2 */}
          <div className="hidden md:block h-12 w-px bg-border/50 shrink-0" />

          {/* Volume Control (Desktop Only) */}
          <div className="hidden md:flex items-center gap-3 w-1/4 justify-end">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={toggleMute}>
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </Button>
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
