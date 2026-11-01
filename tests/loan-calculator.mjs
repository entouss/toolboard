// The Loan Calculator, for a new loan and for one already under way: given today's
// balance, it keeps the original payment and says how long is left, what interest is
// left, how much is paid, and where on the original schedule that balance sits.
// Every figure is checked against a calculation of its own here.
//
// The clock is Playwright's, fixed at 1 November 2026.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, locale: 'en-US' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.clock.install({ time: new Date(2026, 10, 1, 10, 0, 0) });
await page.goto('http://localhost:8777/index.html#tool/loan-calculator');
await page.waitForSelector('#loanResults .calc-card', { timeout: 25000 });

// The arithmetic, done here independently: closed forms where there are any.
const P0 = 300000, r = 0.065 / 12, n = 360;
const pmt = P0 * r / (1 - Math.pow(1 + r, -n));
const money = (x, d = 0) => '$' + x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const span = (m) => Math.floor(m / 12) + 'y ' + (m % 12) + 'm';
const monthsToPay = (B, pay) => Math.ceil(-Math.log(1 - B * r / pay) / Math.log(1 + r));
const interestToPay = (B, pay) => { let b = B, i = 0; while (b > 0.005) { const x = b * r; i += x; b -= Math.min(b, pay - x); } return i; };
const scheduleAt = (B) => { for (let k = 0; k <= n; k++) { const g = Math.pow(1 + r, k); if (P0 * g - pmt * (g - 1) / r <= B + 0.005) return k; } return n; };

const set = async (sel, v) => { await page.fill(sel, String(v)); await page.waitForTimeout(80); };
const cards = () => page.evaluate(() => Array.from(document.querySelectorAll('#loanResults .calc-card')).map(c => c.innerText.replace(/\s+/g, ' ').trim()));
const results = () => page.innerText('#loanResults');

// 1. A new loan, as it always was.
ok('a Current Balance field, empty, beside Original Amount', await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('.calc-widget > .calc-grid label')).map(l => l.textContent);
    return labels[0] === 'Original Amount' && labels[1] === 'Current Balance' && document.getElementById('loanCurrent').value === '';
}));
let c = await cards();
ok('left empty, the figures are a new loan’s', c[0] === 'Monthly Payment ' + money(pmt, 2) && c[1] === 'Total Interest ' + money(pmt * n - P0) && /Year 1/.test(await results()), JSON.stringify(c));

// 2. Under way.
await set('#loanCurrent', 250000);
c = await cards();
const left = monthsToPay(250000, pmt);
const payoff = new Date(2026, 10 + left, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
ok('the payment is still the original one', c[0] === 'Monthly Payment ' + money(pmt, 2), c[0]);
ok('time left, and the month it is paid off', c[1] === 'Time Left ' + span(left) + ' ' + payoff, c[1] + ' | ' + span(left) + ' ' + payoff);
ok('interest left, beside the original total', c[2] === 'Interest Left ' + money(interestToPay(250000, pmt)) + ' of ' + money(pmt * n - P0) + ' in all', c[2]);
ok('how much of the original is paid', c[3] === 'Paid Off 16.7% $50,000 of $300,000', c[3]);
const at = scheduleAt(250000);
ok('where on the original schedule that balance sits', (await page.innerText('.loan-position')) ===
    'That balance is where the original schedule is after ' + span(at) + ', with ' + span(n - at) + ' of it to go.', await page.innerText('.loan-position'));
ok('and the months add up: what is left is about what the schedule has to go', Math.abs((n - at) - left) <= 1, (n - at) + ' vs ' + left);
let text = await results();
ok('the amortization counts from now, to the month it is paid off', /AMORTIZATION, FROM NOW/.test(text) && /In 1 year\b/.test(text) && /In 5 years/.test(text) &&
    !/Year 1\b/.test(text) && new RegExp('Paid off\\s+' + payoff).test(text), text.slice(-300));

// 3. Extra, from the balance.
await set('#loanExtra', 200);
text = await results();
const faster = monthsToPay(250000, pmt + 200);
ok('an extra payment is worked out from today’s balance', text.includes('WITH $200/mo EXTRA, FROM NOW') && text.includes('Payoff: ' + span(faster)) &&
    text.includes('Save ' + money(interestToPay(250000, pmt) - interestToPay(250000, pmt + 200))), text.slice(0, 400));
await set('#loanExtra', 0);

// 4. The edges.
await set('#loanCurrent', 300000);
ok('a balance equal to the original is a new loan', /Total Interest/.test((await cards())[1]));
await set('#loanCurrent', 320000);
text = await results();
ok('more than the original: said, and worked out all the same', /more than the original amount/.test(text) && /Time Left/.test(text) && /start of the original schedule/.test(text));
await set('#loanCurrent', 400000);
text = await results();
ok('a balance the payment cannot touch: said, rather than a payoff that never comes', /does not cover the month.s interest of \$2,166\.67/.test(text) && !/Time Left/.test(text), text);
await set('#loanCurrent', '');
ok('emptied, a new loan again', /Total Interest/.test((await cards())[1]));

// 5. Kept: what was typed comes back after a reload, and Reset puts the defaults back.
const reset = (within = '#loanResults') => page.evaluate((w) => { const b = document.querySelector(w).closest('.calc-widget').querySelector('.calc-reset'); return b ? !b.hidden : null; }, within);
ok('untouched, there is nothing to reset and nothing saved', (await reset()) === false &&
    (await page.evaluate(() => { const t = document.querySelector('#loanResults').closest('.tool').dataset.tool; return JSON.stringify((toolCustomizations[t] || {}).calcInputs || null); })) === 'null');
await set('#loanAmount', 420000);
await set('#loanCurrent', 380000);
await set('#loanRate', 5.25);
await page.waitForTimeout(700);
ok('changed, Reset is offered', (await reset()) === true);
await page.reload();
await page.waitForSelector('#loanResults .calc-card', { timeout: 25000 });
await page.waitForTimeout(300);
ok('a reload keeps what was typed, the empty fields included', await page.evaluate(() =>
    ['loanAmount', 'loanCurrent', 'loanRate', 'loanYears', 'loanExtra'].map(i => document.getElementById(i).value).join()) === '420000,380000,5.25,30,0');
ok('and the figures are worked out from it', /Time Left/.test(await results()) && (await page.innerText('.loan-position')).includes('original schedule'));
await page.click('#loanResults >> xpath=.. >> .calc-reset');
await page.waitForTimeout(300);
ok('Reset: the defaults back, a new loan again, and nothing saved', (await page.evaluate(() =>
    ['loanAmount', 'loanCurrent', 'loanRate'].map(i => document.getElementById(i).value).join())) === '300000,,6.5' &&
    /Total Interest/.test((await cards())[1]) && (await reset()) === false &&
    (await page.evaluate(() => { const t = document.querySelector('#loanResults').closest('.tool').dataset.tool; return (toolCustomizations[t] || {}).calcInputs; })) === undefined);

// The other two keep theirs the same way: a radio group and a select among them.
await page.goto('http://localhost:8777/index.html#tool/dynamic-investment-calculator');
await page.waitForSelector('#growthResults .calc-card', { timeout: 25000 });
await set('#growthInitial', 25000);
await page.click('input[name="growthCompound"][value="annual"] + span');
await page.waitForTimeout(700);
await page.reload();
await page.waitForSelector('#growthResults .calc-card', { timeout: 25000 });
ok('the Investment Calculator keeps its amounts and its compounding', (await page.inputValue('#growthInitial')) === '25000' &&
    (await page.isChecked('input[name="growthCompound"][value="annual"]')) && (await reset('#growthResults')) === true);
await page.goto('http://localhost:8777/index.html#tool/dynamic-tax-calculator');
await page.waitForSelector('#taxResults .calc-card', { timeout: 25000 });
await set('#taxIncome', 98000);
await page.selectOption('#taxStatus', 'married');
await page.waitForTimeout(700);
await page.reload();
await page.waitForSelector('#taxResults .calc-card', { timeout: 25000 });
ok('the Tax Calculator keeps its income and filing status', (await page.inputValue('#taxIncome')) === '98000' && (await page.inputValue('#taxStatus')) === 'married');
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
