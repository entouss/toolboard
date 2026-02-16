# Architecture

## Core (`index.html`)

Contains the application framework only: CSS variables/theming, header/board UI, tool window manager (drag/resize/z-index), storage layer, board switching, plugin loader, import/export, and the `blank` note template. **Do NOT add tool-specific code (CSS, functions, or NOTE_TEMPLATES entries) to index.html.** All tool implementations belong in their respective plugin files under `plugins/toolboxes/`.

## Plugin System

Three plugin types registered via global `PluginRegistry`:

- **Tools** — individual widgets (`PluginRegistry.registerTool({...})`)
- **Toolboxes** — tool groupings (`PluginRegistry.registerToolbox({...})`)
- **Boards** — pre-configured workspaces (`PluginRegistry.registerBoard({...})`)

Plugin files live in `plugins/toolboxes/` and `plugins/boards/`. They're loaded via `<script>` tags (either from the official plugins list or user-added URLs saved in localStorage).
