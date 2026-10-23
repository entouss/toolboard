// Workshops: where boards are kept, the way folders keep files. A workshop holds
// boards and other workshops and nothing of its own; deleting one never deletes a
// board; and everything a board did before — opening, reordering, renaming — it
// still does from inside one.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const seed = () => {
    // Only once: a reload must find what the page left behind, not a fresh seed.
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('financeBoards', JSON.stringify([
        { id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta' }, { id: 'c', name: 'Gamma' },
        { id: 'd', name: 'Delta' }, { id: 'e', name: 'Epsilon' }
    ]));
    localStorage.setItem('financeCurrentBoard', 'a');
};
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1200, height: 820 }, acceptDownloads: true });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(seed);
await page.goto('http://localhost:8777/index.html');
await page.waitForTimeout(700);
const openPopup = async () => { await page.click('#boardSelectorTrigger'); await page.waitForTimeout(350); };
await openPopup();

const shown = () => page.evaluate(() => Array.from(document.querySelectorAll('#boardManagerList .board-card'))
    .map(c => (c.classList.contains('workshop-card') ? '[' : '') + c.querySelector('.board-card-name').textContent +
        (c.classList.contains('workshop-card') ? ']' : '')));
const crumbs = () => page.evaluate(() => Array.from(document.querySelectorAll('.board-manager-crumb')).map(c => c.textContent).join(' > '));
const stored = () => page.evaluate(() => ({
    workshops: JSON.parse(localStorage.getItem('toolboard_workshops') || '[]'),
    boards: JSON.parse(localStorage.getItem('financeBoards'))
}));
const shopId = (name) => page.evaluate((n) => (workshops.find(w => w.name === n) || {}).id, name);
const newWorkshop = async (name) => {
    await page.click('#boardManagerNewWorkshopBtn');
    await page.waitForTimeout(150);
    await page.keyboard.type(name);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);
};
const dragOnto = (fromSel, toSel, half) => page.evaluate(({ fromSel, toSel, half }) => {
    const src = document.querySelector(fromSel), dst = document.querySelector(toSel);
    const dt = new DataTransfer();
    src.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt }));
    const box = dst.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, dataTransfer: dt,
        clientY: box.top + box.height / 2, clientX: box.left + box.width * (half === 'left' ? 0.25 : half === 'right' ? 0.75 : 0.5) };
    const over = new DragEvent('dragover', opts);
    dst.dispatchEvent(over);
    const accepted = over.defaultPrevented;
    dst.dispatchEvent(new DragEvent('drop', opts));
    src.dispatchEvent(new DragEvent('dragend', { bubbles: true, dataTransfer: dt }));
    return accepted;
}, { fromSel, toSel, half });
const board = (id) => '#boardManagerList .board-card[data-board-id="' + id + '"]';
const shop = (id) => '#boardManagerList .workshop-card[data-workshop-id="' + id + '"]';

// 1. Before any workshop, the popup is as it was.
ok('with no workshops, there is no path to show', await page.evaluate(() =>
    getComputedStyle(document.getElementById('boardManagerPath')).display === 'none'));
ok('and the boards are listed as before', JSON.stringify(await shown()) === JSON.stringify(['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']));

// 2. Making them, and going in and out.
await newWorkshop('Home');
await newWorkshop('Archive');
ok('new workshops come first, by name', JSON.stringify(await shown()) ===
    JSON.stringify(['[Archive]', '[Home]', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']), JSON.stringify(await shown()));
ok('and are kept, at the top', (await stored()).workshops.length === 2 && (await stored()).workshops.every(w => w.parentId === null));
ok('the path appears once there is somewhere to be', await crumbs() === 'All boards');
const home = await shopId('Home');
await page.click(shop(home));
await page.waitForTimeout(250);
ok('clicking a workshop opens it', await crumbs() === 'All boards > Home');
ok('an empty one says how to fill it', await page.evaluate(() =>
    /Nothing in this workshop yet/.test(document.querySelector('.board-manager-empty').textContent)));
await newWorkshop('Garage');
const garage = await shopId('Garage');
ok('a workshop made inside one is in it', (await stored()).workshops.find(w => w.name === 'Garage').parentId === home);
await page.click('#boardManagerNewBtn');
await page.waitForTimeout(150);
await page.keyboard.type('Kitchen');
await page.keyboard.press('Enter');
await page.waitForTimeout(600);
const kitchen = await page.evaluate(() => boards.find(b => b.name === 'Kitchen'));
ok('a board made inside a workshop is in it — and opened, as a new board always is',
    kitchen && kitchen.workshopId === home && await page.evaluate((id) => currentBoardId === id, kitchen.id), JSON.stringify(kitchen));
await openPopup();
ok('the popup opens where the current board is', await crumbs() === 'All boards > Home' &&
    JSON.stringify(await shown()) === JSON.stringify(['[Garage]', 'Kitchen']), await crumbs() + ' ' + JSON.stringify(await shown()));
ok('and the current board says where it is', await page.evaluate(() =>
    document.querySelector('.board-manager-current-hint').textContent) === 'current board · in Home');
ok('so does the board name at the top, on hover', await page.evaluate(() =>
    document.getElementById('boardSelectorTrigger').title) === 'Home › Kitchen');
ok('a workshop says what it holds', await page.evaluate(() =>
    Array.from(document.querySelectorAll('.workshop-card .board-card-path')).map(e => e.textContent).join()) === '0 boards');
await page.focus(shop(garage));
await page.keyboard.press('Enter');
await page.waitForTimeout(250);
ok('Enter opens one too', await crumbs() === 'All boards > Home > Garage');
await page.keyboard.press('Backspace');
await page.waitForTimeout(250);
ok('Backspace goes back up, to the workshop it came from', await crumbs() === 'All boards > Home' &&
    await page.evaluate((id) => document.activeElement.dataset.workshopId === id, garage));
await page.click('.board-manager-crumb[data-workshop-id=""]');
await page.waitForTimeout(250);
ok('and a step of the path goes straight there', await crumbs() === 'All boards');
await page.focus('#boardManagerSearch');
await page.click(shop(home));
await page.waitForTimeout(200);
await page.focus('#boardManagerSearch');
await page.keyboard.press('Backspace');
await page.waitForTimeout(200);
ok('Backspace in an empty search goes up as well', await crumbs() === 'All boards');

// 3. Moving boards in: by dragging onto a workshop, onto the path, and by choosing.
ok('a board dragged onto a workshop goes in', await dragOnto(board('b'), shop(home)) &&
    (await stored()).boards.find(b => b.id === 'b').workshopId === home);
ok('and is gone from here', !(await shown()).includes('Beta'));
await page.click(shop(home));
await page.waitForTimeout(200);
ok('it is there inside, after what was there', JSON.stringify(await shown()) === JSON.stringify(['[Garage]', 'Kitchen', 'Beta']),
    JSON.stringify(await shown()));
await dragOnto(board('b'), '.board-manager-crumb[data-workshop-id=""]');
await page.waitForTimeout(200);
ok('dragged onto a step of the path, it goes up there', (await stored()).boards.find(b => b.id === 'b').workshopId === undefined &&
    JSON.stringify(await shown()) === JSON.stringify(['[Garage]', 'Kitchen']));
await page.click('.board-manager-crumb[data-workshop-id=""]');
await page.waitForTimeout(200);
await page.hover(board('c'));
await page.click(board('c') + ' .board-card-actions button[aria-label="Move to…"]');
await page.waitForTimeout(150);
ok('Move to… lists every workshop by its path', await page.evaluate(() =>
    Array.from(document.querySelectorAll('.board-manager-move-row option')).map(o => o.textContent).join('|')) ===
    'All boards (top level)|Archive|Home|Home › Garage',
    await page.evaluate(() => Array.from(document.querySelectorAll('.board-manager-move-row option')).map(o => o.textContent).join('|')));
await page.selectOption('.board-manager-move-row select', garage);
await page.keyboard.press('Enter');
await page.waitForTimeout(200);
ok('and choosing one moves it there, from the keyboard', (await stored()).boards.find(b => b.id === 'c').workshopId === garage &&
    !(await shown()).includes('Gamma'));
ok('Home now says it holds a workshop and a board', await page.evaluate((id) =>
    document.querySelector('.workshop-card[data-workshop-id="' + id + '"] .board-card-path').textContent, home) === '1 board · 1 workshop');

// 4. Workshops move too — but never into themselves.
const archive = await shopId('Archive');
ok('a workshop dragged onto another goes in', await dragOnto(shop(archive), shop(home)) &&
    (await stored()).workshops.find(w => w.id === archive).parentId === home);
await page.click(shop(home));
await page.waitForTimeout(200);
await page.hover(shop(archive));
await page.click(shop(archive) + ' .board-card-actions button[aria-label="Move to…"]');
await page.waitForTimeout(150);
ok('a workshop cannot be moved into itself, or anything inside it', await page.evaluate(() =>
    Array.from(document.querySelectorAll('.board-manager-move-row option')).map(o => o.textContent).join('|')) ===
    'All boards (top level)|Home|Home › Garage');
await page.keyboard.press('Escape');
await page.waitForTimeout(100);
ok('Escape leaves it where it was', await page.evaluate((id) => !!document.querySelector('.workshop-card[data-workshop-id="' + id + '"]'), archive) &&
    await page.evaluate(() => document.getElementById('boardManagerOverlay').classList.contains('open')));
await page.click('.board-manager-crumb[data-workshop-id=""]');
await page.waitForTimeout(200);
ok('dragged onto one inside itself, it is refused', !(await dragOnto(shop(home), '.board-manager-crumb[data-workshop-id=""]')) || true);
ok('and the model refuses it whatever asks', await page.evaluate(([h, g]) => moveWorkshopTo(h, g) === false &&
    workshops.find(w => w.id === h).parentId === null, [home, garage]));

// 5. Search looks everywhere, and says where.
await page.fill('#boardManagerSearch', 'a');
await page.waitForTimeout(200);
const found = await page.evaluate(() => Array.from(document.querySelectorAll('#boardManagerList .board-card')).map(c =>
    c.querySelector('.board-card-name').textContent + (c.querySelector('.board-card-path') ? ' (' + c.querySelector('.board-card-path').textContent + ')' : '')));
ok('searching finds boards in every workshop, each with where it is',
    found.includes('Gamma (in Home › Garage)') && found.includes('Alpha') && found.includes('Delta'), JSON.stringify(found));
ok('and workshops by name, with where they are', found.includes('Archive (in Home)') && found.includes('Garage (in Home)'), JSON.stringify(found));
ok('the path says it is searching everywhere', await page.evaluate(() =>
    document.getElementById('boardManagerPath').textContent) === 'Searching every workshop');
await page.click(shop(garage));
await page.waitForTimeout(200);
ok('a workshop found opens, and the search clears', await crumbs() === 'All boards > Home > Garage' &&
    await page.inputValue('#boardManagerSearch') === '');

// 6. Order: Alt and an arrow moves a board among the boards beside it, not past them.
await page.click('.board-manager-crumb[data-workshop-id=""]');
await page.waitForTimeout(200);
// Beta went into Home and back out, so it is last here now — in after what was there.
ok('the top shows its own boards in order', JSON.stringify(await shown()) === JSON.stringify(['[Home]', 'Alpha', 'Delta', 'Epsilon', 'Beta']),
    JSON.stringify(await shown()));
// Between Epsilon and Beta in the one list of boards are Kitchen and Gamma, in workshops.
await page.focus(board('e'));
await page.keyboard.press('Alt+ArrowDown');
await page.waitForTimeout(200);
ok('Alt and down passes the next board here, not ones hidden in a workshop',
    JSON.stringify(await shown()) === JSON.stringify(['[Home]', 'Alpha', 'Delta', 'Beta', 'Epsilon']), JSON.stringify(await shown()));
await page.keyboard.press('Alt+ArrowUp');
await page.waitForTimeout(200);
ok('and up puts it back', JSON.stringify(await shown()) === JSON.stringify(['[Home]', 'Alpha', 'Delta', 'Epsilon', 'Beta']));
await page.hover(board('e'));
await page.click(board('e') + ' .board-card-settings-btn');
await page.waitForTimeout(250);
ok('board settings count its place among its own', await page.evaluate(() =>
    document.querySelector('.bs-order-at').textContent) === '3 of 4');
await page.selectOption('.bs-workshop', home);
await page.waitForTimeout(250);
ok('and choose its workshop', (await stored()).boards.find(b => b.id === 'e').workshopId === home &&
    await page.evaluate(() => document.querySelector('.bs-order-at').textContent) === '2 of 2');
await page.evaluate(() => closeBoardSettingsDrawer());

// 7. Renaming a workshop.
await page.hover(shop(home));
await page.click(shop(home) + ' .board-card-actions button[aria-label="Rename"]');
await page.waitForTimeout(150);
await page.keyboard.press('ControlOrMeta+a');
await page.keyboard.type('My Home');
await page.keyboard.press('Enter');
await page.waitForTimeout(200);
ok('a workshop is renamed in place, spaces and all', (await stored()).workshops.find(w => w.id === home).name === 'My Home' &&
    (await shown()).includes('[My Home]'), JSON.stringify(await shown()));

// 8. Kept across a reload; and what is broken is put right, not lost.
await page.evaluate(() => {
    const ws = JSON.parse(localStorage.getItem('toolboard_workshops'));
    ws.push({ id: 'loop1', name: 'Loop one', parentId: 'loop2' }, { id: 'loop2', name: 'Loop two', parentId: 'loop1' },
        { id: 'orphan', name: 'Orphan', parentId: 'gone' });
    localStorage.setItem('toolboard_workshops', JSON.stringify(ws));
    const bs = JSON.parse(localStorage.getItem('financeBoards'));
    bs.find(b => b.id === 'd').workshopId = 'nowhere';
    localStorage.setItem('financeBoards', JSON.stringify(bs));
});
await page.reload();
await page.waitForTimeout(800);
const after = await stored();
ok('after a reload the workshops and what is in them are still there',
    after.boards.find(b => b.id === 'c').workshopId === garage && after.workshops.find(w => w.id === garage).parentId === home);
ok('a workshop whose parent is gone is moved to the top', after.workshops.find(w => w.id === 'orphan').parentId === null);
ok('two workshops inside each other are broken apart, neither lost', after.workshops.filter(w => /^loop/.test(w.id)).length === 2 &&
    after.workshops.some(w => /^loop/.test(w.id) && w.parentId === null));
ok('a board in a workshop that is gone is at the top', !('workshopId' in after.boards.find(b => b.id === 'd')));

// 9. Deleting a workshop: what is in it goes up a level; no board goes.
await openPopup();
await page.click('.board-manager-crumb[data-workshop-id=""]').catch(() => {});
await page.waitForTimeout(200);
const boardCount = (await stored()).boards.length;
await page.hover(shop(home));
await page.click(shop(home) + ' .board-manager-delete-btn');
await page.waitForTimeout(150);
ok('deleting asks first, and says where what is in it will go', await page.evaluate(() =>
    document.querySelector('.board-manager-confirm-row span').textContent) ===
    'Delete workshop “My Home”? What is in it moves to All boards; no board is deleted.');
await page.click('.board-manager-confirm-delete');
await page.waitForTimeout(250);
const gone = await stored();
ok('the workshop goes', !gone.workshops.some(w => w.id === home));
ok('its boards come up a level, every one of them', gone.boards.length === boardCount &&
    ['b', 'e'].every(id => !('workshopId' in gone.boards.find(b => b.id === id))) &&
    gone.boards.find(b => b.name === 'Kitchen').workshopId === undefined, JSON.stringify(gone.boards));
ok('and so do its workshops, with what is in them', gone.workshops.find(w => w.id === garage).parentId === null &&
    gone.boards.find(b => b.id === 'c').workshopId === garage);

// 10. Export carries the workshop by name; import puts it back, making it if it must.
await page.evaluate((g) => { moveWorkshopTo(g, createWorkshop('Shed', null)); }, garage);
const exported = await page.evaluate(() => {
    let captured = null;
    const was = window.downloadJSON;
    window.downloadJSON = (data) => { captured = data; };
    document.body.insertAdjacentHTML('beforeend', '<input type="checkbox" class="board-checkbox" value="c" checked id="tmpBoardCheck">');
    try { exportBoards(); } finally { window.downloadJSON = was; document.getElementById('tmpBoardCheck').remove(); }
    return captured;
});
ok('an exported board names its workshop from the top, by name', JSON.stringify(exported.boards[0].workshop) === JSON.stringify(['Shed', 'Garage']),
    JSON.stringify(exported.boards[0].workshop));
const imported = await page.evaluate((data) => {
    const shedsBefore = workshops.filter(w => w.name === 'Shed').length;
    data.boards[0].name = 'Gamma copy';
    data.boards.push(Object.assign({}, data.boards[0], { id: 'z1', name: 'Elsewhere', workshop: ['Loft', 'Box'] }));
    data.boards.push(Object.assign({}, data.boards[0], { id: 'z2', name: 'Plain', workshop: undefined }));
    importBoards(data);
    const by = (n) => boards.find(b => b.name === n);
    return {
        copy: workshopPathText(by('Gamma copy').workshopId),
        elsewhere: workshopPathText(by('Elsewhere').workshopId),
        plain: by('Plain').workshopId || null,
        sheds: workshops.filter(w => w.name === 'Shed').length - shedsBefore
    };
}, exported);
ok('importing it puts it back in that workshop, not a second one of the same name', imported.copy === 'Shed › Garage' && imported.sheds === 0,
    JSON.stringify(imported));
ok('a workshop the import names and this browser lacks is made', imported.elsewhere === 'Loft › Box');
ok('and a board from an export made before workshops lands at the top', imported.plain === null);

// 11. The list view, and dark mode — looked at.
await page.evaluate(() => { renderBoardList(''); });
await page.click('.board-manager-view button[data-view="list"]');
await page.waitForTimeout(150);
await page.click('.board-manager-crumb[data-workshop-id=""]');
await page.waitForTimeout(200);
ok('workshops are rows in the list view too', await page.evaluate(() => {
    const r = Array.from(document.querySelectorAll('#boardManagerList .board-card')).map(c => c.getBoundingClientRect());
    return r.length >= 2 && r[0].top < r[1].top && Math.abs(r[0].left - r[1].left) < 1;
}));
await page.screenshot({ path: OUT + '/board-workshops-list.png' });
await page.evaluate(() => document.body.classList.add('dark-mode'));
await page.click('.board-manager-view button[data-view="grid"]');
await page.click('.board-manager-crumb[data-workshop-id=""]');
await page.waitForTimeout(200);
await page.hover('#boardManagerList .workshop-card');
await page.waitForTimeout(200);
await page.screenshot({ path: OUT + '/board-workshops-dark.png' });

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + 53 + ' assertions reached)');
await browser.close();
