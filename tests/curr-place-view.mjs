// Adding a course must not move the ground under you, and a level's name must fit
// on one line.
import { open, ok, finish, OUT } from './curr-lib.mjs';
const { browser, page, errors } = await open({ size: [1000, 560] });

// 1. The label column holds the longest level name the document produces, on one
//    line — "Grade 10" used to wrap onto two.
const labels = await page.evaluate(() => Array.from(document.querySelectorAll('.curr-year-head b'))
    .map((b) => {
        const line = parseFloat(getComputedStyle(b).lineHeight) || 14;
        return { text: b.textContent, height: Math.round(b.getBoundingClientRect().height),
            lines: Math.round(b.getBoundingClientRect().height / line), cut: b.scrollWidth > b.clientWidth + 1 };
    }));
ok('every level label is on one line', labels.every(l => l.lines <= 1), JSON.stringify(labels));
ok('and none of them is cut off', labels.every(l => !l.cut), JSON.stringify(labels));
ok('including the two-digit ones', labels.some(l => /10|11|12/.test(l.text)), JSON.stringify(labels.map(l => l.text)));

// 2. Adding a course from far down the catalog leaves the list where it was.
const scrollTo = async (title) => page.evaluate((t) => {
    const row = Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === t);
    row.scrollIntoView({ block: 'center' });
    return document.querySelector('.curr-list').scrollTop;
}, title);

const before = await scrollTo('Driver Education');
await page.waitForTimeout(300);
ok('the list can be scrolled down', before > 100, 'scrollTop ' + before);
await page.evaluate(() => {
    Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === 'Driver Education')
        .querySelector('.curr-add').click();
});
await page.waitForTimeout(400);
const after = await page.evaluate(() => document.querySelector('.curr-list').scrollTop);
ok('adding a course does not throw the list back to the top', after > before - 60,
    before + ' → ' + after);
ok('and the course was placed', await page.evaluate(() =>
    document.querySelectorAll('.curr-card').length === 1));
ok('the row it came from is still on screen', await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === 'Driver Education');
    const list = document.querySelector('.curr-list').getBoundingClientRect();
    const box = row.getBoundingClientRect();
    return box.top >= list.top - 1 && box.bottom <= list.bottom + 1;
}));

// 3. The same holds for the other things that redraw: ticking and selecting. What
//    matters is not the pixel but that the row you touched is still in front of you.
const visible = (title) => page.evaluate((t) => {
    const row = Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === t);
    if (!row) return false;
    const list = document.querySelector('.curr-list').getBoundingClientRect();
    const box = row.getBoundingClientRect();
    return box.top >= list.top - 1 && box.bottom <= list.bottom + 1;
}, title);

await page.evaluate(() => {
    Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === 'Driver Education')
        .querySelector('.curr-met').click();
});
await page.waitForTimeout(400);
ok('ticking a course off keeps it in front of you', await visible('Driver Education'));

await page.evaluate(() => {
    Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === 'Speech and Debate').click();
});
await page.waitForTimeout(400);
ok('selecting a course keeps it in front of you', await visible('Speech and Debate'));
ok('and the list is nowhere near the top', await page.evaluate(() =>
    document.querySelector('.curr-list').scrollTop) > 400, await page.evaluate(() =>
    document.querySelector('.curr-list').scrollTop));

// 4. And the grid pane keeps its own scroll.
await page.evaluate(() => { document.querySelector('.curr-pane').scrollTop = 60; });
await page.waitForTimeout(200);
await page.evaluate(() => {
    Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === 'Biology')
        .querySelector('.curr-add').click();
});
await page.waitForTimeout(400);
ok('the grid keeps its scroll too', Math.abs(await page.evaluate(() =>
    document.querySelector('.curr-pane').scrollTop) - 60) < 6, await page.evaluate(() =>
    document.querySelector('.curr-pane').scrollTop));

await page.screenshot({ path: OUT + '/curr-place-view.png' });
await finish(browser, errors);
