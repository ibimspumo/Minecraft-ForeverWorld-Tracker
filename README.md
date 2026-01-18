# Minecraft Forever World Tracker

Track your journey through a complete Minecraft survival world - from punching your first tree to defeating the Wither and beyond.

![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## Features

- **400+ Tasks** organized into 16 progression phases
- **Multi-World Support** - Track multiple survival worlds separately
- **Progress Persistence** - All progress saved locally in your browser
- **Mobile Optimized** - Works great on phones and tablets
- **Minecraft-Inspired UI** - Authentic inventory slot styling and XP bar progress indicators
- **Search & Filter** - Find specific tasks or view only incomplete/completed items
- **Phase-Based Progression** - Natural gameplay flow from early game to endgame mastery

## Phases

1. **First Night** - Survive your first night in the world
2. **Wood Age** - Establish your base with wood tools and structures
3. **Stone Age** - Upgrade to stone tools and expand capabilities
4. **Iron Age** - Master iron tools and equipment
5. **Farming & Husbandry** - Build sustainable food and animal farms
6. **Deep Mining** - Explore caves and gather precious resources
7. **Diamond Age** - Craft diamond gear and prepare for the Nether
8. **Nether Exploration** - Conquer the dangerous Nether dimension
9. **Enchanting Mastery** - Master the art of enchanting
10. **Brewing & Potions** - Create powerful potions
11. **End Preparation** - Prepare for the ultimate challenge
12. **The End** - Defeat the dragon and explore End cities
13. **Automation & Redstone** - Automate resource gathering
14. **Building & Aesthetics** - Create beautiful builds
15. **Collection & Completion** - Find all biomes, structures, and rare items
16. **Mastery & Challenges** - Complete ultimate challenges and achievements

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/minecraft-forever-world-tracker.git
cd minecraft-forever-world-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist` folder, ready to deploy to GitHub Pages or any static hosting.

### Deploy to GitHub Pages

1. Build the project: `npm run build`
2. Push the `dist` folder to your `gh-pages` branch, or
3. Configure GitHub Pages to serve from `dist` on your main branch

## Tech Stack

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Vanilla CSS** - Custom Minecraft-themed styling (no frameworks)
- **localStorage** - Browser-based data persistence

## Project Structure

```
minecraft-forever-world-tracker/
├── src/
│   ├── data/           # JSON files for each phase
│   │   ├── first-night.json
│   │   ├── wood-age.json
│   │   └── ...
│   ├── main.ts         # Application entry point
│   ├── types.ts        # TypeScript type definitions
│   └── styles.css      # All styling
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Customization

### Adding New Tasks

Edit the JSON files in `src/data/` to add, remove, or modify tasks. Each task has:

```json
{
  "id": "unique-id",
  "text": "Task description",
  "icon": "minecraft_item_id",
  "description": "Optional tooltip"
}
```

### Adding New Phases

1. Create a new JSON file in `src/data/`
2. Import it in `src/main.ts`
3. Add it to the `PHASES` array
4. Add matching CSS for the progress bar color in `styles.css`

## Icons

Task icons are loaded from [mc-heads.net](https://mc-heads.net/) using Minecraft item IDs. If an icon fails to load, a fallback emoji is displayed.

## Contributing

Contributions are welcome! Feel free to:

- Add missing tasks
- Fix task descriptions
- Improve the UI/UX
- Add new features
- Report bugs

Please open an issue first to discuss major changes.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Minecraft is a trademark of Mojang Studios
- Item icons provided by mc-heads.net
- Font: VT323 from Google Fonts

---

Made with love for Minecraft players everywhere.
