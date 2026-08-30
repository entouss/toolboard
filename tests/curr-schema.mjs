// Seeing the schema the tool reads by.
import { open, ok, finish, OUT } from './curr-lib.mjs';
const { browser, page, errors } = await open({ ui: { sourceView: 'schema' } });
// It lives beside the JSON pane, so the tool has to be showing that pane.
await page.evaluate(() => setToolMode('cur', 'split'));
await page.waitForTimeout(500);

const table = () => page.evaluate(() => ({
    rows: document.querySelectorAll('.curr-schema-table tr').length,
    names: Array.from(document.querySelectorAll('.curr-schema-name')).map(e => e.textContent.trim()),
    required: Array.from(document.querySelectorAll('.curr-schema-name'))
        .filter(e => /required/.test(e.textContent)).map(e => e.textContent.split(' ')[0]),
    read: (document.querySelector('.curr-schema-read') || {}).textContent || ''
}));

// 1. It sits beside the JSON pane, not among the tabs about the plan.
ok('Schema sits beside the document', await page.evaluate(() =>
    Array.from(document.querySelectorAll('.curr-source .curr-stab')).map(t => t.textContent).join(',') ===
        'Document,Schema'), await page.evaluate(() =>
    Array.from(document.querySelectorAll('.curr-source .curr-stab')).map(t => t.textContent).join(',')));
ok('and not among the tabs about the plan', await page.evaluate(() =>
    !Array.from(document.querySelectorAll('.curr-tab')).some(t => t.textContent.includes('Schema'))));
ok('the plan keeps its own tabs', await page.evaluate(() =>
    Array.from(document.querySelectorAll('.curr-tab')).map(t => t.textContent.replace(/\d+/g, '').trim())
        .join(',') === 'Grid,Grades,Tree,Issues'), await page.evaluate(() =>
    Array.from(document.querySelectorAll('.curr-tab')).map(t => t.textContent).join(',')));
const t = await table();
ok('it lists the fields the tool reads', t.rows > 20, t.rows + ' rows');
ok('including the ones that matter for planning',
    ['courses', 'grade_levels', 'semester_offered', 'prerequisites', 'planner', 'terms', 'levels']
        .every(name => t.names.some(n => n.startsWith(name))), JSON.stringify(t.names.slice(0, 12)));
ok('and marks what a course cannot do without',
    t.required.includes('course_code') && t.required.includes('title'), JSON.stringify(t.required));
ok('while grade levels and terms are not required',
    !t.required.includes('grade_levels') && !t.required.includes('semester_offered'), JSON.stringify(t.required));

// 2. It says what was read from the document in hand.
ok('it reports what this document gave it', /47 courses/.test(t.read), t.read.slice(0, 90));
ok('naming the levels and terms it derived', /Grade 9/.test(t.read) && /Semester 1/.test(t.read), t.read.slice(0, 160));
ok('and says they were derived, not stated', /derived from the courses/.test(t.read), t.read.slice(-120));

// 3. Fields this document actually uses are counted.
ok('fields the document uses are counted against the schema', await page.evaluate(() =>
    Array.from(document.querySelectorAll('.curr-schema-name'))
        .some(e => /^semester_offered/.test(e.textContent) && /\b47\b/.test(e.textContent))));

// 4. The schema can be taken away for writing a document against.
await page.click('.curr-schema-actions .curr-btn:nth-child(2)');
await page.waitForTimeout(500);
const inPane = await page.evaluate(() => ({
    json: document.querySelector('.curr-json').value,
    status: document.querySelector('.curr-status').textContent,
    mode: document.querySelector('.tool[data-tool="cur"]').className
}));
ok('"Show the JSON" puts a real schema in the pane',
    JSON.parse(inPane.json).$schema.includes('json-schema.org'), inPane.json.slice(0, 60));
ok('and switches to the pane so it can be read', /authoring-edit/.test(inPane.mode), inPane.mode);
ok('with a warning that it is a schema, not a curriculum',
    /not a curriculum/.test(inPane.status), inPane.status.slice(0, 80));

// 5. A document that states its own shape says so instead.
await page.evaluate(() => {
    const doc = currGetData('cur').catalog;
    doc.planner = { levels: [1, 2], level_label: 'Stage {n}', terms: ['Block A', 'Block B'] };
    const data = currGetData('cur');
    data.catalog = doc; data.plan = {};
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(400);
const stated = await table();
ok('a document that states its shape is reported as stating it',
    /states its own plan shape/.test(stated.read), stated.read.slice(-90));
ok('and the stated names are what it reports', /Stage 1, Stage 2/.test(stated.read), stated.read.slice(0, 120));

await page.screenshot({ path: OUT + '/curr-schema.png' });
await finish(browser, errors);
