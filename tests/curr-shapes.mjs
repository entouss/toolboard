// Documents that are not a four-year school guide: college years and seasons,
// quarters, a document that states its own shape, and one that says almost nothing.
import { open, ok, finish, stored, OUT } from './curr-lib.mjs';

const course = (o) => Object.assign({
    course_code: '0', title: 'Untitled', department: 'General', credits: 3,
    prerequisites: { raw: null, min_gpa: null, courses: [], grade_requirements: [] }
}, o);

// A college catalog: years rather than grades, seasons rather than semesters.
const COLLEGE = {
    guide: { title: 'Undergraduate Catalog' },
    graduation_requirements: { credits_by_subject: [{ subject: 'Computer Science', credits_required: 30 }] },
    courses: [
        course({ course_code: 'CS101', title: 'Programming I', department: 'Computer Science', grade_levels: [1], semester_offered: 'Fall' }),
        course({ course_code: 'CS102', title: 'Programming II', department: 'Computer Science', grade_levels: [1, 2], semester_offered: 'Spring',
            prerequisites: { raw: 'Programming I', min_gpa: null, courses: ['Programming I'], grade_requirements: [] } }),
        course({ course_code: 'CS201', title: 'Data Structures', department: 'Computer Science', grade_levels: [2, 3], semester_offered: 'Fall',
            prerequisites: { raw: 'Programming II', min_gpa: null, courses: ['Programming II'], grade_requirements: [] } }),
        course({ course_code: 'CS330', title: 'Senior Project', department: 'Computer Science', grade_levels: [4], semester_offered: 'Full Year' }),
        course({ course_code: 'CS150', title: 'Field Study', department: 'Computer Science', grade_levels: [2, 3], semester_offered: 'Summer Session' })
    ]
};

const { browser, page, errors } = await open({ doc: COLLEGE, size: [1000, 700] });

const shape = () => page.evaluate(() => ({
    rows: Array.from(document.querySelectorAll('.curr-year-head b')).map(e => e.textContent),
    columns: Array.from(document.querySelectorAll('.curr-grid-head span')).map(e => e.textContent),
    terms: Array.from(document.querySelectorAll('.curr-cell')).map(c => c.getAttribute('data-term')),
    span: (document.querySelector('.curr-cell.curr-fy .curr-cell-label') || {}).textContent
}));
const place = async (title, term) => {
    await page.evaluate(({ t, term }) => {
        Array.from(document.querySelectorAll('.curr-course'))
            .find(r => r.querySelector('.curr-course-title').textContent === t).click();
        document.querySelector('.curr-cell[data-term="' + term + '"]').click();
    }, { t: title, term });
    await page.waitForTimeout(250);
};
const issues = () => page.evaluate(() => currValidate(currGetData('cur')).issues
    .map(i => ({ kind: i.kind, severity: i.severity, message: i.message })));

// 1. Rows and columns come from the document, with no school year in sight.
const college = await shape();
ok('years, not grades, when the levels start at one',
    JSON.stringify(college.rows) === JSON.stringify(['Year 1', 'Year 2', 'Year 3', 'Year 4']),
    JSON.stringify(college.rows));
ok('the columns are the terms the document names',
    JSON.stringify(college.columns) === JSON.stringify(['Fall', 'Spring', 'Summer Session']),
    JSON.stringify(college.columns));
ok('the year is a span cell over its terms, with the summer session beside them',
    college.terms.slice(0, 4).join(',') === '1-FY,1-FALL,1-SPR,1-SUM', college.terms.slice(0, 4).join(','));
ok('the span cell is named as the document names it', /Full Year/i.test(college.span || ''), college.span);

// 2. Ordering works in seasons: Fall comes before Spring of the same year.
await place('Programming I', '1-FALL');
await place('Programming II', '1-SPR');
ok('a Fall prerequisite satisfies a Spring course in the same year',
    !(await issues()).some(i => i.kind === 'prereq-order'), JSON.stringify(await issues()));
await place('Programming II', '1-FALL');
ok('the same term is still not early enough',
    (await issues()).some(i => i.kind === 'prereq-order'), JSON.stringify(await issues()));

// 3. Being offered in one term is enforced in the document's own words.
await place('Data Structures', '2-SPR');
const wrongTerm = (await issues()).find(i => i.kind === 'semester' && /Data Structures/.test(i.message)) || {};
ok('a Fall course cannot sit in Spring', /offered fall/.test(wrongTerm.message || ''), wrongTerm.message);
ok('and the level is named the way the document names it',
    /Year \d/.test(((await issues()).find(i => i.kind === 'grade') || {}).message || '') ||
    !(await issues()).some(i => i.kind === 'grade'), JSON.stringify((await issues()).filter(i => i.kind === 'grade')));

// 4. The grid grows for anyone who needs a fifth year.
await page.click('.curr-grow .curr-btn');
await page.waitForTimeout(350);
ok('a further year can be added', (await shape()).rows.includes('Year 5'), JSON.stringify((await shape()).rows));
ok('and it is remembered', (await stored(page)).extraLevels === 1);
await place('Senior Project', '5-FY');
ok('the added year takes courses', await page.evaluate(() =>
    Boolean(document.querySelector('.curr-cell[data-term="5-FY"] .curr-card'))));
ok('a year with something in it cannot be removed', await page.evaluate(() =>
    document.querySelectorAll('.curr-grow .curr-btn')[1].disabled));
await page.evaluate(() => {
    document.querySelector('.curr-cell[data-term="5-FY"] .curr-card-x').click();
});
await page.waitForTimeout(300);
await page.click('.curr-grow .curr-btn:nth-child(2)');
await page.waitForTimeout(350);
ok('an emptied year can be taken away again', !(await shape()).rows.includes('Year 5'),
    JSON.stringify((await shape()).rows));

// 5. A document that states its own shape is believed over what is inferred.
const STATED = JSON.parse(JSON.stringify(COLLEGE));
STATED.planner = {
    levels: [1, 2, 3],
    level_names: { 1: 'Foundation', 2: 'Intermediate', 3: 'Capstone' },
    terms: ['Autumn', 'Winter', { id: 'SUM', label: 'Summer', optional: true }]
};
await page.evaluate((doc) => {
    document.querySelector('.curr-json').value = JSON.stringify(doc);
    const press = () => Array.from(document.querySelectorAll('.curr-source-actions .curr-btn'))
        .find(b => ['Load', 'Replace?'].includes(b.textContent.trim())).click();
    press(); press();
}, STATED);
await page.waitForTimeout(600);
const stated = await shape();
ok('stated level names are used', JSON.stringify(stated.rows) ===
    JSON.stringify(['Foundation', 'Intermediate', 'Capstone']), JSON.stringify(stated.rows));
ok('stated terms are used, in the stated order',
    JSON.stringify(stated.columns) === JSON.stringify(['Autumn', 'Winter', 'Summer']),
    JSON.stringify(stated.columns));

// 6. A quarter system, inferred from nothing but the course entries.
const QUARTERS = { courses: [
    course({ course_code: 'Q1', title: 'Alpha', grade_levels: [1], semester_offered: 'Quarter 1' }),
    course({ course_code: 'Q2', title: 'Beta', grade_levels: [1], semester_offered: 'Quarter 2' }),
    course({ course_code: 'Q3', title: 'Gamma', grade_levels: [1], semester_offered: 'Quarter 3' })
] };
await page.evaluate((doc) => {
    document.querySelector('.curr-json').value = JSON.stringify(doc);
    const press = () => Array.from(document.querySelectorAll('.curr-source-actions .curr-btn'))
        .find(b => ['Load', 'Replace?'].includes(b.textContent.trim())).click();
    press(); press();
}, QUARTERS);
await page.waitForTimeout(600);
const quarters = await shape();
ok('three quarters make three columns, in number order',
    JSON.stringify(quarters.columns) === JSON.stringify(['Quarter 1', 'Quarter 2', 'Quarter 3']),
    JSON.stringify(quarters.columns));
ok('and their ids are stable', quarters.terms.slice(0, 4).join(',') === '1-FY,1-Q1,1-Q2,1-Q3',
    quarters.terms.slice(0, 4).join(','));

// 7. A document that says almost nothing still plans.
const BARE = { courses: [
    course({ course_code: 'X1', title: 'Only Course', credits: 1 })
] };
await page.evaluate((doc) => {
    document.querySelector('.curr-json').value = JSON.stringify(doc);
    const press = () => Array.from(document.querySelectorAll('.curr-source-actions .curr-btn'))
        .find(b => ['Load', 'Replace?'].includes(b.textContent.trim())).click();
    press(); press();
}, BARE);
await page.waitForTimeout(600);
const bare = await shape();
ok('a course with no levels and no term still loads', await page.evaluate(() =>
    document.querySelectorAll('.curr-course').length === 1));
ok('and gets a grid to sit in', bare.rows.length === 4 && bare.columns.length >= 1,
    JSON.stringify({ rows: bare.rows, columns: bare.columns }));
await place('Only Course', '1-TM1');
ok('which it can be planned in', await page.evaluate(() =>
    document.querySelectorAll('.curr-card').length === 1));

await page.screenshot({ path: OUT + '/curr-shapes.png' });
await finish(browser, errors);
