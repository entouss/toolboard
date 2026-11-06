// Finance Tools Toolbox Plugin
// Contains financial calculators and tools

// Inject CSS styles for finance tools
(function() {
    if (document.getElementById('finance-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'finance-tools-styles';
    style.textContent = `
/* Finance Calculator Widget Styles */
.calc-widget { position: relative; background: var(--bg-tertiary); padding: 15px; border-radius: 6px; }
.calc-reset { position: absolute; top: 2px; right: 8px; border: none; background: none; padding: 0; font-size: 11px; color: var(--text-muted);
    cursor: pointer; text-decoration: underline; }
.calc-reset:hover { color: var(--text-primary); }
.calc-reset[hidden] { display: none; }
.calc-widget input, .calc-widget select { width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 14px; background: var(--input-bg); color: var(--text-primary); }
.calc-widget label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
.calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
.calc-card { background: var(--bg-secondary); padding: 10px; border-radius: 4px; text-align: center; }
.calc-card-label { font-size: 12px; color: var(--text-muted); }
.calc-card-value { font-size: 18px; font-weight: 600; }
.calc-card-value.large { font-size: 20px; }
.calc-card-value.positive { color: #27ae60; }
.calc-card-value.negative { color: #c0392b; }
.calc-card-value.info { color: #2980b9; }
.calc-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--border-light); font-size: 12px; }
.calc-section-title { font-size: 12px; font-weight: 600; margin-bottom: 8px; color: var(--text-muted); }
.calc-highlight { background: var(--success-bg); padding: 10px; border-radius: 4px; margin-bottom: 15px; }
.calc-highlight-title { font-size: 12px; font-weight: 600; color: var(--success-text); margin-bottom: 5px; }
.calc-toggle { display: flex; gap: 0; border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; }
.calc-toggle label { flex: 1; margin: 0; }
.calc-toggle span { display: block; padding: 8px; text-align: center; cursor: pointer; font-size: 12px; background: var(--bg-secondary); color: var(--text-primary); }
.calc-toggle input:checked + span { background: #3498db; color: white; }
.calc-toggle input { display: none; }
.tax-source { margin-top: 10px; font-size: 11px; color: var(--text-muted); }
.tax-edit { border: none; background: none; padding: 0; font-size: 11px; color: #2980b9; cursor: pointer; text-decoration: underline; }
.tax-warn { margin-bottom: 10px; padding: 6px 8px; border-radius: 4px; font-size: 11px; color: #c0392b; background: var(--bg-secondary); }
.tb-head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }
.tb-head label { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 12px; color: var(--text-secondary); }
.tb-head select { width: auto; padding: 4px 6px; }
.tb-btn, .tb-add { border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); border-radius: 4px; font-size: 11px; padding: 4px 8px; cursor: pointer; }
.tb-btn:disabled { opacity: 0.5; cursor: default; }
.tb-note { font-size: 11px; color: var(--text-muted); margin-bottom: 10px; }
.tb-status { margin-bottom: 14px; }
.tb-status-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.tb-status-name { font-weight: 600; font-size: 13px; }
.tb-status-head label { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 11px; }
.tb-status-head input { width: 110px; padding: 4px 6px; font-size: 12px; }
.tb-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 4px; font-variant-numeric: tabular-nums; }
.tb-table th { text-align: left; font-weight: 600; font-size: 11px; color: var(--text-muted); padding: 2px 4px; }
.tb-table td { padding: 2px 4px; }
.tb-table input { padding: 4px 6px; font-size: 12px; }
.tb-table td.tb-to { color: var(--text-secondary); white-space: nowrap; }
.tb-x { border: none; background: none; color: var(--text-muted); cursor: pointer; font-size: 14px; }
.tb-x:hover:not(:disabled) { color: #c0392b; }
.tb-x:disabled { opacity: 0.3; cursor: default; }
.tb-problem { font-size: 11px; color: #c0392b; margin-top: 4px; }
.tb-tabs { display: flex; flex-wrap: wrap; gap: 2px; border-bottom: 1px solid var(--border-color); margin-bottom: 10px; }
.tb-tab { border: 1px solid transparent; border-bottom: none; background: none; color: var(--text-secondary); font-size: 12px; padding: 5px 9px; cursor: pointer; border-radius: 4px 4px 0 0; margin-bottom: -1px; }
.tb-tab:hover { color: var(--text-primary); }
.tb-tab-on { border-color: var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); font-weight: 600; }
.tb-intro { font-size: 11px; color: var(--text-muted); margin: 0 0 8px; }
.tb-subhead { font-weight: 600; font-size: 12px; margin: 12px 0 4px; }
.tb-panel > .tb-subhead:first-child { margin-top: 0; }
.tb-rules { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-bottom: 8px; }
.calc-widget .tb-rule { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 12px; color: var(--text-secondary); }
.tb-rule input { width: 100px; padding: 4px 6px; font-size: 12px; }
.tb-unit { color: var(--text-muted); }
.tb-grid tbody { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 2px 8px; }
.tb-grid thead { display: none; }
.tb-grid tr { display: flex; align-items: center; gap: 4px; }
.tb-grid td { flex: none; border: none; padding: 1px 0; }
.tb-grid input[data-k="age"] { width: 58px; }
.tb-grid input[data-k="divisor"] { width: 72px; }

/* Finance Planning */
.fp-widget { font-size: 12px; display: flex; flex-direction: column; flex: 1; min-height: 0; width: 100%; box-sizing: border-box; padding: 10px; }
.fp-widget .authoring-source { flex: 1 1 60%; min-width: 0; overflow: auto; }
.fp-widget .authoring-result { flex: 1 1 40%; min-width: 0; overflow: auto; }
.tool.authoring-split:not(.authoring-stacked) .fp-widget .authoring-source { padding-right: 10px; }
.tool.authoring-split:not(.authoring-stacked) .fp-widget .authoring-result { padding-left: 10px; }
.fp-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 8px; }
.fp-card { background: var(--bg-secondary); border-radius: 4px; padding: 8px 10px; }
.fp-card-label { font-size: 11px; color: var(--text-muted); }
.fp-card-value { font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums; }
.fp-card-sub { font-size: 10px; color: var(--text-muted); }
.fp-card-net .fp-card-value { color: #0072B2; }
.fp-neg { color: #c0392b; }
.fp-pos { color: #27ae60; }
.fp-muted { color: var(--text-muted); }
.fp-bar { display: flex; height: 10px; gap: 2px; margin: 4px 0; }
.fp-bar-seg { display: block; height: 100%; border-radius: 2px; min-width: 3px; }
.fp-legend { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 11px; color: var(--text-secondary); margin-bottom: 6px; }
.fp-legend-line { all: unset; cursor: pointer; }
.fp-legend-line:hover { text-decoration: underline; }
.fp-legend-line:focus-visible, .fp-chart .fp-line-name:focus-visible { outline: 2px solid var(--accent-color, #0072B2); outline-offset: 2px; }
.fp-legend-on { font-weight: 600; color: var(--text-primary); }
.fp-legend-off { opacity: 0.6; }
.fp-legend-all { padding: 0 6px; font-size: 11px; }
.fp-chart .fp-line-name { cursor: pointer; }
.fp-chart .fp-line-name:hover { text-decoration: underline; }
.fp-progress { display: flex; align-items: center; gap: 8px; margin: 4px 0 6px; font-size: 11px; color: var(--text-secondary); }
.fp-progress[hidden] { display: none; }
.fp-progress-track { flex: 1; max-width: 240px; height: 6px; border-radius: 3px; overflow: hidden; background: var(--bg-secondary); }
.fp-progress-fill { height: 100%; background: #0072B2; }
.fp-legend i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 4px; vertical-align: -1px; }
.fp-empty, .fp-view-empty { padding: 10px; margin: 8px 0; background: var(--bg-secondary); border-radius: 4px; color: var(--text-secondary); display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.tool:not(.authoring-render) .fp-view-empty { display: none; }
.fp-section { margin-top: 14px; }
.fp-section-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.fp-section-head h4 { margin: 0; font-size: 13px; flex: 1; }
.fp-section:first-of-type { margin-top: 0; }
.fp-top { display: flex; justify-content: flex-end; margin-bottom: 4px; }
.fp-fold { border: none; background: none; padding: 0; width: 16px; cursor: pointer; color: var(--text-secondary); font-size: 12px; }
.fp-fold:focus-visible { outline: 2px solid #3498db; border-radius: 2px; }
.fp-head-acts { display: flex; gap: 6px; }
/* Folded: the heading only. The body is not drawn at all, so nothing in it can be read
   off the screen, and nothing in it takes a tab stop. */
.fp-section.fp-folded > .fp-body { display: none; }
.fp-section.fp-folded .fp-head-acts { display: none; }
.fp-section.fp-folded .fp-section-head { margin-bottom: 0; opacity: 0.8; }
.fp-ahead-sub { color: var(--text-muted); font-size: 11px; margin-bottom: 4px; }
.fp-btn { border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); border-radius: 4px; font-size: 11px; padding: 3px 8px; cursor: pointer; }
.fp-table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.fp-table th { text-align: left; font-size: 10px; font-weight: 600; color: var(--text-muted); padding: 2px 3px; white-space: nowrap; }
.fp-table td { padding: 2px 3px; }
.calc-widget.fp-widget .fp-table input, .calc-widget.fp-widget .fp-table select { padding: 4px 5px; font-size: 12px; }
.fp-table input.fp-num { min-width: 70px; }
.calc-widget.fp-widget .fp-incomes input.fp-date { min-width: 104px; }
.calc-widget.fp-widget .fp-table input[data-f="name"] { min-width: 120px; }
.calc-widget.fp-widget .fp-table select[data-f="every"] { min-width: 84px; }
.calc-widget.fp-widget .fp-incomes input.fp-num { min-width: 64px; }
.calc-widget.fp-widget input.fp-date { min-width: 120px; }
.fp-acts { white-space: nowrap; text-align: right; }
.fp-name-cell { display: flex; align-items: center; gap: 2px; }
.fp-grip { flex: 0 0 16px; width: 16px; border: none; background: none; padding: 0; cursor: grab; color: var(--text-muted); font-size: 11px; }
.fp-grip:focus-visible { outline: 2px solid #3498db; border-radius: 2px; }
tr.fp-movable.fp-dragging { opacity: 0.4; }
.calc-widget.fp-widget input.fp-on { flex: 0 0 13px; width: 13px; height: 13px; margin: 0 3px 0 1px; padding: 0; cursor: pointer; }
tr.fp-line-off td { opacity: 0.55; }
tr.fp-line-off input[data-f="name"] { text-decoration: line-through; }
tr.fp-under-folded { display: none; }
tr.fp-sec-row td { padding-top: 8px; border-bottom: 1px solid var(--border-color); }
.fp-sec-head { display: flex; align-items: center; gap: 4px; }
.fp-sec-fold { border: none; background: none; padding: 0; width: 16px; cursor: pointer; color: var(--text-secondary); font-size: 11px; }
.calc-widget.fp-widget input.fp-sec-name { width: 220px; font-weight: 600; padding: 3px 5px; font-size: 12px; }
.fp-sec-total { flex: 1; text-align: right; color: var(--text-secondary); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
tr.fp-sec-row ~ tr.fp-movable:not(.fp-sec-row) .fp-name-cell { padding-left: 12px; }
tr.fp-movable.fp-drop-above td { box-shadow: inset 0 2px 0 #3498db; }
tr.fp-movable.fp-drop-below td { box-shadow: inset 0 -2px 0 #3498db; }
.fp-accounts select[data-f="kind"] { min-width: 110px; }
.fp-more, .fp-more-gap { flex: 0 0 16px; width: 16px; }
.fp-more { border: none; background: none; padding: 0; cursor: pointer; color: var(--text-secondary); font-size: 11px; }
.fp-derived { display: inline-block; padding: 4px 2px; color: var(--text-secondary); white-space: nowrap; cursor: help; }
tr.fp-detail td { padding: 4px 6px 10px 22px; background: var(--bg-secondary); }
tr.fp-acc.fp-open td { background: var(--bg-secondary); }
.fp-detail-fields, .fp-detail-sum { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; }
.fp-detail-sum { margin-top: 6px; color: var(--text-secondary); }
.calc-widget.fp-widget .fp-detail-fields label { display: inline-flex; align-items: center; gap: 4px; margin: 0; font-size: 11px; color: var(--text-secondary); }
.calc-widget.fp-widget .fp-detail-fields input, .calc-widget.fp-widget .fp-detail-fields select { width: 110px; padding: 3px 5px; font-size: 12px; }
.calc-widget.fp-widget .fp-detail-fields input.fp-small { width: 60px; }
.calc-widget.fp-widget .fp-detail-fields input.fp-date { width: 140px; }
.calc-widget.fp-widget .fp-tax label.fp-check select { width: auto; }
.fp-link { border: none; background: none; color: #2980b9; cursor: pointer; font-size: 12px; padding: 0 4px; }
.fp-x { border: none; background: none; color: var(--text-muted); cursor: pointer; font-size: 14px; }
.fp-x:hover { color: #c0392b; }
.fp-dup { border: none; background: none; color: var(--text-muted); cursor: pointer; padding: 0 3px; vertical-align: -1px; }
.fp-dup:hover { color: var(--text-primary); }
.calc-widget.fp-widget label.fp-check { display: inline-flex; align-items: center; gap: 4px; margin: 0; font-size: 11px; color: var(--text-secondary); white-space: nowrap; }
.calc-widget.fp-widget .fp-check input { width: auto; }
.fp-tax { display: flex; align-items: center; gap: 8px; margin-top: 6px; flex-wrap: wrap; }
.calc-widget.fp-widget .fp-tax select, .calc-widget.fp-widget .fp-into select { width: auto; padding: 3px 6px; font-size: 12px; }
.fp-payroll { margin-top: 4px; color: var(--text-secondary); }
.fp-draw-head { margin: 6px 0 2px; color: var(--text-secondary); font-size: 11px; }
.fp-table.fp-draw { width: auto; min-width: 360px; }
.fp-draw-n { color: var(--text-muted); margin: 0 4px 0 2px; }
.fp-retire-out { margin-top: 6px; }
.fp-retire-age { display: contents; }
.calc-widget.fp-widget .fp-assume select[data-k="from"] { width: auto; padding: 3px 5px; font-size: 12px; }
.fp-retire-age[hidden] { display: none; }
.fp-retire-max { margin-top: 4px; }
.fp-flow { display: flex; flex-wrap: wrap; gap: 4px 14px; font-variant-numeric: tabular-nums; }
.fp-into { margin-top: 6px; color: var(--text-secondary); }
.fp-note { color: var(--text-muted); font-size: 11px; }
.fp-assume { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; margin-bottom: 6px; }
.calc-widget.fp-widget .fp-assume label { display: inline-flex; align-items: center; gap: 4px; margin: 0; font-size: 11px; color: var(--text-secondary); }
.calc-widget.fp-widget .fp-assume input { width: 90px; padding: 3px 5px; font-size: 12px; }
.calc-widget.fp-widget .fp-assume input.fp-small { width: 58px; }
.calc-widget.fp-widget .fp-assume input[type="checkbox"] { width: auto; }
.fp-returns span { font-size: 11px; color: var(--text-muted); }
.fp-facts { display: flex; flex-wrap: wrap; gap: 4px 16px; margin-bottom: 6px; }
.fp-years-head { margin: 6px 0 4px; }
.fp-years-foot { margin: 4px 0 0; font-size: 12px; }
.fp-chart { width: 100%; height: auto; display: block; }
.fp-range { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; margin: 6px 0 4px; font-size: 12px; color: var(--text-secondary); }
.calc-widget .fp-range label { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 12px; color: var(--text-secondary); }
.calc-widget .fp-range select { width: auto; padding: 3px 6px; font-size: 12px; }
.fp-range .fp-btn:disabled { opacity: 0.5; cursor: default; }
.fp-chart text { font-size: 10px; fill: var(--text-muted); }
.fp-chart .fp-tick-age { font-size: 9px; opacity: 0.8; }
.fp-chart .fp-grid { stroke: var(--border-light); stroke-width: 1; }
.fp-chart .fp-zero { stroke: var(--text-muted); stroke-width: 1; }
.fp-chart .fp-line { fill: none; stroke-width: 2; stroke-linejoin: round; }
.fp-chart .fp-net { stroke: #0072B2; stroke-width: 2.5; }
.fp-chart .fp-assets { stroke: #009E73; }
.fp-chart .fp-liab { stroke: #D55E00; }
.fp-chart .fp-band { fill: #0072B2; opacity: 0.14; }
.fp-chart .fp-net-label { fill: #0072B2; font-weight: 600; }
.fp-chart .fp-assets-label { fill: #009E73; }
.fp-chart .fp-liab-label { fill: #D55E00; }
.fp-chart .fp-hit { fill: transparent; }
.fp-chart .fp-hit { cursor: pointer; }
.fp-chart .fp-hit:hover, .fp-chart .fp-hit:focus { fill: var(--text-muted); opacity: 0.08; outline: none; }
.fp-chart .fp-hit-on, .fp-chart .fp-hit-on:hover, .fp-chart .fp-hit-on:focus { fill: var(--text-muted); opacity: 0.18; }
.fp-year-row { cursor: pointer; }
.fp-year-row:hover td { background: var(--bg-secondary); }
.fp-year-on td { background: var(--bg-secondary); font-weight: 600; }
.fp-yd-hint { font-size: 11px; color: var(--text-muted); margin: 2px 0 6px; }
.fp-yd { border: 1px solid var(--border-color); border-radius: 6px; padding: 8px 10px; margin: 6px 0 10px; font-size: 12px; background: var(--bg-primary); }
.fp-yd-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; margin-bottom: 6px; }
.fp-yd-head h5 { margin: 0; font-size: 13px; }
.fp-yd-head h5:focus { outline: 2px solid var(--accent-color, #0072B2); outline-offset: 2px; }
.fp-yd-nav { margin-left: auto; display: inline-flex; gap: 4px; align-items: center; }
.fp-yd-spend { margin: 0 0 8px; font-weight: 600; }
.fp-yd-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 12px; }
@media (max-width: 720px) { .fp-yd-grid { grid-template-columns: minmax(0, 1fr); } }
.fp-yd-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
.fp-yd-table caption { text-align: left; font-weight: 600; padding: 2px 0 4px; }
.fp-yd-table th, .fp-yd-table td { padding: 2px 4px; border: none; border-bottom: 1px solid var(--border-light); font-weight: normal; text-align: left; }
.fp-yd-table td { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
.fp-yd-table thead th { color: var(--text-muted); font-size: 11px; text-align: right; }
.fp-yd-table thead th:first-child { text-align: left; }
.fp-yd-total th, .fp-yd-total td { font-weight: 600; border-bottom-color: var(--border-color); }
.fp-yd-scroll { overflow-x: auto; }
.fp-yd-block ul { margin: 2px 0 8px; padding-left: 18px; color: var(--text-secondary); }
.fp-yd-block li { margin: 1px 0; }
.fp-legend .fp-key-net { background: #0072B2; height: 3px; }
.fp-legend .fp-key-assets { background: #009E73; height: 2px; }
.fp-legend .fp-key-liab { background: #D55E00; height: 2px; }
.fp-legend .fp-key-band { background: #0072B2; opacity: 0.25; }
.fp-chart .fp-needed { stroke: var(--text-secondary); stroke-dasharray: 5 4; stroke-width: 2; }
.fp-chart .fp-have { stroke: #CC79A7; }
.fp-chart .fp-forever { stroke: #E69F00; stroke-dasharray: 1 4; stroke-linecap: round; stroke-width: 2.5; }
.fp-chart .fp-forever-label { fill: #E69F00; }
.fp-chart .fp-forever-dot { fill: #E69F00; stroke: var(--bg-tertiary); stroke-width: 2; }
.fp-legend .fp-key-forever { height: 0; border-top: 2px dotted #E69F00; background: none; }
.fp-chart .fp-needed-label { fill: var(--text-secondary); }
.fp-chart .fp-have-label { fill: #CC79A7; }
.fp-chart .fp-stop-dot { fill: var(--text-secondary); stroke: var(--bg-tertiary); stroke-width: 2; }
.fp-legend .fp-key-needed { height: 0; border-top: 2px dashed var(--text-secondary); background: none; }
.fp-legend .fp-key-have { background: #CC79A7; height: 2px; }
.fp-stale { opacity: 0.5; }
.fp-chart .fp-mark { cursor: pointer; }
.fp-chart .fp-mark:focus { outline: none; }
.fp-chart .fp-mark:focus .fp-mark-hit, .fp-chart .fp-mark:hover .fp-mark-hit { fill: var(--border-color); }
.fp-mark-hit { fill: transparent; }
.fp-mark-goal { fill: #B8860B; }
.fp-mark-retire { fill: #0072B2; }
.fp-mark-job, .fp-mark-paynew, .fp-mark-payend { fill: #7B4FA3; }
.fp-mark-ss, .fp-mark-debt { fill: #009E73; }
.fp-mark-medicare { fill: #0E8F8F; }
.fp-mark-target { fill: #E69F00; }
.fp-mark-rmd { fill: var(--text-secondary); }
.fp-mark-penalty, .fp-mark-out { fill: #c0392b; }
.fp-key-mark { width: 12px; height: 12px; margin-right: 4px; vertical-align: -2px; fill-rule: evenodd; }
.fp-goals-out { margin: 6px 0 0; padding-left: 18px; font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px; }
.fp-goals-out b { color: var(--text-primary); }
.fp-goal-working { opacity: 0.85; }
.fp-steps { list-style: none; padding: 0; margin: 4px 0 8px; display: flex; flex-direction: column; gap: 6px; }
.fp-step { display: flex; gap: 8px; align-items: flex-start; font-size: 12px; }
.fp-step-mark { flex: none; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; border: 1px solid var(--border-color); color: var(--text-secondary); }
.fp-step-done .fp-step-mark { background: #009E73; border-color: #009E73; color: #fff; }
.fp-step-part .fp-step-mark { border-color: #E69F00; color: #B07800; }
.fp-step-todo .fp-step-mark { border-color: #D55E00; color: #D55E00; }
.fp-step-text { color: var(--text-secondary); }
.fp-advice-h { margin: 10px 0 4px; font-size: 12px; }
.fp-split ul { margin: 4px 0; padding-left: 18px; font-size: 12px; }
.fp-mix, .fp-split { font-size: 12px; }
.fp-mix-bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; margin: 6px 0; gap: 2px; }
.fp-mix-stocks { background: #0072B2; }
.fp-mix-bonds { background: #E69F00; }
.fp-margin { margin-top: 4px; }
.fp-detail-fields.fp-into { flex-direction: column; align-items: flex-start; }
.calc-widget.fp-widget .fp-into-row select { width: auto; max-width: 240px; }
.fp-into-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; }
body.dark-mode .fp-card-net .fp-card-value, body.dark-mode .fp-chart .fp-net-label { color: #56B4E9; fill: #56B4E9; }
body.dark-mode .fp-chart .fp-net { stroke: #56B4E9; }
body.dark-mode .fp-chart .fp-band, body.dark-mode .fp-legend .fp-key-band, body.dark-mode .fp-legend .fp-key-net { fill: #56B4E9; background: #56B4E9; }
`;
    document.head.appendChild(style);
})();

// Define finance tool functions
const taxBrackets = {
    single: [
        {min: 0, max: 12400, rate: 0.10},
        {min: 12400, max: 50400, rate: 0.12},
        {min: 50400, max: 105700, rate: 0.22},
        {min: 105700, max: 201775, rate: 0.24},
        {min: 201775, max: 256225, rate: 0.32},
        {min: 256225, max: 640800, rate: 0.35},
        {min: 640800, max: Infinity, rate: 0.37}
    ],
    married: [
        {min: 0, max: 24800, rate: 0.10},
        {min: 24800, max: 100800, rate: 0.12},
        {min: 100800, max: 211400, rate: 0.22},
        {min: 211400, max: 403550, rate: 0.24},
        {min: 403550, max: 512450, rate: 0.32},
        {min: 512450, max: 788700, rate: 0.35},
        {min: 788700, max: Infinity, rate: 0.37}
    ]
};
const stdDeductions = {single: 16100, married: 32200};

// ---- Tax brackets, by year: one table for the whole app ---------------------------------
//
// The brackets and standard deductions live once, under an app-level key, so every
// board's Tax Calculator works from the same figures and the Tax Brackets tool edits
// them. Nothing saved — a new browser, an exported board — means the built-in year.
// Rates are kept in per cent, as they are typed; a bracket runs from its own amount
// to the next one's, so brackets cannot overlap or leave a gap.

const TAX_TABLE_KEY = 'toolboard_taxBrackets';
const TAX_STATUSES = { single: 'Single', married: 'Married Filing Jointly' };

/** The built-in figures: the brackets the calculator always had, as one year. */
function taxBuiltin() {
    const year = {};
    Object.keys(TAX_STATUSES).forEach(s => {
        year[s] = { deduction: stdDeductions[s], brackets: taxBrackets[s].map(b => ({ from: b.min, rate: Math.round(b.rate * 10000) / 100 })) };
    });
    return { '2026': Object.assign(year, taxRulesBuiltin()) };
}

function taxClone(x) { return JSON.parse(JSON.stringify(x)); }

/** The table as saved, or the built-in one. Anything unreadable is left out, not trusted. */
function taxTableLoad() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(TAX_TABLE_KEY) || 'null'); } catch (e) { saved = null; }
    const years = {};
    if (saved && saved.years && typeof saved.years === 'object') {
        Object.keys(saved.years).forEach(y => {
            if (!/^\d{4}$/.test(y) || !saved.years[y] || typeof saved.years[y] !== 'object') return;
            const year = {};
            Object.keys(TAX_STATUSES).forEach(s => {
                const st = saved.years[y][s];
                if (!st || !Array.isArray(st.brackets)) return;
                year[s] = { deduction: st.deduction, brackets: st.brackets.map(b => ({ from: b && b.from, rate: b && b.rate })) };
            });
            if (!Object.keys(year).length) return;
            // The other rules, in the built-in shape; a part saved before they were kept
            // is the built-in one.
            const builtin = taxRulesBuiltin();
            TAX_RULE_PARTS.forEach(k => { year[k] = taxMergeShape(builtin[k], saved.years[y][k]); });
            years[y] = year;
        });
    }
    return { years: Object.keys(years).length ? years : taxBuiltin() };
}

/** Saved, and everything that shows the brackets brought up to date — but the tool
 *  being typed into keeps its fields, and only its sums change. */
function taxTableSave(table, typing) {
    try { localStorage.setItem(TAX_TABLE_KEY, JSON.stringify(table)); } catch (e) { /* kept for this page only */ }
    taxTableChanged(typing);
}

function taxTableChanged(typing) {
    document.querySelectorAll('.tb-widget').forEach(w => { if (w === typing) tbRefreshDerived(w); else tbRender(w); });
    calculateTax();
    // Finance Planning works from the same rules.
    document.querySelectorAll('.fp-widget').forEach(w => { if (fpToolId(w)) fpRenderDerived(w); });
}

function taxYearsOf(table) {
    return Object.keys(table.years).sort((a, b) => Number(a) - Number(b));
}

/** The year a calculator left on its default uses: this year's, if there is one,
 *  otherwise the latest there is. */
function taxDefaultYear(table) {
    const years = taxYearsOf(table);
    const now = String(new Date().getFullYear());
    return years.includes(now) ? now : years[years.length - 1];
}

/** What is wrong with one status's figures, in words. */
function taxProblems(st) {
    const out = [];
    if (!st) return ['No figures.'];
    if (!(Number(st.deduction) >= 0) || st.deduction === '' || st.deduction === null) out.push('The standard deduction needs to be an amount.');
    const b = st.brackets || [];
    if (!b.length) out.push('There are no brackets.');
    b.forEach((x, i) => {
        const from = Number(x.from), rate = Number(x.rate);
        if (x.from === '' || x.from === null || !isFinite(from) || from < 0) out.push('Bracket ' + (i + 1) + ' needs a starting amount.');
        else if (i === 0 && from !== 0) out.push('The first bracket has to start at 0.');
        else if (i > 0 && isFinite(Number(b[i - 1].from)) && from <= Number(b[i - 1].from)) out.push('Bracket ' + (i + 1) + ' has to start above bracket ' + i + '.');
        if (x.rate === '' || x.rate === null || !isFinite(rate) || rate < 0 || rate > 100) out.push('Bracket ' + (i + 1) + ' needs a rate from 0 to 100%.');
    });
    return out;
}

/** One status's brackets as the calculator uses them: in order, the unusable left out,
 *  each running to where the next begins. */
function taxBracketsFor(st) {
    const rows = ((st && st.brackets) || [])
        .map(b => ({ from: Number(b.from), rate: Number(b.rate) }))
        .filter(b => b.from >= 0 && isFinite(b.from) && b.rate >= 0 && b.rate <= 100 && isFinite(b.rate))
        .sort((a, b) => a.from - b.from);
    return rows.map((b, i) => ({ min: b.from, max: i + 1 < rows.length ? rows[i + 1].from : Infinity, rate: b.rate / 100 }));
}

// ---- The rest of a year's rules -----------------------------------------------------
//
// Beside the brackets, each year keeps the other rules of law the Finance Planning tool
// works from: the capital-gains brackets, payroll tax, how much of Social Security is
// taxed, what may go into retirement accounts, the withdrawal rules and Social
// Security's ages and adjustments. Kept as typed, like the brackets; what the planner
// reads is cleaned up, anything unusable being the built-in figure.

const TAX_RULE_PARTS = ['capGains', 'payroll', 'ssTax', 'limits', 'withdraw', 'socialSecurity', 'medicare'];

/** The 2026 rules, from the IRS and SSA announcements for the year. */
function taxRulesBuiltin() {
    return {
        capGains: {
            single: [{ from: 0, rate: 0 }, { from: 49450, rate: 15 }, { from: 545500, rate: 20 }],
            married: [{ from: 0, rate: 0 }, { from: 98900, rate: 15 }, { from: 613700, rate: 20 }]
        },
        // Social Security tax up to the wage base, Medicare on all of it, and the surtax
        // above a household's threshold (fixed in law, not raised for inflation).
        payroll: { ssRate: 6.2, wageBase: 184500, medicare: 1.45, surtax: 0.9, surtaxSingle: 200000, surtaxMarried: 250000 },
        // Half the benefit plus the other income, against these: above `half`, up to 50%
        // of the benefit is taxed; above `most`, up to 85%. Fixed since 1993.
        ssTax: { single: { half: 25000, most: 34000 }, married: { half: 32000, most: 44000 } },
        // Roth IRA contributions phase out over these incomes (modified AGI), to none above `To`.
        limits: { k401: 24500, k401CatchUp: 8000, k401CatchUp6063: 11250, ira: 7500, iraCatchUp: 1100,
            rothSingleFrom: 153000, rothSingleTo: 168000, rothMarriedFrom: 242000, rothMarriedTo: 252000,
            // Everything into a 401(k) in a year, yours and the employer's; the pay a match is worked from.
            total415: 72000, compCap: 360000,
            // An HSA: by the health plan's cover, the employer's money counted, and more from 55.
            hsaSelf: 4400, hsaFamily: 8750, hsaCatchUp: 1000 },
        withdraw: {
            earlyYears: 59, earlyMonths: 6, penalty: 10,
            // A 401(k) left in the year of turning this age or later pays no penalty.
            sepAge: 55,
            // An HSA spent on other than medical costs: taxed, and before this age a penalty too.
            hsaAge: 65, hsaPenalty: 20,
            // Minimum withdrawals start at this age for those born in `from` or later.
            rmdStart: [{ from: 1951, age: 73 }, { from: 1960, age: 75 }],
            rmdTable: Object.keys(FP_RMD_FACTORS).map(a => ({ age: Number(a), divisor: FP_RMD_FACTORS[a] }))
        },
        socialSecurity: {
            // Full retirement age for those born in `from` or later (and the first row
            // for anyone born earlier).
            fra: [[1937, 65, 0], [1938, 65, 2], [1939, 65, 4], [1940, 65, 6], [1941, 65, 8], [1942, 65, 10], [1943, 66, 0],
                [1955, 66, 2], [1956, 66, 4], [1957, 66, 6], [1958, 66, 8], [1959, 66, 10], [1960, 67, 0]].map(r => ({ from: r[0], years: r[1], months: r[2] })),
            // Per cent a month: less for each month claimed early (the first `earlyMonths`,
            // then each before them), more for each month waited, from `earliest` to `latest`.
            earliest: 62, latest: 70, early: 5 / 9, earlyMonths: 36, earlyMore: 5 / 12, delayed: 2 / 3,
            // The benefit at full retirement age from average monthly earnings (the best
            // 35 years, each up to the wage base): pct1 of it up to bend1, pct2 up to
            // bend2, pct3 above.
            bend1: 1286, bend2: 7749, pct1: 90, pct2: 32, pct3: 15
        },
        // Medicare from `age`: Part B a month for each person, and the income-related
        // surcharges on Parts B and D (`b`, `d`) above each amount of income — modified AGI
        // from two years before.
        medicare: {
            age: 65, partB: 202.9,
            irmaa: {
                single: [[109000, 81.2, 14.5], [137000, 202.9, 37.5], [171000, 324.6, 60.4], [205000, 446.3, 83.3], [500000, 487, 91]].map(r => ({ from: r[0], b: r[1], d: r[2] })),
                married: [[218000, 81.2, 14.5], [274000, 202.9, 37.5], [342000, 324.6, 60.4], [410000, 446.3, 83.3], [750000, 487, 91]].map(r => ({ from: r[0], b: r[1], d: r[2] }))
            }
        }
    };
}

/** `saved` in the shape of `base`: what is missing or of the wrong kind is the base's. */
function taxMergeShape(base, saved) {
    if (Array.isArray(base)) return Array.isArray(saved) ? saved.filter(x => x && typeof x === 'object').map(x => Object.assign({}, x)) : taxClone(base);
    if (base && typeof base === 'object') {
        const from = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
        const out = {};
        Object.keys(base).forEach(k => { out[k] = taxMergeShape(base[k], from[k]); });
        return out;
    }
    return saved === undefined || (saved !== null && typeof saved === 'object') ? base : saved;
}

/** A typed amount, or null: empty, not a number, or outside `lo`..`hi`. */
function taxRuleNum(v, lo, hi) {
    const n = Number(v);
    if (v === '' || v === null || v === undefined || typeof v === 'boolean' || !isFinite(n) || n < lo || (hi !== undefined && n > hi)) return null;
    return n;
}

/** One year's rules as the planner uses them: numbers, every unusable one the built-in. */
function taxRulesOf(year) {
    const b = taxRulesBuiltin(), y = year || {};
    const pick = (part, key, lo, hi) => { const v = taxRuleNum(((y[part] || {})[key]), lo, hi); return v === null ? b[part][key] : v; };
    const rows = (list, keys) => (Array.isArray(list) ? list : []).map(r => {
        const out = {};
        for (const k of keys) { const v = taxRuleNum(r && r[k], 0); if (v === null) return null; out[k] = v; }
        return out;
    }).filter(Boolean);
    const out = { capGains: {}, ssTax: {} };
    Object.keys(TAX_STATUSES).forEach(s => {
        const cg = taxBracketsFor({ brackets: (y.capGains || {})[s] });
        out.capGains[s] = cg.length ? cg : taxBracketsFor({ brackets: b.capGains[s] });
        const st = (y.ssTax || {})[s] || {};
        const half = taxRuleNum(st.half, 0), most = taxRuleNum(st.most, 0);
        out.ssTax[s] = half !== null && most !== null && most >= half ? { half: half, most: most } : Object.assign({}, b.ssTax[s]);
    });
    out.payroll = {};
    Object.keys(b.payroll).forEach(k => { out.payroll[k] = pick('payroll', k, 0, /Rate$|^medicare$|^surtax$/.test(k) ? 100 : undefined); });
    out.limits = {};
    Object.keys(b.limits).forEach(k => { out.limits[k] = pick('limits', k, 0); });
    const w = y.withdraw || {};
    const early = taxRuleNum(w.earlyYears, 0, 120);
    const earlyM = taxRuleNum(w.earlyMonths, 0, 11);
    const start = rows(w.rmdStart, ['from', 'age']).sort((p, q) => p.from - q.from);
    const table = {};
    rows(w.rmdTable, ['age', 'divisor']).forEach(r => { if (r.divisor > 0) table[Math.round(r.age)] = r.divisor; });
    out.withdraw = {
        early: early === null ? b.withdraw.earlyYears * 12 + b.withdraw.earlyMonths : Math.round(early * 12 + (earlyM || 0)),
        penalty: pick('withdraw', 'penalty', 0, 100),
        sepAge: pick('withdraw', 'sepAge', 0, 120),
        hsaAge: pick('withdraw', 'hsaAge', 0, 120), hsaPenalty: pick('withdraw', 'hsaPenalty', 0, 100),
        rmdStart: start.length ? start : b.withdraw.rmdStart,
        rmdTable: Object.keys(table).length ? table : Object.assign({}, FP_RMD_FACTORS)
    };
    const ss = y.socialSecurity || {};
    const fra = rows(ss.fra, ['from', 'years', 'months']).sort((p, q) => p.from - q.from);
    out.socialSecurity = {
        fra: fra.length ? fra : b.socialSecurity.fra,
        early: pick('socialSecurity', 'early', 0, 100), earlyMonths: pick('socialSecurity', 'earlyMonths', 0),
        earlyMore: pick('socialSecurity', 'earlyMore', 0, 100), delayed: pick('socialSecurity', 'delayed', 0, 100),
        pct1: pick('socialSecurity', 'pct1', 0, 100), pct2: pick('socialSecurity', 'pct2', 0, 100), pct3: pick('socialSecurity', 'pct3', 0, 100)
    };
    const b1 = taxRuleNum(ss.bend1, 0), b2 = taxRuleNum(ss.bend2, 0);
    const okBends = b1 !== null && b2 !== null && b2 >= b1;
    out.socialSecurity.bend1 = okBends ? b1 : b.socialSecurity.bend1;
    out.socialSecurity.bend2 = okBends ? b2 : b.socialSecurity.bend2;
    const med = y.medicare || {};
    out.medicare = { age: pick('medicare', 'age', 0, 120), partB: pick('medicare', 'partB', 0), irmaa: {} };
    Object.keys(TAX_STATUSES).forEach(s => {
        const r = rows(((med.irmaa || {})[s]), ['from', 'b', 'd']).sort((p, q) => p.from - q.from);
        out.medicare.irmaa[s] = r.length ? r : b.medicare.irmaa[s];
    });
    const lo = taxRuleNum(ss.earliest, 0, 120), hi = taxRuleNum(ss.latest, 0, 120);
    const okAges = lo !== null && hi !== null && hi >= lo;
    out.socialSecurity.earliest = okAges ? lo : b.socialSecurity.earliest;
    out.socialSecurity.latest = okAges ? hi : b.socialSecurity.latest;
    return out;
}

// The planner looks the rules up many times a month of its projection, so the table is
// read once for each thing saved, and each year's rules worked out once.
let taxRulesCache = null;

/** A year's rules, cleaned up: `year` if there is one, otherwise this year's or the latest. */
function taxRulesFor(year) {
    let raw = null;
    try { raw = localStorage.getItem(TAX_TABLE_KEY); } catch (e) { raw = null; }
    if (!taxRulesCache || taxRulesCache.raw !== raw) taxRulesCache = { raw: raw, table: taxTableLoad(), rules: {} };
    const c = taxRulesCache;
    const y = year && c.table.years[year] ? String(year) : taxDefaultYear(c.table);
    return c.rules[y] || (c.rules[y] = Object.assign({ year: y }, taxRulesOf(c.table.years[y])));
}

// ---- The Tax Brackets tool ----------------------------------------------------------

function tbToolId(el) {
    const tool = el && el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function tbYearOf(widget, table) {
    const years = taxYearsOf(table);
    const toolId = tbToolId(widget);
    const picked = toolId && typeof toolCustomizations !== 'undefined' ? String((toolCustomizations[toolId] || {}).tbYear || '') : '';
    return years.includes(picked) ? picked : taxDefaultYear(table);
}

function tbMoney(n) {
    return '$' + Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function tbInit() {
    document.querySelectorAll('.tb-widget').forEach(tbRender);
}

function tbRender(widget) {
    const table = taxTableLoad();
    const years = taxYearsOf(table);
    const year = tbYearOf(widget, table);
    widget.dataset.year = year;
    const builtin = taxBuiltin();
    const attr = (v) => (v === null || v === undefined || (typeof v === 'number' && !isFinite(v))) ? '' : String(v);
    const status = (s) => {
        const st = table.years[year][s];
        if (!st) return '';
        const rows = st.brackets.map((b, i) =>
            '<tr><td><input type="number" class="tb-from" min="0" step="50" value="' + escapeHtml(attr(b.from)) + '" oninput="tbOnInput(this)" aria-label="Bracket ' + (i + 1) + ' starts at"' + (i === 0 ? ' title="The first bracket starts at 0"' : '') + '></td>' +
            '<td class="tb-to"></td>' +
            '<td><input type="number" class="tb-rate" min="0" max="100" step="0.1" value="' + escapeHtml(attr(b.rate)) + '" oninput="tbOnInput(this)" aria-label="Bracket ' + (i + 1) + ' rate, per cent"></td>' +
            '<td><button type="button" class="tb-x" onclick="tbRemoveBracket(this)" title="Remove this bracket"' + (st.brackets.length < 2 ? ' disabled' : '') + '>×</button></td></tr>').join('');
        return '<div class="tb-status" data-status="' + s + '">' +
            '<div class="tb-status-head"><span class="tb-status-name">' + TAX_STATUSES[s] + '</span>' +
                '<label>Standard deduction <input type="number" class="tb-ded" min="0" step="50" value="' + escapeHtml(attr(st.deduction)) + '" oninput="tbOnInput(this)"></label></div>' +
            '<table class="tb-table"><thead><tr><th>From</th><th>To</th><th>Rate %</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' +
            '<button type="button" class="tb-add" onclick="tbAddBracket(this)">+ Bracket</button>' +
            '<div class="tb-problem" role="status"></div></div>';
    };
    const tab = tbTabOf(widget);
    widget.dataset.tab = tab;
    widget.innerHTML =
        '<div class="tb-head"><label>Tax year <select class="tb-year" onchange="tbPickYear(this)">' +
            years.map(y => '<option value="' + y + '"' + (y === year ? ' selected' : '') + '>' + y + '</option>').join('') + '</select></label>' +
            '<button type="button" class="tb-btn" onclick="tbAddYear(this)" title="A new year, starting from a copy of the latest">+ Year</button>' +
            '<button type="button" class="tb-btn" onclick="tbDeleteYear(this)"' + (years.length < 2 ? ' disabled title="The last year cannot go"' : ' title="Delete this year’s brackets"') + '>Delete year</button>' +
            (builtin[year] ? '<button type="button" class="tb-btn tb-reset" onclick="tbResetYear(this)" title="Back to the built-in ' + year + ' figures">Reset year</button>' : '') +
        '</div>' +
        '<div class="tb-note">Shared by every board’s Tax Calculator and Finance Planning, on this device.</div>' +
        '<div class="tb-tabs" role="tablist">' + Object.keys(TB_TABS).map(k => '<button type="button" role="tab" class="tb-tab' + (k === tab ? ' tb-tab-on' : '') +
            '" data-tab="' + k + '" aria-selected="' + (k === tab) + '" onclick="tbPickTab(this)">' + TB_TABS[k] + '</button>').join('') + '</div>' +
        (tab === 'income' ? Object.keys(TAX_STATUSES).map(status).join('') : tbPanel(tab, table.years[year]));
    tbRefreshDerived(widget);
}

const TB_TABS = { income: 'Income tax', gains: 'Capital gains', payroll: 'Payroll', ss: 'Social Security', limits: 'Contributions', withdraw: 'Withdrawals', medicare: 'Medicare' };

function tbTabOf(widget) {
    const toolId = tbToolId(widget);
    const picked = toolId && typeof toolCustomizations !== 'undefined' ? String((toolCustomizations[toolId] || {}).tbTab || '') : '';
    return TB_TABS[picked] ? picked : 'income';
}

function tbPickTab(btn) {
    const widget = btn.closest('.tb-widget');
    const toolId = tbToolId(widget);
    if (toolId && typeof toolCustomizations !== 'undefined' && typeof saveToolCustomizations === 'function') {
        const next = Object.assign({}, toolCustomizations);
        next[toolId] = Object.assign({}, next[toolId] || {}, { tbTab: btn.dataset.tab });
        saveToolCustomizations(next);
    }
    tbRender(widget);
    const on = widget.querySelector('.tb-tab[data-tab="' + btn.dataset.tab + '"]');
    if (on) on.focus();
}

/** A value in a field: a rule kept as an exact fraction (5/9 of 1%) shows rounded. */
function tbShow(v) {
    if (v === null || v === undefined || (typeof v === 'number' && !isFinite(v))) return '';
    return escapeHtml(String(typeof v === 'number' ? Math.round(v * 10000) / 10000 : v));
}

function tbGetPath(obj, path) {
    return path.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj);
}

function tbSetPath(obj, path, value) {
    const keys = path.split('.');
    let o = obj;
    keys.slice(0, -1).forEach(k => { if (!o[k] || typeof o[k] !== 'object') o[k] = {}; o = o[k]; });
    o[keys[keys.length - 1]] = value;
}

/** One rule, as a labelled field. */
function tbField(rec, path, label, opts) {
    opts = opts || {};
    return '<label class="tb-rule"' + (opts.title ? ' title="' + escapeHtml(opts.title) + '"' : '') + '><span>' + label + '</span>' +
        '<input type="number" class="tb-field" data-path="' + path + '" min="0"' + (opts.step ? ' step="' + opts.step + '"' : '') +
        ' value="' + tbShow(tbGetPath(rec, path)) + '" oninput="tbFieldInput(this)" aria-label="' + escapeHtml(label) + '">' +
        (opts.unit ? '<span class="tb-unit">' + opts.unit + '</span>' : '') + '</label>';
}

/** Rows of a rule kept as a list — brackets, ages by birth year, divisors by age. */
function tbRows(rec, path, cols, opts) {
    opts = opts || {};
    const rows = tbGetPath(rec, path) || [];
    const head = cols.map(c => '<th>' + c.label + '</th>').join('') + '<th></th>';
    const body = rows.map((r, i) => '<tr>' + cols.map(c => c.to ? '<td class="tb-to"></td>' :
        '<td><input type="number" class="tb-cell" data-k="' + c.key + '" min="0"' + (c.step ? ' step="' + c.step + '"' : '') + ' value="' + tbShow(r[c.key]) +
            '" oninput="tbRowsInput(this)" aria-label="' + escapeHtml(c.label + ', row ' + (i + 1)) + '"></td>').join('') +
        '<td><button type="button" class="tb-x" onclick="tbRowsRemove(this)" title="Remove this row"' + (rows.length < 2 ? ' disabled' : '') + '>×</button></td></tr>').join('');
    return '<table class="tb-table' + (opts.cls ? ' ' + opts.cls : '') + '" data-path="' + path + '" data-cols="' + cols.filter(c => !c.to).map(c => c.key).join(',') + '"' +
        (opts.to ? ' data-to="1"' : '') + '><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table>' +
        '<button type="button" class="tb-add" onclick="tbRowsAdd(this)">+ ' + (opts.add || 'Row') + '</button>';
}

/** Everything but the income tax brackets: a tab of the year's other rules. */
function tbPanel(tab, rec) {
    const per = { unit: '%', step: '0.01' }, money = { step: '50' };
    const statuses = (fn) => Object.keys(TAX_STATUSES).map(s => '<div class="tb-status" data-status="' + s + '"><div class="tb-status-head"><span class="tb-status-name">' + TAX_STATUSES[s] + '</span></div>' + fn(s) + '</div>').join('');
    let body = '';
    if (tab === 'gains') {
        body = '<div class="tb-intro">Long-term gains and qualified dividends, taxed on top of ordinary income: a bracket is where the total taxable income reaches.</div>' +
            statuses(s => tbRows(rec, 'capGains.' + s, [{ key: 'from', label: 'From', step: 50 }, { to: true, label: 'To' }, { key: 'rate', label: 'Rate %', step: 0.1 }], { to: true, add: 'Bracket' }));
    } else if (tab === 'payroll') {
        body = '<div class="tb-intro">Taken from pay before it is paid. Social Security tax stops at the wage base, for each job; Medicare does not, and its surtax starts at the household’s threshold.</div>' +
            '<div class="tb-rules">' + tbField(rec, 'payroll.ssRate', 'Social Security tax', per) + tbField(rec, 'payroll.wageBase', 'up to wages of', money) +
            tbField(rec, 'payroll.medicare', 'Medicare tax', per) + tbField(rec, 'payroll.surtax', 'Medicare surtax', per) +
            tbField(rec, 'payroll.surtaxSingle', 'surtax above (single)', Object.assign({ title: 'Fixed in law, not raised for inflation' }, money)) +
            tbField(rec, 'payroll.surtaxMarried', 'surtax above (married)', Object.assign({ title: 'Fixed in law, not raised for inflation' }, money)) + '</div>';
    } else if (tab === 'ss') {
        body = '<div class="tb-subhead">How much of a benefit is taxed</div>' +
            '<div class="tb-intro">Half the benefit plus the other income: above the first amount, up to 50% of the benefit is taxed; above the second, up to 85%. Fixed in law, not raised for inflation.</div>' +
            statuses(s => '<div class="tb-rules">' + tbField(rec, 'ssTax.' + s + '.half', 'up to 50% above', money) + tbField(rec, 'ssTax.' + s + '.most', 'up to 85% above', money) + '</div>') +
            '<div class="tb-subhead">Claiming</div>' +
            '<div class="tb-rules">' + tbField(rec, 'socialSecurity.earliest', 'Earliest age', { step: 1 }) + tbField(rec, 'socialSecurity.latest', 'Rises until', { step: 1 }) +
            tbField(rec, 'socialSecurity.early', 'Less a month early', Object.assign({ title: 'For each of the first months claimed early' }, per)) +
            tbField(rec, 'socialSecurity.earlyMonths', 'for the first', { unit: 'months', step: 1 }) +
            tbField(rec, 'socialSecurity.earlyMore', 'then less a month', Object.assign({ title: 'For each month claimed earlier still' }, per)) +
            tbField(rec, 'socialSecurity.delayed', 'More a month waited', per) + '</div>' +
            '<div class="tb-subhead">The benefit, from earnings</div>' +
            '<div class="tb-intro">Average monthly earnings over the best 35 years, each year up to the wage base: this much of it up to the first amount, then up to the second, then above. Used to estimate a benefit when no statement amount is given.</div>' +
            '<div class="tb-rules">' + tbField(rec, 'socialSecurity.pct1', 'Of earnings up to', per) + tbField(rec, 'socialSecurity.bend1', '', money) +
            tbField(rec, 'socialSecurity.pct2', 'then', per) + tbField(rec, 'socialSecurity.bend2', 'up to', money) + tbField(rec, 'socialSecurity.pct3', 'and above it', per) + '</div>' +
            '<div class="tb-subhead">Full retirement age, by birth year</div>' +
            '<div class="tb-intro">For those born in that year or later; the first row also for anyone born before it.</div>' +
            tbRows(rec, 'socialSecurity.fra', [{ key: 'from', label: 'Born from', step: 1 }, { key: 'years', label: 'Years', step: 1 }, { key: 'months', label: 'Months', step: 1 }]);
    } else if (tab === 'limits') {
        body = '<div class="tb-intro">The most that may go in a year from your own pay; the employer’s match is on top. Catch-up amounts are for those 50 or older by the end of the year.</div>' +
            '<div class="tb-subhead">401(k), 403(b) and the like</div><div class="tb-rules">' + tbField(rec, 'limits.k401', 'Limit', money) +
            tbField(rec, 'limits.k401CatchUp', 'Catch-up, 50 and over', money) + tbField(rec, 'limits.k401CatchUp6063', 'Catch-up, ages 60 to 63', Object.assign({ title: 'In place of the other catch-up, the years turning 60, 61, 62 and 63' }, money)) + '</div>' +
            '<div class="tb-subhead">IRA</div><div class="tb-rules">' + tbField(rec, 'limits.ira', 'Limit', money) + tbField(rec, 'limits.iraCatchUp', 'Catch-up, 50 and over', money) + '</div>' +
            '<div class="tb-subhead">Everything into a 401(k)</div><div class="tb-rules">' + tbField(rec, 'limits.total415', 'Yours and the employer’s, at most', money) +
                tbField(rec, 'limits.compCap', 'A match worked from pay up to', money) + '</div>' +
            '<div class="tb-subhead">HSA</div><div class="tb-intro">With a high-deductible health plan; the employer’s money counts toward it.</div><div class="tb-rules">' +
                tbField(rec, 'limits.hsaSelf', 'Self-only cover', money) + tbField(rec, 'limits.hsaFamily', 'Family cover', money) + tbField(rec, 'limits.hsaCatchUp', 'Catch-up, 55 and over', money) + '</div>' +
            '<div class="tb-subhead">Roth IRA, by income</div>' +
            '<div class="tb-intro">Contributions to a Roth IRA shrink over this range of income (modified AGI), to nothing above it.</div>' +
            '<div class="tb-rules">' + tbField(rec, 'limits.rothSingleFrom', 'Single, from', money) + tbField(rec, 'limits.rothSingleTo', 'to', money) + '</div>' +
            '<div class="tb-rules">' + tbField(rec, 'limits.rothMarriedFrom', 'Married, from', money) + tbField(rec, 'limits.rothMarriedTo', 'to', money) + '</div>';
    } else if (tab === 'withdraw') {
        body = '<div class="tb-subhead">Early withdrawals</div><div class="tb-rules">' +
            tbField(rec, 'withdraw.earlyYears', 'Pre-tax money before age', { step: 1 }) + tbField(rec, 'withdraw.earlyMonths', 'and', { unit: 'months', step: 1 }) +
            tbField(rec, 'withdraw.penalty', 'may have a penalty of', per) +
            tbField(rec, 'withdraw.sepAge', 'except from a 401(k) left at', { step: 1, title: 'Leaving the job in the year of turning this age or later: no penalty on that 401(k). IRAs keep the early age.' }) + '</div>' +
            '<div class="tb-rules">' + tbField(rec, 'withdraw.hsaPenalty', 'An HSA spent on other than medical costs has a penalty of', per) + tbField(rec, 'withdraw.hsaAge', 'before age', { step: 1 }) + '</div>' +
            '<div class="tb-subhead">Minimum withdrawals start</div>' +
            '<div class="tb-intro">At this age for those born in that year or later; the first row also for anyone born before it.</div>' +
            tbRows(rec, 'withdraw.rmdStart', [{ key: 'from', label: 'Born from', step: 1 }, { key: 'age', label: 'Age', step: 1 }]) +
            '<div class="tb-subhead">What a pre-tax balance is divided by, by age</div>' +
            '<div class="tb-intro">The IRS Uniform Lifetime table: the balance at the end of last year over the divisor for the age reached this year.</div>' +
            tbRows(rec, 'withdraw.rmdTable', [{ key: 'age', label: 'Age', step: 1 }, { key: 'divisor', label: 'Divisor', step: 0.1 }], { cls: 'tb-grid', add: 'Age' });
    }
    if (tab === 'medicare') {
        body = '<div class="tb-rules">' + tbField(rec, 'medicare.age', 'Medicare from age', { step: 1 }) + tbField(rec, 'medicare.partB', 'Part B a month, each', { step: '0.1' }) + '</div>' +
            '<div class="tb-subhead">More for higher incomes</div>' +
            '<div class="tb-intro">Above each amount of income — modified AGI from two years before — Part B and Part D each cost this much more a month, for each person.</div>' +
            statuses(s => tbRows(rec, 'medicare.irmaa.' + s, [{ key: 'from', label: 'Income above', step: 1000 }, { key: 'b', label: 'Part B +', step: 0.1 }, { key: 'd', label: 'Part D +', step: 0.1 }], { add: 'Tier' }));
    }
    return '<div class="tb-panel" data-tab="' + tab + '">' + body + '<div class="tb-problem tb-rule-problem" role="status"></div></div>';
}

/** What is wrong with one tab of a year's rules, in words. */
function taxRuleProblems(rec, tab) {
    const out = [];
    const num = (v, lo, hi) => taxRuleNum(v, lo, hi) !== null;
    const need = (path, what, hi) => { if (!num(tbGetPath(rec, path), 0, hi)) out.push(what + (hi === 100 ? ' needs a rate from 0 to 100%.' : ' needs an amount.')); };
    const rowsOk = (path, keys, what) => {
        const rows = tbGetPath(rec, path) || [];
        if (!rows.length) out.push('There are no ' + what + '.');
        rows.forEach((r, i) => { if (keys.some(k => !num(r[k], 0))) out.push('Row ' + (i + 1) + ' of the ' + what + ' is not complete.'); });
        rows.forEach((r, i) => { if (i && num(r[keys[0]], 0) && num(rows[i - 1][keys[0]], 0) && Number(r[keys[0]]) <= Number(rows[i - 1][keys[0]])) out.push('Row ' + (i + 1) + ' of the ' + what + ' has to come after row ' + i + '.'); });
        return rows;
    };
    if (tab === 'medicare') {
        if (!num(tbGetPath(rec, 'medicare.age'), 0, 120)) out.push('The Medicare age needs to be an age.');
        need('medicare.partB', 'Part B');
        Object.keys(TAX_STATUSES).forEach(s => rowsOk('medicare.irmaa.' + s, ['from', 'b', 'd'], TAX_STATUSES[s].toLowerCase() + ' surcharge tiers'));
    }
    if (tab === 'gains') Object.keys(TAX_STATUSES).forEach(s => taxProblems({ deduction: 0, brackets: tbGetPath(rec, 'capGains.' + s) || [] })
        .forEach(m => out.push(TAX_STATUSES[s] + ': ' + m)));
    else if (tab === 'payroll') {
        need('payroll.ssRate', 'Social Security tax', 100); need('payroll.wageBase', 'The wage base'); need('payroll.medicare', 'Medicare tax', 100);
        need('payroll.surtax', 'The Medicare surtax', 100); need('payroll.surtaxSingle', 'The single surtax threshold'); need('payroll.surtaxMarried', 'The married surtax threshold');
    } else if (tab === 'ss') {
        Object.keys(TAX_STATUSES).forEach(s => {
            const half = tbGetPath(rec, 'ssTax.' + s + '.half'), most = tbGetPath(rec, 'ssTax.' + s + '.most');
            if (!num(half, 0) || !num(most, 0)) out.push(TAX_STATUSES[s] + ': both amounts are needed.');
            else if (Number(most) < Number(half)) out.push(TAX_STATUSES[s] + ': the 85% amount has to be at least the 50% one.');
        });
        const lo = tbGetPath(rec, 'socialSecurity.earliest'), hi = tbGetPath(rec, 'socialSecurity.latest');
        if (!num(lo, 0, 120) || !num(hi, 0, 120)) out.push('The claiming ages need to be ages.');
        else if (Number(hi) < Number(lo)) out.push('The benefit has to rise until an age after the earliest.');
        need('socialSecurity.early', 'Less a month early', 100); need('socialSecurity.earlyMonths', 'The months at the first rate');
        need('socialSecurity.earlyMore', 'Less a month before those', 100); need('socialSecurity.delayed', 'More a month waited', 100);
        need('socialSecurity.pct1', 'The first share of earnings', 100); need('socialSecurity.pct2', 'The second share', 100); need('socialSecurity.pct3', 'The third share', 100);
        const b1 = tbGetPath(rec, 'socialSecurity.bend1'), b2 = tbGetPath(rec, 'socialSecurity.bend2');
        if (!num(b1, 0) || !num(b2, 0)) out.push('Both earnings amounts are needed.');
        else if (Number(b2) < Number(b1)) out.push('The second earnings amount has to be above the first.');
        rowsOk('socialSecurity.fra', ['from', 'years', 'months'], 'full retirement ages');
    } else if (tab === 'limits') {
        need('limits.k401', 'The 401(k) limit'); need('limits.k401CatchUp', 'The 401(k) catch-up'); need('limits.k401CatchUp6063', 'The 60 to 63 catch-up');
        need('limits.ira', 'The IRA limit'); need('limits.iraCatchUp', 'The IRA catch-up');
        need('limits.total415', 'The 401(k) total'); need('limits.compCap', 'The pay a match is worked from');
        need('limits.hsaSelf', 'The self-only HSA limit'); need('limits.hsaFamily', 'The family HSA limit'); need('limits.hsaCatchUp', 'The HSA catch-up');
        [['Single', 'rothSingle'], ['Married', 'rothMarried']].forEach(([n, k]) => {
            const a = tbGetPath(rec, 'limits.' + k + 'From'), b = tbGetPath(rec, 'limits.' + k + 'To');
            if (!num(a, 0) || !num(b, 0)) out.push(n + ': the Roth IRA income range needs both amounts.');
            else if (Number(b) < Number(a)) out.push(n + ': the Roth IRA range has to end above where it starts.');
        });
    } else if (tab === 'withdraw') {
        if (!num(tbGetPath(rec, 'withdraw.earlyYears'), 0, 120)) out.push('The early-withdrawal age needs to be an age.');
        if (!num(tbGetPath(rec, 'withdraw.earlyMonths'), 0, 11) && tbGetPath(rec, 'withdraw.earlyMonths') !== null && tbGetPath(rec, 'withdraw.earlyMonths') !== '') out.push('The months of the early-withdrawal age are 0 to 11.');
        need('withdraw.penalty', 'The penalty', 100);
        if (!num(tbGetPath(rec, 'withdraw.sepAge'), 0, 120)) out.push('The age for leaving a 401(k) job needs to be an age.');
        rowsOk('withdraw.rmdStart', ['from', 'age'], 'starting ages');
        const rows = rowsOk('withdraw.rmdTable', ['age', 'divisor'], 'divisors');
        const ages = rows.filter(r => num(r.age, 0) && num(r.divisor, 0)).map(r => Math.round(Number(r.age)));
        if (ages.length) for (let a = Math.min.apply(null, ages); a < Math.max.apply(null, ages); a++) if (!ages.includes(a)) { out.push('A divisor is missing for age ' + a + '.'); break; }
        if (rows.some(r => num(r.divisor, 0) && Number(r.divisor) === 0)) out.push('A divisor of 0 cannot divide.');
    }
    return out;
}

/** A rule typed: kept at once, everything that shows it brought up to date. */
function tbFieldInput(input) {
    const widget = input.closest('.tb-widget');
    const table = taxTableLoad();
    const rec = table.years[widget.dataset.year];
    if (!rec) return;
    tbSetPath(rec, input.dataset.path, input.value === '' ? null : Number(input.value));
    taxTableSave(table, widget);
}

/** A list of rows, read back from its fields. */
function tbRowsRead(tableEl) {
    const keys = tableEl.dataset.cols.split(',');
    return Array.from(tableEl.querySelectorAll('tbody tr')).map(tr => {
        const r = {};
        keys.forEach(k => { const v = tr.querySelector('.tb-cell[data-k="' + k + '"]').value; r[k] = v === '' ? null : Number(v); });
        return r;
    });
}

function tbRowsStore(tableEl, typing) {
    const widget = tableEl.closest('.tb-widget');
    const table = taxTableLoad();
    const rec = table.years[widget.dataset.year];
    if (!rec) return;
    tbSetPath(rec, tableEl.dataset.path, tbRowsRead(tableEl));
    taxTableSave(table, typing ? widget : null);
}

function tbRowsInput(input) {
    tbRowsStore(input.closest('table'), true);
}

/** A row after the last, one step on from it: a start to edit rather than a blank to fill. */
function tbRowsAdd(btn) {
    const tableEl = btn.previousElementSibling;
    const widget = btn.closest('.tb-widget');
    const path = tableEl.dataset.path;
    const rows = tbRowsRead(tableEl);
    const last = rows[rows.length - 1] || {};
    const first = tableEl.dataset.cols.split(',')[0];
    const step = path.startsWith('capGains') ? 10000 : 1;
    const next = Object.assign({}, last);
    next[first] = (Number(last[first]) || 0) + (rows.length ? step : 0);
    rows.push(next);
    const table = taxTableLoad();
    const rec = table.years[widget.dataset.year];
    if (!rec) return;
    tbSetPath(rec, path, rows);
    taxTableSave(table, null);
    const added = widget.querySelector('table[data-path="' + path + '"] tbody tr:last-child .tb-cell');
    if (added) added.focus();
}

function tbRowsRemove(btn) {
    const tableEl = btn.closest('table');
    if (tableEl.querySelectorAll('tbody tr').length < 2) return;
    btn.closest('tr').remove();
    tbRowsStore(tableEl, false);
}

/** The To column and the problems, from what is in the fields — redrawn as they are
 *  typed into without touching the fields themselves. */
function tbRefreshDerived(widget) {
    const table = taxTableLoad();
    const year = widget.dataset.year;
    if (!table.years[year]) { tbRender(widget); return; }
    const panel = widget.querySelector('.tb-panel');
    if (panel) {
        const rec = table.years[year];
        panel.querySelectorAll('table[data-to]').forEach(t => {
            const rows = tbGetPath(rec, t.dataset.path) || [];
            t.querySelectorAll('tbody tr').forEach((tr, i) => {
                const next = rows[i + 1];
                tr.querySelector('.tb-to').textContent = next && Number(next.from) > 0 ? tbMoney(Number(next.from) - 1) : (next ? '' : 'and up');
            });
        });
        const problems = taxRuleProblems(rec, panel.dataset.tab);
        const box = panel.querySelector('.tb-rule-problem');
        box.textContent = problems.join(' ');
        box.hidden = !problems.length;
    }
    widget.querySelectorAll('.tb-panel').length || widget.querySelectorAll('.tb-status').forEach(el => {
        const st = table.years[year][el.dataset.status];
        const rows = el.querySelectorAll('tbody tr');
        rows.forEach((tr, i) => {
            const next = st && st.brackets[i + 1];
            const to = next && Number(next.from) > 0 ? tbMoney(Number(next.from) - 1) : (next ? '' : 'and up');
            tr.querySelector('.tb-to').textContent = to;
        });
        const problems = taxProblems(st);
        const box = el.querySelector('.tb-problem');
        box.textContent = problems.join(' ');
        box.hidden = !problems.length;
    });
    const reset = widget.querySelector('.tb-reset');
    if (reset) reset.disabled = JSON.stringify(taxBuiltin()[year]) === JSON.stringify(table.years[year]);
}

function tbReadStatus(el) {
    const num = (v) => v === '' ? null : Number(v);
    return {
        deduction: num(el.querySelector('.tb-ded').value),
        brackets: Array.from(el.querySelectorAll('tbody tr')).map(tr => ({ from: num(tr.querySelector('.tb-from').value), rate: num(tr.querySelector('.tb-rate').value) }))
    };
}

/** A change to one status of the year shown: read back from its fields and saved. */
function tbStore(el, typing) {
    const widget = el.closest('.tb-widget');
    const statusEl = el.closest('.tb-status');
    if (!widget || !statusEl) return null;
    const table = taxTableLoad();
    const year = widget.dataset.year;
    if (!table.years[year]) return null;
    table.years[year][statusEl.dataset.status] = tbReadStatus(statusEl);
    taxTableSave(table, typing ? widget : null);
    return widget;
}

function tbOnInput(input) {
    tbStore(input, true);
}

function tbAddBracket(btn) {
    const widget = btn.closest('.tb-widget');
    const statusEl = btn.closest('.tb-status');
    const status = statusEl.dataset.status;
    const body = statusEl.querySelector('tbody');
    const last = body.lastElementChild;
    const tr = document.createElement('tr');
    tr.innerHTML = '<td><input type="number" class="tb-from"></td><td class="tb-to"></td><td><input type="number" class="tb-rate"></td><td></td>';
    // Above the last one, at its rate: a start to edit rather than a blank to fill.
    tr.querySelector('.tb-from').value = last ? String((Number(last.querySelector('.tb-from').value) || 0) + 10000) : '0';
    tr.querySelector('.tb-rate').value = last ? last.querySelector('.tb-rate').value : '';
    body.appendChild(tr);
    tbStore(btn, false);
    const added = widget.querySelector('.tb-status[data-status="' + status + '"] tbody tr:last-child .tb-from');
    if (added) added.focus();
}

function tbRemoveBracket(btn) {
    const tr = btn.closest('tr');
    const statusEl = btn.closest('.tb-status');
    if (!tr || !statusEl || statusEl.querySelectorAll('tbody tr').length < 2) return;
    const anchor = statusEl.querySelector('.tb-ded');
    tr.remove();
    tbStore(anchor, false);
}

function tbSetYear(widget, year) {
    const toolId = tbToolId(widget);
    if (toolId && typeof toolCustomizations !== 'undefined' && typeof saveToolCustomizations === 'function') {
        const next = Object.assign({}, toolCustomizations);
        next[toolId] = Object.assign({}, next[toolId] || {}, { tbYear: year });
        saveToolCustomizations(next);
    }
    widget.dataset.year = year;
}

function tbPickYear(select) {
    const widget = select.closest('.tb-widget');
    tbSetYear(widget, select.value);
    tbRender(widget);
}

/** A new year after the latest, copied from it: next year's brackets are this year's
 *  moved up a little, so they are quicker to edit than to type. */
function tbAddYear(btn) {
    const widget = btn.closest('.tb-widget');
    const table = taxTableLoad();
    const years = taxYearsOf(table);
    const latest = years[years.length - 1];
    const next = String(Number(latest) + 1);
    table.years[next] = taxClone(table.years[latest]);
    tbSetYear(widget, next);
    taxTableSave(table, null);
}

function tbDeleteYear(btn) {
    const widget = btn.closest('.tb-widget');
    const table = taxTableLoad();
    const year = widget.dataset.year;
    if (taxYearsOf(table).length < 2 || !table.years[year]) return;
    if (!window.confirm('Delete the ' + year + ' tax brackets? Every board’s Tax Calculator shares them, and this cannot be undone.')) return;
    delete table.years[year];
    tbSetYear(widget, taxDefaultYear(table));
    taxTableSave(table, null);
}

function tbResetYear(btn) {
    const widget = btn.closest('.tb-widget');
    const year = widget.dataset.year;
    const builtin = taxBuiltin();
    if (!builtin[year]) return;
    const table = taxTableLoad();
    table.years[year] = taxClone(builtin[year]);
    taxTableSave(table, null);
}

/** From a Tax Calculator: the Tax Brackets tool on this board, or a new one. */
function taxOpenBrackets() {
    let id = null;
    document.querySelectorAll('.tool').forEach(t => {
        const tid = t.getAttribute('data-tool');
        const custom = typeof toolCustomizations !== 'undefined' ? toolCustomizations[tid] || {} : {};
        if (!id && (tid === 'tax-brackets' || custom.templateId === 'tax-brackets')) id = tid;
    });
    // A board opened only to look at is not added to.
    const lookOnly = typeof viewOnlyMode !== 'undefined' && viewOnlyMode;
    if (!id && !lookOnly && typeof createNoteWithTemplate === 'function') id = createNoteWithTemplate('tax-brackets');
    if (!id) return;
    // A calculator filling the window would hide the tool it just opened.
    if (typeof exitToolFullscreen === 'function') exitToolFullscreen();
    if (typeof navigateToTool === 'function' && typeof currentBoardId !== 'undefined') navigateToTool(currentBoardId, id);
}

// Another tab saved the brackets: this one shows them too.
window.addEventListener('storage', (e) => { if (e.key === TAX_TABLE_KEY) taxTableChanged(null); });

function calculateTaxIn(w) {
    // The years come from the shared table, so the list is made before the saved
    // choice is put back into it.
    const table = taxTableLoad();
    const yearEl = w.querySelector('#taxYear');
    if (yearEl) {
        const keep = yearEl.value;
        const auto = taxDefaultYear(table);
        const thisYear = String(new Date().getFullYear());
        yearEl.innerHTML = '<option value="">' + (auto === thisYear ? 'This year' : 'Latest') + ' (' + auto + ')</option>' +
            taxYearsOf(table).map(y => '<option value="' + y + '">' + y + '</option>').join('');
        yearEl.value = keep && table.years[keep] ? keep : '';
    }
    calcSync('tax', w);
    const incomeEl = w.querySelector('#taxIncome');
    const statusEl = w.querySelector('#taxStatus');
    const resultsEl = w.querySelector('#taxResults');
    if (!incomeEl || !statusEl || !resultsEl) return;

    const year = yearEl && yearEl.value && table.years[yearEl.value] ? yearEl.value : taxDefaultYear(table);
    const income = parseFloat(incomeEl.value) || 0;
    const status = statusEl.value;
    const figures = table.years[year][status];
    const source = '<div class="tax-source">' + year + ' ' + (TAX_STATUSES[status] || status) + ' brackets \u00B7 ' +
        '<button type="button" class="tax-edit" onclick="taxOpenBrackets()">edit in Tax &amp; Retirement Rules</button></div>';
    const brackets = taxBracketsFor(figures);
    if (!figures || !brackets.length) {
        resultsEl.innerHTML = '<div style="color:#c0392b;text-align:center;padding:20px;">There are no usable ' + year + ' brackets for ' +
            (TAX_STATUSES[status] || status) + '.</div>' + source;
        return;
    }
    const problems = taxProblems(figures);
    w._figures = null;
    const ded = Number(figures.deduction) >= 0 ? Number(figures.deduction) : 0;
    const taxable = Math.max(0, income - ded);
    let totalTax = 0;
    let breakdown = '';

    for (const b of brackets) {
        if (taxable > b.min) {
            const amt = Math.min(taxable, b.max) - b.min;
            const tax = amt * b.rate;
            totalTax += tax;
            if (amt > 0) {
                breakdown += '<div class="calc-row"><span>' + (Math.round(b.rate * 10000) / 100) + '%</span><span>$' + amt.toLocaleString() + '</span><span class="calc-card-value negative">$' + tax.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</span></div>';
            }
        }
    }

    const effRate = income > 0 ? (totalTax / income * 100).toFixed(1) : 0;
    w._figures = { income: income, status: status, year: year, yearChoice: yearEl ? yearEl.value : '', deduction: ded, tax: totalTax, effectiveRate: income > 0 ? totalTax / income * 100 : 0,
        takeHomeMonthly: (income - totalTax) / 12 };
    const margBracket = brackets.find(function(b) { return taxable >= b.min && taxable < b.max; });
    const margRate = margBracket ? Math.round(margBracket.rate * 10000) / 100 : Math.round(brackets[brackets.length - 1].rate * 10000) / 100;

    resultsEl.innerHTML =
        (problems.length ? '<div class="tax-warn">The ' + year + ' ' + (TAX_STATUSES[status] || status) + ' figures have a problem: ' + escapeHtml(problems.join(' ')) +
            ' Worked out from the brackets that can be used.</div>' : '') +
        '<div class="calc-grid">' +
            '<div class="calc-card"><div class="calc-card-label">Standard Deduction</div><div class="calc-card-value positive">$' + ded.toLocaleString() + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Taxable Income</div><div class="calc-card-value">$' + taxable.toLocaleString() + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Total Tax</div><div class="calc-card-value negative">$' + totalTax.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Effective / Marginal</div><div class="calc-card-value">' + effRate + '% / ' + margRate + '%</div></div>' +
        '</div>' +
        '<div class="calc-section-title">TAX BY BRACKET</div>' +
        breakdown +
        '<div class="calc-row" style="padding:8px 0;font-weight:600;"><span>Take Home (Monthly)</span><span class="calc-card-value positive">$' + ((income - totalTax) / 12).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</span></div>' +
        source;
}

// ---- What was typed, kept -----------------------------------------------------------
//
// Each calculator's fields are saved with the tool as they change and put back when it
// loads, before anything is worked out from them. Only what differs from the field's
// own default is kept, so a calculator nobody has touched saves nothing, and Reset is
// offered only when there is something to reset.

const CALC_FIELDS = {
    loan: ['loanAmount', 'loanCurrent', 'loanRate', 'loanYears', 'loanExtra', 'loanClosing'],
    growth: ['growthInitial', 'growthMonthly', 'growthRate', 'growthYears', 'growthCompound'],
    tax: ['taxIncome', 'taxStatus', 'taxYear']
};

/** A field by id, or a group of radios by name, inside one widget. */
/**
 * Work a calculator out: the one an element is in, or — with nothing given, as when
 * the board starts — every one of that kind on the page. Each finds its fields inside
 * its own widget, so two copies (one on the board, one in a popup) never read or
 * write each other's.
 */
function calcEach(kind, scope, fn) {
    const own = scope && scope.closest ? scope.closest('.calc-widget') : null;
    if (own) { fn(own); return; }
    document.querySelectorAll('.calc-widget[data-calc="' + kind + '"]').forEach(w => fn(w));
}

function calculateTax(scope) { calcEach('tax', scope, calculateTaxIn); }
function calculateLoan(scope) { calcEach('loan', scope, calculateLoanIn); }
function calculateGrowth(scope) { calcEach('growth', scope, calculateGrowthIn); }

// ---- Opened for a moment, from another tool -----------------------------------------
//
// Each calculator can be opened in a popup (openToolPopup): filled from the opener's
// values by name, worked out, and read back as the figures it last came to.

const CALC_POPUP_FIELDS = {
    loan: { amount: 'loanAmount', balance: 'loanCurrent', rate: 'loanRate', years: 'loanYears', extra: 'loanExtra', closing: 'loanClosing' },
    growth: { initial: 'growthInitial', monthly: 'growthMonthly', rate: 'growthRate', years: 'growthYears', compounding: 'growthCompound' },
    tax: { income: 'taxIncome', status: 'taxStatus', year: 'taxYear' }
};

function calcPopupFill(kind, body, inputs) {
    const widget = body.querySelector('.calc-widget[data-calc="' + kind + '"]');
    if (!widget) return;
    if (kind === 'tax') calculateTax(widget.firstElementChild); // the year list, before a year is chosen from it
    const map = CALC_POPUP_FIELDS[kind];
    Object.keys(map).forEach(k => {
        if (inputs[k] === undefined || inputs[k] === null) return;
        const f = calcField(widget, map[k]);
        if (f) f.set(String(inputs[k]));
    });
    ({ loan: calculateLoan, growth: calculateGrowth, tax: calculateTax })[kind](widget.firstElementChild);
}

function calcPopupRead(body) {
    const widget = body.querySelector('.calc-widget');
    return widget && widget._figures ? Object.assign({}, widget._figures) : null;
}

function loanPopupFill(body, inputs) { calcPopupFill('loan', body, inputs); }
function growthPopupFill(body, inputs) { calcPopupFill('growth', body, inputs); }
function taxPopupFill(body, inputs) { calcPopupFill('tax', body, inputs); }

function calcField(widget, name) {
    const radios = widget.querySelectorAll('input[type="radio"][name="' + name + '"]');
    if (radios.length) {
        return {
            get: () => { const on = Array.from(radios).find(r => r.checked); return on ? on.value : ''; },
            set: (v) => radios.forEach(r => { r.checked = r.value === v; }),
            initial: () => { const on = Array.from(radios).find(r => r.defaultChecked); return on ? on.value : ''; }
        };
    }
    const el = widget.querySelector('#' + name);
    if (!el) return null;
    return {
        get: () => el.value,
        set: (v) => { el.value = v; },
        initial: () => el.tagName === 'SELECT'
            ? ((Array.from(el.options).find(o => o.defaultSelected) || el.options[0] || {}).value || '')
            : el.defaultValue
    };
}

/**
 * The first time a calculator is worked out, its saved values go back in; every time
 * after, what is in it is saved. Called at the top of each calculate function, so the
 * figures are always worked out from what is shown.
 */
function calcSync(kind, widget) {
    const tool = widget && widget.closest('.tool');
    const toolId = tool && tool.getAttribute('data-tool');
    if (!widget || !toolId || typeof toolCustomizations === 'undefined') return;
    const fields = CALC_FIELDS[kind].map(name => [name, calcField(widget, name)]).filter(f => f[1]);
    const custom = toolCustomizations[toolId] || {};
    if (!widget.dataset.calcRestored) {
        widget.dataset.calcRestored = '1';
        const saved = custom.calcInputs || {};
        fields.forEach(([name, f]) => { if (Object.prototype.hasOwnProperty.call(saved, name)) f.set(String(saved[name])); });
    } else {
        const changed = {};
        fields.forEach(([name, f]) => { const v = f.get(); if (v !== f.initial()) changed[name] = v; });
        const before = JSON.stringify(custom.calcInputs || {});
        if (JSON.stringify(changed) !== before && typeof saveToolCustomizations === 'function') {
            const next = Object.assign({}, toolCustomizations);
            next[toolId] = Object.assign({}, custom);
            if (Object.keys(changed).length) next[toolId].calcInputs = changed;
            else delete next[toolId].calcInputs;
            saveToolCustomizations(next);
        }
    }
    const reset = widget.querySelector('.calc-reset');
    if (reset) reset.hidden = !fields.some(([, f]) => f.get() !== f.initial());
}

/** Every field back to its default, and worked out again — which saves that too. */
function calcReset(btn, kind) {
    const widget = btn.closest('.calc-widget');
    if (!widget) return;
    CALC_FIELDS[kind].forEach(name => { const f = calcField(widget, name); if (f) f.set(f.initial()); });
    ({ loan: calculateLoan, growth: calculateGrowth, tax: calculateTax })[kind](widget);
}

function calculateLoanIn(w) {
    calcSync('loan', w);
    const amountEl = w.querySelector('#loanAmount');
    const rateEl = w.querySelector('#loanRate');
    const yearsEl = w.querySelector('#loanYears');
    const extraEl = w.querySelector('#loanExtra');
    const resultsEl = w.querySelector('#loanResults');
    if (!amountEl || !rateEl || !yearsEl || !resultsEl) return;

    const principal = parseFloat(amountEl.value) || 0;
    const annualRate = (parseFloat(rateEl.value) || 0) / 100;
    const years = parseInt(yearsEl.value) || 0;
    const extraPayment = parseFloat(extraEl.value) || 0;
    const monthlyRate = annualRate / 12;
    const numPayments = years * 12;

    w._figures = null;
    if (principal <= 0 || annualRate <= 0 || years <= 0) {
        resultsEl.innerHTML = '<div style="color:#7f8c8d;text-align:center;padding:20px;">Enter loan details above</div>';
        return;
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    // A loan already under way: the balance today, paid down at the payment the
    // original loan set — a fixed-rate payment does not change as the balance does.
    const currentEl = w.querySelector('#loanCurrent');
    const current = currentEl ? parseFloat(currentEl.value) : NaN;
    const closing = loanClosingOf(w);
    // What a popup hands back: the loan as it stands, at the payment it was set up with.
    w._figures = { amount: principal, balance: current > 0 ? current : principal, current: current > 0 ? current : null, rate: annualRate * 100, years: years,
        payment: monthlyPayment, extra: extraPayment, closing: closing ? w.querySelector('#loanClosing').value : '' };
    if (current > 0 && Math.abs(current - principal) >= 0.005) {
        resultsEl.innerHTML = loanFromBalance(principal, current, monthlyRate, numPayments, monthlyPayment, totalInterest, extraPayment, closing);
        return;
    }

    let balance = principal, totalInterestWithExtra = 0, monthsWithExtra = 0;
    while (balance > 0 && monthsWithExtra < numPayments * 2) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = Math.min(balance, monthlyPayment - interestPayment + extraPayment);
        totalInterestWithExtra += interestPayment;
        balance -= principalPayment;
        monthsWithExtra++;
        if (balance < 0.01) balance = 0;
    }
    const yearsWithExtra = Math.floor(monthsWithExtra / 12);
    const monthsRemainder = monthsWithExtra % 12;
    const interestSaved = totalInterest - totalInterestWithExtra;

    let milestones = '';
    const checkYears = [1, 5, 10, 15, 20, 25, 30].filter(function(y) { return y <= years; });
    let bal = principal, paidPrincipal = 0, paidInterest = 0;
    for (let m = 1; m <= numPayments; m++) {
        const intPmt = bal * monthlyRate;
        const prinPmt = monthlyPayment - intPmt;
        paidInterest += intPmt;
        paidPrincipal += prinPmt;
        bal -= prinPmt;
        if (checkYears.includes(m / 12)) {
            milestones += '<div class="calc-row"><span>Year ' + (m/12) + (closing ? ' \u00B7 ' + loanMonth(closing, m).getFullYear() : '') + '</span><span>Balance: $' + Math.max(0,bal).toLocaleString(undefined,{maximumFractionDigits:0}) + '</span><span style="color:var(--text-muted);">Paid: $' + paidPrincipal.toLocaleString(undefined,{maximumFractionDigits:0}) + '</span></div>';
        }
    }

    resultsEl.innerHTML =
        '<div class="calc-grid">' +
            '<div class="calc-card"><div class="calc-card-label">Monthly Payment</div><div class="calc-card-value large info">$' + monthlyPayment.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Total Interest</div><div class="calc-card-value large negative">$' + totalInterest.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Total Cost</div><div class="calc-card-value">$' + totalPayment.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Interest Ratio</div><div class="calc-card-value">' + (totalInterest/principal*100).toFixed(1) + '%</div></div>' +
        '</div>' +
        (closing ? '<div class="calc-row loan-schedule" style="border:none;margin-bottom:10px;color:var(--text-secondary);">' + loanScheduleText(closing, principal, monthlyRate, monthlyPayment, numPayments) + '</div>' : '') +
        (extraPayment > 0 ? '<div class="calc-highlight"><div class="calc-highlight-title">WITH $' + extraPayment.toLocaleString() + '/mo EXTRA</div><div class="calc-row" style="border:none;font-size:13px;"><span>Payoff: ' + yearsWithExtra + 'y ' + monthsRemainder + 'm' + (closing ? ' \u00B7 ' + loanMonthText(closing, monthsWithExtra) : '') + '</span><span class="calc-card-value positive" style="font-size:13px;">Save $' + interestSaved.toLocaleString(undefined,{maximumFractionDigits:0}) + '</span></div></div>' : '') +
        '<div class="calc-section-title">AMORTIZATION</div>' +
        milestones;
}

function loanMoney(n, digits) {
    return '$' + n.toLocaleString(undefined, { minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0 });
}

function loanSpan(months) {
    return Math.floor(months / 12) + 'y ' + (months % 12) + 'm';
}

/**
 * The closing date, if one is given: the day the loan began. Payments fall monthly
 * from the month after it, so payment k is due in the k-th month after closing.
 */
function loanClosingOf(w) {
    const el = w && w.querySelector('#loanClosing');
    const m = el && /^(\d{4})-(\d{2})-(\d{2})$/.exec(el.value || '');
    if (!m) return null;
    return { y: +m[1], m: +m[2] - 1, d: +m[3], date: new Date(+m[1], +m[2] - 1, +m[3]) };
}

/** The month a payment falls in: k months after closing. */
function loanMonth(closing, k) {
    return new Date(closing.y, closing.m + k, 1);
}

function loanMonthText(closing, k) {
    return loanMonth(closing, k).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

/** Payments due by today: one a month from the month after closing, this month's included. */
function loanPaymentsMade(closing, numPayments) {
    const now = new Date();
    const made = (now.getFullYear() * 12 + now.getMonth()) - (closing.y * 12 + closing.m);
    return Math.max(0, Math.min(numPayments, made));
}

/** What the original schedule says is owed after k payments. */
function loanScheduled(principal, monthlyRate, payment, k) {
    const g = Math.pow(1 + monthlyRate, k);
    return Math.max(0, principal * g - payment * (g - 1) / monthlyRate);
}

/** For a new loan with a closing date: where the schedule says it stands today. */
function loanScheduleText(closing, principal, monthlyRate, payment, numPayments) {
    const last = loanMonthText(closing, numPayments);
    if (closing.date > new Date()) {
        return 'Closes ' + closing.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
            ': first payment ' + loanMonthText(closing, 1) + ', last ' + last + '.';
    }
    const made = loanPaymentsMade(closing, numPayments);
    if (made >= numPayments) return 'Paid off on schedule in ' + last + '.';
    return 'On schedule today: ' + loanMoney(loanScheduled(principal, monthlyRate, payment, made)) + ' owed, ' + made + ' of ' + numPayments +
        ' payments made. Last payment ' + last + '.';
}

/** Months and interest to pay a balance off at a payment, a month at a time. */
function loanPayDown(balance, monthlyRate, payment, limit) {
    let months = 0, interest = 0;
    while (balance > 0.005 && months < limit) {
        const i = balance * monthlyRate;
        interest += i;
        balance -= Math.min(balance, payment - i);
        months++;
    }
    return { months: months, interest: interest };
}

/**
 * The loan from today's balance: how long is left, what interest is left, how much
 * of the original is paid, and where on the original schedule that balance sits —
 * the month whose balance first comes down to it.
 */
function loanFromBalance(principal, current, monthlyRate, numPayments, payment, totalInterest, extra, closing) {
    const owedInterest = current * monthlyRate;
    const note = current > principal
        ? '<div class="calc-row" style="border:none;color:var(--text-muted);">The current balance is more than the original amount; worked out from it all the same.</div>' : '';
    if (owedInterest >= payment) {
        return note + '<div style="color:#c0392b;text-align:center;padding:20px;">At ' + loanMoney(current) + ' the payment of ' + loanMoney(payment, 2) +
            ' does not cover the month\u2019s interest of ' + loanMoney(owedInterest, 2) + ', so the balance would never come down.</div>';
    }
    const limit = numPayments * 4;
    const left = loanPayDown(current, monthlyRate, payment, limit);
    const payoff = new Date();
    payoff.setDate(1);
    payoff.setMonth(payoff.getMonth() + left.months);
    const payoffText = payoff.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    const paid = Math.max(0, principal - current);

    let at = 0, bal = principal;
    while (bal > current + 0.005 && at < numPayments) {
        bal -= payment - bal * monthlyRate;
        at++;
    }
    const position = current >= principal ? 'That is the original amount or more: the start of the original schedule.'
        : 'That balance is where the original schedule is after ' + loanSpan(at) + ', with ' + loanSpan(numPayments - at) + ' of it to go.';

    // With a closing date, the balance can be held against what the schedule says is
    // owed by now: ahead where less is owed, behind where more is.
    let pace = '';
    if (closing) {
        const made = loanPaymentsMade(closing, numPayments);
        const due = loanScheduled(principal, monthlyRate, payment, made);
        const diff = due - current;
        const original = ' The original schedule ends ' + loanMonthText(closing, numPayments) + '.';
        if (closing.date > new Date()) pace = 'The loan has not closed yet, so there is nothing to be ahead or behind of.' + original;
        else if (Math.abs(diff) < 1) pace = 'Right on schedule, ' + made + (made === 1 ? ' payment' : ' payments') + ' in.' + original;
        else {
            const months = Math.abs(at - made);
            pace = (diff > 0 ? 'Ahead of schedule by ' : 'Behind schedule by ') + loanMoney(Math.abs(diff)) +
                (months ? ', about ' + loanSpan(months).replace(/^0y /, '') : '') + ': after ' + made + (made === 1 ? ' payment' : ' payments') +
                ' the schedule has ' + loanMoney(due) + ' owed.' + original;
        }
    }

    let extraHtml = '';
    if (extra > 0) {
        const faster = loanPayDown(current, monthlyRate, payment + extra, limit);
        extraHtml = '<div class="calc-highlight"><div class="calc-highlight-title">WITH ' + loanMoney(extra) + '/mo EXTRA, FROM NOW</div>' +
            '<div class="calc-row" style="border:none;font-size:13px;"><span>Payoff: ' + loanSpan(faster.months) + '</span>' +
            '<span class="calc-card-value positive" style="font-size:13px;">Save ' + loanMoney(left.interest - faster.interest) + '</span></div></div>';
    }

    let milestones = '', b = current, paidSince = 0;
    const checks = [1, 5, 10, 15, 20, 25, 30, 35, 40];
    for (let m = 1; m <= left.months; m++) {
        const prin = Math.min(b, payment - b * monthlyRate);
        b -= prin;
        paidSince += prin;
        if (m % 12 === 0 && checks.includes(m / 12)) {
            milestones += '<div class="calc-row"><span>In ' + (m / 12) + (m === 12 ? ' year' : ' years') + '</span><span>Balance: ' + loanMoney(Math.max(0, b)) +
                '</span><span style="color:var(--text-muted);">Paid: ' + loanMoney(paidSince) + '</span></div>';
        }
    }
    milestones += '<div class="calc-row"><span>Paid off</span><span>' + payoffText + '</span><span style="color:var(--text-muted);">in ' + loanSpan(left.months) + '</span></div>';

    return note +
        '<div class="calc-grid">' +
            '<div class="calc-card"><div class="calc-card-label">Monthly Payment</div><div class="calc-card-value large info">' + loanMoney(payment, 2) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Time Left</div><div class="calc-card-value large">' + loanSpan(left.months) + '</div>' +
                '<div class="calc-card-label">' + payoffText + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Interest Left</div><div class="calc-card-value large negative">' + loanMoney(left.interest) + '</div>' +
                '<div class="calc-card-label">of ' + loanMoney(totalInterest) + ' in all</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Paid Off</div><div class="calc-card-value positive">' + (paid / principal * 100).toFixed(1) + '%</div>' +
                '<div class="calc-card-label">' + loanMoney(paid) + ' of ' + loanMoney(principal) + '</div></div>' +
        '</div>' +
        '<div class="calc-row loan-position" style="border:none;margin-bottom:10px;color:var(--text-secondary);">' + position + '</div>' +
        (pace ? '<div class="calc-row loan-pace" style="border:none;margin:-6px 0 10px;color:var(--text-secondary);">' + pace + '</div>' : '') +
        extraHtml +
        '<div class="calc-section-title">AMORTIZATION, FROM NOW</div>' +
        milestones;
}

function calculateGrowthIn(w) {
    calcSync('growth', w);
    const initialEl = w.querySelector('#growthInitial');
    const monthlyEl = w.querySelector('#growthMonthly');
    const rateEl = w.querySelector('#growthRate');
    const yearsEl = w.querySelector('#growthYears');
    const resultsEl = w.querySelector('#growthResults');
    const compoundEl = w.querySelector('input[name="growthCompound"]:checked');
    if (!initialEl || !monthlyEl || !rateEl || !yearsEl || !resultsEl) return;

    const initial = parseFloat(initialEl.value) || 0;
    const monthly = parseFloat(monthlyEl.value) || 0;
    const rate = (parseFloat(rateEl.value) || 0) / 100;
    const years = parseInt(yearsEl.value) || 0;
    const isMonthly = !compoundEl || compoundEl.value === 'monthly';

    const months = years * 12;
    const totalContrib = initial + (monthly * months);

    let fv = initial;
    if (isMonthly) {
        const monthlyRate = rate / 12;
        for (let i = 0; i < months; i++) fv = fv * (1 + monthlyRate) + monthly;
    } else {
        for (let i = 0; i < years; i++) fv = fv * (1 + rate) + (monthly * 12);
    }
    const growth = fv - totalContrib;

    const milestones = [5, 10, 15, 20, 25, 30, 35, 40].filter(function(y) { return y <= years; });
    let timeline = '';
    for (let j = 0; j < milestones.length; j++) {
        const y = milestones[j];
        let val = initial;
        if (isMonthly) {
            const monthlyRate = rate / 12;
            for (let i = 0; i < y * 12; i++) val = val * (1 + monthlyRate) + monthly;
        } else {
            for (let i = 0; i < y; i++) val = val * (1 + rate) + (monthly * 12);
        }
        timeline += '<div class="calc-row"><span>' + y + ' years</span><span class="calc-card-value positive">$' + val.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</span></div>';
    }

    w._figures = { initial: initial, monthly: monthly, rate: rate * 100, years: years, compounding: isMonthly ? 'monthly' : 'annual', futureValue: fv };
    resultsEl.innerHTML =
        '<div class="calc-grid">' +
            '<div class="calc-card"><div class="calc-card-label">Future Value</div><div class="calc-card-value large positive">$' + fv.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Total Contributions</div><div class="calc-card-value large">$' + totalContrib.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Investment Growth</div><div class="calc-card-value large positive">$' + growth.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Growth Multiple</div><div class="calc-card-value large">' + (totalContrib > 0 ? (fv / totalContrib).toFixed(1) : '0.0') + 'x</div></div>' +
        '</div>' +
        (timeline ? '<div class="calc-section-title">GROWTH TIMELINE</div>' + timeline : '');

    requestAnimationFrame(function() {
        var tool = resultsEl.closest('.tool');
        if (!tool) return;
        var header = tool.querySelector('.tool-header');
        var inner = tool.querySelector('.calc-widget');
        if (!header || !inner) return;
        // Measure the calc-widget's natural height (not flex-stretched) and size the tool to fit.
        // tool-content has 15px padding top + bottom = 30px; add 8px breathing room.
        var newHeight = Math.max(200, Math.min(750, inner.offsetHeight + header.offsetHeight + 38));
        tool.style.height = newHeight + 'px';
        var toolId = tool.getAttribute('data-tool');
        if (typeof positions !== 'undefined' && toolId) {
            if (!positions[toolId]) positions[toolId] = { x: tool.offsetLeft, y: tool.offsetTop, z: 1 };
            positions[toolId].height = newHeight;
            if (typeof savePositions === 'function') savePositions(positions);
        }
    });
}

// ============================================================
// Finance Planning: accounts, income and expenses, and where they lead
// ============================================================
//
// One plan per tool, under toolCustomizations[toolId].financePlan: board data, so it is
// undone like any edit and kept in JSON backups, but left out of share links and HTML
// exports (PRIVATE_SHARE_KEYS) — balances and income are the person's own.
//
// Everything is worked out month by month from the start of this month: incomes and
// expenses grow by their own rate (inflation where none is given), income tax comes
// from Tax Brackets with its thresholds moved up by inflation, each account grows at
// its rate, loans pay down at their payment, contributions go in, and what is left over
// lands in the account chosen for it — cash, unless said otherwise.

const FP_KINDS = {
    cash: { label: 'Cash', side: 'asset', rate: 2, color: '#56B4E9' },
    investment: { label: 'Investment', side: 'asset', rate: 7, color: '#0072B2', tool: 'dynamic-investment-calculator' },
    retirement: { label: 'Retirement', side: 'asset', rate: 7, color: '#009E73', tool: 'dynamic-investment-calculator' },
    hsa: { label: 'HSA', side: 'asset', rate: 7, color: '#6A3D9A', tool: 'dynamic-investment-calculator' },
    education: { label: 'Education (529)', side: 'asset', rate: 6, color: '#B8860B', tool: 'dynamic-investment-calculator' },
    property: { label: 'Property', side: 'asset', rate: 3, color: '#E69F00' },
    other: { label: 'Other asset', side: 'asset', rate: 0, color: '#CC79A7' },
    loan: { label: 'Loan', side: 'liability', rate: 6.5, color: '#D55E00', tool: 'loan-calculator' },
    credit: { label: 'Credit card', side: 'liability', rate: 22, color: '#A6461A' }
};
// The kinds whose returns are uncertain enough to be shown as a range.
const FP_MARKET = ['investment', 'retirement', 'hsa', 'education'];

function fpDefaultPlan() {
    const returns = {};
    Object.keys(FP_KINDS).forEach(k => { returns[k] = FP_KINDS[k].rate; });
    return { accounts: [], incomes: [], expenses: [], goals: [], tax: { on: true, status: 'single', year: '' }, surplusTo: '',
        assume: { years: 30, inflation: 2.5, real: true, spread: 2, target: 1000000, returns: returns },
        retire: { on: false, birth: '', from: 'age', ageYears: 65, ageMonths: 0, until: 95, spending: null, buffer: 6, avoidPenalty: true, health: false, healthBefore: null, healthAfter: null, medInfl: 5 }, drawOrder: [],
        // Where the next dollar goes: the thresholds its steps use, and how much risk.
        advice: { starter: 1, months: 6, debtRate: 8, risk: 'middle', stocks: 8, bonds: 4, lump: null } };
}

function fpNum(v, fallback) {
    const n = Number(v);
    return v === '' || v === null || v === undefined || !isFinite(n) ? fallback : n;
}

function fpNewId(prefix) {
    return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function fpToolId(el) {
    const tool = el && el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

/** The plan as saved, with anything missing filled from the defaults. */
function fpGet(toolId) {
    const saved = (typeof toolCustomizations !== 'undefined' && toolCustomizations[toolId] && toolCustomizations[toolId].financePlan) || {};
    const plan = fpDefaultPlan();
    ['accounts', 'incomes', 'expenses', 'goals'].forEach(k => { if (Array.isArray(saved[k])) plan[k] = saved[k].filter(x => x && typeof x === 'object').map(x => Object.assign({}, x)); });
    if (saved.tax) plan.tax = Object.assign(plan.tax, saved.tax);
    if (typeof saved.surplusTo === 'string') plan.surplusTo = saved.surplusTo;
    if (saved.retire) plan.retire = Object.assign(plan.retire, saved.retire);
    if (saved.advice) plan.advice = Object.assign(plan.advice, saved.advice);
    if (Array.isArray(saved.drawOrder)) plan.drawOrder = saved.drawOrder.filter(x => x && typeof x.id === 'string').map(x => ({ id: x.id }));
    // Every account that can be drawn from, in the order given and then the usual one —
    // so moving one is moving it in the whole list. One turned off keeps its place.
    plan.drawOrder = fpDrawOrder(plan, true).map(a => ({ id: a.id }));
    if (saved.assume) {
        const r = Object.assign({}, plan.assume.returns, saved.assume.returns || {});
        plan.assume = Object.assign(plan.assume, saved.assume, { returns: r });
    }
    plan.incomes.forEach(l => { if (!Array.isArray(l.into) && l.type !== 'ss' && fpIntoRows(l).length) fpSetInto(l, fpIntoRows(l)); });
    return fpWithEstimates(plan, null);
}

function fpSet(toolId, plan) {
    if (!toolId || typeof saveToolCustomizations !== 'function') return;
    // Estimates are worked out as the plan is read: not kept with it.
    if (Array.isArray(plan.incomes) && plan.incomes.some(l => l && l._est !== undefined)) {
        plan = Object.assign({}, plan, { incomes: plan.incomes.map(l => { if (!l || l._est === undefined) return l; const c = Object.assign({}, l); delete c._est; return c; }) });
    }
    const next = Object.assign({}, toolCustomizations);
    next[toolId] = Object.assign({}, next[toolId] || {}, { financePlan: plan });
    saveToolCustomizations(next);
}

function fpRateOf(plan, a) {
    return fpNum(a.rate, fpNum(plan.assume.returns[a.kind], (FP_KINDS[a.kind] || FP_KINDS.other).rate));
}

/** A closing date as the Loan Calculator reads it, or null. */
function fpClosing(str) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || '');
    return m ? { y: +m[1], m: +m[2] - 1, d: +m[3], date: new Date(+m[1], +m[2] - 1, +m[3]) } : null;
}

/** A loan with the details the Loan Calculator needs to work out its own payment. */
function fpLoanTerms(plan, a) {
    const l = a.loan || {};
    const amount = fpNum(l.amount, 0), years = fpNum(l.years, 0), rate = fpRateOf(plan, a);
    if (FP_KINDS[a.kind] && FP_KINDS[a.kind].tool === 'loan-calculator' && amount > 0 && years > 0 && rate > 0) {
        const r = rate / 100 / 12, n = Math.round(years * 12);
        return { amount: amount, years: years, rate: rate, r: r, n: n, payment: amount * r / (1 - Math.pow(1 + r, -n)),
            extra: Math.max(0, fpNum(l.extra, 0)), closing: fpClosing(l.closing) };
    }
    return null;
}

/** What is owed or held today: as typed, or — for a loan left empty with a closing
 *  date — what its schedule says is owed by now. */
function fpBalanceOf(plan, a) {
    const typed = fpNum(a.balance, null);
    if (typed !== null) return typed;
    const t = fpLoanTerms(plan, a);
    if (t) return t.closing ? loanScheduled(t.amount, t.r, t.payment, loanPaymentsMade(t.closing, t.n)) : t.amount;
    return 0;
}

/** Added a month, or paid a month: for a loan with its details, the payment they
 *  come to and the extra on top, as in the Loan Calculator. */
function fpMonthlyOf(plan, a) {
    const t = fpLoanTerms(plan, a);
    return t ? t.payment + t.extra : Math.max(0, fpNum(a.monthly, 0));
}

/**
 * Escrow paid with a loan: property tax and insurance collected with the payment. It
 * does not pay the loan down, it rises with inflation, and it goes on after the loan is
 * paid off — the tax and the insurance do not stop with the mortgage, they are paid
 * directly instead.
 */
function fpEscrowOf(a) {
    const kind = FP_KINDS[a.kind] || FP_KINDS.other;
    return kind.tool === 'loan-calculator' ? Math.max(0, fpNum((a.loan || {}).escrow, 0)) : 0;
}

/**
 * Pay that goes into an account before it is paid: the part of a line's deductions sent
 * to a 401(k) and the like, and what the employer adds. Both land in the account — they
 * are not spent — and the part from the deductions is still out of take-home, as it is
 * on the pay stub. An account that is gone, or that is a debt, takes nothing; what was
 * meant for it is then a deduction like the rest.
 */
function fpPayrollTarget(plan, line) {
    const rows = fpIntoOf(plan, line).filter(r => r.account);
    return rows.length ? rows[0].account : null;
}

/**
 * Where a pay line's deductions go: one row per account, `{ id, account, amount, match }`
 * in the line's own period — your part and the employer's. A line kept before there could
 * be several has its one account read as a row. Each row comes back with the account it
 * names (null when gone, or a debt) and its amounts a month.
 */
function fpIntoRows(line) {
    if (Array.isArray(line.into)) return line.into.filter(r => r && typeof r === 'object');
    if (line.intoAccount || fpNum(line.intoAmount, 0) || fpNum(line.match, 0)) return [{ id: 'r1', account: line.intoAccount || '', amount: line.intoAmount, match: line.match }];
    return [];
}

function fpIntoOf(plan, line) {
    const accounts = fpEntries(plan.accounts);
    const per = (v) => { const n = Math.max(0, fpNum(v, 0)); return line.every === 'year' ? n / 12 : n; };
    const rows = fpIntoRows(line).map(r => {
        const a = r.account && accounts.find(x => x.id === r.account);
        return { id: r.id, accountId: r.account || '', account: a && (FP_KINDS[a.kind] || FP_KINDS.other).side === 'asset' ? a : null, own: per(r.amount), match: per(r.match) };
    });
    // A match given as a formula — so much of what you put in, up to so much of pay — is
    // worked out from what goes into the 401(k)s, and lands in the first traditional one.
    const m = fpMatchOf(plan, line, rows);
    if (m) {
        rows.forEach(r => { r.match = 0; });
        if (m.into) m.into.match = m.match;
    }
    return rows;
}

/**
 * A pay line's employer match by its formula (`matchRate`% of what you put in, up to
 * `matchCap`% of pay), a month. The pay it counts stops at the year's cap ($360,000), and
 * what you can put in stops at your 401(k) limit — so `reach` is the most the formula can
 * be given, and `best` the match that brings. Null without a formula.
 */
function fpMatchOf(plan, line, rows) {
    const rate = fpNum(line.matchRate, null), cap = fpNum(line.matchCap, null);
    if (rate === null || cap === null || line.type === 'ss') return null;
    rows = rows || fpIntoOf(Object.assign({}, plan), Object.assign({}, line, { matchRate: null }));
    const k = rows.filter(r => r.account && r.account.kind === 'retirement' && r.account.planType !== 'ira');
    const own = k.reduce((s, r) => s + r.own, 0);
    const L = typeof taxRulesFor === 'function' ? taxRulesFor(plan.tax.year).limits : null;
    const pay = L ? Math.min(fpMonthly(line), L.compCap / 12) : fpMonthly(line);
    const room = pay * Math.max(0, cap) / 100;
    // What the limit leaves for this line: the year's, less what goes in otherwise.
    const into = k.find(r => r.account.tax !== 'roth') || k[0] || null;
    const groupKey = into ? fpLimitGroup(into.account) : '401k';
    const left = L ? Math.max(0, fpGroupLimit(plan, groupKey).limit / 12 - fpGroupOwn(plan, groupKey, line)) : Infinity;
    const reach = Math.min(room, left);
    const r = Math.max(0, rate) / 100;
    return { rate: rate, cap: cap, own: own, room: room, reach: reach, limited: reach < room - 0.5, odd: cap > 25,
        match: Math.min(own, room) * r, full: room * r, best: reach * r, into: into };
}

/** The household's birth year — the retirement birth month's, or a Social Security
 *  line's — or null. */
function fpBirthYear(plan) {
    const b = fpBirthOf(plan);
    return b ? b.y : null;
}

/** The household's birth month, { y, m } (m from 0) — Retirement's, or the first Social
 *  Security line's — or null. Every age the plan shows is counted from it. */
function fpBirthLine(plan) {
    const has = (l) => l.type === 'ss' && l.birth;
    return fpEntries((plan && plan.incomes) || []).find(has) || fpAllEntries((plan && plan.incomes) || []).find(has);
}

function fpBirthOf(plan) {
    const ss = fpBirthLine(plan);
    const m = /^(\d{4})-(\d{2})$/.exec(((plan && plan.retire) || {}).birth || (ss ? ss.birth : '') || '');
    return m ? { y: +m[1], m: +m[2] - 1 } : null;
}

/** The age, in whole years, in the month of `date` — or null without a birth month. */
function fpAgeAt(plan, date) {
    const b = fpBirthOf(plan);
    return b && date ? Math.floor(((date.getFullYear() * 12 + date.getMonth()) - (b.y * 12 + b.m)) / 12) : null;
}

/** A month, with the age then when it is known: "Feb 2046, at 61". `b` wraps the month
 *  (in bold, say) and leaves the age as it is. */
function fpWhen(plan, date, b) {
    const text = date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    const age = fpAgeAt(plan, date);
    return (b ? b(text) : text) + (age === null ? '' : ', at ' + age);
}

/** The month `t` of a projection from `start` (1 is the first). */
function fpMonthAt(start, t) {
    return new Date(start.getFullYear(), start.getMonth() + t - 1, 1);
}

/**
 * What goes into a retirement account this year from pay and of its own, against the
 * year's limit for its kind of plan: the employer's match is not counted, and catch-up
 * amounts are added from the age reached by the end of the year, when it is known.
 */
function fpLimitCheck(plan, a) {
    const groupKey = fpLimitGroup(a);
    if (!groupKey || typeof taxRulesFor !== 'function') return null;
    const rules = taxRulesFor(plan.tax.year);
    const L = rules.limits;
    const ira = groupKey === 'ira', hsa = groupKey === 'hsa';
    // One limit for the person across every account of the kind: a 401(k) and a Roth
    // 401(k) share theirs, a traditional and a Roth IRA theirs; a 457(b) and an HSA each
    // their own. An HSA's counts the employer's money too.
    const now = fpPayrollNow(plan);
    const group = fpEntries(plan.accounts).filter(x => fpLimitGroup(x) === groupKey);
    const inOf = (x) => (Math.max(0, fpNum(x.monthly, 0)) + (now[x.id] ? now[x.id].own + (hsa ? now[x.id].match : 0) : 0)) * 12;
    const paying = group.filter(x => inOf(x) > 0);
    const yearly = paying.reduce((s, x) => s + inOf(x), 0);
    const rothYearly = paying.filter(x => x.tax === 'roth' && ira).reduce((s, x) => s + inOf(x), 0);
    if (yearly <= 0) return null;
    const lim = fpGroupLimit(plan, groupKey, group);
    let limit = lim.limit;
    // A Roth IRA's limit shrinks over the year's income range, to nothing above it — as the
    // IRS rounds it, up to the next $10. Income here is the plan's pay and other taxed
    // income now, less what goes pre-tax into a 401(k): close to modified AGI.
    let phase = null, rothLimit = limit;
    if (ira && rothYearly > 0) {
        const married = plan.tax && plan.tax.status === 'married';
        const from = married ? L.rothMarriedFrom : L.rothSingleFrom, to = married ? L.rothMarriedTo : L.rothSingleTo;
        const ym = fpYm(new Date());
        const magi = fpEntries(plan.incomes).filter(l => l.type !== 'ss' && l.taxed !== false && fpActive(l, ym)).reduce((s, l) => s + (fpMonthly(l) - fpPretaxPay(plan, l)) * 12, 0);
        if (magi > from) {
            const cut = magi >= to ? 0 : Math.ceil(limit * (to - magi) / (to - from) / 10) * 10;
            phase = { magi: magi, from: from, to: to, full: limit };
            rothLimit = Math.max(magi >= to ? 0 : 200, cut);
        }
    }
    // A 401(k)'s whole year — yours and the employer's — has its own ceiling.
    const total = groupKey === '401k' ? paying.reduce((s, x) => s + inOf(x) + (now[x.id] ? now[x.id].match * 12 : 0), 0) : null;
    const over415 = total !== null && total > L.total415 + 0.5;
    return { key: groupKey, group: FP_GROUP_NAMES[groupKey], names: paying.map(x => x.name || fpKindLabel(x)), year: rules.year, yearly: yearly, limit: limit, catchUp: lim.catchUp, age: lim.age, ira: ira,
        rothYearly: rothYearly, rothLimit: rothLimit, phase: phase, total: total, total415: L.total415, over415: over415,
        over: yearly > limit + 0.5 || (!!phase && rothYearly > rothLimit + 0.5) || over415 };
}

/** The year's limit for a group of accounts, with the catch-up the household's age brings. */
function fpGroupLimit(plan, groupKey, group) {
    const L = taxRulesFor(plan.tax.year).limits;
    const by = fpBirthYear(plan);
    const age = by === null ? null : new Date().getFullYear() - by;
    let base, catchUp = 0;
    if (groupKey === 'hsa') {
        const family = (group || fpEntries(plan.accounts).filter(x => x.kind === 'hsa')).some(x => x.hsaCover === 'family');
        base = family ? L.hsaFamily : L.hsaSelf;
        catchUp = age !== null && age >= 55 ? L.hsaCatchUp : 0;
    } else if (groupKey === 'ira') {
        base = L.ira;
        catchUp = age !== null && age >= 50 ? L.iraCatchUp : 0;
    } else {
        base = L.k401;
        catchUp = age === null || age < 50 ? 0 : age >= 60 && age <= 63 ? L.k401CatchUp6063 : L.k401CatchUp;
    }
    return { limit: base + catchUp, catchUp: catchUp, age: age };
}

/** Your own money a month into a group's accounts: pay (every line but `except`) and the
 *  accounts' own amounts — without the employer's. */
function fpGroupOwn(plan, groupKey, except) {
    const ym = fpYm(new Date());
    const accounts = fpEntries(plan.accounts).filter(x => fpLimitGroup(x) === groupKey);
    let own = accounts.reduce((s, x) => s + Math.max(0, fpNum(x.monthly, 0)), 0);
    fpEntries(plan.incomes).forEach(l => {
        if (l === except || (except && l.id === except.id) || l.type === 'ss' || !fpActive(l, ym)) return;
        fpIntoRows(l).forEach(r => {
            if (accounts.some(x => x.id === r.account)) own += Math.max(0, fpNum(r.amount, 0)) / (l.every === 'year' ? 12 : 1);
        });
    });
    return own;
}

/** The limit, said: in a detail row, the facts and the summary. */
function fpLimitText(c, name) {
    name = name === undefined ? c.names.join(' and ') : name;
    const catchUp = c.catchUp ? ' with catch-up' : c.age === null ? ' (no catch-up without a birth month)' : '';
    const overAll = c.yearly > c.limit + 0.5;
    let text = (name ? name + ': ' : '') + fpMoney(c.yearly) + ' a year goes in' + (overAll ? ', over the ' : ', within the ') + c.year + ' ' + c.group + ' limit of ' + fpMoney(c.limit) + catchUp;
    if (c.over415) text += '; with the employer’s, ' + fpMoney(c.total) + ', over the ' + fpMoney(c.total415) + ' a 401(k) can take in a year';
    if (c.phase) text += '; the Roth part, ' + fpMoney(c.rothYearly) + ', ' + (c.rothYearly > c.rothLimit + 0.5 ? 'is over' : 'is within') + ' the Roth IRA limit' +
        (c.rothLimit === 0 ? ' — none, with income of ' + fpMoney(c.phase.magi) + ' above ' + fpMoney(c.phase.to)
            : ' of ' + fpMoney(c.rothLimit) + ', cut from ' + fpMoney(c.phase.full) + ' for income of ' + fpMoney(c.phase.magi) + ', between ' + fpMoney(c.phase.from) + ' and ' + fpMoney(c.phase.to));
    return text;
}

function fpPayrollMonthlyOf(plan, a) {
    const n = fpPayrollNow(plan)[a.id];
    return n ? n.own + n.match : 0;
}

/** This month's pay into each account, from the lines running now: { id: { own, match } }. */
function fpPayrollNow(plan) {
    const ym = fpYm(new Date()), out = {};
    fpEntries(plan.incomes).forEach(l => {
        if (l.type === 'ss' || !fpActive(l, ym)) return;
        fpIntoOf(plan, l).forEach(r => {
            if (!r.account) return;
            const o = out[r.account.id] || (out[r.account.id] = { own: 0, match: 0 });
            o.own += r.own;
            o.match += r.match;
        });
    });
    return out;
}

/** Monthly equivalent of one of a line's amounts, in the line's own period. */
function fpPerMonth(line, field) {
    const n = fpNum(line[field], 0);
    return line.every === 'year' ? n / 12 : n;
}

/** Taxes typed on an income line — paid as typed, and the line kept out of the federal
 *  estimate so they are not counted twice. */
function fpHasTypedTax(line) {
    return fpNum(line.taxes, null) !== null;
}

/** Monthly equivalent of an income or expense line. */
function fpMonthly(line) {
    if (line.type === 'ss') { const s = fpSSInfo(line); return s ? s.monthlyToday : 0; }
    const n = fpNum(line.amount, 0);
    return line.every === 'year' ? n / 12 : n;
}

function fpActive(line, ym) {
    if (line.type === 'ss') { const s = fpSSInfo(line); return !!s && s.startYm <= ym && (!line.to || ym <= line.to); }
    return (!line.from || line.from <= ym) && (!line.to || ym <= line.to);
}

// ---- Social Security ---------------------------------------------------------------------
//
// A benefit as the SSA works it out: the amount at full retirement age, from the
// statement on ssa.gov in today's dollars, made smaller for each month it is claimed
// before that age and larger for each month after, up to 70. It is paid from the month
// the claiming age is reached and rises by a cost-of-living increase each year — the
// line's growth, inflation unless said otherwise.

/** Full retirement age, in months, for a birth year: 65 up to 1937, two months more a
 *  year to 66 for 1943–54, two more a year again from 1955 to 67 for 1960 and later. */
function fpFullRetirementMonths(birthYear, ss) {
    const rows = (ss && ss.fra ? ss : taxRulesFor('').socialSecurity).fra;
    let row = rows[0];
    rows.forEach(r => { if (r.from <= birthYear) row = r; });
    return Math.round(row.years * 12 + row.months);
}

/** What claiming `claim` months old does to the benefit at full retirement age `fra`:
 *  5/9 of 1% less a month for the first 36 months early, 5/12 of 1% for each month
 *  before those; 2/3 of 1% more a month late, until 70. */
function fpClaimFactor(fra, claim, ss) {
    ss = ss && ss.fra ? ss : taxRulesFor('').socialSecurity;
    claim = Math.max(ss.earliest * 12, Math.min(ss.latest * 12, claim));
    if (claim < fra) {
        const early = fra - claim;
        return Math.max(0, 1 - (Math.min(early, ss.earlyMonths) * ss.early + Math.max(0, early - ss.earlyMonths) * ss.earlyMore) / 100);
    }
    return 1 + (claim - fra) * ss.delayed / 100;
}

/**
 * A Social Security benefit at full retirement age estimated from pay, as the SSA works
 * it out: each year's earnings up to the wage base, the best 35 years averaged a month,
 * and the year's formula (Tax & Retirement Rules) applied. The plan knows today's pay, not
 * the past, so earlier years from `workFrom` (22 unless said) are `pastPay` a year, or
 * today's pay; later years are the pay lines that count, as long as they run — to
 * `stopDate` if given (stopping work: all of it stops), otherwise as the plan has them
 * (Retirement ends pay without an end of its own). Amounts in today's dollars, pay
 * growing by what it grows above inflation. Spousal and survivor benefits are not in it.
 * Returns { pia, aime, years, payNow } — or null without a birth month, or any pay.
 */
function fpSSEstimate(plan, line, stopDate) {
    const m = /^(\d{4})-(\d{2})$/.exec(line.birth || '');
    if (!m || typeof taxRulesFor !== 'function') return null;
    const by = +m[1];
    const rules = taxRulesFor('');
    const ss = rules.socialSecurity, cap = rules.payroll.wageBase;
    const incomes = fpEntries(plan.incomes);
    const pay = fpSSPayOf(plan, line);
    const pastTyped = fpNum(line.pastPay, null);
    if (!pay.length && pastTyped === null) return null;
    const infl = fpNum((plan.assume || {}).inflation, 0) / 100;
    const now = new Date(), y0 = now.getFullYear(), m0 = now.getMonth();
    // Pay today, for the years behind: a job yet to start was not paid then.
    const running = pay.filter(l => fpActive(l, fpYm(now)));
    const payNow = (running.length ? running : pay).reduce((s, l) => s + fpMonthly(l), 0) * 12;
    const past = pastTyped === null ? payNow : pastTyped;
    const from = Math.round(fpNum(line.workFrom, 22));
    const r = plan.retire && plan.retire.on && fpBirthOf(plan) ? fpRetireInfo(Object.assign({}, plan, { incomes: fpAllEntries(plan.incomes), accounts: fpEntries(plan.accounts || []), expenses: [] })) : null;
    const retDate = r && !r.missing ? r.date : null;
    const years = [];
    for (let Y = by + from; Y <= by + 70; Y++) {
        let e = 0;
        for (let mo = 0; mo < 12; mo++) {
            if (Y < y0 || (Y === y0 && mo < m0)) { e += past / 12; continue; }
            const d = new Date(Y, mo, 1);
            if (stopDate && d >= stopDate) break;
            const ym = fpYm(d), yrs = (Y - y0) + (mo - m0) / 12;
            pay.forEach(l => {
                if (!fpActive(l, ym)) return;
                if (!stopDate && retDate && d >= retDate && !l.to) return;
                e += fpMonthly(l) * Math.pow((1 + fpNum(l.growth, infl * 100) / 100) / (1 + infl), yrs);
            });
        }
        years.push(Math.min(e, cap));
    }
    years.sort((a, b) => b - a);
    const aime = years.slice(0, 35).reduce((s, v) => s + v, 0) / 420;
    const pia = Math.min(aime, ss.bend1) * ss.pct1 / 100 + Math.max(0, Math.min(aime, ss.bend2) - ss.bend1) * ss.pct2 / 100 + Math.max(0, aime - ss.bend2) * ss.pct3 / 100;
    return { pia: pia, aime: aime, years: Math.min(35, years.filter(v => v > 0).length), payNow: payNow };
}

/** The pay a Social Security line's estimate counts: the lines chosen for it, or — with
 *  one Social Security line in the plan — all pay from work. */
function fpSSPayOf(plan, line) {
    const incomes = fpEntries(plan.incomes);
    if (Array.isArray(line.payFrom)) return incomes.filter(l => l.type !== 'ss' && line.payFrom.includes(l.id));
    return incomes.filter(l => l.type === 'ss').length === 1 ? incomes.filter(l => l.type !== 'ss' && l.wages !== false) : [];
}

/** Each Social Security line without a statement amount, given its estimate (`_est`) —
 *  to `stopDate`, or as the plan has it. Kept on the plan as it is read, never saved. */
function fpWithEstimates(plan, stopDate) {
    if (!Array.isArray(plan.incomes) || !plan.incomes.some(l => l && l.type === 'ss')) return plan;
    return Object.assign({}, plan, { incomes: plan.incomes.map(l => l && l.type === 'ss' && fpNum(l.fraBenefit, null) === null
        ? Object.assign({}, l, { _est: fpSSEstimate(plan, l, stopDate || null) }) : l) });
}

/** A Social Security line, worked out — or null without a birth month and a benefit: the
 *  amount from the statement, or else the estimate from pay. */
function fpSSInfo(line) {
    const m = /^(\d{4})-(\d{2})$/.exec(line.birth || '');
    const typed = fpNum(line.fraBenefit, null);
    const benefit = typed !== null ? typed : line._est ? line._est.pia : 0;
    if (!m || benefit <= 0) return null;
    const by = +m[1], bm = +m[2] - 1;
    const ss = taxRulesFor('').socialSecurity;
    const fra = fpFullRetirementMonths(by, ss);
    const claim = Math.max(ss.earliest * 12, Math.min(ss.latest * 12, Math.round(fpNum(line.claimYears, 67) * 12 + fpNum(line.claimMonths, 0))));
    const factor = fpClaimFactor(fra, claim, ss);
    const start = new Date(by, bm + claim, 1);
    return { fra: fra, claim: claim, factor: factor, start: start, startYm: fpYm(start), monthlyToday: benefit * factor, benefit: benefit, estimated: typed === null, est: line._est || null };
}

function fpAgeText(months) {
    return Math.floor(months / 12) + (months % 12 ? ' and ' + (months % 12) + (months % 12 === 1 ? ' month' : ' months') : '');
}

// ---- Sections ------------------------------------------------------------------------------
//
// A list's sections are heading rows in the list itself, { id, type: 'section', name,
// folded }: an entry belongs to the heading above it, so ordering, moving and undo are
// the list's own. Entries above the first heading belong to none. The sums never see
// the headings — they group and total, and nothing else.

function fpIsSection(x) { return !!x && x.type === 'section'; }

function fpEntries(list) { return (list || []).filter(x => x && !fpIsSection(x) && !x.off); }
/** The same with the lines turned off: what the tables show, not what the plan counts. */
function fpAllEntries(list) { return (list || []).filter(x => x && !fpIsSection(x)); }

/** The plan with only its entries, for the sums. */
function fpCalc(plan) {
    if (!plan || plan._calc) return plan;
    // A Social Security line turned off still says when you were born.
    const ss = fpBirthLine(plan);
    const retire = ss && ss.off && plan.retire && !plan.retire.birth ? Object.assign({}, plan.retire, { birth: ss.birth }) : plan.retire;
    return Object.assign({}, plan, { accounts: fpEntries(plan.accounts), incomes: fpEntries(plan.incomes).map(l => fpLiveLine(plan, l)), expenses: fpEntries(plan.expenses), goals: fpEntries(plan.goals || []), retire: retire, _calc: true });
}

/** A pay line as it counts: what it sends to an account turned off stays in take-home, so
 *  it comes off the deductions too. The line as saved keeps it, for the account coming back. */
function fpLiveLine(plan, line) {
    const off = fpAllEntries(plan.accounts).filter(a => a.off).map(a => a.id);
    const rows = line.type === 'ss' ? [] : fpIntoRows(line);
    const gone = rows.filter(r => off.includes(r.account));
    if (!gone.length) return line;
    return Object.assign({}, line, { deductions: Math.max(0, fpNum(line.deductions, 0) - gone.reduce((s, r) => s + Math.max(0, fpNum(r.amount, 0)), 0)), into: rows.filter(r => !gone.includes(r)) });
}

/** The lines turned off, by name, for what is read away from the tables. */
function fpOffNames(plan) {
    return ['accounts', 'incomes', 'expenses', 'goals'].reduce((out, k) => out.concat(fpAllEntries(plan[k]).filter(x => x.off).map(x => x.name || 'Unnamed')), []);
}

/** Each section of a list with its entries, in order; the unsectioned first, under null. */
function fpSectionsOf(list) {
    const out = [{ section: null, entries: [] }];
    (list || []).forEach(x => {
        if (fpIsSection(x)) out.push({ section: x, entries: [] });
        else out[out.length - 1].entries.push(x);
    });
    return out;
}

/** A section's totals, in words. Accounts: what is held, owed and the two netted, and
 *  what goes in and is paid a month. Income and expenses: a month and a year, of the
 *  lines running now. */
function fpSectionTotal(plan, list, entries) {
    entries = entries.filter(x => !x.off).map(x => list === 'incomes' ? fpLiveLine(plan, x) : x);
    if (list === 'accounts') {
        let held = 0, owed = 0, inn = 0, paid = 0;
        const fromPay = fpPayrollNow(plan);
        entries.forEach(a => {
            if (fromPay[a.id]) inn += fromPay[a.id].own + fromPay[a.id].match;
            const liab = (FP_KINDS[a.kind] || FP_KINDS.other).side === 'liability';
            const b = fpBalanceOf(plan, a), m = fpMonthlyOf(plan, a) + fpEscrowOf(a);
            if (liab) { owed += b; paid += m; } else { held += b; inn += m; }
        });
        const bits = [];
        if (held) bits.push('Held ' + fpMoney(held));
        if (owed) bits.push('Owed ' + fpMoney(owed));
        if (held && owed) bits.push('Net ' + fpMoney(held - owed));
        if (inn) bits.push(fpMoney(inn) + '/mo in');
        if (paid) bits.push(fpMoney(paid) + '/mo paid');
        return { text: bits.join(' · ') || 'Nothing in it yet', held: held, owed: owed, monthlyIn: inn, monthlyPaid: paid };
    }
    if (list === 'goals') {
        const total = entries.reduce((s, g) => s + fpGoalToday(g), 0);
        return { text: entries.length ? fpMoney(total) + ' in today’s dollars' : 'Nothing in it yet', today: total };
    }
    const ym = fpYm(new Date());
    const running = entries.filter(l => fpActive(l, ym));
    const monthly = running.reduce((s, l) => s + fpMonthly(l), 0);
    if (!entries.length) return { text: 'Nothing in it yet', monthly: 0 };
    if (list === 'incomes') {
        // Take-home of what is typed; the federal estimate is the household's, not a
        // section's, so a section with estimated lines says its net is before it.
        const out = running.reduce((s, l) => s + fpPerMonth(l, 'deductions') + (fpHasTypedTax(l) ? fpPerMonth(l, 'taxes') : 0), 0);
        const estimated = plan.tax && plan.tax.on && running.some(l => !fpHasTypedTax(l) && l.taxed !== false);
        if (out || estimated) return { text: fpMoney(monthly) + ' / mo · take-home ' + fpMoney(monthly - out) + ' / mo' + (estimated ? ' before estimated tax' : '') +
            ' · ' + fpMoney((monthly - out) * 12) + ' / yr', monthly: monthly, net: monthly - out };
    }
    return { text: fpMoney(monthly) + ' / mo · ' + fpMoney(monthly * 12) + ' / yr', monthly: monthly };
}

/** Where the surplus goes: the account chosen, or the first cash account. */
function fpSurplusAccount(plan) {
    plan = fpCalc(plan);
    if (plan.surplusTo && plan.accounts.some(a => a.id === plan.surplusTo)) return plan.surplusTo;
    const cash = plan.accounts.find(a => a.kind === 'cash');
    return cash ? cash.id : '';
}

/** What the plan's taxes are worked out from: the year's brackets and deduction for the
 *  filing status, and the other rules — or null when neither federal nor payroll tax is
 *  estimated. Payroll tax follows the federal estimate unless set on its own. */
function fpTaxInfo(plan) {
    if (!plan.tax || typeof taxRulesFor !== 'function') return null;
    const rules = taxRulesFor(plan.tax.year);
    const status = TAX_STATUSES[plan.tax.status] ? plan.tax.status : 'single';
    const year = taxRulesCache.table.years[rules.year] || {};
    const st = year[status] || year.single;
    const federal = !!plan.tax.on && !!st;
    const payroll = plan.tax.payroll === undefined || plan.tax.payroll === null ? !!plan.tax.on : !!plan.tax.payroll;
    if (!federal && !payroll) return null;
    return { federal: federal, payroll: payroll, year: rules.year, status: status,
        deduction: st ? fpNum(st.deduction, 0) : 0, brackets: st ? taxBracketsFor(st) : [],
        capGains: rules.capGains[status], ssTax: rules.ssTax[status], pay: rules.payroll,
        surtaxFrom: status === 'married' ? rules.payroll.surtaxMarried : rules.payroll.surtaxSingle };
}

/**
 * How much of a year's Social Security benefits is taxable, by the IRS worksheet: half the
 * benefits plus the other income, against the two amounts — nothing below the first, up
 * to half the benefits between them, up to 85% above the second. The amounts are fixed
 * in law, so they are not moved up with inflation.
 */
function fpSSTaxable(th, benefits, other) {
    if (!th || benefits <= 0) return 0;
    const provisional = Math.max(0, other) + benefits / 2;
    if (provisional <= th.half) return 0;
    if (provisional <= th.most) return Math.min(benefits / 2, (provisional - th.half) / 2);
    return Math.min(0.85 * benefits, 0.85 * (provisional - th.most) + Math.min(benefits / 2, (th.most - th.half) / 2));
}

/**
 * Federal income tax on a year: `ordinary` income, Social Security `benefits` (the
 * taxable part worked out from the rest) and long-term `gains`, taxed at their own
 * rates on top of the ordinary income. The deduction comes off ordinary income first.
 * Every bracket and the deduction are moved up by `index` (inflation since now).
 */
function fpFederalTax(info, ordinary, benefits, gains, index) {
    if (!info || !info.federal) return 0;
    gains = Math.max(0, gains || 0);
    index = index || 1;
    const ord = Math.max(0, ordinary) + fpSSTaxable(info.ssTax, benefits || 0, Math.max(0, ordinary) + gains);
    const ded = info.deduction * index;
    const ordTaxable = Math.max(0, ord - ded);
    const top = ordTaxable + Math.max(0, gains - Math.max(0, ded - ord));
    let tax = 0;
    info.brackets.forEach(b => {
        const lo = b.min * index, hi = b.max * index;
        if (ordTaxable > lo) tax += (Math.min(ordTaxable, hi) - lo) * b.rate;
    });
    (info.capGains || []).forEach(b => {
        const lo = Math.max(b.min * index, ordTaxable), hi = Math.min(b.max * index, top);
        if (hi > lo) tax += (hi - lo) * b.rate;
    });
    return tax;
}

/** Federal tax on a year's ordinary income alone. */
function fpTaxWith(info, annual, index) {
    return annual > 0 ? fpFederalTax(info, annual, 0, 0, index) : 0;
}

/**
 * Payroll tax on a year's pay, `wages` a year for each pay line — each taken as one
 * person's job, so each has its own wage base. Medicare has no cap, and its surtax is on
 * the household's pay above the threshold, which is fixed in law. The wage base moves
 * up by `index`, as it does with average wages.
 */
function fpPayrollTax(info, wages, index) {
    if (!info || !info.payroll) return 0;
    const p = info.pay;
    let tax = 0, all = 0;
    wages.forEach(w => {
        if (w <= 0) return;
        tax += Math.min(w, p.wageBase * (index || 1)) * p.ssRate / 100 + w * p.medicare / 100;
        all += w;
    });
    return tax + Math.max(0, all - info.surtaxFrom) * p.surtax / 100;
}

/** Pay into an account that lowers income tax: into a pre-tax retirement account. */
function fpPretaxPay(plan, line) {
    return fpIntoOf(plan, line).filter(r => r.account && (fpIsPretax(r.account) || r.account.kind === 'hsa')).reduce((s, r) => s + r.own, 0);
}

/** An investment account's cost basis today: as typed, or — left empty — all of it, so
 *  nothing drawn is a gain. */
function fpBasisOf(plan, a) {
    const b = fpNum(a.basis, null);
    return b === null ? Math.max(0, fpBalanceOf(plan, a)) : Math.max(0, b);
}

function fpIncomeTax(plan, annual, index) {
    return fpTaxWith(fpTaxInfo(plan), annual, index);
}

// ---- Retirement: spending it down -----------------------------------------------------------
//
// From the retirement month, pay stops (Social Security and lines with an end of their
// own go on), so do contributions, and one spending figure takes the place of Expenses.
// Each month the cash account is kept at its buffer — months of spending — by drawing,
// in the order given, from the other accounts. Pre-tax withdrawals are income for the
// federal estimate, and so is the gain in what is drawn from an investment account
// given a cost basis, at the capital-gains rates; enough more is drawn to pay that tax
// too. Roth money, cash, and investments without a basis are drawn as they are. From 73 (75 for those born in 1960 or later) pre-tax
// accounts pay out at least the IRS minimum each year, and what is not needed goes to
// cash. Drawing pre-tax money before 59½ is said, not modelled: the 10% penalty
// (both, and the ages, are the rules in Tax & Retirement Rules)
// depends on exceptions the plan does not know.

/** The IRS Uniform Lifetime table: what a pre-tax balance is divided by, by age. */
const FP_RMD_FACTORS = { 72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5,
    83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9,
    96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9, 105: 4.6, 106: 4.3, 107: 4.1, 108: 3.9,
    109: 3.7, 110: 3.5, 111: 3.4, 112: 3.3, 113: 3.1, 114: 3.0, 115: 2.9, 116: 2.8, 117: 2.7, 118: 2.5, 119: 2.3, 120: 2.0 };

function fpRmdAge(birthYear, w) {
    const rows = (w && w.rmdStart ? w : taxRulesFor('').withdraw).rmdStart;
    let row = rows[0];
    rows.forEach(r => { if (r.from <= birthYear) row = r; });
    return row.age;
}

/** The divisor for an age: its own, or the nearest age below with one (the first, below them all). */
function fpRmdFactor(age, w) {
    const table = (w && w.rmdTable ? w : taxRulesFor('').withdraw).rmdTable;
    const ages = Object.keys(table).map(Number).sort((a, b) => a - b);
    let at = ages[0];
    ages.forEach(a => { if (a <= age) at = a; });
    return table[at];
}

/** An age in months, short: 59½, 65, or 66 and 2 months. */
function fpAgeShort(months) {
    return months % 12 === 6 ? Math.floor(months / 12) + '½' : fpAgeText(months);
}

/** The four kinds of retirement account: by plan (`planType`) and by tax (`tax`). */
const FP_RET_TYPES = { '401k:pretax': '401(k)', '401k:roth': 'Roth 401(k)', '457:pretax': '457(b)', '457:roth': 'Roth 457(b)', 'ira:pretax': 'Traditional IRA', 'ira:roth': 'Roth IRA' };

/** Which of them an account is — an account kept before they were told apart is a 401(k). */
function fpRetKey(a) {
    return (a.planType === 'ira' || a.planType === '457' ? a.planType : '401k') + ':' + (a.tax === 'roth' ? 'roth' : 'pretax');
}

/** Which contribution limit an account counts toward: '401k' (403(b) and the like), '457',
 *  'ira' or 'hsa' — or null for an account without one. */
function fpLimitGroup(a) {
    if (a.kind === 'hsa') return 'hsa';
    if (a.kind !== 'retirement') return null;
    return a.planType === 'ira' || a.planType === '457' ? a.planType : '401k';
}

const FP_GROUP_NAMES = { '401k': '401(k)', '457': '457(b)', ira: 'IRA', hsa: 'HSA' };

/** An account's kind in words: its retirement type, or its kind's label. */
function fpKindLabel(a) {
    return a.kind === 'retirement' ? FP_RET_TYPES[fpRetKey(a)] : (FP_KINDS[a.kind] || FP_KINDS.other).label;
}

function fpIsPretax(a) {
    return a.kind === 'retirement' && a.tax !== 'roth';
}

function fpIsRoth(a) {
    return a.kind === 'retirement' && a.tax === 'roth';
}

/** The job that ends last, `line`, for a retirement that goes by it — or, where a job has no
 *  end, that job as `open`. Part-time or bridge work holds nothing back; a pension or rent
 *  is not a job. */
function fpLastJob(plan) {
    const jobs = fpEntries(plan.incomes).filter(l => l.type !== 'ss' && l.wages !== false && !l.bridge && fpNum(l.amount, 0) > 0);
    const open = jobs.find(l => !l.to);
    if (open || !jobs.length) return { line: null, open: open || null };
    return { line: jobs.reduce((a, b) => b.to > a.to ? b : a), open: null };
}

/** When retirement starts and how long the plan runs, from the birth month — the plan's
 *  own, or the first Social Security line's — or null when it is off or cannot be told.
 *  It starts at the age given or, told to go by the job, the month after the last one ends;
 *  a job with no end falls back on the age. */
function fpRetireInfo(plan) {
    const r = plan.retire || {};
    if (!r.on) return null;
    const ss = fpBirthLine(plan);
    const birth = r.birth || (ss ? ss.birth : '');
    const m = /^(\d{4})-(\d{2})$/.exec(birth || '');
    if (!m) return { missing: 'birth' };
    const by = +m[1], bm = +m[2] - 1;
    const job = r.from === 'job' ? fpLastJob(plan) : null;
    const ended = job && job.line ? job.line.to.split('-').map(Number) : null;
    const at = ended ? ended[0] * 12 + ended[1] - (by * 12 + bm) : Math.round(fpNum(r.ageYears, 65) * 12 + fpNum(r.ageMonths, 0));
    const until = Math.max(Math.ceil(at / 12) + 1, Math.round(fpNum(r.until, 95)));
    const date = new Date(by, bm + at, 1);
    return { birthYear: by, birthMonth: bm, birth: birth, atMonths: at, job: job, date: date, ym: fpYm(date), until: until, end: new Date(by, bm + until * 12, 1),
        rmdAge: fpRmdAge(by), early: taxRulesFor('').withdraw.early, penalty: taxRulesFor('').withdraw.penalty, sepAge: taxRulesFor('').withdraw.sepAge, hsaAge: taxRulesFor('').withdraw.hsaAge, hsaPenalty: taxRulesFor('').withdraw.hsaPenalty, ageAt: (d) => (d.getFullYear() * 12 + d.getMonth()) - (by * 12 + bm) };
}

/** Spending in retirement, a month in today's dollars: as typed, or today's expenses. */
function fpRetireSpending(plan) {
    const typed = fpNum((plan.retire || {}).spending, null);
    if (typed !== null) return typed;
    const ym = fpYm(new Date());
    return fpEntries(plan.expenses).filter(l => fpActive(l, ym)).reduce((s, l) => s + fpMonthly(l), 0);
}

// ---- Goals -------------------------------------------------------------------------------
//
// A big cost ahead — college, a car, a wedding, a new roof — as a line of its own rather
// than an expense: expenses give way to the spending figure once retired, a goal is paid
// whenever it falls. Its cost is in today's dollars, a year at a time or in all, over one
// year or several, paid at the start of each; it rises by its own rate (inflation where
// none is given) to when it is paid. It comes from the account chosen for it — a 529, a
// savings account — and what that cannot cover, from cash and then savings in the
// withdrawal order, as any shortfall is.

/** The accounts a goal can be paid from: what is held, not property. */
function fpCanPayGoal(a) {
    return (FP_KINDS[a.kind] || FP_KINDS.other).side === 'asset' && a.kind !== 'property';
}

/** The account a goal is paid from, or null for cash and then savings. */
function fpGoalAccount(plan, g) {
    return g.account ? fpEntries(plan.accounts).find(a => a.id === g.account && fpCanPayGoal(a)) || null : null;
}

/** How many payments a goal makes: one a year, 1 to 20. */
function fpGoalYears(g) {
    return Math.max(1, Math.min(20, Math.round(fpNum(g.years, 1))));
}

/** A goal's whole cost, in today's dollars. */
function fpGoalToday(g) {
    const cost = Math.max(0, fpNum(g.cost, 0));
    return g.every === 'year' ? cost * fpGoalYears(g) : cost;
}

/** A goal's payments, [{ t, amount, today }], by the projection's month count from
 *  `start` (1: this month): in dollars then, and in today's. Those already past are left
 *  out. */
function fpGoalPayments(plan, g, start) {
    const cost = Math.max(0, fpNum(g.cost, 0));
    const m = /^(\d{4})-(\d{2})$/.exec(g.from || '');
    if (!cost || !m) return [];
    const n = fpGoalYears(g);
    const each = g.every === 'year' ? cost : cost / n;
    const rate = fpNum(g.growth, fpNum(plan.assume.inflation, 0)) / 100;
    const t0 = (+m[1] - start.getFullYear()) * 12 + (+m[2] - 1 - start.getMonth()) + 1;
    const out = [];
    for (let k = 0; k < n; k++) {
        const t = t0 + 12 * k;
        if (t >= 1) out.push({ t: t, amount: each * Math.pow(1 + rate, (t - 1) / 12), today: each });
    }
    return out;
}

/**
 * For each goal paid from an account of its own (not the one the month's leftover goes
 * to), what more a month into that account from now would cover it in full: 0 when it is
 * covered already. Found by halving the gap, the plan run to the goal's last payment.
 */
function fpGoalSaving(plan) {
    plan = fpCalc(plan);
    const out = {};
    const into = fpSurplusAccount(plan);
    const now = new Date(), start = new Date(now.getFullYear(), now.getMonth(), 1);
    plan.goals.forEach(g => {
        const acct = fpGoalAccount(plan, g);
        const pays = fpGoalPayments(plan, g, start);
        if (!acct || acct.id === into || !pays.length) return;
        const endT = pays[pays.length - 1].t;
        const short = (x) => {
            const extra = {};
            extra[acct.id] = x;
            const o = fpProject(plan, 0, { lite: true, endT: endT, extra: x ? extra : null }).goals[g.id];
            return o ? o.due - o.fromOwn : 0;
        };
        const s0 = short(0);
        if (s0 < 1) { out[g.id] = 0; return; }
        let lo = 0, hi = Math.max(10, s0);
        if (short(hi) >= 1) { out[g.id] = null; return; }
        while (hi - lo > Math.max(1, hi * 0.001)) { const mid = (lo + hi) / 2; if (short(mid) < 1) hi = mid; else lo = mid; }
        out[g.id] = Math.ceil(hi);
    });
    return out;
}

/** The accounts drawn from, in order: as the person put them, then any not placed, cash
 *  first, then investments, then pre-tax, then Roth. Property is not drawn from, and nor
 *  is a 529: it is spent only on the goals paid from it. */
function fpDrawOrder(plan, withOff) {
    const rank = (a) => a.kind === 'cash' ? 0 : a.kind === 'investment' ? 1 : a.kind === 'other' ? 2 : a.kind === 'hsa' ? 5 : fpIsPretax(a) ? 3 : 4;
    const drawable = (withOff ? fpAllEntries : fpEntries)(plan.accounts).filter(a => (FP_KINDS[a.kind] || FP_KINDS.other).side === 'asset' && a.kind !== 'property' && a.kind !== 'education');
    const placed = (plan.drawOrder || []).map(x => drawable.find(a => a.id === x.id)).filter(Boolean);
    const rest = drawable.filter(a => !placed.includes(a)).sort((a, b) => rank(a) - rank(b));
    return placed.concat(rest);
}

function fpYm(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
}

/**
 * The plan worked forward, a month at a time. `shift` moves market returns up or down
 * by that many points, for the range. Returns a row a year (today first), the first
 * month's money in and out, and the milestones.
 *
 * `opts`, for working out what would be needed to stop working (fpNeededToStop):
 *   stopT      the month work stops, in place of the plan's retirement (Infinity: never);
 *              every line of pay from work stops then, even one with an end of its own
 *   snapshots  keep the balances at the start of each year, as `snaps`
 *   from       start from one of those, at its month, rather than from today
 *   lite       only whether the money lasts: { runsOut, goals }, stopping when it does not
 *   tail       with lite: a sum of (bal, loose), given back as `tail` { from, to }, its value
 *              at the start and end of the plan's last twelve months — for what would last
 *              forever, so minimum withdrawals are left out: they move money, and at the
 *              ages near the plan's end would read as savings shrinking, however large.
 *              Also `tail.month`: a month's money over those twelve, in today's dollars
 *   endT       stop after this month (with lite: run on to it even if the money runs out)
 *   extra      more a month into accounts, by id, to endT — for what would cover a goal
 *   detail     keep what made up each row, as `detail` (fpYearDetailHtml): row 0 is this
 *              month, each other row the twelve months to it — every line's money in and
 *              out, and each account's balance at the start and end with what went in, what
 *              was drawn and what it earned (or, owed, its interest), in dollars of the time
 */
function fpProject(plan, shift, opts) {
    plan = fpCalc(plan);
    shift = shift || 0;
    opts = opts || {};
    const infl = fpNum(plan.assume.inflation, 0) / 100;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    // Retiring, the plan runs to the age it is to last to.
    const ret = fpRetireInfo(plan);
    const retOk = ret && !ret.missing;
    const toEnd = retOk ? (ret.end.getFullYear() - start.getFullYear()) * 12 + (ret.end.getMonth() - start.getMonth()) : 0;
    const years = Math.max(1, Math.min(80, retOk ? Math.ceil(toEnd / 12) : Math.round(fpNum(plan.assume.years, 30))));
    const taxInfo = fpTaxInfo(plan);
    const basis = {};
    plan.accounts.forEach(a => { if (a.kind === 'investment' || fpIsRoth(a)) basis[a.id] = fpBasisOf(plan, a); });
    const spend0 = retOk ? fpRetireSpending(plan) : 0;
    // The order savings are drawn on: in retirement, and before it when cash runs short.
    const order = fpDrawOrder(plan);
    const birthB = fpBirthOf(plan);
    const W = taxRulesFor('').withdraw;
    const ageMonthsAt = (d) => birthB ? (d.getFullYear() * 12 + d.getMonth()) - (birthB.y * 12 + birthB.m) : null;
    // Health cover in retirement: before Medicare, as given; from it, Part B (for each
    // person — two when married) with its surcharge for higher incomes, and what is given
    // beside it. All of it rising with medical inflation.
    const health = fpHealthOf(plan);
    const magiYear = [];
    const pretax = retOk ? plan.accounts.filter(fpIsPretax) : [];
    const buffer = retOk ? Math.max(0, fpNum(plan.retire.buffer, 6)) : 0;
    const rmdYear = {};
    let yearWithdrawn = 0, yearWithdrawTax = 0, yearPenalty = 0, yearOrd = 0, yearBen = 0, yearGains = 0;
    // What goals have drawn so far this calendar year: paid once, not a monthly rate.
    let lumpOrd = 0, lumpGains = 0;
    // Penalised draws penalty-free money first while it matters, unless told not to.
    const avoidPenalty = !plan.retire || plan.retire.avoidPenalty !== false;
    const index0 = (yrs) => Math.pow(1 + infl, yrs);
    const bal = {};
    const yearStart = {}, yearAdded = {};
    plan.accounts.forEach(a => { bal[a.id] = fpBalanceOf(plan, a); yearStart[a.id] = bal[a.id]; yearAdded[a.id] = 0; });
    const into = fpSurplusAccount(plan);
    const extra = opts.extra || {};
    // Goals by the month each payment falls in, and what came of each. A 529 takes nothing
    // more after the last goal paid from it.
    const goalDue = {}, goalOut = {}, eduLast = {};
    (plan.goals || []).forEach(g => {
        const pays = fpGoalPayments(plan, g, start);
        if (!pays.length) return;
        const acct = fpGoalAccount(plan, g);
        pays.forEach(p => { (goalDue[p.t] = goalDue[p.t] || []).push({ g: g, acct: acct, amount: p.amount }); });
        if (acct && acct.kind === 'education') eduLast[acct.id] = Math.max(eduLast[acct.id] || 0, pays[pays.length - 1].t);
        // due and fromOwn in dollars then; held: in its account at the first payment;
        // drawn: what savings made up before retirement; left: in its account after.
        goalOut[g.id] = { first: pays[0].t, last: pays[pays.length - 1].t, count: pays.length, today: pays.reduce((s, p) => s + p.today, 0),
            due: 0, fromOwn: 0, drawn: 0, held: null, left: null, retired: false, own: !!acct && acct.id !== into };
    });
    let loose = 0; // left over with nowhere to go: no account to put it in
    const side = (a) => (FP_KINDS[a.kind] || FP_KINDS.other).side;
    const totals = () => {
        let assets = loose > 0 ? loose : 0, liabilities = loose < 0 ? -loose : 0;
        plan.accounts.forEach(a => {
            const b = bal[a.id];
            if (side(a) === 'liability') liabilities += Math.max(0, b);
            else if (b >= 0) assets += b; else liabilities -= b;
        });
        return { assets: assets, liabilities: liabilities, net: assets - liabilities };
    };
    const real = (v, t) => plan.assume.real ? v / Math.pow(1 + infl, t / 12) : v;
    const cashOf = () => into ? bal[into] : loose;
    const t0 = totals();
    const rows = [{ t: 0, year: start.getFullYear(), assets: t0.assets, liabilities: t0.liabilities, net: t0.net, cash: cashOf(), withdrawn: 0, withdrawTax: 0, withdrawPenalty: 0,
        age: fpAgeAt(plan, start) }];
    const owedAtStart = t0.liabilities > 0;
    const target = fpNum(plan.assume.target, 0);
    const ms = { debtFree: null, target: t0.net >= target && target > 0 ? 0 : null, cashOut: null, growing: [],
        retire: null, rmd: null, runsOut: null, penalty: null, rothEarly: null, hsaPenalty: null, drawnEarly: null, medicare: null, irmaa: null, goals: goalOut,
        // What early-withdrawal penalties came to, in dollars of the time: pre-tax, Roth earnings, HSA.
        penalties: { pretax: 0, roth: 0, hsa: 0 } };
    // Work left in the year of turning 55 (the rules' age) or later: a 401(k) pays no early
    // penalty from then. IRAs keep the early age.
    const leftWork = !retOk ? null : opts.stopT !== undefined && isFinite(opts.stopT) ? new Date(start.getFullYear(), start.getMonth() + opts.stopT - 1, 1) : ret.date;
    const leftAt55 = !!leftWork && leftWork.getFullYear() - ret.birthYear >= ret.sepAge;
    // A 401(k) or 403(b) goes by the job paying into it, where the plan says when that ends:
    // the month after the last line into it, or work stopping if that is sooner.
    const leftJob = {};
    plan.accounts.filter(a => a.kind === 'retirement' && a.planType !== 'ira' && a.planType !== '457').forEach(a => {
        const lines = fpEntries(plan.incomes).filter(l => l.type !== 'ss' && fpIntoRows(l).some(r => r.account === a.id));
        if (!lines.length || lines.some(l => !l.to)) return;
        const [y, m] = lines.reduce((x, l) => l.to > x ? l.to : x, '').split('-').map(Number);
        let left = new Date(y, m, 1);
        if (opts.stopT !== undefined && isFinite(opts.stopT)) left = new Date(Math.min(left, new Date(start.getFullYear(), start.getMonth() + opts.stopT - 1, 1)));
        leftJob[a.id] = left;
    });
    let first = null;
    const snaps = opts.snapshots ? [] : null;
    // What made up each row: this month into row 0 as well as row 1.
    const det = opts.detail ? [] : null;
    let dRows = [];
    const dNew = () => ({ income: {}, deductions: 0, payrollOwn: 0, match: 0, fedTax: 0, payrollTax: 0, typedTax: 0, withdrawTax: 0,
        expenses: {}, spending: 0, healthBefore: 0, healthAfter: 0, partB: 0, irmaa: 0, payments: {}, escrow: {}, goals: {},
        added: {}, contrib: {}, drawn: {}, penalty: {}, rmd: {}, leftover: 0, puts: 0, growth: {}, start: {}, end: {}, looseStart: 0, looseEnd: 0, months: 0 });
    const dAdd = (part, key, v) => { if (!det || !v) return; dRows.forEach(b => { if (key === null) b[part] += v; else b[part][key] = (b[part][key] || 0) + v; }); };
    let tFrom = 1;
    if (opts.from) {
        const s = opts.from;
        Object.assign(bal, s.bal); Object.assign(basis, s.basis); Object.assign(yearStart, s.yearStart); Object.assign(yearAdded, s.yearAdded);
        loose = s.loose; lumpOrd = s.lumpOrd; lumpGains = s.lumpGains;
        tFrom = s.t + 1;
    }
    const tail = opts.tail ? { from: opts.tail(bal, loose), to: null, month: { living: 0, health: 0, loans: 0, goals: 0, income: 0, tax: 0 } } : null;
    for (let t = tFrom; t <= years * 12; t++) {
        if (det) {
            const k = Math.ceil(t / 12);
            if (!det[k]) { det[k] = dNew(); det[k].start = Object.assign({}, bal); det[k].looseStart = loose; }
            if (t === 1) { det[0] = dNew(); det[0].start = Object.assign({}, bal); det[0].looseStart = loose; }
            dRows = t === 1 ? [det[0], det[k]] : [det[k]];
            dRows.forEach(b => { b.months++; });
        }
        if (snaps && (t - 1) % 12 === 0) snaps.push({ t: t - 1, bal: Object.assign({}, bal), basis: Object.assign({}, basis), yearStart: Object.assign({}, yearStart),
            yearAdded: Object.assign({}, yearAdded), loose: loose, lumpOrd: lumpOrd, lumpGains: lumpGains });
        const date = new Date(start.getFullYear(), start.getMonth() + t - 1, 1);
        const ym = fpYm(date);
        const yrs = (t - 1) / 12;
        const retired = retOk && (opts.stopT !== undefined ? t >= opts.stopT : ym >= ret.ym);
        if (retired && ms.retire === null) ms.retire = t;
        const ageM = ageMonthsAt(date);
        const onMedicare = ageM !== null && ageM >= health.age * 12;
        let typedOrd = 0, typedBen = 0;
        let income = 0, taxed = 0, benefits = 0, deductions = 0, typedTax = 0, expenses = 0, payments = 0, escrow = 0, contributions = 0, payrollOwn = 0, payrollMatch = 0;
        const payroll = {}, wages = [];
        plan.incomes.forEach(l => {
            if (!fpActive(l, ym)) return;
            // Retired, pay stops; Social Security, and anything given an end of its own, go on.
            // Stopping work in a given month (what is needed to stop, worked out), all pay
            // from work stops then, whatever its own end; a pension or rent goes on.
            if (retired && l.type !== 'ss' && (!l.to || (opts.stopT !== undefined && l.wages !== false))) return;
            // Deductions and taxes typed on a line grow with it, as a pay stub's do.
            const g = Math.pow(1 + fpNum(l.growth, infl * 100) / 100, yrs);
            const v = fpMonthly(l) * g;
            income += v;
            dAdd('income', l.id, v);
            // What goes into an account is part of the deductions; typed as more than
            // them, the deductions are at least that much.
            let own = 0, pretaxOwn = 0, hsaOwn = 0, hsaStopped = 0;
            fpIntoOf(plan, l).forEach(r => {
                if (!r.account) return;
                // On Medicare, nothing more goes into an HSA.
                if (r.account.kind === 'hsa' && onMedicare) { hsaStopped += r.own * g; return; }
                payroll[r.account.id] = (payroll[r.account.id] || 0) + (r.own + r.match) * g;
                own += r.own * g; payrollMatch += r.match * g;
                if (fpIsPretax(r.account) || r.account.kind === 'hsa') pretaxOwn += r.own * g;
                if (r.account.kind === 'hsa') hsaOwn += r.own * g;
            });
            payrollOwn += own;
            deductions += Math.max(fpPerMonth(l, 'deductions') * g - hsaStopped, own);
            if (fpHasTypedTax(l)) {
                typedTax += fpPerMonth(l, 'taxes') * g;
                // Its income still counts toward the bracket the rest is taxed in.
                if (l.taxed !== false) { if (l.type === 'ss') typedBen += v; else typedOrd += v - pretaxOwn; }
            }
            // How much of a benefit is taxed depends on the rest of the income, so it is
            // worked out with the tax. Pay is taxed less what goes pre-tax into a 401(k)
            // and the like, which still pays payroll tax.
            else if (l.taxed !== false) {
                if (l.type === 'ss') benefits += v;
                else { taxed += v - pretaxOwn; if (l.wages !== false) wages.push((v - hsaOwn) * 12); }
            }
        });
        if (retired) {
            expenses = spend0 * Math.pow(1 + infl, yrs);
            dAdd('spending', null, expenses);
            // Health cover: before Medicare, and from it — Part B with its surcharge, by the
            // income two years before, the thresholds moving up with inflation.
            const k = Math.floor((t - 1) / 12);
            const magi = k >= 2 && magiYear[k - 2] !== undefined ? magiYear[k - 2] : health.magiNow;
            const mi = Math.pow(1 + health.medInfl, yrs);
            if (ageM !== null && health.on) {
                if (!onMedicare) { expenses += health.before * mi; dAdd('healthBefore', null, health.before * mi); }
                else {
                    const tier = health.irmaa.filter(r => magi > r.from * index0(yrs)).pop();
                    if (tier && ms.irmaa === null) ms.irmaa = t;
                    expenses += (health.after + health.persons * (health.partB + (tier ? tier.b + tier.d : 0))) * mi;
                    dAdd('healthAfter', null, health.after * mi); dAdd('partB', null, health.persons * health.partB * mi); dAdd('irmaa', null, tier ? health.persons * (tier.b + tier.d) * mi : 0);
                    if (ms.medicare === null) ms.medicare = t;
                }
            }
        }
        else plan.expenses.forEach(l => {
            if (!fpActive(l, ym)) return;
            const v = fpMonthly(l) * Math.pow(1 + fpNum(l.growth, infl * 100) / 100, yrs);
            expenses += v;
            dAdd('expenses', l.id, v);
        });
        const index = Math.pow(1 + infl, yrs);
        // Paid into an HSA directly, while working: taken off taxed income, as on the return.
        if (!retired && !onMedicare) plan.accounts.forEach(a => { if (a.kind === 'hsa') taxed = Math.max(0, taxed - Math.max(0, fpNum(a.monthly, 0))); });
        // The estimate is the tax on everything, less the tax on the lines whose taxes are
        // typed: theirs are paid as typed, but the rest lands in the brackets above them.
        const estimated = (fpFederalTax(taxInfo, (taxed + typedOrd) * 12, (benefits + typedBen) * 12, 0, index) - fpFederalTax(taxInfo, typedOrd * 12, typedBen * 12, 0, index)) / 12;
        const payrollTax = fpPayrollTax(taxInfo, wages, index) / 12;
        const tax = estimated + payrollTax + typedTax;
        dAdd('fedTax', null, estimated); dAdd('payrollTax', null, payrollTax); dAdd('typedTax', null, typedTax);
        dAdd('deductions', null, deductions); dAdd('payrollOwn', null, payrollOwn); dAdd('match', null, payrollMatch);
        if (det) Object.keys(payroll).forEach(k => dAdd('added', k, payroll[k]));
        plan.accounts.forEach(a => {
            const yearly = (fpRateOf(plan, a) + (FP_MARKET.includes(a.kind) ? shift : 0)) / 100;
            const r = yearly / 12;
            let m = (retired && side(a) !== 'liability') || (a.kind === 'hsa' && onMedicare) || (eduLast[a.id] !== undefined && t > eduLast[a.id]) ? 0 : fpMonthlyOf(plan, a);
            if (extra[a.id] && side(a) !== 'liability') m += extra[a.id];
            if (side(a) === 'liability') {
                escrow += fpEscrowOf(a) * Math.pow(1 + infl, yrs);
                dAdd('escrow', a.id, fpEscrowOf(a) * Math.pow(1 + infl, yrs));
                if (bal[a.id] <= 0) return;
                const interest = bal[a.id] * r;
                const pay = Math.min(m, bal[a.id] + interest);
                const was = bal[a.id];
                bal[a.id] += interest - pay;
                if (bal[a.id] < 0.005) bal[a.id] = 0;
                // Owed, interest is growth the wrong way, and a payment is money in.
                dAdd('growth', a.id, -(bal[a.id] - was + pay)); dAdd('added', a.id, pay); dAdd('payments', a.id, pay);
                payments += pay;
                if (pay < interest && !ms.growing.includes(a.id)) ms.growing.push(a.id);
            } else if (a.compounding === 'annual') {
                // As the Investment Calculator counts a year compounded once: what was
                // there at the start grows by the year's rate, what went in during the
                // year is added at its end without growth.
                bal[a.id] += m + (payroll[a.id] || 0);
                yearAdded[a.id] += m + (payroll[a.id] || 0);
                if (basis[a.id] !== undefined) basis[a.id] += m + (payroll[a.id] || 0);
                contributions += m;
                dAdd('added', a.id, m); dAdd('contrib', a.id, m);
                if (t % 12 === 0) {
                    const base = bal[a.id] - yearAdded[a.id];
                    if (base > 0) dAdd('growth', a.id, base * yearly);
                    bal[a.id] = (base > 0 ? base * (1 + yearly) : base) + yearAdded[a.id];
                    yearStart[a.id] = bal[a.id];
                    yearAdded[a.id] = 0;
                }
            } else {
                if (bal[a.id] > 0) { dAdd('growth', a.id, bal[a.id] * r); bal[a.id] *= 1 + r; }
                bal[a.id] += m + (payroll[a.id] || 0);
                if (basis[a.id] !== undefined) basis[a.id] += m + (payroll[a.id] || 0);
                contributions += m;
                dAdd('added', a.id, m); dAdd('contrib', a.id, m);
            }
        });
        // A goal falling this month is paid out of the month's money, like an expense.
        const dueNow = goalDue[t] || [];
        const goalCost = dueNow.reduce((s, d) => s + d.amount, 0);
        const surplus = income - deductions - tax - expenses - payments - escrow - contributions - goalCost;
        dueNow.forEach(d => dAdd('goals', d.g.id, d.amount));
        dAdd('leftover', null, surplus);
        if (into) { bal[into] += surplus; yearAdded[into] += surplus; if (basis[into] !== undefined && surplus > 0) basis[into] += surplus; } else loose += surplus;
        let withdrawn = 0, withdrawTax = 0, withdrawPenalty = 0, monthOrd = taxed + typedOrd, monthGains = 0;
        const age = ageM;
        const put = (v) => { if (into) { bal[into] += v; yearAdded[into] += v; } else loose += v; dAdd('puts', null, v); };
        // Pre-tax money is income, and the gain in what is drawn from an investment
        // account is taxed at the capital-gains rates: what more tax they bring, on top
        // of what is already taxed this month.
        // The month's income is a rate, twelve times over; a goal's payment falls once, so what
        // it draws goes on top of the year's income as it stands, and stays there to December.
        if (date.getMonth() === 0) { lumpOrd = 0; lumpGains = 0; }
        let pretaxSoFar = 0, gainsSoFar = 0, lumpOrdNow = 0, lumpGainsNow = 0;
        const fedYear = (ord, gain, oneOrd, oneGain) => fpFederalTax(taxInfo, (taxed + typedOrd + pretaxSoFar + ord) * 12 + lumpOrd + oneOrd, (benefits + typedBen) * 12, (gainsSoFar + gain) * 12 + lumpGains + oneGain, index);
        const extraTax = (ord, gain) => (fedYear(ord || 0, gain || 0, 0, 0) - fedYear(0, 0, 0, 0)) / 12;
        const lumpTax = (ord, gain) => fedYear(0, 0, ord || 0, gain || 0) - fedYear(0, 0, 0, 0);
        const fromPretax = {};
        // The early-withdrawal penalty on an account this month, as a fraction: before 59½ on
        // pre-tax money and Roth earnings — not from a 401(k) or 403(b) left in or after the
        // year of turning 55, nor a 457(b) once work stops — and before 65 on an HSA spent on
        // other than medical costs. Without a birth month there is no age to go by: none.
        const penaltyOf = (a) => {
            if (age === null) return 0;
            if (a.kind === 'hsa') return a.hsaMedical === false && age < W.hsaAge * 12 ? W.hsaPenalty / 100 : 0;
            if (a.kind !== 'retirement' || age >= W.early) return 0;
            // Before retirement, the job is not taken to be left: no age-55 exception.
            if (retired && a.planType === '457') return 0;
            const left = leftJob[a.id];
            if (left) { if (birthB && date >= left && left.getFullYear() - birthB.y >= W.sepAge) return 0; }
            else if (retired && a.planType !== 'ira' && leftAt55) return 0;
            return W.penalty / 100;
        };
        // What can come out of an account this month without a penalty: all of it, a Roth's
        // contributions (they come out first), or none.
        const freeOf = (a) => !penaltyOf(a) ? Infinity : fpIsRoth(a) ? Math.max(0, basis[a.id] || 0) : 0;
        const take = (a, net, cap, lump) => {
            // Enough to have `net` left once its tax and any penalty are paid, if the account
            // holds it. An HSA spent on other than medical costs is taxed as pre-tax money is.
            // `lump`: this month only, for a goal, and taxed as that.
            const hsaTaxed = a.kind === 'hsa' && a.hsaMedical === false;
            const pre = fpIsPretax(a) || hsaTaxed;
            const roth = fpIsRoth(a);
            const rate = penaltyOf(a);
            // A Roth's contributions come out first and free; its earnings drawn early are
            // taxed as income and penalised. After 59½ all of it is untaxed.
            const earn = (g) => roth && rate ? Math.max(0, g - Math.max(0, basis[a.id] || 0)) : 0;
            const share = !pre && !roth && basis[a.id] !== undefined && bal[a.id] > 0 ? Math.max(0, 1 - basis[a.id] / bal[a.id]) : 0;
            const more = lump ? lumpTax : extraTax;
            const taxOf = (g) => pre ? more(g, 0) : roth ? (earn(g) ? more(earn(g), 0) : 0) : share ? more(0, g * share) : 0;
            const addOrd = (v) => { if (lump) { lumpOrd += v; lumpOrdNow += v; } else pretaxSoFar += v; };
            const penOf = (g) => rate * (pre ? g : roth ? earn(g) : 0);
            let g = net;
            // Found by going round until it settles: the tax and penalty on what is drawn,
            // drawn too.
            if (pre || share || rate) for (let k = 0; k < 40; k++) { const next = net + taxOf(g) + penOf(g); if (Math.abs(next - g) < 1e-7) { g = next; break; } g = next; }
            g = Math.min(g, Math.max(0, bal[a.id]), cap === undefined ? Infinity : cap);
            if (g <= 0) return 0;
            const tx = taxOf(g), pen = penOf(g);
            bal[a.id] -= g;
            if (pre) {
                addOrd(g);
                fromPretax[a.id] = (fromPretax[a.id] || 0) + g;
                if (pen > 0) {
                    if (hsaTaxed) { ms.penalties.hsa += pen; if (ms.hsaPenalty === null) ms.hsaPenalty = t; }
                    else { ms.penalties.pretax += pen; if (ms.penalty === null) ms.penalty = t; }
                }
            } else if (roth) {
                const e = earn(g);
                if (e > 0) { addOrd(e); ms.penalties.roth += pen; if (ms.rothEarly === null) ms.rothEarly = t; }
                if (basis[a.id] !== undefined) basis[a.id] = Math.max(0, basis[a.id] - (g - e));
            } else if (basis[a.id] !== undefined) {
                basis[a.id] = Math.max(0, basis[a.id] - g * (1 - share));
                if (lump) { lumpGains += g * share; lumpGainsNow += g * share; } else gainsSoFar += g * share;
            }
            withdrawn += g; withdrawTax += tx; withdrawPenalty += pen;
            dAdd('drawn', a.id, g); dAdd('withdrawTax', null, tx); dAdd('penalty', a.id, pen);
            put(g - tx - pen);
            return g - tx - pen;
        };
        // A goal's payment comes first from its own account, as far as that goes: back
        // into cash, which paid it. A 529's comes out untaxed.
        dueNow.forEach(d => {
            const o = goalOut[d.g.id];
            o.due += d.amount;
            if (retired) o.retired = true;
            if (!o.own) return;
            if (o.held === null) o.held = Math.max(0, bal[d.acct.id]);
            d.got = take(d.acct, d.amount, undefined, true);
            o.fromOwn += d.got;
        });
        // What of the goals' payments their own accounts did not cover, for savings to make up.
        let lumpLeft = dueNow.reduce((s, d) => s + d.amount - (d.got || 0), 0);
        const goalWithdrawn = withdrawn;
        // Before retirement, cash running short is made up from savings, in the same order:
        // cash is kept at nought, not overdrawn while there is anything to draw on.
        const short = !retired && cashOf() < -0.005;
        let shortNet = 0;
        if (retired || short) {
            let need = retired ? buffer * expenses - cashOf() : -cashOf();
            // With penalties avoided, a first pass takes only what comes out free, in the order
            // given; the second, whatever is still needed.
            (avoidPenalty ? [true, false] : [false]).forEach(free => order.forEach(a => {
                if (need <= 0.005 || a.id === into || bal[a.id] <= 0) return;
                if (lumpLeft > 0.005) {
                    const got = take(a, Math.min(need, lumpLeft), free ? freeOf(a) : undefined, true);
                    lumpLeft -= got; need -= got; shortNet += got;
                }
                if (need <= 0.005 || bal[a.id] <= 0) return;
                const got = take(a, need, free ? freeOf(a) : undefined);
                need -= got; shortNet += got;
            }));
            // The minimum a pre-tax account must pay out: worked out each January from the
            // balance then and the age reached that year, paid a twelfth a month.
            if (retired && !opts.tail && age >= ret.rmdAge * 12 - 11) {
                const ageThisYear = date.getFullYear() - ret.birthYear;
                if (ageThisYear >= ret.rmdAge) {
                    if (ms.rmd === null) ms.rmd = t;
                    pretax.forEach(a => {
                        if (date.getMonth() === 0 || rmdYear[a.id] === undefined) rmdYear[a.id] = Math.max(0, bal[a.id] + (fromPretax[a.id] || 0)) / fpRmdFactor(ageThisYear);
                        const owed = rmdYear[a.id] / 12 - (fromPretax[a.id] || 0);
                        if (owed > 0.005 && bal[a.id] > 0) {
                            const g = Math.min(owed, bal[a.id]);
                            const tx = extraTax(g, 0);
                            bal[a.id] -= g; pretaxSoFar += g; withdrawn += g; withdrawTax += tx;
                            dAdd('drawn', a.id, g); dAdd('rmd', a.id, g); dAdd('withdrawTax', null, tx);
                            put(g - tx);
                        }
                    });
                }
            }
            if (!retired && withdrawn > goalWithdrawn && ms.drawnEarly === null) ms.drawnEarly = t;
            if (retired && ms.runsOut === null && cashOf() < -0.005) {
                ms.runsOut = t;
                if (opts.lite && !opts.endT) return { runsOut: t, goals: goalOut };
            }
        }
        monthOrd = taxed + typedOrd + pretaxSoFar + lumpOrdNow;
        monthGains = gainsSoFar + lumpGainsNow;
        // What of the goals' payments savings made up, before retirement; and what is
        // left in a goal's account after its last.
        let rest = shortNet;
        dueNow.forEach(d => {
            const o = goalOut[d.g.id];
            if (!retired && rest > 0) { const part = Math.min(rest, Math.max(0, d.amount - (d.got || 0))); o.drawn += part; rest -= part; }
            if (t === o.last && o.own) o.left = Math.max(0, bal[d.acct.id]);
        });
        if (tail && t > years * 12 - 12) {
            const toToday = 12 * index, living = retired ? spend0 * index : expenses, m = tail.month;
            m.living += living / toToday; m.health += (expenses - living) / toToday; m.loans += (payments + escrow) / toToday; m.goals += goalCost / toToday;
            m.income += (income - deductions) / toToday; m.tax += (tax + withdrawTax + withdrawPenalty) / toToday;
        }
        if (opts.endT && t >= opts.endT) break;
        if (tail && t === years * 12 - 12) tail.from = opts.tail(bal, loose);
        if (opts.lite) continue;
        if (det) dRows.forEach(b => { b.end = Object.assign({}, bal); b.looseEnd = loose; });
        yearWithdrawn += withdrawn; yearWithdrawTax += withdrawTax; yearPenalty += withdrawPenalty; yearOrd += monthOrd; yearBen += benefits + typedBen; yearGains += monthGains;
        // The year's modified AGI, for the Medicare surcharge two years on.
        if (t % 12 === 0) magiYear[t / 12 - 1] = yearOrd + yearGains + fpSSTaxable(health.ssTax, yearBen, yearOrd + yearGains);
        if (!first) first = { income: income, deductions: deductions, tax: tax, typedTax: typedTax, estimatedTax: estimated, payrollTax: payrollTax, takeHome: income - deductions - tax,
            goals: goalCost, expenses: expenses, payments: payments, escrow: escrow, contributions: contributions, surplus: surplus, payrollOwn: payrollOwn, payrollMatch: payrollMatch };
        const tot = totals();
        if (owedAtStart && ms.debtFree === null && plan.accounts.every(a => side(a) !== 'liability' || bal[a.id] <= 0)) ms.debtFree = t;
        if (ms.target === null && target > 0 && real(tot.net, t) >= target) ms.target = t;
        if (ms.cashOut === null && cashOf() < -0.005) ms.cashOut = t;
        if (t % 12 === 0) {
            rows.push({ t: t, year: start.getFullYear() + t / 12, assets: real(tot.assets, t), liabilities: real(tot.liabilities, t), net: real(tot.net, t), cash: real(cashOf(), t),
                withdrawn: real(yearWithdrawn, t), withdrawTax: real(yearWithdrawTax, t), withdrawPenalty: real(yearPenalty, t), age: fpAgeAt(plan, date),
                // The year's taxed ordinary income and Social Security, as paid then — for the tax rate on the next dollar.
                ordinary: yearOrd, benefits: yearBen, index: Math.pow(1 + infl, (t - 12) / 12), retired: retired });
            yearWithdrawn = 0; yearWithdrawTax = 0; yearPenalty = 0; yearOrd = 0; yearBen = 0; yearGains = 0;
        }
    }
    if (tail) tail.to = opts.tail(bal, loose);
    if (opts.lite) return { runsOut: null, goals: goalOut, tail: tail };
    return { snaps: snaps, detail: det, rows: rows, first: first || { goals: 0, income: 0, deductions: 0, tax: 0, typedTax: 0, estimatedTax: 0, payrollTax: 0, takeHome: 0, expenses: 0, payments: 0, escrow: 0, contributions: 0, surplus: 0, payrollOwn: 0, payrollMatch: 0 }, milestones: ms, start: start, into: into, retire: retOk ? ret : null };
}

/** Health cover in retirement, as the projection uses it: a month in today's dollars
 *  before Medicare and beside it, Part B and its surcharges for the filing status, and
 *  the income now (for the first two years' surcharge). */
function fpHealthOf(plan) {
    const r = plan.retire || {};
    const rules = taxRulesFor(plan.tax.year);
    const status = plan.tax && plan.tax.status === 'married' ? 'married' : 'single';
    const ym = fpYm(new Date());
    const magiNow = fpEntries(plan.incomes).filter(l => l.type !== 'ss' && l.taxed !== false && fpActive(l, ym)).reduce((s, l) => s + (fpMonthly(l) - fpPretaxPay(plan, l)) * 12, 0);
    // Counted only when asked: a spending figure may have health costs in it already.
    return { on: !!r.health, before: r.health ? Math.max(0, fpNum(r.healthBefore, 0)) : 0, after: r.health ? Math.max(0, fpNum(r.healthAfter, 0)) : 0, medInfl: fpNum(r.medInfl, 5) / 100,
        age: rules.medicare.age, partB: rules.medicare.partB, irmaa: rules.medicare.irmaa[status], persons: status === 'married' ? 2 : 1,
        ssTax: rules.ssTax[status], magiNow: magiNow };
}

/** When pay from work stops ahead of the retirement the plan sets: the first month no
 *  line of it runs, a year or more before — or null. */
function fpPayGap(plan, ret) {
    if (!ret || ret.missing) return null;
    const pay = fpEntries(plan.incomes).filter(l => l.type !== 'ss' && l.wages !== false);
    const now = new Date();
    if (!pay.some(l => fpActive(l, fpYm(now)))) return null;
    for (let k = 1; k < 80 * 12; k++) {
        const d = new Date(now.getFullYear(), now.getMonth() + k, 1);
        if (d >= ret.date) return null;
        if (!pay.some(l => fpActive(l, fpYm(d)))) {
            const months = (ret.date.getFullYear() - d.getFullYear()) * 12 + ret.date.getMonth() - d.getMonth();
            return months >= 12 ? d : null;
        }
    }
    return null;
}

/** The gap closed: retirement from here goes by the last job. */
function fpRetireByJob(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const plan = fpGet(toolId);
    plan.retire.from = 'job';
    fpSet(toolId, plan);
    fpRender(widget);
}

/**
 * The most a month (today's dollars) that can be spent in retirement and still last to the
 * age the plan runs to — found by halving the gap between what lasts and what does not.
 */
function fpRetireMax(plan, shift) {
    const ret = fpRetireInfo(fpCalc(plan));
    if (!ret || ret.missing) return null;
    const trial = (v) => fpProject(Object.assign({}, plan, { retire: Object.assign({}, plan.retire, { spending: v }) }), shift).milestones.runsOut === null;
    let lo = 0, hi = 2000;
    while (trial(hi) && hi < 1e6) { lo = hi; hi *= 2; }
    if (!trial(lo)) return 0;
    for (let k = 0; k < 18; k++) { const mid = (lo + hi) / 2; if (trial(mid)) lo = mid; else hi = mid; }
    return Math.floor(lo / 10) * 10;
}

/**
 * For each year of the plan, the savings that would be needed at its start to stop
 * working then and still have the money last to the age in Retirement — beside what the
 * plan has saved by then. Savings are what can be drawn on: cash, investments, retirement
 * and other accounts, not property. Everything else is the plan's: its spending in
 * retirement, Social Security from its claiming age, income with an end of its own, loans
 * still paid, returns, inflation, taxes and the draw order.
 *
 * The plan is run once as Ahead shows it, keeping the balances at the start of each year. Each
 * year's figure is then found from there by trying more or less — spread over the
 * accounts in the shares they hold then — halving the gap until it just lasts.
 * `forever` is the same with no age to reach: the least that never runs out and, by the
 * plan's last year, keeps its buying power, so that it could go on past it. It settles
 * where needed falls away, and is Infinity if what the money earns never outruns inflation.
 * Returns { rows: [{ t, year, age, have, needed, forever, enough, enoughForever }], earliest,
 * foreverAt, tail, spend, spendAt } (amounts in today's money when the plan is), or { missing }
 * without a birth month. `tail` is the month that sets the end of the lines, always in today's
 * money. `spend` is the most that could be spent a month and last, stopping now and on the
 * plan's date, and `spendAt(t)` stopping at a year's start: today's dollars, beside health
 * costs, goals and loans; null or 0 where there is nothing to spend.
 */
function fpNeededToStop(plan) {
    const steps = fpNeededSteps(plan, false);
    let step = steps.next();
    while (!step.done) step = steps.next();
    return step.value;
}

/** The working of fpNeededToStop, a year at a time: yields { done, total } after each, so that
 *  the page can show how far it has got, and returns the result. `all` works out what could
 *  be spent for every year as it goes, rather than for a year when asked. */
function* fpNeededSteps(plan, all) {
    const p = fpCalc(Object.assign({}, plan, { retire: Object.assign({}, plan.retire, { on: true }) }));
    const ret = fpRetireInfo(p);
    if (!ret) return null;
    if (ret.missing) return { missing: ret.missing };
    // The plan as it is shown: working on throughout, or — with Retirement on — retiring
    // when it says. Before then each year is the same either way; after, the savings are
    // the ones being drawn on, and what is needed is what would still last from there.
    const base = fpProject(p, 0, { stopT: plan.retire && plan.retire.on ? undefined : Infinity, snapshots: true });
    const draw = fpDrawOrder(p).map(a => a.id);
    const into = base.into;
    const fpEstimated = p.incomes.some(l => l.type === 'ss' && fpNum(l.fraBenefit, null) === null);
    const infl = fpNum(p.assume.inflation, 0) / 100;
    const real = (v, t) => p.assume.real ? v / Math.pow(1 + infl, t / 12) : v;
    let lastForever = 0;
    const tailOf = [], spendOf = [], rows = [], spent = {};
    for (let k = 0; k < base.snaps.length; k++) {
        const s = base.snaps[k];
        const have = draw.reduce((sum, id) => sum + s.bal[id], 0) + (into ? 0 : s.loose);
        const pos = draw.filter(id => s.bal[id] > 0);
        const looseUp = !into && s.loose > 0;
        const posSum = pos.reduce((x, id) => x + s.bal[id], 0) + (looseUp ? s.loose : 0);
        // What is needed from here on: anything the plan has overdrawn by now is its own
        // shortfall, not a debt to clear first. Short of what is held, the accounts are scaled
        // down; beyond it, the rest goes in as savings stand today. Were it to go where the
        // money is that year, a plan down to its cash would need a pot earning a cash rate.
        const s0 = base.snaps[0];
        const mix = draw.filter(id => id !== into && s0.bal[id] > 0);
        const mixSum = mix.reduce((x, id) => x + s0.bal[id], 0);
        const at = (total) => {
            const f = Object.assign({}, s, { bal: Object.assign({}, s.bal), basis: Object.assign({}, s.basis) });
            draw.concat(into || []).forEach(id => { if (f.bal[id] < 0) f.bal[id] = 0; });
            if (f.loose < 0) f.loose = 0;
            const want = Math.max(0, total);
            if (want > posSum && mixSum > 0) {
                mix.forEach(id => {
                    const v = (want - posSum) * s0.bal[id] / mixSum;
                    f.bal[id] += v;
                    if (f.basis[id] !== undefined) f.basis[id] += v * s0.basis[id] / s0.bal[id];
                });
            } else if (posSum > 0) {
                const m = want / posSum;
                pos.forEach(id => { f.bal[id] = s.bal[id] * m; if (f.basis[id] !== undefined) f.basis[id] = s.basis[id] * m; });
                if (looseUp) f.loose = s.loose * m;
            } else if (into) f.bal[into] += want;
            else f.loose += want;
            return f;
        };
        // A benefit estimated from pay is smaller for stopping sooner: worked out again to then.
        const stopDate = new Date(base.start.getFullYear(), base.start.getMonth() + s.t, 1);
        // Past the plan's own retirement, work stopped then: the benefit is the plan's.
        const own = plan.retire && plan.retire.on && ret.date <= stopDate;
        const pk = fpEstimated && !own ? Object.assign(fpWithEstimates(p, stopDate), { _calc: true }) : p;
        const lasts = (total) => fpProject(pk, 0, { stopT: s.t + 1, from: at(total), lite: true }).runsOut === null;
        let needed;
        if (lasts(0)) needed = 0;
        else {
            let lo = 0, hi = Math.max(have, 50000);
            while (!lasts(hi) && hi < 1e10) { lo = hi; hi *= 2; }
            if (hi >= 1e10) needed = Infinity;
            else {
                while (hi - lo > Math.max(50, hi * 0.0005)) { const mid = (lo + hi) / 2; if (lasts(mid)) hi = mid; else lo = mid; }
                needed = hi;
            }
        }
        // To last forever: never running out, and by the plan's last year no longer losing
        // buying power, when what is drawn is what would go on being drawn. All of it is in
        // today's mix: late on the plan's money may sit in cash, which would never hold.
        const pot = (bal, loose) => draw.reduce((sum, id) => sum + bal[id], 0) + (into ? 0 : loose);
        const inMix = (total) => {
            if (!(mixSum > 0)) return at(total);
            const f = Object.assign({}, s, { bal: Object.assign({}, s.bal), basis: Object.assign({}, s.basis), loose: 0 });
            draw.concat(into || []).forEach(id => { f.bal[id] = 0; if (f.basis[id] !== undefined) f.basis[id] = 0; });
            mix.forEach(id => {
                const v = total * s0.bal[id] / mixSum;
                f.bal[id] = v;
                if (f.basis[id] !== undefined) f.basis[id] = v * s0.basis[id] / s0.bal[id];
            });
            return f;
        };
        const holds = (total) => {
            const r = fpProject(pk, 0, { stopT: s.t + 1, from: inMix(total), lite: true, tail: pot });
            return r.runsOut === null && r.tail.to >= r.tail.from * (1 + infl) - 0.5;
        };
        // The search starts near last year's figure, a year's inflation on: the runs here go
        // the plan's whole length, and from one year to the next it moves little.
        let forever = Infinity;
        if (needed !== Infinity && !(k && lastForever === Infinity)) {
            if (holds(needed)) forever = needed;
            else {
                let lo = needed, hi = Math.max(needed * 1.25, 50000), found = false;
                const guess = lastForever * (1 + infl);
                if (k && guess > needed) {
                    if (holds(guess)) {
                        hi = guess; found = true;
                        const under = guess * 0.97;
                        if (under > needed) { if (holds(under)) hi = under; else lo = under; }
                    } else { lo = guess; hi = guess * 1.03; }
                }
                while (!found && hi < 1e9) { if (holds(hi)) found = true; else { lo = hi; hi *= 2; } }
                if (found) {
                    while (hi - lo > Math.max(50, hi * 0.002)) { const mid = (lo + hi) / 2; if (holds(mid)) hi = mid; else lo = mid; }
                    forever = hi;
                }
            }
        }
        lastForever = forever;
        // The most that could be spent a month, in today's dollars, stopping then: null if
        // the money would not last on nothing.
        spendOf[k] = () => {
            const from = at(have);
            const ok = (v) => fpProject(Object.assign({}, pk, { retire: Object.assign({}, pk.retire, { spending: v }) }), 0, { stopT: s.t + 1, from: from, lite: true }).runsOut === null;
            if (!ok(0)) return null;
            let lo = 0, hi = 2000;
            while (ok(hi) && hi < 1e6) { lo = hi; hi *= 2; }
            for (let i = 0; i < 18; i++) { const mid = (lo + hi) / 2; if (ok(mid)) lo = mid; else hi = mid; }
            return Math.floor(lo / 10) * 10;
        };
        // The month that sets the end of the lines, should this year be the one to tell it from.
        tailOf[k] = () => fpProject(pk, 0, { stopT: s.t + 1, from: inMix(isFinite(forever) ? forever : isFinite(needed) ? needed : Math.max(0, have)), lite: true, tail: pot, endT: Infinity }).tail.month;
        const date = new Date(base.start.getFullYear(), base.start.getMonth() + s.t, 1);
        rows.push({ t: s.t, year: base.start.getFullYear() + k, age: Math.floor(ret.ageAt(date) / 12), have: real(have, s.t), needed: needed === Infinity ? Infinity : real(needed, s.t), forever: forever === Infinity ? Infinity : real(forever, s.t),
            // Whether the plan's own savings last, run as they are — not compared with the
            // needed figure, which is found to within a few dollars.
            enough: have >= 0 && (have >= needed || lasts(have)), enoughForever: have >= 0 && have >= forever });
        if (all) spent[s.t] = spendOf[k]();
        yield { done: k + 1, total: base.snaps.length };
    }
    // The plan's last year is the one measured, so stopping then has setting up the cash
    // buffer, and the tax on it, counted as if it went on: it stands at the year before's.
    if (rows.length > 1) {
        const prev = rows[rows.length - 2], lastRow = rows[rows.length - 1];
        lastRow.forever = prev.forever * (p.assume.real ? 1 : 1 + infl);
        lastRow.enoughForever = lastRow.have >= 0 && lastRow.have >= lastRow.forever;
    }
    const earliest = rows.findIndex(r => r.enough);
    const foreverAt = rows.findIndex(r => r.enoughForever);
    // Told from the year the savings get there, or short of the last, whose own start is measured.
    const month = tailOf[Math.max(0, Math.min(foreverAt < 0 ? rows.length : foreverAt, rows.length - 2))]();
    // A year's, if not worked out already, when it is asked for, and kept.
    const spendAt = (t) => {
        if (!(t in spent)) { const k = rows.findIndex(r => r.t === t); spent[t] = k < 0 ? undefined : spendOf[k](); }
        return spent[t];
    };
    const retiresLater = ret.date > base.start;
    const best = retiresLater ? fpRetireMax(p, 0) : null;
    return { rows: rows, earliest: earliest < 0 ? null : earliest, foreverAt: foreverAt < 0 ? null : foreverAt, until: ret.until, start: base.start, spendAt: spendAt,
        spend: { now: spendAt(0), plan: best === 0 ? null : best, later: retiresLater, retireAt: ret.atMonths, set: fpRetireSpending(p) },
        tail: Object.assign(month, { age: rows[rows.length - 1].age, spend: month.living + month.health + month.loans + month.goals }) };
}

/**
 * fpNeededToStop for the plan as it stands, worked out a moment after typing stops — it
 * runs the plan thousands of times — and kept on the widget until the plan, the rules or
 * the month change. It goes a couple of years at a time, the page free between them and a
 * bar showing how far it has got; a change starts it again. Meanwhile the last figures are
 * shown, marked as out of date. Returns { value, stale }, value null until there is one.
 */
function fpNeededFor(widget, plan) {
    const key = fpLaterKey(plan);
    const had = widget._needed;
    if (had && had.key === key) return { value: had.value, stale: false };
    const running = widget._neededJob;
    if (running && running.key === key) return { value: had ? had.value : null, stale: true };
    if (running) clearTimeout(running.timer);
    const job = widget._neededJob = { key: key, done: 0, total: 0 };
    job.timer = setTimeout(() => {
        if (!widget.isConnected) { widget._neededJob = null; return; }
        const now = fpGet(fpToolId(widget));
        job.key = fpLaterKey(now);
        const steps = fpNeededSteps(now, true);
        const next = () => {
            if (widget._neededJob !== job) return;
            if (!widget.isConnected) { widget._neededJob = null; return; }
            let step = steps.next();
            if (!step.done) step = steps.next();
            if (step.done) {
                widget._neededJob = null;
                widget._needed = { key: job.key, value: step.value };
                fpRenderDerived(widget, now);
                return;
            }
            job.done = step.value.done; job.total = step.value.total;
            fpShowProgress(widget, job);
            job.timer = setTimeout(next, 0);
        };
        next();
    }, 300);
    return { value: had ? had.value : null, stale: true };
}

/** The bar for work under way, hidden until it has a total to show against. */
function fpProgressHtml(job) {
    return '<div class="fp-progress" role="progressbar" aria-label="Working out figures" aria-valuemin="0"' + (job.total ? '' : ' hidden') + ' aria-valuemax="' + job.total + '" aria-valuenow="' + job.done + '">' +
        '<div class="fp-progress-track"><div class="fp-progress-fill" style="width:' + (job.total ? job.done / job.total * 100 : 0).toFixed(1) + '%"></div></div>' +
        '<span class="fp-progress-text">Working out figures: ' + job.done + ' of ' + job.total + ' years</span></div>';
}

/** The bar brought up to date, without drawing the rest again. */
function fpShowProgress(widget, job) {
    const bar = widget.querySelector('.fp-progress');
    if (!bar) return;
    bar.hidden = false;
    bar.setAttribute('aria-valuemax', job.total);
    bar.setAttribute('aria-valuenow', job.done);
    bar.querySelector('.fp-progress-fill').style.width = (job.done / job.total * 100).toFixed(1) + '%';
    bar.querySelector('.fp-progress-text').textContent = 'Working out figures: ' + job.done + ' of ' + job.total + ' years';
}

/** fpGoalSaving the same way — and at once, with nothing to work out. */
function fpGoalSavingFor(widget, plan) {
    const into = fpSurplusAccount(plan);
    if (!fpEntries(plan.goals).some(g => { const a = fpGoalAccount(plan, g); return a && a.id !== into; })) return { value: {}, stale: false };
    return fpLater(widget, '_goalSave', plan, fpGoalSaving);
}

/** What work on a plan depends on: the plan, the rules and the month. */
function fpLaterKey(plan) {
    let raw = null;
    try { raw = localStorage.getItem(TAX_TABLE_KEY); } catch (e) { raw = null; }
    return JSON.stringify(plan) + '|' + raw + '|' + fpYm(new Date());
}

/** Work that runs the plan many times, done a moment after typing stops and kept on the
 *  widget, under `slot`, until the plan, the rules or the month change. */
function fpLater(widget, slot, plan, compute) {
    const keyOf = fpLaterKey;
    const key = keyOf(plan);
    const had = widget[slot];
    if (had && had.key === key) return { value: had.value, stale: false };
    clearTimeout(widget[slot + 'Timer']);
    widget[slot + 'Timer'] = setTimeout(() => {
        if (!widget.isConnected) return;
        const now = fpGet(fpToolId(widget));
        widget[slot] = { key: keyOf(now), value: compute(now) };
        fpRenderDerived(widget, now);
    }, 300);
    return { value: had ? had.value : null, stale: true };
}

/** The earliest year the savings reach what is needed to stop working, in words. */
function fpNeededText(need, html) {
    if (!need || !need.rows) return '';
    const b = (s) => html ? '<b>' + s + '</b>' : s;
    if (need.earliest === null) return 'Savings do not reach what is needed to stop working and last to ' + need.until;
    const r = need.rows[need.earliest];
    return 'Could stop working ' + (r.t === 0 ? b('now') : 'in ' + b(String(r.year))) + ', at ' + r.age + ': ' + fpMoney(r.needed) + ' needed, ' + fpMoney(r.have) + ' saved';
}

const FP_FOREVER_TIP = 'The first year the savings you can draw on — not property — would never run out: by the end of the plan, what they earn covers what is drawn and inflation. At the plan’s returns every year, with no allowance for bad ones';

/** The earliest year the savings reach what would last forever, in words. */
function fpForeverText(need, html) {
    if (!need || !need.rows) return '';
    const b = (s) => html ? '<b>' + s + '</b>' : s;
    if (need.foreverAt === null) return need.rows.every(r => r.forever === Infinity) ?
        'Savings could not last forever: what they earn does not outrun inflation' : 'Savings do not reach what would last forever';
    const r = need.rows[need.foreverAt];
    return 'Could live on savings forever ' + (r.t === 0 ? b('now') : 'from ' + b(String(r.year))) + ', at ' + r.age + ': ' + fpMoney(r.forever) + ' needed, ' + fpMoney(r.have) + ' saved';
}

/** The spending the plan has now, to set beside what could be spent. */
function fpSetText(need) {
    const set = need && need.spend && need.spend.set;
    return typeof set === 'number' ? 'currently set at ' + fpMoney(set) + ' a month' : '';
}

/** The most that could be spent and last, stopping now and on the plan's date, in words. */
function fpLastToText(need, html) {
    const c = need && need.spend;
    if (!c) return '';
    const b = (s) => html ? '<b>' + s + '</b>' : s;
    const start = 'To last to ' + need.until + ': ', extras = ' on top of health costs, goals and loans';
    const retiring = 'retiring at ' + fpAgeText(c.retireAt);
    const figure = (v) => 'up to ' + b(fpMoney(v)) + ' a month ';
    const set = fpSetText(need) ? '; ' + fpSetText(need) : '';
    if (!c.now && (!c.later || !c.plan)) return start + (c.later ? 'neither stopping now nor ' + retiring + ' leaves anything' : 'stopping now leaves nothing') + ' to spend' + extras + set;
    const now = c.now ? figure(c.now) + 'stopping now' : 'stopping now leaves nothing to spend';
    const later = !c.later ? '' : !c.plan ? ', but nothing ' + retiring : (c.now ? ', or ' : '; ') + figure(c.plan) + retiring;
    return start + now + later + ', in today’s money,' + extras + set;
}

/** The most that could be spent with work stopped at month `t`, as a year's row ends, for its
 *  breakdown and, `short`, its place on the chart. */
function fpYearSpendText(need, t, short) {
    if (!need || !need.rows) return '';
    if (!need.rows.some(r => r.t === t)) return short ? 'no spending figure for the plan’s last year' : 'No spending figure for the plan’s last year.';
    const can = need.spendAt(t), until = need.until;
    const set = fpSetText(need);
    if (short) return (can ? 'could spend up to ' + fpMoney(can) + ' a month to last to ' + until : 'nothing to spend and last to ' + until) + (set ? ', ' + set : '');
    const when = 'With work stopped ' + (t === 0 ? 'now' : 'in ' + fpMonthAt(need.start, t + 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }));
    return can ? when + ', you could spend up to ' + fpMoney(can) + ' a month in today’s money and last to ' + until + ', on top of health costs, goals and loans' + (set ? '; ' + set : '') + '.' :
        when + ', there would be nothing to spend, beyond health costs, goals and loans, and last to ' + until + (set ? '; ' + set : '') + '.';
}

/** What a month comes to at the plan's end, part by part. */
function fpTailParts(tail) {
    return [['living costs', tail.living], ['health', tail.health], ['loans', tail.loans], ['goals', tail.goals]].filter(p => p[1] >= 0.5).map(p => p[0] + ' ' + fpMoney(p[1])).join(', ');
}

/** The month that sets the end of the lines, in words: what savings are left to pay. */
function fpTailText(need, html) {
    const t = need && need.tail;
    if (!t) return '';
    const b = (s) => html ? '<b>' + s + '</b>' : s;
    const spend = Math.round(t.spend), income = Math.round(t.income), left = spend - income, tax = Math.round(t.tax);
    const start = 'What sets the end of the lines: ' + b(fpMoney(spend)) + ' a month at ' + t.age + ' in today’s money, ';
    if (left <= 0) return start + 'all covered by ' + fpMoney(income) + ' of income, leaving savings nothing to pay' + (tax ? ' but ' + fpMoney(tax) + ' of tax' : '');
    return start + (income > 0 ? fpMoney(income) + ' of it covered by income, leaving ' : 'all of it left for savings: ') + b(fpMoney(left)) + (tax ? ' plus ' + fpMoney(tax) + ' tax' : '') + (income > 0 ? ' for savings to pay' : '');
}

// ---- Where the next dollar goes ------------------------------------------------------------
//
// The order most guides give for saving — a little cash, the employer's match, expensive
// debt, a full emergency fund, then the tax-favoured accounts, then the rest — worked
// through with the plan's own figures, each step saying where the plan stands. Then the
// month's leftover (or a sum typed in) split along those steps, and a stocks and bonds
// mix for the years to retirement. Rules of thumb, shown with their reasons: an estimate,
// not advice.

const FP_RISK = { cautious: { label: 'Cautious', shift: -15 }, middle: { label: 'Middle', shift: 0 }, bold: { label: 'Bold', shift: 10 } };

function fpAdviceFields(plan, attr) {
    const a = plan.advice;
    return '<div class="fp-assume fp-advice-set">' +
        '<label title="Cash to keep before anything else, in months of spending">Starter cash <input class="fp-in fp-num fp-small" type="number" step="0.5" min="0" data-a="advice" data-k="starter" value="' + attr(a.starter) + '"> month</label>' +
        '<label title="The emergency fund, in months of spending">Emergency fund <input class="fp-in fp-num fp-small" type="number" step="1" min="0" data-a="advice" data-k="months" value="' + attr(a.months) + '"> months</label>' +
        '<label title="Debts at this rate or above are paid off before investing more">Debt above <input class="fp-in fp-num fp-small" type="number" step="0.5" min="0" data-a="advice" data-k="debtRate" value="' + attr(a.debtRate) + '"> % first</label>' +
        '<label title="How much the stocks and bonds mix leans one way or the other">Risk <select class="fp-in" data-a="advice" data-k="risk">' +
            Object.keys(FP_RISK).map(k => '<option value="' + k + '"' + (a.risk === k ? ' selected' : '') + '>' + FP_RISK[k].label + '</option>').join('') + '</select></label>' +
        '<label title="A sum to place now, instead of this month’s leftover">Or place a sum of <input class="fp-in fp-num" type="number" step="100" min="0" data-a="advice" data-k="lump" value="' + attr(a.lump) + '" placeholder="0"></label>' +
        '</div>';
}

/**
 * The federal tax on the next $1,000 of ordinary income, as a rate: this year, and in
 * retirement — the years pre-tax money is drawn (ordinary income then), averaged, since
 * that is when a traditional dollar is taxed; or every retired year, if none is drawn.
 */
function fpMarginal(plan, proj) {
    const info = fpTaxInfo(plan);
    if (!info || !info.federal) return null;
    const at = (r) => (fpFederalTax(info, r.ordinary + 1000, r.benefits, 0, r.index) - fpFederalTax(info, r.ordinary, r.benefits, 0, r.index)) / 1000;
    const now = proj.rows[1] ? at(proj.rows[1]) : null;
    const ms = proj.milestones;
    const retired = proj.retire && ms.retire !== null ? proj.rows.filter(r => r.t >= ms.retire + 12 && r.retired) : [];
    const drawing = retired.filter(r => r.ordinary > 1);
    const years = drawing.length ? drawing : retired;
    if (!years.length) return { now: now, later: null };
    return { now: now, later: years.reduce((s, r) => s + at(r), 0) / years.length, from: years[0].year, to: years[years.length - 1].year, drawing: drawing.length > 0 };
}

/** The steps, each { key, title, status: 'done'|'part'|'todo'|'skip', text, monthly, lump }. */
function fpAdviceSteps(plan, proj, goalSave) {
    plan = fpCalc(plan);
    const a = plan.advice || {};
    const f = proj.first;
    const spend = f.expenses + f.payments + f.escrow;
    const cash = fpEntries(plan.accounts).filter(x => x.kind === 'cash').reduce((s, x) => s + Math.max(0, fpBalanceOf(plan, x)), 0);
    const steps = [];
    const push = (s) => steps.push(s);
    // 1. A little cash first.
    const starter = Math.max(0, fpNum(a.starter, 1)) * spend;
    push({ key: 'starter', title: 'Starter cash', status: cash >= starter ? 'done' : cash > 0 ? 'part' : 'todo', lump: Math.max(0, starter - cash),
        text: cash >= starter ? fpMoney(cash) + ' in cash covers ' + fpNum(a.starter, 1) + ' month of spending (' + fpMoney(spend) + ').'
            : 'Keep ' + fpMoney(starter) + ' in cash — ' + fpNum(a.starter, 1) + ' month of spending — before anything else: ' + fpMoney(starter - cash) + ' to go.' });
    // 2. The employer's match: free money.
    const lines = fpEntries(plan.incomes).filter(l => l.type !== 'ss' && fpActive(l, fpYm(new Date())));
    const matches = lines.map(l => ({ l: l, m: fpMatchOf(plan, l) })).filter(x => x.m);
    const typed = lines.some(l => fpIntoOf(plan, l).some(r => r.match > 0));
    if (matches.length) {
        // What can be put in stops at the 401(k) limit: the match beyond it is out of reach.
        const gap = matches.reduce((s, x) => s + Math.max(0, x.m.reach - x.m.own), 0);
        const got = matches.reduce((s, x) => s + x.m.match, 0), best = matches.reduce((s, x) => s + x.m.best, 0), full = matches.reduce((s, x) => s + x.m.full, 0);
        const limited = matches.some(x => x.m.limited), odd = matches.find(x => x.m.odd);
        push({ key: 'match', title: 'The full employer match', status: gap <= 0.5 ? 'done' : got > 0 ? 'part' : 'todo', monthly: gap,
            text: (odd ? '<span class="fp-neg">The formula says up to ' + odd.m.cap + '% of pay — unusually high; a match is usually up to 3–6%. Check it on the pay line.</span> ' : '') +
                (gap <= 0.5 ? (limited ? 'You get ' + fpMoney(got) + ' a month: as much as your 401(k) limit lets the formula give.' : 'You get all of it: ' + fpMoney(full) + ' a month.')
                : 'You get ' + fpMoney(got) + ' of ' + fpMoney(best) + ' a month. Putting ' + fpMoney(gap) + ' more a month into the 401(k)' + (limited ? ', to your limit,' : '') + ' gets ' +
                    (limited ? fpMoney(best - got) + ' more' : 'the rest') + ' — an instant ' + Math.round(matches[0].m.rate) + '% return.') });
    } else push({ key: 'match', title: 'The full employer match', status: typed ? 'part' : 'skip',
        text: typed ? 'A match is in the plan as an amount. Give its formula on the pay line (▸) — so much of what you put in, up to so much of pay — to see whether you get all of it.'
            : 'No employer match in the plan. If your employer offers one, it comes before everything below: give its formula on the pay line (▸).' });
    // 3. Expensive debt.
    const rate = Math.max(0, fpNum(a.debtRate, 8));
    const dear = fpEntries(plan.accounts).filter(x => (FP_KINDS[x.kind] || FP_KINDS.other).side === 'liability' && fpBalanceOf(plan, x) > 0 && fpRateOf(plan, x) >= rate)
        .sort((p, q) => fpRateOf(plan, q) - fpRateOf(plan, p));
    const dearOwed = dear.reduce((s, x) => s + fpBalanceOf(plan, x), 0);
    push({ key: 'debt', title: 'Debt at ' + rate + '% or more', status: dear.length ? 'todo' : 'done', lump: dearOwed, monthly: dear.length ? Infinity : 0, debts: dear,
        text: dear.length ? 'Pay off ' + dear.map(x => escapeHtml(x.name || fpKindLabel(x)) + ' (' + fpMoney(fpBalanceOf(plan, x)) + ' at ' + fpRateOf(plan, x) + '%)').join(', then ') +
            ' before investing more: every dollar there earns its rate, for certain.' : 'None: no debt at ' + rate + '% or more.' });
    // 4. A full emergency fund.
    const fund = Math.max(0, fpNum(a.months, 6)) * spend;
    push({ key: 'fund', title: 'Emergency fund', status: cash >= fund ? 'done' : cash >= starter ? 'part' : 'todo', lump: Math.max(0, fund - Math.max(cash, starter)),
        text: cash >= fund ? fpMoney(cash) + ' in cash is ' + (cash / Math.max(1, spend)).toFixed(1) + ' months of spending: enough.'
            : fpMoney(cash) + ' in cash is ' + (cash / Math.max(1, spend)).toFixed(1) + ' months of spending; ' + fpNum(a.months, 6) + ' months is ' + fpMoney(fund) + ': ' + fpMoney(fund - cash) + ' to go.' });
    // 4¼. Goals ahead: set aside for them, so they are not paid by drawing on savings.
    const goals = fpEntries(plan.goals).map(g => ({ g: g, o: proj.milestones.goals && proj.milestones.goals[g.id] })).filter(x => x.o);
    const saving = (goalSave && goalSave.value) || {};
    const shortOf = (x) => x.o.own ? x.o.due - x.o.fromOwn : x.o.retired ? 0 : x.o.drawn;
    const short = goals.filter(x => shortOf(x) >= 1);
    const goalMonthly = short.reduce((s, x) => s + (saving[x.g.id] || 0), 0);
    const nm = (x) => escapeHtml(x.g.name || 'A goal');
    push({ key: 'goals', title: 'Goals ahead', status: !goals.length ? 'skip' : !short.length ? 'done' : short.length < goals.length ? 'part' : 'todo', monthly: goalMonthly,
        goals: short.filter(x => saving[x.g.id] > 0).map(x => ({ name: x.g.name || 'a goal', monthly: saving[x.g.id] })),
        text: !goals.length ? 'No goals in the plan. College, a car or a new roof ahead? Add it in Goals, with the account it is paid from, to see what to set aside a month.'
            : !short.length ? 'Each goal is covered: ' + goals.map(x => nm(x) + ' (' + fpMoney(x.o.due) + ')').join(', ') + '.'
            : short.map(x => nm(x) + ' is short ' + fpMoney(shortOf(x)) + (saving[x.g.id] > 0 ? ': ' + fpMoney(saving[x.g.id]) + ' a month more into ' + escapeHtml((fpGoalAccount(plan, x.g) || {}).name || 'its account') + ' covers it'
                : !x.o.own ? ': choose an account to pay it from, in Goals, to see what a month covers it' : '')).join('; ') + '.' +
                (short.some(x => /college|universit|school|tuition|educat/i.test(x.g.name || '')) && !fpEntries(plan.accounts).some(a => a.kind === 'education') ? ' For school, a 529 grows and is spent untaxed.' : '') });
    // 4½. An HSA, with a high-deductible health plan: untaxed in, untaxed out for medical costs.
    const hsas = fpEntries(plan.accounts).filter(x => x.kind === 'hsa');
    const hsaRoom = (() => {
        const lim = fpGroupLimit(plan, 'hsa', hsas);
        const c = hsas.length ? fpLimitCheck(plan, hsas[0]) : null;
        return { limit: lim.limit, used: c ? c.yearly : 0, left: Math.max(0, lim.limit - (c ? c.yearly : 0)) };
    })();
    push({ key: 'hsa', title: 'An HSA', status: !hsas.length ? 'skip' : hsaRoom.left <= 0.5 ? 'done' : hsaRoom.used > 0 ? 'part' : 'todo', monthly: hsas.length ? hsaRoom.left / 12 : 0, lump: hsas.length ? hsaRoom.left : 0,
        text: !hsas.length ? 'With a high-deductible health plan, an HSA comes next: untaxed going in (and free of payroll tax through pay), untaxed coming out for medical costs. Add one in Accounts to see its room.'
            : hsaRoom.left <= 0.5 ? 'Full: ' + fpMoney(hsaRoom.used) + ' a year, the limit.' : fpMoney(hsaRoom.left) + ' of room this year (' + fpMoney(hsaRoom.left / 12) + ' a month) — best through pay, free of payroll tax too.' });
    // 5. Roth or traditional: the tax rate now against the rate in retirement.
    const mr = fpMarginal(plan, proj);
    let lean = null, leanText;
    if (!mr || mr.now === null) leanText = 'Turn on the federal estimate (Income) to compare the tax rate now with the one in retirement.';
    else if (mr.later === null) leanText = 'Your next dollar is taxed at ' + Math.round(mr.now * 100) + '% now. Plan for retirement (with a birth month) to compare it with the rate then.';
    else {
        const d = mr.now - mr.later;
        lean = d > 0.02 ? 'traditional' : d < -0.02 ? 'roth' : 'split';
        leanText = 'Your next dollar is taxed at ' + Math.round(mr.now * 100) + '% now, and about ' + Math.round(mr.later * 100) + '% in retirement' +
            (mr.drawing ? ', in the years pre-tax money is drawn (' + mr.from + (mr.to !== mr.from ? '–' + mr.to : '') + ')' : ' (' + mr.from + '–' + mr.to + ')') + '. ' +
            (lean === 'traditional' ? 'Lower later: traditional — the tax saved now is more than the tax paid then.'
                : lean === 'roth' ? 'Higher later: Roth — pay the tax now, at the lower rate.' : 'Much the same: splitting between Roth and traditional hedges either way.');
    }
    push({ key: 'lean', title: 'Roth or traditional', status: 'info', lean: lean, text: leanText });
    // 6. An IRA, and 7. the rest of the 401(k): the room left in each limit.
    const accts = fpEntries(plan.accounts).filter(x => x.kind === 'retirement');
    const room = (ira) => {
        const key = ira ? 'ira' : '401k';
        const one = accts.find(x => fpLimitGroup(x) === key);
        const c = one ? fpLimitCheck(plan, one) : null;
        const full = c ? c.limit : fpGroupLimit(plan, key).limit;
        return { c: c, full: full, used: c ? c.yearly : 0, left: Math.max(0, full - (c ? c.yearly : 0)), has: !!one };
    };
    const ira = room(true), k401 = room(false);
    const rothOk = (() => {
        const c = ira.c;
        if (c && c.phase) return { ok: c.rothLimit > 0, limit: c.rothLimit, phase: c.phase };
        const L = taxRulesFor(plan.tax.year).limits, married = plan.tax.status === 'married';
        const magi = lines.filter(l => l.taxed !== false).reduce((s, l) => s + (fpMonthly(l) - fpPretaxPay(plan, l)) * 12, 0);
        const from = married ? L.rothMarriedFrom : L.rothSingleFrom, to = married ? L.rothMarriedTo : L.rothSingleTo;
        return { ok: magi < to, limit: magi <= from ? ira.full : magi >= to ? 0 : Math.max(200, Math.ceil(ira.full * (to - magi) / (to - from) / 10) * 10), magi: magi };
    })();
    const iraKind = lean === 'traditional' || !rothOk.ok ? 'a traditional IRA' : 'a Roth IRA';
    push({ key: 'ira', title: 'An IRA', status: ira.left <= 0.5 ? 'done' : ira.used > 0 ? 'part' : 'todo', monthly: ira.left / 12, lump: ira.left,
        text: ira.left <= 0.5 ? 'Full: ' + fpMoney(ira.used) + ' a year, the limit.' : fpMoney(ira.left) + ' of room this year (' + fpMoney(ira.left / 12) + ' a month), in ' + iraKind + '.' +
            (!rothOk.ok ? ' Income is over the Roth IRA range, so a Roth IRA takes nothing directly.' : '') });
    push({ key: 'k401', title: 'The rest of the 401(k)', status: !k401.has && !lines.some(l => fpMatchOf(plan, l)) ? 'skip' : k401.left <= 0.5 ? 'done' : 'part', monthly: k401.left / 12,
        text: !k401.has ? 'No 401(k) in the plan. With one at work, its limit is ' + fpMoney(k401.full) + ' a year.'
            : k401.left <= 0.5 ? 'Full: ' + fpMoney(k401.used) + ' a year.' : fpMoney(k401.used) + ' of ' + fpMoney(k401.full) + ' a year: ' + fpMoney(k401.left / 12) + ' a month of room, ' +
                (lean === 'roth' ? 'as Roth' : lean === 'traditional' ? 'as traditional' : 'split Roth and traditional') + '. It comes from pay: raise the contribution.' });
    // 8. After that: cheaper debt against investing.
    const cheap = fpEntries(plan.accounts).filter(x => (FP_KINDS[x.kind] || FP_KINDS.other).side === 'liability' && fpBalanceOf(plan, x) > 0 && fpRateOf(plan, x) < rate)
        .sort((p, q) => fpRateOf(plan, q) - fpRateOf(plan, p));
    const ret = fpNum(plan.assume.returns.investment, FP_KINDS.investment.rate);
    const top = cheap[0];
    push({ key: 'beyond', title: 'Then: invest, or pay debt down faster', status: 'info', monthly: Infinity, cheap: top || null, invest: !top || ret > fpRateOf(plan, top),
        text: top ? escapeHtml(top.name || fpKindLabel(top)) + ' costs ' + fpRateOf(plan, top) + '%; investments are assumed to earn ' + ret + '% a year, before tax and with ups and downs. ' +
            (ret - fpRateOf(plan, top) > 2 ? 'Investing is expected to come out ahead.' : 'Close: paying it down is the certain return.') : 'No other debt: invest, in a brokerage account.' });
    return steps;
}

/** This month's leftover, or the sum typed, placed along the steps. */
function fpAdviceSplit(plan, steps, amount, lump) {
    const out = [];
    let left = amount;
    const take = (key, label, cap) => { if (left <= 0.5 || cap <= 0.5) return; const v = Math.min(left, cap); out.push({ key: key, label: label, amount: v }); left -= v; };
    const by = {};
    steps.forEach(s => { by[s.key] = s; });
    take('starter', 'Starter cash', by.starter.lump || 0);
    if (!lump) take('match', 'More into the 401(k), for the full match', by.match.monthly || 0);
    (by.debt.debts || []).forEach(d => take('debt', 'Pay down ' + (d.name || fpKindLabel(d)), fpBalanceOf(plan, d)));
    take('fund', 'The emergency fund', by.fund.lump || 0);
    if (!lump && by.goals) (by.goals.goals || []).forEach(g => take('goals', 'Toward ' + g.name, g.monthly));
    take('hsa', 'An HSA', lump ? by.hsa.lump || 0 : by.hsa.monthly || 0);
    take('ira', 'An IRA', lump ? by.ira.lump || 0 : by.ira.monthly || 0);
    if (!lump) take('k401', 'More into the 401(k)', by.k401.monthly || 0);
    if (left > 0.5) take('beyond', by.beyond.invest ? 'A brokerage account' : 'Pay down ' + (by.beyond.cheap.name || fpKindLabel(by.beyond.cheap)), Infinity);
    return out;
}

/** A stocks share for the years to retirement — as target-date funds step down — leaned by
 *  the risk chosen; its expected return from the two rates. */
function fpAdviceMix(plan, proj) {
    const a = plan.advice || {};
    const birth = fpBirthOf(plan);
    if (!birth) return null;
    const ret = fpRetireInfo(plan);
    const retAge = ret && !ret.missing ? ret.atMonths / 12 : fpNum((plan.retire || {}).ageYears, 65) + fpNum((plan.retire || {}).ageMonths, 0) / 12;
    const now = new Date();
    const age = (now.getFullYear() * 12 + now.getMonth() - (birth.y * 12 + birth.m)) / 12;
    const years = retAge - age;
    let stocks = years >= 25 ? 90 : years >= 0 ? 50 + 40 * years / 25 : Math.max(30, 50 + 20 * years / 20);
    stocks = Math.round(Math.max(20, Math.min(100, stocks + (FP_RISK[a.risk] || FP_RISK.middle).shift)) / 5) * 5;
    const sr = fpNum(a.stocks, 8), br = fpNum(a.bonds, 4);
    return { years: years, stocks: stocks, bonds: 100 - stocks, ret: Math.round((sr * stocks + br * (100 - stocks)) / 10) / 10, sr: sr, br: br };
}

function fpAdviceHtml(plan, proj, low, high, goalSave) {
    const steps = fpAdviceSteps(plan, proj, goalSave);
    const mark = { done: '✓', part: '◐', todo: '○', skip: '–', info: 'i' };
    const label = { done: 'Done', part: 'Part way', todo: 'To do', skip: 'Not in the plan', info: 'To weigh' };
    let n = 0;
    const list = '<ol class="fp-steps">' + steps.map(s => '<li class="fp-step fp-step-' + s.status + '" data-step="' + s.key + '"><span class="fp-step-mark" title="' + label[s.status] + '" aria-label="' + label[s.status] + '">' + mark[s.status] + '</span>' +
        '<div><b>' + (++n) + '. ' + s.title + '</b> <span class="fp-muted">' + label[s.status] + '</span><div class="fp-step-text">' + s.text + '</div></div></li>').join('') + '</ol>';
    const lumpTyped = fpNum((plan.advice || {}).lump, 0) > 0;
    const amount = lumpTyped ? fpNum(plan.advice.lump, 0) : Math.max(0, proj.first.surplus);
    const split = fpAdviceSplit(plan, steps, amount, lumpTyped);
    const splitHtml = amount <= 0.5 ? '<div class="fp-note">Nothing left over this month to place. Type a sum above to see where it would go.</div>'
        : '<div class="fp-split"><div><b>' + (lumpTyped ? fpMoney(amount) + ' now' : fpMoney(amount) + ' a month left over') + '</b>, step by step:</div><ul>' +
            split.map(x => '<li data-split="' + x.key + '"><b>' + fpMoney(x.amount) + '</b> ' + escapeHtml(x.label) + '</li>').join('') + '</ul>' +
            (lumpTyped ? '<div class="fp-note">A sum cannot buy the employer match or go into a 401(k) directly: those come from pay. Raise the contribution and live on the sum instead.</div>' : '') + '</div>';
    const mix = fpAdviceMix(plan, proj);
    let mixHtml;
    if (!mix) mixHtml = '<div class="fp-note">With a birth month (Retirement, or a Social Security line), it suggests a stocks and bonds mix for the years to retirement.</div>';
    else {
        const ret = proj.retire, ms = proj.milestones;
        let margin = '';
        if (ret && low && high) {
            const lo = low.milestones.runsOut === null, base = ms.runsOut === null, hi = high.milestones.runsOut === null;
            const s = fpNum(plan.assume.spread, 0);
            margin = lo ? '<span class="fp-pos">The money lasts even at returns ' + s + '% lower: there is room to take less risk.</span>'
                : base ? '<span>It lasts at the assumed returns but not at ' + s + '% lower: it depends on returns holding up.</span>'
                : hi ? '<span class="fp-neg">It lasts only if returns are ' + s + '% higher: the plan relies on luck — save more, spend less, or work longer.</span>'
                : '<span class="fp-neg">It runs out even at higher returns: more risk will not fix it — save more, spend less, or work longer.</span>';
        }
        mixHtml = '<div class="fp-mix"><div><b>A mix for ' + (mix.years > 0 ? Math.round(mix.years) + ' years to retirement' : 'retirement') + '</b> (' + (FP_RISK[(plan.advice || {}).risk] || FP_RISK.middle).label.toLowerCase() + ' risk): ' +
            '<b>' + mix.stocks + '% stocks</b>, ' + mix.bonds + '% bonds, as target-date funds step down.</div>' +
            '<div class="fp-mix-bar" role="img" aria-label="' + mix.stocks + '% stocks, ' + mix.bonds + '% bonds"><span class="fp-mix-stocks" style="width:' + mix.stocks + '%"></span><span class="fp-mix-bonds" style="width:' + mix.bonds + '%"></span></div>' +
            '<div>Expected about <b>' + mix.ret + '%</b> a year, at ' + mix.sr + '% for stocks and ' + mix.br + '% for bonds. ' +
                '<button type="button" class="fp-btn" onclick="fpUseMixReturn(this)" title="Set the default return for investment and retirement accounts to it">Use ' + mix.ret + '% for investments</button></div>' +
            (margin ? '<div class="fp-margin">' + margin + '</div>' : '') + '</div>';
    }
    return list + '<h5 class="fp-advice-h">Placing ' + (lumpTyped ? 'the sum' : 'what is left over') + '</h5>' + splitHtml + '<h5 class="fp-advice-h">How much risk</h5>' + mixHtml +
        '<div class="fp-note">Rules of thumb, worked through with your figures: an estimate, not advice. Fees, fund choices, an HSA, a spouse’s accounts and state taxes are not in it.</div>';
}

/** The mix's expected return, as the default for investment and retirement accounts. */
/** The draw order back to the usual one: cash, investments, other, pre-tax, Roth, the HSA. */
function fpResetDrawOrder(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const plan = fpGet(toolId);
    plan.drawOrder = [];
    plan.drawOrder = fpDrawOrder(plan, true).map(a => ({ id: a.id }));
    fpSet(toolId, plan);
    fpRender(widget);
}

function fpUseMixReturn(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const plan = fpGet(toolId);
    const mix = fpAdviceMix(plan);
    if (!mix) return;
    plan.assume.returns.investment = mix.ret;
    plan.assume.returns.retirement = mix.ret;
    fpSet(toolId, plan);
    fpRender(widget);
}

/** Today's position: assets and liabilities by kind. */
function fpRollup(plan) {
    plan = fpCalc(plan);
    const by = {};
    let assets = 0, liabilities = 0;
    plan.accounts.forEach(a => {
        const k = FP_KINDS[a.kind] ? a.kind : 'other';
        const b = fpBalanceOf(plan, a);
        by[k] = (by[k] || 0) + b;
        if (FP_KINDS[k].side === 'liability') liabilities += b; else assets += b;
    });
    return { by: by, assets: assets, liabilities: liabilities, net: assets - liabilities };
}

function fpMoney(n, short) {
    const v = Math.round(n);
    if (short) {
        const a = Math.abs(v);
        const s = a >= 1e6 ? (a / 1e6).toFixed(a >= 1e7 ? 0 : 1) + 'M' : a >= 1e3 ? Math.round(a / 1e3) + 'k' : String(a);
        return (v < 0 ? '−$' : '$') + s;
    }
    return (v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString();
}

function fpMonthText(start, t) {
    return new Date(start.getFullYear(), start.getMonth() + t - 1, 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

// ---- Drawing it ------------------------------------------------------------------------

function fpInit() {
    document.querySelectorAll('.fp-widget').forEach(w => fpRender(w));
}

function fpRender(widget) {
    const toolId = fpToolId(widget);
    if (!toolId) return;
    const plan = fpGet(toolId);
    const attr = (v) => escapeHtml(v === null || v === undefined ? '' : String(v));
    // Retirement is offered as its four types; the choice sets the kind, the plan and the tax.
    const kindOptions = (a) => Object.keys(FP_KINDS).map(k => k === 'retirement'
        ? Object.keys(FP_RET_TYPES).map(t => '<option value="retirement:' + t + '"' + (a.kind === 'retirement' && fpRetKey(a) === t ? ' selected' : '') + '>' + FP_RET_TYPES[t] + '</option>').join('')
        : '<option value="' + k + '"' + (k === a.kind ? ' selected' : '') + '>' + FP_KINDS[k].label + '</option>').join('');
    widget._open = widget._open || new Set();
    // Which entries sit under a folded section: drawn, but out of sight.
    const under = {};
    ['accounts', 'incomes', 'expenses', 'goals'].forEach(list => fpSectionsOf(plan[list]).forEach(g => {
        if (g.section && g.section.folded) g.entries.forEach(x => { under[x.id] = true; });
    }));
    const secRow = (s, list, cols) => '<tr data-id="' + attr(s.id) + '" data-list="' + list + '" class="fp-movable fp-sec-row' + (s.folded ? ' fp-sec-folded' : '') + '"' +
            ' ondragover="fpDragOver(event, this)" ondragleave="fpDragLeave(this)" ondrop="fpDrop(event, this)">' +
        '<td colspan="' + cols + '"><div class="fp-sec-head">' + fpGrip(s.name || 'section') +
            '<button type="button" class="fp-sec-fold" onclick="fpSectionFold(this)" aria-expanded="' + !s.folded + '" title="' + (s.folded ? 'Show' : 'Hide') + ' what is in it">' + (s.folded ? '▸' : '▾') + '</button>' +
            '<input class="fp-in fp-sec-name" data-f="name" value="' + attr(s.name) + '" placeholder="Section name" aria-label="Section name">' +
            '<span class="fp-sec-total"></span>' +
            '<button type="button" class="fp-x" onclick="fpRemove(this)" title="Remove the section; what is in it stays">×</button></div></td></tr>';
    const accounts = plan.accounts.map(a => {
        if (fpIsSection(a)) return secRow(a, 'accounts', 6);
        const kind = FP_KINDS[a.kind] || FP_KINDS.other;
        const liability = kind.side === 'liability';
        const detailed = kind.tool === 'loan-calculator' || kind.tool === 'dynamic-investment-calculator';
        const open = detailed && widget._open.has(a.id);
        const main = '<tr data-id="' + attr(a.id) + '" data-list="accounts" class="fp-acc fp-movable' + (a.off ? ' fp-line-off' : '') + (open ? ' fp-open' : '') + (under[a.id] ? ' fp-under-folded' : '') + '"' +
                ' ondragover="fpDragOver(event, this)" ondragleave="fpDragLeave(this)" ondrop="fpDrop(event, this)">' +
            '<td><div class="fp-name-cell">' + fpGrip(a.name || kind.label) + fpOnBox(a, kind.label) + (detailed ? '<button type="button" class="fp-more" onclick="fpToggleDetails(this)" aria-expanded="' + open + '" title="' +
                (open ? 'Hide' : 'Show') + ' everything the ' + escapeHtml((PluginRegistry.getTool(kind.tool) || {}).name || 'calculator') + ' takes">' + (open ? '▾' : '▸') + '</button>' : '<span class="fp-more-gap"></span>') +
                '<input class="fp-in fp-name" data-f="name" value="' + attr(a.name) + '" placeholder="Name" aria-label="Account name"></div></td>' +
            '<td><select class="fp-in" data-f="kind" aria-label="Kind">' + kindOptions(a) + '</select></td>' +
            '<td><input class="fp-in fp-num" type="number" data-f="balance" value="' + attr(a.balance) + '" placeholder="0" aria-label="' + (liability ? 'Owed' : 'Balance') + '"></td>' +
            '<td><input class="fp-in fp-num" type="number" step="0.1" data-f="rate" value="' + attr(a.rate) + '" placeholder="' + fpNum(plan.assume.returns[a.kind], kind.rate) + '" aria-label="' + (liability ? 'Interest' : 'Return') + ' per cent a year"></td>' +
            '<td class="fp-acc-monthly"></td>' +
            '<td class="fp-acts">' + (kind.tool ? '<button type="button" class="fp-link" onclick="fpOpenAccountTool(this)" title="Work it out in the ' + escapeHtml((PluginRegistry.getTool(kind.tool) || {}).name || 'calculator') + '">↗</button>' : '') +
                fpDupButton() + '<button type="button" class="fp-x" onclick="fpRemove(this)" title="Remove">×</button></td></tr>';
        return main + (open && !under[a.id] ? fpDetailsRow(plan, a) : '');
    }).join('');
    const flowRows = (list, isIncome) => plan[list].map(l => fpIsSection(l) ? secRow(l, list, isIncome ? 10 : 8) :
        '<tr data-id="' + attr(l.id) + '" data-list="' + list + '" class="fp-movable' + (l.off ? ' fp-line-off' : '') + (under[l.id] ? ' fp-under-folded' : '') + '" ondragover="fpDragOver(event, this)" ondragleave="fpDragLeave(this)" ondrop="fpDrop(event, this)">' +
            '<td><div class="fp-name-cell">' + fpGrip(l.name || (isIncome ? 'income' : 'expense')) + fpOnBox(l, isIncome ? 'income' : 'expense') +
                (isIncome ? '<button type="button" class="fp-more" onclick="fpToggleDetails(this)" aria-expanded="' + widget._open.has(l.id) + '" title="' +
                    (widget._open.has(l.id) ? 'Hide' : 'Show') + (l.type === 'ss' ? ' the benefit and when it is claimed' : ' what goes from it into an account') + '">' + (widget._open.has(l.id) ? '▾' : '▸') + '</button>' : '') +
                '<input class="fp-in" data-f="name" value="' + attr(l.name) + '" placeholder="Name" aria-label="Name"></div></td>' +
            (l.type === 'ss'
                ? '<td class="fp-derived-cell"><span class="fp-derived fp-ss-amount" title="The benefit at full retirement age, adjusted for the claiming age, in today’s dollars — set in ▸">' +
                    (fpSSInfo(l) ? fpCents(fpSSInfo(l).monthlyToday) : 'set in ▸') + '</span></td><td><span class="fp-derived">/ month</span></td>'
                : '<td><input class="fp-in fp-num" type="number" data-f="amount" value="' + attr(l.amount) + '" placeholder="0" aria-label="Amount"></td>' +
                  '<td><select class="fp-in" data-f="every" aria-label="How often"><option value="month"' + (l.every !== 'year' ? ' selected' : '') + '>/ month</option><option value="year"' + (l.every === 'year' ? ' selected' : '') + '>/ year</option></select></td>') +
            (isIncome ? '<td><input class="fp-in fp-num" type="number" data-f="deductions" value="' + attr(l.deductions) + '" placeholder="0" aria-label="Deductions, same period" title="Taken out of this income before it is paid: retirement, insurance, … — in the same period as the amount"></td>' +
                '<td><input class="fp-in fp-num" type="number" data-f="taxes" value="' + attr(l.taxes) + '" placeholder="' + (plan.tax.on && l.taxed !== false ? 'estimate' : '0') + '" aria-label="Taxes, same period" title="Taxes paid from this income, in the same period as the amount. Typed here, they are paid as typed and not estimated again — but the line’s income still counts toward the bracket the rest is taxed in."></td>' : '') +
            '<td><input class="fp-in fp-num" type="number" step="0.1" data-f="growth" value="' + attr(l.growth) + '" placeholder="' + fpNum(plan.assume.inflation, 0) + '" aria-label="Grows per cent a year" title="' +
                (l.type === 'ss' ? 'The cost-of-living increase a year; empty means inflation' : 'Grows by this much a year; empty means inflation') + '"></td>' +
            (l.type === 'ss'
                ? '<td><span class="fp-derived fp-ss-start" title="The month the claiming age is reached">' + (fpSSInfo(l) ? fpSSInfo(l).startYm : '—') + '</span></td>'
                : '<td><input class="fp-in fp-date" type="month" data-f="from" value="' + attr(l.from) + '" aria-label="From" title="From (empty: now)"></td>') +
            '<td><input class="fp-in fp-date" type="month" data-f="to" value="' + attr(l.to) + '" aria-label="Until" title="Until (empty: no end)"></td>' +
            (isIncome ? '<td><label class="fp-check" title="Counted in the federal estimate, unless its taxes are typed"><input class="fp-in" type="checkbox" data-f="taxed"' + (l.taxed !== false ? ' checked' : '') + '> Taxed</label></td>' : '<td></td>') +
            '<td class="fp-acts">' + fpDupButton() + '<button type="button" class="fp-x" onclick="fpRemove(this)" title="Remove">×</button></td></tr>' +
        (isIncome && widget._open.has(l.id) && !under[l.id] ? fpIncomeDetailsRow(plan, l) : '')).join('');
    const payFrom = fpAllEntries(plan.accounts).filter(fpCanPayGoal);
    const goalRows = plan.goals.map(g => fpIsSection(g) ? secRow(g, 'goals', 8) :
        '<tr data-id="' + attr(g.id) + '" data-list="goals" class="fp-movable fp-goal' + (g.off ? ' fp-line-off' : '') + (under[g.id] ? ' fp-under-folded' : '') + '" ondragover="fpDragOver(event, this)" ondragleave="fpDragLeave(this)" ondrop="fpDrop(event, this)">' +
            '<td><div class="fp-name-cell">' + fpGrip(g.name || 'goal') + fpOnBox(g, 'goal') + '<input class="fp-in" data-f="name" value="' + attr(g.name) + '" placeholder="Name" aria-label="Name"></div></td>' +
            '<td><input class="fp-in fp-num" type="number" data-f="cost" value="' + attr(g.cost) + '" placeholder="0" aria-label="Cost, in today’s dollars" title="In today’s dollars: it rises by its growth to when it is paid"></td>' +
            '<td><select class="fp-in" data-f="every" aria-label="A year or in all"><option value="total"' + (g.every !== 'year' ? ' selected' : '') + '>in all</option><option value="year"' + (g.every === 'year' ? ' selected' : '') + '>/ year</option></select></td>' +
            '<td><input class="fp-in fp-num fp-small" type="number" min="1" max="20" step="1" data-f="years" value="' + attr(g.years) + '" placeholder="1" aria-label="Over how many years" title="Paid at the start of each year: 4 for college, 1 for a one-off"></td>' +
            '<td><input class="fp-in fp-num" type="number" step="0.1" data-f="growth" value="' + attr(g.growth) + '" placeholder="' + fpNum(plan.assume.inflation, 0) + '" aria-label="Its cost grows per cent a year" title="Its price rises this much a year; empty means inflation. College costs have tended to rise faster, about 5% a year."></td>' +
            '<td><input class="fp-in fp-date" type="month" data-f="from" value="' + attr(g.from) + '" aria-label="When the first payment falls" title="When the first payment falls"></td>' +
            '<td><select class="fp-in" data-f="account" aria-label="Paid from"><option value="">Cash, then savings</option>' +
                payFrom.map(a => '<option value="' + attr(a.id) + '"' + (g.account === a.id ? ' selected' : '') + '>' + escapeHtml(a.name || fpKindLabel(a)) + (a.off ? ' (off)' : '') + '</option>').join('') + '</select></td>' +
            '<td class="fp-acts">' + fpDupButton() + '<button type="button" class="fp-x" onclick="fpRemove(this)" title="Remove">×</button></td></tr>').join('');
    const goalHead = '<thead><tr><th>Name</th><th>Cost today</th><th></th><th>Years</th><th>Grows %/yr</th><th>From</th><th>Paid from</th><th></th></tr></thead>';
    const flowHead = '<thead><tr><th>Name</th><th>Amount</th><th></th><th>Grows %/yr</th><th>From</th><th>Until</th><th></th><th></th></tr></thead>';
    const incomeHead = '<thead><tr><th>Name</th><th>Amount</th><th></th><th>Deductions</th><th>Taxes</th><th>Grows %/yr</th><th>From</th><th>Until</th><th></th><th></th></tr></thead>';
    const returns = Object.keys(FP_KINDS).map(k => '<label>' + FP_KINDS[k].label + ' <input class="fp-in fp-num fp-small" type="number" step="0.1" data-a="return" data-k="' + k + '" value="' + attr(plan.assume.returns[k]) + '"> %</label>').join('');
    const empty = !plan.accounts.length && !plan.incomes.length && !plan.expenses.length;
    // Every section folds to its heading — figures and all out of sight — for a plan
    // looked at with someone else in the room. Which are folded is kept with the tool.
    const folded = fpFoldedOf(widget);
    const sec = (key, title, actions, body, cls) => '<section class="fp-section' + (cls ? ' ' + cls : '') + (folded.has(key) ? ' fp-folded' : '') + '" data-sec="' + key + '">' +
        '<div class="fp-section-head"><button type="button" class="fp-fold" onclick="fpFold(this)" aria-expanded="' + !folded.has(key) + '" title="' +
            (folded.has(key) ? 'Show ' : 'Hide ') + title.toLowerCase() + '">' + (folded.has(key) ? '▸' : '▾') + '</button><h4>' + title + '</h4>' +
            '<span class="fp-head-acts">' + (actions || '') + '</span></div>' +
        '<div class="fp-body">' + body + '</div></section>';
    const allFolded = FP_SECTIONS.every(k => folded.has(k));
    fpPanes(widget);
    widget.querySelector('.fp-head').innerHTML = '<div class="fp-top"><button type="button" class="fp-btn fp-fold-all" onclick="fpFoldAll(this)">' + (allFolded ? 'Show all' : 'Hide all') + '</button></div>';
    widget.querySelector('.authoring-source').innerHTML =
        (empty ? '<div class="fp-empty">Start by adding what you have and owe, then what comes in and goes out. ' +
            '<button type="button" class="fp-btn" onclick="fpSample(this)">Fill in a made-up example</button></div>' : '') +
        sec('accounts', 'Accounts', '<button type="button" class="fp-btn" onclick="fpAddSection(this, \'accounts\')" title="A heading to group what follows under, with its totals">+ Section</button>' +
            '<button type="button" class="fp-btn" onclick="fpAdd(this, \'accounts\')">+ Account</button>',
            '<table class="fp-table fp-accounts"><thead><tr><th>Name</th><th>Kind</th><th>Balance / owed</th><th>Rate %/yr</th><th>Monthly in / payment</th><th></th></tr></thead><tbody>' + accounts + '</tbody></table>') +
        sec('income', 'Income', '<button type="button" class="fp-btn" onclick="fpAddSection(this, \'incomes\')" title="A heading to group what follows under, with its totals">+ Section</button>' +
            '<button type="button" class="fp-btn" onclick="fpAddSocialSecurity(this)" title="A Social Security benefit, from the amount on your ssa.gov statement and the age you claim it">+ Social Security</button>' +
            '<button type="button" class="fp-btn" onclick="fpAdd(this, \'incomes\')">+ Income</button>',
            '<table class="fp-table fp-incomes">' + incomeHead + '<tbody>' + flowRows('incomes', true) + '</tbody></table>' +
            '<div class="fp-tax"><label class="fp-check"><input class="fp-in" type="checkbox" data-a="taxOn"' + (plan.tax.on ? ' checked' : '') + '> Estimate federal income tax</label>' +
                '<select class="fp-in" data-a="taxStatus" aria-label="Filing status">' + Object.keys(TAX_STATUSES).map(s => '<option value="' + s + '"' + (plan.tax.status === s ? ' selected' : '') + '>' + TAX_STATUSES[s] + '</option>').join('') + '</select>' +
                '<label class="fp-check">Tax year <select class="fp-in" data-a="taxYear" aria-label="Tax year">' + fpTaxYearOptions(plan) + '</select></label>' +
                '<label class="fp-check" title="Social Security and Medicare tax on pay without typed taxes, at the year’s rates"><input class="fp-in" type="checkbox" data-a="taxPayroll"' +
                    (plan.tax.payroll === undefined || plan.tax.payroll === null ? (plan.tax.on ? ' checked' : '') : (plan.tax.payroll ? ' checked' : '')) + '> Payroll tax</label>' +
                '<button type="button" class="fp-link" onclick="fpOpenTax(this)" title="Check it in the Tax Calculator">↗ Tax Calculator</button>' +
                '<button type="button" class="fp-link fp-rules-link" onclick="taxOpenBrackets()" title="The brackets, payroll tax, limits and retirement rules the plan works from">' + escapeHtml(taxRulesFor(plan.tax.year).year) + ' rules · edit</button></div>') +
        sec('expenses', 'Expenses', '<button type="button" class="fp-btn" onclick="fpAddSection(this, \'expenses\')" title="A heading to group what follows under, with its totals">+ Section</button>' +
            '<button type="button" class="fp-btn" onclick="fpAdd(this, \'expenses\')">+ Expense</button>',
            '<table class="fp-table">' + flowHead + '<tbody>' + flowRows('expenses', false) + '</tbody></table>') +
        sec('goals', 'Goals', '<button type="button" class="fp-btn" onclick="fpAddSection(this, \'goals\')" title="A heading to group what follows under, with its totals">+ Section</button>' +
            '<button type="button" class="fp-btn" onclick="fpAdd(this, \'goals\')">+ Goal</button>',
            (fpEntries(plan.goals).length ? '' : '<div class="fp-note">Big costs ahead — college, a car, a wedding, a new roof — in today’s dollars. Unlike an expense, a goal is paid when it falls, retired or not.</div>') +
            '<table class="fp-table fp-goals">' + goalHead + '<tbody>' + goalRows + '</tbody></table><ul class="fp-goals-out"></ul>') +
        sec('retirement', 'Retirement', '', fpRetireFields(plan, attr, under)) +
        sec('advice', 'Where the next dollar goes', '', fpAdviceFields(plan, attr) + '<div class="fp-advice"></div>') +
        sec('assumptions', 'Assumptions', '', '<div class="fp-assume">' +
            '<label>Years ahead <input class="fp-in fp-num fp-small" type="number" min="1" max="60" data-a="years" value="' + attr(plan.assume.years) + '"></label>' +
            '<label>Inflation <input class="fp-in fp-num fp-small" type="number" step="0.1" data-a="inflation" value="' + attr(plan.assume.inflation) + '"> %</label>' +
            '<label>Range ± <input class="fp-in fp-num fp-small" type="number" step="0.5" min="0" data-a="spread" value="' + attr(plan.assume.spread) + '"> % on investments</label>' +
            '<label>Goal <input class="fp-in fp-num" type="number" step="10000" data-a="target" value="' + attr(plan.assume.target) + '"> net worth</label>' +
            '<label class="fp-check"><input class="fp-in" type="checkbox" data-a="real"' + (plan.assume.real ? ' checked' : '') + '> In today’s money</label>' +
            '</div><div class="fp-assume fp-returns"><span>Default rates:</span>' + returns + '</div>');
    widget.querySelector('.authoring-result').innerHTML =
        (empty ? '<div class="fp-view-empty">Nothing to show yet: what you have and owe, what comes in and goes out, go in Edit. <button type="button" class="fp-btn" onclick="fpGoEdit(this)">Edit</button></div>' : '') +
        sec('summary', 'Summary', '', '<div class="fp-rollup"></div>') +
        sec('month', 'A month, now', '', '<div class="fp-month"></div>') +
        sec('ahead', 'Ahead', '<button type="button" class="fp-btn" onclick="fpCopySummary(this)" title="The rollup and the projection, as Markdown">Copy summary</button>',
            '<div class="fp-projection"></div>');
    widget.querySelectorAll('.fp-in').forEach(el => el.addEventListener(el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input', () => fpOnInput(el)));
    fpRenderDerived(widget, plan);
    // A new plan has nothing yet to view: it opens where it is filled in.
    if (empty && !(toolCustomizations[toolId] || {}).viewMode) setToolMode(toolId, 'edit');
}

/**
 * Under a loan or investment account, everything its calculator takes, with the same
 * labels — and, for a loan, what the Loan Calculator would say about it.
 */
function fpDetailsRow(plan, a) {
    const attr = (v) => escapeHtml(v === null || v === undefined ? '' : String(v));
    const kind = FP_KINDS[a.kind] || FP_KINDS.other;
    const l = a.loan || {};
    let fields;
    if (kind.tool === 'loan-calculator') {
        fields = '<label>Original Amount <input class="fp-in fp-num" type="number" data-f="loan.amount" value="' + attr(l.amount) + '"></label>' +
            '<label>Loan Term (Years) <input class="fp-in fp-num fp-small" type="number" data-f="loan.years" value="' + attr(l.years) + '"></label>' +
            '<label>Extra Payment/mo <input class="fp-in fp-num" type="number" data-f="loan.extra" value="' + attr(l.extra) + '" placeholder="0"></label>' +
            '<label title="Property tax and insurance collected with the payment: it does not pay the loan down, and it goes on after the loan is paid off">Escrow/mo <input class="fp-in fp-num" type="number" data-f="loan.escrow" value="' + attr(l.escrow) + '" placeholder="0"></label>' +
            '<label>Closing Date <input class="fp-in fp-date" type="date" data-f="loan.closing" value="' + attr(l.closing) + '"></label>' +
            '<span class="fp-note">Current balance and interest rate are the row’s own.</span>';
    } else {
        fields = '<label>Compounding <select class="fp-in" data-f="compounding"><option value="monthly"' + (a.compounding !== 'annual' ? ' selected' : '') + '>Monthly</option>' +
            '<option value="annual"' + (a.compounding === 'annual' ? ' selected' : '') + '>Annual</option></select></label>' +
            (a.kind === 'retirement' ? '<span class="fp-note">' + ({
                '401k:pretax': 'A 401(k), 403(b) or 457: pay goes in before tax and is taxed as it is drawn; minimum withdrawals from 73 or 75; left in the year of turning 55 or later, no early penalty.',
                '401k:roth': 'A Roth 401(k): pay goes in after tax and comes out untaxed; no minimum withdrawals; left at 55 or later, no early penalty.',
                '457:pretax': 'A 457(b), for government and some non-profit jobs: before tax, with minimum withdrawals; a limit of its own beside a 401(k)’s; no early penalty once the job is left.',
                '457:roth': 'A Roth 457(b): after tax, drawn untaxed; a limit of its own beside a 401(k)’s; no early penalty once the job is left.',
                'ira:pretax': 'A traditional IRA: taxed as it is drawn, with minimum withdrawals from 73 or 75; no employer match; the IRA limit.',
                'ira:roth': 'A Roth IRA: drawn untaxed, no minimum withdrawals; no employer match; the IRA limit, which shrinks with income.' })[fpRetKey(a)] + '</span>' : '') +
            (fpIsRoth(a) ? '<label title="What was paid in. Drawn early, contributions come out first and free; earnings are taxed and penalised. Empty: all of today’s balance is contributions, and only growth from here is earnings.">Contributions ' +
                '<input class="fp-in fp-num" type="number" data-f="basis" value="' + attr(a.basis) + '" placeholder="' + Math.round(fpBalanceOf(plan, a)) + '"></label>' : '') +
            (a.kind === 'hsa' ? '<label title="Which limit applies">Cover <select class="fp-in" data-f="hsaCover"><option value="self"' + (a.hsaCover !== 'family' ? ' selected' : '') + '>Self-only</option>' +
                '<option value="family"' + (a.hsaCover === 'family' ? ' selected' : '') + '>Family</option></select></label>' +
                '<label class="fp-check" title="Spent on medical costs, an HSA comes out untaxed. Otherwise it is taxed as income, with a penalty before 65."><input class="fp-in" type="checkbox" data-f="hsaMedical"' +
                    (a.hsaMedical !== false ? ' checked' : '') + '> Drawn for medical costs (untaxed)</label>' +
                '<span class="fp-note">Pay into it through payroll is free of income and payroll tax; paid in directly, of income tax. No minimum withdrawals; drawn last by default.</span>' : '') +
            (a.kind === 'education' ? '<span class="fp-note">A 529: it grows untaxed, and comes out untaxed for school costs. The plan spends it only on the goals paid from it (Goals), not in the withdrawal order, and stops adding to it after the last of them. No federal limit a year; many states give a deduction for what goes in.</span>' : '') +
            (a.kind === 'investment' ? '<label title="What was paid in. What is drawn is part basis, part gain, in proportion, and the gain is taxed at the capital-gains rates. Empty: all of it is basis, so nothing drawn is taxed.">Cost basis ' +
                '<input class="fp-in fp-num" type="number" data-f="basis" value="' + attr(a.basis) + '" placeholder="' + Math.round(fpBalanceOf(plan, a)) + '"></label>' : '') +
            '<span class="fp-note">Starting amount, monthly contribution and annual return are the row’s own; years are the plan’s.</span>';
    }
    return '<tr class="fp-detail" data-id="' + attr(a.id) + '" data-list="accounts"><td colspan="6"><div class="fp-detail-fields">' + fields + '</div>' +
        '<div class="fp-detail-sum"></div></td></tr>';
}

/** What the details come to, as the calculator would put it, and the payment cell. */
function fpRefreshAccounts(widget, plan) {
    widget.querySelectorAll('tr.fp-acc').forEach(tr => {
        const a = plan.accounts.find(x => x.id === tr.dataset.id);
        if (!a) return;
        const cell = tr.querySelector('.fp-acc-monthly');
        const t = fpLoanTerms(plan, a);
        const liability = (FP_KINDS[a.kind] || FP_KINDS.other).side === 'liability';
        if (t) {
            if (cell.dataset.mode !== 'derived') { cell.dataset.mode = 'derived'; cell.innerHTML = '<span class="fp-derived"></span>'; }
            cell.firstChild.textContent = fpCents(t.payment) + (fpEscrowOf(a) ? ' + ' + fpMoney(fpEscrowOf(a)) + ' escrow' : '') + (t.extra ? ' + ' + fpMoney(t.extra) + ' extra' : '');
            cell.firstChild.title = 'Worked out from the original amount, rate and term, as the Loan Calculator does';
        } else if (cell.dataset.mode !== 'typed') {
            cell.dataset.mode = 'typed';
            cell.innerHTML = '<input class="fp-in fp-num" type="number" data-f="monthly" placeholder="0" aria-label="' + (liability ? 'Payment' : 'Added') + ' a month">';
            const input = cell.firstChild;
            input.value = a.monthly === null || a.monthly === undefined ? '' : String(a.monthly);
            input.addEventListener('input', () => fpOnInput(input));
        }
        const bal = tr.querySelector('[data-f="balance"]');
        if (bal) bal.placeholder = t && t.closing ? Math.round(fpBalanceOf(Object.assign({}, plan), Object.assign({}, a, { balance: null }))) + ' on schedule' : '0';
        const detail = widget.querySelector('tr.fp-detail[data-id="' + CSS.escape(a.id) + '"] .fp-detail-sum');
        if (detail) detail.innerHTML = fpDetailSummary(plan, a);
    });
}

function fpCents(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function fpDetailSummary(plan, a) {
    const t = fpLoanTerms(plan, a);
    const kind = FP_KINDS[a.kind] || FP_KINDS.other;
    if (kind.tool === 'loan-calculator') {
        if (!t) return '<span class="fp-note">With the original amount, term and a rate, the payment is worked out here as the Loan Calculator does.</span>';
        const balance = fpBalanceOf(plan, a);
        if (balance * t.r >= t.payment + t.extra) return '<span class="fp-neg">The payment does not cover the month’s interest on ' + fpMoney(balance) + '.</span>';
        const left = loanPayDown(balance, t.r, t.payment + t.extra, t.n * 4);
        const payoff = fpWhen(plan, fpMonthAt(new Date(new Date().getFullYear(), new Date().getMonth(), 1), left.months + 1));
        const esc = fpEscrowOf(a);
        const bits = ['Payment <b>' + fpCents(t.payment) + '</b>' + (t.extra ? ' + ' + fpMoney(t.extra) + ' extra' : '') +
            (esc ? ' + ' + fpMoney(esc) + ' escrow = <b>' + fpCents(t.payment + t.extra + esc) + '</b> a month' : ''),
            'Time left <b>' + loanSpan(left.months) + '</b> · ' + payoff, 'Interest left <b>' + fpMoney(left.interest) + '</b>',
            'Paid off <b>' + (Math.max(0, t.amount - balance) / t.amount * 100).toFixed(1) + '%</b>'];
        if (t.closing && t.closing.date <= new Date() && fpNum(a.balance, null) !== null) {
            const made = loanPaymentsMade(t.closing, t.n);
            const due = loanScheduled(t.amount, t.r, t.payment, made);
            const diff = due - balance;
            bits.push(Math.abs(diff) < 1 ? 'On schedule' : (diff > 0 ? '<span class="fp-pos">Ahead of schedule by ' : '<span class="fp-neg">Behind schedule by ') + fpMoney(Math.abs(diff)) + '</span>');
        }
        return bits.map(b => '<span>' + b + '</span>').join('');
    }
    const years = Math.max(1, Math.round(fpNum(plan.assume.years, 30)));
    const pay = fpPayrollNow(plan)[a.id];
    const lim = fpLimitCheck(plan, a);
    const r = fpRateOf(plan, a) / 100, m = fpNum(a.monthly, 0) + (pay ? pay.own + pay.match : 0), start = fpBalanceOf(plan, a);
    let fv = start;
    if (a.compounding === 'annual') for (let y = 0; y < years; y++) fv = fv * (1 + r) + m * 12;
    else for (let i = 0; i < years * 12; i++) fv = fv * (1 + r / 12) + m;
    const put = start + m * years * 12;
    return '<span>In ' + years + ' years, on its own: <b>' + fpMoney(fv) + '</b></span><span>put in ' + fpMoney(put) + '</span><span>growth ' + fpMoney(fv - put) + '</span>' +
        '<span class="fp-note">(before inflation, as the Investment Calculator shows it' + (pay ? '; with ' + fpMoney(pay.own + pay.match) + ' a month from pay' : '') + ')</span>' +
        (pay && fpNum(a.monthly, 0) > 0 ? '<span class="fp-neg">This account also has ' + fpMoney(fpNum(a.monthly, 0)) + ' a month of its own: if that is the same money as from pay, it is counted twice.</span>' : '') +
        (lim ? '<span class="fp-limit' + (lim.over ? ' fp-neg' : '') + '">' + escapeHtml(fpLimitText(lim, lim.names.length > 1 ? lim.names.join(' and ') + ' together' : '')) + '.</span>' : '');
}

function fpRefreshIncomeDetails(widget, plan) {
    plan.incomes.filter(l => l.type === 'ss').forEach(l => {
        const tr = widget.querySelector('tr.fp-movable[data-list="incomes"][data-id="' + CSS.escape(l.id) + '"]');
        if (!tr) return;
        const s = fpSSInfo(l);
        const amt = tr.querySelector('.fp-ss-amount'), st = tr.querySelector('.fp-ss-start');
        if (amt) amt.textContent = s ? fpCents(s.monthlyToday) : 'set in ▸';
        const ben = widget.querySelector('tr.fp-income-detail[data-id="' + CSS.escape(l.id) + '"] [data-f="fraBenefit"]');
        if (ben) ben.placeholder = l._est ? 'est. ' + Math.round(l._est.pia) : 'from statement';
        if (st) st.textContent = s ? s.startYm : '—';
    });
    widget.querySelectorAll('tr.fp-income-detail').forEach(tr => {
        const l = plan.incomes.find(x => x.id === tr.dataset.id);
        if (l) tr.querySelector('.fp-detail-sum').innerHTML = fpIncomeDetailSummary(plan, l);
    });
}

/** The From and Until months of incomes and expenses, with the age then in their hints. */
function fpRefreshAgeHints(widget, plan) {
    widget.querySelectorAll('tr.fp-movable input.fp-date[data-f="from"], tr.fp-movable input.fp-date[data-f="to"]').forEach(el => {
        const goal = el.closest('tr').dataset.list === 'goals';
        const base = goal ? 'When the first payment falls' : el.dataset.f === 'from' ? 'From (empty: now)' : 'Until (empty: no end)';
        const m = /^(\d{4})-(\d{2})$/.exec(el.value || '');
        const age = m ? fpAgeAt(plan, new Date(+m[1], +m[2] - 1, 1)) : null;
        el.title = base + (age === null ? '' : ' — at ' + age);
    });
}

function fpRefreshSections(widget, plan) {
    ['accounts', 'incomes', 'expenses', 'goals'].forEach(list => fpSectionsOf(plan[list]).forEach(g => {
        if (!g.section) return;
        const el = widget.querySelector('tr.fp-sec-row[data-list="' + list + '"][data-id="' + CSS.escape(g.section.id) + '"] .fp-sec-total');
        const off = g.entries.filter(x => x.off).length;
        if (el) el.textContent = off === g.entries.length && off ? off + ' off' : fpSectionTotal(plan, list, g.entries).text + (off ? ' · ' + off + ' off' : '');
    }));
}

function fpToggleDetails(btn) {
    const widget = fpWidget(btn);
    const id = btn.closest('tr').dataset.id;
    widget._open = widget._open || new Set();
    if (widget._open.has(id)) widget._open.delete(id); else widget._open.add(id);
    fpRender(widget);
    const again = widget.querySelector('tr.fp-movable[data-id="' + CSS.escape(id) + '"] .fp-more');
    if (again) again.focus();
}

/** Under an income line: which part of its deductions goes into an account, and what the
 *  employer adds to it — in the line's own period. */
function fpIncomeDetailsRow(plan, l) {
    const attr = (v) => escapeHtml(v === null || v === undefined ? '' : String(v));
    if (l.type === 'ss') {
        return '<tr class="fp-detail fp-income-detail" data-id="' + attr(l.id) + '" data-list="incomes"><td colspan="10"><div class="fp-detail-fields">' +
            '<label>Born <input class="fp-in fp-date" type="month" data-f="birth" value="' + attr(l.birth) + '"></label>' +
            '<label title="From your statement on ssa.gov, in today’s dollars. Empty: estimated from pay.">Benefit at full retirement age <input class="fp-in fp-num" type="number" data-f="fraBenefit" value="' + attr(l.fraBenefit) + '" placeholder="' +
                (l._est ? 'est. ' + Math.round(l._est.pia) : 'from statement') + '"> / month</label>' +
            '<label>Claim at age <input class="fp-in fp-num fp-small" type="number" min="62" max="70" data-f="claimYears" value="' + attr(l.claimYears) + '" placeholder="67"></label>' +
            '<label>and <input class="fp-in fp-num fp-small" type="number" min="0" max="11" data-f="claimMonths" value="' + attr(l.claimMonths) + '" placeholder="0"> months</label>' +
            '</div><div class="fp-detail-fields fp-ss-est">' + fpSSEstimateFields(plan, l) + '</div><div class="fp-detail-sum"></div></td></tr>';
    }
    const per = l.every === 'year' ? '/ year' : '/ month';
    const targets = fpAllEntries(plan.accounts).filter(a => (FP_KINDS[a.kind] || FP_KINDS.other).side === 'asset');
    const rows = fpIntoRows(l);
    const row = (r, i) => '<div class="fp-into-row" data-row="' + attr(r.id) + '">' +
        '<label>' + (i ? 'and' : 'Of the deductions,') + ' <input class="fp-in fp-num" type="number" data-f="into.amount" data-row="' + attr(r.id) + '" value="' + attr(r.amount) + '" placeholder="0" aria-label="Your part"> ' + per + ' goes into</label>' +
        '<select class="fp-in" data-f="into.account" data-row="' + attr(r.id) + '" aria-label="Into which account"><option value="">— no account —</option>' +
            targets.map(a => '<option value="' + attr(a.id) + '"' + (a.id === r.account ? ' selected' : '') + '>' + escapeHtml(a.name || fpKindLabel(a)) + (a.kind === 'retirement' && a.name !== fpKindLabel(a) ? ' (' + fpKindLabel(a) + ')' : '') + (a.off ? ' (off)' : '') + '</option>').join('') + '</select>' +
        '<label>employer adds <input class="fp-in fp-num" type="number" data-f="into.match" data-row="' + attr(r.id) + '" value="' + attr(r.match) + '" placeholder="0" aria-label="Employer’s part"> ' + per + '</label>' +
        '<button type="button" class="fp-x" onclick="fpRemoveInto(this)" title="Remove this account">×</button></div>';
    return '<tr class="fp-detail fp-income-detail" data-id="' + attr(l.id) + '" data-list="incomes"><td colspan="10"><div class="fp-detail-fields fp-into">' +
        (rows.length ? rows : [{ id: 'r1', account: '', amount: null, match: null }]).map(row).join('') +
        '<button type="button" class="fp-btn" onclick="fpAddInto(this)" title="Part of the deductions into another account: a Roth and a traditional 401(k), say, or the employer’s match into one and yours into the other">+ Another account</button>' +
        '<div class="fp-into-row fp-match-row"><label title="The employer’s formula, from the plan’s summary: it works out the match from what you put in, so you can see whether you get all of it">Employer matches ' +
            '<input class="fp-in fp-num fp-small" type="number" step="1" data-f="matchRate" value="' + attr(l.matchRate) + '" placeholder="—"> % of what you put in, up to ' +
            '<input class="fp-in fp-num fp-small" type="number" step="0.5" data-f="matchCap" value="' + attr(l.matchCap) + '" placeholder="—"> % of pay</label></div></div>' +
        '<div class="fp-detail-fields">' +
        '<label class="fp-check" title="Pay from a job has Social Security and Medicare tax taken from it; a pension, rent or interest does not"><input class="fp-in" type="checkbox" data-f="wages"' +
            (l.wages !== false ? ' checked' : '') + '> Pay from work (payroll tax)</label>' +
        '<label class="fp-check" title="Work that carries on after retirement until its own end date, or fills the time until then. Retiring when the last job ends takes no account of it."><input class="fp-in" type="checkbox" data-f="bridge"' +
            (l.bridge ? ' checked' : '') + '> Part-time or bridge work: doesn’t hold back retirement</label>' +
        '</div><div class="fp-detail-sum"></div></td></tr>';
}

/** For a benefit left empty: whose pay counts, from what age, and the pay before now. */
function fpSSEstimateFields(plan, l) {
    const attr = (v) => escapeHtml(v === null || v === undefined ? '' : String(v));
    const counted = fpSSPayOf(plan, l).map(x => x.id);
    const pay = fpAllEntries(plan.incomes).filter(x => x.type !== 'ss');
    return '<span class="fp-note">With the benefit left empty, it is estimated from pay:</span>' +
        (pay.length ? '<span class="fp-ss-pay">Pay that counts ' + pay.map(x => '<label class="fp-check"><input class="fp-in" type="checkbox" data-f="payFrom" value="' + attr(x.id) + '"' +
            (counted.includes(x.id) || (Array.isArray(l.payFrom) && l.payFrom.includes(x.id)) ? ' checked' : '') + '> ' + escapeHtml(x.name || 'Income') + (x.off ? ' (off)' : '') + '</label>').join('') + '</span>' : '<span class="fp-note">no pay in the plan yet.</span>') +
        '<label>Started work at age <input class="fp-in fp-num fp-small" type="number" min="14" max="70" data-f="workFrom" value="' + attr(l.workFrom) + '" placeholder="22"></label>' +
        '<label title="What was earned a year before now, on average, in today’s dollars. Empty: as now.">Past pay <input class="fp-in fp-num" type="number" data-f="pastPay" value="' + attr(l.pastPay) + '" placeholder="' +
            Math.round(fpSSPayOf(plan, l).reduce((s, x) => s + fpMonthly(x), 0) * 12) + '"> / year</label>';
}

/** What an income line's details come to, and anything that does not add up. */
function fpIncomeDetailSummary(plan, l) {
    if (l.type === 'ss') {
        const s = fpSSInfo(l);
        if (!s) return '<span class="fp-note">' + (l.birth ? 'Give the benefit at full retirement age from your statement on ssa.gov, or the pay that counts for an estimate.'
            : 'Your birth month, and the benefit at full retirement age from your statement on ssa.gov — or, left empty, an estimate from pay.') + '</span>';
        const pct = (s.factor * 100).toFixed(1).replace(/\.0$/, '');
        const now = new Date();
        const yrs = Math.max(0, (s.start.getFullYear() - now.getFullYear()) + (s.start.getMonth() - now.getMonth()) / 12);
        const then = s.monthlyToday * Math.pow(1 + fpNum(l.growth, fpNum(plan.assume.inflation, 0)) / 100, yrs);
        const claimed = s.claim;
        const est = s.estimated && s.est ? '<span>Estimated from pay: <b>' + fpCents(s.benefit) + '</b> a month at full retirement age, from ' + s.est.years + ' year' + (s.est.years === 1 ? '' : 's') +
            ' of earnings averaging ' + fpMoney(s.est.aime) + ' a month over 35 <span class="fp-muted">(your statement on ssa.gov is better: type it above; spousal benefits are not counted)</span></span>' : '';
        return est + '<span>Full retirement age <b>' + fpAgeText(s.fra) + '</b></span>' +
            '<span>Claimed at ' + fpAgeText(claimed) + ': <b>' + pct + '%</b> of the benefit' + (s.factor < 1 ? ', for claiming early' : s.factor > 1 ? ', for waiting' : '') + '</span>' +
            '<span>Starts <b>' + s.start.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) + '</b>, at ' + fpAgeText(s.claim) + ', with <b>' + fpCents(s.monthlyToday) + '</b> a month in today’s dollars' +
                (yrs > 0 ? ', about <b>' + fpMoney(then) + '</b> then' : '') + '</span>' +
            '<span class="fp-note">Taxed: up to 85% of it counts toward the federal estimate, by how much other income there is.</span>';
    }
    const rows = fpIntoOf(plan, l);
    const ded = fpPerMonth(l, 'deductions');
    const bits = [];
    const named = (a) => escapeHtml(a.name || fpKindLabel(a));
    if (!rows.some(r => r.account || r.own || r.match)) return '<span class="fp-note">For a 401(k) and the like: it comes out of take-home, as on the pay stub, and is saved in the account rather than spent. ' +
        'Split it between accounts — a Roth and a traditional 401(k), say — with + Another account.</span>';
    let own = 0;
    rows.forEach(r => {
        own += r.account ? r.own : 0;
        const off = !r.account && fpAllEntries(plan.accounts).find(a => a.id === r.accountId && a.off);
        if (off) { bits.push('<span class="fp-note">' + named(off) + ' is off: ' + fpMoney(r.own) + ' a month stays in take-home.</span>'); return; }
        if (!r.account) { if (r.own || r.match) bits.push('<span class="fp-neg">Choose an account for ' + fpMoney(r.own + r.match) + ' a month to go into; until then it is spent like the other deductions.</span>'); return; }
        const a = r.account;
        bits.push('<span>Into ' + named(a) + ': <b>' + fpMoney(r.own + r.match) + '</b> a month' + (r.match ? ' (' + fpMoney(r.own) + ' yours, ' + fpMoney(r.match) + ' employer)' : '') +
            (a.kind === 'retirement' ? ' <span class="fp-muted">' + (fpIsPretax(a) ? 'before tax' : 'after tax') + '</span>' : '') + '</span>');
        if (r.match > 0 && a.kind === 'retirement' && a.planType === 'ira') bits.push('<span class="fp-neg">' + named(a) + ' is an IRA, and an IRA takes no employer match: an employer pays into a 401(k) and the like.</span>');
        if (fpNum(a.monthly, 0) > 0) bits.push('<span class="fp-neg">' + named(a) + ' also has ' + fpMoney(fpNum(a.monthly, 0)) + ' a month of its own in Accounts: if that is the same money, it is counted twice.</span>');
    });
    if (own > ded + 0.005) bits.push('<span class="fp-neg">That is more than the deductions typed; they are counted as ' + fpMoney(own) + ' a month.</span>');
    const m = fpMatchOf(plan, l);
    if (m && m.odd) bits.push('<span class="fp-neg">Up to ' + m.cap + '% of pay is unusually high: a match is usually up to 3–6% of pay. Check the formula.</span>');
    if (m) bits.push(m.match >= m.full - 0.5 ? '<span class="fp-pos">The full employer match: ' + fpMoney(m.full) + ' a month.</span>'
        : m.own >= m.reach - 0.5 ? '<span>' + fpMoney(m.match) + ' match a month: the most your 401(k) limit lets the formula give.</span>'
        : '<span class="fp-neg">' + fpMoney(m.match) + ' of a possible ' + fpMoney(m.best) + ' match a month: putting ' + fpMoney(m.reach) + ' a month into the 401(k)' +
            (m.limited ? ' — your limit — gets the most of it.' : ' (' + m.cap + '% of pay) gets all of it.') + '</span>');
    return bits.join('');
}

/** The Retirement section: when, for how long, what it costs, and the order money is
 *  drawn in. */
function fpRetireFields(plan, attr, under) {
    const r = plan.retire;
    const ss = fpEntries(plan.incomes).find(l => l.type === 'ss' && l.birth);
    const label = (a) => fpKindLabel(a);
    const order = fpDrawOrder(plan);
    const head = '<div class="fp-assume"><label class="fp-check"><input class="fp-in" type="checkbox" data-a="retireOn"' + (r.on ? ' checked' : '') + '> Plan for retirement: pay stops, savings are drawn on</label></div>';
    if (!r.on) return head;
    return head +
        '<div class="fp-assume">' +
            '<label>Born <input class="fp-in fp-date" type="month" data-a="retire" data-k="birth" value="' + attr(r.birth) + '"' + (ss ? ' title="Empty: ' + ss.birth + ', from Social Security"' : '') + '></label>' +
            '<label title="At an age you give, or the month after the last pay from work ends. A job with no end date falls back on the age.">Retire <select class="fp-in" data-a="retire" data-k="from">' +
                '<option value="age"' + (r.from !== 'job' ? ' selected' : '') + '>at age</option><option value="job"' + (r.from === 'job' ? ' selected' : '') + '>when the last job ends</option></select></label>' +
            '<span class="fp-retire-age"><label><input class="fp-in fp-num fp-small" type="number" min="40" max="80" data-a="retire" data-k="ageYears" aria-label="Retirement age" value="' + attr(r.ageYears) + '" placeholder="65"></label>' +
            '<label>and <input class="fp-in fp-num fp-small" type="number" min="0" max="11" data-a="retire" data-k="ageMonths" value="' + attr(r.ageMonths) + '" placeholder="0"> months</label></span>' +
            '<label>Last to age <input class="fp-in fp-num fp-small" type="number" min="60" max="115" data-a="retire" data-k="until" value="' + attr(r.until) + '" placeholder="95"></label>' +
        '</div><div class="fp-assume">' +
            '<label title="In today’s dollars; it rises with inflation. Empty: today’s expenses.">Spending in retirement <input class="fp-in fp-num" type="number" data-a="retire" data-k="spending" value="' + attr(r.spending) + '" placeholder="' + Math.round(fpRetireSpending(Object.assign({}, plan, { retire: Object.assign({}, r, { spending: null }) }))) + '"> / month</label>' +
            '<label title="Kept in the cash account that takes what is left over; the rest is drawn on first">Keep <input class="fp-in fp-num fp-small" type="number" min="0" data-a="retire" data-k="buffer" value="' + attr(r.buffer) + '" placeholder="6"> months of spending in cash</label>' +
        '</div>' +
        '<div class="fp-assume">' +
            '<label class="fp-check" title="Health cover before Medicare, and Medicare’s Part B — with its surcharge for higher incomes — and what goes beside it, added to spending in retirement. Leave it off if the spending figure has them already."><input class="fp-in" type="checkbox" data-a="retire" data-k="health"' + (r.health ? ' checked' : '') + '> Count health costs</label>' +
            '<label title="Health insurance from retiring until Medicare: a marketplace plan, COBRA, a spouse’s plan — a month in today’s dollars, for the household">Health cover before 65 <input class="fp-in fp-num" type="number" min="0" data-a="retire" data-k="healthBefore" value="' + attr(r.healthBefore) + '" placeholder="0"> / month</label>' +
            '<label title="Beside Medicare’s Part B, which is worked out: Part D, a supplement or Advantage plan, and costs out of pocket — a month in today’s dollars">from 65, beside Medicare <input class="fp-in fp-num" type="number" min="0" data-a="retire" data-k="healthAfter" value="' + attr(r.healthAfter) + '" placeholder="0"> / month</label>' +
            '<label title="How fast health costs rise a year — usually faster than prices in general">rising <input class="fp-in fp-num fp-small" type="number" step="0.5" data-a="retire" data-k="medInfl" value="' + attr(r.medInfl) + '" placeholder="5"> % a year</label>' +
        '</div>' +
        (order.length ? '<div class="fp-draw-head">Drawn on in this order — drag ☰ or press ↑ ↓ to change it:</div><table class="fp-table fp-draw"><tbody>' +
            order.map((a, i) => '<tr data-id="' + attr(a.id) + '" data-list="drawOrder" class="fp-movable" ondragover="fpDragOver(event, this)" ondragleave="fpDragLeave(this)" ondrop="fpDrop(event, this)">' +
                '<td><div class="fp-name-cell">' + fpGrip(a.name || label(a)) + '<span class="fp-draw-n">' + (i + 1) + '.</span> ' + escapeHtml(a.name || label(a)) + '</div></td>' +
                '<td class="fp-muted">' + label(a) + '</td></tr>').join('') + '</tbody></table>' +
            (() => {
                const usual = fpDrawOrder(Object.assign({}, plan, { drawOrder: [] })).map(a => a.id).join();
                const same = usual === order.map(a => a.id).join();
                return '<button type="button" class="fp-btn fp-draw-reset" onclick="fpResetDrawOrder(this)"' + (same ? ' disabled' : '') +
                    ' title="Cash first, then investments, other assets, pre-tax accounts, Roth, and the HSA last">' + (same ? 'The usual order' : 'Reset to the usual order') + '</button>';
            })() +
            '<div class="fp-assume"><label class="fp-check" title="While a withdrawal would be penalised, accounts that would not be — and a Roth’s contributions — are drawn first, in the order above. Off: the order above as it stands, penalties and all."><input class="fp-in" type="checkbox" data-a="retire" data-k="avoidPenalty"' +
                (r.avoidPenalty !== false ? ' checked' : '') + '> Draw penalty-free money first until ' + fpAgeShort(taxRulesFor('').withdraw.early) + '</label></div>' : '') +
        '<div class="fp-retire-out"></div>';
}

/** Retirement in plain lines, for Copy summary and for the model. */
function fpRetireLines(plan, proj) {
    const ret = proj.retire;
    if (!ret) return [];
    const ms = proj.milestones, mon = (d) => d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    const lines = ['Retire ' + mon(ret.date) + ' at ' + fpAgeText(ret.atMonths) + (ret.job && ret.job.line ? ', when ' + (ret.job.line.name || 'the last job') + ' ends' : '') + ', spending ' + fpMoney(fpRetireSpending(plan)) + ' a month in today’s dollars, keeping ' +
        fpNum(plan.retire.buffer, 6) + ' months of it in cash.'];
    if (ms.runsOut === null) lines.push('The money lasts to ' + ret.until + '.');
    else { const d = new Date(proj.start.getFullYear(), proj.start.getMonth() + ms.runsOut - 1, 1); lines.push('The money runs out at ' + Math.floor(ret.ageAt(d) / 12) + ', in ' + mon(d) + '.'); }
    lines.push('Drawn on in this order: ' + fpDrawOrder(plan).map(a => fpAIName(a, fpKindLabel(a)) + (a.kind === 'retirement' ? ' (' + fpKindLabel(a) + ')' : '')).join(', ') + '.');
    const gap = fpPayGap(plan, ret);
    if (gap) lines.push('Pay stops in ' + fpWhen(plan, gap) + ', before retirement in ' + fpWhen(plan, ret.date) + ': savings are drawn on in between.');
    if (ms.medicare !== null) lines.push('Medicare from ' + fpWhen(plan, fpMonthAt(proj.start, ms.medicare)) + (ms.irmaa !== null ? '; the income-related surcharge from ' + fpMonthText(proj.start, ms.irmaa) : '') + '.');
    if (ms.rmd !== null) lines.push('Minimum withdrawals from pre-tax accounts from ' + fpMonthText(proj.start, ms.rmd) + ', at ' + ret.rmdAge + '.');
    if (ms.penalty !== null) lines.push('Pre-tax money is drawn before ' + fpAgeShort(ret.early) + ', from ' + fpWhen(plan, fpMonthAt(proj.start, ms.penalty)) + ': a ' + ret.penalty + '% penalty, ' + fpMoney(ms.penalties.pretax) + ' in all as paid.');
    if (ms.hsaPenalty !== null) lines.push('HSA money is spent on other than medical costs before ' + ret.hsaAge + ', from ' + fpWhen(plan, fpMonthAt(proj.start, ms.hsaPenalty)) + ': taxed, with a ' + ret.hsaPenalty + '% penalty, ' + fpMoney(ms.penalties.hsa) + ' in all as paid.');
    if (ms.rothEarly !== null) lines.push('Roth earnings are drawn before ' + fpAgeShort(ret.early) + ', from ' + fpWhen(plan, fpMonthAt(proj.start, ms.rothEarly)) + ': taxed, with a ' + ret.penalty + '% penalty, ' + fpMoney(ms.penalties.roth) + ' in all as paid.');
    const best = fpRetireMax(plan, 0);
    if (best !== null) lines.push('The most that could be spent and still last to ' + ret.until + ': ' + fpMoney(best) + ' a month in today’s dollars; currently set at ' + fpMoney(fpRetireSpending(plan)) + ' a month.');
    return lines;
}

/** What retirement comes to, in words — and, a moment after typing stops, the most that
 *  could be spent, which takes a few dozen runs of the plan to find. */
function fpRenderRetire(widget, plan, proj, low, high) {
    const out = widget.querySelector('.fp-retire-out');
    if (!out) return;
    const ret = fpRetireInfo(plan);
    if (!ret) { out.innerHTML = ''; return; }
    if (ret.missing) { out.innerHTML = '<span class="fp-note">A birth month — here, or on a Social Security line — is all it needs to know when.</span>'; return; }
    const ms = proj.milestones;
    const mon = (d) => d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    const byJob = ret.job && ret.job.line;
    const ageBox = widget.querySelector('.fp-retire-age');
    if (ageBox) ageBox.hidden = !!byJob;
    const bits = ['Retire <b>' + mon(ret.date) + '</b> at <b>' + fpAgeText(ret.atMonths) + '</b>' + (byJob ? ', when ' + escapeHtml(byJob.name || 'the last job') + ' ends' : '')];
    if (ret.job && !byJob) bits.push('<span class="fp-muted">' + (ret.job.open ? escapeHtml(ret.job.open.name || 'A job') + ' has no end date' : 'No job in Income') + ', so the age above is used</span>');
    if (ms.runsOut === null) bits.push('<span class="fp-pos">The money lasts to <b>' + ret.until + '</b></span>');
    else {
        const d = new Date(proj.start.getFullYear(), proj.start.getMonth() + ms.runsOut - 1, 1);
        bits.push('<span class="fp-neg">It runs out at <b>' + Math.floor(ret.ageAt(d) / 12) + '</b> (' + mon(d) + ')</span>');
    }
    if (low && high) {
        const lo = low.milestones.runsOut, hi = high.milestones.runsOut;
        const said = (x) => x === null ? 'lasts' : 'runs out at ' + Math.floor(ret.ageAt(new Date(proj.start.getFullYear(), proj.start.getMonth() + x - 1, 1)) / 12);
        bits.push('<span class="fp-muted">at returns ±' + fpNum(plan.assume.spread, 0) + '%: ' + said(lo) + ' / ' + said(hi) + '</span>');
    }
    const gap = fpPayGap(plan, ret);
    if (gap) bits.push('<span class="fp-neg">Pay stops in <b>' + fpWhen(plan, gap) + '</b>, but retirement is set for ' + fpWhen(plan, ret.date) + ': savings are drawn on in between.</span>' +
        (plan.retire.from !== 'job' && fpLastJob(plan).line ? ' <button type="button" class="fp-btn" onclick="fpRetireByJob(this)">Retire when the last job ends</button>' : ''));
    if (ms.medicare !== null) {
        const h = fpHealthOf(plan);
        bits.push('Medicare from <b>' + fpWhen(plan, fpMonthAt(proj.start, ms.medicare)) + '</b>: Part B ' + fpMoney(h.partB * h.persons) + ' a month' + (h.persons > 1 ? ' for two' : '') + ' in today’s money' +
            (ms.irmaa !== null ? ', more from ' + fpMonthText(proj.start, ms.irmaa).replace(/^\w+ /, '') + ', when income two years before is over ' + fpMoney(h.irmaa[0].from) : ''));
    }
    if (ms.rmd !== null) bits.push('Minimum withdrawals from <b>' + fpMonthText(proj.start, ms.rmd).replace(/^\w+ /, '') + '</b> (age ' + ret.rmdAge + ')');
    if (ms.hsaPenalty !== null) bits.push('<span class="fp-neg">HSA money is spent on other than medical costs from ' + fpWhen(plan, fpMonthAt(proj.start, ms.hsaPenalty)) + ', before ' + ret.hsaAge + ': taxed, with a ' + ret.hsaPenalty + '% penalty, ' + fpMoney(ms.penalties.hsa) + ' in all as paid</span>');
    if (ms.rothEarly !== null) bits.push('<span class="fp-neg">Roth earnings are drawn from ' + fpWhen(plan, fpMonthAt(proj.start, ms.rothEarly)) + ', before ' + fpAgeShort(ret.early) +
        ': taxed, with a ' + ret.penalty + '% penalty, ' + fpMoney(ms.penalties.roth) + ' in all as paid</span>');
    if (ms.penalty !== null) bits.push('<span class="fp-neg">Pre-tax money is drawn from ' + fpWhen(plan, fpMonthAt(proj.start, ms.penalty)) + ', before ' + fpAgeShort(ret.early) + ': a ' + ret.penalty + '% penalty, ' + fpMoney(ms.penalties.pretax) + ' in all as paid</span>');
    const need = widget._needed && widget._needed.value;
    if (need && need.rows) bits.push('<span' + (need.earliest === null ? ' class="fp-neg"' : '') + '>' + fpNeededText(need, true) + '</span>', '<span>' + fpForeverText(need, true) + '</span>');
    // Drawn again for the same plan (once the needed figures are in, say): the most that
    // could be spent is the same, so it is shown at once rather than worked out again.
    let raw = null;
    try { raw = localStorage.getItem(TAX_TABLE_KEY); } catch (e) { raw = null; }
    const key = JSON.stringify(plan) + '|' + raw + '|' + fpYm(new Date());
    if (widget._max && widget._max.key === key) {
        out.innerHTML = '<div class="fp-facts">' + bits.map(b => '<span class="fp-fact">' + b + '</span>').join('') + '</div><div class="fp-retire-max">' + widget._max.html + '</div>';
        return;
    }
    out.innerHTML = '<div class="fp-facts">' + bits.map(b => '<span class="fp-fact">' + b + '</span>').join('') + '</div><div class="fp-retire-max fp-muted">Working out the most you could spend…</div>';
    clearTimeout(widget._maxTimer);
    widget._maxTimer = setTimeout(() => {
        const box = widget.querySelector('.fp-retire-max');
        if (!box) return;
        const spread = Math.max(0, fpNum(plan.assume.spread, 0));
        const market = fpEntries(plan.accounts).some(a => FP_MARKET.includes(a.kind));
        const best = fpRetireMax(plan, 0);
        const range = spread && market ? [fpRetireMax(plan, -spread), fpRetireMax(plan, spread)] : null;
        box.className = 'fp-retire-max';
        box.innerHTML = 'You could spend up to <b>' + fpMoney(best) + '</b> a month in retirement, in today’s dollars, and last to ' + ret.until + ' (currently set at ' + fpMoney(fpRetireSpending(plan)) + ')' +
            (range ? ' <span class="fp-muted">(' + fpMoney(range[0]) + ' to ' + fpMoney(range[1]) + ' at returns ±' + spread + '%)</span>' : '') + '.';
        widget._max = { key: key, html: box.innerHTML };
    }, 250);
}

/** Everything worked out from the fields: the rollup, this month, the projection. */
/** What comes of a goal, in words: when, what it costs then, and how it is paid —
 *  covered by its account, or short and what a month more would cover it. `save` is
 *  fpGoalSavingFor's { value, stale }. */
function fpGoalText(plan, proj, g, save, html) {
    const b = (s) => html ? '<b>' + s + '</b>' : s;
    const bad = (s) => html ? '<span class="fp-neg">' + s + '</span>' : s;
    const name = b(html ? escapeHtml(g.name || 'A goal') : (g.name || 'A goal'));
    if (!(fpNum(g.cost, 0) > 0)) return name + ': give it a cost.';
    if (!/^\d{4}-\d{2}$/.test(g.from || '')) return name + ': give it the month its first payment falls.';
    const o = proj.milestones.goals && proj.milestones.goals[g.id];
    if (!o) return name + ': its payments are past.';
    const d0 = fpMonthAt(proj.start, o.first), d1 = fpMonthAt(proj.start, o.last);
    const plain = (s) => s;
    const when = o.count > 1 ? fpWhen(plan, d0, plain) + ' to ' + fpWhen(plan, d1, plain) + ' (' + o.count + ' payments)' : fpWhen(plan, d0, plain);
    let text = name + ', ' + when + ': ' + fpMoney(o.today) + ' in today’s dollars, ' + b(fpMoney(o.due)) + ' then.';
    const acct = fpGoalAccount(plan, g);
    const acctName = acct ? (html ? escapeHtml(acct.name || fpKindLabel(acct)) : (acct.name || fpKindLabel(acct))) : '';
    const offAcct = !acct && g.account ? fpAllEntries(plan.accounts).find(a => a.id === g.account && a.off) : null;
    if (offAcct) { const n = offAcct.name || fpKindLabel(offAcct); text += ' ' + (html ? escapeHtml(n) : n) + ' is off.'; }
    if (o.own) {
        const short = o.due - o.fromOwn;
        if (short < 1) text += ' ' + acctName + ' covers it, with ' + fpMoney(o.held) + ' in it by then' + (o.left > 1 ? ' and ' + fpMoney(o.left) + ' left after' : '') + '.';
        else {
            const x = save && save.value ? save.value[g.id] : undefined;
            text += ' ' + acctName + ' covers ' + fpMoney(o.fromOwn) + ' of it: ' + bad('short ' + fpMoney(short)) + ', paid from ' + (o.retired ? 'savings' : o.drawn > 1 ? 'cash and savings' : 'cash') + ' instead.' +
                (x ? ' ' + b(fpMoney(x) + ' a month') + ' more into ' + acctName + ' from now would cover it.' : x === null ? ' More a month into ' + acctName + ' would not cover it in time.' : save && save.stale ? ' Working out what a month more would cover it…' : '');
        }
    } else if (o.retired) text += ' Paid in retirement, from cash and then savings in the withdrawal order.';
    else if (o.drawn > 1) text += ' ' + bad('Cash falls short: ' + fpMoney(o.drawn) + ' of it is drawn from savings.') + ' Choose an account to pay it from, to see what to set aside a month.';
    else text += ' Paid from ' + (acct ? acctName : 'cash') + ', which covers it.';
    if (/college|universit|school|tuition|educat/i.test(g.name || '') && !fpEntries(plan.accounts).some(a => a.kind === 'education'))
        text += ' A 529 grows untaxed and is spent untaxed on school: add one in Accounts and pay this from it.';
    return text;
}

function fpRenderDerived(widget, plan) {
    const toolId = fpToolId(widget);
    plan = plan || fpGet(toolId);
    fpRefreshAccounts(widget, plan);
    fpRefreshSections(widget, plan);
    fpRefreshIncomeDetails(widget, plan);
    fpRefreshAgeHints(widget, plan);
    const roll = fpRollup(plan);
    const proj = fpProject(plan, 0, { detail: true });
    const spread = Math.max(0, fpNum(plan.assume.spread, 0));
    const hasMarket = fpEntries(plan.accounts).some(a => FP_MARKET.includes(a.kind));
    const low = spread && hasMarket ? fpProject(plan, -spread) : null;
    const high = spread && hasMarket ? fpProject(plan, spread) : null;

    // Today.
    const assetKinds = Object.keys(FP_KINDS).filter(k => FP_KINDS[k].side === 'asset' && roll.by[k] > 0);
    const owedKinds = Object.keys(FP_KINDS).filter(k => FP_KINDS[k].side === 'liability' && roll.by[k] > 0);
    const bar = (kinds, total) => total > 0 ? '<div class="fp-bar">' + kinds.map(k =>
        '<span class="fp-bar-seg" style="width:' + (roll.by[k] / total * 100).toFixed(2) + '%;background:' + FP_KINDS[k].color + '" title="' +
            FP_KINDS[k].label + ': ' + fpMoney(roll.by[k]) + ' (' + Math.round(roll.by[k] / total * 100) + '%)"></span>').join('') + '</div>' +
        '<div class="fp-legend">' + kinds.map(k => '<span><i style="background:' + FP_KINDS[k].color + '"></i>' + FP_KINDS[k].label + ' ' + fpMoney(roll.by[k]) + '</span>').join('') + '</div>' : '';
    const liquid = roll.by.cash || 0;
    widget.querySelector('.fp-rollup').innerHTML =
        '<div class="fp-cards">' +
            '<div class="fp-card"><div class="fp-card-label">Assets</div><div class="fp-card-value">' + fpMoney(roll.assets) + '</div>' +
                '<div class="fp-card-sub">' + fpMoney(liquid) + ' in cash · ' + fpMoney(roll.assets - liquid) + ' invested or held</div></div>' +
            '<div class="fp-card"><div class="fp-card-label">Liabilities</div><div class="fp-card-value fp-neg">' + fpMoney(roll.liabilities) + '</div></div>' +
            '<div class="fp-card fp-card-net"><div class="fp-card-label">Net worth</div><div class="fp-card-value">' + fpMoney(roll.net) + '</div></div>' +
        '</div>' + bar(assetKinds, roll.assets) + bar(owedKinds, roll.liabilities);

    // This month.
    const f = proj.first;
    const into = plan.accounts.find(a => a.id === proj.into);
    const surplusTargets = fpEntries(plan.accounts).filter(a => (FP_KINDS[a.kind] || FP_KINDS.other).side === 'asset');
    widget.querySelector('.fp-month').innerHTML = '<div class="fp-flow">' +
            '<span>Income <b>' + fpMoney(f.income) + '</b></span>' +
            (f.deductions ? '<span' + (f.payrollOwn ? ' title="' + fpMoney(f.payrollOwn) + ' of it into accounts"' : '') + '>− deductions <b>' + fpMoney(f.deductions) + '</b></span>' : '') +
            (plan.tax.on || f.tax ? '<span title="' + [f.typedTax ? fpMoney(f.typedTax) + ' as typed' : '', f.estimatedTax ? fpMoney(f.estimatedTax) + ' federal estimated' : '',
                f.payrollTax ? fpMoney(f.payrollTax) + ' payroll (Social Security and Medicare) estimated' : ''].filter(Boolean).join(', ') + '">− taxes <b>' + fpMoney(f.tax) + '</b></span>' : '') +
            '<span>= take-home <b>' + fpMoney(f.takeHome) + '</b></span>' +
            '<span>− expenses <b>' + fpMoney(f.expenses) + '</b></span>' +
            (f.goals ? '<span>− goals <b>' + fpMoney(f.goals) + '</b></span>' : '') +
            '<span>− loan payments <b>' + fpMoney(f.payments) + '</b></span>' +
            (f.escrow ? '<span title="Property tax and insurance paid with the loans">− escrow <b>' + fpMoney(f.escrow) + '</b></span>' : '') +
            '<span>− added to accounts <b>' + fpMoney(f.contributions) + '</b></span>' +
            '<span class="' + (f.surplus < 0 ? 'fp-neg' : 'fp-pos') + '">= ' + (f.surplus < 0 ? 'short ' : 'left over ') + '<b>' + fpMoney(Math.abs(f.surplus)) + '</b></span>' +
        '</div>' +
        '<div class="fp-into">' + (f.surplus < 0 ? 'Taken from' : 'Goes to') + ' <select class="fp-in" data-a="surplusTo" aria-label="Where what is left over goes">' +
            '<option value="">' + (into && !surplusTargets.some(a => a.id === plan.surplusTo) ? 'First cash account (' + escapeHtml(into.name || 'Cash') + ')' : 'First cash account') + '</option>' +
            surplusTargets.map(a => '<option value="' + escapeHtml(a.id) + '"' + (plan.surplusTo === a.id ? ' selected' : '') + '>' + escapeHtml(a.name || FP_KINDS[a.kind].label) + '</option>').join('') +
        '</select>' + (!proj.into ? ' <span class="fp-note">No cash account yet: it is counted on its own.</span>' : '') + '</div>';
    if (f.payrollOwn || f.payrollMatch) {
        const now = fpPayrollNow(plan);
        widget.querySelector('.fp-month').insertAdjacentHTML('beforeend', '<div class="fp-payroll">From pay, into accounts: ' + Object.keys(now).map(k => {
            const a = plan.accounts.find(x => x.id === k);
            return '<b>' + fpMoney(now[k].own + now[k].match) + '</b> into ' + escapeHtml(a.name || FP_KINDS[a.kind].label) + (now[k].match ? ' (' + fpMoney(now[k].own) + ' yours, ' + fpMoney(now[k].match) + ' employer)' : '');
        }).join(', ') + ' — saved, not spent.</div>');
    }
    const sel = widget.querySelector('.fp-month [data-a="surplusTo"]');
    sel.addEventListener('change', () => fpOnInput(sel));

    // Ahead.
    const ms = proj.milestones;
    const facts = [];
    const when = (t) => fpWhen(plan, fpMonthAt(proj.start, t), (s) => '<b>' + s + '</b>');
    if (ms.debtFree !== null) facts.push('Debt-free ' + when(ms.debtFree));
    else if (roll.liabilities > 0) facts.push('<span class="fp-neg">Still owing after ' + (proj.rows.length - 1) + ' years</span>');
    if (ms.drawnEarly !== null) facts.push('<span class="fp-neg">Savings drawn on before retirement from ' + when(ms.drawnEarly) + '</span>');
    const penaltyAll = proj.rows.reduce((s, r) => s + (r.withdrawPenalty || 0), 0);
    const penaltyFrom = [ms.penalty, ms.rothEarly, ms.hsaPenalty].filter(x => x !== null);
    if (penaltyFrom.length) facts.push('<span class="fp-neg">Early-withdrawal penalties: ' + fpMoney(penaltyAll) + ', from ' + when(Math.min(...penaltyFrom)) + '</span>');
    if (proj.retire && ms.retire !== null) facts.push('Retire ' + when(ms.retire));
    if (proj.retire && ms.runsOut !== null) facts.push('<span class="fp-neg">Savings run out ' + when(ms.runsOut) + '</span>');
    if (fpNum(plan.assume.target, 0) > 0) facts.push(ms.target === 0 ? 'Past the ' + fpMoney(plan.assume.target) + ' goal already'
        : ms.target !== null ? fpMoney(plan.assume.target) + ' net worth ' + when(ms.target) : 'The ' + fpMoney(plan.assume.target) + ' goal is not reached');
    fpEntries(plan.incomes).filter(l => l.type === 'ss').forEach(l => {
        const s = fpSSInfo(l);
        // A Social Security line's own age: the one it is claimed at.
        if (s && s.start > new Date()) facts.push((escapeHtml(l.name) || 'Social Security') + ' starts <b>' + s.start.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) + '</b>, at ' + fpAgeText(s.claim));
    });
    fpEntries(plan.goals).forEach(g => {
        const o = ms.goals[g.id];
        if (o) facts.push(escapeHtml(g.name || 'A goal') + ' ' + when(o.first) + ': ' + fpMoney(o.due) + (o.own && o.due - o.fromOwn >= 1 ? ' <span class="fp-neg">(short ' + fpMoney(o.due - o.fromOwn) + ')</span>' : ''));
    });
    if (ms.cashOut !== null) facts.push('<span class="fp-neg">' + (ms.drawnEarly !== null && (ms.retire === null || ms.cashOut < ms.retire) ? 'Savings run out ' : 'Cash runs out ') + when(ms.cashOut) + '</span>');
    ms.growing.forEach(id => { const a = plan.accounts.find(x => x.id === id); if (a) facts.push('<span class="fp-neg">' + escapeHtml(a.name || 'A loan') + ': the payment does not cover the interest</span>'); });
    const limitSaid = {};
    fpEntries(plan.accounts).forEach(a => { const c = fpLimitCheck(plan, a); if (c && c.over && !limitSaid[c.key]) { limitSaid[c.key] = true; facts.push('<span class="fp-neg">' + escapeHtml(fpLimitText(c)) + '</span>'); } });
    const last = proj.rows[proj.rows.length - 1];
    const pot = into ? (into.name || FP_KINDS[into.kind].label) : 'Left over';
    const R = !!proj.retire;
    const A = proj.rows.some(r => r.age !== null && r.age !== undefined);
    // What would be needed to stop working each year, by the year's month count.
    const needState = fpNeededFor(widget, plan);
    const need = needState.value;
    const needAt = {};
    if (need && need.rows) need.rows.forEach(r => { needAt[r.t] = r; });
    const N = !!(need && need.rows);
    const stale = needState.stale ? ' fp-stale' : '';
    if (N) facts.push('<span class="' + (need.earliest === null ? 'fp-neg' : '') + stale + '" title="The first year the savings you can draw on — not property — reach what would be needed to stop working then and still last to ' +
        need.until + ', on the plan’s spending in retirement, income, returns and taxes">' + fpNeededText(need, true) + '</span>');
    if (N) facts.push('<span class="' + stale + '" title="' + FP_FOREVER_TIP + '">' + fpForeverText(need, true) + '</span>');
    if (N) facts.push('<span class="fp-last-to' + stale + '" title="The most that could be spent each month, beside health costs, goals and loans, for the money to last to ' + need.until + '. Click a year for stopping then.">' + fpLastToText(need, true) + '</span>');
    if (N) facts.push('<span class="fp-tail' + stale + '" title="The plan’s last year, a month: ' + fpTailParts(need.tail) + '. Needed to stop falls to about a year of what savings pay; Lasts forever is the pot that can go on paying it.">' + fpTailText(need, true) + '</span>');
    else if (need && need.missing) facts.push('<span class="fp-muted">With a birth month, in Retirement or on a Social Security line, it works out the year you could stop working.</span>');
    // The years looked at: all of them, or the range picked above the chart.
    const span = fpChartSpan(widget, proj);
    const shown = proj.rows.slice(span.a, span.b + 1);
    const cut = (x) => x ? Object.assign({}, x, { rows: x.rows.slice(span.a, span.b + 1) }) : x;
    const yearLabel = (r) => r.t === 0 ? 'Now' : String(r.year);
    // The year picked on the chart or in the table, while it is among those shown.
    if (widget._yearT !== undefined && widget._yearT !== null && !shown.some(r => r.t === widget._yearT)) widget._yearT = null;
    const pick = widget._yearT === undefined ? null : widget._yearT;
    widget._shownT = shown.map(r => r.t);
    const pickI = pick === null ? -1 : proj.rows.findIndex(r => r.t === pick);
    const yearAge = (r) => yearLabel(r) + (r.age === null || r.age === undefined ? '' : ' · ' + r.age);
    const range = proj.rows.length > 2 ? '<div class="fp-range"><label>Years <select class="fp-range-from" onchange="fpChartRange(this)" aria-label="From year">' +
            proj.rows.slice(0, -1).map((r, i) => '<option value="' + r.year + '"' + (i === span.a ? ' selected' : '') + '>' + yearAge(r) + '</option>').join('') + '</select></label>' +
        '<label>to <select class="fp-range-to" onchange="fpChartRange(this)" aria-label="To year">' +
            proj.rows.slice(1).map((r, i) => '<option value="' + r.year + '"' + (i + 1 === span.b ? ' selected' : '') + '>' + yearAge(r) + '</option>').join('') + '</select></label>' +
        '<button type="button" class="fp-btn fp-range-all" onclick="fpChartRange(this, true)"' + (span.all ? ' disabled' : '') + '>All years</button></div>' : '';
    const penaltyYears = shown.filter(r => r.withdrawPenalty >= 0.5);
    const P = penaltyYears.length > 0;
    // A year's penalty by account, in the money the table is in.
    const penaltySplit = (r) => {
        const by = (proj.detail[proj.rows.indexOf(r)] || {}).penalty || {};
        const all = Object.keys(by).reduce((s, k) => s + by[k], 0);
        return Object.keys(by).filter(k => by[k] > 0).map(k => { const a = plan.accounts.find(x => x.id === k); return (a ? a.name || fpKindLabel(a) : 'An account') + ' ' + fpMoney(by[k] / all * r.withdrawPenalty); }).join(', ');
    };
    const table = '<table class="fp-table fp-years"><thead><tr><th>Year</th>' + (A ? '<th>Age</th>' : '') + '<th>Assets</th><th>Liabilities</th><th>Net worth</th>' + (low ? '<th>Range</th>' : '') +
        '<th title="The account what is left over each month goes to">' + escapeHtml(pot) + '</th>' +
        (N ? '<th title="Savings that can be drawn on: cash, investments, retirement and other accounts — not property">Can draw on</th>' +
            '<th title="What savings would need to be at the start of the year to stop working then and still last to ' + need.until + '">Needed to stop</th><th title="What savings would need to be at the start of the year to stop working then and never run out">Lasts forever</th>' : '') +
        (R ? '<th title="Drawn from savings that year">Withdrawn</th><th title="Federal tax on the pre-tax money drawn, and on the gains in investments drawn">Tax on it</th>' : '') +
        (P ? '<th title="Early-withdrawal penalties on what was drawn">Penalty</th>' : '') + '</tr></thead><tbody>' +
        // A short range, every year; a long one, the first five, every fifth after, and any
        // year with a penalty, which would otherwise go unseen.
        shown.filter((r, j) => shown.length <= 16 || j === 0 || r.t / 12 <= 5 || (r.t / 12) % 5 === 0 || j === shown.length - 1 || r.withdrawPenalty >= 0.5).map(r => {
            const i = proj.rows.indexOf(r);
            return '<tr class="fp-year-row' + (r.t === pick ? ' fp-year-on' : '') + '" data-t="' + r.t + '" onclick="fpPickYear(this)" title="What made up ' + (r.t === 0 ? 'this month' : 'this year') + '">' +
                '<td>' + yearLabel(r) + '</td>' + (A ? '<td>' + (r.age == null ? '' : r.age) + '</td>' : '') + '<td>' + fpMoney(r.assets) + '</td><td>' + fpMoney(r.liabilities) + '</td><td><b>' + fpMoney(r.net) + '</b></td>' +
                (low ? '<td class="fp-muted">' + fpMoney(low.rows[i].net, true) + ' – ' + fpMoney(high.rows[i].net, true) + '</td>' : '') +
                '<td class="' + (r.cash < -0.005 ? 'fp-neg' : '') + '">' + fpMoney(r.cash) + '</td>' +
                (N ? (needAt[r.t] ? '<td class="fp-need-have' + stale + '">' + fpMoney(needAt[r.t].have) + '</td><td class="fp-need' + (needAt[r.t].enough ? ' fp-pos' : '') + stale + '">' +
                    (needAt[r.t].needed === Infinity ? 'out of reach' : fpMoney(needAt[r.t].needed)) + '</td><td class="fp-need-forever' + (needAt[r.t].enoughForever ? ' fp-pos' : '') + stale + '">' +
                    (needAt[r.t].forever === Infinity ? 'out of reach' : fpMoney(needAt[r.t].forever)) + '</td>' : '<td></td><td></td><td></td>') : '') +
                (R ? '<td>' + (r.withdrawn ? fpMoney(r.withdrawn) : '') + '</td><td>' + (r.withdrawTax ? fpMoney(r.withdrawTax) : '') + '</td>' : '') +
                (P ? (r.withdrawPenalty >= 0.5 ? '<td class="fp-neg" title="' + escapeHtml(penaltySplit(r)) + '">' + fpMoney(r.withdrawPenalty) + '</td>' : '<td></td>') : '') + '</tr>';
        }).join('') + '</tbody></table>' +
        (P ? '<div class="fp-years-foot fp-neg">Early-withdrawal penalties: <b>' + fpMoney(penaltyYears.reduce((s, r) => s + r.withdrawPenalty, 0)) + '</b> over ' + penaltyYears.length + (penaltyYears.length === 1 ? ' year' : ' years') + '</div>' : '');
    fpRenderRetire(widget, plan, proj, low, high);
    const goalSave = fpGoalSavingFor(widget, plan);
    const goalsBox = widget.querySelector('.fp-goals-out');
    if (goalsBox) goalsBox.innerHTML = fpEntries(plan.goals).map(g => '<li data-goal="' + escapeHtml(g.id) + '"' + (goalSave.stale ? ' class="fp-goal-working"' : '') + '>' + fpGoalText(plan, proj, g, goalSave, true) + '</li>').join('');
    const adviceBox = widget.querySelector('.fp-advice');
    if (adviceBox) adviceBox.innerHTML = fpAdviceHtml(plan, proj, low, high, goalSave);
    widget.querySelector('.fp-projection').innerHTML = '<div class="fp-ahead-sub">' + (proj.rows.length - 1) + ' years' + (proj.retire ? ', to age ' + proj.retire.until : last.age != null ? ', to age ' + last.age : '') +
        (plan.assume.real ? ', in today’s money' : '') + '</div>' +
        (facts.length ? '<div class="fp-facts">' + facts.map(f => '<span class="fp-fact">' + f + '</span>').join('') + '</div>' : '') +
        (widget._neededJob ? fpProgressHtml(widget._neededJob) : '') +
        range + fpChart(cut(proj), cut(low), cut(high), N ? { at: needAt, earliest: need.earliest === null ? null : need.rows[need.earliest].t, foreverT: need.foreverAt === null ? null : need.rows[need.foreverAt].t, stale: !!stale,
            tip: (t) => fpYearSpendText(need, t, true) + (stale ? ' (updating)' : '') } : null,
        fpChartMarks(plan, proj), pick, fpChartLine(widget)) +
        (pickI >= 0 ? fpYearDetailHtml(plan, proj, pickI, low, high, needAt[pick] || null, N ? need : null, stale) : '<div class="fp-yd-hint">Click a year on the chart, or in the table, for what made it up.</div>') +
        '<div class="fp-years-head">In ' + last.year + (last.age != null ? ', at ' + last.age : '') + ': net worth <b>' + fpMoney(last.net) + '</b>' + (low ? ' (' + fpMoney(low.rows[low.rows.length - 1].net) + ' to ' + fpMoney(high.rows[high.rows.length - 1].net) + ' at returns ±' + spread + '%)' : '') + '</div>' +
        table;
}

// ---- A year, taken apart --------------------------------------------------------------------
//
// Picking a year on the chart, or in the year table, opens what made it up: the money in and
// out, line by line; each account from the start of the year to its end, with what went in,
// what was drawn and what it earned; what happened that year; and the assumptions it was
// worked out with. Row 0 is this month; every other row, the twelve months to it. Amounts
// are in dollars of the time, so that they add up; today's money is beside them.

/** The picked year's breakdown. `i` is its row; `needRow` its Needed to stop, if worked out, from `need`. */
function fpYearDetailHtml(plan, proj, i, low, high, needRow, need, stale) {
    const r = proj.rows[i], d = proj.detail && proj.detail[i];
    if (!r || !d) return '';
    plan = fpCalc(plan);
    const esc = (s) => escapeHtml(String(s));
    const m = (v) => fpMoney(v);
    const signed = (v) => Math.abs(v) < 0.5 ? '—' : (v > 0 ? '+' : '') + fpMoney(v);
    const infl = fpNum(plan.assume.inflation, 0) / 100;
    const tA = i === 0 ? 1 : r.t - 11, tB = i === 0 ? 1 : r.t;
    const idx = Math.pow(1 + infl, (i === 0 ? 0 : r.t) / 12);
    const monthOf = (t) => fpMonthAt(proj.start, t).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    const span = i === 0 ? 'This month, ' + monthOf(1) : monthOf(tA) + ' to ' + monthOf(tB);
    const ms = proj.milestones;
    const retired = i === 0 ? proj.retire && ms.retire === 1 : !!r.retired;
    const acc = (id) => plan.accounts.find(a => a.id === id);
    const accName = (a) => esc(a.name || fpKindLabel(a));
    const lineOf = (list, id) => (plan[list] || []).find(x => x.id === id);
    const sum = (o) => Object.keys(o).reduce((s, k) => s + o[k], 0);
    const row = (label, v, cls, title) => Math.abs(v) < 0.5 ? '' : '<tr' + (cls ? ' class="' + cls + '"' : '') + (title ? ' title="' + esc(title) + '"' : '') + '><th scope="row">' + label + '</th><td>' + m(v) + '</td></tr>';
    const total = (label, v, cls) => '<tr class="fp-yd-total' + (cls ? ' ' + cls : '') + '"><th scope="row">' + label + '</th><td>' + m(v) + '</td></tr>';

    // Money in and out.
    const income = sum(d.income);
    let flow = Object.keys(d.income).map(id => { const l = lineOf('incomes', id); return row(l ? esc(l.name || (l.type === 'ss' ? 'Social Security' : 'Income')) : 'Income', d.income[id]); }).join('') +
        total('Income', income);
    const outs = [];
    if (d.deductions) outs.push(row('Deductions', d.deductions, '', d.payrollOwn ? m(d.payrollOwn) + ' of it into accounts — saved, not spent' : ''));
    outs.push(row('Federal income tax, estimated', d.fedTax), row('Payroll tax (Social Security and Medicare)', d.payrollTax), row('Taxes as typed', d.typedTax));
    Object.keys(d.expenses).forEach(id => { const l = lineOf('expenses', id); outs.push(row(l ? esc(l.name || 'Expense') : 'Expense', d.expenses[id])); });
    outs.push(row('Spending in retirement', d.spending), row('Health cover before Medicare', d.healthBefore), row('Medicare Part B', d.partB),
        row('Medicare surcharge (IRMAA)', d.irmaa, 'fp-neg'), row('Health costs beside Medicare', d.healthAfter));
    Object.keys(d.payments).forEach(id => { const a = acc(id); outs.push(row('Payment: ' + (a ? accName(a) : 'loan'), d.payments[id])); });
    Object.keys(d.escrow).forEach(id => { const a = acc(id); outs.push(row('Escrow: ' + (a ? accName(a) : 'loan'), d.escrow[id])); });
    Object.keys(d.contrib).forEach(id => { const a = acc(id); outs.push(row('Added to ' + (a ? accName(a) : 'an account'), d.contrib[id])); });
    Object.keys(d.goals).forEach(id => { const g = lineOf('goals', id); outs.push(row('Goal: ' + (g ? esc(g.name || 'A goal') : 'a goal'), d.goals[id])); });
    const outTotal = income - d.leftover;
    flow += outs.join('') + total('Going out', outTotal) + total(d.leftover < 0 ? 'Short' : 'Left over', Math.abs(d.leftover), d.leftover < 0 ? 'fp-neg' : 'fp-pos');
    const drawnIds = Object.keys(d.drawn);
    let draws = '';
    if (drawnIds.length) {
        draws = drawnIds.map(id => { const a = acc(id); return row('From ' + (a ? accName(a) : 'an account') + (d.rmd[id] ? ' <span class="fp-muted">(' + m(d.rmd[id]) + ' the required minimum)</span>' : ''), d.drawn[id]); }).join('') +
            row('Tax on what was drawn', d.withdrawTax) +
            Object.keys(d.penalty).map(id => { const a = acc(id); return row('Early-withdrawal penalty: ' + (a ? accName(a) : 'an account'), d.penalty[id], 'fp-neg'); }).join('') +
            total('Into cash', d.puts);
        draws = '<table class="fp-yd-table"><caption>Drawn from savings</caption><tbody>' + draws + '</tbody></table>';
    }

    // Accounts, start to end.
    const into = proj.into;
    const accRows = [];
    let tot = { s: 0, a: 0, dr: 0, g: 0, e: 0 };
    plan.accounts.forEach(a => {
        const liab = (FP_KINDS[a.kind] || FP_KINDS.other).side === 'liability';
        const sign = liab ? -1 : 1;
        const s = sign * Math.max(liab ? 0 : -Infinity, d.start[a.id] || 0), e = sign * Math.max(liab ? 0 : -Infinity, d.end[a.id] || 0);
        const added = (d.added[a.id] || 0) + (a.id === into ? d.leftover + d.puts : 0);
        const dr = d.drawn[a.id] || 0, g = d.growth[a.id] || 0;
        if ([s, e, added, dr, g].every(v => Math.abs(v) < 0.5)) return;
        tot.s += s; tot.a += added; tot.dr += dr; tot.g += g; tot.e += e;
        accRows.push('<tr><th scope="row">' + accName(a) + ' <span class="fp-muted">' + esc(fpKindLabel(a)) + '</span></th><td>' + m(s) + '</td><td>' + signed(added) + '</td><td>' + (dr >= 0.5 ? '−' + m(dr) : '—') + '</td><td>' + signed(g) + '</td><td><b>' + m(e) + '</b></td></tr>');
    });
    if (!into && (Math.abs(d.looseStart) >= 0.5 || Math.abs(d.looseEnd) >= 0.5)) {
        const added = d.leftover + d.puts;
        tot.s += d.looseStart; tot.a += added; tot.e += d.looseEnd;
        accRows.push('<tr><th scope="row">Left over <span class="fp-muted">no cash account</span></th><td>' + m(d.looseStart) + '</td><td>' + signed(added) + '</td><td>—</td><td>—</td><td><b>' + m(d.looseEnd) + '</b></td></tr>');
    }
    const accounts = '<div class="fp-yd-scroll"><table class="fp-yd-table fp-yd-accounts"><caption>Accounts</caption><thead><tr><th>Account</th><th>Start</th>' +
        '<th title="Contributions, pay saved into it, the employer’s match, what is left over (cash), withdrawals landing in cash; for a loan, what was paid">In</th>' +
        '<th title="Drawn out of it">Drawn</th><th title="Returns earned; for a loan, interest charged">Growth</th><th>End</th></tr></thead><tbody>' + accRows.join('') +
        '<tr class="fp-yd-total"><th scope="row">Net worth</th><td>' + m(tot.s) + '</td><td>' + signed(tot.a) + '</td><td>' + (tot.dr >= 0.5 ? '−' + m(tot.dr) : '—') + '</td><td>' + signed(tot.g) + '</td><td><b>' + m(tot.e) + '</b></td></tr></tbody></table></div>';

    // What happened.
    const inWin = (t) => t !== null && t !== undefined && t >= tA && t <= tB;
    const ev = [];
    const neg = (s) => '<span class="fp-neg">' + s + '</span>';
    if (inWin(ms.retire) && proj.retire) ev.push('Retirement starts, ' + fpWhen(plan, fpMonthAt(proj.start, ms.retire)) + '.');
    fpEntries(plan.incomes).filter(l => l.type === 'ss').forEach(l => {
        const s = fpSSInfo(l);
        if (!s) return;
        const t = (s.start.getFullYear() - proj.start.getFullYear()) * 12 + s.start.getMonth() - proj.start.getMonth() + 1;
        if (inWin(t)) ev.push(esc(l.name || 'Social Security') + ' starts, at ' + fpAgeText(s.claim) + '.');
    });
    fpPayChanges(plan, proj).filter(c => inWin(c.t)).forEach(c => ev.push(esc(c.text) + ', ' + fpWhen(plan, fpMonthAt(proj.start, c.t)) + '.'));
    if (inWin(ms.medicare)) ev.push('Medicare starts: Part B instead of health cover bought on its own.');
    if (inWin(ms.irmaa)) ev.push(neg('The Medicare surcharge first applies, from income two years before.'));
    if (inWin(ms.rmd)) ev.push('Required minimum withdrawals begin, from age ' + (proj.retire ? proj.retire.rmdAge : '') + '.');
    if (inWin(ms.debtFree)) ev.push('Debt-free.');
    if (inWin(ms.target) && fpNum(plan.assume.target, 0) > 0) ev.push('Net worth reaches the ' + m(plan.assume.target) + ' goal.');
    Object.keys(d.goals).forEach(id => { const g = lineOf('goals', id); ev.push('Goal paid: ' + (g ? esc(g.name || 'A goal') : 'a goal') + ', ' + m(d.goals[id]) + '.'); });
    if (inWin(ms.drawnEarly)) ev.push(neg('Savings are drawn on before retirement.'));
    const W = taxRulesFor('').withdraw;
    if (inWin(ms.penalty)) ev.push(neg('Pre-tax money is first drawn before ' + fpAgeShort(W.early) + ': a ' + W.penalty + '% penalty.'));
    if (inWin(ms.rothEarly)) ev.push(neg('Roth earnings are first drawn before ' + fpAgeShort(W.early) + ': taxed, with a ' + W.penalty + '% penalty.'));
    if (inWin(ms.hsaPenalty)) ev.push(neg('HSA money is first spent on other than medical costs before ' + W.hsaAge + ': taxed, with a ' + W.hsaPenalty + '% penalty.'));
    if (inWin(ms.cashOut)) ev.push(neg('Cash runs out.'));
    if (inWin(ms.runsOut)) ev.push(neg('Savings run out.'));
    if (needRow) ev.push('To stop working at the start of ' + needRow.year + ': ' + (isFinite(needRow.needed) ? m(needRow.needed) : 'out of reach') + ' needed, ' + m(needRow.have) + ' to draw on' +
        (plan.assume.real ? ' (today’s money)' : '') + (needRow.enough ? ' — enough.' : '.'));
    if (needRow) ev.push('To last forever from then: ' + (isFinite(needRow.forever) ? m(needRow.forever) : 'out of reach') + (needRow.enoughForever ? ' — enough.' : '.'));

    // The assumptions it was worked out with.
    const as = [];
    as.push('Inflation ' + fpNum(plan.assume.inflation, 0) + '% a year' + (idx > 1.0005 ? ': prices ' + idx.toFixed(2) + '× today’s. In today’s money, divide what is here by ' + idx.toFixed(2) + '.' : '.'));
    const spread = Math.max(0, fpNum(plan.assume.spread, 0));
    const rates = plan.accounts.filter(a => Math.abs(d.start[a.id] || 0) >= 0.5 || Math.abs(d.end[a.id] || 0) >= 0.5).map(a =>
        accName(a) + ' ' + fpRateOf(plan, a) + '%' + (low && FP_MARKET.includes(a.kind) ? ' ±' + spread : ''));
    if (rates.length) as.push('Rates a year: ' + rates.join(', ') + '.');
    const grows = [];
    Object.keys(d.income).forEach(id => { const l = lineOf('incomes', id); if (l) grows.push(esc(l.name || 'Income') + ' ' + fpNum(l.growth, fpNum(plan.assume.inflation, 0)) + '%' + (l.type === 'ss' ? ' (cost of living)' : '')); });
    Object.keys(d.expenses).forEach(id => { const l = lineOf('expenses', id); if (l) grows.push(esc(l.name || 'Expense') + ' ' + fpNum(l.growth, fpNum(plan.assume.inflation, 0)) + '%'); });
    Object.keys(d.goals).forEach(id => { const g = lineOf('goals', id); if (g) grows.push(esc(g.name || 'A goal') + ' ' + fpNum(g.growth, fpNum(plan.assume.inflation, 0)) + '%'); });
    if (grows.length) as.push('Growing a year: ' + grows.join(', ') + '.');
    const info = fpTaxInfo(plan);
    const ti = i === 0 ? 1 : r.index || 1;
    if (info && info.federal) {
        let top = '';
        if (i > 0 && info.brackets.length) {
            const taxable = Math.max(0, r.ordinary - info.deduction * ti);
            const b = info.brackets.filter(x => taxable > x.min * ti).pop();
            if (b) top = '; ' + m(r.ordinary) + ' of ordinary income, the top of it taxed at ' + Math.round(b.rate * 100) + '%';
        }
        as.push('Federal tax: the ' + esc(info.year) + ' rules, ' + esc((TAX_STATUSES[info.status] || '').toLowerCase()) + ', its thresholds moved up with inflation — standard deduction ' + m(info.deduction * ti) + top + '.');
    } else as.push('Federal income tax is not estimated.');
    if (info && info.payroll) as.push('Payroll tax: ' + info.pay.ssRate + '% Social Security on pay up to ' + m(info.pay.wageBase * ti) + ', ' + info.pay.medicare + '% Medicare.');
    if (proj.retire) {
        const ret = proj.retire, h = fpHealthOf(plan);
        as.push('Retirement at ' + fpAgeText(ret.atMonths) + ' (' + monthOf((ret.date.getFullYear() - proj.start.getFullYear()) * 12 + ret.date.getMonth() - proj.start.getMonth() + 1) + '), lasting to ' + ret.until +
            '; spending ' + m(fpRetireSpending(plan)) + ' a month in today’s dollars' + (retired ? ', ' + m(fpRetireSpending(plan) * idx) + ' then' : '') +
            '; cash kept at ' + Math.max(0, fpNum(plan.retire.buffer, 6)) + ' months of spending.');
        if (h.on) as.push('Health cover: ' + m(h.before) + ' a month before Medicare at ' + h.age + ', ' + m(h.after) + ' beside it, rising ' + Math.round(h.medInfl * 1000) / 10 + '% a year.');
        as.push('Withdrawals: a ' + W.penalty + '% penalty before ' + fpAgeShort(W.early) + ' on pre-tax money and Roth earnings — not from a 401(k) left in or after the year of turning ' + W.sepAge + ', nor a 457(b) once work stops; ' +
            W.hsaPenalty + '% on an HSA spent on other than medical costs before ' + W.hsaAge + '; ' + (plan.retire.avoidPenalty !== false ? 'penalty-free money drawn first' : 'drawn in the order given') + '; required minimums from ' + ret.rmdAge + '.');
    }
    if (low && high && i > 0) as.push('The range: investment returns ' + spread + '% lower or higher — net worth ' + m(low.rows[i].net) + ' to ' + m(high.rows[i].net) + (plan.assume.real ? ' in today’s money' : '') + '.');

    return '<div class="fp-yd" data-t="' + r.t + '">' +
        '<div class="fp-yd-head"><h5 tabindex="-1">' + (i === 0 ? 'Now' : r.year) + (r.age != null ? ' · age ' + r.age : '') + ' · ' + (retired ? 'retired' : 'working') + '</h5>' +
            '<span class="fp-muted">' + span + ', in dollars of the time' + (plan.assume.real && idx > 1.0005 ? ' — net worth ' + m(r.net) + ' in today’s money' : '') + '</span>' +
            '<span class="fp-yd-nav"><button type="button" class="fp-btn" data-dir="-1" onclick="fpYearStep(this, -1)" aria-label="The year before">‹</button>' +
            '<button type="button" class="fp-btn" data-dir="1" onclick="fpYearStep(this, 1)" aria-label="The year after">›</button>' +
            '<button type="button" class="fp-x" onclick="fpYearClose(this)" title="Close" aria-label="Close">×</button></span></div>' +
        (need ? '<div class="fp-yd-spend' + (stale || '') + '">' + fpYearSpendText(need, r.t, false) + '</div>' : '') +
        '<div class="fp-yd-grid">' +
            '<div><table class="fp-yd-table"><caption>Money in and out</caption><tbody>' + flow + '</tbody></table>' + draws + '</div>' +
            '<div>' + accounts +
                (ev.length ? '<div class="fp-yd-block"><b>What happened</b><ul>' + ev.map(e => '<li>' + e + '</li>').join('') + '</ul></div>' : '') +
                '<div class="fp-yd-block"><b>Worked out with</b><ul>' + as.map(e => '<li>' + e + '</li>').join('') + '</ul></div></div>' +
        '</div></div>';
}

/** A year on the chart or in the table: open what made it up, or close it if open. */
function fpPickYear(el) {
    const widget = fpWidget(el);
    if (!widget) return;
    const t = Number(el.dataset.t);
    widget._yearT = widget._yearT === t ? null : t;
    fpRenderDerived(widget);
}

function fpYearKey(e, el) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    const widget = fpWidget(el);
    fpPickYear(el);
    const h = widget && widget.querySelector('.fp-yd h5');
    if (h) h.focus();
    else { const again = widget && widget.querySelector('.fp-chart .fp-hit[data-t="' + el.dataset.t + '"]'); if (again) again.focus(); }
}

/** The year before or after, among those shown. */
function fpYearStep(btn, dir) {
    const widget = fpWidget(btn);
    const ts = widget._shownT || [];
    const k = ts.indexOf(widget._yearT);
    if (k < 0 || k + dir < 0 || k + dir >= ts.length) return;
    widget._yearT = ts[k + dir];
    fpRenderDerived(widget);
    const again = widget.querySelector('.fp-yd-nav [data-dir="' + dir + '"]');
    if (again) again.focus();
}

function fpYearClose(btn) {
    const widget = fpWidget(btn);
    const t = widget._yearT;
    widget._yearT = null;
    fpRenderDerived(widget);
    const slice = widget.querySelector('.fp-chart .fp-hit[data-t="' + t + '"]');
    if (slice) slice.focus();
}

/** Net worth, assets and liabilities over the years, with the range as a band. */
function fpChart(proj, low, high, need, marks, pick, only) {
    const rows = proj.rows;
    if (rows.length < 2) return '';
    const ages = rows.some(r => r.age !== null && r.age !== undefined);
    // What happens when, in a strip of its own above the years: where it falls between the
    // years either side, and a row further down where it would sit on the one before.
    const W = 640, L = 52, R = 96, T = 10;
    const t0 = rows[0].t, t1 = rows[rows.length - 1].t;
    const lastX = [];
    const shown = (marks || []).filter(m => m.t - 1 >= t0 && m.t - 1 <= t1).sort((a, b) => a.t - b.t).map(m => {
        const mx = L + ((m.t - 1 - t0) / Math.max(1, t1 - t0)) * (W - L - R);
        let row = lastX.findIndex(v => mx - v >= FP_MARK_GAP);
        if (row < 0) row = lastX.length;
        lastX[row] = mx;
        return Object.assign({}, m, { x: mx, row: row });
    });
    const strip = lastX.length ? lastX.length * FP_MARK_ROW + 4 : 0;
    const H = (ages ? 210 : 200) + strip, B = (ages ? 32 : 22) + strip;
    // What would be needed to stop working, and the savings it is set against: savings
    // drawn as a line of their own only where they are not simply the assets (property).
    const nd = need ? rows.map(r => need.at[r.t] || null) : [];
    const showHave = nd.some((n, i) => n && Math.abs(n.have - rows[i].assets) > Math.max(1, Math.abs(rows[i].assets) * 0.01));
    // One line picked from its name: only that, on a scale of its own. One not on this
    // chart, or not worked out yet, is not held to.
    const solo = ['net', 'assets', 'liab'].concat(showHave ? ['have'] : [], need ? ['needed', 'forever'] : []).includes(only) ? only : null;
    const on = (k) => !solo || solo === k;
    const vals = [];
    rows.forEach((r, i) => {
        if (on('assets')) vals.push(r.assets);
        if (on('liab')) vals.push(-r.liabilities);
        if (on('net')) { vals.push(r.net); if (low) vals.push(low.rows[i].net, high.rows[i].net); }
    });
    nd.forEach(n => { if (n && showHave && on('have')) vals.push(n.have); });
    // Stopping early can need far more than the rest of the chart: drawn up to half
    // again its height, and clipped beyond.
    const others = Math.max(0, ...vals);
    const needMax = Math.max(0, ...nd.filter(n => n).map(n => Math.max(on('needed') && isFinite(n.needed) ? n.needed : 0, on('forever') && isFinite(n.forever) ? n.forever : 0)));
    if (needMax > 0) vals.push(Math.min(needMax, others > 0 ? others * 1.5 : needMax));
    let max = Math.max(0, ...vals), min = Math.min(0, ...vals);
    if (max === min) max = min + 1;
    const x = (i) => L + (i / (rows.length - 1)) * (W - L - R);
    const y = (v) => T + (max - v) / (max - min) * (H - T - B);
    const line = (get) => rows.map((r, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(get(r, i)).toFixed(1)).join(' ');
    const step = Math.max(1, Math.ceil((rows.length - 1) / 6));
    const ticks = rows.map((r, i) => i % step === 0 || i === rows.length - 1 ? '<text x="' + x(i).toFixed(1) + '" y="' + (H - (ages ? 17 : 6)) + '" text-anchor="middle">' + (r.t === 0 ? 'Now' : r.year) + '</text>' +
        (ages && r.age != null ? '<text class="fp-tick-age" x="' + x(i).toFixed(1) + '" y="' + (H - 5) + '" text-anchor="middle">' + r.age + '</text>' : '') : '').join('');
    // Each grid line labelled, unless its label would sit on one already there: $0 and the
    // top first, then the bottom (what is owed, often small beside the assets) and the
    // middle. A line that loses its label keeps its place on the scale.
    const gridVals = [max, (max + min) / 2, min, 0].filter((v, i, a) => a.indexOf(v) === i);
    const labelled = [];
    [0, max, min, (max + min) / 2].forEach(v => {
        if (gridVals.includes(v) && !labelled.includes(v) && labelled.every(u => Math.abs(y(u) - y(v)) >= 12)) labelled.push(v);
    });
    const grid = gridVals.map(v =>
        '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '" class="' + (v === 0 ? 'fp-zero' : 'fp-grid') + '"/>' +
        (labelled.includes(v) ? '<text x="' + (L - 6) + '" y="' + (y(v) + 3).toFixed(1) + '" text-anchor="end">' + fpMoney(v, true) + '</text>' : '')).join('');
    const band = low && on('net') ? '<path class="fp-band" d="' + rows.map((r, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(high.rows[i].net).toFixed(1)).join(' ') + ' ' +
        rows.slice().reverse().map((r, j) => { const i = rows.length - 1 - j; return 'L' + x(i).toFixed(1) + ' ' + y(low.rows[i].net).toFixed(1); }).join(' ') + ' Z"/>' : '';
    const end = rows[rows.length - 1];
    const seg = (get) => {
        let d = '', on = false;
        nd.forEach((n, i) => {
            const v = n ? get(n) : null;
            if (v === null || !isFinite(v)) { on = false; return; }
            d += (on ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1) + ' ';
            on = true;
        });
        return d.trim();
    };
    const lastNeed = nd.reduce((acc, n, i) => n && isFinite(n.needed) ? i : acc, -1);
    const clipId = 'fp-clip-' + Math.random().toString(36).slice(2, 8);
    const stopAt = need && need.earliest !== null ? rows.findIndex(r => r.t === need.earliest) : -1;
    const foreverI = need && need.foreverT !== null ? rows.findIndex(r => r.t === need.foreverT) : -1;
    const lastForever = nd.reduce((acc, n, i) => n && isFinite(n.forever) ? i : acc, -1);
    const needSvg = need ? '<clipPath id="' + clipId + '"><rect x="' + L + '" y="' + (T - 2) + '" width="' + (W - L - R) + '" height="' + (H - T - B + 2) + '"/></clipPath>' +
        (showHave && on('have') ? '<path class="fp-line fp-have" d="' + seg(n => n.have) + '"/>' : '') +
        (on('needed') ? '<path class="fp-line fp-needed' + (need.stale ? ' fp-stale' : '') + '" clip-path="url(#' + clipId + ')" d="' + seg(n => n.needed) + '"/>' : '') +
        (on('needed') && stopAt >= 0 && nd[stopAt] ? '<circle class="fp-stop-dot" cx="' + x(stopAt).toFixed(1) + '" cy="' + y(nd[stopAt].needed).toFixed(1) + '" r="5"><title>Could stop working ' +
            (rows[stopAt].t === 0 ? 'now' : 'in ' + rows[stopAt].year) + ', at ' + nd[stopAt].age + '</title></circle>' : '') +
        (on('forever') ? '<path class="fp-line fp-forever' + (need.stale ? ' fp-stale' : '') + '" clip-path="url(#' + clipId + ')" d="' + seg(n => n.forever) + '"/>' : '') +
        (on('forever') && foreverI >= 0 && nd[foreverI] && nd[foreverI].forever <= max ? '<circle class="fp-forever-dot" cx="' + x(foreverI).toFixed(1) + '" cy="' + y(nd[foreverI].forever).toFixed(1) + '" r="5"><title>Could live on savings forever ' +
            (rows[foreverI].t === 0 ? 'now' : 'from ' + rows[foreverI].year) + ', at ' + nd[foreverI].age + '</title></circle>' : '') : '';
    // Labels at the end of each line, pushed apart where lines end close together, and
    // one where two end on the same value (no debts left: assets are net worth).
    const ends = on('net') ? [{ v: end.net, cls: 'fp-net-label', line: 'net', text: 'Net worth' }] : [];
    // The needed line can stop a year short of the others (none for the plan's last year).
    if (on('needed') && lastNeed >= rows.length - 2 && nd[lastNeed].needed <= max) ends.push({ v: nd[lastNeed].needed, cls: 'fp-needed-label', line: 'needed', text: 'Needed to stop' });
    if (on('forever') && lastForever >= rows.length - 2 && nd[lastForever].forever <= max) ends.push({ v: nd[lastForever].forever, cls: 'fp-forever-label', line: 'forever', text: 'Lasts forever' });
    if (showHave && on('have') && lastNeed >= rows.length - 2) ends.push({ v: nd[lastNeed].have, cls: 'fp-have-label', line: 'have', text: 'Can draw on' });
    if (on('assets') && (solo || Math.abs(end.assets - end.net) > 0.5)) ends.push({ v: end.assets, cls: 'fp-assets-label', line: 'assets', text: 'Assets' });
    if (on('liab') && (solo || end.liabilities > 0)) ends.push({ v: -end.liabilities, cls: 'fp-liab-label', line: 'liab', text: 'Liabilities' });
    ends.forEach(e => { e.y = y(e.v) + 3; });
    ends.sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 12) ends[i].y = ends[i - 1].y + 12;
    const labels = ends.map(e => '<text class="' + e.cls + ' fp-line-name" data-line="' + e.line + '" tabindex="0" role="button" aria-pressed="' + (solo === e.line) + '" onclick="fpChartOnly(this)" onkeydown="fpChartOnlyKey(event, this)" x="' + (W - R + 6) + '" y="' + e.y.toFixed(1) + '"><title>' + (solo ? 'Show all lines' : 'Show only this line') + '</title>' + e.text + '</text>').join('');
    // A name in the key picks its line, as the name at the line's end does.
    const key = (k, cls, text) => '<button type="button" class="fp-legend-line' + (solo === k ? ' fp-legend-on' : solo ? ' fp-legend-off' : '') + '" data-line="' + k + '" aria-pressed="' + (solo === k) + '" title="' + (solo === k ? 'Show all lines' : 'Show only this line') + '" onclick="fpChartOnly(this)"><i class="' + cls + '"></i>' + text + '</button>';
    // A strip per year to hover, wider than the point it answers for.
    const hits = rows.map((r, i) => {
        const w = (W - L - R) / Math.max(1, rows.length - 1);
        return '<rect class="fp-hit' + (r.t === pick ? ' fp-hit-on' : '') + '" data-t="' + r.t + '" tabindex="0" role="button" aria-pressed="' + (r.t === pick) + '" onclick="fpPickYear(this)" onkeydown="fpYearKey(event, this)"' +
            ' x="' + (x(i) - w / 2).toFixed(1) + '" y="' + T + '" width="' + w.toFixed(1) + '" height="' + (H - T - B) + '"><title>' +
            (r.t === 0 ? 'Now' : r.year) + (r.age != null ? ', age ' + r.age : '') + ' — net worth ' + fpMoney(r.net) + (low ? ' (' + fpMoney(low.rows[i].net) + ' to ' + fpMoney(high.rows[i].net) + ')' : '') +
            ', assets ' + fpMoney(r.assets) + ', liabilities ' + fpMoney(r.liabilities) +
            (nd[i] ? ', can draw on ' + fpMoney(nd[i].have) + ', needed to stop working ' + (isFinite(nd[i].needed) ? fpMoney(nd[i].needed) : 'out of reach') + ', to last forever ' + (isFinite(nd[i].forever) ? fpMoney(nd[i].forever) : 'out of reach') : '') + (need ? ', ' + need.tip(r.t) : '') + '. Click for what made it up.</title></rect>';
    }).join('');
    // A mark opens the year it falls in, as that year's strip does.
    const markSvg = shown.map(m => {
        const year = rows.find(r => r.t >= m.t) || rows[rows.length - 1];
        const my = H - (ages ? 32 : 22) - strip + 4 + (m.row + 0.5) * FP_MARK_ROW;
        return '<g class="fp-mark fp-mark-' + m.kind + '" data-t="' + year.t + '" tabindex="0" role="button" aria-label="' + escapeHtml(m.text) + '" onclick="fpPickYear(this)" onkeydown="fpYearKey(event, this)"' +
            ' transform="translate(' + m.x.toFixed(1) + ' ' + my.toFixed(1) + ')"><title>' + escapeHtml(m.text) + '</title><rect class="fp-mark-hit" x="-7" y="-7" width="14" height="14" rx="3"/>' +
            '<path fill-rule="evenodd" d="' + FP_MARKS[m.kind].d + '"/></g>';
    }).join('');
    return '<svg class="fp-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Net worth, assets and liabilities, ' + (rows[0].t === 0 ? 'now' : rows[0].year) + ' to ' + rows[rows.length - 1].year + '">' +
        grid + ticks + band +
        (on('assets') ? '<path class="fp-line fp-assets" d="' + line(r => r.assets) + '"/>' : '') +
        (on('liab') ? '<path class="fp-line fp-liab" d="' + line(r => -r.liabilities) + '"/>' : '') +
        (on('net') ? '<path class="fp-line fp-net" d="' + line(r => r.net) + '"/>' : '') +
        needSvg + labels +
        hits + markSvg + '</svg>' +
        '<div class="fp-legend">' + (solo ? '<button type="button" class="fp-btn fp-legend-all" data-line="" onclick="fpChartOnly(this)">Show all lines</button>' : '') +
        key('net', 'fp-key-net', 'Net worth') + key('assets', 'fp-key-assets', 'Assets') + key('liab', 'fp-key-liab', 'Liabilities (below zero)') +
        (low && on('net') ? '<span><i class="fp-key-band"></i>Range of net worth</span>' : '') +
        (showHave ? key('have', 'fp-key-have', 'Savings to draw on (not property)') : '') +
        (need ? key('needed', 'fp-key-needed', 'Needed to stop working' + (stopAt >= 0 ? ' (● the first year it is reached)' : '')) + key('forever', 'fp-key-forever', 'Lasts forever' + (foreverI >= 0 ? ' (● the first year it is reached)' : '')) : '') +
        Object.keys(FP_MARKS).filter(k => shown.some(m => m.kind === k)).map(k => '<span><svg class="fp-key-mark fp-mark-' + k + '" viewBox="-7 -7 14 14" aria-hidden="true"><path d="' + FP_MARKS[k].d + '"/></svg>' + FP_MARKS[k].label + '</span>').join('') + '</div>';
}

// ---- What happens when, on the chart ----------------------------------------------------------

// Each a shape of its own, not only a colour, drawn about the middle of a 14-square box.
const FP_MARKS = {
    retire: { label: 'Retirement', d: 'M-3 6V-6H5L2.5-3 5 0H-1.5V6Z' },
    job: { label: 'Job change', d: 'M-6-2H6V5H-6ZM-2.5-2V-4.5H2.5V-2H1V-3H-1V-2Z' },
    paynew: { label: 'New pay', d: 'M0-5.5 6 4.5H-6Z' },
    payend: { label: 'Pay ends', d: 'M0 5.5-6-4.5H6Z' },
    ss: { label: 'Social Security starts', d: 'M0-5.5a5.5 5.5 0 1 0 .01 0Z' },
    medicare: { label: 'Medicare starts', d: 'M-2-6H2V-2H6V2H2V6H-2V2H-6V-2H-2Z' },
    debt: { label: 'Debt-free', d: 'M-6 0-3.5-2.5-1.5-.5 3.5-5.5 6-3-1.5 4.5Z' },
    target: { label: 'Net-worth goal reached', d: 'M0-6 1.8-1.9H6L2.6.8 3.8 5.2 0 2.6-3.8 5.2-2.6.8-6-1.9H-1.8Z' },
    rmd: { label: 'Minimum withdrawals start', d: 'M-2-6H2V0H5L0 6-5 0H-2Z' },
    penalty: { label: 'First early-withdrawal penalty', d: 'M0-6 6.5 5.5H-6.5ZM-.8-2V2H.8V-2ZM-.8 3V4.4H.8V3Z' },
    out: { label: 'Cash or savings run out', d: 'M-5-3-3-5 0-2 3-5 5-3 2 0 5 3 3 5 0 2-3 5-5 3-2 0Z' },
    goal: { label: 'A goal’s first payment', d: 'M0-6 5 0 0 6-5 0Z' }
};
const FP_MARK_GAP = 13, FP_MARK_ROW = 14;

/** The month of a projection a date in `YYYY-MM` falls in (1 is the first). */
function fpMonthOf(proj, ym) {
    const [y, m] = ym.split('-').map(Number);
    return (y - proj.start.getFullYear()) * 12 + m - 1 - proj.start.getMonth() + 1;
}

/**
 * Pay starting and stopping, from the dates on pay lines — a pension or rent is not pay, and
 * the planner knows nothing of jobs as such. One line ending and another starting within
 * three months of it is a job change; either alone is new pay, or pay ending. Pay that
 * runs out as retirement comes is the retirement.
 */
function fpPayChanges(plan, proj) {
    const pay = fpEntries(plan.incomes).filter(l => l.type !== 'ss' && l.wages !== false && fpNum(l.amount, 0) > 0);
    const name = (l) => l.name || 'Pay';
    const starts = pay.filter(l => l.from && fpMonthOf(proj, l.from) > 1).map(l => ({ l: l, t: fpMonthOf(proj, l.from) }));
    const out = [];
    pay.filter(l => l.to && fpMonthOf(proj, l.to) >= 1).forEach(l => {
        const t = fpMonthOf(proj, l.to) + 1;
        const next = starts.find(s => s.l !== l && !s.used && Math.abs(s.t - t) <= 3);
        if (next) { next.used = true; out.push({ kind: 'job', t: next.t, text: 'Job change: ' + name(l) + ' to ' + name(next.l) }); return; }
        if (proj.milestones.retire === null || Math.abs(proj.milestones.retire - t) > 3) out.push({ kind: 'payend', t: t, text: name(l) + ' ends' });
    });
    starts.filter(s => !s.used).forEach(s => out.push({ kind: 'paynew', t: s.t, text: name(s.l) + ' starts' }));
    return out;
}

/** What the chart marks, each `{ kind, t, text }`: `t` the month, and nothing already past. */
function fpChartMarks(plan, proj) {
    const ms = proj.milestones, out = [];
    const add = (kind, t, text, after) => { if (t !== null && t > 0) out.push({ kind: kind, t: t, text: text + ', ' + fpWhen(plan, fpMonthAt(proj.start, t)) + (after || '') }); };
    if (proj.retire) add('retire', ms.retire, 'Retirement');
    fpPayChanges(plan, proj).forEach(c => add(c.kind, c.t, c.text));
    fpEntries(plan.incomes).filter(l => l.type === 'ss').forEach(l => {
        const s = fpSSInfo(l);
        if (s) add('ss', fpMonthOf(proj, s.startYm), (l.name || 'Social Security') + ' starts');
    });
    add('medicare', ms.medicare, 'Medicare starts');
    add('debt', ms.debtFree, 'Debt-free');
    if (fpNum(plan.assume.target, 0) > 0) add('target', ms.target, fpMoney(plan.assume.target) + ' net worth');
    add('rmd', ms.rmd, 'Required minimum withdrawals start');
    const penalties = [ms.penalty, ms.rothEarly, ms.hsaPenalty].filter(t => t !== null);
    if (penalties.length) add('penalty', Math.min(...penalties), 'First early-withdrawal penalty');
    add('out', ms.cashOut, 'Cash runs out');
    if (ms.runsOut !== ms.cashOut) add('out', ms.runsOut, 'Savings run out');
    fpEntries(plan.goals).forEach(g => {
        const o = ms.goals[g.id];
        if (o) add('goal', o.first, g.name || 'A goal', ': ' + fpMoney(o.due));
    });
    return out;
}

/** The years Tax Brackets has, with this year's (or the latest) as the default — the
 *  same choice the Tax Calculator offers. */
function fpTaxYearOptions(plan) {
    if (typeof taxTableLoad !== 'function') return '<option value="">This year</option>';
    const table = taxTableLoad();
    const auto = taxDefaultYear(table);
    const chosen = plan.tax.year && table.years[plan.tax.year] ? plan.tax.year : '';
    return '<option value="">' + (auto === String(new Date().getFullYear()) ? 'This year' : 'Latest') + ' (' + auto + ')</option>' +
        taxYearsOf(table).map(y => '<option value="' + y + '"' + (y === chosen ? ' selected' : '') + '>' + y + '</option>').join('');
}

// ---- Putting things in order -------------------------------------------------------------
//
// Accounts, incomes and expenses each keep the order the person gives them: by bank, by
// size, whatever reads best. It is the plan's order, so it lasts and is undone like any
// edit — and "the first cash account", where what is left over goes unless told
// otherwise, is the first one in Accounts. A row moves only within its own list.

function fpGrip(name) {
    return '<button type="button" class="fp-grip" draggable="true" ondragstart="fpDragStart(event, this)" ondragend="fpDragEnd(this)"' +
        ' onkeydown="fpGripKey(event, this)" aria-label="Move ' + escapeHtml(String(name)) + ': ↑ or ↓" title="Drag to move, or ↑ and ↓">☰</button>';
}

/** A line's box: unticked, the plan goes on as if the line were not there, and it stays
 *  where it is, as it was, for when it is ticked again. */
function fpOnBox(x, label) {
    return '<input type="checkbox" class="fp-on"' + (x.off ? '' : ' checked') + ' onchange="fpToggleLine(this)" aria-label="Count ' + escapeHtml(x.name || label) + ' in the plan" title="Untick to leave this line out of the plan, without removing it">';
}

function fpToggleLine(box) {
    const widget = fpWidget(box), toolId = fpToolId(box), tr = box.closest('tr');
    const list = tr.dataset.list, id = tr.dataset.id;
    const plan = fpGet(toolId);
    const item = plan[list].find(x => x.id === id);
    if (!item) return;
    if (box.checked) delete item.off; else item.off = true;
    fpSet(toolId, plan);
    fpRender(widget);
    const again = widget.querySelector('tr[data-list="' + list + '"][data-id="' + CSS.escape(id) + '"] .fp-on');
    if (again) again.focus();
}

function fpMoveItem(widget, list, id, to) {
    const toolId = fpToolId(widget);
    const plan = fpGet(toolId);
    const items = plan[list];
    const from = items ? items.findIndex(a => a.id === id) : -1;
    if (from < 0) return;
    to = Math.max(0, Math.min(items.length - 1, to));
    if (to === from) return;
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);
    fpOpenAround(items, moved);
    fpSet(toolId, plan);
    fpRender(widget);
}

/** An entry moved under a folded section opens it: nothing lands out of sight. */
function fpOpenAround(items, moved) {
    if (fpIsSection(moved)) return;
    const at = items.indexOf(moved);
    for (let i = at - 1; i >= 0; i--) if (fpIsSection(items[i])) { items[i].folded = false; return; }
}

/** A section and what is in it, as one block, put before the section `beforeId` — or at
 *  the end, with none. A block only ever lands where a section begins, so it never takes
 *  in entries that were not its own. */
function fpMoveSection(widget, list, id, beforeId) {
    const toolId = fpToolId(widget);
    const plan = fpGet(toolId);
    const items = plan[list];
    const start = items.findIndex(x => x.id === id);
    if (start < 0 || !fpIsSection(items[start])) return;
    let end = start + 1;
    while (end < items.length && !fpIsSection(items[end])) end++;
    const block = items.splice(start, end - start);
    let at = beforeId ? items.findIndex(x => x.id === beforeId) : items.length;
    if (at < 0) at = items.length;
    items.splice(at, 0, ...block);
    fpSet(toolId, plan);
    fpRender(widget);
}

/** The sections of a list, by id, in order. */
function fpSectionIds(items) {
    return items.filter(fpIsSection).map(x => x.id);
}

function fpGripKey(e, btn) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const widget = fpWidget(btn), tr = btn.closest('tr');
    const list = tr.dataset.list, id = tr.dataset.id;
    const items = fpGet(fpToolId(widget))[list];
    if (tr.classList.contains('fp-sec-row')) {
        // A section steps past one whole section, up or down.
        const ids = fpSectionIds(items), k = ids.indexOf(id);
        if (e.key === 'ArrowUp' && k > 0) fpMoveSection(widget, list, id, ids[k - 1]);
        else if (e.key === 'ArrowDown' && k < ids.length - 1) fpMoveSection(widget, list, id, ids[k + 2] || null);
    } else {
        const step = e.key === 'ArrowUp' ? -1 : 1;
        let to = items.findIndex(a => a.id === id) + step;
        // The withdrawal order holds accounts turned off, out of sight: a step goes past them.
        while (list === 'drawOrder' && items[to] && !widget.querySelector('tr[data-list="drawOrder"][data-id="' + CSS.escape(items[to].id) + '"]')) to += step;
        fpMoveItem(widget, list, id, to);
    }
    const again = widget.querySelector('tr.fp-movable[data-list="' + list + '"][data-id="' + CSS.escape(id) + '"] .fp-grip');
    if (again) again.focus();
}

function fpDragStart(e, grip) {
    const tr = grip.closest('tr');
    const widget = fpWidget(grip);
    widget._drag = { id: tr.dataset.id, list: tr.dataset.list };
    tr.classList.add('fp-dragging');
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tr.dataset.id);
        e.dataTransfer.setDragImage(tr, 20, 14);
    }
}

/** Above or below the row the pointer is over, by which half of it the pointer is in —
 *  only a row of the same list. */
function fpDragOver(e, tr) {
    const widget = fpWidget(tr);
    const d = widget && widget._drag;
    if (!d || d.list !== tr.dataset.list || d.id === tr.dataset.id) return;
    e.preventDefault();
    const r = tr.getBoundingClientRect();
    const below = e.clientY > r.top + r.height / 2;
    tr.classList.toggle('fp-drop-above', !below);
    tr.classList.toggle('fp-drop-below', below);
}

function fpDragLeave(tr) {
    tr.classList.remove('fp-drop-above', 'fp-drop-below');
}

function fpDrop(e, tr) {
    const widget = fpWidget(tr);
    const d = widget && widget._drag;
    if (!d || d.list !== tr.dataset.list) return;
    e.preventDefault();
    const below = tr.classList.contains('fp-drop-below');
    fpDragLeave(tr);
    widget._drag = null;
    if (d.id === tr.dataset.id) return;
    const items = fpGet(fpToolId(widget))[d.list];
    if (items.some(x => x.id === d.id && fpIsSection(x))) {
        // A section goes before the section the row belongs to, or — dropped on the
        // lower half, or on one of its entries — after it.
        const groups = fpSectionsOf(items).filter(g => g.section && g.section.id !== d.id);
        const gi = groups.findIndex(g => g.section.id === tr.dataset.id || g.entries.some(x => x.id === tr.dataset.id));
        const onHead = gi >= 0 && groups[gi].section.id === tr.dataset.id;
        let before;
        if (gi < 0) before = groups.length ? groups[0].section.id : null;      // among the unsectioned: the first place a section can be
        else before = onHead && !below ? groups[gi].section.id : (groups[gi + 1] ? groups[gi + 1].section.id : null);
        fpMoveSection(widget, d.list, d.id, before);
        return;
    }
    const ids = items.map(a => a.id).filter(x => x !== d.id);
    fpMoveItem(widget, d.list, d.id, ids.indexOf(tr.dataset.id) + (below ? 1 : 0));
}

function fpDragEnd(grip) {
    const widget = fpWidget(grip);
    if (widget) {
        widget._drag = null;
        widget.querySelectorAll('.fp-dragging, .fp-drop-above, .fp-drop-below').forEach(el => el.classList.remove('fp-dragging', 'fp-drop-above', 'fp-drop-below'));
    }
}

// ---- Folding sections away ---------------------------------------------------------------

const FP_SECTIONS = ['summary', 'accounts', 'income', 'expenses', 'goals', 'retirement', 'month', 'advice', 'assumptions', 'ahead'];

function fpFoldedOf(widget) {
    const toolId = fpToolId(widget);
    const list = toolId && typeof toolCustomizations !== 'undefined' ? (toolCustomizations[toolId] || {}).fpFolded : null;
    return new Set(Array.isArray(list) ? list.filter(k => FP_SECTIONS.includes(k)) : []);
}

/** Kept with the tool, beside the plan rather than in it: a way of looking, so it is
 *  not one of the figures PRIVATE_SHARE_KEYS keeps back. */
function fpSaveFolded(widget, folded) {
    const toolId = fpToolId(widget);
    if (!toolId || typeof saveToolCustomizations !== 'function') return;
    const next = Object.assign({}, toolCustomizations);
    next[toolId] = Object.assign({}, next[toolId] || {});
    if (folded.size) next[toolId].fpFolded = FP_SECTIONS.filter(k => folded.has(k)); else delete next[toolId].fpFolded;
    saveToolCustomizations(next);
}

/**
 * The rows of the projection the chart and the year table show, as indexes `a` to `b`:
 * the calendar years kept with the tool (`fpChartYears`, a way of looking, like
 * `fpFolded`), clipped to the years the plan now runs, and never fewer than two.
 */
function fpChartSpan(widget, proj) {
    const toolId = fpToolId(widget);
    const kept = toolId && typeof toolCustomizations !== 'undefined' ? (toolCustomizations[toolId] || {}).fpChartYears : null;
    const rows = proj.rows, last = rows.length - 1;
    const at = (year, fallback) => { const i = rows.findIndex(r => r.year === year); return i < 0 ? fallback : i; };
    let a = 0, b = last;
    if (kept && typeof kept === 'object') {
        const from = Number(kept.from), to = Number(kept.to);
        a = isFinite(from) ? (from <= rows[0].year ? 0 : from > rows[last].year ? last : at(from, 0)) : 0;
        b = isFinite(to) ? (to >= rows[last].year ? last : to < rows[0].year ? 0 : at(to, last)) : last;
        if (a > b) { const s = a; a = b; b = s; }
        if (b - a < 1) { if (b < last) b++; else if (a > 0) a--; }
    }
    return { a: a, b: b, all: a === 0 && b === last };
}

/** A year picked above the chart, or All years: kept, and the chart and table redrawn. */
/** The one line the chart is showing, kept with the tool (`fpChartLine`), or null for all. */
function fpChartLine(widget) {
    const toolId = fpToolId(widget);
    return (toolId && typeof toolCustomizations !== 'undefined' ? (toolCustomizations[toolId] || {}).fpChartLine : null) || null;
}

/** A line's name clicked: only that line, or all of them again if it was the one showing. */
function fpChartOnly(el) {
    const widget = fpWidget(el), toolId = fpToolId(el);
    if (!widget || !toolId || typeof saveToolCustomizations !== 'function') return;
    const picked = el.dataset.line, chosen = picked && picked !== fpChartLine(widget) ? picked : null;
    const next = Object.assign({}, toolCustomizations);
    next[toolId] = Object.assign({}, next[toolId] || {});
    if (chosen) next[toolId].fpChartLine = chosen;
    else delete next[toolId].fpChartLine;
    saveToolCustomizations(next);
    fpRenderDerived(widget);
    const again = widget.querySelector('.fp-legend [data-line="' + (picked || 'net') + '"]');
    if (again) again.focus();
}

function fpChartOnlyKey(e, el) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    fpChartOnly(el);
}

function fpChartRange(el, all) {
    const widget = fpWidget(el), toolId = fpToolId(el);
    if (!widget || !toolId || typeof saveToolCustomizations !== 'function') return;
    const box = el.closest('.fp-range');
    let from = Number(box.querySelector('.fp-range-from').value), to = Number(box.querySelector('.fp-range-to').value);
    if (from > to) { const s = from; from = to; to = s; }
    const opts = box.querySelectorAll('.fp-range-from option');
    const first = Number(opts[0].value), last = Number(box.querySelector('.fp-range-to option:last-child').value);
    const next = Object.assign({}, toolCustomizations);
    next[toolId] = Object.assign({}, next[toolId] || {});
    if (all || (from <= first && to >= last)) delete next[toolId].fpChartYears;
    else next[toolId].fpChartYears = { from: from, to: to };
    saveToolCustomizations(next);
    const cls = all ? '.fp-range-from' : '.' + el.className.split(' ').find(c => c.indexOf('fp-range-') === 0);
    fpRenderDerived(widget);
    const again = widget.querySelector('.fp-range ' + cls);
    if (again) again.focus();
}

/** One section folded or opened in place — nothing redrawn, so nothing typed is lost. */
function fpFold(btn) {
    const widget = fpWidget(btn), section = btn.closest('.fp-section');
    const folded = fpFoldedOf(widget);
    const key = section.dataset.sec;
    if (folded.has(key)) folded.delete(key); else folded.add(key);
    fpSaveFolded(widget, folded);
    fpShowFolded(widget, folded);
}

/** Hide all, or — when all are hidden — show all. */
function fpFoldAll(btn) {
    const widget = fpWidget(btn);
    const folded = FP_SECTIONS.every(k => fpFoldedOf(widget).has(k)) ? new Set() : new Set(FP_SECTIONS);
    fpSaveFolded(widget, folded);
    fpShowFolded(widget, folded);
}

function fpShowFolded(widget, folded) {
    widget.querySelectorAll('.fp-section[data-sec]').forEach(s => {
        const on = folded.has(s.dataset.sec);
        s.classList.toggle('fp-folded', on);
        const b = s.querySelector('.fp-fold');
        b.setAttribute('aria-expanded', String(!on));
        b.textContent = on ? '▸' : '▾';
        b.title = (on ? 'Show ' : 'Hide ') + s.querySelector('h4').textContent.toLowerCase();
    });
    const all = widget.querySelector('.fp-fold-all');
    if (all) all.textContent = FP_SECTIONS.every(k => folded.has(k)) ? 'Show all' : 'Hide all';
}

// ---- Editing it --------------------------------------------------------------------------

function fpWidget(el) { return el && el.closest('.fp-widget'); }

function fpOnInput(el) {
    const widget = fpWidget(el), toolId = fpToolId(el);
    if (!widget || !toolId) return;
    const plan = fpGet(toolId);
    const val = el.type === 'checkbox' ? el.checked : el.value;
    const num = (v) => v === '' ? null : Number(v);
    const a = el.dataset.a;
    if (a) {
        if (a === 'return') plan.assume.returns[el.dataset.k] = num(val);
        else if (a === 'taxOn') plan.tax.on = val;
        else if (a === 'taxPayroll') plan.tax.payroll = val;
        else if (a === 'taxStatus') plan.tax.status = val;
        else if (a === 'taxYear') plan.tax.year = val;
        else if (a === 'surplusTo') plan.surplusTo = val;
        else if (a === 'real') plan.assume.real = val;
        else if (a === 'retireOn') plan.retire.on = val;
        else if (a === 'retire') plan.retire[el.dataset.k] = ['birth', 'from', 'health', 'avoidPenalty'].includes(el.dataset.k) ? val : num(val);
        else if (a === 'advice') plan.advice[el.dataset.k] = el.dataset.k === 'risk' ? val : num(val);
        else plan.assume[a] = num(val);
    } else {
        const tr = el.closest('tr');
        const list = plan[tr.dataset.list];
        const item = list && list.find(x => x.id === tr.dataset.id);
        if (!item) return;
        const f = el.dataset.f;
        if (f.indexOf('into.') === 0) {
            const rows = fpIntoRows(item).map(r => Object.assign({}, r));
            if (!rows.length) rows.push({ id: 'r1', account: '', amount: null, match: null });
            const r = rows.find(x => x.id === el.dataset.row);
            if (r) { const k = f.slice(5); r[k] = k === 'account' ? val : num(val); }
            fpSetInto(item, rows);
        } else if (f === 'payFrom') {
            // Which pay counts toward a Social Security estimate: every box in the row.
            item.payFrom = Array.from(el.closest('tr').querySelectorAll('[data-f="payFrom"]')).filter(x => x.checked).map(x => x.value);
        } else if (f.indexOf('loan.') === 0) {
            const k = f.slice(5);
            item.loan = Object.assign({}, item.loan || {});
            item.loan[k] = k === 'closing' ? val : num(val);
        } else if (f === 'kind' && /^retirement:/.test(val)) {
            const parts = val.split(':');
            item.kind = 'retirement'; item.planType = parts[1]; item.tax = parts[2];
        } else item[f] = ['balance', 'rate', 'monthly', 'amount', 'growth', 'deductions', 'taxes', 'intoAmount', 'match', 'fraBenefit', 'claimYears', 'claimMonths', 'basis', 'workFrom', 'pastPay', 'matchRate', 'matchCap', 'cost', 'years'].includes(f) ? num(val) : val;
    }
    fpSet(toolId, plan);
    // A new account for pay to go into: the details' warnings with it, drawn again.
    if (el.dataset.f === 'into.account') { fpRender(widget); return; }
    // A new kind changes what the row offers (its link, its placeholder): drawn again.
    // So does the tax year (the rules named), and federal tax on or off (payroll tax follows it).
    if (el.dataset.f === 'kind' || el.dataset.f === 'tax' || el.dataset.f === 'planType' || el.dataset.f === 'hsaCover' || el.dataset.k === 'from' || ['retireOn', 'taxYear', 'taxOn'].includes(el.dataset.a)) { fpRender(widget); return; }
    // Read back, so a Social Security estimate follows the pay or the birth month typed.
    fpRenderDerived(widget, fpGet(toolId));
}

function fpAdd(btn, list) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const plan = fpGet(toolId);
    const id = fpNewId(list.slice(0, 1));
    if (list === 'accounts') plan.accounts.push({ id: id, name: '', kind: fpEntries(plan.accounts).some(a => a.kind === 'cash') ? 'investment' : 'cash', balance: null, rate: null, monthly: null });
    else if (list === 'goals') plan.goals.push({ id: id, name: '', cost: null, every: 'total', years: 1, growth: null, from: '', account: '' });
    else plan[list].push({ id: id, name: '', amount: null, every: 'month', growth: null, from: '', to: '', taxed: list === 'incomes' });
    fpSet(toolId, plan);
    fpRender(widget);
    const added = widget.querySelector('tr[data-id="' + id + '"] [data-f="name"]');
    if (added) added.focus();
}

function fpAddSocialSecurity(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const plan = fpGet(toolId);
    const id = fpNewId('ss');
    plan.incomes.push({ id: id, type: 'ss', name: 'Social Security', birth: '', fraBenefit: null, claimYears: 67, claimMonths: 0, every: 'month', growth: null, to: '', taxed: true });
    fpSet(toolId, plan);
    widget._open = widget._open || new Set();
    widget._open.add(id);
    fpRender(widget);
    const birth = widget.querySelector('tr.fp-income-detail[data-id="' + id + '"] [data-f="birth"]');
    if (birth) birth.focus();
}

function fpAddSection(btn, list) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const plan = fpGet(toolId);
    const id = fpNewId('s');
    plan[list].push({ id: id, type: 'section', name: '', folded: false });
    fpSet(toolId, plan);
    fpRender(widget);
    const added = widget.querySelector('tr[data-id="' + id + '"] [data-f="name"]');
    if (added) added.focus();
}

function fpSectionFold(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const tr = btn.closest('tr');
    const plan = fpGet(toolId);
    const s = plan[tr.dataset.list].find(x => x.id === tr.dataset.id);
    if (!s) return;
    s.folded = !s.folded;
    fpSet(toolId, plan);
    fpRender(widget);
    const again = widget.querySelector('tr.fp-sec-row[data-id="' + CSS.escape(s.id) + '"] .fp-sec-fold');
    if (again) again.focus();
}

/** Another row of where a pay line's deductions go. */
function fpAddInto(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const tr = btn.closest('tr');
    const plan = fpGet(toolId);
    const line = plan.incomes.find(x => x.id === tr.dataset.id);
    if (!line) return;
    const rows = fpIntoRows(line).map(r => Object.assign({}, r));
    if (!rows.length) rows.push({ id: 'r1', account: '', amount: null, match: null });
    let n = rows.length + 1;
    while (rows.some(r => r.id === 'r' + n)) n++;
    rows.push({ id: 'r' + n, account: '', amount: null, match: null });
    fpSetInto(line, rows);
    fpSet(toolId, plan);
    fpRender(widget);
    const added = widget.querySelector('tr.fp-income-detail[data-id="' + CSS.escape(line.id) + '"] [data-f="into.amount"][data-row="r' + n + '"]');
    if (added) added.focus();
}

function fpRemoveInto(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const tr = btn.closest('tr'), id = btn.closest('.fp-into-row').dataset.row;
    const plan = fpGet(toolId);
    const line = plan.incomes.find(x => x.id === tr.dataset.id);
    if (!line) return;
    fpSetInto(line, fpIntoRows(line).filter(r => r.id !== id));
    fpSet(toolId, plan);
    fpRender(widget);
}

/** A line's rows, kept in the one form: the single account it once had goes. */
function fpSetInto(line, rows) {
    line.into = rows;
    delete line.intoAccount; delete line.intoAmount; delete line.match;
}

function fpRemove(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const tr = btn.closest('tr');
    const plan = fpGet(toolId);
    plan[tr.dataset.list] = plan[tr.dataset.list].filter(x => x.id !== tr.dataset.id);
    if (plan.surplusTo === tr.dataset.id) plan.surplusTo = '';
    plan.goals.forEach(g => { if (g.account === tr.dataset.id) g.account = ''; });
    plan.incomes.forEach(l => { if (fpIntoRows(l).some(r => r.account === tr.dataset.id)) fpSetInto(l, fpIntoRows(l).map(r => r.account === tr.dataset.id ? Object.assign({}, r, { account: '' }) : r)); });
    fpSet(toolId, plan);
    fpRender(widget);
}

/** What goes in beside what it comes to, as the note's panes are. They stay put and what is
 *  in them is drawn again, so a redraw keeps each pane's scroll and the divider's place. */
const FP_PANES = '<div class="fp-head"></div><div class="authoring-split"><div class="authoring-source"></div><div class="authoring-resizer"></div>' +
    '<div class="authoring-result" ondblclick="fpResultDblClick(event)"></div></div>';

function fpPanes(widget) {
    if (!widget.querySelector('.authoring-split')) widget.innerHTML = FP_PANES;
}

/** A double-click on the result goes to Edit, as a note's does; but the chart, the years
 *  and a year taken apart are clicked anyway, and a second click is not a request to leave. */
function fpResultDblClick(e) {
    if (e.target.closest('.fp-chart, .fp-year-row, .fp-yd, .fp-range')) e.stopPropagation();
}

function fpGoEdit(btn) {
    setToolMode(fpToolId(btn), 'edit');
}

function fpDupButton() {
    return '<button type="button" class="fp-dup" onclick="fpDuplicate(this)" title="Duplicate" aria-label="Duplicate this line"><svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">' +
        '<rect x="1" y="1" width="8.5" height="8.5" rx="1"/><path d="M12.5 4.5v8h-8"/></svg></button>';
}

/**
 * A line again, right under itself, with all it holds and ids of its own. What points at an
 * account goes on pointing at the original. A second Social Security line would leave
 * neither with the plan's pay, so the first keeps its pay by name and the copy starts with none.
 */
function fpDuplicate(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn), tr = btn.closest('tr');
    const list = tr.dataset.list;
    const plan = fpGet(toolId);
    const at = plan[list].findIndex(x => x.id === tr.dataset.id);
    if (at < 0) return;
    const item = plan[list][at];
    const copy = JSON.parse(JSON.stringify(item));
    copy.id = fpNewId(list.slice(0, 1));
    if (item.name) copy.name = item.name + ' copy';
    if (list === 'incomes' && item.type !== 'ss' && fpIntoRows(copy).length) fpSetInto(copy, fpIntoRows(copy).map(r => Object.assign({}, r, { id: fpNewId('r') })));
    if (item.type === 'ss') {
        const lines = fpAllEntries(plan.incomes);
        if (!Array.isArray(item.payFrom)) item.payFrom = lines.filter(l => l.type === 'ss').length === 1 ? lines.filter(l => l.type !== 'ss' && l.wages !== false).map(l => l.id) : [];
        copy.payFrom = [];
    }
    plan[list].splice(at + 1, 0, copy);
    const order = list === 'accounts' ? plan.drawOrder.findIndex(x => x.id === item.id) : -1;
    if (order >= 0) plan.drawOrder.splice(order + 1, 0, { id: copy.id });
    fpSet(toolId, plan);
    fpRender(widget);
    const name = widget.querySelector('tr[data-list="' + list + '"][data-id="' + CSS.escape(copy.id) + '"] [data-f="name"]');
    if (name) { name.focus(); name.select(); }
}

/** A made-up household, to see the tool working before typing anything in. */
function fpSample(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const plan = fpGet(toolId);
    const id = (p) => fpNewId(p);
    plan.accounts = [
        { id: id('a'), name: 'Checking', kind: 'cash', balance: 8000, rate: 0.5, monthly: null },
        { id: id('a'), name: 'Savings', kind: 'cash', balance: 15000, rate: 4, monthly: 200 },
        { id: id('a'), name: 'Brokerage', kind: 'investment', balance: 40000, rate: null, monthly: 300 },
        { id: id('a'), name: '401(k)', kind: 'retirement', balance: 85000, rate: null, monthly: 600 },
        { id: id('a'), name: 'Home', kind: 'property', balance: 350000, rate: null, monthly: null },
        { id: id('a'), name: 'Mortgage', kind: 'loan', balance: 250000, rate: 6.5, monthly: null, loan: { amount: 300000, years: 30, extra: 0, closing: '' } },
        { id: id('a'), name: 'Car loan', kind: 'loan', balance: 12000, rate: 7, monthly: 400 }
    ];
    plan.incomes = [{ id: id('i'), name: 'Salary', amount: 95000, every: 'year', growth: 3, from: '', to: '', taxed: true }];
    plan.expenses = [
        { id: id('e'), name: 'Living costs', amount: 2600, every: 'month', growth: null, from: '', to: '' },
        { id: id('e'), name: 'Insurance and property tax', amount: 6000, every: 'year', growth: null, from: '', to: '' }
    ];
    plan.surplusTo = plan.accounts[1].id;
    fpSet(toolId, plan);
    fpRender(widget);
}

/**
 * A link may open the planner on the made-up example — `#tool/finance-planning?example=1`,
 * as the guide's “Try it” does — with more added to it: a birth month, retirement and Social
 * Security, pay going into accounts with a match, a change of job, a Roth, an IRA, an HSA and a
 * 529, and big costs ahead, one of them paid early enough to be penalised. So every part of it has
 * something to show. Only a planner with nothing in it yet is filled: a link never overwrites
 * someone's plan.
 */
function fpApplyHashParams(toolId, params) {
    if (!params || !params.example) return;
    const widget = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"] .fp-widget');
    if (!widget || !fpToolId(widget)) { setTimeout(() => fpApplyHashParams(toolId, params), 200); return; }
    const plan = fpGet(toolId);
    if (plan.accounts.length || plan.incomes.length || plan.expenses.length) return;
    fpSample(widget);
    const p = fpGet(toolId);
    p.retire = Object.assign({}, p.retire, { on: true, from: 'job', birth: '1985-11', ageYears: 65, ageMonths: 0, until: 95, health: true, healthAfter: 250 });
    p.incomes.push({ id: fpNewId('ss'), type: 'ss', name: 'Social Security', birth: '1985-11', fraBenefit: null, claimYears: 67, claimMonths: 0, every: 'month', growth: null, to: '', taxed: true });
    const account = (name) => p.accounts.find(a => a.name === name);
    const roth = { id: fpNewId('a'), name: 'Roth IRA', kind: 'retirement', planType: 'ira', tax: 'roth', balance: 30000, basis: 18000, rate: null, monthly: 300 };
    const rollover = { id: fpNewId('a'), name: 'Rollover IRA', kind: 'retirement', planType: 'ira', tax: 'pretax', balance: 25000, rate: null, monthly: null };
    const hsa = { id: fpNewId('a'), name: 'HSA', kind: 'hsa', balance: 6000, hsaCover: 'self', rate: null, monthly: null };
    const college = { id: fpNewId('a'), name: 'College 529', kind: 'education', balance: 12000, rate: null, monthly: 250 };
    p.accounts.splice(p.accounts.indexOf(account('401(k)')) + 1, 0, roth, rollover, hsa, college);
    account('Brokerage').basis = 30000;
    account('401(k)').monthly = null;
    const into = (k401) => [{ id: fpNewId('r'), account: account('401(k)').id, amount: k401, match: null }, { id: fpNewId('r'), account: hsa.id, amount: 3000, match: null }];
    Object.assign(p.incomes[0], { amount: 130000, deductions: 10800, matchRate: 50, matchCap: 6, to: '2032-05', into: into(7800) });
    p.incomes.splice(1, 0, { id: fpNewId('i'), name: 'New job', amount: 145000, every: 'year', growth: 3, from: '2032-06', to: '2050-10', taxed: true, deductions: 11700, matchRate: 50, matchCap: 6, into: into(8700) });
    p.expenses.push({ id: fpNewId('e'), name: 'Childcare', amount: 900, every: 'month', growth: null, from: '', to: '2031-08' });
    p.goals = [
        { id: fpNewId('s'), type: 'section', name: 'Big costs', folded: false },
        { id: fpNewId('g'), name: 'Kid’s college', cost: 28000, every: 'year', years: 4, from: '2038-09', growth: 5, account: college.id },
        { id: fpNewId('g'), name: 'New car', cost: 35000, every: 'total', years: null, from: '2030-06', growth: null, account: '' },
        { id: fpNewId('g'), name: 'New roof', cost: 18000, every: 'total', years: null, from: '2033-04', growth: null, account: rollover.id }
    ];
    fpSet(toolId, p);
    fpRender(widget);
    setToolMode(toolId, 'render');
}

// ---- The calculators, for a moment ---------------------------------------------------------

/** A loan or investment account opened in its calculator, filled from the account;
 *  "Use these figures" puts what it came to back into the account. */
function fpOpenAccountTool(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const id = btn.closest('tr').dataset.id;
    const plan = fpGet(toolId);
    const a = plan.accounts.find(x => x.id === id);
    if (!a || typeof openToolPopup !== 'function') return;
    const kind = FP_KINDS[a.kind];
    const name = a.name || kind.label;
    if (kind.tool === 'loan-calculator') {
        const loan = a.loan || {};
        openToolPopup('loan-calculator', {
            title: 'Loan Calculator: ' + name,
            inputs: { amount: fpNum(loan.amount, fpBalanceOf(plan, a)), balance: fpNum(a.balance, null) === null ? '' : a.balance, rate: fpRateOf(plan, a),
                years: fpNum(loan.years, 30), extra: fpNum(loan.extra, 0), closing: loan.closing || '' },
            onUse: (fig) => {
                if (!fig) return false;
                const p = fpGet(toolId);
                const acc = p.accounts.find(x => x.id === id);
                if (!acc) return true;
                // Every field comes back: the payment is then worked out from them, as
                // it was in the calculator, and the extra stays an extra.
                acc.balance = fig.current > 0 ? fig.current : null;
                acc.rate = fig.rate;
                acc.monthly = null;
                // Escrow is the plan's own — the Loan Calculator has none — so it stays.
                acc.loan = Object.assign({}, acc.loan, { amount: fig.amount, years: fig.years, extra: fig.extra || 0, closing: fig.closing || '' });
                fpSet(toolId, p);
                fpRender(widget);
                return true;
            }
        });
    } else if (kind.tool === 'dynamic-investment-calculator') {
        openToolPopup('dynamic-investment-calculator', {
            title: 'Investment Calculator: ' + name,
            inputs: { initial: fpBalanceOf(plan, a), monthly: fpNum(a.monthly, 0) + fpPayrollMonthlyOf(plan, a), rate: fpRateOf(plan, a), years: fpNum(plan.assume.years, 30), compounding: a.compounding === 'annual' ? 'annual' : 'monthly' },
            onUse: (fig) => {
                if (!fig) return false;
                const p = fpGet(toolId);
                const acc = p.accounts.find(x => x.id === id);
                if (!acc) return true;
                acc.balance = fig.initial;
                // What the calculator was given from pay is the income line's; the
                // account keeps only the rest as its own.
                acc.monthly = Math.max(0, fig.monthly - fpPayrollMonthlyOf(p, acc));
                acc.rate = fig.rate;
                acc.compounding = fig.compounding;
                fpSet(toolId, p);
                fpRender(widget);
                return true;
            }
        });
    }
}

/** The plan's taxed income in the Tax Calculator; its filing status comes back. */
function fpOpenTax(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const plan = fpGet(toolId);
    const ym = fpYm(new Date());
    // Every taxed line, typed taxes or not: the calculator is there to check against,
    // and a typed tax is what most wants checking. (Only the plan's own estimate leaves
    // typed lines out, so as not to count their tax twice.)
    const lines = fpEntries(plan.incomes).filter(l => l.taxed !== false && fpActive(l, ym));
    const benefits = lines.filter(l => l.type === 'ss').reduce((s, l) => s + fpMonthly(l) * 12, 0);
    const other = lines.filter(l => l.type !== 'ss').reduce((s, l) => s + (fpMonthly(l) - fpPretaxPay(plan, l)) * 12, 0);
    const info = fpTaxInfo(Object.assign({}, plan, { tax: Object.assign({}, plan.tax, { on: true }) }));
    const annual = other + fpSSTaxable(info && info.ssTax, benefits, other);
    openToolPopup('dynamic-tax-calculator', {
        title: 'Tax Calculator: this year’s income',
        inputs: { income: Math.round(annual), status: plan.tax.status, year: plan.tax.year || '' },
        useLabel: 'Use this status and year',
        onUse: (fig) => {
            if (!fig) return false;
            const p = fpGet(toolId);
            p.tax.status = fig.status;
            p.tax.year = fig.yearChoice || '';
            p.tax.on = true;
            fpSet(toolId, p);
            fpRender(widget);
            return true;
        }
    });
}

/** The rollup and the projection, written out for a document or a message. */
function fpSummaryText(plan) {
    const roll = fpRollup(plan);
    const proj = fpProject(plan, 0);
    const out = ['## Finance plan', '', '*As of ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + '*', '',
        '| | |', '|---|---:|', '| Assets | ' + fpMoney(roll.assets) + ' |', '| Liabilities | ' + fpMoney(roll.liabilities) + ' |', '| **Net worth** | **' + fpMoney(roll.net) + '** |', ''];
    Object.keys(FP_KINDS).filter(k => roll.by[k]).forEach(k => out.push('- ' + FP_KINDS[k].label + ': ' + fpMoney(roll.by[k])));
    const named = [];
    [['accounts', 'Accounts'], ['incomes', 'Income'], ['expenses', 'Expenses'], ['goals', 'Goals']].forEach(([list, title]) => fpSectionsOf(plan[list]).forEach(g => {
        if (g.section) named.push('- ' + title + ' — ' + (g.section.name || 'Untitled section') + ': ' + fpSectionTotal(plan, list, g.entries).text);
    }));
    if (named.length) out.push('', '### Sections', '', ...named);
    if (fpOffNames(plan).length) out.push('', 'Left out for now: ' + fpOffNames(plan).join(', ') + '.');
    const f = proj.first;
    out.push('', '### A month, now', '', 'Income ' + fpMoney(f.income) + (f.deductions ? ', deductions ' + fpMoney(f.deductions) : '') +
        (plan.tax.on || f.tax ? ', taxes ' + fpMoney(f.tax) + (f.payrollTax ? ' (' + fpMoney(f.payrollTax) + ' of it payroll tax)' : '') : '') + ', take-home ' + fpMoney(f.takeHome) +
        (f.payrollOwn || f.payrollMatch ? ' (and ' + fpMoney(f.payrollOwn + f.payrollMatch) + ' from pay saved into accounts)' : '') +
        '; expenses ' + fpMoney(f.expenses) + ', loan payments ' + fpMoney(f.payments) + (f.escrow ? ', escrow ' + fpMoney(f.escrow) : '') + ', added to accounts ' + fpMoney(f.contributions) + ': ' + (f.surplus < 0 ? 'short ' : 'left over ') + fpMoney(Math.abs(f.surplus)) + '.');
    const ageCol = proj.rows.some(r => r.age != null);
    out.push('', '### Ahead' + (plan.assume.real ? ' (today’s money)' : ''), '', '| Year |' + (ageCol ? ' Age |' : '') + ' Assets | Liabilities | Net worth |', '|---|' + (ageCol ? '---:|' : '') + '---:|---:|---:|');
    proj.rows.filter((r, i) => i === 0 || (r.t / 12) % 5 === 0 || i === proj.rows.length - 1).forEach((r, i) =>
        out.push('| ' + (r.t === 0 ? 'Now' : r.year) + ' |' + (ageCol ? ' ' + (r.age == null ? '' : r.age) + ' |' : '') + ' ' + fpMoney(r.assets) + ' | ' + fpMoney(r.liabilities) + ' | ' + fpMoney(r.net) + ' |'));
    if (fpEntries(plan.goals).length) {
        const save = { value: fpGoalSaving(plan) };
        out.push('', '### Goals', '', ...fpEntries(plan.goals).map(g => '- ' + fpGoalText(plan, proj, g, save, false)));
    }
    if (proj.milestones.debtFree !== null) out.push('', 'Debt-free ' + fpWhen(plan, fpMonthAt(proj.start, proj.milestones.debtFree)) + '.');
    const need = fpNeededToStop(plan);
    if (need && need.rows) out.push('', fpNeededText(need, false) + ' (savings, not property; to last to ' + need.until + ').', '', fpForeverText(need, false) + ' (at the plan’s returns every year).', '', fpLastToText(need, false) + '.', '', fpTailText(need, false) + ' (' + fpTailParts(need.tail) + ').');
    out.push(...fpRetireLines(plan, proj).map((l, i) => (i ? '' : '\n### Retirement\n\n') + '- ' + l));
    out.push('', '*Assumes inflation ' + fpNum(plan.assume.inflation, 0) + '% and the rates in the plan; an estimate, not advice.*');
    return out.join('\n');
}

function fpCopySummary(btn) {
    const toolId = fpToolId(btn);
    const text = fpSummaryText(fpGet(toolId));
    if (typeof copyTextToClipboard === 'function') copyTextToClipboard(text, 'Summary copied');
    else if (navigator.clipboard) navigator.clipboard.writeText(text);
}

// ---- ✨: Chrome's own model, on a person's own figures ------------------------------------
//
// On-device only, so nothing here leaves the machine. The tool does every sum: the model
// reads the plan worked out — each line, the month, the totals, where it leads and a few
// facts drawn from them — and writes about it, drafts lines for the tool to add, or
// sorts expenses into sections. What it writes ends with the note that it is an
// estimate, not advice.

const FP_AI_SYSTEM = 'You help a person understand their own household finance plan. Be brief, plain and concrete. ' +
    'Use only the figures the plan gives and never work out new numbers. You are not a financial adviser and do not recommend ' +
    'products. Reply with the result only: no preface, no closing remarks.';
const FP_AI_NOTE = '*An estimate from the plan’s own figures and assumptions, not financial advice.*';
const FP_AI_MAX = 20;
const FP_AI_DRAFT_SCHEMA = { type: 'object', required: ['accounts', 'incomes', 'expenses'], properties: {
    accounts: { type: 'array', items: { type: 'object', required: ['name', 'kind', 'balance'], properties: {
        name: { type: 'string' }, kind: { type: 'string', enum: Object.keys(FP_KINDS) }, balance: { type: 'number' },
        rate: { type: 'number' }, monthly: { type: 'number' } } } },
    incomes: { type: 'array', items: { type: 'object', required: ['name', 'amount', 'every'], properties: {
        name: { type: 'string' }, amount: { type: 'number' }, every: { type: 'string', enum: ['month', 'year'] } } } },
    expenses: { type: 'array', items: { type: 'object', required: ['name', 'amount', 'every'], properties: {
        name: { type: 'string' }, amount: { type: 'number' }, every: { type: 'string', enum: ['month', 'year'] } } } } } };
const FP_AI_SECTIONS_SCHEMA = { type: 'object', required: ['sections'], properties: { sections: { type: 'array', items: { type: 'object',
    required: ['name', 'lines'], properties: { name: { type: 'string' }, lines: { type: 'array', items: { type: 'integer' } } } } } } };

/** Markdown-safe, for names typed by a person or drafted by the model. */
function fpAIEsc(s) {
    return String(s == null ? '' : s).replace(/([\\`*_[\]<>#|])/g, '\\$1');
}

function fpAIName(x, fallback) {
    return String((x && x.name) || '').replace(/\s+/g, ' ').trim() || fallback;
}

/** The facts the model is asked to comment on, worked out here. */
function fpAIFacts(plan, proj) {
    const f = proj.first, roll = fpRollup(plan);
    const spend = f.expenses + f.payments + f.escrow;
    const saved = f.contributions + f.payrollOwn + f.payrollMatch + Math.max(0, f.surplus);
    const out = [];
    if (spend > 0) out.push('Cash on hand covers ' + ((roll.by.cash || 0) / spend).toFixed(1) + ' months of spending (expenses, loan payments and escrow).');
    if (f.income > 0) {
        out.push('Saved each month, into accounts or left over: ' + fpMoney(saved) + ', which is ' + Math.round(saved / f.income * 100) + '% of gross income.');
        out.push('Debt payments with escrow take ' + Math.round((f.payments + f.escrow) / f.income * 100) + '% of gross income.');
    }
    const ms = proj.milestones;
    const penaltyPaid = ms.penalties.pretax + ms.penalties.roth + ms.penalties.hsa;
    if (penaltyPaid > 0.5) out.push('Early-withdrawal penalties come to ' + fpMoney(penaltyPaid) + ' as paid.');
    if (ms.drawnEarly !== null) out.push('Savings are drawn on before retirement, from ' + fpWhen(plan, fpMonthAt(proj.start, ms.drawnEarly)) + '.');
    if (ms.cashOut !== null) out.push('Cash runs out in ' + fpWhen(plan, fpMonthAt(proj.start, ms.cashOut)) + '.');
    ms.growing.forEach(id => { const a = plan.accounts.find(x => x.id === id); if (a) out.push(fpAIName(a, 'A loan') + ': the payment does not cover the interest, so it grows.'); });
    const said = {};
    fpEntries(plan.accounts).forEach(a => { const c = fpLimitCheck(plan, a); if (c && c.over && !said[c.key]) { said[c.key] = true; out.push(fpLimitText(c) + '.'); } });
    // Where the next dollar goes: the steps not yet done, and Roth or traditional.
    fpAdviceSteps(plan, proj, { value: fpGoalSaving(plan) }).forEach(s => {
        if (s.key === 'lean' && s.lean) out.push('Roth or traditional: ' + s.text.replace(/<[^>]+>/g, ''));
        else if ((s.status === 'todo' || s.status === 'part') && ['match', 'debt', 'fund', 'goals'].includes(s.key)) out.push(s.title + ': ' + s.text.replace(/<[^>]+>/g, ''));
    });
    const twice = {};
    fpEntries(plan.incomes).forEach(l => fpIntoOf(plan, l).forEach(r => {
        const t = r.account;
        if (t && fpNum(t.monthly, 0) > 0 && !twice[t.id]) { twice[t.id] = true; out.push(fpAIName(t, 'An account') + ' gets money from pay and has its own monthly amount too: possibly the same money twice.'); }
    }));
    return out;
}

/** The plan as the model reads it: every figure already worked out. */
function fpAITarget(toolId) {
    const plan = fpGet(toolId);
    const calc = fpCalc(plan);
    const empty = !calc.accounts.length && !calc.incomes.length && !calc.expenses.length;
    const proj = fpProject(plan, 0);
    const spread = Math.max(0, fpNum(plan.assume.spread, 0));
    const market = calc.accounts.some(a => FP_MARKET.includes(a.kind));
    const low = spread && market ? fpProject(plan, -spread) : null, high = spread && market ? fpProject(plan, spread) : null;
    const lines = [];
    const sectionOf = (list) => { const at = {}; fpSectionsOf(plan[list]).forEach(g => g.entries.forEach(x => { at[x.id] = g.section ? fpAIName(g.section, 'Untitled') : ''; })); return at; };
    const accSec = sectionOf('accounts'), incSec = sectionOf('incomes'), expSec = sectionOf('expenses');
    const inSec = (map, x) => map[x.id] ? ' [section: ' + map[x.id] + ']' : '';
    lines.push('Finance plan as of ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + '. Amounts in dollars.');
    if (fpOffNames(plan).length) lines.push('Left out for now, and not in anything below: ' + fpOffNames(plan).map(n => fpAIName({ name: n }, 'Unnamed')).join(', ') + '.');
    lines.push('', 'Accounts:');
    if (!calc.accounts.length) lines.push('- none');
    calc.accounts.forEach(a => {
        const k = FP_KINDS[a.kind] || FP_KINDS.other;
        const t = fpLoanTerms(plan, a), esc = fpEscrowOf(a);
        lines.push('- ' + fpAIName(a, fpKindLabel(a)) + ' (' + fpKindLabel(a) + ')' + inSec(accSec, a) + ': ' + (k.side === 'liability' ? 'owes ' : 'balance ') + fpMoney(fpBalanceOf(plan, a)) +
            ', ' + fpRateOf(plan, a) + '% a year' + (fpMonthlyOf(plan, a) ? ', ' + (k.side === 'liability' ? 'pays ' : 'adds ') + fpCents(fpMonthlyOf(plan, a)) + ' a month' : '') +
            (esc ? ', plus ' + fpMoney(esc) + ' escrow a month' : '') + (t ? ', original loan ' + fpMoney(t.amount) + ' over ' + t.years + ' years' : '') +
            (a.compounding === 'annual' ? ', compounded yearly' : ''));
    });
    lines.push('', 'Income (a month now):');
    if (!calc.incomes.length) lines.push('- none');
    calc.incomes.forEach(l => {
        const ym = fpYm(new Date());
        const bits = [];
        if (l.type === 'ss') {
            const s = fpSSInfo(l);
            bits.push(s ? 'Social Security, ' + fpCents(s.monthlyToday) + ' a month in today’s dollars from ' + fpMonthText(s.start, 1) + ', at ' + fpAgeText(s.claim) : 'Social Security, details not filled in');
        } else bits.push(fpMoney(fpMonthly(l)) + ' gross' + (fpActive(l, ym) ? '' : ' (not running now)'));
        if (fpPerMonth(l, 'deductions')) bits.push('deductions ' + fpMoney(fpPerMonth(l, 'deductions')));
        bits.push(fpHasTypedTax(l) ? 'taxes ' + fpMoney(fpPerMonth(l, 'taxes')) : (l.taxed === false ? 'not taxed' : 'tax estimated'));
        fpIntoOf(plan, l).filter(r => r.account).forEach(r => bits.push(fpMoney(r.own) + ' of it into ' + fpAIName(r.account, 'an account') + ' (' + fpKindLabel(r.account) + ')' + (r.match ? ', employer adds ' + fpMoney(r.match) : '')));
        bits.push('grows ' + fpNum(l.growth, fpNum(plan.assume.inflation, 0)) + '% a year');
        if (l.from) bits.push('from ' + l.from);
        if (l.to) bits.push('until ' + l.to);
        lines.push('- ' + fpAIName(l, 'Income') + inSec(incSec, l) + ': ' + bits.join(', '));
    });
    if (calc.goals.length) {
        lines.push('', 'Goals (big costs ahead, paid when they fall, retired or not):');
        const save = { value: fpGoalSaving(plan) };
        calc.goals.forEach(g => lines.push('- ' + fpGoalText(plan, proj, Object.assign({}, g, { name: fpAIName(g, 'A goal') }), save, false)));
    }
    lines.push('', 'Expenses (a month now):');
    if (!calc.expenses.length) lines.push('- none');
    calc.expenses.forEach(l => lines.push('- ' + fpAIName(l, 'Expense') + inSec(expSec, l) + ': ' + fpMoney(fpMonthly(l)) + ', grows ' + fpNum(l.growth, fpNum(plan.assume.inflation, 0)) + '% a year' +
        (l.from ? ', from ' + l.from : '') + (l.to ? ', until ' + l.to : '')));
    const f = proj.first, roll = fpRollup(plan);
    lines.push('', 'A month now: income ' + fpMoney(f.income) + ', deductions ' + fpMoney(f.deductions) + ', taxes ' + fpMoney(f.tax) + ', take-home ' + fpMoney(f.takeHome) +
        ', expenses ' + fpMoney(f.expenses) + ', loan payments ' + fpMoney(f.payments) + (f.escrow ? ', escrow ' + fpMoney(f.escrow) : '') +
        ', added to accounts ' + fpMoney(f.contributions) + (f.payrollOwn + f.payrollMatch ? ', saved from pay ' + fpMoney(f.payrollOwn + f.payrollMatch) : '') +
        '; ' + (f.surplus < 0 ? 'short ' : 'left over ') + fpMoney(Math.abs(f.surplus)) + '.');
    lines.push('Today: assets ' + fpMoney(roll.assets) + ', liabilities ' + fpMoney(roll.liabilities) + ', net worth ' + fpMoney(roll.net) + '.');
    const at = (y) => proj.rows[Math.min(y, proj.rows.length - 1)];
    const yrs = proj.rows.length - 1;
    const ahead = [5, 10, yrs].filter((y, i, a) => y <= yrs && a.indexOf(y) === i).map(y => 'in ' + at(y).year + ' ' + fpMoney(at(y).net) +
        (low ? ' (' + fpMoney(low.rows[y].net) + ' to ' + fpMoney(high.rows[y].net) + ')' : ''));
    lines.push('Ahead, ' + (plan.assume.real ? 'in today’s money' : 'in future dollars') + ', net worth: ' + ahead.join('; ') + '.');
    const ms = proj.milestones;
    if (ms.debtFree !== null) lines.push('Debt-free: ' + fpWhen(plan, fpMonthAt(proj.start, ms.debtFree)) + '.');
    else if (roll.liabilities > 0) lines.push('Still owing after ' + yrs + ' years.');
    if (fpNum(plan.assume.target, 0) > 0) lines.push('Goal of ' + fpMoney(plan.assume.target) + ' net worth: ' + (ms.target === 0 ? 'already passed' : ms.target !== null ? 'reached ' + fpWhen(plan, fpMonthAt(proj.start, ms.target)) : 'not reached') + '.');
    lines.push('Assumptions: inflation ' + fpNum(plan.assume.inflation, 0) + '%' + (low ? ', investment returns ±' + spread + '% for the range' : '') + '.');
    const retLines = fpRetireLines(plan, proj);
    const need = fpNeededToStop(plan);
    if (need && need.rows) retLines.push(fpNeededText(need, false) + ' — the first year the savings that can be drawn on (not property) reach what would be needed to stop working then and last to ' + need.until + '.', fpForeverText(need, false) + ' — never running out, at the plan’s returns every year.', fpLastToText(need, false) + '.', fpTailText(need, false) + ' (' + fpTailParts(need.tail) + ').');
    if (retLines.length) lines.push('', 'Retirement:', ...retLines.map(x => '- ' + x));
    const facts = fpAIFacts(plan, proj);
    if (facts.length) lines.push('', 'Facts worked out from the plan:', ...facts.map(x => '- ' + x));
    // The expenses, numbered, for sorting them into sections.
    const numbered = calc.expenses.map((l, i) => (i + 1) + '. ' + fpAIName(l, 'Expense') + ': ' + fpMoney(fpMonthly(l)) + ' a month').join('\n');
    return {
        scope: 'whole', kind: 'plan', toolId: toolId,
        text: empty ? '' : lines.join('\n'),
        expenses: numbered, expenseCount: calc.expenses.length,
        label: 'On this plan (' + calc.accounts.length + ' accounts, ' + calc.incomes.length + ' incomes, ' + calc.expenses.length + ' expenses)',
        emptyLabel: 'Nothing in the plan yet: draft it from a description.'
    };
}

/** The draft as the plan can take it: names kept short, amounts numbers or nothing,
 *  kinds the tool knows. */
function fpAICleanDraft(json) {
    const name = (s) => String(s == null ? '' : s).replace(/^\s*(?:[-*+]\s*)?/, '').replace(/\s+/g, ' ').trim().slice(0, 80);
    const amt = (v) => { const n = Number(v); return isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null; };
    const every = (v) => v === 'year' ? 'year' : 'month';
    const list = (k) => (json && Array.isArray(json[k]) ? json[k] : []).filter(x => x && name(x.name)).slice(0, FP_AI_MAX);
    const out = {
        accounts: list('accounts').map(a => ({ name: name(a.name), kind: FP_KINDS[a.kind] ? a.kind : 'other', balance: amt(a.balance), rate: amt(a.rate), monthly: amt(a.monthly) })),
        incomes: list('incomes').filter(l => amt(l.amount)).map(l => ({ name: name(l.name), amount: amt(l.amount), every: every(l.every) })),
        expenses: list('expenses').filter(l => amt(l.amount)).map(l => ({ name: name(l.name), amount: amt(l.amount), every: every(l.every) }))
    };
    if (!out.accounts.length && !out.incomes.length && !out.expenses.length) throw new Error('Nothing usable came back. Try saying a little more, with amounts.');
    return out;
}

function fpAIDraftPreview(d) {
    const per = (l) => fpMoney(l.amount) + (l.every === 'year' ? ' / year' : ' / month');
    const parts = [];
    if (d.accounts.length) parts.push('**Accounts**\n\n| Name | Kind | Balance / owed | Rate | Monthly |\n| --- | --- | --- | --- | --- |\n' +
        d.accounts.map(a => '| ' + fpAIEsc(a.name) + ' | ' + FP_KINDS[a.kind].label + ' | ' + (a.balance == null ? '' : fpMoney(a.balance)) + ' | ' +
            (a.rate == null ? 'default' : a.rate + '%') + ' | ' + (a.monthly == null ? '' : fpMoney(a.monthly)) + ' |').join('\n'));
    if (d.incomes.length) parts.push('**Income**\n\n' + d.incomes.map(l => '- ' + fpAIEsc(l.name) + ': ' + per(l)).join('\n'));
    if (d.expenses.length) parts.push('**Expenses**\n\n' + d.expenses.map(l => '- ' + fpAIEsc(l.name) + ': ' + per(l)).join('\n'));
    return parts.join('\n\n') + '\n\nThe plan works out the rest — tax, the month, where it leads — from these.';
}

/** Sections as the plan can take them: each expense named by its number once, at most;
 *  numbers that are not lines dropped. Lines left out stay where they are, above. */
function fpAICleanSections(json, count) {
    const used = new Set();
    const sections = (json && Array.isArray(json.sections) ? json.sections : []).map(s => ({
        name: String((s && s.name) || '').replace(/\s+/g, ' ').trim().slice(0, 60),
        lines: (s && Array.isArray(s.lines) ? s.lines : []).map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= count && !used.has(n) && used.add(n))
    })).filter(s => s.name && s.lines.length).slice(0, 12);
    if (!sections.length) throw new Error('No sections came back that name the expenses. Try again.');
    return sections;
}

function fpAISectionsPreview(sections, plan) {
    const exp = fpEntries(plan.expenses);
    const placed = new Set();
    const body = sections.map(s => {
        const items = s.lines.map(n => exp[n - 1]);
        items.forEach(l => placed.add(l.id));
        const total = items.reduce((t, l) => t + fpMonthly(l), 0);
        return '**' + fpAIEsc(s.name) + '** — ' + fpMoney(total) + ' / mo\n' + items.map(l => '- ' + fpAIEsc(fpAIName(l, 'Expense'))).join('\n');
    }).join('\n\n');
    const rest = exp.filter(l => !placed.has(l.id));
    return body + (rest.length ? '\n\n*Left where they are, above the sections:* ' + rest.map(l => fpAIEsc(fpAIName(l, 'Expense'))).join(', ') : '') +
        '\n\nApplying it puts these headings in Expenses in place of any there now; every expense stays.';
}

/** Drafted lines into the plan — added, or in place of what is there — or the expenses
 *  put under sections, through the ordinary save, so Undo takes it back. */
function fpAIApply(toolId, result, how, target, info) {
    if (!info || !info.data) return false;
    const plan = fpGet(toolId);
    if (info.action === 'draft') {
        const d = info.data;
        const made = {
            accounts: d.accounts.map(a => ({ id: fpNewId('a'), name: a.name, kind: a.kind, balance: a.balance, rate: a.rate, monthly: a.monthly })),
            incomes: d.incomes.map(l => ({ id: fpNewId('i'), name: l.name, amount: l.amount, every: l.every, growth: null, from: '', to: '', taxed: true })),
            expenses: d.expenses.map(l => ({ id: fpNewId('e'), name: l.name, amount: l.amount, every: l.every, growth: null, from: '', to: '' }))
        };
        ['accounts', 'incomes', 'expenses'].forEach(k => { plan[k] = how === 'replace' ? made[k] : plan[k].concat(made[k]); });
        if (how === 'replace') plan.surplusTo = '';
    } else if (info.action === 'sections') {
        const exp = fpEntries(plan.expenses);
        if (info.data.some(s => s.lines.some(n => !exp[n - 1]))) return false;
        const placed = new Set();
        info.data.forEach(s => s.lines.forEach(n => placed.add(exp[n - 1].id)));
        const out = exp.filter(l => !placed.has(l.id));
        info.data.forEach(s => {
            out.push({ id: fpNewId('s'), type: 'section', name: s.name, folded: false });
            s.lines.forEach(n => out.push(exp[n - 1]));
        });
        plan.expenses = out;
    } else return false;
    fpSet(toolId, plan);
    const widget = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"] .fp-widget');
    if (widget) fpRender(widget);
    return true;
}

/** Every prose answer ends with what it is. */
function fpAIFinish(result) {
    const text = String(result).replace(/\s+$/, '');
    return text.includes('not financial advice') ? text : text + '\n\n' + FP_AI_NOTE;
}

// Inject JavaScript functions into DOM for HTML export using base64 encoding
// The injected script only defines things if they don't already exist (for exported HTML)
(function injectScriptsForExport() {
    if (document.getElementById('finance-tools-scripts')) return;

    const functionsToExport = [fpResultDblClick, fpGoEdit, fpDuplicate, fpToggleLine, fpOffNames, fpLiveLine, fpRetireByJob, fpLastJob, fpRetireLines, fpRetireFields, fpRenderRetire, fpTaxInfo, fpSSTaxable, fpFederalTax, fpPayrollTax, fpPretaxPay, fpBasisOf, fpBirthYear, fpBirthOf, fpAgeAt, fpWhen, fpMonthAt, fpRefreshAgeHints, fpLimitCheck, fpLimitText, fpTaxWith, fpRmdAge, fpRmdFactor, fpRetKey, fpKindLabel, fpIsPretax, fpRetireInfo, fpRetireSpending, fpDrawOrder, fpRetireMax, fpHealthOf, fpPayGap, fpAdviceFields, fpMarginal, fpAdviceSteps, fpAdviceSplit, fpAdviceMix, fpAdviceHtml, fpUseMixReturn, fpResetDrawOrder, fpLimitGroup, fpGroupLimit, fpGroupOwn, fpMatchOf, fpNeededToStop, fpNeededSteps, fpLaterKey, fpProgressHtml, fpShowProgress, fpChartLine, fpChartOnly, fpChartOnlyKey, fpNeededFor, fpNeededText, fpForeverText, fpSetText, fpLastToText, fpYearSpendText, fpTailParts, fpTailText, fpAIEsc, fpAIName, fpAIFacts, fpAITarget, fpAICleanDraft, fpAIDraftPreview, fpAICleanSections, fpAISectionsPreview, fpAIApply, fpAIFinish, fpFullRetirementMonths, fpClaimFactor, fpSSEstimate, fpSSPayOf, fpWithEstimates, fpSSEstimateFields, fpSSInfo, fpAgeText, fpAddSocialSecurity, fpPayrollTarget, fpIntoRows, fpIntoOf, fpAddInto, fpRemoveInto, fpSetInto, fpPayrollNow, fpPayrollMonthlyOf, fpIncomeDetailsRow, fpIncomeDetailSummary, fpRefreshIncomeDetails, fpEscrowOf, fpPerMonth, fpHasTypedTax, fpIsSection, fpEntries, fpCalc, fpSectionsOf, fpSectionTotal, fpRefreshSections, fpAddSection, fpSectionFold, fpOpenAround, fpMoveSection, fpSectionIds, fpGrip, fpMoveItem, fpGripKey, fpDragStart, fpDragOver, fpDragLeave, fpDrop, fpDragEnd, fpFoldedOf, fpSaveFolded, fpChartSpan, fpChartRange, fpFold, fpFoldAll, fpShowFolded, fpCents, fpClosing, fpLoanTerms, fpBalanceOf, fpMonthlyOf, fpDetailsRow, fpRefreshAccounts, fpDetailSummary, fpToggleDetails, fpTaxYearOptions, fpDefaultPlan, fpNum, fpNewId, fpToolId, fpGet, fpSet, fpRateOf, fpMonthly, fpActive, fpSurplusAccount, fpIncomeTax, fpYm, fpProject, fpRollup, fpMoney, fpMonthText, fpInit, fpRender, fpRenderDerived, fpChart, fpWidget, fpOnInput, fpAdd, fpRemove, fpSample, fpApplyHashParams, fpOpenAccountTool, fpOpenTax, fpSummaryText, fpCopySummary,
        taxRulesBuiltin, taxMergeShape, taxRuleNum, taxRulesOf, taxRulesFor, fpAgeShort, taxBuiltin, taxClone, taxTableLoad, taxTableSave, taxTableChanged, taxYearsOf, taxDefaultYear, taxProblems, taxBracketsFor,
        tbToolId, tbYearOf, tbMoney, tbInit, tbRender, tbRefreshDerived, tbReadStatus, tbStore, tbOnInput, tbAddBracket, tbRemoveBracket,
        tbSetYear, tbPickYear, tbAddYear, tbDeleteYear, tbResetYear, tbTabOf, tbPickTab, tbShow, tbGetPath, tbSetPath, tbField, tbRows, tbPanel, taxRuleProblems,
        tbFieldInput, tbRowsRead, tbRowsStore, tbRowsInput, tbRowsAdd, tbRowsRemove, taxOpenBrackets, calcEach, calcPopupFill, calcPopupRead, loanPopupFill, growthPopupFill, taxPopupFill, calcField, calcSync, calcReset, calculateTax, calculateTaxIn, calculateLoan, calculateLoanIn, loanMoney, loanSpan, loanClosingOf, loanMonth, loanMonthText, loanPaymentsMade, loanScheduled, loanScheduleText, loanPayDown, loanFromBalance, calculateGrowth, calculateGrowthIn];
    // Wrap in IIFE that checks if already defined (plugin loaded) vs needs defining (exported HTML)
    const code = '(function() {\n' +
        'if (typeof calculateTax !== "undefined") return;\n' +
        'window.taxBrackets = ' + JSON.stringify(taxBrackets) + ';\n' +
        'window.CALC_FIELDS = ' + JSON.stringify(CALC_FIELDS) + ';\n' +
        'window.CALC_POPUP_FIELDS = ' + JSON.stringify(CALC_POPUP_FIELDS) + ';\n' +
        'window.FP_KINDS = ' + JSON.stringify(FP_KINDS) + ';\n' +
        'window.FP_MARKET = ' + JSON.stringify(FP_MARKET) + ';\n' +
        'window.FP_SECTIONS = ' + JSON.stringify(FP_SECTIONS) + ';\n' +
        'window.FP_AI_NOTE = ' + JSON.stringify(FP_AI_NOTE) + ';\n' +
        'window.FP_RMD_FACTORS = ' + JSON.stringify(FP_RMD_FACTORS) + ';\n' +
        'window.FP_RET_TYPES = ' + JSON.stringify(FP_RET_TYPES) + ';\n' +
        'window.FP_RISK = ' + JSON.stringify(FP_RISK) + ';\n' +
        'window.FP_GROUP_NAMES = ' + JSON.stringify(FP_GROUP_NAMES) + ';\n' +
        'window.TAX_TABLE_KEY = ' + JSON.stringify(TAX_TABLE_KEY) + ';\n' +
        'window.TAX_RULE_PARTS = ' + JSON.stringify(TAX_RULE_PARTS) + ';\n' +
        'window.TB_TABS = ' + JSON.stringify(TB_TABS) + ';\n' +
        'window.taxRulesCache = null;\n' +
        'window.TAX_STATUSES = ' + JSON.stringify(TAX_STATUSES) + ';\n' +
        'window.stdDeductions = ' + JSON.stringify(stdDeductions) + ';\n' +
        functionsToExport.map(function(fn) { return 'window.' + fn.name + ' = ' + fn.toString(); }).join(';\n') + ';\n' +
        '})();';
    const encoded = btoa(unescape(encodeURIComponent(code)));

    const script = document.createElement('script');
    script.id = 'finance-tools-scripts';
    script.textContent = 'eval(decodeURIComponent(escape(atob("' + encoded + '"))))';
    (document.body || document.head).appendChild(script);
})();

// Register the Finance toolbox
PluginRegistry.registerToolbox({
    id: 'finance',
    name: 'Finance',
    description: 'Financial calculators and tools',
    icon: '💰',
    color: '#27ae60',
    version: '1.0.0',
    tools: ['finance-planning', 'dynamic-investment-calculator', 'dynamic-tax-calculator', 'tax-brackets', 'loan-calculator'],
    source: 'external'
});

// Investment Growth Calculator
PluginRegistry.registerTool({
    id: 'dynamic-investment-calculator',
    name: 'Investment Growth Calculator',
    description: 'Interactive calculator with inputs for initial amount, monthly contribution, rate, and years',
    icon: '📈',
    version: '1.0.0',
    toolbox: 'finance',
    tags: ['investment', 'growth', 'compound', 'savings', 'retirement'],
    title: 'Investment Calculator',
    content: '<form class="calc-widget" data-calc="growth" onsubmit="return false"><button type="button" class="calc-reset" hidden onclick="calcReset(this, \'growth\')" title="Put every field back to its default">Reset</button><div class="calc-grid"><div><label>Initial Investment</label><input type="number" id="growthInitial" value="10000" oninput="calculateGrowth(this)"></div><div><label>Monthly Contribution</label><input type="number" id="growthMonthly" value="500" oninput="calculateGrowth(this)"></div><div><label>Annual Return %</label><input type="number" id="growthRate" value="7" step="0.1" oninput="calculateGrowth(this)"></div><div><label>Years</label><input type="number" id="growthYears" value="30" oninput="calculateGrowth(this)"></div></div><div style="margin-bottom:15px;"><label>Compounding</label><div class="calc-toggle"><label><input type="radio" name="growthCompound" value="monthly" checked onchange="calculateGrowth(this)"><span>Monthly</span></label><label><input type="radio" name="growthCompound" value="annual" onchange="calculateGrowth(this)"><span>Annual</span></label></div></div><div id="growthResults"></div></form>',
    onInit: 'calculateGrowth',
    popup: { fill: 'growthPopupFill', read: 'calcPopupRead' },
    defaultWidth: 380,
    defaultHeight: 450,
    source: 'external'
});

// Tax Calculator
PluginRegistry.registerTool({
    id: 'dynamic-tax-calculator',
    name: 'Tax Calculator',
    description: 'US federal income tax calculator with bracket breakdown',
    icon: '🧾',
    version: '1.0.0',
    toolbox: 'finance',
    tags: ['tax', 'income', 'federal', 'bracket'],
    title: 'Tax Calculator',
    content: '<div class="calc-widget" data-calc="tax"><button type="button" class="calc-reset" hidden onclick="calcReset(this, \'tax\')" title="Put every field back to its default">Reset</button><div class="calc-grid"><div><label>Annual Income</label><input type="number" id="taxIncome" value="75000" oninput="calculateTax(this)"></div><div><label>Filing Status</label><select id="taxStatus" onchange="calculateTax(this)"><option value="single">Single</option><option value="married">Married Filing Jointly</option></select></div><div><label>Tax Year</label><select id="taxYear" onchange="calculateTax(this)" title="Which year’s brackets, from Tax &amp; Retirement Rules"><option value="">This year</option></select></div></div><div id="taxResults"></div></div>',
    onInit: 'calculateTax',
    popup: { fill: 'taxPopupFill', read: 'calcPopupRead' },
    defaultWidth: 360,
    defaultHeight: 400,
    source: 'external'
});

// Finance Planning: what you have and owe, what comes in and goes out, and where it leads
PluginRegistry.registerTool({
    id: 'finance-planning',
    name: 'Finance Planning',
    description: 'Accounts, income and expenses rolled up into net worth, and projected over the years',
    icon: '🧭',
    version: '1.0.0',
    toolbox: 'finance',
    tags: ['finance', 'net worth', 'budget', 'planning', 'projection', 'accounts', 'retirement'],
    title: 'Finance Planning',
    content: '<div class="calc-widget fp-widget">' + FP_PANES + '</div>',
    // The page written about it, opened from the ? in its header.
    guide: 'learn/tools/finance-planning.html',
    // What goes in, what it comes to, or the two side by side — as a note has them: it opens
    // on what it comes to, and goes back there when you look away. The one difference is a
    // new plan, which opens on Edit (fpRender), having nothing yet to view.
    authoring: {
        modes: ['edit', 'split', 'render'],
        defaultMode: 'render',
        titles: {
            edit: 'What goes into the plan',
            render: 'What it comes to: the summary, a month now and Ahead'
        },
        source: '.authoring-source',
        result: '.authoring-result'
    },
    // ?example=1 fills an empty planner with the made-up example.
    hashParams: 'fpApplyHashParams',
    // ✨ where Chrome's own model can run — on the device, so a person's figures stay
    // there. It reads the plan worked out and writes about it, drafts lines for the plan
    // to add, or sorts the expenses into sections; every sum is the tool's.
    ai: {
        target: 'fpAITarget',
        apply: 'fpAIApply',
        actions: ['ask'],
        custom: [
            { id: 'check', group: 'Plan', label: 'Check my plan', system: FP_AI_SYSTEM, apply: false, finish: fpAIFinish,
                show: (t) => !!t.text,
                prompt: (text) => 'Look over this finance plan and list what stands out, most important first, as a few short bullets: ' +
                    'how many months of spending the cash covers, how much is saved, how much debt payments take, when debts end, ' +
                    'whether the goal is reached, whether the money lasts through retirement, and any of the facts at the end that are warnings. Name the accounts or lines ' +
                    'concerned and quote the figures as they are given. Say what to look at, not what to buy.\n\n' + text },
            { id: 'explain', group: 'Plan', label: 'Explain where it leads', system: FP_AI_SYSTEM, apply: false, finish: fpAIFinish,
                show: (t) => !!t.text,
                prompt: (text) => 'In two or three short paragraphs of plain language, explain where this plan leads and why: ' +
                    'which accounts and lines drive net worth up, what holds it back, when debts are paid off, and how wide the range ' +
                    'is. Quote the figures as they are given.\n\n' + text },
            { id: 'draft', group: 'Plan', label: 'Draft from a description', system: FP_AI_SYSTEM, needsText: false,
                input: 'Describe your money: “I earn $95k a year, rent is $2,000, $15k in savings, a $12k car loan at 7% paying $400”',
                applyLabels: { insert: 'Add to the plan', replace: 'Replace the plan' },
                schema: FP_AI_DRAFT_SCHEMA, parse: fpAICleanDraft, preview: fpAIDraftPreview,
                prompt: (text, what) => 'Turn this description of a household’s money into a finance plan: ' + what + '\n\n' +
                    'Accounts are what is held or owed: kind is one of ' + Object.keys(FP_KINDS).join(', ') + '; balance is what is in it ' +
                    'or owed on it; rate is its yearly interest or return in per cent, only if said; monthly is what is added to it ' +
                    'each month, or for a loan or credit card its payment, only if said. Incomes and expenses are what comes in and ' +
                    'goes out, each with its amount as said and whether that is a month or a year. Use only what the description says: ' +
                    'leave out anything not given rather than guess.' + (text ? '\n\nThe plan already has this, so do not repeat it:\n' + text : '') },
            { id: 'sections', group: 'Plan', label: 'Sort expenses into sections', system: FP_AI_SYSTEM,
                show: (t) => t.expenseCount >= 3,
                applyHow: ['replace'], applyLabels: { replace: 'Apply these sections' },
                schema: FP_AI_SECTIONS_SCHEMA,
                parse: (j, t) => fpAICleanSections(j, t ? t.expenseCount : 0),
                preview: (data, t) => fpAISectionsPreview(data, fpGet(t.toolId)),
                prompt: (text, what, t) => 'Sort these expenses into a few sections, such as Housing, Food, Transport, Bills, ' +
                    'Health or Fun — whatever fits them. Give each section a short name and the numbers of the expenses in it; ' +
                    'every expense in exactly one section.\n\n' + (t ? t.expenses : '') }
        ]
    },
    onInit: 'fpInit',
    defaultWidth: 760,
    defaultHeight: 720,
    source: 'external'
});

// Tax & Retirement Rules (once Tax Brackets, and still its id): the brackets and standard
// deductions every Tax Calculator uses, by year, and the other rules Finance Planning does
PluginRegistry.registerTool({
    id: 'tax-brackets',
    name: 'Tax & Retirement Rules',
    description: 'Tax brackets, payroll tax, contribution limits and the Social Security and withdrawal rules, by year — shared by every Tax Calculator and Finance Planning',
    icon: '📊',
    version: '1.0.0',
    toolbox: 'finance',
    tags: ['tax', 'bracket', 'deduction', 'year', 'settings', 'rules', 'retirement', 'social security', 'payroll', '401k', 'capital gains'],
    title: 'Tax & Retirement Rules',
    content: '<div class="calc-widget tb-widget"></div>',
    guide: 'learn/tools/finance-planning.html#rules',
    onInit: 'tbInit',
    defaultWidth: 460,
    defaultHeight: 600,
    source: 'external'
});

// Loan Calculator
PluginRegistry.registerTool({
    id: 'loan-calculator',
    name: 'Loan Calculator',
    description: 'Mortgage and loan calculator with amortization schedule',
    icon: '🏦',
    version: '1.0.0',
    toolbox: 'finance',
    tags: ['loan', 'mortgage', 'amortization', 'payment'],
    title: 'Loan Calculator',
    content: '<div class="calc-widget" data-calc="loan"><button type="button" class="calc-reset" hidden onclick="calcReset(this, \'loan\')" title="Put every field back to its default">Reset</button><div class="calc-grid"><div><label>Original Amount</label><input type="number" id="loanAmount" value="300000" oninput="calculateLoan(this)"></div><div><label>Current Balance</label><input type="number" id="loanCurrent" placeholder="Same as original" title="What is owed today, for a loan already under way. Empty for a new loan." oninput="calculateLoan(this)"></div><div><label>Interest Rate %</label><input type="number" id="loanRate" value="6.5" step="0.125" oninput="calculateLoan(this)"></div><div><label>Loan Term (Years)</label><input type="number" id="loanYears" value="30" oninput="calculateLoan(this)"></div><div><label>Extra Payment/mo</label><input type="number" id="loanExtra" value="0" oninput="calculateLoan(this)"></div><div><label>Closing Date</label><input type="date" id="loanClosing" title="The day the loan closed, if it has: payments are counted monthly from the month after" oninput="calculateLoan(this)"></div></div><div id="loanResults"></div></div>',
    onInit: 'calculateLoan',
    popup: { fill: 'loanPopupFill', read: 'calcPopupRead' },
    defaultWidth: 380,
    defaultHeight: 450,
    source: 'external'
});

console.log('Finance Tools plugin loaded');
