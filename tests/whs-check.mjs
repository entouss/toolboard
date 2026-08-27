// Ad-hoc check of the user's own document. Not a repo fixture.
import { open, ok, finish, OUT } from './curr-lib.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOC = JSON.parse(fs.readFileSync(path.join(HERE, '..', 'learn', 'data') + '/westhaven-2026-2027.json', 'utf8'));

const { browser, page, errors } = await open({ doc: DOC, size: [1100, 760] });

ok('the document loads', await page.evaluate(() => document.querySelectorAll('.curr-course').length) === 280,
    String(await page.evaluate(() => document.querySelectorAll('.curr-course').length)));

// Every pathway title resolves to a course now.
const unresolved = await page.evaluate(() => {
    const data = currGetData('cur');
    const index = currTitleIndex(data);
    const out = [];
    (data.catalog.program_groupings || []).forEach(p => (p.groups || []).forEach(g =>
        (g.courses || []).forEach(t => { if (!currResolveTitle(index, t)) out.push(g.name + ' / ' + t); })));
    return out;
});
ok('every pathway course resolves to a course in the catalog', unresolved.length === 0, JSON.stringify(unresolved));

// The requirement rows are there and counting.
const rows = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.curr-totals .curr-req')).map(r => ({
        name: ((r.querySelector('.curr-req-name') || {}).textContent || '').trim(),
        num: ((r.querySelector('.curr-req-num') || {}).textContent || '').trim()
    })).filter(r => r.num));
console.log('  rows: ' + JSON.stringify(rows, null, 1));
ok('the seven subject requirements are shown', rows.filter(r => /\//.test(r.num)).length === 7,
    String(rows.filter(r => /\//.test(r.num)).length));
ok('and they add up to the 24 the chart states',
    rows.filter(r => /\//.test(r.num)).reduce((n, r) => n + parseFloat(r.num.split('/')[1]), 0) === 24,
    JSON.stringify(rows.map(r => r.num)));

// Place a few and see them counted where they belong.
const place = async (title, term) => page.evaluate(({ t, k }) => {
    const row = Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === t);
    if (!row) throw new Error('no row for ' + t);
    row.click();
    document.querySelector('.curr-cell[data-term="' + k + '"]').click();
}, { t: title, k: term });
for (const [t, k] of [['AICE United States History', '11-FY'], ['AICE Environmental Management', '10-FY'],
                      ['AICE Mathematics Pre-Calculus', '11-FY'], ['Pre-AICE Physical Education (HOPE)', '9-FY']]) {
    await place(t, k); await page.waitForTimeout(250);
}
const after = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.curr-totals .curr-req')).map(r =>
        (((r.querySelector('.curr-req-name') || {}).textContent || '') + ' = ' +
         ((r.querySelector('.curr-req-num') || {}).textContent || '')).trim()).filter(t => /=\s*\S/.test(t)));
console.log('  after placing: ' + JSON.stringify(after, null, 1));
ok('a placed history course counts towards Social Studies',
    after.some(t => /^Social Studies = 1.0 \/ 3.0/.test(t)), JSON.stringify(after));
ok('a placed science course counts towards Science',
    after.some(t => /^Science = 1.0 \/ 3.0/.test(t)), JSON.stringify(after));
ok('and the PE course counts towards Physical Education',
    after.some(t => /^Physical Education = 1.0 \/ 1.0/.test(t)), JSON.stringify(after));
ok('the AICE groups now count the history course',
    after.some(t => /Group 3.*= [2-9] of/.test(t)), JSON.stringify(after.filter(t => /Group/.test(t))));

await page.screenshot({ path: OUT + '/whs-check.png' });
await finish(browser, errors);
