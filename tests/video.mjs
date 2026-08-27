// A screen recording of a plan being filled in. Silent: the narration is on screen,
// and the pointer is drawn into the page, because the recorder captures the page
// and not the cursor.
import { chromium } from 'playwright';
import { installCursor, clickAt, clickEmptyIn, moveTo, placeByClick } from './cursor.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const SIZE = { width: 1280, height: 800 };

// Six credits a year, every year. Algebra I is met before the plan starts.
const MET = ['12003100'];
// Every course on these cards runs a full year, so a level has one cell and six
// courses fill it.
const YEARS = {
    '9-FY':  ['10013200', '12063100', '20003201', '30260150', '07085320', '88005100'],
    '10-FY': ['10013500', '12003300', '20025100', '21093200', '07085340', '94010100'],
    '11-FY': ['10013800', '12023520', '20003600', '21003200', '82095100', '82151200'],
    '12-FY': ['10014100', '12023100', '20033900', '21063200', '21023240', '90072100']
};

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: SIZE, acceptDownloads: true,
    recordVideo: { dir: OUT + '/video', size: SIZE } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));

await page.goto('http://localhost:8777/index.html#tool/curriculum-explorer?curriculum=/learn/data/westhaven-2026-2027.json');
await page.waitForSelector('.curr-widget', { timeout: 20000 });
await page.waitForTimeout(2500);
await installCursor(page);

await page.evaluate(() => {
    const bar = document.createElement('div');
    bar.id = 'vo';
    bar.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99998;' +
        'background:rgba(15,15,35,.93);color:#fff;padding:11px 22px;font-size:20px;line-height:1.3;' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'text-align:center;opacity:0;transition:opacity .3s;pointer-events:none;' +
        'width:max-content;max-width:66vw;border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,.45)';
    document.body.appendChild(bar);
    const s = document.querySelector('.curr-status'); if (s) s.textContent = '';
    // The print dialog is the operating system's, and no recording of the page can
    // show it. The document it would print is real; only the dialog is held back.
    window.print = () => {};
});
const timeline = [];
let t0 = 0;
const say = async (text, hold) => {
    if (!t0) t0 = Date.now();
    timeline.push({ at: Date.now() - t0, hold, text });
    await page.evaluate((t) => {
        const b = document.getElementById('vo');
        b.style.opacity = '0';
        setTimeout(() => { b.textContent = t; b.style.opacity = '1'; }, 240);
    }, text);
    await page.waitForTimeout(hold);
};
const TOOL = await page.evaluate(() =>
    document.querySelector('.curr-widget').closest('.tool').getAttribute('data-tool'));
// One at a time, so each card is seen arriving, and with the pointer standing in
// the cell it lands in rather than nowhere at all.
const placeOne = async (term, code) => {
    await page.evaluate((sel) => {
        const cell = document.querySelector(sel);
        if (!cell) return;
        const b = cell.getBoundingClientRect();
        const cards = Array.from(cell.querySelectorAll('.curr-card'));
        const floor = cards.length ? cards[cards.length - 1].getBoundingClientRect().bottom : b.top;
        const y = (b.bottom - floor) > 14 ? (floor + b.bottom) / 2 : b.bottom - 8;
        document.getElementById('vcur').style.transform =
            'translate(' + (b.left + Math.min(b.width / 2, 120) - 3) + 'px,' + (y - 2) + 'px)';
    }, '.curr-cell[data-term="' + term + '"]');
    await page.waitForTimeout(330);
    await page.evaluate(({ k, c }) => {
        currUpdate(document.querySelector('.curr-widget'), (d) => {
            const have = d.plan[k] || [];
            if (!have.includes(c)) d.plan[k] = have.concat([c]);
        });
    }, { k: term, c: code });
    await page.waitForTimeout(260);
};

// 1 ── the empty grid
await say('Four years of classes. One grid.', 2600);

// 2 ── what is already done, clicked for real
await say('Start with what is already done.', 2400);
await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('.curr-course'))
        .find(r => (r.querySelector('.curr-course-title') || {}).textContent === 'Algebra 1');
    if (row) row.setAttribute('data-vtarget', '1');
});
await clickAt(page, '.curr-course[data-vtarget]', { after: 600 });
await page.evaluate(() => {
    const r = document.querySelector('.curr-course[data-vtarget]'); if (r) r.removeAttribute('data-vtarget');
});
await say('Algebra 1 was taken in middle school, so it counts without taking a seat.', 2600);
await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('.curr-details .curr-btn'))
        .find(x => x.textContent.trim() === 'Already met');
    if (b) b.setAttribute('data-vtarget', '1');
});
await clickAt(page, '.curr-details .curr-btn[data-vtarget]', { after: 900 });

// 3 ── place a few by hand, so the way it works is visible
await say('Pick a course, pick a year.', 2200);
await placeByClick(page, 'English 1 Honors', 9);
await placeByClick(page, 'English 2 Honors', 10);
await say('The required sequences go straight down the grid.', 2200);
await placeByClick(page, 'English 3 Honors', 11);
await placeByClick(page, 'English 4 Honors', 12);

// 4 ── the chain
await say('For a long chain, look at what has to come first.', 2400);
await page.evaluate(() => currSelectCode(new Event('click'), document.querySelector('.curr-widget'), '12023100'));
await page.waitForTimeout(500);
await clickAt(page, '.curr-tab', { nth: 1, after: 2400 });
await say('Then work backwards: Calculus in twelfth, its chain below it.', 2600);
await clickAt(page, '.curr-tab', { nth: 0, after: 700 });

// 5 ── the rest, six credits a year
await say('Then fill each year to a full load — six credits here.', 2200);
for (const term of Object.keys(YEARS)) {
    for (const code of YEARS[term]) await placeOne(term, code);
}
await page.waitForTimeout(600);

// 6 ── the finished plan
await say('Four balanced years, and every requirement counted.', 3400);
await page.evaluate(() => {
    const t = document.querySelector('.curr-totals');
    if (t) t.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
});
await page.waitForTimeout(2400);
await say('Nothing conflicts — only the GPA minimums worth checking.', 2600);
await clickAt(page, '.curr-tab', { nth: 2, after: 2600 });
await clickAt(page, '.curr-tab', { nth: 0, after: 900 });

// 7 ── the catalog as a document
await say('The whole catalog prints as a PDF, too.', 2600);
await clickAt(page, '.curr-catalog-foot button', { after: 1200 });
await page.evaluate((id) => {
    const doc = currCatalogPrintHtml(currGetData(id));
    const wrap = document.createElement('div');
    wrap.id = 'vpdf';
    wrap.style.cssText = 'position:fixed;inset:0;z-index:99997;background:rgba(15,15,35,.72);' +
        'display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .4s';
    const f = document.createElement('iframe');
    f.style.cssText = 'width:600px;height:640px;border:0;border-radius:6px;background:#fff;' +
        'box-shadow:0 12px 40px rgba(0,0,0,.5)';
    wrap.appendChild(f);
    document.body.appendChild(wrap);
    f.contentDocument.open(); f.contentDocument.write(doc); f.contentDocument.close();
    requestAnimationFrame(() => { wrap.style.opacity = '1'; });
    window.__vpdfFrame = f;
}, TOOL);
await page.waitForTimeout(1600);
await say('Every course, laid out as a document.', 3000);
await page.evaluate(() => {
    const f = window.__vpdfFrame;
    if (!f || !f.contentWindow) return;
    let y = 0;
    const step = () => {
        if (!f.isConnected || !f.contentWindow) return;
        y += 9; f.contentWindow.scrollTo(0, y);
        if (y < 2200) requestAnimationFrame(step);
    };
    step();
});
await page.waitForTimeout(3200);
await page.evaluate(() => { const w = document.getElementById('vpdf'); if (w) w.style.opacity = '0'; });
await page.waitForTimeout(700);
await page.evaluate(() => { const w = document.getElementById('vpdf'); if (w) w.remove(); });

// 8 ── the plan as a picture
await say('And the plan itself saves as an image.', 2400);
await page.hover('.tool[data-tool="' + TOOL + '"] .tool-header');
await page.waitForTimeout(400);
await clickAt(page, '.curr-actions .curr-btn', { after: 600 });
await page.waitForTimeout(3000);

// 9 ── out
await say('Fifteen minutes, and a plan to take to your counselor.', 3400);
await page.evaluate(() => {
    document.getElementById('vo').style.opacity = '0';
    document.getElementById('vcur').style.transform = 'translate(-100px,-100px)';
});
await page.waitForTimeout(1600);

const final = await page.evaluate((id) => {
    const d = currGetData(id);
    const planner = currPlanner(d);
    const v = currValidate(d);
    return {
        perYear: planner.levels.map(l => l + ': ' + currLevelCredits(d, l, planner)),
        cards: document.querySelectorAll('.curr-card').length,
        errors: v.errors, warnings: v.warnings,
        totals: document.querySelector('.curr-totals').textContent.replace(/\s+/g, ' ').slice(0, 150)
    };
}, TOOL);
console.log(JSON.stringify(final, null, 1));
console.log('page errors:', JSON.stringify(errors));
fs.writeFileSync(OUT + '/narration.json', JSON.stringify(timeline, null, 2));
await page.screenshot({ path: OUT + '/video-final.png' });
await ctx.close();
await browser.close();
