// Getting a curriculum document into the tool, and what it says when the document
// is not one.
import { open, bar, sourcePane, ok, finish, stored, FIXTURE, OUT } from './curr-lib.mjs';

const { browser, page, errors } = await open({ loaded: false });

const state = () => page.evaluate(() => ({
    status: document.querySelector('.curr-status').textContent,
    kind: document.querySelector('.curr-status').className,
    courses: document.querySelectorAll('.curr-course').length,
    empty: (document.querySelector('.curr-explorer') || {}).textContent || '',
    mode: document.querySelector('.tool[data-tool="cur"]').className
}));
const paste = async (text) => {
    await page.evaluate((t) => {
        document.querySelector('.curr-json').value = t;
        currLoadSource(document.querySelector('.curr-json'));
    }, text);
    await page.waitForTimeout(400);
};

// 1. An empty tool says what to do rather than showing an empty box.
const fresh = await state();
ok('a new tool opens on the JSON pane', /authoring-edit/.test(fresh.mode), fresh.mode);
ok("and the explorer says where to start", /No curriculum loaded yet/.test(fresh.empty), fresh.empty.slice(0, 60));

// 2. Nothing pasted.
await paste('');
ok('loading nothing is refused politely', /Nothing to load/.test((await state()).status));

// 3. Not JSON at all — the parser's own words, so it can be found.
await paste('{ "courses": [ }');
const broken = await state();
ok('malformed JSON is reported as malformed', /not valid JSON/.test(broken.status), broken.status.slice(0, 70));
ok('and it is shown as an error', /err/.test(broken.kind));

// 4. JSON, but not a curriculum.
await paste('{"school":{"name":"x"}}');
ok('a document with no courses says so', /No courses/.test((await state()).status));
await paste('[1,2,3]');
ok('an array is not a document either', /JSON object/.test((await state()).status));

// 5. Only what a course cannot be planned without is required. A document that
//    never mentions terms or levels — a college catalog might not — still loads.
await paste(JSON.stringify({ courses: [
    { course_code: '1', title: 'Fine', department: 'Maths', grade_levels: [9], semester_offered: 'Full Year', credits: 1 },
    { course_code: '2', title: 'No term named', department: 'Maths', grade_levels: [9], credits: 1 },
    { course_code: '3', title: 'A term of its own', department: 'Maths', credits: 1, semester_offered: 'Whenever' }
] }));
const loose = await state();
ok('a course with no term and no levels is allowed', loose.courses === 3, JSON.stringify(loose.status));
ok('and a term the tool has never heard of is simply a term',
    await page.evaluate(() => Array.from(document.querySelectorAll('.curr-grid-head span'))
        .map(e => e.textContent).includes('Whenever')),
    await page.evaluate(() => Array.from(document.querySelectorAll('.curr-grid-head span')).map(e => e.textContent).join(',')));

// 5b. What is required is what identifies a course.
await paste(JSON.stringify({ courses: [
    { course_code: '1', title: 'Fine' },
    { course_code: '2' },
    { title: 'No code' }
] }));
const missing = await state();
ok('a course with no title is named as the problem', /course 2 \(2\): no title/.test(missing.status),
    missing.status.replace(/\n/g, ' | '));
ok('and one with no code too', /course 3: no course_code/.test(missing.status), missing.status.replace(/\n/g, ' | '));
// A document that will not load must not take the loaded one with it.
ok('and the document already loaded is left alone', missing.courses === 3, String(missing.courses));

// 6. A duplicated course code.
await paste(JSON.stringify({ courses: [
    { course_code: '7', title: 'One', department: 'M', grade_levels: [9], semester_offered: 'Full Year', credits: 1 },
    { course_code: '7', title: 'Two', department: 'M', grade_levels: [9], semester_offered: 'Full Year', credits: 1 }
] }));
ok('a course code used twice is caught', /used twice/.test((await state()).status));

// 7. The real document.
await paste(JSON.stringify(FIXTURE));
const good = await state();
ok('a good document loads', good.courses === 47, good.courses + ' rows');
ok('it says how many courses it found', /47 courses loaded/.test(good.status), good.status);
ok('and it switches to the explorer', /authoring-render/.test(good.mode), good.mode);
ok('the catalog is what got saved', (await stored(page)).catalog.courses.length === 47);

// 8. The sample, for someone who has no document yet. A document is loaded by now,
//    so the first press asks before throwing it away.
await sourcePane(page);
await page.click('.curr-source-actions button:has-text("Sample")');
await page.waitForTimeout(400);
ok('Sample asks before replacing a loaded document', /would replace the document/.test((await state()).status),
    (await state()).status.slice(0, 60));
await page.click('.curr-source-actions button:has-text("Replace?")');
await page.waitForTimeout(400);
const sample = await state();
ok('the sample button fills the tool', sample.courses === 12, sample.courses + ' rows');
ok('and says the sample is a stand-in', /Replace them with your own/.test(sample.status));

// 9. A file, dropped or picked.
import fs from 'node:fs';
fs.writeFileSync(OUT + '/curr-upload.json', JSON.stringify(FIXTURE));
await page.setInputFiles('.curr-file input[type=file]', OUT + '/curr-upload.json');
await page.waitForTimeout(700);
const uploaded = await state();
ok('a picked file loads the same way', uploaded.courses === 47, uploaded.courses + ' rows');

// 10. And it all survives a reload, with the JSON pane refilled from what was kept.
await page.reload();
await page.waitForSelector('.tool[data-tool="cur"] .curr-widget');
await page.waitForTimeout(800);
const back = await page.evaluate(() => ({
    courses: document.querySelectorAll('.curr-course').length,
    json: document.querySelector('.curr-json').value.length
}));
ok('the document is still there after a reload', back.courses === 47, JSON.stringify(back));
ok('and the JSON pane shows it again', back.json > 1000, back.json + ' characters');

await page.screenshot({ path: OUT + '/curr-load.png' });
await finish(browser, errors);
