// What is needed to stop working, as savings run down: the figure must not jump because the
// money left has narrowed to one account. Beyond what is held it is reckoned in today's mix,
// from nothing overdrawn; and a year already overdrawn is never enough.
//
// The clock is Playwright's, fixed at 1 November 2026.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

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
    base.retire = Object.assign(base.retire, p.retire);
    const n = fpNeededToStop(Object.assign(base, p, { retire: base.retire }));
    return { rows: n.rows, earliest: n.earliest };
}, p);
const near = (a, b, tol) => Math.abs(a - b) <= tol;

// 1. Retired early, savings running out at 78: first the brokerage goes, the 401(k), the Roth.
const short = { accounts: [
        { id: 'c', name: 'Checking', kind: 'cash', balance: 30000, rate: 1 },
        { id: 'b', name: 'Brokerage', kind: 'investment', balance: 250000, basis: 150000, rate: 7 },
        { id: 'k', name: '401(k)', kind: 'retirement', planType: '401k', balance: 500000, rate: 7 },
        { id: 'r', name: 'Roth', kind: 'retirement', planType: 'ira', tax: 'roth', balance: 80000, basis: 50000, rate: 7 }],
    incomes: [{ id: 'i', name: 'Pay', amount: 12000, every: 'month', taxed: true, to: '2029-06' },
        { id: 'ss', type: 'ss', name: 'SS', birth: '1983-06', fraBenefit: 2000, claimYears: 62, claimMonths: 0, every: 'month', to: '', taxed: true }],
    expenses: [{ id: 'e', name: 'Living', amount: 5000, every: 'month' }],
    retire: { on: true, from: 'job', birth: '1983-06', until: 95, spending: 5200, buffer: 6 } };
let n = await need(short);
const rises = n.rows.filter((r, i) => i && r.needed > n.rows[i - 1].needed * 1.005);
ok('down to its cash: no jump, it keeps falling', rises.length === 0, rises.map(r => r.year + ':' + Math.round(r.needed)).join());
const y = (year) => n.rows.find(r => r.year === year);
ok('the year only cash is left is in line with the year before', y(2061).have < 40000 && y(2061).have > 0 && near(y(2061).needed, y(2060).needed, y(2060).needed * 0.05), JSON.stringify([y(2060).needed, y(2061).needed]));
ok('overdrawn years are not charged for what went before', y(2070).have < 0 && y(2070).needed > 0 && y(2070).needed < y(2061).needed, JSON.stringify([y(2070).have, y(2070).needed]));
ok('it comes down to about nothing at the end', n.rows[n.rows.length - 1].needed < n.rows[n.rows.length - 5].needed / 2);
ok('a year overdrawn is never enough', n.rows.every(r => !(r.have < 0 && r.enough)) && n.earliest === null, String(n.earliest));

// 2. Late on, a plan needing nothing more: overdrawn still does not read as enough.
const income = JSON.parse(JSON.stringify(short));
income.incomes.push({ id: 'p', name: 'Pension', amount: 9000, every: 'month', taxed: false, wages: false, from: '2070-01', to: '2090-01' });
n = await need(income);
ok('a pension late on: the figure falls to nothing, but overdrawn years are still not enough', n.rows[n.rows.length - 1].needed === 0 && n.rows.every(r => !(r.have < 0 && r.enough)), JSON.stringify(n.rows.slice(-2).map(r => [r.year, r.needed, r.enough])));

// 3. Sums done here: no tax, no growth, no inflation, one investment account.
const plain = { tax: { on: false, payroll: false, status: 'single', year: '' }, assume: Object.assign(await page.evaluate(() => fpDefaultPlan().assume), { inflation: 0, spread: 0, real: false }),
    accounts: [{ id: 'c', name: 'Checking', kind: 'cash', balance: 0, rate: 0 }, { id: 'b', name: 'Brokerage', kind: 'investment', balance: 10000, rate: 0 }],
    incomes: [], expenses: [{ id: 'e', name: 'Living', amount: 1000, every: 'month' }],
    retire: { on: false, birth: '1966-11', until: 70, spending: 1000, buffer: 0 } };
n = await need(plain);
ok('the first year: a thousand a month for the ten years left', near(n.rows[0].needed, 120000, 100), String(n.rows[0].needed));

// 4. Nothing but the cash account: it has to go there, as before.
const cash = JSON.parse(JSON.stringify(plain));
cash.accounts = [cash.accounts[0]];
cash.accounts[0].balance = 5000;
n = await need(cash);
ok('only cash: the money goes there', near(n.rows[0].needed, 120000, 100), String(n.rows[0].needed));

// 5. Enough already: the mix is not touched.
const rich = JSON.parse(JSON.stringify(plain));
rich.accounts[1].balance = 500000;
n = await need(rich);
ok('more than is needed: enough, and the same figure', n.earliest === 0 && near(n.rows[0].needed, 120000, 100), String(n.rows[0].needed));

ok('no page errors', errors.length === 0, JSON.stringify(errors));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
