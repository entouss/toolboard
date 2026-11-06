// Finance Planning's Duplicate: a copy right under the line, with all it holds and ids of its
// own, counted at once. What points at an account stays on the original.
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
const near = (a, b, tol) => Math.abs(a - b) <= (tol === undefined ? 0.5 : tol);
const get = () => page.evaluate((i) => fpGet(i), id);
const load = (extra) => page.evaluate(([i, x]) => {
    const base = fpDefaultPlan();
    base.tax = { on: false, payroll: false, status: 'single', year: '' };
    base.assume.spread = 0;
    base.accounts = [
        { id: 'c', name: 'Checking', kind: 'cash', balance: 10000, rate: 1 },
        { id: 'b', name: 'Brokerage', kind: 'investment', balance: 40000, basis: 25000, rate: 7, monthly: 100 },
        { id: 'k', name: '401(k)', kind: 'retirement', planType: '401k', balance: 90000, rate: 7 },
        { id: 'm', name: 'Mortgage', kind: 'loan', balance: 200000, rate: 6, monthly: null, loan: { amount: 250000, years: 30, extra: 50, closing: '' } }];
    base.incomes = [{ id: 'sec', type: 'section', name: 'Work', folded: false },
        { id: 'i1', name: 'Salary', amount: 8000, every: 'month', growth: 3, taxed: true, deductions: 600, matchRate: 50, matchCap: 6, into: [{ id: 'r1', account: 'k', amount: 500, match: null }] },
        { id: 'i2', name: 'Rent', amount: 500, every: 'month', taxed: false, wages: false }];
    base.expenses = [{ id: 'e1', name: 'Living', amount: 3000, every: 'month', to: '2040-01' }];
    base.goals = [{ id: 'g1', name: 'Roof', cost: 15000, every: 'total', years: 1, from: '2030-06', growth: 4, account: 'b' }];
    base.surplusTo = 'c';
    const w = document.querySelector('.fp-widget');
    w._open = new Set();
    fpSet(i, Object.assign(base, x || {}));
    fpRender(w);
}, [id, extra || null]);
const dup = async (list, item) => { await page.click('tr[data-list="' + list + '"][data-id="' + item + '"] .fp-dup'); await page.waitForTimeout(120); };
const ids = (l) => l.map(x => x.id);

// 1. Each kind of line, right under itself.
await load();
const net0 = await page.evaluate((i) => fpRollup(fpGet(i)).net, id);
await dup('accounts', 'b');
let p = await get();
const b2 = p.accounts[2];
ok('an account: right under it, named, with an id of its own', p.accounts[1].id === 'b' && b2.name === 'Brokerage copy' && b2.id !== 'b' && p.accounts.length === 5, JSON.stringify(ids(p.accounts)));
ok('with what it holds, its basis too', b2.balance === 40000 && b2.basis === 25000 && b2.rate === 7 && b2.monthly === 100 && b2.kind === 'investment');
ok('counted at once', near(await page.evaluate((i) => fpRollup(fpGet(i)).net, id), net0 + 40000));
ok('the name is ready to type over', await page.evaluate(() => { const a = document.activeElement; return a.dataset.f === 'name' && a.value === 'Brokerage copy' && a.selectionStart === 0 && a.selectionEnd === a.value.length; }));
ok('a copied account goes right after its original in the withdrawal order', (() => { const d = ids(p.drawOrder); return d[d.indexOf('b') + 1] === b2.id; })(), JSON.stringify(ids(p.drawOrder)));
await page.fill('tr[data-id="' + b2.id + '"] [data-f="balance"]', '1000');
await page.waitForTimeout(150);
p = await get();
ok('editing the copy leaves the original', p.accounts[1].balance === 40000 && p.accounts[2].balance === 1000);

await load();
await dup('accounts', 'm');
p = await get();
ok('a loan: its terms, not shared', p.accounts[4].loan.amount === 250000 && p.accounts[4].loan.extra === 50 && p.accounts[4].loan !== undefined);
await page.evaluate((i) => { const q = fpGet(i); q.accounts[4].loan.extra = 99; fpSet(i, q); }, id);
ok('changing them leaves the original', (await get()).accounts[3].loan.extra === 50);

await load();
await dup('incomes', 'i1');
p = await get();
const c = p.incomes[2];
ok('a pay line: under it, in its section, all it holds', p.incomes[1].id === 'i1' && c.name === 'Salary copy' && c.amount === 8000 && c.deductions === 600 && c.matchRate === 50 && c.matchCap === 6 && c.growth === 3, JSON.stringify(c));
ok('its pay-into rows, with ids of their own, to the same account', c.into.length === 1 && c.into[0].id !== 'r1' && c.into[0].account === 'k' && c.into[0].amount === 500);
await page.evaluate(() => { const w = document.querySelector('.fp-widget'); w._open = new Set([...w.querySelectorAll('tr[data-list="incomes"]')].map(r => r.dataset.id)); fpRender(w); });
await page.fill('tr.fp-detail[data-id="' + c.id + '"] [data-f="into.amount"]', '200');
await page.waitForTimeout(150);
p = await get();
ok('editing them leaves the original', p.incomes[1].into[0].amount === 500 && p.incomes[2].into[0].amount === 200);
const income = await page.evaluate((i) => fpProject(fpGet(i), 0, {}).first.income, id);
ok('counted at once', near(income, 16500), String(income));

await load();
await dup('expenses', 'e1');
p = await get();
ok('an expense: its dates too', p.expenses.length === 2 && p.expenses[1].name === 'Living copy' && p.expenses[1].to === '2040-01');
await dup('goals', 'g1');
p = await get();
ok('a goal: all of it, from the same account', p.goals.length === 2 && p.goals[1].name === 'Roof copy' && p.goals[1].cost === 15000 && p.goals[1].from === '2030-06' && p.goals[1].account === 'b' && p.goals[1].growth === 4);

// 2. What points at an account stays on the original.
await load();
await dup('accounts', 'k');
await dup('accounts', 'c');
await dup('accounts', 'b');
p = await get();
ok('pay, goals and the leftover stay on the original', p.incomes[1].into[0].account === 'k' && p.goals[0].account === 'b' && p.surplusTo === 'c');

// 3. Social Security.
const ss = { id: 'ss', type: 'ss', name: 'Social Security', birth: '1985-11', fraBenefit: null, claimYears: 67, claimMonths: 0, every: 'month', to: '', taxed: true };
const incomes = [{ id: 'i1', name: 'Salary', amount: 8000, every: 'month', taxed: true }, { id: 'i9', name: 'Old job', amount: 1000, every: 'month', taxed: true, off: true }, ss];
await load({ incomes: incomes });
const est = () => page.evaluate((i) => { const q = fpGet(i); return fpEntries(q.incomes).filter(l => l.type === 'ss').map(l => { const e = fpSSEstimate(q, l); return e ? Math.round(e.pia) : 0; }); }, id);
const before = (await est())[0];
await dup('incomes', 'ss');
p = await get();
const after = await est();
ok('duplicated: the first keeps its estimate', before > 0 && after[0] === before, JSON.stringify([before, after]));
ok('by naming its pay, a line turned off among it', p.incomes[2].payFrom.includes('i1') && p.incomes[2].payFrom.includes('i9'), JSON.stringify(p.incomes[2].payFrom));
ok('the copy starts with none', p.incomes[3].type === 'ss' && Array.isArray(p.incomes[3].payFrom) && p.incomes[3].payFrom.length === 0 && after[1] === 0, JSON.stringify(after));

// 4. A line turned off; undo; sections have no button.
await load();
await page.uncheck('tr[data-list="expenses"][data-id="e1"] .fp-on');
await page.waitForTimeout(120);
await dup('expenses', 'e1');
p = await get();
ok('an off line’s copy is off too', p.expenses.length === 2 && p.expenses[1].off === true);
await page.evaluate(() => undoLast());
await page.waitForTimeout(250);
ok('undone like any edit', (await get()).expenses.length === 1);
ok('a section has no button', await page.locator('tr.fp-sec-row .fp-dup').count() === 0);
await load();
await page.evaluate(() => { const w = document.querySelector('.fp-widget'); w.querySelector('tr[data-id="e1"] [data-f="name"]').value = ''; });
await page.evaluate((i) => { const q = fpGet(i); q.expenses[0].name = ''; fpSet(i, q); fpRender(document.querySelector('.fp-widget')); }, id);
await dup('expenses', 'e1');
ok('a line with no name: its copy has none', (await get()).expenses[1].name === '');

ok('no page errors', errors.length === 0, JSON.stringify(errors));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
