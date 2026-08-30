// The document beyond its courses: what it is, what shape it has, and the pathways
// that ask for named courses rather than for credits.
import { open, ok, finish, written, OUT } from './cbld-lib.mjs';
const { browser, page, errors } = await open({ ui: { section: 'document' } });

// ---- Document
ok('the sections are all offered', (await page.$$('.cbld-nav .cbld-tab')).length === 5);
await page.fill('.cbld-pane input[oninput*="school.name"]', 'Fictional High School');
await page.waitForTimeout(600);
ok('the school name is written', (await written(page)).school.name === 'Fictional High School');
ok('what the form does not edit is named rather than hidden',
    (await page.textContent('.cbld-pane')).includes('Carried through untouched'));
ok('and it names a real one of them',
    (await page.textContent('.cbld-pane')).includes('practical_fine_arts_index'));

// ---- Planner
await page.click('.cbld-nav .cbld-tab:has-text("Planner")');
await page.waitForTimeout(400);
const said = await page.textContent('.cbld-pane');
ok('the shape is described in words before it is edited', said.includes('4 years'), said.slice(0, 120));
ok('and it says where that shape came from', said.includes('states no shape'));

await page.click('.cbld-pane .cbld-add:has-text("Write that shape")');
await page.waitForTimeout(500);
let doc = await written(page);
ok('it can be written down as the document’s own claim',
    JSON.stringify(doc.planner.levels) === '[9,10,11,12]');
ok('terms with it', doc.planner.terms.length > 0, JSON.stringify(doc.planner.terms));
ok('and the wording changes to match',
    (await page.textContent('.cbld-pane')).includes('states its own shape'));

await page.fill('.cbld-pane input[oninput*="cbldSetLevels"]', '9, 10, 11, 12, 13');
await page.waitForTimeout(700);
ok('years are read as numbers, however they are typed',
    JSON.stringify((await written(page)).planner.levels) === '[9,10,11,12,13]');

await page.click('.cbld-pane .cbld-add:has-text("+ term")');
await page.waitForTimeout(400);
const terms = await page.$$('.cbld-pane .cbld-mrow input[type="checkbox"]');
await terms[terms.length - 1].click();
await page.waitForTimeout(500);
doc = await written(page);
const last = doc.planner.terms[doc.planner.terms.length - 1];
ok('a term that sits after the year says so outright', last.optional === true,
    JSON.stringify(last));

// ---- Pathways
await page.click('.cbld-nav .cbld-tab:has-text("Pathways")');
await page.waitForTimeout(400);
ok('none is not an error', (await page.textContent('.cbld-pane')).includes('Optional'));
await page.click('.cbld-pane .cbld-add:has-text("+ pathway")');
await page.waitForTimeout(400);
doc = await written(page);
ok('one can be added with a group in it', doc.program_groupings.length === 1 &&
    doc.program_groupings[0].groups.length === 1);

await page.fill('.cbld-pane .cbld-mrow input', 'Algebra 1');
await page.waitForTimeout(700);
ok('a group course is matched against the catalog the same way',
    (await page.textContent('.cbld-pane .cbld-mrow .cbld-hint')).includes('no course by that name'));
await page.click('.cbld-pane .cbld-mrow .cbld-guess');
await page.waitForTimeout(500);
ok('and the suggestion writes the spelling that resolves',
    (await written(page)).program_groupings[0].groups[0].courses[0] === 'Algebra I');

await page.screenshot({ path: OUT + '/cbld-sections.png' });
await finish(browser, errors);
