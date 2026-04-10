import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-accent/5 px-8 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-2">
          <h4 className="font-black text-lg tracking-tight">TALISMAN</h4>
          <p className="text-sm text-muted-foreground max-w-sm">
            An open-source starter kit for indie bands. Built for lossless audio, 
            immersive listening experiences, and independent artists.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Connect</h5>
          <div className="flex flex-col gap-1 text-sm">
            <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-primary transition-colors">Bandcamp</Link>
            <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Talisman Project. Built with passion.</p>
        <p className="uppercase tracking-widest">v0.1.0</p>
      </div>
    </footer>
  );
}
