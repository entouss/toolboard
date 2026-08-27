// Shared setup for the Curriculum Doctor suites.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const OUT = path.join(HERE, 'out');
export const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

const seed = ({ doc, size }) => {
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('toolboard_pluginUrls', JSON.stringify(['plugins/toolboxes/school-tools.js']));
    localStorage.setItem('financeCurrentBoard', 'default');
    localStorage.setItem('finance_default_customTools', JSON.stringify(['doc']));
    localStorage.setItem('finance_default_positions', JSON.stringify({
        doc: { x: 8, y: 8, z: 100, width: size[0], height: size[1] }
    }));
    localStorage.setItem('finance_default_toolCustomizations', JSON.stringify({
        doc: Object.assign({ templateId: 'curriculum-doctor', title: 'Doctor' },
            doc ? { doctor: { catalog: doc, ui: { open: [] } }, viewMode: 'render' } : {})
    }));
};

export async function open({ doc = null, size = [1000, 700], viewport = { width: 1200, height: 820 } } = {}) {
    const browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.addInitScript(seed, { doc, size });
    await page.goto('http://localhost:8777/index.html');
    await page.waitForSelector('.tool[data-tool="doc"] .cdoc-widget', { timeout: 15000 });
    await page.waitForTimeout(600);
    return { browser, page, errors };
}

// Every finding, straight from the checker.
export const check = (page, doc) => page.evaluate((d) =>
    cdocCheck(d || cdocGetData('doc').catalog), doc);

export const kinds = async (page, doc) => {
    const r = await check(page, doc);
    const by = {};
    r.findings.forEach(f => { by[f.kind] = (by[f.kind] || 0) + 1; });
    return by;
};

export async function finish(browser, errors) {
    console.log('  page errors: ' + (errors.length ? JSON.stringify(errors) : 'none'));
    await browser.close();
}
