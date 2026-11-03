// Finance Planning's goals: big costs ahead, in today's dollars, paid when they fall —
// from the account chosen for them, then cash and savings as any shortfall is. A 529 is
// spent only on its goals, and takes nothing more after the last. Each is checked
// against sums done here; tax and inflation are off unless said, to keep them plain.
//
// The clock is Playwright's, fixed at 1 November 2026.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 1400 }, locale: 'en-US', permissions: ['clipboard-read', 'clipboard-write'] });
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
    fpSet(i, Object.assign(base, p));
    fpRender(document.querySelector('.fp-widget'));
}, [id, p]);
const run = (opts) => page.evaluate(([i, o]) => { const r = fpProject(fpGet(i), 0, o || {}); return { rows: r.rows, ms: r.milestones, snaps: r.snaps, first: r.first }; }, [id, opts || null]);
const near = (a, b, tol) => Math.abs(a - b) <= (tol === undefined ? 0.5 : tol);
const money = (x) => (x < 0 ? '−$' : '$') + Math.abs(Math.round(x)).toLocaleString('en-US');
const pay = { id: 'i1', name: 'Pay', amount: 5000, every: 'month', taxed: false };
const living = { id: 'e1', name: 'Living', amount: 3000, every: 'month' };

// 1. A one-off from cash, a year out.
await setPlan({ accounts: [{ id: 'c', name: 'Checking', kind: 'cash', balance: 50000, rate: 0 }], incomes: [pay], expenses: [living],
    goals: [{ id: 'g1', name: 'New car', cost: 20000, every: 'total', years: 1, from: '2027-11', account: '' }] });
let r = await run();
ok('before it falls, cash grows as it would', near(r.rows[1].cash, 50000 + 12 * 2000), r.rows[1].cash);
ok('it is paid in its month, out of cash', near(r.rows[2].cash, 50000 + 24 * 2000 - 20000), r.rows[2].cash);
ok('what came of it: due, nothing drawn from savings', near(r.ms.goals.g1.due, 20000) && r.ms.goals.g1.drawn === 0 && r.ms.goals.g1.first === 13 && r.ms.drawnEarly === null, JSON.stringify(r.ms.goals.g1));
let out = await page.innerText('.fp-goals-out');
ok('the readout: when, the cost, and cash covers it', /New car, Nov 2027: \$20,000 in today’s dollars, \$20,000 then\. Paid from cash, which covers it\./.test(out), out);
ok('Ahead names it', /New car Nov 2027: \$20,000/.test(await page.innerText('.fp-facts')));
ok('the chart marks it', await page.locator('.fp-chart .fp-goal-mark').count() === 1 && /New car, Nov 2027: \$20,000/.test(await page.locator('.fp-chart .fp-goal-mark title').textContent()));

// 2. College over four years from a 529, its cost rising 5% a year.
const T0 = 23; // September 2028, from November 2026
const due = [0, 1, 2, 3].map(k => 25000 * Math.pow(1.05, (T0 + 12 * k - 1) / 12));
// Cash enough for the emergency fund, so the month's leftover reaches the goal's step.
await setPlan({ accounts: [{ id: 'c', name: 'Checking', kind: 'cash', balance: 30000, rate: 0 }, { id: 'e', name: 'College 529', kind: 'education', balance: 60000, rate: 0, monthly: 500 }],
    incomes: [Object.assign({}, pay, { amount: 6000 })], expenses: [living],
    goals: [{ id: 'g2', name: 'Maya’s college', cost: 25000, every: 'year', years: 4, from: '2028-09', growth: 5, account: 'e' }] });
r = await run({ snapshots: true });
// The 529 by hand: 500 a month in, through the last payment; each payment as far as it goes.
let b = 60000, own = 0;
for (let t = 1; t <= 59; t++) { b += 500; const k = [0, 1, 2, 3].find(k => T0 + 12 * k === t); if (k !== undefined) { const g = Math.min(b, due[k]); b -= g; own += g; } }
const g2 = r.ms.goals.g2;
ok('four payments, each a year on, rising 5% a year from today’s $25,000', g2.count === 4 && near(g2.due, due.reduce((s, v) => s + v, 0)) && near(g2.today, 100000), JSON.stringify(g2));
ok('the 529 pays what it holds, untaxed', near(g2.fromOwn, own) && near(g2.held, 60000 + 500 * T0), [g2.fromOwn, own, g2.held].join());
ok('it is spent down to nothing', near(b, 0) && near(r.snaps[5].bal.e, 0), [b, r.snaps[5].bal.e].join());
ok('the rest came from cash, not savings', g2.drawn === 0 && r.ms.drawnEarly === null);
await page.waitForTimeout(700);
out = await page.innerText('.fp-goals-out');
const short = g2.due - g2.fromOwn;
ok('the readout: short, paid from cash instead', out.includes('College 529 covers ' + money(g2.fromOwn) + ' of it: short ' + money(short) + ', paid from cash instead.'), out);
const save = await page.evaluate((i) => fpGoalSaving(fpGet(i)).g2, id);
ok('and what a month more would cover it', out.includes(money(save) + ' a month more into College 529 from now would cover it'), out);
const shortWith = (x) => page.evaluate(([i, x]) => { const o = fpProject(fpGet(i), 0, { extra: { e: x } }).milestones.goals.g2; return o.due - o.fromOwn; }, [id, x]);
ok('that much covers it; a little less does not', (await shortWith(save)) < 1 && (await shortWith(save * 0.97)) >= 1, [save, await shortWith(save), await shortWith(save * 0.97)].join());
ok('the month’s hint says what it is', await page.evaluate(() => document.querySelector('tr[data-list="goals"] input[data-f="from"]').title) === 'When the first payment falls');
// Where the next dollar goes: the goal's step, and the leftover toward it.
let steps = await page.evaluate((i) => { const p = fpGet(i); return fpAdviceSteps(p, fpProject(p, 0), { value: fpGoalSaving(p) }); }, id);
const gs = steps.find(s => s.key === 'goals');
ok('a step for goals, after the emergency fund', gs && steps.findIndex(s => s.key === 'goals') === steps.findIndex(s => s.key === 'fund') + 1 && gs.status === 'todo' && near(gs.monthly, save), JSON.stringify(gs));
const adv = await page.innerText('.fp-advice');
ok('it says how much a month covers it', adv.includes('Maya’s college is short ' + money(short) + ': ' + money(save) + ' a month more into College 529 covers it'), adv.slice(0, 900));
ok('and the leftover goes toward it, after the fund', /Toward Maya’s college/.test(adv));
// Enough in the 529: covered.
await page.evaluate((i) => { const p = fpGet(i); p.accounts[1].balance = 120000; fpSet(i, p); fpRender(document.querySelector('.fp-widget')); }, id);
out = await page.innerText('.fp-goals-out');
ok('enough in it: covered, with what is left after', /College 529 covers it, with \$131,500 in it by then and \$[\d,]+ left after\./.test(out), out);
steps = await page.evaluate((i) => { const p = fpGet(i); return fpAdviceSteps(p, fpProject(p, 0), { value: fpGoalSaving(p) }); }, id);
ok('and the step is done', steps.find(s => s.key === 'goals').status === 'done');
r = await run({ snapshots: true });
ok('the 529 takes nothing more after the last payment', near(r.snaps[5].bal.e, r.snaps[6].bal.e) && near(r.snaps[5].bal.e, 120000 + 500 * 59 - r.ms.goals.g2.due), [r.snaps[5].bal.e, r.snaps[6].bal.e].join());

// 3. A 529 is not drawn on for anything else.
ok('a 529 is not in the withdrawal order', await page.evaluate((i) => !fpDrawOrder(fpGet(i)).some(a => a.kind === 'education'), id));

// 4. Cash short: savings make it up, before retirement.
await setPlan({ accounts: [{ id: 'c', name: 'Checking', kind: 'cash', balance: 5000, rate: 0 }, { id: 'b', name: 'Brokerage', kind: 'investment', balance: 100000, basis: 100000, rate: 0 }],
    incomes: [Object.assign({}, pay, { amount: 3000 })], expenses: [living],
    goals: [{ id: 'g3', name: 'Roof', cost: 20000, every: 'total', years: 1, from: '2026-12', account: '' }] });
r = await run();
ok('what cash cannot cover is drawn from savings', near(r.ms.goals.g3.drawn, 15000) && r.ms.drawnEarly === 2, JSON.stringify(r.ms.goals.g3));
out = await page.innerText('.fp-goals-out');
ok('and the readout says so', out.includes('Cash falls short: $15,000 of it is drawn from savings.'), out);
// Paid from the brokerage itself: its own account, not a shortfall.
await page.evaluate((i) => { const p = fpGet(i); p.goals[0].account = 'b'; fpSet(i, p); fpRender(document.querySelector('.fp-widget')); }, id);
r = await run();
ok('from its own account: paid from it, no shortfall to speak of', near(r.ms.goals.g3.fromOwn, 20000) && r.ms.goals.g3.drawn === 0 && r.ms.drawnEarly === null, JSON.stringify([r.ms.goals.g3, r.ms.drawnEarly]));
ok('the select offers held accounts, not property or loans', await page.evaluate(() => Array.from(document.querySelectorAll('tr[data-list="goals"] select[data-f="account"] option')).map(o => o.textContent).join()) === 'Cash, then savings,Checking,Brokerage');

// 5. After retirement: still paid, unlike an expense.
const retired = { on: true, birth: '1966-11', ageYears: 61, ageMonths: 0, until: 70, spending: 4000, buffer: 0 };
const withGoal = { accounts: [{ id: 'c', name: 'Checking', kind: 'cash', balance: 600000, rate: 0 }], incomes: [], expenses: [living], retire: retired,
    goals: [{ id: 'g4', name: 'Wedding', cost: 30000, every: 'total', years: 1, from: '2030-01', account: '' }] };
await setPlan(Object.assign({}, withGoal, { goals: [] }));
const without = await run();
await setPlan(withGoal);
r = await run();
ok('a goal after retirement is still paid', near(without.rows[5].net - r.rows[5].net, 30000) && r.ms.goals.g4.retired === true, [without.rows[5].net, r.rows[5].net].join());
ok('and the readout says how', (await page.innerText('.fp-goals-out')).includes('Paid in retirement, from cash and then savings in the withdrawal order.'));

// 6. Through the page: add one, the account it is paid from removed.
await setPlan({ accounts: [{ id: 'c', name: 'Checking', kind: 'cash', balance: 5000, rate: 0 }, { id: 's', name: 'Savings', kind: 'cash', balance: 9000, rate: 0 }], incomes: [pay], expenses: [living] });
ok('no goals yet: it says what they are for', /Unlike an expense, a goal is paid when it falls/.test(await page.innerText('[data-sec="goals"]')));
await page.click('[data-sec="goals"] .fp-btn:has-text("+ Goal")');
await page.keyboard.type('Kids college');
await page.fill('tr[data-list="goals"] input[data-f="cost"]', '30000');
await page.selectOption('tr[data-list="goals"] select[data-f="every"]', 'year');
await page.fill('tr[data-list="goals"] input[data-f="years"]', '4');
await page.fill('tr[data-list="goals"] input[data-f="from"]', '2035-09');
await page.selectOption('tr[data-list="goals"] select[data-f="account"]', 's');
let saved = await page.evaluate((i) => fpGet(i).goals[0], id);
ok('typed in, it is kept', saved.name === 'Kids college' && saved.cost === 30000 && saved.every === 'year' && saved.years === 4 && saved.from === '2035-09' && saved.account === 's', JSON.stringify(saved));
out = await page.innerText('.fp-goals-out');
ok('a school goal without a 529 suggests one', /A 529 grows untaxed and is spent untaxed on school/.test(out), out);
await page.click('[data-sec="goals"] .fp-btn:has-text("+ Section")');
await page.keyboard.type('Kids');
await page.evaluate((i) => { const p = fpGet(i); p.goals = [p.goals[1], p.goals[0]]; fpSet(i, p); fpRender(document.querySelector('.fp-widget')); }, id);
ok('a section of goals totals them in today’s dollars', (await page.innerText('tr.fp-sec-row[data-list="goals"] .fp-sec-total')) === '$120,000 in today’s dollars');
await page.click('tr[data-list="accounts"][data-id="s"] .fp-x');
saved = await page.evaluate((i) => fpGet(i).goals.find(g => g.name === 'Kids college'), id);
ok('the account it was paid from removed: back to cash, then savings', saved.account === '', JSON.stringify(saved));
const summary = await page.evaluate((i) => fpSummaryText(fpGet(i)), id);
ok('the copied summary lists it', /### Goals\n\n- Kids college, Sep 2035 to Sep 2038 \(4 payments\): \$120,000 in today’s dollars/.test(summary), summary.slice(summary.indexOf('### Goals'), summary.indexOf('### Goals') + 200));
ok('and its section', /- Goals — Kids: \$120,000 in today’s dollars/.test(summary));
const ai = await page.evaluate((i) => fpAITarget(i).text || JSON.stringify(fpAITarget(i)), id);
ok('the on-device model reads it too', /Goals \(big costs ahead/.test(ai) && /Kids college/.test(ai));
// A 529 among the kinds, with its note.
await page.evaluate((i) => { const p = fpGet(i); p.accounts.push({ id: 'e9', name: '529', kind: 'education', balance: 1000 }); fpSet(i, p); }, id);
const w = await page.evaluate(() => { const w = document.querySelector('.fp-widget'); w._open = new Set(['e9']); fpRender(w); return w.querySelector('tr.fp-detail[data-id="e9"]').innerText; });
ok('a 529 account, with what it is for', /grows untaxed, and comes out untaxed for school costs/.test(w), w);
ok('no page errors', errors.length === 0, JSON.stringify(errors));

console.log('  (all ' + count + ' assertions reached)');
await browser.close();
