// The side navigation: every workshop and board down the left, to find a board and
// open it. Closed until asked for, so nobody's board moves; open, it moves the board
// over rather than covering it, and never changes where a tool is kept.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const seed = () => {
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('financeBoards', JSON.stringify([
        { id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta', workshopId: 'w2' }, { id: 'c', name: 'Gamma' },
        { id: 'd', name: 'Delta', workshopId: 'w1' }, { id: 'e', name: 'Epsilon', workshopId: 'w3' }
    ]));
    localStorage.setItem('toolboard_workshops', JSON.stringify([
        { id: 'w1', name: 'Home', parentId: null }, { id: 'w2', name: 'Garage', parentId: 'w1' },
        { id: 'w3', name: 'Work', parentId: null }
    ]));
    localStorage.setItem('financeCurrentBoard', 'a');
};
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 760 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(seed);
await page.goto('http://localhost:8777/index.html');
await page.waitForTimeout(800);

const tree = () => page.evaluate(() => Array.from(document.querySelectorAll('#sideNavTree .side-nav-item')).map(li =>
    '  '.repeat(Number(li.getAttribute('aria-level')) - 1) +
    (li.dataset.workshopId ? (li.getAttribute('aria-expanded') === 'true' ? 'v ' : '> ') : '') +
    li.querySelector('.side-nav-name').textContent + (li.classList.contains('current') ? ' *' : '')).join('\n'));
const isOpen = () => page.evaluate(() => document.body.classList.contains('side-nav-open') &&
    getComputedStyle(document.getElementById('sideNav')).visibility === 'visible');
const focusedName = () => page.evaluate(() => {
    const li = document.activeElement.closest && document.activeElement.closest('.side-nav-item');
    return li ? li.querySelector('.side-nav-name').textContent : null;
});

// 1. Closed until asked for.
const note = await page.evaluate(() => createNoteWithText('Where it was', 'Pinned'));
await page.waitForTimeout(400);
const toolAt = () => page.evaluate((id) => {
    const el = document.querySelector('.tool[data-tool="' + id + '"]');
    return { screen: Math.round(el.getBoundingClientRect().left), kept: positions[id].x };
}, note);
const before = await toolAt();
ok('the side navigation starts closed', !(await isOpen()) &&
    await page.getAttribute('#sideNavToggle', 'aria-expanded') === 'false');
ok('and, closed, cannot be tabbed into', await page.evaluate(() => document.getElementById('sideNav').inert === true));

// 2. Open: the board moves over, and nothing about where a tool is kept changes.
await page.click('#sideNavToggle');
await page.waitForTimeout(350);
ok('the menu button opens it, and says so', await isOpen() && await page.getAttribute('#sideNavToggle', 'aria-expanded') === 'true');
const width = await page.evaluate(() => document.getElementById('sideNav').getBoundingClientRect().width);
const opened = await toolAt();
ok('the board moves over by the menu’s width, so no tool is under it',
    Math.abs(opened.screen - before.screen - width) <= 1, JSON.stringify({ before, opened, width }));
ok('while where the tool is kept is the same', opened.kept === before.kept);
ok('it starts below the header', await page.evaluate(() =>
    Math.abs(document.getElementById('sideNav').getBoundingClientRect().top - document.getElementById('mainHeader').getBoundingClientRect().bottom) <= 1));

// 3. The tree: workshops first, then boards; the open board shown and marked.
ok('it lists the workshops and the boards, workshops first, as the popup does',
    await tree() === '> Home\n> Work\nAlpha *\nGamma', await tree());
ok('the open board is marked as the current page', await page.evaluate(() =>
    document.querySelector('#sideNavTree [aria-current="page"]').dataset.boardId === 'a'));
await page.click('#sideNavTree [data-workshop-id="w1"]');
await page.waitForTimeout(150);
ok('a workshop opens and closes with a click', await tree() === 'v Home\n  > Garage\n  Delta\n> Work\nAlpha *\nGamma', await tree());
await page.click('#sideNavTree [data-workshop-id="w2"]');
await page.waitForTimeout(150);
await page.click('#sideNavTree [data-board-id="b"]');
await page.waitForTimeout(600);
ok('clicking a board opens it', await page.evaluate(() => currentBoardId === 'b'));
ok('and the menu stays open beside it, marking it', await isOpen() && /Beta \*/.test(await tree()));
ok('the board name at the top agrees', await page.evaluate(() =>
    document.getElementById('boardSelectorTrigger').textContent.trim()) === 'Beta');

// 4. Kept across a reload: open, and which workshops were.
await page.click('#sideNavTree [data-workshop-id="w1"]');
await page.waitForTimeout(150);
ok('closing a workshop that holds the open board leaves it closed', await tree() === '> Home\n> Work\nAlpha\nGamma', await tree());
await page.reload();
await page.waitForTimeout(800);
ok('after a reload it is still open', await isOpen());
ok('with the workshops as they were left', await tree() === '> Home\n> Work\nAlpha\nGamma', await tree());
await page.evaluate(() => switchToBoard('e'));
await page.waitForTimeout(500);
ok('opening a board elsewhere shows it: the workshops it is in open', /v Work\n  Epsilon \*/.test(await tree()), await tree());

// 5. Kept up to date, whatever changes the boards.
await page.evaluate(() => setBoardName('e', 'Epsilon Two'));
await page.waitForTimeout(100);
ok('a board renamed is renamed here', /Epsilon Two \*/.test(await tree()), await tree());
await page.evaluate(() => moveBoardToWorkshop('c', 'w3'));
await page.waitForTimeout(100);
ok('a board moved into a workshop moves here', /v Work\n  Epsilon Two \*\n  Gamma/.test(await tree()) && !/^Gamma$/m.test(await tree()), await tree());
await page.evaluate(() => createWorkshop('Archive', null));
await page.waitForTimeout(100);
ok('a new workshop appears, in its place by name', (await tree()).startsWith('> Archive\n> Home'), await tree());
await page.evaluate(() => updateBoardSetting('a', { favicon: '\u{1F34E}' }));
await page.waitForTimeout(100);
ok('a board’s emoji shows beside it', await page.evaluate(() =>
    document.querySelector('#sideNavTree [data-board-id="a"] .side-nav-icon').textContent) === '\u{1F34E}');

// 6. The filter.
await page.fill('#sideNavFilter', 'del');
await page.waitForTimeout(150);
ok('filtering keeps the boards that match, inside the workshops they are in', await tree() === 'v Home\n  Delta', await tree());
await page.fill('#sideNavFilter', 'zzz');
await page.waitForTimeout(150);
ok('and says when nothing does', await page.evaluate(() => document.querySelector('#sideNavTree .side-nav-empty').textContent) === 'No boards match.');
await page.focus('#sideNavFilter');
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
ok('Escape in the filter clears it', await page.inputValue('#sideNavFilter') === '' && /> Home/.test(await tree()));

// 7. The keyboard: a tree, with one stop for Tab.
ok('one item is in the Tab order — the open board', await page.evaluate(() =>
    Array.from(document.querySelectorAll('#sideNavTree [tabindex="0"]')).map(li => li.dataset.boardId).join()) === 'e');
await page.focus('#sideNavTree [data-board-id="e"]');
await page.keyboard.press('Home');
ok('Home goes to the first item', await focusedName() === 'Archive');
await page.keyboard.press('ArrowDown');
ok('down goes to the next', await focusedName() === 'Home');
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(100);
ok('right opens a workshop', /v Home/.test(await tree()) && await focusedName() === 'Home');
await page.keyboard.press('ArrowRight');
ok('and again steps into it', await focusedName() === 'Garage');
// Garage was left open in section 3, so left closes it first, as a tree does.
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(100);
ok('left closes an open workshop', /> Garage/.test(await tree()) && await focusedName() === 'Garage', await tree());
await page.keyboard.press('ArrowLeft');
ok('and from a closed one goes back out to the workshop it is in', await focusedName() === 'Home');
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(100);
ok('and left again closes it', /> Home/.test(await tree()) && await focusedName() === 'Home');
await page.keyboard.press('End');
ok('End goes to the last', await focusedName() === 'Alpha', await focusedName());
await page.keyboard.press('Enter');
await page.waitForTimeout(500);
ok('Enter opens the board', await page.evaluate(() => currentBoardId === 'a'));

// 8. Manage boards opens the popup, over the menu.
await page.click('.side-nav-manage');
await page.waitForTimeout(350);
ok('Manage boards… opens the Boards popup', await page.evaluate(() =>
    document.getElementById('boardManagerOverlay').classList.contains('open')));
await page.keyboard.press('Escape');
await page.evaluate(() => closeBoardManager());

// 9. With the header hidden, the menu goes up to the top.
await page.click('#headerCollapseBtn');
await page.waitForTimeout(450);
ok('with the header hidden, the menu starts at the top of the window', await page.evaluate(() =>
    document.getElementById('sideNav').getBoundingClientRect().top) <= 1);
await page.click('#headerCollapseBtn');
await page.waitForTimeout(450);

await page.screenshot({ path: OUT + '/side-nav.png' });
await page.evaluate(() => document.body.classList.add('dark-mode'));
await page.waitForTimeout(150);
await page.screenshot({ path: OUT + '/side-nav-dark.png' });
await page.evaluate(() => document.body.classList.remove('dark-mode'));

// 10. Closing it puts the board back.
await page.click('.side-nav-close');
await page.waitForTimeout(350);
const closed = await toolAt();
ok('the × closes it, and the board goes back where it was', !(await isOpen()) && Math.abs(closed.screen - before.screen) <= 1 &&
    await page.evaluate(() => document.activeElement.id) === 'sideNavToggle', JSON.stringify(closed));
ok('and closed is kept', await page.evaluate(() => JSON.parse(localStorage.getItem('toolboard_sideNav')).open) === false);

// 11. On a phone it slides over the board, and gets out of the way once used.
const phone = await browser.newPage({ viewport: { width: 400, height: 760 } });
await phone.addInitScript(seed);
await phone.addInitScript(() => localStorage.setItem('toolboard_sideNav', JSON.stringify({ open: true, expanded: [] })));
await phone.goto('http://localhost:8777/index.html');
await phone.waitForTimeout(800);
ok('on a phone it starts closed even if left open', await phone.evaluate(() => !document.body.classList.contains('side-nav-open')));
const boardLeft = () => phone.evaluate(() => Math.round(document.getElementById('toolboard').getBoundingClientRect().left));
const phoneBefore = await boardLeft();
await phone.click('#sideNavToggle');
await phone.waitForTimeout(350);
ok('opened, it covers the board rather than squeezing it', await boardLeft() === phoneBefore &&
    await phone.evaluate(() => getComputedStyle(document.getElementById('sideNavBackdrop')).display) === 'block');
await phone.screenshot({ path: OUT + '/side-nav-phone.png' });
await phone.click('#sideNavTree [data-board-id="c"]');
await phone.waitForTimeout(500);
ok('choosing a board opens it and closes the menu', await phone.evaluate(() =>
    currentBoardId === 'c' && !document.body.classList.contains('side-nav-open')));
await phone.click('#sideNavToggle');
await phone.waitForTimeout(300);
await phone.mouse.click(380, 400);
await phone.waitForTimeout(300);
ok('so does a tap beside it', await phone.evaluate(() => !document.body.classList.contains('side-nav-open')));
await phone.close();

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + 42 + ' assertions reached)');
await browser.close();
