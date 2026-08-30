// A prerequisite is a title typed at a course that may not exist. Answering that
// as it is typed is most of what this tool is for.
import { open, ok, finish, written, FIXTURE, OUT } from './cbld-lib.mjs';

const geometry = FIXTURE.courses.findIndex((c) => c.title === 'Geometry');
const { browser, page, errors } = await open({ ui: { selected: geometry } });

const hint = () => page.textContent('.cbld-form .cbld-mrow .cbld-hint');
ok('a prerequisite that resolves says what it found', (await hint()).includes('✓'));
ok('and names the course', (await hint()).includes('Algebra I'));

const field = '.cbld-form .cbld-mrow input';
await page.fill(field, 'Algebra 1');
await page.waitForTimeout(700);
ok('a title spelled otherwise resolves to nothing', (await hint()).includes('no course by that name'));
ok('and the catalog is asked what was meant',
    !!(await page.$('.cbld-form .cbld-mrow .cbld-guess')));
ok('the guess is the course it nearly matched',
    (await page.textContent('.cbld-form .cbld-mrow .cbld-guess')) === 'Algebra I');
ok('typing did not take the caret out of the field',
    await page.evaluate((s) => document.activeElement === document.querySelector(s), field));

await page.click('.cbld-form .cbld-mrow .cbld-guess');
await page.waitForTimeout(500);
ok('pressing it writes the catalog’s own spelling',
    (await written(page)).courses[geometry].prerequisites.courses[0] === 'Algebra I');
ok('and it resolves again', (await hint()).includes('✓'));

// One prerequisite is unambiguous. Two are not, and the document has to say which.
ok('one prerequisite asks nothing', !(await page.$('.cbld-form input[onchange*="choice"]')));
await page.click('.cbld-form .cbld-add:has-text("+ prerequisite")');
await page.waitForTimeout(400);
const rows = await page.$$('.cbld-form .cbld-mrow input');
await rows[1].fill('Algebra II');
await page.waitForTimeout(700);
ok('a second one raises the question', !!(await page.$('.cbld-form input[onchange*="choice"]')));
ok('and says how it is being read now',
    (await page.textContent('.cbld-form')).includes('all 2 are required'));

await page.click('.cbld-form input[onchange*="choice"]');
await page.waitForTimeout(600);
ok('ticking it writes the claim',
    (await written(page)).courses[geometry].prerequisites.choice === true);
await page.click('.cbld-form input[onchange*="choice"]');
await page.waitForTimeout(600);
ok('unticking takes it out rather than writing false',
    !('choice' in (await written(page)).courses[geometry].prerequisites));

const xs = await page.$$('.cbld-form .cbld-mrow .cbld-x');
await xs[1].click();
await page.waitForTimeout(400);
ok('× removes just that one',
    (await written(page)).courses[geometry].prerequisites.courses.join() === 'Algebra I');

await page.screenshot({ path: OUT + '/cbld-prereq.png' });
await finish(browser, errors);
