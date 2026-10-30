// Export as JSON from a tool's ⋮ menu: the tool as the Import / Export file, one or
// several, which Import from File brings back on another board — content, settings,
// position — and without what belongs to this browser alone.
import { chromium } from 'playwright';
import fs from 'node:fs';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, acceptDownloads: true });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:8777/index.html#tool/agenda-timer');
await page.waitForSelector('.agt-widget .agt-row', { timeout: 20000 });
await page.waitForTimeout(800);

const timer = await page.evaluate(() => document.querySelector('.agt-widget').closest('.tool').dataset.tool);
await page.fill('.agt-row[data-i="0"] .agt-name', 'Hello and coffee');
const note = await page.evaluate(() => {
    const id = createNoteWithText('# Trip notes\n\nBook flights.', 'Trip Notes: Spring');
    setToolMode(id, 'render');
    // What belongs to this browser alone, as a dynamic tool's fetched source would.
    toolCustomizations[id].sourceCache = 'fetched here';
    toolCustomizations[id].sourceFetchedAt = Date.now();
    saveToolCustomizations(toolCustomizations);
    return id;
});
// Where it sits, once the board has placed it: on the screen and in what is saved.
await page.waitForTimeout(800);
await page.evaluate((id) => {
    const t = document.querySelector('.tool[data-tool="' + id + '"]');
    Object.assign(t.style, { left: '321px', top: '123px', width: '420px', height: '260px' });
    positions[id] = { ...(positions[id] || {}), x: 321, y: 123, width: 420, height: 260 };
    savePositions(positions);
}, note);

const openMenu = async (id) => {
    await page.evaluate((i) => { const t = document.querySelector('.tool[data-tool="' + i + '"]'); maxZ++; t.style.zIndex = maxZ; }, id);
    await page.hover('.tool[data-tool="' + id + '"] .tool-header');
    await page.click('.tool[data-tool="' + id + '"] .settings-btn');
    await page.waitForTimeout(250);
};
const saveDownload = async (click) => {
    const [dl] = await Promise.all([page.waitForEvent('download'), click()]);
    const file = await dl.path();
    return { name: dl.suggestedFilename(), data: JSON.parse(fs.readFileSync(file, 'utf8')), text: fs.readFileSync(file, 'utf8') };
};

// 1. One tool.
await openMenu(note);
ok('a tool’s ⋮ menu offers Export as JSON, beside HTML and PNG', await page.isVisible('#toolSettingsExportJsonBtn') &&
    await page.isVisible('#toolSettingsExportPngBtn') && !(await page.isVisible('#toolSettingsExportJsonBulkBtn')));
const one = await saveDownload(() => page.click('#toolSettingsExportJsonBtn'));
ok('named after the tool', /^trip-notes-spring-\d{14}\.json$/.test(one.name), one.name);
ok('in the Import / Export format', one.data.type === 'tools' && Array.isArray(one.data.tools) && one.data.tools.length === 1 && !!one.data.exportedAt);
const entry = one.data.tools[0];
ok('holding its content and its settings', entry.id === note && entry.isCustom === true &&
    entry.customizations.customContent === '# Trip notes\n\nBook flights.' && entry.customizations.title === 'Trip Notes: Spring');
ok('and where it sits', entry.position && entry.position.x === 321 && entry.position.y === 123 && entry.position.width === 420, JSON.stringify(entry.position));
ok('without what belongs to this browser alone', !('sourceCache' in entry.customizations) && !('sourceFetchedAt' in entry.customizations) &&
    !/fetched here/.test(one.text));
ok('the same entry the Export tab writes', JSON.stringify(entry) === JSON.stringify(await page.evaluate((i) => toolExportEntry(i), note)));
ok('the menu closes', !(await page.isVisible('#toolSettingsExportJsonBtn')));

// 2. A plugin's tool.
await openMenu(timer);
const two = await saveDownload(() => page.click('#toolSettingsExportJsonBtn'));
ok('a plugin’s tool too, with its own settings', /^agenda-timer-\d{14}\.json$/.test(two.name) &&
    two.data.tools[0].customizations.agtSections[0].name === 'Hello and coffee', two.name);

// 3. Several at once.
await page.evaluate(([a, b]) => openToolSettingsFor([a, b]), [note, timer]);
await page.waitForTimeout(250);
ok('with several tools, the menu offers them as one file', await page.isVisible('#toolSettingsExportJsonBulkBtn') &&
    await page.textContent('#toolSettingsExportJsonBulkBtn') === 'Export 2 Tools as JSON' && !(await page.isVisible('#toolSettingsExportJsonBtn')));
const both = await saveDownload(() => page.click('#toolSettingsExportJsonBulkBtn'));
ok('every one of them in it', both.data.tools.map(t => t.id).sort().join() === [note, timer].sort().join());
ok('named after the board', /-tools-\d{14}\.json$/.test(both.name), both.name);

// 4. Brought back on a fresh board, in another browser.
const other = await browser.newContext({ viewport: { width: 1200, height: 900 } });
const page2 = await other.newPage();
page2.on('pageerror', (e) => errors.push('second: ' + e.message));
await page2.goto('http://localhost:8777/index.html');
await page2.waitForSelector('#toolboard', { timeout: 20000 });
await page2.waitForTimeout(800);
await page2.evaluate((text) => { document.getElementById('importTextarea').value = text; return importData(); }, both.text);
await page2.waitForSelector('.agt-widget .agt-row', { timeout: 20000 });
await page2.waitForTimeout(500);
ok('Import from File brings them back', /Successfully imported 2 tool/.test(await page2.textContent('#importResult')), await page2.textContent('#importResult'));
const back = await page2.evaluate(() => {
    const notes = Object.entries(toolCustomizations).filter(([id, c]) => c.title === 'Trip Notes: Spring');
    const note = notes[0] && notes[0][0];
    const el = note && document.querySelector('.tool[data-tool="' + note + '"]');
    return { content: note && toolCustomizations[note].customContent, text: el && el.querySelector('.authoring-result').textContent,
        x: note && positions[note] && positions[note].x, timer: document.querySelector('.agt-widget .agt-name').value };
});
ok('the note, as it was', back.content === '# Trip notes\n\nBook flights.' && /Book flights/.test(back.text) && back.x === 321, JSON.stringify(back));
ok('and the plugin’s tool, its plugin loaded for it', back.timer === 'Hello and coffee');
await other.close();

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
