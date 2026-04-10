<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Agent Instructions

Keep this project as agent-agnostic as possible.

## Rule: Context Maintenance

At the end of every significant task or session, summarize the current state, architectural decisions made, and pending "todo" items into AGENTS.md. Always ensure this file reflects the "ground truth" of the project so future sessions can resume without friction. Use the writeFile tool to overwrite it so the next session starts with current state.

## Rule: Commits

- Always use conventional commits (e.g. `feat:`, `fix:`, `docs:`, `chore:`)
- Never add anything agent related (copilot, claude, etc.) to commit messages or co-authorship
- Committing directly to main is okay in this repo

## Rule: Environment

- Use `/usr/bin/open` (full path) to open files or URLs on macOS — never plain `open`

## Rule: Secrets

- Never commit secrets, config files, or database files

---

## Operational Rules

- **Analysis:** Read files once before writing. Never re-read unless changed. Internalize structure to avoid redundant reads or write-delete-rewrite cycles.
- **Precision:** Prefer targeted edits over full rewrites. No over-engineering.
- **Reasoning:** Thorough internally, concise in output. If uncertain, say so — never hallucinate paths, APIs, or data.
- **Validation:** Test before declaring done. One fix/verify cycle maximum.
- **Directives:** No fluff, openers, or closings. User instructions override all rules.
- **Constraints:** Max 50 tool calls. Single focused pass per task.

---

## Project State

> **Update this section at the end of every significant task or session.**

### Current State

Talisman is a music portfolio/player application built for bands. It features a landing page, dedicated album pages with waveform visualization, and a persistent audio player. The latest session successfully resolved critical iOS/Safari audio bugs, ensuring seamless track advancement and UI stability by implementing persistent WaveSurfer instances and direct user-gesture audio triggers.

### Architecture

- **Framework:** Next.js 16 (App Router) with React 19.
- **Styling:** Tailwind CSS 4.
- **Audio Engine:** Persistent WaveSurfer instance synced with a global HTML5 Audio element to prevent flickering and state conflicts.
- **Mobile Precision:** Responsive layouts using `100dvh` and transparent body backgrounds to ensure full-screen animated depth on mobile browsers.
- **State Management:** `AudioContext` with direct-action playback triggers (bypassing `useEffect` for `play()` calls) to satisfy mobile browser security policies.
- **UI Components:** Minimalist, high-performance components optimized for touch and momentum scrolling.

### Pending

- Populate the admin dashboard logic (currently placeholder).
- Implement real-time waveform data caching for instant loads.
- Add "share" functionality for specific tracks or timestamps.





