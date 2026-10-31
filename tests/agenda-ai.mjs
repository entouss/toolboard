// ✨ in the Agenda Timer, with Chrome's on-device model faked by its API shape. Planning,
// it drafts an agenda from a line you type — sections, minutes and points to cover, as
// JSON — shown first and put in only by Replace the plan or Add to the plan, which Undo
// takes back. After a run it writes up the notes and lists action items, to copy: the
// run itself is never changed. Each state offers only what fits it.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
await context.addInitScript(() => {
    // BoardAI is off until a person turns it on; these tests are about it on.
    if (localStorage.getItem('toolboard_onDeviceAI') == null) localStorage.setItem('toolboard_onDeviceAI', 'on');
    const ai = window.__ai = { calls: [], reply: () => 'Fine.' };
    window.LanguageModel = {
        availability: async () => 'available',
        create: async (opts) => {
            ai.calls.push({ op: 'create', system: opts.initialPrompts && opts.initialPrompts[0] && opts.initialPrompts[0].content });
            return {
                promptStreaming: (input, o) => {
                    ai.calls.push({ op: 'prompt', input, schema: o && o.responseConstraint });
                    const text = ai.reply(input, o);
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
const offsite = [];
page.on('request', (r) => { // The page's own libraries and fonts are its own business; nothing else may go out.
    if (!/^(http:\/\/localhost:8777\/|data:|https:\/\/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com)\/)/.test(r.url())) offsite.push(r.url()); });
await page.goto('http://localhost:8777/index.html#tool/agenda-timer');
await page.waitForSelector('.agt-widget .agt-row', { timeout: 20000 });
await page.waitForTimeout(800);
const id = await page.evaluate(() => document.querySelector('.agt-widget').closest('.tool').dataset.tool);
const T = '.tool[data-tool="' + id + '"] ';
const W = T + '.agt-widget';
const P = '#boardAIPopup ';
const names = () => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .agt-name')).map(i => i.value), W);
const saved = () => page.evaluate((i) => JSON.parse(JSON.stringify(loadToolCustomizations()[i] || {})), id);
const items = () => page.evaluate(() => Array.from(document.querySelectorAll('#boardAIPopup .bai-item')).map(b => b.dataset.ai));
const lastPrompt = () => page.evaluate(() => window.__ai.calls.filter(c => c.op === 'prompt').pop());
const open = async () => {
    if (!(await page.isVisible('#boardAIPopup'))) { await page.hover(T + '.tool-header'); await page.click(T + '.ai-btn'); }
    else if (await page.isVisible(P + '.bai-work')) await page.click(P + '.bai-back');
    await page.waitForTimeout(150);
};
const done = () => page.waitForFunction(() => !document.querySelector('#boardAIPopup .bai-foot').hidden ||
    /could not|No sections/.test(document.querySelector('#boardAIPopup .bai-status').textContent), null, { timeout: 5000 });
const draft = async (what) => {
    await open();
    await page.click(P + '.bai-item[data-ai="custom:draft"]');
    await page.fill(P + '.bai-q', what);
    await page.click(P + '.bai-ask .bai-btn');
    await done();
};
const DRAFT = { sections: [
    { name: 'Check-in', minutes: 5, points: ['- [ ] How is everyone', 'Blockers?'] },
    { name: '   ', minutes: 3, points: [] },
    { name: 'Demo', minutes: 7.3, points: [] },
    { name: 'Wrap-up', minutes: 3, fixed: true, points: ['Next steps'] }
] };
await page.evaluate((d) => { window.__ai.reply = (input, o) => o && o.responseConstraint ? JSON.stringify(d) : 'Fine.'; }, DRAFT);

// 1. Planning.
ok('the timer has ✨ in its header', await page.isVisible(T + '.ai-btn'));
await open();
ok('planning, it offers a draft and Ask, not a write-up', JSON.stringify(await items()) === JSON.stringify(['custom:draft', 'ask']), JSON.stringify(await items()));
ok('and says what it would work on', /On this agenda \(5 sections, 45 min\)/.test(await page.textContent(P + '.bai-scope')), await page.textContent(P + '.bai-scope'));
ok('Draft asks for a line first', (await page.textContent(P + '.bai-item[data-ai="custom:draft"]')) === 'Draft an agenda…');
await page.click(P + '.bai-item[data-ai="custom:draft"]');
ok('with a box that says what to write', await page.isVisible(P + '.bai-q') &&
    /What is it for/.test(await page.getAttribute(P + '.bai-q', 'placeholder')) && (await page.textContent(P + '.bai-ask .bai-btn')) === 'Go');
await page.fill(P + '.bai-q', 'a 20-minute team stand-up');
await page.press(P + '.bai-q', 'Enter');
await done();
let call = await lastPrompt();
ok('what you wrote goes to the model', /a 20-minute team stand-up/.test(call.input), call.input.slice(0, 80));
ok('asking for JSON in the plan’s shape', !!call.schema && JSON.stringify(call.schema).includes('"minutes"'));
const out = await page.textContent(P + '.bai-out');
ok('the draft is shown first, cleaned up: no unnamed section, half minutes', /Check-in/.test(out) && /Demo — 7\.5 min/.test(out) &&
    !/3 min.*3 min.*3 min/.test(out) && /Total 15\.5 min/.test(out), out.slice(0, 200));
ok('nothing changed yet', (await names()).length === 5);
ok('Replace the plan or Add to the plan', (await page.textContent(P + '.bai-replace')) === 'Replace the plan' &&
    (await page.textContent(P + '.bai-insert')) === 'Add to the plan');
await page.click(P + '.bai-replace');
await page.waitForTimeout(200);
ok('Replace puts the draft in as the plan', JSON.stringify(await names()) === JSON.stringify(['Check-in', 'Demo', 'Wrap-up']), JSON.stringify(await names()));
const s = (await saved()).agtSections;
ok('with its points as tick-boxes, fixed kept', s[0].notes === '- [ ] How is everyone\n- [ ] Blockers?' && s[2].fixed === true && !s[1].fixed && s[1].minutes === 7.5,
    JSON.stringify(s));
ok('and the popup closes', !(await page.isVisible('#boardAIPopup')));
await page.evaluate(() => undoLast());
await page.waitForTimeout(300);
ok('Undo puts the plan back', (await names()).length === 5 && (await names())[0] === 'Introductions', JSON.stringify(await names()));

await draft('a stand-up');
await page.click(P + '.bai-insert');
await page.waitForTimeout(200);
ok('Add to the plan puts it after what is there', JSON.stringify(await names()) ===
    JSON.stringify(['Introductions', 'Background', 'Technical', 'Their questions', 'Wrap-up', 'Check-in', 'Demo', 'Wrap-up']), JSON.stringify(await names()));
await page.evaluate(() => undoLast());
await page.waitForTimeout(300);

await page.evaluate(() => { window.__ai.reply = () => 'not json'; });
await draft('anything');
ok('what cannot be read is said, and offers nothing to put in', /could not be read/.test(await page.textContent(P + '.bai-status')) &&
    !(await page.isVisible(P + '.bai-foot')));
await page.evaluate(() => { window.__ai.reply = () => JSON.stringify({ sections: [{ name: '', minutes: 4, points: [] }] }); });
await draft('anything');
ok('nor does a draft with no usable section', /No sections came back/.test(await page.textContent(P + '.bai-status')));
await page.evaluate((d) => { window.__ai.reply = (input, o) => o && o.responseConstraint ? JSON.stringify(d) : 'Fine.'; }, DRAFT);

// An empty plan can still be drafted.
await page.click(P + '.bai-x');
await page.evaluate(([i, s]) => { const d = agtGetData(i); d.sections = []; agtSaveData(i, d); agtRender(document.querySelector(s)); }, [id, W]);
await open();
ok('with no sections, it says so', /No sections yet/.test(await page.textContent(P + '.bai-scope')));
ok('and Draft still works, Ask does not', await page.isEnabled(P + '.bai-item[data-ai="custom:draft"]') && !(await page.isEnabled(P + '.bai-item[data-ai="ask"]')));
await draft('a stand-up');
await page.click(P + '.bai-replace');
await page.waitForTimeout(200);
ok('drafted into an empty plan', JSON.stringify(await names()) === JSON.stringify(['Check-in', 'Demo', 'Wrap-up']));

// 2. Running.
await page.click(W + ' .agt-start-btn');
await page.click(W + ' .agt-go');
await page.waitForTimeout(200);
await open();
ok('running, it offers action items and Ask, not a draft or a write-up', JSON.stringify(await items()) === JSON.stringify(['custom:actions', 'ask']), JSON.stringify(await items()));
ok('on the run so far', /On this run so far/.test(await page.textContent(P + '.bai-scope')));
ok('a draft cannot go into a running plan', await page.evaluate((i) => agtAIApply(i, 'x', 'replace', {}, { action: 'draft', data: [{ name: 'X', minutes: 1 }] }), id) === false &&
    (await saved()).agtSections.length === 3);
await page.click(P + '.bai-x');
await page.click(W + ' .agt-run-notes input[type="checkbox"]');
await page.waitForTimeout(100);
for (let k = 0; k < 3; k++) { await page.click(W + ' .agt-next-btn'); await page.waitForTimeout(150); }
ok('the run is done', await page.isVisible(W + ' .agt-done'));

// 3. Done.
await open();
ok('done, it offers a write-up, action items and Ask', JSON.stringify(await items()) === JSON.stringify(['custom:writeup', 'custom:actions', 'ask']), JSON.stringify(await items()));
await page.evaluate(() => { window.__ai.reply = () => 'It went well.\n\n## Check-in\n\n- All fine'; });
await page.click(P + '.bai-item[data-ai="custom:writeup"]');
await done();
call = await lastPrompt();
(await import('node:fs')).writeFileSync(process.env.CLAUDE_JOB_DIR + '/tmp/wu.txt', call.input);
ok('the write-up works from the notes as the run left them', /\[x\] How is everyone/.test(call.input) && /\[ \] Blockers\?/.test(call.input) &&
    /finished/.test(call.input) && /## Demo — planned 7\.5 min, took/.test(call.input), call.input.slice(430, 1100));
ok('it reads in the popup', /It went well/.test(await page.textContent(P + '.bai-out')));
ok('and can only be copied: nothing is put in the run', !(await page.isVisible(P + '.bai-replace')) && !(await page.isVisible(P + '.bai-insert')) &&
    await page.isVisible(P + '.bai-copy'));
await page.click(P + '.bai-copy');
ok('Copy copies it', (await page.evaluate(() => navigator.clipboard.readText())).startsWith('It went well.'));
await open();
await page.click(P + '.bai-item[data-ai="custom:actions"]');
await done();
ok('action items are asked for as a checklist', /Markdown checklist/.test((await lastPrompt()).input) && !(await page.isVisible(P + '.bai-insert')));
ok('the system prompt is the timer’s own', await page.evaluate(() => window.__ai.calls.filter(c => c.op === 'create').pop().system) ===
    await page.evaluate(() => AGT_AI_SYSTEM));

ok('nothing went over the network', offsite.length === 0, JSON.stringify(offsite.slice(0, 5)));
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
