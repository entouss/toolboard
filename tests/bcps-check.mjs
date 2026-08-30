// The elementary file, seen by both tools.
import { open as docOpen, ok, finish, check } from './cdoc-lib.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOC = JSON.parse(fs.readFileSync('' + path.join(HERE, '..', 'learn', 'data', 'braewood-elementary-2025-2026.json') + '', 'utf8'));

const { browser, page, errors } = await docOpen({ doc: DOC, size: [1100, 780] });
const r = await check(page);
console.log('  doctor: ' + r.errors + ' errors, ' + r.warnings + ' warnings, ' + r.courses + ' courses');
r.findings.filter(f => f.severity !== 'note').forEach(f => console.log('    ' + f.kind + ' — ' + f.message.slice(0, 110)));
ok('the doctor finds nothing structurally broken', r.errors === 0, String(r.errors));
ok('and reports the missing graduation requirements, which elementary has none of',
    r.findings.some(f => f.kind === 'no-requirements'));
ok('every prerequisite resolves', !r.findings.some(f => f.kind === 'prereq-unresolved'),
    JSON.stringify(r.findings.filter(f => f.kind === 'prereq-unresolved').map(f => f.message)));
ok('no title is used twice', !r.findings.some(f => f.kind === 'title-collision'));
await browser.close();

// And in the explorer, where the shape of the thing becomes obvious.
const { chromium } = await import('playwright');
const b2 = await chromium.launch({ channel: 'chrome' });
const p2 = await b2.newPage({ viewport: { width: 1300, height: 850 } });
const errs = [];
p2.on('pageerror', e => errs.push(e.message));
fs.writeFileSync(path.join(HERE, '..', 'learn', 'data') + '/.bcps-tmp.json', JSON.stringify(DOC));
await p2.goto('http://localhost:8777/index.html#tool/curriculum-explorer?curriculum=/learn/data/.bcps-tmp.json');
await p2.waitForSelector('.curr-widget', { timeout: 20000 });
await p2.waitForTimeout(3500);
const view = await p2.evaluate(() => {
    const id = document.querySelector('.curr-widget').closest('.tool').getAttribute('data-tool');
    const d = currGetData(id);
    const planner = currPlanner(d);
    return {
        courses: document.querySelectorAll('.curr-course').length,
        levels: planner.levels,
        rowNames: Array.from(document.querySelectorAll('.curr-year-head')).map(e => e.textContent.trim()),
        depts: Array.from(document.querySelectorAll('.curr-section-title')).map(e => e.textContent)
    };
});
console.log('  explorer: ' + JSON.stringify(view.rowNames));
ok('all 31 entries load', view.courses === 31, String(view.courses));
ok('the years run Kindergarten to Grade 5',
    view.rowNames[0].startsWith('Kindergarten') && view.rowNames.length === 6,
    JSON.stringify(view.rowNames));
ok('grouped by subject', view.depts.includes('Mathematics') && view.depts.includes('Science'),
    JSON.stringify(view.depts));
ok('no page errors', errs.length === 0, JSON.stringify(errs).slice(0, 200));
const shown = await p2.evaluate(() => document.body.innerText);
ok('nothing on the page names the real county', !/Broward/i.test(shown),
    (shown.match(/.{0,40}Broward.{0,40}/i) || ['clean'])[0]);
ok('and the fictitious one is what shows', /Braewood/.test(JSON.stringify(DOC)));
await p2.screenshot({ path: path.join(HERE, 'out', 'bcps.png') });
await b2.close();
fs.unlinkSync(path.join(HERE, '..', 'learn', 'data') + '/.bcps-tmp.json');
console.log('  page errors: ' + (errors.length ? JSON.stringify(errors) : 'none'));
