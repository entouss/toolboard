# URL Hashes

Every board and every tool is addressable by URL hash. A tool link works for someone who has never opened Toolboard: the plugin providing the tool is installed on the fly, an instance is created on their board, and it opens maximized.

## Grammar

| Hash | Effect |
| --- | --- |
| `#BoardName` | Opens that board |
| `#tool/<toolId>` | Opens that tool maximized on the current board |
| `#BoardName/tool/<toolId>` | Opens the board, then the tool maximized |
| `#tool/<toolId>/view` | Opens that tool alone, with no chrome — see [View only](#view-only) |
| `#BoardName/tool/<toolId>/view` | The same, on that board |

`<toolId>` is the tool's plugin id (`PluginRegistry.registerTool({ id })`) — e.g. `#tool/jwt-decoder` — so the link means the same thing in anyone's browser. Tools with no plugin id (freeform notes) fall back to their board-local instance id, which only resolves in the browser that created them.

Both segments are percent-encoded, and the hash is split on `/` before decoding, so a `/` in a board name is never mistaken for a separator.

## Parameters

A hash may end in `?key=value&…`, which opens the tool *on something in particular*:

```
#Ideas/tool/curriculum-explorer?curriculum=https://example.org/guide.json
```

The router splits the query off, decodes it, and hands it to the tool named by the hash — it never interprets it. A tool opts in by naming a function in its registration:

```js
PluginRegistry.registerTool({ id: 'curriculum-explorer', hashParams: 'currApplyHashParams', … });
```

`applyToolHashParams` calls `window[hashParams](instanceId, params)` once the tool exists — for a tool the link created, after `onReady`; for one already on the board, right after it is maximized. So the same link works whether or not the visitor has the tool already.

Anything the parameters name has to be reachable from the browser: `http`/`https`, and a host that allows cross-origin reads. Where a host does not, the Curriculum Explorer retries through the board's CORS proxy (`functions/ics-proxy`), which answers only the published origins — so the fallback works on `toolboard.me` and refuses elsewhere, and the tool says which route the document came by.

**A page opened from `file://` cannot read files from disk** — Chrome refuses both `fetch` and `XMLHttpRequest` — so a link naming a local path can only be answered with an explanation.

## Behaviour

- **Maximizing and the URL stay in sync.** Maximizing a tool writes its hash; restoring it (button, backdrop, `Esc`) writes the board hash back. Navigating back to a bare board hash restores the maximized tool.
- **Reuse over duplication.** If the board already has an instance of the tool — same instance id, or anything created from the same template — it is focused and maximized instead of a second copy being created.
- **A tool left maximized in a previous session stays maximized on load.** Only in-session hash changes count as navigation.

## View only

A tool hash ending in `/view` shows that tool and nothing else: the app header, the
collapse chevron and the tool's own header bar are all gone, and the tool's body
fills the window. It is meant for a screen that only has to *show* something — a
wall display, a shared monitor, a board embedded in another page.

Maximizing is a state of the board; this is a rendering of the URL, and the two are
deliberately kept apart:

- **Nothing is saved.** Following a `/view` link does not record the tool as
  maximized, so it does not change the visitor's own boards.
- **The hash is never rewritten.** `updateLocationHashForTool` stands down, because
  rewriting would drop the `/view` that puts the page in the mode.
- **Nothing on the page leaves it.** `Esc`, the backdrop, the maximize button and
  `Cmd/Ctrl+K` all do nothing. Editing the URL is the only way out — dropping
  `/view` leaves a normally maximized tool, dropping the whole tool segment returns
  to the board.

`?key=value` parameters work as usual, so
`#tool/curriculum-explorer/view?curriculum=…` is a locked display of one document.

Two things to know:

- **A tool whose only controls live in its header is unusable in this mode**, since
  that header is hidden. Controls belong in the widget body — as the QR generator
  does with `.qr-actions`.
- This is presentation, not protection. The board's data is still in the page and
  reachable from devtools; `/view` is not a way to publish something read-only.

`#tool/view` and `#BoardName/tool/view` still mean a tool whose id is `view`: the
segment only counts as the mode where a tool id would remain without it.

## Resolving a tool to its plugin

Nothing maps tool ids to plugins ahead of time: a plugin's tools are only known once its script has run. So an unknown id is resolved by loading the official plugins (`OFFICIAL_PLUGINS`) in turn until one registers it.

`PluginLoader.loadFromUrl` diffs the registry around each script and records every tool the plugin registered in `toolboard_toolPluginIndex` (localStorage), so later lookups are direct and any tool can be traced back to its plugin. When a tool lands on a board, `ensurePluginInstalledForTool` adds that plugin to the installed list — without it, the tool would render now and vanish on the next reload.

Probing loads plugins that don't match; they stay registered for the session but are not installed unless one of their tools is actually used.

## Sharing

`Copy Tool Link` in a tool's settings panel copies the absolute `#tool/<toolId>` form. `getToolShareUrl(toolId)` builds it.

## Adding tools to the scheme

Nothing per-tool is required. A tool registered with `PluginRegistry.registerTool` in a plugin listed in `OFFICIAL_PLUGINS` is linkable by its id. Tools in third-party plugins are linkable once that plugin is installed, or after any tool from it has been loaded once.
