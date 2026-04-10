import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-accent/5 px-8 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-2">
          <h4 className="font-black text-lg tracking-tight">TALISMAN</h4>
          <p className="text-sm text-muted-foreground max-w-sm">
            Talisman is a raw, no-nonsense digital stage for the music you make.
            No bloated metrics, no corporate templates, no filler. Just a direct
            line between the speakers and the listener. Built for bands that
            prefer the basement over the boardroom.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Connect
          </h5>
          <div className="flex flex-col gap-1 text-sm">
            <Link href="#" className="hover:text-primary transition-colors">
              Instagram
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Bandcamp
            </Link>
            <Link
              href="https://github.com/matheusdmm/TALISMAN"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Talisman. Built to build.</p>
        <p className="uppercase tracking-widest">v1.0.0</p>
      </div>
    </footer>
  );
}
