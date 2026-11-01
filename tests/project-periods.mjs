// The Project Table's periods timeline, between the table and the chart in Both: the
// quarter today is in and the three after it, the half today is in and the next, each
// with its first and last day, to scale, counted the way the chart counts them. It is
// also the divider: dragged, or moved with ↑ and ↓, it shares the height between the
// two panes, and the share is kept; a double-click puts it back.
//
// The clock is Playwright's, fixed at 31 October 2026, so every date below is known.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'out');
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.clock.install({ time: new Date(2026, 9, 31, 10, 0, 0) });
await page.goto('http://localhost:8777/index.html#tool/project-table');
await page.waitForSelector('.proj-widget', { timeout: 25000 });
await page.waitForTimeout(1500);
const id = await page.evaluate(() => document.querySelector('.proj-widget').closest('.tool').dataset.tool);
const T = '.tool[data-tool="' + id + '"] ';
const TL = T + '.proj-timeline';
const segs = (row) => page.evaluate((s) => Array.from(document.querySelectorAll(s)).map(e => ({
    name: e.dataset.name, start: e.dataset.start, end: e.dataset.end, cls: e.className.replace('proj-tl-seg', '').trim(),
    left: parseFloat(e.style.left), width: parseFloat(e.style.width), title: e.title })), TL + ' .proj-tl-row.' + row + ' .proj-tl-seg');
const brief = (list) => list.map(s => s.name + ' ' + s.start + '..' + s.end + (s.cls ? ' [' + s.cls + ']' : '')).join(' | ');
const setUnits = (patch) => page.evaluate(([i, p]) => {
    const d = projGetData(i);
    d.units = Object.assign({}, projUnits(d), p);
    projSetData(i, d);
    projRender(document.querySelector('.tool[data-tool="' + i + '"] .proj-widget'), i);
}, [id, patch]);

// 1. Where it is.
ok('in Both, a timeline sits between the table and the chart', await page.isVisible(TL) && await page.evaluate((s) => {
    const tl = document.querySelector(s);
    return tl.previousElementSibling.classList.contains('authoring-resizer') && tl.previousElementSibling.previousElementSibling.classList.contains('proj-table-pane') &&
        tl.nextElementSibling.classList.contains('proj-gantt-pane');
}, TL));
await page.evaluate((i) => setToolMode(i, 'edit'), id);
await page.waitForTimeout(200);
ok('with the table alone there is nothing to divide, and no timeline', !(await page.isVisible(TL)));
await page.evaluate((i) => setToolMode(i, 'render'), id);
await page.waitForTimeout(200);
ok('nor with the chart alone', !(await page.isVisible(TL)));
await page.evaluate((i) => setToolMode(i, 'split'), id);
await page.waitForTimeout(300);

// 2. A calendar year, thirteen-week quarters.
let q = await segs('quarters'), h = await segs('halves');
ok('the quarters: the one before, the one now, the day left over, and the three after', brief(q) ===
    '2026 Q3 2026-07-02..2026-09-30 [past] | 2026 Q4 2026-10-01..2026-12-30 [now] | 2026 Q5 2026-12-31..2026-12-31 [leftover] | ' +
    '2027 Q1 2027-01-01..2027-04-01 | 2027 Q2 2027-04-02..2027-07-01 | 2027 Q3 2027-07-02..2027-09-30', brief(q));
ok('the halves: the one now, H2 holding the day left over, and the next', brief(h) === '2026 H2 2026-07-02..2026-12-31 [now] | 2027 H1 2027-01-01..2027-07-01', brief(h));
ok('each period says its first and last day', await page.evaluate((s) => {
    const n = document.querySelector(s + ' .proj-tl-row.quarters .proj-tl-seg.now');
    return n.querySelector('.proj-tl-name').textContent === '2026 Q4' && n.querySelectorAll('.proj-tl-edge')[0].textContent === 'Oct 1' && n.querySelectorAll('.proj-tl-edge')[1].textContent === 'Dec 30';
}, TL));
ok('and in full on hover', q[1].title === '2026 Q4 (now): Oct 1, 2026 – Dec 30, 2026, 91 days', q[1].title);
ok('the day left over is a sliver, saying what it is', q[2].cls === 'leftover' && /1 day outside any quarter \(the chart.s Q5\), counted in the year.s second half/.test(q[2].title), q[2].title);
const span = (Date.UTC(2027, 8, 30) - Date.UTC(2026, 6, 2)) / 864e5 + 1;
ok('to scale: a quarter as wide as its days', Math.abs(q[1].width - 91 / span * 100) < 0.01 && Math.abs(q[2].width - 1 / span * 100) < 0.01, q[1].width + ' ' + span);
ok('and where its days are', Math.abs(q[1].left - (Date.UTC(2026, 9, 1) - Date.UTC(2026, 6, 2)) / 864e5 / span * 100) < 0.01);
const today = await page.evaluate((s) => parseFloat(document.querySelector(s + ' .proj-tl-today').style.left), TL);
ok('a line for today, inside the quarter it is in', today > q[1].left && today < q[1].left + q[1].width, String(today));
const todayLabel = await page.evaluate((s) => { const l = document.querySelector(s + ' .proj-axis .proj-today-label'); return { text: l.textContent, title: l.title }; }, T);
ok('the chart’s today label carries the date beside it', todayLabel.text === 'today Oct 31' && todayLabel.title === 'Today: Oct 31, 2026', JSON.stringify(todayLabel));

// 2b. Under the quarters, their timeboxes and sprints: two six-week timeboxes of three
// fortnights, then the planning week, each counted inside its parent.
const tb = await segs('timeboxes'), sp = await segs('sprints');
const q4 = (list) => brief(list.filter(s => s.name.startsWith('2026 Q4')));
ok('the timeboxes of a quarter, and its planning week', q4(tb) ===
    '2026 Q4 T1 2026-10-01..2026-11-11 [now] | 2026 Q4 T2 2026-11-12..2026-12-23 | 2026 Q4 planning week 2026-12-24..2026-12-30 [planning]', q4(tb));
ok('the sprints of each timebox, counted again from 1 in each', q4(sp) ===
    '2026 Q4 T1 S1 2026-10-01..2026-10-14 [past] | 2026 Q4 T1 S2 2026-10-15..2026-10-28 [past] | 2026 Q4 T1 S3 2026-10-29..2026-11-11 [now] | ' +
    '2026 Q4 T2 S1 2026-11-12..2026-11-25 | 2026 Q4 T2 S2 2026-11-26..2026-12-09 | 2026 Q4 T2 S3 2026-12-10..2026-12-23 | ' +
    '2026 Q4 planning week 2026-12-24..2026-12-30 [planning]', q4(sp));
ok('every quarter drawn is divided, and the day left over is not', tb.filter(s => !s.cls.includes('planning')).length === 2 * 5 &&
    !tb.concat(sp).some(s => s.start === '2026-12-31'), brief(tb));
ok('in full on hover', sp.find(s => s.name === '2026 Q4 T1 S3').title === '2026 Q4 T1 S3 (now): Oct 29, 2026 – Nov 11, 2026, 14 days');
const shown = await page.evaluate((s) => {
    const vis = (e) => e && getComputedStyle(e).display !== 'none';
    const seg = (row, name) => Array.from(document.querySelectorAll(s + ' .proj-tl-row.' + row + ' .proj-tl-seg')).find(e => e.dataset.name === name);
    const sprint = seg('sprints', '2026 Q4 T1 S3'), quarter = seg('quarters', '2026 Q4');
    return { sprintName: sprint.querySelector('.proj-tl-name').textContent, sprintNameShown: vis(sprint.querySelector('.proj-tl-name')),
        sprintDates: vis(sprint.querySelector('.proj-tl-edge')), quarterDates: vis(quarter.querySelector('.proj-tl-edge')), width: sprint.getBoundingClientRect().width };
}, TL);
ok('a sprint as narrow as a year-wide view makes it is just its name; a quarter keeps its dates', shown.sprintName === 'S3' && shown.sprintNameShown &&
    !shown.sprintDates && shown.quarterDates, JSON.stringify(shown));

// 3. Copy.
await page.hover(TL);
await page.click(TL + ' .proj-tl-copy');
await page.waitForTimeout(200);
const copied = await page.evaluate(() => navigator.clipboard.readText());
ok('Copy gives the quarters and halves, now marked', copied === [
    '2026 Q4: 2026-10-01 – 2026-12-30 (91 days, now)', '2027 Q1: 2027-01-01 – 2027-04-01 (91 days)', '2027 Q2: 2027-04-02 – 2027-07-01 (91 days)',
    '2027 Q3: 2027-07-02 – 2027-09-30 (91 days)', '2026 H2: 2026-07-02 – 2026-12-31 (183 days, now)', '2027 H1: 2027-01-01 – 2027-07-01 (182 days)',
    '2026 Q4 T1: 2026-10-01 – 2026-11-11 (42 days, now)', '2026 Q4 T2: 2026-11-12 – 2026-12-23 (42 days)',
    '2026 Q4 T1 S3: 2026-10-29 – 2026-11-11 (14 days, now)', '2026 Q4 T2 S1: 2026-11-12 – 2026-11-25 (14 days)', '2026 Q4 T2 S2: 2026-11-26 – 2026-12-09 (14 days)',
    '2026 Q4 T2 S3: 2026-12-10 – 2026-12-23 (14 days)', '2026 Q4 planning week: 2026-12-24 – 2026-12-30 (7 days)'].join('\n'), copied);
ok('and pressing it does not move the divider', (await page.evaluate((i) => (toolCustomizations[i] || {}).projSplit, id)) === undefined);

// 3b. The chart's span: fitted to the plan, or matched to the timeline so each date
// sits under the same date above.
const spanState = () => page.evaluate((s) => {
    const w = document.querySelector(s + '.proj-widget');
    const tl = w.querySelector('.proj-timeline'), rows = tl.querySelector('.proj-tl-rows'), axis = w.querySelector('.proj-gantt-pane .proj-axis');
    const r = rows.getBoundingClientRect(), a = axis.getBoundingClientRect();
    const pick = w.querySelector('.proj-span-pick');
    const tlToday = tl.querySelector('.proj-tl-today').getBoundingClientRect().left;
    const chToday = axis.querySelector('.proj-today').getBoundingClientRect().left;
    const q1 = Array.from(tl.querySelectorAll('.proj-tl-row.quarters .proj-tl-seg')).find(e => e.dataset.name === '2027 Q1').getBoundingClientRect().left;
    const m = tl._model, spanDays = (m.to - m.from) / 864e5 + 1;
    const chartQ1 = a.left + ((Date.UTC(2027, 0, 1) - m.from) / 864e5 / spanDays) * a.width;
    return { matched: w.classList.contains('proj-span-matched'), shown: !!pick && getComputedStyle(pick).display !== 'none',
        pressed: pick ? pick.querySelector('[aria-pressed="true"]').dataset.span : null,
        left: r.left - a.left, right: r.right - a.right, today: tlToday - chToday, q1: q1 - chartQ1, inline: rows.style.left };
}, T);
let st = await spanState();
ok('by default the chart fits the plan, and the timeline keeps its full width', !st.matched && st.shown && st.pressed === 'fit' && st.inline === '', JSON.stringify(st));
await page.click(T + '.proj-span-pick [data-span="periods"]');
await page.waitForTimeout(300);
st = await spanState();
ok('Match periods: saved with the table', (await page.evaluate((i) => projUnits(projGetData(i)).chartSpan, id)) === 'periods' && st.pressed === 'periods' && st.matched);
ok('the timeline sits over the chart’s bars, edge to edge', Math.abs(st.left) < 1 && Math.abs(st.right) < 1, JSON.stringify(st));
ok('today is in the same place above and below', Math.abs(st.today) < 2.5, String(st.today));
ok('and so is a quarter’s first day', Math.abs(st.q1) < 1.5, String(st.q1));
await page.evaluate((i) => {
    const d = projGetData(i);
    d.sizes = Object.assign({}, d.sizes, { L: 600 });
    d.rows.find(r => r.id === 'r-launch').cells.deadline = '2028-06-01';
    projSetData(i, d);
    projRender(document.querySelector('.tool[data-tool="' + i + '"] .proj-widget'), i);
}, id);
await page.waitForTimeout(300);
const clipped = await page.evaluate((s) => {
    const rows = Array.from(document.querySelectorAll(s + '.proj-gantt-row'));
    const row = (name) => rows.find(r => r.querySelector('.proj-gantt-name').textContent === name);
    const bar = (name) => row(name).querySelector('.proj-bar');
    return { build: bar('Build').className, buildTitle: bar('Build').title, buildEnd: parseFloat(bar('Build').style.left) + parseFloat(bar('Build').style.width),
        launch: bar('Launch').className, deadline: row('Launch').querySelector('.proj-deadline').className, when: row('Launch').querySelector('.proj-gantt-when').textContent };
}, T);
ok('work that runs past the timeline is cut at its edge, and says so', /proj-bar-cut/.test(clipped.build) && Math.abs(clipped.buildEnd - 100) < 0.01 &&
    /runs past the end of the timeline/.test(clipped.buildTitle), JSON.stringify(clipped));
ok('work that starts after it is a mark at the edge; a deadline after it too', /proj-bar-beyond/.test(clipped.launch) && /proj-deadline-after/.test(clipped.deadline), JSON.stringify(clipped));
ok('the row still says its own dates', /2028|\d\d-\d\d/.test(clipped.when), clipped.when);
await page.evaluate((i) => setToolMode(i, 'render'), id);
await page.waitForTimeout(300);
st = await page.evaluate((s) => ({ matched: document.querySelector(s + '.proj-widget').classList.contains('proj-span-matched'),
    shown: getComputedStyle(document.querySelector(s + '.proj-span-pick')).display !== 'none' }), T);
ok('with the chart alone there is no timeline to match: no switch, and the chart fits the plan', !st.matched && !st.shown, JSON.stringify(st));
await page.evaluate((i) => setToolMode(i, 'split'), id);
await page.waitForTimeout(300);
ok('back in Both, matched again', (await spanState()).matched);
await page.waitForTimeout(700);
await page.click(T + '.proj-span-pick [data-span="fit"]');
await page.waitForTimeout(300);
st = await spanState();
ok('Fit to plan: the timeline has its full width back', !st.matched && st.inline === '' && st.pressed === 'fit', JSON.stringify(st));
await page.waitForTimeout(700);
await page.evaluate(() => undoLast());
await page.waitForTimeout(400);
ok('and the switch is undone like any other change', (await page.evaluate((i) => projUnits(projGetData(i)).chartSpan, id)) === 'periods' && (await spanState()).matched);
await page.evaluate((i) => {
    const d = projGetData(i);
    d.rows = projSeedData().rows; d.sizes = projSeedData().sizes;
    d.units = Object.assign({}, projUnits(d), { chartSpan: 'fit' });
    projSetData(i, d);
    projRender(document.querySelector('.tool[data-tool="' + i + '"] .proj-widget'), i);
}, id);
await page.waitForTimeout(300);

// 4. Counted as the chart counts: a fiscal year, a start of one's own, another ladder.
await setUnits({ yearMode: 'fiscal', fiscalStartMonth: 10 });
q = await segs('quarters'); h = await segs('halves');
ok('a fiscal year from October: FY27 has begun, its Q1 now', q.find(s => s.cls.includes('now')).name === 'FY27 Q1' &&
    q.find(s => s.name === 'FY27 Q1').start === '2026-10-01' && q.find(s => s.name === 'FY27 Q1').end === '2026-12-30', brief(q));
ok('and its halves', brief(h).startsWith('FY27 H1 2026-10-01..2027-03-31 [now] | FY27 H2 2027-04-01..2027-09-30'), brief(h));
await setUnits({ yearMode: 'calendar', periodStart: '2026-10-05' });
q = await segs('quarters');
ok('a start of its own: Q1 begins on it', q.some(s => s.start === '2026-10-05' && s.end === '2027-01-03' && s.cls.includes('now')), brief(q));
await setUnits({ periodStart: '', planningWeeks: 0 });
q = await segs('quarters');
ok('twelve-week quarters leave a month over, shown as it is', q.some(s => s.cls === 'leftover' && s.start === '2026-12-03' && s.end === '2026-12-31') &&
    q.find(s => s.cls.includes('now')).name === '2026 Q4', brief(q));
// The strip folds away with the other settings; changed there, the way its select does.
await page.evaluate((s) => { const el = document.querySelector(s); el.value = 'fiscal'; projOnUnit(el); }, T + '.proj-unit-select[data-unit="yearMode"]');
await page.waitForTimeout(300);
ok('changed in the settings strip, it follows at once', (await segs('quarters')).some(s => /^FY\d\d Q/.test(s.name)));
await setUnits({ yearMode: 'calendar', planningWeeks: 1 });
await setUnits({ sprintsPerTimebox: 2, timeboxesPerQuarter: 3 });
const tb3 = await segs('timeboxes'), sp3 = await segs('sprints');
ok('another ladder: three four-week timeboxes of two sprints', q4(tb3) ===
    '2026 Q4 T1 2026-10-01..2026-10-28 [past] | 2026 Q4 T2 2026-10-29..2026-11-25 [now] | 2026 Q4 T3 2026-11-26..2026-12-23 | 2026 Q4 planning week 2026-12-24..2026-12-30 [planning]', q4(tb3));
ok('and the sprint now is T2 S1', sp3.find(s => s.cls.includes('now')).name === '2026 Q4 T2 S1', brief(sp3.filter(s => s.cls.includes('now'))));
await setUnits({ sprintsPerTimebox: 3, timeboxesPerQuarter: 2, planningWeeks: 0 });
ok('with no planning week, none is drawn', !(await segs('timeboxes')).some(s => s.cls.includes('planning')) && !(await segs('sprints')).some(s => s.cls.includes('planning')));
await setUnits({ planningWeeks: 1 });

// 5. The divider.
const heights = () => page.evaluate((s) => [document.querySelector(s + ' .proj-table-pane').getBoundingClientRect().height,
    document.querySelector(s + ' .proj-gantt-pane').getBoundingClientRect().height], T);
const [t0, g0] = await heights();
ok('the panes start at 58 to 42', Math.abs(t0 / (t0 + g0) - 0.58) < 0.02, (t0 / (t0 + g0)).toFixed(3));
const box = await page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x + 20, y: r.y + r.height / 2 }; }, TL);
await page.mouse.move(box.x, box.y);
await page.mouse.down();
await page.mouse.move(box.x, box.y - 120, { steps: 6 });
await page.mouse.up();
await page.waitForTimeout(200);
const [t1, g1] = await heights();
ok('dragged up, the table shrinks and the chart grows by as much', t1 < t0 - 100 && g1 > g0 + 100 && Math.abs((t1 + g1) - (t0 + g0)) < 3, [t0, t1, g0, g1].map(Math.round).join(' '));
const kept = await page.evaluate((i) => toolCustomizations[i].projSplit, id);
ok('and the share is kept with the tool', kept > 0.12 && kept < 0.5, String(kept));
await page.evaluate((i) => projRender(document.querySelector('.tool[data-tool="' + i + '"] .proj-widget'), i), id);
await page.waitForTimeout(200);
ok('drawn again, it stays where it was put', Math.abs((await heights())[0] - t1) < 3);
await page.focus(TL);
await page.keyboard.press('ArrowDown');
await page.waitForTimeout(100);
ok('↓ on it moves it down a step', Math.abs(await page.evaluate((i) => toolCustomizations[i].projSplit, id) - (Math.round((kept + 0.05) * 100) / 100)) < 0.001);
await page.keyboard.press('End');
ok('End to the lowest it goes', await page.evaluate((i) => toolCustomizations[i].projSplit, id) === 0.88);
await page.keyboard.press('Home');
ok('Home to the highest', await page.evaluate((i) => toolCustomizations[i].projSplit, id) === 0.12);
ok('neither pane is ever squeezed to nothing', (await heights()).every(x => x > 30), (await heights()).join(' '));
await page.dblclick(TL, { position: { x: 20, y: 10 } });
await page.waitForTimeout(200);
const [t2, g2] = await heights();
ok('a double-click puts it back, and forgets the share', Math.abs(t2 / (t2 + g2) - 0.58) < 0.02 && (await page.evaluate((i) => (toolCustomizations[i] || {}).projSplit, id)) === undefined);
ok('said for a screen reader: a separator, and how to move it', await page.getAttribute(TL, 'role') === 'separator' && /drag, or ↑ and ↓/.test(await page.getAttribute(TL, 'aria-label')));

const compact = await page.evaluate(async (i) => {
    const t = document.querySelector('.tool[data-tool="' + i + '"]');
    const before = t.style.height;
    t.style.height = '300px';
    await new Promise(r => setTimeout(r, 150));
    const tl = t.querySelector('.proj-timeline');
    const small = tl.classList.contains('proj-tl-compact') && tl.getBoundingClientRect().height < 12 && getComputedStyle(tl.querySelector('.proj-tl-rows')).display === 'none';
    t.style.height = before;
    await new Promise(r => setTimeout(r, 150));
    return small && !tl.classList.contains('proj-tl-compact');
}, id);
ok('in a window too short for the dates, it is a thin divider; given room again, the dates come back', compact);
const short = await page.evaluate(async (i) => {
    const t = document.querySelector('.tool[data-tool="' + i + '"]');
    const before = t.style.height;
    const rows = (tl) => ['halves', 'quarters', 'timeboxes', 'sprints'].map(r => getComputedStyle(tl.querySelector('.proj-tl-row.' + r)).display !== 'none');
    const tl = t.querySelector('.proj-timeline');
    const full = rows(tl);
    t.style.height = '420px';
    await new Promise(r => setTimeout(r, 150));
    const mid = rows(tl), midH = tl.getBoundingClientRect().height;
    t.style.height = before;
    await new Promise(r => setTimeout(r, 150));
    return { full: full.join(), mid: mid.join(), midH: midH, after: rows(tl).join() };
}, id);
ok('given less room, the timeboxes and sprints go first, and the halves and quarters stay', short.full === 'true,true,true,true' &&
    short.mid === 'true,true,false,false' && short.midH < 62 && short.after === short.full, JSON.stringify(short));
// The chart does not scroll sideways because of its own labels: the last one, centred
// on a day near the edge, used to stick out by half its width whatever the axis.
const overflow = () => page.evaluate((i) => {
    const out = [];
    const w = document.querySelector('.tool[data-tool="' + i + '"] .proj-widget');
    for (const axis of ['dates', 'sprints', 'timeboxes', 'quarters']) {
        const d = projGetData(i);
        d.units = Object.assign({}, projUnits(d), { axis });
        projSetData(i, d);
        projRender(w, i);
        const s = w.querySelector('.proj-gantt-scroll');
        out.push(axis + ' ' + (s.scrollWidth - s.clientWidth));
    }
    return out.join(', ');
}, id);
ok('in every axis, the chart fits its pane: nothing to scroll sideways', /^dates 0, sprints 0, timeboxes 0, quarters 0$/.test(await overflow()), await overflow());
await page.evaluate((i) => { document.querySelector('.tool[data-tool="' + i + '"]').style.width = '640px'; }, id);
await page.waitForTimeout(300);
ok('nor when the window is narrower', /^dates 0, sprints 0, timeboxes 0, quarters 0$/.test(await overflow()), await overflow());
ok('and the last label is still there, ending at the edge', await page.evaluate((i) => {
    const axis = document.querySelector('.tool[data-tool="' + i + '"] .proj-axis');
    const ticks = Array.from(axis.querySelectorAll('.proj-tick')).filter(t => t.style.visibility !== 'hidden');
    const last = ticks[ticks.length - 1].getBoundingClientRect();
    return last.right <= axis.getBoundingClientRect().right + 0.5;
}, id));
await page.evaluate((i) => { const d = projGetData(i); d.units = Object.assign({}, projUnits(d), { axis: 'dates' }); projSetData(i, d);
    document.querySelector('.tool[data-tool="' + i + '"]').style.width = ''; projRender(document.querySelector('.tool[data-tool="' + i + '"] .proj-widget'), i); }, id);
await page.waitForTimeout(300);
await page.screenshot({ path: OUT + '/project-periods.png' });
await page.evaluate(() => document.body.classList.add('dark-mode'));
await page.waitForTimeout(150);
await page.screenshot({ path: OUT + '/project-periods-dark.png' });
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
