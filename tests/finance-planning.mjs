// Finance Planning, and the popup it opens calculators in. Accounts, income and
// expenses roll up into net worth today and are worked forward month by month; loan and
// investment accounts, and the plan's income, open in their calculator for a moment and
// bring the figures back. A plan is board data — undone, kept in JSON backups — but not
// carried by share links or HTML exports. The projection is checked against sums done
// here independently.
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
await page.evaluate((i) => setToolMode(i, 'split'), id);
const plan = () => page.evaluate((i) => fpGet(i), id);
const setPlan = (p) => page.evaluate(([i, p]) => { fpSet(i, Object.assign(fpDefaultPlan(), p)); fpRender(document.querySelector('.fp-widget')); }, [id, p]);
const row = (name) => '.fp-widget tr:has(input[data-f="name"][value="' + name + '"])';
const money = (x) => (x < 0 ? '−$' : '$') + Math.abs(Math.round(x)).toLocaleString('en-US');

// 1. Empty, then the example.
ok('a new plan says where to start, and offers a made-up example', /Start by adding/.test(await page.innerText('.fp-empty')));
await page.click('.fp-empty .fp-btn');
await page.waitForTimeout(300);
const cards = await page.evaluate(() => Array.from(document.querySelectorAll('.fp-card')).map(c => c.querySelector('.fp-card-value').textContent));
ok('the rollup: assets, liabilities, net worth', cards.join() === '$498,000,$262,000,$236,000', cards.join());
ok('assets and debts by kind, each with its name and amount', /Cash \$23,000/.test(await page.innerText('.fp-rollup')) && /Property \$350,000/.test(await page.innerText('.fp-rollup')) &&
    /Loan \$262,000/.test(await page.innerText('.fp-rollup')));
// $95k single: $12,070 a year federal, and 7.65% payroll tax ($7,267.50): $1,611 a month.
ok('a month now: income less federal tax from the rules, and payroll tax', /taxes \$1,611/.test(await page.innerText('.fp-month')), await page.innerText('.fp-month'));
ok('the links: ↗ on loans and investments only', await page.evaluate(() => Array.from(document.querySelectorAll('.fp-accounts tbody tr')).map(tr => tr.querySelector('.fp-link') ? 1 : 0).join('')) === '0011011');

// 2. A loan, worked out in the Loan Calculator for a moment.
const before = await page.evaluate(() => ({ tools: customTools.length, custom: JSON.stringify(Object.keys(toolCustomizations).sort()) }));
await page.click(row('Mortgage') + ' .fp-link');
await page.waitForSelector('#toolPopup .calc-widget[data-calc="loan"] .calc-card');
ok('the popup opens the Loan Calculator, filled from the account', await page.evaluate(() => {
    const w = document.querySelector('#toolPopup');
    const v = (s) => w.querySelector(s).value;
    return w.querySelector('.tool-popup-title').textContent === 'Loan Calculator: Mortgage' && v('#loanAmount') === '300000' && v('#loanCurrent') === '250000' &&
        v('#loanRate') === '6.5' && v('#loanYears') === '30' && /Time Left/.test(w.innerText);
}));
ok('it says nothing in it is kept', /nothing here is saved/.test(await page.innerText('#toolPopup .tool-popup-note')));
await page.fill('#toolPopup #loanCurrent', '240000');
await page.fill('#toolPopup #loanExtra', '100');
await page.click('#toolPopup .tool-popup-use');
await page.waitForTimeout(300);
let p = await plan();
let mort = p.accounts.find(a => a.name === 'Mortgage');
const R = 0.065 / 12, PMT = 300000 * R / (1 - Math.pow(1 + R, -360));
ok('Use these figures: every field comes back — balance, rate, amount, term, extra, closing', mort.balance === 240000 && mort.rate === 6.5 &&
    JSON.stringify(mort.loan) === JSON.stringify({ amount: 300000, years: 30, extra: 100, closing: '' }) && !(await page.isVisible('#toolPopup')), JSON.stringify(mort));
ok('and the payment is worked out from them, the extra on top', Math.abs((await page.evaluate((i) => { const p = fpGet(i); return fpMonthlyOf(p, p.accounts.find(a => a.name === 'Mortgage')); }, id)) - (PMT + 100)) < 1e-6 &&
    (await page.innerText(row('Mortgage') + ' .fp-acc-monthly')) === '$' + PMT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' + $100 extra', await page.innerText(row('Mortgage') + ' .fp-acc-monthly'));
const after = await page.evaluate(() => ({ tools: customTools.length, custom: JSON.stringify(Object.keys(toolCustomizations).sort()) }));
ok('and the popup left nothing behind: no tool on the board, nothing saved for it', after.tools === before.tools && after.custom === before.custom, JSON.stringify([before, after]));

// Cancel and Escape change nothing.
await page.click(row('Mortgage') + ' .fp-link');
await page.waitForSelector('#toolPopup');
await page.fill('#toolPopup #loanCurrent', '1');
await page.click('#toolPopup .tool-popup-cancel');
await page.click(row('Car loan') + ' .fp-link');
await page.waitForSelector('#toolPopup');
await page.keyboard.press('Escape');
await page.waitForTimeout(200);
p = await plan();
ok('Cancel, or Escape, and nothing changes', p.accounts.find(a => a.name === 'Mortgage').balance === 240000 && !(await page.isVisible('#toolPopup')),
    JSON.stringify([p.accounts.find(a => a.name === 'Mortgage').balance, await page.isVisible('#toolPopup')]));
ok('the focus goes back to where it was', await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('fp-link')));

// Two copies of a calculator at once: one on the board, one in the popup.
await page.evaluate(() => createNoteWithTemplate('loan-calculator'));
await page.waitForSelector('.tool .calc-widget[data-calc="loan"] .calc-card');
// New tools land where there is room; this one is moved off the planner so both can be reached.
await page.evaluate(() => { const t = document.querySelector('.tool .calc-widget[data-calc="loan"]').closest('.tool'); t.style.left = '1400px'; t.style.top = '0px'; });
await page.click(row('Mortgage') + ' .fp-link');
await page.waitForSelector('#toolPopup .calc-card');
await page.fill('#toolPopup #loanAmount', '123456');
const copies = await page.evaluate(() => {
    const board = document.querySelector('.tool .calc-widget[data-calc="loan"]');
    const pop = document.querySelector('#toolPopup .calc-widget[data-calc="loan"]');
    return { board: board.querySelector('#loanAmount').value, boardFig: board._figures.amount, pop: pop._figures.amount };
});
ok('a copy in the popup and one on the board each keep their own fields', copies.board === '300000' && copies.boardFig === 300000 && copies.pop === 123456, JSON.stringify(copies));
await page.click('#toolPopup .tool-popup-cancel');

// Everything the Loan Calculator takes, in the plan itself.
await page.click(row('Mortgage') + ' .fp-more');
await page.waitForTimeout(150);
const detail = '.fp-widget tr.fp-detail';
ok('▸ opens the loan’s details, the Loan Calculator’s fields with its labels', await page.evaluate((d) => {
    const r = document.querySelector(d);
    const v = (f) => r.querySelector('[data-f="' + f + '"]').value;
    return /Original Amount/.test(r.innerText) && /Loan Term \(Years\)/.test(r.innerText) && /Extra Payment\/mo/.test(r.innerText) && /Closing Date/.test(r.innerText) &&
        v('loan.amount') === '300000' && v('loan.years') === '30' && v('loan.extra') === '100';
}, detail));
ok('and what the Loan Calculator would say: time left, interest left, paid off', /Time left/.test(await page.innerText(detail)) && /Interest left/.test(await page.innerText(detail)) && /Paid off 20\.0%/.test(await page.innerText(detail)),
    await page.innerText(detail));
// The payment, to the cent, against the Loan Calculator's own.
await page.click(row('Mortgage') + ' .fp-link');
await page.waitForSelector('#toolPopup .calc-card');
const calcPay = await page.evaluate(() => document.querySelector('#toolPopup .calc-card .calc-card-value').textContent);
await page.click('#toolPopup .tool-popup-cancel');
ok('the same payment the Loan Calculator shows, to the cent', (await page.innerText(row('Mortgage') + ' .fp-acc-monthly')).startsWith(calcPay + ' '), calcPay);
// A closing date, and a balance left to the schedule.
await page.fill(detail + ' [data-f="loan.closing"]', '2022-11-15');
await page.fill(row('Mortgage') + ' [data-f="balance"]', '');
await page.waitForTimeout(200);
const sched48 = (() => { const g = Math.pow(1 + R, 48); return 300000 * g - PMT * (g - 1) / R; })();
const owedNow = await page.evaluate((i) => { const p = fpGet(i); return fpBalanceOf(p, p.accounts.find(a => a.name === 'Mortgage')); }, id);
ok('a balance left empty, with a closing date: what the schedule says is owed today', Math.abs(owedNow - sched48) < 0.01 &&
    (await page.getAttribute(row('Mortgage') + ' [data-f="balance"]', 'placeholder')) === Math.round(sched48) + ' on schedule', owedNow + ' vs ' + sched48);
ok('and it is what the rollup counts', (await page.innerText('.fp-rollup')).includes('Loan ' + money(sched48 + 12000)), await page.innerText('.fp-rollup'));
await page.fill(row('Mortgage') + ' [data-f="balance"]', String(Math.round(sched48 - 5000)));
await page.waitForTimeout(200);
ok('typed below it: ahead of schedule, as the Loan Calculator says', /Ahead of schedule by \$5,0\d\d/.test(await page.innerText(detail)), await page.innerText(detail));
await page.fill(row('Mortgage') + ' [data-f="balance"]', '240000');
await page.fill(detail + ' [data-f="loan.closing"]', '');
await page.click(row('Mortgage') + ' .fp-more');
await page.waitForTimeout(150);
ok('▾ folds the details away again', (await page.locator(detail).count()) === 0);

// An investment, and the tax.
await page.click(row('Brokerage') + ' .fp-link');
await page.waitForSelector('#toolPopup .calc-widget[data-calc="growth"] .calc-card');
ok('an investment opens the Investment Calculator, filled from the account', await page.evaluate(() =>
    ['#growthInitial', '#growthMonthly', '#growthRate', '#growthYears'].map(s => document.querySelector('#toolPopup ' + s).value).join()) === '40000,300,7,30');
await page.fill('#toolPopup #growthMonthly', '450');
await page.click('#toolPopup input[name="growthCompound"][value="annual"] + span');
await page.click('#toolPopup .tool-popup-use');
await page.waitForTimeout(200);
const brk = (await plan()).accounts.find(a => a.name === 'Brokerage');
ok('and its contribution and compounding come back', brk.monthly === 450 && brk.compounding === 'annual', JSON.stringify(brk));
await page.click(row('Brokerage') + ' .fp-more');
await page.waitForTimeout(150);
ok('its details: compounding, and what it comes to on its own', (await page.inputValue('.fp-widget tr.fp-detail [data-f="compounding"]')) === 'annual' &&
    /In 30 years, on its own/.test(await page.innerText('.fp-widget tr.fp-detail')));
await page.click(row('Brokerage') + ' .fp-more');
await page.click('.fp-tax .fp-link');
await page.waitForSelector('#toolPopup .calc-widget[data-calc="tax"] .calc-card');
ok('the Tax Calculator opens on this year’s taxed income', (await page.inputValue('#toolPopup #taxIncome')) === '95000' && (await page.inputValue('#toolPopup #taxStatus')) === 'single');
await page.selectOption('#toolPopup #taxStatus', 'married');
await page.selectOption('#toolPopup #taxYear', '2026');
await page.click('#toolPopup .tool-popup-use');
await page.waitForTimeout(200);
ok('and the filing status and tax year chosen there come back', (await plan()).tax.status === 'married' && (await plan()).tax.year === '2026' &&
    (await page.inputValue('.fp-tax [data-a="taxYear"]')) === '2026');

// 3. The projection, against sums done here.
await setPlan({
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 10000, rate: 0, monthly: null },
               { id: 'v', name: 'Fund', kind: 'investment', balance: 0, rate: 6, monthly: 500 },
               { id: 'l', name: 'Loan', kind: 'loan', balance: 10000, rate: 12, monthly: 500 }],
    incomes: [{ id: 'i', name: 'Pay', amount: 5000, every: 'month', growth: 0, taxed: false }],
    expenses: [{ id: 'e', name: 'Costs', amount: 3000, every: 'month', growth: 0 }],
    tax: { on: false, status: 'single' },
    assume: { years: 10, inflation: 0, real: false, spread: 0, target: 250000, returns: {} }
});
await page.waitForTimeout(200);
const proj = await page.evaluate((i) => fpProject(fpGet(i), 0), id);
// The loan: 1% a month on what is owed, 500 a month off it, until it is gone.
let owed = 10000, loanMonths = 0, paid = 0;
while (owed > 0.005) { const int = owed * 0.01; const pay = Math.min(500, owed + int); owed += int - pay; paid += pay; loanMonths++; }
const fund = 500 * (Math.pow(1.005, 120) - 1) / 0.005;
const cash = 10000 + (5000 - 3000 - 500) * 120 - paid;
const last = proj.rows[proj.rows.length - 1];
ok('ten years on: the fund, at 6% with 500 a month', Math.abs(last.assets - (fund + cash)) < 1, last.assets + ' vs ' + (fund + cash));
ok('cash: what was left over each month, the loan payments taken out while it lasted', Math.abs(last.cash - cash) < 1, last.cash + ' vs ' + cash);
ok('the loan paid off, in the month the sum says', last.liabilities === 0 && proj.milestones.debtFree === loanMonths, proj.milestones.debtFree + ' vs ' + loanMonths);
const shown = await page.innerText('.fp-projection');
const debtFreeText = new Date(2026, 10 + loanMonths - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
ok('said as a date', shown.includes('Debt-free ' + debtFreeText), shown.slice(0, 200));
ok('and the goal, the month net worth passes it', proj.milestones.target !== null && shown.includes('$250,000 net worth'));
ok('a row a year, and the chart', proj.rows.length === 11 && await page.isVisible('.fp-chart'));
// The scale's labels never sit on one another: a small debt beside large assets puts the
// bottom of the scale just under $0.
await setPlan(Object.assign(await plan(), { accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 250000, rate: 0 }, { id: 'l', name: 'Loan', kind: 'loan', balance: 5000, rate: 5, monthly: 500 }] }));
await page.waitForTimeout(200);
const axis = await page.evaluate(() => Array.from(document.querySelectorAll('.fp-chart > text[text-anchor="end"]')).map(t => ({ text: t.textContent, y: Number(t.getAttribute('y')) })));
ok('a small debt: no two labels of the scale on top of one another, and $0 still said', axis.every((a, i) => axis.every((b, j) => i === j || Math.abs(a.y - b.y) >= 12)) &&
    axis.some(a => a.text === '$0') && !axis.some(a => a.text === '−$5k'), JSON.stringify(axis));
ok('the grid line keeps its place, and the debt its line', (await page.locator('.fp-chart .fp-grid, .fp-chart .fp-zero').count()) === 4 && await page.isVisible('.fp-chart .fp-liab'));
await setPlan(Object.assign(await plan(), { accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'v', name: 'Fund', kind: 'investment', balance: 0, rate: 6, monthly: 500 },
    { id: 'l', name: 'Loan', kind: 'loan', balance: 10000, rate: 12, monthly: 500 }] }));
await page.waitForTimeout(200);

// The years the chart and the year table look at.
const ticks = () => page.evaluate(() => Array.from(document.querySelectorAll('.fp-chart > text[text-anchor="middle"]')).map(t => t.textContent).join());
const tableYears = () => page.evaluate(() => Array.from(document.querySelectorAll('.fp-years tbody tr td:first-child')).map(t => t.textContent).join());
const points = () => page.evaluate(() => document.querySelector('.fp-chart .fp-net').getAttribute('d').split(/[ML]/).filter(s => s.trim()).length);
const kept = () => page.evaluate((i) => toolCustomizations[i].fpChartYears || null, id);
ok('all the years to start: Now to 2036, and nothing to put back', (await page.inputValue('.fp-range-from')) === '2026' && (await page.inputValue('.fp-range-to')) === '2036' &&
    await page.isDisabled('.fp-range-all') && (await points()) === 11 && (await kept()) === null);
await page.selectOption('.fp-range-from', '2030');
await page.waitForTimeout(150);
await page.selectOption('.fp-range-to', '2033');
await page.waitForTimeout(150);
ok('2030 to 2033: the chart draws those four years', (await points()) === 4 && (await ticks()) === '2030,2031,2032,2033', await ticks());
ok('and the year table shows the same, every year', (await tableYears()) === '2030,2031,2032,2033', await tableYears());
const topLabel = await page.evaluate((i) => {
    const rows = fpProject(fpGet(i), 0).rows.slice(4, 8);
    return [document.querySelector('.fp-chart > text[text-anchor="end"]').textContent, fpMoney(Math.max(...rows.map(r => r.assets)), true)];
}, id);
ok('its scale is those years’, not the whole plan’s', topLabel[0] === topLabel[1], topLabel.join(' vs '));
ok('kept with the tool, beside the plan and not in it', JSON.stringify(await kept()) === '{"from":2030,"to":2033}' && !('fpChartYears' in (await plan())) &&
    !(await page.isDisabled('.fp-range-all')));
ok('the picked year keeps the focus', await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('fp-range-to')));
await page.evaluate(() => fpRender(document.querySelector('.fp-widget')));
ok('drawn again: still those years', (await ticks()) === '2030,2031,2032,2033' && (await page.inputValue('.fp-range-from')) === '2030');
await page.selectOption('.fp-range-from', '2035');
await page.waitForTimeout(150);
ok('a from after the to: the two swap', JSON.stringify(await kept()) === '{"from":2033,"to":2035}' && (await ticks()) === '2033,2034,2035', await ticks());
await page.fill('[data-a="years"]', '8');
await page.waitForTimeout(200);
ok('the plan cut short: the range clipped to its end', (await ticks()) === '2033,2034' && (await page.inputValue('.fp-range-to')) === '2034', await ticks());
await page.fill('[data-a="years"]', '10');
await page.waitForTimeout(200);
ok('and back to its length: the range as picked', (await ticks()) === '2033,2034,2035');
await page.click('.fp-range-all');
await page.waitForTimeout(150);
ok('All years: the whole plan again, and nothing kept', (await points()) === 11 && (await kept()) === null && /^Now,/.test(await ticks()));


// Tax, inflation, today's money, the range.
await setPlan({
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'v', name: 'Fund', kind: 'investment', balance: 100000, rate: 6 }],
    incomes: [{ id: 'i', name: 'Pay', amount: 95000, every: 'year', growth: 0, taxed: true }],
    tax: { on: true, status: 'single' },
    assume: { years: 10, inflation: 0, real: false, spread: 2, target: 0, returns: {} }
});
let first = await page.evaluate((i) => fpProject(fpGet(i), 0).first, id);
ok('income tax from the rules: $12,070 a year on $95,000 single', Math.abs(first.estimatedTax - 12070 / 12) < 0.01, String(first.estimatedTax));
ok('and payroll tax: 6.2% and 1.45% of it, below the wage base', Math.abs(first.payrollTax - 95000 * 0.0765 / 12) < 1e-9 && Math.abs(first.tax - (12070 + 95000 * 0.0765) / 12) < 0.01, String(first.payrollTax));
const range = await page.evaluate((i) => { const p = fpGet(i); return [fpProject(p, -2), fpProject(p, 0), fpProject(p, 2)].map(x => x.rows[10].net); }, id);
ok('the range: lower returns below, higher above', range[0] < range[1] && range[1] < range[2] && await page.isVisible('.fp-chart .fp-band'), range.join());
await setPlan(Object.assign(await plan(), { assume: { years: 10, inflation: 3, real: true, spread: 0, target: 0, returns: {} } }));
const realRow = await page.evaluate((i) => { const p = fpGet(i); const r = fpProject(p, 0).rows[10]; p.assume.real = false; return [r.net, fpProject(p, 0).rows[10].net]; }, id);
ok('in today’s money: the same plan divided by ten years of inflation', Math.abs(realRow[0] - realRow[1] / Math.pow(1.03, 10)) < 1, realRow.join());
first = await page.evaluate((i) => fpProject(fpGet(i), 0).first, id);
ok('and the tax brackets move up with inflation, so a year in, the same income pays the same', Math.abs(first.estimatedTax - 12070 / 12) < 0.01);

// Annual compounding, as the Investment Calculator counts it: a year's growth on what
// was there at its start, what went in during the year added at its end.
// (Pay of $100 a month covers what goes in: with nothing to pay for it, the fund would be drawn on.)
await setPlan({ accounts: [{ id: 'v', name: 'Fund', kind: 'investment', balance: 100000, rate: 6, monthly: 100, compounding: 'annual' }],
    incomes: [{ id: 'i', name: 'Pay', amount: 100, every: 'month', growth: 0, taxed: false }], tax: { on: false }, assume: { years: 10, inflation: 0, real: false, spread: 0, target: 0, returns: {} } });
let fv = 100000; for (let y = 0; y < 10; y++) fv = fv * 1.06 + 1200;
let fundEnd = await page.evaluate((i) => fpProject(fpGet(i), 0).rows[10].assets, id);
ok('annual compounding: the Investment Calculator’s sum', Math.abs(fundEnd - fv) < 0.01, fundEnd + ' vs ' + fv);
await setPlan(Object.assign(await plan(), { accounts: [{ id: 'v', name: 'Fund', kind: 'investment', balance: 100000, rate: 6, monthly: 100, compounding: 'monthly' }] }));
let fvm = 100000; for (let i = 0; i < 120; i++) fvm = fvm * 1.005 + 100;
fundEnd = await page.evaluate((i) => fpProject(fpGet(i), 0).rows[10].assets, id);
ok('monthly: its other sum', Math.abs(fundEnd - fvm) < 0.01, fundEnd + ' vs ' + fvm);

// The tax year the plan chooses is the one its tax comes from.
await page.evaluate(() => {
    const t = taxTableLoad();
    t.years['2027'] = JSON.parse(JSON.stringify(t.years['2026']));
    t.years['2027'].single.brackets[0].rate = 20;
    localStorage.setItem('toolboard_taxBrackets', JSON.stringify(t));
});
await setPlan({ incomes: [{ id: 'i', name: 'Pay', amount: 95000, every: 'year', growth: 0, taxed: true }], tax: { on: true, status: 'single', year: '', payroll: false },
    assume: { years: 1, inflation: 0, real: false, spread: 0, target: 0, returns: {} } });
const taxThis = await page.evaluate((i) => fpProject(fpGet(i), 0).first.tax * 12, id);
await page.selectOption('.fp-tax [data-a="taxYear"]', '2027');
await page.waitForTimeout(150);
const taxNext = await page.evaluate((i) => fpProject(fpGet(i), 0).first.tax * 12, id);
ok('the tax year chosen is the one used: this year by default, 2027’s brackets when chosen', Math.abs(taxThis - 12070) < 0.01 && Math.abs(taxNext - (12070 + 12400 * 0.10)) < 0.01, taxThis + ' / ' + taxNext);
await page.evaluate(() => localStorage.removeItem('toolboard_taxBrackets'));

// Deductions and taxes, typed on an income line as a pay stub has them.
await setPlan({
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }],
    incomes: [{ id: 'a', name: 'Job', amount: 6000, every: 'month', growth: 10, deductions: 500, taxes: 1200, taxed: true },
              { id: 'b', name: 'Side work', amount: 24000, every: 'year', growth: 0, deductions: 1200, taxes: null, taxed: true }],
    tax: { on: true, status: 'single', year: '', payroll: false },
    assume: { years: 2, inflation: 0, real: false, spread: 0, target: 0, returns: {} }
});
await page.waitForTimeout(150);
first = await page.evaluate((i) => fpProject(fpGet(i), 0).first, id);
// Side work is estimated on top of the job, whose taxes are typed: tax on $96,000 less tax
// on the job's $72,000 — $12,290 less $7,010, $5,280 a year.
const sideTax = 12290 - 7010;
ok('deductions come out, in each line’s own period', Math.abs(first.deductions - (500 + 100)) < 1e-9, String(first.deductions));
ok('taxes typed are paid as typed, and the rest is estimated in the brackets above that line', Math.abs(first.typedTax - 1200) < 1e-9 && Math.abs(first.estimatedTax - sideTax / 12) < 1e-9 &&
    Math.abs(first.tax - (1200 + sideTax / 12)) < 1e-9, JSON.stringify(first));
ok('take-home: income, less deductions, less taxes', Math.abs(first.takeHome - (8000 - 600 - 1200 - sideTax / 12)) < 1e-9 && /deductions \$600/.test(await page.innerText('.fp-month')) &&
    /take-home \$5,760/.test(await page.innerText('.fp-month')), await page.innerText('.fp-month'));
const year2 = await page.evaluate((i) => { const p = fpGet(i); p.tax.on = false; p.incomes = p.incomes.slice(0, 1); return fpProject(p, 0); }, id);
ok('and they grow with the income: a year on, the job’s 10% raise lifts all three', Math.abs(year2.rows[2].cash - (() => { let c = 0; for (let t = 1; t <= 24; t++) { const g = Math.pow(1.1, (t - 1) / 12); c += (6000 - 500 - 1200) * g; } return c; })()) < 0.01);
ok('a line with typed taxes says “estimate” no more; one without, still does', (await page.getAttribute('tr[data-id="b"] [data-f="taxes"]', 'placeholder')) === 'estimate' &&
    (await page.inputValue('tr[data-id="a"] [data-f="taxes"]')) === '1200');
await page.click('.fp-tax .fp-link');
await page.waitForSelector('#toolPopup #taxIncome');
ok('the Tax Calculator is given every taxed line, monthly ones a year’s worth, typed taxes or not', (await page.inputValue('#toolPopup #taxIncome')) === String(6000 * 12 + 24000),
    await page.inputValue('#toolPopup #taxIncome'));
await page.click('#toolPopup .tool-popup-cancel');
await setPlan(Object.assign(await plan(), { incomes: [{ id: 's1', type: 'section', name: 'Pay', folded: false }].concat((await plan()).incomes) }));
ok('an income section totals gross and take-home, and says when the estimate is still to come', /^\$8,000 \/ mo · take-home \$6,200 \/ mo before estimated tax · \$74,400 \/ yr$/.test(
    await page.evaluate(() => document.querySelector('tr.fp-sec-row .fp-sec-total').textContent)), await page.evaluate(() => document.querySelector('tr.fp-sec-row .fp-sec-total').textContent));

// Escrow, paid with a loan: out of the month, not off the balance, and on after payoff.
await setPlan({
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 },
               { id: 'm', name: 'Mortgage', kind: 'loan', balance: 2000, rate: 6, loan: { amount: 300000, years: 30, extra: 0, closing: '', escrow: 400 } }],
    incomes: [{ id: 'i', name: 'Pay', amount: 5000, every: 'month', growth: 0, taxed: false }],
    tax: { on: false }, assume: { years: 2, inflation: 3, real: false, spread: 0, target: 0, returns: {} }
});
await page.waitForTimeout(150);
const esc = await page.evaluate((i) => { const p = fpGet(i); const pr = fpProject(p, 0); const flat = JSON.parse(JSON.stringify(p)); flat.accounts[1].loan.escrow = 0;
    const pf = fpProject(flat, 0); return { first: pr.first, debtFree: pr.milestones.debtFree, debtFreeFlat: pf.milestones.debtFree, cash: pr.rows[2].cash, cashFlat: pf.rows[2].cash }; }, id);
let escPaid = 0; for (let t = 1; t <= 24; t++) escPaid += 400 * Math.pow(1.03, (t - 1) / 12);
ok('escrow comes out of the month on its own line', esc.first.escrow === 400 && /− escrow \$400/.test(await page.innerText('.fp-month')), JSON.stringify(esc.first));
ok('it does not pay the loan down: the payoff month is the same with it or without', esc.debtFree === esc.debtFreeFlat && esc.debtFree === 2, esc.debtFree + ' vs ' + esc.debtFreeFlat);
ok('and it goes on after payoff, rising with inflation', Math.abs((esc.cashFlat - esc.cash) - escPaid) < 0.01, (esc.cashFlat - esc.cash) + ' vs ' + escPaid);
ok('the payment shown carries it', /\+ \$400 escrow/.test(await page.innerText('tr[data-id="m"] .fp-acc-monthly')), await page.innerText('tr[data-id="m"] .fp-acc-monthly'));
await page.click('tr[data-id="m"] .fp-link');
await page.waitForSelector('#toolPopup .calc-card');
await page.click('#toolPopup .tool-popup-use');
await page.waitForTimeout(200);
ok('a trip through the Loan Calculator, which has no escrow, keeps it', (await plan()).accounts.find(a => a.id === 'm').loan.escrow === 400);

// A 401(k) from pay: part of the deductions saved into an account, with the employer's
// match — out of take-home as on the pay stub, and in the account, not spent.
await setPlan({
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'k', name: '401(k)', kind: 'retirement', balance: 0, rate: 6, monthly: null }],
    incomes: [{ id: 'j', name: 'Job', amount: 8000, every: 'month', growth: 0, deductions: 1000, taxes: 1500, taxed: true, intoAccount: 'k', intoAmount: 600, match: 300 }],
    expenses: [{ id: 'e', name: 'Costs', amount: 3000, every: 'month', growth: 0 }],
    tax: { on: false }, assume: { years: 1, inflation: 0, real: false, spread: 0, target: 0, returns: {} }
});
await page.waitForTimeout(150);
let pay = await page.evaluate((i) => { const r = fpProject(fpGet(i), 0); return { first: r.first, cash: r.rows[1].cash, assets: r.rows[1].assets }; }, id);
const k12 = 900 * (Math.pow(1.005, 12) - 1) / 0.005;
ok('take-home is still the pay stub’s: the whole deduction comes out', Math.abs(pay.first.takeHome - 5500) < 1e-9 && Math.abs(pay.first.surplus - 2500) < 1e-9, JSON.stringify(pay.first));
ok('cash gets what is left over, and nothing is counted twice', Math.abs(pay.cash - 2500 * 12) < 0.01, String(pay.cash));
ok('the 401(k) gets the $600 and the employer’s $300 every month, and grows', Math.abs(pay.assets - (2500 * 12 + k12)) < 0.01, pay.assets + ' vs ' + (2500 * 12 + k12));
ok('a month now says it went into the account, saved and not spent', /From pay, into accounts: \$900 into 401\(k\) \(\$600 yours, \$300 employer\)/.test(await page.innerText('.fp-month')),
    await page.innerText('.fp-month'));
await page.click('tr[data-id="j"] .fp-more');
await page.waitForTimeout(150);
const incDetail = 'tr.fp-income-detail[data-id="j"]';
ok('▸ on an income line: which part of its deductions goes where, and the match — a plan from before read as one row', (await page.inputValue(incDetail + ' [data-f="into.amount"]')) === '600' &&
    (await page.inputValue(incDetail + ' [data-f="into.account"]')) === 'k' && (await page.inputValue(incDetail + ' [data-f="into.match"]')) === '300' &&
    /Into 401\(k\): \$900 a month/.test(await page.innerText(incDetail)));
ok('the account’s section total counts it as going in', await page.evaluate((i) => { const p = fpGet(i); return fpSectionTotal(p, 'accounts', fpEntries(p.accounts)).monthlyIn; }, id) === 900);
await page.fill('tr[data-id="k"] [data-f="monthly"]', '600');
await page.waitForTimeout(150);
ok('the same account with money of its own too: a warning it may be counted twice', /counted twice/.test(await page.innerText(incDetail)));
await page.fill('tr[data-id="k"] [data-f="monthly"]', '');
await page.fill(incDetail + ' [data-f="into.amount"]', '1200');
await page.waitForTimeout(150);
pay = await page.evaluate((i) => fpProject(fpGet(i), 0).first, id);
ok('more into the account than the deductions typed: the deductions are at least that', Math.abs(pay.deductions - 1200) < 1e-9 && /more than the deductions typed/.test(await page.innerText(incDetail)));
await page.click('tr[data-id="k"] .fp-x');
await page.waitForTimeout(150);
pay = await page.evaluate((i) => ({ first: fpProject(fpGet(i), 0).first, line: fpGet(i).incomes[0] }), id);
ok('the account removed: the line forgets it, and the deductions are simply spent', pay.line.into[0].account === '' && pay.line.intoAccount === undefined && pay.first.payrollOwn === 0 && Math.abs(pay.first.takeHome - (8000 - 1000 - 1500)) < 1e-9, JSON.stringify(pay));

// Social Security, as the SSA works it out.
const fra = await page.evaluate(() => [1937, 1938, 1943, 1954, 1955, 1957, 1959, 1960, 1990].map(fpFullRetirementMonths));
ok('full retirement age by birth year: 65, 65+2m, 66 for 1943–54, 66+2m…66+10m, 67 from 1960', fra.join() === [780, 782, 792, 792, 794, 798, 802, 804, 804].join(), fra.join());
const factors = await page.evaluate(() => [[804, 744], [804, 840], [804, 774], [804, 804], [798, 744], [804, 900], [804, 700]].map(([f, c]) => Math.round(fpClaimFactor(f, c) * 10000) / 10000));
ok('claiming: 62 is 70% and 70 is 124% from 1960; 2½ years early 83.33%; 1957 at 62 is 72.5%; nothing past 70 or before 62', factors.join() === '0.7,1.24,0.8333,1,0.725,1.24,0.7', factors.join());

await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }], tax: { on: false }, assume: { years: 31, inflation: 2, real: false, spread: 0, target: 0, returns: {} } });
await page.click('.fp-section[data-sec="income"] .fp-head-acts .fp-btn:has-text("+ Social Security")');
await page.waitForTimeout(150);
ok('+ Social Security: a line, its details open on the birth month', await page.evaluate(() => document.activeElement && document.activeElement.dataset.f === 'birth') &&
    /Your birth month, and the benefit at full retirement age .* or, left empty, an estimate from pay/.test(await page.innerText('tr.fp-income-detail')));
await page.fill('tr.fp-income-detail [data-f="birth"]', '1990-03');
await page.fill('tr.fp-income-detail [data-f="fraBenefit"]', '2400');
await page.waitForTimeout(150);
const ssText = await page.innerText('tr.fp-income-detail');
ok('worked out: full retirement age 67, all of it at 67, from March 2057, and what that is then', /Full retirement age 67/.test(ssText) && /100% of the benefit/.test(ssText) &&
    ssText.includes('Starts Mar 2057, at 67, with $2,400.00 a month in today’s dollars, about ' + money(2400 * Math.pow(1.02, 31 + (2 - 10) / 12)) + ' then'), ssText.replace(/\n/g, ' | '));
ok('the line shows the amount and the month it starts', (await page.innerText('.fp-ss-amount')) === '$2,400.00' && (await page.innerText('.fp-ss-start')) === '2057-03');
ok('and Ahead says when', /Social Security starts Mar 2057/.test(await page.innerText('.fp-projection')));
await page.fill('tr.fp-income-detail [data-f="claimYears"]', '62');
await page.waitForTimeout(150);
ok('claimed at 62 instead: 70%, from March 2052', /70% of the benefit, for claiming early/.test(await page.innerText('tr.fp-income-detail')) && (await page.innerText('.fp-ss-start')) === '2052-03' &&
    (await page.innerText('.fp-ss-amount')) === '$1,680.00');
await page.fill('tr.fp-income-detail [data-f="claimYears"]', '67');
await page.waitForTimeout(150);
const ssCash = await page.evaluate((i) => fpProject(fpGet(i), 0).rows[31].cash, id);
let ssExpect = 0;
for (let t = 1; t <= 372; t++) { const d = new Date(2026, 10 + t - 1, 1); if (d >= new Date(2057, 2, 1)) ssExpect += 2400 * Math.pow(1.02, (t - 1) / 12); }
ok('paid from the start month, rising by the cost of living each year', Math.abs(ssCash - ssExpect) < 0.01, ssCash + ' vs ' + ssExpect);
await setPlan({ incomes: [{ id: 'ss', type: 'ss', name: 'SS', birth: '1955-06', fraBenefit: 3000, claimYears: 66, claimMonths: 2, every: 'month', growth: 0, taxed: true },
                          { id: 'w', name: 'Part-time', amount: 2000, every: 'month', growth: 0, taxed: true }],
    tax: { on: true, status: 'single', year: '', payroll: false }, assume: { years: 1, inflation: 0, real: false, spread: 0, target: 0, returns: {} } });
// The IRS worksheet, by hand: $36,000 of benefits and $24,000 of pay. Half the benefits
// plus the pay is $42,000, past the $34,000 line: 85% of the $8,000 above it ($6,800),
// plus half the $9,000 between the lines ($4,500) — $11,300 taxable. $35,300 in all,
// less the $16,100 deduction, is $19,200: $1,240 at 10% and $816 at 12%.
const ssTax = await page.evaluate((i) => fpProject(fpGet(i), 0).first.estimatedTax * 12, id);
ok('the taxed part of a benefit, by the IRS worksheet: $11,300 of $36,000 here', Math.abs(ssTax - 2056) < 1e-6, String(ssTax));
await page.click('.fp-tax .fp-link');
await page.waitForSelector('#toolPopup #taxIncome');
ok('and the Tax Calculator is given the same', (await page.inputValue('#toolPopup #taxIncome')) === String(24000 + 11300), await page.inputValue('#toolPopup #taxIncome'));
await page.click('#toolPopup .tool-popup-cancel');

// Retirement: pay stops, savings are drawn on. Inflation and returns at nought here, so
// every figure can be worked out by hand.
const R0 = { years: 30, inflation: 0, real: false, spread: 0, target: 0, returns: { cash: 0, investment: 0, retirement: 0, other: 0, property: 0, loan: 0, credit: 0 } };
const rproj = (shift) => page.evaluate(([i, s]) => fpProject(fpGet(i), s || 0), [id, shift]);
await setPlan({
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'v', name: 'Fund', kind: 'investment', balance: 100000, rate: 0, monthly: 100 }],
    incomes: [{ id: 'job', name: 'Job', amount: 5000, every: 'month', growth: 0, taxed: false },
              { id: 'ss', type: 'ss', name: 'SS', birth: '1970-11', fraBenefit: 2000, claimYears: 62, claimMonths: 0, growth: 0, taxed: false }],
    expenses: [{ id: 'e', name: 'Costs', amount: 3000, every: 'month', growth: 0 }],
    tax: { on: false }, assume: R0,
    retire: { on: true, birth: '', ageYears: 60, ageMonths: 0, until: 70, spending: 3000, buffer: 0 }
});
await page.waitForTimeout(200);
let rp = await rproj();
ok('the plan runs to the age it is to last to, taking the birth month from Social Security', rp.rows.length - 1 === 14 && rp.rows[0].age === 56 && rp.rows[14].age === 69, rp.rows.length + ' ' + rp.rows[0].age + ' ' + rp.rows[14].age);
ok('retiring at 60: November 2030', rp.milestones.retire === 49);
ok('working: $1,900 left over a month, the fund getting its $100', Math.abs(rp.rows[4].assets - (91200 + 104800)) < 0.01, String(rp.rows[4].assets));
ok('retired: pay and contributions stop, spending comes out of cash', Math.abs(rp.rows[6].assets - (91200 - 72000 + 104800)) < 0.01, String(rp.rows[6].assets));
ok('Social Security starts at 62 (70% of $2,000) and carries on', Math.abs(rp.rows[7].assets - 104800) < 0.01 && Math.abs(rp.rows[7].cash) < 0.01, rp.rows[7].assets + ' / ' + rp.rows[7].cash);
ok('then the fund is drawn on, $1,600 a month, until it runs out in April 2039, at 68', rp.milestones.runsOut === 150 &&
    /It runs out at 68 \(Apr 2039\)/.test(await page.innerText('.fp-retire-out')), rp.milestones.runsOut + ' ' + await page.innerText('.fp-retire-out'));
ok('the years show the age, and what was drawn', /Withdrawn/.test(await page.innerText('.fp-years')) && Math.abs(rp.rows[9].withdrawn - 1600 * 12) < 0.01, String(rp.rows[9].withdrawn));
await setPlan(Object.assign(await plan(), { retire: Object.assign((await plan()).retire, { buffer: 6 }) }));
rp = await rproj();
ok('a buffer of six months stays in cash; the fund is drawn on to keep it', Math.abs(rp.rows[7].cash - 18000) < 0.01 && Math.abs(rp.rows[7].assets - 104800) < 0.01, rp.rows[7].cash + ' / ' + rp.rows[7].assets);

// Pre-tax money is taxed as it is drawn: enough more is drawn to pay it.
const taxOf = (annual) => { const t = Math.max(0, annual - 16100); const B = [[0, 12400, .10], [12400, 50400, .12], [50400, 105700, .22], [105700, 201775, .24], [201775, 256225, .32], [256225, 640800, .35], [640800, Infinity, .37]];
    return B.reduce((s, [lo, hi, r]) => s + (t > lo ? (Math.min(t, hi) - lo) * r : 0), 0); };
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'p', name: 'IRA', kind: 'retirement', balance: 500000, rate: 0, tax: 'pretax' }],
    tax: { on: true, status: 'single', year: '' }, assume: R0, retire: { on: true, birth: '1960-01', ageYears: 66, ageMonths: 0, until: 70, spending: 5000, buffer: 0 } });
rp = await rproj();
const G = rp.rows[1].withdrawn / 12;
ok('pre-tax: drawn, less its federal tax, comes to the $5,000 spent', Math.abs(G - taxOf(G * 12) / 12 - 5000) < 0.05 && Math.abs(rp.rows[1].withdrawTax - taxOf(G * 12)) < 0.6, G + ' ' + rp.rows[1].withdrawTax);
await setPlan(Object.assign(await plan(), { accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'p', name: 'Roth IRA', kind: 'retirement', balance: 500000, rate: 0, tax: 'roth' }] }));
rp = await rproj();
ok('Roth: drawn as it is, untaxed', Math.abs(rp.rows[1].withdrawn - 60000) < 0.01 && rp.rows[1].withdrawTax === 0);

// The minimum a pre-tax account pays out.
ok('minimum withdrawals start at 73, or 75 from those born in 1960; the IRS table', await page.evaluate(() => [fpRmdAge(1959), fpRmdAge(1960), fpRmdFactor(73), fpRmdFactor(75), fpRmdFactor(90), fpRmdFactor(130)].join()) === '73,75,26.5,24.6,12.2,2');
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'p', name: 'IRA', kind: 'retirement', balance: 400000, rate: 0, tax: 'pretax' }],
    tax: { on: false }, assume: R0, retire: { on: true, birth: '1951-06', ageYears: 65, ageMonths: 0, until: 80, spending: 0, buffer: 0 } });
rp = await rproj();
const r75 = 400000 / 24.6 / 12, jan = 400000 - 2 * r75, r76 = jan / 23.7 / 12;
ok('born 1951: paid out from the start — at 75 this year, a twelfth of 1/24.6; from January, of 1/23.7 of what is there then', rp.milestones.rmd === 1 &&
    Math.abs(rp.rows[1].withdrawn - (2 * r75 + 10 * r76)) < 0.01 && Math.abs(rp.rows[1].cash - rp.rows[1].withdrawn) < 0.01, rp.rows[1].withdrawn + ' vs ' + (2 * r75 + 10 * r76));

// Drawn before 59½: said — from an IRA. (A 401(k) left at 55, below, is not.)
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'p', name: 'IRA', kind: 'retirement', balance: 300000, rate: 0, planType: 'ira' }],
    tax: { on: false }, assume: R0, retire: { on: true, birth: '1975-01', ageYears: 55, ageMonths: 0, until: 70, spending: 1000, buffer: 0 } });
await page.waitForTimeout(150);
ok('pre-tax money drawn at 55: a 10% penalty, charged', /drawn from Jan 2030, at 55, before 59½: a 10% penalty, \$\d/.test(await page.innerText('.fp-retire-out')), await page.innerText('.fp-retire-out'));

// The order money is drawn in, and changing it.
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'r', name: 'Roth', kind: 'retirement', balance: 10000, rate: 0, tax: 'roth' },
        { id: 'i', name: 'Brokerage', kind: 'investment', balance: 10000, rate: 0 }, { id: 'h', name: 'Home', kind: 'property', balance: 300000, rate: 0 }],
    tax: { on: false }, assume: R0, retire: { on: true, birth: '1960-11', ageYears: 66, ageMonths: 0, until: 70, spending: 1000, buffer: 0 } });
await page.waitForTimeout(150);
const drawn = () => page.evaluate(() => Array.from(document.querySelectorAll('.fp-draw tr')).map(t => t.innerText.replace('☰', '').replace(/\s+/g, ' ').trim()).join(' | '));
ok('the usual order: cash, investments, then Roth — property never', (await drawn()) === '1. Cash Cash | 2. Brokerage Investment | 3. Roth Roth 401(k)', await drawn());
const after12 = async () => { const r = await rproj(); return r.rows[1].assets - 300000; };
ok('a year at $1,000: the brokerage spent, $2,000 taken from the Roth', Math.abs((await after12()) - 8000) < 0.01 &&
    await page.evaluate((i) => { const p = fpGet(i); const r = fpProject(p, 0); return true; }, id));
await page.focus('.fp-draw tr[data-id="r"] .fp-grip');
await page.keyboard.press('ArrowUp');
await page.waitForTimeout(150);
ok('↑ on a row moves it up the order, kept with the plan', (await drawn()).startsWith('1. Cash Cash | 2. Roth') && (await plan()).drawOrder.map(x => x.id).join() === 'c,r,i');

// The most that could be spent.
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'r', name: 'Roth', kind: 'retirement', balance: 120000, rate: 0, tax: 'roth' }],
    tax: { on: false }, assume: R0, retire: { on: true, birth: '1960-11', ageYears: 66, ageMonths: 0, until: 76, spending: 500, buffer: 0 } });
const best = await page.evaluate((i) => fpRetireMax(fpGet(i), 0), id);
ok('the most a month that lasts: $120,000 over ten years is $1,000', best >= 990 && best <= 1000, String(best));
await page.waitForTimeout(500);
ok('and the plan says it', /You could spend up to \$(990|1,000) a month in retirement/.test(await page.innerText('.fp-retire-out')), await page.innerText('.fp-retire-out'));
const summary = await page.evaluate((i) => fpSummaryText(fpGet(i)), id);
ok('Copy summary has a Retirement part', /### Retirement/.test(summary) && /The money lasts to 76/.test(summary) && /Drawn on in this order: Cash, Roth \(Roth 401\(k\)\)/.test(summary), summary.slice(summary.indexOf('### Retirement')));
ok('and the model reads the same', /\nRetirement:\n- Retire Nov 2026 at 66/.test(await page.evaluate((i) => fpAITarget(i).text, id)));

// Running short.
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 3000, rate: 0 }], incomes: [{ id: 'i', name: 'Pay', amount: 2000, every: 'month', growth: 0, taxed: false }],
    expenses: [{ id: 'e', name: 'Rent', amount: 2500, every: 'month', growth: 0 }], tax: { on: false }, assume: { years: 5, inflation: 0, real: false, spread: 0, target: 0, returns: {} } });
ok('spending more than comes in: short each month, and when cash runs out', /short \$500/.test(await page.innerText('.fp-month')) &&
    /Cash runs out May 2027/.test(await page.innerText('.fp-projection')), await page.innerText('.fp-projection').then(t => t.slice(0, 120)));

// 4. Typing, undo, copying.
await page.click('.fp-section-head button:has-text("+ Account")');
await page.waitForTimeout(100);
await page.keyboard.type('Rainy day');
await page.fill('.fp-accounts tbody tr:last-child [data-f="balance"]', '5000');
await page.waitForTimeout(200);
ok('a new account, typed in: the rollup follows as it is typed', /\$8,000/.test(await page.innerText('.fp-rollup')) && (await plan()).accounts.length === 2);
await page.waitForTimeout(700);
await page.evaluate(() => undoLast());
await page.waitForTimeout(500);
ok('undone like any edit', (await plan()).accounts.length === 1 || (await plan()).accounts[1].balance === null);
await page.click('.fp-section[data-sec="ahead"] .fp-head-acts .fp-btn');
await page.waitForTimeout(200);
const copied = await page.evaluate(() => navigator.clipboard.readText());
ok('Copy summary: the rollup and the years, as Markdown', /^## Finance plan/.test(copied) && /\| \*\*Net worth\*\* \|/.test(copied) && /an estimate, not advice/.test(copied));

// 4b. Every section folds to its heading, for looking at it with someone else there.
await page.click('.fp-empty .fp-btn').catch(() => {});
await page.evaluate((i) => { fpSet(i, fpDefaultPlan()); fpRender(document.querySelector('.fp-widget')); }, id);
await page.click('.fp-empty .fp-btn');
await page.waitForTimeout(300);
const secs = () => page.evaluate(() => Array.from(document.querySelectorAll('.fp-section[data-sec]')).map(s => s.dataset.sec + (s.classList.contains('fp-folded') ? '-' : '+')).join());
ok('ten sections, each with a fold at its heading, all open to begin with', (await secs()) === 'accounts+,income+,expenses+,goals+,retirement+,advice+,assumptions+,summary+,month+,ahead+' &&
    (await page.locator('.fp-section .fp-fold').count()) === 10, await secs());
await page.fill(row('Savings') + ' [data-f="balance"]', '15500');
await page.click('.fp-section[data-sec="summary"] .fp-fold');
await page.waitForTimeout(150);
ok('the summary folded: net worth out of sight, the heading left', !(await page.isVisible('.fp-rollup')) && (await page.isVisible('.fp-section[data-sec="summary"] h4')) &&
    (await page.getAttribute('.fp-section[data-sec="summary"] .fp-fold', 'aria-expanded')) === 'false');
ok('folding redraws nothing: what was being typed is still there', (await page.inputValue(row('Savings') + ' [data-f="balance"]')) === '15500');
ok('kept with the tool, beside the plan and not in it', await page.evaluate((i) => JSON.stringify(toolCustomizations[i].fpFolded) === '["summary"]' &&
    !('fpFolded' in toolCustomizations[i].financePlan), id));
await page.click('.fp-fold-all');
await page.waitForTimeout(150);
ok('Hide all: every section to its heading, and the button offers them back', (await secs()) === 'accounts-,income-,expenses-,goals-,retirement-,advice-,assumptions-,summary-,month-,ahead-' &&
    (await page.innerText('.fp-fold-all')) === 'Show all' && !(await page.isVisible('.fp-chart')) && !(await page.isVisible(row('Savings'))));
await page.waitForTimeout(700);
await page.reload();
await page.waitForSelector('.fp-widget .fp-section', { timeout: 25000 });
await page.waitForTimeout(300);
ok('a reload keeps them folded', (await secs()) === 'accounts-,income-,expenses-,goals-,retirement-,advice-,assumptions-,summary-,month-,ahead-');
await page.click('.fp-fold-all');
await page.waitForTimeout(150);
ok('Show all: everything back', (await secs()) === 'accounts+,income+,expenses+,goals+,retirement+,advice+,assumptions+,summary+,month+,ahead+' && (await page.innerText('.fp-fold-all')) === 'Hide all');
await page.click('.fp-section[data-sec="income"] .fp-fold');
await page.selectOption(row('Car loan') + ' [data-f="kind"]', 'credit');
await page.waitForTimeout(200);
ok('a redraw keeps a folded section folded', (await secs()).includes('income-'));
await page.click('.fp-section[data-sec="income"] .fp-fold');

// 4c. Accounts in the order the person wants.
const order = () => page.evaluate((i) => fpGet(i).accounts.map(a => a.name).join(','), id);
const shownOrder = () => page.evaluate(() => Array.from(document.querySelectorAll('.fp-accounts tr.fp-acc [data-f="name"]')).map(i => i.value).join(','));
ok('to begin with, the order they were added in', (await order()) === 'Checking,Savings,Brokerage,401(k),Home,Mortgage,Car loan');
await page.focus(row('Home') + ' .fp-grip');
await page.keyboard.press('ArrowUp');
await page.keyboard.press('ArrowUp');
await page.waitForTimeout(150);
ok('↑ on the grip moves an account up, a place at a time, and keeps the grip focused', (await order()) === 'Checking,Savings,Home,Brokerage,401(k),Mortgage,Car loan' &&
    (await shownOrder()) === (await order()) && await page.evaluate(() => document.activeElement.classList.contains('fp-grip') &&
        document.activeElement.closest('tr').querySelector('[data-f="name"]').value === 'Home'), await order());
await page.focus(row('Checking') + ' .fp-grip');
await page.keyboard.press('ArrowUp');
await page.waitForTimeout(100);
ok('the first goes no higher', (await order()).startsWith('Checking,'));
await page.keyboard.press('ArrowDown');
await page.waitForTimeout(150);
ok('↓ moves it down; and the first cash account — where what is left over goes by default — is now Savings', (await order()).startsWith('Savings,Checking,') &&
    await page.evaluate((i) => { const p = fpGet(i); p.surplusTo = ''; return p.accounts.find(a => a.id === fpSurplusAccount(p)).name; }, id) === 'Savings');
const box = async (sel) => (await page.locator(sel).boundingBox());
const target = await box(row('Savings'));
await page.locator(row('Car loan') + ' .fp-grip').dragTo(page.locator(row('Savings')), { targetPosition: { x: 40, y: 4 } });
await page.waitForTimeout(200);
ok('dragged by its grip onto the top half of a row: it goes above it', (await order()) === 'Car loan,Savings,Checking,Home,Brokerage,401(k),Mortgage', (await order()) + ' ' + JSON.stringify(target));
await page.locator(row('Car loan') + ' .fp-grip').dragTo(page.locator(row('Mortgage')), { targetPosition: { x: 40, y: 24 } });
await page.waitForTimeout(200);
ok('onto the bottom half: below it', (await order()).endsWith('Mortgage,Car loan'), await order());
await page.waitForTimeout(700);
await page.evaluate(() => undoLast());
await page.waitForTimeout(500);
ok('a move is undone like any edit', (await order()) === 'Car loan,Savings,Checking,Home,Brokerage,401(k),Mortgage', await order());

// Incomes and expenses, the same way — each within its own list.
const listOrder = (list) => page.evaluate(([i, l]) => fpGet(i)[l].map(a => a.name).join(','), [id, list]);
await page.focus(row('Insurance and property tax') + ' .fp-grip');
await page.keyboard.press('ArrowUp');
await page.waitForTimeout(150);
ok('an expense moves up with ↑ on its grip', (await listOrder('expenses')) === 'Insurance and property tax,Living costs' &&
    await page.evaluate(() => document.activeElement.classList.contains('fp-grip')), await listOrder('expenses'));
await page.click('.fp-section[data-sec="income"] .fp-head-acts .fp-btn:has-text("+ Income")');
await page.keyboard.type('Bonus');
await page.waitForTimeout(150);
await page.locator('.fp-section[data-sec="income"] tbody tr:last-child .fp-grip').dragTo(page.locator(row('Salary')), { targetPosition: { x: 40, y: 4 } });
await page.waitForTimeout(200);
ok('an income dragged above another', (await listOrder('incomes')) === 'Bonus,Salary', await listOrder('incomes'));
const acctsBefore = await order();
await page.locator(row('Living costs') + ' .fp-grip').dragTo(page.locator(row('Savings')), { targetPosition: { x: 40, y: 4 } });
await page.waitForTimeout(200);
ok('a row cannot be dropped into another list', (await order()) === acctsBefore && (await listOrder('expenses')) === 'Insurance and property tax,Living costs');

// 4d. Sections: headings in a list that group what follows them, with its totals.
const S = (id, name) => ({ id: id, type: 'section', name: name, folded: false });
const sectioned = {
    accounts: [{ id: 'chk', name: 'Checking', kind: 'cash', balance: 8000, rate: 0 }, { id: 'sav', name: 'Savings', kind: 'cash', balance: 15000, rate: 4, monthly: 200 },
        S('s-home', 'Home stuff'), { id: 'house', name: 'House', kind: 'property', balance: 350000 },
        { id: 'mort', name: 'Mortgage', kind: 'loan', balance: 250000, rate: 6.5, loan: { amount: 300000, years: 30, extra: 0, closing: '' } },
        S('s-inv', 'Investing'), { id: 'brk', name: 'Brokerage', kind: 'investment', balance: 40000, rate: 7, monthly: 300 }],
    incomes: [{ id: 'sal', name: 'Salary', amount: 95000, every: 'year', growth: 3, taxed: true }],
    expenses: [S('s-housing', 'Housing'), { id: 'ins', name: 'Insurance', amount: 6000, every: 'year' }, { id: 'util', name: 'Utilities', amount: 300, every: 'month' },
        S('s-food', 'Food'), { id: 'groc', name: 'Groceries', amount: 800, every: 'month' }],
    tax: { on: true, status: 'single', year: '' },
    assume: { years: 20, inflation: 2.5, real: true, spread: 0, target: 0, returns: {} }
};
await setPlan(JSON.parse(JSON.stringify(sectioned)));
const total = (name) => page.evaluate((n) => { const r = Array.from(document.querySelectorAll('tr.fp-sec-row')).find(t => t.querySelector('.fp-sec-name').value === n); return r ? r.querySelector('.fp-sec-total').textContent : null; }, name);
ok('a section of accounts totals what is held and owed, netted, and what is paid a month', (await total('Home stuff')) === 'Held $350,000 · Owed $250,000 · Net $100,000 · $1,896/mo paid', await total('Home stuff'));
ok('one of investments: held, and put in a month', (await total('Investing')) === 'Held $40,000 · $300/mo in', await total('Investing'));
ok('expenses: a month and a year', (await total('Housing')) === '$800 / mo · $9,600 / yr' && (await total('Food')) === '$800 / mo · $9,600 / yr', (await total('Housing')) + ' | ' + (await total('Food')));
const sums = await page.evaluate((i) => { const p = fpGet(i); const flat = JSON.parse(JSON.stringify(p)); ['accounts', 'incomes', 'expenses'].forEach(l => { flat[l] = flat[l].filter(x => x.type !== 'section'); });
    const a = fpProject(p, 0), b = fpProject(flat, 0); return [fpRollup(p).net, fpRollup(flat).net, a.rows[20].net, b.rows[20].net, a.first.surplus, b.first.surplus]; }, id);
ok('sections group and total, and change none of the sums', sums[0] === sums[1] && Math.abs(sums[2] - sums[3]) < 1e-6 && Math.abs(sums[4] - sums[5]) < 1e-6, sums.join());
const lst = (l) => page.evaluate(([i, l]) => fpGet(i)[l].map(x => (x.type === 'section' ? '#' : '') + x.name).join(','), [id, l]);
ok('entries above the first heading belong to none, and draw as before', (await lst('accounts')) === 'Checking,Savings,#Home stuff,House,Mortgage,#Investing,Brokerage');

await page.click('.fp-section[data-sec="accounts"] .fp-head-acts .fp-btn:has-text("+ Section")');
await page.keyboard.type('Rainy');
await page.waitForTimeout(200);
ok('+ Section: a heading at the end, its name being typed', (await lst('accounts')).endsWith(',#Rainy') && (await total('Rainy')) === 'Nothing in it yet');

await page.focus('tr[data-id="chk"] .fp-grip');
await page.keyboard.press('ArrowDown');
await page.keyboard.press('ArrowDown');
await page.waitForTimeout(150);
ok('↓ takes an entry past a heading, into that section', (await lst('accounts')) === 'Savings,#Home stuff,Checking,House,Mortgage,#Investing,Brokerage,#Rainy' &&
    (await total('Home stuff')).startsWith('Held $358,000'), (await lst('accounts')) + ' | ' + (await total('Home stuff')));
await page.focus('tr[data-id="s-inv"] .fp-grip');
await page.keyboard.press('ArrowUp');
await page.waitForTimeout(150);
ok('↑ on a heading moves the whole section past the one above', (await lst('accounts')) === 'Savings,#Investing,Brokerage,#Home stuff,Checking,House,Mortgage,#Rainy', await lst('accounts'));
await page.locator('tr[data-id="s-home"] .fp-grip').dragTo(page.locator('tr[data-id="sav"]'), { targetPosition: { x: 40, y: 4 } });
await page.waitForTimeout(200);
ok('a section dragged among the unsectioned goes to the first place a section can, taking nothing in', (await lst('accounts')) === 'Savings,#Home stuff,Checking,House,Mortgage,#Investing,Brokerage,#Rainy', await lst('accounts'));
await page.locator('tr[data-id="sav"] .fp-grip').dragTo(page.locator('tr[data-id="s-inv"]'), { targetPosition: { x: 40, y: 24 } });
await page.waitForTimeout(200);
ok('an entry dropped on the lower half of a heading: first in that section', (await lst('accounts')) === '#Home stuff,Checking,House,Mortgage,#Investing,Savings,Brokerage,#Rainy', await lst('accounts'));

await page.click('tr[data-id="s-home"] .fp-sec-fold');
await page.waitForTimeout(150);
ok('a section folded: its entries out of sight, its heading and totals still there', !(await page.isVisible('tr[data-id="house"]')) && (await page.isVisible('tr[data-id="s-home"]')) &&
    /^Held/.test(await total('Home stuff')) && (await plan()).accounts.find(x => x.id === 's-home').folded === true);
await page.focus('tr[data-id="sav"] .fp-grip');
await page.keyboard.press('ArrowUp');
await page.waitForTimeout(150);
ok('an entry moved into a folded section opens it', (await lst('accounts')).startsWith('#Home stuff,Checking,House,Mortgage,Savings,#Investing') &&
    (await plan()).accounts.find(x => x.id === 's-home').folded === false && await page.isVisible('tr[data-id="sav"]'), await lst('accounts'));
await page.click('tr[data-id="s-inv"] .fp-x');
await page.waitForTimeout(150);
ok('a heading removed: what was under it stays, in the section above', (await lst('accounts')) === '#Home stuff,Checking,House,Mortgage,Savings,Brokerage,#Rainy', await lst('accounts'));
await page.click('.fp-section[data-sec="ahead"] .fp-head-acts .fp-btn');
await page.waitForTimeout(200);
const withSections = await page.evaluate(() => navigator.clipboard.readText());
ok('Copy summary lists each section with its totals', /### Sections/.test(withSections) && /- Accounts — Home stuff: Held/.test(withSections) && /- Expenses — Food: \$800 \/ mo/.test(withSections));

// 5. The rules from Tax & Retirement Rules: Social Security taxation, payroll tax,
// contribution limits and capital gains — each against figures worked out by hand.
const fed = (o, b, g, status) => page.evaluate(([o, b, g, s]) => fpFederalTax(fpTaxInfo({ tax: { on: true, status: s || 'single', year: '' } }), o, b, g, 1), [o, b, g, status]);
const ssPart = (b, other, status) => page.evaluate(([b, o, s]) => fpSSTaxable(taxRulesFor('').ssTax[s || 'single'], b, o), [b, other, status]);
// $36,000 of benefits, single: half is $18,000.
ok('Social Security: none of it taxed while half of it and the rest stay under $25,000', (await ssPart(36000, 5000)) === 0);
ok('between $25,000 and $34,000: half of what is above $25,000 ($30,000 → $2,500)', (await ssPart(36000, 12000)) === 2500);
ok('above $34,000: 85% of the excess plus the lesser of half the benefit and $4,500 ($42,000 → $11,300)', Math.abs((await ssPart(36000, 24000)) - 11300) < 1e-9);
ok('never more than 85% of the benefit', Math.abs((await ssPart(36000, 200000)) - 30600) < 1e-9);
ok('married filing jointly: its own amounts, $32,000 and $44,000 ($40,000 → $4,000)', (await ssPart(36000, 22000, 'married')) === 4000);
// Gains stack on top of ordinary income, the deduction coming off ordinary income first.
ok('capital gains above the 0% bracket: $20,000 on $80,000 of pay is $3,000 at 15%, on top of $8,770', Math.abs((await fed(80000, 0, 20000)) - (8770 + 3000)) < 1e-9, String(await fed(80000, 0, 20000)));
ok('gains across the line: $35,550 at 0%, $4,450 at 15% ($667.50) on top of $1,420', Math.abs((await fed(30000, 0, 40000)) - (1420 + 667.5)) < 1e-9, String(await fed(30000, 0, 40000)));
ok('a deduction ordinary income leaves unused comes off the gains', (await fed(10000, 0, 30000)) === 0 && (await fed(0, 0, 49450 + 16100)) === 0 && Math.abs((await fed(0, 0, 49450 + 16100 + 1000)) - 150) < 1e-9);
// Payroll tax: Social Security tax stops at the wage base, Medicare goes on.
const payTax = (w, status) => page.evaluate(([w, s]) => fpPayrollTax(fpTaxInfo({ tax: { on: true, status: s, year: '' } }), w, 1), [w, status]);
ok('payroll tax at $200,000: 6.2% of the $184,500 wage base and 1.45% of it all', Math.abs((await payTax([200000], 'single')) - (184500 * 0.062 + 200000 * 0.0145)) < 1e-9, String(await payTax([200000], 'single')));
ok('and the 0.9% surtax on the household’s pay above $250,000, married: two $150,000 jobs', Math.abs((await payTax([150000, 150000], 'married')) - (2 * 150000 * 0.0765 + 50000 * 0.009)) < 1e-9);
await setPlan({
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'k', name: '401(k)', kind: 'retirement', balance: 0, rate: 0 }],
    incomes: [{ id: 'p', name: 'Pay', amount: 95000, every: 'year', growth: 0, taxed: true, deductions: 10000, intoAccount: 'k', intoAmount: 10000 }],
    tax: { on: true, status: 'single', year: '' }, assume: R0
});
await page.waitForTimeout(150);
first = await page.evaluate((i) => fpProject(fpGet(i), 0).first, id);
// $85,000 less $16,100 is $68,900: $1,240 + $4,560 + $4,070.
ok('pay into a pre-tax 401(k) is not taxed: $9,870 on $95,000 less $10,000', Math.abs(first.estimatedTax * 12 - 9870) < 1e-6, String(first.estimatedTax * 12));
ok('but still pays payroll tax, on all $95,000', Math.abs(first.payrollTax * 12 - 95000 * 0.0765) < 1e-6);
ok('the month says what is payroll tax', /payroll/.test(await page.getAttribute('.fp-month span:has-text("taxes")', 'title')));
await setPlan(Object.assign(await plan(), { accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'k', name: '401(k)', kind: 'retirement', balance: 0, rate: 0, tax: 'roth' }] }));
first = await page.evaluate((i) => fpProject(fpGet(i), 0).first, id);
ok('into a Roth 401(k), it is taxed', Math.abs(first.estimatedTax * 12 - 12070) < 1e-6, String(first.estimatedTax * 12));
await page.uncheck('.fp-tax [data-a="taxPayroll"]');
await page.waitForTimeout(150);
first = await page.evaluate((i) => fpProject(fpGet(i), 0).first, id);
ok('Payroll tax unticked: none', first.payrollTax === 0 && (await plan()).tax.payroll === false);
await setPlan(Object.assign(await plan(), { incomes: [{ id: 'p', name: 'Pension', amount: 95000, every: 'year', growth: 0, taxed: true, wages: false }], tax: { on: true, status: 'single', year: '' } }));
first = await page.evaluate((i) => fpProject(fpGet(i), 0).first, id);
ok('income that is not pay from work pays none either', first.payrollTax === 0 && Math.abs(first.estimatedTax * 12 - 12070) < 1e-6);
ok('the plan names the rules it works from, with a way to them', /^2026 rules · edit$/.test(await page.innerText('.fp-rules-link')));

// Contribution limits.
const lim = () => page.evaluate((i) => { const p = fpGet(i); return fpLimitCheck(p, p.accounts.find(a => a.id === 'k')); }, id);
await setPlan({
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'k', name: 'Work 401(k)', kind: 'retirement', balance: 0, rate: 0 }],
    incomes: [{ id: 'p', name: 'Pay', amount: 150000, every: 'year', growth: 0, taxed: true, deductions: 26000, intoAccount: 'k', intoAmount: 26000, match: 5000 }],
    tax: { on: true, status: 'single', year: '' }, assume: R0
});
await page.waitForTimeout(150);
let L = await lim();
ok('$26,000 a year from pay is over the $24,500 limit; the match is not counted', L.over && L.yearly === 26000 && L.limit === 24500, JSON.stringify(L));
ok('and Ahead says so', /Work 401\(k\): \$26,000 a year goes in, over the 2026 401\(k\) limit of \$24,500 \(no catch-up without a birth month\)/.test(await page.innerText('.fp-projection')));
await setPlan(Object.assign(await plan(), { retire: { on: false, birth: '1970-03', ageYears: 65, ageMonths: 0, until: 95, spending: null, buffer: 6 } }));
L = await lim();
ok('at 56 this year, the $8,000 catch-up: within $32,500', !L.over && L.limit === 32500, JSON.stringify(L));
await setPlan(Object.assign(await plan(), { retire: { on: false, birth: '1964-03', ageYears: 65, ageMonths: 0, until: 95, spending: null, buffer: 6 } }));
L = await lim();
ok('at 62, the larger catch-up for 60 to 63: $35,750', L.limit === 35750, JSON.stringify(L));
await setPlan(Object.assign(await plan(), { incomes: [], accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 },
    { id: 'k', name: 'IRA', kind: 'retirement', balance: 0, rate: 0, monthly: 700, planType: 'ira' }], retire: { on: false, birth: '', ageYears: 65, ageMonths: 0, until: 95, spending: null, buffer: 6 } }));
L = await lim();
ok('an IRA: $700 a month is over its $7,500', L.over && L.ira && L.yearly === 8400 && L.limit === 7500, JSON.stringify(L));
await page.click('tr[data-id="k"] .fp-more');
await page.waitForTimeout(150);
ok('its kind says it is an IRA, and its details what the limit is', (await page.inputValue('tr[data-id="k"] [data-f="kind"]')) === 'retirement:ira:pretax' &&
    /\$8,400 a year goes in, over the 2026 IRA limit of \$7,500/.test(await page.innerText('tr.fp-detail[data-id="k"]')));

// Capital gains on what is drawn from an investment account given a cost basis. A
// $100,000 pension keeps ordinary income in the 22% bracket, so every gain is at 15%;
// spending is $1,000 a month more than it leaves. With a quarter of the fund basis,
// three quarters of a draw is gain: $g less 11.25% of it is $1,000, so g = $1,126.76.
const pensionNet = 100000 / 12 - 13170 / 12;
await setPlan({
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'v', name: 'Brokerage', kind: 'investment', balance: 100000, rate: 0, basis: 25000 }],
    incomes: [{ id: 'pen', name: 'Pension', amount: 100000, every: 'year', growth: 0, taxed: true, wages: false, to: '2040-12' }],
    tax: { on: true, status: 'single', year: '' }, assume: R0,
    retire: { on: true, birth: '1960-11', ageYears: 66, ageMonths: 0, until: 70, spending: pensionNet + 1000, buffer: 0 }
});
await page.waitForTimeout(150);
rp = await rproj();
const g = 1000 / (1 - 0.15 * 0.75);
ok('a year’s draws: $13,521 out of the fund, $1,521 of it tax on the gains', Math.abs(rp.rows[1].withdrawn - 12 * g) < 0.1 && Math.abs(rp.rows[1].withdrawTax - 12 * (g - 1000)) < 0.1,
    rp.rows[1].withdrawn + ' / ' + rp.rows[1].withdrawTax);
ok('and the cash kept where it was', Math.abs(rp.rows[1].cash) < 0.1, String(rp.rows[1].cash));
await setPlan(Object.assign(await plan(), { accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'v', name: 'Brokerage', kind: 'investment', balance: 100000, rate: 0, basis: null }] }));
rp = await rproj();
ok('no basis given: all of it is basis, nothing drawn is taxed', Math.abs(rp.rows[1].withdrawn - 12000) < 0.1 && rp.rows[1].withdrawTax === 0, rp.rows[1].withdrawn + ' / ' + rp.rows[1].withdrawTax);
await page.click('tr[data-id="v"] .fp-more');
await page.waitForTimeout(150);
ok('the basis is in the investment’s details, its balance as the placeholder', (await page.getAttribute('tr.fp-detail[data-id="v"] [data-f="basis"]', 'placeholder')) === '100000');
await page.fill('tr.fp-detail[data-id="v"] [data-f="basis"]', '25000');
await page.waitForTimeout(150);
rp = await rproj();
ok('typed there, it is the plan’s', (await plan()).accounts.find(a => a.id === 'v').basis === 25000 && Math.abs(rp.rows[1].withdrawTax - 12 * (g - 1000)) < 0.1);

// A rule changed in the tool reaches the plan: minimum withdrawals from 74, not 75.
await page.evaluate(() => {
    const t = taxTableLoad();
    t.years['2026'].withdraw.rmdStart[1].age = 74;
    t.years['2026'].socialSecurity.fra[12].years = 68;
    localStorage.setItem('toolboard_taxBrackets', JSON.stringify(t));
});
ok('a rule changed: the age minimum withdrawals start, and full retirement age', await page.evaluate(() => fpRmdAge(1960) === 74 && fpRmdAge(1955) === 73 && fpFullRetirementMonths(1962) === 68 * 12));
await page.evaluate(() => localStorage.removeItem('toolboard_taxBrackets'));
ok('and back to the built-in rules', await page.evaluate(() => fpRmdAge(1960) === 75 && fpFullRetirementMonths(1962) === 67 * 12));

// What savings would be needed to stop working, year by year. Returns and inflation at
// nought, so each figure is spending to the last age less what still comes in.
const needOf = () => page.evaluate((i) => fpNeededToStop(fpGet(i)), id);
const NEED = {
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'h', name: 'Home', kind: 'property', balance: 300000, rate: 0 }],
    incomes: [{ id: 'job', name: 'Job', amount: 5100, every: 'month', growth: 0, taxed: false }],
    expenses: [{ id: 'e', name: 'Costs', amount: 3000, every: 'month', growth: 0 }],
    tax: { on: false }, assume: Object.assign({}, R0, { years: 10 }),
    retire: { on: false, birth: '1976-11', ageYears: 55, ageMonths: 0, until: 60, spending: 3000, buffer: 0 }
};
await setPlan(NEED);
let nd = await needOf();
// Ten years to 60. Stopping at the start of year k needs $3,000 for each month left; by
// then $2,100 a month has been saved.
ok('a row for each year it could stop, with the age then', nd.rows.length === 10 && nd.rows[0].age === 50 && nd.rows[9].age === 59 && nd.rows[3].year === 2029, nd.rows.length + ' ' + nd.rows[0].age);
ok('needed: a month’s spending for each month left to 60 ($288,000 two years in)', Math.abs(nd.rows[2].needed - 288000) < 200 && Math.abs(nd.rows[0].needed - 360000) < 200,
    nd.rows[2].needed + ' / ' + nd.rows[0].needed);
ok('saved: what can be drawn on, not the home ($50,400 two years in)', Math.abs(nd.rows[2].have - 50400) < 1e-6, String(nd.rows[2].have));
ok('the earliest year it is enough: 2032, at 56 ($151,200 saved, $144,000 needed)', nd.earliest === 6 && nd.rows[6].enough && !nd.rows[5].enough && Math.abs(nd.rows[6].needed - 144000) < 100);
const lastsAt = (age) => page.evaluate(([i, a]) => { const p = fpGet(i); p.retire = Object.assign({}, p.retire, { on: true, ageYears: a }); return fpProject(p, 0).milestones.runsOut === null; }, [id, age]);
ok('and the plan agrees: retiring at 56 lasts to 60, at 55 it does not', (await lastsAt(56)) && !(await lastsAt(55)));
// Pay from work with an end of its own stops when work does: a job until 2034 is no help
// to someone who stops in 2027. A pension with an end goes on paying.
await setPlan(Object.assign({}, NEED, { incomes: [Object.assign({}, NEED.incomes[0], { to: '2034-12' })] }));
nd = await needOf();
ok('a job with an end date stops with work: $360,000 to stop now, as without one', Math.abs(nd.rows[0].needed - 360000) < 200, String(nd.rows[0].needed));
ok('and what is needed only shrinks, year on year', nd.rows.every((r, i) => i === 0 || r.needed <= nd.rows[i - 1].needed), nd.rows.map(r => Math.round(r.needed)).join());
await setPlan(Object.assign({}, NEED, { incomes: NEED.incomes.concat([{ id: 'pen', name: 'Pension', amount: 1000, every: 'month', growth: 0, taxed: false, wages: false, to: '2030-10' }]) }));
nd = await needOf();
ok('a pension with an end goes on to it: $48,000 less to stop now', Math.abs(nd.rows[0].needed - 312000) < 200, String(nd.rows[0].needed));
// Retiring at 55 in the plan: from then on, what can be drawn on is what the plan draws
// down — as Ahead shows it, never more than the assets.
await setPlan(Object.assign({}, NEED, { retire: Object.assign({}, NEED.retire, { on: true, ageYears: 55 }) }));
const both = await page.evaluate((i) => { const p = fpGet(i); return [fpNeededToStop(p).rows, fpProject(p, 0).rows]; }, id);
// (With no debts, that is net worth less the home — overdrawn cash counted against it.)
ok('what can be drawn on follows the plan through retirement: net worth less the home, every year',
    both[0].every(r => { const row = both[1].find(x => x.t === r.t); return row && Math.abs(r.have - (row.net - 300000)) < 1e-6; }),
    both[0].map(r => Math.round(r.have)).join() + ' / ' + both[1].map(r => Math.round(r.net - 300000)).join());
ok('and before retiring, the same as working on', Math.abs(both[0][2].have - 50400) < 1e-6);
// Social Security from 62 (70% of $1,000) on to 70: the years it pays need less.
await setPlan(Object.assign({}, NEED, { incomes: NEED.incomes.concat([{ id: 'ss', type: 'ss', name: 'SS', birth: '1976-11', fraBenefit: 1000, claimYears: 62, claimMonths: 0, growth: 0, taxed: false }]),
    retire: Object.assign({}, NEED.retire, { until: 70 }) }));
nd = await needOf();
ok('Social Security later on lowers what is needed: 240 months at $3,000 less 96 at $700', Math.abs(nd.rows[0].needed - (720000 - 96 * 700)) < 400, String(nd.rows[0].needed));
// Pre-tax savings: each $3,000 drawn has tax to pay as well. A year's $36,000 takes G
// drawn where G less the tax on it is $36,000: G − ($1,240 + 12% of G − $28,500) = $36,000,
// so G = $38,431.82. Stopping at 50, the 10% penalty comes off too until 59½: G = $43,359.
// 9½ years of that and half a year of the other.
const PRE = Object.assign({}, NEED, { accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'k', name: 'IRA', kind: 'retirement', balance: 100000, rate: 0 }],
    tax: { on: true, status: 'single', year: '', payroll: false } });
await setPlan(PRE);
nd = await needOf();
ok('pre-tax savings need enough more to pay their tax and penalty: $431,126 to stop now', Math.abs(nd.rows[0].needed - (9.5 * 33820 / 0.78 + 0.5 * 38431.82)) < 250, String(nd.rows[0].needed));
await setPlan(Object.assign({}, PRE, { accounts: [PRE.accounts[0], Object.assign({}, PRE.accounts[1], { tax: 'roth' })] }));
nd = await needOf();
ok('Roth savings do not: $360,000', Math.abs(nd.rows[0].needed - 360000) < 200, String(nd.rows[0].needed));
await setPlan(Object.assign({}, NEED, { retire: Object.assign({}, NEED.retire, { birth: '' }) }));
nd = await needOf();
ok('without a birth month: none, and Ahead says what it needs', nd.missing === 'birth' && /With a birth month/.test(await page.innerText('.fp-projection')));

// In Ahead: worked out a moment after typing stops.
await setPlan(NEED);
await page.waitForTimeout(700);
let ahead = await page.innerText('.fp-projection');
ok('Ahead says the earliest year, at what age, and the two figures', /Could stop working in 2032, at 56: \$14\d,\d{3} needed, \$151,200 saved/.test(ahead), ahead.slice(0, 300));
const needCols = await page.evaluate(() => {
    const heads = Array.from(document.querySelectorAll('.fp-years thead th')).map(t => t.textContent);
    const row = Array.from(document.querySelectorAll('.fp-years tbody tr')).find(tr => tr.firstChild.textContent === '2032');
    return { heads: heads.join(), have: row.children[heads.indexOf('Can draw on')].textContent, needed: row.children[heads.indexOf('Needed to stop')] };
});
ok('the year table: what can be drawn on, and what would be needed', /Can draw on,Needed to stop/.test(needCols.heads) && needCols.have === '$151,200', JSON.stringify(needCols));
ok('reached: in green', await page.evaluate(() => Array.from(document.querySelectorAll('.fp-years tbody tr')).find(tr => tr.firstChild.textContent === '2032').querySelector('.fp-need').classList.contains('fp-pos')));
ok('the chart: the needed line, dashed, the year it is reached marked, and savings apart from the home', await page.isVisible('.fp-chart .fp-needed') &&
    /2032/.test(await page.textContent('.fp-chart .fp-stop-dot title')) && await page.isVisible('.fp-chart .fp-have') && /Needed to stop working/.test(await page.innerText('.fp-projection .fp-legend')));
await page.fill('tr[data-id="e"] [data-f="amount"]', '3100');
ok('typed into: the last figures shown faded until worked out again', await page.evaluate(() => !!document.querySelector('.fp-years .fp-need.fp-stale')));
await page.waitForTimeout(700);
ok('then brought up to date', await page.evaluate(() => !document.querySelector('.fp-years .fp-stale')));
await setPlan(Object.assign({}, NEED, { retire: Object.assign({}, NEED.retire, { on: true, ageYears: 58 }) }));
await page.waitForTimeout(700);
ok('Retirement says it too', /Could stop working in 2032, at 56/.test(await page.innerText('.fp-retire-out')));
await page.click('.fp-section[data-sec="ahead"] .fp-head-acts .fp-btn');
await page.waitForTimeout(200);
ok('and Copy summary', /Could stop working in 2032, at 56: .* \(savings, not property; to last to 60\)\./.test(await page.evaluate(() => navigator.clipboard.readText())));
ok('and what BoardAI reads', /Could stop working in 2032, at 56/.test(await page.evaluate((i) => (fpAITarget(i) || {}).text || '', id)));
// Never reached: spending more than can ever be saved.
await setPlan(Object.assign({}, NEED, { incomes: [{ id: 'job', name: 'Job', amount: 3100, every: 'month', growth: 0, taxed: false }] }));
await page.waitForTimeout(700);
ok('never reached: said', /Savings do not reach what is needed to stop working and last to 60/.test(await page.innerText('.fp-projection')));
const timing = await page.evaluate((i) => {
    const p = fpGet(i);
    p.retire = Object.assign({}, p.retire, { birth: '1986-11', until: 95 });
    p.incomes = [{ id: 'job', name: 'Job', amount: 9000, every: 'month', growth: 3, taxed: true }];
    p.accounts = p.accounts.concat([{ id: 'v', name: 'Fund', kind: 'investment', balance: 50000, rate: 7, basis: 30000 }, { id: 'k', name: '401(k)', kind: 'retirement', balance: 80000, rate: 7 }]);
    p.tax = { on: true, status: 'single', year: '' };
    p.assume = Object.assign({}, p.assume, { inflation: 2.5 });
    const t0 = performance.now(); const n = fpNeededToStop(p); return [performance.now() - t0, n.rows.length];
}, id);
ok('fifty-five years of it, worked out in well under two seconds', timing[1] === 55 && timing[0] < 2000, timing.join(' ms, rows '));

// Ages beside years and months, wherever the household's birth month is known.
ok('ages count by the month: born Nov 1976, 50 in Nov 2026 and 49 in Oct 2026', await page.evaluate(() => {
    const p = { retire: { birth: '1976-11' }, incomes: [] };
    return fpAgeAt(p, new Date(2026, 10, 1)) === 50 && fpAgeAt(p, new Date(2026, 9, 1)) === 49 && fpAgeAt({ retire: {}, incomes: [] }, new Date()) === null &&
        fpAgeAt({ retire: {}, incomes: [{ id: 's', type: 'ss', birth: '1980-01' }] }, new Date(2026, 10, 1)) === 46;
}));
await setPlan({
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 1000, rate: 0 }, { id: 'l', name: 'Car', kind: 'loan', balance: 10000, rate: 0, monthly: 500 },
               { id: 'm', name: 'Mortgage', kind: 'loan', balance: 10000, rate: 6, loan: { amount: 120000, years: 30, extra: 0, closing: '' } }],
    incomes: [{ id: 'job', name: 'Job', amount: 2000, every: 'month', growth: 0, taxed: false, from: '2027-01', to: '2030-10' }],
    expenses: [{ id: 'e', name: 'Costs', amount: 2500, every: 'month', growth: 0 }],
    tax: { on: false }, assume: Object.assign({}, R0, { years: 10, target: 0 }),
    retire: { on: false, birth: '1976-11', ageYears: 55, ageMonths: 0, until: 90, spending: 1000, buffer: 0 }
});
await page.waitForTimeout(700);
ahead = await page.innerText('.fp-projection');
// The last row is the end of October 2036, a month short of 60.
ok('Ahead: a month and the age then — cash runs out in Nov 2026, at 50; debt-free at 51', /Cash runs out Nov 2026, at 50/.test(ahead) && /Debt-free \w{3} 2028, at 51/.test(ahead), ahead.slice(0, 300));
ok('the subtitle and the end of the table: to age 59, and in 2036, at 59', /10 years, to age 59/.test(ahead) && /In 2036, at 59:/.test(ahead));
const ageCol = await page.evaluate(() => {
    const heads = Array.from(document.querySelectorAll('.fp-years thead th')).map(t => t.textContent);
    return [heads[1], Array.from(document.querySelectorAll('.fp-years tbody tr')).map(tr => tr.children[0].textContent + '=' + tr.children[1].textContent).slice(0, 3).join()];
});
ok('the year table has an Age column with Retirement off', ageCol[0] === 'Age' && ageCol[1] === 'Now=50,2027=50,2028=51', ageCol.join(' | '));
ok('the chart: the age under each year, and in the tips', await page.evaluate(() => Array.from(document.querySelectorAll('.fp-chart .fp-tick-age')).length > 2 &&
    /^2027, age 50 — /.test(document.querySelectorAll('.fp-chart .fp-hit title')[1].textContent)));
ok('the year lists: the year and the age', (await page.evaluate(() => Array.from(document.querySelectorAll('.fp-range-from option')).slice(0, 2).map(o => o.textContent).join())) === 'Now · 50,2027 · 50');
await page.click('tr[data-id="m"] .fp-more');
await page.waitForTimeout(150);
ok('a loan’s payoff month, with the age then', /Time left .* · \w{3} \d{4}, at \d+/.test(await page.innerText('tr.fp-detail[data-id="m"]')), await page.innerText('tr.fp-detail[data-id="m"]'));
ok('From and Until say the age in their hints', (await page.getAttribute('tr[data-id="job"] [data-f="to"]', 'title')) === 'Until (empty: no end) — at 53' &&
    (await page.getAttribute('tr[data-id="job"] [data-f="from"]', 'title')) === 'From (empty: now) — at 50');
await page.click('.fp-section[data-sec="ahead"] .fp-head-acts .fp-btn');
await page.waitForTimeout(200);
const copiedAges = await page.evaluate(() => navigator.clipboard.readText());
ok('Copy summary: an Age column, and the age with each month', /\| Year \| Age \| Assets/.test(copiedAges) && /\| Now \| 50 \|/.test(copiedAges) && /Debt-free \w{3} \d{4}, at \d+\./.test(copiedAges), copiedAges.slice(0, 600));
ok('and what BoardAI reads', /Cash runs out in Nov 2026, at 50\./.test(await page.evaluate((i) => (fpAITarget(i) || {}).text || '', id)));
await setPlan(Object.assign(await plan(), { retire: Object.assign({}, (await plan()).retire, { birth: '' }) }));
await page.waitForTimeout(300);
ahead = await page.innerText('.fp-projection');
ok('without a birth month: as before, no ages', /Cash runs out Nov 2026$/m.test(ahead.split('\n').find(l => /Cash runs out/.test(l)) || '') && !(await page.isVisible('.fp-chart .fp-tick-age')) &&
    (await page.evaluate(() => document.querySelectorAll('.fp-years thead th')[1].textContent)) !== 'Age', ahead.slice(0, 200));

// Social Security estimated from pay, when no statement amount is given. Pay rising with
// inflation is the same in today's dollars every year: $60,000 a year from 22 to 70.
// The best 35 years average $5,000 a month: 90% of $1,286 and 32% of the $3,714 above
// it is $1,157.40 + $1,188.48 = $2,345.88.
const SSE = {
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }],
    incomes: [{ id: 'job', name: 'Job', amount: 60000, every: 'year', growth: null, taxed: false },
              { id: 'ss', type: 'ss', name: 'SS', birth: '1966-11', fraBenefit: null, claimYears: 67, claimMonths: 0, growth: 0, taxed: false }],
    tax: { on: false }, assume: Object.assign({}, R0, { inflation: 2.5, years: 10 })
};
await setPlan(SSE);
const est = (stop) => page.evaluate(([i, s]) => { const p = fpGet(i); return fpSSEstimate(p, p.incomes.find(l => l.id === 'ss'), s ? new Date(s[0], s[1], 1) : null); }, [id, stop]);
let e1 = await est();
ok('estimated from pay: $60,000 a year for 35 years is $5,000 a month, and $2,345.88 at full retirement age', Math.abs(e1.aime - 5000) < 1e-6 && Math.abs(e1.pia - 2345.88) < 1e-6 && e1.years === 35, JSON.stringify(e1));
ok('the line uses it while the benefit is empty', await page.evaluate((i) => { const s = fpSSInfo(fpGet(i).incomes.find(l => l.id === 'ss')); return s.estimated && Math.abs(s.monthlyToday - 2345.88) < 1e-6; }, id));
await setPlan(Object.assign({}, SSE, { incomes: [Object.assign({}, SSE.incomes[0], { amount: 300000 }), SSE.incomes[1]] }));
e1 = await est();
ok('pay above the wage base counts only to it: $184,500 a year → $4,369.46', Math.abs(e1.pia - (1157.4 + 0.32 * (7749 - 1286) + 0.15 * (184500 / 12 - 7749))) < 1e-6, String(e1.pia));
await setPlan(Object.assign({}, SSE, { incomes: [SSE.incomes[0], Object.assign({}, SSE.incomes[1], { birth: '2000-11' })] }));
e1 = await est([2026, 10]);
// Born 2000, working from 22: 2022 to 2025 and ten months of 2026 — $290,000 over 420 months.
ok('fewer than 35 years: the missing years count as nothing ($290,000 over 420 months, 90% of it)', Math.abs(e1.pia - 0.9 * 290000 / 420) < 1e-6 && e1.years === 5, JSON.stringify(e1));
const e2 = await est([2036, 10]);
ok('and stopping work later earns more', e2.pia > e1.pia);
await setPlan(Object.assign({}, SSE, { incomes: [SSE.incomes[0], Object.assign({}, SSE.incomes[1], { workFrom: 30, pastPay: 30000 })] }));
e1 = await est();
// From 30: 1996 to 2025 at $30,000 (30 years); 2026, ten months of that and two at the new
// pay ($35,000); 2027 to 2036 at $60,000. The best 35: ten at $60,000, 2026, and 24 at $30,000.
ok('starting age and past pay: what the years before now are counted as', Math.abs(e1.aime - (10 * 60000 + 35000 + 24 * 30000) / 420) < 1e-6, JSON.stringify(e1));
await setPlan(Object.assign({}, SSE, { incomes: [SSE.incomes[0], Object.assign({}, SSE.incomes[1], { fraBenefit: 2000 })] }));
ok('a statement amount typed: used, not the estimate', await page.evaluate((i) => { const s = fpSSInfo(fpGet(i).incomes.find(l => l.id === 'ss')); return !s.estimated && s.monthlyToday === 2000; }, id));
await setPlan(Object.assign({}, SSE, { incomes: SSE.incomes.concat([{ id: 'ss2', type: 'ss', name: 'SS 2', birth: '1968-05', fraBenefit: null, claimYears: 67, claimMonths: 0, growth: 0, taxed: false }]) }));
ok('two Social Security lines: neither guesses whose pay is whose', (await est()) === null);
await page.click('tr[data-id="ss"] .fp-more');
await page.waitForTimeout(150);
await page.check('tr.fp-income-detail[data-id="ss"] [data-f="payFrom"][value="job"]');
await page.waitForTimeout(200);
ok('the pay chosen in its details: kept, and estimated from', JSON.stringify((await plan()).incomes.find(l => l.id === 'ss').payFrom) === '["job"]' && Math.abs((await est()).pia - 2345.88) < 1e-6);
ok('the details say so, and the benefit field shows it', /Estimated from pay: \$2,345\.88 a month at full retirement age, from 35 years/.test(await page.innerText('tr.fp-income-detail[data-id="ss"]')) &&
    (await page.getAttribute('tr.fp-income-detail[data-id="ss"] [data-f="fraBenefit"]', 'placeholder')) === 'est. 2346');
ok('and the estimate is not saved with the plan', !JSON.stringify(await page.evaluate((i) => toolCustomizations[i].financePlan, id)).includes('_est'));
await page.fill('tr[data-id="job"] [data-f="amount"]', '72000');
await page.waitForTimeout(200);
ok('pay changed: the estimate follows ($6,000 a month: $1,157.40 + 32% of $4,714 = $2,665.88)', /Estimated from pay: \$2,665\.88/.test(await page.innerText('tr.fp-income-detail[data-id="ss"]')), await page.innerText('tr.fp-income-detail[data-id="ss"]'));
// Stopping sooner, a smaller benefit: what is needed to stop now is more than with the
// same benefit typed in.
await setPlan(Object.assign({}, SSE, { incomes: [SSE.incomes[0], Object.assign({}, SSE.incomes[1], { birth: '1990-11', claimYears: 62 })],
    retire: { on: false, birth: '', ageYears: 65, ageMonths: 0, until: 80, spending: 4000, buffer: 0 } }));
const neededEst = (await needOf()).rows[0].needed;
const own = await page.evaluate((i) => fpGet(i).incomes.find(l => l.id === 'ss')._est.pia, id);
await setPlan(Object.assign({}, SSE, { incomes: [SSE.incomes[0], Object.assign({}, SSE.incomes[1], { birth: '1990-11', claimYears: 62, fraBenefit: own })],
    retire: { on: false, birth: '', ageYears: 65, ageMonths: 0, until: 80, spending: 4000, buffer: 0 } }));
const neededTyped = (await needOf()).rows[0].needed;
ok('stopping now with the benefit estimated: more is needed than with the full-career figure typed', neededEst > neededTyped + 1000, neededEst + ' vs ' + neededTyped);

// The four kinds of retirement account.
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'k', name: 'Old plan', kind: 'retirement', balance: 1000, rate: 0 }],
    incomes: [], tax: { on: true, status: 'single', year: '' }, assume: R0 });
ok('the kinds offer six retirement types; an account from before is a 401(k)', (await page.evaluate(() => Array.from(document.querySelectorAll('tr[data-id="k"] [data-f="kind"] option'))
    .filter(o => o.value.startsWith('retirement')).map(o => o.textContent).join())) === '401(k),Roth 401(k),457(b),Roth 457(b),Traditional IRA,Roth IRA' &&
    (await page.inputValue('tr[data-id="k"] [data-f="kind"]')) === 'retirement:401k:pretax');
await page.selectOption('tr[data-id="k"] [data-f="kind"]', 'retirement:ira:roth');
await page.waitForTimeout(150);
let acct = (await plan()).accounts.find(a => a.id === 'k');
ok('Roth IRA chosen: the plan type and the tax with it', acct.kind === 'retirement' && acct.planType === 'ira' && acct.tax === 'roth' && (await page.inputValue('tr[data-id="k"] [data-f="kind"]')) === 'retirement:ira:roth');
await page.selectOption('tr[data-id="k"] [data-f="kind"]', 'retirement:401k:pretax');
await page.waitForTimeout(150);
acct = (await plan()).accounts.find(a => a.id === 'k');
ok('and back to a 401(k)', acct.planType === '401k' && acct.tax === 'pretax');
const minimum = await page.evaluate(() => ['401k:pretax', '401k:roth', 'ira:pretax', 'ira:roth'].map(t => { const [pt, tx] = t.split(':'); return fpIsPretax({ kind: 'retirement', planType: pt, tax: tx }); }).join());
ok('minimum withdrawals and tax as drawn: the traditional ones only', minimum === 'true,false,true,false');
// Left work at 55: a 401(k) has no early penalty; an IRA still does. Roth before 59½: said.
const early = (acc) => page.evaluate(([i, a]) => { const p = fpGet(i); p.accounts = [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, Object.assign({ id: 'p', name: 'R', kind: 'retirement', balance: 300000, rate: 0 }, a)];
    p.tax = { on: false }; p.retire = { on: true, birth: '1975-01', ageYears: 55, ageMonths: 0, until: 70, spending: 1000, buffer: 0 }; return fpProject(p, 0).milestones; }, [id, acc]);
let m = await early({ planType: '401k', tax: 'pretax' });
ok('a 401(k) left in the year of turning 55: no penalty said', m.penalty === null && m.rothEarly === null);
m = await early({ planType: 'ira', tax: 'pretax' });
ok('a traditional IRA drawn at 55: the penalty said', m.penalty !== null);
m = await early({ planType: '401k', tax: 'pretax' });
const at54 = await page.evaluate((i) => { const p = fpGet(i); p.accounts = [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'p', name: 'R', kind: 'retirement', balance: 300000, rate: 0 }];
    p.tax = { on: false }; p.retire = { on: true, birth: '1975-01', ageYears: 54, ageMonths: 0, until: 70, spending: 1000, buffer: 0 }; return fpProject(p, 0).milestones.penalty; }, id);
ok('but left at 54, it is', at54 !== null);
m = await early({ planType: 'ira', tax: 'roth' });
ok('a Roth IRA that is all contributions, drawn at 55: nothing to penalise', m.rothEarly === null && m.penalty === null);
m = await early({ planType: 'ira', tax: 'roth', basis: 20000 });
ok('with earnings in it: they are penalised once contributions are out; not the pre-tax penalty', m.rothEarly !== null && m.penalty === null);
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'p', name: 'Roth IRA', kind: 'retirement', balance: 300000, basis: 20000, rate: 0, planType: 'ira', tax: 'roth' }],
    tax: { on: false }, assume: R0, retire: { on: true, birth: '1975-01', ageYears: 55, ageMonths: 0, until: 70, spending: 1000, buffer: 0 } });
await page.waitForTimeout(150);
ok('and the Retirement section says so', /Roth earnings are drawn from Sep 2031, at 56, before 59½: taxed, with a 10% penalty, \$\d/.test(await page.innerText('.fp-retire-out')),
    await page.innerText('.fp-retire-out'));
// The Roth IRA's limit by income: $160,000 single is half-way through $153,000–$168,000.
const rothLim = (pay, status) => page.evaluate(([i, pay, st]) => { const p = fpGet(i); p.incomes = [{ id: 'j', name: 'Job', amount: pay, every: 'year', growth: 0, taxed: true }];
    p.tax = { on: true, status: st, year: '' }; p.retire = Object.assign({}, p.retire, { birth: '' });
    p.accounts = [{ id: 'r', name: 'Roth IRA', kind: 'retirement', balance: 0, rate: 0, monthly: 500, planType: 'ira', tax: 'roth' }]; return fpLimitCheck(p, p.accounts[0]); }, [id, pay, status]);
let rl = await rothLim(100000, 'single');
ok('a Roth IRA under the income range: the full $7,500', rl.limit === 7500 && !rl.over && rl.phase === null);
rl = await rothLim(160000, 'single');
ok('within it, cut in proportion and rounded up to $10: $7,500 × 8,000 ÷ 15,000 = $4,000 at $160,000', rl.rothLimit === 4000 && rl.over && rl.phase.magi === 160000, JSON.stringify(rl));
rl = await rothLim(170000, 'single');
ok('above it: none', rl.rothLimit === 0 && rl.over && /none, with income of \$170,000 above \$168,000/.test(await page.evaluate((c) => fpLimitText(c), rl)));
rl = await rothLim(170000, 'married');
ok('married filing jointly has its own range: $170,000 is under it', rl.limit === 7500 && rl.phase === null);
const ira = { id: 'ira', name: 'IRA', kind: 'retirement', balance: 0, rate: 0, planType: 'ira', tax: 'pretax' };
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, ira],
    incomes: [{ id: 'j', name: 'Job', amount: 5000, every: 'month', growth: 0, taxed: true, deductions: 300, intoAccount: 'ira', intoAmount: 200, match: 100 }], tax: { on: false }, assume: R0 });
await page.click('tr[data-id="j"] .fp-more');
await page.waitForTimeout(150);
ok('an employer match into an IRA: said not to be one', /an IRA takes no employer match/i.test(await page.innerText('tr.fp-income-detail[data-id="j"]')));

// Pay split between accounts: half into a Roth 401(k), half into a traditional one, and
// the employer's match into the traditional one alone.
const SPLIT = {
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'rk', name: 'Work Roth', kind: 'retirement', balance: 0, rate: 0, planType: '401k', tax: 'roth' },
               { id: 'tk', name: 'Work 401(k)', kind: 'retirement', balance: 0, rate: 0, planType: '401k', tax: 'pretax' }],
    incomes: [{ id: 'p', name: 'Pay', amount: 95000, every: 'year', growth: 0, taxed: true, deductions: 12000,
        into: [{ id: 'r1', account: 'rk', amount: 6000, match: 0 }, { id: 'r2', account: 'tk', amount: 6000, match: 4000 }] }],
    tax: { on: true, status: 'single', year: '', payroll: false }, assume: R0
};
await setPlan(SPLIT);
await page.waitForTimeout(150);
let sp = await page.evaluate((i) => { const r = fpProject(fpGet(i), 0); return { first: r.first, rows: r.rows[1] }; }, id);
// Only the traditional $6,000 is untaxed: $89,000 less $16,100 is $72,900 — $1,240 + $4,560 + 22% of $22,500.
ok('only what goes into the traditional account comes off taxed pay', Math.abs(sp.first.estimatedTax * 12 - (1240 + 4560 + 0.22 * 22500)) < 1e-6, String(sp.first.estimatedTax * 12));
const bal = await page.evaluate((i) => { const p = fpGet(i); const n = fpPayrollNow(p); return [n.rk.own * 12, n.rk.match * 12, n.tk.own * 12, n.tk.match * 12].join(); }, id);
ok('each account gets its part, and the match where it was sent', bal === '6000,0,6000,4000', bal);
ok('the deductions count both parts once', Math.abs(sp.first.deductions * 12 - 12000) < 1e-6 && Math.abs(sp.first.payrollOwn * 12 - 12000) < 1e-6 && Math.abs(sp.first.payrollMatch * 12 - 4000) < 1e-6);
await page.click('tr[data-id="p"] .fp-more');
await page.waitForTimeout(150);
const spDetail = 'tr.fp-income-detail[data-id="p"]';
ok('the details: a row for each, and what each comes to, before or after tax', (await page.locator(spDetail + ' .fp-into-row:not(.fp-match-row)').count()) === 2 &&
    /Into Work Roth: \$500 a month after tax/.test(await page.innerText(spDetail)) && /Into Work 401\(k\): \$833 a month \(\$500 yours, \$333 employer\) before tax/.test(await page.innerText(spDetail)),
    await page.innerText(spDetail));
await page.click(spDetail + ' .fp-btn:has-text("+ Another account")');
await page.waitForTimeout(150);
ok('+ Another account: a third row, its amount ready to type', (await page.locator(spDetail + ' .fp-into-row:not(.fp-match-row)').count()) === 3 &&
    await page.evaluate(() => document.activeElement && document.activeElement.dataset.f === 'into.amount' && document.activeElement.dataset.row === 'r3'));
await page.selectOption(spDetail + ' .fp-into-row[data-row="r3"] [data-f="into.account"]', 'tk');
await page.fill(spDetail + ' .fp-into-row[data-row="r3"] [data-f="into.amount"]', '3000');
await page.waitForTimeout(150);
const third = (await plan()).incomes[0].into.find(r => r.id === 'r3');
ok('typed into: kept with the line', third.account === 'tk' && third.amount === 3000);
// $15,000 of your own pay into the two 401(k)s is within the one $24,500 limit.
let lc = await page.evaluate((i) => { const p = fpGet(i); return fpLimitCheck(p, p.accounts.find(a => a.id === 'rk')); }, id);
ok('a Roth and a traditional 401(k) share one limit: $15,000 between them, the match not counted', lc.yearly === 15000 && lc.limit === 24500 && !lc.over && lc.names.join() === 'Work Roth,Work 401(k)', JSON.stringify(lc));
await page.fill(spDetail + ' .fp-into-row[data-row="r3"] [data-f="into.amount"]', '15000');
await page.waitForTimeout(150);
lc = await page.evaluate((i) => { const p = fpGet(i); return fpLimitCheck(p, p.accounts.find(a => a.id === 'tk')); }, id);
ok('$27,000 between them is over it, though neither is alone', lc.over && lc.yearly === 27000, JSON.stringify(lc));
ok('Ahead says so once, naming both', (await page.innerText('.fp-projection')).split('over the 2026 401(k) limit').length === 2 &&
    /Work Roth and Work 401\(k\): \$27,000 a year goes in, over the 2026 401\(k\) limit of \$24,500/.test(await page.innerText('.fp-projection')));
await page.click(spDetail + ' .fp-into-row[data-row="r3"] .fp-x');
await page.waitForTimeout(150);
ok('× takes a row out', (await plan()).incomes[0].into.length === 2);
// IRAs share theirs: $5,000 in a traditional and $4,000 in a Roth is over $7,500.
lc = await page.evaluate((i) => { const p = fpGet(i);
    p.accounts = [{ id: 'ti', name: 'IRA', kind: 'retirement', balance: 0, rate: 0, monthly: 5000 / 12, planType: 'ira', tax: 'pretax' },
                  { id: 'ri', name: 'Roth IRA', kind: 'retirement', balance: 0, rate: 0, monthly: 4000 / 12, planType: 'ira', tax: 'roth' }];
    p.incomes = [{ id: 'j', name: 'Job', amount: 100000, every: 'year', growth: 0, taxed: true }];
    return fpLimitCheck(p, p.accounts[0]); }, id);
ok('a traditional and a Roth IRA share one limit: $9,000 between them is over $7,500', lc.over && Math.abs(lc.yearly - 9000) < 1e-6 && lc.limit === 7500 && lc.phase === null, JSON.stringify(lc));
lc = await page.evaluate((i) => { const p = fpGet(i);
    p.accounts = [{ id: 'ti', name: 'IRA', kind: 'retirement', balance: 0, rate: 0, monthly: 3000 / 12, planType: 'ira', tax: 'pretax' },
                  { id: 'ri', name: 'Roth IRA', kind: 'retirement', balance: 0, rate: 0, monthly: 4500 / 12, planType: 'ira', tax: 'roth' }];
    p.incomes = [{ id: 'j', name: 'Job', amount: 160000, every: 'year', growth: 0, taxed: true }];
    return [fpLimitCheck(p, p.accounts[1]), fpLimitText(fpLimitCheck(p, p.accounts[1]))]; }, id);
ok('within the IRA limit, but the Roth part over its income-cut limit ($4,500 against $4,000): said', lc[0].over && lc[0].rothLimit === 4000 &&
    /\$7,500 a year goes in, within the 2026 IRA limit of \$7,500 [^;]*; the Roth part, \$4,500, is over the Roth IRA limit of \$4,000/.test(lc[1]), lc[1]);

// Where the next dollar goes. $120,000 of pay; the employer adds 50% of what goes in, up to
// 6% of pay — $600 a month in gets the whole $300.
const ADV = {
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 2000, rate: 0 }, { id: 'k', name: 'Work 401(k)', kind: 'retirement', balance: 0, rate: 0 },
               { id: 'cc', name: 'Card', kind: 'credit', balance: 4000, rate: 22, monthly: 100 }, { id: 'car', name: 'Car', kind: 'loan', balance: 9000, rate: 6, monthly: 300 }],
    incomes: [{ id: 'p', name: 'Pay', amount: 120000, every: 'year', growth: 0, taxed: true, deductions: 4800, matchRate: 50, matchCap: 6, into: [{ id: 'r1', account: 'k', amount: 4800, match: null }] }],
    expenses: [{ id: 'e', name: 'Costs', amount: 2600, every: 'month', growth: 0 }],
    tax: { on: true, status: 'single', year: '', payroll: false }, assume: Object.assign({}, R0, { years: 5, returns: Object.assign({}, R0.returns, { investment: 7 }) })
};
await setPlan(ADV);
await page.waitForTimeout(250);
const steps = () => page.evaluate((i) => { const p = fpGet(i); return fpAdviceSteps(p, fpProject(p, 0)); }, id);
let st = await steps();
const step = (k) => st.find(s => s.key === k);
let mo = await page.evaluate((i) => { const p = fpGet(i); return [fpMatchOf(p, p.incomes[0]), fpPayrollNow(p).k]; }, id);
ok('the match by formula: $400 a month in gets $200 of the $300', Math.abs(mo[0].match - 200) < 1e-9 && Math.abs(mo[0].full - 300) < 1e-9 && Math.abs(mo[0].room - 600) < 1e-9 && Math.abs(mo[1].match - 200) < 1e-9, JSON.stringify(mo));
ok('and the step says what gets the rest: $200 more a month', step('match').status === 'part' && Math.abs(step('match').monthly - 200) < 1e-9 && /Putting \$200 more a month into the 401\(k\) gets the rest/.test(step('match').text));
// Spending: $2,600 and $400 of payments, $3,000 a month.
ok('starter cash: $2,000 of the $3,000 a month of spending', step('starter').status === 'part' && Math.abs(step('starter').lump - 1000) < 1e-9, step('starter').text);
ok('debt at 8% or more: the card first, not the car', step('debt').status === 'todo' && step('debt').debts.map(d => d.id).join() === 'cc' && step('debt').lump === 4000);
ok('the emergency fund: six months is $18,000, $15,000 past the starter cash', step('fund').status === 'todo' && Math.abs(step('fund').lump - 15000) < 1e-9, step('fund').text);
ok('an IRA: the whole $7,500 of room', step('ira').status === 'todo' && step('ira').lump === 7500);
ok('the rest of the 401(k): $24,500 less the $4,800 going in', step('k401').status === 'part' && Math.abs(step('k401').monthly - (24500 - 4800) / 12) < 1e-9);
ok('then the 6% car loan against the 7% assumed for investing: close, so it says paying down is certain', step('beyond').cheap.id === 'car' && /Close: paying it down is the certain return/.test(step('beyond').text));
// $115,200 taxed, less $16,100: in the 22% bracket.
ok('the tax rate on the next dollar now: 22%', /taxed at 22% now/.test(step('lean').text) && /Plan for retirement/.test(step('lean').text), step('lean').text);
// A sum of $30,000: $1,000 starter, $4,000 card, $15,000 fund, $7,500 IRA, $2,500 left to invest.
let sp2 = await page.evaluate((i) => { const p = fpGet(i); const pr = fpProject(p, 0); return fpAdviceSplit(p, fpAdviceSteps(p, pr), 30000, true).map(x => x.key + ':' + Math.round(x.amount)).join(); }, id);
ok('a $30,000 sum, step by step: starter, the card, the fund, an IRA, the rest invested — no match or 401(k), which come from pay', sp2 === 'starter:1000,debt:4000,fund:15000,ira:7500,beyond:2500', sp2);
const monthSplit = await page.evaluate((i) => { const p = fpGet(i); const pr = fpProject(p, 0); return [pr.first.surplus, fpAdviceSplit(p, fpAdviceSteps(p, pr), pr.first.surplus, false)]; }, id);
ok('this month’s leftover, placed: all of it, starter cash first', Math.abs(monthSplit[1].reduce((s, x) => s + x.amount, 0) - monthSplit[0]) < 1e-6 && monthSplit[1][0].key === 'starter', JSON.stringify(monthSplit));
ok('the section shows the steps and the split', (await page.locator('.fp-advice .fp-step').count()) === 10 && /Placing what is left over/.test(await page.innerText('.fp-advice')) &&
    await page.evaluate(() => document.querySelector('.fp-step[data-step="debt"] .fp-step-mark').textContent === '○'));
await page.fill('[data-a="advice"][data-k="lump"]', '30000');
await page.waitForTimeout(200);
ok('a sum typed: placed instead, and said to come from savings, not pay', /\$30,000 now/.test(await page.innerText('.fp-advice')) && /A sum cannot buy the employer match/.test(await page.innerText('.fp-advice')) &&
    (await plan()).advice.lump === 30000);
await page.fill('[data-a="advice"][data-k="debtRate"]', '5');
await page.waitForTimeout(200);
st = await steps();
ok('debt above 5% first: the car joins the card', step('debt').debts.map(d => d.id).join() === 'cc,car');
// Roth or traditional, with retirement planned: compared with the rate in the years pre-tax money is drawn.
await setPlan(Object.assign({}, ADV, { retire: { on: true, birth: '1986-11', ageYears: 65, ageMonths: 0, until: 90, spending: 1500, buffer: 0 } }));
st = await steps();
ok('with retirement: today’s rate against retirement’s, and which way it leans', /taxed at 22% now, and about \d+% in retirement/.test(step('lean').text) && ['traditional', 'roth', 'split'].includes(step('lean').lean), step('lean').text);
// The mix: 25 years to retirement is 90% stocks; ten years, 65%; then the lean.
const mix = (birth, risk) => page.evaluate(([i, b, r]) => { const p = fpGet(i); p.retire = Object.assign({}, p.retire, { birth: b, ageYears: 65, ageMonths: 0 }); p.advice.risk = r; return fpAdviceMix(p); }, [id, birth, risk]);
let mx = await mix('1986-11', 'middle');
ok('25 years to retirement: 90% stocks', mx.stocks === 90 && Math.round(mx.years) === 25, JSON.stringify(mx));
mx = await mix('1971-11', 'middle');
// 50 + 40 × 10/25 = 66, to the nearest 5: 65. Expected (8 × 65 + 4 × 35) / 100 = 6.6%.
ok('ten years: 65% stocks, expected 6.6% a year', mx.stocks === 65 && mx.ret === 6.6, JSON.stringify(mx));
ok('bold leans 10 points more, cautious 15 less', (await mix('1971-11', 'bold')).stocks === 75 && (await mix('1971-11', 'cautious')).stocks === 50);
ok('ten years into retirement: 40%', (await mix('1951-11', 'middle')).stocks === 40);
await page.waitForTimeout(300);
await page.click('.fp-advice .fp-btn:has-text("for investments")');
await page.waitForTimeout(200);
const rets = (await plan()).assume.returns;
ok('“Use … for investments” sets the default return of investment and retirement accounts', rets.investment === rets.retirement && rets.investment === (await page.evaluate((i) => fpAdviceMix(fpGet(i)).ret, id)), JSON.stringify(rets));
ok('the section folds like the rest', await page.evaluate(() => FP_SECTIONS.includes('advice') && !!document.querySelector('.fp-section[data-sec="advice"] .fp-fold')));

// The match within the limit: as in the feedback, a formula that counts more than can go in.
// $187,000 of pay, 45% up to 100%: $15,583 a month would be counted — far past the
// $24,500 limit ($2,041.67 a month). With $1,862 a month in, the rest of the limit is the most.
await setPlan({
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 50000, rate: 0 }, { id: 'k', name: '401(k)', kind: 'retirement', balance: 0, rate: 0 }],
    incomes: [{ id: 'p', name: 'Pay', amount: 187000, every: 'year', growth: 0, taxed: true, deductions: 22344, matchRate: 45, matchCap: 100, into: [{ id: 'r1', account: 'k', amount: 22344, match: null }] }],
    expenses: [{ id: 'e', name: 'Costs', amount: 3000, every: 'month', growth: 0 }], tax: { on: true, status: 'single', year: '', payroll: false }, assume: R0
});
await page.waitForTimeout(200);
let mf = await page.evaluate((i) => { const p = fpGet(i); return fpMatchOf(p, p.incomes[0]); }, id);
ok('the formula’s reach stops at the 401(k) limit: $2,041.67 a month, not $15,583', mf.limited && Math.abs(mf.reach - 24500 / 12) < 1e-6 && Math.abs(mf.room - 187000 / 12) < 1e-6 && mf.odd, JSON.stringify(mf));
st = await steps();
ok('so the step asks only for the $179.67 a month left to the limit, and the match that brings', Math.abs(step('match').monthly - (24500 - 22344) / 12) < 1e-6 &&
    /Putting \$180 more a month into the 401\(k\), to your limit, gets \$81 more/.test(step('match').text) && /unusually high/.test(step('match').text), step('match').text);
// The pay a match is worked from stops at $360,000: 6% of $30,000 a month, not of $50,000.
mf = await page.evaluate((i) => { const p = fpGet(i); p.incomes[0].amount = 600000; p.incomes[0].matchCap = 6; return fpMatchOf(p, p.incomes[0]); }, id);
ok('pay past $360,000 is not counted for the match', Math.abs(mf.room - 360000 / 12 * 0.06) < 1e-6 && !mf.odd, JSON.stringify(mf));
// 415(c): yours and the employer's together, at most $72,000.
const big = await page.evaluate((i) => { const p = fpGet(i); p.incomes[0].matchRate = null; p.incomes[0].into = [{ id: 'r1', account: 'k', amount: 24000, match: 50000 }]; return fpLimitCheck(p, p.accounts[1]); }, id);
ok('a 401(k) over $72,000 with the employer’s money: said', big.over415 && big.total === 74000 && /with the employer’s, \$74,000, over the \$72,000 a 401\(k\) can take in a year/.test(await page.evaluate((c) => fpLimitText(c), big)));

// An HSA: through pay, free of income and payroll tax; its own limit, the employer's money counted.
const HSA = {
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'h', name: 'HSA', kind: 'hsa', balance: 0, rate: 0, hsaCover: 'self' }],
    incomes: [{ id: 'p', name: 'Pay', amount: 95000, every: 'year', growth: 0, taxed: true, deductions: 3600, into: [{ id: 'r1', account: 'h', amount: 3600, match: 1000 }] }],
    tax: { on: true, status: 'single', year: '' }, assume: R0
};
await setPlan(HSA);
await page.waitForTimeout(150);
first = await page.evaluate((i) => fpProject(fpGet(i), 0).first, id);
// $91,400 less $16,100 is $75,300: $1,240 + $4,560 + 22% of $24,900. Payroll tax on $91,400.
ok('HSA through pay: not taxed as income', Math.abs(first.estimatedTax * 12 - (1240 + 4560 + 0.22 * 24900)) < 1e-6, String(first.estimatedTax * 12));
ok('nor for payroll tax', Math.abs(first.payrollTax * 12 - 91400 * 0.0765) < 1e-6, String(first.payrollTax * 12));
let hc = await page.evaluate((i) => { const p = fpGet(i); return fpLimitCheck(p, p.accounts[1]); }, id);
ok('its limit counts the employer’s money: $4,600 against $4,400 self-only, over', hc.key === 'hsa' && hc.yearly === 4600 && hc.limit === 4400 && hc.over, JSON.stringify(hc));
await setPlan(Object.assign({}, HSA, { accounts: [HSA.accounts[0], Object.assign({}, HSA.accounts[1], { hsaCover: 'family' })], retire: { on: false, birth: '1970-01', ageYears: 65, ageMonths: 0, until: 95, spending: null, buffer: 6 } }));
hc = await page.evaluate((i) => { const p = fpGet(i); return fpLimitCheck(p, p.accounts[1]); }, id);
ok('family cover, and 55 or older: $8,750 and $1,000 more', hc.limit === 9750 && !hc.over, JSON.stringify(hc));
// Paid in directly, of income tax only.
const direct = await page.evaluate((i) => { const p = fpGet(i); p.incomes[0].into = []; p.incomes[0].deductions = 0; p.accounts[1].monthly = 300; return fpProject(p, 0).first; }, id);
ok('paid into directly: off taxed income, but payroll tax on all the pay', Math.abs(direct.estimatedTax * 12 - (1240 + 4560 + 0.22 * (95000 - 3600 - 16100 - 50400))) < 1e-6 && Math.abs(direct.payrollTax * 12 - 95000 * 0.0765) < 1e-6,
    direct.estimatedTax * 12 + ' / ' + direct.payrollTax * 12);
// Drawn in retirement: untaxed for medical costs; otherwise taxed, with a penalty before 65.
const hsaDraw = (medical) => page.evaluate(([i, m]) => { const p = fpGet(i);
    p.accounts = [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'h', name: 'HSA', kind: 'hsa', balance: 100000, rate: 0, hsaMedical: m }];
    p.incomes = []; p.tax = { on: true, status: 'single', year: '' }; p.retire = { on: true, birth: '1966-11', ageYears: 60, ageMonths: 0, until: 70, spending: 3000, buffer: 0 };
    const r = fpProject(p, 0); return { tax: r.rows[1].withdrawTax, pen: r.milestones.hsaPenalty }; }, [id, medical]);
let hd = await hsaDraw(true);
ok('an HSA drawn for medical costs: no tax', hd.tax === 0 && hd.pen === null, JSON.stringify(hd));
hd = await hsaDraw(false);
ok('drawn for other things: taxed as income, and before 65 the 20% penalty said', hd.tax > 0 && hd.pen !== null, JSON.stringify(hd));
await setPlan(HSA);
st = await steps();
ok('the next-dollar steps: goals, then an HSA, after the emergency fund, with its room', st.map(s => s.key).join() === 'starter,match,debt,fund,goals,hsa,lean,ira,k401,beyond' && step('hsa').status === 'done', st.map(s => s.key + ':' + s.status).join());
await setPlan(Object.assign({}, HSA, { accounts: [HSA.accounts[0]], incomes: [{ id: 'p', name: 'Pay', amount: 95000, every: 'year', growth: 0, taxed: true }] }));
st = await steps();
ok('no HSA in the plan: the step says what one would do', step('hsa').status === 'skip' && /With a high-deductible health plan, an HSA comes next/.test(step('hsa').text));

// A 457(b): a limit of its own beside the 401(k)'s, and no early penalty once the job is left.
const two = await page.evaluate((i) => { const p = fpGet(i);
    p.accounts = [{ id: 'k', name: '401(k)', kind: 'retirement', balance: 0, rate: 0, monthly: 24000 / 12 }, { id: 'g', name: '457(b)', kind: 'retirement', balance: 0, rate: 0, planType: '457', monthly: 24000 / 12 }];
    return [fpLimitCheck(p, p.accounts[0]), fpLimitCheck(p, p.accounts[1])]; }, id);
ok('$24,000 into a 401(k) and $24,000 into a 457(b): each within its own limit', !two[0].over && !two[1].over && two[1].key === '457' && Math.abs(two[0].yearly - 24000) < 1e-6 && Math.abs(two[1].yearly - 24000) < 1e-6, JSON.stringify(two.map(c => [c.key, c.yearly, c.over])));
m = await early({ planType: '457', tax: 'pretax' });
const at50 = await page.evaluate((i) => { const p = fpGet(i); p.accounts = [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'p', name: 'G', kind: 'retirement', balance: 300000, rate: 0, planType: '457' }];
    p.tax = { on: false }; p.retire = { on: true, birth: '1975-01', ageYears: 50, ageMonths: 0, until: 70, spending: 1000, buffer: 0 }; return fpProject(p, 0).milestones.penalty; }, id);
ok('a 457(b) drawn at 50, the job left: no early penalty', at50 === null);

// The draw order: back to the usual one.
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'h', name: 'HSA', kind: 'hsa', balance: 10000, rate: 0 },
        { id: 'r', name: 'Roth', kind: 'retirement', balance: 10000, rate: 0, tax: 'roth' }, { id: 'i', name: 'Brokerage', kind: 'investment', balance: 10000, rate: 0 }],
    tax: { on: false }, assume: R0, retire: { on: true, birth: '1960-11', ageYears: 66, ageMonths: 0, until: 70, spending: 1000, buffer: 0 } });
await page.waitForTimeout(150);
ok('the usual order: the HSA last, and nothing to reset', (await drawn()) === '1. Cash Cash | 2. Brokerage Investment | 3. Roth Roth 401(k) | 4. HSA HSA' && await page.isDisabled('.fp-draw-reset'), await drawn());
await page.focus('.fp-draw tr[data-id="h"] .fp-grip');
await page.keyboard.press('ArrowUp');
await page.keyboard.press('ArrowUp');
await page.waitForTimeout(150);
ok('moved: the button offers the usual order back', (await drawn()).startsWith('1. Cash Cash | 2. HSA') && !(await page.isDisabled('.fp-draw-reset')) && (await page.innerText('.fp-draw-reset')) === 'Reset to the usual order', await drawn());
await page.click('.fp-draw-reset');
await page.waitForTimeout(150);
ok('Reset to the usual order: as it was', (await drawn()) === '1. Cash Cash | 2. Brokerage Investment | 3. Roth Roth 401(k) | 4. HSA HSA' && await page.isDisabled('.fp-draw-reset'));

// Before retirement: pay ends at 51, retirement at 55. Cash is drawn down first, then the
// brokerage, $4,000 a month — and never overdrawn while there is anything to draw on.
const GAP = {
    accounts: [{ id: 'c', name: 'Checking', kind: 'cash', balance: 0, rate: 0 }, { id: 'b', name: 'Brokerage', kind: 'investment', balance: 500000, rate: 0 }],
    incomes: [{ id: 'j', name: 'Job', amount: 5000, every: 'month', growth: 0, taxed: false, to: '2030-10' }],
    expenses: [{ id: 'e', name: 'Costs', amount: 4000, every: 'month', growth: 0 }],
    tax: { on: false }, assume: R0, retire: { on: true, birth: '1979-11', ageYears: 55, ageMonths: 0, until: 60, spending: 4000, buffer: 0 }
};
await setPlan(GAP);
await page.waitForTimeout(200);
rp = await rproj();
ok('pay ending before retirement: cash never overdrawn while savings remain', rp.rows.every(r => r.cash > -0.01), rp.rows.map(r => Math.round(r.cash)).join());
// $1,000 a month saved for 48 months, spent in 12; from Nov 2031 the brokerage pays.
ok('savings drawn on from the month cash is spent: Nov 2031, at 52', rp.milestones.drawnEarly === 61, String(rp.milestones.drawnEarly));
ok('a year of it: $48,000 out of the brokerage, month by month', Math.abs(rp.rows[6].withdrawn - 48000) < 0.01 && Math.abs(rp.rows[6].assets - (500000 - 48000)) < 0.01, rp.rows[6].withdrawn + ' / ' + rp.rows[6].assets);
ok('Ahead says so', /Savings drawn on before retirement from Nov 2031, at 52/.test(await page.innerText('.fp-projection')));
ok('and Retirement points at the gap', /Pay stops in Nov 2030, at 51, but retirement is set for Nov 2034, at 55: savings are drawn on in between/.test(await page.innerText('.fp-retire-out')),
    await page.innerText('.fp-retire-out'));
// Pre-tax money drawn in the gap: taxed in each year it is drawn, and the early penalty said.
await setPlan(Object.assign({}, GAP, { accounts: [GAP.accounts[0], { id: 'k', name: 'IRA', kind: 'retirement', balance: 500000, rate: 0, planType: 'ira' }], tax: { on: true, status: 'single', year: '', payroll: false } }));
rp = await rproj();
ok('pre-tax money drawn before retirement: taxed year by year, not in one lump at retirement', rp.rows[6].withdrawTax > 0 && rp.rows[7].withdrawTax > 0 && Math.abs(rp.rows[6].withdrawTax - rp.rows[7].withdrawTax) < 1 &&
    rp.rows.every(r => r.cash > -0.01) && rp.milestones.penalty !== null, rp.rows.map(r => Math.round(r.withdrawTax)).join());
// With nothing to draw on, cash still runs short — and says savings ran out.
await setPlan(Object.assign({}, GAP, { accounts: [GAP.accounts[0]] }));
rp = await rproj();
ok('nothing left to draw on: cash goes short, and that is when savings run out', rp.milestones.cashOut === 61 && rp.rows[6].cash < 0);

// Health costs in retirement, when counted: $800 a month before 65, then Part B ($202.90)
// and $300 beside it. Returns, inflation and medical inflation at nought.
const HEALTH = {
    accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'r', name: 'Roth', kind: 'retirement', balance: 1000000, rate: 0, tax: 'roth' }],
    incomes: [], expenses: [], tax: { on: true, status: 'single', year: '' }, assume: R0,
    retire: { on: true, birth: '1966-11', ageYears: 60, ageMonths: 0, until: 70, spending: 2000, buffer: 0, health: true, healthBefore: 800, healthAfter: 300, medInfl: 0 }
};
await setPlan(HEALTH);
await page.waitForTimeout(200);
rp = await rproj();
ok('before 65: $800 a month of cover on top of spending', Math.abs(rp.rows[1].withdrawn - 12 * 2800) < 0.01, String(rp.rows[1].withdrawn));
ok('from 65: Medicare Part B and what goes beside it, from Nov 2031', rp.milestones.medicare === 61 && Math.abs(rp.rows[6].withdrawn - 12 * (2000 + 300 + 202.9)) < 0.01 && rp.milestones.irmaa === null,
    rp.milestones.medicare + ' ' + rp.rows[6].withdrawn);
ok('Retirement says when Medicare starts', /Medicare from Nov 2031, at 65: Part B \$203 a month/.test(await page.innerText('.fp-retire-out')), await page.innerText('.fp-retire-out'));
rp = await page.evaluate((i) => { const p = fpGet(i); p.tax.status = 'married'; return fpProject(p, 0); }, id);
ok('married: Part B for two', Math.abs(rp.rows[6].withdrawn - 12 * (2000 + 300 + 2 * 202.9)) < 0.01, String(rp.rows[6].withdrawn));
// Large pre-tax withdrawals: income over $109,000 two years on brings the surcharge.
rp = await page.evaluate((i) => { const p = fpGet(i); p.accounts[1] = { id: 'r', name: 'IRA', kind: 'retirement', balance: 3000000, rate: 0, planType: 'ira' }; p.retire.spending = 12000; return fpProject(p, 0); }, id);
ok('income over $109,000: the Part B and D surcharge, from income two years before', rp.milestones.irmaa === 61, String(rp.milestones.irmaa));
await setPlan(Object.assign({}, HEALTH, { retire: Object.assign({}, HEALTH.retire, { health: false }) }));
rp = await rproj();
ok('not counted: spending as given, nothing added', Math.abs(rp.rows[1].withdrawn - 12 * 2000) < 0.01 && Math.abs(rp.rows[6].withdrawn - 12 * 2000) < 0.01);
// An HSA takes nothing more once on Medicare: 65 in May 2027, six months of $100 first.
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'h', name: 'HSA', kind: 'hsa', balance: 0, rate: 0 }],
    incomes: [{ id: 'p', name: 'Pay', amount: 5000, every: 'month', growth: 0, taxed: false, deductions: 100, into: [{ id: 'r1', account: 'h', amount: 100, match: 0 }] }],
    tax: { on: false }, assume: Object.assign({}, R0, { years: 2 }), retire: { on: false, birth: '1962-05', ageYears: 67, ageMonths: 0, until: 90, spending: null, buffer: 6 } });
rp = await rproj();
ok('on Medicare, nothing more into the HSA: $600, then the $100 is take-home again', Math.abs(rp.rows[2].assets - (600 + 5000 * 24 - 600)) < 0.01, String(rp.rows[2].assets));

// 6. Theirs: not in share links or HTML exports, kept in JSON backups.
const privacy = await page.evaluate((i) => ({
    share: JSON.stringify(toolSharePayload(i)).includes('financePlan'),
    backup: JSON.stringify(toolExportEntry(i)).includes('financePlan'),
    html: JSON.stringify(withoutPrivateIn(toolCustomizations)).includes('financePlan')
}), id);
ok('a share link carries the tool and not the plan; an HTML export neither', !privacy.share && !privacy.html, JSON.stringify(privacy));
ok('a JSON export, the person’s own backup, keeps it', privacy.backup);
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
