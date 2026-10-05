// The project table, and the chart it implies. Three things carry most of the risk
// and most of these assertions: the calculated columns, which are the reason to use
// the tool at all; the chart's scheduling, where a dependency moves a bar and a
// dependency loop must not hang it; and typing, because a table that re-renders on
// every keystroke takes the caret with it and can only be filled in one character
// at a time.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:8777/index.html#tool/project-table');
await page.waitForSelector('.proj-widget', { timeout: 25000 });
await page.waitForTimeout(1500);

const toolId = await page.evaluate(() =>
    document.querySelector('.proj-widget').closest('.tool').getAttribute('data-tool'));
const sel = (s) => '.tool[data-tool="' + toolId + '"] ' + s;
const data = () => page.evaluate((id) => JSON.parse(JSON.stringify(projGetData(id))), toolId);

/** Set a cell the way the page does, so the handler under test is the one that runs. */
const setCell = async (rowIndex, colId, value) => {
    const d = await data();
    const q = sel('tr[data-row="' + d.rows[rowIndex].id + '"] [data-col="' + colId + '"]');
    const tag = await page.evaluate((s) => (document.querySelector(s) || {}).tagName, q);
    if (tag === 'SELECT') await page.selectOption(q, String(value));
    else await page.fill(q, String(value));
    await page.waitForTimeout(250);
};

const calcText = (rowIndex) => page.evaluate((i) =>
    [...document.querySelectorAll('.proj-table tbody tr')[i].querySelectorAll('.proj-calc')]
        .map(c => c.textContent.trim()), rowIndex);

// 1. What a new one is.
ok('the tool opens from its own link', await page.evaluate(() => !!document.querySelector('.proj-widget')),
    JSON.stringify(errors).slice(0, 120));
const headings = () => page.evaluate(() =>
    [...document.querySelectorAll('.proj-table thead .proj-col-title')].map(i => i.textContent).join(','));
// Left to right: what it is, what it waits for, how big, how far along, when it
// runs, what that comes to, when it is due and how that compares.
// Title is here too, folded away, so it has no heading to read until section 14e
// unfolds it — a folded column is a strip with its name on its side.
const PROJ_COLS = 16;
ok('with the columns asked for, in the order asked for', (await headings()) ===
    'ID,Ticket,Task,Dependencies,Size,% Done,Start,End,Total,Left,Deadline,Slack,Assigned,Notes,Links',
    await headings());
ok('and the one that is folded to begin with is there, just not open',
    (await data()).columns.length === PROJ_COLS &&
    (await data()).columns[3].id === 'title', String((await data()).columns.length));
// The settings start folded — what somebody opens a plan for is the plan — and most
// of what follows is set from those strips, so they are unfolded once, here.
ok('the settings start folded away', (await data()).hideSettings === true,
    String((await data()).hideSettings));
ok('and the toggle is how they come back', await page.evaluate(() =>
    !!document.querySelector('.proj-settings-toggle')));
await page.click(sel('.proj-settings-toggle'));
await page.waitForTimeout(350);

const sizeStrip = () => page.evaluate(() =>
    [...document.querySelectorAll('.proj-sizes .proj-size-field input')].map(i => i.value).join(','));
ok('and the preconfigured size table, lined up with the ladder, with O and ? either side',
    (await sizeStrip()) === '0,0.5,1,3,5,10,30,60,120,240,0', await sizeStrip());
const rungs = () => page.evaluate(() =>
    [...document.querySelectorAll('.proj-units input[type="number"]')].map(i => i.value).join(','));
ok('and the ladder, each rung counted in the one below it', (await rungs()) === '7,2,3,2,1', await rungs());
// Two timeboxes of three sprints come to twelve weeks; the calendar's quarter is
// thirteen. The week that makes up the difference is the planning week, and it is
// part of the quarter rather than an extra beside it.
ok('which comes to a 7-day week, a fortnight sprint, a 42-day timebox and a 91-day quarter',
    JSON.stringify(await page.evaluate((id) => projUnitDays(projUnits(projGetData(id))), toolId)) ===
    JSON.stringify({ day: 1, week: 7, sprint: 14, timebox: 42, planning: 7, quarter: 91 }),
    JSON.stringify(await page.evaluate((id) => projUnitDays(projUnits(projGetData(id))), toolId)));
ok('so a quarter is the calendar\'s thirteen weeks, not the ladder\'s twelve',
    await page.evaluate((id) => projUnitDays(projUnits(projGetData(id))).quarter, toolId) === 13 * 7);
ok('with no weekend to skip, since the week already runs through it',
    (await data()).units.skipWeekends === false, String((await data()).units.skipWeekends));
ok('it arrives with a worked example rather than an empty grid',
    (await data()).rows.length === 3, String((await data()).rows.length));
// The chart is half of what the tool is for, so it is on when the tool opens.
ok('and opens showing both the table and the chart', await page.evaluate((id) =>
    document.querySelector('.tool[data-tool="' + id + '"]').classList.contains('authoring-split'), toolId),
    await page.evaluate((id) =>
        document.querySelector('.tool[data-tool="' + id + '"]').className, toolId));
ok('with the chart drawn, not merely allotted room', await page.evaluate(() =>
    document.querySelectorAll('.proj-gantt-row:not(.proj-plan-row) .proj-bar').length) === 3,
    String(await page.evaluate(() => document.querySelectorAll('.proj-gantt-row:not(.proj-plan-row) .proj-bar').length)));

// 2. The calculated columns. Total comes from the size table, Remaining from the
//    completion, and Slack from the deadline — each only from what it says.
ok('Total Days is the size table\'s number for that size', (await calcText(0))[0] === '10 d', (await calcText(0))[0]);
ok('Remaining Days discounts the completed part', (await calcText(0))[1] === '4 d', (await calcText(0))[1]);
// Sizes and the ladder are both in days and neither is derived from the other: the
// size says how much work there is, the ladder how the calendar is cut up. They were
// lined up once, and a ladder of calendar weeks has moved out from under them.
ok('the size table is read for that number, not the ladder',
    (await calcText(0))[0] === '10 d' && (await page.evaluate((id) =>
        projUnitDays(projUnits(projGetData(id))).sprint, toolId)) === 14, (await calcText(0))[0]);

await setCell(0, 'pct', 25);
ok('changing the completion changes Remaining, not Total',
    (await calcText(0))[0] === '10 d' && (await calcText(0))[1] === '7.5 d', JSON.stringify(await calcText(0)));

await setCell(0, 'size', 'XL');
await page.waitForTimeout(250);
ok('changing the size changes both', (await calcText(0))[0] === '60 d' && (await calcText(0))[1] === '45 d',
    JSON.stringify(await calcText(0)));

// Editing the size table itself moves every row that uses that size.
await page.fill(sel('.proj-size-field input[data-size="XL"]'), '100');
await page.waitForTimeout(300);
ok('editing days-per-size re-does the arithmetic underneath', (await calcText(0))[0] === '100 d',
    (await calcText(0))[0]);
await page.fill(sel('.proj-size-field input[data-size="XL"]'), '60');
await page.waitForTimeout(300);

// 3. Slack, at its boundaries. Ten days of work left, and a deadline walked back
//    across each band in turn.
const iso = (days) => page.evaluate((n) => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    return new Date(d.getTime() + n * 86400000).toISOString().slice(0, 10);
}, days);

// Weekends off for this part: the bands are what is under test, and a working
// week shifts every finish date by an amount that depends on what day today is.
// The working week gets its own section, further down.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.units = { ...projUnits(dd), skipWeekends: false };
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(300);
await setCell(0, 'size', 'M');       // 10 days: a sprint, out of the box
await setCell(0, 'pct', 0);          // 10 remaining
const slackFor = async (deadlineDays) => {
    await setCell(0, 'deadline', await iso(deadlineDays));
    const cell = await page.evaluate(() => {
        const c = [...document.querySelectorAll('.proj-table tbody tr')[0].querySelectorAll('.proj-calc')][2];
        return { text: c.textContent.trim(), color: c.style.color };
    });
    return cell;
};
// Ten days of work starting today occupies days 0 to 9, so it is still being worked
// on day 9 and the deadlines below are counted against that day — not against day
// 10, which is the day *after* the work and the day this used to measure to.
let slack = await slackFor(30);
ok('a deadline well past the finish is comfortable, and says so',
    slack.text === '✓ +21 d' && /proj-good/.test(slack.color), JSON.stringify(slack));
slack = await slackFor(12);
ok('three days spare is a warning', slack.text === '▲ +3 d' && /proj-warning/.test(slack.color), JSON.stringify(slack));
slack = await slackFor(10);
ok('one day spare is more serious', slack.text === '▲ +1 d' && /proj-serious/.test(slack.color), JSON.stringify(slack));
slack = await slackFor(4);
ok('and a deadline before the finish is critical, with the shortfall named',
    slack.text === '● -5 d' && /proj-critical/.test(slack.color), JSON.stringify(slack));
ok('the colour never carries it alone — there is a mark and a number either way',
    /^[●▲✓] [+-]?\d+ d$/.test(slack.text), slack.text);

// The one that was wrong, and the reason the numbers above moved by a day. A
// deadline names a day the work is allowed to be happening on, so a row that is
// still being worked on that day has met it with nothing to spare — it is not a day
// late, which is what every row in a plan that exactly fits used to read as.
slack = await slackFor(9);
ok('a row that finishes on the day it is due has no room, and is not late',
    slack.text === '▲ 0 d' && /proj-serious/.test(slack.color), JSON.stringify(slack));
ok('and the Slack column agrees with the End column about which day that is',
    await page.evaluate((id) => {
        const dd = projGetData(id);
        const row = dd.rows[0];
        const end = projParseDate(projRowDates(dd, row).end);
        const due = projParseDate(projCell(row, 'deadline'));
        return projSlackDays(dd, row) === Math.round((due - end) / PROJ_DAY);
    }, toolId));
ok('and the chart does not mark that deadline as missed either',
    await page.evaluate(() => !document.querySelector('.proj-deadline.proj-missed')),
    await page.evaluate(() => document.querySelectorAll('.proj-deadline.proj-missed').length + ' missed'));
slack = await slackFor(8);
ok('while a day earlier than that really is a day late',
    slack.text === '● -1 d' && /proj-critical/.test(slack.color), JSON.stringify(slack));
ok('and the chart marks that one', await page.evaluate(() =>
    !!document.querySelector('.proj-deadline.proj-missed')));

await setCell(0, 'deadline', '');
ok('and no deadline reads as nothing rather than as late', (await calcText(0))[2] === '—', (await calcText(0))[2]);

// 4. The colour of a size is its position in the scale, not a free choice.
await setCell(0, 'size', 'XS');
await page.waitForTimeout(250);
const sizeControl = () => page.evaluate(() => {
    const el = document.querySelector('.proj-table tbody tr .proj-size-select');
    return { tag: el.tagName, bg: el.style.background, text: el.options[el.selectedIndex].textContent,
             chips: document.querySelectorAll('.proj-table tbody tr .proj-chip').length };
});
ok('the size is one control, not a chip beside a dropdown',
    (await sizeControl()).tag === 'SELECT' && (await sizeControl()).chips === 0,
    JSON.stringify(await sizeControl()));
ok('XS takes the first step of the ramp', /--proj-size-1/.test((await sizeControl()).bg),
    (await sizeControl()).bg);
ok('and the control says XS as well as showing it — the label is what makes green→red safe',
    (await sizeControl()).text === 'XS', (await sizeControl()).text);
await setCell(0, 'size', 'XL');
await page.waitForTimeout(250);
ok('and XL the fifth', /--proj-size-5/.test((await sizeControl()).bg), (await sizeControl()).bg);

await setCell(0, 'pct', 90);
ok('the progress bar fills to the completion', await page.evaluate(() =>
    document.querySelector('.proj-table tbody tr .proj-bar-fill').style.width) === '90%',
    await page.evaluate(() => document.querySelector('.proj-table tbody tr .proj-bar-fill').style.width));
ok('an almost-finished bar is at the green end, where size XL is at the red end',
    await page.evaluate(() => document.querySelector('.proj-table tbody tr .proj-bar-fill').style.background)
        === 'var(--proj-size-1)',
    await page.evaluate(() => document.querySelector('.proj-table tbody tr .proj-bar-fill').style.background));
// Measured, not declared: the fill once had its width and its colour and no height,
// which every assertion about style.width happily passed.
ok('and is actually drawn — a fill with no height is not a progress bar',
    await page.evaluate(() => {
        const r = document.querySelector('.proj-table tbody tr .proj-bar-fill').getBoundingClientRect();
        return r.height > 2 && r.width > 2;
    }), JSON.stringify(await page.evaluate(() => {
        const r = document.querySelector('.proj-table tbody tr .proj-bar-fill').getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
    })));

// 5. Typing. The regression this tool is most likely to grow: a re-render on every
//    keystroke, which empties the field after the first character.
const pctInput = sel('tr[data-row="' + (await data()).rows[0].id + '"] [data-col="pct"]');
await page.fill(pctInput, '');
await page.click(pctInput);
await page.keyboard.type('45');
await page.waitForTimeout(300);
ok('typing two digits leaves two digits in the field, and the focus in it',
    await page.inputValue(pctInput) === '45' &&
    await page.evaluate((s) => document.activeElement === document.querySelector(s), pctInput),
    await page.inputValue(pctInput));
ok('while the calculated columns kept up anyway', (await calcText(0))[1] === '33 d', (await calcText(0))[1]);

// 6. Rows and columns are the user's to make.
const before = (await data()).rows.length;
await page.click(sel('.proj-toolbar .proj-btn:has-text("+ Row")'));
await page.waitForTimeout(300);
ok('a row can be added', (await data()).rows.length === before + 1, String((await data()).rows.length));

await page.click(sel('.proj-toolbar .proj-btn:has-text("+ Column")'));
await page.waitForTimeout(300);
let d = await data();
ok('a column can be added', d.columns.length === PROJ_COLS + 1, String(d.columns.length));
const added = d.columns[d.columns.length - 1];
ok('and it is typed, with text as the sensible default',
    added.type === 'text' && !added.builtin, JSON.stringify(added));

await page.click(sel('.proj-col-title[data-col="' + added.id + '"]'));
await page.waitForTimeout(200);
await page.fill(sel('.proj-col-title-edit[data-col="' + added.id + '"]'), 'Owner');
await page.keyboard.press('Enter');
await page.waitForTimeout(400);
ok('a column can be renamed', (await data()).columns[d.columns.length - 1].title === 'Owner',
    (await data()).columns[d.columns.length - 1].title);
ok('and goes back to being a heading rather than staying a field',
    await page.evaluate(() => !document.querySelector('.proj-col-title-edit')));
await page.selectOption(sel('.proj-col-type[data-col="' + added.id + '"]'), 'date');
await page.waitForTimeout(300);
ok('and re-typed, which changes what its cells are',
    (await data()).columns[d.columns.length - 1].type === 'date' &&
    await page.evaluate((id) => !!document.querySelector('.proj-table tbody td input[data-col="' + id + '"][type="date"]'),
        added.id));

await page.click(sel('.proj-col-del[data-col="' + added.id + '"]'));
await page.waitForTimeout(300);
ok('a column can be deleted', (await data()).columns.length === PROJ_COLS, String((await data()).columns.length));

// Deleting a column takes the column away, not the values under it — so the
// arithmetic goes on working and putting the column back shows what was there.
await page.click(sel('.proj-col-del[data-col="size"]'));
await page.waitForTimeout(400);
ok('deleting the size column does not break the tool',
    !!(await page.$(sel('.proj-table'))) && (await data()).columns.length === PROJ_COLS - 1,
    String((await data()).columns.length));
ok('and the values under it survive, so Total Days still answers',
    (await calcText(0))[0] === '60 d', (await calcText(0))[0]);
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns.splice(0, 0, { id: 'size', title: 'TS-Size', type: 'size', builtin: true });
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
const sizeValue = () => page.evaluate(() =>
    (document.querySelector('.proj-table tbody tr .proj-size-select') || {}).value);
ok('putting the column back shows the value that was always there',
    (await sizeValue()) === 'XL', await sizeValue());

// 7. Links: read in the cell, edited in a window.
//
//    A label field, an address field and a cross, three to a line, in a column as
//    narrow as the rest of them, was three things fighting over sixty pixels.
d = await data();
const linkRow = 'tr[data-row="' + d.rows[0].id + '"]';
const linkOpener = sel(linkRow + ' .proj-chips .proj-pick-add[data-col="links"]');
const linkChips = () => page.evaluate((s) =>
    [...document.querySelectorAll(s)].map(a => ({ text: a.textContent, href: a.getAttribute('href') })),
    sel(linkRow + ' .proj-link-chip'));

ok('an empty links cell offers a + and nothing else',
    await page.evaluate((s) => !!document.querySelector(s), linkOpener) &&
    (await linkChips()).length === 0, JSON.stringify(await linkChips()));
await page.click(linkOpener);
await page.waitForTimeout(300);
ok('which opens a window, on the body where the tool cannot clip it',
    await page.evaluate(() => !!document.querySelector('.proj-modal') &&
        document.querySelector('.proj-modal').parentElement === document.body));
ok('headed with the column and the task it belongs to',
    (await page.evaluate(() => document.querySelector('.proj-modal-head span').textContent))
        .startsWith('Links \u2014'),
    await page.evaluate(() => document.querySelector('.proj-modal-head span').textContent));
ok('and says so plainly while there is nothing in it',
    /no links/i.test(await page.textContent('.proj-link-rows')),
    await page.textContent('.proj-link-rows'));

await page.click('.proj-link-add');
await page.waitForTimeout(250);
await page.click('.proj-link-add');
await page.waitForTimeout(250);
ok('a cell takes more than one link', (await data()).rows[0].cells.links.length === 2,
    JSON.stringify((await data()).rows[0].cells.links));
ok('each on its own line, with room for an address',
    await page.evaluate(() => {
        const rows = [...document.querySelectorAll('.proj-modal-link')];
        return rows.length === 2 &&
            rows[0].querySelector('.proj-modal-url').getBoundingClientRect().width > 200;
    }),
    String(await page.evaluate(() =>
        Math.round(document.querySelector('.proj-modal-url').getBoundingClientRect().width))));

await page.fill('.proj-modal-link[data-link="0"] .proj-modal-label', 'Spec');
await page.fill('.proj-modal-link[data-link="0"] .proj-modal-url', 'https://example.com/spec');
await page.waitForTimeout(300);
ok('each has its own label and address',
    (await data()).rows[0].cells.links[0].label === 'Spec' &&
    (await data()).rows[0].cells.links[0].url === 'https://example.com/spec',
    JSON.stringify((await data()).rows[0].cells.links[0]));
ok('and is openable from the window as soon as the address is one',
    await page.evaluate(() =>
        (document.querySelector('.proj-modal-link[data-link="0"] a') || {}).href ===
        'https://example.com/spec'),
    await page.evaluate(() =>
        (document.querySelector('.proj-modal-link[data-link="0"] a') || {}).href));
ok('while the window stays open under the typing',
    await page.evaluate(() => !!document.querySelector('.proj-modal')));

await page.click('.proj-modal-link[data-link="1"] .proj-x');
await page.waitForTimeout(300);
ok('and one can be removed without taking the other', (await data()).rows[0].cells.links.length === 1,
    JSON.stringify((await data()).rows[0].cells.links));

await page.keyboard.press('Escape');
await page.waitForTimeout(350);
ok('Escape closes the window', await page.evaluate(() => !document.querySelector('.proj-modal')));
ok('and the cell shows the link by name, as a link',
    (await linkChips()).length === 1 && (await linkChips())[0].text === 'Spec' &&
    (await linkChips())[0].href === 'https://example.com/spec', JSON.stringify(await linkChips()));

// A link with no label is still worth naming: where it goes.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows[0].cells.links = [
        { label: '', url: 'https://docs.example.com/a/b' },
        { label: 'Bad', url: 'javascript:alert(1)' }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('an unlabelled link is called where it goes',
    (await linkChips())[0].text === 'docs.example.com', JSON.stringify(await linkChips()));
ok('and an address that is not a web address is not made into one',
    await page.evaluate((s) => ({
        links: document.querySelectorAll(s + ' a.proj-link-chip').length,
        inert: document.querySelectorAll(s + ' .proj-link-blank').length
    }), sel(linkRow)).then(c => c.links === 1 && c.inert === 1),
    JSON.stringify(await page.evaluate((s) => ({
        links: document.querySelectorAll(s + ' a.proj-link-chip').length,
        inert: document.querySelectorAll(s + ' .proj-link-blank').length
    }), sel(linkRow))));

// 8. The chart. Dependencies guide it and nothing else.
const bars = () => page.evaluate(() => [...document.querySelectorAll('.proj-gantt-row:not(.proj-plan-row) .proj-bar')]
    .map(b => ({ left: parseFloat(b.style.left), width: parseFloat(b.style.width) })));
await page.evaluate((id) => setToolMode(id, 'split'), toolId);
await page.waitForTimeout(500);

// A clean three-link chain, built from scratch so the numbers are known.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.sizes = { XS: 5, S: 10, M: 20, L: 40, XL: 80 };
    // Straight calendar days here too: this section is about what dependencies do
    // to the chart, and a working week would move the numbers under it.
    dd.units = { ...projUnits(dd), skipWeekends: false };
    dd.rows = [
        { id: 'r-a', cells: { item: 'A', size: 'S', pct: 0, deps: [], links: [] } },
        { id: 'r-b', cells: { item: 'B', size: 'S', pct: 0, deps: ['r-a'], links: [] } },
        { id: 'r-c', cells: { item: 'C', size: 'S', pct: 50, deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

const sched = await page.evaluate((id) => projSchedule(projGetData(id)), toolId);
ok('a row with no dependencies starts today', sched['r-a'].start === 0, JSON.stringify(sched['r-a']));
ok('a row with one starts when that one finishes', sched['r-b'].start === 10, JSON.stringify(sched['r-b']));
ok('a bar is the work left, not the work there ever was',
    sched['r-c'].days === 5 && sched['r-c'].start === 0, JSON.stringify(sched['r-c']));
const bb = await bars();
ok('and the chart draws them in that order', bb[0].left < bb[1].left, JSON.stringify(bb));
ok('with equal work drawn equally wide', Math.abs(bb[0].width - bb[1].width) < 0.01, JSON.stringify(bb));

// A deadline the order of work cannot meet is marked, which is the only place the
// chart and the Slack column are allowed to disagree.
await page.evaluate(async (id) => {
    const dd = projGetData(id);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    dd.rows[1].cells.deadline = new Date(today.getTime() + 12 * 86400000).toISOString().slice(0, 10);
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('a deadline the sequence overshoots is marked on the chart',
    await page.evaluate(() => document.querySelectorAll('.proj-deadline.proj-missed').length) === 1,
    String(await page.evaluate(() => document.querySelectorAll('.proj-deadline.proj-missed').length)));
ok('while the Slack column still answers for the item on its own',
    (await calcText(1))[2] === '▲ +3 d', (await calcText(1))[2]);

// A finished row has no bar to draw, and must not simply vanish.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows[2].cells.pct = 100;
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('a finished item becomes a marker rather than nothing',
    await page.evaluate(() => document.querySelectorAll('.proj-done-dot').length) === 1 &&
    await page.evaluate(() => document.querySelectorAll('.proj-gantt-row:not(.proj-plan-row) .proj-bar').length) === 2);

// 9. A dependency loop is a contradiction, and must not hang the tool.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows[0].cells.deps = ['r-c'];
    dd.rows[2].cells.deps = ['r-a'];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(600);
ok('a dependency loop does not hang the chart', !!(await page.$(sel('.proj-gantt'))));
ok('it says so rather than drawing something convincing',
    await page.evaluate(() => !!document.querySelector('.proj-warn')),
    await page.evaluate(() => (document.querySelector('.proj-warn') || {}).textContent));
ok('and the rows in it are drawn from today',
    (await page.evaluate((id) => projSchedule(projGetData(id))['r-a'].start, toolId)) === 0);

// 10. It is all one key, so it travels with the board like any other tool's state.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows[0].cells.deps = [];
    dd.rows[2].cells.deps = [];
    dd.rows[0].cells.item = 'Kept';
    projSetData(id, dd);
}, toolId);
await page.reload();
await page.waitForSelector('.proj-widget', { timeout: 25000 });
await page.waitForTimeout(1500);
ok('the table comes back after a reload', (await data()).rows[0].cells.item === 'Kept',
    (await data()).rows[0].cells.item);
ok('and the chart with it', await page.evaluate(() => document.querySelectorAll('.proj-gantt-row:not(.proj-plan-row) .proj-bar').length) >= 1);
ok('the plan is one key, so an export carries the whole tool',
    await page.evaluate((id) => Object.keys(toolCustomizations[id]).filter(k =>
        k === 'sizes' || k === 'rows' || k === 'columns' || k === 'projectData').join(','), toolId) === 'projectData',
    await page.evaluate((id) => Object.keys(toolCustomizations[id]).join(','), toolId));
ok('beside it only the width it last fitted itself to, which is layout rather than plan',
    await page.evaluate((id) => Object.keys(toolCustomizations[id]).filter(k =>
        k.indexOf('proj') === 0).join(','), toolId) === 'projectData,projFitWidth',
    await page.evaluate((id) => Object.keys(toolCustomizations[id]).filter(k => k.indexOf('proj') === 0).join(','), toolId));

// 10b. A column is as wide as what is in it.
//
// Every column used to be exactly 154px — a text input in each heading reports a
// width of about twenty characters whatever it holds, and that one number decided
// them all. Total Days needs about 24px of digits.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows = [{ id: 'r-w', cells: { item: 'A', size: 'S', pct: 0, deadline: '', resources: '', deps: [], links: [], notes: '' } }];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);
const colWidths = await page.evaluate(() => {
    const out = {};
    [...document.querySelectorAll('.proj-table thead th')].forEach(th => {
        const t = th.querySelector('.proj-col-title');
        if (t) out[t.textContent] = Math.round(th.getBoundingClientRect().width);
    });
    return out;
});
ok('a column of short numbers is narrower than one of long text',
    colWidths['Total'] < colWidths['Dependencies'], JSON.stringify(colWidths));
ok('and no column is held open by its heading being a text field',
    colWidths['Total'] < 110, 'Total ' + colWidths['Total'] + 'px');
ok('the columns are not all the same width, which is what a shared floor looks like',
    new Set(Object.values(colWidths)).size > 4, JSON.stringify(colWidths));
// The default headings are short on purpose, so this renames one to something that
// is not: what is under test is that a heading wraps rather than holding its column
// open, and a table of short headings has nothing to say about it.
await page.evaluate((id) => {
    const dd = projGetData(id);
    const col = projColumn(dd, 'remaining');
    if (col) col.title = 'Days Of Work Left';
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
const longHead = () => page.evaluate(() => {
    const t = [...document.querySelectorAll('.proj-col-title')].find(e => e.textContent === 'Days Of Work Left');
    return { h: Math.round(t.getBoundingClientRect().height),
             w: Math.round(t.closest('th').getBoundingClientRect().width) };
});
ok('a long heading wraps instead of widening its column',
    (await longHead()).h > 14 && (await longHead()).w < 128, JSON.stringify(await longHead()));
await page.evaluate((id) => {
    const dd = projGetData(id);
    const col = projColumn(dd, 'remaining');
    if (col) col.title = 'Left';
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(300);

// 10c. Notes and Links grow with what is typed into them, up to a ceiling.
//
// The size is set when the table is drawn, and the cell being typed into is
// deliberately not redrawn — so a note used to grow invisibly inside a field the
// width it was when the row was last rendered.
// Cut to the three columns this is about: a field only grows into room the table
// has, and fourteen columns of plan leave the last of them none.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = dd.columns.filter(c => ['item', 'notes', 'links'].indexOf(c.id) >= 0);
    dd.rows = [{ id: 'r-grow', cells: { item: 'A', size: 'S', pct: 0, deadline: '', resources: '',
        notes: '', deps: [], links: [{ label: '', url: '' }] } }];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

const notesField = sel('tr[data-row="r-grow"] [data-col="notes"]');
const fieldWidth = (q) => page.evaluate((s) =>
    Math.round(document.querySelector(s).getBoundingClientRect().width), q);

await page.fill(notesField, 'short');
await page.waitForTimeout(250);
const small = await fieldWidth(notesField);
await page.fill(notesField, 'a note that runs on a good deal longer');
await page.waitForTimeout(250);
const grown = await fieldWidth(notesField);
ok('a note widens its field as it is typed, without the row being redrawn',
    grown > small, small + 'px then ' + grown + 'px');

await page.fill(notesField, 'x'.repeat(400));
await page.waitForTimeout(250);
const capped = await fieldWidth(notesField);
ok('and stops at a ceiling rather than taking over the table',
    capped === grown || Math.abs(capped - grown) < 40, grown + 'px then ' + capped + 'px');
await page.fill(notesField, 'short again');
await page.waitForTimeout(250);
ok('and narrows again when the text does', (await fieldWidth(notesField)) < capped,
    capped + 'px then ' + (await fieldWidth(notesField)) + 'px');

await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true }));
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);

// 10d. A note is prose, so the field has to take a second line — which an input
//      cannot do at all: Enter in one does nothing and the text stays one line.
ok('the notes cell is a textarea rather than a one-line input',
    await page.evaluate((s) => document.querySelector(s).tagName, notesField) === 'TEXTAREA',
    await page.evaluate((s) => document.querySelector(s).tagName, notesField));

const noteHeight = (q) => page.evaluate((s) =>
    Math.round(document.querySelector(s).getBoundingClientRect().height), q);
await page.fill(notesField, 'one line');
await page.waitForTimeout(250);
const oneLine = await noteHeight(notesField);
await page.fill(notesField, 'one line\nand a second\nand a third');
await page.waitForTimeout(250);
const threeLines = await noteHeight(notesField);
ok('three lines of note are stored with their line breaks',
    (await data()).rows[0].cells.notes === 'one line\nand a second\nand a third',
    JSON.stringify((await data()).rows[0].cells.notes));
ok('and the field grows taller to show them', threeLines > oneLine + 8,
    oneLine + 'px then ' + threeLines + 'px');
await page.fill(notesField, Array.from({ length: 20 }, (_, i) => 'line ' + i).join('\n'));
await page.waitForTimeout(250);
const manyLines = await noteHeight(notesField);
ok('but stops growing before one note owns the table',
    manyLines > threeLines && manyLines < oneLine * 8, threeLines + 'px then ' + manyLines + 'px');
ok('and the whole note is still there to scroll to',
    (await data()).rows[0].cells.notes.split('\n').length === 20,
    String((await data()).rows[0].cells.notes.split('\n').length));

// Typing into it keeps the caret, for the same reason as every other cell: the
// row must not be redrawn under it.
await page.fill(notesField, 'first line\n');
await page.click(notesField);
await page.keyboard.type('second');
await page.waitForTimeout(250);
const caret = await page.evaluate((s) => {
    const t = document.querySelector(s);
    return { active: document.activeElement === t, at: t.selectionStart, value: t.value };
}, notesField);
ok('typing a second line keeps the caret in the note',
    caret.active && caret.at === 'first line\nsecond'.length && caret.value === 'first line\nsecond',
    JSON.stringify(caret));

await page.fill(notesField, 'short again');
await page.waitForTimeout(250);
ok('and the field shrinks back when the lines go away',
    (await noteHeight(notesField)) <= oneLine + 2,
    oneLine + 'px then ' + (await noteHeight(notesField)) + 'px');

// A heading has room for two words; the rest of what a column means is a tooltip.
const headTitles = await page.evaluate(() => {
    const out = {};
    document.querySelectorAll('.proj-table thead .proj-col-title').forEach(t => {
        out[t.textContent] = t.getAttribute('title') || '';
    });
    return out;
});
ok('no two headings are the same words in a different order',
    new Set(Object.keys(headTitles).map(h => h.toLowerCase().split(/\s+/).sort().join(' '))).size ===
        Object.keys(headTitles).length, JSON.stringify(Object.keys(headTitles)));
// The headings are a word each, so the tooltip is where the difference between them
// is said: Total and Left are work, Slack is calendar room.
ok('each calculated heading explains itself on hover',
    /days of work still to do/i.test(headTitles['Left']) &&
    /the size implies/i.test(headTitles['Total']) &&
    /deadline/i.test(headTitles['Slack']),
    JSON.stringify([headTitles['Total'], headTitles['Left'], headTitles['Slack']]));
ok('and the one that compares two things says which two',
    /between the deadline and/i.test(headTitles['Slack']), headTitles['Slack']);
ok('and says where it stops, since a finished row has no number to read',
    /finished/i.test(headTitles['Slack']), headTitles['Slack']);
ok('while renaming is still offered there', /rename/i.test(headTitles['Task']), headTitles['Task']);

// 10e. Tickets. A row can be tracked in more than one place, and each ticket can
//      say what kind it is. The numbers are the row's, the address is the board's,
//      and a link exists only where the two of them make one.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.ticketBase = '';
    dd.rows = [{ id: 'r-tick', cells: { item: 'A', size: 'S', pct: 0, ticket: '', deps: [], links: [] } }];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

// The + is the only control in the cell now: two fields and a cross per ticket do
// not fit in a column this wide, so the editing is in a window, as links are.
const ticketPlus = sel('tr[data-row="r-tick"] button.proj-pick-add[data-col="ticket"]');
const chips = () => page.evaluate((s) => [...document.querySelectorAll(s)].map(c => ({
    text: c.textContent.replace(/\s+/g, ' ').trim(),
    href: c.getAttribute('href'),
    title: c.getAttribute('title')
})), sel('tr[data-row="r-tick"] .proj-ticket-chip'));
const stored = async () => (await data()).rows.find(r => r.id === 'r-tick').cells.ticket;

await page.click(ticketPlus);
await page.waitForTimeout(300);
ok('the + on an empty ticket cell opens a window with a line already waiting',
    await page.evaluate(() => {
        const field = document.querySelector('.proj-modal .proj-modal-num');
        return !!field && document.activeElement === field;
    }));

await page.fill('.proj-modal .proj-modal-num', 'ABC-123');
await page.waitForTimeout(350);
ok('a number typed in the window is in the cell before the window closes',
    (await chips()).length === 1 && (await chips())[0].text === 'ABC-123',
    JSON.stringify(await chips()));
ok('and with no address behind it, it stays a chip rather than becoming a link',
    (await chips())[0].href === null, JSON.stringify(await chips()));

await page.fill('.proj-modal .proj-modal-type', 'Bug');
await page.waitForTimeout(350);
ok('a type is optional and sits after the number, which is the part that must survive a cut',
    /^ABC-123\b/.test((await chips())[0].text) && /Bug/.test((await chips())[0].text),
    JSON.stringify(await chips()));
ok('and both of them are stored on the row, as one ticket',
    Array.isArray(await stored()) && (await stored()).length === 1 &&
    (await stored())[0].id === 'ABC-123' && (await stored())[0].type === 'Bug',
    JSON.stringify(await stored()));

await page.keyboard.press('Escape');
await page.waitForTimeout(250);

const baseField = sel('.proj-ticket-base');
await page.fill(baseField, 'https://tickets.example.com/browse/');
await page.waitForTimeout(400);
ok('setting the board\'s ticket address turns the numbers into links',
    (await chips())[0].href === 'https://tickets.example.com/browse/ABC-123',
    JSON.stringify(await chips()));
ok('the address is kept with the plan rather than with the row',
    (await data()).ticketBase === 'https://tickets.example.com/browse/', (await data()).ticketBase);
ok('typing the address keeps the caret in it, as every other field does',
    await page.evaluate((s) => document.activeElement === document.querySelector(s), baseField));
ok('and the chip says where it goes, in full, however narrow the column is',
    (await chips())[0].title === 'ABC-123 \u00B7 Bug \u2014 https://tickets.example.com/browse/ABC-123',
    (await chips())[0].title);

// A base typed with a trailing slash and one typed without are the same base.
await page.fill(baseField, 'https://tickets.example.com/browse');
await page.waitForTimeout(400);
ok('a missing trailing slash is not a broken link',
    (await chips())[0].href === 'https://tickets.example.com/browse/ABC-123',
    JSON.stringify(await chips()));

await page.fill(baseField, 'https://tickets.example.com/t/{ticket}/view');
await page.waitForTimeout(400);
ok('and a number that belongs in the middle has somewhere to go',
    (await chips())[0].href === 'https://tickets.example.com/t/ABC-123/view',
    JSON.stringify(await chips()));

// One board, two trackers: the type is what says which, so it can be in the address.
await page.fill(baseField, 'https://tickets.example.com/{type}/{ticket}');
await page.waitForTimeout(400);
ok('a type can be part of the address, so one base can reach two trackers',
    (await chips())[0].href === 'https://tickets.example.com/Bug/ABC-123',
    JSON.stringify(await chips()));
ok('and a ticket with no type makes no link from an address that needs one',
    await page.evaluate(() =>
        projTicketUrl({ ticketBase: 'https://t.example.com/{type}/{ticket}' }, 'ABC-1', '') === ''),
    await page.evaluate(() =>
        projTicketUrl({ ticketBase: 'https://t.example.com/{type}/{ticket}' }, 'ABC-1', '')));

await page.fill(baseField, 'https://tickets.example.com/browse/');
await page.waitForTimeout(400);

// A second ticket on the same row: the thing a single field could not do.
await page.click(ticketPlus);
await page.waitForTimeout(300);
await page.click('.proj-modal .proj-ticket-add');
await page.waitForTimeout(250);
await page.fill('.proj-modal .proj-modal-ticket[data-ticket="1"] .proj-modal-num', 'DEF-9');
await page.waitForTimeout(350);
ok('a row can be in two trackers at once, and the cell shows both',
    (await chips()).length === 2 &&
    (await chips())[1].href === 'https://tickets.example.com/browse/DEF-9',
    JSON.stringify(await chips()));
ok('a type already used in the plan is offered rather than retyped, so Bug and bug do not become two',
    await page.evaluate(() => [...document.querySelectorAll('#proj-ticket-types option')]
        .map(o => o.value).join(',')) === 'Bug',
    await page.evaluate(() => [...document.querySelectorAll('#proj-ticket-types option')]
        .map(o => o.value).join(',')));

await page.click('.proj-modal .proj-modal-ticket[data-ticket="0"] .proj-x');
await page.waitForTimeout(350);
ok('removing one leaves the other, rather than the one that was removed',
    (await chips()).length === 1 && (await chips())[0].text === 'DEF-9',
    JSON.stringify(await chips()));
await page.keyboard.press('Escape');
await page.waitForTimeout(250);

// The window opens with a line already in it, so closing one without typing must
// not leave an empty ticket behind on the row.
await page.click(ticketPlus);
await page.waitForTimeout(300);
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
ok('opening the window and typing nothing leaves nothing behind',
    (await stored()).length === 1 && (await chips()).length === 1,
    JSON.stringify(await stored()));

// Stored as a single number before a row could have several. Nothing migrates it:
// a string is read as a list of one, which is the same bargain the resources column
// makes, and the reason an old board opens with its tickets intact.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows.find(r => r.id === 'r-tick').cells.ticket = 'LEG-1';
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('a table stored when a row had one ticket still shows it, with no migration',
    (await chips()).length === 1 &&
    (await chips())[0].href === 'https://tickets.example.com/browse/LEG-1',
    JSON.stringify(await chips()));

ok('a base that is not a web address makes no link at all', await page.evaluate((id) =>
    projTicketUrl({ ticketBase: 'javascript:alert(1)' }, 'ABC-123') === '' &&
    projTicketUrl({ ticketBase: 'https://t.example.com/' }, '') === '', toolId));
ok('and a ticket number cannot smuggle its own address in',
    await page.evaluate(() => projTicketUrl({ ticketBase: 'https://t.example.com/' }, '../../evil')) ===
    'https://t.example.com/..%2F..%2Fevil',
    await page.evaluate(() => projTicketUrl({ ticketBase: 'https://t.example.com/' }, '../../evil')));
ok('nor can a type, which arrives from a file the same way a number does',
    await page.evaluate(() => projTicketUrl(
        { ticketBase: 'https://t.example.com/{type}/{ticket}' }, 'ABC-1', '../../evil')) ===
    'https://t.example.com/..%2F..%2Fevil/ABC-1',
    await page.evaluate(() => projTicketUrl(
        { ticketBase: 'https://t.example.com/{type}/{ticket}' }, 'ABC-1', '../../evil')));

// To a spreadsheet and back. A type can be two words, so it travels in brackets —
// `ABC-1 Tech Debt` has no honest way back.
const ticketTrip = await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows = [{ id: 'r-trip', cells: { item: 'Trip', size: 'S', pct: 0,
        ticket: [{ id: 'ABC-1', type: 'Tech Debt' }, { id: 'DEF-2', type: '' }],
        deps: [], links: [] } }];
    projSetData(id, dd);
    const text = projToCsv(dd);
    const col = dd.columns.findIndex(c => c.type === 'ticket');
    const cell = projCsvParse(text)[1][col];
    const back = projFromCsv(projCsvParse(text), dd);
    return { cell: cell, back: back.rows[0].cells[dd.columns[col].id],
        loose: projParseTickets('ABC-7 Bug; DEF-8') };
}, toolId);
ok('a spreadsheet gets every ticket on the row, each with its type after it',
    ticketTrip.cell === 'ABC-1 (Tech Debt); DEF-2', ticketTrip.cell);
ok('and the file comes back as the same two tickets, types and all',
    JSON.stringify(ticketTrip.back) ===
    JSON.stringify([{ id: 'ABC-1', type: 'Tech Debt' }, { id: 'DEF-2', type: '' }]),
    JSON.stringify(ticketTrip.back));
ok('a file typed by hand without the brackets is read the way it was meant',
    JSON.stringify(ticketTrip.loose) ===
    JSON.stringify([{ id: 'ABC-7', type: 'Bug' }, { id: 'DEF-8', type: '' }]),
    JSON.stringify(ticketTrip.loose));

await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows = [{ id: 'r-tick', cells: { item: 'A', size: 'S', pct: 0,
        ticket: [{ id: 'ABC-9', type: '' }], deps: [], links: [] } }];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('a number with no type is a link like any other', (await chips()).length === 1 &&
    (await chips())[0].href === 'https://tickets.example.com/browse/ABC-9',
    JSON.stringify(await chips()));

// A table stored before the column existed gets it, once, and only once.
const migrated = await page.evaluate((id) => {
    const dd = projGetData(id);
    const without = JSON.parse(JSON.stringify(dd));
    without.columns = without.columns.filter(c => c.type !== 'ticket');
    delete without.addedColumns;
    delete without.ticketBase;
    toolCustomizations[id].projectData = without;
    const first = projGetData(id);
    const titles = first.columns.map(c => c.title).join(',');
    // Deleted on purpose this time: it must not come back on the next read.
    first.columns = first.columns.filter(c => c.type !== 'ticket');
    projSetData(id, first);
    const second = projGetData(id);
    return { titles: titles, kept: second.columns.some(c => c.type === 'ticket'),
        base: typeof first.ticketBase };
}, toolId);
ok('an older table is given the Ticket column, in its place to the left of the task',
    /,Ticket,Task,/.test(',' + migrated.titles + ','), migrated.titles);
ok('and no Description column, because notes do not live in one',
    !/Description/.test(migrated.titles), migrated.titles);
ok('and an older table comes back with somewhere to put the address',
    migrated.base === 'string', migrated.base);
ok('but a column somebody deleted stays deleted', migrated.kept === false);

await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true }));
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);

// 10f. O and ?: two entries in the size list that are not points on the scale.
ok('O and ? are offered either side of the ramp', await page.evaluate(() =>
    [...document.querySelectorAll('.proj-size-select')[0].options].map(o => o.value).join(',')) ===
    ',O,XXXS,XXS,XS,S,M,L,XL,XXL,XXXL,?',
    await page.evaluate(() => [...document.querySelectorAll('.proj-size-select')[0].options].map(o => o.value).join(',')));
ok('and both are worth nothing, which is the point of them',
    (await data()).sizes.O === 0 && (await data()).sizes['?'] === 0,
    JSON.stringify((await data()).sizes));
ok('neither takes a colour off the ramp, because neither is a size',
    await page.evaluate(() => projSizeStep('O') === 0 && projSizeStep('?') === 0 &&
        projSizeStep('XS') === 1 && projSizeStep('XL') === 5));
ok('but both are sizes the table knows, so a cell holding one is not blank',
    await page.evaluate(() => projKnownSize('O') && projKnownSize('?') && !projKnownSize('XXXXL')));

await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows = [{ id: 'r-unknown', cells: { item: 'Unsized', size: '?', pct: 0, deps: [], links: [] } }];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('an unestimated row costs no days', (await calcText(0))[0] === '0 d', (await calcText(0))[0]);
ok('and is painted neutral rather than green',
    (await page.evaluate(() => document.querySelector('.proj-size-select').getAttribute('style') || ''))
        .includes('--proj-size-0'),
    await page.evaluate(() => document.querySelector('.proj-size-select').getAttribute('style')));
// The bars are coloured by slack, so the key is the slack bands — the sizes are
// already in the table, in their own column, in colour.
ok('the chart legend names the slack bands the bars are painted with',
    await page.evaluate(() => [...document.querySelectorAll('.proj-legend-item')]
        .map(e => e.textContent.trim()).join('|')) ===
    'Comfortable|Tight|No room|Late|No deadline',
    await page.evaluate(() => [...document.querySelectorAll('.proj-legend-item')]
        .map(e => e.textContent.trim()).join('|')));
// And the bars really are painted that way, which is the whole point of the key.
const barPaint = await page.evaluate((id) => {
    const dd = projGetData(id);
    const iso = (n) => {
        const t = projToday() + n * 86400000;
        return projFormatDate(t);
    };
    dd.units = { ...projUnits(dd), skipWeekends: false };
    dd.rows = [
        { id: 'b-late', cells: { item: 'Late', size: 'M', pct: 0, deadline: iso(1), deps: [], links: [] } },
        { id: 'b-fine', cells: { item: 'Fine', size: 'M', pct: 0, deadline: iso(400), deps: [], links: [] } },
        { id: 'b-none', cells: { item: 'No deadline', size: 'M', pct: 0, deadline: '', deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
    return [...document.querySelectorAll('.proj-gantt-row:not(.proj-plan-row) .proj-bar')].map(b => b.style.background);
}, toolId);
ok('a bar that will miss its deadline is painted critical',
    barPaint[0] === 'var(--proj-critical)', JSON.stringify(barPaint));
ok('one with room to spare is painted good', barPaint[1] === 'var(--proj-good)', JSON.stringify(barPaint));
ok('and one with nothing to be late for is painted neither',
    barPaint[2] === 'var(--proj-size-0)', JSON.stringify(barPaint));
ok('so two rows of the same size can be different colours, because size is not the point',
    barPaint[0] !== barPaint[1], JSON.stringify(barPaint));

// A parent's bar is a bracket rather than a block, but it is late or comfortable
// like anything else — so the colour goes on the outline.
const parentPaint = await page.evaluate((id) => {
    const dd = projGetData(id);
    const iso = (n) => projFormatDate(projToday() + n * 86400000);
    dd.rows = [
        { id: 'p-late', cells: { item: 'Parent', size: '', pct: 0, deadline: iso(1), deps: [], links: [] } },
        { id: 'p-kid', parent: 'p-late', cells: { item: 'Kid', size: 'M', pct: 0, deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
    const bar = document.querySelector('.proj-gantt-row:not(.proj-plan-row) .proj-bar-parent');
    return { border: bar.style.borderColor, background: bar.style.background,
             filled: getComputedStyle(bar).backgroundColor };
}, toolId);
ok('a parent bar is coloured by its slack too', parentPaint.border === 'var(--proj-critical)',
    JSON.stringify(parentPaint));
ok('on its outline, since the bracket is not filled',
    parentPaint.background === '' && parentPaint.filled === 'rgba(0, 0, 0, 0)',
    JSON.stringify(parentPaint));

ok('and never carries the meaning in colour alone — every band is named beside its colour',
    await page.evaluate(() => [...document.querySelectorAll('.proj-legend-item')]
        .every(e => e.querySelector('.proj-legend-swatch') && e.textContent.trim().length > 2)));

// 10g. A finished row steps back without leaving.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows = [
        { id: 'r-doing', cells: { item: 'Doing', size: 'S', pct: 50, deps: [], links: [] } },
        { id: 'r-done', cells: { item: 'Done', size: 'S', pct: 100, deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
// The pointer is moved out of the table first: a faded row comes back to full
// strength under the cursor on purpose, and where the mouse was last left is not
// something this is measuring.
const faded = async (rowId) => {
    await page.mouse.move(4, 4);
    return page.evaluate((r) => {
        const td = document.querySelector('tr[data-row="' + r + '"] td');
        return Number(getComputedStyle(td).opacity);
    }, rowId);
};
ok('a row at 100% is faded', (await faded('r-done')) < 0.9, String(await faded('r-done')));
ok('and one that is not is left alone', (await faded('r-doing')) === 1, String(await faded('r-doing')));
ok('the finished row is still there to read, not hidden', await page.evaluate(() =>
    !!document.querySelector('tr[data-row="r-done"]') &&
    getComputedStyle(document.querySelector('tr[data-row="r-done"]')).display !== 'none'));

// Typing 100 fades it then and there, rather than at the next full render.
const pctOf = (rowId) => sel('tr[data-row="' + rowId + '"] [data-col="pct"]');
await page.fill(pctOf('r-doing'), '100');
await page.waitForTimeout(350);
ok('typing 100 marks the row done as it is typed, without waiting for a redraw',
    await page.evaluate(() =>
        document.querySelector('tr[data-row="r-doing"]').classList.contains('proj-done')));
ok('though the row being edited stays at full strength while the caret is in it',
    (await faded('r-doing')) === 1, String(await faded('r-doing')));
await page.evaluate(() => document.activeElement.blur());
await page.waitForTimeout(200);
ok('and fades as soon as it is left alone', (await faded('r-doing')) < 0.9,
    String(await faded('r-doing')));
await page.fill(pctOf('r-doing'), '60');
await page.evaluate(() => document.activeElement.blur());
await page.waitForTimeout(350);
ok('and taking it back off brings the row back', (await faded('r-doing')) === 1,
    String(await faded('r-doing')));

// 10h. The settings strips fold away.
const stripsShown = () => page.evaluate(() =>
    ['.proj-sizes', '.proj-units', '.proj-tickets']
        .every(s => getComputedStyle(document.querySelector(s)).display !== 'none'));
ok('the settings are shown to begin with', await stripsShown());
await page.click(sel('.proj-settings-toggle'));
await page.waitForTimeout(350);
ok('and the toggle folds all three away at once', (await stripsShown()) === false);
ok('which is remembered with the plan, not with the window',
    (await data()).hideSettings === true, String((await data()).hideSettings));
ok('while the table itself stays', await page.evaluate(() =>
    document.querySelectorAll('.proj-table tbody tr').length) === 2,
    String(await page.evaluate(() => document.querySelectorAll('.proj-table tbody tr').length)));
ok('and the button says what it would do next',
    /Show/.test(await page.evaluate(() => document.querySelector('.proj-settings-toggle').title)),
    await page.evaluate(() => document.querySelector('.proj-settings-toggle').title));
await page.click(sel('.proj-settings-toggle'));
await page.waitForTimeout(350);
ok('pressing it again brings them back', await stripsShown());

// 10i. Notes: every cell can be written about, in a window of its own. Not columns —
//      a column of paragraphs is either a column of ellipses or a table one row tall.
const noteBtn = (rowId, colId) =>
    sel('tr[data-row="' + rowId + '"] .proj-note-btn[data-col="' + colId + '"]');
ok('every cell carries an opener, not only the task',
    await page.evaluate(() =>
        document.querySelectorAll('tr[data-row="r-doing"] .proj-note-btn').length) ===
    (await data()).columns.filter(c => !c.collapsed).length,
    String(await page.evaluate(() =>
        document.querySelectorAll('tr[data-row="r-doing"] .proj-note-btn').length)));
ok('and each one sits in the cell it is about', await page.evaluate(() => {
    const btn = document.querySelector('tr[data-row="r-doing"] .proj-note-btn[data-col="item"]');
    return !!btn.closest('td').querySelector('input[data-col="item"]');
}));
ok('no column claims to be the notes about the others',
    !(await headings()).includes('Description'), await headings());
ok('an opener with nothing behind it keeps out of the way', await page.evaluate(() =>
    !document.querySelector('tr[data-row="r-doing"] .proj-note-btn[data-col="item"]')
        .classList.contains('proj-note-has')));

await page.click(noteBtn('r-doing', 'item'));
await page.waitForTimeout(300);
ok('clicking it opens a window', await page.evaluate(() => !!document.querySelector('.proj-modal')));
ok('on the body, so the tool window cannot clip it', await page.evaluate(() =>
    document.querySelector('.proj-modal').parentElement === document.body));
// What the window is comes first, then which cell: a note headed with the column
// name read as though the column were the subject, and every note on one row then
// looked like it was labelled with the task.
ok('headed Notes, then the row and the column it belongs to',
    (await page.evaluate(() => document.querySelector('.proj-modal-head span').textContent)) ===
    'Notes — Doing · Task',
    await page.evaluate(() => document.querySelector('.proj-modal-head span').textContent));
ok('with the caret already in it', await page.evaluate(() =>
    document.activeElement === document.querySelector('.proj-modal-text')));

await page.fill('.proj-modal-text', 'First paragraph about the work.\n\nSecond paragraph, with more.');
await page.waitForTimeout(300);
ok('what is typed is saved as it is typed, paragraphs and all',
    (await data()).rows[0].notes.item === 'First paragraph about the work.\n\nSecond paragraph, with more.',
    JSON.stringify((await data()).rows[0].notes));
ok('kept beside the cells rather than among them, where it cannot collide with a value',
    (await data()).rows[0].cells.desc === undefined,
    JSON.stringify((await data()).rows[0].cells.desc));
ok('and the window is still open, rather than closing under the typing',
    await page.evaluate(() => !!document.querySelector('.proj-modal')));
// Nothing in the cells says "Notes" of its own accord: a column of placeholders is a
// column that looks full of something and is not.
ok('an empty Notes cell is empty, not labelled',
    await page.evaluate(() => {
        const cells = [...document.querySelectorAll('.proj-cell-notes')];
        return cells.length > 0 && cells.every(t => t.getAttribute('placeholder') === null);
    }),
    JSON.stringify(await page.evaluate(() =>
        [...document.querySelectorAll('.proj-cell-notes')].map(t => t.getAttribute('placeholder')))));

await page.keyboard.press('Escape');
await page.waitForTimeout(350);
ok('Escape closes it', await page.evaluate(() => !document.querySelector('.proj-modal')));
ok('and closes only it, leaving the window it was opened over alone',
    await page.evaluate((id) =>
        document.querySelector('.tool[data-tool="' + id + '"]').classList.contains('fullscreen'), toolId));
ok('the opener now says there is something to read',
    await page.evaluate(() =>
        document.querySelector('tr[data-row="r-doing"] .proj-note-btn[data-col="item"]')
            .classList.contains('proj-note-has')));
ok('with the whole of it on hover',
    (await page.getAttribute(noteBtn('r-doing', 'item'), 'title')).includes('Second paragraph'),
    await page.getAttribute(noteBtn('r-doing', 'item'), 'title'));
ok('and the cell still holds its own value, which the note did not take over',
    await page.inputValue(sel('tr[data-row="r-doing"] input[data-col="item"]')) === 'Doing',
    await page.inputValue(sel('tr[data-row="r-doing"] input[data-col="item"]')));

// A note belongs to one cell, not to the row.
await page.click(noteBtn('r-doing', 'deadline'));
await page.waitForTimeout(300);
ok('another column in the same row opens empty, because the note is the cell\'s',
    (await page.inputValue('.proj-modal-text')) === '', await page.inputValue('.proj-modal-text'));
ok('headed with that column', (await page.evaluate(() =>
    document.querySelector('.proj-modal-head span').textContent)) === 'Notes — Doing · Deadline',
    await page.evaluate(() => document.querySelector('.proj-modal-head span').textContent));
await page.fill('.proj-modal-text', 'Fixed by the launch event.');
await page.waitForTimeout(250);
await page.click('.proj-modal-foot .proj-btn');
await page.waitForTimeout(300);
ok('and Done closes it too', await page.evaluate(() => !document.querySelector('.proj-modal')));
ok('each note stays with its own cell',
    (await data()).rows[0].notes.deadline === 'Fixed by the launch event.' &&
    (await data()).rows[0].notes.item.startsWith('First paragraph'),
    JSON.stringify((await data()).rows[0].notes));

await page.click(noteBtn('r-doing', 'item'));
await page.waitForTimeout(300);
ok('opening one again finds what was there', (await page.inputValue('.proj-modal-text')) ===
    'First paragraph about the work.\n\nSecond paragraph, with more.',
    await page.inputValue('.proj-modal-text'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// A spreadsheet has no window to open, so each column that has notes gets one in the
// file, and nothing written is lost on the way out.
const noteCsv = await page.evaluate((id) => projToCsv(projGetData(id)), toolId);
ok('a column with notes gets a column of its own in the CSV, newlines quoted',
    noteCsv.includes('"First paragraph about the work.'), noteCsv.slice(0, 120));
ok('headed for the column it is about',
    /,Task notes,Deadline notes,Parent\r\n/.test(noteCsv), noteCsv.split('\r\n')[0].slice(-60));
ok('and a column nobody wrote about takes none',
    !/Links notes/.test(noteCsv), noteCsv.split('\r\n')[0].slice(-60));
ok('and they come back from one', await page.evaluate((args) => {
    const [id, text] = args;
    const built = projFromCsv(projCsvParse(text), projGetData(id));
    const row = built.rows.find(r => r.cells.item === 'Doing');
    return !!row && row.notes.item.indexOf('Second paragraph') > 0 &&
        row.notes.deadline === 'Fixed by the launch event.';
}, [toolId, noteCsv]));

// 10k. Start and End: worked out until somebody types one in.
//
//      Weekends off for this part — the arithmetic under test is the pinning, and a
//      working week shifts every date by an amount that depends on what day it is.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.units = { ...projUnits(dd), skipWeekends: false };
    dd.sizes = { O: 0, XS: 2, S: 5, M: 10, L: 30, XL: 60, '?': 0 };
    dd.rows = [
        { id: 'r-first', cells: { item: 'First', size: 'S', pct: 0, deps: [], links: [] } },
        { id: 'r-next', cells: { item: 'Next', size: 'S', pct: 0, deps: ['r-first'], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

const iso2 = (days) => page.evaluate((n) => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    return new Date(d.getTime() + n * 86400000).toISOString().slice(0, 10);
}, days);
const whenCell = (rowId, colId) => sel('tr[data-row="' + rowId + '"] input[data-col="' + colId + '"]');
const whenValue = (rowId, colId) => page.inputValue(whenCell(rowId, colId));
const whenDerived = (rowId, colId) => page.evaluate((s) =>
    document.querySelector(s).classList.contains('proj-when-derived'), whenCell(rowId, colId));

ok('a row that has not been given dates still shows them, worked out from the plan',
    (await whenValue('r-first', 'start')) === (await iso2(0)) &&
    (await whenValue('r-first', 'end')) === (await iso2(4)),
    (await whenValue('r-first', 'start')) + ' to ' + (await whenValue('r-first', 'end')));
ok('and says they are worked out rather than typed in',
    (await whenDerived('r-first', 'start')) && (await whenDerived('r-first', 'end')));
ok('a dependent row starts after the thing it waits for finishes',
    (await whenValue('r-next', 'start')) === (await iso2(5)), await whenValue('r-next', 'start'));
ok('nothing is stored for a date nobody typed',
    !(await data()).rows[0].cells.start && !(await data()).rows[0].cells.end,
    JSON.stringify((await data()).rows[0].cells));

// Pinning the start moves the row, and everything that waits on it.
await page.fill(whenCell('r-first', 'start'), await iso2(10));
await page.waitForTimeout(400);
ok('typing a start date pins it', (await data()).rows[0].cells.start === (await iso2(10)),
    JSON.stringify((await data()).rows[0].cells.start));
ok('and the field stops calling itself worked out',
    (await whenDerived('r-first', 'start')) === false);

// A date typed on a day nobody works belongs to the user; where the work lands does
// not. The cell keeps the one and says the other.
await page.evaluate((id) => {
    const dd = projGetData(id);
    // A five-day week for this part: the default week runs through the weekend, and
    // what is under test is what happens to a date that lands on a day off.
    dd.units = { ...projUnits(dd), daysPerWeek: 5, skipWeekends: true };
    // A Saturday, named rather than counted, so this does not depend on today.
    dd.rows[0].cells.start = '2027-01-02';
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('a start typed on a Saturday is kept as it was typed',
    (await whenValue('r-first', 'start')) === '2027-01-02', await whenValue('r-first', 'start'));
ok('while the cell says where the work actually lands',
    (await page.getAttribute(whenCell('r-first', 'start'), 'title')).includes('2027-01-04'),
    await page.getAttribute(whenCell('r-first', 'start'), 'title'));

// The bug that assertion caught: a day used to be a fixed number of milliseconds
// added to *local* midnight, so one added across a daylight-saving change landed an
// hour out and reported the wrong weekday — a plan that schedules work on a Saturday
// without saying so. Every date here is UTC midnight now, where there is no such
// hour. Two hundred working days reaches well past any such change.
ok('the working week holds across a daylight-saving change', await page.evaluate((id) => {
    const u = projUnits(projGetData(id));
    for (let n = 0; n < 200; n++) {
        const day = new Date(projToday() + projNthWorkdayOffset(n, u) * 86400000).getUTCDay();
        if (day === 0 || day === 6) return false;
    }
    return true;
}, toolId));
ok('and a date typed in comes back out as the same date, wherever the reader is',
    await page.evaluate(() => ['2026-03-08', '2026-11-01', '2027-01-02', '2027-06-30']
        .every(d => projFormatDate(projParseDate(d)) === d)));
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.units = { ...projUnits(dd), daysPerWeek: 7, skipWeekends: false };
    dd.rows[0].cells.start = '';
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
await page.fill(whenCell('r-first', 'start'), await iso2(10));
await page.waitForTimeout(400);
ok('the end follows the pinned start by the days that are left',
    (await whenValue('r-first', 'end')) === (await iso2(14)), await whenValue('r-first', 'end'));
ok('and what depends on it moves with it',
    (await whenValue('r-next', 'start')) === (await iso2(15)), await whenValue('r-next', 'start'));
ok('the chart agrees, because both read the same schedule', await page.evaluate(() =>
    document.querySelector('.proj-gantt-row:not(.proj-plan-row) .proj-gantt-when').textContent.trim()) ===
    (await iso2(10)).slice(5) + ' \u2013 ' + (await iso2(14)).slice(5),
    await page.evaluate(() => document.querySelector('.proj-gantt-row:not(.proj-plan-row) .proj-gantt-when').textContent));

// Pinning the end stretches the bar to it, whatever the size said.
await page.fill(whenCell('r-first', 'end'), await iso2(24));
await page.waitForTimeout(400);
ok('typing an end date pins the finish', (await whenValue('r-first', 'end')) === (await iso2(24)),
    await whenValue('r-first', 'end'));
ok('and the row runs to it rather than to the size it was given',
    await page.evaluate((id) => projScheduleOf(projGetData(id))['r-first'].days, toolId) === 15,
    String(await page.evaluate((id) => projScheduleOf(projGetData(id))['r-first'].days, toolId)));
ok('while Total Days still says what the size is worth, which the dates did not change',
    (await calcText(0))[0] === '5 d', (await calcText(0))[0]);
ok('and the next row waits for the later finish',
    (await whenValue('r-next', 'start')) === (await iso2(25)), await whenValue('r-next', 'start'));

// Handing a date back to the plan.
ok('a pinned date offers a way back', await page.evaluate(() =>
    !!document.querySelector('tr[data-row="r-first"] [onclick^="projClearDate"]')));
await page.click(sel('tr[data-row="r-first"] [data-col="end"][onclick^="projClearDate"]'));
await page.waitForTimeout(400);
ok('and taking it hands the end back to the plan',
    (await whenValue('r-first', 'end')) === (await iso2(14)) && (await whenDerived('r-first', 'end')),
    await whenValue('r-first', 'end'));
ok('leaving the start where it was pinned',
    (await whenValue('r-first', 'start')) === (await iso2(10)) &&
    (await whenDerived('r-first', 'start')) === false,
    await whenValue('r-first', 'start'));

// A parent's dates are its children's, like its size and its completion.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows = [
        { id: 'p-top', cells: { item: 'Platform', size: '', pct: 0, deps: [], links: [] } },
        { id: 'p-kid', parent: 'p-top', cells: { item: 'Schema', size: 'S', pct: 0, deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);
ok('a parent shows the span its sub-items occupy',
    (await whenValue('p-top', 'start')) === (await whenValue('p-kid', 'start')) &&
    (await whenValue('p-top', 'end')) === (await whenValue('p-kid', 'end')),
    (await whenValue('p-top', 'start')) + ' to ' + (await whenValue('p-top', 'end')));
ok('and cannot be given dates of its own, because they are derived',
    await page.evaluate((s) => document.querySelector(s).disabled, whenCell('p-top', 'start')));

// Put back the scale and the week the sections below this one were written against.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.units = { ...projUnits(dd), skipWeekends: true };
    dd.sizes = { XS: 5, S: 10, M: 20, L: 40, XL: 80 };
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);

// 10l. Columns are the user's too: they move, and they fold away.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true }));
    dd.rows = [{ id: 'r-col', cells: { item: 'One', size: 'S', pct: 0, resources: 'Robin',
        deps: [], links: [] } }];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

const colOrder = () => page.evaluate((id) => projGetData(id).columns.map(c => c.id).join(','), toolId);
const headOrder = () => page.evaluate(() =>
    [...document.querySelectorAll('.proj-table thead th[data-col]')].map(t => t.getAttribute('data-col')).join(','));
ok('the heading buttons keep out of a screenshot too, until the heading is hovered',
    Number(await page.evaluate(() =>
        getComputedStyle(document.querySelector('.proj-col-acts')).opacity)) === 0,
    await page.evaluate(() => getComputedStyle(document.querySelector('.proj-col-acts')).opacity));
ok('a column has a grip to drag it by, rather than the whole heading being draggable',
    await page.evaluate(() => {
        const grip = document.querySelector('.proj-col-grip[data-col="deps"]');
        const th = grip.closest('th');
        return grip.getAttribute('draggable') === 'true' && th.getAttribute('draggable') === null;
    }));

const columnsBefore = await colOrder();
await page.evaluate(() => {
    // The drag itself, as the browser reports it: dragstart on the grip, drop on the
    // heading it is let go over.
    const grip = document.querySelector('.proj-col-grip[data-col="deps"]');
    const onto = document.querySelector('.proj-table thead th[data-col="ticket"]');
    projColDragStart(grip, { dataTransfer: null });
    projColDrop(onto, { preventDefault() {}, dataTransfer: null });
});
await page.waitForTimeout(400);
ok('dropping one column on another puts it in that one\'s place',
    (await colOrder()).startsWith('number,deps,ticket,item'), await colOrder());
ok('and the table is redrawn in the new order, not just the data',
    (await headOrder()) === (await colOrder()), (await headOrder()) + ' vs ' + (await colOrder()));
ok('the cells moved with their heading',
    await page.evaluate(() => {
        // One for the row's own handle, then the ID, then the two that swapped.
        // Both of them hold chips now, so each is known by the column its own
        // controls name rather than by what it looks like.
        const cells = document.querySelector('.proj-table tbody tr').children;
        return !!cells[2].querySelector('[data-col="deps"]') &&
            !!cells[3].querySelector('[data-col="ticket"]');
    }));
ok('and nothing was lost on the way', (await colOrder()).split(',').length ===
    columnsBefore.split(',').length, await colOrder());

// Folding. A column that is in the way goes away without being deleted.
await page.click(sel('.proj-col-fold[data-col="links"]'));
await page.waitForTimeout(400);
ok('folding a column is remembered with the plan',
    (await data()).columns.find(c => c.id === 'links').collapsed === true);
ok('its heading and its cells give up their width',
    await page.evaluate(() => {
        const th = document.querySelector('th[data-col="links"]');
        return th.classList.contains('proj-col-narrow') &&
            Math.round(th.getBoundingClientRect().width) < 30;
    }),
    String(await page.evaluate(() =>
        Math.round(document.querySelector('th[data-col="links"]').getBoundingClientRect().width))));
ok('while the column itself is still there, in its place',
    (await colOrder()).includes('links') &&
    (await headOrder()) === (await colOrder()));
ok('and what is under it is untouched — folding is not deleting',
    (await data()).rows[0].cells.resources === 'Robin');
ok('the folded heading says what it is, and is the way back',
    (await page.getAttribute(sel('th[data-col="links"] .proj-col-folded'), 'title')).includes('Links'),
    await page.getAttribute(sel('th[data-col="links"] .proj-col-folded'), 'title'));
await page.click(sel('th[data-col="links"] .proj-col-folded'));
await page.waitForTimeout(400);
ok('clicking it unfolds the column again',
    !(await data()).columns.find(c => c.id === 'links').collapsed &&
    await page.evaluate(() => !document.querySelector('th[data-col="links"]').classList.contains('proj-col-narrow')));

// 10m. Resources work the way dependencies do: more than one per row, each a chip,
//      and a + at the right edge rather than a dropdown in every cell.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true }));
    dd.rows = [
        { id: 'r-r1', cells: { item: 'One', size: 'S', pct: 0, resources: ['Robin'], deps: [], links: [] } },
        { id: 'r-r2', cells: { item: 'Two', size: 'S', pct: 0, resources: 'Sam', deps: [], links: [] } },
        { id: 'r-r3', cells: { item: 'Three', size: 'S', pct: 0, resources: [], deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

const resPlus = (rowId) => sel('tr[data-row="' + rowId + '"] .proj-chips:has(.proj-res-select) .proj-pick-add');
const resPick = (rowId) => sel('tr[data-row="' + rowId + '"] .proj-res-select');
// By the chip's own remove button, which carries the column: the cell is identified
// by what is in it rather than by where it sits, since columns move.
const resChips = (rowId) => page.evaluate((r) =>
    [...document.querySelectorAll('tr[data-row="' + r + '"] .proj-x[data-col="resources"]')]
        .map(x => x.parentElement.textContent.replace('×', '').trim()), rowId);
const resOptions = (rowId) => page.evaluate((s) =>
    [...document.querySelector(s).options].map(o => o.textContent), resPick(rowId));

ok('a resource stored before there could be several still reads as one',
    (await resChips('r-r2')).join(',') === 'Sam', JSON.stringify(await resChips('r-r2')));
ok('an empty row is offered what the other rows already use',
    (await resOptions('r-r3')).join('|') === '—|Robin|Sam|+ New…', (await resOptions('r-r3')).join('|'));
ok('each name once, however many rows use it', await page.evaluate((id) =>
    projResourceList(projGetData(id), 'resources').length, toolId) === 2);
ok('and the dropdown stays out of sight until the + is pressed',
    await page.evaluate((s) => document.querySelector(s).hidden, resPick('r-r3')));

await page.click(resPlus('r-r3'));
await page.waitForTimeout(250);
await page.selectOption(resPick('r-r3'), 'Sam');
await page.waitForTimeout(400);
ok('picking one puts a chip in the cell', (await resChips('r-r3')).join(',') === 'Sam',
    JSON.stringify(await resChips('r-r3')));
ok('stored as a list, because a row can have more than one',
    Array.isArray((await data()).rows[2].cells.resources),
    JSON.stringify((await data()).rows[2].cells.resources));

await page.click(resPlus('r-r3'));
await page.waitForTimeout(250);
await page.selectOption(resPick('r-r3'), 'Robin');
await page.waitForTimeout(400);
ok('and a second one joins it rather than replacing it',
    (await resChips('r-r3')).join(',') === 'Sam,Robin', JSON.stringify(await resChips('r-r3')));
ok('while the one already on the row is no longer offered again',
    (await resOptions('r-r3')).join('|') === '—|+ New…', (await resOptions('r-r3')).join('|'));

await page.click(resPlus('r-r1'));
await page.waitForTimeout(250);
await page.selectOption(resPick('r-r1'), String(await page.evaluate(() => PROJ_RES_NEW)));
await page.waitForTimeout(300);
ok('"+ New…" is not a resource but a way to type one',
    await page.evaluate(() => !!document.querySelector('.proj-res-new')) &&
    (await resChips('r-r1')).join(',') === 'Robin');
await page.fill(sel('.proj-res-new'), 'Alex');
await page.evaluate(() => document.querySelector('.proj-res-new').blur());
await page.waitForTimeout(400);
ok('what is typed joins that row\'s resources', (await resChips('r-r1')).join(',') === 'Robin,Alex',
    JSON.stringify(await resChips('r-r1')));
ok('and every other row can pick it from then on',
    (await resOptions('r-r2')).indexOf('Alex') > 0, (await resOptions('r-r2')).join('|'));

await page.click(sel('tr[data-row="r-r1"] .proj-dep-chip .proj-x[data-res="Robin"]'));
await page.waitForTimeout(400);
ok('and a chip comes off again, leaving the rest', (await resChips('r-r1')).join(',') === 'Alex',
    JSON.stringify(await resChips('r-r1')));

ok('they travel to a spreadsheet as a list, like dependencies',
    (await page.evaluate((id) => projToCsv(projGetData(id)), toolId)).includes('Sam; Robin'),
    (await page.evaluate((id) => projToCsv(projGetData(id)), toolId)).split('\r\n')[3]);
ok('and come back from one', await page.evaluate((id) => {
    const built = projFromCsv(projCsvParse(projToCsv(projGetData(id))), projGetData(id));
    const row = built.rows.find(r => r.cells.item === 'Three');
    return !!row && Array.isArray(row.cells.resources) &&
        row.cells.resources.join(',') === 'Sam,Robin';
}, toolId));

// 11. Dependency chips carry another row's name, so renaming has to reach them.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows = [
        { id: 'r-one', cells: { item: 'First', size: 'S', pct: 0, deps: [], links: [] } },
        { id: 'r-two', cells: { item: 'Second', size: 'S', pct: 0, deps: ['r-one'], links: [] } },
        // A third row so more than one of them still has somewhere to point: a row
        // with nothing left to depend on is not offered the dropdown at all.
        { id: 'r-three', cells: { item: 'Third', size: 'S', pct: 0, deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);
const depChip = () => page.evaluate(() =>
    (document.querySelector('.proj-dep-chip') || {}).textContent || '');
ok('a dependency shows the item it points at', /\bFirst\b/.test(await depChip()), await depChip());
// What is on show is a + at the column's right edge — not a dropdown sitting open in
// every cell — and at the right edge rather than wherever that row's chips stop, so
// the pluses line up down the column instead of stepping in and out.
const depPlus = () => page.evaluate(() =>
    [...document.querySelectorAll('.proj-dep-add')]
        .map(s => s.previousElementSibling)
        .filter(b => b && !b.hidden).map(b => Math.round(b.getBoundingClientRect().right)));
ok('each row offers a + rather than an open dropdown',
    (await depPlus()).length === 3 &&
    await page.evaluate(() => [...document.querySelectorAll('.proj-dep-add')].every(s => s.hidden)),
    JSON.stringify(await depPlus()));
ok('and they line up on the right, whatever each row holds',
    new Set(await depPlus()).size === 1, JSON.stringify(await depPlus()));
await page.click(sel('tr[data-row="r-three"] .proj-dep-add')
        .replace('.proj-dep-add', '.proj-chips:has(.proj-dep-add) .proj-pick-add'));
await page.waitForTimeout(300);
ok('clicking the + is what brings the dropdown out',
    await page.evaluate(() => {
        const s = document.querySelector('tr[data-row="r-three"] .proj-dep-add');
        const plus = document.querySelector(
            'tr[data-row="r-three"] .proj-chips:has(.proj-dep-add) .proj-pick-add');
        return !s.hidden && plus.hidden && document.activeElement === s;
    }));
await page.selectOption(sel('tr[data-row="r-three"] .proj-dep-add'), { index: 1 });
await page.waitForTimeout(400);
ok('and choosing from it leaves a chip behind, with the + back where it was',
    await page.evaluate(() => {
        const tr = document.querySelector('tr[data-row="r-three"]');
        const cell = tr.querySelector('.proj-chips:has(.proj-dep-add)');
        const plus = cell.querySelector('.proj-pick-add');
        return cell.querySelectorAll('.proj-dep-chip').length === 1 && plus && !plus.hidden;
    }),
    JSON.stringify((await data()).rows.find(r => r.id === 'r-three').cells.deps));
await page.click(sel('tr[data-row="r-three"] .proj-dep-chip .proj-x'));
await page.waitForTimeout(400);
ok('and the chip comes off again',
    (await data()).rows.find(r => r.id === 'r-three').cells.deps.length === 0);
await page.fill(sel('tr[data-row="r-one"] [data-col="item"]'), 'Renamed');
await page.waitForTimeout(400);
ok('and follows that item when it is renamed — it used to keep the old name',
    /\bRenamed\b/.test(await depChip()), await depChip());
const ganttLabels = () => page.evaluate(() =>
    [...document.querySelectorAll('.proj-gantt-row:not(.proj-plan-row) .proj-gantt-label')].map(l => l.textContent).join(','));
ok('the chart label followed it too', (await ganttLabels()).indexOf('Renamed') === 0, await ganttLabels());

// 12. Sub-items, and what rolls up.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows = [
        { id: 'r-parent', cells: { item: 'Feature', size: '', pct: 0, deps: [], links: [] } },
        { id: 'r-kid-a', cells: { item: 'Part A', size: 'XS', pct: 100, deps: [], links: [] }, parent: 'r-parent' },
        { id: 'r-kid-b', cells: { item: 'Part B', size: 'L', pct: 0, deps: [], links: [] }, parent: 'r-parent' }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

ok('a sub-item is drawn under its parent', await page.evaluate(() =>
    [...document.querySelectorAll('.proj-table tbody tr')].map(tr => tr.getAttribute('data-row')).join(',')) ===
    'r-parent,r-kid-a,r-kid-b',
    await page.evaluate(() => [...document.querySelectorAll('.proj-table tbody tr')].map(tr => tr.getAttribute('data-row')).join(',')));
ok('the parent\'s Total Days is the sum of its children', (await calcText(0))[0] === '45 d', (await calcText(0))[0]);
ok('and its Remaining Days likewise', (await calcText(0))[1] === '40 d', (await calcText(0))[1]);
ok('its completion is weighted by days, not averaged across children',
    await page.evaluate((id) => projPercent(projGetData(id), projGetData(id).rows[0]), toolId) === 11,
    String(await page.evaluate((id) => projPercent(projGetData(id), projGetData(id).rows[0]), toolId)));
ok('a parent\'s own size and completion are read-only, because they are derived',
    await page.evaluate(() => {
        const tr = document.querySelectorAll('.proj-table tbody tr')[0];
        return tr.querySelector('.proj-size-select').disabled && tr.querySelector('.proj-pct-input').disabled;
    }));
ok('its completion field shows the rolled-up number rather than a stale zero',
    await page.evaluate(() => document.querySelectorAll('.proj-table tbody tr')[0]
        .querySelector('.proj-pct-input').value) === '11',
    await page.evaluate(() => document.querySelectorAll('.proj-table tbody tr')[0].querySelector('.proj-pct-input').value));

// The size column is where the eye goes first, so a parent shows the step its
// sub-items add up to rather than a dash.
const parentSize = () => page.evaluate(() => {
    const el = document.querySelectorAll('.proj-table tbody tr')[0].querySelector('.proj-size-select');
    return { value: el.value, bg: el.style.background, disabled: el.disabled, title: el.title };
});
ok('a parent shows the size its sub-items add up to, not a dash',
    (await parentSize()).value === 'L', JSON.stringify(await parentSize()));
ok('coloured by that step like any other size',
    /--proj-size-4/.test((await parentSize()).bg), (await parentSize()).bg);
ok('and still read-only, because it is derived',
    (await parentSize()).disabled === true);
ok('the exact number is in the tooltip, since nearest is not exact',
    /45 days, nearest L/.test((await parentSize()).title), (await parentSize()).title);
ok('nothing of that is written to the row — a parent keeps whatever size it was given',
    await page.evaluate((id) => projGetData(id).rows[0].cells.size, toolId) === '',
    JSON.stringify(await page.evaluate((id) => projGetData(id).rows[0].cells.size, toolId)));

// 45 → L. Change a sub-item and the step moves with it.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows[2].cells.size = 'XL';   // 5 + 80 = 85, nearest XL
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('changing a sub-item moves the parent\'s size with it',
    (await parentSize()).value === 'XL', JSON.stringify(await parentSize()));

// Equidistant: 20 + 40 = 60, halfway between L and XL. Rounding an estimate down
// is the direction that costs somebody a weekend.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows[1].cells.size = 'M'; dd.rows[1].cells.pct = 0;
    dd.rows[2].cells.size = 'L';
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('a tie goes to the larger size', (await parentSize()).value === 'XL',
    JSON.stringify(await parentSize()));

// Sub-items with no size add up to nothing, which is not a size.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows[1].cells.size = ''; dd.rows[2].cells.size = '';
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('sub-items with no size leave the parent with none either',
    (await parentSize()).value === '', JSON.stringify(await parentSize()));

await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows[1].cells.size = 'XS'; dd.rows[1].cells.pct = 100;
    dd.rows[2].cells.size = 'L';
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);

const parentBar = await page.evaluate((id) => projSchedule(projGetData(id))['r-parent'], toolId);
ok('in the chart a parent spans its children rather than adding work of its own',
    parentBar.start === 0 && parentBar.days === 40 && parentBar.parent === true, JSON.stringify(parentBar));
ok('and is drawn as a bracket, not a block that would count the days twice',
    await page.evaluate(() => !!document.querySelector('.proj-gantt-row:not(.proj-plan-row) .proj-bar-parent')));

// Indent and outdent are how a row becomes a sub-item and stops being one.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows.push({ id: 'r-loose', cells: { item: 'Loose', size: 'S', pct: 0, deps: [], links: [] } });
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
await page.click(sel('tr[data-row="r-loose"] [onclick^="projIndentRow"]'));
await page.waitForTimeout(400);
ok('a row can be made a sub-item', (await data()).rows.find(r => r.id === 'r-loose').parent === 'r-parent',
    String((await data()).rows.find(r => r.id === 'r-loose').parent));
await page.click(sel('tr[data-row="r-loose"] [onclick^="projOutdentRow"]'));
await page.waitForTimeout(400);
ok('and promoted back out of one', (await data()).rows.find(r => r.id === 'r-loose').parent === undefined,
    String((await data()).rows.find(r => r.id === 'r-loose').parent));

// Deleting a parent must not take typed rows with it.
await page.click(sel('tr[data-row="r-parent"] .proj-x[data-row="r-parent"]'));
await page.waitForTimeout(400);
d = await data();
ok('deleting a parent promotes its sub-items rather than deleting them',
    d.rows.length === 3 && d.rows.every(r => r.parent === undefined), JSON.stringify(d.rows.map(r => r.id)));

// 13. The chart sits below the table, and the window fits the table up to a cap.
//     A #tool link opens maximized, and a maximized tool is not one to resize — so
//     come out of that first, which is also what proves the refusal is deliberate.
ok('a maximized tool is left at the size the board gave it',
    await page.evaluate((id) =>
        document.querySelector('.tool[data-tool="' + id + '"]').classList.contains('fullscreen'), toolId));
await page.evaluate(() => exitToolFullscreen());
await page.waitForTimeout(500);
await page.evaluate((id) => setToolMode(id, 'split'), toolId);
await page.waitForTimeout(600);
const geom = await page.evaluate((id) => {
    const t = document.querySelector('.tool[data-tool="' + id + '"]');
    const table = t.querySelector('.proj-table-pane').getBoundingClientRect();
    const chart = t.querySelector('.proj-gantt-pane').getBoundingClientRect();
    return { tableBottom: Math.round(table.bottom), chartTop: Math.round(chart.top),
             sameColumn: Math.abs(table.left - chart.left) < 2,
             width: Math.round(parseFloat(t.style.width) || t.getBoundingClientRect().width) };
}, toolId);
ok('the chart is below the table, not beside it',
    geom.chartTop >= geom.tableBottom - 2 && geom.sameColumn, JSON.stringify(geom));
ok('and the window is no wider than the cap', geom.width <= 1200, String(geom.width));
ok('a wide table scrolls inside the window rather than stretching it',
    await page.evaluate((id) => {
        const t = document.querySelector('.tool[data-tool="' + id + '"]');
        return Math.round(t.getBoundingClientRect().width) <= Math.round(parseFloat(t.style.width)) + 2;
    }, toolId),
    await page.evaluate((id) => {
        const t = document.querySelector('.tool[data-tool="' + id + '"]');
        return Math.round(t.getBoundingClientRect().width) + ' occupied vs ' + t.style.width + ' set';
    }, toolId));

// 13b. The buttons are chrome: there to be used, gone to be looked at. Checked here
//      rather than earlier because a maximized tool is under the pointer wherever
//      the pointer is, and "not hovered" has to be somewhere.
await page.mouse.move(4, 4);
await page.waitForTimeout(200);
ok('the toolbar is invisible until the pointer is on the tool',
    Number(await page.evaluate(() =>
        getComputedStyle(document.querySelector('.proj-toolbar')).opacity)) === 0,
    await page.evaluate(() => getComputedStyle(document.querySelector('.proj-toolbar')).opacity));
await page.hover(sel('.proj-table'));
await page.waitForTimeout(300);
ok('and visible once it is', Number(await page.evaluate(() =>
    getComputedStyle(document.querySelector('.proj-toolbar')).opacity)) === 1,
    await page.evaluate(() => getComputedStyle(document.querySelector('.proj-toolbar')).opacity));
ok('while the table and the chart are never hidden, since they are the point',
    Number(await page.evaluate(() => getComputedStyle(document.querySelector('.proj-table')).opacity)) === 1);

// Growing the table grows the window, until someone has an opinion about the width.
const widthNow = () => page.evaluate((id) => {
    const t = document.querySelector('.tool[data-tool="' + id + '"]');
    return Math.round(parseFloat(t.style.width) || t.getBoundingClientRect().width);
}, toolId);
const narrow = await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = dd.columns.slice(0, 3);
    projSetData(id, dd);
    projOnRender(id);
    return Math.round(document.querySelector('.tool[data-tool="' + id + '"]').getBoundingClientRect().width);
}, toolId);
await page.waitForTimeout(400);
ok('a table with three columns does not keep an eleven-column window', (await widthNow()) < 700,
    String(await widthNow()));

await page.evaluate((id) => {
    const t = document.querySelector('.tool[data-tool="' + id + '"]');
    t.style.width = '500px';
    positions[id] = { ...(positions[id] || {}), width: 500 };
    savePositions(positions);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('and a width set by hand is left alone from then on', (await widthNow()) === 500, String(await widthNow()));

// Chart-only hides the table, which then measures nothing. Nothing is not a width.
await page.evaluate((id) => {
    toolCustomizations[id].projFitWidth = 500;
    saveToolCustomizations(toolCustomizations);
    setToolMode(id, 'render');
}, toolId);
await page.waitForTimeout(600);
ok('switching to the chart alone does not shrink the window to its minimum',
    (await widthNow()) === 500, String(await widthNow()));
await page.evaluate((id) => setToolMode(id, 'split'), toolId);
await page.waitForTimeout(400);

// 14. CSV, out and back.
//
// The round trip is the test: anything the file cannot carry shows up as a
// difference when it comes home.
await page.evaluate((id) => {
    const dd = projGetData(id);
    // Section 13 cut the table down to three columns on purpose; the round trip is
    // about the whole table, so put it back.
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true }));
    dd.sizes = { XS: 5, S: 10, M: 20, L: 40, XL: 80 };
    dd.rows = [
        { id: 'c-top', cells: { item: 'Platform', size: '', pct: 0, deadline: '2026-11-30',
            resources: '', notes: 'needs, a comma', deps: [], links: [] } },
        { id: 'c-kid', cells: { item: 'Schema', size: 'M', pct: 40, deadline: '2026-11-02',
            resources: 'Lee', notes: 'first line\nsecond line', deps: [],
            links: [{ label: 'Spec', url: 'https://example.com/s' }] },
            parent: 'c-top' },
        { id: 'c-next', cells: { item: 'Launch', size: 'XS', pct: 0, deadline: '2026-12-10',
            resources: '', notes: '', deps: ['c-kid'], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

const csv = await page.evaluate((id) => projToCsv(projGetData(id)), toolId);
const lines = csv.replace(/^\uFEFF/, '').trim().split('\r\n');
ok('the export has a header row naming every column, plus Parent',
    lines[0] === 'ID,Ticket,Task,Title,Dependencies,Size,% Done,Start,End,Total,Left,Deadline,Slack,Assigned,Notes,Links,Parent',
    lines[0]);
ok('a row per item, parents and sub-items alike', lines.length === 4, String(lines.length));
ok('calculated columns go out as values, since a spreadsheet cannot do the sums',
    lines[1].indexOf('20,12,') > 0 || /,20,12,/.test(lines[1]), lines[1]);
// By number and name both: the number is what the importer reads, the name is what
// makes the file worth opening.
ok('a sub-item names its parent, by number and by name', /,1 Platform$/.test(lines[2]), lines[2]);
// By heading rather than by counting commas, so a new column does not move it.
const csvField = (line, name) =>
    line.split(',')[lines[0].split(',').indexOf(name)];
ok('a parent exports the size it is showing, not the blank it stores',
    csvField(lines[1], 'Size') === 'M', csvField(lines[1], 'Size'));
ok('dependencies go out as something a person can read, not an internal id',
    /1\.1 Schema/.test(lines[3]), lines[3]);
ok('a link keeps its label and its address', /Spec <https:\/\/example.com\/s>/.test(lines[2]), lines[2]);
ok('and a comma inside a cell is quoted rather than splitting the row',
    /"needs, a comma"/.test(lines[1]), lines[1]);
ok('and a newline inside a note is quoted rather than ending the row',
    lines.length === 4 && /"first line\nsecond line"/.test(csv), String(lines.length));

const round = await page.evaluate((args) => {
    const [id, text] = args;
    const before = projGetData(id);
    const built = projFromCsv(projCsvParse(text), before);
    const byItem = {};
    built.rows.forEach(r => { byItem[r.cells.item] = r; });
    return {
        columns: built.columns.map(c => c.title).join(','),
        rows: built.rows.map(r => r.cells.item).join(','),
        schemaSize: byItem['Schema'].cells.size,
        schemaPct: byItem['Schema'].cells.pct,
        schemaNotes: byItem['Platform'].cells.notes,
        kidNotes: byItem['Schema'].cells.notes,
        schemaLink: byItem['Schema'].cells.links[0],
        subOf: byItem['Schema'].parent === byItem['Platform'].id,
        launchDeps: byItem['Launch'].cells.deps[0] === byItem['Schema'].id,
        topHasNoParent: byItem['Platform'].parent === undefined
    };
}, [toolId, csv]);
ok('reading it back gives the same columns', round.columns === 'ID,Ticket,Task,Title,Dependencies,Size,% Done,Start,End,Total,Left,Deadline,Slack,Assigned,Notes,Links',
    round.columns);
ok('and the same rows in the same order', round.rows === 'Platform,Schema,Launch', round.rows);
ok('sizes and completions survive', round.schemaSize === 'M' && round.schemaPct === 40,
    JSON.stringify([round.schemaSize, round.schemaPct]));
ok('the quoted comma comes back as one cell', round.schemaNotes === 'needs, a comma', round.schemaNotes);
// A note is several lines now, and a bare newline in a CSV ends the row.
ok('a note of several lines survives the trip through a spreadsheet',
    round.kidNotes === 'first line\nsecond line', JSON.stringify(round.kidNotes));
ok('a link comes back as a label and an address',
    round.schemaLink.label === 'Spec' && round.schemaLink.url === 'https://example.com/s',
    JSON.stringify(round.schemaLink));
ok('a sub-item is a sub-item again, by name', round.subOf === true);
ok('and a dependency points at the row it named', round.launchDeps === true);
ok('while a top-level row stays top-level', round.topHasNoParent === true);

// A heading this table has never seen is somebody's data, not a mistake.
const extra = await page.evaluate((id) => {
    const text = 'Task,Owner\nAlpha,Robin\nBeta,Sam\n';
    const built = projFromCsv(projCsvParse(text), projGetData(id));
    return { titles: built.columns.map(c => c.title).join(','),
             value: built.rows[0].cells[(built.columns.find(c => c.title === 'Owner') || {}).id] };
}, toolId);
ok('an unknown heading arrives as a new column rather than being dropped',
    /Owner$/.test(extra.titles) && extra.value === 'Robin', JSON.stringify(extra));

// The file's idea of a calculated column is ignored — it is derived here.
const stale = await page.evaluate((id) => {
    const text = 'Task,Size,% Done,Total\nGamma,S,0,999\n';
    const dd = projGetData(id);
    const built = projFromCsv(projCsvParse(text), dd);
    const probe = { ...dd, columns: built.columns, rows: built.rows };
    return projTotalDays(probe, built.rows[0]);
}, toolId);
ok('a stale total in the file is read past rather than believed', stale === 10, String(stale));

// Through the real button, with a real file.
const fs = await import('node:fs');
const csvPath = OUT + '/project-import.csv';
fs.writeFileSync(csvPath, 'Task,Size,% Done,Deadline\nFrom a file,L,25,2026-12-01\n');
page.on('dialog', (d) => d.accept());
await page.setInputFiles(sel('.proj-csv-file'), csvPath);
await page.waitForTimeout(800);
ok('importing a file through the button replaces the table',
    (await data()).rows.length === 1 && (await data()).rows[0].cells.item === 'From a file',
    JSON.stringify((await data()).rows.map(r => r.cells.item)));
ok('and the numbers are recomputed from it', (await calcText(0))[0] === '40 d' && (await calcText(0))[1] === '30 d',
    JSON.stringify(await calcText(0)));

const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click(sel('.proj-csv-out'))
]);
const saved = fs.readFileSync(await download.path(), 'utf8');
ok('and Export CSV downloads a file that starts with the headings',
    saved.replace(/^\uFEFF/, '').startsWith('ID,Ticket,Task,Title,Dependencies,Size'), saved.slice(0, 60));
ok('with a BOM, so Excel does not mangle anything non-ASCII', saved.charCodeAt(0) === 0xFEFF,
    String(saved.charCodeAt(0)));

// 14d. Work is shared between the people on it. A size says how much work there is;
// how long that takes depends on how many are doing it, so the two are not the same
// number and the table has to say which it is showing.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true }));
    dd.sizes = { ...dd.sizes, M: 10, L: 30 };
    dd.rows = [
        { id: 'r-solo', cells: { item: 'Alone', size: 'L', pct: 0, resources: ['Robin'], deps: [], links: [] } },
        { id: 'r-pair', cells: { item: 'A pair', size: 'L', pct: 0, resources: ['Robin', 'Sam'], deps: [], links: [] } },
        { id: 'r-three', cells: { item: 'Three', size: 'M', pct: 0, resources: ['Robin', 'Sam', 'Ash'], deps: [], links: [] } },
        { id: 'r-nobody', cells: { item: 'Nobody', size: 'L', pct: 0, resources: [], deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);

// The calculated cells of one row, in column order: Total, Left, Slack. A td does
// not carry its column, so they are read by position as everywhere else here.
const calcIn = (rowId) => page.evaluate((r) =>
    [...document.querySelectorAll('tr[data-row="' + r + '"] .proj-calc')]
        .map(c => c.textContent.trim()), rowId);
const totalOf = async (rowId) => (await calcIn(rowId))[0];
const leftOf = async (rowId) => (await calcIn(rowId))[1];

ok('one person on a thirty-day item takes thirty days',
    (await totalOf('r-solo')) === '30 d', await totalOf('r-solo'));
ok('two of them takes half as long', (await totalOf('r-pair')) === '15 d',
    await totalOf('r-pair'));
ok('and a third of a ten-day item is said to a tenth, not to fifteen places',
    (await totalOf('r-three')) === '3.3 d', await totalOf('r-three'));
ok('an item nobody is on still takes as long as it takes',
    (await totalOf('r-nobody')) === '30 d', await totalOf('r-nobody'));
ok('what is left halves with it, since it is the same work',
    (await leftOf('r-pair')) === '15 d', await leftOf('r-pair'));

// The schedule is downstream of that one number, so the bar has to shorten with it.
const spanOf = (rowId) => page.evaluate((r) => {
    const id = document.querySelector('.proj-widget').closest('.tool').getAttribute('data-tool');
    const d = projGetData(id);
    const row = d.rows.find(x => x.id === r);
    const dates = projRowDates(d, row);
    return (projParseDate(dates.end) - projParseDate(dates.start)) / 86400000;
}, rowId);
ok('and the dates cover the days it now takes, not the days of work in it',
    (await spanOf('r-pair')) < (await spanOf('r-solo')),
    JSON.stringify([await spanOf('r-solo'), await spanOf('r-pair')]));

// Adding somebody through the chips is how this is actually reached.
await page.click(sel('tr[data-row="r-solo"] .proj-chips:has(.proj-res-select) .proj-pick-add'));
await page.waitForTimeout(250);
await page.selectOption(sel('tr[data-row="r-solo"] .proj-res-select'), 'Sam');
await page.waitForTimeout(500);
ok('putting a second name on a row halves it there and then',
    (await totalOf('r-solo')) === '15 d', await totalOf('r-solo'));

// A parent is the sum of what is underneath, and its own list divides nothing: the
// people are on the work, and the work is in the children.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows = [
        { id: 'p-top', cells: { item: 'Parent', size: '', pct: 0, resources: ['Robin', 'Sam', 'Ash'], deps: [], links: [] } },
        { id: 'p-a', parent: 'p-top', cells: { item: 'One', size: 'L', pct: 0, resources: ['Robin', 'Sam'], deps: [], links: [] } },
        { id: 'p-b', parent: 'p-top', cells: { item: 'Two', size: 'L', pct: 0, resources: ['Ash'], deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('a parent adds up what its children now take, and its own names divide nothing',
    (await totalOf('p-top')) === '45 d', await totalOf('p-top'));

// 14e. A plan has a name, every row has a number, and the two of them plus the task
// make a title worth pasting somewhere else.
await page.context().grantPermissions(['clipboard-read', 'clipboard-write'],
    { origin: 'http://localhost:8777' });
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true }));
    dd.rows = [
        { id: 'n-one', cells: { item: 'Discovery', size: 'M', pct: 0, deps: [], links: [] } },
        { id: 'n-two', cells: { item: 'Build', size: 'L', pct: 0, deps: [], links: [] } },
        // The same name twice, under different parents, which is the ordinary way a
        // plan is written and the reason a dependency list needs more than a name.
        { id: 'n-two-a', parent: 'n-two', cells: { item: 'Review', size: 'S', pct: 0, deps: [], links: [] } },
        { id: 'n-three', cells: { item: 'Launch', size: 'S', pct: 0, deps: [], links: [] } },
        { id: 'n-three-a', parent: 'n-three', cells: { item: 'Review', size: 'S', pct: 0, deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

ok('the Title is folded away to begin with, since it is made of things already on the row',
    (await data()).columns.find(c => c.id === 'title').collapsed === true,
    JSON.stringify((await data()).columns.find(c => c.id === 'title')));

const titleOf = (rowId) => page.evaluate((r) => {
    const el = document.querySelector('tr[data-row="' + r + '"] .proj-title-text');
    return el ? el.textContent.trim() : null;
}, rowId);
const numberOf = (rowId) => page.evaluate((r) => {
    const el = document.querySelector('tr[data-row="' + r + '"] .proj-num');
    return el ? el.textContent.trim() : null;
}, rowId);

// Unfold it by its strip, the way anybody would: the rest of this is about what it
// says, and a folded column says it sideways.
await page.click(sel('th[data-col="title"] .proj-col-folded'));
await page.waitForTimeout(400);
ok('and once it is open it sits between the task and what the task waits for',
    (await headings()).split(',').slice(0, 5).join(',') === 'ID,Ticket,Task,Title,Dependencies',
    (await headings()).split(',').slice(0, 5).join(','));

ok('rows are numbered down the table', (await numberOf('n-one')) === '1' &&
    (await numberOf('n-two')) === '2' && (await numberOf('n-three')) === '3',
    JSON.stringify([await numberOf('n-one'), await numberOf('n-two'), await numberOf('n-three')]));
ok('and a sub-item is numbered inside the one it belongs to',
    (await numberOf('n-two-a')) === '2.1' && (await numberOf('n-three-a')) === '3.1',
    JSON.stringify([await numberOf('n-two-a'), await numberOf('n-three-a')]));

ok('a row that hangs from nothing has itself for a title',
    (await titleOf('n-one')) === 'Discovery', await titleOf('n-one'));
ok('and one that hangs from something names that first',
    (await titleOf('n-two-a')) === 'Build - Review', await titleOf('n-two-a'));

// A title is made of the rows above it, so renaming one of those has to reach it.
await page.fill(sel('tr[data-row="n-two"] input[data-col="item"]'), 'Construction');
await page.waitForTimeout(500);
ok('renaming a task moves its own title and its sub-items\u2019 with it',
    (await titleOf('n-two')) === 'Construction' &&
    (await titleOf('n-two-a')) === 'Construction - Review',
    JSON.stringify([await titleOf('n-two'), await titleOf('n-two-a')]));

await page.click(sel('tr[data-row="n-two-a"] .proj-title-copy'));
await page.waitForTimeout(400);
ok('the copy button hands over the whole line',
    (await page.evaluate(() => navigator.clipboard.readText())) === 'Construction - Review',
    await page.evaluate(() => navigator.clipboard.readText()));

// The reason the number is worth showing: two tasks called Review.
const depOptions = (rowId) => page.evaluate((r) =>
    [...document.querySelectorAll('tr[data-row="' + r + '"] .proj-dep-add option')]
        .map(o => o.textContent.trim()), rowId);
ok('two tasks with one name are told apart in the dependency list',
    (await depOptions('n-one')).filter(t => /Review/.test(t)).join(' | ') === '2.1 · Review | 3.1 · Review',
    JSON.stringify(await depOptions('n-one')));
// The dropdown is behind the +, which is the whole point of the + being there.
await page.click(sel('tr[data-row="n-one"] .proj-chips:has(.proj-dep-add) .proj-pick-add'));
await page.waitForTimeout(250);
await page.selectOption(sel('tr[data-row="n-one"] .proj-dep-add'), 'n-three-a');
await page.waitForTimeout(450);
ok('and the chip says which one was picked, not just its name',
    await page.evaluate(() => {
        const chip = document.querySelector('tr[data-row="n-one"] .proj-dep-chip');
        return chip ? chip.textContent.replace('×', '').trim() : null;
    }) === '3.1 · Review',
    await page.evaluate(() => {
        const chip = document.querySelector('tr[data-row="n-one"] .proj-dep-chip');
        return chip ? chip.textContent.replace('×', '').trim() : null;
    }));

// Moving a row renumbers it, which is what a number read off the table means.
await page.click(sel('tr[data-row="n-three"] .proj-move-up, tr[data-row="n-three"] [onclick*="projMoveRow"]'))
    .catch(() => {});
await page.evaluate((id) => {
    const dd = projGetData(id);
    const at = dd.rows.findIndex(r => r.id === 'n-three');
    const moved = dd.rows.splice(at, 1)[0];
    dd.rows.unshift(moved);
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(450);
ok('moving a row to the top makes it the first, and shifts the rest down',
    (await numberOf('n-three')) === '1' && (await numberOf('n-one')) === '2',
    JSON.stringify([await numberOf('n-three'), await numberOf('n-one')]));

// Both are derived, so a spreadsheet gets them as values and a file cannot put a
// stale one back.
const titleCsv = await page.evaluate((id) => projToCsv(projGetData(id)), toolId);
const titleHead = titleCsv.replace(/^\uFEFF/, '').split('\r\n')[0].split(',');
ok('the spreadsheet carries the number and the title',
    titleHead[0] === 'ID' && titleHead.includes('Title') &&
    titleCsv.includes('Construction - Review'), titleHead.slice(0, 5).join(','));
await page.evaluate((args) => {
    const [id, csv] = args;
    const rows = projCsvParse(csv.replace('Construction - Review', 'Nonsense - From - A - File')
        .replace(/(\r\n|^)1,/, '$199,'));
    const dd = projGetData(id);
    projFromCsv(rows, dd);
    projSetData(id, dd);
    projOnRender(id);
}, [toolId, titleCsv]);
await page.waitForTimeout(450);
ok('and reads past both on the way back in, since a stale one would be a lie',
    (await titleOf('n-two-a')) === 'Construction - Review' &&
    !(await page.evaluate(() => document.body.innerText.includes('Nonsense - From'))),
    await titleOf('n-two-a'));

// 14f. Three levels, which is what a project, its tasks and their sub-tasks are.
// There is no plan-level anything: the project is the outermost row, and everything
// a plan needs — its dates, its work, its deadline, its slack — is the roll-up that
// a parent row already does.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true }));
    dd.rows = [
        { id: 'd-top', cells: { item: 'Atlas', size: '', pct: 0, deps: [], links: [] } },
        { id: 'd-mid', parent: 'd-top', cells: { item: 'Build', size: '', pct: 0, deps: [], links: [] } },
        { id: 'd-low', parent: 'd-mid', cells: { item: 'Schema', size: 'M', pct: 0, deps: [], links: [] } },
        { id: 'd-other', cells: { item: 'Elsewhere', size: 'S', pct: 0, deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

const depthOf = (rowId) => page.evaluate(([id, r]) => {
    const dd = projGetData(id);
    return projRowDepth(dd, dd.rows.find(x => x.id === r));
}, [toolId, rowId]);
const numberOfRow = (rowId) => page.evaluate((r) => {
    const el = document.querySelector('tr[data-row="' + r + '"] .proj-num');
    return el ? el.textContent.trim() : null;
}, rowId);
const titleOfRow = (rowId) => page.evaluate((r) => {
    const el = document.querySelector('tr[data-row="' + r + '"] .proj-title-text');
    return el ? el.textContent.trim() : null;
}, rowId);

ok('a row can sit three deep: a project, a task in it, a sub-task in that',
    (await depthOf('d-top')) === 0 && (await depthOf('d-mid')) === 1 &&
    (await depthOf('d-low')) === 2,
    JSON.stringify([await depthOf('d-top'), await depthOf('d-mid'), await depthOf('d-low')]));
ok('and the numbering goes with it', (await numberOfRow('d-low')) === '1.1.1' &&
    (await numberOfRow('d-other')) === '2',
    JSON.stringify([await numberOfRow('d-top'), await numberOfRow('d-mid'),
        await numberOfRow('d-low'), await numberOfRow('d-other')]));
ok('they are drawn in reading order rather than parents first',
    await page.evaluate(() => [...document.querySelectorAll('.proj-table tbody tr')]
        .map(tr => tr.getAttribute('data-row')).join(',')) === 'd-top,d-mid,d-low,d-other',
    await page.evaluate(() => [...document.querySelectorAll('.proj-table tbody tr')]
        .map(tr => tr.getAttribute('data-row')).join(',')));

await page.click(sel('th[data-col="title"] .proj-col-folded'));
await page.waitForTimeout(400);
ok('the title is everything the row hangs from, outermost first',
    (await titleOfRow('d-low')) === 'Atlas - Build - Schema', await titleOfRow('d-low'));
ok('and a row that hangs from nothing is just itself',
    (await titleOfRow('d-other')) === 'Elsewhere', await titleOfRow('d-other'));
await page.fill(sel('tr[data-row="d-top"] input[data-col="item"]'), 'Atlas II');
await page.waitForTimeout(500);
ok('renaming the outermost row moves every title underneath it',
    (await titleOfRow('d-low')) === 'Atlas II - Build - Schema', await titleOfRow('d-low'));

// The project's own line is the roll-up a parent already does.
ok('the project adds up the work under it, two levels down',
    await page.evaluate((id) => {
        const dd = projGetData(id);
        return projTotalDays(dd, dd.rows.find(r => r.id === 'd-top'));
    }, toolId) === 10,
    String(await page.evaluate((id) => projTotalDays(projGetData(id),
        projGetData(id).rows.find(r => r.id === 'd-top')), toolId)));
ok('and its dates are the dates of what is under it', await page.evaluate((id) => {
    const dd = projGetData(id);
    const top = projRowDates(dd, dd.rows.find(r => r.id === 'd-top'));
    const low = projRowDates(dd, dd.rows.find(r => r.id === 'd-low'));
    return top.start === low.start && top.end === low.end;
}, toolId));
ok('so the chart draws it as a bracket above its own rows', await page.evaluate(() => {
    const bar = document.querySelector('.proj-gantt-row .proj-bar-parent');
    return !!bar && !bar.style.background;
}));
ok('and nothing claims to be a plan outside the table',
    await page.evaluate(() => !document.querySelector('.proj-summary')));

// Indenting steps one level at a time, and stops at the third.
await page.click(sel('tr[data-row="d-other"] button[onclick*="projIndentRow"]'));
await page.waitForTimeout(400);
ok('indenting puts a row under the one above it at its own level',
    (await depthOf('d-other')) === 1 &&
    (await data()).rows.find(r => r.id === 'd-other').parent === 'd-top',
    JSON.stringify((await data()).rows.find(r => r.id === 'd-other')));
await page.click(sel('tr[data-row="d-other"] button[onclick*="projIndentRow"]'));
await page.waitForTimeout(400);
ok('and again puts it under its new neighbour, three deep',
    (await depthOf('d-other')) === 2,
    String(await depthOf('d-other')));
ok('with no fourth level on offer, since the button is simply not there',
    await page.evaluate(() =>
        !document.querySelector('tr[data-row="d-other"] button[onclick*="projIndentRow"]')));
await page.click(sel('tr[data-row="d-other"] button[onclick*="projOutdentRow"]'));
await page.waitForTimeout(400);
ok('out moves it one level, not all the way out',
    (await depthOf('d-other')) === 1,
    String(await depthOf('d-other')));

// Deleting a row in the middle hands its children to what it hung from.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows = [
        { id: 'k-top', cells: { item: 'Project', size: '', pct: 0, deps: [], links: [] } },
        { id: 'k-mid', parent: 'k-top', cells: { item: 'Task', size: '', pct: 0, deps: [], links: [] } },
        { id: 'k-low', parent: 'k-mid', cells: { item: 'Sub', size: 'S', pct: 0, deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
page.once('dialog', (d) => d.accept());
await page.click(sel('tr[data-row="k-mid"] .proj-x[data-row="k-mid"]:not(.proj-nest)'));
await page.waitForTimeout(500);
ok('a sub-task whose task is deleted becomes a task, not suddenly a project',
    (await data()).rows.find(r => r.id === 'k-low').parent === 'k-top',
    JSON.stringify((await data()).rows.map(r => [r.id, r.parent])));

// 14g. The view somebody picked is the view they meant. Turning your attention
// elsewhere on the board puts an ordinary tool back to its result — a note's Markdown
// is scaffolding you go into, and a board of half-edited notes is not what anyone
// wants to come back to. A plan is not that: Table, Both and Chart are three ways of
// looking at one thing, and jumping to the chart on every click elsewhere loses the
// view that was chosen, repeatedly, for no visible reason.
await page.evaluate(() => {
    const id = createNoteWithTemplate('blank', { skipEditor: true });
    const custom = loadToolCustomizations();
    custom[id] = { ...custom[id], title: 'A note', customContent: 'Some words.' };
    saveToolCustomizations(custom);
    renderToolboard();
    window.__noteId = id;
});
await page.waitForTimeout(700);

const modeOf = (id) => page.evaluate((i) => getToolMode(i), id);
const noteId = await page.evaluate(() => window.__noteId);

await page.evaluate((id) => setToolMode(id, 'split'), toolId);
await page.evaluate((id) => setToolMode(id, 'edit'), noteId);
await page.waitForTimeout(400);
ok('both tools start in the mode they were put in',
    (await modeOf(toolId)) === 'split' && (await modeOf(noteId)) === 'edit',
    JSON.stringify([await modeOf(toolId), await modeOf(noteId)]));

// A press on the board itself, which is what "clicking away" is.
await page.evaluate(() => {
    const board = document.getElementById('toolboard');
    board.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
});
await page.waitForTimeout(500);
ok('clicking away leaves the plan in the view it was in',
    (await modeOf(toolId)) === 'split', await modeOf(toolId));
ok('and still puts a note back to its finished side, which is the point of the rule',
    (await modeOf(noteId)) === 'render', await modeOf(noteId));

// Escape is the same rule by a different key.
await page.evaluate((id) => setToolMode(id, 'edit'), toolId);
await page.waitForTimeout(300);
await page.click(sel('.proj-table'));
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
ok('and Escape in the table does not send the plan to the chart either',
    (await modeOf(toolId)) === 'edit', await modeOf(toolId));
await page.evaluate(() => {
    customTools = customTools.filter(id => id !== window.__noteId);
    saveCustomTools(customTools);
    renderToolboard();
});
await page.evaluate((id) => setToolMode(id, 'split'), toolId);
await page.waitForTimeout(500);

// 14h. Nine sizes on a five-colour ramp, and a list that says what each is worth.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true }));
    dd.sizes = { ...PROJ_DEFAULT_SIZES };
    dd.rows = [{ id: 's-one', cells: { item: 'Sized', size: 'XXL', pct: 0, deps: [], links: [] } }];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);

ok('the smallest sizes are worth part of a day and a day',
    (await data()).sizes.XXXS === 0.5 && (await data()).sizes.XXS === 1,
    JSON.stringify((await data()).sizes));
ok('and the largest are worth a season and a year of work',
    (await data()).sizes.XXL === 120 && (await data()).sizes.XXXL === 240,
    JSON.stringify((await data()).sizes));
ok('a size half a day long still counts as half a day',
    await page.evaluate((id) => {
        const dd = projGetData(id);
        dd.rows[0].cells.size = 'XXXS';
        return projTotalDays(dd, dd.rows[0]);
    }, toolId) === 0.5);

// Five colours, not nine: the letters are what tell XXL from XL, and a ninth step of
// green-to-red would be a colour nobody could tell from its neighbour.
ok('the ramp keeps its five colours rather than growing to nine',
    await page.evaluate(() => PROJ_SIZE_RAMP.map(projSizeStep).join(',')) === '1,1,1,2,3,4,5,5,5',
    await page.evaluate(() => PROJ_SIZE_RAMP.map(projSizeStep).join(',')));
ok('and the five that were here first kept the colours they had',
    await page.evaluate(() => ['XS', 'S', 'M', 'L', 'XL'].map(projSizeStep).join(',')) === '1,2,3,4,5',
    await page.evaluate(() => ['XS', 'S', 'M', 'L', 'XL'].map(projSizeStep).join(',')));
ok('while O and ? stay off the ramp, drawn neutral',
    await page.evaluate(() => projSizeStep('O') === 0 && projSizeStep('?') === 0));

// The days belong in the list, where a size is picked — not in the cell, which would
// be the size table copied into every row.
const sizeSel = sel('tr[data-row="s-one"] .proj-size-select');
const optionText = () => page.evaluate((s) =>
    [...document.querySelector(s).options].map(o => o.textContent).join(','), sizeSel);
ok('a size cell reads as the size alone', (await optionText()).includes('XXL') &&
    !(await optionText()).includes('d'), await optionText());
await page.focus(sizeSel);
await page.waitForTimeout(300);
ok('and the list it opens says what each size is worth',
    (await optionText()).includes('XXL \u00B7 120 d') &&
    (await optionText()).includes('M \u00B7 10 d'), await optionText());
ok('including the half day, said as a half rather than to fifteen places',
    (await optionText()).includes('XXXS \u00B7 0.5 d'), await optionText());
await page.evaluate((s) => document.querySelector(s).blur(), sizeSel);
await page.waitForTimeout(300);
ok('and it goes back to letters the moment it is not being chosen from',
    !(await optionText()).includes('d'), await optionText());
ok('which is what keeps the days out of the cell itself',
    await page.evaluate((s) => {
        const el = document.querySelector(s);
        return el.options[el.selectedIndex].textContent.trim();
    }, sizeSel) === 'XXL',
    await page.evaluate((s) => {
        const el = document.querySelector(s);
        return el.options[el.selectedIndex].textContent.trim();
    }, sizeSel));

// 14i. A parent's slack is the span it occupies, not its children's days in a line.
// Two streams that each fit comfortably used to make a project read as badly late:
// the days underneath were added up and laid end to end from today, as though one
// person were doing all of it in sequence, and the answer contradicted the End date
// on the very same row.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true }));
    dd.sizes = { ...PROJ_DEFAULT_SIZES };
    const day = 86400000, t = projToday();
    const iso = (n) => projFormatDate(t + n * day);
    dd.rows = [
        // Thirty days of work in each of two streams, running side by side: thirty
        // days of calendar, sixty days of work.
        { id: 'par-top', cells: { item: 'Project', size: '', pct: 0, deadline: iso(45), deps: [], links: [] } },
        { id: 'par-a', parent: 'par-top', cells: { item: 'One stream', size: 'L', pct: 0, deps: [], links: [] } },
        { id: 'par-b', parent: 'par-top', cells: { item: 'The other', size: 'L', pct: 0, deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

const parentFacts = () => page.evaluate((id) => {
    const dd = projGetData(id);
    const row = dd.rows.find(r => r.id === 'par-top');
    const dates = projRowDates(dd, row);
    return {
        end: dates.end,
        due: projCell(row, 'deadline'),
        left: projRemainingDays(dd, row),
        slack: projSlackDays(dd, row),
        byTheDates: Math.round((projParseDate(projCell(row, 'deadline')) -
            projParseDate(dates.end)) / PROJ_DAY)
    };
}, toolId);

ok('the two streams are sixty days of work in thirty days of calendar',
    (await parentFacts()).left === 60 &&
    (await page.evaluate((id) => {
        const dd = projGetData(id);
        const a = projRowDates(dd, dd.rows.find(r => r.id === 'par-a'));
        const b = projRowDates(dd, dd.rows.find(r => r.id === 'par-b'));
        return a.start === b.start && a.end === b.end;
    }, toolId)),
    JSON.stringify(await parentFacts()));
ok('so the project is measured against the day it actually ends',
    (await parentFacts()).slack === (await parentFacts()).byTheDates,
    JSON.stringify(await parentFacts()));
ok('which is room to spare rather than badly late',
    (await parentFacts()).slack > 0 && (await parentFacts()).slack === 16,
    JSON.stringify(await parentFacts()));
ok('and the chart paints the bracket to match, rather than contradicting its own bar',
    await page.evaluate(() => {
        const bar = document.querySelector('.proj-gantt-row .proj-bar-parent');
        return !!bar && /proj-good/.test(bar.style.borderColor);
    }),
    await page.evaluate(() => {
        const bar = document.querySelector('.proj-gantt-row .proj-bar-parent');
        return bar ? bar.style.borderColor : 'no bracket';
    }));

// A leaf is still asked the question a leaf is asked: its own work, from today.
ok('a row with work of its own is still measured from today, as before',
    await page.evaluate((id) => {
        const dd = projGetData(id);
        const row = dd.rows.find(r => r.id === 'par-a');
        row.cells.deadline = projFormatDate(projToday() + 40 * PROJ_DAY);
        projSetData(id, dd);
        return projSlackDays(dd, row);
    }, toolId) === 11,
    String(await page.evaluate((id) => projSlackDays(projGetData(id),
        projGetData(id).rows.find(r => r.id === 'par-a')), toolId)));

// 14j. What gives way when the table is wider than the window. Every text cell is
// `width: 100%; min-width: 0`, so the browser takes the space back from whichever
// column will give it — and it took it from the name of the task, which is the one
// cell a row cannot be read without.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true, collapsed: false }));
    dd.rows = [
        { id: 'w-long', cells: { item: 'Discovery of the existing schema', size: 'M', pct: 0,
            deps: [], links: [], resources: ['John'] } },
        { id: 'w-dep', cells: { item: 'Build the ingestion pipeline', size: 'L', pct: 0,
            deps: ['w-long'], links: [], resources: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(600);

const cutOff = (selector) => page.evaluate((s) =>
    [...document.querySelectorAll(s)].map(el => el.scrollWidth > el.clientWidth + 1), selector);

ok('a long task name is shown whole, however many columns are fighting for room',
    (await cutOff('.proj-cell-item')).every(c => !c), JSON.stringify(await cutOff('.proj-cell-item')));
ok('and so is the title it is part of, which is longer still',
    (await cutOff('.proj-title-text')).every(c => !c), JSON.stringify(await cutOff('.proj-title-text')));
ok('the task field holds a floor rather than a preference, so nothing can squeeze it',
    await page.evaluate(() => {
        const el = document.querySelector('.proj-cell-item');
        return /ch$/.test(el.style.minWidth) && parseInt(el.style.minWidth, 10) > 20;
    }),
    await page.evaluate(() => document.querySelector('.proj-cell-item').style.minWidth));
await page.fill(sel('tr[data-row="w-long"] input[data-col="item"]'),
    'Discovery of the existing schema and everything that reads from it');
await page.waitForTimeout(400);
ok('and the floor moves as the name is typed, not only when the table is redrawn',
    await page.evaluate(() => {
        const el = document.querySelector('.proj-cell-item');
        return el.scrollWidth <= el.clientWidth + 1;
    }),
    await page.evaluate(() => document.querySelector('.proj-cell-item').style.minWidth));

// The chip is the column that should give way: it names a row that is already in
// the table, and now names it twice over.
const chipText = () => page.evaluate(() =>
    [...document.querySelectorAll('tr[data-row="w-dep"] .proj-chip-text')].map(c => c.textContent));
ok('a dependency chip carries the number and the name both',
    (await chipText())[0].startsWith('1 \u00B7 Discovery'), JSON.stringify(await chipText()));
ok('and it is the thing that gets cut when there is not room for everything',
    await page.evaluate(() => {
        const c = document.querySelector('tr[data-row="w-dep"] .proj-chip-text');
        return c.scrollWidth > c.clientWidth + 1;
    }),
    await page.evaluate(() => {
        const c = document.querySelector('tr[data-row="w-dep"] .proj-chip-text');
        return c.scrollWidth + ' vs ' + c.clientWidth;
    }));
ok('cut from the end, so the number that decides which row it is survives',
    await page.evaluate(() => {
        const c = document.querySelector('tr[data-row="w-dep"] .proj-chip-text');
        return getComputedStyle(c).textOverflow === 'ellipsis' &&
            c.getBoundingClientRect().width > 40;
    }));
ok('with the whole of it in the tooltip for whoever needs the rest',
    (await page.getAttribute(sel('tr[data-row="w-dep"] .proj-chip-text'), 'title'))
        .endsWith('Discovery of the existing schema and everything that reads from it'),
    await page.getAttribute(sel('tr[data-row="w-dep"] .proj-chip-text'), 'title'));
ok('while a short chip is left alone — it is length that is the problem, not chips',
    await page.evaluate(() => {
        const c = [...document.querySelectorAll('tr[data-row="w-long"] .proj-chip-text')]
            .find(x => x.textContent === 'John');
        return !!c && c.scrollWidth <= c.clientWidth + 1;
    }));

// 15. The ladder: each rung built from the one below, and a week that can be made of
//     working days rather than calendar ones.
//
// Pinned to a five-day week with weekends off rather than to the defaults: what is
// under test is the machinery — rungs multiply, a working week bends the calendar,
// periods are named by where they sit — and the defaults are a choice about one
// plan's shape, asserted where the tool opens.
//
// Written so it does not depend on what day it runs. Anything that would — "ten
// working days from today ends on the 16th" — is asserted as a relationship or
// against a date named outright.
await page.evaluate((id) => {
    const dd = projGetData(id);
    // No planning week here: what is under test is the chain of rungs, and the week
    // that breaks the multiplication gets a section of its own below.
    dd.units = { ...PROJ_DEFAULT_UNITS, daysPerWeek: 5, sprintsPerTimebox: 3,
        planningWeeks: 0, skipWeekends: true };
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);

const ladder = () => page.evaluate((id) => projUnitDays(projUnits(projGetData(id))), toolId);
ok('a week is 5 days, a sprint 2 weeks, a timebox 3 sprints and a quarter 2 timeboxes',
    JSON.stringify(await ladder()) === JSON.stringify({ day: 1, week: 5, sprint: 10, timebox: 30, planning: 0, quarter: 60 }),
    JSON.stringify(await ladder()));
ok('the strip says what each rung comes to, so the chain is never arithmetic to do',
    /5 d/.test(await page.textContent(sel('.proj-units'))) &&
    /60 d/.test(await page.textContent(sel('.proj-units'))),
    (await page.textContent(sel('.proj-units'))).replace(/\s+/g, ' ').trim());

// Changing a rung moves everything above it and nothing below.
await page.fill(sel('.proj-units input[data-unit="weeksPerSprint"]'), '3');
await page.waitForTimeout(400);
ok('a longer sprint lengthens the timebox and the quarter, and leaves the week alone',
    JSON.stringify(await ladder()) === JSON.stringify({ day: 1, week: 5, sprint: 15, timebox: 45, planning: 0, quarter: 90 }),
    JSON.stringify(await ladder()));
await page.fill(sel('.proj-units input[data-unit="weeksPerSprint"]'), '2');
await page.waitForTimeout(400);

const says = await page.evaluate((id) => {
    const u = projUnits(projGetData(id));
    return [5, 10, 30, 60, 20, 7].map(n => projSayDuration(n, u));
}, toolId);
ok('a duration is said in the largest rung it fits exactly',
    says.join('|') === '1 week|1 sprint|1 timebox|1 quarter|2 sprints|7 days', says.join('|'));

// The working week, against days named outright rather than against today.
const week = await page.evaluate((id) => {
    const u = projUnits(projGetData(id));
    const at = (iso) => Date.parse(iso + 'T00:00:00');
    return {
        sat: projIsWorkday(at('2026-01-03'), u),      // a Saturday
        sun: projIsWorkday(at('2026-01-04'), u),
        mon: projIsWorkday(at('2026-01-05'), u),
        fourDayFri: projIsWorkday(at('2026-01-02'), { ...u, daysPerWeek: 4 }),  // Friday, off
        sevenDaySun: projIsWorkday(at('2026-01-04'), { ...u, daysPerWeek: 7 })
    };
}, toolId);
ok('a Saturday and a Sunday are not working days', week.sat === false && week.sun === false, JSON.stringify(week));
ok('a Monday is', week.mon === true, JSON.stringify(week));
ok('a four-day week takes Friday off as well', week.fourDayFri === false, JSON.stringify(week));
ok('and a seven-day week takes nothing off', week.sevenDaySun === true, JSON.stringify(week));

const spans = await page.evaluate((id) => {
    const u = projUnits(projGetData(id));
    const flat = { ...u, skipWeekends: false };
    return {
        tenWork: projFinishOffset(10, u),
        tenFlat: projFinishOffset(10, flat),
        fourWork: projFinishOffset(4, u),
        fourFlat: projFinishOffset(4, flat),
        zero: projFinishOffset(0, u)
    };
}, toolId);
ok('ten days of work reaches past ten days of calendar once weekends are skipped',
    spans.tenWork > spans.tenFlat && spans.tenFlat === 10, JSON.stringify(spans));
// Two, three or four days off, depending on which day of the week today happens to
// be — from a Monday the span covers one weekend, from a Saturday it covers two and
// the Saturday itself. Stated as the range rather than the case, so it does not
// depend on the day this runs.
ok('by exactly the days off it crosses — at least one weekend, never more than two',
    spans.tenWork - spans.tenFlat >= 2 && spans.tenWork - spans.tenFlat <= 4,
    JSON.stringify(spans));
ok('and it ends on a working day, whatever day it started on', await page.evaluate((id) => {
    const u = projUnits(projGetData(id));
    return projIsWorkday(projToday() + (projFinishOffset(10, u) - 1) * 86400000, u);
}, toolId));
ok('four days of work may cross one weekend or none, never more',
    spans.fourWork - spans.fourFlat <= 2 && spans.fourWork >= spans.fourFlat, JSON.stringify(spans));
ok('and nothing left to do finishes now', spans.zero === 0, JSON.stringify(spans));

// Periods are whole weeks of calendar, which is what makes them line up.
const periods = await page.evaluate((id) => {
    const u = projUnits(projGetData(id));
    return {
        sprint: projPeriodCalendarDays(u, 'sprints'),
        timebox: projPeriodCalendarDays(u, 'timeboxes'),
        quarter: projPeriodCalendarDays(u, 'quarters'),
        flatSprint: projPeriodCalendarDays({ ...u, skipWeekends: false }, 'sprints')
    };
}, toolId);
ok('a sprint of two five-day weeks occupies fourteen calendar days',
    periods.sprint === 14, JSON.stringify(periods));
ok('a timebox three of those, and a quarter two timeboxes',
    periods.timebox === 42 && periods.quarter === 84, JSON.stringify(periods));
ok('without a planning week the quarter is twelve weeks, which is not the calendar\'s thirteen',
    periods.quarter === 84 && periods.quarter < 91, String(periods.quarter));
ok('and with weekends off a sprint is simply its ten days',
    periods.flatSprint === 10, JSON.stringify(periods));

// Quarter numbering, counted from the year start — calendar or fiscal.
const labels = await page.evaluate((id) => {
    const u = projUnits(projGetData(id));
    const at = (iso) => Date.parse(iso + 'T00:00:00');
    const cal = { ...u, yearMode: 'calendar' };
    const fis = { ...u, yearMode: 'fiscal', fiscalStartMonth: 4 };
    const oct = { ...u, yearMode: 'fiscal', fiscalStartMonth: 10 };
    const jan = { ...u, yearMode: 'fiscal', fiscalStartMonth: 1 };
    return {
        janCal: projPeriodLabel(cal, 'quarters', at('2026-01-02')),
        aprCal: projPeriodLabel(cal, 'quarters', at('2026-04-02')),
        janFis: projPeriodLabel(fis, 'quarters', at('2026-01-02')),
        aprFis: projPeriodLabel(fis, 'quarters', at('2026-04-02')),
        octFis: projPeriodLabel(oct, 'quarters', at('2026-10-02')),
        sepFis: projPeriodLabel(oct, 'quarters', at('2027-09-01')),
        janStartFis: projPeriodLabel(jan, 'quarters', at('2026-02-02')),
        yearStartCal: new Date(projYearStart(cal, at('2026-06-01'))).toISOString().slice(0, 10),
        yearStartFis: new Date(projYearStart(fis, at('2026-06-01'))).toISOString().slice(0, 10),
        beforeStart: new Date(projYearStart(fis, at('2026-02-01'))).toISOString().slice(0, 10)
    };
}, toolId);
// The year is part of the name, calendar or fiscal: a plan that runs eighteen months
// has two Q1s in it, and a quarter without a year is half an answer.
ok('a calendar year begins in January and its first quarter is its own year\'s Q1',
    labels.yearStartCal === '2026-01-01' && labels.janCal === '2026 Q1', JSON.stringify(labels));
ok('and by April it is into Q2', labels.aprCal === '2026 Q2', JSON.stringify(labels));
ok('a fiscal year begins in the month it is given, and April is its Q1',
    labels.yearStartFis === '2026-04-01' && labels.aprFis === 'FY27 Q1', JSON.stringify(labels));
ok('while January still belongs to the fiscal year that began the April before',
    labels.beforeStart === '2025-04-01' && /^FY26 Q4$/.test(labels.janFis), JSON.stringify(labels));
// Named for the year it ends in: October 2026 opens the year that closes in
// September 2027, and that year is FY27 throughout.
ok('October 2026 is FY27, not FY26', /^FY27 /.test(labels.octFis), JSON.stringify(labels));

// 14k. Finished work has no slack. Slack is room still to be used, and a task that
//      is done has nothing left to use it: left alone, a row finished last month
//      would report a healthier green every day, which reads as news about work
//      that is over.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.columns = PROJ_BUILTIN_COLUMNS.map(c => ({ ...c, builtin: true }));
    dd.sizes = { ...PROJ_DEFAULT_SIZES };
    const day = 86400000, t = projToday();
    const iso = (n) => projFormatDate(t + n * day);
    dd.rows = [
        { id: 'done-top', cells: { item: 'Project', size: '', pct: 0, deadline: iso(20), deps: [], links: [] } },
        { id: 'done-a', parent: 'done-top', cells: { item: 'Finished', size: 'M', pct: 100, deadline: iso(10), deps: [], links: [] } },
        { id: 'done-b', parent: 'done-top', cells: { item: 'Still going', size: 'M', pct: 50, deadline: iso(10), deps: [], links: [] } },
        // A deadline it is well past, and done anyway: the one that would otherwise
        // read as late forever.
        { id: 'done-late', cells: { item: 'Late but done', size: 'S', pct: 100, deadline: iso(-30), deps: [], links: [] } },
        // Unfinished and undated: the other reason a cell holds a dash.
        { id: 'done-none', cells: { item: 'No deadline', size: 'S', pct: 0, deadline: '', deps: [], links: [] } }
    ];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);

// Slack is the third of a row's calculated cells, read by position as everywhere
// else here, with its tooltip: the dash has two meanings and the tooltip is which.
const slackCell = (rowId) => page.evaluate((r) => {
    const cells = [...document.querySelectorAll('tr[data-row="' + r + '"] .proj-calc')];
    const cell = cells[2];
    return cell ? { text: cell.textContent.trim(), title: cell.getAttribute('title') || '' } : null;
}, rowId);
const slackOf = (rowId) => page.evaluate((args) => {
    const dd = projGetData(args[0]);
    return projSlackDays(dd, dd.rows.find(r => r.id === args[1]));
}, [toolId, rowId]);

ok('a finished task is asked for no slack at all', (await slackOf('done-a')) === null,
    JSON.stringify(await slackCell('done-a')));
ok('and its cell shows a dash rather than a number', (await slackCell('done-a')).text === '\u2014',
    JSON.stringify(await slackCell('done-a')));
ok('which says it is finished, not that there was nothing to measure against',
    /finish/i.test((await slackCell('done-a')).title),
    JSON.stringify(await slackCell('done-a')));
ok('a task finished long after its deadline is not reported as still late',
    (await slackOf('done-late')) === null && (await slackCell('done-late')).text === '\u2014',
    JSON.stringify(await slackCell('done-late')));
ok('the row beside it, which is only half done, still has its number',
    typeof (await slackOf('done-b')) === 'number' && /d$/.test((await slackCell('done-b')).text),
    JSON.stringify(await slackCell('done-b')));
ok('a dash for want of a deadline says that instead, since they are not the same thing to know',
    /deadline/i.test((await slackCell('done-none')).title),
    JSON.stringify(await slackCell('done-none')));
ok('a project with work left in it keeps its own slack',
    typeof (await slackOf('done-top')) === 'number', String(await slackOf('done-top')));

// And a parent is done when everything under it is, which is what its own weighted
// per cent already says — so finishing the last sub-item is what takes its slack away.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows.find(r => r.id === 'done-b').cells.pct = 100;
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
ok('finishing the last sub-item takes the project\'s slack away too',
    (await slackOf('done-top')) === null && (await slackCell('done-top')).text === '\u2014',
    JSON.stringify(await slackCell('done-top')));
ok('and a spreadsheet gets an empty cell rather than a stale number',
    await page.evaluate((id) => {
        const dd = projGetData(id);
        const col = dd.columns.findIndex(c => c.type === 'calcSlack');
        const rows = projCsvParse(projToCsv(dd));
        const of = (rowId) => rows.find(r => r[2] === projCell(
            dd.rows.find(x => x.id === rowId), 'item'));
        return of('done-top')[col] === '' && of('done-late')[col] === '';
    }, toolId));
ok('the chart draws finished rows as dots, so it never needed a colour for them',
    await page.evaluate(() => document.querySelectorAll('.proj-gantt-row .proj-done-dot').length >= 3 &&
        document.querySelectorAll('.proj-gantt-row .proj-bar').length === 1),
    await page.evaluate(() => document.querySelectorAll('.proj-gantt-row .proj-done-dot').length +
        ' dots, ' + document.querySelectorAll('.proj-gantt-row .proj-bar').length + ' bars'));

// 15c. The planning week: the week that makes a quarter thirteen rather than twelve.
//      Two timeboxes of three sprints are 84 days; a quarter is 91. That last week is
//      not a sprint, is not pretended to be one, and is called P.
const planning = await page.evaluate((id) => {
    const u = { ...PROJ_DEFAULT_UNITS, yearMode: 'calendar', periodStart: '' };
    const day = (n) => projParseDate('2026-01-01') + n * 86400000;
    const names = [];
    // One quarter, read at the middle of each period so a boundary cannot decide it.
    for (let d = 1; d < 91; d += 7) names.push(projPeriodLabel(u, 'sprints', day(d)));
    const spans = projPeriodSpans(u, 'sprints', 0, 0, 90).map(s => s.length);
    return {
        plan: projQuarterPlan(u),
        unique: names.filter((n, i) => names.indexOf(n) === i),
        spans: spans,
        afterQuarter: projPeriodLabel(u, 'sprints', day(91)),
        timeboxAxis: projPeriodLabel(u, 'timeboxes', day(85)),
        quarterAxis: projPeriodLabel(u, 'quarters', day(85)),
        short: projPeriodShortLabel(u, 'sprints', day(85))
    };
}, toolId);
ok('a quarter is two timeboxes and a planning week — 91 days, not 84',
    planning.plan.quarter === 91 && planning.plan.timebox === 42 && planning.plan.planning === 7,
    JSON.stringify(planning.plan));
ok('which is six sprints and then the week, in that order',
    planning.spans.join(',') === '14,14,14,14,14,14,7', JSON.stringify(planning.spans));
ok('named the way the plan is read out', planning.unique.join(' | ') ===
    '2026 Q1 T1 S1 | 2026 Q1 T1 S2 | 2026 Q1 T1 S3 | 2026 Q1 T2 S1 | 2026 Q1 T2 S2 | ' +
    '2026 Q1 T2 S3 | 2026 Q1 P',
    planning.unique.join(' | '));
ok('the planning week has no timebox and no sprint number, because it is neither',
    /Q1 P$/.test(planning.unique[6]) && !/T\d/.test(planning.unique[6]), planning.unique[6]);
ok('and it is P on a timebox axis too, where a timebox would be',
    planning.timeboxAxis === '2026 Q1 P' && planning.short === 'P',
    planning.timeboxAxis + ' / ' + planning.short);
ok('while a quarter axis says only the quarter, which the week is part of',
    planning.quarterAxis === '2026 Q1', planning.quarterAxis);
ok('the next quarter starts the sprints again, on time',
    planning.afterQuarter === '2026 Q2 T1 S1', planning.afterQuarter);

// On the chart, where the periods are walked rather than stepped.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.units = { ...PROJ_DEFAULT_UNITS, axis: 'sprints', periodStart: projFormatDate(projToday()) };
    // Far enough out to reach past the sixth sprint, which is where the planning
    // week is: a chart that stops at 84 days has nothing to say about day 85.
    dd.rows = [{ id: 'r-long', cells: { item: 'Long', size: 'XL', pct: 0,
        deadline: projFormatDate(projToday() + 120 * 86400000), deps: [], links: [] } }];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(500);
const axisText = await page.evaluate(() =>
    [...document.querySelectorAll('.proj-tick')].map(t => t.getAttribute('title')));
ok('a planning week is drawn and named on the axis',
    axisText.some(t => / P \u00B7 /.test(t)), JSON.stringify(axisText.slice(0, 8)));
ok('and it runs seven days, where a sprint runs fourteen', await page.evaluate(() => {
    const spans = [...document.querySelectorAll('.proj-tick')]
        .map(t => (t.getAttribute('title') || '').match(/(\d{4}-\d\d-\d\d) to (\d{4}-\d\d-\d\d)/))
        .filter(Boolean)
        .map(m => Math.round((Date.parse(m[2]) - Date.parse(m[1])) / 86400000) + 1);
    return spans.indexOf(7) >= 0 && spans.indexOf(14) >= 0;
}), JSON.stringify(axisText.slice(0, 3)));

// Put the ladder back to what the sections below were written against.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.units = { ...PROJ_DEFAULT_UNITS };
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);

// 15b. Where the counting starts. A plan's first sprint rarely begins on the first
//      of a month, so the day Q1 T1 S1 begins can be named outright.
const cycle = await page.evaluate((id) => {
    const at = (iso) => projParseDate(iso);
    const base = { ...projUnits(projGetData(id)), yearMode: 'calendar', periodStart: '' };
    const pinned = { ...base, periodStart: '2026-03-02' };
    const iso = (ms) => projFormatDate(ms);
    return {
        unpinned: iso(projYearStart(base, at('2026-06-01'))),
        pinned: iso(projYearStart(pinned, at('2026-06-01'))),
        before: iso(projYearStart(pinned, at('2026-02-01'))),
        nextYear: iso(projYearStart(pinned, at('2027-05-01'))),
        firstLabel: projPeriodLabel(pinned, 'sprints', at('2026-03-03')),
        beforeLabel: projPeriodLabel(pinned, 'sprints', at('2026-03-01'))
    };
}, toolId);
ok('with nothing named, the counting starts where the year does',
    cycle.unpinned === '2026-01-01', JSON.stringify(cycle));
ok('a named day is where Q1 T1 S1 begins instead',
    cycle.pinned === '2026-03-02' && /Q1 T1 S1$/.test(cycle.firstLabel), JSON.stringify(cycle));
ok('the day before it belongs to the cycle that began a year earlier',
    cycle.before === '2025-03-02' && !/Q1 T1 S1$/.test(cycle.beforeLabel), JSON.stringify(cycle));
ok('and the cycle comes round on that same day every year',
    cycle.nextYear === '2027-03-02', JSON.stringify(cycle));

// The control for it sits with the other settings, saying what it would be anyway.
const cycleField = sel('.proj-unit-date[data-unit="periodStart"]');
ok('the settings offer the date, filled in with the one the year implies',
    (await page.inputValue(cycleField)) === '2026-01-01' &&
    await page.evaluate((s) => document.querySelector(s).classList.contains('proj-when-derived'), cycleField),
    await page.inputValue(cycleField));
await page.fill(cycleField, '2026-03-02');
await page.waitForTimeout(400);
ok('typing one pins it', (await data()).units.periodStart === '2026-03-02',
    String((await data()).units.periodStart));
ok('and it stops calling itself worked out',
    await page.evaluate((s) => !document.querySelector(s).classList.contains('proj-when-derived'), cycleField));
ok('the chart counts its periods from there',
    await page.evaluate((id) => projPeriodLabel(projUnits(projGetData(id)), 'sprints',
        projParseDate('2026-03-03')), toolId).then(l => /Q1 T1 S1$/.test(l)),
    await page.evaluate((id) => projPeriodLabel(projUnits(projGetData(id)), 'sprints',
        projParseDate('2026-03-03')), toolId));
await page.click(sel('.proj-unit-field [onclick^="projClearPeriodStart"]'));
await page.waitForTimeout(400);
ok('and the \u21BA hands the counting back to the year',
    (await data()).units.periodStart === '' &&
    (await page.inputValue(cycleField)) === '2026-01-01',
    (await data()).units.periodStart + ' / ' + await page.inputValue(cycleField));
ok('and the September it ends in is still FY27', /^FY27 /.test(labels.sepFis), JSON.stringify(labels));
ok('a fiscal year that starts in January is simply that year',
    /^FY26 /.test(labels.janStartFis), JSON.stringify(labels));

// A period is named by where it sits in the ladder, each number counted inside its
// parent: the second quarter's first sprint is Q2 T1 S1, not S7.
const paths = await page.evaluate((id) => {
    const u = { ...projUnits(projGetData(id)), yearMode: 'fiscal', fiscalStartMonth: 10 };
    const start = projYearStart(u, Date.parse('2026-10-05T00:00:00'));
    const day = (n) => start + n * 86400000;
    const sprint = projPeriodCalendarDays(u, 'sprints');
    const timebox = projPeriodCalendarDays(u, 'timeboxes');
    const quarter = projPeriodCalendarDays(u, 'quarters');
    return {
        firstSprint: projPeriodLabel(u, 'sprints', day(0)),
        secondSprint: projPeriodLabel(u, 'sprints', day(sprint)),
        secondTimebox: projPeriodLabel(u, 'sprints', day(timebox)),
        secondQuarter: projPeriodLabel(u, 'sprints', day(quarter)),
        quarterOnly: projPeriodLabel(u, 'quarters', day(quarter)),
        timeboxOnly: projPeriodLabel(u, 'timeboxes', day(timebox)),
        short: projPeriodShortLabel(u, 'sprints', day(sprint))
    };
}, toolId);
ok('the first sprint of the fiscal year is FY27 Q1 T1 S1',
    paths.firstSprint === 'FY27 Q1 T1 S1', JSON.stringify(paths));
ok('the next one is S2 of the same timebox', paths.secondSprint === 'FY27 Q1 T1 S2', JSON.stringify(paths));
ok('a new timebox starts its sprints again at S1', paths.secondTimebox === 'FY27 Q1 T2 S1', JSON.stringify(paths));
ok('and a new quarter starts both again — FY27 Q2 T1 S1',
    paths.secondQuarter === 'FY27 Q2 T1 S1', JSON.stringify(paths));
ok('a quarter axis names only as far as the quarter', paths.quarterOnly === 'FY27 Q2', JSON.stringify(paths));
ok('and a timebox axis as far as the timebox', paths.timeboxOnly === 'FY27 Q1 T2', JSON.stringify(paths));
ok('the short form is the rung on its own, for a crowded axis',
    paths.short === 'S2', JSON.stringify(paths));

// The chart can be marked out in any of them.
const axisFor = async (mode) => {
    await page.evaluate((args) => {
        const [id, m] = args;
        const dd = projGetData(id);
        dd.units = { ...projUnits(dd), axis: m };
        // Long enough to cross a quarter boundary: a window shorter than a quarter has
        // a quarter's name to show but no boundary in it, and this is about both.
        dd.rows = [{ id: 'a-one', cells: { item: 'Long one', size: 'XL', pct: 0,
            deadline: projFormatDate(projToday() + 200 * 86400000), deps: [], links: [] } }];
        projSetData(id, dd);
        projOnRender(id);
    }, [toolId, mode]);
    await page.waitForTimeout(400);
    return page.evaluate(() => ({
        bands: document.querySelectorAll('.proj-axis .proj-period').length,
        labels: [...document.querySelectorAll('.proj-tick')].map(t => t.textContent).join(',')
    }));
};
let ax = await axisFor('dates');
ok('the dates axis is marked in dates', /\d\d-\d\d/.test(ax.labels) && ax.bands === 0, JSON.stringify(ax));
ax = await axisFor('sprints');
ok('a sprint axis names sprints and draws their boundaries',
    /S\d/.test(ax.labels) && ax.bands > 0, JSON.stringify(ax));
ok('and writes the path out in full at least where the quarter changes',
    /Q\d T\d S\d/.test(ax.labels), ax.labels);
// The year rides along with the rest of the path: a plan that runs eighteen months
// has two Q1s in it, and a quarter without a year is half an answer.
ok('and the full path carries the year it is in',
    /(\d{4}|FY\d\d) Q\d T\d S\d/.test(ax.labels), ax.labels);

// Knowing which sprint something lands in is only half of it; the other half is
// when that sprint starts.
// A short chart, so the periods have room for both dates: a year of sprints on one
// screen is where the axis thins them back to the start date alone.
await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.rows = [{ id: 'a-short', cells: { item: 'A month or so', size: 'L', pct: 0,
        deadline: '', deps: [], links: [] } }];
    projSetData(id, dd);
    projOnRender(id);
}, toolId);
await page.waitForTimeout(400);
const dated = await page.evaluate(() => [...document.querySelectorAll('.proj-tick')].map(t => ({
    text: t.textContent,
    date: (t.querySelector('.proj-tick-date') || {}).textContent || '',
    title: t.getAttribute('title')
})));
ok('every period says when it starts and when it ends', dated.length > 0 &&
    dated.every(d => /^\d\d-\d\d \u2013 \d\d-\d\d$/.test(d.date)), JSON.stringify(dated.slice(0, 3)));
ok('and carries both in full in the tooltip, where the year is not cut off',
    dated.every(d => /\d{4}-\d\d-\d\d to \d{4}-\d\d-\d\d$/.test(d.title)), JSON.stringify(dated.slice(0, 2)));
ok('a period ends the day before the next one starts, so none of them overlap',
    await page.evaluate(() => {
        const spans = [...document.querySelectorAll('.proj-tick')]
            .map(t => (t.getAttribute('title') || '').match(/(\d{4}-\d\d-\d\d) to (\d{4}-\d\d-\d\d)/))
            .filter(Boolean);
        return spans.length > 1 && spans.slice(1).every((m, i) =>
            Date.parse(m[1]) - Date.parse(spans[i][2]) === 86400000);
    }));

// The dates are the boundaries themselves: one period apart, in order.
const gaps = await page.evaluate((id) => {
    const u = projUnits(projGetData(id));
    // The ticks show month and day only, so the year has to be carried: a date
    // that goes backwards is January, not three hundred days ago.
    // The start of each range, which is the boundary the gap is measured between.
    const dates = [...document.querySelectorAll('.proj-tick-date')]
        .map(e => e.textContent.split('\u2013')[0].trim());
    let year = new Date().getFullYear(), previous = -Infinity;
    const ms = dates.map(d => {
        let t = Date.parse(year + '-' + d + 'T00:00:00');
        if (t < previous) { year++; t = Date.parse(year + '-' + d + 'T00:00:00'); }
        previous = t;
        return t;
    });
    const diffs = [];
    for (let i = 1; i < ms.length; i++) diffs.push(Math.round((ms[i] - ms[i - 1]) / 86400000));
    return { period: projPeriodCalendarDays(u, 'sprints'),
             planning: projQuarterPlan(u).planning, diffs: diffs };
}, toolId);
// A sprint apart, except once a quarter, where the planning week sits between the
// last sprint of one quarter and the first of the next.
ok('each one a sprint after the last, or a planning week where one falls',
    gaps.diffs.length > 0 && gaps.diffs.every(d => d === gaps.period || d === gaps.planning),
    JSON.stringify(gaps));


const quarterDates = await page.evaluate((id) => {
    const dd = projGetData(id);
    dd.units = { ...projUnits(dd), axis: 'quarters' };
    projSetData(id, dd);
    projOnRender(id);
    return [...document.querySelectorAll('.proj-tick')].map(t => t.textContent);
}, toolId);
ok('a quarter axis dates its quarters too',
    quarterDates.every(t => /\d\d-\d\d$/.test(t)), JSON.stringify(quarterDates));
ax = await axisFor('timeboxes');
ok('a timebox axis names timeboxes', /T\d/.test(ax.labels) && ax.bands > 0, JSON.stringify(ax));
ax = await axisFor('quarters');
ok('and a quarter axis names quarters', /Q\d/.test(ax.labels) && ax.bands > 0, JSON.stringify(ax));
ok('the boundaries run down the rows, not only across the top',
    await page.evaluate(() => document.querySelectorAll('.proj-track .proj-period').length) > 0);

await page.selectOption(sel('.proj-axis-pick'), 'dates');
await page.waitForTimeout(400);
ok('and the picker puts it back', await page.evaluate((id) =>
    projGetData(id).units.axis, toolId) === 'dates');

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
await page.screenshot({ path: OUT + '/project-table.png' });
await browser.close();
