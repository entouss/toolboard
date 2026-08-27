// Putting the course list away, so the plan has the width.
import { open, ok, finish, stored, CODE, OUT } from './curr-lib.mjs';
const { browser, page, errors } = await open({
    plan: { '9-FY': [CODE['Algebra I']] }, size: [900, 600]
});

const widths = () => page.evaluate(() => {
    const cat = document.querySelector('.curr-catalog').getBoundingClientRect();
    const right = document.querySelector('.curr-right').getBoundingClientRect();
    return { catalog: Math.round(cat.width), right: Math.round(right.width),
        folded: document.querySelector('.curr-catalog').classList.contains('collapsed'),
        rows: document.querySelectorAll('.curr-course').length,
        cards: document.querySelectorAll('.curr-card').length };
});
const fold = async () => { await page.click('.curr-collapse'); await page.waitForTimeout(350); };

// 1. Open, the list has its share of the tool.
const open1 = await widths();
ok('the course list starts open', !open1.folded && open1.rows === 47, JSON.stringify(open1));

// 2. Folded, it is a strip and the plan takes the rest.
await fold();
const shut = await widths();
ok('folding it leaves a strip', shut.folded && shut.catalog < 40, JSON.stringify(shut));
ok('and the plan takes the width that was freed', shut.right > open1.right + 200,
    open1.right + ' → ' + shut.right);
ok('the courses are out of the way, not gone', shut.rows === 0 && shut.cards === 1, JSON.stringify(shut));
ok('the strip says how many there are', /47 courses/.test(await page.evaluate(() =>
    document.querySelector('.curr-collapse-label').textContent)));

// 3. The plan is still usable while it is folded.
await page.evaluate(() => document.querySelector('.curr-card').click());
await page.waitForTimeout(300);
ok('a card can still be selected', (await stored(page)).ui.selected === CODE['Algebra I']);
await page.evaluate(() => currSetTab(document.querySelector('.curr-tab'), 'tree'));
await page.waitForTimeout(400);
ok('and the tree still draws', await page.evaluate(() =>
    document.querySelectorAll('.curr-node').length >= 1));
await page.evaluate(() => currSetTab(document.querySelector('.curr-tab'), 'grid'));
await page.waitForTimeout(300);

// 4. It comes back the same as it was left.
await page.fill('.curr-search', 'algebra').catch(() => {});
await fold();
const back = await widths();
ok('unfolding brings the list back', !back.folded && back.rows === 47, JSON.stringify(back));
ok('and the catalog has its width again', Math.abs(back.catalog - open1.catalog) < 2,
    open1.catalog + ' → ' + back.catalog);

// 5. Folded or not, it is remembered.
await fold();
ok('folding is remembered', (await stored(page)).ui.catalogCollapsed === true);
await page.reload();
await page.waitForSelector('.tool[data-tool="cur"] .curr-widget');
await page.waitForTimeout(800);
ok('and it comes back folded after a reload', (await widths()).folded);
await fold();
ok('and can be opened again from there', !(await widths()).folded);

// 6. On a narrow tool, where the panes stack, folding gives the plan the height.
await page.setViewportSize({ width: 430, height: 900 });
await page.waitForTimeout(400);
await page.evaluate(() => currRender(document.querySelector('.curr-widget')));
await page.waitForTimeout(300);
const stackedBefore = await page.evaluate(() => ({
    catalog: Math.round(document.querySelector('.curr-catalog').getBoundingClientRect().height),
    widget: Math.round(document.querySelector('.curr-widget').getBoundingClientRect().height)
}));
ok('stacked, the course list takes a share of the height',
    stackedBefore.catalog > 100, JSON.stringify(stackedBefore));
await fold();
const stackedAfter = await page.evaluate(() => ({
    right: Math.round(document.querySelector('.curr-right').getBoundingClientRect().height),
    catalog: Math.round(document.querySelector('.curr-catalog').getBoundingClientRect().height),
    widget: Math.round(document.querySelector('.curr-widget').getBoundingClientRect().height),
    label: getComputedStyle(document.querySelector('.curr-collapse-label')).writingMode
}));
ok('folding hands that height to the plan',
    stackedAfter.right > stackedAfter.widget * 0.8, JSON.stringify(stackedAfter));
ok('and the strip lies along the top', stackedAfter.catalog < 60 && /horizontal/.test(stackedAfter.label),
    JSON.stringify(stackedAfter));

await page.screenshot({ path: OUT + '/curr-fold.png' });
await finish(browser, errors);
