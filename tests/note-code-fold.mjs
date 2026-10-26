// A note's code blocks fold away under a bar that says what they are and how long.
// Which are folded is the note's to keep, not the Markdown's: nothing that reads the
// note sees it, and copying the note copies all of its code.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1200, height: 850 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:8777/index.html');
await page.waitForSelector('#toolboard', { timeout: 20000 });
await page.waitForTimeout(1000);

const LONG = Array.from({ length: 30 }, (_, i) => 'line ' + (i + 1)).join('\n');
const MD = '# Snippets\n\nFirst:\n\n```js\nconst a = 1;\nconst b = 2;\n```\n\nSecond:\n\n```\n' + LONG + '\n```\n\nThe end.';
const make = () => page.evaluate((md) => {
    const id = createNoteWithText(md, 'Snippets');
    setToolMode(id, 'render');
    return id;
}, MD);
const note = await make();
await page.waitForTimeout(600);
const sel = (id, s) => '.tool[data-tool="' + id + '"] ' + s;
const blocks = (id) => page.evaluate((s) => Array.from(document.querySelectorAll(s)).map(w => ({
    folded: w.classList.contains('folded'),
    shown: getComputedStyle(w.querySelector('pre')).display !== 'none',
    expanded: w.querySelector('.note-code-bar').getAttribute('aria-expanded'),
    bar: w.querySelector('.note-code-bar').textContent
})), sel(id, '.authoring-result .note-code'));
const md = (id) => page.evaluate((i) => toolCustomizations[i].customContent, id);

// 1. The bar.
let b = await blocks(note);
ok('each code block has a bar over it', b.length === 2, JSON.stringify(b));
ok('naming its language and its length', b[0].bar === '▾js2 lines' && b[1].bar === '▾code30 lines', JSON.stringify(b.map(x => x.bar)));
ok('open to begin with', b.every(x => !x.folded && x.shown && x.expanded === 'true'));

// 2. Folding, by mouse and by keyboard.
await page.click(sel(note, '.note-code[data-code-index="1"] .note-code-bar'));
b = await blocks(note);
ok('clicking the bar folds the block away', b[1].folded && !b[1].shown && b[1].expanded === 'false' && b[1].bar.startsWith('▸'));
ok('and only that one', !b[0].folded);
ok('the rest of the note stays where it is', await page.evaluate((s) => /The end\./.test(document.querySelector(s).textContent), sel(note, '.authoring-result')));
await page.focus(sel(note, '.note-code[data-code-index="0"] .note-code-bar'));
await page.keyboard.press('Enter');
ok('Enter on the bar folds it too', (await blocks(note))[0].folded);
await page.keyboard.press('Space');
ok('and Space opens it again', !(await blocks(note))[0].folded);
await page.dblclick(sel(note, '.note-code[data-code-index="0"] .note-code-bar'));
await page.waitForTimeout(200);
ok('a double-click on the bar is two toggles, not a way into the editor', !(await blocks(note))[0].folded &&
    await page.evaluate((i) => getToolMode(i), note) === 'render');

// 3. The Markdown is untouched; what is folded is kept with the note.
ok('folding does not touch the Markdown', await md(note) === MD);
ok('what is folded is kept with the note', JSON.stringify(await page.evaluate((i) => toolCustomizations[i].codeFold, note)) ===
    JSON.stringify({ 0: false, 1: true }));
await page.reload();
await page.waitForTimeout(1200);
b = await blocks(note);
ok('and is still folded after a reload', !b[0].folded && b[1].folded, JSON.stringify(b));
const other = await make();
await page.waitForTimeout(500);
ok('another note with the same code has its own', (await blocks(other)).every(x => !x.folded));

// 4. Copying copies the note: all its code, and none of the bars.
await page.evaluate((i) => noteCopyRendered(document.querySelector('.tool[data-tool="' + i + '"] .note-copy-rich')), note);
await page.waitForTimeout(400);
const copied = await page.evaluate(async () => {
    const items = await navigator.clipboard.read();
    const html = items[0].types.includes('text/html') ? await (await items[0].getType('text/html')).text() : '';
    const text = items[0].types.includes('text/plain') ? await (await items[0].getType('text/plain')).text() : '';
    return { html, text };
});
ok('Copy formatted copies folded code as well', /line 30/.test(copied.html) && /line 30/.test(copied.text), copied.text.slice(-80));
ok('and none of the bars', !/note-code-bar|30 lines|▸/.test(copied.html) && !/30 lines/.test(copied.text));
ok('the page itself is left as it was', (await blocks(note))[1].folded);

// 5. Long blocks can start folded.
await page.evaluate((i) => { const t = document.querySelector('.tool[data-tool="' + i + '"]'); maxZ++; t.style.zIndex = maxZ; }, other);
await page.hover(sel(other, '.tool-header'));
await page.click(sel(other, '.settings-btn'));
await page.waitForTimeout(300);
ok('the note’s settings offer to fold long code blocks', await page.evaluate(() =>
    !document.getElementById('toolSettingsCodeFoldRow').hidden));
await page.selectOption('#toolSettingsCodeFold', '20');
await page.waitForTimeout(200);
b = await blocks(other);
ok('over 20 lines starts folded, shorter stays open', !b[0].folded && b[1].folded, JSON.stringify(b));
ok('and it is kept as the note’s setting', await page.evaluate((i) => toolCustomizations[i].codeFoldLong, other) === 20);
// The settings panel is over the note, so the bar is pressed as a keyboard would.
await page.evaluate((s) => document.querySelector(s).click(), sel(other, '.note-code[data-code-index="1"] .note-code-bar'));
await page.selectOption('#toolSettingsCodeFold', '10');
await page.waitForTimeout(200);
ok('a block opened by hand stays open whatever the setting', !(await blocks(other))[1].folded);
ok('the setting is styled like the settings around it', await page.evaluate(() =>
    document.getElementById('toolSettingsCodeFold').classList.contains('font-select')));
await page.click('#toolSettingsOverlay .tool-settings-close');
await page.waitForTimeout(200);

// 6. Not in the editor.
ok('the rich editor shows every block whole, with no bars in it', await page.evaluate((i) => {
    setToolMode(i, 'edit');
    const surface = document.querySelector('.tool[data-tool="' + i + '"] .note-rich');
    return !!surface && surface.querySelectorAll('.note-code-bar').length === 0 && /line 30/.test(surface.textContent);
}, note));
ok('and the editor saves the code as it was', await page.evaluate((i) => {
    noteRichSave(document.querySelector('.tool[data-tool="' + i + '"] .note-rich'));
    return toolCustomizations[i].customContent;
}, note) === MD);

// 7. Printing shows it all.
await page.evaluate((i) => setToolMode(i, 'render'), note);
await page.emulateMedia({ media: 'print' });
ok('printed, folded code is shown and the bars are not', await page.evaluate((s) => {
    const w = document.querySelector(s);
    return getComputedStyle(w.querySelector('pre')).display !== 'none' && getComputedStyle(w.querySelector('.note-code-bar')).display === 'none';
}, sel(note, '.note-code[data-code-index="1"]')));
await page.emulateMedia({ media: 'screen' });

await page.evaluate((i) => { const t = document.querySelector('.tool[data-tool="' + i + '"]'); maxZ++; t.style.zIndex = maxZ; }, note);
await page.screenshot({ path: OUT + '/note-code-fold.png' });
await page.evaluate(() => document.body.classList.add('dark-mode'));
await page.waitForTimeout(150);
await page.screenshot({ path: OUT + '/note-code-fold-dark.png' });

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + 25 + ' assertions reached)');
await browser.close();
