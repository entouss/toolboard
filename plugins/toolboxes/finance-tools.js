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
    if (document.getElementById('taxResults')) calculateTax();
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

function calculateTax() {
    // The years come from the shared table, so the list is made before the saved
    // choice is put back into it.
    const table = taxTableLoad();
    const yearEl = document.getElementById('taxYear');
    if (yearEl) {
        const keep = yearEl.value;
        const auto = taxDefaultYear(table);
        const thisYear = String(new Date().getFullYear());
        yearEl.innerHTML = '<option value="">' + (auto === thisYear ? 'This year' : 'Latest') + ' (' + auto + ')</option>' +
            taxYearsOf(table).map(y => '<option value="' + y + '">' + y + '</option>').join('');
        yearEl.value = keep && table.years[keep] ? keep : '';
    }
    calcSync('tax');
    const incomeEl = document.getElementById('taxIncome');
    const statusEl = document.getElementById('taxStatus');
    const resultsEl = document.getElementById('taxResults');
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

function calcWidgetOf(kind) {
    const first = document.getElementById(CALC_FIELDS[kind][0]) ||
        document.querySelector('input[name="' + CALC_FIELDS[kind][0] + '"]');
    return first ? first.closest('.calc-widget') : null;
}

/**
 * The first time a calculator is worked out, its saved values go back in; every time
 * after, what is in it is saved. Called at the top of each calculate function, so the
 * figures are always worked out from what is shown.
 */
function calcSync(kind) {
    const widget = calcWidgetOf(kind);
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
    ({ loan: calculateLoan, growth: calculateGrowth, tax: calculateTax })[kind]();
}

function calculateLoan() {
    calcSync('loan');
    const amountEl = document.getElementById('loanAmount');
    const rateEl = document.getElementById('loanRate');
    const yearsEl = document.getElementById('loanYears');
    const extraEl = document.getElementById('loanExtra');
    const resultsEl = document.getElementById('loanResults');
    if (!amountEl || !rateEl || !yearsEl || !resultsEl) return;

    const principal = parseFloat(amountEl.value) || 0;
    const annualRate = (parseFloat(rateEl.value) || 0) / 100;
    const years = parseInt(yearsEl.value) || 0;
    const extraPayment = parseFloat(extraEl.value) || 0;
    const monthlyRate = annualRate / 12;
    const numPayments = years * 12;

    if (principal <= 0 || annualRate <= 0 || years <= 0) {
        resultsEl.innerHTML = '<div style="color:#7f8c8d;text-align:center;padding:20px;">Enter loan details above</div>';
        return;
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    // A loan already under way: the balance today, paid down at the payment the
    // original loan set — a fixed-rate payment does not change as the balance does.
    const currentEl = document.getElementById('loanCurrent');
    const current = currentEl ? parseFloat(currentEl.value) : NaN;
    const closing = loanClosingOf();
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
function loanClosingOf() {
    const el = document.getElementById('loanClosing');
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

function calculateGrowth() {
    calcSync('growth');
    const initialEl = document.getElementById('growthInitial');
    const monthlyEl = document.getElementById('growthMonthly');
    const rateEl = document.getElementById('growthRate');
    const yearsEl = document.getElementById('growthYears');
    const resultsEl = document.getElementById('growthResults');
    const compoundEl = document.querySelector('input[name="growthCompound"]:checked');
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

// Inject JavaScript functions into DOM for HTML export using base64 encoding
// The injected script only defines things if they don't already exist (for exported HTML)
(function injectScriptsForExport() {
    if (document.getElementById('finance-tools-scripts')) return;

    const functionsToExport = [taxBuiltin, taxClone, taxTableLoad, taxTableSave, taxTableChanged, taxYearsOf, taxDefaultYear, taxProblems, taxBracketsFor,
        tbToolId, tbYearOf, tbMoney, tbInit, tbRender, tbRefreshDerived, tbReadStatus, tbStore, tbOnInput, tbAddBracket, tbRemoveBracket,
        tbSetYear, tbPickYear, tbAddYear, tbDeleteYear, tbResetYear, taxOpenBrackets, calcField, calcWidgetOf, calcSync, calcReset, calculateTax, calculateLoan, loanMoney, loanSpan, loanClosingOf, loanMonth, loanMonthText, loanPaymentsMade, loanScheduled, loanScheduleText, loanPayDown, loanFromBalance, calculateGrowth];
    // Wrap in IIFE that checks if already defined (plugin loaded) vs needs defining (exported HTML)
    const code = '(function() {\n' +
        'if (typeof calculateTax !== "undefined") return;\n' +
        'window.taxBrackets = ' + JSON.stringify(taxBrackets) + ';\n' +
        'window.CALC_FIELDS = ' + JSON.stringify(CALC_FIELDS) + ';\n' +
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
    tools: ['dynamic-investment-calculator', 'dynamic-tax-calculator', 'tax-brackets', 'loan-calculator'],
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
    content: '<div class="calc-widget"><button type="button" class="calc-reset" hidden onclick="calcReset(this, \'growth\')" title="Put every field back to its default">Reset</button><div class="calc-grid"><div><label>Initial Investment</label><input type="number" id="growthInitial" value="10000" oninput="calculateGrowth()"></div><div><label>Monthly Contribution</label><input type="number" id="growthMonthly" value="500" oninput="calculateGrowth()"></div><div><label>Annual Return %</label><input type="number" id="growthRate" value="7" step="0.1" oninput="calculateGrowth()"></div><div><label>Years</label><input type="number" id="growthYears" value="30" oninput="calculateGrowth()"></div></div><div style="margin-bottom:15px;"><label>Compounding</label><div class="calc-toggle"><label><input type="radio" name="growthCompound" value="monthly" checked onchange="calculateGrowth()"><span>Monthly</span></label><label><input type="radio" name="growthCompound" value="annual" onchange="calculateGrowth()"><span>Annual</span></label></div></div><div id="growthResults"></div></div>',
    onInit: 'calculateGrowth',
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
    content: '<div class="calc-widget"><button type="button" class="calc-reset" hidden onclick="calcReset(this, \'tax\')" title="Put every field back to its default">Reset</button><div class="calc-grid"><div><label>Annual Income</label><input type="number" id="taxIncome" value="75000" oninput="calculateTax()"></div><div><label>Filing Status</label><select id="taxStatus" onchange="calculateTax()"><option value="single">Single</option><option value="married">Married Filing Jointly</option></select></div><div><label>Tax Year</label><select id="taxYear" onchange="calculateTax()" title="Which year’s brackets, from Tax Brackets"><option value="">This year</option></select></div></div><div id="taxResults"></div></div>',
    onInit: 'calculateTax',
    defaultWidth: 360,
    defaultHeight: 400,
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
    content: '<div class="calc-widget"><button type="button" class="calc-reset" hidden onclick="calcReset(this, \'loan\')" title="Put every field back to its default">Reset</button><div class="calc-grid"><div><label>Original Amount</label><input type="number" id="loanAmount" value="300000" oninput="calculateLoan()"></div><div><label>Current Balance</label><input type="number" id="loanCurrent" placeholder="Same as original" title="What is owed today, for a loan already under way. Empty for a new loan." oninput="calculateLoan()"></div><div><label>Interest Rate %</label><input type="number" id="loanRate" value="6.5" step="0.125" oninput="calculateLoan()"></div><div><label>Loan Term (Years)</label><input type="number" id="loanYears" value="30" oninput="calculateLoan()"></div><div><label>Extra Payment/mo</label><input type="number" id="loanExtra" value="0" oninput="calculateLoan()"></div><div><label>Closing Date</label><input type="date" id="loanClosing" title="The day the loan closed, if it has: payments are counted monthly from the month after" oninput="calculateLoan()"></div></div><div id="loanResults"></div></div>',
    onInit: 'calculateLoan',
    defaultWidth: 380,
    defaultHeight: 450,
    source: 'external'
});

console.log('Finance Tools plugin loaded');
