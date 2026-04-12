import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock HTMLAudioElement
global.Audio = vi.fn().mockImplementation(function() {
  return {
    play: vi.fn(),
    pause: vi.fn(),
    load: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    src: '',
    duration: 180, // Mock duration
    onloadedmetadata: null,
  };
}) as any;
