// A first-time visitor following the "try it" link: no plugin installed, no tool.
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

await page.goto('http://localhost:8777/index.html#tool/curriculum-explorer?curriculum=learn/data/westhaven-2026-2027.json');
await page.waitForTimeout(6000);
const state = await page.evaluate(() => {
    const t = document.querySelector('.tool .curr-widget');
    const tool = t ? t.closest('.tool') : null;
    return {
        widget: !!t,
        courses: document.querySelectorAll('.curr-course').length,
        status: (document.querySelector('.curr-status') || {}).textContent || '',
        school: (window.currGetData && tool) ?
            ((currGetData(tool.getAttribute('data-tool')).catalog || {}).school || {}).name : null,
        maximized: tool ? tool.className : ''
    };
});
ok('the link installs the plugin and opens the tool', state.widget, JSON.stringify(state).slice(0, 120));
ok('and loads all 280 courses', state.courses === 280, String(state.courses));
ok('from the fictitious school', state.school === 'Westhaven High School', String(state.school));
ok('saying where it came from', /courses loaded from/.test(state.status), state.status.slice(0, 70));
ok('with the tool opened full screen', /fullscreen|maximized/.test(state.maximized), state.maximized);
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 200));
await page.screenshot({ path: OUT + '/deeplink.png' });
await browser.close();
