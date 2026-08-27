// Nothing replaces a plan without asking, and every button says what it did.
import { open, bar, ok, finish, stored, place, CODE, OUT } from './curr-lib.mjs';

const { browser, page, errors } = await open({
    plan: { '9-FY': [CODE['Algebra I']], '10-FY': [CODE['Geometry']] }
});

const status = () => page.evaluate(() => {
    const el = document.querySelector('.curr-status');
    return { text: el.textContent, visible: el.offsetParent !== null || getComputedStyle(el).display !== 'none' };
});
const courses = () => page.evaluate(() => document.querySelectorAll('.curr-course').length);
const label = (name) => page.evaluate((n) => {
    const btn = Array.from(document.querySelectorAll('.curr-source-actions .curr-btn'))
        .find(b => (b.getAttribute('data-label') || b.textContent).trim() === n);
    return btn ? btn.textContent.trim() : null;
}, name);
const press = async (name) => {
    await page.evaluate((n) => {
        const btn = Array.from(document.querySelectorAll('.curr-source-actions .curr-btn'))
            .find(b => (b.getAttribute('data-label') || b.textContent).trim() === n);
        btn.click();
    }, name);
    await page.waitForTimeout(350);
};

await bar(page);

// 1. What the tool has to say is readable in the explorer, which is the mode a
//    loaded document — and a link — leaves you in.
ok('the tool is showing the explorer', await page.evaluate(() =>
    document.querySelector('.tool[data-tool="cur"]').classList.contains('authoring-render')));
ok('and the status line is not hidden with the JSON pane', await page.evaluate(() =>
    getComputedStyle(document.querySelector('.curr-status')).display !== 'none' ||
    document.querySelector('.curr-status').textContent === ''));

// 2. Load, on the document already loaded, says exactly that rather than looking
//    like a button that does nothing.
await press('Load');
const same = await status();
ok('Load on the same document says it is unchanged', /already loaded/.test(same.text), same.text);
ok('and that message is visible', same.visible, JSON.stringify(same));
ok('nothing was disturbed', (await courses()) === 47 &&
    Object.keys((await stored(page)).plan).length === 2);

// 3. Sample does not throw a plan away on one click.
await press('Sample');
const armed = await status();
ok('Sample asks first when there is a document', /would replace/.test(armed.text), armed.text);
ok('and says how much is at stake', /2 entries/.test(armed.text), armed.text);
ok('the button says it is waiting for a second press', (await label('Sample')) === 'Replace?',
    await label('Sample'));
ok('and nothing has changed yet', (await courses()) === 47, String(await courses()));

// 4. Pressing it again goes ahead.
await press('Sample');
ok('a second press loads the sample', (await courses()) === 12, String(await courses()));
ok('and the button goes back to what it was', (await label('Sample')) === 'Sample', await label('Sample'));
ok('the sample says it is a stand-in', /Replace them with your own/.test((await status()).text));

// 5. The question times out rather than staying armed forever.
await page.evaluate(() => {
    const data = currGetData('cur');
    data.plan = { '9-FY': ['1001'] };
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(200);
await page.evaluate(() => {
    document.querySelector('.curr-json').value = JSON.stringify({ courses: [
        { course_code: 'Z1', title: 'Zed', department: 'Z', grade_levels: [9], credits: 1,
          semester_offered: 'Full Year', prerequisites: { raw: null, min_gpa: null, courses: [], grade_requirements: [] } }
    ] });
});
await press('Load');
ok('Load asks too when a plan would be replaced', /replaces the document/.test((await status()).text),
    (await status()).text);
// Let the question lapse, the way its timer would.
await page.evaluate(() => {
    Object.keys(currArmed).forEach((k) => { clearTimeout(currArmed[k]); delete currArmed[k]; });
    document.querySelectorAll('.curr-btn.armed').forEach((b) => {
        b.classList.remove('armed');
        b.textContent = b.getAttribute('data-label');
    });
});
await page.waitForTimeout(100);
await press('Load');
ok('after the question lapses, the next press asks again rather than acting',
    /replaces the document/.test((await status()).text) && (await courses()) === 12,
    JSON.stringify({ status: (await status()).text.slice(0, 40), courses: await courses() }));
await press('Load');
ok('and confirming then loads the new document', (await courses()) === 1, String(await courses()));

// 6. With no document at all, Sample just loads — there is nothing to lose.
await page.evaluate(() => {
    const data = currGetData('cur');
    data.catalog = null; data.plan = {}; data.completed = [];
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(200);
await press('Sample');
ok('with nothing loaded, Sample needs no confirming', (await courses()) === 12, String(await courses()));

await page.screenshot({ path: OUT + '/curr-replace.png' });
await finish(browser, errors);
