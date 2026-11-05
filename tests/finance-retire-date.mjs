// Finance Planning's retirement date: at an age, or when the last job ends — with a job that
// has no end falling back on the age, and part-time or bridge work holding nothing back. And
// the age-55 exception, which goes by the job paying into the account where the plan knows
// when that ends. Tax and inflation are off unless said, to keep the sums plain.
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
const near = (a, b, tol) => Math.abs(a - b) <= (tol === undefined ? 0.5 : tol);
const setPlan = (p) => page.evaluate(([i, p]) => {
    const base = fpDefaultPlan();
    base.tax = { on: false, payroll: false, status: 'single', year: '' };
    base.assume.inflation = 0;
    base.assume.spread = 0;
    base.assume.target = 0;
    p.retire = Object.assign(base.retire, p.retire);
    fpSet(i, Object.assign(base, p));
    fpRender(document.querySelector('.fp-widget'));
}, [id, p]);
const facts = () => page.evaluate((i) => { const p = fpGet(i); const r = fpRetireInfo(p); const pr = fpProject(p, 0, {}); return { ym: r.ym, at: r.atMonths, retire: pr.milestones.retire, rows: pr.rows, ms: pr.milestones }; }, id);
const out = () => page.innerText('.fp-retire-out');
const cash = { id: 'c', name: 'Cash', kind: 'cash', balance: 100000, rate: 0 };
const job = (o) => Object.assign({ id: 'i1', name: 'Job', amount: 5000, every: 'month', taxed: false }, o);
const living = { id: 'e', name: 'Living', amount: 1000, every: 'month' };
const r = (o) => Object.assign({ on: true, birth: '1975-01', ageYears: 65, ageMonths: 0, until: 90, spending: 1000, buffer: 0 }, o);

// 1. At an age, as ever: a plan saved before there was a choice says nothing of it.
await setPlan({ accounts: [cash], expenses: [living], incomes: [job({ to: '2030-12' })], retire: r({ from: undefined }) });
let f = await facts();
ok('a saved plan with no choice in it: the age, whatever the job does', f.ym === '2040-01' && f.at === 780, JSON.stringify([f.ym, f.at]));
ok('the choice reads “at age”, and the age is there to change', await page.inputValue('[data-k="from"]') === 'age' && await page.isVisible('[data-k="ageYears"]'));

// 2. When the last job ends.
await page.selectOption('[data-k="from"]', 'job');
await page.waitForTimeout(150);
f = await facts();
ok('chosen: the month after it ends', f.ym === '2031-01' && f.at === 56 * 12, JSON.stringify([f.ym, f.at]));
ok('and kept', await page.evaluate((i) => fpGet(i).retire.from, id) === 'job');
ok('it says so, and the age gives way', /Retire Jan 2031 at 56, when Job ends/.test(await out()) && !(await page.isVisible('[data-k="ageYears"]')), await out());
ok('the summary too', await page.evaluate((i) => { const p = fpGet(i); return fpRetireLines(p, fpProject(p, 0, {}))[0]; }, id).then(t => /when Job ends/.test(t)));
await page.fill('tr[data-id="i1"] [data-f="to"]', '2033-06');
await page.waitForTimeout(200);
f = await facts();
ok('the date moved on the pay line: retirement with it', f.ym === '2033-07' && /Retire Jul 2033/.test(await out()), f.ym);

// 3. The last of several; a job already over; one after the age given.
await setPlan({ accounts: [cash], expenses: [living], incomes: [job({ to: '2034-03' }), job({ id: 'i2', name: 'Second', to: '2036-08' })], retire: r({ from: 'job' }) });
f = await facts();
ok('two jobs: the later', f.ym === '2036-09' && /when Second ends/.test(await out()), f.ym);
await setPlan({ accounts: [cash], expenses: [living], incomes: [job({ to: '2025-06' })], retire: r({ from: 'job' }) });
f = await facts();
ok('a job already over: retired from the start', f.ym === '2025-07' && f.retire === 1, JSON.stringify([f.ym, f.retire]));
await setPlan({ accounts: [cash], expenses: [living], incomes: [job({ to: '2045-06' })], retire: r({ from: 'job' }) });
f = await facts();
ok('one that runs past the age given: the job, and contributions until then', f.ym === '2045-07' && f.at === 70 * 12 + 6, JSON.stringify([f.ym, f.at]));

// 4. Falling back on the age.
await setPlan({ accounts: [cash], expenses: [living], incomes: [job(), job({ id: 'i2', name: 'Second', to: '2036-08' })], retire: r({ from: 'job', ageYears: 62 }) });
f = await facts();
ok('a job with no end: the age', f.ym === '2037-01', f.ym);
ok('it says which, and the age is there', /Job has no end date, so the age above is used/.test(await out()) && await page.isVisible('[data-k="ageYears"]'), await out());
await setPlan({ accounts: [cash], expenses: [living], incomes: [job({ wages: false })], retire: r({ from: 'job', ageYears: 62 }) });
ok('no job at all: the age, and it says so', (await facts()).ym === '2037-01' && /No job in Income/.test(await out()), await out());

// 5. Part-time or bridge work.
const main = job({ to: '2035-12' });
const bridge = { id: 'i2', name: 'Consulting', amount: 1500, every: 'month', taxed: false, to: '2038-12', bridge: true };
await setPlan({ accounts: [cash], expenses: [living], incomes: [main, Object.assign({}, bridge, { bridge: false })], retire: r({ from: 'job' }) });
ok('not marked: it counts as the last job', (await facts()).ym === '2039-01');
await page.evaluate(() => { const w = document.querySelector('.fp-widget'); w._open = new Set(['i2']); fpRender(w); });
await page.check('tr.fp-detail[data-id="i2"] [data-f="bridge"]');
await page.waitForTimeout(200);
f = await facts();
ok('marked: it holds nothing back', f.ym === '2036-01' && await page.evaluate((i) => fpGet(i).incomes[1].bridge, id) === true, f.ym);
const pay = await page.evaluate((i) => fpProject(fpGet(i), 0, { detail: true }).detail.map(d => d.income.i2 || 0), id);
ok('and its pay carries on to its own end', pay[11] === 18000 && pay[13] === 3000 && !pay[14], JSON.stringify(pay.slice(9, 15)));
await setPlan({ accounts: [cash], expenses: [living], incomes: [Object.assign({}, bridge, { to: '' })], retire: r({ from: 'job', ageYears: 62 }) });
ok('only bridge work: no job to go by', (await facts()).ym === '2037-01' && /No job in Income/.test(await out()), await out());

// 6. The gap, and the way out of it.
await setPlan({ accounts: [cash], expenses: [living], incomes: [job({ to: '2030-12' })], retire: r() });
ok('pay stopping before the age: the warning, with a way out', /Pay stops in Jan 2031/.test(await out()) && await page.isVisible('.fp-retire-out .fp-btn:has-text("Retire when the last job ends")'), await out());
await page.click('.fp-retire-out .fp-btn:has-text("Retire when the last job ends")');
await page.waitForTimeout(200);
f = await facts();
ok('taken: retirement moves, the warning goes, the choice shows it', f.ym === '2031-01' && !/Pay stops/.test(await out()) && await page.inputValue('[data-k="from"]') === 'job', await out());
await setPlan({ accounts: [cash], expenses: [living], incomes: [job({ to: '2030-12' }), job({ id: 'i2', name: 'Open', from: '2036-01' })], retire: r() });
ok('with a job that has no end: the warning, no way out to offer', /Pay stops/.test(await out()) && !(await page.isVisible('.fp-retire-out .fp-btn')), await out());

// 7. What goes by the date: contributions, spending, the mix.
await setPlan({ accounts: [cash, { id: 'b', name: 'Brokerage', kind: 'investment', balance: 0, rate: 0, monthly: 100 }], expenses: [{ id: 'e', name: 'Living', amount: 2000, every: 'month' }], incomes: [job({ to: '2030-10' })], retire: r({ from: 'job', spending: 3000 }) });
f = await facts();
const d = await page.evaluate((i) => { const p = fpGet(i); const pr = fpProject(p, 0, { detail: true }).detail; return { four: pr[4].contrib.b, five: pr[5].contrib.b || 0, spent: pr[5].spending, exp: pr[4].expenses }; }, id);
ok('contributions stop with the job, and retirement spending takes over', near(d.four, 1200) && d.five === 0 && near(d.spent, 36000), JSON.stringify(d));
const mix = (o) => page.evaluate(([i, o]) => { const p = fpGet(i); p.retire.from = o; return fpAdviceMix(p, fpProject(p, 0, {})); }, [id, o]);
const byAge = await mix('age'), byJob = await mix('job');
ok('the mix counts the years to the date in use', byJob.stocks < byAge.stocks, JSON.stringify([byAge.stocks, byJob.stocks]));

// 8. The age-55 exception goes by the job paying in. Born January 1975: 55 in 2030, 59½ in
// mid-2034. Money is short from the start, so the 401(k) is drawn on before then.
const k = { id: 'k', name: '401(k)', kind: 'retirement', planType: '401k', balance: 400000, rate: 0 };
const empty = { id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 };
const into = [{ id: 'r1', account: 'k', amount: 100, match: null }];
const costs = [{ id: 'e', name: 'Living', amount: 3000, every: 'month' }];
const charged = async (p) => { await setPlan(p); return page.evaluate((i) => fpProject(fpGet(i), 0, {}).milestones.penalties.pretax, id); };
const small = job({ amount: 1000, into: into });
let paid = await charged({ accounts: [empty, k], expenses: costs, incomes: [Object.assign({}, small, { to: '2031-06' })], retire: r({ ageYears: 58 }) });
const noLink = await charged({ accounts: [empty, k], expenses: costs, incomes: [job({ amount: 1000, to: '2031-06' })], retire: r({ ageYears: 58 }) });
ok('left at 56, still short of the age given: none from when it is left', noLink > paid, JSON.stringify([paid, noLink]));
await setPlan({ accounts: [empty, k], expenses: costs, incomes: [Object.assign({}, small, { to: '2031-06' })], retire: r({ ageYears: 58 }) });
let y = await page.evaluate((i) => fpProject(fpGet(i), 0, { detail: true }).detail.map(x => x.penalty.k || 0), id);
ok('charged while the job lasted, and not after', y[1] > 0 && y[6] === 0 && y[7] === 0, JSON.stringify(y.slice(0, 9)));
paid = await charged({ accounts: [empty, k], expenses: costs, incomes: [Object.assign({}, small, { to: '2027-06' })], retire: r({ ageYears: 58 }) });
ok('left at 52, retiring at 58: charged to 59½, retired or not', paid > 0 && await page.evaluate((i) => { const d = fpProject(fpGet(i), 0, { detail: true }).detail; return (d[8].penalty.k || 0) > 0 && !d[9]?.penalty.k; }, id), String(paid));
const lines2 = [Object.assign({}, small, { to: '2027-06' }), job({ id: 'i2', name: 'Later', amount: 1000, to: '2031-06', into: [{ id: 'r2', account: 'k', amount: 100, match: null }] })];
await setPlan({ accounts: [empty, k], expenses: costs, incomes: lines2, retire: r({ ageYears: 58 }) });
y = await page.evaluate((i) => fpProject(fpGet(i), 0, { detail: true }).detail.map(x => x.penalty.k || 0), id);
ok('two jobs into it: the later', y[3] > 0 && y[6] === 0, JSON.stringify(y.slice(0, 9)));
await setPlan({ accounts: [empty, k], expenses: costs, incomes: [job({ amount: 1000, into: into })], retire: r({ ageYears: 56 }) });
y = await page.evaluate((i) => fpProject(fpGet(i), 0, { detail: true }).detail.map(x => x.penalty.k || 0), id);
ok('a job with no end: the retirement date, as before', y[3] > 0 && y[6] === 0, JSON.stringify(y.slice(0, 9)));
const ira = Object.assign({}, k, { planType: 'ira' });
await setPlan({ accounts: [empty, ira], expenses: costs, incomes: [Object.assign({}, small, { to: '2031-06' })], retire: r({ ageYears: 58 }) });
y = await page.evaluate((i) => fpProject(fpGet(i), 0, { detail: true }).detail.map(x => x.penalty.k || 0), id);
ok('an IRA never has the exception', y[6] > 0, JSON.stringify(y.slice(0, 9)));

ok('no page errors', errors.length === 0, JSON.stringify(errors));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
