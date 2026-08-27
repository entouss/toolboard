import { chromium } from 'playwright';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const FIXTURE = JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures', 'curriculum-fixture.json'), 'utf8'));
const seed = () => {
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('toolboard_pluginUrls', JSON.stringify(['plugins/toolboxes/school-tools.js']));
    localStorage.setItem('financeCurrentBoard', 'default');
    localStorage.setItem('finance_default_customTools', JSON.stringify(['cur']));
    localStorage.setItem('finance_default_positions', JSON.stringify({
        cur: { x: 10, y: 10, z: 100, width: 980, height: 640 }
    }));
    localStorage.setItem('finance_default_toolCustomizations', JSON.stringify({
        cur: { templateId: 'curriculum-explorer', title: 'Curriculum' }
    }));
};
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(seed);
await page.goto('http://localhost:8777/index.html');
await page.waitForSelector('.tool[data-tool="cur"] .curr-widget', { timeout: 10000 });
await page.waitForTimeout(700);

ok('the tool renders', await page.locator('.curr-widget').count() === 1);
ok('it opens on the JSON pane', await page.evaluate(() =>
    document.querySelector('.tool[data-tool="cur"]').classList.contains('authoring-edit')));

// Sample first — the quickest proof the whole pipeline works.
await page.hover(".tool[data-tool=\"cur\"] .tool-header");
await page.waitForTimeout(300);
await page.click(".curr-source-actions button:has-text(\"Sample\")");
await page.waitForTimeout(600);
const sample = await page.evaluate(() => ({
    mode: document.querySelector('.tool[data-tool="cur"]').className,
    courses: document.querySelectorAll('.curr-course').length,
    status: document.querySelector('.curr-status').textContent,
    cells: document.querySelectorAll('.curr-cell').length
}));
ok('the sample loads and switches to the explorer',
    /authoring-render/.test(sample.mode) && sample.courses > 5, JSON.stringify(sample));
ok('the grid has four years of four terms', sample.cells === 16, String(sample.cells));

// Now the real fixture, pasted.
await page.evaluate((doc) => {
    const box = document.querySelector('.curr-json');
    box.value = JSON.stringify(doc);
    currLoadSource(document.querySelector('.curr-json'));
}, FIXTURE);
await page.waitForTimeout(700);
const loaded = await page.evaluate(() => ({
    courses: document.querySelectorAll('.curr-course').length,
    sections: Array.from(document.querySelectorAll('.curr-section-title')).map(s => s.textContent),
    status: document.querySelector('.curr-status').textContent
}));
ok('the fixture loads all its courses', loaded.courses === 47, loaded.courses + ' rows');
ok('grouped by the departments in the document', loaded.sections.length >= 6, JSON.stringify(loaded.sections));

// Place something and see it land.
await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.textContent.includes('Algebra I'));
    row.querySelector('.curr-add').click();
});
await page.waitForTimeout(400);
const placed = await page.evaluate(() => ({
    cards: document.querySelectorAll('.curr-card').length,
    where: document.querySelector('.curr-card') &&
        document.querySelector('.curr-card').closest('.curr-cell').getAttribute('data-term'),
    stored: JSON.parse(localStorage.getItem('finance_default_toolCustomizations')).cur.curriculum.plan
}));
ok('a course can be placed and is saved', placed.cards === 1, JSON.stringify(placed));

await page.screenshot({ path: OUT + '/curr-smoke.png' });
console.log('\npage errors:', errors.length ? errors.join(' | ') : 'none');
await browser.close();
