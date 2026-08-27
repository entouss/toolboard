// Putting the courses in a cell in the order you want them.
import { open, ok, finish, stored, place, CODE, OUT } from './curr-lib.mjs';

const { browser, page, errors } = await open({
    plan: { '9-FY': [CODE['Algebra I'], CODE['English 9'], CODE['Biology'], CODE['Theology 9']] }
});

const order = (term = '9-FY') => page.evaluate((t) =>
    Array.from(document.querySelectorAll('.curr-cell[data-term="' + t + '"] .curr-card-title'))
        .map(e => e.textContent), term);
const storedOrder = async (term = '9-FY') => (await stored(page)).plan[term];
// Chromium's own drag-and-drop, driven through the events the tool listens for.
// Playwright's mouse-level dragTo is not dependable on cards this short — it drops
// the first drag of a page entirely — and the wiring under test is these handlers.
const dragOnto = async (from, to, half, fromCatalog) => {
    await page.evaluate(({ from, to, half, fromCatalog }) => {
        const find = (sel, t) => Array.from(document.querySelectorAll(sel))
            .find(e => e.querySelector(sel === '.curr-card' ? '.curr-card-title' : '.curr-course-title')
                .textContent === t);
        const src = fromCatalog ? find('.curr-course', from) : find('.curr-card', from);
        const dst = find('.curr-card', to);
        const dt = new DataTransfer();
        src.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt }));
        const box = dst.getBoundingClientRect();
        const opts = { bubbles: true, cancelable: true, dataTransfer: dt,
            clientX: box.left + 40, clientY: box.top + box.height * (half === 'top' ? 0.25 : 0.75) };
        dst.dispatchEvent(new DragEvent('dragover', opts));
        dst.dispatchEvent(new DragEvent('drop', opts));
    }, { from, to, half, fromCatalog });
    await page.waitForTimeout(350);
};
const select = async (title) => {
    await page.evaluate((t) => {
        Array.from(document.querySelectorAll('.curr-card'))
            .find(c => c.querySelector('.curr-card-title').textContent === t).click();
    }, title);
    await page.waitForTimeout(250);
};

// 1. The cell starts in the order it was given.
ok('the cell lists its courses in order',
    JSON.stringify(await order()) === JSON.stringify(['Algebra I', 'English 9', 'Biology', 'Theology 9']),
    JSON.stringify(await order()));

// 2. Dragging a card onto one above it puts it there.
await dragOnto('Theology 9', 'English 9', 'top');
ok('dropping on the top half of a card lands above it',
    JSON.stringify(await order()) === JSON.stringify(['Algebra I', 'Theology 9', 'English 9', 'Biology']),
    JSON.stringify(await order()));
ok('and the new order is what is saved',
    JSON.stringify(await storedOrder()) === JSON.stringify(
        [CODE['Algebra I'], CODE['Theology 9'], CODE['English 9'], CODE['Biology']]),
    JSON.stringify(await storedOrder()));

// 3. Dropping on the lower half lands below.
await dragOnto('Algebra I', 'Biology', 'bottom');
ok('dropping on the bottom half lands below it',
    JSON.stringify(await order()) === JSON.stringify(['Theology 9', 'English 9', 'Biology', 'Algebra I']),
    JSON.stringify(await order()));

// 4. Reordering must not disturb the plan itself.
ok('nothing left the cell', (await order()).length === 4);
ok('and nothing was duplicated', new Set(await storedOrder()).size === 4, JSON.stringify(await storedOrder()));
ok('no issue was invented by moving things about', await page.evaluate(() =>
    currValidate(currGetData('cur')).issues.filter(i => i.severity === 'error').length === 0));

// 5. Without a mouse: the selected card can be walked up and down.
console.log('  (order before the arrows: ' + JSON.stringify(await order()) + ')');
await select('Biology');
await page.waitForTimeout(300);
ok('the selected card gets arrows', await page.evaluate(() =>
    document.querySelectorAll('.curr-card.selected .curr-card-move').length === 2));
ok('and other cards do not', await page.evaluate(() =>
    document.querySelectorAll('.curr-card:not(.selected) .curr-card-move').length === 0));
await page.click('.curr-card.selected .curr-card-move');
await page.waitForTimeout(400);
ok('the up arrow moves it up one',
    JSON.stringify(await order()) === JSON.stringify(['Theology 9', 'Biology', 'English 9', 'Algebra I']),
    JSON.stringify(await order()));
await page.click('.curr-card.selected .curr-card-move:nth-of-type(2)');
await page.waitForTimeout(350);
ok('and the down arrow puts it back',
    JSON.stringify(await order()) === JSON.stringify(['Theology 9', 'English 9', 'Biology', 'Algebra I']),
    JSON.stringify(await order()));

// 6. The ends stop rather than wrapping.
await select('Theology 9');
ok('the first card cannot go up', await page.evaluate(() =>
    document.querySelector('.curr-card.selected .curr-card-move').disabled));
await select('Algebra I');
ok('and the last cannot go down', await page.evaluate(() =>
    document.querySelectorAll('.curr-card.selected .curr-card-move')[1].disabled));

// 7. A single course has nothing to reorder against.
await page.evaluate(() => {
    const data = currGetData('cur');
    data.plan = { '9-FY': [data.plan['9-FY'][0]] };
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(300);
await select('Theology 9');
ok('a lone card has no arrows', await page.evaluate(() =>
    document.querySelectorAll('.curr-card .curr-card-move').length === 0));

// 8. Dragging a course from the catalog onto a card still places it, at that spot.
await page.evaluate(() => {
    const data = currGetData('cur');
    data.plan = { '9-FY': [data.plan['9-FY'][0]] };
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
});
await place(page, 'English 9', '9-FY');
await page.waitForTimeout(400);
await dragOnto('Biology', 'Theology 9', 'top', true);
ok('a course dragged from the catalog lands where it was dropped',
    JSON.stringify(await order()) === JSON.stringify(['Biology', 'Theology 9', 'English 9']),
    JSON.stringify(await order()));

// 9. And the order survives a reload.
await page.reload();
await page.waitForSelector('.tool[data-tool="cur"] .curr-widget');
await page.waitForTimeout(800);
ok('the order comes back after a reload',
    JSON.stringify(await order()) === JSON.stringify(['Biology', 'Theology 9', 'English 9']),
    JSON.stringify(await order()));

await page.screenshot({ path: OUT + '/curr-reorder.png' });
await finish(browser, errors);
