// School Tools Toolbox Plugin
// Contains the Curriculum Builder, the Curriculum Doctor and the Curriculum
// Explorer — one document, made, checked, and planned against.
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
.curr-tag.earns { border-color: #27ae60; color: #27ae60; }
.curr-details .curr-earns { color: #27ae60; }
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

/* ---- Grades ---- */
.curr-mark { padding: 1px 3px; border: 1px solid var(--border-color); border-radius: 3px; background: var(--input-bg); color: var(--text-primary); font-size: 10px; width: 100%; min-width: 0; }
.curr-mark.final { font-weight: 600; }
.curr-card-grade { flex: 0 0 auto; font-size: 10px; font-weight: 600; color: var(--text-secondary); padding: 0 3px; border-radius: 3px; }
.curr-card-grade.entered { color: var(--text-primary); background: var(--bg-tertiary); }
.curr-year-gpa { font-size: 9px; color: var(--text-secondary); }

.curr-marks { border-top: 1px solid var(--border-light); margin-top: 5px; padding-top: 4px; }
.curr-marks-head { font-size: 11px; font-weight: 600; margin-bottom: 3px; }
.curr-marks-row { display: flex; gap: 4px; flex-wrap: wrap; }
.curr-mark-cell { flex: 0 0 52px; display: flex; flex-direction: column; gap: 1px; }
.curr-mark-cell span { font-size: 9px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.curr-mark-cell.exam span { color: #e67e22; }
.curr-marks-final { display: flex; align-items: center; gap: 6px; margin-top: 5px; }
.curr-marks-final > span:first-child { font-size: 11px; font-weight: 600; }
.curr-marks-final .curr-mark { flex: 0 0 62px; }
.curr-mark-note { font-size: 10px; color: var(--text-secondary); }
.curr-mark-note.entered { color: #e67e22; }

.curr-grades { overflow: auto; flex: 1; min-height: 0; font-size: 11px; }
.curr-grades-year { border: 1px solid var(--border-light); border-radius: 5px; margin-bottom: 6px; overflow: hidden; }
.curr-grades-year-head { display: flex; align-items: baseline; gap: 8px; padding: 3px 7px; background: var(--bg-tertiary); }
.curr-grades-year-head b { flex: 1 1 auto; }
.curr-grades-year-head span { flex: 0 0 auto; font-size: 10px; color: var(--text-secondary); }
.curr-grades-row { display: flex; align-items: center; gap: 4px; padding: 2px 7px; border-top: 1px solid var(--border-light); }
.curr-grades-name { flex: 1 1 auto; min-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; }
.curr-grades-name:hover { color: #3498db; }
.curr-grades-cell { flex: 0 0 50px; }
.curr-grades-row.heads { font-size: 9px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .4px; padding-top: 3px; }
.curr-grades-row.heads .curr-grades-cell { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.curr-grades-row.heads .curr-grades-final { display: block; }
.curr-grades-gap { display: block; text-align: center; color: var(--text-muted); opacity: .5; }
.curr-grades-cell.exam .curr-mark { border-color: #e67e22; }
.curr-grades-final { flex: 0 0 96px; display: flex; align-items: center; gap: 4px; }
.curr-grades-final .curr-mark { flex: 0 0 52px; }
.curr-grades-final i { font-style: normal; font-size: 10px; color: var(--text-secondary); }
.curr-grades-final.entered i { color: #e67e22; }
.curr-grades-total { display: flex; gap: 10px; align-items: baseline; padding: 5px 7px; border-top: 2px solid var(--border-color); }
.curr-grades-total span { color: var(--text-secondary); font-size: 10px; }
.curr-career-grade { flex: 0 0 34px; text-align: right; font-weight: 600; }

.curr-grading { border-top: 1px solid var(--border-light); padding-top: 5px; margin-bottom: 6px; }
.curr-grading-row { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; font-size: 11px; }
.curr-grading-lbl { font-size: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .5px; }
.curr-grading-row select, .curr-grading-row input[type="number"] { padding: 2px 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 11px; }
.curr-grading-row input[type="number"] { width: 48px; }
.curr-grading-row label { display: inline-flex; align-items: center; gap: 3px; color: var(--text-secondary); }
.curr-grading-custom { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; padding-top: 4px; }
.curr-grading-val { display: inline-flex; align-items: center; gap: 2px; }
.curr-grading-val input { padding: 2px 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 11px; }
.curr-grading-val input:first-child { width: 42px; }
.curr-grading-val input:nth-child(2) { width: 46px; }

/* ---- Several schools, one student ---- */
.curr-schools { display: flex; align-items: center; gap: 6px; padding: 4px 0 5px; flex: 0 0 auto; border-bottom: 1px solid var(--border-light); margin-bottom: 5px; flex-wrap: wrap; }
.curr-schools:empty { display: none; }
.curr-school-lbl { font-size: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .5px; }
.curr-school-pick { flex: 1 1 auto; min-width: 120px; max-width: 420px; padding: 3px 5px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 11px; }
.curr-schools-bar:empty { display: none; }

.curr-school-pane:empty { display: none; }
.curr-school-list { display: flex; flex-direction: column; gap: 3px; padding-bottom: 6px; margin-bottom: 6px; border-bottom: 1px solid var(--border-light); }
.curr-school-row { display: flex; align-items: center; gap: 4px; font-size: 11px; }
.curr-school-row.on .curr-school-name { font-weight: 600; }
.curr-school-go { flex: 0 0 auto; background: none; border: 0; color: var(--text-muted); cursor: pointer; font-size: 10px; padding: 0 2px; }
.curr-school-go:hover { color: #3498db; }
.curr-school-row input { padding: 2px 5px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 11px; min-width: 0; }
.curr-school-name { flex: 1 1 auto; }
.curr-school-grades { flex: 0 0 68px; }
.curr-school-years { flex: 0 0 78px; }
.curr-school-n { flex: 0 0 auto; font-size: 10px; color: var(--text-muted); white-space: nowrap; }
.curr-x { background: none; border: 0; color: var(--text-muted); cursor: pointer; font-size: 13px; line-height: 1; padding: 0 3px; }
.curr-x:hover { color: #e74c3c; }
.curr-x.armed { color: #e67e22; font-weight: bold; }

.curr-year-when { font-size: 9px; color: var(--text-muted); }

.curr-transfers { flex: 0 0 auto; border-top: 1px solid var(--border-light); margin-top: 5px; padding-top: 4px; max-height: 45%; display: flex; flex-direction: column; min-height: 0; }
.curr-transfers-head { display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 11px; padding: 2px 0; }
.curr-transfers-head:hover { background: var(--table-hover); }
.curr-transfer-body { overflow: auto; min-height: 0; padding: 3px 0 0 12px; }
.curr-transfer { display: flex; align-items: baseline; gap: 6px; font-size: 11px; padding: 2px 0; flex-wrap: wrap; }
.curr-transfer.unmatched { color: var(--text-secondary); }
.curr-transfer-title { flex: 1 1 auto; min-width: 90px; }
.curr-transfer-from { flex: 0 0 auto; font-size: 10px; color: var(--text-muted); }
.curr-transfer-to { flex: 0 0 auto; font-size: 10px; color: #27ae60; }
.curr-transfer-to.close { color: #e67e22; }
.curr-transfer-to em { font-style: normal; opacity: .85; }
.curr-transfer-to.none { color: var(--text-muted); display: inline-flex; align-items: center; gap: 5px; }
.curr-loose { display: flex; align-items: center; gap: 4px; padding: 2px 0; }
.curr-loose input, .curr-loose select { padding: 2px 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 11px; min-width: 0; }
.curr-loose-title { flex: 1 1 auto; }
.curr-loose-credits { flex: 0 0 52px; }
.curr-loose-subject { flex: 0 0 108px; }

.curr-career { overflow: auto; flex: 1; min-height: 0; font-size: 11px; padding-right: 4px; }
.curr-career-school { border: 1px solid var(--border-light); border-radius: 6px; margin-bottom: 8px; overflow: hidden; }
.curr-career-head { display: flex; align-items: center; gap: 8px; background: var(--bg-tertiary); padding: 5px 8px; }
.curr-career-head b { flex: 0 0 auto; font-size: 12px; }
.curr-career-head span { flex: 1 1 auto; color: var(--text-secondary); font-size: 10px; }
.curr-career-year { border-top: 1px solid var(--border-light); }
.curr-career-year-head { display: flex; align-items: baseline; gap: 8px; padding: 3px 8px; background: var(--bg-tertiary); }
.curr-career-year-head b { flex: 0 0 auto; }
.curr-career-when { flex: 1 1 auto; color: var(--text-muted); font-size: 10px; }
.curr-career-cr { flex: 0 0 auto; color: var(--text-secondary); font-size: 10px; }
.curr-career-course { display: flex; align-items: baseline; gap: 8px; padding: 2px 8px 2px 18px; border-top: 1px solid var(--border-light); }
.curr-career-title { flex: 1 1 auto; min-width: 0; }
.curr-career-slot { flex: 0 0 auto; font-size: 10px; color: var(--text-muted); }
.curr-career-note { padding: 4px 8px; font-size: 10px; color: var(--text-secondary); border-top: 1px solid var(--border-light); }
.curr-career-total { display: flex; gap: 10px; align-items: baseline; padding: 6px 8px; border-top: 2px solid var(--border-color); }
.curr-career-total span { color: var(--text-secondary); font-size: 10px; }

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

/* ---- Curriculum Builder ---- */
.cbld-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; min-width: 0; font-size: 12px; color: var(--text-primary); }
.cbld-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.cbld-status { font-size: 11px; padding: 3px 0; white-space: pre-wrap; flex: 0 0 auto; }
.cbld-status:empty { display: none; }
.cbld-status.ok { color: #27ae60; }
.cbld-status.err { color: #e74c3c; }
.cbld-editor { display: flex; flex-direction: column; gap: 6px; min-height: 0; min-width: 0; flex: 1 1 62%; }
.cbld-out { display: flex; flex-direction: column; min-height: 0; min-width: 0; flex: 1 1 38%; }
.tool.authoring-split .cbld-editor { padding-right: 8px; }
.tool.authoring-split .cbld-out { padding-left: 8px; }

/* The empty tool: three ways to get a document in, and nothing else. */
.cbld-start { display: flex; flex-direction: column; gap: 8px; padding: 12px; overflow: auto; }
.cbld-start h4 { margin: 0; font-size: 13px; }
.cbld-start p { margin: 0; color: var(--text-secondary); }
.cbld-drop { border: 1px dashed var(--border-color); border-radius: 6px; padding: 8px; text-align: center; color: var(--text-secondary); font-size: 11px; }
.cbld-drop.dragover { border-color: #3498db; color: var(--text-primary); }
.cbld-import { min-height: 90px; resize: vertical; font-family: 'Monaco', 'Courier New', monospace; font-size: 11px; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); }

/* The tally sits above everything, because it is the answer to "is this right yet". */
.cbld-check { border: 1px solid var(--border-light); border-radius: 5px; flex: 0 1 auto; max-height: 40%; display: flex; flex-direction: column; min-height: 0; }
.cbld-check-head { display: flex; align-items: center; gap: 10px; padding: 4px 8px; cursor: pointer; background: var(--bg-tertiary); flex-wrap: wrap; }
.cbld-check-head:hover { background: var(--table-hover); }
.cbld-check-head .cbld-caret { color: var(--text-muted); font-size: 9px; }
.cbld-check-body { overflow: auto; padding: 6px; min-height: 0; }
.cbld-goto { cursor: pointer; }
.cbld-goto:hover { background: var(--table-hover); }

.cbld-body { display: flex; gap: 8px; flex: 1; min-height: 0; min-width: 0; }
.cbld-nav { flex: 0 0 82px; display: flex; flex-direction: column; gap: 2px; border-right: 1px solid var(--border-light); padding-right: 6px; }
.cbld-tab { text-align: left; background: none; border: 1px solid transparent; border-radius: 4px; padding: 4px 6px; font-size: 11px; color: var(--text-secondary); cursor: pointer; }
.cbld-tab:hover { background: var(--table-hover); color: var(--text-primary); }
.cbld-tab.active { background: #3498db; border-color: #3498db; color: #fff; }
.cbld-tab .cbld-n { float: right; opacity: 0.7; font-size: 10px; }
.cbld-pane { flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.cbld-scroll { overflow: auto; min-height: 0; flex: 1; }

.cbld-row { display: flex; align-items: baseline; gap: 6px; padding: 2px 0; }
.cbld-label { flex: 0 0 106px; color: var(--text-secondary); font-size: 11px; text-align: right; }
.cbld-in { flex: 1 1 auto; min-width: 40px; padding: 3px 5px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 11px; }
.cbld-in.short { flex: 0 0 74px; }
textarea.cbld-in { min-height: 46px; resize: vertical; font-family: inherit; }
.cbld-note { color: var(--text-secondary); font-size: 10px; padding: 2px 0 4px 112px; }
.cbld-block { border-top: 1px solid var(--border-light); margin-top: 6px; padding-top: 5px; }
.cbld-block-head { font-weight: 600; font-size: 11px; margin-bottom: 3px; }
.cbld-checks { display: flex; flex-wrap: wrap; gap: 8px; }
.cbld-check-lbl { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: var(--text-secondary); white-space: nowrap; }
.cbld-x { background: none; border: 0; color: var(--text-muted); cursor: pointer; font-size: 13px; line-height: 1; padding: 0 3px; }
.cbld-x:hover { color: #e74c3c; }
.cbld-add { background: none; border: 1px dashed var(--border-color); border-radius: 4px; color: var(--text-secondary); font-size: 10px; padding: 2px 8px; cursor: pointer; margin: 3px 0; }
.cbld-add:hover { border-color: #3498db; color: var(--text-primary); }

/* A title typed at a course that may not exist, answered as it is typed. */
.cbld-mrow { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px; padding: 1px 0; }
.cbld-mrow .cbld-in { flex: 1 1 140px; }
.cbld-hint { flex: 1 1 100%; font-size: 10px; color: var(--text-secondary); padding-left: 4px; }
.cbld-hit { color: #27ae60; }
.cbld-miss { color: #e74c3c; }
.cbld-guess { background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; font-size: 10px; padding: 0 6px; cursor: pointer; color: var(--text-primary); margin-left: 3px; }
.cbld-guess:hover { background: var(--table-hover); }

/* The catalog itself: a list you pick from, and the picked course underneath. */
.cbld-list-bar { display: flex; gap: 4px; align-items: center; padding-bottom: 4px; flex: 0 0 auto; }
.cbld-list { overflow: auto; min-height: 60px; flex: 1 1 auto; border: 1px solid var(--border-light); border-radius: 4px; }
.cbld-group-head { position: sticky; top: 0; background: var(--bg-tertiary); padding: 2px 6px; font-size: 10px; color: var(--text-secondary); border-bottom: 1px solid var(--border-light); }
.cbld-crow { display: flex; gap: 6px; align-items: baseline; padding: 2px 6px; cursor: pointer; border-bottom: 1px solid var(--border-light); }
.cbld-crow:hover { background: var(--table-hover); }
.cbld-crow.on { background: rgba(52, 152, 219, 0.16); }
.cbld-crow .c-code { flex: 0 0 56px; font-family: 'Monaco', 'Courier New', monospace; font-size: 10px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; }
.cbld-crow .c-title { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cbld-crow .c-meta { flex: 0 0 auto; font-size: 10px; color: var(--text-secondary); }
.cbld-form { flex: 0 0 auto; max-height: 58%; overflow: auto; border-top: 1px solid var(--border-color); margin-top: 6px; padding-top: 5px; }
.cbld-form-head { display: flex; align-items: center; gap: 6px; padding-bottom: 4px; }
.cbld-form-head b { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cbld-none { padding: 10px; color: var(--text-secondary); text-align: center; font-size: 11px; }
.cbld-cover { font-size: 10px; padding: 0 0 4px 112px; color: var(--text-secondary); }
.cbld-cover.bad { color: #e74c3c; }
.cbld-cover.thin { color: #e67e22; }
.cbld-cover:empty { display: none; }
.cbld-card { border: 1px solid var(--border-light); border-radius: 5px; padding: 5px 6px; margin-bottom: 6px; }
.cbld-card-head { display: flex; align-items: center; gap: 6px; }
.cbld-card-head b { flex: 1 1 auto; }

.cbld-out-bar { display: flex; align-items: center; gap: 6px; padding-bottom: 5px; flex: 0 0 auto; }
.cbld-size { flex: 1 1 auto; font-size: 10px; color: var(--text-secondary); }
.cbld-json { flex: 1; overflow: auto; margin: 0; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-tertiary); font-family: 'Monaco', 'Courier New', monospace; font-size: 10px; line-height: 1.45; white-space: pre; min-height: 0; }
.cbld-empty { padding: 16px; color: var(--text-secondary); text-align: center; }

.cbld-widget.narrow .cbld-body { flex-direction: column; }
.cbld-widget.narrow .cbld-nav { flex: 0 0 auto; flex-direction: row; flex-wrap: wrap; border-right: 0; border-bottom: 1px solid var(--border-light); padding: 0 0 4px; }
.cbld-widget.narrow .cbld-label { flex: 0 0 76px; }
.cbld-widget.narrow .cbld-note, .cbld-widget.narrow .cbld-cover { padding-left: 82px; }
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
    tools: ['curriculum-explorer', 'curriculum-doctor', 'curriculum-builder'],
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

    // The grades the student was at this school outrank the ones the document
    // covers. Two high schools both print a 9-12 catalog, and a transfer means
    // neither of them is four years long for this student.
    let levels = Array.isArray(data.grades) && data.grades.length
        ? data.grades.slice()
        : (Array.isArray(hints.levels) && hints.levels.length ? hints.levels.slice() : []);
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

// Most flags belong in the filter and nowhere else. A few say something about the
// course itself — what it earns, what it ends in — and those belong on the row,
// where they can be seen without knowing to go looking.
const CURR_FLAG_BADGES = {
    high_school_credit: { tag: 'HS', title: 'Earns high school credit' },
    eoc_course: { tag: 'EOC', title: 'Ends in a state end-of-course exam' }
};

function currFlagLabel(key) {
    if (CURR_FLAG_NAMES[key]) return CURR_FLAG_NAMES[key];
    const words = String(key).replace(/_/g, ' ').trim();
    return words.charAt(0).toUpperCase() + words.slice(1);
}

// A badge the level already shows is not worth showing twice.
function currFlagBadgesHtml(course) {
    const flags = course.flags || {};
    const shown = course.level && course.level !== 'Standard' ? currLevelAbbr(course.level) : '';
    return Object.keys(CURR_FLAG_BADGES).filter(function(key) {
        return flags[key] && CURR_FLAG_BADGES[key].tag !== shown;
    }).map(function(key) {
        const badge = CURR_FLAG_BADGES[key];
        let title = badge.title;
        if (key === 'high_school_credit' && typeof course.high_school_credits === 'number') {
            title += ' — ' + currFormatCredits(course.high_school_credits);
        }
        return '<span class="curr-tag earns" title="' + escapeHtml(title) + '">' +
            badge.tag + '</span>';
    }).join('');
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
                    high_school_credits: { type: 'number', description: 'Optional. Credit this course earns at another school — a middle school course taken for high school credit. Kept apart from `credits`, which is what it counts for where it is taken.' },
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
<div class="curr-schools-bar"></div>
<div class="authoring-split">
<div class="authoring-source curr-source">
<div class="curr-tabs">
<button class="curr-stab active" onclick="currSetSourceView(this, 'document')">Document</button>
<button class="curr-stab" onclick="currSetSourceView(this, 'schema')">Schema</button>
</div>
<div class="curr-doc">
<div class="curr-school-pane"></div>
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

// =============================================
// A CAREER, AS A LIST OF SCHOOLS
// =============================================
// A school career is not one document. Elementary, middle and high school each
// publish their own, and a student may attend two high schools. So the tool holds
// several, one on screen at a time.
//
// The whole design rests on one observation: a school entry has exactly the shape
// currGetData already returned. So the record is a list of those, currGetData hands
// back whichever is current, and every function below it — the planner, the grid,
// validation, the totals, the tree, PNG, PDF — carries on being handed what it has
// always been handed.
//
// It is also why the catalogs are kept apart rather than merged into one K-12
// document. Two high schools in the same district share course titles by the dozen
// (Geometry, Algebra II, Chemistry). Merged, a prerequisite naming "Geometry" would
// resolve to whichever document happened to load first, silently. Kept apart,
// currResolveTitle never sees two of anything.

const CURR_CAREER = '__career__';

function currSchoolDefaults() {
    return Object.assign({ id: null, name: '', grades: null, years: '', credits_in: [],
        grading: null, marks: {} }, currDefaults());
}

// Every field a school keeps has to be named here, or it is written and then
// dropped on the next read.
function currNormalizeSchool(school, i) {
    const base = currSchoolDefaults();
    const s = school || {};
    return {
        id: s.id || ('sch-' + (i + 1)),
        // What the dropdown calls it. Taken from the document when it says, but
        // editable — two schools can share a name and a person still has to tell
        // them apart.
        name: s.name || '',
        // The grades the student was there for. Null means "whatever the document
        // implies", which is right until two high schools both claim 9-12.
        grades: Array.isArray(s.grades) && s.grades.length ? s.grades.map(Number) : null,
        years: s.years || '',
        // Credit granted on transfer for a course this school does not teach, so
        // there is nothing in its catalog to tick. See currTransfersHtml.
        credits_in: Array.isArray(s.credits_in) ? s.credits_in : [],
        // How this school marks, and what it marked. A school's own business: a
        // middle school and a high school grade differently for the same student.
        grading: s.grading || null,
        marks: s.marks || {},
        catalog: s.catalog || null,
        // Text typed into the JSON pane that has not been loaded yet.
        draft: s.draft || null,
        sourceUrl: s.sourceUrl || null,
        plan: s.plan || {},
        // Years added past the ones the document implies, for a plan that runs long.
        extraLevels: s.extraLevels || 0,
        completed: s.completed || [],
        hidden: Object.assign(base.hidden, s.hidden || {}),
        ui: Object.assign(base.ui, s.ui || {})
    };
}

// What to call a school. A name typed by hand wins; otherwise it is read from the
// document, which means a school added before its document arrives is named the
// moment it does. Deriving it on every read rather than storing it is what makes
// that work — a stored placeholder would outlive the document that replaced it.
function currSchoolName(school, i) {
    if (school.name) return school.name;
    return currDerivedSchoolName(school, i);
}

function currDerivedSchoolName(school, i) {
    const catalog = school.catalog || {};
    const meta = catalog.document || catalog.guide || {};
    return (catalog.school || {}).name || meta.title || ('School ' + ((i || 0) + 1));
}

function currGetRecord(toolId) {
    const custom = toolCustomizations[toolId] || {};
    const stored = custom.curriculum || {};
    // Before this existed the tool kept a single school's worth of state at the top
    // level. The shapes are identical, so the upgrade is a list of one — and no
    // plan, no completed list and no course code is rewritten, because each school
    // goes on keeping its own.
    const schools = Array.isArray(stored.schools) && stored.schools.length
        ? stored.schools.map(currNormalizeSchool)
        : [currNormalizeSchool(stored, 0)];
    const current = schools.some(function(s) { return s.id === stored.current; })
        ? stored.current
        : (stored.current === CURR_CAREER ? CURR_CAREER : schools[0].id);
    return { schools: schools, current: current };
}

function currSaveRecord(toolId, record) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].curriculum = record;
    try {
        saveToolCustomizations(toolCustomizations);
        return true;
    } catch (e) {
        currSetStatus(currWidgetFor(toolId), 'err', 'This record is too large for the space ' +
            'this board has left. It is loaded and usable, but it will not survive a reload.');
        return false;
    }
}

function currSchoolAt(record, id) {
    for (let i = 0; i < record.schools.length; i++) {
        if (record.schools[i].id === id) return record.schools[i];
    }
    return null;
}

// The school on screen. On the career page there is none, so the first stands in —
// nothing on that page edits, and the callers that read a catalog need one.
function currCurrentSchool(record) {
    return currSchoolAt(record, record.current) || record.schools[0];
}

function currShowingCareer(record) {
    return record.current === CURR_CAREER && record.schools.length > 1;
}

// The order a career is lived in: by the first grade each school covers.
function currSchoolLevels(school) {
    if (school.grades && school.grades.length) return school.grades.slice();
    const seen = {};
    ((school.catalog || {}).courses || []).forEach(function(c) {
        (c.grade_levels || []).forEach(function(l) {
            if (typeof l === 'number' && isFinite(l)) seen[l] = true;
        });
    });
    const levels = Object.keys(seen).map(Number).sort(function(a, b) { return a - b; });
    return levels;
}

function currSchoolsInOrder(record) {
    const added = {};
    record.schools.forEach(function(s, i) { added[s.id] = i; });
    return record.schools.slice().sort(function(a, b) {
        const la = currSchoolLevels(a);
        const lb = currSchoolLevels(b);
        // A school with no document yet has no grades either. It sorts last rather
        // than first, so adding one does not reorder the career under you.
        const fa = la.length ? la[0] : 99;
        const fb = lb.length ? lb[0] : 99;
        if (fa !== fb) return fa - fb;
        return added[a.id] - added[b.id];
    });
}

// Every school the student attended before this one — the ones a course can have
// transferred in from.
function currEarlierSchools(record, school) {
    const order = currSchoolsInOrder(record);
    // By id, not by identity: every currGetRecord builds fresh objects, so the school
    // being rendered is equal to one in the list without being the same object.
    const at = order.findIndex(function(s) { return s.id === school.id; });
    return at <= 0 ? [] : order.slice(0, at);
}

function currGetData(toolId) {
    return currCurrentSchool(currGetRecord(toolId));
}

// A curriculum document is large enough to fill the storage a board has, so a
// failed write is reported in the tool rather than thrown: the plan stays usable
// in memory even when it cannot be kept.
// Callers hand back the object currGetData gave them, which is one school out of the
// record. Put it back where it came from and write the whole record.
function currSaveData(toolId, data) {
    const record = currGetRecord(toolId);
    const at = record.schools.findIndex(function(s) { return s.id === data.id; });
    if (at === -1) record.schools[0] = data; else record.schools[at] = data;
    return currSaveRecord(toolId, record);
}

// A whole curriculum is serialised on every write, which is far too much work to
// do once per keystroke. The change is live in memory at once; the write follows.
let currSaveTimer = null;

// The doctor keeps a draft the same way, and needs a timer of its own.
let cdocDraftTimer = null;

function currSaveDataSoon(toolId, data) {
    // In memory at once, on disk shortly: the next read has to see this edit, or a
    // second keystroke would be applied to the state before the first.
    const record = currGetRecord(toolId);
    const at = record.schools.findIndex(function(s) { return s.id === data.id; });
    if (at === -1) record.schools[0] = data; else record.schools[at] = data;
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].curriculum = record;
    clearTimeout(currSaveTimer);
    currSaveTimer = setTimeout(function() { currSaveData(toolId, data); }, 400);
}

function currSetStatus(widget, kind, message) {
    const status = widget && widget.querySelector('.curr-status');
    if (!status) return;
    status.className = 'curr-status' + (kind ? ' ' + kind : '');
    status.textContent = message || '';
}

// ---- The school bar ---------------------------------------------------------

function currGradeRangeLabel(planner, levels) {
    if (!levels || !levels.length) return '';
    const sorted = levels.slice().sort(function(a, b) { return a - b; });
    const short = function(level) {
        const label = currLevelLabel(planner, level);
        // "Grade 9" reads as "9" in a range; a named year keeps its name.
        return /^(Grade|Year) \d+$/.test(label) ? String(level) : label;
    };
    const contiguous = sorted.every(function(n, i) { return i === 0 || n === sorted[i - 1] + 1; });
    if (sorted.length === 1) return short(sorted[0]);
    return contiguous
        ? short(sorted[0]) + '–' + short(sorted[sorted.length - 1])
        : sorted.map(short).join(', ');
}

function currSchoolSummary(school) {
    const planner = currPlanner(school);
    const grades = currGradeRangeLabel(planner, currSchoolLevels(school));
    return [grades ? 'grades ' + grades : '', school.years].filter(Boolean).join(' · ');
}

// A career is only worth showing as one once there is more than one school in it.
function currSchoolsBarHtml(record) {
    const showing = record.schools.length > 1 || record.schools[0].catalog;
    if (!showing) return '';
    const order = currSchoolsInOrder(record);
    const career = currShowingCareer(record);
    const here = career ? null : currCurrentSchool(record);
    let html = '<div class="curr-schools">' +
        '<label class="curr-school-lbl">School</label>' +
        '<select class="curr-school-pick" onchange="currPickSchool(this)">';
    order.forEach(function(school) {
        const summary = currSchoolSummary(school);
        html += '<option value="' + escapeHtml(school.id) + '"' +
            (!career && school.id === here.id ? ' selected' : '') + '>' +
            escapeHtml(currSchoolName(school)) + (summary ? ' · ' + escapeHtml(summary) : '') + '</option>';
    });
    if (record.schools.length > 1) {
        html += '<option value="' + CURR_CAREER + '"' + (career ? ' selected' : '') +
            '>── Whole career ──</option>';
    }
    html += '</select>';
    html += '<button class="curr-btn" onclick="currAddSchool(this)" ' +
        'title="Another school this student attended">+ School</button>';
    return html + '</div>';
}

function currPickSchool(el) {
    const widget = currGetWidget(el);
    const toolId = currGetToolId(el);
    if (!widget || !toolId) return;
    const record = currGetRecord(toolId);
    record.current = el.value;
    currSaveRecord(toolId, record);
    // Each school keeps its own JSON, so the source pane follows the choice.
    const box = widget.querySelector('.curr-json');
    if (box) {
        const school = currSchoolAt(record, record.current);
        box.value = school ? (school.draft || (school.catalog
            ? JSON.stringify(school.catalog, null, 2) : '')) : '';
    }
    currSetStatus(widget, '', '');
    currRender(widget);
}

function currNextSchoolId(record) {
    let n = record.schools.length + 1;
    const used = {};
    record.schools.forEach(function(s) { used[s.id] = true; });
    while (used['sch-' + n]) n++;
    return 'sch-' + n;
}

function currAddSchool(btn) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    const record = currGetRecord(toolId);
    const school = currNormalizeSchool({ id: currNextSchoolId(record) }, record.schools.length);
    record.schools.push(school);
    record.current = school.id;
    currSaveRecord(toolId, record);
    const box = widget.querySelector('.curr-json');
    if (box) box.value = '';
    currSetStatus(widget, 'ok', 'Added a school. Load its curriculum document, then ' +
        'set the grades the student was there for.');
    // The document is what this school needs next, and that lives in the JSON pane.
    if (typeof setToolMode === 'function') setToolMode(toolId, 'split');
    currRender(widget);
}

function currRemoveSchool(btn, id) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    const record = currGetRecord(toolId);
    if (record.schools.length < 2) {
        currSetStatus(widget, 'err', 'This is the only school on the record. Load a different ' +
            'document over it rather than removing it.');
        return;
    }
    const school = currSchoolAt(record, id);
    if (!school) return;
    const work = currWorkInProgress(school);
    if (currNeedsConfirm(btn, 'rm:' + id, 'Removing ' + currSchoolName(school) + ' takes ' +
        (work ? currEntries(work) + ' of plan' : 'its document') + ' with it, and cannot be ' +
        'undone. Press × again to go ahead.')) return;
    record.schools = record.schools.filter(function(s) { return s.id !== id; });
    if (record.current === id) record.current = record.schools[0].id;
    currSaveRecord(toolId, record);
    currSetStatus(widget, 'ok', 'Removed ' + currSchoolName(school) + '.');
    currRender(widget);
}

function currMoveSchool(btn, id, by) {
    const toolId = currGetToolId(btn);
    const record = currGetRecord(toolId);
    const at = record.schools.findIndex(function(s) { return s.id === id; });
    const to = at + by;
    if (at === -1 || to < 0 || to >= record.schools.length) return;
    const moved = record.schools.splice(at, 1)[0];
    record.schools.splice(to, 0, moved);
    currSaveRecord(toolId, record);
    currRender(currGetWidget(btn));
}

// ---- Editing a school -------------------------------------------------------

function currWithSchool(el, id, change) {
    const widget = currGetWidget(el);
    const toolId = currGetToolId(el);
    if (!widget || !toolId) return;
    const record = currGetRecord(toolId);
    const school = currSchoolAt(record, id);
    if (!school) return;
    change(school);
    currSaveRecord(toolId, record);
    return { widget: widget, toolId: toolId, record: record };
}

function currSetSchoolName(el, id) {
    const value = el.value.trim();
    // Cleared, it goes back to whatever the document calls itself.
    const cx = currWithSchool(el, id, function(school) { school.name = value; });
    // The bar shows the name, so it is the one thing to refresh while typing.
    if (cx) currRefreshSchoolBar(cx.widget, cx.toolId);
}

function currSetSchoolYears(el, id) {
    const value = el.value.trim();
    const cx = currWithSchool(el, id, function(school) { school.years = value; });
    if (cx) currRefreshSchoolBar(cx.widget, cx.toolId);
}

// Which grades the student was there for. Two high schools both print a 9-12
// catalog; only the student knows which years they were at each.
function currSetSchoolGrades(el, id) {
    const raw = el.value.trim();
    const cx = currWithSchool(el, id, function(school) {
        const levels = raw.split(/[^0-9]+/).filter(Boolean).map(Number)
            .filter(function(n) { return isFinite(n); });
        school.grades = levels.length ? levels.sort(function(a, b) { return a - b; }) : null;
    });
    if (cx) currRender(cx.widget);
}

function currRefreshSchoolBar(widget, toolId) {
    const bar = widget.querySelector('.curr-schools');
    if (bar) bar.outerHTML = currSchoolsBarHtml(currGetRecord(toolId));
}

// The list in the JSON pane: what the record holds, and the only place a school is
// named, dated, given its grades or taken off.
function currSchoolListHtml(record) {
    const order = currSchoolsInOrder(record);
    let html = '<div class="curr-school-list">';
    order.forEach(function(school) {
        const planner = currPlanner(school);
        const derived = currGradeRangeLabel(planner, currSchoolLevels(school));
        const stated = school.grades && school.grades.length;
        html += '<div class="curr-school-row' +
            (school.id === record.current ? ' on' : '') + '">' +
            '<button class="curr-school-go" onclick="currGoToSchool(this, \'' +
                escapeHtml(school.id) + '\')" title="Show this school">' +
                (school.id === record.current ? '●' : '○') + '</button>' +
            '<input class="curr-school-name" value="' + escapeHtml(school.name) +
                '" placeholder="' + escapeHtml(currDerivedSchoolName(school, order.indexOf(school))) +
                '" oninput="currSetSchoolName(this, \'' +
                escapeHtml(school.id) + '\')">' +
            '<input class="curr-school-grades" value="' + escapeHtml(stated ? school.grades.join(', ') : '') +
                '" placeholder="' + escapeHtml(derived || 'grades') +
                '" title="The grades the student was at this school. Left empty, whatever the ' +
                'document implies." onchange="currSetSchoolGrades(this, \'' + escapeHtml(school.id) + '\')">' +
            '<input class="curr-school-years" value="' + escapeHtml(school.years) +
                '" placeholder="years" title="Academic years, e.g. 2026-2028" ' +
                'oninput="currSetSchoolYears(this, \'' + escapeHtml(school.id) + '\')">' +
            '<span class="curr-school-n">' + (school.catalog
                ? (school.catalog.courses || []).length + ' courses' : 'no document') + '</span>' +
            '<button class="curr-x" title="Remove this school" onclick="currRemoveSchool(this, \'' +
                escapeHtml(school.id) + '\')">×</button>' +
            '</div>';
    });
    html += '</div>';
    return html;
}

function currGoToSchool(btn, id) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    const record = currGetRecord(toolId);
    if (!currSchoolAt(record, id)) return;
    record.current = id;
    currSaveRecord(toolId, record);
    const box = widget.querySelector('.curr-json');
    if (box) {
        const school = currSchoolAt(record, id);
        box.value = school.draft || (school.catalog ? JSON.stringify(school.catalog, null, 2) : '');
    }
    currRender(widget);
}

// The academic year a given grade falls in, where the school says which years the
// student was there. "2026-2028" over grades 11-12 makes grade 11 "2026-27".
function currAcademicYear(school, planner, level) {
    const match = /(\d{4})/.exec(school.years || '');
    if (!match) return '';
    const levels = currSchoolLevels(school);
    if (!levels.length) return '';
    const start = parseInt(match[1], 10) + (level - levels[0]);
    if (!isFinite(start)) return '';
    return start + '–' + String((start + 1) % 100).padStart(2, '0');
}

// ---- Transferred in ---------------------------------------------------------
// A course taken at an earlier school and accepted here. Two cases, and both are
// real: the new school teaches the same course, so ticking it is the Already met
// mechanism the tool already has; or it does not, and the credit still has to land
// somewhere or the totals come out quietly low.

// What a course taken elsewhere is called here, if anything. Schools spell the same
// course differently and the differences are systematic, so this tries the forms a
// guide actually prints rather than only the title as written:
//
//   Spanish I                  → exact
//   Band IV                    → its own title_variants say "Honors Band"
//   GEM-7 (Algebra I Honors)   → the parenthetical is the real course name
//
// Then, and only then, the same list with the rigour dropped — Algebra I Honors
// against Algebra I. That one is a guess, so it is returned as inexact and shown as
// a close match. Nothing is applied until the student ticks it, which is what makes
// a guess safe to offer here and not safe to make anywhere else.
const CURR_RIGOUR = /\b(honou?rs?|advanced|gifted|accelerated|pre[- ]?ap|ap|ib|dual enrollment)\b/gi;

function currTransferMatch(index, course) {
    const tries = [course.title].concat(course.title_variants || []);
    const paren = /\(([^)]+)\)/.exec(course.title || '');
    if (paren) tries.push(paren[1]);
    const outside = String(course.title || '').replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    if (outside) tries.push(outside);

    for (let i = 0; i < tries.length; i++) {
        const hit = currResolveTitle(index, tries[i]);
        if (hit) return { code: hit, exact: true };
    }
    for (let i = 0; i < tries.length; i++) {
        const plain = String(tries[i] || '').replace(CURR_RIGOUR, ' ').replace(/\s+/g, ' ').trim();
        if (!plain || currNormTitle(plain) === currNormTitle(tries[i])) continue;
        const hit = currResolveTitle(index, plain);
        if (hit) return { code: hit, exact: false };
    }
    return null;
}

// Everything the student has on the record at earlier schools — placed in a plan or
// ticked off there. Matched against this school's catalog as we go, so nothing is
// stored that could drift out of step with either catalog.
function currTransferCandidates(record, school) {
    const index = currTitleIndex(school);
    const byCode = currByCode(school);
    const out = [];
    currEarlierSchools(record, school).forEach(function(from) {
        const fromBy = currByCode(from);
        const seen = {};
        const take = function(code) {
            if (seen[code]) return;
            seen[code] = true;
            const course = fromBy[code];
            if (!course) return;
            const match = currTransferMatch(index, course);
            out.push({
                from: currSchoolName(from),
                fromId: from.id,
                code: code,
                title: course.title,
                // What it was worth where it was taken. A middle school course taken
                // for high school credit says so in a field of its own.
                credits: course.high_school_credits || course.credits || 0,
                level: (course.grade_levels || [])[0],
                to: match ? match.code : null,
                exact: match ? match.exact : false,
                toTitle: match && byCode[match.code] ? byCode[match.code].title : null
            });
        };
        Object.keys(from.plan || {}).forEach(function(term) {
            (from.plan[term] || []).forEach(take);
        });
        (from.completed || []).forEach(take);
    });
    return out;
}

function currTransfersHtml(data, record) {
    const earlier = currEarlierSchools(record, data);
    if (!earlier.length) return '';
    const candidates = currTransferCandidates(record, data);
    const open = data.ui.transfersOpen === true;
    const taken = candidates.filter(function(c) {
        return c.to && currIsCompleted(data, c.to);
    }).length;
    const loose = data.credits_in || [];

    let html = '<div class="curr-transfers">' +
        '<div class="curr-transfers-head" onclick="currToggleTransfers(this)">' +
            '<span class="curr-req-caret">' + (open ? '▾' : '▸') + '</span>' +
            '<span class="curr-req-name"><b>Transferred in</b></span>' +
            '<span class="curr-req-num">' + (taken + loose.length) + ' of ' +
                (candidates.length + loose.length) + '</span>' +
        '</div>';
    if (!open) return html + '</div>';

    html += '<div class="curr-transfer-body">';
    if (!candidates.length) {
        html += '<div class="curr-note">Nothing recorded at ' +
            escapeHtml(earlier.map(currSchoolName).join(', ')) + ' yet.</div>';
    }
    candidates.forEach(function(c) {
        const on = c.to && currIsCompleted(data, c.to);
        html += '<label class="curr-transfer' + (c.to ? '' : ' unmatched') + '">' +
            '<input type="checkbox"' + (on ? ' checked' : '') + (c.to ? '' : ' disabled') +
                ' onchange="currToggleTransfer(this, \'' + escapeHtml(c.to || '') + '\')">' +
            '<span class="curr-transfer-title">' + escapeHtml(c.title) + '</span>' +
            '<span class="curr-transfer-from">' + escapeHtml(c.from) + '</span>' +
            (c.to
                ? '<span class="curr-transfer-to' + (c.exact ? '' : ' close') + '">→ ' +
                  escapeHtml(c.to + ' ' + (c.toTitle || '')) +
                  (c.exact ? '' : ' <em>close match — check it</em>') + '</span>'
                : '<span class="curr-transfer-to none">no course by that name here' +
                  '<button class="curr-btn" onclick="currAddLooseFrom(event, this, \'' +
                      escapeHtml(c.fromId) + '\', \'' + escapeHtml(c.code) + '\')" ' +
                      'title="Record it as credit anyway">as credit</button></span>') +
            '</label>';
    });

    // Credit granted for something this school does not teach. Nothing in the
    // catalog to tick, so it is recorded as itself and counted by subject.
    const subjects = (((data.catalog || {}).graduation_requirements || {}).credits_by_subject) || [];
    loose.forEach(function(entry, i) {
        html += '<div class="curr-loose">' +
            '<input class="curr-loose-title" value="' + escapeHtml(entry.title || '') +
                '" placeholder="Course title" oninput="currSetLoose(this, ' + i + ', \'title\')">' +
            '<input class="curr-loose-credits" type="number" step="0.5" value="' +
                escapeHtml(String(entry.credits === undefined ? '' : entry.credits)) +
                '" placeholder="cr" oninput="currSetLoose(this, ' + i + ', \'credits\')">' +
            '<select class="curr-loose-subject" onchange="currSetLoose(this, ' + i + ', \'subject\')">' +
                '<option value="">counts as…</option>' +
                subjects.map(function(req) {
                    return '<option value="' + escapeHtml(req.subject) + '"' +
                        (entry.subject === req.subject ? ' selected' : '') + '>' +
                        escapeHtml(req.subject) + '</option>';
                }).join('') +
            '</select>' +
            '<span class="curr-transfer-from">' + escapeHtml(entry.from || '') + '</span>' +
            '<button class="curr-x" title="Remove" onclick="currRemoveLoose(this, ' + i + ')">×</button>' +
        '</div>';
    });
    html += '<button class="curr-btn" onclick="currAddLoose(this)">+ other credit</button>';
    return html + '</div></div>';
}

function currToggleTransfers(el) {
    const widget = currGetWidget(el);
    const toolId = currGetToolId(el);
    const data = currGetData(toolId);
    data.ui.transfersOpen = !data.ui.transfersOpen;
    currSaveData(toolId, data);
    currRender(widget);
}

// Ticking one marks the matching course here as already met — the same list, and
// therefore the same prerequisite and credit rules, as ticking it in the catalog.
function currToggleTransfer(el, code) {
    if (!code) return;
    const widget = currGetWidget(el);
    const toolId = currGetToolId(el);
    const data = currGetData(toolId);
    const at = data.completed.indexOf(code);
    if (at === -1) data.completed.push(code); else data.completed.splice(at, 1);
    currSaveData(toolId, data);
    currRender(widget);
}

function currAddLoose(btn) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    const data = currGetData(toolId);
    data.credits_in = (data.credits_in || []).concat([{ title: '', credits: 1, subject: '', from: '' }]);
    data.ui.transfersOpen = true;
    currSaveData(toolId, data);
    currRender(widget);
}

function currAddLooseFrom(e, btn, fromId, code) {
    e.preventDefault();
    e.stopPropagation();
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    const record = currGetRecord(toolId);
    const from = currSchoolAt(record, fromId);
    const course = from ? currByCode(from)[code] : null;
    const data = currCurrentSchool(record);
    data.credits_in = (data.credits_in || []).concat([{
        title: course ? course.title : '',
        credits: course ? (course.high_school_credits || course.credits || 0) : 0,
        subject: course ? (course.department_canonical || course.department || '') : '',
        from: from ? currSchoolName(from) : ''
    }]);
    data.ui.transfersOpen = true;
    currSaveRecord(toolId, record);
    currRender(widget);
}

function currSetLoose(el, i, field) {
    const widget = currGetWidget(el);
    const toolId = currGetToolId(el);
    const data = currGetData(toolId);
    const entry = (data.credits_in || [])[i];
    if (!entry) return;
    entry[field] = field === 'credits' ? (parseFloat(el.value) || 0) : el.value;
    currSaveDataSoon(toolId, data);
    // Only the totals move; rewriting the panel would take the caret with it.
    const totals = widget.querySelector('.curr-totals');
    if (totals) totals.outerHTML = currTotalsHtml(currGetData(toolId));
}

function currRemoveLoose(btn, i) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    const data = currGetData(toolId);
    (data.credits_in || []).splice(i, 1);
    currSaveData(toolId, data);
    currRender(widget);
}

// What transferred credit adds to a subject, for the totals panel.
function currLooseFor(data, subject) {
    let sum = 0;
    (data.credits_in || []).forEach(function(entry) {
        if (currNormTitle(entry.subject) === currNormTitle(subject)) sum += entry.credits || 0;
    });
    return sum;
}

function currLooseTotal(data) {
    let sum = 0;
    (data.credits_in || []).forEach(function(entry) { sum += entry.credits || 0; });
    return sum;
}

// ---- The whole career -------------------------------------------------------
// Read-only, and the only page that shows more than one school at a time. Every
// year the student has been through, what was taken in it, and what it was worth.

function currSchoolCredits(school) {
    const byCode = currByCode(school);
    let planned = 0;
    let earlyHs = 0;
    Object.keys(school.plan || {}).forEach(function(term) {
        (school.plan[term] || []).forEach(function(code) {
            const course = byCode[code];
            if (!course) return;
            planned += course.credits || 0;
            earlyHs += course.high_school_credits || 0;
        });
    });
    return { planned: planned, earlyHs: earlyHs, transferred: currLooseTotal(school) };
}

function currCareerYearHtml(school, planner, level) {
    const byCode = currByCode(school);
    const slots = [planner.spanId].concat(planner.terms.map(function(t) { return t.id; }));
    const seen = {};
    const rows = [];
    slots.forEach(function(slot) {
        (school.plan[currTermKey(level, slot)] || []).forEach(function(code) {
            if (seen[code]) return;
            seen[code] = true;
            const course = byCode[code];
            if (!course) return;
            rows.push({ course: course, slot: slot });
        });
    });
    const year = currAcademicYear(school, planner, level);
    let credits = 0;
    rows.forEach(function(r) { credits += r.course.credits || 0; });

    return '<div class="curr-career-year">' +
        '<div class="curr-career-year-head">' +
            '<b>' + escapeHtml(currLevelLabel(planner, level)) + '</b>' +
            (year ? '<span class="curr-career-when">' + escapeHtml(year) + '</span>' : '') +
            '<span class="curr-career-cr">' + (rows.length
                ? currFormatCredits(credits) + ' cr' : 'nothing recorded') + '</span>' +
        '</div>' +
        rows.map(function(r) {
            const hs = r.course.high_school_credits
                ? ' <span class="curr-badge">HS ' + currFormatCredits(r.course.high_school_credits) + '</span>'
                : '';
            const grade = currCourseGrade(school, r.course.course_code, planner);
            return '<div class="curr-career-course">' +
                '<span class="curr-code">' + escapeHtml(r.course.course_code) + '</span>' +
                '<span class="curr-career-title">' + escapeHtml(r.course.title) + hs + '</span>' +
                '<span class="curr-career-slot">' + escapeHtml(currSlotLabel(planner, r.slot)) + '</span>' +
                (grade.label ? '<span class="curr-career-grade">' + escapeHtml(grade.label) +
                    '</span>' : '') +
                '<span class="curr-career-cr">' + currFormatCredits(r.course.credits || 0) + '</span>' +
            '</div>';
        }).join('') +
    '</div>';
}

function currCareerHtml(record) {
    const order = currSchoolsInOrder(record);
    let planned = 0;
    let earlyHs = 0;
    let transferred = 0;
    // A career GPA has to add up schools that may not mark the same way, so it is
    // pooled in points — never in labels, which are not comparable between scales.
    let gpaPoints = 0;
    let gpaCredits = 0;
    let gpaPlain = 0;
    let gpaN = 0;

    let html = '<div class="curr-career">';
    order.forEach(function(school) {
        const planner = currPlanner(school);
        const sums = currSchoolCredits(school);
        if (school.catalog) {
            const grading = currGrading(school);
            const byCode = currByCode(school);
            const shape = currPlanner(school);
            currGradedCodes(school).forEach(function(code) {
                const grade = currCourseGrade(school, code, shape);
                if (grade.points === null) return;
                const course = byCode[code];
                const points = grade.points + (grading.weighted ? currLevelBonus(course) : 0);
                const credit = (course && course.credits) || 0;
                gpaPoints += points * credit;
                gpaCredits += credit;
                gpaPlain += points;
                gpaN++;
            });
        }
        planned += sums.planned;
        earlyHs += sums.earlyHs;
        transferred += sums.transferred;
        const met = (school.completed || []).length;

        html += '<div class="curr-career-school">' +
            '<div class="curr-career-head">' +
                '<b>' + escapeHtml(currSchoolName(school)) + '</b>' +
                '<span>' + escapeHtml(currSchoolSummary(school) || 'no grades set') + '</span>' +
                '<button class="curr-btn" onclick="currGoToSchool(this, \'' +
                    escapeHtml(school.id) + '\')">Open</button>' +
            '</div>';
        if (!school.catalog) {
            html += '<div class="curr-note">No document loaded for this school yet.</div>';
        } else {
            planner.levels.forEach(function(level) {
                html += currCareerYearHtml(school, planner, level);
            });
            const notes = [];
            const gpa = currSchoolGpa(school);
            if (gpa !== null) {
                notes.push('GPA ' + currFormatGpa(gpa) +
                    (currGrading(school).weighted ? ' weighted' : ''));
            }
            if (sums.planned) notes.push(currFormatCredits(sums.planned) + ' credits here');
            if (sums.earlyHs) notes.push(currFormatCredits(sums.earlyHs) + ' high school credits earned early');
            if (met) notes.push(met + (met === 1 ? ' course' : ' courses') + ' counted as already met');
            if (sums.transferred) notes.push(currFormatCredits(sums.transferred) + ' credits transferred in');
            if (notes.length) {
                html += '<div class="curr-career-note">' + escapeHtml(notes.join(' · ')) + '</div>';
            }
        }
        html += '</div>';
    });

    const career = gpaN ? (gpaCredits > 0 ? gpaPoints / gpaCredits : gpaPlain / gpaN) : null;
    html += '<div class="curr-career-total">' +
        '<b>' + order.length + (order.length === 1 ? ' school' : ' schools') + '</b>' +
        '<span>' + (career === null ? '' : 'GPA ' + currFormatGpa(career) + ' · ') +
        currFormatCredits(planned) + ' credits recorded' +
        (earlyHs ? ' · ' + currFormatCredits(earlyHs) + ' earned before high school' : '') +
        (transferred ? ' · ' + currFormatCredits(transferred) + ' transferred in' : '') +
        '</span></div>';

    html += '<div class="curr-note">This page is a record, not a plan — open a school ' +
        'to change anything. Credits are counted where they were taken; what each school ' +
        'accepted from an earlier one is on that school\'s page, under Transferred in.</div>';
    return html + '</div>';
}

// =============================================
// GRADES
// =============================================
// What a student took is half a record; how they did is the other half. Grades hang
// off a school rather than off the tool, because a middle school and a high school
// grade differently and the same student has both. Which is also why everything here
// works in *points* and only turns them back into a label at the last moment: "A",
// "5" and "89%" are the same fact written three ways, and a career GPA has to be
// able to add them up.

// A scale is a list of labels and what each is worth, or a range and a rule. The
// point values are not decoration — without them nothing can be averaged at all.
const CURR_SCALES = {
    'letter': { name: 'Letters (A–F)', values: [
        { label: 'A', points: 4 }, { label: 'B', points: 3 }, { label: 'C', points: 2 },
        { label: 'D', points: 1 }, { label: 'F', points: 0 }] },
    'letter-pm': { name: 'Letters with +/−', values: [
        { label: 'A+', points: 4 }, { label: 'A', points: 4 }, { label: 'A-', points: 3.7 },
        { label: 'B+', points: 3.3 }, { label: 'B', points: 3 }, { label: 'B-', points: 2.7 },
        { label: 'C+', points: 2.3 }, { label: 'C', points: 2 }, { label: 'C-', points: 1.7 },
        { label: 'D+', points: 1.3 }, { label: 'D', points: 1 }, { label: 'D-', points: 0.7 },
        { label: 'F', points: 0 }] },
    'num-5': { name: 'Numbers (5 best)', values: [
        { label: '5', points: 4 }, { label: '4', points: 3 }, { label: '3', points: 2 },
        { label: '2', points: 1 }, { label: '1', points: 0 }] },
    'num-1': { name: 'Numbers (1 best)', values: [
        { label: '1', points: 4 }, { label: '2', points: 3 }, { label: '3', points: 2 },
        { label: '4', points: 1 }, { label: '5', points: 0 }] },
    // Continuous: the number typed is the grade. A percentage converts to points on
    // the usual ten-point bands; a points scale is already in points.
    'percent': { name: 'Percentage', min: 0, max: 100, step: 1, suffix: '%',
        toPoints: function(n) { return Math.max(0, Math.min(4, Math.floor((n - 50) / 10))); } },
    'points-4': { name: 'Points out of 4.0', min: 0, max: 4, step: 0.1 },
    'points-5': { name: 'Points out of 5.0', min: 0, max: 5, step: 0.1 }
};

// What a level is worth above the standard course, where a school keeps a weighted
// GPA. Read off the level the catalog already carries; first match wins.
const CURR_LEVEL_BONUS = [
    { re: /\b(ap|advanced placement|ib|aice|dual)\b/i, add: 1 },
    { re: /honou?rs|gifted|accelerated|pre[- ]?ap/i, add: 0.5 }
];

function currGradingDefaults() {
    return { scale: 'letter-pm', custom: [], marks: 2, exam: false, examWeight: 0.2, weighted: false };
}

function currGrading(school) {
    return Object.assign(currGradingDefaults(), school.grading || {});
}

// The scale in use, custom or preset, always as something with either `values` or a
// range. An unknown id falls back rather than throwing — a record can outlive a
// preset being renamed.
function currScale(grading) {
    if (grading.scale === 'custom') {
        return { name: 'Custom', values: (grading.custom || []).filter(function(v) {
            return v && String(v.label).trim() !== '';
        }) };
    }
    return CURR_SCALES[grading.scale] || CURR_SCALES['letter-pm'];
}

function currScaleIsList(scale) {
    return Array.isArray(scale.values) && scale.values.length > 0;
}

// A grade as written → what it is worth. Everything downstream is points.
function currGradePoints(grading, value) {
    if (value === undefined || value === null || value === '') return null;
    const scale = currScale(grading);
    if (currScaleIsList(scale)) {
        const want = String(value).trim().toLowerCase();
        for (let i = 0; i < scale.values.length; i++) {
            if (String(scale.values[i].label).trim().toLowerCase() === want) {
                const p = scale.values[i].points;
                return typeof p === 'number' && isFinite(p) ? p : null;
            }
        }
        return null;
    }
    const n = parseFloat(value);
    if (!isFinite(n)) return null;
    return scale.toPoints ? scale.toPoints(n) : n;
}

// Points → the nearest thing the scale can actually say. A calculated 3.85 on a
// letter scale is an A−, because there is no way to write 3.85 on a report card.
function currGradeLabel(grading, points) {
    if (points === null || points === undefined || !isFinite(points)) return '';
    const scale = currScale(grading);
    if (!currScaleIsList(scale)) {
        return String(Math.round(points * 10) / 10) + (scale.suffix || '');
    }
    // Exactly between two grades — a 3.5 on a scale with B+ at 3.3 and A− at 3.7 —
    // rounds *down*. The scale is listed best first, so letting a later value win a
    // tie is what does it. Claiming the higher grade on a tie is the wrong direction
    // to be wrong in on somebody's record.
    let best = null;
    scale.values.forEach(function(v) {
        if (typeof v.points !== 'number' || !isFinite(v.points)) return;
        const gap = Math.abs(v.points - points);
        if (!best || gap <= best.gap + 1e-9) best = { gap: gap, label: v.label };
    });
    return best ? best.label : '';
}

// ---- Which marking periods a placement collects ------------------------------
// From the school's own terms, so a semester school gets quarters and a trimester
// school gets thirds. Numbering runs across the year: a course taken only in the
// second semester is marked Q3 and Q4, which is what its report card says.

function currMarkSlots(planner, grading, termKey) {
    const per = Math.max(1, Math.min(6, parseInt(grading.marks, 10) || 1));
    const terms = planner.main.length ? planner.main : [{ id: planner.spanId, label: planner.spanLabel }];
    const parsed = currTermParse(termKey || '');
    const covered = (!termKey || parsed.slot === planner.spanId)
        ? terms
        : terms.filter(function(t) { return t.id === parsed.slot; });
    const slots = [];
    terms.forEach(function(term, ti) {
        if (covered.indexOf(term) === -1) return;
        for (let m = 0; m < per; m++) {
            slots.push({
                id: term.id + '.' + (m + 1),
                // One mark a term is that term's own grade and wants its name; more
                // than one are quarters, numbered through the year.
                label: per === 1 ? term.label : 'Q' + (ti * per + m + 1),
                kind: 'mark'
            });
        }
        if (grading.exam) {
            slots.push({ id: term.id + '.X', label: term.label + ' exam', kind: 'exam' });
        }
    });
    return slots;
}

function currMarksFor(school, code) {
    const entry = (school.marks || {})[code] || {};
    return { m: entry.m || {}, final: entry.final === undefined ? null : entry.final };
}

// ---- What a course came out at ----------------------------------------------
// The one function everything asks. The card, the year header, the totals and the
// career page all read this, so none of them can disagree with any other.

function currCourseGrade(school, code, planner) {
    const grading = currGrading(school);
    const entry = currMarksFor(school, code);
    if (entry.final !== null && entry.final !== '') {
        const points = currGradePoints(grading, entry.final);
        return { label: String(entry.final), points: points, source: 'entered' };
    }
    const shape = planner || currPlanner(school);
    const slots = currMarkSlots(shape, grading, currPlacementOf(school, code));
    const byTerm = {};
    slots.forEach(function(slot) {
        const points = currGradePoints(grading, entry.m[slot.id]);
        if (points === null) return;
        const term = slot.id.split('.')[0];
        if (!byTerm[term]) byTerm[term] = { marks: [], exam: null };
        if (slot.kind === 'exam') byTerm[term].exam = points;
        else byTerm[term].marks.push(points);
    });

    const termScores = [];
    Object.keys(byTerm).forEach(function(term) {
        const t = byTerm[term];
        const mean = t.marks.length
            ? t.marks.reduce(function(a, b) { return a + b; }, 0) / t.marks.length : null;
        if (mean === null && t.exam === null) return;
        if (mean === null) { termScores.push(t.exam); return; }
        if (t.exam === null) { termScores.push(mean); return; }
        const w = Math.max(0, Math.min(1, grading.examWeight));
        termScores.push(mean * (1 - w) + t.exam * w);
    });
    if (!termScores.length) return { label: '', points: null, source: 'none' };
    const points = termScores.reduce(function(a, b) { return a + b; }, 0) / termScores.length;
    return { label: currGradeLabel(grading, points), points: points, source: 'calculated' };
}

// ---- GPA ---------------------------------------------------------------------

function currLevelBonus(course) {
    const level = String((course || {}).level || '');
    for (let i = 0; i < CURR_LEVEL_BONUS.length; i++) {
        if (CURR_LEVEL_BONUS[i].re.test(level)) return CURR_LEVEL_BONUS[i].add;
    }
    return 0;
}

// Credit-weighted, over whatever has a grade. A middle school where every course is
// worth zero credits would divide by nothing, so it falls back to a plain mean —
// the grades are real even where the credits are not.
function currGpaOf(school, codes, planner) {
    const grading = currGrading(school);
    const byCode = currByCode(school);
    let weighted = 0;
    let credits = 0;
    let plain = 0;
    let n = 0;
    codes.forEach(function(code) {
        const grade = currCourseGrade(school, code, planner);
        if (grade.points === null) return;
        const course = byCode[code];
        const points = grade.points + (grading.weighted ? currLevelBonus(course) : 0);
        const credit = (course && course.credits) || 0;
        weighted += points * credit;
        credits += credit;
        plain += points;
        n++;
    });
    if (!n) return null;
    return credits > 0 ? weighted / credits : plain / n;
}

function currLevelCodes(school, level, planner) {
    const codes = [];
    [planner.spanId].concat(planner.terms.map(function(t) { return t.id; })).forEach(function(slot) {
        (school.plan[currTermKey(level, slot)] || []).forEach(function(code) {
            if (codes.indexOf(code) === -1) codes.push(code);
        });
    });
    return codes;
}

// Everything with a grade at this school: planned, and ticked off before the plan.
function currGradedCodes(school) {
    const codes = [];
    Object.keys(school.plan || {}).forEach(function(term) {
        (school.plan[term] || []).forEach(function(code) {
            if (codes.indexOf(code) === -1) codes.push(code);
        });
    });
    (school.completed || []).forEach(function(code) {
        if (codes.indexOf(code) === -1) codes.push(code);
    });
    return codes;
}

function currSchoolGpa(school) {
    if (!school.catalog) return null;
    return currGpaOf(school, currGradedCodes(school), currPlanner(school));
}

function currFormatGpa(n) {
    return n === null || n === undefined ? '—' : (Math.round(n * 100) / 100).toFixed(2);
}

// ---- Entering one ------------------------------------------------------------
// A scale with a list of labels gets a select, because a grade that is not on the
// scale is not a grade. A continuous one gets a number bounded by the scale.

function currGradeInput(grading, value, handler, extra) {
    const scale = currScale(grading);
    const attrs = ' class="curr-mark' + (extra || '') + '" onchange="' + handler + '"';
    if (currScaleIsList(scale)) {
        return '<select' + attrs + '><option value="">–</option>' +
            scale.values.map(function(v) {
                return '<option value="' + escapeHtml(v.label) + '"' +
                    (String(value) === String(v.label) ? ' selected' : '') + '>' +
                    escapeHtml(v.label) + '</option>';
            }).join('') + '</select>';
    }
    return '<input type="number"' + attrs +
        ' min="' + (scale.min || 0) + '" max="' + (scale.max || 100) + '"' +
        ' step="' + (scale.step || 1) + '" value="' +
        escapeHtml(value === undefined || value === null ? '' : String(value)) + '">';
}

function currSetMark(el, code, slot) {
    const widget = currGetWidget(el);
    const toolId = currGetToolId(el);
    if (!widget || !toolId) return;
    const data = currGetData(toolId);
    data.marks = data.marks || {};
    const entry = data.marks[code] || { m: {}, final: null };
    entry.m = entry.m || {};
    if (el.value === '') delete entry.m[slot]; else entry.m[slot] = el.value;
    if (!Object.keys(entry.m).length && (entry.final === null || entry.final === '')) {
        delete data.marks[code];
    } else {
        data.marks[code] = entry;
    }
    currSaveData(toolId, data);
    currRender(widget);
}

// Typed over the top. It stays until it is cleared, and says so — a grade someone
// entered and a grade the tool worked out must never look the same.
function currSetFinal(el, code) {
    const widget = currGetWidget(el);
    const toolId = currGetToolId(el);
    if (!widget || !toolId) return;
    const data = currGetData(toolId);
    data.marks = data.marks || {};
    const entry = data.marks[code] || { m: {}, final: null };
    entry.final = el.value === '' ? null : el.value;
    if (entry.final === null && !Object.keys(entry.m || {}).length) delete data.marks[code];
    else data.marks[code] = entry;
    currSaveData(toolId, data);
    currRender(widget);
}

function currClearFinal(btn, code) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    const data = currGetData(toolId);
    const entry = (data.marks || {})[code];
    if (!entry) return;
    entry.final = null;
    if (!Object.keys(entry.m || {}).length) delete data.marks[code];
    currSaveData(toolId, data);
    currRender(widget);
}

// ---- The marks for one course, for the details panel -------------------------

function currCourseMarksHtml(data, code) {
    const planner = currPlanner(data);
    const grading = currGrading(data);
    const placed = currPlacementOf(data, code);
    const met = currIsCompleted(data, code);
    if (!placed && !met) return '';
    const entry = currMarksFor(data, code);
    const grade = currCourseGrade(data, code, planner);
    const slots = placed ? currMarkSlots(planner, grading, placed) : [];

    let html = '<div class="curr-marks"><div class="curr-marks-head">Grades</div>';
    if (slots.length) {
        html += '<div class="curr-marks-row">' + slots.map(function(slot) {
            return '<label class="curr-mark-cell' + (slot.kind === 'exam' ? ' exam' : '') + '">' +
                '<span>' + escapeHtml(slot.label) + '</span>' +
                currGradeInput(grading, entry.m[slot.id],
                    'currSetMark(this, \'' + escapeHtml(code) + '\', \'' + slot.id + '\')') +
            '</label>';
        }).join('') + '</div>';
    } else {
        html += '<div class="curr-note">Taken before this plan, so there are no marking ' +
            'periods to fill in — just the final grade.</div>';
    }

    html += '<div class="curr-marks-final"><span>Final</span>' +
        currGradeInput(grading, entry.final === null ? '' : entry.final,
            'currSetFinal(this, \'' + escapeHtml(code) + '\')', ' final') +
        (grade.source === 'entered'
            ? '<span class="curr-mark-note entered">as entered' +
              ' <button class="curr-btn" onclick="currClearFinal(this, \'' + escapeHtml(code) +
              '\')">use the calculated one</button></span>'
            : grade.source === 'calculated'
                ? '<span class="curr-mark-note">calculated: <b>' + escapeHtml(grade.label) +
                  '</b> · ' + currFormatGpa(grade.points) + ' points</span>'
                : '<span class="curr-mark-note">no marks yet</span>') +
        '</div></div>';
    return html;
}

// ---- The Grades tab ----------------------------------------------------------
// A report card arrives with every course on it at once, and entering it one course
// at a time through the details panel would be miserable.

function currGradesHtml(data) {
    const planner = currPlanner(data);
    const grading = currGrading(data);
    const byCode = currByCode(data);
    const scale = currScale(grading);

    let html = '<div class="curr-grades">';
    if (!currScaleIsList(scale) && !scale.min && scale.min !== 0) {
        html += '<div class="curr-note">This school has no grading scale set.</div>';
    }

    let any = false;
    planner.levels.forEach(function(level) {
        const codes = currLevelCodes(data, level, planner);
        if (!codes.length) return;
        any = true;
        const gpa = currGpaOf(data, codes, planner);
        // Every column the year has, so a one-semester course sits under the quarters
        // it was actually taken in rather than sliding along to the first free slot.
        const columns = currMarkSlots(planner, grading, currTermKey(level, planner.spanId));
        html += '<div class="curr-grades-year">' +
            '<div class="curr-grades-year-head"><b>' +
                escapeHtml(currLevelLabel(planner, level)) + '</b>' +
            '<span>' + currFormatCredits(currLevelCredits(data, level, planner)) + ' cr</span>' +
            '<span>GPA ' + currFormatGpa(gpa) + '</span></div>' +
            '<div class="curr-grades-row heads"><span class="curr-grades-name"></span>' +
                columns.map(function(slot) {
                    return '<span class="curr-grades-cell' + (slot.kind === 'exam' ? ' exam' : '') +
                        '">' + escapeHtml(slot.label) + '</span>';
                }).join('') +
                '<span class="curr-grades-final">Final</span></div>';
        codes.forEach(function(code) {
            const course = byCode[code];
            const placed = currPlacementOf(data, code);
            const mine = {};
            currMarkSlots(planner, grading, placed).forEach(function(slot) { mine[slot.id] = true; });
            const entry = currMarksFor(data, code);
            const grade = currCourseGrade(data, code, planner);
            html += '<div class="curr-grades-row">' +
                '<span class="curr-grades-name" onclick="currSelectCode(event, this, \'' +
                    escapeHtml(code) + '\')" title="' + escapeHtml((course || {}).title || code) + '">' +
                    '<span class="curr-code">' + escapeHtml(code) + '</span> ' +
                    escapeHtml((course || {}).title || code) + '</span>' +
                columns.map(function(slot) {
                    return '<span class="curr-grades-cell' + (slot.kind === 'exam' ? ' exam' : '') +
                        '" title="' + escapeHtml(slot.label) + '">' +
                        (mine[slot.id]
                            ? currGradeInput(grading, entry.m[slot.id],
                                'currSetMark(this, \'' + escapeHtml(code) + '\', \'' + slot.id + '\')')
                            : '<span class="curr-grades-gap" title="Not taken this term">·</span>') +
                    '</span>';
                }).join('') +
                '<span class="curr-grades-final' + (grade.source === 'entered' ? ' entered' : '') + '">' +
                    currGradeInput(grading, entry.final === null ? '' : entry.final,
                        'currSetFinal(this, \'' + escapeHtml(code) + '\')', ' final') +
                    '<i>' + (grade.source === 'calculated' ? escapeHtml(grade.label) :
                             grade.source === 'entered' ? 'entered' : '') + '</i>' +
                '</span>' +
            '</div>';
        });
        html += '</div>';
    });

    // Ticked off before the plan: no marking periods, but a grade that still counts.
    const met = (data.completed || []).filter(function(code) { return byCode[code]; });
    if (met.length) {
        html += '<div class="curr-grades-year"><div class="curr-grades-year-head">' +
            '<b>Already met</b><span>before this plan</span></div>';
        met.forEach(function(code) {
            const entry = currMarksFor(data, code);
            html += '<div class="curr-grades-row">' +
                '<span class="curr-grades-name"><span class="curr-code">' + escapeHtml(code) +
                    '</span> ' + escapeHtml(byCode[code].title) + '</span>' +
                '<span class="curr-grades-final">' +
                    currGradeInput(grading, entry.final === null ? '' : entry.final,
                        'currSetFinal(this, \'' + escapeHtml(code) + '\')', ' final') +
                '</span></div>';
        });
        html += '</div>';
        any = true;
    }

    if (!any) {
        html += '<div class="curr-note">Nothing in the plan yet. Place a course and its ' +
            'marking periods appear here.</div>';
    }
    const gpa = currSchoolGpa(data);
    html += '<div class="curr-grades-total"><b>' + escapeHtml(currSchoolName(data)) + '</b>' +
        '<span>GPA ' + currFormatGpa(gpa) + (grading.weighted ? ' · weighted' : '') + '</span></div>';
    return html + '</div>';
}

// ---- Grading settings, beside the rest of a school's setup --------------------

function currGradingHtml(record) {
    const school = currCurrentSchool(record);
    const grading = currGrading(school);
    const scale = currScale(grading);
    let html = '<div class="curr-grading"><div class="curr-grading-row">' +
        '<span class="curr-grading-lbl">Grades</span>' +
        '<select onchange="currSetGrading(this, \'scale\')" title="The scale this school marks on">' +
            Object.keys(CURR_SCALES).map(function(id) {
                return '<option value="' + id + '"' + (grading.scale === id ? ' selected' : '') +
                    '>' + escapeHtml(CURR_SCALES[id].name) + '</option>';
            }).join('') +
            '<option value="custom"' + (grading.scale === 'custom' ? ' selected' : '') +
                '>Custom…</option>' +
        '</select>' +
        '<label title="How many marks the school gives in each term">' +
            '<select onchange="currSetGrading(this, \'marks\')">' +
                [1, 2, 3, 4].map(function(n) {
                    return '<option value="' + n + '"' + (grading.marks === n ? ' selected' : '') +
                        '>' + n + ' per term</option>';
                }).join('') +
            '</select></label>' +
        '<label title="An exam at the end of each term, counted separately">' +
            '<input type="checkbox"' + (grading.exam ? ' checked' : '') +
            ' onchange="currSetGrading(this, \'exam\')">exam</label>' +
        (grading.exam ? '<label title="What the exam is worth inside its term">' +
            '<input type="number" min="0" max="100" step="5" value="' +
            Math.round(grading.examWeight * 100) + '" onchange="currSetGrading(this, \'examWeight\')">%' +
            '</label>' : '') +
        '<label title="Honors +0.5, AP and equivalent +1.0">' +
            '<input type="checkbox"' + (grading.weighted ? ' checked' : '') +
            ' onchange="currSetGrading(this, \'weighted\')">weighted</label>' +
        '</div>';

    if (grading.scale === 'custom') {
        html += '<div class="curr-grading-custom">';
        (grading.custom || []).forEach(function(v, i) {
            html += '<span class="curr-grading-val">' +
                '<input value="' + escapeHtml(v.label || '') + '" placeholder="A" ' +
                    'oninput="currSetCustomGrade(this, ' + i + ', \'label\')">' +
                '<input type="number" step="0.1" value="' +
                    escapeHtml(v.points === undefined ? '' : String(v.points)) + '" placeholder="4.0" ' +
                    'oninput="currSetCustomGrade(this, ' + i + ', \'points\')">' +
                '<button class="curr-x" onclick="currRemoveCustomGrade(this, ' + i + ')">×</button>' +
            '</span>';
        });
        html += '<button class="curr-btn" onclick="currAddCustomGrade(this)">+ grade</button>' +
            '<div class="curr-note">Best first. The number is what it is worth towards a GPA.</div>';
        html += '</div>';
    } else if (currScaleIsList(scale)) {
        html += '<div class="curr-note">' + scale.values.map(function(v) {
            return escapeHtml(v.label) + ' ' + v.points;
        }).join(' · ') + '</div>';
    }
    return html + '</div>';
}

function currSetGrading(el, field) {
    const widget = currGetWidget(el);
    const toolId = currGetToolId(el);
    const record = currGetRecord(toolId);
    const school = currCurrentSchool(record);
    const grading = currGrading(school);
    if (field === 'marks') grading.marks = parseInt(el.value, 10) || 1;
    else if (field === 'exam') grading.exam = el.checked;
    else if (field === 'weighted') grading.weighted = el.checked;
    else if (field === 'examWeight') grading.examWeight = Math.max(0, Math.min(1, (parseFloat(el.value) || 0) / 100));
    else if (field === 'scale') {
        grading.scale = el.value;
        // Switching to Custom with nothing in it would leave no grade enterable, so
        // it starts as a copy of what was showing.
        if (el.value === 'custom' && !(grading.custom || []).length) {
            const from = CURR_SCALES[school.grading && school.grading.scale] || CURR_SCALES['letter-pm'];
            grading.custom = (from.values || []).map(function(v) {
                return { label: v.label, points: v.points };
            });
        }
    }
    school.grading = grading;
    currSaveRecord(toolId, record);
    currRender(widget);
}

function currSetCustomGrade(el, i, field) {
    const widget = currGetWidget(el);
    const toolId = currGetToolId(el);
    const record = currGetRecord(toolId);
    const school = currCurrentSchool(record);
    const grading = currGrading(school);
    grading.custom = (grading.custom || []).slice();
    if (!grading.custom[i]) return;
    grading.custom[i] = Object.assign({}, grading.custom[i]);
    grading.custom[i][field] = field === 'points' ? (parseFloat(el.value) || 0) : el.value;
    school.grading = grading;
    currSaveRecord(toolId, record);
    // Typing a label must not rebuild the field being typed in.
    const totals = widget.querySelector('.curr-totals');
    if (totals) totals.outerHTML = currTotalsHtml(currGetData(toolId));
}

function currAddCustomGrade(btn) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    const record = currGetRecord(toolId);
    const school = currCurrentSchool(record);
    const grading = currGrading(school);
    grading.custom = (grading.custom || []).concat([{ label: '', points: 0 }]);
    school.grading = grading;
    currSaveRecord(toolId, record);
    currRender(widget);
}

function currRemoveCustomGrade(btn, i) {
    const widget = currGetWidget(btn);
    const toolId = currGetToolId(btn);
    const record = currGetRecord(toolId);
    const school = currCurrentSchool(record);
    const grading = currGrading(school);
    grading.custom = (grading.custom || []).slice();
    grading.custom.splice(i, 1);
    school.grading = grading;
    currSaveRecord(toolId, record);
    currRender(widget);
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

    const record = currGetRecord(toolId);
    const bar = widget.querySelector('.curr-schools-bar');
    if (bar) bar.innerHTML = currSchoolsBarHtml(record);

    if (currShowingCareer(record)) {
        explorer.innerHTML = currCareerHtml(record);
        return;
    }

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
        '<div class="curr-right">' + currRightWithTransfers(toolId, data, validation) + '</div>';

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
        currFlagBadgesHtml(course) +
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
    // A course taken in one school for another school's credit carries two credit
    // values, and they must not be confused: `credits` counts here, this counts there.
    if (course.flags && course.flags.high_school_credit) {
        html += '<p class="curr-earns">Earns high school credit' +
            (typeof course.high_school_credits === 'number'
                ? ': ' + currFormatCredits(course.high_school_credits) + ' credits, counted at the ' +
                  'school it transfers to rather than here.' : '.') + '</p>';
    }
    const met = currIsCompleted(data, code);
    html += '<p>' + (met ? 'Already met, before this plan' :
            placed ? 'Planned for ' + escapeHtml(currTermLabel(planner, placed)) : 'Not in the plan') +
        ' · <button class="curr-btn" onclick="currAutoPlaceCode(this, \'' + escapeHtml(code) + '\')">' +
        (placed ? 'Move to the first year it fits' : 'Add to the plan') + '</button>' +
        ' <button class="curr-btn' + (met ? ' active' : '') + '" onclick="currToggleCompletedCode(this, \'' +
        escapeHtml(code) + '\')" title="Taken before this plan begins">' +
        (met ? 'Not met after all' : 'Already met') + '</button></p>';
    html += currCourseMarksHtml(data, code);
    html += '</div>';
    return html;
}

// ---- The right pane: grid, tree, issues -----------------------------------

function currRightHtml(data, validation) {
    // Schema is about the shape of the document, so it sits beside the JSON pane
    // rather than beside the plan. A tool last left on it opens on the grid.
    const tab = data.ui.tab === 'schema' ? 'grid' : (data.ui.tab || 'grid');
    const tabs = [['grid', 'Grid'], ['grades', 'Grades'], ['tree', 'Tree'], ['issues', 'Issues']];
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
            tab === 'grades' ? currGradesHtml(data) :
            tab === 'issues' ? currIssuesHtml(data, validation) :
            currGridHtml(data, validation)) +
        '</div>';
    return html;
}

// currRightHtml is handed one school, as everything below it is. What transferred
// into that school is a fact about the record, so it is added where the record is
// in scope.
function currRightWithTransfers(toolId, data, validation) {
    return currRightHtml(data, validation) + currTransfersHtml(data, currGetRecord(toolId));
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
        const year = currAcademicYear(data, planner, level);
        const gpa = currGpaOf(data, currLevelCodes(data, level, planner), planner);
        html +=
            '<div class="curr-year">' +
                '<div class="curr-year-head" title="' + escapeHtml(currLevelLabel(planner, level)) + '">' +
                    '<b>' + escapeHtml(currLevelLabel(planner, level)) + '</b>' +
                    (year ? '<span class="curr-year-when">' + escapeHtml(year) + '</span>' : '') +
                    '<span>' + currFormatCredits(credits) + ' cr</span>' +
                    (gpa === null ? '' : '<span class="curr-year-gpa" title="Credit-weighted, ' +
                        'over the courses with a grade">GPA ' + currFormatGpa(gpa) + '</span>') +
                '</div>' +
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
            html += currCardHtml(data, validation, byCode[code], code, key, planner);
        });
    }
    return html + '</div>';
}

function currCardHtml(data, validation, course, code, term, planner) {
    const issues = (validation.byTerm[term] || []).filter(function(i) { return i.code === code; });
    const errors = issues.filter(function(i) { return i.severity === 'error'; }).length;
    const warnings = issues.filter(function(i) { return i.severity === 'warning'; }).length;
    const title = course ? course.title : code + ' (not in this catalog)';
    const badge = errors ? '<span class="curr-badge err" title="' +
            escapeHtml(issues.map(function(i) { return i.message; }).join('\n')) + '">' + errors + '</span>' :
        (warnings ? '<span class="curr-badge warn" title="' +
            escapeHtml(issues.map(function(i) { return i.message; }).join('\n')) + '">' + warnings + '</span>' : '');
    const selected = data.ui.selected === code;
    // How it came out. Muted when the tool worked it out, solid when someone typed it.
    // The planner comes down from the grid rather than being rebuilt per card — it
    // reads every course in the catalog, and there are a lot of cards.
    const mark = currCourseGrade(data, code, planner);
    const grade = mark.label
        ? '<span class="curr-card-grade' + (mark.source === 'entered' ? ' entered' : '') +
          '" title="' + escapeHtml(mark.source === 'entered' ? 'As entered' :
              'Calculated from the marking periods') + '">' + escapeHtml(mark.label) + '</span>'
        : '';
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
        '<span class="curr-card-title">' + escapeHtml(title) + '</span>' + grade + badge + arrows +
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
            '<span class="curr-req-num">' + currFormatCredits(priorTotal) + ' credits</span></div>' : '') +
        (function() {
            const gpa = currSchoolGpa(data);
            return gpa === null ? '' : '<div class="curr-req"><span class="curr-req-caret"></span>' +
                '<span class="curr-req-name">GPA' +
                (currGrading(data).weighted ? ' <i>weighted</i>' : '') + '</span>' +
                '<span class="curr-req-num">' + currFormatGpa(gpa) + '</span></div>';
        })();

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
        // Credit accepted from an earlier school for something this one does not
        // teach. There is no course here to count, so it is counted as itself.
        const looseHere = (data.credits_in || []).filter(function(entry) {
            return currNormTitle(entry.subject) === currNormTitle(req.subject);
        });
        looseHere.forEach(function(entry) { got += entry.credits || 0; });
        const need = req.credits_required || 0;
        const pct = need ? Math.min(100, Math.round((got / need) * 100)) : 100;
        const showing = open.indexOf(req.subject) !== -1;
        const anything = made.length + looseHere.length;
        html += '<div class="curr-req' + (anything ? ' openable' : '') + '"' +
                (anything ? ' onclick="currToggleReq(this, \'' + escapeHtml(req.subject) + '\')"' : '') + '>' +
            '<span class="curr-req-caret">' + (anything ? (showing ? '▾' : '▸') : '') + '</span>' +
            '<span class="curr-req-name" title="' + escapeHtml(req.notes || '') + '">' +
                escapeHtml(req.subject) + '</span>' +
            '<span class="curr-bar"><i class="' + (got >= need ? 'done' : '') + '" style="width:' + pct + '%"></i></span>' +
            '<span class="curr-req-num">' + currFormatCredits(got) + ' / ' + currFormatCredits(need) + '</span>' +
        '</div>';
        // What the number is made of. A requirement is only useful if you can see
        // which classes it is counting, especially where one counts in two places.
        if (showing) {
            html += '<div class="curr-req-courses">' +
                looseHere.map(function(entry) {
                    return '<div class="curr-req-course">' +
                        '<span class="curr-code">—</span> ' + escapeHtml(entry.title || 'Transferred credit') +
                        '<span class="curr-req-where">transferred' +
                            (entry.from ? ' from ' + escapeHtml(entry.from) : '') + ' · ' +
                            currFormatCredits(entry.credits) + '</span>' +
                    '</div>';
                }).join('') +
                made.map(function(course) {
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
        // A catalog can arrive without having been through the loader — a board
        // imported from someone else, state from an older version of this tool.
        // Every school's, not just the one on screen: switching to another must not
        // be the moment its document first gets read properly.
        const record = currGetRecord(toolId);
        let fixed = false;
        record.schools.forEach(function(school) {
            if (school.catalog && school.catalog.courses && !school.catalog.normalized_by_explorer) {
                school.catalog = currNormalizeDoc(school.catalog);
                fixed = true;
            }
        });
        if (fixed) currSaveRecord(toolId, record);
        const data = currGetData(toolId);
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
    // The record's own list: Load, File and Sample act on whichever school is
    // showing, so which one that is has to be visible from here.
    const list = pane.querySelector('.curr-school-pane');
    if (list) {
        const record = currGetRecord(currGetToolId(pane));
        list.innerHTML = (record.schools.length > 1 || record.schools[0].catalog)
            ? currSchoolListHtml(record) + (currShowingCareer(record) ? '' : currGradingHtml(record))
            : '';
    }
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

PluginRegistry.registerTool({
    id: 'curriculum-builder',
    name: 'Curriculum Builder',
    description: 'Write a curriculum document a course at a time, checked as you go',
    icon: '🏗️',
    version: CURR_VERSION,
    toolbox: 'school-tools',
    tags: ['curriculum', 'school', 'course', 'catalog', 'author', 'json', 'education'],
    title: 'Curriculum Builder',
    content: `<div class="cbld-widget">
<div class="cbld-actions">
<button class="curr-btn" onclick="cbldStart(this)" title="Begin an empty curriculum">New</button>
<label class="curr-btn curr-file" title="Open a curriculum file">Open<input type="file" accept=".json,application/json" onchange="cbldHandleFile(this)"></label>
<button class="curr-btn" onclick="cbldLoadSample(this)" title="Fill the builder with a small invented catalog">Sample</button>
</div>
<div class="cbld-status"></div>
<div class="authoring-split">
<div class="authoring-source cbld-editor"></div>
<div class="authoring-resizer"></div>
<div class="authoring-result cbld-out"></div>
</div>
</div>`,
    // The same framework the other two use, the other way round. Here the editing
    // is the source and the JSON is what it produces, so Build is the mode you work
    // in and JSON is the mode you read the result in.
    authoring: {
        modes: ['edit', 'split', 'render'],
        defaultMode: 'edit',
        source: '.cbld-editor',
        result: '.cbld-out',
        actions: '.cbld-actions',
        labels: { edit: 'Build', render: 'JSON' },
        titles: { edit: 'The curriculum you are building', render: 'The document it produces' },
        onRender: 'cbldOnRender'
    },
    hashParams: 'cbldApplyHashParams',
    guide: 'learn/tools/curriculum-explorer.html',
    contentType: 'html',
    onInit: 'cbldInit',
    defaultWidth: 940,
    defaultHeight: 640,
    source: 'external'
});

// =============================================
// CURRICULUM BUILDER
// =============================================
// The explorer plans against a document; the doctor says what is wrong with one.
// This is where a document comes from. It edits the catalog in structured form —
// a course at a time, with every prerequisite title resolved against the titles
// that actually exist — and writes the JSON out on the other side.
//
// Two rules run through all of it.
//
//   * The model is the document as authored, kept whole. currNormalizeDoc fills in
//     defaults and stamps fields of its own, which is right for reading and wrong
//     for a file you hand to a school, so it is only ever run on a copy. A document
//     opened and saved without an edit comes back exactly as it went in.
//   * A field this form does not show is still a field. An edit writes one key into
//     the model and never rebuilds a course out of the inputs, so cross_credit,
//     title_variants and whatever else a real catalog carries survive being edited
//     by a form that has never heard of them.

const CBLD_SECTIONS = [
    { id: 'document', name: 'Document' },
    { id: 'planner', name: 'Planner' },
    { id: 'subjects', name: 'Subjects' },
    { id: 'pathways', name: 'Pathways' },
    { id: 'courses', name: 'Courses' }
];

// A whole catalog re-serialised into the JSON pane on every keystroke is more work
// than a keystroke deserves, so the pane and the tally follow a beat behind.
let cbldSaveTimer = null;
let cbldRefreshTimer = null;

// The reading copy is rebuilt only when the document has actually changed.
const cbldRev = {};
const cbldViews = {};

// Past this the JSON pane shows the beginning and says so. Copy and Save are
// unaffected — they always write the whole document.
const CBLD_PREVIEW = 120000;

// ---- Instance plumbing ------------------------------------------------------

function cbldGetWidget(el) {
    return el && el.closest ? el.closest('.cbld-widget') : null;
}

function cbldWidgetFor(toolId) {
    const tool = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    return tool ? tool.querySelector('.cbld-widget') : null;
}

function cbldGetData(toolId) {
    const custom = toolCustomizations[toolId] || {};
    const d = custom.builder || {};
    // Every field this tool keeps has to be named here, or it is written and then
    // dropped on the next read.
    return {
        catalog: d.catalog || null,
        sourceUrl: d.sourceUrl || null,
        ui: Object.assign({ section: 'courses', selected: null, search: '',
            checkOpen: false, open: [] }, d.ui || {})
    };
}

function cbldSaveData(toolId, data) {
    cbldHold(toolId, data);
    try {
        saveToolCustomizations(toolCustomizations);
        return true;
    } catch (e) {
        cbldSetStatus(cbldWidgetFor(toolId), 'err', 'This document is too large for the space ' +
            'this board has left. It is here and editable, but it will not survive a reload — ' +
            'save the JSON now.');
        return false;
    }
}

// In memory at once, on disk shortly. The edit has to be visible to the next read
// immediately or a second keystroke would be applied to the state before the first.
function cbldHold(toolId, data) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].builder = data;
    cbldRev[toolId] = (cbldRev[toolId] || 0) + 1;
}

function cbldSaveSoon(toolId, data) {
    cbldHold(toolId, data);
    clearTimeout(cbldSaveTimer);
    cbldSaveTimer = setTimeout(function() { cbldSaveData(toolId, data); }, 400);
}

function cbldSetStatus(widget, kind, message) {
    const status = widget && widget.querySelector('.cbld-status');
    if (!status) return;
    status.className = 'cbld-status' + (kind ? ' ' + kind : '');
    status.textContent = message || '';
}

// The explorer's own confirmation, with this tool's status line and its own label.
function cbldNeedsConfirm(btn, key, message) {
    const id = (currGetToolId(btn) || '') + ':cbld:' + key;
    if (currArmed[id]) {
        currDisarm(btn, id);
        return false;
    }
    const widget = cbldGetWidget(btn);
    if (!btn.getAttribute('data-label')) btn.setAttribute('data-label', btn.textContent);
    btn.textContent = 'Sure?';
    btn.classList.add('armed');
    cbldSetStatus(widget, 'err', message);
    currArmed[id] = setTimeout(function() {
        currDisarm(btn, id);
        cbldSetStatus(widget, '', '');
    }, CURR_ARM_MS);
    return true;
}

// ---- The reading copy -------------------------------------------------------

// Everything that reads a curriculum — the planner, the title index, requirement
// matching, the doctor's checks — expects a document currNormalizeDoc has been
// over. That function fills in defaults and adds fields of its own, so it runs on
// a copy and the copy is never what gets written out.
function cbldView(toolId, catalog) {
    const rev = cbldRev[toolId] || 0;
    const cached = cbldViews[toolId];
    if (cached && cached.rev === rev && cached.src === catalog) return cached.view;
    let copy = { courses: [] };
    if (catalog) {
        copy = JSON.parse(JSON.stringify(catalog));
        if (!Array.isArray(copy.courses)) copy.courses = [];
        copy.courses = copy.courses.filter(function(c) { return c && typeof c === 'object'; });
        currNormalizeDoc(copy);
    }
    const view = { catalog: copy };
    cbldViews[toolId] = { rev: rev, src: catalog, view: view };
    return view;
}

function cbldBlank() {
    return {
        school: { name: '' },
        document: { title: '', academic_year: '' },
        planner: { levels: [9, 10, 11, 12], terms: ['Semester 1', 'Semester 2'] },
        graduation_requirements: { credits_by_subject: [] },
        courses: []
    };
}

// Older documents carry this under `guide`; either is read, so whichever one the
// document already uses is the one that gets edited.
function cbldMetaKey(catalog) {
    return (catalog && catalog.guide && !catalog.document) ? 'guide' : 'document';
}

function cbldCourses(data) {
    return (data.catalog && Array.isArray(data.catalog.courses)) ? data.catalog.courses : [];
}

function cbldEmptyValue(value) {
    return value === '' || value === undefined || value === null ||
        (typeof value === 'number' && !isFinite(value));
}

function cbldBlankNode(node) {
    if (Array.isArray(node)) return node.length === 0;
    return node && typeof node === 'object' && Object.keys(node).length === 0;
}

// Writes one value at a dotted path, creating whatever has to exist on the way.
// Emptying a field removes the key rather than writing "" into the file, and a
// block left with nothing in it goes too — an empty section in a curriculum reads
// as one somebody forgot to fill in, which is a different claim from silence.
function cbldSetIn(doc, path, value) {
    const keys = path.split('.');
    const chain = [doc];
    let node = doc;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!node[key] || typeof node[key] !== 'object') {
            if (cbldEmptyValue(value)) return;
            node[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
        }
        node = node[key];
        chain.push(node);
    }
    const last = keys[keys.length - 1];
    if (!cbldEmptyValue(value)) { node[last] = value; return; }
    // A cleared entry in a list stays in the list; removing it is what its × is for.
    if (Array.isArray(node)) { node[last] = ''; return; }
    // The catalog itself is the one thing a document cannot be without.
    if (node === doc && last === 'courses') { doc.courses = []; return; }
    delete node[last];
    for (let i = chain.length - 1; i > 0; i--) {
        const parent = chain[i - 1];
        const key = keys[i - 1];
        if (parent === doc && key === 'courses') break;
        if (Array.isArray(parent) || !cbldBlankNode(chain[i])) break;
        delete parent[key];
    }
}

function cbldGetIn(doc, path) {
    const keys = path.split('.');
    let node = doc;
    for (let i = 0; i < keys.length; i++) {
        if (!node || typeof node !== 'object') return undefined;
        node = node[keys[i]];
    }
    return node;
}

// Inline handlers carry course codes, flag names and titles from the document, and
// a document is not required to be polite about quotes.
function cbldArg(value) {
    return escapeHtml(String(value === undefined || value === null ? '' : value)
        .replace(/\\/g, '\\\\').replace(/'/g, "\\'"));
}

function cbldVal(value) {
    return escapeHtml(value === undefined || value === null ? '' : String(value));
}

// ---- Rendering --------------------------------------------------------------

function cbldRender(widget) {
    if (!widget) return;
    const toolId = currGetToolId(widget);
    if (!toolId) return;
    widget.classList.toggle('narrow', widget.offsetWidth > 0 && widget.offsetWidth < 700);
    const data = cbldGetData(toolId);
    const editor = widget.querySelector('.cbld-editor');
    const out = widget.querySelector('.cbld-out');
    if (editor) {
        const list = editor.querySelector('.cbld-list');
        const kept = list ? list.scrollTop : 0;
        editor.innerHTML = cbldEditorHtml(toolId, data);
        const again = editor.querySelector('.cbld-list');
        if (again) again.scrollTop = kept;
        // A course reached from the tally, or one just added, is no use scrolled
        // past — the list is long and sorted by department, not by what you did last.
        const on = editor.querySelector('.cbld-crow.on');
        if (on && again && (on.offsetTop < again.scrollTop ||
            on.offsetTop > again.scrollTop + again.clientHeight - on.offsetHeight)) {
            again.scrollTop = Math.max(0, on.offsetTop - again.clientHeight / 2);
        }
    }
    if (out) out.innerHTML = cbldOutHtml(data);
}

function cbldRenderFor(el) {
    cbldRender(cbldGetWidget(el));
}

// A keystroke must not rebuild the form under the caret, so an edit refreshes only
// what an edit can change from outside the field being typed in: the document on
// the right, the tally above, the row in the list, and any title being matched
// against the catalog. Structure — adding, deleting, selecting, switching section —
// re-renders in full, as everything else in this app does.
function cbldRefreshSoon(widget, toolId) {
    clearTimeout(cbldRefreshTimer);
    cbldRefreshTimer = setTimeout(function() { cbldRefresh(widget, toolId); }, 250);
}

function cbldRefresh(widget, toolId) {
    if (!widget || !document.body.contains(widget)) return;
    const data = cbldGetData(toolId);
    const view = cbldView(toolId, data.catalog);
    const out = widget.querySelector('.cbld-out');
    if (out) out.innerHTML = cbldOutHtml(data);
    const check = widget.querySelector('.cbld-check');
    if (check) check.outerHTML = cbldCheckHtml(toolId, data);
    const i = data.ui.selected;
    if (typeof i === 'number') {
        const row = widget.querySelector('.cbld-crow[data-i="' + i + '"]');
        if (row && cbldCourses(data)[i]) row.outerHTML = cbldRowHtml(view, i, true);
    }
    cbldRefreshLive(widget, data, view);
    cbldRefreshMatches(widget, view);
}

// Every place a title is typed at a course — a prerequisite, a pathway group —
// answers the same way, so they are all one kind of row and all refresh together.
// Some of what this tool says is an answer to the field being typed in: whether a
// subject matches anything, whether a code is already taken, how a prerequisite
// line is being read. Those spots are marked, and recomputed with everything else.
function cbldRefreshLive(widget, data, view) {
    const live = widget.querySelectorAll('[data-live]');
    Array.prototype.forEach.call(live, function(el) {
        el.outerHTML = cbldLiveHtml(data, view, el.getAttribute('data-live'));
    });
}

function cbldLiveHtml(data, view, key) {
    const bits = String(key).split(':');
    const i = parseInt(bits[1], 10);
    if (bits[0] === 'req') {
        const reqs = (((data.catalog || {}).graduation_requirements || {}).credits_by_subject) || [];
        return cbldCoverHtml(view, reqs[i], i);
    }
    if (bits[0] === 'code') return cbldClashHtml(data, i);
    if (bits[0] === 'choice') return cbldChoiceHtml(data, i);
    return '';
}

// How much of a requirement this catalog could ever meet. The failure it catches is
// a subject spelled differently from the department it is meant to match, which is
// silent everywhere else — the bar simply never moves.
function cbldCoverHtml(view, req, i) {
    const tag = function(cls, text) {
        return '<div class="cbld-cover' + cls + '" data-live="req:' + i + '">' +
            escapeHtml(text) + '</div>';
    };
    if (!req) return tag('', '');
    if (!String(req.subject || '').trim()) return tag('', 'Name a subject.');
    const fineArts = currFineArtsIndex(view);
    let matched = 0;
    let available = 0;
    currCourses(view).forEach(function(course) {
        if (!currCountsToward(view, course, req.subject, fineArts)) return;
        matched++;
        available += course.credits || 0;
    });
    if (!matched) return tag(' bad', 'No course in this catalog counts towards this.');
    const need = typeof req.credits_required === 'number' ? req.credits_required : 0;
    return tag(available < need ? ' thin' : '',
        matched + (matched === 1 ? ' course counts' : ' courses count') + ' \u00b7 ' +
        currFormatCredits(available) + ' credits available' +
        (available < need ? ' \u2014 short of the ' + currFormatCredits(need) + ' asked for' : ''));
}

// A duplicate code is an error the tally reports, but it is worth saying where the
// code is being typed rather than only at the top of the tool.
function cbldClashHtml(data, i) {
    const courses = cbldCourses(data);
    const course = courses[i] || {};
    const code = String(course.course_code || '');
    const clash = code !== '' && courses.some(function(other, n) {
        return n !== i && String(other.course_code || '') === code;
    });
    return '<div class="cbld-cover' + (clash ? ' bad' : '') + '" data-live="code:' + i + '">' +
        (clash ? 'Another course already has this code.' : '') + '</div>';
}

// The one thing here that cannot be read off the data. A line wrongly marked as a
// choice passes an unmet prerequisite in silence, which is worse than a line that
// over-warns, so it says which way the document is currently being read.
function cbldChoiceHtml(data, i) {
    const prereq = (cbldCourses(data)[i] || {}).prerequisites || {};
    const names = Array.isArray(prereq.courses) ? prereq.courses : [];
    const unclear = names.length > 1 && prereq.choice !== true && !/ or /i.test(prereq.raw || '');
    return '<div class="cbld-cover' + (unclear ? ' thin' : '') + '" data-live="choice:' + i + '">' +
        (unclear ? 'Read as: all ' + names.length + ' are required. Check that against the ' +
            'printed line.' : '') + '</div>';
}

function cbldRefreshMatches(widget, view) {
    const rows = widget.querySelectorAll('.cbld-mrow');
    if (!rows.length) return;
    const index = currTitleIndex(view);
    const byCode = currByCode(view);
    Array.prototype.forEach.call(rows, function(row) {
        const hint = row.querySelector('.cbld-hint');
        const input = row.querySelector('input');
        if (!hint || !input) return;
        hint.innerHTML = cbldMatchHtml(index, byCode, input.value, row.getAttribute('data-path'));
    });
}

function cbldEditorHtml(toolId, data) {
    if (!data.catalog) return cbldStartHtml();
    const view = cbldView(toolId, data.catalog);
    const section = data.ui.section || 'courses';
    let html = cbldCheckHtml(toolId, data);
    html += '<div class="cbld-body"><div class="cbld-nav">';
    CBLD_SECTIONS.forEach(function(s) {
        const n = cbldSectionCount(data, s.id);
        html += '<button class="cbld-tab' + (s.id === section ? ' active' : '') +
            '" onclick="cbldSetSection(this, \'' + s.id + '\')">' + s.name +
            (n === null ? '' : '<span class="cbld-n">' + n + '</span>') + '</button>';
    });
    html += '</div><div class="cbld-pane">';
    if (section === 'document') html += cbldDocumentHtml(toolId, data, view);
    else if (section === 'planner') html += cbldPlannerHtml(toolId, data, view);
    else if (section === 'subjects') html += cbldSubjectsHtml(toolId, data, view);
    else if (section === 'pathways') html += cbldPathwaysHtml(toolId, data, view);
    else html += cbldCoursesHtml(toolId, data, view);
    html += '</div></div>';
    return html;
}

function cbldSectionCount(data, section) {
    const catalog = data.catalog || {};
    if (section === 'courses') return cbldCourses(data).length;
    if (section === 'subjects') {
        return (((catalog.graduation_requirements || {}).credits_by_subject) || []).length;
    }
    if (section === 'pathways') return (catalog.program_groupings || []).length;
    return null;
}

function cbldStartHtml() {
    return '<div class="cbld-start">' +
        '<h4>No curriculum yet</h4>' +
        '<p>Start an empty one and fill it in, open a document you already have to keep working ' +
        'on it, or load the sample to see the shape of the thing.</p>' +
        '<div><button class="curr-btn" onclick="cbldStart(this)">Start an empty curriculum</button></div>' +
        '<div class="cbld-drop" ondragover="cbldDragOver(event, this)" ' +
        'ondragleave="this.classList.remove(\'dragover\')" ondrop="cbldDropFile(event, this)">' +
        'or drop a .json file here</div>' +
        '<textarea class="cbld-import" spellcheck="false" ' +
        'placeholder="…or paste a curriculum document here"></textarea>' +
        '<div><button class="curr-btn" onclick="cbldImport(this)">Open what is pasted</button></div>' +
        '</div>';
}

// ---- Small pieces of form ---------------------------------------------------

function cbldTextRow(label, path, value, opts) {
    const o = opts || {};
    return '<label class="cbld-row"><span class="cbld-label">' + escapeHtml(label) + '</span>' +
        '<input class="cbld-in' + (o.short ? ' short' : '') + '" type="' +
        (o.number ? 'number' : 'text') + '"' +
        (o.number ? ' step="' + (o.step || '0.5') + '"' : '') +
        (o.list ? ' list="' + escapeHtml(o.list) + '"' : '') +
        (o.placeholder ? ' placeholder="' + escapeHtml(o.placeholder) + '"' : '') +
        ' value="' + cbldVal(value) + '"' +
        ' oninput="cbldSetPath(this, \'' + cbldArg(path) + '\'' + (o.number ? ', true' : '') + ')">' +
        '</label>' + (o.note ? '<div class="cbld-note">' + escapeHtml(o.note) + '</div>' : '');
}

function cbldAreaRow(label, path, value, placeholder) {
    return '<label class="cbld-row"><span class="cbld-label">' + escapeHtml(label) + '</span>' +
        '<textarea class="cbld-in" spellcheck="false" placeholder="' + escapeHtml(placeholder || '') +
        '" oninput="cbldSetPath(this, \'' + cbldArg(path) + '\')">' + cbldVal(value) + '</textarea>' +
        '</label>';
}

function cbldBoolRow(label, path, on, title) {
    return '<label class="cbld-check-lbl"' + (title ? ' title="' + escapeHtml(title) + '"' : '') + '>' +
        '<input type="checkbox"' + (on ? ' checked' : '') +
        ' onchange="cbldSetBool(this, \'' + cbldArg(path) + '\')">' + escapeHtml(label) + '</label>';
}

// A list of plain strings — notes, grade requirements, things a school prints as
// sentences. One row each, with its own way out.
function cbldStringList(label, path, values, adder, placeholder) {
    const list = Array.isArray(values) ? values : [];
    let html = '<div class="cbld-row"><span class="cbld-label">' + escapeHtml(label) + '</span>' +
        '<div style="flex:1 1 auto;min-width:0">';
    list.forEach(function(value, i) {
        html += '<div class="cbld-mrow" style="flex-wrap:nowrap">' +
            '<input class="cbld-in" value="' + cbldVal(value) + '"' +
            (placeholder ? ' placeholder="' + escapeHtml(placeholder) + '"' : '') +
            ' oninput="cbldSetPath(this, \'' + cbldArg(path + '.' + i) + '\')">' +
            '<button class="cbld-x" title="Remove" onclick="cbldDropAt(this, \'' +
            cbldArg(path) + '\', ' + i + ')">×</button></div>';
    });
    html += '<button class="cbld-add" onclick="' + adder + '">+ ' + escapeHtml(label.toLowerCase()) +
        '</button></div></div>';
    return html;
}

// What a typed title found, or did not. The suggestions are offered as a question:
// pressing one writes the catalog's own spelling, which is the only spelling that
// will ever resolve.
function cbldMatchHtml(index, byCode, title, path) {
    const name = (title || '').trim();
    if (!name) return '<span class="cbld-hint">Name a course as the catalog spells it.</span>';
    const code = currResolveTitle(index, name);
    if (code) {
        const course = byCode[code] || {};
        return '<span class="cbld-hit">\u2713 ' + escapeHtml(code + ' ' + (course.title || '')) + '</span>';
    }
    let html = '<span class="cbld-miss">\u2717 no course by that name</span>';
    cdocSuggest(index, name, 3).forEach(function(g) {
        const course = byCode[g.codes[0]] || {};
        const guess = course.title || g.key;
        html += '<button class="cbld-guess" onclick="cbldPickTitle(this, \'' + cbldArg(path) +
            '\', \'' + cbldArg(guess) + '\')">' + escapeHtml(guess) + '</button>';
    });
    return html;
}

function cbldMatchRow(value, path, index, byCode) {
    const list = path.replace(/\.\d+$/, '');
    const at = Number(path.split('.').pop());
    return '<div class="cbld-mrow" data-path="' + escapeHtml(path) + '">' +
        '<input class="cbld-in" value="' + cbldVal(value) + '" placeholder="Course title" ' +
        'oninput="cbldSetPath(this, \'' + cbldArg(path) + '\')">' +
        '<button class="cbld-x" title="Remove" onclick="cbldDropAt(this, \'' + cbldArg(list) +
        '\', ' + at + ')">\u00d7</button>' +
        '<div class="cbld-hint">' + cbldMatchHtml(index, byCode, value, path) + '</div>' +
        '</div>';
}

// ---- Document ---------------------------------------------------------------

// Top-level keys this form does not edit. They are listed rather than hidden, so
// it is plain that opening a real catalog here does not quietly shorten it.
const CBLD_KNOWN_KEYS = ['courses', 'school', 'document', 'guide', 'planner',
    'graduation_requirements', 'program_groupings'];

function cbldDocumentHtml(toolId, data, view) {
    const catalog = data.catalog;
    const meta = cbldMetaKey(catalog);
    const school = catalog.school || {};
    const info = catalog[meta] || {};
    let html = '<div class="cbld-scroll">';
    html += cbldTextRow('School', 'school.name', school.name, { placeholder: 'Westhaven High School' });
    html += cbldTextRow('District', 'school.district', school.district, { placeholder: 'optional' });
    html += cbldTextRow('Title', meta + '.title', info.title,
        { placeholder: 'Course Selection Guide' });
    html += cbldTextRow('Academic year', meta + '.academic_year', info.academic_year,
        { placeholder: '2026-2027', note: 'The title and year head the picture the explorer saves.' });

    const extra = Object.keys(catalog).filter(function(k) {
        return CBLD_KNOWN_KEYS.indexOf(k) === -1;
    });
    html += '<div class="cbld-block"><div class="cbld-block-head">Also in this document</div>';
    html += extra.length
        ? '<div class="cbld-note" style="padding-left:0">Carried through untouched, and written ' +
          'back out unchanged: <b>' + extra.map(escapeHtml).join('</b>, <b>') + '</b>.</div>'
        : '<div class="cbld-note" style="padding-left:0">Nothing beyond what this builder edits.</div>';
    html += '</div></div>';
    return html;
}

// ---- Planner ----------------------------------------------------------------

function cbldPlannerHtml(toolId, data, view) {
    const catalog = data.catalog;
    const stated = catalog.planner || null;
    const planner = currPlanner(view);
    let html = '<div class="cbld-scroll">';

    html += '<div class="cbld-note" style="padding-left:0">' +
        (stated ? 'This document states its own shape. ' : 'This document states no shape, so it is ' +
            'read off the courses — the years they are open to, and the distinct ways they say ' +
            'they are offered. ') +
        'As it stands the plan runs ' + planner.levels.length + ' ' +
        (planner.levels.length === 1 ? 'year' : 'years') + ', ' +
        escapeHtml(currLevelLabel(planner, planner.levels[0])) + ' to ' +
        escapeHtml(currLevelLabel(planner, planner.levels[planner.levels.length - 1])) +
        (planner.terms.length
            ? ', divided into ' + planner.terms.map(function(t) {
                return escapeHtml(t.label) + (t.optional ? ' (after the year)' : '');
              }).join(', ')
            : ', with no terms — every course covers a whole year') + '.</div>';

    if (!stated) {
        html += '<div><button class="cbld-add" onclick="cbldStatePlanner(this)">' +
            'Write that shape into the document</button></div>';
    }

    const levels = (stated && Array.isArray(stated.levels)) ? stated.levels : null;
    html += '<label class="cbld-row"><span class="cbld-label">Years</span>' +
        '<input class="cbld-in" value="' + cbldVal(levels ? levels.join(', ') : '') +
        '" placeholder="' + escapeHtml(planner.levels.join(', ')) +
        '" oninput="cbldSetLevels(this)"></label>' +
        '<div class="cbld-note">The rows of the grid — 9, 10, 11, 12 for a school guide, ' +
        '1, 2, 3, 4 for a college one. Left empty, the years the courses name.</div>';
    html += cbldTextRow('Year named', 'planner.level_label', (stated || {}).level_label,
        { placeholder: 'Grade {n}', note: '{n} stands for the number.' });

    html += '<div class="cbld-block"><div class="cbld-block-head">Terms</div>';
    const terms = (stated && Array.isArray(stated.terms)) ? stated.terms : [];
    if (!terms.length) {
        html += '<div class="cbld-note" style="padding-left:0">None stated. The columns are ' +
            'whatever distinct things the courses say under "offered".</div>';
    }
    terms.forEach(function(term, i) {
        const label = typeof term === 'string' ? term : (term.label || term.id || '');
        const optional = typeof term === 'object' && term !== null
            ? term.optional === true : CURR_OPTIONAL_TERM.test(label);
        html += '<div class="cbld-mrow" style="flex-wrap:nowrap">' +
            '<input class="cbld-in" value="' + cbldVal(label) + '" placeholder="Semester 1" ' +
            'oninput="cbldSetTerm(this, ' + i + ')">' +
            '<label class="cbld-check-lbl" title="A summer or intersession term, which belongs ' +
            'to the year it follows rather than dividing it">' +
            '<input type="checkbox"' + (optional ? ' checked' : '') +
            ' onchange="cbldSetTermOptional(this, ' + i + ')">after the year</label>' +
            '<button class="cbld-x" title="Remove" onclick="cbldDropAt(this, \'planner.terms\', ' +
            i + ')">×</button></div>';
    });
    html += '<button class="cbld-add" onclick="cbldAddTerm(this)">+ term</button>';
    html += '</div></div>';
    return html;
}

// ---- Subjects ---------------------------------------------------------------

function cbldSubjectsHtml(toolId, data, view) {
    const grad = data.catalog.graduation_requirements || {};
    const reqs = Array.isArray(grad.credits_by_subject) ? grad.credits_by_subject : [];
    const courses = currCourses(view);
    let html = '<div class="cbld-scroll">';

    if (!reqs.length) {
        html += '<div class="cbld-note" style="padding-left:0">Nothing to plan against yet. ' +
            'The explorer counts credits against the subjects listed here; with none, the panel ' +
            'under its grid stays empty.</div>';
    }

    reqs.forEach(function(req, i) {
        const path = 'graduation_requirements.credits_by_subject.' + i;
        html += '<div class="cbld-card"><div class="cbld-card-head">' +
            '<input class="cbld-in" value="' + cbldVal(req.subject) + '" placeholder="English" ' +
            'oninput="cbldSetPath(this, \'' + path + '.subject\')">' +
            '<input class="cbld-in short" type="number" step="0.5" value="' +
            cbldVal(req.credits_required) + '" placeholder="credits" ' +
            'oninput="cbldSetPath(this, \'' + path + '.credits_required\', true)">' +
            '<button class="cbld-x" title="Remove" onclick="cbldDropAt(this, ' +
            '\'graduation_requirements.credits_by_subject\', ' + i + ')">×</button></div>';
        html += cbldCoverHtml(view, req, i);
        html += cbldTextRow('Note', path + '.notes', req.notes, { placeholder: 'optional' });
        html += '</div>';
    });
    html += '<button class="cbld-add" onclick="cbldAddRequirement(this)">+ subject</button>';

    // The departments the catalog actually has, so a requirement can be added by
    // the name that will match rather than by the name you would have typed.
    const byDept = {};
    courses.forEach(function(course) {
        const name = course.department || 'Courses';
        byDept[name] = (byDept[name] || 0) + 1;
    });
    const names = Object.keys(byDept).sort();
    if (names.length) {
        html += '<div class="cbld-block"><div class="cbld-block-head">Departments in this catalog</div>' +
            '<div class="cbld-checks">';
        names.forEach(function(name) {
            const already = reqs.some(function(r) {
                return currNormTitle(r.subject) === currNormTitle(name);
            });
            html += '<button class="cbld-add"' + (already ? ' disabled style="opacity:.45"' : '') +
                ' onclick="cbldAddRequirement(this, \'' + cbldArg(name) + '\')">' +
                (already ? '✓ ' : '+ ') + escapeHtml(name) + ' <span style="opacity:.6">' +
                byDept[name] + '</span></button>';
        });
        html += '</div></div>';
    }

    html += '<div class="cbld-block"><div class="cbld-block-head">Other requirements</div>' +
        '<div class="cbld-note" style="padding-left:0">Conditions that are not credits — service ' +
        'hours, a test to pass. Listed under the totals as they are written.</div>';
    html += cbldStringList('Requirements', 'graduation_requirements.other_requirements',
        grad.other_requirements, 'cbldAddString(this, \'graduation_requirements.other_requirements\')',
        '30 hours of community service');
    html += '</div></div>';
    return html;
}

// ---- Pathways ---------------------------------------------------------------

function cbldPathwaysHtml(toolId, data, view) {
    const programs = Array.isArray(data.catalog.program_groupings) ? data.catalog.program_groupings : [];
    const index = currTitleIndex(view);
    const byCode = currByCode(view);
    let html = '<div class="cbld-scroll">';
    if (!programs.length) {
        html += '<div class="cbld-note" style="padding-left:0">Optional. A diploma or a career ' +
            'pathway that asks for particular courses rather than for credits — an AICE diploma, ' +
            'an academy sequence.</div>';
    }
    programs.forEach(function(program, pi) {
        const base = 'program_groupings.' + pi;
        html += '<div class="cbld-card"><div class="cbld-card-head">' +
            '<input class="cbld-in" value="' + cbldVal(program.name) + '" placeholder="Pathway name" ' +
            'oninput="cbldSetPath(this, \'' + base + '.name\')">' +
            '<button class="cbld-x" title="Remove this pathway" onclick="cbldDropAt(this, ' +
            '\'program_groupings\', ' + pi + ')">×</button></div>';
        (program.groups || []).forEach(function(group, gi) {
            const gbase = base + '.groups.' + gi;
            html += '<div class="cbld-block"><div class="cbld-card-head">' +
                '<input class="cbld-in" value="' + cbldVal(group.name) + '" placeholder="Group name" ' +
                'oninput="cbldSetPath(this, \'' + gbase + '.name\')">' +
                '<input class="cbld-in short" type="number" step="1" value="' +
                cbldVal(group.min_courses) + '" placeholder="how many" title="How many of the ' +
                'group are needed. Left empty, the row counts what is taken of what is offered ' +
                'and draws no bar." oninput="cbldSetPath(this, \'' + gbase + '.min_courses\', true)">' +
                '<button class="cbld-x" title="Remove this group" onclick="cbldDropAt(this, \'' +
                gbase.replace(/\.\d+$/, '') + '\', ' + gi + ')">×</button></div>';
            html += '<div class="cbld-checks">' +
                cbldBoolRow('every course in it is required', gbase + '.required_course',
                    group.required_course === true) + '</div>';
            (group.courses || []).forEach(function(title, ci) {
                html += cbldMatchRow(title, gbase + '.courses.' + ci, index, byCode);
            });
            html += '<button class="cbld-add" onclick="cbldAddString(this, \'' + gbase +
                '.courses\')">+ course</button></div>';
        });
        html += '<button class="cbld-add" onclick="cbldAddGroup(this, ' + pi + ')">+ group</button>';
        html += '</div>';
    });
    html += '<button class="cbld-add" onclick="cbldAddPathway(this)">+ pathway</button>';
    html += '</div>';
    return html;
}

// ---- Courses ----------------------------------------------------------------

function cbldLevelRange(levels) {
    const list = (levels || []).filter(function(n) { return typeof n === 'number' && isFinite(n); })
        .sort(function(a, b) { return a - b; });
    if (!list.length) return 'any year';
    if (list.length === 1) return String(list[0]);
    const contiguous = list.every(function(n, i) { return i === 0 || n === list[i - 1] + 1; });
    return contiguous ? list[0] + '–' + list[list.length - 1] : list.join(', ');
}

function cbldRowHtml(view, i, selected) {
    const course = (view.catalog.courses || [])[i] || {};
    return '<div class="cbld-crow' + (selected ? ' on' : '') + '" data-i="' + i +
        '" onclick="cbldSelect(this, ' + i + ')">' +
        '<span class="c-code">' + escapeHtml(course.course_code || '—') + '</span>' +
        '<span class="c-title">' + escapeHtml(course.title || 'Untitled') + '</span>' +
        '<span class="c-meta">' + escapeHtml(cbldLevelRange(course.grade_levels)) + ' · ' +
        currFormatCredits(course.credits || 0) + '</span></div>';
}

function cbldCoursesHtml(toolId, data, view) {
    let html = '<div class="cbld-list-bar">' +
        '<button class="curr-btn" onclick="cbldAddCourse(this)">+ Add course</button>' +
        '<input class="cbld-in" value="' + cbldVal(data.ui.search) +
        '" placeholder="Search the catalog" oninput="cbldSetSearch(this)">' +
        '</div>';
    html += cbldListHtml(data, view);
    const i = data.ui.selected;
    html += (typeof i === 'number' && cbldCourses(data)[i])
        ? cbldFormHtml(toolId, data, view, i)
        : '<div class="cbld-form"><div class="cbld-none">Pick a course to edit it.</div></div>';
    return html;
}

// Grouped the way the explorer groups, so what you see building the catalog is
// what a reader of it will see.
function cbldListHtml(data, view) {
    const courses = cbldCourses(data);
    const shown = view.catalog.courses || [];
    const q = (data.ui.search || '').toLowerCase().trim();
    const order = [];
    const groups = {};
    let matches = 0;
    courses.forEach(function(course, i) {
        const v = shown[i] || {};
        if (q) {
            const hay = ((v.course_code || '') + ' ' + (v.title || '') + ' ' +
                (v.department || '') + ' ' + (v.subject_area || '')).toLowerCase();
            if (hay.indexOf(q) === -1) return;
        }
        matches++;
        const dept = v.department || 'Courses';
        if (!groups[dept]) { groups[dept] = []; order.push(dept); }
        groups[dept].push(i);
    });
    order.sort();

    let html = '<div class="cbld-list">';
    if (!courses.length) {
        html += '<div class="cbld-none">No courses yet. Add one, and it becomes the first row ' +
            'of the catalog.</div>';
    } else if (!matches) {
        html += '<div class="cbld-none">Nothing matches \u201c' + escapeHtml(data.ui.search) +
            '\u201d.</div>';
    } else {
        order.forEach(function(dept) {
            html += '<div class="cbld-group-head">' + escapeHtml(dept) + ' \u00b7 ' +
                groups[dept].length + '</div>';
            groups[dept].forEach(function(i) {
                html += cbldRowHtml(view, i, data.ui.selected === i);
            });
        });
    }
    return html + '</div>';
}

function cbldFormHtml(toolId, data, view, i) {
    const course = cbldCourses(data)[i];
    const v = (view.catalog.courses || [])[i] || {};
    const path = 'courses.' + i;
    const courses = currCourses(view);
    const planner = currPlanner(view);
    const termId = 'cbld-terms-' + toolId;
    const levelId = 'cbld-levels-' + toolId;
    const deptId = 'cbld-depts-' + toolId;

    let html = '<div class="cbld-form">';
    html += '<div class="cbld-form-head"><b>' + escapeHtml(v.title || 'Untitled') + '</b>' +
        '<button class="curr-btn" onclick="cbldDuplicate(this, ' + i + ')" ' +
        'title="A copy of this course, to edit into the next one in the sequence">Duplicate</button>' +
        '<button class="curr-btn" onclick="cbldDeleteCourse(this, ' + i + ')">Delete</button></div>';

    html += cbldDatalist(deptId, currUniqueValues(courses, 'department'));
    html += cbldDatalist(levelId, currUniqueValues(courses, 'level'));
    html += cbldDatalist(termId, currUniqueValues(courses, 'semester_offered'));

    html += cbldTextRow('Code', path + '.course_code', course.course_code, { short: true });
    html += cbldClashHtml(data, i);
    html += cbldTextRow('Title', path + '.title', course.title,
        { note: 'What prerequisites and pathway groups name this course by.' });
    html += cbldTextRow('Department', path + '.department', course.department,
        { list: deptId, placeholder: 'as the guide prints it' });
    html += cbldTextRow('Grouped as', path + '.department_canonical', course.department_canonical,
        { list: deptId, placeholder: 'optional',
          note: 'A tidied department name, preferred for grouping and for matching a subject requirement.' });
    html += cbldTextRow('Subject area', path + '.subject_area', course.subject_area,
        { placeholder: 'optional — a finer grouping, and a second name a requirement may match' });
    html += cbldTextRow('Level', path + '.level', course.level, { list: levelId, placeholder: 'Standard' });
    html += cbldTextRow('Credits', path + '.credits', course.credits, { number: true, short: true });

    const levels = planner.levels.slice();
    (course.grade_levels || []).forEach(function(n) {
        if (levels.indexOf(n) === -1) levels.push(n);
    });
    levels.sort(function(a, b) { return a - b; });
    html += '<div class="cbld-row"><span class="cbld-label">Open to</span><div class="cbld-checks">';
    levels.forEach(function(level) {
        html += '<label class="cbld-check-lbl"><input type="checkbox"' +
            ((course.grade_levels || []).indexOf(level) !== -1 ? ' checked' : '') +
            ' onchange="cbldToggleLevel(this, ' + i + ', ' + level + ')">' +
            escapeHtml(currLevelLabel(planner, level)) + '</label>';
    });
    html += '</div></div>';
    html += '<div class="cbld-note">None ticked means open to every year.</div>';

    html += cbldTextRow('Offered', path + '.semester_offered', course.semester_offered,
        { list: termId, placeholder: 'any term',
          note: 'In the document’s own words. “Full Year” spans the year, “One Semester” may sit ' +
                'in any column, “Summer Only” sits after it.' });

    html += '<div class="cbld-row"><span class="cbld-label">Counts as</span><div class="cbld-checks">' +
        cbldBoolRow('an elective', path + '.is_elective', course.is_elective === true,
            'Also counts towards a requirement whose name reads like electives') +
        cbldBoolRow('required to graduate', path + '.required_for_graduation',
            course.required_for_graduation === true,
            'Listed as missing until it is planned or ticked off') +
        '</div></div>';

    html += cbldFlagsHtml(courses, course, path);
    html += cbldPrereqHtml(data, view, i);

    html += cbldAreaRow('Description', path + '.description', course.description,
        'What the guide says about it. Searched, and shown with the course.');
    html += cbldStringList('Notes', path + '.notes', course.notes,
        'cbldAddString(this, \'' + path + '.notes\')', 'Fee required');

    html += cbldTextRow('HS credits', path + '.high_school_credits', course.high_school_credits,
        { number: true, short: true,
          note: 'Only for a course taken at one school for credit at another — a middle school ' +
                'course earning high school credit. Kept apart from the credit it counts for here.' });
    html += '</div>';
    return html;
}

function cbldDatalist(id, values) {
    return '<datalist id="' + escapeHtml(id) + '">' + (values || []).map(function(v) {
        return '<option value="' + cbldVal(v) + '"></option>';
    }).join('') + '</datalist>';
}

// Flags are a document's own vocabulary, so the ones offered are the ones this
// document already uses — plus room to coin another.
function cbldFlagsHtml(courses, course, path) {
    const keys = currFlagsInUse(courses).slice();
    Object.keys(course.flags || {}).forEach(function(key) {
        if (keys.indexOf(key) === -1) keys.push(key);
    });
    let html = '<div class="cbld-row"><span class="cbld-label">Flags</span><div class="cbld-checks">';
    keys.forEach(function(key) {
        html += cbldBoolRow(currFlagLabel(key), path + '.flags.' + key,
            (course.flags || {})[key] === true);
    });
    html += '</div></div>';
    html += '<div class="cbld-row"><span class="cbld-label"></span>' +
        '<input class="cbld-in" placeholder="another flag, e.g. audition_required" ' +
        'onkeydown="if (event.key === \'Enter\') cbldAddFlag(this, \'' + cbldArg(path) + '\')">' +
        '<button class="cbld-add" onclick="cbldAddFlag(this.previousElementSibling, \'' +
        cbldArg(path) + '\')">add</button></div>';
    return html;
}

function cbldPrereqHtml(data, view, i) {
    const course = cbldCourses(data)[i];
    const prereq = course.prerequisites || {};
    const path = 'courses.' + i + '.prerequisites';
    const index = currTitleIndex(view);
    const byCode = currByCode(view);
    const names = Array.isArray(prereq.courses) ? prereq.courses : [];

    let html = '<div class="cbld-block"><div class="cbld-block-head">Prerequisites</div>';
    html += cbldTextRow('As printed', path + '.raw', prereq.raw,
        { placeholder: 'Algebra I with a C or better',
          note: 'The line as the guide prints it. Quoted back in the explorer’s messages.' });
    html += '<div class="cbld-row"><span class="cbld-label">Courses</span>' +
        '<div style="flex:1 1 auto;min-width:0">';
    names.forEach(function(name, n) {
        html += cbldMatchRow(name, path + '.courses.' + n, index, byCode);
    });
    html += '<button class="cbld-add" onclick="cbldAddString(this, \'' + path +
        '.courses\')">+ prerequisite</button></div></div>';

    if (names.length > 1) {
        html += '<div class="cbld-row"><span class="cbld-label"></span><div class="cbld-checks">' +
            cbldBoolRow('any one of them will do', path + '.choice', prereq.choice === true,
                'Tick this only where the guide says “or”. Left unticked, all of them are required.') +
            '</div></div>';
        html += cbldChoiceHtml(data, i);
    }
    html += cbldTextRow('Minimum GPA', path + '.min_gpa', prereq.min_gpa,
        { number: true, short: true, step: '0.05',
          note: 'Carried as a note — no plan can verify it.' });
    html += cbldStringList('Grades needed', path + '.grade_requirements', prereq.grade_requirements,
        'cbldAddString(this, \'' + path + '.grade_requirements\')', 'C or better in Algebra I');
    html += '</div>';
    return html;
}

// ---- The tally --------------------------------------------------------------
// Run by the doctor's own checks, on the same reading of the document the explorer
// would make. Not a second opinion — the same one, while there is still someone at
// the keyboard to act on it.

function cbldCheckHtml(toolId, data) {
    const view = cbldView(toolId, data.catalog);
    const result = cdocCheck(view.catalog);
    const open = data.ui.checkOpen === true;
    const tally = function(n, cls, word) {
        return '<span class="cdoc-tally ' + cls + '"><b>' + n + '</b> ' +
            word + (n === 1 ? '' : 's') + '</span>';
    };
    let html = '<div class="cbld-check' + (open ? ' open' : '') + '">' +
        '<div class="cbld-check-head" onclick="cbldToggleCheck(this)">' +
        '<span class="cbld-caret">' + (open ? '▾' : '▸') + '</span>' +
        tally(result.errors, 'err', 'error') +
        tally(result.warnings, 'warn', 'warning') +
        '<span class="cdoc-tally note">' + result.courses +
        (result.courses === 1 ? ' course' : ' courses') + '</span>' +
        (result.courses && !result.errors && !result.warnings
            ? '<span class="cdoc-clean">Nothing to fix.</span>' : '') +
        '</div>';
    if (open) html += '<div class="cbld-check-body">' + cbldFindingsHtml(data, result) + '</div>';
    return html + '</div>';
}

function cbldFindingsHtml(data, result) {
    if (!result.courses) {
        return '<div class="cbld-none">Nothing to check until there is a course.</div>';
    }
    const open = data.ui.open || [];
    let html = '';
    CDOC_KINDS.forEach(function(spec) {
        const mine = result.findings.filter(function(f) { return f.kind === spec.kind; });
        if (!mine.length) return;
        const showing = open.indexOf(spec.kind) !== -1;
        html += '<div class="cdoc-group">' +
            '<div class="cdoc-group-head" onclick="cbldToggleGroup(this, \'' + spec.kind + '\')">' +
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
                    return '<div class="cdoc-item cbld-goto" onclick="cbldGoTo(this, \'' +
                        cbldArg(f.path) + '\')" title="Go to it">' + escapeHtml(f.message) +
                        f.detail.map(function(d) {
                            return '<div class="cdoc-detail">' + escapeHtml(d) + '</div>';
                        }).join('') + '</div>';
                }).join('');
            }
        }
        html += '</div>';
    });
    return html;
}

function cbldToggleCheck(el) {
    const widget = cbldGetWidget(el);
    const toolId = currGetToolId(el);
    const data = cbldGetData(toolId);
    data.ui.checkOpen = !data.ui.checkOpen;
    cbldSaveUiSoon(toolId, data);
    cbldRender(widget);
}

function cbldToggleGroup(el, kind) {
    const widget = cbldGetWidget(el);
    const toolId = currGetToolId(el);
    const data = cbldGetData(toolId);
    data.ui.open = data.ui.open || [];
    const at = data.ui.open.indexOf(kind);
    if (at === -1) data.ui.open.push(kind); else data.ui.open.splice(at, 1);
    cbldSaveUiSoon(toolId, data);
    cbldRender(widget);
}

// A finding names where it is, in the document's own terms. This is how you get
// there: the path decides the section, and the index decides the course.
function cbldGoTo(el, path) {
    const widget = cbldGetWidget(el);
    const toolId = currGetToolId(el);
    const data = cbldGetData(toolId);
    const bits = String(path).split('/').filter(Boolean);
    if (bits[0] === 'courses') {
        data.ui.section = 'courses';
        const i = parseInt(bits[1], 10);
        if (isFinite(i) && cbldCourses(data)[i]) data.ui.selected = i;
    } else if (bits[0] === 'graduation_requirements') {
        data.ui.section = 'subjects';
    } else if (bits[0] === 'program_groupings') {
        data.ui.section = 'pathways';
    } else if (bits[0] === 'planner') {
        data.ui.section = 'planner';
    }
    cbldSaveUiSoon(toolId, data);
    cbldRender(widget);
}

// ---- The document it produces ------------------------------------------------

function cbldJson(catalog) {
    return JSON.stringify(catalog, null, 2);
}

function cbldOutHtml(data) {
    if (!data.catalog) {
        return '<div class="cbld-empty">Nothing written yet.<br>' +
            'Start a curriculum on the left and it appears here as you build it.</div>';
    }
    const text = cbldJson(data.catalog);
    const n = cbldCourses(data).length;
    const kb = Math.max(1, Math.round(text.length / 1024));
    const long = text.length > CBLD_PREVIEW;
    return '<div class="cbld-out-bar">' +
        '<span class="cbld-size">' + n + (n === 1 ? ' course' : ' courses') + ' · ' + kb + ' KB' +
        (long ? ' · shown in part' : '') + '</span>' +
        '<button class="curr-btn" onclick="cbldCopyJson(this)" title="The whole document">Copy</button>' +
        '<button class="curr-btn" onclick="cbldDownload(this)" title="Save it as a .json file">Save</button>' +
        '</div><pre class="cbld-json">' +
        escapeHtml(long ? text.slice(0, CBLD_PREVIEW) : text) +
        (long ? '\n\n…' + (text.length - CBLD_PREVIEW) + ' more characters. Copy and Save write ' +
            'the whole document.' : '') +
        '</pre>';
}

function cbldCopyJson(btn) {
    const toolId = currGetToolId(btn);
    const data = cbldGetData(toolId);
    if (!data.catalog) return;
    const widget = cbldGetWidget(btn);
    navigator.clipboard.writeText(cbldJson(data.catalog)).then(function() {
        cbldSetStatus(widget, 'ok', 'The whole document is on the clipboard.');
    }, function() {
        cbldSetStatus(widget, 'err', 'The clipboard refused it. Use Save instead.');
    });
}

function cbldFileName(catalog) {
    const meta = catalog[cbldMetaKey(catalog)] || {};
    const name = (catalog.school || {}).name || meta.title || 'curriculum';
    const year = meta.academic_year ? '-' + meta.academic_year : '';
    return (name + year).toLowerCase().replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '').slice(0, 80) + '.json';
}

function cbldDownload(btn) {
    const toolId = currGetToolId(btn);
    const data = cbldGetData(toolId);
    if (!data.catalog) return;
    const blob = new Blob([cbldJson(data.catalog)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = cbldFileName(data.catalog);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
    cbldSetStatus(cbldGetWidget(btn), 'ok', 'Saved as ' + link.download + '.');
}

// ---- Editing ------------------------------------------------------------------

function cbldSaveUiSoon(toolId, data) {
    // What is on screen, not what is in the document: no reason to rebuild the
    // reading copy for it.
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].builder = data;
    clearTimeout(cbldSaveTimer);
    cbldSaveTimer = setTimeout(function() {
        try { saveToolCustomizations(toolCustomizations); } catch (e) { /* reported on the next write */ }
    }, 400);
}

function cbldEdit(el) {
    const widget = cbldGetWidget(el);
    const toolId = currGetToolId(el);
    if (!widget || !toolId) return null;
    const data = cbldGetData(toolId);
    if (!data.catalog) return null;
    return { widget: widget, toolId: toolId, data: data };
}

function cbldSetPath(el, path, asNumber) {
    const cx = cbldEdit(el);
    if (!cx) return;
    const raw = el.value.trim();
    cbldSetIn(cx.data.catalog, path, asNumber ? (raw === '' ? '' : parseFloat(raw)) : raw);
    cbldSaveSoon(cx.toolId, cx.data);
    cbldRefreshSoon(cx.widget, cx.toolId);
}

function cbldSetBool(el, path) {
    const cx = cbldEdit(el);
    if (!cx) return;
    cbldSetIn(cx.data.catalog, path, el.checked ? true : '');
    cbldSaveSoon(cx.toolId, cx.data);
    cbldRefreshSoon(cx.widget, cx.toolId);
}

function cbldPickTitle(el, path, title) {
    const cx = cbldEdit(el);
    if (!cx) return;
    cbldSetIn(cx.data.catalog, path, title);
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
}

function cbldDropAt(el, path, i) {
    const cx = cbldEdit(el);
    if (!cx) return;
    const list = cbldGetIn(cx.data.catalog, path);
    if (!Array.isArray(list)) return;
    list.splice(i, 1);
    if (!list.length) cbldSetIn(cx.data.catalog, path, '');
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
}

function cbldAddString(el, path) {
    const cx = cbldEdit(el);
    if (!cx) return;
    const list = cbldGetIn(cx.data.catalog, path);
    if (Array.isArray(list)) list.push('');
    else cbldSetIn(cx.data.catalog, path, ['']);
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
}

function cbldSetSection(el, section) {
    const widget = cbldGetWidget(el);
    const toolId = currGetToolId(el);
    const data = cbldGetData(toolId);
    data.ui.section = section;
    cbldSaveUiSoon(toolId, data);
    cbldRender(widget);
}

// The search box is the one input a re-render must never take the caret out of, so
// only the list below it is rebuilt.
function cbldSetSearch(el) {
    const widget = cbldGetWidget(el);
    const toolId = currGetToolId(el);
    const data = cbldGetData(toolId);
    data.ui.search = el.value;
    cbldSaveUiSoon(toolId, data);
    const list = widget.querySelector('.cbld-list');
    if (list) list.outerHTML = cbldListHtml(data, cbldView(toolId, data.catalog));
}

function cbldSelect(el, i) {
    const widget = cbldGetWidget(el);
    const toolId = currGetToolId(el);
    const data = cbldGetData(toolId);
    data.ui.selected = data.ui.selected === i ? null : i;
    cbldSaveUiSoon(toolId, data);
    cbldRender(widget);
}

// A code nobody has used yet, in the shape this catalog uses codes.
function cbldNextCode(catalog) {
    let top = 0;
    let numeric = false;
    (catalog.courses || []).forEach(function(course) {
        const code = String(course.course_code || '');
        if (!/^\d+$/.test(code)) return;
        numeric = true;
        top = Math.max(top, parseInt(code, 10));
    });
    if (!numeric) {
        let n = 1;
        const used = {};
        (catalog.courses || []).forEach(function(c) { used[String(c.course_code || '')] = true; });
        while (used['NEW' + n]) n++;
        return 'NEW' + n;
    }
    return String(top + 1);
}

function cbldAddCourse(btn) {
    const cx = cbldEdit(btn);
    if (!cx) return;
    if (!Array.isArray(cx.data.catalog.courses)) cx.data.catalog.courses = [];
    cx.data.catalog.courses.push({
        course_code: cbldNextCode(cx.data.catalog),
        title: '',
        department: ''
    });
    cx.data.ui.selected = cx.data.catalog.courses.length - 1;
    cx.data.ui.section = 'courses';
    cx.data.ui.search = '';
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
    const field = cx.widget.querySelector('.cbld-form .cbld-in');
    if (field) field.focus();
}

// Most of a catalog is a sequence: English 1, 2, 3, 4 differ by a word and a year.
// Typing one and copying it three times is the difference between an afternoon and
// a few minutes.
function cbldDuplicate(btn, i) {
    const cx = cbldEdit(btn);
    if (!cx) return;
    const source = cbldCourses(cx.data)[i];
    if (!source) return;
    const copy = JSON.parse(JSON.stringify(source));
    copy.course_code = cbldNextCode(cx.data.catalog);
    copy.title = (source.title || 'Untitled') + ' (copy)';
    cx.data.catalog.courses.splice(i + 1, 0, copy);
    cx.data.ui.selected = i + 1;
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
}

function cbldDeleteCourse(btn, i) {
    const cx = cbldEdit(btn);
    if (!cx) return;
    const course = cbldCourses(cx.data)[i];
    if (!course) return;
    if (cbldNeedsConfirm(btn, 'del:' + i, 'Deleting “' + (course.title || 'this course') +
        '” cannot be undone, and anything naming it as a prerequisite stops resolving. ' +
        'Press Delete again to go ahead.')) return;
    cx.data.catalog.courses.splice(i, 1);
    cx.data.ui.selected = null;
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
    cbldSetStatus(cx.widget, 'ok', 'Deleted “' + (course.title || 'Untitled') + '”.');
}

function cbldToggleLevel(el, i, level) {
    const cx = cbldEdit(el);
    if (!cx) return;
    const course = cbldCourses(cx.data)[i];
    if (!course) return;
    const list = Array.isArray(course.grade_levels) ? course.grade_levels : [];
    const at = list.indexOf(level);
    if (at === -1) list.push(level); else list.splice(at, 1);
    list.sort(function(a, b) { return a - b; });
    if (list.length) course.grade_levels = list;
    else delete course.grade_levels;
    cbldSaveSoon(cx.toolId, cx.data);
    cbldRefreshSoon(cx.widget, cx.toolId);
}

function cbldAddFlag(input, path) {
    const cx = cbldEdit(input);
    if (!cx) return;
    const key = (input.value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    if (!key) return;
    cbldSetIn(cx.data.catalog, path + '.flags.' + key, true);
    input.value = '';
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
}

// ---- Planner ------------------------------------------------------------------

function cbldSetLevels(el) {
    const cx = cbldEdit(el);
    if (!cx) return;
    const levels = el.value.split(/[^0-9]+/).filter(Boolean).map(Number)
        .filter(function(n) { return isFinite(n); });
    if (levels.length) cbldSetIn(cx.data.catalog, 'planner.levels', levels);
    else cbldSetIn(cx.data.catalog, 'planner.levels', '');
    cbldSaveSoon(cx.toolId, cx.data);
    cbldRefreshSoon(cx.widget, cx.toolId);
}

// The shape read off the courses, written down as the document's own claim. Useful
// the moment a catalog has a year with no course in it — nothing can imply a year
// nothing is offered in, so it has to be stated.
function cbldStatePlanner(btn) {
    const cx = cbldEdit(btn);
    if (!cx) return;
    const planner = currPlanner(cbldView(cx.toolId, cx.data.catalog));
    const stated = { levels: planner.levels.slice() };
    if (planner.terms.length) {
        stated.terms = planner.terms.map(function(term) {
            return term.optional ? { id: term.id, label: term.label, optional: true } : term.label;
        });
    }
    const existing = cx.data.catalog.planner || {};
    cx.data.catalog.planner = Object.assign({}, existing, stated);
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
}

function cbldTerms(catalog) {
    const planner = catalog.planner || (catalog.planner = {});
    if (!Array.isArray(planner.terms)) planner.terms = [];
    return planner.terms;
}

function cbldSetTerm(el, i) {
    const cx = cbldEdit(el);
    if (!cx) return;
    const terms = cbldTerms(cx.data.catalog);
    const term = terms[i];
    if (term && typeof term === 'object') term.label = el.value;
    else terms[i] = el.value;
    cbldSaveSoon(cx.toolId, cx.data);
    cbldRefreshSoon(cx.widget, cx.toolId);
}

function cbldSetTermOptional(el, i) {
    const cx = cbldEdit(el);
    if (!cx) return;
    const terms = cbldTerms(cx.data.catalog);
    const term = terms[i];
    const label = typeof term === 'string' ? term : ((term || {}).label || '');
    // Written as a plain string only where the plain string already reads the way it
    // is being set — otherwise the document has to say so outright.
    if (el.checked) {
        terms[i] = { id: currTermSlug(label), label: label, optional: true };
    } else if (CURR_OPTIONAL_TERM.test(label)) {
        terms[i] = { id: currTermSlug(label), label: label, optional: false };
    } else {
        terms[i] = label;
    }
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
}

function cbldAddTerm(btn) {
    const cx = cbldEdit(btn);
    if (!cx) return;
    const terms = cbldTerms(cx.data.catalog);
    terms.push('Term ' + (terms.length + 1));
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
}

// ---- Requirements and pathways -------------------------------------------------

function cbldAddRequirement(btn, subject) {
    const cx = cbldEdit(btn);
    if (!cx) return;
    const grad = cx.data.catalog.graduation_requirements ||
        (cx.data.catalog.graduation_requirements = {});
    if (!Array.isArray(grad.credits_by_subject)) grad.credits_by_subject = [];
    if (subject && grad.credits_by_subject.some(function(r) {
        return currNormTitle(r.subject) === currNormTitle(subject);
    })) return;
    grad.credits_by_subject.push({ subject: subject || '', credits_required: 1 });
    cx.data.ui.section = 'subjects';
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
}

function cbldAddPathway(btn) {
    const cx = cbldEdit(btn);
    if (!cx) return;
    if (!Array.isArray(cx.data.catalog.program_groupings)) cx.data.catalog.program_groupings = [];
    cx.data.catalog.program_groupings.push({ name: '', groups: [{ name: '', courses: [''] }] });
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
}

function cbldAddGroup(btn, pi) {
    const cx = cbldEdit(btn);
    if (!cx) return;
    const program = (cx.data.catalog.program_groupings || [])[pi];
    if (!program) return;
    if (!Array.isArray(program.groups)) program.groups = [];
    program.groups.push({ name: '', courses: [''] });
    cbldSaveData(cx.toolId, cx.data);
    cbldRender(cx.widget);
}

// ---- Getting a document in and out ---------------------------------------------

// currParse normalizes what it reads, which is what the explorer wants and the
// opposite of what this tool wants: the model has to be the file as written, so
// that opening one and saving it again returns it unchanged. The parse is run for
// its complaints, and the document is taken from a second, untouched read.
function cbldReadText(text) {
    const parsed = currParse(text);
    if (!parsed.ok) return parsed;
    try {
        return { ok: true, doc: JSON.parse(text) };
    } catch (e) {
        return { ok: false, errors: ['That is not valid JSON: ' + e.message] };
    }
}

function cbldOpenDoc(widget, toolId, doc, note, sourceUrl) {
    const data = cbldGetData(toolId);
    data.catalog = doc;
    data.sourceUrl = sourceUrl || null;
    data.ui.selected = null;
    data.ui.search = '';
    data.ui.section = 'courses';
    cbldSaveData(toolId, data);
    const result = cdocCheck(cbldView(toolId, doc).catalog);
    cbldSetStatus(widget, result.errors ? 'err' : 'ok', note ||
        ((doc.courses || []).length + ' courses opened — ' + result.errors + ' errors, ' +
         result.warnings + ' warnings to work through.'));
    if (typeof setToolMode === 'function') setToolMode(toolId, 'edit');
    cbldRender(widget);
}

function cbldWouldReplace(btn, data, what) {
    if (!data.catalog) return false;
    const n = cbldCourses(data).length;
    return cbldNeedsConfirm(btn, what, 'That would replace the curriculum you have' +
        (n ? ', and the ' + n + (n === 1 ? ' course' : ' courses') + ' in it' : '') +
        '. Save it first if you want to keep it. Press again to go ahead.');
}

function cbldStart(btn) {
    const widget = cbldGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    const data = cbldGetData(toolId);
    if (cbldWouldReplace(btn, data, 'new')) return;
    cbldOpenDoc(widget, toolId, cbldBlank(),
        'An empty curriculum. Fill in the Document and Planner sections, then add courses.');
}

function cbldLoadSample(btn) {
    const widget = cbldGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    const data = cbldGetData(toolId);
    if (cbldWouldReplace(btn, data, 'sample')) return;
    cbldOpenDoc(widget, toolId, JSON.parse(JSON.stringify(CURR_SAMPLE)),
        CURR_SAMPLE.courses.length + ' sample courses. Nothing here is any real school’s — ' +
        'edit them into your own, or start again empty.');
}

function cbldImport(btn) {
    const widget = cbldGetWidget(btn);
    const toolId = currGetToolId(btn);
    if (!widget || !toolId) return;
    const box = widget.querySelector('.cbld-import');
    const text = box ? box.value.trim() : '';
    if (!text) {
        cbldSetStatus(widget, 'err', 'Nothing pasted yet.');
        return;
    }
    const parsed = cbldReadText(text);
    if (!parsed.ok) {
        cbldSetStatus(widget, 'err', parsed.errors.join('\n') +
            (parsed.more ? '\n…and ' + parsed.more + ' more' : ''));
        return;
    }
    cbldOpenDoc(widget, toolId, parsed.doc);
}

function cbldHandleFile(input) {
    const widget = cbldGetWidget(input);
    const toolId = currGetToolId(input);
    if (input.files && input.files[0]) cbldReadFile(widget, toolId, input.files[0]);
    input.value = '';
}

function cbldDragOver(e, el) {
    e.preventDefault();
    el.classList.add('dragover');
}

function cbldDropFile(e, el) {
    e.preventDefault();
    el.classList.remove('dragover');
    const widget = cbldGetWidget(el);
    const toolId = currGetToolId(el);
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) cbldReadFile(widget, toolId, file);
}

function cbldReadFile(widget, toolId, file) {
    if (!widget || !toolId) return;
    const data = cbldGetData(toolId);
    if (data.catalog) {
        const n = cbldCourses(data).length;
        cbldSetStatus(widget, '', 'Opening ' + file.name + ' replaces the ' + n +
            (n === 1 ? ' course' : ' courses') + ' here.');
    }
    const reader = new FileReader();
    reader.onload = function() {
        const parsed = cbldReadText(String(reader.result));
        if (!parsed.ok) {
            cbldSetStatus(widget, 'err', 'That file cannot be read as a curriculum:\n' +
                parsed.errors.join('\n'));
            return;
        }
        cbldOpenDoc(widget, toolId, parsed.doc);
    };
    reader.onerror = function() { cbldSetStatus(widget, 'err', 'That file could not be read.'); };
    reader.readAsText(file);
}

// A link can name the document to open on:
//   #Board/tool/curriculum-builder?curriculum=https://example.org/guide.json
async function cbldApplyHashParams(toolId, params) {
    const url = params.curriculum || params.url || params.src;
    if (!url) return;
    const widget = cbldWidgetFor(toolId);
    if (!widget) return;
    const data = cbldGetData(toolId);
    if (data.catalog && data.sourceUrl === url) return;
    let text;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        text = await res.text();
    } catch (e) {
        cbldSetStatus(widget, 'err', 'That document could not be fetched: ' + e.message);
        return;
    }
    const parsed = cbldReadText(text);
    if (!parsed.ok) {
        cbldSetStatus(widget, 'err', 'That document cannot be read as a curriculum:\n' +
            parsed.errors.join('\n'));
        return;
    }
    cbldOpenDoc(widget, toolId, parsed.doc, null, url);
}

function cbldInit() {
    document.querySelectorAll('.cbld-widget').forEach(function(widget) {
        if (currGetToolId(widget)) cbldRender(widget);
    });
}

function cbldOnRender(toolId) {
    const widget = cbldWidgetFor(toolId);
    if (widget) cbldRender(widget);
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
        currUniqueValues, currFlagLabel, currFlagBadgesHtml, currFlagsInUse, currOptions, currCatalogView, currCountHtml, currCatalogHtml, currListHtml,
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
        currSchoolDefaults, currNormalizeSchool, currSchoolName, currDerivedSchoolName, currGetRecord, currSaveRecord,
        currSchoolAt, currCurrentSchool, currShowingCareer, currSchoolLevels, currSchoolsInOrder,
        currEarlierSchools, currTransferMatch, currGradeRangeLabel, currSchoolSummary, currSchoolsBarHtml, currPickSchool,
        currNextSchoolId, currAddSchool, currRemoveSchool, currMoveSchool, currWithSchool, currSetSchoolName,
        currSetSchoolYears, currSetSchoolGrades, currRefreshSchoolBar, currSchoolListHtml, currGoToSchool,
        currAcademicYear, currTransferCandidates, currTransfersHtml, currToggleTransfers, currToggleTransfer,
        currAddLoose, currAddLooseFrom, currSetLoose, currRemoveLoose, currLooseFor, currLooseTotal,
        currSchoolCredits, currCareerYearHtml, currCareerHtml, currRightWithTransfers,
        currGradingDefaults, currGrading, currScale, currScaleIsList, currGradePoints, currGradeLabel,
        currMarkSlots, currMarksFor, currCourseGrade, currLevelBonus, currGpaOf, currLevelCodes,
        currGradedCodes, currSchoolGpa, currFormatGpa, currGradeInput, currSetMark, currSetFinal,
        currClearFinal, currCourseMarksHtml, currGradesHtml, currGradingHtml, currSetGrading, currSetCustomGrade,
        currAddCustomGrade, currRemoveCustomGrade,
        currAutoPlace, currAutoPlaceCode, currSampleCourse, currInit, currOnRender,
        cdocGetWidget, cdocWidgetFor, cdocGetData, cdocSaveData, cdocSetStatus,
        cdocSuggest, cdocFinding, cdocKind, cdocCheck, cdocReportHtml, cdocRender,
        cdocToggleGroup, cdocBrief, cdocCopyBrief, cdocLoadDoc, cdocLoadSource,
        cdocDraftChanged, cdocHandleFile, cdocDragOver, cdocDropFile, cdocReadFile,
        cdocApplyHashParams, cdocInit, cdocOnRender,
        cbldGetWidget, cbldWidgetFor, cbldGetData, cbldSaveData, cbldHold, cbldSaveSoon, cbldSetStatus,
        cbldNeedsConfirm, cbldView, cbldBlank, cbldMetaKey, cbldCourses, cbldEmptyValue, cbldBlankNode,
        cbldSetIn, cbldGetIn, cbldArg, cbldVal, cbldRender, cbldRenderFor, cbldRefreshSoon, cbldRefresh,
        cbldRefreshMatches, cbldRefreshLive, cbldLiveHtml,
        cbldCoverHtml, cbldClashHtml, cbldChoiceHtml, cbldEditorHtml, cbldSectionCount, cbldStartHtml, cbldTextRow, cbldAreaRow,
        cbldBoolRow, cbldStringList, cbldMatchHtml, cbldMatchRow, cbldDocumentHtml, cbldPlannerHtml,
        cbldSubjectsHtml, cbldPathwaysHtml, cbldLevelRange, cbldRowHtml, cbldCoursesHtml, cbldListHtml,
        cbldFormHtml, cbldDatalist, cbldFlagsHtml, cbldPrereqHtml, cbldCheckHtml, cbldFindingsHtml,
        cbldToggleCheck, cbldToggleGroup, cbldGoTo, cbldJson, cbldOutHtml, cbldCopyJson, cbldFileName,
        cbldDownload, cbldSaveUiSoon, cbldEdit, cbldSetPath, cbldSetBool, cbldPickTitle, cbldDropAt,
        cbldAddString, cbldSetSection, cbldSetSearch, cbldSelect, cbldNextCode, cbldAddCourse,
        cbldDuplicate, cbldDeleteCourse, cbldToggleLevel, cbldAddFlag, cbldSetLevels, cbldStatePlanner,
        cbldTerms, cbldSetTerm, cbldSetTermOptional, cbldAddTerm, cbldAddRequirement, cbldAddPathway,
        cbldAddGroup, cbldReadText, cbldOpenDoc, cbldWouldReplace, cbldStart, cbldLoadSample, cbldImport,
        cbldHandleFile, cbldDragOver, cbldDropFile, cbldReadFile, cbldApplyHashParams, cbldInit,
        cbldOnRender];

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
        'window.CURR_FLAG_BADGES = ' + JSON.stringify(CURR_FLAG_BADGES) + ';\n' +
        // The rules carry regular expressions, so they are rebuilt rather than JSON'd.
        'window.CURR_REQUIREMENT_FLAGS = [' + CURR_REQUIREMENT_FLAGS.map(function(rule) {
            return '{flag:' + JSON.stringify(rule.flag) + ',subject:' + rule.subject.toString() + '}';
        }).join(',') + '];\n' +
        'window.CURR_REQUIRED_FIELDS = ' + JSON.stringify(CURR_REQUIRED_FIELDS) + ';\n' +
        'window.CURR_SAMPLE = ' + JSON.stringify(CURR_SAMPLE) + ';\n' +
        'window.CURR_VERSION = ' + JSON.stringify(CURR_VERSION) + ';\n' +
        'window.CURR_CAREER = ' + JSON.stringify(CURR_CAREER) + ';\n' +
        'window.CURR_RIGOUR = ' + CURR_RIGOUR.toString() + ';\n' +
        // The scales carry a function for the continuous ones, so they are rebuilt
        // rather than JSON'd.
        'window.CURR_SCALES = {' + Object.keys(CURR_SCALES).map(function(id) {
            const sc = CURR_SCALES[id];
            return JSON.stringify(id) + ':{' + Object.keys(sc).map(function(k) {
                return JSON.stringify(k) + ':' + (typeof sc[k] === 'function'
                    ? sc[k].toString() : JSON.stringify(sc[k]));
            }).join(',') + '}';
        }).join(',') + '};\n' +
        'window.CURR_LEVEL_BONUS = [' + CURR_LEVEL_BONUS.map(function(rule) {
            return '{re:' + rule.re.toString() + ',add:' + rule.add + '}';
        }).join(',') + '];\n' +
        'window.CURR_MAX_BYTES = ' + CURR_MAX_BYTES + ';\n' +
        'window.CURR_PRINT_SKIP = ' + JSON.stringify(CURR_PRINT_SKIP) + ';\n' +
        'window.CURR_CORS_PROXY = ' + JSON.stringify(CURR_CORS_PROXY) + ';\n' +
        'window.CURR_ARM_MS = ' + CURR_ARM_MS + '; window.currArmed = {};\n' +
        'window.CURR_NODE_W = ' + CURR_NODE_W + '; window.CURR_NODE_H = ' + CURR_NODE_H + ';\n' +
        'window.CURR_GAP_X = ' + CURR_GAP_X + '; window.CURR_GAP_Y = ' + CURR_GAP_Y + ';\n' +
        'window.currDragCode = null; window.currSaveTimer = null; window.currDraftTimer = null;\n' +
        'window.cdocDraftTimer = null;\n' +
        'window.CDOC_KINDS = ' + JSON.stringify(CDOC_KINDS) + ';\n' +
        'window.cbldSaveTimer = null; window.cbldRefreshTimer = null;\n' +
        'window.cbldRev = {}; window.cbldViews = {};\n' +
        'window.CBLD_SECTIONS = ' + JSON.stringify(CBLD_SECTIONS) + ';\n' +
        'window.CBLD_KNOWN_KEYS = ' + JSON.stringify(CBLD_KNOWN_KEYS) + ';\n' +
        'window.CBLD_PREVIEW = ' + CBLD_PREVIEW + ';\n' +
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
console.log('School Tools plugin loaded (3 tools) v' + CURR_VERSION);
