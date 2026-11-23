// The Vacation Planner: a trip from one date to another, a tab a day. Each new day
// starts with its AM, XM and PM meals, which move, stretch and go like any block;
// time is added by clicking or dragging on the day. Places open in Google Maps, a
// pasted Maps link gives up its name and pin, and the day's places make its route.
// Checklists beside it, and one for each day. A made-up trip throughout.
import { chromium } from 'playwright';
let count = 0;
const ok = (l, p, d) => { count++; console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : '')); };

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1300, height: 950 }, locale: 'en-US', permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
let answer = true, asked = [];
page.on('dialog', (d) => { asked.push(d.message()); answer ? d.accept() : d.dismiss(); });
await page.goto('http://localhost:8777/index.html#tool/vacation-planner');
await page.waitForSelector('.vac-widget .vac-head', { timeout: 20000 });
await page.waitForTimeout(800);
const id = await page.evaluate(() => document.querySelector('.vac-widget').closest('.tool').dataset.tool);
const W = '.tool[data-tool="' + id + '"] .vac-widget';
const plan = () => page.evaluate((i) => JSON.parse(JSON.stringify((loadToolCustomizations()[i] || {}).vacPlan || null)), id);
const text = (s) => page.evaluate((s) => (document.querySelector(s) || {}).textContent || '', s.startsWith(W) ? s : W + ' ' + s);
const all = (s) => page.evaluate((s) => Array.from(document.querySelectorAll(s)).map(e => e.textContent.trim()), W + ' ' + s);
const setVal = async (s, v) => {
    const el = W + ' ' + s;
    if (await page.evaluate((e) => document.querySelector(e).tagName, el) === 'SELECT') await page.selectOption(el, v);
    else { await page.fill(el, v); await page.dispatchEvent(el, 'change'); }
    await page.waitForTimeout(80);
};
const tab = async (label) => { await page.click(W + ' .vac-tab:has-text("' + label + '")'); await page.waitForTimeout(80); };
const sub = async (id) => { await page.click(W + ' .vac-subtab[data-sub="' + id + '"]'); await page.waitForTimeout(80); };
const blockSel = (title) => W + ' .vac-grid .vac-block[title*="\u00B7 ' + title + '"]';
const box = (s) => page.locator(s).boundingBox();
const day = async (d) => (await plan()).days[d];
const find = (blocks, title) => blocks.find(b => (b.title || '') === title);
const D1 = '2027-07-09', D2 = '2027-07-10', D4 = '2027-07-12';

// 1. A new planner.
ok('a new planner asks for the dates', /Pick the dates of the trip/.test(await text('.vac-main')));
ok('the trip-wide tabs are there from the start', JSON.stringify(await all('.vac-tab')) === JSON.stringify(['Trip', '👥 People', '👕 Clothes', '✈️ Travel', '🏨 Stay', '🚢 Cruise', '📍 Places', '☑️ Lists', '🍽️ Meals', '💰 Budget']));
await tab('Lists');
ok('and comes with lists to start from', JSON.stringify(await all('.vac-chip')) === JSON.stringify(['Packing 0/5', 'To book 0/4', 'Before we leave 0/3', '+']),
    JSON.stringify(await all('.vac-chip')));
ok('To book has parking and a car rental', JSON.stringify(await page.evaluate(() => vacDefaultPlan().lists[1].items.map(x => x.text))) ===
    JSON.stringify(['Travel there and back', 'Where to stay', 'Parking', 'Car rental']));
ok('a list fills the main pane, with no side panel', !(await page.$(W + ' .vac-side')) && !!(await page.$(W + ' .vac-main .vac-pane .vac-list')));
await tab('Trip');

// 2. Dates make the days, each with its three meals.
await setVal('.vac-name', 'Lake week');
await setVal('.vac-start', D1);
ok('a start alone is a day', JSON.stringify(await all('.vac-tab')) === JSON.stringify(['Trip', '👥 People', '👕 Clothes', '✈️ Travel', '🏨 Stay', '🚢 Cruise', '📍 Places', '☑️ Lists', '🍽️ Meals', '💰 Budget', 'Fri, Jul 9']), JSON.stringify(await all('.vac-tab')));
await setVal('.vac-end', D4);
ok('a tab a day, and the trip', JSON.stringify(await all('.vac-tab')) ===
    JSON.stringify(['Trip', '👥 People', '👕 Clothes', '✈️ Travel', '🏨 Stay', '🚢 Cruise', '📍 Places', '☑️ Lists', '🍽️ Meals', '💰 Budget', 'Fri, Jul 9', 'Sat, Jul 10', 'Sun, Jul 11', 'Mon, Jul 12']), JSON.stringify(await all('.vac-tab')));
let p = await plan();
ok('saved, with its name', p.name === 'Lake week' && p.start === D1 && p.end === D4 && Object.keys(p.days).length === 4);
ok('every day starts with breakfast, lunch and dinner, as AM, XM and PM',
    Object.values(p.days).every(d => JSON.stringify(d.blocks.map(b => [b.meal, b.title, b.kind, b.start, b.end])) ===
        JSON.stringify([['am', 'Breakfast', 'food', 480, 540], ['xm', 'Lunch', 'food', 750, 810], ['pm', 'Dinner', 'food', 1110, 1200]])));
const tfill = await page.evaluate((s) => { const m = document.querySelector(s + ' .vac-main').getBoundingClientRect(),
    g = document.querySelector(s + ' .vac-tcol:not(.vac-taxis) .vac-tgrid').getBoundingClientRect(); return m.bottom - g.bottom; }, W);
ok('the Trip view’s hours fill the height too', tfill >= 0 && tfill < 17 + 8, String(tfill));
ok('the Trip view shows every day side by side', (await all('.vac-thead')).length === 5 &&
    (await page.$$(W + ' .vac-tcol .vac-block')).length === 12);

await tab('Fri, Jul 9');
ok('a day: its date and its meals, tagged', await text('.vac-day-head b') === 'Friday, July 9' &&
    JSON.stringify(await all('.vac-grid .vac-meal-tag')) === JSON.stringify(['AM', 'XM', 'PM']));
const PX = async () => +(await page.getAttribute(W + ' .vac-grid', 'data-px'));
let px = await PX();
const top0 = await page.evaluate((s) => parseFloat(document.querySelector(s).style.top), blockSel('Breakfast'));
ok('drawn at its time: 8 AM, two hours below 6 AM', top0 === 2 * px, String([top0, px]));
const fill = await page.evaluate((s) => { const m = document.querySelector(s + ' .vac-main').getBoundingClientRect(), g = document.querySelector(s + ' .vac-grid').getBoundingClientRect();
    return { gap: m.bottom - g.bottom, px: +document.querySelector(s + ' .vac-grid').dataset.px }; }, W);
ok('the day’s hours stretch to fill the height there is', fill.px > 30 && fill.gap >= 0 && fill.gap < 17 + 12, JSON.stringify(fill));
ok('with its time on it', /8:00\s?AM–9:00\s?AM/.test(await text('.vac-grid .vac-block .vac-b-time')));
ok('no route without places', !!(await page.$(W + ' .vac-route.vac-off')));

// 3. Dragging.
let b = await box(blockSel('Breakfast'));
await page.mouse.move(b.x + b.width / 2, b.y + 10);
await page.mouse.down();
await page.mouse.move(b.x + b.width / 2, b.y + 10 + px / 2, { steps: 4 });
await page.mouse.move(b.x + b.width / 2, b.y + 10 + px, { steps: 4 });
await page.mouse.up();
await page.waitForTimeout(100);
let bf = find((await day(D1)).blocks, 'Breakfast');
ok('a block dragged an hour down moves an hour, keeping its length', bf.start === 540 && bf.end === 600, JSON.stringify(bf));
ok('and is still a meal', bf.meal === 'am');
ok('and is the one chosen', await page.evaluate((s) => document.querySelector(s).classList.contains('vac-sel'), blockSel('Breakfast')));
b = await box(blockSel('Breakfast'));
await page.mouse.move(b.x + b.width / 2, b.y + b.height - 2);
await page.mouse.down();
await page.mouse.move(b.x + b.width / 2, b.y + b.height - 2 + px / 4, { steps: 3 });
await page.mouse.move(b.x + b.width / 2, b.y + b.height - 2 + px / 2, { steps: 3 });
await page.mouse.up();
await page.waitForTimeout(100);
bf = find((await day(D1)).blocks, 'Breakfast');
ok('its bottom edge dragged changes when it ends, by quarter hours', bf.start === 540 && bf.end === 630, JSON.stringify(bf));
ok('the other days keep theirs', find((await day(D2)).blocks, 'Breakfast').start === 480);

// 4. Adding time.
const grid = await box(W + ' .vac-grid');
const lane = await box(W + ' .vac-lane');
const yAt = (min) => grid.y + (min - 360) * px / 60;
await page.mouse.click(lane.x + 40, yAt(14 * 60 + 5));
await page.waitForTimeout(150);
let blocks = (await day(D1)).blocks;
let added = blocks.find(x => !x.meal);
ok('a click on empty time adds an hour there', added && added.start === 840 && added.end === 900 && added.kind === 'activity', JSON.stringify(added));
ok('and opens it, ready to name', await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' .vac-form [data-f="title"]'));
await page.keyboard.type('Boat tour');
await page.keyboard.press('Tab');
await page.waitForTimeout(100);
ok('named, it is saved and drawn', find((await day(D1)).blocks, 'Boat tour') && (await all('.vac-grid .vac-b-title')).some(t => /Boat tour$/.test(t)));
ok('and the field after it keeps the focus', await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' .vac-form [data-f="kind"]'));
await page.mouse.move(lane.x + 40, yAt(16 * 60 + 2));
await page.mouse.down();
await page.mouse.move(lane.x + 40, yAt(16 * 60 + 60), { steps: 4 });
await page.mouse.move(lane.x + 40, yAt(18 * 60), { steps: 4 });
ok('dragging on empty time shows the block to be', !!(await page.$(W + ' .vac-ghost')));
await page.mouse.up();
await page.waitForTimeout(150);
blocks = (await day(D1)).blocks;
const dragged = blocks.find(x => !x.meal && x.title === '');
ok('and adds one as long as the drag', dragged && dragged.start === 960 && dragged.end === 1080, JSON.stringify(dragged));
await setVal('.vac-form [data-f="title"]', 'Swim');
await setVal('.vac-form [data-f="kind"]', 'rest');
await setVal('.vac-form [data-f="start"]', '14:30');
blocks = (await day(D1)).blocks;
const swim = find(blocks, 'Swim');
ok('its kind and time change from the panel', swim.kind === 'rest' && swim.start === 870 && swim.end === 1080, JSON.stringify(swim));
ok('its colour is its kind', await page.evaluate((s) => document.querySelector(s).classList.contains('vac-k-rest'), blockSel('Swim')));
const widths = await page.evaluate((s) => ['Boat tour', 'Swim'].map(t => Array.from(document.querySelectorAll(s + ' .vac-grid .vac-block'))
    .find(e => e.querySelector('.vac-b-title').textContent.endsWith(t)).style.width), W);
ok('blocks that overlap sit side by side', widths.every(w => w.startsWith('calc(50%')), JSON.stringify(widths));
await setVal('.vac-form [data-f="end"]', '14:00');
const swim2 = find((await day(D1)).blocks, 'Swim');
ok('an end before the start moves the start, keeping the length', swim2.end === 840 && swim2.start === 840 - 210, JSON.stringify(swim2));
ok('and the panel says so', await page.inputValue(W + ' .vac-form [data-f="start"]') === '10:30');
await setVal('.vac-form [data-f="date"]', D2);
ok('moved to another day, it goes there, and so does the view', !find((await day(D1)).blocks, 'Swim') && !!find((await day(D2)).blocks, 'Swim') &&
    await text('.vac-day-head b') === 'Saturday, July 10');

// 5. Meals.
await tab('Fri, Jul 9');
await page.click(blockSel('Lunch'));
await page.waitForTimeout(80);
ok('a meal says it is one', /XM\s+one of the day’s meals/.test(await text('.vac-meal-note')));
await page.click(W + ' .vac-form .vac-danger');
await page.waitForTimeout(80);
ok('a meal can go', !find((await day(D1)).blocks, 'Lunch') && !!(await page.$(W + ' .vac-restore')));
await page.click(W + ' .vac-restore');
await page.waitForTimeout(80);
const lunch = find((await day(D1)).blocks, 'Lunch');
ok('and Restore meals puts it back, at its time', lunch && lunch.meal === 'xm' && lunch.start === 750 && !(await page.$(W + ' .vac-restore')));
ok('the header has no meal times of its own', !(await page.$(W + ' .vac-head .vac-btn:has-text("Meal")')));
await tab('Meals');
ok('the meal times are the trip’s, in a tab of their own', (await page.$$(W + ' .vac-main .vac-meal-row')).length === 3 &&
    /1 day is missing a meal/.test(await text('.vac-main')) === false);
await page.evaluate((s) => { document.querySelector(s).__kept = true; }, W + ' .vac-meal-row[data-k="am"]');
await setVal('.vac-meal-row input[data-k="am"][data-f="start"]', '07:30');
ok('changed, the tab is not drawn again, so the next field keeps the focus', await page.evaluate((s) => document.querySelector(s).__kept === true, W + ' .vac-meal-row[data-k="am"]'));
p = await plan();
ok('a meal’s new time keeps its length', JSON.stringify(p.meals[0]) === JSON.stringify({ key: 'am', label: 'Breakfast', start: 450, end: 540 }), JSON.stringify(p.meals[0]));
ok('and a meal still at the old time moves to it', find(p.days[D2].blocks, 'Breakfast').start === 450 && find(p.days[D4].blocks, 'Breakfast').start === 450);
ok('one that was moved stays where it was put', find(p.days[D1].blocks, 'Breakfast').start === 540);
await setVal('.vac-meal-row input[data-k="pm"][data-f="label"]', 'Supper');
p = await plan();
ok('renamed, so are the meals still called what it was', find(p.days[D2].blocks, 'Supper') && !find(p.days[D2].blocks, 'Dinner'));
await tab('Fri, Jul 9');

// 6. Places and Google Maps.
await page.click(blockSel('Boat tour'));
await page.waitForTimeout(80);
const LINK = 'https://www.google.com/maps/place/Harbor+Pier+Seven/@44.1234567,-71.7654321,17z/data=!3m1!4b1!4m6!3m5!1s0x0:0x0!8m2!3d44.1236!4d-71.7651';
await setVal('.vac-form [data-f="paddress"]', LINK);
let boat = find((await day(D1)).blocks, 'Boat tour');
ok('a Google Maps link gives the place its name and its pin', boat.place.label === 'Harbor Pier Seven' && boat.place.lat === 44.1236 &&
    boat.place.lng === -71.7651 && boat.place.url === LINK, JSON.stringify(boat.place));
ok('shown in the panel', await page.inputValue(W + ' .vac-form [data-f="plabel"]') === 'Harbor Pier Seven');
ok('Open in Maps opens the link itself, in a new tab', await page.getAttribute(W + ' .vac-form-links a', 'href') === LINK &&
    await page.getAttribute(W + ' .vac-form-links a', 'target') === '_blank');
ok('and the block shows where', (await all('.vac-grid .vac-b-place')).includes('📍 Harbor Pier Seven'));
await page.click(W + ' .vac-form-links button');
await page.waitForTimeout(80);
p = await plan();
ok('Save to places keeps it', p.places.length === 1 && p.places[0].label === 'Harbor Pier Seven' && !(await page.$(W + ' .vac-form-links button')));
await page.click(blockSel('Breakfast'));
await page.waitForTimeout(80);
await setVal('.vac-form [data-f="plabel"]', 'Corner Café');
await setVal('.vac-form [data-f="paddress"]', '12 Example Street, Lakeside');
const cafe = find((await day(D1)).blocks, 'Breakfast').place;
ok('an address typed is kept as typed', cafe.label === 'Corner Café' && cafe.address === '12 Example Street, Lakeside' && !cafe.url);
ok('and opens as a search in Google Maps', await page.getAttribute(W + ' .vac-form-links a', 'href') ===
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Corner Café, 12 Example Street, Lakeside'));
ok('the header no longer asks where you stay', !(await page.$(W + ' .vac-head .vac-stay-in')));
await tab('Stay');
ok('Stay opens on its stays, Home a sub-tab beside them', /Stays/.test(await text('.vac-subtab.vac-on')) &&
    JSON.stringify(await all('.vac-subtab')) === JSON.stringify(['🏨 Stays', '🏠 Home']) && !(await page.$(W + ' .vac-home-in')), JSON.stringify(await all('.vac-subtab')));
ok('the Stay tab asks', /Add where you’re staying/.test(await text('.vac-main')));
await page.click(W + ' .vac-btn:has-text("Add stay")');
await page.waitForTimeout(80);
p = await plan();
ok('+ Add stay: the whole trip, its name ready', p.stays.length === 1 && p.stays[0].inDate === D1 && p.stays[0].outDate === D4 &&
    await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' .vac-stay-card [data-f="label"]'));
await setVal('.vac-stay-card [data-f="address"]', 'https://maps.app.goo.gl/AbCdEf123');
p = await plan();
ok('a short Maps link for where you stay stays a link', p.stays[0].place.url === 'https://maps.app.goo.gl/AbCdEf123' && !p.stays[0].place.lat);
await setVal('.vac-stay-card [data-f="address"]', '1 Example Lane, Lakeside');
await setVal('.vac-stay-card [data-f="inTime"]', '15:00');
await setVal('.vac-stay-card [data-f="phone"]', '+1 555 0100');
await setVal('.vac-stay-card [data-f="conf"]', 'H-4410');
p = await plan();
ok('with its address, times, phone and booking', JSON.stringify(p.stays[0].place) === JSON.stringify({ label: '', address: '1 Example Lane, Lakeside' }) &&
    p.stays[0].inTime === 900 && p.stays[0].phone === '+1 555 0100' && p.stays[0].conf === 'H-4410', JSON.stringify(p.stays[0]));
ok('to open in Maps, and to call', /maps\/search\/\?api=1&query=1%20Example%20Lane/.test(await page.getAttribute(W + ' .vac-stay-links a', 'href')) &&
    await page.getAttribute(W + ' .vac-stay-links a:has-text("Call")', 'href') === 'tel:+15550100');
await tab('Fri, Jul 9');
ok('the day it starts shows checking in', (await all('.vac-event')).includes('🏨 Check in 3:00 PM · 1 Example Lane, Lakeside'), JSON.stringify(await all('.vac-event')));
let route = await page.getAttribute(W + ' a.vac-route', 'href');
const u = new URL(route);
ok('Route for the day goes from where you stay, through the day’s places in time order, and back',
    u.searchParams.get('origin') === '1 Example Lane, Lakeside' && u.searchParams.get('destination') === '1 Example Lane, Lakeside' &&
    u.searchParams.get('waypoints') === 'Corner Café, 12 Example Street, Lakeside|44.1236,-71.7651', route);
ok('in a new tab', await page.getAttribute(W + ' a.vac-route', 'target') === '_blank');

await tab('Places');
await page.waitForTimeout(80);
ok('Places lists the places kept; where you stay has its own tab', JSON.stringify(await all('.vac-pname')) ===
    JSON.stringify(['Harbor Pier Seven']), JSON.stringify(await all('.vac-pname')));
await page.fill(W + ' .vac-np-label', 'Old Mill Museum');
await page.fill(W + ' .vac-np-addr', '40 Mill Road, Lakeside');
await page.press(W + ' .vac-np-addr', 'Enter');
await page.waitForTimeout(80);
p = await plan();
ok('a place added there is kept', p.places.length === 2 && p.places[1].label === 'Old Mill Museum' && p.places[1].address === '40 Mill Road, Lakeside');
ok('Places has no Use: no block is chosen while it shows', !(await page.$(W + ' .vac-use')));
await tab('Fri, Jul 9');
await page.click(blockSel('Lunch'));
await page.waitForTimeout(80);
await setVal('.vac-form [data-f="plabel"]', 'Old Mill Museum');
ok('a saved place named in a block is that place', find((await day(D1)).blocks, 'Lunch').place.label === 'Old Mill Museum' &&
    await page.inputValue(W + ' .vac-form [data-f="paddress"]') === '40 Mill Road, Lakeside');
ok('and the names kept are offered when naming one', JSON.stringify(await page.evaluate((s) =>
    Array.from(document.querySelectorAll(s + ' datalist option')).map(o => o.value), W)) === JSON.stringify(['Harbor Pier Seven', 'Old Mill Museum']));

// 7. Lists.
await page.click(W + ' .vac-todo');
await page.waitForTimeout(80);
ok('To do on a day opens its own list, in Lists', /Lists/.test(await text('.vac-tab.vac-on')) && await text('.vac-chip.vac-on') === '📅 Fri, Jul 9' &&
    (await all('.vac-chip')).slice(3, 5).join() === '📅 Fri, Jul 9,📅 Sat, Jul 10', JSON.stringify(await all('.vac-chip')));
await page.fill(W + ' .vac-item-new', 'Pick up tickets at https://tickets.example.com/boat.');
await page.press(W + ' .vac-item-new', 'Enter');
await page.waitForTimeout(80);
ok('an item added there is the day’s', (await day(D1)).list[0].text === 'Pick up tickets at https://tickets.example.com/boat.' && (await day(D2)).list.length === 0);
ok('its web address a link', await page.getAttribute(W + ' .vac-itext a', 'href') === 'https://tickets.example.com/boat' &&
    await text('.vac-itext') === 'Pick up tickets at tickets.example.com/boat.');
ok('and the box is ready for the next', await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' .vac-item-new'));
await page.click(W + ' .vac-chip:has-text("Packing")');
await page.waitForTimeout(80);
ok('Packing comes with things to pack', (await all('.vac-itext')).length === 5 && (await all('.vac-itext'))[0] === 'Passports and IDs');
await page.check(W + ' .vac-item[data-i="1"] input[type="checkbox"]');
await page.waitForTimeout(80);
ok('ticked off, it is crossed out and counted', (await plan()).lists[0].items[1].done === true &&
    !!(await page.$(W + ' .vac-item[data-i="1"].vac-idone')) && /1\/5/.test(await text('.vac-chip.vac-on')));
const t0 = await box(W + ' .vac-item[data-i="0"] .vac-itext');
await page.mouse.click(t0.x + 5, t0.y + t0.height / 2);
await page.keyboard.press('End');
await page.keyboard.type(' (both)');
await page.keyboard.press('Enter');
await page.waitForTimeout(80);
ok('clicked, an item’s text changes', (await plan()).lists[0].items[0].text === 'Passports and IDs (both)');
await page.click(W + ' .vac-item[data-i="4"] .vac-icon');
await page.waitForTimeout(80);
ok('and an item goes', (await plan()).lists[0].items.length === 4);
answer = true;
await page.evaluate(() => { window.prompt = () => 'Snacks'; });
await page.click(W + ' .vac-chip[title="Add a list"]');
await page.waitForTimeout(80);
ok('a list of your own', (await plan()).lists.map(l => l.name).join() === 'Packing,To book,Before we leave,Snacks' &&
    /Snacks/.test(await text('.vac-chip.vac-on')));

// 8. The Trip view leads to a block.
await tab('Trip');
await page.click(W + ' .vac-tcol .vac-block[title*="Boat tour"]');
await page.waitForTimeout(100);
ok('a block clicked in the Trip view opens its day, chosen', await text('.vac-day-head b') === 'Friday, July 9' &&
    await page.inputValue(W + ' .vac-form [data-f="title"]') === 'Boat tour');

// 9. Shortening the trip.
answer = false; asked = [];
await setVal('.vac-end', '2027-07-09');
ok('leaving out days with plans asks first', asked.length === 1 && /Saturday, July 10/.test(asked[0]), JSON.stringify(asked));
ok('and kept, nothing changes', Object.keys((await plan()).days).length === 4 && await page.inputValue(W + ' .vac-end') === D4);
answer = true; asked = [];
await setVal('.vac-end', '2027-07-10');
ok('agreed, the days go', JSON.stringify(Object.keys((await plan()).days).sort()) === JSON.stringify([D1, D2]) &&
    (await all('.vac-tab')).length === 12);
asked = [];
await setVal('.vac-end', '2027-07-11');
await setVal('.vac-end', '2027-07-10');
ok('a day with only its meals goes without asking', asked.length === 0 && Object.keys((await plan()).days).length === 2);

// 10. Undo.
await tab('Fri, Jul 9');
const before = (await day(D1)).blocks.length;
await page.click(blockSel('Boat tour'));
await page.click(W + ' .vac-form .vac-danger');
await page.waitForTimeout(700);
ok('a block deleted', (await day(D1)).blocks.length === before - 1);
await page.evaluate(() => document.activeElement && document.activeElement.blur());
await page.keyboard.press('Control+z');
await page.waitForTimeout(600);
ok('comes back with undo', !!find((await day(D1)).blocks, 'Boat tour') &&
    (await page.$$(W.replace(' .vac-widget', '') + ' .vac-grid .vac-block')).length === before);

// 10b. The plan as a bullet list.
await page.click(blockSel('Boat tour'));
await page.waitForTimeout(80);
await setVal('.vac-form [data-f="notes"]', 'Bring the tickets\n\nSunscreen');
await page.check(W + ' .vac-form [data-f="done"]');
await page.waitForTimeout(80);
await page.click(W + ' .vac-head .vac-btn:has-text("Bullet list")');
await page.waitForTimeout(100);
let md = await page.inputValue(W + ' .vac-out-text');
const mdLines = md.split('\n');
ok('Bullet list shows the plan as Markdown', mdLines[0] === '# Lake week' &&
    mdLines[2] === 'Fri, Jul 9 – Sat, Jul 10', mdLines.slice(0, 3).join(' | '));
ok('where you stay has a section of its own, its booking left out', md.includes('\n## Stay\n- 🏨 [1 Example Lane, Lakeside](https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('1 Example Lane, Lakeside') + ') · Fri, Jul 9 3:00') && md.includes('📞 +1 555 0100') && !md.includes('H-4410'), md.slice(md.indexOf('## Stay'), md.indexOf('## Stay') + 300));
const fri = md.slice(md.indexOf('## Friday, July 9'), md.indexOf('## Saturday'));
const friBlocks = fri.split('\n').filter(l => /^- \S+ \d/.test(l));
ok('each day’s blocks in time order, its meals tagged', JSON.stringify(friBlocks.map(l => l.split(' · ')[1])) ===
    JSON.stringify(['Breakfast (AM)', 'Lunch (XM)', 'Boat tour', 'Supper (PM)']), JSON.stringify(friBlocks));
ok('with their times, each line starting with its icon, a meal’s its own', /^- ☕ 9:00\s?AM–10:30\s?AM · Breakfast \(AM\)/.test(friBlocks[0]) &&
    /^- 🍽️ /.test(friBlocks[3]), JSON.stringify(friBlocks));
ok('where, as a link to it in Google Maps', friBlocks[0].includes('· [Corner Café, 12 Example Street, Lakeside](https://www.google.com/maps/search/?api=1&query=') &&
    friBlocks[2].includes('[Harbor Pier Seven](' + LINK + ')'), friBlocks[2]);
ok('done marked ✓, and its notes under it, line by line', friBlocks[2].endsWith(' ✓') &&
    fri.includes(friBlocks[2] + '\n  - Bring the tickets\n  - Sunscreen\n'), fri);
ok('the day’s route and its own list', /\n- 🗺️ Route for the day: \[Google Maps\]\(https:\/\/www\.google\.com\/maps\/dir\/\?api=1&origin=/.test(fri) &&
    fri.includes('- ☑️ To do:\n  - [ ] Pick up tickets at https://tickets.example.com/boat.'), fri);
ok('a day of only meals is still there', /## Saturday, July 10\n- \S+ 7:30\s?AM/.test(md));
ok('then the lists, ticked where done, an empty one left out', md.includes('## Packing\n- [ ] Passports and IDs (both)\n- [x] Phone chargers\n') &&
    md.includes('## To book\n') && !md.includes('## Snacks'));
ok('it opens on the preview, the Markdown underneath', /Preview/.test(await text('.vac-out-view.vac-on')) &&
    await page.isVisible(W + ' .vac-out-preview') && !(await page.isVisible(W + ' .vac-out-text')));
const pv = await page.evaluate((s) => { const e = document.querySelector(s); return {
    h1: (e.querySelector('h1') || {}).textContent, h2: Array.from(e.querySelectorAll('h2')).map(h => h.textContent),
    links: Array.from(e.querySelectorAll('a')).map(a => [a.textContent, a.getAttribute('href'), a.target]), text: e.textContent,
    inputs: e.querySelectorAll('input').length }; }, W + ' .vac-out-preview');
ok('rendered: headings, bullets, links that open', pv.h1 === 'Lake week' && pv.h2.some(h => /^Friday, July 9/.test(h)) &&
    pv.links.some(([t, h, tg]) => t === '1 Example Lane, Lakeside' && h === 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('1 Example Lane, Lakeside') && tg === '_blank'),
    JSON.stringify(pv.links.slice(0, 3)));
ok('boxes as ☐ and ☑, which paste anywhere', pv.inputs === 0 && pv.text.includes('☐ Passports and IDs (both)') && pv.text.includes('☑ Phone chargers'));
const evil = await page.evaluate(() => vacMdHtml('- <img src=x onerror=alert(1)> & [x](javascript:alert(1))'));
ok('a name is text, never markup; only web links link', !/<img/.test(evil) && evil.includes('&lt;img') && !/href="javascript/.test(evil), evil);
await page.click(W + ' .vac-out-copy-rich');
await page.waitForTimeout(200);
const clip = await page.evaluate(async () => { const items = await navigator.clipboard.read(); const it = items[0];
    return { types: it.types, html: await (await it.getType('text/html')).text(), plain: await (await it.getType('text/plain')).text() }; });
ok('Copy formatted: HTML, for a chat that takes it', clip.types.includes('text/html') && /<h2[^>]*>Friday, July 9/.test(clip.html) && /<a [^>]*href="https:\/\/www\.google\.com\/maps/.test(clip.html) &&
    await text('.vac-out-copy-rich') === 'Copied');
const plainLines = clip.plain.split('\n');
ok('and plain text, for one that does not: no Markdown in it', plainLines[0] === 'Lake week' && /\nFriday, July 9\n/.test(clip.plain) &&
    clip.plain.includes('\n• ☐ Passports and IDs (both)\n') && clip.plain.includes('\n    ◦ Bring the tickets\n') &&
    !/\]\(|^#|^- /m.test(clip.plain), clip.plain.slice(0, 400));
ok('a link as its name and then its address', clip.plain.includes('1 Example Lane, Lakeside – https://www.google.com/maps/search/?api=1&query=') &&
    clip.plain.includes('🗺️ Route for the day: Google Maps – https://www.google.com/maps/dir/'));
await page.click(W + ' .vac-out-view[data-v="md"]');
await page.waitForTimeout(80);
ok('Markdown shows the Markdown itself', await page.isVisible(W + ' .vac-out-text') && !(await page.isVisible(W + ' .vac-out-preview')));
await page.uncheck(W + ' .vac-out-lists');
await page.waitForTimeout(80);
md = await page.inputValue(W + ' .vac-out-text');
ok('the lists can be left out', !md.includes('## Packing') && md.includes('## Friday, July 9') && md.includes('- ☑️ To do:'));
await page.selectOption(W + ' .vac-out-scope', 'day');
await page.waitForTimeout(80);
md = await page.inputValue(W + ' .vac-out-text');
ok('or one day alone', md.includes('## Friday, July 9') && !md.includes('## Saturday'));
await page.click(W + ' .vac-out-copy');
await page.waitForTimeout(150);
ok('the view stays as chosen as the options change', await page.isVisible(W + ' .vac-out-text'));
ok('Copy copies it', await page.evaluate(() => navigator.clipboard.readText()) === md && await text('.vac-out-copy') === 'Copied');
await setVal('.vac-form [data-f="title"]', 'Boat tour and picnic');
ok('it keeps up with the plan', (await page.inputValue(W + ' .vac-out-text')).includes('· Boat tour and picnic ·'));
await page.click(W + ' .vac-out-view[data-v="preview"]');
await page.waitForTimeout(80);
await setVal('.vac-form [data-f="title"]', 'Boat tour, picnic and swim');
ok('the preview keeps up too', (await text('.vac-out-preview')).includes('Boat tour, picnic and swim'));
await setVal('.vac-form [data-f="title"]', 'Boat tour and picnic');
await page.click(W + ' .vac-out-close');
await page.waitForTimeout(80);
ok('and closes', !(await page.$(W + ' .vac-out')));

// 10c. Flights.
const clickTime = async (min) => {
    await page.evaluate(([s, min]) => { const g = document.querySelector(s + ' .vac-grid'), m = document.querySelector(s + ' .vac-main');
        m.scrollTop = Math.max(0, (min / 60 - +g.dataset.h0) * +g.dataset.px - 200); }, [W, min]);
    const g = await box(W + ' .vac-grid'), l = await box(W + ' .vac-lane');
    const h0 = +(await page.getAttribute(W + ' .vac-grid', 'data-h0'));
    const gpx = +(await page.getAttribute(W + ' .vac-grid', 'data-px'));
    await page.mouse.click(l.x + l.width - 20, g.y + (min - h0 * 60) * gpx / 60 + 5);
    await page.waitForTimeout(120);
};
await tab('Fri, Jul 9');
await clickTime(21 * 60);
await setVal('.vac-form [data-f="kind"]', 'flight');
ok('a Flight asks for its number, airports, seat, gate, confirmation and landing', (await page.$$(W + ' .vac-form [data-f^="f_"]')).length === 11 &&
    !(await page.$(W + ' .vac-form [data-f="plabel"]')));
await setVal('.vac-form [data-f="f_number"]', 'XY 123');
await setVal('.vac-form [data-f="f_from"]', 'AAA');
await setVal('.vac-form [data-f="f_to"]', 'BBB');
await setVal('.vac-form [data-f="f_seat"]', '14C');
await setVal('.vac-form [data-f="f_conf"]', 'QWERTY');
await setVal('.vac-form [data-f="f_arrive"]', '07:05');
await setVal('.vac-form [data-f="f_arriveDay"]', '1');
const fl = (await day(D1)).blocks.find(x => x.kind === 'flight');
ok('kept with the block', fl && fl.flight.number === 'XY 123' && fl.flight.arrive === 425 && fl.flight.arriveDay === 1 && fl.flight.from === 'AAA' &&
    fl.flight.to === 'BBB' && fl.flight.seat === '14C' && fl.flight.conf === 'QWERTY', JSON.stringify(fl));
ok('landing the next day, it runs to midnight', fl.start === 1260 && fl.end === 1440);
ok('named by its number, with where and when it lands', /Flight XY 123$/.test(await text(blockSel('Flight XY 123') + ' .vac-b-title')) &&
    /9:00\s?PM–7:05\s?AM \+1/.test(await text(blockSel('Flight XY 123') + ' .vac-b-time')) && await text(blockSel('Flight XY 123') + ' .vac-b-place') === 'AAA → BBB');
const fLinks = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-form-links a')).map(a => a.getAttribute('href')), W);
ok('its status and its airports a click away', fLinks[0] === 'https://www.google.com/search?q=' + encodeURIComponent('XY 123 flight status') &&
    fLinks[1] === 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('AAA airport') && fLinks.length === 3, JSON.stringify(fLinks));
await tab('Sat, Jul 10');
ok('the next day shows it landing', (await all('.vac-event')).includes('✈️ Flight XY 123 arrives 7:05 AM at BBB'), JSON.stringify(await all('.vac-event')));
await tab('Fri, Jul 9');
await page.click(blockSel('Flight XY 123'));
await page.waitForTimeout(80);
await setVal('.vac-form [data-f="lead"]', '180');
ok('how early to be at the airport is the trip’s', (await plan()).airportLead === 180);
await page.click(W + ' .vac-form .vac-btn:has-text("Add the trip to the airport")');
await page.waitForTimeout(100);
let toAir = find((await day(D1)).blocks, 'To the airport');
ok('Add the trip to the airport: a drive that gets there three hours before', toAir && toAir.kind === 'drive' && toAir.end === 1080 && toAir.start === 1020 &&
    toAir.drive.to.label === 'AAA airport' && toAir.drive.from.address === '1 Example Lane, Lakeside', JSON.stringify(toAir));
ok('and it is the one open', await page.inputValue(W + ' .vac-form [data-f="title"]') === 'To the airport' &&
    await page.inputValue(W + ' .vac-form [data-f="d_to"]') === 'AAA airport');
ok('the airport is on the day’s route', new URL(await page.getAttribute(W + ' a.vac-route', 'href')).searchParams.get('waypoints').split('|').includes('AAA airport'));

// 10d. Long drives.
await tab('Sat, Jul 10');
await clickTime(15 * 60);
await setVal('.vac-form [data-f="kind"]', 'drive');
await setVal('.vac-form [data-f="end"]', '21:00');
await setVal('.vac-form [data-f="d_from"]', 'Harbor Pier Seven');
await setVal('.vac-form [data-f="d_to"]', '99 Coast Road, Seaside');
await page.click(W + ' .vac-form .vac-btn:has-text("Stop on the way")');
await page.waitForTimeout(80);
ok('+ Stop gives a stop to fill in', await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' .vac-form [data-f="d_stop"]'));
await setVal('.vac-form [data-f="d_stop"]', 'Old Mill Museum');
let drive = (await day(D2)).blocks.find(x => x.kind === 'drive');
ok('a saved place named is the place, pin and all', drive.drive.from.lat === 44.1236 && drive.drive.stops[0].address === '40 Mill Road, Lakeside' &&
    drive.drive.to.address === '99 Coast Road, Seaside', JSON.stringify(drive.drive));
ok('named by where it goes', /Drive to 99 Coast Road, Seaside$/.test(await text(blockSel('Drive to 99 Coast Road') + ' .vac-b-title')));
const dirs = new URL(await page.getAttribute(W + ' .vac-form-links a', 'href'));
ok('Directions go from the start, through the stops, to the end', dirs.pathname === '/maps/dir/' && dirs.searchParams.get('origin') === '44.1236,-71.7651' &&
    dirs.searchParams.get('waypoints') === 'Old Mill Museum, 40 Mill Road, Lakeside' && dirs.searchParams.get('destination') === '99 Coast Road, Seaside', dirs.href);
const breaks = () => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-break')).map(e => e.textContent.trim()), blockSel('Drive to 99 Coast Road'));
ok('a six-hour drive shows a break every two hours', JSON.stringify(await breaks()) === JSON.stringify(['☕ 5:00 PM', '☕ 7:00 PM']), JSON.stringify(await breaks()));
await setVal('.vac-form [data-f="breakEvery"]', '90');
ok('and every hour and a half, when that is the trip’s', (await plan()).breakEvery === 90 && (await breaks()).length === 3);
await page.click(W + ' .vac-stop .vac-icon');
await page.waitForTimeout(80);
ok('a stop can go', (await day(D2)).blocks.find(x => x.kind === 'drive').drive.stops.length === 0 && !(await page.$(W + ' .vac-stop')));
await setVal('.vac-form [data-f="d_stop"]'.replace('d_stop', 'notes'), 'Fill up before the pass');

// 10e. Parking, in the Travel tab.
await tab('Travel');
await page.waitForTimeout(80);
ok('Travel opens on Getting there, its sections as sub-tabs', /Getting there/.test(await text('.vac-subtab.vac-on')) &&
    JSON.stringify((await all('.vac-subtab')).map(t => t.replace(/\s*[\d✓]+$/, ''))) === JSON.stringify(['🛫 Getting there', '🛬 Getting back', '✈️ Flights', '🅿️ Parking', '🚙 Car rental']),
    JSON.stringify(await all('.vac-subtab')));
ok('one section at a time, and no list of drives', (await page.$$(W + ' .vac-journey')).length === 1 && !(await page.$(W + ' .vac-trow')) && !/Drives/.test(await text('.vac-main')));
ok('the flights counted on their sub-tab', /Flights\s*1$/.test((await all('.vac-subtab'))[2]));
await sub('flights');
ok('and each flight as a card to fill in', (await page.$$(W + ' .vac-tcard')).length === 1 &&
    await page.inputValue(W + ' .vac-tcard [data-f="f_number"]') === 'XY 123' && await page.inputValue(W + ' .vac-tcard [data-f="f_arrive"]') === '07:05' &&
    await page.inputValue(W + ' .vac-tcard [data-f="f_arriveDay"]') === '1' && await page.inputValue(W + ' .vac-tcard [data-f="date"]') === D1);
await sub('parking');
await page.click(W + ' .vac-park-add');
await page.waitForTimeout(80);
p = await plan();
ok('parking starts on the first day and ends on the last', p.parking.length === 1 && p.parking[0].fromDate === D1 && p.parking[0].toDate === D2);
await setVal('.vac-park [data-f="lot"]', 'Long-term Lot B, 5 Field Way');
await setVal('.vac-park [data-f="fromTime"]', '17:30');
await setVal('.vac-park [data-f="toTime"]', '20:00');
await setVal('.vac-park [data-f="conf"]', 'P-778');
await setVal('.vac-park [data-f="cost"]', '$40');
await setVal('.vac-park [data-f="spot"]', 'Level 2, row F');
p = await plan();
ok('with where, when, the booking and where it is parked', JSON.stringify(p.parking[0].lot) === JSON.stringify({ label: '', address: 'Long-term Lot B, 5 Field Way' }) &&
    p.parking[0].fromTime === 1050 && p.parking[0].toTime === 1200 && p.parking[0].conf === 'P-778' && p.parking[0].spot === 'Level 2, row F', JSON.stringify(p.parking[0]));
ok('the lot opens in Maps', /maps\/search\/\?api=1&query=Long-term/.test(await page.getAttribute(W + ' .vac-park-links a', 'href')));
await tab('Sat, Jul 10');
ok('the day it is picked up shows when, and where it was left', (await all('.vac-event')).includes('🅿️ Pick up 8:00 PM · Long-term Lot B, 5 Field Way · Level 2, row F'),
    JSON.stringify(await all('.vac-event')));
await tab('Travel');
ok('the parking form is as it was left', await page.inputValue(W + ' .vac-park [data-f="spot"]') === 'Level 2, row F');
ok('the sub-tab is remembered', /Parking/.test(await text('.vac-subtab.vac-on')));
await sub('flights');
await page.click(W + ' .vac-tcard .vac-btn:has-text("Open on its day")');
await page.waitForTimeout(100);
ok('a flight in Travel opens it', await text('.vac-day-head b') === 'Friday, July 9' && await page.inputValue(W + ' .vac-form [data-f="f_number"]') === 'XY 123');
ok('and its day shows the drop-off', (await all('.vac-event')).includes('🅿️ Drop off 5:30 PM · Long-term Lot B, 5 Field Way'));

// 10e2. Flights added and changed in Travel, without going to a day.
await tab('Travel');
await page.fill(W + ' .vac-tcard [data-f="f_seat"]', '15A');
await page.keyboard.press('Tab');
await page.waitForTimeout(80);
ok('a flight changed in Travel is the flight on its day', (await day(D1)).blocks.find(b => b.kind === 'flight').flight.seat === '15A');
ok('and the next field keeps the focus', await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' .vac-tcard [data-f="f_gate"]'));
await page.click(W + ' .vac-flight-add');
await page.waitForTimeout(80);
ok('+ Add flight: a card, its number ready', (await page.$$(W + ' .vac-tcard')).length === 2 &&
    await page.evaluate(() => !!document.activeElement && document.activeElement.dataset.f === 'f_number' && !document.activeElement.value));
await page.keyboard.type('QZ 9');
await page.keyboard.press('Tab');
await page.waitForTimeout(80);
const qz = async () => { const p0 = await plan(); for (const d of Object.keys(p0.days)) { const b = p0.days[d].blocks.find(x => x.flight && x.flight.number === 'QZ 9'); if (b) return { d, b }; } return null; };
let f9 = await qz();
ok('it is a flight on the first day, from 9 to 11', !!f9 && f9.d === D1 && f9.b.kind === 'flight' && f9.b.start === 540 && f9.b.end === 660, JSON.stringify(f9));
const card9 = '.vac-tcard[data-id="' + f9.b.id + '"]';
await setVal(card9 + ' [data-f="f_from"]', 'BBB');
await setVal(card9 + ' [data-f="f_to"]', 'CCC');
await setVal(card9 + ' [data-f="start"]', '06:15');
await setVal(card9 + ' [data-f="f_arrive"]', '08:40');
f9 = await qz();
ok('its airports and times are kept', f9.b.flight.from === 'BBB' && f9.b.flight.to === 'CCC' && f9.b.start === 375 && f9.b.end === 520, JSON.stringify(f9.b));
await setVal(card9 + ' [data-f="date"]', D2);
f9 = await qz();
ok('another day moves it there, and Travel stays open', f9.d === D2 && /Travel/.test(await text('.vac-tab.vac-on')));
await tab('Sat, Jul 10');
ok('and it is on that day’s schedule', !!(await page.$(blockSel('Flight QZ 9'))));
await tab('Travel');
await page.click(W + ' ' + card9 + ' .vac-danger');
await page.waitForTimeout(80);
ok('Remove takes it away', !(await qz()) && (await page.$$(W + ' .vac-tcard')).length === 1);

// 10f. Clothes: a tab of their own, a table of outfits by day, person and kind.
const crow = (date, preset, who) => '.vac-crow[data-row="o|' + date + '|' + (who || '') + '|' + preset + '"]';
const cellText = (row, t) => page.inputValue(W + ' ' + row + ' .vac-ctext[data-c="' + t + '"]');
const rowCount = () => page.evaluate((s) => document.querySelectorAll(s + ' .vac-crow').length, W);
const outfits = async (d) => (await day(d)).outfits;
await tab('👕 Clothes');
ok('a Clothes tab: a row for each day’s Day and Evening outfit', await rowCount() === 4 &&
    JSON.stringify(await all('.vac-ctable th')) === JSON.stringify(['Day', 'Outfit', 'Person', 'Top', 'Bottom', 'Shoes', 'Layer', 'Extras', '']), JSON.stringify(await all('.vac-ctable th')));
ok('each filled from its preset', await cellText(crow(D1, 'day'), 'top') === 'T-shirt' && await cellText(crow(D1, 'day'), 'bottom') === 'Shorts' &&
    await cellText(crow(D1, 'day'), 'layer') === '' && await cellText(crow(D1, 'evening'), 'layer') === 'Light jacket');
ok('and how much is packed, each day and in all', await text('.vac-ccount[data-date="' + D1 + '"]') === '0/7 packed' && await text('.vac-csum') === '0/14 packed');
await page.check(W + ' ' + crow(D1, 'day') + ' input[type="checkbox"][data-c="top"]');
await page.waitForTimeout(80);
ok('a tick is packed, and counted', (await outfits(D1)).find(r => r.preset === 'day').items.top.packed === true &&
    await text('.vac-ccount[data-date="' + D1 + '"]') === '1/7 packed' && await text('.vac-csum') === '1/14 packed' &&
    await page.evaluate((s) => document.querySelector(s).classList.contains('vac-packed'), W + ' ' + crow(D1, 'day') + ' .vac-cell:has([data-c="top"])'));
ok('an empty cell has nothing to tick', await page.isDisabled(W + ' ' + crow(D1, 'day') + ' input[type="checkbox"][data-c="layer"]'));
await page.click(W + ' ' + crow(D1, 'day') + ' .vac-ctext[data-c="extras"]');
await page.keyboard.type('Hat');
await page.keyboard.press('Tab');
await page.waitForTimeout(80);
ok('typed in, it is kept and counted', (await outfits(D1)).find(r => r.preset === 'day').items.extras.text === 'Hat' &&
    await text('.vac-ccount[data-date="' + D1 + '"]') === '1/8 packed' && !(await page.isDisabled(W + ' ' + crow(D1, 'day') + ' input[type="checkbox"][data-c="extras"]')));
ok('and the next cell keeps the focus', await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' ' + crow(D1, 'day') + ' .vac-cacts .vac-icon'));
await page.selectOption(W + ' .vac-cday-pick', D1);
await page.waitForTimeout(80);
ok('the table can show one day', await rowCount() === 2);
await page.selectOption(W + ' .vac-cday-pick', '');
await page.waitForTimeout(80);
ok('or every day', await rowCount() === 4);

// Presets and types.
await setVal(crow(D2, 'day') + ' .vac-ctext[data-c="bottom"]', 'Skirt');
await page.click(W + ' .vac-cbar .vac-btn:has-text("Presets")');
await page.waitForTimeout(80);
ok('the presets: Day and Evening, every day', JSON.stringify(await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-ptable tbody tr')).map(tr =>
    [tr.querySelector('[data-k="name"]').value, tr.querySelector('[data-k="auto"]').checked]), W)) === JSON.stringify([['Day', true], ['Evening', true]]));
await setVal('.vac-ptable tr[data-p="day"] [data-t="bottom"]', 'Jeans');
ok('a preset changed reaches the outfits still showing the old item', await cellText(crow(D1, 'day'), 'bottom') === 'Jeans' &&
    (await plan()).outfitPresets[0].items.bottom === 'Jeans');
ok('and leaves the ones changed by hand', await cellText(crow(D2, 'day'), 'bottom') === 'Skirt');
await setVal('.vac-tname input[data-t="layer"]', 'Jacket');
ok('a column renamed', (await all('.vac-ctable th'))[6] === 'Jacket');
await page.click(W + ' .vac-presets .vac-btn:has-text("+ Preset")');
await page.waitForTimeout(80);
const swimId = (await plan()).outfitPresets[2].id;
await setVal('.vac-ptable tr[data-p="' + swimId + '"] [data-k="name"]', 'Swim');
await setVal('.vac-ptable tr[data-p="' + swimId + '"] [data-t="top"]', 'Swimsuit');
await setVal('.vac-ptable tr[data-p="' + swimId + '"] [data-t="shoes"]', 'Flip-flops');
ok('a preset of your own, not every day', (await plan()).outfitPresets[2].name === 'Swim' && await rowCount() === 4);
await page.click(W + ' .vac-cadd[data-date="' + D1 + '"]');
await page.waitForTimeout(80);
let extra = (await outfits(D1)).find(r => !r.id.startsWith('o|'));
ok('+ Outfit adds one from it', extra && extra.preset === swimId && extra.items.top.text === 'Swimsuit' && extra.items.shoes.text === 'Flip-flops' && await rowCount() === 5);
const extraRow = '.vac-crow[data-row="' + extra.id + '"]';
await setVal(extraRow + ' select[data-k="preset"]', 'evening');
extra = (await outfits(D1)).find(r => r.id === extra.id);
ok('given another preset, it takes that one’s clothes', extra.preset === 'evening' && extra.items.top.text === 'Shirt' && extra.items.shoes.text === 'Loafers' &&
    extra.items.layer.text === 'Light jacket', JSON.stringify(extra.items));
await page.click(W + ' ' + extraRow + ' .vac-icon[title^="Remove"]');
await page.waitForTimeout(80);
ok('and can go', (await outfits(D1)).length === 2);
await setVal(crow(D2, 'day') + ' .vac-ctext[data-c="top"]', '');
await page.click(W + ' ' + crow(D2, 'day') + ' .vac-icon[title^="Fill"]');
await page.waitForTimeout(80);
ok('↻ fills the empty cells from the preset, and only those', await cellText(crow(D2, 'day'), 'top') === 'T-shirt' && await cellText(crow(D2, 'day'), 'bottom') === 'Skirt');
await page.check(W + ' .vac-ptable tr[data-p="' + swimId + '"] [data-k="auto"]');
await page.waitForTimeout(80);
ok('a preset made every day gives every day one', await rowCount() === 6 && (await outfits(D2)).some(r => r.preset === swimId),
    JSON.stringify([await rowCount(), (await plan()).outfitPresets.map(x => [x.name, x.auto]), (await outfits(D2)).map(r => r.id)]));
await page.uncheck(W + ' .vac-ptable tr[data-p="' + swimId + '"] [data-k="auto"]');
await page.waitForTimeout(80);
ok('and taken off, the ones it made go again', await rowCount() === 4);
await page.click(W + ' .vac-cbar .vac-btn:has-text("Presets")');
await page.click(W + ' .vac-cbar .vac-btn:has-text("Add to packing")');
await page.waitForTimeout(100);
let pack = (await plan()).lists[0].items.map(x => x.text);
ok('Add to packing counts the table', pack.includes('T-shirt × 2') && pack.includes('Jeans') && pack.includes('Skirt') && pack.includes('Light jacket × 2') &&
    pack.includes('Hat') && pack.filter(t => /^sneakers/i.test(t)).length === 1, JSON.stringify(pack));
await tab('Fri, Jul 9');
await tab('Lists');
ok('and Lists no longer has a clothes list', !(await all('.vac-chip')).some(t => /Clothes/.test(t)));

// 10g. In the bullet list.
await page.click(W + ' .vac-head .vac-btn:has-text("Bullet list")');
await page.waitForTimeout(100);
md = await page.inputValue(W + ' .vac-out-text');
ok('a flight: when it lands, its airports, seat and status', /\n- ✈️ 9:00\s?PM–7:05\s?AM \+1 · Flight XY 123 · AAA → BBB · Seat 15A · \[Flight status\]\(https:\/\/www\.google\.com\/search\?q=XY%20123%20flight%20status\)\n/.test(md), md.slice(0, 1600));
ok('its confirmation left out', !md.includes('QWERTY') && !md.includes('P-778'));
ok('the next day, its landing', md.includes('## Saturday, July 10\n- ✈️ Flight XY 123 arrives 7:05 AM at BBB\n'));
ok('a drive, with its directions', /- 🚗 3:00\s?PM–9:00\s?PM · Drive to 99 Coast Road, Seaside · \[Harbor Pier Seven → 99 Coast Road, Seaside\]\(https:\/\/www\.google\.com\/maps\/dir\/\?api=1&origin=44\.1236/.test(md));
ok('what to wear each day', md.includes('- 👕 Wear: Day: T-shirt, Jeans, Sneakers, Hat · Evening: Shirt, Trousers, Loafers, Light jacket\n'), md);
ok('and the parking', /\n## Parking\n- 🅿️ \[Long-term Lot B, 5 Field Way\]\([^)]+\) · Drop off Fri, Jul 9 5:30\s?PM · Pick up Sat, Jul 10 8:00\s?PM · Parked at Level 2, row F\n/.test(md) && !md.includes('$40'), md.slice(md.indexOf('## Parking'), md.indexOf('## Parking') + 300));
await page.check(W + ' .vac-out-conf');
await page.waitForTimeout(80);
md = await page.inputValue(W + ' .vac-out-text');
ok('confirmation numbers when asked for', md.includes(' · Confirmation QWERTY · ') && md.includes(' · Reservation P-778'));
await page.click(W + ' .vac-out-close');
await page.waitForTimeout(80);

// 10h. People, each with their own outfits.
ok('the header no longer has People', !(await page.$(W + ' .vac-head .vac-btn:has-text("People")')));
await tab('People');
await page.click(W + ' .vac-btn:has-text("Add person")');
await page.waitForTimeout(80);
ok('+ Add person, ready to name', await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' .vac-person-row [data-f="name"]'));
await page.keyboard.type('Alex');
await page.keyboard.press('Tab');
await page.waitForTimeout(80);
await page.click(W + ' .vac-btn:has-text("Add person")');
await page.waitForTimeout(80);
await page.keyboard.type('Sam');
await page.keyboard.press('Tab');
await page.waitForTimeout(80);
p = await plan();
ok('people are kept, each a colour of their own', p.people.map(x => x.name).join() === 'Alex,Sam' && p.people[0].color !== p.people[1].color, JSON.stringify(p.people));
ok('a row each in the People tab', (await page.$$(W + ' .vac-main .vac-person-row')).length === 2);
const [alex, sam] = p.people;
const d1 = p.days[D1].outfits.map(r => (r.who === alex.id ? 'alex' : r.who === sam.id ? 'sam' : 'all') + ':' + r.preset).sort();
ok('each gets a Day and an Evening outfit; everyone’s that were never changed give way', JSON.stringify(d1) ===
    JSON.stringify(['alex:day', 'alex:evening', 'all:day', 'sam:day', 'sam:evening']), JSON.stringify(d1));
ok('the day itself shows no clothes', !(await page.$(W + ' .vac-wear, ' + W + ' .vac-wear-line')) && !/Jeans|Sneakers/.test(await text('.vac-day-head')));
await tab('👕 Clothes');
ok('the table can show one person', JSON.stringify(await all('.vac-cbar .vac-who')) === JSON.stringify(['All', 'Alex', 'Sam']));
await page.click(W + ' .vac-cbar .vac-who:text-is("Sam")');
await page.waitForTimeout(80);
ok('Sam alone: their two outfits each day', await rowCount() === 4 &&
    await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-crow select[data-k="who"]')).every(x => x.selectedOptions[0].text === 'Sam'), W));
await setVal(crow(D1, 'evening', sam.id) + ' .vac-ctext[data-c="top"]', 'Sundress');
await page.click(W + ' .vac-cbar .vac-who:text-is("All")');
await page.waitForTimeout(80);
await setVal(crow(D2, 'day', alex.id) + ' .vac-ctext[data-c="extras"]', 'Cap');
ok('each person’s cells are theirs', (await outfits(D1)).find(r => r.who === sam.id && r.preset === 'evening').items.top.text === 'Sundress' &&
    (await outfits(D2)).find(r => r.who === alex.id && r.preset === 'day').items.extras.text === 'Cap');
await tab('Trip');
ok('the Trip view shows no clothes either', !(await page.$(W + ' .vac-twear')) &&
    await page.evaluate((s) => new Set(Array.from(document.querySelectorAll(s + ' .vac-tgrid')).map(g => g.getBoundingClientRect().top)).size === 1, W));
await tab('👕 Clothes');
await page.click(W + ' .vac-cbar .vac-btn:has-text("Add to packing")');
await page.waitForTimeout(100);
pack = (await plan()).lists[0].items.map(x => x.text);
ok('Add to packing counts each person’s apart', pack.includes('Cap (Alex)') && pack.includes('Sundress (Sam)') && pack.includes('T-shirt × 2 (Alex)') &&
    pack.includes('Hat'), JSON.stringify(pack));
await page.click(W + ' .vac-head .vac-btn:has-text("Bullet list")');
await page.waitForTimeout(100);
md = await page.inputValue(W + ' .vac-out-text');
ok('the bullet list says what each wears', md.includes('\n- 👕 Wear:\n  - Everyone — Day: T-shirt, Jeans, Sneakers, Hat\n  - Alex — Day: T-shirt, Jeans, Sneakers · Evening: Shirt, Trousers, Loafers, Light jacket\n'), md);
await page.click(W + ' .vac-out-close');
await page.waitForTimeout(80);
await tab('People');
await setVal('.vac-person-row[data-id="' + alex.id + '"] [data-f="name"]', 'Alexa');
await page.evaluate((s) => { const c = document.querySelector(s); c.value = '#123456'; c.dispatchEvent(new Event('change', { bubbles: true })); },
    W + ' .vac-person-row[data-id="' + alex.id + '"] [data-f="color"]');
await page.waitForTimeout(80);
ok('renamed and recoloured', (await plan()).people[0].name === 'Alexa' && (await plan()).people[0].color === '#123456');
await tab('👕 Clothes');
ok('and the table shows it', (await all('.vac-cbar .vac-who'))[1] === 'Alexa' &&
    await page.evaluate((s) => document.querySelectorAll(s + ' .vac-cbar .vac-who .vac-dot')[0].style.background, W) === 'rgb(18, 52, 86)');
answer = true; asked = [];
await tab('People');
await page.click(W + ' .vac-person-row[data-id="' + sam.id + '"] .vac-icon');
await tab('👕 Clothes');
await page.waitForTimeout(80);
ok('removing someone with clothes of their own asks first, then their outfits go', asked.length === 1 && /Remove Sam, and the clothes planned for them/.test(asked[0]) &&
    (await plan()).people.length === 1 && !(await outfits(D1)).some(r => r.who === sam.id) && !(await all('.vac-cbar .vac-who')).includes('Sam'), JSON.stringify(asked));

// 10i. Clothes kept as lists, before the table, move into it.
const moved = await page.evaluate(() => {
    const key = boardKey('toolCustomizations'), before = localStorage.getItem(key);
    const all = loadToolCustomizations(), id = 'vac-migrate-test';
    all[id] = { vacPlan: { start: '2027-08-02', end: '2027-08-04', stay: { label: 'Old Inn', address: '3 Example Row' }, people: [{ id: 'u1', name: 'Kit', color: '#27ae60' }],
        days: { '2027-08-02': { blocks: [], list: [], clothes: [{ text: 'Shorts', who: 'u1' }, { text: 'Hat', who: 'u1' }, { text: 'Sunscreen' }] } } } };
    localStorage.setItem(key, JSON.stringify(all));
    const plan = vacGetData(id), out = plan.days['2027-08-02'].outfits.map(r => [r.who, r.preset, JSON.stringify(r.items)]);
    localStorage.setItem(key, before);
    return { out, old: 'clothes' in plan.days['2027-08-02'], stays: plan.stays, stay: 'stay' in plan };
});
ok('clothes kept as lists before move into each person’s Day outfit, under Extras', !moved.old &&
    JSON.stringify(moved.out.filter(r => r[1] === 'day')) === JSON.stringify([
        ['u1', 'day', JSON.stringify({ extras: { text: 'Shorts, Hat', packed: false } })],
        ['', 'day', JSON.stringify({ extras: { text: 'Sunscreen', packed: false } })]]), JSON.stringify(moved));

// 10j. Labels for the days.
await tab('Fri, Jul 9');
await setVal('.vac-day-label', 'Arrival');
ok('a day can be labelled', (await day(D1)).label === 'Arrival');
ok('its tab says so', (await all('.vac-tab'))[10] === 'Fri, Jul 9 · Arrival' &&
    await page.getAttribute(W + ' .vac-tab[data-view="' + D1 + '"]', 'title') === 'Friday, July 9 · Arrival');
const LONGLABEL = 'Up the coast and back by the old road';
await tab('Sat, Jul 10');
await setVal('.vac-day-label', LONGLABEL);
const t2 = (await all('.vac-tab'))[11];
ok('a long label is cut short on the tab, whole on hover', t2 === 'Sat, Jul 10 · Up the coast an…' &&
    await page.getAttribute(W + ' .vac-tab[data-view="' + D2 + '"]', 'title') === 'Saturday, July 10 · ' + LONGLABEL, t2);
await page.click(blockSel('Drive to 99 Coast Road'));
await page.waitForTimeout(80);
ok('the block’s Day picker shows them', JSON.stringify(await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-form [data-f="date"] option')).map(o => o.textContent), W)) ===
    JSON.stringify(['Fri, Jul 9 · Arrival', 'Sat, Jul 10 · ' + LONGLABEL]));
await tab('Trip');
ok('the Trip view shows them under each date', JSON.stringify(await all('.vac-tcol .vac-tlabel')) === JSON.stringify(['Arrival', LONGLABEL]) &&
    await page.evaluate((s) => new Set(Array.from(document.querySelectorAll(s + ' .vac-tgrid')).map(g => g.getBoundingClientRect().top)).size === 1, W));
await tab('👕 Clothes');
ok('and the Clothes table', JSON.stringify(await all('.vac-cdlabel')) === JSON.stringify(['Arrival', LONGLABEL]) &&
    (await all('.vac-cday-pick option'))[1] === 'Fri, Jul 9 · Arrival');
await page.click(W + ' .vac-head .vac-btn:has-text("Bullet list")');
await page.waitForTimeout(100);
md = await page.inputValue(W + ' .vac-out-text');
ok('and the bullet list', md.includes('\n## Friday, July 9 · Arrival\n') && md.includes('\n## Saturday, July 10 · ' + LONGLABEL + '\n'));
await page.click(W + ' .vac-out-close');
await tab('Sat, Jul 10');
await setVal('.vac-day-label', '');
ok('emptied, the label goes', !('label' in (await day(D2))) && (await all('.vac-tab'))[11] === 'Sat, Jul 10');

// 10k. Editing places.
await tab('Places');
await page.waitForTimeout(80);
await page.click(W + ' .vac-pedit-btn[data-i="1"]');
await page.waitForTimeout(80);
ok('✎ opens a place to change, its name ready', await page.inputValue(W + ' .vac-pedit .vac-pe-label') === 'Old Mill Museum' &&
    await page.inputValue(W + ' .vac-pedit .vac-pe-addr') === '40 Mill Road, Lakeside' &&
    await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' .vac-pedit .vac-pe-label'));
await page.keyboard.press('Escape');
await page.waitForTimeout(80);
ok('Escape leaves it as it was', !(await page.$(W + ' .vac-pedit')) && (await plan()).places[1].label === 'Old Mill Museum');
await page.click(W + ' .vac-pname[data-i="1"]');
await page.waitForTimeout(80);
await page.fill(W + ' .vac-pedit .vac-pe-label', 'Old Mill and Museum');
await page.fill(W + ' .vac-pedit .vac-pe-addr', '41 Mill Road, Lakeside');
answer = true; asked = [];
await page.press(W + ' .vac-pedit .vac-pe-addr', 'Enter');
await page.waitForTimeout(80);
p = await plan();
ok('changed, it asks whether to change it where it is used', asked.length === 1 && asked[0] === 'Change Old Mill Museum where it is used too: 1 block?', JSON.stringify(asked));
ok('and does, agreed', p.places[1].label === 'Old Mill and Museum' && p.places[1].address === '41 Mill Road, Lakeside' && p.places[1].id &&
    find(p.days[D1].blocks, 'Lunch').place.address === '41 Mill Road, Lakeside', JSON.stringify(find(p.days[D1].blocks, 'Lunch').place));
await page.click(W + ' .vac-pedit-btn[data-i="0"]');
await page.waitForTimeout(80);
await page.fill(W + ' .vac-pedit .vac-pe-label', 'Pier Seven');
answer = false; asked = [];
await page.click(W + ' .vac-pedit .vac-btn:has-text("Save")');
await page.waitForTimeout(80);
p = await plan();
ok('a link keeps its pin when the name changes', p.places[0].label === 'Pier Seven' && p.places[0].url === LINK && p.places[0].lat === 44.1236);
ok('and where it is used is left alone when not wanted', /1 block, 1 drive\?$/.test(asked[0] || '') &&
    find(p.days[D1].blocks, 'Boat tour and picnic').place.label === 'Harbor Pier Seven' &&
    p.days[D2].blocks.find(b => b.kind === 'drive' && b.drive.to && /Coast/.test(b.drive.to.address)).drive.from.label === 'Harbor Pier Seven', JSON.stringify(asked));
await tab('Stay');
answer = true; asked = [];
await setVal('.vac-stay-card [data-f="label"]', 'Lake House');
p = await plan();
ok('a stay can be named', p.stays[0].place.label === 'Lake House' && p.stays[0].place.address === '1 Example Lane, Lakeside');
ok('and the drive that starts there follows', /1 drive\?$/.test(asked[0] || '') && find(p.days[D1].blocks, 'To the airport').drive.from.label === 'Lake House', JSON.stringify(asked));

ok('the one place to stay of before is the first stay, the whole trip long', !moved.stay && moved.stays.length === 1 &&
    moved.stays[0].place.label === 'Old Inn' && moved.stays[0].inDate === '2027-08-02' && moved.stays[0].outDate === '2027-08-04', JSON.stringify(moved.stays));

// 10l. Stays across the Trip view, as days, not hours.
await tab('Trip');
const segs = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-tstay')).map(e => ({ cls: e.className, text: e.textContent, tip: e.title })), W);
ok('a stay runs across its days in the Trip view, from midday on the first', segs.length === 2 && /vac-tstay-in/.test(segs[0].cls) && segs[0].text === '🏨 Lake House' &&
    !/vac-tstay-out/.test(segs[1].cls) && /^Lake House · Fri, Jul 9 3:00\s?PM – Mon, Jul 12$/.test(segs[0].tip), JSON.stringify(segs));
ok('above the hours, which still line up', !(await page.$(W + ' .vac-tgrid .vac-tstay')) &&
    await page.evaluate((s) => new Set(Array.from(document.querySelectorAll(s + ' .vac-tgrid')).map(g => g.getBoundingClientRect().top)).size === 1, W));
await page.click(W + ' .vac-tstay-in');
await page.waitForTimeout(80);
ok('and opens the Stay tab', /Stay/.test(await text('.vac-tab.vac-on')));
await page.click(W + ' .vac-btn:has-text("Add stay")');
await page.waitForTimeout(80);
await setVal('.vac-stay-card[data-i="1"] [data-f="label"]', 'City Hotel');
await setVal('.vac-stay-card[data-i="0"] [data-f="outDate"]', D2);
await setVal('.vac-stay-card[data-i="1"] [data-f="inDate"]', D2);
await tab('Trip');
const segs2 = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-tstay')).map(e => [e.className.replace('vac-tstay ', ''), e.textContent, e.style.top]), W);
ok('a changeover day shows one ending and the next starting, in the same row', segs2.length === 3 && segs2.every(x => x[2] === '2px') &&
    segs2[1][0] === 'vac-tstay-out' && segs2[2][0] === 'vac-tstay-in' && segs2[2][1] === '🏨 City Hotel', JSON.stringify(segs2));
await tab('Sat, Jul 10');
const r2 = new URL(await page.getAttribute(W + ' a.vac-route', 'href'));
ok('and that day’s route starts at the one and ends at the other', r2.searchParams.get('origin') === 'Lake House, 1 Example Lane, Lakeside' &&
    r2.searchParams.get('destination') === 'City Hotel', r2.href);
ok('its header shows checking out and in', (await all('.vac-event')).some(t => /^🏨 Check out · Lake House/.test(t)) && (await all('.vac-event')).some(t => /^🏨 Check in · City Hotel/.test(t)),
    JSON.stringify(await all('.vac-event')));

// 10m. In the Trip view, a pin on a block with a place.
await tab('Trip');
const pins = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-tcol .vac-block')).filter(b => b.querySelector('.vac-tpin'))
    .map(b => b.querySelector('.vac-b-title').textContent.replace(/^\S+\s/, '') + ' @ ' + b.querySelector('.vac-tpin').title), W);
const withPlace = (await plan()).days[D1].blocks.filter(b => b.place || (b.drive && b.drive.to)).length +
    (await plan()).days[D2].blocks.filter(b => b.place || (b.drive && b.drive.to)).length;
ok('a block with a place has a pin in the Trip view, and only those', pins.length === withPlace && pins.includes('Breakfast @ Corner Café') &&
    pins.some(x => /^Lunch @ Old Mill and Museum$/.test(x)) && !pins.some(x => /Supper|Dinner/.test(x)), JSON.stringify(pins));

// 10n. The whole trip as Google Maps directions, from the Trip view.
await tab('Trip');
const trip = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-trip-bar a')).map(a => [a.textContent, a.getAttribute('href')]), W);
const tripStops = await page.evaluate((i) => { const p = vacGetData(i); return vacDates(p).flatMap(d => vacRouteStops(p, d)); }, id);
ok('Route for the trip opens the whole trip in Google Maps', trip.length >= 1 && trip.every(([, h]) => /^https:\/\/www\.google\.com\/maps\/dir\/\?api=1&origin=/.test(h)) &&
    new URL(trip[0][1]).searchParams.get('origin') === tripStops[0], JSON.stringify(trip));
ok('there is no map tab', !(await all('.vac-tab')).some(t => /Map/.test(t)));

// 10o. Getting there and back: home, the drive, parking, the shuttle, the flight, the stay.
await tab('Stay');
ok('the stays counted on their sub-tab, each its own card', /Stays\s*2$/.test((await all('.vac-subtab'))[0]) && (await page.$$(W + ' .vac-subpane > .vac-stay-card')).length === 2 &&
    await page.evaluate((s) => getComputedStyle(document.querySelector(s)).borderTopStyle === 'solid', W + ' .vac-stay-card'));
await sub('home');
ok('Home on its own sub-tab, no stays with it', !(await page.$(W + ' .vac-stay-card')) && !/✓/.test(await text('.vac-subtab.vac-on')));
await setVal('.vac-home-in', '5 Home Street, Hometown');
ok('Home is set in the Stay tab', JSON.stringify((await plan()).home) === JSON.stringify({ label: '', address: '5 Home Street, Hometown' }));
ok('and its sub-tab gets a ✓, the field kept', /Home\s*✓$/.test(await text('.vac-subtab.vac-on')) && !!(await page.$(W + ' .vac-home-link a')));
await tab('Trip');
await tab('Stay');
ok('the Stay sub-tab is remembered', /Home/.test(await text('.vac-subtab.vac-on')));
await tab('Trip');
await page.click(W + ' .vac-tstay-in');
await page.waitForTimeout(80);
ok('a stay’s bar in the Trip view opens the stays', /Stays/.test(await text('.vac-subtab.vac-on')) && !!(await page.$(W + ' .vac-stay-card')));
await tab('Travel');
await sub('out');
const J = (which) => W + ' .vac-journey[data-j="' + which + '"]';
const jTitles = (which) => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-jtext b')).map(b => b.textContent), J(which));
const jWhen = (which, leg) => page.evaluate((s) => (document.querySelector(s) || {}).textContent || '', J(which) + ' .vac-j-' + leg + ' .vac-jwhen');
const leg = async (key) => { const p0 = await plan(); for (const d of Object.keys(p0.days)) { const b = p0.days[d].blocks.find(x => x.leg === key); if (b) return { d, b }; } return null; };
ok('getting there, worked back from the flight', JSON.stringify(await jTitles('out')) === JSON.stringify([
    '5 Home Street, Hometown', 'Online check-in opens', 'Drive to Long-term Lot B, 5 Field Way', 'Drop off · Long-term Lot B, 5 Field Way', 'Shuttle to AAA',
    'At the airport, 3 h before', 'Flight XY 123 · AAA → BBB', 'Bags and out · BBB', 'Taxi to City Hotel', 'Check in · City Hotel']), JSON.stringify(await jTitles('out')));
ok('the shuttle gets there three hours before take-off', /Fri, Jul 9 · 5:40\s?PM–6:00\s?PM/.test(await jWhen('out', 'shuttle')), await jWhen('out', 'shuttle'));
ok('a drive with no length yet says so', /needs a length/.test(await text('.vac-journey[data-j="out"] .vac-j-drive')) &&
    /maps\/dir\/\?api=1&origin=5%20Home%20Street/.test(await page.getAttribute(J('out') + ' .vac-j-drive a', 'href')));
await setVal('.vac-journey[data-j="out"] .vac-j-drive [data-k="driveMin"]', '45');
ok('nothing goes on the schedule until asked', !(await leg('out:drive')));
await page.click(J('out') + ' .vac-btn:has-text("Put it on the schedule")');
await page.waitForTimeout(100);
let dr = await leg('out:drive'), sh = await leg('out:shuttle');
ok('then the drive and the shuttle are blocks on the day', dr && dr.d === D1 && dr.b.kind === 'drive' && dr.b.start === 1015 && dr.b.end === 1060 &&
    dr.b.drive.from.address === '5 Home Street, Hometown' && /Lot B/.test(dr.b.drive.to.address) && sh && sh.b.start === 1060 && sh.b.end === 1080 &&
    sh.b.place.label === 'AAA airport', JSON.stringify([dr, sh]));
ok('and the parking is dropped off when the shuttle leaves', (await plan()).parking[0].fromTime === 1060 && (await plan()).parking[0].fromDate === D1);
ok('a step with no length stays off the schedule', !(await leg('out:transfer')));
await setVal('.vac-journey[data-j="out"] .vac-j-transfer [data-k="transferMin"]', '40');
let tr = await leg('out:transfer');
ok('given one, it goes on at once: half an hour after landing, the next day', tr && tr.d === D2 && tr.b.start === 455 && tr.b.end === 495 &&
    tr.b.kind === 'travel' && tr.b.place.label === 'City Hotel', JSON.stringify(tr));
await setVal('.vac-journey[data-j="out"] .vac-j-transfer [data-k="transferMode"]', 'rental');
tr = await leg('out:transfer');
ok('a rental car is a drive, from the airport', tr.b.kind === 'drive' && tr.b.title === 'Rental car to City Hotel' && tr.b.drive.from.label === 'BBB airport');
await tab('Fri, Jul 9');
await page.click(blockSel('Shuttle to AAA'));
await page.waitForTimeout(80);
await setVal('.vac-form [data-f="start"]', '17:30');
await tab('Travel');
ok('a step changed by hand says so', /changed/.test(await text('.vac-journey[data-j="out"] .vac-j-shuttle')));
await setVal('.vac-journey[data-j="out"] .vac-j-shuttle [data-k="shuttleMin"]', '30');
sh = await leg('out:shuttle'); dr = await leg('out:drive');
ok('moved, the steps linked to it on its side of the flight move with it; planning again leaves them', sh.b.start === 1050 && sh.b.end === 1070 && dr.b.start === 1005 && dr.b.end === 1050 &&
    sh.b.link === dr.b.id,
    JSON.stringify([sh.b, dr.b]));
await sub('back');
ok('coming back with no flight of its own: a drive home from the last stay', JSON.stringify(await jTitles('back')) ===
    JSON.stringify(['Check out · Lake House', 'Drive home', '5 Home Street, Hometown']), JSON.stringify(await jTitles('back')));
await setVal('.vac-journey[data-j="back"] .vac-j-drive [data-k="driveMin"]', '60');
await page.click(J('back') + ' .vac-btn:has-text("Put it on the schedule")');
await page.waitForTimeout(100);
const home2 = await leg('back:drive');
ok('it goes on the last day, leaving at 10', home2 && home2.d === D2 && home2.b.start === 600 && home2.b.end === 660 &&
    home2.b.drive.from.label === 'Lake House' && home2.b.drive.to.address === '5 Home Street, Hometown', JSON.stringify(home2));
await page.click(W + ' .vac-head .vac-btn:has-text("Bullet list")');
await page.waitForTimeout(100);
md = await page.inputValue(W + ' .vac-out-text');
ok('the bullet list has both journeys, each date once, its steps under it', md.includes('\n## Getting there\n- 🏠 Home\n- Thu, Jul 8\n  - ✅ 9:00 PM · Online check-in opens\n- Fri, Jul 9\n') &&
    /\n  - 🚗 4:45\s?PM–5:30\s?PM · Drive to Long-term Lot B/.test(md) && md.includes('\n## Getting back\n') && /\n  - 🚗 [^\n]*Drive home\n- 🏠 /.test(md) &&
    md.slice(md.indexOf('## Getting there'), md.indexOf('## Getting back')).split('\n- Fri, Jul 9\n').length === 2,
    md.slice(md.indexOf('## Getting there'), md.indexOf('## Getting there') + 700));
ok('the home address is not in the list: Home, and no directions that carry it', !md.includes('5 Home Street') && !md.includes('Hometown') &&
    /\n- 🚗 [^\n]*Drive to Long-term Lot B[^\n]* · Home → Long-term Lot B, 5 Field Way\n/.test(md), JSON.stringify(md.split('\n').filter(l => /Hometown|Home Street|Lot B/.test(l))));
await page.click(W + ' .vac-out-close');
await sub('out');
// Changed by hand, they stay: taken away, the planner puts its own on again.
await page.evaluate((i) => { const p = vacGetData(i); Object.keys(p.days).forEach(d => { p.days[d].blocks = p.days[d].blocks.filter(b => !/^out:(drive|shuttle|airport)$/.test(b.leg || '')); }); vacSaveData(i, p); }, id);
await setVal('.vac-journey[data-j="out"] select[data-k="flight"]', 'none');
dr = await leg('out:drive');
ok('with no flight going, it is a drive to the first stay, and what is no longer needed goes', dr.b.title === 'Drive to Lake House' && dr.b.start === 540 &&
    dr.b.end === 585 && !(await leg('out:transfer')), JSON.stringify(dr.b));

// 10p. A car rental, and the journeys that use it.
await tab('Travel');
await sub('rental');
await page.click(W + ' .vac-rental-add');
await page.waitForTimeout(80);
let rent = (await plan()).rentals;
ok('+ Add car rental: the whole trip, its company ready', rent.length === 1 && rent[0].pickDate === D1 && rent[0].dropDate === D2 &&
    await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' .vac-rental-card [data-f="company"]'));
await setVal('.vac-rental-card [data-f="company"]', 'Example Rentals');
await setVal('.vac-rental-card [data-f="car"]', 'Compact');
await setVal('.vac-rental-card [data-f="pickPlace"]', 'Rental Row, BBB airport');
await setVal('.vac-rental-card [data-f="conf"]', 'R-55');
rent = (await plan()).rentals;
ok('kept, its pick-up place opening in Maps', rent[0].company === 'Example Rentals' && rent[0].pickPlace.address === 'Rental Row, BBB airport' &&
    /maps\/search\/\?api=1&query=Rental%20Row/.test(await page.getAttribute(W + ' .vac-rental-links a', 'href')));
await sub('out');
await setVal('.vac-journey[data-j="out"] select[data-k="flight"]', '');
ok('still set to Rental car, the choice now sits on the counter', await page.inputValue(W + ' .vac-journey[data-j="out"] .vac-j-pickup [data-k="transferMode"]') === 'rental');
ok('getting there by rental car: the counter after landing, then the drive', JSON.stringify((await jTitles('out')).slice(6)) === JSON.stringify([
    'Flight XY 123 · AAA → BBB', 'Bags and out · BBB', 'Pick up the rental car · Example Rentals', 'Drive to City Hotel', 'Check in · City Hotel']), JSON.stringify(await jTitles('out')));
rent = (await plan()).rentals;
tr = await leg('out:transfer');
ok('the rental is picked up half an hour after landing, and the drive follows the counter', rent[0].pickDate === D2 && rent[0].pickTime === 455 &&
    tr && tr.d === D2 && tr.b.kind === 'drive' && tr.b.start === 485 && tr.b.end === 525 && tr.b.drive.from.address === 'Rental Row, BBB airport', JSON.stringify([rent[0], tr]));
await tab('Sat, Jul 10');
ok('the day shows picking it up', (await all('.vac-event')).includes('🚙 Pick up 7:35 AM · Example Rentals'), JSON.stringify(await all('.vac-event')));
await tab('Travel');
await sub('back');
await setVal('.vac-journey[data-j="back"] select[data-k="flight"]', (await plan()).days[D1].blocks.find(b => b.kind === 'flight').id);
await setVal('.vac-journey[data-j="back"] .vac-j-transfer [data-k="transferMode"]', 'rental');
ok('coming back by rental car: the drive to return it, then the shuttle to the terminal', (await jTitles('back')).includes('Return the rental car · Example Rentals') &&
    (await jTitles('back')).includes('Shuttle to AAA'), JSON.stringify(await jTitles('back')));
rent = (await plan()).rentals;
const rsh = await leg('back:rshuttle');
ok('returned before the shuttle, which gets there in time', rent[0].dropDate === D1 && rent[0].dropTime === 1045 && rsh && rsh.b.start === 1060 && rsh.b.end === 1080,
    JSON.stringify([rent[0], rsh]));
const rret = await leg('back:return'), rdrv = { b: await page.evaluate((i) => vacJourneyPlan(vacGetData(i), 'back').steps.find(s => s.leg === 'transfer'), id) };
ok('returning the car is a block, a quarter of an hour before the shuttle, the drive ending at it', rret && rret.b.start === 1045 && rret.b.end === 1060 && rret.b.kind === 'travel' &&
    /^Return the rental car/.test(rret.b.title) && rret.b.place.address === 'Rental Row, BBB airport' && rdrv && rdrv.b.end === 1045, JSON.stringify([rret, rdrv && rdrv.b]));
await page.click(W + ' .vac-head .vac-btn:has-text("Bullet list")');
await page.waitForTimeout(100);
md = await page.inputValue(W + ' .vac-out-text');
ok('the bullet list has the rental, its booking left out', md.includes('\n## Car rental\n- 🚙 Example Rentals · Compact · Pick up [Rental Row, BBB airport](') && !md.includes('R-55'),
    md.slice(md.indexOf('## Car rental'), md.indexOf('## Car rental') + 300));
await page.click(W + ' .vac-out-close');
await tab('Travel');
await sub('rental');
await page.click(W + ' .vac-rental-card .vac-danger');
await page.waitForTimeout(80);
ok('Remove takes it away', (await plan()).rentals.length === 0 && /No car rental/.test(await text('.vac-main')));

// 10q. A cruise: the ship, boarding and leaving, its days at sea or in port.
const D5 = '2027-07-13', D6 = '2027-07-14';
await setVal('.vac-end', D6);
await tab('Cruise');
ok('the Cruise tab says what a cruise does', /No cruise/.test(await text('.vac-main')));
await page.click(W + ' .vac-cruise-add');
await page.waitForTimeout(80);
ok('+ Add cruise: its ship ready', (await plan()).cruises.length === 1 &&
    await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' .vac-cruise-card [data-f="ship"]'));
await setVal('.vac-cruise-card [data-f="ship"]', 'Example Star');
await setVal('.vac-cruise-card [data-f="line"]', 'Example Line');
await setVal('.vac-cruise-card [data-f="cabin"]', '8123');
await setVal('.vac-cruise-card [data-f="conf"]', 'C-901');
await setVal('.vac-cruise-card [data-f="boardPlace"]', 'Pier 1, Port Example');
await setVal('.vac-cruise-card [data-f="boardDate"]', D4);
await setVal('.vac-cruise-card [data-f="boardTime"]', '13:00');
await setVal('.vac-cruise-card [data-f="allAboard"]', '15:30');
let cr = (await plan()).cruises[0];
ok('kept: the ship, boarding, and leaving on the trip’s last day', cr.ship === 'Example Star' && cr.boardDate === D4 && cr.leaveDate === D6 &&
    cr.boardTime === 780 && cr.allAboard === 930 && cr.boardPlace.address === 'Pier 1, Port Example', JSON.stringify(cr));
const cruiseRows = () => all('.vac-cdays .vac-crow2');
ok('a row a day: boarding, at sea, leaving', (await cruiseRows()).length === 3 && /Board · Pier 1, Port Example · 1:00\s?PM · all aboard 3:30\s?PM/.test((await cruiseRows())[0]) &&
    !!(await page.$(W + ' .vac-cdays .vac-atsea')) && /Leave the ship · Pier 1, Port Example/.test((await cruiseRows())[2]), JSON.stringify(await cruiseRows()));
await setVal('.vac-cport-in[data-d="' + D5 + '"]', 'Cozumel Example Port');
await setVal('.vac-crow2 [data-f="arrive"][data-d="' + D5 + '"]', '08:00');
await setVal('.vac-crow2 [data-f="depart"][data-d="' + D5 + '"]', '17:00');
cr = (await plan()).cruises[0];
ok('a port given, the day is in port, all aboard half an hour before it sails', cr.days[D5].port.address === 'Cozumel Example Port' &&
    cr.days[D5].arrive === 480 && cr.days[D5].depart === 1020 && !(await page.$(W + ' .vac-cdays .vac-atsea')) &&
    await page.inputValue(W + ' .vac-crow2 [data-f="aboard"][data-d="' + D5 + '"]') === '16:30', JSON.stringify(cr.days));
await page.click(W + ' .vac-tab[data-view="' + D5 + '"]');
await page.waitForTimeout(80);
ok('the port day says where the ship is, and until when', (await all('.vac-event')).includes('⚓ In port: Cozumel Example Port 8:00 AM–5:00 PM · all aboard 4:30 PM'),
    JSON.stringify(await all('.vac-event')));
await page.click(W + ' .vac-tab[data-view="' + D4 + '"]');
await page.waitForTimeout(80);
ok('the day it sails says when to board', (await all('.vac-event')).includes('🚢 Board Example Star 1:00 PM · all aboard 3:30 PM'), JSON.stringify(await all('.vac-event')));
const homes = await page.evaluate((i) => { const p = vacGetData(i); return [vacDayHome(p, '2027-07-13'), vacStaysOn(p, '2027-07-12').night].map(x => x && (x.address || (x.place && x.place.address))); }, id);
ok('the ship is where you sleep: a port day starts from the port', homes[0] === 'Cozumel Example Port' && homes[1] === 'Pier 1, Port Example', JSON.stringify(homes));
await tab('Trip');
const cseg = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-tstay-cruise')).map(e => e.textContent), W);
ok('the Trip view shows the ship across its days, the port under each', JSON.stringify(cseg) === JSON.stringify(['🚢 Example Star', '⚓ Cozumel Example Port', '']), JSON.stringify(cseg));
await page.click(W + ' .vac-head .vac-btn:has-text("Bullet list")');
await page.waitForTimeout(100);
md = await page.inputValue(W + ' .vac-out-text');
ok('the bullet list has the cruise, a line a day, its booking left out', /\n## Cruise\n- 🚢 Example Star · Example Line · Cabin 8123 · Board \[Pier 1, Port Example\]\([^)]+\) Mon, Jul 12 1:00\s?PM \(all aboard 3:30\s?PM\) · Leave Wed, Jul 14\n  - ⚓ Tue, Jul 13 · \[Cozumel Example Port\]\([^)]+\) 8:00\s?AM–5:00\s?PM, all aboard 4:30\s?PM\n/.test(md) &&
    !md.includes('C-901'), md.slice(md.indexOf('## Cruise'), md.indexOf('## Cruise') + 400));
await page.click(W + ' .vac-out-close');
await tab('Cruise');
answer = true; asked = [];
await page.click(W + ' .vac-cruise-card .vac-danger');
await page.waitForTimeout(80);
ok('Remove asks, then takes it away', asked.length === 1 && /Example Star/.test(asked[0]) && (await plan()).cruises.length === 0);
await setVal('.vac-end', D2);

// 10r. The trip-wide tabs in an order of your own.
const tabOrder = async () => (await all('.vac-tab[draggable="true"]'));
const dragTab = (from, to, after) => page.evaluate(([s, from, to, after]) => {
    const a = document.querySelector(s + ' .vac-tab[data-view="' + from + '"]'), b = document.querySelector(s + ' .vac-tab[data-view="' + to + '"]');
    const dt = new DataTransfer(), r = b.getBoundingClientRect(), x = after ? r.right - 2 : r.left + 2;
    a.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt }));
    b.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: x }));
    b.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: x }));
    a.isConnected && a.dispatchEvent(new DragEvent('dragend', { bubbles: true, dataTransfer: dt }));
}, [W, from, to, after]);
await dragTab('lists', 'trip', false);
await page.waitForTimeout(80);
ok('a tab dragged before another goes there', (await tabOrder())[0] === '☑️ Lists' && (await tabOrder())[1] === 'Trip', JSON.stringify(await tabOrder()));
await dragTab('people', 'places', true);
await page.waitForTimeout(80);
const ord = await tabOrder();
ok('and after another', ord.indexOf('👥 People') === ord.indexOf('📍 Places') + 1, JSON.stringify(ord));
ok('kept with the plan', JSON.stringify((await plan()).tabOrder.slice(0, 2)) === JSON.stringify(['lists', 'trip']));
ok('the days stay in date order, after the trip-wide tabs', /^Fri, Jul 9/.test((await all('.vac-tab'))[10]) && /^Sat, Jul 10/.test((await all('.vac-tab'))[11]));
await page.focus(W + ' .vac-tab[data-view="lists"]');
await page.keyboard.press('Alt+ArrowRight');
await page.waitForTimeout(80);
ok('Alt+→ moves the tab with the focus, which keeps it', (await tabOrder())[1] === '☑️ Lists' &&
    await page.evaluate((s) => document.activeElement === document.querySelector(s), W + ' .vac-tab[data-view="lists"]'));
await page.keyboard.press('Alt+ArrowLeft');
await page.waitForTimeout(80);
ok('and Alt+← back', (await tabOrder())[0] === '☑️ Lists');
await tab('Trip');
ok('a tab still opens with a click', /Trip/.test(await text('.vac-tab.vac-on')));

// 10s. What clashes: worked out from the plan, shown on the blocks, ignored if meant.
const kept = await plan();
const S1 = '2028-03-01', S2 = '2028-03-02', S3 = '2028-03-03', S4 = '2028-03-04';
await page.evaluate(([i, d]) => {
    const p = vacDefaultPlan();
    Object.assign(p, { name: 'Test Trip', start: d[0], end: d[3] });
    vacEnsureDays(p);
    p.days[d[0]].blocks = p.days[d[0]].blocks.filter(b => b.meal !== 'am');
    p.days[d[0]].blocks.push({ id: 'f1', kind: 'flight', title: '', start: 600, end: 840, flight: { number: 'EX 1', from: 'AAA', to: 'BBB', arrive: 840, arriveDay: 0, conf: 'FC-77' } },
        { id: 'a1', kind: 'activity', title: 'Early coffee', start: 420, end: 510 });
    p.days[d[1]].blocks.push({ id: 'a2', kind: 'activity', title: 'Museum', start: 540, end: 660, notes: 'Gate; code, 1234' },
        { id: 'a3', kind: 'activity', title: 'Boat tour', start: 600, end: 720, place: { label: 'Pier', address: '7 Example Quay' } });
    p.days[d[3]].blocks.push({ id: 'f2', kind: 'flight', title: '', start: 960, end: 1200, flight: { number: 'EX 2', from: 'BBB', to: 'AAA', arrive: 1200, arriveDay: 0 } });
    p.stays = [{ id: 's1', place: { label: 'Lake House', address: '1 Example Lane' }, inDate: d[0], inTime: 900, outDate: d[2], outTime: 660, conf: 'H-9', cost: '', phone: '', notes: '' },
        { id: 's2', place: { label: 'City Hotel', address: '2 Example Ave' }, inDate: d[1], inTime: null, outDate: d[2], outTime: null, conf: '', cost: '', phone: '', notes: '' },
        { id: 's3', place: { label: 'Back Inn', address: '3 Example Rd' }, inDate: d[3], inTime: null, outDate: d[2], outTime: null, conf: '', cost: '', phone: '', notes: '' }];
    p.rentals = [{ id: 'r1', company: 'Example Rentals', pickDate: d[0], pickTime: 780, dropDate: d[3], dropTime: 900, pickPlace: null, dropPlace: null }];
    p.parking = [{ id: 'k1', lot: { label: 'Lot B', address: '5 Field' }, fromDate: d[0], fromTime: 540, toDate: d[3], toTime: 1140, spot: '', conf: '' }];
    vacSaveData(i, p);
    vacUi.delete(i);
    vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget'));
}, [id, [S1, S2, S3, S4]]);
const keys = async () => page.evaluate((i) => vacWarnings(vacGetData(i)).active.map(w => w.key.replace(/:.*/, '')).sort(), id);
ok('each kind of clash is found, and a meal on a flight is not one', JSON.stringify(await keys()) ===
    JSON.stringify(['late', 'nostay', 'overlap', 'parkdrop', 'parkpick', 'rentdrop', 'rentpick', 'stayorder', 'twostays']), JSON.stringify(await keys()));
const wtext = await page.evaluate((i) => vacConflicts(vacGetData(i)).map(w => w.text), id);
ok('and each says what and when', wtext.includes('Museum (9:00 AM–11:00 AM) and Boat tour (10:00 AM–12:00 PM) are at the same time') &&
    wtext.some(t => /^Early coffee ends at 8:30 AM, 1.5 h before Flight EX 1 takes off: be at the airport 2 h before, by 8:00 AM$/.test(t)) &&
    wtext.some(t => /^Picking up Example Rentals at 1:00 PM, before Flight EX 1 lands at 2:00 PM$/.test(t)) &&
    wtext.includes('Two places to sleep the night of Thu, Mar 2: Lake House and City Hotel') &&
    wtext.includes('Nowhere to sleep the night of Fri, Mar 3'), JSON.stringify(wtext));
ok('the header counts them', (await text('.vac-warn-btn')).trim() === '⚠️ 9' && !!(await page.$(W + ' .vac-warn-btn.vac-warn-on')));
await tab('Trip');
const tripWarned = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-tcol .vac-block.vac-warned')).map(b => b.dataset.id).sort(), W);
ok('in the Trip view, the blocks in one are marked', JSON.stringify(tripWarned) === JSON.stringify(['a1', 'a2', 'a3', 'f1', 'f2']), JSON.stringify(tripWarned));
await page.click(W + ' .vac-tab[data-view="' + S2 + '"]');
await page.waitForTimeout(80);
const tip = await page.getAttribute(W + ' .vac-grid .vac-block[data-id="a2"] .vac-b-warn', 'title');
ok('on the day, a ⚠️ that says why', /same time/.test(tip || '') && !(await page.$(W + ' .vac-grid .vac-block[data-id="' +
    (await day(S2)).blocks.find(b => b.meal === 'am').id + '"].vac-warned')), tip);
await page.click(W + ' .vac-warn-btn');
await page.waitForTimeout(80);
ok('⚠️ lists them, by day', (await page.$$(W + ' .vac-warn-row')).length === 9 && /Wed, Mar 1/.test((await all('.vac-warn-when'))[0]));
await page.click(W + ' .vac-btn:has-text("Bullet list")');
await page.waitForTimeout(80);
ok('one panel at a time', !!(await page.$(W + ' .vac-out-text')) && !(await page.$(W + ' .vac-warn')));
await page.click(W + ' .vac-warn-btn');
await page.waitForTimeout(80);
await page.click(W + ' .vac-warn-row[data-key^="rentpick"] .vac-warn-go');
await page.waitForTimeout(80);
ok('Go to opens where it is fixed: the car rental', !(await page.$(W + ' .vac-warn')) && /Travel/.test(await text('.vac-tab.vac-on')) && /Car rental/.test(await text('.vac-subtab.vac-on')));
await page.click(W + ' .vac-warn-btn');
await page.waitForTimeout(80);
await page.click(W + ' .vac-warn-row[data-key^="overlap"] .vac-warn-go');
await page.waitForTimeout(80);
ok('or the day, its block chosen', (await text('.vac-tab.vac-on')).includes('Thu, Mar 2') && !!(await page.$(W + ' .vac-grid .vac-block.vac-sel[data-id="a2"]')));
await setVal('.vac-side [data-f="end"]', '10:00');
ok('fixed, it goes, and the count with it', !(await keys()).includes('overlap') && (await text('.vac-warn-btn')).trim() === '⚠️ 8' &&
    !(await page.$(W + ' .vac-grid .vac-block.vac-warned[data-id="a3"]')));
await page.click(W + ' .vac-warn-btn');
await page.waitForTimeout(80);
await page.click(W + ' .vac-warn-row[data-key^="twostays"] .vac-warn-ignore');
await page.waitForTimeout(80);
ok('Ignore: kept with the plan, no longer counted', (await plan()).ignoredWarnings.length === 1 && /^twostays:/.test((await plan()).ignoredWarnings[0]) &&
    (await text('.vac-warn-btn')).trim() === '⚠️ 7' && (await page.$$(W + ' .vac-warn-row')).length === 7);
await page.check(W + ' .vac-warn-show');
await page.waitForTimeout(80);
ok('Show ignored shows it, to warn about again', (await page.$$(W + ' .vac-warn-row.vac-warn-off')).length === 1 && /Warn again/.test(await text('.vac-warn-off .vac-warn-ignore')));
await page.click(W + ' .vac-warn-off .vac-warn-ignore');
await page.waitForTimeout(80);
ok('and Warn again does', ((await plan()).ignoredWarnings || []).length === 0 && (await text('.vac-warn-btn')).trim() === '⚠️ 8');
await page.click(W + ' .vac-warn-close');
const cruiseKeys = await page.evaluate(([i, d]) => {
    const p = vacGetData(i);
    p.stays = []; p.parking = []; p.rentals = [];
    p.cruises = [{ id: 'c1', ship: 'Example Star', boardDate: d[0], boardTime: 780, allAboard: 900, leaveDate: d[3], days: { [d[1]]: { port: { label: 'Port Two', address: 'Port Two' }, arrive: 480, depart: 1020 } } }];
    p.days[d[0]].blocks.push({ id: 'dr', kind: 'drive', title: 'To the pier', start: 840, end: 960 });
    p.days[d[1]].blocks.push({ id: 'ex', kind: 'activity', title: 'Long hike', start: 600, end: 1020 }, { id: 'sh', kind: 'activity', title: 'Show on board', start: 1200, end: 1260 });
    return vacConflicts(p).filter(w => /^aboard:/.test(w.key)).map(w => w.ids[0] + ' ' + w.text);
}, [id, [S1, S2, S3, S4]]);
ok('a cruise: getting to the ship, or back on board, after all aboard', cruiseKeys.length === 2 && /^dr To the pier/.test(cruiseKeys[0]) &&
    /^ex Long hike \(10:00 AM–5:00 PM\) runs past all aboard for Example Star, at 4:30 PM$/.test(cruiseKeys[1]), JSON.stringify(cruiseKeys));

// 10t. The plan as a calendar file.
const ics = (o) => page.evaluate(([i, o]) => vacIcs(vacGetData(i), o).text, [id, o]);
let cal = await ics({ alarms: true });
const lines = cal.split('\r\n');
ok('an iCalendar file, CRLF lines folded at 75 bytes', cal.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n') && cal.endsWith('END:VCALENDAR\r\n') &&
    !/[^\r]\n/.test(cal) && lines.every(l => new TextEncoder().encode(l).length <= 75) &&
    cal.split('BEGIN:VEVENT').length === cal.split('END:VEVENT').length);
const evOf = (c, uid) => { const a = c.indexOf('UID:' + uid + '@'); return a < 0 ? '' : c.slice(c.lastIndexOf('BEGIN:VEVENT', a), c.indexOf('END:VEVENT', a)).replace(/\r\n /g, ''); };
ok('a block at its local time, its place and notes, text escaped', evOf(cal, 'a3').includes('DTSTART:20280302T100000\r\nDTEND:20280302T120000') &&
    evOf(cal, 'a3').includes('LOCATION:Pier\\, 7 Example Quay') && evOf(cal, 'a2').includes('DESCRIPTION:Gate\\; code\\, 1234') &&
    evOf(cal, 'a2').includes('DTSTART:20280302T090000\r\nDTEND:20280302T100000'), evOf(cal, 'a2'));
ok('a flight from its airports, with a reminder 2 h before; the booking left out', evOf(cal, 'f1').includes('LOCATION:AAA → BBB') &&
    evOf(cal, 'f1').includes('TRIGGER:-PT2H') && !cal.includes('FC-77') && !cal.includes('H-9'));
const breakfast = (await day(S2)).blocks.find(b => b.meal === 'am').id;
ok('a meal has no reminder; the rest 30 minutes', evOf(cal, breakfast) && !evOf(cal, breakfast).includes('VALARM') && evOf(cal, 'a2').includes('TRIGGER:-PT30M'));
ok('a stay across its nights, all day, with check-in at its time', evOf(cal, 's1-stay').includes('DTSTART;VALUE=DATE:20280301\r\nDTEND;VALUE=DATE:20280303') &&
    evOf(cal, 's1-in').includes('DTSTART:20280301T150000') && /SUMMARY:🏨 Check in · Lake House/.test(evOf(cal, 's1-in')), evOf(cal, 's1-stay'));
ok('parking and the rental car', /SUMMARY:🅿️ Drop off · Lot B/.test(evOf(cal, 'k1-drop')) && /SUMMARY:🚙 Pick up · Example Rentals/.test(evOf(cal, 'r1-pick')));
cal = await ics({ alarms: false, conf: true });
ok('booking numbers when wanted; reminders off', cal.includes('Confirmation FC-77') && cal.includes('Confirmation H-9') && !cal.includes('VALARM'));
const uids = (c) => (c.match(/^UID:.*$/gm) || []).join();
ok('the same plan, the same UIDs, so importing again updates', uids(await ics({})) === uids(await ics({ alarms: true })) && uids(cal).length > 0);
cal = await ics({ date: S2 });
ok('one day: its blocks and what happens that day, no stays across days', !!evOf(cal, 'a2') && !evOf(cal, 'f1') && !evOf(cal, 's1-stay') && !!evOf(cal, 's2-in'));
await page.click(W + ' .vac-cal-btn');
await page.waitForTimeout(80);
ok('📅 Calendar opens its panel, counting the events', !!(await page.$(W + ' .vac-cal')) && /^\d+$/.test(await text('.vac-cal-count')) &&
    +(await text('.vac-cal-count')) === await page.evaluate((i) => vacIcs(vacGetData(i), {}).count, id));
let dl = page.waitForEvent('download');
await page.click(W + ' .vac-cal-download');
dl = await dl;
const fs = await import('node:fs');
const got = fs.readFileSync(await dl.path(), 'utf8');
ok('Download gives the trip as an .ics file, named for it', dl.suggestedFilename() === 'test-trip.ics' && got.startsWith('BEGIN:VCALENDAR') && got.includes('VALARM'));
await setVal('.vac-cal-scope', 'day');
ok('one day, from the day', +(await text('.vac-cal-count')) === await page.evaluate(([i, d]) => vacIcs(vacGetData(i), { date: d }).count, [id, S2]));
dl = page.waitForEvent('download');
await page.click(W + ' .vac-cal-download');
dl = await dl;
ok('named for its day', dl.suggestedFilename() === 'test-trip-' + S2 + '.ics');
await page.click(W + ' .vac-cal-close');
ok('closed, the header has it no longer on', !(await page.$(W + ' .vac-cal')) && !(await page.$(W + ' .vac-cal-btn.vac-on')));
await page.evaluate(([i, p]) => { vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, [id, kept]);

// 10u. More clashes, travel time between places, the calendar without home, and the budget.
const kept2 = await plan();
const B1 = '2029-05-01', B2 = '2029-05-02', B3 = '2029-05-03', B4 = '2029-05-04';
await page.evaluate(([i, d]) => {
    const p = vacDefaultPlan();
    Object.assign(p, { name: 'Budget Trip', start: d[0], end: d[3], currency: '€' });
    vacEnsureDays(p);
    const home = { label: '', address: '9 Private Road, Hometown' }, inn = { label: 'Sea Inn', address: '4 Shore Way' };
    const museum = { label: 'Museum', address: '1 Art Street' }, cafe = { label: 'Cafe', address: '2 Bean Lane' };
    p.home = home;
    p.stays = [{ id: 'st', place: inn, inDate: d[0], inTime: 900, outDate: d[2], outTime: 660, conf: '', cost: '€1.240,50', phone: '', notes: '' }];
    p.parking = [{ id: 'pk', lot: { label: 'Lot C', address: '3 Field' }, fromDate: d[0], fromTime: 480, toDate: d[3], toTime: 1200, spot: '', conf: '', cost: '$40' }];
    p.cruises = [{ id: 'cr', ship: 'Example Wave', boardDate: d[2], boardTime: 780, allAboard: 900, leaveDate: d[3], cost: 'included', days: {} }];
    p.days[d[0]].blocks.push({ id: 'early', kind: 'activity', title: 'Unpack', start: 720, end: 780, place: inn },
        { id: 'home1', kind: 'drive', title: 'Leave home', start: 360, end: 420, drive: { from: home, to: inn, stops: [] } });
    p.days[d[1]].blocks.push({ id: 'mus', kind: 'activity', title: 'Museum visit', start: 600, end: 720, place: museum, cost: '25' },
        { id: 'caf', kind: 'food', title: 'Coffee', start: 730, end: 780, place: cafe, cost: '8.50' },
        { id: 'drv', kind: 'drive', title: 'Scenic drive', start: 900, end: 960, drive: { from: inn, to: museum, stops: [] } });
    p.days[d[2]].blocks.push({ id: 'late', kind: 'activity', title: 'Pool', start: 600, end: 720, place: inn });
    p.days[d[3]].blocks = p.days[d[3]].blocks.filter(b => !b.meal);
    p.days[d[3]].blocks.push({ id: 'sea', kind: 'activity', title: 'Hike', start: 540, end: 600, place: { label: 'Cliffs', address: '5 Cliff Rd' } });
    p.cruises[0].leaveDate = '2029-05-05';
    vacSaveData(i, p);
    vacUi.delete(i);
    vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget'));
}, [id, [B1, B2, B3, B4]]);
const k2 = await page.evaluate((i) => vacConflicts(vacGetData(i)).map(w => w.key.replace(/:.*/, '') + ' ' + w.text), id);
ok('before check-in, at the stay', k2.some(t => /^beforein Unpack at Sea Inn \(12:00 PM–1:00 PM\) is before check-in, at 3:00 PM$/.test(t)), JSON.stringify(k2));
ok('after check-out, at the stay', k2.some(t => /^afterout Pool at Sea Inn \(10:00 AM–12:00 PM\) is after check-out, at 11:00 AM$/.test(t)));
ok('a drive with the car parked, no rental', k2.some(t => /^nocar Scenic drive \(3:00 PM–4:00 PM\) needs a car: yours is parked and no rental covers Wed, May 2$/.test(t)) &&
    !k2.some(t => /^nocar Leave home/.test(t)), JSON.stringify(k2.filter(t => /^nocar/.test(t))));
ok('ashore on a day at sea', k2.some(t => /^atsea Hike at Cliffs is on a day Example Wave is at sea$/.test(t)));
await page.evaluate((i) => { const p = vacGetData(i); p.rentals = [{ id: 'rn', company: 'Example Cars', pickDate: '2029-05-02', pickTime: 840, dropDate: '2029-05-02', dropTime: 1080, cost: '€120' }]; vacSaveData(i, p); }, id);
ok('a rental that day covers it', !(await page.evaluate((i) => vacConflicts(vacGetData(i)).some(w => /^nocar:/.test(w.key)), id)));

// Travel time between places.
await page.click(W + ' .vac-tab[data-view="' + B2 + '"]');
await page.waitForTimeout(80);
const gaps = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-gap:not(.vac-gap-on)')).map(g => [g.dataset.g, g.textContent]), W);
ok('a chip in the gap between two places, asking how long', gaps.length === 1 && gaps[0][0] === 'mus|caf' && gaps[0][1] === '⏱ travel?', JSON.stringify(gaps));
await page.click(W + ' .vac-gap');
await page.waitForTimeout(80);
ok('clicked, it asks how long and how, with directions', !!(await page.$(W + ' .vac-gap-pop')) && /Museum → Cafe/.test(await text('.vac-gap-route')) &&
    /travelmode=walking/.test(await page.getAttribute(W + ' .vac-gap-pop a', 'href')));
const gapDir = new URL(await page.getAttribute(W + ' .vac-gap-pop a', 'href'));
ok('its directions start from the first place, not from where you are', gapDir.searchParams.get('origin') === 'Museum, 1 Art Street' &&
    gapDir.searchParams.get('destination') === 'Cafe, 2 Bean Lane', gapDir.href);
ok('without making a block', (await day(B2)).blocks.length === (await page.evaluate(([i, d]) => vacDefaultPlan() && vacGetData(i).days[d].blocks.length, [id, B2])));
ok('it offers to keep Coffee right after the trip, ticked', await page.isChecked(W + ' .vac-gap-link') && /Keep Coffee right after the trip/.test(await text('.vac-gap-linkrow')));
await page.uncheck(W + ' .vac-gap-link');
await page.waitForTimeout(80);
ok('unticked, it stays unticked', !(await page.isChecked(W + ' .vac-gap-link')));
await setVal('.vac-gap-mode', 'taxi');
await setVal('.vac-gap-min', '15');
const tt = (await plan()).travelTimes;
ok('kept for the two places', JSON.stringify(Object.values(tt)) === JSON.stringify([{ min: 15, mode: 'taxi' }]) && Object.keys(tt)[0].includes('Museum') && Object.keys(tt)[0].includes('Cafe'), JSON.stringify(tt));
ok('the chip says it, and the 10 minutes there are fall 5 short', /^🚕 15 min · 5 min short$/.test(await text('.vac-gap')) && !!(await page.$(W + ' .vac-gap.vac-gap-short')), await text('.vac-gap'));
ok('which is a clash', await page.evaluate((i) => vacConflicts(vacGetData(i)).some(w => w.key === 'gap:mus|caf' &&
    w.text === 'Getting from Museum to Cafe takes 15 min, and there are only 10 min between Museum visit and Coffee'), id) &&
    !!(await page.$(W + ' .vac-block.vac-warned[data-id="caf"]')));
await page.evaluate((i) => { const p = vacGetData(i); p.days['2029-05-02'].blocks.find(b => b.id === 'caf').start = 735; p.days['2029-05-02'].blocks.find(b => b.id === 'caf').end = 780;
    p.days['2029-05-04'].blocks.push({ id: 'm2', kind: 'activity', title: 'Museum again', start: 600, end: 660, place: { label: 'Museum', address: '1 Art Street' } },
        { id: 'c2', kind: 'food', title: 'Cafe again', start: 700, end: 720, place: { label: 'Cafe', address: '2 Bean Lane' } }); vacSaveData(i, p); }, id);
const g4 = await page.evaluate((i) => vacGaps(vacGetData(i), '2029-05-04').map(g => g.a.id + '>' + g.b.id + ' ' + g.min + ' ' + g.short), id);
ok('filled in for the same two places on another day, and enough time there is no clash', JSON.stringify(g4) === JSON.stringify(['sea>m2 null 0', 'm2>c2 15 0']), JSON.stringify(g4));
const noGap = await page.evaluate((i) => { const p = vacGetData(i); p.days['2029-05-02'].blocks.push({ id: 'tx', kind: 'travel', title: 'Taxi', start: 720, end: 735 }); return vacGaps(p, '2029-05-02').length; }, id);
ok('no chip where travel is already on the schedule', noGap === 0);
let mdB = await page.evaluate((i) => vacMarkdown(vacGetData(i), {}), id);
ok('the list says how long to the next place, under the block', mdB.includes('Museum visit · [Museum, 1 Art Street]') && /Museum visit[^\n]*\n  - ↳ 🚕 15 min to Cafe\n/.test(mdB), mdB.slice(mdB.indexOf('## Wed'), mdB.indexOf('## Wed') + 400));
await page.click(W + ' .vac-gap-close');
await page.waitForTimeout(80);
ok('and closes', !(await page.$(W + ' .vac-gap-pop')));

// Estimated, when both places have a pin and no time is set.
ok('an estimate from the straight line: rough, to 5 minutes', JSON.stringify(await page.evaluate(() => {
    const a = { lat: 44, lng: -71 }, b = { lat: 44.008993, lng: -71 }, far = { lat: 44.4497, lng: -71 };
    const km = vacKm(a, b);
    return [Math.round(km * 10) / 10, ...['walk', 'drive', 'transit', 'taxi'].map(m => vacEstimate(km, m)), vacEstimate(vacKm(a, far), 'drive'), vacKm(a, { label: 'x' })];
})) === JSON.stringify([1, 15, 5, 15, 5, 65, null]));
await page.evaluate((i) => { const p = vacGetData(i);
    p.days['2029-05-03'].blocks = p.days['2029-05-03'].blocks.filter(b => b.id !== 'late');
    p.days['2029-05-03'].blocks.push({ id: 'pa', kind: 'activity', title: 'Gallery', start: 840, end: 900, place: { label: 'Gallery', address: '', lat: 44, lng: -71 } },
        { id: 'pb', kind: 'activity', title: 'Park', start: 910, end: 960, place: { label: 'Park', address: '', lat: 44.008993, lng: -71 } });
    vacSaveData(i, p); }, id);
await page.click(W + ' .vac-tab[data-view="2029-05-03"]');
await page.waitForTimeout(80);
ok('both with a pin: the chip estimates, marked ≈, and 5 minutes short is no clash', (await text('.vac-gap[data-g="pa|pb"]')) === '≈ 🚶 15 min' &&
    !!(await page.$(W + ' .vac-gap.vac-gap-est')) && !(await page.$(W + ' .vac-gap-short')) && !(await page.evaluate((i) => vacConflicts(vacGetData(i)).some(w => w.key === 'gap:pa|pb'), id)));
await page.evaluate((i) => { const p = vacGetData(i); p.days['2029-05-03'].blocks.find(b => b.id === 'pb').start = 900; vacSaveData(i, p); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, id);
ok('well over the gap, it warns, saying it is estimated', /^≈ 🚶 15 min · 15 min short$/.test(await text('.vac-gap[data-g="pa|pb"]')) &&
    await page.evaluate((i) => vacConflicts(vacGetData(i)).some(w => w.key === 'gap:pa|pb' && /takes about 15 min \(estimated\), and there is no time/.test(w.text)), id));
await page.click(W + ' .vac-gap[data-g="pa|pb"]');
await page.waitForTimeout(80);
ok('opened: each way’s estimate, to keep with a click', JSON.stringify(await all('.vac-gap-use')) === JSON.stringify(['🚶 15 min', '🚗 5 min', '🚌 15 min', '🚕 5 min']) &&
    /An estimate, not a route/.test(await text('.vac-gap-pop')) && !(await page.$(W + ' .vac-gap-clear')));
await page.click(W + ' .vac-gap-use[data-mode="drive"]');
await page.waitForTimeout(80);
ok('kept, it is set: no ≈, linked, and the Park moves up to 5 minutes after', (await text('.vac-gap[data-g="pa|pb"]')).startsWith('🔗 🚗 5 min') &&
    (await day('2029-05-03')).blocks.find(b => b.id === 'pb').start === 905 && (await day('2029-05-03')).blocks.find(b => b.id === 'pb').link === 'pa' && !(await page.$(W + ' .vac-gap[data-g="pa|pb"].vac-gap-est')) &&
    Object.values((await plan()).travelTimes).some(t => t.min === 5 && t.mode === 'drive'));
mdB = await page.evaluate((i) => vacMarkdown(vacGetData(i), {}), id);
ok('only set times go in the list, not estimates', mdB.includes('↳ 🚗 5 min to Park'));
await page.click(W + ' .vac-gap-close');
await page.click(W + ' .vac-tab[data-view="2029-05-02"]');
await page.waitForTimeout(80);
await page.click(W + ' .vac-gap');
await page.waitForTimeout(80);
ok('without pins, it says how to get an estimate', /Paste a Google Maps link with a pin for both places/.test(await text('.vac-gap-pop')));
await page.click(W + ' .vac-gap-close');

// The same chips in the Trip view, compact.
await tab('Trip');
const tchips = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-tday .vac-gap')).map(c => c.closest('.vac-tday').dataset.date + ' ' + c.dataset.g + ' ' + c.textContent), W);
ok('the Trip view has the chips too, compact', tchips.includes('2029-05-03 pa|pb 🚗5m') && tchips.some(t => /^2029-05-02 mus\|caf 🚕15m$/.test(t)), JSON.stringify(tchips));
await page.click(W + ' .vac-tday .vac-gap[data-g="pa|pb"]');
await page.waitForTimeout(80);
ok('clicked, the same box opens there, the Trip view kept', !!(await page.$(W + ' .vac-tday .vac-gap-pop')) && /Trip/.test(await text('.vac-tab.vac-on')) &&
    /Gallery → Park/.test(await text('.vac-gap-route')));
await setVal('.vac-gap-min', '20');
ok('and sets it from there', Object.values((await plan()).travelTimes).some(t => t.min === 20 && t.mode === 'drive') &&
    (await text('.vac-tday .vac-gap[data-g="pa|pb"]')) === '🚗20m' && !(await page.$(W + ' .vac-tday .vac-gap.vac-gap-short[data-g="pa|pb"]')) &&
    (await day('2029-05-03')).blocks.find(b => b.id === 'pb').start === 920);
await page.click(W + ' .vac-gap-close');
await page.waitForTimeout(80);

// Directions for a drive with no start of its own: from where you were, never Maps’ own guess.
const origins = await page.evaluate((i) => {
    const p = vacGetData(i), d = '2029-05-02', day = p.days[d];
    const late = { id: 'nd', kind: 'drive', title: 'On to the cafe', start: 990, end: 1020, drive: { from: null, to: { label: 'Cafe', address: '2 Bean Lane' }, stops: [] } };
    const early = { id: 'ne', kind: 'drive', title: 'Early drive', start: 360, end: 390, drive: { from: null, to: { label: 'Museum', address: '1 Art Street' }, stops: [] } };
    const link = { id: 'nl', kind: 'drive', title: 'From a link', start: 1100, end: 1120, drive: { from: { label: '', address: '', url: 'https://maps.app.goo.gl/Ab12' }, to: { label: 'Cafe', address: '2 Bean Lane' }, stops: [] } };
    day.blocks.push(late, early, link);
    vacSaveData(i, p);
    const o = (b) => new URL(vacDriveUrl(b, p, d)).searchParams.get('origin');
    const hint = (b) => { const t = document.createElement('div'); t.innerHTML = vacFormLinksHtml(p, b); return t.textContent; };
    return [o(late), o(early), o(link), hint(link), hint(late), vacMarkdown(p, {}).split('\n').find(l => /On to the cafe/.test(l))];
}, id);
ok('a drive with no start sets off from the day’s last place before it', origins[0] === 'Museum, 1 Art Street', JSON.stringify(origins));
ok('the first of the day, from where you woke', origins[1] === 'Sea Inn, 4 Shore Way');
ok('a start that is only a short link: from the last place instead, and said', origins[2] === 'Cafe, 2 Bean Lane' &&
    /Its start is only a short Maps link, so directions start from Cafe: give it a name or address/.test(origins[3]), origins[3]);
ok('the panel says where it starts from', /Starts from Museum/.test(await page.evaluate((i) => { const p = vacGetData(i); const t = document.createElement('div');
    t.innerHTML = vacFormLinksHtml(p, p.days['2029-05-02'].blocks.find(b => b.id === 'nd')); return t.querySelector('a').title; }, id)));
ok('and the list’s directions start there too', /origin=Museum%2C%201%20Art%20Street/.test(origins[5] || ''), origins[5]);
await page.evaluate((i) => { const p = vacGetData(i); p.days['2029-05-02'].blocks = p.days['2029-05-02'].blocks.filter(b => !['nd', 'ne', 'nl'].includes(b.id)); vacSaveData(i, p); }, id);

// The calendar: home is Home.
const icsB = await page.evaluate((i) => vacIcs(vacGetData(i), {}).text.replace(/\r\n /g, ''), id);
ok('the calendar never has the home address', !icsB.includes('Hometown') && !icsB.includes('Private Road') && /UID:home1@[\s\S]*?DESCRIPTION:From Home/.test(icsB));

// Getting back, in order: checked out by the time you leave.
const back = await page.evaluate((i) => { const p = vacGetData(i); p.cruises = []; p.stays[0].outDate = '2029-05-04'; return vacJourneyPlan(p, 'back').steps.filter(s => s.start != null).map(s => s.leg + ' ' + s.start); }, id);
ok('Getting back: check-out no later than leaving', back[0] === 'checkout 600' && back[1] === 'drive 600', JSON.stringify(back));

// The budget.
ok('amounts read from text', JSON.stringify(await page.evaluate(() => ['$1,240', '€85.50', '1.240,50', '85', 'free', '12,5', '1,234,567.8'].map(vacMoney))) ===
    JSON.stringify([1240, 85.5, 1240.5, 85, null, 12.5, 1234567.8]));
await tab('Budget');
const rowsB = await all('.vac-bud-row td:nth-child(2)');
ok('💰 Budget lists every cost, by day', JSON.stringify(rowsB) === JSON.stringify(['Parking · Lot C', 'Sea Inn', 'Museum visit', 'Coffee', 'Car rental · Example Cars', 'Example Wave']), JSON.stringify(rowsB));
ok('its totals, by category; what cannot be read said, not counted', (await text('.vac-bud-total')) === '€1,434' && /Stay €1,240.50/.test(await text('.vac-bud-cats')) &&
    /Example Wave \(“included”\)/.test(await text('.vac-bud-sum')), await text('.vac-bud-sum'));
await page.check(W + ' .vac-bud-row[data-src="stay"] .vac-bud-paidbox');
await page.waitForTimeout(80);
ok('ticked paid: kept on the stay, the totals follow', (await plan()).stays[0].paid === true && (await text('.vac-bud-paid')) === '€1,240.50' && (await text('.vac-bud-topay')) === '€193.50');
await page.click(W + ' .vac-bud-add');
await page.waitForTimeout(80);
await setVal('.vac-bud-extra [data-f="label"]', 'Travel insurance');
await setVal('.vac-bud-extra [data-f="cost"]', '66.50');
ok('a cost of its own', JSON.stringify((await plan()).extras.map(x => [x.label, x.cost, x.cat])) === JSON.stringify([['Travel insurance', '66.50', 'other']]) && (await text('.vac-bud-total')) === '€1,500.50');
await setVal('.vac-bud-limit', '1400');
ok('a budget: what is over, in red', /Over budget/.test(await text('.vac-bud-sum')) && (await text('.vac-bud-left')) === '€100.50' && !!(await page.$(W + ' .vac-bud-bar.vac-bud-over')));
await page.evaluate((i) => { const p = vacGetData(i); p.people = [{ id: 'p1', name: 'A' }, { id: 'p2', name: 'B' }]; vacSaveData(i, p); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, id);
ok('per person, once there are people', (await text('.vac-bud-pp')) === '€750.25');
await page.click(W + ' .vac-bud-row[data-src="block"] .vac-link');
await page.waitForTimeout(80);
ok('a line opens where it is set', (await text('.vac-tab.vac-on')).includes('Wed, May 2') && !!(await page.$(W + ' .vac-grid .vac-block.vac-sel[data-id="mus"]')));
await setVal('.vac-side [data-f="cost"]', '30');
ok('a block’s cost, in its panel', (await day(B2)).blocks.find(b => b.id === 'mus').cost === '30');
mdB = await page.inputValue(W + ' .vac-out-text').catch(() => '') || await page.evaluate((i) => vacMarkdown(vacGetData(i), {}), id);
ok('the budget stays out of the list and the calendar', !/€|Budget|insurance/i.test(mdB.replace('# Budget Trip', '')) &&
    !(await page.evaluate((i) => vacIcs(vacGetData(i), {}).text, id)).includes('€'));
await page.evaluate(([i, p]) => { vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, [id, kept2]);

// 10v. In the Trip view, blocks are moved and stretched, to another day too.
const kept3 = await plan();
await page.evaluate((i) => {
    const p = vacDefaultPlan();
    Object.assign(p, { name: 'Drag Trip', start: '2030-06-01', end: '2030-06-03' });
    vacEnsureDays(p);
    p.days['2030-06-01'].blocks.push({ id: 'dg', kind: 'activity', title: 'Kayak', start: 600, end: 660 });
    vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget'));
}, id);
const tb = () => box(W + ' .vac-tcol .vac-block[data-id="dg"]');
const tpx = +(await page.getAttribute(W + ' .vac-tday[data-date="2030-06-01"]', 'data-px'));
let bb = await tb();
await page.mouse.move(bb.x + bb.width / 2, bb.y + 4);
await page.mouse.down();
await page.mouse.move(bb.x + bb.width / 2, bb.y + 4 + tpx, { steps: 4 });
await page.mouse.up();
await page.waitForTimeout(120);
let kb = (await day('2030-06-01')).blocks.find(b => b.id === 'dg');
ok('dragged down an hour in the Trip view, it moves', kb.start === 660 && kb.end === 720 && /Trip/.test(await text('.vac-tab.vac-on')), JSON.stringify(kb));
bb = await tb();
const col3 = await box(W + ' .vac-tday[data-date="2030-06-03"]');
await page.mouse.move(bb.x + bb.width / 2, bb.y + 4);
await page.mouse.down();
await page.mouse.move(col3.x + col3.width / 2, bb.y + 4, { steps: 6 });
await page.mouse.up();
await page.waitForTimeout(120);
ok('dragged across, it moves to that day, at the same time', !(await day('2030-06-01')).blocks.some(b => b.id === 'dg') &&
    (await day('2030-06-03')).blocks.some(b => b.id === 'dg' && b.start === 660 && b.end === 720) &&
    !!(await page.$(W + ' .vac-tday[data-date="2030-06-03"] .vac-block[data-id="dg"]')));
bb = await box(W + ' .vac-tcol .vac-block[data-id="dg"] .vac-b-resize');
await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
await page.mouse.down();
await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2 + tpx, { steps: 4 });
await page.mouse.up();
await page.waitForTimeout(120);
kb = (await day('2030-06-03')).blocks.find(b => b.id === 'dg');
ok('its bottom edge dragged, it ends later', kb.start === 660 && kb.end === 780, JSON.stringify(kb));
await page.click(W + ' .vac-tcol .vac-block[data-id="dg"]', { position: { x: 10, y: 3 } });
await page.waitForTimeout(120);
ok('clicked, it still opens its day, chosen', (await text('.vac-tab.vac-on')).includes('Mon, Jun 3') && !!(await page.$(W + ' .vac-grid .vac-block.vac-sel[data-id="dg"]')));
await page.evaluate(([i, p]) => { vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, [id, kept3]);

// 10w. Where a place points: its own pin, never the map's centre; an address before a pin.
const pins2 = await page.evaluate(() => {
    const own = vacParsePlace('https://www.google.com/maps/place/Old+Mill/@44.10,-71.70,15z/data=!4m6!3m5!1s0x0:0x0!8m2!3d44.131!4d-71.771');
    const centre = vacParsePlace('https://www.google.com/maps/place/Old+Mill/@44.10,-71.70,15z');
    const q = vacParsePlace('https://www.google.com/maps/search/?api=1&query=44.2,-71.3');
    return [own.lat, own.lng, centre.lat === undefined, centre.label, q.lat,
        vacRouteStop({ label: 'Mill', address: '40 Mill Road', lat: 1, lng: 2 }), vacRouteStop({ label: 'Mill', address: '', lat: 1, lng: 2 }), vacRouteStop({ label: 'Mill', address: '' })];
});
ok('a link’s pin is the place’s own, never the middle of the map', JSON.stringify(pins2) === JSON.stringify([44.131, -71.771, true, 'Old Mill', 44.2,
    'Mill, 40 Mill Road', '1,2', 'Mill']), JSON.stringify(pins2));
const fixed = await page.evaluate((i) => {
    const all = loadToolCustomizations(), p = JSON.parse(JSON.stringify(all[i].vacPlan));
    p.places.push({ id: 'old', label: 'Old', address: '', url: 'https://www.google.com/maps/place/Old/@44.1,-71.1,15z', lat: 44.1, lng: -71.1 },
        { id: 'good', label: 'Good', address: '', url: 'https://www.google.com/maps/place/Good/data=!3d44.5!4d-71.5', lat: 44.5, lng: -71.5 });
    all[i].vacPlan = p; saveToolCustomizations(all);
    const r = vacGetData(i).places.filter(x => x.id === 'old' || x.id === 'good').map(x => x.id + ':' + (x.lat != null));
    all[i].vacPlan.places = all[i].vacPlan.places.filter(x => x.id !== 'old' && x.id !== 'good'); saveToolCustomizations(all);
    return r;
}, id);
ok('a pin saved before from the map’s centre is let go on reading', JSON.stringify(fixed) === JSON.stringify(['old:false', 'good:true']), JSON.stringify(fixed));
const renamed = await page.evaluate(() => {
    const link = 'https://www.google.com/maps/place/Harbor+Pier+Seven/data=!3d44.1236!4d-71.7651';
    const a = vacRenamePlace(vacParsePlace(link), 'Pier 7'), b = vacRenamePlace(vacParsePlace(link), 'Beach Bar');
    return [!!a.url && a.lat === 44.1236, !b.url && b.lat === undefined, vacNamesAgree('Harbor Pier Seven', 'Harbor pier 7'), vacNamesAgree('Café Rouge', 'cafe rouge')];
});
ok('renamed to another place, the link and its pin go; renamed the same place, they stay', JSON.stringify(renamed) === JSON.stringify([true, true, true, true]), JSON.stringify(renamed));
await tab('Places');
const tgt = await all('.vac-place .vac-ptarget');
ok('Places says where each one’s directions go, with a link to check it', tgt.length > 0 && tgt.every(t => /^Directions go to: /.test(t) && /Check$/.test(t)) &&
    /query=44\.1236%2C-71\.7651/.test(await page.getAttribute(W + ' .vac-place .vac-ptarget a', 'href') || ''), JSON.stringify(tgt));
await page.evaluate((s) => { const a = document.querySelector(s + ' .vac-place .vac-ptarget a'); a.removeAttribute('href'); a.click(); }, W);
await page.waitForTimeout(80);
ok('clicking Check does not open the place to change', !(await page.$(W + ' .vac-pedit')));
await tab('Trip');

// 10x. The trip's destination: places with only a name are looked for there, not near you.
const kept4 = await plan();
await page.evaluate((i) => {
    const p = vacDefaultPlan();
    Object.assign(p, { name: 'Dest Trip', start: '2031-01-15', end: '2031-01-16' });
    vacEnsureDays(p);
    p.home = { label: '', address: '1 Home Way, Hometown' };
    p.places = [{ id: 'h', label: 'Hollywood Lookout', address: '' }, { id: 'g', label: 'The Getty', address: '1200 Getty Center Dr' }];
    p.stays = [{ id: 's', place: { label: 'Hotel', address: '' }, inDate: '2031-01-15', inTime: 900, outDate: '2031-01-16', outTime: 660 }];
    p.parking = [{ id: 'k', lot: { label: 'Lot C', address: '' }, fromDate: '2031-01-15', fromTime: 480, toDate: '2031-01-16', toTime: 1200 }];
    p.days['2031-01-15'].blocks.push({ id: 'v', kind: 'activity', title: 'View', start: 600, end: 660, place: { label: 'Hollywood Lookout', address: '' } },
        { id: 'sh', kind: 'travel', title: 'Shuttle', start: 400, end: 420, place: { label: 'FLL airport', address: '' } },
        { id: 'pk', kind: 'drive', title: 'To the lot', start: 360, end: 390, drive: { from: p.home, to: { label: 'Lot C', address: '' }, stops: [] } });
    vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget'));
}, id);
const keyBefore = await page.evaluate((i) => { const p = vacGetData(i); return vacGapKey(p.places[0], p.stays[0].place); }, id);
await setVal('.vac-dest', 'Los Angeles, CA');
ok('the destination is set in the header, and kept', (await plan()).destination === 'Los Angeles, CA' && await page.inputValue(W + ' .vac-dest') === 'Los Angeles, CA');
const dst = await page.evaluate((i) => { const p = vacGetData(i), bl = p.days['2031-01-15'].blocks;
    return [vacRouteStop(bl.find(b => b.id === 'v').place), new URL(vacPlaceUrl(p.places[0])).searchParams.get('query'), vacRouteStop(p.stays[0].place),
        vacRouteStop(p.places[1]), vacRouteStop(bl.find(b => b.id === 'sh').place), vacRouteStop(bl.find(b => b.id === 'pk').drive.to), vacGapKey(p.places[0], p.stays[0].place)]; }, id);
ok('a place with only a name is looked for in the destination', dst[0] === 'Hollywood Lookout, Los Angeles, CA' && dst[1] === 'Hollywood Lookout, Los Angeles, CA' &&
    dst[2] === 'Hotel, Los Angeles, CA', JSON.stringify(dst));
ok('one with an address as it is; airports and the parking lot left out', dst[3] === 'The Getty, 1200 Getty Center Dr' && dst[4] === 'FLL airport' && dst[5] === 'Lot C', JSON.stringify(dst));
ok('the destination is not saved into the places, and travel times keep their key', !JSON.stringify(await plan()).includes('"near"') && dst[6] === keyBefore);
await tab('Places');
ok('Places shows it is looked for there', /Directions go to: the name Hollywood Lookout, Los Angeles, CA Check \(looked for in the destination/.test((await all('.vac-place .vac-ptarget'))[0]),
    JSON.stringify(await all('.vac-place .vac-ptarget')));
ok('the calendar’s location has it too', (await page.evaluate((i) => vacIcs(vacGetData(i), {}).text.replace(/\r\n /g, ''), id)).includes('LOCATION:Hollywood Lookout\\, Los Angeles\\, CA'));
await setVal('.vac-dest', '');
ok('cleared, a name is a name again', await page.evaluate((i) => vacRouteStop(vacGetData(i).places[0]), id) === 'Hollywood Lookout');
await page.evaluate(([i, p]) => { vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, [id, kept4]);

// 10y. Drives and travel take their length from the travel time; a length set by hand can become it.
const kept5 = await plan();
const TD = '2032-03-10', TD2 = '2032-03-11';
await page.evaluate(([i, d1, d2]) => {
    const p = vacDefaultPlan();
    Object.assign(p, { name: 'Fit Trip', start: d1, end: d2 });
    vacEnsureDays(p);
    const A = { label: 'Observatory', address: '', lat: 34.1184, lng: -118.3004 }, B = { label: 'Walk of Fame', address: '', lat: 34.1016, lng: -118.3267 };
    p.home = { label: '', address: '', lat: 34.2, lng: -118.5 };
    p.stays = [{ id: 's', place: { label: 'Inn', address: '', lat: 34.05, lng: -118.25 }, inDate: d1, inTime: 900, outDate: d2, outTime: 660 }];
    p.days[d1].blocks.push({ id: 'ob', kind: 'activity', title: 'Stars', start: 600, end: 660, place: A },
        { id: 'dv', kind: 'drive', title: '', start: 660, end: 690, drive: { from: null, to: B, stops: [] } });
    p.days[d2].blocks = p.days[d2].blocks.filter(b => !b.meal);
    p.days[d2].blocks.push({ id: 'o2', kind: 'activity', title: 'Stars again', start: 600, end: 660, place: A }, { id: 'w2', kind: 'activity', title: 'Stars on the walk', start: 760, end: 800, place: B });
    vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget'));
}, [id, TD, TD2]);
const est = await page.evaluate(() => vacEstimate(vacKm({ lat: 34.1184, lng: -118.3004 }, { lat: 34.1016, lng: -118.3267 }), 'drive'));
await page.click(W + ' .vac-tab[data-view="' + TD + '"]');
await page.waitForTimeout(80);
await page.click(W + ' .vac-grid .vac-block[data-id="dv"]');
await page.waitForTimeout(80);
ok('a drive’s panel gives its travel time, from where you were before it', new RegExp('^Travel time Observatory → Walk of Fame: ≈ ' + est + ' min 🚗 \\(estimated from their pins\\) Fit to it$').test(await text('.vac-side .vac-btime')),
    await text('.vac-side .vac-btime'));
await page.click(W + ' .vac-side .vac-fit');
await page.waitForTimeout(80);
let dv = (await day(TD)).blocks.find(b => b.id === 'dv');
ok('Fit to it: the block as long as that', dv.end - dv.start === est && !dv.fit && /✓/.test(await text('.vac-side .vac-btime')), JSON.stringify(dv));
await setVal('.vac-side [data-f="end"]', '11:25');
ok('stretched by hand: keeping its length as the travel time is offered', /^Keep 25 min as the travel time from Observatory to Walk of Fame, on any day\? Keep/.test(await text('.vac-side .vac-offer')), await text('.vac-side .vac-offer'));
await page.click(W + ' .vac-side .vac-keep');
await page.waitForTimeout(80);
dv = (await day(TD)).blocks.find(b => b.id === 'dv');
const tt5 = Object.entries((await plan()).travelTimes || {});
ok('Keep: the pair’s travel time, the block following it', tt5.length === 1 && tt5[0][1].min === 25 && tt5[0][1].mode === 'drive' && dv.fit === tt5[0][0] && !(await page.$(W + ' .vac-side .vac-offer')),
    JSON.stringify(tt5));
await page.click(W + ' .vac-tab[data-view="' + TD2 + '"]');
await page.waitForTimeout(80);
ok('the chip on another day has it', (await text('.vac-gap[data-g="o2|w2"]')) === '🚗 25 min');
await page.click(W + ' .vac-gap[data-g="o2|w2"]');
await page.waitForTimeout(80);
await setVal('.vac-gap-min', '40');
dv = (await day(TD)).blocks.find(b => b.id === 'dv');
ok('changed there, the drive fitted to it follows', dv.end - dv.start === 40, JSON.stringify(dv));
await page.click(W + ' .vac-gap-close');
// Getting there: a drive with no length of its own takes the travel time.
const jr = await page.evaluate((i) => { const p = vacGetData(i); const st = vacJourneyPlan(p, 'out').steps.find(s => s.leg === 'drive');
    return [st.end - st.start, st.auto && st.auto.estimate, vacEstimate(vacKm(p.home, p.stays[0].place), 'drive')]; }, id);
ok('getting there: its drive takes the estimate when no length is chosen', jr[0] === jr[2] && jr[1] === true, JSON.stringify(jr));
await tab('Travel');
await sub('out');
ok('said, with no “needs a length”', new RegExp('≈ ' + jr[2] + ' min').test(await text('.vac-journey .vac-jauto')) && !/needs a length/.test(await text('.vac-journey')));
await page.evaluate((i) => { const p = vacGetData(i); p.travelTimes[vacGapKey(p.home, p.stays[0].place)] = { min: 45, mode: 'drive' }; vacSaveData(i, p); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, id);
ok('a travel time set for the pair is used instead', await page.evaluate((i) => { const st = vacJourneyPlan(vacGetData(i), 'out').steps.find(s => s.leg === 'drive'); return st.end - st.start; }, id) === 45 &&
    (await text('.vac-journey .vac-jauto')) === '45 min');
await setVal('.vac-journey[data-j="out"] select[data-k="driveMin"]', '60');
ok('and a length chosen wins', await page.evaluate((i) => { const st = vacJourneyPlan(vacGetData(i), 'out').steps.find(s => s.leg === 'drive'); return st.end - st.start; }, id) === 60 &&
    !(await page.$(W + ' .vac-journey .vac-jauto')));
// A chip on the drive blocks themselves, getting there and back's too.
await page.evaluate((i) => { const p = vacGetData(i); p.journeys.out.driveMin = null; vacJourneyApplyTo(p, 'out'); vacSaveData(i, p); vacUi.delete(i);
    const ui = vacUiOf(i); ui.view = '2032-03-10'; vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, id);
const onBlocks = await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-grid .vac-gap-on')).map(c => c.dataset.g + ' ' + c.textContent), W);
const legId = (await day(TD)).blocks.find(b => b.leg === 'out:drive').id;
ok('a drive block has a chip with its travel time, getting there’s too', onBlocks.includes('blk:dv 🚗 40 min') && onBlocks.includes('blk:' + legId + ' 🚗 45 min'), JSON.stringify(onBlocks));
await page.evaluate((i) => { const p = vacGetData(i); const b = p.days['2032-03-10'].blocks.find(x => x.id === 'dv'); b.end = b.start + 15; delete b.fit; vacSaveData(i, p);
    vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, id);
ok('shorter than the way, it says so, and it is a clash', (await text('.vac-grid .vac-gap-on[data-g="blk:dv"]')) === '🚗 40 min · 25 min short' &&
    await page.evaluate((i) => vacConflicts(vacGetData(i)).some(w => w.key === 'drivegap:dv' && /is 15 min long, but getting from Observatory to Walk of Fame takes 40 min$/.test(w.text)), id));
await tab('Trip');
ok('in the Trip view too', (await page.evaluate((s) => Array.from(document.querySelectorAll(s + ' .vac-tday .vac-gap-on')).map(c => c.dataset.g), W)).includes('blk:' + legId));
await page.click(W + ' .vac-tday .vac-gap-on[data-g="blk:' + legId + '"]');
await page.waitForTimeout(80);
await setVal('.vac-gap-min', '60');
const leg2 = (await day(TD)).blocks.find(b => b.leg === 'out:drive');
ok('set from its chip, getting there on the schedule follows', leg2.end - leg2.start === 60, JSON.stringify(leg2));
await page.click(W + ' .vac-gap-close');
// The drive to a parking with no lot: a chip all the same, saying what is missing.
await page.evaluate((i) => { const p = vacGetData(i);
    p.days['2032-03-10'].blocks.push({ id: 'fl1', kind: 'flight', title: '', start: 1080, end: 1200, flight: { number: 'EX 9', from: 'AAA', to: 'BBB', arrive: 1200, arriveDay: 0 } });
    p.parking = [{ id: 'pq', lot: null, fromDate: '2032-03-10', fromTime: null, toDate: '2032-03-11', toTime: null }];
    p.journeys.out.driveMin = 30; vacJourneyApplyTo(p, 'out'); vacSaveData(i, p);
    const ui = vacUiOf(i); ui.view = '2032-03-10'; vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, id);
const pkLeg = (await day(TD)).blocks.find(b => b.leg === 'out:drive');
ok('the drive to the parking has a chip, though it cannot be timed', !!pkLeg && /parking/i.test(pkLeg.title) && (await text('.vac-grid .vac-gap[data-g="blk:' + pkLeg.id + '"]')) === '⏱ ?' &&
    /The parking has no lot yet: set it in Travel › Parking/.test(await page.getAttribute(W + ' .vac-grid .vac-gap[data-g="blk:' + pkLeg.id + '"]', 'title')), JSON.stringify(pkLeg));
await page.click(W + ' .vac-grid .vac-gap[data-g="blk:' + pkLeg.id + '"]');
await page.waitForTimeout(80);
await page.click(W + ' .vac-gap-goto');
await page.waitForTimeout(80);
ok('its box opens Travel › Parking, to set the lot', /Travel/.test(await text('.vac-tab.vac-on')) && /Parking/.test(await text('.vac-subtab.vac-on')));
// After a flight, a shuttle or drive with no start sets off from where it lands.
const fromAfter = await page.evaluate((i) => {
    const p = vacGetData(i), d = '2032-03-11', d0 = '2032-03-10', d2 = d;
    p.days[d].blocks.push({ id: 'rs', kind: 'travel', title: 'Shuttle to AAA', start: 900, end: 920, place: { label: 'AAA airport', address: '' } },
        { id: 'bf', kind: 'flight', title: '', start: 1000, end: 1100, flight: { number: 'EX 8', from: 'AAA', to: 'CCC', arrive: 1100, arriveDay: 0 } },
        { id: 'ps', kind: 'travel', title: 'Shuttle to the lot', start: 1130, end: 1150, place: { label: 'Lot D', address: '9 Lot Rd' } });
    p.days[d0].blocks.push({ id: 'nf', kind: 'flight', title: '', start: 1290, end: 1440, flight: { number: 'EX 7', from: 'CCC', to: 'DDD', arrive: 300, arriveDay: 1 } });
    p.days[d2].blocks.push({ id: 'ds', kind: 'drive', title: 'Away', start: 330, end: 350, drive: { from: null, to: { label: 'Lot E', address: '8 Lot Rd' }, stops: [] } });
    const f = (dd, id) => vacPlaceName(vacDriveOrigin(p, dd, p.days[dd].blocks.find(b => b.id === id)));
    return [f(d, 'ps'), f(d2, 'ds'), vacBlockTravel(p, d, p.days[d].blocks.find(b => b.id === 'ps')).fromName];
}, id);
ok('after a flight, the shuttle sets off from where it lands, not where it left', JSON.stringify(fromAfter) === JSON.stringify(['CCC airport', 'DDD airport', 'CCC airport']), JSON.stringify(fromAfter));
await page.evaluate(([i, p]) => { vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, [id, kept5]);

// 10z. Check-in: online check-in opening, bag drop and the gate closing.
const kept6 = await plan();
const CD1 = '2033-04-01', CD2 = '2033-04-02';
await page.evaluate(([i, d1, d2]) => {
    const p = vacDefaultPlan();
    Object.assign(p, { name: 'Check Trip', start: d1, end: d2 });
    vacEnsureDays(p);
    p.days[d2].blocks.push({ id: 'cf', kind: 'flight', title: '', start: 960, end: 1140, flight: { number: 'EX 5', from: 'AAA', to: 'BBB', arrive: 1140, arriveDay: 0, gate: 'T2' } },
        { id: 'cs', kind: 'travel', title: 'Shuttle to AAA', start: 860, end: 930, place: { label: 'AAA airport', address: '' } });
    vacSaveData(i, p); vacUi.delete(i);
    const ui = vacUiOf(i); ui.view = d2; ui.sel = 'cf';
    vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget'));
}, [id, CD1, CD2]);
ok('a flight’s panel: online check-in opens 24 h before, unless set', await page.inputValue(W + ' .vac-side [data-f="f_checkinH"]') === '24' &&
    /^Fri, Apr 1 4:00\s?PM$/.test((await all('.vac-side .vac-ftime'))[0]), JSON.stringify(await all('.vac-side .vac-ftime')));
ok('the day before, its header says so', await page.evaluate(([i, d]) => vacDayEvents(vacGetData(i), d).map(e => e.icon + ' ' + e.text), [id, CD1]).then(ev => ev.includes('✅ Online check-in opens 4:00 PM · Flight EX 5')));
await setVal('.vac-side [data-f="f_checkinH"]', '48');
await setVal('.vac-side [data-f="f_bagMin"]', '60');
await setVal('.vac-side [data-f="f_gateMin"]', '20');
let cf = (await day(CD2)).blocks.find(b => b.id === 'cf').flight;
ok('kept on the flight', cf.checkinH === 48 && cf.bagMin === 60 && cf.gateMin === 20, JSON.stringify(cf));
ok('the panel says when, as they change', JSON.stringify((await all('.vac-side .vac-ftime')).map(t => t.replace(/\s/g, ' '))) === JSON.stringify(['Thu, Mar 31 4:00 PM', '3:00 PM', '3:40 PM']),
    JSON.stringify(await all('.vac-side .vac-ftime')));
ok('its day shows bag drop and the gate closing', (await all('.vac-event')).includes('🧳 Bag drop closes 3:00 PM · Flight EX 5') && (await all('.vac-event')).includes('🚪 Gate closes 3:40 PM · Flight EX 5'),
    JSON.stringify(await all('.vac-event')));
ok('getting to the airport after bag drop closes is a clash', await page.evaluate((i) => vacConflicts(vacGetData(i)).some(w => w.key === 'bagdrop:cf|cs' &&
    w.text === 'Shuttle to AAA gets there at 3:30 PM, after bag drop for Flight EX 5 closes, at 3:00 PM'), id));
const jAir = await page.evaluate((i) => { const st = vacJourneyPlan(vacGetData(i), 'out').steps; return [st.find(s => s.leg === 'airport').title, st[1].leg + ' ' + st[1].date]; }, id);
ok('getting there: online check-in first, and the airport step with bag drop and the gate', /^At the airport, 2 h before · bags by 3:00\s?PM · gate closes 3:40\s?PM$/.test(jAir[0]) &&
    jAir[1] === 'online 2033-03-31', JSON.stringify(jAir));
const icsC = await page.evaluate((i) => vacIcs(vacGetData(i), { alarms: true }).text.replace(/\r\n /g, ''), id);
const evC = (uid) => { const a = icsC.indexOf('UID:' + uid + '@'); return a < 0 ? '' : icsC.slice(icsC.lastIndexOf('BEGIN:VEVENT', a), icsC.indexOf('END:VEVENT', a)); };
ok('the calendar: online check-in with a reminder as it opens, bag drop and the gate half an hour before', evC('cf-online').includes('DTSTART:20330331T160000') && evC('cf-online').includes('TRIGGER:PT0M') &&
    evC('cf-bag').includes('DTSTART:20330402T150000') && evC('cf-bag').includes('TRIGGER:-PT30M') && evC('cf-gate').includes('DESCRIPTION:T2'), evC('cf-online'));
await tab('Travel');
await sub('flights');
ok('the flight’s card in Travel has them too', (await page.$$(W + ' .vac-tcard .vac-fcheck select')).length === 3);
// The time at the airport, and after landing, are blocks when getting there is on the schedule.
const airBlocks = await page.evaluate(([i, d]) => {
    const p = vacGetData(i); vacJourneyApplyTo(p, 'out');
    return Object.entries(p.days).flatMap(([dd, day]) => day.blocks.filter(b => /^out:(airport|arrive)$/.test(b.leg || '')).map(b => [dd, b.leg, b.title, b.start, b.end, (b.place || {}).label]));
}, [id, CD2]);
ok('at the airport, check-in to take-off, and bags and out after landing, as blocks', JSON.stringify(airBlocks) === JSON.stringify([
    ['2033-04-02', 'out:airport', 'At the airport, 2 h before · bags by 3:00 PM · gate closes 3:40 PM', 840, 960, 'AAA airport'],
    ['2033-04-02', 'out:arrive', 'Bags and out · BBB', 1140, 1170, 'BBB airport']]), JSON.stringify(airBlocks));
ok('a meal at the airport is had there, no clash', await page.evaluate((i) => { const p = vacGetData(i); vacJourneyApplyTo(p, 'out');
    p.days['2033-04-02'].blocks.push({ id: 'ml', kind: 'food', title: 'Snack', start: 935, end: 955 });
    return !vacConflicts(p).some(w => /^overlap:/.test(w.key) && w.ids.includes('ml')); }, id));
ok('and neither is late for its own flight, nor a drive to time', await page.evaluate((i) => { const p = vacGetData(i); vacJourneyApplyTo(p, 'out');
    return !vacConflicts(p).some(w => /^(late|bagdrop):[^|]*\|/.test(w.key) && p.days['2033-04-02'].blocks.some(b => /:(airport|arrive)$/.test(b.leg || '') && w.ids.includes(b.id))) &&
        !vacDriveChips(p, '2033-04-02').some(g => /:(airport|arrive)$/.test(g.block.leg || '')); }, id));
// Picking up the rental car: a block, from getting there or from its card.
const pickJ = await page.evaluate((i) => {
    const p = vacGetData(i);
    p.rentals = [{ id: 'rx', company: 'Example Cars', pickPlace: { label: 'Rental Row', address: '1 Car Way' }, pickDate: '2033-04-02', pickTime: null, dropDate: '2033-04-02', dropTime: null }];
    p.journeys = { out: { transferMode: 'rental', transferMin: 30 } };
    vacJourneyApplyTo(p, 'out'); vacSaveData(i, p);
    const b = p.days['2033-04-02'].blocks.find(x => x.leg === 'out:pickup');
    return b && [b.title, b.start, b.end, b.place.label, b.rentalId, !!vacRentalBlock(p, p.rentals[0], 'pick')];
}, id);
ok('getting there by rental car puts the pick-up on the schedule, at its counter', JSON.stringify(pickJ) === JSON.stringify(['Pick up the rental car · Example Cars', 1170, 1200, 'Rental Row', 'rx', true]), JSON.stringify(pickJ));
await page.evaluate((i) => { const p = vacGetData(i); p.journeys = {}; p.days['2033-04-02'].blocks = p.days['2033-04-02'].blocks.filter(b => !b.leg);
    p.rentals = [{ id: 'ry', company: 'Town Cars', pickPlace: { label: 'Town Lot', address: '2 Car Way' }, pickDate: '2033-04-01', pickTime: 540, dropDate: '2033-04-02', dropTime: 480 }];
    vacSaveData(i, p); vacUi.delete(i); const ui = vacUiOf(i); ui.view = 'travel'; ui.travelTab = 'rental'; vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, id);
ok('a rental’s card offers its pick-up and return for the schedule', JSON.stringify(await all('.vac-rental-sched')) === JSON.stringify(['📅 Pick-up on the schedule', '📅 Return on the schedule']));
await page.click(W + ' .vac-rental-sched[data-at="pick"]');
await page.waitForTimeout(80);
await page.click(W + ' .vac-rental-sched[data-at="drop"]');
await page.waitForTimeout(80);
let rb = await page.evaluate((i) => { const p = vacGetData(i); return Object.entries(p.days).flatMap(([d, day]) => day.blocks.filter(b => b.rental === 'ry').map(b => [d, b.rentalAt, b.start, b.end, b.place.label, b.title])); }, id);
ok('put on: half an hour to pick up, a quarter to return, at their places', JSON.stringify(rb) === JSON.stringify([['2033-04-01', 'pick', 540, 570, 'Town Lot', 'Pick up the rental car · Town Cars'],
    ['2033-04-02', 'drop', 480, 495, 'Town Lot', 'Return the rental car · Town Cars']]) && /✓ Pick-up on the schedule/.test(await text('.vac-rental-schedrow')), JSON.stringify(rb));
await setVal('.vac-rental-card [data-f="pickTime"]', '10:00');
await setVal('.vac-rental-card [data-f="pickDate"]', '2033-04-02');
rb = await page.evaluate((i) => { const p = vacGetData(i); return Object.entries(p.days).flatMap(([d, day]) => day.blocks.filter(b => b.rental === 'ry' && b.rentalAt === 'pick').map(b => [d, b.start, b.end])); }, id);
ok('and they follow the card', JSON.stringify(rb) === JSON.stringify([['2033-04-02', 600, 630]]), JSON.stringify(rb));
await page.evaluate(([i, p]) => { vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, [id, kept6]);

// 10za. Linked blocks: one right after another, moving together, following a change of length.
const kept7 = await plan();
const LD1 = '2034-03-01', LD2 = '2034-03-02';
await page.evaluate(([i, d1, d2]) => {
    const p = vacDefaultPlan();
    Object.assign(p, { name: 'Link Trip', start: d1, end: d2 });
    vacEnsureDays(p);
    p.days[d1].blocks = [{ id: 'la', kind: 'food', title: 'Coffee', start: 600, end: 660, place: { label: 'Cafe', address: '2 Bean Lane' } },
        { id: 'ld', kind: 'drive', title: 'Drive to the museum', start: 680, end: 720, drive: { from: null, to: { label: 'Museum', address: '1 Art Street' }, stops: [] } },
        { id: 'lb', kind: 'activity', title: 'Museum', start: 740, end: 800, place: { label: 'Museum', address: '1 Art Street' } }];
    p.days[d2].blocks = [];
    vacSaveData(i, p); vacUi.delete(i);
    const ui = vacUiOf(i); ui.view = d1; ui.sel = 'ld';
    vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget'));
}, [id, LD1, LD2]);
const lb = async (d) => Object.fromEntries((await day(d || LD1)).blocks.map(b => [b.id, [b.start, b.end, b.link || null]]));
ok('a drive offers to link to the blocks around it', /Link to the blocks around it/.test(await text('.vac-blinks')));
await page.click(W + ' .vac-link-around');
await page.waitForTimeout(100);
let L = await lb();
ok('linked: the drive starts when Coffee ends, the Museum when the drive ends', JSON.stringify(L) === JSON.stringify({ la: [600, 660, null], ld: [660, 700, 'la'], lb: [700, 760, 'ld'] }), JSON.stringify(L));
ok('the panel says what it follows and what follows it, with Unlink', /Right after Coffee/.test(await text('.vac-blinks')) && /Museum right after it/.test(await text('.vac-blinks')) &&
    (await all('.vac-unlink')).length === 2);
ok('and the linked blocks show it', !!(await page.$(W + ' .vac-grid .vac-block.vac-linked[data-id="ld"] .vac-b-link')) && !(await page.$(W + ' .vac-grid .vac-block.vac-linked[data-id="la"]')));
const lpx = +(await page.getAttribute(W + ' .vac-grid', 'data-px'));
let lbox = await box(W + ' .vac-grid .vac-block[data-id="la"] .vac-b-resize');
await page.mouse.move(lbox.x + lbox.width / 2, lbox.y + lbox.height / 2);
await page.mouse.down();
await page.mouse.move(lbox.x + lbox.width / 2, lbox.y + lbox.height / 2 + lpx, { steps: 4 });
await page.mouse.up();
await page.waitForTimeout(120);
L = await lb();
ok('Coffee an hour longer: the drive and the Museum follow', JSON.stringify(L) === JSON.stringify({ la: [600, 720, null], ld: [720, 760, 'la'], lb: [760, 820, 'ld'] }), JSON.stringify(L));
lbox = await box(W + ' .vac-grid .vac-block[data-id="lb"]');
await page.mouse.move(lbox.x + lbox.width / 2, lbox.y + 6);
await page.mouse.down();
await page.mouse.move(lbox.x + lbox.width / 2, lbox.y + 6 + lpx, { steps: 4 });
await page.mouse.up();
await page.waitForTimeout(120);
L = await lb();
ok('the Museum dragged an hour later: the whole chain moves with it', JSON.stringify(L) === JSON.stringify({ la: [660, 780, null], ld: [780, 820, 'la'], lb: [820, 880, 'ld'] }), JSON.stringify(L));
await page.click(W + ' .vac-grid .vac-block[data-id="la"]', { position: { x: 10, y: 8 } });
await page.waitForTimeout(80);
await setVal('.vac-form [data-f="end"]', '12:00');
L = await lb();
ok('Coffee made shorter: what follows moves up, right after it', JSON.stringify(L) === JSON.stringify({ la: [660, 720, null], ld: [720, 760, 'la'], lb: [760, 820, 'ld'] }), JSON.stringify(L));
await page.click(W + ' .vac-grid .vac-block[data-id="ld"]', { position: { x: 10, y: 8 } });
await page.waitForTimeout(80);
await setVal('.vac-form [data-f="start"]', '11:30');
L = await lb();
ok('the drive’s start changed: the chain moves, each as long as it was', JSON.stringify(L) === JSON.stringify({ la: [630, 690, null], ld: [690, 730, 'la'], lb: [730, 790, 'ld'] }), JSON.stringify(L));
// A travel time between the two places of linked blocks: the gap between them.
await page.evaluate(([i, d]) => { const p = vacGetData(i); p.days[d].blocks.push({ id: 'lc', kind: 'food', title: 'Lunch out', start: 820, end: 880, place: { label: 'Diner', address: '3 Pie Road' }, link: 'lb', linkGap: 0 });
    p.travelTimes = { [vacGapKey({ label: 'Museum', address: '1 Art Street' }, { label: 'Diner', address: '3 Pie Road' })]: { min: 15, mode: 'walk' } }; vacSaveData(i, p); }, [id, LD1]);
L = await lb();
ok('linked after a walk set between their places, it starts that long after', L.lc[0] === 805 && L.lc[1] === 865, JSON.stringify(L));
await page.evaluate(([i, d]) => { const p = vacGetData(i); Object.values(p.travelTimes)[0].min = 25; vacSaveData(i, p); }, [id, LD1]);
ok('and follows when the travel time changes', (await lb()).lc[0] === 815);
// The Trip view: dragged across, the chain goes to that day.
await tab('Trip');
const tcol2 = await box(W + ' .vac-tday[data-date="' + LD2 + '"]');
lbox = await box(W + ' .vac-tday .vac-block[data-id="la"]');
await page.mouse.move(lbox.x + lbox.width / 2, lbox.y + 3);
await page.mouse.down();
await page.mouse.move(tcol2.x + tcol2.width / 2, lbox.y + 3, { steps: 6 });
await page.mouse.up();
await page.waitForTimeout(120);
L = await lb(LD2);
ok('in the Trip view, dragged to another day, its chain goes with it, at the same times', JSON.stringify(Object.keys(L).sort()) === JSON.stringify(['la', 'lb', 'lc', 'ld']) &&
    L.la[0] === 630 && L.ld[0] === 690 && L.lb[0] === 730 && L.lc[0] === 815 && !(await day(LD1)).blocks.length, JSON.stringify(L));
// Unlinked, it stays where it is.
await page.evaluate(([i, d]) => { const ui = vacUiOf(i); ui.view = d; ui.sel = 'lb'; vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, [id, LD2]);
await page.click(W + ' .vac-blinks .vac-unlink[data-id="lb"]');
await page.waitForTimeout(100);
L = await lb(LD2);
ok('unlinked, the Museum no longer follows the drive; Lunch still follows it', L.lb[2] === null && L.lc[2] === 'lb');
await page.evaluate(([i, d]) => { const p = vacGetData(i); vacChainMove(p, d, p.days[d].blocks.find(b => b.id === 'la'), 30); vacSaveData(i, p); }, [id, LD2]);
L = await lb(LD2);
ok('so moving Coffee takes the drive, and not the Museum', L.la[0] === 660 && L.ld[0] === 720 && L.lb[0] === 730, JSON.stringify(L));
// At the end of the day, a chain stops, and says so.
await page.evaluate(([i, d]) => { const p = vacGetData(i); p.days[d].blocks = [{ id: 'na', kind: 'activity', title: 'Show', start: 1320, end: 1410 },
    { id: 'nb', kind: 'food', title: 'Late snack', start: 1380, end: 1440, link: 'na', linkGap: 30 }]; vacSaveData(i, p); }, [id, LD2]);
L = await lb(LD2);
ok('a chain that would run past midnight stops at the end of the day', L.nb[0] === 1380 && L.nb[1] === 1440, JSON.stringify(L));
ok('and is a clash', await page.evaluate((i) => vacConflicts(vacGetData(i)).some(w => w.key === 'chainend:nb' && /runs past midnight/.test(w.text)), id));
// Getting there: its blocks linked to each other and the flight.
const jl = await page.evaluate(([i, d]) => {
    const p = vacGetData(i);
    p.home = { label: '', address: '5 Home Street, Hometown' };
    p.days[d].blocks = [{ id: 'jf', kind: 'flight', title: '', start: 900, end: 1080, flight: { number: 'EX 9', from: 'AAA', to: 'BBB', arrive: 1080, arriveDay: 0 } }];
    p.journeys = { out: { flight: 'jf', driveMin: 45 } };
    vacJourneyApplyTo(p, 'out'); vacSaveData(i, p);
    const by = (leg) => p.days[d].blocks.find(b => b.leg === 'out:' + leg);
    const out = { drive: by('drive'), airport: by('airport'), flight: p.days[d].blocks.find(b => b.id === 'jf') };
    const r = [out.airport.link === out.drive.id, out.flight.link === out.airport.id, out.drive.start, out.airport.start];
    vacChainMove(p, d, out.flight, 60); vacSaveData(i, p);
    const q = vacGetData(i), by2 = (leg) => q.days[d].blocks.find(b => b.leg === 'out:' + leg);
    r.push(by2('drive').start, by2('airport').start, !vacLegEdited(by2('drive'), d));
    vacChainMove(q, d, by2('drive'), -30); vacSaveData(i, q);
    const z = vacGetData(i), by3 = (leg) => z.days[d].blocks.find(b => b.leg === 'out:' + leg), fl = z.days[d].blocks.find(b => b.id === 'jf');
    r.push(by3('drive').start, by3('airport').start, fl.start, fl.linkGap);
    return r;
}, [id, LD2]);
ok('getting there: its steps linked to each other and to the flight', jl[0] === true && jl[1] === true, JSON.stringify(jl));
ok('the flight moved, its journey moves too, still the planner’s', jl[4] === jl[2] + 60 && jl[5] === jl[3] + 60 && jl[6] === true, JSON.stringify(jl));
ok('a step moved: the steps before the flight move, the flight does not', jl[7] === jl[4] - 30 && jl[8] === jl[5] - 30 && jl[9] === 960 && jl[10] === 30, JSON.stringify(jl));
await page.evaluate(([i, p]) => { vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, [id, kept7]);

// 10zb. The hours shown: each end chosen; past midnight, the next day's first hours; markers for blocks outside.
const kept8 = await plan();
const HD1 = '2035-08-03', HD2 = '2035-08-04';
await page.evaluate(([i, d1, d2]) => {
    const p = vacDefaultPlan();
    Object.assign(p, { name: 'Hours Trip', start: d1, end: d2 });
    vacEnsureDays(p);
    p.days[d1].blocks = [{ id: 'hs', kind: 'activity', title: 'Early swim', start: 420, end: 470 },
        { id: 'hm', kind: 'activity', title: 'Museum', start: 600, end: 700 },
        { id: 'hl', kind: 'activity', title: 'Late show', start: 1330, end: 1400 }];
    p.days[d2].blocks = [{ id: 'hn', kind: 'activity', title: 'Night tour', start: 30, end: 60 }, { id: 'hb', kind: 'food', title: 'Brunch', start: 660, end: 720 }];
    vacSaveData(i, p); vacUi.delete(i);
    const ui = vacUiOf(i); ui.view = d1;
    vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget'));
}, [id, HD1, HD2]);
ok('the hours are Auto to start with: stretched to take in every block', await page.inputValue(W + ' .vac-day .vac-hours-from') === '' && await page.inputValue(W + ' .vac-day .vac-hours-to') === '' &&
    await page.getAttribute(W + ' .vac-grid', 'data-h0') === '6' && await page.getAttribute(W + ' .vac-grid', 'data-h1') === '24' && !(await page.$(W + ' .vac-edge')));
await setVal('.vac-day .vac-hours-from', '8');
await setVal('.vac-day .vac-hours-to', '25');
ok('chosen: 8 AM to 1 AM, kept for the trip', JSON.stringify((await plan()).showHours) === JSON.stringify([8, 25]) &&
    await page.getAttribute(W + ' .vac-grid', 'data-h0') === '8' && await page.getAttribute(W + ' .vac-grid', 'data-h1') === '25');
ok('a block before the hours is a marker on the top edge, not drawn', /^▲ Early swim 7:00\sAM$/.test((await text('.vac-grid .vac-edge-top')).trim()) &&
    !(await page.$(W + ' .vac-grid .vac-block[data-id="hs"]')), await text('.vac-grid .vac-edge-top'));
ok('midnight is a line named for the next day', /Sat, Aug 4/.test(await text('.vac-grid .vac-hour.vac-midnight')), await text('.vac-grid .vac-hour.vac-midnight'));
const hpx = +(await page.getAttribute(W + ' .vac-grid', 'data-px'));
const nTop = await page.evaluate((s) => parseFloat(document.querySelector(s).style.top), W + ' .vac-grid .vac-block.vac-nextday[data-id="hn"]');
ok('past midnight, the next day’s blocks, where they fall', Math.abs(nTop - (1470 - 480) * hpx / 60) < 0.5 &&
    await page.getAttribute(W + ' .vac-grid .vac-block[data-id="hn"]', 'data-date') === HD2 && !(await page.$(W + ' .vac-grid .vac-block[data-id="hb"]')));
let hbx = await box(W + ' .vac-grid .vac-block[data-id="hn"]');
await page.mouse.move(hbx.x + hbx.width / 2, hbx.y + 4);
await page.mouse.down();
await page.mouse.move(hbx.x + hbx.width / 2, hbx.y + 4 + hpx / 4, { steps: 3 });
await page.mouse.up();
await page.waitForTimeout(120);
ok('dragged there, it moves on its own day', JSON.stringify((await day(HD2)).blocks.filter(b => b.id === 'hn').map(b => [b.start, b.end])) === JSON.stringify([[45, 75]]));
const gbx = await box(W + ' .vac-grid');
await page.mouse.click(gbx.x + 60, gbx.y + (1440 - 480) * hpx / 60 + 3);
await page.waitForTimeout(120);
const made = (await day(HD2)).blocks.filter(b => !['hn', 'hb'].includes(b.id)).map(b => [b.start, b.end]);
ok('clicked past midnight, a block is made on the next day, at its time', JSON.stringify(made) === JSON.stringify([[0, 60]]) && !(await day(HD1)).blocks.some(b => b.start >= 1440), JSON.stringify(made));
await page.click(W + ' .vac-grid .vac-edge-top');
await page.waitForTimeout(80);
ok('the marker clicked chooses its block', await page.getAttribute(W + ' .vac-side .vac-form', 'data-id') === 'hs');
await setVal('.vac-day .vac-hours-to', '22');
ok('a block after the hours is a marker on the bottom edge', /^▼ Late show 10:10\sPM$/.test((await text('.vac-grid .vac-edge-bottom')).trim()) && !(await page.$(W + ' .vac-grid .vac-nextday')),
    await text('.vac-grid .vac-edge-bottom'));
// The Trip view: the same hours, the markers counted.
await setVal('.vac-day .vac-hours-to', '25');
await tab('Trip');
ok('the Trip view has the same choice, and the hours', await page.inputValue(W + ' .vac-trip-bar .vac-hours-from') === '8' &&
    (await text('.vac-tday[data-date="' + HD1 + '"] .vac-edge-top')) === '▲1' && !!(await page.$(W + ' .vac-tday[data-date="' + HD1 + '"] .vac-block.vac-nextday[data-id="hn"]')));
await page.click(W + ' .vac-tday[data-date="' + HD1 + '"] .vac-block[data-id="hn"]', { position: { x: 5, y: 2 } });
await page.waitForTimeout(120);
ok('a block past midnight clicked opens the night it falls in, chosen', (await text('.vac-tab.vac-on')).includes('Aug 3') && await page.getAttribute(W + ' .vac-side .vac-form', 'data-id') === 'hn');
await setVal('.vac-day .vac-hours-from', '');
await setVal('.vac-day .vac-hours-to', '');
ok('both Auto again: as before', (await plan()).showHours === undefined && await page.getAttribute(W + ' .vac-grid', 'data-h0') === '6');
await page.evaluate(([i, p]) => { vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, [id, kept8]);

// 10zc. A short block's text runs on into the free time under it, never over the next block.
const kept9 = await plan();
await page.evaluate((i) => {
    const p = vacDefaultPlan();
    Object.assign(p, { name: 'Spill Trip', start: '2036-02-02', end: '2036-02-02' });
    vacEnsureDays(p);
    p.days['2036-02-02'].blocks = [{ id: 'sa', kind: 'food', title: 'Coffee', start: 480, end: 495, place: { label: 'Cafe', address: '2 Bean Lane' } },
        { id: 'sc', kind: 'travel', title: 'Return the rental car', start: 720, end: 735 }, { id: 'sd', kind: 'travel', title: 'Shuttle', start: 735, end: 760 }];
    vacSaveData(i, p); vacUi.delete(i); const ui = vacUiOf(i); ui.view = '2036-02-02';
    vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget'));
}, id);
const sp = (sid, s2) => page.evaluate(([s, b]) => { const e = document.querySelector(s + ' .vac-block[data-id="' + b + '"]');
    return e && [e.classList.contains('vac-spill'), e.classList.contains('vac-short'), e.style.getPropertyValue('--vac-spill'), e.querySelector('.vac-b-place') ? getComputedStyle(e.querySelector('.vac-b-place')).display : null]; }, [s2 || W + ' .vac-grid', sid]);
let spa = await sp('sa');
ok('with free time under it, a short block shows all its text, running on below', spa[0] && !spa[1] && /^\d+px$/.test(spa[2]) && spa[3] !== 'none', JSON.stringify(spa));
spa = await sp('sc');
ok('right against the next block, it stays one line, within itself', !spa[0] && spa[1], JSON.stringify(spa));
await page.evaluate((i) => { const p = vacGetData(i); p.days['2036-02-02'].blocks.push({ id: 'sb', kind: 'activity', title: 'Next', start: 510, end: 540 }); vacSaveData(i, p);
    vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, id);
const pxS = +(await page.getAttribute(W + ' .vac-grid', 'data-px'));
spa = await sp('sa');
ok('without room for all of it, one line, and never past where the next block starts', spa[0] && spa[1] &&
    Math.abs(parseFloat(spa[2]) - (Math.min(30 * pxS / 60, 16) - Math.max(15 * pxS / 60, 14))) <= 1, JSON.stringify([spa, pxS]));
await tab('Trip');
spa = await sp('sa', W + ' .vac-tday');
ok('in the Trip view too', spa[0], JSON.stringify(spa));
await page.evaluate(([i, p]) => { vacSaveData(i, p); vacUi.delete(i); vacRender(document.querySelector('.tool[data-tool="' + i + '"] .vac-widget')); }, [id, kept9]);

// 11. Narrow, the panel goes under the day.
await tab('Fri, Jul 9');
await page.evaluate((i) => { const t = document.querySelector('.tool[data-tool="' + i + '"]'); t.style.width = '480px'; }, id);
await page.waitForTimeout(150);
const mainBox = await box(W + ' .vac-main'), sideBox = await box(W + ' .vac-side');
ok('narrow, the panel sits under the day', sideBox.y >= mainBox.y + mainBox.height - 1, JSON.stringify([mainBox, sideBox]));

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 400));
console.log('  (all ' + count + ' assertions reached)');
await browser.close();
