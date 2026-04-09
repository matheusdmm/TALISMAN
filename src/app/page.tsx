import { AlbumGrid } from "@/components/album/AlbumGrid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <section className="px-6 py-12 md:px-12 md:py-32 border-b border-border">
        <h2 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 max-w-4xl leading-[0.9]">
          ECHOES FROM THE VOID.
        </h2>
        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl font-medium">
          Explore the official discography of Talisman. Experience lossless audio, 
          waveform-centric playback, and the journey of our sound.
        </p>
      </section>
      
      <section className="flex-1">
        <div className="px-6 md:px-12 py-8 border-b border-border flex justify-between items-center bg-accent/5">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Discography</h3>
        </div>
        <AlbumGrid />
      </section>
    </div>
  );
}
