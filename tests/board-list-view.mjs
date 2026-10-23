// The Boards popup as a list: with a lot of boards, cards fill the popup after half a
// dozen, and a row a board shows far more of them. Everything a card does, a row does.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
    'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi'];
const seed = (names) => {
    // Only once: a reload must find what the page left behind, not a fresh seed.
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('financeBoards', JSON.stringify(names.map((n, i) => ({ id: 'b' + i, name: n }))));
    localStorage.setItem('financeCurrentBoard', 'b0');
};
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 820 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(seed, NAMES);
await page.goto('http://localhost:8777/index.html');
await page.waitForTimeout(700);
await page.click('#boardSelectorTrigger');
await page.waitForTimeout(400);

const shown = () => page.evaluate(() =>
    Array.from(document.querySelectorAll('.board-card-name')).map(e => e.textContent));
const tops = () => page.evaluate(() =>
    Array.from(document.querySelectorAll('.board-card')).slice(0, 3).map(c => Math.round(c.getBoundingClientRect().top)));
const pressed = () => page.evaluate(() =>
    Array.from(document.querySelectorAll('.board-manager-view button'))
        .filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.view).join(','));
const fits = () => page.evaluate(() => {
    const list = document.getElementById('boardManagerList');
    const box = list.getBoundingClientRect();
    return Array.from(list.querySelectorAll('.board-card')).filter(c => c.getBoundingClientRect().bottom <= box.bottom).length;
});

// 1. Cards to begin with, as before.
ok('the popup opens as cards, the way it always has', await pressed() === 'grid' &&
    !(await page.evaluate(() => document.getElementById('boardManagerList').classList.contains('as-list'))));
const firstTops = await tops();
ok('with cards side by side', firstTops[0] === firstTops[1], JSON.stringify(firstTops));
const cardsFit = await fits();

// 2. The list.
await page.click('.board-manager-view button[data-view="list"]');
await page.waitForTimeout(200);
ok('the list button says it is pressed, and the cards one that it is not', await pressed() === 'list');
const listTops = await tops();
ok('boards are a row each, one under another', listTops[0] < listTops[1] && listTops[1] < listTops[2], JSON.stringify(listTops));
const rowsFit = await fits();
ok('and far more of them show at once', rowsFit >= cardsFit + 3, JSON.stringify({ cardsFit, rowsFit }));
ok('a row is as wide as the list, its name on the left',
    await page.evaluate(() => {
        const list = document.getElementById('boardManagerList');
        const row = list.querySelector('.board-card');
        const name = row.querySelector('.board-card-name');
        return row.getBoundingClientRect().width > list.clientWidth * 0.8 && getComputedStyle(name).textAlign === 'left';
    }));
ok('its colour runs down its side', await page.evaluate(() => {
    const s = document.querySelector('.board-card-color-strip').getBoundingClientRect();
    return s.height > s.width && s.width <= 6;
}));
await page.screenshot({ path: OUT + '/board-list-view.png' });

// 3. Kept: the choice survives closing the popup and reloading the page.
await page.keyboard.press('Escape');
await page.reload();
await page.waitForTimeout(700);
await page.click('#boardSelectorTrigger');
await page.waitForTimeout(400);
ok('it is still a list after a reload', await pressed() === 'list' &&
    await page.evaluate(() => document.getElementById('boardManagerList').classList.contains('as-list')));

// 4. Everything a card does, a row does.
await page.fill('#boardManagerSearch', 'eta');
await page.waitForTimeout(200);
ok('search filters the rows', JSON.stringify(await shown()) === JSON.stringify(['Beta', 'Zeta', 'Eta', 'Theta']),
    JSON.stringify(await shown()));
ok('and leaves them a list', await page.evaluate(() => document.getElementById('boardManagerList').classList.contains('as-list')));
await page.fill('#boardManagerSearch', '');
await page.waitForTimeout(200);

await page.hover('.board-card[data-board-id="b1"]');
await page.click('.board-card[data-board-id="b1"] .board-card-actions button[title="Rename"]');
await page.waitForTimeout(150);
await page.keyboard.press('ControlOrMeta+a');
await page.keyboard.type('Beta Two');
await page.keyboard.press('Enter');
await page.waitForTimeout(200);
ok('a row is renamed in place', (await shown())[1] === 'Beta Two', JSON.stringify(await shown()));

await page.focus('.board-card[data-board-id="b2"]');
await page.keyboard.press('Alt+ArrowUp');
await page.waitForTimeout(200);
ok('Alt and up moves a row up', JSON.stringify((await shown()).slice(0, 3)) === JSON.stringify(['Alpha', 'Gamma', 'Beta Two']),
    JSON.stringify(await shown()));
await page.keyboard.press('Alt+ArrowDown');
await page.waitForTimeout(200);
ok('and down moves it back', JSON.stringify((await shown()).slice(0, 3)) === JSON.stringify(['Alpha', 'Beta Two', 'Gamma']),
    JSON.stringify(await shown()));

// Dragging: rows are above and below one another, so the half of a row that counts is
// the top or the bottom — the left and right halves of a row are the same place.
const drag = (from, to, part) => page.evaluate(({ from, to, part }) => {
    const card = (n) => Array.from(document.querySelectorAll('.board-card'))
        .find(c => c.querySelector('.board-card-name').textContent === n);
    const src = card(from), dst = card(to);
    const dt = new DataTransfer();
    src.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt }));
    const box = dst.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, dataTransfer: dt,
        clientX: box.left + box.width * (part === 'top' ? 0.9 : 0.1),
        clientY: box.top + box.height * (part === 'top' ? 0.25 : 0.75) };
    dst.dispatchEvent(new DragEvent('dragover', opts));
    const mark = dst.classList.contains('drop-after') ? 'after' : 'before';
    dst.dispatchEvent(new DragEvent('drop', opts));
    src.dispatchEvent(new DragEvent('dragend', { bubbles: true, dataTransfer: dt }));
    return mark;
}, { from, to, part });
const markTop = await drag('Delta', 'Beta Two', 'top');
await page.waitForTimeout(200);
ok('a row dropped on the top half of another goes above it, wherever across it',
    markTop === 'before' && JSON.stringify((await shown()).slice(0, 4)) === JSON.stringify(['Alpha', 'Delta', 'Beta Two', 'Gamma']),
    JSON.stringify(await shown()));
const markBottom = await drag('Alpha', 'Beta Two', 'bottom');
await page.waitForTimeout(200);
ok('and on the bottom half, below it',
    markBottom === 'after' && JSON.stringify((await shown()).slice(0, 4)) === JSON.stringify(['Delta', 'Beta Two', 'Alpha', 'Gamma']),
    JSON.stringify(await shown()));

await page.click('.board-card[data-board-id="b3"]');
await page.waitForTimeout(500);
ok('clicking a row opens that board, and closes the popup',
    await page.evaluate(() => currentBoardId === 'b3' && !document.getElementById('boardManagerOverlay').classList.contains('open')));

// 5. Back to cards, and that is kept too.
await page.click('#boardSelectorTrigger');
await page.waitForTimeout(400);
await page.click('.board-manager-view button[data-view="grid"]');
await page.waitForTimeout(200);
const backTops = await tops();
ok('cards again, side by side', await pressed() === 'grid' && backTops[0] === backTops[1], JSON.stringify(backTops));
ok('and cards is what is kept', await page.evaluate(() => localStorage.getItem('toolboard_boardManagerView')) === 'grid');

// 6. Dark mode: the row's buttons are readable there too.
await page.click('.board-manager-view button[data-view="list"]');
await page.evaluate(() => { document.body.classList.add('dark-mode'); });
await page.hover('.board-card[data-board-id="b4"]');
await page.waitForTimeout(250);
await page.screenshot({ path: OUT + '/board-list-view-dark.png' });

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + 19 + ' assertions reached)');
await browser.close();
