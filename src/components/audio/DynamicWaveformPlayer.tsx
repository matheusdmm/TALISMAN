'use client';

import dynamic from 'next/dynamic';

const DynamicWaveformPlayer = dynamic(() => import('./WaveformPlayer').then(mod => mod.WaveformPlayer), {
  ssr: false, // wavesurfer.js is client-side only
  loading: () => (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center gap-4 relative h-16">
        <span className="text-xs text-muted-foreground w-12 font-mono">0:00</span>
        <div className="flex-1 min-h-[60px] bg-muted rounded-md flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <span className="text-xs text-muted-foreground w-12 font-mono text-right">0:00</span>
      </div>
    </div>
  ),
});

export default DynamicWaveformPlayer;
