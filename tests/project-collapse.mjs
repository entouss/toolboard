// The Project Table's folding: a row with sub-tasks folds them out of sight, in the
// table and the chart, with how many it holds on the button. It is a way of looking,
// kept with the tool's view rather than in the plan: totals, exports and the plan's
// own data still have every row. Rows put under a folded row open it.
//
// The clock is Playwright's, fixed at 31 October 2026.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.clock.install({ time: new Date(2026, 9, 31, 10, 0, 0) });
await page.goto('http://localhost:8777/index.html#tool/project-table');
await page.waitForSelector('.proj-widget', { timeout: 25000 });
await page.waitForTimeout(1500);
const id = await page.evaluate(() => document.querySelector('.proj-widget').closest('.tool').dataset.tool);
const T = '.tool[data-tool="' + id + '"] ';

// Discovery > Build > Launch, and Wrap up on its own.
await page.evaluate((i) => {
    const d = projGetData(i);
    d.rows = projSeedData().rows;
    d.rows.find(r => r.id === 'r-build').parent = 'r-discovery';
    d.rows.find(r => r.id === 'r-launch').parent = 'r-build';
    d.rows.push({ id: 'r-wrap', cells: { item: 'Wrap up', size: 'S', pct: 0, deps: [], links: [] } });
    projSetData(i, d);
    projRender(document.querySelector('.tool[data-tool="' + i + '"] .proj-widget'), i);
}, id);
await page.waitForTimeout(300);

const view = () => page.evaluate((s) => ({
    table: Array.from(document.querySelectorAll(s + '.proj-table tbody tr[data-row]')).map(t => t.dataset.row).join(','),
    chart: Array.from(document.querySelectorAll(s + '.proj-gantt-row .proj-gantt-name')).map(n => n.textContent).join(','),
    folds: Array.from(document.querySelectorAll(s + '.proj-fold')).map(b => b.dataset.row + ':' + b.getAttribute('aria-expanded') + ':' + b.textContent +
        ((c) => c ? c.textContent : '')(b.closest('.proj-row-tools').querySelector('.proj-fold-count'))).join(','),
    all: (() => { const b = document.querySelector(s + '.proj-fold-all'); return b.hidden ? 'hidden' : b.textContent; })()
}), T);
const folded = () => page.evaluate((i) => (toolCustomizations[i] || {}).projFolded || [], id);
const fold = (row) => page.click(T + '.proj-fold[data-row="' + row + '"]');

let v = await view();
ok('every row in sight to begin with', v.table === 'r-discovery,r-build,r-launch,r-wrap', v.table);
ok('a ▾ on each row with sub-tasks, and none on the others', v.folds === 'r-discovery:true:▾,r-build:true:▾', v.folds);
ok('a gap where there is nothing to fold', await page.locator(T + 'tr[data-row="r-wrap"] .proj-fold-gap').count() === 1);
const handles = () => page.evaluate((s) => ['r-discovery', 'r-wrap'].map(r => Math.round(document.querySelector(s + 'tr[data-row="' + r + '"] .proj-handle').getBoundingClientRect().left)).join(','), T);
ok('Collapse all, since there is something to collapse', v.all === 'Collapse all', v.all);
const total = () => page.evaluate((s) => Array.from(document.querySelector(s + 'tr[data-row="r-discovery"]').children).slice(1).map(td => td.textContent).join('|'), T);
const before = await total();

// 1. One row folded.
await fold('r-discovery');
await page.waitForTimeout(200);
v = await view();
ok('folded: its sub-tasks leave the table, at every level', v.table === 'r-discovery,r-wrap', v.table);
ok('and the chart', v.chart === '▸Discovery,Wrap up', v.chart);
ok('the button says it is folded, and how many it holds', v.folds === 'r-discovery:false:▸2', v.folds);
ok('the handles of rows at one level still line up, folded or not', /^(\d+),\1$/.test(await handles()), await handles());
ok('the folded row still adds up what it holds', (await total()) === before, (await total()) + ' | ' + before);
ok('kept with the view', JSON.stringify(await folded()) === '["r-discovery"]');
ok('and not in the plan: every row still there, nothing about folding in it', await page.evaluate((i) => {
    const d = projGetData(i);
    return d.rows.length === 4 && !JSON.stringify(d).includes('old') && projToCsv(d).includes('Launch');
}, id));
ok('the button keeps the focus, to press again', await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('proj-fold')));

await page.reload();
await page.waitForSelector(T + '.proj-widget', { timeout: 25000 });
await page.waitForTimeout(1200);
ok('a reload keeps it folded', (await view()).table === 'r-discovery,r-wrap');

await fold('r-discovery');
await page.waitForTimeout(200);
ok('pressed again, all back', (await view()).table === 'r-discovery,r-build,r-launch,r-wrap' && (await folded()).length === 0);

// 2. A fold inside a fold.
await fold('r-build');
await page.waitForTimeout(200);
v = await view();
ok('a sub-task folds what is under it, and only that', v.table === 'r-discovery,r-build,r-wrap' && v.folds === 'r-discovery:true:▾,r-build:false:▸1', JSON.stringify(v));

// 3. Collapse all, Expand all.
await page.click(T + '.proj-fold-all');
await page.waitForTimeout(200);
v = await view();
ok('Collapse all folds every row with sub-tasks', v.table === 'r-discovery,r-wrap' && (await folded()).sort().join() === 'r-build,r-discovery', JSON.stringify(v));
ok('and becomes Expand all', v.all === 'Expand all');
await page.click(T + '.proj-fold-all');
await page.waitForTimeout(200);
v = await view();
ok('Expand all opens them all', v.table === 'r-discovery,r-build,r-launch,r-wrap' && (await folded()).length === 0 && v.all === 'Collapse all', JSON.stringify(v));

// 4. Nothing lands out of sight.
await fold('r-discovery');
await page.waitForTimeout(200);
await page.click(T + 'tr[data-row="r-wrap"] .proj-nest[title="Make this a sub-item"]');
await page.waitForTimeout(300);
v = await view();
ok('a row indented under a folded row opens it, and is in sight', v.table === 'r-discovery,r-build,r-launch,r-wrap' &&
    (await page.evaluate((i) => projGetData(i).rows.find(r => r.id === 'r-wrap').parent, id)) === 'r-discovery' && (await folded()).length === 0, JSON.stringify(v));
await fold('r-build');
await fold('r-discovery');
await page.waitForTimeout(200);
await page.evaluate((i) => projAIApply(i, '', 'insert', { row: { id: 'r-build' } }, { action: 'breakdown', data: [{ task: 'Check', size: 'S', after: null }] }), id);
await page.waitForTimeout(300);
v = await view();
ok('sub-tasks from ✨ Break down open the row, and every row it hangs from', /^r-discovery,r-build,r-launch,r-[\w-]+,r-wrap$/.test(v.table) && (await folded()).length === 0, v.table);

// 5. Nothing to fold.
await page.evaluate((i) => { const d = projGetData(i); d.rows.forEach(r => { delete r.parent; }); projSetData(i, d);
    projRender(document.querySelector('.tool[data-tool="' + i + '"] .proj-widget'), i); }, id);
await page.waitForTimeout(200);
v = await view();
ok('a plan without sub-tasks has no fold buttons and no Collapse all', v.folds === '' && v.all === 'hidden', JSON.stringify(v));
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
