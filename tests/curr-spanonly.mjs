// A document of nothing but year-long courses. It divides its levels into no terms,
// so a level is the whole unit of time — and one level still comes before the next.
import { open, ok, finish, OUT } from './curr-lib.mjs';

const course = (code, title, level, needs) => ({
    course_code: code, title: title, department: 'World Languages', grade_levels: [level],
    semester_offered: 'Full Year', credits: 1,
    prerequisites: { raw: needs ? needs[0] : null, min_gpa: null, courses: needs || [], grade_requirements: [] }
});

const DOC = {
    $schema_version: '2.0',
    document: { title: 'Year-long Guide', academic_year: '2025-2026' },
    graduation_requirements: { credits_by_subject: [{ subject: 'World Languages', credits_required: 2 }] },
    courses: [
        course('L1', 'Latin I', 9),
        course('L2', 'Latin II', 10, ['Latin I']),
        course('L3', 'Latin III', 11, ['Latin II'])
    ]
};

const { browser, page, errors } = await open({ doc: DOC, size: [1000, 660] });

const issues = () => page.evaluate(() => currValidate(currGetData('cur')).issues
    .map(i => ({ kind: i.kind, code: i.code, message: i.message })));
const pos = () => page.evaluate(() => {
    const planner = currPlanner(currGetData('cur'));
    return planner.levels.map(l => currTermPos(planner, l + '-FY'));
});
const place = async (title, term) => {
    await page.evaluate(({ t, term }) => {
        Array.from(document.querySelectorAll('.curr-course'))
            .find(r => r.querySelector('.curr-course-title').textContent === t).click();
        document.querySelector('.curr-cell[data-term="' + term + '"]').click();
    }, { t: title, term });
    await page.waitForTimeout(300);
};

// 1. With no terms to divide it, a level is one cell wide.
const shape = await page.evaluate(() => ({
    cells: document.querySelectorAll('.curr-cell').length,
    terms: Array.from(document.querySelectorAll('.curr-cell')).map(c => c.getAttribute('data-term'))
}));
ok('a level with no terms is one cell', shape.cells === 3, JSON.stringify(shape));
ok('and that cell is the whole year', shape.terms.join(',') === '9-FY,10-FY,11-FY', shape.terms.join(','));

// 2. Each level is a step of its own, so one is measurably before the next.
const p = await pos();
ok('the levels run in order', p[0].end < p[1].start && p[1].end < p[2].start, JSON.stringify(p));
ok('and none of them sits at nowhere', p.every(x => x.start >= 0 && x.end >= 0), JSON.stringify(p));

// 3. A sequence laid out a year at a time is in order, and says nothing.
await place('Latin I', '9-FY');
await place('Latin II', '10-FY');
await place('Latin III', '11-FY');
const clean = await issues();
ok('a prerequisite a year earlier is not an error',
    !clean.some(i => i.kind === 'prereq-order'), JSON.stringify(clean));
ok('and nothing else is raised either', clean.length === 0, JSON.stringify(clean));

// 4. Put one alongside what it needs and it is an error again — the check still works,
//    it was only ever the measuring that was broken.
await place('Latin II', '9-FY');
const clash = await issues();
ok('a prerequisite in the same year is an error',
    clash.some(i => i.kind === 'prereq-order' && i.code === 'L2'), JSON.stringify(clash));
ok('and only that course is faulted, not the one after it',
    clash.filter(i => i.kind === 'prereq-order').length === 1 &&
    !clash.some(i => i.code === 'L3'), JSON.stringify(clash));

// 5. Moving it back clears it.
await place('Latin II', '10-FY');
ok('moving it back to its own year clears the error',
    !(await issues()).some(i => i.kind === 'prereq-order'), JSON.stringify(await issues()));

// 6. "The first year it fits" can only find one if the years are ordered.
await page.evaluate(() => currRemove(new Event('click'),
    Array.from(document.querySelectorAll('.curr-card')).find(c => c.textContent.includes('Latin III'))
        .querySelector('.curr-card-x')));
await page.waitForTimeout(300);
await page.evaluate(() => currAutoPlaceCode(document.querySelector('.curr-widget'), 'L3'));
await page.waitForTimeout(400);
const placed = await page.evaluate(() => currPlacementOf(currGetData('cur'), 'L3'));
ok('a course added to the plan lands after what it needs', placed === '11-FY', String(placed));

await page.screenshot({ path: OUT + '/curr-spanonly.png' });
await finish(browser, errors);
