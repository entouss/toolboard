// An edit in the JSON pane is work, and work has to survive a reload.
import { open, bar, sourcePane, ok, finish, stored, OUT } from './curr-lib.mjs';

const DOC = {
    school: { name: 'Sample High School' },
    guide: { title: 'First Title', academic_year: '2026-2027' },
    courses: [{ course_code: '1', title: 'A course', department: 'Maths', credits: 1,
        grade_levels: [9], semester_offered: 'Full Year',
        prerequisites: { raw: null, courses: [], grade_requirements: [] } }]
};
const { browser, page, errors } = await open({ doc: DOC, plan: { '9-FY': ['1'] } });

const pane = () => page.evaluate(() => document.querySelector('.curr-json').value);
const status = () => page.evaluate(() => document.querySelector('.curr-status').textContent);
const docTitle = () => page.evaluate(() => currDocTitle(currGetData('cur').catalog));
const type = async (text) => {
    await page.evaluate((t) => {
        const box = document.querySelector('.curr-json');
        box.value = t;
        box.dispatchEvent(new Event('input', { bubbles: true }));
    }, text);
    await page.waitForTimeout(700);
};
const edited = JSON.stringify(Object.assign({}, DOC,
    { guide: { title: 'Second Title', academic_year: '2026-2027' } }), null, 2);

// 1. The pane opens showing the document that is loaded.
ok('the pane shows the loaded document', /First Title/.test(await pane()), (await pane()).slice(0, 40));

// 2. Typing is kept, and said to be kept.
await type(edited);
ok('an edit is remembered', (await stored(page)).draft === edited, JSON.stringify(((await stored(page)).draft || '').slice(0, 30)));
ok('and the tool says it is not applied yet', /press Load to apply/.test(await status()), await status());
ok('the loaded document is untouched until then', (await docTitle()) === 'First Title', await docTitle());

// 3. The edit survives a reload — this is the thing that was being lost.
await page.reload();
await page.waitForSelector('.tool[data-tool="cur"] .curr-widget');
await page.waitForTimeout(800);
ok('the edit is still there after a reload', (await pane()) === edited, (await pane()).slice(0, 40));
ok('and the tool explains what it is', /had not loaded yet/.test(await status()), await status());
ok('while the plan is still the one built on the old document',
    JSON.stringify((await stored(page)).plan['9-FY']) === '["1"]');

// 4. Loading it makes it the document, and the draft goes.
await sourcePane(page);
await page.click('.curr-source-actions button:has-text("Load")');
await page.waitForTimeout(400);
await page.click('.curr-source-actions button:has-text("Replace?")');
await page.waitForTimeout(500);
ok('loading applies the edit', (await docTitle()) === 'Second Title', await docTitle());
ok('and the draft is dropped once it is the document', !(await stored(page)).draft,
    JSON.stringify((await stored(page)).draft));
await page.reload();
await page.waitForSelector('.tool[data-tool="cur"] .curr-widget');
await page.waitForTimeout(800);
ok('after that a reload shows the document, not a draft', /Second Title/.test(await pane()));
ok('with nothing to explain', (await status()).trim() === '', JSON.stringify(await status()));

// 5. Typing the document back as it is leaves no draft to restore.
await type((await pane()) + '');
ok('text identical to the document is not kept as an edit', !(await stored(page)).draft,
    JSON.stringify((await stored(page)).draft));
await type('');
ok('and neither is an empty box', !(await stored(page)).draft);

// 6. An edit that is not valid JSON is still kept — half-typed work is work.
await type('{ "courses": [ { "course_code": "1", ');
ok('a half-written edit is kept too', /"courses"/.test((await stored(page)).draft || ''),
    JSON.stringify(((await stored(page)).draft || '').slice(0, 30)));
await page.reload();
await page.waitForSelector('.tool[data-tool="cur"] .curr-widget');
await page.waitForTimeout(800);
ok('and comes back after a reload', /"course_code"/.test(await pane()), (await pane()).slice(0, 40));
await sourcePane(page);
await page.click('.curr-source-actions button:has-text("Load")');
await page.waitForTimeout(500);
ok('trying to load it says what is wrong', /not valid JSON/.test(await status()), (await status()).slice(0, 60));
ok('and the edit is still in the box to fix', /"course_code"/.test(await pane()));

await page.screenshot({ path: OUT + '/curr-draft.png' });
await finish(browser, errors);
