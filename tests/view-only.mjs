// A "/view" link: the tool on its own, with nothing on the page that leaves it.
import { chromium } from 'playwright';
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

const shown = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && el.offsetHeight > 0;
}, sel);

await page.goto('http://localhost:8777/index.html#tool/qr-code-generator/view');
await page.waitForTimeout(6000);

ok('the link opens the tool', await page.evaluate(() => !!document.querySelector('.qr-widget')),
    JSON.stringify(errors).slice(0, 120));
ok('the page is in view-only', await page.evaluate(() => document.body.classList.contains('view-only')));

// Every piece of chrome, including the collapse chevron that floats above a
// maximized tool and would otherwise bring the header back.
ok('the app header is hidden', !(await shown('#mainHeader')));
ok('the header collapse chevron is hidden', !(await shown('#headerCollapseBtn')));
ok("the tool's own header is hidden", !(await shown('.tool.fullscreen .tool-header')));

const box = await page.evaluate(() => {
    const t = document.querySelector('.tool.fullscreen');
    const r = t.getBoundingClientRect();
    return { top: r.top, height: r.height, inner: window.innerHeight };
});
ok('the tool starts at the top of the window', box.top === 0, 'top ' + box.top);
ok('and fills its height', Math.abs(box.height - box.inner) < 2, box.height + ' of ' + box.inner);

// Nothing on the page is a way out.
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
ok('Escape does not leave the view',
    await page.evaluate(() => !!document.querySelector('.tool.fullscreen') && document.body.classList.contains('view-only')));

await page.evaluate(() => document.getElementById('fullscreenBackdrop').click());
await page.waitForTimeout(300);
ok('clicking the backdrop does not leave the view',
    await page.evaluate(() => !!document.querySelector('.tool.fullscreen') && document.body.classList.contains('view-only')));

await page.keyboard.press('Control+k');
await page.waitForTimeout(300);
ok('the tool search cannot be opened', !(await shown('#toolSearchOverlay')));

// The URL is the visitor's: nothing may rewrite it out from under them.
ok('the hash still asks for the view', /\/view$/.test(await page.evaluate(() => location.hash)),
    await page.evaluate(() => location.hash));

// And the visitor's own board is untouched by having followed the link.
ok('the tool was not recorded as maximized',
    await page.evaluate(() => {
        const tc = loadToolCustomizations();
        return !Object.values(tc).some(c => c && c.fullscreen);
    }));

// Dropping the segment is the way out, and gives back a normally maximized tool.
await page.evaluate(() => { location.hash = '#tool/qr-code-generator'; });
await page.waitForTimeout(1500);
ok('dropping "/view" leaves the mode', await page.evaluate(() => !document.body.classList.contains('view-only')));
ok('and brings the chrome back', await shown('#mainHeader') && await shown('.tool.fullscreen .tool-header'));
ok('with the tool still maximized', await page.evaluate(() => !!document.querySelector('.tool.fullscreen')));

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 200));

// The mobile rules size the maximized tool by hand rather than from
// --header-height, so they have to be told about the mode separately.
const phone = await browser.newPage({ viewport: { width: 390, height: 780 } });
await phone.goto('http://localhost:8777/index.html#tool/qr-code-generator/view');
await phone.waitForTimeout(6000);
const onPhone = await phone.evaluate(() => {
    const t = document.querySelector('.tool.fullscreen');
    const r = t.getBoundingClientRect();
    return {
        mobile: document.getElementById('toolboard').classList.contains('mobile-layout'),
        top: r.top, height: r.height, inner: window.innerHeight
    };
});
ok('the mobile layout is the one under test', onPhone.mobile);
ok('no header gap above the tool on a phone', onPhone.top === 0, 'top ' + onPhone.top);
ok('and it fills the phone screen', Math.abs(onPhone.height - onPhone.inner) < 2,
    onPhone.height + ' of ' + onPhone.inner);

await browser.close();
