// Building a catalog takes hours. None of it may depend on the tab staying open.
import { open, ok, finish, written, FIXTURE } from './cbld-lib.mjs';
const { browser, page, errors } = await open({ ui: { section: 'courses', selected: 2 } });

await page.fill('.cbld-form input[oninput*="courses.2.title"]', 'Algebra II Honors');
await page.click('.cbld-nav .cbld-tab:has-text("Subjects")');
await page.click('.cbld-check-head');
await page.waitForTimeout(900);

await page.reload();
await page.waitForSelector('.cbld-widget .cbld-body', { timeout: 15000 });
await page.waitForTimeout(700);

const doc = await written(page);
ok('the document survived the reload', doc.courses.length === FIXTURE.courses.length);
ok('with the edit in it', doc.courses[2].title === 'Algebra II Honors');
const ui = await page.evaluate(() => cbldGetData('bld').ui);
ok('and it comes back where you left it', ui.section === 'subjects', ui.section);
ok('still on the course you had open', ui.selected === 2, String(ui.selected));
ok('with the tally still open', ui.checkOpen === true);
ok('which is what is on screen', !!(await page.$('.cbld-check-body')) &&
    (await page.getAttribute('.cbld-nav .cbld-tab.active', 'onclick')).includes('subjects'));

// The tool is one of three reading the same document — what it writes has to be
// what the other two read.
ok('the explorer can read what this wrote', await page.evaluate(() =>
    currParse(cbldJson(cbldGetData('bld').catalog)).ok));

await finish(browser, errors);
