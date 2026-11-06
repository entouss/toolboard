// Finance Planning's early-withdrawal penalties: charged, not just said — 10% before 59½ on
// pre-tax money and Roth earnings, with the exceptions, and 20% on an HSA spent on other than
// medical costs before 65 — and avoided, by drawing penalty-free money first. Each is checked
// against sums done here. Tax and inflation are off unless said, to keep them plain.
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
await page.evaluate((i) => setToolMode(i, 'split'), id);
const near = (a, b, tol) => Math.abs(a - b) <= (tol === undefined ? 0.5 : tol);
const cash = { id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 };
const acct = (x) => Object.assign({ id: 'p', name: 'Pot', kind: 'retirement', balance: 300000, rate: 0 }, x);
const retire = (birth, ageYears, more) => Object.assign({ on: true, birth: birth, ageYears: ageYears, ageMonths: 0, until: 70, spending: 1000, buffer: 0 }, more || {});
const planOf = (accounts, r, more) => Object.assign({ accounts: [cash].concat(accounts), retire: r }, more || {});
const run = (p) => page.evaluate(([i, p]) => {
    const base = fpDefaultPlan();
    base.tax = { on: false, payroll: false, status: 'single', year: '' };
    base.assume.inflation = 0;
    base.assume.spread = 0;
    const plan = Object.assign(base, p);
    fpSet(i, plan);
    const w = document.querySelector('.fp-widget');
    w._yearT = null;
    fpRender(w);
    const r = fpProject(fpGet(i), 0, { detail: true });
    return { rows: r.rows, ms: r.milestones, detail: r.detail };
}, [id, p]);
const paid = (r) => r.ms.penalties.pretax + r.ms.penalties.roth + r.ms.penalties.hsa;

// 1. Traditional money before 59½: $1,000 needed takes $1,111.11 drawn, $111.11 of it the penalty.
let r = await run(planOf([acct({ planType: 'ira' })], retire('1975-01', 55)));
ok('a traditional IRA at 56: 10% on what is drawn, drawn on top', near(r.rows[5].withdrawn, 12000 / 0.9) && near(r.rows[5].withdrawPenalty, 12000 / 0.9 * 0.1), [r.rows[5].withdrawn, r.rows[5].withdrawPenalty].join());
ok('the month still gets what it needs', near(r.rows[5].cash, 0, 0.01) && r.ms.runsOut === null);
ok('it comes off the savings', near(r.rows[4].assets - r.rows[5].assets, 12000 / 0.9));
// Born January 1968: 59½ in July 2027, month 9. Eight penalised months.
r = await run(planOf([acct({ planType: 'ira' })], retire('1968-01', 58)));
ok('it stops at 59½, to the month: eight months of it', near(paid(r), 8 * 1000 / 0.9 * 0.1) && near(r.rows[1].withdrawn, 8 * 1000 / 0.9 + 4000), [paid(r), r.rows[1].withdrawn].join());
r = await run(planOf([acct({ planType: 'ira' })], retire('1966-01', 60)));
ok('at 60: none', paid(r) === 0 && r.ms.penalty === null && near(r.rows[1].withdrawn, 12000));

// 2. The exceptions.
r = await run(planOf([acct({ planType: '401k' })], retire('1975-01', 55)));
ok('a 401(k) left in the year of turning 55: none', paid(r) === 0 && near(r.rows[5].withdrawn, 12000));
r = await run(planOf([acct({ planType: '401k' })], retire('1975-01', 54)));
ok('left at 54: charged', r.ms.penalties.pretax > 0 && near(r.rows[5].withdrawPenalty, 12000 / 0.9 * 0.1));
r = await run(planOf([acct({ planType: '457' })], retire('1980-01', 50)));
ok('a 457(b) once work stops, at any age: none', paid(r) === 0);
// Still working, pay stopped: the job is not taken to be left.
r = await run(Object.assign(planOf([acct({ planType: '457' })], retire('1975-01', 60)), { expenses: [{ id: 'e', name: 'Costs', amount: 1000, every: 'month' }] }));
ok('a 457(b) drawn while still working: charged', r.ms.penalties.pretax > 0 && r.ms.penalty === 1, JSON.stringify(r.ms.penalties));

// 3. A Roth: contributions out first and free, then earnings. $20,000 in: twenty free months.
r = await run(planOf([acct({ planType: 'ira', tax: 'roth', basis: 20000 })], retire('1975-01', 55)));
const start = 39; // January 2030
ok('contributions come out free; the penalty starts with earnings', r.ms.rothEarly === start + 20 && r.ms.penalty === null, String(r.ms.rothEarly));
ok('then 10% of what is drawn, up to 59½', near(r.rows[6].withdrawPenalty, r.rows[6].withdrawn * 0.1, 0.01) && near(r.rows[6].withdrawn, 12000 / 0.9) && r.rows[4].withdrawPenalty === 0, [r.rows[4].withdrawPenalty, r.rows[6].withdrawPenalty].join());
// Born January 1975: 59½ in July 2034, month 93: eight penalised months in the row to month 96.
ok('and none after it', near(r.rows[8].withdrawn, 8 * 1000 / 0.9 + 4000) && near(r.rows[9].withdrawn, 12000) && r.rows[9].withdrawPenalty === 0, [r.rows[8].withdrawn, r.rows[9].withdrawPenalty].join());
r = await run(planOf([acct({ planType: 'ira', tax: 'roth' })], retire('1975-01', 55)));
ok('left empty, the balance today is contributions', paid(r) === 0 && r.ms.rothEarly === null);
r = await run(planOf([acct({ planType: 'ira', tax: 'roth', rate: 6, balance: 100000 })], retire('1975-01', 55, { spending: 3000 })));
ok('and growth from here is the earnings: drawn past what was paid in, penalised', r.ms.rothEarly !== null && r.ms.penalties.roth > 0, String(r.ms.rothEarly));
r = await run(planOf([acct({ planType: 'ira', tax: 'roth', basis: 0 })], retire('1975-01', 55), { tax: { on: true, status: 'single', year: '', payroll: false }, retire: retire('1975-01', 55, { spending: 5000 }) }));
ok('early earnings are taxed as well', r.rows[5].withdrawTax > 0 && r.rows[5].withdrawPenalty > 0 && r.rows[9].withdrawTax === 0, [r.rows[5].withdrawTax, r.rows[9].withdrawTax].join());

// 4. An HSA: 20% on money not spent on medical costs, before 65.
const hsa = (x) => ({ id: 'h', name: 'HSA', kind: 'hsa', balance: 300000, rate: 0, hsaMedical: false, ...x });
r = await run(planOf([hsa()], retire('1966-01', 60)));
ok('an HSA spent otherwise at 60: 20%, drawn on top', near(r.rows[1].withdrawn, 12000 / 0.8) && near(r.ms.penalties.hsa, r.rows[1].withdrawPenalty + r.rows.slice(2).reduce((s, x) => s + x.withdrawPenalty, 0)) && near(r.rows[1].withdrawPenalty, 3000), [r.rows[1].withdrawn, r.rows[1].withdrawPenalty].join());
r = await run(planOf([hsa()], retire('1960-01', 65, { until: 75 })));
ok('from 65: taxed, no penalty', paid(r) === 0 && r.ms.hsaPenalty === null);
r = await run(planOf([hsa({ hsaMedical: true })], retire('1966-01', 60)));
ok('spent on medical costs: none, at any age', paid(r) === 0 && near(r.rows[1].withdrawn, 12000));

// 5. With tax on, the tax and the penalty both come out of what is drawn.
r = await run(planOf([acct({ planType: 'ira', balance: 1000000 })], retire('1975-01', 55, { spending: 3000 }), { tax: { on: true, status: 'single', year: '', payroll: false } }));
let d = r.detail[5];
ok('drawn less tax less penalty is what lands in cash, and it is what was needed', near(d.puts, d.drawn.p - d.withdrawTax - d.penalty.p) && near(d.puts, 36000, 0.05) && r.ms.runsOut === null, JSON.stringify([d.puts, d.drawn.p, d.withdrawTax, d.penalty.p]));
ok('$36,000 takes the $43,359 a hand sum says', near(d.drawn.p, 33820 / 0.78, 60), String(d.drawn.p));

// 6. Penalty-free money first. The order puts the IRA first; a brokerage holds $30,000.
const two = [acct({ planType: 'ira' }), { id: 'b', name: 'Brokerage', kind: 'investment', balance: 30000, basis: 30000, rate: 0 }];
const order = [{ id: 'c' }, { id: 'p' }, { id: 'b' }];
r = await run(planOf(two, retire('1980-01', 50), { drawOrder: order }));
// Retired January 2030. Thirty months from the brokerage, then the IRA, penalised.
ok('while a draw would be penalised, the brokerage goes first, whatever the order', near(r.detail[5].drawn.b || 0, 12000) && !r.detail[5].drawn.p && r.ms.penalty === 39 + 30, JSON.stringify([r.detail[5].drawn, r.ms.penalty]));
ok('and once it is spent, the IRA pays, and the penalty', r.ms.penalties.pretax > 0);
r = await run(planOf(two, retire('1980-01', 50, { avoidPenalty: false }), { drawOrder: order }));
ok('turned off: the order as it stands, penalties and all', r.ms.penalty === 39 && near(r.detail[5].drawn.p, 12000 / 0.9) && !r.detail[5].drawn.b, JSON.stringify([r.detail[5].drawn, r.ms.penalty]));
r = await run(planOf(two, retire('1966-01', 60), { drawOrder: order }));
ok('from 59½ the order is as given', near(r.detail[1].drawn.p, 12000) && !r.detail[1].drawn.b, JSON.stringify(r.detail[1].drawn));
const roth = [acct({ planType: 'ira' }), { id: 'r', name: 'Roth', kind: 'retirement', planType: 'ira', tax: 'roth', balance: 50000, basis: 6000, rate: 0 }];
r = await run(planOf(roth, retire('1980-01', 50), { drawOrder: [{ id: 'c' }, { id: 'p' }, { id: 'r' }] }));
ok('a Roth’s contributions count as free, its earnings do not', near(r.detail[4].drawn.r || 0, 6000) && r.ms.rothEarly === null && r.ms.penalty === 39 + 6, JSON.stringify([r.detail[4].drawn, r.ms.penalty]));

// 7. A goal paid from a retirement account pays the penalty too.
r = await run(planOf([acct({ planType: 'ira' })], retire('1980-01', 65), { goals: [{ id: 'g', name: 'Roof', cost: 9000, every: 'total', years: 1, from: '2027-11', account: 'p' }] }));
ok('a goal paid from an IRA at 47: $10,000 drawn for $9,000', near(r.ms.goals.g.fromOwn, 9000) && near(r.rows[1].withdrawn + r.rows[2].withdrawn, 10000), JSON.stringify(r.ms.goals.g));

// 8. Without a birth month there is no age to go by.
r = await run({ accounts: [cash, acct({ planType: 'ira' })], retire: { on: false, birth: '' }, expenses: [{ id: 'e', name: 'Costs', amount: 1000, every: 'month' }] });
ok('without a birth month: drawn, no penalty', paid(r) === 0 && near(r.rows[1].withdrawn, 12000));

// 9. Through the page.
await run(planOf([acct({ planType: 'ira' })], retire('1975-01', 55)));
await page.waitForTimeout(500);
ok('Ahead gives the total, and when it starts', /Early-withdrawal penalties: \$[\d,]+, from Jan 2030, at 55/.test(await page.innerText('.fp-projection .fp-facts')), await page.innerText('.fp-projection .fp-facts'));
ok('the year table has a Penalty column', (await page.locator('.fp-years th:has-text("Penalty")').count()) === 1);
await page.click('.fp-chart .fp-hit[data-t="60"]', { force: true });
let panel = await page.innerText('.fp-yd');
ok('the year’s breakdown names it', /Early-withdrawal penalty: Pot\s+\$1,333/.test(panel), panel);
ok('and the rules behind it', /a 10% penalty before 59½ on pre-tax money and Roth earnings/.test(panel) && /20% on an HSA/.test(panel) && /penalty-free money drawn first/.test(panel), panel);
const box = '.fp-widget [data-a="retire"][data-k="avoidPenalty"]';
ok('the option is on to begin with', await page.isChecked(box));
await page.uncheck(box);
ok('turned off, it is kept', await page.evaluate((i) => fpGet(i).retire.avoidPenalty === false, id));
ok('and the assumptions say so', /drawn in the order given/.test(await page.innerText('.fp-yd')));
const words = await page.evaluate((i) => fpSummaryText(fpGet(i)), id);
ok('the copied summary says what was charged', /Pre-tax money is drawn before 59½, from Jan 2030, at 55: a 10% penalty, \$[\d,]+ in all as paid\./.test(words));
await run(planOf([acct({ planType: 'ira' })], retire('1966-01', 60)));
ok('nothing charged: no column, no line', (await page.locator('.fp-years th:has-text("Penalty")').count()) === 0 && !/Early-withdrawal/.test(await page.innerText('.fp-projection .fp-facts')));
// A long plan: the table skips years, but none with a penalty. At 53, in February 2033; 59½ in August 2039.
const long = await run(planOf([acct({ planType: 'ira', balance: 2000000 })], retire('1980-02', 53, { spending: 3000, until: 90 })));
const table = () => page.evaluate(() => {
    const heads = Array.from(document.querySelectorAll('.fp-years th')).map(t => t.textContent), col = heads.indexOf('Penalty');
    const trs = Array.from(document.querySelectorAll('.fp-years tbody tr'));
    return { all: trs.map(t => t.cells[0].textContent), charged: col < 0 ? [] : trs.filter(t => t.cells[col].textContent).map(t => t.cells[0].textContent), title: col < 0 || !trs.find(t => t.cells[col].textContent) ? '' : trs.find(t => t.cells[col].textContent).cells[col].title,
        foot: (document.querySelector('.fp-years-foot') || {}).textContent || '' };
});
const years = long.rows.filter(x => x.withdrawPenalty >= 0.5);
let tb = await table();
ok('a long plan lists every year with a penalty', years.length === 7 && tb.charged.join() === years.map(x => x.year).join(), tb.charged.join());
ok('and still skips the others', tb.all.length < long.rows.length && !tb.all.includes('2045') && tb.all.includes('2046'), tb.all.join());
ok('hovering gives the accounts', new RegExp('^Pot \\$[\\d,]+$').test(tb.title), tb.title);
ok('cash at nought is not called overdrawn, nor said to run out', long.ms.cashOut === null && !/runs? out/.test(await page.innerText('.fp-projection .fp-facts')) &&
    await page.evaluate(() => Array.from(document.querySelectorAll('.fp-years tbody tr')).every(t => t.cells[5].textContent !== '$0' || !t.cells[5].classList.contains('fp-neg'))));
const sumAll = years.reduce((s, x) => s + x.withdrawPenalty, 0);
const dollars = (x) => '$' + Math.round(x).toLocaleString('en-US');
ok('the total under the table', tb.foot === 'Early-withdrawal penalties: ' + dollars(sumAll) + ' over 7 years', tb.foot);
ok('the same as Ahead’s', (await page.innerText('.fp-projection .fp-facts')).includes('Early-withdrawal penalties: ' + dollars(sumAll)));
await page.selectOption('.fp-range-from', '2034');
await page.selectOption('.fp-range-to', '2036');
tb = await table();
const part = years.filter(x => x.year >= 2034 && x.year <= 2036);
ok('the year filter narrows the total to the years shown', tb.foot === 'Early-withdrawal penalties: ' + dollars(part.reduce((s, x) => s + x.withdrawPenalty, 0)) + ' over 3 years', tb.foot);
await page.selectOption('.fp-range-to', '2050');
await page.selectOption('.fp-range-from', '2041');
tb = await table();
ok('years without one: no column, no total', tb.charged.length === 0 && tb.foot === '' && (await page.locator('.fp-years th:has-text("Penalty")').count()) === 0, JSON.stringify(tb));
await page.click('.fp-range-all');
await page.click('.fp-years tr[data-t="' + years[1].t + '"]');
ok('a penalty year opens its breakdown', /Early-withdrawal penalty: Pot/.test(await page.innerText('.fp-yd')));
await run(planOf([acct({ planType: 'ira', tax: 'roth', basis: 5000 })], retire('1975-01', 55)));
const field = await page.evaluate(() => { const w = document.querySelector('.fp-widget'); w._open = new Set(['p']); fpRender(w); return w.querySelector('tr.fp-detail[data-id="p"]').innerText; });
ok('a Roth’s details ask for its contributions', /Contributions/.test(field) && await page.inputValue('tr.fp-detail[data-id="p"] [data-f="basis"]') === '5000', field);
ok('no page errors', errors.length === 0, JSON.stringify(errors));

console.log('  (all ' + count + ' assertions reached)');
await browser.close();
