import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminClient from './AdminClient'

const mockInitialAlbums = [
  {
    id: 'album-1',
    title: 'Album 1',
    artist: 'Artist 1',
    coverUrl: '/cover1.jpg',
    releaseYear: 2026,
    tracks: [
      {
        id: 'track-1',
        albumId: 'album-1',
        title: 'Track 1',
        audioUrl: '/audio1.mp3',
        duration: 0,
      },
    ],
  },
]

describe('AdminClient', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  it('renders initial albums and tracks', () => {
    render(<AdminClient initialAlbums={mockInitialAlbums} />)
    expect(screen.getByDisplayValue('Album 1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Track 1')).toBeInTheDocument()
  })

  it('scans single track duration', async () => {
    let loadedCallback: (() => void) | null = null;
    
    // Mock global Audio
    const OriginalAudio = global.Audio;
    global.Audio = vi.fn().mockImplementation(function() {
        return {
            duration: 250,
            set onloadedmetadata(cb: any) {
                loadedCallback = cb;
            }
        };
    }) as any;

    render(<AdminClient initialAlbums={mockInitialAlbums} />)
    
    const scanButton = screen.getByText('Scan')
    fireEvent.click(scanButton)

    expect(screen.getByText('Reading file...')).toBeInTheDocument()

    // Trigger metadata load
    if (loadedCallback) {
        (loadedCallback as any)();
    }

    await waitFor(() => {
      expect(screen.getByDisplayValue('250')).toBeInTheDocument()
    })
    expect(screen.getByText('Duration updated!')).toBeInTheDocument()
    
    global.Audio = OriginalAudio;
  })

  it('scans all tracks in an album', async () => {
    let loadedCallback: (() => void) | null = null;
    
    // Mock global Audio
    const OriginalAudio = global.Audio;
    global.Audio = vi.fn().mockImplementation(function() {
        return {
            duration: 300,
            set onloadedmetadata(cb: any) {
                loadedCallback = cb;
            }
        };
    }) as any;

    render(<AdminClient initialAlbums={mockInitialAlbums} />)
    
    const scanAllButton = screen.getByText('Scan All')
    fireEvent.click(scanAllButton)

    expect(screen.getByText('Scanning album...')).toBeInTheDocument()

    // Since it's a loop with await Promise, we need to trigger it
    // In our implementation, it waits for onloadedmetadata
    
    // We need to wait for the first track to be processed
    await waitFor(() => {
        if (loadedCallback) {
            (loadedCallback as any)();
            return true;
        }
        return false;
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('300')).toBeInTheDocument()
    })
    
    await waitFor(() => {
      expect(screen.getByText('All tracks scanned!')).toBeInTheDocument()
    })
    
    global.Audio = OriginalAudio;
  })
})
