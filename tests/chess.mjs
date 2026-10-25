// Chess: castling and en passant, the two moves that depend on the game so far and
// not only on where the pieces stand. Played through the board itself, by clicking,
// as a person would; the cases that need a particular position are set up and asked.
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
    localStorage.setItem('finance_default_positions', JSON.stringify({ ch: { x: 20, y: 20, z: 5, width: 700, height: 560 } }));
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

const W = '.tool[data-tool="ch"] .chess-widget';
const square = (name) => ({ row: 8 - Number(name[1]), col: name.charCodeAt(0) - 97 });
const click = async (name) => {
    const box = await page.evaluate((s) => {
        const r = document.querySelector(s).getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width };
    }, W + ' .chess-canvas');
    const { row, col } = square(name);
    const sq = box.w / 8;
    await page.mouse.click(box.x + col * sq + sq / 2, box.y + row * sq + sq / 2);
    await page.waitForTimeout(40);
};
const move = async (from, to) => { await click(from); await click(to); };
const play = async (moves) => { for (const m of moves.split(' ')) await move(m.slice(0, 2), m.slice(2, 4)); };
const state = () => page.evaluate((s) => {
    const st = _chessState.get(document.querySelector(s));
    return { board: st.board, castling: st.castling, ep: st.ep, history: st.moveHistory, turn: st.turn,
        valid: st.validMoves.map(m => String.fromCharCode(97 + m.col) + (8 - m.row)), capturedBlack: st.capturedBlack };
}, W);
const at = (st, name) => { const { row, col } = square(name); return st.board[row][col]; };
const newGame = () => page.click(W + ' button[onclick*="chessNewGame"]');
const undo = () => page.click(W + ' button[onclick*="chessUndo"]');
// The moves a piece has in a position set up for the purpose: rows as FEN-like strings.
const movesIn = (rows, from, castling, ep) => page.evaluate(({ rows, from, castling, ep }) => {
    const board = rows.map(r => r.split(' ').map(x => x === '.' ? null : x));
    const r = 8 - Number(from[1]), c = from.charCodeAt(0) - 97;
    return chessGetValidMoves(board, r, c, board[r][c][0], castling, ep)
        .map(m => String.fromCharCode(97 + m.col) + (8 - m.row)).sort().join(',');
}, { rows, from, castling, ep });
const ALL = { wK: true, wQ: true, bK: true, bQ: true };
const E = '. . . . . . . .';

// 1. Castling on the king's side, both colours, by clicking.
await play('e2e4 e7e5 g1f3 g8f6 f1c4 f8c5');
await click('e1');
ok('with f1 and g1 clear, the king is offered g1', (await state()).valid.includes('g1'), JSON.stringify((await state()).valid));
await click('g1');
let st = await state();
ok('castling moves the king to g1 and the rook to f1', at(st, 'g1') === 'wK' && at(st, 'f1') === 'wR' && !at(st, 'h1') && !at(st, 'e1'));
ok('and is written O-O', st.history[st.history.length - 1] === 'O-O', JSON.stringify(st.history));
ok('after which white can castle no more', st.castling.wK === false && st.castling.wQ === false && st.castling.bK === true);
await move('e8', 'g8');
st = await state();
ok('black castles the same way', at(st, 'g8') === 'bK' && at(st, 'f8') === 'bR' && st.history[st.history.length - 1] === 'O-O');
ok('and the move list reads as a game', await page.evaluate((s) => document.querySelector(s + ' .chess-history').textContent, W)
    .then(t => /4\. O-O O-O/.test(t)));

// 2. Undo puts back the rook and the right to castle.
await undo();
st = await state();
ok('undoing black’s castling puts king and rook back, and the right with them',
    at(st, 'e8') === 'bK' && at(st, 'h8') === 'bR' && !at(st, 'f8') && st.castling.bK === true && st.turn === 'b');
await undo();
st = await state();
ok('and undoing white’s gives white its castling back', at(st, 'e1') === 'wK' && at(st, 'h1') === 'wR' && st.castling.wK === true);

// 3. Kept across a reload, mid-game.
await move('e1', 'g1');
await page.reload();
await page.waitForSelector(W + ' .chess-canvas');
await page.waitForTimeout(500);
st = await state();
ok('a reload keeps the castled position and the rights that are left', at(st, 'g1') === 'wK' && st.castling.wK === false && st.castling.bK === true);
await click('e8');
ok('so black is still offered castling after it', (await state()).valid.includes('g8'));
await click('e8');

// 4. The queen's side, and every refusal.
const QSIDE = ['bR . . . bK . . bR', E, E, E, E, E, E, 'wR . . . wK . . wR'];
ok('with both rights and clear rows, the king may castle either way', await movesIn(QSIDE, 'e1', ALL, null) === 'c1,d1,d2,e2,f1,f2,g1', await movesIn(QSIDE, 'e1', ALL, null));
ok('black too', (await movesIn(QSIDE, 'e8', ALL, null)).split(',').includes('c8') && (await movesIn(QSIDE, 'e8', ALL, null)).split(',').includes('g8'));
ok('queen’s side castling takes the rook to d1', await page.evaluate((rows) => {
    const board = rows.map(r => r.split(' ').map(x => x === '.' ? null : x));
    const after = chessApplyMove(board, { wK: true, wQ: true, bK: true, bQ: true }, { fr: 7, fc: 4, tr: 7, tc: 2 });
    return after.board[7][2] === 'wK' && after.board[7][3] === 'wR' && !after.board[7][0] && after.castle === 'Q';
}, QSIDE));
ok('without the rights, no castling', await movesIn(QSIDE, 'e1', { wK: false, wQ: false, bK: true, bQ: true }, null) === 'd1,d2,e2,f1,f2');
const withAt = (rows, sq, piece) => rows.map((r, i) => i === 8 - Number(sq[1])
    ? r.split(' ').map((x, c) => c === sq.charCodeAt(0) - 97 ? piece : x).join(' ') : r);
ok('not through check: a rook on f8 stops the king’s side, not the queen’s',
    await movesIn(withAt(QSIDE, 'f8', 'bR'), 'e1', ALL, null) === 'c1,d1,d2,e2', await movesIn(withAt(QSIDE, 'f8', 'bR'), 'e1', ALL, null));
ok('not into check: a rook on g8 stops it too', !(await movesIn(withAt(QSIDE, 'g8', 'bR'), 'e1', ALL, null)).includes('g1'));
ok('not out of check', await movesIn(withAt(QSIDE, 'e5', 'bR'), 'e1', ALL, null) === 'd1,d2,f1,f2', await movesIn(withAt(QSIDE, 'e5', 'bR'), 'e1', ALL, null));
ok('not over a piece', !(await movesIn(withAt(QSIDE, 'b1', 'wN'), 'e1', ALL, null)).includes('c1'));
ok('but b1 being attacked does not stop it — only the king’s path counts',
    (await movesIn(withAt(QSIDE, 'b8', 'bR'), 'e1', ALL, null)).includes('c1'));
ok('a rook taken in its corner takes that side’s castling with it', await page.evaluate((rows) => {
    const board = rows.map(r => r.split(' ').map(x => x === '.' ? null : x));
    board[5][7] = 'bB';
    board[7][7] = 'wR';
    // A black bishop from h3 cannot reach h1; a knight on g3 can.
    board[5][6] = 'bN';
    const after = chessApplyMove(board, { wK: true, wQ: true, bK: true, bQ: true }, { fr: 5, fc: 6, tr: 7, tc: 7 });
    return after.castling.wK === false && after.castling.wQ === true;
}, QSIDE));

// 5. By clicking: a king that moved, or a rook that moved, loses castling.
await newGame();
await play('e2e4 e7e5 e1e2 e8e7 e2e1 e7e8 g1f3 g8f6 f1c4 f8c5');
await click('e1');
ok('a king that has moved and come back may not castle', !(await state()).valid.includes('g1'), JSON.stringify((await state()).valid));
await click('e1');
await newGame();
await play('g1f3 g8f6 h1g1 a7a6 g1h1 a6a5 e2e4 e7e5 f1c4 f8c5');
await click('e1');
ok('nor may a rook that has moved and come back', !(await state()).valid.includes('g1'));
await click('e1');

// 6. A game saved before castling was kept: what still stands at home may castle.
await page.evaluate(() => {
    const custs = loadToolCustomizations();
    const board = [['bR', null, null, null, 'bK', null, null, 'bR'], [], [], [], [], [], [], ['wR', null, null, null, 'wK', null, null, null]]
        .map(r => Array.from({ length: 8 }, (_, i) => r[i] || null));
    custs.ch.chessData = { board, turn: 'w', moveHistory: [], capturedWhite: [], capturedBlack: [], gameOver: false, inCheck: false, undoStack: [], aiMode: 'off' };
    saveToolCustomizations(custs);
});
await page.reload();
await page.waitForSelector(W + ' .chess-canvas');
await page.waitForTimeout(500);
st = await state();
ok('an older saved game gets castling where king and rook are still home',
    JSON.stringify(st.castling) === JSON.stringify({ wK: false, wQ: true, bK: true, bQ: true }), JSON.stringify(st.castling));
await click('e1');
ok('and is offered it there', (await state()).valid.includes('c1') && !(await state()).valid.includes('g1'));
await click('c1');
st = await state();
ok('castling queen’s side by clicking, written O-O-O', at(st, 'c1') === 'wK' && at(st, 'd1') === 'wR' && st.history[0] === 'O-O-O');

// 7. En passant.
await newGame();
await play('e2e4 a7a6 e4e5 d7d5');
st = await state();
ok('a pawn’s double step leaves the square it skipped', JSON.stringify(st.ep) === JSON.stringify(square('d6')), JSON.stringify(st.ep));
await click('e5');
ok('the pawn beside it may take on that square', (await state()).valid.includes('d6'), JSON.stringify((await state()).valid));
await click('d6');
st = await state();
ok('taking en passant removes the pawn that passed', at(st, 'd6') === 'wP' && !at(st, 'd5') && !at(st, 'e5'));
ok('and counts it, written exd6', st.capturedBlack.includes('bP') && st.history[st.history.length - 1] === 'exd6', JSON.stringify(st.history));
await undo();
st = await state();
ok('undo puts the passed pawn back, and the chance with it', at(st, 'd5') === 'bP' && at(st, 'e5') === 'wP' && JSON.stringify(st.ep) === JSON.stringify(square('d6')));
await play('h2h3 h7h6');
await click('e5');
ok('the chance lasts one move only', !(await state()).valid.includes('d6'), JSON.stringify((await state()).valid));
await click('e5');
ok('a pawn that came up one square at a time cannot be taken so', await movesIn(
    [E, E, E, 'bP . . . . . . .'.replace('bP . ', '. . ').replace(/^/, ''), E, E, E, E].map((r, i) => i === 3 ? '. . . bP wP . . .' : r),
    'e5', null, null) === 'e6');

// 8. The computer plays by the same rules.
ok('the computer is offered castling when it has it', await page.evaluate((rows) => {
    const board = rows.map(r => r.split(' ').map(x => x === '.' ? null : x));
    return chessAIGetAllMoves(board, 'b', { wK: true, wQ: true, bK: true, bQ: true }, null)
        .some(m => m.fr === 0 && m.fc === 4 && m.tr === 0 && m.tc === 6);
}, QSIDE));
ok('and en passant', await page.evaluate(() => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][4] = 'bK'; board[7][4] = 'wK'; board[4][3] = 'bP'; board[4][4] = 'wP';
    return chessAIGetAllMoves(board, 'b', null, { row: 5, col: 4 }).some(m => m.fr === 4 && m.fc === 3 && m.tr === 5 && m.tc === 4);
}));
await page.selectOption(W + ' .chess-mode-select', 'black');
await page.waitForTimeout(200);
await play('e2e4');
await page.waitForTimeout(2500);
ok('and still answers a move, in play against it', (await state()).history.length === 2 && (await state()).turn === 'w', JSON.stringify((await state()).history));

await page.screenshot({ path: OUT + '/chess.png' });
ok('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
console.log('  (all ' + 36 + ' assertions reached)');
await browser.close();
