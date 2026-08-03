# Hsin Yael Portfolio OS

A personal portfolio website built as a "Portfolio Operating System" — a pixel-editorial, dossier-style interface for an AI Product Manager. The site presents projects, identity, experiments, and contact information through a fixed-panel dashboard layout with monospaced typography, coordinate annotations, and terminal-style status bars.

## Tech Stack

- **React 19** — UI library
- **Vite 7** — Build tool and dev server
- **TypeScript 5** — Type safety
- **GSAP + @gsap/react** — Scroll and shuffle animations
- **CSS** — Custom properties, grid layout, monospace typography

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/zxi8861-elliot/zxi8861-elliot.github.io.git
cd zxi8861-elliot.github.io

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite dev server. Open the displayed localhost URL to view the portfolio in development mode.

### Build

```bash
npm run build
```

Runs TypeScript type-checking (`tsc -b`) followed by a Vite production build. Output is written to the `dist/` directory.

### Preview

```bash
npm run preview
```

Previews the production build locally.

## Project Structure

```
src/
├── App.tsx              # Root component, renders HomePage
├── pages/
│   └── HomePage.tsx     # Main portfolio dashboard page
├── components/
│   ├── Shuffle.css      # Shuffle animation styles
│   └── Target_cursor.tsx # Custom cursor component
├── styles/
│   └── global.css       # Global styles, CSS variables, grid layout
docs/
└── index.html           # Entry HTML document
stitch_automated_ui_prototyper/
└── dossier_os/
    └── DESIGN.md        # Design system reference (Dossier OS)
```

## Design System

The portfolio follows the **Dossier OS** design language:

- **Fixed 4-column grid** layout (nav rail, index, preview, inspector)
- **Monospaced typography** — Departure Mono for display, JetBrains Mono for body, IBM Plex Mono for labels
- **Electric blue** (`#0500ff`) accent on a monochrome black/white base
- **Terminal-style status bar** with `C:\` paths and coordinate readouts
- **Shuffle animation** for headline text reveals
- **Custom cursor** with parallax and spin effects
- **1px hard-edge borders**, no shadows, flat tonal layers
- **Responsive** — collapses to a stacked single-column layout below 820px

## Features

- **Work mode** — Browse 5 AI product projects with expandable detail dossiers
- **About mode** — Identity profile with metadata blocks
- **Playground mode** — Experiment catalog with status indicators
- **Contact mode** — Email link with copy-to-clipboard contact details
- **Project inspector** — Contact info, tech stack tags, thumbnail grid, status metadata
- **Crosshair overlays** and coordinate labels on preview canvas
- **Custom cursor** with parallax tracking and spin animation
