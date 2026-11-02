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
await setPlan({ accounts: [{ id: 'v', name: 'Fund', kind: 'investment', balance: 100000, rate: 6, monthly: 100, compounding: 'annual' }],
    tax: { on: false }, assume: { years: 10, inflation: 0, real: false, spread: 0, target: 0, returns: {} } });
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
// Side work alone is estimated: $24,000 less the $16,100 deduction is $7,900, at 10%.
const sideTax = (24000 - 16100) * 0.10;
ok('deductions come out, in each line’s own period', Math.abs(first.deductions - (500 + 100)) < 1e-9, String(first.deductions));
ok('taxes typed are paid as typed, and that line is left out of the estimate', Math.abs(first.typedTax - 1200) < 1e-9 && Math.abs(first.estimatedTax - sideTax / 12) < 1e-9 &&
    Math.abs(first.tax - (1200 + sideTax / 12)) < 1e-9, JSON.stringify(first));
ok('take-home: income, less deductions, less taxes', Math.abs(first.takeHome - (8000 - 600 - 1200 - sideTax / 12)) < 1e-9 && /deductions \$600/.test(await page.innerText('.fp-month')) &&
    /take-home \$6,134/.test(await page.innerText('.fp-month')), await page.innerText('.fp-month'));
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
ok('▸ on an income line: which part of its deductions goes where, and the match', (await page.inputValue(incDetail + ' [data-f="intoAmount"]')) === '600' &&
    (await page.inputValue(incDetail + ' [data-f="intoAccount"]')) === 'k' && (await page.inputValue(incDetail + ' [data-f="match"]')) === '300' &&
    /Into 401\(k\): \$900 a month/.test(await page.innerText(incDetail)));
ok('the account’s section total counts it as going in', await page.evaluate((i) => { const p = fpGet(i); return fpSectionTotal(p, 'accounts', fpEntries(p.accounts)).monthlyIn; }, id) === 900);
await page.fill('tr[data-id="k"] [data-f="monthly"]', '600');
await page.waitForTimeout(150);
ok('the same account with money of its own too: a warning it may be counted twice', /counted twice/.test(await page.innerText(incDetail)));
await page.fill('tr[data-id="k"] [data-f="monthly"]', '');
await page.fill(incDetail + ' [data-f="intoAmount"]', '1200');
await page.waitForTimeout(150);
pay = await page.evaluate((i) => fpProject(fpGet(i), 0).first, id);
ok('more into the account than the deductions typed: the deductions are at least that', Math.abs(pay.deductions - 1200) < 1e-9 && /more than the deductions typed/.test(await page.innerText(incDetail)));
await page.click('tr[data-id="k"] .fp-x');
await page.waitForTimeout(150);
pay = await page.evaluate((i) => ({ first: fpProject(fpGet(i), 0).first, line: fpGet(i).incomes[0] }), id);
ok('the account removed: the line forgets it, and the deductions are simply spent', pay.line.intoAccount === '' && pay.first.payrollOwn === 0 && Math.abs(pay.first.takeHome - (8000 - 1000 - 1500)) < 1e-9, JSON.stringify(pay));

// Social Security, as the SSA works it out.
const fra = await page.evaluate(() => [1937, 1938, 1943, 1954, 1955, 1957, 1959, 1960, 1990].map(fpFullRetirementMonths));
ok('full retirement age by birth year: 65, 65+2m, 66 for 1943–54, 66+2m…66+10m, 67 from 1960', fra.join() === [780, 782, 792, 792, 794, 798, 802, 804, 804].join(), fra.join());
const factors = await page.evaluate(() => [[804, 744], [804, 840], [804, 774], [804, 804], [798, 744], [804, 900], [804, 700]].map(([f, c]) => Math.round(fpClaimFactor(f, c) * 10000) / 10000));
ok('claiming: 62 is 70% and 70 is 124% from 1960; 2½ years early 83.33%; 1957 at 62 is 72.5%; nothing past 70 or before 62', factors.join() === '0.7,1.24,0.8333,1,0.725,1.24,0.7', factors.join());

await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }], tax: { on: false }, assume: { years: 31, inflation: 2, real: false, spread: 0, target: 0, returns: {} } });
await page.click('.fp-section[data-sec="income"] .fp-head-acts .fp-btn:has-text("+ Social Security")');
await page.waitForTimeout(150);
ok('+ Social Security: a line, its details open on the birth month', await page.evaluate(() => document.activeElement && document.activeElement.dataset.f === 'birth') &&
    /Your birth month and the benefit/.test(await page.innerText('tr.fp-income-detail')));
await page.fill('tr.fp-income-detail [data-f="birth"]', '1990-03');
await page.fill('tr.fp-income-detail [data-f="fraBenefit"]', '2400');
await page.waitForTimeout(150);
const ssText = await page.innerText('tr.fp-income-detail');
ok('worked out: full retirement age 67, all of it at 67, from March 2057, and what that is then', /Full retirement age 67/.test(ssText) && /100% of the benefit/.test(ssText) &&
    ssText.includes('Starts Mar 2057 at $2,400.00 a month in today’s dollars, about ' + money(2400 * Math.pow(1.02, 31 + (2 - 10) / 12)) + ' then'), ssText.replace(/\n/g, ' | '));
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

// Drawn before 59½: said.
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'p', name: '401(k)', kind: 'retirement', balance: 300000, rate: 0 }],
    tax: { on: false }, assume: R0, retire: { on: true, birth: '1975-01', ageYears: 55, ageMonths: 0, until: 70, spending: 1000, buffer: 0 } });
await page.waitForTimeout(150);
ok('pre-tax money drawn at 55: a 10% penalty may apply', /drawn in Jan 2030, before 59½: a 10% penalty may apply/.test(await page.innerText('.fp-retire-out')), await page.innerText('.fp-retire-out'));

// The order money is drawn in, and changing it.
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'r', name: 'Roth', kind: 'retirement', balance: 10000, rate: 0, tax: 'roth' },
        { id: 'i', name: 'Brokerage', kind: 'investment', balance: 10000, rate: 0 }, { id: 'h', name: 'Home', kind: 'property', balance: 300000, rate: 0 }],
    tax: { on: false }, assume: R0, retire: { on: true, birth: '1960-11', ageYears: 66, ageMonths: 0, until: 70, spending: 1000, buffer: 0 } });
await page.waitForTimeout(150);
const drawn = () => page.evaluate(() => Array.from(document.querySelectorAll('.fp-draw tr')).map(t => t.innerText.replace('☰', '').replace(/\s+/g, ' ').trim()).join(' | '));
ok('the usual order: cash, investments, then Roth — property never', (await drawn()) === '1. Cash Cash | 2. Brokerage Investment | 3. Roth Retirement, Roth', await drawn());
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
ok('Copy summary has a Retirement part', /### Retirement/.test(summary) && /The money lasts to 76/.test(summary) && /Drawn on in this order: Cash, Roth \(Roth\)/.test(summary), summary.slice(summary.indexOf('### Retirement')));
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
ok('eight sections, each with a fold at its heading, all open to begin with', (await secs()) === 'summary+,accounts+,income+,expenses+,retirement+,month+,assumptions+,ahead+' &&
    (await page.locator('.fp-section .fp-fold').count()) === 8, await secs());
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
ok('Hide all: every section to its heading, and the button offers them back', (await secs()) === 'summary-,accounts-,income-,expenses-,retirement-,month-,assumptions-,ahead-' &&
    (await page.innerText('.fp-fold-all')) === 'Show all' && !(await page.isVisible('.fp-chart')) && !(await page.isVisible(row('Savings'))));
await page.waitForTimeout(700);
await page.reload();
await page.waitForSelector('.fp-widget .fp-section', { timeout: 25000 });
await page.waitForTimeout(300);
ok('a reload keeps them folded', (await secs()) === 'summary-,accounts-,income-,expenses-,retirement-,month-,assumptions-,ahead-');
await page.click('.fp-fold-all');
await page.waitForTimeout(150);
ok('Show all: everything back', (await secs()) === 'summary+,accounts+,income+,expenses+,retirement+,month+,assumptions+,ahead+' && (await page.innerText('.fp-fold-all')) === 'Hide all');
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
ok('its details: the plan type, and what the limit is', (await page.inputValue('tr.fp-detail[data-id="k"] [data-f="planType"]')) === 'ira' &&
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
// Social Security from 62 (70% of $1,000) on to 70: the years it pays need less.
await setPlan(Object.assign({}, NEED, { incomes: NEED.incomes.concat([{ id: 'ss', type: 'ss', name: 'SS', birth: '1976-11', fraBenefit: 1000, claimYears: 62, claimMonths: 0, growth: 0, taxed: false }]),
    retire: Object.assign({}, NEED.retire, { until: 70 }) }));
nd = await needOf();
ok('Social Security later on lowers what is needed: 240 months at $3,000 less 96 at $700', Math.abs(nd.rows[0].needed - (720000 - 96 * 700)) < 400, String(nd.rows[0].needed));
// Pre-tax savings: each $3,000 drawn has tax to pay as well. A year's $36,000 takes G
// drawn where G less the tax on it is $36,000: G − ($1,240 + 12% of G − $28,500) = $36,000,
// so G = $38,431.82 — ten years of it.
const PRE = Object.assign({}, NEED, { accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 0, rate: 0 }, { id: 'k', name: 'IRA', kind: 'retirement', balance: 100000, rate: 0 }],
    tax: { on: true, status: 'single', year: '', payroll: false } });
await setPlan(PRE);
nd = await needOf();
ok('pre-tax savings need enough more to pay their tax: $384,318 to stop now', Math.abs(nd.rows[0].needed - 384318.18) < 250, String(nd.rows[0].needed));
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
