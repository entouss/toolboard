// The Agenda Timer: sections and their minutes, planned ahead; Start asks how much
// time there really is and shrinks the sections that are not fixed to fit; running,
// it counts each down, says how far ahead or behind the whole is, chimes once when a
// section is up and waits in overtime for Next. The clock is Playwright's, so minutes
// pass in a moment.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1100, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.clock.install({ time: new Date(2026, 9, 28, 14, 0, 0) });
await page.goto('http://localhost:8777/index.html#tool/agenda-timer');
await page.waitForSelector('.agt-widget .agt-row', { timeout: 20000 });
await page.waitForTimeout(800);
await page.clock.pauseAt(new Date(2026, 9, 28, 14, 1, 0));
const W = '.agt-widget';
const id = await page.evaluate(() => document.querySelector('.agt-widget').closest('.tool').dataset.tool);
await page.evaluate((i) => { const t = document.querySelector('.tool[data-tool="' + i + '"]'); maxZ++; t.style.zIndex = maxZ; }, id);
const text = (s) => page.evaluate((s) => (document.querySelector(s) || {}).textContent || '', W + ' ' + s);
const saved = () => page.evaluate((i) => JSON.parse(JSON.stringify(loadToolCustomizations()[i] || {})), id);
const names = () => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .agt-name')).map(i => i.value), W);
const has = (s, cls) => page.evaluate(([s, cls]) => document.querySelector(s).classList.contains(cls), [W + ' ' + s, cls]);
await page.evaluate(() => { window.__chimes = 0; window.agtChime = () => { window.__chimes++; }; });
const chimes = () => page.evaluate(() => window.__chimes);
const tick = async (ms) => { await page.clock.runFor(ms); };

// 1. The plan.
ok('a new timer comes with a plan to change', JSON.stringify(await names()) ===
    JSON.stringify(['Introductions', 'Background', 'Technical', 'Their questions', 'Wrap-up']), JSON.stringify(await names()));
ok('and its total', await text('.agt-total') === 'Total 45 min');
ok('Wrap-up is fixed', await page.evaluate((s) => document.querySelectorAll(s + ' .agt-fixed input')[4].checked, W));
await page.fill(W + ' .agt-row[data-i="2"] .agt-mins', '25');
ok('changing minutes changes the total', await text('.agt-total') === 'Total 50 min');
ok('and is kept with the tool', (await saved()).agtSections[2].minutes === 25);
await page.fill(W + ' .agt-row[data-i="2"] .agt-mins', '20');
await page.click(W + ' .agt-foot .agt-btn');
ok('+ Section adds one, ready to name', (await names()).length === 6 &&
    await page.evaluate((s) => document.activeElement === document.querySelectorAll(s + ' .agt-name')[5], W));
await page.keyboard.type('Extra');
ok('named as it is typed', (await saved()).agtSections[5].name === 'Extra' && await text('.agt-total') === 'Total 50 min');
await page.keyboard.press('Alt+ArrowUp');
ok('Alt+↑ in its name moves it up', JSON.stringify((await names()).slice(4)) === JSON.stringify(['Extra', 'Wrap-up']) &&
    await page.evaluate((s) => document.activeElement === document.querySelectorAll(s + ' .agt-name')[4], W));
await page.locator(W + ' .agt-row[data-i="4"] .agt-grip').dragTo(page.locator(W + ' .agt-row[data-i="0"]'), { targetPosition: { x: 40, y: 3 } });
ok('a row drags by its grip', (await names())[0] === 'Extra', JSON.stringify(await names()));
await page.click(W + ' .agt-row[data-i="0"] .agt-remove');
ok('× removes it', JSON.stringify(await names()) === JSON.stringify(['Introductions', 'Background', 'Technical', 'Their questions', 'Wrap-up']) &&
    await text('.agt-total') === 'Total 45 min');

// 2. How much time there is.
await page.click(W + ' .agt-start-btn');
ok('Start… asks how much time there is, the plan’s by default', await page.inputValue(W + ' .agt-for') === '45' &&
    /45 min planned, 45 min available\./.test(await text('.agt-note')), await text('.agt-note'));
ok('or until when: the plan’s length from now', await page.inputValue(W + ' .agt-until') === '14:46');
const preview = () => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .agt-preview-row'))
    .map(r => r.querySelector('.agt-preview-len').textContent), W);
await page.fill(W + ' .agt-for', '36');
ok('less time: the sections not fixed shrink by one proportion', JSON.stringify(await preview()) ===
    JSON.stringify(['5 min → 4 min', '10 min → 8 min', '20 min → 15 min', '5 min → 4 min', '5 min']), JSON.stringify(await preview()));
ok('saying by how much', /36 min available for 45 min planned — sections that are not fixed shrink by 23%\./.test(await text('.agt-note')), await text('.agt-note'));
await page.fill(W + ' .agt-until', '14:41');
ok('typing a time is choosing it', await page.evaluate((s) => document.querySelector(s + ' input[value="until"]').checked, W));
ok('until 14:41 is 40 minutes from now', JSON.stringify(await preview()) ===
    JSON.stringify(['5 min → 4 min', '10 min → 9 min', '20 min → 18 min', '5 min → 4 min', '5 min']), JSON.stringify(await preview()));
await page.fill(W + ' .agt-until', '13:30');
ok('a time already past is not one to start with', /already passed/.test(await text('.agt-note')) && await page.isDisabled(W + ' .agt-go'));
await page.fill(W + ' .agt-for', '3');
ok('too little even for the fixed sections: everything shrinks', /not even enough for the fixed sections/.test(await text('.agt-note')) &&
    (await preview()).every(p => /→/.test(p)), JSON.stringify(await preview()));
await page.fill(W + ' .agt-for', '50');
ok('more time than planned stretches nothing, and says what is spare', /5 min to spare/.test(await text('.agt-note')) &&
    (await preview()).every(p => !/→/.test(p)));
await page.click(W + ' .agt-start .agt-btn:not(.primary)');
ok('Cancel goes back to the plan', await page.isHidden(W + ' .agt-start') && await page.isVisible(W + ' .agt-start-btn'));
await page.screenshot({ path: OUT + '/agenda-timer-plan.png' });
await page.click(W + ' .agt-start-btn');
await page.fill(W + ' .agt-for', '36');
await page.screenshot({ path: OUT + '/agenda-timer-start.png' });
await page.click(W + ' .agt-go');

// 3. Running.
ok('it starts on the first section', await text('.agt-count') === 'Section 1 of 5' && await text('.agt-title') === 'Introductions');
ok('counting down its fitted length', await text('.agt-clock') === '4:00' && /of 4 min \(planned 5 min\)/.test(await text('.agt-of')), await text('.agt-of'));
ok('saying what is next', await text('.agt-next') === 'Next: Background · 8 min');
ok('on time, ending when the time is up', await text('.agt-delta') === 'On time' && /^Ends ~2:37/.test(await text('.agt-end')), await text('.agt-end'));
const run = (await saved()).agtRun;
ok('the run is kept with the tool', run && run.index === 0 && run.budget === 2160 && JSON.stringify(run.durs) === '[240,480,900,240,300]', JSON.stringify(run));
await tick(190000);
ok('it counts down', await text('.agt-clock') === '0:50');
ok('amber in the last minute', await has('.agt-now', 'agt-warn'));
await tick(60000);
ok('at the end it counts the overtime', await text('.agt-clock') === '+0:10' && await has('.agt-now', 'agt-over'));
ok('and says the whole is behind', await text('.agt-delta') === '0:10 behind', await text('.agt-delta'));
ok('chiming once', await chimes() === 1);
await tick(5000);
ok('only once', await chimes() === 1);
ok('it does not move on by itself', await text('.agt-title') === 'Introductions');
await page.click(W + ' .agt-next-btn');
ok('Next moves on', await text('.agt-title') === 'Background' && await text('.agt-clock') === '8:00');
ok('still behind by what the last one ran over', await text('.agt-delta') === '0:15 behind', await text('.agt-delta'));
await tick(30000);
await page.click(W + ' .agt-controls .agt-btn:first-child');
ok('Back goes back, its time carrying on', await text('.agt-title') === 'Introductions' && await text('.agt-clock') === '+0:15', await text('.agt-clock'));
await page.click(W + ' .agt-next-btn');
ok('and forward again picks up where it was', await text('.agt-clock') === '7:30');
await page.click(W + ' .agt-pause');
await tick(60000);
ok('paused, the clock stands still', await text('.agt-clock') === '7:30' && await text('.agt-count') === 'Section 2 of 5 · paused');
await page.click(W + ' .agt-pause');
await tick(1000);
ok('and goes on from there', await text('.agt-clock') === '7:29');
await page.click(W + ' .agt-controls .agt-btn:nth-child(3)');
ok('+1 min gives this section another minute', await text('.agt-clock') === '8:29' && /^of 9 min/.test(await text('.agt-of')));
await tick(60000);
await page.click(W + ' .agt-next-btn');
ok('moving on early puts the whole ahead', /ahead$/.test(await text('.agt-delta')), await text('.agt-delta'));

// 4. Kept through a reload.
const before = await text('.agt-clock');
// The clock is paused, so the board's own start-up waits are let run: 3 seconds of them.
await page.reload({ waitUntil: 'load' });
await page.clock.runFor(3000);
await page.waitForSelector(W + ' .agt-clock');
await page.evaluate(() => { window.__chimes = 0; window.agtChime = () => { window.__chimes++; }; });
const secs = (t) => { const [m, s] = t.split(':').map(Number); return m * 60 + s; };
ok('after a reload it is where it was, the time having gone on', await text('.agt-title') === 'Technical' &&
    secs(before) - secs(await text('.agt-clock')) >= 1 && secs(before) - secs(await text('.agt-clock')) <= 3, before + ' / ' + await text('.agt-clock'));

// 5. Behind, and fitting the rest.
await tick(25 * 60000);
ok('a long overrun is a long way behind', /behind$/.test(await text('.agt-delta')) && !(await page.isDisabled(W + ' .agt-fit')), await text('.agt-delta') + ' / ' + await text('.agt-end'));
// The minute it was paused for is not a minute of the time there was: the end moved to 2:38.
ok('the end it is heading for is later than the time is up', /Ends ~.* · time is up 2:38/.test(await text('.agt-end')), await text('.agt-end'));
await page.click(W + ' .agt-fit');
const fitted = await page.evaluate((i) => { const r = loadToolCustomizations()[i].agtRun; const live = agtLive(r, Date.now()); return { rest: live.rest, left: live.left, durs: r.durs }; }, id);
ok('Fit the rest shrinks what is left to end when the time is up', Math.abs(fitted.rest - fitted.left) < 15, JSON.stringify(fitted));
ok('the fixed Wrap-up keeps its 5 minutes', fitted.durs[4] === 300, JSON.stringify(fitted.durs));
ok('and the whole is on time again', await text('.agt-delta') === 'On time' && await page.isDisabled(W + ' .agt-fit') &&
    /The rest now fits, to end at 2:38/.test(await text('.agt-msg')), await text('.agt-delta') + ' / ' + await text('.agt-msg'));
await page.screenshot({ path: OUT + '/agenda-timer-run.png' });
await page.evaluate(() => document.body.classList.add('dark-mode'));
await page.waitForTimeout(100);
await page.screenshot({ path: OUT + '/agenda-timer-run-dark.png' });
await page.evaluate(() => document.body.classList.remove('dark-mode'));

// 6. Sound off, then finishing.
const chimedBefore = await chimes();
await page.click(W + ' .agt-sound');
ok('the chime can be muted', (await saved()).agtSound === false && await text('.agt-sound') === '🔕');
await page.click(W + ' .agt-next-btn');
await tick(fitted.durs[3] * 1000 + 2000);
ok('muted, a section ends without a chime', await chimes() === chimedBefore && await has('.agt-now', 'agt-over'));
await page.click(W + ' .agt-next-btn');
ok('the last section says so', await text('.agt-next') === 'Last section' && await text('.agt-next-btn') === 'Finish');
await tick(240000);
await page.click(W + ' .agt-next-btn');
ok('Finish shows how long each part took', await text('.agt-done .agt-title') === 'Done' &&
    await page.evaluate((s) => document.querySelectorAll(s + ' .agt-summary tbody tr').length, W) === 5);
ok('against the plan', /Took .* of 45 min planned \(36 min fitted\)/.test(await text('.agt-done .agt-of')), await text('.agt-done .agt-of'));
ok('overrun parts stand out', await page.evaluate((s) => !!document.querySelector(s + ' .agt-summary .agt-over-text'), W));
await page.screenshot({ path: OUT + '/agenda-timer-done.png' });
await page.click(W + ' .agt-done .agt-btn');
ok('Back to the plan: the plan as it was', JSON.stringify(await names()) ===
    JSON.stringify(['Introductions', 'Background', 'Technical', 'Their questions', 'Wrap-up']) && !(await saved()).agtRun);

// 7. Stop asks first.
await page.click(W + ' .agt-start-btn');
await page.click(W + ' .agt-go');
await page.click(W + ' .agt-stop');
ok('Stop asks before it stops', await text('.agt-stop') === 'Stop?' && !!(await saved()).agtRun);
await page.click(W + ' .agt-stop');
ok('and stops on the second press', !(await saved()).agtRun && await page.isVisible(W + ' .agt-start-btn'));

// 8. The arithmetic on its own.
ok('rounding keeps the total exact', await page.evaluate(() => {
    const cases = [[[300, 600, 1200, 300, 300], [0, 0, 0, 0, 1], 2160], [[420, 420, 420], [0, 0, 0], 1000], [[600, 60], [1, 0], 500]];
    return cases.every(([s, f, t]) => agtScale(s, f, t, 60).reduce((a, b) => a + b, 0) === Math.floor(t));
}));

// 9. Notes for each section.
const NOTES = 'Ask about:\n- [ ] Systems design\n- [ ] **Testing** habits\n- [x] Read their portfolio';
const row = (i) => W + ' .agt-row[data-i="' + i + '"]';
ok('a section has no notes to begin with', !(await page.evaluate((s) => document.querySelector(s).classList.contains('agt-has-notes'), row(2) + ' .agt-notes-btn')) &&
    await page.isHidden(row(2) + ' .agt-notes'));
await page.click(row(2) + ' .agt-notes-btn');
ok('📝 opens a box for them, ready to type in', await page.isVisible(row(2) + ' .agt-notes') &&
    await page.evaluate((s) => document.activeElement === document.querySelector(s), row(2) + ' .agt-notes'));
await page.keyboard.type(NOTES);
ok('kept with the section', (await saved()).agtSections[2].notes === NOTES);
ok('the box grows to fit them', await page.evaluate((s) => { const t = document.querySelector(s); return t.clientHeight >= t.scrollHeight - 4; }, row(2) + ' .agt-notes'));
await page.click(row(2) + ' .agt-notes-btn');
ok('📝 again closes it, and shows the section has notes', await page.isHidden(row(2) + ' .agt-notes') &&
    await page.evaluate((s) => document.querySelector(s).classList.contains('agt-has-notes'), row(2) + ' .agt-notes-btn'));
await page.click(row(2) + ' .agt-notes-btn');
await page.focus(row(2) + ' .agt-name');
await page.keyboard.press('Alt+ArrowDown');
const secs2 = (await saved()).agtSections;
ok('moving a section takes its notes with it', secs2[3].name === 'Technical' && secs2[3].notes === NOTES && !secs2[2].notes);
ok('open, as it was', await page.isVisible(row(3) + ' .agt-notes') && await page.isHidden(row(2) + ' .agt-notes'));
await page.keyboard.press('Alt+ArrowUp');
await page.click(row(1) + ' .agt-notes-btn');
await page.keyboard.type('Warm up with their last project.');
await page.click(W + ' .agt-start-btn');
await page.click(W + ' .agt-go');
ok('a section with no notes shows none', !(await page.evaluate((s) => !!document.querySelector(s), W + ' .agt-run-notes')));
await page.click(W + ' .agt-next-btn');
ok('running, the section’s notes show under its clock', (await text('.agt-run-notes')).trim() === 'Warm up with their last project.', JSON.stringify(await text('.agt-run-notes')));
ok('and what is next says how much there is to cover', await text('.agt-next') === 'Next: Technical · 20 min · 3 to cover', await text('.agt-next'));
await page.click(W + ' .agt-next-btn');
const boxes = () => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .agt-run-notes input[type="checkbox"]')).map(b => b.checked), W);
ok('notes read as Markdown', await page.evaluate((s) => document.querySelector(s + ' .agt-run-notes strong').textContent, W) === 'Testing');
ok('“- [ ]” lines are tick-boxes, “- [x]” ones ticked', JSON.stringify(await boxes()) === '[false,false,true]', JSON.stringify(await boxes()));
await page.click(W + ' .agt-run-notes input[data-k="0"]');
ok('ticking one keeps it with the run', JSON.stringify((await saved()).agtRun.ticks[2]) === '[0,2]', JSON.stringify((await saved()).agtRun.ticks));
ok('and leaves the plan’s notes as they were', (await saved()).agtSections[2].notes === NOTES);
ok('a ticked item is struck through', await page.evaluate((s) => getComputedStyle(document.querySelector(s + ' .agt-run-notes li.agt-task')).textDecorationLine, W) === 'line-through');
await tick(5000);
ok('the clock ticking leaves the ticks alone', JSON.stringify(await boxes()) === '[true,false,true]');
await page.screenshot({ path: OUT + '/agenda-timer-notes.png' });
await page.evaluate(() => document.body.classList.add('dark-mode'));
await page.waitForTimeout(100);
await page.screenshot({ path: OUT + '/agenda-timer-notes-dark.png' });
await page.evaluate(() => document.body.classList.remove('dark-mode'));
await page.reload({ waitUntil: 'load' });
await page.clock.runFor(3000);
await page.waitForSelector(W + ' .agt-run-notes');
ok('after a reload the ticks are as they were', JSON.stringify(await boxes()) === '[true,false,true]');
for (let k = 0; k < 3; k++) await page.click(W + ' .agt-next-btn');
const covered = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .agt-summary tbody tr')).map(r => r.cells[3].textContent), W);
ok('the summary says how much of each was covered', JSON.stringify(covered) === JSON.stringify(['', '', '2 of 3', '', '']), JSON.stringify(covered));
ok('what was not all covered stands out', await page.evaluate((s) => document.querySelectorAll(s + ' .agt-summary .agt-short-text').length, W) === 1);
await page.click(W + ' .agt-done .agt-btn');
await page.click(W + ' .agt-start-btn');
await page.click(W + ' .agt-go');
await page.click(W + ' .agt-next-btn');
await page.click(W + ' .agt-next-btn');
ok('a new Start starts the ticks afresh', JSON.stringify(await boxes()) === '[false,false,true]');
await page.click(W + ' .agt-stop');
await page.click(W + ' .agt-stop');

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
