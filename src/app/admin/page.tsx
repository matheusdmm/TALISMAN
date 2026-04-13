import fs from 'fs/promises';
import path from 'path';
import { Album } from '@/data/albums';
import { TalismanEvent } from '@/data/events';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const albumsPath = path.join(process.cwd(), 'src/data/albums.json');
  const eventsPath = path.join(process.cwd(), 'src/data/events.json');
  
  const albumsContent = await fs.readFile(albumsPath, 'utf-8');
  const eventsContent = await fs.readFile(eventsPath, 'utf-8');
  
  const albums: Album[] = JSON.parse(albumsContent);
  const events: TalismanEvent[] = JSON.parse(eventsContent);

  return <AdminClient initialAlbums={albums} initialEvents={events} />;
}
