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
| `#import?src=<url>` | Offers to load a tools export from that URL — see [Loading from a URL](#loading-from-a-url) |
| `#BoardName/import?src=<url>` | The same, onto that board |

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

## Loading from a URL

A tools export kept somewhere public — a file in a Git repo, say — can be loaded by
URL instead of downloaded and pasted:

```
#import?src=https%3A%2F%2Fraw.githubusercontent.com%2F…%2Ftools-export.json&link=1
```

`src` is the export; `link=1` asks for the board to be kept in sync with it. The
segment only counts as the route when `src` is present, so a board actually named
"import" is still reachable at `#import`.

**Following the link writes nothing on its own.** It fetches the payload, then shows
what it found — the host, the type and how many tools — and waits. Only on accepting
does anything land on the board. A link is content someone else chose, and tool
content is rendered as written, so the confirmation is the point rather than a
formality.

Without `link=1` the load is a copy and the URL is forgotten. With it, the URL is
recorded as a linked source and re-fetched on every board load; see
[Storage](storage.md#linked-sources) for what sync does and does not overwrite. The
same two routes are available from **Import ▸ Import from URL**, which also lists the
board's linked sources with *Reload now* and *Unlink*.

### The link is written for you

**Import ▸ Import from URL** builds this link as the URL is typed, and offers it to
copy. It stays after a load — that is the URL that just worked — and each linked
source has its own *Copy link*. Assembling it by hand means percent-encoding a URL
inside a hash, which is the kind of thing someone gets wrong once and then distrusts.

Two things it deliberately does not do. It carries **no board name**, so the tools
land on whichever board the person following it is looking at rather than one named
after yours. And it is built from **this page's own address**, so a self-hosted board
hands out itself; only a page opened from `file://`, which has no address worth
sharing, falls back to the published site. A relative path is never offered, because
it would resolve against their board and quietly fetch the wrong thing.

Anything `src` names has to be reachable from the browser, exactly as for tool
parameters above — `raw.githubusercontent.com` sends `access-control-allow-origin: *`
and works directly. Unlike the Curriculum Explorer, this route has no proxy fallback:
a host that refuses cross-origin reads is reported and nothing is loaded.

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
