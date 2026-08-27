// Filling the grid: placing, moving, removing, and what it adds up to.
import { open, ok, finish, stored, place, CODE, OUT } from './curr-lib.mjs';

const { browser, page, errors } = await open();

const cards = () => page.evaluate(() => {
    const out = {};
    document.querySelectorAll('.curr-cell').forEach((cell) => {
        const titles = Array.from(cell.querySelectorAll('.curr-card-title')).map(e => e.textContent);
        if (titles.length) out[cell.getAttribute('data-term')] = titles;
    });
    return out;
});
const yearCredits = () => page.evaluate(() =>
    Array.from(document.querySelectorAll('.curr-year-head')).map(e => e.textContent));

// 1. The grid is four years of four terms, laid out as one full-year strip over
//    two semesters, with summer beside them.
const shape = await page.evaluate(() => ({
    cells: document.querySelectorAll('.curr-cell').length,
    terms: Array.from(document.querySelectorAll('.curr-cell')).map(c => c.getAttribute('data-term')),
    years: document.querySelectorAll('.curr-year').length,
    // The full-year cell must be as wide as the two semester cells together.
    fyWidth: Math.round(document.querySelector('.curr-cell.curr-fy').getBoundingClientRect().width),
    semsWidth: Math.round(document.querySelector('.curr-sems').getBoundingClientRect().width)
}));
ok('four years of four terms', shape.years === 4 && shape.cells === 16, shape.cells + ' cells');
ok('every term is addressable', shape.terms.slice(0, 4).join(',') === '9-FY,9-S1,9-S2,9-SUM',
    shape.terms.slice(0, 4).join(','));
ok('a full-year course has the width of both semesters',
    Math.abs(shape.fyWidth - shape.semsWidth) <= 1, shape.fyWidth + ' vs ' + shape.semsWidth);

// 2. Placing by tapping: pick a course, tap a cell. No mouse needed.
await place(page, 'Algebra I', '9-FY');
ok('a tapped course lands where it was tapped',
    JSON.stringify((await cards())['9-FY']) === '["Algebra I"]', JSON.stringify(await cards()));
ok('and it is saved', JSON.stringify((await stored(page)).plan['9-FY']) === '["' + CODE['Algebra I'] + '"]');

// 3. Placing by dragging, driven through the drag events themselves: Chromium's
//    mouse-level drag is not dependable under Playwright on rows this short — it
//    swallows the first drag of a page — and these handlers are what is under test.
await page.waitForTimeout(400);
await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === 'Biology');
    const cell = document.querySelector('.curr-cell[data-term="9-S1"]');
    const dt = new DataTransfer();
    row.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt }));
    const box = cell.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, dataTransfer: dt,
        clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 };
    cell.dispatchEvent(new DragEvent('dragover', opts));
    cell.dispatchEvent(new DragEvent('drop', opts));
});
await page.waitForTimeout(400);
ok('a dragged course lands in the cell it was dropped on',
    ((await cards())['9-S1'] || []).includes('Biology'), JSON.stringify(await cards()));

// 4. A course sits in one place: putting it somewhere else moves it.
await place(page, 'Biology', '10-FY');
const moved = await cards();
ok('placing it again moves it rather than copying it',
    !(moved['9-S1'] || []).includes('Biology') && (moved['10-FY'] || []).includes('Biology'),
    JSON.stringify(moved));

// 5. The summer column takes the summer course.
await place(page, 'Driver Education', '10-SUM');
ok('the summer course goes in the summer cell',
    ((await cards())['10-SUM'] || []).includes('Driver Education'), JSON.stringify(await cards()));

// 6. Credits add up per year and overall, against what the document requires.
await place(page, 'English 9', '9-FY');
await place(page, 'Government', '12-S1');
const credits = await yearCredits();
ok('a year totals the credits placed in it', /2.0 cr/.test(credits[0]), JSON.stringify(credits));
ok('and half-credit courses count as half', /0.5 cr/.test(credits[3]), JSON.stringify(credits));
const totals = await page.evaluate(() => document.querySelector('.curr-totals').textContent);
ok('the plan total is shown', /Planned4.0 credits/.test(totals.replace(/\s+/g, '')) ||
    /4.0 credits/.test(totals), totals.slice(0, 60));
ok('progress is tracked against each requirement in the document',
    /English/.test(totals) && /1.0 \/ 4.0/.test(totals), totals.slice(0, 200));
ok('and what is required but unplanned is named', /Required but not planned:/.test(totals));

// 7. Removing.
await page.evaluate(() => {
    const card = Array.from(document.querySelectorAll('.curr-card'))
        .find(c => c.textContent.includes('Government'));
    card.querySelector('.curr-card-x').click();
});
await page.waitForTimeout(300);
ok('the × takes a course out again', !JSON.stringify(await cards()).includes('Government'));
ok('and the empty term is not left behind in storage',
    !(await stored(page)).plan['12-S1'], JSON.stringify((await stored(page)).plan));

// 8. It all survives a reload.
await page.reload();
await page.waitForSelector('.tool[data-tool="cur"] .curr-widget');
await page.waitForTimeout(800);
const after = await cards();
ok('the plan comes back after a reload',
    JSON.stringify(after['9-FY']) === '["Algebra I","English 9"]' &&
    (after['10-SUM'] || []).includes('Driver Education'), JSON.stringify(after));

await page.screenshot({ path: OUT + '/curr-grid.png' });
await finish(browser, errors);
