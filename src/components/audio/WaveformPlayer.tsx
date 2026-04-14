'use client';

import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useAudio } from '@/context/AudioContext';

export function WaveformPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const { currentTrack, audioRef } = useAudio();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !audioRef.current) return;

    // Destroy existing instance before creating a new one for the new track
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    const ws = WaveSurfer.create({
      container: containerRef.current,
      media: audioRef.current,
      waveColor: '#262626',
      progressColor: '#ffffff',
      cursorColor: 'transparent',
      barWidth: 3,
      barGap: 3,
      barRadius: 2,
      height: 40,
      normalize: false,
      interact: true,
      dragToSeek: true,
    });

    wavesurferRef.current = ws;

    ws.on('ready', () => {
      setIsLoading(false);
      setDuration(ws.getDuration());
    });

    ws.on('loading', () => setIsLoading(true));
    
    ws.on('audioprocess', () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on('seeking', () => {
      setCurrentTime(ws.getCurrentTime());
    });

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, [audioRef, currentTrack]); // Added currentTrack as a dependency

  // Update duration when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateDuration = () => setDuration(audio.duration || 0);
      audio.addEventListener('loadedmetadata', updateDuration);
      return () => audio.removeEventListener('loadedmetadata', updateDuration);
    }
  }, [currentTrack, audioRef]);

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center gap-4 relative h-12">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <span className="text-xs text-muted-foreground w-12 font-mono">
          {formatTime(currentTime)}
        </span>
        <div ref={containerRef} className="flex-1 min-h-[40px]" />
        <span className="text-xs text-muted-foreground w-12 font-mono text-right">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
