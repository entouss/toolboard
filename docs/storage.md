# Storage

All data is board-scoped via `boardKey(key)` → `finance_${currentBoardId}_${key}` localStorage keys.

## Key Storage Types

- `positions` — tool x/y/z/width/height
- `toolCustomizations` — per-tool state
- `customTools` — user-created tools
- `hiddenTools` — tools hidden from the board
- `toolboardSettings` — board-level settings (title, color, and the placement guides below)
- `variables` — user-defined variables
- `linkedSources` — URLs this board loads tools from, and what each one placed

### Placement guides

`toolboardSettings` carries the two guides a board is laid out against:

```js
grid:      { on: false, size: 20 }                    // size in px, 5–200
pageGuide: { on: false, orientation: 'portrait' }     // 8.5 × 11in at 96px/in
```

Both are read through `boardGridSettings()` / `boardPageGuideSettings()` rather than
directly, because settings are merged shallowly from storage: a board that stored
`{ on: true }` and nothing else still has to come back with a usable size. `grid.on`
both draws the lines and makes drags and resizes snap to them — the two are one
switch, and Shift already bypasses snapping. Guides are drawn by
`renderBoardGuides()`, behind the tools, and are left out of PNG exports.

### Linked sources

A tools export can be loaded from a URL (see [URL Hashes](urls.md#loading-from-a-url)).
Ticking *keep in sync* records it here, and every board load re-fetches it:

```js
[{
  url: 'https://raw.githubusercontent.com/…/tools-export.json',
  addedAt: ISO, lastFetchedAt: ISO,
  lastResult: 'ok',                       // or the error, shown in the panel
  map: { '<id in the export>': '<tool id here>' }
}]
```

`map` is what makes a re-fetch idempotent. `importTools` mints a fresh id whenever a
custom tool id is already taken — right for importing the same file twice on purpose,
and fatal for something re-fetched on every load — so `syncToolsFromSource` upserts
through the map instead:

| Map entry | What sync does |
| --- | --- |
| None | Imports the tool and records the mapping |
| Present, tool still on the board | Overwrites `toolCustomizations`, **keeps the local position** |
| Present, tool deleted here | A background sync leaves it deleted; an explicit load puts it back |

Where a window sits is the user's; what is in it is the source's.

The last row is two rules, not one. The re-fetch on every board load must not undo a
deletion, or a tool you removed would return on the next reload. But pressing *Load*
or *Reload now*, or accepting an `#import` link, means "put these on my board", so
those pass `explicit` and re-add what is missing. Without that split, deleting a
synced tool made it unreachable: the map entry outlived the tool and every later
import silently skipped it while reporting success. Only `tools` and
`notes` exports can be linked: which board would win on a re-fetch of a `boards`
export is not a question this answers, so linking one is refused.

A fetch that fails leaves `lastResult` set and the board untouched — a board has to
open with the network down.

One thing a re-fetch deliberately does *not* overwrite is `scriptApproved`. A synced
tool that carries a script keeps the approval given here, so a source that re-fetches
unchanged goes on running; a source that changes its script no longer matches what
was approved, and that tool stops and asks again rather than inheriting a yes given
to different code. See [Dynamic Tools](dynamic-tool.md).

## Tool-Specific Data

Tool-specific data is stored as a named property inside `toolCustomizations[toolId]` (e.g., `checklistItems`, `dirtreeItems`, `diffData`).

### Dynamic tools — a tool the user wrote

A tool made from the `script` template keeps what it is in four keys, plus the pane
it was last edited on:

| Key | What it holds |
| --- | --- |
| `customContent` | The markup (the shared field, holding HTML rather than markdown here) |
| `toolScript` | The script |
| `toolData` | The data the script reads, and what `api.save()` writes back |
| `sourceUrl` | A URL to read and hand to the script as `source` |
| `refreshSeconds` | How often to read it; blank or `0` never, and under `5` is raised to `5` |
| `sourceCache` | What that URL answered last, so the tool draws before the network does |
| `sourceFetchedAt` | When that was, which is what makes a stale number legible as one |
| `scriptApproved` | The exact script text approved **in this browser** |
| `scriptTab` | `body`, `script`, `data` or `source` — where the editor was left |

`scriptApproved` is the whole of the trust rule: the script runs only while it is
character-for-character what was approved, so a source that changes its code stops
and asks again.

Three of these are local facts — `scriptApproved`, `sourceCache` and
`sourceFetchedAt`, collected as `LOCAL_ONLY_KEYS` — and are stripped from every
export and every import by `withoutLocalFacts`. An approval that travelled would be
a file approving its own script; a cache that travelled would be a number that looks
live and is not. See
[Dynamic Tools](dynamic-tool.md#scripts-that-arrive-from-somewhere-else).

How the last read went — direct, via the proxy, or failed — is deliberately *not*
stored. It is true of this browser at this moment and has no business in an export.

### Curriculum Explorer — a record of schools

`toolCustomizations[toolId].curriculum` holds a whole school career, not one document:

```js
{
  schools: [
    { id, name, grades, years, catalog, plan, completed, hidden, credits_in,
      grading, marks, extraLevels, sourceUrl, draft, ui },
    …
  ],
  current: 'sch-2'          // or '__career__' for the read-only career page
}
```

A school entry has exactly the shape the tool kept at the top level before there
could be more than one, which is what lets `currGetData(toolId)` go on returning one
school and every function below it stay unchanged. Storage written by the older
version is upgraded on read, as a list of one — no plan, no completed list and no
course code is rewritten, because each school keeps its own.

`name` is stored only when someone types one; otherwise it is derived from the
document on every read, so a school added before its document arrives is named the
moment it does. `grades` are the years the student was actually at that school,
which is how two high schools split grades 9–12. `credits_in` is credit accepted on
transfer for a course this school does not teach.

`grading` is how the school marks — the scale, how many marking periods each term is
divided into, whether there is an exam and what it is worth, and whether the GPA is
weighted. `marks` is what it marked:

```js
grading: { scale: 'letter-pm', custom: [], marks: 2, exam: false, examWeight: 0.2, weighted: false }
marks:   { '1011': { m: { 'S1.1': 'A', 'S1.2': 'B' }, final: null } }
```

A `final` of `null` means calculated from the marks; a string means someone typed it,
and the tool shows the two differently. Marking-period keys are `<termId>.<n>` for a
mark and `<termId>.X` for an exam, so which term a mark belongs to survives a course
being moved. Grades are stored per school because schools grade differently; anything
that has to combine two of them — a career GPA — works in point values rather than in
labels.

## App-Level Keys (not board-scoped)

- `toolboard_pluginUrls` — installed external plugin URLs
- `toolboard_toolPluginIndex` — tool id → plugin URL, built as plugins load (see [URL Hashes](urls.md))

## Helpers

- `loadToolCustomizations()` — reads the full customizations object from localStorage
- `saveToolCustomizations(customizations)` — writes the full customizations object to localStorage
