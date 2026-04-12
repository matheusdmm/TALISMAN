import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TrackList } from './TrackList'
import { useAudio } from '@/context/AudioContext'

// Mock useAudio
vi.mock('@/context/AudioContext', () => ({
  useAudio: vi.fn(),
}))

const mockTracks = [
  {
    id: '1',
    albumId: 'album-1',
    title: 'Track 1',
    audioUrl: '/audio1.mp3',
    duration: 0, // Should be fetched dynamically
  },
  {
    id: '2',
    albumId: 'album-1',
    title: 'Track 2',
    audioUrl: '/audio2.mp3',
    duration: 120, // Already has duration
  },
]

describe('TrackList', () => {
  beforeEach(() => {
    vi.mocked(useAudio).mockReturnValue({
      currentTrack: null,
      isPlaying: false,
      playTrack: vi.fn(),
      togglePlay: vi.fn(),
      setVolume: vi.fn(),
      volume: 0.8,
      currentAlbum: null,
      playNext: vi.fn(),
      playPrevious: vi.fn(),
      audioRef: { current: null } as any,
    })
  })

  it('renders track titles correctly', () => {
    render(<TrackList tracks={mockTracks} />)
    expect(screen.getByText('Track 1')).toBeInTheDocument()
    expect(screen.getByText('Track 2')).toBeInTheDocument()
  })

  it('displays "--:--" initially for tracks with 0 duration', () => {
    render(<TrackList tracks={mockTracks} />)
    // The first track has 0 duration, second has 120 (2:00)
    expect(screen.getByText('--:--')).toBeInTheDocument()
    expect(screen.getByText('2:00')).toBeInTheDocument()
  })

  it('updates duration dynamically when metadata is loaded', async () => {
    let loadedCallback: (() => void) | null = null;
    
    // Mock global Audio to capture the onloadedmetadata callback
    const audioMock = {
      duration: 180, // 3:00
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    
    const OriginalAudio = global.Audio;
    global.Audio = vi.fn().mockImplementation(function() {
        const mock = {
            ...audioMock,
            set onloadedmetadata(cb: any) {
                loadedCallback = cb;
            }
        };
        return mock;
    }) as any;

    render(<TrackList tracks={mockTracks} />)

    // Initially should be --:--
    expect(screen.getByText('--:--')).toBeInTheDocument()

    // Trigger metadata load
    if (loadedCallback) {
        (loadedCallback as any)();
    }

    // Should update to 3:00
    await waitFor(() => {
      expect(screen.getByText('3:00')).toBeInTheDocument()
    })
    
    global.Audio = OriginalAudio;
  })
})
