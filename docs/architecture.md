# Architecture

## Core (`index.html`)

Contains the application framework only: CSS variables/theming, header/board UI, tool window manager (drag/resize/z-index), storage layer, board switching, plugin loader, import/export, and the two templates a user writes in rather than installs — `blank`, the note, and `script`, the [dynamic tool](dynamic-tool.md). **Do NOT add tool-specific code (CSS, functions, or NOTE_TEMPLATES entries) to index.html.** All tool implementations belong in their respective plugin files under `plugins/toolboxes/`.

Board-level undo and redo live here too, in the storage layer rather than in any
tool: every board write goes through `trackedSave()`, so a plugin gets undo by
storing its state the ordinary way. See [Storage](storage.md#undo-and-redo).

### A note, made by something other than a person

`createNoteWithText(text, title)` puts a note on the board already holding
something. A tool that has worked out something worth keeping — a summary, a
report, a list — should be able to leave it on the board without knowing how a note
is built, where it goes or how it is saved, and without each one reinventing the id,
the position and the save. The content is written after the tool exists, so the
panes already on screen are brought into step by hand: the same two lines the big
editor runs when it saves.

It **leaves fullscreen first**. A maximized tool covers the whole board, so a note
made from inside one would land behind it and read as nothing having happened —
whatever asked for a note wants to see the note.

### Writing a note in rich text

A note can be written two ways, switched per note with **Rich / Markdown** in its bar.
Markdown is the textarea it always had. Rich is the note written the way a chat
message is written: a formatting bar in Slack's order (bold, italic, strikethrough ·
link · numbered, bulleted · quote, code, code block), Slack's shortcuts (⌘B, ⌘I, ⌘⇧X,
⌘⇧U, ⌘⇧7/8/9, ⌘⇧C, ⌥⌘⇧C — Ctrl on other platforms), and Slack's marks becoming what
they mean as they are typed: `*bold*`, `_italic_`, `~struck~`, `` `code` ``, and `- `,
`1. `, `> ` and ```` ``` ```` at the start of a line. One asterisk is bold here, not
italic, because that is what somebody who writes in Slack means by it.

**Headings, underline and lines.** H1, H2 and H3 lead the bar — what a line is, before
what is in it — and toggle back to normal text; ⌘⌥1–3 and ⌘⌥0, as in Google Docs; `#`,
`##`, `###` and a space at the start of a line make them, as `- ` makes a list. Smaller
headings in a note still open and keep. Underline is ⌘U and U — Markdown has none, so
it is kept as `<u>…</u>`, which `marked` shows; the browser underlined on ⌘U all along,
and the save dropped it. A horizontal line is the ― button, or `---` and a space,
kept as `---`, with a paragraph after it to go on writing in.

**Code blocks come off as they go on.** The browser's command could do neither well:
a block from Markdown is `<pre><code>`, and the `<pre>` made a paragraph left the
`<code>` inside it — inline code, not text; several lines, or a list, ran together into
one; and a list was put *inside* the block. So `noteRichToggleCodeBlock()` does it by
hand (one plain line still uses the command, for undo), for what the selection covers
— select-all starts outside every block and was taken for "not in code":

- A list made code keeps a line to each item with its marker (`- `, `2. `, nested ones
  indented). Only the items selected go: the list is split round them, numbered on
  after the block.
- A selection that starts and ends in the same list, however deep, is about that
  list's items — two indented items make code inside their parent, not the parent
  and everything under it. An item counts only if some of its words are selected:
  Shift+↓ ends at the very start of the next item, which it touches but does not take.
- Taken off, lines that read as list items are a list again and the rest a paragraph
  each, and a list that comes back between the two halves it was taken from joins
  them — so list → code → list is the list it was.

**Tables.** The ⊞ menu inserts a 3 × 3 table — a header row and two — and, with the
caret in one, adds rows and columns, aligns a column and deletes rows, columns or the
table, all done on the table by hand since the browser has no commands for them. Tab
and Shift+Tab go cell to cell (Tab in the last cell makes a row), Enter goes a row
down. A Markdown cell holds one line of words, so there is no line break in one and a
paste into one is joined into a line. Saved by a rule of our own, not a second library
from a CDN: the header row, a row of alignments (`:---:`), the rest, every `|` in a
cell escaped. The header row cannot be deleted or have a row put above it — a Markdown
table must have one. A table pasted from a page arrives as one, its first row the
header. Tables no longer keep a note out of rich text. Column alignment also shows now:
the board's table rule set `text-align` on every cell, over the `align` that `marked`
writes.

**Emoji are a little larger than letters** (125%). Emoji are letters as far as CSS
knows, so they are sized through a font of their own — `Note Emoji`, the system's emoji
font for emoji code points only, with `size-adjust` — set on the note's text (not its
bar's icons). The words, the Markdown and the editing are untouched. Behind it the note
falls back to `--tool-font`, `--board-font` and the board's default stack: a font set on
the note would otherwise have hidden the one chosen for the tool or the board, so those
are passed down as variables where they are applied.

**Tab indents.** In a list item Tab and Shift+Tab move the item — or the items selected
— a level in or out (under the item above; after the item it was under, taking what
followed it along), by hand with the caret held by node. In code Tab is two spaces.
Anywhere else it still moves the focus on, so the keyboard can always leave the note;
before, it always did, and an indent could not be made at all.

**Lines in a code block.** Enter in a block makes a `<br>`, not a newline, and the
block's text alone has none for one — saved, the lines ran together. Every block is
now written from `noteCodeText()`, its words with each `<br>` a line, by one rule for
`<pre>` with or without `<code>`, which keeps a block's language (```` ```js ````) and makes
its fence longer than any backticks inside. Enter on an empty last line leaves the block
for a paragraph after it, as an empty line leaves a list; Shift+Enter is always a line. And
↓ on the last line of a code block, or in the last row of a table, that ends the note
makes a line under it (`noteRichLineBelow()`): there was nowhere below to put the caret
— a click there landed back in the block. Anywhere else ↓ is the browser's.

**Spacing.** Rendered Markdown set no line height and had the browser's ~1.15 — tighter
than the 1.5 it was written at. It is 1.55 now, in the rendered note and both editors
alike, and a tool's **Line Spacing** setting — beside Font Size and Padding — changes
it: set as the content's line height and as `--tool-line-height`, which Markdown and
the editors read, since each sets its own and an inherited one never reached them.

The round-trip test ignores space at the start or end of a paragraph, item, heading or
cell, which is not shown and not kept: a line begun with a space had the note refused
rich text from then on. Code keeps its spaces. And both renderings are read through
the browser's parser first, so a character is the same however it was spelled —
`&copy;` written by hand comes back as ©, which had refused such a note too. What
still refuses one: raw HTML other than `<u>`, a checklist, an HTML comment
(which would be lost), plain text, or the conversion library not having loaded (it
comes from a CDN).

**It is a second way of editing the same thing, not a second thing.** The note is
still Markdown, saved on every keystroke — Turndown for rich text to Markdown, `marked`
for the way back — so the result pane, Copy Markdown, the share links, export and the
big editor never learn the rich editor exists. The surface wears `.markdown-content`,
the class the rendered note wears, so what is written there looks exactly like what it
will be read as.

New notes start in Rich. Notes made before keep the Markdown they were written in
(`noteEditor` is unset, which means Markdown), because nobody's note should change
editor under them.

**A note rich text cannot hold is never opened in it.** Rich text keeps what a note
*means*, not how its Markdown was spelled — `__this__` comes back as `**this**` — and
some Markdown means things rich text cannot hold at all. `noteRoundTrips()` renders the
note, turns that back into Markdown, renders *that*, and compares the two renderings; a
note whose renderings differ (raw HTML, a checklist, a comment) opens as Markdown with a
line saying why, and Rich is switched off for it. So are notes shown as plain text.
Being opened never changes a note: only typing in the rich editor saves.

Turndown's defaults were close but not safe, and each override is a thing it got wrong
when tried:

| It did | So |
| --- | --- |
| Wrote text that looked like HTML as raw HTML | `<` is escaped (and `&` before an entity). Typed text can never become running script |
| Wrote the contents of `<script>` and `<style>` as text | They, and the other elements that are not prose, are dropped whole |
| Dropped `<strike>`, which the editor makes, to plain text | `~~struck~~` |
| Turned a `<pre>` without `<code>` — what the bar's code block makes — into a paragraph | A fenced block |
| Wrote `-   item` | `- item`, the way somebody would type it |

And two things the browser does that would otherwise reach the stored note: a space
typed beside formatting is written as a non-breaking one (turned back into a space on
save), and the list command puts the list *inside* the paragraph the caret was in
(`noteRichUnnest()` lifts it back out after every change, keeping the caret by node).

**A web address written out — `https://…` or `www.…` — becomes a link in rich text**
when the space, Enter or Tab after it is typed (`noteRichAutoLink()`), and when it is
pasted as plain text; `marked` already made it one when the note was shown, so before
this it was a link in the note and words where it was written. Punctuation after it,
and a `)` it did not open, are the sentence's (`noteTrimUrl()`, Markdown's own rule).
It needs a space or `(` before it, and code, an existing link, an unclosed backtick or
a `[words](` being written leave it alone. A link that says its own web address is
saved as the bare address (the `bareLink` Turndown rule) — not `[address](address)`,
which escaped the `_` in it — but only where `noteBareLinkOk()` finds nothing beside it
or round it that would change how Markdown reads it; otherwise it keeps its brackets.

**Markdown's own link, `[text](address)`, becomes a link in rich text** — when its
`)` is typed, the way the closing `*` makes bold; when a `*`, `_` or `~` closes round
words that hold one; and when text that holds one is pasted — plain, or HTML from a
page, an editor or a chat, where the link is made before the paste is cleaned (left
as words, the cleaning escaped the brackets and `marked` then made the addresses in
them links of their own, one inside the other). Before, the
brackets were kept as words, escaped, so the note showed them, and a bold closed round
them bolded the brackets. The address goes through the link form's check (web or mail;
a bare domain made a web one); anything else stays words. Code stays literal: a `)`
inside a backtick that has not closed yet makes no link. The marks now read the line
up to the caret rather than the one text node it is in, so a mark opened before a link
and closed after it still closes. Chrome's `insertHTML` pins the computed font on what
it inserts (`<span style="font-family: …">`); Markdown has no styles, so it was never
saved, but `noteRichUnstyle()` takes it off the surface on every save — keeping the
caret by node, since moving a node out from under the caret put the next key inside
the bold before it.

**A message copied out of Slack** arrives looking like it did there. Slack copies:

| As | So |
| --- | --- |
| An address it shows as code: a link *inside* code, which Markdown cannot say — the code showed the link's own syntax | Code inside a link, `` [`ann@example.org`](mailto:…) ``, which it can, and which looks the same (an address that is not web or mail: just the code) |
| Every emoji as a picture (`<img alt=":apple:" src="…/1f34e@2x.png">`), pasted as full-size images on lines of their own | The emoji itself, from the file name's code points, an alt that is the emoji, or the board's emoji list by name — or `:name:` as words |
| Paragraphs as two `<br>`, written as one line break, so the gap went | Two line breaks in a row are a paragraph |
| A list as lines starting with `•` — text, while `• ` typed makes a real list, so the pasted bullets and the ones added after them differed | Lines starting with `•`, `◦`, `▪` or `‣` are a list, with a blank line round each run so the next line is not read as more of the last bullet; code blocks are left alone. Plain-text pastes too |

**Inline code is marked the way Slack marks it** — its own colour of text on a chip
with an edge (`--code-text`, `--code-bg`, `--code-border`): crimson in light, orange in
dark, 5.9:1 and 6.8:1. The chip alone, `#f4f4f4` on a white note, was 1.1:1 — there,
but not to be seen. Code blocks keep the plain text and lose the edge.

**Contrast.** Find paints its matches solid with dark text (13:1, and 8:1 for the
current one) — see-through, they took the theme's text colour, light on muddy yellow in
dark mode. Links in rendered Markdown use `--link-color`, 4.5:1 or better on the page
and on code in both themes; `#3498db` was 2.9:1 on code in light. Headings lost their
`brightness(0.7)` in dark mode, where it dimmed light text below what it heads.

**Paste is cleaned by going through Markdown**: whatever was copied keeps what Markdown
can say — headings, lists, bold, links — and loses everything else, styles and scripts
included, so a paste can only leave behind something a person could have typed. A web
address pasted over a selection makes it a link. Links themselves are http, https or
mailto only; a bare domain gets `https://`; anything else makes no link.

**Edit Content is not offered for a note; what it was for is in the note.** The
note's bar has no Editor button, its ⚙ settings hide Edit Content, and a new note
never opens it — other tools keep it. One bar serves both editors: the formatting is
rich text's and hides in Markdown; the rest of it is the note's and stays.

- **Emoji** — the board's picker. Picking takes the focus into the picker, so the
  caret is held before it opens (a range in rich text; a textarea keeps its own) and
  the emoji lands where it was.
- **Find and replace** — ⌘F, ⌘H, or 🔍. Enter and Shift+Enter step, Aa matches case,
  Escape closes it and goes no further. In Markdown it searches the Markdown; in rich
  text, the words as they read — `**bo**ld` is found by "bold" — with a line break
  between blocks so nothing matches across two paragraphs. Matches are painted with
  the CSS highlight API, not wrapped in elements: wrapping would be a change, and the
  surface saves every change it sees. A textarea cannot paint parts of itself, so
  there the current match is selected, and only when the find bar asks — typing in
  the note just recounts, or the next key typed would replace the match. A
  replacement goes in through `insertText`, so it takes the formatting of what it
  replaces and undo takes it back, and Slack's marks are held off while it does (a
  replacement ending in `*` is not bold).
- **Transform** — Edit Content's eight transforms and casing, written to the
  settings Edit Content writes (`textSort`, `textUnique`, …, `textCasing`). Below
  them, **Show as plain text** (`plainText`, which had no other switch; rich text
  cannot show it, so ticking it moves the note to Markdown with a line saying why)
  and **Reset to default**, only on a note whose template came with content: the
  template's content back and its transforms off, asked first.
- **Length** — words, characters, minutes to read, under the text, by `textStats()`,
  the function Edit Content's count uses too, of the Markdown that is kept, so a
  note never has two lengths. A list's dashes count, as they do there.

A transform changes the note as *shown*, never as written: the editor keeps the lines
in the order they were typed and only the rendered note is sorted or recased — which
is why such a note can be opened in rich text at all. In Edit only the writing is on
screen, so ticking one there opens the note beside it (Both), the way Edit Content
shows its preview. The menu opens inside the note, on whichever side fits: in a
narrow note the bar wraps, and a menu hung from the right would leave the note's left
edge, where the note's scrolling cuts it off. It is placed again after each change, because "Transform · 2" is a
longer button than "Transform" and can move.

Left out on purpose: Edit Content's Cancel (a note saves as it is typed; undo is the
way back) and its ⌘⇧S / ⌘⇧R / ⌘⇧U line shortcuts (⌘⇧U is the rich editor's link, and
⌘⇧R the browser's hard reload).

Rich text writes every line as a paragraph — Enter makes one — so its lines are a
blank line apart, and taken a line at a time the transforms sorted the blank lines to
the top, numbered them, dropped them as duplicates and ran the paragraphs together.
`applyTextTransforms()` now takes text whose lines are *all* a blank line apart as
paragraphs: transformed as lines, put back a blank line apart. Lists and anything else
with consecutive lines are a line at a time as before; with Drop blank lines on, the
text is taken as it is, since that asks for the paragraphs to run together.

The formatting commands are `document.execCommand`. It is deprecated with no
replacement and supported everywhere, and it is what puts each change on the
browser's own undo stack — which the board's undo already leaves alone inside
anything `contenteditable`.

### Folding a note's code

In a note's result each code block sits under a bar — ▾/▸, its language, how many
lines — that folds it away (`noteFoldCodeHtml()`, a button with `aria-expanded`;
Enter and Space work, and a double-click on it is two folds, not the editor). Which
blocks are folded is kept with the note as `codeFold`, by the block's place in the
note, and never in the Markdown: everything that reads the note reads what it did.
Kept by place, a block added above a folded one moves the fold; kept by content, any
edit to a block would have opened it again. A note may also start long blocks folded
(`codeFoldLong`, "Fold Long Code Blocks" in its settings, offered only when every tool
being set is a note); a block folded or opened by hand keeps that. Copy formatted
copies every block open and none of the bars, the rich editor shows every block whole,
and printing shows them all.

### Sorting, filtering, paging, folding, sizing and moving a note's tables

A table in a note's result whose headings are not all blank gets controls in its
headings (`noteTablesHtml()`, after the code is folded): the heading sorts its column
up, down, then back to the order written — as numbers when every value is one
(`$1,200`, `45%`), as dates when every value is one, else as words, empty cells last
either way; ▾ opens a filter for that column, words it contains and, when it has no
more than 20 different values, a tick-box for each with how often it comes; ‹ folds it
to a 16px strip with its heading on its side, as the project table does; and the
heading's right edge drags to size it, a double-click there putting it back. A table
long enough to be paged (below) also gets a box over it that keeps rows with all its
words in any cell, with "n of m rows" and Clear while anything is filtered; a shorter
one is read at a glance, and there the box would be clutter.

A table of more than 25 rows comes 25 to a page, with a pager under it (the range,
‹ the page numbers ›, far pages folded into …, and Rows per page: 10, 25, 50, 100 or
All). It pages what the filters leave, and a new filter or sort goes back to page 1.
Rows per page is kept with the note (`pageSize`); the page you are on is not. A
paged-out row is hidden by a class rather than `hidden`, so printing shows them all.

Columns move by a ⠿ grip that shows in a heading — dragged, it marks where the column
will land — or by Move left / Move right in the column's ▾. The order is kept as
`order`, the columns as written in the order they show. Every cell carries the place
its column was written (`data-col`), and sort, filters, folds and widths are kept by
that, so they go with a moved column. While the order is not as written, the bar
over the table offers Reset columns. `noteTableApply()` only moves the cells of a row
that is out of order: re-inserting a heading, even where it is, would drop the
pointer a resize holds.

`noteTableApply(wrap, view)` puts a table as its view says, on the table being built
and on the live one alike, so typing in a filter changes the rows in place rather than
redrawing the note. The views are kept with the note as `tableViews`, by the table's
place in the note, the way `codeFold` is, and never in the Markdown. A column keeps its
sized width (`overflow-wrap: anywhere` lets it go narrower than its words) while the
table still spans the note; once every column has a size, the table is those sizes.
Copy formatted copies each table as written — every row and every column, in the
order written, no controls (`noteTablePristine()`); the rich editor shows it as written; printing shows
folded columns whole and none of the controls.

### On-device AI (✨)

`BoardAI` is the one door to Chrome's built-in model: `status()`, `prompt()`,
`summarize()`, `translate()`, each streaming, stoppable, and reporting the model's
one-time download only when there is one (Chrome tells every new session 0% and
100%). It has no network code and no cloud fallback. `BoardAI.refresh()` marks the
page `html[data-ai="on" | "none" | "off"]`; Plugin Settings ▸ On-device AI turns it off
for this browser (`toolboard_onDeviceAI`, not a board setting: boards are shared, and
the choice is the person's).

A tool offers it by declaring what it can work on, and nothing about how it looks:

```js
ai: { target: 'fnName' | fn, apply: 'fnName' | fn, actions: ['summarize', 'rewrite', 'reshape', 'ask', 'translate'] }
```

`target(toolId)` returns `{ text, scope: 'selection' | 'whole', label?, emptyLabel?, … }`
(`label` says what it covers in the tool's own words, `emptyLabel` why there is
nothing yet); `apply(toolId, result, how, target)` puts a result back, `how` being
`replace` or `insert` — a tool with no `apply` is read only, and its answers can only
be copied. `custom: [{ id, group, label, system?, prompt: (text) => string }]` are the
tool's own actions, listed first under their own heading: Class Grades offers a student
summary, what needs attention and what is due this week this way, over a compact report
(`classGradesAIText`) small enough for the model's input. The
framework puts ✨ in the header of a tool that declares `ai` (`boardAIButtonHtml`),
shown only under `data-ai="on"`, and everything after that is BoardAI's popup
(`#boardAIPopup`): on the page rather than in the tool, so no tool's layout clips it
and no tool's export carries it; beside the tool where there is room, draggable,
closed by ✨, × or Esc. Its scope line follows the selection while it is open. What
comes back streams into the popup and changes nothing until Replace or Insert, which
are the tool's `apply`; Copy and Discard never touch the tool, and an answer to a
question is never put over what it answers. A note's side is `noteAITarget` (the
selection in whichever editor shows, else the note) and `noteAIApply` (through the
ordinary saves, so undo takes it back). `tests/note-ai.mjs` fakes the model with
Chrome's API shape.

### Copying a note

A note is written in Markdown and read as a document, which are two different things
to copy, so it offers both — each as a copy icon joined to the way of writing it
matches: **Rich ⧉** copies formatted, **Markdown ⧉** copies Markdown. Markdown is the
source, for a ticket or a README. Formatted is what it looks like, for a document, an
email or a chat
message — paste the source into one of those and you get hashes and asterisks where
the headings were.

`copyRichTextToClipboard(html, plain, message)` puts **both** on the clipboard, the
markup and the words, and lets the target take whichever it understands; the plain
half is what the note looks like rather than how it is written. `ClipboardItem` is
the way that states what it is doing, and where it is missing or refused — it needs
a secure context, and Safari has been particular about when — a hidden editable copy
of the markup is selected and copied, which is the old way and still the one that
works everywhere. If even that fails the words go on their own: something on the
clipboard beats a button that did nothing. The reader's own selection is put back
afterwards.

### Workshops — where boards are kept

Boards are filed in **workshops**, the way files are in folders: a workshop holds
boards and other workshops, to any depth, and nothing of its own. It is deliberately
not a board — a board that could hold boards would be a workspace and a folder at
once, with a canvas nobody uses, a click that could mean either, and a delete that
takes tools with it. ("Toolbox" and "drawer" were taken: one is a plugin of tools,
the other a slide-out panel.)

- **Kept apart.** `toolboard_workshops` holds `{ id, name, parentId }`; a board names
  its workshop with `workshopId` in `financeBoards`. Nothing about a board's own keys
  changes, so exports, links and templates go on as they were. `tidyWorkshops()` runs
  on load and puts right what another copy of the page or a hand edit can leave —
  a duplicate id, a parent that is gone, two workshops inside each other, a board in
  a workshop that is gone — by moving it to the top, never by removing it.
- **Order.** Workshops are listed by name, before boards; boards keep the order of
  `boards`. A board moved into a workshop goes in after what is there, and Alt+arrow
  and the settings drawer's Earlier/Later step past only the boards in its own
  workshop.
- **The popup.** It opens in the current board's workshop, with a path above the list
  (All boards › Home › Garage) whose steps go back up; Backspace goes up a level. A
  board or workshop dropped on a workshop or on a step of the path goes in; dropped
  beside a board it goes where that board is, workshop and all. **Move to…** on each
  card, and the drawer's Workshop list, do the same from the keyboard, and never offer
  a workshop a place inside itself. Search looks in every workshop and says where each
  one found is. Deleting a workshop moves what was in it up a level; no board is ever
  deleted with one.
- **Cards or a list.** The ▦ / ☰ switch beside search (`toolboard_boardManagerView`)
  shows boards as cards or one row each — the same elements either way, so everything
  above works in both; only where a drop lands before or after is read across a card
  and down a row.

### The side navigation

The ☰ at the left of the header opens a tree of every workshop and board down the
left of the page (`#sideNav`) — for getting to a board without the popup. Changing
boards stays in the popup ("Manage boards…" at its foot opens it).

- **Beside the board, or over it.** Wider than 768px it pushes `main#toolboard` over
  by its width (`body.side-nav-open`), so nothing is covered; a tool's kept position
  never changes, since every drag works in movement, not screen position. Narrower,
  it slides over the board with a backdrop, closes once a board is chosen, and starts
  closed whatever was kept. It sits under the header and follows `--header-height`
  when the header is hidden. Closed, it is `inert`, out of the Tab order.
- **The tree.** Workshops first by name, then boards in their order — what the popup
  shows. The open board is marked `aria-current`; the first time a board is open the
  workshops it is in are opened, and after that they stay as they were left. The
  filter keeps matching boards inside the workshops they are in.
- **Keyboard.** An ARIA tree, flat, with `aria-level`: ↑/↓, Home/End, → opens a
  workshop and then steps in, ← closes it and then steps out, Enter opens. One item
  is in the Tab order at a time.
- **In step.** `saveBoards`, `saveWorkshops`, `updateBoardSelectorLabel` and
  `refreshBoardRow` each schedule a redraw, coalesced into one per change; state is
  kept in `toolboard_sideNav`.

## Plugin System

Three plugin types registered via global `PluginRegistry`:

- **Tools** — individual widgets (`PluginRegistry.registerTool({...})`)
- **Toolboxes** — tool groupings (`PluginRegistry.registerToolbox({...})`)
- **Boards** — pre-configured workspaces (`PluginRegistry.registerBoard({...})`)

Plugin files live in `plugins/toolboxes/` and `plugins/boards/`. They're loaded via `<script>` tags (either from the official plugins list or user-added URLs saved in localStorage).

Plugins can also be installed on demand: opening a `#tool/<toolId>` link resolves the tool to the plugin that provides it, installs that plugin, and opens the tool maximized — see [URL Hashes](urls.md).
