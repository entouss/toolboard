// Finance Planning's Edit / Both / View, which work as a note's do: it opens on View, goes back
// there when you look away or press Esc, a double-click on the result goes to Edit, and Both
// is side by side with a divider. A new plan opens on Edit, and a double-click on the chart,
// which is clicked anyway, stays put.
//
// The clock is Playwright's, fixed at 1 November 2026.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 900 }, locale: 'en-US' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.clock.install({ time: new Date(2026, 10, 1, 10, 0, 0) });
await page.goto('http://localhost:8777/index.html#tool/finance-planning');
await page.waitForSelector('.fp-widget .fp-empty', { timeout: 25000 });
const id = await page.evaluate(() => document.querySelector('.fp-widget').closest('.tool').dataset.tool);
const tool = '.tool[data-tool="' + id + '"]';
const shown = () => page.evaluate(() => Array.from(document.querySelectorAll('.fp-section')).filter(s => s.offsetParent !== null).map(s => s.dataset.sec).join());
const mode = (m) => page.evaluate(([i, m]) => setToolMode(i, m), [id, m]);
const now = () => page.evaluate((i) => getToolMode(i), id);
const away = async () => { await page.evaluate(() => document.getElementById('toolboard').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))); await page.waitForTimeout(100); };
const EDIT = 'accounts,income,expenses,goals,retirement,advice,assumptions';
const VIEW = 'summary,month,ahead';

// 1. A new plan.
ok('the three buttons', (await page.$$eval(tool + ' .authoring-mode-btn', b => b.map(x => x.textContent).join())) === 'Edit,Both,View');
ok('a new plan opens on Edit, with the way in', await now() === 'edit' && await shown() === EDIT && await page.isVisible('.fp-empty'), await shown());
await mode('render');
ok('an empty plan in View says so', await page.isVisible('.fp-view-empty'));
await page.click('.fp-view-empty .fp-btn');
ok('and its button goes to Edit', await now() === 'edit' && await page.isVisible('.fp-empty'));
await page.click('.fp-empty .fp-btn');
await page.waitForSelector('.fp-accounts tbody tr');
await page.waitForTimeout(300);
ok('filled in, it stays on Edit while you work', await now() === 'edit');

// 2. Looking away, and Esc.
await away();
ok('clicking elsewhere goes to View', await now() === 'render' && await shown() === VIEW, await shown());
ok('with the results drawn', await page.isVisible('.fp-chart') && await page.isVisible('.fp-rollup') && await page.isVisible('.fp-month'));
await mode('split');
await away();
ok('from Both too', await now() === 'render');
await mode('edit');
await page.focus('.fp-accounts tr:first-child [data-f="balance"]');
await page.keyboard.type('5');
await page.waitForTimeout(150);
const typed = await page.evaluate((i) => fpGet(i).accounts[0].balance, id);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
ok('Esc goes to View, from a field too', await now() === 'render');
ok('what was typed is kept', await page.evaluate((i) => fpGet(i).accounts[0].balance, id) === typed && typed === 58000, String(typed));

// 3. Double-click.
await page.dblclick('[data-sec="summary"] h4');
await page.waitForTimeout(150);
ok('a double-click on the result goes to Edit', await now() === 'edit');
await mode('render');
await page.dblclick('.fp-chart .fp-hit[data-t="24"]', { force: true });
await page.waitForTimeout(150);
ok('but not on the chart', await now() === 'render');
await page.dblclick('.fp-chart .fp-mark >> nth=0', { force: true });
await page.waitForTimeout(150);
ok('nor an icon on it', await now() === 'render');
await page.dblclick('tr.fp-year-row[data-t="24"]', { force: true });
await page.waitForTimeout(150);
ok('nor a year in the table', await now() === 'render');
await page.evaluate(() => { document.querySelector('.fp-widget')._yearT = 24; fpRenderDerived(document.querySelector('.fp-widget')); });
await page.dblclick('.fp-yd h5', { force: true });
await page.waitForTimeout(150);
ok('nor a year taken apart', await now() === 'render');
await page.evaluate(() => { document.querySelector('.fp-widget')._yearT = null; fpRenderDerived(document.querySelector('.fp-widget')); });
await page.dblclick('[data-sec="month"] select');
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
ok('nor a dropdown', await now() === 'render');

// 4. Both: side by side, with a divider.
await mode('split');
await page.waitForTimeout(150);
const panes = () => page.evaluate(() => { const r = (s) => document.querySelector('.fp-widget ' + s).getBoundingClientRect(); const a = r('.authoring-source'), b = r('.authoring-result'); return { left: a.left, right: b.left, srcW: a.width, resW: b.width, top: [a.top, b.top] }; });
let b = await panes();
ok('side by side, inputs on the left and wider', b.left < b.right && b.top[0] === b.top[1] && b.srcW > b.resW, JSON.stringify(b));
ok('each with its own sections', await page.evaluate(() => { const has = (s) => Array.from(document.querySelector('.fp-widget ' + s).querySelectorAll('.fp-section')).map(x => x.dataset.sec).join(); return has('.authoring-source') === 'accounts,income,expenses,goals,retirement,advice,assumptions' && has('.authoring-result') === 'summary,month,ahead'; }));
const bar = await page.evaluate(() => { const r = document.querySelector('.fp-widget .authoring-resizer').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
await page.mouse.move(bar.x, bar.y);
await page.mouse.down();
await page.mouse.move(bar.x - 200, bar.y, { steps: 5 });
await page.mouse.up();
await page.waitForTimeout(150);
const dragged = await panes();
ok('the divider drags', dragged.srcW < b.srcW - 150, JSON.stringify([b.srcW, dragged.srcW]));
await page.click('[data-sec="expenses"] .fp-btn:has-text("+ Expense")');
await page.waitForTimeout(200);
const after = await panes();
ok('a redraw leaves it where it is', Math.abs(after.srcW - dragged.srcW) < 2, JSON.stringify([dragged.srcW, after.srcW]));
ok('and the mode, and the buttons', await now() === 'split' && await page.locator(tool + ' .authoring-mode-btn').count() === 3);
await page.evaluate(() => { document.querySelector('.fp-widget .authoring-source').scrollTop = 300; });
await page.click('[data-sec="expenses"] .fp-btn:has-text("+ Expense")');
await page.waitForTimeout(200);
ok('a redraw keeps a pane’s scroll', await page.evaluate(() => document.querySelector('.fp-widget .authoring-source').scrollTop) > 200, String(await page.evaluate(() => document.querySelector('.fp-widget .authoring-source').scrollTop)));
const ratio = await page.evaluate((i) => toolCustomizations[i].splitRatio, id);
ok('its place is kept with the tool', ratio > 0 && ratio < 1, String(ratio));

// 5. Each pane on its own has the whole width, and scrolls.
await mode('render');
await page.waitForTimeout(150);
ok('View has the whole width, whatever the divider says', await page.evaluate(() => { const w = document.querySelector('.fp-widget').getBoundingClientRect().width, r = document.querySelector('.fp-widget .authoring-result').getBoundingClientRect().width; return r > w * 0.9; }));
ok('and scrolls', await page.evaluate(() => { const r = document.querySelector('.fp-widget .authoring-result'); return r.scrollHeight > r.clientHeight; }));
await page.click('[data-sec="ahead"] .fp-fold');
await page.waitForTimeout(150);
ok('a folded section stays folded, heading and all', await page.isVisible('[data-sec="ahead"] h4') && !(await page.isVisible('.fp-projection')));
await page.click('[data-sec="ahead"] .fp-fold');
await page.waitForTimeout(150);
await page.click('.fp-fold-all');
await page.waitForTimeout(150);
ok('Hide all works in View', !(await page.isVisible('.fp-rollup')) && !(await page.isVisible('.fp-projection')));
await page.click('.fp-fold-all');
await page.waitForTimeout(150);

// 6. Through a reload; and a plan that never chose.
await page.evaluate(() => saveToolCustomizations(toolCustomizations));
await page.reload();
await page.waitForSelector('.fp-widget .fp-projection', { state: 'attached', timeout: 25000 });
await page.waitForTimeout(800);
ok('back after a reload', await shown() === VIEW, await shown());
await page.evaluate((i) => { delete toolCustomizations[i].viewMode; saveToolCustomizations(toolCustomizations); }, id);
await page.reload();
await page.waitForSelector('.fp-widget .fp-projection', { state: 'attached', timeout: 25000 });
await page.waitForTimeout(800);
ok('a plan saved before there were modes: View, its figures all there', await shown() === VIEW && (await page.evaluate((i) => fpGet(i).accounts.length, id)) > 0, await shown());

// 7. The example link.
const page2 = await (await browser.newContext({ viewport: { width: 1300, height: 900 }, locale: 'en-US' })).newPage();
await page2.clock.install({ time: new Date(2026, 10, 1, 10, 0, 0) });
await page2.goto('http://localhost:8777/index.html#tool/finance-planning?example=1');
await page2.waitForSelector('.fp-widget .fp-chart', { timeout: 25000 });
await page2.waitForTimeout(500);
ok('?example=1 opens on View', await page2.evaluate(() => getToolMode(fpToolId(document.querySelector('.fp-widget')))) === 'render' && await page2.isVisible('.fp-chart') && !(await page2.isVisible('.fp-accounts')));

ok('no page errors', errors.length === 0, JSON.stringify(errors));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
