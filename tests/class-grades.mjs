// Class Grades: a student's classes and work, read from a school platform's API with
// a personal access token, written out as a short report. Against a made-up school on
// example.org: a student's token, a parent's, the board's proxy when the school will
// not be read directly — and the token kept out of everything that leaves the browser.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const SCHOOL = 'https://school.example.org';
const PROXY = 'https://ics-proxy-esjyexqdtq-ue.a.run.app/';
const DAY = 86400000;
const NOW = Date.now();
const iso = (d) => new Date(NOW + d * DAY).toISOString();

// The made-up school.
let mathScore = 92.4;
const art = Array.from({ length: 105 }, (_, i) => ({ id: 300 + i, name: 'Sketch ' + (i + 1), points_possible: 5, due_at: iso(-200 + i),
    submission: { user_id: 11, score: 5, submitted_at: iso(-201 + i), late: false, missing: false, workflow_state: 'graded' } }));
const mathTasks = (who) => [
    { id: 101, name: '5.4 Test Review', points_possible: 20, due_at: iso(-1), submission: { user_id: who, score: 18, submitted_at: iso(-2), late: false, missing: false, workflow_state: 'graded' } },
    { id: 102, name: '5.3 Homework', points_possible: 10, due_at: iso(-5), submission: { user_id: who, score: null, submitted_at: null, late: false, missing: true, workflow_state: 'unsubmitted' } },
    { id: 103, name: '5.5 Quiz', points_possible: 10, due_at: iso(-3), submission: { user_id: who, score: 7.5, submitted_at: iso(-1), late: true, missing: false, workflow_state: 'graded' } },
    { id: 104, name: '5.6 Project', points_possible: 50, due_at: iso(3), submission: { user_id: who, score: null, submitted_at: null, late: false, missing: false, workflow_state: 'unsubmitted' } },
    { id: 105, name: '6.1 Final', points_possible: 100, due_at: iso(40), submission: { user_id: who, score: null, submitted_at: null, late: false, missing: false, workflow_state: 'unsubmitted' } }
];
const chemTasks = [
    { id: 201, name: '2.1 Lab', points_possible: 10, due_at: iso(-4), submission: { user_id: 11, score: 6, submitted_at: iso(-5), late: false, missing: false, workflow_state: 'graded' } },
    { id: 202, name: '2.0 Safety Quiz', points_possible: 5, due_at: null, submission: { user_id: 11, score: 5, submitted_at: iso(-30), late: false, missing: false, workflow_state: 'graded' } }
];
const studentEnrollment = (uid, score, grade) => ({ type: 'student', user_id: uid, computed_current_score: score, computed_current_grade: grade });

const requests = [];
function api(url, auth) {
    const u = new URL(url);
    const token = (auth || '').replace(/^Bearer /, '');
    const page = Number(u.searchParams.get('page') || 1);
    const per = Number(u.searchParams.get('per_page') || 10);
    const pageOf = (list) => list.slice((page - 1) * per, page * per);
    const parent = token === 'parent-token';
    if (token !== 'student-token' && token !== 'parent-token') return { status: 401, body: { errors: [{ message: 'Invalid access token.' }] } };
    const p = u.pathname;
    if (p === '/api/v1/users/self') return { body: parent ? { id: 50, name: 'Pat Parent' } : { id: 11, name: 'Sam Student' } };
    if (p === '/api/v1/users/self/observees') return { body: parent ? pageOf([{ id: 11, name: 'Sam Student' }, { id: 12, name: 'Alex Student' }]) : [] };
    const one = p.match(/^\/api\/v1\/courses\/(\d+)$/);
    if (p === '/api/v1/courses' || one) {
        const courses = parent ? [
            { id: 1, name: 'Math', enrollments: [{ type: 'observer', user_id: 50, associated_user_id: 11 }, studentEnrollment(11, mathScore, 'A-')] },
            { id: 2, name: 'Chemistry', enrollments: [{ type: 'observer', user_id: 50, associated_user_id: 11 }, studentEnrollment(11, 68, '68')] },
            { id: 4, name: 'History', enrollments: [{ type: 'observer', user_id: 50, associated_user_id: 12 }, studentEnrollment(12, 81, 'B-')] }
        ] : [
            { id: 1, name: 'Math', enrollments: [studentEnrollment(11, mathScore, 'A-')] },
            { id: 2, name: 'Chemistry', enrollments: [studentEnrollment(11, 68, 'D+')] },
            { id: 3, name: 'Art', enrollments: [studentEnrollment(11, null, null)] }
        ].concat(extraCourse ? [{ id: 5, name: 'Biology', enrollments: [studentEnrollment(11, 88, 'B+')] }] : []);
        if (!one) return { body: pageOf(courses) };
        if (brokenClass === Number(one[1])) return { status: 500, body: { errors: [{ message: 'Internal error' }] } };
        const course = courses.find(c => c.id === Number(one[1]));
        return course ? { body: course } : { status: 404, body: { errors: [{ message: 'Not found' }] } };
    }
    // A parent reads a course as the student sees it. Chemistry gives nothing this way;
    // History brings no submissions with its assignments.
    const ua = p.match(/^\/api\/v1\/users\/(\d+)\/courses\/(\d+)\/assignments$/);
    if (ua) {
        if (!parent) return { status: 401, body: { status: 'unauthorized', errors: [{ message: 'user not authorized to perform that action' }] } };
        const [uid, course] = [Number(ua[1]), Number(ua[2])];
        if (course === 1 && uid === 11) return { body: pageOf(mathTasks(11)) };
        if (course === 4 && uid === 12) return { body: pageOf([{ id: 401, name: 'Essay 1', points_possible: 10, due_at: iso(-5) }]) };
        return { body: [] };
    }
    const m = p.match(/^\/api\/v1\/courses\/(\d+)\/(assignments|students\/submissions)$/);
    if (m) {
        const course = Number(m[1]);
        if (m[2] === 'students/submissions') {
            const sid = u.searchParams.get('student_ids[]');
            if (course === 2 && sid === '11' && u.searchParams.get('include[]') === 'assignment') {
                return { body: pageOf(chemTasks.map(a => Object.assign({}, a.submission, { assignment_id: a.id,
                    assignment: { id: a.id, name: a.name, points_possible: a.points_possible, due_at: a.due_at } }))) };
            }
            return { body: course === 4 && sid === '12' ? pageOf([{ assignment_id: 401, user_id: 12, score: 9, submitted_at: iso(-6), late: false, workflow_state: 'graded' }]) : [] };
        }
        if (notAList && course === 2) return { body: { errors: [{ message: 'user not authorized to perform that action' }] } };
        // Read as a parent this way, a course gives no assignments at all.
        if (parent) return { body: [] };
        let list = course === 1 ? mathTasks(11) : course === 2 ? chemTasks : course === 3 ? art :
            course === 4 ? [{ id: 401, name: 'Essay 1', points_possible: 10, due_at: iso(-5) }] : [];
        // A parent's view: each assignment carries its observed students' submissions as a list.
        if (parent && course !== 4) list = list.map(a => Object.assign({}, a, { submission: [a.submission] }));
        return { body: pageOf(list) };
    }
    return { status: 404, body: { errors: [{ message: 'Not found' }] } };
}

let schoolMode = 'direct';      // 'direct' | 'blocked'
let proxyMode = 'ok';           // 'ok' | 'forbidden' | 'preflight' | 'not-permitted' | 'flaky' | 'flaky2' | 'down' | 'school503'
let notAList = false;
let brokenClass = null;
let extraCourse = false;
const flaked = new Set();
const flaked2 = new Map();
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization, Accept', 'Content-Type': 'application/json' };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1200, height: 860 }, locale: 'en-US',
    permissions: ['clipboard-read', 'clipboard-write'] });
let inFlight = 0, maxInFlight = 0;
const slow = async (fn) => {
    inFlight++; maxInFlight = Math.max(maxInFlight, inFlight);
    await new Promise(r => setTimeout(r, 15));
    try { return await fn(); } finally { inFlight--; }
};
await context.route(SCHOOL + '/**', async (route) => {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    requests.push({ via: 'direct', url: req.url(), auth: req.headers()['authorization'] || '' });
    if (schoolMode === 'blocked') return route.abort('failed');
    return slow(() => { const r = api(req.url(), req.headers()['authorization']);
        return route.fulfill({ status: r.status || 200, headers: CORS, body: JSON.stringify(r.body) }); });
});
await context.route(PROXY + '**', async (route) => {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    const target = new URL(req.url()).searchParams.get('url');
    requests.push({ via: 'proxy', url: req.url(), target, auth: req.headers()['authorization'] || '' });
    if (proxyMode === 'forbidden') return route.fulfill({ status: 403, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain' }, body: 'Forbidden' });
    if (proxyMode === 'preflight') return route.abort('failed');
    // A proxy that falls over now and then: the first assignments page of each class
    // fails once, as an instance out of memory does — no CORS headers, so a failed fetch.
    if (proxyMode === 'flaky' && /\/assignments/.test(target) && !flaked.has(target)) { flaked.add(target); return route.abort('failed'); }
    if (proxyMode === 'flaky2' && /\/assignments/.test(target) && (flaked2.get(target) || 0) < 2) {
        flaked2.set(target, (flaked2.get(target) || 0) + 1);
        return route.abort('failed');
    }
    if (proxyMode === 'down' && /\/assignments/.test(target)) return route.abort('failed');
    if (proxyMode === 'school503' && /\/assignments/.test(target)) return route.fulfill({ status: 503, headers: CORS, body: '<html>Down for maintenance</html>' });
    if (proxyMode === 'not-permitted') return route.fulfill({ status: 403, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain' }, body: 'Target host not permitted for this page' });
    const r = api(target, req.headers()['authorization']);
    return route.fulfill({ status: r.status || 200, headers: CORS, body: JSON.stringify(r.body) });
});

const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR_FAILED|CORS/.test(m.text())) errors.push(m.text()); });
await page.addInitScript(() => {
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('toolboard_pluginUrls', JSON.stringify(['plugins/tools/class-grades.js']));
    localStorage.setItem('financeCurrentBoard', 'default');
    localStorage.setItem('finance_default_customTools', JSON.stringify(['cg']));
    localStorage.setItem('finance_default_toolCustomizations', JSON.stringify({ cg: { templateId: 'class-grades', title: 'Class Grades' } }));
    localStorage.setItem('finance_default_positions', JSON.stringify({ cg: { x: 20, y: 20, z: 5, width: 900, height: 700 } }));
});
// Chrome's on-device model, faked with its API shape: Class Grades offers ✨ on it.
await page.addInitScript(() => {
    const ai = window.__ai = { calls: [], reply: () => '- All fine.' };
    window.LanguageModel = {
        availability: async () => 'available',
        create: async (opts) => {
            ai.calls.push({ op: 'create', system: opts.initialPrompts && opts.initialPrompts[0] && opts.initialPrompts[0].content });
            return {
                promptStreaming: (input) => { ai.calls.push({ op: 'prompt', input }); return (async function* () { yield ai.reply(input); })(); },
                destroy: () => {}
            };
        }
    };
});
await page.goto('http://localhost:8777/index.html');
await page.waitForSelector('.tool[data-tool="cg"] .cg-widget', { timeout: 15000 });
await page.waitForTimeout(400);
const W = '.tool[data-tool="cg"] .cg-widget';
// The report as Copy has it: every class, every task, folded or not. Its columns are
// lined up by spaces; `flat` puts the old " - " between them, so what each line says
// is checked apart from how it is lined up — which section 20 checks.
const flat = (t) => String(t).replace(/(\S) {2,}(?=\S)/g, '$1 - ');
const aligned = () => page.evaluate((s) => classGradesWidgetText(document.querySelector(s)), W);
const report = async () => flat(await aligned());
const status = () => page.textContent(W + ' .cg-status');
const fmt = (d) => page.evaluate((x) => classGradesDate(x), iso(d));
const connect = async (token, remember) => {
    await page.waitForFunction((s) => document.querySelector(s) && document.querySelector(s).dataset.inited === '1', W);
    if (!(await page.evaluate((s) => document.querySelector(s).open, W + ' .cg-connection'))) await page.click(W + ' .cg-connection summary');
    await page.fill(W + ' .cg-base', 'school.example.org/some/page');
    await page.fill(W + ' .cg-token', token);
    await page.setChecked(W + ' .cg-remember', !!remember);
    await page.click(W + ' .cg-btn.primary');
    await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary', { timeout: 15000 });
    await page.waitForTimeout(100);
};

// 1. An external plugin, not one offered out of the box.
ok('it is not among the official plugins', await page.evaluate(() =>
    !OFFICIAL_PLUGINS.some(g => g.items.some(i => /class-grades/.test(i.url)))));
ok('added by its URL, it draws, asking to be connected', await page.evaluate((s) => document.querySelector(s).open, W + ' .cg-connection') &&
    /Connect/.test(await page.getAttribute(W + ' .cg-report', 'data-empty')));

// 2. A student's token, read directly.
await connect('student-token', false);
let text = await report();
ok('the school’s address is tidied to its origin', await page.inputValue(W + ' .cg-base') === SCHOOL);
const lines = text.split('\n');
ok('classes are listed by name, each with its square and grade', lines[0] === '⬜ Art - No grade' &&
    text.includes('🟥 Chemistry - 68% (D+)') && text.includes('🟩 Math - 92.4% (A-)'), lines.slice(0, 3).join(' | '));
ok('a task handed in on time: its score, ✅ and the date', text.includes('    🟩 5.4 Test Review - 18/20 (90%) - ✅ Submitted ' + await fmt(-2) + ' - Due ' + await fmt(-1)));
ok('a missing one: 🚫, and no grade yet', text.includes('    ⬜ 5.3 Homework - Not graded - 🚫 Missing - Due ' + await fmt(-5)));
ok('a late one: ⚠️ and when it came in, coloured by its score', text.includes('    🟧 5.5 Quiz - 7.5/10 (75%) - ⚠️ Late ' + await fmt(-1) + ' - Due ' + await fmt(-3)));
ok('work not yet due: ⏳', text.includes('    ⬜ 5.6 Project - Not graded - ⏳ Not submitted - Due ' + await fmt(3)));
const order = (txt, names) => names.map(n => txt.indexOf(n)).every((at, i, all) => at >= 0 && (i === 0 || at > all[i - 1]));
ok('tasks newest first, by due date', order(text, ['6.1 Final', '5.6 Project', '5.4 Test Review', '5.5 Quiz', '5.3 Homework']));
ok('and a task with no due date last', order(text, ['2.1 Lab', '2.0 Safety Quiz']) && text.includes('2.0 Safety Quiz - 5/5 (100%) - \u2705 Submitted') &&
    text.includes('No due date'));
ok('a below-orange task is 🟥', text.includes('    🟥 2.1 Lab - 6/10 (60%) - ✅ Submitted'));
ok('each class ends with its summary', text.includes('Missing 1, late 1, 1 due this week. First check.'), text.split('\n').filter(l => l.startsWith('Missing')).join(' | '));
ok('every page of a long list is read, in small pages', (text.match(/Sketch \d+/g) || []).length === 105 &&
    requests.some(r => /\/courses\/3\/assignments.*per_page=20&page=6/.test(r.url)) &&
    requests.filter(r => /\/assignments/.test(r.url)).every(r => /per_page=20&/.test(r.url)));
ok('one request at a time', maxInFlight === 1, String(maxInFlight));
ok('read directly, with the token in the header', requests.length > 0 && requests.every(r => r.via === 'direct' && r.auth === 'Bearer student-token'));
ok('and the status says when', /^Updated /.test(await status()) && !/proxy/.test(await status()), await status());

// 3. The token goes nowhere but the requests.
const everywhere = await page.evaluate(() => JSON.stringify({ custom: toolCustomizations, stored: localStorage.getItem('finance_default_toolCustomizations') }));
ok('the token is not in the tool’s settings, saved or in memory', !everywhere.includes('student-token'));
ok('nor are the grades', !everywhere.includes('92.4') && !everywhere.includes('5.4 Test Review'));
ok('not remembered, it is not in storage at all', await page.evaluate(() =>
    Object.keys(localStorage).every(k => !String(localStorage.getItem(k)).includes('student-token'))));
const exported = await page.evaluate(() => {
    let captured = null;
    const was = window.downloadJSON;
    window.downloadJSON = (data) => { captured = data; };
    document.body.insertAdjacentHTML('beforeend', '<input type="checkbox" class="board-checkbox" value="default" checked id="tmpCheck">');
    try { exportBoards(); } finally { window.downloadJSON = was; document.getElementById('tmpCheck').remove(); }
    return JSON.stringify(captured);
});
ok('an exported board carries the school’s address and nothing else of it', exported.includes(SCHOOL) &&
    !exported.includes('student-token') && !exported.includes('92.4'));

// 4. Filters, thresholds, copy.
// The filters: what a class lists, never what its summary counts.
await page.click(W + ' .cg-filters > summary');
const chip = (group, value) => page.click(W + ' .cg-chip[data-group="' + group + '"][data-value="' + value + '"]');
const taskLines = async () => (await report()).split('\n').filter(l => l.startsWith('    ')).map(l => l.trim().replace(/^\S+ /, '').split(' - ')[0]);
const filterCount = () => page.textContent(W + ' .cg-filter-count');
await chip('status', 'missing');
ok('Missing shows only missing work', JSON.stringify(await taskLines()) === JSON.stringify(['5.3 Homework']), JSON.stringify(await taskLines()));
ok('the class still counts all of it', (await report()).includes('Missing 1, late 1, 1 due this week.') &&
    await page.evaluate((s) => document.querySelector(s + ' .cg-class[data-course="1"] .cg-count').textContent, W) === '\u00B7 1 of 5 tasks');
ok('classes with nothing that matches are left out, and said to be', !(await report()).includes('Chemistry') &&
    /2 classes with no matching tasks hidden/.test(await page.textContent(W + ' .cg-report')));
ok('and the filter says it is on', await filterCount() === '(1)');
ok('and the classes left are open, their matching tasks in view', await page.evaluate((s) =>
    Array.from(document.querySelectorAll(s + ' .cg-class')).every(d => d.open && d.querySelector('.cg-tasks').checkVisibility()), W));
await chip('status', 'late');
ok('statuses add up: missing or late', JSON.stringify(await taskLines()) === JSON.stringify(['5.5 Quiz', '5.3 Homework']), JSON.stringify(await taskLines()));
await page.click(W + ' .cg-filters .cg-btn:has-text("Clear filters")');
ok('Clear filters shows everything again', (await taskLines()).length === 112 && await filterCount() === '', String((await taskLines()).length));
await chip('grade', 'red');
ok('by grade colour: 🟥 only', JSON.stringify(await taskLines()) === JSON.stringify(['2.1 Lab']), JSON.stringify(await taskLines()));
await chip('grade', 'red');
await page.fill(W + ' .cg-min', '70');
await page.fill(W + ' .cg-max', '80');
await page.dispatchEvent(W + ' .cg-max', 'change');
ok('by a grade range: 70–80%', JSON.stringify(await taskLines()) === JSON.stringify(['5.5 Quiz']), JSON.stringify(await taskLines()));
await page.click(W + ' .cg-filters .cg-btn:has-text("Clear filters")');
await page.selectOption(W + ' .cg-date', 'next7');
ok('due in the next 7 days, with undated work kept unless left out', JSON.stringify(await taskLines()) === JSON.stringify(['2.0 Safety Quiz', '5.6 Project']),
    JSON.stringify(await taskLines()));
await page.setChecked(W + ' .cg-nodue', false);
ok('leaving undated work out', JSON.stringify(await taskLines()) === JSON.stringify(['5.6 Project']));
await page.selectOption(W + ' .cg-date', 'past7');
ok('due in the past 7 days', JSON.stringify(await taskLines()) === JSON.stringify(['2.1 Lab', '5.4 Test Review', '5.5 Quiz', '5.3 Homework']),
    JSON.stringify(await taskLines()));
await page.selectOption(W + ' .cg-date', 'custom');
ok('a range of dates asks for its two ends', await page.evaluate((s) => !document.querySelector(s + ' .cg-from').hidden && !document.querySelector(s + ' .cg-to').hidden, W));
const day = (d) => { const x = new Date(NOW + d * DAY); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
await page.fill(W + ' .cg-from', day(-4));
await page.fill(W + ' .cg-to', day(-2));
await page.dispatchEvent(W + ' .cg-to', 'change');
ok('due between two dates, both days included', JSON.stringify(await taskLines()) === JSON.stringify(['2.1 Lab', '5.5 Quiz']), JSON.stringify(await taskLines()));

// By when the work was handed in.
await page.click(W + ' .cg-filters .cg-btn:has-text("Clear filters")');
const sorted = async () => (await taskLines()).slice().sort();
await page.selectOption(W + ' .cg-sub', 'past7');
ok('submitted in the past 7 days, with work not handed in kept unless left out', JSON.stringify(await sorted()) ===
    JSON.stringify(['2.1 Lab', '5.3 Homework', '5.4 Test Review', '5.5 Quiz', '5.6 Project', '6.1 Final']), JSON.stringify(await sorted()));
await page.setChecked(W + ' .cg-nosub', false);
ok('leaving out what was not handed in', JSON.stringify(await sorted()) === JSON.stringify(['2.1 Lab', '5.4 Test Review', '5.5 Quiz']), JSON.stringify(await sorted()));
ok('two filters on: the range and leaving work out', await filterCount() === '(2)', await filterCount());
await page.selectOption(W + ' .cg-sub', 'today');
ok('nothing was handed in today', (await taskLines()).length === 0, JSON.stringify(await taskLines()));
await page.selectOption(W + ' .cg-sub', 'custom');
ok('a range of submission dates asks for its two ends', await page.evaluate((s) =>
    !document.querySelector(s + ' .cg-sub-from').hidden && !document.querySelector(s + ' .cg-sub-to').hidden, W));
await page.fill(W + ' .cg-sub-from', day(-2));
await page.fill(W + ' .cg-sub-to', day(-1));
await page.dispatchEvent(W + ' .cg-sub-to', 'change');
ok('submitted between two dates — late work by when it came, not when it was due', JSON.stringify(await sorted()) ===
    JSON.stringify(['5.4 Test Review', '5.5 Quiz']), JSON.stringify(await sorted()));
ok('kept with the tool', JSON.stringify(await page.evaluate(() => { const f = toolCustomizations.cg.cgFilter; return [f.sub, f.subFrom, f.subTo, f.noSub]; })) ===
    JSON.stringify(['custom', day(-2), day(-1), false]));
await page.selectOption(W + ' .cg-sub', 'past7');
await page.setChecked(W + ' .cg-nosub', true);
await page.selectOption(W + ' .cg-date', 'next7');
await page.setChecked(W + ' .cg-nodue', true);
ok('with a due range too: due this coming week, and handed in this past one or not yet', JSON.stringify(await sorted()) ===
    JSON.stringify(['5.6 Project']), JSON.stringify(await sorted()));
await page.click(W + ' .cg-filters .cg-btn:has-text("Clear filters")');
ok('Clear filters clears it', await page.inputValue(W + ' .cg-sub') === 'any' && await page.isChecked(W + ' .cg-nosub') &&
    await filterCount() === '' && (await taskLines()).length === 112);
await page.click(W + ' .cg-filters .cg-btn:has-text("Clear filters")');
await page.fill(W + ' .cg-q', 'quiz');
ok('by name', JSON.stringify(await taskLines()) === JSON.stringify(['2.0 Safety Quiz', '5.5 Quiz']), JSON.stringify(await taskLines()));
ok('the order is one of the filters, in their panel', await page.evaluate((s) => !!document.querySelector(s + ' .cg-filters .cg-sort') &&
    !document.querySelector(s + ' .cg-toolbar .cg-sort'), W));
await page.selectOption(W + ' .cg-sort', 'oldest');
await page.fill(W + ' .cg-q', '');
await page.dispatchEvent(W + ' .cg-q', 'input');
text = await report();
ok('oldest first, on request — undated work still last', order(text, ['5.3 Homework', '5.5 Quiz', '5.4 Test Review', '5.6 Project', '6.1 Final']) &&
    order(text, ['2.1 Lab', '2.0 Safety Quiz']));
await page.selectOption(W + ' .cg-sort', 'newest');
await chip('status', 'missing');
await chip('status', 'late');
// Opened again — in a second tab, so this one keeps its token, which is not remembered.
const again = await context.newPage();
await again.goto('http://localhost:8777/index.html');
await again.waitForSelector(W + ' .cg-class');
ok('filters are kept with the tool', await again.textContent(W + ' .cg-filter-count') === '(1)' &&
    await again.getAttribute(W + ' .cg-chip[data-value="late"]', 'aria-pressed') === 'true' &&
    /5\.3 Homework/.test(await again.evaluate((s) => classGradesWidgetText(document.querySelector(s)), W)) &&
    !/5\.4 Test Review/.test(await again.evaluate((s) => classGradesWidgetText(document.querySelector(s)), W)));
await again.close();
ok('and hold nothing about anyone’s grades', JSON.stringify(await page.evaluate(() => toolCustomizations.cg.cgFilter)) ===
    JSON.stringify({ status: ['late', 'missing'], grade: [], min: '', max: '', date: 'any', from: '', to: '', noDue: true,
        sub: 'any', subFrom: '', subTo: '', noSub: true, q: '', sort: 'newest' }),
    JSON.stringify(await page.evaluate(() => toolCustomizations.cg.cgFilter)));
await page.click(W + ' .cg-btn:has-text("Copy")');
await page.waitForTimeout(200);
const copiedFiltered = await page.evaluate(() => navigator.clipboard.readText());
ok('Copy copies what the filters show', /5\.3 Homework/.test(copiedFiltered) && !/5\.4 Test Review|Chemistry|Sketch/.test(copiedFiltered), copiedFiltered.slice(0, 200));
await page.screenshot({ path: OUT + '/class-grades-filters.png' });
await page.click(W + ' .cg-filters .cg-btn:has-text("Clear filters")');

// Filters kept under a name.
const savedMenu = () => page.evaluate((s) => { const el = document.querySelector(s + ' .cg-saved');
    return { hidden: el.hidden, value: el.value, shown: el.options[el.selectedIndex] ? el.options[el.selectedIndex].textContent : '',
        names: Array.from(el.options).map(o => o.textContent) }; }, W);
const saveAs = async (name) => {
    await page.click(W + ' .cg-save-as');
    await page.fill(W + ' .cg-save-name', name);
    await page.press(W + ' .cg-save-name', 'Enter');
};
const saveMsg = () => page.textContent(W + ' .cg-save-msg');
ok('with nothing saved and no filter on, there is no Saved menu', (await savedMenu()).hidden);
await chip('status', 'missing');
await chip('status', 'late');
ok('a filter not saved is called Unsaved', !(await savedMenu()).hidden && (await savedMenu()).shown === 'Unsaved');
await saveAs('Needs attention');
ok('Save as… keeps it under its name, and the menu shows it', (await savedMenu()).shown === 'Needs attention' &&
    await saveMsg() === 'Saved as \u201CNeeds attention\u201D.' && await page.isHidden(W + ' .cg-save-form'),
    JSON.stringify([await savedMenu(), await saveMsg(), await page.isHidden(W + ' .cg-save-form')]));
ok('what is kept is the filter, and nothing about anyone’s grades', JSON.stringify(await page.evaluate(() => toolCustomizations.cg.cgSavedFilters)) ===
    JSON.stringify([{ name: 'Needs attention', filter: { status: ['late', 'missing'], grade: [], min: '', max: '', date: 'any', from: '', to: '', noDue: true,
        sub: 'any', subFrom: '', subTo: '', noSub: true, q: '', sort: 'newest' } }]),
    JSON.stringify(await page.evaluate(() => toolCustomizations.cg.cgSavedFilters)));
await page.click(W + ' .cg-filters .cg-btn:has-text("Clear filters")');
ok('cleared, the menu says All tasks', (await savedMenu()).shown === 'All tasks');
await chip('grade', 'red');
await page.selectOption(W + ' .cg-sort', 'oldest');
await saveAs('Low grades');
ok('a second set, the sort order with it, listed by name', JSON.stringify((await savedMenu()).names) === JSON.stringify(['All tasks', 'Low grades', 'Needs attention']));
await page.selectOption(W + ' .cg-saved', 'Needs attention');
ok('picking a saved set puts its filters back, and its order', JSON.stringify(await taskLines()) === JSON.stringify(['5.5 Quiz', '5.3 Homework']) &&
    await page.inputValue(W + ' .cg-sort') === 'newest' && await page.getAttribute(W + ' .cg-chip[data-value="red"]', 'aria-pressed') === 'false' &&
    await page.getAttribute(W + ' .cg-chip[data-value="missing"]', 'aria-pressed') === 'true');
await chip('status', 'upcoming');
ok('changed, it is Unsaved again', (await savedMenu()).shown === 'Unsaved');
await chip('status', 'upcoming');
ok('and changed back, it is the saved set again', (await savedMenu()).shown === 'Needs attention');
await page.selectOption(W + ' .cg-saved', 'Needs attention');
await page.click(W + ' .cg-save-as');
await page.fill(W + ' .cg-save-name', 'Low grades');
await page.press(W + ' .cg-save-name', 'Enter');
ok('saving under a name already taken asks first', /exists\. Save again to replace it\./.test(await saveMsg()) &&
    await page.textContent(W + ' .cg-save-ok') === 'Replace' &&
    (await page.evaluate(() => toolCustomizations.cg.cgSavedFilters.find(s => s.name === 'Low grades').filter.grade.join())) === 'red');
await page.press(W + ' .cg-save-name', 'Enter');
ok('and replaces it when asked again', (await page.evaluate(() => toolCustomizations.cg.cgSavedFilters.find(s => s.name === 'Low grades').filter.status.join())) === 'late,missing');
await page.selectOption(W + ' .cg-saved', 'Needs attention');
await page.click(W + ' .cg-rename');
ok('Rename starts from the name it has', await page.inputValue(W + ' .cg-save-name') === 'Needs attention', JSON.stringify([await page.inputValue(W + ' .cg-save-name'), await savedMenu()]));
await page.fill(W + ' .cg-save-name', 'Overdue');
await page.press(W + ' .cg-save-name', 'Escape');
ok('Escape leaves it as it was', await page.isHidden(W + ' .cg-save-form') &&
    (await page.evaluate(() => toolCustomizations.cg.cgSavedFilters.map(s => s.name).join())) === 'Low grades,Needs attention');
await page.selectOption(W + ' .cg-saved', 'Needs attention');
await page.click(W + ' .cg-rename');
await page.fill(W + ' .cg-save-name', 'Overdue');
await page.press(W + ' .cg-save-name', 'Enter');
ok('Rename renames it', (await page.evaluate(() => toolCustomizations.cg.cgSavedFilters.map(s => s.name).join())) === 'Low grades,Overdue');
await page.selectOption(W + ' .cg-saved', 'Overdue');
await page.click(W + ' .cg-delete');
ok('Delete asks first', await page.textContent(W + ' .cg-delete') === 'Delete \u201COverdue\u201D?' &&
    (await page.evaluate(() => toolCustomizations.cg.cgSavedFilters.length)) === 2);
await page.click(W + ' .cg-delete');
ok('and deletes when asked again', (await page.evaluate(() => toolCustomizations.cg.cgSavedFilters.map(s => s.name).join())) === 'Low grades');
const again2 = await context.newPage();
await again2.goto('http://localhost:8777/index.html');
await again2.waitForSelector(W + ' .cg-class');
ok('saved filters are kept with the tool', (await again2.evaluate((s) => Array.from(document.querySelector(s + ' .cg-saved').options).map(o => o.textContent).join(), W)) ===
    'All tasks,Low grades');
await again2.close();

// Sections: saved filters one after another, in the order chosen.
const clear = () => page.click(W + ' .cg-filters .cg-btn:has-text("Clear filters")');
await clear();
await chip('status', 'missing');
await saveAs('Missing');
await clear();
await chip('status', 'upcoming');
await page.selectOption(W + ' .cg-sort', 'oldest');
await saveAs('Upcoming');
await clear();
await page.selectOption(W + ' .cg-sort', 'newest');
await page.fill(W + ' .cg-q', 'zzz');
await saveAs('Nothing');
await page.fill(W + ' .cg-q', '');
await page.dispatchEvent(W + ' .cg-q', 'input');
await page.selectOption(W + ' .cg-view', 'sections');
ok('Sections is a view, with its own editor — and says the filters there are for saved filters', await page.isVisible(W + ' .cg-sections-editor') &&
    await page.isVisible(W + ' .cg-sections-hint') &&
    /Save a filter first|Add section/.test(await page.textContent(W + ' .cg-add-section')));
for (const n of ['Missing', 'Upcoming', 'Nothing']) await page.selectOption(W + ' .cg-add-section', n);
const sectionNames = () => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .cg-sections-list li')).map(l => l.dataset.name), W);
ok('sections are added in order', JSON.stringify(await sectionNames()) === JSON.stringify(['Missing', 'Upcoming', 'Nothing']));
ok('a saved filter already a section is not offered again', (await page.evaluate((s) => Array.from(document.querySelector(s + ' .cg-add-section').options)
    .map(o => o.value).filter(Boolean).join(), W)) === 'Low grades', await page.textContent(W + ' .cg-add-section'));
text = await report();
ok('the report is the sections, one after another', text ===
    'Missing (1 task in 1 class)\n  \uD83D\uDFE9 Math - 92.4% (A-)\n      \u2B1C 5.3 Homework - Not graded - \uD83D\uDEAB Missing - Due ' + await fmt(-5) +
    '\n\nUpcoming (2 tasks in 1 class)\n  \uD83D\uDFE9 Math - 92.4% (A-)\n      \u2B1C 5.6 Project - Not graded - \u23F3 Not submitted - Due ' + await fmt(3) +
    '\n      \u2B1C 6.1 Final - Not graded - \u23F3 Not submitted - Due ' + await fmt(40) +
    '\n\nNothing (Nothing here)', text);
ok('each with its own order: Upcoming oldest first', text.indexOf('5.6 Project') < text.indexOf('6.1 Final'));
ok('an empty section says so', /Nothing here\./.test(await page.textContent(W + ' .cg-section[data-section="Nothing"]')));
ok('sections and their classes start open', await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .cg-section, ' + s + ' .cg-section .cg-class')).every(d => d.open), W));
await page.click(W + ' .cg-sections-list li[data-name="Upcoming"] button[aria-label="Move Upcoming up"]');
ok('↑ moves a section earlier', JSON.stringify(await sectionNames()) === JSON.stringify(['Upcoming', 'Missing', 'Nothing']) &&
    (await report()).indexOf('Upcoming (') < (await report()).indexOf('Missing ('));
ok('and the keyboard stays with it', await page.evaluate(() => document.activeElement.closest('li') && document.activeElement.closest('li').dataset.name) === 'Upcoming');
await page.click(W + ' .cg-sections-list li[data-name="Nothing"] button[aria-label="Remove Nothing"]');
ok('× takes a section out', JSON.stringify(await sectionNames()) === JSON.stringify(['Upcoming', 'Missing']) && !/Nothing  \(/.test(await report()));
ok('class summaries are left out, the sections being the summary', !/due this week/.test(await report()));
await page.check(W + ' .cg-section-summaries');
ok('and come back when asked', /\n  Missing 1, late 1, 1 due this week\. /.test(await report()));
await page.uncheck(W + ' .cg-section-summaries');
await page.click(W + ' .cg-btn:has-text("Copy")');
await page.waitForTimeout(200);
ok('Copy copies the sections, in order', await page.evaluate(() => navigator.clipboard.readText()) === await aligned());
await page.selectOption(W + ' .cg-saved', 'Upcoming');
await page.click(W + ' .cg-rename');
await page.fill(W + ' .cg-save-name', 'Coming up');
await page.press(W + ' .cg-save-name', 'Enter');
ok('renaming a saved filter renames its section', JSON.stringify(await sectionNames()) === JSON.stringify(['Coming up', 'Missing']) &&
    /^Coming up \(/.test(await report()));
await page.selectOption(W + ' .cg-saved', 'Missing');
await page.click(W + ' .cg-delete');
await page.click(W + ' .cg-delete');
ok('deleting one takes its section out, and says so', JSON.stringify(await sectionNames()) === JSON.stringify(['Coming up']) &&
    /“Missing” was a section/.test(await page.textContent(W + ' .cg-sections-note')) && !/Missing \(/.test(await report()));
const again3 = await context.newPage();
await again3.goto('http://localhost:8777/index.html');
await again3.waitForSelector(W + ' .cg-section');
ok('the sections and their order are kept with the tool', await again3.inputValue(W + ' .cg-view') === 'sections' &&
    /^Coming up \(/.test(await again3.evaluate((s) => classGradesWidgetText(document.querySelector(s)), W)));
await again3.close();
mathScore = 97;
await page.click(W + ' .cg-section .cg-class[data-course="1"] .cg-class-refresh');
await page.waitForFunction((s) => /refreshed/.test(document.querySelector(s + ' .cg-status').textContent), W, { timeout: 15000 });
ok('↻ on a class in a section refreshes it everywhere', /Math - 97%/.test(await report()));
await page.screenshot({ path: OUT + '/class-grades-sections.png' });
mathScore = 92.4;
await clear();
await page.selectOption(W + ' .cg-view', 'single');
ok('Single filter is the report as it was', !(await page.isVisible(W + ' .cg-sections-editor')) && /Art - No grade/.test(await report()) &&
    !/Coming up  \(/.test(await report()));
await page.click(W + ' .cg-btn:has-text("Refresh")');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary');
await clear();

// The order of classes: by name, by grade, by what is missing, or one's own — with
// some pinned to the top and some left out.
const classOrder = () => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .cg-report .cg-class')).map(d => Number(d.dataset.course)), W);
ok('classes go by name to begin with', JSON.stringify(await classOrder()) === '[3,2,1]' && await page.inputValue(W + ' .cg-class-sort') === 'name');
await page.selectOption(W + ' .cg-class-sort', 'grade');
ok('lowest grade first, ungraded last', JSON.stringify(await classOrder()) === '[2,1,3]', JSON.stringify(await classOrder()));
await page.selectOption(W + ' .cg-class-sort', 'missing');
ok('most missing first', JSON.stringify(await classOrder()) === '[1,3,2]', JSON.stringify(await classOrder()));
await page.selectOption(W + ' .cg-class-sort', 'name');
await page.click(W + ' .cg-arrange');
ok('Arrange… lists every class to put in order', await page.getAttribute(W + ' .cg-arrange', 'aria-expanded') === 'true' &&
    (await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .cg-class-order li')).map(l => l.textContent.replace(/^\W+/, '')).join(), W)) === 'Art,Chemistry,Math');
await page.click(W + ' .cg-class-order li[data-course="1"] button[aria-label="Move Math up"]');
await page.click(W + ' .cg-class-order li[data-course="1"] button[aria-label="Move Math up"]');
ok('moving a class makes the order one’s own', JSON.stringify(await classOrder()) === '[1,3,2]' && await page.inputValue(W + ' .cg-class-sort') === 'mine');
ok('and the keyboard stays with the class moved', await page.evaluate(() => document.activeElement.closest('li') && document.activeElement.closest('li').dataset.course) === '1');
await page.click(W + ' .cg-class-order li[data-course="2"] button[aria-label="Pin Chemistry"]');
ok('a pinned class goes to the top', JSON.stringify(await classOrder()) === '[2,1,3]');
await page.selectOption(W + ' .cg-class-sort', 'name');
ok('and stays there in any order', JSON.stringify(await classOrder()) === '[2,3,1]', JSON.stringify(await classOrder()));
await page.selectOption(W + ' .cg-class-sort', 'mine');
await page.click(W + ' .cg-class-order li[data-course="3"] button[aria-label="Hide Art"]');
ok('a hidden class is left out of the report', JSON.stringify(await classOrder()) === '[2,1]' && !/Art/.test(await report()));
ok('and says so, with a way to see it', /1 class hidden by you\./.test(await page.textContent(W + ' .cg-report')) &&
    /line-through/.test(await page.evaluate((s) => getComputedStyle(document.querySelector(s + ' .cg-class-order li[data-course="3"] .cg-co-name')).textDecorationLine, W)));
await page.click(W + ' .cg-show-hidden');
ok('Show them brings it back for now', JSON.stringify(await classOrder()) === '[2,1,3]');
await page.click(W + ' .cg-show-hidden');
ok('Hide them puts it away again', JSON.stringify(await classOrder()) === '[2,1]');
await page.screenshot({ path: OUT + '/class-grades-order.png' });
ok('Copy follows the order', /^\uD83D\uDFE5 Chemistry[^]*\n\n\uD83D\uDFE9 Math/.test(await report()) && !/Art/.test(await report()));
// In sections too.
await chip('status', 'in');
await saveAs('Handed in');
await clear();
await page.selectOption(W + ' .cg-view', 'sections');
await page.selectOption(W + ' .cg-add-section', 'Handed in');
const handedIn = () => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .cg-section[data-section="Handed in"] .cg-class')).map(d => Number(d.dataset.course)), W);
ok('sections keep the same order, pinned first, hidden out', JSON.stringify(await handedIn()) === '[2,1]', JSON.stringify(await handedIn()));
await page.selectOption(W + ' .cg-view', 'single');
// A class that arrives later goes to the end of one's own order.
extraCourse = true;
await page.click(W + ' .cg-btn:has-text("Refresh")');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary');
ok('a class that arrives later goes to the end', JSON.stringify(await classOrder()) === '[2,1,5]', JSON.stringify(await classOrder()));
extraCourse = false;
await page.click(W + ' .cg-btn:has-text("Refresh")');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary');
const again4 = await context.newPage();
await again4.goto('http://localhost:8777/index.html');
await again4.waitForSelector(W + ' .cg-class');
ok('the order, pins and hidden classes are kept, per student', JSON.stringify(await again4.evaluate((s) =>
    Array.from(document.querySelectorAll(s + ' .cg-report .cg-class')).map(d => Number(d.dataset.course)), W)) === '[2,1]' &&
    JSON.stringify(Object.keys(await page.evaluate(() => toolCustomizations.cg.cgClassOrder))) === '["11"]');
await again4.close();
ok('and hold nothing about grades', JSON.stringify(await page.evaluate(() => toolCustomizations.cg.cgClassOrder)) ===
    JSON.stringify({ 11: { mode: 'mine', order: ['1', '3', '2'], pinned: ['2'], hidden: ['3'] } }),
    JSON.stringify(await page.evaluate(() => toolCustomizations.cg.cgClassOrder)));
// Back to the order the rest of the suite expects.
await page.evaluate(() => { delete toolCustomizations.cg.cgClassOrder; saveToolCustomizations(toolCustomizations);
    classGradesRender(document.querySelector('.tool[data-tool="cg"] .cg-widget')); });
await page.click(W + ' .cg-arrange');
await page.click(W + ' .cg-filters > summary');
await page.click(W + ' .cg-connection summary');
await page.fill(W + ' .cg-green', '95');
await page.dispatchEvent(W + ' .cg-green', 'change');
ok('the thresholds can move: 92.4% is orange under 95', (await report()).includes('🟧 Math - 92.4% (A-)'));
await page.fill(W + ' .cg-green', '90');
await page.dispatchEvent(W + ' .cg-green', 'change');
await page.click(W + ' .cg-connection summary');
await page.click(W + ' .cg-btn:has-text("Copy")');
await page.waitForTimeout(200);
ok('Copy puts the report on the clipboard as it reads, lined up', await page.evaluate(() => navigator.clipboard.readText()) === await aligned());

// 5. The grade moves between checks.
mathScore = 93.6;
await page.click(W + ' .cg-btn:has-text("Refresh")');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary');
ok('a second check says how each grade moved', (await report()).includes('Grade up 1.2 since last check.') &&
    (await report()).includes('No change since last check.') && (await report()).includes('No grade to compare.'));

// 5b. One class read again, and only that one.
const classState = (id) => page.evaluate(([s, id]) => {
    const d = document.querySelector(s + ' .cg-class[data-course="' + id + '"]');
    return d ? { open: d.open, summary: d.querySelector('summary').textContent.replace(/ {2,}/g, ' ') } : null;
}, [W, id]);
const stamps = () => page.evaluate((i) => {
    const d = JSON.parse(localStorage.getItem('toolboard_classGradesData_' + i));
    const snap = d.snapshots[Object.keys(d.snapshots)[0]];
    return Object.fromEntries(snap.courses.map(c => [c.id, c.refreshedAt]));
}, 'cg');
const fullStamps = await stamps();
ok('a full refresh stamps every class with the same time', Object.values(fullStamps).length === 3 && new Set(Object.values(fullStamps)).size === 1);
ok('each class line says when it was refreshed', await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .cg-class summary .cg-refreshed'))
    .every(e => /^· refreshed today \d/.test(e.textContent) && !e.classList.contains('stale')), W));
ok('but the copied report keeps its own format', !/refreshed/.test(await report()));
await page.waitForTimeout(1100);
const chemBefore = await classState(2);
const mathFoldBefore = (await classState(1)).open;
mathScore = 95;
requests.length = 0;
await page.click(W + ' .cg-class[data-course="1"] .cg-class-refresh');
await page.waitForFunction((s) => /refreshed/.test(document.querySelector(s + ' .cg-status').textContent), W, { timeout: 15000 });
ok('↻ on a class reads only that class', requests.length > 0 &&
    requests.every(r => /\/api\/v1\/courses\/1(\/assignments|\?|$)/.test(new URL(r.url).pathname + new URL(r.url).search.slice(0, 1))), JSON.stringify(requests.map(r => new URL(r.url).pathname)));
ok('its grade and its change since its last check are new', (await report()).includes('Math - 95% (A-)') &&
    /Math[^]*?Grade up 1\.4 since last check\./.test(await report()));
ok('the other classes are as they were', JSON.stringify(await classState(2)) === JSON.stringify(chemBefore));
ok('pressing it does not fold or open the class', (await classState(1)).open === mathFoldBefore);
ok('and the status says which class, and when', /^Math refreshed /.test(await status()), await status());
const afterOne = await stamps();
ok('↻ restamps that class alone', afterOne[1] > fullStamps[1] && afterOne[2] === fullStamps[2] && afterOne[3] === fullStamps[3]);
ok('the class keeps when it was refreshed, on its ↻', /refreshed /.test(await page.getAttribute(W + ' .cg-class[data-course="1"] .cg-class-refresh', 'title')));
brokenClass = 2;
await page.click(W + ' .cg-class[data-course="2"] .cg-class-refresh');
await page.waitForFunction((s) => document.querySelector(s + ' .cg-status').classList.contains('error'), W, { timeout: 15000 });
ok('a class that fails says so, by name, and keeps what it had', /^Chemistry: The school answered 500/.test(await status()) &&
    JSON.stringify(await classState(2)) === JSON.stringify(chemBefore), await status());
brokenClass = null;
ok('when, said as a person would', await page.evaluate(() => {
    const now = new Date(2026, 9, 27, 15, 0).getTime();
    return [classGradesWhen(new Date(2026, 9, 27, 7, 4).getTime(), now), classGradesWhen(new Date(2026, 9, 26, 18, 10).getTime(), now),
        classGradesWhen(new Date(2026, 9, 25, 15, 0).getTime(), now)].join(' | ');
}) === 'today 7:04 AM | yesterday 6:10 PM | Oct 25, 3:00 PM', await page.evaluate(() => classGradesWhen(new Date(2026, 9, 25, 15, 0).getTime(), new Date(2026, 9, 27, 15, 0).getTime())));
await page.evaluate((i) => {
    const key = 'toolboard_classGradesData_' + i;
    const d = JSON.parse(localStorage.getItem(key));
    const snap = d.snapshots[Object.keys(d.snapshots)[0]];
    snap.courses.find(c => c.id === 2).refreshedAt = Date.now() - 2 * 86400000;
    localStorage.setItem(key, JSON.stringify(d));
    classGradesRender(document.querySelector('.tool[data-tool="' + i + '"] .cg-widget'));
}, 'cg');
ok('a class not refreshed for over a day is marked stale', await page.evaluate((s) => {
    const e = document.querySelector(s + ' .cg-class[data-course="2"] .cg-refreshed');
    const m = document.querySelector(s + ' .cg-class[data-course="1"] .cg-refreshed');
    return e.classList.contains('stale') && !/today|yesterday/.test(e.textContent) && !m.classList.contains('stale');
}, W));
// Back where the rest of the suite expects it.
mathScore = 93.6;
await page.click(W + ' .cg-btn:has-text("Refresh")');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary');

// 6. Reloaded: the report is still there, the token is not.
await page.reload();
await page.waitForSelector(W);
await page.waitForTimeout(400);
ok('after a reload the last report shows at once', (await report()).includes('93.6%'));
await page.click(W + ' .cg-btn:has-text("Refresh")');
await page.waitForTimeout(200);
ok('but a token not remembered is gone, and it asks for one', /Paste an access token/.test(await status()) &&
    await page.evaluate((s) => document.querySelector(s).classList.contains('error'), W + ' .cg-status'));
await connect('student-token', true);
await page.reload();
await page.waitForSelector(W);
await page.waitForTimeout(300);
requests.length = 0;
await page.click(W + ' .cg-btn:has-text("Refresh")');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary');
ok('a remembered token survives the reload', requests.length > 0 && /^Updated/.test(await status()) && await page.isChecked(W + ' .cg-remember'));
await page.click(W + ' .cg-connection summary');
await page.click(W + ' .cg-btn:has-text("Forget token")');
ok('Forget removes it', await page.evaluate(() => Object.keys(localStorage).every(k => !/classGradesToken/.test(k))) &&
    /forgotten/.test(await status()));

// 7. A school that will not be read directly: the board's proxy, token in the header.
schoolMode = 'blocked';
requests.length = 0;
await page.reload();
await page.waitForSelector(W);
await connect('student-token', false);
const proxied = requests.filter(r => r.via === 'proxy');
ok('blocked directly, it goes through the board’s proxy', proxied.length > 0 && (await report()).includes('Math - 93.6%'));
ok('with the token in the Authorization header', proxied.every(r => r.auth === 'Bearer student-token'));
ok('and never in an address', requests.every(r => !r.url.includes('student-token')));
ok('and says it went round', /via the board’s proxy/.test(await status()), await status());
proxyMode = 'flaky';
requests.length = 0;
await page.click(W + ' .cg-btn:has-text("Refresh")');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary', { timeout: 30000 });
ok('a proxy request that falls over is tried again, and the report still comes', flaked.size >= 3 &&
    /^Updated/.test(await status()) && (await report()).includes('5.4 Test Review'), await status());
proxyMode = 'flaky2';
await page.click(W + ' .cg-btn:has-text("Refresh")');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary', { timeout: 60000 });
ok('one that falls over twice running is tried a third time, and the report still comes', [...flaked2.values()].every(n => n === 2) && flaked2.size >= 3 &&
    /^Updated/.test(await status()), await status());
proxyMode = 'down';
requests.length = 0;
const downStarted = Date.now();
await page.click(W + ' .cg-btn:has-text("Refresh")');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary', { timeout: 60000 });
ok('a proxy that keeps falling over is said to have failed, not to have refused the page',
    /proxy failed while reading \/api\/v1\/courses\/\d+\/assignments\. Try Refresh/.test(await status()), await status());
const tries = requests.filter(r => r.via === 'proxy' && /assignments/.test(r.target));
ok('after three tries, waiting longer before each', tries.length === 3 && Date.now() - downStarted >= 5500, tries.length + ' tries in ' + (Date.now() - downStarted) + 'ms');
proxyMode = 'school503';
requests.length = 0;
await page.click(W + ' .cg-btn:has-text("Refresh")');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary', { timeout: 60000 });
ok('the school’s own 503 is said to be the school’s', /The school answered 503 for \/api\/v1\/.*assignments\. Try Refresh/.test(await status()), await status());
ok('tried once more, not three times', requests.filter(r => r.via === 'proxy' && /assignments/.test(r.target)).length === 2);
proxyMode = 'ok';
proxyMode = 'forbidden';
await page.reload();
await page.waitForSelector(W);
await connect('student-token', false);
ok('a proxy that will not answer this page is explained, naming the page', /proxy does not answer this page \(http:\/\/localhost:8777\)/.test(await status()), await status());
proxyMode = 'preflight';
await page.reload();
await page.waitForSelector(W);
await connect('student-token', false);
ok('so is one that refuses before the request — what the browser reports as a failed fetch', /proxy did not answer this page \(http:\/\/localhost:8777\)/.test(await status()), await status());
proxyMode = 'not-permitted';
await page.reload();
await page.waitForSelector(W);
await connect('student-token', false);
ok('and a school address the proxy will not reach for a page from disk points to the instructure.com one', /instructure\.com address/.test(await status()), await status());
proxyMode = 'ok';
schoolMode = 'direct';

// 8. A refused token.
await page.reload();
await page.waitForSelector(W);
await connect('wrong-token', false);
ok('a refused token says so', /token was refused \(401\)/.test(await status()), await status());

// 8b. An answer that is not a list is an error, not "no work".
notAList = true;
await page.reload();
await page.waitForSelector(W);
await connect('student-token', false);
ok('an answer that is not a list is said to be one, with what the school said', /answered \/api\/v1\/courses\/2\/assignments with user not authorized to perform that action, not a list/.test(await status()), await status());
notAList = false;

// 8c. Classes fold: closed to begin with, each saying how many tasks it has.
await connect('student-token', false);
const folds = () => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .cg-class')).map(d => ({
    open: d.open, tasksShown: d.querySelector('.cg-tasks').checkVisibility(),
    summary: d.querySelector('summary').textContent })), W);
let f = await folds();
ok('every class starts folded, its tasks hidden', f.length === 3 && f.every(x => !x.open && !x.tasksShown), JSON.stringify(f.map(x => x.open)));
ok('its line, task count and summary still showing', f.some(x => /Math {2,}93\.6% \(A-\) +· 5 tasks/.test(x.summary) && /Missing 1, late 1, 1 due this week\./.test(x.summary)),
    f.map(x => x.summary).join(' | '));
await page.click(W + ' .cg-class[data-course="1"] > summary');
f = await folds();
ok('a class opens to its tasks', f.find(x => /Math/.test(x.summary)).open && f.find(x => /Math/.test(x.summary)).tasksShown);
await page.click(W + ' .cg-btn:has-text("Expand all")');
ok('Expand all opens every class', (await folds()).every(x => x.open));
await page.reload();
await page.waitForSelector(W + ' .cg-class');
ok('and they are still open after a reload', (await folds()).every(x => x.open));
await page.click(W + ' .cg-btn:has-text("Collapse all")');
ok('Collapse all folds them again', (await folds()).every(x => !x.open));
await page.click(W + ' .cg-btn:has-text("Copy")');
await page.waitForTimeout(200);
ok('Copy still copies every task, folded or not', /5\.4 Test Review/.test(await page.evaluate(() => navigator.clipboard.readText())));

// 9. A parent's token: the students it is linked to.
await page.evaluate(() => { Object.keys(localStorage).filter(k => /classGrades/.test(k)).forEach(k => localStorage.removeItem(k)); });
await page.reload();
await page.waitForSelector(W);
await connect('parent-token', false);
text = await report();
ok('a parent’s token shows a student, named at the top', text.startsWith('Sam Student\n\n'), text.slice(0, 40));
ok('with that student’s classes only', text.includes('Math - 93.6%') && text.includes('Chemistry') && !text.includes('History'));
ok('and that student’s work, from the submissions the assignments carry', text.includes('5.4 Test Review - 18/20 (90%) - ✅ Submitted'));
ok('a parent reads each class as the student sees it', requests.some(r => /\/users\/11\/courses\/1\/assignments/.test(decodeURIComponent(r.url))) &&
    !requests.some(r => /observed_users/.test(decodeURIComponent(r.url)) && /assignments/.test(r.url)));
ok('a class whose assignments come back empty to a parent is read from the student’s submissions',
    text.includes('    \uD83D\uDFE5 2.1 Lab - 6/10 (60%) - \u2705 Submitted') &&
    requests.some(r => /courses\/2\/students\/submissions\?student_ids\[\]=11&include\[\]=assignment/.test(decodeURIComponent(r.url))));
ok('a course’s own letter grade is shown', text.includes('Math - 93.6% (A-)'));
ok('a grade that only repeats the percentage is not said twice: the letter comes from the scale', text.includes('Chemistry - 68% (D+)\n') && !text.includes('68% (68)'), text.slice(0, 200));
ok('saying where each letter came from', await page.evaluate((s) => {
    const title = (id) => document.querySelector(s + ' .cg-class[data-course="' + id + '"] > summary').title;
    return /course’s grading scheme/.test(title(1)) && /scale in the connection settings/.test(title(2));
}, W));
ok('the scale, at its boundaries (as the % is shown, to a tenth)', await page.evaluate(() => {
    const sc = classGradesParseScale(CLASS_GRADES_SCALE);
    return [93, 92.9, 92.96, 60, 59.9, 87, 0].map(x => classGradesLetter(x, sc)).join();
}) === 'A,A-,A,D-,F,B+,F');
const setScale = (v) => page.evaluate(([s, v]) => {
    const i = document.querySelector(s + ' .cg-scale');
    i.value = v;
    i.dispatchEvent(new Event('change', { bubbles: true }));
}, [W, v]);
ok('the scale is there to change, the common one to begin with', await page.inputValue(W + ' .cg-scale') === 'A 93, A- 90, B+ 87, B 83, B- 80, C+ 77, C 73, C- 70, D+ 67, D 63, D- 60, F 0');
await setScale('nonsense');
ok('a scale that does not read is not kept, and says how to write one', /Write it as letters/.test(await page.textContent(W + ' .cg-scale-msg')) &&
    !(await page.evaluate(() => toolCustomizations.cg.cgScale)));
await setScale('A 90; B 80; C 70; D 60; F 0');
ok('a scale of one’s own takes over', (await report()).includes('Chemistry - 68% (D)\n') &&
    await page.evaluate(() => toolCustomizations.cg.cgScale) === 'A 90, B 80, C 70, D 60, F 0');
ok('but never over a course’s own letter', (await report()).includes('Math - 93.6% (A-)'));
await page.click(W + ' .cg-btn:has-text("Copy")');
await page.waitForTimeout(200);
ok('Copy has the letters', /Chemistry - 68% \(D\)/.test(flat(await page.evaluate(() => navigator.clipboard.readText()))));
await setScale('F 0, D 60, C 70, B 80, A 90, A+ 97');
ok('written in any order, it is read highest first', await page.inputValue(W + ' .cg-scale') === 'A+ 97, A 90, B 80, C 70, D 60, F 0');
await setScale('A 93, A- 90, B+ 87, B 83, B- 80, C+ 77, C 73, C- 70, D+ 67, D 63, D- 60, F 0');
ok('back to the common scale, nothing of one’s own is kept', await page.evaluate(() => toolCustomizations.cg.cgScale) === undefined &&
    (await report()).includes('Chemistry - 68% (D+)'));
ok('more than one student: a picker', await page.evaluate((s) => !document.querySelector(s).hidden &&
    Array.from(document.querySelector(s).options).map(o => o.textContent).join() === 'Sam Student,Alex Student', W + ' .cg-student'));
await page.selectOption(W + ' .cg-student', '12');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary');
await page.waitForTimeout(100);
text = await report();
ok('picking another shows theirs', text.startsWith('Alex Student\n\n') && text.includes('History - 81% (B-)') && !text.includes('Math'), text);
ok('read from the course’s submissions when the assignments do not bring them', text.includes('Essay 1 - 9/10 (90%) - ✅ Submitted') &&
    requests.some(r => /students\/submissions\?student_ids\[\]=12/.test(decodeURIComponent(r.url))));
requests.length = 0;
await page.click(W + ' .cg-class[data-course="4"] .cg-class-refresh');
await page.waitForFunction((s) => /refreshed/.test(document.querySelector(s + ' .cg-status').textContent), W, { timeout: 15000 });
ok('a parent refreshes one of a student’s classes the same way', requests.some(r => /\/users\/12\/courses\/4\/assignments/.test(r.url)) &&
    !requests.some(r => /\/courses\/1\b|users\/self/.test(r.url)) && (await report()).includes('Essay 1 - 9/10'));
ok('the choice is kept with the tool', await page.evaluate(() => toolCustomizations.cg.cgStudent) === '12');

// On-device AI: ✨ in the header, BoardAI's popup, the grade report compact and read only.
const P = '#boardAIPopup ';
const aiOpen = async () => {
    await page.evaluate(() => { const p = document.getElementById('boardAIPopup'); if (p && !p.hidden) boardAIClose(); });
    await page.hover('.tool[data-tool="cg"] .tool-header');
    await page.click('.tool[data-tool="cg"] .ai-btn');
    await page.waitForTimeout(150);
};
const aiText = () => page.evaluate(() => classGradesAIText('cg', Date.now()).text);
ok('Class Grades offers ✨, where the model can run', await page.isVisible('.tool[data-tool="cg"] .tool-header .ai-btn') ||
    await page.evaluate(() => !!document.querySelector('.tool[data-tool="cg"] .ai-btn') && document.documentElement.dataset.ai === 'on'));
await aiOpen();
ok('its own actions, and Ask: nothing that would rewrite a report', await page.evaluate(() =>
    Array.from(document.querySelectorAll('#boardAIPopup .bai-group')).map(g => g.textContent).join()) === 'Grades,Ask' &&
    await page.evaluate(() => Array.from(document.querySelectorAll('#boardAIPopup .bai-item')).map(b => b.textContent).join('|')) ===
        'Student summary|What needs attention|What’s due this week|Ask about it…');
ok('saying whose report, and that it is all of it', await page.textContent(P + '.bai-scope') === 'Alex Student · 1 class, all of them, whatever the filters show',
    await page.textContent(P + '.bai-scope'));
let ai = await aiText();
ok('the report it reads: today, the student, each class with its grade and letter', /^Today is \w+day, /.test(ai) && ai.includes('Student: Alex Student.') &&
    ai.includes('Class: History — 81% (B-)'), ai);
ok('and the work graded lately', ai.includes('Graded in the last 14 days: Essay 1: 9/10 (90%)'), ai);
ok('and nothing of the token', !/token|Bearer/i.test(ai));
await page.selectOption(W + ' .cg-student', '11');
await page.waitForFunction((s) => !document.querySelector(s).disabled, W + ' .cg-btn.primary');
await page.waitForTimeout(100);
ai = await aiText();
ok('another student, their own report', ai.includes('Student: Sam Student.') && ai.includes('Class: Chemistry — 68% (D+)') && !ai.includes('History'), ai);
ok('what is missing, with when it was due', /Missing: 5\.3 Homework \(was due \w{3}, \w{3} \d+\)/.test(ai), ai);
ok('what came in late', /Late: 5\.5 Quiz \(handed in late/.test(ai));
ok('what is due within two weeks, and not what is further off', /Due in the next 14 days: 5\.6 Project \(due/.test(ai) && !ai.includes('6.1 Final'));
await page.evaluate(() => { classGradesSaveCustom('cg', { cgFilter: { status: ['missing'] } });
    classGradesRender(document.querySelector('.tool[data-tool="cg"] .cg-widget')); });
ok('the filters only showing what is missing', !(await report()).includes('5.4 Test Review'));
ok('the report it reads is all of it, whatever the filters show', (await aiText()).includes('5.4 Test Review: 18/20 (90%)'));
await page.evaluate(() => { classGradesSaveCustom('cg', { cgFilter: undefined });
    classGradesRender(document.querySelector('.tool[data-tool="cg"] .cg-widget')); });
await page.evaluate(() => classGradesSaveCustom('cg', { cgClassOrder: { '11': { mode: 'name', order: [], pinned: [], hidden: ['2'] } } }));
ok('but not a class hidden by hand', !(await aiText()).includes('Chemistry'), await aiText());
await page.evaluate(() => classGradesSaveCustom('cg', { cgClassOrder: undefined }));
await aiOpen();
await page.evaluate(() => { window.__ai.reply = () => '- **Chemistry** needs attention: 68% (D+), 5.3 Homework missing.'; });
await page.click(P + '.bai-item[data-ai="custom:summary"]');
await page.waitForFunction(() => !document.querySelector('#boardAIPopup .bai-foot').hidden, null, { timeout: 5000 });
const asked = await page.evaluate(() => window.__ai.calls.filter(c => c.op === 'prompt').pop().input);
ok('Student summary asks with its own instruction, over the report', /^Summarize this grade report/.test(asked) && asked.includes('Class: Chemistry — 68% (D+)'));
ok('told to use only the report', /never invent a class, a task, a grade or a date/.test(await page.evaluate(() => window.__ai.calls.filter(c => c.op === 'create').pop().system)));
ok('the answer shows', /Chemistry needs attention/.test(await page.textContent(P + '.bai-out')));
ok('and can only be copied: a report is not written into', await page.evaluate(() =>
    Array.from(document.querySelectorAll('#boardAIPopup .bai-foot button')).filter(b => !b.hidden).map(b => b.textContent).join()) === 'Copy,Discard');
await page.click(P + '.bai-copy');
await page.waitForTimeout(150);
ok('Copy copies it', /Chemistry\*\* needs attention/.test(await page.evaluate(() => navigator.clipboard.readText())));
ok('and nothing of it is kept', !(await page.evaluate(() => Object.keys(localStorage).some(k => (localStorage.getItem(k) || '').includes('needs attention')))));
await page.click(P + '.bai-back');
await page.click(P + '.bai-item[data-ai="custom:week"]');
await page.waitForFunction(() => !document.querySelector('#boardAIPopup .bai-foot').hidden, null, { timeout: 5000 });
ok('What’s due this week asks for that', /^List the work due in the next 7 days/.test(await page.evaluate(() => window.__ai.calls.filter(c => c.op === 'prompt').pop().input)));
await page.screenshot({ path: OUT + '/class-grades-ai.png' });
await page.click(P + '.bai-x');
ok('with no grades yet, there is nothing to read, and it says so', JSON.stringify(await page.evaluate(() => classGradesAITarget('no-such-tool'))) ===
    JSON.stringify({ text: '', scope: 'whole', emptyLabel: 'No grades to read yet: connect and Refresh first.' }));

// 20. Columns. A task's name, grade, status and due date — and its class's name and
// grade — line up by spaces in the report's mono font, a class's grade in the same
// column as its tasks'. A name too long for its column is cut short on screen, its
// whole name in the tooltip and in Copy.
const LONG = 'A very long assignment name that goes on and on, well past the column';
await page.evaluate(([long, due, sub]) => {
    const data = classGradesData('cg');
    const snap = data.snapshots[Object.keys(data.snapshots)[0]];
    const math = snap.courses.find(c => c.tasks && c.tasks.length);
    math.tasks.push({ id: 'long', name: long, due: due, score: 8, points: 10, submittedAt: sub, state: 'graded' });
    classGradesSaveData('cg', data);
    const widget = document.querySelector('.tool[data-tool="cg"] .cg-widget');
    classGradesRender(widget);
    widget.querySelectorAll('.cg-class').forEach(d => { d.open = true; });
}, [LONG, iso(2), iso(1)]);
await page.waitForTimeout(200);
// Where each column starts on screen: the character after each run of two or more spaces.
const measure = () => page.evaluate((s) => {
    const xs = (el) => {
        const nodes = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let n, text = '';
        while ((n = walk.nextNode())) {
            if (n.parentNode.closest('.cg-count, .cg-refreshed, .cg-class-refresh, .cg-class-summary')) continue;
            nodes.push({ n, at: text.length });
            text += n.data;
        }
        const at = (i) => { const k = nodes.filter(x => x.at <= i).pop(); const r = document.createRange(); r.setStart(k.n, i - k.at); r.setEnd(k.n, i - k.at + 1); return Math.round(r.getBoundingClientRect().left); };
        let start = 0;
        return text.split('\n').map(line => {
            const cols = [];
            const re = / {2,}(?=\S)/g;
            let m;
            while ((m = re.exec(line))) cols.push(at(start + m.index + m[0].length));
            start += line.length + 1;
            return cols;
        }).filter(c => c.length);
    };
    return Array.from(document.querySelectorAll(s + ' .cg-class')).map(d => ({
        head: xs(d.querySelector('summary'))[0], tasks: xs(d.querySelector('.cg-tasks')) }));
}, W);
const columns = await measure();
const tasks = columns.flatMap(c => c.tasks);
const same = (list) => list.every(x => Math.abs(x - list[0]) <= 1);
ok('every task’s grade, status and due date start in the same column, in every class', tasks.length > 3 &&
    [0, 1, 2].every(k => same(tasks.map(t => t[k]))), JSON.stringify(tasks.slice(0, 4)));
ok('and each class’s grade in the same column as its tasks’ grades', columns.every(c => c.head && Math.abs(c.head[0] - tasks[0][0]) <= 1),
    JSON.stringify(columns.map(c => c.head)) + ' vs ' + tasks[0][0]);
const cut = await page.evaluate((s) => { const e = Array.from(document.querySelectorAll(s + ' .cg-tasks span[title]'))[0]; return e ? { title: e.title, text: e.textContent } : null; }, W);
ok('a name too long for its column is cut short on screen, its whole name in the tooltip', !!cut && cut.title === LONG &&
    /^\S+ A very long assignment name that go.*…/.test(cut.text) && !cut.text.includes('past the column'), JSON.stringify(cut));
ok('and does not push the other columns out (checked above, with it among them)', tasks.some(t => t.length === 3));
const copyText = await aligned();
ok('Copy keeps the whole name', copyText.includes(LONG));
const textCol = (line) => { const m = /\S {2,}(?=\S)/.exec(line); return m ? Array.from(line.slice(0, m.index + m[0].length)).length : -1; };
const textLines = copyText.split('\n');
const headLine = textLines.find(l => /Math/.test(l) && !/^ /.test(l));
const taskLine = textLines.find(l => /^ {4}\S/.test(l) && !l.includes(LONG));
ok('in Copy too, a class’s grade is in the column of its tasks’ grades, indent and all', textCol(headLine) === textCol(taskLine) && textCol(headLine) > 0,
    JSON.stringify([headLine, taskLine]));
// Sections line up with each other, not each on its own: one section holding only a
// short name and another only the long one still share their columns.
await page.evaluate(() => {
    classGradesSaveCustom('cg', { cgSavedFilters: [{ name: 'Labs', filter: { q: 'Lab' } }, { name: 'Long one', filter: { q: 'very long' } }],
        cgSections: ['Labs', 'Long one'], cgView: 'sections' });
    const widget = document.querySelector('.tool[data-tool="cg"] .cg-widget');
    classGradesRender(widget);
    widget.querySelectorAll('.cg-class').forEach(d => { d.open = true; });
});
await page.waitForTimeout(200);
const across = await measure();
const acrossTasks = across.flatMap(c => c.tasks);
ok('in Sections, the columns line up across sections, not only within each', across.length >= 2 && acrossTasks.length >= 2 &&
    [0, 1, 2].every(k => same(acrossTasks.map(t => t[k]))) && across.every(c => c.head && Math.abs(c.head[0] - acrossTasks[0][0]) <= 1),
    JSON.stringify(across));
const sectionText = (await aligned()).split('\n');
const sHead = sectionText.find(l => /^ {2}\S/.test(l)), sTask = sectionText.find(l => /^ {6}\S/.test(l) && !l.includes(LONG));
ok('and in their Copy', textCol(sHead) === textCol(sTask) && textCol(sHead) > 0, JSON.stringify([sHead, sTask]));
await page.evaluate(() => { classGradesSaveCustom('cg', { cgView: 'single' }); classGradesRender(document.querySelector('.tool[data-tool="cg"] .cg-widget')); });
ok('a name with runs of spaces in it is written with one, so they cannot pass for a column', await page.evaluate(() => classGradesOneLine('  Unit   3\tQuiz ')) === 'Unit 3 Quiz');

await page.screenshot({ path: OUT + '/class-grades.png' });
await page.evaluate(() => document.body.classList.add('dark-mode'));
await page.waitForTimeout(150);
await page.screenshot({ path: OUT + '/class-grades-dark.png' });

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
