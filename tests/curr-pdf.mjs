// The catalog as something to read on paper.
import { open, bar, ok, finish, OUT } from './curr-lib.mjs';
import { chromium } from 'playwright';
import fs from 'node:fs';

const { browser, page, errors } = await open({ hidden: { departments: [] } });

const html = () => page.evaluate(() => currCatalogPrintHtml(currGetData('cur')));
const status = () => page.evaluate(() => document.querySelector('.curr-status').textContent);

// 1. It is a document of its own, not a slice of the board.
const doc = await html();
ok('it is a whole HTML document', /^<!doctype html>/i.test(doc) && /<\/html>$/.test(doc), doc.slice(0, 30));
ok('it carries its own print styling, and no board styling', /@page/.test(doc) && !/var\(--/.test(doc));
ok('and is sized in points, so it prints at a readable size',
    /font: 10pt/.test(doc) && !/font-size: \d+(\.\d+)?px/.test(doc),
    (doc.match(/font: [^;]+;/) || [''])[0]);
ok('and it says what document it came from',
    /<h1>Curriculum Guide<\/h1>/.test(doc) && /Sample High School · 2026-2027/.test(doc),
    (doc.match(/<h1>[^<]*<\/h1>/) || [''])[0]);

// 1b. It has to fit the width of a page. When it does not, the browser scales the
//     whole document down to fit the paper and the type shrinks with it — which is
//     what "the PDF is tiny" turned out to be.
const fit = await page.evaluate(() => {
    const frame = document.createElement('iframe');
    frame.style.cssText = 'position:fixed;left:-20000px;top:0;width:794px;height:1123px;border:0;';
    document.body.appendChild(frame);
    frame.contentDocument.open();
    frame.contentDocument.write(currCatalogPrintHtml(currGetData('cur')));
    frame.contentDocument.close();
    const out = { page: 794, content: frame.contentDocument.documentElement.scrollWidth,
        body: Math.round(frame.contentDocument.body.getBoundingClientRect().width) };
    frame.remove();
    return out;
});
ok('the document fits the width of a page, so nothing is scaled down',
    fit.content <= fit.page + 1, JSON.stringify(fit));

// 1c. And the frame it prints from is the size of a page, not nothing: a frame with
//     no width lays the document out at its minimum and prints that, scaled.
const frameCss = await page.evaluate(() => {
    const frame = document.createElement('iframe');
    frame.className = 'curr-print-frame';
    document.body.appendChild(frame);
    const box = frame.getBoundingClientRect();
    const out = { w: Math.round(box.width), h: Math.round(box.height) };
    frame.remove();
    return out;
});
ok('the frame it prints from is page-sized', frameCss.w > 700 && frameCss.h > 1000,
    JSON.stringify(frameCss));

// 2. Every course is in it, grouped as the catalog groups them.
ok('every course is in it', (doc.match(/class="course"/g) || []).length === 47,
    String((doc.match(/class="course"/g) || []).length));
ok('grouped by department', (doc.match(/<h2>/g) || []).length >= 8,
    String((doc.match(/<h2>/g) || []).length));
ok('with subject areas under them', /<h3>Visual Arts<\/h3>/.test(doc));
ok('each course has its number and title', /class="code">1000<\/span> Algebra I/.test(doc));
ok('prerequisites are printed as the guide words them', /<b>Needs:<\/b> Geometry/.test(doc));
ok('descriptions come through', /Trigonometry and analytic geometry/.test(doc));
ok('and the flags a course carries are named', /Lab science/.test(doc));

// 3. What is printed about each course comes from the schema, and only what this
//    document fills in.
const fields = await page.evaluate(() => currPrintFields(currGetData('cur').catalog.courses));
ok('booleans are printed by name only when true',
    /class="fact">Elective</.test(doc) && !/Is elective: false/.test(doc) && !/: true/.test(doc),
    (doc.match(/class="fact">[A-Za-z ]+</g) || []).slice(0, 3).join(' '));
ok('the field list is drawn from the schema', fields.includes('department') &&
    fields.includes('semester_offered') && fields.includes('grade_levels'), JSON.stringify(fields));
ok('and leaves out what is handled on its own', !fields.includes('title') &&
    !fields.includes('prerequisites') && !fields.includes('flags'), JSON.stringify(fields));
const bare = await page.evaluate(() => currPrintFields([
    { course_code: '1', title: 'Bare', department: 'X', flags: {},
      prerequisites: { raw: null, courses: [], grade_requirements: [] } }
]));
ok('a document that fills in little prints little', bare.length <= 2, JSON.stringify(bare));

// 4. Requirements lead the document.
ok('what is required is printed first', doc.indexOf('What is required') < doc.indexOf('Mathematics'),
    'requirements at ' + doc.indexOf('What is required'));
ok('with the credits each subject needs', /<td>Theology<\/td><td class="num">4.0<\/td>/.test(doc));

// 5. Filters and hiding carry through: what you see is what you print.
await page.evaluate(() => {
    const data = currGetData('cur');
    data.ui.department = 'Science';
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(300);
const filtered = await html();
ok('a filtered catalog prints what is left', (filtered.match(/class="course"/g) || []).length === 5,
    String((filtered.match(/class="course"/g) || []).length));
ok('and says so at the top', /5 of 47 courses/.test(filtered), (filtered.match(/\d+ of \d+ courses/) || [''])[0]);
await page.evaluate(() => {
    const data = currGetData('cur');
    data.ui.department = '';
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(300);

// 6. Printing builds the document in a frame and clears up after itself.
await bar(page);
await page.evaluate(() => {
    // The dialog is not something a test can answer, so watch what gets built.
    window.__built = null;
    new MutationObserver((records) => {
        records.forEach((r) => r.addedNodes.forEach((n) => {
            if (n.tagName !== 'IFRAME' || n.className !== 'curr-print-frame') return;
            try { n.contentWindow.print = () => { window.__printed = true; }; } catch (e) {}
            setTimeout(() => {
                try {
                    window.__built = {
                        frame: Math.round(n.getBoundingClientRect().width),
                        layout: n.contentDocument.documentElement.scrollWidth,
                        courses: n.contentDocument.querySelectorAll('.course').length,
                        font: n.contentDocument.defaultView.getComputedStyle(n.contentDocument.body).fontSize
                    };
                } catch (e) { window.__built = { error: e.message }; }
            }, 60);
        }));
    }).observe(document.body, { childList: true });
});
await page.click('.curr-catalog-foot button');
await page.waitForTimeout(500);
const built = await page.evaluate(() => ({ built: window.__built, printed: Boolean(window.__printed) }));
ok('the catalog is built into a page-sized frame',
    built.built.frame > 700 && built.built.courses === 47, JSON.stringify(built.built));
ok('laid out to fit that page, so nothing is scaled by the browser',
    built.built.layout <= built.built.frame + 1, built.built.layout + ' in ' + built.built.frame);
ok('at ten point', built.built.font === '13.3333px', built.built.font);
ok('and printing is what it asks for', built.printed);
ok('printing says what it is doing, and where to look if it comes out small',
    /Save as PDF/.test(await status()) && /Scale/.test(await status()), await status());
await page.waitForTimeout(1500);
ok('the frame it used is gone afterwards', await page.evaluate(() =>
    document.querySelectorAll('.curr-print-frame').length === 0));

// 7. Nothing to print is said, not printed.
await page.evaluate(() => {
    const data = currGetData('cur');
    data.ui.search = 'zzzz-no-such-course';
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(300);
await bar(page);
await page.click('.curr-catalog-foot button');
await page.waitForTimeout(400);
ok('an empty catalog refuses to print', /every course is filtered out or hidden/.test(await status()),
    await status());

// 8. The document really does make a PDF: hand it to a browser and print it.
fs.writeFileSync(OUT + '/catalog-print.html', doc);
const printer = await chromium.launch({ channel: 'chrome' });
const sheet = await printer.newPage();
await sheet.goto('file://' + OUT + '/catalog-print.html');
await sheet.pdf({ path: OUT + '/catalog.pdf', format: 'A4', printBackground: true });
await printer.close();
const pdf = fs.readFileSync(OUT + '/catalog.pdf');
ok('the document prints to a PDF', pdf.slice(0, 5).toString() === '%PDF-', pdf.slice(0, 8).toString());
const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
ok('paginated by the browser rather than one long sheet', pages >= 2, pages + ' pages');
// Ten point type on A4 fits roughly 45 lines of body text; a page holding far more
// than that would mean the size had slipped back towards unreadable.
const perPage = 47 / pages;
ok('and the courses are spread out, not crammed', perPage < 12, perPage.toFixed(1) + ' courses a page');
// A PDF of text carries fonts; a picture of a page would carry one big image and
// weigh far more per page.
const raw = pdf.toString('latin1');
ok('what is in it is text, with fonts, not a picture',
    /\/Type\s*\/Font/.test(raw) && !/\/Subtype\s*\/Image/.test(raw),
    (raw.match(/\/BaseFont\s*\/[A-Za-z+-]+/) || ['no font'])[0]);
ok('and it is a small file for its length', pdf.length / pages < 60 * 1024,
    Math.round(pdf.length / pages / 1024) + ' KB per page');
console.log('  produced: ' + pages + ' pages, ' + Math.round(pdf.length / 1024) + ' KB');

await finish(browser, errors);
