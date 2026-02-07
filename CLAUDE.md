# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Toolboard?

A browser-based widget workspace — a customizable dashboard where users add, arrange, and resize tool windows across multiple boards. Pure client-side: single HTML file + plugin JS files, no build system, no backend, all state in localStorage.

## Development

No build, lint, or test commands. Open `index.html` directly in a browser. Refresh to see changes.

External dependencies (loaded via CDN): `html2canvas` (screenshots), `marked.js` (markdown rendering), Google Fonts.

## Architecture

### Core (`index.html`, ~12k lines)

Contains the entire application: CSS variables/theming, header/board UI, tool window manager (drag/resize/z-index), storage layer, board switching, plugin loader, import/export, and built-in tools (blank notes, calculator, calendar, checklist, etc.).

### Plugin System

Three plugin types registered via global `PluginRegistry`:

- **Tools** — individual widgets (`PluginRegistry.registerTool({...})`)
- **Toolboxes** — tool groupings (`PluginRegistry.registerToolbox({...})`)
- **Boards** — pre-configured workspaces (`PluginRegistry.registerBoard({...})`)

Plugin files live in `plugins/toolboxes/` and `plugins/boards/`. They're loaded via `<script>` tags (either from the official plugins list or user-added URLs saved in localStorage).

### Toolbox Plugin Structure (e.g., `developer-tools.js`)

Each toolbox file follows this pattern in order:

1. **CSS IIFE** — injects a `<style>` element with all tool styles, guarded by an ID check to prevent duplicate injection
2. **Toolbox registration** — `PluginRegistry.registerToolbox()` with a `tools` array listing all tool IDs
3. **Tool registrations** — one `PluginRegistry.registerTool()` per tool, with inline HTML `content` and `onInit` function name
4. **Functions** — all tool logic as top-level functions (must be global for `onclick` handlers)
5. **Export IIFE** — collects all function references into `functionsToExport` array, serializes them into a `<script>` tag for HTML export support

### Storage

All data is board-scoped via `boardKey(key)` → `finance_${currentBoardId}_${key}` localStorage keys.

Key storage types: `positions` (tool x/y/z/width/height), `toolCustomizations` (per-tool state), `customTools` (user-created tools), `hiddenTools`, `toolboardSettings`, `variables`.

Tool-specific data is stored as a named property inside `toolCustomizations[toolId]` (e.g., `checklistItems`, `dirtreeItems`, `diffData`).

Global helpers: `loadToolCustomizations()` / `saveToolCustomizations(customizations)` — these read/write the full customizations object.

### Adding a New Tool to an Existing Toolbox

Using `developer-tools.js` as the canonical example:

1. Add CSS rules to the style IIFE (before the closing backtick)
2. Add the tool ID to the toolbox's `tools` array
3. Add `PluginRegistry.registerTool({...})` with `content` (HTML string), `onInit`, `defaultWidth`/`defaultHeight`, `tags`
4. Add all functions after existing functions, before the export IIFE
5. Add all function names to the `functionsToExport` array in the export IIFE
6. Update the tool count in `console.log` statements

### Key Patterns

- **Instance isolation**: tools use `element.closest('.tool').getAttribute('data-tool')` to get the tool instance ID, then scope all DOM queries and data access to that instance
- **Rendering**: full re-render on every data change — read state, rebuild innerHTML, save state
- **Inline event handlers**: `onclick="functionName(this)"` in HTML strings, with functions accessing the widget via `btn.closest('.widget-class')`
- **Drag & drop**: module-level state object (e.g., `checklistDragState`), `dragstart`/`dragover`/`dragleave`/`drop` handlers, same-level reorder only
- **Markdown toggle**: textarea overlay that converts to/from structured data, toggled by a button that switches between "Markdown" and "Apply" labels
- **CSS theming**: use `var(--bg-primary)`, `var(--text-primary)`, `var(--border-color)`, etc. for light/dark mode support

### Board Export Format

```json
{
  "type": "boards",
  "exportedAt": "ISO-8601",
  "boards": [{
    "id": "board-id",
    "name": "Board Name",
    "positions": { "toolId": { "x": 0, "y": 0, "z": 100, "width": 290, "height": 280 } },
    "toolCustomizations": { "toolId": { "title": "...", "customContent": "..." } },
    "customTools": [],
    "hiddenTools": [],
    "toolboardSettings": { "title": "...", "color": "#hex" }
  }]
}
```
