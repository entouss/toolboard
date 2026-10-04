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
  addedColumns: { ticket: true },                      // migrations already run
  columns: [ { id: 'size', title: 'TS-Size', type: 'size', builtin: true,
               collapsed: false }, … ],
  rows:    [ { id: 'r-…',
               cells: { item: 'Discovery', size: 'M', pct: 60, deadline: '2026-10-12',
                        start: '', end: '',               // '' = left to the plan
                        resources: ['Robin', 'Alex'],
                        deps: ['r-…'], links: [ { label, url } ] },
               notes: { item: 'The long version…', deadline: 'Fixed by the event' } },
             { id: 'r-…', parent: 'r-…', cells: { … } } ]
}
```

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
built-ins start in the order the questions get asked — ID, Ticket, Task, Title,
Dependencies, Size, % Done, Start, End, Total, Left, Deadline, Slack, Assigned,
Notes, Links — and
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

**Title is the three of them in a line** — `projRowTitle()` joins the project, the
task above it and the task, dropping empty parts along with their separator so a
plan with no name yet reads "Build - Review" rather than " - Build - Review". It is
made of what is already on the row rather than typed again, so renaming the project
or the parent moves every title that mentions it, as it is typed. The column is
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

**Tickets.** A `ticket` cell holds a number — `ABC-123` — and `ticketBase` holds the
one address the board turns numbers into links with, because writing the whole URL
into every row is what the column exists to stop. `projTicketUrl()` is the only
thing that builds the address: `{ticket}` anywhere in the base is replaced by the
number, and a base without it has the number appended with exactly one slash
between them however the base was typed. **A base that is not `http:` or `https:`
makes no link at all, and the number is URL-encoded**, because a base is typed in
here but a row can arrive from a CSV somebody else wrote, and `javascript:` reaching
an `href` is how that becomes their script running on this board. The cell stays an
input and the arrow beside it is what opens the ticket, so a cell you can edit never
turns into a link that swallows the click.

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
  periodStart: '', axis: 'dates' }
```

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
that disagreement becomes visible. A dependency loop is detected rather than
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

## App-Level Keys (not board-scoped)

- `toolboard_pluginUrls` — installed external plugin URLs
- `toolboard_toolPluginIndex` — tool id → plugin URL, built as plugins load (see [URL Hashes](urls.md))

## Helpers

- `loadToolCustomizations()` — reads the full customizations object from localStorage
- `saveToolCustomizations(customizations)` — writes the full customizations object to localStorage
