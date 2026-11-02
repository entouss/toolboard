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

/* Finance Planning */
.fp-widget { font-size: 12px; }
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
.fp-legend i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 4px; vertical-align: -1px; }
.fp-empty { padding: 10px; margin: 8px 0; background: var(--bg-secondary); border-radius: 4px; color: var(--text-secondary); display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
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
.calc-widget.fp-widget label.fp-check { display: inline-flex; align-items: center; gap: 4px; margin: 0; font-size: 11px; color: var(--text-secondary); white-space: nowrap; }
.calc-widget.fp-widget .fp-check input { width: auto; }
.fp-tax { display: flex; align-items: center; gap: 8px; margin-top: 6px; flex-wrap: wrap; }
.calc-widget.fp-widget .fp-tax select, .calc-widget.fp-widget .fp-into select { width: auto; padding: 3px 6px; font-size: 12px; }
.fp-payroll { margin-top: 4px; color: var(--text-secondary); }
.fp-draw-head { margin: 6px 0 2px; color: var(--text-secondary); font-size: 11px; }
.fp-table.fp-draw { width: auto; min-width: 360px; }
.fp-draw-n { color: var(--text-muted); margin: 0 4px 0 2px; }
.fp-retire-out { margin-top: 6px; }
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
.fp-chart { width: 100%; height: auto; display: block; }
.fp-chart text { font-size: 10px; fill: var(--text-muted); }
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
.fp-chart .fp-hit:hover { fill: var(--text-muted); opacity: 0.08; }
.fp-legend .fp-key-net { background: #0072B2; height: 3px; }
.fp-legend .fp-key-assets { background: #009E73; height: 2px; }
.fp-legend .fp-key-liab { background: #D55E00; height: 2px; }
.fp-legend .fp-key-band { background: #0072B2; opacity: 0.25; }
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
    return { '2026': year };
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
            if (Object.keys(year).length) years[y] = year;
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
    widget.innerHTML =
        '<div class="tb-head"><label>Tax year <select class="tb-year" onchange="tbPickYear(this)">' +
            years.map(y => '<option value="' + y + '"' + (y === year ? ' selected' : '') + '>' + y + '</option>').join('') + '</select></label>' +
            '<button type="button" class="tb-btn" onclick="tbAddYear(this)" title="A new year, starting from a copy of the latest">+ Year</button>' +
            '<button type="button" class="tb-btn" onclick="tbDeleteYear(this)"' + (years.length < 2 ? ' disabled title="The last year cannot go"' : ' title="Delete this year’s brackets"') + '>Delete year</button>' +
            (builtin[year] ? '<button type="button" class="tb-btn tb-reset" onclick="tbResetYear(this)" title="Back to the built-in ' + year + ' figures">Reset year</button>' : '') +
        '</div>' +
        '<div class="tb-note">Shared by every board’s Tax Calculator, on this device.</div>' +
        Object.keys(TAX_STATUSES).map(status).join('');
    tbRefreshDerived(widget);
}

/** The To column and the problems, from what is in the fields — redrawn as they are
 *  typed into without touching the fields themselves. */
function tbRefreshDerived(widget) {
    const table = taxTableLoad();
    const year = widget.dataset.year;
    if (!table.years[year]) { tbRender(widget); return; }
    widget.querySelectorAll('.tb-status').forEach(el => {
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
        '<button type="button" class="tax-edit" onclick="taxOpenBrackets()">edit in Tax Brackets</button></div>';
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
    property: { label: 'Property', side: 'asset', rate: 3, color: '#E69F00' },
    other: { label: 'Other asset', side: 'asset', rate: 0, color: '#CC79A7' },
    loan: { label: 'Loan', side: 'liability', rate: 6.5, color: '#D55E00', tool: 'loan-calculator' },
    credit: { label: 'Credit card', side: 'liability', rate: 22, color: '#A6461A' }
};
// The kinds whose returns are uncertain enough to be shown as a range.
const FP_MARKET = ['investment', 'retirement'];

function fpDefaultPlan() {
    const returns = {};
    Object.keys(FP_KINDS).forEach(k => { returns[k] = FP_KINDS[k].rate; });
    return { accounts: [], incomes: [], expenses: [], tax: { on: true, status: 'single', year: '' }, surplusTo: '',
        assume: { years: 30, inflation: 2.5, real: true, spread: 2, target: 1000000, returns: returns },
        retire: { on: false, birth: '', ageYears: 65, ageMonths: 0, until: 95, spending: null, buffer: 6 }, drawOrder: [] };
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
    ['accounts', 'incomes', 'expenses'].forEach(k => { if (Array.isArray(saved[k])) plan[k] = saved[k].filter(x => x && typeof x === 'object').map(x => Object.assign({}, x)); });
    if (saved.tax) plan.tax = Object.assign(plan.tax, saved.tax);
    if (typeof saved.surplusTo === 'string') plan.surplusTo = saved.surplusTo;
    if (saved.retire) plan.retire = Object.assign(plan.retire, saved.retire);
    if (Array.isArray(saved.drawOrder)) plan.drawOrder = saved.drawOrder.filter(x => x && typeof x.id === 'string').map(x => ({ id: x.id }));
    // Every account that can be drawn from, in the order given and then the usual one —
    // so moving one is moving it in the whole list.
    plan.drawOrder = fpDrawOrder(plan).map(a => ({ id: a.id }));
    if (saved.assume) {
        const r = Object.assign({}, plan.assume.returns, saved.assume.returns || {});
        plan.assume = Object.assign(plan.assume, saved.assume, { returns: r });
    }
    return plan;
}

function fpSet(toolId, plan) {
    if (!toolId || typeof saveToolCustomizations !== 'function') return;
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
    const a = line.intoAccount && fpEntries(plan.accounts).find(x => x.id === line.intoAccount);
    return a && (FP_KINDS[a.kind] || FP_KINDS.other).side === 'asset' ? a : null;
}

function fpPayrollMonthlyOf(plan, a) {
    const n = fpPayrollNow(plan)[a.id];
    return n ? n.own + n.match : 0;
}

/** This month's pay into each account, from the lines running now: { id: { own, match } }. */
function fpPayrollNow(plan) {
    const ym = fpYm(new Date()), out = {};
    fpEntries(plan.incomes).forEach(l => {
        const a = fpPayrollTarget(plan, l);
        if (!a || !fpActive(l, ym)) return;
        const o = out[a.id] || (out[a.id] = { own: 0, match: 0 });
        o.own += fpPerMonth(l, 'intoAmount');
        o.match += fpPerMonth(l, 'match');
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
function fpFullRetirementMonths(birthYear) {
    if (birthYear <= 1937) return 65 * 12;
    if (birthYear <= 1942) return 65 * 12 + (birthYear - 1937) * 2;
    if (birthYear <= 1954) return 66 * 12;
    if (birthYear <= 1959) return 66 * 12 + (birthYear - 1954) * 2;
    return 67 * 12;
}

/** What claiming `claim` months old does to the benefit at full retirement age `fra`:
 *  5/9 of 1% less a month for the first 36 months early, 5/12 of 1% for each month
 *  before those; 2/3 of 1% more a month late, until 70. */
function fpClaimFactor(fra, claim) {
    claim = Math.max(62 * 12, Math.min(70 * 12, claim));
    if (claim < fra) {
        const early = fra - claim;
        return 1 - (Math.min(early, 36) * 5 / 9 + Math.max(0, early - 36) * 5 / 12) / 100;
    }
    return 1 + (claim - fra) * (2 / 3) / 100;
}

/** A Social Security line, worked out — or null without a birth month and a benefit. */
function fpSSInfo(line) {
    const m = /^(\d{4})-(\d{2})$/.exec(line.birth || '');
    const benefit = fpNum(line.fraBenefit, 0);
    if (!m || benefit <= 0) return null;
    const by = +m[1], bm = +m[2] - 1;
    const fra = fpFullRetirementMonths(by);
    const claim = Math.max(62 * 12, Math.min(70 * 12, Math.round(fpNum(line.claimYears, 67) * 12 + fpNum(line.claimMonths, 0))));
    const factor = fpClaimFactor(fra, claim);
    const start = new Date(by, bm + claim, 1);
    return { fra: fra, claim: claim, factor: factor, start: start, startYm: fpYm(start), monthlyToday: benefit * factor };
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

function fpEntries(list) { return (list || []).filter(x => x && !fpIsSection(x)); }

/** The plan with only its entries, for the sums. */
function fpCalc(plan) {
    if (!plan || plan._calc) return plan;
    return Object.assign({}, plan, { accounts: fpEntries(plan.accounts), incomes: fpEntries(plan.incomes), expenses: fpEntries(plan.expenses), _calc: true });
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

/** Federal income tax for a year's taxed income, from Tax Brackets, with every
 *  threshold and the deduction moved up by `index` (inflation since now). */
/** The brackets and deduction the plan's federal estimate uses, looked up once. */
function fpTaxInfo(plan) {
    if (!plan.tax || !plan.tax.on || typeof taxTableLoad !== 'function') return null;
    const table = taxTableLoad();
    const year = plan.tax.year && table.years[plan.tax.year] ? plan.tax.year : taxDefaultYear(table);
    const st = (table.years[year] || {})[plan.tax.status] || (table.years[year] || {}).single;
    return st ? { deduction: fpNum(st.deduction, 0), brackets: taxBracketsFor(st) } : null;
}

/** Federal tax on a year's taxed income, every threshold and the deduction moved up by
 *  `index` (inflation since now). */
function fpTaxWith(info, annual, index) {
    if (!info || annual <= 0) return 0;
    const taxable = Math.max(0, annual - info.deduction * index);
    let tax = 0;
    info.brackets.forEach(b => {
        const lo = b.min * index, hi = b.max * index;
        if (taxable > lo) tax += (Math.min(taxable, hi) - lo) * b.rate;
    });
    return tax;
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
// federal estimate, so enough more is drawn to pay that tax too; Roth and taxable
// accounts are drawn as they are. From 73 (75 for those born in 1960 or later) pre-tax
// accounts pay out at least the IRS minimum each year, and what is not needed goes to
// cash. Drawing pre-tax money before 59½ is said, not modelled: the 10% penalty
// depends on exceptions the plan does not know.

/** The IRS Uniform Lifetime table: what a pre-tax balance is divided by, by age. */
const FP_RMD_FACTORS = { 72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5,
    83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9,
    96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9, 105: 4.6, 106: 4.3, 107: 4.1, 108: 3.9,
    109: 3.7, 110: 3.5, 111: 3.4, 112: 3.3, 113: 3.1, 114: 3.0, 115: 2.9, 116: 2.8, 117: 2.7, 118: 2.5, 119: 2.3, 120: 2.0 };

function fpRmdAge(birthYear) {
    return birthYear >= 1960 ? 75 : 73;
}

function fpRmdFactor(age) {
    return FP_RMD_FACTORS[Math.min(120, Math.max(72, age))];
}

function fpIsPretax(a) {
    return a.kind === 'retirement' && a.tax !== 'roth';
}

/** When retirement starts and how long the plan runs, from the birth month — the plan's
 *  own, or the first Social Security line's — or null when it is off or cannot be told. */
function fpRetireInfo(plan) {
    const r = plan.retire || {};
    if (!r.on) return null;
    const ss = fpEntries(plan.incomes).find(l => l.type === 'ss' && l.birth);
    const birth = r.birth || (ss ? ss.birth : '');
    const m = /^(\d{4})-(\d{2})$/.exec(birth || '');
    if (!m) return { missing: 'birth' };
    const by = +m[1], bm = +m[2] - 1;
    const at = Math.round(fpNum(r.ageYears, 65) * 12 + fpNum(r.ageMonths, 0));
    const until = Math.max(Math.ceil(at / 12) + 1, Math.round(fpNum(r.until, 95)));
    const date = new Date(by, bm + at, 1);
    return { birthYear: by, birthMonth: bm, birth: birth, atMonths: at, date: date, ym: fpYm(date), until: until, end: new Date(by, bm + until * 12, 1),
        rmdAge: fpRmdAge(by), ageAt: (d) => (d.getFullYear() * 12 + d.getMonth()) - (by * 12 + bm) };
}

/** Spending in retirement, a month in today's dollars: as typed, or today's expenses. */
function fpRetireSpending(plan) {
    const typed = fpNum((plan.retire || {}).spending, null);
    if (typed !== null) return typed;
    const ym = fpYm(new Date());
    return fpEntries(plan.expenses).filter(l => fpActive(l, ym)).reduce((s, l) => s + fpMonthly(l), 0);
}

/** The accounts drawn from, in order: as the person put them, then any not placed, cash
 *  first, then investments, then pre-tax, then Roth. Property is not drawn from. */
function fpDrawOrder(plan) {
    const rank = (a) => a.kind === 'cash' ? 0 : a.kind === 'investment' ? 1 : a.kind === 'other' ? 2 : fpIsPretax(a) ? 3 : 4;
    const drawable = fpEntries(plan.accounts).filter(a => (FP_KINDS[a.kind] || FP_KINDS.other).side === 'asset' && a.kind !== 'property');
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
 */
function fpProject(plan, shift) {
    plan = fpCalc(plan);
    shift = shift || 0;
    const infl = fpNum(plan.assume.inflation, 0) / 100;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    // Retiring, the plan runs to the age it is to last to.
    const ret = fpRetireInfo(plan);
    const retOk = ret && !ret.missing;
    const toEnd = retOk ? (ret.end.getFullYear() - start.getFullYear()) * 12 + (ret.end.getMonth() - start.getMonth()) : 0;
    const years = Math.max(1, Math.min(80, retOk ? Math.ceil(toEnd / 12) : Math.round(fpNum(plan.assume.years, 30))));
    const taxInfo = fpTaxInfo(plan);
    const spend0 = retOk ? fpRetireSpending(plan) : 0;
    const order = retOk ? fpDrawOrder(plan) : [];
    const pretax = retOk ? plan.accounts.filter(fpIsPretax) : [];
    const buffer = retOk ? Math.max(0, fpNum(plan.retire.buffer, 6)) : 0;
    const rmdYear = {};
    let yearWithdrawn = 0, yearWithdrawTax = 0;
    const bal = {};
    const yearStart = {}, yearAdded = {};
    plan.accounts.forEach(a => { bal[a.id] = fpBalanceOf(plan, a); yearStart[a.id] = bal[a.id]; yearAdded[a.id] = 0; });
    const into = fpSurplusAccount(plan);
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
    const rows = [{ t: 0, year: start.getFullYear(), assets: t0.assets, liabilities: t0.liabilities, net: t0.net, cash: cashOf(), withdrawn: 0, withdrawTax: 0,
        age: retOk ? Math.floor(ret.ageAt(start) / 12) : null }];
    const owedAtStart = t0.liabilities > 0;
    const target = fpNum(plan.assume.target, 0);
    const ms = { debtFree: null, target: t0.net >= target && target > 0 ? 0 : null, cashOut: null, growing: [],
        retire: null, rmd: null, runsOut: null, penalty: null };
    let first = null;
    for (let t = 1; t <= years * 12; t++) {
        const date = new Date(start.getFullYear(), start.getMonth() + t - 1, 1);
        const ym = fpYm(date);
        const yrs = (t - 1) / 12;
        const retired = retOk && ym >= ret.ym;
        if (retired && ms.retire === null) ms.retire = t;
        let income = 0, taxed = 0, deductions = 0, typedTax = 0, expenses = 0, payments = 0, escrow = 0, contributions = 0, payrollOwn = 0, payrollMatch = 0;
        const payroll = {};
        plan.incomes.forEach(l => {
            if (!fpActive(l, ym)) return;
            // Retired, pay stops; Social Security, and anything given an end of its own, go on.
            if (retired && l.type !== 'ss' && !l.to) return;
            // Deductions and taxes typed on a line grow with it, as a pay stub's do.
            const g = Math.pow(1 + fpNum(l.growth, infl * 100) / 100, yrs);
            const v = fpMonthly(l) * g;
            income += v;
            // What goes into an account is part of the deductions; typed as more than
            // them, the deductions are at least that much.
            const target = fpPayrollTarget(plan, l);
            const own = target ? Math.max(0, fpPerMonth(l, 'intoAmount')) * g : 0;
            const match = target ? Math.max(0, fpPerMonth(l, 'match')) * g : 0;
            deductions += Math.max(fpPerMonth(l, 'deductions') * g, own);
            if (target) { payroll[target.id] = (payroll[target.id] || 0) + own + match; payrollOwn += own; payrollMatch += match; }
            if (fpHasTypedTax(l)) typedTax += fpPerMonth(l, 'taxes') * g;
            // Up to 85% of a Social Security benefit is taxable, depending on the rest of
            // the income; the estimate counts the 85%, so it can overstate, never miss.
            else if (l.taxed !== false) taxed += l.type === 'ss' ? v * 0.85 : v;
        });
        if (retired) expenses = spend0 * Math.pow(1 + infl, yrs);
        else plan.expenses.forEach(l => {
            if (fpActive(l, ym)) expenses += fpMonthly(l) * Math.pow(1 + fpNum(l.growth, infl * 100) / 100, yrs);
        });
        const index = Math.pow(1 + infl, yrs);
        const estimated = fpTaxWith(taxInfo, taxed * 12, index) / 12;
        const tax = estimated + typedTax;
        plan.accounts.forEach(a => {
            const yearly = (fpRateOf(plan, a) + (FP_MARKET.includes(a.kind) ? shift : 0)) / 100;
            const r = yearly / 12;
            const m = retired && side(a) !== 'liability' ? 0 : fpMonthlyOf(plan, a);
            if (side(a) === 'liability') {
                escrow += fpEscrowOf(a) * Math.pow(1 + infl, yrs);
                if (bal[a.id] <= 0) return;
                const interest = bal[a.id] * r;
                const pay = Math.min(m, bal[a.id] + interest);
                bal[a.id] += interest - pay;
                if (bal[a.id] < 0.005) bal[a.id] = 0;
                payments += pay;
                if (pay < interest && !ms.growing.includes(a.id)) ms.growing.push(a.id);
            } else if (a.compounding === 'annual') {
                // As the Investment Calculator counts a year compounded once: what was
                // there at the start grows by the year's rate, what went in during the
                // year is added at its end without growth.
                bal[a.id] += m + (payroll[a.id] || 0);
                yearAdded[a.id] += m + (payroll[a.id] || 0);
                contributions += m;
                if (t % 12 === 0) {
                    const base = bal[a.id] - yearAdded[a.id];
                    bal[a.id] = (base > 0 ? base * (1 + yearly) : base) + yearAdded[a.id];
                    yearStart[a.id] = bal[a.id];
                    yearAdded[a.id] = 0;
                }
            } else {
                if (bal[a.id] > 0) bal[a.id] *= 1 + r;
                bal[a.id] += m + (payroll[a.id] || 0);
                contributions += m;
            }
        });
        const surplus = income - deductions - tax - expenses - payments - escrow - contributions;
        if (into) { bal[into] += surplus; yearAdded[into] += surplus; } else loose += surplus;
        let withdrawn = 0, withdrawTax = 0;
        if (retired) {
            const age = ret.ageAt(date);
            const put = (v) => { if (into) { bal[into] += v; yearAdded[into] += v; } else loose += v; };
            // Pre-tax money is income: what more tax `g` of it brings, on top of what is
            // already taxed this month.
            let pretaxSoFar = 0;
            const extraTax = (g) => (fpTaxWith(taxInfo, (taxed + pretaxSoFar + g) * 12, index) - fpTaxWith(taxInfo, (taxed + pretaxSoFar) * 12, index)) / 12;
            const fromPretax = {};
            const takePretax = (a, net) => {
                // Enough to have `net` left once its tax is paid, if the account holds it.
                let g = net;
                for (let k = 0; k < 6; k++) g = net + extraTax(g);
                g = Math.min(g, Math.max(0, bal[a.id]));
                const tx = extraTax(g);
                bal[a.id] -= g;
                pretaxSoFar += g;
                fromPretax[a.id] = (fromPretax[a.id] || 0) + g;
                withdrawn += g; withdrawTax += tx;
                put(g - tx);
                if (g > 0 && age < 59 * 12 + 6 && ms.penalty === null) ms.penalty = t;
                return g - tx;
            };
            let need = buffer * expenses - cashOf();
            order.forEach(a => {
                if (need <= 0.005 || a.id === into || bal[a.id] <= 0) return;
                if (fpIsPretax(a)) need -= takePretax(a, need);
                else { const v = Math.min(need, bal[a.id]); bal[a.id] -= v; withdrawn += v; put(v); need -= v; }
            });
            // The minimum a pre-tax account must pay out: worked out each January from the
            // balance then and the age reached that year, paid a twelfth a month.
            if (age >= ret.rmdAge * 12 - 11) {
                const ageThisYear = date.getFullYear() - ret.birthYear;
                if (ageThisYear >= ret.rmdAge) {
                    if (ms.rmd === null) ms.rmd = t;
                    pretax.forEach(a => {
                        if (date.getMonth() === 0 || rmdYear[a.id] === undefined) rmdYear[a.id] = Math.max(0, bal[a.id] + (fromPretax[a.id] || 0)) / fpRmdFactor(ageThisYear);
                        const owed = rmdYear[a.id] / 12 - (fromPretax[a.id] || 0);
                        if (owed > 0.005 && bal[a.id] > 0) {
                            const g = Math.min(owed, bal[a.id]);
                            const tx = extraTax(g);
                            bal[a.id] -= g; pretaxSoFar += g; withdrawn += g; withdrawTax += tx;
                            put(g - tx);
                        }
                    });
                }
            }
            if (ms.runsOut === null && cashOf() < -0.005) ms.runsOut = t;
        }
        yearWithdrawn += withdrawn; yearWithdrawTax += withdrawTax;
        if (!first) first = { income: income, deductions: deductions, tax: tax, typedTax: typedTax, estimatedTax: estimated, takeHome: income - deductions - tax,
            expenses: expenses, payments: payments, escrow: escrow, contributions: contributions, surplus: surplus, payrollOwn: payrollOwn, payrollMatch: payrollMatch };
        const tot = totals();
        if (owedAtStart && ms.debtFree === null && plan.accounts.every(a => side(a) !== 'liability' || bal[a.id] <= 0)) ms.debtFree = t;
        if (ms.target === null && target > 0 && real(tot.net, t) >= target) ms.target = t;
        if (ms.cashOut === null && cashOf() < 0) ms.cashOut = t;
        if (t % 12 === 0) {
            rows.push({ t: t, year: start.getFullYear() + t / 12, assets: real(tot.assets, t), liabilities: real(tot.liabilities, t), net: real(tot.net, t), cash: real(cashOf(), t),
                withdrawn: real(yearWithdrawn, t), withdrawTax: real(yearWithdrawTax, t), age: retOk ? Math.floor(ret.ageAt(date) / 12) : null });
            yearWithdrawn = 0; yearWithdrawTax = 0;
        }
    }
    return { rows: rows, first: first || { income: 0, deductions: 0, tax: 0, typedTax: 0, estimatedTax: 0, takeHome: 0, expenses: 0, payments: 0, escrow: 0, contributions: 0, surplus: 0, payrollOwn: 0, payrollMatch: 0 }, milestones: ms, start: start, into: into, retire: retOk ? ret : null };
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
    const kindOptions = (sel) => Object.keys(FP_KINDS).map(k => '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + FP_KINDS[k].label + '</option>').join('');
    widget._open = widget._open || new Set();
    // Which entries sit under a folded section: drawn, but out of sight.
    const under = {};
    ['accounts', 'incomes', 'expenses'].forEach(list => fpSectionsOf(plan[list]).forEach(g => {
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
        const main = '<tr data-id="' + attr(a.id) + '" data-list="accounts" class="fp-acc fp-movable' + (open ? ' fp-open' : '') + (under[a.id] ? ' fp-under-folded' : '') + '"' +
                ' ondragover="fpDragOver(event, this)" ondragleave="fpDragLeave(this)" ondrop="fpDrop(event, this)">' +
            '<td><div class="fp-name-cell">' + fpGrip(a.name || kind.label) + (detailed ? '<button type="button" class="fp-more" onclick="fpToggleDetails(this)" aria-expanded="' + open + '" title="' +
                (open ? 'Hide' : 'Show') + ' everything the ' + escapeHtml((PluginRegistry.getTool(kind.tool) || {}).name || 'calculator') + ' takes">' + (open ? '▾' : '▸') + '</button>' : '<span class="fp-more-gap"></span>') +
                '<input class="fp-in fp-name" data-f="name" value="' + attr(a.name) + '" placeholder="Name" aria-label="Account name"></div></td>' +
            '<td><select class="fp-in" data-f="kind" aria-label="Kind">' + kindOptions(a.kind) + '</select></td>' +
            '<td><input class="fp-in fp-num" type="number" data-f="balance" value="' + attr(a.balance) + '" placeholder="0" aria-label="' + (liability ? 'Owed' : 'Balance') + '"></td>' +
            '<td><input class="fp-in fp-num" type="number" step="0.1" data-f="rate" value="' + attr(a.rate) + '" placeholder="' + fpNum(plan.assume.returns[a.kind], kind.rate) + '" aria-label="' + (liability ? 'Interest' : 'Return') + ' per cent a year"></td>' +
            '<td class="fp-acc-monthly"></td>' +
            '<td class="fp-acts">' + (kind.tool ? '<button type="button" class="fp-link" onclick="fpOpenAccountTool(this)" title="Work it out in the ' + escapeHtml((PluginRegistry.getTool(kind.tool) || {}).name || 'calculator') + '">↗</button>' : '') +
                '<button type="button" class="fp-x" onclick="fpRemove(this)" title="Remove">×</button></td></tr>';
        return main + (open && !under[a.id] ? fpDetailsRow(plan, a) : '');
    }).join('');
    const flowRows = (list, isIncome) => plan[list].map(l => fpIsSection(l) ? secRow(l, list, isIncome ? 10 : 8) :
        '<tr data-id="' + attr(l.id) + '" data-list="' + list + '" class="fp-movable' + (under[l.id] ? ' fp-under-folded' : '') + '" ondragover="fpDragOver(event, this)" ondragleave="fpDragLeave(this)" ondrop="fpDrop(event, this)">' +
            '<td><div class="fp-name-cell">' + fpGrip(l.name || (isIncome ? 'income' : 'expense')) +
                (isIncome ? '<button type="button" class="fp-more" onclick="fpToggleDetails(this)" aria-expanded="' + widget._open.has(l.id) + '" title="' +
                    (widget._open.has(l.id) ? 'Hide' : 'Show') + (l.type === 'ss' ? ' the benefit and when it is claimed' : ' what goes from it into an account') + '">' + (widget._open.has(l.id) ? '▾' : '▸') + '</button>' : '') +
                '<input class="fp-in" data-f="name" value="' + attr(l.name) + '" placeholder="Name" aria-label="Name"></div></td>' +
            (l.type === 'ss'
                ? '<td class="fp-derived-cell"><span class="fp-derived fp-ss-amount" title="The benefit at full retirement age, adjusted for the claiming age, in today’s dollars — set in ▸">' +
                    (fpSSInfo(l) ? fpCents(fpSSInfo(l).monthlyToday) : 'set in ▸') + '</span></td><td><span class="fp-derived">/ month</span></td>'
                : '<td><input class="fp-in fp-num" type="number" data-f="amount" value="' + attr(l.amount) + '" placeholder="0" aria-label="Amount"></td>' +
                  '<td><select class="fp-in" data-f="every" aria-label="How often"><option value="month"' + (l.every !== 'year' ? ' selected' : '') + '>/ month</option><option value="year"' + (l.every === 'year' ? ' selected' : '') + '>/ year</option></select></td>') +
            (isIncome ? '<td><input class="fp-in fp-num" type="number" data-f="deductions" value="' + attr(l.deductions) + '" placeholder="0" aria-label="Deductions, same period" title="Taken out of this income before it is paid: retirement, insurance, … — in the same period as the amount"></td>' +
                '<td><input class="fp-in fp-num" type="number" data-f="taxes" value="' + attr(l.taxes) + '" placeholder="' + (plan.tax.on && l.taxed !== false ? 'estimate' : '0') + '" aria-label="Taxes, same period" title="Taxes paid from this income, in the same period as the amount. Typed here, the line is left out of the federal estimate."></td>' : '') +
            '<td><input class="fp-in fp-num" type="number" step="0.1" data-f="growth" value="' + attr(l.growth) + '" placeholder="' + fpNum(plan.assume.inflation, 0) + '" aria-label="Grows per cent a year" title="' +
                (l.type === 'ss' ? 'The cost-of-living increase a year; empty means inflation' : 'Grows by this much a year; empty means inflation') + '"></td>' +
            (l.type === 'ss'
                ? '<td><span class="fp-derived fp-ss-start" title="The month the claiming age is reached">' + (fpSSInfo(l) ? fpSSInfo(l).startYm : '—') + '</span></td>'
                : '<td><input class="fp-in fp-date" type="month" data-f="from" value="' + attr(l.from) + '" aria-label="From" title="From (empty: now)"></td>') +
            '<td><input class="fp-in fp-date" type="month" data-f="to" value="' + attr(l.to) + '" aria-label="Until" title="Until (empty: no end)"></td>' +
            (isIncome ? '<td><label class="fp-check" title="Counted in the federal estimate, unless its taxes are typed"><input class="fp-in" type="checkbox" data-f="taxed"' + (l.taxed !== false ? ' checked' : '') + '> Taxed</label></td>' : '<td></td>') +
            '<td class="fp-acts"><button type="button" class="fp-x" onclick="fpRemove(this)" title="Remove">×</button></td></tr>' +
        (isIncome && widget._open.has(l.id) && !under[l.id] ? fpIncomeDetailsRow(plan, l) : '')).join('');
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
    widget.innerHTML =
        '<div class="fp-top"><button type="button" class="fp-btn fp-fold-all" onclick="fpFoldAll(this)">' + (allFolded ? 'Show all' : 'Hide all') + '</button></div>' +
        sec('summary', 'Summary', '', '<div class="fp-rollup"></div>') +
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
                '<button type="button" class="fp-link" onclick="fpOpenTax(this)" title="Check it in the Tax Calculator">↗ Tax Calculator</button></div>') +
        sec('expenses', 'Expenses', '<button type="button" class="fp-btn" onclick="fpAddSection(this, \'expenses\')" title="A heading to group what follows under, with its totals">+ Section</button>' +
            '<button type="button" class="fp-btn" onclick="fpAdd(this, \'expenses\')">+ Expense</button>',
            '<table class="fp-table">' + flowHead + '<tbody>' + flowRows('expenses', false) + '</tbody></table>') +
        sec('retirement', 'Retirement', '', fpRetireFields(plan, attr, under)) +
        sec('month', 'A month, now', '', '<div class="fp-month"></div>') +
        sec('assumptions', 'Assumptions', '', '<div class="fp-assume">' +
            '<label>Years ahead <input class="fp-in fp-num fp-small" type="number" min="1" max="60" data-a="years" value="' + attr(plan.assume.years) + '"></label>' +
            '<label>Inflation <input class="fp-in fp-num fp-small" type="number" step="0.1" data-a="inflation" value="' + attr(plan.assume.inflation) + '"> %</label>' +
            '<label>Range ± <input class="fp-in fp-num fp-small" type="number" step="0.5" min="0" data-a="spread" value="' + attr(plan.assume.spread) + '"> % on investments</label>' +
            '<label>Goal <input class="fp-in fp-num" type="number" step="10000" data-a="target" value="' + attr(plan.assume.target) + '"> net worth</label>' +
            '<label class="fp-check"><input class="fp-in" type="checkbox" data-a="real"' + (plan.assume.real ? ' checked' : '') + '> In today’s money</label>' +
            '</div><div class="fp-assume fp-returns"><span>Default rates:</span>' + returns + '</div>') +
        sec('ahead', 'Ahead', '<button type="button" class="fp-btn" onclick="fpCopySummary(this)" title="The rollup and the projection, as Markdown">Copy summary</button>',
            '<div class="fp-projection"></div>');
    widget.querySelectorAll('.fp-in').forEach(el => el.addEventListener(el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input', () => fpOnInput(el)));
    fpRenderDerived(widget, plan);
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
            (a.kind === 'retirement' ? '<label title="Pre-tax (a traditional 401(k) or IRA): taxed as it is drawn, with minimum withdrawals from 73 or 75. Roth: drawn untaxed.">Tax <select class="fp-in" data-f="tax">' +
                '<option value="pretax"' + (a.tax !== 'roth' ? ' selected' : '') + '>Pre-tax</option><option value="roth"' + (a.tax === 'roth' ? ' selected' : '') + '>Roth</option></select></label>' : '') +
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
        const payoff = fpMonthText(new Date(new Date().getFullYear(), new Date().getMonth(), 1), left.months + 1);
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
    const r = fpRateOf(plan, a) / 100, m = fpNum(a.monthly, 0) + (pay ? pay.own + pay.match : 0), start = fpBalanceOf(plan, a);
    let fv = start;
    if (a.compounding === 'annual') for (let y = 0; y < years; y++) fv = fv * (1 + r) + m * 12;
    else for (let i = 0; i < years * 12; i++) fv = fv * (1 + r / 12) + m;
    const put = start + m * years * 12;
    return '<span>In ' + years + ' years, on its own: <b>' + fpMoney(fv) + '</b></span><span>put in ' + fpMoney(put) + '</span><span>growth ' + fpMoney(fv - put) + '</span>' +
        '<span class="fp-note">(before inflation, as the Investment Calculator shows it' + (pay ? '; with ' + fpMoney(pay.own + pay.match) + ' a month from pay' : '') + ')</span>' +
        (pay && fpNum(a.monthly, 0) > 0 ? '<span class="fp-neg">This account also has ' + fpMoney(fpNum(a.monthly, 0)) + ' a month of its own: if that is the same money as from pay, it is counted twice.</span>' : '');
}

function fpRefreshIncomeDetails(widget, plan) {
    plan.incomes.filter(l => l.type === 'ss').forEach(l => {
        const tr = widget.querySelector('tr.fp-movable[data-list="incomes"][data-id="' + CSS.escape(l.id) + '"]');
        if (!tr) return;
        const s = fpSSInfo(l);
        const amt = tr.querySelector('.fp-ss-amount'), st = tr.querySelector('.fp-ss-start');
        if (amt) amt.textContent = s ? fpCents(s.monthlyToday) : 'set in ▸';
        if (st) st.textContent = s ? s.startYm : '—';
    });
    widget.querySelectorAll('tr.fp-income-detail').forEach(tr => {
        const l = plan.incomes.find(x => x.id === tr.dataset.id);
        if (l) tr.querySelector('.fp-detail-sum').innerHTML = fpIncomeDetailSummary(plan, l);
    });
}

function fpRefreshSections(widget, plan) {
    ['accounts', 'incomes', 'expenses'].forEach(list => fpSectionsOf(plan[list]).forEach(g => {
        if (!g.section) return;
        const el = widget.querySelector('tr.fp-sec-row[data-list="' + list + '"][data-id="' + CSS.escape(g.section.id) + '"] .fp-sec-total');
        if (el) el.textContent = fpSectionTotal(plan, list, g.entries).text;
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
            '<label title="From your statement on ssa.gov, in today’s dollars">Benefit at full retirement age <input class="fp-in fp-num" type="number" data-f="fraBenefit" value="' + attr(l.fraBenefit) + '" placeholder="0"> / month</label>' +
            '<label>Claim at age <input class="fp-in fp-num fp-small" type="number" min="62" max="70" data-f="claimYears" value="' + attr(l.claimYears) + '" placeholder="67"></label>' +
            '<label>and <input class="fp-in fp-num fp-small" type="number" min="0" max="11" data-f="claimMonths" value="' + attr(l.claimMonths) + '" placeholder="0"> months</label>' +
            '</div><div class="fp-detail-sum"></div></td></tr>';
    }
    const per = l.every === 'year' ? '/ year' : '/ month';
    const targets = fpEntries(plan.accounts).filter(a => (FP_KINDS[a.kind] || FP_KINDS.other).side === 'asset');
    return '<tr class="fp-detail fp-income-detail" data-id="' + attr(l.id) + '" data-list="incomes"><td colspan="10"><div class="fp-detail-fields">' +
        '<label>Of the deductions, <input class="fp-in fp-num" type="number" data-f="intoAmount" value="' + attr(l.intoAmount) + '" placeholder="0"> ' + per + ' goes into</label>' +
        '<select class="fp-in" data-f="intoAccount" aria-label="Into which account"><option value="">— no account —</option>' +
            targets.map(a => '<option value="' + attr(a.id) + '"' + (a.id === l.intoAccount ? ' selected' : '') + '>' + escapeHtml(a.name || FP_KINDS[a.kind].label) + '</option>').join('') + '</select>' +
        '<label>Employer adds <input class="fp-in fp-num" type="number" data-f="match" value="' + attr(l.match) + '" placeholder="0"> ' + per + '</label>' +
        '</div><div class="fp-detail-sum"></div></td></tr>';
}

/** What an income line's details come to, and anything that does not add up. */
function fpIncomeDetailSummary(plan, l) {
    if (l.type === 'ss') {
        const s = fpSSInfo(l);
        if (!s) return '<span class="fp-note">Your birth month and the benefit at full retirement age, from your statement on ssa.gov, are all it needs.</span>';
        const pct = (s.factor * 100).toFixed(1).replace(/\.0$/, '');
        const now = new Date();
        const yrs = Math.max(0, (s.start.getFullYear() - now.getFullYear()) + (s.start.getMonth() - now.getMonth()) / 12);
        const then = s.monthlyToday * Math.pow(1 + fpNum(l.growth, fpNum(plan.assume.inflation, 0)) / 100, yrs);
        const claimed = Math.max(62 * 12, Math.min(70 * 12, Math.round(fpNum(l.claimYears, 67) * 12 + fpNum(l.claimMonths, 0))));
        return '<span>Full retirement age <b>' + fpAgeText(s.fra) + '</b></span>' +
            '<span>Claimed at ' + fpAgeText(claimed) + ': <b>' + pct + '%</b> of the benefit' + (s.factor < 1 ? ', for claiming early' : s.factor > 1 ? ', for waiting' : '') + '</span>' +
            '<span>Starts <b>' + s.start.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) + '</b> at <b>' + fpCents(s.monthlyToday) + '</b> a month in today’s dollars' +
                (yrs > 0 ? ', about <b>' + fpMoney(then) + '</b> then' : '') + '</span>' +
            '<span class="fp-note">Taxed: 85% of it counts toward the federal estimate, the most it can be.</span>';
    }
    const a = fpPayrollTarget(plan, l);
    const own = fpPerMonth(l, 'intoAmount'), match = fpPerMonth(l, 'match'), ded = fpPerMonth(l, 'deductions');
    const bits = [];
    if (!a) bits.push(own || match ? '<span class="fp-neg">Choose an account for it to go into; until then it is spent like the other deductions.</span>'
        : '<span class="fp-note">For a 401(k) and the like: it comes out of take-home, as on the pay stub, and is saved in the account rather than spent.</span>');
    else {
        bits.push('<span>Into ' + escapeHtml(a.name || FP_KINDS[a.kind].label) + ': <b>' + fpMoney(own + match) + '</b> a month' + (match ? ' (' + fpMoney(own) + ' yours, ' + fpMoney(match) + ' employer)' : '') + '</span>');
        if (own > ded) bits.push('<span class="fp-neg">That is more than the deductions typed; they are counted as ' + fpMoney(own) + ' a month.</span>');
        if (fpNum(a.monthly, 0) > 0) bits.push('<span class="fp-neg">' + escapeHtml(a.name || 'That account') + ' also has ' + fpMoney(fpNum(a.monthly, 0)) + ' a month of its own in Accounts: if that is the same money, it is counted twice.</span>');
    }
    return bits.join('');
}

/** The Retirement section: when, for how long, what it costs, and the order money is
 *  drawn in. */
function fpRetireFields(plan, attr, under) {
    const r = plan.retire;
    const ss = fpEntries(plan.incomes).find(l => l.type === 'ss' && l.birth);
    const label = (a) => (FP_KINDS[a.kind] || FP_KINDS.other).label + (a.kind === 'retirement' ? (fpIsPretax(a) ? ', pre-tax' : ', Roth') : '');
    const order = fpDrawOrder(plan);
    const head = '<div class="fp-assume"><label class="fp-check"><input class="fp-in" type="checkbox" data-a="retireOn"' + (r.on ? ' checked' : '') + '> Plan for retirement: pay stops, savings are drawn on</label></div>';
    if (!r.on) return head;
    return head +
        '<div class="fp-assume">' +
            '<label>Born <input class="fp-in fp-date" type="month" data-a="retire" data-k="birth" value="' + attr(r.birth) + '"' + (ss ? ' title="Empty: ' + ss.birth + ', from Social Security"' : '') + '></label>' +
            '<label>Retire at age <input class="fp-in fp-num fp-small" type="number" min="40" max="80" data-a="retire" data-k="ageYears" value="' + attr(r.ageYears) + '" placeholder="65"></label>' +
            '<label>and <input class="fp-in fp-num fp-small" type="number" min="0" max="11" data-a="retire" data-k="ageMonths" value="' + attr(r.ageMonths) + '" placeholder="0"> months</label>' +
            '<label>Last to age <input class="fp-in fp-num fp-small" type="number" min="60" max="115" data-a="retire" data-k="until" value="' + attr(r.until) + '" placeholder="95"></label>' +
        '</div><div class="fp-assume">' +
            '<label title="In today’s dollars; it rises with inflation. Empty: today’s expenses.">Spending in retirement <input class="fp-in fp-num" type="number" data-a="retire" data-k="spending" value="' + attr(r.spending) + '" placeholder="' + Math.round(fpRetireSpending(Object.assign({}, plan, { retire: Object.assign({}, r, { spending: null }) }))) + '"> / month</label>' +
            '<label title="Kept in the cash account that takes what is left over; the rest is drawn on first">Keep <input class="fp-in fp-num fp-small" type="number" min="0" data-a="retire" data-k="buffer" value="' + attr(r.buffer) + '" placeholder="6"> months of spending in cash</label>' +
        '</div>' +
        (order.length ? '<div class="fp-draw-head">Drawn on in this order — drag ☰ or press ↑ ↓ to change it:</div><table class="fp-table fp-draw"><tbody>' +
            order.map((a, i) => '<tr data-id="' + attr(a.id) + '" data-list="drawOrder" class="fp-movable" ondragover="fpDragOver(event, this)" ondragleave="fpDragLeave(this)" ondrop="fpDrop(event, this)">' +
                '<td><div class="fp-name-cell">' + fpGrip(a.name || label(a)) + '<span class="fp-draw-n">' + (i + 1) + '.</span> ' + escapeHtml(a.name || label(a)) + '</div></td>' +
                '<td class="fp-muted">' + label(a) + '</td></tr>').join('') + '</tbody></table>' : '') +
        '<div class="fp-retire-out"></div>';
}

/** Retirement in plain lines, for Copy summary and for the model. */
function fpRetireLines(plan, proj) {
    const ret = proj.retire;
    if (!ret) return [];
    const ms = proj.milestones, mon = (d) => d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    const lines = ['Retire ' + mon(ret.date) + ' at ' + fpAgeText(ret.atMonths) + ', spending ' + fpMoney(fpRetireSpending(plan)) + ' a month in today’s dollars, keeping ' +
        fpNum(plan.retire.buffer, 6) + ' months of it in cash.'];
    if (ms.runsOut === null) lines.push('The money lasts to ' + ret.until + '.');
    else { const d = new Date(proj.start.getFullYear(), proj.start.getMonth() + ms.runsOut - 1, 1); lines.push('The money runs out at ' + Math.floor(ret.ageAt(d) / 12) + ', in ' + mon(d) + '.'); }
    lines.push('Drawn on in this order: ' + fpDrawOrder(plan).map(a => fpAIName(a, FP_KINDS[a.kind].label) + (a.kind === 'retirement' ? (fpIsPretax(a) ? ' (pre-tax)' : ' (Roth)') : '')).join(', ') + '.');
    if (ms.rmd !== null) lines.push('Minimum withdrawals from pre-tax accounts from ' + fpMonthText(proj.start, ms.rmd) + ' (age ' + ret.rmdAge + ').');
    if (ms.penalty !== null) lines.push('Pre-tax money is drawn before 59½, in ' + fpMonthText(proj.start, ms.penalty) + ': a 10% penalty may apply.');
    const best = fpRetireMax(plan, 0);
    if (best !== null) lines.push('The most that could be spent and still last to ' + ret.until + ': ' + fpMoney(best) + ' a month in today’s dollars.');
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
    const bits = ['Retire <b>' + mon(ret.date) + '</b> at <b>' + fpAgeText(ret.atMonths) + '</b>'];
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
    if (ms.rmd !== null) bits.push('Minimum withdrawals from <b>' + fpMonthText(proj.start, ms.rmd).replace(/^\w+ /, '') + '</b> (age ' + ret.rmdAge + ')');
    if (ms.penalty !== null) bits.push('<span class="fp-neg">Pre-tax money is drawn in ' + fpMonthText(proj.start, ms.penalty) + ', before 59½: a 10% penalty may apply</span>');
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
        box.innerHTML = 'You could spend up to <b>' + fpMoney(best) + '</b> a month in retirement, in today’s dollars, and last to ' + ret.until +
            (range ? ' <span class="fp-muted">(' + fpMoney(range[0]) + ' to ' + fpMoney(range[1]) + ' at returns ±' + spread + '%)</span>' : '') + '.';
    }, 250);
}

/** Everything worked out from the fields: the rollup, this month, the projection. */
function fpRenderDerived(widget, plan) {
    const toolId = fpToolId(widget);
    plan = plan || fpGet(toolId);
    fpRefreshAccounts(widget, plan);
    fpRefreshSections(widget, plan);
    fpRefreshIncomeDetails(widget, plan);
    const roll = fpRollup(plan);
    const proj = fpProject(plan, 0);
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
            (plan.tax.on || f.typedTax ? '<span title="' + (f.typedTax ? fpMoney(f.typedTax) + ' as typed' : '') + (f.typedTax && f.estimatedTax ? ', ' : '') +
                (f.estimatedTax ? fpMoney(f.estimatedTax) + ' estimated' : '') + '">− taxes <b>' + fpMoney(f.tax) + '</b></span>' : '') +
            '<span>= take-home <b>' + fpMoney(f.takeHome) + '</b></span>' +
            '<span>− expenses <b>' + fpMoney(f.expenses) + '</b></span>' +
            '<span>− loan payments <b>' + fpMoney(f.payments) + '</b></span>' +
            (f.escrow ? '<span title="Property tax and insurance paid with the loans">− escrow <b>' + fpMoney(f.escrow) + '</b></span>' : '') +
            '<span>− added to accounts <b>' + fpMoney(f.contributions) + '</b></span>' +
            '<span class="' + (f.surplus < 0 ? 'fp-neg' : 'fp-pos') + '">= ' + (f.surplus < 0 ? 'short ' : 'left over ') + '<b>' + fpMoney(Math.abs(f.surplus)) + '</b></span>' +
        '</div>' +
        '<div class="fp-into">' + (f.surplus < 0 ? 'Taken from' : 'Goes to') + ' <select class="fp-in" data-a="surplusTo" aria-label="Where what is left over goes">' +
            '<option value="">' + (into && !plan.surplusTo ? 'First cash account (' + escapeHtml(into.name || 'Cash') + ')' : 'First cash account') + '</option>' +
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
    if (ms.debtFree !== null) facts.push('Debt-free <b>' + fpMonthText(proj.start, ms.debtFree) + '</b>');
    else if (roll.liabilities > 0) facts.push('<span class="fp-neg">Still owing after ' + (proj.rows.length - 1) + ' years</span>');
    if (proj.retire && ms.retire !== null) facts.push('Retire <b>' + fpMonthText(proj.start, ms.retire) + '</b>');
    if (proj.retire && ms.runsOut !== null) facts.push('<span class="fp-neg">Savings run out <b>' + fpMonthText(proj.start, ms.runsOut) + '</b></span>');
    if (fpNum(plan.assume.target, 0) > 0) facts.push(ms.target === 0 ? 'Past the ' + fpMoney(plan.assume.target) + ' goal already'
        : ms.target !== null ? fpMoney(plan.assume.target) + ' net worth <b>' + fpMonthText(proj.start, ms.target) + '</b>' : 'The ' + fpMoney(plan.assume.target) + ' goal is not reached');
    fpEntries(plan.incomes).filter(l => l.type === 'ss').forEach(l => {
        const s = fpSSInfo(l);
        if (s && s.start > new Date()) facts.push((escapeHtml(l.name) || 'Social Security') + ' starts <b>' + s.start.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) + '</b>');
    });
    if (ms.cashOut !== null) facts.push('<span class="fp-neg">Cash runs out <b>' + fpMonthText(proj.start, ms.cashOut) + '</b></span>');
    ms.growing.forEach(id => { const a = plan.accounts.find(x => x.id === id); if (a) facts.push('<span class="fp-neg">' + escapeHtml(a.name || 'A loan') + ': the payment does not cover the interest</span>'); });
    const last = proj.rows[proj.rows.length - 1];
    const pot = into ? (into.name || FP_KINDS[into.kind].label) : 'Left over';
    const R = !!proj.retire;
    const table = '<table class="fp-table fp-years"><thead><tr><th>Year</th>' + (R ? '<th>Age</th>' : '') + '<th>Assets</th><th>Liabilities</th><th>Net worth</th>' + (low ? '<th>Range</th>' : '') +
        '<th title="The account what is left over each month goes to">' + escapeHtml(pot) + '</th>' +
        (R ? '<th title="Drawn from savings that year">Withdrawn</th><th title="Federal tax on the pre-tax money drawn">Tax on it</th>' : '') + '</tr></thead><tbody>' +
        proj.rows.filter((r, i) => i === 0 || r.t / 12 <= 5 || (r.t / 12) % 5 === 0 || i === proj.rows.length - 1).map(r => {
            const i = proj.rows.indexOf(r);
            return '<tr><td>' + (i === 0 ? 'Now' : r.year) + '</td>' + (R ? '<td>' + (r.age == null ? '' : r.age) + '</td>' : '') + '<td>' + fpMoney(r.assets) + '</td><td>' + fpMoney(r.liabilities) + '</td><td><b>' + fpMoney(r.net) + '</b></td>' +
                (low ? '<td class="fp-muted">' + fpMoney(low.rows[i].net, true) + ' – ' + fpMoney(high.rows[i].net, true) + '</td>' : '') +
                '<td class="' + (r.cash < 0 ? 'fp-neg' : '') + '">' + fpMoney(r.cash) + '</td>' +
                (R ? '<td>' + (r.withdrawn ? fpMoney(r.withdrawn) : '') + '</td><td>' + (r.withdrawTax ? fpMoney(r.withdrawTax) : '') + '</td>' : '') + '</tr>';
        }).join('') + '</tbody></table>';
    fpRenderRetire(widget, plan, proj, low, high);
    widget.querySelector('.fp-projection').innerHTML = '<div class="fp-ahead-sub">' + (proj.rows.length - 1) + ' years' + (proj.retire ? ', to age ' + proj.retire.until : '') +
        (plan.assume.real ? ', in today’s money' : '') + '</div>' +
        (facts.length ? '<div class="fp-facts">' + facts.map(f => '<span class="fp-fact">' + f + '</span>').join('') + '</div>' : '') +
        fpChart(proj, low, high) +
        '<div class="fp-years-head">In ' + last.year + ': net worth <b>' + fpMoney(last.net) + '</b>' + (low ? ' (' + fpMoney(low.rows[low.rows.length - 1].net) + ' to ' + fpMoney(high.rows[high.rows.length - 1].net) + ' at returns ±' + spread + '%)' : '') + '</div>' +
        table;
}

/** Net worth, assets and liabilities over the years, with the range as a band. */
function fpChart(proj, low, high) {
    const rows = proj.rows;
    if (rows.length < 2) return '';
    const W = 640, H = 200, L = 52, R = 96, T = 10, B = 22;
    const vals = [];
    rows.forEach((r, i) => { vals.push(r.assets, -r.liabilities, r.net); if (low) vals.push(low.rows[i].net, high.rows[i].net); });
    let max = Math.max(0, ...vals), min = Math.min(0, ...vals);
    if (max === min) max = min + 1;
    const x = (i) => L + (i / (rows.length - 1)) * (W - L - R);
    const y = (v) => T + (max - v) / (max - min) * (H - T - B);
    const line = (get) => rows.map((r, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(get(r, i)).toFixed(1)).join(' ');
    const step = Math.max(1, Math.ceil((rows.length - 1) / 6));
    const ticks = rows.map((r, i) => i % step === 0 || i === rows.length - 1 ? '<text x="' + x(i).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + (i === 0 ? 'Now' : r.year) + '</text>' : '').join('');
    const grid = [max, (max + min) / 2, min, 0].filter((v, i, a) => a.indexOf(v) === i).map(v =>
        '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '" class="' + (v === 0 ? 'fp-zero' : 'fp-grid') + '"/>' +
        '<text x="' + (L - 6) + '" y="' + (y(v) + 3).toFixed(1) + '" text-anchor="end">' + fpMoney(v, true) + '</text>').join('');
    const band = low ? '<path class="fp-band" d="' + rows.map((r, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(high.rows[i].net).toFixed(1)).join(' ') + ' ' +
        rows.slice().reverse().map((r, j) => { const i = rows.length - 1 - j; return 'L' + x(i).toFixed(1) + ' ' + y(low.rows[i].net).toFixed(1); }).join(' ') + ' Z"/>' : '';
    const end = rows[rows.length - 1];
    // Labels at the end of each line, pushed apart where lines end close together, and
    // one where two end on the same value (no debts left: assets are net worth).
    const ends = [{ v: end.net, cls: 'fp-net-label', text: 'Net worth' }];
    if (Math.abs(end.assets - end.net) > 0.5) ends.push({ v: end.assets, cls: 'fp-assets-label', text: 'Assets' });
    if (end.liabilities > 0) ends.push({ v: -end.liabilities, cls: 'fp-liab-label', text: 'Liabilities' });
    ends.forEach(e => { e.y = y(e.v) + 3; });
    ends.sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 12) ends[i].y = ends[i - 1].y + 12;
    const labels = ends.map(e => '<text class="' + e.cls + '" x="' + (W - R + 6) + '" y="' + e.y.toFixed(1) + '">' + e.text + '</text>').join('');
    // A strip per year to hover, wider than the point it answers for.
    const hits = rows.map((r, i) => {
        const w = (W - L - R) / Math.max(1, rows.length - 1);
        return '<rect class="fp-hit" x="' + (x(i) - w / 2).toFixed(1) + '" y="' + T + '" width="' + w.toFixed(1) + '" height="' + (H - T - B) + '"><title>' +
            (i === 0 ? 'Now' : r.year) + ' — net worth ' + fpMoney(r.net) + (low ? ' (' + fpMoney(low.rows[i].net) + ' to ' + fpMoney(high.rows[i].net) + ')' : '') +
            ', assets ' + fpMoney(r.assets) + ', liabilities ' + fpMoney(r.liabilities) + '</title></rect>';
    }).join('');
    return '<svg class="fp-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Net worth, assets and liabilities over ' + (rows.length - 1) + ' years">' +
        grid + ticks + band +
        '<path class="fp-line fp-assets" d="' + line(r => r.assets) + '"/>' +
        '<path class="fp-line fp-liab" d="' + line(r => -r.liabilities) + '"/>' +
        '<path class="fp-line fp-net" d="' + line(r => r.net) + '"/>' +
        labels +
        hits + '</svg>' +
        '<div class="fp-legend"><span><i class="fp-key-net"></i>Net worth</span><span><i class="fp-key-assets"></i>Assets</span><span><i class="fp-key-liab"></i>Liabilities (below zero)</span>' +
        (low ? '<span><i class="fp-key-band"></i>Range of net worth</span>' : '') + '</div>';
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
        const at = items.findIndex(a => a.id === id);
        fpMoveItem(widget, list, id, at + (e.key === 'ArrowUp' ? -1 : 1));
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

const FP_SECTIONS = ['summary', 'accounts', 'income', 'expenses', 'retirement', 'month', 'assumptions', 'ahead'];

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
        else if (a === 'taxStatus') plan.tax.status = val;
        else if (a === 'taxYear') plan.tax.year = val;
        else if (a === 'surplusTo') plan.surplusTo = val;
        else if (a === 'real') plan.assume.real = val;
        else if (a === 'retireOn') plan.retire.on = val;
        else if (a === 'retire') plan.retire[el.dataset.k] = el.dataset.k === 'birth' ? val : num(val);
        else plan.assume[a] = num(val);
    } else {
        const tr = el.closest('tr');
        const list = plan[tr.dataset.list];
        const item = list && list.find(x => x.id === tr.dataset.id);
        if (!item) return;
        const f = el.dataset.f;
        if (f.indexOf('loan.') === 0) {
            const k = f.slice(5);
            item.loan = Object.assign({}, item.loan || {});
            item.loan[k] = k === 'closing' ? val : num(val);
        } else item[f] = ['balance', 'rate', 'monthly', 'amount', 'growth', 'deductions', 'taxes', 'intoAmount', 'match', 'fraBenefit', 'claimYears', 'claimMonths'].includes(f) ? num(val) : val;
    }
    fpSet(toolId, plan);
    // A new kind changes what the row offers (its link, its placeholder): drawn again.
    if (el.dataset.f === 'kind' || el.dataset.f === 'tax' || el.dataset.a === 'retireOn') { fpRender(widget); return; }
    fpRenderDerived(widget, plan);
}

function fpAdd(btn, list) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const plan = fpGet(toolId);
    const id = fpNewId(list.slice(0, 1));
    if (list === 'accounts') plan.accounts.push({ id: id, name: '', kind: fpEntries(plan.accounts).some(a => a.kind === 'cash') ? 'investment' : 'cash', balance: null, rate: null, monthly: null });
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

function fpRemove(btn) {
    const widget = fpWidget(btn), toolId = fpToolId(btn);
    const tr = btn.closest('tr');
    const plan = fpGet(toolId);
    plan[tr.dataset.list] = plan[tr.dataset.list].filter(x => x.id !== tr.dataset.id);
    if (plan.surplusTo === tr.dataset.id) plan.surplusTo = '';
    plan.incomes.forEach(l => { if (l.intoAccount === tr.dataset.id) l.intoAccount = ''; });
    fpSet(toolId, plan);
    fpRender(widget);
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
    const annual = fpEntries(plan.incomes).filter(l => l.taxed !== false && fpActive(l, ym)).reduce((s, l) => s + fpMonthly(l) * 12 * (l.type === 'ss' ? 0.85 : 1), 0);
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
    [['accounts', 'Accounts'], ['incomes', 'Income'], ['expenses', 'Expenses']].forEach(([list, title]) => fpSectionsOf(plan[list]).forEach(g => {
        if (g.section) named.push('- ' + title + ' — ' + (g.section.name || 'Untitled section') + ': ' + fpSectionTotal(plan, list, g.entries).text);
    }));
    if (named.length) out.push('', '### Sections', '', ...named);
    const f = proj.first;
    out.push('', '### A month, now', '', 'Income ' + fpMoney(f.income) + (f.deductions ? ', deductions ' + fpMoney(f.deductions) : '') +
        (plan.tax.on || f.typedTax ? ', taxes ' + fpMoney(f.tax) : '') + ', take-home ' + fpMoney(f.takeHome) +
        (f.payrollOwn || f.payrollMatch ? ' (and ' + fpMoney(f.payrollOwn + f.payrollMatch) + ' from pay saved into accounts)' : '') +
        '; expenses ' + fpMoney(f.expenses) + ', loan payments ' + fpMoney(f.payments) + (f.escrow ? ', escrow ' + fpMoney(f.escrow) : '') + ', added to accounts ' + fpMoney(f.contributions) + ': ' + (f.surplus < 0 ? 'short ' : 'left over ') + fpMoney(Math.abs(f.surplus)) + '.');
    out.push('', '### Ahead' + (plan.assume.real ? ' (today’s money)' : ''), '', '| Year | Assets | Liabilities | Net worth |', '|---|---:|---:|---:|');
    proj.rows.filter((r, i) => i === 0 || (r.t / 12) % 5 === 0 || i === proj.rows.length - 1).forEach((r, i) =>
        out.push('| ' + (r.t === 0 ? 'Now' : r.year) + ' | ' + fpMoney(r.assets) + ' | ' + fpMoney(r.liabilities) + ' | ' + fpMoney(r.net) + ' |'));
    if (proj.milestones.debtFree !== null) out.push('', 'Debt-free ' + fpMonthText(proj.start, proj.milestones.debtFree) + '.');
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
    if (ms.cashOut !== null) out.push('Cash runs out in ' + fpMonthText(proj.start, ms.cashOut) + '.');
    ms.growing.forEach(id => { const a = plan.accounts.find(x => x.id === id); if (a) out.push(fpAIName(a, 'A loan') + ': the payment does not cover the interest, so it grows.'); });
    fpEntries(plan.incomes).forEach(l => {
        const t = fpPayrollTarget(plan, l);
        if (t && fpNum(t.monthly, 0) > 0) out.push(fpAIName(t, 'An account') + ' gets money from pay and has its own monthly amount too: possibly the same money twice.');
    });
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
    lines.push('', 'Accounts:');
    if (!calc.accounts.length) lines.push('- none');
    calc.accounts.forEach(a => {
        const k = FP_KINDS[a.kind] || FP_KINDS.other;
        const t = fpLoanTerms(plan, a), esc = fpEscrowOf(a);
        lines.push('- ' + fpAIName(a, k.label) + ' (' + k.label + ')' + inSec(accSec, a) + ': ' + (k.side === 'liability' ? 'owes ' : 'balance ') + fpMoney(fpBalanceOf(plan, a)) +
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
            bits.push(s ? 'Social Security, ' + fpCents(s.monthlyToday) + ' a month in today’s dollars from ' + fpMonthText(s.start, 1) : 'Social Security, details not filled in');
        } else bits.push(fpMoney(fpMonthly(l)) + ' gross' + (fpActive(l, ym) ? '' : ' (not running now)'));
        if (fpPerMonth(l, 'deductions')) bits.push('deductions ' + fpMoney(fpPerMonth(l, 'deductions')));
        bits.push(fpHasTypedTax(l) ? 'taxes ' + fpMoney(fpPerMonth(l, 'taxes')) : (l.taxed === false ? 'not taxed' : 'tax estimated'));
        const into = fpPayrollTarget(plan, l);
        if (into) bits.push(fpMoney(fpPerMonth(l, 'intoAmount')) + ' of it into ' + fpAIName(into, 'an account') + (fpPerMonth(l, 'match') ? ', employer adds ' + fpMoney(fpPerMonth(l, 'match')) : ''));
        bits.push('grows ' + fpNum(l.growth, fpNum(plan.assume.inflation, 0)) + '% a year');
        if (l.from) bits.push('from ' + l.from);
        if (l.to) bits.push('until ' + l.to);
        lines.push('- ' + fpAIName(l, 'Income') + inSec(incSec, l) + ': ' + bits.join(', '));
    });
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
    if (ms.debtFree !== null) lines.push('Debt-free: ' + fpMonthText(proj.start, ms.debtFree) + '.');
    else if (roll.liabilities > 0) lines.push('Still owing after ' + yrs + ' years.');
    if (fpNum(plan.assume.target, 0) > 0) lines.push('Goal of ' + fpMoney(plan.assume.target) + ' net worth: ' + (ms.target === 0 ? 'already passed' : ms.target !== null ? 'reached ' + fpMonthText(proj.start, ms.target) : 'not reached') + '.');
    lines.push('Assumptions: inflation ' + fpNum(plan.assume.inflation, 0) + '%' + (low ? ', investment returns ±' + spread + '% for the range' : '') + '.');
    const retLines = fpRetireLines(plan, proj);
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

    const functionsToExport = [fpRetireLines, fpRetireFields, fpRenderRetire, fpTaxInfo, fpTaxWith, fpRmdAge, fpRmdFactor, fpIsPretax, fpRetireInfo, fpRetireSpending, fpDrawOrder, fpRetireMax, fpAIEsc, fpAIName, fpAIFacts, fpAITarget, fpAICleanDraft, fpAIDraftPreview, fpAICleanSections, fpAISectionsPreview, fpAIApply, fpAIFinish, fpFullRetirementMonths, fpClaimFactor, fpSSInfo, fpAgeText, fpAddSocialSecurity, fpPayrollTarget, fpPayrollNow, fpPayrollMonthlyOf, fpIncomeDetailsRow, fpIncomeDetailSummary, fpRefreshIncomeDetails, fpEscrowOf, fpPerMonth, fpHasTypedTax, fpIsSection, fpEntries, fpCalc, fpSectionsOf, fpSectionTotal, fpRefreshSections, fpAddSection, fpSectionFold, fpOpenAround, fpMoveSection, fpSectionIds, fpGrip, fpMoveItem, fpGripKey, fpDragStart, fpDragOver, fpDragLeave, fpDrop, fpDragEnd, fpFoldedOf, fpSaveFolded, fpFold, fpFoldAll, fpShowFolded, fpCents, fpClosing, fpLoanTerms, fpBalanceOf, fpMonthlyOf, fpDetailsRow, fpRefreshAccounts, fpDetailSummary, fpToggleDetails, fpTaxYearOptions, fpDefaultPlan, fpNum, fpNewId, fpToolId, fpGet, fpSet, fpRateOf, fpMonthly, fpActive, fpSurplusAccount, fpIncomeTax, fpYm, fpProject, fpRollup, fpMoney, fpMonthText, fpInit, fpRender, fpRenderDerived, fpChart, fpWidget, fpOnInput, fpAdd, fpRemove, fpSample, fpOpenAccountTool, fpOpenTax, fpSummaryText, fpCopySummary,
        taxBuiltin, taxClone, taxTableLoad, taxTableSave, taxTableChanged, taxYearsOf, taxDefaultYear, taxProblems, taxBracketsFor,
        tbToolId, tbYearOf, tbMoney, tbInit, tbRender, tbRefreshDerived, tbReadStatus, tbStore, tbOnInput, tbAddBracket, tbRemoveBracket,
        tbSetYear, tbPickYear, tbAddYear, tbDeleteYear, tbResetYear, taxOpenBrackets, calcEach, calcPopupFill, calcPopupRead, loanPopupFill, growthPopupFill, taxPopupFill, calcField, calcSync, calcReset, calculateTax, calculateTaxIn, calculateLoan, calculateLoanIn, loanMoney, loanSpan, loanClosingOf, loanMonth, loanMonthText, loanPaymentsMade, loanScheduled, loanScheduleText, loanPayDown, loanFromBalance, calculateGrowth, calculateGrowthIn];
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
        'window.TAX_TABLE_KEY = ' + JSON.stringify(TAX_TABLE_KEY) + ';\n' +
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
    content: '<div class="calc-widget" data-calc="tax"><button type="button" class="calc-reset" hidden onclick="calcReset(this, \'tax\')" title="Put every field back to its default">Reset</button><div class="calc-grid"><div><label>Annual Income</label><input type="number" id="taxIncome" value="75000" oninput="calculateTax(this)"></div><div><label>Filing Status</label><select id="taxStatus" onchange="calculateTax(this)"><option value="single">Single</option><option value="married">Married Filing Jointly</option></select></div><div><label>Tax Year</label><select id="taxYear" onchange="calculateTax(this)" title="Which year’s brackets, from Tax Brackets"><option value="">This year</option></select></div></div><div id="taxResults"></div></div>',
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
    content: '<div class="calc-widget fp-widget"></div>',
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

// Tax Brackets: the brackets and standard deductions every Tax Calculator uses, by year
PluginRegistry.registerTool({
    id: 'tax-brackets',
    name: 'Tax Brackets',
    description: 'Federal tax brackets and standard deductions by year, shared by every Tax Calculator',
    icon: '📊',
    version: '1.0.0',
    toolbox: 'finance',
    tags: ['tax', 'bracket', 'deduction', 'year', 'settings'],
    title: 'Tax Brackets',
    content: '<div class="calc-widget tb-widget"></div>',
    onInit: 'tbInit',
    defaultWidth: 420,
    defaultHeight: 560,
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
