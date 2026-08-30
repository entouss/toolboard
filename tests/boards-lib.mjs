// Shared setup for the board-template suites.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const OUT = path.join(HERE, 'out');
export const REPO = path.join(HERE, '..');

export const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));

// Every board template plugin in the repo, so a suite covers whatever is there
// rather than a list that goes stale.
export const BOARD_FILES = fs.readdirSync(path.join(REPO, 'plugins', 'boards'))
    .filter((f) => f.endsWith('.js')).sort()
    .map((f) => 'plugins/boards/' + f);

// A browser holding only what a first-time visitor has: core-tools, and whichever
// board plugins are installed. Nothing else — the point is that a template pulls
// in the plugins its tools need.
const seed = ({ urls }) => {
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('toolboard_pluginUrls', JSON.stringify(urls));
    localStorage.setItem('financeCurrentBoard', 'default');
};

export async function open({ urls = BOARD_FILES, viewport = { width: 1500, height: 950 } } = {}) {
    const browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport });
    const errors = [];
    const warnings = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
        if (m.type() === 'warning') warnings.push(m.text());
    });
    await page.addInitScript(seed, { urls });
    await page.goto('http://localhost:8777/index.html');
    await page.waitForSelector('#toolboard', { timeout: 15000 });
    await page.waitForTimeout(1200);
    return { browser, page, errors, warnings };
}

// Set a board up the way the button does, and wait for it.
export async function useTemplate(page, boardId) {
    await page.evaluate((id) => instantiateBoardTemplate(id), boardId);
    await page.waitForTimeout(1500);
}

export const boardState = (page) => page.evaluate(() => ({
    name: getBoardName(currentBoardId),
    tools: customTools.slice(),
    rendered: document.querySelectorAll('.tool').length,
    customizations: JSON.parse(JSON.stringify(toolCustomizations)),
    positions: JSON.parse(JSON.stringify(positions)),
    installed: JSON.parse(localStorage.getItem('toolboard_pluginUrls') || '[]')
}));

export const finish = async (browser, errors) => {
    console.log('  page errors:', errors.length ? errors.join(' | ') : 'none');
    await browser.close();
};
