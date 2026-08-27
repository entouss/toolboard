// The way in to a tool's written material: a ? in that tool's own header.
import { open, ok, finish, bar, OUT } from './curr-lib.mjs';
const { browser, page, errors } = await open({ size: [1000, 700] });
const ctx = page.context();

// 1. A tool with a page written about it says so in its header.
await bar(page);
ok('a tool with a guide shows a ? in its header',
    !!(await page.$('.tool[data-tool="cur"] .guide-btn')));
ok('and it says what it is for',
    await page.getAttribute('.tool[data-tool="cur"] .guide-btn', 'title') === 'How this tool works',
    await page.getAttribute('.tool[data-tool="cur"] .guide-btn', 'title'));
const order = () => page.evaluate(() =>
    Array.from(document.querySelectorAll('.tool[data-tool="cur"] .header-buttons .header-btn'))
        .map(b => b.className.replace('header-btn ', '')).join(','));
ok('placed before Settings, not after Delete',
    (await order()) === 'minimize-btn,fullscreen-btn,guide-btn,settings-btn,delete-btn', await order());

const popup = ctx.waitForEvent('page');
await page.click('.tool[data-tool="cur"] .guide-btn');
const tab = await popup;
await tab.waitForLoadState();
ok('it opens the page for that tool', /curriculum-explorer\.html$/.test(tab.url()), tab.url());
ok('which is the right page', (await tab.title()).startsWith('Curriculum Explorer'), await tab.title());
ok('and the page is really there, not a 404',
    (await tab.$$('.site-header')).length === 1 && (await tab.$$('h1')).length === 1);
await tab.close();
ok('pressing it did not drag or maximize the tool', await page.evaluate(() =>
    !document.querySelector('.tool[data-tool="cur"]').classList.contains('fullscreen')));

// 2. A tool with no guide has no ?, rather than a ? that goes nowhere.
await page.evaluate(() => { createNoteWithTemplate('blank', { skipEditor: true }); });
await page.waitForTimeout(700);
ok('a tool with no guide shows no ?', await page.evaluate(() =>
    Array.from(document.querySelectorAll('.tool')).filter(t => !t.querySelector('.curr-widget'))
        .every(t => !t.querySelector('.guide-btn'))));

// 3. The two other ways in are deliberately not there yet.
ok('the header carries no guides button', !(await page.$('#guidesBtn')));
await page.click('#managePluginsBtn');
await page.waitForTimeout(600);
ok('and the plugin manager offers no guide link',
    (await page.$$('.official-plugin-guide')).length === 0);
ok('while its rows are otherwise intact', await page.evaluate(() =>
    document.querySelectorAll('.official-plugin-item .official-plugin-add-btn').length > 5),
    String(await page.evaluate(() => document.querySelectorAll('.official-plugin-add-btn').length)));

await page.screenshot({ path: OUT + '/guide-links.png' });
await finish(browser, errors);
