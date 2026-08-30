// GPA: credit-weighted, per year, per school and across a career that may not mark
// the same way twice.
import fs from 'node:fs';
import path from 'node:path';
import { open, ok, finish, place, CODE, OUT } from './curr-lib.mjs';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const middle = JSON.parse(fs.readFileSync(
    path.join(HERE, '..', 'learn', 'data', 'ironridge-2026-2027.json'), 'utf8'));

const { browser, page, errors } = await open({ size: [1180, 820] });

const setFinal = (code, value) => page.evaluate(({ c, v }) => {
    const data = currGetData('cur');
    data.marks = data.marks || {};
    data.marks[c] = { m: {}, final: v };
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
}, { c: code, v: value });
const gpa = () => page.evaluate(() => currSchoolGpa(currGetData('cur')));

// Three one-credit courses: A, B, C → 3.00.
await place(page, 'English 9', '9-FY');
await place(page, 'Algebra I', '9-FY');
await place(page, 'Biology', '9-FY');
await setFinal(CODE['English 9'], 'A');
await setFinal(CODE['Algebra I'], 'B');
await setFinal(CODE['Biology'], 'C');
ok('a GPA is the mean of what has a grade', Math.abs((await gpa()) - 3) < 0.001, String(await gpa()));

// A half-credit course counts half.
await place(page, 'Introduction to Programming', '9-S1');   // 0.5 credits
await setFinal(CODE['Introduction to Programming'], 'F');
// (4+3+2)*1 + 0*0.5 = 9 over 3.5 credits = 2.571…
ok('and is weighted by credit, not by course',
    Math.abs((await gpa()) - 9 / 3.5) < 0.001, String(await gpa()));

// It shows where the plan is.
await page.waitForTimeout(400);
ok('the year header carries it', (await page.textContent('.curr-year-gpa')).includes('GPA 2.57'),
    await page.textContent('.curr-year-gpa'));
const totals = await page.evaluate(() => {
    const row = [...document.querySelectorAll('.curr-req')]
        .find(r => (r.querySelector('.curr-req-name') || {}).textContent.trim().startsWith('GPA'));
    return row ? row.querySelector('.curr-req-num').textContent.trim() : null;
});
ok('and so does the totals panel', totals === '2.57', String(totals));

// A course ticked off before the plan can carry a grade too, and it counts.
await page.evaluate((c) => {
    const data = currGetData('cur');
    data.completed = [c];
    currSaveData('cur', data);
}, CODE['Geometry']);
await setFinal(CODE['Geometry'], 'A');
// + 4*1 → 13 over 4.5
ok('a grade on an already-met course counts', Math.abs((await gpa()) - 13 / 4.5) < 0.001,
    String(await gpa()));

// Weighted: Pre-Calculus Honors is an Honors course.
await place(page, 'Pre-Calculus Honors', '10-FY');
await setFinal(CODE['Pre-Calculus Honors'], 'B');
const plainGpa = await gpa();
await page.evaluate(() => {
    const rec = currGetRecord('cur');
    rec.schools[0].grading = Object.assign(currGrading(rec.schools[0]), { weighted: true });
    currSaveRecord('cur', rec);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(400);
const weighted = await gpa();
// One honors course at one credit gains 0.5 points over 5.5 credits.
ok('weighting adds the honors bonus and nothing else',
    Math.abs(weighted - (plainGpa + 0.5 / 5.5)) < 0.001, plainGpa + ' → ' + weighted);
ok('and the totals panel says it is weighted', await page.evaluate(() =>
    [...document.querySelectorAll('.curr-req-name')].some(n => /GPA\s*weighted/.test(n.textContent))));

// A school where nothing carries credit still has grades worth averaging.
await page.evaluate((doc) => {
    const rec = currGetRecord('cur');
    const mid = currNormalizeSchool({ id: 'sch-mid', catalog: currNormalizeDoc(doc) }, 1);
    mid.plan = { '7-FY': ['IRMS-GEM7'], '8-FY': ['IRMS-SPANI'] };
    mid.marks = { 'IRMS-GEM7': { m: {}, final: 'A' }, 'IRMS-SPANI': { m: {}, final: 'C' } };
    rec.schools.push(mid);
    currSaveRecord('cur', rec);
}, middle);
const midGpa = await page.evaluate(() =>
    currSchoolGpa(currGetRecord('cur').schools.find(s => s.id === 'sch-mid')));
ok('a school with no credits falls back to a plain mean rather than dividing by nothing',
    Math.abs(midGpa - 3) < 0.001, String(midGpa));

// The career pools points, not labels — the two schools need not mark alike.
await page.evaluate(() => {
    const rec = currGetRecord('cur');
    rec.schools.find(s => s.id === 'sch-mid').grading = { scale: 'num-5', marks: 1 };
    rec.schools.find(s => s.id === 'sch-mid').marks =
        { 'IRMS-GEM7': { m: {}, final: '5' }, 'IRMS-SPANI': { m: {}, final: '3' } };
    rec.current = '__career__';
    currSaveRecord('cur', rec);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(700);
const career = await page.textContent('.curr-career-total');
ok('the career page shows a GPA across both schools', /GPA \d\.\d\d/.test(career), career.trim());
const perSchool = await page.evaluate(() =>
    [...document.querySelectorAll('.curr-career-note')].map(n => n.textContent));
ok('and one for each school on its own', perSchool.filter(n => /GPA/.test(n)).length === 2,
    perSchool.join(' | '));
// Middle school: 5 and 3 on a 5-best scale are 4 and 2 points, no credits → mean 3.00.
ok('reading the second school through its own scale',
    perSchool.some(n => /GPA 3\.00/.test(n)), perSchool.join(' | '));

await page.screenshot({ path: OUT + '/curr-gpa.png' });
await finish(browser, errors);
