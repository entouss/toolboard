// The pictures in the Finance Planning guide (learn/tools/finance-planning.html), taken
// from the made-up example the guide's "Try it" link opens. Not part of the sweep:
//   node tests/finance-media.mjs      (with a server on 8777, as run.mjs starts one)
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'learn', 'assets');

const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ viewport: { width: 1180, height: 2300 }, deviceScaleFactor: 2, locale: 'en-US' })).newPage();
await page.clock.install({ time: new Date(2026, 10, 1, 10, 0, 0) });
await page.goto('http://localhost:8777/index.html#tool/finance-planning?example=1');
await page.waitForSelector('.fp-widget .fp-accounts tbody tr', { state: 'attached', timeout: 25000 });
await page.waitForTimeout(1500);
// What a month more would cover is worked out after the page is drawn.
await page.waitForFunction(() => !/Working out/.test(document.querySelector('.fp-goals-out').innerText), null, { timeout: 30000 });
const mode = async (m) => { await page.evaluate((m) => setToolMode(fpToolId(document.querySelector('.fp-widget')), m), m); await page.waitForTimeout(400); };
const shot = (sel, name) => page.locator(sel).first().screenshot({ path: path.join(OUT, name) });
// What goes in: the accounts, the income, the expenses and the goals.
await mode('edit');
const box = await page.evaluate(() => {
    const w = document.querySelector('.fp-widget').getBoundingClientRect();
    const end = document.querySelector('.fp-section[data-sec="retirement"]').getBoundingClientRect();
    return { x: w.left, y: w.top, width: w.width, height: end.top - w.top };
});
await page.screenshot({ path: path.join(OUT, 'finance-planning.png'), clip: box });
await shot('.fp-section[data-sec="retirement"]', 'finance-retirement.png');
await mode('render');
await shot('.fp-section[data-sec="ahead"]', 'finance-ahead.png');
await mode('edit');
// The example with a credit card, for the debt step.
await page.evaluate(() => { const w = document.querySelector('.fp-widget'); const id = fpToolId(w); const p = fpGet(id);
    p.accounts.push({ id: 'cc', name: 'Credit card', kind: 'credit', balance: 4000, rate: null, monthly: 150 });
    fpSet(id, p); fpRender(w); });
await page.waitForTimeout(800);
await shot('.fp-section[data-sec="advice"]', 'finance-advice.png');
await page.click('.fp-rules-link');
await page.waitForSelector('.tb-widget .tb-tabs', { timeout: 10000 });
await page.evaluate(() => { const t = document.querySelector('.tb-widget').closest('.tool'); if (typeof enterToolFullscreen === 'function') enterToolFullscreen(t); });
await page.click('.tb-tab[data-tab="payroll"]');
await page.waitForTimeout(300);
await shot('.tb-widget', 'finance-rules.png');
await browser.close();
console.log('wrote finance-planning.png, finance-ahead.png, finance-retirement.png, finance-advice.png, finance-rules.png');
