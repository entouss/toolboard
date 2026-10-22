// The note's rich editor: the same Markdown note, written the way a chat message is
// written. A formatting bar, Slack's shortcuts, Slack's marks turning into what they
// mean as they are typed — and underneath, the note is still Markdown, so everything
// that reads a note goes on reading the same thing. What it must never do is change
// a note that rich text cannot hold, or let text become running HTML.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1200, height: 850 },
    permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:8777/index.html');
await page.waitForSelector('#toolboard', { timeout: 20000 });
await page.waitForTimeout(1200);
const MOD = await page.evaluate(() => /Mac/.test(navigator.platform) ? 'Meta' : 'Control');

// A note made from now on, and one made before this existed.
const fresh = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(800);
const sel = (id, s) => '.tool[data-tool="' + id + '"] ' + s;
const md = (id) => page.evaluate((i) => toolCustomizations[i].customContent, id);
const isRich = (id) => page.evaluate((s) => document.querySelector(s).classList.contains('note-rich-on'),
    sel(id, '.note-widget'));
// Notes made one after another stack twenty pixels apart, so by the later sections
// the first one is under eight others. Brought forward first, the way a person would.
const front = (id) => page.evaluate((i) => {
    const tool = document.querySelector('.tool[data-tool="' + i + '"]');
    maxZ++;
    tool.style.zIndex = maxZ;
}, id);
const reach = async (id, s) => {
    await front(id);
    await page.hover(sel(id, '.tool-header'));
    await page.waitForTimeout(250);
    await page.click(sel(id, s));
};

// 1. Which notes it is for.
ok('a new note opens in the rich editor', await isRich(fresh));
ok('with the caret already in it, ready to type',
    await page.evaluate((s) => document.activeElement === document.querySelector(s), sel(fresh, '.note-rich')));
ok('and its formatting bar in Slack’s order',
    await page.evaluate((s) => [...document.querySelectorAll(s)].map(b => b.dataset.fmt).join(','),
        sel(fresh, '.note-rich-btn[data-fmt]')) === 'h1,h2,h3,bold,italic,underline,strike,link,ol,ul,quote,code,codeblock,hr');
const old = await page.evaluate(() => {
    const id = createNoteWithText('# Older\n\nWritten before.\n', 'Older');
    delete toolCustomizations[id].noteEditor;
    saveToolCustomizations(toolCustomizations);
    renderToolboard();
    return id;
});
await page.waitForTimeout(900);
ok('a note made before keeps the Markdown it was written in, so nobody’s note changes under them',
    !(await isRich(old)));

// 2. Slack's marks, as they are typed. One asterisk is bold here, because that is what
//    somebody who writes in Slack means by it; what is stored is ordinary Markdown.
await page.click(sel(fresh, '.note-rich'));
await page.keyboard.type('Say *bold* and _lean_ and ~gone~ and `code` then plain');
await page.waitForTimeout(200);
ok('*bold* becomes bold, and is stored as Markdown bold', /Say \*\*bold\*\* and/.test(await md(fresh)),
    JSON.stringify(await md(fresh)));
ok('_lean_ becomes italic', /and \*lean\* and/.test(await md(fresh)), JSON.stringify(await md(fresh)));
ok('~gone~ is struck through', /and ~~gone~~ and/.test(await md(fresh)), JSON.stringify(await md(fresh)));
ok('`code` becomes code', /and `code` then/.test(await md(fresh)), JSON.stringify(await md(fresh)));
ok('a space typed beside formatting is stored as a space, not a non-breaking one',
    !/\u00A0/.test(await md(fresh)), JSON.stringify(await md(fresh)));
ok('and typing carries on plain after each one, the way it does in Slack',
    /`code` then plain$/.test(await md(fresh)), JSON.stringify(await md(fresh)));
ok('2*3*4 is still a sum: a mark needs a space before it',
    await page.evaluate(() => {
        const box = document.createElement('div');
        box.className = 'note-rich'; box.contentEditable = 'true';
        document.body.appendChild(box);
        box.innerHTML = '<p>2*3*4</p>';
        const t = box.querySelector('p').firstChild;
        const r = document.createRange(); r.setStart(t, 5); r.collapse(true);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        noteRichInline(box, '*');
        const kept = box.innerHTML === '<p>2*3*4</p>';
        box.remove();
        return kept;
    }));
// That check borrowed the selection; give it back before typing on.
await page.click(sel(fresh, '.note-rich'));
await page.keyboard.press(MOD + '+End');

// 3. Lines that start with a marker become what the marker means.
await page.keyboard.press('Enter');
await page.keyboard.type('- one');
await page.keyboard.press('Enter');
await page.keyboard.type('two');
await page.keyboard.press('Enter');
await page.keyboard.press('Enter');
await page.keyboard.type('1. first');
await page.keyboard.press('Enter');
await page.keyboard.type('second');
await page.keyboard.press('Enter');
await page.keyboard.press('Enter');
await page.keyboard.type('> said');
await page.keyboard.press('Enter');
await page.keyboard.press('Enter');
await page.keyboard.type('```');
await page.keyboard.press(' ');
await page.keyboard.type('let x = 1');
await page.waitForTimeout(200);
let text = await md(fresh);
ok('"- " starts a bulleted list', /\n- one\n- two\n/.test(text), JSON.stringify(text));
ok('"1. " starts a numbered one', /\n1\. first\n2\. second\n/.test(text), JSON.stringify(text));
ok('"> " starts a quote, and Enter on an empty line leaves it', /\n> said\n/.test(text), JSON.stringify(text));
ok('a fence starts a code block', /```\nlet x = 1\n```/.test(text), JSON.stringify(text));
ok('and every one of them is a block of its own, not a block inside a paragraph',
    await page.evaluate((s) => !document.querySelector(s).querySelector('p ul, p ol, p blockquote, p pre, p p'),
        sel(fresh, '.note-rich')),
    await page.evaluate((s) => document.querySelector(s).innerHTML.slice(0, 240), sel(fresh, '.note-rich')));
ok('and the list a person sees has its bullets, because the editor wears the note’s own styles',
    await page.evaluate((s) => {
        const ul = document.querySelector(s + ' ul');
        return !!ul && parseFloat(getComputedStyle(ul).paddingLeft) > 0;
    }, sel(fresh, '.note-rich')));

// 4. The bar and the shortcuts, on a selection.
const fresh2 = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(800);
const surface2 = sel(fresh2, '.note-rich');
const selectAll = async () => {
    await page.click(surface2);
    await page.keyboard.press(MOD + '+a');
};
await page.click(surface2);
await page.keyboard.type('word');
await selectAll();
await page.keyboard.press(MOD + '+b');
ok('⌘B makes the selection bold', (await md(fresh2)) === '**word**', JSON.stringify(await md(fresh2)));
ok('and the bar shows it pressed, so it says what typing will do',
    await page.evaluate((s) => document.querySelector(s).classList.contains('active'),
        sel(fresh2, '.note-rich-btn[data-fmt="bold"]')));
await page.keyboard.press(MOD + '+b');
await page.keyboard.press(MOD + '+i');
ok('⌘I makes it italic', (await md(fresh2)) === '*word*', JSON.stringify(await md(fresh2)));
await page.keyboard.press(MOD + '+i');
await page.keyboard.press(MOD + '+Shift+x');
ok('⌘⇧X strikes it through', (await md(fresh2)) === '~~word~~', JSON.stringify(await md(fresh2)));
await page.keyboard.press(MOD + '+Shift+x');
await page.keyboard.press(MOD + '+Shift+8');
ok('⌘⇧8 makes it a bulleted list', (await md(fresh2)) === '- word', JSON.stringify(await md(fresh2)));
await page.keyboard.press(MOD + '+Shift+8');
await page.keyboard.press(MOD + '+Shift+7');
ok('⌘⇧7 a numbered one', (await md(fresh2)) === '1. word', JSON.stringify(await md(fresh2)));
await page.keyboard.press(MOD + '+Shift+7');
await selectAll();
await page.keyboard.press(MOD + '+Shift+9');
ok('⌘⇧9 a quote', (await md(fresh2)) === '> word', JSON.stringify(await md(fresh2)));
await page.keyboard.press(MOD + '+Shift+9');
await selectAll();
await page.keyboard.press(MOD + '+Shift+c');
ok('⌘⇧C code', (await md(fresh2)) === '`word`', JSON.stringify(await md(fresh2)));
await page.keyboard.press(MOD + '+Shift+c');
ok('and pressing it again takes the code off', (await md(fresh2)) === 'word', JSON.stringify(await md(fresh2)));
await selectAll();
await page.click(sel(fresh2, '.note-rich-btn[data-fmt="codeblock"]'));
ok('the bar’s code block button fences it', (await md(fresh2)) === '```\nword\n```', JSON.stringify(await md(fresh2)));
await page.click(sel(fresh2, '.note-rich-btn[data-fmt="codeblock"]'));
ok('and takes the fence off again', (await md(fresh2)) === 'word', JSON.stringify(await md(fresh2)));

// 5. Links — a small form, not a prompt that takes the whole window and the selection.
await selectAll();
await page.keyboard.press(MOD + '+Shift+u');
await page.waitForTimeout(150);
ok('⌘⇧U opens the link form with the address field ready',
    await page.evaluate((s) => !document.querySelector(s).hidden &&
        document.activeElement === document.querySelector(s + ' .note-rich-link-url'), sel(fresh2, '.note-rich-link')));
await page.keyboard.type('example.com/page');
await page.keyboard.press('Enter');
await page.waitForTimeout(200);
ok('and the selected words become the link, with the address made a web one',
    (await md(fresh2)) === '[word](https://example.com/page)', JSON.stringify(await md(fresh2)));
ok('an address that is not a web or mail one makes no link at all',
    await page.evaluate(() => noteSafeUrl('javascript:alert(1)') === '' &&
        noteSafeUrl('mailto:a@b.co') === 'mailto:a@b.co' && noteSafeUrl('https://x.io') === 'https://x.io'));

// 6. Paste. What was copied keeps what Markdown can say and loses everything else.
const pasteInto = (s, data) => page.evaluate(({ s, data }) => {
    const el = document.querySelector(s);
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el); range.collapse(false);
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
    const dt = new DataTransfer();
    Object.keys(data).forEach(k => dt.setData(k, data[k]));
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
}, { s, data });
const fresh3 = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(800);
const surface3 = sel(fresh3, '.note-rich');
await pasteInto(surface3, {
    'text/html': '<h2 style="color:red">Copied</h2><p class="x">From <strong>somewhere</strong> ' +
        '<span onclick="window.__pwned=1">else</span></p><script>window.__pwned=2</script>' +
        '<style>body{display:none}</style><img src="logo.svg" alt="logo" onerror="window.__pwned=3">',
    'text/plain': 'Copied From somewhere else'
});
await page.waitForTimeout(300);
const pasted = await md(fresh3);
const pastedHtml = await page.evaluate((s) => document.querySelector(s).innerHTML, surface3);
ok('a paste keeps the headings and the bold it came with', /## Copied/.test(pasted) && /\*\*somewhere\*\*/.test(pasted),
    JSON.stringify(pasted));
ok('and loses the scripts, the styles and the handlers',
    !/script|style|onclick|onerror|color:red|class=/i.test(pastedHtml) && !/pwned/.test(pasted),
    pastedHtml.slice(0, 200));
ok('an image is kept, because Markdown can say an image — just not its handler',
    /!\[logo\]\(logo\.svg\)/.test(pasted) && /<img[^>]*logo\.svg/.test(pastedHtml) && !/onerror/.test(pastedHtml),
    JSON.stringify(pasted));
ok('none of which ever ran', await page.evaluate(() => window.__pwned === undefined),
    String(await page.evaluate(() => window.__pwned)));
await page.click(surface3);
await page.keyboard.press(MOD + '+a');
await pasteInto(surface3, { 'text/plain': 'https://example.org/thing' }).catch(() => {});
await page.evaluate((s) => {
    const el = document.querySelector(s);
    el.focus();
    const range = document.createRange(); range.selectNodeContents(el);
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
    const dt = new DataTransfer(); dt.setData('text/plain', 'https://example.org/thing');
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
}, surface3);
await page.waitForTimeout(250);
ok('a web address pasted over a selection makes it a link, as in Slack',
    /\]\(https:\/\/example\.org\/thing\)/.test(await md(fresh3)), JSON.stringify(await md(fresh3)));

// 7. Text that looks like HTML stays text. Stored raw, it would be an image that runs
//    script every time the note is shown.
const fresh4 = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(800);
await page.click(sel(fresh4, '.note-rich'));
await page.keyboard.type('a < b and <img src=x onerror=window.__pwned=4>');
await page.waitForTimeout(250);
const escaped = await md(fresh4);
ok('text that looks like HTML is stored escaped, so it can never become HTML',
    /\\</.test(escaped) && !/(^|[^\\])<img/.test(escaped), JSON.stringify(escaped));
await page.evaluate((i) => noteRender(i), fresh4);
await page.waitForTimeout(300);
ok('and the rendered note shows it as words, running nothing',
    await page.evaluate((s) => !document.querySelector(s + ' .authoring-result img') &&
        /<img src=x/.test(document.querySelector(s + ' .authoring-result').textContent) &&
        window.__pwned === undefined, sel(fresh4, '')),
    await page.evaluate((s) => document.querySelector(s + ' .authoring-result').innerHTML.slice(0, 160), sel(fresh4, '')));

// 8. A note rich text cannot hold is not opened in it. Editing it would change it.
const blocked = async (markdown) => {
    const id = await page.evaluate((m) => createNoteWithText(m, 'Guarded'), markdown);
    await page.waitForTimeout(700);
    return page.evaluate((i) => {
        const tool = document.querySelector('.tool[data-tool="' + i + '"]');
        return { rich: tool.querySelector('.note-widget').classList.contains('note-rich-on'),
            why: tool.querySelector('.note-rich-why').hidden ? '' : tool.querySelector('.note-rich-why').textContent,
            disabled: tool.querySelector('.note-mode-rich').disabled,
            md: toolCustomizations[i].customContent };
    }, id);
};
// An HTML comment is the plainest case: it would be lost on the way through.
const comment = await blocked('<!-- note to self -->\n\nText\n');
ok('a note with something rich text would lose opens as Markdown, even though new notes ask for rich',
    !comment.rich, JSON.stringify(comment));
ok('and says why, in a sentence', /cannot keep/.test(comment.why) && /comment/.test(comment.why), comment.why);
ok('with Rich switched off rather than left to be pressed', comment.disabled);
ok('and not a character of it changed by being opened', comment.md === '<!-- note to self -->\n\nText\n',
    JSON.stringify(comment.md));
const raw = await blocked('Before <span style="color:red">red</span> after\n');
ok('raw HTML is guarded the same way', !raw.rich && /cannot keep/.test(raw.why), JSON.stringify(raw));
const tasks = await blocked('- [ ] buy milk\n- [x] done\n');
ok('and so is a checklist', !tasks.rich, JSON.stringify(tasks));
const plain = await blocked('# Heading\n\nA paragraph with **bold**, a [link](https://x.io) and\n\n- a list\n- of two\n\n> and a quote\n');
ok('while ordinary Markdown — headings, bold, links, lists, quotes — opens in rich as asked',
    plain.rich && !plain.why, JSON.stringify(plain));
ok('a line that starts with a space is not taken for formatting rich text cannot keep — but code keeps its spaces',
    await page.evaluate(() => noteRoundTrips(' Starts with a space\n\n- item \n\n## Head ') &&
        !noteSameHtml('<pre><code> x</code></pre>', '<pre><code>x</code></pre>')));
ok('nor is a character spelled as an entity — &copy; and © are one note — while a comment, which would be lost, still is',
    await page.evaluate(() => noteRoundTrips('&copy; 2026 &amp; &nbsp;x') && !noteRoundTrips('<!-- note to self -->\ntext')));
ok('the test is what a note means, not how it was spelled: __this__ and **this** are one note',
    await page.evaluate(() => noteRoundTrips('__this__ and * star list') && noteRoundTrips('+ a\n+ b') &&
        !noteRoundTrips('- [ ] a checklist')));
ok('a note shown as plain text is not offered rich text at all',
    await page.evaluate(() => /plain text/.test(noteRichBlocker({ plainText: true, customContent: 'x' }))));
ok('but one whose lines are sorted or changed when shown is: that happens to the showing, not the writing',
    await page.evaluate(() => noteRichBlocker({ textSort: 'asc', textCasing: 'upper', customContent: 'x' }) === ''));

// 9. Switching. The same note either way; nothing is lost going back and forth.
const before = await md(fresh);
await reach(fresh, '.note-mode-md');
await page.waitForTimeout(250);
ok('switching to Markdown shows the Markdown, word for word',
    !(await isRich(fresh)) && await page.evaluate((s) => document.querySelector(s).value, sel(fresh, '.note-source')) === before);
await page.click(sel(fresh, '.note-source'));
await page.keyboard.press(MOD + '+End');
await page.keyboard.type('\n\nAdded in **Markdown**.');
await page.waitForTimeout(200);
await reach(fresh, '.note-mode-rich');
await page.waitForTimeout(250);
ok('and switching back shows what was written there, formatted',
    await isRich(fresh) && await page.evaluate((s) =>
        /Added in/.test(document.querySelector(s).textContent) &&
        !!document.querySelector(s + ' b, ' + s + ' strong'), sel(fresh, '.note-rich')));
ok('the choice is kept with the note', await page.evaluate((i) => toolCustomizations[i].noteEditor, fresh) === 'rich');

// 10. The rest of the board still reads a Markdown note.
await front(fresh);
await page.evaluate((i) => setToolMode(i, 'split'), fresh);
await page.waitForTimeout(300);
await page.click(sel(fresh, '.note-rich'));
await page.keyboard.press(MOD + '+End');
await page.keyboard.type(' More.');
await page.waitForTimeout(250);
ok('in Both, the rendered side follows the rich side as it is typed',
    await page.evaluate((s) => /More\./.test(document.querySelector(s).textContent), sel(fresh, '.authoring-result')));
await reach(fresh, '.note-copy-md');
await page.waitForTimeout(300);
ok('Copy Markdown still gives Markdown', /\*\*bold\*\*/.test(await page.evaluate(() => navigator.clipboard.readText())),
    (await page.evaluate(() => navigator.clipboard.readText())).slice(0, 60));
ok('and the board’s undo leaves the editor’s own undo alone',
    await page.evaluate(() => {
        const el = document.querySelector('.note-rich');
        el.focus();
        const e = new KeyboardEvent('keydown', { key: 'z', metaKey: true, ctrlKey: true, bubbles: true, cancelable: true });
        el.dispatchEvent(e);
        return !e.defaultPrevented;
    }));

// 11. What Edit Content offers besides the text: emoji, transforms, and how long it is.
const extras = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(800);
await front(extras);
await page.click(sel(extras, '.note-rich'));
await page.keyboard.type('pear apple');
// Home scrolls rather than moving the caret on a Mac; six to the left lands after "pear".
for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowLeft');
ok('the bar ends with emoji, find and a Transform menu',
    await page.evaluate((s) => [...document.querySelector(s).children].slice(-3)
        .map(el => el.classList.contains('note-rich-emoji') ? 'emoji' : el.classList.contains('note-find-btn') ? 'find'
            : el.classList.contains('note-rich-tf') ? 'tf' : '?')
        .join(','), sel(extras, '.note-rich-bar')) === 'emoji,find,tf');
await reach(extras, '.note-rich-emoji');
await page.waitForSelector('#toolPickerPopup .emote-cell', { timeout: 15000 }).catch(() => {});
const picked = await page.evaluate(() => {
    const cell = document.querySelector('#toolPickerPopup .emote-cell');
    return cell ? cell.textContent.trim() : '';
});
ok('it opens the board’s emoji picker', !!picked);
if (picked) await page.click('#toolPickerPopup .emote-cell');
await page.waitForTimeout(250);
ok('the emoji lands where the caret was, not at the start of the note',
    await md(extras) === 'pear' + picked + ' apple', JSON.stringify(await md(extras)));
ok('and the picker closes', await page.evaluate(() => document.getElementById('toolPickerPopup').style.display === 'none'));
await page.keyboard.type('!');
await page.waitForTimeout(150);
ok('with the caret after it, so typing carries on', await md(extras) === 'pear' + picked + '! apple',
    JSON.stringify(await md(extras)));

// Transforms change the showing, never the writing.
const fruit = await page.evaluate(() => {
    const id = createNoteWithText('- pear\n- apple\n- fig\n', 'Fruit');
    toolCustomizations[id].noteEditor = 'rich';
    saveToolCustomizations(toolCustomizations);
    noteApplyEditor(id);
    setToolMode(id, 'split');
    return id;
});
await page.waitForTimeout(700);
const shown = () => page.evaluate((s) => [...document.querySelectorAll(s)].map(li => li.textContent.trim()).join(','),
    sel(fruit, '.authoring-result li'));
const written = () => page.evaluate((s) => [...document.querySelectorAll(s)].map(li => li.textContent.trim()).join(','),
    sel(fruit, '.note-rich li'));
const tfLabel = () => page.evaluate((s) => document.querySelector(s).textContent, sel(fruit, '.note-rich-tf-btn'));
const panelOpen = () => page.evaluate((s) => document.querySelector(s).classList.contains('open'), sel(fruit, '.note-rich-tf-panel'));
await reach(fruit, '.note-rich-tf-btn');
await page.waitForTimeout(150);
const choices = (panel) => page.evaluate((s) => [...document.querySelectorAll(s)].map(el =>
    el.matches('select') ? [...el.options].map(o => o.value + '=' + o.textContent).join(',') : el.dataset.tf + '=' + el.parentNode.textContent.trim()).join('|'),
    panel + ' input[data-tf], ' + panel + ' select');
ok('Transform opens the same menu Edit Content has, choice for choice',
    await panelOpen() && await choices(sel(fruit, '.note-rich-tf-panel')) === await choices('#editorTransformPanel'),
    await choices(sel(fruit, '.note-rich-tf-panel')));
ok('and, in a note too narrow for the bar, opens inside the note rather than off its edge',
    await page.evaluate((s) => {
        const clip = document.querySelector(s + ' .tool-content').getBoundingClientRect();
        const r = document.querySelector(s + ' .note-rich-tf-panel').getBoundingClientRect();
        return r.left >= clip.left && r.right <= clip.right && r.bottom <= clip.bottom;
    }, sel(fruit, '').trim()));
await page.click(sel(fruit, '.note-rich-tf-panel input[data-tf="sortAsc"]'));
await page.waitForTimeout(200);
ok('Sort A–Z is kept with the note, in the setting Edit Content keeps it in',
    await page.evaluate((i) => toolCustomizations[i].textSort, fruit) === 'asc');
ok('the note is shown sorted', await shown() === 'apple,fig,pear', await shown());
ok('while what is being written keeps its own order', await written() === 'pear,apple,fig', await written());
ok('and so does the Markdown', await md(fruit) === '- pear\n- apple\n- fig\n', JSON.stringify(await md(fruit)));
ok('the button says one thing is on', await tfLabel() === 'Transform · 1', await tfLabel());
ok('and the menu stays open for the next one', await panelOpen());
await page.selectOption(sel(fruit, '.note-rich-tf-panel select[data-tf-casing]'), 'upper');
await page.waitForTimeout(200);
ok('casing too', await page.evaluate((i) => toolCustomizations[i].textCasing, fruit) === 'upper' &&
    await shown() === 'APPLE,FIG,PEAR' && await tfLabel() === 'Transform · 2', await shown() + ' ' + await tfLabel());
ok('and the menu stays inside the note when the longer “Transform · 2” moves its button',
    await page.evaluate((s) => {
        const clip = document.querySelector(s + ' .tool-content').getBoundingClientRect();
        const r = document.querySelector(s + ' .note-rich-tf-panel').getBoundingClientRect();
        return r.left >= clip.left && r.right <= clip.right;
    }, sel(fruit, '').trim()));
await page.click(sel(fruit, '.note-rich-tf-panel input[data-tf="sortDesc"]'));
await page.waitForTimeout(200);
ok('Sort Z–A takes over from A–Z rather than both being on',
    await page.evaluate((i) => toolCustomizations[i].textSort, fruit) === 'desc' &&
    !(await page.evaluate((s) => document.querySelector(s).checked, sel(fruit, 'input[data-tf="sortAsc"]'))) &&
    await shown() === 'PEAR,FIG,APPLE', await shown());
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
ok('Escape closes the menu', !(await panelOpen()));
ok('and goes no further: the note is still in Both', await page.evaluate((i) => getToolMode(i), fruit) === 'split');
await page.click(sel(fruit, '.note-rich-tf-btn'));
await page.waitForTimeout(150);
await page.click(sel(fruit, '.note-rich-stats'));
await page.waitForTimeout(150);
ok('so does a click anywhere else', !(await panelOpen()));
ok('a transformed note stays in rich text', await isRich(fruit));
await page.evaluate(() => renderToolboard());
await page.waitForTimeout(900);
ok('and comes back with its menu showing what is on',
    await isRich(fruit) && await tfLabel() === 'Transform · 2' &&
    await page.evaluate((s) => document.querySelector(s + ' input[data-tf="sortDesc"]').checked &&
        document.querySelector(s + ' select[data-tf-casing]').value === 'upper', sel(fruit, '.note-rich-tf-panel')));
await page.evaluate((i) => openContentEditor(i), fruit);
await page.waitForTimeout(400);
ok('Edit Content sees the same transforms',
    await page.evaluate(() => document.getElementById('editorTransformBtn').textContent === 'Transform · 2' &&
        document.querySelector('#editorTransformPanel input[data-tf="sortDesc"]').checked &&
        document.getElementById('editorCasingSelect').value === 'upper'));
const bigStats = await page.evaluate(() => [...document.querySelectorAll('#editorStats span[id]')].map(s => s.textContent).join('|'));
await page.evaluate(() => {
    document.getElementById('editorTransformPanel').querySelector('input[data-tf="number"]').click();
    document.querySelector('.content-editor-save').click();
});
await page.waitForTimeout(400);
ok('and one turned on there shows up here',
    await tfLabel() === 'Transform · 3' &&
    await page.evaluate((s) => document.querySelector(s).checked, sel(fruit, 'input[data-tf="number"]')), await tfLabel());

// What was reported not working: a note written in rich text — Enter between the
// lines — and the menu used in Edit, where only the writing is on screen.
const lines = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(800);
await front(lines);
await page.click(sel(lines, '.note-rich'));
for (const [i, word] of ['pear', 'apple', 'fig', 'apple'].entries()) {
    if (i) await page.keyboard.press('Enter');
    await page.keyboard.type(word);
}
await page.waitForTimeout(200);
const linesMd = await md(lines);
ok('(each line typed with Enter is a paragraph of its own)', linesMd === 'pear\n\napple\n\nfig\n\napple', JSON.stringify(linesMd));
const linesShown = () => page.evaluate((s) => [...document.querySelectorAll(s)].map(el => el.nodeName + ':' + el.textContent.trim()).join(','),
    sel(lines, '.authoring-result .markdown-content > *'));
ok('(and the note is in Edit)', await page.evaluate((i) => getToolMode(i), lines) === 'edit');
await reach(lines, '.note-rich-tf-btn');
await page.waitForTimeout(150);
await page.click(sel(lines, '.note-rich-tf-panel input[data-tf="sortAsc"]'));
await page.waitForTimeout(300);
ok('ticking a transform in Edit opens the note beside the text, so it can be seen to work',
    await page.evaluate((i) => getToolMode(i), lines) === 'split');
ok('sorted, the paragraphs stay paragraphs rather than running into one',
    await linesShown() === 'P:apple,P:apple,P:fig,P:pear', await linesShown());
await page.click(sel(lines, '.note-rich-tf-panel input[data-tf="unique"]'));
await page.waitForTimeout(200);
ok('dropping duplicates drops the repeated line, not the blank lines between them',
    await linesShown() === 'P:apple,P:fig,P:pear', await linesShown());
await page.click(sel(lines, '.note-rich-tf-panel input[data-tf="number"]'));
await page.waitForTimeout(200);
ok('and numbered, there is one number to a line and no empty ones',
    await page.evaluate((s) => [...document.querySelectorAll(s)].map(li => li.textContent.trim()).join(','),
        sel(lines, '.authoring-result li')) === 'apple,fig,pear');
ok('the writing is untouched by all of it', await md(lines) === linesMd, JSON.stringify(await md(lines)));
ok('a list is still a line at a time, and asked to drop blank lines the paragraphs run together, as asked',
    await page.evaluate(() => applyTextTransforms('- b\n- a', { sort: 'asc' }) === '- a\n- b' &&
        applyTextTransforms('b\n\na', { sort: 'asc', stripEmpty: true }) === 'a\nb'));
await page.keyboard.press('Escape');

// How long it is.
const stats = (id) => page.evaluate((s) => [...document.querySelectorAll(s)].map(x => x.textContent).join('|'),
    sel(id, '.note-rich-stats span'));
ok('the note says how long it is, counted the way Edit Content counts it',
    await stats(fruit) === bigStats, await stats(fruit) + ' vs ' + bigStats);
ok('in words, characters and reading time — of the Markdown, so a list’s dashes count, as they do there',
    await stats(fruit) === '6 words|21 chars|1 min read', await stats(fruit));
await front(extras);
await page.evaluate((i) => setToolMode(i, 'edit'), extras);
await page.waitForTimeout(250);
await page.click(sel(extras, '.note-rich'));
await page.keyboard.press(MOD + '+End');
await page.keyboard.type(' and a fig');
await page.waitForTimeout(200);
const want = await page.evaluate((i) => { const s = textStats(toolCustomizations[i].customContent); return s.words + ' words|' + s.chars + ' chars|1 min read'; }, extras);
ok('and keeps count as it is typed', await stats(extras) === want && /^5 words/.test(want), await stats(extras) + ' vs ' + want);

// 12. Edit Content is not offered for a note: everything it was for is in the note.
const kept = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(800);
ok('a new note does not throw the big editor up over the board',
    !(await page.evaluate(() => document.getElementById('contentEditorOverlay').classList.contains('open'))));
ok('and its bar has no Editor button',
    !(await page.evaluate((s) => [...document.querySelectorAll(s)].some(b => /^Editor$/.test(b.textContent.trim())),
        sel(kept, '.note-actions button'))));
const editShown = (id) => page.evaluate((i) => {
    openToolSettingsFor([i], i);
    const shown = getComputedStyle(document.getElementById('toolSettingsEditBtn')).display !== 'none';
    document.querySelector('#toolSettingsOverlay .tool-settings-close').click();
    return shown;
}, id);
ok('nor do its settings offer Edit Content', !(await editShown(kept)));
const other = await page.evaluate(() => createNoteWithTemplate('script', {}));
await page.waitForTimeout(600);
ok('while a tool that is not a note still has it', other && await editShown(other), String(other));
await page.waitForTimeout(300);

// Find and replace, in rich text.
const findNote = await page.evaluate(() => {
    const id = createNoteWithText('The cat sat.\n\nA **bo**ld cat.\n\nCat nap', 'Find');
    toolCustomizations[id].noteEditor = 'rich';
    saveToolCustomizations(toolCustomizations);
    noteApplyEditor(id);
    setToolMode(id, 'edit');
    return id;
});
await page.waitForTimeout(700);
await front(findNote);
await page.click(sel(findNote, '.note-rich'));
await page.keyboard.press(MOD + '+f');
await page.waitForTimeout(150);
const info = () => page.textContent(sel(findNote, '.note-find-info'));
ok('⌘F opens find, with the caret in it', await page.evaluate((s) =>
    !document.querySelector(s + ' .note-find').hidden && document.activeElement === document.querySelector(s + ' .note-find-input'),
    sel(findNote, '').trim()));
await page.keyboard.type('cat');
await page.waitForTimeout(150);
ok('it counts the matches, in any case', await info() === '1 of 3', await info());
ok('and paints them', await page.evaluate(() => CSS.highlights.get('note-find').size === 3 && CSS.highlights.get('note-find-current').size === 1));
await page.keyboard.press('Enter');
ok('Enter goes to the next', await info() === '2 of 3', await info());
await page.keyboard.press('Shift+Enter');
await page.keyboard.press('Shift+Enter');
ok('Shift+Enter back, round from the first to the last', await info() === '3 of 3', await info());
await page.click(sel(findNote, '.note-find-case input'));
await page.waitForTimeout(150);
ok('Aa matches the case', await info() === '1 of 2', await info());
await page.click(sel(findNote, '.note-find-case input'));
await page.fill(sel(findNote, '.note-find-input'), 'bold');
await page.waitForTimeout(150);
ok('words are found as they read, across formatting: **bo**ld is "bold"', await info() === '1 of 1', await info());
await page.fill(sel(findNote, '.note-find-input'), 'sat.A');
await page.waitForTimeout(150);
ok('but never across the end of one paragraph and the start of the next', await info() === 'No results', await info());
// Typed with Enter, paragraphs have nothing between them at all — no line break to
// stop a match running from one into the next, unless the search puts one there.
const typedRuns = await page.evaluate((s) => {
    const widget = document.querySelector(s);
    widget.querySelector('.note-find').hidden = false;
    widget.querySelector('.note-find-input').value = 'figapple';
    const n = noteFindMatches(widget).length;
    widget.querySelector('.note-find-input').value = 'fig';
    const one = noteFindMatches(widget).length;
    widget.querySelector('.note-find').hidden = true;
    return n + '/' + one + '/' + widget.querySelector('.note-rich').innerHTML.includes('</p><p>');
}, sel(lines, '.note-widget'));
ok('nor across paragraphs typed with Enter, which have nothing between them', typedRuns === '0/1/true', typedRuns);
await page.click(sel(findNote, '.note-find-toggle'));
await page.fill(sel(findNote, '.note-find-input'), 'cat');
await page.fill(sel(findNote, '.note-replace-input'), 'dog');
await page.waitForTimeout(150);
await page.keyboard.press('Enter');
await page.waitForTimeout(200);
ok('Replace replaces the current match, and moves to the next',
    await md(findNote) === 'The dog sat.\n\nA **bo**ld cat.\n\nCat nap' && await info() === '1 of 2',
    JSON.stringify(await md(findNote)) + ' ' + await info());
await page.fill(sel(findNote, '.note-find-input'), 'bold');
await page.fill(sel(findNote, '.note-replace-input'), 'brave');
await page.waitForTimeout(150);
await page.click(sel(findNote, '.note-replace-row .note-btn:has-text("Replace")'));
await page.waitForTimeout(200);
ok('a replacement takes the formatting of what it replaces',
    await md(findNote) === 'The dog sat.\n\nA **brave** cat.\n\nCat nap', JSON.stringify(await md(findNote)));
await page.fill(sel(findNote, '.note-find-input'), 'cat');
await page.fill(sel(findNote, '.note-replace-input'), 'cat*');
await page.waitForTimeout(150);
await page.click(sel(findNote, '.note-replace-row .note-btn:has-text("All")'));
await page.waitForTimeout(300);
ok('All replaces every one — and a replacement ending in * is not taken for Slack’s bold',
    !/cat(?!\\\*)/i.test((await md(findNote)).replace(/cat\\\*/gi, '')) && ((await md(findNote)).match(/cat\\\*/gi) || []).length === 2,
    JSON.stringify(await md(findNote)));
// One * typed after a word is how Slack's bold closes; one put in by Replace is not typing.
await page.fill(sel(findNote, '.note-find-input'), 'p');
await page.fill(sel(findNote, '.note-replace-input'), '*');
await page.evaluate((s) => {
    const p = document.querySelector(s + ' .note-rich p:last-child');
    p.textContent = 'Cat *nap';
    noteRichSave(document.querySelector(s + ' .note-rich'));
}, sel(findNote, '').trim());
await page.click(sel(findNote, '.note-find-input'));
await page.keyboard.type(' ');
await page.keyboard.press('Backspace');
await page.waitForTimeout(150);
await page.click(sel(findNote, '.note-replace-row .note-btn:has-text("Replace")'));
await page.waitForTimeout(200);
ok('and a lone * as the replacement stays a *, not the close of a bold',
    /Cat \\\*na\\\*$/.test(await md(findNote)) && !(await page.evaluate((s) => !!document.querySelector(s + ' .note-rich b'), sel(findNote, '').trim())),
    JSON.stringify(await md(findNote)));
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
ok('Escape closes find and clears the paint',
    await page.evaluate((s) => document.querySelector(s).hidden, sel(findNote, '.note-find')) &&
    !(await page.evaluate(() => CSS.highlights.has('note-find'))));
ok('without leaving the editor', await page.evaluate((i) => getToolMode(i), findNote) === 'edit');

// The same bar in Markdown, where the formatting has no place but the rest does.
const mdNote = await page.evaluate(() => {
    const id = createNoteWithText('one fish\ntwo fish\nred fish', 'Fish');
    delete toolCustomizations[id].noteEditor;
    saveToolCustomizations(toolCustomizations);
    noteApplyEditor(id);
    setToolMode(id, 'edit');
    return id;
});
await page.waitForTimeout(700);
await front(mdNote);
ok('a Markdown note shows emoji, find and Transform, but not the formatting',
    await page.evaluate((s) => {
        const vis = (q) => { const el = document.querySelector(s + ' ' + q); return !!el && el.getClientRects().length > 0; };
        return vis('.note-rich-emoji') && vis('.note-find-btn') && vis('.note-rich-tf-btn') && !vis('[data-fmt="bold"]') &&
            vis('.note-rich-stats');
    }, sel(mdNote, '').trim()));
ok('and its length', await page.evaluate((s) => document.querySelector(s).textContent, sel(mdNote, '.note-rich-stats')) ===
    '6 words15 chars1 min read'.replace('15', String('one fish\ntwo fish\nred fish'.length)));
await page.click(sel(mdNote, '.note-source'));
await page.keyboard.press(MOD + '+f');
await page.keyboard.type('fish');
await page.waitForTimeout(150);
ok('⌘F finds in the Markdown', await page.textContent(sel(mdNote, '.note-find-info')) === '1 of 3');
ok('selecting the match, with the find bar keeping the focus',
    await page.evaluate((s) => {
        const src = document.querySelector(s + ' .note-source');
        return src.value.slice(src.selectionStart, src.selectionEnd) === 'fish' &&
            document.activeElement === document.querySelector(s + ' .note-find-input');
    }, sel(mdNote, '').trim()));
await page.click(sel(mdNote, '.note-source'));
await page.keyboard.press(MOD + '+ArrowDown');
await page.keyboard.type(' more');
await page.waitForTimeout(200);
ok('typing in the note while find is open types, rather than replacing the match',
    await md(mdNote) === 'one fish\ntwo fish\nred fish more', JSON.stringify(await md(mdNote)));
ok('and the count keeps up', await page.textContent(sel(mdNote, '.note-find-info')) === '1 of 3');
ok('as does the length', (await page.evaluate((s) => document.querySelector(s).textContent, sel(mdNote, '.note-rich-stats'))).startsWith('7 words'),
    await page.evaluate((s) => document.querySelector(s).textContent, sel(mdNote, '.note-rich-stats')));
await page.keyboard.press(MOD + '+f');
await page.click(sel(mdNote, '.note-find-toggle'));
await page.fill(sel(mdNote, '.note-replace-input'), 'cat');
await page.click(sel(mdNote, '.note-replace-row .note-btn:has-text("All")'));
await page.waitForTimeout(250);
ok('All replaces in the Markdown', await md(mdNote) === 'one cat\ntwo cat\nred cat more', JSON.stringify(await md(mdNote)));
await page.click(sel(mdNote, '.note-source'));
await page.keyboard.press(MOD + '+z');
await page.waitForTimeout(200);
ok('and undo takes a replacement back', /fish/.test(await md(mdNote)), JSON.stringify(await md(mdNote)));
await page.evaluate((s) => { const src = document.querySelector(s); src.focus(); src.setSelectionRange(3, 3); }, sel(mdNote, '.note-source'));
const beforeEmoji = await md(mdNote);
await reach(mdNote, '.note-rich-emoji');
await page.waitForSelector('#toolPickerPopup .emote-cell', { timeout: 15000 }).catch(() => {});
const picked2 = await page.evaluate(() => (document.querySelector('#toolPickerPopup .emote-cell') || {}).textContent || '');
if (picked2) await page.click('#toolPickerPopup .emote-cell');
await page.waitForTimeout(250);
ok('the emoji lands where the caret was in the Markdown too',
    !!picked2 && await md(mdNote) === beforeEmoji.slice(0, 3) + picked2.trim() + beforeEmoji.slice(3), JSON.stringify(await md(mdNote)));
await reach(mdNote, '.note-rich-tf-btn');
await page.click(sel(mdNote, '.note-rich-tf-panel input[data-tf="sortAsc"]'));
await page.waitForTimeout(200);
ok('and Transform works there', await page.evaluate((i) => toolCustomizations[i].textSort, mdNote) === 'asc');
await page.keyboard.press('Escape');

// Plain text, which had no other switch.
await front(fresh);
await page.evaluate((i) => setToolMode(i, 'edit'), fresh);
await page.waitForTimeout(250);
await reach(fresh, '.note-rich-tf-btn');
await page.click(sel(fresh, '.note-rich-tf-panel input[data-tf-plain]'));
await page.waitForTimeout(300);
ok('Show as plain text is kept with the note', await page.evaluate((i) => toolCustomizations[i].plainText, fresh) === true);
ok('it is shown as typed', await page.evaluate((s) => !!document.querySelector(s + ' .authoring-result pre') &&
    /\*\*bold\*\*/.test(document.querySelector(s + ' .authoring-result').textContent), sel(fresh, '').trim()));
ok('and written in Markdown, saying why', !(await isRich(fresh)) &&
    /plain text/.test(await page.evaluate((s) => document.querySelector(s).textContent, sel(fresh, '.note-rich-why'))));
ok('with the menu still there to turn it off', await page.evaluate((s) => {
    const box = document.querySelector(s);
    return box.getClientRects().length > 0 && box.checked;
}, sel(fresh, '.note-rich-tf-panel input[data-tf-plain]')));
await page.click(sel(fresh, '.note-rich-tf-panel input[data-tf-plain]'));
await page.waitForTimeout(300);
ok('and off, the note is back in rich text', await isRich(fresh) &&
    await page.evaluate((i) => toolCustomizations[i].plainText, fresh) === false,
    JSON.stringify(await page.evaluate((i) => ({ plain: toolCustomizations[i].plainText, why: noteRichBlocker(toolCustomizations[i]),
        editor: toolCustomizations[i].noteEditor, md: toolCustomizations[i].customContent }), fresh)));
await page.keyboard.press('Escape');

// Reset, for a note whose template came with something to go back to.
ok('a blank note has no Reset: there is nothing to go back to',
    await page.evaluate((s) => document.querySelector(s).hidden, sel(fresh, '.note-rich-tf-reset')));
const tmpl = await page.evaluate(() => {
    NOTE_TEMPLATES.withDefault = { id: 'withDefault', name: 'Agenda', title: 'Agenda', icon: '🗒',
        description: 'A note that starts with something', content: '# Agenda\n\n- first\n' };
    const id = createNoteWithTemplate('withDefault', {});
    toolCustomizations[id].noteEditor = 'rich';
    toolCustomizations[id].customContent = 'Changed it all';
    toolCustomizations[id].textCasing = 'upper';
    saveToolCustomizations(toolCustomizations);
    renderToolboard();
    return id;
});
await page.waitForTimeout(900);
await page.evaluate((i) => setToolMode(i, 'edit'), tmpl);
await page.waitForTimeout(250);
await reach(tmpl, '.note-rich-tf-btn');
ok('one from a template that has content offers Reset to default',
    await page.evaluate((s) => !document.querySelector(s).hidden, sel(tmpl, '.note-rich-tf-reset')));
let asked = '';
page.once('dialog', (d) => { asked = d.message(); d.dismiss(); });
await page.click(sel(tmpl, '.note-rich-tf-reset'));
await page.waitForTimeout(200);
ok('asks first, and No keeps everything', /Reset to default/.test(asked) && await md(tmpl) === 'Changed it all', asked);
page.once('dialog', (d) => d.accept());
await page.click(sel(tmpl, '.note-rich-tf-reset'));
await page.waitForTimeout(300);
ok('Yes puts the template’s content back, and its transforms off',
    await md(tmpl) === '# Agenda\n\n- first\n' &&
    !(await page.evaluate((i) => toolCustomizations[i].textCasing, tmpl)), JSON.stringify(await md(tmpl)));
ok('and the editor shows it', /Agenda/.test(await page.evaluate((s) => document.querySelector(s).textContent, sel(tmpl, '.note-rich'))));

// 13. Markdown's links, typed or pasted into rich text, become links — before any
// mark closes round them. They were kept as words: the brackets escaped and shown,
// and a bold closed round them bolded the brackets.
const linkCase = async (typed) => {
    const id = await page.evaluate(() => createNoteWithTemplate('blank', {}));
    await page.waitForTimeout(700);
    await page.keyboard.type(typed);
    await page.waitForTimeout(200);
    return page.evaluate((i) => {
        const surface = document.querySelector('.tool[data-tool="' + i + '"] .note-rich');
        const a = surface.querySelector('a');
        return { md: toolCustomizations[i].customContent, href: a ? a.getAttribute('href') : '',
            styled: !!surface.querySelector('[style]'), id: i };
    }, id);
};
const LINK = '[ann@example.org](mailto:ann@example.org)';
const typedLink = await linkCase('Mail ' + LINK + ' today');
ok('a typed [text](address) becomes a link when its ) is typed',
    typedLink.md === 'Mail ' + LINK + ' today' && typedLink.href === 'mailto:ann@example.org', JSON.stringify(typedLink));
ok('with typing carrying on outside it, and none of Chrome’s pinned fonts left in the editor', !typedLink.styled);
const boldLink = await linkCase('*' + LINK + '*');
ok('a bold closed round one is a bold link, not bold brackets', boldLink.md === '**' + LINK + '**', JSON.stringify(boldLink));
const italicLink = await linkCase('_' + LINK + '_');
ok('and so is an italic one', italicLink.md === '*' + LINK + '*', JSON.stringify(italicLink));
const strikeLink = await linkCase('~' + LINK + '~');
ok('and a struck one', strikeLink.md === '~~' + LINK + '~~', JSON.stringify(strikeLink));
const codeLink = await linkCase('`' + LINK + '`');
ok('but code stays literal, address and all', codeLink.md === '`' + LINK + '`' && !codeLink.href, JSON.stringify(codeLink));
const unsafe = await linkCase('[click](javascript:void)');
ok('an address that is not a web or mail one stays words', !unsafe.href && /^\\\[click\\\]/.test(unsafe.md), JSON.stringify(unsafe));
const bare = await linkCase('[site](example.org)');
ok('and a bare domain is made a web one, as the link form makes it', bare.md === '[site](https://example.org)', JSON.stringify(bare));
// Mark and link in one: Markdown link syntax left as words earlier, a mark closed round it now.
ok('words that were already [text](address) become a link when a mark closes round them',
    await page.evaluate(() => {
        const holder = document.createElement('div');
        holder.innerHTML = 'see [a](mailto:a@example.org) and <code>[b](mailto:b@example.org)</code>';
        noteLinkifyTextIn(holder);
        return holder.innerHTML;
    }) === 'see <a href="mailto:a@example.org">a</a> and <code>[b](mailto:b@example.org)</code>');
const pasteId = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(700);
// A paste of its own rather than the system clipboard, which anything else copied
// while the suite runs would change under it.
await page.evaluate(([i, t]) => {
    const surface = document.querySelector('.tool[data-tool="' + i + '"] .note-rich');
    const dt = new DataTransfer();
    dt.setData('text/plain', t);
    surface.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
}, [pasteId, 'Mail ' + LINK + '\nand [no](javascript:void)']);
await page.waitForTimeout(300);
ok('pasted as plain text, a Markdown link arrives as a link, line by line, and an unsafe one as words',
    await md(pasteId) === 'Mail ' + LINK + '\n\nand \\[no\\](javascript:void)', JSON.stringify(await md(pasteId)));

const htmlPasteId = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(700);
await page.evaluate(([i, L]) => {
    const surface = document.querySelector('.tool[data-tool="' + i + '"] .note-rich');
    const dt = new DataTransfer();
    dt.setData('text/html', '<meta charset="utf-8"><span style="color:#333">Mail ' + L + '</span>');
    dt.setData('text/plain', 'Mail ' + L);
    surface.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
}, [htmlPasteId, LINK]);
await page.waitForTimeout(300);
ok('and pasted from a page, an editor or a chat — which copy HTML — the same, not addresses made links inside escaped brackets',
    await md(htmlPasteId) === 'Mail ' + LINK, JSON.stringify(await md(htmlPasteId)));

// 14. A message copied out of Slack. Made up, in the shape Slack copies it: emoji as
// pictures, an address shown as code as a link inside code, paragraphs as two <br>.
const SLACK = '<meta charset="utf-8">Hello — <code style="font-family: Monaco">notes.txt</code>, the plan ' +
    '<span style="color: inherit"><img aria-label="apple emoji" alt=":apple:" data-stringify-emoji=":apple:" ' +
    'src="https://emoji.example.org/apple-medium/1f34e@2x.png" style="height: 1.2em"></span><br><br>' +
    '<b style="font-weight: 700">Who</b><br aria-hidden="true">• <code>Ann Example</code> — Lead — ' +
    '<code style="background-color: #f8f8f8"><span><span draggable="true"><a target="_blank" href="mailto:ann@example.org" ' +
    'style="color: #1264a3">ann@example.org</a></span></span></code> ' +
    '<img alt=":pushpin:" data-stringify-emoji=":pushpin:" src="https://emoji.example.org/x/1f4cc@2x.png"> <b>ask her</b>' +
    '<br aria-hidden="true">• named <img alt=":red_apple:" class="emoji" src="https://emoji.example.org/custom/fruit.png">' +
    ' custom <img alt=":partyparrot:" data-stringify-emoji=":partyparrot:" src="https://emoji.example.org/custom/partyparrot.gif">' +
    ' bad <code><a href="javascript:void(0)">click</a></code>';
const slackId = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(700);
await page.evaluate(([i, h]) => {
    const surface = document.querySelector('.tool[data-tool="' + i + '"] .note-rich');
    const dt = new DataTransfer();
    dt.setData('text/html', h);
    dt.setData('text/plain', 'plain');
    surface.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
}, [slackId, SLACK]);
await page.waitForTimeout(400);
const slackMd = await md(slackId);
ok('Slack’s emoji arrive as emoji, not as full-size pictures', !/!\[/.test(slackMd) && /plan 🍎/.test(slackMd) && /📌/.test(slackMd),
    JSON.stringify(slackMd));
ok('read from the picture’s file name, or by name from the board’s emoji list when that is all there is',
    /named 🍎/.test(slackMd), JSON.stringify(slackMd));
ok('and one it cannot read stays its :name:, as words', /custom :partyparrot:/.test(slackMd), JSON.stringify(slackMd));
ok('an address Slack shows as code arrives as a code-styled link — not code showing the link’s syntax',
    slackMd.includes('[`ann@example.org`](mailto:ann@example.org)') && !/`\[/.test(slackMd), JSON.stringify(slackMd));
ok('which is a link that can be clicked, round code',
    await page.evaluate((s) => !!document.querySelector(s + ' .authoring-result a[href="mailto:ann@example.org"] > code'),
        sel(slackId, '').trim()));
ok('while code round an address that is not a web or mail one is just the code', /bad `click`/.test(slackMd) &&
    !/javascript/.test(slackMd), JSON.stringify(slackMd));
ok('Slack’s gap between paragraphs is kept — two line breaks are a paragraph, not one line break',
    /🍎\n\n\*\*Who\*\*\n/.test(slackMd), JSON.stringify(slackMd));
ok('its • lines arrive as a list, as typing • makes one — not as text with bullets in it',
    /\*\*Who\*\*\n\n- `Ann Example` — Lead/.test(slackMd) && /\n- named 🍎/.test(slackMd) && !/•/.test(slackMd),
    JSON.stringify(slackMd));
await page.keyboard.press('Enter');
await page.keyboard.type('added after');
await page.waitForTimeout(200);
ok('so a line added after them is one more of the same bullets',
    await page.evaluate((s) => {
        const lists = document.querySelectorAll(s + ' .note-rich ul');
        const last = lists[lists.length - 1];
        return lists.length === 1 && [...last.children].pop().textContent.trim() === 'added after';
    }, sel(slackId, '').trim()));
ok('a line after a run of bullets is not pulled into the last one, and code blocks are left alone',
    await page.evaluate(() => noteBulletsToList('Who\n• a\n• b\nafter\n```\n• kept\n```') ===
        'Who\n\n- a\n- b\n\nafter\n```\n• kept\n```'));
const plainBullets = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(700);
await page.evaluate(([i, t]) => {
    const surface = document.querySelector('.tool[data-tool="' + i + '"] .note-rich');
    const dt = new DataTransfer();
    dt.setData('text/plain', t);
    surface.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
}, [plainBullets, 'Team\n• Ann — [ann@example.org](mailto:ann@example.org)\n• Bob *not bold*\nend']);
await page.waitForTimeout(300);
ok('pasted as plain text too, with links made and nothing else taken for Markdown',
    await md(plainBullets) === 'Team\n\n- Ann — [ann@example.org](mailto:ann@example.org)\n- Bob \\*not bold\\*\n\nend',
    JSON.stringify(await md(plainBullets)));
ok('and a note with a code-styled link can be written in rich text, round and round',
    await page.evaluate(() => noteRoundTrips('Mail [`ann@example.org`](mailto:ann@example.org) now') &&
        noteEmojiByName('red_apple') === '🍎'));

// 15. Contrast, in both themes: what find paints, and a link shown as code.
const contrast = () => page.evaluate(() => {
    const rgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 4).map(Number);
    const lum = ([r, g, b]) => [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
        .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (a, b) => { const x = lum(rgb(a)), y = lum(rgb(b)); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const rule = (name) => {
        for (const sheet of document.styleSheets) {
            let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
            for (const r of rules) if (r.selectorText === '::highlight(' + name + ')') return r.style;
        }
        return null;
    };
    const probe = document.createElement('div');
    probe.className = 'markdown-content';
    probe.innerHTML = '<a href="#"><code>x</code></a><code>y</code>';
    document.body.appendChild(probe);
    const link = getComputedStyle(probe.querySelector('a')).color;
    // Read now: a computed style is live, and empty once its element is gone.
    const live = getComputedStyle(probe.querySelectorAll('code')[1]);
    const code = { color: live.color, borderTopWidth: live.borderTopWidth, borderTopColor: live.borderTopColor };
    const codeBg = live.backgroundColor;
    const page = getComputedStyle(document.body).backgroundColor;
    const note = getComputedStyle(document.querySelector('.tool')).backgroundColor;
    const text = getComputedStyle(document.body).color;
    probe.remove();
    const out = { link: Math.min(ratio(link, codeBg), ratio(link, page)),
        codeText: ratio(code.color, codeBg),
        codeEdge: parseFloat(code.borderTopWidth) > 0 ? ratio(code.borderTopColor, note) : 0,
        codeOwnColour: code.color !== text ? 1 : 0 };
    for (const name of ['note-find', 'note-find-current']) {
        const st = rule(name);
        const bg = st && st.backgroundColor, fg = st && st.color;
        out[name] = bg && fg && (rgb(bg)[3] === undefined || rgb(bg)[3] === 1) ? ratio(fg, bg) : 0;
    }
    return out;
});
const lightC = await contrast();
await page.evaluate(() => document.body.classList.add('dark-mode'));
await page.waitForTimeout(200);
const darkC = await contrast();
await page.evaluate(() => document.body.classList.remove('dark-mode'));
const fmt = (c) => JSON.stringify(Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Math.round(v * 10) / 10])));
ok('find’s matches are solid with their own dark text, readable at 4.5:1 or better — so in either theme',
    lightC['note-find'] >= 4.5 && lightC['note-find-current'] >= 4.5, fmt(lightC));
ok('a link — on the page, or shown as code — is 4.5:1 or better in light', lightC.link >= 4.5, fmt(lightC));
ok('and in dark', darkC.link >= 4.5, fmt(darkC));
ok('inline code stands out from the note the way Slack’s does — its own colour of text, readable, with an edge — in light',
    lightC.codeOwnColour && lightC.codeText >= 4.5 && lightC.codeEdge >= 1.5, fmt(lightC));
ok('and in dark', darkC.codeOwnColour && darkC.codeText >= 4.5 && darkC.codeEdge >= 1.5, fmt(darkC));
ok('the rendered note is spaced like the editors — not the browser’s cramped default', await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.className = 'markdown-content';
    probe.innerHTML = '<p>a</p>';
    document.body.appendChild(probe);
    const p = probe.querySelector('p');
    const ratio = parseFloat(getComputedStyle(p).lineHeight) / parseFloat(getComputedStyle(p).fontSize);
    const rich = document.querySelector('.note-rich');
    const richRatio = parseFloat(getComputedStyle(rich).lineHeight) / parseFloat(getComputedStyle(rich).fontSize);
    probe.remove();
    return ratio >= 1.45 && Math.abs(ratio - richRatio) < 0.01;
}));
ok('a heading in dark mode is no dimmer than the text it heads', await page.evaluate(() => {
    document.body.classList.add('dark-mode');
    const probe = document.createElement('div');
    probe.className = 'markdown-content';
    probe.innerHTML = '<h2>Head</h2>';
    document.body.appendChild(probe);
    const filter = getComputedStyle(probe.querySelector('h2')).filter;
    probe.remove();
    document.body.classList.remove('dark-mode');
    return filter === 'none';
}));

// 16. Headings and underline.
const head = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(700);
await front(head);
await page.click(sel(head, '.note-rich'));
await page.keyboard.type('Title');
const pressed = (fmt) => page.evaluate((s) => document.querySelector(s).classList.contains('active'),
    sel(head, '.note-rich-btn[data-fmt="' + fmt + '"]'));
await page.click(sel(head, '.note-rich-btn[data-fmt="h1"]'));
await page.waitForTimeout(150);
ok('H1 makes the line a heading, kept as # in the Markdown', await md(head) === '# Title', JSON.stringify(await md(head)));
ok('and is pressed while the caret is in it', await pressed('h1') && !(await pressed('h2')));
await page.click(sel(head, '.note-rich-btn[data-fmt="h1"]'));
await page.waitForTimeout(150);
ok('pressed again, the line is back to normal text', await md(head) === 'Title', JSON.stringify(await md(head)));
await page.keyboard.press(MOD + '+Alt+Digit2');
await page.waitForTimeout(150);
ok('⌘⌥2 is Heading 2', await md(head) === '## Title' && await pressed('h2'), JSON.stringify(await md(head)));
await page.keyboard.press(MOD + '+Alt+Digit3');
await page.waitForTimeout(150);
ok('⌘⌥3 is Heading 3', await md(head) === '### Title', JSON.stringify(await md(head)));
await page.keyboard.press(MOD + '+Alt+Digit0');
await page.waitForTimeout(150);
ok('and ⌘⌥0 normal text', await md(head) === 'Title', JSON.stringify(await md(head)));
await page.keyboard.press(MOD + '+Alt+Digit1');
await page.keyboard.press('End');
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(100);
await page.evaluate((s) => {
    const surface = document.querySelector(s);
    const range = document.createRange();
    range.selectNodeContents(surface);
    range.collapse(false);
    getSelection().removeAllRanges();
    getSelection().addRange(range);
}, sel(head, '.note-rich'));
await page.keyboard.press('Enter');
await page.keyboard.type('## Sub');
await page.keyboard.press('Enter');
await page.keyboard.type('### Small');
await page.keyboard.press('Enter');
await page.keyboard.type('body text');
await page.waitForTimeout(200);
ok('## and ### typed at the start of a line make headings, as - makes a list',
    await md(head) === '# Title\n\n## Sub\n\n### Small\n\nbody text', JSON.stringify(await md(head)));
await reach(head, '.note-mode-md');
await page.waitForTimeout(200);
await reach(head, '.note-mode-rich');
await page.waitForTimeout(200);
ok('they survive going to Markdown and back',
    await md(head) === '# Title\n\n## Sub\n\n### Small\n\nbody text' &&
    await page.evaluate((s) => ['h1', 'h2', 'h3'].every(t => document.querySelector(s + ' ' + t)), sel(head, '.note-rich')));
ok('and a note with smaller headings than the bar offers can still be written in rich text',
    await page.evaluate(() => noteRoundTrips('#### Four\n\n##### Five\n\ntext')));

// Underline: Markdown has none, so it is kept as <u>.
await page.evaluate((s) => {
    const p = [...document.querySelectorAll(s + ' p')].pop();
    const range = document.createRange();
    range.setStart(p.firstChild, 0);
    range.setEnd(p.firstChild, 4);
    document.querySelector(s).focus();
    getSelection().removeAllRanges();
    getSelection().addRange(range);
}, sel(head, '.note-rich'));
await page.keyboard.press(MOD + '+u');
await page.waitForTimeout(200);
ok('⌘U underlines, and the underline is saved — it was dropped before',
    /\n\n<u>body<\/u> text$/.test(await md(head)), JSON.stringify(await md(head)));
ok('the U button shows it', await pressed('underline'));
ok('and the note shows it underlined',
    await page.evaluate((s) => !!document.querySelector(s + ' .authoring-result u'), sel(head, '').trim()));
await page.click(sel(head, '.note-rich-btn[data-fmt="underline"]'));
await page.waitForTimeout(200);
ok('the button takes it off again', /\n\nbody text$/.test(await md(head)) && !/<u>/.test(await md(head)),
    JSON.stringify(await md(head)));
ok('an underlined note can be written in rich text, and a pasted underline is kept',
    await page.evaluate(() => noteRoundTrips('a <u>b</u> c') &&
        noteHtmlToMarkdown('<p>a <u>b</u> <ins>c</ins></p>') === 'a <u>b</u> <u>c</u>'));

// Horizontal lines.
const rule = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(700);
await front(rule);
await page.click(sel(rule, '.note-rich'));
await page.keyboard.type('Above');
await page.click(sel(rule, '.note-rich-btn[data-fmt="hr"]'));
await page.keyboard.type('below');
await page.waitForTimeout(200);
ok('the line button puts a horizontal line in, kept as ---, with the caret on a line after it',
    await md(rule) === 'Above\n\n---\n\nbelow', JSON.stringify(await md(rule)));
await page.keyboard.press('Enter');
await page.keyboard.type('--- after');
await page.waitForTimeout(200);
ok('--- and a space typed at the start of a line is one too', await md(rule) === 'Above\n\n---\n\nbelow\n\n---\n\nafter',
    JSON.stringify(await md(rule)));
ok('and the note shows them', await page.evaluate((s) => document.querySelectorAll(s + ' .authoring-result hr').length, sel(rule, '').trim()) === 2);
ok('a line at the very end still leaves somewhere to type, and an emptied note keeps its line',
    await page.evaluate(() => {
        const surface = document.createElement('div');
        surface.className = 'note-rich';
        surface.contentEditable = 'true';
        surface.innerHTML = '<hr>';
        document.body.appendChild(surface);
        noteRichEnsureBlock(surface);
        const kept = surface.innerHTML === '<hr>';
        surface.remove();
        return kept && noteRoundTrips('a\n\n* * *\n\nb') && noteHtmlToMarkdown('<p>a</p><hr><p>b</p>') === 'a\n\n---\n\nb';
    }));

// Code blocks come off again — including one that came back from Markdown as
// <pre><code>, which the browser's command turned into inline code, and one of two
// lines, which it ran together into one.
const fence = await page.evaluate(() => {
    const id = createNoteWithText('before\n\n```\nline one\nline two\n```\n\nafter', 'Fence');
    toolCustomizations[id].noteEditor = 'rich';
    noteApplyEditor(id);
    setToolMode(id, 'edit');
    return id;
});
await page.waitForTimeout(500);
await front(fence);
await page.click(sel(fence, '.note-rich pre'));
ok('(a code block from Markdown is <pre><code>, and its button shows it)',
    await page.evaluate((s) => !!document.querySelector(s + ' .note-rich pre > code') &&
        document.querySelector(s + ' .note-rich-btn[data-fmt="codeblock"]').classList.contains('active'), sel(fence, '').trim()));
await page.click(sel(fence, '.note-rich-btn[data-fmt="codeblock"]'));
await page.waitForTimeout(200);
ok('pressed again it is normal text — every line kept, a paragraph each, and no inline code left behind',
    await md(fence) === 'before\n\nline one\n\nline two\n\nafter' &&
    !(await page.evaluate((s) => !!document.querySelector(s + ' .note-rich code, ' + s + ' .note-rich pre'), sel(fence, '').trim())),
    JSON.stringify(await md(fence)));
ok('with what was in it selected, so pressing again puts it back',
    await page.evaluate(() => getSelection().toString().replace(/\n+/g, '|')) === 'line one|line two');
await page.keyboard.press(MOD + '+Alt+Shift+KeyC');
await page.waitForTimeout(200);
ok('and the shortcut makes it one block again, still a line each — the browser’s command ran them into one',
    await md(fence) === 'before\n\n```\nline one\nline two\n```\n\nafter', JSON.stringify(await md(fence)));

// A list made a code block keeps a line to each item, and comes back a list — the
// browser's command put the list inside the block with its items run together.
const listCode = await page.evaluate(() => {
    const id = createNoteWithText('- apples\n- pears\n- figs', 'List code');
    toolCustomizations[id].noteEditor = 'rich';
    noteApplyEditor(id);
    setToolMode(id, 'edit');
    return id;
});
await page.waitForTimeout(500);
await front(listCode);
const selectEverything = (id) => page.evaluate((s) => {
    const el = document.querySelector(s);
    el.focus();
    const r = document.createRange();
    r.selectNodeContents(el);
    getSelection().removeAllRanges();
    getSelection().addRange(r);
}, sel(id, '.note-rich'));
await selectEverything(listCode);
await page.click(sel(listCode, '.note-rich-btn[data-fmt="codeblock"]'));
await page.waitForTimeout(200);
ok('a list made a code block is a line to each item, its marker kept', await md(listCode) === '```\n- apples\n- pears\n- figs\n```',
    JSON.stringify(await md(listCode)));
await selectEverything(listCode);
await page.click(sel(listCode, '.note-rich-btn[data-fmt="codeblock"]'));
await page.waitForTimeout(200);
ok('and taken off — with everything selected, which starts outside the block — it is the list again, not one line',
    await md(listCode) === '- apples\n- pears\n- figs' &&
    await page.evaluate((s) => document.querySelectorAll(s + ' .note-rich li').length, sel(listCode, '').trim()) === 3,
    JSON.stringify(await md(listCode)));
const partFence = (html, from, to) => page.evaluate(([html, from, to]) => {
    const s = document.createElement('div');
    s.className = 'note-rich';
    s.contentEditable = 'true';
    s.innerHTML = html;
    document.body.appendChild(s);
    s.focus();
    const lis = s.querySelectorAll('li');
    const r = document.createRange();
    r.setStart(lis[from].firstChild, 1);
    r.setEnd(lis[to].firstChild, 2);
    getSelection().removeAllRanges();
    getSelection().addRange(r);
    noteRichToggleCodeBlock(s, noteRichAt(s));
    const mid = noteHtmlToMarkdown(s.innerHTML);
    noteRichToggleCodeBlock(s, noteRichAt(s));
    const back = noteHtmlToMarkdown(s.innerHTML);
    s.remove();
    return [mid, back];
}, [html, from, to]);
const LIST4 = '<li>alpha</li><li>beta</li><li>gamma</li><li>delta</li>';
const [midU, backU] = await partFence('<ul>' + LIST4 + '</ul>', 1, 2);
ok('with part of a list selected, only those items become code — the list is split round them, not all taken',
    midU === '- alpha\n\n```\n- beta\n- gamma\n```\n\n- delta', JSON.stringify(midU));
ok('and taken off, they join the list again, as one list', backU === '- alpha\n- beta\n- gamma\n- delta', JSON.stringify(backU));
const [midO, backO] = await partFence('<ol>' + LIST4 + '</ol>', 1, 1);
ok('a numbered list is numbered on after the block, and whole again after', midO === '1. alpha\n\n```\n2. beta\n```\n\n3. gamma\n4. delta' &&
    backO === '1. alpha\n2. beta\n3. gamma\n4. delta', JSON.stringify([midO, backO]));
ok('numbered, nested and mixed with paragraphs, the lines come back as what they say',
    await page.evaluate(() => {
        const surface = document.createElement('div');
        surface.innerHTML = '<pre>Intro line\n1. first\n2. second\n  - inner a\n  - inner b\n3. third\n\nplain after</pre>';
        document.body.appendChild(surface);
        noteRichUnfenceCode(surface, [surface.firstChild]);
        const md = noteHtmlToMarkdown(surface.innerHTML);
        surface.remove();
        return md;
    }) === 'Intro line\n\n1. first\n2. second\n   - inner a\n   - inner b\n3. third\n\nplain after');

// The same, done the way a person does it — selecting with the mouse or the keyboard
// and pressing the button — rather than by calling the function.
const uiList = await page.evaluate(() => {
    const id = createNoteWithText('- alpha\n- beta\n- gamma\n- delta', 'UI list');
    toolCustomizations[id].noteEditor = 'rich';
    noteApplyEditor(id);
    setToolMode(id, 'edit');
    return id;
});
await page.waitForTimeout(500);
await front(uiList);
await page.hover(sel(uiList, '.tool-header'));
await page.waitForTimeout(150);
const itemBox = (id, n) => page.locator(sel(id, '.note-rich li')).nth(n).boundingBox();
const from = await itemBox(uiList, 1);
const to = await itemBox(uiList, 2);
await page.mouse.move(from.x + 2, from.y + from.height / 2);
await page.mouse.down();
await page.mouse.move(to.x + 30, to.y + to.height / 2, { steps: 5 });
await page.mouse.up();
await page.click(sel(uiList, '.note-rich-btn[data-fmt="codeblock"]'));
await page.waitForTimeout(200);
ok('dragging over two items of a list and pressing code block makes just those two code',
    await md(uiList) === '- alpha\n\n```\n- beta\n- gamma\n```\n\n- delta', JSON.stringify(await md(uiList)));

// Tab and Shift+Tab, which moved the focus out of the note to the board's logo.
const tabs = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(700);
await front(tabs);
await page.click(sel(tabs, '.note-rich'));
await page.keyboard.type('- parent');
await page.keyboard.press('Enter');
await page.keyboard.type('child a');
await page.keyboard.press('Tab');
await page.waitForTimeout(100);
ok('Tab in a list item indents it, under the item above — and the caret stays in the note',
    await md(tabs) === '- parent\n  - child a' &&
    await page.evaluate((s) => document.activeElement === document.querySelector(s), sel(tabs, '.note-rich')),
    JSON.stringify(await md(tabs)));
for (const w of ['child b', 'child c', 'back out']) { await page.keyboard.press('Enter'); await page.keyboard.type(w); }
await page.keyboard.press('Shift+Tab');
await page.waitForTimeout(100);
ok('Enter carries on at that depth, and Shift+Tab brings an item back out',
    await md(tabs) === '- parent\n  - child a\n  - child b\n  - child c\n- back out', JSON.stringify(await md(tabs)));
await page.keyboard.press('Shift+Tab');
await page.keyboard.type('!');
ok('an item already at the top stays where it is, and the caret with it',
    await md(tabs) === '- parent\n  - child a\n  - child b\n  - child c\n- back out!', JSON.stringify(await md(tabs)));
await page.locator(sel(tabs, '.note-rich li li')).nth(1).click({ position: { x: 3, y: 5 } });
await page.keyboard.press('Home');
await page.keyboard.press('Shift+ArrowDown');
await page.click(sel(tabs, '.note-rich-btn[data-fmt="codeblock"]'));
await page.waitForTimeout(200);
ok('two indented items selected — Shift+↓, which ends at the start of the next — make code inside their parent, and only the one the words are in',
    await md(tabs) === '- parent\n\n  - child a\n\n  ```\n  - child b\n  ```\n\n  - child c\n- back out!', JSON.stringify(await md(tabs)));
await page.click(sel(tabs, '.note-rich-btn[data-fmt="codeblock"]'));
await page.waitForTimeout(200);
ok('and off again, the nested list is as it was', await md(tabs) === '- parent\n  - child a\n  - child b\n  - child c\n- back out!',
    JSON.stringify(await md(tabs)));
await page.locator(sel(tabs, '.note-rich li li')).nth(0).click({ position: { x: 3, y: 5 } });
// Into child b's words, by arrows: End on a Mac is not the end of the line.
await page.keyboard.down('Shift');
await page.keyboard.press('ArrowDown');
for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
await page.keyboard.up('Shift');
await page.keyboard.press('Shift+Tab');
await page.waitForTimeout(100);
ok('a selection of several items moves together, and what followed them goes under the last',
    await md(tabs) === '- parent\n- child a\n- child b\n  - child c\n- back out!', JSON.stringify(await md(tabs)));
const tabCode = await page.evaluate(() => {
    const id = createNoteWithText('```\nif (x) {\n}\n```', 'Tab code');
    toolCustomizations[id].noteEditor = 'rich';
    noteApplyEditor(id);
    setToolMode(id, 'edit');
    return id;
});
await page.waitForTimeout(500);
await front(tabCode);
await page.hover(sel(tabCode, '.tool-header'));
await page.click(sel(tabCode, '.note-rich pre'), { position: { x: 3, y: 5 } });
await page.keyboard.press('Tab');
await page.waitForTimeout(100);
ok('in a code block, Tab is two spaces', await md(tabCode) === '```\n  if (x) {\n}\n```', JSON.stringify(await md(tabCode)));
await page.click(sel(tabCode, '.note-rich'), { position: { x: 5, y: 200 } }).catch(() => {});
const plainTab = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(700);
await page.keyboard.type('just words');
await page.keyboard.press('Tab');
ok('and in plain text it still moves on, so the keyboard can always leave the note',
    await page.evaluate((s) => document.activeElement !== document.querySelector(s), sel(plainTab, '.note-rich')) &&
    await md(plainTab) === 'just words');

// New lines in a code block. Enter there makes a <br>, and the block's text alone has
// no newline for one — the lines ran together on saving.
const codeLines = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(700);
await front(codeLines);
await page.click(sel(codeLines, '.note-rich'));
await page.keyboard.type('line one');
await page.click(sel(codeLines, '.note-rich-btn[data-fmt="codeblock"]'));
await page.keyboard.press('ArrowRight');
await page.keyboard.press('Enter');
await page.keyboard.type('line two');
await page.keyboard.press('Shift+Enter');
await page.keyboard.type('line three');
await page.waitForTimeout(150);
ok('Enter and Shift+Enter in a code block are new lines in it, kept as lines',
    await md(codeLines) === '```\nline one\nline two\nline three\n```', JSON.stringify(await md(codeLines)));
await page.keyboard.press('Enter');
await page.keyboard.press('Enter');
await page.keyboard.type('after the code');
await page.waitForTimeout(150);
ok('Enter on an empty last line leaves the block, as it leaves a list — the empty line not kept',
    await md(codeLines) === '```\nline one\nline two\nline three\n```\n\nafter the code', JSON.stringify(await md(codeLines)));
await page.click(sel(codeLines, '.note-rich pre'));
await page.click(sel(codeLines, '.note-rich-btn[data-fmt="codeblock"]'));
await page.waitForTimeout(150);
ok('and a block of typed lines taken off is a paragraph to each, not one run-together line',
    await md(codeLines) === 'line one\n\nline two\n\nline three\n\nafter the code', JSON.stringify(await md(codeLines)));
ok('a block keeps its language, and a fence is made longer than any backticks inside it',
    await page.evaluate(() => noteHtmlToMarkdown(parseMarkdown('```js\nconst a = 1;\n```')) === '```js\nconst a = 1;\n```' &&
        noteHtmlToMarkdown('<pre>has ``` inside</pre>') === '````\nhas ``` inside\n````'));

// ↓ out of a code block or table that ends the note — there was nowhere below it.
const endsInCode = await page.evaluate(() => {
    const id = createNoteWithText('Top\n\n```\nfirst\nsecond\n```', 'Ends in code');
    toolCustomizations[id].noteEditor = 'rich';
    noteApplyEditor(id);
    setToolMode(id, 'edit');
    return id;
});
await page.waitForTimeout(500);
await front(endsInCode);
await page.hover(sel(endsInCode, '.tool-header'));
await page.evaluate((s) => {
    const code = document.querySelector(s + ' pre code') || document.querySelector(s + ' pre');
    const r = document.createRange();
    r.setStart(code.firstChild, 2);
    r.collapse(true);
    document.querySelector(s).focus();
    getSelection().removeAllRanges();
    getSelection().addRange(r);
}, sel(endsInCode, '.note-rich'));
await page.keyboard.press('ArrowDown');
ok('↓ on a line of a code block with more below it moves within the block, as ever',
    await page.evaluate((s) => !document.querySelector(s + ' pre + p'), sel(endsInCode, '.note-rich')));
await page.keyboard.press('ArrowDown');
await page.keyboard.type('more words');
await page.waitForTimeout(150);
ok('↓ on its last line, when the block ends the note, makes a line under it to go on in',
    await md(endsInCode) === 'Top\n\n```\nfirst\nsecond\n```\n\nmore words', JSON.stringify(await md(endsInCode)));
const endsInTable = await page.evaluate(() => {
    const id = createNoteWithText('| a | b |\n| --- | --- |\n| 1 | 2 |\n| 3 | 4 |', 'Ends in table');
    toolCustomizations[id].noteEditor = 'rich';
    noteApplyEditor(id);
    setToolMode(id, 'edit');
    return id;
});
await page.waitForTimeout(500);
await front(endsInTable);
await page.hover(sel(endsInTable, '.tool-header'));
await page.click(sel(endsInTable, '.note-rich tbody tr:first-child td'));
await page.keyboard.press('ArrowDown');
ok('↓ in a row with more below it stays in the table',
    await page.evaluate((s) => !document.querySelector(s + ' table + p'), sel(endsInTable, '.note-rich')));
await page.click(sel(endsInTable, '.note-rich tbody tr:last-child td'));
await page.keyboard.press('ArrowDown');
await page.keyboard.type('below the table');
await page.waitForTimeout(150);
ok('and the same from the last row of a table that ends the note',
    await md(endsInTable) === '| a | b |\n| --- | --- |\n| 1 | 2 |\n| 3 | 4 |\n\nbelow the table', JSON.stringify(await md(endsInTable)));

// 17. Line spacing, in the tool's settings beside font size and padding.
const spaced = await page.evaluate(() => {
    const id = createNoteWithText('First line\nsecond line\n\n- a\n- b', 'Spacing');
    toolCustomizations[id].noteEditor = 'rich';
    noteApplyEditor(id);
    setToolMode(id, 'split');
    return id;
});
await page.waitForTimeout(500);
const spacing = () => page.evaluate((s) => {
    const r = (q) => { const el = document.querySelector(s + ' ' + q); const c = getComputedStyle(el);
        return Math.round(parseFloat(c.lineHeight) / parseFloat(c.fontSize) * 100) / 100; };
    return { shown: r('.authoring-result p'), rich: r('.note-rich p'), source: r('.note-source') };
}, sel(spaced, '').trim());
const setSlider = (v) => page.evaluate((v) => {
    const s = document.getElementById('toolSettingsLineHeight');
    s.value = v;
    s.dispatchEvent(new Event('input', { bubbles: true }));
}, v);
await page.evaluate((i) => openToolSettingsFor([i], i), spaced);
await page.waitForTimeout(200);
ok('the settings have Line Spacing, beside Font Size and Padding', await page.evaluate(() => {
    const labels = [...document.querySelectorAll('#toolSettingsOverlay label')].map(l => l.textContent.trim());
    const i = labels.indexOf('Line Spacing');
    return i > 0 && labels.indexOf('Padding') === i - 1 && labels.indexOf('Font Size') === i - 2 &&
        document.getElementById('toolSettingsLineHeightLabel').textContent === 'default';
}));
await setSlider('1.9');
await page.waitForTimeout(150);
ok('moving it sets the spacing of the note as shown, and of both its editors',
    JSON.stringify(await spacing()) === JSON.stringify({ shown: 1.9, rich: 1.9, source: 1.9 }), JSON.stringify(await spacing()));
ok('kept with the tool, and said beside the slider',
    await page.evaluate((i) => toolCustomizations[i].lineHeight, spaced) === '1.9' &&
    await page.evaluate(() => document.getElementById('toolSettingsLineHeightLabel').textContent) === '1.9');
await page.evaluate(() => document.querySelector('#toolSettingsOverlay .tool-settings-close').click());
await page.evaluate(() => renderToolboard());
await page.waitForTimeout(800);
await page.evaluate((i) => setToolMode(i, 'split'), spaced);
await page.waitForTimeout(200);
ok('and it is still there when the board is drawn again', (await spacing()).shown === 1.9, JSON.stringify(await spacing()));
await page.evaluate((i) => openToolSettingsFor([i], i), spaced);
await page.waitForTimeout(200);
ok('the settings open on it', await page.evaluate(() =>
    document.getElementById('toolSettingsLineHeight').value === '1.9' &&
    document.getElementById('toolSettingsLineHeightLabel').textContent === '1.9'));
await page.evaluate(() => document.getElementById('toolSettingsLineHeightReset').click());
await page.waitForTimeout(150);
ok('↺ puts it back to the default spacing', JSON.stringify(await spacing()) === JSON.stringify({ shown: 1.55, rich: 1.55, source: 1.55 }) &&
    !('lineHeight' in await page.evaluate((i) => toolCustomizations[i], spaced)), JSON.stringify(await spacing()));
await page.evaluate(() => document.querySelector('#toolSettingsOverlay .tool-settings-close').click());

// 18. Tables.
const tbl = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(700);
await front(tbl);
await page.click(sel(tbl, '.note-rich'));
await page.keyboard.type('Intro');
await page.keyboard.press('Enter');
const tableMenu = async (pick) => {
    await page.hover(sel(tbl, '.tool-header'));
    await page.click(sel(tbl, '.note-table-btn'));
    await page.waitForTimeout(100);
    if (pick) await page.click(sel(tbl, '.note-table-panel ' + pick));
    await page.waitForTimeout(150);
};
await tableMenu();
ok('outside a table, the ⊞ menu offers to insert one, and nothing else',
    await page.evaluate((s) => !document.querySelector(s + ' .note-table-out').hidden &&
        document.querySelector(s + ' .note-table-in').hidden, sel(tbl, '').trim()));
await page.click(sel(tbl, '.note-table-panel button:has-text("Insert table")'));
await page.waitForTimeout(150);
ok('Insert table puts a header and two rows of three where the caret was, the caret in its first cell',
    await md(tbl) === 'Intro\n\n|  |  |  |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |' &&
    await page.evaluate((s) => !!getSelection().anchorNode && !!(getSelection().anchorNode.nodeType === 1 ? getSelection().anchorNode : getSelection().anchorNode.parentElement).closest(s + ' thead th'),
        sel(tbl, '').trim()), JSON.stringify(await md(tbl)));
for (const w of ['Name', 'Role', 'Mail']) { await page.keyboard.type(w); await page.keyboard.press('Tab'); }
await page.keyboard.type('Ann');
await page.keyboard.press('Tab');
await page.keyboard.type('Lead | chief');
await page.keyboard.press('Tab');
await page.keyboard.type('`ann@example.org`');
await page.keyboard.press('Enter');
await page.keyboard.type('down');
await page.waitForTimeout(150);
ok('Tab goes cell to cell, Enter a row down; a | typed in a cell is kept as words, and marks still work',
    await md(tbl) === 'Intro\n\n| Name | Role | Mail |\n| --- | --- | --- |\n| Ann | Lead \\| chief | `ann@example.org` |\n|  |  | down |',
    JSON.stringify(await md(tbl)));
await page.keyboard.press('Tab');
await page.keyboard.type('new row');
await page.waitForTimeout(150);
ok('Tab in the last cell makes a row', /\n\|  \|  \| down \|\n\| new row \|  \|  \|$/.test(await md(tbl)), JSON.stringify(await md(tbl)));
ok('and the ⊞ button shows the caret is in a table',
    await page.evaluate((s) => document.querySelector(s).classList.contains('active'), sel(tbl, '.note-table-btn')));
await page.keyboard.press('Shift+Tab');
await page.keyboard.press('Shift+Tab');
await tableMenu('[data-table="alignCenter"]');
// Two cells back from the first of the last row is the Role column.
ok('a column can be centred, kept as :---: and shown centred',
    /\| --- \| :---: \| --- \|/.test(await md(tbl)) &&
    await page.evaluate((s) => getComputedStyle(document.querySelector(s + ' .note-rich td:nth-child(2)')).textAlign === 'center',
        sel(tbl, '').trim()),
    JSON.stringify(await md(tbl)));
await tableMenu('[data-table="colRight"]');
ok('a column added to its right', /^\| Name \| Role \|  \| Mail \|$/m.test(await md(tbl)), JSON.stringify(await md(tbl)));
await tableMenu('[data-table="delCol"]');
ok('and deleted again', /^\| Name \| Role \| Mail \|$/m.test(await md(tbl)), JSON.stringify(await md(tbl)));
await tableMenu('[data-table="rowAbove"]');
ok('a row added above', /\| Ann \| Lead \\\| chief \| `ann@example.org` \|\n\|  \|  \|  \|\n\|  \|  \| down \|/.test(await md(tbl)),
    JSON.stringify(await md(tbl)));
await tableMenu('[data-table="delRow"]');
ok('and that row deleted', /\| Ann \| Lead \\\| chief \| `ann@example.org` \|\n\|  \|  \| down \|/.test(await md(tbl)),
    JSON.stringify(await md(tbl)));
await page.click(sel(tbl, '.note-rich th'));
await tableMenu();
ok('in a table the menu is about the table — no Insert — and in the header row, Row above and Delete row are not offered, since a Markdown table must have its header',
    await page.evaluate((s) => document.querySelector(s + ' .note-table-out').hidden &&
        !document.querySelector(s + ' .note-table-in').hidden &&
        document.querySelector(s + ' [data-table="rowAbove"]').disabled &&
        document.querySelector(s + ' [data-table="delRow"]').disabled &&
        !document.querySelector(s + ' [data-table="rowBelow"]').disabled, sel(tbl, '.note-table-panel')));
await page.keyboard.press('Escape');
ok('the note with its table stays in rich text, and would come back the same', await isRich(tbl) &&
    await page.evaluate((i) => noteRoundTrips(toolCustomizations[i].customContent), tbl));
await page.click(sel(tbl, '.note-rich td'));
await page.evaluate((s) => {
    const surface = document.querySelector(s);
    const dt = new DataTransfer();
    dt.setData('text/plain', 'two\nlines');
    surface.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
}, sel(tbl, '.note-rich'));
await page.waitForTimeout(150);
// The saved table would join the lines anyway; it is the cell in front of the writer
// that must not have a break in it.
ok('pasting lines into a cell makes them one line — a cell holds no more',
    /\| Name \| Role \| Mail \|[\s\S]*two lines/.test(await md(tbl)) &&
    await page.evaluate((s) => [...document.querySelectorAll(s + ' td')].every(td => !td.querySelector('div, p') &&
        !/\n/.test(td.innerText.trim()) && td.querySelectorAll('br').length <= 1), sel(tbl, '.note-rich')),
    JSON.stringify(await md(tbl)));
await page.click(sel(tbl, '.note-rich td'));
await tableMenu('[data-table="delTable"]');
ok('Delete table takes it away, leaving somewhere to write', await md(tbl) === 'Intro' &&
    !(await page.evaluate((s) => !!document.querySelector(s), sel(tbl, '.note-rich table'))), JSON.stringify(await md(tbl)));
const mdTable = '| Item | Qty | Price |\n|:-----|:---:|------:|\n| Pear | 2 | 1.50 |\n| Fig `x\\|y` | 10 | 0.25 |';
const tblNote = await page.evaluate((m) => {
    const id = createNoteWithText(m, 'Table note');
    toolCustomizations[id].noteEditor = 'rich';
    noteApplyEditor(id);
    setToolMode(id, 'edit');
    return id;
}, mdTable);
await page.waitForTimeout(500);
ok('a note with a table — aligned, with a pipe in code — opens in rich text now, rather than being refused',
    await isRich(tblNote) && await page.evaluate((s) => document.querySelectorAll(s + ' .note-rich td').length, sel(tblNote, '').trim()) === 6);
ok('and opening it changes nothing; written back, it is the same table',
    await md(tblNote) === mdTable &&
    await page.evaluate(() => noteHtmlToMarkdown(parseMarkdown('| Item | Qty | Price |\n|:-----|:---:|------:|\n| Pear | 2 | 1.50 |')))
        === '| Item | Qty | Price |\n| :--- | :---: | ---: |\n| Pear | 2 | 1.50 |');
const pastedTable = await page.evaluate(() => createNoteWithTemplate('blank', {}));
await page.waitForTimeout(700);
await page.evaluate((i) => {
    const surface = document.querySelector('.tool[data-tool="' + i + '"] .note-rich');
    const dt = new DataTransfer();
    dt.setData('text/html', '<table style="border:1px solid"><tr><td><b>Name</b></td><td>Score</td></tr>' +
        '<tr><td>Ann</td><td><p>9</p><p>out of 10</p></td></tr></table>');
    dt.setData('text/plain', 'Name Score');
    surface.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
}, pastedTable);
await page.waitForTimeout(300);
ok('a table pasted from a page arrives as a table — its first row the header, a cell of two paragraphs one line',
    await md(pastedTable) === '| **Name** | Score |\n| --- | --- |\n| Ann | 9 out of 10 |', JSON.stringify(await md(pastedTable)));

// 19. A note's emoji, a little larger than its letters — through a font of their own,
// so the words and the tool's own font are left as they were.
const emo = await page.evaluate(() => {
    const id = createNoteWithText('Plan 🍎 here', 'Emoji size');
    toolCustomizations[id].noteEditor = 'rich';
    noteApplyEditor(id);
    setToolMode(id, 'split');
    return id;
});
await page.waitForTimeout(500);
const glyph = (rootSel, ch) => page.evaluate(([rootSel, ch]) => {
    const root = document.querySelector(rootSel);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
        const k = n.data.indexOf(ch);
        if (k >= 0) { const r = document.createRange(); r.setStart(n, k); r.setEnd(n, k + ch.length); return r.getBoundingClientRect().width; }
    }
    return 0;
}, [rootSel, ch]);
await page.evaluate(() => {
    const out = document.createElement('div');
    out.id = 'emojiOutside';
    out.className = 'markdown-content';
    out.style.cssText = 'position:fixed;left:0;top:0;font-size:12px';
    out.textContent = 'Plan 🍎 here';
    document.body.appendChild(out);
});
const inNote = await glyph(sel(emo, '.authoring-result'), '🍎');
const inEditor = await glyph(sel(emo, '.note-rich'), '🍎');
const outside = await glyph('#emojiOutside', '🍎');
const letterIn = await glyph(sel(emo, '.authoring-result'), 'P');
const letterOut = await glyph('#emojiOutside', 'P');
await page.evaluate(() => document.getElementById('emojiOutside').remove());
ok('a note’s emoji are larger than the same emoji outside a note, shown and being written alike',
    inNote > outside * 1.15 && Math.abs(inNote - inEditor) < 0.5, JSON.stringify({ inNote, inEditor, outside }));
ok('while its letters are the size they were', Math.abs(letterIn - letterOut) < 0.5, JSON.stringify({ letterIn, letterOut }));
await page.evaluate((i) => { toolCustomizations[i].fontFamily = 'Georgia, serif'; applyToolFont(i); }, emo);
ok('and a font chosen for the tool still is the note’s font, behind the emoji',
    await page.evaluate((s) => /^"Note Emoji", Georgia/.test(getComputedStyle(document.querySelector(s)).fontFamily),
        sel(emo, '.authoring-result .markdown-content')),
    await page.evaluate((s) => getComputedStyle(document.querySelector(s)).fontFamily, sel(emo, '.authoring-result .markdown-content')));

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + 232 + ' assertions reached)');
await page.screenshot({ path: OUT + '/note-editor.png' });
await browser.close();
