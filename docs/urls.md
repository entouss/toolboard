# URL Hashes

Every board and every tool is addressable by URL hash. A tool link works for someone who has never opened Toolboard: the plugin providing the tool is installed on the fly, an instance is created on their board, and it opens maximized.

## Grammar

| Hash | Effect |
| --- | --- |
| `#BoardName` | Opens that board |
| `#tool/<toolId>` | Opens that tool maximized on the current board |
| `#BoardName/tool/<toolId>` | Opens the board, then the tool maximized |

`<toolId>` is the tool's plugin id (`PluginRegistry.registerTool({ id })`) — e.g. `#tool/jwt-decoder` — so the link means the same thing in anyone's browser. Tools with no plugin id (freeform notes) fall back to their board-local instance id, which only resolves in the browser that created them.

Both segments are percent-encoded, and the hash is split on `/` before decoding, so a `/` in a board name is never mistaken for a separator.

## Behaviour

- **Maximizing and the URL stay in sync.** Maximizing a tool writes its hash; restoring it (button, backdrop, `Esc`) writes the board hash back. Navigating back to a bare board hash restores the maximized tool.
- **Reuse over duplication.** If the board already has an instance of the tool — same instance id, or anything created from the same template — it is focused and maximized instead of a second copy being created.
- **A tool left maximized in a previous session stays maximized on load.** Only in-session hash changes count as navigation.

## Resolving a tool to its plugin

Nothing maps tool ids to plugins ahead of time: a plugin's tools are only known once its script has run. So an unknown id is resolved by loading the official plugins (`OFFICIAL_PLUGINS`) in turn until one registers it.

`PluginLoader.loadFromUrl` diffs the registry around each script and records every tool the plugin registered in `toolboard_toolPluginIndex` (localStorage), so later lookups are direct and any tool can be traced back to its plugin. When a tool lands on a board, `ensurePluginInstalledForTool` adds that plugin to the installed list — without it, the tool would render now and vanish on the next reload.

Probing loads plugins that don't match; they stay registered for the session but are not installed unless one of their tools is actually used.

## Sharing

`Copy Tool Link` in a tool's settings panel copies the absolute `#tool/<toolId>` form. `getToolShareUrl(toolId)` builds it.

## Adding tools to the scheme

Nothing per-tool is required. A tool registered with `PluginRegistry.registerTool` in a plugin listed in `OFFICIAL_PLUGINS` is linkable by its id. Tools in third-party plugins are linkable once that plugin is installed, or after any tool from it has been loaded once.
