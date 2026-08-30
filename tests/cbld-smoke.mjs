// The builder opens, shows a catalog, and edits one.
import { open, ok, finish, written, OUT } from './cbld-lib.mjs';
const { browser, page, errors } = await open();

ok('the editor rendered', !!(await page.$('.cbld-widget .cbld-body')));
ok('the tally is above it', !!(await page.$('.cbld-check-head')));
ok('the course list is there',
    (await page.$$('.cbld-crow')).length === (await written(page)).courses.length,
    String((await page.$$('.cbld-crow')).length));
ok('nothing is picked yet', (await page.textContent('.cbld-form')).includes('Pick a course'));

await page.click('.cbld-crow[data-i="1"]');
await page.waitForTimeout(300);
ok('picking a course opens its form', !!(await page.$('.cbld-form .cbld-in')));

await page.screenshot({ path: OUT + '/cbld-smoke.png' });
console.log(JSON.stringify(errors));
await finish(browser, errors);
