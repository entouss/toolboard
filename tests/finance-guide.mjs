// The Finance Planning guide (learn/tools/finance-planning.html): the ? on the planner and
// on Tax & Retirement Rules opens it, the page is there with its pictures, and its "Try it"
// link fills an empty planner with the made-up example — never one already in use.
//
// The clock is Playwright's, fixed at 1 November 2026.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 900 }, locale: 'en-US' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.clock.install({ time: new Date(2026, 10, 1, 10, 0, 0) });

// 1. The example link.
await page.goto('http://localhost:8777/index.html#tool/finance-planning?example=1');
await page.waitForSelector('.fp-widget .fp-accounts tbody tr', { state: 'attached', timeout: 25000 });
await page.waitForTimeout(400);
const id = await page.evaluate(() => document.querySelector('.fp-widget').closest('.tool').dataset.tool);
await page.evaluate((i) => setToolMode(i, 'split'), id);
const plan = () => page.evaluate((i) => fpGet(i), id);
let p = await plan();
ok('?example=1: the made-up example, with a birth month, retirement and Social Security', p.accounts.length === 11 && p.retire.on && p.retire.birth === '1985-11' &&
    p.incomes.some(l => l.type === 'ss' && l.fraBenefit === null), JSON.stringify(p.incomes.map(l => l.name)));
await page.waitForFunction(() => /Could stop working in/.test(document.querySelector('.fp-projection').innerText), null, { timeout: 20000 });
ok('so every part has something to show: ages, the Social Security estimate, when you could stop', /Could stop working in \d{4}, at \d+/.test(await page.innerText('.fp-projection')) &&
    /, at \d+/.test(await page.innerText('.fp-projection')));
const shown = await page.evaluate((i) => { const r = fpProject(fpGet(i), 0, {}); const m = r.milestones; const k = fpGet(i).incomes[0];
    return { goals: fpGet(i).goals.filter(g => g.type !== 'section').length, section: fpGet(i).goals.some(g => g.type === 'section'), kinds: fpGet(i).accounts.map(a => a.kind + (a.tax ? ':' + a.tax : '')),
        match: k.matchRate, into: k.into.length, penalty: m.penalties.pretax, early: m.drawnEarly, cashOut: m.cashOut, runsOut: m.runsOut, college: Object.values(m.goals).find(g => g.count === 4) }; }, id);
ok('the newer parts too: goals in a section, a 529, an HSA, a Roth and an IRA, pay into accounts with a match', shown.goals === 3 && shown.section && shown.match === 50 && shown.into === 2 &&
    ['education', 'hsa', 'retirement:roth', 'retirement:pretax'].every(k => shown.kinds.includes(k)), JSON.stringify(shown));
ok('it retires when the last job ends, in the month its age would have given', await page.evaluate((i) => { const p = fpGet(i); const r = fpRetireInfo(p); return p.retire.from === 'job' && r.ym === '2050-11' && r.atMonths === 780; }, id));
ok('a penalty to show, and a goal its account falls short of', shown.penalty > 0 && shown.college.fromOwn < shown.college.due);
ok('and a plan that holds together: no early draws, no cash out, money to the end', shown.early === null && shown.cashOut === null && shown.runsOut === null, JSON.stringify(shown));
ok('within the limits, with money left over each month', !/over the|limit exceeded/i.test(await page.innerText('[data-sec="accounts"]')) && /\$\d+ a month left over/.test(await page.innerText('[data-sec="advice"]')));
await page.fill('.fp-accounts tr:first-child [data-f="name"]', 'Everyday');
await page.waitForTimeout(150);
await page.goto('http://localhost:8777/index.html#tool/finance-planning?example=1');
await page.waitForSelector('.fp-widget .fp-accounts tbody tr', { state: 'attached', timeout: 25000 });
await page.waitForTimeout(400);
p = await plan();
ok('opened again on a plan in use: left as it is', p.accounts[0].name === 'Everyday' && p.accounts.length === 11, p.accounts[0].name);

// 2. The ? on the planner.
const tool = '.tool[data-tool="' + id + '"]';
ok('the planner has a ? in its header', !!(await page.$(tool + ' .guide-btn')) && (await page.getAttribute(tool + ' .guide-btn', 'title')) === 'How this tool works');
let popup = context.waitForEvent('page');
await page.click(tool + ' .guide-btn');
let tab = await popup;
await tab.waitForLoadState('load');
ok('it opens the Finance Planning guide', /learn\/tools\/finance-planning\.html$/.test(tab.url()) && (await tab.title()).startsWith('Finance Planning'), tab.url() + ' · ' + await tab.title());
const pageFacts = await tab.evaluate(() => ({
    header: document.querySelectorAll('.site-header').length, h1: document.querySelectorAll('h1').length,
    images: Array.from(document.images).map(i => i.getAttribute('src') + ':' + (i.complete && i.naturalWidth > 0)),
    anchors: ['accounts', 'income', 'expenses', 'retirement', 'ahead', 'stop', 'next', 'assumptions', 'rules', 'ai', 'privacy', 'limits'].filter(a => !document.getElementById(a)),
    inPage: Array.from(document.querySelectorAll('a[href^="#"]')).map(a => a.getAttribute('href').slice(1)).filter(h => !document.getElementById(h)),
    tryIt: document.querySelector('.hero .btn.primary').getAttribute('href'),
    alts: Array.from(document.images).every(i => (i.getAttribute('alt') || '').length > 20)
}));
ok('the page is really there, not a 404', pageFacts.header === 1 && pageFacts.h1 === 1);
ok('its five pictures load, each with a description', pageFacts.images.length === 5 && pageFacts.images.every(s => s.endsWith(':true')) && pageFacts.alts, pageFacts.images.join(' '));
ok('each part of the planner has its section', pageFacts.anchors.length === 0 && pageFacts.inPage.length === 0, pageFacts.anchors.concat(pageFacts.inPage).join());
ok('and its Try it link is the example', pageFacts.tryIt === '/#tool/finance-planning?example=1');
const index = await context.newPage();
await index.goto('http://localhost:8777/learn/index.html');
ok('the guides page lists it', await index.evaluate(() => !!document.querySelector('a[href="tools/finance-planning.html"]') && !!document.querySelector('a[href="/#tool/finance-planning?example=1"]')));
await index.close();
await tab.close();

// 3. The ? on Tax & Retirement Rules: the same page, at its section.
await page.click('.fp-rules-link');
await page.waitForSelector('.tb-widget .tb-tabs', { timeout: 10000 });
const rules = await page.evaluate(() => document.querySelector('.tb-widget').closest('.tool').dataset.tool);
popup = context.waitForEvent('page');
await page.click('.tool[data-tool="' + rules + '"] .guide-btn');
tab = await popup;
await tab.waitForLoadState('load');
ok('Tax & Retirement Rules opens the guide at its section', /finance-planning\.html#rules$/.test(tab.url()) && await tab.evaluate(() => !!document.getElementById('rules')), tab.url());
await tab.close();
ok('the plugin manager says what the Finance toolbox holds', await page.evaluate(() => OFFICIAL_PLUGINS.flatMap(g => g.items).some(i => i.name === 'Finance Tools' && /Finance Planning/.test(i.desc))));
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
