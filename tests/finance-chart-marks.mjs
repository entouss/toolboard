// Finance Planning's chart: the strip of icons above the years. Each mark's date is checked
// against the plan, then how pay lines become job changes, how the marks stack, and what
// narrowing the years and clicking a mark do.
//
// The clock is Playwright's, fixed at 1 November 2026.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ viewport: { width: 1300, height: 1400 }, locale: 'en-US' })).newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.clock.install({ time: new Date(2026, 10, 1, 10, 0, 0) });
await page.goto('http://localhost:8777/index.html#tool/finance-planning');
await page.waitForSelector('.fp-widget .fp-empty', { timeout: 25000 });
const id = await page.evaluate(() => document.querySelector('.fp-widget').closest('.tool').dataset.tool);
await page.evaluate((i) => setToolMode(i, 'split'), id);
const setPlan = (p) => page.evaluate(([i, p]) => {
    const base = fpDefaultPlan();
    base.tax = { on: false, payroll: false, status: 'single', year: '' };
    base.assume.inflation = 0;
    base.assume.spread = 0;
    base.assume.target = 0;
    const w = document.querySelector('.fp-widget');
    w._yearT = null;
    fpSet(i, Object.assign(base, p));
    fpRender(w);
}, [id, p]);
const marks = () => page.evaluate(() => Array.from(document.querySelectorAll('.fp-chart .fp-mark')).map(g => ({ kind: g.getAttribute('class').replace('fp-mark fp-mark-', ''), text: g.querySelector('title').textContent, t: Number(g.dataset.t),
    x: Number(/translate\(([\d.]+) ([\d.]+)\)/.exec(g.getAttribute('transform'))[1]), y: Number(/translate\(([\d.]+) ([\d.]+)\)/.exec(g.getAttribute('transform'))[2]) })));
const has = (list, kind, re) => list.some(m => m.kind === kind && re.test(m.text));
const cash = (balance) => ({ id: 'c', name: 'Checking', kind: 'cash', balance: balance, rate: 0 });
const pay = (o) => Object.assign({ id: 'i1', name: 'Salary', amount: 6000, every: 'month', taxed: false }, o);
const living = { id: 'e1', name: 'Living', amount: 3000, every: 'month' };

// 1. Nothing to mark: no strip.
await setPlan({ accounts: [cash(1000)], incomes: [pay()], expenses: [living] });
let m = await marks();
const plain = await page.evaluate(() => document.querySelector('.fp-chart').getAttribute('viewBox'));
ok('nothing dated: no marks, and the chart its usual height', m.length === 0 && plain === '0 0 640 200', plain);

// 2. A job change, new pay, pay ending.
await setPlan({ accounts: [cash(1000)], expenses: [living], incomes: [pay({ to: '2030-05' }), pay({ id: 'i2', name: 'New job', from: '2030-06' })] });
m = await marks();
ok('a line ending, another starting the month after: one job change, when the new one starts', m.length === 1 && has(m, 'job', /^Job change: Salary to New job, Jun 2030$/), JSON.stringify(m));
await setPlan({ accounts: [cash(1000)], expenses: [living], incomes: [pay({ to: '2030-05' }), pay({ id: 'i2', name: 'New job', from: '2030-09' })] });
m = await marks();
ok('three months between them still is', m.length === 1 && has(m, 'job', /Job change: Salary to New job, Sep 2030/), JSON.stringify(m));
await setPlan({ accounts: [cash(1000)], expenses: [living], incomes: [pay({ to: '2030-05' }), pay({ id: 'i2', name: 'New job', from: '2031-01' })] });
m = await marks();
ok('further apart: pay ending, then new pay', m.length === 2 && has(m, 'payend', /^Salary ends, Jun 2030$/) && has(m, 'paynew', /^New job starts, Jan 2031$/), JSON.stringify(m));
await setPlan({ accounts: [cash(1000)], expenses: [living], incomes: [pay({ wages: false, to: '2030-05' }), pay({ id: 'i2', name: 'Pension', wages: false, from: '2030-06' }), pay({ id: 'i3', name: 'Old', from: '2020-01' })] });
ok('a pension or rent is not pay, and a line begun before today is not news', (await marks()).length === 0, JSON.stringify(await marks()));

// 3. Each milestone, on the date the plan gives it.
await setPlan({ accounts: [cash(20000), { id: 'r', name: 'IRA', kind: 'retirement', planType: 'ira', tax: 'pretax', balance: 600000, rate: 5 }, { id: 'l', name: 'Car', kind: 'loan', balance: 3000, rate: 0, monthly: 500 }],
    incomes: [pay(), { id: 'ss', type: 'ss', name: 'Social Security', birth: '1985-11', fraBenefit: 2000, claimYears: 67, claimMonths: 0, every: 'month', to: '', taxed: false }], expenses: [living],
    retire: Object.assign(await page.evaluate(() => fpDefaultPlan().retire), { on: true, birth: '1985-11', ageYears: 50, ageMonths: 0, until: 95, health: true, healthAfter: 200, spending: 4000 }),
    assume: Object.assign(await page.evaluate(() => fpDefaultPlan().assume), { inflation: 0, spread: 0, target: 900000 }),
    goals: [{ id: 'g1', name: 'Car', cost: 10000, every: 'total', years: 1, from: '2028-03', account: '' }] });
m = await marks();
const ms = await page.evaluate((i) => fpProject(fpGet(i), 0, {}).milestones, id);
ok('retirement', has(m, 'retire', /^Retirement, Nov 2035, at 50$/), JSON.stringify(m.map(x => x.text)));
ok('Social Security', has(m, 'ss', /^Social Security starts, Nov 2052, at 67$/));
ok('Medicare', has(m, 'medicare', /^Medicare starts, Nov 2050, at 65$/));
ok('debt-free', has(m, 'debt', /^Debt-free, Apr 2027, at 41$/) && ms.debtFree === 6, String(ms.debtFree));
ok('the net-worth goal', ms.target === null ? !m.some(x => x.kind === 'target') : has(m, 'target', /^\$900,000 net worth, /), String(ms.target));
ok('minimum withdrawals', ms.rmd > 0 && has(m, 'rmd', /^Required minimum withdrawals start, /));
ok('a goal, with what it comes to', has(m, 'goal', /^Car, Mar 2028, at 42: \$10,000$/));
ok('the first penalty', has(m, 'penalty', /^First early-withdrawal penalty, /), JSON.stringify(ms.penalties));
ok('a legend entry for each kind on show, and none for the rest', await page.evaluate((kinds) => {
    const keys = Array.from(document.querySelectorAll('.fp-legend .fp-key-mark')).map(k => k.getAttribute('class').replace('fp-key-mark fp-mark-', ''));
    return keys.length === kinds.length && kinds.every(k => keys.includes(k));
}, [...new Set(m.map(x => x.kind))]));

// 4. Savings running out.
await setPlan({ accounts: [cash(2000)], incomes: [pay({ amount: 1000 })], expenses: [living] });
m = await marks();
ok('cash running out', has(m, 'out', /^Cash runs out, /), JSON.stringify(m));

// 5. Marks in the same place stack; the chart grows by the strip, the lines keep their room.
await setPlan({ accounts: [cash(100000)], incomes: [pay()], expenses: [living],
    goals: [{ id: 'a', name: 'One', cost: 100, every: 'total', years: 1, from: '2030-01', account: '' }, { id: 'b', name: 'Two', cost: 100, every: 'total', years: 1, from: '2030-01', account: '' }, { id: 'c2', name: 'Three', cost: 100, every: 'total', years: 1, from: '2033-01', account: '' }] });
m = await marks();
const one = m.find(x => /One/.test(x.text)), two = m.find(x => /Two/.test(x.text)), three = m.find(x => /Three/.test(x.text));
ok('two in a month: one under the other', one.x === two.x && two.y - one.y === 14, JSON.stringify(m));
ok('one clear of them goes back to the first row', three.y === one.y);
const box = await page.evaluate(() => { const c = document.querySelector('.fp-chart'); return { view: c.getAttribute('viewBox'), hit: Number(c.querySelector('.fp-hit').getAttribute('height')) }; });
ok('the strip adds to the height, not taken from the lines', box.view === '0 0 640 232' && box.hit === 168, JSON.stringify(box));

// 6. Clicking one opens its year.
await page.click('.fp-chart .fp-mark-goal >> nth=0');
await page.waitForSelector('.fp-yd');
const opened = await page.evaluate(() => ({ t: document.querySelector('.fp-widget')._yearT, text: document.querySelector('.fp-yd').innerText }));
ok('a click opens the year it falls in', opened.t === one.t && /Goal paid: One/.test(opened.text), String(opened.t));
await page.focus('.fp-chart .fp-mark-goal >> nth=2');
await page.keyboard.press('Enter');
await page.waitForTimeout(100);
ok('and Enter', await page.evaluate(() => document.querySelector('.fp-widget')._yearT) === three.t);

// 7. Narrowing the years narrows the marks.
await page.selectOption('.fp-range-from', '2032');
await page.waitForTimeout(150);
const left = await marks();
ok('years narrowed: only the marks within them', left.length === 1 && /Three/.test(left[0].text), JSON.stringify(left));
ok('and the legend still knows them', await page.locator('.fp-legend .fp-key-mark').count() === 1);

// 8. The example has one of nearly everything, and the job change tells its year.
const page2 = await (await browser.newContext({ viewport: { width: 1300, height: 1400 }, locale: 'en-US' })).newPage();
await page2.clock.install({ time: new Date(2026, 10, 1, 10, 0, 0) });
await page2.goto('http://localhost:8777/index.html#tool/finance-planning?example=1');
await page2.waitForSelector('.fp-chart .fp-mark', { timeout: 25000 });
const ex = await page2.evaluate(() => Array.from(document.querySelectorAll('.fp-chart .fp-mark title')).map(t => t.textContent));
ok('the example: retirement, a job change, Social Security, Medicare, debt-free, withdrawals, a penalty and its goals', ['Retirement', 'Job change: Salary to New job, Jun 2032', 'Social Security starts', 'Medicare starts', 'Debt-free', 'Required minimum', 'First early-withdrawal', 'Kid’s college', 'New car', 'New roof']
    .every(w => ex.some(t => t.startsWith(w))), JSON.stringify(ex));
await page2.click('.fp-chart .fp-mark-job');
await page2.waitForSelector('.fp-yd');
ok('the year it opens says so', /Job change: Salary to New job, Jun 2032, at 46\./.test(await page2.innerText('.fp-yd')));

ok('no page errors', errors.length === 0, JSON.stringify(errors));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
