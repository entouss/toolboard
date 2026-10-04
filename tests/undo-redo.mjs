// Undo and redo, at the level of the board rather than of any one tool.
//
// The whole point of putting it in the storage layer is that no tool knows about
// it, so these assertions go through the ordinary doors — move a window, type in a
// note, delete a tool — and then ask for it back. Three things carry the risk: that
// one press of Ctrl+Z undoes one *edit* rather than one keystroke, that it leaves
// the browser's own undo alone while the caret is in a text field, and that two
// boards never pour their histories into each other.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

const NOTES = [['note-a', 100, 60], ['note-b', 400, 60]];

const seed = ({ notes }) => {
    localStorage.setItem('financeCurrentBoard', 'default');
    localStorage.setItem('finance_boards', JSON.stringify([
        { id: 'default', name: 'First' }, { id: 'second', name: 'Second' }
    ]));
    localStorage.setItem('finance_default_customTools', JSON.stringify(notes.map(n => n[0])));
    localStorage.setItem('finance_default_positions', JSON.stringify(
        Object.fromEntries(notes.map(([id, x, y], i) =>
            [id, { x, y, z: i + 1, width: 240, height: 160 }]))));
    localStorage.setItem('finance_default_toolCustomizations', JSON.stringify(
        Object.fromEntries(notes.map(([id]) =>
            [id, { title: id, templateId: 'blank', customContent: id }]))));
};

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.addInitScript(seed, { notes: NOTES });
await page.goto('http://localhost:8777/index.html');
await page.waitForSelector('.tool', { timeout: 20000 });
await page.waitForTimeout(700);

const stored = (key, board = 'default') => page.evaluate((k) => {
    const raw = localStorage.getItem(k);
    return raw === null ? null : JSON.parse(raw);
}, 'finance_' + board + '_' + key);

const depth = () => page.evaluate(() => ({
    undo: undoHistory().undo.length,
    redo: undoHistory().redo.length,
    top: (undoHistory().undo[undoHistory().undo.length - 1] || {}).label || null
}));

const press = (keys) => page.evaluate(() => document.body.focus())
    .then(() => page.keyboard.press(keys))
    .then(() => page.waitForTimeout(450));

// 1. Nothing has happened yet, so there is nothing to undo — and the buttons say so
//    rather than being absent.
ok('the board opens with both buttons present and disabled', await page.evaluate(() => {
    const u = document.getElementById('undoBtn'), r = document.getElementById('redoBtn');
    return !!u && !!r && u.disabled && r.disabled;
}));
ok('and they say why they cannot be pressed', await page.evaluate(() =>
    document.getElementById('undoBtn').title) === 'Nothing to undo',
    await page.evaluate(() => document.getElementById('undoBtn').title));
ok('with an empty history behind them', (await depth()).undo === 0, JSON.stringify(await depth()));

// 2. Moving a window. The layout is storage like any other, so it undoes.
const before = (await stored('positions'))['note-a'];
await page.evaluate(() => {
    positions['note-a'] = { ...positions['note-a'], x: 640, y: 320 };
    savePositions(positions);
    document.querySelector('.tool[data-tool="note-a"]').style.left = '640px';
});
await page.waitForTimeout(250);
ok('moving a tool is one step in the history', (await depth()).undo === 1, JSON.stringify(await depth()));
ok('and the button now names what it would undo',
    (await page.evaluate(() => document.getElementById('undoBtn').title)) === 'Undo the layout (Ctrl+Z)',
    await page.evaluate(() => document.getElementById('undoBtn').title));

await press('Control+z');
ok('undo puts the tool back where it was', (await stored('positions'))['note-a'].x === before.x,
    JSON.stringify((await stored('positions'))['note-a']));
ok('and the board on screen agrees with storage, rather than only the storage',
    await page.evaluate(() => document.querySelector('.tool[data-tool="note-a"]').offsetLeft) === before.x,
    String(await page.evaluate(() => document.querySelector('.tool[data-tool="note-a"]').offsetLeft)));
ok('the step moves to the redo side rather than being dropped',
    (await depth()).undo === 0 && (await depth()).redo === 1, JSON.stringify(await depth()));

await press('Control+Shift+z');
ok('and redo moves it back out again', (await stored('positions'))['note-a'].x === 640,
    JSON.stringify((await stored('positions'))['note-a']));
ok('with the history the right way round again',
    (await depth()).undo === 1 && (await depth()).redo === 0, JSON.stringify(await depth()));

// 3. Typing. A save per keystroke must not be an undo per keystroke.
await page.evaluate(() => {
    const custom = loadToolCustomizations();
    'hello'.split('').forEach((c, i) => {
        custom['note-b'] = { ...custom['note-b'], customContent: 'hello'.slice(0, i + 1) };
        saveToolCustomizations(custom);
    });
});
await page.waitForTimeout(250);
ok('five keystrokes in a row are one edit, not five',
    (await depth()).undo === 2 && (await depth()).top === 'tool contents', JSON.stringify(await depth()));
await press('Control+z');
ok('so one undo takes the whole word away',
    (await stored('toolCustomizations'))['note-b'].customContent === 'note-b',
    (await stored('toolCustomizations'))['note-b'].customContent);

// But a pause between edits is a boundary: these are two things the user did.
await page.evaluate(() => {
    const custom = loadToolCustomizations();
    custom['note-b'] = { ...custom['note-b'], customContent: 'first' };
    saveToolCustomizations(custom);
});
await page.waitForTimeout(900);
await page.evaluate(() => {
    const custom = loadToolCustomizations();
    custom['note-b'] = { ...custom['note-b'], customContent: 'second' };
    saveToolCustomizations(custom);
});
await page.waitForTimeout(250);
await press('Control+z');
ok('an edit after a pause is its own step',
    (await stored('toolCustomizations'))['note-b'].customContent === 'first',
    (await stored('toolCustomizations'))['note-b'].customContent);
await press('Control+z');
ok('and the one before it is still there to get back to',
    (await stored('toolCustomizations'))['note-b'].customContent === 'note-b',
    (await stored('toolCustomizations'))['note-b'].customContent);

// 4. A new edit after an undo throws the redo away — there is one future, and it is
//    the one just taken.
ok('there is something to redo before the next edit', (await depth()).redo > 0, JSON.stringify(await depth()));
await page.evaluate(() => {
    const custom = loadToolCustomizations();
    custom['note-b'] = { ...custom['note-b'], customContent: 'a different direction' };
    saveToolCustomizations(custom);
});
await page.waitForTimeout(250);
ok('and nothing to redo after it', (await depth()).redo === 0, JSON.stringify(await depth()));

// 5. Deleting a tool. The thing people most want back.
const toolCount = () => page.evaluate(() => document.querySelectorAll('.tool').length);
const had = await toolCount();
await page.evaluate(() => {
    customTools = customTools.filter(id => id !== 'note-a');
    saveCustomTools(customTools);
    const el = document.querySelector('.tool[data-tool="note-a"]');
    if (el) el.remove();
});
await page.waitForTimeout(250);
ok('a deleted tool is gone', (await toolCount()) === had - 1, String(await toolCount()));
await press('Control+z');
ok('and undo brings it back, drawn and not just recorded',
    (await toolCount()) === had &&
    await page.evaluate(() => !!document.querySelector('.tool[data-tool="note-a"]')),
    String(await toolCount()));
ok('with what was in it, because its contents were never deleted',
    (await stored('toolCustomizations'))['note-a'].title === 'note-a');

// 6. Ctrl+Z inside a text field belongs to the text field.
const beforeTyping = JSON.stringify(await stored('toolCustomizations'));
const depthBeforeTyping = await depth();
await page.evaluate(() => {
    const el = document.createElement('input');
    el.id = 'undo-probe';
    el.style.cssText = 'position:fixed;top:0;left:0;z-index:99999';
    document.body.appendChild(el);
    el.focus();
});
await page.keyboard.type('typed');
// The platform's own modifier, because this half is the browser's undo rather than
// the board's: on a Mac, Control+Z is not what a text field listens for.
await page.keyboard.press('ControlOrMeta+z');
await page.waitForTimeout(400);
ok('Ctrl+Z with the caret in a field does not undo the board',
    JSON.stringify(await stored('toolCustomizations')) === beforeTyping &&
    (await depth()).undo === depthBeforeTyping.undo,
    JSON.stringify([depthBeforeTyping, await depth()]));
ok('and the field keeps its own undo', await page.evaluate(() =>
    document.getElementById('undo-probe').value !== 'typed'),
    await page.evaluate(() => document.getElementById('undo-probe').value));
await page.evaluate(() => document.getElementById('undo-probe').remove());

// 7. The buttons do what the keys do.
const beforeBtn = (await stored('toolCustomizations'))['note-b'].customContent;
await page.evaluate(() => {
    const custom = loadToolCustomizations();
    custom['note-b'] = { ...custom['note-b'], customContent: 'by button' };
    saveToolCustomizations(custom);
});
await page.waitForTimeout(250);
await page.click('#undoBtn');
await page.waitForTimeout(450);
ok('the undo button undoes', (await stored('toolCustomizations'))['note-b'].customContent === beforeBtn,
    (await stored('toolCustomizations'))['note-b'].customContent);
await page.click('#redoBtn');
await page.waitForTimeout(450);
ok('and the redo button redoes', (await stored('toolCustomizations'))['note-b'].customContent === 'by button',
    (await stored('toolCustomizations'))['note-b'].customContent);

// 8. A history belongs to its board.
const onFirst = (await depth()).undo;
await page.evaluate(() => switchToBoard('second'));
await page.waitForTimeout(700);
ok('a second board starts with nothing to undo', (await depth()).undo === 0, JSON.stringify(await depth()));
ok('and says so on the button', await page.evaluate(() =>
    document.getElementById('undoBtn').disabled));
await page.evaluate(() => {
    const custom = loadToolCustomizations();
    custom['elsewhere'] = { title: 'elsewhere' };
    saveToolCustomizations(custom);
});
await page.waitForTimeout(250);
await press('Control+z');
ok('an undo on the second board does not reach into the first',
    (await stored('toolCustomizations'))['note-b'].customContent === 'by button',
    (await stored('toolCustomizations'))['note-b'].customContent);
ok('and the first board still has its own history waiting',
    await page.evaluate(() => (undoHistories['default'] || { undo: [] }).undo.length) === onFirst,
    String(await page.evaluate(() => (undoHistories['default'] || { undo: [] }).undo.length)));
await page.evaluate(() => switchToBoard('default'));
await page.waitForTimeout(700);
ok('and going back finds it', (await depth()).undo === onFirst, JSON.stringify(await depth()));

// 9. The history has an end, so a long session cannot grow without one.
await page.evaluate(() => {
    for (let i = 0; i < UNDO_LIMIT + 20; i++) {
        const custom = loadToolCustomizations();
        custom['note-b'] = { ...custom['note-b'], customContent: 'step ' + i };
        // Each one its own edit: the merge window is what stands between a loop and
        // a single step, and this test is about the ceiling, not the merging.
        undoHistory().undo.push({ key: 'toolCustomizations', before: null, after: null,
            at: 0, label: 'tool contents' });
        if (undoHistory().undo.length > UNDO_LIMIT) undoHistory().undo.shift();
        saveToolCustomizations(custom);
    }
});
await page.waitForTimeout(300);
ok('the history stops at its limit rather than growing forever',
    (await depth()).undo === await page.evaluate(() => UNDO_LIMIT), JSON.stringify(await depth()));

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
await page.screenshot({ path: OUT + '/undo-redo.png' });
await browser.close();
