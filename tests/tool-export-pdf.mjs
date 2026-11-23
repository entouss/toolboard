// Export as PDF from a tool's ⋮ menu: the browser's print dialog, given a page made
// for it. A tool with a page of its own (`printHtml`) prints that; any other prints a
// copy of itself as it is on screen — what is typed in its fields, its canvases as
// pictures, what scrolls let out in full, in the light theme. Printing itself is
// stubbed: the test reads the page it is handed. Made-up content throughout.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 900 }, locale: 'en-US' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:8777/index.html#tool/vacation-planner');
await page.waitForSelector('.vac-widget .vac-tab', { timeout: 20000 });
await page.waitForTimeout(800);
const vac = await page.evaluate(() => document.querySelector('.vac-widget').closest('.tool').dataset.tool);

// A note, with every kind of thing a copy of the screen has to carry put into it.
const note = await page.evaluate(() => {
    const id = createNoteWithText('# Packing notes\n\nBring the map.', 'Packing Notes');
    setToolMode(id, 'render');
    return id;
});
await page.waitForTimeout(600);
await page.evaluate((id) => {
    const c = document.querySelector('.tool[data-tool="' + id + '"] .tool-content');
    const box = document.createElement('div');
    box.innerHTML = '<input class="t-in" value="old"><textarea class="t-ta"></textarea>' +
        '<select class="t-sel"><option>one</option><option>two</option></select><input type="checkbox" class="t-cb">' +
        '<canvas class="t-cv" width="40" height="20"></canvas><iframe class="t-if" src="about:blank"></iframe>' +
        '<div class="t-scroll" style="height:40px;overflow:auto"><div style="height:400px">tall</div></div>';
    c.appendChild(box);
    c.querySelector('.t-in').value = 'typed here';
    c.querySelector('.t-ta').value = 'a note\nof two lines';
    c.querySelector('.t-sel').value = 'two';
    c.querySelector('.t-cb').checked = true;
    const g = c.querySelector('.t-cv').getContext('2d');
    g.fillStyle = '#c00'; g.fillRect(0, 0, 40, 20);
    document.body.classList.add('dark-mode');
}, note);

const openMenu = async (id) => {
    await page.evaluate((i) => { const t = document.querySelector('.tool[data-tool="' + i + '"]'); maxZ++; t.style.zIndex = maxZ; }, id);
    await page.hover('.tool[data-tool="' + id + '"] .tool-header');
    await page.click('.tool[data-tool="' + id + '"] .settings-btn');
    await page.waitForTimeout(250);
};
// The print dialog stubbed: the page it would print is kept, and how it looks.
const printed = async (click) => {
    await page.evaluate(() => {
        window.__printed = null;
        new MutationObserver((list, obs) => list.forEach(m => m.addedNodes.forEach(n => {
            if (n.classList && n.classList.contains('tool-print-frame')) {
                n.contentWindow.print = () => {
                    const d = n.contentDocument;
                    window.__printed = { html: d.documentElement.outerHTML, bg: getComputedStyle(d.body).backgroundColor,
                        dark: d.body.classList.contains('dark-mode') };
                };
                obs.disconnect();
            }
        }))).observe(document.body, { childList: true });
    });
    await click();
    await page.waitForFunction(() => window.__printed, null, { timeout: 5000 });
    return page.evaluate(() => window.__printed);
};

// 1. The menu.
await openMenu(note);
ok('a tool’s ⋮ menu offers Export as PDF, beside PNG', await page.isVisible('#toolSettingsExportPdfBtn') && await page.isVisible('#toolSettingsExportPngBtn'));

// 2. Any tool: a copy of the screen.
const p1 = await printed(() => page.click('#toolSettingsExportPdfBtn'));
ok('it prints, with the tool’s name at the top', /<h1 class="tool-print-title">Packing Notes<\/h1>/.test(p1.html) && /<title>Packing Notes<\/title>/.test(p1.html));
ok('the toast says how to keep it', /Save as PDF/.test(await page.evaluate(() => (document.querySelector('.tool-toast') || {}).textContent || '')));
ok('what the tool shows', p1.html.includes('Bring the map.'));
ok('what is typed in its fields, chosen and ticked', /class="t-in" value="typed here"/.test(p1.html) && p1.html.includes('a note\nof two lines') &&
    /<option selected="">two<\/option>/.test(p1.html) && /class="t-cb" checked=""/.test(p1.html), p1.html.slice(p1.html.indexOf('t-in') - 10, p1.html.indexOf('t-in') + 300));
ok('a canvas as a picture of it; an embedded page said, not printed', /<img src="data:image\/png;base64,/.test(p1.html) && !p1.html.includes('<canvas') &&
    !p1.html.includes('<iframe') && p1.html.includes('Embedded content is not printed.'));
ok('what scrolls is let out in full', /class="t-scroll" style="[^"]*height: auto;[^"]*overflow: visible/.test(p1.html), (p1.html.match(/class="t-scroll"[^>]*>/) || [''])[0]);
ok('in the light theme, though the board is dark', !p1.dark && p1.bg === 'rgb(255, 255, 255)', p1.bg);
await page.waitForTimeout(1600);
ok('the print frame is cleared up after', !(await page.$('.tool-print-frame')));
await page.evaluate(() => document.body.classList.remove('dark-mode'));

// 3. A tool with a page of its own: the Vacation Planner prints its plan as it reads.
await page.evaluate((i) => {
    const p = vacGetData(i);
    Object.assign(p, { name: 'Print Trip', start: '2027-07-09', end: '2027-07-10' });
    vacSaveData(i, p);
    vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget'));
}, vac);
await openMenu(vac);
const p2 = await printed(() => page.click('#toolSettingsExportPdfBtn'));
ok('a tool’s own page, not a copy of the screen', p2.html.includes('class="tool-print-own"') && !p2.html.includes('vac-grid') && !/class="[^"]*tool-print-copy/.test(p2.html));
ok('the planner’s: the bullet list, rendered', /<h1[^>]*>Print Trip<\/h1>/.test(p2.html) && /<h2[^>]*>Friday, July 9<\/h2>/.test(p2.html) && /<li>.*Breakfast \(AM\)/.test(p2.html));
ok('the registration carries the name of its function', await page.evaluate(() => PluginRegistry.getTool('vacation-planner').printHtml) === 'vacPrintHtml');
const fallback = await page.evaluate((i) => {
    const was = window.vacPrintHtml;
    window.vacPrintHtml = () => { throw new Error('made to fail'); };
    const html = buildToolPrintHtml(i);
    window.vacPrintHtml = was;
    return html;
}, vac);
ok('if its page fails, the screen is printed instead', /class="[^"]*tool-print-copy/.test(fallback) && fallback.includes('vac-widget'));
errors.splice(0, errors.length, ...errors.filter(e => !/made to fail/.test(e)));

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 400));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
