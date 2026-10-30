// Class Grades Tool Plugin
// A student's classes, grades and work from a school's learning platform (Canvas
// LMS), read with a personal access token and written out as a short report:
//
//   🟩 Math - 92.4% (A-)
//       🟩 5.4 Test Review - 18/20 (90%) - ✅ Submitted Oct 21 - Due Oct 22
//   Missing 0, late 0, 1 due this week. Grade up 1.2 since last check.
//
// Not one of the official plugins: it is added by its URL. Works with a student's
// token, and with a parent's (an "observer"), who picks which of their students to
// show.
//
// The token is never in the tool's settings — those travel in exports, share links,
// copies and undo history. It is held in memory, or, if asked, in a browser-only key
// of its own. The grades fetched are kept the same way, so an exported board carries
// the school's address and nothing about anyone's grades.
//
// The platform does not, as a rule, let another website read its API, so a request
// that fails that way is made again through the board's own proxy, with the token in
// the Authorization header — never in an address. The proxy answers only the
// published board, so from a board opened from disk this cannot work, and says so.

(function() {
    if (document.getElementById('class-grades-styles')) return;
    const style = document.createElement('style');
    style.id = 'class-grades-styles';
    style.textContent = `
.tool-content:has(.cg-widget) { display: flex; flex-direction: column; }
.cg-widget { padding: 8px 10px; font-size: 12px; display: flex; flex-direction: column; gap: 6px; flex: 1; min-height: 0; width: 100%; box-sizing: border-box; }
.cg-connection { border: 1px solid var(--border-color); border-radius: 6px; padding: 4px 8px; }
.cg-connection summary { cursor: pointer; font-weight: 600; color: var(--text-heading); padding: 2px 0; }
.cg-connection-body { display: grid; grid-template-columns: auto 1fr; gap: 6px 8px; align-items: center; padding: 6px 0 4px; }
.cg-connection-body label { font-size: 11px; color: var(--text-secondary); }
.cg-connection-body input[type="text"], .cg-connection-body input[type="password"], .cg-connection-body input[type="number"] { padding: 4px 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 12px; min-width: 0; }
.cg-connection-row { grid-column: 1 / -1; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.cg-help { grid-column: 1 / -1; font-size: 11px; color: var(--text-muted); line-height: 1.4; }
.cg-thresholds { display: flex; gap: 6px; align-items: center; font-size: 11px; color: var(--text-secondary); }
.cg-thresholds input { width: 52px; }
.cg-thresholds input.cg-scale { width: auto; flex: 1; min-width: 180px; }
.cg-scale-msg { font-size: 11px; color: var(--text-muted); }
.cg-scale-msg.error { color: #e74c3c; }
.cg-toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.cg-toolbar select { padding: 3px 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 11px; }
.cg-btn { padding: 4px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.cg-btn:hover { background: var(--table-hover); }
.cg-btn.primary { background: #3498db; border-color: #3498db; color: #fff; }
.cg-btn.primary:hover { background: #2980b9; }
.cg-btn:disabled { opacity: 0.5; cursor: default; }
.cg-status { font-size: 11px; color: var(--text-muted); margin-left: auto; }
.cg-status.error { color: #c0392b; font-weight: 600; }
.cg-report { flex: 1; min-height: 0; overflow: auto; margin: 0; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-primary); color: var(--text-primary); font: 12px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; }
.cg-report:empty::before { content: attr(data-empty); color: var(--text-muted); font-family: inherit; }
.cg-student-name { margin-bottom: 8px; }
.cg-filters { border: 1px solid var(--border-color); border-radius: 6px; padding: 4px 8px; }
.cg-filters > summary { cursor: pointer; font-weight: 600; color: var(--text-heading); padding: 2px 0; }
.cg-filter-body { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; align-items: center; padding: 6px 0 4px; }
.cg-filter-body > label { font-size: 11px; color: var(--text-secondary); }
.cg-filter-row { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; font-size: 11px; color: var(--text-secondary); }
.cg-filter-row input[type="number"] { width: 56px; }
.cg-filter-row input, .cg-filter-row select { padding: 3px 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 11px; }
.cg-chip { padding: 2px 8px; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; }
.cg-chip[aria-pressed="true"] { background: #3498db; border-color: #3498db; color: #fff; }
.cg-chip:focus-visible { outline: 2px solid #3498db; outline-offset: 1px; }
.cg-hidden-note { color: var(--text-muted); }
.cg-save-form { display: inline-flex; gap: 4px; align-items: center; }
.cg-save-form[hidden] { display: none; }
.cg-save-msg { color: var(--text-muted); }
.cg-sections-list { margin: 0 0 4px; padding-left: 18px; font-size: 11px; }
.cg-sections-list li { padding: 1px 0; }
.cg-sections-list button { border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); border-radius: 3px; font-size: 10px; padding: 0 5px; margin-left: 3px; cursor: pointer; }
.cg-sections-list button:disabled { opacity: 0.4; cursor: default; }
.cg-sections-note { color: var(--text-muted); }
.cg-class-order { grid-column: 1 / -1; margin: 0; padding-left: 22px; font-size: 11px; max-height: 220px; overflow: auto; }
.cg-class-order li { padding: 1px 0; }
.cg-class-order li.hidden-class .cg-co-name { text-decoration: line-through; color: var(--text-muted); }
.cg-class-order button { border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); border-radius: 3px; font-size: 10px; padding: 0 5px; margin-right: 3px; cursor: pointer; }
.cg-class-order button[aria-pressed="true"] { background: #3498db; border-color: #3498db; color: #fff; }
.cg-class-order button:disabled { opacity: 0.4; cursor: default; }
.cg-link { border: none; background: none; padding: 0; color: var(--link-color, #2878c8); cursor: pointer; font: inherit; text-decoration: underline; }
.cg-sections-hint { grid-column: 1 / -1; font-size: 11px; color: var(--text-muted); }
.cg-section { margin: 0 0 10px; }
.cg-section > summary { cursor: pointer; font-weight: 700; color: var(--text-heading); list-style: none; margin-bottom: 4px; }
.cg-section > summary::-webkit-details-marker { display: none; }
.cg-section > summary::before { content: '▸'; display: inline-block; width: 1.2em; color: var(--text-muted); }
.cg-section[open] > summary::before { content: '▾'; }
.cg-section > .cg-class, .cg-section-empty { margin-left: 1.2em; }
.cg-refreshed { color: var(--text-muted); }
.cg-refreshed.stale { color: #d35400; }
.cg-class-refresh { border: 1px solid transparent; background: none; color: var(--text-muted); cursor: pointer; font-size: 12px; line-height: 1; padding: 1px 4px; border-radius: 4px; }
.cg-class-refresh:hover { border-color: var(--border-color); color: var(--text-primary); }
.cg-class-refresh:focus-visible { outline: 2px solid #3498db; outline-offset: 1px; }
.cg-class-refresh.busy { animation: cg-spin 0.9s linear infinite; }
@keyframes cg-spin { to { transform: rotate(360deg); } }
.cg-class { margin: 0 0 8px; }
.cg-class > summary { cursor: pointer; list-style: none; }
.cg-class > summary::-webkit-details-marker { display: none; }
.cg-class > summary::before { content: '▸'; display: inline-block; width: 1.2em; color: var(--text-muted); }
.cg-class[open] > summary::before { content: '▾'; }
.cg-class > summary:focus-visible { outline: 2px solid #3498db; outline-offset: 1px; border-radius: 3px; }
.cg-count { color: var(--text-muted); }
.cg-class-summary { display: block; padding-left: 1.2em; }
.cg-tasks { padding-left: 1.2em; }
`;
    document.head.appendChild(style);
})();

/** What the on-device model is told it is for; the report it is given is the only source. */
var CLASS_GRADES_AI_SYSTEM_TEXT = 'You help a parent or a student understand a school grade report. Use only the ' +
    'report you are given, and never invent a class, a task, a grade or a date. Be brief, plain and kind. Write Markdown.';

PluginRegistry.registerTool({
    id: 'class-grades',
    name: 'Class Grades',
    description: 'A student’s classes, grades, missing and late work from the school’s learning platform, as a short report',
    icon: '📊',
    version: '1.0.0',
    toolbox: 'school-tools',
    tags: ['grades', 'school', 'classes', 'assignments', 'missing', 'student', 'parent', 'report'],
    title: 'Class Grades',
    content: `<div class="cg-widget">
<details class="cg-connection">
<summary>Connection</summary>
<div class="cg-connection-body">
<label>School address</label>
<input type="text" class="cg-base" placeholder="https://school.example.org" spellcheck="false" autocomplete="off">
<label>Access token</label>
<input type="password" class="cg-token" placeholder="Paste a token" spellcheck="false" autocomplete="off">
<div class="cg-connection-row">
<label><input type="checkbox" class="cg-remember"> Remember token in this browser</label>
<button class="cg-btn primary" onclick="classGradesConnect(this)">Connect</button>
<button class="cg-btn" onclick="classGradesForget(this)">Forget token</button>
</div>
<div class="cg-connection-row cg-thresholds">
<span>🟩 from</span><input type="number" class="cg-green" min="0" max="100" onchange="classGradesThresholds(this)"><span>%</span>
<span>🟧 from</span><input type="number" class="cg-orange" min="0" max="100" onchange="classGradesThresholds(this)"><span>%, 🟥 below</span>
</div>
<div class="cg-connection-row cg-thresholds">
<span>Letters</span><input type="text" class="cg-scale" spellcheck="false" aria-label="Letter grade scale" onchange="classGradesScaleChanged(this)">
</div>
<div class="cg-scale-msg">The lowest % for each letter, used when a course has no grading scheme of its own.</div>
<div class="cg-help">For Canvas LMS: Account ▸ Settings ▸ New access token. A parent’s token works too, and shows the students it is linked to. The token stays in this browser: it is never saved with the board, exported or shared. Unless remembered, it is gone when the page reloads.</div>
</div>
</details>
<div class="cg-toolbar">
<select class="cg-student" aria-label="Student" onchange="classGradesPickStudent(this)" hidden></select>
<select class="cg-view" aria-label="Show" onchange="classGradesSetView(this)">
<option value="single">Single filter</option>
<option value="sections">Sections</option>
</select>
<select class="cg-saved" aria-label="Saved filters" onchange="classGradesPickSaved(this)"></select>
<button class="cg-btn" onclick="classGradesFoldAll(this, true)">Expand all</button>
<button class="cg-btn" onclick="classGradesFoldAll(this, false)">Collapse all</button>
<button class="cg-btn" onclick="classGradesRefresh(this)">Refresh</button>
<button class="cg-btn" onclick="classGradesCopy(this)">Copy</button>
<span class="cg-status" role="status" aria-live="polite"></span>
</div>
<details class="cg-filters">
<summary>Filters <span class="cg-filter-count"></span></summary>
<div class="cg-filter-body">
<div class="cg-sections-hint" hidden>The report shows the sections below. These filters are for making and changing saved filters.</div>
<label>Status</label>
<div class="cg-filter-row" role="group" aria-label="Status">
<button type="button" class="cg-chip" data-group="status" data-value="in" aria-pressed="false" onclick="classGradesChip(this)">✅ Submitted</button>
<button type="button" class="cg-chip" data-group="status" data-value="late" aria-pressed="false" onclick="classGradesChip(this)">⚠️ Late</button>
<button type="button" class="cg-chip" data-group="status" data-value="missing" aria-pressed="false" onclick="classGradesChip(this)">🚫 Missing</button>
<button type="button" class="cg-chip" data-group="status" data-value="upcoming" aria-pressed="false" onclick="classGradesChip(this)">⏳ Not yet due</button>
<button type="button" class="cg-chip" data-group="status" data-value="other" aria-pressed="false" onclick="classGradesChip(this)">Excused / graded</button>
</div>
<label>Grade</label>
<div class="cg-filter-row" role="group" aria-label="Grade">
<button type="button" class="cg-chip" data-group="grade" data-value="green" aria-pressed="false" onclick="classGradesChip(this)">🟩</button>
<button type="button" class="cg-chip" data-group="grade" data-value="orange" aria-pressed="false" onclick="classGradesChip(this)">🟧</button>
<button type="button" class="cg-chip" data-group="grade" data-value="red" aria-pressed="false" onclick="classGradesChip(this)">🟥</button>
<button type="button" class="cg-chip" data-group="grade" data-value="none" aria-pressed="false" onclick="classGradesChip(this)">⬜ Not graded</button>
<span>from</span><input type="number" class="cg-min" min="0" max="200" aria-label="Lowest grade %" onchange="classGradesFiltersChanged(this)">
<span>to</span><input type="number" class="cg-max" min="0" max="200" aria-label="Highest grade %" onchange="classGradesFiltersChanged(this)"><span>%</span>
</div>
<label>Due</label>
<div class="cg-filter-row">
<select class="cg-date" aria-label="Due" onchange="classGradesFiltersChanged(this)">
<option value="any">Any time</option>
<option value="past7">Past 7 days</option>
<option value="past30">Past 30 days</option>
<option value="week">This week</option>
<option value="next7">Next 7 days</option>
<option value="next30">Next 30 days</option>
<option value="custom">From… to…</option>
</select>
<input type="date" class="cg-from" aria-label="Due from" onchange="classGradesFiltersChanged(this)" hidden>
<input type="date" class="cg-to" aria-label="Due to" onchange="classGradesFiltersChanged(this)" hidden>
<label><input type="checkbox" class="cg-nodue" checked onchange="classGradesFiltersChanged(this)"> with no due date</label>
</div>
<label>Submitted</label>
<div class="cg-filter-row">
<select class="cg-sub" aria-label="Submitted" onchange="classGradesFiltersChanged(this)">
<option value="any">Any time</option>
<option value="today">Today</option>
<option value="past7">Past 7 days</option>
<option value="past30">Past 30 days</option>
<option value="week">This week</option>
<option value="custom">From… to…</option>
</select>
<input type="date" class="cg-sub-from" aria-label="Submitted from" onchange="classGradesFiltersChanged(this)" hidden>
<input type="date" class="cg-sub-to" aria-label="Submitted to" onchange="classGradesFiltersChanged(this)" hidden>
<label><input type="checkbox" class="cg-nosub" checked onchange="classGradesFiltersChanged(this)"> include not submitted</label>
</div>
<label>Order</label>
<div class="cg-filter-row">
<select class="cg-sort" aria-label="Order" onchange="classGradesFiltersChanged(this)">
<option value="newest">Newest first</option>
<option value="oldest">Oldest first</option>
</select>
<span class="cg-count">by due date; no due date last</span>
</div>
<label>Classes</label>
<div class="cg-filter-row">
<select class="cg-class-sort" aria-label="Order of classes" onchange="classGradesClassSort(this)">
<option value="mine">My order</option>
<option value="name">Name A–Z</option>
<option value="grade">Lowest grade first</option>
<option value="missing">Most missing first</option>
</select>
<button type="button" class="cg-btn cg-arrange" aria-expanded="false" onclick="classGradesArrangeToggle(this)">Arrange…</button>
<span class="cg-count">★ pinned stay on top</span>
</div>
<ol class="cg-class-order" hidden></ol>
<label>Saved</label>
<div class="cg-filter-row cg-saved-row">
<button type="button" class="cg-btn cg-save-as" onclick="classGradesSaveStart(this, 'save')">Save as…</button>
<button type="button" class="cg-btn cg-rename" onclick="classGradesSaveStart(this, 'rename')">Rename</button>
<button type="button" class="cg-btn cg-delete" onclick="classGradesDeleteSaved(this)">Delete</button>
<span class="cg-save-form" hidden>
<input type="text" class="cg-save-name" placeholder="Name these filters" aria-label="Name for these filters" onkeydown="classGradesSaveKey(event, this)">
<button type="button" class="cg-btn primary cg-save-ok" onclick="classGradesSaveCommit(this)">Save</button>
<button type="button" class="cg-btn" onclick="classGradesSaveCancel(this)">Cancel</button>
</span>
<span class="cg-save-msg" role="status" aria-live="polite"></span>
</div>
<label class="cg-sections-label" hidden>Sections</label>
<div class="cg-sections-editor" hidden>
<ol class="cg-sections-list"></ol>
<div class="cg-filter-row">
<select class="cg-add-section" aria-label="Add a saved filter as a section" onchange="classGradesSectionAdd(this)"></select>
<label><input type="checkbox" class="cg-section-summaries" onchange="classGradesSectionSummaries(this)"> Include class summaries</label>
<span class="cg-sections-note" role="status" aria-live="polite"></span>
</div>
</div>
<label>Name</label>
<div class="cg-filter-row">
<input type="search" class="cg-q" placeholder="Task name contains…" aria-label="Task name contains" oninput="classGradesFiltersChanged(this)">
<button type="button" class="cg-btn" onclick="classGradesClearFilters(this)">Clear filters</button>
</div>
</div>
</details>
<div class="cg-report" data-empty="Open Connection, enter the school's address and a token, then Connect."></div>
</div>`,
    contentType: 'html',
    onInit: 'classGradesInit',
    // ✨ where Chrome's own model can run: read only — an answer is copied, never
    // written into the report — and the grades never leave this computer.
    ai: {
        target: 'classGradesAITarget',
        actions: ['ask'],
        custom: [
            { id: 'summary', group: 'Grades', label: 'Student summary', system: CLASS_GRADES_AI_SYSTEM_TEXT,
                prompt: function(text) { return 'Summarize this grade report in at most 8 short bullet points: first the classes ' +
                    'that need attention and why (a low or falling grade, missing or late work), then what is due in the next ' +
                    '7 days, then what is going well.\n\n' + text; } },
            { id: 'attention', group: 'Grades', label: 'What needs attention', system: CLASS_GRADES_AI_SYSTEM_TEXT,
                prompt: function(text) { return 'List only what needs doing now, most urgent first: missing work, late work, ' +
                    'and low or falling grades. One bullet each, naming the class. If nothing does, say so.\n\n' + text; } },
            { id: 'week', group: 'Grades', label: 'What\u2019s due this week', system: CLASS_GRADES_AI_SYSTEM_TEXT,
                prompt: function(text) { return 'List the work due in the next 7 days from today, in order of due date, each with ' +
                    'its class and due day. If nothing is due, say so.\n\n' + text; } }
        ]
    },
    source: 'external',
    defaultWidth: 620,
    defaultHeight: 480
});

var CLASS_GRADES_PROXY = 'https://ics-proxy-esjyexqdtq-ue.a.run.app/?url=';
var CLASS_GRADES_PAGE = 100;
// Assignments come with their full descriptions, so a page of them can be large —
// large enough to take the proxy past its memory, which is kept small to stay free.
// Smaller pages, asked for one at a time, keep each answer within what it can hold.
var CLASS_GRADES_ASSIGNMENT_PAGE = 20;
// Whether the proxy has answered this tool yet: after it has, a failed request is the
// proxy failing, not the proxy refusing this page.
var _classGradesProxyWorked = {};
// Tokens not remembered: this page's memory only.
var _classGradesTokens = {};
// The route that worked last, per tool, so the next request does not try both.
var _classGradesRoute = {};

function classGradesToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function classGradesCustom(toolId) {
    var custs = loadToolCustomizations();
    return custs[toolId] || {};
}

function classGradesSaveCustom(toolId, patch) {
    var custs = loadToolCustomizations();
    custs[toolId] = Object.assign({}, custs[toolId] || {}, patch);
    saveToolCustomizations(custs);
    if (typeof toolCustomizations !== 'undefined') toolCustomizations[toolId] = custs[toolId];
}

// The token and what was fetched live outside the tool's settings, keyed by tool.
function classGradesTokenKey(toolId) { return 'toolboard_classGradesToken_' + toolId; }
function classGradesDataKey(toolId) { return 'toolboard_classGradesData_' + toolId; }

function classGradesGetToken(toolId) {
    if (_classGradesTokens[toolId]) return _classGradesTokens[toolId];
    try { return localStorage.getItem(classGradesTokenKey(toolId)) || ''; } catch (e) { return ''; }
}

function classGradesData(toolId) {
    try { return JSON.parse(localStorage.getItem(classGradesDataKey(toolId)) || '{}') || {}; } catch (e) { return {}; }
}

function classGradesSaveData(toolId, data) {
    try { localStorage.setItem(classGradesDataKey(toolId), JSON.stringify(data)); } catch (e) { /* shown, just not kept */ }
}

/** The letters for a percentage when a course has no grading scheme: the common US scale. */
var CLASS_GRADES_SCALE = 'A 93, A- 90, B+ 87, B 83, B- 80, C+ 77, C 73, C- 70, D+ 67, D 63, D- 60, F 0';

/** "A 93, A- 90, …" as letters with the lowest % for each, highest first; null if it does not read. */
function classGradesParseScale(text) {
    var parts = String(text || '').split(/[,;\n]+/).map(function(p) { return p.trim(); }).filter(Boolean);
    if (!parts.length) return null;
    var scale = [];
    for (var i = 0; i < parts.length; i++) {
        var m = /^(\S+)\s*(?:[:=]|\s)\s*(\d+(?:\.\d+)?)\s*%?$/.exec(parts[i]);
        if (!m) return null;
        scale.push({ letter: m[1], min: Number(m[2]) });
    }
    return scale.sort(function(a, b) { return b.min - a.min; });
}

function classGradesScale(custom) {
    return (custom.cgScale && classGradesParseScale(custom.cgScale)) || classGradesParseScale(CLASS_GRADES_SCALE);
}

/** The letter for a percentage, as shown (to a tenth): 92.96 shows as 93% and is an A. */
function classGradesLetter(score, scale) {
    if (score == null || !isFinite(score) || !scale) return '';
    var shown = classGradesRound(score);
    for (var i = 0; i < scale.length; i++) if (shown >= scale[i].min) return scale[i].letter;
    return '';
}

function classGradesThresholdValues(custom) {
    var green = Number(custom.cgGreen), orange = Number(custom.cgOrange);
    return { green: isFinite(green) && custom.cgGreen != null ? green : 90, orange: isFinite(orange) && custom.cgOrange != null ? orange : 70 };
}

// =============================================
// ON-DEVICE AI
// =============================================

/** How far back and ahead the model is shown work, and how much of each list. */
var CLASS_GRADES_AI_DAYS = 14;
var CLASS_GRADES_AI_LIST = 8;

/**
 * The student's report, compact, for the on-device model: its input is small, and a
 * report of a hundred tasks would not fit. Every class with its grade, its letter and
 * its change since the last check; then what is missing, late, due within two weeks
 * and graded within two weeks. All the student's classes but the ones hidden by hand,
 * whatever the filters show. Nothing here is kept, and nothing leaves the computer.
 */
function classGradesAIText(toolId, now) {
    var custom = classGradesCustom(toolId);
    var data = classGradesData(toolId);
    var students = data.students || [];
    var studentId = custom.cgStudent != null && students.some(function(s) { return String(s.id) === String(custom.cgStudent); })
        ? String(custom.cgStudent) : (students[0] ? String(students[0].id) : '');
    var snap = (data.snapshots || {})[studentId];
    if (!snap || !(snap.courses || []).length) return null;
    var student = students.find(function(s) { return String(s.id) === studentId; });
    var prefs = classGradesClassPrefs(custom, studentId);
    var scale = classGradesScale(custom);
    var day = 86400000, span = CLASS_GRADES_AI_DAYS * day;
    var when = function(iso) {
        return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    };
    var list = function(items) {
        return items.slice(0, CLASS_GRADES_AI_LIST).join('; ') +
            (items.length > CLASS_GRADES_AI_LIST ? '; and ' + (items.length - CLASS_GRADES_AI_LIST) + ' more' : '');
    };
    var courses = (snap.courses || []).filter(function(c) { return prefs.hidden.indexOf(String(c.id)) < 0; })
        .sort(function(a, b) { return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }); });
    var out = ['Today is ' + new Date(now).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '.'];
    if (student && student.name) out.push('Student: ' + student.name + '.');
    courses.forEach(function(c) {
        var grade = c.score == null ? 'no grade yet' : classGradesClassGrade(c, scale);
        var change = c.score == null || c.previous == null ? ''
            : c.score > c.previous ? ', up ' + classGradesRound(c.score - c.previous) + ' since the last check'
            : c.score < c.previous ? ', down ' + classGradesRound(c.previous - c.score) + ' since the last check' : ', unchanged since the last check';
        var missing = [], late = [], due = [], graded = [];
        (c.tasks || []).forEach(function(task) {
            var status = classGradesTaskStatus(task, now);
            var at = task.due ? new Date(task.due).getTime() : null;
            if (status.kind === 'missing') missing.push(task.name + (task.due ? ' (was due ' + when(task.due) + ')' : ''));
            else if (status.kind === 'late') late.push(task.name + ' (handed in late ' + when(task.submittedAt) + ')');
            else if (status.kind === 'upcoming' && at != null && at >= now && at <= now + span) due.push({ at: at, text: task.name + ' (due ' + when(task.due) + ')' });
            var g = classGradesTaskGrade(task);
            var gradedAt = task.submittedAt || task.due;
            if (task.score != null && gradedAt && now - new Date(gradedAt).getTime() <= span && new Date(gradedAt).getTime() <= now) {
                graded.push(task.name + ': ' + g.text);
            }
        });
        due.sort(function(a, b) { return a.at - b.at; });
        out.push('');
        out.push('Class: ' + c.name + ' \u2014 ' + grade + change + '.');
        out.push('Missing: ' + (missing.length ? list(missing) : 'none') + '.');
        if (late.length) out.push('Late: ' + list(late) + '.');
        out.push('Due in the next ' + CLASS_GRADES_AI_DAYS + ' days: ' + (due.length ? list(due.map(function(d) { return d.text; })) : 'nothing') + '.');
        if (graded.length) out.push('Graded in the last ' + CLASS_GRADES_AI_DAYS + ' days: ' + list(graded) + '.');
    });
    return { text: out.join('\n'), label: (student && student.name ? student.name + ' \u00B7 ' : '') +
        courses.length + (courses.length === 1 ? ' class' : ' classes') + ', all of them, whatever the filters show' };
}

/** What ✨ works on: the report as above, or nothing yet. */
function classGradesAITarget(toolId) {
    var r = classGradesAIText(toolId, Date.now());
    return r ? { text: r.text, scope: 'whole', label: r.label }
        : { text: '', scope: 'whole', emptyLabel: 'No grades to read yet: connect and Refresh first.' };
}

function classGradesInit() {
    document.querySelectorAll('.cg-widget').forEach(function(widget) {
        if (widget.dataset.inited) return;
        widget.dataset.inited = '1';
        var toolId = classGradesToolId(widget);
        var custom = classGradesCustom(toolId);
        var t = classGradesThresholdValues(custom);
        widget.querySelector('.cg-base').value = custom.cgBase || '';
        widget.querySelector('.cg-green').value = t.green;
        widget.querySelector('.cg-orange').value = t.orange;
        widget.querySelector('.cg-scale').value = custom.cgScale || CLASS_GRADES_SCALE;
        classGradesShowFilter(widget, classGradesFilter(custom));
        var remembered = false;
        try { remembered = !!localStorage.getItem(classGradesTokenKey(toolId)); } catch (e) { remembered = false; }
        widget.querySelector('.cg-remember').checked = remembered;
        if (!custom.cgBase || !classGradesGetToken(toolId)) widget.querySelector('.cg-connection').open = true;
        classGradesRender(widget);
    });
}

// =============================================
// FETCHING
// =============================================

function classGradesPageOrigin() {
    return location.protocol === 'file:' ? 'opened from a file' : location.origin;
}

function classGradesNormalizeBase(raw) {
    var text = String(raw || '').trim();
    if (!text) return '';
    if (!/^https?:\/\//i.test(text)) text = 'https://' + text;
    try {
        var u = new URL(text);
        if (u.protocol !== 'https:' && u.protocol !== 'http:') return '';
        return u.origin;
    } catch (e) { return ''; }
}

/**
 * One API request: directly when the platform allows it, else through the proxy.
 * Errors say which: a refused token, a proxy that does not answer this page, a host
 * that cannot be reached.
 */
/** How long to wait before each retry through the proxy. */
var CLASS_GRADES_RETRY_MS = [1500, 4000];

async function classGradesRequest(toolId, url, token) {
    var headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json' };
    var route = _classGradesRoute[toolId] || 'direct';
    var res = null;
    if (route === 'direct') {
        try {
            res = await fetch(url, { headers: headers, credentials: 'omit', cache: 'no-store' });
        } catch (e) {
            route = 'proxy';
        }
    }
    if (route === 'proxy') {
        var where = url.replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, '');
        // A proxy that falls over sends no CORS headers, so the browser reports a
        // failed fetch, the same as one that refuses this page. It is tried twice more,
        // further apart each time: what answers next is a new instance, starting up.
        // The school's own 5xx comes with the proxy's headers, and is tried once more.
        for (var attempt = 0; ; attempt++) {
            try {
                res = await fetch(CLASS_GRADES_PROXY + encodeURIComponent(url), { headers: headers, credentials: 'omit', cache: 'no-store' });
            } catch (e) {
                res = null;
            }
            if (res && res.status < 500) break;
            if (attempt >= (res ? 1 : 2)) break;
            await new Promise(function(r) { setTimeout(r, CLASS_GRADES_RETRY_MS[attempt]); });
        }
        if (res && res.status >= 500) {
            // Passed on by the proxy, with its headers: it is the school's own answer.
            throw new Error('The school answered ' + res.status + ' for ' + where + '. Try Refresh in a moment.');
        }
        if (!res) {
            if (_classGradesProxyWorked[toolId]) {
                throw new Error('The board’s proxy failed while reading ' + where + '. Try Refresh in a moment.');
            }
            // Never answered at all: a proxy that will not answer this page refuses
            // before the request is made.
            throw new Error('The school does not let this page read it directly, and the board’s proxy did not answer this page (' +
                classGradesPageOrigin() + '). Open the board from its web address, or check the school’s address.');
        }
        _classGradesProxyWorked[toolId] = true;
    }
    _classGradesRoute[toolId] = route;
    var text = await res.text();
    if (route === 'proxy' && res.status === 403 && /^Forbidden\s*$/.test(text)) {
        throw new Error('The board’s proxy does not answer this page (' + classGradesPageOrigin() + '). Open the board from its web address.');
    }
    if (route === 'proxy' && res.status === 403 && /not permitted for this page/.test(text)) {
        throw new Error('Opened from a file, this board can reach the school only at its instructure.com address (like https://yourschool.instructure.com) — use that address, or open the board from its web address.');
    }
    if (res.status === 401) throw new Error('The token was refused (401). Check it, or make a new one.');
    if (!res.ok) throw new Error('The school answered ' + res.status + ' for ' + url.replace(/^https?:\/\/[^/]+/, '') + '.');
    try {
        return JSON.parse(text.replace(/^while\(1\);/, ''));
    } catch (e) {
        throw new Error('What came back for ' + url.replace(/^https?:\/\/[^/]+/, '') + ' is not the API’s JSON — is the address right?');
    }
}

// Every page of a list: the proxy does not pass on the header that says where the
// next page is, so pages are asked for in turn until one comes back short.
async function classGradesList(toolId, base, path, token, perPage) {
    var size = perPage || CLASS_GRADES_PAGE;
    var out = [];
    for (var page = 1; page <= 100; page++) {
        var sep = path.indexOf('?') >= 0 ? '&' : '?';
        var items = await classGradesRequest(toolId, base + path + sep + 'per_page=' + size + '&page=' + page, token);
        if (!Array.isArray(items)) {
            // An answer that is not a list is never "nothing there": it was read as
            // an empty list once, and every class showed no work at all.
            var said = items && items.errors && items.errors[0] && items.errors[0].message ? items.errors[0].message
                : items && typeof items === 'object' ? 'something with ' + Object.keys(items).slice(0, 4).join(', ') : String(items);
            throw new Error('The school answered ' + path.replace(/\?.*$/, '') + ' with ' + said + ', not a list.');
        }
        out = out.concat(items);
        if (items.length < size) break;
    }
    return out;
}

/** Up to `limit` at a time, in order. */
async function classGradesEach(items, limit, fn) {
    var results = new Array(items.length);
    var next = 0;
    async function worker() {
        while (next < items.length) {
            var i = next++;
            results[i] = await fn(items[i], i);
        }
    }
    var workers = [];
    for (var w = 0; w < Math.min(limit, items.length); w++) workers.push(worker());
    await Promise.all(workers);
    return results;
}

/**
 * Who the report can be about: the token's own user if a student, or the students a
 * parent's token is linked to.
 */
async function classGradesStudents(toolId, base, token) {
    var self = await classGradesRequest(toolId, base + '/api/v1/users/self', token);
    var observees = [];
    try {
        observees = await classGradesList(toolId, base, '/api/v1/users/self/observees', token);
    } catch (e) {
        observees = [];
    }
    if (observees.length) {
        return { observer: true, self: self, students: observees.map(function(s) { return { id: s.id, name: s.short_name || s.name || ('Student ' + s.id) }; }) };
    }
    return { observer: false, self: self, students: [{ id: self.id, name: self.short_name || self.name || 'Me' }] };
}

function classGradesSubmissionFor(assignment, studentId) {
    var s = assignment.submission;
    if (Array.isArray(s)) return s.find(function(x) { return String(x.user_id) === String(studentId); }) || null;
    return s || null;
}

/** One student's classes and work, read from the platform. */
async function classGradesFetch(toolId, base, token, who, studentId) {
    var courses = await classGradesList(toolId, base,
        '/api/v1/courses?enrollment_state=active&include[]=total_scores&include[]=observed_users', token);
    // A course the student is in, as a student — a parent's list also holds the
    // parent's own observer enrolments.
    courses = courses.filter(function(c) {
        return c && c.id != null && (c.enrollments || []).some(function(e) {
            return /student/i.test(e.type || e.role || '') && (!who.observer || String(e.user_id) === String(studentId));
        });
    });
    // One class at a time: requests side by side are what took the proxy past its memory.
    return classGradesEach(courses, 1, function(c) { return classGradesFetchCourse(toolId, base, token, who, studentId, c); });
}

/** One class: its overall grade, from the course as listed, and its tasks. */
async function classGradesFetchCourse(toolId, base, token, who, studentId, c) {
    var enrollment = (c.enrollments || []).find(function(e) {
        return /student/i.test(e.type || e.role || '') && (!who.observer || String(e.user_id) === String(studentId));
    }) || {};
    var score = enrollment.computed_current_score;
    var grade = enrollment.computed_current_grade;
    if (score == null && enrollment.grades) { score = enrollment.grades.current_score; grade = enrollment.grades.current_grade; }
    // A parent reads the course as the student sees it — Canvas's route for that,
    // which brings the student's own submission with each assignment.
    var assignments = await classGradesList(toolId, base, who.observer
        ? '/api/v1/users/' + encodeURIComponent(studentId) + '/courses/' + c.id + '/assignments?include[]=submission&order_by=due_at'
        : '/api/v1/courses/' + c.id + '/assignments?include[]=submission&order_by=due_at', token,
        CLASS_GRADES_ASSIGNMENT_PAGE);
    var subs = null;
    if (who.observer && !assignments.length) {
        // A parent's token can be given no assignments for a course, while the
        // student's submissions — one for every task, handed in or not — are
        // there, each with its assignment.
        var withAssignments = await classGradesList(toolId, base, '/api/v1/courses/' + c.id +
            '/students/submissions?student_ids[]=' + encodeURIComponent(studentId) + '&include[]=assignment', token,
            CLASS_GRADES_ASSIGNMENT_PAGE);
        subs = {};
        assignments = [];
        withAssignments.forEach(function(s) {
            if (!s.assignment) return;
            assignments.push(s.assignment);
            subs[s.assignment.id] = s;
        });
    } else if (who.observer && !assignments.some(function(a) { return classGradesSubmissionFor(a, studentId); })) {
        // Where the assignments did not bring the student's submissions with them,
        // ask for that student's submissions in the course.
        var list = await classGradesList(toolId, base,
            '/api/v1/courses/' + c.id + '/students/submissions?student_ids[]=' + encodeURIComponent(studentId), token);
        subs = {};
        list.forEach(function(s) { subs[s.assignment_id] = s; });
    }
    return {
        id: c.id,
        name: c.name || c.course_code || ('Course ' + c.id),
        score: score == null ? null : Number(score),
        grade: grade || null,
        tasks: assignments.map(function(a) {
            var s = subs ? subs[a.id] || null : classGradesSubmissionFor(a, studentId);
            return {
                name: a.name || 'Untitled',
                due: a.due_at || null,
                points: a.points_possible == null ? null : Number(a.points_possible),
                score: s && s.score != null ? Number(s.score) : null,
                grade: s && s.grade != null ? String(s.grade) : null,
                submittedAt: s && s.submitted_at || null,
                late: !!(s && s.late),
                missing: !!(s && s.missing),
                excused: !!(s && s.excused),
                state: s && s.workflow_state || null
            };
        })
    };
}

/** One class read again: its grade and tasks, nothing else. */
async function classGradesRefreshClass(btn, event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    var widget = btn.closest('.cg-widget');
    var toolId = classGradesToolId(widget);
    var custom = classGradesCustom(toolId);
    var token = classGradesGetToken(toolId);
    var courseId = btn.closest('.cg-class').dataset.course;
    var data = classGradesData(toolId);
    var studentId = widget.querySelector('.cg-student').value;
    var snap = (data.snapshots || {})[studentId];
    var old = snap && snap.courses.find(function(c) { return String(c.id) === courseId; });
    if (!old) return;
    if (!custom.cgBase || !token) {
        widget.querySelector('.cg-connection').open = true;
        classGradesSetStatus(widget, 'Paste an access token, then Connect.', true);
        return;
    }
    btn.disabled = true;
    btn.classList.add('busy');
    classGradesSetStatus(widget, 'Refreshing ' + old.name + '\u2026');
    try {
        var who = { observer: !!data.observer };
        var course = await classGradesRequest(toolId, custom.cgBase + '/api/v1/courses/' + encodeURIComponent(courseId) +
            '?include[]=total_scores&include[]=observed_users', token);
        if (!course || Array.isArray(course) || course.id == null) throw new Error('The school did not answer with the class.');
        var fresh = await classGradesFetchCourse(toolId, custom.cgBase, token, who, studentId, course);
        // Since last check, for this class alone: its own last grade, then this one.
        data = classGradesData(toolId);
        snap = data.snapshots[studentId];
        var last = (data.lastScores || {})[studentId] || {};
        fresh.previous = Object.prototype.hasOwnProperty.call(last, fresh.id) ? last[fresh.id] : undefined;
        fresh.refreshedAt = Date.now();
        snap.courses = snap.courses.map(function(c) { return String(c.id) === courseId ? fresh : c; });
        data.lastScores = data.lastScores || {};
        data.lastScores[studentId] = Object.assign({}, last, { [fresh.id]: fresh.score });
        classGradesSaveData(toolId, data);
        classGradesSetStatus(widget, '');
        classGradesRender(widget);
        classGradesSetStatus(widget, fresh.name + ' refreshed ' + new Date(fresh.refreshedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }));
    } catch (e) {
        classGradesSetStatus(widget, old.name + ': ' + (e.message || String(e)), true);
        btn.disabled = false;
        btn.classList.remove('busy');
    }
}

// =============================================
// THE REPORT
// =============================================

function classGradesSquare(pct, t) {
    if (pct == null || !isFinite(pct)) return '⬜';
    if (pct >= t.green) return '🟩';
    if (pct >= t.orange) return '🟧';
    return '🟥';
}

function classGradesDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function classGradesRound(n) { return Math.round(n * 10) / 10; }

/**
 * Where a task stands: ✅ in (on time), ⚠️ in late, 🚫 missing, ⏳ not due yet.
 * Work marked missing, or past due with nothing handed in and nothing graded, is
 * missing; graded work with no submission (done on paper) counts as in.
 */
function classGradesTaskStatus(task, now) {
    if (task.excused) return { icon: '✅', text: 'Excused', kind: 'other' };
    if (task.submittedAt) {
        if (task.late) return { icon: '⚠️', text: 'Late ' + classGradesDate(task.submittedAt), kind: 'late' };
        return { icon: '✅', text: 'Submitted ' + classGradesDate(task.submittedAt), kind: 'in' };
    }
    var due = task.due ? new Date(task.due).getTime() : null;
    if (task.missing || (due != null && due < now && task.score == null && task.state !== 'graded')) {
        return { icon: '🚫', text: 'Missing', kind: 'missing' };
    }
    if (task.score != null || task.state === 'graded') return { icon: '✅', text: 'Graded', kind: 'other' };
    return { icon: '⏳', text: 'Not submitted', kind: 'upcoming' };
}

function classGradesTaskGrade(task) {
    if (task.score == null) return { text: task.grade && task.grade !== 'null' ? task.grade : 'Not graded', pct: null };
    if (task.points) {
        var pct = classGradesRound(task.score / task.points * 100);
        return { text: classGradesRound(task.score) + '/' + classGradesRound(task.points) + ' (' + pct + '%)', pct: pct };
    }
    return { text: String(classGradesRound(task.score)) + ' pts', pct: null };
}

/** A class's overall grade: the percentage, and the grade beside it when it says
 *  something more (a letter) — not a number that only repeats the percentage. */
function classGradesClassGrade(c, scale) {
    return classGradesClassGradeOf(c, scale).text;
}

/** The grade's text, and where its letter came from: the course's own scheme, the scale here, or none. */
function classGradesClassGradeOf(c, scale) {
    if (c.score == null) return { text: 'No grade', from: '' };
    var pct = classGradesRound(c.score) + '%';
    var g = c.grade == null ? '' : String(c.grade).trim();
    var repeats = /^\d+(\.\d+)?%?$/.test(g) && Math.abs(parseFloat(g) - c.score) < 1;
    if (g && !repeats) return { text: pct + ' (' + g + ')', from: 'course' };
    var letter = classGradesLetter(c.score, scale || classGradesParseScale(CLASS_GRADES_SCALE));
    return letter ? { text: pct + ' (' + letter + ')', from: 'scale' } : { text: pct, from: '' };
}

/**
 * Which tasks are shown, and in what order. Kept with the tool: it says nothing about
 * anyone's grades. Empty means everything; `sort` is newest due first unless asked.
 */
var CLASS_GRADES_NO_FILTER = { status: [], grade: [], min: '', max: '', date: 'any', from: '', to: '', noDue: true,
    sub: 'any', subFrom: '', subTo: '', noSub: true, q: '', sort: 'newest' };

function classGradesFilter(custom) {
    var f = Object.assign({}, CLASS_GRADES_NO_FILTER, custom.cgFilter || {});
    f.status = Array.isArray(f.status) ? f.status : [];
    f.grade = Array.isArray(f.grade) ? f.grade : [];
    return f;
}

/** How many of the filters are narrowing anything (the order is not a filter). */
function classGradesFilterCount(f) {
    var n = 0;
    if (f.status.length) n++;
    if (f.grade.length) n++;
    if (String(f.min) !== '' || String(f.max) !== '') n++;
    if (f.date !== 'any') n++;
    if (f.date !== 'any' && !f.noDue) n++;
    if (f.sub && f.sub !== 'any') n++;
    if (f.sub && f.sub !== 'any' && f.noSub === false) n++;
    if (String(f.q || '').trim()) n++;
    return n;
}

/**
 * The window a filter names for the due date, or with `which` 'sub' for the date the
 * work was handed in, as [from, to] times; null for any time.
 */
function classGradesDateWindow(f, now, which) {
    var day = 86400000;
    var startOfDay = function(t) { var d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
    var sub = which === 'sub';
    var from = sub ? f.subFrom : f.from, to = sub ? f.subTo : f.to;
    switch (sub ? f.sub : f.date) {
        case 'today': return [startOfDay(now), startOfDay(now) + day - 1];
        case 'past7': return [now - 7 * day, now];
        case 'past30': return [now - 30 * day, now];
        case 'next7': return [now, now + 7 * day];
        case 'next30': return [now, now + 30 * day];
        case 'week': {
            // Monday to Sunday, the school week.
            var d = new Date(startOfDay(now));
            var back = (d.getDay() + 6) % 7;
            var from = d.getTime() - back * day;
            return [from, from + 7 * day - 1];
        }
        case 'custom': {
            var a = from ? new Date(from + 'T00:00:00').getTime() : -Infinity;
            var b = to ? new Date(to + 'T23:59:59.999').getTime() : Infinity;
            return [a, b];
        }
        default: return null;
    }
}

function classGradesBand(pct, t) {
    if (pct == null || !isFinite(pct)) return 'none';
    return pct >= t.green ? 'green' : pct >= t.orange ? 'orange' : 'red';
}

/** Whether a task passes the filter. */
function classGradesTaskShown(task, status, grade, f, t, now) {
    if (f.status.length && f.status.indexOf(status.kind) < 0) return false;
    if (f.grade.length && f.grade.indexOf(classGradesBand(grade.pct, t)) < 0) return false;
    var lo = String(f.min) === '' ? null : Number(f.min), hi = String(f.max) === '' ? null : Number(f.max);
    if ((lo != null || hi != null) && (grade.pct == null || (lo != null && grade.pct < lo) || (hi != null && grade.pct > hi))) return false;
    var win = classGradesDateWindow(f, now);
    if (win) {
        if (!task.due) { if (!f.noDue) return false; }
        else {
            var due = new Date(task.due).getTime();
            if (due < win[0] || due > win[1]) return false;
        }
    }
    // When it was handed in — a late one by when it came, not when it was due.
    var subWin = classGradesDateWindow(f, now, 'sub');
    if (subWin) {
        if (!task.submittedAt) { if (f.noSub === false) return false; }
        else {
            var at = new Date(task.submittedAt).getTime();
            if (at < subWin[0] || at > subWin[1]) return false;
        }
    }
    var q = String(f.q || '').trim().toLowerCase();
    if (q && String(task.name).toLowerCase().indexOf(q) < 0) return false;
    return true;
}

/** The report, class by class: each class's line, its tasks' lines, its summary. */
function classGradesReportModel(snapshot, opts) {
    var t = opts.thresholds;
    var now = opts.now;
    var f = opts.filter || CLASS_GRADES_NO_FILTER;
    var newest = f.sort !== 'oldest';
    var week = now + 7 * 86400000;
    var courses = (snapshot.courses || []).slice().sort(function(a, b) {
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });
    return classGradesArrange(courses.map(function(c) {
        var counts = { missing: 0, late: 0, week: 0 };
        var lines = [];
        // By due date, newest first unless asked otherwise; no due date last either way.
        var tasks = (c.tasks || []).slice().sort(function(a, b) {
            if (!a.due || !b.due) return (a.due ? 0 : 1) - (b.due ? 0 : 1) || a.name.localeCompare(b.name);
            var d = new Date(a.due).getTime() - new Date(b.due).getTime();
            return (newest ? -d : d) || a.name.localeCompare(b.name);
        });
        tasks.forEach(function(task) {
            var status = classGradesTaskStatus(task, now);
            var due = task.due ? new Date(task.due).getTime() : null;
            if (status.kind === 'missing') counts.missing++;
            if (status.kind === 'late') counts.late++;
            if (status.kind === 'upcoming' && due != null && due >= now && due <= week) counts.week++;
            // The summary counts every task; the filter decides which are listed.
            var g = classGradesTaskGrade(task);
            if (!classGradesTaskShown(task, status, g, f, t, now)) return;
            lines.push(classGradesSquare(g.pct, t) + ' ' + task.name + ' - ' + g.text + ' - ' +
                status.icon + ' ' + status.text + ' - ' + (task.due ? 'Due ' + classGradesDate(task.due) : 'No due date'));
        });
        var change;
        if (c.score == null || c.previous == null) change = c.previous === undefined ? 'First check.' : 'No grade to compare.';
        else {
            var d = classGradesRound(c.score - c.previous);
            change = d > 0 ? 'Grade up ' + d + ' since last check.' : d < 0 ? 'Grade down ' + Math.abs(d) + ' since last check.' : 'No change since last check.';
        }
        return {
            id: String(c.id),
            head: classGradesSquare(c.score, t) + ' ' + c.name + ' - ' + classGradesClassGrade(c, opts.scale),
            letterFrom: classGradesClassGradeOf(c, opts.scale).from,
            name: c.name,
            score: c.score,
            missing: counts.missing,
            late: counts.late,
            // Read before each class kept its own time: the report's time is the class's.
            refreshedAt: c.refreshedAt || snapshot.fetchedAt || null,
            taskCount: tasks.length,
            shown: lines.length,
            lines: lines,
            summary: 'Missing ' + counts.missing + ', late ' + counts.late + ', ' + counts.week + ' due this week. ' + change
        };
    }), opts.prefs, opts.showHidden);
}

// =============================================
// CLASS ORDER
// =============================================

/**
 * How one student's classes are ordered, which are pinned to the top and which are
 * left out — by class id, so a renamed course keeps its place; per student, since
 * brothers and sisters do not share classes. Kept with the tool: no grades in it.
 * Until an order of one's own is made, classes go by name.
 */
function classGradesClassPrefs(custom, studentId) {
    var all = custom.cgClassOrder && typeof custom.cgClassOrder === 'object' ? custom.cgClassOrder : {};
    var p = all[String(studentId)] || {};
    var ids = function(list) { return Array.isArray(list) ? list.map(String) : []; };
    var order = ids(p.order);
    var mode = ['mine', 'name', 'grade', 'missing'].indexOf(p.mode) >= 0 ? p.mode : (order.length ? 'mine' : 'name');
    return { mode: mode, order: order, pinned: ids(p.pinned), hidden: ids(p.hidden) };
}

/** Classes in the order asked for: pinned first, the rest by the chosen sort; hidden left out. */
function classGradesArrange(model, prefs, showHidden) {
    if (!prefs) return model;
    var byName = function(a, b) { return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }); };
    var rank = function(m) { var i = prefs.order.indexOf(m.id); return i < 0 ? Infinity : i; };
    var sorts = {
        name: byName,
        mine: function(a, b) { return (rank(a) - rank(b)) || byName(a, b); },
        // No grade is not a low grade: those go last.
        grade: function(a, b) {
            var x = a.score == null ? Infinity : a.score, y = b.score == null ? Infinity : b.score;
            return (x - y) || byName(a, b);
        },
        missing: function(a, b) { return (b.missing - a.missing) || (b.late - a.late) || byName(a, b); }
    };
    var sort = sorts[prefs.mode] || byName;
    var pinned = function(m) { return prefs.pinned.indexOf(m.id) >= 0; };
    return model.filter(function(m) { return showHidden || prefs.hidden.indexOf(m.id) < 0; })
        .sort(function(a, b) { return (pinned(b) - pinned(a)) || sort(a, b); });
}

/** The report as text, for one student: every task, folded or not. */
function classGradesReportText(snapshot, opts) {
    var filtering = opts.filter && classGradesFilterCount(opts.filter) > 0;
    var model = classGradesReportModel(snapshot, opts).filter(function(m) { return !filtering || m.shown; });
    if (filtering && !model.length) return 'No tasks match the filters.';
    if (!model.length) return 'No active classes found.';
    return model.map(function(m) {
        return [m.head].concat(m.lines.map(function(l) { return '    ' + l; })).concat([m.summary]).join('\n');
    }).join('\n\n');
}

function classGradesEscape(s) {
    return String(s).replace(/[&<>"]/g, function(ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; });
}

/** When, the way a person says it: today 7:04 AM, yesterday 6:10 PM, Oct 25, 3:00 PM. */
function classGradesWhen(at, now) {
    var time = new Date(at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    var day = function(t) { var d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
    var days = Math.round((day(now) - day(at)) / 86400000);
    if (days === 0) return 'today ' + time;
    if (days === 1) return 'yesterday ' + time;
    return new Date(at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

/** The text Copy copies: what the report says, with every class's tasks. */
function classGradesWidgetText(widget) {
    return widget.dataset.reportText || '';
}

function classGradesSetStatus(widget, text, isError) {
    var el = widget.querySelector('.cg-status');
    el.textContent = text;
    el.classList.toggle('error', !!isError);
}

/** One class, folding: its line, task count, when it was read, ↻, summary, tasks. */
function classGradesClassHtml(m, isOpen, filtering, now, withSummary) {
    return '<details class="cg-class" data-course="' + classGradesEscape(m.id) + '"' + (isOpen ? ' open' : '') + '>' +
        '<summary' + (m.letterFrom ? ' title="' + (m.letterFrom === 'course' ? 'Letter from the course’s grading scheme'
            : 'Letter from the scale in the connection settings') + '"' : '') + '>' + classGradesEscape(m.head) + ' <span class="cg-count">\u00B7 ' +
            (filtering ? m.shown + ' of ' + m.taskCount : m.taskCount) + (m.taskCount === 1 ? ' task' : ' tasks') + '</span>' +
            (m.refreshedAt ? ' <span class="cg-refreshed' + (now - m.refreshedAt > 86400000 ? ' stale' : '') + '">\u00B7 refreshed ' +
                classGradesEscape(classGradesWhen(m.refreshedAt, now)) + '</span>' : '') +
            ' <button type="button" class="cg-class-refresh" aria-label="Refresh ' + classGradesEscape(m.name) + '" title="Refresh this class' +
            (m.refreshedAt ? ' \u00B7 refreshed ' + classGradesEscape(new Date(m.refreshedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })) : '') +
            '" onclick="classGradesRefreshClass(this, event)">\u21BB</button>' +
            (withSummary ? '<span class="cg-class-summary">' + classGradesEscape(m.summary) + '</span>' : '') + '</summary>' +
        '<div class="cg-tasks">' + (m.lines.length ? m.lines.map(classGradesEscape).join('\n') : '<span class="cg-count">No tasks.</span>') + '</div>' +
        '</details>';
}

/**
 * The Sections view: saved filters, one after another, in the order chosen. Each is
 * its own filters and order; a class appears in a section only with tasks that match
 * it. Returns { html, text }.
 */
function classGradesSectionsReport(snap, custom, now, prefs, showHidden) {
    var saved = classGradesSaved(custom);
    var withSummary = custom.cgSectionSummaries === true;
    var html = [], text = [];
    classGradesSections(custom).forEach(function(name) {
        var preset = saved.find(function(s) { return s.name === name; });
        if (!preset) return;
        var opts = { thresholds: classGradesThresholdValues(custom), scale: classGradesScale(custom), now: now, filter: classGradesFilter({ cgFilter: preset.filter }),
            prefs: prefs, showHidden: showHidden };
        var model = classGradesReportModel(snap, opts).filter(function(m) { return m.shown; });
        var tasks = model.reduce(function(n, m) { return n + m.shown; }, 0);
        var count = model.length ? tasks + (tasks === 1 ? ' task' : ' tasks') + ' in ' + model.length + (model.length === 1 ? ' class' : ' classes') : 'Nothing here';
        html.push('<details class="cg-section" open data-section="' + classGradesEscape(name) + '">' +
            '<summary class="cg-section-head">' + classGradesEscape(name) + ' <span class="cg-count">(' + count + ')</span></summary>' +
            (model.length ? model.map(function(m) { return classGradesClassHtml(m, true, true, now, withSummary); }).join('')
                : '<div class="cg-count cg-section-empty">Nothing here.</div>') +
            '</details>');
        var block = [name + '  (' + count + ')'];
        model.forEach(function(m) {
            block.push('  ' + m.head);
            m.lines.forEach(function(l) { block.push('      ' + l); });
            if (withSummary) block.push('  ' + m.summary);
        });
        text.push(block.join('\n'));
    });
    if (!html.length) {
        return { html: '<div class="cg-count">No sections yet: open Filters and add saved filters as sections.</div>', text: '' };
    }
    return { html: html.join(''), text: text.join('\n\n') };
}

function classGradesRender(widget) {
    var toolId = classGradesToolId(widget);
    var custom = classGradesCustom(toolId);
    var data = classGradesData(toolId);
    var select = widget.querySelector('.cg-student');
    var students = data.students || [];
    select.innerHTML = students.map(function(s) {
        return '<option value="' + String(s.id).replace(/"/g, '&quot;') + '">' + String(s.name).replace(/[&<>]/g, function(ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]; }) + '</option>';
    }).join('');
    select.hidden = students.length < 2;
    var studentId = custom.cgStudent != null && students.some(function(s) { return String(s.id) === String(custom.cgStudent); })
        ? String(custom.cgStudent) : (students[0] ? String(students[0].id) : '');
    select.value = studentId;
    var snap = (data.snapshots || {})[studentId];
    var report = widget.querySelector('.cg-report');
    if (!snap) {
        report.textContent = '';
        widget.dataset.reportText = '';
        return;
    }
    var student = students.find(function(s) { return String(s.id) === studentId; });
    var prefs = classGradesClassPrefs(custom, studentId);
    var showHidden = widget.dataset.showHidden === '1';
    var hiddenHere = (snap.courses || []).filter(function(c) { return prefs.hidden.indexOf(String(c.id)) >= 0; }).length;
    var hiddenNote = hiddenHere ? '<div class="cg-hidden-note">' + hiddenHere + (hiddenHere === 1 ? ' class' : ' classes') +
        (showHidden ? ' hidden by you, shown for now. ' : ' hidden by you. ') +
        '<button type="button" class="cg-link cg-show-hidden" onclick="classGradesToggleHidden(this)">' + (showHidden ? 'Hide them' : 'Show them') + '</button></div>' : '';
    classGradesShowClassOrder(widget, snap, prefs);
    if (custom.cgView === 'sections') {
        var who = data.observer && student ? student.name : '';
        var sections = classGradesSectionsReport(snap, custom, Date.now(), prefs, showHidden);
        widget.dataset.reportText = (who ? who + '\n\n' : '') + sections.text;
        report.innerHTML = (who ? '<div class="cg-student-name">' + classGradesEscape(who) + '</div>' : '') + sections.html + hiddenNote;
        if (!widget.querySelector('.cg-status').classList.contains('error')) {
            classGradesSetStatus(widget, 'Updated ' + new Date(snap.fetchedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) +
                (snap.route === 'proxy' ? ' \u00B7 via the board\u2019s proxy' : ''));
        }
        return;
    }
    var filter = classGradesFilter(custom);
    var filtering = classGradesFilterCount(filter) > 0;
    var opts = { thresholds: classGradesThresholdValues(custom), scale: classGradesScale(custom), now: Date.now(), filter: filter, prefs: prefs, showHidden: showHidden };
    var all = classGradesReportModel(snap, opts);
    // Filtering, a class with nothing that matches is left out, and said to be.
    var model = filtering ? all.filter(function(m) { return m.shown; }) : all;
    var hidden = all.length - model.length;
    var name = data.observer && student ? student.name : '';
    widget.dataset.reportText = (name ? name + '\n\n' : '') + classGradesReportText(snap, opts);
    // Each class folds; folded is how they start, and which are open is kept per student.
    // Filtering, the classes left are open: the matching tasks are what was asked for.
    var open = ((data.open || {})[studentId]) || [];
    report.innerHTML = (name ? '<div class="cg-student-name">' + classGradesEscape(name) + '</div>' : '') +
        (model.length ? model.map(function(m) {
            return classGradesClassHtml(m, filtering || open.indexOf(m.id) >= 0, filtering, opts.now, true);
        }).join('') : (filtering ? 'No tasks match the filters.' : 'No active classes found.')) +
        (filtering && hidden && model.length ? '<div class="cg-hidden-note">' + hidden + (hidden === 1 ? ' class' : ' classes') +
            ' with no matching tasks hidden.</div>' : '') + hiddenNote;
    report.querySelectorAll('.cg-class').forEach(function(d) {
        d.addEventListener('toggle', function() { classGradesKeepOpen(widget); });
    });
    if (!widget.querySelector('.cg-status').classList.contains('error')) {
        classGradesSetStatus(widget, 'Updated ' + new Date(snap.fetchedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) +
            (snap.route === 'proxy' ? ' · via the board’s proxy' : ''));
    }
}

// =============================================
// ACTIONS
// =============================================

function classGradesConnect(btn) {
    var widget = btn.closest('.cg-widget');
    var toolId = classGradesToolId(widget);
    var base = classGradesNormalizeBase(widget.querySelector('.cg-base').value);
    if (!base) { classGradesSetStatus(widget, 'Enter the school’s web address, like https://school.example.org.', true); return; }
    widget.querySelector('.cg-base').value = base;
    var typed = widget.querySelector('.cg-token').value.trim();
    var remember = widget.querySelector('.cg-remember').checked;
    if (typed) {
        _classGradesTokens[toolId] = typed;
        widget.querySelector('.cg-token').value = '';
    }
    var token = classGradesGetToken(toolId);
    try {
        if (remember && token) localStorage.setItem(classGradesTokenKey(toolId), token);
        else localStorage.removeItem(classGradesTokenKey(toolId));
    } catch (e) { /* kept in memory regardless */ }
    if (classGradesCustom(toolId).cgBase !== base) {
        delete _classGradesRoute[toolId];
        classGradesSaveData(toolId, {});
    }
    classGradesSaveCustom(toolId, { cgBase: base });
    if (!token) { classGradesSetStatus(widget, 'Paste an access token.', true); return; }
    widget.querySelector('.cg-connection').open = false;
    classGradesRefresh(btn);
}

function classGradesForget(btn) {
    var widget = btn.closest('.cg-widget');
    var toolId = classGradesToolId(widget);
    delete _classGradesTokens[toolId];
    try { localStorage.removeItem(classGradesTokenKey(toolId)); } catch (e) { /* nothing to remove */ }
    widget.querySelector('.cg-token').value = '';
    widget.querySelector('.cg-remember').checked = false;
    classGradesSetStatus(widget, 'Token forgotten.');
}

async function classGradesRefresh(btn) {
    var widget = btn.closest('.cg-widget');
    var toolId = classGradesToolId(widget);
    var custom = classGradesCustom(toolId);
    var token = classGradesGetToken(toolId);
    if (!custom.cgBase || !token) {
        widget.querySelector('.cg-connection').open = true;
        classGradesSetStatus(widget, custom.cgBase ? 'Paste an access token, then Connect.' : 'Enter the school’s address and a token, then Connect.', true);
        return;
    }
    var buttons = widget.querySelectorAll('.cg-btn');
    buttons.forEach(function(b) { b.disabled = true; });
    classGradesSetStatus(widget, 'Reading…');
    try {
        var who = await classGradesStudents(toolId, custom.cgBase, token);
        var data = classGradesData(toolId);
        var studentId = custom.cgStudent != null && who.students.some(function(s) { return String(s.id) === String(custom.cgStudent); })
            ? String(custom.cgStudent) : String(who.students[0].id);
        var courses = await classGradesFetch(toolId, custom.cgBase, token, who, studentId);
        // What each class stood at last time, so the summary can say how it moved.
        var last = (data.lastScores || {})[studentId] || {};
        courses.forEach(function(c) { c.previous = Object.prototype.hasOwnProperty.call(last, c.id) ? last[c.id] : undefined; });
        var nextLast = {};
        courses.forEach(function(c) { nextLast[c.id] = c.score; });
        data.observer = who.observer;
        data.students = who.students;
        data.snapshots = data.snapshots || {};
        var at = Date.now();
        courses.forEach(function(c) { c.refreshedAt = at; });
        data.snapshots[studentId] = { fetchedAt: at, route: _classGradesRoute[toolId] || 'direct', courses: courses };
        data.lastScores = data.lastScores || {};
        data.lastScores[studentId] = nextLast;
        classGradesSaveData(toolId, data);
        classGradesSetStatus(widget, '');
        classGradesRender(widget);
    } catch (e) {
        classGradesSetStatus(widget, e.message || String(e), true);
    } finally {
        buttons.forEach(function(b) { b.disabled = false; });
    }
}

function classGradesPickStudent(sel) {
    var widget = sel.closest('.cg-widget');
    var toolId = classGradesToolId(widget);
    classGradesSaveCustom(toolId, { cgStudent: sel.value });
    var data = classGradesData(toolId);
    classGradesSetStatus(widget, '');
    if ((data.snapshots || {})[sel.value]) classGradesRender(widget);
    else classGradesRefresh(sel);
}

/** Put a filter into the controls. */
function classGradesShowFilter(widget, f) {
    widget.querySelectorAll('.cg-chip').forEach(function(b) {
        b.setAttribute('aria-pressed', String((f[b.dataset.group] || []).indexOf(b.dataset.value) >= 0));
    });
    widget.querySelector('.cg-min').value = f.min;
    widget.querySelector('.cg-max').value = f.max;
    widget.querySelector('.cg-date').value = f.date;
    widget.querySelector('.cg-from').value = f.from;
    widget.querySelector('.cg-to').value = f.to;
    widget.querySelector('.cg-from').hidden = widget.querySelector('.cg-to').hidden = f.date !== 'custom';
    widget.querySelector('.cg-nodue').checked = f.noDue !== false;
    widget.querySelector('.cg-sub').value = f.sub || 'any';
    widget.querySelector('.cg-sub-from').value = f.subFrom || '';
    widget.querySelector('.cg-sub-to').value = f.subTo || '';
    widget.querySelector('.cg-sub-from').hidden = widget.querySelector('.cg-sub-to').hidden = f.sub !== 'custom';
    widget.querySelector('.cg-nosub').checked = f.noSub !== false;
    widget.querySelector('.cg-q').value = f.q;
    widget.querySelector('.cg-sort').value = f.sort === 'oldest' ? 'oldest' : 'newest';
    var n = classGradesFilterCount(f);
    widget.querySelector('.cg-filter-count').textContent = n ? '(' + n + ')' : '';
    classGradesShowSaved(widget, f);
    classGradesShowSections(widget);
}

// =============================================
// CLASS ORDER: THE CONTROLS
// =============================================

/** The Classes row and the Arrange list, for the classes this student has. */
function classGradesShowClassOrder(widget, snap, prefs) {
    widget.querySelector('.cg-class-sort').value = prefs.mode;
    var list = widget.querySelector('.cg-class-order');
    if (list.hidden) return;
    // Every class, hidden ones too, in the order the report would show them.
    var all = classGradesArrange((snap.courses || []).map(function(c) {
        return { id: String(c.id), name: c.name, score: c.score, missing: 0, late: 0 };
    }), Object.assign({}, prefs, { mode: prefs.mode }), true);
    list.innerHTML = all.map(function(m, i) {
        var n = classGradesEscape(m.name);
        var pin = prefs.pinned.indexOf(m.id) >= 0, hid = prefs.hidden.indexOf(m.id) >= 0;
        return '<li data-course="' + classGradesEscape(m.id) + '"' + (hid ? ' class="hidden-class"' : '') + '>' +
            '<button type="button" aria-label="Pin ' + n + '" aria-pressed="' + pin + '" onclick="classGradesClassPin(this)">\u2605</button>' +
            '<button type="button" aria-label="Move ' + n + ' up" onclick="classGradesClassMove(this, -1)"' + (i === 0 ? ' disabled' : '') + '>\u2191</button>' +
            '<button type="button" aria-label="Move ' + n + ' down" onclick="classGradesClassMove(this, 1)"' + (i === all.length - 1 ? ' disabled' : '') + '>\u2193</button>' +
            '<button type="button" aria-label="Hide ' + n + '" aria-pressed="' + hid + '" onclick="classGradesClassHide(this)">\u2298</button>' +
            '<span class="cg-co-name">' + n + '</span></li>';
    }).join('');
}

function classGradesSaveClassPrefs(widget, prefs) {
    var toolId = classGradesToolId(widget);
    var custom = classGradesCustom(toolId);
    var studentId = widget.querySelector('.cg-student').value;
    var all = Object.assign({}, custom.cgClassOrder && typeof custom.cgClassOrder === 'object' ? custom.cgClassOrder : {});
    all[studentId] = { mode: prefs.mode, order: prefs.order, pinned: prefs.pinned, hidden: prefs.hidden };
    classGradesSaveCustom(toolId, { cgClassOrder: all });
    classGradesRender(widget);
}

function classGradesPrefsOf(widget) {
    return classGradesClassPrefs(classGradesCustom(classGradesToolId(widget)), widget.querySelector('.cg-student').value);
}

function classGradesClassSort(sel) {
    var widget = sel.closest('.cg-widget');
    classGradesSaveClassPrefs(widget, Object.assign(classGradesPrefsOf(widget), { mode: sel.value }));
}

function classGradesArrangeToggle(btn) {
    var widget = btn.closest('.cg-widget');
    var list = widget.querySelector('.cg-class-order');
    list.hidden = !list.hidden;
    btn.setAttribute('aria-expanded', String(!list.hidden));
    classGradesRender(widget);
}

/** Moving a class makes the order one's own: what is shown now, with this one moved. */
function classGradesClassMove(btn, by) {
    var widget = btn.closest('.cg-widget');
    var prefs = classGradesPrefsOf(widget);
    var ids = Array.from(widget.querySelectorAll('.cg-class-order li')).map(function(li) { return li.dataset.course; });
    var id = btn.closest('li').dataset.course;
    var i = ids.indexOf(id), j = i + by;
    if (i < 0 || j < 0 || j >= ids.length) return;
    ids.splice(j, 0, ids.splice(i, 1)[0]);
    // Pinned stay on top whatever the order, so the order kept is the one seen.
    classGradesSaveClassPrefs(widget, Object.assign(prefs, { mode: 'mine', order: ids }));
    var row = widget.querySelector('.cg-class-order li[data-course="' + CSS.escape(id) + '"]');
    var same = row && row.querySelectorAll('button')[by < 0 ? 1 : 2];
    if (same) (same.disabled ? row.querySelector('button:not([disabled])') : same).focus();
}

function classGradesToggleIn(list, id) {
    return list.indexOf(id) >= 0 ? list.filter(function(x) { return x !== id; }) : list.concat([id]);
}

function classGradesClassPin(btn) {
    var widget = btn.closest('.cg-widget');
    var prefs = classGradesPrefsOf(widget);
    var id = btn.closest('li').dataset.course;
    classGradesSaveClassPrefs(widget, Object.assign(prefs, { pinned: classGradesToggleIn(prefs.pinned, id) }));
    var again = widget.querySelector('.cg-class-order li[data-course="' + CSS.escape(id) + '"] button');
    if (again) again.focus();
}

function classGradesClassHide(btn) {
    var widget = btn.closest('.cg-widget');
    var prefs = classGradesPrefsOf(widget);
    var id = btn.closest('li').dataset.course;
    classGradesSaveClassPrefs(widget, Object.assign(prefs, { hidden: classGradesToggleIn(prefs.hidden, id) }));
    var again = widget.querySelector('.cg-class-order li[data-course="' + CSS.escape(id) + '"] button[aria-label^="Hide"]');
    if (again) again.focus();
}

function classGradesToggleHidden(btn) {
    var widget = btn.closest('.cg-widget');
    widget.dataset.showHidden = widget.dataset.showHidden === '1' ? '' : '1';
    classGradesRender(widget);
}

// =============================================
// SECTIONS
// =============================================

/** The sections chosen, by saved-filter name, in order — only those still saved. */
function classGradesSections(custom) {
    var names = classGradesSaved(custom).map(function(s) { return s.name; });
    return (Array.isArray(custom.cgSections) ? custom.cgSections : []).filter(function(n, i, all) {
        return names.indexOf(n) >= 0 && all.indexOf(n) === i;
    });
}

function classGradesShowSections(widget) {
    var custom = classGradesCustom(classGradesToolId(widget));
    var on = custom.cgView === 'sections';
    widget.querySelector('.cg-view').value = on ? 'sections' : 'single';
    widget.querySelector('.cg-sections-label').hidden = !on;
    widget.querySelector('.cg-sections-editor').hidden = !on;
    widget.querySelector('.cg-sections-hint').hidden = !on;
    // The single filter's own controls stay — they are where saved filters are made.
    var chosen = classGradesSections(custom);
    var list = widget.querySelector('.cg-sections-list');
    list.innerHTML = chosen.map(function(name, i) {
        var n = classGradesEscape(name);
        return '<li data-name="' + n + '">' + n +
            '<button type="button" aria-label="Move ' + n + ' up" onclick="classGradesSectionMove(this, -1)"' + (i === 0 ? ' disabled' : '') + '>\u2191</button>' +
            '<button type="button" aria-label="Move ' + n + ' down" onclick="classGradesSectionMove(this, 1)"' + (i === chosen.length - 1 ? ' disabled' : '') + '>\u2193</button>' +
            '<button type="button" aria-label="Remove ' + n + '" onclick="classGradesSectionRemove(this)">\u00D7</button></li>';
    }).join('') || '<li class="cg-count">None yet.</li>';
    var left = classGradesSaved(custom).filter(function(s) { return chosen.indexOf(s.name) < 0; });
    widget.querySelector('.cg-add-section').innerHTML = '<option value="">' +
        (left.length ? 'Add section\u2026' : classGradesSaved(custom).length ? 'Every saved filter is a section' : 'Save a filter first') + '</option>' +
        left.map(function(s) { return '<option value="' + classGradesEscape(s.name) + '">' + classGradesEscape(s.name) + '</option>'; }).join('');
    widget.querySelector('.cg-add-section').disabled = !left.length;
    widget.querySelector('.cg-section-summaries').checked = custom.cgSectionSummaries === true;
}

function classGradesSetSections(widget, names, note) {
    classGradesSaveCustom(classGradesToolId(widget), { cgSections: names });
    classGradesShowSections(widget);
    widget.querySelector('.cg-sections-note').textContent = note || '';
    classGradesRender(widget);
}

function classGradesSetView(sel) {
    var widget = sel.closest('.cg-widget');
    classGradesSaveCustom(classGradesToolId(widget), { cgView: sel.value === 'sections' ? 'sections' : 'single' });
    classGradesShowSections(widget);
    classGradesRender(widget);
}

function classGradesSectionAdd(sel) {
    var widget = sel.closest('.cg-widget');
    var custom = classGradesCustom(classGradesToolId(widget));
    if (!sel.value) return;
    classGradesSetSections(widget, classGradesSections(custom).concat([sel.value]));
}

function classGradesSectionMove(btn, by) {
    var widget = btn.closest('.cg-widget');
    var names = classGradesSections(classGradesCustom(classGradesToolId(widget)));
    var i = names.indexOf(btn.closest('li').dataset.name);
    var j = i + by;
    if (i < 0 || j < 0 || j >= names.length) return;
    names.splice(j, 0, names.splice(i, 1)[0]);
    classGradesSetSections(widget, names);
    // The keyboard stays with the section it moved.
    var row = Array.from(widget.querySelectorAll('.cg-sections-list li')).find(function(li) { return li.dataset.name === names[j]; });
    var same = row && row.querySelectorAll('button')[by < 0 ? 0 : 1];
    if (same) (same.disabled ? row.querySelector('button:not([disabled])') : same).focus();
}

function classGradesSectionRemove(btn) {
    var widget = btn.closest('.cg-widget');
    var name = btn.closest('li').dataset.name;
    classGradesSetSections(widget, classGradesSections(classGradesCustom(classGradesToolId(widget))).filter(function(n) { return n !== name; }));
}

function classGradesSectionSummaries(cb) {
    var widget = cb.closest('.cg-widget');
    classGradesSaveCustom(classGradesToolId(widget), { cgSectionSummaries: cb.checked });
    classGradesRender(widget);
}

// =============================================
// SAVED FILTERS
// =============================================

/**
 * Filters kept under a name: `cgSavedFilters`, `[{ name, filter }]`, with the tool —
 * filter choices only, sort order included, nothing about anyone's grades.
 */
function classGradesSaved(custom) {
    return Array.isArray(custom.cgSavedFilters) ? custom.cgSavedFilters.filter(function(s) {
        return s && typeof s.name === 'string' && s.filter && typeof s.filter === 'object';
    }) : [];
}

/** A filter as one string, so two can be compared whatever order their parts are in. */
function classGradesFilterKey(f) {
    var n = classGradesFilter({ cgFilter: f });
    return JSON.stringify({
        status: n.status.slice().sort(), grade: n.grade.slice().sort(), min: String(n.min), max: String(n.max),
        date: n.date, from: n.date === 'custom' ? n.from : '', to: n.date === 'custom' ? n.to : '',
        noDue: n.noDue !== false,
        sub: n.sub || 'any', subFrom: n.sub === 'custom' ? n.subFrom : '', subTo: n.sub === 'custom' ? n.subTo : '',
        noSub: n.noSub !== false,
        q: String(n.q || '').trim(), sort: n.sort === 'oldest' ? 'oldest' : 'newest'
    });
}

/**
 * The saved set the current filters are, if any. Two sets can hold the same filters;
 * then the one last picked or saved here is the one meant.
 */
function classGradesCurrentSaved(custom, f, prefer) {
    var key = classGradesFilterKey(f);
    var saved = classGradesSaved(custom);
    var matches = saved.filter(function(s) { return classGradesFilterKey(s.filter) === key; });
    return matches.find(function(s) { return s.name === prefer; }) || matches[0] || null;
}

/** The Saved menu: every set by name, "All tasks", and "Unsaved" while what is shown is neither. */
function classGradesShowSaved(widget, f) {
    var custom = classGradesCustom(classGradesToolId(widget));
    var saved = classGradesSaved(custom);
    var current = classGradesCurrentSaved(custom, f, widget.dataset.savedPick);
    var none = classGradesFilterCount(f) === 0;
    var sel = widget.querySelector('.cg-saved');
    sel.innerHTML = '<option value="">All tasks</option>' + saved.map(function(s) {
        return '<option value="' + classGradesEscape(s.name) + '">' + classGradesEscape(s.name) + '</option>';
    }).join('') + (!current && !none ? '<option value="__unsaved__" disabled>Unsaved</option>' : '');
    sel.value = current ? current.name : none ? '' : '__unsaved__';
    sel.hidden = !saved.length && none;
    widget.querySelector('.cg-rename').disabled = !current;
    widget.querySelector('.cg-delete').disabled = !current;
    widget.querySelector('.cg-delete').textContent = 'Delete';
    delete widget.dataset.deleteArmed;
}

function classGradesPickSaved(sel) {
    var widget = sel.closest('.cg-widget');
    var custom = classGradesCustom(classGradesToolId(widget));
    var chosen = classGradesSaved(custom).find(function(s) { return s.name === sel.value; });
    widget.dataset.savedPick = chosen ? chosen.name : '';
    var f = chosen ? classGradesFilter({ cgFilter: chosen.filter }) : Object.assign({}, CLASS_GRADES_NO_FILTER,
        { sort: widget.querySelector('.cg-sort').value });
    classGradesShowFilter(widget, f);
    classGradesFiltersChanged(sel);
}

function classGradesSaveStart(btn, mode) {
    var widget = btn.closest('.cg-widget');
    var form = widget.querySelector('.cg-save-form');
    var input = widget.querySelector('.cg-save-name');
    widget.dataset.saveMode = mode;
    delete widget.dataset.replaceArmed;
    widget.querySelector('.cg-save-ok').textContent = mode === 'rename' ? 'Rename' : 'Save';
    widget.querySelector('.cg-save-msg').textContent = '';
    var custom = classGradesCustom(classGradesToolId(widget));
    var current = classGradesCurrentSaved(custom, classGradesFilter(custom), widget.dataset.savedPick);
    input.value = mode === 'rename' && current ? current.name : '';
    form.hidden = false;
    input.focus();
    input.select();
}

function classGradesSaveCancel(el) {
    var widget = el.closest('.cg-widget');
    widget.querySelector('.cg-save-form').hidden = true;
    widget.querySelector('.cg-save-msg').textContent = '';
    delete widget.dataset.replaceArmed;
}

function classGradesSaveKey(event, input) {
    if (event.key === 'Enter') { event.preventDefault(); classGradesSaveCommit(input); }
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); classGradesSaveCancel(input); }
}

/**
 * Save the current filters under a name, or rename the set they are. A name already
 * taken by another set is replaced only when asked twice.
 */
function classGradesSaveCommit(el) {
    var widget = el.closest('.cg-widget');
    var toolId = classGradesToolId(widget);
    var custom = classGradesCustom(toolId);
    var name = widget.querySelector('.cg-save-name').value.trim();
    var msg = widget.querySelector('.cg-save-msg');
    if (!name) { msg.textContent = 'Give it a name.'; return; }
    var saved = classGradesSaved(custom).slice();
    var f = classGradesFilter(custom);
    var mode = widget.dataset.saveMode || 'save';
    var current = classGradesCurrentSaved(custom, f, widget.dataset.savedPick);
    var taken = saved.find(function(s) { return s.name === name && s !== current; });
    if (mode === 'rename' && !current) { classGradesSaveCancel(el); return; }
    if (taken && widget.dataset.replaceArmed !== name) {
        widget.dataset.replaceArmed = name;
        msg.textContent = '\u201C' + name + '\u201D exists. ' + (mode === 'rename' ? 'Rename' : 'Save') + ' again to replace it.';
        widget.querySelector('.cg-save-ok').textContent = 'Replace';
        return;
    }
    saved = saved.filter(function(s) { return s !== taken; });
    // Sections name saved filters, so a rename carries them along.
    var sections = classGradesSections(custom);
    if (mode === 'rename' && current) {
        sections = sections.map(function(n) { return n === current.name ? name : n; })
            .filter(function(n, i, all) { return all.indexOf(n) === i; });
    }
    if (mode === 'rename') {
        saved = saved.map(function(s) { return s === current ? { name: name, filter: s.filter } : s; });
    } else {
        saved = saved.filter(function(s) { return s.name !== name; });
        saved.push({ name: name, filter: JSON.parse(JSON.stringify(f)) });
    }
    saved.sort(function(a, b) { return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }); });
    classGradesSaveCustom(toolId, { cgSavedFilters: saved, cgSections: sections });
    widget.dataset.savedPick = name;
    classGradesSaveCancel(el);
    classGradesShowSaved(widget, f);
    classGradesShowSections(widget);
    classGradesRender(widget);
    msg.textContent = (mode === 'rename' ? 'Renamed to ' : 'Saved as ') + '\u201C' + name + '\u201D.';
}

/** Delete the set the current filters are: asked twice, so a slip does not lose it. */
function classGradesDeleteSaved(btn) {
    var widget = btn.closest('.cg-widget');
    var toolId = classGradesToolId(widget);
    var custom = classGradesCustom(toolId);
    var f = classGradesFilter(custom);
    var current = classGradesCurrentSaved(custom, f, widget.dataset.savedPick);
    if (!current) return;
    if (widget.dataset.deleteArmed !== current.name) {
        widget.dataset.deleteArmed = current.name;
        btn.textContent = 'Delete \u201C' + current.name + '\u201D?';
        return;
    }
    var wasSection = classGradesSections(custom).indexOf(current.name) >= 0;
    classGradesSaveCustom(toolId, {
        cgSavedFilters: classGradesSaved(custom).filter(function(s) { return s.name !== current.name; }),
        cgSections: classGradesSections(custom).filter(function(n) { return n !== current.name; })
    });
    classGradesShowSaved(widget, f);
    classGradesShowSections(widget);
    widget.querySelector('.cg-save-msg').textContent = 'Deleted \u201C' + current.name + '\u201D.';
    if (wasSection) widget.querySelector('.cg-sections-note').textContent = '\u201C' + current.name + '\u201D was a section, and is no longer.';
    classGradesRender(widget);
}

/** Read the filter back out of the controls, keep it, and show what it leaves. */
function classGradesFiltersChanged(el) {
    var widget = el.closest('.cg-widget');
    var chips = function(group) {
        return Array.from(widget.querySelectorAll('.cg-chip[data-group="' + group + '"][aria-pressed="true"]')).map(function(b) { return b.dataset.value; });
    };
    var f = {
        status: chips('status'),
        grade: chips('grade'),
        min: widget.querySelector('.cg-min').value,
        max: widget.querySelector('.cg-max').value,
        date: widget.querySelector('.cg-date').value,
        from: widget.querySelector('.cg-from').value,
        to: widget.querySelector('.cg-to').value,
        noDue: widget.querySelector('.cg-nodue').checked,
        sub: widget.querySelector('.cg-sub').value,
        subFrom: widget.querySelector('.cg-sub-from').value,
        subTo: widget.querySelector('.cg-sub-to').value,
        noSub: widget.querySelector('.cg-nosub').checked,
        q: widget.querySelector('.cg-q').value,
        sort: widget.querySelector('.cg-sort').value
    };
    classGradesSaveCustom(classGradesToolId(widget), { cgFilter: f });
    classGradesShowFilter(widget, f);
    classGradesRender(widget);
}

function classGradesChip(btn) {
    btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
    classGradesFiltersChanged(btn);
}

function classGradesClearFilters(btn) {
    var widget = btn.closest('.cg-widget');
    var sort = widget.querySelector('.cg-sort').value;
    classGradesShowFilter(widget, Object.assign({}, CLASS_GRADES_NO_FILTER, { sort: sort }));
    classGradesFiltersChanged(btn);
}

function classGradesThresholds(input) {
    var widget = input.closest('.cg-widget');
    var green = Number(widget.querySelector('.cg-green').value);
    var orange = Number(widget.querySelector('.cg-orange').value);
    if (!isFinite(green) || !isFinite(orange)) return;
    classGradesSaveCustom(classGradesToolId(widget), { cgGreen: green, cgOrange: Math.min(orange, green) });
    classGradesRender(widget);
}

/** A new letter scale, kept if it reads; the default one is not kept, so it can improve. */
function classGradesScaleChanged(input) {
    var widget = input.closest('.cg-widget');
    var msg = widget.querySelector('.cg-scale-msg');
    var scale = classGradesParseScale(input.value);
    if (!scale) {
        msg.textContent = 'Write it as letters and the lowest % for each: A 93, A- 90, B+ 87, …';
        msg.classList.add('error');
        return;
    }
    msg.textContent = 'The lowest % for each letter, used when a course has no grading scheme of its own.';
    msg.classList.remove('error');
    var text = scale.map(function(r) { return r.letter + ' ' + r.min; }).join(', ');
    input.value = text;
    classGradesSaveCustom(classGradesToolId(widget), { cgScale: text === CLASS_GRADES_SCALE ? undefined : text });
    classGradesRender(widget);
}

function classGradesKeepOpen(widget) {
    var toolId = classGradesToolId(widget);
    // Opened by a filter, or in a section, is not opened by hand: what is kept is the reader's own.
    var kept = classGradesCustom(toolId);
    if (kept.cgView === 'sections' || classGradesFilterCount(classGradesFilter(kept)) > 0) return;
    var studentId = widget.querySelector('.cg-student').value;
    var data = classGradesData(toolId);
    data.open = data.open || {};
    data.open[studentId] = Array.from(widget.querySelectorAll('.cg-class[open]')).map(function(d) { return d.dataset.course; });
    classGradesSaveData(toolId, data);
}

function classGradesFoldAll(btn, open) {
    var widget = btn.closest('.cg-widget');
    widget.querySelectorAll('.cg-class').forEach(function(d) { d.open = open; });
    classGradesKeepOpen(widget);
}

function classGradesCopy(btn) {
    var widget = btn.closest('.cg-widget');
    var text = classGradesWidgetText(widget);
    if (!text) return;
    if (typeof copyTextToClipboard === 'function') copyTextToClipboard(text, 'Report copied');
    else navigator.clipboard.writeText(text);
}

console.log('Class Grades plugin loaded');
