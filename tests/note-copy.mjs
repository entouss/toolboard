// Getting a note out of the board and into something else. A note is written in
// Markdown and read as a document, and those are two different things to copy: a
// ticket or a README wants the source, and a document, an email or a chat message
// wants what it looks like — paste the source into one of those and you get hashes
// and asterisks where the headings were.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1100, height: 850 },
    permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:8777/index.html');
await page.waitForSelector('#toolboard', { timeout: 20000 });
await page.waitForTimeout(1200);

const SOURCE = '# Autumn plan\n\nA line about it.\n\n- first\n- second\n';
const noteId = await page.evaluate((text) => createNoteWithText(text, 'Autumn plan'), SOURCE);
await page.waitForTimeout(700);

// 1. A note can be made by something other than a person pressing Add. The board's
//    own helper, so a tool with something worth keeping does not have to know how a
//    note is built, where it goes or how it is saved.
ok('a tool can put a note on the board, holding what it was given',
    await page.evaluate((id) => (toolCustomizations[id] || {}).customContent, noteId) === SOURCE,
    JSON.stringify(await page.evaluate((id) => (toolCustomizations[id] || {}).customContent, noteId)));
ok('with the title it was given, on the window and in storage',
    await page.evaluate((id) => {
        const tool = document.querySelector('.tool[data-tool="' + CSS.escape(id) + '"]');
        return tool.querySelector('.tool-title').textContent === 'Autumn plan' &&
            (toolCustomizations[id] || {}).title === 'Autumn plan';
    }, noteId));
ok('the note is drawn, rather than waiting for the next reload to show anything',
    await page.evaluate((id) => {
        const tool = document.querySelector('.tool[data-tool="' + CSS.escape(id) + '"]');
        return [...tool.querySelectorAll('.authoring-result h1')].map(h => h.textContent).join(',');
    }, noteId) === 'Autumn plan');
ok('and its own editing pane holds the same text, not an empty box over a full note',
    await page.evaluate((id) => {
        const tool = document.querySelector('.tool[data-tool="' + CSS.escape(id) + '"]');
        return tool.querySelector('.note-source').value;
    }, noteId) === SOURCE);
ok('it is written to storage like anything else on the board, so it survives a reload',
    await page.evaluate(({ id, text }) => {
        const stored = JSON.parse(localStorage.getItem('finance_default_toolCustomizations') || '{}');
        const tools = JSON.parse(localStorage.getItem('finance_default_customTools') || '[]');
        return tools.includes(id) && (stored[id] || {}).customContent === text;
    }, { id: noteId, text: SOURCE }));

// 2. The two copies.
const sel = (s) => '.tool[data-tool="' + noteId + '"] ' + s;
const reach = async (label) => {
    await page.hover(sel('.tool-header'));
    await page.waitForTimeout(250);
    await page.click(sel('.note-btn:has-text("' + label + '")'));
};
const buttons = () => page.evaluate((id) => {
    const tool = document.querySelector('.tool[data-tool="' + CSS.escape(id) + '"]');
    return [...tool.querySelectorAll('.note-btn')].map(b => b.textContent.trim());
}, noteId);
ok('a note offers both copies, beside the editor it already had',
    (await buttons()).join('|') === 'Editor|Copy Markdown|Copy formatted', (await buttons()).join('|'));

await page.evaluate(() => navigator.clipboard.writeText('nothing yet'));
await reach('Copy Markdown');
await page.waitForTimeout(400);
const copiedSource = await page.evaluate(() => navigator.clipboard.readText());
ok('copying the Markdown gives the source, exactly as it is written',
    copiedSource === SOURCE, JSON.stringify(copiedSource).slice(0, 80));

await reach('Copy formatted');
await page.waitForTimeout(500);
const rich = await page.evaluate(async () => {
    const items = await navigator.clipboard.read();
    const out = { types: [], html: '', text: '' };
    for (const item of items) {
        out.types = out.types.concat(item.types);
        if (item.types.includes('text/html')) out.html = await (await item.getType('text/html')).text();
        if (item.types.includes('text/plain')) out.text = await (await item.getType('text/plain')).text();
    }
    return out;
});
ok('copying the formatted note puts markup on the clipboard, so a document keeps the headings',
    /<h1[^>]*>Autumn plan<\/h1>/.test(rich.html) && /<li>first<\/li>/.test(rich.html),
    rich.html.slice(0, 120));
ok('and the words beside it, for somewhere that takes no markup',
    rich.types.includes('text/plain') && /Autumn plan/.test(rich.text) && !/<h1/.test(rich.text) &&
    !/^# /.test(rich.text), JSON.stringify(rich.text.slice(0, 60)));
ok('which is what it looks like rather than how it is written — no hashes, no asterisks',
    !/^#/m.test(rich.text) && !/^- first$/m.test(rich.text), JSON.stringify(rich.text.slice(0, 80)));

// 3. The way that works where the modern one is refused. A secure context is not
//    always there and Safari has been particular about when it allows a write, so
//    the old selection-and-copy is kept as the path underneath rather than as a
//    message saying it did not work.
await page.evaluate(() => {
    window.__richFallbackUsed = false;
    window.__savedWrite = navigator.clipboard.write;
    navigator.clipboard.write = () => Promise.reject(new Error('refused'));
    const exec = document.execCommand.bind(document);
    document.execCommand = (cmd) => { if (cmd === 'copy') window.__richFallbackUsed = true; return exec(cmd); };
});
await page.evaluate(() => navigator.clipboard.writeText('nothing yet'));
await reach('Copy formatted');
await page.waitForTimeout(600);
ok('a browser that refuses the modern clipboard still copies, the old way',
    await page.evaluate(() => window.__richFallbackUsed === true));
ok('and the selection the reader had is put back, rather than left over the hidden copy',
    await page.evaluate(() => {
        const s = window.getSelection();
        return !s.rangeCount || !document.querySelector('[contenteditable="true"][style*="-9999px"]');
    }));
await page.evaluate(() => { navigator.clipboard.write = window.__savedWrite; });

// 4. A note made while a tool was maximized has to be visible, or nothing appears to
//    have happened: a maximized tool covers the whole board.
await page.evaluate((id) => {
    const tool = document.querySelector('.tool[data-tool="' + CSS.escape(id) + '"]');
    enterToolFullscreen(tool);
}, noteId);
await page.waitForTimeout(400);
const second = await page.evaluate(() => createNoteWithText('# Second\n', 'Second note'));
await page.waitForTimeout(700);
ok('making a note while something is maximized leaves the maximized view, so the note can be seen',
    await page.evaluate(() => !document.querySelector('.tool.fullscreen')));
ok('and the new note is on top of the board rather than behind what made it',
    await page.evaluate((id) => {
        const tool = document.querySelector('.tool[data-tool="' + CSS.escape(id) + '"]');
        const others = [...document.querySelectorAll('.tool')].filter(t => t !== tool);
        const z = Number(tool.style.zIndex || 0);
        return others.every(o => Number(o.style.zIndex || 0) <= z);
    }, second));

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
await page.screenshot({ path: OUT + '/note-copy.png' });
await browser.close();
