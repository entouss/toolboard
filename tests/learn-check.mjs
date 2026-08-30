// The guide pages, and the links out of them.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];

for (const [path, name] of [['/learn/index.html', 'hub'], ['/learn/tools/curriculum-explorer.html', 'guide']]) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    page.on('pageerror', e => errors.push(name + ': ' + e.message));
    page.on('response', r => { if (r.status() >= 400) errors.push(name + ': ' + r.status() + ' ' + r.url()); });
    await page.goto('http://localhost:8777' + path);
    await page.waitForTimeout(1200);

    ok(name + ': the page renders', (await page.title()).length > 0, await page.title());
    ok(name + ': the stylesheet applied', await page.evaluate(() =>
        getComputedStyle(document.querySelector('.site-header')).backgroundColor !== 'rgba(0, 0, 0, 0)'),
        await page.evaluate(() => getComputedStyle(document.querySelector('.site-header')).backgroundColor));
    ok(name + ': it does not scroll sideways', await page.evaluate(() =>
        document.documentElement.scrollWidth <= window.innerWidth + 1),
        await page.evaluate(() => document.documentElement.scrollWidth + ' vs ' + window.innerWidth));

    // Every local link and image must resolve.
    const links = await page.evaluate(() => Array.from(document.querySelectorAll('a[href], img[src], source[src], video[poster]'))
        .flatMap(e => [e.getAttribute('href'), e.getAttribute('src'), e.getAttribute('poster')])
        .filter(h => h && !/^https?:|^#|^mailto:/.test(h)));
    const bad = [];
    for (const href of links) {
        const url = new URL(href.split('#')[0], 'http://localhost:8777' + path);
        if (!url.pathname || url.pathname.endsWith('/')) continue;
        const r = await page.request.get(url.href);
        if (!r.ok()) bad.push(href + ' -> ' + r.status());
    }
    ok(name + ': every local link and image resolves', bad.length === 0, JSON.stringify(bad));

    // Narrow.
    if (name === 'guide') {
        // Every catalog the page offers must load in the tool, not merely resolve.
        // A catalog card is one you can download the file from; other cards on the
        // page link to a catalog too, to open a tool on an example.
        const cards = await page.evaluate(() => Array.from(document.querySelectorAll('.card'))
            .filter(c => c.querySelector('a[href^="../data/"]'))
            .map(c => ({
                name: c.querySelector('.card-head').childNodes[0].textContent.trim(),
                open: c.querySelector('a[href*="?curriculum="]').getAttribute('href'),
                dl: c.querySelector('a[href^="../data/"]').getAttribute('href')
            })));
        ok(name + ': four catalogs are offered', cards.length === 4,
            JSON.stringify(cards.map(c => c.name)));
        for (const card of cards) {
            const url = new URL(card.open.split('?curriculum=')[1], 'http://localhost:8777');
            const r = await page.request.get(url.href);
            const body = r.ok() ? await r.json() : null;
            ok(name + ': ' + card.name + ' loads (' + (body ? body.courses.length : '?') + ' entries)',
                !!body && Array.isArray(body.courses) && body.courses.length > 0,
                r.status() + ' ' + url.pathname);
        }
    }

    if (name === 'guide') {
        const v = await page.evaluate(() => {
            const el = document.querySelector('figure video');
            if (!el) return null;
            const b = el.getBoundingClientRect();
            return { poster: !!el.getAttribute('poster'), preload: el.preload,
                controls: el.controls, wide: Math.round(b.width), tall: Math.round(b.height) };
        });
        ok(name + ': the walkthrough is on the page', v && v.controls && v.poster, JSON.stringify(v));
        ok(name + ': and does not fetch seven megabytes before you ask', v.preload === 'none', v.preload);
        ok(name + ': laid out at the column width', v.wide > 700 && v.tall > 300, JSON.stringify(v));
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    ok(name + ': and it holds up on a phone', await page.evaluate(() =>
        document.documentElement.scrollWidth <= window.innerWidth + 1),
        await page.evaluate(() => document.documentElement.scrollWidth + ' vs ' + window.innerWidth));
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: OUT + '/learn-' + name + '.png', fullPage: true });
    await page.close();
}

// The "try it" link, followed from the guide, with nothing installed.
const page = await browser.newPage({ viewport: { width: 1300, height: 850 } });
page.on('pageerror', e => errors.push('app: ' + e.message));
await page.goto('http://localhost:8777/learn/tools/curriculum-explorer.html');
await page.click('.hero .btn.primary');
await page.waitForTimeout(7000);
const state = await page.evaluate(() => ({
    url: location.href,
    courses: document.querySelectorAll('.curr-course').length,
    school: document.querySelector('.curr-widget') ?
        ((currGetData(document.querySelector('.curr-widget').closest('.tool').getAttribute('data-tool')).catalog || {}).school || {}).name : null
}));
ok('following "Try it" lands in a loaded tool', state.courses === 280 && state.school === 'Westhaven High School',
    JSON.stringify(state));
ok('no errors anywhere', errors.length === 0, JSON.stringify(errors).slice(0, 300));
await browser.close();
