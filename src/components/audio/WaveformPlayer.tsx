"use client";

import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useAudio } from "@/context/AudioContext";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function WaveformPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const { currentTrack, isPlaying, volume, togglePlay, setVolume, playNext } = useAudio();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !currentTrack) return;

    setIsReady(false);
    setIsLoading(true);
    setError(null);

    const audio = new Audio();
    audio.crossOrigin = "anonymous";

    const ws = WaveSurfer.create({
      container: containerRef.current,
      media: audio,
      waveColor: "#4f4f4f",
      progressColor: "#ffffff",
      cursorColor: "#ffffff",
      barWidth: 2,
      barRadius: 3,
      height: 40,
      normalize: true,
      minPxPerSec: 1,
    });

    // Apply current volume immediately to the new instance
    ws.setVolume(volume);

    ws.load(currentTrack.audioUrl).catch((err) => {
      if (err.name === "AbortError") return;
      console.error("Error loading audio:", err);
      setError("Failed to load audio. Please check your connection.");
      setIsLoading(false);
    });
    wavesurferRef.current = ws;

    ws.on("ready", () => {
      setIsReady(true);
      setIsLoading(false);
      setError(null);
      setDuration(ws.getDuration());
      if (isPlaying) {
        ws.play().catch(() => {});
      }
    });

    ws.on("error", (err) => {
      // Ignore AbortError as it's usually intentional (e.g. track change)
      if (err instanceof Error && err.name === "AbortError") return;
      if (typeof err === 'string' && err.includes('AbortError')) return;
      
      console.error("WaveSurfer error:", err);
      setError("An error occurred with the audio player.");
      setIsLoading(false);
    });

    ws.on("audioprocess", () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on("finish", () => {
      playNext();
    });

    const handleResize = () => {
      if (ws) {
        // WaveSurfer v7 handles resize automatically if redraw is called or if it's responsive
        // but an explicit call to draw helps in some edge cases.
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (ws) {
        ws.pause();
        ws.destroy();
      }
      // Explicitly stop and clear the audio element just in case WaveSurfer leaves it hanging
      audio.pause();
      audio.src = "";
      audio.load();
      if (wavesurferRef.current === ws) {
        wavesurferRef.current = null;
      }
    };
  }, [currentTrack, playNext]);

  useEffect(() => {
    if (wavesurferRef.current && isReady) {
      if (isPlaying) {
        wavesurferRef.current.play().catch(() => {});
      } else {
        wavesurferRef.current.pause();
      }
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(volume);
    }
  }, [volume]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center gap-4 relative h-10">
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {error ? (
          <div className="flex-1 flex items-center justify-center text-xs text-destructive font-medium bg-destructive/10 rounded px-4 h-full">
            {error}
          </div>
        ) : (
          <>
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div ref={containerRef} className="flex-1" />
            <span className="text-xs text-muted-foreground w-10">
              {formatTime(duration)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
