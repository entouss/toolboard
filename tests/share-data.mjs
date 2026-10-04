// Sharing a tool *with what is in it* — by link, and by way of the HTML export.
//
// Two things are easy to get wrong here and both are asserted on purpose. The
// first is where a share link points: it has to be the address of the board that
// built it, so a self-hosted Toolboard hands out itself rather than somewhere
// else. The second is that a link is content someone else chose, so nothing may
// reach the board before the person says so — and a script that came along has to
// arrive stopped.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const BASE = 'http://localhost:8777/index.html';

const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];
const watch = (p) => {
    p.on('pageerror', (e) => errors.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    return p;
};

// ── The sender ────────────────────────────────────────────────────────────────
const sender = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write']
});
const a = watch(await sender.newPage());
await a.goto(BASE + '#tool/project-table');
await a.waitForSelector('.proj-widget', { timeout: 30000 });
await a.waitForTimeout(800);

const instance = await a.evaluate(() =>
    document.querySelector('.proj-widget').closest('.tool').getAttribute('data-tool'));

const plan = (rows) => rows;
await a.evaluate(({ id }) => {
    const d = projGetData(id);
    d.rows = [
        { id: 'r-a', cells: { ticket: 'ABC-7', item: 'Shared row', size: 'M', pct: 25,
            deps: [], links: [{ label: 'Spec', url: 'https://example.com/spec' }],
            resources: ['Dana'] }, notes: { item: 'A note that must travel' } },
        { id: 'r-b', cells: { item: 'Second row', size: 'S', pct: 0, deps: ['r-a'], links: [] } }
    ];
    d.ticketBase = 'https://tickets.example.com/browse/';
    projSetData(id, d);
    const custom = loadToolCustomizations();
    custom[id].title = 'Autumn plan';
    saveToolCustomizations(custom);
    renderToolboard();
}, { id: instance });
await a.waitForTimeout(600);

// 1. The codec. A link is only worth making if what went in comes back out.
ok('what goes into a share link comes out of it unchanged', await a.evaluate(async () => {
    const original = { type: 'tools', exportedAt: 'now', tools: [{ id: 'x', isCustom: true,
        customizations: { title: 'Round trip', projectData: { rows: [{ id: 'r', cells: { item: 'éà中' } }] } },
        position: { x: 1, y: 2 } }] };
    const back = await decodeSharePayload(await encodeSharePayload(original));
    return JSON.stringify(back) === JSON.stringify(original);
}));
ok('and it travels compressed, so the link is shorter than the plan',
    await a.evaluate(async (id) => {
        const json = JSON.stringify(toolSharePayload(id)).length;
        const packed = (await encodeSharePayload(toolSharePayload(id))).length;
        return packed < json * 0.6;
    }, instance),
    await a.evaluate(async (id) => JSON.stringify(toolSharePayload(id)).length + 'B of JSON, ' +
        (await encodeSharePayload(toolSharePayload(id))).length + ' chars packed', instance));

// 2. Where it points. This is the whole question for anyone not on toolboard.me.
const link = await a.evaluate((id) => buildToolDataLink(id), instance);
ok('the link points back at the board that built it, not at a fixed address',
    link.startsWith('http://localhost:8777/index.html#'), link.slice(0, 60));
ok('it names the plugin rather than the local instance, so it means the same thing anywhere',
    link.includes('#tool/project-table?d='), link.slice(0, 80));
ok('and the whole plan fits in a link worth sending',
    link.length < 4000 && link.length < await a.evaluate(() => SHARE_LINK_MAX),
    link.length + ' chars');

// 3. The button people actually press.
ok('the tool settings offer the link beside the one without data',
    await a.evaluate(() => !!document.getElementById('toolSettingsCopyDataLinkBtn') &&
        !!document.getElementById('toolSettingsCopyLinkBtn')));
await a.evaluate((id) => { openToolSettingsFor([id], id); }, instance);
await a.waitForTimeout(300);
await a.click('#toolSettingsCopyDataLinkBtn');
await a.waitForTimeout(600);
const copied = await a.evaluate(() => navigator.clipboard.readText());
ok('pressing it copies a link with the plan in it',
    copied.includes('#tool/project-table?d=') && copied.length > 500, copied.slice(0, 60) + '…');
ok('and the copy is the same link the page would build',
    copied.split('?d=')[0] === link.split('?d=')[0]);

// 4. A script never arrives approved, however it travels.
ok('a tool that carries a script hands over the script but not the approval',
    await a.evaluate(async () => {
        const custom = loadToolCustomizations();
        custom['script-probe'] = { title: 'Runner', templateId: 'blank',
            toolScript: 'console.log(1)', scriptApproved: 'console.log(1)' };
        saveToolCustomizations(custom);
        const packed = await encodeSharePayload(toolSharePayload('script-probe'));
        const back = await decodeSharePayload(packed);
        const out = back.tools[0].customizations;
        delete custom['script-probe'];
        saveToolCustomizations(custom);
        return out.toolScript === 'console.log(1)' && !('scriptApproved' in out);
    }));

// 5. A tool too big for a link is said to be, rather than cut in half.
await a.evaluate((id) => {
    const d = projGetData(id);
    d.rows = Array.from({ length: 1200 }, (_, i) => ({ id: 'big-' + i,
        cells: { item: 'A task with a long enough name to take up room ' + i,
            ticket: 'ABC-' + i, size: 'M', pct: i % 100, deps: [], links: [] } }));
    projSetData(id, d);
}, instance);
const bigLink = await a.evaluate((id) => buildToolDataLink(id), instance);
ok('a plan can outgrow a link', bigLink.length > await a.evaluate(() => SHARE_LINK_MAX),
    bigLink.length + ' chars');
await a.evaluate((id) => { openToolSettingsFor([id], id); }, instance);
await a.waitForTimeout(300);
await a.click('#toolSettingsCopyDataLinkBtn');
await a.waitForTimeout(600);
const refusal = await a.evaluate(() =>
    [...document.querySelectorAll('.tool-toast, .toast, #toolToast')].map(n => n.textContent).join(' '));
ok('and then the sender is told, instead of being handed a link that arrives truncated',
    /too much/i.test(refusal), refusal.slice(0, 90));
ok('the clipboard still holds the link that worked',
    (await a.evaluate(() => navigator.clipboard.readText())) === copied);

// Put the small plan back for the rest of the suite.
await a.evaluate((id) => {
    const d = projGetData(id);
    d.rows = [{ id: 'r-a', cells: { ticket: 'ABC-7', item: 'Shared row', size: 'M', pct: 25,
        deps: [], links: [{ label: 'Spec', url: 'https://example.com/spec' }], resources: ['Dana'] },
        notes: { item: 'A note that must travel' } }];
    projSetData(id, d);
    renderToolboard();
}, instance);
await a.waitForTimeout(400);
const shareLink = await a.evaluate((id) => buildToolDataLink(id), instance);

// ── Where the links point ─────────────────────────────────────────────────────
// A board hands out its own address. Two cases need telling it otherwise, and both
// are the same setting: a page opened from a disk, which has no address worth
// sharing, and a board served from one address whose readers use another.
await a.evaluate(() => document.getElementById('importExportBtn').click());
await a.waitForTimeout(400);
ok('the field for it starts empty, filled in from the page behind it',
    await a.evaluate(() => document.getElementById('shareHomeInput').value) === '' &&
    await a.evaluate(() => document.getElementById('shareHomeInput').placeholder) ===
        'http://localhost:8777/index.html',
    await a.evaluate(() => document.getElementById('shareHomeInput').placeholder));
ok('and it says what a link will look like', /localhost:8777\/index\.html#tool/.test(
    await a.evaluate(() => document.getElementById('shareHomeNote').textContent)),
    await a.evaluate(() => document.getElementById('shareHomeNote').textContent));

await a.fill('#shareHomeInput', 'https://board.example.org');
await a.waitForTimeout(300);
ok('typing another address sends links there instead',
    (await a.evaluate((id) => buildToolDataLink(id), instance))
        .startsWith('https://board.example.org/#tool/project-table?d='),
    (await a.evaluate((id) => buildToolDataLink(id), instance)).slice(0, 55));
ok('and the missing slash is not a broken link',
    !(await a.evaluate((id) => buildToolDataLink(id), instance)).includes('org#'));

await a.fill('#shareHomeInput', 'board.example.org');
await a.waitForTimeout(300);
ok('something that is not a web address is refused rather than stored',
    (await a.evaluate((id) => buildToolDataLink(id), instance))
        .startsWith('http://localhost:8777/'),
    (await a.evaluate((id) => buildToolDataLink(id), instance)).slice(0, 40));
ok('and the field says so instead of failing quietly',
    /not a web address/i.test(await a.evaluate(() =>
        document.getElementById('shareHomeNote').textContent)),
    await a.evaluate(() => document.getElementById('shareHomeNote').textContent));

await a.click('#shareHomeReset');
await a.waitForTimeout(300);
ok('and resetting hands the board back its own address',
    (await a.evaluate((id) => buildToolDataLink(id), instance))
        .startsWith('http://localhost:8777/index.html#tool/'));
await a.evaluate(() => document.getElementById('importExportModal').classList.remove('open'));

// ── The receiver: a browser that has never seen this board or this plugin ─────
const fresh = () => browser.newContext({ viewport: { width: 1400, height: 900 } });
const toolsOn = (p) => p.evaluate(() => ({
    drawn: document.querySelectorAll('.proj-widget').length,
    stored: Object.keys(JSON.parse(localStorage.getItem('finance_default_toolCustomizations') || '{}')).length
}));

const settled = async (p, ms = 3500) => {
    await p.waitForTimeout(ms);
    return p.evaluate(() => !!document.querySelector('#importLinkOverlay.open'));
};

const r1 = await fresh();
const b = watch(await r1.newPage());
await b.goto(shareLink);
const asked = await settled(b);
ok('following the link asks, rather than helping itself to the board', asked, String(asked));
ok('and nothing has landed while it is asking',
    (await toolsOn(b)).drawn === 0 && (await toolsOn(b)).stored === 0,
    JSON.stringify(await toolsOn(b)));
ok('it says what it would add, by name', await b.evaluate(() =>
    document.getElementById('importLinkSummary').textContent).then(t => /Autumn plan/.test(t)),
    await b.evaluate(() => document.getElementById('importLinkSummary').textContent));
ok('and that nothing is being fetched, because the plan is in the link',
    /nothing is fetched/i.test(await b.evaluate(() =>
        document.getElementById('importLinkUrl').textContent)),
    await b.evaluate(() => document.getElementById('importLinkUrl').textContent));
ok('with no offer to keep in sync, which a link cannot do', await b.evaluate(() =>
    document.getElementById('importLinkKeep').closest('label').style.display === 'none'));
if (asked) await b.click('.import-link-actions .import-link-cancel');
await b.waitForTimeout(500);
ok('cancelling leaves the board as empty as it was', (await toolsOn(b)).stored === 0,
    JSON.stringify(await toolsOn(b)));
await r1.close();

const r2 = await fresh();
const c = watch(await r2.newPage());
await c.goto(shareLink);
ok('the same question is asked of whoever accepts it', await settled(c));
await c.click('#importLinkGo');
await c.waitForSelector('.proj-widget', { timeout: 20000 });
await c.waitForTimeout(1200);
ok('accepting draws the tool on the receiving board', (await toolsOn(c)).drawn === 1,
    JSON.stringify(await toolsOn(c)));
ok('with the plan that was shared', (await c.textContent('body')).includes('Shared row'));
ok('and the cell note that belonged to it', await c.evaluate(() => {
    const custom = JSON.parse(localStorage.getItem('finance_default_toolCustomizations') || '{}');
    return Object.values(custom).some(t => t.projectData &&
        (t.projectData.rows[0].notes || {}).item === 'A note that must travel');
}));
ok('and the board-wide settings it needs to make sense of itself', await c.evaluate(() => {
    const a = document.querySelector('.proj-ticket a');
    return a ? a.href : null;
}) === 'https://tickets.example.com/browse/ABC-7',
    await c.evaluate(() => (document.querySelector('.proj-ticket a') || {}).href));
ok('it opens maximized, like any tool link', await c.evaluate(() =>
    /fullscreen|maximized/.test((document.querySelector('.proj-widget').closest('.tool') || {}).className || '')),
    await c.evaluate(() => (document.querySelector('.proj-widget').closest('.tool') || {}).className));
// The hash it is left with is the ordinary one for a maximized tool — board and
// tool, and none of the payload, which would otherwise be re-offered on a reload.
ok('and the payload leaves the address bar once it has landed',
    await c.evaluate(() => !location.hash.includes('d=') &&
        /\/tool\/project-table$/.test(location.hash)),
    await c.evaluate(() => location.hash));
await c.reload();
await c.waitForTimeout(2500);
ok('the plugin came with it, so a reload still draws the tool',
    (await toolsOn(c)).drawn === 1, JSON.stringify(await toolsOn(c)));
await c.screenshot({ path: OUT + '/share-data-received.png' });
await r2.close();

// A link that has been mangled on the way, and one that was never a share link.
const r3 = await fresh();
const d = watch(await r3.newPage());
await d.goto(BASE + '#tool/project-table?d=1Zm9vYmFyCg');
await d.waitForTimeout(2500);
ok('a damaged link is reported rather than half-imported',
    (await toolsOn(d)).stored === 0 && !(await d.evaluate(() =>
        !!document.querySelector('#importLinkOverlay.open'))),
    JSON.stringify(await toolsOn(d)));
await d.goto(BASE + '#tool/project-table?d=hello');
await d.waitForTimeout(2000);
ok('and so is a link that never carried a tool at all',
    (await toolsOn(d)).stored === 0, JSON.stringify(await toolsOn(d)));
await r3.close();

// ── The HTML export, as a way back in ────────────────────────────────────────
const [dl] = await Promise.all([
    a.waitForEvent('download', { timeout: 20000 }),
    a.evaluate((id) => exportToolAsHtml(id), instance)
]);
const file = path.join(OUT, 'share-exported-tool.html');
fs.copyFileSync(await dl.path(), file);
const html = fs.readFileSync(file, 'utf8');
ok('the exported file still shows the plan', html.includes('Shared row'));
ok('and carries the tool itself, not just a picture of it',
    html.includes('id="toolboard-tool-payload"'));
ok('the way back points at the board that exported it',
    /<a class="tb-share-open" href="http:\/\/localhost:8777\/index\.html#tool\/project-table\?d=/.test(html),
    (html.match(/<a class="tb-share-open" href="[^"]{0,70}/) || [''])[0]);
ok('the bar is chrome, so it leaves on the way to paper',
    /@media print \{ \.tb-share \{ display: none; \} \}/.test(html));
ok('the file names where it came from rather than a fixed brand',
    html.includes('exported from localhost:8777') &&
    !/Exported from Toolboard\.me/.test(html));
ok('and the download button has a real import file to hand over',
    await (async () => {
        const b64 = (html.match(/id="toolboard-tool-payload" type="application\/json">([^<]+)</) || [])[1] || '';
        const json = JSON.parse(Buffer.from(b64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
        return json.type === 'tools' && json.tools[0].customizations.projectData.rows[0].cells.item === 'Shared row';
    })());

// A tool's markup is written against the app's variables and its plugin's CSS. An
// export that takes neither is a run of bare inputs, which is what this was.
ok('the exported file carries the styles the tool is written in',
    html.includes('.proj-widget') && html.includes('--proj-size-3'),
    'plugin css: ' + html.includes('.proj-widget') + ', its colours: ' + html.includes('--proj-size-3'));
ok('and the variables those styles are expressed in',
    html.includes('--text-primary') && html.includes('.authoring-split'));
ok('but not the dark ones, because the exported page is a white sheet',
    !/\.tool\b[^{]*\{[^}]*background:\s*var\(--bg-secondary\)[^}]*\}\s*$/.test(html) &&
    html.includes('body.dark-mode'));

// The whole way round: open the file from disk, press the button, land on a board.
const r4 = await fresh();
const e = watch(await r4.newPage());
await e.goto('file://' + file);
await e.waitForTimeout(600);
const look = await e.evaluate(() => {
    const tool = document.querySelector('.tool');
    const chip = document.querySelector('.proj-size-select');
    const bar = document.querySelector('.proj-toolbar');
    const head = document.querySelector('.proj-table th, table th');
    return {
        position: getComputedStyle(tool).position,
        wide: tool.getBoundingClientRect().width,
        chip: chip ? getComputedStyle(chip).backgroundColor : null,
        toolbar: bar ? getComputedStyle(bar).opacity : null,
        headWeight: head ? getComputedStyle(head).fontWeight : null,
        darkBody: getComputedStyle(document.body).backgroundColor
    };
});
ok('the tool is laid out as a page rather than pinned to a board',
    look.position === 'static' && look.wide > 700, JSON.stringify(look));
ok('its own colours survive, so the sizes still read as sizes',
    !!look.chip && look.chip !== 'rgba(0, 0, 0, 0)', String(look.chip));
ok('the table is a table rather than a run of text',
    look.headWeight && Number(look.headWeight) >= 600, String(look.headWeight));
ok('the buttons that build a plan stay out of a page meant to be read',
    look.toolbar === '0', String(look.toolbar));
ok('and the page is light however the board that exported it was dressed',
    look.darkBody === 'rgb(245, 245, 245)', look.darkBody);
ok('the file opened from disk offers the way back in', await e.evaluate(() =>
    !!document.querySelector('.tb-share-open')));
await e.click('.tb-share-open');
const askedFromFile = await settled(e, 6000);
ok('pressing it arrives at the board, asking', askedFromFile && /Autumn plan/.test(
    await e.evaluate(() => document.getElementById('importLinkSummary').textContent)),
    await e.evaluate(() => document.getElementById('importLinkSummary').textContent));
await e.click('#importLinkGo');
await e.waitForSelector('.proj-widget', { timeout: 20000 });
await e.waitForTimeout(1000);
ok('and the plan that was in the file is now on a board',
    (await e.textContent('body')).includes('Shared row'));
await e.screenshot({ path: OUT + '/share-from-html.png' });
await r4.close();

// A written note is the other thing this export is for. The authoring mode is a
// class on the tool element, so an export that dropped it showed the Markdown
// source and the page it renders to, one above the other.
const noteId = await a.evaluate(() => {
    const id = createNoteWithTemplate('blank', { skipEditor: true });
    const custom = loadToolCustomizations();
    custom[id] = { ...custom[id], title: 'Release notes',
        customContent: '## What changed\n\nA paragraph, with a [link](https://example.com).\n\n- One\n- Two\n' };
    saveToolCustomizations(custom);
    renderToolboard();
    return id;
});
await a.waitForTimeout(800);
const [noteDl] = await Promise.all([
    a.waitForEvent('download', { timeout: 20000 }),
    a.evaluate((id) => exportToolAsHtml(id), noteId)
]);
const noteFile = path.join(OUT, 'share-exported-note.html');
fs.copyFileSync(await noteDl.path(), noteFile);
const r5 = await fresh();
const f = watch(await r5.newPage());
await f.goto('file://' + noteFile);
await f.waitForTimeout(600);
const note = await f.evaluate(() => {
    const src = document.querySelector('.note-source');
    const out = document.querySelector('.markdown-content');
    return {
        source: src ? getComputedStyle(src.closest('.authoring-source')).display : 'absent',
        rendered: out ? out.innerText.trim().slice(0, 30) : null,
        heading: !!document.querySelector('.markdown-content h2')
    };
});
ok('a written note exports as the page it renders to', note.heading &&
    /What changed/.test(note.rendered || ''), JSON.stringify(note));
ok('and not as that page with the Markdown behind it printed above',
    note.source === 'none', JSON.stringify(note));
await f.screenshot({ path: OUT + '/share-exported-note.png' });
await r5.close();

// A board opened from a disk has no address of its own to hand out. It used to
// name toolboard.me and nothing could be done about it, which is wrong for anyone
// whose Toolboard lives elsewhere — and useless where that host cannot be reached.
const r6 = await fresh();
const g = watch(await r6.newPage());
await g.goto('file://' + path.join(HERE, '..', 'index.html'));
await g.waitForTimeout(2500);
ok('a board opened from a disk falls back to the published site',
    await g.evaluate(() => shareHomeAutomatic()) === 'https://toolboard.me/',
    await g.evaluate(() => shareHomeAutomatic()));
const diskNote = await g.evaluate(() => {
    const id = createNoteWithTemplate('blank', { skipEditor: true });
    const custom = loadToolCustomizations();
    custom[id] = { ...custom[id], title: 'From a disk', customContent: 'Written offline.' };
    saveToolCustomizations(custom);
    renderToolboard();
    return id;
});
await g.waitForTimeout(600);
ok('so that is where its links point, when it has not been told otherwise',
    (await g.evaluate((id) => buildToolDataLink(id), diskNote)).startsWith('https://toolboard.me/#tool/'),
    (await g.evaluate((id) => buildToolDataLink(id), diskNote)).slice(0, 40));
await g.evaluate(() => setShareHome('https://board.example.org/'));
ok('and telling it where the board really lives moves them',
    (await g.evaluate((id) => buildToolDataLink(id), diskNote))
        .startsWith('https://board.example.org/#tool/'),
    (await g.evaluate((id) => buildToolDataLink(id), diskNote)).slice(0, 40));

const [diskDl] = await Promise.all([
    g.waitForEvent('download', { timeout: 20000 }),
    g.evaluate((id) => exportToolAsHtml(id), diskNote)
]);
const diskFile = path.join(OUT, 'share-exported-offline.html');
fs.copyFileSync(await diskDl.path(), diskFile);
const diskHtml = fs.readFileSync(diskFile, 'utf8');
ok('a file exported from that disk says where it really came from',
    diskHtml.includes('exported from board.example.org') &&
    !diskHtml.includes('toolboard.me'),
    (diskHtml.match(/exported from [^<]{0,40}/) || [''])[0]);
ok('and its way back leads there too',
    /<a class="tb-share-open" href="https:\/\/board\.example\.org\/#tool\/blank\?d=/.test(diskHtml),
    (diskHtml.match(/<a class="tb-share-open" href="[^"]{0,60}/) || [''])[0]);
await r6.close();

ok('no page errors anywhere in that', errors.length === 0, JSON.stringify(errors).slice(0, 400));
await browser.close();
