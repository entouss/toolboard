// A course taken in one school for another school's credit.
import { open, ok, finish, OUT } from './curr-lib.mjs';

const c = (o) => Object.assign({
    course_code: 'X', title: 'X', department: 'Electives', grade_levels: [7],
    semester_offered: 'Full Year', credits: 0, is_elective: true,
    prerequisites: { raw: null, courses: [], grade_requirements: [] }
}, o);

const DOC = {
    $schema_version: '2.0',
    graduation_requirements: { credits_by_subject: [{ subject: 'Electives', credits_required: 2 }] },
    planner: { levels: [6, 7, 8] },
    courses: [
        c({ course_code: 'J1', title: 'Journalism I', flags: { high_school_credit: true },
            high_school_credits: 1 }),
        c({ course_code: 'A1', title: 'Algebra I Honors', level: 'Honors', department: 'Mathematics',
            is_elective: false, flags: { high_school_credit: true, eoc_course: true },
            high_school_credits: 1 }),
        c({ course_code: 'E1', title: 'Ends In An Exam', flags: { eoc_course: true } }),
        c({ course_code: 'P1', title: 'Plain Elective' }),
        c({ course_code: 'H1', title: 'Honours Only', level: 'Honors' })
    ]
};

const { browser, page, errors } = await open({ doc: DOC, size: [1050, 700] });
const tags = (title) => page.evaluate((t) => {
    const row = Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === t);
    return Array.from(row.querySelectorAll('.curr-tag')).map(e => e.textContent.trim());
}, title);

// 1. What a course earns is on the row, not only in a filter.
ok('a high-school-credit course is badged HS', (await tags('Journalism I')).includes('HS'),
    JSON.stringify(await tags('Journalism I')));
ok('a course ending in a state exam is badged EOC', (await tags('Ends In An Exam')).includes('EOC'),
    JSON.stringify(await tags('Ends In An Exam')));
ok('a course that is neither carries no earning badge',
    !(await tags('Plain Elective')).some(t => ['HS', 'EOC'].includes(t)),
    JSON.stringify(await tags('Plain Elective')));
ok('a course that is both carries both', (await tags('Algebra I Honors')).includes('HS') &&
    (await tags('Algebra I Honors')).includes('EOC'), JSON.stringify(await tags('Algebra I Honors')));
ok('the level badge is still there beside them',
    (await tags('Algebra I Honors')).includes('H'), JSON.stringify(await tags('Algebra I Honors')));
ok('and a level with no flags is unchanged', (await tags('Honours Only')).includes('H'),
    JSON.stringify(await tags('Honours Only')));

// 2. The badge says what it is worth, where the value is known.
ok('the badge names the credit it earns', /1.0/.test(await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === 'Journalism I');
    return Array.from(row.querySelectorAll('.curr-tag')).map(e => e.getAttribute('title') || '').join(' ');
})));

// 3. The two credit values stay apart: this one counts nothing here.
await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === 'Journalism I');
    row.click();
    document.querySelector('.curr-cell[data-term="7-FY"]').click();
});
await page.waitForTimeout(500);
const totals = await page.evaluate(() => document.querySelector('.curr-totals').textContent.replace(/\s+/g, ' '));
ok('placing it adds nothing to the credits counted here', /Planned ?0.0 credits/.test(totals),
    totals.slice(0, 70));
ok('and the details panel says where it does count', await page.evaluate(() =>
    /counted at the school it transfers to/.test(
        (document.querySelector('.curr-details') || {}).textContent || '')),
    await page.evaluate(() => ((document.querySelector('.curr-earns') || {}).textContent || '').slice(0, 90)));

// 4. The schema documents the field.
ok('the schema names high_school_credits', await page.evaluate(() =>
    JSON.stringify(CURR_SCHEMA).includes('high_school_credits')));

await page.screenshot({ path: OUT + '/curr-earns.png' });
await finish(browser, errors);
