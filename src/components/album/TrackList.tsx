"use client";

import React from "react";
import { Track } from "@/data/albums";
import { useAudio } from "@/context/AudioContext";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrackListProps {
  tracks: Track[];
}

export function TrackList({ tracks }: TrackListProps) {
  const { currentTrack, isPlaying, playTrack: playTrackAction, togglePlay } = useAudio();
  const [dynamicDurations, setDynamicDurations] = React.useState<Record<string, number>>({});

  const formatTime = (seconds: number) => {
    if (!seconds || seconds === 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  React.useEffect(() => {
    tracks.forEach(track => {
      if (track.duration === 0 && !dynamicDurations[track.id]) {
        const audio = new Audio(track.audioUrl);
        audio.onloadedmetadata = () => {
          setDynamicDurations(prev => ({
            ...prev,
            [track.id]: audio.duration
          }));
        };
      }
    });
  }, [tracks, dynamicDurations]);

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrackAction(track);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {tracks.map((track, index) => {
        const isActive = currentTrack?.id === track.id;
        const displayDuration = track.duration || dynamicDurations[track.id] || 0;
        
        return (
          <div
            key={track.id}
            onClick={() => playTrack(track)}
            className={`group flex items-center gap-4 px-4 py-5 md:py-3 cursor-pointer transition-all border-b border-border/50 hover:bg-accent/10 active:bg-accent/20 active:scale-[0.98] relative z-10 ${
              isActive ? "bg-accent/20" : ""
            }`}
          >
            <div className="w-8 text-sm text-muted-foreground font-mono">
              {(index + 1).toString().padStart(2, "0")}
            </div>
            
            <div className="flex-1 flex flex-col">
              <span className={`font-medium ${isActive ? "text-primary" : ""}`}>
                {track.title}
              </span>
            </div>

            <div className="text-sm text-muted-foreground font-mono">
              {formatTime(displayDuration)}
            </div>

            <div className="w-10 flex justify-end">
              {isActive && isPlaying ? (
                <Pause className="h-4 w-4 fill-primary text-primary" />
              ) : (
                <Play className={`h-4 w-4 ${isActive ? "fill-primary text-primary" : "text-muted-foreground md:opacity-0 group-hover:opacity-100"}`} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
