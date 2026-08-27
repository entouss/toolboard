// Does the arts requirement now count what the chart says it counts?
import { open, ok, finish, OUT } from './curr-lib.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOC = JSON.parse(fs.readFileSync(path.join(HERE, '..', 'learn', 'data') + '/westhaven-2026-2027.json', 'utf8'));
const { browser, page, errors } = await open({ doc: DOC, size: [1100, 760] });

const row = () => page.evaluate(() => {
    const r = Array.from(document.querySelectorAll('.curr-totals .curr-req'))
        .find(x => /Fine or Performing/.test((x.querySelector('.curr-req-name') || {}).textContent || ''));
    return ((r.querySelector('.curr-req-num') || {}).textContent || '').trim();
});
const place = async (title, term) => { await page.evaluate(({ t, k }) => {
    const r = Array.from(document.querySelectorAll('.curr-course'))
        .find(x => x.querySelector('.curr-course-title').textContent === t);
    if (!r) throw new Error('no row for ' + t);
    r.click();
    document.querySelector('.curr-cell[data-term="' + k + '"]').click();
}, { t: title, k: term }); await page.waitForTimeout(300); };

ok('nothing counts towards it yet', (await row()) === '0.0 / 1.0', await row());

// The chart's line names three kinds of course. Each one has to reach the row.
await place('Ceramics/Pottery 2', '9-FY');
ok('a fine arts course counts', (await row()) === '1.0 / 1.0', await row());
await place('Ceramics/Pottery 2', '10-FY');

await page.evaluate(() => { currUpdate(document.querySelector('.curr-widget'), d => { d.plan = {}; }); });
await page.waitForTimeout(300);
await place('Debate I Honors', '9-FY');
ok('a debate course counts', (await row()) === '1.0 / 1.0', await row());

await page.evaluate(() => { currUpdate(document.querySelector('.curr-widget'), d => { d.plan = {}; }); });
await page.waitForTimeout(300);
await place('Culinary Arts 1', '9-FY');
ok('a practical arts course counts', (await row()) === '1.0 / 1.0', await row());

// And the filter finds them, which is how you go looking in the first place.
const found = await page.evaluate(() => {
    const sel = Array.from(document.querySelectorAll('.curr-filters select'))
        .find(s => Array.from(s.options).some(o => /Practical/i.test(o.textContent)));
    if (!sel) return { option: null };
    const opt = Array.from(sel.options).find(o => /Practical/i.test(o.textContent));
    sel.value = opt.value;
    currSetFilter(sel, 'flag');
    return { option: opt.textContent };
});
await page.waitForTimeout(500);
const shown = await page.evaluate(() => document.querySelectorAll('.curr-course').length);
ok('the catalog can filter to them', found.option !== null, JSON.stringify(found));
ok('and finds all 88', shown === 88, shown + ' shown');
ok('the PDF button agrees', /88 courses/.test(await page.evaluate(() =>
    document.querySelector('.curr-catalog-foot button').textContent)),
    await page.evaluate(() => document.querySelector('.curr-catalog-foot button').textContent));

await page.screenshot({ path: OUT + '/whs-arts.png' });
await finish(browser, errors);
