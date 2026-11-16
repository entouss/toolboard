// Web addresses in a Checklist item are links: a bare address shows without its
// scheme, cut short when long; [label](url) shows its label. A click on one opens
// it in a new tab; a click beside it edits the item as typed. Only http and https
// are linked, and the item keeps its text exactly. Made-up addresses throughout.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:8777/index.html#tool/checklist');
await page.waitForSelector('.checklist-widget', { state: 'attached', timeout: 20000 });
await page.waitForTimeout(800);
const id = await page.evaluate(() => document.querySelector('.checklist-widget').closest('.tool').dataset.tool);
const T = '.tool[data-tool="' + id + '"] ';

const LONG = 'https://docs.example.com/guides/setup/a-very-long-path/that-goes-on?x=1';
const ITEMS = [
    { text: 'Read https://example.com/start.', status: 'pending', children: [] },
    { text: 'See [the guide](https://example.org/guide) first', status: 'pending', children: [] },
    { text: LONG, status: 'pending', children: [] },
    { text: 'Not this javascript:alert(1) or ftp://example.net/x', status: 'pending', children: [] },
    { text: 'Plain <b>text</b>', status: 'completed', children: [{ text: 'Sub http://example.com/sub', status: 'pending' }] }
];
await page.evaluate(([i, items]) => {
    checklistSaveData(i, items);
    checklistRender(document.querySelector('.tool[data-tool="' + i + '"] .checklist-widget'), i);
}, [id, ITEMS]);
await page.waitForTimeout(200);
const textEl = (path) => T + '.checklist-item[data-path="' + path + '"] .checklist-text';
const links = (path) => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' a')).map(a =>
    ({ text: a.textContent, href: a.getAttribute('href'), title: a.title, target: a.target, rel: a.rel })), textEl(path));

let l = await links('0');
ok('a bare address is a link, shown without its scheme, the full stop after it left out', l.length === 1 &&
    l[0].text === 'example.com/start' && l[0].href === 'https://example.com/start' &&
    await page.textContent(textEl('0')) === 'Read example.com/start.', JSON.stringify(l));
ok('opening in a new tab, on its own', l[0].target === '_blank' && /noopener/.test(l[0].rel));
l = await links('1');
ok('[label](url) shows its label', l.length === 1 && l[0].text === 'the guide' && l[0].href === 'https://example.org/guide' &&
    await page.textContent(textEl('1')) === 'See the guide first', JSON.stringify(l));
l = await links('2');
ok('a long address is cut short, the whole of it in the tooltip', l.length === 1 && l[0].text.length === 40 && l[0].text.endsWith('…') &&
    l[0].text.startsWith('docs.example.com/guides/') && l[0].title === LONG && l[0].href === LONG, JSON.stringify(l));
ok('only http and https are linked', (await links('3')).length === 0 &&
    await page.textContent(textEl('3')) === 'Not this javascript:alert(1) or ftp://example.net/x');
ok('the rest is text, never markup', (await links('4')).length === 0 && await page.textContent(textEl('4')) === 'Plain <b>text</b>' &&
    !(await page.$(textEl('4') + ' b')));
ok('sub-items too', JSON.stringify(await links('4.0')) !== '[]' && (await links('4.0'))[0].text === 'example.com/sub');

// A click on a link opens it, and does not start an edit.
const [popup] = await Promise.all([
    context.waitForEvent('page', { timeout: 5000 }).catch(() => null),
    page.click(textEl('1') + ' a')
]);
ok('a click on a link opens it in a new tab', !!popup && /example\.org\/guide/.test(popup.url() || await popup.evaluate(() => location.href).catch(() => '')),
    popup ? popup.url() : 'no tab');
if (popup) await popup.close();
ok('and does not start an edit', await page.evaluate((s) => document.activeElement !== document.querySelector(s), textEl('1')) &&
    (await links('1')).length === 1);

// A click beside it edits the item as typed.
const box = await page.locator(textEl('1')).boundingBox();
await page.mouse.click(box.x + box.width - 4, box.y + box.height / 2);
await page.waitForTimeout(150);
ok('a click beside it edits the text as typed, link and all', await page.evaluate((s) => document.activeElement === document.querySelector(s), textEl('1')) &&
    await page.textContent(textEl('1')) === 'See [the guide](https://example.org/guide) first' && (await links('1')).length === 0,
    await page.textContent(textEl('1')));
await page.keyboard.type(' now');
await page.keyboard.press('Enter');
await page.waitForTimeout(150);
const saved = await page.evaluate((i) => checklistGetData(i).map(x => x.text), id);
ok('saved as typed, and a link again', saved[1] === 'See [the guide](https://example.org/guide) first now' &&
    (await links('1'))[0].text === 'the guide', JSON.stringify(saved));
ok('the others kept exactly as they were', saved[0] === ITEMS[0].text && saved[2] === LONG && saved[3] === ITEMS[3].text);
ok('the Markdown is the text as typed', await page.evaluate((s) => document.querySelector(s).value, T + '.checklist-markdown-editor')
    .then(v => v.includes('- See [the guide](https://example.org/guide) first now') && v.includes(LONG)));

// Escape puts it back, as a link.
const box2 = await page.locator(textEl('0')).boundingBox();
await page.mouse.click(box2.x + box2.width - 4, box2.y + box2.height / 2);
await page.keyboard.type(' changed');
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
ok('Escape leaves it as it was, a link again', (await page.evaluate((i) => checklistGetData(i)[0].text, id)) === ITEMS[0].text &&
    (await links('0')).length === 1);

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
