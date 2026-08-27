// A prerequisite line that offers a choice: any one of them will do.
import { open, ok, finish, OUT } from './curr-lib.mjs';

const course = (code, title, level, needs, choice) => ({
    course_code: code, title: title, department: 'Mathematics', grade_levels: [level],
    semester_offered: 'Full Year', credits: 1,
    prerequisites: { raw: null, choice: choice || false, courses: needs || [], grade_requirements: [] }
});

const DOC = {
    $schema_version: '2.0',
    document: { title: 'Choice Guide', academic_year: '2025-2026' },
    graduation_requirements: { credits_by_subject: [{ subject: 'Mathematics', credits_required: 2 }] },
    courses: [
        course('A1', 'Algebra II', 10), course('A2', 'Algebra II Honors', 10),
        // Either Algebra II will do for Pre-Calculus.
        course('P1', 'Pre-Calculus', 11, ['Algebra II', 'Algebra II Honors'], true),
        // Statistics needs both of its prerequisites, and says nothing about a choice.
        course('S1', 'Statistics', 11, ['Algebra II', 'Algebra II Honors'], false)
    ]
};

const { browser, page, errors } = await open({ doc: DOC, size: [1000, 700] });
const issues = () => page.evaluate(() => currValidate(currGetData('cur')).issues
    .map(i => ({ kind: i.kind, code: i.code, severity: i.severity, message: i.message })));
const plan = async (p) => { await page.evaluate((x) => {
    currUpdate(document.querySelector('.curr-widget'), d => { d.plan = x; });
}, p); await page.waitForTimeout(350); };

// 1. One alternative met settles the line, and nothing is said.
await plan({ '10-FY': ['A1'], '11-FY': ['P1'] });
const met = await issues();
ok('one alternative is enough', !met.some(i => i.code === 'P1'), JSON.stringify(met));

// 2. The other alternative does just as well.
await plan({ '10-FY': ['A2'], '11-FY': ['P1'] });
ok('and so is the other one', !(await issues()).some(i => i.code === 'P1'), JSON.stringify(await issues()));

// 3. Neither: one warning naming the choice, not one complaint per alternative.
await plan({ '11-FY': ['P1'] });
const none = await issues();
const forP = none.filter(i => i.code === 'P1');
ok('with neither, exactly one issue is raised', forP.length === 1, JSON.stringify(forP));
ok('it is a warning, not an error', forP[0].severity === 'warning', forP[0].severity);
ok('and it names both ways out, in the order the document lists them',
    /one of Algebra II or Algebra II Honors/.test(forP[0].message), forP[0].message);

// 4. An alternative that is planned but too late is not met either.
await plan({ '11-FY': ['A1', 'P1'] });
const late = (await issues()).filter(i => i.code === 'P1');
ok('an alternative in the same year does not count', late.length === 1, JSON.stringify(late));
ok('and the message says so', /to finish first, and none of them does/.test(late[0].message), late[0].message);

// 5. Without the flag, every listed course is still required — a line can be a
//    choice and a requirement at once, and only the document knows which.
await plan({ '10-FY': ['A1'], '11-FY': ['S1'] });
const strict = (await issues()).filter(i => i.code === 'S1');
ok('a line with no choice still demands them all', strict.length === 1 &&
    strict[0].kind === 'prereq-missing' && strict[0].severity === 'error', JSON.stringify(strict));
ok('naming the one that is missing', /needs Algebra II Honors/.test(strict[0].message), strict[0].message);

// 6. The flag survives being loaded, which is where it was lost the first time.
await page.evaluate((doc) => {
    document.querySelector('.curr-json').value = JSON.stringify(doc);
    currLoadSource(document.querySelector('.curr-json'));
}, DOC);
await page.waitForTimeout(600);
ok('the flag survives loading the document', await page.evaluate(() =>
    currGetData('cur').catalog.courses.find(c => c.course_code === 'P1').prerequisites.choice === true),
    JSON.stringify(await page.evaluate(() =>
        currGetData('cur').catalog.courses.find(c => c.course_code === 'P1').prerequisites)));

// 7. And the schema says the field exists.
ok('the schema documents it', await page.evaluate(() =>
    JSON.stringify(CURR_SCHEMA).includes('"choice"')));

await page.screenshot({ path: OUT + '/curr-choice.png' });
await finish(browser, errors);
