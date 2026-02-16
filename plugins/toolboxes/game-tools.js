// Game Tools Toolbox Plugin
// Contains Chess (two-player local)

// Inject CSS styles for game tools
(function() {
    if (document.getElementById('game-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'game-tools-styles';
    style.textContent = `
.tool-content:has(.chess-widget) { display: flex; flex-direction: column; overflow: hidden; }
.chess-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; }
.chess-toolbar { display: flex; align-items: center; gap: 6px; padding: 4px 8px; flex-shrink: 0; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; }
.chess-toolbar button { padding: 3px 8px; font-size: 11px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; }
.chess-toolbar button:hover { background: var(--bg-tertiary); }
.chess-turn { font-size: 12px; font-weight: 700; color: var(--text-primary); }
.chess-status { font-size: 11px; color: var(--text-muted); margin-left: auto; }
.chess-status.check { color: #e67e22; font-weight: 700; }
.chess-status.checkmate { color: #e74c3c; font-weight: 700; }
.chess-status.stalemate { color: #7f8c8d; font-weight: 700; }
.chess-board-area { display: flex; flex-direction: row; flex: 1; min-height: 0; overflow: hidden; }
.chess-canvas-wrap { flex: 1; position: relative; min-width: 0; min-height: 0; }
.chess-canvas { position: absolute; top: 0; left: 0; cursor: pointer; touch-action: none; }
.chess-side-panel { width: 140px; flex-shrink: 0; display: flex; flex-direction: column; border-left: 1px solid var(--border-color); overflow: hidden; }
.chess-captured { padding: 6px; flex-shrink: 0; }
.chess-captured-label { font-size: 10px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.chess-captured-pieces { font-size: 16px; line-height: 1.4; min-height: 20px; word-break: break-all; }
.chess-history-wrap { flex: 1; display: flex; flex-direction: column; min-height: 0; border-top: 1px solid var(--border-color); }
.chess-history-label { font-size: 10px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 6px 2px; flex-shrink: 0; }
.chess-history { flex: 1; overflow-y: auto; padding: 0 6px 6px; font-size: 11px; font-family: monospace; }
.chess-history-move { padding: 1px 0; color: var(--text-secondary); }
.chess-history-move.last { font-weight: 700; color: var(--text-primary); }
.chess-mode-select { padding: 2px 6px; font-size: 11px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; }

/* Sudoku Widget Styles */
.sudoku-widget { padding: 8px; display: flex; flex-direction: column; align-items: center; user-select: none; }
.sudoku-toolbar { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; width: 100%; flex-wrap: wrap; }
.sudoku-toolbar select { padding: 4px 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 12px; cursor: pointer; }
.sudoku-timer { font-family: monospace; font-size: 14px; color: var(--text-secondary); }
.sudoku-mistakes { font-size: 12px; color: #e74c3c; }
.sudoku-grid { display: grid; grid-template-columns: repeat(9, 1fr); border: 2px solid var(--text-primary); width: 100%; max-width: 306px; }
.sudoku-cell { display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; background: var(--bg-primary); position: relative; overflow: hidden; aspect-ratio: 1; }
.sudoku-cell:hover { background: var(--bg-secondary); }
.sudoku-cell.given { font-weight: 700; color: var(--text-primary); }
.sudoku-cell.user { color: #3498db; font-weight: 500; }
.sudoku-cell.selected { background: #d4e6f9 !important; }
.sudoku-cell.same-num { background: #e8f0fe; }
.sudoku-cell.conflict { background: #fce4e4 !important; color: #e74c3c !important; }
.sudoku-notes { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); width: 100%; height: 100%; position: absolute; top: 0; left: 0; pointer-events: none; }
.sudoku-notes span { font-size: 9px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); line-height: 1; }
.sudoku-numpad { display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }
.sudoku-numpad-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); font-size: 16px; font-weight: 600; cursor: pointer; }
.sudoku-numpad-btn:hover { background: #3498db; color: white; }
.sudoku-actions { display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap; justify-content: center; }
.sudoku-win-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.93); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; border-radius: 6px; }
.sudoku-win-title { font-size: 24px; font-weight: 700; color: #27ae60; margin-bottom: 8px; }
.sudoku-win-stats { font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; }

/* Nonogram Widget Styles */
.nonogram-widget { padding: 8px; display: flex; flex-direction: column; align-items: center; user-select: none; }
.nonogram-toolbar { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; width: 100%; flex-wrap: wrap; }
.nonogram-toolbar select { padding: 4px 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 12px; cursor: pointer; }
.nonogram-timer { font-family: monospace; font-size: 14px; color: var(--text-secondary); }
.nonogram-mistakes { font-size: 12px; color: #e74c3c; }
.nonogram-grid-wrap { display: inline-grid; border: 2px solid var(--text-primary); }
.nonogram-clue-cell { display: flex; align-items: flex-end; justify-content: center; padding: 1px; font-size: 10px; color: var(--text-secondary); font-weight: 600; }
.nonogram-clue-cell.row-clue { justify-content: flex-end; flex-direction: row; gap: 2px; padding-right: 4px; }
.nonogram-clue-cell.col-clue { flex-direction: column; align-items: center; padding-bottom: 2px; }
.nonogram-clue-cell.satisfied { color: var(--text-muted); opacity: 0.4; }
.nonogram-corner { /* empty top-left corner */ }
.nonogram-cell { width: 24px; height: 24px; border: 1px solid var(--border-color); cursor: pointer; display: flex; align-items: center; justify-content: center; background: var(--bg-primary); }
.nonogram-cell:hover { background: var(--bg-secondary); }
.nonogram-cell.filled { background: var(--text-primary); }
.nonogram-cell.marked { background: var(--bg-primary); color: var(--text-muted); font-size: 14px; }
.nonogram-actions { display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }
.nonogram-win-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.93); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; border-radius: 6px; }
.nonogram-win-title { font-size: 24px; font-weight: 700; color: #27ae60; margin-bottom: 8px; }
.nonogram-win-stats { font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; }

/* Typing Speed Test Styles */
.tool-content:has(.typingtest-widget) { display: flex; flex-direction: column; overflow: hidden; }
.typingtest-widget { display: flex; flex-direction: column; padding: 8px; flex: 1; min-height: 0; overflow: hidden; position: relative; }
.typingtest-toolbar { display: flex; align-items: center; gap: 8px; padding: 4px 0 8px; flex-shrink: 0; flex-wrap: wrap; }
.typingtest-toolbar select { padding: 3px 6px; font-size: 11px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; }
.typingtest-toolbar button { padding: 3px 8px; font-size: 11px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; }
.typingtest-toolbar button:hover { background: var(--bg-tertiary); }
.typingtest-stat-group { display: flex; gap: 12px; margin-left: auto; }
.typingtest-stat { font-size: 12px; color: var(--text-secondary); }
.typingtest-stat strong { color: var(--text-primary); font-variant-numeric: tabular-nums; }
.typingtest-words { flex: 1; overflow: hidden; line-height: 1.8; font-size: 18px; color: var(--text-muted); position: relative; min-height: 0; }
.typingtest-words-inner { transition: transform 0.15s ease; }
.typingtest-word { display: inline-block; margin: 0 5px 2px 0; }
.typingtest-word.active { color: var(--text-primary); }
.typingtest-word.correct { color: #27ae60; }
.typingtest-word.incorrect { color: #e74c3c; text-decoration: underline wavy #e74c3c; }
.typingtest-char.correct { color: #27ae60; }
.typingtest-char.incorrect { color: #fff; background: #e74c3c; border-radius: 2px; }
.typingtest-char.cursor { border-left: 2px solid #3498db; margin-left: -1px; }
.typingtest-extra { color: #fff; background: #c0392b; border-radius: 2px; }
.typingtest-input-row { flex-shrink: 0; padding-top: 8px; }
.typingtest-input { width: 100%; padding: 8px 10px; font-size: 16px; border: 2px solid var(--border-color); border-radius: 6px; background: var(--bg-primary); color: var(--text-primary); outline: none; box-sizing: border-box; font-family: inherit; }
.typingtest-input:focus { border-color: #3498db; }
.typingtest-input:disabled { opacity: 0.5; cursor: not-allowed; }
.typingtest-results { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: var(--bg-primary); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; gap: 6px; }
.typingtest-results-title { font-size: 22px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.typingtest-results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; text-align: center; margin: 8px 0; }
.typingtest-results-item { display: flex; flex-direction: column; }
.typingtest-results-value { font-size: 28px; font-weight: 700; color: #3498db; }
.typingtest-results-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.typingtest-best { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.typingtest-best strong { color: #f39c12; }

/* Flappy Bird Widget Styles */
.tool-content:has(.flappy-widget) { display: flex; flex-direction: column; padding: 0; }
.flappy-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; position: relative; background: #70c5ce; overflow: hidden; }
.flappy-canvas { display: block; width: 100%; flex: 1; min-height: 0; image-rendering: pixelated; }
.flappy-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; z-index: 2; }
.flappy-overlay.hidden { display: none; }
.flappy-title { font-size: 28px; font-weight: 900; color: #fff; text-shadow: 2px 2px 0 #543847, -1px -1px 0 #543847, 1px -1px 0 #543847, -1px 1px 0 #543847; margin-bottom: 8px; font-family: 'Arial Black', Arial, sans-serif; }
.flappy-subtitle { font-size: 13px; color: #fff; text-shadow: 1px 1px 0 #543847; margin-bottom: 16px; }
.flappy-score-display { font-size: 48px; font-weight: 900; color: #fff; text-shadow: 2px 3px 0 #543847; font-family: 'Arial Black', Arial, sans-serif; position: absolute; top: 30px; left: 50%; transform: translateX(-50%); pointer-events: none; z-index: 3; }
.flappy-score-display.hidden { display: none; }
.flappy-start-btn { pointer-events: auto; padding: 10px 28px; font-size: 16px; font-weight: 700; border: none; border-radius: 25px; background: #e8a033; color: #fff; cursor: pointer; text-shadow: 1px 1px 0 #b07818; box-shadow: 0 4px 0 #b07818; transition: transform 0.1s, box-shadow 0.1s; }
.flappy-start-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 0 #b07818; }
.flappy-start-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #b07818; }
.flappy-game-over { font-size: 22px; font-weight: 900; color: #e74c3c; text-shadow: 2px 2px 0 #543847; margin-bottom: 4px; font-family: 'Arial Black', Arial, sans-serif; }
.flappy-final-score { font-size: 14px; color: #fff; text-shadow: 1px 1px 0 #543847; margin-bottom: 4px; }
.flappy-best-score { font-size: 12px; color: #ded895; text-shadow: 1px 1px 0 #543847; margin-bottom: 14px; }

/* Snake Game Widget Styles */
.tool-content:has(.snake-widget) { display: flex; flex-direction: column; padding: 0; }
.snake-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; position: relative; background: #1a1a2e; overflow: hidden; }
.snake-canvas { display: block; width: 100%; flex: 1; min-height: 0; }
.snake-hud { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; font-size: 13px; font-weight: 700; color: #fff; font-family: 'Arial Black', Arial, sans-serif; text-shadow: 1px 1px 0 rgba(0,0,0,0.5); pointer-events: none; z-index: 2; }
.snake-hud.hidden { display: none; }
.snake-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; z-index: 3; }
.snake-overlay.hidden { display: none; }
.snake-overlay-title { font-size: 28px; font-weight: 900; color: #4ecca3; text-shadow: 2px 2px 0 #0f3460; margin-bottom: 6px; font-family: 'Arial Black', Arial, sans-serif; }
.snake-overlay-sub { font-size: 13px; color: #e0e0e0; text-shadow: 1px 1px 0 #0f3460; margin-bottom: 14px; }
.snake-overlay-score { font-size: 15px; color: #fff; text-shadow: 1px 1px 0 #0f3460; margin-bottom: 4px; }
.snake-overlay-best { font-size: 12px; color: #f39c12; text-shadow: 1px 1px 0 #0f3460; margin-bottom: 14px; }
.snake-overlay-gameover { font-size: 24px; font-weight: 900; color: #e74c3c; text-shadow: 2px 2px 0 #0f3460; margin-bottom: 6px; font-family: 'Arial Black', Arial, sans-serif; }
.snake-play-btn { pointer-events: auto; padding: 10px 28px; font-size: 16px; font-weight: 700; border: none; border-radius: 25px; background: #4ecca3; color: #1a1a2e; cursor: pointer; box-shadow: 0 4px 0 #2e8b6e; transition: transform 0.1s, box-shadow 0.1s; }
.snake-play-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 0 #2e8b6e; }
.snake-play-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #2e8b6e; }
.snake-speed-row { display: flex; gap: 6px; margin-bottom: 14px; pointer-events: auto; }
.snake-speed-btn { padding: 5px 12px; border: 2px solid #4ecca3; border-radius: 15px; background: transparent; color: #4ecca3; cursor: pointer; font-size: 11px; font-weight: 700; transition: background 0.15s, color 0.15s; }
.snake-speed-btn:hover { background: rgba(78,204,163,0.15); }
.snake-speed-btn.active { background: #4ecca3; color: #1a1a2e; }

/* Reaction Time Test Styles */
.tool-content:has(.reactiontime-widget) { display: flex; flex-direction: column; overflow: hidden; }
.reactiontime-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; user-select: none; }
.reactiontime-stats { display: flex; justify-content: center; gap: 16px; padding: 6px 8px; font-size: 12px; color: var(--text-secondary); flex-shrink: 0; border-bottom: 1px solid var(--border-color); background: var(--bg-secondary); }
.reactiontime-stats strong { color: var(--text-primary); font-variant-numeric: tabular-nums; }
.reactiontime-area { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.15s; min-height: 0; }
.reactiontime-area.rt-idle { background: var(--bg-primary); }
.reactiontime-area.rt-waiting { background: #c0392b; }
.reactiontime-area.rt-go { background: #27ae60; }
.reactiontime-area.rt-result { background: #2980b9; }
.reactiontime-area.rt-tooearly { background: #d35400; }
.reactiontime-message { font-size: 28px; font-weight: 700; color: #fff; text-align: center; padding: 0 16px; }
.reactiontime-area.rt-idle .reactiontime-message { color: var(--text-primary); }
.reactiontime-sub { font-size: 14px; color: rgba(255,255,255,0.85); margin-top: 6px; text-align: center; padding: 0 16px; }
.reactiontime-area.rt-idle .reactiontime-sub { color: var(--text-muted); }
.reactiontime-result-ms { font-size: 56px; font-weight: 900; color: #fff; font-variant-numeric: tabular-nums; }

/* Connect Four Widget Styles */
.tool-content:has(.c4-widget) { display: flex; flex-direction: column; padding: 0; }
.c4-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; background: #1a1a2e; }
.c4-toolbar { display: flex; align-items: center; gap: 6px; padding: 6px 10px; flex-shrink: 0; flex-wrap: wrap; border-bottom: 1px solid #0f3460; }
.c4-toolbar select { padding: 3px 6px; font-size: 11px; border: 1px solid #0f3460; border-radius: 4px; background: #16213e; color: #e0e0e0; cursor: pointer; }
.c4-toolbar button { padding: 4px 10px; border: 1px solid #0f3460; border-radius: 4px; background: #16213e; color: #e0e0e0; cursor: pointer; font-size: 11px; }
.c4-toolbar button:hover { background: #1a3a5c; }
.c4-status { font-size: 12px; font-weight: 700; color: #e0e0e0; flex: 1; text-align: center; min-width: 60px; }
.c4-status .c4-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; vertical-align: middle; margin-right: 4px; }
.c4-board-wrap { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 0; padding: 8px; }
.c4-canvas { cursor: pointer; max-width: 100%; max-height: 100%; }
.c4-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(26,26,46,0.85); z-index: 2; border-radius: 0 0 6px 6px; }
.c4-overlay.hidden { display: none; }
.c4-overlay-title { font-size: 22px; font-weight: 900; color: #f1c40f; text-shadow: 1px 1px 0 #0f3460; margin-bottom: 6px; font-family: 'Arial Black', Arial, sans-serif; }
.c4-overlay-sub { font-size: 13px; color: #e0e0e0; margin-bottom: 12px; }
.c4-overlay .c4-play-btn { padding: 8px 24px; font-size: 14px; font-weight: 700; border: none; border-radius: 20px; background: #f1c40f; color: #1a1a2e; cursor: pointer; box-shadow: 0 3px 0 #d4a017; transition: transform 0.1s, box-shadow 0.1s; }
.c4-overlay .c4-play-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 0 #d4a017; }
.c4-overlay .c4-play-btn:active { transform: translateY(1px); box-shadow: 0 1px 0 #d4a017; }

/* Breakout Game Widget Styles */
.tool-content:has(.breakout-widget) { display: flex; flex-direction: column; padding: 0; }
.breakout-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; position: relative; background: #1a1a2e; overflow: hidden; }
.breakout-canvas { display: block; width: 100%; flex: 1; min-height: 0; }
.breakout-hud { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; font-size: 13px; font-weight: 700; color: #fff; font-family: 'Arial Black', Arial, sans-serif; text-shadow: 1px 1px 0 rgba(0,0,0,0.5); pointer-events: none; z-index: 2; }
.breakout-hud.hidden { display: none; }
.breakout-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; z-index: 3; }
.breakout-overlay.hidden { display: none; }
.breakout-overlay-title { font-size: 28px; font-weight: 900; color: #f1c40f; text-shadow: 2px 2px 0 #0f3460; margin-bottom: 6px; font-family: 'Arial Black', Arial, sans-serif; }
.breakout-overlay-sub { font-size: 13px; color: #e0e0e0; text-shadow: 1px 1px 0 #0f3460; margin-bottom: 14px; }
.breakout-overlay-score { font-size: 15px; color: #fff; text-shadow: 1px 1px 0 #0f3460; margin-bottom: 4px; }
.breakout-overlay-best { font-size: 12px; color: #f39c12; text-shadow: 1px 1px 0 #0f3460; margin-bottom: 14px; }
.breakout-overlay-gameover { font-size: 24px; font-weight: 900; color: #e74c3c; text-shadow: 2px 2px 0 #0f3460; margin-bottom: 6px; font-family: 'Arial Black', Arial, sans-serif; }
.breakout-play-btn { pointer-events: auto; padding: 10px 28px; font-size: 16px; font-weight: 700; border: none; border-radius: 25px; background: #e74c3c; color: #fff; cursor: pointer; box-shadow: 0 4px 0 #c0392b; transition: transform 0.1s, box-shadow 0.1s; }
.breakout-play-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 0 #c0392b; }
.breakout-play-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #c0392b; }

/* Memory Pattern Widget Styles */
.mempat-widget { padding: 8px; display: flex; flex-direction: column; align-items: center; user-select: none; position: relative; }
.mempat-toolbar { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; width: 100%; flex-wrap: wrap; }
.mempat-status { font-size: 13px; font-weight: 600; margin-bottom: 8px; text-align: center; min-height: 18px; }
.mempat-grid { display: grid; gap: 6px; justify-content: center; width: 100%; max-width: 300px; padding: 8px; }
.mempat-cell { aspect-ratio: 1; border-radius: 8px; cursor: default; transition: transform 0.15s, box-shadow 0.15s, filter 0.15s; opacity: 0.6; min-height: 40px; }
.mempat-cell:hover { opacity: 0.8; }
.mempat-cell-lit { opacity: 1 !important; filter: brightness(1.4); }
.mempat-cell-wrong { opacity: 1 !important; animation: mempat-shake 0.4s ease; }
@keyframes mempat-shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
.mempat-gameover { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; border-radius: 6px; }
.mempat-gameover-title { font-size: 22px; font-weight: 700; color: #e74c3c; margin-bottom: 8px; }
.mempat-gameover-score { font-size: 14px; color: #ccc; margin-bottom: 12px; }

/* Tic Tac Toe Widget Styles */
.ttt-widget { padding: 8px; display: flex; flex-direction: column; align-items: center; user-select: none; position: relative; }
.ttt-toolbar { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; width: 100%; flex-wrap: wrap; }
.ttt-status { font-size: 14px; font-weight: 600; margin-bottom: 8px; text-align: center; min-height: 20px; color: var(--text-primary); }
.ttt-grid { display: grid; grid-template-columns: repeat(3, 80px); grid-template-rows: repeat(3, 80px); gap: 0; border: 2px solid var(--text-primary); }
.ttt-cell { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 700; cursor: pointer; background: var(--bg-primary); border: 1px solid var(--border-color); transition: background 0.1s; }
.ttt-cell:hover { background: var(--bg-secondary); }
.ttt-cell.ttt-x { color: #3498db; }
.ttt-cell.ttt-o { color: #e74c3c; }
.ttt-cell.ttt-win { background: rgba(46, 204, 113, 0.2); }
.ttt-score { font-size: 13px; color: var(--text-secondary); display: flex; gap: 12px; margin-top: 8px; }
.ttt-score span { font-weight: 600; }

/* 2048 Game Widget Styles */
.tool-content:has(.g2048-widget) { display: flex; flex-direction: column; padding: 0; }
.g2048-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; background: #faf8ef; overflow: hidden; user-select: none; }
.g2048-header { display: flex; align-items: center; gap: 8px; padding: 8px 12px; flex-shrink: 0; }
.g2048-logo { font-size: 24px; font-weight: 900; color: #776e65; line-height: 1; }
.g2048-score-area { display: flex; gap: 6px; margin-left: auto; }
.g2048-score-box { background: #bbada0; border-radius: 4px; padding: 4px 10px; text-align: center; min-width: 50px; }
.g2048-score-label { font-size: 9px; font-weight: 700; color: #eee4da; text-transform: uppercase; letter-spacing: 0.5px; }
.g2048-score-value { font-size: 16px; font-weight: 900; color: #fff; font-variant-numeric: tabular-nums; line-height: 1.2; }
.g2048-toolbar { display: flex; align-items: center; gap: 6px; padding: 0 12px 8px; flex-shrink: 0; }
.g2048-toolbar button { padding: 5px 12px; border: none; border-radius: 4px; background: #8f7a66; color: #f9f6f2; font-size: 12px; font-weight: 700; cursor: pointer; }
.g2048-toolbar button:hover { background: #9f8b76; }
.g2048-board-wrap { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 0; padding: 0 12px 12px; }
.g2048-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #bbada0; border-radius: 6px; padding: 8px; width: 100%; max-width: 340px; aspect-ratio: 1; }
.g2048-cell { background: rgba(238,228,218,0.35); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 28px; color: #776e65; position: relative; overflow: hidden; aspect-ratio: 1; }
.g2048-cell[data-value="2"] { background: #eee4da; }
.g2048-cell[data-value="4"] { background: #ede0c8; }
.g2048-cell[data-value="8"] { background: #f2b179; color: #f9f6f2; }
.g2048-cell[data-value="16"] { background: #f59563; color: #f9f6f2; }
.g2048-cell[data-value="32"] { background: #f67c5f; color: #f9f6f2; }
.g2048-cell[data-value="64"] { background: #f65e3b; color: #f9f6f2; }
.g2048-cell[data-value="128"] { background: #edcf72; color: #f9f6f2; font-size: 24px; }
.g2048-cell[data-value="256"] { background: #edcc61; color: #f9f6f2; font-size: 24px; }
.g2048-cell[data-value="512"] { background: #edc850; color: #f9f6f2; font-size: 24px; }
.g2048-cell[data-value="1024"] { background: #edc53f; color: #f9f6f2; font-size: 20px; }
.g2048-cell[data-value="2048"] { background: #edc22e; color: #f9f6f2; font-size: 20px; }
.g2048-cell.big-tile { background: #3c3a32; color: #f9f6f2; font-size: 18px; }
.g2048-cell.pop { animation: g2048-pop 0.2s ease; }
.g2048-cell.merge { animation: g2048-merge 0.2s ease; }
@keyframes g2048-pop { 0% { transform: scale(0); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
@keyframes g2048-merge { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
.g2048-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(250,248,239,0.75); z-index: 2; }
.g2048-overlay.hidden { display: none; }
.g2048-overlay-title { font-size: 36px; font-weight: 900; color: #776e65; margin-bottom: 8px; }
.g2048-overlay-title.win { color: #edc22e; }
.g2048-overlay-sub { font-size: 14px; color: #776e65; margin-bottom: 14px; }
.g2048-overlay button { padding: 10px 28px; font-size: 14px; font-weight: 700; border: none; border-radius: 6px; background: #8f7a66; color: #f9f6f2; cursor: pointer; }
.g2048-overlay button:hover { background: #9f8b76; }

/* Minesweeper Widget Styles */
.ms-widget { padding: 8px; display: flex; flex-direction: column; align-items: center; user-select: none; position: relative; }
.ms-toolbar { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; width: 100%; flex-wrap: wrap; }
.ms-toolbar select { padding: 4px 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); font-size: 12px; cursor: pointer; }
.ms-info { display: flex; gap: 12px; margin-left: auto; align-items: center; }
.ms-mines { font-size: 13px; font-weight: 600; color: var(--text-secondary); font-variant-numeric: tabular-nums; }
.ms-timer { font-family: monospace; font-size: 14px; color: var(--text-secondary); font-variant-numeric: tabular-nums; }
.ms-grid { display: grid; border: 2px solid var(--text-primary); width: 100%; max-width: 400px; }
.ms-cell { display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; cursor: pointer; background: var(--bg-secondary); border: 1px solid var(--border-color); aspect-ratio: 1; box-sizing: border-box; line-height: 1; }
.ms-cell:hover { background: var(--bg-tertiary); }
.ms-cell.revealed { background: var(--bg-primary); cursor: default; }
.ms-cell.revealed:hover { background: var(--bg-primary); }
.ms-cell.mine-hit { background: #e74c3c; color: #fff; }
.ms-cell.mine-show { color: #333; }
.ms-cell.flagged { font-size: 14px; }
.ms-cell.num-1 { color: #2563eb; }
.ms-cell.num-2 { color: #16a34a; }
.ms-cell.num-3 { color: #dc2626; }
.ms-cell.num-4 { color: #1e3a8a; }
.ms-cell.num-5 { color: #7f1d1d; }
.ms-cell.num-6 { color: #0d9488; }
.ms-cell.num-7 { color: #1a1a1a; }
.ms-cell.num-8 { color: #6b7280; }
.ms-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.93); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; border-radius: 6px; }
.ms-overlay-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
.ms-overlay-title.win { color: #27ae60; }
.ms-overlay-title.lose { color: #e74c3c; }
.ms-overlay-stats { font-size: 14px; color: var(--text-secondary); margin-bottom: 4px; }
.ms-overlay-best { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }

/* Hangman Widget Styles */
.hangman-widget { padding: 8px; display: flex; flex-direction: column; align-items: center; user-select: none; position: relative; }
.hangman-toolbar { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; width: 100%; flex-wrap: wrap; }
.hangman-top { display: flex; width: 100%; gap: 8px; margin-bottom: 6px; align-items: flex-start; }
.hangman-canvas-wrap { flex-shrink: 0; }
.hangman-canvas-wrap canvas { display: block; border-radius: 4px; }
.hangman-right { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; }
.hangman-word { font-size: 22px; font-weight: 700; letter-spacing: 6px; font-family: monospace; color: var(--text-primary); word-break: break-all; text-align: center; }
.hangman-category { font-size: 11px; color: var(--text-muted); }
.hangman-status { font-size: 13px; font-weight: 600; min-height: 18px; text-align: center; }
.hangman-keys { display: flex; flex-wrap: wrap; gap: 3px; justify-content: center; max-width: 260px; }
.hangman-key { width: 26px; height: 28px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.1s, opacity 0.1s; }
.hangman-key:hover { background: var(--bg-primary); }
.hangman-key.correct { background: #27ae60; color: #fff; border-color: #27ae60; cursor: default; }
.hangman-key.wrong { background: var(--bg-secondary); color: var(--text-muted); opacity: 0.35; cursor: default; text-decoration: line-through; }
.hangman-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.93); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; border-radius: 6px; }
.hangman-overlay-title { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
.hangman-overlay-word { font-size: 16px; color: var(--text-secondary); margin-bottom: 4px; font-weight: 600; }
.hangman-overlay-stats { font-size: 13px; color: var(--text-muted); margin-bottom: 10px; }
.tool-content:has(.tetris-widget) { display: flex; flex-direction: column; padding: 0; }
.tetris-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; position: relative; background: #1a1a2e; overflow: hidden; }
.tetris-canvas { display: block; width: 100%; flex: 1; min-height: 0; }
.tetris-hud { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; font-size: 13px; font-weight: 700; color: #fff; font-family: 'Arial Black', Arial, sans-serif; text-shadow: 1px 1px 0 rgba(0,0,0,0.5); pointer-events: none; z-index: 2; }
.tetris-hud.hidden { display: none; }
.tetris-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; z-index: 3; }
.tetris-overlay.hidden { display: none; }
.tetris-overlay-title { font-size: 28px; font-weight: 900; color: #a259ff; text-shadow: 2px 2px 0 #0f3460; margin-bottom: 6px; font-family: 'Arial Black', Arial, sans-serif; }
.tetris-overlay-sub { font-size: 13px; color: #e0e0e0; text-shadow: 1px 1px 0 #0f3460; margin-bottom: 14px; }
.tetris-overlay-score { font-size: 15px; color: #fff; text-shadow: 1px 1px 0 #0f3460; margin-bottom: 4px; }
.tetris-overlay-best { font-size: 12px; color: #f39c12; text-shadow: 1px 1px 0 #0f3460; margin-bottom: 14px; }
.tetris-overlay-gameover { font-size: 24px; font-weight: 900; color: #e74c3c; text-shadow: 2px 2px 0 #0f3460; margin-bottom: 6px; font-family: 'Arial Black', Arial, sans-serif; }
.tetris-play-btn { pointer-events: auto; padding: 10px 28px; font-size: 16px; font-weight: 700; border: none; border-radius: 25px; background: #a259ff; color: #fff; cursor: pointer; box-shadow: 0 4px 0 #7b2fcc; transition: transform 0.1s, box-shadow 0.1s; }
.tetris-play-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 0 #7b2fcc; }
.tetris-play-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #7b2fcc; }
.tetris-speed-row { display: flex; gap: 6px; margin-bottom: 14px; pointer-events: auto; }
.tetris-speed-btn { padding: 5px 12px; border: 2px solid #a259ff; border-radius: 15px; background: transparent; color: #a259ff; cursor: pointer; font-size: 11px; font-weight: 700; transition: background 0.15s, color 0.15s; }
.tetris-speed-btn:hover { background: rgba(162,89,255,0.15); }
.tetris-speed-btn.active { background: #a259ff; color: #fff; }
.tetris-next-label { font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }

/* Memory Match Widget Styles */
.memmatch-widget { padding: 8px; display: flex; flex-direction: column; align-items: center; user-select: none; position: relative; }
.memmatch-toolbar { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; width: 100%; flex-wrap: wrap; }
.memmatch-grid { display: grid; gap: 6px; justify-content: center; width: 100%; padding: 4px; }
.memmatch-card { aspect-ratio: 1; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px; background: var(--bg-secondary); border: 2px solid var(--border-color); transition: transform 0.2s, background 0.2s; min-height: 44px; }
.memmatch-card:hover { border-color: var(--text-muted); }
.memmatch-card-up { background: var(--bg-primary); border-color: #3498db; transform: scale(1.03); cursor: default; }
.memmatch-card-matched { background: rgba(46, 204, 113, 0.1); border-color: #27ae60; opacity: 0.7; cursor: default; }
.memmatch-win-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.93); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; border-radius: 6px; }
.memmatch-win-title { font-size: 24px; font-weight: 700; color: #27ae60; margin-bottom: 8px; }
.memmatch-win-stats { font-size: 14px; color: var(--text-secondary); margin-bottom: 4px; }
.memmatch-win-best { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }
`;
    document.head.appendChild(style);
})();

// =============================================
// CONSTANTS & STATE
// =============================================

var CHESS_UNICODE = {
    wK: '\u2654', wQ: '\u2655', wR: '\u2656', wB: '\u2657', wN: '\u2658', wP: '\u2659',
    bK: '\u265A', bQ: '\u265B', bR: '\u265C', bB: '\u265D', bN: '\u265E', bP: '\u265F'
};

var CHESS_INITIAL_BOARD = [
    ['bR','bN','bB','bQ','bK','bB','bN','bR'],
    ['bP','bP','bP','bP','bP','bP','bP','bP'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['wP','wP','wP','wP','wP','wP','wP','wP'],
    ['wR','wN','wB','wQ','wK','wB','wN','wR']
];

var _chessState = new WeakMap();

// =============================================
// INSTANCE & STORAGE
// =============================================

function chessGetToolId(el) {
    var w = el.closest('.chess-widget');
    if (!w) return null;
    var tool = w.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function chessGetState(widget) {
    if (!_chessState.has(widget)) {
        _chessState.set(widget, {
            board: chessDeepCopyBoard(CHESS_INITIAL_BOARD),
            turn: 'w',
            selected: null,
            validMoves: [],
            moveHistory: [],
            capturedWhite: [],
            capturedBlack: [],
            gameOver: false,
            inCheck: false,
            undoStack: [],
            aiMode: 'off'
        });
    }
    return _chessState.get(widget);
}

function chessGetData(toolId) {
    if (!toolId) return null;
    var custs = loadToolCustomizations();
    return custs[toolId] ? custs[toolId].chessData || null : null;
}

function chessSaveData(toolId, st) {
    if (!toolId) return;
    var custs = loadToolCustomizations();
    if (!custs[toolId]) custs[toolId] = {};
    custs[toolId].chessData = {
        board: st.board,
        turn: st.turn,
        moveHistory: st.moveHistory,
        capturedWhite: st.capturedWhite,
        capturedBlack: st.capturedBlack,
        gameOver: st.gameOver,
        inCheck: st.inCheck,
        undoStack: st.undoStack,
        aiMode: st.aiMode || 'off'
    };
    saveToolCustomizations(custs);
}

function chessDeepCopyBoard(board) {
    return board.map(function(row) { return row.slice(); });
}

// =============================================
// INIT & RENDERING
// =============================================

function chessInit() {
    document.querySelectorAll('.chess-widget').forEach(function(widget) {
        if (widget.dataset.inited) return;
        widget.dataset.inited = '1';

        var st = chessGetState(widget);
        var toolId = chessGetToolId(widget);
        var saved = chessGetData(toolId);
        if (saved) {
            st.board = saved.board;
            st.turn = saved.turn;
            st.moveHistory = saved.moveHistory || [];
            st.capturedWhite = saved.capturedWhite || [];
            st.capturedBlack = saved.capturedBlack || [];
            st.gameOver = saved.gameOver || false;
            st.inCheck = saved.inCheck || false;
            st.undoStack = saved.undoStack || [];
            st.aiMode = saved.aiMode || 'off';
        }

        // Sync mode dropdown
        var modeSelect = widget.querySelector('.chess-mode-select');
        if (modeSelect) modeSelect.value = st.aiMode;

        var canvas = widget.querySelector('.chess-canvas');
        var wrap = widget.querySelector('.chess-canvas-wrap');

        // Canvas click
        canvas.addEventListener('click', function(e) { chessCanvasClick(widget, e); });

        // Touch support
        canvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            var touch = e.changedTouches[0];
            var rect = canvas.getBoundingClientRect();
            var fakeEvent = { offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top };
            chessCanvasClick(widget, fakeEvent);
        });

        // ResizeObserver
        var resizeTimer = null;
        var observer = new ResizeObserver(function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() { chessResizeCanvas(widget); }, 50);
        });
        observer.observe(wrap);

        // Initial size + render
        chessResizeCanvas(widget);

        // If AI mode and it's AI's turn, trigger AI move
        if (st.aiMode === 'black' && st.turn === 'b' && !st.gameOver) {
            setTimeout(function() { chessAIMakeMove(widget); }, 200);
        }
    });
}

function chessRender(widget) {
    chessDrawBoard(widget);
    chessUpdateUI(widget);
    var toolId = chessGetToolId(widget);
    var st = chessGetState(widget);
    chessSaveData(toolId, st);
}

function chessDrawBoard(widget) {
    var canvas = widget.querySelector('.chess-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var st = chessGetState(widget);
    var size = canvas.width;
    var sq = size / 8;

    ctx.clearRect(0, 0, size, size);

    // Draw squares
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            var isLight = (r + c) % 2 === 0;
            ctx.fillStyle = isLight ? '#f0d9b5' : '#b58863';

            // Highlight selected square
            if (st.selected && st.selected.row === r && st.selected.col === c) {
                ctx.fillStyle = 'rgba(255, 255, 100, 0.7)';
            }

            // Highlight king in check
            if (st.inCheck && !st.gameOver) {
                var piece = st.board[r][c];
                if (piece && piece[1] === 'K' && piece[0] === st.turn) {
                    ctx.fillStyle = 'rgba(231, 76, 60, 0.6)';
                }
            }

            ctx.fillRect(c * sq, r * sq, sq, sq);
        }
    }

    // Draw valid move indicators
    for (var i = 0; i < st.validMoves.length; i++) {
        var m = st.validMoves[i];
        var cx = m.col * sq + sq / 2;
        var cy = m.row * sq + sq / 2;
        if (st.board[m.row][m.col]) {
            // Capture: ring around square
            ctx.beginPath();
            ctx.arc(cx, cy, sq * 0.42, 0, Math.PI * 2);
            ctx.lineWidth = sq * 0.08;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.stroke();
        } else {
            // Empty: small dot
            ctx.beginPath();
            ctx.arc(cx, cy, sq * 0.15, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fill();
        }
    }

    // Draw pieces
    var fontSize = Math.max(sq * 0.75, 12);
    ctx.font = fontSize + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            var piece = st.board[r][c];
            if (piece) {
                var uc = CHESS_UNICODE[piece];
                if (uc) {
                    // Draw shadow for white pieces on light squares for readability
                    if (piece[0] === 'w') {
                        ctx.fillStyle = 'rgba(0,0,0,0.3)';
                        ctx.fillText(uc, c * sq + sq / 2 + 1, r * sq + sq / 2 + 1);
                    }
                    ctx.fillStyle = piece[0] === 'w' ? '#ffffff' : '#000000';
                    ctx.fillText(uc, c * sq + sq / 2, r * sq + sq / 2);
                    // Stroke for contrast
                    ctx.lineWidth = 0.5;
                    ctx.strokeStyle = piece[0] === 'w' ? '#333333' : '#333333';
                    ctx.strokeText(uc, c * sq + sq / 2, r * sq + sq / 2);
                }
            }
        }
    }

    // File labels (a-h)
    ctx.font = Math.max(sq * 0.22, 8) + 'px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    for (var c = 0; c < 8; c++) {
        var isLight = (7 + c) % 2 === 0;
        ctx.fillStyle = isLight ? '#b58863' : '#f0d9b5';
        ctx.fillText(chessColToFile(c), c * sq + sq - 2, 8 * sq - 2);
    }

    // Rank labels (1-8)
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    for (var r = 0; r < 8; r++) {
        var isLight = (r + 0) % 2 === 0;
        ctx.fillStyle = isLight ? '#b58863' : '#f0d9b5';
        ctx.fillText(chessRowToRank(r), 2, r * sq + 2);
    }
}

function chessUpdateUI(widget) {
    var st = chessGetState(widget);

    // Sync mode dropdown
    var modeSelect = widget.querySelector('.chess-mode-select');
    if (modeSelect) modeSelect.value = st.aiMode || 'off';

    // Turn indicator
    var turnEl = widget.querySelector('.chess-turn');
    if (turnEl) {
        if (st.gameOver) {
            turnEl.textContent = 'Game Over';
        } else if (st.aiMode === 'black' && st.turn === 'b') {
            turnEl.textContent = 'AI thinking...';
        } else {
            turnEl.textContent = (st.turn === 'w' ? 'White' : 'Black') + "'s turn";
        }
    }

    // Status
    var statusEl = widget.querySelector('.chess-status');
    if (statusEl) {
        statusEl.className = 'chess-status';
        if (st.gameOver) {
            if (chessIsCheckmate(st.board, st.turn)) {
                statusEl.textContent = 'Checkmate! ' + (st.turn === 'w' ? 'Black' : 'White') + ' wins!';
                statusEl.classList.add('checkmate');
            } else {
                statusEl.textContent = 'Stalemate! Draw.';
                statusEl.classList.add('stalemate');
            }
        } else if (st.inCheck) {
            statusEl.textContent = 'Check!';
            statusEl.classList.add('check');
        } else {
            statusEl.textContent = '';
        }
    }

    // Captured pieces
    var capWhiteEl = widget.querySelector('.chess-captured-white');
    var capBlackEl = widget.querySelector('.chess-captured-black');
    if (capWhiteEl) {
        capWhiteEl.textContent = st.capturedWhite.map(function(p) { return CHESS_UNICODE[p] || ''; }).join('');
    }
    if (capBlackEl) {
        capBlackEl.textContent = st.capturedBlack.map(function(p) { return CHESS_UNICODE[p] || ''; }).join('');
    }

    // Move history
    var histEl = widget.querySelector('.chess-history');
    if (histEl) {
        var html = '';
        for (var i = 0; i < st.moveHistory.length; i += 2) {
            var moveNum = Math.floor(i / 2) + 1;
            var whiteMove = st.moveHistory[i] || '';
            var blackMove = st.moveHistory[i + 1] || '';
            var isLast = (i + 2 >= st.moveHistory.length);
            html += '<div class="chess-history-move' + (isLast ? ' last' : '') + '">' +
                moveNum + '. ' + whiteMove + (blackMove ? ' ' + blackMove : '') + '</div>';
        }
        histEl.innerHTML = html;
        histEl.scrollTop = histEl.scrollHeight;
    }
}

function chessResizeCanvas(widget) {
    var canvas = widget.querySelector('.chess-canvas');
    var wrap = widget.querySelector('.chess-canvas-wrap');
    if (!canvas || !wrap) return;
    var rect = wrap.getBoundingClientRect();
    var sz = Math.max(Math.floor(Math.min(rect.width, rect.height)), 64);
    if (canvas.width === sz && canvas.height === sz) return;
    canvas.width = sz;
    canvas.height = sz;
    canvas.style.width = sz + 'px';
    canvas.style.height = sz + 'px';
    chessRender(widget);
}

// =============================================
// INTERACTION
// =============================================

function chessCanvasClick(widget, e) {
    var st = chessGetState(widget);
    if (st.gameOver) return;
    // Block clicks when it's AI's turn
    if (st.aiMode === 'black' && st.turn === 'b') return;

    var canvas = widget.querySelector('.chess-canvas');
    var sq = canvas.width / 8;
    var pos = chessPixelToBoard(e.offsetX, e.offsetY, sq);
    if (pos.row < 0 || pos.row > 7 || pos.col < 0 || pos.col > 7) return;

    var clicked = st.board[pos.row][pos.col];

    // If a piece is selected, check if clicking a valid move
    if (st.selected) {
        var isValid = false;
        for (var i = 0; i < st.validMoves.length; i++) {
            if (st.validMoves[i].row === pos.row && st.validMoves[i].col === pos.col) {
                isValid = true;
                break;
            }
        }
        if (isValid) {
            chessExecuteMove(widget, st.selected.row, st.selected.col, pos.row, pos.col);
            st.selected = null;
            st.validMoves = [];
            chessRender(widget);
            // Trigger AI move if applicable
            if (st.aiMode === 'black' && st.turn === 'b' && !st.gameOver) {
                setTimeout(function() { chessAIMakeMove(widget); }, 200);
            }
            return;
        }

        // Clicking own piece: re-select
        if (clicked && clicked[0] === st.turn) {
            st.selected = { row: pos.row, col: pos.col };
            st.validMoves = chessGetValidMoves(st.board, pos.row, pos.col, st.turn);
            chessRender(widget);
            return;
        }

        // Clicking elsewhere: deselect
        st.selected = null;
        st.validMoves = [];
        chessRender(widget);
        return;
    }

    // No piece selected: select own piece
    if (clicked && clicked[0] === st.turn) {
        st.selected = { row: pos.row, col: pos.col };
        st.validMoves = chessGetValidMoves(st.board, pos.row, pos.col, st.turn);
        chessRender(widget);
    }
}

function chessPixelToBoard(x, y, sqSize) {
    return {
        row: Math.floor(y / sqSize),
        col: Math.floor(x / sqSize)
    };
}

// =============================================
// MOVE VALIDATION
// =============================================

function chessGetValidMoves(board, row, col, turn) {
    var raw = chessGetRawMoves(board, row, col);
    var valid = [];
    for (var i = 0; i < raw.length; i++) {
        if (!chessWouldBeInCheck(board, row, col, raw[i].row, raw[i].col, turn)) {
            valid.push(raw[i]);
        }
    }
    return valid;
}

function chessGetRawMoves(board, row, col) {
    var piece = board[row][col];
    if (!piece) return [];
    var color = piece[0];
    var type = piece[1];
    switch (type) {
        case 'P': return chessPawnMoves(board, row, col, color);
        case 'R': return chessSlidingMoves(board, row, col, color, [[-1,0],[1,0],[0,-1],[0,1]]);
        case 'N': return chessKnightMoves(board, row, col, color);
        case 'B': return chessSlidingMoves(board, row, col, color, [[-1,-1],[-1,1],[1,-1],[1,1]]);
        case 'Q': return chessSlidingMoves(board, row, col, color, [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]);
        case 'K': return chessKingMoves(board, row, col, color);
        default: return [];
    }
}

function chessPawnMoves(board, r, c, color) {
    var moves = [];
    var dir = color === 'w' ? -1 : 1;
    var startRow = color === 'w' ? 6 : 1;

    // Forward one
    var nr = r + dir;
    if (nr >= 0 && nr <= 7 && !board[nr][c]) {
        moves.push({ row: nr, col: c });
        // Forward two from start
        var nr2 = r + dir * 2;
        if (r === startRow && !board[nr2][c]) {
            moves.push({ row: nr2, col: c });
        }
    }

    // Diagonal captures
    for (var dc = -1; dc <= 1; dc += 2) {
        var nc = c + dc;
        if (nc >= 0 && nc <= 7 && nr >= 0 && nr <= 7) {
            var target = board[nr][nc];
            if (target && target[0] !== color) {
                moves.push({ row: nr, col: nc });
            }
        }
    }

    return moves;
}

function chessSlidingMoves(board, r, c, color, dirs) {
    var moves = [];
    for (var d = 0; d < dirs.length; d++) {
        var dr = dirs[d][0], dc = dirs[d][1];
        var nr = r + dr, nc = c + dc;
        while (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
            var target = board[nr][nc];
            if (!target) {
                moves.push({ row: nr, col: nc });
            } else {
                if (target[0] !== color) {
                    moves.push({ row: nr, col: nc });
                }
                break;
            }
            nr += dr;
            nc += dc;
        }
    }
    return moves;
}

function chessKnightMoves(board, r, c, color) {
    var moves = [];
    var offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (var i = 0; i < offsets.length; i++) {
        var nr = r + offsets[i][0], nc = c + offsets[i][1];
        if (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
            var target = board[nr][nc];
            if (!target || target[0] !== color) {
                moves.push({ row: nr, col: nc });
            }
        }
    }
    return moves;
}

function chessKingMoves(board, r, c, color) {
    var moves = [];
    for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            var nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
                var target = board[nr][nc];
                if (!target || target[0] !== color) {
                    moves.push({ row: nr, col: nc });
                }
            }
        }
    }
    return moves;
}

// =============================================
// CHECK & ENDGAME
// =============================================

function chessFindKing(board, color) {
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            if (board[r][c] === color + 'K') {
                return { row: r, col: c };
            }
        }
    }
    return null;
}

function chessIsSquareAttacked(board, r, c, byColor) {
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            var piece = board[row][col];
            if (piece && piece[0] === byColor) {
                var moves = chessGetRawMoves(board, row, col);
                for (var i = 0; i < moves.length; i++) {
                    if (moves[i].row === r && moves[i].col === c) return true;
                }
            }
        }
    }
    return false;
}

function chessIsInCheck(board, color) {
    var king = chessFindKing(board, color);
    if (!king) return false;
    var enemy = color === 'w' ? 'b' : 'w';
    return chessIsSquareAttacked(board, king.row, king.col, enemy);
}

function chessWouldBeInCheck(board, fr, fc, tr, tc, color) {
    var copy = chessDeepCopyBoard(board);
    copy[tr][tc] = copy[fr][fc];
    copy[fr][fc] = null;
    return chessIsInCheck(copy, color);
}

function chessIsCheckmate(board, color) {
    return chessIsInCheck(board, color) && !chessHasAnyLegalMove(board, color);
}

function chessIsStalemate(board, color) {
    return !chessIsInCheck(board, color) && !chessHasAnyLegalMove(board, color);
}

function chessHasAnyLegalMove(board, color) {
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            var piece = board[r][c];
            if (piece && piece[0] === color) {
                var moves = chessGetValidMoves(board, r, c, color);
                if (moves.length > 0) return true;
            }
        }
    }
    return false;
}

// =============================================
// ACTIONS
// =============================================

function chessExecuteMove(widget, fr, fc, tr, tc) {
    var st = chessGetState(widget);
    var piece = st.board[fr][fc];
    var captured = st.board[tr][tc];

    // Save undo state
    st.undoStack.push({
        board: chessDeepCopyBoard(st.board),
        turn: st.turn,
        capturedWhite: st.capturedWhite.slice(),
        capturedBlack: st.capturedBlack.slice(),
        inCheck: st.inCheck,
        gameOver: st.gameOver
    });

    // Record notation before moving
    var notation = chessMoveNotation(st.board, piece, fr, fc, tr, tc, captured);

    // Execute move
    st.board[tr][tc] = piece;
    st.board[fr][fc] = null;

    // Pawn promotion (auto-queen)
    if (piece[1] === 'P' && (tr === 0 || tr === 7)) {
        st.board[tr][tc] = piece[0] + 'Q';
        notation += '=Q';
    }

    // Track captures
    if (captured) {
        if (captured[0] === 'w') {
            st.capturedWhite.push(captured);
        } else {
            st.capturedBlack.push(captured);
        }
    }

    // Switch turn
    st.turn = st.turn === 'w' ? 'b' : 'w';

    // Check for check/mate/stalemate
    st.inCheck = chessIsInCheck(st.board, st.turn);
    if (chessIsCheckmate(st.board, st.turn)) {
        notation += '#';
        st.gameOver = true;
    } else if (chessIsStalemate(st.board, st.turn)) {
        st.gameOver = true;
    } else if (st.inCheck) {
        notation += '+';
    }

    st.moveHistory.push(notation);
}

function chessMoveNotation(board, piece, fr, fc, tr, tc, captured) {
    var type = piece[1];
    if (type === 'P') {
        if (captured) {
            return chessColToFile(fc) + 'x' + chessColToFile(tc) + chessRowToRank(tr);
        }
        return chessColToFile(tc) + chessRowToRank(tr);
    }
    var prefix = type;
    var capStr = captured ? 'x' : '';
    return prefix + capStr + chessColToFile(tc) + chessRowToRank(tr);
}

function chessNewGame(btn) {
    var widget = btn.closest('.chess-widget');
    if (!widget) return;
    var st = chessGetState(widget);
    var preserveMode = st.aiMode || 'off';
    st.board = chessDeepCopyBoard(CHESS_INITIAL_BOARD);
    st.turn = 'w';
    st.selected = null;
    st.validMoves = [];
    st.moveHistory = [];
    st.capturedWhite = [];
    st.capturedBlack = [];
    st.gameOver = false;
    st.inCheck = false;
    st.undoStack = [];
    st.aiMode = preserveMode;
    chessRender(widget);
}

function chessUndo(btn) {
    var widget = btn.closest('.chess-widget');
    if (!widget) return;
    var st = chessGetState(widget);
    if (st.undoStack.length === 0) return;

    // In AI mode, undo both AI's move and human's move
    var undoCount = (st.aiMode === 'black' && st.undoStack.length >= 2) ? 2 : 1;
    for (var i = 0; i < undoCount; i++) {
        if (st.undoStack.length === 0) break;
        var prev = st.undoStack.pop();
        st.board = prev.board;
        st.turn = prev.turn;
        st.capturedWhite = prev.capturedWhite;
        st.capturedBlack = prev.capturedBlack;
        st.inCheck = prev.inCheck;
        st.gameOver = prev.gameOver;
        st.moveHistory.pop();
    }
    st.selected = null;
    st.validMoves = [];
    chessRender(widget);
}

function chessColToFile(col) {
    return String.fromCharCode(97 + col);
}

function chessRowToRank(row) {
    return String(8 - row);
}

// =============================================
// CHESS AI
// =============================================

var CHESS_PIECE_VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };

// Piece-square tables (from white's perspective, index = row*8+col)
var CHESS_PST = {
    P: [
         0,  0,  0,  0,  0,  0,  0,  0,
        50, 50, 50, 50, 50, 50, 50, 50,
        10, 10, 20, 30, 30, 20, 10, 10,
         5,  5, 10, 25, 25, 10,  5,  5,
         0,  0,  0, 20, 20,  0,  0,  0,
         5, -5,-10,  0,  0,-10, -5,  5,
         5, 10, 10,-20,-20, 10, 10,  5,
         0,  0,  0,  0,  0,  0,  0,  0
    ],
    N: [
       -50,-40,-30,-30,-30,-30,-40,-50,
       -40,-20,  0,  0,  0,  0,-20,-40,
       -30,  0, 10, 15, 15, 10,  0,-30,
       -30,  5, 15, 20, 20, 15,  5,-30,
       -30,  0, 15, 20, 20, 15,  0,-30,
       -30,  5, 10, 15, 15, 10,  5,-30,
       -40,-20,  0,  5,  5,  0,-20,-40,
       -50,-40,-30,-30,-30,-30,-40,-50
    ],
    B: [
       -20,-10,-10,-10,-10,-10,-10,-20,
       -10,  0,  0,  0,  0,  0,  0,-10,
       -10,  0, 10, 10, 10, 10,  0,-10,
       -10,  5,  5, 10, 10,  5,  5,-10,
       -10,  0, 10, 10, 10, 10,  0,-10,
       -10, 10, 10, 10, 10, 10, 10,-10,
       -10,  5,  0,  0,  0,  0,  5,-10,
       -20,-10,-10,-10,-10,-10,-10,-20
    ],
    R: [
         0,  0,  0,  0,  0,  0,  0,  0,
         5, 10, 10, 10, 10, 10, 10,  5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
         0,  0,  0,  5,  5,  0,  0,  0
    ],
    Q: [
       -20,-10,-10, -5, -5,-10,-10,-20,
       -10,  0,  0,  0,  0,  0,  0,-10,
       -10,  0,  5,  5,  5,  5,  0,-10,
        -5,  0,  5,  5,  5,  5,  0, -5,
         0,  0,  5,  5,  5,  5,  0, -5,
       -10,  5,  5,  5,  5,  5,  0,-10,
       -10,  0,  5,  0,  0,  0,  0,-10,
       -20,-10,-10, -5, -5,-10,-10,-20
    ],
    K: [
       -30,-40,-40,-50,-50,-40,-40,-30,
       -30,-40,-40,-50,-50,-40,-40,-30,
       -30,-40,-40,-50,-50,-40,-40,-30,
       -30,-40,-40,-50,-50,-40,-40,-30,
       -20,-30,-30,-40,-40,-30,-30,-20,
       -10,-20,-20,-20,-20,-20,-20,-10,
        20, 20,  0,  0,  0,  0, 20, 20,
        20, 30, 10,  0,  0, 10, 30, 20
    ]
};

function chessSetMode(sel) {
    var widget = sel.closest('.chess-widget');
    if (!widget) return;
    var st = chessGetState(widget);
    st.aiMode = sel.value;
    // Reset game when switching modes
    st.board = chessDeepCopyBoard(CHESS_INITIAL_BOARD);
    st.turn = 'w';
    st.selected = null;
    st.validMoves = [];
    st.moveHistory = [];
    st.capturedWhite = [];
    st.capturedBlack = [];
    st.gameOver = false;
    st.inCheck = false;
    st.undoStack = [];
    chessRender(widget);
}

function chessEvalBoard(board) {
    var score = 0;
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            var piece = board[r][c];
            if (!piece) continue;
            var type = piece[1];
            var value = CHESS_PIECE_VALUES[type] || 0;
            var pst = CHESS_PST[type];
            var posBonus = 0;
            if (pst) {
                if (piece[0] === 'w') {
                    posBonus = pst[r * 8 + c];
                } else {
                    // Mirror for black (row 0 becomes row 7)
                    posBonus = pst[(7 - r) * 8 + c];
                }
            }
            if (piece[0] === 'w') {
                score += value + posBonus;
            } else {
                score -= value + posBonus;
            }
        }
    }
    return score;
}

function chessAIGetAllMoves(board, color) {
    var moves = [];
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            var piece = board[r][c];
            if (piece && piece[0] === color) {
                var valid = chessGetValidMoves(board, r, c, color);
                for (var i = 0; i < valid.length; i++) {
                    moves.push({ fr: r, fc: c, tr: valid[i].row, tc: valid[i].col });
                }
            }
        }
    }
    // Order captures first (MVV-LVA) for better pruning
    moves.sort(function(a, b) {
        var captA = board[a.tr][a.tc];
        var captB = board[b.tr][b.tc];
        var scoreA = captA ? (CHESS_PIECE_VALUES[captA[1]] || 0) * 10 - (CHESS_PIECE_VALUES[board[a.fr][a.fc][1]] || 0) : -1;
        var scoreB = captB ? (CHESS_PIECE_VALUES[captB[1]] || 0) * 10 - (CHESS_PIECE_VALUES[board[b.fr][b.fc][1]] || 0) : -1;
        return scoreB - scoreA;
    });
    return moves;
}

function chessAISearch(board, depth, alpha, beta, isMaximizing) {
    var color = isMaximizing ? 'w' : 'b';
    if (depth === 0) return chessEvalBoard(board);

    var moves = chessAIGetAllMoves(board, color);
    if (moves.length === 0) {
        // No legal moves: checkmate or stalemate
        if (chessIsInCheck(board, color)) {
            // Checkmate: worst score for this side, prefer shorter mates
            return isMaximizing ? -100000 - depth : 100000 + depth;
        }
        return 0; // Stalemate
    }

    if (isMaximizing) {
        var maxEval = -Infinity;
        for (var i = 0; i < moves.length; i++) {
            var m = moves[i];
            var copy = chessDeepCopyBoard(board);
            copy[m.tr][m.tc] = copy[m.fr][m.fc];
            copy[m.fr][m.fc] = null;
            // Pawn promotion
            if (copy[m.tr][m.tc][1] === 'P' && m.tr === 0) copy[m.tr][m.tc] = 'wQ';
            var ev = chessAISearch(copy, depth - 1, alpha, beta, false);
            if (ev > maxEval) maxEval = ev;
            if (ev > alpha) alpha = ev;
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        var minEval = Infinity;
        for (var i = 0; i < moves.length; i++) {
            var m = moves[i];
            var copy = chessDeepCopyBoard(board);
            copy[m.tr][m.tc] = copy[m.fr][m.fc];
            copy[m.fr][m.fc] = null;
            // Pawn promotion
            if (copy[m.tr][m.tc][1] === 'P' && m.tr === 7) copy[m.tr][m.tc] = 'bQ';
            var ev = chessAISearch(copy, depth - 1, alpha, beta, true);
            if (ev < minEval) minEval = ev;
            if (ev < beta) beta = ev;
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function chessAIMakeMove(widget) {
    var st = chessGetState(widget);
    if (st.gameOver || st.turn !== 'b' || st.aiMode !== 'black') return;

    var moves = chessAIGetAllMoves(st.board, 'b');
    if (moves.length === 0) return;

    var bestMove = null;
    var bestScore = Infinity; // Minimizing for black
    for (var i = 0; i < moves.length; i++) {
        var m = moves[i];
        var copy = chessDeepCopyBoard(st.board);
        copy[m.tr][m.tc] = copy[m.fr][m.fc];
        copy[m.fr][m.fc] = null;
        if (copy[m.tr][m.tc][1] === 'P' && m.tr === 7) copy[m.tr][m.tc] = 'bQ';
        var score = chessAISearch(copy, 2, -Infinity, Infinity, true); // depth 2 remaining after this move = depth 3 total
        if (score < bestScore) {
            bestScore = score;
            bestMove = m;
        }
    }

    if (bestMove) {
        chessExecuteMove(widget, bestMove.fr, bestMove.fc, bestMove.tr, bestMove.tc);
        st.selected = null;
        st.validMoves = [];
        chessRender(widget);
    }
}

// =============================================
// SUDOKU GAME
// =============================================

var sudokuState = {};
var sudokuKeyListenerAdded = false;

function sudokuGetWidget(el) {
    return el.closest('.sudoku-widget');
}

function sudokuGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function sudokuEmptyNotes() {
    var notes = [];
    for (var i = 0; i < 9; i++) {
        notes[i] = [];
        for (var j = 0; j < 9; j++) {
            notes[i][j] = [];
        }
    }
    return notes;
}

function sudokuGetState(toolId) {
    if (!sudokuState[toolId]) {
        var customizations = loadToolCustomizations();
        var saved = customizations[toolId] && customizations[toolId].sudokuData;
        if (saved) {
            sudokuState[toolId] = {
                board: saved.board,
                solution: saved.solution,
                given: saved.given,
                notes: saved.notes || sudokuEmptyNotes(),
                selectedRow: -1,
                selectedCol: -1,
                pencilMode: false,
                timer: saved.timer || 0,
                timerInterval: null,
                mistakes: saved.mistakes || 0,
                difficulty: saved.difficulty || 'easy',
                history: saved.history || [],
                completed: saved.completed || false
            };
        } else {
            sudokuState[toolId] = null;
        }
    }
    return sudokuState[toolId];
}

function sudokuSaveData(toolId) {
    var s = sudokuState[toolId];
    if (!s) return;
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].sudokuData = {
        board: s.board,
        solution: s.solution,
        given: s.given,
        notes: s.notes,
        timer: s.timer,
        mistakes: s.mistakes,
        difficulty: s.difficulty,
        history: s.history,
        completed: s.completed
    };
    saveToolCustomizations(customizations);
}

// --- Puzzle generation ---

function sudokuShuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
}

function sudokuIsValid(board, row, col, num) {
    for (var i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
        if (board[i][col] === num) return false;
    }
    var br = Math.floor(row / 3) * 3;
    var bc = Math.floor(col / 3) * 3;
    for (var r = br; r < br + 3; r++) {
        for (var c = bc; c < bc + 3; c++) {
            if (board[r][c] === num) return false;
        }
    }
    return true;
}

function sudokuFillGrid(board) {
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                var nums = sudokuShuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (var i = 0; i < nums.length; i++) {
                    if (sudokuIsValid(board, r, c, nums[i])) {
                        board[r][c] = nums[i];
                        if (sudokuFillGrid(board)) return true;
                        board[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function sudokuGenerateSolution() {
    var board = [];
    for (var i = 0; i < 9; i++) {
        board[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    sudokuFillGrid(board);
    return board;
}

function sudokuCreatePuzzle(solution, difficulty) {
    var clues = difficulty === 'easy' ? 38 : (difficulty === 'medium' ? 30 : 24);
    var board = [];
    var given = [];
    for (var i = 0; i < 9; i++) {
        board[i] = solution[i].slice();
        given[i] = [true, true, true, true, true, true, true, true, true];
    }
    var positions = [];
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            positions.push([r, c]);
        }
    }
    sudokuShuffleArray(positions);
    var toRemove = 81 - clues;
    for (var p = 0; p < positions.length && p < toRemove; p++) {
        board[positions[p][0]][positions[p][1]] = 0;
        given[positions[p][0]][positions[p][1]] = false;
    }
    return { board: board, given: given };
}

// --- Game management ---

function sudokuNewGame(btn) {
    var toolId = sudokuGetToolId(btn);
    if (toolId) sudokuNewGameForToolId(toolId);
}

function sudokuNewGameForToolId(toolId) {
    var s = sudokuState[toolId];
    var difficulty = s ? s.difficulty : 'easy';
    if (s && s.timerInterval) clearInterval(s.timerInterval);

    var solution = sudokuGenerateSolution();
    var puzzle = sudokuCreatePuzzle(solution, difficulty);

    sudokuState[toolId] = {
        board: puzzle.board,
        solution: solution,
        given: puzzle.given,
        notes: sudokuEmptyNotes(),
        selectedRow: -1,
        selectedCol: -1,
        pencilMode: false,
        timer: 0,
        timerInterval: null,
        mistakes: 0,
        difficulty: difficulty,
        history: [],
        completed: false
    };

    sudokuSaveData(toolId);
    sudokuRender(toolId);
    sudokuStartTimer(toolId);
}

function sudokuSetDifficulty(sel) {
    var toolId = sudokuGetToolId(sel);
    if (!toolId) return;
    var s = sudokuGetState(toolId);
    if (s) s.difficulty = sel.value;
    sudokuNewGameForToolId(toolId);
}

// --- Validation ---

function sudokuCheckConflicts(board, row, col) {
    var num = board[row][col];
    if (num === 0) return [];
    var conflicts = [];
    for (var i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === num) conflicts.push([row, i]);
        if (i !== row && board[i][col] === num) conflicts.push([i, col]);
    }
    var br = Math.floor(row / 3) * 3;
    var bc = Math.floor(col / 3) * 3;
    for (var r = br; r < br + 3; r++) {
        for (var c = bc; c < bc + 3; c++) {
            if ((r !== row || c !== col) && board[r][c] === num) conflicts.push([r, c]);
        }
    }
    if (conflicts.length > 0) conflicts.push([row, col]);
    return conflicts;
}

function sudokuCheckWin(s) {
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            if (s.board[r][c] !== s.solution[r][c]) return false;
        }
    }
    return true;
}

// --- User actions (internal, take toolId) ---

function sudokuNumInputInternal(toolId, num) {
    var s = sudokuState[toolId];
    if (!s || s.completed) return;
    if (s.selectedRow < 0 || s.selectedCol < 0) return;
    var r = s.selectedRow, c = s.selectedCol;
    if (s.given[r][c]) return;

    if (s.pencilMode) {
        var notes = s.notes[r][c];
        s.history.push({ row: r, col: c, prevValue: s.board[r][c], prevNotes: notes.slice(), type: 'note' });
        var idx = notes.indexOf(num);
        if (idx >= 0) { notes.splice(idx, 1); } else { notes.push(num); notes.sort(); }
        sudokuSaveData(toolId);
        sudokuRender(toolId);
        return;
    }

    s.history.push({ row: r, col: c, prevValue: s.board[r][c], prevNotes: s.notes[r][c].slice(), type: 'value' });
    s.board[r][c] = num;
    s.notes[r][c] = [];
    if (num !== s.solution[r][c]) s.mistakes++;

    // Remove this number from notes in same row/col/box
    for (var i = 0; i < 9; i++) {
        var ni = s.notes[r][i].indexOf(num);
        if (ni >= 0) s.notes[r][i].splice(ni, 1);
        ni = s.notes[i][c].indexOf(num);
        if (ni >= 0) s.notes[i][c].splice(ni, 1);
    }
    var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (var ri = br; ri < br + 3; ri++) {
        for (var ci = bc; ci < bc + 3; ci++) {
            var ni2 = s.notes[ri][ci].indexOf(num);
            if (ni2 >= 0) s.notes[ri][ci].splice(ni2, 1);
        }
    }

    sudokuSaveData(toolId);
    if (sudokuCheckWin(s)) { s.completed = true; sudokuStopTimer(toolId); sudokuSaveData(toolId); }
    sudokuRender(toolId);
}

function sudokuClearCellInternal(toolId) {
    var s = sudokuState[toolId];
    if (!s || s.completed) return;
    if (s.selectedRow < 0 || s.selectedCol < 0) return;
    var r = s.selectedRow, c = s.selectedCol;
    if (s.given[r][c]) return;
    s.history.push({ row: r, col: c, prevValue: s.board[r][c], prevNotes: s.notes[r][c].slice(), type: 'clear' });
    s.board[r][c] = 0;
    s.notes[r][c] = [];
    sudokuSaveData(toolId);
    sudokuRender(toolId);
}

// --- User actions (button wrappers) ---

function sudokuCellClick(el, row, col) {
    var toolId = sudokuGetToolId(el);
    if (!toolId) return;
    var s = sudokuGetState(toolId);
    if (!s || s.completed) return;
    s.selectedRow = row;
    s.selectedCol = col;
    sudokuRender(toolId);
}

function sudokuNumInput(btn, num) {
    var toolId = sudokuGetToolId(btn);
    if (toolId) sudokuNumInputInternal(toolId, num);
}

function sudokuClearCell(btn) {
    var toolId = sudokuGetToolId(btn);
    if (toolId) sudokuClearCellInternal(toolId);
}

function sudokuHint(btn) {
    var toolId = sudokuGetToolId(btn);
    if (!toolId) return;
    var s = sudokuGetState(toolId);
    if (!s || s.completed) return;

    var empty = [];
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            if (s.board[r][c] === 0) empty.push([r, c]);
        }
    }
    if (empty.length === 0) return;

    var cell = empty[Math.floor(Math.random() * empty.length)];
    s.board[cell[0]][cell[1]] = s.solution[cell[0]][cell[1]];
    s.given[cell[0]][cell[1]] = true;
    s.notes[cell[0]][cell[1]] = [];
    s.selectedRow = cell[0];
    s.selectedCol = cell[1];

    sudokuSaveData(toolId);
    if (sudokuCheckWin(s)) { s.completed = true; sudokuStopTimer(toolId); sudokuSaveData(toolId); }
    sudokuRender(toolId);
}

function sudokuUndo(btn) {
    var toolId = sudokuGetToolId(btn);
    if (!toolId) return;
    var s = sudokuGetState(toolId);
    if (!s || s.completed || s.history.length === 0) return;

    var entry = s.history.pop();
    s.board[entry.row][entry.col] = entry.prevValue;
    s.notes[entry.row][entry.col] = entry.prevNotes;
    s.selectedRow = entry.row;
    s.selectedCol = entry.col;

    sudokuSaveData(toolId);
    sudokuRender(toolId);
}

function sudokuTogglePencil(btn) {
    var toolId = sudokuGetToolId(btn);
    if (!toolId) return;
    var s = sudokuGetState(toolId);
    if (!s) return;
    s.pencilMode = !s.pencilMode;
    sudokuRender(toolId);
}

function sudokuCheck(btn) {
    var toolId = sudokuGetToolId(btn);
    if (!toolId) return;
    var s = sudokuGetState(toolId);
    if (!s || s.completed) return;

    var widget = sudokuGetWidget(btn);
    var cells = widget.querySelectorAll('.sudoku-cell');
    cells.forEach(function(cell) {
        var r = parseInt(cell.getAttribute('data-row'));
        var c = parseInt(cell.getAttribute('data-col'));
        if (!s.given[r][c] && s.board[r][c] !== 0) {
            if (s.board[r][c] !== s.solution[r][c]) {
                cell.style.background = '#fce4e4';
                cell.style.transition = 'background 1.5s';
                setTimeout(function() { cell.style.background = ''; cell.style.transition = ''; }, 1500);
            } else {
                cell.style.background = '#d4edda';
                cell.style.transition = 'background 1.5s';
                setTimeout(function() { cell.style.background = ''; cell.style.transition = ''; }, 1500);
            }
        }
    });
}

// --- Timer ---

function sudokuStartTimer(toolId) {
    var s = sudokuState[toolId];
    if (!s || s.timerInterval) return;
    s.timerInterval = setInterval(function() {
        if (s.completed) { clearInterval(s.timerInterval); s.timerInterval = null; return; }
        s.timer++;
        var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
        tools.forEach(function(tool) {
            var timerEl = tool.querySelector('.sudoku-timer');
            if (timerEl) timerEl.textContent = sudokuFormatTime(s.timer);
        });
    }, 1000);
}

function sudokuStopTimer(toolId) {
    var s = sudokuState[toolId];
    if (s && s.timerInterval) {
        clearInterval(s.timerInterval);
        s.timerInterval = null;
    }
}

function sudokuFormatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var sec = seconds % 60;
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
}

// --- Rendering ---

function sudokuRender(toolId) {
    var s = sudokuState[toolId];
    if (!s) return;

    var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
    tools.forEach(function(tool) {
        var widget = tool.querySelector('.sudoku-widget');
        if (!widget) return;

        var timerEl = widget.querySelector('.sudoku-timer');
        if (timerEl) timerEl.textContent = sudokuFormatTime(s.timer);

        var mistakesEl = widget.querySelector('.sudoku-mistakes');
        if (mistakesEl) mistakesEl.textContent = s.mistakes + ' mistake' + (s.mistakes !== 1 ? 's' : '');

        var diffSel = widget.querySelector('.sudoku-difficulty');
        if (diffSel) diffSel.value = s.difficulty;

        var pencilBtn = widget.querySelector('.sudoku-pencil-btn');
        if (pencilBtn) {
            pencilBtn.style.background = s.pencilMode ? '#f39c12' : '';
            pencilBtn.style.color = s.pencilMode ? 'white' : '';
        }

        // Collect all conflicts
        var conflictSet = {};
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                if (s.board[r][c] !== 0) {
                    var cfs = sudokuCheckConflicts(s.board, r, c);
                    for (var ci = 0; ci < cfs.length; ci++) {
                        conflictSet[cfs[ci][0] + ',' + cfs[ci][1]] = true;
                    }
                }
            }
        }

        var selectedNum = 0;
        if (s.selectedRow >= 0 && s.selectedCol >= 0) {
            selectedNum = s.board[s.selectedRow][s.selectedCol];
        }

        // Render grid
        var grid = widget.querySelector('.sudoku-grid');
        if (grid) {
            var html = '';
            for (var r2 = 0; r2 < 9; r2++) {
                for (var c2 = 0; c2 < 9; c2++) {
                    var val = s.board[r2][c2];
                    var isGiven = s.given[r2][c2];
                    var isSelected = (r2 === s.selectedRow && c2 === s.selectedCol);
                    var isConflict = conflictSet[r2 + ',' + c2];
                    var isSameNum = (selectedNum > 0 && val === selectedNum && !isSelected);
                    var inSelectedRow = (r2 === s.selectedRow);
                    var inSelectedCol = (c2 === s.selectedCol);
                    var inSelectedBox = (s.selectedRow >= 0 && Math.floor(r2 / 3) === Math.floor(s.selectedRow / 3) && Math.floor(c2 / 3) === Math.floor(s.selectedCol / 3));

                    var borderRight = (c2 === 2 || c2 === 5) ? '2px solid var(--text-primary)' : '1px solid var(--border-color)';
                    var borderBottom = (r2 === 2 || r2 === 5) ? '2px solid var(--text-primary)' : '1px solid var(--border-color)';
                    var borderLeft = c2 === 0 ? 'none' : '0';
                    var borderTop = r2 === 0 ? 'none' : '0';

                    var cls = 'sudoku-cell';
                    if (isGiven) cls += ' given';
                    else if (val !== 0) cls += ' user';
                    if (isSelected) cls += ' selected';
                    else if (isSameNum) cls += ' same-num';
                    else if (isConflict && !isGiven) cls += ' conflict';

                    var style = 'border-right:' + borderRight + ';border-bottom:' + borderBottom + ';border-left:' + borderLeft + ';border-top:' + borderTop + ';';
                    if (!isSelected && !isSameNum && !(isConflict && !isGiven) && (inSelectedRow || inSelectedCol || inSelectedBox)) {
                        style += 'background:var(--bg-secondary);';
                    }

                    var cellContent = '';
                    if (val !== 0) {
                        cellContent = '' + val;
                    } else if (s.notes[r2] && s.notes[r2][c2] && s.notes[r2][c2].length > 0) {
                        cellContent = '<div class="sudoku-notes">';
                        for (var n = 1; n <= 9; n++) {
                            cellContent += '<span>' + (s.notes[r2][c2].indexOf(n) >= 0 ? n : '') + '</span>';
                        }
                        cellContent += '</div>';
                    }

                    html += '<div class="' + cls + '" data-row="' + r2 + '" data-col="' + c2 + '" style="' + style + '" onclick="sudokuCellClick(this,' + r2 + ',' + c2 + ')">' + cellContent + '</div>';
                }
            }
            grid.innerHTML = html;
        }

        // Win overlay
        var overlay = widget.querySelector('.sudoku-win-overlay');
        if (overlay) {
            overlay.style.display = s.completed ? 'flex' : 'none';
            if (s.completed) {
                var winStats = overlay.querySelector('.sudoku-win-stats');
                if (winStats) winStats.textContent = sudokuFormatTime(s.timer) + ' \u2022 ' + s.mistakes + ' mistake' + (s.mistakes !== 1 ? 's' : '');
            }
        }
    });
}

// --- Keyboard handler ---

function sudokuKeyHandler(e) {
    // Don't intercept if user is typing in an input/textarea
    var active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;

    var toolIds = Object.keys(sudokuState);
    for (var i = 0; i < toolIds.length; i++) {
        var tid = toolIds[i];
        var s = sudokuState[tid];
        if (!s || s.selectedRow < 0 || s.selectedCol < 0 || s.completed) continue;

        var toolEl = document.querySelector('.tool[data-tool="' + tid + '"]');
        if (!toolEl || toolEl.style.display === 'none') continue;

        var key = e.key;
        if (key >= '1' && key <= '9') { e.preventDefault(); sudokuNumInputInternal(tid, parseInt(key)); return; }
        if (key === 'Backspace' || key === 'Delete') { e.preventDefault(); sudokuClearCellInternal(tid); return; }
        if (key === 'ArrowUp' && s.selectedRow > 0) { e.preventDefault(); s.selectedRow--; sudokuRender(tid); return; }
        if (key === 'ArrowDown' && s.selectedRow < 8) { e.preventDefault(); s.selectedRow++; sudokuRender(tid); return; }
        if (key === 'ArrowLeft' && s.selectedCol > 0) { e.preventDefault(); s.selectedCol--; sudokuRender(tid); return; }
        if (key === 'ArrowRight' && s.selectedCol < 8) { e.preventDefault(); s.selectedCol++; sudokuRender(tid); return; }
    }
}

// --- Init ---

function sudokuInit() {
    document.querySelectorAll('.sudoku-widget').forEach(function(widget) {
        var tool = widget.closest('.tool');
        if (!tool) return;
        var toolId = tool.getAttribute('data-tool');
        if (!toolId) return;

        var s = sudokuGetState(toolId);
        if (!s) {
            sudokuState[toolId] = {
                board: [], solution: [], given: [], notes: sudokuEmptyNotes(),
                selectedRow: -1, selectedCol: -1, pencilMode: false,
                timer: 0, timerInterval: null, mistakes: 0,
                difficulty: 'easy', history: [], completed: false
            };
            sudokuNewGameForToolId(toolId);
        } else {
            sudokuRender(toolId);
            if (!s.completed) sudokuStartTimer(toolId);
        }
    });

    if (!sudokuKeyListenerAdded) {
        document.addEventListener('keydown', sudokuKeyHandler);
        sudokuKeyListenerAdded = true;
    }
}

// =============================================
// TYPING SPEED TEST
// =============================================

var TYPINGTEST_WORDS = [
    'the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you',
    'do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one',
    'all','would','there','their','what','so','up','out','if','about','who','get','which','go','me',
    'when','make','can','like','time','no','just','him','know','take','people','into','year','your',
    'good','some','could','them','see','other','than','then','now','look','only','come','its','over',
    'think','also','back','after','use','two','how','our','work','first','well','way','even','new',
    'want','because','any','these','give','day','most','us','great','between','need','large','often',
    'hand','high','place','hold','through','long','each','right','under','small','around','turn',
    'every','move','thing','general','change','here','play','why','before','home','must','big','still',
    'world','again','never','old','run','should','school','begin','food','start','city','point','group',
    'live','same','help','own','away','end','learn','close','thought','head','house','open','keep',
    'number','part','write','real','life','few','left','found','stand','page','line','form','water',
    'story','young','while','last','state','much','hard','off','read','very','name','ask','try','door',
    'set','both','kind','build','next','car','light','three','night','call','put','follow','side',
    'being','watch','face','family','sure','fact','enough','power','system','many','piece','those',
    'country','plant','seem','plan','letter','land','game','child','early','body','above','table',
    'love','south','money','serve','book','hear','horse','air','color','cover','fire','class','best'
];

var typingTestState = {};

function typingTestGetWidget(el) {
    return el.closest('.typingtest-widget');
}

function typingTestGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function typingTestGetState(toolId) {
    if (!typingTestState[toolId]) {
        typingTestState[toolId] = {
            words: [],
            currentIndex: 0,
            typedWords: [],
            correctChars: 0,
            incorrectChars: 0,
            totalChars: 0,
            timer: 0,
            timerInterval: null,
            duration: 30,
            started: false,
            finished: false,
            startTime: null
        };
    }
    return typingTestState[toolId];
}

function typingTestSaveData(toolId) {
    var s = typingTestState[toolId];
    if (!s) return;
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    if (!customizations[toolId].typingTestData) customizations[toolId].typingTestData = {};
    customizations[toolId].typingTestData.duration = s.duration;
    if (s.bestScores) customizations[toolId].typingTestData.bestScores = s.bestScores;
    saveToolCustomizations(customizations);
}

function typingTestLoadBest(toolId) {
    var customizations = loadToolCustomizations();
    var data = customizations[toolId] && customizations[toolId].typingTestData;
    return (data && data.bestScores) ? data.bestScores : {};
}

function typingTestGenerateWords(count) {
    var words = [];
    for (var i = 0; i < count; i++) {
        words.push(TYPINGTEST_WORDS[Math.floor(Math.random() * TYPINGTEST_WORDS.length)]);
    }
    return words;
}

function typingTestNewGame(btn) {
    var widget = typingTestGetWidget(btn);
    if (!widget) return;
    var toolId = typingTestGetToolId(widget);
    if (!toolId) return;
    var s = typingTestGetState(toolId);
    if (s.timerInterval) clearInterval(s.timerInterval);
    s.words = typingTestGenerateWords(200);
    s.currentIndex = 0;
    s.typedWords = [];
    s.correctChars = 0;
    s.incorrectChars = 0;
    s.totalChars = 0;
    s.timer = s.duration;
    s.timerInterval = null;
    s.started = false;
    s.finished = false;
    s.startTime = null;
    s.bestScores = typingTestLoadBest(toolId);
    typingTestRender(toolId);
    var input = widget.querySelector('.typingtest-input');
    if (input) { input.disabled = false; input.value = ''; input.focus(); }
}

function typingTestSetDuration(sel) {
    var widget = typingTestGetWidget(sel);
    if (!widget) return;
    var toolId = typingTestGetToolId(widget);
    if (!toolId) return;
    var s = typingTestGetState(toolId);
    s.duration = parseInt(sel.value);
    typingTestNewGame(sel);
}

function typingTestStartTimer(toolId) {
    var s = typingTestState[toolId];
    if (!s || s.timerInterval) return;
    s.startTime = Date.now();
    s.timerInterval = setInterval(function() {
        var elapsed = Math.floor((Date.now() - s.startTime) / 1000);
        s.timer = Math.max(s.duration - elapsed, 0);
        // Update timer display directly for performance
        var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
        tools.forEach(function(tool) {
            var timerEl = tool.querySelector('.typingtest-timer');
            if (timerEl) timerEl.textContent = s.timer + 's';
            var wpmEl = tool.querySelector('.typingtest-wpm');
            if (wpmEl) wpmEl.textContent = typingTestCalcWPM(s);
            var accEl = tool.querySelector('.typingtest-acc');
            if (accEl) accEl.textContent = typingTestCalcAccuracy(s) + '%';
        });
        if (s.timer <= 0) {
            typingTestFinish(toolId);
        }
    }, 200);
}

function typingTestStopTimer(toolId) {
    var s = typingTestState[toolId];
    if (s && s.timerInterval) {
        clearInterval(s.timerInterval);
        s.timerInterval = null;
    }
}

function typingTestFinish(toolId) {
    var s = typingTestState[toolId];
    if (!s || s.finished) return;
    typingTestStopTimer(toolId);
    s.finished = true;
    s.timer = 0;
    // Save best score
    var wpm = typingTestCalcWPM(s);
    var key = '' + s.duration;
    if (!s.bestScores) s.bestScores = typingTestLoadBest(toolId);
    if (!s.bestScores[key] || wpm > s.bestScores[key]) {
        s.bestScores[key] = wpm;
    }
    typingTestSaveData(toolId);
    typingTestRender(toolId);
    // Disable input
    var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
    tools.forEach(function(tool) {
        var input = tool.querySelector('.typingtest-input');
        if (input) input.disabled = true;
    });
}

function typingTestCalcWPM(s) {
    if (!s.started) return 0;
    var elapsed = s.finished ? s.duration : Math.max((Date.now() - s.startTime) / 1000, 1);
    var minutes = elapsed / 60;
    // Standard WPM: correct characters / 5 / minutes
    var wpm = Math.round((s.correctChars / 5) / minutes);
    return Math.max(wpm, 0);
}

function typingTestCalcAccuracy(s) {
    if (s.totalChars === 0) return 100;
    return Math.round((s.correctChars / s.totalChars) * 100);
}

function typingTestHandleInput(el) {
    var widget = typingTestGetWidget(el);
    if (!widget) return;
    var toolId = typingTestGetToolId(widget);
    if (!toolId) return;
    var s = typingTestGetState(toolId);
    if (s.finished) return;

    // Start timer on first keypress
    if (!s.started) {
        s.started = true;
        typingTestStartTimer(toolId);
    }

    var inputVal = el.value;
    var targetWord = s.words[s.currentIndex];

    // Space or completed word — advance
    if (inputVal.endsWith(' ') && inputVal.trim().length > 0) {
        var typed = inputVal.trim();
        var isCorrect = (typed === targetWord);

        // Count characters
        var minLen = Math.min(typed.length, targetWord.length);
        for (var i = 0; i < minLen; i++) {
            s.totalChars++;
            if (typed[i] === targetWord[i]) {
                s.correctChars++;
            } else {
                s.incorrectChars++;
            }
        }
        // Extra chars typed beyond word length
        if (typed.length > targetWord.length) {
            s.totalChars += typed.length - targetWord.length;
            s.incorrectChars += typed.length - targetWord.length;
        }
        // Missed chars (typed less than target)
        if (typed.length < targetWord.length) {
            s.totalChars += targetWord.length - typed.length;
            s.incorrectChars += targetWord.length - typed.length;
        }

        s.typedWords.push({ text: typed, correct: isCorrect });
        s.currentIndex++;
        el.value = '';

        // Generate more words if needed
        if (s.currentIndex >= s.words.length - 20) {
            s.words = s.words.concat(typingTestGenerateWords(100));
        }

        typingTestRender(toolId);
        return;
    }

    // Live character-level rendering of current word
    typingTestRenderWords(toolId);
}

function typingTestRenderWords(toolId) {
    var s = typingTestState[toolId];
    if (!s) return;

    var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
    tools.forEach(function(tool) {
        var wordsEl = tool.querySelector('.typingtest-words');
        if (!wordsEl) return;
        var inner = wordsEl.querySelector('.typingtest-words-inner');
        if (!inner) return;
        var input = tool.querySelector('.typingtest-input');
        var inputVal = input ? input.value : '';

        // Build words HTML showing ~60 words from a few words before current
        var startIdx = Math.max(0, s.currentIndex - 3);
        var endIdx = Math.min(s.words.length, s.currentIndex + 60);
        var html = '';

        for (var wi = startIdx; wi < endIdx; wi++) {
            var word = s.words[wi];
            var cls = 'typingtest-word';

            if (wi < s.currentIndex) {
                // Already typed
                cls += s.typedWords[wi] && s.typedWords[wi].correct ? ' correct' : ' incorrect';
                html += '<span class="' + cls + '">' + typingTestEscape(word) + '</span>';
            } else if (wi === s.currentIndex) {
                // Current word — show char-by-char coloring
                cls += ' active';
                var chars = '';
                for (var ci = 0; ci < word.length; ci++) {
                    var charCls = 'typingtest-char';
                    if (ci < inputVal.length) {
                        charCls += inputVal[ci] === word[ci] ? ' correct' : ' incorrect';
                    } else if (ci === inputVal.length) {
                        charCls += ' cursor';
                    }
                    chars += '<span class="' + charCls + '">' + typingTestEscape(word[ci]) + '</span>';
                }
                // Extra chars beyond word length
                if (inputVal.length > word.length) {
                    for (var ei = word.length; ei < inputVal.length; ei++) {
                        chars += '<span class="typingtest-extra">' + typingTestEscape(inputVal[ei]) + '</span>';
                    }
                }
                html += '<span class="' + cls + '">' + chars + '</span>';
            } else {
                // Future words
                html += '<span class="' + cls + '">' + typingTestEscape(word) + '</span>';
            }
        }

        inner.innerHTML = html;

        // Scroll: find active word and shift up if needed
        var activeWord = inner.querySelector('.typingtest-word.active');
        if (activeWord) {
            var containerRect = wordsEl.getBoundingClientRect();
            var wordRect = activeWord.getBoundingClientRect();
            var relativeTop = wordRect.top - containerRect.top;
            // Keep active word within the first two lines (~70px)
            if (relativeTop > 50) {
                var currentTransform = parseFloat(inner.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
                inner.style.transform = 'translateY(' + (currentTransform - (relativeTop - 20)) + 'px)';
            }
        }
    });
}

function typingTestEscape(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function typingTestRender(toolId) {
    var s = typingTestState[toolId];
    if (!s) return;

    var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
    tools.forEach(function(tool) {
        var widget = tool.querySelector('.typingtest-widget');
        if (!widget) return;

        // Update toolbar stats
        var timerEl = widget.querySelector('.typingtest-timer');
        if (timerEl) timerEl.textContent = s.timer + 's';
        var wpmEl = widget.querySelector('.typingtest-wpm');
        if (wpmEl) wpmEl.textContent = typingTestCalcWPM(s);
        var accEl = widget.querySelector('.typingtest-acc');
        if (accEl) accEl.textContent = typingTestCalcAccuracy(s) + '%';

        // Duration selector
        var durSel = widget.querySelector('.typingtest-duration');
        if (durSel) durSel.value = '' + s.duration;

        // Render words
        typingTestRenderWords(toolId);

        // Results overlay
        var results = widget.querySelector('.typingtest-results');
        if (results) {
            if (s.finished) {
                var wpm = typingTestCalcWPM(s);
                var acc = typingTestCalcAccuracy(s);
                var bestKey = '' + s.duration;
                var best = (s.bestScores && s.bestScores[bestKey]) ? s.bestScores[bestKey] : wpm;
                results.innerHTML =
                    '<div class="typingtest-results-title">Results</div>' +
                    '<div class="typingtest-results-grid">' +
                        '<div class="typingtest-results-item"><div class="typingtest-results-value">' + wpm + '</div><div class="typingtest-results-label">WPM</div></div>' +
                        '<div class="typingtest-results-item"><div class="typingtest-results-value">' + acc + '%</div><div class="typingtest-results-label">Accuracy</div></div>' +
                        '<div class="typingtest-results-item"><div class="typingtest-results-value">' + s.correctChars + '</div><div class="typingtest-results-label">Correct</div></div>' +
                        '<div class="typingtest-results-item"><div class="typingtest-results-value">' + s.incorrectChars + '</div><div class="typingtest-results-label">Errors</div></div>' +
                    '</div>' +
                    '<div class="typingtest-best">Best ' + s.duration + 's: <strong>' + best + ' WPM</strong></div>' +
                    '<button class="pomo-btn" onclick="typingTestNewGame(this)" style="margin-top:8px;">Try Again</button>';
                results.style.display = 'flex';
            } else {
                results.style.display = 'none';
            }
        }
    });
}

function typingTestInit() {
    document.querySelectorAll('.typingtest-widget').forEach(function(widget) {
        var tool = widget.closest('.tool');
        if (!tool) return;
        var toolId = tool.getAttribute('data-tool');
        if (!toolId) return;

        // Load saved duration preference
        var customizations = loadToolCustomizations();
        var saved = customizations[toolId] && customizations[toolId].typingTestData;
        var s = typingTestGetState(toolId);
        if (saved && saved.duration) s.duration = saved.duration;
        s.bestScores = typingTestLoadBest(toolId);

        // Initialize a game
        s.words = typingTestGenerateWords(200);
        s.timer = s.duration;
        typingTestRender(toolId);

        var input = widget.querySelector('.typingtest-input');
        if (input) {
            input.addEventListener('input', function() { typingTestHandleInput(this); });
            // Prevent space from scrolling page
            input.addEventListener('keydown', function(e) {
                if (e.key === ' ') e.stopPropagation();
            });
        }
    });
}

// =============================================
// FLAPPY BIRD GAME
// =============================================

const flappyInstances = new Map();

function flappyGetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function flappyGetBest(toolId) {
    const custom = toolCustomizations[toolId] || {};
    return custom.flappyBest || 0;
}

function flappySaveBest(toolId, score) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].flappyBest = score;
    saveToolCustomizations(toolCustomizations);
}

function flappyNewState(w, h) {
    return {
        phase: 'idle',
        bird: { x: 60, y: h / 2, vy: 0, rotation: 0, frame: 0, flapTimer: 0 },
        pipes: [],
        pipeTimer: 0,
        score: 0,
        groundX: 0,
        frameId: null,
        lastTime: 0,
        canvasW: w,
        canvasH: h
    };
}

// Game constants
const FB_GRAVITY = 750;
const FB_FLAP_VEL = -260;
const FB_BIRD_W = 24;
const FB_BIRD_H = 18;
const FB_PIPE_W = 40;
const FB_PIPE_GAP = 100;
const FB_PIPE_SPEED = 120;
const FB_PIPE_INTERVAL = 1.8;
const FB_GROUND_H = 40;
const FB_GROUND_SPEED = 120;

function flappyInit() {
    document.querySelectorAll('.flappy-widget').forEach(widget => {
        const toolId = flappyGetToolId(widget);
        if (!toolId || flappyInstances.has(toolId)) return;

        const canvas = widget.querySelector('.flappy-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width || 300;
        canvas.height = rect.height || 400;

        const state = flappyNewState(canvas.width, canvas.height);
        flappyInstances.set(toolId, { widget, canvas, ctx, state });

        flappyDrawIdle(toolId);

        // Resize observer
        const ro = new ResizeObserver(() => {
            const r = canvas.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
                canvas.width = r.width;
                canvas.height = r.height;
                const inst = flappyInstances.get(toolId);
                if (inst) {
                    inst.state.canvasW = r.width;
                    inst.state.canvasH = r.height;
                    if (inst.state.phase === 'idle') flappyDrawIdle(toolId);
                }
            }
        });
        ro.observe(canvas);

        // Input handlers
        const handleInput = (e) => {
            const inst = flappyInstances.get(toolId);
            if (!inst) return;
            if (inst.state.phase === 'playing') {
                e.preventDefault();
                flappyFlap(toolId);
            }
        };

        canvas.addEventListener('mousedown', handleInput);
        canvas.addEventListener('touchstart', handleInput, { passive: false });
        widget.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                const inst = flappyInstances.get(toolId);
                if (inst && inst.state.phase === 'playing') {
                    flappyFlap(toolId);
                }
            }
        });
        widget.setAttribute('tabindex', '0');
    });
}

function flappyStart(btn) {
    const widget = btn.closest('.flappy-widget');
    const toolId = flappyGetToolId(widget);
    if (!toolId) return;

    const inst = flappyInstances.get(toolId);
    if (!inst) return;

    const s = flappyNewState(inst.canvas.width, inst.canvas.height);
    s.phase = 'playing';
    inst.state = s;

    widget.querySelector('.flappy-overlay').classList.add('hidden');
    widget.querySelector('.flappy-score-display').classList.remove('hidden');
    widget.querySelector('.flappy-score-display').textContent = '0';

    widget.focus();

    s.lastTime = performance.now();
    flappyLoop(toolId);
}

function flappyFlap(toolId) {
    const inst = flappyInstances.get(toolId);
    if (!inst || inst.state.phase !== 'playing') return;
    inst.state.bird.vy = FB_FLAP_VEL;
    inst.state.bird.flapTimer = 0.15;
}

function flappyLoop(toolId) {
    const inst = flappyInstances.get(toolId);
    if (!inst || inst.state.phase !== 'playing') return;

    const now = performance.now();
    let dt = (now - inst.state.lastTime) / 1000;
    inst.state.lastTime = now;
    if (dt > 0.05) dt = 0.05; // clamp

    flappyUpdate(toolId, dt);
    flappyDraw(toolId);

    if (inst.state.phase === 'playing') {
        inst.state.frameId = requestAnimationFrame(() => flappyLoop(toolId));
    }
}

function flappyUpdate(toolId, dt) {
    const inst = flappyInstances.get(toolId);
    if (!inst) return;
    const s = inst.state;
    const W = s.canvasW;
    const H = s.canvasH;
    const groundY = H - FB_GROUND_H;

    // Bird physics
    s.bird.vy += FB_GRAVITY * dt;
    s.bird.y += s.bird.vy * dt;
    s.bird.rotation = Math.min(Math.max(s.bird.vy / 400, -0.5), 1.2);
    s.bird.flapTimer -= dt;
    s.bird.frame = s.bird.flapTimer > 0 ? 1 : 0;

    // Ground scroll
    s.groundX -= FB_GROUND_SPEED * dt;
    if (s.groundX <= -24) s.groundX += 24;

    // Pipe spawning
    s.pipeTimer -= dt;
    if (s.pipeTimer <= 0) {
        const minY = 50;
        const maxY = groundY - FB_PIPE_GAP - 50;
        const topH = minY + Math.random() * (maxY - minY);
        s.pipes.push({ x: W + 10, topH: topH, scored: false });
        s.pipeTimer = FB_PIPE_INTERVAL;
    }

    // Pipe movement
    for (let i = s.pipes.length - 1; i >= 0; i--) {
        s.pipes[i].x -= FB_PIPE_SPEED * dt;
        if (s.pipes[i].x + FB_PIPE_W < 0) {
            s.pipes.splice(i, 1);
            continue;
        }
        // Scoring
        if (!s.pipes[i].scored && s.pipes[i].x + FB_PIPE_W < s.bird.x) {
            s.pipes[i].scored = true;
            s.score++;
            inst.widget.querySelector('.flappy-score-display').textContent = s.score;
        }
    }

    // Collision detection
    const bx = s.bird.x - FB_BIRD_W / 2;
    const by = s.bird.y - FB_BIRD_H / 2;
    const bx2 = bx + FB_BIRD_W;
    const by2 = by + FB_BIRD_H;

    // Ground/ceiling
    if (by2 >= groundY || by <= 0) {
        flappyGameOver(toolId);
        return;
    }

    // Pipes
    for (const p of s.pipes) {
        const px = p.x;
        const px2 = p.x + FB_PIPE_W;
        if (bx2 > px && bx < px2) {
            if (by < p.topH || by2 > p.topH + FB_PIPE_GAP) {
                flappyGameOver(toolId);
                return;
            }
        }
    }
}

function flappyGameOver(toolId) {
    const inst = flappyInstances.get(toolId);
    if (!inst) return;
    const s = inst.state;
    s.phase = 'dead';
    if (s.frameId) cancelAnimationFrame(s.frameId);

    const best = Math.max(flappyGetBest(toolId), s.score);
    flappySaveBest(toolId, best);

    const overlay = inst.widget.querySelector('.flappy-overlay');
    overlay.classList.remove('hidden');
    overlay.innerHTML =
        '<div class="flappy-game-over">Game Over</div>' +
        '<div class="flappy-final-score">Score: ' + s.score + '</div>' +
        '<div class="flappy-best-score">Best: ' + best + '</div>' +
        '<button class="flappy-start-btn" onclick="flappyStart(this)">Play Again</button>';
    inst.widget.querySelector('.flappy-score-display').classList.add('hidden');
}

function flappyDrawIdle(toolId) {
    const inst = flappyInstances.get(toolId);
    if (!inst) return;
    const ctx = inst.ctx;
    const W = inst.canvas.width;
    const H = inst.canvas.height;
    flappyDrawBg(ctx, W, H, 0);
    flappyDrawGround(ctx, W, H, 0);
    flappyDrawBird(ctx, W / 2 - 30, H / 2 - 30, 0, 0);
}

function flappyDraw(toolId) {
    const inst = flappyInstances.get(toolId);
    if (!inst) return;
    const ctx = inst.ctx;
    const s = inst.state;
    const W = s.canvasW;
    const H = s.canvasH;

    flappyDrawBg(ctx, W, H, s.groundX);

    // Draw pipes
    for (const p of s.pipes) {
        flappyDrawPipe(ctx, p.x, p.topH, p.topH + FB_PIPE_GAP, H - FB_GROUND_H);
    }

    flappyDrawGround(ctx, W, H, s.groundX);
    flappyDrawBird(ctx, s.bird.x - FB_BIRD_W / 2, s.bird.y - FB_BIRD_H / 2, s.bird.rotation, s.bird.frame);
}

function flappyDrawBg(ctx, W, H, gx) {
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#4ec0ca');
    grad.addColorStop(0.6, '#70c5ce');
    grad.addColorStop(1, '#d4f0f0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    const clouds = [[40, 50, 60, 20], [150, 30, 45, 15], [250, 70, 50, 16], [100, 90, 40, 12]];
    for (const [cx, cy, rw, rh] of clouds) {
        const xx = ((cx - gx * 0.3) % (W + 80) + W + 80) % (W + 80) - 40;
        ctx.beginPath();
        ctx.ellipse(xx, cy, rw, rh, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

function flappyDrawGround(ctx, W, H, gx) {
    const groundY = H - FB_GROUND_H;
    // Dirt
    ctx.fillStyle = '#ded895';
    ctx.fillRect(0, groundY, W, FB_GROUND_H);
    // Top grass stripe
    ctx.fillStyle = '#6bb845';
    ctx.fillRect(0, groundY, W, 8);
    ctx.fillStyle = '#5aa035';
    ctx.fillRect(0, groundY + 8, W, 3);
    // Ground texture lines
    ctx.strokeStyle = '#c8c060';
    ctx.lineWidth = 1;
    for (let x = gx % 24; x < W; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 16);
        ctx.lineTo(x + 12, groundY + FB_GROUND_H);
        ctx.stroke();
    }
}

function flappyDrawPipe(ctx, x, topH, bottomY, groundY) {
    const w = FB_PIPE_W;
    const capH = 16;
    const capExtra = 4;

    // Top pipe body
    ctx.fillStyle = '#73bf2e';
    ctx.fillRect(x, 0, w, topH - capH);
    ctx.fillStyle = '#5a9e1e';
    ctx.fillRect(x, 0, 4, topH - capH);
    ctx.fillStyle = '#8cd940';
    ctx.fillRect(x + w - 6, 0, 6, topH - capH);

    // Top pipe cap
    ctx.fillStyle = '#73bf2e';
    ctx.fillRect(x - capExtra, topH - capH, w + capExtra * 2, capH);
    ctx.fillStyle = '#5a9e1e';
    ctx.fillRect(x - capExtra, topH - capH, 4, capH);
    ctx.fillStyle = '#8cd940';
    ctx.fillRect(x + w + capExtra - 6, topH - capH, 6, capH);
    ctx.strokeStyle = '#3a7a10';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - capExtra, topH - capH, w + capExtra * 2, capH);

    // Bottom pipe body
    const bTop = bottomY;
    const bH = groundY - bottomY;
    ctx.fillStyle = '#73bf2e';
    ctx.fillRect(x, bTop + capH, w, bH - capH);
    ctx.fillStyle = '#5a9e1e';
    ctx.fillRect(x, bTop + capH, 4, bH - capH);
    ctx.fillStyle = '#8cd940';
    ctx.fillRect(x + w - 6, bTop + capH, 6, bH - capH);

    // Bottom pipe cap
    ctx.fillStyle = '#73bf2e';
    ctx.fillRect(x - capExtra, bTop, w + capExtra * 2, capH);
    ctx.fillStyle = '#5a9e1e';
    ctx.fillRect(x - capExtra, bTop, 4, capH);
    ctx.fillStyle = '#8cd940';
    ctx.fillRect(x + w + capExtra - 6, bTop, 6, capH);
    ctx.strokeStyle = '#3a7a10';
    ctx.strokeRect(x - capExtra, bTop, w + capExtra * 2, capH);
}

function flappyDrawBird(ctx, x, y, rotation, frame) {
    ctx.save();
    ctx.translate(x + FB_BIRD_W / 2, y + FB_BIRD_H / 2);
    ctx.rotate(rotation);

    // Body
    ctx.fillStyle = '#f5c842';
    ctx.beginPath();
    ctx.ellipse(0, 0, FB_BIRD_W / 2, FB_BIRD_H / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Belly
    ctx.fillStyle = '#fae89d';
    ctx.beginPath();
    ctx.ellipse(2, 3, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#e8a033';
    ctx.beginPath();
    const wy = frame === 1 ? -6 : -1;
    ctx.ellipse(-3, wy, 7, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c8841a';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Eye white
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(6, -3, 4, 0, Math.PI * 2);
    ctx.fill();
    // Pupil
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(7.5, -3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#e8652a';
    ctx.beginPath();
    ctx.moveTo(9, 0);
    ctx.lineTo(16, 1);
    ctx.lineTo(9, 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// =============================================
// NONOGRAM PUZZLE
// =============================================

var nonogramState = {};
var nonogramKeyListenerAdded = false;

function nonogramGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function nonogramGetWidget(el) {
    return el.closest('.nonogram-widget');
}

function nonogramGetState(toolId) {
    if (!nonogramState[toolId]) {
        var customizations = loadToolCustomizations();
        var saved = customizations[toolId] && customizations[toolId].nonogramData;
        if (saved) {
            nonogramState[toolId] = {
                solution: saved.solution,
                board: saved.board,
                rowClues: saved.rowClues,
                colClues: saved.colClues,
                rows: saved.rows,
                cols: saved.cols,
                difficulty: saved.difficulty || '5',
                timer: saved.timer || 0,
                timerInterval: null,
                mistakes: saved.mistakes || 0,
                completed: saved.completed || false,
                history: saved.history || []
            };
        } else {
            nonogramState[toolId] = null;
        }
    }
    return nonogramState[toolId];
}

function nonogramSaveData(toolId) {
    var s = nonogramState[toolId];
    if (!s) return;
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].nonogramData = {
        solution: s.solution,
        board: s.board,
        rowClues: s.rowClues,
        colClues: s.colClues,
        rows: s.rows,
        cols: s.cols,
        difficulty: s.difficulty,
        timer: s.timer,
        mistakes: s.mistakes,
        completed: s.completed,
        history: s.history
    };
    saveToolCustomizations(customizations);
}

function nonogramNewGame(btn) {
    var toolId = nonogramGetToolId(btn);
    if (toolId) nonogramNewGameForToolId(toolId);
}

function nonogramNewGameForToolId(toolId) {
    var s = nonogramState[toolId];
    var difficulty = s ? s.difficulty : '5';
    if (s && s.timerInterval) clearInterval(s.timerInterval);

    var size = parseInt(difficulty);
    var puzzle = nonogramGeneratePuzzle(size);

    var board = [];
    for (var r = 0; r < size; r++) {
        board[r] = [];
        for (var c = 0; c < size; c++) {
            board[r][c] = 0;
        }
    }

    nonogramState[toolId] = {
        solution: puzzle.solution,
        board: board,
        rowClues: puzzle.rowClues,
        colClues: puzzle.colClues,
        rows: size,
        cols: size,
        difficulty: difficulty,
        timer: 0,
        timerInterval: null,
        mistakes: 0,
        completed: false,
        history: []
    };

    nonogramSaveData(toolId);
    nonogramRender(toolId);
    nonogramStartTimer(toolId);
}

function nonogramSetDifficulty(sel) {
    var toolId = nonogramGetToolId(sel);
    if (!toolId) return;
    var s = nonogramGetState(toolId);
    if (s) s.difficulty = sel.value;
    nonogramNewGameForToolId(toolId);
}

function nonogramGeneratePuzzle(size) {
    var solution;
    var valid = false;
    while (!valid) {
        solution = [];
        for (var r = 0; r < size; r++) {
            solution[r] = [];
            for (var c = 0; c < size; c++) {
                solution[r][c] = Math.random() < 0.45 ? 1 : 0;
            }
        }
        valid = true;
        for (var r2 = 0; r2 < size; r2++) {
            var rowHas = false;
            for (var c2 = 0; c2 < size; c2++) {
                if (solution[r2][c2] === 1) { rowHas = true; break; }
            }
            if (!rowHas) { valid = false; break; }
        }
        if (!valid) continue;
        for (var c3 = 0; c3 < size; c3++) {
            var colHas = false;
            for (var r3 = 0; r3 < size; r3++) {
                if (solution[r3][c3] === 1) { colHas = true; break; }
            }
            if (!colHas) { valid = false; break; }
        }
    }

    var rowClues = solution.map(function(row) { return nonogramExtractClues(row); });
    var colClues = [];
    for (var c4 = 0; c4 < size; c4++) {
        var col = [];
        for (var r4 = 0; r4 < size; r4++) col.push(solution[r4][c4]);
        colClues.push(nonogramExtractClues(col));
    }
    return { solution: solution, rowClues: rowClues, colClues: colClues };
}

function nonogramExtractClues(line) {
    var clues = [];
    var count = 0;
    for (var i = 0; i < line.length; i++) {
        if (line[i] === 1) {
            count++;
        } else {
            if (count > 0) { clues.push(count); count = 0; }
        }
    }
    if (count > 0) clues.push(count);
    if (clues.length === 0) clues.push(0);
    return clues;
}

function nonogramCellClick(el, row, col, evt) {
    var toolId = nonogramGetToolId(el);
    if (!toolId) return;
    var s = nonogramGetState(toolId);
    if (!s || s.completed) return;

    var isRightOrShift = (evt && (evt.button === 2 || evt.shiftKey));
    var prevValue = s.board[row][col];
    var newValue;

    if (isRightOrShift) {
        newValue = prevValue === 2 ? 0 : 2;
    } else {
        newValue = prevValue === 1 ? 0 : 1;
    }

    s.history.push({ row: row, col: col, prevValue: prevValue });
    s.board[row][col] = newValue;

    nonogramSaveData(toolId);

    if (nonogramCheckWin(s)) {
        s.completed = true;
        nonogramStopTimer(toolId);
        nonogramSaveData(toolId);
    }

    nonogramRender(toolId);
}

function nonogramCheckRowSatisfied(s, row) {
    var filled = [];
    for (var c = 0; c < s.cols; c++) {
        filled.push(s.board[row][c] === 1 ? 1 : 0);
    }
    var current = nonogramExtractClues(filled);
    var expected = s.rowClues[row];
    if (current.length !== expected.length) return false;
    for (var i = 0; i < current.length; i++) {
        if (current[i] !== expected[i]) return false;
    }
    return true;
}

function nonogramCheckColSatisfied(s, col) {
    var filled = [];
    for (var r = 0; r < s.rows; r++) {
        filled.push(s.board[r][col] === 1 ? 1 : 0);
    }
    var current = nonogramExtractClues(filled);
    var expected = s.colClues[col];
    if (current.length !== expected.length) return false;
    for (var i = 0; i < current.length; i++) {
        if (current[i] !== expected[i]) return false;
    }
    return true;
}

function nonogramCheckWin(s) {
    for (var r = 0; r < s.rows; r++) {
        for (var c = 0; c < s.cols; c++) {
            var isFilled = s.board[r][c] === 1;
            var shouldBeFilled = s.solution[r][c] === 1;
            if (isFilled !== shouldBeFilled) return false;
        }
    }
    return true;
}

function nonogramUndo(btn) {
    var toolId = nonogramGetToolId(btn);
    if (!toolId) return;
    var s = nonogramGetState(toolId);
    if (!s || s.completed || s.history.length === 0) return;

    var entry = s.history.pop();
    s.board[entry.row][entry.col] = entry.prevValue;

    nonogramSaveData(toolId);
    nonogramRender(toolId);
}

function nonogramRender(toolId) {
    var s = nonogramState[toolId];
    if (!s) return;

    var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
    tools.forEach(function(tool) {
        var widget = tool.querySelector('.nonogram-widget');
        if (!widget) return;

        var timerEl = widget.querySelector('.nonogram-timer');
        if (timerEl) timerEl.textContent = nonogramFormatTime(s.timer);

        var mistakesEl = widget.querySelector('.nonogram-mistakes');
        if (mistakesEl) mistakesEl.textContent = s.mistakes + ' mistake' + (s.mistakes !== 1 ? 's' : '');

        var diffSel = widget.querySelector('.nonogram-difficulty');
        if (diffSel) diffSel.value = s.difficulty;

        var maxRowClueLen = 1;
        for (var i = 0; i < s.rowClues.length; i++) {
            if (s.rowClues[i].length > maxRowClueLen) maxRowClueLen = s.rowClues[i].length;
        }
        var maxColClueLen = 1;
        for (var j = 0; j < s.colClues.length; j++) {
            if (s.colClues[j].length > maxColClueLen) maxColClueLen = s.colClues[j].length;
        }

        var rowSatisfied = [];
        for (var ri = 0; ri < s.rows; ri++) {
            rowSatisfied.push(nonogramCheckRowSatisfied(s, ri));
        }
        var colSatisfied = [];
        for (var ci = 0; ci < s.cols; ci++) {
            colSatisfied.push(nonogramCheckColSatisfied(s, ci));
        }

        var gridWrap = widget.querySelector('.nonogram-grid-wrap');
        if (gridWrap) {
            gridWrap.style.gridTemplateColumns = 'repeat(' + maxRowClueLen + ', auto) repeat(' + s.cols + ', 24px)';
            gridWrap.style.gridTemplateRows = 'repeat(' + maxColClueLen + ', auto) repeat(' + s.rows + ', 24px)';

            var html = '';

            for (var cr = 0; cr < maxColClueLen; cr++) {
                for (var cc = 0; cc < maxRowClueLen; cc++) {
                    html += '<div class="nonogram-corner"></div>';
                }
                for (var ci2 = 0; ci2 < s.cols; ci2++) {
                    var colClue = s.colClues[ci2];
                    var padLen = maxColClueLen - colClue.length;
                    var clueIdx = cr - padLen;
                    var satisfied = colSatisfied[ci2] ? ' satisfied' : '';
                    if (clueIdx >= 0 && clueIdx < colClue.length) {
                        html += '<div class="nonogram-clue-cell col-clue' + satisfied + '">' + colClue[clueIdx] + '</div>';
                    } else {
                        html += '<div class="nonogram-clue-cell col-clue"></div>';
                    }
                }
            }

            for (var r = 0; r < s.rows; r++) {
                var rowClue = s.rowClues[r];
                var rowPadLen = maxRowClueLen - rowClue.length;
                var rSatisfied = rowSatisfied[r] ? ' satisfied' : '';
                for (var rc = 0; rc < maxRowClueLen; rc++) {
                    var rClueIdx = rc - rowPadLen;
                    if (rClueIdx >= 0 && rClueIdx < rowClue.length) {
                        html += '<div class="nonogram-clue-cell row-clue' + rSatisfied + '">' + rowClue[rClueIdx] + '</div>';
                    } else {
                        html += '<div class="nonogram-clue-cell row-clue"></div>';
                    }
                }

                for (var c = 0; c < s.cols; c++) {
                    var cellVal = s.board[r][c];
                    var cls = 'nonogram-cell';
                    var content = '';
                    if (cellVal === 1) {
                        cls += ' filled';
                    } else if (cellVal === 2) {
                        cls += ' marked';
                        content = '\u2715';
                    }
                    html += '<div class="' + cls + '" onmousedown="nonogramCellClick(this,' + r + ',' + c + ',event)" oncontextmenu="event.preventDefault()">' + content + '</div>';
                }
            }

            gridWrap.innerHTML = html;
        }

        var overlay = widget.querySelector('.nonogram-win-overlay');
        if (overlay) {
            overlay.style.display = s.completed ? 'flex' : 'none';
            if (s.completed) {
                var winStats = overlay.querySelector('.nonogram-win-stats');
                if (winStats) winStats.textContent = nonogramFormatTime(s.timer);
            }
        }
    });
}

function nonogramStartTimer(toolId) {
    var s = nonogramState[toolId];
    if (!s || s.timerInterval) return;
    s.timerInterval = setInterval(function() {
        if (s.completed) { clearInterval(s.timerInterval); s.timerInterval = null; return; }
        s.timer++;
        var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
        tools.forEach(function(tool) {
            var timerEl = tool.querySelector('.nonogram-timer');
            if (timerEl) timerEl.textContent = nonogramFormatTime(s.timer);
        });
    }, 1000);
}

function nonogramStopTimer(toolId) {
    var s = nonogramState[toolId];
    if (s && s.timerInterval) {
        clearInterval(s.timerInterval);
        s.timerInterval = null;
    }
}

function nonogramFormatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var sec = seconds % 60;
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
}

function nonogramInit() {
    document.querySelectorAll('.nonogram-widget').forEach(function(widget) {
        var tool = widget.closest('.tool');
        if (!tool) return;
        var toolId = tool.getAttribute('data-tool');
        if (!toolId) return;

        var s = nonogramGetState(toolId);
        if (!s) {
            nonogramState[toolId] = {
                solution: [], board: [], rowClues: [], colClues: [],
                rows: 5, cols: 5, difficulty: '5',
                timer: 0, timerInterval: null, mistakes: 0,
                completed: false, history: []
            };
            nonogramNewGameForToolId(toolId);
        } else {
            nonogramRender(toolId);
            if (!s.completed) nonogramStartTimer(toolId);
        }
    });
}


// =============================================
// MEMORY PATTERN GAME
// =============================================

var memoryPatternState = {};

var MEMORY_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#d35400'];

function mempatGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function mempatGetWidget(el) {
    return el.closest('.mempat-widget');
}

function mempatGetState(toolId) {
    if (!memoryPatternState[toolId]) {
        var customizations = loadToolCustomizations();
        var saved = customizations[toolId] && customizations[toolId].mempatData;
        if (saved) {
            memoryPatternState[toolId] = {
                sequence: saved.sequence || [],
                playerIndex: 0,
                gridSize: saved.gridSize || 3,
                level: saved.level || 0,
                bestLevel: saved.bestLevel || 0,
                phase: 'idle',
                showIndex: 0,
                showTimer: null,
                locked: false,
                failed: false
            };
        } else {
            memoryPatternState[toolId] = null;
        }
    }
    return memoryPatternState[toolId];
}

function mempatSaveData(toolId) {
    var s = memoryPatternState[toolId];
    if (!s) return;
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].mempatData = {
        gridSize: s.gridSize,
        bestLevel: s.bestLevel
    };
    saveToolCustomizations(customizations);
}

function mempatNewGame(btn) {
    var toolId = mempatGetToolId(btn);
    if (toolId) mempatNewGameForToolId(toolId);
}

function mempatNewGameForToolId(toolId) {
    var s = memoryPatternState[toolId];
    var gridSize = s ? s.gridSize : 3;
    var bestLevel = s ? s.bestLevel : 0;

    if (s && s.showTimer) { clearTimeout(s.showTimer); s.showTimer = null; }

    memoryPatternState[toolId] = {
        sequence: [],
        playerIndex: 0,
        gridSize: gridSize,
        level: 0,
        bestLevel: bestLevel,
        phase: 'idle',
        showIndex: 0,
        showTimer: null,
        locked: false,
        failed: false,
        showingHighlight: false
    };

    mempatSaveData(toolId);
    mempatRender(toolId);
    mempatNextLevel(toolId);
}

function mempatSetGridSize(sel) {
    var toolId = mempatGetToolId(sel);
    if (!toolId) return;
    var s = mempatGetState(toolId);
    if (s) {
        if (s.showTimer) { clearTimeout(s.showTimer); s.showTimer = null; }
        s.gridSize = parseInt(sel.value);
    }
    mempatNewGameForToolId(toolId);
}

function mempatNextLevel(toolId) {
    var s = memoryPatternState[toolId];
    if (!s) return;

    s.level++;
    var totalCells = s.gridSize * s.gridSize;
    var nextCell = Math.floor(Math.random() * totalCells);
    s.sequence.push(nextCell);
    s.playerIndex = 0;
    s.phase = 'showing';
    s.showIndex = 0;
    s.failed = false;

    mempatRender(toolId);

    // Brief pause before showing sequence
    s.showTimer = setTimeout(function() {
        mempatShowNext(toolId);
    }, 400);
}

function mempatShowNext(toolId) {
    var s = memoryPatternState[toolId];
    if (!s || s.phase !== 'showing') return;

    if (s.showIndex >= s.sequence.length) {
        // Done showing, player's turn
        s.phase = 'input';
        s.playerIndex = 0;
        s.locked = false;
        s.showingHighlight = false;
        mempatRender(toolId);
        return;
    }

    // Highlight current cell
    s.locked = true;
    s.showingHighlight = true;
    mempatRender(toolId);

    // Show highlight for a duration that scales with level
    var showDuration = Math.max(300, 600 - s.level * 20);
    var pauseDuration = Math.max(150, 300 - s.level * 10);

    s.showTimer = setTimeout(function() {
        // Turn off highlight (blank gap between cells)
        s.showingHighlight = false;
        mempatRender(toolId);

        s.showTimer = setTimeout(function() {
            s.showIndex++;
            mempatShowNext(toolId);
        }, pauseDuration);
    }, showDuration);
}

function mempatCellClick(el, cellIndex) {
    var toolId = mempatGetToolId(el);
    if (!toolId) return;
    var s = mempatGetState(toolId);
    if (!s || s.phase !== 'input' || s.locked) return;

    var expected = s.sequence[s.playerIndex];

    if (cellIndex === expected) {
        // Correct
        s.playerIndex++;
        if (s.playerIndex >= s.sequence.length) {
            // Completed this level
            if (s.level > s.bestLevel) {
                s.bestLevel = s.level;
                mempatSaveData(toolId);
            }
            s.phase = 'correct';
            mempatRender(toolId);
            // Auto-advance to next level after brief delay
            s.showTimer = setTimeout(function() {
                mempatNextLevel(toolId);
            }, 700);
        } else {
            mempatRender(toolId);
        }
    } else {
        // Wrong — game over
        s.failed = true;
        s.phase = 'gameover';
        if (s.level - 1 > s.bestLevel) {
            s.bestLevel = s.level - 1;
        }
        mempatSaveData(toolId);
        mempatRender(toolId);
    }
}

function mempatRender(toolId) {
    var s = memoryPatternState[toolId];
    if (!s) return;

    var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
    tools.forEach(function(tool) {
        var widget = tool.querySelector('.mempat-widget');
        if (!widget) return;

        // Update level display
        var levelEl = widget.querySelector('.mempat-level');
        if (levelEl) levelEl.textContent = 'Level: ' + s.level;

        var bestEl = widget.querySelector('.mempat-best');
        if (bestEl) bestEl.textContent = 'Best: ' + s.bestLevel;

        // Sync grid size dropdown
        var sizeSel = widget.querySelector('.mempat-gridsize');
        if (sizeSel) sizeSel.value = s.gridSize;

        // Status message
        var statusEl = widget.querySelector('.mempat-status');
        if (statusEl) {
            if (s.phase === 'showing') {
                statusEl.textContent = 'Watch the pattern...';
                statusEl.style.color = '#f39c12';
            } else if (s.phase === 'input') {
                statusEl.textContent = 'Your turn! (' + s.playerIndex + '/' + s.sequence.length + ')';
                statusEl.style.color = '#3498db';
            } else if (s.phase === 'correct') {
                statusEl.textContent = 'Correct!';
                statusEl.style.color = '#27ae60';
            } else if (s.phase === 'gameover') {
                statusEl.textContent = 'Wrong! Game over at level ' + s.level;
                statusEl.style.color = '#e74c3c';
            } else {
                statusEl.textContent = 'Press New to start';
                statusEl.style.color = 'var(--text-muted)';
            }
        }

        // Build grid
        var gridEl = widget.querySelector('.mempat-grid');
        if (gridEl) {
            gridEl.style.gridTemplateColumns = 'repeat(' + s.gridSize + ', 1fr)';
            var totalCells = s.gridSize * s.gridSize;
            var html = '';

            for (var i = 0; i < totalCells; i++) {
                var cls = 'mempat-cell';
                var colorIdx = i % MEMORY_COLORS.length;
                var bgColor = MEMORY_COLORS[colorIdx];
                var isHighlighted = false;

                // During showing phase, highlight the current cell
                if (s.phase === 'showing' && s.showingHighlight && s.showIndex < s.sequence.length && s.sequence[s.showIndex] === i) {
                    isHighlighted = true;
                }

                // During gameover, highlight the expected cell in red
                if (s.phase === 'gameover' && s.sequence[s.playerIndex] === i) {
                    cls += ' mempat-cell-wrong';
                }

                var style = 'background:' + bgColor + ';';
                if (isHighlighted) {
                    cls += ' mempat-cell-lit';
                    style += 'box-shadow:0 0 16px 4px ' + bgColor + ';transform:scale(1.08);';
                }

                var clickable = s.phase === 'input' && !s.locked;
                var onclick = clickable ? ' onmousedown="mempatCellClick(this,' + i + ')"' : '';
                var cursor = clickable ? 'cursor:pointer;' : 'cursor:default;';

                html += '<div class="' + cls + '" style="' + style + cursor + '"' + onclick + '></div>';
            }

            gridEl.innerHTML = html;
        }

        // Game over overlay
        var overlay = widget.querySelector('.mempat-gameover');
        if (overlay) {
            overlay.style.display = s.phase === 'gameover' ? 'flex' : 'none';
            if (s.phase === 'gameover') {
                var scoreEl = overlay.querySelector('.mempat-gameover-score');
                if (scoreEl) scoreEl.textContent = 'Reached level ' + s.level + ' \u2022 Best: ' + s.bestLevel;
            }
        }
    });
}

function mempatInit() {
    document.querySelectorAll('.mempat-widget').forEach(function(widget) {
        var tool = widget.closest('.tool');
        if (!tool) return;
        var toolId = tool.getAttribute('data-tool');
        if (!toolId) return;

        var s = mempatGetState(toolId);
        if (!s) {
            memoryPatternState[toolId] = {
                sequence: [],
                playerIndex: 0,
                gridSize: 3,
                level: 0,
                bestLevel: 0,
                phase: 'idle',
                showIndex: 0,
                showTimer: null,
                locked: false,
                failed: false,
                showingHighlight: false
            };
            mempatRender(toolId);
        } else {
            // On reload, reset to idle — don't try to resume mid-game
            s.phase = 'idle';
            s.sequence = [];
            s.level = 0;
            mempatRender(toolId);
        }
    });
}


// =============================================
// SNAKE GAME
// =============================================

const snakeInstances = new Map();
const SNAKE_SPEEDS = { slow: 140, normal: 100, fast: 60 };
const SNAKE_CELL = 16;

function snakeGetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function snakeGetBest(toolId) {
    const custom = toolCustomizations[toolId] || {};
    return custom.snakeBest || 0;
}

function snakeSaveBest(toolId, score) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].snakeBest = score;
    saveToolCustomizations(toolCustomizations);
}

function snakeNewState(cols, rows) {
    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);
    return {
        phase: 'idle',
        cols: cols,
        rows: rows,
        snake: [{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }],
        dir: { x: 1, y: 0 },
        nextDir: { x: 1, y: 0 },
        food: null,
        score: 0,
        speed: 'normal',
        intervalId: null
    };
}

function snakePlaceFood(s) {
    const occupied = new Set(s.snake.map(p => p.x + ',' + p.y));
    const free = [];
    for (let x = 0; x < s.cols; x++) {
        for (let y = 0; y < s.rows; y++) {
            if (!occupied.has(x + ',' + y)) free.push({ x, y });
        }
    }
    s.food = free.length > 0 ? free[Math.floor(Math.random() * free.length)] : null;
}

function snakeInit() {
    document.querySelectorAll('.snake-widget').forEach(widget => {
        const toolId = snakeGetToolId(widget);
        if (!toolId || snakeInstances.has(toolId)) return;

        const canvas = widget.querySelector('.snake-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width || 320;
        canvas.height = rect.height || 320;

        const cols = Math.floor(canvas.width / SNAKE_CELL);
        const rows = Math.floor(canvas.height / SNAKE_CELL);
        const state = snakeNewState(cols, rows);
        snakeInstances.set(toolId, { widget, canvas, ctx, state });

        snakeDrawIdle(toolId);

        // Resize
        const ro = new ResizeObserver(() => {
            const r = canvas.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
                canvas.width = r.width;
                canvas.height = r.height;
                const inst = snakeInstances.get(toolId);
                if (inst && inst.state.phase === 'idle') {
                    inst.state.cols = Math.floor(r.width / SNAKE_CELL);
                    inst.state.rows = Math.floor(r.height / SNAKE_CELL);
                    snakeDrawIdle(toolId);
                }
            }
        });
        ro.observe(canvas);

        // Keyboard
        widget.addEventListener('keydown', (e) => {
            const inst = snakeInstances.get(toolId);
            if (!inst || inst.state.phase !== 'playing') return;
            const s = inst.state;
            const key = e.key;
            if ((key === 'ArrowUp' || key === 'w') && s.dir.y !== 1) { s.nextDir = { x: 0, y: -1 }; e.preventDefault(); }
            else if ((key === 'ArrowDown' || key === 's') && s.dir.y !== -1) { s.nextDir = { x: 0, y: 1 }; e.preventDefault(); }
            else if ((key === 'ArrowLeft' || key === 'a') && s.dir.x !== 1) { s.nextDir = { x: -1, y: 0 }; e.preventDefault(); }
            else if ((key === 'ArrowRight' || key === 'd') && s.dir.x !== -1) { s.nextDir = { x: 1, y: 0 }; e.preventDefault(); }
        });

        // Touch swipe
        let touchStart = null;
        canvas.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            touchStart = { x: t.clientX, y: t.clientY };
        }, { passive: true });
        canvas.addEventListener('touchend', (e) => {
            if (!touchStart) return;
            const inst = snakeInstances.get(toolId);
            if (!inst || inst.state.phase !== 'playing') return;
            const t = e.changedTouches[0];
            const dx = t.clientX - touchStart.x;
            const dy = t.clientY - touchStart.y;
            const s = inst.state;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 20 && s.dir.x !== -1) s.nextDir = { x: 1, y: 0 };
                else if (dx < -20 && s.dir.x !== 1) s.nextDir = { x: -1, y: 0 };
            } else {
                if (dy > 20 && s.dir.y !== -1) s.nextDir = { x: 0, y: 1 };
                else if (dy < -20 && s.dir.y !== 1) s.nextDir = { x: 0, y: -1 };
            }
            touchStart = null;
        }, { passive: true });

        widget.setAttribute('tabindex', '0');
    });
}

function snakeSetSpeed(btn, speed) {
    const widget = btn.closest('.snake-widget');
    const toolId = snakeGetToolId(widget);
    const inst = snakeInstances.get(toolId);
    if (!inst) return;
    inst.state.speed = speed;
    widget.querySelectorAll('.snake-speed-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-speed') === speed));
}

function snakeStart(btn) {
    const widget = btn.closest('.snake-widget');
    const toolId = snakeGetToolId(widget);
    if (!toolId) return;

    const inst = snakeInstances.get(toolId);
    if (!inst) return;

    const cols = Math.floor(inst.canvas.width / SNAKE_CELL);
    const rows = Math.floor(inst.canvas.height / SNAKE_CELL);
    const speed = inst.state.speed || 'normal';
    const s = snakeNewState(cols, rows);
    s.phase = 'playing';
    s.speed = speed;
    snakePlaceFood(s);
    inst.state = s;

    widget.querySelector('.snake-overlay').classList.add('hidden');
    widget.querySelector('.snake-hud').classList.remove('hidden');
    snakeUpdateHud(inst);
    widget.focus();

    if (s.intervalId) clearInterval(s.intervalId);
    s.intervalId = setInterval(() => snakeTick(toolId), SNAKE_SPEEDS[s.speed]);
}

function snakeTick(toolId) {
    const inst = snakeInstances.get(toolId);
    if (!inst || inst.state.phase !== 'playing') return;
    const s = inst.state;

    // Apply queued direction
    s.dir = { x: s.nextDir.x, y: s.nextDir.y };

    // Move head
    const head = s.snake[0];
    const nx = head.x + s.dir.x;
    const ny = head.y + s.dir.y;

    // Wall collision
    if (nx < 0 || nx >= s.cols || ny < 0 || ny >= s.rows) {
        snakeGameOver(toolId);
        return;
    }

    // Self collision
    for (let i = 0; i < s.snake.length; i++) {
        if (s.snake[i].x === nx && s.snake[i].y === ny) {
            snakeGameOver(toolId);
            return;
        }
    }

    s.snake.unshift({ x: nx, y: ny });

    // Eat food
    if (s.food && nx === s.food.x && ny === s.food.y) {
        s.score++;
        snakeUpdateHud(inst);
        snakePlaceFood(s);
    } else {
        s.snake.pop();
    }

    snakeDraw(toolId);
}

function snakeUpdateHud(inst) {
    const hud = inst.widget.querySelector('.snake-hud');
    const scoreEl = hud.querySelector('.snake-hud-score');
    if (scoreEl) scoreEl.textContent = 'Score: ' + inst.state.score;
}

function snakeGameOver(toolId) {
    const inst = snakeInstances.get(toolId);
    if (!inst) return;
    const s = inst.state;
    s.phase = 'dead';
    if (s.intervalId) { clearInterval(s.intervalId); s.intervalId = null; }

    const best = Math.max(snakeGetBest(toolId), s.score);
    snakeSaveBest(toolId, best);

    const overlay = inst.widget.querySelector('.snake-overlay');
    overlay.classList.remove('hidden');
    overlay.innerHTML =
        '<div class="snake-overlay-gameover">Game Over</div>' +
        '<div class="snake-overlay-score">Score: ' + s.score + '</div>' +
        '<div class="snake-overlay-best">Best: ' + best + '</div>' +
        '<div class="snake-speed-row">' +
            '<button class="snake-speed-btn' + (s.speed === 'slow' ? ' active' : '') + '" data-speed="slow" onclick="snakeSetSpeed(this,\'slow\')">Slow</button>' +
            '<button class="snake-speed-btn' + (s.speed === 'normal' ? ' active' : '') + '" data-speed="normal" onclick="snakeSetSpeed(this,\'normal\')">Normal</button>' +
            '<button class="snake-speed-btn' + (s.speed === 'fast' ? ' active' : '') + '" data-speed="fast" onclick="snakeSetSpeed(this,\'fast\')">Fast</button>' +
        '</div>' +
        '<button class="snake-play-btn" onclick="snakeStart(this)">Play Again</button>';
    inst.widget.querySelector('.snake-hud').classList.add('hidden');
}

function snakeDrawIdle(toolId) {
    const inst = snakeInstances.get(toolId);
    if (!inst) return;
    const ctx = inst.ctx;
    const W = inst.canvas.width;
    const H = inst.canvas.height;
    snakeDrawBg(ctx, W, H, inst.state.cols, inst.state.rows);
    // Decorative snake in the center
    const cx = Math.floor(inst.state.cols / 2);
    const cy = Math.floor(inst.state.rows / 2);
    const demoSnake = [{ x: cx + 2, y: cy }, { x: cx + 1, y: cy }, { x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }];
    snakeDrawSnakeBody(ctx, demoSnake, inst.state.cols, inst.state.rows, W, H);
}

function snakeDraw(toolId) {
    const inst = snakeInstances.get(toolId);
    if (!inst) return;
    const ctx = inst.ctx;
    const s = inst.state;
    const W = inst.canvas.width;
    const H = inst.canvas.height;

    snakeDrawBg(ctx, W, H, s.cols, s.rows);

    // Food
    if (s.food) {
        const ox = (W - s.cols * SNAKE_CELL) / 2;
        const oy = (H - s.rows * SNAKE_CELL) / 2;
        const fx = ox + s.food.x * SNAKE_CELL + SNAKE_CELL / 2;
        const fy = oy + s.food.y * SNAKE_CELL + SNAKE_CELL / 2;
        // Apple body
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(fx, fy, SNAKE_CELL / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(fx - 2, fy - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        // Stem
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(fx, fy - SNAKE_CELL / 2 + 2);
        ctx.lineTo(fx + 1, fy - SNAKE_CELL / 2 - 1);
        ctx.stroke();
    }

    snakeDrawSnakeBody(ctx, s.snake, s.cols, s.rows, W, H);
}

function snakeDrawBg(ctx, W, H, cols, rows) {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    const ox = (W - cols * SNAKE_CELL) / 2;
    const oy = (H - rows * SNAKE_CELL) / 2;

    // Checkerboard grid
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#16213e' : '#1a1a2e';
            ctx.fillRect(ox + x * SNAKE_CELL, oy + y * SNAKE_CELL, SNAKE_CELL, SNAKE_CELL);
        }
    }

    // Border
    ctx.strokeStyle = '#0f3460';
    ctx.lineWidth = 2;
    ctx.strokeRect(ox, oy, cols * SNAKE_CELL, rows * SNAKE_CELL);
}

function snakeDrawSnakeBody(ctx, snake, cols, rows, W, H) {
    const ox = (W - cols * SNAKE_CELL) / 2;
    const oy = (H - rows * SNAKE_CELL) / 2;
    const len = snake.length;

    for (let i = len - 1; i >= 0; i--) {
        const p = snake[i];
        const px = ox + p.x * SNAKE_CELL;
        const py = oy + p.y * SNAKE_CELL;
        const t = len > 1 ? i / (len - 1) : 0;

        if (i === 0) {
            // Head
            ctx.fillStyle = '#4ecca3';
            ctx.beginPath();
            ctx.roundRect(px + 1, py + 1, SNAKE_CELL - 2, SNAKE_CELL - 2, 4);
            ctx.fill();

            // Eyes
            const dir = len > 1 ? { x: snake[0].x - snake[1].x, y: snake[0].y - snake[1].y } : { x: 1, y: 0 };
            const ecx = px + SNAKE_CELL / 2;
            const ecy = py + SNAKE_CELL / 2;
            const eyeOff = 3;
            let e1x, e1y, e2x, e2y;
            if (dir.x !== 0) {
                e1x = ecx + dir.x * 2; e1y = ecy - eyeOff;
                e2x = ecx + dir.x * 2; e2y = ecy + eyeOff;
            } else {
                e1x = ecx - eyeOff; e1y = ecy + dir.y * 2;
                e2x = ecx + eyeOff; e2y = ecy + dir.y * 2;
            }
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(e1x, e1y, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(e2x, e2y, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath(); ctx.arc(e1x + dir.x * 0.5, e1y + dir.y * 0.5, 1.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(e2x + dir.x * 0.5, e2y + dir.y * 0.5, 1.2, 0, Math.PI * 2); ctx.fill();
        } else {
            // Body - gradient from green to teal
            const r = Math.round(78 - t * 30);
            const g = Math.round(204 - t * 60);
            const b = Math.round(163 - t * 40);
            ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
            ctx.beginPath();
            ctx.roundRect(px + 1, py + 1, SNAKE_CELL - 2, SNAKE_CELL - 2, 3);
            ctx.fill();
        }
    }
}

// =============================================
// REACTION TIME TEST
// =============================================

var reactionTimeState = {};

function reactionTimeGetWidget(el) {
    return el.closest('.reactiontime-widget');
}

function reactionTimeGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function reactionTimeGetState(toolId) {
    if (!reactionTimeState[toolId]) {
        reactionTimeState[toolId] = {
            phase: 'idle',
            goTimestamp: 0,
            timeoutId: null,
            lastResult: null,
            results: [],
            bestTime: null
        };
    }
    return reactionTimeState[toolId];
}

function reactionTimeLoadData(toolId) {
    var customizations = loadToolCustomizations();
    var data = customizations[toolId] && customizations[toolId].reactionTimeData;
    if (data) {
        var st = reactionTimeGetState(toolId);
        if (data.bestTime != null) st.bestTime = data.bestTime;
        if (Array.isArray(data.results)) st.results = data.results;
    }
}

function reactionTimeSaveData(toolId) {
    var st = reactionTimeGetState(toolId);
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].reactionTimeData = {
        bestTime: st.bestTime,
        results: st.results.slice(-10)
    };
    saveToolCustomizations(customizations);
}

function reactionTimeCalcAvg(results) {
    var last5 = results.slice(-5);
    if (last5.length === 0) return null;
    var sum = 0;
    for (var i = 0; i < last5.length; i++) sum += last5[i];
    return Math.round(sum / last5.length);
}

function reactionTimeStart(toolId) {
    var st = reactionTimeGetState(toolId);
    st.phase = 'waiting';
    st.goTimestamp = 0;
    reactionTimeRender(toolId);
    var delay = 1500 + Math.random() * 3500;
    st.timeoutId = setTimeout(function() {
        st.phase = 'go';
        st.goTimestamp = performance.now();
        reactionTimeRender(toolId);
    }, delay);
}

function reactionTimeClick(el) {
    var toolId = reactionTimeGetToolId(el);
    if (!toolId) return;
    var st = reactionTimeGetState(toolId);

    if (st.phase === 'idle' || st.phase === 'result' || st.phase === 'tooEarly') {
        reactionTimeStart(toolId);
    } else if (st.phase === 'waiting') {
        clearTimeout(st.timeoutId);
        st.timeoutId = null;
        st.phase = 'tooEarly';
        reactionTimeRender(toolId);
    } else if (st.phase === 'go') {
        var ms = Math.round(performance.now() - st.goTimestamp);
        st.lastResult = ms;
        st.results.push(ms);
        if (st.results.length > 10) st.results = st.results.slice(-10);
        if (st.bestTime === null || ms < st.bestTime) st.bestTime = ms;
        st.phase = 'result';
        reactionTimeSaveData(toolId);
        reactionTimeRender(toolId);
    }
}

function reactionTimeRender(toolId) {
    var st = reactionTimeGetState(toolId);
    var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
    for (var t = 0; t < tools.length; t++) {
        var widget = tools[t].querySelector('.reactiontime-widget');
        if (!widget) continue;
        var area = widget.querySelector('.reactiontime-area');
        var msg = widget.querySelector('.reactiontime-message');
        var sub = widget.querySelector('.reactiontime-sub');
        var bestEl = widget.querySelector('.reactiontime-best');
        var avgEl = widget.querySelector('.reactiontime-avg');
        var triesEl = widget.querySelector('.reactiontime-tries');

        area.className = 'reactiontime-area';
        msg.innerHTML = '';
        sub.textContent = '';

        if (st.phase === 'idle') {
            area.classList.add('rt-idle');
            msg.textContent = 'Click to Start';
            sub.textContent = 'Test your reaction time';
        } else if (st.phase === 'waiting') {
            area.classList.add('rt-waiting');
            msg.textContent = 'Wait for green\u2026';
        } else if (st.phase === 'go') {
            area.classList.add('rt-go');
            msg.textContent = 'CLICK!';
        } else if (st.phase === 'result') {
            area.classList.add('rt-result');
            msg.innerHTML = '<div class="reactiontime-result-ms">' + st.lastResult + ' ms</div>';
            sub.textContent = 'Click to try again';
        } else if (st.phase === 'tooEarly') {
            area.classList.add('rt-tooearly');
            msg.textContent = 'Too early!';
            sub.textContent = 'Click to retry';
        }

        bestEl.textContent = st.bestTime != null ? st.bestTime + ' ms' : '\u2014';
        var avg = reactionTimeCalcAvg(st.results);
        avgEl.textContent = avg != null ? avg + ' ms' : '\u2014';
        triesEl.textContent = st.results.length;
    }
}

function reactionTimeInit() {
    var widgets = document.querySelectorAll('.reactiontime-widget');
    for (var i = 0; i < widgets.length; i++) {
        var toolId = reactionTimeGetToolId(widgets[i]);
        if (!toolId) continue;
        reactionTimeLoadData(toolId);
        reactionTimeRender(toolId);
    }
}

// =============================================
// MEMORY MATCH GAME
// =============================================

var memMatchState = {};

var MEMMATCH_EMOJIS = [
    '\uD83D\uDE00', '\uD83D\uDE0D', '\uD83D\uDE0E', '\uD83D\uDE02',
    '\uD83D\uDE31', '\uD83E\uDD29', '\uD83E\uDD2F', '\uD83E\uDD73',
    '\uD83D\uDC7B', '\uD83D\uDC36', '\uD83D\uDC31', '\uD83D\uDC3B',
    '\uD83C\uDF1F', '\uD83C\uDF0E', '\uD83C\uDF3B', '\uD83C\uDF52',
    '\uD83C\uDFB5', '\uD83D\uDE80', '\u26A1', '\uD83D\uDD25',
    '\uD83C\uDF08', '\uD83C\uDF40', '\uD83E\uDDD1\u200D\uD83D\uDE80', '\uD83C\uDFA8',
    '\u2764\uFE0F', '\uD83D\uDC8E', '\uD83C\uDF89', '\uD83C\uDF4E',
    '\uD83E\uDD8B', '\uD83D\uDC1D', '\uD83D\uDC22', '\uD83E\uDD89'
];

function memmatchGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function memmatchGetWidget(el) {
    return el.closest('.memmatch-widget');
}

function memmatchGetState(toolId) {
    if (!memMatchState[toolId]) {
        var customizations = loadToolCustomizations();
        var saved = customizations[toolId] && customizations[toolId].memmatchData;
        if (saved) {
            memMatchState[toolId] = {
                cards: saved.cards || [],
                flipped: [],
                matched: saved.matched || [],
                moves: saved.moves || 0,
                pairCount: saved.pairCount || 8,
                timer: saved.timer || 0,
                timerInterval: null,
                locked: false,
                completed: saved.completed || false,
                bestMoves: saved.bestMoves || {},
                bestTime: saved.bestTime || {}
            };
        } else {
            memMatchState[toolId] = null;
        }
    }
    return memMatchState[toolId];
}

function memmatchSaveData(toolId) {
    var s = memMatchState[toolId];
    if (!s) return;
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].memmatchData = {
        cards: s.cards,
        matched: s.matched,
        moves: s.moves,
        pairCount: s.pairCount,
        timer: s.timer,
        completed: s.completed,
        bestMoves: s.bestMoves,
        bestTime: s.bestTime
    };
    saveToolCustomizations(customizations);
}

function memmatchShuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
}

function memmatchNewGame(btn) {
    var toolId = memmatchGetToolId(btn);
    if (toolId) memmatchNewGameForToolId(toolId);
}

function memmatchNewGameForToolId(toolId) {
    var s = memMatchState[toolId];
    var pairCount = s ? s.pairCount : 8;
    var bestMoves = s ? (s.bestMoves || {}) : {};
    var bestTime = s ? (s.bestTime || {}) : {};
    if (s && s.timerInterval) { clearInterval(s.timerInterval); s.timerInterval = null; }

    // Pick random emojis for pairs
    var pool = memmatchShuffle(MEMMATCH_EMOJIS.slice());
    var chosen = pool.slice(0, pairCount);
    var cards = [];
    for (var i = 0; i < chosen.length; i++) {
        cards.push({ id: i * 2, emoji: chosen[i], pairId: i });
        cards.push({ id: i * 2 + 1, emoji: chosen[i], pairId: i });
    }
    memmatchShuffle(cards);

    memMatchState[toolId] = {
        cards: cards,
        flipped: [],
        matched: [],
        moves: 0,
        pairCount: pairCount,
        timer: 0,
        timerInterval: null,
        locked: false,
        completed: false,
        bestMoves: bestMoves,
        bestTime: bestTime
    };

    memmatchSaveData(toolId);
    memmatchRender(toolId);
    memmatchStartTimer(toolId);
}

function memmatchSetPairs(sel) {
    var toolId = memmatchGetToolId(sel);
    if (!toolId) return;
    var s = memmatchGetState(toolId);
    if (s) s.pairCount = parseInt(sel.value);
    memmatchNewGameForToolId(toolId);
}

function memmatchCardClick(el, cardIndex) {
    var toolId = memmatchGetToolId(el);
    if (!toolId) return;
    var s = memmatchGetState(toolId);
    if (!s || s.completed || s.locked) return;

    // Don't flip already matched or already flipped cards
    if (s.matched.indexOf(cardIndex) >= 0) return;
    if (s.flipped.indexOf(cardIndex) >= 0) return;

    s.flipped.push(cardIndex);
    memmatchRender(toolId);

    if (s.flipped.length === 2) {
        s.moves++;
        s.locked = true;
        var idx0 = s.flipped[0];
        var idx1 = s.flipped[1];
        var card0 = s.cards[idx0];
        var card1 = s.cards[idx1];

        if (card0.pairId === card1.pairId) {
            // Match found
            s.matched.push(idx0);
            s.matched.push(idx1);
            s.flipped = [];
            s.locked = false;
            memmatchSaveData(toolId);

            // Check win
            if (s.matched.length === s.cards.length) {
                s.completed = true;
                memmatchStopTimer(toolId);
                // Track bests
                var key = '' + s.pairCount;
                if (!s.bestMoves[key] || s.moves < s.bestMoves[key]) s.bestMoves[key] = s.moves;
                if (!s.bestTime[key] || s.timer < s.bestTime[key]) s.bestTime[key] = s.timer;
                memmatchSaveData(toolId);
            }
            memmatchRender(toolId);
        } else {
            // No match — flip back after delay
            setTimeout(function() {
                s.flipped = [];
                s.locked = false;
                memmatchSaveData(toolId);
                memmatchRender(toolId);
            }, 700);
        }
    }
}

function memmatchStartTimer(toolId) {
    var s = memMatchState[toolId];
    if (!s || s.timerInterval) return;
    s.timerInterval = setInterval(function() {
        if (s.completed) { clearInterval(s.timerInterval); s.timerInterval = null; return; }
        s.timer++;
        var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
        tools.forEach(function(tool) {
            var timerEl = tool.querySelector('.memmatch-timer');
            if (timerEl) timerEl.textContent = memmatchFormatTime(s.timer);
        });
    }, 1000);
}

function memmatchStopTimer(toolId) {
    var s = memMatchState[toolId];
    if (s && s.timerInterval) {
        clearInterval(s.timerInterval);
        s.timerInterval = null;
    }
}

function memmatchFormatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var sec = seconds % 60;
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
}

function memmatchGridCols(pairCount) {
    var total = pairCount * 2;
    if (total <= 12) return 4;
    if (total <= 20) return 5;
    if (total <= 30) return 6;
    return 8;
}

function memmatchRender(toolId) {
    var s = memMatchState[toolId];
    if (!s) return;

    var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
    tools.forEach(function(tool) {
        var widget = tool.querySelector('.memmatch-widget');
        if (!widget) return;

        var timerEl = widget.querySelector('.memmatch-timer');
        if (timerEl) timerEl.textContent = memmatchFormatTime(s.timer);

        var movesEl = widget.querySelector('.memmatch-moves');
        if (movesEl) movesEl.textContent = s.moves + ' move' + (s.moves !== 1 ? 's' : '');

        var pairsSel = widget.querySelector('.memmatch-pairs');
        if (pairsSel) pairsSel.value = s.pairCount;

        var matchedCount = s.matched.length / 2;
        var pairsLeftEl = widget.querySelector('.memmatch-pairs-left');
        if (pairsLeftEl) pairsLeftEl.textContent = matchedCount + '/' + s.pairCount;

        // Build card grid
        var gridEl = widget.querySelector('.memmatch-grid');
        if (gridEl) {
            var cols = memmatchGridCols(s.pairCount);
            gridEl.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';

            var html = '';
            for (var i = 0; i < s.cards.length; i++) {
                var isFlipped = s.flipped.indexOf(i) >= 0;
                var isMatched = s.matched.indexOf(i) >= 0;
                var faceUp = isFlipped || isMatched;

                var cls = 'memmatch-card';
                if (faceUp) cls += ' memmatch-card-up';
                if (isMatched) cls += ' memmatch-card-matched';

                var cardContent = faceUp ? s.cards[i].emoji : '';
                var onclick = (!faceUp && !s.locked && !s.completed) ? ' onclick="memmatchCardClick(this,' + i + ')"' : '';

                html += '<div class="' + cls + '"' + onclick + '>' + cardContent + '</div>';
            }
            gridEl.innerHTML = html;
        }

        // Win overlay
        var overlay = widget.querySelector('.memmatch-win-overlay');
        if (overlay) {
            overlay.style.display = s.completed ? 'flex' : 'none';
            if (s.completed) {
                var winStats = overlay.querySelector('.memmatch-win-stats');
                if (winStats) {
                    var key = '' + s.pairCount;
                    var bestM = s.bestMoves[key] || s.moves;
                    var bestT = s.bestTime[key] || s.timer;
                    winStats.textContent = memmatchFormatTime(s.timer) + ' \u2022 ' + s.moves + ' moves';
                    var bestEl = overlay.querySelector('.memmatch-win-best');
                    if (bestEl) bestEl.textContent = 'Best: ' + bestM + ' moves in ' + memmatchFormatTime(bestT);
                }
            }
        }
    });
}

function memmatchInit() {
    document.querySelectorAll('.memmatch-widget').forEach(function(widget) {
        var tool = widget.closest('.tool');
        if (!tool) return;
        var toolId = tool.getAttribute('data-tool');
        if (!toolId) return;

        var s = memmatchGetState(toolId);
        if (!s) {
            memMatchState[toolId] = {
                cards: [], flipped: [], matched: [],
                moves: 0, pairCount: 8,
                timer: 0, timerInterval: null,
                locked: false, completed: false,
                bestMoves: {}, bestTime: {}
            };
            memmatchNewGameForToolId(toolId);
        } else {
            // Reset flipped state on reload (they'd be mid-animation)
            s.flipped = [];
            s.locked = false;
            memmatchRender(toolId);
            if (!s.completed && s.cards.length > 0) memmatchStartTimer(toolId);
        }
    });
}


// =============================================
// CONNECT FOUR
// =============================================

const C4_ROWS = 6;
const C4_COLS = 7;
const C4_EMPTY = 0;
const C4_P1 = 1;
const C4_P2 = 2;

var c4State = {};

function c4GetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function c4GetWidget(el) {
    return el.closest('.c4-widget');
}

function c4GetState(toolId) {
    if (!c4State[toolId]) {
        const custom = loadToolCustomizations();
        const saved = custom[toolId] && custom[toolId].c4Data;
        if (saved) {
            c4State[toolId] = saved;
        } else {
            c4State[toolId] = null;
        }
    }
    return c4State[toolId];
}

function c4SaveData(toolId) {
    const s = c4State[toolId];
    if (!s) return;
    const custom = loadToolCustomizations();
    custom[toolId] = custom[toolId] || {};
    custom[toolId].c4Data = {
        board: s.board,
        turn: s.turn,
        mode: s.mode,
        difficulty: s.difficulty,
        winner: s.winner,
        winCells: s.winCells,
        gameOver: s.gameOver
    };
    saveToolCustomizations(custom);
}

function c4NewBoard() {
    const board = [];
    for (let r = 0; r < C4_ROWS; r++) {
        board.push(new Array(C4_COLS).fill(C4_EMPTY));
    }
    return board;
}

function c4NewGame(btn) {
    const widget = c4GetWidget(btn);
    const toolId = c4GetToolId(widget);
    if (!toolId) return;
    const modeSelect = widget.querySelector('.c4-mode');
    const diffSelect = widget.querySelector('.c4-diff');
    const mode = modeSelect ? modeSelect.value : 'ai';
    const difficulty = diffSelect ? diffSelect.value : 'medium';
    c4State[toolId] = {
        board: c4NewBoard(),
        turn: C4_P1,
        mode: mode,
        difficulty: difficulty,
        winner: 0,
        winCells: [],
        gameOver: false,
        hoverCol: -1
    };
    widget.querySelector('.c4-overlay').classList.add('hidden');
    c4SaveData(toolId);
    c4Render(toolId);
}

function c4SetMode(sel) {
    const widget = c4GetWidget(sel);
    const toolId = c4GetToolId(widget);
    if (!toolId) return;
    const s = c4State[toolId];
    if (s) s.mode = sel.value;
}

function c4SetDifficulty(sel) {
    const widget = c4GetWidget(sel);
    const toolId = c4GetToolId(widget);
    if (!toolId) return;
    const s = c4State[toolId];
    if (s) s.difficulty = sel.value;
}

function c4DropPiece(board, col, player) {
    for (let r = C4_ROWS - 1; r >= 0; r--) {
        if (board[r][col] === C4_EMPTY) {
            board[r][col] = player;
            return r;
        }
    }
    return -1;
}

function c4UndropPiece(board, col) {
    for (let r = 0; r < C4_ROWS; r++) {
        if (board[r][col] !== C4_EMPTY) {
            board[r][col] = C4_EMPTY;
            return;
        }
    }
}

function c4CheckWin(board, player) {
    const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    for (let r = 0; r < C4_ROWS; r++) {
        for (let c = 0; c < C4_COLS; c++) {
            if (board[r][c] !== player) continue;
            for (const [dr, dc] of dirs) {
                const cells = [[r,c]];
                for (let k = 1; k < 4; k++) {
                    const nr = r + dr * k;
                    const nc = c + dc * k;
                    if (nr < 0 || nr >= C4_ROWS || nc < 0 || nc >= C4_COLS || board[nr][nc] !== player) break;
                    cells.push([nr, nc]);
                }
                if (cells.length === 4) return cells;
            }
        }
    }
    return null;
}

function c4IsFull(board) {
    for (let c = 0; c < C4_COLS; c++) {
        if (board[0][c] === C4_EMPTY) return false;
    }
    return true;
}

function c4GetValidCols(board) {
    const cols = [];
    for (let c = 0; c < C4_COLS; c++) {
        if (board[0][c] === C4_EMPTY) cols.push(c);
    }
    return cols;
}

// --- AI (minimax with alpha-beta pruning) ---

function c4EvalWindow(window4, player) {
    const opp = player === C4_P1 ? C4_P2 : C4_P1;
    const pCount = window4.filter(x => x === player).length;
    const oCount = window4.filter(x => x === opp).length;
    const eCount = window4.filter(x => x === C4_EMPTY).length;
    if (pCount === 4) return 100;
    if (pCount === 3 && eCount === 1) return 5;
    if (pCount === 2 && eCount === 2) return 2;
    if (oCount === 3 && eCount === 1) return -4;
    return 0;
}

function c4EvalBoard(board, player) {
    let score = 0;
    // Center column preference
    for (let r = 0; r < C4_ROWS; r++) {
        if (board[r][3] === player) score += 3;
    }
    // Horizontal
    for (let r = 0; r < C4_ROWS; r++) {
        for (let c = 0; c <= C4_COLS - 4; c++) {
            score += c4EvalWindow([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]], player);
        }
    }
    // Vertical
    for (let c = 0; c < C4_COLS; c++) {
        for (let r = 0; r <= C4_ROWS - 4; r++) {
            score += c4EvalWindow([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]], player);
        }
    }
    // Diagonal down-right
    for (let r = 0; r <= C4_ROWS - 4; r++) {
        for (let c = 0; c <= C4_COLS - 4; c++) {
            score += c4EvalWindow([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]], player);
        }
    }
    // Diagonal down-left
    for (let r = 0; r <= C4_ROWS - 4; r++) {
        for (let c = 3; c < C4_COLS; c++) {
            score += c4EvalWindow([board[r][c], board[r+1][c-1], board[r+2][c-2], board[r+3][c-3]], player);
        }
    }
    return score;
}

function c4Minimax(board, depth, alpha, beta, maximizing, aiPlayer) {
    const opp = aiPlayer === C4_P1 ? C4_P2 : C4_P1;
    const aiWin = c4CheckWin(board, aiPlayer);
    const oppWin = c4CheckWin(board, opp);
    if (aiWin) return { score: 100000 + depth, col: -1 };
    if (oppWin) return { score: -100000 - depth, col: -1 };
    const valid = c4GetValidCols(board);
    if (valid.length === 0 || depth === 0) {
        return { score: c4EvalBoard(board, aiPlayer), col: -1 };
    }

    if (maximizing) {
        let best = { score: -Infinity, col: valid[0] };
        for (const c of valid) {
            c4DropPiece(board, c, aiPlayer);
            const result = c4Minimax(board, depth - 1, alpha, beta, false, aiPlayer);
            c4UndropPiece(board, c);
            if (result.score > best.score) {
                best = { score: result.score, col: c };
            }
            alpha = Math.max(alpha, best.score);
            if (alpha >= beta) break;
        }
        return best;
    } else {
        let best = { score: Infinity, col: valid[0] };
        for (const c of valid) {
            c4DropPiece(board, c, opp);
            const result = c4Minimax(board, depth - 1, alpha, beta, true, aiPlayer);
            c4UndropPiece(board, c);
            if (result.score < best.score) {
                best = { score: result.score, col: c };
            }
            beta = Math.min(beta, best.score);
            if (alpha >= beta) break;
        }
        return best;
    }
}

function c4AIMove(toolId) {
    const s = c4State[toolId];
    if (!s || s.gameOver) return;

    const aiPlayer = C4_P2;
    const depthMap = { easy: 2, medium: 5, hard: 8 };
    const depth = depthMap[s.difficulty] || 5;

    // Check for immediate win/block first
    const valid = c4GetValidCols(s.board);
    for (const c of valid) {
        c4DropPiece(s.board, c, aiPlayer);
        if (c4CheckWin(s.board, aiPlayer)) {
            c4UndropPiece(s.board, c);
            c4PlayCol(toolId, c);
            return;
        }
        c4UndropPiece(s.board, c);
    }
    const opp = aiPlayer === C4_P1 ? C4_P2 : C4_P1;
    for (const c of valid) {
        c4DropPiece(s.board, c, opp);
        if (c4CheckWin(s.board, opp)) {
            c4UndropPiece(s.board, c);
            c4PlayCol(toolId, c);
            return;
        }
        c4UndropPiece(s.board, c);
    }

    const result = c4Minimax(s.board, depth, -Infinity, Infinity, true, aiPlayer);
    const col = result.col >= 0 ? result.col : valid[Math.floor(Math.random() * valid.length)];
    c4PlayCol(toolId, col);
}

function c4PlayCol(toolId, col) {
    const s = c4State[toolId];
    if (!s || s.gameOver) return;
    if (col < 0 || col >= C4_COLS || s.board[0][col] !== C4_EMPTY) return;

    c4DropPiece(s.board, col, s.turn);

    const winCells = c4CheckWin(s.board, s.turn);
    if (winCells) {
        s.winner = s.turn;
        s.winCells = winCells;
        s.gameOver = true;
    } else if (c4IsFull(s.board)) {
        s.winner = 0;
        s.gameOver = true;
    } else {
        s.turn = s.turn === C4_P1 ? C4_P2 : C4_P1;
    }

    c4SaveData(toolId);
    c4Render(toolId);

    if (s.gameOver) c4ShowResult(toolId);
}

function c4ShowResult(toolId) {
    const s = c4State[toolId];
    if (!s) return;
    const widget = document.querySelector('.tool[data-tool="' + toolId + '"] .c4-widget');
    if (!widget) return;
    const overlay = widget.querySelector('.c4-overlay');
    let msg;
    if (s.winner === C4_P1) msg = '<span style="color:#e74c3c">Red</span> wins!';
    else if (s.winner === C4_P2) msg = '<span style="color:#f1c40f">Yellow</span> wins!';
    else msg = 'Draw!';
    overlay.innerHTML =
        '<div class="c4-overlay-title">' + msg + '</div>' +
        '<button class="c4-play-btn" onclick="c4NewGame(this)">Play Again</button>';
    overlay.classList.remove('hidden');
}

function c4CanvasClick(toolId, e) {
    const s = c4State[toolId];
    if (!s || s.gameOver) return;
    if (s.mode === 'ai' && s.turn === C4_P2) return;

    const widget = document.querySelector('.tool[data-tool="' + toolId + '"] .c4-widget');
    if (!widget) return;
    const canvas = widget.querySelector('.c4-canvas');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;

    const cellW = canvas.width / C4_COLS;
    const col = Math.floor(x / cellW);
    if (col < 0 || col >= C4_COLS) return;
    if (s.board[0][col] !== C4_EMPTY) return;

    c4PlayCol(toolId, col);

    if (!s.gameOver && s.mode === 'ai' && s.turn === C4_P2) {
        setTimeout(() => c4AIMove(toolId), 200);
    }
}

function c4CanvasMove(toolId, e) {
    const s = c4State[toolId];
    if (!s || s.gameOver) return;
    if (s.mode === 'ai' && s.turn === C4_P2) return;

    const widget = document.querySelector('.tool[data-tool="' + toolId + '"] .c4-widget');
    if (!widget) return;
    const canvas = widget.querySelector('.c4-canvas');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;

    const cellW = canvas.width / C4_COLS;
    const col = Math.floor(x / cellW);
    if (col !== s.hoverCol) {
        s.hoverCol = col;
        c4Draw(toolId);
    }
}

function c4CanvasLeave(toolId) {
    const s = c4State[toolId];
    if (!s) return;
    s.hoverCol = -1;
    c4Draw(toolId);
}

function c4Render(toolId) {
    const s = c4State[toolId];
    if (!s) return;
    const widget = document.querySelector('.tool[data-tool="' + toolId + '"] .c4-widget');
    if (!widget) return;

    const status = widget.querySelector('.c4-status');
    if (s.gameOver) {
        if (s.winner === C4_P1) status.innerHTML = '<span class="c4-dot" style="background:#e74c3c"></span>Red wins!';
        else if (s.winner === C4_P2) status.innerHTML = '<span class="c4-dot" style="background:#f1c40f"></span>Yellow wins!';
        else status.innerHTML = 'Draw!';
    } else {
        const color = s.turn === C4_P1 ? '#e74c3c' : '#f1c40f';
        const name = s.turn === C4_P1 ? 'Red' : 'Yellow';
        status.innerHTML = '<span class="c4-dot" style="background:' + color + '"></span>' + name + '\'s turn';
    }

    const modeSelect = widget.querySelector('.c4-mode');
    const diffSelect = widget.querySelector('.c4-diff');
    if (modeSelect) modeSelect.value = s.mode;
    if (diffSelect) diffSelect.value = s.difficulty;

    c4Draw(toolId);
}

function c4Draw(toolId) {
    const s = c4State[toolId];
    if (!s) return;
    const widget = document.querySelector('.tool[data-tool="' + toolId + '"] .c4-widget');
    if (!widget) return;
    const canvas = widget.querySelector('.c4-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = canvas.width;
    const H = canvas.height;
    const cellW = W / C4_COLS;
    const cellH = H / (C4_ROWS + 1);
    const radius = Math.min(cellW, cellH) * 0.38;

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    // Hover preview
    if (s.hoverCol >= 0 && s.hoverCol < C4_COLS && !s.gameOver) {
        const color = s.turn === C4_P1 ? 'rgba(231,76,60,0.5)' : 'rgba(241,196,15,0.5)';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(s.hoverCol * cellW + cellW / 2, cellH / 2, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Blue board
    const boardY = cellH;
    ctx.fillStyle = '#0f3460';
    ctx.beginPath();
    ctx.roundRect(0, boardY, W, H - boardY, 8);
    ctx.fill();

    // Cells
    for (let r = 0; r < C4_ROWS; r++) {
        for (let c = 0; c < C4_COLS; c++) {
            const cx = c * cellW + cellW / 2;
            const cy = boardY + r * cellH + cellH / 2;

            // Hole
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
            ctx.fill();

            // Piece
            const piece = s.board[r][c];
            if (piece !== C4_EMPTY) {
                const isWin = s.winCells && s.winCells.some(cell => cell[0] === r && cell[1] === c);
                ctx.fillStyle = piece === C4_P1 ? (isWin ? '#ff6b6b' : '#e74c3c') : (isWin ? '#ffe066' : '#f1c40f');
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fill();

                // 3D sheen
                const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
                grad.addColorStop(0, 'rgba(255,255,255,0.3)');
                grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fill();

                // Win glow
                if (isWin) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }
    }
}

function c4ResizeCanvas(toolId) {
    const widget = document.querySelector('.tool[data-tool="' + toolId + '"] .c4-widget');
    if (!widget) return;
    const canvas = widget.querySelector('.c4-canvas');
    const wrap = widget.querySelector('.c4-board-wrap');
    if (!canvas || !wrap) return;

    const wrapW = wrap.clientWidth - 16;
    const wrapH = wrap.clientHeight - 16;
    const aspect = C4_COLS / (C4_ROWS + 1);
    let w = wrapW;
    let h = w / aspect;
    if (h > wrapH) {
        h = wrapH;
        w = h * aspect;
    }
    canvas.width = Math.max(w, 100);
    canvas.height = Math.max(h, 80);
    c4Draw(toolId);
}

function c4Init() {
    document.querySelectorAll('.c4-widget').forEach(widget => {
        const toolId = c4GetToolId(widget);
        if (!toolId) return;

        let s = c4GetState(toolId);
        if (!s) {
            c4State[toolId] = {
                board: c4NewBoard(),
                turn: C4_P1,
                mode: 'ai',
                difficulty: 'medium',
                winner: 0,
                winCells: [],
                gameOver: false,
                hoverCol: -1
            };
        } else {
            s.hoverCol = -1;
        }

        c4ResizeCanvas(toolId);
        c4Render(toolId);

        const canvas = widget.querySelector('.c4-canvas');
        canvas.addEventListener('click', (e) => c4CanvasClick(toolId, e));
        canvas.addEventListener('mousemove', (e) => c4CanvasMove(toolId, e));
        canvas.addEventListener('mouseleave', () => c4CanvasLeave(toolId));

        const ro = new ResizeObserver(() => c4ResizeCanvas(toolId));
        ro.observe(widget.querySelector('.c4-board-wrap'));
    });
}

// =============================================
// BREAKOUT GAME
// =============================================

const breakoutInstances = new Map();

const BK_PADDLE_H = 10;
const BK_PADDLE_W_RATIO = 0.2;
const BK_BALL_R = 5;
const BK_BALL_SPEED = 250;
const BK_BRICK_ROWS = 5;
const BK_BRICK_COLS = 8;
const BK_BRICK_PAD = 3;
const BK_LIVES = 3;
const BK_COLORS = ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3498db'];

function breakoutGetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function breakoutGetBest(toolId) {
    const custom = toolCustomizations[toolId] || {};
    return custom.breakoutBest || 0;
}

function breakoutSaveBest(toolId, score) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].breakoutBest = score;
    saveToolCustomizations(toolCustomizations);
}

function breakoutNewState(w, h) {
    const paddleW = Math.max(40, w * BK_PADDLE_W_RATIO);
    return {
        phase: 'idle',
        paddle: { x: w / 2 - paddleW / 2, w: paddleW, h: BK_PADDLE_H },
        ball: { x: w / 2, y: h - 30 - BK_BALL_R, vx: 0, vy: 0, r: BK_BALL_R, stuck: true },
        bricks: [],
        score: 0,
        lives: BK_LIVES,
        level: 1,
        bestScore: 0,
        frameId: null,
        lastTime: 0,
        canvasW: w,
        canvasH: h
    };
}

function breakoutCreateBricks(w, h, level) {
    const bricks = [];
    const topOffset = 40;
    const totalPadding = BK_BRICK_PAD * (BK_BRICK_COLS + 1);
    const brickW = (w - totalPadding) / BK_BRICK_COLS;
    const brickH = 14;
    for (let r = 0; r < BK_BRICK_ROWS; r++) {
        for (let c = 0; c < BK_BRICK_COLS; c++) {
            bricks.push({
                x: BK_BRICK_PAD + c * (brickW + BK_BRICK_PAD),
                y: topOffset + r * (brickH + BK_BRICK_PAD),
                w: brickW,
                h: brickH,
                color: BK_COLORS[r % BK_COLORS.length],
                alive: true
            });
        }
    }
    return bricks;
}

function breakoutInit() {
    document.querySelectorAll('.breakout-widget').forEach(widget => {
        const toolId = breakoutGetToolId(widget);
        if (!toolId || breakoutInstances.has(toolId)) return;

        const canvas = widget.querySelector('.breakout-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width || 360;
        canvas.height = rect.height || 440;

        const state = breakoutNewState(canvas.width, canvas.height);
        state.bestScore = breakoutGetBest(toolId);
        breakoutInstances.set(toolId, { widget, canvas, ctx, state });

        breakoutDrawIdle(toolId);

        const ro = new ResizeObserver(() => {
            const r = canvas.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
                canvas.width = r.width;
                canvas.height = r.height;
                const inst = breakoutInstances.get(toolId);
                if (inst) {
                    inst.state.canvasW = r.width;
                    inst.state.canvasH = r.height;
                    if (inst.state.phase === 'idle') breakoutDrawIdle(toolId);
                }
            }
        });
        ro.observe(canvas);

        canvas.addEventListener('mousemove', (e) => {
            const r = canvas.getBoundingClientRect();
            breakoutMouseMove(toolId, e.clientX - r.left);
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const r = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            breakoutMouseMove(toolId, touch.clientX - r.left);
        }, { passive: false });

        const handleClick = (e) => {
            const inst = breakoutInstances.get(toolId);
            if (!inst) return;
            if (inst.state.phase === 'ready') {
                e.preventDefault();
                breakoutLaunch(toolId);
            }
        };
        canvas.addEventListener('mousedown', handleClick);
        canvas.addEventListener('touchstart', handleClick, { passive: false });
    });
}

function breakoutStart(btn) {
    const widget = btn.closest('.breakout-widget');
    const toolId = breakoutGetToolId(widget);
    if (!toolId) return;

    const inst = breakoutInstances.get(toolId);
    if (!inst) return;

    const s = breakoutNewState(inst.canvas.width, inst.canvas.height);
    s.phase = 'ready';
    s.bestScore = breakoutGetBest(toolId);
    s.bricks = breakoutCreateBricks(s.canvasW, s.canvasH, 1);
    inst.state = s;

    widget.querySelector('.breakout-overlay').classList.add('hidden');
    widget.querySelector('.breakout-hud').classList.remove('hidden');
    breakoutUpdateHud(toolId);

    widget.focus();

    s.lastTime = performance.now();
    breakoutLoop(toolId);
}

function breakoutLaunch(toolId) {
    const inst = breakoutInstances.get(toolId);
    if (!inst || inst.state.phase !== 'ready') return;
    const s = inst.state;
    s.phase = 'playing';
    s.ball.stuck = false;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
    const speed = BK_BALL_SPEED + (s.level - 1) * 20;
    s.ball.vx = Math.cos(angle) * speed;
    s.ball.vy = Math.sin(angle) * speed;
}

function breakoutLoop(toolId) {
    const inst = breakoutInstances.get(toolId);
    if (!inst) return;
    const phase = inst.state.phase;
    if (phase !== 'playing' && phase !== 'ready') return;

    const now = performance.now();
    let dt = (now - inst.state.lastTime) / 1000;
    inst.state.lastTime = now;
    if (dt > 0.05) dt = 0.05;

    if (phase === 'playing') {
        breakoutUpdate(toolId, dt);
    }
    breakoutDraw(toolId);

    const newPhase = inst.state.phase;
    if (newPhase === 'playing' || newPhase === 'ready') {
        inst.state.frameId = requestAnimationFrame(() => breakoutLoop(toolId));
    }
}

function breakoutUpdate(toolId, dt) {
    const inst = breakoutInstances.get(toolId);
    if (!inst) return;
    const s = inst.state;
    const W = s.canvasW;
    const H = s.canvasH;
    const b = s.ball;

    // Move ball
    b.x += b.vx * dt;
    b.y += b.vy * dt;

    // Wall collisions (left/right)
    if (b.x - b.r <= 0) {
        b.x = b.r;
        b.vx = Math.abs(b.vx);
    } else if (b.x + b.r >= W) {
        b.x = W - b.r;
        b.vx = -Math.abs(b.vx);
    }

    // Top wall
    if (b.y - b.r <= 0) {
        b.y = b.r;
        b.vy = Math.abs(b.vy);
    }

    // Paddle collision
    const p = s.paddle;
    const paddleTop = H - 20 - p.h;
    if (b.vy > 0 && b.y + b.r >= paddleTop && b.y + b.r <= paddleTop + p.h + 4 &&
        b.x >= p.x && b.x <= p.x + p.w) {
        b.y = paddleTop - b.r;
        const hitPos = (b.x - p.x) / p.w;
        const angle = -Math.PI / 2 + (hitPos - 0.5) * 1.2;
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        b.vx = Math.cos(angle) * speed;
        b.vy = Math.sin(angle) * speed;
        if (b.vy > -30) b.vy = -30;
    }

    // Bottom — lose life
    if (b.y - b.r > H) {
        s.lives--;
        breakoutUpdateHud(toolId);
        if (s.lives <= 0) {
            breakoutGameOver(toolId);
            return;
        }
        // Reset ball to paddle
        s.ball.stuck = true;
        s.ball.x = s.paddle.x + s.paddle.w / 2;
        s.ball.y = H - 20 - s.paddle.h - b.r;
        s.ball.vx = 0;
        s.ball.vy = 0;
        s.phase = 'ready';
        return;
    }

    // Brick collisions
    let bricksAlive = 0;
    for (let i = 0; i < s.bricks.length; i++) {
        const br = s.bricks[i];
        if (!br.alive) continue;
        bricksAlive++;

        // AABB check
        if (b.x + b.r > br.x && b.x - b.r < br.x + br.w &&
            b.y + b.r > br.y && b.y - b.r < br.y + br.h) {
            br.alive = false;
            bricksAlive--;
            s.score += 10;
            breakoutUpdateHud(toolId);

            // Determine reflection axis
            const overlapLeft = (b.x + b.r) - br.x;
            const overlapRight = (br.x + br.w) - (b.x - b.r);
            const overlapTop = (b.y + b.r) - br.y;
            const overlapBottom = (br.y + br.h) - (b.y - b.r);
            const minOverlapX = Math.min(overlapLeft, overlapRight);
            const minOverlapY = Math.min(overlapTop, overlapBottom);

            if (minOverlapX < minOverlapY) {
                b.vx = -b.vx;
            } else {
                b.vy = -b.vy;
            }
            break; // Only one brick per frame
        }
    }

    // Level cleared
    if (bricksAlive === 0) {
        breakoutLevelUp(toolId);
    }
}

function breakoutLevelUp(toolId) {
    const inst = breakoutInstances.get(toolId);
    if (!inst) return;
    const s = inst.state;
    s.level++;
    s.bricks = breakoutCreateBricks(s.canvasW, s.canvasH, s.level);
    s.ball.stuck = true;
    s.ball.x = s.paddle.x + s.paddle.w / 2;
    s.ball.y = s.canvasH - 20 - s.paddle.h - s.ball.r;
    s.ball.vx = 0;
    s.ball.vy = 0;
    s.phase = 'ready';
    breakoutUpdateHud(toolId);
}

function breakoutGameOver(toolId) {
    const inst = breakoutInstances.get(toolId);
    if (!inst) return;
    const s = inst.state;
    s.phase = 'gameover';
    if (s.frameId) cancelAnimationFrame(s.frameId);

    const best = Math.max(breakoutGetBest(toolId), s.score);
    breakoutSaveBest(toolId, best);

    breakoutDraw(toolId);

    const overlay = inst.widget.querySelector('.breakout-overlay');
    overlay.classList.remove('hidden');
    overlay.innerHTML =
        '<div class="breakout-overlay-gameover">Game Over</div>' +
        '<div class="breakout-overlay-score">Score: ' + s.score + '</div>' +
        '<div class="breakout-overlay-best">Best: ' + best + '</div>' +
        '<button class="breakout-play-btn" onclick="breakoutStart(this)">Play Again</button>';
    inst.widget.querySelector('.breakout-hud').classList.add('hidden');
}

function breakoutUpdateHud(toolId) {
    const inst = breakoutInstances.get(toolId);
    if (!inst) return;
    const s = inst.state;
    const hud = inst.widget.querySelector('.breakout-hud');
    if (!hud) return;
    hud.querySelector('.breakout-hud-score').textContent = 'Score: ' + s.score;
    hud.querySelector('.breakout-hud-level').textContent = 'Level ' + s.level;
    let hearts = '';
    for (let i = 0; i < s.lives; i++) hearts += '\u2665';
    hud.querySelector('.breakout-hud-lives').textContent = hearts;
}

function breakoutDraw(toolId) {
    const inst = breakoutInstances.get(toolId);
    if (!inst) return;
    const ctx = inst.ctx;
    const s = inst.state;
    const W = s.canvasW;
    const H = s.canvasH;

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    // Bricks
    breakoutDrawBricks(ctx, s.bricks);

    // Paddle
    const paddleTop = H - 20 - s.paddle.h;
    ctx.fillStyle = '#ecf0f1';
    ctx.beginPath();
    ctx.roundRect(s.paddle.x, paddleTop, s.paddle.w, s.paddle.h, 4);
    ctx.fill();

    // Ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI * 2);
    ctx.fill();
}

function breakoutDrawIdle(toolId) {
    const inst = breakoutInstances.get(toolId);
    if (!inst) return;
    const ctx = inst.ctx;
    const W = inst.canvas.width;
    const H = inst.canvas.height;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    // Draw preview bricks
    const bricks = breakoutCreateBricks(W, H, 1);
    breakoutDrawBricks(ctx, bricks);

    // Draw preview paddle
    const paddleW = Math.max(40, W * BK_PADDLE_W_RATIO);
    const paddleTop = H - 20 - BK_PADDLE_H;
    ctx.fillStyle = '#ecf0f1';
    ctx.beginPath();
    ctx.roundRect(W / 2 - paddleW / 2, paddleTop, paddleW, BK_PADDLE_H, 4);
    ctx.fill();

    // Draw preview ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(W / 2, paddleTop - BK_BALL_R - 2, BK_BALL_R, 0, Math.PI * 2);
    ctx.fill();
}

function breakoutDrawBricks(ctx, bricks) {
    for (let i = 0; i < bricks.length; i++) {
        const br = bricks[i];
        if (!br.alive) continue;
        ctx.fillStyle = br.color;
        ctx.beginPath();
        ctx.roundRect(br.x, br.y, br.w, br.h, 2);
        ctx.fill();
    }
}

function breakoutMouseMove(toolId, mouseX) {
    const inst = breakoutInstances.get(toolId);
    if (!inst) return;
    const s = inst.state;
    if (s.phase !== 'ready' && s.phase !== 'playing') return;

    const W = s.canvasW;
    s.paddle.x = Math.max(0, Math.min(W - s.paddle.w, mouseX - s.paddle.w / 2));

    if (s.ball.stuck) {
        s.ball.x = s.paddle.x + s.paddle.w / 2;
    }
}

// =============================================
// TIC TAC TOE
// =============================================

var tttState = {};
var TTT_WINS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function tttGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function tttGetWidget(el) {
    return el.closest('.ttt-widget');
}

function tttGetState(toolId) {
    if (!tttState[toolId]) {
        var customizations = loadToolCustomizations();
        var saved = customizations[toolId] && customizations[toolId].tttData;
        if (saved) {
            tttState[toolId] = {
                board: [0,0,0,0,0,0,0,0,0],
                turn: 1,
                winner: 0,
                winLine: null,
                mode: saved.mode || 'pvp',
                difficulty: saved.difficulty || 'medium',
                scoreX: saved.scoreX || 0,
                scoreO: saved.scoreO || 0,
                draws: saved.draws || 0,
                gameOver: false
            };
        } else {
            tttState[toolId] = null;
        }
    }
    return tttState[toolId];
}

function tttSaveData(toolId) {
    var s = tttState[toolId];
    if (!s) return;
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].tttData = {
        mode: s.mode,
        difficulty: s.difficulty,
        scoreX: s.scoreX,
        scoreO: s.scoreO,
        draws: s.draws
    };
    saveToolCustomizations(customizations);
}

function tttNewGame(btn) {
    var toolId = tttGetToolId(btn);
    if (toolId) tttNewGameForToolId(toolId);
}

function tttNewGameForToolId(toolId) {
    var s = tttState[toolId];
    var mode = s ? s.mode : 'pvp';
    var difficulty = s ? s.difficulty : 'medium';
    var scoreX = s ? s.scoreX : 0;
    var scoreO = s ? s.scoreO : 0;
    var draws = s ? s.draws : 0;

    tttState[toolId] = {
        board: [0,0,0,0,0,0,0,0,0],
        turn: 1,
        winner: 0,
        winLine: null,
        mode: mode,
        difficulty: difficulty,
        scoreX: scoreX,
        scoreO: scoreO,
        draws: draws,
        gameOver: false
    };
    tttRender(toolId);
}

function tttSetMode(sel) {
    var toolId = tttGetToolId(sel);
    if (!toolId) return;
    var s = tttGetState(toolId);
    if (s) s.mode = sel.value;
    tttSaveData(toolId);
    tttNewGameForToolId(toolId);
}

function tttSetDifficulty(sel) {
    var toolId = tttGetToolId(sel);
    if (!toolId) return;
    var s = tttGetState(toolId);
    if (s) s.difficulty = sel.value;
    tttSaveData(toolId);
    tttNewGameForToolId(toolId);
}

function tttCheckWinner(board) {
    for (var i = 0; i < TTT_WINS.length; i++) {
        var a = TTT_WINS[i][0], b = TTT_WINS[i][1], c = TTT_WINS[i][2];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line: TTT_WINS[i] };
        }
    }
    return null;
}

function tttIsFull(board) {
    for (var i = 0; i < 9; i++) {
        if (!board[i]) return false;
    }
    return true;
}

function tttCellClick(el, idx) {
    var toolId = tttGetToolId(el);
    if (!toolId) return;
    var s = tttGetState(toolId);
    if (!s || s.gameOver || s.board[idx]) return;

    s.board[idx] = s.turn;
    var result = tttCheckWinner(s.board);
    if (result) {
        s.winner = result.winner;
        s.winLine = result.line;
        s.gameOver = true;
        if (result.winner === 1) s.scoreX++;
        else s.scoreO++;
        tttSaveData(toolId);
        tttRender(toolId);
        return;
    }
    if (tttIsFull(s.board)) {
        s.gameOver = true;
        s.draws++;
        tttSaveData(toolId);
        tttRender(toolId);
        return;
    }

    s.turn = s.turn === 1 ? 2 : 1;
    tttRender(toolId);

    // AI move
    if (s.mode === 'ai' && s.turn === 2 && !s.gameOver) {
        setTimeout(function() {
            tttAIMove(toolId);
        }, 300);
    }
}

function tttAIMove(toolId) {
    var s = tttState[toolId];
    if (!s || s.gameOver || s.turn !== 2) return;

    var move = -1;
    if (s.difficulty === 'easy') {
        move = tttAIRandom(s.board);
    } else if (s.difficulty === 'medium') {
        // 60% smart, 40% random
        move = Math.random() < 0.6 ? tttAIMinimax(s.board, 2) : tttAIRandom(s.board);
    } else {
        move = tttAIMinimax(s.board, 2);
    }

    if (move >= 0) {
        s.board[move] = 2;
        var result = tttCheckWinner(s.board);
        if (result) {
            s.winner = result.winner;
            s.winLine = result.line;
            s.gameOver = true;
            s.scoreO++;
            tttSaveData(toolId);
        } else if (tttIsFull(s.board)) {
            s.gameOver = true;
            s.draws++;
            tttSaveData(toolId);
        } else {
            s.turn = 1;
        }
        tttRender(toolId);
    }
}

function tttAIRandom(board) {
    var empty = [];
    for (var i = 0; i < 9; i++) {
        if (!board[i]) empty.push(i);
    }
    return empty.length ? empty[Math.floor(Math.random() * empty.length)] : -1;
}

function tttAIMinimax(board, player) {
    var best = tttMinimax(board, player, true);
    return best.move;
}

function tttMinimax(board, player, isMax) {
    var result = tttCheckWinner(board);
    if (result) {
        return { score: result.winner === 2 ? 10 : -10, move: -1 };
    }
    if (tttIsFull(board)) {
        return { score: 0, move: -1 };
    }

    var bestScore = isMax ? -Infinity : Infinity;
    var bestMove = -1;

    for (var i = 0; i < 9; i++) {
        if (board[i]) continue;
        board[i] = isMax ? 2 : 1;
        var result2 = tttMinimax(board, player, !isMax);
        board[i] = 0;
        if (isMax) {
            if (result2.score > bestScore) {
                bestScore = result2.score;
                bestMove = i;
            }
        } else {
            if (result2.score < bestScore) {
                bestScore = result2.score;
                bestMove = i;
            }
        }
    }
    return { score: bestScore, move: bestMove };
}

function tttResetScore(btn) {
    var toolId = tttGetToolId(btn);
    if (!toolId) return;
    var s = tttGetState(toolId);
    if (s) {
        s.scoreX = 0;
        s.scoreO = 0;
        s.draws = 0;
        tttSaveData(toolId);
        tttRender(toolId);
    }
}

function tttRender(toolId) {
    var s = tttState[toolId];
    if (!s) return;

    var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
    tools.forEach(function(tool) {
        var widget = tool.querySelector('.ttt-widget');
        if (!widget) return;

        // Sync dropdowns
        var modeSel = widget.querySelector('.ttt-mode');
        if (modeSel) modeSel.value = s.mode;
        var diffSel = widget.querySelector('.ttt-difficulty');
        if (diffSel) {
            diffSel.value = s.difficulty;
            diffSel.style.display = s.mode === 'ai' ? '' : 'none';
        }

        // Status
        var statusEl = widget.querySelector('.ttt-status');
        if (statusEl) {
            if (s.gameOver) {
                if (s.winner === 1) {
                    statusEl.innerHTML = '<span style="color:#3498db;">X wins!</span>';
                } else if (s.winner === 2) {
                    statusEl.innerHTML = '<span style="color:#e74c3c;">O wins!</span>';
                } else {
                    statusEl.innerHTML = '<span style="color:var(--text-muted);">Draw!</span>';
                }
            } else {
                var label = s.turn === 1 ? '<span style="color:#3498db;">X</span>' : '<span style="color:#e74c3c;">O</span>';
                statusEl.innerHTML = label + '\'s turn';
            }
        }

        // Grid
        var gridEl = widget.querySelector('.ttt-grid');
        if (gridEl) {
            var html = '';
            for (var i = 0; i < 9; i++) {
                var cls = 'ttt-cell';
                var content = '';
                if (s.board[i] === 1) {
                    cls += ' ttt-x';
                    content = 'X';
                } else if (s.board[i] === 2) {
                    cls += ' ttt-o';
                    content = 'O';
                }
                if (s.winLine && s.winLine.indexOf(i) >= 0) {
                    cls += ' ttt-win';
                }
                var clickable = !s.gameOver && !s.board[i] && !(s.mode === 'ai' && s.turn === 2);
                var onclick = clickable ? ' onclick="tttCellClick(this,' + i + ')"' : '';
                var cursor = clickable ? 'cursor:pointer;' : 'cursor:default;';
                html += '<div class="' + cls + '" style="' + cursor + '"' + onclick + '>' + content + '</div>';
            }
            gridEl.innerHTML = html;
        }

        // Score
        var scoreEl = widget.querySelector('.ttt-score');
        if (scoreEl) {
            scoreEl.innerHTML = '<span style="color:#3498db;">X: ' + s.scoreX + '</span>' +
                '<span style="color:var(--text-muted);">Draw: ' + s.draws + '</span>' +
                '<span style="color:#e74c3c;">O: ' + s.scoreO + '</span>';
        }
    });
}

function tttInit() {
    document.querySelectorAll('.ttt-widget').forEach(function(widget) {
        var tool = widget.closest('.tool');
        if (!tool) return;
        var toolId = tool.getAttribute('data-tool');
        if (!toolId) return;

        var s = tttGetState(toolId);
        if (!s) {
            tttState[toolId] = {
                board: [0,0,0,0,0,0,0,0,0],
                turn: 1,
                winner: 0,
                winLine: null,
                mode: 'pvp',
                difficulty: 'medium',
                scoreX: 0,
                scoreO: 0,
                draws: 0,
                gameOver: false
            };
        }
        tttRender(toolId);
    });
}

// =============================================
// 2048 GAME
// =============================================

var g2048State = {};
var g2048ActiveToolId = null;
var g2048KeyListenerAdded = false;

function g2048GetToolId(el) {
    var t = el.closest('.tool');
    return t ? t.getAttribute('data-tool') : null;
}

function g2048GetWidget(el) {
    return el.closest('.g2048-widget');
}

function g2048GetState(toolId) {
    if (!g2048State[toolId]) {
        var customizations = loadToolCustomizations();
        var saved = customizations[toolId] && customizations[toolId].g2048Data;
        if (saved) {
            g2048State[toolId] = saved;
        } else {
            g2048State[toolId] = g2048FreshState();
        }
    }
    return g2048State[toolId];
}

function g2048SaveData(toolId) {
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].g2048Data = g2048State[toolId];
    saveToolCustomizations(customizations);
}

function g2048FreshState() {
    var grid = [];
    for (var r = 0; r < 4; r++) {
        grid.push([0, 0, 0, 0]);
    }
    return {
        grid: grid,
        score: 0,
        best: 0,
        won: false,
        over: false,
        keepPlaying: false,
        newTiles: [],
        mergedTiles: []
    };
}

function g2048NewGame(btn) {
    var toolId = g2048GetToolId(btn);
    if (!toolId) return;
    var s = g2048GetState(toolId);
    var best = s.best;
    g2048State[toolId] = g2048FreshState();
    g2048State[toolId].best = best;
    g2048AddRandom(toolId);
    g2048AddRandom(toolId);
    g2048SaveData(toolId);
    g2048Render(toolId);
}

function g2048AddRandom(toolId) {
    var s = g2048State[toolId];
    var empty = [];
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            if (s.grid[r][c] === 0) empty.push([r, c]);
        }
    }
    if (empty.length === 0) return;
    var pick = empty[Math.floor(Math.random() * empty.length)];
    var val = Math.random() < 0.9 ? 2 : 4;
    s.grid[pick[0]][pick[1]] = val;
    s.newTiles = [[pick[0], pick[1]]];
}

function g2048Move(toolId, dir) {
    var s = g2048GetState(toolId);
    if (s.over || (s.won && !s.keepPlaying)) return false;
    var grid = s.grid;
    var moved = false;
    s.mergedTiles = [];

    if (dir === 'left' || dir === 'right') {
        for (var r = 0; r < 4; r++) {
            var row = grid[r].slice();
            var result = g2048SlideRow(row, dir === 'right');
            if (result.moved) moved = true;
            grid[r] = result.row;
            for (var mi = 0; mi < result.mergedAt.length; mi++) {
                s.mergedTiles.push([r, result.mergedAt[mi]]);
            }
            s.score += result.pts;
        }
    } else {
        for (var c = 0; c < 4; c++) {
            var col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
            var result = g2048SlideRow(col, dir === 'down');
            if (result.moved) moved = true;
            for (var rr = 0; rr < 4; rr++) grid[rr][c] = result.row[rr];
            for (var mi = 0; mi < result.mergedAt.length; mi++) {
                s.mergedTiles.push([result.mergedAt[mi], c]);
            }
            s.score += result.pts;
        }
    }

    if (moved) {
        if (s.score > s.best) s.best = s.score;
        g2048AddRandom(toolId);
        if (!s.won && !s.keepPlaying && g2048HasValue(s.grid, 2048)) {
            s.won = true;
        }
        if (!g2048CanMove(s.grid)) {
            s.over = true;
        }
    }
    return moved;
}

function g2048SlideRow(row, reverse) {
    var orig = row.slice();
    if (reverse) row = row.slice().reverse();
    var filtered = row.filter(function(v) { return v !== 0; });
    var result = [];
    var pts = 0;
    var mergedAt = [];
    var i = 0;
    while (i < filtered.length) {
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
            var merged = filtered[i] * 2;
            result.push(merged);
            pts += merged;
            mergedAt.push(result.length - 1);
            i += 2;
        } else {
            result.push(filtered[i]);
            i++;
        }
    }
    while (result.length < 4) result.push(0);
    if (reverse) {
        result.reverse();
        mergedAt = mergedAt.map(function(idx) { return 3 - idx; });
    }
    var moved = false;
    for (var j = 0; j < 4; j++) {
        if (result[j] !== orig[j]) { moved = true; break; }
    }
    return { row: result, moved: moved, pts: pts, mergedAt: mergedAt };
}

function g2048HasValue(grid, val) {
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            if (grid[r][c] === val) return true;
        }
    }
    return false;
}

function g2048CanMove(grid) {
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            if (grid[r][c] === 0) return true;
            if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
            if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
        }
    }
    return false;
}

function g2048Undo(btn) {
    var toolId = g2048GetToolId(btn);
    if (!toolId) return;
    var s = g2048GetState(toolId);
    if (!s.prevGrid) return;
    s.grid = s.prevGrid;
    s.score = s.prevScore;
    s.over = false;
    s.won = s.prevWon;
    s.prevGrid = null;
    s.newTiles = [];
    s.mergedTiles = [];
    g2048SaveData(toolId);
    g2048Render(toolId);
}

function g2048KeepPlaying(btn) {
    var toolId = g2048GetToolId(btn);
    if (!toolId) return;
    var s = g2048GetState(toolId);
    s.keepPlaying = true;
    g2048SaveData(toolId);
    g2048Render(toolId);
}

function g2048HandleKey(toolId, dir) {
    var s = g2048GetState(toolId);
    if (s.over || (s.won && !s.keepPlaying)) return;
    // Save for undo
    s.prevGrid = s.grid.map(function(row) { return row.slice(); });
    s.prevScore = s.score;
    s.prevWon = s.won;
    var moved = g2048Move(toolId, dir);
    if (moved) {
        g2048SaveData(toolId);
        g2048Render(toolId);
    } else {
        s.prevGrid = null;
    }
}

function g2048Render(toolId) {
    var el = document.querySelector('.tool[data-tool="' + toolId + '"]');
    if (!el) return;
    var s = g2048GetState(toolId);
    var board = el.querySelector('.g2048-board');
    if (!board) return;

    // Update scores
    var scoreEl = el.querySelector('.g2048-score-value');
    var bestEl = el.querySelector('.g2048-best-value');
    if (scoreEl) scoreEl.textContent = s.score;
    if (bestEl) bestEl.textContent = s.best;

    // Render grid
    var html = '';
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            var val = s.grid[r][c];
            var cls = 'g2048-cell';
            var dataVal = '';
            var text = '';
            if (val > 0) {
                text = val;
                if (val > 2048) {
                    cls += ' big-tile';
                } else {
                    dataVal = ' data-value="' + val + '"';
                }
                var isNew = false;
                for (var ni = 0; ni < s.newTiles.length; ni++) {
                    if (s.newTiles[ni][0] === r && s.newTiles[ni][1] === c) { isNew = true; break; }
                }
                var isMerged = false;
                for (var mi = 0; mi < s.mergedTiles.length; mi++) {
                    if (s.mergedTiles[mi][0] === r && s.mergedTiles[mi][1] === c) { isMerged = true; break; }
                }
                if (isMerged) cls += ' merge';
                else if (isNew) cls += ' pop';
            }
            html += '<div class="' + cls + '"' + dataVal + '>' + text + '</div>';
        }
    }
    board.innerHTML = html;

    // Overlay
    var overlay = el.querySelector('.g2048-overlay');
    if (overlay) {
        var titleEl = overlay.querySelector('.g2048-overlay-title');
        var subEl = overlay.querySelector('.g2048-overlay-sub');
        if (s.won && !s.keepPlaying) {
            overlay.classList.remove('hidden');
            titleEl.textContent = 'You Win!';
            titleEl.classList.add('win');
            subEl.textContent = 'Score: ' + s.score;
            overlay.innerHTML = '<div class="g2048-overlay-title win">You Win!</div>' +
                '<div class="g2048-overlay-sub">Score: ' + s.score + '</div>' +
                '<div style="display:flex;gap:8px;">' +
                '<button onclick="g2048KeepPlaying(this)">Keep Going</button>' +
                '<button onclick="g2048NewGame(this)">New Game</button>' +
                '</div>';
        } else if (s.over) {
            overlay.classList.remove('hidden');
            overlay.innerHTML = '<div class="g2048-overlay-title">Game Over</div>' +
                '<div class="g2048-overlay-sub">Score: ' + s.score + '</div>' +
                '<button onclick="g2048NewGame(this)">Try Again</button>';
        } else {
            overlay.classList.add('hidden');
        }
    }
}

function g2048KeyHandler(e) {
    if (!g2048ActiveToolId) return;
    var active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;

    var dirs = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
                 a: 'left', d: 'right', w: 'up', s: 'down' };
    var dir = dirs[e.key];
    if (dir) {
        e.preventDefault();
        g2048HandleKey(g2048ActiveToolId, dir);
    }
}

function g2048Init() {
    document.querySelectorAll('.g2048-widget').forEach(function(widget) {
        if (widget.dataset.inited) return;
        widget.dataset.inited = '1';

        var tool = widget.closest('.tool');
        if (!tool) return;
        var toolId = tool.getAttribute('data-tool');
        if (!toolId) return;

        var s = g2048GetState(toolId);

        // If fresh state with empty grid, add initial tiles
        var hasAny = false;
        for (var r = 0; r < 4; r++) {
            for (var c = 0; c < 4; c++) {
                if (s.grid[r][c] !== 0) { hasAny = true; break; }
            }
            if (hasAny) break;
        }
        if (!hasAny) {
            g2048AddRandom(toolId);
            g2048AddRandom(toolId);
            g2048SaveData(toolId);
        }

        g2048Render(toolId);

        // Activate this game on click/mousedown
        widget.addEventListener('mousedown', function() {
            g2048ActiveToolId = toolId;
        });

        // Set as active by default
        g2048ActiveToolId = toolId;

        // Touch/swipe support
        var startX, startY;
        widget.addEventListener('touchstart', function(e) {
            g2048ActiveToolId = toolId;
            var t = e.touches[0];
            startX = t.clientX;
            startY = t.clientY;
        }, { passive: true });

        widget.addEventListener('touchend', function(e) {
            if (startX == null) return;
            var t = e.changedTouches[0];
            var dx = t.clientX - startX;
            var dy = t.clientY - startY;
            var absDx = Math.abs(dx);
            var absDy = Math.abs(dy);
            if (Math.max(absDx, absDy) < 30) return;
            var dir;
            if (absDx > absDy) {
                dir = dx > 0 ? 'right' : 'left';
            } else {
                dir = dy > 0 ? 'down' : 'up';
            }
            g2048HandleKey(toolId, dir);
            startX = null;
            startY = null;
        }, { passive: true });
    });

    // Global keyboard listener (added once)
    if (!g2048KeyListenerAdded) {
        document.addEventListener('keydown', g2048KeyHandler);
        g2048KeyListenerAdded = true;
    }
}

// =============================================
// MINESWEEPER
// =============================================

var msState = {};

var MS_DIFFICULTIES = {
    easy:   { rows: 9,  cols: 9,  mines: 10 },
    medium: { rows: 12, cols: 12, mines: 30 },
    hard:   { rows: 16, cols: 16, mines: 50 }
};

function msGetToolId(el) {
    var t = el.closest('.tool');
    return t ? t.getAttribute('data-tool') : null;
}

function msGetWidget(el) {
    return el.closest('.ms-widget');
}

function msGetState(toolId) {
    if (!msState[toolId]) {
        var customizations = loadToolCustomizations();
        var saved = customizations[toolId] && customizations[toolId].msData;
        var bestTime = (saved && saved.bestTime) ? saved.bestTime : {};
        msState[toolId] = msCreateState('easy', bestTime);
    }
    return msState[toolId];
}

function msCreateState(difficulty, bestTime) {
    var d = MS_DIFFICULTIES[difficulty];
    return {
        grid: [],
        rows: d.rows,
        cols: d.cols,
        mines: d.mines,
        difficulty: difficulty,
        phase: 'idle',
        timer: 0,
        timerInterval: null,
        flagCount: 0,
        revealedCount: 0,
        firstClick: true,
        bestTime: bestTime || {}
    };
}

function msSaveData(toolId) {
    var s = msState[toolId];
    if (!s) return;
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].msData = { bestTime: s.bestTime };
    saveToolCustomizations(customizations);
}

function msNewGame(btn) {
    var toolId = msGetToolId(btn);
    if (!toolId) return;
    msNewGameForToolId(toolId);
}

function msNewGameForToolId(toolId) {
    var s = msState[toolId];
    var bestTime = s ? s.bestTime : {};
    var difficulty = s ? s.difficulty : 'easy';
    if (s && s.timerInterval) clearInterval(s.timerInterval);
    msState[toolId] = msCreateState(difficulty, bestTime);
    msState[toolId].grid = msCreateEmptyGrid(msState[toolId].rows, msState[toolId].cols);
    msRender(toolId);
}

function msCreateEmptyGrid(rows, cols) {
    var grid = [];
    for (var r = 0; r < rows; r++) {
        var row = [];
        for (var c = 0; c < cols; c++) {
            row.push({ mine: false, revealed: false, flagged: false, adjacent: 0 });
        }
        grid.push(row);
    }
    return grid;
}

function msSetDifficulty(select) {
    var toolId = msGetToolId(select);
    if (!toolId) return;
    var s = msState[toolId];
    if (s && s.timerInterval) clearInterval(s.timerInterval);
    var bestTime = s ? s.bestTime : {};
    msState[toolId] = msCreateState(select.value, bestTime);
    msState[toolId].grid = msCreateEmptyGrid(msState[toolId].rows, msState[toolId].cols);
    msRender(toolId);
}

function msGenerateGrid(rows, cols, mines, safeR, safeC) {
    var grid = msCreateEmptyGrid(rows, cols);
    var placed = 0;
    while (placed < mines) {
        var r = Math.floor(Math.random() * rows);
        var c = Math.floor(Math.random() * cols);
        if (grid[r][c].mine) continue;
        if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
        grid[r][c].mine = true;
        placed++;
    }
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            if (grid[r][c].mine) continue;
            var count = 0;
            for (var dr = -1; dr <= 1; dr++) {
                for (var dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    var nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].mine) count++;
                }
            }
            grid[r][c].adjacent = count;
        }
    }
    return grid;
}

function msCellClick(el, row, col) {
    var toolId = msGetToolId(el);
    if (!toolId) return;
    var s = msState[toolId];
    if (!s || s.phase === 'won' || s.phase === 'lost') return;
    var cell = s.grid[row] && s.grid[row][col];
    if (!cell || cell.revealed || cell.flagged) return;

    if (s.firstClick) {
        s.grid = msGenerateGrid(s.rows, s.cols, s.mines, row, col);
        s.firstClick = false;
        s.phase = 'playing';
        msStartTimer(toolId);
    }

    cell = s.grid[row][col];

    if (cell.mine) {
        cell.revealed = true;
        s.phase = 'lost';
        msStopTimer(toolId);
        msRevealAll(toolId);
        msRender(toolId);
        return;
    }

    if (cell.adjacent === 0) {
        msFloodFill(toolId, row, col);
    } else {
        cell.revealed = true;
        s.revealedCount++;
    }

    if (msCheckWin(toolId)) {
        s.phase = 'won';
        msStopTimer(toolId);
        var best = s.bestTime[s.difficulty];
        if (!best || s.timer < best) {
            s.bestTime[s.difficulty] = s.timer;
        }
        msSaveData(toolId);
    }
    msRender(toolId);
}

function msCellRightClick(el, row, col, evt) {
    if (evt) evt.preventDefault();
    var toolId = msGetToolId(el);
    if (!toolId) return;
    var s = msState[toolId];
    if (!s || s.phase === 'won' || s.phase === 'lost') return;
    if (s.phase === 'idle') return;
    var cell = s.grid[row] && s.grid[row][col];
    if (!cell || cell.revealed) return;

    if (cell.flagged) {
        cell.flagged = false;
        s.flagCount--;
    } else {
        cell.flagged = true;
        s.flagCount++;
    }
    msRender(toolId);
}

function msFloodFill(toolId, startR, startC) {
    var s = msState[toolId];
    var queue = [[startR, startC]];
    var visited = {};
    visited[startR + ',' + startC] = true;

    while (queue.length > 0) {
        var pos = queue.shift();
        var r = pos[0], c = pos[1];
        var cell = s.grid[r][c];
        if (cell.revealed || cell.flagged) continue;
        cell.revealed = true;
        s.revealedCount++;

        if (cell.adjacent === 0) {
            for (var dr = -1; dr <= 1; dr++) {
                for (var dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    var nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < s.rows && nc >= 0 && nc < s.cols && !visited[nr + ',' + nc]) {
                        visited[nr + ',' + nc] = true;
                        queue.push([nr, nc]);
                    }
                }
            }
        }
    }
}

function msCheckWin(toolId) {
    var s = msState[toolId];
    return s.revealedCount === (s.rows * s.cols - s.mines);
}

function msRevealAll(toolId) {
    var s = msState[toolId];
    for (var r = 0; r < s.rows; r++) {
        for (var c = 0; c < s.cols; c++) {
            if (s.grid[r][c].mine) {
                s.grid[r][c].revealed = true;
            }
        }
    }
}

function msStartTimer(toolId) {
    var s = msState[toolId];
    if (s.timerInterval) return;
    s.timerInterval = setInterval(function() {
        s.timer++;
        var timerEl = document.querySelector('.tool[data-tool="' + toolId + '"] .ms-timer');
        if (timerEl) timerEl.textContent = msFormatTime(s.timer);
    }, 1000);
}

function msStopTimer(toolId) {
    var s = msState[toolId];
    if (s.timerInterval) {
        clearInterval(s.timerInterval);
        s.timerInterval = null;
    }
}

function msFormatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var sec = seconds % 60;
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
}

function msRender(toolId) {
    var tool = document.querySelector('.tool[data-tool="' + toolId + '"]');
    if (!tool) return;
    var widget = tool.querySelector('.ms-widget');
    if (!widget) return;
    var s = msState[toolId];
    if (!s) return;

    // Update difficulty dropdown
    var diffSelect = widget.querySelector('.ms-difficulty');
    if (diffSelect && diffSelect.value !== s.difficulty) {
        diffSelect.value = s.difficulty;
    }

    // Update mine counter
    var minesEl = widget.querySelector('.ms-mines');
    if (minesEl) minesEl.textContent = '\uD83D\uDCA3 ' + (s.mines - s.flagCount);

    // Update timer
    var timerEl = widget.querySelector('.ms-timer');
    if (timerEl) timerEl.textContent = msFormatTime(s.timer);

    // Build grid
    var gridEl = widget.querySelector('.ms-grid');
    if (gridEl) {
        gridEl.style.gridTemplateColumns = 'repeat(' + s.cols + ', 1fr)';
        var html = '';
        for (var r = 0; r < s.rows; r++) {
            for (var c = 0; c < s.cols; c++) {
                var cell = s.grid[r] && s.grid[r][c];
                if (!cell) {
                    html += '<div class="ms-cell" onclick="msCellClick(this,' + r + ',' + c + ')" oncontextmenu="msCellRightClick(this,' + r + ',' + c + ',event)" onmousedown="if(event.shiftKey&&event.button===0){msCellRightClick(this,' + r + ',' + c + ',event);}"></div>';
                    continue;
                }
                var cls = 'ms-cell';
                var content = '';

                if (cell.revealed) {
                    if (cell.mine) {
                        if (s.phase === 'lost' && !cell.flagged) {
                            cls += ' revealed mine-hit';
                            content = '\uD83D\uDCA3';
                        } else {
                            cls += ' revealed mine-show';
                            content = '\uD83D\uDCA3';
                        }
                    } else {
                        cls += ' revealed';
                        if (cell.adjacent > 0) {
                            cls += ' num-' + cell.adjacent;
                            content = cell.adjacent;
                        }
                    }
                    html += '<div class="' + cls + '">' + content + '</div>';
                } else if (cell.flagged) {
                    cls += ' flagged';
                    html += '<div class="' + cls + '" onclick="msCellClick(this,' + r + ',' + c + ')" oncontextmenu="msCellRightClick(this,' + r + ',' + c + ',event)" onmousedown="if(event.shiftKey&&event.button===0){msCellRightClick(this,' + r + ',' + c + ',event);}">\uD83D\uDEA9</div>';
                } else {
                    html += '<div class="' + cls + '" onclick="msCellClick(this,' + r + ',' + c + ')" oncontextmenu="msCellRightClick(this,' + r + ',' + c + ',event)" onmousedown="if(event.shiftKey&&event.button===0){msCellRightClick(this,' + r + ',' + c + ',event);}"></div>';
                }
            }
        }
        gridEl.innerHTML = html;
    }

    // Overlay
    var overlayEl = widget.querySelector('.ms-overlay');
    if (overlayEl) {
        if (s.phase === 'won') {
            var bestStr = '';
            var best = s.bestTime[s.difficulty];
            if (best) bestStr = '<div class="ms-overlay-best">Best: ' + msFormatTime(best) + '</div>';
            overlayEl.innerHTML = '<div class="ms-overlay-title win">\uD83C\uDF89 You Win!</div>' +
                '<div class="ms-overlay-stats">Time: ' + msFormatTime(s.timer) + '</div>' +
                bestStr +
                '<button class="pomo-btn primary paused" onclick="msNewGame(this)">Play Again</button>';
            overlayEl.style.display = 'flex';
        } else if (s.phase === 'lost') {
            overlayEl.innerHTML = '<div class="ms-overlay-title lose">\uD83D\uDCA5 Game Over</div>' +
                '<div class="ms-overlay-stats">Time: ' + msFormatTime(s.timer) + '</div>' +
                '<button class="pomo-btn primary paused" onclick="msNewGame(this)">Try Again</button>';
            overlayEl.style.display = 'flex';
        } else {
            overlayEl.style.display = 'none';
        }
    }
}

function msInit() {
    document.querySelectorAll('.ms-widget').forEach(function(widget) {
        var tool = widget.closest('.tool');
        if (!tool) return;
        var toolId = tool.getAttribute('data-tool');
        if (!toolId) return;

        var s = msGetState(toolId);
        if (!s.grid || s.grid.length === 0) {
            s.grid = msCreateEmptyGrid(s.rows, s.cols);
        }
        msRender(toolId);
    });
}

// =============================================
// HANGMAN
// =============================================

var hangmanState = {};
var HANGMAN_MAX_WRONG = 6;
var HANGMAN_WORDS = [
    { word: 'JAVASCRIPT', cat: 'Programming' },
    { word: 'PYTHON', cat: 'Programming' },
    { word: 'ALGORITHM', cat: 'Programming' },
    { word: 'FUNCTION', cat: 'Programming' },
    { word: 'VARIABLE', cat: 'Programming' },
    { word: 'ELEPHANT', cat: 'Animals' },
    { word: 'GIRAFFE', cat: 'Animals' },
    { word: 'PENGUIN', cat: 'Animals' },
    { word: 'DOLPHIN', cat: 'Animals' },
    { word: 'OCTOPUS', cat: 'Animals' },
    { word: 'BUTTERFLY', cat: 'Animals' },
    { word: 'GUITAR', cat: 'Music' },
    { word: 'SYMPHONY', cat: 'Music' },
    { word: 'RHYTHM', cat: 'Music' },
    { word: 'HARMONY', cat: 'Music' },
    { word: 'TELESCOPE', cat: 'Science' },
    { word: 'GRAVITY', cat: 'Science' },
    { word: 'MOLECULE', cat: 'Science' },
    { word: 'NUCLEUS', cat: 'Science' },
    { word: 'HYDROGEN', cat: 'Science' },
    { word: 'MOUNTAIN', cat: 'Geography' },
    { word: 'VOLCANO', cat: 'Geography' },
    { word: 'ARCHIPELAGO', cat: 'Geography' },
    { word: 'CONTINENT', cat: 'Geography' },
    { word: 'PYRAMID', cat: 'History' },
    { word: 'PHARAOH', cat: 'History' },
    { word: 'MEDIEVAL', cat: 'History' },
    { word: 'SANDWICH', cat: 'Food' },
    { word: 'BROCCOLI', cat: 'Food' },
    { word: 'PINEAPPLE', cat: 'Food' },
    { word: 'CHOCOLATE', cat: 'Food' },
    { word: 'CINNAMON', cat: 'Food' },
    { word: 'ADVENTURE', cat: 'Words' },
    { word: 'BRILLIANT', cat: 'Words' },
    { word: 'CHALLENGE', cat: 'Words' },
    { word: 'DISCOVER', cat: 'Words' },
    { word: 'ELOQUENT', cat: 'Words' },
    { word: 'FANTASY', cat: 'Words' },
    { word: 'WHIMSICAL', cat: 'Words' },
    { word: 'LABYRINTH', cat: 'Words' },
    { word: 'QUIZZICAL', cat: 'Words' },
    { word: 'XYLOPHONE', cat: 'Music' },
    { word: 'ASTRONAUT', cat: 'Science' },
    { word: 'BLUEPRINT', cat: 'Words' },
    { word: 'KANGAROO', cat: 'Animals' },
    { word: 'CHAMELEON', cat: 'Animals' },
    { word: 'SAXOPHONE', cat: 'Music' },
    { word: 'UMBRELLA', cat: 'Words' }
];

function hangGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function hangGetWidget(el) {
    return el.closest('.hangman-widget');
}

function hangGetState(toolId) {
    if (!hangmanState[toolId]) {
        var customizations = loadToolCustomizations();
        var saved = customizations[toolId] && customizations[toolId].hangmanData;
        if (saved) {
            hangmanState[toolId] = {
                word: '',
                category: '',
                guessed: [],
                wrong: 0,
                won: false,
                lost: false,
                wins: saved.wins || 0,
                losses: saved.losses || 0,
                streak: saved.streak || 0
            };
        } else {
            hangmanState[toolId] = null;
        }
    }
    return hangmanState[toolId];
}

function hangSaveData(toolId) {
    var s = hangmanState[toolId];
    if (!s) return;
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].hangmanData = {
        wins: s.wins,
        losses: s.losses,
        streak: s.streak
    };
    saveToolCustomizations(customizations);
}

function hangNewGame(btn) {
    var toolId = hangGetToolId(btn);
    if (toolId) hangNewGameForToolId(toolId);
}

function hangNewGameForToolId(toolId) {
    var s = hangmanState[toolId];
    var wins = s ? s.wins : 0;
    var losses = s ? s.losses : 0;
    var streak = s ? s.streak : 0;

    var entry = HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];

    hangmanState[toolId] = {
        word: entry.word,
        category: entry.cat,
        guessed: [],
        wrong: 0,
        won: false,
        lost: false,
        wins: wins,
        losses: losses,
        streak: streak
    };
    hangRender(toolId);
}

function hangGuess(btn, letter) {
    var toolId = hangGetToolId(btn);
    if (!toolId) return;
    var s = hangGetState(toolId);
    if (!s || s.won || s.lost) return;
    if (s.guessed.indexOf(letter) >= 0) return;

    s.guessed.push(letter);

    if (s.word.indexOf(letter) < 0) {
        s.wrong++;
        if (s.wrong >= HANGMAN_MAX_WRONG) {
            s.lost = true;
            s.streak = 0;
            s.losses++;
            hangSaveData(toolId);
        }
    } else {
        // Check win
        var allFound = true;
        for (var i = 0; i < s.word.length; i++) {
            if (s.guessed.indexOf(s.word[i]) < 0) { allFound = false; break; }
        }
        if (allFound) {
            s.won = true;
            s.streak++;
            s.wins++;
            hangSaveData(toolId);
        }
    }
    hangRender(toolId);
}

function hangDrawGallows(canvas, wrongCount) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    // Base
    ctx.beginPath(); ctx.moveTo(10, h - 10); ctx.lineTo(w - 10, h - 10); ctx.stroke();
    // Pole
    ctx.beginPath(); ctx.moveTo(30, h - 10); ctx.lineTo(30, 15); ctx.stroke();
    // Top bar
    ctx.beginPath(); ctx.moveTo(30, 15); ctx.lineTo(w - 30, 15); ctx.stroke();
    // Rope
    ctx.beginPath(); ctx.moveTo(w - 30, 15); ctx.lineTo(w - 30, 30); ctx.stroke();

    var cx = w - 30;
    var headR = 12;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // Head
    if (wrongCount >= 1) {
        ctx.beginPath(); ctx.arc(cx, 30 + headR, headR, 0, Math.PI * 2); ctx.stroke();
    }
    // Body
    if (wrongCount >= 2) {
        ctx.beginPath(); ctx.moveTo(cx, 30 + headR * 2); ctx.lineTo(cx, 30 + headR * 2 + 32); ctx.stroke();
    }
    // Left arm
    if (wrongCount >= 3) {
        ctx.beginPath(); ctx.moveTo(cx, 30 + headR * 2 + 8); ctx.lineTo(cx - 18, 30 + headR * 2 + 24); ctx.stroke();
    }
    // Right arm
    if (wrongCount >= 4) {
        ctx.beginPath(); ctx.moveTo(cx, 30 + headR * 2 + 8); ctx.lineTo(cx + 18, 30 + headR * 2 + 24); ctx.stroke();
    }
    // Left leg
    if (wrongCount >= 5) {
        ctx.beginPath(); ctx.moveTo(cx, 30 + headR * 2 + 32); ctx.lineTo(cx - 16, 30 + headR * 2 + 52); ctx.stroke();
    }
    // Right leg
    if (wrongCount >= 6) {
        ctx.beginPath(); ctx.moveTo(cx, 30 + headR * 2 + 32); ctx.lineTo(cx + 16, 30 + headR * 2 + 52); ctx.stroke();
    }
}

function hangResetScore(btn) {
    var toolId = hangGetToolId(btn);
    if (!toolId) return;
    var s = hangGetState(toolId);
    if (s) {
        s.wins = 0;
        s.losses = 0;
        s.streak = 0;
        hangSaveData(toolId);
        hangRender(toolId);
    }
}

function hangRender(toolId) {
    var s = hangmanState[toolId];
    if (!s) return;

    var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
    tools.forEach(function(tool) {
        var widget = tool.querySelector('.hangman-widget');
        if (!widget) return;

        // Draw gallows
        var canvas = widget.querySelector('canvas');
        if (canvas) {
            canvas.width = 100;
            canvas.height = 110;
            hangDrawGallows(canvas, s.wrong);
        }

        // Category
        var catEl = widget.querySelector('.hangman-category');
        if (catEl) catEl.textContent = s.word ? 'Category: ' + s.category : '';

        // Word display
        var wordEl = widget.querySelector('.hangman-word');
        if (wordEl) {
            if (!s.word) {
                wordEl.textContent = '';
            } else {
                var display = '';
                for (var i = 0; i < s.word.length; i++) {
                    var ch = s.word[i];
                    if (s.guessed.indexOf(ch) >= 0 || s.lost) {
                        display += ch;
                    } else {
                        display += '_';
                    }
                }
                wordEl.textContent = display;
            }
        }

        // Status
        var statusEl = widget.querySelector('.hangman-status');
        if (statusEl) {
            if (s.won) {
                statusEl.innerHTML = '<span style="color:#27ae60;">You won!</span>';
            } else if (s.lost) {
                statusEl.innerHTML = '<span style="color:#e74c3c;">Game over!</span>';
            } else if (s.word) {
                statusEl.innerHTML = '<span style="color:var(--text-muted);">' + (HANGMAN_MAX_WRONG - s.wrong) + ' guesses left</span>';
            } else {
                statusEl.textContent = '';
            }
        }

        // Keyboard
        var keysEl = widget.querySelector('.hangman-keys');
        if (keysEl) {
            var html = '';
            var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (var k = 0; k < letters.length; k++) {
                var lt = letters[k];
                var cls = 'hangman-key';
                var disabled = false;
                if (s.guessed.indexOf(lt) >= 0) {
                    if (s.word.indexOf(lt) >= 0) {
                        cls += ' correct';
                    } else {
                        cls += ' wrong';
                    }
                    disabled = true;
                }
                if (s.won || s.lost || !s.word) disabled = true;
                var onclick = disabled ? '' : ' onclick="hangGuess(this,\'' + lt + '\')"';
                var cursor = disabled ? 'cursor:default;' : 'cursor:pointer;';
                html += '<div class="' + cls + '" style="' + cursor + '"' + onclick + '>' + lt + '</div>';
            }
            keysEl.innerHTML = html;
        }

        // Score
        var scoreEl = widget.querySelector('.hangman-score');
        if (scoreEl) {
            scoreEl.innerHTML = '<span style="color:#27ae60;">W: ' + s.wins + '</span>' +
                '<span style="color:#e74c3c;">L: ' + s.losses + '</span>' +
                '<span style="color:var(--text-muted);">Streak: ' + s.streak + '</span>';
        }

        // Overlay
        var overlay = widget.querySelector('.hangman-overlay');
        if (overlay) {
            overlay.style.display = (s.won || s.lost) ? 'flex' : 'none';
            if (s.won || s.lost) {
                var titleEl = overlay.querySelector('.hangman-overlay-title');
                var wordReveal = overlay.querySelector('.hangman-overlay-word');
                var statsEl = overlay.querySelector('.hangman-overlay-stats');
                if (titleEl) {
                    titleEl.textContent = s.won ? 'You Won!' : 'Game Over!';
                    titleEl.style.color = s.won ? '#27ae60' : '#e74c3c';
                }
                if (wordReveal) wordReveal.textContent = s.word;
                if (statsEl) statsEl.textContent = 'W: ' + s.wins + ' \u2022 L: ' + s.losses + ' \u2022 Streak: ' + s.streak;
            }
        }
    });
}

function hangKeyHandler(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    var letter = e.key ? e.key.toUpperCase() : '';
    if (letter.length !== 1 || letter < 'A' || letter > 'Z') return;

    // Find active hangman widget
    var tools = document.querySelectorAll('.tool');
    for (var i = 0; i < tools.length; i++) {
        var w = tools[i].querySelector('.hangman-widget');
        if (!w) continue;
        var toolId = tools[i].getAttribute('data-tool');
        var s = hangmanState[toolId];
        if (s && s.word && !s.won && !s.lost && s.guessed.indexOf(letter) < 0) {
            s.guessed.push(letter);
            if (s.word.indexOf(letter) < 0) {
                s.wrong++;
                if (s.wrong >= HANGMAN_MAX_WRONG) {
                    s.lost = true;
                    s.streak = 0;
                    s.losses++;
                    hangSaveData(toolId);
                }
            } else {
                var allFound = true;
                for (var j = 0; j < s.word.length; j++) {
                    if (s.guessed.indexOf(s.word[j]) < 0) { allFound = false; break; }
                }
                if (allFound) {
                    s.won = true;
                    s.streak++;
                    s.wins++;
                    hangSaveData(toolId);
                }
            }
            hangRender(toolId);
            break;
        }
    }
}

var hangmanKeyListenerAdded = false;

function hangInit() {
    document.querySelectorAll('.hangman-widget').forEach(function(widget) {
        var tool = widget.closest('.tool');
        if (!tool) return;
        var toolId = tool.getAttribute('data-tool');
        if (!toolId) return;

        var s = hangGetState(toolId);
        if (!s) {
            hangmanState[toolId] = {
                word: '',
                category: '',
                guessed: [],
                wrong: 0,
                won: false,
                lost: false,
                wins: 0,
                losses: 0,
                streak: 0
            };
        }

        if (!hangmanKeyListenerAdded) {
            hangmanKeyListenerAdded = true;
            document.addEventListener('keydown', hangKeyHandler);
        }

        hangRender(toolId);
        // Auto-start first game
        var st = hangmanState[toolId];
        if (st && !st.word) {
            hangNewGameForToolId(toolId);
        }
    });
}

// =============================================
// TETRIS
// =============================================

const tetrisInstances = new Map();
const TETRIS_SPEEDS = { slow: 800, normal: 500, fast: 200 };
const TETRIS_COLORS = ['#00f0f0','#f0f000','#a000f0','#00f000','#f00000','#0000f0','#f0a000'];
// Piece matrices: I=0, O=1, T=2, S=3, Z=4, J=5, L=6
const TETRIS_PIECES = [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1],[0,0,0]],
    [[0,1,1],[1,1,0],[0,0,0]],
    [[1,1,0],[0,1,1],[0,0,0]],
    [[1,0,0],[1,1,1],[0,0,0]],
    [[0,0,1],[1,1,1],[0,0,0]]
];
const TETRIS_LINE_SCORES = [0, 100, 300, 500, 800];

function tetrisGetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function tetrisGetBest(toolId) {
    const custom = toolCustomizations[toolId] || {};
    return custom.tetrisBest || 0;
}

function tetrisSaveBest(toolId, score) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].tetrisBest = score;
    saveToolCustomizations(toolCustomizations);
}

function tetrisNewState() {
    const board = [];
    for (let r = 0; r < 20; r++) {
        const row = [];
        for (let c = 0; c < 10; c++) row.push(0);
        board.push(row);
    }
    return {
        phase: 'idle',
        board: board,
        current: null,
        next: Math.floor(Math.random() * 7),
        score: 0,
        lines: 0,
        level: 1,
        speed: 'normal',
        dropInterval: null,
        cols: 10,
        rows: 20
    };
}

function tetrisRotatePiece(matrix) {
    const n = matrix.length;
    const result = [];
    for (let i = 0; i < n; i++) {
        result.push([]);
        for (let j = 0; j < n; j++) {
            result[i].push(matrix[n - 1 - j][i]);
        }
    }
    return result;
}

function tetrisGetRotated(type, rotation) {
    var m = TETRIS_PIECES[type];
    for (var i = 0; i < rotation; i++) {
        m = tetrisRotatePiece(m);
    }
    return m;
}

function tetrisCanPlace(board, type, rotation, px, py) {
    const m = tetrisGetRotated(type, rotation);
    const n = m.length;
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (m[r][c]) {
                const bx = px + c;
                const by = py + r;
                if (bx < 0 || bx >= 10 || by >= 20) return false;
                if (by >= 0 && board[by][bx] !== 0) return false;
            }
        }
    }
    return true;
}

function tetrisSpawnPiece(state) {
    const type = state.next;
    state.next = Math.floor(Math.random() * 7);
    const m = TETRIS_PIECES[type];
    const px = Math.floor((10 - m[0].length) / 2);
    const py = -1;
    if (!tetrisCanPlace(state.board, type, 0, px, py + 1)) {
        return false;
    }
    state.current = { type: type, rotation: 0, x: px, y: py };
    return true;
}

function tetrisPlace(state) {
    const cur = state.current;
    const m = tetrisGetRotated(cur.type, cur.rotation);
    const n = m.length;
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (m[r][c]) {
                const bx = cur.x + c;
                const by = cur.y + r;
                if (by >= 0 && by < 20 && bx >= 0 && bx < 10) {
                    state.board[by][bx] = TETRIS_COLORS[cur.type];
                }
            }
        }
    }
    state.current = null;
}

function tetrisClearLines(state) {
    let cleared = 0;
    for (let r = state.rows - 1; r >= 0; r--) {
        let full = true;
        for (let c = 0; c < state.cols; c++) {
            if (state.board[r][c] === 0) { full = false; break; }
        }
        if (full) {
            state.board.splice(r, 1);
            const newRow = [];
            for (let c = 0; c < state.cols; c++) newRow.push(0);
            state.board.unshift(newRow);
            cleared++;
            r++;
        }
    }
    if (cleared > 0) {
        state.score += TETRIS_LINE_SCORES[cleared] * state.level;
        state.lines += cleared;
        const newLevel = Math.floor(state.lines / 10) + 1;
        if (newLevel !== state.level) {
            state.level = newLevel;
            return true;
        }
    }
    return false;
}

function tetrisInit() {
    document.querySelectorAll('.tetris-widget').forEach(function(widget) {
        const toolId = tetrisGetToolId(widget);
        if (!toolId || tetrisInstances.has(toolId)) return;

        const canvas = widget.querySelector('.tetris-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width || 320;
        canvas.height = rect.height || 480;

        const state = tetrisNewState();
        tetrisInstances.set(toolId, { widget: widget, canvas: canvas, ctx: ctx, state: state });

        tetrisDrawIdle(toolId);

        // Resize
        const ro = new ResizeObserver(function() {
            const r = canvas.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
                canvas.width = r.width;
                canvas.height = r.height;
                const inst = tetrisInstances.get(toolId);
                if (inst) {
                    if (inst.state.phase === 'idle') tetrisDrawIdle(toolId);
                    else if (inst.state.phase === 'playing') tetrisDraw(toolId);
                }
            }
        });
        ro.observe(canvas);

        // Keyboard
        widget.addEventListener('keydown', function(e) {
            const inst = tetrisInstances.get(toolId);
            if (!inst || inst.state.phase !== 'playing') return;
            const key = e.key;
            if (key === 'ArrowLeft' || key === 'a') { tetrisMoveLeft(toolId); e.preventDefault(); }
            else if (key === 'ArrowRight' || key === 'd') { tetrisMoveRight(toolId); e.preventDefault(); }
            else if (key === 'ArrowDown' || key === 's') { tetrisSoftDrop(toolId); e.preventDefault(); }
            else if (key === 'ArrowUp' || key === 'w') { tetrisRotate(toolId); e.preventDefault(); }
            else if (key === ' ') { tetrisHardDrop(toolId); e.preventDefault(); }
        });

        // Touch controls
        let touchStart = null;
        let touchMoved = false;
        canvas.addEventListener('touchstart', function(e) {
            const t = e.touches[0];
            touchStart = { x: t.clientX, y: t.clientY };
            touchMoved = false;
        }, { passive: true });
        canvas.addEventListener('touchmove', function(e) {
            if (!touchStart) return;
            const inst = tetrisInstances.get(toolId);
            if (!inst || inst.state.phase !== 'playing') return;
            const t = e.touches[0];
            const dx = t.clientX - touchStart.x;
            const dy = t.clientY - touchStart.y;
            if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) tetrisMoveRight(toolId);
                else tetrisMoveLeft(toolId);
                touchStart = { x: t.clientX, y: t.clientY };
                touchMoved = true;
            } else if (dy > 30) {
                tetrisSoftDrop(toolId);
                touchStart = { x: t.clientX, y: t.clientY };
                touchMoved = true;
            }
        }, { passive: true });
        canvas.addEventListener('touchend', function(e) {
            if (!touchStart) return;
            const inst = tetrisInstances.get(toolId);
            if (!inst || inst.state.phase !== 'playing') return;
            if (!touchMoved) {
                tetrisRotate(toolId);
            }
            touchStart = null;
        }, { passive: true });

        widget.setAttribute('tabindex', '0');
    });
}

function tetrisSetSpeed(btn, speed) {
    const widget = btn.closest('.tetris-widget');
    const toolId = tetrisGetToolId(widget);
    const inst = tetrisInstances.get(toolId);
    if (!inst) return;
    inst.state.speed = speed;
    widget.querySelectorAll('.tetris-speed-btn').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-speed') === speed);
    });
}

function tetrisStart(btn) {
    const widget = btn.closest('.tetris-widget');
    const toolId = tetrisGetToolId(widget);
    if (!toolId) return;

    const inst = tetrisInstances.get(toolId);
    if (!inst) return;

    const speed = inst.state.speed || 'normal';
    const s = tetrisNewState();
    s.phase = 'playing';
    s.speed = speed;
    tetrisSpawnPiece(s);
    inst.state = s;

    widget.querySelector('.tetris-overlay').classList.add('hidden');
    widget.querySelector('.tetris-hud').classList.remove('hidden');
    tetrisUpdateHud(inst);
    widget.focus();

    tetrisDraw(toolId);
    tetrisStartInterval(toolId);
}

function tetrisStartInterval(toolId) {
    const inst = tetrisInstances.get(toolId);
    if (!inst) return;
    const s = inst.state;
    if (s.dropInterval) clearInterval(s.dropInterval);
    const baseSpeed = TETRIS_SPEEDS[s.speed] || 500;
    const dropTime = Math.max(50, Math.floor(baseSpeed * Math.pow(0.85, s.level - 1)));
    s.dropInterval = setInterval(function() { tetrisTick(toolId); }, dropTime);
}

function tetrisTick(toolId) {
    const inst = tetrisInstances.get(toolId);
    if (!inst || inst.state.phase !== 'playing') return;
    const s = inst.state;
    if (!s.current) return;

    if (tetrisCanPlace(s.board, s.current.type, s.current.rotation, s.current.x, s.current.y + 1)) {
        s.current.y++;
    } else {
        tetrisPlace(s);
        const levelChanged = tetrisClearLines(s);
        if (levelChanged) tetrisStartInterval(toolId);
        if (!tetrisSpawnPiece(s)) {
            tetrisGameOver(toolId);
            return;
        }
        tetrisUpdateHud(inst);
    }
    tetrisDraw(toolId);
}

function tetrisMoveLeft(toolId) {
    const inst = tetrisInstances.get(toolId);
    if (!inst || inst.state.phase !== 'playing' || !inst.state.current) return;
    const cur = inst.state.current;
    if (tetrisCanPlace(inst.state.board, cur.type, cur.rotation, cur.x - 1, cur.y)) {
        cur.x--;
        tetrisDraw(toolId);
    }
}

function tetrisMoveRight(toolId) {
    const inst = tetrisInstances.get(toolId);
    if (!inst || inst.state.phase !== 'playing' || !inst.state.current) return;
    const cur = inst.state.current;
    if (tetrisCanPlace(inst.state.board, cur.type, cur.rotation, cur.x + 1, cur.y)) {
        cur.x++;
        tetrisDraw(toolId);
    }
}

function tetrisSoftDrop(toolId) {
    const inst = tetrisInstances.get(toolId);
    if (!inst || inst.state.phase !== 'playing' || !inst.state.current) return;
    const cur = inst.state.current;
    if (tetrisCanPlace(inst.state.board, cur.type, cur.rotation, cur.x, cur.y + 1)) {
        cur.y++;
        inst.state.score += 1;
        tetrisUpdateHud(inst);
        tetrisDraw(toolId);
    }
}

function tetrisHardDrop(toolId) {
    const inst = tetrisInstances.get(toolId);
    if (!inst || inst.state.phase !== 'playing' || !inst.state.current) return;
    const s = inst.state;
    const cur = s.current;
    let dropped = 0;
    while (tetrisCanPlace(s.board, cur.type, cur.rotation, cur.x, cur.y + 1)) {
        cur.y++;
        dropped++;
    }
    s.score += dropped * 2;
    tetrisPlace(s);
    const levelChanged = tetrisClearLines(s);
    if (levelChanged) tetrisStartInterval(toolId);
    if (!tetrisSpawnPiece(s)) {
        tetrisGameOver(toolId);
        return;
    }
    tetrisUpdateHud(inst);
    tetrisDraw(toolId);
}

function tetrisRotate(toolId) {
    const inst = tetrisInstances.get(toolId);
    if (!inst || inst.state.phase !== 'playing' || !inst.state.current) return;
    const cur = inst.state.current;
    const newRot = (cur.rotation + 1) % 4;
    if (tetrisCanPlace(inst.state.board, cur.type, newRot, cur.x, cur.y)) {
        cur.rotation = newRot;
    } else if (tetrisCanPlace(inst.state.board, cur.type, newRot, cur.x - 1, cur.y)) {
        cur.x--;
        cur.rotation = newRot;
    } else if (tetrisCanPlace(inst.state.board, cur.type, newRot, cur.x + 1, cur.y)) {
        cur.x++;
        cur.rotation = newRot;
    } else if (tetrisCanPlace(inst.state.board, cur.type, newRot, cur.x - 2, cur.y)) {
        cur.x -= 2;
        cur.rotation = newRot;
    } else if (tetrisCanPlace(inst.state.board, cur.type, newRot, cur.x + 2, cur.y)) {
        cur.x += 2;
        cur.rotation = newRot;
    }
    tetrisDraw(toolId);
}

function tetrisGameOver(toolId) {
    const inst = tetrisInstances.get(toolId);
    if (!inst) return;
    const s = inst.state;
    s.phase = 'dead';
    if (s.dropInterval) { clearInterval(s.dropInterval); s.dropInterval = null; }

    const best = Math.max(tetrisGetBest(toolId), s.score);
    tetrisSaveBest(toolId, best);

    const overlay = inst.widget.querySelector('.tetris-overlay');
    overlay.classList.remove('hidden');
    overlay.innerHTML =
        '<div class="tetris-overlay-gameover">Game Over</div>' +
        '<div class="tetris-overlay-score">Score: ' + s.score + '</div>' +
        '<div class="tetris-overlay-best">Best: ' + best + '</div>' +
        '<div class="tetris-speed-row">' +
            '<button class="tetris-speed-btn' + (s.speed === 'slow' ? ' active' : '') + '" data-speed="slow" onclick="tetrisSetSpeed(this,\'slow\')">Slow</button>' +
            '<button class="tetris-speed-btn' + (s.speed === 'normal' ? ' active' : '') + '" data-speed="normal" onclick="tetrisSetSpeed(this,\'normal\')">Normal</button>' +
            '<button class="tetris-speed-btn' + (s.speed === 'fast' ? ' active' : '') + '" data-speed="fast" onclick="tetrisSetSpeed(this,\'fast\')">Fast</button>' +
        '</div>' +
        '<button class="tetris-play-btn" onclick="tetrisStart(this)">Play Again</button>';
    inst.widget.querySelector('.tetris-hud').classList.add('hidden');
}

function tetrisUpdateHud(inst) {
    const hud = inst.widget.querySelector('.tetris-hud');
    const scoreEl = hud.querySelector('.tetris-hud-score');
    const levelEl = hud.querySelector('.tetris-hud-level');
    const linesEl = hud.querySelector('.tetris-hud-lines');
    if (scoreEl) scoreEl.textContent = 'Score: ' + inst.state.score;
    if (levelEl) levelEl.textContent = 'Lvl ' + inst.state.level;
    if (linesEl) linesEl.textContent = 'Lines: ' + inst.state.lines;
}

function tetrisGhostY(state) {
    const cur = state.current;
    if (!cur) return cur.y;
    let gy = cur.y;
    while (tetrisCanPlace(state.board, cur.type, cur.rotation, cur.x, gy + 1)) {
        gy++;
    }
    return gy;
}

function tetrisDraw(toolId) {
    const inst = tetrisInstances.get(toolId);
    if (!inst) return;
    const ctx = inst.ctx;
    const s = inst.state;
    const W = inst.canvas.width;
    const H = inst.canvas.height;

    const cellW = Math.floor(W / s.cols);
    const cellH = Math.floor(H / s.rows);
    const cell = Math.min(cellW, cellH);
    const ox = Math.floor((W - s.cols * cell) / 2);
    const oy = Math.floor((H - s.rows * cell) / 2);

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    // Grid
    for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
            ctx.fillStyle = (c + r) % 2 === 0 ? '#16213e' : '#1a1a2e';
            ctx.fillRect(ox + c * cell, oy + r * cell, cell, cell);
        }
    }

    // Placed blocks
    for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
            if (s.board[r][c] !== 0) {
                tetrisDrawBlock(ctx, ox + c * cell, oy + r * cell, cell, s.board[r][c], 1);
            }
        }
    }

    // Ghost piece
    if (s.current) {
        const gy = tetrisGhostY(s);
        const m = tetrisGetRotated(s.current.type, s.current.rotation);
        const n = m.length;
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (m[r][c]) {
                    const bx = s.current.x + c;
                    const by = gy + r;
                    if (by >= 0 && by < s.rows) {
                        tetrisDrawBlock(ctx, ox + bx * cell, oy + by * cell, cell, TETRIS_COLORS[s.current.type], 0.2);
                    }
                }
            }
        }

        // Current piece
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (m[r][c]) {
                    const bx = s.current.x + c;
                    const by = s.current.y + r;
                    if (by >= 0 && by < s.rows) {
                        tetrisDrawBlock(ctx, ox + bx * cell, oy + by * cell, cell, TETRIS_COLORS[s.current.type], 1);
                    }
                }
            }
        }
    }

    // Border
    ctx.strokeStyle = '#0f3460';
    ctx.lineWidth = 2;
    ctx.strokeRect(ox, oy, s.cols * cell, s.rows * cell);

    // Next piece preview (top right)
    tetrisDrawNext(ctx, s.next, W, ox, oy, cell);
}

function tetrisDrawBlock(ctx, x, y, size, color, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(x + 1, y + 1, size - 2, 3);
    ctx.fillRect(x + 1, y + 1, 3, size - 2);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(x + size - 3, y + 1, 2, size - 2);
    ctx.fillRect(x + 1, y + size - 3, size - 2, 2);
    ctx.globalAlpha = 1;
}

function tetrisDrawNext(ctx, type, W, ox, oy, cell) {
    const m = TETRIS_PIECES[type];
    const n = m.length;
    const previewCell = Math.floor(cell * 0.6);
    const px = ox + 10 * cell + 8;
    const labelY = oy + 4;

    // Only draw if there is room
    if (px + n * previewCell > W - 4) return;

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px Arial';
    ctx.fillText('NEXT', px, labelY + 8);

    const startY = labelY + 14;
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (m[r][c]) {
                tetrisDrawBlock(ctx, px + c * previewCell, startY + r * previewCell, previewCell, TETRIS_COLORS[type], 0.9);
            }
        }
    }
}

function tetrisDrawIdle(toolId) {
    const inst = tetrisInstances.get(toolId);
    if (!inst) return;
    const ctx = inst.ctx;
    const W = inst.canvas.width;
    const H = inst.canvas.height;
    const s = inst.state;

    const cellW = Math.floor(W / s.cols);
    const cellH = Math.floor(H / s.rows);
    const cell = Math.min(cellW, cellH);
    const ox = Math.floor((W - s.cols * cell) / 2);
    const oy = Math.floor((H - s.rows * cell) / 2);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
            ctx.fillStyle = (c + r) % 2 === 0 ? '#16213e' : '#1a1a2e';
            ctx.fillRect(ox + c * cell, oy + r * cell, cell, cell);
        }
    }

    // Decorative blocks at bottom
    const deco = [
        { c: 0, r: 19, t: 5 }, { c: 1, r: 19, t: 5 }, { c: 2, r: 19, t: 3 }, { c: 3, r: 19, t: 3 },
        { c: 4, r: 19, t: 6 }, { c: 5, r: 19, t: 6 }, { c: 6, r: 19, t: 4 }, { c: 7, r: 19, t: 4 },
        { c: 0, r: 18, t: 2 }, { c: 1, r: 18, t: 2 }, { c: 2, r: 18, t: 2 },
        { c: 4, r: 18, t: 0 }, { c: 5, r: 18, t: 0 }, { c: 6, r: 18, t: 0 }, { c: 7, r: 18, t: 0 }
    ];
    for (let i = 0; i < deco.length; i++) {
        const d = deco[i];
        tetrisDrawBlock(ctx, ox + d.c * cell, oy + d.r * cell, cell, TETRIS_COLORS[d.t], 0.5);
    }

    ctx.strokeStyle = '#0f3460';
    ctx.lineWidth = 2;
    ctx.strokeRect(ox, oy, s.cols * cell, s.rows * cell);
}

// =============================================
// EXPORT IIFE
// =============================================

(function injectScriptsForExport() {
    if (document.getElementById('game-tools-scripts')) return;

    var chessFunctions = [chessGetToolId, chessGetState, chessGetData, chessSaveData, chessDeepCopyBoard, chessInit, chessRender, chessDrawBoard, chessUpdateUI, chessResizeCanvas, chessCanvasClick, chessPixelToBoard, chessGetValidMoves, chessGetRawMoves, chessPawnMoves, chessSlidingMoves, chessKnightMoves, chessKingMoves, chessFindKing, chessIsSquareAttacked, chessIsInCheck, chessWouldBeInCheck, chessIsCheckmate, chessIsStalemate, chessHasAnyLegalMove, chessExecuteMove, chessMoveNotation, chessNewGame, chessUndo, chessColToFile, chessRowToRank, chessSetMode, chessEvalBoard, chessAISearch, chessAIGetAllMoves, chessAIMakeMove];
    var sudokuFunctions = [sudokuGetWidget, sudokuGetToolId, sudokuEmptyNotes, sudokuGetState, sudokuSaveData, sudokuShuffleArray, sudokuIsValid, sudokuFillGrid, sudokuGenerateSolution, sudokuCreatePuzzle, sudokuNewGame, sudokuNewGameForToolId, sudokuSetDifficulty, sudokuCheckConflicts, sudokuCheckWin, sudokuNumInputInternal, sudokuClearCellInternal, sudokuCellClick, sudokuNumInput, sudokuClearCell, sudokuHint, sudokuUndo, sudokuTogglePencil, sudokuCheck, sudokuStartTimer, sudokuStopTimer, sudokuFormatTime, sudokuRender, sudokuKeyHandler, sudokuInit];
    var typingTestFunctions = [typingTestGetWidget, typingTestGetToolId, typingTestGetState, typingTestSaveData, typingTestLoadBest, typingTestGenerateWords, typingTestNewGame, typingTestSetDuration, typingTestStartTimer, typingTestStopTimer, typingTestFinish, typingTestCalcWPM, typingTestCalcAccuracy, typingTestHandleInput, typingTestRenderWords, typingTestEscape, typingTestRender, typingTestInit];
    var flappyFunctions = [flappyGetToolId, flappyGetBest, flappySaveBest, flappyNewState, flappyInit, flappyStart, flappyFlap, flappyLoop, flappyUpdate, flappyGameOver, flappyDrawIdle, flappyDraw, flappyDrawBg, flappyDrawGround, flappyDrawPipe, flappyDrawBird];
    var nonogramFunctions = [nonogramGetToolId, nonogramGetWidget, nonogramGetState, nonogramSaveData, nonogramNewGame, nonogramNewGameForToolId, nonogramSetDifficulty, nonogramGeneratePuzzle, nonogramExtractClues, nonogramCellClick, nonogramCheckRowSatisfied, nonogramCheckColSatisfied, nonogramCheckWin, nonogramUndo, nonogramRender, nonogramStartTimer, nonogramStopTimer, nonogramFormatTime, nonogramInit];
    var mempatFunctions = [mempatGetToolId, mempatGetWidget, mempatGetState, mempatSaveData, mempatNewGame, mempatNewGameForToolId, mempatSetGridSize, mempatNextLevel, mempatShowNext, mempatCellClick, mempatRender, mempatInit];
    var snakeFunctions = [snakeGetToolId, snakeGetBest, snakeSaveBest, snakeNewState, snakePlaceFood, snakeInit, snakeSetSpeed, snakeStart, snakeTick, snakeUpdateHud, snakeGameOver, snakeDrawIdle, snakeDraw, snakeDrawBg, snakeDrawSnakeBody];
    var reactionTimeFunctions = [reactionTimeGetWidget, reactionTimeGetToolId, reactionTimeGetState, reactionTimeLoadData, reactionTimeSaveData, reactionTimeCalcAvg, reactionTimeStart, reactionTimeClick, reactionTimeRender, reactionTimeInit];
    var memmatchFunctions = [memmatchGetToolId, memmatchGetWidget, memmatchGetState, memmatchSaveData, memmatchShuffle, memmatchNewGame, memmatchNewGameForToolId, memmatchSetPairs, memmatchCardClick, memmatchStartTimer, memmatchStopTimer, memmatchFormatTime, memmatchGridCols, memmatchRender, memmatchInit];
    var breakoutFunctions = [breakoutGetToolId, breakoutGetBest, breakoutSaveBest, breakoutNewState, breakoutCreateBricks, breakoutInit, breakoutStart, breakoutLaunch, breakoutLoop, breakoutUpdate, breakoutLevelUp, breakoutGameOver, breakoutUpdateHud, breakoutDraw, breakoutDrawIdle, breakoutDrawBricks, breakoutMouseMove];
    var c4Functions = [c4GetToolId, c4GetWidget, c4GetState, c4SaveData, c4NewBoard, c4NewGame, c4SetMode, c4SetDifficulty, c4DropPiece, c4UndropPiece, c4CheckWin, c4IsFull, c4GetValidCols, c4EvalWindow, c4EvalBoard, c4Minimax, c4AIMove, c4PlayCol, c4ShowResult, c4CanvasClick, c4CanvasMove, c4CanvasLeave, c4Render, c4Draw, c4ResizeCanvas, c4Init];
    var tttFunctions = [tttGetToolId, tttGetWidget, tttGetState, tttSaveData, tttNewGame, tttNewGameForToolId, tttSetMode, tttSetDifficulty, tttCheckWinner, tttIsFull, tttCellClick, tttAIMove, tttAIRandom, tttAIMinimax, tttMinimax, tttResetScore, tttRender, tttInit];
    var g2048Functions = [g2048GetToolId, g2048GetWidget, g2048GetState, g2048SaveData, g2048FreshState, g2048NewGame, g2048AddRandom, g2048Move, g2048SlideRow, g2048HasValue, g2048CanMove, g2048Undo, g2048KeepPlaying, g2048HandleKey, g2048KeyHandler, g2048Render, g2048Init];
    var msFunctions = [msGetToolId, msGetWidget, msGetState, msCreateState, msSaveData, msNewGame, msNewGameForToolId, msCreateEmptyGrid, msSetDifficulty, msGenerateGrid, msCellClick, msCellRightClick, msFloodFill, msCheckWin, msRevealAll, msStartTimer, msStopTimer, msFormatTime, msRender, msInit];
    var hangFunctions = [hangGetToolId, hangGetWidget, hangGetState, hangSaveData, hangNewGame, hangNewGameForToolId, hangGuess, hangDrawGallows, hangResetScore, hangRender, hangKeyHandler, hangInit];
    var tetrisFunctions = [tetrisGetToolId, tetrisGetBest, tetrisSaveBest, tetrisNewState, tetrisRotatePiece, tetrisGetRotated, tetrisCanPlace, tetrisSpawnPiece, tetrisPlace, tetrisClearLines, tetrisInit, tetrisSetSpeed, tetrisStart, tetrisStartInterval, tetrisTick, tetrisMoveLeft, tetrisMoveRight, tetrisSoftDrop, tetrisHardDrop, tetrisRotate, tetrisGameOver, tetrisUpdateHud, tetrisGhostY, tetrisDraw, tetrisDrawBlock, tetrisDrawNext, tetrisDrawIdle];
    var allFunctions = chessFunctions.concat(sudokuFunctions).concat(nonogramFunctions).concat(typingTestFunctions).concat(flappyFunctions).concat(mempatFunctions).concat(snakeFunctions).concat(reactionTimeFunctions).concat(memmatchFunctions).concat(breakoutFunctions).concat(c4Functions).concat(tttFunctions).concat(g2048Functions).concat(msFunctions).concat(hangFunctions).concat(tetrisFunctions);

    var code = '(function() {\n' +
        'if (typeof chessInit !== "undefined") return;\n' +
        'window.CHESS_UNICODE = ' + JSON.stringify(CHESS_UNICODE) + ';\n' +
        'window.CHESS_INITIAL_BOARD = ' + JSON.stringify(CHESS_INITIAL_BOARD) + ';\n' +
        'window.CHESS_PIECE_VALUES = ' + JSON.stringify(CHESS_PIECE_VALUES) + ';\n' +
        'window.CHESS_PST = ' + JSON.stringify(CHESS_PST) + ';\n' +
        'window._chessState = new WeakMap();\n' +
        'window.sudokuState = ' + JSON.stringify(sudokuState) + ';\n' +
        'window.sudokuKeyListenerAdded = false;\n' +
        'window.nonogramState = ' + JSON.stringify(nonogramState) + ';\n' +
        'window.nonogramKeyListenerAdded = false;\n' +
        'window.TYPINGTEST_WORDS = ' + JSON.stringify(TYPINGTEST_WORDS) + ';\n' +
        'window.typingTestState = {};\n' +
        'window.memoryPatternState = ' + JSON.stringify(memoryPatternState) + ';\n' +
        'window.MEMORY_COLORS = ' + JSON.stringify(MEMORY_COLORS) + ';\n' +
        'window.flappyInstances = new Map();\n' +
        'window.FB_GRAVITY = ' + FB_GRAVITY + ';\n' +
        'window.FB_FLAP_VEL = ' + FB_FLAP_VEL + ';\n' +
        'window.FB_BIRD_W = ' + FB_BIRD_W + ';\n' +
        'window.FB_BIRD_H = ' + FB_BIRD_H + ';\n' +
        'window.FB_PIPE_W = ' + FB_PIPE_W + ';\n' +
        'window.FB_PIPE_GAP = ' + FB_PIPE_GAP + ';\n' +
        'window.FB_PIPE_SPEED = ' + FB_PIPE_SPEED + ';\n' +
        'window.FB_PIPE_INTERVAL = ' + FB_PIPE_INTERVAL + ';\n' +
        'window.FB_GROUND_H = ' + FB_GROUND_H + ';\n' +
        'window.FB_GROUND_SPEED = ' + FB_GROUND_SPEED + ';\n' +
        'window.snakeInstances = new Map();\n' +
        'window.SNAKE_SPEEDS = ' + JSON.stringify(SNAKE_SPEEDS) + ';\n' +
        'window.SNAKE_CELL = ' + SNAKE_CELL + ';\n' +
        'window.memMatchState = ' + JSON.stringify(memMatchState) + ';\n' +
        'window.MEMMATCH_EMOJIS = ' + JSON.stringify(MEMMATCH_EMOJIS) + ';\n' +
        'window.reactionTimeState = {};\n' +
        'window.breakoutInstances = new Map();\n' +
        'window.BK_PADDLE_H = ' + BK_PADDLE_H + ';\n' +
        'window.BK_PADDLE_W_RATIO = ' + BK_PADDLE_W_RATIO + ';\n' +
        'window.BK_BALL_R = ' + BK_BALL_R + ';\n' +
        'window.BK_BALL_SPEED = ' + BK_BALL_SPEED + ';\n' +
        'window.BK_BRICK_ROWS = ' + BK_BRICK_ROWS + ';\n' +
        'window.BK_BRICK_COLS = ' + BK_BRICK_COLS + ';\n' +
        'window.BK_BRICK_PAD = ' + BK_BRICK_PAD + ';\n' +
        'window.BK_LIVES = ' + BK_LIVES + ';\n' +
        'window.BK_COLORS = ' + JSON.stringify(BK_COLORS) + ';\n' +
        'window.tttState = ' + JSON.stringify(tttState) + ';\n' +
        'window.TTT_WINS = ' + JSON.stringify(TTT_WINS) + ';\n' +
        'window.c4State = {};\n' +
        'window.C4_ROWS = ' + C4_ROWS + ';\n' +
        'window.C4_COLS = ' + C4_COLS + ';\n' +
        'window.C4_EMPTY = ' + C4_EMPTY + ';\n' +
        'window.C4_P1 = ' + C4_P1 + ';\n' +
        'window.C4_P2 = ' + C4_P2 + ';\n' +
        'window.g2048State = {};\n' +
        'window.g2048ActiveToolId = null;\n' +
        'window.g2048KeyListenerAdded = false;\n' +
        'window.msState = {};\n' +
        'window.MS_DIFFICULTIES = ' + JSON.stringify(MS_DIFFICULTIES) + ';\n' +
        'window.hangmanState = ' + JSON.stringify(hangmanState) + ';\n' +
        'window.HANGMAN_MAX_WRONG = ' + HANGMAN_MAX_WRONG + ';\n' +
        'window.HANGMAN_WORDS = ' + JSON.stringify(HANGMAN_WORDS) + ';\n' +
        'window.hangmanKeyListenerAdded = false;\n' +
        'window.tetrisInstances = new Map();\n' +
        'window.TETRIS_SPEEDS = ' + JSON.stringify(TETRIS_SPEEDS) + ';\n' +
        'window.TETRIS_COLORS = ' + JSON.stringify(TETRIS_COLORS) + ';\n' +
        'window.TETRIS_PIECES = ' + JSON.stringify(TETRIS_PIECES) + ';\n' +
        'window.TETRIS_LINE_SCORES = ' + JSON.stringify(TETRIS_LINE_SCORES) + ';\n' +
        allFunctions.map(function(fn) { return 'window.' + fn.name + ' = ' + fn.toString(); }).join(';\n') + ';\n' +
        '})();';
    var encoded = btoa(unescape(encodeURIComponent(code)));

    var script = document.createElement('script');
    script.id = 'game-tools-scripts';
    script.textContent = 'eval(decodeURIComponent(escape(atob("' + encoded + '"))))';
    (document.body || document.head).appendChild(script);
})();

// =============================================
// REGISTRATIONS
// =============================================

PluginRegistry.registerToolbox({
    id: 'game-tools',
    name: 'Game Tools',
    description: 'Classic board games and puzzles',
    icon: '\u265E',
    color: '#8e44ad',
    version: '1.0.0',
    tools: ['2048', 'breakout', 'chess', 'connect-four', 'flappy-bird', 'hangman', 'memory-match', 'memory-pattern', 'minesweeper', 'nonogram', 'reaction-time', 'snake', 'sudoku', 'tetris', 'tic-tac-toe', 'typing-test'],
    source: 'external'
});

PluginRegistry.registerTool({
    id: 'chess',
    name: 'Chess',
    description: 'Chess with AI opponent or two-player mode, legal move validation and check/checkmate detection',
    icon: '\u265A',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['chess', 'game', 'board', 'strategy'],
    title: 'Chess',
    content: '<div class="chess-widget">' +
        '<div class="chess-toolbar">' +
            '<span class="chess-turn">White\'s turn</span>' +
            '<span class="chess-status"></span>' +
            '<select class="chess-mode-select" onchange="chessSetMode(this)">' +
                '<option value="off">2 Player</option>' +
                '<option value="black">vs AI</option>' +
            '</select>' +
            '<button onclick="chessUndo(this)">Undo</button>' +
            '<button onclick="chessNewGame(this)">New Game</button>' +
        '</div>' +
        '<div class="chess-board-area">' +
            '<div class="chess-canvas-wrap">' +
                '<canvas class="chess-canvas"></canvas>' +
            '</div>' +
            '<div class="chess-side-panel">' +
                '<div class="chess-captured">' +
                    '<div class="chess-captured-label">Captured</div>' +
                    '<div class="chess-captured-pieces chess-captured-white"></div>' +
                    '<div class="chess-captured-pieces chess-captured-black"></div>' +
                '</div>' +
                '<div class="chess-history-wrap">' +
                    '<div class="chess-history-label">Moves</div>' +
                    '<div class="chess-history"></div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>',
    contentType: 'html',
    onInit: 'chessInit',
    source: 'external',
    defaultWidth: 520,
    defaultHeight: 480
});

PluginRegistry.registerTool({
    id: 'sudoku',
    name: 'Sudoku',
    description: 'Classic 9x9 Sudoku puzzle with difficulty levels, pencil notes, hints, and timer',
    icon: '\uD83E\uDDE9',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['sudoku', 'puzzle', 'game', 'logic', 'numbers', 'brain'],
    title: 'Sudoku',
    content: '<div class="sudoku-widget" style="position:relative;">' +
        '<div class="sudoku-toolbar">' +
            '<button class="pomo-btn" onclick="sudokuNewGame(this)">New</button>' +
            '<select class="sudoku-difficulty" onchange="sudokuSetDifficulty(this)">' +
                '<option value="easy">Easy</option>' +
                '<option value="medium">Medium</option>' +
                '<option value="hard">Hard</option>' +
            '</select>' +
            '<span style="margin-left:auto;"></span>' +
            '<span class="sudoku-timer">00:00</span>' +
            '<span class="sudoku-mistakes">0 mistakes</span>' +
        '</div>' +
        '<div class="sudoku-grid"></div>' +
        '<div class="sudoku-actions">' +
            '<button class="pomo-btn sudoku-pencil-btn" onclick="sudokuTogglePencil(this)">Notes</button>' +
            '<button class="pomo-btn" onclick="sudokuHint(this)">Hint</button>' +
            '<button class="pomo-btn" onclick="sudokuUndo(this)">Undo</button>' +
            '<button class="pomo-btn" onclick="sudokuCheck(this)">Check</button>' +
            '<button class="pomo-btn" onclick="sudokuClearCell(this)">Erase</button>' +
        '</div>' +
        '<div class="sudoku-numpad">' +
            '<button class="sudoku-numpad-btn" onclick="sudokuNumInput(this,1)">1</button>' +
            '<button class="sudoku-numpad-btn" onclick="sudokuNumInput(this,2)">2</button>' +
            '<button class="sudoku-numpad-btn" onclick="sudokuNumInput(this,3)">3</button>' +
            '<button class="sudoku-numpad-btn" onclick="sudokuNumInput(this,4)">4</button>' +
            '<button class="sudoku-numpad-btn" onclick="sudokuNumInput(this,5)">5</button>' +
            '<button class="sudoku-numpad-btn" onclick="sudokuNumInput(this,6)">6</button>' +
            '<button class="sudoku-numpad-btn" onclick="sudokuNumInput(this,7)">7</button>' +
            '<button class="sudoku-numpad-btn" onclick="sudokuNumInput(this,8)">8</button>' +
            '<button class="sudoku-numpad-btn" onclick="sudokuNumInput(this,9)">9</button>' +
        '</div>' +
        '<div class="sudoku-win-overlay" style="display:none;">' +
            '<div class="sudoku-win-title">\uD83C\uDF89 Puzzle Complete!</div>' +
            '<div class="sudoku-win-stats"></div>' +
            '<button class="pomo-btn primary paused" onclick="sudokuNewGame(this)">New Game</button>' +
        '</div>' +
    '</div>',
    onInit: 'sudokuInit',
    defaultWidth: 340,
    defaultHeight: 520,
    source: 'external'
});

PluginRegistry.registerTool({
    id: 'typing-test',
    name: 'Typing Speed Test',
    description: 'Test your typing speed and accuracy with timed word challenges',
    icon: '\u2328\uFE0F',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['typing', 'speed', 'test', 'wpm', 'game', 'keyboard'],
    title: 'Typing Speed Test',
    content: '<div class="typingtest-widget">' +
        '<div class="typingtest-toolbar">' +
            '<select class="typingtest-duration" onchange="typingTestSetDuration(this)">' +
                '<option value="15">15s</option>' +
                '<option value="30" selected>30s</option>' +
                '<option value="60">60s</option>' +
            '</select>' +
            '<button onclick="typingTestNewGame(this)">Restart</button>' +
            '<div class="typingtest-stat-group">' +
                '<span class="typingtest-stat">WPM: <strong class="typingtest-wpm">0</strong></span>' +
                '<span class="typingtest-stat"><strong class="typingtest-timer">30s</strong></span>' +
                '<span class="typingtest-stat">Acc: <strong class="typingtest-acc">100%</strong></span>' +
            '</div>' +
        '</div>' +
        '<div class="typingtest-words"><div class="typingtest-words-inner"></div></div>' +
        '<div class="typingtest-input-row">' +
            '<input type="text" class="typingtest-input" placeholder="Start typing..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">' +
        '</div>' +
        '<div class="typingtest-results" style="display:none;"></div>' +
    '</div>',
    onInit: 'typingTestInit',
    defaultWidth: 420,
    defaultHeight: 350,
    source: 'external'
});

// Flappy Bird
PluginRegistry.registerTool({
    id: 'flappy-bird',
    name: 'Flappy Bird',
    description: 'Classic flappy bird game - click or press space to flap',
    icon: '\uD83D\uDC26',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['game', 'flappy', 'bird', 'arcade', 'fun', 'play'],
    title: 'Flappy Bird',
    content: '<div class="flappy-widget" tabindex="0">' +
        '<canvas class="flappy-canvas"></canvas>' +
        '<div class="flappy-score-display hidden">0</div>' +
        '<div class="flappy-overlay">' +
            '<div class="flappy-title">Flappy Bird</div>' +
            '<div class="flappy-subtitle">Click or press Space to flap</div>' +
            '<button class="flappy-start-btn" onclick="flappyStart(this)">Play</button>' +
        '</div>' +
    '</div>',
    onInit: 'flappyInit',
    defaultWidth: 320,
    defaultHeight: 480,
    source: 'external'
});


PluginRegistry.registerTool({
    id: 'nonogram',
    name: 'Nonogram',
    description: 'Logic puzzle where you fill cells based on numeric clues to reveal a hidden picture',
    icon: '\u25A6',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['nonogram', 'picross', 'puzzle', 'game', 'logic', 'grid'],
    title: 'Nonogram',
    content: '<div class="nonogram-widget" style="position:relative;">' +
        '<div class="nonogram-toolbar">' +
            '<button class="pomo-btn" onclick="nonogramNewGame(this)">New</button>' +
            '<select class="nonogram-difficulty" onchange="nonogramSetDifficulty(this)">' +
                '<option value="5">5\u00d75</option>' +
                '<option value="10">10\u00d710</option>' +
                '<option value="15">15\u00d715</option>' +
            '</select>' +
            '<span style="margin-left:auto;"></span>' +
            '<span class="nonogram-timer">00:00</span>' +
            '<span class="nonogram-mistakes">0 mistakes</span>' +
        '</div>' +
        '<div class="nonogram-grid-wrap"></div>' +
        '<div class="nonogram-actions">' +
            '<button class="pomo-btn" onclick="nonogramUndo(this)">Undo</button>' +
        '</div>' +
        '<div class="nonogram-win-overlay" style="display:none;">' +
            '<div class="nonogram-win-title">Puzzle Complete!</div>' +
            '<div class="nonogram-win-stats"></div>' +
            '<button class="pomo-btn primary paused" onclick="nonogramNewGame(this)">New Game</button>' +
        '</div>' +
    '</div>',
    onInit: 'nonogramInit',
    defaultWidth: 420,
    defaultHeight: 480,
    source: 'external'
});


PluginRegistry.registerTool({
    id: 'memory-pattern',
    name: 'Memory Pattern',
    description: 'Watch the flashing pattern and repeat it from memory — how many levels can you reach?',
    icon: '\uD83E\uDDE0',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['memory', 'pattern', 'simon', 'game', 'brain', 'sequence'],
    title: 'Memory Pattern',
    content: '<div class="mempat-widget">' +
        '<div class="mempat-toolbar">' +
            '<button class="pomo-btn" onclick="mempatNewGame(this)">New</button>' +
            '<select class="mempat-gridsize" onchange="mempatSetGridSize(this)">' +
                '<option value="3">3\u00d73</option>' +
                '<option value="4">4\u00d74</option>' +
                '<option value="5">5\u00d75</option>' +
            '</select>' +
            '<span class="mempat-level">Level: 0</span>' +
            '<span style="margin-left:auto;"></span>' +
            '<span class="mempat-best">Best: 0</span>' +
        '</div>' +
        '<div class="mempat-status">Press New to start</div>' +
        '<div class="mempat-grid"></div>' +
        '<div class="mempat-gameover" style="display:none;">' +
            '<div class="mempat-gameover-title">Game Over!</div>' +
            '<div class="mempat-gameover-score"></div>' +
            '<button class="pomo-btn primary paused" onclick="mempatNewGame(this)">Play Again</button>' +
        '</div>' +
    '</div>',
    onInit: 'mempatInit',
    defaultWidth: 340,
    defaultHeight: 420,
    source: 'external'
});

// Snake
PluginRegistry.registerTool({
    id: 'snake',
    name: 'Snake',
    description: 'Classic snake game - eat apples to grow, avoid walls and yourself',
    icon: '\uD83D\uDC0D',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['game', 'snake', 'arcade', 'retro', 'fun', 'play'],
    title: 'Snake',
    content: '<div class="snake-widget" tabindex="0">' +
        '<canvas class="snake-canvas"></canvas>' +
        '<div class="snake-hud hidden">' +
            '<span class="snake-hud-score">Score: 0</span>' +
        '</div>' +
        '<div class="snake-overlay">' +
            '<div class="snake-overlay-title">Snake</div>' +
            '<div class="snake-overlay-sub">Arrow keys or WASD to move</div>' +
            '<div class="snake-speed-row">' +
                '<button class="snake-speed-btn" data-speed="slow" onclick="snakeSetSpeed(this,\'slow\')">Slow</button>' +
                '<button class="snake-speed-btn active" data-speed="normal" onclick="snakeSetSpeed(this,\'normal\')">Normal</button>' +
                '<button class="snake-speed-btn" data-speed="fast" onclick="snakeSetSpeed(this,\'fast\')">Fast</button>' +
            '</div>' +
            '<button class="snake-play-btn" onclick="snakeStart(this)">Play</button>' +
        '</div>' +
    '</div>',
    onInit: 'snakeInit',
    defaultWidth: 360,
    defaultHeight: 400,
    source: 'external'
});

// Reaction Time Test
PluginRegistry.registerTool({
    id: 'reaction-time',
    name: 'Reaction Time',
    description: 'Test your reaction time - wait for green, then click as fast as you can',
    icon: '\u26A1',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['reaction', 'time', 'speed', 'reflex', 'test', 'game'],
    title: 'Reaction Time',
    content: '<div class="reactiontime-widget">' +
        '<div class="reactiontime-stats">' +
            '<span>Best: <strong class="reactiontime-best">\u2014</strong></span>' +
            '<span>Avg: <strong class="reactiontime-avg">\u2014</strong></span>' +
            '<span>Tries: <strong class="reactiontime-tries">0</strong></span>' +
        '</div>' +
        '<div class="reactiontime-area rt-idle" onclick="reactionTimeClick(this)">' +
            '<div class="reactiontime-message">Click to Start</div>' +
            '<div class="reactiontime-sub">Test your reaction time</div>' +
        '</div>' +
    '</div>',
    onInit: 'reactionTimeInit',
    defaultWidth: 340,
    defaultHeight: 300,
    source: 'external'
});


PluginRegistry.registerTool({
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Flip cards to find matching pairs \u2014 test your memory with fewest moves and fastest time',
    icon: '\uD83C\uDCCF',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['memory', 'match', 'cards', 'pairs', 'game', 'brain', 'concentration'],
    title: 'Memory Match',
    content: '<div class="memmatch-widget">' +
        '<div class="memmatch-toolbar">' +
            '<button class="pomo-btn" onclick="memmatchNewGame(this)">New</button>' +
            '<select class="memmatch-pairs" onchange="memmatchSetPairs(this)">' +
                '<option value="6">6 pairs</option>' +
                '<option value="8" selected>8 pairs</option>' +
                '<option value="12">12 pairs</option>' +
                '<option value="16">16 pairs</option>' +
            '</select>' +
            '<span class="memmatch-pairs-left">0/8</span>' +
            '<span style="margin-left:auto;"></span>' +
            '<span class="memmatch-timer">00:00</span>' +
            '<span class="memmatch-moves">0 moves</span>' +
        '</div>' +
        '<div class="memmatch-grid"></div>' +
        '<div class="memmatch-win-overlay" style="display:none;">' +
            '<div class="memmatch-win-title">\uD83C\uDF89 All Matched!</div>' +
            '<div class="memmatch-win-stats"></div>' +
            '<div class="memmatch-win-best"></div>' +
            '<button class="pomo-btn primary paused" onclick="memmatchNewGame(this)">Play Again</button>' +
        '</div>' +
    '</div>',
    onInit: 'memmatchInit',
    defaultWidth: 380,
    defaultHeight: 460,
    source: 'external'
});

// Breakout
PluginRegistry.registerTool({
    id: 'breakout',
    name: 'Breakout',
    description: 'Classic brick-breaker arcade game — move the paddle to bounce the ball and smash all the bricks',
    icon: '\uD83E\uDDF1',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['game', 'breakout', 'bricks', 'arcade', 'retro', 'fun', 'play'],
    title: 'Breakout',
    content: '<div class="breakout-widget" tabindex="0">' +
        '<canvas class="breakout-canvas"></canvas>' +
        '<div class="breakout-hud hidden">' +
            '<span class="breakout-hud-score">Score: 0</span>' +
            '<span class="breakout-hud-level">Level 1</span>' +
            '<span class="breakout-hud-lives">\u2665\u2665\u2665</span>' +
        '</div>' +
        '<div class="breakout-overlay">' +
            '<div class="breakout-overlay-title">Breakout</div>' +
            '<div class="breakout-overlay-sub">Move mouse to aim, click to launch</div>' +
            '<button class="breakout-play-btn" onclick="breakoutStart(this)">Play</button>' +
        '</div>' +
    '</div>',
    onInit: 'breakoutInit',
    defaultWidth: 360,
    defaultHeight: 440,
    source: 'external'
});

// Connect Four
PluginRegistry.registerTool({
    id: 'connect-four',
    name: 'Connect Four',
    description: 'Classic Connect Four with AI opponent — drop discs to connect four in a row',
    icon: '\uD83D\uDD34',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['game', 'connect', 'four', 'board', 'strategy', 'ai', 'two-player'],
    title: 'Connect Four',
    content: '<div class="c4-widget">' +
        '<div class="c4-toolbar">' +
            '<select class="c4-mode" onchange="c4SetMode(this)">' +
                '<option value="ai" selected>vs AI</option>' +
                '<option value="2p">2 Player</option>' +
            '</select>' +
            '<select class="c4-difficulty" onchange="c4SetDifficulty(this)">' +
                '<option value="easy">Easy</option>' +
                '<option value="medium" selected>Medium</option>' +
                '<option value="hard">Hard</option>' +
            '</select>' +
            '<button class="pomo-btn" onclick="c4NewGame(this)">New Game</button>' +
            '<span style="flex:1;"></span>' +
            '<span class="c4-status" style="color:#e0e0e0;font-size:12px;">Red\'s turn</span>' +
        '</div>' +
        '<div class="c4-board-wrap">' +
            '<canvas class="c4-canvas"></canvas>' +
        '</div>' +
        '<div class="c4-overlay" style="display:none;">' +
            '<div class="c4-overlay-title"></div>' +
            '<button class="pomo-btn primary paused" onclick="c4NewGame(this)">Play Again</button>' +
        '</div>' +
    '</div>',
    onInit: 'c4Init',
    defaultWidth: 380,
    defaultHeight: 420,
    source: 'external'
});

// Tic Tac Toe
PluginRegistry.registerTool({
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic Tic Tac Toe — play against a friend or AI with easy, medium, and hard difficulty',
    icon: '#',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['game', 'tic-tac-toe', 'noughts', 'crosses', 'strategy', 'two-player'],
    title: 'Tic Tac Toe',
    content: '<div class="ttt-widget">' +
        '<div class="ttt-toolbar">' +
            '<button class="pomo-btn" onclick="tttNewGame(this)">New</button>' +
            '<select class="ttt-mode" onchange="tttSetMode(this)">' +
                '<option value="pvp">2 Player</option>' +
                '<option value="ai">vs AI</option>' +
            '</select>' +
            '<select class="ttt-difficulty" onchange="tttSetDifficulty(this)" style="display:none;">' +
                '<option value="easy">Easy</option>' +
                '<option value="medium">Medium</option>' +
                '<option value="hard">Hard</option>' +
            '</select>' +
            '<span style="flex:1;"></span>' +
            '<button class="pomo-btn" onclick="tttResetScore(this)" title="Reset scores" style="font-size:11px;">Reset</button>' +
        '</div>' +
        '<div class="ttt-status">X\'s turn</div>' +
        '<div class="ttt-grid"></div>' +
        '<div class="ttt-score"></div>' +
    '</div>',
    onInit: 'tttInit',
    defaultWidth: 300,
    defaultHeight: 360,
    source: 'external'
});

// 2048
PluginRegistry.registerTool({
    id: '2048',
    name: '2048',
    description: 'Slide numbered tiles on a grid to combine them and reach 2048',
    icon: '\uD83D\uDD22',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['game', '2048', 'puzzle', 'tiles', 'slide', 'number', 'strategy'],
    title: '2048',
    content: '<div class="g2048-widget">' +
        '<div class="g2048-header">' +
            '<span class="g2048-logo">2048</span>' +
            '<div class="g2048-score-area">' +
                '<div class="g2048-score-box">' +
                    '<div class="g2048-score-label">Score</div>' +
                    '<div class="g2048-score-value">0</div>' +
                '</div>' +
                '<div class="g2048-score-box">' +
                    '<div class="g2048-score-label">Best</div>' +
                    '<div class="g2048-best-value g2048-score-value">0</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="g2048-toolbar">' +
            '<button onclick="g2048NewGame(this)">New Game</button>' +
            '<button onclick="g2048Undo(this)">Undo</button>' +
        '</div>' +
        '<div class="g2048-board-wrap">' +
            '<div class="g2048-board"></div>' +
        '</div>' +
        '<div class="g2048-overlay hidden"></div>' +
    '</div>',
    onInit: 'g2048Init',
    defaultWidth: 340,
    defaultHeight: 420,
    source: 'external'
});

// Minesweeper
PluginRegistry.registerTool({
    id: 'minesweeper',
    name: 'Minesweeper',
    description: 'Classic mine-clearing puzzle — reveal cells, flag mines, clear the board',
    icon: '\uD83D\uDCA3',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['minesweeper', 'mines', 'puzzle', 'game', 'logic', 'grid', 'classic'],
    title: 'Minesweeper',
    content: '<div class="ms-widget" style="position:relative;">' +
        '<div class="ms-toolbar">' +
            '<button class="pomo-btn" onclick="msNewGame(this)">New</button>' +
            '<select class="ms-difficulty" onchange="msSetDifficulty(this)">' +
                '<option value="easy" selected>Easy</option>' +
                '<option value="medium">Medium</option>' +
                '<option value="hard">Hard</option>' +
            '</select>' +
            '<div class="ms-info">' +
                '<span class="ms-mines">\uD83D\uDCA3 10</span>' +
                '<span class="ms-timer">00:00</span>' +
            '</div>' +
        '</div>' +
        '<div class="ms-grid" oncontextmenu="event.preventDefault()"></div>' +
        '<div class="ms-overlay" style="display:none;"></div>' +
    '</div>',
    onInit: 'msInit',
    defaultWidth: 320,
    defaultHeight: 400,
    source: 'external'
});

// Hangman
PluginRegistry.registerTool({
    id: 'hangman',
    name: 'Hangman',
    description: 'Classic word guessing game — guess the hidden word letter by letter before the hangman is drawn',
    icon: '\uD83D\uDD24',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['game', 'hangman', 'word', 'guess', 'puzzle', 'vocabulary'],
    title: 'Hangman',
    content: '<div class="hangman-widget" style="position:relative;">' +
        '<div class="hangman-toolbar">' +
            '<button class="pomo-btn" onclick="hangNewGame(this)">New</button>' +
            '<span style="flex:1;"></span>' +
            '<span class="hangman-score" style="font-size:12px;display:flex;gap:8px;"></span>' +
            '<button class="pomo-btn" onclick="hangResetScore(this)" title="Reset scores" style="font-size:11px;">Reset</button>' +
        '</div>' +
        '<div class="hangman-top">' +
            '<div class="hangman-canvas-wrap"><canvas width="100" height="110"></canvas></div>' +
            '<div class="hangman-right">' +
                '<div class="hangman-category"></div>' +
                '<div class="hangman-word"></div>' +
                '<div class="hangman-status"></div>' +
            '</div>' +
        '</div>' +
        '<div class="hangman-keys"></div>' +
        '<div class="hangman-overlay" style="display:none;">' +
            '<div class="hangman-overlay-title"></div>' +
            '<div class="hangman-overlay-word"></div>' +
            '<div class="hangman-overlay-stats"></div>' +
            '<button class="pomo-btn primary paused" onclick="hangNewGame(this)">Play Again</button>' +
        '</div>' +
    '</div>',
    onInit: 'hangInit',
    defaultWidth: 340,
    defaultHeight: 340,
    source: 'external'
});

PluginRegistry.registerTool({
    id: 'tetris',
    name: 'Tetris',
    description: 'Classic falling blocks puzzle — arrange tetrominoes to clear lines',
    icon: '\uD83E\uDDF1',
    version: '1.0.0',
    toolbox: 'game-tools',
    tags: ['tetris', 'blocks', 'puzzle', 'game', 'arcade', 'classic'],
    title: 'Tetris',
    content: '<div class="tetris-widget" tabindex="0">' +
        '<canvas class="tetris-canvas"></canvas>' +
        '<div class="tetris-hud hidden">' +
            '<span class="tetris-hud-score">Score: 0</span>' +
            '<span class="tetris-hud-level">Lvl 1</span>' +
            '<span class="tetris-hud-lines">Lines: 0</span>' +
        '</div>' +
        '<div class="tetris-overlay">' +
            '<div class="tetris-overlay-title">Tetris</div>' +
            '<div class="tetris-overlay-sub">Arrow keys or WASD \u00B7 Space to drop</div>' +
            '<div class="tetris-speed-row">' +
                '<button class="tetris-speed-btn" data-speed="slow" onclick="tetrisSetSpeed(this,\'slow\')">Slow</button>' +
                '<button class="tetris-speed-btn active" data-speed="normal" onclick="tetrisSetSpeed(this,\'normal\')">Normal</button>' +
                '<button class="tetris-speed-btn" data-speed="fast" onclick="tetrisSetSpeed(this,\'fast\')">Fast</button>' +
            '</div>' +
            '<button class="tetris-play-btn" onclick="tetrisStart(this)">Play</button>' +
        '</div>' +
    '</div>',
    onInit: 'tetrisInit',
    defaultWidth: 320,
    defaultHeight: 480,
    source: 'external'
});

console.log('Game Tools plugin loaded (16 tools)');
