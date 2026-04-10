# Talisman Starter Kit

Talisman is a raw, no-nonsense digital stage for the music you make. No bloated metrics, no corporate templates, no filler. Just a direct line between the speakers and the listener. Built for bands that prefer the basement over the boardroom.

## Features

- **Sonic Visualization:** Real-time waveform rendering for every track, powered by `wavesurfer.js`.
- **Global Audio Persistence:** A sticky player that keeps the music alive while you navigate through albums and tracklists.
- **Admin Control Room:** A dedicated dashboard at `/admin` to manage your discography. Export/Import your `albums.json` without touching a single bracket.
- **Atmospheric Depth:** An immersive, low-light aesthetic that lets the music do the heavy lifting.
- **Dynamic Routing:** Unique, shareable links for every album and release.
- **Mobile-First Mechanics:** Intuitive controls designed for thumb-flick navigation—swipe to close, tap to play.
- **Fast & Unapologetic:** Minimal code, maximum output. Built with React 19 and Next.js 16.

## Technologies Used

- **Next.js (App Router):** High-performance framework for the modern web.
- **React 19:** The latest in UI component logic and server actions.
- **Tailwind CSS 4:** Utility-first styling for that raw, industrial look.
- **WaveSurfer.js:** Professional audio visualization and playback engine.
- **Lucide React:** Clean, sharp iconography for navigation.
- **TypeScript:** Ensuring your data structures don't break mid-solo.

## The Admin Dashboard (`/admin`)

Managing a discography shouldn't feel like debugging a mainframe. Access the Admin Dashboard to:
- **Add Albums:** Quickly create new releases with covers and descriptions.
- **Manage Tracks:** Drop in track titles, audio URLs (local or hosted), and durations.
- **JSON Sync:** Download your updated `albums.json` and drop it into `src/data/albums.json`. No more syntax errors.
- **Self-Hosting Guide:** Built-in instructions on where to put your MP3s and JPGs.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd talisman
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment & Performance

Talisman is built to live on the edge. While it runs anywhere, it's optimized for **Vercel** to ensure your music reaches the listener without lag.

- **Zero-Config Deployment:** Push your code to GitHub, connect to Vercel, and you're live. No server management, no headaches.
- **Global Edge Network:** Your audio assets and cover art are served from the edge, meaning low latency whether your fans are in a basement in Berlin or a rooftop in Tokyo.
- **Automatic Rebuilds:** Every time you update `albums.json` or drop new tracks into your repo, Vercel triggers a fresh build instantly.

Simply click the **Deploy** button on Vercel and point it to your fork.

## Data & Assets

To update the band's discography, use the `/admin` route or manually modify `src/data/albums.json`. 

Place your local assets in the `public` folder:
- **Covers:** `public/audio/[album-id]/cover.jpg`
- **Audio:** `public/audio/[album-id]/[track-filename].mp3`

## License

This project is open-source and licensed under the [MIT License](LICENSE).
