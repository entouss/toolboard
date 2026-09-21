// What the multiplication challenge remembers. Each pair keeps its last three
// attempts, which is what makes a fact that is known distinguishable from one that
// is guessed right sometimes — and what the times and the colours are read from.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:8777/index.html#tool/multiplication-table');
await page.waitForSelector('.mult-widget', { timeout: 20000 });
await page.waitForTimeout(1500);
const toolId = await page.evaluate(() =>
    document.querySelector('.mult-widget').closest('.tool').getAttribute('data-tool'));
ok('the multiplication tool opens', !!toolId, JSON.stringify(errors).slice(0, 120));

// Narrow the practice numbers to 2 and 3, so a whole range can actually be finished.
const useDigits = (list) => page.evaluate(({ id, list }) => {
    multState[id].challengeDigits = new Set(list);
    multState[id].challengeCurrent = null;
}, { id: toolId, list });

// Answer a specific pair, right or wrong, taking a given time over it. Goes through
// the real submit path so the recording is the tool's, not the test's.
const answer = (a, b, right, ms) => page.evaluate(({ id, a, b, right, ms }) => {
    const widget = document.querySelector('.mult-widget');
    const st = multState[id];
    st.challengeCurrent = { a, b, answer: a * b };
    st.askedAt = Date.now() - ms;
    const input = widget.querySelector('.mult-answer-input');
    input.value = String(right ? a * b : a * b + 1);
    multCheckAnswer(input);
}, { id: toolId, a, b, right, ms });

const pair = (a, b) => page.evaluate(({ id, a, b }) =>
    multGetProgress(id).pairs[a + 'x' + b] || null, { id: toolId, a, b });
const state = (a, b) => page.evaluate(({ id, a, b }) =>
    multPairState(multGetProgress(id).pairs[a + 'x' + b]), { id: toolId, a, b });
const signature = () => page.evaluate(() =>
    document.querySelector('.mult-signature').textContent.trim());

await useDigits([2, 3]);
await page.click('.mult-tab:has-text("Progress")');
await page.waitForTimeout(300);

// 1. An answer is recorded against the pair it was asked about, with its time.
await answer(2, 3, true, 2400);
const first = await pair(2, 3);
ok('an answer is recorded against its own pair', first && first.length === 1,
    JSON.stringify(first));
ok('with roughly the time it took', first[0].ok === true && first[0].ms >= 2300 && first[0].ms < 3600,
    JSON.stringify(first[0]));
ok('and 3 × 2 is a different pair', (await pair(3, 2)) === null);
ok('an untried pair is grey', await state(3, 2) === 'none');

// 2. Right so far is not the same as known. Three in a row is.
ok('one right is passing, not yet learned', await state(2, 3) === 'passing');
await answer(2, 3, true, 1800);
ok('two right is still only passing', await state(2, 3) === 'passing');
await answer(2, 3, true, 3100);
ok('three right in a row is learned', await state(2, 3) === 'learned');

// 3. The cell carries the fastest of the last three correct — what the child can do
//    when it goes well, not their worst day.
const bestOf23 = () => page.evaluate(({ id, a, b }) =>
    multPairFastest(multGetProgress(id).pairs[a + 'x' + b]), { id: toolId, a: 2, b: 3 });
ok('the cell shows the fastest of the three, not the slowest',
    (await bestOf23()) >= 1800 && (await bestOf23()) < 2400, (await bestOf23()) + 'ms');

// 4. Only the last three count, so a fourth attempt pushes the first out.
await answer(2, 3, false, 900);
ok('a miss among the last three makes it shaky', await state(2, 3) === 'shaky');
ok('and only three attempts are kept', (await pair(2, 3)).length === 3,
    String((await pair(2, 3)).length));
ok('a wrong answer contributes no solve time, so the best is unchanged',
    (await bestOf23()) >= 1800 && (await bestOf23()) < 2400, (await bestOf23()) + 'ms');

// 5. Missing all three is a different thing from missing one.
await answer(3, 3, false, 1000);
await answer(3, 3, false, 1000);
await answer(3, 3, false, 1000);
ok('three misses is failing', await state(3, 3) === 'failing');
ok('and it shows no time at all', await page.evaluate(({ id, a, b }) =>
    multPairFastest(multGetProgress(id).pairs[a + 'x' + b]), { id: toolId, a: 3, b: 3 }) === null);

// 6. The signature waits for the whole range, then says what it can claim.
await page.click('.mult-tab:has-text("Progress")');
await page.waitForTimeout(200);
ok('until every pair is learned it counts instead', /of 4 pairs mastered/.test(await signature()),
    await signature());

for (const [a, b] of [[2, 2], [2, 3], [3, 2], [3, 3]]) {
    for (let i = 0; i < 3; i++) await answer(a, b, true, a === 3 && b === 3 ? 7200 : 2000);
}
await page.click('.mult-tab:has-text("Progress")');
await page.waitForTimeout(200);
ok('a finished range earns a signature', /Consistently solves every pair/.test(await signature()),
    await signature());
ok('naming the range it covers', /from 2 to 3/.test(await signature()), await signature());
ok('and the slowest pair, rounded up', /under 8 seconds/.test(await signature()), await signature());

// 7. The claim is scoped to what is being practised, so widening withdraws it.
await useDigits([2, 3, 4]);
await page.click('.mult-tab:has-text("Progress")');
await page.waitForTimeout(200);
ok('an unfinished grid gets no confetti', await page.evaluate(() =>
    document.querySelectorAll('.mult-confetti-bit').length) === 0);
ok('widening the practice numbers withdraws the claim',
    /of 9 pairs mastered/.test(await signature()), await signature());

// 7a. A whole range mastered earns some noise, and only then. Narrowed back to the
//     range that is actually finished, since the step above widened it.
// Body-level now: it falls over the whole window, not inside the tool.
const bits = () => page.evaluate(() =>
    document.querySelectorAll('body > .mult-confetti .mult-confetti-bit').length);
await useDigits([2, 3]);
await page.click('.mult-tab:has-text("Challenge")');
await page.waitForTimeout(150);
await page.click('.mult-tab:has-text("Progress")');
await page.waitForTimeout(300);
ok('confetti falls when a finished grid is opened', await bits() > 0, String(await bits()));

// It clears itself up rather than piling up in the page.
const thrown = await bits();
await page.waitForTimeout(3400);
ok('and clears itself up afterwards', thrown > 0 && await bits() === 0,
    thrown + ' then ' + await bits());

// Thrown on opening the tab, not on every redraw — answering redraws this panel too,
// and that would set it off again on every single question.
await answer(2, 2, true, 1000);
await page.waitForTimeout(300);
ok('and a redraw of the panel does not throw more', await bits() === 0, String(await bits()));

await useDigits([2, 3, 4]);
await page.click('.mult-tab:has-text("Challenge")');
await page.waitForTimeout(150);
await page.click('.mult-tab:has-text("Progress")');
await page.waitForTimeout(250);

// 7b. Every cell is a personal best, so the largest of them is the bar the whole
//     range clears — said at the top rather than left to be hunted for.
const worst = () => page.evaluate(() =>
    document.querySelector('.mult-worst').textContent.trim());
ok('the slowest cell is named above the table', /Slowest pair: 3 × 3 at 7.2s/.test(await worst()),
    await worst());

// 8. The map draws a cell per ordered pair, coloured by state.
const cells = await page.evaluate(() => ({
    total: document.querySelectorAll('.mult-map .mult-cell').length,
    learned: document.querySelectorAll('.mult-map .mult-cell.learned').length,
    none: document.querySelectorAll('.mult-map .mult-cell.none').length
}));
ok('the map has a cell for every ordered pair', cells.total === 9, JSON.stringify(cells));
ok('with the four finished ones green', cells.learned === 4, JSON.stringify(cells));
ok('and the five untried ones grey', cells.none === 5, JSON.stringify(cells));

// 9. It is progress, so it has to survive coming back tomorrow.
await page.reload();
await page.waitForSelector('.mult-widget', { timeout: 20000 });
await page.waitForTimeout(1500);
ok('progress survives a reload', await state(2, 3) === 'learned', await state(2, 3));

// 10. Reset Score clears a session tally; Reset progress clears the history.
await page.click('.mult-tab:has-text("Challenge")');
await page.waitForTimeout(300);
await page.click('.mult-challenge-panel .pomo-btn:has-text("Reset Score")');
await page.waitForTimeout(300);
ok('Reset Score leaves the record alone', await state(2, 3) === 'learned', await state(2, 3));

page.on('dialog', (d) => d.accept());
await page.click('.mult-tab:has-text("Progress")');
await page.waitForTimeout(200);
await page.click('.mult-progress-panel .pomo-btn:has-text("Reset progress")');
await page.waitForTimeout(400);
ok('Reset progress clears it', await state(2, 3) === 'none', await state(2, 3));

// 11. The whole path for real: the tool asks, a child types, Enter. Everything above
//     drives multCheckAnswer directly, so this is what proves the question actually
//     starts a clock and the answer actually lands on the pair that was asked.
await page.click('.mult-tab:has-text("Challenge")');
await page.waitForTimeout(400);
const asked = await page.evaluate(() => document.querySelector('.mult-question').textContent);
const [qa, qb] = asked.replace(' = ?', '').split(' × ').map(Number);
await page.fill('.mult-answer-input', String(qa * qb));
await page.press('.mult-answer-input', 'Enter');
await page.waitForTimeout(400);
const real = await pair(qa, qb);
ok('a real question and answer are recorded', real && real.length === 1, asked + ' ' + JSON.stringify(real));
ok('with a time the tool measured itself',
    real && real[0].ok === true && typeof real[0].ms === 'number' && real[0].ms >= 0 && real[0].ms < 20000,
    JSON.stringify(real && real[0]));

// A few states, so the picture saved at the end has something in it.
await answer(2, 2, true, 1500); await answer(2, 2, true, 2100); await answer(2, 2, true, 1900);
await answer(3, 4, true, 4000); await answer(3, 4, false, 1200); await answer(3, 4, true, 3000);
await answer(4, 4, false, 2000); await answer(4, 4, false, 2000); await answer(4, 4, false, 2000);
await answer(2, 4, true, 2600);
await page.click('.mult-tab:has-text("Progress")');
await page.waitForTimeout(300);
const shades = await page.evaluate(() => ({
    learned: document.querySelectorAll('.mult-map .mult-cell.learned').length,
    shaky: document.querySelectorAll('.mult-map .mult-cell.shaky').length,
    failing: document.querySelectorAll('.mult-map .mult-cell.failing').length,
    passing: document.querySelectorAll('.mult-map .mult-cell.passing').length
}));
ok('every state is drawn on the map',
    shades.learned >= 1 && shades.shaky === 1 && shades.failing === 1 && shades.passing >= 1,
    JSON.stringify(shades));

// 12. Which question comes next follows the record. The weights are checked
//     directly, because a draw is a draw and asserting on one would be a coin toss.
const weightOf = (attempts) => page.evaluate(({ attempts, slowest }) =>
    multPairWeight(attempts, slowest), { attempts, slowest: 8000 });

const W = {
    failing: await weightOf([{ ok: false }, { ok: false }, { ok: false }]),
    shaky: await weightOf([{ ok: true, ms: 1000 }, { ok: false }, { ok: true, ms: 1000 }]),
    none: await weightOf(undefined),
    passing: await weightOf([{ ok: true, ms: 1000 }]),
    learnedSlow: await weightOf([{ ok: true, ms: 8000 }, { ok: true, ms: 8000 }, { ok: true, ms: 8000 }]),
    learnedFast: await weightOf([{ ok: true, ms: 500 }, { ok: true, ms: 500 }, { ok: true, ms: 500 }])
};
ok('a pair always missed is asked most', W.failing > W.shaky, JSON.stringify(W));
ok('then one missed sometimes', W.shaky > W.none, JSON.stringify(W));
ok('then one never tried', W.none > W.passing, JSON.stringify(W));
ok('and a mastered pair least of all', W.passing > W.learnedSlow, JSON.stringify(W));
ok('a slow pair is asked more often than a fast one', W.learnedSlow > W.learnedFast,
    W.learnedSlow + ' vs ' + W.learnedFast);
// The order asked for has to hold strictly: being slow must never promote a pair
// above a whole tier, or a mastered fact would crowd out one never seen.
ok('but being slow never outranks never having been tried', W.learnedSlow < W.none,
    W.learnedSlow + ' vs ' + W.none);

// With nothing recorded, every pair is equally likely — the old behaviour.
await page.click('.mult-progress-panel .pomo-btn:has-text("Reset progress")');
await page.waitForTimeout(400);
const flat = await page.evaluate(() =>
    [multPairWeight(undefined, 0), multPairWeight(undefined, 0)]);
ok('an empty record weights everything the same', flat[0] === flat[1], JSON.stringify(flat));

// 13. Over many draws the troubled pair dominates, and the picker still only ever
//     returns pairs from the range being practised.
await useDigits([2, 3]);
for (let i = 0; i < 3; i++) await answer(3, 3, false, 1500);
for (const [a, b] of [[2, 2], [2, 3], [3, 2]]) {
    for (let i = 0; i < 3; i++) await answer(a, b, true, 900);
}
const draws = await page.evaluate(({ id }) => {
    const counts = {};
    for (let i = 0; i < 400; i++) {
        const p = multPickPair(id, [2, 3], null);
        const k = p.a + 'x' + p.b;
        counts[k] = (counts[k] || 0) + 1;
    }
    return counts;
}, { id: toolId });
const others = ['2x2', '2x3', '3x2'].reduce((n, k) => n + (draws[k] || 0), 0);
ok('the failing pair is asked far more than the mastered ones',
    (draws['3x3'] || 0) > others, JSON.stringify(draws));
ok('and nothing outside the practice range is ever asked',
    Object.keys(draws).every(k => ['2x2', '2x3', '3x2', '3x3'].includes(k)), JSON.stringify(draws));

// 14. The same question is not asked twice running while anything else is available.
const repeats = await page.evaluate(({ id }) => {
    let same = 0;
    for (let i = 0; i < 200; i++) {
        const p = multPickPair(id, [2, 3], '3x3');
        if (p.a === 3 && p.b === 3) same++;
    }
    return same;
}, { id: toolId });
ok('the pair just asked is held back from coming straight round again', repeats === 0,
    String(repeats));

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 200));
await page.screenshot({ path: OUT + '/mult.png' });
await browser.close();
