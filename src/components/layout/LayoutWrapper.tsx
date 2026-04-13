"use client";

import { useAudio } from "@/context/AudioContext";
import { AudioPlayer } from "@/components/layout/AudioPlayer";
import { cn } from "@/lib/utils";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { currentTrack } = useAudio();

  return (
    <>
      <main className={cn(
        "flex-1 transition-[padding] duration-500 ease-in-out",
        currentTrack ? "pb-24" : "pb-0"
      )}>
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
      <AudioPlayer />
    </>
  );
}
