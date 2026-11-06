// The most that could be spent a month and last to the age in Retirement, stopping now, on the
// plan's date, or at a picked year. Spending exactly that must last, and a little more must not.
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
await page.evaluate(() => {
    window.mk = (p) => { const base = fpDefaultPlan(); return Object.assign(base, p, { retire: Object.assign(base.retire, p.retire), assume: Object.assign(base.assume, p.assume) }); };
    window.lastsOn = (p, v) => fpProject(Object.assign({}, p, { retire: Object.assign({}, p.retire, { spending: v }) }), 0).milestones.runsOut === null;
});
const plan = (retire, more) => Object.assign({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 30000, rate: 1 },
        { id: 'b', name: 'Brokerage', kind: 'investment', balance: 400000, basis: 250000, rate: 7 },
        { id: 'k', name: '401(k)', kind: 'retirement', planType: '401k', balance: 500000, rate: 7 }],
    incomes: [{ id: 'i', name: 'Pay', amount: 12000, every: 'month', taxed: true, to: '2045-06' },
        { id: 'ss', type: 'ss', name: 'SS', birth: '1973-06', fraBenefit: 2500, claimYears: 67, claimMonths: 0, every: 'month', to: '', taxed: true }],
    expenses: [{ id: 'e', name: 'Living', amount: 5000, every: 'month' }],
    retire: Object.assign({ on: true, from: 'job', birth: '1973-06', until: 95, spending: 5200, buffer: 6 }, retire), assume: { real: true, inflation: 3 } }, more);

// 1. On the plan's date: the figure Retirement gives, and it is the edge.
let r = await page.evaluate((p) => { const q = mk(p), n = fpNeededToStop(q); return { plan: n.spend.plan, max: fpRetireMax(q, 0), at: lastsOn(q, n.spend.plan), over: lastsOn(q, n.spend.plan + 100), text: fpLastToText(n, false) }; }, plan());
ok('on the plan’s date, the same as Retirement gives', r.plan === r.max && r.plan > 0, String(r.plan));
ok('spending that lasts, and $100 more does not', r.at && !r.over);

// 2. Stopping now: set against a plan that really retires now.
r = await page.evaluate((p) => {
    const n = fpNeededToStop(mk(p));
    const now = mk(Object.assign({}, p, { incomes: p.incomes.filter(l => l.type === 'ss') }));
    now.retire = Object.assign({}, now.retire, { from: 'age', ageYears: 53, ageMonths: 0 });
    return { now: n.spend.now, at: lastsOn(now, n.spend.now), over: lastsOn(now, n.spend.now + 100), later: fpRetireInfo(fpCalc(now)).date <= new Date() };
}, plan());
ok('the set-up really retires now', r.later);
ok('stopping now: that lasts, and $100 more does not', r.now > 0 && r.at && !r.over, String(r.now));

// 3. The years: more the later work stops, and over what is planned just as it could stop.
r = await page.evaluate((p) => {
    const n = fpNeededToStop(mk(p)), e = n.earliest;
    return { e, before: e > 0 ? n.spendAt(n.rows[e - 1].t) : null, at: n.spendAt(n.rows[e].t), ten: [0, 3, 6, 9].map(k => n.spendAt(n.rows[k].t)), again: n.spendAt(n.rows[e].t) === n.spendAt(n.rows[e].t), none: n.spendAt(5) };
}, plan({}, { accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 30000, rate: 1 }, { id: 'b', name: 'Brokerage', kind: 'investment', balance: 200000, basis: 150000, rate: 7 }] }));
ok('more the later work stops', r.ten.every((v, i) => !i || v > r.ten[i - 1]), r.ten.join());
ok('it crosses the plan’s spending the year it could stop', r.at >= 5200 && r.before < 5200, JSON.stringify([r.before, r.at]));
ok('a month that is no year’s start has none', r.none === undefined);

// 4. Nothing to spend, whether it just lasts or does not: said so, not a bare $0.
const poor = plan({ until: 95 }, { accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 2000, rate: 1 }], incomes: [{ id: 'i', name: 'Pay', amount: 500, every: 'month', taxed: false, to: '2027-06' }],
    goals: [{ id: 'g', name: 'Roof', amount: 200000, when: '2030-01' }] });
r = await page.evaluate((p) => { const n = fpNeededToStop(mk(p)); return { spend: n.spend, text: fpLastToText(n, false) }; }, poor);
ok('nothing left: said in words', /To last to 95: neither stopping now nor retiring at .* leaves anything to spend on top of health costs, goals and loans/.test(r.text) && !/\$0/.test(r.text), r.text);

// 5. Words.
const words = (c) => page.evaluate((c) => fpLastToText({ until: 95, spend: c }, false), c);
ok('both figures', /To last to 95: up to \$1,000 a month stopping now, or up to \$5,000 a month retiring at 65, in today’s money, on top of health costs, goals and loans/.test(await words({ now: 1000, plan: 5000, later: true, retireAt: 780 })));
ok('stopping now would not, retiring would', /stopping now leaves nothing to spend; up to \$5,000 a month retiring at 65/.test(await words({ now: null, plan: 5000, later: true, retireAt: 780 })));
ok('a bare $0 reads the same', /stopping now leaves nothing to spend; up to/.test(await words({ now: 0, plan: 5000, later: true, retireAt: 780 })));
ok('already retired with nothing', /To last to 95: stopping now leaves nothing to spend on top/.test(await words({ now: null, plan: null, later: false, retireAt: 780 })));
const already = await words({ now: 3000, plan: null, later: false, retireAt: 780 });
ok('already retired: the one figure', /up to \$3,000 a month stopping now, in today’s money/.test(already) && !/retiring/.test(already), already);

// 6. On the page.
await page.evaluate((p) => { const w = document.querySelector('.fp-widget'), id = fpToolId(w); fpSet(id, mk(p)); setToolMode(id, 'split'); fpRender(w); }, plan());
await page.clock.runFor(1000);
await page.waitForSelector('.fp-projection .fp-last-to:not(.fp-stale)', { timeout: 15000 });
ok('the facts give it', /To last to 95: up to \$[\d,]+ a month stopping now, or up to \$[\d,]+ a month retiring at/.test(await page.innerText('.fp-projection .fp-facts')));
await page.locator('.fp-year-row').nth(3).click();
const detail = await page.innerText('.fp-projection');
ok('a picked year gives stopping then', /With work stopped in [A-Z][a-z]{2} \d{4}, at \d+, you could spend up to \$[\d,]+ a month in today’s money and last to 95/.test(detail));
const pickedT = await page.getAttribute('.fp-yd', 'data-t');
const money = (s) => (s.match(/spend up to (\$[\d,]+)/) || [])[1];
const tip = (t) => page.textContent('.fp-chart .fp-hit[data-t="' + t + '"] title');
const spendLine = await page.innerText('.fp-yd-spend');
ok('it comes first, straight under the heading', await page.evaluate(() => document.querySelector('.fp-yd-head').nextElementSibling.classList.contains('fp-yd-spend')));
ok('What happened gives the same month and age', /To stop working in [A-Z][a-z]{2} \d{4}, at \d+: /.test(detail) && !/at the start of/.test(detail), detail.slice(0, 400));
ok('and not again in What happened', (detail.match(/With work stopped/g) || []).length === 1);
ok('the year’s tooltip gives the same figure', money(await tip(pickedT)) === money(spendLine) && /could spend up to \$[\d,]+ a month to last to 95, currently set at \$5,200 a month\. Click/.test(await tip(pickedT)), await tip(pickedT));
ok('the year’s line sets it beside what is set', /on top of health costs, goals and loans; currently set at \$5,200 a month\.$/.test(spendLine.trim()), spendLine);
ok('the line under the chart too', /To last to 95: .*; currently set at \$5,200 a month/.test(await page.innerText('.fp-projection .fp-last-to')));
ok('and Retirement', /and last to 95 \(currently set at \$5,200\)/.test(await page.innerText('.fp-retire-out')), await page.innerText('.fp-retire-out'));
ok('and it matches stopping then', await page.evaluate((t) => { const n = fpNeededToStop(fpGet(fpToolId(document.querySelector('.fp-widget')))); return fpMoney(n.spendAt(Number(t))); }, pickedT) === money(spendLine));
const tips = await page.locator('.fp-chart .fp-hit').evaluateAll((els) => els.map(e => [e.dataset.t, e.getAttribute('aria-pressed'), e.textContent]));
ok('every year’s tooltip gives it, clicked or not', tips.slice(0, -1).every(x => /could spend up to \$[\d,]+ a month to last to 95|nothing to spend and last to 95/.test(x[2])), tips.length + ' years');
const expected = await page.evaluate(() => { const n = fpNeededToStop(fpGet(fpToolId(document.querySelector('.fp-widget')))); return n.rows.map(r => [String(r.t), fpMoney(n.spendAt(r.t))]); });
ok('each the same as worked out on its own', expected.every(([t, v]) => (tips.find(x => x[0] === t) || [])[2].includes('could spend up to ' + v + ' a month')), expected.length + ' years');

// A change: faded and marked as updating until the new figures are in.
await page.evaluate(() => { const w = document.querySelector('.fp-widget'), id = fpToolId(w), p = fpGet(id); p.accounts[1].balance += 50000; fpSet(id, p); fpRenderDerived(w, p); });
ok('while updating: faded, and the tooltip says so', await page.locator('.fp-yd-spend.fp-stale').count() === 1 && /\(updating\)/.test(await tip(pickedT)));
await page.clock.runFor(1000);
await page.waitForSelector('.fp-yd-spend:not(.fp-stale)', { timeout: 15000 });
ok('then new figures, no longer marked', !/\(updating\)/.test(await tip(pickedT)) && money(await page.innerText('.fp-yd-spend')) !== money(spendLine) && money(await tip(pickedT)) === money(await page.innerText('.fp-yd-spend')));

// Now, and the plan's last year.
await page.locator('.fp-year-row').first().click();
ok('Now reads as stopping now', /^With work stopped now, you could spend up to/.test(await page.innerText('.fp-yd-spend')), await page.innerText('.fp-yd-spend'));
await page.locator('.fp-year-row').last().click();
ok('the plan’s last year has a note, not a figure', /^No spending figure for the plan’s last year\.$/.test((await page.innerText('.fp-yd-spend')).trim()), await page.innerText('.fp-yd-spend'));
const lastT = await page.getAttribute('.fp-yd', 'data-t');
ok('its tooltip too', /no spending figure for the plan’s last year\. Click/.test(await tip(lastT)), await tip(lastT));
const words2 = await page.evaluate(() => { const n = { rows: [{ t: 12 }], until: 95, start: new Date(2026, 10, 1), spendAt: () => null }; return [fpYearSpendText(n, 12, false), fpYearSpendText(n, 12, true)]; });
ok('nothing to spend, in both, and the month is the one after the year’s row ends', /^With work stopped in Nov 2027(, at \d+)?, there would be nothing to spend/.test(words2[0]) && words2[1] === 'nothing to spend and last to 95', words2.join(' | '));
const summary = await page.evaluate(() => fpSummaryText(fpGet(fpToolId(document.querySelector('.fp-widget')))));
ok('the summary has it', /To last to 95: up to \$.*currently set at \$5,200 a month/.test(summary));
const typedNone = await page.evaluate((p) => { const q = mk(p); q.retire.spending = null; return fpNeededToStop(q).spend.set; }, plan());
ok('with no spending typed, it is the plan’s expenses', typedNone === 5000, String(typedNone));
ok('no page errors', errors.length === 0, errors.join(' | '));
console.log(count + ' checks' + (failed ? ', ' + failed + ' FAILED' : ''));
await browser.close();
process.exit(failed ? 1 : 0);
