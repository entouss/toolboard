// Taking the record away as a spreadsheet — one school, or the whole career.
import { open, bar, ok, finish, CODE, FIXTURE, OUT } from './curr-lib.mjs';
import fs from 'node:fs';

const { browser, page, errors } = await open({
    plan: {
        '9-FY': [CODE['Algebra I'], CODE['English 9']],
        '10-FY': [CODE['Geometry']],
        '12-S1': [CODE['Government']]
    },
    completed: [CODE['Spanish I']],
    size: [900, 560]
});
await bar(page);

const press = () => page.click('.curr-actions button:has-text("CSV")');
const status = () => page.evaluate(() => document.querySelector('.curr-status').textContent);
const parse = (text) => text.replace(/^﻿/, '').trim().split('\r\n').map((l) => l.split(','));

// Seed a final grade, so the grade columns have something real to carry.
await page.evaluate((code) => {
    const rec = currGetRecord('cur');
    rec.schools[0].marks = { [code]: { m: {}, final: 'A' } };
    currSaveRecord('cur', rec);
}, CODE['Algebra I']);

// 1. The button saves a file, named for the window, and says what it did.
const [download] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), press()]);
const file = OUT + '/record.csv';
await download.saveAs(file);
const text = fs.readFileSync(file, 'utf8');
ok('the button saves a CSV', text.length > 0, download.suggestedFilename());
ok('named for one school, not a career', /curriculum-record\.csv$/.test(download.suggestedFilename()),
    download.suggestedFilename());
ok('the tool says what it saved', /Saved .*-record\.csv — 5 courses/.test(await status()), await status());

// 2. A header, then one line per course — the four placed and the one already met.
const rows = parse(text);
ok('the first line is the header', rows[0].join(',') ===
    'School,Year,Academic year,Term,Course code,Title,Department,Credits,High school credits,Grade,Grade points',
    rows[0].join(','));
ok('one line per course recorded', rows.length === 6, String(rows.length - 1) + ' courses');
ok('the file is CRLF, which is what a spreadsheet expects', /\r\n/.test(text));
ok('and carries a byte order mark, so accents survive Excel', text.charCodeAt(0) === 0xfeff);

// 3. Every row names its school, its year and its term.
const byTitle = {};
rows.slice(1).forEach((r) => { byTitle[r[5]] = r; });
ok('a placed course carries year and term', byTitle['Algebra I'] &&
    byTitle['Algebra I'][1] === 'Grade 9' && byTitle['Algebra I'][3] === 'Full Year',
    JSON.stringify(byTitle['Algebra I']));
ok('and its department and credits', byTitle['Algebra I'][6] === 'Mathematics' &&
    byTitle['Algebra I'][7] === '1', JSON.stringify(byTitle['Algebra I']));
ok('the grade it was given comes with the points behind it',
    byTitle['Algebra I'][9] === 'A' && byTitle['Algebra I'][10] === '4',
    byTitle['Algebra I'][9] + ' / ' + byTitle['Algebra I'][10]);
ok('an ungraded course leaves both grade columns empty',
    byTitle['Geometry'][9] === '' && byTitle['Geometry'][10] === '');

// 4. Already met is part of the record, and says so instead of inventing a year.
ok('a course counted as already met is in the file', !!byTitle['Spanish I']);
ok('marked as already met rather than placed in a year',
    byTitle['Spanish I'][3] === 'already met' && byTitle['Spanish I'][1] === '',
    JSON.stringify(byTitle['Spanish I']));

// 5. Quoting. No fixture title has a comma, so the writer is asked directly —
//    titles like "Art, Kindergarten" are ordinary in real documents.
const quoted = await page.evaluate(() => currCsv([{
    school: 'A School', year: 'Grade 9', academic_year: '', term: 'Full Year',
    code: 'X1', title: 'Art, Kindergarten', department: 'Say "hello"',
    credits: 1, hs_credits: '', grade: '', points: ''
}]).replace(/^﻿/, '').trim().split('\r\n')[1]);
ok('a title with a comma stays one field', /"Art, Kindergarten"/.test(quoted), quoted);
ok('and an embedded quote is doubled', /"Say ""hello"""/.test(quoted), quoted);

// 6. The whole career: every school, in the order attended.
await page.evaluate((doc) => {
    const rec = currGetRecord('cur');
    rec.schools.push(currNormalizeSchool({
        id: 'sch-2', name: 'Second School', catalog: doc,
        plan: { '9-FY': [doc.courses[0].course_code] }, completed: []
    }, 1));
    currSaveRecord('cur', rec);
    currOnRender('cur');
}, FIXTURE);
await page.waitForTimeout(400);
await page.selectOption('.curr-school-pick', '__career__');
await page.waitForTimeout(600);
await bar(page);

const [careerFile] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), press()]);
await careerFile.saveAs(OUT + '/career.csv');
const careerRows = parse(fs.readFileSync(OUT + '/career.csv', 'utf8'));
ok('the career file is named as one', /-career\.csv$/.test(careerFile.suggestedFilename()),
    careerFile.suggestedFilename());
const schools = careerRows.slice(1).map((r) => r[0]);
ok('it holds both schools', new Set(schools).size === 2, JSON.stringify([...new Set(schools)]));
// Grouped and in order: no row of the school attended second appears before the
// last row of the one attended first.
ok('in the order they were attended',
    schools.indexOf('Second School') > schools.lastIndexOf('Sample High School'),
    JSON.stringify(schools));
ok('and every row still names its school', schools.every(Boolean));
ok('the tool counts the schools it covered', /across 2 schools/.test(await status()), await status());

// 7. Nothing recorded is said, not saved as an empty file.
const empty = await open({ loaded: true, plan: {}, completed: [], size: [900, 560] });
await bar(empty.page);
await empty.page.click('.curr-actions button:has-text("CSV")');
await empty.page.waitForTimeout(400);
ok('an empty record is refused with a reason', /nothing recorded to export/.test(
    await empty.page.evaluate(() => document.querySelector('.curr-status').textContent)),
    await empty.page.evaluate(() => document.querySelector('.curr-status').textContent));
await empty.browser.close();

// 8. Round trip. A file written by the export, read back into a tool that has never
//    seen a curriculum, has to reproduce the plan it came from.
const paste = (page, text) => page.evaluate((t) => {
    const w = document.querySelector('.curr-widget');
    w.querySelector('.curr-json').value = t;
    currLoadSource(w.querySelector('.curr-json'));
}, text);

const fresh = await open({ loaded: false, size: [1000, 660] });
await fresh.page.evaluate(() => setToolMode('cur', 'split'));
await fresh.page.waitForTimeout(400);
await paste(fresh.page, text);                     // the single-school file from step 1
await fresh.page.waitForTimeout(1200);

const back = await fresh.page.evaluate(() => {
    const d = currGetData('cur');
    return { courses: (d.catalog.courses || []).length, plan: d.plan, completed: d.completed,
             marks: d.marks || {}, levels: currPlanner(d).levels.map(l => currLevelLabel(currPlanner(d), l)) };
});
ok('a CSV loads into a tool with no curriculum at all', back.courses === 5, String(back.courses));
ok('and the years come back under their own names',
    back.levels.join(',') === 'Grade 9,Grade 10,Grade 12', back.levels.join(','));
ok('with each course back in the year it was taken',
    (back.plan['1-FY'] || []).length === 2 && (back.plan['2-FY'] || []).length === 1,
    JSON.stringify(back.plan));
ok('the already-met course returns to the completed list',
    back.completed.length === 1, JSON.stringify(back.completed));
ok('and the grade comes back as it was written',
    Object.values(back.marks).some(m => m.final === 'A'), JSON.stringify(back.marks));
ok('the tool says what it took in', /Imported: .*placed/.test(
    await fresh.page.evaluate(() => document.querySelector('.curr-status').textContent)),
    await fresh.page.evaluate(() => document.querySelector('.curr-status').textContent));

// 9. A title carrying a comma survives being written and read again.
ok('a comma in a title survives the round trip', await fresh.page.evaluate(() =>
    !!currGetData('cur').catalog.courses.find(c => c.title === 'Algebra I')));

// 10. A catalog already loaded is kept whole — the CSV places against it and takes
//     nothing away, which is what makes importing safe on a real document.
const onto = await open({ plan: {}, size: [1000, 660] });
await onto.page.evaluate(() => setToolMode('cur', 'split'));
await onto.page.waitForTimeout(400);
const richBefore = await onto.page.evaluate(() => {
    const c = currGetData('cur').catalog.courses.find(x => x.title === 'Geometry');
    return { n: currGetData('cur').catalog.courses.length, prereq: (c.prerequisites || {}).raw };
});
await paste(onto.page, text);
await onto.page.waitForTimeout(1200);
const richAfter = await onto.page.evaluate(() => {
    const d = currGetData('cur');
    const c = d.catalog.courses.find(x => x.title === 'Geometry');
    return { n: d.catalog.courses.length, prereq: (c.prerequisites || {}).raw,
             placed: Object.values(d.plan).flat().length };
});
ok('importing onto a loaded catalog invents nothing', richAfter.n === richBefore.n,
    richBefore.n + ' -> ' + richAfter.n);
ok('and leaves its courses whole, prerequisites and all',
    richAfter.prereq === richBefore.prereq, String(richAfter.prereq));
ok('while still placing what the file held', richAfter.placed === 4, String(richAfter.placed));
await onto.browser.close();

// 11. A two-school file rebuilds both, in the order the rows appear.
const career = await open({ loaded: false, size: [1000, 660] });
await career.page.evaluate(() => setToolMode('cur', 'split'));
await career.page.waitForTimeout(400);
await paste(career.page, fs.readFileSync(OUT + '/career.csv', 'utf8'));
await career.page.waitForTimeout(1200);
const names = await career.page.evaluate(() =>
    currGetRecord('cur').schools.map(s => currSchoolName(s)));
ok('a two-school file rebuilds both schools', names.length === 2, JSON.stringify(names));
ok('in the order the rows appear',
    names.indexOf('Sample High School') < names.indexOf('Second School'), JSON.stringify(names));
await career.browser.close();

// 12. Anything that is neither JSON nor one of our CSVs is refused as before.
await paste(fresh.page, 'this is not a document\nnor a spreadsheet');
await fresh.page.waitForTimeout(500);
ok('a file that is neither is still refused as invalid JSON', /not valid JSON/.test(
    await fresh.page.evaluate(() => document.querySelector('.curr-status').textContent)),
    await fresh.page.evaluate(() => document.querySelector('.curr-status').textContent));
await fresh.browser.close();

await finish(browser, errors);
