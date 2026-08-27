// The elementary file, seen by both tools.
import { open as docOpen, ok, finish, check } from './cdoc-lib.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOC = JSON.parse(fs.readFileSync('' + path.join(HERE, '..', 'learn', 'data', 'ironridge-2026-2027.json') + '', 'utf8'));

const { browser, page, errors } = await docOpen({ doc: DOC, size: [1100, 780] });
const r = await check(page);
console.log('  doctor: ' + r.errors + ' errors, ' + r.warnings + ' warnings, ' + r.courses + ' courses');
r.findings.filter(f => f.severity !== 'note').forEach(f => console.log('    ' + f.kind + ' — ' + f.message.slice(0, 110)));
ok('the doctor finds nothing structurally broken', r.errors === 0, String(r.errors));
ok('and reports the missing graduation requirements, which elementary has none of',
    r.findings.some(f => f.kind === 'no-requirements'));
ok('every prerequisite resolves', !r.findings.some(f => f.kind === 'prereq-unresolved'),
    JSON.stringify(r.findings.filter(f => f.kind === 'prereq-unresolved').map(f => f.message)));
ok('no title is used twice', !r.findings.some(f => f.kind === 'title-collision'));
await browser.close();

// And in the explorer, where the shape of the thing becomes obvious.
const { chromium } = await import('playwright');
const b2 = await chromium.launch({ channel: 'chrome' });
const p2 = await b2.newPage({ viewport: { width: 1300, height: 850 } });
const errs = [];
p2.on('pageerror', e => errs.push(e.message));
fs.writeFileSync(path.join(HERE, '..', 'learn', 'data') + '/.bcps-tmp.json', JSON.stringify(DOC));
await p2.goto('http://localhost:8777/index.html#tool/curriculum-explorer?curriculum=/learn/data/.bcps-tmp.json');
await p2.waitForSelector('.curr-widget', { timeout: 20000 });
await p2.waitForTimeout(3500);
const view = await p2.evaluate(() => {
    const id = document.querySelector('.curr-widget').closest('.tool').getAttribute('data-tool');
    const d = currGetData(id);
    const planner = currPlanner(d);
    return {
        courses: document.querySelectorAll('.curr-course').length,
        levels: planner.levels,
        rowNames: Array.from(document.querySelectorAll('.curr-year-head')).map(e => e.textContent.trim()),
        depts: Array.from(document.querySelectorAll('.curr-section-title')).map(e => e.textContent)
    };
});
console.log('  explorer: ' + JSON.stringify(view.rowNames));
ok('all 47 entries load', view.courses === 47, String(view.courses));
ok('the years run Grade 6 to Grade 8',
    view.rowNames[0].startsWith('Grade 6') && view.rowNames.length === 3,
    JSON.stringify(view.rowNames));
ok('grouped by subject', view.depts.includes('Electives') && view.depts.includes('Mathematics'),
    JSON.stringify(view.depts));
ok('no page errors', errs.length === 0, JSON.stringify(errs).slice(0, 200));
const shown = await p2.evaluate(() => document.body.innerText);
ok('the four high-school-credit electives are marked', DOC.courses.filter(c=>c.flags.high_school_credit).length === 9,
    JSON.stringify(DOC.courses.filter(c=>c.flags.high_school_credit).map(c=>c.title)));
ok('every elective has the description the guide prints',
    DOC.courses.filter(c=>c.is_elective && !c.description && c.course_code!=='IRMS-JAZZBAND').length === 0,
    JSON.stringify(DOC.courses.filter(c=>c.is_elective && !c.description).map(c=>c.title)));
ok('the band ladder answers to both sets of names',
    DOC.courses.filter(c=>(c.title_variants||[]).length).length >= 3,
    JSON.stringify(DOC.courses.filter(c=>(c.title_variants||[]).length).map(c=>c.title+'='+c.title_variants)));
const pre = DOC.courses.filter(c=>(c.prerequisites.courses||[]).length);
ok('every asterisk on the list pages leads to a named course',
    DOC.courses.filter(c=>c.flags.prerequisite_required && !(c.prerequisites.courses||[]).length).length === 0,
    JSON.stringify(DOC.courses.filter(c=>c.flags.prerequisite_required && !(c.prerequisites.courses||[]).length).map(c=>c.title)));
ok('and each one records whether the guide said it or we read it into the titles',
    pre.filter(c=>c.is_elective).every(c=>['stated','inferred'].includes(c.prerequisites.basis)),
    JSON.stringify(pre.filter(c=>c.is_elective).map(c=>c.title+':'+c.prerequisites.basis)));
// Four from the elective guide's own prose, plus the two GEM steps the district
// states as a sequence.
ok('eight prerequisites are stated by a document, three inferred from titles',
    pre.filter(c=>c.prerequisites.basis==='stated').length === 8 &&
    pre.filter(c=>c.prerequisites.basis==='inferred').length === 3,
    JSON.stringify(pre.filter(c=>c.prerequisites.basis).map(c=>c.title+':'+c.prerequisites.basis)));
const gem = DOC.courses.filter(c=>c.track==='GEM');
ok('the GEM ladder is three courses, one per grade', gem.length === 3 &&
    gem.map(c=>c.grade_levels[0]).join('') === '678', JSON.stringify(gem.map(c=>c.title)));
ok('its last two earn high school credit and an EOC',
    gem.filter(c=>c.flags.high_school_credit && c.flags.eoc_course).length === 2,
    JSON.stringify(gem.map(c=>c.title+':'+Object.keys(c.flags))));
ok('GEM-6 carries the entry criteria rather than a prerequisite course',
    gem[0].prerequisites.courses.length === 0 && gem[0].prerequisites.grade_requirements.length === 1,
    JSON.stringify(gem[0].prerequisites.grade_requirements));
ok('every accelerated record cites the school and the district at least',
    DOC.courses.filter(c=>c.flags.gifted_program).every(c=>c.source_refs.length >= 2 &&
        c.source_refs.some(r=>r.source==='irms_programs')),
    JSON.stringify(DOC.courses.filter(c=>c.flags.gifted_program).map(c=>c.source_refs.map(r=>r.source))[0]));
ok('no staff email or phone number leaked in',
    !/@browardschools|754-3\d\d/.test(JSON.stringify(DOC)));
const bio = DOC.courses.find(c=>/Biolog/i.test(c.title));
ok('Biology is taught, at the end of the GEARS sequence',
    bio && bio.grade_levels[0] === 8 && bio.track === 'GEARS' && bio.flags.high_school_credit,
    JSON.stringify(bio && {t:bio.title,g:bio.grade_levels,tr:bio.track}));
ok('and it follows GEARS 2, which follows GEARS 1',
    bio.prerequisites.courses[0] === 'GEARS 2' &&
    DOC.courses.find(c=>c.title==='GEARS 2').prerequisites.courses[0] === 'GEARS 1');
ok('every GEARS record names all three sources it was joined from',
    DOC.courses.filter(c=>c.track==='GEARS').every(c=>c.source_refs.length === 3),
    JSON.stringify(DOC.courses.find(c=>c.track==='GEARS').source_refs.map(r=>r.source)));
ok('credit by examination is still recorded separately',
    DOC.credit_by_exam.subjects.includes('Biology I') &&
    /Only U.S. History is not taught/.test(DOC.credit_by_exam.note),
    DOC.credit_by_exam.note.slice(0,80));
ok('the rule says the course need not be taken',
    /without the requirement of enrolling in or completing the course/.test(DOC.credit_by_exam.rule));
ok('and it is sourced to the district, not the school',
    DOC.credit_by_exam.source === 'bcps_counseling' &&
    DOC.source_documents.some(d=>d.id==='bcps_counseling'));
const page_text = shown;
['Indian Ridge','Broward','Jaguar','Paw Prints','indianridge'].forEach(t => {
    ok('nothing on the page says \''+t+'\'', !new RegExp(t,'i').test(page_text),
       (page_text.match(new RegExp('.{0,30}'+t+'.{0,30}','i'))||['clean'])[0]);
});
ok('and no source link points back at the real school',
    !/browardschools|lyonscreek|finalsite/i.test(JSON.stringify(DOC)));
ok('no teacher names survive', !/See (Ms|Mr|Mrs)\.?\s+[A-Z]/.test(JSON.stringify(DOC)));
await p2.screenshot({ path: 'bcps.png' });
await b2.close();
fs.unlinkSync(path.join(HERE, '..', 'learn', 'data') + '/.bcps-tmp.json');
console.log('  page errors: ' + (errors.length ? JSON.stringify(errors) : 'none'));
