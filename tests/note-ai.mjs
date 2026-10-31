// On-device AI through BoardAI: Chrome's own model, faked here with the same shape
// (availability, create with a download monitor, streaming), since the browser under
// test has no model to give. A tool declares `ai: { target, apply }` and nothing
// about how it looks: the framework puts ✨ in its header, and BoardAI's own popup —
// on the page, not in the tool — does the rest. Nothing may go over the network.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
await context.addInitScript(() => {
    // BoardAI is off until a person turns it on; these tests are about it on.
    if (localStorage.getItem('toolboard_onDeviceAI') == null) localStorage.setItem('toolboard_onDeviceAI', 'on');
    const ai = window.__ai = { state: 'available', calls: [], chunks: 'delta', reply: null, slow: 0 };
    const stream = (text) => (async function* () {
        const words = String(text).split(/(?<= )/);
        let so = '';
        for (const w of words) {
            if (ai.slow) await new Promise(r => setTimeout(r, ai.slow));
            so += w;
            yield ai.chunks === 'cumulative' ? so : w;
        }
    })();
    const make = (kind) => ({
        availability: async (opts) => { ai.calls.push({ kind, op: 'availability', opts }); return typeof ai.state === 'object' ? (ai.state[kind] || 'unavailable') : ai.state; },
        create: async (opts) => {
            ai.calls.push({ kind, op: 'create', opts: { ...opts, monitor: !!opts.monitor, signal: undefined } });
            const state = typeof ai.state === 'object' ? ai.state[kind] : ai.state;
            // A download that never gets anywhere: 0%, then nothing, until stopped.
            if (ai.hang) {
                if (opts.monitor) {
                    const target = new EventTarget();
                    opts.monitor(target);
                    target.dispatchEvent(Object.assign(new Event('downloadprogress'), { loaded: 0 }));
                }
                return new Promise((resolve, reject) => {
                    if (opts.signal) opts.signal.addEventListener('abort', () => reject(new DOMException('Stopped', 'AbortError')));
                });
            }
            // As Chrome does: a model on disk still tells a new session 0% and 100%.
            if (opts.monitor) {
                const target = new EventTarget();
                opts.monitor(target);
                const steps = state === 'downloadable' || state === 'after-download' ? [0.1, 0.42, 1] : [0, 1];
                for (const loaded of steps) { await new Promise(r => setTimeout(r, 120)); target.dispatchEvent(Object.assign(new Event('downloadprogress'), { loaded })); }
            }
            const answer = (input, o) => ai.reply ? ai.reply(kind, input, opts, o) : kind + ': ' + input.slice(0, 20);
            return {
                promptStreaming: (input, o) => { ai.calls.push({ kind, op: 'prompt', input, schema: o && o.responseConstraint }); return stream(answer(input, o)); },
                summarizeStreaming: (input) => { ai.calls.push({ kind, op: 'summarize', input, type: opts.type }); return stream(answer(input)); },
                translateStreaming: (input) => { ai.calls.push({ kind, op: 'translate', input, to: opts.targetLanguage, from: opts.sourceLanguage }); return stream(answer(input)); },
                detect: async () => [{ detectedLanguage: 'en', confidence: 0.99 }],
                destroy: () => ai.calls.push({ kind, op: 'destroy' })
            };
        }
    });
    window.LanguageModel = make('prompt');
    window.Summarizer = make('summarize');
    window.Translator = make('translate');
    window.LanguageDetector = make('detect');
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const offsite = [];
page.on('request', (r) => { if (!/^http:\/\/localhost:8777\//.test(r.url()) && !/^data:/.test(r.url())) offsite.push(r.url()); });
await page.goto('http://localhost:8777/index.html');
await page.waitForSelector('#toolboard', { timeout: 20000 });
await page.waitForTimeout(1000);

const MD = '# Trip\n\nBook the flights by Friday. Ask Sam about the hotel.\nPack the charger, and the passport.';
const make = (text, mode) => page.evaluate(([md, mode]) => {
    const id = createNoteWithText(md, 'Trip');
    toolCustomizations[id].noteEditor = 'rich';
    noteApplyEditor(id);
    setToolMode(id, mode || 'render');
    const t = document.querySelector('.tool[data-tool="' + id + '"]');
    t.style.left = '40px'; t.style.top = '60px';
    maxZ++; t.style.zIndex = maxZ;
    return id;
}, [text, mode]);
const note = await make(MD);
await page.waitForTimeout(400);
const sel = (s) => '.tool[data-tool="' + note + '"] ' + s;
const P = '#boardAIPopup ';
const md = (id) => page.evaluate((i) => toolCustomizations[i].customContent, id || note);
const calls = () => page.evaluate(() => window.__ai.calls.slice());
const popOpen = () => page.evaluate(() => { const p = document.getElementById('boardAIPopup'); return !!p && !p.hidden; });
const open = async () => { await page.hover(sel('.tool-header')); await page.click(sel('.ai-btn')); await page.waitForTimeout(150); };
const pick = async (id) => { if (!(await popOpen())) await open(); else if (await page.isVisible(P + '.bai-work')) await page.click(P + '.bai-back'); await page.click(P + '.bai-item[data-ai="' + id + '"]'); };
const done = () => page.waitForFunction(() => {
    const p = document.getElementById('boardAIPopup');
    return !p.querySelector('.bai-foot').hidden || /Stopped|not|could/.test(p.querySelector('.bai-status').textContent);
}, null, { timeout: 10000 });

// 1. Offered where the model can run, and not where it cannot.
ok('with a model here, a note has ✨ in its header', await page.isVisible(sel('.tool-header .ai-btn')) &&
    await page.evaluate(() => document.documentElement.dataset.ai) === 'on');
ok('and nothing of the AI in the note itself', await page.evaluate((s) => !document.querySelector(s).querySelector('[class*="ai-"]:not(.ai-btn)'), sel('.tool-content')));
for (const [state, shown] of [['unavailable', false], ['downloadable', true], ['readily-available', true], ['after-download', true]]) {
    await page.evaluate((s) => { window.__ai.state = s; return BoardAI.refresh(); }, state);
    ok('availability "' + state + '": ' + (shown ? 'offered' : 'not offered'), await page.isVisible(sel('.ai-btn')) === shown);
}
await page.evaluate(() => { delete window.LanguageModel; delete window.Summarizer; delete window.Translator; return BoardAI.refresh(); });
ok('a browser with no model at all: no ✨', !(await page.isVisible(sel('.ai-btn'))) &&
    await page.evaluate(() => document.documentElement.dataset.ai) === 'none');
ok('and BoardAI says why', /needs Chrome on a desktop/.test(await page.evaluate(() => BoardAI.why('unsupported'))));
await page.reload();
await page.waitForSelector(sel('.note-widget'));
await page.waitForTimeout(500);
await page.evaluate((id) => { const t = document.querySelector('.tool[data-tool="' + id + '"]'); t.style.left = '40px'; t.style.top = '60px'; window.__ai.state = 'available'; }, note);
await page.waitForLoadState('networkidle');
// The board's own libraries load with the page; from here on, nothing else may.
offsite.length = 0;

// 2. The popup.
await open();
ok('✨ opens BoardAI’s popup, on the page and not in the tool', await popOpen() &&
    await page.evaluate((s) => document.getElementById('boardAIPopup').parentNode === document.body && !document.querySelector(s).contains(document.getElementById('boardAIPopup')), sel('')));
ok('beside the tool, where there is room', await page.evaluate((s) => {
    const t = document.querySelector(s).getBoundingClientRect(), p = document.getElementById('boardAIPopup').getBoundingClientRect();
    return p.left >= t.right && Math.abs(p.top - t.top) < 2;
}, '.tool[data-tool="' + note + '"]'));
ok('named for the tool', await page.textContent(P + '.bai-title') === '✨ Trip');
ok('listing what it can do', await page.evaluate(() => Array.from(document.querySelectorAll('#boardAIPopup .bai-group')).map(g => g.textContent).join()) === 'Summarize,Rewrite,Reshape,Ask,Translate');
ok('every item can be seen and pointed at', await page.evaluate(() =>
    Array.from(document.querySelectorAll('#boardAIPopup .bai-item')).every(b => {
        const r = b.getBoundingClientRect();
        return r.height > 0 && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === b;
    })));
ok('saying what it works on: all of the note', /On all of it \(\d+ words\)/.test(await page.textContent(P + '.bai-scope')));
await page.screenshot({ path: OUT + '/note-ai-menu.png' });
await page.click(sel('.ai-btn'));
ok('✨ again closes it', !(await popOpen()));
await open();
await page.keyboard.press('Escape');
ok('so does Escape', !(await popOpen()));
await open();
await page.click(P + '.bai-x');
ok('and ×', !(await popOpen()));
await open();
const before = await page.evaluate(() => document.getElementById('boardAIPopup').getBoundingClientRect().left);
const head = await page.locator(P + '.bai-head').boundingBox();
await page.mouse.move(head.x + 40, head.y + 10);
await page.mouse.down();
await page.mouse.move(head.x - 160, head.y + 60, { steps: 5 });
await page.mouse.up();
ok('it can be dragged out of the way', Math.abs(await page.evaluate(() => document.getElementById('boardAIPopup').getBoundingClientRect().left) - (before - 200)) < 3);
await page.click(P + '.bai-x');

// 3. Summarize, streamed into the popup, changing nothing.
await page.evaluate(() => { window.__ai.reply = (kind) => kind === 'summarize' ? '- Book flights by Friday\n- Ask Sam about the hotel\n- Pack charger and passport' : 'x'; window.__ai.slow = 30; });
await pick('keypoints');
await page.waitForTimeout(100);
ok('a model already here is not said to be downloading', !/Downloading/.test(await page.textContent(P + '.bai-status')) &&
    !(await page.evaluate(() => window.__ai.calls.filter(c => c.op === 'create').some(c => c.opts.monitor))));
ok('the answer streams in as it comes', /Writing|Working/.test(await page.textContent(P + '.bai-status')) && await page.isVisible(P + '.bai-stop'));
await done();
ok('key points, from the summarizer', (await calls()).some(c => c.kind === 'summarize' && c.op === 'summarize' && c.type === 'key-points') &&
    (await page.evaluate(() => document.querySelectorAll('#boardAIPopup .bai-out li').length)) === 3);
ok('and nothing in the note has changed', await md() === MD);
ok('Replace, Insert below, Copy, Discard', JSON.stringify(await page.evaluate(() => Array.from(document.querySelectorAll('#boardAIPopup .bai-foot button')).filter(b => !b.hidden).map(b => b.textContent))) ===
    JSON.stringify(['Replace', 'Insert below', 'Copy', 'Discard']));
await page.click(P + '.bai-insert');
ok('Insert below hands it to the note, which puts it after itself', await md() === MD + '\n\n- Book flights by Friday\n- Ask Sam about the hotel\n- Pack charger and passport', JSON.stringify(await md()));
ok('and the popup closes', !(await popOpen()));
ok('the note shows it', /Pack charger and passport/.test(await page.textContent(sel('.authoring-result'))));
await page.keyboard.press((process.platform === 'darwin' ? 'Meta' : 'Control') + '+z');
await page.waitForTimeout(400);
ok('Undo takes it out again', await md() === MD, JSON.stringify(await md()));

// 4. Rewrites, and Replace.
await page.evaluate(() => { window.__ai.slow = 0; window.__ai.reply = (kind, input) => kind === 'prompt' && /formal/.test(input) ? '# Trip\n\nPlease book the flights by Friday.' : 'x'; });
await pick('formal');
await done();
const promptCall = (await calls()).filter(c => c.kind === 'prompt' && c.op === 'create').pop();
ok('a rewrite asks the prompt API, with a system prompt and English in and out', !!promptCall &&
    promptCall.opts.initialPrompts[0].role === 'system' && promptCall.opts.expectedInputs[0].languages[0] === 'en');
ok('each session is let go when done', (await calls()).filter(c => c.op === 'destroy').length >= 2);
await page.click(P + '.bai-replace');
ok('Replace puts it in place of the note', await md() === '# Trip\n\nPlease book the flights by Friday.');
await page.keyboard.press((process.platform === 'darwin' ? 'Meta' : 'Control') + '+z');
await page.waitForTimeout(400);
ok('and Undo puts the note back', await md() === MD);

// 5. Copy, Discard and Stop.
await page.evaluate(() => { window.__ai.reply = () => 'Short version.'; });
await pick('shorter');
await done();
await page.click(P + '.bai-copy');
await page.waitForTimeout(150);
ok('Copy copies what came back', await page.evaluate(() => navigator.clipboard.readText()) === 'Short version.');
await page.click(P + '.bai-discard');
ok('Discard goes back to what it can do, and changes nothing', await popOpen() && await page.isVisible(P + '.bai-menu') && await md() === MD);
await page.evaluate(() => { window.__ai.slow = 200; window.__ai.reply = () => 'one two three four five six seven eight nine ten'; });
await pick('clearer');
await page.waitForTimeout(450);
await page.click(P + '.bai-stop');
await page.waitForTimeout(300);
ok('Stop stops it', /Stopped/.test(await page.textContent(P + '.bai-status')) && !(await page.isVisible(P + '.bai-stop')), await page.textContent(P + '.bai-status'));
await page.evaluate(() => { window.__ai.slow = 0; });

// 6. A table, from structured JSON.
await page.evaluate(() => { window.__ai.reply = () => JSON.stringify({ columns: ['Task', 'By'], rows: [['Book flights', 'Friday'], ['Ask Sam | hotel', '']] }); });
await pick('table');
await done();
const tableCall = (await calls()).filter(c => c.op === 'prompt').pop();
ok('a table asks for JSON in a set shape', tableCall.schema && tableCall.schema.properties.columns && tableCall.schema.properties.rows);
ok('and comes back a Markdown table', await page.evaluate(() => document.querySelectorAll('#boardAIPopup .bai-out table tr').length) === 3 &&
    await page.evaluate(() => boardAIState.result) === '| Task | By |\n| --- | --- |\n| Book flights | Friday |\n| Ask Sam \\| hotel |  |');

// 7. Translate and Ask.
await page.evaluate(() => { window.__ai.reply = (kind) => kind === 'translate' ? 'Reserva los vuelos.' : 'x'; });
await page.click(P + '.bai-back');
await page.selectOption(P + '.bai-lang', 'es');
await page.click(P + '.bai-item[data-ai="translate"]');
await done();
ok('translate: the language is detected, and the translator asked for that pair', (await calls()).some(c => c.kind === 'translate' && c.op === 'translate' && c.from === 'en' && c.to === 'es') &&
    /Reserva los vuelos/.test(await page.textContent(P + '.bai-out')));
await page.evaluate(() => { window.__ai.reply = (kind, input) => /Question: Who/.test(input) ? 'Sam.' : 'x'; });
await pick('ask');
ok('Ask opens a question box', await page.isVisible(P + '.bai-q') && await page.evaluate(() => document.activeElement === document.querySelector('#boardAIPopup .bai-q')));
await page.fill(P + '.bai-q', 'Who knows about the hotel?');
await page.press(P + '.bai-q', 'Enter');
await done();
ok('answered from the note', (await page.textContent(P + '.bai-out')).trim() === 'Sam.' &&
    (await calls()).filter(c => c.op === 'prompt').pop().input.includes('Ask Sam about the hotel'));
ok('an answer is inserted or copied, not put over the note', !(await page.isVisible(P + '.bai-replace')) && await page.isVisible(P + '.bai-insert'));
await page.click(P + '.bai-x');

// 8. On a selection — which the popup follows while it is open.
await page.evaluate((i) => setToolMode(i, 'edit'), note);
await page.waitForTimeout(300);
await open();
ok('nothing selected: all of it', /On all of it/.test(await page.textContent(P + '.bai-scope')));
await page.evaluate((s) => {
    const p = Array.from(document.querySelectorAll(s + ' p')).find(x => /Book the flights/.test(x.textContent));
    const r = document.createRange();
    r.setStart(p.firstChild, 0);
    r.setEnd(p.firstChild, 'Book the flights by Friday.'.length);
    document.querySelector(s).focus();
    getSelection().removeAllRanges();
    getSelection().addRange(r);
}, sel('.note-rich'));
await page.waitForTimeout(150);
ok('select some words, and it says it will work on those', /On the selection \(5 words\)/.test(await page.textContent(P + '.bai-scope')), await page.textContent(P + '.bai-scope'));
await page.evaluate(() => { window.__ai.reply = (kind, input) => /Book the flights by Friday\.\s*$/.test(input.trim()) ? 'Book flights by Friday!' : 'WHOLE ' + input; });
await page.click(P + '.bai-item[data-ai="fix"]');
await done();
ok('it is given the selection alone', /Book the flights by Friday\.$/.test((await calls()).filter(c => c.op === 'prompt').pop().input.trim()));
ok('and offers to replace the selection', await page.textContent(P + '.bai-replace') === 'Replace selection');
await page.click(P + '.bai-replace');
await page.waitForTimeout(200);
const afterSel = await md();
ok('Replace selection replaces only that', /Book flights by Friday!/.test(afterSel) && /Ask Sam about the hotel/.test(afterSel) && /# Trip/.test(afterSel) &&
    !/Book the flights by Friday\./.test(afterSel), JSON.stringify(afterSel));
await page.evaluate((i) => setToolMode(i, 'render'), note);

// 9. The model's first download, from the click that asks for it.
await page.evaluate(() => { window.__ai.state = 'downloadable'; window.__ai.reply = () => 'Done.'; });
await open();
ok('the popup says the first use downloads the model', await page.isVisible(P + '.bai-dl'));
await page.click(P + '.bai-item[data-ai="shorter"]');
await page.waitForFunction(() => /Downloading the on-device model… \d+%/.test(document.querySelector('#boardAIPopup .bai-status').textContent), null, { timeout: 5000 });
ok('the download shows its progress', true);
await page.waitForFunction(() => /Model downloaded — starting/.test(document.querySelector('#boardAIPopup .bai-status').textContent) || !document.querySelector('#boardAIPopup .bai-foot').hidden, null, { timeout: 5000 });
ok('and at 100% says it is starting, not still downloading', !/Downloading the on-device model… 100%/.test(await page.textContent(P + '.bai-status')));
await done();
ok('and then it answers', (await page.textContent(P + '.bai-out')).trim() === 'Done.');
await page.evaluate(() => { window.__ai.state = 'available'; window.__ai.chunks = 'cumulative'; window.__ai.reply = () => 'alpha beta gamma'; });
await pick('shorter');
await done();
ok('a stream that sends the text so far, as Chrome once did, reads the same', (await page.textContent(P + '.bai-out')).trim() === 'alpha beta gamma');
await page.screenshot({ path: OUT + '/note-ai.png' });
await page.evaluate(() => document.body.classList.add('dark-mode'));
await page.waitForTimeout(100);
await page.screenshot({ path: OUT + '/note-ai-dark.png' });
await page.evaluate(() => document.body.classList.remove('dark-mode'));
await page.click(P + '.bai-x');
await page.evaluate(() => { window.__ai.chunks = 'delta'; });

// 9b. A download that does not move: said plainly, and where Chrome says why.
await page.evaluate(() => { boardAIStallMs = 700; window.__ai.hang = true; window.__ai.state = 'downloadable'; });
await pick('shorter');
await page.waitForTimeout(300);
ok('a first download stuck at 0% shows 0%', /Downloading the on-device model… 0%/.test(await page.textContent(P + '.bai-status')), await page.textContent(P + '.bai-status'));
ok('with no hint yet', !(await page.isVisible(P + '.bai-hint')));
await page.waitForTimeout(800);
ok('then, when nothing has moved for a while, where Chrome says why', await page.isVisible(P + '.bai-hint') &&
    /chrome:\/\/on-device-internals/.test(await page.textContent(P + '.bai-hint')));
await page.click(P + '.bai-hint-copy');
await page.waitForTimeout(150);
ok('the address can be copied, since a page cannot link to it', await page.evaluate(() => navigator.clipboard.readText()) === 'chrome://on-device-internals');
await page.click(P + '.bai-stop');
await page.waitForTimeout(200);
ok('Stop still stops it, and the hint goes', /Stopped/.test(await page.textContent(P + '.bai-status')) && !(await page.isVisible(P + '.bai-hint')));
await page.evaluate(() => { window.__ai.state = 'downloading'; });
await page.click(P + '.bai-back');
await page.click(P + '.bai-item[data-ai="shorter"]');
await page.waitForTimeout(300);
ok('tried again while Chrome is still downloading, it says so rather than "Working…"',
    /Chrome is still downloading its on-device model/.test(await page.textContent(P + '.bai-status')), await page.textContent(P + '.bai-status'));
await page.waitForTimeout(800);
ok('and the hint follows there too', await page.isVisible(P + '.bai-hint'));
await page.screenshot({ path: OUT + '/note-ai-downloading.png' });
await page.click(P + '.bai-stop');
await page.click(P + '.bai-x');
await page.evaluate(() => { boardAIStallMs = 30000; window.__ai.hang = false; window.__ai.state = 'available'; });

// 10. Only some capabilities here.
await page.evaluate(() => { window.__ai.state = { prompt: 'unavailable', summarize: 'available', translate: 'unavailable' }; return BoardAI.refresh(); });
await open();
await page.waitForTimeout(150);
const enabled = await page.evaluate(() => Array.from(document.querySelectorAll('#boardAIPopup .bai-item')).filter(b => !b.disabled).map(b => b.dataset.ai));
ok('only what this computer can do is offered', JSON.stringify(enabled) === JSON.stringify(['keypoints', 'tldr']), JSON.stringify(enabled));
ok('the rest say why', /not available here/.test(await page.getAttribute(P + '.bai-item[data-ai="formal"]', 'title')));
await page.click(P + '.bai-x');
await page.evaluate(() => { window.__ai.state = 'available'; return BoardAI.refresh(); });

// 11. Any tool can offer it with a few lines; one that does not, does not get ✨.
const [plain, small] = await page.evaluate(() => {
    PluginRegistry.registerTool({ id: 'test-plain', name: 'Plain', title: 'Plain', content: '<div class="t-plain">Plain</div>' });
    PluginRegistry.registerTool({ id: 'test-small', name: 'Small', title: 'Small', content: '<div class="t-small">Small</div>',
        ai: { target: () => ({ text: 'alpha beta gamma', scope: 'whole', label: 'The small text' }),
            apply: (id, result, how) => { window.__applied = [id, result, how]; },
            actions: ['summarize'],
            custom: [{ id: 'mine', group: 'Mine', label: 'Do mine', system: 'MY SYSTEM', prompt: (t) => 'MINE: ' + t }] } });
    const a = createNoteWithTemplate('test-plain');
    const b = createNoteWithTemplate('test-small');
    return [a, b];
});
await page.waitForTimeout(400);
ok('a tool that declares no ai has no ✨', await page.evaluate((i) => !document.querySelector('.tool[data-tool="' + i + '"] .ai-btn'), plain));
ok('one that declares it does', await page.evaluate((i) => !!document.querySelector('.tool[data-tool="' + i + '"] .ai-btn'), small));
await page.evaluate((i) => { const t = document.querySelector('.tool[data-tool="' + i + '"]'); maxZ++; t.style.zIndex = maxZ; }, small);
await page.hover('.tool[data-tool="' + small + '"] .tool-header');
await page.click('.tool[data-tool="' + small + '"] .ai-btn');
await page.waitForTimeout(150);
ok('offering only what it asked for, its own actions first', await page.evaluate(() => Array.from(document.querySelectorAll('#boardAIPopup .bai-group')).map(g => g.textContent).join()) === 'Mine,Summarize' &&
    await page.textContent(P + '.bai-title') === '✨ Small');
ok('saying what it works on in its own words', await page.textContent(P + '.bai-scope') === 'The small text');
await page.evaluate(() => { window.__ai.reply = () => 'mine done'; });
await page.click(P + '.bai-item[data-ai="custom:mine"]');
await done();
ok('its own action asks with its own prompt and instruction', (await calls()).filter(c => c.op === 'prompt').pop().input === 'MINE: alpha beta gamma' &&
    (await calls()).filter(c => c.kind === 'prompt' && c.op === 'create').pop().opts.initialPrompts[0].content === 'MY SYSTEM' &&
    await page.textContent(P + '.bai-what') === 'Do mine');
await page.click(P + '.bai-back');
await page.evaluate(() => { window.__ai.reply = () => '- alpha'; });
await page.click(P + '.bai-item[data-ai="tldr"]');
await done();
await page.click(P + '.bai-replace');
ok('and Replace hands the result to its own apply', JSON.stringify(await page.evaluate(() => window.__applied)) === JSON.stringify([small, '- alpha', 'replace']));

// 12. Turned off.
await page.evaluate(() => openPluginSettingsModal());
await page.waitForSelector('#boardAIEnabled');
await page.waitForTimeout(200);
await page.evaluate(() => { window.__ai.state = 'downloading'; });
await page.evaluate(() => boardAIRenderSettings());
await page.waitForTimeout(150);
ok('Plugin Settings says when Chrome is downloading', /Writing and asking: downloading/.test(await page.textContent('#boardAIStatus')), await page.textContent('#boardAIStatus'));
await page.evaluate(() => { window.__ai.state = 'available'; return boardAIRenderSettings(); });
await page.waitForTimeout(150);
ok('Plugin Settings has the switch, on', await page.isChecked('#boardAIEnabled') && /runs on this computer; nothing is sent anywhere/.test(await page.textContent('#boardAIStatus')), await page.textContent('#boardAIStatus'));
await page.uncheck('#boardAIEnabled');
await page.waitForTimeout(200);
ok('off: no ✨ on any tool', await page.evaluate(() => Array.from(document.querySelectorAll('.ai-btn')).every(b => !b.getClientRects().length)) &&
    await page.evaluate(() => document.documentElement.dataset.ai) === 'off');
ok('kept by this browser, not the board', await page.evaluate(() => localStorage.getItem('toolboard_onDeviceAI') === 'off' &&
    !JSON.stringify(toolboardSettings).includes('AI')));
ok('and BoardAI will not run', await page.evaluate(() => BoardAI.prompt('hi').then(() => 'ran', e => e.message)) === 'On-device AI is turned off in Plugin Settings.');
await page.check('#boardAIEnabled');
await page.waitForTimeout(200);
ok('on again, it is back', await page.evaluate(() => document.documentElement.dataset.ai) === 'on');

// Off until turned on: a browser that never chose has no ✨, even with a model.
const fresh = await browser.newContext({ viewport: { width: 1300, height: 900 } });
await fresh.addInitScript(() => {
    window.LanguageModel = { availability: async () => 'available', create: async () => ({ promptStreaming: () => (async function* () { yield 'x'; })(), destroy: () => {} }) };
});
const page2 = await fresh.newPage();
await page2.goto('http://localhost:8777/index.html');
await page2.waitForSelector('#toolboard', { timeout: 20000 });
await page2.waitForTimeout(800);
await page2.evaluate(() => { const id = createNoteWithText('# Off\n\nSome words.', 'Off'); setToolMode(id, 'render'); });
await page2.waitForTimeout(400);
ok('a browser that never turned it on: off, with a model there', await page2.evaluate(() => document.documentElement.dataset.ai) === 'off' &&
    await page2.evaluate(() => localStorage.getItem('toolboard_onDeviceAI')) === null);
ok('so no ✨ on any tool', await page2.evaluate(() => Array.from(document.querySelectorAll('.ai-btn')).every(b => !b.getClientRects().length)));
ok('and BoardAI will not run for a script either', await page2.evaluate(() => BoardAI.prompt('hi').then(() => 'ran', e => e.message)) ===
    'On-device AI is turned off in Plugin Settings.');
await page2.evaluate(() => openPluginSettingsModal());
await page2.waitForSelector('#boardAIEnabled');
await page2.waitForTimeout(300);
ok('Plugin Settings shows it off, and says how to turn it on', !(await page2.isChecked('#boardAIEnabled')) &&
    /^Off\. Tick it to offer ✨/.test(await page2.textContent('#boardAIStatus')) && /✨ AI in the tools that support it/.test(await page2.textContent('label.plugin-ai-toggle')),
    await page2.textContent('#boardAIStatus'));
await page2.check('#boardAIEnabled');
await page2.waitForTimeout(300);
ok('ticked, it is on, and kept by this browser', await page2.evaluate(() => document.documentElement.dataset.ai) === 'on' &&
    await page2.evaluate(() => localStorage.getItem('toolboard_onDeviceAI')) === 'on');
await page2.reload();
await page2.waitForSelector('#toolboard', { timeout: 20000 });
await page2.waitForTimeout(800);
ok('and still on after a reload', await page2.evaluate(() => document.documentElement.dataset.ai) === 'on');
await fresh.close();

ok('nothing went over the network for any of it', offsite.length === 0, JSON.stringify(offsite.slice(0, 5)));
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
