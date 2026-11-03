// Finance Planning's Ahead, a year taken apart: picking a year on the chart, or in the year
// table, opens what made it up — the money in and out line by line, each account from start
// to end with what went in, what was drawn and what it earned, what happened that year and
// the assumptions behind it. The figures are checked against sums done here, and every
// account (and net worth) must come out start + in − drawn + growth = end.
//
// The clock is Playwright's, fixed at 1 November 2026.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 1400 }, locale: 'en-US' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.clock.install({ time: new Date(2026, 10, 1, 10, 0, 0) });
await page.goto('http://localhost:8777/index.html#tool/finance-planning');
await page.waitForSelector('.fp-widget .fp-empty', { timeout: 25000 });
const id = await page.evaluate(() => document.querySelector('.fp-widget').closest('.tool').dataset.tool);
const setPlan = (p) => page.evaluate(([i, p]) => {
    const base = fpDefaultPlan();
    base.tax = { on: false, payroll: false, status: 'single', year: '' };
    base.assume.inflation = 0;
    base.assume.spread = 0;
    base.assume.years = 5;
    const w = document.querySelector('.fp-widget');
    w._yearT = null;
    fpSet(i, Object.assign(base, p));
    fpRender(w);
}, [id, p]);
const detail = () => page.evaluate((i) => { const r = fpProject(fpGet(i), 0, { detail: true }); return { detail: r.detail, rows: r.rows, into: r.into }; }, id);
const near = (a, b, tol) => Math.abs(a - b) <= (tol === undefined ? 0.5 : tol);
const sum = (o) => Object.values(o).reduce((s, v) => s + v, 0);
// Every account's year, and the whole: start + in − drawn + growth = end.
const balances = (plan, d, into) => {
    let bad = [];
    let s = 0, e = 0, flow = 0;
    plan.accounts.forEach(a => {
        const liab = a.kind === 'loan' || a.kind === 'credit';
        const sign = liab ? -1 : 1;
        const st = sign * (liab ? Math.max(0, d.start[a.id] || 0) : d.start[a.id] || 0), en = sign * (liab ? Math.max(0, d.end[a.id] || 0) : d.end[a.id] || 0);
        const added = (d.added[a.id] || 0) + (a.id === into ? d.leftover + d.puts : 0);
        const f = added - (d.drawn[a.id] || 0) + (d.growth[a.id] || 0);
        if (!near(st + f, en, 0.05)) bad.push(a.name + ': ' + st + ' + ' + f + ' ≠ ' + en);
        s += st; e += en; flow += f;
    });
    return { bad: bad, s: s, e: e, flow: flow };
};

// 1. Working: pay, an expense, a brokerage that earns and takes a contribution, a loan paid down.
const planA = { accounts: [
    { id: 'c', name: 'Checking', kind: 'cash', balance: 10000, rate: 0 },
    { id: 'b', name: 'Brokerage', kind: 'investment', balance: 20000, rate: 6, monthly: 100 },
    { id: 'l', name: 'Car loan', kind: 'loan', balance: 5000, rate: 12, monthly: 500 }],
    incomes: [{ id: 'i', name: 'Pay', amount: 4000, every: 'month', taxed: false }],
    expenses: [{ id: 'e', name: 'Living', amount: 2500, every: 'month' }] };
await setPlan(planA);
let { detail: D, rows, into } = await detail();
// By hand: twelve months.
let b = 20000, bg = 0, L = 5000, paid = 0, interest = 0;
for (let t = 0; t < 12; t++) {
    bg += b * 0.005; b = b * 1.005 + 100;
    if (L > 0) { const int = L * 0.01, pay = Math.min(500, L + int); L += int - pay; if (L < 0.005) L = 0; paid += pay; interest += int; }
}
const d1 = D[1];
ok('a year is the twelve months to its row', d1.months === 12 && D[0].months === 1, [d1.months, D[0].months].join());
ok('money in: each income line', near(d1.income.i, 48000) && Object.keys(d1.income).length === 1);
ok('money out: each expense, the contribution, the loan’s payments', near(d1.expenses.e, 30000) && near(d1.contrib.b, 1200) && near(d1.payments.l, paid), JSON.stringify([d1.expenses, d1.contrib, d1.payments, paid]));
ok('what is left over is the rest', near(d1.leftover, 48000 - 30000 - 1200 - paid));
ok('the brokerage’s growth, month by month', near(d1.growth.b, bg) && near(d1.end.b, b), [d1.growth.b, bg, d1.end.b, b].join());
ok('the loan’s interest, as growth the wrong way', near(d1.growth.l, -interest) && near(d1.end.l, L), [d1.growth.l, interest].join());
let bal = balances(planA, d1, into);
ok('every account: start + in − drawn + growth = end', bal.bad.length === 0, bal.bad.join('; '));
ok('and so does net worth, ending on the row’s', near(bal.s, rows[0].net) && near(bal.e, rows[1].net) && near(bal.s + bal.flow, bal.e), [bal.s, bal.e, rows[1].net].join());
ok('row 0 is this month: its balances today', near(D[0].start.b, 20000) && near(D[0].income.i, 4000));
bal = balances(planA, D[3], into);
ok('a later year adds up too', bal.bad.length === 0 && near(bal.e, rows[3].net), bal.bad.join('; '));

// 2. Through the page.
ok('a hint says the years can be picked', /Click a year on the chart, or in the table/.test(await page.innerText('.fp-projection')));
await page.click('.fp-chart .fp-hit[data-t="12"]', { force: true });
let panel = await page.innerText('.fp-yd');
ok('clicking a year on the chart opens what made it up', /^2027 · working/.test(panel) && /Nov 2026 to Oct 2027, in dollars of the time/.test(panel), panel.slice(0, 120));
ok('the money in and out, by line', /Pay\s+\$48,000/.test(panel) && /Living\s+\$30,000/.test(panel) && /Added to Brokerage\s+\$1,200/.test(panel) && /Payment: Car loan/.test(panel), panel);
ok('the accounts, start to end', /Brokerage Investment\s+\$20,000/.test(panel) && /Net worth\s+\$25,000/.test(panel));
ok('the assumptions', /Inflation 0% a year\./.test(panel) && /Rates a year: Checking 0%, Brokerage 6%, Car loan 12%/.test(panel) && /Federal income tax is not estimated/.test(panel) && /Growing a year: Pay 0%, Living 0%/.test(panel), panel);
ok('the slice is marked as picked, and its row in the table', await page.evaluate(() => document.querySelector('.fp-hit[data-t="12"]').getAttribute('aria-pressed') === 'true' && document.querySelector('.fp-years tr[data-t="12"]').classList.contains('fp-year-on')));
await page.click('.fp-yd-nav [data-dir="1"]');
ok('› steps to the next year', /^2028/.test(await page.innerText('.fp-yd')) && await page.evaluate(() => document.activeElement.dataset.dir === '1'));
await page.click('.fp-yd-nav [data-dir="-1"]');
await page.click('.fp-yd-nav [data-dir="-1"]');
ok('‹ steps back, to now', /^Now · working/.test(await page.innerText('.fp-yd')) && /This month, Nov 2026/.test(await page.innerText('.fp-yd')));
await page.click('.fp-yd-nav .fp-x');
ok('× closes it, the focus back on the year', await page.locator('.fp-yd').count() === 0 && await page.evaluate(() => document.activeElement.dataset.t === '0'));
await page.click('.fp-years tr[data-t="24"]');
ok('a row of the table opens it too', /^2028/.test(await page.innerText('.fp-yd')));
await page.click('.fp-years tr[data-t="24"]');
ok('and clicking it again closes it', await page.locator('.fp-yd').count() === 0);
await page.focus('.fp-chart .fp-hit[data-t="36"]');
await page.keyboard.press('Enter');
ok('from the keyboard: Enter on a year opens it, the focus on its heading', /^2029/.test(await page.innerText('.fp-yd')) && await page.evaluate(() => document.activeElement.tagName === 'H5'));
await page.fill('.fp-in[data-f="amount"]', '4100');
await page.waitForTimeout(200);
ok('it stays open while the plan changes, and follows it', /Pay\s+\$49,200/.test(await page.innerText('.fp-yd')));
await page.selectOption('.fp-range-to', '2028');
ok('a year range that leaves it out closes it', await page.locator('.fp-yd').count() === 0);
await page.click('.fp-range-all');

// 3. Retired, with a traditional IRA paying its required minimum, and tax on.
const planB = { accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 20000, rate: 0 }, { id: 'ira', name: 'IRA', kind: 'retirement', planType: 'ira', tax: 'pretax', balance: 2000000, rate: 0 }],
    incomes: [], expenses: [{ id: 'e', name: 'Living', amount: 3000, every: 'month' }],
    tax: { on: true, payroll: false, status: 'single', year: '' },
    retire: { on: true, birth: '1955-01', ageYears: 72, ageMonths: 0, until: 80, spending: 3000, buffer: 2 } };
await setPlan(planB);
({ detail: D, rows, into } = await detail());
const d2 = D[2];
ok('retired: spending in retirement, not the expense lines', near(d2.spending, 36000) && Object.keys(d2.expenses).length === 0, JSON.stringify([d2.spending, d2.expenses]));
ok('drawn from the IRA, the required minimum part of it, and the tax on it', d2.drawn.ira > 0 && d2.rmd.ira > 0 && d2.rmd.ira <= d2.drawn.ira + 0.01 && d2.withdrawTax > 0 && near(d2.puts, d2.drawn.ira - d2.withdrawTax),
    JSON.stringify([d2.drawn, d2.rmd, d2.withdrawTax, d2.puts]));
bal = balances(planB, d2, into);
ok('it adds up, drawing and all', bal.bad.length === 0 && near(bal.e, rows[2].net), bal.bad.join('; '));
await page.click('.fp-chart .fp-hit[data-t="12"]', { force: true });
panel = await page.innerText('.fp-yd');
ok('the year retirement starts says so', /Retirement starts, Jan 2027, at 72/.test(panel) && /2027 · age 72 · retired/.test(panel), panel.slice(0, 600));
await page.click('.fp-yd-nav [data-dir="1"]');
panel = await page.innerText('.fp-yd');
ok('and the year minimums begin', /Required minimum withdrawals begin, from age 73/.test(panel) && /\(\$[\d,]+ the required minimum\)/.test(panel) && /Tax on what was drawn/.test(panel), panel);
ok('the tax rules it used, moved up with inflation', /Federal tax: the 2026 rules, single/.test(panel) && /standard deduction \$/.test(panel));
ok('and the retirement assumptions', /Retirement at 72 \(Jan 2027\), lasting to 80; spending \$3,000 a month in today’s dollars/.test(panel) && /required minimums from 73/.test(panel), panel);

// 4. A goal's year, and inflation shown against today's money.
await setPlan(Object.assign({}, planA, { goals: [{ id: 'g', name: 'Roof', cost: 12000, every: 'total', years: 1, from: '2028-03', account: '' }] }));
await page.evaluate((i) => { const p = fpGet(i); p.assume.inflation = 3; p.assume.real = true; fpSet(i, p); fpRender(document.querySelector('.fp-widget')); }, id);
await page.click('.fp-chart .fp-hit[data-t="24"]', { force: true });
panel = await page.innerText('.fp-yd');
ok('a goal paid that year: among the money out, and what happened', /Goal: Roof\s+\$12,\d{3}/.test(panel) && /Goal paid: Roof/.test(panel) && /Roof 3%/.test(panel), panel);
ok('with inflation, what today’s money is', /prices 1\.06× today’s\. In today’s money, divide what is here by 1\.06\./.test(panel) && /net worth \$[\d,]+ in today’s money/.test(panel), panel.slice(0, 200));
ok('no page errors', errors.length === 0, JSON.stringify(errors));

console.log('  (all ' + count + ' assertions reached)');
await browser.close();
