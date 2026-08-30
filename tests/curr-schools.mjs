// A career is several schools. Each one behaves as the tool always has; what joins
// them is the order they were attended and what transferred between them.
import fs from 'node:fs';
import path from 'node:path';
import { open, ok, finish, stored, record, sourcePane, OUT } from './curr-lib.mjs';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const middle = JSON.parse(fs.readFileSync(
    path.join(HERE, '..', 'learn', 'data', 'ironridge-2026-2027.json'), 'utf8'));

const { browser, page, errors } = await open({ size: [1150, 780] });

// 1. One document is still one school, and it is named after itself.
let rec = await record(page);
ok('an existing tool became a record of one school', rec.schools.length === 1,
    JSON.stringify(Object.keys(rec)));
// The name is derived on read rather than stored, so a school added before its
// document arrives is still named the moment it does.
ok('named from the document', await page.evaluate(() =>
    /Sample High School/.test(currSchoolName(currGetData('cur')))),
    await page.evaluate(() => currSchoolName(currGetData('cur'))));
ok('without freezing that name into storage', rec.schools[0].name === '', rec.schools[0].name);
ok('and its plan came through untouched', !!(await stored(page)).catalog);

// 2. Add a second school and load a document into it.
await sourcePane(page);
await page.click('.curr-schools .curr-btn');
await page.waitForTimeout(600);
rec = await record(page);
ok('adding a school selects it', rec.schools.length === 2 && rec.current === rec.schools[1].id);
ok('and it starts with no document', (await stored(page)).catalog === null);

await page.evaluate((doc) => {
    document.querySelector('.curr-json').value = JSON.stringify(doc);
    currLoadSource(document.querySelector('.curr-widget .curr-source-actions .curr-btn'));
}, middle);
await page.waitForTimeout(900);
ok('loading fills the school that is showing',
    /Iron Ridge/.test(((await stored(page)).catalog.school || {}).name || ''),
    ((await stored(page)).catalog.school || {}).name);
ok('and takes its name from the document it was given', await page.evaluate(() =>
    /Iron Ridge/.test(currSchoolName(currGetData('cur')))),
    await page.evaluate(() => currSchoolName(currGetData('cur'))));
ok('the other school kept its own document', await page.evaluate(() =>
    /Sample High/.test((currGetRecord('cur').schools[0].catalog.school || {}).name)));

// 3. The dropdown orders by the grades each school covers, so a career reads forwards.
const options = await page.evaluate(() =>
    [...document.querySelectorAll('.curr-school-pick option')].map(o => o.textContent));
ok('the dropdown lists both schools and the career', options.length === 3, options.join(' | '));
ok('earliest school first', /Iron Ridge/.test(options[0]), options[0]);
ok('the career is the last entry', /Whole career/.test(options[2]), options[2]);

// 4. Switching keeps each school's own state.
await page.selectOption('.curr-school-pick', { index: 1 });
await page.waitForTimeout(700);
ok('switching shows the other school', await page.evaluate(() =>
    /Sample High/.test((currGetData('cur').catalog.school || {}).name)));
await page.evaluate(() => {
    const data = currGetData('cur');
    data.ui.search = 'algebra';
    currSaveData('cur', data);
});
await page.selectOption('.curr-school-pick', { index: 0 });
await page.waitForTimeout(700);
ok('and each keeps its own filters', (await stored(page)).ui.search === '');
await page.selectOption('.curr-school-pick', { index: 1 });
await page.waitForTimeout(700);
ok('which come back on the way in', (await stored(page)).ui.search === 'algebra');

// 5. Grades attended decide the rows, which is how two high schools split 9-12.
await page.evaluate(() => {
    const rec = currGetRecord('cur');
    const high = rec.schools.find(s => /Sample High/.test((s.catalog.school || {}).name));
    high.grades = [11, 12];
    high.years = '2026-2028';
    currSaveRecord('cur', rec);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(700);
const years = await page.evaluate(() =>
    [...document.querySelectorAll('.curr-year-head b')].map(b => b.textContent));
ok('a school given two grades shows two years', years.length === 2, years.join(', '));
ok('starting at the grade it was given', years[0] === 'Grade 11', years[0]);
const when = await page.evaluate(() =>
    [...document.querySelectorAll('.curr-year-when')].map(b => b.textContent));
ok('and each row carries its academic year', when.join(' ') === '2026–27 2027–28', when.join(' '));

// 6. The career page.
await page.selectOption('.curr-school-pick', { value: '__career__' });
await page.waitForTimeout(900);
ok('the career page lists every school',
    (await page.$$('.curr-career-school')).length === 2);
ok('in the order they were attended', await page.evaluate(() =>
    /Iron Ridge/.test(document.querySelector('.curr-career-head b').textContent)));
ok('and says it is a record, not a plan',
    (await page.textContent('.curr-career')).includes('a record, not a plan'));
ok('the catalog and grid are not on this page', !(await page.$('.curr-catalog')));

// 7. It survives a reload, on whichever page you left it.
await page.reload();
await page.waitForSelector('.curr-widget', { timeout: 15000 });
await page.waitForTimeout(900);
ok('the record survived the reload', (await record(page)).schools.length === 2);
ok('on the page it was left on', !!(await page.$('.curr-career')));

await page.screenshot({ path: OUT + '/curr-schools.png' });
await finish(browser, errors);
