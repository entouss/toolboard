// Both anonymized documents, loaded the way a person would load them.
import { open, ok, finish, OUT } from './curr-lib.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILES = [
    [path.join(HERE, '..', 'learn', 'data') + '/westhaven-2026-2027.json', 280, 'Westhaven High School'],
    [path.join(HERE, '..', 'learn', 'data') + '/ashford-2025-2026.json', 129, 'Ashford Meridian High School']
];
const GONE = /Western|Padura|McCarthy|mccarthy|Archbishop|Dilectione|Broward|Florida International/;

for (const [path, count, school] of FILES) {
    const DOC = JSON.parse(fs.readFileSync(path, 'utf8'));
    const { browser, page, errors } = await open({ doc: DOC, size: [1100, 760] });
    const name = school.split(' ')[0];

    ok(name + ': it loads', await page.evaluate(() =>
        document.querySelectorAll('.curr-course').length) === count, String(count));
    ok(name + ': the school is the fictitious one', await page.evaluate(() =>
        currGetData('cur').catalog.school.name) === school,
        await page.evaluate(() => currGetData('cur').catalog.school.name));
    ok(name + ': nothing on the page names the real school',
        !GONE.test(await page.evaluate(() => document.body.innerText)),
        (await page.evaluate(() => document.body.innerText)).slice(0, 80));
    ok(name + ': and nothing in the whole document does either',
        !GONE.test(JSON.stringify(DOC)));

    const rows = await page.evaluate(() => Array.from(document.querySelectorAll('.curr-totals .curr-req'))
        .map(r => ((r.querySelector('.curr-req-name') || {}).textContent || '').trim()).filter(Boolean));
    ok(name + ': the requirements came through', rows.length > 3, JSON.stringify(rows).slice(0, 160));
    ok(name + ': the tree and issues still draw', await page.evaluate(() => {
        currSetTab(document.querySelector('.curr-tab'), 'tree');
        const tree = !!document.querySelector('.curr-pane');
        currSetTab(document.querySelector('.curr-tab'), 'issues');
        return tree && !!document.querySelector('.curr-pane');
    }));
    ok(name + ': the picture is headed with the fictitious school',
        (await page.evaluate(() => currDocTitle(currGetData('cur').catalog) + ' · ' +
            (currGetData('cur').catalog.school || {}).name)).includes(school),
        await page.evaluate(() => currDocTitle(currGetData('cur').catalog)));
    ok(name + ': no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 120));
    await page.screenshot({ path: OUT + '/anon-' + name.toLowerCase() + '.png' });
    await browser.close();
}
console.log('done');
