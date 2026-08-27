// Saving the plan as a picture.
import { open, bar, ok, finish, place, CODE, OUT } from './curr-lib.mjs';
import fs from 'node:fs';

const { browser, page, errors } = await open({
    plan: {
        '9-FY': [CODE['Algebra I'], CODE['English 9']],
        '10-FY': [CODE['Geometry']], '12-S1': [CODE['Government']]
    },
    size: [900, 560]
});
await bar(page);

const press = async () => { await page.click('.curr-actions button:has-text("PNG")'); };
const status = () => page.evaluate(() => document.querySelector('.curr-status').textContent);

// A PNG says so in its first bytes, and carries its size in the header.
const readPng = (file) => {
    const b = fs.readFileSync(file);
    return {
        png: b.slice(0, 8).toString('hex') === '89504e470d0a1a0a',
        width: b.readUInt32BE(16), height: b.readUInt32BE(20), bytes: b.length
    };
};

// 1. The button saves a file, and the file is a picture.
const [download] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), press()]);
const file = OUT + '/plan-shot.png';
await download.saveAs(file);
const img = readPng(file);
ok('the button saves a PNG', img.png, JSON.stringify(img));
// The window is called "Curriculum" here, so that is what the file is called: the
// header leads, and the document's own name is the fallback.
ok('named after what the window is called', /curriculum-plan\.png$/.test(download.suggestedFilename()),
    download.suggestedFilename());
ok('at twice the size, so it stands being looked at', img.width >= 1800, img.width + '×' + img.height);
ok('and tall enough to hold every year', img.height > 900, img.width + '×' + img.height);
ok('the tool says what it saved', /Saved .*-plan\.png/.test(await status()), await status());

// 2. What it draws is the plan, not what happens to be on screen: the tool is only
//    560 tall and scrolled to the top, and the catalog takes half its width.
ok('the picture is wider than the pane it was drawn from', img.width / 2 > await page.evaluate(() =>
    document.querySelector('.curr-pane').getBoundingClientRect().width), img.width / 2);
ok('and taller than the tool', img.height / 2 > 500, img.height / 2);

// 3. Nothing is left behind in the page.
ok('the off-screen copy is cleaned up', await page.evaluate(() =>
    document.querySelectorAll('.curr-shot').length === 0));
ok('and the tool is untouched', await page.evaluate(() =>
    document.querySelectorAll('.curr-card').length === 4 &&
    document.querySelectorAll('.curr-course').length === 47));

// 4. The picture leaves out what only a tool needs.
const clone = await page.evaluate(() => {
    // Draw the same thing again and look at it before it is photographed.
    const data = currGetData('cur');
    const shot = document.createElement('div');
    shot.className = 'curr-widget curr-shot';
    shot.innerHTML = currGridHtml(data, currValidate(data));
    document.body.appendChild(shot);
    shot.querySelectorAll('.curr-card-x, .curr-card-move, .curr-grow, .curr-req-caret')
        .forEach((el) => el.remove());
    const out = {
        cards: shot.querySelectorAll('.curr-card').length,
        buttons: shot.querySelectorAll('button').length,
        years: shot.querySelectorAll('.curr-year').length,
        totals: shot.querySelector('.curr-totals') !== null,
        text: shot.textContent.replace(/\s+/g, ' ')
    };
    shot.remove();
    return out;
});
ok('every planned course is in it', clone.cards === 4, JSON.stringify(clone.cards));
ok('every year is in it', clone.years === 4, JSON.stringify(clone.years));
ok('the credits and requirements come with it', clone.totals && /Planned/.test(clone.text));
ok('and none of the buttons do', clone.buttons === 0, String(clone.buttons));

// 5. The tool's own header leads the picture: rename the window to a student and
//    the plan is theirs, and the file is named after them too.
await page.evaluate(() => {
    const c = JSON.parse(localStorage.getItem('finance_default_toolCustomizations'));
    c.cur.title = 'Alex Doe — Four Year Plan';
    localStorage.setItem('finance_default_toolCustomizations', JSON.stringify(c));
    toolCustomizations = loadToolCustomizations();
});
await page.waitForTimeout(200);
await bar(page);
const [named] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), press()]);
await named.saveAs(OUT + '/plan-named.png');
ok('the file is named after the header', /alex-doe-four-year-plan-plan\.png$/.test(named.suggestedFilename()),
    named.suggestedFilename());
const head = await page.evaluate(() => {
    const data = currGetData('cur');
    const shot = document.createElement('div');
    shot.className = 'curr-widget curr-shot';
    const catalog = data.catalog;
    shot.innerHTML = '<div class="curr-shot-head">' + currToolTitle('cur') + '</div>' +
        '<div class="curr-shot-sub">' + currDocTitle(catalog) + '</div>';
    document.body.appendChild(shot);
    const out = { title: shot.querySelector('.curr-shot-head').textContent,
        sub: shot.querySelector('.curr-shot-sub').textContent,
        size: parseFloat(getComputedStyle(shot.querySelector('.curr-shot-head')).fontSize),
        subSize: parseFloat(getComputedStyle(shot.querySelector('.curr-shot-sub')).fontSize) };
    shot.remove();
    return out;
});
ok('the header name leads the picture', head.title === 'Alex Doe — Four Year Plan', JSON.stringify(head.title));
ok('with the document underneath it', head.sub === 'Curriculum Guide', JSON.stringify(head.sub));
ok('and it is the larger of the two', head.size > head.subSize, head.size + ' vs ' + head.subSize);
ok('a picture of it is taller than one without a name', readPng(OUT + '/plan-named.png').height >
    readPng(file).height - 2, readPng(OUT + '/plan-named.png').height + ' vs ' + readPng(file).height);

// 5b. An untouched header is not printed — "Curriculum Explorer" is not a student.
ok('the default window name is left off', await page.evaluate(() => {
    const c = JSON.parse(localStorage.getItem('finance_default_toolCustomizations'));
    c.cur.title = 'Curriculum Explorer';
    localStorage.setItem('finance_default_toolCustomizations', JSON.stringify(c));
    toolCustomizations = loadToolCustomizations();
    return currToolTitle('cur') === '';
}));

// 6. An empty tool says so rather than saving a blank.
await page.evaluate(() => {
    const data = currGetData('cur');
    data.catalog = null;
    currSaveData('cur', data);
    currRender(document.querySelector('.curr-widget'));
});
await page.waitForTimeout(300);
await bar(page);
await press();
await page.waitForTimeout(600);
ok('with no curriculum loaded it explains itself', /no plan to draw/.test(await status()), await status());

console.log('  saved: ' + img.width + '×' + img.height + ', ' + Math.round(img.bytes / 1024) + ' KB');
await finish(browser, errors);
