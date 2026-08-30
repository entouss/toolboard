// The doctor's checks, run while there is still someone at the keyboard.
import { open, ok, finish, written, FIXTURE, OUT } from './cbld-lib.mjs';
const { browser, page, errors } = await open();

const tally = () => page.textContent('.cbld-check-head');
ok('the tally counts what the doctor counts', await page.evaluate(() => {
    const result = cdocCheck(cbldView('bld', cbldGetData('bld').catalog).catalog);
    const head = document.querySelector('.cbld-check-head').textContent;
    return head.includes(result.errors + ' error') && head.includes(result.warnings + ' warning');
}), await tally());
ok('and it is folded away until asked for', !(await page.$('.cbld-check-body')));

await page.click('.cbld-check-head');
await page.waitForTimeout(400);
ok('opening it lists the kinds of finding', (await page.$$('.cbld-check-body .cdoc-group')).length > 0);

// Break one thing, and watch the tally answer for it.
const before = await page.evaluate(() =>
    document.querySelector('.cbld-check-head').textContent.match(/(\d+) error/)[1]);
await page.evaluate(() => {
    const data = cbldGetData('bld');
    data.catalog.courses[3].course_code = data.catalog.courses[2].course_code;
    cbldSaveData('bld', data);
    cbldRender(document.querySelector('.cbld-widget'));
});
await page.waitForTimeout(500);
const after = await page.evaluate(() =>
    document.querySelector('.cbld-check-head').textContent.match(/(\d+) error/)[1]);
ok('two courses with one code is an error', Number(after) === Number(before) + 1,
    before + ' → ' + after);

// A finding says where it is. Pressing it goes there.
await page.click('.cdoc-group-head:has-text("The same course code twice")');
await page.waitForTimeout(400);
ok('the group opens onto the finding itself', !!(await page.$('.cdoc-item.cbld-goto')));
await page.click('.cdoc-item.cbld-goto');
await page.waitForTimeout(500);
ok('and pressing it picks the course it is about',
    await page.evaluate(() => cbldGetData('bld').ui.selected) === 3);
ok('the code field says so where the code is typed',
    (await page.textContent('.cbld-form .cbld-cover[data-live^="code"]'))
        .includes('Another course already has this code'));

// Fixing it clears it, without a reload.
await page.fill('.cbld-form input[oninput*="course_code"]', '9999');
await page.waitForTimeout(700);
ok('correcting the code clears the error', await page.evaluate((n) =>
    document.querySelector('.cbld-check-head').textContent.includes(n + ' error'), Number(before)),
    await tally());
ok('and the warning under the field goes with it',
    (await page.textContent('.cbld-form .cbld-cover[data-live^="code"]')) === '');

await page.screenshot({ path: OUT + '/cbld-check.png' });
await finish(browser, errors);
