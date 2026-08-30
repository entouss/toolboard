// A link into the builder: no plugin installed, no tool, and a document named in
// the URL. The same route the explorer's "try it" link takes.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:8777/index.html#tool/curriculum-builder?curriculum=learn/data/ashford-2025-2026.json');
await page.waitForTimeout(6000);

const state = await page.evaluate(() => {
    const widget = document.querySelector('.tool .cbld-widget');
    const tool = widget ? widget.closest('.tool') : null;
    const data = tool && window.cbldGetData ? cbldGetData(tool.getAttribute('data-tool')) : null;
    return {
        widget: !!widget,
        rows: document.querySelectorAll('.cbld-crow').length,
        courses: data && data.catalog ? data.catalog.courses.length : 0,
        school: data && data.catalog ? (data.catalog.school || {}).name : null,
        source: data ? data.sourceUrl : null,
        mode: tool ? tool.className : '',
        tally: (document.querySelector('.cbld-check-head') || {}).textContent || ''
    };
});
ok('the link installs the plugin and opens the builder', state.widget,
    JSON.stringify(state).slice(0, 140));
ok('with the document open in it', state.courses === 129, String(state.courses));
ok('every course a row you can edit', state.rows === 129, String(state.rows));
ok('from the fictitious school', state.school === 'Ashford Meridian High School', String(state.school));
ok('and it remembers where it came from', /ashford/.test(state.source || ''), String(state.source));
ok('opened in Build, not in JSON', /authoring-edit/.test(state.mode), state.mode);
ok('with the document already checked', /course/.test(state.tally), state.tally);
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 200));
await page.screenshot({ path: OUT + '/cbld-link.png' });
await browser.close();
