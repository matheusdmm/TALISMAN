import { AlbumGrid } from "@/components/album/AlbumGrid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <section className="px-8 py-12 md:py-24 border-b border-border">
        <h2 className="text-4xl md:text-7xl font-extrabold tracking-tighter mb-4 max-w-4xl">
          ECHOES FROM THE VOID.
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
          Explore the official discography of Talisman. Experience lossless audio, 
          waveform-centric playback, and the journey of our sound.
        </p>
      </section>
      
      <section className="flex-1">
        <div className="px-8 py-8 border-b border-border flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Discography</h3>
        </div>
        <AlbumGrid />
      </section>
    </div>
  );
}
