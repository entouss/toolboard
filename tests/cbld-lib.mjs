// Shared setup for the Curriculum Builder suites.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const OUT = path.join(HERE, 'out');
export const REPO = path.join(HERE, '..');
export const FIXTURE = JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures', 'curriculum-fixture.json'), 'utf8'));

export const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

const seed = ({ builder, size }) => {
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('toolboard_pluginUrls', JSON.stringify(['plugins/toolboxes/school-tools.js']));
    localStorage.setItem('financeCurrentBoard', 'default');
    localStorage.setItem('finance_default_customTools', JSON.stringify(['bld']));
    localStorage.setItem('finance_default_positions', JSON.stringify({
        bld: { x: 8, y: 8, z: 100, width: size[0], height: size[1] }
    }));
    localStorage.setItem('finance_default_toolCustomizations', JSON.stringify({
        bld: Object.assign({ templateId: 'curriculum-builder', title: 'Builder' },
            builder ? { builder: builder } : {})
    }));
};

// `doc: null` gives an empty builder; otherwise the document is already open.
export async function open({ doc = FIXTURE, ui, size = [1040, 700],
    viewport = { width: 1300, height: 860 } } = {}) {
    const browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const builder = doc ? {
        catalog: doc, sourceUrl: null,
        ui: Object.assign({ section: 'courses', selected: null, search: '', checkOpen: false, open: [] }, ui || {})
    } : null;
    await page.addInitScript(seed, { builder, size });
    await page.goto('http://localhost:8777/index.html');
    await page.waitForSelector('.tool[data-tool="bld"] .cbld-widget', { timeout: 15000 });
    await page.waitForTimeout(600);
    return { browser, page, errors };
}

// The document as the tool would write it out.
export const written = (page) => page.evaluate(() => cbldGetData('bld').catalog);

// The actions bar is the framework's hover bar, so it has to be revealed first.
export async function bar(page) {
    await page.hover('.tool[data-tool="bld"] .tool-header');
    await page.waitForTimeout(250);
}

export const stored = (page) => page.evaluate(() =>
    JSON.parse(localStorage.getItem('finance_default_toolCustomizations')).bld.builder);

export const finish = async (browser, errors) => {
    console.log('  page errors:', errors.length ? errors.join(' | ') : 'none');
    await browser.close();
};
