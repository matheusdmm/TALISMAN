import fs from 'fs/promises';
import path from 'path';
import { Album } from '@/data/albums';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const filePath = path.join(process.cwd(), 'src/data/albums.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const albums: Album[] = JSON.parse(fileContent);

  return <AdminClient initialAlbums={albums} />;
}
