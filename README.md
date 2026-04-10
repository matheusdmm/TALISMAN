# Talisman Starter Kit

Talisman is a raw, no-nonsense digital stage for the music you make. No bloated metrics, no corporate templates, no filler. Just a direct line between the speakers and the listener. Built for bands that prefer the basement over the boardroom.

## Features

- **Raw Data Control:** Your discography in a clean JSON structure. Edit it in a text editor, not an admin panel.
- **Atmospheric Depth:** An immersive, low-light aesthetic that lets the music do the heavy lifting.
- **Mobile-First Mechanics:** Intuitive controls designed for thumb-flick navigation—swipe to close, tap to play.
- **Persistence:** Remembers your volume so you don't have to.
- **Fast & Unapologetic:** Minimal code, maximum output.

## Technologies Used

- **Next.js (App Router):** Framework for server-rendered, performant web pages.
- **React:** Component-based library for building interactive UIs.
- **Tailwind CSS:** Utility-first framework for rapid, maintainable styling.
- **TypeScript:** Ensures type safety for discography and audio data structures.

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

## Data Configuration

To update the band's discography, modify `src/data/albums.json`. The structure supports albums and track metadata, including audio URLs and track durations.

## License

This project is open-source and licensed under the [MIT License](LICENSE).
