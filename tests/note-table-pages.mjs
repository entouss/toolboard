// A note's long table comes a page at a time, and its columns can be moved: by the
// grip that shows in a heading, or Move left / Move right in its ▾. As with the rest
// of a table's view, both are kept with the note and neither touches the Markdown.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1200, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:8777/index.html');
await page.waitForSelector('#toolboard', { timeout: 20000 });
await page.waitForTimeout(1000);

const TEAMS = ['Red', 'Blue', 'Green'];
const MD = '# Roster\n\n| # | Name | Team | Score |\n|---|---|---|---|\n' +
    Array.from({ length: 60 }, (_, i) => '| ' + (i + 1) + ' | Person ' + (i + 1) + ' | ' + TEAMS[(i + 1) % 3] + ' | ' + ((i + 1) * 7 % 100) + ' |').join('\n') +
    '\n\nShort:\n\n| A | B | C |\n|---|---|---|\n| 1 | 2 | 3 |\n\nThe end.';
const make = () => page.evaluate((md) => {
    const id = createNoteWithText(md, 'Roster');
    setToolMode(id, 'render');
    const t = document.querySelector('.tool[data-tool="' + id + '"]');
    t.style.width = '700px'; t.style.height = '900px';
    maxZ++; t.style.zIndex = maxZ;
    return id;
}, MD);
let note = await make();
await page.waitForTimeout(600);
const T = (id, i = 0) => '.tool[data-tool="' + id + '"] .authoring-result .note-table[data-table-index="' + i + '"]';
const th = (id, c, i = 0) => T(id, i) + ' th[data-col="' + c + '"]';
const shown = (id) => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' tbody tr'))
    .filter(tr => tr.getClientRects().length).map(tr => tr.cells[0].textContent.trim()), T(id));
const range = (id) => page.textContent(T(id) + ' .note-table-range');
const pages = (id) => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .note-table-page'))
    .map(b => (b.classList.contains('active') ? '[' : '') + b.textContent + (b.disabled ? '-' : '') + (b.classList.contains('active') ? ']' : '')).join(' '), T(id));
const heads = (id, i = 0) => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' thead th'))
    .map(h => h.querySelector('.note-th-label').textContent), T(id, i));
const firstRow = (id) => page.evaluate((s) => Array.from(document.querySelector(s + ' tbody tr').cells).map(c => c.textContent), T(id));
const view = (id, i = 0) => page.evaluate(([n, i]) => JSON.parse(JSON.stringify((toolCustomizations[n].tableViews || {})[i] || {})), [id, i]);
const nums = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i));
const same = (x, y) => JSON.stringify(x) === JSON.stringify(y);

// 1. Pages.
ok('a table of 60 rows comes 25 to a page', same(await shown(note), nums(1, 25)), JSON.stringify(await shown(note)));
ok('saying which', await range(note) === '1–25 of 60');
ok('with a button for each page', await pages(note) === '‹- [1] 2 3 ›', await pages(note));
ok('the box to filter rows comes with the pager', await page.isVisible(T(note) + ' .note-table-q'));
ok('a short table has no pager', await page.evaluate((s) => document.querySelector(s + ' .note-table-pager').hidden, T(note, 1)));
await page.click(T(note) + ' .note-table-page[aria-label="Next page"]');
ok('› goes to the next page', same(await shown(note), nums(26, 50)) && await range(note) === '26–50 of 60');
await page.click(T(note) + ' .note-table-page[aria-label="Page 3"]');
ok('a number goes to that page', same(await shown(note), nums(51, 60)) && await pages(note) === '‹ 1 2 [3] ›-', await pages(note));
ok('the page you are on is not the note’s to keep', !('page' in await view(note)));

await page.fill(T(note) + ' .note-table-q', 'red');
ok('a filter goes back to the first page of what it leaves', await range(note) === '1–20 of 20' && (await shown(note)).length === 20, await range(note));
ok('one page needs no buttons', await pages(note) === '');
ok('the filter still says how many of all of them', await page.textContent(T(note) + ' .note-table-count') === '20 of 60 rows');
await page.click(T(note) + ' .note-table-clear');

await page.selectOption(T(note) + ' .note-table-size select', '10');
ok('rows per page can be changed', same(await shown(note), nums(1, 10)) && await range(note) === '1–10 of 60');
ok('kept with the note', (await view(note)).pageSize === 10);
ok('far pages fold into a gap', await pages(note) === '‹- [1] 2 6 ›' &&
    await page.evaluate((s) => !!document.querySelector(s + ' .note-table-gap'), T(note)), await pages(note));
await page.click(T(note) + ' .note-table-page[aria-label="Page 6"]');
await page.click(T(note) + ' .note-table-page[aria-label="Previous page"]');
ok('‹ goes back one', same(await shown(note), nums(41, 50)) && await pages(note) === '‹ 1 4 [5] 6 ›', await pages(note));
await page.click(th(note, 3) + ' .note-th-sort');
const scores = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' tbody tr'))
    .filter(tr => tr.getClientRects().length).map(tr => +tr.cells[3].textContent), T(note));
ok('sorting goes back to the first page, sorted', await range(note) === '1–10 of 60' && scores.every((v, i) => !i || v >= scores[i - 1]) && scores[0] === 1, JSON.stringify(scores));
await page.click(th(note, 3) + ' .note-th-sort');
await page.click(th(note, 3) + ' .note-th-sort');
await page.selectOption(T(note) + ' .note-table-size select', 'all');
ok('All shows every row', (await shown(note)).length === 60 && await range(note) === '1–60 of 60' && await pages(note) === '');
ok('and is kept as All', (await view(note)).pageSize === 'all');

// Printing and copying are not paged.
await page.selectOption(T(note) + ' .note-table-size select', '25');
await page.emulateMedia({ media: 'print' });
ok('printed, every row is there', (await shown(note)).length === 60);
await page.emulateMedia({ media: 'screen' });
ok('and on screen still a page', (await shown(note)).length === 25);
await page.evaluate((i) => noteCopyRendered(document.querySelector('.tool[data-tool="' + i + '"] .note-copy-rich')), note);
await page.waitForTimeout(400);
let copied = await page.evaluate(async () => {
    const items = await navigator.clipboard.read();
    return await (await items[0].getType('text/html')).text();
});
ok('Copy formatted copies every row', (copied.match(/Person \d+/g) || []).length === 60 && !/note-row-paged|note-table-pager/.test(copied));

// 2. Moving columns: Move left / Move right.
await page.hover(th(note, 0));
await page.click(th(note, 0) + ' .note-th-filter');
const pop = T(note) + ' .note-table-pop';
ok('the first column cannot move left', await page.isDisabled(pop + ' [data-step="-1"]'));
await page.click(pop + ' [data-step="1"]');
ok('Move right moves the column', same(await heads(note), ['Name', '#', 'Team', 'Score']), JSON.stringify(await heads(note)));
ok('cells and all', same(await firstRow(note), ['Person 1', '1', 'Blue', '7']), JSON.stringify(await firstRow(note)));
ok('its ▾ stays open where it now is', await page.isVisible(pop) && await page.evaluate((s) => document.querySelector(s).dataset.col, pop) === '0' &&
    await page.evaluate((s) => document.activeElement === document.querySelector(s + ' [data-step="1"]'), pop));
ok('kept with the note', same((await view(note)).order, [1, 0, 2, 3]));
await page.click(pop + ' [data-step="-1"]');
ok('and Move left moves it back, which is no order to keep', same(await heads(note), ['#', 'Name', 'Team', 'Score']) && !(await view(note)).order);
await page.keyboard.press('Escape');

// 3. Moving columns: the grip.
await page.hover(th(note, 3));
const grip = await page.locator(th(note, 3) + ' .note-th-grip').boundingBox();
const name = await page.locator(th(note, 1)).boundingBox();
ok('pointing at a heading shows its grip', await page.evaluate((s) => getComputedStyle(document.querySelector(s)).opacity, th(note, 3) + ' .note-th-grip') === '1');
await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
await page.mouse.down();
await page.mouse.move(name.x + 30, name.y + name.height / 2, { steps: 4 });
await page.mouse.move(name.x + 10, name.y + name.height / 2, { steps: 4 });
ok('dragging marks where it will go', await page.evaluate((s) => document.querySelector(s).classList.contains('note-col-drop-before'), th(note, 1)));
await page.mouse.up();
ok('and dropping puts it there', same(await heads(note), ['#', 'Score', 'Name', 'Team']), JSON.stringify(await heads(note)));
ok('without sorting anything', !(await view(note)).sort);
ok('kept with the note', same((await view(note)).order, [0, 3, 1, 2]));
await page.click(th(note, 3) + ' .note-th-sort');
ok('a moved column sorts its own values', same((await firstRow(note)).slice(0, 2), ['43', '1']), JSON.stringify(await firstRow(note)));
await page.click(th(note, 3) + ' .note-th-sort');
await page.click(th(note, 3) + ' .note-th-sort');
await page.hover(th(note, 2));
await page.click(th(note, 2) + ' .note-th-fold');
ok('and folds where it is', await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' thead th')).map(h => h.classList.contains('note-col-folded')).join(), T(note)) === 'false,false,false,true');
// Dragging to the very end.
await page.hover(th(note, 0));
const g0 = await page.locator(th(note, 0) + ' .note-th-grip').boundingBox();
const team = await page.locator(th(note, 2)).boundingBox();
await page.mouse.move(g0.x + g0.width / 2, g0.y + g0.height / 2);
await page.mouse.down();
await page.mouse.move(team.x + team.width + 200, team.y + team.height / 2, { steps: 6 });
await page.mouse.up();
ok('dragged past the last, a column goes last', same(await heads(note), ['Score', 'Name', 'Team', '#']), JSON.stringify(await heads(note)));
ok('Reset columns is offered', await page.isVisible(T(note) + ' .note-table-reset-cols'));

// 4. Kept, and the table as written everywhere else.
ok('none of it touches the Markdown', await page.evaluate((i) => toolCustomizations[i].customContent, note) === MD);
await page.reload();
await page.waitForTimeout(1200);
ok('after a reload the columns are where they were moved', same(await heads(note), ['Score', 'Name', 'Team', '#']));
ok('rows per page is as it was, on the first page', await range(note) === '1–25 of 60');
await page.evaluate((i) => noteCopyRendered(document.querySelector('.tool[data-tool="' + i + '"] .note-copy-rich')), note);
await page.waitForTimeout(400);
copied = await page.evaluate(async () => {
    const items = await navigator.clipboard.read();
    return await (await items[0].getType('text/html')).text();
});
const copyHeads = (copied.match(/<th[^>]*>([^<]*)<\/th>/g) || []).slice(0, 4).map(h => h.replace(/<[^>]+>/g, ''));
ok('Copy formatted has the columns as written', same(copyHeads, ['#', 'Name', 'Team', 'Score']), JSON.stringify(copyHeads));
ok('cells too', /<td>1<\/td>\s*<td>Person 1<\/td>\s*<td>Blue<\/td>\s*<td>7<\/td>/.test(copied), copied.slice(copied.indexOf('<tbody>'), copied.indexOf('<tbody>') + 160));
ok('the rich editor has them as written', await page.evaluate((i) => {
    setToolMode(i, 'edit');
    const t = document.querySelector('.tool[data-tool="' + i + '"] .note-rich table');
    const r = Array.from(t.rows[0].cells).map(c => c.textContent.trim()).join();
    setToolMode(i, 'render');
    return r;
}, note) === '#,Name,Team,Score');
await page.waitForTimeout(300);
await page.click(T(note) + ' .note-table-reset-cols');
ok('Reset columns puts them back', same(await heads(note), ['#', 'Name', 'Team', 'Score']) && !(await view(note)).order &&
    !(await page.isVisible(T(note) + ' .note-table-reset-cols')));
ok('and leaves the fold where it was', (await view(note)).folded.join() === '2');

// 5. A short table moves too, without growing a filter box.
await page.hover(th(note, 0, 1));
await page.click(th(note, 0, 1) + ' .note-th-filter');
await page.click(T(note, 1) + ' .note-table-pop [data-step="1"]');
await page.keyboard.press('Escape');
ok('a short table’s columns move', same(await heads(note, 1), ['B', 'A', 'C']));
ok('offering Reset columns but no filter box', await page.isVisible(T(note, 1) + ' .note-table-reset-cols') &&
    !(await page.isVisible(T(note, 1) + ' .note-table-q')));

// Screenshots: a page of a long table, a column mid-drag.
await page.click(th(note, 2) + ' .note-th-folded');
await page.click(T(note) + ' .note-table-page[aria-label="Page 2"]');
await page.hover(th(note, 2));
const g2 = await page.locator(th(note, 2) + ' .note-th-grip').boundingBox();
const n1 = await page.locator(th(note, 1)).boundingBox();
await page.mouse.move(g2.x + g2.width / 2, g2.y + g2.height / 2);
await page.mouse.down();
await page.mouse.move(n1.x + 8, n1.y + n1.height / 2, { steps: 4 });
await page.screenshot({ path: OUT + '/note-table-pages.png' });
await page.mouse.up();
await page.evaluate(() => document.body.classList.add('dark-mode'));
await page.waitForTimeout(150);
await page.screenshot({ path: OUT + '/note-table-pages-dark.png' });
await page.evaluate((s) => document.querySelector(s + ' .note-table-pager').scrollIntoView({ block: 'end' }), T(note));
await page.evaluate(() => document.body.classList.remove('dark-mode'));
await page.waitForTimeout(150);
await page.screenshot({ path: OUT + '/note-table-pager.png' });

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
