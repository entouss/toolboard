// A pathway group opening to show which of its courses are being taken, and which
// of the rest would have counted.
import { open, ok, finish, stored, OUT } from './curr-lib.mjs';

const course = (code, title, dept, credits) => ({
    course_code: code, title: title, department: dept, grade_levels: [9, 10, 11, 12],
    semester_offered: 'Full Year', credits: credits,
    prerequisites: { raw: null, min_gpa: null, courses: [], grade_requirements: [] }
});

const DOC = {
    $schema_version: '2.0',
    document: { title: 'Pathway Guide', academic_year: '2025-2026' },
    graduation_requirements: { credits_by_subject: [{ subject: 'Mathematics', credits_required: 2 }] },
    program_groupings: [{
        name: 'Diploma Pathway',
        description: 'One course from each group.',
        groups: [
            { name: 'Group 1: Sciences', courses: ['Biology', 'Chemistry', 'Physics'] },
            { name: 'Group 2: Languages', courses: ['Latin I'], required_course: true },
                    { name: 'Group 4: Stated', courses: ['Biology', 'Chemistry', 'Physics'], min_courses: 2 },
            { name: 'Group 5: Exceeded', courses: ['Biology', 'Chemistry', 'Physics'], min_courses: 1 },
            { name: 'Group 3: Elsewhere', courses: ['A Course This Catalog Does Not Have'] }
        ]
    }],
    courses: [
        course('S100', 'Biology', 'Science', 1),
        course('S200', 'Chemistry', 'Science', 1),
        course('S300', 'Physics', 'Science', 1),
        course('L100', 'Latin I', 'World Languages', 1),
        course('M100', 'Algebra I', 'Mathematics', 1)
    ]
};

// Biology is planned, Physics was taken before the plan began, Chemistry and Latin I
// are neither — one group with all three states in it.
const { browser, page, errors } = await open({
    doc: DOC, plan: { '9-FY': ['S100', 'M100'] }, completed: ['S300'], size: [1000, 700]
});

const rows = () => page.evaluate(() =>
    Array.from(document.querySelectorAll('.curr-totals .curr-req')).map(r => ({
        name: ((r.querySelector('.curr-req-name') || {}).textContent || '').trim(),
        caret: ((r.querySelector('.curr-req-caret') || {}).textContent || '').trim(),
        num: ((r.querySelector('.curr-req-num') || {}).textContent || '').trim(),
        openable: r.classList.contains('openable'),
        bar: !!r.querySelector('.curr-bar i'),
        done: !!r.querySelector('.curr-bar i.done')
    })));
const listed = () => page.evaluate(() =>
    Array.from(document.querySelectorAll('.curr-req-courses .curr-req-course')).map(e => ({
        text: e.textContent.replace(/\s+/g, ' ').trim(),
        where: ((e.querySelector('.curr-req-where') || {}).textContent || '').trim(),
        off: e.classList.contains('curr-req-off'),
        clickable: e.hasAttribute('onclick')
    })));
const openRow = async (name) => {
    await page.evaluate((n) => {
        Array.from(document.querySelectorAll('.curr-totals .curr-req'))
            .find(r => ((r.querySelector('.curr-req-name') || {}).textContent || '').includes(n)).click();
    }, name);
    await page.waitForTimeout(300);
};

// 1. A group row offers to open, the way a subject requirement does.
const before = await rows();
const g1 = before.find(r => r.name.includes('Group 1'));
ok('a pathway group is openable', g1 && g1.openable, JSON.stringify(g1));
ok('and shows a caret saying so', g1 && g1.caret === '▸', JSON.stringify(g1));
ok('the pathway heading itself is not a row to open',
    before.filter(r => r.name === 'Diploma Pathway').every(r => !r.openable && !r.caret),
    JSON.stringify(before.filter(r => r.name === 'Diploma Pathway')));
ok('nothing is open to begin with', (await listed()).length === 0);

// 2. Opening it names every course the group lists, and where each one stands.
await openRow('Group 1');
const one = await listed();
ok('opening a group lists all of its courses', one.length === 3, JSON.stringify(one));
ok('a course in the plan shows the year it is planned for',
    one.some(c => c.text.includes('Biology') && /Grade 9/.test(c.where)), JSON.stringify(one));
ok('and carries its course number',
    one.some(c => c.text.includes('S100') && c.text.includes('Biology')), JSON.stringify(one));
ok('one taken beforehand says it is already met',
    one.some(c => c.text.includes('Physics') && c.where === 'already met'), JSON.stringify(one));
ok('and one that is neither says it is not planned',
    one.some(c => c.text.includes('Chemistry') && c.where === 'not planned'), JSON.stringify(one));
ok('the ones not being taken are shown as such',
    one.filter(c => c.off).map(c => c.text).join('|').includes('Chemistry') &&
    one.filter(c => c.off).length === 1, JSON.stringify(one.map(c => [c.text, c.off])));

// 3. The count above the list is the list: what is counted is what is shown counted.
const g1After = (await rows()).find(r => r.name.includes('Group 1'));
ok('the count matches what the list shows as taken',
    g1After.num === '2 of 3' && one.filter(c => !c.off).length === 2,
    g1After.num + ' vs ' + one.filter(c => !c.off).length);

// 4. A title the catalog has no course for is named as that, and cannot be clicked
//    through to a course that is not there.
await openRow('Group 3');
const three = (await listed()).filter(c => c.text.includes('Does Not Have'));
ok('a title with no course behind it says so', three.length === 1 &&
    three[0].where === 'not in this catalog', JSON.stringify(three));
ok('and is not clickable', three.length === 1 && !three[0].clickable, JSON.stringify(three));
ok('a course that is in the catalog is clickable',
    (await listed()).filter(c => c.text.includes('Biology')).every(c => c.clickable));

// 5. Clicking one selects it, so it can be found in the catalog beside the plan.
await page.evaluate(() => {
    Array.from(document.querySelectorAll('.curr-req-course'))
        .find(e => e.textContent.includes('Chemistry')).click();
});
await page.waitForTimeout(300);
ok('clicking a listed course selects it', (await stored(page)).ui.selected === 'S200',
    JSON.stringify((await stored(page)).ui.selected));

// 6. Groups and subject requirements open independently and are both remembered.
await openRow('Mathematics');
const mixed = await listed();
ok('a subject requirement opens alongside them',
    mixed.some(c => c.text.includes('Algebra I')) &&
    mixed.some(c => c.text.includes('Chemistry')), JSON.stringify(mixed));
const kept = (await stored(page)).ui.openReqs;
ok('what is open is remembered', kept.length === 3 && kept.filter(k => /^group:/.test(k)).length === 2,
    JSON.stringify(kept));

await page.reload();
await page.waitForSelector('.tool[data-tool="cur"] .curr-widget');
await page.waitForTimeout(800);
ok('and the groups are still open after a reload',
    (await listed()).some(c => c.text.includes('Chemistry')), JSON.stringify(await listed()));

// 7. Clicking again closes it.
await openRow('Group 1');
ok('clicking the group again closes it',
    !(await listed()).some(c => c.text.includes('Chemistry')), JSON.stringify(await listed()));
ok('and the row goes back to a closed caret',
    (await rows()).find(r => r.name.includes('Group 1')).caret === '▸');

// 8. A bar is a claim about a requirement, so it is only drawn where the document
//    makes one. Nothing in Group 1 says how many of its three are needed.
const bars = await rows();
const byName = (n) => bars.find(r => r.name.includes(n));
ok('a group with no stated requirement draws no bar', !byName('Group 1').bar, JSON.stringify(byName('Group 1')));
ok('and counts what is taken of what is offered', byName('Group 1').num === '2 of 3',
    byName('Group 1').num);
ok('a group the document marks required draws one', byName('Group 2').bar, JSON.stringify(byName('Group 2')));
ok('and counts against the requirement, not the list', byName('Group 2').num === '0 of 1 needed',
    byName('Group 2').num);
ok('a group stating min_courses draws one too', byName('Group 4: Stated').bar,
    JSON.stringify(byName('Group 4: Stated')));
ok('counts against that number', byName('Group 4: Stated').num === '2 of 2 needed',
    byName('Group 4: Stated').num);
ok('a requirement that is exceeded still reads right',
    byName('Group 5: Exceeded').num === '2 of 1 needed', byName('Group 5: Exceeded').num);
ok('and a group with no requirement never says needed',
    !/ needed/.test(byName('Group 1').num), byName('Group 1').num);
ok('and is complete when it is reached', byName('Group 4: Stated').done,
    JSON.stringify(byName('Group 4: Stated')));
ok('a subject requirement still draws its bar', bars.find(r => r.name === 'Mathematics').bar,
    JSON.stringify(bars.find(r => r.name === 'Mathematics')));

await page.screenshot({ path: OUT + '/curr-groups.png' });
await finish(browser, errors);
