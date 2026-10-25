// Chess challenges: a position, a goal, the moves. Every challenge is checked for
// being what it says it is — a legal position, legal moves, a mate that is mate, an
// only move that is the only one — and then played through the board by clicking.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const seed = () => {
    if (localStorage.getItem('seeded')) return;
    localStorage.setItem('seeded', '1');
    localStorage.setItem('toolboard_pluginUrls', JSON.stringify(['plugins/toolboxes/game-tools.js']));
    localStorage.setItem('financeCurrentBoard', 'default');
    localStorage.setItem('finance_default_customTools', JSON.stringify(['ch']));
    localStorage.setItem('finance_default_toolCustomizations', JSON.stringify({ ch: { templateId: 'chess', title: 'Chess' } }));
    localStorage.setItem('finance_default_positions', JSON.stringify({ ch: { x: 20, y: 20, z: 5, width: 760, height: 560 } }));
};
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 820 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(seed);
await page.goto('http://localhost:8777/index.html');
await page.waitForSelector('.tool[data-tool="ch"] .chess-canvas', { timeout: 15000 });
await page.waitForTimeout(600);

// 1. Every challenge is sound.
const audit = await page.evaluate(() => CHESS_CHALLENGES.map(ch => {
    const enemy = (c) => c === 'w' ? 'b' : 'w';
    const same = (a, b) => a.fr === b.fr && a.fc === b.fc && a.tr === b.tr && a.tc === b.tc;
    const start = chessFromFen(ch.fen);
    let { board, castling, ep, turn } = start;
    const r = { id: ch.id, type: ch.type, problems: [], steps: [] };
    if (!chessFindKing(board, 'w') || !chessFindKing(board, 'b')) r.problems.push('a king is missing');
    if (chessIsInCheck(board, enemy(turn))) r.problems.push('the side not to move is in check');
    r.startInCheck = chessIsInCheck(board, turn);
    r.firstLegal = chessAllLegalMoves(board, turn, castling, ep).length;
    r.mateInOneExists = chessAllLegalMoves(board, turn, castling, ep)
        .some(m => chessMoveForcesMate(board, castling, ep, turn, m, 1));
    if (ch.stalemate) {
        const trap = chessApplyMove(board, castling, chessParseMove(ch.stalemate));
        r.trapStalemates = chessIsStalemate(trap.board, enemy(turn), trap.ep);
    }
    ch.moves.forEach((name, i) => {
        const m = chessParseMove(name);
        const legal = chessAllLegalMoves(board, turn, castling, ep);
        if (!legal.some(x => same(x, m))) r.problems.push('not legal: ' + name);
        const a = chessApplyMove(board, castling, m);
        r.steps.push({ name, castle: a.castle, enPassant: a.enPassant, captured: a.captured, replies: i % 2 ? legal.length : null,
            check: chessIsInCheck(a.board, enemy(turn)) });
        if (ch.type === 'mate' && i % 2 === 0 &&
            !chessMoveForcesMate(board, castling, ep, turn, m, Math.ceil((ch.moves.length - i) / 2))) r.problems.push(name + ' does not force mate');
        board = a.board; castling = a.castling; ep = a.ep; turn = enemy(turn);
    });
    r.mateAtEnd = chessIsCheckmate(board, turn, ep);
    r.endBoard = board;
    r.ids = CHESS_CHALLENGES.filter(c => c.id === ch.id).length;
    return r;
}));
const byId = Object.fromEntries(audit.map(a => [a.id, a]));
ok('there are nineteen challenges, each with its own id', audit.length === 19 && audit.every(a => a.ids === 1), audit.length);
ok('every position is legal and every move in it is', audit.every(a => !a.problems.length),
    JSON.stringify(audit.filter(a => a.problems.length).map(a => [a.id, a.problems])));
ok('every mate challenge ends in mate, and its moves force it', audit.filter(a => a.type === 'mate').every(a => a.mateAtEnd));
ok('no mate in 2 has a mate in 1 to skip it', audit.filter(a => a.type === 'mate' && a.steps.length > 1).every(a => !a.mateInOneExists),
    JSON.stringify(audit.filter(a => a.type === 'mate' && a.steps.length > 1 && a.mateInOneExists).map(a => a.id)));
ok('the stalemate a challenge warns of is stalemate', audit.filter(a => 'trapStalemates' in a).length === 2 &&
    audit.filter(a => 'trapStalemates' in a).every(a => a.trapStalemates));
ok('promoting with mate mates as it promotes', byId['end-promote-mate'].endBoard[0][4] === 'wQ' && byId['end-promote-mate'].mateAtEnd);
ok('the breakthrough ends with a white queen, the pawns sacrificed for it',
    byId['end-breakthrough'].endBoard[0][0] === 'wQ' && byId['end-breakthrough'].steps[1].captured === 'wP' && byId['end-breakthrough'].steps[3].captured === 'wP');
ok('the en passant challenges are taken en passant', ['ep-take', 'ep-escape', 'ep-check'].every(id => byId[id].steps[0].enPassant));
ok('“the only way out of check” starts in check, with exactly one legal move',
    byId['ep-escape'].startInCheck && byId['ep-escape'].firstLegal === 1, JSON.stringify(byId['ep-escape']));
ok('“with check” gives check', byId['ep-check'].steps[0].check);
ok('the castling challenges castle, the way they say', byId['castle-king'].steps[0].castle === 'K' &&
    byId['castle-queen'].steps[0].castle === 'Q' && byId['castle-where-you-can'].steps[0].castle === 'Q');
ok('and “castle where you can” cannot castle the other way', await page.evaluate(() => {
    const p = chessFromFen(chessFindChallenge('castle-where-you-can').fen);
    return !chessGetValidMoves(p.board, 7, 4, 'w', p.castling, p.ep).some(m => m.col === 6);
}));
ok('the fork wins the queen, after the only reply there is', byId['fork-queen'].steps[0].check &&
    byId['fork-queen'].steps[1].replies === 1 && byId['fork-queen'].steps[2].captured === 'bQ');
ok('the skewer wins the rook', byId['skewer-rook'].steps[0].check && byId['skewer-rook'].steps[2].captured === 'bR');

// 2. In the tool.
const W = '.tool[data-tool="ch"] .chess-widget';
const click = async (name) => {
    const box = await page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; }, W + ' .chess-canvas');
    const sq = box.w / 8;
    await page.mouse.click(box.x + (name.charCodeAt(0) - 97) * sq + sq / 2, box.y + (8 - Number(name[1])) * sq + sq / 2);
    await page.waitForTimeout(40);
};
const move = async (m) => { await click(m.slice(0, 2)); await click(m.slice(2, 4)); };
const st = () => page.evaluate((s) => {
    const x = _chessState.get(document.querySelector(s));
    return { board: x.board, turn: x.turn, history: x.moveHistory.slice(), challenge: x.challenge && Object.assign({}, x.challenge),
        solved: (x.solvedChallenges || []).slice(), hint: x.hint, capturedBlack: x.capturedBlack.slice(), mode: x.aiMode };
}, W);
const panel = () => page.evaluate((s) => {
    const w = document.querySelector(s);
    const vis = (sel) => { const el = w.querySelector(sel); return !!el && getComputedStyle(el).display !== 'none'; };
    return { shown: vis('.chess-challenge-panel'), goal: w.querySelector('.chess-challenge-goal').textContent,
        message: w.querySelector('.chess-challenge-message').textContent, count: w.querySelector('.chess-challenge-count').textContent,
        picked: w.querySelector('.chess-challenge-select').value,
        options: Array.from(w.querySelectorAll('.chess-challenge-select option')).map(o => o.textContent),
        groups: Array.from(w.querySelectorAll('.chess-challenge-select optgroup')).map(g => g.label),
        undo: vis('.chess-undo-btn'), newGame: vis('.chess-new-btn'), captured: vis('.chess-captured'),
        turn: w.querySelector('.chess-turn').textContent };
}, W);
const fenBoard = (fen) => page.evaluate((f) => chessFromFen(f).board, fen);
const fenOf = (id) => page.evaluate((i) => chessFindChallenge(i).fen, id);

await page.selectOption(W + ' .chess-mode-select', 'challenge');
await page.waitForTimeout(200);
let p = await panel();
ok('Challenges is a mode, and opens the first one', p.shown && p.picked === 'ep-take', JSON.stringify(p));
ok('the board is that challenge’s position', JSON.stringify((await st()).board) === JSON.stringify(await fenBoard(await fenOf('ep-take'))));
ok('it says what to do, and how far along you are', /Take it en passant/.test(p.goal) && p.count === '0 of 19 solved' &&
    p.turn === 'Challenge · White to play');
ok('the list is grouped', JSON.stringify(p.groups) === JSON.stringify(['Rules', 'Checkmates', 'Tactics', 'Endgames']));
ok('a game’s own buttons and captures make way for it', !p.undo && !p.newGame && !p.captured);

await move('e1e2');
await page.waitForTimeout(100);
ok('a wrong move is shown, and said to be wrong', (await panel()).message === 'Not quite. Try again.' && (await st()).history.length === 1);
await page.waitForTimeout(800);
let s = await st();
ok('and then taken back', s.history.length === 0 && s.turn === 'w' &&
    JSON.stringify(s.board) === JSON.stringify(await fenBoard(await fenOf('ep-take'))));

await page.click(W + ' .chess-challenge-hint-btn');
await page.waitForTimeout(100);
ok('Hint marks the piece to move', JSON.stringify((await st()).hint) === JSON.stringify({ row: 3, col: 4 }) &&
    (await panel()).message === 'Move the highlighted piece.');
await move('e5d6');
await page.waitForTimeout(150);
s = await st();
p = await panel();
ok('the right move solves it', s.challenge.status === 'solved' && p.message === 'Solved ✓' && s.history[0] === 'exd6', JSON.stringify(s.history));
ok('and it is ticked in the list, and counted', p.options[0].startsWith('✓ ') && p.count === '1 of 19 solved');
await move('d6d7');
ok('a solved challenge takes no more moves', (await st()).history.length === 1);

await page.click(W + ' .chess-challenge-buttons button:nth-child(3)');
await page.waitForTimeout(150);
ok('Next goes on to the next', (await panel()).picked === 'ep-escape' && (await st()).history.length === 0);
await move('e5d6');
await page.waitForTimeout(150);
ok('the only way out of check is the only move that solves it', (await st()).challenge.status === 'solved');

// A challenge with replies: the scripted one is played after the right move.
await page.selectOption(W + ' .chess-challenge-select', 'fork-queen');
await page.waitForTimeout(150);
await move('e5f7');
await page.waitForTimeout(100);
ok('a right move that is not the last says so, and waits for the reply', (await panel()).message === 'Right.' && (await st()).turn === 'b');
await page.waitForTimeout(600);
s = await st();
ok('the reply comes by itself', s.history.join(' ') === 'Nf7+ Kg8' && s.turn === 'w', s.history.join(' '));
await move('f7d8');
await page.waitForTimeout(150);
s = await st();
ok('and the last right move wins what it set out to', s.challenge.status === 'solved' && s.capturedBlack.includes('bQ'));

// Mate challenges take any mate.
await page.selectOption(W + ' .chess-challenge-select', 'mate-back-rank');
await page.waitForTimeout(150);
await move('d1d7');
await page.waitForTimeout(100);
ok('a move that is not mate is not the answer to a mate', (await panel()).message === 'Not quite. Try again.');
await page.waitForTimeout(800);
await page.selectOption(W + ' .chess-challenge-select', 'mate-in-two');
await page.waitForTimeout(150);
await move('b1b7');
await page.waitForTimeout(100);
ok('mate in 2 another way round is right too', (await panel()).message === 'Right.');
await page.waitForTimeout(600);
const mating = await page.evaluate((sel) => {
    const x = _chessState.get(document.querySelector(sel));
    const m = chessAllLegalMoves(x.board, 'w', x.castling, x.ep).find(m => chessMoveForcesMate(x.board, x.castling, x.ep, 'w', m, 1));
    return m ? chessMoveName(m.fr, m.fc, m.tr, m.tc) : null;
}, W);
await move(mating);
await page.waitForTimeout(150);
ok('and finishing it solves it', (await st()).challenge.status === 'solved', mating);

// Endgames: a stalemate is said to be one; the breakthrough plays out to a queen.
await page.selectOption(W + ' .chess-challenge-select', 'end-queen-2');
await page.waitForTimeout(150);
await move('g1g6');
await page.waitForTimeout(100);
ok('a stalemate is called a draw, not just wrong', (await panel()).message === 'Stalemate: a draw, not a win. Try again.');
await page.waitForTimeout(800);
ok('and is taken back too', (await st()).history.length === 0 && (await st()).challenge.status === 'playing');
await page.selectOption(W + ' .chess-challenge-select', 'end-breakthrough');
await page.waitForTimeout(150);
for (const m of ['b5b6', 'c5c6', 'a5a6', 'a6a7', 'a7a8']) { await move(m); await page.waitForTimeout(650); }
s = await st();
ok('the breakthrough, played out, makes a queen and is solved', s.challenge.status === 'solved' &&
    s.history.join(' ') === 'b6 axb6 c6 bxc6 a6 Kg7 a7 Kf7 a8=Q', s.history.join(' '));
await page.selectOption(W + ' .chess-challenge-select', 'end-promote-mate');
await page.waitForTimeout(150);
await move('e7e8');
await page.waitForTimeout(150);
ok('promoting with mate is written as both', (await st()).history[0] === 'e8=Q#' && (await st()).challenge.status === 'solved', (await st()).history[0]);

// Reset.
await page.selectOption(W + ' .chess-challenge-select', 'skewer-rook');
await page.waitForTimeout(150);
await move('f1b5');
await page.waitForTimeout(700);
await page.click(W + ' .chess-challenge-buttons button:nth-child(2)');
await page.waitForTimeout(150);
s = await st();
ok('Reset starts it again', s.history.length === 0 && s.challenge.step === 0 &&
    JSON.stringify(s.board) === JSON.stringify(await fenBoard(await fenOf('skewer-rook'))));

// 3. Kept.
await page.reload();
await page.waitForSelector(W + ' .chess-canvas');
await page.waitForTimeout(600);
s = await st();
p = await panel();
ok('after a reload it is still Challenges, on the same one', s.mode === 'challenge' && p.picked === 'skewer-rook');
ok('with what was solved still solved', JSON.stringify(s.solved.sort()) === JSON.stringify(['end-breakthrough', 'end-promote-mate', 'ep-escape', 'ep-take', 'fork-queen', 'mate-in-two']) &&
    p.count === '6 of 19 solved', JSON.stringify(s.solved));
await page.screenshot({ path: OUT + '/chess-challenges.png' });

// 4. Back to a game.
await page.selectOption(W + ' .chess-mode-select', 'off');
await page.waitForTimeout(150);
p = await panel();
s = await st();
ok('2 Player is an ordinary game again', !p.shown && p.undo && p.captured &&
    JSON.stringify(s.board) === JSON.stringify(await page.evaluate(() => CHESS_INITIAL_BOARD)) && s.challenge === null);
await page.selectOption(W + ' .chess-mode-select', 'challenge');
await page.waitForTimeout(150);
ok('and back to Challenges picks up at the first not yet solved', (await panel()).picked === 'ep-check' && (await panel()).count === '6 of 19 solved',
    (await panel()).picked);

ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + 43 + ' assertions reached)');
await browser.close();
