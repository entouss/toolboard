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
await page.waitForSelector('.fp-widget .fp-accounts tbody tr', { timeout: 25000 });
await page.waitForTimeout(400);
const id = await page.evaluate(() => document.querySelector('.fp-widget').closest('.tool').dataset.tool);
const plan = () => page.evaluate((i) => fpGet(i), id);
let p = await plan();
ok('?example=1: the made-up example, with a birth month, retirement and Social Security', p.accounts.length === 7 && p.retire.on && p.retire.birth === '1985-11' &&
    p.incomes.some(l => l.type === 'ss' && l.fraBenefit === null), JSON.stringify(p.incomes.map(l => l.name)));
ok('so every part has something to show: ages, the Social Security estimate, when you could stop', /Could stop working in \d{4}, at \d+/.test(await page.innerText('.fp-projection')) &&
    /, at \d+/.test(await page.innerText('.fp-projection')));
await page.fill('.fp-accounts tr:first-child [data-f="name"]', 'Everyday');
await page.waitForTimeout(150);
await page.goto('http://localhost:8777/index.html#tool/finance-planning?example=1');
await page.waitForSelector('.fp-widget .fp-accounts tbody tr', { timeout: 25000 });
await page.waitForTimeout(400);
p = await plan();
ok('opened again on a plan in use: left as it is', p.accounts[0].name === 'Everyday' && p.accounts.length === 7, p.accounts[0].name);

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
