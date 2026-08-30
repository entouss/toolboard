// What a student carries from one school to the next: a course the new school also
// teaches, and one it does not.
import fs from 'node:fs';
import path from 'node:path';
import { open, ok, finish, stored, issues, sourcePane, OUT } from './curr-lib.mjs';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const middle = JSON.parse(fs.readFileSync(
    path.join(HERE, '..', 'learn', 'data', 'ironridge-2026-2027.json'), 'utf8'));

// The high school is the fixture. Geometry there needs Algebra I first.
const { browser, page, errors } = await open({ size: [1150, 800] });

// Put the middle school in front of it, with Algebra I Honors recorded in grade 8.
await page.evaluate((doc) => {
    const rec = currGetRecord('cur');
    const mid = currNormalizeSchool({ id: 'sch-mid', catalog: currNormalizeDoc(doc) }, 1);
    // Two real cases: one the high school spells the same way, one it does not.
    mid.plan = { '7-FY': ['IRMS-GEM7'], '8-FY': ['IRMS-SPANI'] };
    rec.schools.push(mid);
    currSaveRecord('cur', rec);
    currRender(document.querySelector('.curr-widget'));
}, middle);
await page.waitForTimeout(800);

ok('the later school offers a Transferred in panel', !!(await page.$('.curr-transfers')));
await page.click('.curr-transfers-head');
await page.waitForTimeout(500);

const rows = await page.evaluate(() => [...document.querySelectorAll('.curr-transfer')]
    .map(r => r.textContent.replace(/\s+/g, ' ').trim()));
ok('what was taken earlier is offered', rows.length === 2, rows.join(' | '));
const gem = rows.find(r => /GEM-7/.test(r)) || '';
const span = rows.find(r => /Spanish/.test(r)) || '';
ok('named, with the school it came from', /Iron Ridge/.test(gem), gem);
ok('a title spelled the same way matches outright', /→ \d+ Spanish I/.test(span) &&
    !/close match/.test(span), span);
// GEM-7 (Algebra I Honors) is what a real middle school calls it. Reaching Algebra I
// from that is a guess, and the tool says so rather than asserting it.
ok('a title spelled differently is reached through the parenthetical',
    /→ \d+ Algebra I/.test(gem), gem);
ok('and flagged as a guess for the student to confirm', /close match/.test(gem), gem);
ok('nothing is ticked until the student says so', await page.evaluate(() =>
    [...document.querySelectorAll('.curr-transfer input')].every(i => !i.checked)));

// Geometry cannot be placed before Algebra I. Place it, and the tool should object.
await page.evaluate(() => {
    const data = currGetData('cur');
    const geom = data.catalog.courses.find(c => c.title === 'Geometry');
    data.plan = { '9-FY': [geom.course_code] };
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(500);
const before = await issues(page);
ok('a prerequisite taken at the old school still reads as missing',
    before.some(i => i.kind === 'prereq-missing' && /Algebra I/.test(i.message)),
    JSON.stringify(before.map(i => i.kind)));

await page.evaluate(() => {
    [...document.querySelectorAll('.curr-transfer')]
        .find(r => /GEM-7/.test(r.textContent)).querySelector('input').click();
});
await page.waitForTimeout(700);
ok('ticking it marks this school’s course as already met', await page.evaluate(() => {
    const data = currGetData('cur');
    const algebra = data.catalog.courses.find(c => c.title === 'Algebra I');
    return data.completed.includes(algebra.course_code);
}));
const after = await issues(page);
ok('and the prerequisite stops complaining',
    !after.some(i => i.kind === 'prereq-missing' && /Algebra I/.test(i.message)),
    JSON.stringify(after.map(i => i.kind)));

await page.evaluate(() => {
    [...document.querySelectorAll('.curr-transfer')]
        .find(r => /GEM-7/.test(r.textContent)).querySelector('input').click();
});
await page.waitForTimeout(700);
ok('unticking puts it back exactly as it was',
    (await stored(page)).completed.length === 0 &&
    (await issues(page)).some(i => i.kind === 'prereq-missing'));

// Credit for something this school does not teach has nowhere to be ticked.
await page.evaluate(() => {
    const data = currGetData('cur');
    data.credits_in = [{ title: 'Marine Science', credits: 1, subject: 'Science', from: 'Iron Ridge Middle School' }];
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(600);
const science = await page.evaluate(() => {
    const row = [...document.querySelectorAll('.curr-req')]
        .find(r => (r.querySelector('.curr-req-name') || {}).textContent === 'Science');
    return row ? row.querySelector('.curr-req-num').textContent.trim() : null;
});
ok('loose credit moves the subject it was granted for', /^1\.0 \//.test(science || ''), science);

await page.evaluate(() => {
    const row = [...document.querySelectorAll('.curr-req')]
        .find(r => (r.querySelector('.curr-req-name') || {}).textContent === 'Science');
    row.click();
});
await page.waitForTimeout(500);
ok('and is listed under it, so the number is traceable',
    (await page.textContent('.curr-req-courses')).includes('Marine Science'));
ok('saying where it came from',
    (await page.textContent('.curr-req-courses')).includes('transferred from Iron Ridge'));

await page.screenshot({ path: OUT + '/curr-transfer.png' });
await finish(browser, errors);
