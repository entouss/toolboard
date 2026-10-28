// A note's tables, as they read: a heading sorts its column, ▾ filters by it, ‹ folds
// it away and its edge sizes it, with a box above a longer table to filter its rows.
// None of it is the Markdown's: it is kept with the note, the editors and Copy see
// the table as written.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1200, height: 850 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:8777/index.html');
await page.waitForSelector('#toolboard', { timeout: 20000 });
await page.waitForTimeout(1000);

const MD = '# Plan\n\n' +
    '| Task | Status | Due | Cost | Owner |\n|---|---|---|---:|---|\n' +
    '| Write plan | Done | 2026-03-04 | $1,200 | Sam |\n' +
    '| Review | Open | 2026-01-15 | $80 | Alex |\n' +
    '| Ship | Blocked | 2026-02-20 | $15.50 | |\n' +
    '| Test 10 | Open | | $300 | Pat |\n' +
    '| Test 9 | Done | 2026-05-01 | $2 | Sam |\n' +
    '| Docs | Open | 2026-04-11 | $45 | Alex |\n\n' +
    'Small:\n\n| A | B |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |\n\n' +
    'Blank:\n\n|   |   |\n|---|---|\n| x | y |\n\nThe end.';
const make = () => page.evaluate((md) => {
    const id = createNoteWithText(md, 'Plan');
    setToolMode(id, 'render');
    const t = document.querySelector('.tool[data-tool="' + id + '"]');
    maxZ++; t.style.zIndex = maxZ;
    return id;
}, MD);
const note = await make();
await page.waitForTimeout(600);
const sel = (id, s) => '.tool[data-tool="' + id + '"] .authoring-result ' + s;
const T = (id) => sel(id, '.note-table[data-table-index="0"]');
const th = (id, c) => T(id) + ' th[data-col="' + c + '"]';
const tasks = (id) => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' tbody tr'))
    .filter(tr => !tr.hidden).map(tr => tr.cells[0].textContent.trim()), T(id));
const view = (id) => page.evaluate((i) => JSON.parse(JSON.stringify((toolCustomizations[i].tableViews || {})[0] || {})), id);
const md = (id) => page.evaluate((i) => toolCustomizations[i].customContent, id);
const ORIGINAL = ['Write plan', 'Review', 'Ship', 'Test 10', 'Test 9', 'Docs'];
// The row filter as the box would set it; the box itself is the pager's companion.
const query = (id, text) => page.evaluate(([s, text]) => {
    const q = document.querySelector(s + ' .note-table-q');
    q.value = text;
    noteTableQuery(q);
}, [T(id), text]);

// 1. Which tables get it.
ok('a table with headings gets the controls', await page.locator(T(note) + ' .note-th-sort').count() === 5);
// The box to filter rows comes with the pager (note-table-pages); these fit on a page.
ok('a table that fits on a page has no box to filter its rows', !(await page.isVisible(T(note) + ' .note-table-q')));
ok('nor any bar at all while nothing is filtered or moved', await page.evaluate((s) => document.querySelector(s + ' .note-table-bar').hidden,
    sel(note, '.note-table[data-table-index="1"]')));
ok('a table whose headings are all blank is left as it is', await page.evaluate((s) =>
    document.querySelectorAll(s + ' .note-table').length === 2 && document.querySelectorAll(s + ' table').length === 3,
    sel(note, '')));
ok('a heading keeps its alignment', await page.evaluate((s) => getComputedStyle(document.querySelector(s + ' .note-th')).justifyContent, th(note, 3)) === 'flex-end');

// 2. Sorting.
await page.click(th(note, 0) + ' .note-th-sort');
ok('a heading sorts its column up', JSON.stringify(await tasks(note)) === JSON.stringify(['Docs', 'Review', 'Ship', 'Test 9', 'Test 10', 'Write plan']), JSON.stringify(await tasks(note)));
ok('saying so', await page.evaluate((s) => document.querySelector(s).getAttribute('aria-sort'), th(note, 0)) === 'ascending' &&
    await page.textContent(th(note, 0) + ' .note-th-arrow') === '▲');
await page.click(th(note, 0) + ' .note-th-sort');
ok('then down', JSON.stringify(await tasks(note)) === JSON.stringify(['Write plan', 'Test 10', 'Test 9', 'Ship', 'Review', 'Docs']), JSON.stringify(await tasks(note)));
await page.click(th(note, 0) + ' .note-th-sort');
ok('then back to the order it was written in', JSON.stringify(await tasks(note)) === JSON.stringify(ORIGINAL) &&
    !(await page.evaluate((s) => document.querySelector(s).hasAttribute('aria-sort'), th(note, 0))));
await page.click(th(note, 3) + ' .note-th-sort');
ok('money sorts as numbers', JSON.stringify(await tasks(note)) === JSON.stringify(['Test 9', 'Ship', 'Docs', 'Review', 'Test 10', 'Write plan']), JSON.stringify(await tasks(note)));
await page.click(th(note, 2) + ' .note-th-sort');
ok('dates sort as dates, an empty one last', JSON.stringify(await tasks(note)) === JSON.stringify(['Review', 'Ship', 'Write plan', 'Docs', 'Test 9', 'Test 10']), JSON.stringify(await tasks(note)));
await page.click(th(note, 2) + ' .note-th-sort');
ok('and last the other way too', JSON.stringify(await tasks(note)) === JSON.stringify(['Test 9', 'Docs', 'Write plan', 'Ship', 'Review', 'Test 10']), JSON.stringify(await tasks(note)));
ok('the sort is kept with the note', JSON.stringify((await view(note)).sort) === JSON.stringify({ col: 2, dir: 'desc' }));
await page.dblclick(th(note, 1) + ' .note-th-sort');
await page.waitForTimeout(200);
ok('a double-click on a heading is two sorts, not a way into the editor', await page.evaluate((i) => getToolMode(i), note) === 'render');
// Up and down: one more and it is back as written.
await page.click(th(note, 1) + ' .note-th-sort');
ok('which leaves it as written after one more', !(await view(note)).sort);

// 3. Filtering every row.
await query(note, 'sam');
ok('the box keeps rows with the words in any cell', JSON.stringify(await tasks(note)) === JSON.stringify(['Write plan', 'Test 9']), JSON.stringify(await tasks(note)));
ok('and says how many', await page.textContent(T(note) + ' .note-table-count') === '2 of 6 rows');
ok('while it filters, the bar shows what it is filtering by', await page.isVisible(T(note) + ' .note-table-q') &&
    await page.inputValue(T(note) + ' .note-table-q') === 'sam');
ok('the filter is kept with the note', (await view(note)).q === 'sam');
await page.click(T(note) + ' .note-table-clear');
ok('Clear shows every row again', (await tasks(note)).length === 6 && await page.textContent(T(note) + ' .note-table-count') === '' &&
    await page.inputValue(T(note) + ' .note-table-q') === '');

// 4. Filtering by a column.
await page.hover(th(note, 1));
await page.click(th(note, 1) + ' .note-th-filter');
const pop = T(note) + ' .note-table-pop';
ok('▾ opens the column’s filter', await page.isVisible(pop));
ok('listing its values, with how often each comes', JSON.stringify(await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' label'))
    .map(l => l.textContent), pop)) === JSON.stringify(['Blocked1', 'Done2', 'Open3']));
await page.uncheck(pop + ' input[value="Open"]');
ok('untick a value and its rows go', JSON.stringify(await tasks(note)) === JSON.stringify(['Write plan', 'Ship', 'Test 9']), JSON.stringify(await tasks(note)));
ok('the heading shows it is filtered', await page.evaluate((s) => document.querySelector(s).classList.contains('note-col-filtered'), th(note, 1)));
await page.fill(pop + ' .note-table-pop-q', 'do');
ok('words narrow it further', JSON.stringify(await tasks(note)) === JSON.stringify(['Write plan', 'Test 9']));
ok('kept with the note', JSON.stringify((await view(note)).filters) === JSON.stringify({ 1: { out: ['Open'], q: 'do' } }), JSON.stringify((await view(note)).filters));
await page.keyboard.press('Escape');
ok('Escape closes it', !(await page.isVisible(pop)));
await page.click(sel(note, 'h1'));
await page.click(th(note, 1) + ' .note-th-filter');
await page.click(pop + ' button:has-text("None")');
ok('None hides every row', (await tasks(note)).length === 0 && await page.textContent(T(note) + ' .note-table-count') === '0 of 6 rows');
await page.click(pop + ' button:has-text("Clear")');
ok('the filter’s own Clear lets them all back', (await tasks(note)).length === 6 && !(await view(note)).filters);
await page.mouse.click(5, 5);
ok('a click elsewhere closes it', !(await page.isVisible(pop)));

// 5. Folding.
await page.hover(th(note, 4));
await page.click(th(note, 4) + ' .note-th-fold');
const folded = await page.evaluate((s) => {
    const h = document.querySelector(s);
    const cell = document.querySelector(s.replace(/ th\[.*$/, '') + ' tbody tr td:nth-child(5)');
    return { cls: h.classList.contains('note-col-folded'), w: h.getBoundingClientRect().width,
        strip: getComputedStyle(h.querySelector('.note-th-folded')).writingMode, text: cell.textContent };
}, th(note, 4));
ok('‹ folds a column to a strip with its heading on its side', folded.cls && folded.w <= 20 && folded.strip === 'vertical-rl', JSON.stringify(folded));
ok('its cells keep their words', folded.text === 'Sam', JSON.stringify(folded.text));
ok('kept with the note', JSON.stringify((await view(note)).folded) === JSON.stringify([4]));
await query(note, 'pat');
ok('a filter still reads a folded column', JSON.stringify(await tasks(note)) === JSON.stringify(['Test 10']));
await page.click(T(note) + ' .note-table-clear');

// 6. Sizing.
const box = await page.locator(th(note, 0) + ' .note-th-resize').boundingBox();
const before = await page.evaluate((s) => document.querySelector(s).offsetWidth, th(note, 0));
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, { steps: 5 });
await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2, { steps: 5 });
await page.mouse.up();
const after = await page.evaluate((s) => document.querySelector(s).offsetWidth, th(note, 0));
ok('dragging a heading’s edge widens the column', Math.abs(after - (before + 120)) <= 3, before + ' → ' + after);
ok('kept with the note', Math.abs((await view(note)).widths[0] - (before + 120)) <= 1, JSON.stringify((await view(note)).widths));
ok('the rest of the table still fills the note', await page.evaluate((s) => !document.querySelector(s + ' table').classList.contains('note-table-sized'), T(note)));
await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 - 40, box.y + box.height / 2, { steps: 8 });
await page.mouse.up();
const narrow = await page.evaluate((s) => document.querySelector(s).offsetWidth, th(note, 0));
ok('and narrower than its words', narrow < before && Math.abs(narrow - (before - 40)) <= 3, before + ' → ' + narrow);
ok('the words wrap to fit', await page.evaluate((s) => document.querySelector(s + ' tbody tr td').offsetWidth, T(note)) === narrow);
ok('sizing does not open the editor', await page.evaluate((i) => getToolMode(i), note) === 'render');

// 7. The Markdown is the table as written, and the view survives a reload.
ok('none of it touches the Markdown', await md(note) === MD);
await page.click(th(note, 3) + ' .note-th-sort');
await page.reload();
await page.waitForTimeout(1200);
ok('after a reload it is still sorted', JSON.stringify(await tasks(note)) === JSON.stringify(['Test 9', 'Ship', 'Docs', 'Review', 'Test 10', 'Write plan']), JSON.stringify(await tasks(note)));
ok('still folded and sized', await page.evaluate((s) => document.querySelector(s).classList.contains('note-col-folded'), th(note, 4)) &&
    await page.evaluate((s) => document.querySelector(s).offsetWidth, th(note, 0)) === narrow);
const other = await make();
await page.waitForTimeout(500);
ok('another note with the same table has its own', JSON.stringify(await tasks(other)) === JSON.stringify(ORIGINAL) &&
    !(await page.evaluate((s) => document.querySelector(s).classList.contains('note-col-folded'), th(other, 4))));

// 8. Double-click an edge to put the width back; unfold from the strip.
await page.evaluate((i) => { const t = document.querySelector('.tool[data-tool="' + i + '"]'); maxZ++; t.style.zIndex = maxZ; }, note);
await page.dblclick(th(note, 0) + ' .note-th-resize');
await page.waitForTimeout(200);
ok('a double-click on the edge puts the width back', !(await view(note)).widths &&
    await page.evaluate((i) => getToolMode(i), note) === 'render');

// 9. Copy copies the table as it was written.
await query(note, 'alex');
await page.evaluate((i) => noteCopyRendered(document.querySelector('.tool[data-tool="' + i + '"] .note-copy-rich')), note);
await page.waitForTimeout(400);
const copied = await page.evaluate(async () => {
    const items = await navigator.clipboard.read();
    const html = items[0].types.includes('text/html') ? await (await items[0].getType('text/html')).text() : '';
    const text = items[0].types.includes('text/plain') ? await (await items[0].getType('text/plain')).text() : '';
    return { html, text };
});
const order = ORIGINAL.map(t => copied.text.indexOf(t));
ok('Copy formatted copies every row, in the order written', order.every((x, i) => x >= 0 && (i === 0 || x > order[i - 1])), JSON.stringify(order));
ok('and every column, folded or not', /Owner/.test(copied.text) && /Pat/.test(copied.text));
ok('with none of the controls', !/note-th|note-table|Filter rows|aria-sort|hidden|▾|‹/.test(copied.html), copied.html.slice(0, 300));
ok('the page itself is left as it was', (await tasks(note)).length === 2 &&
    await page.evaluate((s) => document.querySelector(s).classList.contains('note-col-folded'), th(note, 4)));
await page.click(T(note) + ' .note-table-clear');
await page.click(th(note, 4) + ' .note-th-folded');
ok('clicking the strip unfolds the column', !(await page.evaluate((s) => document.querySelector(s).classList.contains('note-col-folded'), th(note, 4))) &&
    !(await view(note)).folded);

// 10. Not in the editor.
await page.click(th(note, 4) + ' .note-th-fold');
ok('the rich editor shows the table as written', await page.evaluate((i) => {
    setToolMode(i, 'edit');
    const surface = document.querySelector('.tool[data-tool="' + i + '"] .note-rich');
    const rows = Array.from(surface.querySelector('table').rows).slice(1).map(tr => tr.cells[0].textContent.trim());
    return surface.querySelectorAll('.note-th, .note-table-bar').length === 0 && rows.join() === 'Write plan,Review,Ship,Test 10,Test 9,Docs' ||
        surface.innerHTML.slice(0, 600);
}, note) === true, await page.evaluate((i) => document.querySelector('.tool[data-tool="' + i + '"] .note-rich').innerHTML.replace(/\s+/g, ' ').slice(0, 400), note));
// The editor writes a table's Markdown its own way (| --- |), view or no view; what
// matters is that it writes the same for a note whose table was never touched.
const saved = (i) => page.evaluate((i) => {
    setToolMode(i, 'edit');
    noteRichSave(document.querySelector('.tool[data-tool="' + i + '"] .note-rich'));
    return toolCustomizations[i].customContent;
}, i);
const plain = await saved(other);
await page.evaluate((i) => setToolMode(i, 'render'), other);
ok('and saves it as it was', await saved(note) === plain && plain.indexOf('Write plan') < plain.indexOf('Docs'), JSON.stringify(await md(note)));
await page.evaluate((i) => setToolMode(i, 'render'), note);
await page.waitForTimeout(300);

// 11. Printing shows every column and none of the controls.
await page.emulateMedia({ media: 'print' });
ok('printed, a folded column is whole and the controls are gone', await page.evaluate(([t, f]) =>
    getComputedStyle(document.querySelector(t + ' .note-table-bar')).display === 'none' &&
    getComputedStyle(document.querySelector(f + ' .note-th')).display === 'flex' &&
    document.querySelector(t + ' tbody td:nth-child(5)').getBoundingClientRect().width > 20, [T(note), th(note, 4)]));
await page.emulateMedia({ media: 'screen' });

// Screenshots: filtered, sorted, one column folded, the column filter open.
await page.evaluate((i) => { const t = document.querySelector('.tool[data-tool="' + i + '"]'); maxZ++; t.style.zIndex = maxZ; }, note);
await page.hover(th(note, 1));
await page.click(th(note, 1) + ' .note-th-filter');
await page.uncheck(T(note) + ' .note-table-pop input[value="Blocked"]');
await page.screenshot({ path: OUT + '/note-tables.png' });
await page.evaluate(() => document.body.classList.add('dark-mode'));
await page.waitForTimeout(150);
await page.screenshot({ path: OUT + '/note-tables-dark.png' });

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
