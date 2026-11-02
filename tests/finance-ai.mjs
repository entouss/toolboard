// ✨ in Finance Planning, with Chrome's on-device model faked by its API shape. Check my
// plan and Explain where it leads read the plan with every figure already worked out and
// are to copy, ending with the note that they are an estimate; Draft from a description
// turns a few sentences into accounts, income and expenses — JSON, cleaned, shown first —
// added or in place of the plan; Sort expenses into sections puts headings in Expenses
// and moves the lines under them, keeping every one. The clock is fixed at 1 November 2026.
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
await page.clock.install({ time: new Date(2026, 10, 1, 10, 0, 0) });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:8777/index.html#tool/finance-planning');
await page.waitForSelector('.fp-widget', { timeout: 25000 });
await page.waitForTimeout(1500);
const id = await page.evaluate(() => document.querySelector('.fp-widget').closest('.tool').dataset.tool);
const T = '.tool[data-tool="' + id + '"] ';
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

const plan = () => page.evaluate((i) => fpGet(i), id);
const setPlan = (p) => page.evaluate(([i, p]) => { fpSet(i, Object.assign(fpDefaultPlan(), p)); fpRender(document.querySelector('.fp-widget')); }, [id, p]);
const names = (list) => page.evaluate(([i, l]) => fpGet(i)[l].map(x => (x.type === 'section' ? '#' : '') + x.name).join(','), [id, list]);
const NOTE = '*An estimate from the plan’s own figures and assumptions, not financial advice.*';

// 1. What it offers.
ok('the planner has ✨ in its header', await page.isVisible(T + '.ai-btn'));
await open();
ok('an empty plan: only drafting it, and Ask', JSON.stringify(await items()) === JSON.stringify(['custom:draft', 'ask']), JSON.stringify(await items()));
ok('and it says so', /Nothing in the plan yet/.test(await page.textContent(P + '.bai-scope')), await page.textContent(P + '.bai-scope'));

// 2. Draft from a description.
const DRAFT = { accounts: [{ name: 'Savings', kind: 'cash', balance: 15000 }, { name: '- Car loan', kind: 'loan', balance: 12000, rate: 7, monthly: 400 },
        { name: 'Boat', kind: 'boat', balance: -5 }],
    incomes: [{ name: 'Salary', amount: 95000, every: 'year' }, { name: 'Nothing', amount: 0, every: 'month' }],
    expenses: [{ name: 'Rent', amount: 2000, every: 'month' }, { name: '', amount: 5, every: 'month' }] };
await replies([JSON.stringify(DRAFT)]);
await run('draft', 'I earn $95k, rent is $2,000, $15k saved, a $12k car loan at 7% paying $400');
let call = (await prompts())[0];
ok('what you wrote goes to the model, with the kinds it may use and in JSON', /I earn \$95k/.test(call.input) && /kind is one of cash, investment, retirement/.test(call.input) &&
    JSON.stringify(call.schema).includes('"accounts"'));
let out = await page.textContent(P + '.bai-out');
ok('shown first, cleaned: an unknown kind made Other, a negative amount dropped, nameless and zero lines left out', /Savings/.test(out) && /Car loan/.test(out) && !/- Car loan/.test(out) &&
    /Boat \| Other asset \|  \|/.test(await page.evaluate(() => boardAIState.result)) && !/Nothing/.test(out) && (out.match(/Rent/g) || []).length === 1, await page.evaluate(() => boardAIState.result));
ok('Add to the plan or Replace the plan', (await page.textContent(P + '.bai-insert')) === 'Add to the plan' && (await page.textContent(P + '.bai-replace')) === 'Replace the plan');
await page.click(P + '.bai-insert');
await page.waitForTimeout(300);
let p = await plan();
ok('added: the accounts, income and expenses, as the plan keeps them', (await names('accounts')) === 'Savings,Car loan,Boat' && (await names('incomes')) === 'Salary' &&
    (await names('expenses')) === 'Rent' && p.accounts[1].rate === 7 && p.accounts[1].monthly === 400 && p.incomes[0].every === 'year' && p.incomes[0].taxed === true, JSON.stringify(p.accounts));

// 3. What the model reads.
await page.waitForTimeout(700);
await replies(['- Cash covers 3.4 months.']);
await run('check');
call = (await prompts())[0];
ok('each account, line and total, worked out — the model does no sums', call.input.includes('- Savings (Cash): balance $15,000') && call.input.includes('- Car loan (Loan): owes $12,000, 7% a year, pays $400.00 a month') &&
    call.input.includes('- Salary: $7,917 gross, tax estimated') && call.input.includes('- Rent: $2,000') && /A month now: income \$7,917/.test(call.input) &&
    /Today: assets \$15,000, liabilities \$12,000, net worth \$3,000\./.test(call.input) && /Ahead, in today’s money, net worth: in 2031/.test(call.input), call.input.slice(0, 900));
ok('with facts drawn from them: months of cash, savings rate, debt payments', /Cash on hand covers 6\.3 months of spending/.test(call.input) && /% of gross income\./.test(call.input) &&
    /Debt payments with escrow take 5% of gross income/.test(call.input), call.input.slice(call.input.indexOf('Facts')));
ok('Check my plan: to copy, ending with what it is', await copyOnly() && (await page.evaluate(() => boardAIState.result)).endsWith(NOTE) && /Say what to look at, not what to buy/.test(call.input));
await replies(['It grows.\n\n' + NOTE]);
await run('explain');
ok('Explain where it leads: to copy, and the note not said twice', await copyOnly() && (await page.evaluate(() => boardAIState.result)).split('not financial advice').length === 2 && /plain language/.test((await prompts())[0].input));
await page.evaluate(() => BoardAI.setInstructions('Use British spelling.'));
await replies(['Fine.']);
await run('check');
ok('your own instructions go with the prose', (await prompts())[0].input.endsWith('Use British spelling.'));
await page.evaluate(() => BoardAI.setInstructions(''));

// 4. Sorting expenses into sections.
await open();
ok('sorting is offered only with three expenses or more', !(await items()).includes('custom:sections'));
await page.click(P + '.bai-x');
await setPlan({ accounts: [{ id: 'c', name: 'Cash', kind: 'cash', balance: 5000 }], incomes: [{ id: 'i', name: 'Pay', amount: 6000, every: 'month', taxed: false }],
    expenses: [{ id: 'r', name: 'Rent', amount: 2000, every: 'month' }, { id: 'g', name: 'Groceries', amount: 600, every: 'month' }, { id: 'el', name: 'Electric', amount: 1200, every: 'year' },
        { id: 'n', name: 'Streaming', amount: 20, every: 'month' }, { id: 'gas', name: 'Gas', amount: 150, every: 'month' }],
    tax: { on: false } });
await page.waitForTimeout(700);
const before = await page.evaluate((i) => fpProject(fpGet(i), 0).rows[5].net, id);
await replies([JSON.stringify({ sections: [{ name: 'Housing', lines: [1, 3] }, { name: 'Food', lines: [2, 2, 9] }, { name: 'Fun', lines: [4, 1] }, { name: 'Empty', lines: [] }] })]);
await run('sections');
call = (await prompts())[0];
ok('the model is given the expenses, numbered, with a month of each', call.input.includes('1. Rent: $2,000 a month') && call.input.includes('3. Electric: $100 a month') && call.input.includes('5. Gas: $150 a month'), call.input.slice(-300));
out = await page.textContent(P + '.bai-out');
ok('shown first, with each section’s total from the plan; a line named twice or a number that is no line, dropped', /Housing — \$2,100 \/ mo/.test(out) && /Food — \$600 \/ mo/.test(out) &&
    /Fun — \$20 \/ mo/.test(out) && !/Empty/.test(out), out);
ok('what is not sorted is said to stay where it is', /Left where they are, above the sections: Gas/.test(out));
ok('one way in: Apply these sections', (await page.textContent(P + '.bai-replace')) === 'Apply these sections' && !(await visible('.bai-insert')));
await page.click(P + '.bai-replace');
await page.waitForTimeout(300);
ok('applied: headings in place, every expense kept, under its section', (await names('expenses')) === 'Gas,#Housing,Rent,Electric,#Food,Groceries,#Fun,Streaming', await names('expenses'));
ok('and nothing worked out has changed', Math.abs((await page.evaluate((i) => fpProject(fpGet(i), 0).rows[5].net, id)) - before) < 1e-6);
await page.waitForTimeout(700);
await replies([JSON.stringify({ sections: [{ name: 'Everything', lines: [1, 2, 3, 4, 5] }] })]);
await run('sections');
await page.click(P + '.bai-replace');
await page.waitForTimeout(300);
ok('sorted again: the old headings go, the new ones take their place', (await names('expenses')) === '#Everything,Gas,Rent,Electric,Groceries,Streaming', await names('expenses'));
await page.waitForTimeout(700);
await page.evaluate(() => undoLast());
await page.waitForTimeout(400);
ok('undone like any edit', (await names('expenses')) === 'Gas,#Housing,Rent,Electric,#Food,Groceries,#Fun,Streaming', await names('expenses'));
ok('a sorting that names a line the plan does not have is refused', await page.evaluate((i) => fpAIApply(i, '', 'replace', {}, { action: 'sections', data: [{ name: 'X', lines: [99] }] }), id) === false);

// 5. Replace the plan.
await replies([JSON.stringify({ accounts: [{ name: 'Only', kind: 'cash', balance: 1 }], incomes: [], expenses: [] })]);
await run('draft', 'just one account');
await page.click(P + '.bai-replace');
await page.waitForTimeout(300);
ok('Replace the plan: what was there goes, the assumptions stay', (await names('accounts')) === 'Only' && (await names('expenses')) === '' && (await plan()).assume.years === 30);
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
