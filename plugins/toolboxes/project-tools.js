// Project Tools Toolbox Plugin
// Contains the Project Table tool: a planning table, and the Gantt chart it implies.

// Inject CSS styles for project tools
(function() {
    if (document.getElementById('project-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'project-tools-styles';
    style.textContent = `
/* ---- Project Table -----------------------------------------------------------

   Green to red, five steps, for size and for completion: XS green through XL red,
   and completion red at nothing done through green at finished — so green reads as
   "good" in both, which is the whole point of asking for it.

   What that costs, measured rather than guessed. The five are the best green→red
   available from documented values (#008300 #0ca30c #eda100 #eb6834 #d03b3b), and
   no five-step green→red clears every gate: XS↔S, the two greens, sit at ΔE 9.7
   against a floor of 15, and green↔yellow is 6.3 under protanopia, inside the band
   that is legal only with secondary encoding. On the dark surface amber and orange
   are brighter than the lightness band wants.

   The secondary encoding is therefore not optional and must not be removed: the
   size control *is* its own label — the select shows XS/S/M/L/XL — and the progress
   bar always carries its number beside it. Colour never says anything here that the
   text does not also say. (The blue ordinal ramp this replaced passed every gate in
   both modes; the trade was made deliberately.)

   Slack is the one genuine *status* scale and keeps the reserved status palette,
   which is fixed and never themed. Ink is whichever of black or white measured
   higher against each step, not whichever looked right. */
:root, body.dark-mode {
    --proj-size-1: #008300; --proj-size-2: #0ca30c; --proj-size-3: #eda100;
    --proj-size-4: #eb6834; --proj-size-5: #d03b3b;
    --proj-ink-1: #ffffff; --proj-ink-2: #0b0b0b; --proj-ink-3: #0b0b0b;
    --proj-ink-4: #0b0b0b; --proj-ink-5: #ffffff;
}
:root, body.dark-mode {
    --proj-good: #0ca30c; --proj-warning: #fab219;
    --proj-serious: #ec835a; --proj-critical: #d03b3b;
    /* Off the ramp: O and ?. Grey says "this is not a point on the scale", which is
       exactly what both of them are. */
    --proj-size-0: #8a9099; --proj-ink-0: #ffffff;
}

.proj-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; width: 100%; font-size: 12px; }
/* The chart goes under the table, not beside it: a row of this table is wide and a
   bar is long, so side by side gives each of them half the width it wants. The
   framework's divider is a column-resizer and its drag maths is horizontal, so this
   tool does without one — the panes split the height and each scrolls. */
.proj-widget .authoring-split { flex-direction: column; }
.proj-widget .authoring-resizer { display: none; }
.proj-widget .authoring-source { display: flex; flex-direction: column; min-width: 0; min-height: 0; flex: 1 1 58%; overflow: auto; }
.proj-widget .authoring-result { flex: 1 1 42%; min-width: 0; min-height: 0; overflow: auto; display: flex; flex-direction: column; }
.tool.authoring-split .proj-widget .authoring-source { padding-bottom: 8px; border-bottom: 1px solid var(--border-light); }
.tool.authoring-split .proj-widget .authoring-result { padding-top: 8px; }

/* Days per size. One line, always in view: it is what every calculated column is
   built on, and a number you cannot see is a number you cannot trust. */
/* The three setting strips fold away together: a plan being read rather than set up
   wants the table and the chart, not the scale they were built with. What they say
   is still true while they are hidden — this hides the controls, not the numbers. */
.proj-settings-hidden .proj-sizes,
.proj-settings-hidden .proj-units,
.proj-settings-hidden .proj-tickets { display: none; }
/* The row's place in the plan: a column of numbers read down rather than across,
   so they are set in the same tabular figures as the days. */
.proj-num { color: var(--text-muted); font-variant-numeric: tabular-nums; }
.proj-title { display: flex; align-items: center; gap: 4px; }
/* One line, and the whole of it. Three names end to end make this the widest thing
   in the table, which is why the column is folded away until somebody wants it —
   but somebody who unfolds it wants to read it, and half a title is no use to them
   or to the copy button beside it. */
.proj-title-text { flex: 0 0 auto; white-space: nowrap; }
/* Chrome, like every other per-cell button here: there to be used, gone to be
   looked at. */
.proj-title-copy {
    flex: 0 0 auto; border: 0; background: none; cursor: pointer; padding: 0 2px;
    color: var(--text-muted); font-size: 12px; line-height: 1; opacity: 0;
    transition: opacity 0.12s;
}
.proj-table tbody td:hover .proj-title-copy,
.proj-table tbody td:focus-within .proj-title-copy { opacity: 1; }
.proj-title-copy:hover { color: var(--proj-size-3); }
.proj-settings-toggle { margin-right: auto; }
.proj-sizes { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; flex: 0 0 auto; }
.proj-sizes-label { color: var(--text-muted); font-size: 11px; }
.proj-size-field { display: flex; align-items: center; gap: 3px; }
.proj-size-field input {
    width: 44px; padding: 2px 4px; border: 1px solid var(--border-color); border-radius: 3px;
    background: var(--input-bg); color: var(--text-primary); font-size: 11px;
    font-variant-numeric: tabular-nums;
}
.proj-chip {
    display: inline-block; min-width: 26px; text-align: center; padding: 1px 6px;
    border-radius: 4px; font-size: 11px; font-weight: 600;
}

/* The ladder reads as a sentence — Week 5 days, Sprint 2 weeks — so each rung is
   a label, a number and what it comes to, and the chain is never arithmetic the
   reader has to do. */
.proj-units { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; flex: 0 0 auto; }
.proj-unit-field { display: flex; align-items: center; gap: 3px; }
.proj-unit-label { font-size: 11px; color: var(--text-secondary); }
.proj-unit-note { font-size: 10px; color: var(--text-muted); }
.proj-units input[type="number"] {
    width: 42px; padding: 2px 4px; border: 1px solid var(--border-color); border-radius: 3px;
    background: var(--input-bg); color: var(--text-primary); font-size: 11px;
    font-variant-numeric: tabular-nums;
}
.proj-unit-toggle { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-secondary); cursor: pointer; }
.proj-unit-date {
    padding: 1px 3px; border: 1px solid var(--border-color); border-radius: 3px;
    background: var(--input-bg); color: var(--text-primary); font-size: 11px;
}
.proj-unit-date.proj-when-derived { color: var(--text-muted); font-style: italic; }
.proj-unit-select {
    padding: 1px 4px; border: 1px solid var(--border-color); border-radius: 3px;
    background: var(--input-bg); color: var(--text-primary); font-size: 11px;
}
.proj-axis-pick { margin-left: 8px; }

.proj-tickets { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; flex: 0 0 auto; }
.proj-ticket-base { flex: 0 1 280px; min-width: 120px; font-size: 11px; padding: 2px 4px;
    border: 1px solid var(--border-light); border-radius: 3px;
    background: var(--input-bg); color: var(--text-primary); }
.proj-ticket-base:focus { outline: none; border-color: var(--proj-size-3); }
.proj-ticket-note { color: var(--text-muted); font-size: 10px; }
/* The number stays an input, because it is typed into. It is painted as a link
   when it resolves to one, and the arrow beside it is what opens it — the same
   shape as the Links column, so a cell you can edit never pretends to be a link
   that swallows the click. */
/* A description is paragraphs, and paragraphs do not belong in a table row. The cell
   holds the opener and the first few words of what is there, so the column still
   tells you which rows have one without being as tall as the longest. */
.proj-when { display: flex; align-items: center; gap: 1px; }
/* A worked-out date is shown the way a placeholder is: there to be read, plainly not
   typed in. The ones somebody committed to stand out against it. */
.proj-when-input.proj-when-derived { color: var(--text-muted); font-style: italic; }
.proj-when .proj-x { color: var(--text-muted); font-size: 10px; }
/* Every cell can be written about, so every cell has an opener — out of the flow, in
   a lane the padding keeps clear, and invisible until the cell is under the pointer
   unless there is something to read. Fourteen columns of permanently visible buttons
   is a table you cannot see the plan in. */
.proj-table tbody td { position: relative; padding-right: 10px; }
.proj-note-btn {
    position: absolute; top: 0; right: 0; width: 9px; padding: 0; border: none;
    background: transparent; color: var(--text-muted); font-size: 9px;
    line-height: 1.4; cursor: pointer; opacity: 0;
}
.proj-table tbody td:hover .proj-note-btn,
.proj-table tbody td:focus-within .proj-note-btn { opacity: 0.5; }
.proj-note-btn:hover { opacity: 1 !important; }
.proj-note-btn.proj-note-has { opacity: 1; color: var(--proj-size-3); }
/* A resource is picked from what the plan already knows; the width is the content's
   so a column of short names stays a short column. */
.proj-res-select { width: auto; max-width: 120px; }
/* On the body rather than inside the tool: a 300px window is not where you write
   three paragraphs, and anything inside it is clipped by it. */
.proj-modal {
    position: fixed; inset: 0; z-index: 26000; display: flex;
    align-items: center; justify-content: center; background: rgba(0,0,0,0.35);
}
.proj-modal-box {
    display: flex; flex-direction: column; gap: 8px; width: min(640px, 92vw);
    max-height: 80vh; padding: 12px; border-radius: 8px;
    background: var(--bg-secondary); color: var(--text-primary);
    border: 1px solid var(--border-color); box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
.proj-modal-head { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; }
.proj-modal-head .proj-x { margin-left: auto; font-size: 16px; }
.proj-modal-text {
    flex: 1 1 auto; min-height: 220px; resize: vertical; padding: 8px;
    border: 1px solid var(--border-color); border-radius: 4px;
    background: var(--input-bg); color: var(--text-primary);
    font-family: inherit; font-size: 12px; line-height: 1.45;
}
.proj-modal-text:focus { outline: none; border-color: var(--proj-size-3); }
.proj-modal-foot { display: flex; align-items: center; gap: 8px; }
/* The switches on the left, the one button on the right, and the text under both.
   They wrap rather than squeezing: there is one per thing a row carries, and a row
   of nine squashed labels is harder to read than two rows of nine. */
.proj-md-bar {
    display: flex; align-items: center; gap: 4px 10px; flex-wrap: wrap; flex: 0 0 auto;
}
.proj-md-label { font-size: 11px; color: var(--text-muted); }
.proj-md-part {
    display: flex; align-items: center; gap: 4px; cursor: pointer;
    font-size: 11px; color: var(--text-secondary); white-space: nowrap;
}
.proj-md-part input { cursor: pointer; }
.proj-md-copy { margin-left: auto; }
/* Monospace, because what is in it is source: the hyphens and hashes are supposed to
   line up, and a proportional font hides a broken bullet. */
.proj-md-text {
    min-height: 320px; white-space: pre; overflow-wrap: normal; overflow-x: auto;
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace; font-size: 11px;
}
/* A link is a label and an address, and an address is long. In the window they each
   get a line and the address gets most of it, which is the thing a table column
   cannot offer and the reason this is a window at all. */
.proj-link-rows { display: flex; flex-direction: column; gap: 6px; overflow: auto; }
.proj-modal-link, .proj-modal-ticket { display: flex; align-items: center; gap: 6px; }
.proj-modal-ticket input, .proj-modal-link input {
    padding: 4px 6px; border: 1px solid var(--border-color); border-radius: 4px;
    background: var(--input-bg); color: var(--text-primary); font-size: 12px; min-width: 0;
}
.proj-modal-ticket input:focus, .proj-modal-link input:focus { outline: none; border-color: var(--proj-size-3); }
.proj-modal-label { flex: 0 1 180px; }
.proj-modal-url { flex: 1 1 auto; }
/* The number leads, because it is the one that is never optional. */
.proj-modal-num { flex: 1 1 auto; }
.proj-modal-type { flex: 0 1 160px; }
.proj-modal-ticket a, .proj-modal-link a { color: var(--proj-size-3); text-decoration: none; flex: 0 0 auto; }
.proj-modal-nolink { color: var(--text-muted); opacity: 0.4; flex: 0 0 auto; cursor: default; }
.proj-link-add { align-self: flex-start; }
/* In the cell, a link is what it is called, and clicking it opens it. */
.proj-link-chip {
    display: inline-block; max-width: 110px; overflow: hidden; text-overflow: ellipsis;
    white-space: nowrap; padding: 0 4px; border-radius: 9px; font-size: 10px;
    border: 1px solid var(--border-color); background: var(--bg-tertiary);
    color: var(--proj-size-3); text-decoration: none;
}
.proj-link-chip:hover { text-decoration: underline; }
.proj-link-chip.proj-link-blank { color: var(--text-muted); font-style: italic; }
.proj-modal-hint { color: var(--text-muted); font-size: 11px; margin-right: auto; }
/* A ticket in the cell is a chip, like everything else a row can have several of.
   It keeps its own max-width rather than sharing the dependency chip's: what is cut
   here is the type at the end, and the number in front of it is the part that has to
   survive. */
.proj-ticket-chip {
    display: inline-block; max-width: 120px; overflow: hidden; text-overflow: ellipsis;
    white-space: nowrap; padding: 0 5px; border-radius: 9px; font-size: 10px;
    border: 1px solid var(--border-color); background: var(--bg-tertiary);
    color: var(--proj-size-3); text-decoration: none;
}
.proj-ticket-chip:hover { text-decoration: underline; }
/* No address behind it yet: still a ticket, just not a link. */
.proj-ticket-chip.proj-ticket-plain { color: var(--text-secondary); }
.proj-ticket-type { color: var(--text-muted); margin-left: 3px; }
/* The toolbar is chrome rather than plan: a board on a wall, or in a PNG export,
   should show the table and the chart and not the buttons that built them. It fades
   in on hover like the framework's own mode bar, and keeps its space while hidden so
   nothing jumps when it arrives. */
.proj-toolbar {
    display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; flex: 0 0 auto;
    opacity: 0; transition: opacity 0.15s;
}
.proj-widget:hover .proj-toolbar,
.proj-widget:focus-within .proj-toolbar { opacity: 1; }
.proj-btn {
    padding: 2px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary);
    color: var(--text-secondary); cursor: pointer; font-size: 11px; border-radius: 3px; white-space: nowrap;
}
.proj-btn:hover { background: var(--table-hover); }

/* The scroller is what keeps a wide table inside the window. Without the explicit
   min/max width a table's min-content width — one long URL in a Links cell is
   enough — pushes the whole tool wider than the width it was given, and the window
   quietly grows past its own cap. */
.proj-table-scroll { flex: 1; min-height: 0; min-width: 0; max-width: 100%; overflow: auto; }
/* Width auto, not 100%: a table told to fill its pane hands the slack out to its
   columns, so every column ends up as wide as the widest one is allowed to be. */
.proj-table { border-collapse: collapse; width: auto; font-size: 11px; }
.proj-table th, .proj-table td {
    border: 1px solid var(--border-light); padding: 2px 4px; vertical-align: top; text-align: left;
}
.proj-table thead th { vertical-align: bottom; }
.proj-table thead th { position: sticky; top: 0; z-index: 1; background: var(--bg-tertiary); }
.proj-table tbody tr:nth-child(even) { background: var(--table-stripe); }
.proj-table tbody tr:hover { background: var(--table-hover); }
.proj-table tbody tr.proj-dragging { opacity: 0.5; }
/* Done, and out of the way. Faded rather than hidden or moved: it is still part of
   the plan and still counts towards a parent's roll-up, it is just not what anybody
   is looking for. It comes back to full strength on hover, so a faded row can still
   be read and edited. */
.proj-table tbody tr.proj-done > td { opacity: 0.5; }
.proj-table tbody tr.proj-done:hover > td,
.proj-table tbody tr.proj-done:focus-within > td { opacity: 1; }
.proj-table tbody tr.proj-drag-over td { border-top: 2px solid var(--proj-size-3); }
/* The delete button is positioned out of the flow. In it, it added its own width
   to every column in the table, which is 11 columns' worth of nothing. */
.proj-col-head { display: flex; align-items: center; gap: 3px; position: relative; padding-right: 19px; }
/* The grip is the draggable part, not the heading: a heading is clicked to rename
   and carries a dropdown, and both are awkward inside a draggable element. */
.proj-col-grip {
    flex: 0 0 auto; margin-left: -2px; color: var(--text-muted); font-size: 9px;
    cursor: grab; opacity: 0; transition: opacity 0.12s;
}
.proj-table thead th:hover .proj-col-grip { opacity: 0.6; }
.proj-col-grip:hover { opacity: 1 !important; }
.proj-col-grip:active { cursor: grabbing; }
.proj-table thead th.proj-dragging { opacity: 0.5; }
.proj-table thead th.proj-drag-over { border-left: 2px solid var(--proj-size-3); }
.proj-col-fold { color: var(--text-muted); font-size: 10px; }
/* A folded column keeps its place in the order and gives up everything else. The
   heading turns on its side, which is what makes a 16px column still readable. */
.proj-table th.proj-col-narrow, .proj-table td.proj-col-narrow {
    width: 16px; max-width: 16px; padding: 2px 0; text-align: center;
    color: var(--text-muted); overflow: hidden;
}
.proj-col-folded {
    writing-mode: vertical-rl; border: none; background: transparent; cursor: pointer;
    color: var(--text-muted); font-size: 10px; font-weight: bold; padding: 0;
    max-height: 70px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.proj-col-folded:hover { color: var(--text-primary); }
/* Both header buttons share one lane out of the flow: in it, they added their own
   width to every column in the table, which is fourteen columns' worth of nothing. */
/* Chrome, like the toolbar: there to be used, gone to be looked at. Fourteen
   headings each wearing two buttons is a header you read the buttons in. */
.proj-col-acts {
    position: absolute; right: -3px; top: 50%; transform: translateY(-50%);
    display: flex; align-items: center; opacity: 0; transition: opacity 0.12s;
}
.proj-table thead th:hover .proj-col-acts,
.proj-table thead th:focus-within .proj-col-acts { opacity: 1; }
.proj-col-acts .proj-x { padding: 0 1px; }
/* A heading is text, and text wraps. It was an input, and an input is one line of
   about twenty characters whatever is in it — so "Remaining Days" held its column
   at 121px for data that needs 17. Click it to rename; it becomes an input only
   while it is being typed in. */
.proj-col-title {
    flex: 0 1 auto; min-width: 0; color: var(--text-heading); font-weight: bold;
    font-size: 11px; padding: 1px 2px; cursor: text; white-space: normal;
    /* break-word, not anywhere: a word is broken only when it cannot fit at all,
       so "Dependencies" stays one word rather than becoming "Dependenci es". The
       ceiling is what makes a two-word heading wrap — without it the table gives
       the heading its one-line width and nothing ever wraps, which was the whole
       problem; wide enough that the longest single word still fits. */
    overflow-wrap: break-word; line-height: 1.25; max-width: 86px;
}
.proj-col-title:hover { background: var(--table-hover); border-radius: 2px; }
.proj-col-title-edit {
    flex: 0 1 auto; width: auto; min-width: 0; border: 1px solid var(--proj-size-3);
    border-radius: 2px; background: var(--input-bg); color: var(--text-heading);
    font-weight: bold; font-size: 11px; padding: 0 2px;
}
.proj-col-title-edit:focus { outline: none; }
.proj-col-type, .proj-cell-input, .proj-cell-select {
    border: 1px solid transparent; background: transparent; color: var(--text-primary);
    font-size: 11px; padding: 1px 2px; width: 100%; min-width: 0; border-radius: 3px;
}
.proj-cell-input[type="date"] { width: auto; }
.proj-col-type { font-size: 10px; color: var(--text-muted); width: auto; }
.proj-cell-input:hover, .proj-cell-select:hover { border-color: var(--border-color); }
.proj-cell-input:focus, .proj-cell-select:focus { outline: none; border-color: var(--proj-size-3); background: var(--input-bg); }
.proj-cell-num { font-variant-numeric: tabular-nums; }
/* A note is prose, and prose has paragraphs. The field grows in both directions
   as it is typed into — cols and rows rather than an input's size — and can
   still be dragged taller by hand when six rows is not enough. */
.proj-cell-notes {
    display: block; resize: vertical; font-family: inherit; line-height: 1.35;
    overflow: auto; width: auto; max-width: 100%;
}
.proj-x {
    border: none; background: none; color: var(--text-muted); cursor: pointer;
    font-size: 12px; line-height: 1; padding: 0 2px;
}
.proj-x:hover { color: var(--proj-critical); }
.proj-handle { cursor: grab; color: var(--text-muted); user-select: none; padding: 0 2px; }
.proj-calc { font-variant-numeric: tabular-nums; white-space: nowrap; }

/* The size control is the chip: one thing to look at and the same thing to change,
   and its text is what keeps the colour from having to carry the meaning. */
.proj-size-select {
    width: auto; min-width: 58px; border: 1px solid transparent; border-radius: 4px;
    padding: 1px 4px; font-size: 11px; font-weight: 600; text-align: center;
    -webkit-appearance: none; appearance: none; cursor: pointer;
}
.proj-size-select.proj-size-unset { background: var(--bg-tertiary); color: var(--text-muted); font-weight: normal; }
.proj-size-select:disabled { opacity: 0.75; cursor: default; }
.proj-cell-input:disabled { color: var(--text-secondary); }

/* Sub-items. One level: an item and the things it is made of. */
.proj-row-tools { display: flex; align-items: center; gap: 1px; white-space: nowrap; }
.proj-indent { display: inline-block; width: 14px; }
.proj-nest { color: var(--text-muted); font-size: 10px; }
.proj-table tbody tr.proj-is-parent > td { font-weight: 600; }
.proj-rollup { color: var(--text-muted); font-size: 10px; margin-left: 3px; }

/* The progress bar. 4px rounded end on the fill, anchored to the track's start. */
.proj-pct-wrap { display: flex; align-items: center; gap: 4px; }
.proj-pct-input { width: 40px; flex: 0 0 auto; font-variant-numeric: tabular-nums; }
.proj-bar-track { flex: 1; min-width: 28px; height: 8px; border-radius: 4px; background: var(--border-light); overflow: hidden; }
/* Blocked out explicitly: a span is inline, and height does nothing to an inline
   box — the fill had its width and its colour and no height at all. */
.proj-bar-fill { display: block; height: 100%; border-radius: 4px; }

.proj-links { display: flex; flex-direction: column; gap: 2px; }
.proj-link-row { display: flex; align-items: center; gap: 2px; }
.proj-link-row input { width: 100%; min-width: 0; }
.proj-link-row a { color: var(--proj-size-3); text-decoration: none; }
.proj-link-row a:hover { text-decoration: underline; }
.proj-chips { display: flex; flex-wrap: wrap; gap: 2px; align-items: center; }
/* The + and the dropdown it opens sit at the right edge of the column rather than
   wherever the chips happen to end, so they line up down the column instead of
   stepping in and out with the length of each row's list. */
/* Its own class rather than the × button's: a + that adds and a × that removes are
   not the same control, and sharing one made each answer to the other's selector. */
.proj-pick-add, .proj-pick { margin-left: auto; width: auto; flex: 0 0 auto; }
.proj-pick-add {
    border: none; background: none; cursor: pointer; font-size: 12px; line-height: 1;
    padding: 0 2px; color: var(--text-secondary);
}
.proj-pick-add:hover { color: var(--text-primary); }
.proj-dep-chip {
    display: inline-flex; align-items: center; gap: 2px; padding: 0 2px 0 5px;
    border: 1px solid var(--border-color); border-radius: 9px; font-size: 10px;
    background: var(--bg-tertiary); white-space: nowrap;
}
/* A chip names a row that is already in the table, and now names it twice over —
   the number and the name both. That is what makes it decidable and also what makes
   it long, so this is the column that gives way: the number is at the front where
   the cut cannot reach it, and the whole of it is in the tooltip. */
.proj-chip-text {
    display: inline-block; max-width: 110px; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap; vertical-align: bottom;
}
.proj-empty { color: var(--text-muted); font-style: italic; padding: 8px 2px; }

/* ---- The chart --------------------------------------------------------------- */
.proj-gantt { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.proj-gantt-head { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; flex: 0 0 auto; }
.proj-gantt-title { color: var(--text-secondary); font-size: 11px; }
.proj-legend { display: flex; align-items: center; gap: 8px; margin-left: auto; font-size: 10px; color: var(--text-muted); flex-wrap: wrap; }
.proj-legend-item { display: flex; align-items: center; gap: 3px; white-space: nowrap; }
.proj-legend-swatch { width: 14px; height: 8px; border-radius: 2px; display: inline-block; }
.proj-gantt-scroll { flex: 1; min-height: 0; overflow: auto; }
/* Room above the axis for the "today" label, which otherwise sits outside the
   scroller and is clipped away. */
.proj-gantt-grid { position: relative; min-width: 240px; padding-top: 14px; }
.proj-axis { display: flex; position: relative; height: 28px; border-bottom: 1px solid var(--border-light); margin-left: 110px; }
.proj-tick { position: absolute; top: 0; font-size: 10px; color: var(--text-muted); transform: translateX(-50%); white-space: nowrap; line-height: 1.3; text-align: center; }
/* A sprint is only useful if you know when it starts, so the name carries the date
   it begins on rather than making the reader count boundaries back to today. */
.proj-tick-date { display: block; font-size: 9px; opacity: 0.85; }
.proj-gantt-row { display: flex; align-items: center; height: 28px; }
/* Two lines: what it is, and when it runs. The dates are the chart's own answer to
   the question the bars are drawn to ask, and reading them off the axis by eye is
   the part a chart should be doing for you. */
.proj-gantt-label {
    flex: 0 0 110px; padding-right: 6px; font-size: 11px; color: var(--text-primary);
    display: flex; flex-direction: column; justify-content: center; min-width: 0;
}
.proj-gantt-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.proj-gantt-when {
    font-size: 9px; color: var(--text-muted); white-space: nowrap;
    font-variant-numeric: tabular-nums;
}
.proj-track { position: relative; flex: 1; height: 100%; }
/* 2px of surface between a bar and the one under it, per the mark spec. */
.proj-bar { position: absolute; top: 8px; height: 12px; border-radius: 4px; min-width: 3px; }
.proj-bar.proj-bar-cycle { outline: 2px dashed var(--proj-critical); outline-offset: 1px; }
/* A parent's bar is the span its children occupy, not work of its own — drawn as a
   bracket around them rather than a solid block that would be counted twice. */
.proj-bar.proj-bar-parent {
    background: transparent !important; border: 2px solid var(--text-muted);
    border-radius: 3px; top: 7px; height: 14px; opacity: 0.8;
}
.proj-gantt-label.proj-sub-label { color: var(--text-secondary); }
.proj-gantt-label.proj-depth-1 { padding-left: 12px; }
.proj-gantt-label.proj-depth-2 { padding-left: 24px; }
.proj-done-dot {
    position: absolute; top: 10px; width: 8px; height: 8px; border-radius: 50%;
    background: var(--proj-good); transform: translateX(-4px);
}
.proj-deadline {
    position: absolute; top: 6px; height: 16px; width: 2px; background: var(--text-muted);
}
.proj-deadline.proj-missed { background: var(--proj-critical); width: 3px; }
.proj-today { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--proj-critical); opacity: 0.55; }
/* A period boundary runs the height of the axis strip; the rows below carry their
   own, so the line reads as continuous without being one element. */
.proj-period { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--border-color); }
.proj-today-label { position: absolute; top: -14px; font-size: 10px; color: var(--proj-critical); transform: translateX(-50%); }
.proj-dep-line { position: absolute; height: 1px; background: var(--text-muted); opacity: 0.6; }
.proj-warn { color: var(--proj-critical); font-size: 10px; margin-top: 4px; flex: 0 0 auto; }
`;
    document.head.appendChild(style);
})();

PluginRegistry.registerToolbox({
    id: 'project',
    name: 'Project Tools',
    description: 'Planning a piece of work and seeing when it lands',
    icon: '📅',
    color: '#2a78d6',
    tools: ['project-table']
});

PluginRegistry.registerTool({
    id: 'project-table',
    name: 'Project Table',
    description: 'A planning table sized in T-shirt sizes, with the Gantt chart it implies',
    icon: '📅',
    version: '1.0.0',
    toolbox: 'project',
    tags: ['project', 'gantt', 'planning', 'schedule', 'table', 'estimate', 'roadmap'],
    title: 'Project Table',
    content: '<div class="proj-widget">' +
        '<div class="authoring-split">' +
            '<div class="authoring-source proj-table-pane">' +
                '<div class="proj-sizes"></div>' +
                '<div class="proj-units"></div>' +
                '<div class="proj-tickets"></div>' +
                '<div class="proj-toolbar">' +
                    '<button class="proj-btn proj-settings-toggle" ' +
                        'onclick="projToggleSettings(this)"></button>' +
                    '<button class="proj-btn" onclick="projAddRow(this)">+ Row</button>' +
                    '<button class="proj-btn" onclick="projAddColumn(this)">+ Column</button>' +
                    '<button class="proj-btn proj-csv-out" onclick="projExportCsv(this)" ' +
                        'title="Download the table as CSV, which Excel, Numbers and Sheets all open">' +
                        'Export CSV</button>' +
                    '<button class="proj-btn proj-csv-in" onclick="projPickCsv(this)" ' +
                        'title="Replace the rows from a CSV file">Import CSV</button>' +
                    '<button class="proj-btn proj-md-out" onclick="projOpenMarkdown(this)" ' +
                        'title="The plan written out as Markdown, notes and all, ' +
                            'to paste into a document or a ticket">Markdown</button>' +
                    '<input type="file" class="proj-csv-file" accept=".csv,text/csv" ' +
                        'style="display:none" onchange="projImportCsvFile(this)">' +
                '</div>' +
                '<div class="proj-table-scroll"><table class="proj-table"></table></div>' +
            '</div>' +
            '<div class="authoring-resizer"></div>' +
            '<div class="authoring-result proj-gantt-pane"></div>' +
        '</div>' +
    '</div>',
    // Table / Both / Chart, out of the modes the framework already provides. The
    // chart is this tool's result in exactly the sense the note's rendered markdown
    // is: the same data, drawn. Chart-only is also frameless, which makes a board
    // left on a wall display do the right thing for free.
    authoring: {
        modes: ['edit', 'split', 'render'],
        // The three are ways of looking at one plan, not a draft and a finished
        // thing, so looking away does not put this back to the chart: the view
        // somebody picked is the view they meant.
        settle: false,
        // Both, not Table: the chart is half of what this tool is for, and a plan
        // that opens without it reads as a spreadsheet with extra columns.
        defaultMode: 'split',
        editMode: 'edit',
        labels: { edit: 'Table', split: 'Both', render: 'Chart' },
        titles: {
            edit: 'The table only',
            split: 'The table and the chart it implies',
            render: 'The chart only'
        },
        source: '.authoring-source',
        result: '.authoring-result',
        onRender: 'projOnRender'
    },
    onInit: 'projInit',
    defaultWidth: 900,
    defaultHeight: 480,
    source: 'external'
});

// ============================================================
// Constants
// ============================================================

// The five sizes that carry the colour ramp, smallest to largest. Separate from the
// list below because O and ? are not points on a scale: one is no work and the other
// is work nobody has looked at yet, and painting either of them green-to-red would
// say something about size that neither of them knows.
const PROJ_SIZE_RAMP = ['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
// What the dropdown offers, in order. O first — it is less than the smallest — and ?
// last, because unknown is not a size and belongs at the end rather than in the
// middle of the scale.
const PROJ_SIZE_ORDER = ['O', ...PROJ_SIZE_RAMP, '?'];
// Each size is a rung of the default ladder, so a size and a span are the same
// sentence: S is a week, M a sprint, L a timebox, XL a quarter, and XS the couple
// of days that sit under a week. Move the ladder and the sizes stay where they
// are — they are an estimate, not a derivation — but starting them lined up means
// "that's an M" and "that's a sprint" agree until somebody says otherwise.
const PROJ_DEFAULT_SIZES = {
    O: 0, XXXS: 0.5, XXS: 1, XS: 3, S: 5, M: 10, L: 30, XL: 60, XXL: 120, XXXL: 240, '?': 0
};

/** Slack bands, worst first. `mark` is what keeps the colour from carrying the
 *  meaning on its own — a status colour always ships with a label beside it. */
const PROJ_SLACK_BANDS = [
    { below: 0, role: 'critical', mark: '●', label: 'Late', title: 'Past the deadline on current pace' },
    { below: 2, role: 'serious', mark: '▲', label: 'No room', title: 'Lands on the deadline, with nothing spare' },
    { below: 5, role: 'warning', mark: '▲', label: 'Tight', title: 'Only a few days spare' },
    // Not Infinity: this list is serialized into exported boards, and JSON has no
    // way to say it — it would come back as null and stop matching anything.
    { below: Number.MAX_SAFE_INTEGER, role: 'good', mark: '✓', label: 'Comfortable', title: 'Comfortable' }
];

const PROJ_COLUMN_TYPES = ['text', 'notes', 'number', 'date', 'ticket'];

/** How tall a note is allowed to get on its own. Past this it scrolls, and the
 *  corner can still be dragged — six rows is a lot of table to give one cell. */
const PROJ_NOTE_ROWS = 6;

/** The columns a new table starts with. `calc` columns are computed and not typed
 *  into; everything else is an input. Any of them can be deleted — a calculation
 *  whose input column is gone reads as blank rather than throwing. */
// Left to right: what it is, what it waits for, how big it is, how far along, when
// it runs, what that comes to, when it is due and how that compares — which is the
// order the questions are asked in. The id is what everything else refers to, so
// `item` keeps its name while the heading says Task.
const PROJ_BUILTIN_COLUMNS = [
    { id: 'number', title: 'ID', type: 'calcNumber' },
    { id: 'ticket', title: 'Ticket', type: 'ticket' },
    // In front of the task and folded like Title, because they are part of what
    // names a row rather than facts about it: a plan that needs them needs them on
    // every row, and one that does not should not pay two columns for them.
    { id: 'team', title: 'Team', type: 'text', collapsed: true },
    { id: 'system', title: 'System', type: 'text', collapsed: true },
    { id: 'item', title: 'Task', type: 'item' },
    // Folded to begin with: it is made of three things already on the row, so it is
    // worth room only when somebody is about to take it away with them.
    { id: 'title', title: 'Title', type: 'title', collapsed: true },
    { id: 'deps', title: 'Dependencies', type: 'deps' },
    { id: 'size', title: 'Size', type: 'size' },
    { id: 'pct', title: '% Done', type: 'percent' },
    // Worked out until somebody types one in. Both, because a plan has as much to
    // say about when a thing may start as about when it has to be finished.
    { id: 'start', title: 'Start', type: 'start' },
    { id: 'end', title: 'End', type: 'end' },
    // A heading is two or three words at most and the tooltip says the rest. Total
    // and Left rather than Total Days and Remaining Days, which were long enough to
    // hold their columns open and close enough to each other to be read twice.
    { id: 'total', title: 'Total', type: 'calcTotal' },
    { id: 'remaining', title: 'Left', type: 'calcRemaining' },
    { id: 'deadline', title: 'Deadline', type: 'date' },
    { id: 'slack', title: 'Slack', type: 'calcSlack' },
    { id: 'resources', title: 'Assigned', type: 'resources' },
    { id: 'notes', title: 'Notes', type: 'notes' },
    { id: 'links', title: 'Links', type: 'links' }
];

/** What a column means, by type, for the heading's tooltip. Two words of heading
 *  cannot say that one number is work and the other is calendar room, and the two
 *  of them sitting side by side is exactly where that gets confused. */
const PROJ_COLUMN_HINTS = {
    size: 'T-shirt size. Days come from the scale above the table',
    percent: 'How much of this item is done',
    calcTotal: 'Days of work the size implies, start to finish \u2014 shared out ' +
        'between the people assigned, so a second name halves it',
    calcRemaining: 'Days of work still to do',
    calcSlack: 'Calendar days between the deadline and the day this would finish ' +
        'if it started now: positive is room to spare, negative is late. ' +
        'Finished rows have none \u2014 there is no room left to need',
    calcNumber: 'Where this row sits: 2 is the second item, 2.1 its first task, ' +
        '2.1.1 that task\u2019s first sub-task. It follows the table, so moving a row ' +
        'renumbers it',
    title: 'Everything that places this row, outermost first \u2014 team, system, ' +
        'project, task, sub-task \u2014 in one line, ready to paste somewhere else',
    ticket: 'The tickets this row is tracked in, each with a type if it needs one. ' +
        'They become links when a ticket URL is set above',
    item: 'What has to be done',
    team: 'Whose work this is. It goes in the Title, and a row that leaves it ' +
        'blank takes the one above it',
    system: 'What it touches \u2014 the service, the component, the area of the ' +
        'product. It goes in the Title, and a row that leaves it blank takes the ' +
        'one above it',
    resources: 'Who is on it. Pick somebody already in the plan, or add a new one',
    start: 'When work starts: after whatever it depends on, unless a date is typed in',
    end: 'When work finishes: start plus the days left, unless a date is typed in',
    notes: 'A line or two. Enter starts a new line',
    deps: 'What has to finish first. Used by the chart, not by the dates',
    links: 'Any number of links, each with a label'
};

/** What the two sizes that are not sizes mean, said once, in their tooltips. */
const PROJ_SIZE_MEANINGS = {
    O: 'O: nothing to do. Zero days, and no bar on the chart',
    '?': '?: not estimated yet. Zero days until somebody sizes it'
};

// A note belongs to a cell — this row, that column — and is kept in a map of its own
// rather than in `cells`, so a note can never collide with the value it is about and
// a column that is deleted does not take the writing about it with it.
//
// In a CSV each column that has any notes gets one of its own, headed "<Column>
// notes", because a spreadsheet has no window to open and dropping the text on the
// way out would lose it.
const PROJ_CSV_NOTE_SUFFIX = ' notes';

// The schedule, cached between saves. See projScheduleOf.
let projSchedStamp = 0;
let projSchedCache = null;

// The open window's Escape handler, while there is one. Module-level because there
// is one window at a time, by construction.
let projModalKeyHandler = null;

// Not a resource anybody would type, and not a control character either — one of
// those in an attribute is a value some browsers and some tools quietly drop.
const PROJ_RES_NEW = '__proj_new_resource__';

// What the planning week is called on the chart. One letter, because it sits where a
// sprint number would and has to fit the same gap.
const PROJ_PLANNING_MARK = 'P';

const PROJ_DAY = 86400000;

/**
 * The ladder: a week of working days, and each rung built from the one below it.
 *
 * Every number here is editable — these are only where a new table starts. The
 * ladder's quarter is 12 weeks rather than the calendar's 13, which is what "two
 * timeboxes" comes to; raise timeboxesPerQuarter or weeksPerSprint if you want the
 * rungs to meet the calendar exactly.
 */
const PROJ_DEFAULT_UNITS = {
    daysPerWeek: 7,
    weeksPerSprint: 2,
    sprintsPerTimebox: 3,
    timeboxesPerQuarter: 2,
    // The week that makes a quarter thirteen weeks rather than twelve. Two timeboxes
    // of six sprints come to 84 days; the calendar's quarter is 91. That last week is
    // not a sprint and is not pretended to be one — it is the planning week, it sits
    // at the end of every quarter, and on the chart it is called P.
    planningWeeks: 1,
    // A week of five days is either a fact about the calendar or a decoration. On,
    // it is a fact: ten days of work spans two calendar weeks and nothing lands on
    // a Saturday. Off, days are days and the chart counts them straight through.
    // Off by default now that a week is seven days: there is no weekend to skip, and
    // a switch that cannot do anything should not be shown as doing it.
    skipWeekends: false,
    yearMode: 'calendar',      // or 'fiscal'
    fiscalStartMonth: 1,       // 1-12; only read when yearMode is fiscal
    // The day Q1 T1 S1 begins. Empty means the year's own start — 1 January, or the
    // first of the fiscal month — and a date here overrides both: a plan's first
    // sprint rarely begins on the first of a month, and everything above it is
    // counted from wherever it does.
    periodStart: '',
    axis: 'dates'              // dates | sprints | timeboxes | quarters
};

/** The editable rungs, in order, as the strip draws them. `step` is what a rung is
 *  allowed to move by — halves where a ladder has to meet a calendar that is not
 *  made of whole sprints. */
const PROJ_UNIT_FIELDS = [
    { key: 'daysPerWeek', label: 'Week', unit: 'days', step: 1 },
    { key: 'weeksPerSprint', label: 'Sprint', unit: 'weeks', step: 0.5 },
    { key: 'sprintsPerTimebox', label: 'Timebox', unit: 'sprints', step: 0.5 },
    { key: 'timeboxesPerQuarter', label: 'Quarter', unit: 'timeboxes', step: 0.5 },
    { key: 'planningWeeks', label: 'Planning', unit: 'weeks', step: 1, min: 0 }
];

const PROJ_AXIS_MODES = [
    { id: 'dates', label: 'Dates' },
    { id: 'sprints', label: 'Sprints' },
    { id: 'timeboxes', label: 'Timeboxes' },
    { id: 'quarters', label: 'Quarters' }
];

/** What the window may grow to on its own. Past this a wide table scrolls, because
 *  a tool that takes the whole board without being asked is worse than one that
 *  scrolls. */
const PROJ_MAX_WIDTH = 1200;
const PROJ_MIN_WIDTH = 360;
const PROJ_WIDTH_CHROME = 26; // borders, the pane's padding, and room for a scrollbar

// ============================================================
// State
// ============================================================

function projToolId(element) {
    const tool = element.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function projWidget(element) {
    return element.closest('.proj-widget');
}

/** How many characters wide an input should ask to be. An input ignores its value
 *  when it reports a preferred width — it asks for about twenty characters whatever
 *  is in it — so the column is as wide as the widest input is allowed to be rather
 *  than as wide as anything in it. `size` is what actually moves that number. */
function projFieldSize(text, min, max) {
    const n = String(text == null ? '' : text).length;
    return Math.max(min, Math.min(max, n + 1));
}

/** The longest line in a note — what decides how wide the field has to be, since
 *  a note is several lines and only the widest of them needs the room. */
function projLongestLine(text) {
    return String(text == null ? '' : text).split('\n')
        .reduce((n, line) => Math.max(n, line.length), 0);
}

/**
 * How wide the Task column is allowed to grow.
 *
 * Wider than the other text columns on purpose: this is the name of the thing, and
 * a row reading "Environm" is a row nobody can read. Not unbounded, because one
 * pathological name should not own the whole table — but far enough out that a name
 * somebody actually types fits whole.
 */
const PROJ_ITEM_MAX = 60;

/** How wide a note's field should be: its longest line, kept inside the same
 *  bounds the field carries for typing. */
function projNoteCols(text, min, max) {
    return Math.max(min, Math.min(max, projLongestLine(text) + 1));
}

/** How many rows a note needs: the lines typed into it, plus the ones wrapping
 *  adds, capped so one cell cannot take over the table. */
function projNoteRows(text, cols) {
    const width = Math.max(1, Number(cols) || 1);
    const used = String(text == null ? '' : text).split('\n')
        .reduce((n, line) => n + Math.max(1, Math.ceil(line.length / width)), 0);
    return Math.max(1, Math.min(PROJ_NOTE_ROWS, used));
}

/** How far a field is allowed to grow, written onto it so typing can keep up. */
function projGrowAttrs(min, max) {
    return ' data-min="' + min + '" data-max="' + max + '"';
}

/**
 * Widen a field to fit what has just been typed into it, up to its own ceiling.
 *
 * The `size` is set when the table is drawn, and a cell being typed into is
 * deliberately not redrawn — which left a note growing invisibly inside a field
 * the width it was when the row was last rendered. Nudging `size` as the text
 * changes is the one bit of the cell that can move without taking the caret.
 */
function projGrowField(input) {
    // Read as attributes first, not as numbers: a field with no bounds — a date, a
    // percentage — gives null, and Number(null) is 0, which asks for a size of zero
    // and throws. The throw took the save with it.
    const minAttr = input.getAttribute('data-min');
    const maxAttr = input.getAttribute('data-max');
    if (minAttr === null || maxAttr === null) return;
    const min = Math.max(1, Number(minAttr) || 1);
    const max = Math.max(min, Number(maxAttr) || min);
    // A textarea has no `size`: setting it there writes a property nothing reads
    // and the note stays the width it was drawn at. `cols` and `rows` are the two
    // numbers that move, and both of them have to, or a second line is invisible.
    if (input.tagName === 'TEXTAREA') {
        const cols = projNoteCols(input.value, min, max);
        if (Number(input.cols) !== cols) input.cols = cols;
        const rows = projNoteRows(input.value, cols);
        if (Number(input.rows) !== rows) input.rows = rows;
        return;
    }
    const next = projFieldSize(input.value, min, max);
    if (Number(input.size) !== next) input.size = next;
    // A field that holds its own floor moves it too, or the floor is only right
    // until somebody types.
    if (input.style.minWidth) input.style.minWidth = next + 'ch';
}

function projNewId(prefix) {
    return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 4);
}

/**
 * Today. Every date in this tool is a whole day — an estimate in days has no
 * business pretending it knows the hour — and every one of them is UTC midnight,
 * with a day of arithmetic a fixed 86,400,000ms.
 *
 * Not *local* midnight, which is what this used to be, for two reasons that both
 * surface as a date a day out. Local midnight east of Greenwich is the previous day
 * in UTC, which is how `toISOString()` prints it. And a fixed day added across a
 * daylight-saving change lands an hour off local midnight, so the weekday a date
 * reports and the date it prints stop agreeing — which, with weekends off, is a plan
 * that quietly schedules work on a Saturday. UTC has no such hour, so parsing,
 * printing, the weekday and the arithmetic all say the same thing on every day of
 * the year. The local clock is read here and nowhere else, and only to ask which
 * calendar day it is for the person reading the plan.
 */
function projToday() {
    const d = new Date();
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

function projParseDate(text) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text == null ? '' : text).trim());
    if (!m) return null;
    const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return isNaN(t) ? null : t;
}

function projFormatDate(ms) {
    const d = new Date(ms);
    return d.toISOString().slice(0, 10);
}

/** A table that already works, so the chart has something to draw and the
 *  dependency rule is visible before anything has been typed. */
function projSeedData() {
    const today = projToday();
    const at = (days) => projFormatDate(today + days * PROJ_DAY);
    const rows = [
        { id: 'r-discovery', cells: { item: 'Discovery', size: 'M', pct: 60, deadline: at(10), resources: ['John'], notes: '', links: [], deps: [] } },
        { id: 'r-build', cells: { item: 'Build', size: 'L', pct: 0, deadline: at(45), resources: ['Jane'], notes: '', links: [], deps: ['r-discovery'] } },
        { id: 'r-launch', cells: { item: 'Launch', size: 'S', pct: 0, deadline: at(55), resources: '', notes: '', links: [], deps: ['r-build'] } }
    ];
    return {
        sizes: { ...PROJ_DEFAULT_SIZES },
        units: { ...PROJ_DEFAULT_UNITS },
        ticketBase: '',
        // Folded to begin with: the scale and the ladder are set once and read
        // rarely, and what somebody opens a plan for is the plan.
        hideSettings: true,
        columns: PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true })),
        rows: rows
    };
}

function projGetData(toolId) {
    const custom = toolCustomizations[toolId] || {};
    let data = custom.projectData;
    if (!data || !Array.isArray(data.columns) || !Array.isArray(data.rows)) {
        data = projSeedData();
        projSetData(toolId, data);
        return data;
    }
    // Sizes are merged rather than taken as found: a table stored before a size
    // existed still has to come back with a number for it.
    data.sizes = { ...PROJ_DEFAULT_SIZES, ...(data.sizes || {}) };
    if (typeof data.ticketBase !== 'string') data.ticketBase = '';
    if (typeof data.hideSettings !== 'boolean') data.hideSettings = true;
    let changed = projAddLateColumns(data);
    // The task's description became the note on its Task cell, which is what every
    // other cell has now. Moved rather than left behind: it is the same writing.
    data.rows.forEach(row => {
        const old = row.cells && row.cells.desc;
        if (!old) return;
        if (!row.notes || typeof row.notes !== 'object') row.notes = {};
        if (!row.notes.item) row.notes.item = old;
        delete row.cells.desc;
        changed = true;
    });
    if (changed) projSetData(toolId, data);
    return data;
}

/**
 * Columns that arrived after people already had tables, and where each one goes.
 *
 * A table stored before one of these existed gets it, once. `addedColumns` is what
 * makes it once: without it, a column somebody deleted on purpose would come back on
 * the next load, which is a tool arguing with its user.
 */
const PROJ_LATE_COLUMNS = [
    { id: 'number', before: 'ticket' },
    { id: 'title', before: 'deps' },
    { id: 'ticket', before: 'item' },
    { id: 'start', before: 'deadline' },
    { id: 'end', before: 'deadline' },
    { id: 'team', before: 'item' },
    { id: 'system', before: 'item' }
];

function projAddLateColumns(data) {
    if (!data.addedColumns || typeof data.addedColumns !== 'object') data.addedColumns = {};
    let changed = false;
    PROJ_LATE_COLUMNS.forEach(late => {
        if (data.addedColumns[late.id]) return;
        data.addedColumns[late.id] = true;
        changed = true;
        if (data.columns.some(c => c.id === late.id)) return;
        const defaults = PROJ_BUILTIN_COLUMNS.find(c => c.id === late.id);
        if (!defaults) return;
        const at = data.columns.findIndex(c => c.id === late.before);
        data.columns.splice(at < 0 ? data.columns.length : at, 0, { ...defaults, builtin: true });
    });
    return changed;
}

function projSetData(toolId, data) {
    projSchedStamp++;
    if (!toolCustomizations[toolId]) toolCustomizations[toolId] = {};
    toolCustomizations[toolId].projectData = data;
    saveToolCustomizations(toolCustomizations);
}

function projColumn(data, id) {
    return data.columns.find(c => c.id === id) || null;
}

/**
 * The address a ticket number resolves to, or '' when it does not resolve to one.
 *
 * `{ticket}` anywhere in the base is replaced by the number, which is what a tracker
 * with the id in the middle of the path needs. A base without it has the number
 * appended, with exactly one slash between them however the base was typed — the
 * trailing slash is the thing nobody remembers, and it is not worth a broken link.
 *
 * `{type}` is replaced by the ticket's type, so a plan whose rows live in two
 * trackers can still have one base: the type is what says which. A base that asks
 * for a type and a ticket that has none make no link, rather than an address with a
 * hole in it.
 *
 * http(s) only, and both parts are encoded: a base is typed in by the person using
 * the board, but a row can arrive from a CSV somebody else wrote, and `javascript:`
 * reaching an href is how that becomes their script running here.
 */
function projTicketUrl(data, number, type) {
    const base = String((data || {}).ticketBase || '').trim();
    const id = String(number == null ? '' : number).trim();
    const kind = String(type == null ? '' : type).trim();
    if (!base || !id) return '';
    if (!/^https?:\/\//i.test(base)) return '';
    const safe = encodeURIComponent(id);
    let url = base;
    if (url.indexOf('{type}') >= 0) {
        if (!kind) return '';
        url = url.split('{type}').join(encodeURIComponent(kind));
    }
    if (url.indexOf('{ticket}') >= 0) return url.split('{ticket}').join(safe);
    return url.replace(/\/+$/, '') + '/' + safe;
}

/**
 * The tickets on one row, as a list of `{ id, type }`.
 *
 * Stored as one number before a row could point at several, so a string is read as a
 * list of one rather than being thrown away — the same rule the resources column
 * follows, and the reason nothing has to be migrated on load. A type is optional and
 * comes back as '' when there is none, so callers never have to check.
 */
function projTicketsOf(row, colId) {
    const v = (row.cells || {})[colId];
    const list = Array.isArray(v) ? v : [String(v == null ? '' : v)];
    return list.map(t => (t && typeof t === 'object')
            ? { id: String(t.id == null ? '' : t.id).trim(), type: String(t.type == null ? '' : t.type).trim() }
            : { id: String(t == null ? '' : t).trim(), type: '' })
        .filter(t => t.id || t.type);
}

/** Every ticket type the plan already uses, once each and sorted. What the window
 *  offers rather than what it allows: a type is whatever somebody types. */
function projTicketTypes(data, colId) {
    const seen = {};
    data.rows.forEach(row => {
        projTicketsOf(row, colId).forEach(t => { if (t.type) seen[t.type] = true; });
    });
    return Object.keys(seen).sort((a, b) => a.localeCompare(b));
}

/** The tickets on a row, as the stored list, made into one if it was a bare string.
 *  The window writes through this, which is what turns an old cell into a new one. */
function projTicketListOf(data, rowId, colId) {
    const row = data.rows.find(r => r.id === rowId);
    if (!row) return null;
    row.cells = row.cells || {};
    if (!Array.isArray(row.cells[colId])) row.cells[colId] = projTicketsOf(row, colId);
    return row.cells[colId];
}

/** The resources on one row, as a list. Stored as one before it could be several, so
 *  a string is read as a list of one rather than being thrown away. */
function projResourcesOf(row, colId) {
    const v = (row.cells || {})[colId];
    if (Array.isArray(v)) return v.filter(Boolean).map(String);
    const one = String(v == null ? '' : v).trim();
    return one ? [one] : [];
}

/** Every resource the plan already names, in one sorted list and each one once. A
 *  name that is only in one row is still a resource; a name spelled two ways is two. */
function projResourceList(data, colId) {
    const seen = {};
    data.rows.forEach(row => {
        projResourcesOf(row, colId).forEach(name => {
            const v = name.trim();
            if (v) seen[v] = true;
        });
    });
    return Object.keys(seen).sort((a, b) => a.localeCompare(b));
}

/** Put a resource on a row, or take it off. One list, no duplicates, order kept. */
function projSetResources(row, colId, list) {
    row.cells = row.cells || {};
    row.cells[colId] = list;
}

/**
 * An address fit to put in an `href`, or ''.
 *
 * http and https only. A link can arrive from a CSV somebody else wrote, and
 * `javascript:` reaching an href is how that becomes their script running on this
 * board — the same reason the ticket address is checked.
 */
function projSafeUrl(url) {
    const text = String(url == null ? '' : url).trim();
    return /^https?:\/\//i.test(text) ? text : '';
}

/** What to call a link that was never given a label: where it goes. */
function projLinkHost(url) {
    const safe = projSafeUrl(url);
    if (!safe) return '';
    try {
        return new URL(safe).hostname.replace(/^www\./, '');
    } catch (e) {
        return '';
    }
}

/** A cell's value, or a sensible empty. Reading through this rather than the object
 *  is what lets a column be deleted without every calculation having to care. */
function projCell(row, colId) {
    const v = (row.cells || {})[colId];
    return v === undefined ? '' : v;
}

// ============================================================
// The calculated columns
// ============================================================

/**
 * Sub-items, one level deep: an item, and the things it is made of.
 *
 * One level rather than a tree. "Sub-items" is a list of parts, and a tree brings
 * arbitrary-depth roll-ups and a loop to guard against for a kind of plan this
 * table is not trying to be. A row with a parent cannot itself take children.
 */
/** Three levels: a project, the tasks in it, and the sub-tasks in those. Deeper than
 *  that is an outline rather than a plan, and every reader has to hold the nesting in
 *  their head to read a row. */
const PROJ_MAX_DEPTH = 2;

function projChildren(data, rowId) {
    return data.rows.filter(r => r.parent === rowId);
}

/** The deepest row under this one, counted from it. */
function projSubtreeDepth(data, rowId) {
    const kids = projChildren(data, rowId);
    if (!kids.length) return 0;
    return 1 + Math.max(...kids.map(k => projSubtreeDepth(data, k.id)));
}

function projIsParent(data, row) {
    return data.rows.some(r => r.parent === row.id);
}

/** Rows in reading order: each top-level row followed by its own children. The
 *  stored array keeps sibling order; this is what turns it into the table. */
/** How deep a row sits: 0 for a project, 1 for a task, 2 for a sub-task. A chain
 *  that points at itself stops at the ceiling rather than hanging the browser. */
function projRowDepth(data, row) {
    let depth = 0, at = row;
    while (at && at.parent && depth < PROJ_MAX_DEPTH) {
        at = data.rows.find(r => r.id === at.parent);
        if (at) depth++;
    }
    return depth;
}

/** Every row from the outermost down to this one, this one last. */
function projAncestry(data, row) {
    const chain = [row];
    let at = row;
    while (at && at.parent && chain.length <= PROJ_MAX_DEPTH) {
        at = data.rows.find(r => r.id === at.parent);
        if (at) chain.unshift(at);
    }
    return chain;
}

function projOrderedRows(data) {
    const out = [];
    const walk = (parentId) => {
        projChildren(data, parentId).forEach(row => {
            if (out.indexOf(row) >= 0) return; // a loop in the parents, not a tree
            out.push(row);
            walk(row.id);
        });
    };
    data.rows.filter(r => !r.parent).forEach(row => {
        out.push(row);
        walk(row.id);
    });
    // Anything whose parent has gone is still somebody's row, so it is shown
    // rather than quietly dropped.
    data.rows.forEach(r => { if (out.indexOf(r) < 0) out.push(r); });
    return out;
}

/**
 * Where a row sits, as an outline number: 2 is the second item, 2.1 its first
 * sub-item.
 *
 * Read off the table rather than stored, so it is always what somebody counting
 * down the rows would say — and so moving a row renumbers it and everything under
 * it. Dependencies go on storing the row's own id, which never changes; the number
 * is what they are *shown* as, which is the point of having one.
 */
function projRowNumber(data, row) {
    if (row.parent) {
        const parent = data.rows.find(r => r.id === row.parent);
        if (parent) {
            const at = projChildren(data, parent.id).findIndex(r => r.id === row.id);
            return projRowNumber(data, parent) + '.' + (at + 1);
        }
    }
    const tops = data.rows.filter(r => !r.parent);
    const at = tops.findIndex(r => r.id === row.id);
    return String(at < 0 ? data.rows.findIndex(r => r.id === row.id) + 1 : at + 1);
}

/**
 * What a row is called when it is read away from the table: team, system, project,
 * task, sub-task — everything that places it, outermost first.
 *
 * Made of what is already on those rows rather than typed again, so renaming a
 * project or the task a sub-task sits under moves every title that mentions them.
 * Parts that are empty are left out along with their separator: a row under a
 * project nobody has named yet reads "Build - Review", not " - Build - Review".
 */
function projRowTitle(data, row) {
    return [projRowOwner(data, row, 'team'), projRowOwner(data, row, 'system')]
        .concat(projAncestry(data, row).map(r => String(projCell(r, 'item') || '').trim()))
        .filter(Boolean)
        .join(' - ');
}

/**
 * This row's team, or system, falling back to the nearest row above it that has one.
 *
 * Nobody fills these in on every line. They are set on the project and left blank on
 * the work underneath, which is the same thing as saying "the same as the project" —
 * and a sub-task whose title had dropped the team would be a title that cannot be
 * pasted anywhere, which is the one job the title has. A row that says something
 * different from its project is taken at its word.
 */
function projRowOwner(data, row, colId) {
    const chain = projAncestry(data, row);
    for (let i = chain.length - 1; i >= 0; i--) {
        const value = String(projCell(chain[i], colId) || '').trim();
        if (value) return value;
    }
    return '';
}

// A parent's numbers are its children's, added up. It has no size of its own and no
// completion of its own — the inputs are shown disabled rather than hidden, so it
// is clear they are derived rather than missing.

/**
 * How many people are on a row.
 *
 * Never fewer than one: an unassigned item still takes as long as it takes, and
 * dividing by nobody would make every unstaffed task infinite. Read off the
 * Assigned column by type rather than by id, so renaming or moving it changes
 * nothing — and a plan with that column deleted has one assignee everywhere,
 * which is what it meant before anyone was named.
 */
function projAssigneeCount(data, row) {
    const col = data.columns.find(c => c.type === 'resources');
    if (!col) return 1;
    return Math.max(1, projResourcesOf(row, col.id).length);
}

/**
 * The days this row takes, start to finish.
 *
 * A size is how much work there is; how long that takes depends on how many people
 * are doing it, so the work is divided among them. Two on a thirty-day item is
 * fifteen days, and everything downstream — what is left, the slack, the dates, the
 * length of the bar — follows from this one number rather than each working it out
 * again.
 *
 * A parent is still the sum of its children, and its own Assigned list does not
 * divide anything: the people are on the work, and the work is underneath.
 */
function projTotalDays(data, row) {
    const kids = projChildren(data, row.id);
    if (kids.length) return kids.reduce((sum, k) => sum + projTotalDays(data, k), 0);
    const days = data.sizes[projCell(row, 'size')];
    const work = typeof days === 'number' && isFinite(days) ? days : 0;
    return work / projAssigneeCount(data, row);
}

/** Days as a number somebody can read. Three people on a ten-day item is 3.3, not
 *  3.3333333333333335, and the tenth is kept because halves are the common case. */
function projRoundDays(n) {
    return Math.round(n * 10) / 10;
}

function projRemainingDays(data, row) {
    const kids = projChildren(data, row.id);
    if (kids.length) return kids.reduce((sum, k) => sum + projRemainingDays(data, k), 0);
    const n = Number(projCell(row, 'pct'));
    const pct = isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
    return projTotalDays(data, row) * (1 - pct / 100);
}

/**
 * How complete a row is.
 *
 * A parent's is weighted by days rather than averaged across its children: two days
 * finished and forty not started is 5% done, not 50%, and an unweighted average is
 * the most common way a roll-up lies about where a project stands.
 */
function projPercent(data, row) {
    if (projIsParent(data, row)) {
        const total = projTotalDays(data, row);
        if (!total) return 0;
        return Math.round((1 - projRemainingDays(data, row) / total) * 100);
    }
    const n = Number(projCell(row, 'pct'));
    if (!isFinite(n)) return 0;
    return Math.min(100, Math.max(0, n));
}

/** Finished: everything this row covers is done. A parent is done when its
 *  sub-items are, which its weighted per cent already says. */
function projIsDone(data, row) {
    return projPercent(data, row) >= 100;
}

/**
 * Days between the deadline and the day the work would finish if it started today.
 *
 * Deliberately measured from today rather than from where the chart puts the bar:
 * dependencies guide the chart and nothing else, so this column answers "is there
 * room for this item on its own", and the chart answers "and does the order allow
 * it". Where the two disagree, the chart's deadline marker is what shows it.
 *
 * A finished row has none at all, rather than a growing positive number. Slack is
 * room still to be used, and once the work is done there is nothing left to use it:
 * a task finished last month would otherwise go on reporting a healthier and
 * healthier green every day, which reads as news about work that is over. The chart
 * agrees by construction — a done row draws its dot and never asks for a colour.
 */
function projSlackDays(data, row) {
    const deadline = projParseDate(projCell(row, 'deadline'));
    if (deadline === null) return null;
    if (projIsDone(data, row)) return null;
    const units = projUnits(data);

    // A parent has no work of its own. Its days are its children's, and those run in
    // whatever order and whatever parallel the plan puts them in — which is exactly
    // what its own End already says. Adding its children's days up and laying them
    // end to end from today assumes one person doing all of it in sequence, and a
    // project of two streams that each fit comfortably then reads as badly late: the
    // table showed an End of 11-11 against a deadline of 11-30 and called it eleven
    // days over.
    if (projIsParent(data, row)) {
        const end = projParseDate(projRowDates(data, row).end);
        return end === null ? null : Math.round((deadline - end) / PROJ_DAY);
    }

    const left = projRemainingDays(data, row);
    // The day the work is still being done on, which is the date the End column
    // shows — not the day after it. `projFinishOffset` answers "how long is this
    // stretch", and a stretch's length is one more than its last day; measuring the
    // deadline against that made a row finishing exactly on its deadline a day late,
    // and every row in a plan that just fits read as late by one.
    //
    // The working week is what turns days of work into a date: ten days' work
    // started today does not finish a week on Tuesday.
    const lastDay = left > 0 ? projNthWorkdayOffset(Math.ceil(left) - 1, units) : 0;
    const finish = projToday() + lastDay * PROJ_DAY;
    return Math.round((deadline - finish) / PROJ_DAY);
}

function projSlackBand(days) {
    return PROJ_SLACK_BANDS.find(b => days < b.below) || PROJ_SLACK_BANDS[PROJ_SLACK_BANDS.length - 1];
}

/**
 * The size a rolled-up total comes out at.
 *
 * A parent has no size of its own — its days are its children's — but "60 d" tells
 * you less at a glance than "about an L" does, and the size column is where the eye
 * goes first. So it shows the step nearest the rolled-up total, with the exact
 * number in Total Days right beside it for when nearest is not close enough.
 *
 * Nearest rather than next-one-up, and a tie goes to the larger: 25 days against a
 * scale of 2/5/10/30/60 reads as an L, and 20 — equidistant between M and L — as an
 * L too, because rounding an estimate down is the direction that costs somebody a
 * weekend.
 *
 * Derived for the display only. Nothing writes it to the row: a parent that loses
 * its last sub-item goes back to whatever size it had, rather than keeping a number
 * that was never typed.
 */
function projRolledSize(data, row) {
    if (!projIsParent(data, row)) return '';
    const total = projTotalDays(data, row);
    if (!total) return '';
    let best = '', bestDiff = Infinity;
    PROJ_SIZE_ORDER.forEach(size => {
        const days = Number(data.sizes[size]);
        if (!isFinite(days) || days <= 0) return;
        const diff = Math.abs(days - total);
        if (diff <= bestDiff) { bestDiff = diff; best = size; }
    });
    return best;
}

// ---- the ladder, and working days ---------------------------------------------

function projUnits(data) {
    return { ...PROJ_DEFAULT_UNITS, ...((data || {}).units || {}) };
}

/** Each rung in working days. A rung of zero would divide by nothing, so the
 *  defaults stand in for anything that has been emptied out. */
function projUnitDays(units) {
    const n = (v, fallback) => {
        const x = Number(v);
        return isFinite(x) && x > 0 ? x : fallback;
    };
    const week = n(units.daysPerWeek, PROJ_DEFAULT_UNITS.daysPerWeek);
    const sprint = week * n(units.weeksPerSprint, PROJ_DEFAULT_UNITS.weeksPerSprint);
    const timebox = sprint * n(units.sprintsPerTimebox, PROJ_DEFAULT_UNITS.sprintsPerTimebox);
    const weeks = Number(units.planningWeeks);
    const planning = week * (isFinite(weeks) && weeks > 0 ? weeks : 0);
    // The planning week is part of the quarter, not an extra beside it: a quarter is
    // its timeboxes and then that week.
    return { day: 1, week: week, sprint: sprint, timebox: timebox, planning: planning,
             quarter: timebox * n(units.timeboxesPerQuarter, PROJ_DEFAULT_UNITS.timeboxesPerQuarter) +
                 planning };
}

/** A number of working days said in the largest rung it fits exactly. */
function projSayDuration(days, units) {
    const ladder = projUnitDays(units);
    const named = [['quarter', 'quarters'], ['timebox', 'timeboxes'], ['sprint', 'sprints'], ['week', 'weeks']];
    for (const [key, plural] of named) {
        const size = ladder[key];
        if (size > 1 && days >= size && days % size === 0) {
            const n = days / size;
            return n + ' ' + (n === 1 ? key : plural);
        }
    }
    return days + (days === 1 ? ' day' : ' days');
}

/**
 * Whether a date is one somebody works on.
 *
 * The working week starts on Monday and runs for as many days as the ladder says,
 * so a four-day week takes Friday off and a seven-day one takes nothing off. That
 * generalises without having to ask which days somebody's weekend falls on.
 */
function projIsWorkday(ms, units) {
    const dpw = Number(units.daysPerWeek);
    if (!isFinite(dpw) || dpw >= 7) return true;
    const fromMonday = (new Date(ms).getUTCDay() + 6) % 7;
    return fromMonday < Math.max(1, dpw);
}

/**
 * Calendar days from today to the n-th working day, counting from zero.
 *
 * Walked a day at a time rather than worked out proportionally: five working days
 * from a Wednesday is not the same span as five from a Monday, and a proportional
 * answer is wrong by the weekend exactly when it matters.
 */
function projNthWorkdayOffset(n, units) {
    if (!units.skipWeekends) return Math.max(0, n);
    const start = projToday();
    let offset = 0, found = -1, guard = 0;
    while (guard++ < 4000) {
        if (projIsWorkday(start + offset * PROJ_DAY, units)) {
            found++;
            if (found >= n) return offset;
        }
        offset++;
    }
    return Math.max(0, n);
}

/** Where a stretch of work finishes, as calendar days from today: the end of its
 *  last working day rather than the start of the next one. */
/**
 * The working-day index a calendar offset lands on — the inverse of the walk above.
 *
 * Counting rather than dividing, for the same reason: five working days from a
 * Wednesday is not the same span as five from a Monday. A date that falls on a day
 * off rolls forward to the next working day, which is what "start on Saturday"
 * means in a plan that does not work Saturdays.
 */
function projWorkdayIndexAt(calendarOffset, units) {
    const c = Math.round(calendarOffset);
    if (c <= 0) return 0;
    if (!units.skipWeekends) return c;
    const start = projToday();
    let n = 0;
    for (let d = 0; d < c && d < 4000; d++) {
        if (projIsWorkday(start + d * PROJ_DAY, units)) n++;
    }
    return n;
}

function projFinishOffset(workDays, units) {
    const days = Math.ceil(workDays);
    if (days <= 0) return 0;
    return projNthWorkdayOffset(days - 1, units) + 1;
}

/**
 * Where the year the periods are counted from begins.
 *
 * Calendar years start in January; a fiscal year starts in the month it is given.
 */
function projYearStart(units, atMs) {
    // A named day wins over the month: it carries a day of its own, and the cycle
    // repeats on that day every year rather than on the first of something.
    const pinned = projParseDate(units.periodStart);
    const d = new Date(atMs);
    const month = pinned !== null
        ? new Date(pinned).getUTCMonth() + 1
        : (units.yearMode === 'fiscal'
            ? Math.max(1, Math.min(12, Number(units.fiscalStartMonth) || 1)) : 1);
    const day = pinned !== null ? new Date(pinned).getUTCDate() : 1;
    const thisYear = Date.UTC(d.getUTCFullYear(), month - 1, day);
    return thisYear <= atMs ? thisYear : Date.UTC(d.getUTCFullYear() - 1, month - 1, day);
}

/**
 * How many calendar days a period of the ladder occupies.
 *
 * Every rung above the week is a whole number of weeks, so this is exact: a sprint
 * of two five-day weeks is fourteen calendar days, not ten. With weekends off, a
 * day of work is a day of calendar and the two are the same number.
 */
function projCalendarDaysOf(units, workDays) {
    if (!units.skipWeekends) return Math.max(0, Math.round(workDays));
    const dpw = Math.max(1, Math.min(7, Number(units.daysPerWeek) || 5));
    return Math.max(0, Math.round((workDays / dpw) * 7));
}

function projPeriodCalendarDays(units, mode) {
    const ladder = projUnitDays(units);
    const workDays = ladder[mode === 'sprints' ? 'sprint' : mode === 'timeboxes' ? 'timebox' : 'quarter'];
    return Math.max(1, projCalendarDaysOf(units, workDays));
}

/**
 * One quarter, in calendar days: its timeboxes, the sprints inside them, and the
 * planning week on the end.
 *
 * A quarter is not a multiple of a sprint — that is the whole point of the planning
 * week — so nothing above the sprint can be worked out by dividing. This is the shape
 * everything that walks periods walks.
 */
function projQuarterPlan(units) {
    const ladder = projUnitDays(units);
    const sprint = Math.max(1, projCalendarDaysOf(units, ladder.sprint));
    const timebox = Math.max(sprint, projCalendarDaysOf(units, ladder.timebox));
    const planning = projCalendarDaysOf(units, ladder.planning);
    const boxes = Math.max(1, Math.round(Number(units.timeboxesPerQuarter) || 1));
    return {
        sprint: sprint, timebox: timebox, planning: planning, boxes: boxes,
        quarter: timebox * boxes + planning
    };
}

/**
 * What the year is called, for a year starting at `startMs`.
 *
 * Always said, because a quarter without a year is only a quarter of the way to an
 * answer — a plan that runs eighteen months has two Q1s in it. A calendar year is
 * its own number; a **fiscal** year is named for the calendar year it *ends* in, so
 * one that opens in October 2026 closes in September 2027 and is FY27 throughout. A
 * fiscal year that opens in January neither starts nor ends anywhere else, so it
 * keeps its own number.
 */
function projYearLabel(units, startMs) {
    const d = new Date(startMs);
    if (units.yearMode !== 'fiscal') return d.getUTCFullYear() + ' ';
    const endsIn = d.getUTCFullYear() + (d.getUTCMonth() > 0 ? 1 : 0);
    return 'FY' + String(endsIn).slice(-2) + ' ';
}

/**
 * Where a date sits in the ladder: which quarter of the year, which timebox of that
 * quarter, which sprint of that timebox.
 *
 * Each number is counted inside its parent and starts again at 1 there, so the
 * second quarter's first sprint is Q2 T1 S1 rather than S7. A name that only said
 * S7 would make the reader divide to find out where they were.
 *
 * The quarters run from the year's start at whatever length the ladder gives them,
 * so a twelve-week quarter leaves a remainder at the end of a year and that
 * remainder is Q5. That is the ladder being honest about not fitting the calendar,
 * rather than a quarter being quietly stretched to hide it.
 */
function projPeriodPath(units, ms) {
    const start = projYearStart(units, ms);
    const plan = projQuarterPlan(units);
    const into = Math.max(0, Math.round((ms - start) / PROJ_DAY));
    const q = Math.floor(into / plan.quarter);
    const inQuarter = into - q * plan.quarter;
    const year = projYearLabel(units, start);
    // Past the last timebox and still inside the quarter: the planning week. It has
    // no timebox and no sprint number, because it is neither.
    if (inQuarter >= plan.timebox * plan.boxes) {
        return { year: year, q: q + 1, planning: true };
    }
    const t = Math.floor(inQuarter / plan.timebox);
    const inTimebox = inQuarter - t * plan.timebox;
    return { year: year, q: q + 1, t: t + 1, s: Math.floor(inTimebox / plan.sprint) + 1 };
}

/** The full name of the period a date falls in, down to the rung being shown. */
function projPeriodLabel(units, mode, ms) {
    const path = projPeriodPath(units, ms);
    let out = path.year + 'Q' + path.q;
    if (mode === 'quarters') return out;
    if (path.planning) return out + ' ' + PROJ_PLANNING_MARK;
    out += ' T' + path.t;
    if (mode === 'sprints') out += ' S' + path.s;
    return out;
}

/** Just the rung itself, for an axis too crowded to repeat the whole path. */
function projPeriodShortLabel(units, mode, ms) {
    const path = projPeriodPath(units, ms);
    if (mode === 'quarters') return path.year + 'Q' + path.q;
    if (path.planning) return PROJ_PLANNING_MARK;
    return mode === 'sprints' ? 'S' + path.s : 'T' + path.t;
}

/**
 * Where each period of the chosen rung begins and how long it runs, across a span of
 * days — walked rather than stepped, because the planning week is a week and
 * everything else is a fortnight or six, and a fixed step would march straight
 * through the quarter boundary and name the rest of the year wrong.
 */
function projPeriodSpans(units, mode, originDay, fromDay, toDay) {
    const plan = projQuarterPlan(units);
    const spans = [];
    let qStart = originDay;
    let guard = 0;
    while (qStart + plan.quarter <= fromDay && guard++ < 2000) qStart += plan.quarter;
    while (qStart > fromDay && guard++ < 2000) qStart -= plan.quarter;
    guard = 0;
    while (qStart <= toDay && guard++ < 400) {
        if (mode === 'quarters') {
            spans.push({ start: qStart, length: plan.quarter });
        } else {
            for (let b = 0; b < plan.boxes; b++) {
                const tStart = qStart + b * plan.timebox;
                if (mode === 'timeboxes') {
                    spans.push({ start: tStart, length: plan.timebox });
                } else {
                    for (let into = 0; into < plan.timebox; into += plan.sprint) {
                        spans.push({ start: tStart + into,
                            length: Math.min(plan.sprint, plan.timebox - into) });
                    }
                }
            }
            if (plan.planning > 0) {
                spans.push({ start: qStart + plan.timebox * plan.boxes, length: plan.planning });
            }
        }
        qStart += plan.quarter;
    }
    return spans.filter(s => s.start + s.length > fromDay && s.start <= toDay);
}

/**
 * Which step of the colour ramp a size is, or 0 for one that is off it — O, ? and
 * anything the table does not recognise, all of which are drawn neutral.
 *
 * The ramp has nine sizes and five colours, and it stays five: those five are the
 * best green→red there is at that length, and nine steps of it would put
 * neighbouring sizes closer together than anybody could tell apart — including
 * people who see colour differently, for whom some pairs would be the same colour.
 *
 * Written out rather than worked out, so the five sizes that were here first keep
 * exactly the colours they had: the four new ones join the end they belong to.
 * What distinguishes XXL from XL is what has always done the distinguishing — the
 * letters, inside the control.
 */
const PROJ_SIZE_STEPS = {
    XXXS: 1, XXS: 1, XS: 1, S: 2, M: 3, L: 4, XL: 5, XXL: 5, XXXL: 5
};

function projSizeStep(size) {
    return PROJ_SIZE_STEPS[size] || 0;
}

/**
 * What a size is worth, for the list it is picked from.
 *
 * Only while the list is open. A closed select shows the option that is selected, so
 * writing the days into the option text would put them in the cell too — and a
 * column of "M · 10 d" is the size table copied into every row, which is the thing
 * the size table exists to avoid. So the options carry the days while somebody is
 * choosing, and go back to being letters the moment they are not.
 */
function projSizeMenu(select, open) {
    const toolId = projToolId(select);
    if (!toolId) return;
    const sizes = projGetData(toolId).sizes || {};
    [...select.options].forEach(option => {
        if (!option.value) return;
        const days = Number(sizes[option.value]);
        option.textContent = (open && isFinite(days))
            ? option.value + ' \u00B7 ' + projRoundDays(days) + ' d'
            : option.value;
    });
}

/** Whether this is a size the table knows, which is not the same as having a colour. */
function projKnownSize(size) {
    return PROJ_SIZE_ORDER.indexOf(size) >= 0;
}

/** Completion runs the ramp the other way: nothing done is red, finished is green.
 *  Size and completion share the scale and disagree about which end is good, which
 *  is the point — green means good in both. */
function projPercentStep(pct) {
    return 6 - Math.min(5, Math.floor(pct / 20) + 1);
}

// ============================================================
// Scheduling for the chart
// ============================================================

/**
 * Where each bar starts, in days from today.
 *
 * A row with no dependencies starts today. A row with them starts when the last of
 * them finishes. Length is Remaining Days, so what is drawn is the work that is
 * left — a bar is what you still have to do, not what the item was ever worth.
 *
 * A dependency loop is detected rather than followed: the rows in it start today
 * and are marked, because a chart drawn from a contradiction should say so instead
 * of looking convincing.
 */
/** A start or end date typed into a row, as a working-day index, or null where the
 *  cell is empty and the plan is left to work it out. */
function projPinnedIndex(data, row, colId) {
    const ms = projParseDate(projCell(row, colId));
    if (ms === null) return null;
    return projWorkdayIndexAt(Math.round((ms - projToday()) / PROJ_DAY), projUnits(data));
}

/**
 * The schedule, worked out once per edit rather than once per cell.
 *
 * Two date columns read it for every row, which turned one walk of the dependency
 * graph into one per cell. The stamp is bumped by every save, so the only way to see
 * a stale answer is to mutate the data without saving it, which nothing here does.
 */
function projScheduleOf(data) {
    if (projSchedCache && projSchedCache.data === data && projSchedCache.stamp === projSchedStamp) {
        return projSchedCache.sched;
    }
    const sched = projSchedule(data);
    projSchedCache = { data: data, stamp: projSchedStamp, sched: sched };
    return sched;
}

/** When a row starts and finishes, as dates, whoever decided them. The finish is the
 *  last day work is on it, not the day after — a plan is read in days, not spans. */
function projRowDates(data, row) {
    const units = projUnits(data);
    const today = projToday();
    const s = projScheduleOf(data)[row.id] || { start: 0, days: 0 };
    const startCal = projNthWorkdayOffset(s.start, units);
    const n = Math.ceil(s.days);
    const endCal = n > 0 ? projNthWorkdayOffset(s.start + n - 1, units) : startCal;
    return {
        start: projFormatDate(today + startCal * PROJ_DAY),
        end: projFormatDate(today + endCal * PROJ_DAY)
    };
}

function projSchedule(data) {
    const byId = {};
    data.rows.forEach(r => { byId[r.id] = r; });
    const out = {};
    const VISITING = 1, DONE = 2;
    const mark = {};
    const cycles = {};

    function resolve(id) {
        if (mark[id] === DONE) return out[id];
        if (mark[id] === VISITING) { cycles[id] = true; return { start: 0, days: 0, cycle: true }; }
        mark[id] = VISITING;
        const row = byId[id];
        const deps = projCell(row, 'deps');
        let start = 0, cycle = false;
        (Array.isArray(deps) ? deps : []).forEach(depId => {
            if (!byId[depId] || depId === id) return;
            const r = resolve(depId);
            if (r.cycle) cycle = true;
            start = Math.max(start, r.start + r.days);
        });

        const kids = projChildren(data, id);
        let days;
        if (kids.length) {
            // A parent occupies whatever span its children occupy. Its own bar is
            // not work — adding it to theirs would count the same days twice.
            let first = Infinity, last = -Infinity;
            kids.forEach(kid => {
                const k = resolve(kid.id);
                if (k.cycle) cycle = true;
                first = Math.min(first, k.start);
                last = Math.max(last, k.start + k.days);
            });
            start = isFinite(first) ? first : start;
            days = isFinite(last) ? Math.max(0, last - start) : 0;
        } else {
            days = projRemainingDays(data, row);
            // A date somebody typed wins over one the plan worked out: the schedule
            // is an offer, and a committed date is a fact. Parents are left out —
            // their span is their children's, and their own date cells are read-only
            // for the same reason their size and completion are.
            const pinnedStart = projPinnedIndex(data, row, 'start');
            if (pinnedStart !== null) start = pinnedStart;
            const pinnedEnd = projPinnedIndex(data, row, 'end');
            // Only where there is work left to place. Nothing remaining means no bar,
            // and an end date cannot conjure one out of a finished item.
            if (pinnedEnd !== null && days > 0) days = Math.max(1, pinnedEnd - start + 1);
        }

        if (cycles[id]) cycle = true;
        out[id] = { start: start, days: days, cycle: cycle, parent: kids.length > 0 };
        mark[id] = DONE;
        return out[id];
    }

    data.rows.forEach(r => resolve(r.id));
    Object.keys(cycles).forEach(id => { if (out[id]) { out[id].start = 0; out[id].cycle = true; } });
    return out;
}

// ============================================================
// Rendering
// ============================================================

function projInit() {
    document.querySelectorAll('.proj-widget').forEach(widget => {
        const toolId = projToolId(widget);
        if (toolId) projRender(widget, toolId);
    });
}

/** What the framework calls when the result needs to be up to date. */
function projOnRender(toolId) {
    const tool = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    const widget = tool && tool.querySelector('.proj-widget');
    if (widget) projRender(widget, toolId);
}

function projRender(widget, toolId) {
    const data = projGetData(toolId);
    projRenderSettingsToggle(widget, data);
    projRenderSizes(widget, data);
    projRenderUnits(widget, data);
    projRenderTickets(widget, data);
    projRenderTable(widget, data);
    projRenderGantt(widget, data);
    projAutoFit(widget, toolId);
}

/**
 * Widen the window to fit the table, up to a point.
 *
 * The framework's own auto-fit stops at 600px, which is about four of these columns.
 * A table that grows a column should grow the window with it, and a table of eleven
 * should not open as a horizontal scrollbar.
 *
 * It stops as soon as the window has been resized by hand: the width this left
 * behind is remembered, and a width that is no longer that one means someone has an
 * opinion, which beats this one.
 */
function projAutoFit(widget, toolId) {
    const tool = widget.closest('.tool');
    if (!tool || tool.classList.contains('fullscreen') || tool.classList.contains('minimized')) return;
    const table = widget.querySelector('.proj-table');
    if (!table) return;

    // The width it was *given*, not the width it happens to occupy: content that
    // overflows makes the measured box wider than the window, and comparing against
    // that reads as "somebody resized this" when nobody has.
    const custom = toolCustomizations[toolId] || {};
    const current = Math.round(parseFloat(tool.style.width) ||
        (positions[toolId] || {}).width || tool.getBoundingClientRect().width);
    if (!current) return;
    if (custom.projFitWidth != null && Math.abs(current - custom.projFitWidth) > 1) return;

    // Measured at its natural width rather than at the width it has been given,
    // which is the pane's and tells us nothing.
    const before = table.style.width;
    table.style.width = 'max-content';
    const natural = Math.ceil(table.getBoundingClientRect().width);
    table.style.width = before;
    // In Chart mode the table is not on screen and measures zero, which is not a
    // reason to shrink the window to its minimum — it is a reason to leave it at
    // whatever the table last asked for.
    if (natural <= 0) return;

    const next = Math.max(PROJ_MIN_WIDTH, Math.min(PROJ_MAX_WIDTH, natural + PROJ_WIDTH_CHROME));

    // Applied every time, not only when the number changed. Coming out of
    // fullscreen leaves the tool with no inline width at all, and a tool with no
    // width is sized by its content — so "the stored number already says 1200"
    // is not the same as "the window is 1200 wide".
    tool.style.width = next + 'px';
    if (Math.abs(next - current) > 1 || (positions[toolId] || {}).width !== next) {
        const pos = positions[toolId] || { x: tool.offsetLeft, y: tool.offsetTop, z: 1 };
        positions[toolId] = { ...pos, width: next, height: pos.height };
        savePositions(positions);
    }
    if (custom.projFitWidth !== next) {
        toolCustomizations[toolId] = toolCustomizations[toolId] || {};
        toolCustomizations[toolId].projFitWidth = next;
        saveToolCustomizations(toolCustomizations);
    }
}

/** Re-render from anywhere inside the widget, after a change has been saved. */
function projRefresh(element) {
    const widget = projWidget(element);
    const toolId = projToolId(element);
    if (widget && toolId) projRender(widget, toolId);
}

function projRenderSizes(widget, data) {
    const el = widget.querySelector('.proj-sizes');
    if (!el) return;
    el.innerHTML = '<span class="proj-sizes-label">Days per size</span>' +
        PROJ_SIZE_ORDER.map((size) =>
            '<span class="proj-size-field" title="' + escapeHtml(PROJ_SIZE_MEANINGS[size] ||
                (size + ': how many days it is worth')) + '">' +
                '<span class="proj-chip" style="background:var(--proj-size-' + projSizeStep(size) + ');' +
                    'color:var(--proj-ink-' + projSizeStep(size) + ')">' + size + '</span>' +
                '<input type="number" min="0" step="1" data-size="' + size + '" ' +
                    'oninput="projOnSizeDays(this)" value="' + escapeHtml(String(data.sizes[size])) + '">' +
            '</span>').join('');
}

/**
 * Show or hide the three strips of settings above the table.
 *
 * Kept with the plan rather than with the window, so a board that is shared or
 * exported opens the way it was left — someone handed a finished plan should not
 * have to fold the scaffolding away again.
 */
function projToggleSettings(btn) {
    projMutate(btn, (data) => { data.hideSettings = !data.hideSettings; });
}

function projRenderSettingsToggle(widget, data) {
    const btn = widget.querySelector('.proj-settings-toggle');
    if (!btn) return;
    const hidden = !!data.hideSettings;
    widget.classList.toggle('proj-settings-hidden', hidden);
    btn.textContent = hidden ? '\u25B8 Settings' : '\u25BE Settings';
    btn.title = hidden
        ? 'Show the size table, the ladder and the ticket address'
        : 'Hide the size table, the ladder and the ticket address';
}

/**
 * Where a ticket number goes to. One address for the board, because a ticket number
 * on its own is not a link and writing the whole URL into every row is the thing
 * this column exists to stop.
 */
function projRenderTickets(widget, data) {
    const el = widget.querySelector('.proj-tickets');
    if (!el) return;
    const base = String(data.ticketBase || '');
    const example = projTicketUrl(data, 'ABC-123', 'bug');
    el.innerHTML = '<span class="proj-sizes-label">Ticket link</span>' +
        '<input type="url" class="proj-ticket-base" spellcheck="false" ' +
            'placeholder="https://tickets.example.com/browse/" ' +
            'title="The address a ticket number is added to. Put {ticket} in it if the ' +
                'number belongs somewhere other than the end, and {type} if the ticket\'s ' +
                'type is part of the address." ' +
            'oninput="projOnTicketBase(this)" value="' + escapeHtml(base) + '">' +
        '<span class="proj-ticket-note">' +
            (example ? 'ABC-123 \u2192 ' + escapeHtml(example)
                : base ? 'Needs to start with http:// or https://'
                : 'Numbers in the Ticket column become links once this is set') +
        '</span>';
}

/**
 * The ladder, on one line, under the sizes it shares a shape with.
 *
 * Each rung is counted in the rung below it rather than in days, because that is
 * how people say it — a timebox is three sprints, not thirty days — and the days
 * follow from the chain. What each one comes to is shown after it, so the chain is
 * never something you have to work out.
 */
function projRenderUnits(widget, data) {
    const el = widget.querySelector('.proj-units');
    if (!el) return;
    const units = projUnits(data);
    const ladder = projUnitDays(units);
    const fields = PROJ_UNIT_FIELDS.map(f =>
        '<span class="proj-unit-field" title="' + f.label + ' = this many ' + f.unit + '">' +
            '<span class="proj-unit-label">' + f.label + '</span>' +
            '<input type="number" min="0.5" step="' + (f.step || 1) + '" data-unit="' + f.key + '" ' +
                'oninput="projOnUnit(this)" value="' + escapeHtml(String(units[f.key])) + '">' +
            '<span class="proj-unit-note">' + f.unit + ' \u00B7 ' +
                ladder[f.label.toLowerCase()] + ' d</span>' +
        '</span>').join('');

    const fiscal = units.yearMode === 'fiscal';
    const pinned = projParseDate(units.periodStart) !== null;
    const cycleStart = pinned ? units.periodStart
        : projFormatDate(projYearStart(units, projToday()));
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    el.innerHTML = '<span class="proj-sizes-label">Ladder</span>' + fields +
        '<label class="proj-unit-toggle" title="' + (ladder.week >= 7
            ? 'A week of ' + ladder.week + ' days runs through the weekend, so there is none to skip'
            : 'A week of ' + ladder.week + ' days means work does not land at the weekend') + '">' +
            '<input type="checkbox" data-unit="skipWeekends" onchange="projOnUnit(this)"' +
                (units.skipWeekends ? ' checked' : '') + '> Skip weekends</label>' +
        '<span class="proj-unit-field">' +
            '<select class="proj-unit-select" data-unit="yearMode" onchange="projOnUnit(this)">' +
                '<option value="calendar"' + (fiscal ? '' : ' selected') + '>Calendar year</option>' +
                '<option value="fiscal"' + (fiscal ? ' selected' : '') + '>Fiscal year</option>' +
            '</select>' +
            (fiscal && !pinned ? '<select class="proj-unit-select" data-unit="fiscalStartMonth" ' +
                'onchange="projOnUnit(this)" title="The month the fiscal year starts">' +
                months.map((m, i) => '<option value="' + (i + 1) + '"' +
                    (Number(units.fiscalStartMonth) === i + 1 ? ' selected' : '') + '>' + m + '</option>').join('') +
                '</select>' : '') +
        '</span>' +
        // Where the counting starts. Shown whether or not it has been set, with the
        // day the year would start on anyway in it — the same shape as a Start cell,
        // and for the same reason: a field that knows the answer should say it.
        '<span class="proj-unit-field proj-when" title="' + escapeHtml(pinned
            ? 'The day Q1 T1 S1 begins, and the same day every year after. \u21BA hands it back to the year'
            : 'Worked out from the year. Type a date to start the counting somewhere else') + '">' +
            '<span class="proj-unit-label">Q1 T1 S1 starts</span>' +
            '<input type="date" class="proj-unit-date proj-when-input' +
                (pinned ? '' : ' proj-when-derived') + '" data-unit="periodStart" ' +
                'oninput="projOnPeriodStart(this)" value="' + escapeHtml(cycleStart) + '">' +
            (pinned ? '<button class="proj-x" onclick="projClearPeriodStart(this)" ' +
                'title="Back to the year\'s own start">\u21BA</button>' : '') +
        '</span>';
}

/**
 * The day the counting starts, as it is typed.
 *
 * Saved without redrawing the strip, so the caret stays in the field; what has to
 * catch up is the chart, whose every period name and boundary is measured from here.
 */
function projOnPeriodStart(input) {
    const toolId = projToolId(input);
    const widget = projWidget(input);
    if (!toolId || !widget) return;
    const data = projGetData(toolId);
    data.units = { ...projUnits(data), periodStart: input.value };
    projSetData(toolId, data);
    // The strip is not redrawn, so the two things that say whether this date is the
    // plan's or the user's are moved by hand — the same as a Start cell.
    input.classList.toggle('proj-when-derived', !input.value);
    const field = input.parentNode;
    let reset = field ? field.querySelector('[onclick^="projClearPeriodStart"]') : null;
    if (input.value && !reset && field) {
        reset = document.createElement('button');
        reset.className = 'proj-x';
        reset.setAttribute('onclick', 'projClearPeriodStart(this)');
        reset.title = "Back to the year's own start";
        reset.textContent = '\u21BA';
        field.appendChild(reset);
    } else if (!input.value && reset) {
        reset.remove();
    }
    projUpdateDerived(widget, data);
}

/** Hand the counting back to the year it would otherwise start with. */
function projClearPeriodStart(btn) {
    projMutate(btn, (data) => {
        data.units = { ...projUnits(data), periodStart: '' };
    });
}

function projOnAxis(select) {
    const toolId = projToolId(select);
    const widget = projWidget(select);
    if (!toolId || !widget) return;
    const data = projGetData(toolId);
    data.units = { ...projUnits(data), axis: select.value };
    projSetData(toolId, data);
    projRenderGantt(widget, data);
}

function projOnUnit(input) {
    const key = input.getAttribute('data-unit');
    const toolId = projToolId(input);
    const widget = projWidget(input);
    if (!toolId || !widget) return;
    const data = projGetData(toolId);
    data.units = { ...projUnits(data) };
    data.units[key] = input.type === 'checkbox' ? input.checked
        : (input.tagName === 'SELECT' ? input.value : Number(input.value));
    projSetData(toolId, data);
    // The rungs and the year controls change what the whole strip says, so those
    // redraw it; a number keeps the caret and only moves what it feeds.
    if (input.tagName === 'SELECT') projRender(widget, toolId);
    else { projRenderUnits(widget, data); projUpdateDerived(widget, data); }
}

function projColumnHeadHtml(col) {
    // Collapsed: the heading is the only thing left, turned on its side, and the
    // whole cell is the way back. A column is folded away to get it out of the way
    // of the ones either side of it, so it has to be narrow, and the title has to
    // still be findable — hence the tooltip and the sideways text.
    if (col.collapsed) {
        return '<button class="proj-col-folded" onclick="projToggleColumn(this)" ' +
            'data-col="' + col.id + '" title="' + escapeHtml('Unfold ' + col.title) + '">' +
            escapeHtml(col.title) + '</button>';
    }
    const typeSelect = col.builtin ? '' :
        '<select class="proj-col-type" onchange="projOnColumnType(this)" data-col="' + col.id + '">' +
            PROJ_COLUMN_TYPES.map(t => '<option value="' + t + '"' +
                (t === col.type ? ' selected' : '') + '>' + t + '</option>').join('') +
        '</select>';
    // By id first, then by type: two built-in columns can share a type and still
    // have different things to say — Team and System are both text, and "a line of
    // text" is not what either of them is for.
    const hint = PROJ_COLUMN_HINTS[col.id] || PROJ_COLUMN_HINTS[col.type];
    const title = (hint ? hint + '. ' : '') + 'Click to rename';
    // The grip is what drags, not the whole heading: a heading is clicked to rename
    // and holds a dropdown, and a draggable ancestor makes both of those awkward.
    return '<div class="proj-col-head">' +
        '<span class="proj-col-grip" draggable="true" title="Drag to move this column" ' +
            'data-col="' + col.id + '" ondragstart="projColDragStart(this, event)" ' +
            'ondragend="projColDragEnd(this)">\u283F</span>' +
        '<span class="proj-col-title" data-col="' + col.id + '" onclick="projEditColumnTitle(this)" ' +
            'title="' + escapeHtml(title) + '">' + escapeHtml(col.title) + '</span>' +
        typeSelect +
        '<span class="proj-col-acts">' +
            '<button class="proj-x proj-col-fold" title="Fold this column away" ' +
                'onclick="projToggleColumn(this)" data-col="' + col.id + '">\u00AB</button>' +
            '<button class="proj-x proj-col-del" title="Delete column" ' +
                'onclick="projDeleteColumn(this)" data-col="' + col.id + '">×</button>' +
        '</span>' +
    '</div>';
}

/** One chip: a value, and the × that takes it off this row. */
/**
 * How one row is named in another row's dependencies.
 *
 * Two tasks can be called the same thing — "Review" under each of three parents is
 * an ordinary way to write a plan — and a list of three identical options is a list
 * you have to guess at. The number in front is the row you can point at in the
 * table, so the choice is decidable from the dropdown alone.
 */
function projDepLabel(data, row) {
    return projRowNumber(data, row) + ' \u00B7 ' + (projCell(row, 'item') || 'Untitled');
}

function projChipHtml(label, onRemove, attrs) {
    return '<span class="proj-dep-chip">' +
        '<span class="proj-chip-text" title="' + escapeHtml(String(label)) + '">' +
            escapeHtml(String(label)) + '</span>' +
        '<button class="proj-x" onclick="' + onRemove + '" ' + attrs +
        ' title="Remove">\u00D7</button></span>';
}

/**
 * The + at the right edge, and the dropdown it opens.
 *
 * A select sitting open in every cell of a column is a column of arrows; what the
 * eye wants there is the chips. So the dropdown is built but hidden, and the + is
 * what is on show until somebody reaches for it — at the right edge, so the pluses
 * line up down the column instead of stepping in and out with the chips.
 */
function projPickerHtml(options, selectClass, onChange, attrs, title) {
    if (!options) return '';
    return '<button class="proj-pick-add" onclick="projRevealPicker(this)" ' +
            'title="' + escapeHtml(title) + '">+</button>' +
        '<select class="proj-cell-select proj-pick ' + selectClass + '" ' + attrs +
            ' onchange="' + onChange + '" hidden>' +
            '<option value="">\u2014</option>' + options +
        '</select>';
}

function projCellHtml(data, row, col) {
    const id = 'data-row="' + row.id + '" data-col="' + col.id + '"';
    const value = projCell(row, col.id);

    switch (col.type) {
        case 'size': {
            // One control, not a chip beside a dropdown: the select carries the
            // colour and the label is the option text, so what you read is what you
            // change — and the label is also what keeps green→red honest.
            const isParent = projIsParent(data, row);
            // A parent shows the size its sub-items add up to, not one of its own.
            const shown = isParent ? projRolledSize(data, row) : value;
            const step = projSizeStep(shown);
            // Styled whenever it is a size this table knows, which includes the two
            // that have no colour of their own — they get the neutral step rather
            // than looking like an empty cell.
            const style = projKnownSize(shown)
                ? ' style="background:var(--proj-size-' + step + ');color:var(--proj-ink-' + step + ')"'
                : '';
            const title = isParent
                ? 'Rolled up from the sub-items: ' + (Math.round(projTotalDays(data, row) * 10) / 10) +
                  ' days, nearest ' + (shown || 'nothing on the scale')
                : 'T-shirt size';
            return '<select class="proj-size-select' + (projKnownSize(shown) ? '' : ' proj-size-unset') + '" ' + id +
                    ' onchange="projOnCell(this)"' + style + (isParent ? ' disabled' : '') +
                    ' title="' + escapeHtml(title) + '"' +
                ' onfocus="projSizeMenu(this, true)" onblur="projSizeMenu(this, false)">' +
                '<option value="">' + (isParent ? '—' : 'size') + '</option>' +
                PROJ_SIZE_ORDER.map(s => '<option value="' + s + '"' +
                    (s === shown ? ' selected' : '') + '>' + escapeHtml(s) + '</option>').join('') +
            '</select>';
        }
        case 'percent': {
            const isParent = projIsParent(data, row);
            const pct = projPercent(data, row);
            const step = projPercentStep(pct);
            return '<div class="proj-pct-wrap">' +
                '<input type="number" min="0" max="100" step="1" class="proj-cell-input proj-pct-input" ' +
                    id + ' oninput="projOnCell(this)"' + (isParent ? ' disabled' : '') +
                    ' title="' + (isParent ? 'Rolled up from the sub-items, weighted by days' : 'Per cent complete') + '"' +
                    ' value="' + escapeHtml(String(isParent ? pct : (value === '' ? 0 : value))) + '">' +
                '<span class="proj-bar-track" title="' + pct + '% complete">' +
                    '<span class="proj-bar-fill" style="width:' + pct + '%;' +
                        'background:var(--proj-size-' + step + ')"></span>' +
                '</span></div>';
        }
        case 'ticket': {
            // A row can be two tickets — the one the work is tracked in and the one
            // it was asked for in — so this is a list, and a list in a 60px column
            // is chips with the editing in a window, the way links already work.
            //
            // The number is at the front and the type after it: the cut lands on the
            // end, and of the two it is the number that says which ticket this is.
            const tickets = projTicketsOf(row, col.id);
            const chips = tickets.map(t => {
                const url = projTicketUrl(data, t.id, t.type);
                const text = t.id || '(no number)';
                const label = escapeHtml(text) +
                    (t.type ? '<span class="proj-ticket-type">\u00B7 ' + escapeHtml(t.type) + '</span>' : '');
                const title = text + (t.type ? ' \u00B7 ' + t.type : '') + (url ? ' \u2014 ' + url : '');
                return url
                    ? '<a class="proj-ticket-chip" href="' + escapeHtml(url) + '" target="_blank" ' +
                        'rel="noopener" title="' + escapeHtml(title) + '">' + label + '</a>'
                    : '<span class="proj-ticket-chip proj-ticket-plain" title="' +
                        escapeHtml(title) + '">' + label + '</span>';
            }).join('');
            return '<div class="proj-chips">' + chips +
                '<button class="proj-pick-add" onclick="projOpenTickets(this)" ' + id + ' ' +
                    'title="' + (tickets.length ? 'Add or change tickets' : 'Add a ticket') + '">+</button>' +
            '</div>';
        }
        case 'item': {
            // A floor rather than a preference. `size` is only what a cell would
            // like to be: when the table is wider than the window, the browser
            // takes the space back from whatever can give it, and an input with
            // `width: 100%; min-width: 0` gives all of it. Every other column can
            // afford that; the one holding the name of the task cannot.
            const chars = projFieldSize(value, 6, PROJ_ITEM_MAX);
            return '<input class="proj-cell-input proj-cell-item" ' + id +
                ' oninput="projOnCell(this)" size="' + chars + '"' +
                projGrowAttrs(6, PROJ_ITEM_MAX) +
                ' style="min-width:' + chars + 'ch"' +
                ' value="' + escapeHtml(String(value)) + '">';
        }
        case 'notes': {
            // A textarea, so Enter is a new line rather than nothing at all. Drawn
            // at the size the text already needs; projGrowField keeps up from there.
            const text = String(value == null ? '' : value);
            const cols = projNoteCols(text, 12, 32);
            return '<textarea class="proj-cell-input proj-cell-notes" ' + id +
                ' oninput="projOnCell(this)"' + projGrowAttrs(12, 32) +
                ' cols="' + cols + '" rows="' + projNoteRows(text, cols) + '">' +
                escapeHtml(text) + '</textarea>';
        }
        case 'start':
        case 'end': {
            // The field always shows a date — the one typed in, or the one the plan
            // works out — and says which it is rather than sitting empty next to a
            // schedule that knows the answer. Worked-out dates are shown faint, and
            // the ↺ beside a typed one hands it back to the plan.
            const isParent = projIsParent(data, row);
            const typed = String(value == null ? '' : value);
            const dates = projRowDates(data, row);
            const shown = typed || dates[col.type];
            // A date typed on a day nobody works rolls forward to the next working
            // day. The cell keeps what was typed — it is the user's — and says where
            // the work actually lands, rather than quietly disagreeing with the chart.
            const rolled = typed && dates[col.type] !== typed ? dates[col.type] : '';
            return '<span class="proj-when">' +
                '<input type="date" class="proj-cell-input proj-when-input' +
                    (typed ? '' : ' proj-when-derived') + '" ' + id +
                    ' oninput="projOnCell(this)"' + (isParent ? ' disabled' : '') +
                    ' title="' + escapeHtml(isParent
                        ? 'Taken from the sub-items'
                        : typed
                            ? 'Typed in. \u21BA hands it back to the plan' +
                              (rolled ? '. The work lands on ' + rolled + ', the next working day' : '')
                            : 'Worked out from the plan. Type a date to pin it') + '"' +
                    ' value="' + escapeHtml(shown) + '">' +
                (typed && !isParent
                    ? '<button class="proj-x" onclick="projClearDate(this)" data-row="' + row.id +
                      '" data-col="' + col.id + '" title="Back to the worked-out date">\u21BA</button>'
                    : '') +
            '</span>';
        }
        case 'date':
            return '<input type="date" class="proj-cell-input" ' + id +
                ' oninput="projOnCell(this)" value="' + escapeHtml(String(value)) + '">';
        case 'number':
            return '<input type="number" class="proj-cell-input proj-cell-num" ' + id +
                ' size="' + projFieldSize(value, 4, 10) + '"' +
                ' oninput="projOnCell(this)" value="' + escapeHtml(String(value)) + '">';
        case 'calcNumber':
            return '<span class="proj-num">' + escapeHtml(projRowNumber(data, row)) + '</span>';
        case 'title': {
            const text = projRowTitle(data, row);
            // The button carries the text rather than the row, so what is copied is
            // what is on the screen — and a copy cannot quietly go and fetch
            // something else.
            return '<span class="proj-title">' +
                '<span class="proj-title-text" title="' + escapeHtml(text) + '">' +
                    escapeHtml(text) + '</span>' +
                (text ? '<button class="proj-title-copy" onclick="projCopyTitle(this)" ' +
                    'data-title="' + escapeHtml(text) + '" title="Copy this title">' +
                    '\u29C9</button>' : '') +
            '</span>';
        }
        case 'calcTotal': {
            const total = projRoundDays(projTotalDays(data, row));
            return '<span class="proj-calc" title="' +
                escapeHtml(projSayDuration(total, projUnits(data))) + '">' + total + ' d</span>';
        }
        case 'calcRemaining': {
            const rem = projRoundDays(projRemainingDays(data, row));
            return '<span class="proj-calc" title="' +
                escapeHtml(projSayDuration(rem, projUnits(data))) + '">' + rem + ' d</span>';
        }
        case 'calcSlack': {
            const slack = projSlackDays(data, row);
            // Two reasons for a dash, and they are not the same thing to know: one
            // row has no deadline to measure against, the other has finished.
            if (slack === null) {
                const why = projIsDone(data, row)
                    ? 'Finished \u2014 no room left to need'
                    : projCell(row, 'deadline') ? 'No slack to measure' : 'No deadline set';
                return '<span class="proj-calc" style="color:var(--text-muted)" title="' +
                    escapeHtml(why) + '">—</span>';
            }
            const band = projSlackBand(slack);
            return '<span class="proj-calc" style="color:var(--proj-' + band.role + ')" title="' +
                escapeHtml(band.title) + '">' + band.mark + ' ' +
                (slack > 0 ? '+' : '') + slack + ' d</span>';
        }
        case 'deps': {
            const deps = Array.isArray(value) ? value : [];
            const others = data.rows.filter(r => r.id !== row.id && deps.indexOf(r.id) < 0);
            const chips = deps.map(depId => {
                const dep = data.rows.find(r => r.id === depId);
                const label = dep ? projDepLabel(data, dep) : 'missing';
                return projChipHtml(label, 'projRemoveDep(this)',
                    'data-row="' + row.id + '" data-dep="' + escapeHtml(depId) + '"');
            }).join('');
            const options = others.map(r => '<option value="' + escapeHtml(r.id) + '">' +
                escapeHtml(projDepLabel(data, r)) + '</option>').join('');
            return '<div class="proj-chips">' + chips +
                projPickerHtml(options, 'proj-dep-add', 'projAddDep(this)',
                    'data-row="' + row.id + '"', 'Add a dependency') +
            '</div>';
        }
        case 'resources': {
            // The same shape as dependencies, because it is the same job: a row can
            // have more than one, each one is a chip you can take off, and the way to
            // add is a + at the right edge rather than a dropdown sitting open in
            // every cell of the column.
            const mine = projResourcesOf(row, col.id);
            const others = projResourceList(data, col.id).filter(r => mine.indexOf(r) < 0);
            const chips = mine.map(name => projChipHtml(name, 'projRemoveResource(this)',
                'data-row="' + row.id + '" data-col="' + col.id +
                '" data-res="' + escapeHtml(name) + '"')).join('');
            const options = others.map(r => '<option value="' + escapeHtml(r) + '">' +
                escapeHtml(r) + '</option>').join('') +
                '<option value="' + PROJ_RES_NEW + '">+ New\u2026</option>';
            return '<div class="proj-chips">' + chips +
                projPickerHtml(options, 'proj-res-select', 'projOnResource(this)',
                    'data-row="' + row.id + '" data-col="' + col.id + '"',
                    'Add a resource') +
            '</div>';
        }
        case 'links': {
            // Two fields and a cross per link, in a column as wide as the rest of
            // them, is three things fighting over 60 pixels. The cell shows what is
            // there and opens — the editing happens in a window with room in it.
            const links = Array.isArray(value) ? value : [];
            const chips = links.map(link => {
                const href = projSafeUrl(link.url);
                const label = String(link.label || '').trim() || projLinkHost(link.url) || 'link';
                return href
                    ? '<a class="proj-link-chip" href="' + escapeHtml(href) + '" target="_blank" ' +
                        'rel="noopener" title="' + escapeHtml(link.url) + '">' +
                        escapeHtml(label) + '</a>'
                    : '<span class="proj-link-chip proj-link-blank" title="' +
                        escapeHtml(String(link.url || '') ? 'Not a web address: ' + link.url
                            : 'No address yet') + '">' + escapeHtml(label) + '</span>';
            }).join('');
            return '<div class="proj-chips">' + chips +
                '<button class="proj-pick-add" onclick="projOpenLinks(this)" ' +
                    'data-row="' + row.id + '" data-col="' + col.id + '" ' +
                    'title="' + (links.length ? 'Add or change links' : 'Add a link') + '">+</button>' +
            '</div>';
        }
        default:
            return '<input class="proj-cell-input" ' + id + ' oninput="projOnCell(this)" ' +
                'size="' + projFieldSize(value, 6, 32) + '"' + projGrowAttrs(6, 32) + ' ' +
                'title="' + escapeHtml(String(value)) + '" value="' + escapeHtml(String(value)) + '">';
    }
}

/** What has been written about this cell, or ''. */
function projNote(row, colId) {
    const notes = row && row.notes;
    return notes && typeof notes === 'object' ? String(notes[colId] || '') : '';
}

/**
 * The note opener that sits in the corner of every cell.
 *
 * Out of the cell's own flow and hidden until the cell is under the pointer, unless
 * there is something to read — fourteen columns of permanently visible buttons is a
 * table you cannot see the plan in. The lane it sits in is reserved by the cell's
 * padding, so nothing it covers and nothing jumps when it appears.
 */
function projNoteOpener(row, col) {
    const note = projNote(row, col.id).trim();
    return '<button class="proj-note-btn' + (note ? ' proj-note-has' : '') + '" ' +
        'data-row="' + row.id + '" data-col="' + col.id + '" onclick="projOpenNote(this)" ' +
        'title="' + escapeHtml(note ? note.slice(0, 400) : 'Write a note about this') +
        '">\u2630</button>';
}

function projRenderTable(widget, data) {
    const table = widget.querySelector('.proj-table');
    if (!table) return;
    if (!data.columns.length) {
        table.innerHTML = '<tbody><tr><td class="proj-empty">No columns. Press + Column.</td></tr></tbody>';
        return;
    }
    const head = '<thead><tr><th></th>' +
        data.columns.map(col => '<th' + (col.collapsed ? ' class="proj-col-narrow"' : '') +
            ' data-col="' + escapeHtml(col.id) + '"' +
            ' ondragover="projColDragOver(this, event)" ondragleave="projColDragLeave(this)" ' +
            'ondrop="projColDrop(this, event)">' +
            projColumnHeadHtml(col) + '</th>').join('') +
        '<th></th></tr></thead>';
    const ordered = projOrderedRows(data);
    const body = '<tbody>' + (ordered.length
        ? ordered.map((row, i) => {
            const depth = projRowDepth(data, row);
            const isParent = projIsParent(data, row);
            // One step of indent per level it already sits at, so a sub-task lines up
            // under its task rather than under the project.
            const canIndent = !!projIndentTarget(data, ordered, i);
            const tools = '<span class="proj-row-tools">' +
                '<span class="proj-indent"></span>'.repeat(depth) +
                '<span class="proj-handle">☰</span>' +
                (canIndent ? '<button class="proj-x proj-nest" title="Make this a sub-item" ' +
                    'onclick="projIndentRow(this)" data-row="' + row.id + '">↳</button>' : '') +
                (depth ? '<button class="proj-x proj-nest" title="Move it out one level" ' +
                    'onclick="projOutdentRow(this)" data-row="' + row.id + '">↰</button>' : '') +
            '</span>';
            const classes = (isParent ? ' proj-is-parent' : '') +
                (projPercent(data, row) >= 100 ? ' proj-done' : '');
            return '<tr draggable="true" data-row="' + row.id + '"' +
                    (classes ? ' class="' + classes.trim() + '"' : '') +
                    ' ondragstart="projRowDragStart(this, event)" ' +
                    'ondragover="projRowDragOver(this, event)" ondragleave="projRowDragLeave(this)" ' +
                    'ondrop="projRowDrop(this, event)" ondragend="projRowDragEnd(this)">' +
                '<td>' + tools + '</td>' +
                data.columns.map(col => col.collapsed
                    ? '<td class="proj-col-narrow" title="' + escapeHtml(col.title) + '">\u00B7</td>'
                    : '<td>' + projCellHtml(data, row, col) + projNoteOpener(row, col) + '</td>').join('') +
                '<td><button class="proj-x" onclick="projDeleteRow(this)" data-row="' + row.id +
                    '" title="Delete row">×</button></td>' +
            '</tr>';
        }).join('')
        : '<tr><td colspan="' + (data.columns.length + 2) + '" class="proj-empty">No rows yet. Press + Row.</td></tr>') +
    '</tbody>';
    table.innerHTML = head + body;
}

/** Tick spacing that lands on a readable number of labels whatever the span is. */
function projTickStep(spanDays) {
    if (spanDays <= 14) return 1;
    if (spanDays <= 45) return 7;
    if (spanDays <= 120) return 14;
    if (spanDays <= 400) return 30;
    return 90;
}

function projRenderGantt(widget, data) {
    const pane = widget.querySelector('.proj-gantt-pane');
    if (!pane) return;
    if (!data.rows.length) {
        pane.innerHTML = '<div class="proj-empty">Nothing to chart yet.</div>';
        return;
    }

    const sched = projSchedule(data);
    const units = projUnits(data);
    const today = projToday();
    // The schedule counts working days; the chart is a calendar. Everything from
    // here down is in calendar days from today.
    const barSpan = (s) => {
        const start = projNthWorkdayOffset(s.start, units);
        const n = Math.ceil(s.days);
        return { start: start, end: n > 0 ? projNthWorkdayOffset(s.start + n - 1, units) + 1 : start };
    };
    const deadlineOffset = (row) => {
        const d = projParseDate(projCell(row, 'deadline'));
        return d === null ? null : Math.round((d - today) / PROJ_DAY);
    };

    const ordered = projOrderedRows(data);
    let dayMin = 0, dayMax = 1;
    ordered.forEach(row => {
        const reach = barSpan(sched[row.id] || { start: 0, days: 0 });
        dayMax = Math.max(dayMax, reach.end);
        const d = deadlineOffset(row);
        // A deadline marks a day, so the window reaches the end of that day — the
        // same convention the bars use. Reaching only its start put a marker on the
        // furthest deadline at exactly 100%, which is outside the track and so
        // invisible: the one deadline most worth seeing was the one that vanished.
        if (d !== null) { dayMax = Math.max(dayMax, d + 1); dayMin = Math.min(dayMin, d); }
    });
    const span = Math.max(1, dayMax - dayMin);
    const pos = (day) => ((day - dayMin) / span) * 100;

    // Dates, or the ladder's own periods. A sprint axis is for seeing what lands
    // inside which sprint, so the periods are drawn as boundaries down the chart
    // rather than as labels along the top.
    const mode = PROJ_AXIS_MODES.some(m => m.id === units.axis) ? units.axis : 'dates';
    const ticks = [];
    const bands = [];
    if (mode === 'dates') {
        const step = projTickStep(span);
        for (let d = Math.ceil(dayMin / step) * step; d <= dayMax; d += step) {
            ticks.push('<span class="proj-tick" style="left:' + pos(d) + '%">' +
                projFormatDate(today + d * PROJ_DAY).slice(5) + '</span>');
        }
    } else {
        // Walked rather than stepped: a quarter ends with a planning week, so the
        // periods are not all the same length and a fixed step would march through
        // the quarter boundary and name the rest of the year wrong.
        const yearStart = projYearStart(units, today + dayMin * PROJ_DAY);
        const origin = Math.round((yearStart - today) / PROJ_DAY);
        const typical = projPeriodCalendarDays(units, mode);
        // The whole path on every tick would overlap itself once the periods are
        // narrow, so where they are, it is written out only when the parent above
        // it changes — which is exactly where a reader needs reminding.
        const roomy = (typical / span) * 100 >= 11;
        let previousParent = null;
        projPeriodSpans(units, mode, origin, dayMin, dayMax).forEach(period => {
            const edge = period.start;
            const at = today + (edge + 1) * PROJ_DAY;
            const full = projPeriodLabel(units, mode, at);
            const cut = full.lastIndexOf(' ');
            const parent = cut < 0 ? '' : full.slice(0, cut);
            // The boundary is drawn only where it falls inside the chart; the name is
            // drawn for any period the chart is looking at, over the middle of the part
            // that shows. A quarter that began last week is still the quarter you are
            // in, and an axis that answers "which one is this?" with nothing is no axis.
            if (edge >= dayMin) {
                bands.push('<span class="proj-period" style="left:' + pos(edge) + '%"></span>');
            }
            const from = Math.max(edge, dayMin);
            const to = Math.min(edge + period.length, dayMax);
            if (to > from) {
                const text = (roomy || parent !== previousParent)
                    ? full : projPeriodShortLabel(units, mode, at);
                const begins = projFormatDate(today + edge * PROJ_DAY);
                const ends = projFormatDate(today + (edge + period.length - 1) * PROJ_DAY);
                // Both dates where the period is wide enough to hold them, the start
                // alone where it is not: a range that overlaps its neighbour is worth
                // less than a start date that does not. The tooltip always has both.
                const when = roomy ? begins.slice(5) + ' \u2013 ' + ends.slice(5) : begins.slice(5);
                ticks.push('<span class="proj-tick" title="' + escapeHtml(full) + ' \u00B7 ' +
                    begins + ' to ' + ends +
                    '" style="left:' + pos((from + to) / 2) + '%">' +
                    escapeHtml(text) +
                    '<span class="proj-tick-date">' + when + '</span></span>');
            }
            previousParent = parent;
        });
    }
    const axisPicker = '<select class="proj-unit-select proj-axis-pick" onchange="projOnAxis(this)" ' +
        'title="What the chart is marked out in">' +
        PROJ_AXIS_MODES.map(m => '<option value="' + m.id + '"' +
            (m.id === mode ? ' selected' : '') + '>' + m.label + '</option>').join('') +
    '</select>';

    // The bars are coloured by slack rather than by size: size is already in the
    // table, in its own column, in colour — and the question a chart is read for is
    // whether this lands in time. Status colours, so each one ships with its mark
    // and its word, and the key says which is which. Best first, which is the
    // direction the size ramp reads in too.
    const legend = '<span class="proj-legend">' +
        PROJ_SLACK_BANDS.slice().reverse().map(b =>
            '<span class="proj-legend-item" title="' + escapeHtml(b.title) + '">' +
            '<span class="proj-legend-swatch" style="background:var(--proj-' + b.role + ')"></span>' +
            escapeHtml(b.label) + '</span>').join('') +
        '<span class="proj-legend-item" title="Nothing to be late for">' +
        '<span class="proj-legend-swatch" style="background:var(--proj-size-0)"></span>' +
        'No deadline</span></span>';

    const rows = ordered.map(row => {
        const s = sched[row.id] || { start: 0, days: 0, cycle: false };
        const cal = barSpan(s);
        const label = String(projCell(row, 'item') || 'Untitled');
        const isParent = projIsParent(data, row);
        const slack = projSlackDays(data, row);
        const band = slack === null ? null : projSlackBand(slack);
        const paint = band ? 'var(--proj-' + band.role + ')' : 'var(--proj-size-0)';
        const d = deadlineOffset(row);
        const finish = cal.end;
        // The last day the bar covers, for the same reason: `cal.end` is where the
        // bar stops, which is the day after the work, and a deadline names a day the
        // work is allowed to be happening on. Nothing left is never missed — the
        // work is done, and a done row draws a dot rather than a bar.
        const missed = d !== null && s.days > 0 && finish - 1 > d;

        // A finished item has no remaining work and so no bar. It becomes a marker
        // rather than nothing, because "done" and "not in the plan" are different.
        // A parent is a bracket rather than a block — its days are its children's, and a
        // solid bar would count them twice — but it is late or comfortable like
        // anything else, so its colour goes on the outline instead of the fill.
        const bar = s.days > 0
            ? '<span class="proj-bar' + (s.cycle ? ' proj-bar-cycle' : '') +
                (isParent ? ' proj-bar-parent' : '') + '" style="left:' + pos(cal.start) +
                '%;width:' + Math.max(0.5, ((cal.end - cal.start) / span) * 100) +
                (isParent ? '%;border-color:' + paint : '%;background:' + paint) + '" ' +
                'title="' + escapeHtml(label) + ' — ' +
                projSayDuration(Math.round(s.days * 10) / 10, units) + ' left, ' +
                projFormatDate(today + cal.start * PROJ_DAY) + ' to ' +
                projFormatDate(today + Math.max(cal.start, finish - 1) * PROJ_DAY) +
                (d !== null ? ', deadline ' + projFormatDate(today + d * PROJ_DAY) +
                    (band ? ' — ' + band.title : '') : '') +
                (s.cycle ? ' — in a dependency loop' : '') + '"></span>'
            : '<span class="proj-done-dot" style="left:' + pos(d !== null ? d : cal.start) +
                '%" title="' + escapeHtml(label) + ' — complete"></span>';

        const marker = d === null ? '' :
            '<span class="proj-deadline' + (missed ? ' proj-missed' : '') + '" style="left:' + pos(d) +
            '%" title="Deadline ' + projFormatDate(today + d * PROJ_DAY) +
            (missed ? ' — the order of work puts this later' : '') + '"></span>';

        // Today is drawn per row rather than once down the whole grid: the track
        // starts after the label column, so a single line at grid level would need
        // to mix a pixel offset with a percentage of a width it does not have.
        // Rows sit flush, so the segments read as one line.
        // The dates sit in the label column rather than beside the bar: a bar can be
        // a few pixels wide or hard against the edge, and a date that overlaps the
        // next one is worse than no date at all.
        const when = projRowDates(data, row);
        const whenText = when.start === when.end
            ? when.start.slice(5)
            : when.start.slice(5) + ' \u2013 ' + when.end.slice(5);
        return '<div class="proj-gantt-row">' +
            '<span class="proj-gantt-label' +
                (row.parent ? ' proj-sub-label proj-depth-' + projRowDepth(data, row) : '') + '">' +
                '<span class="proj-gantt-name" title="' + escapeHtml(label) + '">' +
                    escapeHtml(label) + '</span>' +
                '<span class="proj-gantt-when" title="' + escapeHtml(label) + ': ' +
                    when.start + ' to ' + when.end + '">' + whenText + '</span>' +
            '</span>' +
            '<span class="proj-track">' + bands.join('') +
                '<span class="proj-today" style="left:' + pos(0) + '%"></span>' +
                bar + marker +
            '</span>' +
        '</div>';
    }).join('');

    const looped = data.rows.filter(r => (sched[r.id] || {}).cycle);
    const warn = looped.length
        ? '<div class="proj-warn">' + looped.length +
            (looped.length === 1 ? ' row depends' : ' rows depend') +
            ' on itself through a loop, so it is drawn from today instead.</div>'
        : '';

    pane.innerHTML = '<div class="proj-gantt">' +
        '<div class="proj-gantt-head"><span class="proj-gantt-title">Work remaining, from today</span>' +
            axisPicker + legend + '</div>' +
        '<div class="proj-gantt-scroll"><div class="proj-gantt-grid">' +
            '<div class="proj-axis">' + bands.join('') + ticks.join('') +
                '<span class="proj-today-label" style="left:' + pos(0) + '%">today</span>' +
                '<span class="proj-today" style="left:' + pos(0) + '%"></span>' +
            '</div>' + rows +
        '</div></div>' + warn +
    '</div>';
}

// ============================================================
// CSV, in and out
//
// A project table is a spreadsheet shape, and the thing people actually want is to
// get it into one and back. CSV rather than .xlsx: no dependency to load, it
// round-trips, and Excel, Numbers and Sheets all open it directly. What it cannot
// carry is colour and column type, which are this tool's and not the file's.
//
// Two things have no column of their own in the table and need one in the file.
// Sub-items travel as a Parent column holding the parent's Item text, and
// dependencies as a list of item names — names rather than ids, because a file
// somebody opens in a spreadsheet should read as sentences, and ids from another
// machine would mean nothing anyway. Both resolve by name on the way back in.
// ============================================================

const PROJ_CSV_PARENT = 'Parent';

/**
 * How one row names another in a file: its number, then what it is called.
 *
 * The name alone stopped being enough the moment a plan could hold two tasks called
 * "Review" — the importer would have picked whichever came first and said nothing.
 * The number decides it; the name is there so the file is still worth reading. A
 * file written before this, with only a name, still resolves by name.
 */
function projCsvRef(data, row) {
    const name = String(projCell(row, 'item') || '').trim();
    return (projRowNumber(data, row) + ' ' + name).trim();
}

/** The number at the front of such a reference, if it has one. */
function projCsvRefNumber(text) {
    const match = /^\s*(\d+(?:\.\d+)*)\s/.exec(String(text || '') + ' ');
    return match ? match[1] : '';
}

/** One field, quoted only where it has to be. */
function projCsvField(value) {
    const text = value == null ? '' : String(value);
    return /[",\n\r]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

/**
 * Split CSV into rows of fields.
 *
 * Written out rather than split on commas: a Notes cell with a comma in it, or a
 * quoted field with a newline, is ordinary content and the naive version loses the
 * rest of the row to it.
 */
function projCsvParse(text) {
    const rows = [];
    let row = [], field = '', quoted = false, i = 0;
    const src = String(text || '').replace(/^\uFEFF/, '');
    while (i < src.length) {
        const c = src[i];
        if (quoted) {
            if (c === '"') {
                if (src[i + 1] === '"') { field += '"'; i += 2; continue; }
                quoted = false; i++; continue;
            }
            field += c; i++; continue;
        }
        if (c === '"') { quoted = true; i++; continue; }
        if (c === ',') { row.push(field); field = ''; i++; continue; }
        if (c === '\r') { i++; continue; }
        if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
        field += c; i++;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter(r => r.some(f => String(f).trim() !== ''));
}

/** What a cell looks like in a spreadsheet, which is not always what it is here. */
function projCsvValue(data, row, col) {
    switch (col.type) {
        case 'calcNumber': return projRowNumber(data, row);
        case 'title': return projRowTitle(data, row);
        case 'calcTotal': return projRoundDays(projTotalDays(data, row));
        case 'calcRemaining': return projRoundDays(projRemainingDays(data, row));
        case 'calcSlack': {
            const slack = projSlackDays(data, row);
            return slack === null ? '' : slack;
        }
        // The effective date, which is what a spreadsheet is for. Which of them was
        // typed and which was worked out is not something a CSV can say, so these are
        // read past on the way in rather than pinning every row on a round trip.
        case 'start':
        case 'end': return projCell(row, col.id) || projRowDates(data, row)[col.type];
        case 'resources': return projResourcesOf(row, col.id).join('; ');
        case 'ticket': return projTicketsOf(row, col.id).map(projCsvTicket).join('; ');
        case 'size': return projIsParent(data, row) ? projRolledSize(data, row) : projCell(row, col.id);
        case 'percent': return projPercent(data, row);
        case 'deps': {
            const deps = projCell(row, col.id);
            if (!Array.isArray(deps)) return '';
            return deps.map(id => {
                const dep = data.rows.find(r => r.id === id);
                return dep ? projCsvRef(data, dep) : '';
            }).filter(Boolean).join('; ');
        }
        case 'links': {
            const links = projCell(row, col.id);
            if (!Array.isArray(links)) return '';
            return links.map(l => (l.label ? l.label + ' ' : '') + '<' + (l.url || '') + '>').join('; ');
        }
        default: return projCell(row, col.id);
    }
}

function projToCsv(data) {
    // A notes column in the file for each column that has any, so nothing written in
    // a window is lost on the way to a spreadsheet, and nothing empty takes a column.
    const noted = data.columns.filter(col => data.rows.some(row => projNote(row, col.id).trim()));
    const header = data.columns.map(c => c.title)
        .concat(noted.map(c => c.title + PROJ_CSV_NOTE_SUFFIX), [PROJ_CSV_PARENT]);
    const lines = [header.map(projCsvField).join(',')];
    projOrderedRows(data).forEach(row => {
        const parent = row.parent ? data.rows.find(r => r.id === row.parent) : null;
        const values = data.columns.map(col => projCsvValue(data, row, col))
            .concat(noted.map(col => projNote(row, col.id)),
                [parent ? projCsvRef(data, parent) : '']);
        lines.push(values.map(projCsvField).join(','));
    });
    // A leading BOM, or Excel reads anything non-ASCII as mojibake.
    return '\uFEFF' + lines.join('\r\n') + '\r\n';
}

function projExportCsv(btn) {
    const toolId = projToolId(btn);
    if (!toolId) return;
    const data = projGetData(toolId);
    const title = ((toolCustomizations[toolId] || {}).title || 'project').replace(/[^\w.-]+/g, '-');
    const blob = new Blob([projToCsv(data)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function projPickCsv(btn) {
    const input = projWidget(btn).querySelector('.proj-csv-file');
    if (input) { input.value = ''; input.click(); }
}

/** Links come back from "label <url>; label <url>", and from a bare url too. */
function projParseLinks(text) {
    return String(text || '').split(';').map(part => part.trim()).filter(Boolean).map(part => {
        const m = part.match(/^(.*?)\s*<([^>]*)>$/);
        if (m) return { label: m[1].trim(), url: m[2].trim() };
        return /^https?:\/\//i.test(part) ? { label: '', url: part } : { label: part, url: '' };
    });
}

/** One ticket, as a spreadsheet should show it: the number, and its type in
 *  brackets after it when it has one. Brackets rather than a bare second word — a
 *  type can be two words, and `ABC-1 Tech Debt` has no honest way back. */
function projCsvTicket(ticket) {
    const id = String((ticket || {}).id || '').trim();
    const type = String((ticket || {}).type || '').trim();
    if (!id) return type ? '(' + type + ')' : '';
    return type ? id + ' (' + type + ')' : id;
}

/**
 * Tickets back out of a cell in a file: `ABC-1 (Bug); ABC-2`.
 *
 * Tolerant on the way in, because a file typed by hand is the common case. A
 * trailing bracket is the type; failing that, a second word is, since `ABC-1 Bug` is
 * what somebody writes without reading this. One word is just a number.
 */
function projParseTickets(text) {
    return String(text || '').split(';').map(s => s.trim()).filter(Boolean).map(part => {
        const m = part.match(/^(.*?)\s*\(([^)]*)\)$/);
        if (m) return { id: m[1].trim(), type: m[2].trim() };
        const bits = part.split(/\s+/);
        return bits.length > 1
            ? { id: bits[0], type: bits.slice(1).join(' ') }
            : { id: part, type: '' };
    }).filter(t => t.id || t.type);
}

/**
 * Build a table from parsed CSV.
 *
 * Columns are matched by heading, ignoring case and spacing, so a file that has
 * been through a spreadsheet still lands in the right places. A heading this table
 * does not have becomes a new text column rather than being dropped — it is
 * somebody's data. Calculated columns are read past: they are derived here, and a
 * stale number from a file would be a lie that looks like a fact.
 */
function projFromCsv(rows, data) {
    const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const header = rows[0].map(norm);
    const columns = data.columns.slice();
    const byIndex = header.map(h => {
        if (h === norm(PROJ_CSV_PARENT)) return { parent: true };
        // "<Column> notes" is a note about that column rather than a column of its
        // own — but only when no column claims the heading first, since somebody may
        // have made a column genuinely called that, and theirs is the one they meant.
        if (!columns.some(c => norm(c.title) === h) && h.endsWith(norm(PROJ_CSV_NOTE_SUFFIX))) {
            const about = h.slice(0, h.length - norm(PROJ_CSV_NOTE_SUFFIX).length).trim();
            const col = columns.find(c => norm(c.title) === about);
            if (col) return { note: col };
        }
        const existing = columns.find(c => norm(c.title) === h);
        if (existing) return { col: existing };
        if (!h) return null;
        const added = { id: projNewId('c'), title: rows[0][header.indexOf(h)].trim(), type: 'text' };
        columns.push(added);
        return { col: added };
    });

    const built = rows.slice(1).map(line => {
        const row = { id: projNewId('r'), cells: {} };
        let parentName = '';
        byIndex.forEach((target, i) => {
            const raw = line[i] == null ? '' : String(line[i]).trim();
            if (!target) return;
            if (target.parent) { parentName = raw; return; }
            if (target.note) {
                if (raw) {
                    if (!row.notes) row.notes = {};
                    row.notes[target.note.id] = raw;
                }
                return;
            }
            const col = target.col;
            if (col.type === 'calcTotal' || col.type === 'calcRemaining' ||
                col.type === 'calcSlack' || col.type === 'calcNumber' || col.type === 'title' ||
                col.type === 'start' || col.type === 'end') return;
            if (col.type === 'deps') { row.cells[col.id] = raw; return; } // names for now
            if (col.type === 'links') { row.cells[col.id] = projParseLinks(raw); return; }
            if (col.type === 'ticket') { row.cells[col.id] = projParseTickets(raw); return; }
            if (col.type === 'resources') {
                row.cells[col.id] = raw.split(';').map(s => s.trim()).filter(Boolean);
                return;
            }
            if (col.type === 'size') { row.cells[col.id] = raw.toUpperCase(); return; }
            if (col.type === 'percent') { row.cells[col.id] = raw === '' ? 0 : Number(raw) || 0; return; }
            row.cells[col.id] = raw;
        });
        return { row: row, parentName: parentName };
    });

    // Names become ids once every row exists — a dependency may point forwards.
    const byName = {};
    // Two ways to find a row the file points at: the number it was exported with,
    // which is exact, and its name, which is what a file typed by hand will have.
    const byNumber = {};
    const numberCol = columns.find(c => c.type === 'calcNumber');
    built.forEach(b => {
        const name = norm(projCell(b.row, 'item'));
        if (name && !byName[name]) byName[name] = b.row.id;
        const n = numberCol ? String(b.row.cells[numberCol.id] || '').trim() : '';
        if (n && !byNumber[n]) byNumber[n] = b.row.id;
    });
    const refTo = (text) => {
        const n = projCsvRefNumber(text);
        if (n && byNumber[n]) return byNumber[n];
        const bare = String(text || '').replace(/^\s*\d+(?:\.\d+)*\s+/, '');
        return byName[norm(bare)] || byName[norm(text)] || null;
    };
    const depsCol = columns.find(c => c.type === 'deps');
    built.forEach(b => {
        if (depsCol) {
            const refs = String(b.row.cells[depsCol.id] || '').split(';')
                .map(s => s.trim()).filter(Boolean);
            b.row.cells[depsCol.id] = refs.map(refTo).filter(id => id && id !== b.row.id);
        }
        const parentId = refTo(b.parentName);
        if (parentId && parentId !== b.row.id) b.row.parent = parentId;
    });
    // Three levels, as everywhere else: a row deeper than that is promoted until it
    // fits rather than quietly making a deeper tree than the table can draw.
    const rowsNow = { rows: built.map(b => b.row) };
    built.forEach(b => {
        let guard = 0;
        while (b.row.parent && projRowDepth(rowsNow, b.row) > PROJ_MAX_DEPTH && guard++ < 8) {
            const parent = rowsNow.rows.find(r => r.id === b.row.parent);
            if (parent && parent.parent) b.row.parent = parent.parent;
            else delete b.row.parent;
        }
    });

    return { columns: columns, rows: built.map(b => b.row) };
}

function projImportCsvFile(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const toolId = projToolId(input);
    const widget = projWidget(input);
    if (!toolId || !widget) return;
    const reader = new FileReader();
    reader.onload = () => {
        const rows = projCsvParse(reader.result);
        if (rows.length < 2) { alert('That file has a header and no rows.'); return; }
        const data = projGetData(toolId);
        // Importing a table means this table, so it replaces the rows. Saying so
        // first, because the rows it replaces were typed by somebody.
        if (data.rows.length && !confirm('Replace the ' + data.rows.length +
            ' rows in this table with the ' + (rows.length - 1) + ' in the file?')) return;
        const built = projFromCsv(rows, data);
        data.columns = built.columns;
        data.rows = built.rows;
        projSetData(toolId, data);
        projRender(widget, toolId);
    };
    reader.readAsText(file);
}

// ============================================================
// Markdown, out
//
// The table is a working surface; this is the plan said in a way somebody can read
// in a document, a ticket or a message. Headings and bullets rather than a pipe
// table: a note is prose and a link is a link, and neither survives a table cell.
//
// Dates are optional because dates are what changes. Start and End move every time
// anything above them moves, so a summary that carries them is out of date by the
// afternoon and cannot be diffed against the one from last week. With them off, the
// text only changes when the plan does — which is the thing worth reading.
// ============================================================

/** The columns the summary speaks for itself, by type: anything else a table has is
 *  somebody's own column and gets a line of its own. */
const PROJ_MD_SPOKEN_FOR = ['calcNumber', 'item', 'title', 'size', 'percent',
    'start', 'end', 'calcTotal', 'calcRemaining', 'calcSlack', 'resources',
    'deps', 'links', 'ticket'];

/**
 * What a summary can be made of, and what each switch is called.
 *
 * One per thing a row carries, in the order the document says them, because a plan
 * is written out for a reason and the reason decides what belongs: a status update
 * wants how far along and who is on it; a scope review wants the notes and the
 * tickets and none of the dates; something pasted into a ticket wants the links.
 * Everything is on to begin with — the full version is the one you can cut down.
 */
const PROJ_MD_PARTS = [
    // Off to begin with, and first in the row because it changes the heading rather
    // than adding a line under it. The headings already nest, so in the document
    // itself a task knows what it belongs to; the full title is for when a row is
    // going to be read away from the rest of them.
    { id: 'fullTitle', label: 'Full title', off: true,
      hint: 'Head each row with the whole of its Title \u2014 project, task and ' +
            'sub-task \u2014 rather than with the task\u2019s own name' },
    { id: 'size', label: 'Size & days',
      hint: 'The size, and the days of work it comes to' },
    { id: 'done', label: '% Done',
      hint: 'How far along each row is, and the days still left on it' },
    { id: 'dates', label: 'Dates',
      hint: 'Start, End, deadlines, slack, and anything else date-shaped. They move ' +
            'whenever anything above them moves, so a summary meant to be kept is ' +
            'usually better without them' },
    { id: 'assigned', label: 'Assigned', hint: 'Who is on each row' },
    { id: 'tickets', label: 'Tickets', hint: 'The tickets each row is tracked in' },
    { id: 'deps', label: 'Dependencies', hint: 'What each row waits for' },
    { id: 'links', label: 'Links', hint: 'The links kept on each row' },
    { id: 'notes', label: 'Notes',
      hint: 'The note on the task, the Notes column, and anything written about a ' +
            'cell \u2014 which lives in a window and is otherwise never read' },
    { id: 'extra', label: 'Other columns',
      hint: 'Columns added to this table that nothing else in this list names' }
];

/** Which parts this plan is set to show. Absent means all of them: a switch is only
 *  stored once somebody has turned something off. */
function projMdOptions(data) {
    const stored = (data && data.mdShow && typeof data.mdShow === 'object') ? data.mdShow : {};
    const show = {};
    // On unless turned off, except the few that are off until turned on.
    PROJ_MD_PARTS.forEach(part => {
        show[part.id] = part.off ? stored[part.id] === true : stored[part.id] !== false;
    });
    return show;
}

/** A note, as a block quote. Every line of it: a note is prose and the second
 *  paragraph of one is not decoration. */
function projMdQuote(text) {
    return String(text || '').replace(/\r/g, '').split('\n').map(l => ('> ' + l).trimEnd());
}

/** A note on a bullet, with its later lines indented so they stay on that bullet
 *  rather than ending the list. */
function projMdIndent(text) {
    return String(text || '').replace(/\r/g, '').split('\n')
        .map((l, i) => (i ? '  ' + l : l).trimEnd()).join('\n');
}

/**
 * What this row says on one line: how big, how far along, and who is on it.
 *
 * Any of the three can be switched off, so the line is built from what is left and
 * is '' when nothing is — a row with every switch down is its heading and its
 * bullets, not a pair of empty asterisks.
 */
function projMdFacts(data, row, show) {
    const bits = [];
    if (show.size) {
        const parent = projIsParent(data, row);
        const size = parent ? projRolledSize(data, row) : String(projCell(row, 'size') || '').trim();
        if (size) bits.push(size);
        bits.push(projRoundDays(projTotalDays(data, row)) + ' d');
    }
    if (show.done) {
        const pct = projPercent(data, row);
        bits.push(pct >= 100 ? 'done'
            : pct + '% done, ' + projRoundDays(projRemainingDays(data, row)) + ' d left');
    }
    let line = bits.length ? '**' + bits.join(' \u00B7 ') + '**' : '';
    if (!show.assigned) return line;
    const col = data.columns.find(c => c.type === 'resources');
    const who = col ? projResourcesOf(row, col.id) : [];
    if (!who.length) return line;
    return line ? line + ' \u00B7 ' + who.join(', ') : who.join(', ');
}

/** When this row runs, due when, and how that compares. Only ever called with dates
 *  turned on, so the caller decides and this one does not have to. */
function projMdDates(data, row) {
    const when = projRowDates(data, row);
    const bits = [when.start + ' \u2192 ' + when.end];
    const due = String(projCell(row, 'deadline') || '').trim();
    if (due) bits.push('deadline ' + due);
    const slack = projSlackDays(data, row);
    if (slack !== null) bits.push(slack >= 0 ? slack + ' d spare' : (-slack) + ' d late');
    return bits.join(' \u00B7 ');
}

/** One row: a heading at its own depth, what it is, what was written about it, and
 *  then a bullet for each of the things a row can carry several of. */
function projRowMarkdown(data, row, show) {
    const out = [];
    const depth = projRowDepth(data, row);
    const own = String(projCell(row, 'item') || '').trim();
    const name = (show.fullTitle ? projRowTitle(data, row).trim() : own) || own || 'Untitled';
    // Six is as deep as a heading goes; three levels never reach it, but a stored
    // table from somewhere else might.
    out.push('#'.repeat(Math.min(6, 2 + depth)) + ' ' + projRowNumber(data, row) + ' ' + name);
    const facts = projMdFacts(data, row, show);
    if (facts) { out.push(''); out.push(facts); }

    const about = show.notes ? projNote(row, 'item').trim() : '';
    if (about) { out.push(''); projMdQuote(about).forEach(l => out.push(l)); }

    const bullets = [];
    if (show.dates) bullets.push('Dates: ' + projMdDates(data, row));
    data.columns.forEach(col => {
        if (col.type === 'ticket') {
            if (!show.tickets) return;
            const tickets = projTicketsOf(row, col.id).map(t => {
                const url = projTicketUrl(data, t.id, t.type);
                const text = t.id || '(no number)';
                return (url ? '[' + text + '](' + url + ')' : text) + (t.type ? ' (' + t.type + ')' : '');
            });
            if (tickets.length) bullets.push(col.title + ': ' + tickets.join(', '));
            return;
        }
        if (col.type === 'deps') {
            if (!show.deps) return;
            const deps = (projCell(row, col.id) || []);
            const named = (Array.isArray(deps) ? deps : []).map(id => {
                const dep = data.rows.find(r => r.id === id);
                return dep ? projCsvRef(data, dep) : '';
            }).filter(Boolean);
            if (named.length) bullets.push(col.title + ': ' + named.join(', '));
            return;
        }
        if (col.type === 'links') {
            if (!show.links) return;
            const links = projCell(row, col.id);
            const named = (Array.isArray(links) ? links : []).map(l => {
                const label = String(l.label || '').trim() || projLinkHost(l.url) || 'link';
                const url = projSafeUrl(l.url);
                return url ? '[' + label + '](' + url + ')' : label;
            }).filter(Boolean);
            if (named.length) bullets.push(col.title + ': ' + named.join(', '));
            return;
        }
        // Somebody's own column, and the Notes column, which is one of these too —
        // but the Notes column is notes, and goes with the rest of them rather than
        // with somebody's extra column of numbers. A date column is a date wherever
        // it came from, so it follows the dates switch.
        if (PROJ_MD_SPOKEN_FOR.indexOf(col.type) >= 0) return;
        if (col.id === 'deadline') return;
        if (col.type === 'notes' ? !show.notes : !show.extra) return;
        if (col.type === 'date' && !show.dates) return;
        const value = String(projCell(row, col.id) == null ? '' : projCell(row, col.id)).trim();
        if (value) bullets.push(projMdIndent(col.title + ': ' + value));
    });
    // What was written about a cell, which is in a window and so is the part of a
    // plan that never gets read. Said once per column, named by the column.
    data.columns.forEach(col => {
        if (!show.notes) return;
        if (col.id === 'item') return;
        if (col.type === 'date' && !show.dates) return;
        const note = projNote(row, col.id).trim();
        if (note) bullets.push(projMdIndent(col.title + ' note: ' + note));
    });
    if (bullets.length) {
        out.push('');
        bullets.forEach(b => out.push('- ' + b));
    }
    return out;
}

/**
 * The whole plan as Markdown.
 *
 * `title` is the tool's own, since that is what the plan is called on the board.
 */
function projToMarkdown(data, opts) {
    const o = opts || {};
    const show = o.show || projMdOptions(data);
    const out = ['# ' + (String(o.title || '').trim() || 'Project'), ''];
    const tops = data.rows.filter(r => !r.parent ||
        !data.rows.some(p => p.id === r.parent));
    const total = projRoundDays(tops.reduce((s, r) => s + projTotalDays(data, r), 0));
    const left = projRoundDays(tops.reduce((s, r) => s + projRemainingDays(data, r), 0));
    const done = total ? Math.round((1 - left / total) * 100) : 0;
    // The line that says what the whole thing comes to, made of the same parts the
    // rows are: a summary that counted days the rows no longer carry would be
    // answering a question the document has stopped asking.
    const head = [data.rows.length + (data.rows.length === 1 ? ' item' : ' items')];
    if (show.size) head.push(total + ' d of work');
    if (show.done) {
        if (left !== total) head.push(left + ' d left');
        head.push(done + '% done');
    }
    if (show.dates) head.push('as of ' + projFormatDate(projToday()));
    out.push('*' + head.join(' \u00B7 ') + '*');
    if (!data.rows.length) {
        out.push('', '*Nothing in this plan yet.*');
        return out.join('\n') + '\n';
    }
    projOrderedRows(data).forEach(row => {
        out.push('');
        projRowMarkdown(data, row, show).forEach(l => out.push(l));
    });
    return out.join('\n') + '\n';
}

// ============================================================
// Editing
// ============================================================

function projMutate(element, fn) {
    const toolId = projToolId(element);
    const widget = projWidget(element);
    if (!toolId || !widget) return;
    const data = projGetData(toolId);
    fn(data);
    projSetData(toolId, data);
    projRender(widget, toolId);
}

/**
 * Redraw everything a typed value feeds, and nothing else.
 *
 * The rest of this tool re-renders the whole table on every change, which is the
 * house pattern and right for a click. It is wrong for a keystroke: rebuilding the
 * table under the field being typed into takes the caret with it, so a number can
 * only ever be entered one character at a time. The calculated cells, the progress
 * bar and the chart are the only things a keystroke can change, so those are
 * updated in place and the input is left alone.
 */
function projUpdateDerived(widget, data) {
    data.rows.forEach(row => {
        const tr = widget.querySelector('.proj-table tbody tr[data-row="' + CSS.escape(row.id) + '"]');
        if (!tr) return;
        data.columns.forEach((col, i) => {
            const td = tr.children[i + 1]; // +1 for the drag handle
            if (!td || col.collapsed) return;
            // Cells that are rebuilt must never be rebuilt under the caret. The
            // progress bar is exempt: only the fill's own style is touched, and
            // that is the cell whose input is being typed into most of the time.
            // A date is exempt for the same reason the bar is: what changes is what
            // sits beside the field, not the field being typed into.
            const typing = td.contains(document.activeElement);
            if (col.type !== 'percent' &&
                col.type !== 'start' && col.type !== 'end' && typing) return;
            if (col.type === 'percent') {
                const fill = td.querySelector('.proj-bar-fill');
                if (!fill) return;
                const pct = projPercent(data, row);
                // Finished rows fade here too, or a row would only step back on the
                // next full render — which is not what typing 100 looks like.
                tr.classList.toggle('proj-done', pct >= 100);
                fill.style.width = pct + '%';
                fill.style.background = 'var(--proj-size-' + projPercentStep(pct) + ')';
                // A parent's own number is derived, so it follows its children.
                const input = td.querySelector('.proj-pct-input');
                if (input && input.disabled) input.value = String(pct);
            } else if (col.type === 'size' && projIsParent(data, row)) {
                // Rolled up, so it moves when a sub-item does.
                td.innerHTML = projCellHtml(data, row, col);
            } else if (col.type === 'deps' || col.type === 'title' ||
                    col.type === 'calcNumber' || col.type === 'ticket') {
                // Dependency chips carry *another* row's item text, so renaming an
                // item has to reach them. Left out at first, which meant a renamed
                // item kept its old name everywhere it was depended on. A title is
                // made of the project's name and the task's, and a number is made of
                // where the row sits, so the same is true of both. Ticket chips are
                // made of the board's ticket address, which is typed in the strip
                // above them — that is how the links appear as it is typed.
                td.innerHTML = projCellHtml(data, row, col);
            } else if (col.type === 'start' || col.type === 'end') {
                // Every row's dates move when any row's size, completion, dependency
                // or pinned date does.
                if (!typing) { td.innerHTML = projCellHtml(data, row, col); return; }
                // Except the one being typed into, which keeps its caret and its own
                // value — but must stop calling itself worked out the moment it is
                // not, and offer the way back that a pinned date comes with.
                const field = td.querySelector('.proj-when-input');
                if (!field) return;
                const pinned = !!String(projCell(row, col.id) || '');
                field.classList.toggle('proj-when-derived', !pinned);
                let reset = td.querySelector('[onclick^="projClearDate"]');
                if (pinned && !reset) {
                    reset = document.createElement('button');
                    reset.className = 'proj-x';
                    reset.setAttribute('onclick', 'projClearDate(this)');
                    reset.setAttribute('data-row', row.id);
                    reset.setAttribute('data-col', col.id);
                    reset.title = 'Back to the worked-out date';
                    reset.textContent = '\u21BA';
                    field.parentNode.appendChild(reset);
                } else if (!pinned && reset) {
                    reset.remove();
                }
            } else if (col.type === 'calcTotal' || col.type === 'calcRemaining' || col.type === 'calcSlack') {
                td.innerHTML = projCellHtml(data, row, col);
            }
        });
    });
    projRenderGantt(widget, data);
}

function projOnSizeDays(input) {
    const size = input.getAttribute('data-size');
    const value = Number(input.value);
    const toolId = projToolId(input);
    const widget = projWidget(input);
    if (!toolId || !widget) return;
    const data = projGetData(toolId);
    data.sizes[size] = isFinite(value) ? value : 0;
    projSetData(toolId, data);
    projUpdateDerived(widget, data);
}

/**
 * The board's ticket address, as it is typed.
 *
 * Saved without a re-render, like every other field that is typed into — redrawing
 * the strip would take the caret out of this one at the first character. What does
 * have to catch up is every ticket cell in the table, which is what makes the link
 * appear as soon as the address is a real one; `projUpdateDerived` does that part.
 */
/** The title, on the clipboard. The board's own helper where there is one, since it
 *  already answers the case where the clipboard API is not available at all. */
function projCopyTitle(btn) {
    const text = btn.getAttribute('data-title') || '';
    if (!text) return;
    if (typeof copyTextToClipboard === 'function') {
        copyTextToClipboard(text, 'Title copied');
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text);
    else window.prompt('Copy this title:', text);
}

function projOnTicketBase(input) {
    const toolId = projToolId(input);
    const widget = projWidget(input);
    if (!toolId || !widget) return;
    const data = projGetData(toolId);
    data.ticketBase = input.value;
    projSetData(toolId, data);
    const note = widget.querySelector('.proj-ticket-note');
    if (note) {
        const example = projTicketUrl(data, 'ABC-123', 'bug');
        note.textContent = example ? 'ABC-123 \u2192 ' + example
            : data.ticketBase ? 'Needs to start with http:// or https://'
            : 'Numbers in the Ticket column become links once this is set';
    }
    projUpdateDerived(widget, data);
}

/**
 * The description window.
 *
 * Built on the body rather than inside the tool: the tool window can be 300px wide
 * and clips its own contents, and this is where somebody writes three paragraphs.
 * That also means `projToolId()` cannot find its way home from here — `closest('.tool')`
 * has nothing to find — so the window carries the tool's id with it.
 */
/**
 * The window that both the notes and the links open in.
 *
 * Built on `document.body`: the tool window can be 300px wide and clips its own
 * contents, which is the whole reason either of these is a window rather than a
 * cell. It carries the tool's id, since `closest('.tool')` has nothing to find from
 * out here, and the heading is set as text rather than interpolated — a heading is
 * somebody's task name.
 */
function projOpenModal(toolId, rowId, colId, heading, bodyHtml, hint) {
    projCloseModal();
    const overlay = document.createElement('div');
    overlay.className = 'proj-modal';
    overlay.setAttribute('data-tool', toolId);
    overlay.setAttribute('data-row', rowId);
    overlay.setAttribute('data-col', colId);
    overlay.innerHTML = '<div class="proj-modal-box">' +
        '<div class="proj-modal-head"><span></span>' +
            '<button class="proj-x" onclick="projCloseModal()" title="Close">\u00D7</button></div>' +
        bodyHtml +
        '<div class="proj-modal-foot">' +
            '<span class="proj-modal-hint">' + escapeHtml(hint) + '</span>' +
            '<button class="proj-btn" onclick="projCloseModal()">Done</button>' +
        '</div></div>';
    overlay.querySelector('.proj-modal-head span').textContent = heading;
    // Clicking the backdrop is closing; clicking the box is not.
    overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) projCloseModal(); });
    document.body.appendChild(overlay);
    // On the capture phase, and the event stops here: Escape belongs to the topmost
    // thing that is open, and the board's own Escape handler would otherwise take the
    // tool out of fullscreen behind this window at the same time.
    projModalKeyHandler = (e) => {
        if (e.key !== 'Escape') return;
        e.preventDefault();
        e.stopPropagation();
        projCloseModal();
    };
    document.addEventListener('keydown', projModalKeyHandler, true);
    return overlay;
}

/**
 * The heading a cell's window wears: what the window is for, then which cell.
 *
 * What it is comes first, because that is the part that is the same every time and
 * so the part a reader skips to recognise the window — a note window headed with the
 * column name read as though the column were the subject, and every note on one row
 * then looked like it was labelled with the task.
 */
function projModalHeading(data, row, kind, colId) {
    const col = projColumn(data, colId);
    const where = projCell(row, 'item') || 'Untitled';
    // The column is named when it is not the window's own name — a column somebody
    // renamed to "Jira" is worth saying. A window for several of what the column
    // holds one of is the same word, not another one: Tickets — … · Ticket reads as
    // a stutter.
    const named = col && col.title !== kind && col.title + 's' !== kind;
    return kind + ' \u2014 ' + where + (named ? ' \u00B7 ' + col.title : '');
}

function projOpenNote(btn) {
    const toolId = projToolId(btn);
    if (!toolId) return;
    const rowId = btn.getAttribute('data-row');
    const colId = btn.getAttribute('data-col');
    const data = projGetData(toolId);
    const row = data.rows.find(r => r.id === rowId);
    if (!row) return;

    const overlay = projOpenModal(toolId, rowId, colId,
        projModalHeading(data, row, 'Notes', colId),
        '<textarea class="proj-modal-text" data-row="' + escapeHtml(rowId) + '" ' +
            'data-col="' + escapeHtml(colId) + '" oninput="projOnNoteInput(this)" ' +
            'placeholder="What this is, why it is here, what done looks like."></textarea>',
        'Saved as you type \u00B7 Esc closes');
    const text = overlay.querySelector('.proj-modal-text');
    text.value = projNote(row, colId);
    text.focus();
}

function projOnNoteInput(textarea) {
    const overlay = textarea.closest('.proj-modal');
    if (!overlay) return;
    const toolId = overlay.getAttribute('data-tool');
    const data = projGetData(toolId);
    const row = data.rows.find(r => r.id === textarea.getAttribute('data-row'));
    if (!row) return;
    if (!row.notes || typeof row.notes !== 'object') row.notes = {};
    row.notes[textarea.getAttribute('data-col')] = textarea.value;
    // Saved without redrawing the table under the window: the opener behind it is
    // about to change colour, and that can wait until the window closes.
    projSetData(toolId, data);
}

function projCloseModal() {
    if (projModalKeyHandler) {
        document.removeEventListener('keydown', projModalKeyHandler, true);
        projModalKeyHandler = null;
    }
    const overlay = document.querySelector('.proj-modal');
    if (!overlay) return;
    const toolId = overlay.getAttribute('data-tool');
    // A tickets window opens with a line already in it, so closing one without
    // typing would otherwise leave an empty ticket on the row. It shows as nothing
    // either way; this is so it is nothing in the file too.
    if (toolId && overlay.querySelector('.proj-ticket-rows')) {
        const data = projGetData(toolId);
        const tickets = projTicketListOf(data, overlay.getAttribute('data-row'),
            overlay.getAttribute('data-col'));
        if (tickets) {
            const kept = tickets.filter(t => String(t.id || '').trim() || String(t.type || '').trim());
            if (kept.length !== tickets.length) {
                tickets.length = 0;
                kept.forEach(t => tickets.push(t));
                projSetData(toolId, data);
            }
        }
    }
    overlay.remove();
    if (toolId) projOnRender(toolId);
}

/** Give a pinned date back to the plan. */
function projClearDate(btn) {
    const rowId = btn.getAttribute('data-row');
    const colId = btn.getAttribute('data-col');
    projMutate(btn, (data) => {
        const row = data.rows.find(r => r.id === rowId);
        if (row && row.cells) row.cells[colId] = '';
    });
}

/**
 * The Resources dropdown, and the way out of it.
 *
 * Picking a name is an ordinary cell edit. Picking "+ New…" is not a value at all —
 * it swaps the dropdown for a field, which saves what is typed and puts the dropdown
 * back with the new name in it, where every other row can now pick it too.
 */
function projOnResource(select) {
    const rowId = select.getAttribute('data-row');
    const colId = select.getAttribute('data-col');
    const toolId = projToolId(select);
    if (!toolId) return;
    if (!select.value) return;
    if (select.value !== PROJ_RES_NEW) {
        const picked = select.value;
        projMutate(select, (data) => {
            const row = data.rows.find(r => r.id === rowId);
            if (!row) return;
            const list = projResourcesOf(row, colId);
            if (list.indexOf(picked) < 0) list.push(picked);
            projSetResources(row, colId, list);
        });
        return;
    }
    const input = document.createElement('input');
    input.className = 'proj-cell-input proj-res-new';
    input.placeholder = 'Who or what';
    input.size = 10;
    let done = false;
    const finish = (keep) => {
        if (done) return;
        done = true;
        const widget = projWidget(input) || projWidget(select);
        const value = keep ? input.value.trim() : '';
        const data = projGetData(toolId);
        const row = data.rows.find(r => r.id === rowId);
        if (row && value) {
            const list = projResourcesOf(row, colId);
            if (list.indexOf(value) < 0) list.push(value);
            projSetResources(row, colId, list);
            projSetData(toolId, data);
        }
        if (widget) projRender(widget, toolId);
    };
    input.onblur = () => finish(true);
    input.onkeydown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
        if (e.key === 'Escape') { e.preventDefault(); finish(false); }
    };
    select.replaceWith(input);
    input.focus();
}

function projRemoveResource(btn) {
    const rowId = btn.getAttribute('data-row');
    const colId = btn.getAttribute('data-col');
    const name = btn.getAttribute('data-res');
    projMutate(btn, (data) => {
        const row = data.rows.find(r => r.id === rowId);
        if (!row) return;
        projSetResources(row, colId, projResourcesOf(row, colId).filter(r => r !== name));
    });
}

/**
 * Show the dropdown the + stands for.
 *
 * `showPicker()` opens it where the browser has it; where it does not, the select is
 * focused and visible, which is one click rather than none. Either way the + is gone,
 * so what is on screen is the thing being chosen from.
 */
function projRevealPicker(btn) {
    const picker = btn.parentNode ? btn.parentNode.querySelector('.proj-pick') : null;
    if (!picker) return;
    btn.hidden = true;
    picker.hidden = false;
    picker.focus();
    try { picker.showPicker(); } catch (e) { /* older browsers open it on click */ }
}

function projOnCell(input) {
    const rowId = input.getAttribute('data-row');
    const colId = input.getAttribute('data-col');
    const toolId = projToolId(input);
    const widget = projWidget(input);
    if (!toolId || !widget) return;
    const data = projGetData(toolId);
    const row = data.rows.find(r => r.id === rowId);
    if (!row) return;
    row.cells = row.cells || {};
    row.cells[colId] = input.value;
    projGrowField(input);
    projSetData(toolId, data);
    // A select has no caret to lose, and changing a size has to repaint its chip.
    if (input.tagName === 'SELECT') projRender(widget, toolId);
    else projUpdateDerived(widget, data);
}

/** Swap the heading for a field, and swap it back when the typing is done. */
function projEditColumnTitle(span) {
    const colId = span.getAttribute('data-col');
    const toolId = projToolId(span);
    if (!toolId) return;
    const input = document.createElement('input');
    input.className = 'proj-col-title-edit';
    input.setAttribute('data-col', colId);
    input.value = (projColumn(projGetData(toolId), colId) || {}).title || '';
    input.size = projFieldSize(input.value, 4, 16);
    input.oninput = () => projOnColumnTitle(input);
    const done = () => { const w = projWidget(input); if (w) projRender(w, toolId); };
    input.onblur = done;
    input.onkeydown = (e) => { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); input.blur(); } };
    span.replaceWith(input);
    input.focus();
    input.select();
}

function projOnColumnTitle(input) {
    const colId = input.getAttribute('data-col');
    const value = input.value;
    const toolId = projToolId(input);
    if (!toolId) return;
    // Saved without re-rendering: rebuilding the table under a header being typed
    // into would take the caret with it.
    const data = projGetData(toolId);
    const col = projColumn(data, colId);
    if (col) { col.title = value; projSetData(toolId, data); }
}

function projOnColumnType(select) {
    const colId = select.getAttribute('data-col');
    const value = select.value;
    projMutate(select, (data) => {
        const col = projColumn(data, colId);
        if (col) col.type = value;
    });
}

function projAddColumn(btn) {
    projMutate(btn, (data) => {
        data.columns.push({ id: projNewId('c'), title: 'Column ' + (data.columns.length + 1), type: 'text' });
    });
}

function projDeleteColumn(btn) {
    const colId = btn.getAttribute('data-col');
    projMutate(btn, (data) => {
        data.columns = data.columns.filter(c => c.id !== colId);
        // The values stay on the rows. Deleting a column you did not mean to is
        // otherwise a way to lose a day's typing, and putting it back shows what
        // was always there. A calculation reads the cell rather than the column,
        // so Total Days goes on answering with the size column hidden — which is
        // the behaviour worth having, and the reason this is not a cleanup.
    });
}

function projAddRow(btn) {
    projMutate(btn, (data) => {
        data.rows.push({ id: projNewId('r'), cells: { item: '', size: '', pct: 0, deps: [], links: [] } });
    });
}

/** Make this row a sub-item of the nearest top-level row above it. */
/**
 * The row this one would go under if it were indented, or null where it could not
 * be. Asked by the renderer, to decide whether to offer the button, and by the press
 * itself — one answer, so what the button offers and what it does cannot drift.
 */
function projIndentTarget(data, ordered, index) {
    const row = ordered[index];
    if (!row || index < 1) return null;
    const depth = projRowDepth(data, row);
    // Everything under it comes along, so the whole subtree has to fit.
    if (depth + 1 + projSubtreeDepth(data, row.id) > PROJ_MAX_DEPTH) return null;
    for (let i = index - 1; i >= 0; i--) {
        const above = ordered[i];
        const aboveDepth = projRowDepth(data, above);
        if (aboveDepth === depth) return above.id === row.id ? null : above;
        // Something shallower came first, so there is no sibling above to join.
        if (aboveDepth < depth) return null;
    }
    return null;
}

/**
 * Make this row a child of the row above it at its own level.
 *
 * The one above *at its own level* rather than simply the one above: indenting a
 * sub-task should not jump it under another sub-task, and the row it joins is the
 * one somebody can see it lining up with.
 *
 * Refused where it would push the row, or anything under it, past the third level —
 * silently, because the button is the only thing that could say so and a button that
 * sometimes explains itself is worse than one that simply does nothing at the edge.
 */
function projIndentRow(btn) {
    const rowId = btn.getAttribute('data-row');
    projMutate(btn, (data) => {
        const ordered = projOrderedRows(data);
        const at = ordered.findIndex(r => r.id === rowId);
        const parent = projIndentTarget(data, ordered, at);
        if (!parent) return;
        const row = data.rows.find(r => r.id === rowId);
        if (row) row.parent = parent.id;
    });
}

/** Out one level, to sit beside what it used to sit under — not all the way out,
 *  which would take a sub-task past its task in one press. */
function projOutdentRow(btn) {
    const rowId = btn.getAttribute('data-row');
    projMutate(btn, (data) => {
        const row = data.rows.find(r => r.id === rowId);
        if (!row || !row.parent) return;
        const parent = data.rows.find(r => r.id === row.parent);
        if (parent && parent.parent) row.parent = parent.parent;
        else delete row.parent;
    });
}

function projDeleteRow(btn) {
    const rowId = btn.getAttribute('data-row');
    projMutate(btn, (data) => {
        // Sub-items are promoted rather than deleted with their parent: they are
        // rows somebody typed, and losing several of them to one × is not a thing
        // to find out about afterwards. They move up one level, to whatever the
        // deleted row hung from — a sub-task whose task goes becomes a task, not
        // suddenly a project of its own.
        const gone = data.rows.find(r => r.id === rowId);
        const grandparent = gone ? gone.parent : null;
        data.rows.forEach(r => {
            if (r.parent !== rowId) return;
            if (grandparent) r.parent = grandparent;
            else delete r.parent;
        });
        data.rows = data.rows.filter(r => r.id !== rowId);
        // And nothing is left depending on a row that no longer exists.
        data.rows.forEach(r => {
            const deps = projCell(r, 'deps');
            if (Array.isArray(deps)) r.cells.deps = deps.filter(d => d !== rowId);
        });
    });
}

function projAddDep(select) {
    const rowId = select.getAttribute('data-row');
    const depId = select.value;
    if (!depId) return;
    projMutate(select, (data) => {
        const row = data.rows.find(r => r.id === rowId);
        if (!row) return;
        row.cells = row.cells || {};
        const deps = Array.isArray(row.cells.deps) ? row.cells.deps : [];
        if (!deps.includes(depId)) deps.push(depId);
        row.cells.deps = deps;
    });
}

function projRemoveDep(btn) {
    const rowId = btn.getAttribute('data-row');
    const depId = btn.getAttribute('data-dep');
    projMutate(btn, (data) => {
        const row = data.rows.find(r => r.id === rowId);
        if (!row || !Array.isArray(row.cells.deps)) return;
        row.cells.deps = row.cells.deps.filter(d => d !== depId);
    });
}

function projLinksOf(data, rowId, colId) {
    const row = data.rows.find(r => r.id === rowId);
    if (!row) return null;
    row.cells = row.cells || {};
    if (!Array.isArray(row.cells[colId])) row.cells[colId] = [];
    return row.cells[colId];
}



/**
 * The links window: a label and an address per line, with room for both.
 *
 * The rows are redrawn as they are added and removed but never while one is being
 * typed into — the same rule the table follows, for the same reason.
 */
function projOpenLinks(btn) {
    const toolId = projToolId(btn);
    if (!toolId) return;
    const rowId = btn.getAttribute('data-row');
    const colId = btn.getAttribute('data-col');
    const data = projGetData(toolId);
    const row = data.rows.find(r => r.id === rowId);
    if (!row) return;

    const overlay = projOpenModal(toolId, rowId, colId,
        projModalHeading(data, row, 'Links', colId),
        '<div class="proj-link-rows"></div>' +
        '<button class="proj-btn proj-link-add" onclick="projAddLinkRow(this)">+ Add a link</button>',
        'Saved as you type \u00B7 Esc closes');
    projRenderLinkRows(overlay);
    const first = overlay.querySelector('.proj-modal-link input');
    if (first) first.focus();
    else overlay.querySelector('.proj-link-add').focus();
}

function projRenderLinkRows(overlay) {
    const list = overlay.querySelector('.proj-link-rows');
    if (!list) return;
    const toolId = overlay.getAttribute('data-tool');
    const rowId = overlay.getAttribute('data-row');
    const colId = overlay.getAttribute('data-col');
    const links = projLinksOf(projGetData(toolId), rowId, colId) || [];
    list.innerHTML = links.length
        ? links.map((link, i) => {
            const href = projSafeUrl(link.url);
            return '<div class="proj-modal-link" data-link="' + i + '">' +
                '<input class="proj-modal-label" data-link="' + i + '" data-part="label" ' +
                    'placeholder="What it is" oninput="projOnModalLink(this)" value="' +
                    escapeHtml(String(link.label || '')) + '">' +
                '<input class="proj-modal-url" data-link="' + i + '" data-part="url" ' +
                    'placeholder="https://" spellcheck="false" oninput="projOnModalLink(this)" value="' +
                    escapeHtml(String(link.url || '')) + '">' +
                (href ? '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener" ' +
                    'title="Open in a new tab">\u2197</a>'
                    : '<span class="proj-modal-nolink" title="' +
                        (String(link.url || '').trim() ? 'Not a web address' : 'No address yet') +
                        '">\u2197</span>') +
                '<button class="proj-x" data-link="' + i + '" onclick="projRemoveLinkRow(this)" ' +
                    'title="Remove this link">\u00D7</button>' +
            '</div>';
        }).join('')
        : '<div class="proj-empty">No links yet.</div>';
}

function projOnModalLink(input) {
    const overlay = input.closest('.proj-modal');
    if (!overlay) return;
    const toolId = overlay.getAttribute('data-tool');
    const data = projGetData(toolId);
    const links = projLinksOf(data, overlay.getAttribute('data-row'), overlay.getAttribute('data-col'));
    const index = Number(input.getAttribute('data-link'));
    if (!links || !links[index]) return;
    links[index][input.getAttribute('data-part')] = input.value;
    // Saved without redrawing the rows: the caret is in one of them. The arrow beside
    // it is the one thing that has to keep up, so it is moved by hand.
    projSetData(toolId, data);
    const line = input.closest('.proj-modal-link');
    const href = projSafeUrl(links[index].url);
    const arrow = line ? line.querySelector('a, .proj-modal-nolink') : null;
    if (arrow) {
        const next = document.createElement(href ? 'a' : 'span');
        next.textContent = '\u2197';
        if (href) {
            next.href = href;
            next.target = '_blank';
            next.rel = 'noopener';
            next.title = 'Open in a new tab';
        } else {
            next.className = 'proj-modal-nolink';
            next.title = String(links[index].url || '').trim() ? 'Not a web address' : 'No address yet';
        }
        arrow.replaceWith(next);
    }
}

function projAddLinkRow(btn) {
    const overlay = btn.closest('.proj-modal');
    if (!overlay) return;
    const toolId = overlay.getAttribute('data-tool');
    const data = projGetData(toolId);
    const links = projLinksOf(data, overlay.getAttribute('data-row'), overlay.getAttribute('data-col'));
    if (!links) return;
    links.push({ label: '', url: '' });
    projSetData(toolId, data);
    projRenderLinkRows(overlay);
    const rows = overlay.querySelectorAll('.proj-modal-link');
    const last = rows[rows.length - 1];
    if (last) last.querySelector('input').focus();
}

/**
 * The tickets window: a number and a type per line, with room for both.
 *
 * The same window as links, for the same reason — a cell this narrow cannot hold two
 * fields and a cross, and a row can have more than one ticket. The types already in
 * the plan are offered as you type: a plan where half the rows say "Bug" and half say
 * "bug" is two types that are one, and nobody notices until they are filtering.
 *
 * Opened with nothing on the row, it starts a line rather than showing an empty
 * window: clicking + on an empty cell means "I want to add one".
 */
function projOpenTickets(btn) {
    const toolId = projToolId(btn);
    if (!toolId) return;
    const rowId = btn.getAttribute('data-row');
    const colId = btn.getAttribute('data-col');
    const data = projGetData(toolId);
    const row = data.rows.find(r => r.id === rowId);
    if (!row) return;

    const overlay = projOpenModal(toolId, rowId, colId,
        projModalHeading(data, row, 'Tickets', colId),
        '<div class="proj-ticket-rows"></div>' +
        '<datalist id="proj-ticket-types"></datalist>' +
        '<button class="proj-btn proj-ticket-add" onclick="projAddTicketRow(this)">+ Add a ticket</button>',
        'Saved as you type \u00B7 Esc closes');
    if (!projTicketsOf(row, colId).length) projAddTicketRow(overlay.querySelector('.proj-ticket-add'));
    else projRenderTicketRows(overlay);
    const first = overlay.querySelector('.proj-modal-ticket input');
    if (first) first.focus();
    else overlay.querySelector('.proj-ticket-add').focus();
}

function projRenderTicketRows(overlay) {
    const list = overlay.querySelector('.proj-ticket-rows');
    if (!list) return;
    const toolId = overlay.getAttribute('data-tool');
    const colId = overlay.getAttribute('data-col');
    const data = projGetData(toolId);
    const tickets = projTicketListOf(data, overlay.getAttribute('data-row'), colId) || [];
    const types = overlay.querySelector('#proj-ticket-types');
    if (types) {
        types.innerHTML = projTicketTypes(data, colId)
            .map(t => '<option value="' + escapeHtml(t) + '"></option>').join('');
    }
    list.innerHTML = tickets.length
        ? tickets.map((t, i) => {
            const url = projTicketUrl(data, t.id, t.type);
            return '<div class="proj-modal-ticket" data-ticket="' + i + '">' +
                '<input class="proj-modal-num" data-ticket="' + i + '" data-part="id" ' +
                    'placeholder="ABC-123" spellcheck="false" oninput="projOnModalTicket(this)" value="' +
                    escapeHtml(String(t.id || '')) + '">' +
                '<input class="proj-modal-type" data-ticket="' + i + '" data-part="type" ' +
                    'list="proj-ticket-types" placeholder="Type (optional)" ' +
                    'oninput="projOnModalTicket(this)" value="' +
                    escapeHtml(String(t.type || '')) + '">' +
                (url ? '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener" ' +
                    'title="Open in a new tab">\u2197</a>'
                    : '<span class="proj-modal-nolink" title="' +
                        (String(t.id || '').trim() ? 'No ticket address set for this board'
                            : 'No number yet') + '">\u2197</span>') +
                '<button class="proj-x" data-ticket="' + i + '" onclick="projRemoveTicketRow(this)" ' +
                    'title="Remove this ticket">\u00D7</button>' +
            '</div>';
        }).join('')
        : '<div class="proj-empty">No tickets yet.</div>';
}

function projOnModalTicket(input) {
    const overlay = input.closest('.proj-modal');
    if (!overlay) return;
    const toolId = overlay.getAttribute('data-tool');
    const data = projGetData(toolId);
    const tickets = projTicketListOf(data, overlay.getAttribute('data-row'),
        overlay.getAttribute('data-col'));
    const index = Number(input.getAttribute('data-ticket'));
    if (!tickets || !tickets[index]) return;
    tickets[index][input.getAttribute('data-part')] = input.value;
    // Saved without redrawing the rows: the caret is in one of them. The arrow beside
    // it is the one thing that has to keep up, so it is moved by hand — the same
    // bargain the links window makes.
    projSetData(toolId, data);
    const line = input.closest('.proj-modal-ticket');
    const arrow = line ? line.querySelector('a, .proj-modal-nolink') : null;
    if (arrow) {
        const url = projTicketUrl(data, tickets[index].id, tickets[index].type);
        const next = document.createElement(url ? 'a' : 'span');
        next.textContent = '\u2197';
        if (url) {
            next.className = '';
            next.href = url;
            next.target = '_blank';
            next.rel = 'noopener';
            next.title = 'Open in a new tab';
        } else {
            next.className = 'proj-modal-nolink';
            next.title = String(tickets[index].id || '').trim()
                ? 'No ticket address set for this board' : 'No number yet';
        }
        arrow.parentNode.replaceChild(next, arrow);
    }
    const widget = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    if (widget) projUpdateDerived(widget, data);
}

function projAddTicketRow(btn) {
    const overlay = btn.closest('.proj-modal');
    if (!overlay) return;
    const toolId = overlay.getAttribute('data-tool');
    const data = projGetData(toolId);
    const tickets = projTicketListOf(data, overlay.getAttribute('data-row'),
        overlay.getAttribute('data-col'));
    if (!tickets) return;
    tickets.push({ id: '', type: '' });
    projSetData(toolId, data);
    projRenderTicketRows(overlay);
    const rows = overlay.querySelectorAll('.proj-modal-ticket');
    const last = rows[rows.length - 1];
    if (last) last.querySelector('input').focus();
}

function projRemoveTicketRow(btn) {
    const overlay = btn.closest('.proj-modal');
    if (!overlay) return;
    const toolId = overlay.getAttribute('data-tool');
    const data = projGetData(toolId);
    const tickets = projTicketListOf(data, overlay.getAttribute('data-row'),
        overlay.getAttribute('data-col'));
    if (!tickets) return;
    tickets.splice(Number(btn.getAttribute('data-ticket')), 1);
    projSetData(toolId, data);
    projRenderTicketRows(overlay);
    const widget = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    if (widget) projUpdateDerived(widget, data);
}

function projRemoveLinkRow(btn) {
    const overlay = btn.closest('.proj-modal');
    if (!overlay) return;
    const toolId = overlay.getAttribute('data-tool');
    const data = projGetData(toolId);
    const links = projLinksOf(data, overlay.getAttribute('data-row'), overlay.getAttribute('data-col'));
    if (!links) return;
    links.splice(Number(btn.getAttribute('data-link')), 1);
    projSetData(toolId, data);
    projRenderLinkRows(overlay);
}


/** What the plan is called, which is what the board calls the tool. */
function projPlanTitle(toolId) {
    return String((toolCustomizations[toolId] || {}).title || '').trim() || 'Project';
}

/**
 * The Markdown window: the plan written out, with a switch for the dates.
 *
 * Read-only on purpose. It is generated from the table, so an edit made here would
 * be thrown away by the next keystroke anywhere in the plan — better to copy it and
 * edit it where it is going. The switch is kept with the plan rather than with this
 * browser: whoever opens the board next wants the summary the last person meant.
 */
function projOpenMarkdown(btn) {
    const toolId = projToolId(btn);
    if (!toolId) return;
    const data = projGetData(toolId);
    const show = projMdOptions(data);
    const switches = PROJ_MD_PARTS.map(part =>
        '<label class="proj-md-part" title="' + escapeHtml(part.hint) + '">' +
            '<input type="checkbox" data-part="' + part.id + '"' +
            (show[part.id] ? ' checked' : '') +
            ' onchange="projOnMarkdownPart(this)"> ' + escapeHtml(part.label) +
        '</label>').join('');
    const overlay = projOpenModal(toolId, '', '',
        'Markdown \u2014 ' + projPlanTitle(toolId),
        '<div class="proj-md-bar">' +
            '<span class="proj-md-label">Include</span>' + switches +
            '<button class="proj-btn proj-md-copy" onclick="projCopyMarkdown(this)">Copy</button>' +
        '</div>' +
        '<textarea class="proj-modal-text proj-md-text" spellcheck="false" readonly ' +
            'title="Written from the table \u2014 copy it and edit it where you paste it">' +
        '</textarea>',
        'Kept with the plan \u00B7 Esc closes');
    projFillMarkdown(overlay);
    // Focused so Ctrl+A is the whole document without reaching for the mouse, and
    // scrolled back afterwards: focusing a textarea is itself enough to move it.
    const text = overlay.querySelector('.proj-md-text');
    if (text) { text.focus(); text.setSelectionRange(0, 0); text.scrollTop = 0; }
}

function projFillMarkdown(overlay) {
    const toolId = overlay.getAttribute('data-tool');
    const text = overlay.querySelector('.proj-md-text');
    if (!text) return;
    const data = projGetData(toolId);
    text.value = projToMarkdown(data, { title: projPlanTitle(toolId), show: projMdOptions(data) });
    // Back to the top, or flipping the switch leaves you looking at the end of a
    // document you were reading the start of.
    text.scrollTop = 0;
}

/** One switch, kept with the plan. Every one of them is written, not only the one
 *  that moved: half a set of choices is how a later default silently changes an
 *  answer somebody already gave. */
function projOnMarkdownPart(input) {
    const overlay = input.closest('.proj-modal');
    if (!overlay) return;
    const toolId = overlay.getAttribute('data-tool');
    const data = projGetData(toolId);
    const show = projMdOptions(data);
    show[input.getAttribute('data-part')] = input.checked;
    data.mdShow = show;
    projSetData(toolId, data);
    projFillMarkdown(overlay);
}

function projCopyMarkdown(btn) {
    const overlay = btn.closest('.proj-modal');
    const text = overlay ? overlay.querySelector('.proj-md-text') : null;
    if (!text) return;
    if (typeof copyTextToClipboard === 'function') {
        copyTextToClipboard(text.value, 'Markdown copied');
        return;
    }
    text.select();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text.value);
}

/** Fold a column away, or unfold it. Kept with the plan: a board handed over folded
 *  is folded for whoever opens it, which is the point of folding it. */
function projToggleColumn(el) {
    const colId = el.getAttribute('data-col');
    projMutate(el, (data) => {
        const col = projColumn(data, colId);
        if (col) col.collapsed = !col.collapsed;
    });
}

// ---- column reorder -----------------------------------------------------------
// The same shape as the row drag below: module-level state, and the column is moved
// in the data rather than in the DOM, because the next render comes from the data
// either way. Dropping on a column puts the dragged one where that one was.

function projColDragStart(grip, event) {
    projDragState.colId = grip.getAttribute('data-col');
    const th = grip.closest('th');
    if (th) th.classList.add('proj-dragging');
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', projDragState.colId);
    }
}
function projColDragEnd(grip) {
    projDragState.colId = null;
    const th = grip.closest('th');
    if (th) th.classList.remove('proj-dragging');
}
function projColDragOver(th, event) {
    if (!projDragState.colId) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    th.classList.add('proj-drag-over');
}
function projColDragLeave(th) {
    th.classList.remove('proj-drag-over');
}
function projColDrop(th, event) {
    event.preventDefault();
    th.classList.remove('proj-drag-over');
    const fromId = projDragState.colId ||
        (event.dataTransfer ? event.dataTransfer.getData('text/plain') : null);
    const toId = th.getAttribute('data-col');
    projDragState.colId = null;
    if (!fromId || !toId || fromId === toId) return;
    projMutate(th, (data) => {
        const from = data.columns.findIndex(c => c.id === fromId);
        const to = data.columns.findIndex(c => c.id === toId);
        if (from < 0 || to < 0) return;
        const [moved] = data.columns.splice(from, 1);
        data.columns.splice(to, 0, moved);
    });
}

// ---- row reorder --------------------------------------------------------------
// Same shape as every other drag in this app: module-level state, and the row is
// moved in the data rather than in the DOM, because the next render comes from the
// data either way.

let projDragState = { rowId: null, colId: null };

function projRowDragStart(tr, event) {
    projDragState.rowId = tr.getAttribute('data-row');
    tr.classList.add('proj-dragging');
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', projDragState.rowId);
    }
}

function projRowDragOver(tr, event) {
    event.preventDefault();
    if (projDragState.rowId && tr.getAttribute('data-row') !== projDragState.rowId) {
        tr.classList.add('proj-drag-over');
    }
}

function projRowDragLeave(tr) {
    tr.classList.remove('proj-drag-over');
}

function projRowDragEnd(tr) {
    tr.classList.remove('proj-dragging');
    projDragState.rowId = null;
}

function projRowDrop(tr, event) {
    event.preventDefault();
    tr.classList.remove('proj-drag-over');
    const fromId = projDragState.rowId ||
        (event.dataTransfer ? event.dataTransfer.getData('text/plain') : null);
    const toId = tr.getAttribute('data-row');
    projDragState.rowId = null;
    if (!fromId || !toId || fromId === toId) return;
    projMutate(tr, (data) => {
        const from = data.rows.findIndex(r => r.id === fromId);
        const to = data.rows.findIndex(r => r.id === toId);
        if (from < 0 || to < 0) return;
        const [moved] = data.rows.splice(from, 1);
        data.rows.splice(to, 0, moved);
    });
}

// ============================================================
// Export support — the same IIFE every toolbox ends with, so a board exported as
// HTML carries working tools rather than inert markup.
// ============================================================
(function() {
    const functionsToExport = [
        projToolId, projWidget, projNewId, projToday, projParseDate, projFormatDate,
        projSeedData, projGetData, projSetData, projColumn, projCell,
        projFieldSize, projLongestLine, projNoteCols, projNoteRows,
        projGrowAttrs, projGrowField, projChildren, projIsParent, projOrderedRows,
        projSizeMenu,
        projRowDepth, projAncestry, projSubtreeDepth, projIndentTarget,
        projRowNumber, projRowTitle, projRowOwner, projDepLabel, projCopyTitle,
        projCsvRef, projCsvRefNumber, projRoundDays, projAssigneeCount,
        projTotalDays, projPercent, projRemainingDays, projIsDone,
        projSlackDays, projSlackBand,
        projUnits, projUnitDays, projSayDuration, projIsWorkday, projNthWorkdayOffset,
        projFinishOffset, projYearStart, projYearLabel, projCalendarDaysOf,
        projPeriodCalendarDays, projQuarterPlan, projPeriodSpans,
        projPeriodPath, projPeriodLabel, projPeriodShortLabel,
        projRenderUnits, projOnUnit, projOnAxis, projOnPeriodStart, projClearPeriodStart,
        projTicketUrl, projTicketsOf, projTicketTypes, projTicketListOf,
        projRenderTickets, projOnTicketBase,
        projOpenTickets, projRenderTicketRows, projOnModalTicket,
        projAddTicketRow, projRemoveTicketRow, projParseTickets, projCsvTicket,
        projWorkdayIndexAt, projPinnedIndex, projScheduleOf, projRowDates, projClearDate,
        projResourcesOf, projResourceList, projSetResources, projOnResource,
        projRemoveResource, projRevealPicker, projChipHtml, projPickerHtml,
        projKnownSize, projAddLateColumns, projToggleSettings, projRenderSettingsToggle,
        projNote, projNoteOpener, projOpenModal, projModalHeading, projOpenNote,
        projOnNoteInput, projCloseModal,
        projRolledSize, projSizeStep, projPercentStep, projSchedule,
        projInit, projOnRender, projRender, projAutoFit, projRefresh, projRenderSizes,
        projColumnHeadHtml, projCellHtml, projRenderTable, projTickStep, projRenderGantt,
        projMutate, projUpdateDerived, projOnSizeDays, projOnCell, projOnColumnTitle, projOnColumnType,
        projCsvField, projCsvParse, projCsvValue, projToCsv, projExportCsv, projPickCsv,
        projParseLinks, projFromCsv, projImportCsvFile,
        projMdQuote, projMdIndent, projMdFacts, projMdDates,
        projRowMarkdown, projToMarkdown, projPlanTitle,
        projMdOptions, projOpenMarkdown, projFillMarkdown, projOnMarkdownPart,
        projCopyMarkdown,
        projSafeUrl, projLinkHost, projOpenLinks, projRenderLinkRows, projOnModalLink,
        projAddLinkRow, projRemoveLinkRow,
        projEditColumnTitle, projAddColumn, projDeleteColumn, projAddRow, projDeleteRow,
        projIndentRow, projOutdentRow,
        projAddDep, projRemoveDep, projLinksOf,
        projToggleColumn, projColDragStart, projColDragEnd, projColDragOver,
        projColDragLeave, projColDrop,
        projRowDragStart, projRowDragOver, projRowDragLeave, projRowDragEnd, projRowDrop
    ];

    const code = '(function() {\n' +
        'if (typeof projGetData !== "undefined") return;\n' +
        'var projDragState = { rowId: null, colId: null };\n' +
        'window.PROJ_SIZE_ORDER = ' + JSON.stringify(PROJ_SIZE_ORDER) + ';\n' +
        'window.PROJ_SIZE_RAMP = ' + JSON.stringify(PROJ_SIZE_RAMP) + ';\n' +
        'window.PROJ_SIZE_MEANINGS = ' + JSON.stringify(PROJ_SIZE_MEANINGS) + ';\n' +
        'window.PROJ_LATE_COLUMNS = ' + JSON.stringify(PROJ_LATE_COLUMNS) + ';\n' +

        'window.PROJ_RES_NEW = ' + JSON.stringify(PROJ_RES_NEW) + ';\n' +
        'window.PROJ_CSV_NOTE_SUFFIX = ' + JSON.stringify(PROJ_CSV_NOTE_SUFFIX) + ';\n' +
        'window.projModalKeyHandler = null;\n' +
        'window.projSchedStamp = 0;\n' +
        'window.projSchedCache = null;\n' +
        'window.PROJ_DEFAULT_SIZES = ' + JSON.stringify(PROJ_DEFAULT_SIZES) + ';\n' +
        'window.PROJ_SIZE_STEPS = ' + JSON.stringify(PROJ_SIZE_STEPS) + ';\n' +
        'window.PROJ_SLACK_BANDS = ' + JSON.stringify(PROJ_SLACK_BANDS) + ';\n' +
        'window.PROJ_COLUMN_TYPES = ' + JSON.stringify(PROJ_COLUMN_TYPES) + ';\n' +
        'window.PROJ_COLUMN_HINTS = ' + JSON.stringify(PROJ_COLUMN_HINTS) + ';\n' +
        'window.PROJ_NOTE_ROWS = ' + JSON.stringify(PROJ_NOTE_ROWS) + ';\n' +
        'window.PROJ_BUILTIN_COLUMNS = ' + JSON.stringify(PROJ_BUILTIN_COLUMNS) + ';\n' +
        'window.PROJ_DAY = ' + JSON.stringify(PROJ_DAY) + ';\n' +
        'window.PROJ_MAX_WIDTH = ' + JSON.stringify(PROJ_MAX_WIDTH) + ';\n' +
        'window.PROJ_MIN_WIDTH = ' + JSON.stringify(PROJ_MIN_WIDTH) + ';\n' +
        'window.PROJ_WIDTH_CHROME = ' + JSON.stringify(PROJ_WIDTH_CHROME) + ';\n' +
        'window.PROJ_CSV_PARENT = ' + JSON.stringify(PROJ_CSV_PARENT) + ';\n' +
        'window.PROJ_MAX_DEPTH = ' + JSON.stringify(PROJ_MAX_DEPTH) + ';\n' +
        'window.PROJ_DEFAULT_UNITS = ' + JSON.stringify(PROJ_DEFAULT_UNITS) + ';\n' +
        'window.PROJ_UNIT_FIELDS = ' + JSON.stringify(PROJ_UNIT_FIELDS) + ';\n' +
        'window.PROJ_AXIS_MODES = ' + JSON.stringify(PROJ_AXIS_MODES) + ';\n' +
        'window.PROJ_PLANNING_MARK = ' + JSON.stringify(PROJ_PLANNING_MARK) + ';\n' +
        functionsToExport.map(fn => 'window.' + fn.name + ' = ' + fn.toString()).join(';\n') + ';\n' +
        '})();';
    const encoded = btoa(unescape(encodeURIComponent(code)));

    const script = document.createElement('script');
    script.id = 'project-tools-scripts';
    script.textContent = 'eval(decodeURIComponent(escape(atob("' + encoded + '"))))';
    (document.body || document.head).appendChild(script);
})();

console.log('Project Tools plugin loaded (1 tool)');
