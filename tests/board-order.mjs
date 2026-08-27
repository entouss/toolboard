// Putting the boards in the order you want them, where you pick them.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const seed = () => {
    // Only once: a reload must find what the page left behind, not a fresh seed.
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('financeBoards', JSON.stringify([
        { id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta' },
        { id: 'c', name: 'Gamma' }, { id: 'd', name: 'Delta' }
    ]));
    localStorage.setItem('financeCurrentBoard', 'a');
};
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 820 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(seed);
await page.goto('http://localhost:8777/index.html');
await page.waitForTimeout(700);
await page.click('#boardSelectorTrigger');
await page.waitForTimeout(400);

const shown = () => page.evaluate(() =>
    Array.from(document.querySelectorAll('.board-card-name')).map(e => e.textContent));
const stored = () => page.evaluate(() =>
    JSON.parse(localStorage.getItem('financeBoards')).map(b => b.name));
const drag = (from, to, half) => page.evaluate(({ from, to, half }) => {
    const card = (n) => Array.from(document.querySelectorAll('.board-card'))
        .find(c => c.querySelector('.board-card-name').textContent === n);
    const src = card(from), dst = card(to);
    const dt = new DataTransfer();
    src.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt }));
    const box = dst.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, dataTransfer: dt,
        clientY: box.top + box.height / 2,
        clientX: box.left + box.width * (half === 'left' ? 0.25 : 0.75) };
    dst.dispatchEvent(new DragEvent('dragover', opts));
    dst.dispatchEvent(new DragEvent('drop', opts));
    src.dispatchEvent(new DragEvent('dragend', { bubbles: true, dataTransfer: dt }));
}, { from, to, half });

// 1. The manager lists boards in the order they are kept in.
ok('the boards are listed in their stored order',
    JSON.stringify(await shown()) === JSON.stringify(['Alpha', 'Beta', 'Gamma', 'Delta']),
    JSON.stringify(await shown()));

// 2. Dropping on the left of a card puts the board before it.
await drag('Delta', 'Beta', 'left');
await page.waitForTimeout(300);
ok('dropping on the left lands before that board',
    JSON.stringify(await shown()) === JSON.stringify(['Alpha', 'Delta', 'Beta', 'Gamma']),
    JSON.stringify(await shown()));
ok('and the new order is what is kept',
    JSON.stringify(await stored()) === JSON.stringify(['Alpha', 'Delta', 'Beta', 'Gamma']),
    JSON.stringify(await stored()));

// 3. Dropping on the right puts it after.
await drag('Alpha', 'Beta', 'right');
await page.waitForTimeout(300);
ok('dropping on the right lands after it',
    JSON.stringify(await shown()) === JSON.stringify(['Delta', 'Beta', 'Alpha', 'Gamma']),
    JSON.stringify(await shown()));

// 4. Nothing is lost or duplicated by moving things about.
ok('every board is still there', (await stored()).length === 4 &&
    new Set(await stored()).size === 4, JSON.stringify(await stored()));
ok('and the board you are on is unchanged', await page.evaluate(() =>
    localStorage.getItem('financeCurrentBoard') === 'a'));

// 5. Without a mouse: Alt and an arrow walks a board along.
await page.evaluate(() => {
    Array.from(document.querySelectorAll('.board-card'))
        .find(c => c.querySelector('.board-card-name').textContent === 'Gamma').focus();
});
await page.keyboard.press('Alt+ArrowLeft');
await page.waitForTimeout(300);
ok('Alt and left moves a board earlier',
    JSON.stringify(await shown()) === JSON.stringify(['Delta', 'Beta', 'Gamma', 'Alpha']),
    JSON.stringify(await shown()));
ok('and the moved board keeps the focus', await page.evaluate(() =>
    document.activeElement.querySelector('.board-card-name').textContent === 'Gamma'));
await page.keyboard.press('Alt+ArrowRight');
await page.waitForTimeout(300);
ok('Alt and right moves it back',
    JSON.stringify(await shown()) === JSON.stringify(['Delta', 'Beta', 'Alpha', 'Gamma']),
    JSON.stringify(await shown()));

// 6. The ends stop rather than wrapping.
await page.evaluate(() => {
    Array.from(document.querySelectorAll('.board-card'))
        .find(c => c.querySelector('.board-card-name').textContent === 'Delta').focus();
});
await page.keyboard.press('Alt+ArrowLeft');
await page.waitForTimeout(300);
ok('the first board cannot go earlier', (await shown())[0] === 'Delta', JSON.stringify(await shown()));

// 7. A finger has the same move, in the board's settings.
await page.evaluate(() => {
    Array.from(document.querySelectorAll('.board-card'))
        .find(c => c.querySelector('.board-card-name').textContent === 'Alpha')
        .querySelector('.board-card-settings-btn').click();
});
await page.waitForTimeout(400);
ok('the settings drawer says where the board sits', await page.evaluate(() =>
    document.querySelector('.bs-order-at').textContent) === '3 of 4', await page.evaluate(() =>
    document.querySelector('.bs-order-at').textContent));
await page.click('.bs-move-up');
await page.waitForTimeout(400);
ok('Earlier moves it up one',
    JSON.stringify(await shown()) === JSON.stringify(['Delta', 'Alpha', 'Beta', 'Gamma']),
    JSON.stringify(await shown()));
ok('and the drawer keeps up', await page.evaluate(() =>
    document.querySelector('.bs-order-at').textContent) === '2 of 4');
await page.click('.bs-move-down');
await page.waitForTimeout(400);
ok('Later moves it back down',
    JSON.stringify(await shown()) === JSON.stringify(['Delta', 'Beta', 'Alpha', 'Gamma']),
    JSON.stringify(await shown()));
ok('the ends are refused there too', await page.evaluate(() => {
    Array.from(document.querySelectorAll('.board-card'))
        .find(c => c.querySelector('.board-card-name').textContent === 'Delta')
        .querySelector('.board-card-settings-btn').click();
    return document.querySelector('.bs-move-up').disabled;
}));

// 8. The order survives a reload, and switching boards still works.
await page.reload();
await page.waitForTimeout(800);
await page.click('#boardSelectorTrigger');
await page.waitForTimeout(400);
ok('the order comes back after a reload',
    JSON.stringify(await shown()) === JSON.stringify(['Delta', 'Beta', 'Alpha', 'Gamma']),
    JSON.stringify(await shown()));
await page.evaluate(() => {
    Array.from(document.querySelectorAll('.board-card'))
        .find(c => c.querySelector('.board-card-name').textContent === 'Beta').click();
});
await page.waitForTimeout(600);
ok('and a card still switches boards when clicked', await page.evaluate(() =>
    localStorage.getItem('financeCurrentBoard') === 'b'));

// 9. Renaming still works — a card being renamed is not draggable.
await page.click('#boardSelectorTrigger');
await page.waitForTimeout(400);
ok('a card is draggable to begin with', await page.evaluate(() =>
    document.querySelector('.board-card').draggable));
await page.evaluate(() => {
    const card = Array.from(document.querySelectorAll('.board-card'))
        .find(c => c.querySelector('.board-card-name').textContent === 'Beta');
    card.querySelector('.board-card-actions button').click();
});
await page.waitForTimeout(300);
ok('but not while its name is being edited', await page.evaluate(() =>
    !document.querySelector('.board-card-rename-wrap').closest('.board-card').draggable));

await page.screenshot({ path: OUT + '/board-order.png' });
console.log('\npage errors:', errors.length ? errors.join(' | ') : 'none');
await browser.close();
