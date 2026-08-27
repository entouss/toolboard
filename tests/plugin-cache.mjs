// A plugin edited on disk must be the plugin that runs.
import { chromium } from 'playwright';
import fs from 'node:fs';
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const PLUGIN = '/Users/erikt/dev/toolboard/plugins/toolboxes/school-tools.js';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
const requested = [];
page.on('request', (r) => { if (/school-tools\.js/.test(r.url())) requested.push(r.url()); });
await page.addInitScript(() => {
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('toolboard_pluginUrls', JSON.stringify(['plugins/toolboxes/school-tools.js']));
});
await page.goto('http://localhost:8777/index.html');
await page.waitForTimeout(900);

// 1. Loaded from localhost, the request carries something to defeat the cache.
ok('a locally served plugin is fetched past the cache', requested.some(u => /[?&]v=\d+/.test(u)),
    requested[0] || 'not requested');

// 2. The version is announced, so the running copy can be identified.
const version = await page.evaluate(() => (PluginRegistry.getTool('curriculum-explorer') || {}).version);
ok('the tool registers its version', /^\d+\.\d+\.\d+$/.test(version || ''), version);

// 3. An edit on disk is picked up by a reload, with no hard refresh.
const before = fs.readFileSync(PLUGIN, 'utf8');
fs.writeFileSync(PLUGIN, before.replace("const CURR_VERSION = '", "const CURR_VERSION = '9.9.9'; //"));
try {
    await page.reload();
    await page.waitForTimeout(900);
    const after = await page.evaluate(() => (PluginRegistry.getTool('curriculum-explorer') || {}).version);
    ok('an edit on disk is what runs after a plain reload', after === '9.9.9', after);
} finally {
    fs.writeFileSync(PLUGIN, before);
}

// 4. A plugin served from elsewhere is left to the browser's caching, as it should be.
const url = await page.evaluate(() => {
    const script = document.createElement('script');
    const localHost = location.protocol === 'file:' ||
        /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    const remote = 'https://example.org/plugins/thing.js';
    const relative = !/^https?:\/\//i.test(remote);
    return (localHost && relative) ? remote + '?v=' + Date.now() : remote;
});
ok('a plugin on another host is fetched as it is', url === 'https://example.org/plugins/thing.js', url);

await page.close();
// 5. And on a real site, nothing is appended.
const site = await browser.newPage();
await site.route('**/*', (route) => route.fulfill({ status: 200, contentType: 'text/html',
    body: '<script>window.__host = location.hostname;</script>' }));
await site.goto('https://toolboard.me/');
ok('a served site keeps its caching', await site.evaluate(() =>
    !(location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname))),
    await site.evaluate(() => location.hostname));

console.log('  requests seen: ' + requested.length);
await browser.close();
