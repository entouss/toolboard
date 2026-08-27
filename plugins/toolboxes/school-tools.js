// School Tools Toolbox Plugin
// Contains the Curriculum Explorer.
//
// The explorer reads a curriculum document — a catalog of courses with grade
// levels, semesters and prerequisites — and lets you lay those courses out over
// four years. Nothing about any particular school is baked in: departments,
// subjects, levels and graduation requirements all come from whatever document
// is loaded, and the built-in sample is invented.

(function() {
    if (document.getElementById('school-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'school-tools-styles';
    style.textContent = `
/* The widget fills the tool window, and its two panes scroll inside it. */
.tool-content:has(> .curr-widget) { display: flex; flex-direction: column; }
.curr-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; min-width: 0; font-size: 12px; color: var(--text-primary); }

.curr-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.curr-btn { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; padding: 3px 8px; font-size: 11px; cursor: pointer; }
.curr-btn:hover { background: var(--table-hover); }
.curr-btn.active { background: #3498db; border-color: #3498db; color: #fff; }
.curr-file { position: relative; overflow: hidden; display: inline-flex; }
.curr-file input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

/* ---- The source pane: paste, drop or pick a file ---- */
.curr-source { display: flex; flex-direction: column; gap: 6px; min-height: 0; min-width: 0; }
.curr-drop { border: 1px dashed var(--border-color); border-radius: 6px; padding: 8px; text-align: center; color: var(--text-secondary); font-size: 11px; }
.curr-drop.dragover { border-color: #3498db; color: var(--text-primary); }
.curr-doc { display: flex; flex-direction: column; gap: 6px; flex: 1; min-height: 0; }
.curr-source-actions { display: flex; gap: 6px; flex-wrap: wrap; flex: 0 0 auto; }
.curr-schema-pane { display: none; flex: 1; overflow: auto; min-height: 0; }
.curr-source.showing-schema .curr-doc { display: none; }
.curr-source.showing-schema .curr-schema-pane { display: block; }
.curr-json { flex: 1; min-height: 80px; resize: none; font-family: 'Monaco', 'Courier New', monospace; font-size: 11px; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); }
/* Outside the JSON pane on purpose: what the tool has to say about loading has to
   be readable in the explorer, which is the mode a link opens in. */
.curr-status { font-size: 11px; padding: 3px 0; white-space: pre-wrap; flex: 0 0 auto; }
.curr-status:empty { display: none; }
.curr-status.ok { color: #27ae60; }
.curr-status.err { color: #e74c3c; }
.curr-btn.armed { background: #e67e22; border-color: #e67e22; color: #fff; }

/* ---- The explorer: catalog on one side, plan on the other ---- */
.curr-explorer { display: flex; gap: 8px; flex: 1; min-height: 0; min-width: 0; }
.curr-catalog { flex: 0 0 40%; display: flex; flex-direction: column; min-width: 0; min-height: 0; border-right: 1px solid var(--border-light); padding-right: 8px; }
.curr-right { flex: 1 1 60%; display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.curr-empty { padding: 16px; color: var(--text-secondary); text-align: center; }

.curr-controls { display: flex; flex-direction: column; gap: 4px; padding-bottom: 6px; }
.curr-search-row { display: flex; gap: 4px; align-items: center; }
.curr-collapse { flex: 0 0 auto; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-secondary); border-radius: 4px; cursor: pointer; font-size: 11px; line-height: 1; padding: 4px 6px; }
.curr-collapse:hover { background: var(--table-hover); color: var(--text-primary); }
.curr-catalog.collapsed { flex: 0 0 26px; align-items: center; gap: 8px; padding: 2px 0 0; }
.curr-collapse-label { writing-mode: vertical-rl; font-size: 10px; color: var(--text-secondary); white-space: nowrap; }
.curr-search { width: 100%; padding: 4px 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 11px; }
.curr-filters { display: flex; gap: 4px; flex-wrap: wrap; }
.curr-filters select { flex: 1 1 auto; min-width: 74px; padding: 2px 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 10px; }
.curr-count { font-size: 10px; color: var(--text-secondary); display: flex; justify-content: space-between; align-items: center; gap: 6px; }
.curr-chip { background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 1px 7px; cursor: pointer; font-size: 10px; color: var(--text-secondary); }
.curr-chip.active { background: #3498db; border-color: #3498db; color: #fff; }

.curr-list { flex: 1; overflow-y: auto; min-height: 0; }
.curr-catalog-foot { flex: 0 0 auto; display: flex; padding-top: 6px; margin-top: 4px; border-top: 1px solid var(--border-light); }
.curr-catalog-foot .curr-btn { flex: 1; }
.curr-section-head { display: flex; align-items: center; gap: 4px; position: sticky; top: 0; background: var(--bg-secondary); padding: 4px 2px; font-weight: 600; font-size: 11px; border-bottom: 1px solid var(--border-light); z-index: 1; }
.curr-section-head .curr-caret { cursor: pointer; width: 12px; color: var(--text-secondary); }
.curr-section-title { flex: 1; cursor: pointer; }
.curr-sub-head { font-size: 10px; color: var(--text-secondary); padding: 4px 2px 2px 16px; text-transform: uppercase; letter-spacing: 0.04em; }
.curr-eye { border: none; background: none; cursor: pointer; font-size: 11px; opacity: 0.45; padding: 0 2px; color: var(--text-primary); }
.curr-eye:hover { opacity: 1; }

.curr-course { display: flex; align-items: center; gap: 5px; padding: 3px 4px 3px 16px; border-radius: 4px; cursor: grab; }
.curr-course:hover { background: var(--table-hover); }
.curr-course.selected { background: rgba(52, 152, 219, 0.18); }
.curr-course.hidden-row { opacity: 0.4; }
.curr-course.placed .curr-course-title { text-decoration: line-through; opacity: 0.65; }
.curr-course.met .curr-course-title { color: #27ae60; }
.curr-met { margin: 0 1px 0 0; cursor: pointer; flex: 0 0 auto; }
.curr-course-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.curr-code { font-family: 'Monaco', 'Courier New', monospace; font-size: 10px; color: var(--text-secondary); }
.curr-tag { font-size: 9px; border-radius: 3px; padding: 0 4px; border: 1px solid var(--border-color); color: var(--text-secondary); white-space: nowrap; }
.curr-tag.lvl-Honors { border-color: #8e44ad; color: #8e44ad; }
.curr-tag.lvl-AP { border-color: #c0392b; color: #c0392b; }
.curr-tag.lvl-Dual { border-color: #16a085; color: #16a085; }
.curr-tag.sem { border-color: #2980b9; color: #2980b9; }
.curr-add { border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); border-radius: 3px; font-size: 11px; line-height: 1; padding: 1px 5px; cursor: pointer; }
.curr-add:hover { background: #3498db; border-color: #3498db; color: #fff; }

/* ---- Tabs ---- */
.curr-tabs { display: flex; gap: 4px; padding-bottom: 6px; }
.curr-tab { flex: 1; padding: 3px 0; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-tertiary); color: var(--text-primary); font-size: 11px; cursor: pointer; }
.curr-tab.active { background: #3498db; border-color: #3498db; color: #fff; }
.curr-stab { flex: 1; padding: 3px 0; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-tertiary); color: var(--text-primary); font-size: 11px; cursor: pointer; }
.curr-stab.active { background: #3498db; border-color: #3498db; color: #fff; }
.curr-tab .curr-badge { font-size: 9px; }
.curr-pane { flex: 1; overflow: auto; min-height: 0; }

/* ---- The plan grid ---- */
.curr-grid-head { display: flex; gap: 4px; font-size: 10px; color: var(--text-secondary); padding: 0 0 3px 68px; }
.curr-grid-head span { text-align: center; }
.curr-head-sems { flex: 1; display: flex; gap: 4px; }
.curr-head-sems span { flex: 1; }
.curr-head-sum { flex: 0 0 80px; }
.curr-year { display: flex; gap: 4px; align-items: stretch; margin-bottom: 6px; }
.curr-year-head { flex: 0 0 64px; min-width: 0; font-size: 10px; color: var(--text-secondary); display: flex; flex-direction: column; justify-content: center; }
.curr-year-head b { font-size: 12px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.curr-terms { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.curr-sems { display: flex; gap: 4px; min-width: 0; }
.curr-sems .curr-cell { flex: 1 1 50%; min-width: 0; }
.curr-summer { flex: 0 0 80px; }
.curr-cell { border: 1px dashed var(--border-color); border-radius: 5px; padding: 3px; min-height: 34px; display: flex; flex-direction: column; gap: 3px; background: var(--bg-primary); }
.curr-cell.curr-fy { min-height: 26px; }
.curr-cell.drop-ok { border-color: #27ae60; border-style: solid; background: rgba(39, 174, 96, 0.08); }
.curr-cell.drop-bad { border-color: #e67e22; }
.curr-cell-label { font-size: 9px; color: var(--text-muted); }

.curr-card { display: flex; align-items: center; gap: 4px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-left-width: 3px; border-radius: 4px; padding: 2px 4px; cursor: pointer; }
.curr-card.selected { outline: 1px solid #3498db; }
.curr-card.has-error { border-left-color: #e74c3c; }
.curr-card.has-warning { border-left-color: #e67e22; }
.curr-card-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
.curr-card-x { border: none; background: none; color: var(--text-secondary); cursor: pointer; font-size: 12px; line-height: 1; padding: 0 2px; }
/* Where a dragged course would land, drawn on the card it is over. */
.curr-card.drop-before { box-shadow: 0 -2px 0 #3498db; }
.curr-card.drop-after { box-shadow: 0 2px 0 #3498db; }
.curr-card-move { border: none; background: none; color: var(--text-secondary); cursor: pointer; font-size: 8px; line-height: 1; padding: 0 1px; }
.curr-card-move:hover:not(:disabled) { color: #3498db; }
.curr-card-move:disabled { opacity: 0.25; cursor: default; }
.curr-card-x:hover { color: #e74c3c; }
.curr-badge { border-radius: 8px; padding: 0 5px; font-size: 10px; }
.curr-badge.err { background: #e74c3c; color: #fff; }
.curr-badge.warn { background: #e67e22; color: #fff; }
.curr-badge.note { background: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-color); }

.curr-totals { border-top: 1px solid var(--border-light); margin-top: 6px; padding-top: 6px; font-size: 11px; }
.curr-req { display: flex; align-items: center; gap: 6px; padding: 1px 0; }
.curr-req-name { flex: 0 0 40%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.curr-bar { flex: 1; height: 6px; border-radius: 3px; background: var(--bg-tertiary); overflow: hidden; }
.curr-bar i { display: block; height: 100%; background: #3498db; }
.curr-bar i.done { background: #27ae60; }
.curr-bar.none { background: transparent; }
.curr-req-num { flex: 0 0 88px; text-align: right; color: var(--text-secondary); font-size: 10px; white-space: nowrap; }
.curr-req.openable { cursor: pointer; }
.curr-req.openable:hover { background: var(--table-hover); }
.curr-req-caret { flex: 0 0 9px; color: var(--text-muted); font-size: 9px; }
.curr-req-courses { padding: 1px 0 4px 14px; }
.curr-req-course { display: flex; gap: 5px; align-items: baseline; font-size: 10px; color: var(--text-secondary); padding: 1px 2px; border-radius: 3px; cursor: pointer; }
.curr-req-course:hover { background: var(--table-hover); color: var(--text-primary); }
.curr-req-course.curr-req-off { opacity: 0.55; }
.curr-req.curr-note { position: relative; padding-left: 13px; margin-top: 2px; }
.curr-req.curr-note::before { content: '•'; position: absolute; left: 2px; top: 0; color: var(--text-muted); }
.curr-req-course:not([onclick]) { cursor: default; }
.curr-req-where { margin-left: auto; white-space: nowrap; opacity: 0.75; }

/* ---- Issues ---- */
.curr-issue { display: flex; gap: 6px; align-items: flex-start; padding: 4px 2px; border-bottom: 1px solid var(--border-light); cursor: pointer; }
.curr-issue:hover { background: var(--table-hover); }
.curr-issue-text { flex: 1; min-width: 0; }
.curr-issue-where { font-size: 10px; color: var(--text-secondary); }
.curr-clean { padding: 12px; text-align: center; color: #27ae60; }

/* ---- Prerequisite tree ---- */
.curr-grow { display: flex; gap: 6px; padding: 2px 0 6px 68px; }
.curr-grow .curr-btn:disabled { opacity: 0.45; cursor: default; }

/* The off-screen copy the picture is taken of: laid out at full height, so nothing
   is cut off at a scroll position. */
.curr-shot { position: fixed; left: -20000px; top: 0; width: 900px; padding: 16px;
    background: var(--bg-secondary); display: block; }
.curr-shot-head { font-size: 16px; font-weight: 600; color: var(--text-primary); }
.curr-shot-sub { font-size: 12px; color: var(--text-secondary); padding-bottom: 8px; }
.curr-shot-head + .curr-shot-sub { padding-top: 2px; }
.curr-shot-head:last-of-type { padding-bottom: 8px; }
.curr-shot .curr-cell { min-height: 30px; }

/* Off-screen, but the size of the paper: a frame with no width lays the document
   out at its minimum and the print is then scaled down to fit, which is what made
   the type tiny. 794x1123 is A4 at 96dpi. */
.curr-print-frame { position: fixed; left: -20000px; top: 0; width: 794px; height: 1123px; border: 0; }

.curr-schema { font-size: 11px; }
.curr-schema-read { border: 1px solid var(--border-light); border-radius: 5px; padding: 6px; margin-bottom: 6px; line-height: 1.5; }
.curr-schema-actions { display: flex; gap: 6px; padding-bottom: 6px; }
.curr-schema-table { width: 100%; border-collapse: collapse; }
.curr-schema-table td { border-top: 1px solid var(--border-light); padding: 3px 4px; vertical-align: top; }
.curr-schema-table tr.d1 .curr-schema-name { padding-left: 12px; }
.curr-schema-table tr.d2 .curr-schema-name { padding-left: 24px; }
.curr-schema-table tr.d3 .curr-schema-name { padding-left: 36px; }
.curr-schema-name { white-space: nowrap; font-family: 'Monaco', 'Courier New', monospace; font-size: 10px; }
.curr-schema-kind { color: var(--text-secondary); font-size: 10px; white-space: nowrap; }
.curr-schema-desc { color: var(--text-secondary); }

.curr-tree-bar { display: flex; align-items: center; gap: 6px; padding-bottom: 4px; font-size: 11px; }
.curr-tree-wrap { overflow: auto; }
.curr-node rect { fill: var(--bg-tertiary); stroke: var(--border-color); stroke-width: 1; }
.curr-node.root rect { stroke: #3498db; stroke-width: 2; }
.curr-node.placed rect { fill: rgba(39, 174, 96, 0.16); }
.curr-node text { fill: var(--text-primary); font-size: 11px; font-family: inherit; }
.curr-node text.sub { fill: var(--text-secondary); font-size: 9px; }
.curr-node { cursor: pointer; }
.curr-edge { stroke: var(--text-muted); stroke-width: 1.2; fill: none; }
.curr-edge.up { stroke: #3498db; }

/* ---- Details of the selected course ---- */
.curr-details { border-top: 1px solid var(--border-light); padding-top: 5px; font-size: 11px; max-height: 34%; overflow-y: auto; }
.curr-details h4 { margin: 0 0 3px; font-size: 12px; }
.curr-details p { margin: 2px 0; color: var(--text-secondary); }
.curr-details .curr-note { color: var(--text-secondary); font-size: 10px; }

/* Stacked layout when the tool is too narrow for two panes side by side. */
.curr-widget.narrow .curr-explorer { flex-direction: column; }
.curr-widget.narrow .curr-catalog.collapsed { flex: 0 0 auto; flex-direction: row; max-height: none; border-bottom: 1px solid var(--border-light); }
.curr-widget.narrow .curr-collapse-label { writing-mode: horizontal-tb; }
.curr-widget.narrow .curr-catalog { flex: 0 0 auto; max-height: 45%; border-right: none; border-bottom: 1px solid var(--border-light); padding-right: 0; padding-bottom: 6px; }

/* ---- Curriculum Doctor ---- */
.cdoc-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; min-width: 0; font-size: 12px; color: var(--text-primary); }
.cdoc-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.cdoc-source { display: flex; flex-direction: column; gap: 6px; min-height: 0; min-width: 0; }
.cdoc-source-actions { display: flex; gap: 6px; flex-wrap: wrap; flex: 0 0 auto; }
.cdoc-drop { border: 1px dashed var(--border-color); border-radius: 6px; padding: 8px; text-align: center; color: var(--text-secondary); font-size: 11px; }
.cdoc-drop.dragover { border-color: #3498db; color: var(--text-primary); }
.cdoc-json { flex: 1; min-height: 80px; resize: none; font-family: 'Monaco', 'Courier New', monospace; font-size: 11px; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); }
.cdoc-status { font-size: 11px; padding: 3px 0; white-space: pre-wrap; flex: 0 0 auto; }
.cdoc-status:empty { display: none; }
.cdoc-status.ok { color: #27ae60; }
.cdoc-status.err { color: #e74c3c; }
.cdoc-report { flex: 1; overflow: auto; min-height: 0; min-width: 0; }
.cdoc-empty { padding: 16px; color: var(--text-secondary); text-align: center; }
.cdoc-score { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 0 0 8px; border-bottom: 1px solid var(--border-light); margin-bottom: 8px; }
.cdoc-tally { font-size: 12px; }
.cdoc-tally b { font-size: 15px; }
.cdoc-tally.err b { color: #e74c3c; }
.cdoc-tally.warn b { color: #e67e22; }
.cdoc-tally.note b { color: var(--text-secondary); }
.cdoc-clean { color: #27ae60; font-weight: 600; }
.cdoc-group { border: 1px solid var(--border-light); border-radius: 5px; margin-bottom: 6px; overflow: hidden; }
.cdoc-group-head { display: flex; align-items: center; gap: 6px; padding: 5px 8px; cursor: pointer; background: var(--bg-tertiary); font-size: 11px; }
.cdoc-group-head:hover { background: var(--table-hover); }
.cdoc-group-head .cdoc-caret { width: 10px; color: var(--text-muted); font-size: 9px; }
.cdoc-group-head .cdoc-name { flex: 1; font-weight: 600; }
.cdoc-group-head .cdoc-count { color: var(--text-secondary); font-size: 10px; }
.cdoc-pill { flex: 0 0 auto; border-radius: 8px; padding: 0 6px; font-size: 9px; text-transform: uppercase; letter-spacing: .4px; }
.cdoc-pill.err { background: #e74c3c; color: #fff; }
.cdoc-pill.warn { background: #e67e22; color: #fff; }
.cdoc-pill.note { background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border-color); }
.cdoc-why { padding: 6px 8px; font-size: 10px; color: var(--text-secondary); border-bottom: 1px solid var(--border-light); }
.cdoc-item { padding: 5px 8px; border-bottom: 1px solid var(--border-light); font-size: 11px; }
.cdoc-item:last-child { border-bottom: 0; }
.cdoc-path { font-family: 'Monaco', 'Courier New', monospace; font-size: 9px; color: var(--text-muted); }
.cdoc-detail { font-size: 10px; color: var(--text-secondary); padding-left: 10px; }
.cdoc-detail b { color: var(--text-primary); font-weight: 600; }
.cdoc-table { width: 100%; border-collapse: collapse; font-size: 10px; }
.cdoc-table td { padding: 2px 6px; border-bottom: 1px solid var(--border-light); }
.cdoc-table td:last-child { text-align: right; color: var(--text-secondary); }
.cdoc-table tr.thin td:first-child { color: var(--text-muted); }
.cdoc-widget.narrow .cdoc-score { gap: 6px; }
`;
    document.head.appendChild(style);
})();

// =============================================
// TOOLBOX
// =============================================

PluginRegistry.registerToolbox({
    id: 'school-tools',
    name: 'School Tools',
    description: 'Tools for planning school work from a curriculum document',
    icon: '🎓',
    color: '#9b59b6',
    version: '1.0.0',
    tools: ['curriculum-explorer', 'curriculum-doctor'],
    source: 'external'
});

// =============================================
// CURRICULUM EXPLORER
// =============================================

// ---------------------------------------------------------------------------
// The shape of a plan is read from the document, not fixed here. A high school
// guide gives grades 9–12 with two semesters; a college catalog might give years
// 1–4 with Fall, Spring and a summer session; and neither has to say so
// explicitly — the levels come from the grade levels courses are open to, and the
// terms from the distinct ways courses say they are offered.
//
// A document may state it outright instead, under `planner` — see CURR_SCHEMA.
// ---------------------------------------------------------------------------

// The id under which a course covering a whole level is planned.
const CURR_VERSION = '1.2.0';

const CURR_SPAN = 'FY';

// Terms that sit outside the main run of a level — a summer session belongs to
// the year it follows rather than dividing it.
const CURR_OPTIONAL_TERM = /summer|intersession|winter session|bridge|j-?term|interim/i;

// A term that covers the whole level rather than dividing it.
const CURR_SPAN_TERM = /full[ -]?year|year[ -]?long|all year|both semesters|entire year/i;

// A term the course may take in any of the level's divisions — including the
// document saying outright that it does not know ("Not Specified").
const CURR_ANY_TERM = /^(one|any|either)\b|not specified|unspecified|n\/a|tbd/i;

// Short, stable ids for the terms a document is likely to name, so a plan built
// against one document still reads against the next version of it.
function currTermSlug(label) {
    const text = String(label || '').trim();
    if (CURR_SPAN_TERM.test(text)) return CURR_SPAN;
    let match = text.match(/^semester\s*(\d+)/i);
    if (match) return 'S' + match[1];
    match = text.match(/^quarter\s*(\d+)/i);
    if (match) return 'Q' + match[1];
    match = text.match(/^trimester\s*(\d+)/i);
    if (match) return 'T' + match[1];
    match = text.match(/^term\s*(\d+)/i);
    if (match) return 'TM' + match[1];
    if (/summer/i.test(text)) return 'SUM';
    if (/fall|autumn/i.test(text)) return 'FALL';
    if (/winter/i.test(text)) return 'WIN';
    if (/spring/i.test(text)) return 'SPR';
    return text.toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 6) || 'TM';
}

// Where a named term falls in a year, for documents that name seasons rather than
// numbering terms. Anything unrecognised keeps the order it was met in.
const CURR_SEASON_ORDER = { FALL: 1, WIN: 2, SPR: 3, SUM: 9 };

function currTermOrder(id, label, seen) {
    if (CURR_SEASON_ORDER[id]) return CURR_SEASON_ORDER[id];
    const number = String(label).match(/(\d+)/);
    if (number) return Number(number[1]);
    return 100 + seen;
}

function currTermKind(value) {
    const text = String(value || '');
    if (CURR_SPAN_TERM.test(text)) return 'span';
    if (CURR_ANY_TERM.test(text)) return 'any';
    return 'term';
}

// The levels and terms this document plans in, with anything the user has added.
function currPlanner(data) {
    const catalog = data.catalog || {};
    const hints = catalog.planner || {};
    const courses = currCourses(data);

    let levels = Array.isArray(hints.levels) && hints.levels.length
        ? hints.levels.slice()
        : [];
    if (!levels.length) {
        const seen = {};
        courses.forEach(function(course) {
            (course.grade_levels || []).forEach(function(level) {
                if (typeof level === 'number' && isFinite(level)) seen[level] = true;
            });
        });
        levels = Object.keys(seen).map(Number).sort(function(a, b) { return a - b; });
    }
    if (!levels.length) levels = [1, 2, 3, 4];
    // The plan can outrun the guide: not everyone finishes in the years it assumes.
    for (let i = 0; i < (data.extraLevels || 0); i++) {
        levels.push(levels[levels.length - 1] + 1);
    }

    let terms = [];
    if (Array.isArray(hints.terms) && hints.terms.length) {
        terms = hints.terms.map(function(term, i) {
            const label = typeof term === 'string' ? term : (term.label || term.id || ('Term ' + (i + 1)));
            const id = (typeof term === 'object' && term.id) ? String(term.id) : currTermSlug(label);
            const optional = typeof term === 'object' && term.optional !== undefined
                ? Boolean(term.optional) : CURR_OPTIONAL_TERM.test(label);
            return { id: id, label: label, optional: optional, order: i };
        });
    } else {
        const byId = {};
        courses.forEach(function(course) {
            const value = course.semester_offered;
            if (!value || currTermKind(value) !== 'term') return;
            const id = currTermSlug(value);
            if (byId[id]) return;
            byId[id] = {
                id: id, label: value,
                optional: CURR_OPTIONAL_TERM.test(value),
                order: currTermOrder(id, value, Object.keys(byId).length)
            };
        });
        terms = Object.keys(byId).map(function(id) { return byId[id]; });
        terms.sort(function(a, b) { return a.order - b.order; });
        // A course card can be nothing but year-long courses. Then there is no term
        // to divide the year into, and a column no course could sit in is clutter —
        // unless something is offered without saying when, which has to go somewhere.
        if (!terms.length) {
            const needsColumn = courses.some(function(course) {
                return !course.semester_offered || currTermKind(course.semester_offered) === 'any';
            });
            if (needsColumn) terms = [{ id: 'TM1', label: 'Term', optional: false, order: 0 }];
        }
    }

    // A term outside the main run sits after the ones inside it, whatever order the
    // document listed them in.
    const main = terms.filter(function(t) { return !t.optional; });
    const optional = terms.filter(function(t) { return t.optional; });
    terms = main.concat(optional);
    const spanOnly = !terms.length;

    const spanLabel = (courses.filter(function(c) { return currTermKind(c.semester_offered) === 'span'; })[0] || {})
        .semester_offered || 'Full year';

    return {
        levels: levels,
        terms: terms,
        // With no terms at all the span cell is the whole of a level.
        main: main.length ? main : (terms.length ? terms : [{ id: CURR_SPAN, label: 'Full year', optional: false, order: 0 }]),
        optional: optional,
        spanOnly: spanOnly,
        spanId: CURR_SPAN,
        spanLabel: spanLabel,
        levelLabel: hints.level_label || null,
        levelNames: hints.level_names || null
    };
}

// What a document calls one of its levels. "Grade 9" for a school guide, "Year 1"
// for a college one — or whatever the document says, if it says anything.
function currLevelLabel(planner, level) {
    if (planner.levelNames && planner.levelNames[level]) return String(planner.levelNames[level]);
    if (planner.levelLabel) return String(planner.levelLabel).replace('{n}', level);
    return (planner.levels.some(function(l) { return l >= 9; }) ? 'Grade ' : 'Year ') + level;
}

function currTermById(planner, id) {
    return planner.terms.filter(function(t) { return t.id === id; })[0] || null;
}

function currSlotLabel(planner, id) {
    if (id === planner.spanId) return planner.spanLabel;
    const term = currTermById(planner, id);
    return term ? term.label : id;
}

// Flags are a document's own vocabulary and keep growing — teacher approval,
// audition required, counts towards a diploma programme. Rather than a list of the
// ones we happen to know, the filter offers whichever flags this document sets,
// with names made from the keys.
const CURR_FLAG_NAMES = {
    has_lab: 'Lab science',
    ncaa_approved: 'NCAA approved',
    meets_practical_fine_arts: 'Practical/fine arts',
    meets_pe_requirement: 'Meets PE',
    dual_enrollment: 'Dual enrolment',
    ap_exam_required: 'Exam required',
    additional_fee: 'Has a fee',
    min_enrollment_10: 'Needs ten students',
    eoc_course: 'End-of-course exam'
};

function currFlagLabel(key) {
    if (CURR_FLAG_NAMES[key]) return CURR_FLAG_NAMES[key];
    const words = String(key).replace(/_/g, ' ').trim();
    return words.charAt(0).toUpperCase() + words.slice(1);
}

function currFlagsInUse(courses) {
    const seen = {};
    courses.forEach(function(course) {
        Object.keys(course.flags || {}).forEach(function(key) {
            if (course.flags[key]) seen[key] = (seen[key] || 0) + 1;
        });
    });
    return Object.keys(seen).sort(function(a, b) { return seen[b] - seen[a]; });
}

// A small invented catalog, so the tool is not a blank box before you have a file
// of your own. No real school, guide or course listing is involved.
function currSampleCourse(o) {
    return Object.assign({
        course_code: '0000', title: 'Untitled', department: 'Electives', subject_area: null,
        level: 'Standard', credits: 1.0, grade_levels: [9, 10, 11, 12],
        semester_offered: 'Full Year',
        prerequisites: { raw: null, min_gpa: null, courses: [], grade_requirements: [] },
        flags: {}, notes: [], description: '', is_elective: false,
        required_for_graduation: false
    }, o);
}

// What this tool reads, as a schema of its own. It is deliberately looser than any
// one guide's: a course needs a code and a title, and everything else is optional
// with a defined absence, so a college catalog and a school guide can both be
// planned without either shape being privileged. The Schema tab shows this.
const CURR_SCHEMA = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Curriculum Explorer document',
    description: 'What the Curriculum Explorer reads. Any other properties are kept and ignored, ' +
        'so a richer guide loses nothing by being loaded here.',
    type: 'object',
    required: ['courses'],
    properties: {
        courses: {
            type: 'array', minItems: 1,
            description: 'The catalog. One entry per course.',
            items: {
                type: 'object',
                required: ['course_code', 'title'],
                properties: {
                    course_code: { type: ['string', 'number'], description: 'Unique within the document. Shown on catalog rows and plan cards.' },
                    title: { type: 'string', description: 'What prerequisites name the course by.' },
                    department_canonical: { type: 'string', description: 'A normalised department, preferred for grouping and for matching a requirement of the same name.' },
                    department: { type: 'string', description: 'The heading as printed. Used when there is no canonical one, and shown beside it when there is. Absent: "Courses".' },
                    cross_credit: { type: 'object', description: 'Says outright that the course satisfies another subject: {counts_as: "Science"}. Counted towards that requirement as well as its own department.' },
                    program: { type: ['string', 'null'], description: 'A named pathway. Becomes a filter when any course has one.' },
                    title_variants: { type: 'array', items: { type: 'string' }, description: 'Other printed forms of the title. Prerequisites naming any of them resolve to this course.' },
                    credits_basis: { type: 'string', description: 'printed, inferred or unknown. Shown with the credit when it is not printed.' },
                    subject_area: { type: ['string', 'null'], description: 'A finer grouping inside a department, and a second name a requirement may match.' },
                    level: { type: 'string', description: 'Rigour tier, shown as a badge and filterable. Absent: "Standard".' },
                    credits: { type: 'number', description: 'Counted per level, in the totals, and towards requirements. Absent: 0.' },
                    grade_levels: {
                        type: 'array', items: { type: 'number' },
                        description: 'Levels the course is open to — grades 9-12, college years 1-4, whatever the document uses. ' +
                            'These become the rows of the grid. Absent: open to every level.'
                    },
                    semester_offered: {
                        type: 'string',
                        description: 'How the course is offered, in the document\'s own words. Distinct values become the columns of the grid: ' +
                            '"Semester 1", "Fall", "Quarter 3", "Trimester 2" all work. A value reading like a whole year ' +
                            '("Full Year", "Year-long") spans the level; one reading like a choice ("One Semester", "Any term") may sit in any ' +
                            'column; a summer or intersession term sits after the year rather than inside it. Absent: any column.'
                    },
                    prerequisites: {
                        type: 'object',
                        description: 'What must come first. Drives the tree and the ordering rules.',
                        properties: {
                            raw: { type: ['string', 'null'], description: 'The requirement as printed. Quoted back in messages, and a line containing " or " softens a missing prerequisite to a warning.' },
                            courses: { type: 'array', items: { type: 'string' }, description: 'Prerequisite courses by title. Matched case- and punctuation-insensitively, then by unique prefix.' },
                            choice: { type: 'boolean', description: 'Optional. True when the listed courses are alternatives and any one of them will do. One that is met settles the line; where none is, a single warning names the choice. Absent: every listed course is required.' },
                            min_gpa: { type: ['number', 'null'], description: 'Carried as a note; no plan can verify it.' },
                            grade_requirements: { type: 'array', items: { type: 'string' }, description: 'Carried as notes.' }
                        }
                    },
                    flags: {
                        type: 'object',
                        description: 'Booleans, open-ended: whichever a document sets become filters, named from their keys. ' +
                            'meets_practical_fine_arts and meets_pe_requirement additionally count the course towards those requirements.',
                        additionalProperties: { type: 'boolean' }
                    },
                    is_elective: { type: 'boolean', description: 'Also counts towards a requirement whose name reads like electives.' },
                    required_for_graduation: { type: 'boolean', description: 'Listed as missing until planned or ticked off.' },
                    notes: { type: 'array', items: { type: 'string' }, description: 'Shown with the course details.' },
                    description: { type: 'string', description: 'Shown with the details, and searched.' }
                }
            }
        },
        graduation_requirements: {
            type: 'object',
            description: 'What the plan is measured against.',
            properties: {
                other_requirements: {
                    type: 'array', items: { type: 'string' },
                    description: 'Conditions that are not credits — service hours, testing. Listed under the totals as they are.'
                },
                credits_by_subject: {
                    type: 'array',
                    description: 'One row per requirement, each shown with a progress bar that opens to list the courses counted.',
                    items: {
                        type: 'object',
                        required: ['subject'],
                        properties: {
                            subject: { type: 'string', description: 'Matched against each course\'s department (canonical or printed), subject area, cross credit, elective status and satisfying flags.' },
                            credits_required: { type: 'number' },
                            notes: { type: ['string', 'null'] }
                        }
                    }
                }
            }
        },
        program_groupings: {
            type: 'array',
            description: 'Optional. Diploma or pathway groups, shown under the requirements and counted in courses rather than credits.',
            items: { type: 'object', properties: {
                name: { type: 'string' },
                groups: { type: 'array', items: { type: 'object', properties: {
                    name: { type: 'string' },
                    courses: { type: 'array', items: { type: 'string' } },
                    required_course: { type: 'boolean' },
                    min_courses: { type: 'number', description: 'Optional. How many of the group are needed. Absent: the row shows what is taken of what is offered, and draws no progress bar, since nothing states what progress would be towards.' }
                } } }
            } }
        },
        practical_fine_arts_index: {
            type: 'object',
            description: 'Optional. A list of course titles that satisfy an arts requirement, believed even where the per-course flag is absent.',
            properties: { meets_requirement: { type: 'array', items: { type: 'string' } } }
        },
        planner: {
            type: 'object',
            description: 'Optional. States the shape of the plan outright, where the courses do not imply it well enough.',
            properties: {
                levels: { type: 'array', items: { type: 'number' }, description: 'The rows, e.g. [9,10,11,12] or [1,2,3,4]. Absent: the levels courses are open to.' },
                level_label: { type: 'string', description: 'A template for row names, e.g. "Year {n}". Absent: "Grade n" when levels reach 9 or more, otherwise "Year n".' },
                level_names: { type: 'object', additionalProperties: { type: 'string' }, description: 'Row names one by one, e.g. {"9": "Freshman"}.' },
                terms: {
                    type: 'array',
                    description: 'The columns, in order. Strings, or objects with id, label and optional:true for a term that sits after the year (a summer session).',
                    items: { type: ['string', 'object'] }
                }
            }
        },
        school: { type: 'object', description: 'Optional. Carried through untouched.' },
        document: { type: 'object', description: 'Optional. The document\'s own title and academic year, where it gives them. Used to head the picture the PNG button saves.' },
        guide: { type: 'object', description: 'Optional. The earlier name for `document`. Either is read.' }
    }
};

const CURR_SAMPLE = {
    school: { name: 'Sample School' },
    guide: { title: 'Sample Curriculum', academic_year: '2026-2027' },
    graduation_requirements: {
        minimum_career_gpa: 2.0,
        credits_by_subject: [
            { subject: 'English', credits_required: 4 },
            { subject: 'Mathematics', credits_required: 4 },
            { subject: 'Science', credits_required: 3 },
            { subject: 'Electives', credits_required: 2 }
        ]
    },
    courses: [
        currSampleCourse({ course_code: '1001', title: 'Algebra I', department: 'Mathematics', grade_levels: [9], required_for_graduation: true, description: 'Linear equations and functions.' }),
        currSampleCourse({ course_code: '1002', title: 'Geometry', department: 'Mathematics', grade_levels: [9, 10, 11], description: 'Shapes, proofs and measurement.', prerequisites: { raw: 'Algebra I', min_gpa: null, courses: ['Algebra I'], grade_requirements: [] } }),
        currSampleCourse({ course_code: '1003', title: 'Algebra II', department: 'Mathematics', grade_levels: [10, 11, 12], description: 'Polynomials and logarithms.', prerequisites: { raw: 'Geometry', min_gpa: null, courses: ['Geometry'], grade_requirements: [] } }),
        currSampleCourse({ course_code: '1004', title: 'Pre-Calculus Honors', department: 'Mathematics', level: 'Honors', grade_levels: [11, 12], description: 'Trigonometry and analytic geometry.', prerequisites: { raw: 'Algebra II; 3.25 GPA', min_gpa: 3.25, courses: ['Algebra II'], grade_requirements: [] } }),
        currSampleCourse({ course_code: '2001', title: 'Biology', department: 'Science', grade_levels: [9, 10], flags: { has_lab: true }, description: 'Cells, genetics and ecology.' }),
        currSampleCourse({ course_code: '2002', title: 'Chemistry', department: 'Science', grade_levels: [10, 11, 12], flags: { has_lab: true }, description: 'Atoms and reactions.', prerequisites: { raw: 'Biology and Algebra I', min_gpa: null, courses: ['Biology', 'Algebra I'], grade_requirements: [] } }),
        currSampleCourse({ course_code: '3001', title: 'English 9', department: 'English', grade_levels: [9], required_for_graduation: true, description: 'Literature and composition.' }),
        currSampleCourse({ course_code: '3002', title: 'English 10', department: 'English', grade_levels: [10], required_for_graduation: true, description: 'World literature.', prerequisites: { raw: 'English 9', min_gpa: null, courses: ['English 9'], grade_requirements: [] } }),
        currSampleCourse({ course_code: '4001', title: 'Introduction to Programming', department: 'Electives', subject_area: 'Technology', credits: 0.5, semester_offered: 'Semester 1', is_elective: true, description: 'Variables, loops and functions.' }),
        currSampleCourse({ course_code: '4002', title: 'Web Development', department: 'Electives', subject_area: 'Technology', credits: 0.5, semester_offered: 'Semester 2', is_elective: true, description: 'Markup, styling and scripting.', prerequisites: { raw: 'Introduction to Programming', min_gpa: null, courses: ['Introduction to Programming'], grade_requirements: [] } }),
        currSampleCourse({ course_code: '4003', title: 'Digital Art', department: 'Electives', subject_area: 'Visual Arts', credits: 0.5, semester_offered: 'One Semester', is_elective: true, description: 'Raster and vector image making.' }),
        currSampleCourse({ course_code: '4004', title: 'Driver Education', department: 'Electives', credits: 0.5, semester_offered: 'Summer Only', grade_levels: [10, 11, 12], is_elective: true, description: 'Classroom and road instruction.' })
    ]
};

PluginRegistry.registerTool({
    id: 'curriculum-explorer',
    name: 'Curriculum Explorer',
    description: 'Explore a curriculum document and plan classes year by year against its prerequisites',
    icon: '📘',
    version: CURR_VERSION,
    toolbox: 'school-tools',
    tags: ['curriculum', 'school', 'course', 'planner', 'prerequisites', 'schedule', 'education'],
    title: 'Curriculum Explorer',
    content: `<div class="curr-widget">
<div class="curr-actions">
<button class="curr-btn" onclick="currExportPng(this)" title="Save the plan as a picture">PNG</button>
</div>
<div class="curr-status"></div>
<div class="authoring-split">
<div class="authoring-source curr-source">
<div class="curr-tabs">
<button class="curr-stab active" onclick="currSetSourceView(this, 'document')">Document</button>
<button class="curr-stab" onclick="currSetSourceView(this, 'schema')">Schema</button>
</div>
<div class="curr-doc">
<div class="curr-source-actions">
<button class="curr-btn" onclick="currLoadSource(this)" title="Read the JSON below into the explorer">Load</button>
<label class="curr-btn curr-file" title="Read a curriculum file">File<input type="file" accept=".json,application/json" onchange="currHandleFile(this)"></label>
<button class="curr-btn" onclick="currLoadSample(this)" title="Fill the box with a small invented catalog">Sample</button>
</div>
<div class="curr-drop" ondragover="currDragOver(event, this)" ondragleave="this.classList.remove('dragover')" ondrop="currDropFile(event, this)">Paste the curriculum JSON below, or drop a .json file here</div>
<textarea class="curr-json" spellcheck="false" oninput="currDraftChanged(this)" placeholder="{ &quot;courses&quot;: [ ... ] }"></textarea>
</div>
<div class="curr-schema-pane"></div>
</div>
<div class="authoring-resizer"></div>
<div class="authoring-result curr-explorer"></div>
</div>
</div>`,
    // The JSON is the source and the explorer is the result, so the tool joins the
    // authoring framework rather than inventing its own edit/view buttons. It opens
    // in Edit — a new one has no document yet, and Edit is where you put it — and
    // switches itself to View once a document loads.
    authoring: {
        modes: ['edit', 'split', 'render'],
        defaultMode: 'edit',
        source: '.curr-source',
        result: '.curr-explorer',
        actions: '.curr-actions',
        labels: { edit: 'JSON' },
        titles: { edit: 'The curriculum document', render: 'The catalog and the plan' },
        onRender: 'currOnRender'
    },
    // A link may name the document to open with — see currApplyHashParams.
    hashParams: 'currApplyHashParams',
    // The page written about this tool, opened from the ? in its header.
    guide: 'learn/tools/curriculum-explorer.html',
    contentType: 'html',
    onInit: 'currInit',
    defaultWidth: 900,
    defaultHeight: 620,
    source: 'external'
});

// =============================================
// INSTANCE PLUMBING
// =============================================

function currGetToolId(el) {
    const tool = el && el.closest ? el.closest('.tool') : null;
    return tool ? tool.getAttribute('data-tool') : null;
}

function currGetWidget(el) {
    return el && el.closest ? el.closest('.curr-widget') : null;
}

function currWidgetFor(toolId) {
    const tool = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    return tool ? tool.querySelector('.curr-widget') : null;
}

function currDefaults() {
    return {
        catalog: null,
        plan: {},
        // Courses taken before this plan begins — transferred in, taken at another
        // school, placed out of. They satisfy prerequisites without occupying a term.
        completed: [],
        hidden: { departments: [], subjects: [], courses: [] },
        ui: {
            tab: 'grid', search: '', department: '', level: '', grade: '', semester: '',
            flag: '', program: '', selected: null, treeRoot: null, showDependents: true,
            showHidden: false, onlyMet: false, catalogCollapsed: false, collapsed: [], openReqs: []
        }
    };
}

function currGetData(toolId) {
    const custom = toolCustomizations[toolId] || {};
    const data = custom.curriculum || {};
    const base = currDefaults();
    return {
        catalog: data.catalog || null,
        // Text typed into the JSON pane that has not been loaded yet.
        draft: data.draft || null,
        sourceUrl: data.sourceUrl || null,
        plan: data.plan || {},
        // Years added past the ones the document implies, for a plan that runs long.
        extraLevels: data.extraLevels || 0,
        completed: data.completed || [],
        hidden: Object.assign(base.hidden, data.hidden || {}),
        ui: Object.assign(base.ui, data.ui || {})
    };
}

// A curriculum document is large enough to fill the storage a board has, so a
// failed write is reported in the tool rather than thrown: the plan stays usable
// in memory even when it cannot be kept.
function currSaveData(toolId, data) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].curriculum = data;
    try {
        saveToolCustomizations(toolCustomizations);
        return true;
    } catch (e) {
        const widget = currWidgetFor(toolId);
        currSetStatus(widget, 'err', 'This document is too large for the space this board has left. ' +
            'It is loaded and usable, but it will not survive a reload.');
        return false;
    }
}

// A whole curriculum is serialised on every write, which is far too much work to
// do once per keystroke. The change is live in memory at once; the write follows.
let currSaveTimer = null;

// The doctor keeps a draft the same way, and needs a timer of its own.
let cdocDraftTimer = null;

function currSaveDataSoon(toolId, data) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].curriculum = data;
    clearTimeout(currSaveTimer);
    currSaveTimer = setTimeout(function() { currSaveData(toolId, data); }, 400);
}

function currSetStatus(widget, kind, message) {
    const status = widget && widget.querySelector('.curr-status');
    if (!status) return;
    status.className = 'curr-status' + (kind ? ' ' + kind : '');
    status.textContent = message || '';
}

// =============================================
// READING A DOCUMENT
// =============================================

// Only what a course cannot be planned without. Everything else the explorer reads
// is optional and has a sensible absence: a course with no grade levels is open to
// all of them, one with no term is offered in any, one with no credits counts zero.
// A college catalog should not have to answer a school guide's questions.
const CURR_REQUIRED_FIELDS = ['course_code', 'title'];

function currParse(text) {
    let doc;
    try {
        doc = JSON.parse(text);
    } catch (e) {
        return { ok: false, errors: ['That is not valid JSON: ' + e.message] };
    }
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
        return { ok: false, errors: ['The document should be a JSON object.'] };
    }
    if (!Array.isArray(doc.courses) || !doc.courses.length) {
        return { ok: false, errors: ['No courses: the document needs a "courses" array with at least one course.'] };
    }

    const errors = [];
    const seen = {};
    doc.courses.forEach(function(course, i) {
        if (!course || typeof course !== 'object') {
            errors.push('course ' + (i + 1) + ': not an object');
            return;
        }
        const where = 'course ' + (i + 1) + (course.course_code ? ' (' + course.course_code + ')' : '');
        CURR_REQUIRED_FIELDS.forEach(function(field) {
            if (course[field] === undefined || course[field] === null || course[field] === '') {
                errors.push(where + ': no ' + field);
            }
        });
        if (course.grade_levels !== undefined && course.grade_levels !== null &&
            !Array.isArray(course.grade_levels)) {
            errors.push(where + ': grade_levels should be an array of levels');
        }
        if (course.semester_offered !== undefined && course.semester_offered !== null &&
            typeof course.semester_offered !== 'string') {
            errors.push(where + ': semester_offered should be text naming a term');
        }
        if (course.course_code) {
            if (seen[course.course_code]) errors.push(where + ': course_code is used twice');
            seen[course.course_code] = true;
        }
    });

    if (errors.length) {
        return { ok: false, errors: errors.slice(0, 12), more: Math.max(0, errors.length - 12) };
    }
    return { ok: true, doc: currNormalizeDoc(doc) };
}

// Fill in what the explorer reads so the rest of the code can stop asking whether
// a field is there. The document is otherwise kept whole, so reopening the JSON
// pane shows what was loaded.
function currNormalizeDoc(doc) {
    doc.normalized_by_explorer = true;
    doc.courses = doc.courses.map(function(course) {
        const prereq = course.prerequisites || {};
        return Object.assign({}, course, {
            course_code: String(course.course_code),
            // Later documents normalise the department and keep the printed heading
            // beside it; earlier ones carry only the printed one. Group by whichever
            // is the more comparable, and keep the other as the finer name.
            department: course.department_canonical || course.department || 'Courses',
            department_printed: course.department_canonical ? (course.department || null) : null,
            level: course.level || 'Standard',
            semester_offered: course.semester_offered || null,
            subject_area: course.subject_area || null,
            credits: typeof course.credits === 'number' ? course.credits : parseFloat(course.credits) || 0,
            grade_levels: Array.isArray(course.grade_levels) ? course.grade_levels.map(Number) : [],
            notes: Array.isArray(course.notes) ? course.notes : [],
            flags: course.flags || {},
            description: course.description || '',
            prerequisites: {
                raw: prereq.raw || null,
                choice: prereq.choice === true,
                min_gpa: typeof prereq.min_gpa === 'number' ? prereq.min_gpa : null,
                courses: Array.isArray(prereq.courses) ? prereq.courses : [],
                grade_requirements: Array.isArray(prereq.grade_requirements) ? prereq.grade_requirements : []
            }
        });
    });
    return doc;
}

function currLoadDoc(widget, toolId, doc, note, sourceUrl) {
    const data = currGetData(toolId);
    data.catalog = doc;
    // Loaded: the draft has become the document.
    delete data.draft;
    // Remembered so that opening the same link again does not refetch, and so the
    // tool can say where its document came from.
    data.sourceUrl = sourceUrl || null;
    // A document replaces the one before it, so a plan built against the old
    // catalog would refer to courses that may no longer exist.
    const known = {};
    doc.courses.forEach(function(c) { known[c.course_code] = true; });
    const plan = {};
    Object.keys(data.plan).forEach(function(term) {
        const kept = (data.plan[term] || []).filter(function(code) { return known[code]; });
        if (kept.length) plan[term] = kept;
    });
    data.plan = plan;
    data.ui.selected = null;
    data.ui.treeRoot = null;
    currSaveData(toolId, data);
    currSetStatus(widget, 'ok', note || (doc.courses.length + ' courses loaded.'));
    currRender(widget);
    // The document is in; the explorer is what you want to look at now.
    if (typeof setToolMode === 'function') setToolMode(toolId, 'render');
}

// Loading a document replaces the one the plan was built against, so a button that
// would throw work away asks first: the second press within a few seconds does it.
const CURR_ARM_MS = 6000;
const currArmed = {};

function currDisarm(btn, id) {
    clearTimeout(currArmed[id]);
    delete currArmed[id];
    btn.classList.remove('armed');
    if (btn.getAttribute('data-label')) btn.textContent = btn.getAttribute('data-label');
}

function currNeedsConfirm(btn, key, message) {
    const id = (currGetToolId(btn) || '') + ':' + key;
    if (currArmed[id]) {
        currDisarm(btn, id);
        return false;
    }
    const widget = currGetWidget(btn);
    // Only ever remember the real label: arming an already-armed button would
    // otherwise save "Replace?" as the name to go back to.
    if (!btn.getAttribute('data-label')) btn.setAttribute('data-label', btn.textContent);
    btn.textContent = 'Replace?';
    btn.classList.add('armed');
    currSetStatus(widget, 'err', message);
    currArmed[id] = setTimeout(function() {
        currDisarm(btn, id);
        currSetStatus(widget, '', '');
    }, CURR_ARM_MS);
    return true;
}

// What would be lost if the document were replaced.
function currWorkInProgress(data) {
    return Object.keys(data.plan || {}).length + (data.completed || []).length;
}

function currEntries(n) {
    return n + (n === 1 ? ' entry' : ' entries');
}

function currLoadSource(btn) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    const text = widget.querySelector('.curr-json').value.trim();
    if (!text) {
        currSetStatus(widget, 'err', 'Nothing to load: paste a curriculum document first.');
        return;
    }
    const parsed = currParse(text);
    if (!parsed.ok) {
        currSetStatus(widget, 'err', parsed.errors.join('\n') +
            (parsed.more ? '\n…and ' + parsed.more + ' more' : ''));
        return;
    }

    const data = currGetData(toolId);
    // Pressing Load on the document already loaded looked like nothing happening,
    // because nothing did. Say so rather than reloading it over itself.
    if (data.catalog && JSON.stringify(data.catalog) === JSON.stringify(parsed.doc)) {
        currSetStatus(widget, 'ok', 'That is the document already loaded — ' +
            parsed.doc.courses.length + ' courses, unchanged.');
        return;
    }
    const work = currWorkInProgress(data);
    if (work && currNeedsConfirm(btn, 'load',
        'Loading this replaces the document your plan was built against, and ' +
        currEntries(work) + ' may not survive it. Press Load again to go ahead.')) return;

    currLoadDoc(widget, toolId, parsed.doc);
}

function currLoadSample(btn) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    const data = currGetData(toolId);
    // The sample is a stand-in for people who have no document yet. Anyone who has
    // one is not asking to throw it away with a stray click.
    if (data.catalog) {
        const work = currWorkInProgress(data);
        if (currNeedsConfirm(btn, 'sample', 'The sample would replace the document you have' +
            (work ? ', and the ' + currEntries(work) + ' in your plan with it' : '') +
            '. Press Sample again to go ahead.')) return;
    }
    const text = JSON.stringify(CURR_SAMPLE, null, 2);
    widget.querySelector('.curr-json').value = text;
    currLoadDoc(widget, toolId, currNormalizeDoc(JSON.parse(text)),
        CURR_SAMPLE.courses.length + ' sample courses loaded. Replace them with your own document when you have one.');
}

// A link can name the document to open:
//   #Board/tool/curriculum-explorer?curriculum=https://example.org/guide.json
// so a curriculum published at a public URL is one click away from a plan.
//
// The browser has to be able to fetch it, which means http(s) and a host that
// allows cross-origin reads. A page opened from disk (file://) cannot read files
// from disk at all — Chrome refuses fetch and XMLHttpRequest alike — so a link of
// that shape is answered with what to do instead, not a bare failure.
const CURR_MAX_BYTES = 8 * 1024 * 1024;

// Not every school publishes its guide somewhere that allows cross-origin reads.
// When a link cannot be fetched directly, it is tried again through the board's
// CORS proxy, which only answers the published site — a plain `let` so a test can
// point it somewhere else.
let CURR_CORS_PROXY = 'https://ics-proxy-esjyexqdtq-ue.a.run.app/?url=';

function currProxyUrl(url) {
    return CURR_CORS_PROXY + encodeURIComponent(url);
}

// Absolute http(s) links are the only ones the proxy can help with: a same-origin
// path that fails has a different problem, and the proxy would only hide it.
function currCanProxy(url) {
    return /^https?:\/\//i.test(url);
}

async function currApplyHashParams(toolId, params) {
    const url = params.curriculum || params.url || params.src;
    if (!url) return;
    const widget = currWidgetFor(toolId);
    if (!widget) return;
    const data = currGetData(toolId);
    // Already holding this document: opening the link again is not a reason to
    // fetch it a second time, or to disturb the plan built on it.
    if (data.catalog && data.sourceUrl === url) {
        currSetStatus(widget, 'ok', 'Loaded from ' + currDescribeSource(url));
        return;
    }
    await currLoadFromUrl(widget, toolId, url);
}

function currDescribeSource(url) {
    try { return new URL(url, window.location.href).host || url; } catch (e) { return url; }
}

function currCannotFetchLocally(url) {
    const isFilePage = window.location.protocol === 'file:';
    const looksLocal = /^file:/i.test(url) || (isFilePage && !/^https?:/i.test(url));
    return isFilePage && looksLocal;
}

async function currLoadFromUrl(widget, toolId, url) {
    if (currCannotFetchLocally(url)) {
        currSetStatus(widget, 'err', 'A page opened from disk cannot read files from disk — ' +
            'the browser forbids it. Use the File button to pick ' + url + ', ' +
            'or serve the page and the document over http.');
        return false;
    }

    currSetStatus(widget, '', 'Fetching the curriculum from ' + currDescribeSource(url) + '…');
    let response;
    let viaProxy = false;
    try {
        response = await fetch(url, { credentials: 'omit', redirect: 'follow' });
    } catch (e) {
        // The host would not be read from directly. That is what the proxy is for.
        if (!currCanProxy(url)) {
            currSetStatus(widget, 'err', 'Could not fetch ' + url + '. The host has to allow ' +
                'cross-origin requests, and the link has to be http or https.');
            return false;
        }
        currSetStatus(widget, '', currDescribeSource(url) +
            ' does not allow cross-origin reads. Trying again through the proxy…');
        try {
            response = await fetch(currProxyUrl(url), { credentials: 'omit', redirect: 'follow' });
            viaProxy = true;
        } catch (proxyError) {
            currSetStatus(widget, 'err', 'Could not fetch ' + url + ' directly or through the ' +
                'proxy. The host has to allow cross-origin requests, or the document has to be ' +
                'opened from the published site.');
            return false;
        }
    }
    if (!response.ok) {
        if (viaProxy && response.status === 403) {
            currSetStatus(widget, 'err', currDescribeSource(url) + ' does not allow cross-origin ' +
                'reads, and the proxy only serves the published site. Open this link there, or ' +
                'use the File button.');
            return false;
        }
        currSetStatus(widget, 'err', 'That link answered ' + response.status + ' ' +
            (response.statusText || '') + (viaProxy ? ' (through the proxy)' : '') + '.');
        return false;
    }

    const size = parseInt(response.headers.get('content-length') || '0', 10);
    if (size > CURR_MAX_BYTES) {
        currSetStatus(widget, 'err', 'That document is ' + Math.round(size / 1048576) +
            ' MB, past the ' + Math.round(CURR_MAX_BYTES / 1048576) + ' MB this tool will read.');
        return false;
    }

    const text = await response.text();
    if (text.length > CURR_MAX_BYTES) {
        currSetStatus(widget, 'err', 'That document is too large to read here.');
        return false;
    }

    const parsed = currParse(text);
    if (!parsed.ok) {
        currSetStatus(widget, 'err', 'What that link returned is not a curriculum:\n' +
            parsed.errors.join('\n') + (parsed.more ? '\n…and ' + parsed.more + ' more' : ''));
        return false;
    }

    const box = widget.querySelector('.curr-json');
    if (box) box.value = text;
    currLoadDoc(widget, toolId, parsed.doc,
        parsed.doc.courses.length + ' courses loaded from ' + currDescribeSource(url) +
        (viaProxy ? ', through the proxy.' : '.'), url);
    return true;
}

// An edit in the JSON pane is not the document yet — Load makes it so — but it is
// work, and work survives a reload. The draft is kept beside the catalog and
// dropped the moment it has been loaded or matches what is already loaded.
let currDraftTimer = null;

function currDraftChanged(box) {
    const widget = currGetWidget(box);
    const toolId = currGetToolId(box);
    if (!widget || !toolId) return;
    const text = box.value;
    clearTimeout(currDraftTimer);
    currDraftTimer = setTimeout(function() {
        const data = currGetData(toolId);
        const loaded = data.catalog ? JSON.stringify(data.catalog, null, 2) : '';
        if (text === loaded || !text.trim()) {
            if (!data.draft) return;
            delete data.draft;
            currSaveData(toolId, data);
            currSetStatus(widget, '', '');
            return;
        }
        data.draft = text;
        if (currSaveData(toolId, data)) {
            currSetStatus(widget, '', 'Edited — press Load to apply it. Kept for now, either way.');
        }
    }, 500);
}

function currHandleFile(input) {
    const file = input.files && input.files[0];
    input.value = '';
    if (file) currReadFile(currGetWidget(input), currGetToolId(input), file);
}

function currDragOver(e, el) {
    e.preventDefault();
    el.classList.add('dragover');
}

function currDropFile(e, el) {
    e.preventDefault();
    el.classList.remove('dragover');
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) currReadFile(currGetWidget(el), currGetToolId(el), file);
}

function currReadFile(widget, toolId, file) {
    if (!widget || !toolId) return;
    currSetStatus(widget, '', 'Reading ' + file.name + '…');
    const reader = new FileReader();
    reader.onload = function() {
        widget.querySelector('.curr-json').value = String(reader.result);
        currLoadSource(widget.querySelector('.curr-json'));
    };
    reader.onerror = function() { currSetStatus(widget, 'err', 'That file could not be read.'); };
    reader.readAsText(file);
}

// =============================================
// COURSES, TITLES AND TERMS
// =============================================

function currCourses(data) {
    return (data.catalog && data.catalog.courses) || [];
}

function currByCode(data) {
    const map = {};
    currCourses(data).forEach(function(c) { map[c.course_code] = c; });
    return map;
}

// Prerequisites are named by title rather than by code, so matching has to survive
// case, punctuation and the weight asterisks the guides print.
function currNormTitle(title) {
    return String(title || '')
        .toLowerCase()
        .replace(/\*+/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function currTitleIndex(data) {
    const index = {};
    currCourses(data).forEach(function(c) {
        // Sources print the same course differently; a prerequisite may name any of
        // the forms, so every one of them points back to the course.
        [c.title].concat(c.title_variants || []).forEach(function(title) {
            const key = currNormTitle(title);
            if (!key) return;
            if (!index[key]) index[key] = [];
            if (index[key].indexOf(c.course_code) === -1) index[key].push(c.course_code);
        });
    });
    return index;
}

// Exact match first; then a unique course whose title starts with what was named,
// which catches "Algebra II" against "Algebra II Honors". Anything else is left
// unresolved rather than guessed at.
function currResolveTitle(index, title) {
    const key = currNormTitle(title);
    if (!key) return null;
    if (index[key] && index[key].length === 1) return index[key][0];
    if (index[key]) return index[key][0];
    const starts = Object.keys(index).filter(function(k) { return k.indexOf(key + ' ') === 0; });
    if (starts.length === 1 && index[starts[0]].length === 1) return index[starts[0]][0];
    return null;
}

function currTermKey(level, slot) { return level + '-' + slot; }

function currTermParse(key) {
    const parts = String(key).split('-');
    return { level: parseInt(parts[0], 10), slot: parts[1] };
}

function currTermLabel(planner, key) {
    const t = currTermParse(key);
    return currLevelLabel(planner, t.level) + ' · ' + currSlotLabel(planner, t.slot);
}

// Terms in the order they are lived through, so "before" is a comparison. A course
// covering a whole level starts with its first main term and ends with its last,
// which leaves a summer session sitting after it rather than inside it.
function currTermPos(planner, key) {
    const t = currTermParse(key);
    const levelIndex = Math.max(0, planner.levels.indexOf(t.level));
    // A document of nothing but year-long courses divides its levels into no terms
    // at all. Each level is still a step of its own, so it is one slot wide, not none
    // — otherwise every level starts where the last one did and nothing is ever
    // before anything else.
    const width = planner.terms.length || 1;
    const base = levelIndex * width;
    const ids = planner.terms.map(function(term) { return term.id; });
    if (t.slot === planner.spanId) {
        if (!ids.length) return { start: base, end: base };
        const first = Math.max(0, ids.indexOf(planner.main[0].id));
        const last = ids.indexOf(planner.main[planner.main.length - 1].id);
        return { start: base + first, end: base + (last === -1 ? width - 1 : last) };
    }
    const at = ids.indexOf(t.slot);
    const pos = base + (at === -1 ? 0 : at);
    return { start: pos, end: pos };
}

function currTermStart(planner, key) { return currTermPos(planner, key).start; }
function currTermEnd(planner, key) { return currTermPos(planner, key).end; }

// Where the document allows this course to be planned.
function currAllowedSlots(course, planner) {
    const everyTerm = planner.spanOnly ? [planner.spanId] : planner.terms.map(function(term) { return term.id; });
    const value = course.semester_offered;
    if (!value) return everyTerm;
    const kind = currTermKind(value);
    if (kind === 'span') return [planner.spanId];
    if (kind === 'any') return planner.spanOnly ? [planner.spanId] : planner.main.map(function(term) { return term.id; });
    const slug = currTermSlug(value);
    return everyTerm.indexOf(slug) !== -1 ? [slug] : everyTerm;
}

function currPlacementOf(data, code) {
    const plan = data.plan || {};
    const keys = Object.keys(plan);
    for (let i = 0; i < keys.length; i++) {
        if ((plan[keys[i]] || []).indexOf(code) !== -1) return keys[i];
    }
    return null;
}

function currAllPlacements(data, code) {
    const plan = data.plan || {};
    return Object.keys(plan).filter(function(key) { return (plan[key] || []).indexOf(code) !== -1; });
}

function currIsCompleted(data, code) {
    return (data.completed || []).indexOf(code) !== -1;
}

function currFormatCredits(n) {
    const value = Math.round((n || 0) * 100) / 100;
    return (Math.abs(value - Math.round(value)) < 0.001 ? value.toFixed(1) : String(value));
}

// =============================================
// VALIDATION
// =============================================

function currIssue(severity, kind, code, term, message) {
    return { severity: severity, kind: kind, code: code, term: term, message: message };
}

// Everything wrong with the plan as it stands, recomputed whenever it changes.
// Errors are things the guide forbids; warnings are things it probably forbids but
// the document cannot say for certain; notes are conditions no plan can check.
function currValidate(data) {
    const byCode = currByCode(data);
    const index = currTitleIndex(data);
    const planner = currPlanner(data);
    const plan = data.plan || {};
    const issues = [];
    const placements = [];

    Object.keys(plan).forEach(function(term) {
        (plan[term] || []).forEach(function(code) { placements.push({ code: code, term: term }); });
    });

    const timesPlaced = {};
    placements.forEach(function(p) { timesPlaced[p.code] = (timesPlaced[p.code] || 0) + 1; });

    placements.forEach(function(p) {
        const course = byCode[p.code];
        if (!course) {
            issues.push(currIssue('error', 'unknown', p.code, p.term,
                'Course ' + p.code + ' is planned but is not in this catalog.'));
            return;
        }
        const where = currTermParse(p.term);
        const title = course.title;

        const allowed = currAllowedSlots(course, planner);
        if (course.semester_offered && allowed.indexOf(where.slot) === -1) {
            issues.push(currIssue('error', 'semester', p.code, p.term,
                title + ' is offered ' + String(course.semester_offered).toLowerCase() +
                ', so it cannot sit in ' + currSlotLabel(planner, where.slot).toLowerCase() + '.'));
        }

        if (course.grade_levels.length && course.grade_levels.indexOf(where.level) === -1) {
            issues.push(currIssue('error', 'grade', p.code, p.term,
                title + ' is open to ' +
                course.grade_levels.map(function(l) { return currLevelLabel(planner, l); }).join(', ') +
                ', not ' + currLevelLabel(planner, where.level) + '.'));
        }

        // The parse behind `prerequisites.courses` flattens alternate paths, so when
        // the line it came from offers a choice, a missing one is only a warning.
        // `choice: true` is the stronger statement: any one of these will do, so one
        // that is met settles the line and nothing is said at all. A raw line is not
        // read that way — "Chemistry or Biology, and Algebra II" is a choice and a
        // requirement in one sentence, and only the document can tell them apart.
        const raw = course.prerequisites.raw || '';
        const choice = course.prerequisites.choice === true;
        const alternates = / or /i.test(raw);
        const severity = (choice || alternates) ? 'warning' : 'error';
        const missing = [];
        const late = [];
        const unmet = [];
        let anyMet = false;
        course.prerequisites.courses.forEach(function(name) {
            const prereqCode = currResolveTitle(index, name);
            if (!prereqCode) {
                issues.push(currIssue('warning', 'prereq-unmatched', p.code, p.term,
                    title + ' asks for "' + name + '", which is not a course in this catalog.' +
                    (raw ? ' The guide says: ' + raw : '')));
                return;
            }
            // Something taken before the plan begins is met, whenever the course
            // that needs it is scheduled.
            if (currIsCompleted(data, prereqCode)) { anyMet = true; return; }
            const placed = currAllPlacements(data, prereqCode);
            const prereqTitle = (byCode[prereqCode] || {}).title || name;
            if (!placed.length) {
                missing.push({ title: prereqTitle });
                unmet.push({ title: prereqTitle, at: null });
                return;
            }
            const inTime = placed.some(function(key) {
                return currTermEnd(planner, key) < currTermStart(planner, p.term);
            });
            if (inTime) {
                anyMet = true;
            } else {
                late.push({ title: prereqTitle, at: placed[0] });
                unmet.push({ title: prereqTitle, at: placed[0] });
            }
        });

        if (choice) {
            // Named in the order the document lists them, so the message reads the way
            // the line does. One that is planned but too late is the more useful thing
            // to say, since moving it is the fix.
            const named = unmet.map(function(x) { return x.title; }).join(' or ');
            if (!anyMet && unmet.length) {
                issues.push(currIssue('warning', 'prereq-alt', p.code, p.term,
                    late.length
                        ? title + ' needs one of ' + named + ' to finish first, and none of them does.'
                        : title + ' needs one of ' + named + ', and none of them is in the plan.'));
            }
        } else {
            missing.forEach(function(x) {
                issues.push(currIssue(severity, alternates ? 'prereq-alt' : 'prereq-missing', p.code, p.term,
                    title + ' needs ' + x.title + ', which is not in the plan.' +
                    (alternates ? ' The guide offers a choice here: ' + raw : '')));
            });
            late.forEach(function(x) {
                issues.push(currIssue(severity, 'prereq-order', p.code, p.term,
                    x.title + ' has to finish before ' + title + ' starts, but it is in ' +
                    currTermLabel(planner, x.at) + '.'));
            });
        }

        if (course.prerequisites.min_gpa) {
            issues.push(currIssue('note', 'gpa', p.code, p.term,
                title + ' asks for a ' + course.prerequisites.min_gpa.toFixed(2) + ' GPA.'));
        }
        course.prerequisites.grade_requirements.forEach(function(req) {
            issues.push(currIssue('note', 'grade-requirement', p.code, p.term, title + ': ' + req + '.'));
        });
    });

    Object.keys(timesPlaced).forEach(function(code) {
        if (timesPlaced[code] < 2) return;
        const course = byCode[code];
        issues.push(currIssue('warning', 'duplicate', code, currPlacementOf(data, code),
            ((course && course.title) || code) + ' is in the plan ' + timesPlaced[code] + ' times.'));
    });

    // Taking a course you have already been credited with is usually a slip, but it
    // is the sort of thing a school can allow, so it is a warning and not an error.
    (data.completed || []).forEach(function(code) {
        if (!timesPlaced[code]) return;
        const course = byCode[code];
        issues.push(currIssue('warning', 'already-met', code, currPlacementOf(data, code),
            ((course && course.title) || code) + ' is marked as already met but is also in the plan.'));
    });

    const rank = { error: 0, warning: 1, note: 2 };
    issues.sort(function(a, b) { return rank[a.severity] - rank[b.severity]; });

    const byTerm = {};
    const forCode = {};
    issues.forEach(function(issue) {
        if (issue.term) {
            byTerm[issue.term] = byTerm[issue.term] || [];
            byTerm[issue.term].push(issue);
        }
        forCode[issue.code] = forCode[issue.code] || [];
        forCode[issue.code].push(issue);
    });

    return {
        issues: issues,
        byTerm: byTerm,
        byCode: forCode,
        errors: issues.filter(function(i) { return i.severity === 'error'; }).length,
        warnings: issues.filter(function(i) { return i.severity === 'warning'; }).length
    };
}

// Whether a course's prerequisites are all met by the time a term starts — used to
// pick the term the ⊕ button places into.
function currPrereqsMetBy(data, course, term, planner) {
    const index = currTitleIndex(data);
    return course.prerequisites.courses.every(function(name) {
        const code = currResolveTitle(index, name);
        if (!code) return true;
        if (currIsCompleted(data, code)) return true;
        return currAllPlacements(data, code).some(function(key) {
            return currTermEnd(planner, key) < currTermStart(planner, term);
        });
    });
}

function currBestTerm(data, course) {
    const planner = currPlanner(data);
    const allowed = currAllowedSlots(course, planner);
    const open = course.grade_levels.length
        ? course.grade_levels.filter(function(l) { return planner.levels.indexOf(l) !== -1; })
        : planner.levels;
    const levels = (open.length ? open : planner.levels).slice().sort(function(a, b) { return a - b; });
    const candidates = [];
    levels.forEach(function(level) {
        allowed.forEach(function(slot) { candidates.push(currTermKey(level, slot)); });
    });
    candidates.sort(function(a, b) { return currTermStart(planner, a) - currTermStart(planner, b); });
    for (let i = 0; i < candidates.length; i++) {
        if (currPrereqsMetBy(data, course, candidates[i], planner)) return candidates[i];
    }
    return candidates[0] || null;
}

// =============================================
// RENDERING
// =============================================

function currRender(widget) {
    if (!widget) return;
    const toolId = currGetToolId(widget);
    if (!toolId) return;
    const data = currGetData(toolId);
    const explorer = widget.querySelector('.curr-explorer');
    if (!explorer) return;

    widget.classList.toggle('narrow', widget.offsetWidth > 0 && widget.offsetWidth < 640);
    currRenderSource(widget, data);

    if (!data.catalog) {
        explorer.innerHTML = '<div class="curr-empty">No curriculum loaded yet.<br>' +
            'Paste a document in the JSON pane, drop a file on it, or press Sample.</div>';
        return;
    }

    const validation = currValidate(data);
    const scrolled = {};
    ['.curr-list', '.curr-pane'].forEach(function(sel) {
        const el = explorer.querySelector(sel);
        if (el) scrolled[sel] = el.scrollTop;
    });

    const folded = Boolean(data.ui.catalogCollapsed);
    explorer.innerHTML =
        '<div class="curr-catalog' + (folded ? ' collapsed' : '') + '">' +
            (folded ? currCatalogFoldedHtml(data) : currCatalogHtml(data)) + '</div>' +
        '<div class="curr-right">' + currRightHtml(data, validation) + '</div>';

    Object.keys(scrolled).forEach(function(sel) {
        const el = explorer.querySelector(sel);
        if (el) el.scrollTop = scrolled[sel];
    });

    // Selecting a course fills the details panel, which takes room from the list
    // below it. Keeping the scroll position is then not quite enough — the row just
    // clicked can end up under the fold — so it is brought back if it has gone.
    const chosen = explorer.querySelector('.curr-course.selected');
    const list = explorer.querySelector('.curr-list');
    if (chosen && list) {
        const rowBox = chosen.getBoundingClientRect();
        const listBox = list.getBoundingClientRect();
        if (rowBox.bottom > listBox.bottom || rowBox.top < listBox.top) {
            chosen.scrollIntoView({ block: 'nearest' });
        }
    }
}

function currRenderFor(el) {
    currRender(currGetWidget(el));
}

// ---- The catalog pane -----------------------------------------------------

function currMatchesFilters(course, ui) {
    const search = (ui.search || '').trim().toLowerCase();
    if (search) {
        const hay = (course.title + ' ' + course.course_code + ' ' + (course.description || '') + ' ' +
            (course.subject_area || '') + ' ' + (course.program || '') + ' ' +
            (course.department_printed || '') + ' ' + (course.title_variants || []).join(' ')).toLowerCase();
        if (hay.indexOf(search) === -1) return false;
    }
    if (ui.department && course.department !== ui.department) return false;
    if (ui.level && course.level !== ui.level) return false;
    if (ui.grade && course.grade_levels.indexOf(parseInt(ui.grade, 10)) === -1) return false;
    if (ui.semester && course.semester_offered !== ui.semester) return false;
    if (ui.flag && !(course.flags || {})[ui.flag]) return false;
    if (ui.program && course.program !== ui.program) return false;
    return true;
}

function currCompletedCredits(data) {
    const byCode = currByCode(data);
    let total = 0;
    (data.completed || []).forEach(function(code) {
        if (byCode[code]) total += byCode[code].credits || 0;
    });
    return total;
}

function currIsHidden(data, course) {
    const hidden = data.hidden;
    if (hidden.courses.indexOf(course.course_code) !== -1) return true;
    if (hidden.departments.indexOf(course.department) !== -1) return true;
    if (course.subject_area && hidden.subjects.indexOf(course.department + '/' + course.subject_area) !== -1) return true;
    return false;
}

function currUniqueValues(courses, key) {
    const seen = [];
    courses.forEach(function(c) {
        if (c[key] && seen.indexOf(c[key]) === -1) seen.push(c[key]);
    });
    return seen;
}

function currOptions(values, selected, blank) {
    return '<option value="">' + blank + '</option>' + values.map(function(v) {
        return '<option value="' + escapeHtml(String(v)) + '"' +
            (String(selected) === String(v) ? ' selected' : '') + '>' + escapeHtml(String(v)) + '</option>';
    }).join('');
}

// What the catalog pane is showing, worked out once and shared by the three parts
// that draw it — so the list can be redrawn while you type without touching the
// search box you are typing in.
function currCatalogView(data) {
    const ui = data.ui;
    const courses = currCourses(data);
    const hiddenCount = courses.filter(function(c) { return currIsHidden(data, c); }).length;
    // With nothing hidden there is no chip to turn "show hidden" off again, so it
    // must not linger and quietly dim the next thing that gets hidden.
    const showHidden = ui.showHidden && hiddenCount > 0;
    const shown = courses
        .filter(function(c) { return currMatchesFilters(c, ui); })
        .filter(function(c) { return showHidden || !currIsHidden(data, c); })
        .filter(function(c) { return !ui.onlyMet || currIsCompleted(data, c.course_code); });
    return {
        courses: courses, shown: shown, showHidden: showHidden,
        hiddenCount: hiddenCount, metCount: (data.completed || []).length
    };
}

function currCountHtml(data, view) {
    return '<span>' + view.shown.length + ' of ' + view.courses.length + ' courses</span>' +
        (view.metCount ? '<span class="curr-chip' + (data.ui.onlyMet ? ' active' : '') +
            '" onclick="currToggleOnlyMet(this)" title="Courses ticked as taken before this plan">Met ' +
            view.metCount + '</span>' : '') +
        (view.hiddenCount ? '<span class="curr-chip' + (view.showHidden ? ' active' : '') +
            '" onclick="currToggleShowHidden(this)" title="Show what is hidden, to bring it back">Hidden ' +
            view.hiddenCount + '</span>' : '');
}

function currCatalogHtml(data) {
    const ui = data.ui;
    const planner = currPlanner(data);
    const view = currCatalogView(data);
    const courses = view.courses;
    const shown = view.shown;
    const departments = currUniqueValues(courses, 'department');
    const levels = currUniqueValues(courses, 'level');
    const semesters = currUniqueValues(courses, 'semester_offered');
    const programs = currUniqueValues(courses, 'program');

    let html =
        '<div class="curr-controls">' +
            '<div class="curr-search-row">' +
                '<input class="curr-search" type="text" placeholder="Search courses…" value="' +
                    escapeHtml(ui.search || '') + '" oninput="currSetSearch(this)">' +
                '<button class="curr-collapse" title="Put the course list away" ' +
                    'onclick="currToggleCatalog(this)">&#9666;</button>' +
            '</div>' +
            '<div class="curr-filters">' +
                '<select onchange="currSetFilter(this, \'department\')" title="Department">' +
                    currOptions(departments, ui.department, 'All departments') + '</select>' +
                '<select onchange="currSetFilter(this, \'level\')" title="Level">' +
                    currOptions(levels, ui.level, 'All levels') + '</select>' +
                '<select onchange="currSetFilter(this, \'grade\')" title="Level">' +
                    '<option value="">Any level</option>' +
                    planner.levels.map(function(level) {
                        return '<option value="' + level + '"' + (String(ui.grade) === String(level) ? ' selected' : '') +
                            '>' + escapeHtml(currLevelLabel(planner, level)) + '</option>';
                    }).join('') + '</select>' +
                '<select onchange="currSetFilter(this, \'semester\')" title="When it is offered">' +
                    currOptions(semesters, ui.semester, 'Any term') + '</select>' +
                '<select onchange="currSetFilter(this, \'flag\')" title="What the document marks courses with">' +
                    '<option value="">Any course</option>' +
                    currFlagsInUse(courses).map(function(key) {
                        return '<option value="' + escapeHtml(key) + '"' + (ui.flag === key ? ' selected' : '') +
                            '>' + escapeHtml(currFlagLabel(key)) + '</option>';
                    }).join('') +
                '</select>' +
                (programs.length ? '<select onchange="currSetFilter(this, \'program\')" title="Programme or pathway">' +
                    currOptions(programs, ui.program, 'Any programme') + '</select>' : '') +
            '</div>' +
            '<div class="curr-count">' + currCountHtml(data, view) + '</div>' +
        '</div>';

    html += '<div class="curr-list">' + currListHtml(data, shown) + '</div>';
    html += currDetailsHtml(data);
    // What it prints is what this column is showing — the search, the filters and
    // whatever is hidden all apply — so it belongs under them, saying how many.
    html += '<div class="curr-catalog-foot">' +
        '<button class="curr-btn" onclick="currExportPdf(this)" ' +
            'title="Print these courses as a catalog, or save them as a PDF">' +
            escapeHtml(currPdfLabel(shown.length)) + '</button>' +
        '</div>';
    return html;
}

// Just the courses, so it can be redrawn on its own.
function currListHtml(data, shown) {
    const ui = data.ui;
    // Departments and subjects come from the document, never a list of our own.
    const groups = [];
    shown.forEach(function(course) {
        let group = groups.filter(function(g) { return g.name === course.department; })[0];
        if (!group) { group = { name: course.department, subs: [] }; groups.push(group); }
        const subName = course.subject_area || '';
        let sub = group.subs.filter(function(s) { return s.name === subName; })[0];
        if (!sub) { sub = { name: subName, courses: [] }; group.subs.push(sub); }
        sub.courses.push(course);
    });

    let html = '';
    if (!groups.length) {
        html += '<div class="curr-empty">Nothing matches those filters.</div>';
    }
    groups.forEach(function(group) {
        const collapsed = ui.collapsed.indexOf(group.name) !== -1;
        const deptHidden = data.hidden.departments.indexOf(group.name) !== -1;
        html +=
            '<div class="curr-section">' +
                '<div class="curr-section-head">' +
                    '<span class="curr-caret" onclick="currToggleSection(this, \'' + escapeHtml(group.name) + '\')">' +
                        (collapsed ? '▸' : '▾') + '</span>' +
                    '<span class="curr-section-title" onclick="currToggleSection(this, \'' + escapeHtml(group.name) + '\')">' +
                        escapeHtml(group.name) + '</span>' +
                    '<button class="curr-eye" title="' + (deptHidden ? 'Show this department' : 'Hide this department') +
                        '" onclick="currToggleHideDepartment(event, this, \'' + escapeHtml(group.name) + '\')">' +
                        (deptHidden ? '🙈' : '👁') + '</button>' +
                '</div>';
        if (!collapsed) {
            group.subs.forEach(function(sub) {
                if (sub.name) {
                    const key = group.name + '/' + sub.name;
                    const subHidden = data.hidden.subjects.indexOf(key) !== -1;
                    html += '<div class="curr-sub-head">' + escapeHtml(sub.name) +
                        ' <button class="curr-eye" title="' + (subHidden ? 'Show this section' : 'Hide this section') +
                        '" onclick="currToggleHideSubject(event, this, \'' + escapeHtml(key) + '\')">' +
                        (subHidden ? '🙈' : '👁') + '</button></div>';
                }
                sub.courses.forEach(function(course) {
                    html += currCourseRowHtml(data, course);
                });
            });
        }
        html += '</div>';
    });
    return html;
}

// Folded away, the course list is a strip you can bring back — the plan gets the
// width, which is what you want once the courses you are choosing between are on it.
function currCatalogFoldedHtml(data) {
    const view = currCatalogView(data);
    return '<button class="curr-collapse" title="Bring the course list back" ' +
            'onclick="currToggleCatalog(this)">&#9656;</button>' +
        '<span class="curr-collapse-label">' + view.courses.length + ' courses</span>';
}

function currLevelTagClass(level) {
    if (level === 'Honors') return ' lvl-Honors';
    if (level === 'AP') return ' lvl-AP';
    if (level === 'Dual Enrollment' || level === 'Honors Dual Enrollment') return ' lvl-Dual';
    return '';
}

// Levels are whatever the document calls them, so anything unrecognised is
// shortened rather than dropped.
function currLevelAbbr(level) {
    const known = { 'Honors': 'H', 'AP': 'AP', 'Dual Enrollment': 'DE',
        'Honors Dual Enrollment': 'HDE', 'College Prep': 'CP', 'Pre-AICE': 'PA',
        'AICE': 'AI', 'A-Level AICE': 'AL', 'Academic Support': 'AS' };
    if (known[level]) return known[level];
    return level.split(/\s+/).map(function(word) { return word.charAt(0); }).join('').toUpperCase().slice(0, 3);
}

// The chip on a catalog row: the term ids the course may sit in, or "any" when it
// may sit in all of them.
function currShortSemester(course, planner) {
    const slots = currAllowedSlots(course, planner);
    if (slots.length === 1) return slots[0] === planner.spanId ? 'Year' : slots[0];
    if (slots.length >= planner.terms.length) return 'Any';
    return slots.join('/');
}

function currCourseRowHtml(data, course, planner) {
    const ui = data.ui;
    planner = planner || currPlanner(data);
    const hidden = currIsHidden(data, course);
    const placed = currPlacementOf(data, course.course_code);
    const code = course.course_code;
    const met = currIsCompleted(data, code);
    return '<div class="curr-course' + (ui.selected === code ? ' selected' : '') +
            (hidden ? ' hidden-row' : '') + (placed ? ' placed' : '') + (met ? ' met' : '') +
            '" data-code="' + escapeHtml(code) + '"' +
            ' draggable="true" ondragstart="currCourseDragStart(event, this)"' +
            ' onclick="currSelectCourse(this)" title="' + escapeHtml(course.title) + '">' +
        '<input type="checkbox" class="curr-met" title="Already met — taken before this plan"' +
            (met ? ' checked' : '') + ' onclick="currToggleCompleted(event, this)">' +
        '<span class="curr-code">' + escapeHtml(code) + '</span>' +
        '<span class="curr-course-title">' + escapeHtml(course.title) + '</span>' +
        (course.prerequisites.courses.length ? '<span class="curr-tag" title="Has prerequisites">⛓</span>' : '') +
        (course.level && course.level !== 'Standard' ?
            '<span class="curr-tag' + currLevelTagClass(course.level) + '" title="' + escapeHtml(course.level) +
            '">' + escapeHtml(currLevelAbbr(course.level)) + '</span>' : '') +
        '<span class="curr-tag sem" title="' + escapeHtml(course.semester_offered || 'Any term') + '">' +
            currShortSemester(course, planner) + '</span>' +
        '<span class="curr-tag">' + currFormatCredits(course.credits) + '</span>' +
        '<button class="curr-eye" title="' + (hidden ? 'Show this course' : 'Hide this course') +
            '" onclick="currToggleHideCourse(event, this)">' + (hidden ? '🙈' : '👁') + '</button>' +
        '<button class="curr-add" title="Add to the first year it fits" onclick="currAutoPlace(event, this)">+</button>' +
    '</div>';
}

function currDetailsHtml(data) {
    const code = data.ui.selected;
    if (!code) return '<div class="curr-details curr-note">Pick a course to see what it needs.</div>';
    const course = currByCode(data)[code];
    if (!course) return '<div class="curr-details curr-note">That course is no longer in the catalog.</div>';
    const planner = currPlanner(data);
    const placed = currPlacementOf(data, code);
    const prereq = course.prerequisites;
    // Only what the document actually says about this course, joined up.
    const facts = [course.department, course.department_printed, course.subject_area,
        course.program, course.level !== 'Standard' ? course.level : '',
        currFormatCredits(course.credits) + ' credit' +
            (course.credits_basis && course.credits_basis !== 'printed' ? ' (' + course.credits_basis + ')' : ''),
        course.semester_offered,
        course.grade_levels.length
            ? course.grade_levels.map(function(l) { return currLevelLabel(planner, l); }).join(', ')
            : ''].filter(Boolean);
    let html = '<div class="curr-details">' +
        '<h4>' + escapeHtml(course.title) + ' <span class="curr-code">' + escapeHtml(code) + '</span></h4>' +
        '<p>' + escapeHtml(facts.join(' · ')) + '</p>';
    if (course.description) html += '<p>' + escapeHtml(course.description) + '</p>';
    if (prereq.raw) html += '<p><b>Needs:</b> ' + escapeHtml(prereq.raw) + '</p>';
    (course.notes || []).forEach(function(note) {
        html += '<p class="curr-note">' + escapeHtml(note) + '</p>';
    });
    const met = currIsCompleted(data, code);
    html += '<p>' + (met ? 'Already met, before this plan' :
            placed ? 'Planned for ' + escapeHtml(currTermLabel(planner, placed)) : 'Not in the plan') +
        ' · <button class="curr-btn" onclick="currAutoPlaceCode(this, \'' + escapeHtml(code) + '\')">' +
        (placed ? 'Move to the first year it fits' : 'Add to the plan') + '</button>' +
        ' <button class="curr-btn' + (met ? ' active' : '') + '" onclick="currToggleCompletedCode(this, \'' +
        escapeHtml(code) + '\')" title="Taken before this plan begins">' +
        (met ? 'Not met after all' : 'Already met') + '</button></p>';
    html += '</div>';
    return html;
}

// ---- The right pane: grid, tree, issues -----------------------------------

function currRightHtml(data, validation) {
    // Schema is about the shape of the document, so it sits beside the JSON pane
    // rather than beside the plan. A tool last left on it opens on the grid.
    const tab = data.ui.tab === 'schema' ? 'grid' : (data.ui.tab || 'grid');
    const tabs = [['grid', 'Grid'], ['tree', 'Tree'], ['issues', 'Issues']];
    let html = '<div class="curr-tabs">' + tabs.map(function(pair) {
        const badge = pair[0] === 'issues' && validation.errors ?
            ' <span class="curr-badge err">' + validation.errors + '</span>' :
            (pair[0] === 'issues' && validation.warnings ?
                ' <span class="curr-badge warn">' + validation.warnings + '</span>' : '');
        return '<button class="curr-tab' + (tab === pair[0] ? ' active' : '') +
            '" onclick="currSetTab(this, \'' + pair[0] + '\')">' + pair[1] + badge + '</button>';
    }).join('') + '</div>';

    html += '<div class="curr-pane">' +
        (tab === 'tree' ? currTreeHtml(data) :
            tab === 'issues' ? currIssuesHtml(data, validation) :
            currGridHtml(data, validation)) +
        '</div>';
    return html;
}

function currGridHtml(data, validation) {
    const planner = currPlanner(data);
    const last = planner.levels[planner.levels.length - 1];

    let html =
        '<div class="curr-grid-head">' +
            '<div class="curr-head-sems">' + (planner.spanOnly ? '' : planner.main.map(function(term) {
                return '<span title="' + escapeHtml(term.label) + '">' + escapeHtml(term.label) + '</span>';
            }).join('')) + '</div>' +
            planner.optional.map(function(term) {
                return '<span class="curr-head-sum" title="' + escapeHtml(term.label) + '">' +
                    escapeHtml(term.label) + '</span>';
            }).join('') +
        '</div>';

    planner.levels.forEach(function(level) {
        const credits = currLevelCredits(data, level, planner);
        html +=
            '<div class="curr-year">' +
                '<div class="curr-year-head" title="' + escapeHtml(currLevelLabel(planner, level)) + '">' +
                    '<b>' + escapeHtml(currLevelLabel(planner, level)) + '</b>' +
                    '<span>' + currFormatCredits(credits) + ' cr</span></div>' +
                '<div class="curr-terms">' +
                    currCellHtml(data, validation, planner, level, planner.spanId) +
                    (planner.spanOnly ? '' :
                        '<div class="curr-sems">' +
                            planner.main.map(function(term) {
                                return currCellHtml(data, validation, planner, level, term.id);
                            }).join('') +
                        '</div>') +
                '</div>' +
                planner.optional.map(function(term) {
                    return currCellHtml(data, validation, planner, level, term.id);
                }).join('') +
            '</div>';
    });

    // Not every plan fits the years a guide assumes, so the grid can be given more.
    const lastEmpty = !planner.terms.concat([{ id: planner.spanId }]).some(function(term) {
        return (data.plan[currTermKey(last, term.id)] || []).length;
    });
    html += '<div class="curr-grow">' +
        '<button class="curr-btn" onclick="currAddLevel(this)" title="Plan a further year">+ ' +
            escapeHtml(currLevelLabel(planner, last + 1)) + '</button>' +
        ((data.extraLevels || 0) > 0 ?
            '<button class="curr-btn" onclick="currRemoveLevel(this)"' +
                (lastEmpty ? '' : ' disabled title="Empty it first"') + '>− ' +
                escapeHtml(currLevelLabel(planner, last)) + '</button>' : '') +
    '</div>';

    html += currTotalsHtml(data);
    return html;
}

function currCellHtml(data, validation, planner, level, slot) {
    const key = currTermKey(level, slot);
    const codes = data.plan[key] || [];
    const optional = planner.optional.some(function(term) { return term.id === slot; });
    const extra = slot === planner.spanId ? ' curr-fy' : (optional ? ' curr-summer' : '');
    let html = '<div class="curr-cell' + extra + '" data-term="' + key + '"' +
        ' ondragover="currCellDragOver(event, this)" ondragleave="currCellDragLeave(this)"' +
        ' ondrop="currCellDrop(event, this)" onclick="currCellClick(event, this)"' +
        ' title="' + escapeHtml(currTermLabel(planner, key)) + '">';
    if (!codes.length) {
        html += '<span class="curr-cell-label">' + escapeHtml(currSlotLabel(planner, slot)) + '</span>';
    } else {
        const byCode = currByCode(data);
        codes.forEach(function(code) {
            html += currCardHtml(data, validation, byCode[code], code, key);
        });
    }
    return html + '</div>';
}

function currCardHtml(data, validation, course, code, term) {
    const issues = (validation.byTerm[term] || []).filter(function(i) { return i.code === code; });
    const errors = issues.filter(function(i) { return i.severity === 'error'; }).length;
    const warnings = issues.filter(function(i) { return i.severity === 'warning'; }).length;
    const title = course ? course.title : code + ' (not in this catalog)';
    const badge = errors ? '<span class="curr-badge err" title="' +
            escapeHtml(issues.map(function(i) { return i.message; }).join('\n')) + '">' + errors + '</span>' :
        (warnings ? '<span class="curr-badge warn" title="' +
            escapeHtml(issues.map(function(i) { return i.message; }).join('\n')) + '">' + warnings + '</span>' : '');
    const selected = data.ui.selected === code;
    const siblings = (data.plan[term] || []);
    const at = siblings.indexOf(code);
    // The arrows are on the selected card only: every card carrying a pair of them
    // would crowd the cell, and dragging is the ordinary way to do this.
    const arrows = selected && siblings.length > 1 ?
        '<button class="curr-card-move" title="Move up" onclick="currMoveCard(event, this, -1)"' +
            (at <= 0 ? ' disabled' : '') + '>▲</button>' +
        '<button class="curr-card-move" title="Move down" onclick="currMoveCard(event, this, 1)"' +
            (at === siblings.length - 1 ? ' disabled' : '') + '>▼</button>' : '';
    return '<div class="curr-card' + (errors ? ' has-error' : warnings ? ' has-warning' : '') +
            (selected ? ' selected' : '') + '" data-code="' + escapeHtml(code) + '"' +
            ' draggable="true" ondragstart="currCourseDragStart(event, this)"' +
            ' ondragover="currCardDragOver(event, this)" ondragleave="currCardDragLeave(this)"' +
            ' ondrop="currCardDrop(event, this)"' +
            ' onclick="currCardClick(event, this)" title="' + escapeHtml(title) + '">' +
        '<span class="curr-code">' + escapeHtml(code) + '</span>' +
        '<span class="curr-card-title">' + escapeHtml(title) + '</span>' + badge + arrows +
        '<button class="curr-card-x" title="Take it out of the plan" onclick="currRemove(event, this)">×</button>' +
    '</div>';
}

function currLevelCredits(data, level, planner) {
    const byCode = currByCode(data);
    let total = 0;
    [planner.spanId].concat(planner.terms.map(function(t) { return t.id; })).forEach(function(slot) {
        (data.plan[currTermKey(level, slot)] || []).forEach(function(code) {
            const course = byCode[code];
            if (course) total += course.credits || 0;
        });
    });
    return total;
}

function currAddLevel(el) {
    currUpdate(el, function(data) { data.extraLevels = (data.extraLevels || 0) + 1; });
}

// Only ever takes away a year that was added and left empty: the guide's own years
// stay, and nothing planned disappears with a button press.
function currRemoveLevel(el) {
    currUpdate(el, function(data) {
        if (!(data.extraLevels > 0)) return;
        const planner = currPlanner(data);
        const last = planner.levels[planner.levels.length - 1];
        const used = [planner.spanId].concat(planner.terms.map(function(t) { return t.id; }))
            .some(function(slot) { return (data.plan[currTermKey(last, slot)] || []).length; });
        if (used) return;
        data.extraLevels -= 1;
    });
}

// A course does not only count towards its own department. A guide can say that an
// elective satisfies the practical/fine arts requirement, that a PE course also
// counts as an elective, or list a course in its fine arts index — and the schema
// carries all three. So the question is asked of every requirement separately, and
// one course can answer yes to more than one.
const CURR_REQUIREMENT_FLAGS = [
    { flag: 'meets_practical_fine_arts', subject: /practical|fine art/ },
    { flag: 'meets_pe_requirement', subject: /physical education|^pe$/ }
];

function currFineArtsIndex(data) {
    const index = ((data.catalog || {}).practical_fine_arts_index || {}).meets_requirement || [];
    return index.map(currNormTitle);
}

function currCountsToward(data, course, subject, fineArts) {
    const want = currNormTitle(subject);
    if (!want) return false;
    if (currNormTitle(course.department) === want) return true;
    if (course.department_printed && currNormTitle(course.department_printed) === want) return true;
    // A document may say outright that a course counts as another subject — a
    // computing course carrying a science credit, say. That is not a guess to make.
    if (course.cross_credit && currNormTitle(course.cross_credit.counts_as) === want) return true;
    if (course.subject_area && currNormTitle(course.subject_area) === want) return true;
    // The guide lists these courses under electives as well as their own department.
    if (course.is_elective && /elective/.test(want)) return true;
    const flags = course.flags || {};
    for (let i = 0; i < CURR_REQUIREMENT_FLAGS.length; i++) {
        const rule = CURR_REQUIREMENT_FLAGS[i];
        if (flags[rule.flag] && rule.subject.test(want)) return true;
    }
    if (/practical|fine art/.test(want) &&
        (fineArts || currFineArtsIndex(data)).indexOf(currNormTitle(course.title)) !== -1) return true;
    return false;
}

// What the plan adds up to, against whatever the document says is required.
function currTotalsHtml(data) {
    const byCode = currByCode(data);
    const planner = currPlanner(data);
    const planned = [];
    let total = 0;
    Object.keys(data.plan).forEach(function(term) {
        (data.plan[term] || []).forEach(function(code) {
            const course = byCode[code];
            if (!course) return;
            total += course.credits || 0;
            planned.push(course);
        });
    });

    // Courses met before the plan count towards what the guide requires, which is
    // the point of ticking them off, but they are counted separately so it stays
    // clear how much of the total the plan itself accounts for.
    const priorTotal = currCompletedCredits(data);
    const counting = planned.slice();
    (data.completed || []).forEach(function(code) {
        if (byCode[code]) counting.push(byCode[code]);
    });

    const requirements = ((data.catalog.graduation_requirements || {}).credits_by_subject) || [];
    let html = '<div class="curr-totals"><div class="curr-req">' +
        '<span class="curr-req-caret"></span><span class="curr-req-name"><b>Planned</b></span>' +
        '<span class="curr-req-num">' + currFormatCredits(total) + ' credits</span></div>' +
        (priorTotal ? '<div class="curr-req"><span class="curr-req-caret"></span>' +
            '<span class="curr-req-name">Already met</span>' +
            '<span class="curr-req-num">' + currFormatCredits(priorTotal) + ' credits</span></div>' : '');

    const fineArts = currFineArtsIndex(data);
    const countedIn = {};
    const open = data.ui.openReqs || [];
    requirements.forEach(function(req) {
        const made = [];
        let got = 0;
        counting.forEach(function(course) {
            if (!currCountsToward(data, course, req.subject, fineArts)) return;
            got += course.credits || 0;
            made.push(course);
            countedIn[course.course_code] = (countedIn[course.course_code] || 0) + 1;
        });
        const need = req.credits_required || 0;
        const pct = need ? Math.min(100, Math.round((got / need) * 100)) : 100;
        const showing = open.indexOf(req.subject) !== -1;
        html += '<div class="curr-req' + (made.length ? ' openable' : '') + '"' +
                (made.length ? ' onclick="currToggleReq(this, \'' + escapeHtml(req.subject) + '\')"' : '') + '>' +
            '<span class="curr-req-caret">' + (made.length ? (showing ? '▾' : '▸') : '') + '</span>' +
            '<span class="curr-req-name" title="' + escapeHtml(req.notes || '') + '">' +
                escapeHtml(req.subject) + '</span>' +
            '<span class="curr-bar"><i class="' + (got >= need ? 'done' : '') + '" style="width:' + pct + '%"></i></span>' +
            '<span class="curr-req-num">' + currFormatCredits(got) + ' / ' + currFormatCredits(need) + '</span>' +
        '</div>';
        // What the number is made of. A requirement is only useful if you can see
        // which classes it is counting, especially where one counts in two places.
        if (showing) {
            html += '<div class="curr-req-courses">' + made.map(function(course) {
                const placed = currPlacementOf(data, course.course_code);
                const where = placed ? currTermLabel(planner, placed) : 'already met';
                return '<div class="curr-req-course" onclick="currSelectCode(event, this, \'' +
                        escapeHtml(course.course_code) + '\')">' +
                    '<span class="curr-code">' + escapeHtml(course.course_code) + '</span> ' +
                    escapeHtml(course.title) +
                    '<span class="curr-req-where">' + escapeHtml(where) + ' · ' +
                        currFormatCredits(course.credits) + '</span>' +
                '</div>';
            }).join('') + '</div>';
        }
    });

    // The subject rows can therefore add up to more than the credits planned, which
    // is worth saying out loud rather than leaving as arithmetic that looks wrong.
    const twice = Object.keys(countedIn).filter(function(code) { return countedIn[code] > 1; })
        .map(function(code) { return (byCode[code] || {}).title; }).filter(Boolean);
    if (twice.length) {
        html += '<div class="curr-req curr-note" style="display:block" title="' +
            escapeHtml(twice.join(', ')) + '">' + twice.length +
            (twice.length === 1 ? ' course counts' : ' courses count') +
            ' towards more than one requirement: ' + escapeHtml(twice.join(', ')) + '</div>';
    }

    // A document may print pathways — a diploma made of groups of courses — which
    // are counted in courses rather than credits.
    const titleIndex = currTitleIndex(data);
    (data.catalog.program_groupings || []).forEach(function(program, pi) {
        html += '<div class="curr-req"><span class="curr-req-caret"></span>' +
            '<span class="curr-req-name" title="' + escapeHtml(program.description || '') + '"><b>' +
            escapeHtml(program.name) + '</b></span></div>';
        (program.groups || []).forEach(function(group, gi) {
            const titles = group.courses || [];
            // Every title the group names, resolved to the course it names, so the
            // count and the list underneath it are one answer rather than two.
            const members = titles.map(function(title) {
                const code = currResolveTitle(titleIndex, title);
                const course = code ? byCode[code] : null;
                return {
                    code: code,
                    title: (course || {}).title || title,
                    placed: code ? currPlacementOf(data, code) : null,
                    met: code ? currIsCompleted(data, code) : false
                };
            });
            const got = members.filter(function(m) { return m.placed || m.met; }).length;
            // How many of the group are needed is the document's to say: `min_courses`
            // outright, or one for a group it marks required. Where it says nothing,
            // a bar would be this code's guess drawn as the document's answer, so the
            // row carries the count alone and no bar at all.
            const stated = typeof group.min_courses === 'number' && isFinite(group.min_courses) &&
                group.min_courses > 0 ? group.min_courses : (group.required_course ? 1 : 0);
            const need = stated || titles.length;
            const pct = stated ? Math.min(100, Math.round((got / stated) * 100)) : 0;
            // Keyed by position: a group name is the document's words and would have
            // to be escaped into the handler, and this only has to survive a redraw.
            const key = 'group:' + pi + ':' + gi;
            const showing = open.indexOf(key) !== -1;
            html += '<div class="curr-req' + (members.length ? ' openable' : '') + '"' +
                    (members.length ? ' onclick="currToggleReq(this, \'' + key + '\')"' : '') + '>' +
                '<span class="curr-req-caret">' + (members.length ? (showing ? '▾' : '▸') : '') + '</span>' +
                '<span class="curr-req-name" title="' + escapeHtml(titles.join(', ')) + '">' +
                    escapeHtml(group.name) + '</span>' +
                '<span class="curr-bar' + (stated ? '' : ' none') + '">' + (stated ?
                    '<i class="' + (got >= stated ? 'done' : '') + '" style="width:' + pct + '%"></i>' : '') +
                '</span>' +
                '<span class="curr-req-num">' + got + ' of ' + need +
                    (stated ? ' needed' : '') + '</span>' +
            '</div>';
            // A group lists its courses outright, unlike a subject requirement that
            // matches whatever fits it, so the whole list is worth showing: what is
            // being taken towards the group, and what else would have counted.
            if (showing) {
                html += '<div class="curr-req-courses">' + members.map(function(m) {
                    const where = m.placed ? currTermLabel(planner, m.placed)
                        : (m.met ? 'already met'
                            : (m.code ? 'not planned' : 'not in this catalog'));
                    return '<div class="curr-req-course' +
                            (m.placed || m.met ? '' : ' curr-req-off') + '"' +
                            (m.code ? ' onclick="currSelectCode(event, this, \'' +
                                escapeHtml(m.code) + '\')"' : '') + '>' +
                        (m.code ? '<span class="curr-code">' + escapeHtml(m.code) + '</span> ' : '') +
                        escapeHtml(m.title) +
                        '<span class="curr-req-where">' + escapeHtml(where) + '</span>' +
                    '</div>';
                }).join('') + '</div>';
            }
        });
    });

    (((data.catalog.graduation_requirements || {}).other_requirements) || []).forEach(function(text) {
        html += '<div class="curr-req curr-note" style="display:block">' + escapeHtml(text) + '</div>';
    });

    const missing = currCourses(data).filter(function(c) {
        return c.required_for_graduation && !currPlacementOf(data, c.course_code) &&
            !currIsCompleted(data, c.course_code);
    });
    if (missing.length) {
        html += '<div class="curr-req curr-note" style="display:block">Required but not planned: ' +
            missing.map(function(c) { return escapeHtml(c.title); }).join(', ') + '</div>';
    }
    return html + '</div>';
}

function currIssuesHtml(data, validation) {
    const planner = currPlanner(data);
    if (!validation.issues.length) {
        return '<div class="curr-clean">Nothing wrong with this plan.</div>';
    }
    const mark = { error: '<span class="curr-badge err">!</span>',
        warning: '<span class="curr-badge warn">?</span>',
        note: '<span class="curr-badge note">i</span>' };
    return validation.issues.map(function(issue) {
        return '<div class="curr-issue" onclick="currGoToIssue(this, \'' + escapeHtml(issue.code) + '\', \'' +
                escapeHtml(issue.term || '') + '\')">' +
            (mark[issue.severity] || '') +
            '<div class="curr-issue-text">' + escapeHtml(issue.message) +
                (issue.term ? '<div class="curr-issue-where">' + escapeHtml(currTermLabel(planner, issue.term)) + '</div>' : '') +
            '</div>' +
        '</div>';
    }).join('');
}

// ---- The plan as a picture -------------------------------------------------

// The board can already photograph a tool, but that captures what is on screen:
// half of it catalog, cut off at whatever the panes are scrolled to. A plan is
// worth having whole — every year, the credits, and what the guide still wants —
// so it is drawn again off-screen at full height and photographed there.
async function currExportPng(btn) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    const data = currGetData(toolId);
    if (!data.catalog) {
        currSetStatus(widget, 'err', 'There is no plan to draw yet — load a curriculum first.');
        return;
    }
    if (typeof html2canvas !== 'function') {
        currSetStatus(widget, 'err', 'Saving a picture needs html2canvas, which this page has not loaded.');
        return;
    }

    currSetStatus(widget, '', 'Drawing the plan…');
    const planner = currPlanner(data);
    const validation = currValidate(data);
    const catalog = data.catalog;
    // The tool's own header is where a name goes — rename the window to the
    // student's name and the picture is theirs. It leads, and what the document
    // calls itself follows underneath.
    const named = currToolTitle(toolId);
    const about = [currDocTitle(catalog), (catalog.school || {}).name,
        ((catalog.document || catalog.guide || {}).academic_year)].filter(Boolean);

    const shot = document.createElement('div');
    shot.className = 'curr-widget curr-shot';
    shot.innerHTML =
        (named ? '<div class="curr-shot-head">' + escapeHtml(named) + '</div>' : '') +
        (about.length ? '<div class="curr-shot-sub' + (named ? '' : ' curr-shot-head') + '">' +
            about.map(function(part) { return escapeHtml(part); }).join(' · ') + '</div>' : '') +
        currGridHtml(data, validation);
    document.body.appendChild(shot);
    // The buttons belong to the tool, not to a picture of it.
    shot.querySelectorAll('.curr-card-x, .curr-card-move, .curr-grow, .curr-req-caret')
        .forEach(function(el) { el.remove(); });

    try {
        const canvas = await html2canvas(shot, {
            scale: 2, logging: false,
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-secondary') || '#ffffff'
        });
        const name = (named || currDocTitle(catalog) || 'curriculum-plan')
            .replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
        const link = document.createElement('a');
        link.download = name + '-plan.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        currSetStatus(widget, 'ok', 'Saved ' + link.download + ' — ' +
            Math.round(canvas.width / 2) + '×' + Math.round(canvas.height / 2) + ', ' +
            planner.levels.length + ' years.');
    } catch (e) {
        currSetStatus(widget, 'err', 'The picture could not be drawn: ' + e.message);
    } finally {
        shot.remove();
    }
}

// What the tool window is called, when that has been made to say something — the
// name on the header is the obvious place for whose plan this is.
function currToolTitle(toolId) {
    const title = ((toolCustomizations[toolId] || {}).title || '').trim();
    const registered = (PluginRegistry.getTool('curriculum-explorer') || {}).title || 'Curriculum Explorer';
    return title && title !== registered ? title : '';
}

// What the document calls itself, by whichever name its version uses.
function currDocTitle(catalog) {
    const doc = catalog.document || catalog.guide || {};
    return doc.title || (catalog.school || {}).name || '';
}

// ---- The catalog as a document ---------------------------------------------

// Which course fields to print, taken from the schema rather than a list of our
// own, and narrowed to the ones this document actually fills in — a course card
// carries no descriptions, and a page of empty labels helps nobody.
const CURR_PRINT_SKIP = ['course_code', 'title', 'prerequisites', 'flags', 'notes',
    'description', 'title_variants', 'credits_basis'];

function currPrintFields(courses) {
    const props = ((CURR_SCHEMA.properties.courses.items || {}).properties) || {};
    const used = {};
    courses.forEach(function(course) {
        Object.keys(props).forEach(function(key) {
            const value = course[key];
            if (value === null || value === undefined || value === '') return;
            if (Array.isArray(value) && !value.length) return;
            used[key] = true;
        });
    });
    return Object.keys(props).filter(function(key) {
        return used[key] && CURR_PRINT_SKIP.indexOf(key) === -1;
    });
}

function currPrintValue(course, key, planner) {
    const value = course[key];
    if (value === null || value === undefined || value === '') return '';
    if (key === 'grade_levels') {
        return value.map(function(level) { return currLevelLabel(planner, level); }).join(', ');
    }
    if (key === 'credits') {
        return currFormatCredits(value) + (course.credits_basis && course.credits_basis !== 'printed'
            ? ' (' + course.credits_basis + ')' : '');
    }
    if (key === 'cross_credit') return 'counts as ' + (value.counts_as || '');
    if (key === 'college_credit') {
        return [value.provider].concat(value.college_courses || []).filter(Boolean).join(' · ');
    }
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return '';
    return String(value);
}

// The whole catalog as something to read on paper: what is on the catalog pane,
// grouped the way it is grouped there, with everything the document says about
// each course. Built as a document of its own so the browser can paginate it.
function currCatalogPrintHtml(data) {
    const planner = currPlanner(data);
    const view = currCatalogView(data);
    const catalog = data.catalog;
    const courses = view.shown;
    const fields = currPrintFields(courses);
    const named = currToolTitle(currGetToolId(document.querySelector('.curr-widget')) || '');
    const about = [currDocTitle(catalog), (catalog.school || {}).name,
        ((catalog.document || catalog.guide || {}).academic_year)].filter(Boolean);

    const groups = [];
    courses.forEach(function(course) {
        let group = groups.filter(function(g) { return g.name === course.department; })[0];
        if (!group) { group = { name: course.department, subs: [] }; groups.push(group); }
        const subName = course.subject_area || '';
        let sub = group.subs.filter(function(s) { return s.name === subName; })[0];
        if (!sub) { sub = { name: subName, courses: [] }; group.subs.push(sub); }
        sub.courses.push(course);
    });

    const requirements = ((catalog.graduation_requirements || {}).credits_by_subject) || [];
    const other = ((catalog.graduation_requirements || {}).other_requirements) || [];

    let body = '<h1>' + escapeHtml(about[0] || 'Course catalog') + '</h1>';
    if (about.length > 1) body += '<div class="sub">' + escapeHtml(about.slice(1).join(' · ')) + '</div>';
    if (named) body += '<div class="sub">' + escapeHtml(named) + '</div>';
    body += '<div class="sub">' + courses.length +
        (courses.length === view.courses.length ? ' courses' :
            ' of ' + view.courses.length + ' courses — the rest are filtered out or hidden') + '</div>';

    if (requirements.length) {
        body += '<h2>What is required</h2><table><tbody>' + requirements.map(function(req) {
            return '<tr><td>' + escapeHtml(req.subject) + '</td><td class="num">' +
                currFormatCredits(req.credits_required) + '</td><td class="note">' +
                escapeHtml(req.notes || '') + '</td></tr>';
        }).join('') + '</tbody></table>';
        if (other.length) {
            body += '<ul class="other">' + other.map(function(text) {
                return '<li>' + escapeHtml(text) + '</li>';
            }).join('') + '</ul>';
        }
    }

    groups.forEach(function(group) {
        body += '<h2>' + escapeHtml(group.name) + '</h2>';
        group.subs.forEach(function(sub) {
            if (sub.name) body += '<h3>' + escapeHtml(sub.name) + '</h3>';
            sub.courses.forEach(function(course) {
                const facts = fields.map(function(key) {
                    // A true/false field is worth printing only when it is true, and
                    // then its name says it: "Elective", not "Is elective: true".
                    if (typeof course[key] === 'boolean') {
                        return course[key] ? '<span class="fact">' +
                            escapeHtml(currFlagLabel(key.replace(/^is_/, ''))) + '</span>' : '';
                    }
                    const value = currPrintValue(course, key, planner);
                    return value ? '<span class="fact"><b>' + escapeHtml(currFlagLabel(key)) + ':</b> ' +
                        escapeHtml(value) + '</span>' : '';
                }).filter(Boolean).join(' ');
                const flags = Object.keys(course.flags || {}).filter(function(key) { return course.flags[key]; });
                body += '<div class="course">' +
                    '<div class="head"><span class="code">' + escapeHtml(course.course_code) + '</span> ' +
                        escapeHtml(course.title) + '</div>' +
                    (facts ? '<div class="facts">' + facts + '</div>' : '') +
                    (course.prerequisites.raw ? '<div class="pre"><b>Needs:</b> ' +
                        escapeHtml(course.prerequisites.raw) + '</div>' : '') +
                    (course.description ? '<div class="desc">' + escapeHtml(course.description) + '</div>' : '') +
                    (course.notes || []).map(function(note) {
                        return '<div class="note">' + escapeHtml(note) + '</div>';
                    }).join('') +
                    (flags.length ? '<div class="flags">' + flags.map(function(key) {
                        return escapeHtml(currFlagLabel(key));
                    }).join(' · ') + '</div>' : '') +
                '</div>';
            });
        });
    });

    // A document of its own: nothing of the board's styling reaches it, and the
    // browser paginates it as it would any page.
    return '<!doctype html><html><head><meta charset="utf-8">' +
        '<title>' + escapeHtml(about[0] || 'Course catalog') + '</title><style>' +
        // Sized in points, not pixels: a pixel is a 96th of an inch on paper, so the
        // screen's 10.5px prints at under 8pt — a size nobody wants to read a
        // catalog at. 10pt body is what a printed reference book uses.
        '@page { margin: 15mm 13mm; }' +
        'body { font: 10pt/1.4 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;' +
            ' color: #111; margin: 0; }' +
        'h1 { font-size: 18pt; margin: 0 0 2pt; }' +
        'h2 { font-size: 13pt; margin: 14pt 0 4pt; padding-bottom: 2pt; border-bottom: 1px solid #888;' +
            ' break-after: avoid; page-break-after: avoid; }' +
        'h3 { font-size: 10pt; margin: 9pt 0 2pt; color: #555; text-transform: uppercase;' +
            ' letter-spacing: 0.04em; break-after: avoid; page-break-after: avoid; }' +
        '.sub { color: #555; font-size: 10pt; }' +
        'table { width: 100%; border-collapse: collapse; margin-top: 4pt; }' +
        'td { border-bottom: 1px solid #eee; padding: 2pt 4pt; vertical-align: top; }' +
        'td.num { width: 50pt; text-align: right; }' +
        'td.note, .note { color: #555; }' +
        'ul.other { margin: 4pt 0 0 14pt; padding: 0; color: #333; }' +
        '.course { break-inside: avoid; page-break-inside: avoid; padding: 5pt 0;' +
            ' border-bottom: 1px solid #eee; }' +
        '.head { font-weight: 600; font-size: 11pt; }' +
        '.code { font-family: "SFMono-Regular", Menlo, Consolas, monospace; font-size: 9pt; color: #555; }' +
        '.facts { color: #444; }' +
        '.fact { margin-right: 10pt; }' +
        '.facts, .desc, .pre, .note { overflow-wrap: break-word; }' +
        '.desc { margin-top: 1pt; }' +
        '.flags { color: #666; font-size: 9pt; margin-top: 1pt; }' +
        '</style></head><body>' + body + '</body></html>';
}

// Handed to the browser to print, which is what makes the PDF. No library is
// loaded for this: printing gives text that can be searched and selected, and
// pages that break where they should, which a picture of the screen cannot.
function currExportPdf(btn) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    const data = currGetData(toolId);
    if (!data.catalog) {
        currSetStatus(widget, 'err', 'There is no catalog to print yet — load a curriculum first.');
        return;
    }
    const view = currCatalogView(data);
    if (!view.shown.length) {
        currSetStatus(widget, 'err', 'Nothing would be printed: every course is filtered out or hidden.');
        return;
    }

    const frame = document.createElement('iframe');
    frame.className = 'curr-print-frame';
    frame.setAttribute('aria-hidden', 'true');
    document.body.appendChild(frame);
    const doc = frame.contentDocument;
    doc.open();
    doc.write(currCatalogPrintHtml(data));
    doc.close();

    currSetStatus(widget, 'ok', 'Printing ' + view.shown.length + ' courses — choose "Save as PDF" ' +
        'in the print dialog to keep it. If it comes out small, check Scale under More settings.');
    // The frame has to be laid out before it can be printed, and cleared up after.
    setTimeout(function() {
        try {
            frame.contentWindow.focus();
            frame.contentWindow.print();
        } catch (e) {
            currSetStatus(widget, 'err', 'The catalog could not be printed: ' + e.message);
        }
        setTimeout(function() { frame.remove(); }, 1000);
    }, 150);
}

// ---- The schema ------------------------------------------------------------

function currSchemaRows(schema, path, depth, rows) {
    const props = schema.properties || {};
    const required = schema.required || [];
    Object.keys(props).forEach(function(name) {
        const field = props[name];
        const kind = Array.isArray(field.type) ? field.type.join(' or ') : (field.type || '');
        rows.push({
            depth: depth, name: name, kind: kind,
            // Only a course's own fields can be counted against the document.
            course: path === '.courses[]',
            required: required.indexOf(name) !== -1,
            description: field.description || ''
        });
        if (field.properties) currSchemaRows(field, path + '.' + name, depth + 1, rows);
        if (field.items && field.items.properties) {
            currSchemaRows(field.items, path + '.' + name + '[]', depth + 1, rows);
        }
    });
    return rows;
}

// What the tool reads, said plainly, next to what this document actually gives it.
function currSchemaHtml(data) {
    const planner = currPlanner(data);
    const courses = currCourses(data);
    const present = {};
    courses.forEach(function(course) {
        Object.keys(course).forEach(function(key) {
            if (course[key] !== null && course[key] !== undefined && course[key] !== '') {
                present[key] = (present[key] || 0) + 1;
            }
        });
    });

    let html = '<div class="curr-schema">';
    if (data.catalog) {
        html += '<div class="curr-schema-read"><b>Read from this document</b><br>' +
            escapeHtml(courses.length + ' courses · ' +
                planner.levels.map(function(l) { return currLevelLabel(planner, l); }).join(', ') +
                ' · ' + planner.terms.map(function(t) { return t.label; }).join(', ') +
                (planner.optional.length ? ' (last sits after the year)' : '')) +
            '<br>' + escapeHtml((data.catalog.planner ? 'The document states its own plan shape.' :
                'Levels and terms were derived from the courses; a `planner` block would state them outright.')) +
            '</div>';
    }

    html += '<p class="curr-note">' + escapeHtml(CURR_SCHEMA.description) + '</p>';
    html += '<div class="curr-schema-actions">' +
        '<button class="curr-btn" onclick="currCopySchema(this)">Copy as JSON Schema</button>' +
        '<button class="curr-btn" onclick="currLoadSchemaIntoEditor(this)" title="Put it in the JSON pane to read or save">Show the JSON</button>' +
        '</div>';

    html += '<table class="curr-schema-table">' + currSchemaRows(CURR_SCHEMA, '', 0, []).map(function(row) {
        const seen = row.course && present[row.name];
        return '<tr class="d' + Math.min(row.depth, 3) + '">' +
            '<td class="curr-schema-name">' + escapeHtml(row.name) +
                (row.required ? ' <span class="curr-tag">required</span>' : '') +
                (seen ? ' <span class="curr-tag sem" title="Courses in this document that have it">' +
                    seen + '</span>' : '') + '</td>' +
            '<td class="curr-schema-kind">' + escapeHtml(row.kind) + '</td>' +
            '<td class="curr-schema-desc">' + escapeHtml(row.description) + '</td>' +
        '</tr>';
    }).join('') + '</table></div>';
    return html;
}

function currCopySchema(btn) {
    const text = JSON.stringify(CURR_SCHEMA, null, 2);
    const done = function() { currSetStatus(currGetWidget(btn), 'ok', 'The schema is on the clipboard.'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function() {
            currSetStatus(currGetWidget(btn), 'err', 'Could not reach the clipboard — use "Show the JSON" instead.');
        });
    } else {
        currSetStatus(currGetWidget(btn), 'err', 'No clipboard here — use "Show the JSON" instead.');
    }
}

function currLoadSchemaIntoEditor(btn) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    widget.querySelector('.curr-json').value = JSON.stringify(CURR_SCHEMA, null, 2);
    currSetStatus(widget, 'ok', 'The schema is in the JSON pane. It is a schema, not a curriculum — ' +
        'loading it will not do anything useful, but it can be copied out of there.');
    if (typeof setToolMode === 'function') setToolMode(toolId, 'edit');
}

// ---- The prerequisite tree ------------------------------------------------

const CURR_NODE_W = 150;
const CURR_NODE_H = 40;
const CURR_GAP_X = 14;
const CURR_GAP_Y = 38;

function currTreeGraph(data) {
    const index = currTitleIndex(data);
    const prereqs = {};
    const dependents = {};
    currCourses(data).forEach(function(course) {
        prereqs[course.course_code] = [];
        dependents[course.course_code] = dependents[course.course_code] || [];
    });
    currCourses(data).forEach(function(course) {
        course.prerequisites.courses.forEach(function(name) {
            const code = currResolveTitle(index, name);
            if (!code || code === course.course_code) return;
            if (prereqs[course.course_code].indexOf(code) === -1) prereqs[course.course_code].push(code);
            dependents[code] = dependents[code] || [];
            if (dependents[code].indexOf(course.course_code) === -1) dependents[code].push(course.course_code);
        });
    });
    return { prereqs: prereqs, dependents: dependents };
}

// How many courses deep a course sits. A course in a cycle stops the walk rather
// than driving it forever: a guide can name a prerequisite loop by mistake.
function currDepth(graph, code, memo, stack) {
    if (memo[code] !== undefined) return memo[code];
    if (stack[code]) return 0;
    stack[code] = true;
    let depth = 0;
    (graph.prereqs[code] || []).forEach(function(p) {
        depth = Math.max(depth, currDepth(graph, p, memo, stack) + 1);
    });
    stack[code] = false;
    memo[code] = depth;
    return depth;
}

function currWalk(graph, root, direction) {
    const found = [];
    const seen = {};
    seen[root] = true;
    let frontier = [root];
    while (frontier.length) {
        const next = [];
        frontier.forEach(function(code) {
            (graph[direction][code] || []).forEach(function(other) {
                if (seen[other]) return;
                seen[other] = true;
                found.push(other);
                next.push(other);
            });
        });
        frontier = next;
    }
    return found;
}

function currTreeLayout(data, graph, root, withDependents) {
    const byCode = currByCode(data);
    const memo = {};
    // A course can be reached both ways at once when a guide names a prerequisite
    // loop, so the two walks are merged rather than concatenated.
    const codes = [];
    [root].concat(currWalk(graph, root, 'prereqs'))
        .concat(withDependents ? currWalk(graph, root, 'dependents') : [])
        .forEach(function(code) { if (codes.indexOf(code) === -1) codes.push(code); });

    const rootDepth = currDepth(graph, root, memo, {});
    const layers = {};
    const nodes = codes.filter(function(code) { return byCode[code]; }).map(function(code) {
        const layer = currDepth(graph, code, memo, {}) - rootDepth;
        layers[layer] = layers[layer] || [];
        layers[layer].push(code);
        return { code: code, layer: layer };
    });

    const keys = Object.keys(layers).map(Number).sort(function(a, b) { return a - b; });
    keys.forEach(function(layer) {
        layers[layer].sort(function(a, b) {
            return (byCode[a].title || '').localeCompare(byCode[b].title || '');
        });
    });

    const widest = keys.reduce(function(max, layer) { return Math.max(max, layers[layer].length); }, 1);
    const width = widest * CURR_NODE_W + (widest - 1) * CURR_GAP_X + 8;
    const positions = {};
    keys.forEach(function(layer, row) {
        const count = layers[layer].length;
        const rowWidth = count * CURR_NODE_W + (count - 1) * CURR_GAP_X;
        const left = Math.max(4, (width - rowWidth) / 2);
        layers[layer].forEach(function(code, col) {
            positions[code] = {
                x: left + col * (CURR_NODE_W + CURR_GAP_X),
                y: 4 + row * (CURR_NODE_H + CURR_GAP_Y)
            };
        });
    });

    const inTree = {};
    nodes.forEach(function(n) { inTree[n.code] = true; });
    const edges = [];
    nodes.forEach(function(n) {
        (graph.prereqs[n.code] || []).forEach(function(p) {
            if (inTree[p] && positions[p] && positions[n.code]) edges.push({ from: p, to: n.code });
        });
    });

    return {
        nodes: nodes, edges: edges, positions: positions,
        width: width, height: 8 + keys.length * (CURR_NODE_H + CURR_GAP_Y)
    };
}

function currTreeHtml(data) {
    const planner = currPlanner(data);
    const root = data.ui.treeRoot || data.ui.selected;
    const byCode = currByCode(data);
    if (!root || !byCode[root]) {
        return '<div class="curr-empty">Pick a course to see what it depends on.</div>';
    }

    const graph = currTreeGraph(data);
    const layout = currTreeLayout(data, graph, root, data.ui.showDependents !== false);

    let svg = '<svg class="curr-tree" width="' + layout.width + '" height="' + layout.height +
        '" viewBox="0 0 ' + layout.width + ' ' + layout.height + '">';

    layout.edges.forEach(function(edge) {
        const from = layout.positions[edge.from];
        const to = layout.positions[edge.to];
        const x1 = from.x + CURR_NODE_W / 2, y1 = from.y + CURR_NODE_H;
        const x2 = to.x + CURR_NODE_W / 2, y2 = to.y;
        const mid = y1 + (y2 - y1) / 2;
        svg += '<path class="curr-edge' + (edge.to === root ? ' up' : '') + '" d="M ' + x1 + ' ' + y1 +
            ' L ' + x1 + ' ' + mid + ' L ' + x2 + ' ' + mid + ' L ' + x2 + ' ' + y2 + '"/>' +
            '<path class="curr-edge" d="M ' + (x2 - 4) + ' ' + (y2 - 5) + ' L ' + x2 + ' ' + y2 +
            ' L ' + (x2 + 4) + ' ' + (y2 - 5) + '"/>';
    });

    layout.nodes.forEach(function(node) {
        const course = byCode[node.code];
        const pos = layout.positions[node.code];
        const placed = currPlacementOf(data, node.code);
        const met = currIsCompleted(data, node.code);
        const where = placed ? currTermLabel(planner, placed) : (met ? 'already met' : 'not planned');
        const title = course.title.length > 22 ? course.title.slice(0, 21) + '…' : course.title;
        svg += '<g class="curr-node' + (node.code === root ? ' root' : '') + (placed || met ? ' placed' : '') +
                '" onclick="currTreeSetRoot(this, \'' + escapeHtml(node.code) + '\')">' +
            '<rect x="' + pos.x + '" y="' + pos.y + '" width="' + CURR_NODE_W + '" height="' + CURR_NODE_H +
                '" rx="5"><title>' + escapeHtml(course.title) + '</title></rect>' +
            '<text x="' + (pos.x + 8) + '" y="' + (pos.y + 17) + '">' + escapeHtml(title) + '</text>' +
            '<text class="sub" x="' + (pos.x + 8) + '" y="' + (pos.y + 31) + '">' +
                escapeHtml(node.code + ' · ' + where) + '</text>' +
        '</g>';
    });
    svg += '</svg>';

    return '<div class="curr-tree-bar">' +
            '<span>' + escapeHtml(byCode[root].title) + '</span>' +
            '<label><input type="checkbox"' + (data.ui.showDependents !== false ? ' checked' : '') +
                ' onchange="currToggleDependents(this)"> what needs it</label>' +
        '</div><div class="curr-tree-wrap">' + svg + '</div>';
}

// =============================================
// INTERACTION
// =============================================

function currUpdate(el, change) {
    const widget = currGetWidget(el);
    const toolId = currGetToolId(el);
    if (!widget || !toolId) return;
    const data = currGetData(toolId);
    change(data);
    currSaveData(toolId, data);
    currRender(widget);
}

// Typing must not rebuild the pane around the box being typed in: replacing the
// search box takes the caret with it, a letter at a time. Only the list of courses
// and the count above it are redrawn.
function currSetSearch(input) {
    const widget = currGetWidget(input);
    const toolId = currGetToolId(input);
    if (!widget || !toolId) return;
    const data = currGetData(toolId);
    data.ui.search = input.value;
    currSaveDataSoon(toolId, data);
    currRenderCatalogList(widget, data);
}

function currPdfLabel(n) { return 'PDF \u00b7 ' + n + (n === 1 ? ' course' : ' courses'); }

function currRenderCatalogList(widget, data) {
    const list = widget.querySelector('.curr-list');
    const count = widget.querySelector('.curr-count');
    if (!list) return;
    const view = currCatalogView(data);
    list.innerHTML = currListHtml(data, view.shown);
    if (count) count.innerHTML = currCountHtml(data, view);
    // The PDF button says what it would print, and searching changes that.
    const pdf = widget.querySelector('.curr-catalog-foot button');
    if (pdf) {
        pdf.textContent = currPdfLabel(view.shown.length);
    }
}

function currSetFilter(select, key) {
    const value = select.value;
    currUpdate(select, function(data) { data.ui[key] = value; });
}

function currToggleSection(el, name) {
    currUpdate(el, function(data) {
        const at = data.ui.collapsed.indexOf(name);
        if (at === -1) data.ui.collapsed.push(name); else data.ui.collapsed.splice(at, 1);
    });
}

function currToggleCatalog(el) {
    currUpdate(el, function(data) { data.ui.catalogCollapsed = !data.ui.catalogCollapsed; });
}

function currToggleShowHidden(el) {
    currUpdate(el, function(data) { data.ui.showHidden = !data.ui.showHidden; });
}

function currToggleOnlyMet(el) {
    currUpdate(el, function(data) { data.ui.onlyMet = !data.ui.onlyMet; });
}

// Ticking a course off says it was taken before this plan starts: it satisfies
// what depends on it, counts towards the credits required, and takes up no term.
function currToggleCompleted(e, el) {
    e.stopPropagation();
    currToggleCompletedCode(el, el.closest('.curr-course').getAttribute('data-code'));
}

function currToggleCompletedCode(el, code) {
    currUpdate(el, function(data) {
        data.completed = data.completed || [];
        currToggleList(data.completed, code);
    });
}

// Hiding is a way of clearing the view, so it reaches the catalog only: a course
// already in the plan stays in the grid and keeps being checked.
function currToggleList(list, value) {
    const at = list.indexOf(value);
    if (at === -1) list.push(value); else list.splice(at, 1);
}

// Restoring the last hidden course takes the chip away with it, so the switch it
// controls has to go back off — otherwise the next thing hidden only goes dim.
function currAfterHiding(data) {
    if (!data.hidden.courses.length && !data.hidden.departments.length && !data.hidden.subjects.length) {
        data.ui.showHidden = false;
    }
}

function currToggleHideCourse(e, el) {
    e.stopPropagation();
    const code = el.closest('.curr-course').getAttribute('data-code');
    currUpdate(el, function(data) { currToggleList(data.hidden.courses, code); currAfterHiding(data); });
}

function currToggleHideDepartment(e, el, name) {
    e.stopPropagation();
    currUpdate(el, function(data) { currToggleList(data.hidden.departments, name); currAfterHiding(data); });
}

function currToggleHideSubject(e, el, key) {
    e.stopPropagation();
    currUpdate(el, function(data) { currToggleList(data.hidden.subjects, key); currAfterHiding(data); });
}

function currSelectCourse(el) {
    const code = el.getAttribute('data-code');
    currUpdate(el, function(data) {
        data.ui.selected = code;
        data.ui.treeRoot = code;
    });
}

function currCardClick(e, el) {
    e.stopPropagation();
    currSelectCourse(el);
}

function currSetTab(el, tab) {
    currUpdate(el, function(data) { data.ui.tab = tab; });
}

function currToggleDependents(el) {
    const on = el.checked;
    currUpdate(el, function(data) { data.ui.showDependents = on; });
}

function currToggleReq(el, subject) {
    currUpdate(el, function(data) {
        data.ui.openReqs = data.ui.openReqs || [];
        currToggleList(data.ui.openReqs, subject);
    });
}

function currSelectCode(e, el, code) {
    e.stopPropagation();
    currUpdate(el, function(data) { data.ui.selected = code; data.ui.treeRoot = code; });
}

function currTreeSetRoot(el, code) {
    currUpdate(el, function(data) { data.ui.treeRoot = code; data.ui.selected = code; });
}

function currGoToIssue(el, code, term) {
    currUpdate(el, function(data) {
        data.ui.selected = code;
        data.ui.treeRoot = code;
        data.ui.tab = 'grid';
    });
}

// ---- Placing and removing -------------------------------------------------

let currDragCode = null;

function currCourseDragStart(e, el) {
    currDragCode = el.getAttribute('data-code');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', currDragCode);
}

function currCellDragOver(e, el) {
    e.preventDefault();
    const toolId = currGetToolId(el);
    const code = currDragCode;
    if (!toolId || !code) return;
    const data = currGetData(toolId);
    const course = currByCode(data)[code];
    const slot = currTermParse(el.getAttribute('data-term')).slot;
    const fits = course && currAllowedSlots(course, currPlanner(data)).indexOf(slot) !== -1;
    el.classList.add(fits ? 'drop-ok' : 'drop-bad');
}

function currCellDragLeave(el) {
    el.classList.remove('drop-ok', 'drop-bad');
}

function currCellDrop(e, el) {
    e.preventDefault();
    el.classList.remove('drop-ok', 'drop-bad');
    const code = currDragCode || e.dataTransfer.getData('text/plain');
    currDragCode = null;
    if (code) currPlace(el, code, el.getAttribute('data-term'));
}

// A tap places what is selected, so the tool works without a mouse to drag with.
function currCellClick(e, el) {
    if (e.target.closest('.curr-card')) return;
    const toolId = currGetToolId(el);
    if (!toolId) return;
    const data = currGetData(toolId);
    if (!data.ui.selected) return;
    currPlace(el, data.ui.selected, el.getAttribute('data-term'));
}

// A course sits in one term at a time: placing it somewhere else moves it rather
// than leaving a copy behind.
// `at` puts the course at a position within the term rather than at the end, which
// is what dropping it onto another card means. Undefined appends.
function currPlace(el, code, term, at) {
    currUpdate(el, function(data) {
        // Where it sits now matters: taking it out of the same term shifts anything
        // after it up by one, and the position asked for was read before that.
        const from = (data.plan[term] || []).indexOf(code);
        let index = at;
        if (typeof index === 'number' && from !== -1 && from < index) index -= 1;

        Object.keys(data.plan).forEach(function(key) {
            data.plan[key] = (data.plan[key] || []).filter(function(c) { return c !== code; });
            if (!data.plan[key].length) delete data.plan[key];
        });
        const list = data.plan[term] || [];
        if (typeof index === 'number' && index >= 0 && index < list.length) list.splice(index, 0, code);
        else list.push(code);
        data.plan[term] = list;
        data.ui.selected = code;
        data.ui.treeRoot = code;
    });
}

// Dropping onto a card means "put it here": before or after, by which half of the
// card the pointer is over.
function currCardDragOver(e, el) {
    e.preventDefault();
    e.stopPropagation();
    if (!currDragCode) return;
    const box = el.getBoundingClientRect();
    const after = e.clientY > box.top + box.height / 2;
    el.classList.toggle('drop-after', after);
    el.classList.toggle('drop-before', !after);
    const cell = el.closest('.curr-cell');
    if (cell) cell.classList.remove('drop-ok', 'drop-bad');
}

function currCardDragLeave(el) {
    el.classList.remove('drop-before', 'drop-after');
}

function currCardDrop(e, el) {
    e.preventDefault();
    e.stopPropagation();
    const after = el.classList.contains('drop-after');
    el.classList.remove('drop-before', 'drop-after');
    const code = currDragCode || e.dataTransfer.getData('text/plain');
    currDragCode = null;
    if (!code) return;
    const cell = el.closest('.curr-cell');
    const cards = Array.from(cell.querySelectorAll('.curr-card'));
    const index = cards.indexOf(el) + (after ? 1 : 0);
    currPlace(el, code, cell.getAttribute('data-term'), index);
}

// The same move without a mouse to drag with: the selected card can be walked up
// and down its cell.
function currMoveCard(e, el, by) {
    e.stopPropagation();
    const card = el.closest('.curr-card');
    const code = card.getAttribute('data-code');
    const term = card.closest('.curr-cell').getAttribute('data-term');
    currUpdate(el, function(data) {
        const list = data.plan[term] || [];
        const from = list.indexOf(code);
        const to = from + by;
        if (from === -1 || to < 0 || to >= list.length) return;
        list.splice(to, 0, list.splice(from, 1)[0]);
        data.ui.selected = code;
    });
}

function currRemove(e, el) {
    e.stopPropagation();
    const card = el.closest('.curr-card');
    const code = card.getAttribute('data-code');
    const term = card.closest('.curr-cell').getAttribute('data-term');
    currUpdate(el, function(data) {
        data.plan[term] = (data.plan[term] || []).filter(function(c) { return c !== code; });
        if (!data.plan[term].length) delete data.plan[term];
    });
}

function currAutoPlace(e, el) {
    e.stopPropagation();
    currAutoPlaceCode(el, el.closest('.curr-course').getAttribute('data-code'));
}

function currAutoPlaceCode(el, code) {
    const toolId = currGetToolId(el);
    if (!toolId) return;
    const data = currGetData(toolId);
    const course = currByCode(data)[code];
    if (!course) return;
    const term = currBestTerm(data, course);
    if (term) currPlace(el, code, term);
}

// =============================================
// LIFECYCLE
// =============================================

function currInit() {
    document.querySelectorAll('.curr-widget').forEach(function(widget) {
        const toolId = currGetToolId(widget);
        if (!toolId) return;
        const data = currGetData(toolId);
        // A catalog can arrive without having been through the loader — a board
        // imported from someone else, state from an older version of this tool.
        if (data.catalog && data.catalog.courses && !data.catalog.normalized_by_explorer) {
            data.catalog = currNormalizeDoc(data.catalog);
            currSaveData(toolId, data);
        }
        const box = widget.querySelector('.curr-json');
        if (box && !box.value) {
            if (data.draft) {
                box.value = data.draft;
                currSetStatus(widget, '', 'This is an edit you had not loaded yet — press Load to apply it.');
            } else if (data.catalog) {
                box.value = JSON.stringify(data.catalog, null, 2);
            }
        }
        currRender(widget);
    });
}

// The source pane shows either the document or the shape a document has to be in.
// Both live in it: the textarea holds the draft whichever face is showing, so
// switching never costs an edit.
function currRenderSource(widget, data) {
    const pane = widget.querySelector('.curr-source');
    if (!pane) return;
    const schema = (data.ui || {}).sourceView === 'schema';
    pane.classList.toggle('showing-schema', schema);
    pane.querySelectorAll('.curr-stab').forEach(function(tab, i) {
        tab.classList.toggle('active', (i === 1) === schema);
    });
    const box = pane.querySelector('.curr-schema-pane');
    if (box) box.innerHTML = schema ? currSchemaHtml(data) : '';
}

function currSetSourceView(el, view) {
    const widget = currGetWidget(el);
    const toolId = currGetToolId(widget);
    const data = currGetData(toolId);
    data.ui.sourceView = view === 'schema' ? 'schema' : 'document';
    currSaveData(toolId, data);
    currRenderSource(widget, data);
}

function currOnRender(toolId) {
    const widget = currWidgetFor(toolId);
    if (widget) currRender(widget);
}

PluginRegistry.registerTool({
    id: 'curriculum-doctor',
    name: 'Curriculum Doctor',
    description: 'Check a curriculum document for the problems that make a plan quietly wrong',
    icon: '🩺',
    version: CURR_VERSION,
    toolbox: 'school-tools',
    tags: ['curriculum', 'school', 'validate', 'json', 'schema', 'lint', 'education'],
    title: 'Curriculum Doctor',
    content: `<div class="cdoc-widget">
<div class="cdoc-actions"></div>
<div class="cdoc-status"></div>
<div class="authoring-split">
<div class="authoring-source cdoc-source">
<div class="cdoc-source-actions">
<button class="curr-btn" onclick="cdocLoadSource(this)" title="Read the JSON below and check it">Check</button>
<label class="curr-btn curr-file" title="Read a curriculum file">File<input type="file" accept=".json,application/json" onchange="cdocHandleFile(this)"></label>
</div>
<div class="cdoc-drop" ondragover="cdocDragOver(event, this)" ondragleave="this.classList.remove('dragover')" ondrop="cdocDropFile(event, this)">Paste the curriculum JSON below, or drop a .json file here</div>
<textarea class="cdoc-json" spellcheck="false" oninput="cdocDraftChanged(this)" placeholder="{ &quot;courses&quot;: [ ... ] }"></textarea>
</div>
<div class="authoring-resizer"></div>
<div class="authoring-result cdoc-report"></div>
</div>
</div>`,
    // Same framework the explorer uses: the JSON is the source, the report is the
    // result. A new tool has no document, so it opens where you put one.
    authoring: {
        modes: ['edit', 'split', 'render'],
        defaultMode: 'edit',
        source: '.cdoc-source',
        result: '.cdoc-report',
        actions: '.cdoc-actions',
        labels: { edit: 'JSON' },
        titles: { edit: 'The curriculum document', render: 'What is wrong with it' },
        onRender: 'cdocOnRender'
    },
    hashParams: 'cdocApplyHashParams',
    guide: 'learn/tools/curriculum-explorer.html',
    contentType: 'html',
    onInit: 'cdocInit',
    defaultWidth: 900,
    defaultHeight: 620,
    source: 'external'
});

// =============================================
// CURRICULUM DOCTOR
// =============================================
// The explorer checks a plan against a document. This checks the document itself,
// before there is a plan — which is where nearly every real problem has been. It
// reads by exactly the rules the explorer reads by, so what it reports is what the
// explorer will actually do, not a second opinion about the same file.

function cdocGetWidget(el) {
    return el && el.closest ? el.closest('.cdoc-widget') : null;
}

function cdocWidgetFor(toolId) {
    const tool = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    return tool ? tool.querySelector('.cdoc-widget') : null;
}

function cdocGetData(toolId) {
    const custom = toolCustomizations[toolId] || {};
    const d = custom.doctor || {};
    // Every field this tool keeps has to be named here, or it is written and then
    // dropped on the next read.
    return {
        catalog: d.catalog || null,
        draft: d.draft || null,
        sourceUrl: d.sourceUrl || null,
        ui: Object.assign({ open: [] }, d.ui || {})
    };
}

function cdocSaveData(toolId, data) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].doctor = data;
    try {
        saveToolCustomizations(toolCustomizations);
        return true;
    } catch (e) {
        cdocSetStatus(cdocWidgetFor(toolId), 'err', 'This document is too large for the space ' +
            'this board has left. It is checked and readable, but it will not survive a reload.');
        return false;
    }
}

function cdocSetStatus(widget, kind, message) {
    const status = widget && widget.querySelector('.cdoc-status');
    if (!status) return;
    status.className = 'cdoc-status' + (kind ? ' ' + kind : '');
    status.textContent = message || '';
}

// ---- What a title might have meant -----------------------------------------

// Tokens the two share over the tokens either has, so "AICE U.S. History" reaches
// "AICE United States History" without reaching everything else beginning "AICE".
// A near miss is offered as a question, never applied as an answer.
function cdocSuggest(index, title, limit) {
    const want = currNormTitle(title).split(' ').filter(Boolean);
    if (!want.length) return [];
    const out = [];
    Object.keys(index).forEach(function(key) {
        const have = key.split(' ').filter(Boolean);
        if (!have.length) return;
        let shared = 0;
        want.forEach(function(t) { if (have.indexOf(t) !== -1) shared++; });
        if (!shared) return;
        const score = shared / Math.max(want.length, have.length);
        if (score >= 0.45) out.push({ key: key, score: score, codes: index[key] });
    });
    out.sort(function(a, b) { return b.score - a.score; });
    return out.slice(0, limit || 3);
}

function cdocFinding(severity, kind, path, message, detail) {
    return { severity: severity, kind: kind, path: path, message: message, detail: detail || [] };
}

// What each kind of finding is, and why it is worth saying. Order is report order.
const CDOC_KINDS = [
    { kind: 'duplicate-code', severity: 'error', name: 'The same course code twice',
      why: 'Prerequisites and the plan both key on the course code, so of two courses sharing one, the second can never be reached.' },
    { kind: 'stray-level', severity: 'error', name: 'A year far outside the others',
      why: 'The plan runs over whatever years the courses name, so a single mistyped grade number stretches the grid to reach it — and leaves empty years in between.' },
    { kind: 'no-requirements', severity: 'warning', name: 'Nothing to plan against',
      why: 'The explorer counts credits against `graduation_requirements.credits_by_subject`. Without it a plan has no target, and the panel under the grid stays empty.' },
    { kind: 'prereq-unresolved', severity: 'warning', name: 'Prerequisites naming no course',
      why: 'The title is matched against course titles and their `title_variants`. One that matches nothing is dropped silently, so the course looks like it has no prerequisite at all.' },
    { kind: 'pathway-unresolved', severity: 'warning', name: 'Pathway groups naming no course',
      why: 'A group counts the courses it lists. A title matching nothing is simply not counted, which is how a group reads "1 of 9" when three are planned.' },
    { kind: 'requirement-unmatched', severity: 'warning', name: 'Requirements matching no course',
      why: 'The subject is matched against each course’s department, subject area, cross credit and satisfying flags. Matching nothing means the bar can never move.' },
    { kind: 'requirement-unreachable', severity: 'warning', name: 'Requirements that cannot be met',
      why: 'Every course that could count towards this requirement, added together, is still short of what it asks for.' },
    { kind: 'title-collision', severity: 'warning', name: 'Two courses with the same title',
      why: 'A prerequisite naming that title cannot tell them apart, and resolves to whichever comes first in the file.' },
    { kind: 'choice-unclear', severity: 'warning', name: 'Prerequisite lines to read yourself',
      why: 'Several courses are listed and the printed text does not settle whether all are required or any one will do. This cannot be read off the data, and it is reported whichever way the file currently has it — a line wrongly marked as a choice lets an unmet prerequisite pass in silence, which is worse than a line that over-warns.' },
    { kind: 'prereq-cycle', severity: 'warning', name: 'Prerequisites that loop',
      why: 'Each course in the loop needs another that needs it back, so none of them can ever be placed first.' },
    { kind: 'prereq-impossible', severity: 'warning', name: 'Prerequisites that cannot come first',
      why: 'There is no year this course is open to that leaves room for what it needs to have finished beforehand.' },
    { kind: 'coverage', severity: 'note', name: 'What the document carries',
      why: 'A field left empty across the whole catalog is usually a section the conversion skipped rather than a school that does not print it.' }
];

function cdocKind(kind) {
    for (let i = 0; i < CDOC_KINDS.length; i++) {
        if (CDOC_KINDS[i].kind === kind) return CDOC_KINDS[i];
    }
    return { kind: kind, severity: 'note', name: kind, why: '' };
}

// ---- The examination --------------------------------------------------------

function cdocCheck(catalog) {
    const findings = [];
    const empty = { findings: findings, errors: 0, warnings: 0, notes: 0, courses: 0 };
    if (!catalog || !Array.isArray(catalog.courses) || !catalog.courses.length) return empty;

    // The explorer's own helpers read a `data` object, and a catalog is all they need.
    const data = { catalog: catalog };
    const courses = currCourses(data);
    const byCode = currByCode(data);
    const index = currTitleIndex(data);
    const planner = currPlanner(data);
    const fineArts = currFineArtsIndex(data);
    const at = function(i) { return '/courses/' + i; };

    // 1 ── the same code twice
    const firstAt = {};
    courses.forEach(function(course, i) {
        const code = String(course.course_code);
        if (firstAt[code] === undefined) { firstAt[code] = i; return; }
        findings.push(cdocFinding('error', 'duplicate-code', at(i),
            'Code ' + code + ' is used by both "' + courses[firstAt[code]].title +
            '" and "' + course.title + '".'));
    });

    // 2 ── a year nothing else is near. The levels are read off the courses, so an
    //      outlier is not rejected — it is obeyed, and the grid grows to reach it.
    const stated = Array.isArray((catalog.planner || {}).levels) && catalog.planner.levels.length;
    if (!stated) {
        const run = planner.levels.slice().sort(function(a, b) { return a - b; });
        for (let k = 1; k < run.length; k++) {
            if (run[k] - run[k - 1] <= 1) continue;
            const strays = run.slice(k);
            const who = courses.filter(function(c) {
                return c.grade_levels.some(function(l) { return strays.indexOf(l) !== -1; });
            });
            findings.push(cdocFinding('error', 'stray-level', '/courses',
                'The years run ' + run.slice(0, k).join(', ') + ' and then jump to ' +
                strays.join(', ') + '.',
                who.slice(0, 6).map(function(c) {
                    return c.title + ' is open to ' + c.grade_levels.join(', ') + '.';
                })));
            break;
        }
    }

    // 3 ── prerequisites naming nothing, and what they might have meant
    courses.forEach(function(course, i) {
        (course.prerequisites.courses || []).forEach(function(name, n) {
            if (currResolveTitle(index, name)) return;
            const guesses = cdocSuggest(index, name, 3).map(function(g) {
                const c = byCode[g.codes[0]];
                return (c ? c.title : g.key) + (g.codes.length > 1 ? ' (and ' + (g.codes.length - 1) + ' more)' : '');
            });
            findings.push(cdocFinding('warning', 'prereq-unresolved',
                at(i) + '/prerequisites/courses/' + n,
                '"' + course.title + '" needs "' + name + '", which is not a course here.',
                guesses.length ? ['Did you mean: ' + guesses.join(' · ')] : []));
        });
    });

    // 4 ── pathway groups naming nothing
    (catalog.program_groupings || []).forEach(function(program, pi) {
        (program.groups || []).forEach(function(group, gi) {
            (group.courses || []).forEach(function(name, ci) {
                if (currResolveTitle(index, name)) return;
                const guesses = cdocSuggest(index, name, 2).map(function(g) {
                    const c = byCode[g.codes[0]];
                    return c ? c.title : g.key;
                });
                findings.push(cdocFinding('warning', 'pathway-unresolved',
                    '/program_groupings/' + pi + '/groups/' + gi + '/courses/' + ci,
                    (program.name || 'A pathway') + ' → ' + (group.name || 'a group') +
                    ' lists "' + name + '", which is not a course here.',
                    guesses.length ? ['Did you mean: ' + guesses.join(' · ')] : []));
            });
        });
    });

    // 5 ── requirements
    const reqs = ((catalog.graduation_requirements || {}).credits_by_subject) || [];
    if (!reqs.length) {
        findings.push(cdocFinding('warning', 'no-requirements', '/graduation_requirements',
            catalog.graduation_requirements
                ? 'There is a graduation_requirements block, but credits_by_subject is empty.'
                : 'The document states no graduation requirements.'));
    }
    reqs.forEach(function(req, ri) {
        let matched = 0;
        let available = 0;
        courses.forEach(function(course) {
            if (!currCountsToward(data, course, req.subject, fineArts)) return;
            matched++;
            available += course.credits || 0;
        });
        const path = '/graduation_requirements/credits_by_subject/' + ri;
        if (!matched) {
            findings.push(cdocFinding('warning', 'requirement-unmatched', path,
                '"' + req.subject + '" asks for ' + currFormatCredits(req.credits_required || 0) +
                ' credits, and no course in this catalog counts towards it.'));
            return;
        }
        if (available < (req.credits_required || 0)) {
            findings.push(cdocFinding('warning', 'requirement-unreachable', path,
                '"' + req.subject + '" asks for ' + currFormatCredits(req.credits_required) +
                ' credits, and every course that counts adds up to ' + currFormatCredits(available) + '.'));
        }
    });

    // 6 ── two courses answering to one title
    Object.keys(index).forEach(function(key) {
        if (index[key].length < 2) return;
        const titles = index[key].map(function(c) { return (byCode[c] || {}).title || c; });
        findings.push(cdocFinding('warning', 'title-collision', '/courses',
            index[key].length + ' courses answer to the title "' + titles[0] + '": ' +
            index[key].join(', ') + '.'));
    });

    // 7 ── lines only a person can settle. Reported whichever way the file has
    //      them: the flag is a claim about the source document, and a wrong claim
    //      in the permissive direction passes an unmet prerequisite in silence.
    courses.forEach(function(course, i) {
        const p = course.prerequisites;
        if ((p.courses || []).length < 2) return;
        if (/ or /i.test(p.raw || '')) return;
        findings.push(cdocFinding('warning', 'choice-unclear', at(i) + '/prerequisites',
            '"' + course.title + '" lists ' + p.courses.length + ' prerequisites: ' +
            p.courses.join(', ') + '.',
            [p.raw ? 'The guide says: ' + p.raw
                   : 'The guide prints no prerequisite text for this course.',
             p.choice === true
                ? 'Currently read as: any one of them will do — and nothing in the printed text says so.'
                : 'Currently read as: all of them are required.']));
    });

    // 8 ── loops
    const seen = {};
    const stack = {};
    const reported = {};
    const walk = function(code, trail) {
        if (stack[code]) {
            const loop = trail.slice(trail.indexOf(code)).concat([code]);
            const key = loop.slice().sort().join('>');
            if (!reported[key]) {
                reported[key] = true;
                findings.push(cdocFinding('warning', 'prereq-cycle', '/courses',
                    loop.map(function(c) { return (byCode[c] || {}).title || c; }).join(' → ') + '.'));
            }
            return;
        }
        if (seen[code]) return;
        seen[code] = true;
        stack[code] = true;
        const course = byCode[code];
        if (course) {
            (course.prerequisites.courses || []).forEach(function(name) {
                const next = currResolveTitle(index, name);
                if (next) walk(next, trail.concat([code]));
            });
        }
        stack[code] = false;
    };
    courses.forEach(function(c) { walk(c.course_code, []); });

    // 9 ── nothing early enough to put it after
    courses.forEach(function(course, i) {
        const names = course.prerequisites.courses || [];
        if (!names.length || !course.grade_levels.length) return;
        const needs = names.map(function(n) { return currResolveTitle(index, n); })
            .filter(Boolean).map(function(c) { return byCode[c]; })
            .filter(function(c) { return c && c.grade_levels.length; });
        if (!needs.length) return;
        const choice = course.prerequisites.choice === true || / or /i.test(course.prerequisites.raw || '');
        const works = course.grade_levels.some(function(level) {
            const fits = function(n) { return n.grade_levels.some(function(l) { return l < level; }); };
            return choice ? needs.some(fits) : needs.every(fits);
        });
        if (works) return;
        findings.push(cdocFinding('warning', 'prereq-impossible', at(i),
            '"' + course.title + '" is open to ' + course.grade_levels.join(', ') +
            ', and ' + (choice ? 'none of' : 'not all of') + ' what it needs can be taken earlier.',
            [needs.map(function(n) { return n.title + ' (' + n.grade_levels.join(', ') + ')'; }).join(' · ')]));
    });

    // 10 ── what the document carries at all
    const filled = { credits: 0, grade_levels: 0, semester_offered: 0, description: 0,
        prerequisites: 0, 'prerequisites.raw': 0 };
    courses.forEach(function(c) {
        if (c.credits) filled.credits++;
        if (c.grade_levels.length) filled.grade_levels++;
        if (c.semester_offered) filled.semester_offered++;
        if (c.description) filled.description++;
        if ((c.prerequisites.courses || []).length) filled.prerequisites++;
        if (c.prerequisites.raw) filled['prerequisites.raw']++;
    });
    findings.push(cdocFinding('note', 'coverage', '/courses',
        courses.length + ' courses.', Object.keys(filled).map(function(k) {
            return k + '\t' + filled[k];
        })));

    let errors = 0, warnings = 0, notes = 0;
    findings.forEach(function(f) {
        if (f.severity === 'error') errors++;
        else if (f.severity === 'warning') warnings++;
        else notes++;
    });
    return { findings: findings, errors: errors, warnings: warnings, notes: notes,
        courses: courses.length };
}

// ---- The report -------------------------------------------------------------

function cdocReportHtml(data) {
    if (!data.catalog) {
        return '<div class="cdoc-empty">No document to check yet.<br>' +
            'Paste a curriculum in the JSON pane, drop a file on it, or open one by link.</div>';
    }
    const result = cdocCheck(data.catalog);
    const open = data.ui.open || [];
    const tally = function(n, cls, word) {
        return '<span class="cdoc-tally ' + cls + '"><b>' + n + '</b> ' +
            word + (n === 1 ? '' : 's') + '</span>';
    };
    let html = '<div class="cdoc-score">' +
        tally(result.errors, 'err', 'error') +
        tally(result.warnings, 'warn', 'warning') +
        tally(result.notes, 'note', 'note') +
        '<span class="cdoc-tally note">' + result.courses + ' courses</span>' +
        (result.errors + result.warnings === 0
            ? '<span class="cdoc-clean">Nothing to fix.</span>' : '') +
        '<button class="curr-btn" style="margin-left:auto" onclick="cdocCopyBrief(this)" ' +
            'title="A description of every finding, to hand back to whatever wrote the file">' +
            'Copy repair brief</button>' +
        '</div>';

    CDOC_KINDS.forEach(function(spec) {
        const mine = result.findings.filter(function(f) { return f.kind === spec.kind; });
        if (!mine.length) return;
        const showing = open.indexOf(spec.kind) !== -1;
        html += '<div class="cdoc-group">' +
            '<div class="cdoc-group-head" onclick="cdocToggleGroup(this, \'' + spec.kind + '\')">' +
                '<span class="cdoc-caret">' + (showing ? '▾' : '▸') + '</span>' +
                '<span class="cdoc-pill ' + (spec.severity === 'error' ? 'err' :
                    spec.severity === 'warning' ? 'warn' : 'note') + '">' + spec.severity + '</span>' +
                '<span class="cdoc-name">' + escapeHtml(spec.name) + '</span>' +
                '<span class="cdoc-count">' + mine.length + '</span>' +
            '</div>';
        if (showing) {
            html += '<div class="cdoc-why">' + escapeHtml(spec.why) + '</div>';
            if (spec.kind === 'coverage') {
                html += '<div class="cdoc-item"><table class="cdoc-table">' +
                    mine[0].detail.map(function(row) {
                        const bits = row.split('\t');
                        const n = parseInt(bits[1], 10);
                        return '<tr' + (n ? '' : ' class="thin"') + '><td>' + escapeHtml(bits[0]) +
                            '</td><td>' + bits[1] + ' of ' + result.courses + '</td></tr>';
                    }).join('') + '</table></div>';
            } else {
                html += mine.map(function(f) {
                    return '<div class="cdoc-item">' + escapeHtml(f.message) +
                        f.detail.map(function(d) {
                            return '<div class="cdoc-detail">' + escapeHtml(d) + '</div>';
                        }).join('') +
                        '<div class="cdoc-path">' + escapeHtml(f.path) + '</div>' +
                    '</div>';
                }).join('');
            }
        }
        html += '</div>';
    });
    return html;
}

function cdocRender(widget) {
    if (!widget) return;
    const toolId = currGetToolId(widget);
    if (!toolId) return;
    const report = widget.querySelector('.cdoc-report');
    if (!report) return;
    widget.classList.toggle('narrow', widget.offsetWidth > 0 && widget.offsetWidth < 640);
    const kept = report.scrollTop;
    report.innerHTML = cdocReportHtml(cdocGetData(toolId));
    report.scrollTop = kept;
}

function cdocToggleGroup(el, kind) {
    const widget = cdocGetWidget(el);
    const toolId = currGetToolId(widget);
    const data = cdocGetData(toolId);
    data.ui.open = data.ui.open || [];
    const at = data.ui.open.indexOf(kind);
    if (at === -1) data.ui.open.push(kind); else data.ui.open.splice(at, 1);
    cdocSaveData(toolId, data);
    cdocRender(widget);
}

// ---- The brief --------------------------------------------------------------

// Written to be pasted back to whatever produced the file, alongside the file
// itself. It says what is wrong, where, and — for the one class of finding that
// cannot be settled from the data — what not to guess.
function cdocBrief(data) {
    const result = cdocCheck(data.catalog);
    const lines = [];
    lines.push('Please correct this curriculum JSON. It was checked against the schema the');
    lines.push('Toolboard Curriculum Explorer reads, and ' + result.errors + ' errors and ' +
        result.warnings + ' warnings were found across ' + result.courses + ' courses.');
    lines.push('');
    lines.push('Paths below are JSON pointers into the file. Change only what is named.');
    lines.push('');

    CDOC_KINDS.forEach(function(spec) {
        const mine = result.findings.filter(function(f) {
            return f.kind === spec.kind && f.severity !== 'note';
        });
        if (!mine.length) return;
        lines.push('## ' + spec.name.toUpperCase() + ' (' + mine.length + ', ' + spec.severity + ')');
        lines.push(spec.why);
        lines.push('');
        mine.forEach(function(f) {
            lines.push('- ' + f.path);
            lines.push('  ' + f.message);
            f.detail.forEach(function(d) { lines.push('  ' + d); });
        });
        lines.push('');
    });

    if (result.findings.some(function(f) { return f.kind === 'choice-unclear'; })) {
        lines.push('## ON THE AMBIGUOUS PREREQUISITE LINES');
        lines.push('Do not guess these from the shape of the list. Go back to the source');
        lines.push('document and read the sentence. Add "choice": true to the prerequisites');
        lines.push('object only where the document says one of the listed courses will do.');
        lines.push('Leaving it off makes the planner warn when it should not, which is a');
        lines.push('nuisance. Putting it on wrongly makes the planner accept a plan that has');
        lines.push('not met the prerequisite, and say nothing, which is worse.');
        lines.push('');
    }
    lines.push('## DO NOT');
    lines.push('- Do not invent courses to satisfy an unresolved title. If the course is');
    lines.push('  genuinely absent from the catalog, remove the reference or say so.');
    lines.push('- Do not rename a course to match a prerequisite. Add the printed form to');
    lines.push('  that course\'s title_variants instead, so both spellings resolve.');
    lines.push('- Do not change course codes. The plan is keyed on them.');
    return lines.join('\n');
}

function cdocCopyBrief(btn) {
    const widget = cdocGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    const data = cdocGetData(toolId);
    if (!data.catalog) {
        cdocSetStatus(widget, 'err', 'There is nothing to write a brief about yet.');
        return;
    }
    const text = cdocBrief(data);
    const done = function() {
        cdocSetStatus(widget, 'ok', 'Repair brief copied — ' + text.split('\n').length +
            ' lines. Paste it back with the file.');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function() {
            cdocSetStatus(widget, 'err', 'The brief could not be copied.');
        });
        return;
    }
    const box = widget.querySelector('.cdoc-json');
    box.value = text;
    box.select();
    done();
}

// ---- Getting a document in ---------------------------------------------------

function cdocLoadDoc(widget, toolId, doc, note) {
    const data = cdocGetData(toolId);
    data.catalog = doc;
    delete data.draft;
    cdocSaveData(toolId, data);
    const result = cdocCheck(doc);
    cdocSetStatus(widget, result.errors ? 'err' : (result.warnings ? '' : 'ok'),
        note || (doc.courses.length + ' courses checked — ' + result.errors + ' errors, ' +
            result.warnings + ' warnings.'));
    if (typeof setToolMode === 'function') setToolMode(toolId, 'render');
    cdocRender(widget);
}

function cdocLoadSource(btn) {
    const widget = cdocGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    const text = widget.querySelector('.cdoc-json').value.trim();
    if (!text) {
        cdocSetStatus(widget, 'err', 'Nothing to check: paste a curriculum document first.');
        return;
    }
    // A document too broken to parse is exactly what this tool is for, so the
    // parser's own complaints are the report.
    const parsed = currParse(text);
    if (!parsed.ok) {
        cdocSetStatus(widget, 'err', 'This document cannot be read at all:\n' +
            parsed.errors.join('\n') + (parsed.more ? '\n…and ' + parsed.more + ' more' : ''));
        return;
    }
    cdocLoadDoc(widget, toolId, parsed.doc);
}

function cdocDraftChanged(box) {
    const widget = cdocGetWidget(box);
    const toolId = currGetToolId(box);
    if (!widget || !toolId) return;
    clearTimeout(cdocDraftTimer);
    const text = box.value;
    cdocDraftTimer = setTimeout(function() {
        const data = cdocGetData(toolId);
        const loaded = data.catalog ? JSON.stringify(data.catalog, null, 2) : '';
        if (text === loaded || !text.trim()) {
            delete data.draft;
            cdocSaveData(toolId, data);
            return;
        }
        data.draft = text;
        if (cdocSaveData(toolId, data)) {
            cdocSetStatus(widget, '', 'Edited — press Check to read it. Kept for now, either way.');
        }
    }, 500);
}

function cdocHandleFile(input) {
    const widget = cdocGetWidget(input);
    const toolId = currGetToolId(input);
    if (input.files && input.files[0]) cdocReadFile(widget, toolId, input.files[0]);
    input.value = '';
}

function cdocDragOver(e, el) {
    e.preventDefault();
    el.classList.add('dragover');
}

function cdocDropFile(e, el) {
    e.preventDefault();
    el.classList.remove('dragover');
    const widget = cdocGetWidget(el);
    const toolId = currGetToolId(el);
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) cdocReadFile(widget, toolId, file);
}

function cdocReadFile(widget, toolId, file) {
    if (!widget || !toolId) return;
    const reader = new FileReader();
    reader.onload = function() {
        widget.querySelector('.cdoc-json').value = String(reader.result);
        cdocLoadSource(widget.querySelector('.cdoc-json'));
    };
    reader.onerror = function() { cdocSetStatus(widget, 'err', 'That file could not be read.'); };
    reader.readAsText(file);
}

async function cdocApplyHashParams(toolId, params) {
    const url = params.curriculum || params.url || params.src;
    if (!url) return;
    const widget = cdocWidgetFor(toolId);
    if (!widget) return;
    const data = cdocGetData(toolId);
    if (data.catalog && data.sourceUrl === url) return;
    let text;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        text = await res.text();
    } catch (e) {
        cdocSetStatus(widget, 'err', 'That document could not be fetched: ' + e.message);
        return;
    }
    const parsed = currParse(text);
    if (!parsed.ok) {
        cdocSetStatus(widget, 'err', 'This document cannot be read at all:\n' + parsed.errors.join('\n'));
        return;
    }
    widget.querySelector('.cdoc-json').value = text;
    const fresh = cdocGetData(toolId);
    fresh.sourceUrl = url;
    cdocSaveData(toolId, fresh);
    cdocLoadDoc(widget, toolId, parsed.doc);
}

function cdocInit() {
    document.querySelectorAll('.cdoc-widget').forEach(function(widget) {
        const toolId = currGetToolId(widget);
        if (!toolId) return;
        const data = cdocGetData(toolId);
        const box = widget.querySelector('.cdoc-json');
        if (box && !box.value) {
            if (data.draft) box.value = data.draft;
            else if (data.catalog) box.value = JSON.stringify(data.catalog, null, 2);
        }
        cdocRender(widget);
    });
}

function cdocOnRender(toolId) {
    const widget = cdocWidgetFor(toolId);
    if (widget) cdocRender(widget);
}

(function injectScriptsForExport() {
    if (document.getElementById('school-tools-scripts')) return;

    var currFunctions = [currGetToolId, currGetWidget, currWidgetFor, currDefaults, currGetData,
        currSaveData, currSaveDataSoon, currSetStatus, currParse, currNormalizeDoc, currLoadDoc, currLoadSource,
        currDisarm, currNeedsConfirm, currWorkInProgress, currEntries,
        currLoadSample, currDraftChanged, currApplyHashParams, currDescribeSource, currProxyUrl, currCanProxy,
        currCannotFetchLocally,
        currLoadFromUrl, currHandleFile, currDragOver, currDropFile, currReadFile, currCourses,
        currByCode, currNormTitle, currTitleIndex, currResolveTitle, currTermKey, currTermParse,
        currTermLabel, currTermPos, currTermStart, currTermEnd, currAllowedSlots, currPlacementOf,
        currTermSlug, currTermOrder, currTermKind, currPlanner, currLevelLabel, currTermById,
        currSlotLabel, currAddLevel, currRemoveLevel, currSchemaRows, currSchemaHtml,
        currRenderSource, currSetSourceView,
        currCopySchema, currLoadSchemaIntoEditor, currExportPng, currToolTitle, currDocTitle,
        currPrintFields, currPrintValue, currCatalogPrintHtml, currExportPdf,
        currAllPlacements, currIsCompleted, currCompletedCredits, currFormatCredits, currIssue,
        currValidate, currPrereqsMetBy,
        currBestTerm, currRender, currRenderFor, currMatchesFilters, currIsHidden,
        currUniqueValues, currFlagLabel, currFlagsInUse, currOptions, currCatalogView, currCountHtml, currCatalogHtml, currListHtml,
        currRenderCatalogList, currPdfLabel, currLevelTagClass, currShortSemester,
        currCourseRowHtml, currCatalogFoldedHtml, currToggleCatalog, currDetailsHtml, currRightHtml, currGridHtml, currCellHtml,
        currCardHtml, currLevelCredits, currFineArtsIndex, currCountsToward, currTotalsHtml,
        currIssuesHtml, currTreeGraph, currDepth,
        currWalk, currTreeLayout, currTreeHtml, currUpdate, currSetSearch, currSetFilter,
        currLevelAbbr, currToggleSection, currToggleShowHidden, currToggleOnlyMet,
        currToggleCompleted, currToggleCompletedCode, currToggleList, currToggleHideCourse,
        currToggleHideDepartment, currToggleHideSubject, currSelectCourse, currCardClick,
        currSetTab, currToggleDependents, currToggleReq, currSelectCode, currTreeSetRoot,
        currGoToIssue, currCourseDragStart,
        currCellDragOver, currCellDragLeave, currCellDrop, currCellClick, currCardDragOver,
        currCardDragLeave, currCardDrop, currMoveCard, currPlace, currRemove,
        currAutoPlace, currAutoPlaceCode, currSampleCourse, currInit, currOnRender,
        cdocGetWidget, cdocWidgetFor, cdocGetData, cdocSaveData, cdocSetStatus,
        cdocSuggest, cdocFinding, cdocKind, cdocCheck, cdocReportHtml, cdocRender,
        cdocToggleGroup, cdocBrief, cdocCopyBrief, cdocLoadDoc, cdocLoadSource,
        cdocDraftChanged, cdocHandleFile, cdocDragOver, cdocDropFile, cdocReadFile,
        cdocApplyHashParams, cdocInit, cdocOnRender];

    var code = '(function() {\n' +
        'if (typeof currInit !== "undefined") return;\n' +
        'window.CURR_SPAN = ' + JSON.stringify(CURR_SPAN) + ';\n' +
        'window.CURR_SEASON_ORDER = ' + JSON.stringify(CURR_SEASON_ORDER) + ';\n' +
        'window.CURR_SCHEMA = ' + JSON.stringify(CURR_SCHEMA) + ';\n' +
        // These carry regular expressions, so they are rebuilt rather than JSON'd.
        'window.CURR_OPTIONAL_TERM = ' + CURR_OPTIONAL_TERM.toString() + ';\n' +
        'window.CURR_SPAN_TERM = ' + CURR_SPAN_TERM.toString() + ';\n' +
        'window.CURR_ANY_TERM = ' + CURR_ANY_TERM.toString() + ';\n' +
        'window.CURR_FLAG_NAMES = ' + JSON.stringify(CURR_FLAG_NAMES) + ';\n' +
        // The rules carry regular expressions, so they are rebuilt rather than JSON'd.
        'window.CURR_REQUIREMENT_FLAGS = [' + CURR_REQUIREMENT_FLAGS.map(function(rule) {
            return '{flag:' + JSON.stringify(rule.flag) + ',subject:' + rule.subject.toString() + '}';
        }).join(',') + '];\n' +
        'window.CURR_REQUIRED_FIELDS = ' + JSON.stringify(CURR_REQUIRED_FIELDS) + ';\n' +
        'window.CURR_SAMPLE = ' + JSON.stringify(CURR_SAMPLE) + ';\n' +
        'window.CURR_VERSION = ' + JSON.stringify(CURR_VERSION) + ';\n' +
        'window.CURR_MAX_BYTES = ' + CURR_MAX_BYTES + ';\n' +
        'window.CURR_PRINT_SKIP = ' + JSON.stringify(CURR_PRINT_SKIP) + ';\n' +
        'window.CURR_CORS_PROXY = ' + JSON.stringify(CURR_CORS_PROXY) + ';\n' +
        'window.CURR_ARM_MS = ' + CURR_ARM_MS + '; window.currArmed = {};\n' +
        'window.CURR_NODE_W = ' + CURR_NODE_W + '; window.CURR_NODE_H = ' + CURR_NODE_H + ';\n' +
        'window.CURR_GAP_X = ' + CURR_GAP_X + '; window.CURR_GAP_Y = ' + CURR_GAP_Y + ';\n' +
        'window.currDragCode = null; window.currSaveTimer = null; window.currDraftTimer = null;\n' +
        'window.cdocDraftTimer = null;\n' +
        'window.CDOC_KINDS = ' + JSON.stringify(CDOC_KINDS) + ';\n' +
        'if (typeof escapeHtml === "undefined") { window.escapeHtml = ' + escapeHtml.toString() + '; }\n' +
        currFunctions.map(function(fn) { return 'window.' + fn.name + ' = ' + fn.toString(); }).join(';\n') + ';\n' +
        '})();';
    var encoded = btoa(unescape(encodeURIComponent(code)));

    var script = document.createElement('script');
    script.id = 'school-tools-scripts';
    script.textContent = 'eval(decodeURIComponent(escape(atob("' + encoded + '"))))';
    (document.body || document.head).appendChild(script);
})();

// The version is logged so it is possible to tell, from the console, which copy of
// this file a page is actually running — a cached one looks identical otherwise.
console.log('School Tools plugin loaded (2 tools) v' + CURR_VERSION);
