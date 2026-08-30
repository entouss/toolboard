// Shared setup for the Curriculum Explorer suites.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const OUT = path.join(HERE, 'out');
export const FIXTURE = JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures', 'curriculum-fixture.json'), 'utf8'));

export const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

// Codes are stable in the fixture, but naming them by title keeps the suites readable.
export const CODE = {};
FIXTURE.courses.forEach((c) => { CODE[c.title] = c.course_code; });

const seed = ({ curriculum, size }) => {
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('toolboard_pluginUrls', JSON.stringify(['plugins/toolboxes/school-tools.js']));
    localStorage.setItem('financeCurrentBoard', 'default');
    localStorage.setItem('finance_default_customTools', JSON.stringify(['cur']));
    localStorage.setItem('finance_default_positions', JSON.stringify({
        cur: { x: 8, y: 8, z: 100, width: size[0], height: size[1] }
    }));
    localStorage.setItem('finance_default_toolCustomizations', JSON.stringify({
        // A tool that already has a document is one the user has loaded, so it is in
        // the mode loading leaves it in.
        cur: Object.assign({ templateId: 'curriculum-explorer', title: 'Curriculum' },
            curriculum ? { curriculum: curriculum, viewMode: 'render' } : {})
    }));
};

// `loaded: false` gives an empty tool; otherwise the document is already in place
// so a suite can get straight to what it is testing.
export async function open({ loaded = true, doc = FIXTURE, plan = {}, completed = [], hidden, ui,
    size = [1000, 660], viewport = { width: 1200, height: 800 } } = {}) {
    const browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const curriculum = loaded ? {
        catalog: doc,
        plan: plan,
        completed: completed,
        hidden: Object.assign({ departments: [], subjects: [], courses: [] }, hidden || {}),
        ui: Object.assign({ tab: 'grid' }, ui || {})
    } : null;
    await page.addInitScript(seed, { curriculum, size });
    await page.goto('http://localhost:8777/index.html');
    await page.waitForSelector('.tool[data-tool="cur"] .curr-widget', { timeout: 15000 });
    await page.waitForTimeout(600);
    return { browser, page, errors };
}

// Load, File and Sample live in the JSON pane now, so that pane has to be showing
// before any of them can be pressed.
export async function sourcePane(page) {
    await page.evaluate(() => setToolMode('cur', 'split'));
    await page.waitForTimeout(400);
}

// The actions bar is the framework's hover bar, so it has to be revealed first.
export async function bar(page) {
    await page.hover('.tool[data-tool="cur"] .tool-header');
    await page.waitForTimeout(250);
}

// What the tool has actually kept for the school on screen. Storage holds a record
// of schools now, so this goes through the app's own accessor rather than reaching
// into the shape — which is the point of an accessor.
export const stored = (page) => page.evaluate(() => currGetData('cur'));

// The record behind it: every school, and which one is showing.
export const record = (page) => page.evaluate(() =>
    JSON.parse(localStorage.getItem('finance_default_toolCustomizations')).cur.curriculum);

export const rowFor = (page, title) => page.evaluateHandle((t) =>
    Array.from(document.querySelectorAll('.curr-course'))
        .find((r) => r.querySelector('.curr-course-title').textContent === t), title);

// Place a course by selecting its catalog row and clicking a cell — the path a
// person without a mouse to drag with would take.
export async function place(page, title, term) {
    await page.evaluate(({ t, term }) => {
        const row = Array.from(document.querySelectorAll('.curr-course'))
            .find((r) => r.querySelector('.curr-course-title').textContent === t);
        row.click();
        document.querySelector('.curr-cell[data-term="' + term + '"]').click();
    }, { t: title, term });
    await page.waitForTimeout(250);
}

export const issues = (page) => page.evaluate(() =>
    currValidate(currGetData('cur')).issues.map((i) =>
        ({ severity: i.severity, kind: i.kind, code: i.code, message: i.message })));

export const finish = async (browser, errors) => {
    console.log('  page errors:', errors.length ? errors.join(' | ') : 'none');
    await browser.close();
};
