// Tax & Retirement Rules (the Tax Brackets tool, grown): beside each year's brackets,
// the capital-gains brackets, payroll tax, how much of Social Security is taxed, the
// contribution limits, and the withdrawal and Social Security rules — kept once for the
// app, edited on a tab each, and read by Finance Planning.
//
// The clock is Playwright's, fixed at 1 November 2026.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1400, height: 1000 }, locale: 'en-US' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('dialog', (d) => d.accept());
await page.clock.install({ time: new Date(2026, 10, 1, 10, 0, 0) });

// 1. Saved before the rules were kept: only the brackets. The rest is the built-in.
await page.goto('http://localhost:8777/index.html');
await page.evaluate(() => localStorage.setItem('toolboard_taxBrackets', JSON.stringify({ years: { '2026': {
    single: { deduction: 16100, brackets: [{ from: 0, rate: 10 }, { from: 12400, rate: 12 }] },
    married: { deduction: 32200, brackets: [{ from: 0, rate: 10 }] } } } })));
await page.goto('http://localhost:8777/index.html#tool/tax-brackets');
await page.waitForSelector('.tb-widget .tb-tabs', { timeout: 25000 });
const TB = '.tb-widget';
const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('toolboard_taxBrackets') || 'null'));
const fill = async (sel, v) => { await page.fill(sel, String(v)); await page.waitForTimeout(100); };
const tab = async (name) => { await page.click(TB + ' .tb-tab[data-tab="' + name + '"]'); await page.waitForTimeout(100); };
const problems = () => page.innerText(TB + ' .tb-rule-problem');

ok('saved brackets kept as they were', await page.evaluate(() => taxTableLoad().years['2026'].single.brackets.length === 2));
ok('and the rest of the year is the built-in rules', await page.evaluate(() => { const y = taxTableLoad().years['2026'];
    return y.payroll.wageBase === 184500 && y.limits.k401 === 24500 && y.withdraw.rmdStart.length === 2 && y.socialSecurity.fra.length === 13; }));
ok('the tool is Tax & Retirement Rules', await page.evaluate(() => PluginRegistry.getTool('tax-brackets').name === 'Tax & Retirement Rules'));
ok('six tabs, on income tax to start', (await page.locator(TB + ' .tb-tab').allInnerTexts()).join() === 'Income tax,Capital gains,Payroll,Social Security,Contributions,Withdrawals,Medicare' &&
    (await page.getAttribute(TB + ' .tb-tab-on', 'data-tab')) === 'income' && (await page.locator(TB + ' .tb-status tbody tr').count()) === 3);
await page.evaluate(() => localStorage.removeItem('toolboard_taxBrackets'));
await page.evaluate(() => taxTableChanged(null));
await page.waitForTimeout(100);

// 2. Capital gains.
await tab('gains');
ok('capital gains: both statuses, three brackets each, as announced for 2026', (await page.locator(TB + ' table[data-path="capGains.single"] tbody tr').count()) === 3 &&
    (await page.inputValue(TB + ' table[data-path="capGains.married"] tbody tr:nth-child(2) [data-k="from"]')) === '98900' &&
    (await page.inputValue(TB + ' table[data-path="capGains.single"] tbody tr:nth-child(3) [data-k="rate"]')) === '20');
ok('each runs to where the next begins', (await page.innerText(TB + ' table[data-path="capGains.single"] tbody tr:nth-child(1) .tb-to')) === '$49,449' &&
    (await page.innerText(TB + ' table[data-path="capGains.single"] tbody tr:nth-child(3) .tb-to')) === 'and up');
ok('the tab is kept with the tool', await page.evaluate(() => Object.values(toolCustomizations).some(c => c.tbTab === 'gains')));
await fill(TB + ' table[data-path="capGains.single"] tbody tr:nth-child(2) [data-k="from"]', 50000);
ok('a bracket changed: kept, and the To column follows', (await stored()).years['2026'].capGains.single[1].from === 50000 &&
    (await page.innerText(TB + ' table[data-path="capGains.single"] tbody tr:nth-child(1) .tb-to')) === '$49,999');
ok('and the planner reads it', await page.evaluate(() => taxRulesFor('').capGains.single[1].min === 50000));
await page.click(TB + ' table[data-path="capGains.single"] + .tb-add');
await page.waitForTimeout(100);
ok('+ Bracket: one more, above the last', (await stored()).years['2026'].capGains.single.length === 4 && (await stored()).years['2026'].capGains.single[3].from === 555500);
await page.click(TB + ' table[data-path="capGains.single"] tbody tr:nth-child(4) .tb-x');
await page.waitForTimeout(100);
ok('× takes it out again', (await stored()).years['2026'].capGains.single.length === 3);
await fill(TB + ' table[data-path="capGains.single"] tbody tr:nth-child(2) [data-k="from"]', 600000);
ok('out of order: said, in words', /Single: Bracket 3 has to start above bracket 2\./.test(await problems()), await problems());
ok('and the planner uses its brackets in order regardless', await page.evaluate(() => taxRulesFor('').capGains.single.map(b => b.min).join() === '0,545500,600000'));
await fill(TB + ' table[data-path="capGains.single"] tbody tr:nth-child(2) [data-k="from"]', 49450);

// 3. Payroll.
await tab('payroll');
ok('payroll: the 2026 rates, wage base and surtax thresholds', (await page.inputValue(TB + ' [data-path="payroll.ssRate"]')) === '6.2' && (await page.inputValue(TB + ' [data-path="payroll.wageBase"]')) === '184500' &&
    (await page.inputValue(TB + ' [data-path="payroll.surtaxMarried"]')) === '250000');
await fill(TB + ' [data-path="payroll.wageBase"]', 190000);
ok('a rule typed: kept app-wide, and read by the planner', (await stored()).years['2026'].payroll.wageBase === 190000 && await page.evaluate(() => taxRulesFor('').payroll.wageBase === 190000));
await fill(TB + ' [data-path="payroll.wageBase"]', '');
ok('emptied: said, and the planner keeps to the built-in figure meanwhile', /The wage base needs an amount\./.test(await problems()) && await page.evaluate(() => taxRulesFor('').payroll.wageBase === 184500));
await fill(TB + ' [data-path="payroll.medicare"]', 150);
ok('a rate over 100%: said', /Medicare tax needs a rate from 0 to 100%\./.test(await problems()));
await fill(TB + ' [data-path="payroll.medicare"]', 1.45);
await fill(TB + ' [data-path="payroll.wageBase"]', 184500);
ok('put right: nothing said', (await problems()) === '' && await page.isHidden(TB + ' .tb-rule-problem'));

// 4. Social Security.
await tab('ss');
ok('Social Security: the taxation amounts for each status', (await page.inputValue(TB + ' [data-path="ssTax.single.half"]')) === '25000' && (await page.inputValue(TB + ' [data-path="ssTax.married.most"]')) === '44000');
ok('the claiming adjustments, exact fractions shown rounded', (await page.inputValue(TB + ' [data-path="socialSecurity.early"]')) === '0.5556' &&
    (await page.inputValue(TB + ' [data-path="socialSecurity.delayed"]')) === '0.6667' && await page.evaluate(() => taxRulesFor('').socialSecurity.early === 5 / 9));
ok('full retirement age by birth year: thirteen rows, 67 from 1960', (await page.locator(TB + ' table[data-path="socialSecurity.fra"] tbody tr').count()) === 13 &&
    (await page.inputValue(TB + ' table[data-path="socialSecurity.fra"] tbody tr:nth-child(13) [data-k="years"]')) === '67');
await fill(TB + ' [data-path="ssTax.single.most"]', 20000);
ok('the 85% amount below the 50% one: said, and the planner keeps the built-in pair', /Single: the 85% amount has to be at least the 50% one\./.test(await problems()) &&
    await page.evaluate(() => taxRulesFor('').ssTax.single.most === 34000));
await fill(TB + ' [data-path="ssTax.single.most"]', 34000);
await fill(TB + ' [data-path="socialSecurity.delayed"]', 0.5);
ok('editing one field leaves the exact fractions beside it alone', (await stored()).years['2026'].socialSecurity.early === 5 / 9 && await page.evaluate(() => fpClaimFactor(67 * 12, 70 * 12) === 1.18));
ok('the benefit formula: 90% to $1,286, 32% to $7,749, 15% above', (await page.inputValue(TB + ' [data-path="socialSecurity.bend1"]')) === '1286' &&
    (await page.inputValue(TB + ' [data-path="socialSecurity.bend2"]')) === '7749' && (await page.inputValue(TB + ' [data-path="socialSecurity.pct3"]')) === '15');
await fill(TB + ' [data-path="socialSecurity.bend2"]', 1000);
ok('the second amount below the first: said, and the built-in pair used', /The second earnings amount has to be above the first\./.test(await problems()) &&
    await page.evaluate(() => taxRulesFor('').socialSecurity.bend2 === 7749));
await fill(TB + ' [data-path="socialSecurity.bend2"]', 8000);
ok('changed: the planner’s estimate uses it', await page.evaluate(() => taxRulesFor('').socialSecurity.bend2 === 8000));
await fill(TB + ' [data-path="socialSecurity.bend2"]', 7749);
await fill(TB + ' table[data-path="socialSecurity.fra"] tbody tr:nth-child(13) [data-k="years"]', 68);
ok('a full retirement age changed: the planner’s too', await page.evaluate(() => fpFullRetirementMonths(1965) === 68 * 12 && fpFullRetirementMonths(1930) === 65 * 12));

// 5. Contributions.
await tab('limits');
ok('contribution limits: 401(k), catch-ups and the IRA, as announced', (await page.inputValue(TB + ' [data-path="limits.k401"]')) === '24500' && (await page.inputValue(TB + ' [data-path="limits.k401CatchUp6063"]')) === '11250' &&
    (await page.inputValue(TB + ' [data-path="limits.ira"]')) === '7500' && (await page.inputValue(TB + ' [data-path="limits.iraCatchUp"]')) === '1100');

await fill(TB + ' [data-path="limits.rothSingleTo"]', 150000);
ok('the Roth IRA income range ending below its start: said', /Single: the Roth IRA range has to end above where it starts\./.test(await problems()));
await fill(TB + ' [data-path="limits.rothSingleTo"]', 168000);
ok('the Roth IRA ranges, as announced for 2026', (await page.inputValue(TB + ' [data-path="limits.rothSingleFrom"]')) === '153000' &&
    (await page.inputValue(TB + ' [data-path="limits.rothMarriedTo"]')) === '252000' && (await problems()) === '');

ok('the 401(k) total, the pay a match counts and the HSA limits, as announced for 2026', (await page.inputValue(TB + ' [data-path="limits.total415"]')) === '72000' &&
    (await page.inputValue(TB + ' [data-path="limits.compCap"]')) === '360000' && (await page.inputValue(TB + ' [data-path="limits.hsaFamily"]')) === '8750' &&
    (await page.inputValue(TB + ' [data-path="limits.hsaCatchUp"]')) === '1000');

// 6. Withdrawals.
await tab('withdraw');
ok('withdrawals: 59 and 6 months, 10%', (await page.inputValue(TB + ' [data-path="withdraw.earlyYears"]')) === '59' && (await page.inputValue(TB + ' [data-path="withdraw.earlyMonths"]')) === '6' &&
    (await page.inputValue(TB + ' [data-path="withdraw.penalty"]')) === '10');
ok('minimum withdrawals from 73, and from 75 for those born from 1960', (await page.inputValue(TB + ' table[data-path="withdraw.rmdStart"] tbody tr:nth-child(2) [data-k="from"]')) === '1960' &&
    (await page.inputValue(TB + ' table[data-path="withdraw.rmdStart"] tbody tr:nth-child(2) [data-k="age"]')) === '75');
ok('the Uniform Lifetime table: 72 to 120', (await page.locator(TB + ' table[data-path="withdraw.rmdTable"] tbody tr').count()) === 49 &&
    (await page.inputValue(TB + ' table[data-path="withdraw.rmdTable"] tbody tr:nth-child(4) [data-k="divisor"]')) === '24.6');
ok('an HSA spent otherwise before 65: a 20% penalty', (await page.inputValue(TB + ' [data-path="withdraw.hsaPenalty"]')) === '20' && await page.evaluate(() => taxRulesFor('').withdraw.hsaAge === 65));
ok('a 401(k) left at 55 or later: no penalty', (await page.inputValue(TB + ' [data-path="withdraw.sepAge"]')) === '55' && await page.evaluate(() => taxRulesFor('').withdraw.sepAge === 55));
await fill(TB + ' [data-path="withdraw.earlyYears"]', 62);
await fill(TB + ' [data-path="withdraw.earlyMonths"]', 0);
ok('the early age changed: the planner’s, in months', await page.evaluate(() => taxRulesFor('').withdraw.early === 62 * 12));
await page.click(TB + ' table[data-path="withdraw.rmdTable"] tbody tr:nth-child(20) .tb-x');
await page.waitForTimeout(100);
ok('a divisor taken out: said', /A divisor is missing for age 91\./.test(await problems()), await problems());
ok('and the planner uses the age below it meanwhile', await page.evaluate(() => fpRmdFactor(91) === 12.2 && fpRmdFactor(92) === 10.8));

// Medicare.
await tab('medicare');
ok('Medicare: from 65, Part B $202.90, and the surcharge tiers for each status', (await page.inputValue(TB + ' [data-path="medicare.age"]')) === '65' &&
    (await page.inputValue(TB + ' [data-path="medicare.partB"]')) === '202.9' && (await page.locator(TB + ' table[data-path="medicare.irmaa.single"] tbody tr').count()) === 5 &&
    (await page.inputValue(TB + ' table[data-path="medicare.irmaa.married"] tbody tr:nth-child(1) [data-k="from"]')) === '218000');
await fill(TB + ' [data-path="medicare.partB"]', 210);
ok('a premium changed: the planner reads it', await page.evaluate(() => taxRulesFor('').medicare.partB === 210));
await fill(TB + ' [data-path="medicare.partB"]', 202.9);
await tab('withdraw');

// 7. The year, as a whole.
await page.click(TB + ' .tb-reset');
await page.waitForTimeout(100);
ok('Reset year: every rule back to the built-in 2026', await page.evaluate(() => JSON.stringify(taxTableLoad().years['2026']) === JSON.stringify(taxBuiltin()['2026'])) &&
    (await page.locator(TB + ' table[data-path="withdraw.rmdTable"] tbody tr').count()) === 49 && await page.isDisabled(TB + ' .tb-reset'));
await page.click(TB + ' .tb-head .tb-btn:has-text("+ Year")');
await page.waitForTimeout(100);
ok('+ Year: 2027, the rules copied', (await page.inputValue(TB + ' .tb-year')) === '2027' && (await stored()).years['2027'].limits.k401 === 24500);
await tab('limits');
await fill(TB + ' [data-path="limits.k401"]', 25500);
ok('a rule for 2027 leaves 2026’s', (await stored()).years['2027'].limits.k401 === 25500 && (await stored()).years['2026'].limits.k401 === 24500);
ok('the planner reads the year its tax comes from', await page.evaluate(() => taxRulesFor('2027').limits.k401 === 25500 && taxRulesFor('').limits.k401 === 24500));
ok('a year without a rule part saved is the built-in', await page.evaluate(() => taxRulesOf({ single: {} }).limits.k401 === 24500 && taxRulesOf(null).withdraw.early === 714));

// 8. A planner on the board follows the rules as they change.
await page.evaluate(() => localStorage.removeItem('toolboard_taxBrackets'));
const planner = await page.evaluate(() => {
    const id = createNoteWithTemplate('finance-planning');
    const p = fpDefaultPlan();
    p.incomes = [{ id: 'ss', type: 'ss', name: 'SS', birth: '1960-06', fraBenefit: 2000, claimYears: 62, claimMonths: 0, growth: 0, taxed: true }];
    fpSet(id, p);
    fpRender(document.querySelector('.tool[data-tool="' + id + '"] .fp-widget'));
    taxTableChanged(null);
    return id;
});
await page.waitForTimeout(200);
const ssAmount = () => page.innerText('.tool[data-tool="' + planner + '"] .fp-ss-amount');
ok('a Social Security line, claimed five years early: 70%', (await ssAmount()) === '$1,400.00', await ssAmount());
await tab('ss');
await fill(TB + ' [data-path="socialSecurity.earlyMore"]', 0.5);
ok('the reduction for months before the first 36 changed: the planner on the board follows', (await ssAmount()) === '$1,360.00', await ssAmount());
ok('the Tax Calculator still works from the brackets', await page.evaluate(() => typeof calculateTax === 'function'));
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
