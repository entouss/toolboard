// What would last forever: the least that never runs out and, by the plan's end, keeps its
// buying power. It should settle where what is needed to stop falls away, not depend on the
// age the plan runs to, and say so when it cannot be done.
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
const need = (p) => page.evaluate((p) => {
    const base = fpDefaultPlan();
    const plan = Object.assign(base, p, { retire: Object.assign(base.retire, p.retire), assume: Object.assign(base.assume, p.assume) });
    const n = fpNeededToStop(plan);
    n.rows.forEach(r => { if (r.forever === Infinity) r.forever = 'inf'; if (r.needed === Infinity) r.needed = 'inf'; });
    return { rows: n.rows, foreverAt: n.foreverAt, text: fpForeverText(Object.assign({}, n, { rows: n.rows.map(r => Object.assign({}, r, { forever: r.forever === 'inf' ? Infinity : r.forever })) }), false) };
}, p);
const near = (a, b, share) => Math.abs(a - b) <= b * share;
const plan = (accounts, retire, more) => Object.assign({ accounts,
    incomes: [{ id: 'i', name: 'Pay', amount: 12000, every: 'month', taxed: true, to: '2045-06' },
        { id: 'ss', type: 'ss', name: 'SS', birth: '1983-06', fraBenefit: 2500, claimYears: 67, claimMonths: 0, every: 'month', to: '', taxed: true }],
    expenses: [{ id: 'e', name: 'Living', amount: 5000, every: 'month' }],
    retire: Object.assign({ on: true, from: 'job', birth: '1983-06', until: 95, spending: 5200, buffer: 6 }, retire), assume: { real: true, inflation: 3 } }, more);
const cash = { id: 'c', name: 'Cash', kind: 'cash', balance: 30000, rate: 1 };
const mixed = [cash, { id: 'b', name: 'Brokerage', kind: 'investment', balance: 250000, basis: 150000, rate: 7 }, { id: 'k', name: '401(k)', kind: 'retirement', planType: '401k', balance: 500000, rate: 7 }];
const pretax = [cash, { id: 'k', name: '401(k)', kind: 'retirement', planType: '401k', balance: 900000, rate: 7 }];

// 1. No tax, no other income: spending over what the pot earns above inflation.
const simple = await need({ accounts: [{ id: 'r', name: 'Roth', kind: 'retirement', planType: 'ira', tax: 'roth', balance: 500000, basis: 500000, rate: 7 }],
    incomes: [{ id: 'i', name: 'Pay', amount: 8000, every: 'month', taxed: false, to: '2030-06' }], expenses: [{ id: 'e', name: 'Living', amount: 5000, every: 'month' }],
    retire: { on: true, from: 'job', birth: '1966-06', until: 95, spending: 5000, buffer: 0, avoidPenalty: false }, assume: { real: true, inflation: 3 } });
const perp = 60000 / (1.07 / 1.03 - 1);
ok('the simple case comes to spending over the real return', near(simple.rows[3].forever, perp, 0.06), Math.round(simple.rows[3].forever) + ' against ' + Math.round(perp));
ok('it stays level in today’s money', near(simple.rows[12].forever, simple.rows[3].forever, 0.02), JSON.stringify([simple.rows[3].forever, simple.rows[12].forever]));

// 2. An ordinary plan: never below what is needed, and it does not fall away at the end.
let n = await need(plan(mixed));
const y = (r, age) => r.rows.find(x => x.age === age);
ok('never less than what is needed', n.rows.every(r => r.forever >= r.needed - 1));
ok('Social Security starting brings it down', y(n, 67).forever < y(n, 59).forever * 0.9, JSON.stringify([y(n, 59).forever, y(n, 67).forever]));
ok('level from then, while what is needed falls away', near(y(n, 90).forever, y(n, 70).forever, 0.1) && y(n, 90).needed < y(n, 70).needed / 2, JSON.stringify([y(n, 70), y(n, 90)].map(r => [r.needed, r.forever])));
ok('no jump in the last years', near(n.rows[n.rows.length - 1].forever, y(n, 70).forever, 0.1), JSON.stringify(n.rows.slice(-3).map(r => r.forever)));
const reached = n.rows[n.foreverAt];
ok('the first year reached has the savings for it, and the year before does not', reached.have >= reached.forever && n.rows[n.foreverAt - 1].have < n.rows[n.foreverAt - 1].forever);
ok('said in words', new RegExp('Could live on savings forever from ' + reached.year + ', at ' + reached.age + ': ').test(n.text), n.text);

// 3. It does not depend on the age the plan runs to.
const longer = await need(plan(mixed, { until: 105 }));
ok('the same with the plan running to 105', [43, 51, 59, 67, 75].every(a => near(y(longer, a).forever, y(n, a).forever, 0.02)), JSON.stringify([43, 75].map(a => [y(n, a).forever, y(longer, a).forever])));

// 4. Pre-tax money: minimum withdrawals do not make it out of reach.
const pre = await need(plan(pretax));
ok('pre-tax savings can last forever', pre.rows.every(r => Number.isFinite(r.forever)) && near(pre.rows[pre.rows.length - 1].forever, y(pre, 70).forever, 0.15), JSON.stringify(pre.rows.slice(-2).map(r => r.forever)));

// 5. All in cash below inflation: out of reach, said so.
const inCash = await need(plan([Object.assign({}, cash, { balance: 300000 })]));
ok('cash below inflation is out of reach', inCash.rows.every(r => r.forever === 'inf' && !r.enoughForever) && inCash.foreverAt === null);
ok('and it says why', /does not outrun inflation/.test(inCash.text), inCash.text);

// 6. Income covering the spending: nothing is needed.
const covered = await need(plan(mixed, {}, { incomes: [{ id: 'p', name: 'Pension', amount: 15000, every: 'month', taxed: false, wages: false, to: '2200-01' }] }));
ok('income covers it: nothing needed', covered.rows[0].forever === 0 && covered.foreverAt === 0, String(covered.rows[0].forever));
ok('already there reads as now', /forever now, at 43/.test(covered.text), covered.text);

// 7. On the page: chart, table, hover and year.
await page.evaluate((p) => { const id = fpToolId(document.querySelector('.fp-widget')); const base = fpGet(id); fpSet(id, Object.assign(base, p, { retire: Object.assign(base.retire, p.retire), assume: Object.assign(base.assume, p.assume) })); setToolMode(id, 'split'); fpRender(document.querySelector('.fp-widget')); }, plan(mixed));
await page.waitForFunction(() => document.querySelector('.fp-chart .fp-forever') && !document.querySelector('.fp-chart .fp-forever').classList.contains('fp-stale') && document.querySelector('.fp-chart .fp-forever').getAttribute('d'), null, { timeout: 15000 });
await page.clock.runFor(1000);
await page.waitForSelector('.fp-chart .fp-forever-dot');
ok('the line and its first year are on the chart', await page.locator('.fp-chart path.fp-forever').count() === 1 && await page.locator('.fp-chart circle.fp-forever-dot').count() === 1);
ok('named at its end and in the key', /Lasts forever/.test(await page.textContent('.fp-chart .fp-forever-label')) && /Lasts forever \(● the first year it is reached\)/.test(await page.innerText('.fp-projection .fp-legend')));
ok('and in the facts', /Could live on savings forever from \d{4}, at \d+/.test(await page.innerText('.fp-projection .fp-facts')));
const heads = await page.locator('.fp-years th').allTextContents();
ok('a column beside Needed to stop', heads.indexOf('Lasts forever') === heads.indexOf('Needed to stop') + 1, heads.join());
ok('the hover gives it', /to last forever \$/.test(await page.textContent('.fp-chart .fp-hit title')));
await page.locator('.fp-year-row').nth(2).click();
ok('a picked year gives it', /To last forever from then: \$/.test(await page.innerText('.fp-projection')));
const summary = await page.evaluate(() => fpSummaryText(fpGet(fpToolId(document.querySelector('.fp-widget')))));
ok('the summary has it', /Could live on savings forever/.test(summary));

ok('no page errors', errors.length === 0, errors.join(' | '));
console.log(count + ' checks' + (failed ? ', ' + failed + ' FAILED' : ''));
await browser.close();
process.exit(failed ? 1 : 0);
