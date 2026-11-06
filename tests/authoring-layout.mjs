// Both, side by side or one over the other, for every tool built on the framework's two
// panes: the button shows only in Both, the panes turn, the choice lasts, and each direction
// keeps its own place for the divider. Tools whose Both is a toolbar beside a canvas have no
// panes to turn, and no button.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];
const open = async (tool) => {
    const page = await (await browser.newContext({ viewport: { width: 1300, height: 900 }, locale: 'en-US' })).newPage();
    page.on('pageerror', (e) => errors.push(tool + ': ' + e.message));
    await page.goto('http://localhost:8777/index.html#tool/' + tool);
    await page.waitForSelector('.tool.authoring', { state: 'attached', timeout: 25000 });
    await page.waitForTimeout(500);
    const id = await page.evaluate(() => document.querySelector('.tool.authoring').dataset.tool);
    return { page, id };
};
const geo = (page, id) => page.evaluate((i) => {
    const t = document.querySelector('.tool[data-tool="' + i + '"]');
    const a = getAuthoring(i), r = (s) => t.querySelector(s).getBoundingClientRect();
    const s = r(a.source), e = r(a.result);
    return { s: [s.left, s.top, s.right, s.bottom].map(Math.round), e: [e.left, e.top, e.right, e.bottom].map(Math.round) };
}, id);
const sideBySide = (g) => g.s[2] <= g.e[0] + 1 && Math.abs(g.s[1] - g.e[1]) < 40;
const stacked = (g) => g.s[3] <= g.e[1] + 1 && Math.abs(g.s[0] - g.e[0]) < 30;
const flip = async (page) => { await page.evaluate(() => document.querySelector('.tool.authoring .authoring-layout-btn').click()); await page.waitForTimeout(250); };
const mode = async (page, id, m) => { await page.evaluate(([i, m]) => setToolMode(i, m), [id, m]); await page.waitForTimeout(200); };

// 1. Every tool on the panes.
const tools = ['blank', 'script', 'checklist', 'directory-structure', 'sequence-diagram', 'mermaid-diagram', 'finance-planning', 'recipe', 'project-table', 'curriculum-explorer', 'curriculum-doctor', 'curriculum-builder'];
for (const tool of tools) {
    const { page, id } = await open(tool);
    await mode(page, id, 'split');
    const startsStacked = tool === 'project-table';
    let g = await geo(page, id);
    ok(tool + ': starts as it did', startsStacked ? stacked(g) : sideBySide(g), JSON.stringify(g));
    ok(tool + ': the button is there in Both', await page.isVisible('.tool.authoring .authoring-layout-btn') || await page.evaluate(() => getComputedStyle(document.querySelector('.tool.authoring .authoring-layout-btn')).display !== 'none'));
    await flip(page);
    g = await geo(page, id);
    ok(tool + ': turns', startsStacked ? sideBySide(g) : stacked(g), JSON.stringify(g));
    ok(tool + ': the choice is kept', await page.evaluate((i) => toolCustomizations[i].splitDirection, id) === (startsStacked ? 'row' : 'column'));
    await flip(page);
    g = await geo(page, id);
    ok(tool + ': and back', startsStacked ? stacked(g) : sideBySide(g), JSON.stringify(g));
    await mode(page, id, 'render');
    ok(tool + ': no button out of Both', await page.evaluate(() => getComputedStyle(document.querySelector('.tool.authoring .authoring-layout-btn')).display === 'none'));
    await page.context().close();
}

// 2. Tools without the panes.
for (const tool of ['image-viewer', 'qr-code-generator', 'history-timeline', 'world-map', 'diagram']) {
    const { page } = await open(tool);
    ok(tool + ': no panes, no button', await page.locator('.authoring-layout-btn').count() === 0);
    await page.context().close();
}

// 3. The divider, each way, on the note.
const { page, id } = await open('blank');
await mode(page, id, 'split');
const bar = () => page.evaluate(() => { const r = document.querySelector('.tool.authoring .authoring-resizer').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
const drag = async (dx, dy) => { const b = await bar(); await page.mouse.move(b.x, b.y); await page.mouse.down(); await page.mouse.move(b.x + dx, b.y + dy, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(150); };
const size = async () => { const g = await geo(page, id); return { w: g.s[2] - g.s[0], h: g.s[3] - g.s[1] }; };
await page.hover('.tool.authoring');
let before = await size();
await drag(-120, 0);
let after = await size();
ok('side by side, the divider drags sideways', after.w < before.w - 80, JSON.stringify([before, after]));
const wide = after.w;
await flip(page);
before = await size();
await drag(0, -80);
after = await size();
ok('stacked, it drags up and down', after.h < before.h - 40, JSON.stringify([before, after]));
const custom = await page.evaluate((i) => toolCustomizations[i], id);
ok('each kept apart', custom.splitRatio > 0 && custom.splitRatioStacked > 0 && custom.splitRatio !== custom.splitRatioStacked, JSON.stringify([custom.splitRatio, custom.splitRatioStacked]));
const high = after.h;
await flip(page);
ok('back side by side: its width, not the height', Math.abs((await size()).w - wide) < 3);
await flip(page);
ok('stacked again: its height', Math.abs((await size()).h - high) < 3);
await page.evaluate(() => saveToolCustomizations(toolCustomizations));
await page.reload();
await page.waitForSelector('.tool.authoring', { state: 'attached', timeout: 25000 });
await page.waitForTimeout(600);
await mode(page, id, 'split');
await page.hover('.tool.authoring');
await page.waitForTimeout(350);
ok('through a reload', stacked(await geo(page, id)) && Math.abs((await size()).h - high) < 6, JSON.stringify([await geo(page, id), high, (await size()).h]));

// 4. The Project Table: the timeline is its divider stacked, and keeps its share.
const pt = await open('project-table');
await mode(pt.page, pt.id, 'split');
await pt.page.evaluate((i) => { toolCustomizations[i].projSplit = 0.4; const w = document.querySelector('.proj-widget'); projApplySplit(w, 0.4); }, pt.id);
const share = () => pt.page.evaluate(() => document.querySelector('.proj-table-pane').style.flex);
ok('stacked: the timeline, not the framework’s divider', await pt.page.isVisible('.proj-timeline') && !(await pt.page.isVisible('.proj-widget .authoring-resizer')));
await flip(pt.page);
ok('side by side: the divider, not the timeline', !(await pt.page.isVisible('.proj-timeline')) && await pt.page.isVisible('.proj-widget .authoring-resizer'));
await flip(pt.page);
ok('stacked again: its share of the height is still there', /40(\.0)?%/.test(await share()), await share());

ok('no page errors', errors.length === 0, JSON.stringify(errors));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
