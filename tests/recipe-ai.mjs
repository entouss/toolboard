// ✨ in the Recipe, with Chrome's on-device model faked by its API shape. Draft a recipe,
// Turn into an outline and Scale it write the outline, which the tool's own parser reads
// before it can be used: what does not parse goes back once, then is offered only to
// copy; a scaled recipe must keep every line where it was. Use this recipe replaces
// the text, which Undo takes back. Steps in words and Shopping list are read, to copy.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
await context.addInitScript(() => {
    if (localStorage.getItem('toolboard_onDeviceAI') == null) localStorage.setItem('toolboard_onDeviceAI', 'on');
    const ai = window.__ai = { calls: [], replies: [], reply: () => 'Fine.' };
    window.LanguageModel = {
        availability: async () => 'available',
        create: async (opts) => {
            ai.calls.push({ op: 'create', system: opts.initialPrompts && opts.initialPrompts[0] && opts.initialPrompts[0].content });
            return {
                promptStreaming: (input, o) => {
                    ai.calls.push({ op: 'prompt', input, schema: o && o.responseConstraint });
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
await page.goto('http://localhost:8777/index.html#tool/recipe');
await page.waitForSelector('.rcp-widget', { state: 'attached', timeout: 20000 });
await page.waitForTimeout(800);
const id = await page.evaluate(() => document.querySelector('.rcp-widget').closest('.tool').dataset.tool);
const T = '.tool[data-tool="' + id + '"] ';
const P = '#boardAIPopup ';
const text = () => page.evaluate((i) => rcpGetData(i).text, id);
const setText = (t) => page.evaluate(([i, t]) => { const ta = document.querySelector('.tool[data-tool="' + i + '"] .rcp-widget textarea'); ta.value = t; rcpOnInput(ta); }, [id, t]);
const items = () => page.evaluate(() => Array.from(document.querySelectorAll('#boardAIPopup .bai-item')).filter(b => !b.hidden && b.offsetParent).map(b => b.dataset.ai));
const prompts = () => page.evaluate(() => window.__ai.calls.filter(c => c.op === 'prompt'));
const systems = () => page.evaluate(() => window.__ai.calls.filter(c => c.op === 'create').map(c => c.system || ''));
const replies = (list) => page.evaluate((l) => { window.__ai.replies = l; window.__ai.calls = []; }, list);
const open = async () => {
    if (!(await page.isVisible('#boardAIPopup'))) { await page.hover(T + '.tool-header'); await page.click(T + '.ai-btn'); }
    else if (await page.isVisible(P + '.bai-work')) await page.click(P + '.bai-back');
    await page.waitForTimeout(150);
};
const done = () => page.waitForFunction(() => !document.querySelector('#boardAIPopup .bai-foot').hidden ||
    document.querySelector('#boardAIPopup .bai-status').classList.contains('bai-error'), null, { timeout: 10000 });
const run = async (action, line) => {
    await open();
    await page.click(P + '.bai-item[data-ai="custom:' + action + '"]');
    if (line != null) { await page.fill(P + '.bai-q', line); await page.click(P + '.bai-ask .bai-btn'); }
    await done();
};
const visible = (s) => page.isVisible(P + s);
const copyOnly = async () => !(await visible('.bai-replace')) && !(await visible('.bai-insert')) && await visible('.bai-copy');
const out = () => page.textContent(P + '.bai-out');

const TOAST = '# Cheese Toast\n@ Heat the grill\ngrill 3 min\n  layer\n    2 slices bread\n    50 g cheddar';

// 1. Empty: only drafting.
ok('the recipe has ✨ in its header', await page.isVisible(T + '.ai-btn'));
await open();
ok('empty, it offers Draft a recipe and Ask', JSON.stringify(await items()) === JSON.stringify(['custom:draft', 'ask']), JSON.stringify(await items()));
ok('and says there is nothing yet; only drafting works', /No recipe yet/.test(await page.textContent(P + '.bai-scope')) &&
    await page.isEnabled(P + '.bai-item[data-ai="custom:draft"]') && !(await page.isEnabled(P + '.bai-item[data-ai="ask"]')));

// 2. Draft, tidied: a fence, a preface and bullets are taken off.
await replies(['Sure! Here it is:\n```\n# Cheese Toast\n@ Heat the grill\n- grill 3 min\n  - layer\n    - 2 slices bread\n    - 50 g cheddar\n```']);
await run('draft', 'cheese toast');
let call = (await prompts())[0];
ok('the description goes to the model, with the outline explained by example', /Write a recipe for: cheese toast/.test(call.input) &&
    (await systems()).some(s => /outside-in/.test(s) && /Espresso Brownies/.test(s)));
ok('shown tidied, as the outline', (await out()).includes('# Cheese Toast') && (await out()).includes('    2 slices bread') && !/Sure!|- grill/.test(await out()), await out());
ok('one way to use it: Use this recipe', (await page.textContent(P + '.bai-replace')) === 'Use this recipe' && !(await visible('.bai-insert')));
ok('nothing changed yet', (await text()) === '');
await page.click(P + '.bai-replace');
await page.waitForTimeout(250);
ok('Use this recipe puts it in', (await text()) === TOAST, JSON.stringify(await text()));
ok('and the table shows it', await page.locator(T + '.rcp-table td.rcp-op').count() === 2 && await page.locator(T + '.rcp-table td.rcp-ingredient').count() === 2);
await page.evaluate(() => undoLast());
await page.waitForTimeout(300);
ok('Undo takes it out', (await text()) === '', JSON.stringify(await text()));

// 3. An outline that does not parse goes back once, with why.
const FLAT = '# Cheese Toast\ngrill 3 min\nlayer\n2 slices bread';
await replies([FLAT, TOAST]);
await run('draft', 'cheese toast');
let ps = await prompts();
ok('a flat answer goes back once, saying why', ps.length === 2 && /Nothing is indented/.test(ps[1].input) && ps[1].input.includes(FLAT), JSON.stringify(ps.map(p => p.input.slice(0, 80))));
ok('and the fixed one is offered', (await visible('.bai-replace')) && (await out()).includes('50 g cheddar'));
await replies([' first\n  bad indent', '   still bad\n x']);
await run('draft', 'cheese toast');
ps = await prompts();
ok('still not an outline after one try: said, and only to copy', ps.length === 2 && await copyOnly(), String(ps.length));
await page.evaluate(() => document.querySelector('#boardAIPopup .bai-x, #boardAIPopup .bai-close') && document.querySelector('#boardAIPopup .bai-x, #boardAIPopup .bai-close').click());

// 4. An ordinary recipe: Turn into an outline.
const PLAIN = 'Cheese toast\nIngredients: 2 slices bread, 50 g cheddar\nPut the cheese on the bread and grill for 3 minutes.';
await setText(PLAIN);
await open();
ok('text that is not an outline offers Turn into an outline, not Scale', JSON.stringify(await items()) === JSON.stringify(['custom:draft', 'custom:outline', 'ask']), JSON.stringify(await items()));
ok('and says it is not an outline yet', /not an outline yet/.test(await page.textContent(P + '.bai-scope')));
await replies([TOAST]);
await run('outline');
ok('the text goes to the model to rewrite', (await prompts())[0].input.includes(PLAIN) && /Rewrite this recipe as the outline/.test((await prompts())[0].input));
await page.click(P + '.bai-replace');
await page.waitForTimeout(250);
ok('and replaces it', (await text()) === TOAST);

// 5. An outline: Scale it, Steps in words, Shopping list.
await open();
ok('an outline offers draft, scale, steps, shopping and Ask', JSON.stringify(await items()) ===
    JSON.stringify(['custom:draft', 'custom:scale', 'custom:steps', 'custom:shopping', 'ask']), JSON.stringify(await items()));
ok('and says what it holds', /This recipe, Cheese Toast \(2 steps, 2 ingredients\)/.test(await page.textContent(P + '.bai-scope')), await page.textContent(P + '.bai-scope'));
const DOUBLE = TOAST.replace('2 slices', '4 slices').replace('50 g', '100 g');
await replies([DOUBLE]);
await run('scale', 'double it');
ok('Scale sends the recipe and how', (await prompts())[0].input.includes(TOAST) && /Scale it: double it/.test((await prompts())[0].input));
await page.click(P + '.bai-replace');
await page.waitForTimeout(250);
ok('the amounts change, the steps stay', (await text()) === DOUBLE);
const CHANGED = '# Cheese Toast\ngrill 3 min\n  layer\n    4 slices bread\n    100 g cheddar\n    1 tomato';
await replies([CHANGED, CHANGED]);
await run('scale', 'double it');
ps = await prompts();
ok('a scaled recipe with a line added goes back, saying the steps changed', ps.length === 2 && /The steps changed/.test(ps[1].input));
ok('and is then only to copy', await copyOnly());
await replies(['Ingredients\n- 4 slices bread\n\nMethod\n1. Layer\n2. Grill']);
await run('steps');
ok('Steps in words asks for the method in order, to copy', /most indented steps first/.test((await prompts())[0].input) && await copyOnly());
await replies(['## Bakery\n- 4 slices bread']);
await run('shopping');
ok('Shopping list asks for it by where it is found, to copy', /grouped under short headings/.test((await prompts())[0].input) && await copyOnly());
await page.click(P + '.bai-copy');
ok('Copy copies it', (await page.evaluate(() => navigator.clipboard.readText())) === '## Bakery\n- 4 slices bread');
ok('and none of it changed the recipe', (await text()) === DOUBLE);

ok('no page errors', errors.length === 0, JSON.stringify(errors));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
