// One document carrying one of everything, so each check is seen firing and then
// seen clearing when the document is corrected.
import { open, ok, finish, check, kinds, OUT } from './cdoc-lib.mjs';

const c = (o) => Object.assign({
    course_code: 'X', title: 'X', department: 'Maths', grade_levels: [9],
    semester_offered: 'Full Year', credits: 1,
    prerequisites: { raw: null, min_gpa: null, courses: [], grade_requirements: [] }
}, o);

const BROKEN = {
    $schema_version: '2.0',
    graduation_requirements: { credits_by_subject: [
        { subject: 'Basket Weaving', credits_required: 2 },
        { subject: 'Maths', credits_required: 99 }
    ] },
    program_groupings: [{ name: 'Path', groups: [{ name: 'G1', courses: ['Nowhere Studies'] }] }],
    courses: [
        c({ course_code: 'A1', title: 'Algebra' }),
        c({ course_code: 'A2', title: 'Algebra' }),                       // same title
        c({ course_code: 'D1', title: 'Doubled' }),
        c({ course_code: 'D1', title: 'Doubled Again' }),                 // same code
        c({ course_code: 'L1', title: 'Wrong Year', grade_levels: [99] }),
        c({ course_code: 'P1', title: 'Needs A Ghost',
            prerequisites: { raw: null, courses: ['Ghost Course'], grade_requirements: [] } }),
        c({ course_code: 'C1', title: 'Loop A',
            prerequisites: { raw: null, courses: ['Loop B'], grade_requirements: [] } }),
        c({ course_code: 'C2', title: 'Loop B',
            prerequisites: { raw: null, courses: ['Loop A'], grade_requirements: [] } }),
        c({ course_code: 'M1', title: 'Two Ways',
            prerequisites: { raw: null, courses: ['Algebra', 'Doubled'], grade_requirements: [] } }),
        c({ course_code: 'E1', title: 'Too Early', grade_levels: [9],
            prerequisites: { raw: null, courses: ['Late Thing'], grade_requirements: [] } }),
        c({ course_code: 'E2', title: 'Late Thing', grade_levels: [12] })
    ]
};

const { browser, page, errors } = await open({ doc: BROKEN, size: [1100, 780] });
const found = await kinds(page);
console.log('  ' + JSON.stringify(found));

ok('the same code twice is an error', found['duplicate-code'] === 1, String(found['duplicate-code']));
ok('a year far outside the others is an error', found['stray-level'] === 1,
    String(found['stray-level']));
ok('and it names the course carrying the odd number', (await check(page)).findings
    .filter(f => f.kind === 'stray-level')[0].detail.join(' ').includes('Wrong Year'),
    JSON.stringify((await check(page)).findings.filter(f => f.kind === 'stray-level')[0]));
ok('a prerequisite naming nothing is a warning', found['prereq-unresolved'] >= 1,
    String(found['prereq-unresolved']));
ok('a pathway naming nothing is a warning', found['pathway-unresolved'] === 1,
    String(found['pathway-unresolved']));
ok('a requirement no course counts towards is a warning', found['requirement-unmatched'] === 1,
    String(found['requirement-unmatched']));
ok('a requirement no plan could reach is a warning', found['requirement-unreachable'] === 1,
    String(found['requirement-unreachable']));
ok('two courses under one title is a warning', found['title-collision'] === 1,
    String(found['title-collision']));
ok('a line that could be and or or is a warning', found['choice-unclear'] === 1,
    String(found['choice-unclear']));
ok('a prerequisite loop is a warning', found['prereq-cycle'] === 1, String(found['prereq-cycle']));
// Four here: the loop pair and the two-ways course trip it as well as the obvious one.
ok('a prerequisite that cannot come first is a warning', found['prereq-impossible'] === 4,
    String(found['prereq-impossible']));
ok('including the course whose prerequisite is only offered later', (await check(page)).findings
    .some(f => f.kind === 'prereq-impossible' && /Too Early/.test(f.message)));
ok('and the coverage note is always there', found.coverage === 1, String(found.coverage));

// A document with no requirements at all says so, once.
const bare = await kinds(page, { courses: [c({ course_code: 'B1', title: 'Bare' })] });
ok('a document with nothing to plan against says so', bare['no-requirements'] === 1,
    JSON.stringify(bare));

// Correct every fault and the report empties out.
const FIXED = {
    graduation_requirements: { credits_by_subject: [{ subject: 'Maths', credits_required: 2 }] },
    courses: [
        c({ course_code: 'A1', title: 'Algebra' }),
        c({ course_code: 'A2', title: 'Algebra II' }),
        c({ course_code: 'P1', title: 'Needs Algebra', grade_levels: [10],
            prerequisites: { raw: null, courses: ['Algebra'], grade_requirements: [] } })
    ]
};
const clean = await kinds(page, FIXED);
const bad = Object.keys(clean).filter(k => k !== 'coverage');
ok('a document with none of these faults reports none of them', bad.length === 0,
    JSON.stringify(clean));

// The report itself, on screen.
const shown = await page.evaluate(() => ({
    groups: document.querySelectorAll('.cdoc-group').length,
    tallies: Array.from(document.querySelectorAll('.cdoc-tally')).map(e => e.textContent),
    brief: !!document.querySelector('.cdoc-score button')
}));
ok('the report groups the findings by kind', shown.groups >= 10, JSON.stringify(shown.groups));
ok('and counts them at the top', /error/.test(shown.tallies.join(' ')), JSON.stringify(shown.tallies));
ok('with the repair brief one press away', shown.brief);

await page.evaluate(() => document.querySelector('.cdoc-group-head').click());
await page.waitForTimeout(400);
ok('a group opens to show what it found', await page.evaluate(() =>
    document.querySelectorAll('.cdoc-item').length > 0));
ok('and every item names where in the file it is', await page.evaluate(() =>
    Array.from(document.querySelectorAll('.cdoc-path')).every(e => /^\//.test(e.textContent))));

await page.screenshot({ path: OUT + '/cdoc-checks.png' });
await finish(browser, errors);
