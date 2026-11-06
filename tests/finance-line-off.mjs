// Finance Planning's lines turned off. The test of it: a plan with a line off comes to exactly
// what it comes to with the line deleted, for every kind of line. Then what points at an
// account that is off, what the tables show, and that nothing is lost in between.
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

const plan = () => ({
    accounts: [
        { id: 'c', name: 'Checking', kind: 'cash', balance: 20000, rate: 0 },
        { id: 's', name: 'Savings', kind: 'cash', balance: 30000, rate: 2, monthly: 100 },
        { id: 'b', name: 'Brokerage', kind: 'investment', balance: 50000, basis: 30000, rate: 6, monthly: 200 },
        { id: 'k', name: '401(k)', kind: 'retirement', planType: '401k', balance: 100000, rate: 6 },
        { id: 'r', name: 'Roth', kind: 'retirement', planType: 'ira', tax: 'roth', balance: 40000, basis: 20000, rate: 6, monthly: 100 },
        { id: 'h', name: 'House', kind: 'property', balance: 300000, rate: 3 },
        { id: 'l', name: 'Car loan', kind: 'loan', balance: 15000, rate: 6, monthly: 400 }
    ],
    incomes: [
        { id: 'i1', name: 'Salary', amount: 9000, every: 'month', taxed: true, deductions: 1000, matchRate: 50, matchCap: 6, into: [{ id: 'r1', account: 'k', amount: 800, match: null }] },
        { id: 'i2', name: 'Rent', amount: 1000, every: 'month', taxed: true, wages: false },
        { id: 'ss', type: 'ss', name: 'Social Security', birth: '1980-05', fraBenefit: 2500, claimYears: 67, claimMonths: 0, every: 'month', to: '', taxed: true }
    ],
    expenses: [{ id: 'e1', name: 'Living', amount: 3000, every: 'month' }, { id: 'e2', name: 'Childcare', amount: 800, every: 'month', to: '2032-08' }],
    goals: [{ id: 'g1', name: 'Car', cost: 30000, every: 'total', years: 1, from: '2030-06', account: '' }, { id: 'g2', name: 'Roof', cost: 15000, every: 'total', years: 1, from: '2031-03', account: 's' }],
    drawOrder: []
});
const load = (p) => page.evaluate(([i, p]) => {
    const base = fpDefaultPlan();
    base.retire = Object.assign(base.retire, { on: true, birth: '1980-05', ageYears: 62, until: 90, spending: 5000 });
    base.assume.spread = 0;
    const w = document.querySelector('.fp-widget');
    w._open = new Set();
    fpSet(i, Object.assign(base, p));
    fpRender(w);
}, [id, p]);
const comes = () => page.evaluate((i) => { const p = fpGet(i); const r = fpProject(p, 0, {}); return JSON.stringify({ rows: r.rows, first: r.first, ms: r.milestones, roll: fpRollup(p), stop: fpNeededToStop(p).earliest }); }, id);
const facts = () => page.evaluate((i) => { const p = fpGet(i); const r = fpProject(p, 0, {}); return { first: r.first, ms: r.milestones, roll: fpRollup(p), rows: r.rows, into: r.into }; }, id);

// 1. Off is deleted, for every kind of line.
const cases = [['accounts', 'b', 'an investment account'], ['accounts', 'r', 'a Roth'], ['accounts', 'h', 'a house'], ['accounts', 'l', 'a loan'], ['accounts', 'c', 'the first cash account'],
    ['incomes', 'i1', 'a job'], ['incomes', 'i2', 'other income'], ['incomes', 'ss', 'Social Security'], ['expenses', 'e1', 'an expense'], ['expenses', 'e2', 'a dated expense'], ['goals', 'g1', 'a goal']];
for (const [list, item, label] of cases) {
    const off = plan(); off[list].find(x => x.id === item).off = true;
    await load(off);
    const a = await comes();
    const gone = plan(); gone[list] = gone[list].filter(x => x.id !== item);
    await load(gone);
    ok(label + ': off comes to the same as deleted', a === await comes());
}

// 2. What points at an account that is off.
let p = plan(); p.accounts.find(a => a.id === 's').off = true;
await load(p);
const roofOff = await comes();
p = plan(); p.accounts = p.accounts.filter(a => a.id !== 's'); p.goals[1].account = '';
await load(p);
ok('a goal paid from it: from cash and savings, as if it had none', roofOff === await comes());
p = plan(); p.accounts.find(a => a.id === 's').off = true;
await load(p);
let out = await page.innerText('.fp-goals-out');
ok('and it says why', /Savings is off\./.test(out), out);
ok('its setting is kept, and the list still shows it', await page.evaluate((i) => fpGet(i).goals[1].account, id) === 's' &&
    await page.evaluate(() => { const s = document.querySelector('tr[data-id="g2"] [data-f="account"]'); return s.value === 's' && /\(off\)/.test(s.selectedOptions[0].textContent); }));

p = plan(); p.surplusTo = 's'; p.accounts.find(a => a.id === 's').off = true;
await load(p);
let f = await facts();
ok('what is left over: to the first cash account, the choice kept', f.into === 'c' && await page.evaluate((i) => fpGet(i).surplusTo, id) === 's', f.into);

// Pay into it: stays in take-home, the match with it.
await load(plan());
const on = (await facts()).first;
p = plan(); p.accounts.find(a => a.id === 'k').off = true;
await load(p);
f = await facts();
ok('pay into it stays in take-home', near(f.first.deductions, on.deductions - 800) && f.first.payrollOwn === 0, JSON.stringify([on.deductions, f.first.deductions]));
ok('and the match stops', on.payrollMatch > 0 && f.first.payrollMatch === 0, String(on.payrollMatch));
await page.evaluate(() => { const w = document.querySelector('.fp-widget'); w._open = new Set(['i1']); fpRender(w); });
ok('the pay line says so', /401\(k\) is off: \$800 a month stays in take-home/.test(await page.innerText('tr.fp-detail[data-id="i1"]')), await page.innerText('tr.fp-detail[data-id="i1"]'));
ok('its rows are kept', await page.evaluate((i) => { const l = fpGet(i).incomes[0]; return l.deductions === 1000 && l.into.length === 1 && l.into[0].account === 'k'; }, id));

// A job off, for what goes by it.
p = plan(); p.incomes[0].to = '2030-05'; p.incomes.push({ id: 'i3', name: 'Later', amount: 9000, every: 'month', taxed: true, to: '2040-12', off: true }); p.incomes.splice(2, 1); p.retire = undefined;
await page.evaluate(([i, p]) => { const base = fpDefaultPlan(); base.retire = Object.assign(base.retire, { on: true, from: 'job', birth: '1980-05', until: 90 }); delete p.retire; fpSet(i, Object.assign(base, p)); fpRender(document.querySelector('.fp-widget')); }, [id, p]);
ok('a job off is not the last job', await page.evaluate((i) => fpRetireInfo(fpGet(i)).ym, id) === '2030-06');
const pia = (extra) => page.evaluate(([i, extra]) => { const p = fpGet(i); const ss = { id: 'ss', type: 'ss', name: 'SS', birth: '1980-05', claimYears: 67, claimMonths: 0, every: 'month' };
    return fpSSEstimate(Object.assign({}, p, { incomes: [{ id: 'x', name: 'Pay', amount: 6000, every: 'month' }, ss].concat(extra) }), ss).pia; }, [id, extra]);
const off1 = await pia([{ id: 'y', name: 'More', amount: 6000, every: 'month', off: true }]), off2 = await pia([]), on2 = await pia([{ id: 'y', name: 'More', amount: 6000, every: 'month' }]);
ok('nor does it count toward a Social Security estimate', near(off1, off2, 0.01) && on2 > off2, JSON.stringify([off1, off2, on2]));

// The birth month, from a line turned off.
await page.evaluate((i) => { const base = fpDefaultPlan(); base.retire = Object.assign(base.retire, { on: true, birth: '' }); base.incomes = [{ id: 'ss', type: 'ss', name: 'Social Security', birth: '1980-05', fraBenefit: 2000, claimYears: 67, claimMonths: 0, every: 'month', to: '', taxed: false, off: true }]; base.accounts = [{ id: 'c', name: 'Checking', kind: 'cash', balance: 1000, rate: 0 }]; fpSet(i, base); fpRender(document.querySelector('.fp-widget')); }, id);
f = await facts();
ok('Social Security off still gives the birth month, and pays nothing', f.ms.retire !== null && f.rows[f.rows.length - 1].age !== null && await page.evaluate((i) => fpProject(fpGet(i), 0, { detail: true }).detail.every(d => !d.income.ss), id), String(f.ms.retire));

// 3. The withdrawal order.
await load(plan());
const order = () => page.evaluate(() => Array.from(document.querySelectorAll('tr[data-list="drawOrder"]')).map(r => r.dataset.id).join());
const was = await order();
await page.uncheck('tr[data-list="accounts"][data-id="b"] .fp-on');
await page.waitForTimeout(150);
ok('off: out of the withdrawal order', await order() === was.split(',').filter(x => x !== 'b').join(), await order());
await page.focus('tr[data-list="drawOrder"][data-id="s"] .fp-grip');
await page.keyboard.press('ArrowDown');
await page.waitForTimeout(150);
const moved = await order();
ok('a step goes past where it was hidden', moved.split(',').indexOf('s') === was.split(',').filter(x => x !== 'b').indexOf('s') + 1, moved);
await page.check('tr[data-list="accounts"][data-id="b"] .fp-on');
await page.waitForTimeout(150);
ok('back on: back in the order', (await order()).split(',').length === was.split(',').length && (await order()).includes('b'), await order());
await load(plan());
const seq = (await order()).split(',');
await page.uncheck('tr[data-list="accounts"][data-id="b"] .fp-on');
await page.waitForTimeout(100);
await page.check('tr[data-list="accounts"][data-id="b"] .fp-on');
await page.waitForTimeout(100);
ok('off and on again: the same place', (await order()) === seq.join(), await order());

// 4. In the tables.
await load(plan());
const net = (await facts()).roll.net;
await page.uncheck('tr[data-list="accounts"][data-id="h"] .fp-on');
await page.waitForTimeout(150);
f = await facts();
ok('unticked: net worth goes down by it, saved as off', near(net - f.roll.net, 300000) && await page.evaluate((i) => fpGet(i).accounts.find(a => a.id === 'h').off, id) === true);
ok('the row stays, dimmed, and can still be edited', await page.isVisible('tr[data-id="h"].fp-line-off') && await page.isEditable('tr[data-id="h"] [data-f="balance"]'));
ok('focus stays on the box', await page.evaluate(() => document.activeElement.classList.contains('fp-on') && document.activeElement.closest('tr').dataset.id === 'h'));
await page.fill('tr[data-id="h"] [data-f="balance"]', '350000');
await page.waitForTimeout(200);
ok('edited while off: still counts for nothing', near((await facts()).roll.net, f.roll.net));
await page.check('tr[data-list="accounts"][data-id="h"] .fp-on');
await page.waitForTimeout(150);
ok('ticked again: back, with the edit, and no trace of being off', near((await facts()).roll.net, net + 50000) && await page.evaluate((i) => !('off' in fpGet(i).accounts.find(a => a.id === 'h')), id));
for (const [list, item] of [['incomes', 'i2'], ['expenses', 'e1'], ['goals', 'g1']]) ok('a box on each ' + list + ' line', await page.isChecked('tr[data-list="' + list + '"][data-id="' + item + '"] .fp-on'));

// Sections.
p = plan(); p.expenses = [{ id: 'sx', type: 'section', name: 'Home', folded: false }].concat(p.expenses); p.expenses[2].off = true;
await load(p);
const total = () => page.innerText('tr.fp-sec-row[data-list="expenses"] .fp-sec-total');
ok('a section leaves it out, and says so', /^\$3,000 \/ mo .* · 1 off$/.test(await total()), await total());
await page.uncheck('tr[data-list="expenses"][data-id="e1"] .fp-on');
await page.waitForTimeout(150);
ok('all of it off: only that', await total() === '2 off', await total());

// 5. Read away from the tables.
const summary = await page.evaluate((i) => fpSummaryText(fpGet(i)), id);
ok('Copy summary names what is left out', /Left out for now: Living, Childcare\./.test(summary), summary.slice(0, 400));
const ai = await page.evaluate((i) => fpAITarget(i).text || JSON.stringify(fpAITarget(i)), id);
ok('the on-device model is told, and does not count them', /Left out for now, and not in anything below: Living, Childcare/.test(ai) && !/- Living/.test(ai));

// 6. Nothing lost: undone, and through a reload.
await load(plan());
await page.uncheck('tr[data-list="expenses"][data-id="e2"] .fp-on');
await page.waitForTimeout(150);
const saved = await page.evaluate((i) => JSON.stringify(toolCustomizations[i].financePlan.expenses), id);
ok('kept on the plan as saved', /"off":true/.test(saved), saved);
await page.evaluate(() => undoLast());
await page.waitForTimeout(250);
ok('undone like any edit', await page.evaluate((i) => !fpGet(i).expenses.find(e => e.id === 'e2').off, id));

// 7. A plan with nothing off is as it was.
await load(plan());
ok('no lines off: nothing is said', !/Left out for now/.test(await page.evaluate((i) => fpSummaryText(fpGet(i)), id)) && await page.locator('.fp-line-off').count() === 0);

ok('no page errors', errors.length === 0, JSON.stringify(errors));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
