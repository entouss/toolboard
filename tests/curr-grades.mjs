// Entering grades: the marking periods a school's terms imply, the final that falls
// out of them, and the one you type over the top.
import { open, ok, finish, stored, place, CODE, OUT } from './curr-lib.mjs';
const { browser, page, errors } = await open({ size: [1180, 820] });

const setTab = (t) => page.evaluate((tab) => {
    const data = currGetData('cur'); data.ui.tab = tab; currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
}, t);
const grade = (code) => page.evaluate((c) => currCourseGrade(currGetData('cur'), c), code);
const setGrading = (patch) => page.evaluate((p) => {
    const rec = currGetRecord('cur');
    rec.schools[0].grading = Object.assign(currGrading(rec.schools[0]), p);
    currSaveRecord('cur', rec);
    currRender(document.querySelector('.curr-widget'));
}, patch);

// English 9 is a full-year course; Intro to Programming is one semester.
await place(page, 'English 9', '9-FY');
await place(page, 'Introduction to Programming', '9-S1');
await setTab('grades');
await page.waitForTimeout(400);

// 1. The periods come from the terms, not from a fixed four.
const slotsFor = (title) => page.evaluate((t) => {
    const row = [...document.querySelectorAll('.curr-grades-row')]
        .find(r => r.textContent.includes(t));
    return [...row.querySelectorAll('.curr-grades-cell')].map(c => c.getAttribute('title'));
}, title);
const marksOf = (title) => page.evaluate((t) => {
    const row = [...document.querySelectorAll('.curr-grades-row')]
        .find(r => r.textContent.includes(t));
    return [...row.querySelectorAll('.curr-grades-cell .curr-mark')].length;
}, title);
ok('a full-year course collects every period of the year',
    (await slotsFor('English 9')).join(',') === 'Q1,Q2,Q3,Q4', (await slotsFor('English 9')).join(','));
// Every row gets every column the year has, so a semester course lines up under the
// quarters it was taken in instead of sliding to the first free slot.
ok('a one-semester course still sits under the whole year',
    (await slotsFor('Introduction to Programming')).join(',') === 'Q1,Q2,Q3,Q4',
    (await slotsFor('Introduction to Programming')).join(','));
ok('with the terms it was not taken in left as gaps', await page.evaluate(() => {
    const row = [...document.querySelectorAll('.curr-grades-row')]
        .find(r => r.textContent.includes('Introduction to Programming'));
    const cells = [...row.querySelectorAll('.curr-grades-cell')];
    return cells.slice(0, 2).every(c => c.querySelector('.curr-mark')) &&
           cells.slice(2).every(c => !c.querySelector('.curr-mark'));
}));
ok('and the columns are named', await page.evaluate(() =>
    [...document.querySelector('.curr-grades-row.heads').querySelectorAll('.curr-grades-cell')]
        .map(c => c.textContent).join(',') === 'Q1,Q2,Q3,Q4'));

// 2. The scale decides how a grade is entered.
ok('a scale with named grades is a select, not a free-text box', await page.evaluate(() =>
    document.querySelector('.curr-grades-cell .curr-mark').tagName === 'SELECT'));
await setGrading({ scale: 'percent' });
await page.waitForTimeout(400);
ok('a percentage is a bounded number instead', await page.evaluate(() => {
    const el = document.querySelector('.curr-grades-cell .curr-mark');
    return el.tagName === 'INPUT' && el.max === '100';
}));
await setGrading({ scale: 'letter-pm' });
await page.waitForTimeout(400);

// 3. Entering marks, and the final falling out of them.
const mark = async (title, i, value) => {
    await page.evaluate(({ t, n, v }) => {
        const row = [...document.querySelectorAll('.curr-grades-row')]
            .find(r => r.textContent.includes(t));
        const el = row.querySelectorAll('.curr-grades-cell .curr-mark')[n];
        el.value = v;
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }, { t: title, n: i, v: value });
    await page.waitForTimeout(400);
};
await mark('English 9', 0, 'A');     // Q1 4.0
await mark('English 9', 1, 'B');     // Q2 3.0
ok('one mark at a time is kept', (await stored(page)).marks[CODE['English 9']].m['S1.1'] === 'A');
let g = await grade(CODE['English 9']);
ok('the final is the mean of what has been marked', Math.abs(g.points - 3.5) < 0.001, String(g.points));
ok('written as the nearest thing the scale can say', g.label === 'B+', g.label);
ok('and marked as calculated', g.source === 'calculated', g.source);

// 4. Typing over it.
await page.evaluate(() => {
    const row = [...document.querySelectorAll('.curr-grades-row')].find(r => r.textContent.includes('English 9'));
    const el = row.querySelector('.curr-grades-final .curr-mark');
    el.value = 'A-';
    el.dispatchEvent(new Event('change', { bubbles: true }));
});
await page.waitForTimeout(500);
g = await grade(CODE['English 9']);
ok('a final typed by hand wins', g.label === 'A-' && g.source === 'entered', g.label + '/' + g.source);
ok('and the marks are still there underneath',
    (await stored(page)).marks[CODE['English 9']].m['S1.2'] === 'B');
await page.evaluate(() => {
    const row = [...document.querySelectorAll('.curr-grades-row')].find(r => r.textContent.includes('English 9'));
    const el = row.querySelector('.curr-grades-final .curr-mark');
    el.value = '';
    el.dispatchEvent(new Event('change', { bubbles: true }));
});
await page.waitForTimeout(500);
g = await grade(CODE['English 9']);
ok('clearing it goes back to the calculated one', g.label === 'B+' && g.source === 'calculated',
    g.label + '/' + g.source);

// 5. An exam, weighted.
await setGrading({ exam: true, examWeight: 0.2 });
await page.waitForTimeout(400);
ok('turning exams on adds one per term',
    (await slotsFor('English 9')).join(',') === 'Q1,Q2,Semester 1 exam,Q3,Q4,Semester 2 exam',
    (await slotsFor('English 9')).join(','));
await mark('English 9', 2, 'F');     // S1 exam, 0.0
g = await grade(CODE['English 9']);
// S1 = mean(4,3)=3.5, then 3.5*0.8 + 0*0.2 = 2.8. No S2 marks, so that is the final.
ok('the exam is blended at the weight the school gives it',
    Math.abs(g.points - 2.8) < 0.001, String(g.points));
await setGrading({ examWeight: 0.5 });
await page.waitForTimeout(400);
g = await grade(CODE['English 9']);
ok('and changing the weight changes the answer', Math.abs(g.points - 1.75) < 0.001, String(g.points));
await setGrading({ exam: false });

// 6. One mark per term is a semester grade, and says so.
await setGrading({ marks: 1 });
await page.waitForTimeout(400);
ok('one mark a term is named for the term, not called Q1',
    (await slotsFor('English 9')).join(',') === 'Semester 1,Semester 2',
    (await slotsFor('English 9')).join(','));
await setGrading({ marks: 2 });

// 7. A custom scale, for a school the presets do not cover.
await setGrading({ scale: 'custom', custom: [
    { label: 'Excellent', points: 4 }, { label: 'Secure', points: 3 }, { label: 'Working towards', points: 2 }] });
await page.waitForTimeout(500);
const opts = await page.evaluate(() =>
    [...document.querySelector('.curr-grades-cell .curr-mark').options].map(o => o.textContent));
ok('a custom scale is what the selects offer', opts.join(',') === '–,Excellent,Secure,Working towards',
    opts.join(','));

// 8. And it shows on the card, in the grid.
await setGrading({ scale: 'letter-pm' });
await setTab('grid');
await page.waitForTimeout(500);
const onCard = await page.evaluate(() => {
    const card = [...document.querySelectorAll('.curr-card')].find(c => c.textContent.includes('English 9'));
    const el = card.querySelector('.curr-card-grade');
    return el ? el.textContent : null;
});
ok('the grade is on the card in the grid', onCard === 'B+', String(onCard));

// 9. Pass/Fail, for a school that reports whether a course was passed and nothing
//    more. Neither label carries points, so a course marked this way is on the
//    record without being in any average.
await setTab('grades');
await setGrading({ scale: 'pass-fail' });
await page.waitForTimeout(500);
const pfOpts = await page.evaluate(() =>
    [...document.querySelector('.curr-grades-cell .curr-mark').options].map(o => o.textContent));
ok('Pass and Fail are what the selects offer', pfOpts.join(',') === '–,P,F', pfOpts.join(','));

const setFinal = (title, value) => page.evaluate(({ t, v }) => {
    const row = [...document.querySelectorAll('.curr-grades-row')].find(r => r.textContent.includes(t));
    const sel = row.querySelector('.curr-mark.final');
    sel.value = v;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
}, { t: title, v: value });

await setFinal('English 9', 'P');
await page.waitForTimeout(400);
const pf = await grade(CODE['English 9']);
ok('a pass is kept as the grade it was given', pf.label === 'P', JSON.stringify(pf));
ok('and carries no points, so nothing can average it', pf.points === null, JSON.stringify(pf));
ok('so the school has no GPA to report',
    await page.evaluate(() => currSchoolGpa(currGetData('cur'))) === null,
    String(await page.evaluate(() => currSchoolGpa(currGetData('cur')))));

// A fail is on the record too, and is not a zero dragging an average down.
await setFinal('English 9', 'F');
await page.waitForTimeout(400);
const failed = await grade(CODE['English 9']);
ok('a fail is recorded without being counted as zero',
    failed.label === 'F' && failed.points === null, JSON.stringify(failed));

await setGrading({ scale: 'letter-pm' });
await page.screenshot({ path: OUT + '/curr-grades.png' });
await finish(browser, errors);
