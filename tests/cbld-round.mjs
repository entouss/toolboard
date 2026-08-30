// The one that matters: a real catalog opened here and written back out must be
// the same document. A builder that quietly drops the fields its form has never
// heard of is not safe to open anyone's curriculum with.
import fs from 'node:fs';
import path from 'node:path';
import { open, ok, finish, written, REPO } from './cbld-lib.mjs';

const file = path.join(REPO, 'learn', 'data', 'westhaven-2026-2027.json');
const source = JSON.parse(fs.readFileSync(file, 'utf8'));
const { browser, page, errors } = await open({ doc: null });

// Opened the way a person opens one: pasted in, not seeded into storage.
await page.evaluate((text) => {
    document.querySelector('.cbld-import').value = text;
    cbldImport(document.querySelector('.cbld-widget .curr-btn[onclick*="cbldImport"]'));
}, JSON.stringify(source));
await page.waitForTimeout(900);

const back = await written(page);
ok('every course came through', back.courses.length === source.courses.length,
    back.courses.length + ' of ' + source.courses.length);
ok('the document is unchanged', JSON.stringify(back) === JSON.stringify(source));

const text = await page.evaluate(() => cbldJson(cbldGetData('bld').catalog));
ok('the fields no form shows are still there',
    text.includes('title_variants') && text.includes('credits_basis'));

// The reading copy is where the defaults and the stamps go. They must not reach the
// file — checked on a catalog that does not already carry them. (Westhaven does: it
// was published straight out of the explorer.)
const clean = JSON.parse(fs.readFileSync(path.join(REPO, 'learn', 'data', 'ashford-2025-2026.json'), 'utf8'));
await page.evaluate((doc) => {
    const widget = document.querySelector('.cbld-widget');
    cbldOpenDoc(widget, 'bld', doc);
}, clean);
await page.waitForTimeout(600);
const second = await page.evaluate(() => cbldJson(cbldGetData('bld').catalog));
ok('nothing normalised leaked in', !second.includes('normalized_by_explorer') &&
    !second.includes('department_printed'));
ok('and that document is unchanged too', JSON.parse(second).courses.length === clean.courses.length &&
    second === JSON.stringify(clean, null, 2));

// Back to the first document for the edit check.
await page.evaluate((doc) => {
    cbldOpenDoc(document.querySelector('.cbld-widget'), 'bld', doc);
}, source);
await page.waitForTimeout(600);

// One edit, and only that edit.
await page.evaluate(() => {
    const data = cbldGetData('bld');
    data.ui.selected = 4;
    cbldSaveData('bld', data);
    cbldRender(document.querySelector('.cbld-widget'));
});
await page.waitForTimeout(300);
await page.fill('.cbld-form input[oninput*="courses.4.title"]', 'Renamed Course');
await page.waitForTimeout(700);
const edited = await written(page);
const before = JSON.parse(JSON.stringify(source));
before.courses[4].title = 'Renamed Course';
ok('an edit changes one field and nothing else',
    JSON.stringify(edited) === JSON.stringify(before));

await finish(browser, errors);
