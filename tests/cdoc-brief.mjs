// The brief, and getting a document in.
import { open, ok, finish, OUT } from './cdoc-lib.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const BAD = JSON.parse(fs.readFileSync(path.join(HERE, 'out', 'ashford-before.json'), 'utf8'));
const { browser, page, errors } = await open({ doc: BAD, size: [1100, 780] });

const brief = await page.evaluate(() => cdocBrief(cdocGetData('doc')));
console.log('  brief: ' + brief.split('\n').length + ' lines, ' + brief.length + ' characters');

ok('the brief says what it is for', /correct this curriculum JSON/.test(brief), brief.slice(0, 60));
ok('and how many faults there are', /\d+ errors and \d+ warnings/.test(brief),
    (brief.match(/.*errors and.*/) || [])[0]);
ok('it explains that the paths are JSON pointers', /JSON pointers/.test(brief));
ok('every warning kind present is a section',
    /## PREREQUISITES NAMING NO COURSE/.test(brief) &&
    /## PREREQUISITE LINES TO READ YOURSELF/.test(brief), brief.slice(0, 40));
ok('each finding carries its path', /- \/courses\/\d+/.test(brief));
ok('and its suggestion where there is one',
    /Did you mean/.test(brief) || !/AICE/.test(brief));

// The one thing the tool refuses to decide, said plainly.
ok('it says not to guess the ambiguous prerequisite lines',
    /Do not guess these from the shape of the list/.test(brief));
ok('and says which way of being wrong is worse',
    /accept a plan that has\s*\n?\s*not met the prerequisite, and say nothing, which is worse/.test(brief),
    (brief.match(/which is worse[\s\S]{0,20}/) || [])[0]);
ok('it forbids inventing courses', /Do not invent courses/.test(brief));
ok('it points at title_variants rather than renaming', /title_variants/.test(brief));
ok('and protects the course codes', /Do not change course codes/.test(brief));

// Pressing the button.
await page.evaluate(() => document.querySelector('.cdoc-score button').click());
await page.waitForTimeout(600);
const status = await page.evaluate(() => document.querySelector('.cdoc-status').textContent);
ok('the button reports what it copied', /Repair brief copied — \d+ lines/.test(status), status);

// A document that cannot be parsed is what this tool is for, so it says so plainly.
await page.evaluate(() => setToolMode('doc', 'split'));
await page.waitForTimeout(400);
await page.evaluate(() => {
    document.querySelector('.cdoc-json').value = '{ "courses": [ }';
    cdocLoadSource(document.querySelector('.cdoc-json'));
});
await page.waitForTimeout(500);
ok('a document that will not parse is reported, not swallowed',
    /cannot be read at all/.test(await page.evaluate(() =>
        document.querySelector('.cdoc-status').textContent)),
    await page.evaluate(() => document.querySelector('.cdoc-status').textContent));

// An edit that has not been checked yet survives a reload.
await page.evaluate(() => {
    const box = document.querySelector('.cdoc-json');
    box.value = '{ "courses": [ { "course_code": "Z", "title": "Kept" } ] }';
    cdocDraftChanged(box);
});
await page.waitForTimeout(900);
await page.reload();
await page.waitForSelector('.tool[data-tool="doc"] .cdoc-widget');
await page.waitForTimeout(800);
ok('an unchecked edit is still there after a reload',
    /"title": "Kept"/.test(await page.evaluate(() => document.querySelector('.cdoc-json').value)),
    (await page.evaluate(() => document.querySelector('.cdoc-json').value)).slice(0, 50));

fs.writeFileSync(OUT + '/cdoc-brief.txt', brief);
await finish(browser, errors);
