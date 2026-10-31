// ✨ in the Mermaid Diagram, with Chrome's on-device model faked by its API shape. It
// draws a diagram from a description, changes one, fixes one Mermaid cannot read, and
// explains one. A diagram it writes is cleaned (fences, chatter, click lines), drawn by
// Mermaid before it is offered, and sent back once with Mermaid's complaint if it does
// not draw; one that still does not can only be copied. Use this diagram puts it in,
// and Undo takes it out.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
await context.addInitScript(() => {
    const ai = window.__ai = { calls: [], replies: [], reply: () => 'Fine.' };
    window.LanguageModel = {
        availability: async () => 'available',
        create: async (opts) => {
            ai.calls.push({ op: 'create', system: opts.initialPrompts && opts.initialPrompts[0] && opts.initialPrompts[0].content });
            return {
                promptStreaming: (input) => {
                    ai.calls.push({ op: 'prompt', input });
                    const text = ai.replies.length ? ai.replies.shift() : ai.reply(input);
                    return (async function* () { yield text; })();
                },
                destroy: () => {}
            };
        }
    };
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:8777/index.html#tool/mermaid-diagram');
await page.waitForSelector('.mermaid-diag-widget textarea', { state: 'attached', timeout: 20000 });
await page.waitForFunction(() => !!document.querySelector('.mermaid-diag-preview svg'), null, { timeout: 30000 });
const id = await page.evaluate(() => document.querySelector('.mermaid-diag-widget').closest('.tool').dataset.tool);
const T = '.tool[data-tool="' + id + '"] ';
const P = '#boardAIPopup ';
const code = () => page.evaluate((s) => document.querySelector(s).value, T + '.mermaid-diag-editor textarea');
const saved = () => page.evaluate((i) => (loadToolCustomizations()[i] || {}).mermaidCode, id);
const items = () => page.evaluate(() => Array.from(document.querySelectorAll('#boardAIPopup .bai-item')).map(b => b.dataset.ai));
const prompts = () => page.evaluate(() => window.__ai.calls.filter(c => c.op === 'prompt').map(c => c.input));
const replies = (list) => page.evaluate((l) => { window.__ai.replies = l; window.__ai.calls = window.__ai.calls.filter(c => c.op === 'create'); }, list);
const open = async () => {
    if (!(await page.isVisible('#boardAIPopup'))) { await page.hover(T + '.tool-header'); await page.click(T + '.ai-btn'); }
    else if (await page.isVisible(P + '.bai-work')) await page.click(P + '.bai-back');
    await page.waitForTimeout(150);
};
const done = () => page.waitForFunction(() => !document.querySelector('#boardAIPopup .bai-foot').hidden ||
    document.querySelector('#boardAIPopup .bai-status').classList.contains('bai-error'), null, { timeout: 30000 });
const run = async (action, line) => {
    await open();
    await page.click(P + '.bai-item[data-ai="custom:' + action + '"]');
    if (line != null) { await page.fill(P + '.bai-q', line); await page.click(P + '.bai-ask .bai-btn'); }
    await done();
};
const visible = (s) => page.isVisible(P + s);
const START = await code();

// 1. What it offers.
ok('the diagram has ✨ in its header', await page.isVisible(T + '.ai-btn'));
await open();
ok('with a diagram that draws: draw, change, explain and Ask — no fix', JSON.stringify(await items()) ===
    JSON.stringify(['custom:draw', 'custom:change', 'custom:explain', 'ask']), JSON.stringify(await items()));
ok('it says what it works on', /On this diagram \(flowchart, \d+ lines\)/.test(await page.textContent(P + '.bai-scope')), await page.textContent(P + '.bai-scope'));

// 2. Draw from a description: cleaned, checked, then put in.
const GOOD = 'flowchart TD\n    A[Form] --> B{"Email ok?"}\n    B -->|yes| C[Welcome]\n    B -->|no| A';
await replies(['Here you go:\n\n```mermaid\n' + GOOD.replace('B -->|no| A', 'click A call alert(1)\n    B -->|no| A') + '\n```\n\nHope it helps!']);
await run('draw', 'sign-up flow: form, email check, welcome page');
let ps = await prompts();
ok('what you wrote goes to the model', ps.length === 1 && /sign-up flow: form, email check, welcome page/.test(ps[0]), JSON.stringify(ps));
ok('what came back is the code alone: no fences, no chatter, no click line',
    await page.evaluate(() => boardAIState.result) === GOOD, JSON.stringify(await page.evaluate(() => boardAIState.result)));
ok('shown as code', await page.isVisible(P + '.bai-out pre code') && /Welcome/.test(await page.textContent(P + '.bai-out pre')));
ok('it draws, so it is offered: Use this diagram, and no Insert', await visible('.bai-replace') &&
    (await page.textContent(P + '.bai-replace')) === 'Use this diagram' && !(await visible('.bai-insert')) && await visible('.bai-copy'));
ok('nothing changed yet', await code() === START);
await page.click(P + '.bai-replace');
await page.waitForFunction((s) => /Welcome/.test((document.querySelector(s) || {}).textContent || ''), T + '.mermaid-diag-preview', { timeout: 15000 });
ok('Use this diagram puts it in the editor, saved', await code() === GOOD && await saved() === GOOD);
ok('and it is drawn', await page.evaluate((s) => !!document.querySelector(s + ' svg'), T + '.mermaid-diag-preview'));
await page.evaluate(() => undoLast());
await page.waitForTimeout(400);
ok('Undo takes it out', await saved() === START, JSON.stringify(await saved()));
await page.evaluate((i) => mermDiagOnRender(i), id);
await page.waitForTimeout(300);

// 3. One that does not draw goes back once, with what Mermaid says.
const BROKEN = 'flowchart TD\n    A[Start --> B[End';
await replies([BROKEN, '```\n' + GOOD + '\n```']);
await run('draw', 'a flow');
ps = await prompts();
ok('a diagram Mermaid cannot read is sent back once', ps.length === 2 && /does not draw\. Mermaid says: \S/.test(ps[1]) && ps[1].includes(BROKEN),
    JSON.stringify(ps[1] || '').slice(0, 200));
ok('and the fixed one is offered', await page.evaluate(() => boardAIState.result) === GOOD && await visible('.bai-replace'));
await replies([BROKEN, BROKEN]);
await run('draw', 'a flow');
ok('still broken after that, it says why', await page.evaluate(() => document.querySelector('#boardAIPopup .bai-status').classList.contains('bai-error')) &&
    (await page.textContent(P + '.bai-status')).length > 5, await page.textContent(P + '.bai-status'));
ok('and can only be copied, never put in', !(await visible('.bai-replace')) && !(await visible('.bai-insert')) && await visible('.bai-copy'));
await page.evaluate(() => boardAIApply('replace'));
ok('even asked to directly', await saved() === START);
await replies(['Sorry, I cannot help with that.', 'Still no.']);
await run('draw', 'anything');
ok('an answer that is no diagram at all is not offered either', /does not start with a kind of diagram/.test(await page.textContent(P + '.bai-status')) &&
    !(await visible('.bai-replace')));

// 4. Change it.
const CHANGED = START + '\n    E --> F[Thank you]';
await replies([CHANGED]);
await run('change', 'add a thank-you step after the end');
ps = await prompts();
ok('Change it sends the diagram and what to change', ps[0].includes(START) && /Change it: add a thank-you step/.test(ps[0]));
await page.click(P + '.bai-replace');
await page.waitForTimeout(300);
ok('and the whole changed diagram goes in', await saved() === CHANGED);
await page.evaluate(() => undoLast());
await page.waitForTimeout(300);

// 5. Fix the error, offered only when there is one.
await page.evaluate(([s, b]) => { const t = document.querySelector(s); t.value = b; mermDiagRender(t.closest('.mermaid-diag-widget')); }, [T + '.mermaid-diag-editor textarea', BROKEN]);
await page.waitForFunction((s) => !!document.querySelector(s + ' .mermaid-diag-error'), T, { timeout: 15000 });
await open();
ok('a diagram with a syntax error is offered a fix', (await items()).includes('custom:fix') && /syntax error/.test(await page.textContent(P + '.bai-scope')));
const mermaidSays = await page.evaluate((s) => document.querySelector(s).closest('.mermaid-diag-widget')._mermError, T + '.mermaid-diag-editor textarea');
await replies([GOOD]);
await run('fix');
ps = await prompts();
ok('Fix sends the diagram and what Mermaid says about it', ps[0].includes(BROKEN) && ps[0].includes(mermaidSays.slice(0, 30)), ps[0].slice(0, 200));
await page.click(P + '.bai-replace');
await page.waitForFunction((s) => !!document.querySelector(s + ' svg'), T + '.mermaid-diag-preview', { timeout: 15000 });
ok('and the fixed diagram draws', await saved() === GOOD);
await open();
ok('once it draws, Fix is not offered', !(await items()).includes('custom:fix'));

// 6. Explain it: to read and copy.
await replies(['It shows a sign-up.\n\n- A form\n- An email check']);
await run('explain');
ok('Explain sends the diagram', (await prompts())[0].includes(GOOD));
ok('and can only be copied', !(await visible('.bai-replace')) && !(await visible('.bai-insert')) && await visible('.bai-copy'));
await page.click(P + '.bai-copy');
ok('Copy copies it', (await page.evaluate(() => navigator.clipboard.readText())).startsWith('It shows a sign-up.'));

// 7. An empty diagram can still be drawn.
await page.click(P + '.bai-x');
await page.evaluate((s) => { const t = document.querySelector(s); t.value = ''; mermDiagRender(t.closest('.mermaid-diag-widget')); }, T + '.mermaid-diag-editor textarea');
await open();
ok('with nothing written, only Draw is offered to work, and it says so', /No diagram yet/.test(await page.textContent(P + '.bai-scope')) &&
    JSON.stringify(await items()) === JSON.stringify(['custom:draw', 'ask']) && await page.isEnabled(P + '.bai-item[data-ai="custom:draw"]') &&
    !(await page.isEnabled(P + '.bai-item[data-ai="ask"]')));
await page.click(P + '.bai-x');

// 8. The cleaning, on its own.
ok('cleaning: a bare diagram is kept as it is', await page.evaluate((g) => mermDiagAIClean(g) === g, GOOD));
ok('a javascript: address goes with its line', await page.evaluate(() =>
    mermDiagAIClean('flowchart LR\n  A --> B\n  A["x"]:::c\n  B["<a href=\'javascript:alert(1)\'>y</a>"]') === 'flowchart LR\n  A --> B\n  A["x"]:::c'));
ok('chatter before the diagram goes, front matter stays', await page.evaluate(() =>
    mermDiagAIClean('Sure! Here it is.\n---\ntitle: T\n---\nflowchart LR\n  A --> B') === '---\ntitle: T\n---\nflowchart LR\n  A --> B'));
ok('the model is told it writes Mermaid', await page.evaluate(() => window.__ai.calls.some(c => c.op === 'create' && c.system === MERMAID_AI_SYSTEM)));

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
