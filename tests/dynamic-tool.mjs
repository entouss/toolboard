// A tool the user writes themselves: markup, a script, and the data the script
// reads. None of this is new capability — a note has always rendered raw HTML
// through innerHTML, so an inline onclick already ran — so what is under test here
// is not "can JavaScript run" but whether the lifecycle around it holds: that the
// script runs when the tool is opened rather than only when it is clicked, that
// two copies on one board cannot reach into each other, that what it stores comes
// back after a reload, and that a script which breaks says so in the tool instead
// of taking the board down with it.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

const seed = () => {
    // A second board to switch away to, for the teardown a running tool needs.
    localStorage.setItem('financeBoards', JSON.stringify([
        { id: 'default', name: 'Toolboard' },
        { id: 'second', name: 'Second Board' }
    ]));
    localStorage.setItem('financeCurrentBoard', 'default');
    // The tool a new one starts as opens a tab. Record where it would have gone
    // rather than letting it go there.
    window.__opened = null;
    window.open = (url) => { window.__opened = url; return null; };
};

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
// deleteTool asks with a native confirm, which Playwright dismisses unless told.
page.on('dialog', (d) => d.accept());
await page.addInitScript(seed);

const goto = async () => {
    await page.goto('http://localhost:8777/index.html?t=' + Date.now());
    await page.waitForSelector('#toolboard', { timeout: 20000 });
    await page.waitForTimeout(1200);
};

// Made straight from the template, then filled in — the picker has its own test
// below, and everything else here is about what the tool does once it exists.
const makeTool = (fields) => page.evaluate((f) => {
    const id = createNoteWithTemplate('script', { skipEditor: true });
    Object.assign(toolCustomizations[id], f || {});
    // Putting a script here stands for typing one into the pane: the person at
    // this browser wrote it, so it is theirs and runs. Code that arrived from
    // somewhere else is section 12, and does not.
    if (f && f.toolScript) toolCustomizations[id].scriptApproved = f.toolScript;
    saveToolCustomizations(toolCustomizations);
    setToolMode(id, 'split');
    return id;
}, fields).then(async (id) => { await page.waitForTimeout(300); return id; });

const sel = (id, s) => '.tool[data-tool="' + id + '"] ' + s;
const pane = (id, field) => sel(id, '.dyn-source[data-field="' + field + '"]');

// A field is only on screen when its own tab is, so every edit goes through the
// tab the way a person's would. Typing is saved at once and run 400ms later, so
// that half-written code is never executed; each edit waits that out.
const TAB_OF = { customContent: 'body', toolScript: 'script', toolData: 'data' };
const type = async (id, field, text) => {
    await page.click(sel(id, '.dyn-tab[data-tab="' + TAB_OF[field] + '"]'));
    await page.fill(pane(id, field), text);
    await page.waitForTimeout(700);
};

/** Raise a window before clicking inside it. By the end of this suite a dozen tools
 *  are stacked with the usual offset, so one tool's header sits over another's
 *  controls — which a person resolves by clicking the window first. */
const focusTool = (id) => page.evaluate((i) => {
    const t = document.querySelector('.tool[data-tool="' + i + '"]');
    if (t) t.style.zIndex = ++maxZ;
}, id);

/** Bring a tab to the front, for the panes that hold controls rather than text. */
const showTab = async (id, tab) => {
    await focusTool(id);
    await page.click(sel(id, '.dyn-tab[data-tab="' + tab + '"]'));
    await page.waitForTimeout(150);
};

const resultText = (id) => page.textContent(sel(id, '.authoring-result'));
const errorOf = (id) => page.evaluate((s) => {
    const strip = document.querySelector(s);
    return { shown: !!strip && strip.style.display !== 'none', text: strip ? strip.textContent : null };
}, sel(id, '.dyn-error'));

await goto();

// 1. What you get for pressing the button: a tool that already works, and is its
//    own explanation of what `el`, `data` and `api` are.
const starter = await page.evaluate(() => createNoteWithTemplate('script'));
await page.waitForTimeout(700);

ok('a new dynamic tool opens with the source and the running tool side by side',
    await page.evaluate((id) => document.querySelector('.tool[data-tool="' + id + '"]')
        .classList.contains('authoring-split'), starter));
ok('its source is four tabs: the markup, the script, the data and where to read from',
    await page.evaluate((id) => [...document.querySelectorAll('.tool[data-tool="' + id + '"] .dyn-tab')]
        .map(b => b.textContent).join(','), starter) === 'Body,Script,Data,Source');
ok('and a ? in the header, because none of that is guessable',
    await page.evaluate((id) => {
        const btn = document.querySelector('.tool[data-tool="' + id + '"] .guide-btn');
        return !!btn && guideFor(id) === 'learn/tools/dynamic-tool.html';
    }, starter));
ok('the markup it ships with is rendered', await page.evaluate((s) => !!document.querySelector(s),
    sel(starter, '.authoring-result .q')));

await page.fill(sel(starter, '.authoring-result .q'), 'toolboard');
await page.click(sel(starter, '.authoring-result .go'));
await page.waitForTimeout(200);
ok('and its script answers the button with the url its data describes',
    await page.evaluate(() => window.__opened) === 'https://example.com/search?q=toolboard',
    await page.evaluate(() => window.__opened));

// 2. The data tab is the part you change without writing code — the whole reason
//    it is a field of its own rather than a constant at the top of the script.
await type(starter, 'toolData', '{"url": "https://example.org/?s={q}"}');
await page.fill(sel(starter, '.authoring-result .q'), 'again');
await page.click(sel(starter, '.authoring-result .go'));
await page.waitForTimeout(200);
ok('changing the data changes what the tool does, with the script untouched',
    await page.evaluate(() => window.__opened) === 'https://example.org/?s=again',
    await page.evaluate(() => window.__opened));

ok('and the tab it was left on is remembered', await page.evaluate((id) =>
    (toolCustomizations[id] || {}).scriptTab, starter) === 'data');

// 3. Each pane edits the thing it is named for.
const wired = await makeTool({
    customContent: '<p class="out">unset</p>',
    toolScript: 'el.querySelector(".out").textContent = data.label;',
    toolData: '{"label": "first"}'
});
ok('a script writes into the markup below it', await resultText(wired) === 'first', await resultText(wired));

await type(wired, 'customContent', '<p class="out">unset</p><i class="extra">!</i>');
ok('editing the body redraws the tool and runs the script against the new markup',
    await resultText(wired) === 'first!', await resultText(wired));

await type(wired, 'toolScript', 'el.querySelector(".out").textContent = data.label.toUpperCase();');
ok('editing the script takes effect on the next run', await resultText(wired) === 'FIRST!', await resultText(wired));

// Every run starts from the stored markup, so a script that rewrote the DOM last
// time is not handed its own leftovers.
await type(wired, 'toolScript', 'el.innerHTML = "<span class=\\"once\\">" + data.label + "</span>";');
await type(wired, 'toolScript', 'el.innerHTML = "<span class=\\"once\\">" + data.label + "</span>";\n');
ok('and a script that replaces the whole result does not accumulate copies of it',
    await page.evaluate((s) => document.querySelectorAll(s).length, sel(wired, '.once')) === 1);

// 4. Instance isolation — the rule every tool in this app follows, and the one a
//    shared global scope makes easiest to break.
const twinA = await makeTool({
    customContent: '<b class="twin"></b>',
    toolScript: 'el.querySelector(".twin").textContent = api.toolId;'
});
const twinB = await makeTool({
    customContent: '<b class="twin"></b>',
    toolScript: 'el.querySelector(".twin").textContent = api.toolId;'
});
const twins = await page.evaluate(() => [...document.querySelectorAll('.twin')]
    .map(t => ({ wrote: t.textContent, into: t.closest('.tool').getAttribute('data-tool') })));
ok('two dynamic tools on one board each write only into their own window',
    twins.length === 2 && twins.every(t => t.wrote === t.into), JSON.stringify(twins));
ok('and they are separate instances', twinA !== twinB);

// 5. What the script stores is the tool's state, and comes back with the tool.
const counter = await makeTool({
    customContent: '<span class="count"></span>',
    toolScript: 'const n = (data.runs || 0) + 1;\napi.save({ runs: n });\nel.querySelector(".count").textContent = n;',
    toolData: '{}'
});
ok('api.save writes the script\'s state back into the data tab',
    await page.evaluate((id) => JSON.parse(toolCustomizations[id].toolData).runs, counter) === 1);
ok('and the data pane shows it, so the state is visible rather than hidden',
    await page.inputValue(pane(counter, 'toolData')) === '{\n    "runs": 1\n}',
    JSON.stringify(await page.inputValue(pane(counter, 'toolData'))));

await goto();
ok('a dynamic tool comes back running after a reload',
    await resultText(counter) === '2', await resultText(counter));
ok('with the markup, script and data it was left with', await page.evaluate((id) => {
    const c = toolCustomizations[id] || {};
    return !!c.customContent && !!c.toolScript && !!c.toolData;
}, counter));
ok('and the tool that was made first is still there too',
    await page.evaluate((s) => !!document.querySelector(s), sel(starter, '.authoring-result .go')));

// 6. Teardown. A tool that starts something of its own has to be able to stop it,
//    or a timer outlives the board and a second copy starts on the way back.
await page.evaluate(() => { window.__stopped = 0; window.__ticks = 0; });
const ticker = await makeTool({
    customContent: '<span class="tick"></span>',
    toolScript: 'const t = setInterval(() => { window.__ticks++; }, 50);\n' +
        'api.onCleanup(() => { clearInterval(t); window.__stopped++; });'
});
await page.waitForTimeout(300);
ok('a script can start something that keeps running',
    await page.evaluate(() => window.__ticks) > 0, String(await page.evaluate(() => window.__ticks)));

await type(ticker, 'toolData', '{"nudge": 1}');
ok('re-running the tool stops what the last run started first',
    await page.evaluate(() => window.__stopped) === 1, String(await page.evaluate(() => window.__stopped)));

await page.evaluate(() => switchToBoard('second'));
await page.waitForTimeout(600);
const ticksAfterSwitch = await page.evaluate(() => window.__ticks);
await page.waitForTimeout(400);
ok('switching board stops it as well',
    await page.evaluate(() => window.__stopped) === 2, String(await page.evaluate(() => window.__stopped)));
ok('and it really has stopped ticking, not just lost its window',
    await page.evaluate(() => window.__ticks) === ticksAfterSwitch);

await page.evaluate(() => switchToBoard('default'));
await page.waitForTimeout(800);
await page.evaluate(() => { window.__stopped = 0; });
await page.evaluate((id) => deleteTool(id), ticker);
await page.waitForTimeout(400);
ok('deleting the tool stops it too',
    await page.evaluate(() => window.__stopped) === 1, String(await page.evaluate(() => window.__stopped)));

// 7. A script that breaks says so where the person who wrote it is looking.
const broken = await makeTool({
    customContent: '<p class="out">markup</p>',
    toolScript: 'missingThing.explode();'
});
let strip = await errorOf(broken);
ok('a script that throws reports itself inside the tool', strip.shown && /missingThing/.test(strip.text),
    JSON.stringify(strip));
ok('the markup is still drawn, so the tool is not a blank box', await resultText(broken) === 'markup');
ok('and the rest of the board is unharmed',
    await page.evaluate((s) => !!document.querySelector(s), sel(starter, '.authoring-result .go')));

await type(broken, 'toolScript', 'el.querySelector(".out").textContent = "fixed";');
strip = await errorOf(broken);
ok('fixing it clears the error', !strip.shown, JSON.stringify(strip));
ok('and the tool runs again', await resultText(broken) === 'fixed', await resultText(broken));

// 8. The data field. Text that opens like JSON was meant as JSON, so a typo there
//    is a mistake to report rather than a string to hand over.
await type(broken, 'toolData', '{"label": }');
strip = await errorOf(broken);
ok('invalid JSON in the data tab is named as invalid JSON',
    strip.shown && /not valid JSON/.test(strip.text), JSON.stringify(strip).slice(0, 140));

const plain = await makeTool({
    customContent: '<p class="out"></p>',
    toolScript: 'el.querySelector(".out").textContent = typeof data + ":" + data;',
    toolData: 'just some text'
});
ok('data that is not JSON arrives as the string it is',
    await resultText(plain) === 'string:just some text', await resultText(plain));

const empty = await makeTool({
    customContent: '<p class="out"></p>',
    toolScript: 'el.querySelector(".out").textContent = JSON.stringify(data);',
    toolData: ''
});
ok('and an empty data tab arrives as an empty object, not undefined',
    await resultText(empty) === '{}', await resultText(empty));

// 9. Reachable without knowing the console exists.
await page.click('#addToolBtn');
await page.waitForTimeout(400);
await page.fill('#featureSearchInput', 'javascript');
await page.waitForTimeout(400);
ok('searching the Add Tool menu for javascript finds it', await page.evaluate(() =>
    [...document.querySelectorAll('#featureSelectModal .feature-select-item')]
        .some(e => e.getAttribute('data-template') === 'script')));
await page.evaluate(() => {
    const el = [...document.querySelectorAll('#featureSelectModal .feature-select-item')]
        .find(e => e.getAttribute('data-template') === 'script');
    el.click();
});
await page.waitForTimeout(900);
const fromMenu = await page.evaluate(() => customTools[customTools.length - 1]);
ok('and adding it from there gives a tool that is already running',
    await page.evaluate((s) => !!document.querySelector(s), sel(fromMenu, '.authoring-result .go')));

// 10. View is the finished tool and nothing else — the mode you leave one in.
await page.evaluate((id) => setToolMode(id, 'render'), fromMenu);
await page.waitForTimeout(400);
ok('View hides the source', await page.evaluate((s) =>
    getComputedStyle(document.querySelector(s)).display === 'none', sel(fromMenu, '.authoring-source')));
ok('and leaves the tool running', await page.evaluate((s) => !!document.querySelector(s),
    sel(fromMenu, '.authoring-result .go')));

// 11. The note shares the shell this tool extended. It must be untouched by it:
//     both now say the shell owns the content, and a second copy underneath is
//     what getting that wrong looks like.
const note = await page.evaluate(() => {
    const id = createNoteWithTemplate('blank', { skipEditor: true });
    toolCustomizations[id].customContent = '# Heading\n\nsome text';
    saveToolCustomizations(toolCustomizations);
    noteRender(id);
    return id;
});
await page.waitForTimeout(300);
ok('a plain note still renders its markdown exactly once', await page.evaluate((s) =>
    document.querySelectorAll(s).length, sel(note, '.markdown-content h1')) === 1);

// 11b. Reading from a URL, and on a schedule.
//
// The fetch sits downstream of the render on purpose: a read redraws, and a redraw
// must not read, or the two would chase each other. The cache is the other half —
// a board has to draw something the moment it opens, including when the host is
// unreachable, so what came back last is kept.
const FEED = path.join(OUT, 'dynamic-tool-feed.json');
const FEED_URL = 'http://localhost:8777/tests/out/dynamic-tool-feed.json';
const feed = (count) => fs.writeFileSync(FEED, JSON.stringify({ count: count, label: 'open' }));

feed(7);
const reader = await makeTool({
    customContent: '<p class="n"></p>',
    toolScript: 'el.querySelector(".n").textContent = source ? data.label + "=" + source[data.field] : "no source";',
    toolData: '{"field":"count","label":"open"}',
    sourceUrl: FEED_URL
});
await page.waitForTimeout(900);
ok('what the URL returned reaches the script as `source`',
    await resultText(reader) === 'open=7', await resultText(reader));
ok('and `data` is still the config that was typed, not the payload',
    await page.evaluate((id) => JSON.parse(toolCustomizations[id].toolData).field, reader) === 'count');
ok('the Source pane says when it was last read, and by which route',
    /Read .* ago · direct/.test(await page.textContent(sel(reader, '.dyn-fetch-state'))),
    await page.textContent(sel(reader, '.dyn-fetch-state')));
ok('the payload is kept, so the next open has something to draw',
    await page.evaluate((id) => !!toolCustomizations[id].sourceCache, reader));

// Read now, against a file that has changed underneath it.
feed(9);
await showTab(reader, 'source');
await page.click(sel(reader, '.dyn-source-status .dyn-btn'));
await page.waitForTimeout(900);
ok('Read now picks up what changed', await resultText(reader) === 'open=9', await resultText(reader));

// A tool with no URL is not broken, it just has no source.
const sourceless = await makeTool({
    customContent: '<p class="n"></p>',
    toolScript: 'el.querySelector(".n").textContent = source === null ? "null source" : "something";'
});
ok('a tool with no URL gets a null source rather than an error',
    await resultText(sourceless) === 'null source', await resultText(sourceless));

// The schedule. Five seconds is the floor, so this is the shortest real interval.
feed(11);
await page.evaluate((id) => {
    toolCustomizations[id].refreshSeconds = 5;
    saveToolCustomizations(toolCustomizations);
    runDynamicTool(id);
}, reader);
await page.waitForTimeout(600);
ok('setting a refresh says so in the pane',
    /every 5s/.test(await page.textContent(sel(reader, '.dyn-fetch-state'))),
    await page.textContent(sel(reader, '.dyn-fetch-state')));
feed(13);
await page.waitForTimeout(6000);
ok('and the tool re-reads on its own without being touched',
    await resultText(reader) === 'open=13', await resultText(reader));

// A mistyped interval cannot be used to hammer someone else's host.
await page.evaluate((id) => {
    toolCustomizations[id].refreshSeconds = 1;
    saveToolCustomizations(toolCustomizations);
    runDynamicTool(id);
}, reader);
await page.waitForTimeout(400);
ok('an interval below the floor is raised to it rather than honoured',
    /every 5s/.test(await page.textContent(sel(reader, '.dyn-fetch-state'))),
    await page.textContent(sel(reader, '.dyn-fetch-state')));

// Switching board has to stop the schedule, like every other timer here. Read the
// board we left out of storage rather than coming back to look: returning finds a
// cache older than the interval and reads again straight away, which is right, and
// would hide whether anything had been polling in the meantime.
await page.evaluate(() => switchToBoard('second'));
await page.waitForTimeout(500);
feed(99);
await page.waitForTimeout(6500);
const whileAway = await page.evaluate((id) => {
    const map = JSON.parse(localStorage.getItem('finance_default_toolCustomizations') || '{}');
    return JSON.parse((map[id] || {}).sourceCache || '{}').count;
}, reader);
ok('a board switch stops the schedule rather than leaving it polling',
    whileAway !== 99, String(whileAway));

await page.evaluate(() => switchToBoard('default'));
await page.waitForTimeout(1500);
ok('and coming back reads again, because what it holds is older than the interval',
    await resultText(reader) === 'open=99', await resultText(reader));

// Offline: the cache is what makes a board usable with the network down. The
// interval stays on, so the load really does try the host and really does fail.
const cached = await page.evaluate((id) => JSON.parse(toolCustomizations[id].sourceCache).count, reader);
await page.route('**/dynamic-tool-feed.json', r => r.abort());
await goto();
ok('with the host unreachable it still draws the last thing it read',
    await resultText(reader) === 'open=' + cached, await resultText(reader));
await showTab(reader, 'source');
await page.click(sel(reader, '.dyn-source-status .dyn-btn'));
await page.waitForTimeout(900);
ok('and a read that fails says so rather than pretending the number is current',
    /could not be read|does not allow|answered/.test(await page.textContent(sel(reader, '.dyn-fetch-state'))),
    await page.textContent(sel(reader, '.dyn-fetch-state')));
ok('while leaving the last good payload in place',
    await resultText(reader) === 'open=' + cached, await resultText(reader));
await page.unroute('**/dynamic-tool-feed.json');

// A URL that answers something that is not JSON is text, not an error: a feed is
// not always JSON, and a tool reading a plain-text endpoint should not have to pretend.
fs.writeFileSync(path.join(OUT, 'dynamic-tool-plain.txt'), 'all good');
const plainFeed = await makeTool({
    customContent: '<p class="n"></p>',
    toolScript: 'el.querySelector(".n").textContent = typeof source + ":" + source;',
    sourceUrl: 'http://localhost:8777/tests/out/dynamic-tool-plain.txt'
});
await page.waitForTimeout(900);
ok('a non-JSON endpoint arrives as the text it is',
    await resultText(plainFeed) === 'string:all good', await resultText(plainFeed));

// An unapproved script means an unapproved URL. A tool that arrived from someone
// else must not reach out to a host they chose before anyone here has said yes.
// Built without an approval rather than approved and then broken: a tool that has
// already read the URL once proves nothing about whether an unapproved one would.
const unapproved = await page.evaluate((url) => {
    const id = createNoteWithTemplate('script', { skipEditor: true });
    Object.assign(toolCustomizations[id], {
        customContent: '<p class="n"></p>',
        toolScript: 'el.querySelector(".n").textContent = "ran";',
        sourceUrl: url
    });
    delete toolCustomizations[id].scriptApproved;
    saveToolCustomizations(toolCustomizations);
    setToolMode(id, 'split');
    return id;
}, FEED_URL);
await page.waitForTimeout(1200);
ok('a tool whose script is not approved does not read its URL either',
    await page.evaluate((id) => toolCustomizations[id].sourceCache === undefined, unapproved));
await focusTool(unapproved);
await page.click(sel(unapproved, '.dyn-untrusted .dyn-btn-go'));
await page.waitForTimeout(1000);
ok('and reads it as soon as the script is approved',
    await page.evaluate((id) => !!toolCustomizations[id].sourceCache, unapproved));

// 12. Code that arrived from somewhere else.
//
// Until this tool existed, importing a board could not run anything. A script that
// travels has to land inert, and the file it travelled in does not get a say in
// that — an approval carried alongside the script would be the script approving
// itself. What is under test is that every way in behaves the same, and that the
// answer is remembered for exactly the code that was answered about.
const FIXTURE = path.join(OUT, 'dynamic-tool-source.json');
const FIXTURE_URL = 'http://localhost:8777/tests/out/dynamic-tool-source.json';
const RAN = 'el.querySelector(".out").textContent = "the script ran";';
const LATER = 'el.querySelector(".out").textContent = "different code";';

// The file claims its own script was approved. It does not get to.
const fixture = (script) => fs.writeFileSync(FIXTURE, JSON.stringify({
    type: 'tools',
    exportedAt: new Date().toISOString(),
    tools: [{
        id: 'custom-from-elsewhere',
        isCustom: true,
        customizations: {
            title: 'From Elsewhere', templateId: 'script',
            customContent: '<p class="out">markup only</p>',
            toolScript: script, toolData: '{}', scriptApproved: script
        },
        position: { x: 60, y: 480, z: 1, width: 380, height: 260 }
    }]
}, null, 2));

const ELSEWHERE = 'custom-from-elsewhere';
const banner = () => page.evaluate((s) => {
    const b = document.querySelector(s);
    return { shown: !!b && b.style.display !== 'none', text: b ? b.querySelector('.dyn-untrusted-text').textContent : null };
}, sel(ELSEWHERE, '.dyn-untrusted'));

fixture(RAN);
await goto();
await page.click('#importExportBtn');
await page.waitForTimeout(250);
await page.click('.import-export-tab[data-tab="import"]');
await page.waitForTimeout(250);
await page.fill('#importUrlInput', FIXTURE_URL);
await page.evaluate(() => { document.getElementById('importUrlKeep').checked = true; });
await page.click('#importUrlBtn');
await page.waitForTimeout(1200);
await page.evaluate(() => document.getElementById('importExportModal').classList.remove('open'));

ok('a tool loaded from a URL draws the markup it came with',
    await resultText(ELSEWHERE) === 'markup only', await resultText(ELSEWHERE));
let flag = await banner();
ok('but its script has not run, and the tool says so',
    flag.shown && /came with a script/.test(flag.text), JSON.stringify(flag));
ok('and the file does not get to approve its own script', await page.evaluate((id) =>
    (toolCustomizations[id] || {}).scriptApproved === undefined, ELSEWHERE));

await focusTool(ELSEWHERE);
await page.click(sel(ELSEWHERE, '.dyn-untrusted .dyn-btn'));
await page.waitForTimeout(400);
ok('Review puts the code it is asking about in front of you', await page.evaluate((id) => {
    const t = document.querySelector('.tool[data-tool="' + id + '"]');
    const pane = t.querySelector('.dyn-pane[data-pane="script"]');
    return pane.classList.contains('active') && getComputedStyle(pane).display !== 'none' &&
        t.querySelector('.dyn-source[data-field="toolScript"]').value.includes('the script ran');
}, ELSEWHERE));

await focusTool(ELSEWHERE);
await page.click(sel(ELSEWHERE, '.dyn-untrusted .dyn-btn-go'));
await page.waitForTimeout(400);
ok('and Run it runs the script', await resultText(ELSEWHERE) === 'the script ran', await resultText(ELSEWHERE));
ok('the banner goes when it is answered', !(await banner()).shown);

await goto();
ok('an approved script is still running after a reload — an unchanged source keeps its answer',
    await resultText(ELSEWHERE) === 'the script ran', await resultText(ELSEWHERE));
ok('with no question outstanding', !(await banner()).shown);

// The one this whole mechanism exists for: a source that trades on yesterday's yes.
fixture(LATER);
await goto();
flag = await banner();
ok('a source that changes its script does not inherit the answer given to the old one',
    await resultText(ELSEWHERE) === 'markup only', await resultText(ELSEWHERE));
ok('and says that it changed, rather than that it is new',
    flag.shown && /changed since you ran it/.test(flag.text), JSON.stringify(flag));
ok('the new code is what is offered for review', await page.evaluate((id) =>
    document.querySelector('.tool[data-tool="' + id + '"] .dyn-source[data-field="toolScript"]')
        .value.includes('different code'), ELSEWHERE));

await focusTool(ELSEWHERE);
await page.click(sel(ELSEWHERE, '.dyn-untrusted .dyn-btn-go'));
await page.waitForTimeout(400);
ok('approving the new code runs that', await resultText(ELSEWHERE) === 'different code', await resultText(ELSEWHERE));

// 13. A board template is a plugin, and still does not get to pre-approve.
const fromTemplate = await page.evaluate(() => {
    PluginRegistry.registerBoard({
        id: 'test-scripted-board', name: 'Scripted Board', description: 'x', icon: '🧪',
        version: '1.0.0', source: 'external', settings: { title: 'Scripted Board' },
        tools: [{
            toolId: 'script', instanceId: 'custom-from-template', title: 'From A Template',
            position: { x: 40, y: 40, z: 1, width: 380, height: 240 },
            state: {
                customContent: '<p class="out">template markup</p>',
                toolScript: 'el.querySelector(".out").textContent = "template script ran";',
                scriptApproved: 'el.querySelector(".out").textContent = "template script ran";'
            }
        }]
    });
    return 'custom-from-template';
});
await page.evaluate(() => instantiateBoardTemplate('test-scripted-board'));
await page.waitForTimeout(1500);
ok('a board template carrying a script arrives with the markup drawn',
    await resultText(fromTemplate) === 'template markup', await resultText(fromTemplate));
ok('and the script waiting', await page.evaluate((s) => {
    const b = document.querySelector(s);
    return !!b && b.style.display !== 'none';
}, sel(fromTemplate, '.dyn-untrusted')));
ok('its declared approval having been dropped on the way in', await page.evaluate((id) =>
    (toolCustomizations[id] || {}).scriptApproved === undefined, fromTemplate));

// 13b. A plain copy is a different code path from a linked source — it goes
//      through importTools rather than the sync — and has to answer the same way.
const COPY = 'custom-plain-copy';
const COPY_FILE = path.join(OUT, 'dynamic-tool-copy.json');
fs.writeFileSync(COPY_FILE, JSON.stringify({
    type: 'tools',
    exportedAt: new Date().toISOString(),
    tools: [{
        id: COPY,
        isCustom: true,
        customizations: {
            title: 'A Plain Copy', templateId: 'script',
            customContent: '<p class="out">copied markup</p>',
            toolScript: 'el.querySelector(".out").textContent = "copied script ran";',
            toolData: '{}',
            scriptApproved: 'el.querySelector(".out").textContent = "copied script ran";'
        },
        position: { x: 460, y: 480, z: 1, width: 380, height: 260 }
    }]
}, null, 2));

await page.click('#importExportBtn');
await page.waitForTimeout(250);
await page.click('.import-export-tab[data-tab="import"]');
await page.waitForTimeout(250);
await page.fill('#importUrlInput', 'http://localhost:8777/tests/out/dynamic-tool-copy.json');
await page.evaluate(() => { document.getElementById('importUrlKeep').checked = false; });
await page.click('#importUrlBtn');
await page.waitForTimeout(1200);
await page.evaluate(() => document.getElementById('importExportModal').classList.remove('open'));

ok('a tool imported as a plain copy draws its markup too',
    await resultText(COPY) === 'copied markup', await resultText(COPY));
ok('and its script waits as well', await page.evaluate((s) => {
    const b = document.querySelector(s);
    return !!b && b.style.display !== 'none';
}, sel(COPY, '.dyn-untrusted')));
ok('the copy having lost the approval it claimed', await page.evaluate((id) =>
    (toolCustomizations[id] || {}).scriptApproved === undefined, COPY));

// 14. And an approval never leaves this browser, so it cannot arrive anywhere else.
await page.evaluate(() => {
    const t = createNoteWithTemplate('script', { skipEditor: true });
    toolCustomizations[t].toolScript = 'el.textContent = "mine";';
    toolCustomizations[t].scriptApproved = 'el.textContent = "mine";';
    saveToolCustomizations(toolCustomizations);
    window.__exportId = t;
});
await page.waitForTimeout(300);
await page.click('#importExportBtn');
await page.waitForTimeout(300);
await page.click('.import-export-tab[data-tab="export"]');
await page.waitForTimeout(300);
await page.evaluate(() => {
    document.querySelectorAll('.tool-checkbox').forEach(cb => { cb.checked = cb.value === window.__exportId; });
});
const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#exportSelectedTools')
]);
const exported = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
const shipped = exported.tools[0].customizations;
ok('an exported tool takes its script with it', /mine/.test(shipped.toolScript || ''), JSON.stringify(shipped.toolScript));
ok('and leaves the approval behind', shipped.scriptApproved === undefined, JSON.stringify(Object.keys(shipped)));

// A read that cannot reach its host logs at the browser level, not the app's: the
// offline section above pulls a host away on purpose and ERR_FAILED is the browser
// saying so. Everything else still has to be silent.
const NETWORK_NOISE = /ERR_FAILED|Failed to load resource|net::|Access to fetch at|CORS policy/;
const appErrors = errors.filter(e => !NETWORK_NOISE.test(e));
ok('a failed read is reported by the browser, as it should be',
    errors.some(e => NETWORK_NOISE.test(e)), JSON.stringify(errors).slice(0, 120));
ok('and the app itself logged nothing', appErrors.length === 0, JSON.stringify(appErrors).slice(0, 200));
await page.screenshot({ path: OUT + '/dynamic-tool.png' });
await browser.close();
