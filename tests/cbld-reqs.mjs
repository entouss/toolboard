// A requirement whose subject matches no course is a bar that can never move, and
// the explorer shows it as zero without saying why. Here it says why as you type.
import { open, ok, finish, written, FIXTURE, OUT } from './cbld-lib.mjs';
const { browser, page, errors } = await open({ ui: { section: 'subjects' } });

const cards = () => page.$$('.cbld-card');
ok('every stated requirement is a row',
    (await cards()).length === FIXTURE.graduation_requirements.credits_by_subject.length);
ok('a subject that matches says how much it has',
    (await page.textContent('.cbld-card .cbld-cover')).includes('credits available'));

await page.click('.cbld-scroll > .cbld-add:has-text("+ subject")');
await page.waitForTimeout(400);
const n = (await cards()).length;
ok('a subject can be added', (await written(page)).graduation_requirements.credits_by_subject.length === n);
const last = page.locator('.cbld-card').last();
ok('and it starts unnamed',
    (await last.locator('.cbld-cover').textContent()).includes('Name a subject'));

const field = last.locator('.cbld-card-head .cbld-in:not(.short)');
await field.fill('Kayaking');
await page.waitForTimeout(700);
ok('a subject nothing counts towards says so plainly',
    (await last.locator('.cbld-cover').textContent()).includes('No course in this catalog'));
ok('and is marked as wrong, not merely empty',
    (await last.locator('.cbld-cover').getAttribute('class')).includes('bad'));

await field.fill('Science');
await page.waitForTimeout(700);
const cover = await last.locator('.cbld-cover').textContent();
ok('naming a real department counts what it has', /\d+ courses count/.test(cover), cover);

// Asking for more credits than exist is its own kind of wrong.
await last.locator('.cbld-card-head .cbld-in.short').fill('99');
await page.waitForTimeout(700);
ok('and says when there are not enough of them',
    (await last.locator('.cbld-cover').textContent()).includes('short of the 99'));

// The departments the catalog actually has, so a subject can be added by a name
// that will match rather than one you would have guessed.
const chips = await page.$$('.cbld-checks .cbld-add');
ok('the catalog’s own departments are offered', chips.length === 8, String(chips.length));
const marks = await page.evaluate(() => Array.from(
    document.querySelectorAll('.cbld-checks .cbld-add')).map((b) => b.textContent[0]));
ok('each one already asked for is shown as such', marks.every((m) => m === '✓'), marks.join(''));

await page.screenshot({ path: OUT + '/cbld-reqs.png' });
await finish(browser, errors);
