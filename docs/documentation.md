# Toolboard Documentation

A browser-based widget workspace — a customizable dashboard where users add, arrange, and resize tool windows across multiple boards. Pure client-side: single HTML file + plugin JS files, no build system, no backend, all state in localStorage.

## Development

No build, lint, or test commands. Open `index.html` directly in a browser. Refresh to see changes.

External dependencies (loaded via CDN): `html2canvas` (screenshots), `marked.js` (markdown rendering), Google Fonts.

## Guides

- [Architecture](architecture.md) — Core framework, plugin system overview
- [Toolbox Plugins](toolbox.md) — Plugin file structure, existing toolboxes
- [Adding a Tool](tool.md) — Step-by-step guide for new tools
- [Board Export](board.md) — Board JSON export format
- [Storage](storage.md) — localStorage layout, board-scoped keys, helpers
- [Key Patterns](patterns.md) — Instance isolation, rendering, event handlers, theming
