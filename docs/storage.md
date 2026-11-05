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

Every one of them is written through `trackedSave(key, value)` rather than through
`localStorage.setItem` directly, which is what gives the board undo — see below.
Passing `undefined` removes the key, which is what the reset functions do.

### Undo and redo

Undo lives in the storage layer, not in any tool. A board is made of the keys above,
all of them written by one of the save functions, so **a plugin that stores its state
the ordinary way gets undo without knowing undo exists** — including one written
after this was.

A step is one key's text before and after a write:

```js
{ key: 'toolCustomizations', before: '<json or null>', after: '<json>',
  at: 1760000000000, label: 'tool contents' }
```

Restoring writes the old text back and calls `reloadBoardState()`, which re-reads
every global that caches a key and redraws. Nothing is replayed and nothing is
inverted, so there is no operation that can be inverted wrongly — the cost is that a
restore is a full re-render, the same as switching board.

Four rules carry the behaviour:

| Rule | Why |
| --- | --- |
| Writes to the same key within `UNDO_MERGE_MS` (600) merge into one step | A save fires per keystroke and per mousemove. Without this, one press of Ctrl+Z gives back one character |
| A write that changes nothing records nothing | Saves fire on plenty of occasions where nothing was edited, and each would cost a press that appears to do nothing |
| A new edit empties the redo stack | There is one future, and it is the one just taken |
| `UNDO_LIMIT` (50) steps, in memory, per board | History would otherwise live in the same localStorage it is protecting, and grow without an end. Switching boards sets the other board's history aside rather than merging or clearing it |

**Ctrl+Z inside a text field is the text field's.** The browser's undo knows about
characters; this one only knows about saved state, so the board's undo stays out of
the way until focus is back on the board. Same guard as cut/copy/paste, which this
sits beside.

A restore can provoke writes of its own — a tool that auto-fits its window on being
drawn — and those arrive a frame or two later. `UNDO_SETTLE_MS` (400) keeps the
recorder shut that much longer than the call, so the restore finishing is not filed
as a new edit.

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

### Project Table — a plan in one key

`toolCustomizations[toolId].projectData` holds the whole tool: what a size is worth
in days, which columns exist, and the rows.

```js
{
  sizes:   { O: 0, XXXS: 0.5, XXS: 1, XS: 3, S: 5, M: 10, L: 30, XL: 60,
             XXL: 120, XXXL: 240, '?': 0 },
  ticketBase: 'https://tickets.example.com/browse/',   // '' until one is set
  hideSettings: false,         // the three strips above the table, folded away
  mdShow: { dates: true, notes: false, … },   // what the Markdown summary carries
  addedColumns: { ticket: true },                      // migrations already run
  columns: [ { id: 'size', title: 'TS-Size', type: 'size', builtin: true,
               collapsed: false }, … ],
  rows:    [ { id: 'r-…',
               cells: { item: 'Discovery', team: 'Payments', system: 'Ledger',
                        size: 'M', pct: 60, deadline: '2026-10-12',
                        start: '', end: '',               // '' = left to the plan
                        resources: ['Robin', 'Alex'],
                        ticket: [ { id: 'ABC-1', type: 'Bug' } ],   // type optional
                        deps: ['r-…'], links: [ { label, url } ] },
               notes: { item: 'The long version…', deadline: 'Fixed by the event' } },
             { id: 'r-…', parent: 'r-…', cells: { … } } ]
}
```

Beside `projectData`, and outside it, the tool keeps how it is being looked at:
`projSplit` (the table's share of the height in Both) and `projFolded`, the ids of
rows whose sub-tasks are folded out of sight. Folding is a view, not an edit, so it
is not in the plan's undo, its CSV, its Markdown or its share link, and every total
and ✨ action still counts the folded rows. A row indented under a folded row, or
given sub-tasks by ✨ Break down, opens it and everything it hangs from
(`projUnfoldTo()`), so nothing lands out of sight.

**The sizes start on the ladder's rungs**: S is a week, M a sprint, L a timebox, XL
a quarter, and XS the few days that sit under a week — so "that's an M" and "that's a
sprint" say the same thing until somebody changes one of them. Either end goes
further than the ladder does: XXXS and XXS are half a day and a day, for work
measured in afternoons, and XXL and XXXL are two quarters and four, for work nobody
is going to break down yet. They are only a starting point: `sizes` is typed into and
the ladder is typed into, and neither is derived from the other, because an estimate
is a judgement rather than a calculation.

**Nine sizes, five colours.** `PROJ_SIZE_STEPS` maps the ramp onto the five-step
green→red scale and stops there. Those five are the best green→red there is at that
length — the cost of even five is written down below — and nine steps would put
neighbouring sizes closer together than anybody could tell apart, with some pairs
identical to a reader who sees colour differently. So the new sizes join the end they
belong to, the five that were here first keep exactly the colours they had, and what
distinguishes XXL from XL is what has always done it: the letters, inside the
control.

**The days are in the list, not in the cell.** A closed `<select>` shows the text of
the option that is selected, so writing "M · 10 d" into the options would put the
days in every row — the size table copied down the column, which is the thing the
size table exists to avoid. `projSizeMenu()` writes the days in on focus and takes
them out again on blur, so they are there while somebody is choosing and gone the
moment they are not.

**`O` and `?` are not points on that scale.** O is nothing to do; ? is not estimated
yet. Both are worth zero days, both sit in the list — O below XS, ? after XL, because
unknown is not a size and does not belong in the middle of a scale — and neither
takes a colour from the green-to-red ramp. `PROJ_SIZE_RAMP` is the five that do;
`PROJ_SIZE_ORDER` is what the dropdown offers; `projSizeStep()` returns 0 for
anything off the ramp, which is the neutral grey, and `projKnownSize()` is the
different question of whether the table recognises it at all. A roll-up ignores
sizes worth nothing, so a parent of unestimated children shows no derived size
rather than claiming they add up to an O.

**The column order is the user's**, and so is which of them are showing. The
built-ins start in the order the questions get asked — ID, Ticket, Team, System,
Task, Title, Dependencies, Size, % Done, Start, End, Total, Left, Deadline, Slack,
Assigned, Notes, Links — and
`columns` is the record of where they have been moved to since. The headings are a
word each: a heading is read a hundred times and holds its column open while it does,
so the long version lives in the tooltip. Total and Left are **work**; Slack is
**calendar room**; the tooltip on each says so, which is where "Total Days" and
"Remaining Days" sitting side by side used to leave the reader to work it out. A heading is dragged by its grip rather than by itself, because
a heading is also clicked to rename and carries a dropdown, and a draggable ancestor
makes both awkward; the drop moves the column in the data, and the next render comes
from the data. `collapsed` folds a column to a 16px strip with its heading turned on
its side — out of the way of the columns either side of it, still in its place, and
nothing under it touched. Folding is not deleting.

**A project is a row.** Rows nest three deep — a project, the tasks in it, the
sub-tasks in those — through `parent`, and `PROJ_MAX_DEPTH` is the ceiling: deeper
than that is an outline rather than a plan, and every reader has to hold the nesting
in their head to read a row. `projOrderedRows` is what turns the stored array into
reading order; the array keeps sibling order only.

Everything a project needs is the roll-up a parent already does: its dates are its
children's, its work is their work added once, its completion is weighted by days,
and it has its own Deadline and Slack cells like any row. So there is deliberately
**no plan-level name, deadline or summary strip** — that was a second mechanism
doing a job the first one already did, in a place where a table holding two projects
could not use it.

Indenting moves a row under the nearest row above it **at its own level**, so a
sub-task joins the sub-task above rather than jumping under a project, and it is
refused where the row or anything under it would land past the third level — the
button is simply absent there, since a button that sometimes explains itself is
worse than one that does nothing at the edge. Outdenting moves out one level, not
all the way. `projIndentTarget()` answers both "may this be indented" and "under
what", so what the button offers and what it does cannot drift apart. Deleting a row
hands its children to whatever it hung from: a sub-task whose task goes becomes a
task, not suddenly a project.

**Every row has a number.** `projRowNumber()` reads a row's place off the table: 2 is
the second item, 2.1 its first task, 2.1.1 that task's first sub-task. The number is
derived rather than stored,
so it is always what somebody counting down the rows would say, and moving a row
renumbers it and everything under it.

That is also what makes a dependency decidable. Two tasks can be called the same
thing — a "Review" under each of three parents is an ordinary way to write a plan —
and a dropdown offering three identical options is one you have to guess at, so the
options and the chips read `2.1 · Review`. Dependencies go on **storing the row's
own id**, which never changes: the number is what they are shown as, so renumbering
can never quietly repoint one.

**Title is everything that places a row, in a line** — `projRowTitle()` joins the
team, the system, the project, the task above it and the task, dropping empty parts
along with their separator so a plan with no name yet reads "Build - Review" rather
than " - Build - Review". It is made of what is already on the row rather than typed
again, so renaming the project or the parent moves every title that mentions it, as
it is typed. The column is
**folded by default**, because it earns its width only when somebody is about to
take it somewhere else, and it carries a copy button — chrome, like every other
per-cell button here, revealed by the cell under the pointer. One line, cut off
rather than wrapped: three names end to end would otherwise make the tallest row in
the table out of a column meant to be copied, not read at length. The whole of it is
in the tooltip and on the clipboard.

Both are derived, so a spreadsheet gets them as values and a file cannot put a stale
one back.

Column `type` is what a cell *is*, not what it looks like: `size`, `percent`, `item`,
`date`, `text`, `notes`, `number`, `ticket`, `deps`, `links`, `title`, and the four
calculated ones — `calcTotal`, `calcRemaining`, `calcSlack`, `calcNumber`. Only built-ins carry a fixed id; a column
the user adds gets a minted one and may be renamed, re-typed or deleted — including
to `notes`, which any column of prose wants.

**`text` is a line; `notes` is prose.** A `text` cell is an input, so Enter in it
does nothing and the value is one line whatever is typed. A `notes` cell is a
textarea: Enter starts a new line, the newlines are stored in the value, and the
field grows in both directions as it is filled in — wide enough for its longest
line, tall enough for the lines it has, up to six rows, after which it scrolls and
can still be dragged taller by hand. The growing is `projGrowField`, which nudges
`size` on an input and `cols`/`rows` on a textarea; it has to be a nudge rather than
a re-render, because the cell being typed into is deliberately not redrawn — redraw
it and the caret goes with it. Notes and the two link fields are the ones that grow;
each carries its own floor and ceiling in `data-min`/`data-max`.

**Which column gives way.** Every text cell is `width: 100%; min-width: 0`, so when
the table is wider than the window the browser takes the space back from whichever
column will give it — and it took it from the name of the task, which is the one cell
a row cannot be read without. The Task field now carries a `min-width` in `ch` to
match its contents, moved as it is typed, so it is a floor rather than a preference;
Title, which is longer still and the whole reason somebody unfolds that column, is
not cut either. What gives way instead is the dependency chip: it names a row that is
already in the table and now names it twice over, number and name both, so it
ellipsises at 110px — from the end, which leaves the number that decides *which* row
it is, with the whole of it in the tooltip.

**Links are read in the cell and edited in a window.** A label field, an address
field and a cross, three to a line, in a column as narrow as the rest of them, was
three things fighting over sixty pixels. The cell shows each link as a chip you can
click — its label, or the host it goes to when it has none, since "docs.example.com"
is worth more than "link" — and the `+` opens the window, where a label and a long
address each get a line and the address gets most of it. Rows are redrawn as they are
added and removed but never while one is being typed into, which is the rule the
table follows for the same reason.

**An address is only a link where it is one.** `projSafeUrl()` passes `http:` and
`https:` and nothing else, in the cell and in the window alike: a link can arrive
from a CSV somebody else wrote, and `javascript:` reaching an `href` is how that
becomes their script running on this board. An address that does not pass is still
shown — it is the user's text — but as inert type rather than as a link.

**Notes belong to a cell, and have no column.** Prose is paragraphs, and a column of
paragraphs is either a column of ellipses or a table one row tall — so every cell
carries an opener instead, in the corner, out of the flow and invisible until the
cell is under the pointer unless there is something to read. Fourteen columns of
permanently visible buttons is a table you cannot see the plan in.

They live in `row.notes`, keyed by column id, rather than in `cells`: a note can then
never collide with the value it is about, and deleting a column does not take the
writing about it with it. Both windows are built on `document.body` by `projOpenModal()`, because a 300px tool
window clips its own contents and that is not where somebody writes three paragraphs
or reads a long URL; the window carries the tool id in a `data-tool` attribute, since
`closest('.tool')` has nothing to find from there. It is headed with **what it is
first** — `Notes — Discovery · Deadline` — because that is the part that is the same
every time and so the part a reader skips to recognise the window; headed with the
column, a note read as though the column were the subject and every note on one row
looked as though it were labelled with the task. Escape closes it on the **capture**
phase and stops the event, or the board's own Escape handler would take the tool out
of fullscreen behind the open window.

A spreadsheet has no window to open, so each column that has any notes gets one of
its own in the file, headed `<Column> notes` and placed before `Parent`; a column
nobody wrote about takes no space. On the way back in, a heading of that shape is a
note about that column — unless a column genuinely claims the heading, in which case
theirs is the one they meant.

**Resources and Dependencies are the same shape**, because they are the same job: a
row can have several, each one is a chip with an × on it, and the way to add is a
**+ at the right edge** of the column rather than a dropdown sitting open in every
cell — a column of open dropdowns is a column of arrows, and what the eye wants there
is the chips. The picker is built but hidden; the + reveals it, focuses it and opens
it where `showPicker()` exists. The + sits at the right edge rather than wherever
that row's chips happen to stop, so the pluses line up down the column.

`projResourceList()` is every distinct name in the column, so the same person is
spelled the same way in every row, and a row is only offered the ones it does not
already have. `+ New…` is not a value but a way in — it swaps the picker for a field,
and what is typed joins that row and becomes an option for every other. A name used
nowhere else is still a resource; a name spelled two ways is two. Resources were a
single string before they could be several, so `projResourcesOf()` reads a string as
a list of one rather than throwing it away, and the CSV carries them as `a; b`, the
way dependencies travel.

**Start and End are calculated *and* typed in.** A `start` or `end` cell is empty
until somebody fills it, and the field shows the date the plan works out in the
meantime — faint and italic, so a worked-out date never passes for a committed one.
Type a date and it is **pinned**: `projSchedule()` takes a pinned start in place of
the one the dependencies imply, and a pinned end in place of the finish the remaining
days imply, stretching or shortening the bar to reach it. Everything downstream moves
with it, because a dependent row still starts when the thing it waits for finishes.
The `↺` beside a pinned date hands it back to the plan. A parent's dates are its
children's, like its size and its completion, and its fields are disabled for the
same reason.

Pinning an end does not change Total Days: the size still says what the work is
worth, and the dates say when it is being done. A pinned end is ignored where there
is no work left — nothing remaining means no bar, and a date cannot conjure one out
of a finished item.

A date that lands on a day nobody works rolls forward to the next working day.
The cell keeps what was typed, because it is the user's, and its tooltip says where
the work actually lands, so the table and the chart never quietly disagree.

`projScheduleOf()` is the schedule, worked out once per edit and cached against a
stamp that every save bumps: two date columns reading it per row had turned one walk
of the dependency graph into one per cell.

**Every date is UTC midnight**, and a day of arithmetic is a fixed 86,400,000ms.
Local midnight — what this used to use — is a day out twice over. East of Greenwich
it is the *previous* day in UTC, which is how `toISOString()` prints it; and a fixed
day added across a daylight-saving change lands an hour off local midnight, so the
weekday a date reports and the date it prints stop agreeing, which with weekends off
is a plan that quietly schedules work on a Saturday. UTC has no such hour. The local
clock is read in `projToday()` and nowhere else, only to ask which calendar day it is
for the person reading the plan.

**Tickets.** A `ticket` cell holds a **list** — `[{ id: 'ABC-123', type: 'Bug' }, …]`
— because a row is often tracked in two places at once, and `ticketBase` holds the
one address the board turns numbers into links with, since writing the whole URL into
every row is what the column exists to stop. A **type is optional** and is whatever
somebody types; the window offers the types already in the plan, so `Bug` and `bug`
do not quietly become two. `projTicketsOf()` is the only reader, and it takes a bare
string as a list of one — a table stored when a row had a single number opens with
its tickets intact and **nothing is migrated**, the same bargain the Assigned column
makes.

`projTicketUrl()` is the only thing that builds the address: `{ticket}` anywhere in
the base is replaced by the number, `{type}` by the ticket's type — so one base can
reach two trackers when the type is what says which — and a base without `{ticket}`
has the number appended with exactly one slash between them however the base was
typed. A base that asks for a type and a ticket that has none make **no link**,
rather than an address with a hole in it. **A base that is not `http:` or `https:`
makes no link at all, and both the number and the type are URL-encoded**, because a
base is typed in here but a row can arrive from a CSV somebody else wrote, and
`javascript:` reaching an `href` is how that becomes their script running on this
board.

In the cell each ticket is a chip, with the **number first and the type after it**:
the chip is what gives way when the table is wider than the window, and of the two it
is the number that says which ticket this is. Editing is in a window, like links and
for the same reason — a number, a type and a cross per ticket is three things
fighting over sixty pixels. In a spreadsheet they travel as `ABC-1 (Tech Debt);
DEF-2`: brackets rather than a bare second word, because a type can be two words and
`ABC-1 Tech Debt` has no honest way back. On the way in, a bracket is the type, and
failing that a second word is, since that is what a file typed by hand will have.

**Team and System are part of what names a row**, not facts about it, so they sit in
front of the Task with the ID and the Ticket, they are folded away like the Title, and
the Title is made of them: `Payments - Ledger - Billing move - Reconcile`. A row that
leaves one blank takes the nearest one above it (`projRowOwner()`), because nobody
fills these in on every line — they are set on the project and left blank on the work
underneath, which is the same thing as saying "the same as the project". A row that
says something different is taken at its word. Without that rule a sub-task's title
would drop the team, and a title that cannot be pasted anywhere has lost the one job
it has.

Columns that arrive after people already have tables are listed in
`PROJ_LATE_COLUMNS`, each with the column it goes before, and `projAddLateColumns()`
puts each one in once. `addedColumns` records which have been done — without it, a
column somebody deleted on purpose would come back on the next load, which is a tool
arguing with its user.

A heading says a word or two and the column's tooltip says the rest — including which
of them measure work and which measure calendar, which is the thing a column of short
headings cannot say on its own.

**The chart's bars are coloured by slack, not by size.** Size is already in the
table, in its own column, in colour; the question a chart is read for is whether this
lands in time. That makes it a status scale, so the bars take the reserved status
palette and the key names each of the four bands beside its colour — never colour
alone — plus the grey for a row with no deadline to be late for. A parent's bar is a
bracket rather than a block, since its days are its children's and a solid bar would
count them twice; it takes the same colour on its **outline**, because it is late or
comfortable like anything else.

**What is chrome and what is the plan.** The tool opens in **Both** — the chart is
half of what it is for, and a plan that opens without it reads as a spreadsheet with
extra columns. The toolbar fades in on hover, like the framework's own mode bar, so a
board on a wall or in a PNG shows the table and the chart rather than the buttons
that built them; it keeps its space while hidden so nothing jumps. The three setting
strips **start folded** and come back on the Settings toggle, remembered in
`hideSettings` — kept with the plan rather than with the window, so a board that is
shared or exported opens the way it was left. Folded is the default because the scale
and the ladder are set once and read rarely, and what somebody opens a plan for is
the plan. **A row at 100% fades** rather than moving or hiding: it
is still in the plan and still counts towards a parent's roll-up, it is just not what
anybody is looking for, and it comes back to full strength under the pointer or while
it is being edited.

**Work is divided among the people on it.** A size says how much work there is;
how long that takes depends on how many are doing it, so Total is the size's days
over the length of the Assigned list — two names on a thirty-day item is fifteen
days, and what is left, the slack, the dates and the length of the bar all follow
from that one number rather than each working it out again. The count never falls
below one: an unassigned item still takes as long as it takes, and dividing by
nobody would make every unstaffed row infinite. The list is found by column
**type** rather than id, so renaming or moving Assigned changes nothing and
deleting it means one assignee everywhere — which is what the table meant before
anyone could be named. A parent divides nothing by its own list: it is the sum of
its children, and the people are on the work underneath. Days print to a tenth,
because three people on a ten-day item is 3.3 and not 3.3333333333333335.

Nothing is computed into storage. Total Days, Remaining Days and the slack are
derived on every render from `sizes`, the Assigned list, the completion and the
deadline, so editing the size table moves every row that uses that size. **Deleting a column removes the
column, not the values under it** — put the column back and what was there is still
there, and a calculation goes on reading the cell whether or not a column is showing
it.

A parent's numbers are its children's: its TS-Size is the step nearest the rolled-up
total — 25 days against a scale of 2/5/10/30/60 reads as an L, and a tie goes to the
larger, so 20 days, equidistant between M and L, is an L too: rounding an estimate
down is the direction that costs somebody a weekend. That size is derived for the display and never written to the row, so a
parent that loses its last sub-item goes back to whatever size it had rather than
keeping a number nobody typed; the exact total sits in Total Days beside it, and in
the control's tooltip. Total and Remaining are sums, and completion
is **weighted by days** rather than averaged — two days finished beside forty not
started is 5% done, not 50%, and an unweighted average is the usual way a roll-up
lies about where a project stands. A parent's own size and completion inputs are
shown disabled rather than hidden, so it reads as derived rather than missing.
Deleting a parent promotes its sub-items instead of taking them with it.

### The ladder, and the working week

`projectData.units` holds how long things are, each rung counted in the one below:

```js
{ daysPerWeek: 7, weeksPerSprint: 2, sprintsPerTimebox: 3, timeboxesPerQuarter: 2,
  planningWeeks: 1, skipWeekends: false, yearMode: 'calendar', fiscalStartMonth: 1,
  periodStart: '', axis: 'dates', chartSpan: 'fit' }
```

`chartSpan` is how much of the calendar the chart covers: `'fit'` runs from today to
the last bar or deadline across the whole width; `'periods'` takes the periods
timeline's own span, and the timeline's rows sit over the chart's bars, so each date
is under the same date above. Work past either end is cut at the edge with a ▸ and
its tooltip says so. It applies only in Both, where the timeline is there to match.

`projUnitDays()` turns that into days — week 7, sprint 14, timebox 42, quarter 91 —
and `projSayDuration()` says a number in the largest rung it fits exactly, which is
what the Total and Remaining tooltips show.

**The planning week is what makes a quarter thirteen weeks rather than twelve.** Two
timeboxes of three sprints come to 84 days; the calendar's quarter is 91. That last
week is not a sprint and is not pretended to be one — it sits at the end of every
quarter and is called **P**:

```
2026 Q1 T1 S1   2026 Q1 T1 S2   2026 Q1 T1 S3
2026 Q1 T2 S1   2026 Q1 T2 S2   2026 Q1 T2 S3   2026 Q1 P
```

It belongs to the quarter rather than sitting beside it, so `projUnitDays().quarter`
includes it, and a quarter axis says only `2026 Q1` — the week is part of what that
names. `planningWeeks: 0` takes it out, and the ladder goes back to plain
multiplication. Rungs may be fractions and the fields step in halves, but with a
planning week there is no need: the rungs stay whole and the remainder has a name.

Because a quarter is no longer a whole number of sprints, **nothing above the sprint
can be found by dividing**. `projQuarterPlan()` is the shape of one quarter and
`projPeriodSpans()` walks it — six sprints and then a week, quarter after quarter —
which is what the axis draws and what `projPeriodPath()` names. A fixed step would
march straight through the quarter boundary and misname the rest of the year.

The sizes are a separate scale and **neither is derived from the other**: a size says
how much work there is, the ladder how the calendar is cut up. They were lined up
once, when both counted working days; a ladder of calendar weeks has moved out from
under them, and lining them up again is a matter of typing numbers into either.

**`skipWeekends` decides whether a five-day week is a fact or a decoration.** On, ten
days of work spans two calendar weeks, nothing finishes on a Saturday, and the slack
column measures to the end of the last working day. Off, days are days. It is **off**
by default, because the default week is seven days and there is no weekend left to
skip — a switch that cannot do anything should not be shown as doing it. Set the week
to five and turn it on and the whole working-week machinery is there. The working
week starts on Monday and runs for `daysPerWeek` days, so a four-day week takes
Friday off and a seven-day week takes nothing — that generalises without having to
ask where somebody's weekend falls. `projNthWorkdayOffset` walks a day at a time
rather than scaling: five working days from a Wednesday is not the same span as five
from a Monday, and a proportional answer is wrong by exactly the weekend.

`projCalendarDaysOf()` turns work days into calendar days, stretching by the length
of the week where weekends are skipped, since ten days of work is fourteen of
calendar; `projPeriodCalendarDays()` is that applied to a rung — a sprint is 14, a
quarter 91. The chart's `axis` marks the
timeline in dates, sprints, timeboxes or quarters, **each label carrying the date
that period begins** under its name — a sprint number answers which sprint and the
date answers when, and asking a reader to count fortnights from today is the kind of
arithmetic a chart exists to do. The label is short (`10-29`) and the tooltip has it
in full beside the period's whole path. The axis draws boundaries down the rows
rather than only labelling the top, since the point of a sprint axis is seeing what
lands inside which sprint. Periods are counted from the year's start: January for a
calendar year, or `fiscalStartMonth` for a fiscal one — **unless `periodStart` names
the day Q1 T1 S1 begins**, which overrides both and repeats on that same day every
year. A plan's first sprint rarely begins on the first of a month. The settings show
the date either way: the one that was named, or the one the year implies, faint and
italic until it is pinned, with a `↺` to hand it back. **A fiscal year is named for
the calendar year it ends in** — a year opening in October 2026 closes in September
2027 and is FY27 throughout. A fiscal year starting in January neither starts nor
ends anywhere else, so it keeps its own number.

A period is named by where it sits in the ladder, each number counted inside its
parent and starting again at 1 there, and **the year is always part of it** —
`2026 Q1 T1 S1` for a calendar year and `FY27 Q1 T1 S1` for a fiscal one, then `S2`,
`S3`, then `2026 Q1 T2 S1`, and a new quarter restarts both. A plan that runs
eighteen months has two Q1s in it, and a quarter without a year is half an answer. A quarter axis
names only as far as the quarter, a timebox axis as far as the timebox, and the
planning week is `P` on either of them, where a timebox or a sprint would be. Where the
periods are too narrow to repeat the whole path, it is written out where the parent
above it changes and the rung alone (`S2`) in between — which is where a reader
needs reminding and nowhere else.

Four quarters of 91 days come to 364, so a year still ends with a day or two over,
and a ladder whose quarters are shorter than the calendar's ends with more than that.
Either way the remainder is **Q5** rather than a quarter quietly stretched to hide
it — the ladder being honest about where it does not meet the calendar.

The axis names the period the chart is **looking at**, not only the ones that begin
inside it: a quarter that started last week is still the quarter you are in, and the
label sits over the middle of the part that shows. The boundary line is drawn only
where it actually falls.

### Getting it in and out of a spreadsheet

**Export CSV** writes the table as it stands; **Import CSV** replaces the rows,
after asking. Two things that have no column in the table get one in the file:
`Parent` holds a sub-item's parent and dependencies travel as a list, and both are
written as **the row's number then its name** — `1.2 Build`. An internal id would
mean nothing in a spreadsheet; a name alone stopped meaning one thing the moment a
plan could hold two tasks called "Review", and the importer would have picked
whichever came first and said nothing. The number decides it, the name keeps the
file worth reading, and a file written by hand with only a name still resolves by
name. A row that comes back deeper than three levels is promoted until it fits. Links go as `label <url>; label <url>`.

Start and End go out as the effective dates — which is what a spreadsheet is for —
and are read past on the way in with the calculated columns: a CSV cannot say which
of them was typed and which was worked out, and pinning every row on a round trip
would freeze a plan that was meant to move.

Calculated columns are written out as values, because a spreadsheet cannot do those
sums, and **read past on the way in**, because they are derived here and a stale
number from a file would be a lie that looks like a fact. A heading this table does
not have becomes a new text column rather than being dropped. CSV rather than
`.xlsx`: nothing to load, it round-trips, and Excel, Numbers and Sheets open it
directly — what it cannot carry is colour and column type, which belong to the tool
rather than to the file.

### Writing the plan out as Markdown

**Markdown** opens the plan as text somebody can read in a document, a ticket or a
message. Headings and bullets rather than a pipe table: a note is prose and a link
is a link, and neither survives a table cell. A row becomes a heading at the depth
it sits at (`## 1`, `### 1.1`, `#### 1.1.1`), carrying its number so a dependency
can name it the way the CSV does; under it go one line of **what it is** — size,
days, how far along, who is on it, with the work already divided between them — the
**note on the task as a block quote**, and a bullet for each of the things a row can
hold several of: tickets with their types and addresses, dependencies, links, any
column somebody added, and **what was written about each cell**, named by its
column. Cell notes live in a window and are otherwise the part of a plan nobody ever
reads; this is where they come out.

**There is a switch for each of those**, listed in `PROJ_MD_PARTS`, because a plan
is written out for a reason and the reason decides what belongs: a status update
wants how far along and who is on it; a scope review wants the notes and the tickets
and none of the dates; something pasted into a ticket wants the links. Everything is
on to begin with — the full version is the one you can cut down — except **Full
title**, which heads each row with the whole of its Title instead of the task's own
name. That one is off by default: the headings already nest, so inside the document a
task knows what it belongs to, and the full title is for when a row will be read away
from the rest of them. With size and completion both off a row is its heading and its
bullets rather than a pair of empty asterisks, and the summary line at the top stops
counting days the rows no longer carry.

**The dates switch covers everything date-shaped** — Start, End, the deadline, the
slack, a note about a date, a date column somebody added, and the "as of" line. Start
and End move whenever anything above them moves, so a summary that carries them is
stale by the afternoon and cannot be diffed against last week's; with them off the
text changes only when the plan does, which is what makes it worth keeping.

The choices are stored as `mdShow` on the plan rather than in this browser, because
they are decisions about this plan and whoever opens the board next wants the summary
the last person meant. **Every switch is written, not only the one that moved**:
half a set of choices is how a later default silently changes an answer somebody
already gave.

The window is **read-only**: the text is written from the table, so an edit made
there would be thrown away by the next keystroke anywhere in the plan. **Copy** takes
it away as it is, and **New note** leaves it on this board as a note — which is the
thing somebody does with a summary next: edit the wording, send it, keep it beside
the plan it came from. That note is a **copy rather than a view**. The plan will move
on, and a summary that quietly rewrote itself afterwards would be a record of
nothing. It is made with the framework's `createNoteWithText()`, and a note can be
copied out again as Markdown or as formatted text — see
[Architecture](architecture.md#copying-a-note). `projToMarkdown(data, { title, dates })` is the whole of it
and takes no DOM, so what the window shows is exactly what a test reads.

One other key sits beside `projectData`: `projFitWidth`, the width the tool last
sized itself to. It is layout rather than plan. The window fits the table up to
1200px and stops as soon as that number no longer matches, which is how a width set
by hand wins; a maximized tool is never resized.

Each row in the chart carries its own dates under its name — `10-05 – 10-16` — and
each period on a sprint, timebox or quarter axis carries the span it covers, the
whole range where the periods are wide enough and the start alone where they are not,
with both dates in the tooltip either way. The dates sit in the label column rather
than beside the bars: a bar can be a few pixels wide or hard against the edge, and a
date that overlaps its neighbour is worth less than one you can read.

`deps` guides the chart and nothing else: a bar starts today, or when the last thing
it depends on finishes, or on a date that was typed in, and runs for the row's
Remaining Days. A parent's bar is the
span its children occupy, drawn as a bracket rather than a block — its own days are
theirs, and a solid bar would count them twice. The Slack column
keeps measuring from today, so the two can disagree for a dependent item — the
chart's deadline marker turns red where the order of work overshoots, which is where
that disagreement becomes visible.

**A parent is measured against the span it occupies**, not against its children's
days laid end to end. It has no work of its own: its days are theirs, and theirs run
in whatever order and whatever parallel the plan puts them in — which is what its own
End already says. Adding them up and starting from today assumes one person doing all
of it in sequence, so a project of two streams that each fit comfortably read as
badly late, with the answer contradicting the End date on the same row. A leaf still
answers the question a leaf is asked: its own work, from today.

**Finished work has no slack at all.** Slack is room still to be used, and a row
that is done has nothing left to use it: left alone, a task finished last month would
report a healthier positive number every day it sat there, which reads as news about
work that is over, and one finished a week late would go on being scored as late
forever. `projIsDone()` is the test — a per cent of 100, which for a parent is the
weighted roll-up, so finishing the last sub-item takes the project's slack with it —
and `projSlackDays()` returns null, so **the column, the CSV and the chart agree
without being told to**: the column shows a dash, the file an empty cell, and the
chart already drew a done row as a dot rather than asking for a colour. The dash has
two meanings now and the **tooltip is which**: nothing to measure against, or
finished.

**A deadline names a day the work is allowed to be happening on**, so both the Slack
column and the chart's missed marker measure to the **last day the work occupies** —
the date the End column shows — and not to the day after it. Measuring to the day
after is what `projFinishOffset()` answers, because the length of a stretch is one
more than its last day, and using it here made a row that finished exactly on its
deadline read as a day late. In a plan that just fits, that was every row. A dependency loop is detected rather than
followed; those rows are drawn from today and the chart says so.

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

### Finance Planning — a person's own figures

`toolCustomizations[toolId].financePlan`:

```js
{
  accounts: [ { id, name, kind: 'cash'|'investment'|'retirement'|'hsa'|'education'|'property'|'other'|'loan'|'credit',
                balance, rate,          // null rate: the default for its kind, below
                monthly,                // added a month, or a loan's payment where it has no details
                compounding,            // investments: 'monthly' (default) or 'annual'
                basis,                  // investments: cost basis; a Roth: contributions; null = all of the balance
                tax, planType,          // retirement: 'pretax'|'roth' and '401k'|'457'|'ira' — chosen together in Kind as
                                        //   401(k), Roth 401(k), 457(b), Roth 457(b), Traditional IRA or Roth IRA; unset is a 401(k)
                hsaCover, hsaMedical,   // kind 'hsa': 'self'|'family' for its limit; false: drawn for other than medical costs
                loan: { amount, years, extra, closing,      // the Loan Calculator's fields
                        escrow } } ],                       // the plan's own: tax and insurance a month
  incomes:  [ { id, name, amount, every: 'month'|'year', growth, from: 'YYYY-MM', to: 'YYYY-MM', taxed,
                deductions, taxes,       // flat amounts per `every`, as on a pay stub
                matchRate, matchCap,                        // the employer's formula: matchRate% of what goes into the
                                                            //   401(k)s, up to matchCap% of pay — it replaces typed matches
                into: [ { id, account, amount, match } ],   // parts of the deductions saved into accounts, each with
                                                            //   the employer's match into it; a plan kept with one
                                                            //   intoAccount / intoAmount / match is read as one row
                wages,                                // false: not pay from work, so no payroll tax
                bridge } ],                           // true: part-time or bridge work, not the job retirement goes by
            // a Social Security line instead: { id, type: 'ss', name, birth: 'YYYY-MM', fraBenefit,
            //   claimYears, claimMonths, growth /* cost of living */, to, taxed, deductions, taxes,
            //   payFrom: [incomeId], workFrom, pastPay }   // for the estimate when fraBenefit is null
  expenses: [ { id, name, amount, every, growth, from, to } ],   // null growth: inflation
  goals: [ { id, name, cost,             // in today's dollars
             every: 'total'|'year',    // the cost in all, or a year
             years,                    // payments, one at the start of each year: 1–20
             from: 'YYYY-MM',          // the first payment
             growth,                   // null: inflation
             account } ],              // paid from it first; '' = cash, then savings
  tax: { on: true, status: 'single', year: '',    // federal tax from toolboard_taxBrackets; '' = this year's
         payroll },                              // payroll tax; unset follows `on`
  surplusTo: '',                         // account id; '' the first cash account
  assume: { years: 30, inflation: 2.5, real: true, spread: 2, target: 1000000,
            returns: { cash: 2, investment: 7, … } },
  retire: { on: false, birth: 'YYYY-MM', ageYears: 65, ageMonths: 0, until: 95,
            from: 'age',                 // 'job': the month after the last job's `to`; a job with no `to` falls back on the age
            health: false, healthBefore, healthAfter, medInfl: 5,   // health costs added to spending, when ticked
            spending: null,              // a month in today's dollars; null = today's expenses
            buffer: 6,                   // months of spending kept in cash
            avoidPenalty: true },        // false: drawOrder as it stands, penalties and all
  drawOrder: [ { id } ],                 // accounts drawn on in retirement, in order
  advice: { starter: 1, months: 6, debtRate: 8,   // Where the next dollar goes: its thresholds,
            risk: 'middle', stocks: 8, bonds: 4,  //   the lean of the mix and the two returns,
            lump: null }                          //   and a sum to place instead of the leftover
}
// a retirement account may say tax: 'pretax' (default) or 'roth'
// any account, income, expense or goal may say off: true — kept and shown, counted nowhere.
// What points at it stays pointing at it: fpEntries() and fpCalc() leave it out, fpAllEntries()
// has it, and pay into an account that is off comes off that line's deductions in fpLiveLine().
```

Before retirement, a month that leaves cash below nought is made up from savings in the
draw order — taxed and penalised as in retirement (but no age-55 or 457 exception, the job
not taken to be left): `milestones.drawnEarly`. `fpPayGap` notices pay
from work ending a year or more before the retirement date. Taxes typed on a line are paid
as typed; the estimate for the rest is the tax on everything less the tax on those lines,
so the rest lands in the brackets above them. With `retire.health`, retirement spending
gains `healthBefore` until Medicare, then Part B for each person (two when married) with its
surcharge, by the year's modified AGI two years before, and `healthAfter` — all rising by
`medInfl`. Nothing more goes into an HSA from the Medicare age.

Goals (`fpGoalPayments`) are paid in their months whether working or retired — unlike
Expenses, which give way to `retire.spending`. Each payment is the cost a year (or the
cost over `years`) grown by `growth` from today, taken out of the month's money like an
expense; then as much as its `account` holds is drawn from it back into cash (taxed as any
draw from that account is; a 529 untaxed), and what is still short is made up as any
shortfall is. Draws for a goal from its own account do not set `drawnEarly`. A 529
(`kind: 'education'`) is not in `drawOrder` and takes no `monthly` after the last goal
paid from it. `milestones.goals[id]` keeps `{ first, last, count, today, due, fromOwn,
drawn, held, left, retired, own }`. `fpGoalSaving` finds, by halving, what more a month
into the goal's account (`fpProject`'s `extra`, run to `endT`) would cover it; it is
worked out after typing stops, as `fpNeededFor` is (`fpLater`).

With `retire.on` and a birth month (the plan's, or a Social Security line's), the plan
runs to the age in `until` instead of `assume.years`. From the retirement month pay
stops — Social Security and lines with a `to` of their own go on — and so do
contributions and pay into accounts; `spending` takes the place of Expenses and rises
with inflation; loans are still paid. Each month the cash account that takes what is
left over is kept at `buffer` months of spending by drawing on `drawOrder` (cash, then
investments, then pre-tax, then Roth, unless reordered; never property). Pre-tax money
counts as income for the federal estimate, and enough more is drawn to pay that tax.
From 73 (75 for those born in 1960 or later) each pre-tax account pays out at least
its balance each January over the IRS Uniform Lifetime factor, a twelfth a month, into
cash. `fpRetireMax` finds the most spending that still lasts, by halving.

Early-withdrawal penalties are charged, by the rules' `withdraw` (`penaltyOf` in
`fpProject`): `penalty`% before `early` on pre-tax money and Roth earnings — not from a
401(k) when retirement came in or after the year of turning `sepAge`, nor a 457 once
retired — and `hsaPenalty`% before `hsaAge` on an HSA with `hsaMedical` false. Without a
birth month, none. A Roth's `basis` comes out first and free, and rises with what goes in;
earnings drawn early are ordinary income too. Enough more is drawn to pay tax and penalty
(`take`, going round until it settles). With `avoidPenalty`, each month's draw takes a
first pass through `drawOrder` for only what comes out free, then a second for the rest.
Each row has `withdrawPenalty`; `detail[k].penalty` is by account; `milestones.penalty`,
`rothEarly` and `hsaPenalty` are the first month charged, and `milestones.penalties` the
totals `{ pretax, roth, hsa }` in dollars of the time.

Ages: wherever the plan shows a month or a year — Ahead's facts, subtitle, year table,
chart and year lists, a loan's payoff, From and Until, Copy summary and what BoardAI
reads — it adds the age then, counted by the month (`fpAgeAt`) from the household's
birth month (`fpBirthOf`: Retirement's, or the first Social Security line's). Without
one, nothing changes. A Social Security line's own dates carry its claiming age.

Where the next dollar goes (`fpAdviceSteps`): the usual order — starter cash, the full
employer match (from the formula, worked from pay up to `compCap` and only as far as the
401(k) limit lets in: `fpMatchOf` gives `reach` and `best`), debt at `debtRate` or more, the
emergency fund, goals short of their account (what a month more covers them), an HSA, Roth or
traditional (the federal rate on the next $1,000 now, against the average in the retired
years pre-tax money is drawn: `fpMarginal`, from each row's `ordinary` and `benefits`), an
IRA, the rest of the 401(k), then cheaper debt against investing. `fpAdviceSplit` places this
month's leftover (or `lump`) along them; a sum skips the match and the 401(k), which come only
from pay. `fpAdviceMix` gives a stocks share by years to retirement — 90% from 25 years out,
down to 50% at retirement and 30% twenty years on — leaned by `risk`.

`fpNeededToStop` turns it round: for each year, the savings that would be needed at
its start to stop working then and last to `until` — whether or not `retire.on`, as
long as there is a birth month. Savings are what can be drawn on (cash, investments,
retirement and other accounts; not property). Stopping work stops every line of pay
from work (`wages` not false) from that year, even one with a `to` of its own; a
pension or rent goes on to its end, and Social Security from its claiming age. The
plan runs once as Ahead shows it —
`fpProject(plan, 0, { stopT: Infinity, snapshots: true })` working throughout, or with
`stopT` unset when `retire.on`, so that after the retirement date the savings are the
ones being drawn down — keeping the balances each year; each year's figure is then found from that snapshot with `{ stopT, from, lite }`
runs, the savings scaled up or down in the shares the accounts hold, halving until it
just lasts. The earliest year whose own savings last is where it says you could stop.
It is worked out a moment after typing stops (`fpNeededFor`, cached on the widget by
the plan, the rules and the month); about 0.3 s for a 55-year plan.

A year taken apart: Ahead's main run is `fpProject(plan, 0, { detail: true })`, which keeps
`detail[k]` beside `rows[k]` — row 0 this month, every other row the twelve months to it —
with each income, expense, loan payment, escrow, contribution and goal by id; deductions
and each tax; retirement spending and its health parts; what was drawn from each account
(`rmd` the forced part) and the tax on it; what was left over and what withdrawals put
back into cash; and each account's `start` and `end` with what went in (`added`) and what
it earned (`growth`; a loan's interest, negative). Amounts are in dollars of the time, so
start + in − drawn + growth = end for each account and for net worth. The year picked
(`widget._yearT`, a way of looking, not kept) opens `fpYearDetailHtml` under the chart.

A Social Security line is worked out as the SSA does: full retirement age from the birth
year (`fpFullRetirementMonths`), the benefit at that age (`fraBenefit`, today's dollars,
from the ssa.gov statement) cut by 5/9 of 1% a month for the first 36 months claimed
early and 5/12 of 1% beyond, or raised 2/3 of 1% a month for waiting, to 70
(`fpClaimFactor`). It is paid from the month the claiming age is reached and rises by
`growth`, the cost of living, inflation when empty. With `fraBenefit` empty the benefit
is estimated from pay (`fpSSEstimate`), as the SSA works it out: each year's earnings up
to the wage base, the best 35 averaged a month, and the year's bend points. The pay that
counts is `payFrom`, or — with one Social Security line — every line of pay from work;
years before now are `pastPay` (or today's pay) from age `workFrom` (22); later ones are
the pay lines as long as they run, in today's dollars. `fpGet` puts the estimate on the
line as `_est`, and `fpSet` leaves it out of what is saved. What is needed to stop
working uses the benefit as it would be with work stopping that year. The part of it that is taxable comes
from the IRS worksheet (`fpSSTaxable`): half the benefits plus the other income against
the year's two amounts, which are not moved with inflation; typed taxes on it still win.
The ages, the adjustments and the start of minimum withdrawals are all read from the
rules below.

Taxes the plan estimates, from the year's rules (`fpTaxInfo`): federal income tax on
pay less what goes pre-tax into a 401(k), on pre-tax withdrawals and on the taxable part
of Social Security (`fpFederalTax`); capital gains on what is drawn from an investment
account with a `basis`, at their own brackets on top of ordinary income (each draw is
part basis, part gain, in proportion, and the basis is followed as money goes in and
out); and payroll tax on each line of pay from work (`fpPayrollTax`: each line its own
wage base, Medicare on all of it, the surtax on the household's pay above the
threshold). Brackets, the deduction and the wage base move up with inflation; the
Social Security amounts and the surtax threshold do not. A retirement account's
contributions from pay and of its own are checked against the year's limit for its plan
type (`fpLimitCheck`), with catch-up from the household's birth year, and said when over. The limit
(`fpLimitGroup`: 401(k), 457(b), IRA, HSA) is the person's across every account of the type — a 401(k) and a Roth 401(k) share one, a
traditional and a Roth IRA another — and only pay into a traditional account comes off taxed pay.

Of an income line's deductions, `intoAmount` goes into the asset account `intoAccount`
(a 401(k), say) and `match` is what the employer adds to it, both in the line's own
period and growing with it. Both land in the account and are not spent; `intoAmount`
still comes out of take-home, as on the pay stub, and the deductions count as at least
that much. With no account, or one that has gone, they are deductions like the rest.
An account given money from pay and a `monthly` of its own is warned about, in case
the two are the same money.

A loan's `escrow` is paid each month beside its payment but does not pay it down; it
rises with inflation and goes on after the loan is paid off, since the tax and
insurance it covers do. The Loan Calculator has no escrow, so a trip through it keeps
the plan's.

An income line's `deductions` and `taxes` come out of it, in its own period, and grow
with it. Taxes typed on a line are paid as typed and keep that line out of the federal
estimate, which then covers only the `taxed` lines left; take-home is income less
both.

A loan with its original amount, term and a rate has its payment worked out from them,
as the Loan Calculator does, with `extra` on top; a loan without them uses `monthly`. A
loan's balance left empty, with a closing date, is what its schedule says is owed today.
The popup sends every one of these fields to the calculator and takes every one back.

Each of the three lists may hold section headings, `{ id, type: 'section', name, folded }`.
An entry belongs to the heading above it, and entries above the first heading belong to
none. A heading shows its section's totals: for accounts, held, owed, net, and paid in
and out a month; for income and expenses, the lines running now, a month and a year.
Folded, its entries are out of sight and its totals stay. The sums skip headings
(`fpCalc`), so sectioning changes nothing that is worked out. A heading moves with its
entries as one block, and only to where a section begins; removing a heading keeps its
entries, which join the section above. An entry moved under a folded heading opens it.

`accounts`, `incomes` and `expenses` are each in the order shown, which the person sets
by dragging a row's ☰ or pressing ↑/↓ on it; a row moves only within its own list. The first cash account in that order is where what is left over
goes when `surplusTo` is empty.

Beside it, `fpFolded` lists the sections folded to their headings (`summary`,
`accounts`, `income`, `expenses`, `month`, `assumptions`, `ahead`), for looking at
the plan with someone else there, and `fpChartYears: { from, to }` the calendar years
the Ahead chart and year table are narrowed to (unset: all of them; clipped to the
years the plan runs, never fewer than two). Both are how the tool is being looked at,
not part of the plan, so they are kept outside `financePlan`.

It is board data, so it is undone like any edit and kept in JSON exports, which are
the person's own backups. It is **not** carried by share links or HTML exports:
`PRIVATE_SHARE_KEYS` in `index.html` lists the keys that stay behind when a tool goes
to someone else, and `financePlan` is one.

## App-Level Keys (not board-scoped)

- `toolboard_pluginUrls` — installed external plugin URLs
- `toolboard_toolPluginIndex` — tool id → plugin URL, built as plugins load (see [URL Hashes](urls.md))
- `toolboard_sideNav` — `{ open, expanded: [workshopIds], revealed }`: whether the side navigation is open, which of its workshops are, and the board it last opened the way to (so a reload does not reopen what was closed by hand). Closed when unset or unreadable; on a phone it always starts closed
- `toolboard_taxBrackets` — `{ years: { '2026': { single: { deduction, brackets: [{ from, rate }] }, married: { … }, capGains, payroll, ssTax, limits, withdraw, socialSecurity } } }`: the rules of each year, edited in the Tax & Retirement Rules tool (id `tax-brackets`, once Tax Brackets) and used by every board's Tax Calculator and Finance Planning. Rates are per cent as typed; a bracket runs from its `from` to the next one's. The other parts:
  - `capGains: { single: [{ from, rate }], married: […] }` — long-term gains brackets, by where taxable income reaches
  - `payroll: { ssRate, wageBase, medicare, surtax, surtaxSingle, surtaxMarried }`
  - `ssTax: { single: { half, most }, married: { … } }` — the 50% and 85% amounts for Social Security
  - `limits: { k401, k401CatchUp, k401CatchUp6063, ira, iraCatchUp, rothSingleFrom, rothSingleTo, rothMarriedFrom, rothMarriedTo, total415, compCap, hsaSelf, hsaFamily, hsaCatchUp }` — a 457(b) has the 401(k)'s amounts as a limit of its own; `total415` caps a 401(k)'s year with the employer's money; `compCap` the pay a match is worked from — the Roth IRA's limit shrinks over its income range, rounded up to $10 (at least $200), to none above it
  - `withdraw: { earlyYears, earlyMonths, penalty, sepAge, hsaAge, hsaPenalty, rmdStart: [{ from, age }], rmdTable: [{ age, divisor }] }` — `from` is a birth year; a 401(k) left in the year of turning `sepAge` or later is not flagged for the penalty
  - `medicare: { age, partB, irmaa: { single: [{ from, b, d }], married: […] } }` — Part B a month for each person from `age`, and the Part B and D surcharges above each income (modified AGI two years before; the thresholds move up with inflation)
  - `socialSecurity: { fra: [{ from, years, months }], earliest, latest, early, earlyMonths, earlyMore, delayed, bend1, bend2, pct1, pct2, pct3 }` — per cent a month; the built-in fractions (5/9, 5/12, 2/3) are kept exact; the bend points and percentages are the benefit formula

  Kept as typed. `taxRulesFor(year)` gives the planner a year's rules cleaned up, every unusable one the built-in, cached on the stored string. A part missing from a saved year (one saved before these were kept) is the built-in. Unset or unreadable means the built-in year, so an exported board's calculator still works. Not on a board, so not in board undo, exports or share links
- `toolboard_boardManagerView` — `grid` or `list`: whether the Boards popup shows cards or one row a board. Cards when unset or unreadable; the same choice for every board
- `toolboard_workshops` — the workshops boards are kept in, `[{ id, name, parentId }]`; `parentId: null` is the top. A board in one has `workshopId` on its entry in `financeBoards`, and a board without one is at the top — which is every board from before workshops, so there is nothing to migrate. See [Workshops](architecture.md#workshops--where-boards-are-kept)

## Helpers

- `loadToolCustomizations()` — reads the full customizations object from localStorage
- `saveToolCustomizations(customizations)` — writes the full customizations object to localStorage
