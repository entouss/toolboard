// The chart: the bar while the figures are worked out, and one line picked by its name.
//
// The clock is Playwright's, fixed at 1 November 2026.
import { chromium } from 'playwright';
let count = 0, failed = 0;
const ok = (l, p, d) => { count++; if (!p) failed++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ viewport: { width: 1300, height: 1000 }, locale: 'en-US' })).newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.clock.install({ time: new Date(2026, 10, 1, 10, 0, 0) });
await page.goto('http://localhost:8777/index.html#tool/finance-planning');
await page.waitForSelector('.fp-widget .fp-empty', { timeout: 25000 });

const plan = { accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 30000, rate: 1 },
        { id: 'b', name: 'Brokerage', kind: 'investment', balance: 250000, basis: 150000, rate: 7 },
        { id: 'k', name: '401(k)', kind: 'retirement', planType: '401k', balance: 500000, rate: 7 },
        { id: 'h', name: 'Home', kind: 'property', balance: 400000, rate: 3 },
        { id: 'l', name: 'Loan', kind: 'loan', balance: 90000, rate: 5, monthly: 900 }],
    incomes: [{ id: 'i', name: 'Pay', amount: 12000, every: 'month', taxed: true, to: '2045-06' },
        { id: 'ss', type: 'ss', name: 'SS', birth: '1983-06', fraBenefit: 2500, claimYears: 67, claimMonths: 0, every: 'month', to: '', taxed: true }],
    expenses: [{ id: 'e', name: 'Living', amount: 5000, every: 'month' }],
    retire: { on: true, from: 'job', birth: '1983-06', until: 95, spending: 5200, buffer: 6 }, assume: { real: true, inflation: 3 } };

// 1. The bar: it moves, and it goes.
await page.evaluate(() => {
    window.seen = [];
    new MutationObserver(() => { const b = document.querySelector('.fp-progress:not([hidden])'); if (b) { const v = [Number(b.getAttribute('aria-valuenow')), Number(b.getAttribute('aria-valuemax')), b.textContent, b.querySelector('.fp-progress-fill').style.width]; const l = window.seen[window.seen.length - 1]; if (!l || l[0] !== v[0]) window.seen.push(v); } })
        .observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
});
await page.evaluate((p) => { const w = document.querySelector('.fp-widget'), id = fpToolId(w); const base = fpGet(id); fpSet(id, Object.assign(base, p, { retire: Object.assign(base.retire, p.retire), assume: Object.assign(base.assume, p.assume) })); setToolMode(id, 'split'); fpRender(w); }, plan);
await page.waitForSelector('.fp-chart path.fp-forever', { state: 'attached', timeout: 20000 });
let seen = await page.evaluate(() => window.seen);
ok('the bar counts the years up', seen.length >= 5 && seen.every((v, i) => !i || v[0] > seen[i - 1][0]), seen.length + ' steps');
ok('saying how far it has got', /^Working out figures: \d+ of \d+ years$/.test(seen[2][2]) && seen[2][0] < seen[2][1], seen[2][2]);
ok('filling as it goes', parseFloat(seen[seen.length - 1][3]) > parseFloat(seen[0][3]), seen[0][3] + ' to ' + seen[seen.length - 1][3]);
ok('and gone when done', await page.locator('.fp-progress').count() === 0);

// 2. A change partway restarts it, and the figures are the new plan's.
const edit = (amount) => page.evaluate((amount) => { const w = document.querySelector('.fp-widget'), id = fpToolId(w), p = fpGet(id); p.accounts[1].balance = amount; fpSet(id, p); fpRenderDerived(w, p); }, amount);
await edit(300000);
await page.waitForFunction(() => { const b = document.querySelector('.fp-progress:not([hidden])'); return b && Number(b.getAttribute('aria-valuenow')) >= 6; }, null, { timeout: 15000, polling: 5 });
const part = await page.evaluate(() => Number(document.querySelector('.fp-progress').getAttribute('aria-valuenow')));
await edit(350000);
ok('the page stays usable partway: the old figures are there, faded', await page.locator('.fp-chart path.fp-forever.fp-stale').count() === 1);
await page.evaluate(() => { window.seen = []; });
await page.waitForFunction(() => document.querySelector('.fp-chart path.fp-forever') && !document.querySelector('.fp-chart path.fp-forever.fp-stale'), null, { timeout: 20000 });
seen = await page.evaluate(() => window.seen);
ok('a change partway starts it again', part >= 6 && seen.length > 0 && seen[0][0] < part, part + ' then ' + (seen[0] || [])[0]);
const same = await page.evaluate(() => { const w = document.querySelector('.fp-widget'), p = fpGet(fpToolId(w)), n = fpNeededToStop(p); return w._needed.value.rows.every((r, i) => r.needed === n.rows[i].needed && r.forever === n.rows[i].forever); });
ok('the figures shown are the plan’s as it now stands', same);

// 3. One line at a time.
const lines = { net: '.fp-net', assets: '.fp-assets', liab: '.fp-liab', have: '.fp-have', needed: '.fp-needed', forever: '.fp-forever' };
const shown = () => page.evaluate((lines) => Object.keys(lines).filter(k => document.querySelector('.fp-chart path.fp-line' + lines[k])), lines);
const top = () => page.evaluate(() => [...document.querySelectorAll('.fp-chart > text')].map(t => t.textContent).filter(t => t.startsWith('$') || t.startsWith('-')).join(' '));
ok('all six to begin with', (await shown()).length === 6, (await shown()).join());
const allTop = await top();
for (const k of Object.keys(lines)) {
    await page.click('.fp-legend [data-line="' + k + '"]');
    ok(k + ' alone from the key', (await shown()).join() === k, (await shown()).join());
    ok(k + ' marked as the one showing, with a way back', await page.getAttribute('.fp-legend [data-line="' + k + '"]', 'aria-pressed') === 'true' && await page.isVisible('.fp-legend-all'));
}
await page.click('.fp-legend [data-line="needed"]');
const neededTop = await top();
ok('its own scale, not the rest’s', neededTop !== allTop, allTop + ' | ' + neededTop);
const fit = await page.evaluate(() => { const b = document.querySelector('.fp-chart path.fp-needed').getBBox(); return b.height; });
ok('filling the chart', fit > 100, String(fit));
ok('its dot stays, the other’s goes', await page.locator('.fp-chart .fp-stop-dot').count() === 1 && await page.locator('.fp-chart .fp-forever-dot').count() === 0);
ok('tooltips still give every figure', /net worth .*needed to stop working .*to last forever .*could spend/.test(await page.textContent('.fp-chart .fp-hit title')));
await page.click('.fp-legend [data-line="needed"]');
ok('its name again: all of them', (await shown()).length === 6 && await page.locator('.fp-legend-all').count() === 0);
await page.click('.fp-chart .fp-net-label');
ok('from the name at its end', (await shown()).join() === 'net');
ok('the range stays with net worth', await page.locator('.fp-chart .fp-band').count() === 1);
await page.click('.fp-legend [data-line="assets"]');
ok('another name switches to it', (await shown()).join() === 'assets' && await page.locator('.fp-chart .fp-band').count() === 0);
await page.click('.fp-legend-all');
ok('Show all lines', (await shown()).length === 6);

// 4. The keyboard.
await page.focus('.fp-chart .fp-forever-label');
await page.keyboard.press('Enter');
ok('Enter on the name at its end', (await shown()).join() === 'forever');
ok('the focus stays on the line’s name', await page.evaluate(() => document.activeElement.dataset.line === 'forever'));
await page.keyboard.press('Enter');
ok('Enter on its name in the key: all again', (await shown()).length === 6);

// 5. Years still pick, and the choice stays over a reload.
await page.click('.fp-legend [data-line="have"]');
await page.locator('.fp-chart .fp-hit').nth(3).click({ force: true });
ok('a year still opens with one line showing', await page.locator('.fp-yd').count() === 1 && (await shown()).join() === 'have');
await page.reload();
await page.waitForSelector('.fp-chart path.fp-have', { state: 'attached', timeout: 25000 });
await page.waitForFunction(() => document.querySelector('.fp-legend-all'), null, { timeout: 20000 });
ok('kept over a reload', (await shown()).join() === 'have', (await shown()).join());

ok('no page errors', errors.length === 0, errors.join(' | '));
console.log(count + ' checks' + (failed ? ', ' + failed + ' FAILED' : ''));
await browser.close();
process.exit(failed ? 1 : 0);
