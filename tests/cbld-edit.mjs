// Building a curriculum from nothing, and editing one that exists.
import { open, ok, finish, written, bar, OUT } from './cbld-lib.mjs';
const { browser, page, errors } = await open({ doc: null });

ok('an empty tool offers a way in', (await page.textContent('.cbld-start')).includes('No curriculum yet'));
ok('and writes nothing yet', (await page.textContent('.cbld-out')).includes('Nothing written yet'));

await page.click('.cbld-start .curr-btn:has-text("Start an empty curriculum")');
await page.waitForTimeout(500);
let doc = await written(page);
ok('New starts a document with a shape', Array.isArray(doc.courses) && doc.courses.length === 0 &&
    doc.planner.levels.join() === '9,10,11,12');
ok('and the list says so', (await page.textContent('.cbld-list')).includes('No courses yet'));

await page.click('.cbld-list-bar .curr-btn');
await page.waitForTimeout(400);
doc = await written(page);
ok('Add course adds one', doc.courses.length === 1 && doc.courses[0].course_code === 'NEW1');
ok('and opens it for editing', !!(await page.$('.cbld-form input[oninput*="courses.0.title"]')));

await page.fill('.cbld-form input[oninput*="courses.0.title"]', 'Algebra I');
await page.fill('.cbld-form input[oninput*="courses.0.department"]', 'Mathematics');
await page.fill('.cbld-form input[oninput*="courses.0.credits"]', '1');
await page.waitForTimeout(600);
doc = await written(page);
ok('typing writes the field', doc.courses[0].title === 'Algebra I');
ok('a number is written as a number', doc.courses[0].credits === 1);
ok('the row in the list followed', (await page.textContent('.cbld-crow[data-i="0"]')).includes('Algebra I'));
ok('and so did the JSON pane', (await page.textContent('.cbld-json')).includes('"Algebra I"'));

// Emptying a field takes the key out rather than leaving "" behind.
await page.fill('.cbld-form input[oninput*="courses.0.department"]', '');
await page.waitForTimeout(600);
doc = await written(page);
ok('clearing a field removes the key', !('department' in doc.courses[0]));

await page.click('.cbld-form input[type="checkbox"]');
await page.waitForTimeout(500);
doc = await written(page);
ok('ticking a year writes it', JSON.stringify(doc.courses[0].grade_levels) === '[9]');
await page.click('.cbld-form input[type="checkbox"]');
await page.waitForTimeout(500);
doc = await written(page);
ok('and unticking the last one takes the field away', !('grade_levels' in doc.courses[0]));

await page.click('.cbld-form-head .curr-btn:has-text("Duplicate")');
await page.waitForTimeout(400);
doc = await written(page);
ok('Duplicate makes a second course', doc.courses.length === 2 &&
    doc.courses[1].title === 'Algebra I (copy)');
ok('with a code of its own', doc.courses[1].course_code !== doc.courses[0].course_code);
ok('and picks the copy, not the original', (await written(page)) && await page.evaluate(() =>
    cbldGetData('bld').ui.selected) === 1);

// Deleting is the one action here that loses work, so it asks first.
await page.click('.cbld-form-head .curr-btn:has-text("Delete")');
await page.waitForTimeout(300);
ok('one press does not delete', (await written(page)).courses.length === 2);
ok('it asks instead', (await page.textContent('.cbld-status')).includes('cannot be undone'));
await page.click('.cbld-form-head .curr-btn.armed');
await page.waitForTimeout(400);
ok('the second press deletes', (await written(page)).courses.length === 1);

// New, Open and Sample live in the framework's hover bar, beside the mode buttons.
await bar(page);
ok('the hover bar offers New, Open and Sample',
    (await page.$$('.cbld-actions .curr-btn, .cbld-actions .curr-file')).length === 3);
ok('beside the three modes', (await page.$$('.cbld-actions .authoring-mode-btn')).length === 3);

await page.screenshot({ path: OUT + '/cbld-edit.png' });
await finish(browser, errors);
