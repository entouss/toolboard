// Loading tools from a URL, and keeping a board in sync with one. The case that
// matters most is the one a naive implementation gets wrong: a linked source is
// re-fetched on every load, so loading twice must not leave two of everything.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

// The fixture is served by the runner from tests/out, so "the source changed" is a
// real re-fetch of a file that really changed, not a stub.
const NAME = 'import-url-source.json';
const FIXTURE = path.join(OUT, NAME);
const URL_OF = (n) => 'http://localhost:8777/tests/out/' + n;

const payload = (text, title) => ({
    type: 'tools',
    exportedAt: new Date().toISOString(),
    tools: [{
        id: 'custom-shared-1',
        isCustom: true,
        customizations: { title: title, templateId: 'blank', customContent: text },
        position: { x: 40, y: 40, z: 1, width: 300, height: 200 }
    }, {
        id: 'custom-shared-2',
        isCustom: true,
        customizations: { title: 'Second', templateId: 'blank', customContent: 'two' },
        position: { x: 380, y: 40, z: 2, width: 300, height: 200 }
    }]
});

const write = (obj, file = FIXTURE) => fs.writeFileSync(file, JSON.stringify(obj, null, 2));
write(payload('first version', 'Shared Note'));
write({ type: 'boards', exportedAt: new Date().toISOString(), boards: [{ id: 'imported', name: 'Imported Board' }] },
    path.join(OUT, 'import-url-boards.json'));
fs.writeFileSync(path.join(OUT, 'import-url-bad.json'), 'this is not json');
// A tool made from a plugin's template, to prove the plugin comes with it.
write({
    type: 'tools', exportedAt: new Date().toISOString(),
    tools: [{
        id: 'custom-needs-plugin', isCustom: true,
        customizations: { title: 'Stopwatch', templateId: 'stopwatch' },
        position: { x: 60, y: 60, z: 1, width: 300, height: 240 }
    }]
}, path.join(OUT, 'import-url-plugin.json'));

const seed = () => {
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('financeCurrentBoard', 'default');
};

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
// deleteTool asks with a native confirm, which Playwright dismisses unless told.
page.on('dialog', (d) => d.accept());
await page.addInitScript(seed);

// A unique query each time: going from "#import?…" back to no hash is otherwise a
// fragment navigation, which does not reload the page — and a linked source is only
// re-fetched on a real load.
const goto = async (hash = '') => {
    await page.goto('http://localhost:8777/index.html?t=' + Date.now() + hash);
    await page.waitForSelector('#toolboard', { timeout: 20000 });
    await page.waitForTimeout(1200);
};

const state = () => page.evaluate(() => ({
    tools: [...document.querySelectorAll('.tool')].map(t => t.getAttribute('data-tool')),
    custom: customTools.slice(),
    sources: JSON.parse(JSON.stringify(linkedSources)),
    content: Object.fromEntries(Object.entries(toolCustomizations).map(([k, v]) => [k, v.customContent])),
    positions: JSON.parse(JSON.stringify(positions))
}));

// Empty the board without going through the confirm dialogs — this is setup, not
// the thing under test.
const clearBoard = () => page.evaluate(() => {
    customTools.length = 0;
    saveCustomTools(customTools);
    Object.keys(toolCustomizations).forEach(k => delete toolCustomizations[k]);
    saveToolCustomizations(toolCustomizations);
    Object.keys(positions).forEach(k => delete positions[k]);
    savePositions(positions);
    linkedSources.length = 0;
    saveLinkedSources(linkedSources);
    renderToolboard();
}).then(() => page.waitForTimeout(300));

// Idempotent: the panel is often already open from the step before, and clicking
// the header button again would just be blocked by the modal covering it.
const openImportPanel = async () => {
    const open = await page.evaluate(() =>
        document.getElementById('importExportModal').classList.contains('open'));
    if (!open) {
        await page.click('#importExportBtn');
        await page.waitForTimeout(250);
    }
    await page.click('.import-export-tab[data-tab="import"]');
    await page.waitForTimeout(250);
};

const loadUrl = async (url, keep) => {
    await page.fill('#importUrlInput', url);
    await page.evaluate((k) => { document.getElementById('importUrlKeep').checked = k; }, keep);
    await page.click('#importUrlBtn');
    await page.waitForTimeout(900);
    return page.evaluate(() => document.getElementById('importUrlResult').textContent);
};

// 1. A plain load is a copy, and records nothing.
await goto();
await openImportPanel();
let msg = await loadUrl(URL_OF(NAME), false);
let s = await state();
ok('a URL load brings the tools in', s.custom.length === 2, JSON.stringify(s.custom));
ok('and says what it loaded', /Loaded 2 tools/.test(msg), msg);
ok('an unlinked load records no source', s.sources.length === 0, JSON.stringify(s.sources));

// 2. Linked: recorded, with the map that makes syncing possible.
await clearBoard();
msg = await loadUrl(URL_OF(NAME), true);
s = await state();
ok('a linked load brings the tools in', s.custom.length === 2, JSON.stringify(s.custom));
ok('and says it is keeping them in sync', /kept in sync/.test(msg), msg);
ok('recording the source', s.sources.length === 1 && s.sources[0].url === URL_OF(NAME), JSON.stringify(s.sources));
ok('with a map of what it placed', Object.keys(s.sources[0].map).length === 2, JSON.stringify(s.sources[0].map));
ok('the source is listed in the panel',
    await page.evaluate(() => document.querySelectorAll('.linked-source').length) === 1);

// 3. The one that matters: reloading re-fetches, and must not duplicate.
await goto();
const after1 = await state();
await goto();
const after2 = await state();
ok('a reload does not duplicate the tools', after1.custom.length === 2 && after2.custom.length === 2,
    JSON.stringify([after1.custom.length, after2.custom.length]));
ok('and keeps the same ids', JSON.stringify(after1.custom) === JSON.stringify(after2.custom),
    JSON.stringify(after2.custom));
ok('the map does not grow either', Object.keys(after2.sources[0].map).length === 2,
    JSON.stringify(after2.sources[0].map));

// 4. A changed source updates in place, and leaves the window where it was put.
await page.evaluate(() => {
    positions['custom-shared-1'] = { ...positions['custom-shared-1'], x: 777, y: 333 };
    savePositions(positions);
});
write(payload('second version', 'Shared Note'));
await goto();
s = await state();
ok('a changed source updates the content', s.content['custom-shared-1'] === 'second version',
    String(s.content['custom-shared-1']));
ok('without moving the tool', s.positions['custom-shared-1'].x === 777 && s.positions['custom-shared-1'].y === 333,
    JSON.stringify(s.positions['custom-shared-1']));
ok('and still without duplicating', s.custom.length === 2, JSON.stringify(s.custom));

// 5. A tool deleted here is not resurrected by the next sync.
await page.evaluate(() => deleteTool('custom-shared-2'));
await page.waitForTimeout(400);
await goto();
s = await state();
ok('a deleted tool stays deleted', !s.custom.includes('custom-shared-2'), JSON.stringify(s.custom));
ok('and the other one is still synced', s.custom.includes('custom-shared-1'), JSON.stringify(s.custom));

// 5b. But asking for it back gets it back. A page load must not undo a deletion;
//     pressing Load means "put these on my board", and has to be able to.
await openImportPanel();
msg = await loadUrl(URL_OF(NAME), true);
s = await state();
ok('loading again brings a deleted tool back', s.custom.includes('custom-shared-2'),
    JSON.stringify(s.custom));
ok('and says it added one rather than claiming a no-op loaded', /1 added/.test(msg), msg);
ok('without duplicating the one that was already there',
    s.custom.filter(id => id === 'custom-shared-1').length === 1, JSON.stringify(s.custom));
ok('and the map still has one entry per source tool',
    Object.keys(s.sources[0].map).length === 2, JSON.stringify(s.sources[0].map));

// Deleted again, Reload now is the other way back — the one the docs promise.
await page.evaluate(() => deleteTool('custom-shared-2'));
await page.waitForTimeout(400);
await openImportPanel();
await page.click('.linked-source [data-reload]');
await page.waitForTimeout(1200);
s = await state();
ok('Reload now also brings it back', s.custom.includes('custom-shared-2'), JSON.stringify(s.custom));

// And a page load still leaves a deletion alone.
await page.evaluate(() => deleteTool('custom-shared-2'));
await page.waitForTimeout(400);
await goto();
s = await state();
ok('while a page load still respects the deletion', !s.custom.includes('custom-shared-2'),
    JSON.stringify(s.custom));

// 6. Unlinking stops the syncing but leaves the tools.
await openImportPanel();
await page.click('.linked-source [data-unlink]');
await page.waitForTimeout(400);
s = await state();
ok('unlinking drops the source', s.sources.length === 0, JSON.stringify(s.sources));
ok('but leaves the tools on the board', s.custom.includes('custom-shared-1'), JSON.stringify(s.custom));

// 7. Failures are readable, and write nothing.
await openImportPanel();
const before = (await state()).custom.length;
msg = await loadUrl('http://localhost:8777/tests/out/no-such-file.json', false);
ok('a 404 is reported', /404/.test(msg), msg);
msg = await loadUrl(URL_OF('import-url-bad.json'), false);
ok('a non-JSON body is reported', /not JSON/i.test(msg), msg);
msg = await loadUrl(URL_OF('import-url-boards.json'), true);
ok('a boards export refuses to be linked', /only a tools export/i.test(msg), msg);
ok('and none of those touched the board', (await state()).custom.length === before,
    JSON.stringify((await state()).custom));

// A boards export still loads as a copy.
msg = await loadUrl(URL_OF('import-url-boards.json'), false);
ok('a boards export loads as a copy', /Loaded 1 board/.test(msg), msg);

// 8. The link route asks before it writes.
await clearBoard();
await goto('#import?src=' + encodeURIComponent(URL_OF(NAME)) + '&link=1');
ok('a #import link opens a confirmation',
    await page.evaluate(() => document.getElementById('importLinkOverlay').classList.contains('open')));
ok('naming what it would add',
    await page.evaluate(() => document.getElementById('importLinkSummary').textContent) === '2 tools');
ok('and the URL it came from',
    (await page.evaluate(() => document.getElementById('importLinkUrl').textContent)).includes('import-url-source.json'));
ok('nothing is written before it is accepted', (await state()).custom.length === 0,
    JSON.stringify((await state()).custom));

await page.click('.import-link-cancel');
await page.waitForTimeout(300);
ok('cancelling writes nothing', (await state()).custom.length === 0, JSON.stringify((await state()).custom));

await goto('#import?src=' + encodeURIComponent(URL_OF(NAME)) + '&link=1');
await page.click('#importLinkGo');
await page.waitForTimeout(900);
s = await state();
ok('accepting loads the tools', s.custom.length === 2, JSON.stringify(s.custom));
ok('and the link asked for them to stay in sync', s.sources.length === 1, JSON.stringify(s.sources));

// A board named in the hash still works, and a bare "#import" is still a board name.
ok('"#import" with no src is still just a board name', await page.evaluate(() =>
    parseToolboardHash('#import').boardName === 'import' && !parseToolboardHash('#import').importRoute));

// 9. A tool is no use without the plugin that draws it, so importing brings it.
await clearBoard();
await page.evaluate(() => localStorage.removeItem('toolboard_pluginUrls'));
await goto();
await openImportPanel();
msg = await loadUrl(URL_OF('import-url-plugin.json'), false);
await page.waitForTimeout(1500);
const plugged = await page.evaluate(() => ({
    installed: JSON.parse(localStorage.getItem('toolboard_pluginUrls') || '[]'),
    widget: !!document.querySelector('.stopwatch-widget')
}));
ok('importing a tool installs the plugin that provides it',
    plugged.installed.some(u => /productivity-tools/.test(u)), JSON.stringify(plugged.installed));
ok('so it renders as itself rather than an empty note', plugged.widget, JSON.stringify(plugged));

// 10. The link to hand to someone else.
//
// `#import?src=…` was documented and never offered, so sharing an export meant
// percent-encoding a URL inside a hash by hand — the kind of thing a person gets
// wrong once and then stops trusting. The panel builds it now.
await clearBoard();
await goto();
await openImportPanel();

const shareState = () => page.evaluate(() => ({
    shown: document.getElementById('importShareRow').style.display !== 'none',
    link: document.getElementById('importShareLink').value
}));

await page.fill('#importUrlInput', 'not a url');
await page.waitForTimeout(200);
ok('nothing to share until the URL is one', !(await shareState()).shown, JSON.stringify(await shareState()));

await page.fill('#importUrlInput', '/tests/out/' + NAME);
await page.waitForTimeout(200);
ok('and a relative path is not offered, since it would resolve against their board',
    !(await shareState()).shown, JSON.stringify(await shareState()));

await page.fill('#importUrlInput', URL_OF(NAME));
await page.waitForTimeout(200);
let share = await shareState();
ok('an absolute URL gets a link, as it is typed', share.shown, JSON.stringify(share));
ok('with the source percent-encoded inside the hash',
    share.link.includes('#import?src=' + encodeURIComponent(URL_OF(NAME))), share.link);
ok('pointing at this board\'s own address, so a self-hosted copy hands out itself',
    share.link.startsWith('http://localhost:8777/index.html#'), share.link);
ok('and not naming the board I happen to be on',
    !/#[^/]+\/import/.test(share.link), share.link);
ok('keep in sync is off, so the link does not ask for it', !/link=1/.test(share.link), share.link);

await page.click('#importUrlKeep');
await page.waitForTimeout(200);
share = await shareState();
ok('ticking keep in sync puts that in the link', /&link=1$/.test(share.link), share.link);

// The link has to survive the load that clears the field.
await page.click('#importUrlBtn');
await page.waitForTimeout(1200);
share = await shareState();
ok('loading clears the input but keeps the link — it is the URL that just worked',
    share.shown && share.link.includes(encodeURIComponent(URL_OF(NAME))), JSON.stringify(share));
ok('and the input really did clear',
    await page.evaluate(() => document.getElementById('importUrlInput').value) === '');

// A source already linked is the likeliest thing to pass on.
ok('a linked source offers its own copy button',
    await page.evaluate(() => !!document.querySelector('.linked-source [data-share]')));

// The proof: the link the panel built actually loads.
const built = share.link;
await clearBoard();
await page.goto(built);
await page.waitForSelector('#importLinkGo', { timeout: 20000 });
await page.click('#importLinkGo');
await page.waitForTimeout(1200);
s = await state();
ok('the link the panel wrote out loads the tools when followed',
    s.custom.length === 2, JSON.stringify(s.custom));
ok('and carries the keep-in-sync it was built with', s.sources.length === 1, JSON.stringify(s.sources));

const realErrors = errors.filter(e => !/Failed to load resource/.test(e));
ok('no page errors', realErrors.length === 0, JSON.stringify(realErrors).slice(0, 400));
await page.screenshot({ path: OUT + '/import-url.png' });
await browser.close();
