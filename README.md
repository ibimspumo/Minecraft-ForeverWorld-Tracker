# ⛏️ Minecraft Forever World Tracker

A comprehensive, beautifully designed tracker for your Minecraft forever world. Track your progress across **1100+ tasks** including blocks, items, mobs, biomes, structures, advancements, and more!

![Minecraft](https://img.shields.io/badge/Minecraft-1.21+-62B47A?style=for-the-badge&logo=mojang-studios&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

- **1100+ Trackable Tasks** across 15 categories
- **Multi-World Support** - Track progress for multiple Minecraft worlds
- **LocalStorage Persistence** - Your progress saves automatically
- **Import/Export** - Backup and restore your progress as JSON
- **Mobile Optimized** - Works great on phones and tablets
- **Minecraft-Themed UI** - Beautiful dark theme inspired by Minecraft's inventory
- **Search & Filters** - Find tasks by name, category, phase, or difficulty
- **Progress Overview** - Visual progress tracking with XP-style progress bars

## 📦 Categories

| Category | Items | Description |
|----------|-------|-------------|
| 🧱 Blocks | 228 | All obtainable block types |
| ⚔️ Items | 258 | Tools, weapons, armor, materials |
| 🐉 Mobs | 86 | All creatures to encounter |
| 🌍 Biomes | 64 | Every biome to explore |
| 🏰 Structures | 34 | Generated structures to discover |
| 🏆 Advancements | 131 | All vanilla advancements |
| ✨ Enchantments | 45 | Every enchantment to apply |
| 🧪 Potions | 58 | All potion variants |
| 💿 Music Discs | 20+ | All collectible discs |
| 🖼️ Paintings | 26 | Every painting variant |
| 🚩 Banner Patterns | 8 | Special banner designs |
| 🛡️ Armor Trims | 16+ | Smithing templates |
| 🏺 Pottery Sherds | 20+ | Decorated pot pieces |
| ⭐ Challenges | 49 | Long-term achievement goals |
| 🔧 Building Goals | 60 | Farms and contraptions |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/minecraft-foreverworld-tracker.git
cd minecraft-foreverworld-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

This project follows **Atomic Design** principles:

```
src/
├── lib/
│   ├── components/
│   │   ├── atoms/          # Basic UI elements (Button, Checkbox, etc.)
│   │   ├── molecules/      # Combined atoms (TaskCard, FilterBar, etc.)
│   │   ├── organisms/      # Complex sections (Header, Sidebar, TaskList)
│   │   └── templates/      # Page layouts (MainLayout)
│   ├── data/               # JSON task data files
│   ├── stores/             # Svelte 5 state management
│   ├── types/              # TypeScript definitions
│   └── utils/              # Helper functions
├── routes/
│   ├── +layout.svelte      # Root layout
│   └── +page.svelte        # Main SPA page
├── app.css                 # Global styles
└── app.html                # HTML template
```

## 📱 Mobile Support

The tracker is fully responsive and optimized for mobile devices:
- Collapsible sidebar navigation
- Touch-friendly task cards
- Optimized progress displays
- Swipe-friendly category browsing

## 💾 Data Persistence

### LocalStorage (Automatic)
Your progress is automatically saved to your browser's LocalStorage. Data persists across sessions.

### Export/Import (Manual Backup)
- Click the menu (⋮) in the header
- Select "Export Progress" to download a JSON backup
- Select "Import Progress" to restore from a backup

## 🎨 Customization

### Adding New Tasks

Edit the JSON files in `src/lib/data/`:

```json
{
  "id": "unique_task_id",
  "name": "Task Name",
  "description": "What to do",
  "category": "blocks",
  "phase": "early_game",
  "difficulty": "easy",
  "icon": "minecraft_item_name",
  "tags": ["tag1", "tag2"],
  "tips": "Helpful hint"
}
```

### Task Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier |
| `name` | string | ✅ | Display name |
| `description` | string | ✅ | Task description |
| `category` | string | ✅ | Category ID |
| `phase` | string | ✅ | `early_game`, `mid_game`, `late_game`, `post_game`, `any` |
| `difficulty` | string | ✅ | `easy`, `medium`, `hard`, `extreme` |
| `icon` | string | ❌ | Minecraft item name for wiki image |
| `tags` | string[] | ❌ | Searchable tags |
| `tips` | string | ❌ | Helpful tips |

## 🛠️ Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with Svelte 5
- **Language**: TypeScript
- **Styling**: CSS with custom properties
- **State**: Svelte 5 Runes (`$state`, `$derived`)
- **Storage**: Browser LocalStorage
- **Build**: Vite

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Ideas

- Add missing items from newer Minecraft updates
- Improve task descriptions and tips
- Add translations/i18n support
- Create achievement badges
- Add statistics and charts
- Improve mobile experience

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Minecraft Wiki](https://minecraft.wiki/) for item data and images
- [Mojang Studios](https://www.minecraft.net/) for creating Minecraft
- The Minecraft community for inspiration

## 📝 Changelog

### v1.0.0 (2024)
- Initial release
- 1100+ trackable tasks
- 15 categories
- Multi-world support
- Import/Export functionality
- Mobile-optimized design

---

Made with 💚 for the Minecraft community

**Not affiliated with Mojang Studios or Microsoft**
