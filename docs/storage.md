# Storage

All data is board-scoped via `boardKey(key)` → `finance_${currentBoardId}_${key}` localStorage keys.

## Key Storage Types

- `positions` — tool x/y/z/width/height
- `toolCustomizations` — per-tool state
- `customTools` — user-created tools
- `hiddenTools` — tools hidden from the board
- `toolboardSettings` — board-level settings (title, color)
- `variables` — user-defined variables

## Tool-Specific Data

Tool-specific data is stored as a named property inside `toolCustomizations[toolId]` (e.g., `checklistItems`, `dirtreeItems`, `diffData`).

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
