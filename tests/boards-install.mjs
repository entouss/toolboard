// A board template names tools. Some of them come from plugins this browser has
// never installed, and until now those were dropped with a console warning and no
// board to show for it.
import { open, ok, finish, useTemplate, boardState, BOARD_FILES, OUT } from './boards-lib.mjs';
const { browser, page, errors, warnings } = await open();

const boards = await page.evaluate(() => PluginRegistry.getAllBoards().map((b) => ({
    id: b.id, name: b.name, tools: b.tools.length,
    kinds: [...new Set(b.tools.map((t) => t.toolId))]
})));
ok('every board plugin registered a template', boards.length === BOARD_FILES.length,
    boards.length + ' of ' + BOARD_FILES.length);

for (const board of boards) {
    await useTemplate(page, board.id);
    const state = await boardState(page);
    ok(board.id + ': every tool the template names is on the board',
        state.tools.length === board.tools, state.tools.length + ' of ' + board.tools);
    ok(board.id + ': and every one of them rendered',
        state.rendered === board.tools, state.rendered + ' of ' + board.tools);
    ok(board.id + ': under the template’s own name', state.name === board.name, state.name);
    const missing = board.kinds.filter((k) => !state.tools.some((t) =>
        (state.customizations[t] || {}).templateId === k));
    ok(board.id + ': no kind of tool was skipped', missing.length === 0, missing.join(', '));
}

ok('nothing was warned about a tool that could not be found',
    !warnings.some((w) => /Tool not found for template/.test(w)),
    warnings.filter((w) => /Tool not found/.test(w)).join(' | '));

// The plugins a template pulled in have to still be there next time.
const installed = (await boardState(page)).installed;
const needed = await page.evaluate(() => {
    const index = JSON.parse(localStorage.getItem('toolboard_toolPluginIndex') || '{}');
    return [...new Set(PluginRegistry.getAllBoards()
        .flatMap((b) => b.tools.map((t) => index[t.toolId]))
        // The always-loaded plugins are deliberately never added to the installed
        // list, so they are not evidence either way.
        .filter((u) => u && !PluginLoader.DEFAULT_URLS.includes(u)))];
});
const absent = needed.filter((u) => !installed.includes(u));
ok('the plugins they came from are installed, not merely loaded',
    absent.length === 0, absent.join(', '));

await page.reload();
await page.waitForSelector('.tool', { timeout: 15000 });
await page.waitForTimeout(1500);
const after = await boardState(page);
ok('so the board is still whole after a reload', after.rendered === after.tools.length,
    after.rendered + ' of ' + after.tools.length);

await page.screenshot({ path: OUT + '/boards-install.png' });
await finish(browser, errors);
