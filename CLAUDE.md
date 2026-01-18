# CLAUDE.md

This file provides context to Claude Code (claude.ai/claude-code) when working on this project.

## Project Overview

**Minecraft Forever World Tracker** is a web app that helps players track their progress toward 100% completion in a Minecraft survival world. It features 600+ tasks organized into 16 progression phases.

**Live site:** https://ibimspumo.github.io/Minecraft-ForeverWorld-Tracker/

## Tech Stack

- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Vanilla CSS** - No frameworks, uses CSS variables and modern features
- **localStorage** - Client-side persistence
- **Service Worker** - Caches Minecraft Wiki icons

## Project Structure

```
src/
├── main.ts          # App entry point, all logic in one file
├── types.ts         # TypeScript interfaces
├── styles.css       # All styling (Minecraft-themed UI)
└── data/            # JSON files for each phase
    ├── first-night.json
    ├── wood-age.json
    ├── stone-age.json
    ├── iron-age.json
    ├── farming.json
    ├── mining.json
    ├── diamond-age.json
    ├── nether.json
    ├── enchanting.json
    ├── brewing.json
    ├── end-prep.json
    ├── the-end.json
    ├── automation.json
    ├── building.json
    ├── collection.json
    └── mastery.json

public/
├── favicon.svg      # Minecraft grass block with checkmark
└── sw.js            # Service Worker for icon caching
```

## Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server (http://localhost:5173)
npm run build  # Build for production (outputs to dist/)
npm run preview # Preview production build
```

## Key Concepts

### Phases
Tasks are grouped into 16 phases representing natural Minecraft progression (First Night → Wood Age → ... → Mastery). Each phase has its own JSON file in `src/data/`.

### Task Structure
```json
{
  "id": "unique-id",
  "text": "Task description shown to user",
  "icon": "minecraft_item_id",
  "description": "Optional tooltip text"
}
```

### Icon Loading
Icons are loaded from the Minecraft Wiki (`minecraft.wiki/images/Invicon_*.png`). Some items use GIF format or have different names - see `WIKI_NAME_MAP` and `GIF_ITEMS` in `main.ts`.

### Multi-World Support
Users can create multiple worlds, each with independent progress. Data is stored in localStorage under key `minecraft-forever-world-tracker`.

## Coding Guidelines

1. **Keep it simple** - This is a single-page app with all logic in `main.ts`. No need for complex architecture.

2. **Minecraft aesthetic** - UI uses inventory slot styling, XP bar progress indicators, and the VT323 pixel font.

3. **Mobile-first** - Always test on mobile. The app should work well on phones.

4. **Icon fallbacks** - If a Minecraft Wiki icon fails to load, an emoji fallback is shown. Update `getFallbackIcon()` if adding new item types.

5. **No external dependencies** - Keep the bundle small. No React, Vue, or UI frameworks.

## Adding New Tasks

1. Edit the appropriate JSON file in `src/data/`
2. Use lowercase snake_case for icon IDs (e.g., `diamond_pickaxe`)
3. Check if the icon exists on minecraft.wiki - some items need special mapping
4. Test locally before pushing

## Deployment

The site deploys automatically to GitHub Pages when pushing to `main`. The GitHub Action (`.github/workflows/deploy.yml`) builds the project and deploys the `dist/` folder.
