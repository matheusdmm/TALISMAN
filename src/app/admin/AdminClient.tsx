'use client';

import { useState, useRef } from 'react';
import { Album, Track } from '@/data/albums';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Download, Music, Image, Calendar, User, Upload, FileJson } from 'lucide-react';

export default function AdminClient({ initialAlbums }: { initialAlbums: Album[] }) {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    setIsProcessing(true);
    try {
      const dataStr = JSON.stringify(albums, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'albums.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setMessage('File ready for download!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Download failed:', error);
      setMessage('Error generating file');
    }
    setIsProcessing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          setAlbums(json);
          setMessage('JSON loaded successfully!');
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage('Invalid JSON format: Expected an array.');
        }
      } catch (err) {
        setMessage('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addAlbum = () => {
    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title: 'New Album',
      artist: 'Talisman',
      coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80',
      releaseYear: new Date().getFullYear(),
      tracks: []
    };
    setAlbums([...albums, newAlbum]);
  };

  const removeAlbum = (id: string) => {
    if (confirm('Are you sure you want to remove this album?')) {
      setAlbums(albums.filter(a => a.id !== id));
    }
  };

  const updateAlbum = (id: string, updates: Partial<Album>) => {
    setAlbums(albums.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const addTrack = (albumId: string) => {
    setAlbums(albums.map(a => {
      if (a.id === albumId) {
        const newTrack: Track = {
          id: `track-${Date.now()}`,
          albumId: a.id,
          title: 'New Track',
          audioUrl: 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3',
          duration: 30
        };
        return { ...a, tracks: [...a.tracks, newTrack] };
      }
      return a;
    }));
  };

  const removeTrack = (albumId: string, trackId: string) => {
    setAlbums(albums.map(a => {
      if (a.id === albumId) {
        return { ...a, tracks: a.tracks.filter(t => t.id !== trackId) };
      }
      return a;
    }));
  };

  const updateTrack = (albumId: string, trackId: string, updates: Partial<Track>) => {
    setAlbums(albums.map(a => {
      if (a.id === albumId) {
        return {
          ...a,
          tracks: a.tracks.map(t => t.id === trackId ? { ...t, ...updates } : t)
        };
      }
      return a;
    }));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none mb-2">Music Admin</h1>
          <p className="text-muted-foreground font-medium italic">Manage data & download albums.json</p>
        </div>
        <div className="flex items-center gap-3">
          {message && <span className="text-xs font-black uppercase text-primary animate-pulse mr-2">{message}</span>}
          
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 font-black uppercase tracking-tighter"
          >
            <Upload className="size-4" />
            Load JSON
          </Button>

          <Button 
            onClick={handleDownload} 
            disabled={isProcessing} 
            className="gap-2 bg-primary text-primary-foreground font-black uppercase tracking-tighter hover:scale-105 transition-transform px-6 h-10"
          >
            <Download className="size-4" />
            {isProcessing ? 'Generating...' : 'Download albums.json'}
          </Button>
        </div>
      </div>

      <div className="space-y-12">
        {albums.map((album) => (
          <div key={album.id} className="relative group">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Album Info */}
              <div className="w-full lg:w-1/3 space-y-4">
                <div className="aspect-square bg-muted rounded-xl overflow-hidden ring-1 ring-border mb-4 relative group/cover">
                  <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover opacity-80 group-hover/cover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/cover:opacity-100 transition-opacity">
                    <span className="text-xs font-black uppercase text-white tracking-widest">Preview</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Music className="size-3" /> Title
                    </label>
                    <input
                      className="w-full bg-accent/10 border border-border/50 rounded-lg px-3 py-2 text-sm font-bold focus:bg-accent/20 transition-colors"
                      value={album.title}
                      onChange={(e) => updateAlbum(album.id, { title: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <User className="size-3" /> Artist
                    </label>
                    <input
                      className="w-full bg-accent/10 border border-border/50 rounded-lg px-3 py-2 text-sm font-bold focus:bg-accent/20 transition-colors"
                      value={album.artist}
                      onChange={(e) => updateAlbum(album.id, { artist: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3" /> Year
                      </label>
                      <input
                        type="number"
                        className="w-full bg-accent/10 border border-border/50 rounded-lg px-3 py-2 text-sm font-bold focus:bg-accent/20 transition-colors"
                        value={album.releaseYear}
                        onChange={(e) => updateAlbum(album.id, { releaseYear: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <FileJson className="size-3" /> ID
                      </label>
                      <input
                        className="w-full bg-accent/10 border border-border/50 rounded-lg px-3 py-2 text-xs font-mono font-medium opacity-50 focus:opacity-100 transition-opacity"
                        value={album.id}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Image className="size-3" /> Cover URL
                    </label>
                    <input
                      className="w-full bg-accent/10 border border-border/50 rounded-lg px-3 py-2 text-xs font-mono focus:bg-accent/20 transition-colors"
                      value={album.coverUrl}
                      onChange={(e) => updateAlbum(album.id, { coverUrl: e.target.value })}
                    />
                  </div>

                  <Button variant="destructive" size="sm" className="w-full mt-4 font-black uppercase tracking-widest" onClick={() => removeAlbum(album.id)}>
                    <Trash2 className="size-3 mr-2" /> Delete Album
                  </Button>
                </div>
              </div>

              {/* Tracks */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black tracking-tighter uppercase italic">Tracklist</h3>
                  <Button variant="outline" size="xs" onClick={() => addTrack(album.id)} className="font-black uppercase text-[10px] tracking-widest">
                    <Plus className="size-3 mr-1" /> Add Track
                  </Button>
                </div>

                <div className="grid gap-3">
                  {album.tracks.map((track) => (
                    <div key={track.id} className="group/track bg-card border border-border/50 rounded-xl p-4 flex gap-4 items-start transition-all hover:bg-accent/5 hover:border-border">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5 space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Track Title</label>
                          <input
                            className="w-full bg-transparent border-none text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/20 rounded px-1"
                            value={track.title}
                            onChange={(e) => updateTrack(album.id, track.id, { title: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-5 space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Audio Source</label>
                          <input
                            className="w-full bg-transparent border-none text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-primary/20 rounded px-1 opacity-60 focus:opacity-100"
                            value={track.audioUrl}
                            onChange={(e) => updateTrack(album.id, track.id, { audioUrl: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1 text-right">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 block">Secs</label>
                          <input
                            type="number"
                            className="w-full bg-transparent border-none text-sm font-bold text-right focus:outline-none focus:ring-1 focus:ring-primary/20 rounded px-1"
                            value={track.duration}
                            onChange={(e) => updateTrack(album.id, track.id, { duration: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon-xs" 
                        className="text-muted-foreground hover:text-destructive opacity-0 group-track:opacity-100 transition-opacity"
                        onClick={() => removeTrack(album.id, track.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  ))}

                  {album.tracks.length === 0 && (
                    <div className="py-12 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <Music className="size-8 opacity-20" />
                      <p className="text-xs font-black uppercase tracking-widest opacity-40">Empty tracklist</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Divider between albums */}
            <div className="h-px bg-gradient-to-r from-border/0 via-border to-border/0 my-16" />
          </div>
        ))}

        <Button 
          variant="outline" 
          className="w-full py-16 border-dashed border-2 hover:bg-accent/5 hover:border-primary/50 transition-all gap-4 flex flex-col group"
          onClick={addAlbum}
        >
          <div className="size-12 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
            <Plus className="size-6 group-hover:text-primary-foreground transition-colors" />
          </div>
          <div className="text-center">
            <h4 className="font-black uppercase tracking-tighter text-xl">New Album</h4>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Expand your discography</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
