// Where the controls live: each one beside the thing it acts on.
import { open, ok, finish, stored, sourcePane, CODE, OUT } from './curr-lib.mjs';
const { browser, page, errors } = await open({
    plan: { '9-FY': [CODE['Algebra I'], CODE['English 9']] }, size: [1100, 760]
});

const texts = (sel) => page.evaluate((s) =>
    Array.from(document.querySelectorAll(s)).map(e => e.textContent.trim()), sel);

// 1. The header bar keeps only what acts on the plan.
await sourcePane(page);
ok('the bar holds nothing but PNG', (await texts('.curr-actions .curr-btn')).join(',') === 'PNG',
    JSON.stringify(await texts('.curr-actions .curr-btn')));

// 2. Load, File and Sample act on the JSON pane, so they are in it.
ok('Load, File and Sample sit with the JSON', (await texts('.curr-source-actions .curr-btn')).join(',') ===
    'Load,File,Sample', JSON.stringify(await texts('.curr-source-actions .curr-btn')));
ok('and the file picker came with them', await page.evaluate(() =>
    !!document.querySelector('.curr-source-actions .curr-file input[type=file]')));

// 3. Schema is a face of that pane, not a tab about the plan.
ok('the pane offers the document or its schema',
    (await texts('.curr-source .curr-stab')).join(',') === 'Document,Schema',
    JSON.stringify(await texts('.curr-source .curr-stab')));
ok('the plan keeps Grid, Tree and Issues alone',
    (await texts('.curr-tab')).map(t => t.replace(/\d+/g, '').trim()).join(',') === 'Grid,Tree,Issues',
    JSON.stringify(await texts('.curr-tab')));

const showing = () => page.evaluate(() => ({
    schema: document.querySelector('.curr-source').classList.contains('showing-schema'),
    table: document.querySelectorAll('.curr-schema-table tr').length,
    docVisible: getComputedStyle(document.querySelector('.curr-doc')).display !== 'none',
    json: document.querySelector('.curr-json').value.length
}));
const before = await showing();
ok('it opens on the document', !before.schema && before.docVisible && before.json > 100,
    JSON.stringify(before));

await page.click('.curr-source .curr-stab:nth-child(2)');
await page.waitForTimeout(400);
const onSchema = await showing();
ok('choosing Schema shows the schema', onSchema.schema && onSchema.table > 20, JSON.stringify(onSchema));
ok('and puts the editor away', !onSchema.docVisible, JSON.stringify(onSchema));
ok('without touching what was in it', onSchema.json === before.json, onSchema.json + ' vs ' + before.json);
ok('the choice is remembered', (await stored(page)).ui.sourceView === 'schema',
    JSON.stringify((await stored(page)).ui.sourceView));

await page.reload();
await page.waitForSelector('.tool[data-tool="cur"] .curr-widget');
await page.waitForTimeout(800);
ok('and survives a reload', (await showing()).schema, JSON.stringify(await showing()));
await page.click('.curr-source .curr-stab:nth-child(1)');
await page.waitForTimeout(400);
ok('going back shows the document again', (await showing()).docVisible);
ok('with the JSON still in it', (await showing()).json > 100, String((await showing()).json));

// 4. The PDF prints the courses the catalog column is showing, so it sits under them.
ok('PDF is in the courses column', await page.evaluate(() =>
    !!document.querySelector('.curr-catalog .curr-catalog-foot button')));
ok('and not in the header bar', !(await texts('.curr-actions .curr-btn')).some(t => /PDF/.test(t)),
    JSON.stringify(await texts('.curr-actions .curr-btn')));
const pdfLabel = () => page.evaluate(() =>
    document.querySelector('.curr-catalog-foot button').textContent.trim());
ok('it says how many it would print', /^PDF · 47 courses$/.test(await pdfLabel()), await pdfLabel());
await page.evaluate(() => currSetSearch(Object.assign(document.querySelector('.curr-search'),
    { value: 'Algebra' })));
await page.waitForTimeout(500);
ok('and the number follows the filter', /^PDF · [1-9]\d? courses?$/.test(await pdfLabel()) &&
    (await pdfLabel()) !== 'PDF · 47 courses', await pdfLabel());

// 5. The notes under the plan are separate things, so they read as a list.
await page.evaluate(() => currSetSearch(Object.assign(document.querySelector('.curr-search'), { value: '' })));
await page.waitForTimeout(400);
const notes = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('.curr-totals .curr-req.curr-note'));
    return els.map(e => ({
        marker: getComputedStyle(e, '::before').content,
        indent: getComputedStyle(e).paddingLeft
    }));
});
ok('every note under the plan carries a bullet', notes.length > 0 &&
    notes.every(n => n.marker.includes('•')), JSON.stringify(notes));
ok('and hangs its text off it', notes.every(n => parseFloat(n.indent) >= 10), JSON.stringify(notes));

await page.screenshot({ path: OUT + '/curr-layout.png' });
await finish(browser, errors);
