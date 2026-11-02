// Tax Brackets: the federal brackets and standard deductions by year, kept once for
// the whole app and edited in their own tool; every Tax Calculator works from them,
// with a year of its own choosing or this year's, and the built-in figures when
// nothing is saved.
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
await page.goto('http://localhost:8777/index.html#tool/dynamic-tax-calculator');
await page.waitForSelector('#taxResults .calc-card', { timeout: 25000 });

const card = (label) => page.evaluate((l) => {
    const c = Array.from(document.querySelectorAll('#taxResults .calc-card')).find(x => x.querySelector('.calc-card-label').textContent === l);
    return c ? c.querySelector('.calc-card-value').textContent : null;
}, label);
const TB = '.tb-widget';
const row = (status, i) => TB + ' .tb-status[data-status="' + status + '"] tbody tr:nth-child(' + i + ')';
const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('toolboard_taxBrackets') || 'null'));
const fill = async (sel, v) => { await page.fill(sel, String(v)); await page.waitForTimeout(100); };

// 1. Nothing saved: the built-in year, as before.
ok('with nothing saved, the calculator’s figures are the built-in ones', (await card('Total Tax')) === '$7,670' && (await card('Standard Deduction')) === '$16,100', await card('Total Tax'));
ok('it says which year and status, and where to change them', (await page.innerText('.tax-source')) === '2026 Single brackets · edit in Tax & Retirement Rules');
ok('the year list: this year by default, and the years there are', await page.evaluate(() =>
    Array.from(document.querySelectorAll('#taxYear option')).map(o => o.value + '=' + o.textContent).join()) === '=This year (2026),2026=2026');

// 2. Edit in Tax Brackets: the tool is added to the board.
await page.click('.tax-edit');
await page.waitForSelector(TB + ' .tb-status', { timeout: 10000 });
ok('“edit in Tax Brackets” brings in the Tax Brackets tool, on this year', (await page.inputValue(TB + ' .tb-year')) === '2026' &&
    (await page.locator(TB + ' .tb-status').count()) === 2);
ok('each status: its deduction and seven brackets', (await page.inputValue(TB + ' .tb-status[data-status="married"] .tb-ded')) === '32200' &&
    (await page.locator(TB + ' .tb-status[data-status="single"] tbody tr').count()) === 7);
ok('each bracket runs to where the next begins, the last “and up”', (await page.innerText(row('single', 1) + ' .tb-to')) === '$12,399' &&
    (await page.innerText(row('single', 7) + ' .tb-to')) === 'and up');
// New tools land where there is room on the board; set side by side here so both can be clicked.
const sideBySide = () => page.evaluate(() => {
    const tb = document.querySelector('.tb-widget').closest('.tool'), calc = document.getElementById('taxResults').closest('.tool');
    calc.style.left = '0px'; calc.style.top = '0px'; tb.style.left = '520px'; tb.style.top = '0px';
});
await sideBySide();
await page.evaluate(() => { window.__opened = document.querySelectorAll('.tb-widget').length; });
await page.click('.tax-edit');
await page.waitForTimeout(300);
ok('a calculator filling the window steps back, so the tool is in sight', !(await page.evaluate(() => !!document.querySelector('.tool.fullscreen'))));
ok('pressed again, the same tool, not a second one', await page.evaluate(() => document.querySelectorAll('.tb-widget').length === window.__opened));

// 3. A change reaches the calculator at once, and is kept app-wide.
await fill(row('single', 2) + ' .tb-rate', 15);
ok('a rate changed: the calculator follows', (await card('Total Tax')) === '$8,810', await card('Total Tax'));
ok('kept once for the app, not per board', (await stored()).years['2026'].single.brackets[1].rate === 15 &&
    await page.evaluate(() => Object.keys(localStorage).filter(k => /taxBrackets/.test(k)).join()) === 'toolboard_taxBrackets');
ok('the field being typed in keeps its focus', await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('tb-rate')));

// 4. What cannot be right is said, and the calculator says so too.
await fill(row('single', 3) + ' .tb-from', 1000);
ok('a bracket starting below the one before: said where it is', /Bracket 3 has to start above bracket 2\./.test(await page.innerText(TB + ' .tb-status[data-status="single"] .tb-problem')));
ok('and the calculator warns, working from what can be used', /figures have a problem/.test(await page.innerText('#taxResults')));
await fill(row('single', 3) + ' .tb-from', 50400);
ok('put right, the warnings go', (await page.isHidden(TB + ' .tb-status[data-status="single"] .tb-problem')) && !(/figures have a problem/.test(await page.innerText('#taxResults'))));

// 5. Another year.
await page.click(TB + ' button:has-text("+ Year")');
await page.waitForTimeout(300);
ok('+ Year: the next year, copied from the latest', (await page.inputValue(TB + ' .tb-year')) === '2027' && (await page.inputValue(row('single', 2) + ' .tb-rate')) === '15');
ok('the calculator offers it, and keeps this year by default', (await page.evaluate(() => Array.from(document.querySelectorAll('#taxYear option')).map(o => o.value).join())) === ',2026,2027' &&
    /^2026 /.test(await page.innerText('.tax-source')));
await page.selectOption('#taxYear', '2027');
await fill(TB + ' .tb-status[data-status="single"] .tb-ded', 20000);
ok('chosen, the calculator works from that year', /^2027 Single/.test(await page.innerText('.tax-source')) && (await card('Standard Deduction')) === '$20,000');
await page.waitForTimeout(700);

// 6. A reload.
await page.reload();
await page.waitForSelector('#taxResults .calc-card', { timeout: 25000 });
await page.waitForSelector(TB + ' .tb-status', { timeout: 10000 });
await sideBySide();
ok('a reload keeps the figures, the year the tool shows, and the calculator’s year', (await page.inputValue(TB + ' .tb-year')) === '2027' &&
    (await page.inputValue('#taxYear')) === '2027' && (await card('Standard Deduction')) === '$20,000');

// 7. Deleting a year; the last cannot go.
await page.click(TB + ' button:has-text("Delete year")');
await page.waitForTimeout(300);
ok('Delete year: gone, and the calculator back to this year', (await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('toolboard_taxBrackets')).years).join())) === '2026' &&
    /^2026 /.test(await page.innerText('.tax-source')) && (await page.inputValue(TB + ' .tb-year')) === '2026');
ok('the last year cannot be deleted', await page.isDisabled(TB + ' button:has-text("Delete year")'));

// 8. Brackets added and removed; Reset year.
await page.click(TB + ' .tb-status[data-status="married"] .tb-add');
await page.waitForTimeout(200);
ok('+ Bracket: one more, above the last, at its rate', (await page.locator(TB + ' .tb-status[data-status="married"] tbody tr').count()) === 8 &&
    (await stored()).years['2026'].married.brackets[7].from === 798700 && (await stored()).years['2026'].married.brackets[7].rate === 37);
await page.click(row('married', 8) + ' .tb-x');
await page.waitForTimeout(200);
ok('× takes it away again', (await stored()).years['2026'].married.brackets.length === 7);
await page.click(TB + ' .tb-reset');
await page.waitForTimeout(200);
ok('Reset year: the built-in figures back, and nothing left to reset', (await page.inputValue(row('single', 2) + ' .tb-rate')) === '12' &&
    (await page.isDisabled(TB + ' .tb-reset')) && (await card('Total Tax')) === '$7,670');

// 9. Unreadable storage: the built-in year, and no errors.
await page.evaluate(() => { localStorage.setItem('toolboard_taxBrackets', '{not json'); taxTableChanged(null); });
await page.waitForTimeout(200);
ok('storage that cannot be read: the built-in year', (await card('Total Tax')) === '$7,670' && (await page.inputValue(TB + ' .tb-year')) === '2026');
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
