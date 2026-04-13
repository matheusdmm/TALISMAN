'use client';

import { useState, useRef } from 'react';
import { Album, Track } from '@/data/albums';
import { TalismanEvent } from '@/data/events';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Download, Music, Image as ImageIcon, Calendar, User, Upload, FileJson, Info, ExternalLink, RefreshCw, MapPin, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminClient({ 
  initialAlbums, 
  initialEvents 
}: { 
  initialAlbums: Album[]; 
  initialEvents: TalismanEvent[] 
}) {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [events, setEvents] = useState<TalismanEvent[]>(initialEvents);
  const [activeTab, setActiveTab] = useState<'albums' | 'events'>('albums');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = (type: 'albums' | 'events') => {
    setIsProcessing(true);
    try {
      const data = type === 'albums' ? albums : events;
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setMessage(`${type}.json ready!`);
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
          // Heuristic to detect if it's albums or events
          if (json.length > 0 && 'releaseYear' in json[0]) {
            setAlbums(json);
            setActiveTab('albums');
            setMessage('Albums JSON loaded!');
          } else if (json.length > 0 && 'venue' in json[0]) {
            setEvents(json);
            setActiveTab('events');
            setMessage('Events JSON loaded!');
          } else {
            setMessage('Unknown JSON format');
          }
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage('Invalid JSON format: Expected an array.');
        }
      } catch (err) {
        setMessage('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Album functions
  const addAlbum = () => {
    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title: 'New Album',
      artist: 'Talisman',
      coverUrl: '/covers/new-album.jpg',
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
        const trackId = `track-${Date.now()}`;
        const newTrack: Track = {
          id: trackId,
          albumId: a.id,
          title: 'New Track',
          audioUrl: `/audio/${a.id}/new-track.mp3`,
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

  const fetchTrackDuration = (albumId: string, trackId: string, audioUrl: string) => {
    setMessage('Reading file...');
    const audio = new Audio(audioUrl);
    audio.onloadedmetadata = () => {
      updateTrack(albumId, trackId, { duration: Math.floor(audio.duration) });
      setMessage('Duration updated!');
      setTimeout(() => setMessage(''), 2000);
    };
    audio.onerror = () => {
      setMessage('Error reading file');
      setTimeout(() => setMessage(''), 2000);
    };
  };

  const scanAlbumDurations = async (albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    if (!album) return;

    setMessage('Scanning album...');
    
    for (const track of album.tracks) {
      try {
        const audio = new Audio(track.audioUrl);
        await new Promise((resolve) => {
          audio.onloadedmetadata = () => {
            updateTrack(albumId, track.id, { duration: Math.floor(audio.duration) });
            resolve(null);
          };
          audio.onerror = () => resolve(null);
          setTimeout(() => resolve(null), 3000); // Timeout after 3s per track
        });
      } catch (e) {
        console.error(e);
      }
    }
    
    setMessage('All tracks scanned!');
    setTimeout(() => setMessage(''), 2000);
  };

  // Event functions
  const addEvent = () => {
    const newEvent: TalismanEvent = {
      id: `event-${Date.now()}`,
      date: new Date().toISOString(),
      title: 'NEW LIVE SHOW',
      venue: 'VENUE NAME',
      city: 'CITY',
      status: 'UPCOMING',
      link: ''
    };
    setEvents([...events, newEvent]);
    setActiveTab('events');
  };

  const updateEvent = (id: string, updates: Partial<TalismanEvent>) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const removeEvent = (id: string) => {
    if (confirm('Delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const generateLocalPath = (albumId: string, type: 'cover' | 'audio', trackTitle?: string) => {
    if (type === 'cover') {
      return `/audio/${albumId}/cover.jpeg`;
    }
    const cleanTitle = (trackTitle || 'track').toLowerCase().replace(/\s+/g, '-');
    return `/audio/${albumId}/${cleanTitle}.mp3`;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none mb-2 italic">Admin Center</h1>
          <p className="text-muted-foreground font-medium italic">Sync your discography & events to GitHub</p>
        </div>
        <div className="flex items-center gap-3">
          {message && <span className="text-xs font-black uppercase text-primary animate-pulse mr-2">{message}</span>}
          
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2 font-black uppercase tracking-tighter">
            <Upload className="size-4" /> Load JSON
          </Button>

          <Button 
            onClick={() => handleDownload(activeTab)} 
            disabled={isProcessing} 
            className="gap-2 bg-primary text-primary-foreground font-black uppercase tracking-tighter hover:scale-105 transition-transform px-6 h-10 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
          >
            <Download className="size-4" /> {isProcessing ? 'Saving...' : `Download ${activeTab}.json`}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('albums')}
          className={cn(
            "pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative",
            activeTab === 'albums' ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Discography
          {activeTab === 'albums' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={cn(
            "pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative",
            activeTab === 'events' ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Events
          {activeTab === 'events' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
        </button>
      </div>

      <div className="space-y-12">
        {activeTab === 'albums' ? (
          <>
            {albums.map((album) => (
              <div key={album.id} className="relative group">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Album Info */}
                  <div className="w-full lg:w-1/3 space-y-4">
                    <div className="aspect-square bg-muted rounded-xl overflow-hidden ring-1 ring-border mb-4 relative group/cover">
                      {album.coverUrl.startsWith('http') || album.coverUrl.startsWith('/') ? (
                        <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover opacity-80 group-hover/cover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-accent/10 border-2 border-dashed border-border/50 text-muted-foreground p-6 text-center">
                          <ImageIcon className="size-12 mb-2 opacity-20" />
                          <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Local Asset:<br/>{album.coverUrl}</p>
                        </div>
                      )}
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
                            className="w-full bg-accent/10 border border-border/50 rounded-lg px-3 py-2 text-xs font-mono font-medium opacity-50"
                            value={album.id}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <ImageIcon className="size-3" /> Cover Path
                          </label>
                          <button 
                            onClick={() => updateAlbum(album.id, { coverUrl: generateLocalPath(album.id, 'cover') })}
                            className="text-[10px] font-black uppercase text-primary hover:underline"
                          >
                            Use Local
                          </button>
                        </div>
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
                      <div className="flex gap-2">
                        <Button variant="outline" size="xs" onClick={() => scanAlbumDurations(album.id)} className="font-black uppercase text-[10px] tracking-widest">
                          <RefreshCw className="size-3 mr-1" /> Scan All
                        </Button>
                        <Button variant="outline" size="xs" onClick={() => addTrack(album.id)} className="font-black uppercase text-[10px] tracking-widest">
                          <Plus className="size-3 mr-1" /> Add Track
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {album.tracks.map((track) => (
                        <div key={track.id} className="group/track bg-card border border-border/50 rounded-xl p-4 flex gap-4 items-start transition-all hover:bg-accent/5 hover:border-border shadow-sm">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-4 space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Track Title</label>
                              <input
                                className="w-full bg-transparent border-none text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/20 rounded px-1"
                                value={track.title}
                                onChange={(e) => updateTrack(album.id, track.id, { title: e.target.value })}
                              />
                            </div>
                            <div className="md:col-span-6 space-y-1">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Audio Source</label>
                                <button 
                                  onClick={() => updateTrack(album.id, track.id, { audioUrl: generateLocalPath(album.id, 'audio', track.title) })}
                                  className="text-[10px] font-black uppercase text-primary hover:underline"
                                >
                                  Use Local
                                </button>
                              </div>
                              <input
                                className="w-full bg-transparent border-none text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-primary/20 rounded px-1 opacity-60 focus:opacity-100"
                                value={track.audioUrl}
                                onChange={(e) => updateTrack(album.id, track.id, { audioUrl: e.target.value })}
                              />
                            </div>
                            <div className="md:col-span-2 space-y-1 text-right">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 block">Secs</label>
                                <button 
                                  onClick={() => fetchTrackDuration(album.id, track.id, track.audioUrl)}
                                  className="text-[10px] font-black uppercase text-primary hover:underline"
                                >
                                  Scan
                                </button>
                              </div>
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
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive h-8 w-8"
                            onClick={() => removeTrack(album.id, track.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-border/0 via-border to-border/0 my-16" />
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full py-16 border-dashed border-2 hover:bg-accent/5 hover:border-primary/50 transition-all gap-4 flex flex-col group rounded-3xl"
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
          </>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Date Input */}
                    <div className="md:w-1/4 space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3" /> Event Date
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full bg-accent/10 border border-border/50 rounded-lg px-3 py-2 text-sm font-bold focus:bg-accent/20 transition-colors"
                        value={new Date(event.date).toISOString().slice(0, 16)}
                        onChange={(e) => updateEvent(event.id, { date: new Date(e.target.value).toISOString() })}
                      />
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <Tag className="size-3" /> Event Title
                        </label>
                        <input
                          className="w-full bg-accent/10 border border-border/50 rounded-lg px-3 py-2 text-sm font-bold focus:bg-accent/20 transition-colors"
                          value={event.title}
                          onChange={(e) => updateEvent(event.id, { title: e.target.value.toUpperCase() })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="size-3" /> Venue & City
                        </label>
                        <div className="flex gap-2">
                          <input
                            className="w-full bg-accent/10 border border-border/50 rounded-lg px-3 py-2 text-sm font-bold focus:bg-accent/20 transition-colors"
                            value={event.venue}
                            onChange={(e) => updateEvent(event.id, { venue: e.target.value.toUpperCase() })}
                            placeholder="Venue"
                          />
                          <input
                            className="w-full bg-accent/10 border border-border/50 rounded-lg px-3 py-2 text-sm font-bold focus:bg-accent/20 transition-colors"
                            value={event.city}
                            onChange={(e) => updateEvent(event.id, { city: e.target.value.toUpperCase() })}
                            placeholder="City"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Meta & Actions */}
                    <div className="md:w-1/4 flex flex-col justify-between">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <ExternalLink className="size-3" /> Ticket Link
                        </label>
                        <input
                          className="w-full bg-accent/10 border border-border/50 rounded-lg px-3 py-2 text-[10px] font-mono focus:bg-accent/20 transition-colors"
                          value={event.link || ''}
                          onChange={(e) => updateEvent(event.id, { link: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <select 
                          className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none"
                          value={event.status}
                          onChange={(e) => updateEvent(event.id, { status: e.target.value as any })}
                        >
                          <option value="UPCOMING">Upcoming</option>
                          <option value="SOLD OUT">Sold Out</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeEvent(event.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button 
                variant="outline" 
                className="w-full py-12 border-dashed border-2 hover:bg-accent/5 hover:border-primary/50 transition-all gap-4 flex flex-col group rounded-2xl"
                onClick={addEvent}
              >
                <div className="size-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                  <Plus className="size-5 group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="text-center">
                  <h4 className="font-black uppercase tracking-tighter text-lg">Add New Event</h4>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Self-Hosting Guide */}
      <div className="mt-20 p-8 bg-accent/5 rounded-3xl border border-border/50 border-dashed">
        <div className="flex items-center gap-2 mb-4">
          <Info className="size-5 text-primary" />
          <h2 className="text-xl font-black uppercase tracking-tighter">Self-Hosting & GitHub Guide</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold uppercase text-xs mb-1 text-primary">1. Download & Replace</h3>
              <p className="text-muted-foreground leading-relaxed">Download the <code className="bg-accent/20 px-1 rounded">{activeTab}.json</code> and replace the file at <code className="bg-accent/20 px-1 rounded">src/data/{activeTab}.json</code> in your repository.</p>
            </div>
            <div>
              <h3 className="font-bold uppercase text-xs mb-1 text-primary">2. Commit Changes</h3>
              <p className="text-muted-foreground leading-relaxed">Commit the updated JSON files and push to your main branch on GitHub to trigger a redeploy.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold uppercase text-xs mb-1 text-primary">3. Local Assets</h3>
              <p className="text-muted-foreground leading-relaxed">Ensure all audio files and cover images are uploaded to the <code className="bg-accent/20 px-1 rounded">public/audio/[album-id]/</code> folder.</p>
            </div>
            <div>
              <h3 className="font-bold uppercase text-xs mb-1 text-primary">4. Deploy</h3>
              <p className="text-muted-foreground leading-relaxed">Vercel will automatically rebuild and serve your new tracks and events from your own repository.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
