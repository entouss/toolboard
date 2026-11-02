// ✨ in the Project Table, with Chrome's on-device model faked by its API shape. Draft
// rows turns a description into tasks, sizes and their order — JSON, cleaned, shown
// first — for the table to schedule, added or put in place of the rows; Break this row
// down does the same under the row being worked in. Status update and Risks read the
// plan with its dates and slack already worked out, and are to copy. Undo takes back
// whatever went in. The clock is fixed at 31 October 2026.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
await context.addInitScript(() => {
    // BoardAI is off until a person turns it on; these tests are about it on.
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
await page.clock.install({ time: new Date(2026, 9, 31, 10, 0, 0) });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:8777/index.html#tool/project-table');
await page.waitForSelector('.proj-widget', { timeout: 25000 });
await page.waitForTimeout(1500);
const id = await page.evaluate(() => document.querySelector('.proj-widget').closest('.tool').dataset.tool);
const T = '.tool[data-tool="' + id + '"] ';
const rowsNow = () => page.evaluate((i) => JSON.parse(JSON.stringify(projGetData(i).rows)), id);
const P = '#boardAIPopup ';
const items = () => page.evaluate(() => Array.from(document.querySelectorAll('#boardAIPopup .bai-item')).map(b => b.dataset.ai));
const prompts = () => page.evaluate(() => window.__ai.calls.filter(c => c.op === 'prompt'));
const replies = (list) => page.evaluate((l) => { window.__ai.replies = l; window.__ai.calls = window.__ai.calls.filter(c => c.op === 'create'); }, list);
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

// 1. What it offers.
ok('the table has ✨ in its header', await page.isVisible(T + '.ai-btn'));
await open();
ok('with rows and no row being worked in: draft, status, risks and Ask', JSON.stringify(await items()) ===
    JSON.stringify(['custom:rows', 'custom:status', 'custom:risks', 'ask']), JSON.stringify(await items()));
ok('it says what it works on', (await page.textContent(P + '.bai-scope')) === 'On this plan (3 rows)', await page.textContent(P + '.bai-scope'));
await page.click(P + '.bai-x');

// 2. Status update: the plan, worked out.
await replies(['## Done\n\n- nothing yet']);
await run('status');
let call = (await prompts())[0];
ok('the model reads each row with its days, dates and slack worked out', call.input.includes('#1 Discovery: size M (10 d); 60% done, 4 d left; 2026-10-31 to 2026-11-03; deadline 2026-11-10, slack +7 d (Comfortable); assigned John') &&
    call.input.includes('#2 Build:') && call.input.includes('after #1') && call.input.includes('#3 Launch:') && /nobody assigned/.test(call.input), call.input.slice(0, 400));
ok('and the sizes they come from', /Sizes: XXXS = 0\.5 days, .*M = 10 days, L = 30 days/.test(call.input));
ok('asked for a status update, to copy', /"Done", "In progress", "At risk" and "Next"/.test(call.input) && await copyOnly());
await replies(['- #3 Launch: nobody assigned']);
await run('risks');
ok('Risks, to copy', /List the risks in this plan/.test((await prompts())[0].input) && await copyOnly());
await page.click(P + '.bai-copy');
ok('Copy copies it', (await page.evaluate(() => navigator.clipboard.readText())) === '- #3 Launch: nobody assigned');

// 3. Draft rows.
const DRAFT = { rows: [
    { task: '1. Write the page', size: 'm', after: 0, note: 'Cover sign-in and billing' },
    { task: '   ', size: 'S', after: 0 },
    { task: 'Review it', size: 'HUGE', after: 1 },
    { task: 'Publish', size: 'S', after: 5 }
] };
await replies([JSON.stringify(DRAFT)]);
await run('rows', 'launch the new help page by mid-December');
call = (await prompts())[0];
ok('what you wrote goes to the model, with the size scale and the plan as it is', /launch the new help page by mid-December/.test(call.input) &&
    /XS = 3 days/.test(call.input) && /do not repeat them:\nPlan as of 2026-10-31/.test(call.input) && JSON.stringify(call.schema).includes('"after"'));
const out = await page.textContent(P + '.bai-out');
ok('shown first, cleaned: numbering gone, an empty task dropped, an unknown size made ?', /Write the page/.test(out) && /Review it/.test(out) && !/1\. Write/.test(out) &&
    await page.evaluate(() => /\| 2 \| Review it \| \? \| #1 \|/.test(boardAIState.result)), out);
ok('a task cannot come after one later than itself', await page.evaluate(() => /\| 3 \| Publish \| S \|  \|/.test(boardAIState.result)), await page.evaluate(() => boardAIState.result));
ok('Add to the table or Replace the rows', (await page.textContent(P + '.bai-insert')) === 'Add to the table' && (await page.textContent(P + '.bai-replace')) === 'Replace the rows');
ok('nothing changed yet', (await rowsNow()).length === 3);
await page.click(P + '.bai-insert');
await page.waitForTimeout(300);
let rows = await rowsNow();
ok('Add puts them after what is there', rows.length === 6 && JSON.stringify(rows.slice(3).map(r => r.cells.item + ':' + r.cells.size)) === JSON.stringify(['Write the page:M', 'Review it:?', 'Publish:S']),
    JSON.stringify(rows.map(r => r.cells.item)));
ok('each coming after the one it said, by the new row', JSON.stringify(rows[4].cells.deps) === JSON.stringify([rows[3].id]) && rows[5].cells.deps.length === 0 && rows[3].cells.deps.length === 0);
ok('with its note on the task', rows[3].notes && rows[3].notes.item === 'Cover sign-in and billing');
ok('and the table schedules them', await page.evaluate((s) => document.querySelectorAll(s + ' .proj-table tbody tr').length, T) === 6 &&
    await page.evaluate((s) => document.querySelectorAll(s + ' .proj-gantt-row').length, T) === 6);
await page.evaluate(() => undoLast());
await page.waitForTimeout(400);
ok('Undo takes them out', (await rowsNow()).length === 3);
await page.waitForTimeout(700);
await replies([JSON.stringify(DRAFT)]);
await run('rows', 'the help page');
await page.click(P + '.bai-replace');
await page.waitForTimeout(300);
ok('Replace makes them the rows', JSON.stringify((await rowsNow()).map(r => r.cells.item)) === JSON.stringify(['Write the page', 'Review it', 'Publish']));
await page.evaluate(() => undoLast());
await page.waitForTimeout(400);
ok('and Undo puts the plan back', JSON.stringify((await rowsNow()).map(r => r.cells.item)) === JSON.stringify(['Discovery', 'Build', 'Launch']));
await page.waitForTimeout(700);

// 4. Break this row down: the row being worked in.
await page.click(T + '[data-row="r-build"][data-col="item"]');
await open();
ok('working in a row, it can be broken down', (await items()).includes('custom:breakdown') && /row #2 Build/.test(await page.textContent(P + '.bai-scope')), await page.textContent(P + '.bai-scope'));
await replies([JSON.stringify({ rows: [{ task: 'Set up the site', size: 'S', after: 0 }, { task: 'Write the pages', size: 'M', after: 1 }] })]);
await page.click(P + '.bai-item[data-ai="custom:breakdown"]');
await done();
call = (await prompts())[0];
ok('the row goes to the model, with the plan around it', /in the order they happen:\n\S+ #2 Build: size L \(30 d\)/.test(call.input) && /The rest of the plan, for context:\nPlan as of/.test(call.input), call.input.slice(0, 200));
ok('one way in, named for the row: no Replace', (await page.textContent(P + '.bai-insert')) === 'Add as sub-rows of #2' && !(await visible('.bai-replace')));
await page.click(P + '.bai-insert');
await page.waitForTimeout(300);
rows = await rowsNow();
const kids = rows.filter(r => r.parent === 'r-build');
ok('they go in under it, in order, the second after the first', JSON.stringify(kids.map(r => r.cells.item)) === JSON.stringify(['Set up the site', 'Write the pages']) &&
    JSON.stringify(kids[1].cells.deps) === JSON.stringify([kids[0].id]));
ok('and are numbered under it', await page.evaluate(([i, k]) => { const d = projGetData(i); return projRowNumber(d, d.rows.find(r => r.id === k)); }, [id, kids[1].id]) === '2.2');
ok('a row as deep as rows go is not offered for breaking down, and refused if asked', await page.evaluate(([i, k]) => {
    const d = projGetData(i);
    d.rows.push({ id: 'r-deep', parent: k, cells: { item: 'Deep', size: 'S', pct: 0, deps: [], links: [] } });
    projSetData(i, d);
    return projAIApply(i, 'x', 'insert', { row: { id: 'r-deep' } }, { action: 'breakdown', data: [{ task: 'X', size: 'S', after: null, note: '' }] }) === false;
}, [id, kids[0].id]));
await page.evaluate(() => undoLast());
await page.waitForTimeout(700);

// 5. An empty table, and what cannot be used.
await page.evaluate((i) => { const d = projGetData(i); d.rows = []; projSetData(i, d); projRender(document.querySelector('.tool[data-tool="' + i + '"] .proj-widget'), i); }, id);
await page.waitForTimeout(300);
await open();
ok('an empty table can still be drafted; nothing else is offered to work', /No rows yet/.test(await page.textContent(P + '.bai-scope')) &&
    JSON.stringify(await items()) === JSON.stringify(['custom:rows', 'ask']) && await page.isEnabled(P + '.bai-item[data-ai="custom:rows"]') && !(await page.isEnabled(P + '.bai-item[data-ai="ask"]')));
await replies(['nope']);
await run('rows', 'anything');
ok('what cannot be read is said, with nothing to put in', /could not be read/.test(await page.textContent(P + '.bai-status')) && !(await visible('.bai-foot')));
await replies([JSON.stringify({ rows: [{ task: '', size: 'S', after: 0 }] })]);
await run('rows', 'anything');
ok('nor are rows with no task', /No rows came back/.test(await page.textContent(P + '.bai-status')));
ok('the model is told what it is for', await page.evaluate(() => window.__ai.calls.some(c => c.op === 'create' && c.system === PROJ_AI_SYSTEM)));

// 5b. The status update's squares are the table's: each row's, from its slack and progress,
// put on every bullet that names it whatever the model wrote, with the key below.
const SQ = { green: String.fromCodePoint(0x1F7E9), red: String.fromCodePoint(0x1F7E5), orange: String.fromCodePoint(0x1F7E7), blue: String.fromCodePoint(0x1F7E6), white: String.fromCharCode(0x2B1C) };
await page.evaluate((i) => {
    const d = projGetData(i);
    d.rows = projSeedData().rows;
    // Slack is the table's: days to the deadline less the row's own days left.
    d.rows.find(r => r.id === 'r-launch').cells.deadline = '2026-11-02';
    d.rows.find(r => r.id === 'r-build').cells.deadline = '2026-12-02';
    projSetData(i, d);
    projRender(document.querySelector('.tool[data-tool="' + i + '"] .proj-widget'), i);
}, id);
await page.waitForTimeout(300);
const squares = await page.evaluate((i) => projAITarget(i).squares, id);
ok('each row has its square, by the table’s own slack bands', JSON.stringify(squares) === JSON.stringify({ 1: SQ.green, 2: SQ.orange, 3: SQ.red }), JSON.stringify(squares));
await replies(['## Done\n\n- #1 Discovery is well along\n- ' + SQ.red + ' #2 Build needs a push\n- No row named here\n\n## Next\n\n1. #3 Launch']);
await run('status');
call = (await prompts())[0];
ok('the model is given each row with its square, and asked to start each bullet with it', call.input.includes(SQ.orange + ' #2 Build:') &&
    /Start every bullet with the row's status square exactly as the plan gives it/.test(call.input));
const result = await page.evaluate(() => boardAIState.result);
ok('a bullet the model left bare gets its row’s square', result.includes('- ' + SQ.green + ' #1 Discovery is well along'), result);
ok('a wrong one is put right', result.includes('- ' + SQ.orange + ' #2 Build needs a push') && !result.includes(SQ.red + ' #2'), result);
ok('a numbered one too', result.includes('1. ' + SQ.red + ' #3 Launch'), result);
ok('a bullet naming no row is left as it was', result.includes('- No row named here'));
ok('and the key is at the end', result.trim().endsWith('not started*') && result.includes(SQ.orange + ' tight'), result.slice(-120));
ok('as it reads in the popup', (await page.textContent(P + '.bai-out')).includes(SQ.green + ' #1 Discovery'));
const kept = await page.evaluate((sq) => projAISquareUp('- ' + sq.green + ' #4 Ready to go\n- #5 Waiting\n- ' + sq.red + ' #6 Slipping',
    { squares: { 4: sq.white, 5: sq.white, 6: sq.orange } }), SQ);
ok('a row the table can only call not started keeps the model’s square', kept.includes('- ' + SQ.green + ' #4 Ready to go'), kept);
ok('and gets ' + SQ.white + ' where the model gave none', kept.includes('- ' + SQ.white + ' #5 Waiting'), kept);
ok('where the table knows, it still has the last word', kept.includes('- ' + SQ.orange + ' #6 Slipping'), kept);

// 6. The person's own instructions: said last on a status update, where a small model
// heeds them; not on a draft, which has to come back as JSON.
await page.evaluate((t) => BoardAI.setInstructions(t), 'When providing feedback, use 🟩 good, 🟥 late, 🟧 warning.');
await page.evaluate((i) => { const d = projGetData(i); d.rows = projSeedData().rows; projSetData(i, d); projRender(document.querySelector('.tool[data-tool="' + i + '"] .proj-widget'), i); }, id);
await page.waitForTimeout(300);
await replies(['- ok']);
await run('status');
ok('a status update ends with the person’s instructions', (await prompts())[0].input.endsWith('they decide the wording, tone and formatting: When providing feedback, use 🟩 good, 🟥 late, 🟧 warning.'),
    (await prompts())[0].input.slice(-160));
await replies([JSON.stringify({ rows: [{ task: 'One', size: 'S', after: 0 }] })]);
await run('rows', 'anything');
ok('a draft does not: its shape is the point', !(await prompts())[0].input.includes('When providing feedback, use 🟩 good, 🟥 late, 🟧 warning.'));
await page.evaluate(() => BoardAI.setInstructions(''));
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
