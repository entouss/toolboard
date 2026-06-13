// Educational Tools Toolbox Plugin
// Contains the Analog Clock Reader and Money Counter

// Inject CSS styles for educational tools
(function() {
    if (document.getElementById('educational-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'educational-tools-styles';
    style.textContent = `
/* Analog Clock Widget Styles */
.clock-widget { background: var(--bg-tertiary); padding: 15px; border-radius: 6px; text-align: center; }
.clock-face-container { width: 200px; height: 200px; margin: 0 auto 8px; }
.clock-svg { width: 100%; height: 100%; display: block; }
.clock-face { fill: var(--bg-primary); stroke: var(--text-muted); stroke-width: 2; }
.clock-number { font-size: 14px; font-weight: 600; fill: var(--text-primary); font-family: system-ui, -apple-system, sans-serif; }
.clock-hand-hr { stroke: var(--text-primary); stroke-width: 4.5; stroke-linecap: round; }
.clock-hand-min { stroke: var(--text-secondary); stroke-width: 2.5; stroke-linecap: round; }
.clock-hand-grab { stroke: transparent; stroke-width: 22; stroke-linecap: round; cursor: grab; pointer-events: stroke; }
.clock-hand-grab:active { cursor: grabbing; }
.clock-center-dot { fill: var(--text-primary); }
.clock-digital { font-size: 28px; font-weight: 700; font-family: monospace; color: var(--text-primary); margin-bottom: 8px; line-height: 1.2; }
.clock-controls { display: flex; justify-content: center; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }
.clock-section-title { font-size: 11px; font-weight: 600; color: var(--text-muted); margin: 8px 0 6px; letter-spacing: 1px; }
.clock-target { font-size: 14px; font-weight: 600; color: var(--text-primary); padding: 8px; background: var(--bg-secondary); border-radius: 4px; margin-bottom: 8px; }
.clock-feedback { font-size: 13px; font-weight: 600; margin-top: 6px; min-height: 18px; }
.clock-score { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.clock-answer-input { padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 16px; font-family: monospace; width: 80px; text-align: center; background: var(--input-bg); color: var(--text-primary); margin-bottom: 6px; }
.clock-mode-select { padding: 5px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); cursor: pointer; }

/* Money Counter Widget Styles */
.money-widget { display: flex; flex-direction: column; text-align: center; padding: 10px; }
.money-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.money-mode-btn.active { background: #3498db; color: white; border-color: #3498db; }
.money-tray { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; padding: 10px; background: var(--bg-tertiary); border-radius: 6px; margin-bottom: 8px; }
.money-coin { border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; user-select: none; box-shadow: 0 2px 4px rgba(0,0,0,0.15); transition: transform 0.15s; }
.money-coin:hover { transform: scale(1.1); }
.money-coin-penny { width: 36px; height: 36px; font-size: 11px; background: linear-gradient(135deg, #d4a574, #b87333); border: 2px solid #8b4513; color: #4a2800; }
.money-coin-nickel { width: 42px; height: 42px; font-size: 12px; background: linear-gradient(135deg, #e8e8e8, #c0c0c0); border: 2px solid #909090; color: #333; }
.money-coin-dime { width: 32px; height: 32px; font-size: 10px; background: linear-gradient(135deg, #f5f5f5, #e0e0e0); border: 2px solid #a0a0a0; color: #333; }
.money-coin-quarter { width: 48px; height: 48px; font-size: 13px; background: linear-gradient(135deg, #e0e0e0, #d0d0d0); border: 2px solid #909090; color: #333; }
.money-bill { border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.15); transition: transform 0.15s; }
.money-bill:hover { transform: scale(1.05); }
.money-bill-1 { width: 72px; height: 34px; font-size: 13px; background: linear-gradient(135deg, #e8f5e9, #a5d6a7); border: 2px solid #81c784; color: #2e7d32; }
.money-bill-5 { width: 76px; height: 36px; font-size: 13px; background: linear-gradient(135deg, #e1f5fe, #81d4fa); border: 2px solid #4fc3f7; color: #0277bd; }
.money-bill-10 { width: 80px; height: 38px; font-size: 13px; background: linear-gradient(135deg, #fff3e0, #ffcc80); border: 2px solid #ffb74d; color: #e65100; }
.money-bill-20 { width: 84px; height: 40px; font-size: 13px; background: linear-gradient(135deg, #f3e5f5, #ce93d8); border: 2px solid #ba68c8; color: #6a1b9a; }
.money-mat { min-height: 120px; background: var(--bg-tertiary); border: 2px dashed var(--border-color); border-radius: 8px; padding: 8px; margin-bottom: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.money-mat.drag-over { border-color: #3498db; background: rgba(52,152,219,0.05); }
.money-mat-items { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
.money-mat-item { cursor: pointer; transition: opacity 0.15s; }
.money-mat-item:hover { opacity: 0.6; }
.money-mat-empty { color: var(--text-muted); font-size: 12px; padding: 20px; }
.money-total { font-size: 24px; font-weight: 700; font-family: monospace; color: #27ae60; margin: 8px 0; }
.money-challenge { margin-bottom: 8px; }
.money-target { background: #3498db; color: white; padding: 8px; border-radius: 6px; font-size: 16px; font-weight: 600; }
.money-feedback { font-size: 13px; font-weight: 600; min-height: 20px; margin-top: 4px; }
.money-score { font-size: 12px; color: var(--text-muted); }
.money-input-row { display: flex; gap: 6px; align-items: center; justify-content: center; margin-bottom: 6px; }
.money-answer-input { padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 16px; font-family: monospace; width: 100px; text-align: center; background: var(--input-bg); color: var(--text-primary); }
.money-answer-input:focus { outline: none; border-color: #3498db; }
.money-mat-item.readonly { cursor: default; opacity: 1; }
.money-mat-item.readonly:hover { opacity: 1; }
.money-mode-buttons { display: flex; flex-wrap: wrap; gap: 4px; }

/* Periodic Table Widget Styles */
.tool-content:has(.ptable-widget) { display: flex; flex-direction: column; overflow: hidden; }
.ptable-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; padding: 6px; gap: 6px; font-family: system-ui, -apple-system, sans-serif; }
.ptable-toolbar { display: flex; align-items: center; gap: 6px; flex-shrink: 0; flex-wrap: wrap; }
.ptable-search { padding: 4px 8px; font-size: 12px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); width: 140px; outline: none; }
.ptable-search:focus { border-color: #3498db; }
.ptable-filter { padding: 4px 6px; font-size: 11px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); cursor: pointer; }
.ptable-temp-toggle { padding: 3px 8px; font-size: 11px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; }
.ptable-temp-toggle:hover { background: var(--bg-tertiary); }
.ptable-grid-wrap { flex: 1; overflow: auto; min-height: 0; }
.ptable-grid { display: grid; grid-template-columns: repeat(18, 1fr); gap: 1px; min-width: 540px; }
.ptable-cell { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 3px; cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; position: relative; overflow: hidden; min-width: 0; padding: 1px; border: 1px solid transparent; }
.ptable-cell:hover { transform: scale(1.15); box-shadow: 0 2px 8px rgba(0,0,0,0.25); z-index: 2; border-color: var(--text-primary); }
.ptable-cell.selected { transform: scale(1.1); border: 2px solid var(--text-primary); z-index: 3; }
.ptable-cell.dimmed { opacity: 0.2; }
.ptable-cell-num { font-size: 7px; line-height: 1; color: rgba(0,0,0,0.6); }
.ptable-cell-sym { font-size: 12px; font-weight: 700; line-height: 1.1; color: rgba(0,0,0,0.85); }
.ptable-cell-name { font-size: 5px; line-height: 1; color: rgba(0,0,0,0.5); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.ptable-cell-mass { font-size: 5px; line-height: 1; color: rgba(0,0,0,0.45); }
.ptable-spacer { visibility: hidden; }
.ptable-lanthanide-label, .ptable-actinide-label { font-size: 8px; color: var(--text-muted); display: flex; align-items: center; justify-content: center; grid-column: span 2; white-space: nowrap; }
.ptable-detail { flex-shrink: 0; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px 12px; display: flex; gap: 12px; align-items: center; min-height: 60px; }
.ptable-detail-sym { font-size: 36px; font-weight: 900; line-height: 1; min-width: 60px; text-align: center; border-radius: 6px; padding: 6px 8px; }
.ptable-detail-info { flex: 1; min-width: 0; }
.ptable-detail-name { font-size: 16px; font-weight: 700; color: var(--text-primary); }
.ptable-detail-row { font-size: 11px; color: var(--text-secondary); line-height: 1.5; }
.ptable-detail-row strong { color: var(--text-primary); }
.ptable-detail-placeholder { font-size: 12px; color: var(--text-muted); text-align: center; width: 100%; }
.ptable-legend { display: flex; flex-wrap: wrap; gap: 4px; flex-shrink: 0; }
.ptable-legend-item { display: flex; align-items: center; gap: 3px; font-size: 9px; color: var(--text-secondary); }
.ptable-legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
.ptable-sep-row { grid-column: 1 / -1; height: 4px; }

/* Speed/Distance/Time Calculator Styles */
.sdt-widget { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.sdt-formula { text-align: center; font-size: 12px; color: var(--text-muted); background: var(--bg-tertiary); padding: 8px; border-radius: 6px; font-family: monospace; line-height: 1.6; }
.sdt-formula strong { color: var(--text-primary); }
.sdt-fields { display: grid; grid-template-columns: 70px 1fr 90px; gap: 8px 8px; align-items: center; }
.sdt-field { display: contents; }
.sdt-field-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.sdt-field-input { padding: 7px 10px; border: 2px solid var(--border-color); border-radius: 6px; font-size: 15px; font-family: monospace; background: var(--input-bg); color: var(--text-primary); outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
.sdt-field-input:focus { border-color: #3498db; }
.sdt-field-input.sdt-result { border-color: #27ae60; background: rgba(39,174,96,0.08); font-weight: 700; }
.sdt-field-unit { padding: 5px 6px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); cursor: pointer; width: 100%; box-sizing: border-box; }
.sdt-actions { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
.sdt-solve-btn { flex: 1; }
.sdt-solve-btn.active { background: #3498db; color: white; border-color: #3498db; }
.sdt-result-box { text-align: center; padding: 10px; background: var(--bg-tertiary); border-radius: 6px; min-height: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.sdt-result-value { font-size: 22px; font-weight: 700; font-family: monospace; color: #27ae60; }
.sdt-result-detail { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.sdt-error { color: #e74c3c; font-size: 13px; font-weight: 600; }

/* Category colors */
.ptable-cat-alkali { background: #ff6b6b; }
.ptable-cat-alkaline { background: #ffa94d; }
.ptable-cat-transition { background: #ffd43b; }
.ptable-cat-post-transition { background: #69db7c; }
.ptable-cat-metalloid { background: #38d9a9; }
.ptable-cat-nonmetal { background: #4dabf7; }
.ptable-cat-halogen { background: #748ffc; }
.ptable-cat-noble { background: #da77f2; }
.ptable-cat-lanthanide { background: #f783ac; }
.ptable-cat-actinide { background: #e599f7; }
.ptable-cat-unknown { background: #adb5bd; }

/* Multiplication Table Widget Styles */
.tool-content:has(.mult-widget) { display: flex; flex-direction: column; overflow: hidden; }
.mult-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; font-family: system-ui, -apple-system, sans-serif; }
.mult-tabs { display: flex; gap: 0; border-bottom: 2px solid var(--border-color); flex-shrink: 0; }
.mult-tab { padding: 7px 14px; border: none; background: none; color: var(--text-secondary); cursor: pointer; font-size: 12px; font-weight: 600; border-bottom: 3px solid transparent; margin-bottom: -2px; transition: color 0.15s; }
.mult-tab:hover { color: var(--text-primary); }
.mult-tab.active { color: #e67e22; border-bottom-color: #e67e22; }
.mult-grid-panel { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.mult-toolbar { display: flex; align-items: center; gap: 6px; padding: 6px 8px; flex-shrink: 0; flex-wrap: wrap; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
.mult-toolbar label { font-size: 11px; color: var(--text-muted); }
.mult-size-select { padding: 3px 6px; font-size: 11px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg); color: var(--text-primary); cursor: pointer; }
.mult-half-btn { padding: 3px 8px; font-size: 11px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; }
.mult-half-btn.active { background: #3498db; color: white; border-color: #3498db; }
.mult-hard-btn { padding: 3px 8px; font-size: 11px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; }
.mult-hard-btn.active { background: #e67e22; color: white; border-color: #e67e22; }
.mult-table-wrap { flex: 1; overflow: auto; min-height: 0; padding: 4px; }
.mult-table { border-collapse: collapse; table-layout: fixed; }
.mult-table td, .mult-table th { width: 36px; height: 36px; min-width: 28px; text-align: center; vertical-align: middle; font-size: 12px; border: 1px solid var(--border-light); box-sizing: border-box; }
.mult-table th { position: sticky; background: var(--bg-tertiary); font-weight: 700; color: var(--text-secondary); z-index: 1; }
.mult-table th.mult-row-header { left: 0; z-index: 2; }
.mult-table thead th { top: 0; }
.mult-table thead th:first-child { left: 0; z-index: 3; }
.mult-cell { cursor: default; }
.mult-cell.mult-hard { background: rgba(255, 140, 0, 0.22); border-color: rgba(255, 140, 0, 0.45) !important; font-weight: 600; }
.mult-cell.mult-diagonal { background: rgba(52, 152, 219, 0.12); font-weight: 700; }
.mult-cell.mult-hard.mult-diagonal { background: rgba(255, 140, 0, 0.30); }
.mult-cell.mult-hidden { visibility: hidden; }
.mult-table tr:hover { background: inherit; }
.mult-cell:not(.mult-hidden):hover { background: rgba(52, 152, 219, 0.28) !important; }
.mult-table th.mult-col-highlight { background: rgba(52, 152, 219, 0.28) !important; color: var(--text-primary); }
.mult-table th.mult-row-highlight { background: rgba(52, 152, 219, 0.28) !important; color: var(--text-primary); }
.mult-challenge-panel { display: none; flex-direction: column; flex: 1; min-height: 0; padding: 10px; gap: 8px; overflow-y: auto; }
.mult-challenge-panel.active { display: flex; }
.mult-digit-label { font-size: 11px; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 4px; }
.mult-digit-row { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 4px; }
.mult-digit-btn { width: 30px; height: 30px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-secondary); color: var(--text-primary); font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.1s; }
.mult-digit-btn.active { background: #27ae60; color: white; border-color: #27ae60; }
.mult-quiz-area { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
.mult-question { font-size: 48px; font-weight: 700; font-family: monospace; color: var(--text-primary); text-align: center; line-height: 1.1; min-height: 60px; }
.mult-answer-row { display: flex; gap: 8px; align-items: center; }
.mult-answer-input { padding: 8px 12px; border: 2px solid var(--border-color); border-radius: 6px; font-size: 24px; font-family: monospace; width: 100px; text-align: center; background: var(--input-bg); color: var(--text-primary); outline: none; transition: border-color 0.2s; }
.mult-answer-input:focus { border-color: #3498db; }
.mult-feedback { font-size: 16px; font-weight: 700; min-height: 24px; text-align: center; }
.mult-feedback.correct { color: #27ae60; }
.mult-feedback.wrong { color: #e74c3c; }
.mult-score { font-size: 12px; color: var(--text-muted); text-align: center; }

/* Number Line Explorer */
.nl-widget { display:flex; flex-direction:column; gap:8px; padding:10px; font-family:system-ui,-apple-system,sans-serif; }
.nl-tabs { display:flex; gap:4px; flex-wrap:wrap; }
.nl-tab { padding:5px 10px; font-size:12px; border:1px solid var(--border-color); border-radius:4px; background:var(--bg-secondary); color:var(--text-primary); cursor:pointer; }
.nl-tab.active { background:#3498db; color:#fff; border-color:#3498db; }
.nl-panel { display:none; flex-direction:column; gap:8px; }
.nl-panel.active { display:flex; }
.nl-controls-row { display:flex; flex-wrap:wrap; gap:6px; align-items:center; font-size:12px; color:var(--text-secondary); }
.nl-controls-row label { font-weight:600; }
.nl-svg-container { width:100%; overflow:hidden; cursor:pointer; }
.nl-svg { width:100%; display:block; }
.nl-fraction-label { text-align:center; font-size:26px; font-weight:700; color:var(--text-primary); min-height:34px; letter-spacing:1px; }
.nl-feedback { text-align:center; font-size:13px; font-weight:600; min-height:18px; }
.nl-feedback.correct { color:#27ae60; }
.nl-feedback.wrong { color:#e74c3c; }
.nl-score { text-align:center; font-size:12px; color:var(--text-muted); }
.nl-frog-status { text-align:center; font-size:16px; font-weight:600; color:var(--text-primary); min-height:24px; }
.nl-zoom-question { text-align:center; font-size:14px; color:var(--text-primary); font-weight:600; min-height:20px; }
.nl-denom-select, .nl-roundto-select { padding:4px 6px; font-size:13px; border:1px solid var(--border-color); border-radius:4px; background:var(--input-bg); color:var(--text-primary); }
.nl-number-input, .nl-jump-input { padding:4px 8px; font-size:13px; border:1px solid var(--border-color); border-radius:4px; width:72px; background:var(--input-bg); color:var(--text-primary); }
.nl-jump-sign { padding:4px 8px; font-size:13px; border:1px solid var(--border-color); border-radius:4px; background:var(--input-bg); color:var(--text-primary); }
.nl-jumps-list { display:flex; flex-wrap:wrap; gap:4px; min-height:20px; }
.nl-jump-chip { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:12px; font-size:12px; font-weight:600; background:#3498db22; color:#3498db; border:1px solid #3498db44; }

/* Angle Explorer */
.ang-widget { display:flex; flex-direction:column; align-items:center; gap:10px; padding:12px; }
.ang-top-row { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; flex-wrap:wrap; }
.ang-face-container { flex:1 1 240px; max-width:280px; min-width:0; }
.ang-svg { width:100%; display:block; }
.ang-face { fill:var(--bg-primary); stroke:var(--border-color); stroke-width:2; }
.ang-tick-label { font-size:10px; fill:var(--text-muted); font-family:system-ui,-apple-system,sans-serif; paint-order:stroke; stroke:var(--bg-primary); stroke-width:3px; stroke-linejoin:round; }
.ang-ray-fixed { stroke:var(--text-muted); stroke-width:3; stroke-linecap:round; }
.ang-ray-movable { stroke:var(--text-primary); stroke-width:3; stroke-linecap:round; }
.ang-ray-grab { stroke:transparent; stroke-width:24; cursor:grab; }
.ang-ray-grab:active { cursor:grabbing; }
.ang-vertex { fill:var(--text-primary); }
.ang-arc { fill-opacity:0.35; stroke-width:1; }
.ang-arc-acute { fill:#27ae60; stroke:#27ae60; }
.ang-arc-right { fill:#3498db; stroke:#3498db; }
.ang-arc-obtuse { fill:#e67e22; stroke:#e67e22; }
.ang-arc-straight { fill:#e74c3c; stroke:#e74c3c; }
.ang-arc-reflex { fill:#9b59b6; stroke:#9b59b6; }
.ang-arc-zero { fill:#95a5a6; stroke:#95a5a6; }
.ang-right-marker { fill:none; stroke:var(--text-primary); stroke-width:1.5; }
.ang-dial-handle { fill:var(--bg-secondary); stroke:var(--text-muted); stroke-width:2; pointer-events:none; }
.ang-dial-handle-grab { fill:transparent; cursor:grab; }
.ang-dial-handle-grab:active { cursor:grabbing; }
.ang-readout { font-size:28px; font-weight:700; font-family:monospace; color:var(--text-primary); }
.ang-type-label { font-size:18px; font-weight:700; padding:6px 18px; border-radius:14px; background:var(--bg-secondary); color:var(--text-primary); border:2px solid transparent; letter-spacing:0.5px; transition:background-color 0.15s, color 0.15s, border-color 0.15s; }
.ang-type-acute { background:#27ae6022; color:#27ae60; border-color:#27ae6055; }
.ang-type-right { background:#3498db22; color:#3498db; border-color:#3498db55; }
.ang-type-obtuse { background:#e67e2222; color:#e67e22; border-color:#e67e2255; }
.ang-type-straight { background:#e74c3c22; color:#e74c3c; border-color:#e74c3c55; }
.ang-type-reflex { background:#9b59b622; color:#9b59b6; border-color:#9b59b655; }
.ang-type-zero { background:#95a5a622; color:#95a5a6; border-color:#95a5a655; }
.ang-controls { display:flex; align-items:center; justify-content:center; gap:6px; font-size:12px; color:var(--text-secondary); flex-wrap:wrap; }
.ang-snap-checkbox, .ang-big-checkbox { cursor:pointer; }
.ang-turn-btn, .ang-reset-btn { padding:3px 8px; font-size:11px; border:1px solid var(--border-color); border-radius:4px; background:var(--bg-secondary); color:var(--text-primary); cursor:pointer; }
.ang-turn-btn:hover:not(:disabled), .ang-reset-btn:hover { background:var(--bg-tertiary); }
.ang-turn-btn:disabled { opacity:0.5; cursor:not-allowed; }
.ang-skater-container { flex:0 0 auto; display:flex; flex-direction:column; align-items:center; gap:2px; width:64px; }
.ang-skater-svg { width:100%; display:block; }
.ang-skater-board { fill:#e67e22; }
.ang-skater-wheel { fill:#2c3e50; }
.ang-skater-truck { fill:#95a5a6; }
.ang-skater-head { fill:#f1c27d; }
.ang-skater-body { stroke:#3498db; stroke-width:5; stroke-linecap:round; }
.ang-skater-arm { stroke:#3498db; stroke-width:3; stroke-linecap:round; }
.ang-skater-leg { stroke:#2c3e50; stroke-width:4; stroke-linecap:round; }
.ang-skater-label { font-size:11px; color:var(--text-muted); }

/* History Timeline Widget Styles */
.tl-widget { display:flex; flex-direction:column; gap:8px; height:100%; box-sizing:border-box; padding:10px; }
.tl-toolbar { display:flex; gap:6px; flex-wrap:wrap; opacity:0; max-height:0; margin-bottom:-8px; overflow:hidden; transition:opacity 0.15s, max-height 0.15s, margin-bottom 0.15s; }
.tl-widget:hover .tl-toolbar, .tl-widget:has(.tl-panel.open) .tl-toolbar, .tl-toolbar:focus-within { opacity:1; max-height:200px; margin-bottom:0; }
.tl-toolbar-btn { padding:4px 10px; font-size:12px; border:1px solid var(--border-color); border-radius:4px; background:var(--bg-secondary); color:var(--text-primary); cursor:pointer; }
.tl-toolbar-btn:hover { background:var(--bg-tertiary); }
.tl-toolbar-btn.active { background:#3498db; border-color:#3498db; color:#fff; }
.tl-panel { display:none; border:1px solid var(--border-color); border-radius:6px; padding:10px; background:var(--bg-tertiary); box-sizing:border-box; }
.tl-panel.open { display:block; }
.tl-form-row { display:flex; align-items:center; gap:6px; margin-bottom:6px; flex-wrap:wrap; }
.tl-form-row label { font-size:12px; color:var(--text-secondary); }
.tl-panel input[type="text"], .tl-panel input[type="number"], .tl-panel select, .tl-panel textarea { padding:4px 6px; border:1px solid var(--border-color); border-radius:4px; background:var(--input-bg); color:var(--text-primary); font-size:12px; box-sizing:border-box; }
.tl-form-year, .tl-form-to-year { width:90px; }
.tl-form-day, .tl-form-to-day { width:60px; }
.tl-form-title, .tl-form-category { flex:1; min-width:120px; }
.tl-form-textarea { width:100%; min-height:60px; resize:vertical; font-family:inherit; }
.tl-form-actions { display:flex; gap:6px; margin-top:6px; }
.tl-form-save { padding:4px 12px; font-size:12px; border:1px solid #3498db; border-radius:4px; background:#3498db; color:#fff; cursor:pointer; }
.tl-form-save:hover { background:#2980b9; }
.tl-form-cancel { padding:4px 12px; font-size:12px; border:1px solid var(--border-color); border-radius:4px; background:var(--bg-secondary); color:var(--text-primary); cursor:pointer; }
.tl-form-cancel:hover { background:var(--bg-tertiary); }
.tl-cat-row, .tl-era-row { display:flex; align-items:center; gap:6px; margin-bottom:4px; }
.tl-cat-row input[type="text"], .tl-era-row input[type="text"] { flex:1; }
.tl-era-row input[type="number"] { width:70px; }
.tl-era-row select, .tl-new-era-type { width:110px; }
.tl-panel input[type="color"] { width:24px; height:22px; padding:0; border:1px solid var(--border-color); border-radius:3px; cursor:pointer; }
.tl-manager-add-row { display:flex; align-items:center; gap:6px; margin-top:6px; padding-top:6px; border-top:1px solid var(--border-color); flex-wrap:wrap; }
.tl-era-toggle-row { margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid var(--border-color); font-size:12px; color:var(--text-secondary); }
.tl-era-toggle-row label { display:flex; align-items:center; gap:6px; cursor:pointer; }
.tl-era-preset-row { display:flex; align-items:center; gap:6px; margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid var(--border-color); flex-wrap:wrap; }
.tl-era-preset-row label { font-size:12px; color:var(--text-secondary); }
.tl-era-preset-select { flex:1; min-width:160px; }
.tl-icon-btn { background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:14px; padding:2px 6px; border-radius:3px; line-height:1; }
.tl-icon-btn:hover { color:var(--text-primary); background:rgba(0,0,0,0.08); }
.tl-icon-btn.delete:hover { color:#e74c3c; background:rgba(231,76,60,0.1); }
.tl-scroll { flex:1; min-height:0; overflow-y:auto; }
.tl-line { display:flex; flex-direction:column; padding:4px 4px 4px 0; }
.tl-empty { text-align:center; color:var(--text-muted); font-size:13px; padding:30px 10px; font-style:italic; }
.tl-era-banner { margin:12px 0 8px; padding:4px 10px; border-radius:4px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-primary); background:var(--bg-secondary); text-align:center; }
.tl-era-range { font-weight:400; text-transform:none; letter-spacing:normal; opacity:0.85; }
.tl-event { display:flex; gap:10px; }
.tl-event-dot-col { position:relative; width:20px; flex-shrink:0; display:flex; justify-content:center; }
.tl-event-dot-col::before { content:''; position:absolute; top:4px; bottom:-16px; left:50%; width:2px; background:var(--border-color); transform:translateX(-50%); }
.tl-event:last-child .tl-event-dot-col::before { display:none; }
.tl-event-dot { position:relative; z-index:1; width:14px; height:14px; margin-top:4px; border-radius:50%; border:2px solid var(--bg-primary); background:#95a5a6; }
.tl-event-content { flex:1; min-width:0; padding-bottom:16px; }
.tl-event-date { font-size:11px; font-weight:700; font-family:monospace; color:var(--text-muted); }
.tl-event-title { font-size:14px; font-weight:700; margin:2px 0; color:var(--text-primary); }
.tl-event-desc { font-size:12px; line-height:1.45; color:var(--text-secondary); }
.tl-event-desc p { margin:4px 0; }
.tl-event-desc ul, .tl-event-desc ol { margin:4px 0 4px 18px; padding:0; }
.tl-event-desc a { color:#3498db; }
.tl-event-chip { display:inline-block; margin-top:4px; padding:1px 8px; border-radius:10px; font-size:10px; font-weight:600; color:#fff; }
.tl-event-actions { display:flex; gap:2px; opacity:0; transition:opacity 0.15s; float:right; }
.tl-event:hover .tl-event-actions { opacity:1; }

`;
    document.head.appendChild(style);
})();

// =============================================
// ANALOG CLOCK READER
// =============================================

// Pre-build SVG tick marks and numbers for the clock face
var clockFaceSvg = '';
(function() {
    var i, angle, isHour, len, w, r1, r2, rad, x1, y1, x2, y2;
    for (i = 0; i < 60; i++) {
        angle = i * 6;
        isHour = i % 5 === 0;
        len = isHour ? 8 : 4;
        w = isHour ? 2 : 1;
        r1 = 88;
        r2 = r1 - len;
        rad = angle * Math.PI / 180;
        x1 = 100 + r1 * Math.sin(rad);
        y1 = 100 - r1 * Math.cos(rad);
        x2 = 100 + r2 * Math.sin(rad);
        y2 = 100 - r2 * Math.cos(rad);
        clockFaceSvg += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="var(--text-muted)" stroke-width="' + w + '" stroke-linecap="round"/>';
    }
    for (i = 1; i <= 12; i++) {
        rad = i * 30 * Math.PI / 180;
        x1 = 100 + 72 * Math.sin(rad);
        y1 = 100 - 72 * Math.cos(rad) + 1;
        clockFaceSvg += '<text x="' + x1.toFixed(1) + '" y="' + y1.toFixed(1) + '" text-anchor="middle" dominant-baseline="central" class="clock-number">' + i + '</text>';
    }
})();

var clockState = {
    hour: 12,
    minute: 0,
    ampm: 'AM',
    dragging: null,
    prevMinAngle: null,
    challengeMode: null,
    targetHour: 0,
    targetMinute: 0,
    targetAmpm: 'AM',
    score: 0,
    total: 0
};

function initClock() {
    // Clean up any previous document-level listeners
    document.removeEventListener('mousemove', clockDrag);
    document.removeEventListener('touchmove', clockDrag);
    document.removeEventListener('mouseup', clockEndDrag);
    document.removeEventListener('touchend', clockEndDrag);

    var minGrab = document.getElementById('clockMinGrab');
    var hrGrab = document.getElementById('clockHrGrab');

    if (minGrab) {
        minGrab.addEventListener('mousedown', function(e) { e.preventDefault(); clockState.dragging = 'minute'; });
        minGrab.addEventListener('touchstart', function(e) { e.preventDefault(); clockState.dragging = 'minute'; }, {passive: false});
    }
    if (hrGrab) {
        hrGrab.addEventListener('mousedown', function(e) { e.preventDefault(); clockState.dragging = 'hour'; });
        hrGrab.addEventListener('touchstart', function(e) { e.preventDefault(); clockState.dragging = 'hour'; }, {passive: false});
    }

    document.addEventListener('mousemove', clockDrag);
    document.addEventListener('touchmove', clockDrag, {passive: false});
    document.addEventListener('mouseup', clockEndDrag);
    document.addEventListener('touchend', clockEndDrag);

    clockState.hour = 12;
    clockState.minute = 0;
    clockState.challengeMode = null;
    clockState.score = 0;
    clockState.total = 0;
    clockRender();
}

function clockDrag(e) {
    if (!clockState.dragging) return;
    if (clockState.challengeMode === 'read') { clockState.dragging = null; return; }
    e.preventDefault();
    var svg = document.getElementById('clockSvg');
    if (!svg) return;
    var rect = svg.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    var svgX = (clientX - rect.left) / rect.width * 200;
    var svgY = (clientY - rect.top) / rect.height * 200;
    var dx = svgX - 100;
    var dy = -(svgY - 100);
    var angle = Math.atan2(dx, dy) * 180 / Math.PI;
    if (angle < 0) angle += 360;

    if (clockState.dragging === 'minute') {
        var newMin = Math.round(angle / 6) % 60;
        var prevAngle = clockState.prevMinAngle;
        if (prevAngle !== null) {
            // Detect crossing the 12 (0/360 boundary)
            var delta = angle - prevAngle;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;
            // Crossed clockwise past 12
            if (prevAngle <= 360 && prevAngle >= 270 && angle >= 0 && angle < 90 && delta > 0) {
                clockState.hour++;
                if (clockState.hour > 12) clockState.hour = 1;
                if (clockState.hour === 12) clockState.ampm = clockState.ampm === 'AM' ? 'PM' : 'AM';
            }
            // Crossed counter-clockwise past 12
            if (prevAngle >= 0 && prevAngle < 90 && angle <= 360 && angle > 270 && delta < 0) {
                clockState.hour--;
                if (clockState.hour < 1) clockState.hour = 12;
                if (clockState.hour === 12) clockState.ampm = clockState.ampm === 'AM' ? 'PM' : 'AM';
            }
        }
        clockState.prevMinAngle = angle;
        clockState.minute = newMin;
    } else if (clockState.dragging === 'hour') {
        var h = Math.round(angle / 30);
        if (h === 0) h = 12;
        clockState.hour = h;
    }
    clockRender();
}

function clockEndDrag() {
    clockState.dragging = null;
    clockState.prevMinAngle = null;
}

function clockRender() {
    var st = clockState;
    var minAngle = st.minute * 6;
    var hrAngle = (st.hour % 12) * 30 + st.minute * 0.5;

    var minHand = document.getElementById('clockMinHand');
    var hrHand = document.getElementById('clockHrHand');
    var minGrab = document.getElementById('clockMinGrab');
    var hrGrab = document.getElementById('clockHrGrab');

    var minTrans = 'rotate(' + minAngle + ', 100, 100)';
    var hrTrans = 'rotate(' + hrAngle + ', 100, 100)';
    if (minHand) minHand.setAttribute('transform', minTrans);
    if (hrHand) hrHand.setAttribute('transform', hrTrans);
    if (minGrab) minGrab.setAttribute('transform', minTrans);
    if (hrGrab) hrGrab.setAttribute('transform', hrTrans);

    var digitalEl = document.getElementById('clockDigital');
    if (digitalEl) {
        if (st.challengeMode === 'read') {
            digitalEl.textContent = '??:??';
        } else {
            digitalEl.textContent = st.hour + ':' + (st.minute < 10 ? '0' : '') + st.minute + ' ' + st.ampm;
        }
    }
}

function clockSetNow() {
    var now = new Date();
    var h = now.getHours();
    clockState.ampm = h < 12 ? 'AM' : 'PM';
    clockState.hour = h === 0 ? 12 : (h > 12 ? h - 12 : h);
    clockState.minute = now.getMinutes();
    clockState.challengeMode = null;
    clockClearChallenge();
    clockRender();
}

function clockRandomize() {
    clockState.hour = Math.floor(Math.random() * 12) + 1;
    clockState.minute = Math.floor(Math.random() * 12) * 5;
    clockState.ampm = Math.random() < 0.5 ? 'AM' : 'PM';
    clockState.challengeMode = null;
    clockClearChallenge();
    clockRender();
}

function clockClearChallenge() {
    var targetEl = document.getElementById('clockTarget');
    var feedbackEl = document.getElementById('clockFeedback');
    var checkBtn = document.getElementById('clockCheckBtn');
    var answerWrap = document.getElementById('clockAnswerWrap');
    if (targetEl) targetEl.style.display = 'none';
    if (feedbackEl) feedbackEl.textContent = '';
    if (checkBtn) checkBtn.style.display = 'none';
    if (answerWrap) answerWrap.style.display = 'none';
}

function clockNewChallenge() {
    var st = clockState;
    var modeEl = document.getElementById('clockChallengeMode');
    var mode = modeEl ? modeEl.value : 'set';

    st.targetHour = Math.floor(Math.random() * 12) + 1;
    st.targetMinute = Math.floor(Math.random() * 12) * 5;
    st.targetAmpm = Math.random() < 0.5 ? 'AM' : 'PM';
    st.challengeMode = mode;

    var targetEl = document.getElementById('clockTarget');
    var feedbackEl = document.getElementById('clockFeedback');
    var checkBtn = document.getElementById('clockCheckBtn');
    var answerWrap = document.getElementById('clockAnswerWrap');

    if (mode === 'set') {
        if (targetEl) {
            targetEl.style.display = 'block';
            targetEl.textContent = 'Set the clock to ' + st.targetHour + ':' + (st.targetMinute < 10 ? '0' : '') + st.targetMinute + ' ' + st.targetAmpm;
        }
        st.hour = 12;
        st.minute = 0;
        st.ampm = 'AM';
        if (answerWrap) answerWrap.style.display = 'none';
    } else {
        st.hour = st.targetHour;
        st.minute = st.targetMinute;
        st.ampm = st.targetAmpm;
        if (targetEl) {
            targetEl.style.display = 'block';
            targetEl.textContent = 'What time does the clock show?';
        }
        if (answerWrap) {
            answerWrap.style.display = 'block';
            var input = document.getElementById('clockAnswerInput');
            if (input) { input.value = ''; input.focus(); }
        }
    }

    if (checkBtn) checkBtn.style.display = '';
    if (feedbackEl) feedbackEl.textContent = '';
    clockRender();
}

function clockCheckAnswer() {
    var st = clockState;
    var correct = false;

    if (st.challengeMode === 'set') {
        correct = (st.hour === st.targetHour && st.minute === st.targetMinute && st.ampm === st.targetAmpm);
    } else if (st.challengeMode === 'read') {
        var input = document.getElementById('clockAnswerInput');
        if (input) {
            var val = input.value.trim().toUpperCase();
            var parts = val.split(':');
            if (parts.length === 2) {
                var ih = parseInt(parts[0], 10);
                var timePart = parts[1];
                var im = parseInt(timePart, 10);
                var hasAm = timePart.indexOf('AM') >= 0;
                var hasPm = timePart.indexOf('PM') >= 0;
                var ansAmpm = hasAm ? 'AM' : (hasPm ? 'PM' : '');
                correct = (ih === st.targetHour && im === st.targetMinute && ansAmpm === st.targetAmpm);
            }
        }
    }

    st.total++;
    if (correct) st.score++;

    var feedbackEl = document.getElementById('clockFeedback');
    var answer = st.targetHour + ':' + (st.targetMinute < 10 ? '0' : '') + st.targetMinute + ' ' + st.targetAmpm;
    if (feedbackEl) {
        if (correct) {
            feedbackEl.innerHTML = '<span style="color:#27ae60;">\u2713 Correct!</span>';
        } else {
            feedbackEl.innerHTML = '<span style="color:#e74c3c;">\u2717 The answer is ' + answer + '</span>';
        }
    }

    // Reveal the time
    st.challengeMode = null;
    clockRender();

    var scoreEl = document.getElementById('clockScore');
    if (scoreEl) scoreEl.textContent = 'Score: ' + st.score + ' / ' + st.total;
}

// =============================================
// MONEY COUNTER
// =============================================

var MONEY_DENOMS = [
    { id: 'penny', value: 1, label: '1\u00A2', type: 'coin' },
    { id: 'nickel', value: 5, label: '5\u00A2', type: 'coin' },
    { id: 'dime', value: 10, label: '10\u00A2', type: 'coin' },
    { id: 'quarter', value: 25, label: '25\u00A2', type: 'coin' },
    { id: 'bill1', value: 100, label: '$1', type: 'bill' },
    { id: 'bill5', value: 500, label: '$5', type: 'bill' },
    { id: 'bill10', value: 1000, label: '$10', type: 'bill' },
    { id: 'bill20', value: 2000, label: '$20', type: 'bill' }
];

var moneyState = {
    mode: 'free',
    mat: [],
    targetAmount: 0,
    score: 0,
    total: 0,
    changePrice: 0,
    changePaid: 0,
    nameitAnswer: '',
    nameitMat: [],
    leastTarget: 0,
    leastOptimal: 0
};

function moneyInit() {
    document.querySelectorAll('.money-widget').forEach(function(widget) {
        moneyRender(widget);
    });
}

function moneyGetWidget(el) {
    return el.closest('.money-widget');
}

function moneyRender(widget) {
    var matItems = widget.querySelector('.money-mat-items');
    var matEmpty = widget.querySelector('.money-mat-empty');
    var totalEl = widget.querySelector('.money-total');
    if (!matItems || !totalEl) return;

    var isNameit = moneyState.mode === 'nameit';
    var items = isNameit ? moneyState.nameitMat : moneyState.mat;

    var html = '';
    for (var i = 0; i < items.length; i++) {
        var denomId = items[i];
        var denom = null;
        for (var j = 0; j < MONEY_DENOMS.length; j++) {
            if (MONEY_DENOMS[j].id === denomId) { denom = MONEY_DENOMS[j]; break; }
        }
        if (!denom) continue;
        var cls = denom.type === 'coin' ? 'money-coin money-coin-' + denomId : 'money-bill money-bill-' + denomId.replace('bill', '');
        if (isNameit) {
            html += '<div class="money-mat-item readonly ' + cls + '">' + denom.label + '</div>';
        } else {
            html += '<div class="money-mat-item ' + cls + '" data-index="' + i + '" onclick="moneyRemove(this)" title="Click to remove">' + denom.label + '</div>';
        }
    }
    matItems.innerHTML = html;
    matEmpty.style.display = items.length === 0 ? '' : 'none';
    if (isNameit) {
        totalEl.textContent = '';
    } else {
        totalEl.textContent = moneyFormat(moneyTotal());
    }
}

function moneyAdd(btn) {
    if (moneyState.mode === 'nameit') return;
    var denomId = btn.getAttribute('data-denom');
    moneyState.mat.push(denomId);
    moneyRender(moneyGetWidget(btn));
}

function moneyRemove(el) {
    if (moneyState.mode === 'nameit') return;
    var idx = parseInt(el.getAttribute('data-index'), 10);
    moneyState.mat.splice(idx, 1);
    moneyRender(moneyGetWidget(el));
}

function moneyClear(btn) {
    moneyState.mat = [];
    moneyRender(moneyGetWidget(btn));
}

function moneyTotal() {
    return moneyState.mat.reduce(function(sum, denomId) {
        for (var i = 0; i < MONEY_DENOMS.length; i++) {
            if (MONEY_DENOMS[i].id === denomId) return sum + MONEY_DENOMS[i].value;
        }
        return sum;
    }, 0);
}

function moneyFormat(cents) {
    return '$' + (cents / 100).toFixed(2);
}

function moneySetMode(btn, mode) {
    moneyState.mode = mode;
    moneyState.score = 0;
    moneyState.total = 0;
    moneyState.mat = [];
    moneyState.nameitMat = [];
    var widget = moneyGetWidget(btn);
    var btns = widget.querySelectorAll('.money-mode-btn');
    btns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var challenge = widget.querySelector('.money-challenge');
    var answerRow = widget.querySelector('.money-input-row');
    var newBtn = widget.querySelector('.money-new-btn');
    var checkBtn = widget.querySelector('.money-check-btn');
    var tray = widget.querySelector('.money-tray');
    if (answerRow) answerRow.style.display = 'none';
    if (newBtn) newBtn.style.display = '';
    if (checkBtn) checkBtn.style.display = '';
    if (tray) tray.style.pointerEvents = '';
    if (tray) tray.style.opacity = '';
    if (mode === 'free') {
        challenge.style.display = 'none';
    } else if (mode === 'challenge') {
        challenge.style.display = '';
        moneyNewChallenge(btn);
    } else if (mode === 'change') {
        challenge.style.display = '';
        moneyNewChange(btn);
    } else if (mode === 'nameit') {
        challenge.style.display = '';
        if (answerRow) answerRow.style.display = '';
        if (tray) tray.style.pointerEvents = 'none';
        if (tray) tray.style.opacity = '0.5';
        moneyNewNameit(btn);
    } else if (mode === 'least') {
        challenge.style.display = '';
        moneyNewLeast(btn);
    }
    moneyRender(widget);
}

function moneyNewRound(btn) {
    if (moneyState.mode === 'challenge') return moneyNewChallenge(btn);
    if (moneyState.mode === 'change') return moneyNewChange(btn);
    if (moneyState.mode === 'nameit') return moneyNewNameit(btn);
    if (moneyState.mode === 'least') return moneyNewLeast(btn);
}

function moneyNewChallenge(btn) {
    var widget = moneyGetWidget(btn);
    moneyState.mat = [];
    moneyState.targetAmount = Math.floor(Math.random() * 999) + 1;
    var target = widget.querySelector('.money-target');
    target.textContent = 'Make exactly ' + moneyFormat(moneyState.targetAmount);
    var feedback = widget.querySelector('.money-feedback');
    feedback.textContent = '';
    feedback.style.color = '';
    moneyRender(widget);
}

function moneyCheckAnswer(btn) {
    if (moneyState.mode === 'nameit') return moneyCheckNameit(btn);
    if (moneyState.mode === 'least') return moneyCheckLeast(btn);
    var widget = moneyGetWidget(btn);
    var current = moneyTotal();
    var feedback = widget.querySelector('.money-feedback');
    var scoreEl = widget.querySelector('.money-score');
    moneyState.total++;

    if (current === moneyState.targetAmount) {
        feedback.textContent = 'Correct!';
        feedback.style.color = '#27ae60';
        moneyState.score++;
    } else if (current > moneyState.targetAmount) {
        feedback.textContent = 'Too much by ' + moneyFormat(current - moneyState.targetAmount);
        feedback.style.color = '#e74c3c';
    } else {
        feedback.textContent = 'Too little by ' + moneyFormat(moneyState.targetAmount - current);
        feedback.style.color = '#e74c3c';
    }
    scoreEl.textContent = 'Score: ' + moneyState.score + ' / ' + moneyState.total;
}

function moneyDragStart(e, denomId) {
    e.dataTransfer.setData('text/plain', denomId);
}

function moneyDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function moneyDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function moneyDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (moneyState.mode === 'nameit') return;
    var denomId = e.dataTransfer.getData('text/plain');
    if (!denomId) return;
    moneyState.mat.push(denomId);
    var widget = e.currentTarget.closest('.money-widget');
    moneyRender(widget);
}

// Make Change mode
function moneyNewChange(btn) {
    var widget = moneyGetWidget(btn);
    moneyState.mat = [];
    // Random price 25–999 cents ($0.25–$9.99)
    var price = Math.floor(Math.random() * 975) + 25;
    // Next round bill that covers the price
    var bills = [100, 500, 1000, 2000];
    var paid = 2000;
    for (var i = 0; i < bills.length; i++) {
        if (bills[i] >= price) { paid = bills[i]; break; }
    }
    var change = paid - price;
    moneyState.changePrice = price;
    moneyState.changePaid = paid;
    moneyState.targetAmount = change;
    var target = widget.querySelector('.money-target');
    target.textContent = 'Price: ' + moneyFormat(price) + ' \u2014 Paid: ' + moneyFormat(paid) + ' \u2014 Your change:';
    var feedback = widget.querySelector('.money-feedback');
    feedback.textContent = '';
    feedback.style.color = '';
    moneyRender(widget);
}

// Name It mode
function moneyNewNameit(btn) {
    var widget = moneyGetWidget(btn);
    moneyState.mat = [];
    // Generate 2–6 random denominations
    var count = Math.floor(Math.random() * 5) + 2;
    var denomIds = [];
    for (var i = 0; i < count; i++) {
        var idx = Math.floor(Math.random() * MONEY_DENOMS.length);
        denomIds.push(MONEY_DENOMS[idx].id);
    }
    moneyState.nameitMat = denomIds;
    // Compute actual total
    var total = 0;
    for (var j = 0; j < denomIds.length; j++) {
        for (var k = 0; k < MONEY_DENOMS.length; k++) {
            if (MONEY_DENOMS[k].id === denomIds[j]) { total += MONEY_DENOMS[k].value; break; }
        }
    }
    moneyState.targetAmount = total;
    var target = widget.querySelector('.money-target');
    target.textContent = 'How much money is on the mat?';
    var feedback = widget.querySelector('.money-feedback');
    feedback.textContent = '';
    feedback.style.color = '';
    var answerInput = widget.querySelector('.money-answer-input');
    if (answerInput) answerInput.value = '';
    moneyRender(widget);
}

function moneyCheckNameit(btn) {
    var widget = moneyGetWidget(btn);
    var answerInput = widget.querySelector('.money-answer-input');
    var feedback = widget.querySelector('.money-feedback');
    var scoreEl = widget.querySelector('.money-score');
    var typed = parseFloat(answerInput.value);
    if (isNaN(typed)) {
        feedback.textContent = 'Enter a dollar amount (e.g. 3.47)';
        feedback.style.color = '#e67e22';
        return;
    }
    var typedCents = Math.round(typed * 100);
    moneyState.total++;
    if (typedCents === moneyState.targetAmount) {
        feedback.textContent = 'Correct!';
        feedback.style.color = '#27ae60';
        moneyState.score++;
    } else {
        feedback.textContent = 'Not quite \u2014 the total is ' + moneyFormat(moneyState.targetAmount);
        feedback.style.color = '#e74c3c';
    }
    scoreEl.textContent = 'Score: ' + moneyState.score + ' / ' + moneyState.total;
}

// Least Coins mode
function moneyComputeOptimal(cents) {
    var denomValues = [2000, 1000, 500, 100, 25, 10, 5, 1];
    var count = 0;
    var remaining = cents;
    for (var i = 0; i < denomValues.length; i++) {
        if (remaining >= denomValues[i]) {
            count += Math.floor(remaining / denomValues[i]);
            remaining = remaining % denomValues[i];
        }
    }
    return count;
}

function moneyNewLeast(btn) {
    var widget = moneyGetWidget(btn);
    moneyState.mat = [];
    // Random target 1–999 cents ($0.01–$9.99)
    var target = Math.floor(Math.random() * 999) + 1;
    moneyState.leastTarget = target;
    moneyState.targetAmount = target;
    moneyState.leastOptimal = moneyComputeOptimal(target);
    var targetEl = widget.querySelector('.money-target');
    targetEl.textContent = 'Make exactly ' + moneyFormat(target) + ' with the fewest pieces';
    var feedback = widget.querySelector('.money-feedback');
    feedback.textContent = '';
    feedback.style.color = '';
    moneyRender(widget);
}

function moneyCheckLeast(btn) {
    var widget = moneyGetWidget(btn);
    var current = moneyTotal();
    var feedback = widget.querySelector('.money-feedback');
    var scoreEl = widget.querySelector('.money-score');
    moneyState.total++;

    if (current !== moneyState.targetAmount) {
        if (current > moneyState.targetAmount) {
            feedback.textContent = 'Too much by ' + moneyFormat(current - moneyState.targetAmount);
        } else {
            feedback.textContent = 'Too little by ' + moneyFormat(moneyState.targetAmount - current);
        }
        feedback.style.color = '#e74c3c';
    } else {
        var pieces = moneyState.mat.length;
        var optimal = moneyState.leastOptimal;
        if (pieces <= optimal) {
            feedback.textContent = 'Correct! ' + pieces + ' piece' + (pieces !== 1 ? 's' : '') + ' (optimal!)';
            feedback.style.color = '#27ae60';
            moneyState.score++;
        } else {
            feedback.textContent = 'Right amount with ' + pieces + ' piece' + (pieces !== 1 ? 's' : '') + ' \u2014 optimal is ' + optimal;
            feedback.style.color = '#e67e22';
        }
    }
    scoreEl.textContent = 'Score: ' + moneyState.score + ' / ' + moneyState.total;
}

// =============================================
// PERIODIC TABLE OF ELEMENTS
// =============================================

var PTABLE_ELEMENTS = [
    {n:1,s:'H',name:'Hydrogen',m:1.008,cat:'nonmetal',ec:'1s1',p:1,g:1},
    {n:2,s:'He',name:'Helium',m:4.003,cat:'noble',ec:'1s2',p:1,g:18},
    {n:3,s:'Li',name:'Lithium',m:6.941,cat:'alkali',ec:'[He] 2s1',p:2,g:1},
    {n:4,s:'Be',name:'Beryllium',m:9.012,cat:'alkaline',ec:'[He] 2s2',p:2,g:2},
    {n:5,s:'B',name:'Boron',m:10.81,cat:'metalloid',ec:'[He] 2s2 2p1',p:2,g:13},
    {n:6,s:'C',name:'Carbon',m:12.011,cat:'nonmetal',ec:'[He] 2s2 2p2',p:2,g:14},
    {n:7,s:'N',name:'Nitrogen',m:14.007,cat:'nonmetal',ec:'[He] 2s2 2p3',p:2,g:15},
    {n:8,s:'O',name:'Oxygen',m:15.999,cat:'nonmetal',ec:'[He] 2s2 2p4',p:2,g:16},
    {n:9,s:'F',name:'Fluorine',m:18.998,cat:'halogen',ec:'[He] 2s2 2p5',p:2,g:17},
    {n:10,s:'Ne',name:'Neon',m:20.180,cat:'noble',ec:'[He] 2s2 2p6',p:2,g:18},
    {n:11,s:'Na',name:'Sodium',m:22.990,cat:'alkali',ec:'[Ne] 3s1',p:3,g:1},
    {n:12,s:'Mg',name:'Magnesium',m:24.305,cat:'alkaline',ec:'[Ne] 3s2',p:3,g:2},
    {n:13,s:'Al',name:'Aluminium',m:26.982,cat:'post-transition',ec:'[Ne] 3s2 3p1',p:3,g:13},
    {n:14,s:'Si',name:'Silicon',m:28.086,cat:'metalloid',ec:'[Ne] 3s2 3p2',p:3,g:14},
    {n:15,s:'P',name:'Phosphorus',m:30.974,cat:'nonmetal',ec:'[Ne] 3s2 3p3',p:3,g:15},
    {n:16,s:'S',name:'Sulfur',m:32.065,cat:'nonmetal',ec:'[Ne] 3s2 3p4',p:3,g:16},
    {n:17,s:'Cl',name:'Chlorine',m:35.453,cat:'halogen',ec:'[Ne] 3s2 3p5',p:3,g:17},
    {n:18,s:'Ar',name:'Argon',m:39.948,cat:'noble',ec:'[Ne] 3s2 3p6',p:3,g:18},
    {n:19,s:'K',name:'Potassium',m:39.098,cat:'alkali',ec:'[Ar] 4s1',p:4,g:1},
    {n:20,s:'Ca',name:'Calcium',m:40.078,cat:'alkaline',ec:'[Ar] 4s2',p:4,g:2},
    {n:21,s:'Sc',name:'Scandium',m:44.956,cat:'transition',ec:'[Ar] 3d1 4s2',p:4,g:3},
    {n:22,s:'Ti',name:'Titanium',m:47.867,cat:'transition',ec:'[Ar] 3d2 4s2',p:4,g:4},
    {n:23,s:'V',name:'Vanadium',m:50.942,cat:'transition',ec:'[Ar] 3d3 4s2',p:4,g:5},
    {n:24,s:'Cr',name:'Chromium',m:51.996,cat:'transition',ec:'[Ar] 3d5 4s1',p:4,g:6},
    {n:25,s:'Mn',name:'Manganese',m:54.938,cat:'transition',ec:'[Ar] 3d5 4s2',p:4,g:7},
    {n:26,s:'Fe',name:'Iron',m:55.845,cat:'transition',ec:'[Ar] 3d6 4s2',p:4,g:8},
    {n:27,s:'Co',name:'Cobalt',m:58.933,cat:'transition',ec:'[Ar] 3d7 4s2',p:4,g:9},
    {n:28,s:'Ni',name:'Nickel',m:58.693,cat:'transition',ec:'[Ar] 3d8 4s2',p:4,g:10},
    {n:29,s:'Cu',name:'Copper',m:63.546,cat:'transition',ec:'[Ar] 3d10 4s1',p:4,g:11},
    {n:30,s:'Zn',name:'Zinc',m:65.38,cat:'transition',ec:'[Ar] 3d10 4s2',p:4,g:12},
    {n:31,s:'Ga',name:'Gallium',m:69.723,cat:'post-transition',ec:'[Ar] 3d10 4s2 4p1',p:4,g:13},
    {n:32,s:'Ge',name:'Germanium',m:72.63,cat:'metalloid',ec:'[Ar] 3d10 4s2 4p2',p:4,g:14},
    {n:33,s:'As',name:'Arsenic',m:74.922,cat:'metalloid',ec:'[Ar] 3d10 4s2 4p3',p:4,g:15},
    {n:34,s:'Se',name:'Selenium',m:78.96,cat:'nonmetal',ec:'[Ar] 3d10 4s2 4p4',p:4,g:16},
    {n:35,s:'Br',name:'Bromine',m:79.904,cat:'halogen',ec:'[Ar] 3d10 4s2 4p5',p:4,g:17},
    {n:36,s:'Kr',name:'Krypton',m:83.798,cat:'noble',ec:'[Ar] 3d10 4s2 4p6',p:4,g:18},
    {n:37,s:'Rb',name:'Rubidium',m:85.468,cat:'alkali',ec:'[Kr] 5s1',p:5,g:1},
    {n:38,s:'Sr',name:'Strontium',m:87.62,cat:'alkaline',ec:'[Kr] 5s2',p:5,g:2},
    {n:39,s:'Y',name:'Yttrium',m:88.906,cat:'transition',ec:'[Kr] 4d1 5s2',p:5,g:3},
    {n:40,s:'Zr',name:'Zirconium',m:91.224,cat:'transition',ec:'[Kr] 4d2 5s2',p:5,g:4},
    {n:41,s:'Nb',name:'Niobium',m:92.906,cat:'transition',ec:'[Kr] 4d4 5s1',p:5,g:5},
    {n:42,s:'Mo',name:'Molybdenum',m:95.96,cat:'transition',ec:'[Kr] 4d5 5s1',p:5,g:6},
    {n:43,s:'Tc',name:'Technetium',m:98,cat:'transition',ec:'[Kr] 4d5 5s2',p:5,g:7},
    {n:44,s:'Ru',name:'Ruthenium',m:101.07,cat:'transition',ec:'[Kr] 4d7 5s1',p:5,g:8},
    {n:45,s:'Rh',name:'Rhodium',m:102.906,cat:'transition',ec:'[Kr] 4d8 5s1',p:5,g:9},
    {n:46,s:'Pd',name:'Palladium',m:106.42,cat:'transition',ec:'[Kr] 4d10',p:5,g:10},
    {n:47,s:'Ag',name:'Silver',m:107.868,cat:'transition',ec:'[Kr] 4d10 5s1',p:5,g:11},
    {n:48,s:'Cd',name:'Cadmium',m:112.411,cat:'transition',ec:'[Kr] 4d10 5s2',p:5,g:12},
    {n:49,s:'In',name:'Indium',m:114.818,cat:'post-transition',ec:'[Kr] 4d10 5s2 5p1',p:5,g:13},
    {n:50,s:'Sn',name:'Tin',m:118.710,cat:'post-transition',ec:'[Kr] 4d10 5s2 5p2',p:5,g:14},
    {n:51,s:'Sb',name:'Antimony',m:121.760,cat:'metalloid',ec:'[Kr] 4d10 5s2 5p3',p:5,g:15},
    {n:52,s:'Te',name:'Tellurium',m:127.60,cat:'metalloid',ec:'[Kr] 4d10 5s2 5p4',p:5,g:16},
    {n:53,s:'I',name:'Iodine',m:126.904,cat:'halogen',ec:'[Kr] 4d10 5s2 5p5',p:5,g:17},
    {n:54,s:'Xe',name:'Xenon',m:131.293,cat:'noble',ec:'[Kr] 4d10 5s2 5p6',p:5,g:18},
    {n:55,s:'Cs',name:'Caesium',m:132.905,cat:'alkali',ec:'[Xe] 6s1',p:6,g:1},
    {n:56,s:'Ba',name:'Barium',m:137.327,cat:'alkaline',ec:'[Xe] 6s2',p:6,g:2},
    {n:57,s:'La',name:'Lanthanum',m:138.905,cat:'lanthanide',ec:'[Xe] 5d1 6s2',p:8,g:3},
    {n:58,s:'Ce',name:'Cerium',m:140.116,cat:'lanthanide',ec:'[Xe] 4f1 5d1 6s2',p:8,g:4},
    {n:59,s:'Pr',name:'Praseodymium',m:140.908,cat:'lanthanide',ec:'[Xe] 4f3 6s2',p:8,g:5},
    {n:60,s:'Nd',name:'Neodymium',m:144.242,cat:'lanthanide',ec:'[Xe] 4f4 6s2',p:8,g:6},
    {n:61,s:'Pm',name:'Promethium',m:145,cat:'lanthanide',ec:'[Xe] 4f5 6s2',p:8,g:7},
    {n:62,s:'Sm',name:'Samarium',m:150.36,cat:'lanthanide',ec:'[Xe] 4f6 6s2',p:8,g:8},
    {n:63,s:'Eu',name:'Europium',m:151.964,cat:'lanthanide',ec:'[Xe] 4f7 6s2',p:8,g:9},
    {n:64,s:'Gd',name:'Gadolinium',m:157.25,cat:'lanthanide',ec:'[Xe] 4f7 5d1 6s2',p:8,g:10},
    {n:65,s:'Tb',name:'Terbium',m:158.925,cat:'lanthanide',ec:'[Xe] 4f9 6s2',p:8,g:11},
    {n:66,s:'Dy',name:'Dysprosium',m:162.500,cat:'lanthanide',ec:'[Xe] 4f10 6s2',p:8,g:12},
    {n:67,s:'Ho',name:'Holmium',m:164.930,cat:'lanthanide',ec:'[Xe] 4f11 6s2',p:8,g:13},
    {n:68,s:'Er',name:'Erbium',m:167.259,cat:'lanthanide',ec:'[Xe] 4f12 6s2',p:8,g:14},
    {n:69,s:'Tm',name:'Thulium',m:168.934,cat:'lanthanide',ec:'[Xe] 4f13 6s2',p:8,g:15},
    {n:70,s:'Yb',name:'Ytterbium',m:173.054,cat:'lanthanide',ec:'[Xe] 4f14 6s2',p:8,g:16},
    {n:71,s:'Lu',name:'Lutetium',m:174.967,cat:'lanthanide',ec:'[Xe] 4f14 5d1 6s2',p:8,g:17},
    {n:72,s:'Hf',name:'Hafnium',m:178.49,cat:'transition',ec:'[Xe] 4f14 5d2 6s2',p:6,g:4},
    {n:73,s:'Ta',name:'Tantalum',m:180.948,cat:'transition',ec:'[Xe] 4f14 5d3 6s2',p:6,g:5},
    {n:74,s:'W',name:'Tungsten',m:183.84,cat:'transition',ec:'[Xe] 4f14 5d4 6s2',p:6,g:6},
    {n:75,s:'Re',name:'Rhenium',m:186.207,cat:'transition',ec:'[Xe] 4f14 5d5 6s2',p:6,g:7},
    {n:76,s:'Os',name:'Osmium',m:190.23,cat:'transition',ec:'[Xe] 4f14 5d6 6s2',p:6,g:8},
    {n:77,s:'Ir',name:'Iridium',m:192.217,cat:'transition',ec:'[Xe] 4f14 5d7 6s2',p:6,g:9},
    {n:78,s:'Pt',name:'Platinum',m:195.084,cat:'transition',ec:'[Xe] 4f14 5d9 6s1',p:6,g:10},
    {n:79,s:'Au',name:'Gold',m:196.967,cat:'transition',ec:'[Xe] 4f14 5d10 6s1',p:6,g:11},
    {n:80,s:'Hg',name:'Mercury',m:200.59,cat:'transition',ec:'[Xe] 4f14 5d10 6s2',p:6,g:12},
    {n:81,s:'Tl',name:'Thallium',m:204.383,cat:'post-transition',ec:'[Xe] 4f14 5d10 6s2 6p1',p:6,g:13},
    {n:82,s:'Pb',name:'Lead',m:207.2,cat:'post-transition',ec:'[Xe] 4f14 5d10 6s2 6p2',p:6,g:14},
    {n:83,s:'Bi',name:'Bismuth',m:208.980,cat:'post-transition',ec:'[Xe] 4f14 5d10 6s2 6p3',p:6,g:15},
    {n:84,s:'Po',name:'Polonium',m:209,cat:'post-transition',ec:'[Xe] 4f14 5d10 6s2 6p4',p:6,g:16},
    {n:85,s:'At',name:'Astatine',m:210,cat:'halogen',ec:'[Xe] 4f14 5d10 6s2 6p5',p:6,g:17},
    {n:86,s:'Rn',name:'Radon',m:222,cat:'noble',ec:'[Xe] 4f14 5d10 6s2 6p6',p:6,g:18},
    {n:87,s:'Fr',name:'Francium',m:223,cat:'alkali',ec:'[Rn] 7s1',p:7,g:1},
    {n:88,s:'Ra',name:'Radium',m:226,cat:'alkaline',ec:'[Rn] 7s2',p:7,g:2},
    {n:89,s:'Ac',name:'Actinium',m:227,cat:'actinide',ec:'[Rn] 6d1 7s2',p:9,g:3},
    {n:90,s:'Th',name:'Thorium',m:232.038,cat:'actinide',ec:'[Rn] 6d2 7s2',p:9,g:4},
    {n:91,s:'Pa',name:'Protactinium',m:231.036,cat:'actinide',ec:'[Rn] 5f2 6d1 7s2',p:9,g:5},
    {n:92,s:'U',name:'Uranium',m:238.029,cat:'actinide',ec:'[Rn] 5f3 6d1 7s2',p:9,g:6},
    {n:93,s:'Np',name:'Neptunium',m:237,cat:'actinide',ec:'[Rn] 5f4 6d1 7s2',p:9,g:7},
    {n:94,s:'Pu',name:'Plutonium',m:244,cat:'actinide',ec:'[Rn] 5f6 7s2',p:9,g:8},
    {n:95,s:'Am',name:'Americium',m:243,cat:'actinide',ec:'[Rn] 5f7 7s2',p:9,g:9},
    {n:96,s:'Cm',name:'Curium',m:247,cat:'actinide',ec:'[Rn] 5f7 6d1 7s2',p:9,g:10},
    {n:97,s:'Bk',name:'Berkelium',m:247,cat:'actinide',ec:'[Rn] 5f9 7s2',p:9,g:11},
    {n:98,s:'Cf',name:'Californium',m:251,cat:'actinide',ec:'[Rn] 5f10 7s2',p:9,g:12},
    {n:99,s:'Es',name:'Einsteinium',m:252,cat:'actinide',ec:'[Rn] 5f11 7s2',p:9,g:13},
    {n:100,s:'Fm',name:'Fermium',m:257,cat:'actinide',ec:'[Rn] 5f12 7s2',p:9,g:14},
    {n:101,s:'Md',name:'Mendelevium',m:258,cat:'actinide',ec:'[Rn] 5f13 7s2',p:9,g:15},
    {n:102,s:'No',name:'Nobelium',m:259,cat:'actinide',ec:'[Rn] 5f14 7s2',p:9,g:16},
    {n:103,s:'Lr',name:'Lawrencium',m:266,cat:'actinide',ec:'[Rn] 5f14 7s2 7p1',p:9,g:17},
    {n:104,s:'Rf',name:'Rutherfordium',m:267,cat:'transition',ec:'[Rn] 5f14 6d2 7s2',p:7,g:4},
    {n:105,s:'Db',name:'Dubnium',m:268,cat:'transition',ec:'[Rn] 5f14 6d3 7s2',p:7,g:5},
    {n:106,s:'Sg',name:'Seaborgium',m:269,cat:'transition',ec:'[Rn] 5f14 6d4 7s2',p:7,g:6},
    {n:107,s:'Bh',name:'Bohrium',m:270,cat:'transition',ec:'[Rn] 5f14 6d5 7s2',p:7,g:7},
    {n:108,s:'Hs',name:'Hassium',m:277,cat:'transition',ec:'[Rn] 5f14 6d6 7s2',p:7,g:8},
    {n:109,s:'Mt',name:'Meitnerium',m:278,cat:'unknown',ec:'[Rn] 5f14 6d7 7s2',p:7,g:9},
    {n:110,s:'Ds',name:'Darmstadtium',m:281,cat:'unknown',ec:'[Rn] 5f14 6d8 7s2',p:7,g:10},
    {n:111,s:'Rg',name:'Roentgenium',m:282,cat:'unknown',ec:'[Rn] 5f14 6d9 7s2',p:7,g:11},
    {n:112,s:'Cn',name:'Copernicium',m:285,cat:'unknown',ec:'[Rn] 5f14 6d10 7s2',p:7,g:12},
    {n:113,s:'Nh',name:'Nihonium',m:286,cat:'unknown',ec:'[Rn] 5f14 6d10 7s2 7p1',p:7,g:13},
    {n:114,s:'Fl',name:'Flerovium',m:289,cat:'unknown',ec:'[Rn] 5f14 6d10 7s2 7p2',p:7,g:14},
    {n:115,s:'Mc',name:'Moscovium',m:290,cat:'unknown',ec:'[Rn] 5f14 6d10 7s2 7p3',p:7,g:15},
    {n:116,s:'Lv',name:'Livermorium',m:293,cat:'unknown',ec:'[Rn] 5f14 6d10 7s2 7p4',p:7,g:16},
    {n:117,s:'Ts',name:'Tennessine',m:294,cat:'unknown',ec:'[Rn] 5f14 6d10 7s2 7p5',p:7,g:17},
    {n:118,s:'Og',name:'Oganesson',m:294,cat:'unknown',ec:'[Rn] 5f14 6d10 7s2 7p6',p:7,g:18}
];

var PTABLE_CATEGORIES = {
    'alkali': 'Alkali Metal',
    'alkaline': 'Alkaline Earth',
    'transition': 'Transition Metal',
    'post-transition': 'Post-Transition',
    'metalloid': 'Metalloid',
    'nonmetal': 'Nonmetal',
    'halogen': 'Halogen',
    'noble': 'Noble Gas',
    'lanthanide': 'Lanthanide',
    'actinide': 'Actinide',
    'unknown': 'Unknown'
};

var ptableState = {};

function ptableGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function ptableGetWidget(el) {
    return el.closest('.ptable-widget');
}

function ptableBuildGrid() {
    // Build the standard periodic table layout as a 10-row x 18-col grid
    // Rows 1-7 = periods 1-7, row 8 = separator, row 9 = lanthanides (p=8), row 10 = actinides (p=9)
    var grid = [];
    for (var r = 0; r < 10; r++) {
        grid.push(new Array(18).fill(null));
    }
    // Map elements to grid positions
    for (var i = 0; i < PTABLE_ELEMENTS.length; i++) {
        var el = PTABLE_ELEMENTS[i];
        var row, col;
        if (el.p >= 8) {
            // Lanthanides (p=8) go to row 9, Actinides (p=9) go to row 10 (0-indexed: 8, 9)
            row = el.p === 8 ? 8 : 9;
            col = el.g - 1;
        } else {
            row = el.p - 1;
            col = el.g - 1;
        }
        grid[row][col] = el;
    }
    // Row 6 col 2 (La placeholder) and Row 7 col 2 (Ac placeholder) are handled by actual elements being in rows 8/9
    return grid;
}

function ptableRender(widget) {
    var toolId = ptableGetToolId(widget);
    if (!toolId) return;
    var state = ptableState[toolId];
    if (!state) return;

    var gridWrap = widget.querySelector('.ptable-grid');
    var detailPanel = widget.querySelector('.ptable-detail');
    if (!gridWrap) return;

    var grid = ptableBuildGrid();
    var search = state.search.toLowerCase();
    var filter = state.filter;
    var selectedNum = state.selected;

    var html = '';

    for (var r = 0; r < 10; r++) {
        // Separator row before lanthanides
        if (r === 7) {
            html += '<div class="ptable-sep-row"></div>';
            continue;
        }

        for (var c = 0; c < 18; c++) {
            var el = grid[r][c];

            // Period 6 row, col 2 (group 3): show La-Lu marker
            if (r === 5 && c === 2) {
                html += '<div class="ptable-cell ptable-cat-lanthanide" style="font-size:7px;cursor:default;opacity:0.7;" title="Lanthanides: see row below">57-71</div>';
                continue;
            }
            // Period 7 row, col 2 (group 3): show Ac-Lr marker
            if (r === 6 && c === 2) {
                html += '<div class="ptable-cell ptable-cat-actinide" style="font-size:7px;cursor:default;opacity:0.7;" title="Actinides: see row below">89-103</div>';
                continue;
            }

            // Lanthanide/actinide row labels
            if ((r === 8 || r === 9) && c < 2) {
                if (c === 0) {
                    html += '<div class="ptable-lanthanide-label">' + (r === 8 ? 'Lan' : 'Act') + '</div>';
                }
                continue;
            }

            if (!el) {
                html += '<div class="ptable-spacer"></div>';
                continue;
            }

            var dimmed = false;
            if (search) {
                var matchesSearch = el.name.toLowerCase().indexOf(search) >= 0 ||
                    el.s.toLowerCase().indexOf(search) >= 0 ||
                    String(el.n) === search;
                if (!matchesSearch) dimmed = true;
            }
            if (filter && filter !== 'all' && el.cat !== filter) dimmed = true;

            var cls = 'ptable-cell ptable-cat-' + el.cat;
            if (dimmed) cls += ' dimmed';
            if (selectedNum === el.n) cls += ' selected';

            html += '<div class="' + cls + '" data-num="' + el.n + '" onclick="ptableSelect(this,' + el.n + ')" title="' + el.n + ' - ' + el.name + ' (' + el.s + ')">';
            html += '<span class="ptable-cell-num">' + el.n + '</span>';
            html += '<span class="ptable-cell-sym">' + el.s + '</span>';
            html += '<span class="ptable-cell-name">' + el.name + '</span>';
            html += '<span class="ptable-cell-mass">' + el.m + '</span>';
            html += '</div>';
        }
    }

    gridWrap.innerHTML = html;

    // Update detail panel
    if (detailPanel) {
        if (selectedNum) {
            var sel = null;
            for (var j = 0; j < PTABLE_ELEMENTS.length; j++) {
                if (PTABLE_ELEMENTS[j].n === selectedNum) { sel = PTABLE_ELEMENTS[j]; break; }
            }
            if (sel) {
                var catLabel = PTABLE_CATEGORIES[sel.cat] || sel.cat;
                detailPanel.innerHTML =
                    '<div class="ptable-detail-sym ptable-cat-' + sel.cat + '">' + sel.s + '</div>' +
                    '<div class="ptable-detail-info">' +
                        '<div class="ptable-detail-name">' + sel.name + '</div>' +
                        '<div class="ptable-detail-row"><strong>Atomic Number:</strong> ' + sel.n + '&emsp;<strong>Mass:</strong> ' + sel.m + '</div>' +
                        '<div class="ptable-detail-row"><strong>Category:</strong> ' + catLabel + '&emsp;<strong>Period:</strong> ' + (sel.p > 7 ? sel.p - 2 : sel.p) + '&emsp;<strong>Group:</strong> ' + sel.g + '</div>' +
                        '<div class="ptable-detail-row"><strong>Electron Config:</strong> ' + sel.ec + '</div>' +
                    '</div>';
            }
        } else {
            detailPanel.innerHTML = '<div class="ptable-detail-placeholder">Click an element to see details</div>';
        }
    }
}

function ptableSelect(el, num) {
    var widget = ptableGetWidget(el);
    var toolId = ptableGetToolId(widget);
    if (!toolId || !ptableState[toolId]) return;
    ptableState[toolId].selected = ptableState[toolId].selected === num ? null : num;
    ptableRender(widget);
}

function ptableSearch(input) {
    var widget = ptableGetWidget(input);
    var toolId = ptableGetToolId(widget);
    if (!toolId || !ptableState[toolId]) return;
    ptableState[toolId].search = input.value;
    ptableRender(widget);
}

function ptableFilter(select) {
    var widget = ptableGetWidget(select);
    var toolId = ptableGetToolId(widget);
    if (!toolId || !ptableState[toolId]) return;
    ptableState[toolId].filter = select.value;
    ptableRender(widget);
}

function ptableInit() {
    document.querySelectorAll('.ptable-widget').forEach(function(widget) {
        var toolId = ptableGetToolId(widget);
        if (!toolId) return;
        ptableState[toolId] = {
            selected: null,
            search: '',
            filter: 'all'
        };
        ptableRender(widget);
    });
}

// =============================================
// SPEED / DISTANCE / TIME CALCULATOR
// =============================================

var sdtState = {};

function sdtGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function sdtGetWidget(el) {
    return el.closest('.sdt-widget');
}

function sdtInit() {
    document.querySelectorAll('.sdt-widget').forEach(function(widget) {
        var toolId = sdtGetToolId(widget);
        if (!toolId) return;
        sdtState[toolId] = { solveFor: null };
        sdtClear(widget.querySelector('.pomo-btn'));
    });
}

function sdtSolveFor(btn, field) {
    var widget = sdtGetWidget(btn);
    var toolId = sdtGetToolId(widget);
    if (!toolId || !sdtState[toolId]) return;

    // Toggle: clicking same button deselects
    if (sdtState[toolId].solveFor === field) {
        sdtState[toolId].solveFor = null;
    } else {
        sdtState[toolId].solveFor = field;
    }

    // Update button styles
    var btns = widget.querySelectorAll('.sdt-solve-btn');
    btns.forEach(function(b) { b.classList.remove('active'); });
    if (sdtState[toolId].solveFor) {
        btn.classList.add('active');
    }

    // Disable the solved-for input, enable others
    var speedInput = widget.querySelector('.sdt-input-speed');
    var distInput = widget.querySelector('.sdt-input-distance');
    var timeInput = widget.querySelector('.sdt-input-time');
    speedInput.disabled = false;
    distInput.disabled = false;
    timeInput.disabled = false;
    speedInput.classList.remove('sdt-result');
    distInput.classList.remove('sdt-result');
    timeInput.classList.remove('sdt-result');

    if (sdtState[toolId].solveFor === 'speed') {
        speedInput.disabled = true;
        speedInput.value = '';
        speedInput.placeholder = 'Calculated';
    } else {
        speedInput.placeholder = 'e.g. 60';
    }
    if (sdtState[toolId].solveFor === 'distance') {
        distInput.disabled = true;
        distInput.value = '';
        distInput.placeholder = 'Calculated';
    } else {
        distInput.placeholder = 'e.g. 120';
    }
    if (sdtState[toolId].solveFor === 'time') {
        timeInput.disabled = true;
        timeInput.value = '';
        timeInput.placeholder = 'e.g. 2';
    } else {
        timeInput.placeholder = 'e.g. 2';
    }

    // Clear result
    var resultBox = widget.querySelector('.sdt-result-box');
    resultBox.innerHTML = '<span style="color:var(--text-muted);font-size:13px;">Select what to solve for, fill in the other two values, then press Calculate</span>';
}

function sdtCalculate(btn) {
    var widget = sdtGetWidget(btn);
    var toolId = sdtGetToolId(widget);
    if (!toolId || !sdtState[toolId]) return;

    var solveFor = sdtState[toolId].solveFor;
    var resultBox = widget.querySelector('.sdt-result-box');

    if (!solveFor) {
        resultBox.innerHTML = '<span class="sdt-error">Choose what to solve for first</span>';
        return;
    }

    var speedInput = widget.querySelector('.sdt-input-speed');
    var distInput = widget.querySelector('.sdt-input-distance');
    var timeInput = widget.querySelector('.sdt-input-time');
    var speedUnit = widget.querySelector('.sdt-unit-speed').value;
    var distUnit = widget.querySelector('.sdt-unit-distance').value;
    var timeUnit = widget.querySelector('.sdt-unit-time').value;

    // Parse values
    var speed = parseFloat(speedInput.value);
    var distance = parseFloat(distInput.value);
    var time = parseFloat(timeInput.value);

    // Validate inputs
    if (solveFor !== 'speed' && isNaN(speed)) {
        resultBox.innerHTML = '<span class="sdt-error">Enter a valid speed value</span>';
        return;
    }
    if (solveFor !== 'distance' && isNaN(distance)) {
        resultBox.innerHTML = '<span class="sdt-error">Enter a valid distance value</span>';
        return;
    }
    if (solveFor !== 'time' && isNaN(time)) {
        resultBox.innerHTML = '<span class="sdt-error">Enter a valid time value</span>';
        return;
    }

    // Convert to base units: km/h, km, hours
    var speedKmh, distKm, timeHrs;

    if (solveFor !== 'speed') {
        speedKmh = speedUnit === 'mph' ? speed * 1.60934 : (speedUnit === 'ms' ? speed * 3.6 : speed);
    }
    if (solveFor !== 'distance') {
        distKm = distUnit === 'mi' ? distance * 1.60934 : (distUnit === 'm' ? distance / 1000 : distance);
    }
    if (solveFor !== 'time') {
        timeHrs = timeUnit === 'min' ? time / 60 : (timeUnit === 'sec' ? time / 3600 : time);
    }

    var resultVal, resultLabel, formula;

    if (solveFor === 'speed') {
        if (timeHrs === 0) {
            resultBox.innerHTML = '<span class="sdt-error">Time cannot be zero</span>';
            return;
        }
        var resKmh = distKm / timeHrs;
        // Convert back to selected unit
        if (speedUnit === 'mph') {
            resultVal = resKmh / 1.60934;
        } else if (speedUnit === 'ms') {
            resultVal = resKmh / 3.6;
        } else {
            resultVal = resKmh;
        }
        var unitLabel = speedUnit === 'mph' ? 'mph' : (speedUnit === 'ms' ? 'm/s' : 'km/h');
        resultLabel = sdtFormatNum(resultVal) + ' ' + unitLabel;
        formula = 'Speed = Distance \u00F7 Time';
        speedInput.value = sdtFormatNum(resultVal);
        speedInput.classList.add('sdt-result');
    } else if (solveFor === 'distance') {
        var resKm = speedKmh * timeHrs;
        if (distUnit === 'mi') {
            resultVal = resKm / 1.60934;
        } else if (distUnit === 'm') {
            resultVal = resKm * 1000;
        } else {
            resultVal = resKm;
        }
        var dUnitLabel = distUnit === 'mi' ? 'miles' : (distUnit === 'm' ? 'meters' : 'km');
        resultLabel = sdtFormatNum(resultVal) + ' ' + dUnitLabel;
        formula = 'Distance = Speed \u00D7 Time';
        distInput.value = sdtFormatNum(resultVal);
        distInput.classList.add('sdt-result');
    } else if (solveFor === 'time') {
        if (speedKmh === 0) {
            resultBox.innerHTML = '<span class="sdt-error">Speed cannot be zero</span>';
            return;
        }
        var resHrs = distKm / speedKmh;
        if (timeUnit === 'min') {
            resultVal = resHrs * 60;
        } else if (timeUnit === 'sec') {
            resultVal = resHrs * 3600;
        } else {
            resultVal = resHrs;
        }
        var tUnitLabel = timeUnit === 'min' ? 'minutes' : (timeUnit === 'sec' ? 'seconds' : 'hours');
        resultLabel = sdtFormatNum(resultVal) + ' ' + tUnitLabel;
        formula = 'Time = Distance \u00F7 Speed';
        timeInput.value = sdtFormatNum(resultVal);
        timeInput.classList.add('sdt-result');
    }

    resultBox.innerHTML = '<div class="sdt-result-value">' + resultLabel + '</div>' +
        '<div class="sdt-result-detail">' + formula + '</div>';
}

function sdtFormatNum(n) {
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(n < 10 ? 3 : 2).replace(/\.?0+$/, '');
}

function sdtClear(btn) {
    var widget = sdtGetWidget(btn);
    var toolId = sdtGetToolId(widget);
    if (!toolId) return;

    if (sdtState[toolId]) sdtState[toolId].solveFor = null;

    var inputs = widget.querySelectorAll('.sdt-field-input');
    inputs.forEach(function(inp) {
        inp.value = '';
        inp.disabled = false;
        inp.classList.remove('sdt-result');
    });
    widget.querySelector('.sdt-input-speed').placeholder = 'e.g. 60';
    widget.querySelector('.sdt-input-distance').placeholder = 'e.g. 120';
    widget.querySelector('.sdt-input-time').placeholder = 'e.g. 2';

    var btns = widget.querySelectorAll('.sdt-solve-btn');
    btns.forEach(function(b) { b.classList.remove('active'); });

    var resultBox = widget.querySelector('.sdt-result-box');
    resultBox.innerHTML = '<span style="color:var(--text-muted);font-size:13px;">Select what to solve for, fill in the other two values, then press Calculate</span>';
}

function sdtKeydown(e) {
    if (e.key === 'Enter') {
        var widget = sdtGetWidget(e.target);
        var calcBtn = widget.querySelector('.sdt-calc-btn');
        if (calcBtn) sdtCalculate(calcBtn);
    }
}

// =============================================
// MULTIPLICATION TABLE
// =============================================

var MULT_HARD = new Set([
    '6,7','7,6','6,8','8,6','7,8','8,7',
    '6,9','9,6','7,9','9,7','8,9','9,8',
    '6,6','7,7','8,8','9,9',
    '11,7','7,11','11,8','8,11','11,9','9,11',
    '12,7','7,12','12,8','8,12','12,9','9,12',
    '11,11','11,12','12,11','12,12'
]);

var multState = {};

function multGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function multGetWidget(el) {
    return el.closest('.mult-widget');
}

function multInit() {
    document.querySelectorAll('.mult-widget').forEach(function(widget) {
        var toolId = multGetToolId(widget);
        if (!toolId) return;
        multState[toolId] = {
            maxNum: 10,
            halfMode: 'lower',
            showHard: true,
            activeTab: 'grid',
            challengeDigits: new Set([1,2,3,4,5,6,7,8,9,10]),
            challengeCurrent: null,
            score: { correct: 0, total: 0 }
        };
        multRenderGrid(widget);
    });
}

function multSetTab(btn, tab) {
    var widget = multGetWidget(btn);
    var toolId = multGetToolId(widget);
    if (!toolId || !multState[toolId]) return;
    multState[toolId].activeTab = tab;

    widget.querySelectorAll('.mult-tab').forEach(function(t) { t.classList.remove('active'); });
    btn.classList.add('active');

    var gridPanel = widget.querySelector('.mult-grid-panel');
    var challengePanel = widget.querySelector('.mult-challenge-panel');
    if (tab === 'grid') {
        if (gridPanel) gridPanel.style.display = '';
        if (challengePanel) challengePanel.classList.remove('active');
    } else {
        if (gridPanel) gridPanel.style.display = 'none';
        if (challengePanel) {
            challengePanel.classList.add('active');
            multRenderChallenge(widget);
        }
    }
}

function multRenderGrid(widget) {
    var toolId = multGetToolId(widget);
    if (!toolId || !multState[toolId]) return;
    var st = multState[toolId];
    var n = st.maxNum;
    var half = st.halfMode;
    var showHard = st.showHard;

    var cellSize = n <= 10 ? 38 : (n <= 12 ? 34 : (n <= 15 ? 28 : 24));
    var fontSize = n <= 12 ? 12 : (n <= 15 ? 10 : 9);

    var html = '<table class="mult-table" style="font-size:' + fontSize + 'px;" onmouseover="multCellHover(event)" onmouseout="multCellOut(event)">';
    html += '<thead><tr>';
    html += '<th class="mult-row-header" style="width:' + cellSize + 'px;height:' + cellSize + 'px;">×</th>';
    for (var c = 1; c <= n; c++) {
        html += '<th data-col="' + c + '" style="width:' + cellSize + 'px;height:' + cellSize + 'px;">' + c + '</th>';
    }
    html += '</tr></thead><tbody>';

    for (var r = 1; r <= n; r++) {
        html += '<tr>';
        html += '<th class="mult-row-header" style="width:' + cellSize + 'px;height:' + cellSize + 'px;">' + r + '</th>';
        for (var ci = 1; ci <= n; ci++) {
            var hidden = (half === 'upper' && r > ci) || (half === 'lower' && r < ci);
            var isDiag = (r === ci);
            var isHard = showHard && MULT_HARD.has(r + ',' + ci);

            var cls = 'mult-cell';
            if (hidden) cls += ' mult-hidden';
            if (!hidden && isDiag) cls += ' mult-diagonal';
            if (!hidden && isHard) cls += ' mult-hard';

            html += '<td class="' + cls + '" data-col="' + ci + '" style="width:' + cellSize + 'px;height:' + cellSize + 'px;">';
            if (!hidden) html += (r * ci);
            html += '</td>';
        }
        html += '</tr>';
    }
    html += '</tbody></table>';

    var wrap = widget.querySelector('.mult-table-wrap');
    if (wrap) wrap.innerHTML = html;
}

function multSetMax(select) {
    var widget = multGetWidget(select);
    var toolId = multGetToolId(widget);
    if (!toolId || !multState[toolId]) return;
    multState[toolId].maxNum = parseInt(select.value, 10);
    multRenderGrid(widget);
}

function multSetHalf(btn, mode) {
    var widget = multGetWidget(btn);
    var toolId = multGetToolId(widget);
    if (!toolId || !multState[toolId]) return;
    multState[toolId].halfMode = mode;
    widget.querySelectorAll('.mult-half-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    multRenderGrid(widget);
}

function multToggleHard(btn) {
    var widget = multGetWidget(btn);
    var toolId = multGetToolId(widget);
    if (!toolId || !multState[toolId]) return;
    multState[toolId].showHard = !multState[toolId].showHard;
    btn.classList.toggle('active', multState[toolId].showHard);
    multRenderGrid(widget);
}

function multCellHover(event) {
    var td = event.target.closest('td.mult-cell');
    if (!td || td.classList.contains('mult-hidden')) return;
    var col = td.getAttribute('data-col');
    var table = td.closest('.mult-table');
    if (!table || !col) return;
    var colHeader = table.querySelector('thead th[data-col="' + col + '"]');
    if (colHeader) colHeader.classList.add('mult-col-highlight');
    var rowHeader = td.closest('tr').querySelector('th.mult-row-header');
    if (rowHeader) rowHeader.classList.add('mult-row-highlight');
}

function multCellOut(event) {
    var table = event.currentTarget;
    table.querySelectorAll('.mult-col-highlight').forEach(function(c) { c.classList.remove('mult-col-highlight'); });
    table.querySelectorAll('.mult-row-highlight').forEach(function(c) { c.classList.remove('mult-row-highlight'); });
}

function multRenderChallenge(widget) {
    var toolId = multGetToolId(widget);
    if (!toolId || !multState[toolId]) return;
    var st = multState[toolId];

    var digitRow = widget.querySelector('.mult-digit-row');
    if (digitRow) {
        var html = '';
        for (var d = 1; d <= 12; d++) {
            var isActive = st.challengeDigits.has(d);
            html += '<button class="mult-digit-btn' + (isActive ? ' active' : '') + '" onclick="multToggleDigit(this,' + d + ')">' + d + '</button>';
        }
        digitRow.innerHTML = html;
    }

    if (!st.challengeCurrent) {
        multNextQuestion(widget);
    }
    multUpdateScore(widget);
}

function multToggleDigit(btn, digit) {
    var widget = multGetWidget(btn);
    var toolId = multGetToolId(widget);
    if (!toolId || !multState[toolId]) return;
    var digits = multState[toolId].challengeDigits;
    if (digits.has(digit)) {
        if (digits.size > 1) {
            digits.delete(digit);
            btn.classList.remove('active');
        }
    } else {
        digits.add(digit);
        btn.classList.add('active');
    }
}

function multNextQuestion(widget) {
    var toolId = multGetToolId(widget);
    if (!toolId || !multState[toolId]) return;
    var st = multState[toolId];
    var digits = Array.from(st.challengeDigits);

    var feedbackEl = widget.querySelector('.mult-feedback');
    if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.className = 'mult-feedback'; }

    var input = widget.querySelector('.mult-answer-input');
    if (input) { input.value = ''; input.focus(); }

    if (digits.length === 0) {
        var qEl = widget.querySelector('.mult-question');
        if (qEl) qEl.textContent = '';
        st.challengeCurrent = null;
        return;
    }

    var a = digits[Math.floor(Math.random() * digits.length)];
    var b = digits[Math.floor(Math.random() * digits.length)];
    st.challengeCurrent = { a: a, b: b, answer: a * b };

    var qEl = widget.querySelector('.mult-question');
    if (qEl) qEl.textContent = a + ' × ' + b + ' = ?';

    multUpdateScore(widget);
}

function multCheckAnswer(input) {
    var widget = multGetWidget(input);
    var toolId = multGetToolId(widget);
    if (!toolId || !multState[toolId]) return;
    var st = multState[toolId];
    if (!st.challengeCurrent) return;

    var val = parseInt(input.value.trim(), 10);
    if (isNaN(val)) return;

    var correct = (val === st.challengeCurrent.answer);
    st.score.total++;
    if (correct) st.score.correct++;

    var feedbackEl = widget.querySelector('.mult-feedback');
    if (feedbackEl) {
        if (correct) {
            feedbackEl.textContent = '✓ Correct!';
            feedbackEl.className = 'mult-feedback correct';
        } else {
            feedbackEl.textContent = '✗ Wrong — the answer is ' + st.challengeCurrent.answer;
            feedbackEl.className = 'mult-feedback wrong';
        }
    }

    multUpdateScore(widget);

    setTimeout(function() {
        multNextQuestion(widget);
    }, 1200);
}

function multSubmitChallenge(btn) {
    var widget = multGetWidget(btn);
    var input = widget.querySelector('.mult-answer-input');
    if (input) multCheckAnswer(input);
}

function multUpdateScore(widget) {
    var toolId = multGetToolId(widget);
    if (!toolId || !multState[toolId]) return;
    var st = multState[toolId];
    var scoreEl = widget.querySelector('.mult-score');
    if (scoreEl) {
        scoreEl.textContent = 'Score: ' + st.score.correct + ' / ' + st.score.total;
    }
}

function multNewChallenge(btn) {
    var widget = multGetWidget(btn);
    var toolId = multGetToolId(widget);
    if (!toolId || !multState[toolId]) return;
    multState[toolId].score = { correct: 0, total: 0 };
    multState[toolId].challengeCurrent = null;
    multUpdateScore(widget);
    multNextQuestion(widget);
}

// =============================================
// NUMBER LINE EXPLORER
// =============================================

var nlState = {}; // keyed by toolId

var NL_X0 = 40, NL_X1 = 460, NL_Y = 75, NL_W = 500, NL_H = 130;

function nlGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function nlGetWidget(el) {
    return el.closest('.nl-widget');
}

function nlDefaultState() {
    return {
        mode: 'fraction',
        denominator: 4, markerNumerator: 3, showLabels: true, showBar: false,
        frogStart: 0, jumps: [], frogJumpSign: '+', frogJumpVal: '',
        zoomValue: 63, roundTo: 10, zoomedIn: false, zoomAnswered: false, zoomCorrect: false, zoomFeedback: '',
        secretNumerator: 3, secretDenominator: 4,
        gameDenominator: 4, gameNumerator: -1,
        gameScore: { correct: 0, total: 0 }, gameRevealed: false, gameFeedback: ''
    };
}

function nlInit() {
    document.querySelectorAll('.nl-widget').forEach(function(widget) {
        var toolId = nlGetToolId(widget);
        if (!toolId) return;
        if (!nlState[toolId]) nlState[toolId] = nlDefaultState();
        nlRenderWidget(widget, toolId);
    });
}

function nlSetMode(btn, mode) {
    var widget = nlGetWidget(btn);
    var toolId = nlGetToolId(btn);
    if (!toolId || !nlState[toolId]) return;
    nlState[toolId].mode = mode;
    widget.querySelectorAll('.nl-tab').forEach(function(t) { t.classList.remove('active'); });
    btn.classList.add('active');
    nlRenderWidget(widget, toolId);
}

function nlRender(toolId) {
    document.querySelectorAll('.nl-widget').forEach(function(widget) {
        if (nlGetToolId(widget) === toolId) nlRenderWidget(widget, toolId);
    });
}

function nlRenderWidget(widget, toolId) {
    if (!nlState[toolId]) return;
    var st = nlState[toolId];
    var panels = widget.querySelectorAll('.nl-panel');
    panels.forEach(function(p) { p.classList.remove('active'); });
    var active = widget.querySelector('.nl-panel-' + st.mode);
    if (active) active.classList.add('active');
    if (st.mode === 'fraction') nlFractionRender(widget, toolId);
    else if (st.mode === 'frog') nlFrogRender(widget, toolId);
    else if (st.mode === 'zoom') nlZoomRender(widget, toolId);
    else if (st.mode === 'game') nlGameRender(widget, toolId);
}

// --- SVG LINE BUILDER ---

// Returns 0–4: how "prominent" an integer tick at `val` should be,
// relative to the labelled step `labelEvery`.
//   4 = major (labelled)  → tallest
//   3 = half-step         → tall
//   2 = fifth-step        → medium
//   1 = tenth-step        → short
//   0 = minor             → shortest
function nlTickLevel(val, labelEvery) {
    if (labelEvery <= 1) return 4;
    if (val % labelEvery === 0) return 4;
    var half  = labelEvery / 2;
    if (half  === Math.floor(half)  && half  >= 1 && val % half  === 0) return 3;
    var fifth = labelEvery / 5;
    if (fifth === Math.floor(fifth) && fifth >= 1 && val % fifth === 0) return 2;
    var tenth = labelEvery / 10;
    if (tenth === Math.floor(tenth) && tenth >= 1 && val % tenth === 0) return 1;
    return 0;
}

function nlBuildLine(opts) {
    // opts: rangeStart, rangeEnd, denominator, markerNumerator, showLabels, showBar,
    //       arcs([{from,to,label,color}]), highlights([{from,to,color}]),
    //       secretPos(0..1 of full range, or -1), markerColor, mode, hideTicks
    var rs = opts.rangeStart || 0;
    var re = opts.rangeEnd || 2;
    var denom = opts.denominator || 1;
    var totalTicks = Math.round((re - rs) * denom);
    var x0 = NL_X0, x1 = NL_X1, y = NL_Y;
    var span = x1 - x0;
    var markerN = (opts.markerNumerator !== undefined) ? opts.markerNumerator : -1;
    var mc = opts.markerColor || '#3498db';

    function tickX(n) { return x0 + (n / totalTicks) * span; }
    function valX(v) { return x0 + ((v - rs) / (re - rs)) * span; }

    var svgParts = [];
    svgParts.push('<svg class="nl-svg" viewBox="0 0 ' + NL_W + ' ' + NL_H + '" xmlns="http://www.w3.org/2000/svg"');
    if (opts.mode === 'fraction' || opts.mode === 'game') {
        svgParts.push(' onclick="nlSvgClick(this,event)"');
    } else if (opts.mode === 'zoom') {
        svgParts.push(' onclick="nlZoomSvgClick(this,event)"');
    }
    svgParts.push(' onmousemove="nlSvgMove(this,event)" onmouseup="nlSvgUp(this,event)" onmouseleave="nlSvgUp(this,event)">');

    // highlights (zoom mode)
    if (opts.highlights) {
        opts.highlights.forEach(function(h) {
            var hx0 = valX(h.from), hx1 = valX(h.to);
            svgParts.push('<rect x="' + hx0 + '" y="' + (y-16) + '" width="' + (hx1-hx0) + '" height="32" fill="' + h.color + '" rx="3" opacity="0.25"/>');
        });
    }

    // fraction bar
    if (opts.showBar && markerN >= 0) {
        var barW = (markerN / totalTicks) * span;
        svgParts.push('<rect x="' + x0 + '" y="8" width="' + span + '" height="18" fill="var(--bg-tertiary)" rx="3" stroke="var(--border-color)" stroke-width="1"/>');
        if (barW > 0) {
            svgParts.push('<rect x="' + x0 + '" y="8" width="' + barW + '" height="18" fill="' + mc + '" rx="3" opacity="0.7"/>');
        }
        // bar tick marks
        for (var b = 0; b <= totalTicks && b <= Math.round((1 - rs) * denom) + (Math.round((re - 1) * denom)); b++) {
            var bx = x0 + (b / totalTicks) * span;
            svgParts.push('<line x1="' + bx + '" y1="8" x2="' + bx + '" y2="26" stroke="var(--border-color)" stroke-width="1"/>');
        }
    }

    // arcs (frog mode)
    if (opts.arcs) {
        var arcColors = ['#e74c3c','#9b59b6','#27ae60','#e67e22','#1abc9c','#f39c12'];
        opts.arcs.forEach(function(arc, i) {
            var ax0 = valX(arc.from), ax1 = valX(arc.to);
            var arcH = 28 + Math.abs(ax1 - ax0) * 0.15;
            var cy = y - arcH;
            var midX = (ax0 + ax1) / 2;
            var col = arcColors[i % arcColors.length];
            svgParts.push('<path d="M' + ax0 + ' ' + y + ' Q' + midX + ' ' + cy + ' ' + ax1 + ' ' + y + '" fill="none" stroke="' + col + '" stroke-width="2.5" stroke-dasharray="none"/>');
            var lbl = (arc.delta >= 0 ? '+' : '') + arc.delta;
            svgParts.push('<text x="' + midX + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="11" font-weight="600" fill="' + col + '">' + lbl + '</text>');
        });
    }

    // main axis line
    svgParts.push('<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" stroke="var(--text-primary)" stroke-width="2"/>');
    // arrow heads
    svgParts.push('<polygon points="' + x1 + ',' + y + ' ' + (x1-8) + ',' + (y-4) + ' ' + (x1-8) + ',' + (y+4) + '" fill="var(--text-primary)"/>');

    // tick marks and labels
    // — auto-thin labels and ticks when the range is large —
    var pxPerTick = totalTicks > 0 ? span / totalTicks : span;
    var pxPerWhole = pxPerTick * denom;
    // pick the smallest "nice" step so labels stay at least 28 px apart
    var labelEvery = 1;
    if (pxPerWhole < 28) {
        var raw = Math.ceil(28 / pxPerWhole);
        var niceSteps = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
        for (var ni = 0; ni < niceSteps.length; ni++) {
            if (niceSteps[ni] >= raw) { labelEvery = niceSteps[ni]; break; }
        }
        if (labelEvery === 1 && raw > 1000) labelEvery = raw; // fallback
    }
    // skip fractional tick marks when they would be denser than 3 px
    var showFracTicks = pxPerTick >= 3;
    // skip whole-number tick marks that won't get a label when very crowded
    var tickEvery = (pxPerWhole < 6) ? labelEvery : 1;

    for (var n = 0; n <= totalTicks; n++) {
        var tx = tickX(n);
        var isWhole = (n % denom === 0);
        // intVal: the actual number-line value at this tick (used for alignment, not index)
        var intVal = Math.round(rs + n / denom);

        // skip fractional ticks when too dense
        if (!isWhole && !showFracTicks) continue;
        // skip whole-number ticks between labelled positions when very crowded
        // align to actual values (intVal % tickEvery), not index, so 0 stays prominent
        if (isWhole && tickEvery > 1 && (intVal % tickEvery !== 0)) continue;

        var tickH, tickDown, tickSW;
        if (isWhole && denom === 1) {
            // graduated heights for integer scales: major > half > fifth > tenth > minor
            var lvl = nlTickLevel(intVal, labelEvery);
            var lvlH  = [5, 7, 9, 12, 16];  // px above line
            var lvlD  = [2, 3, 4,  5,  6];  // px below line
            var lvlW  = ['0.7', '0.8', '1.0', '1.2', '1.5']; // stroke-width
            tickH = lvlH[lvl]; tickDown = lvlD[lvl]; tickSW = lvlW[lvl];
        } else if (isWhole) {
            tickH = 16; tickDown = 6; tickSW = '1.5';
        } else {
            tickH = 10; tickDown = 4; tickSW = '1';
        }
        svgParts.push('<line x1="' + tx + '" y1="' + (y - tickH) + '" x2="' + tx + '" y2="' + (y + tickDown) + '" stroke="var(--text-secondary)" stroke-width="' + tickSW + '"/>');
        if (opts.showLabels !== false) {
            var val = rs + n / denom;
            var lbl = '';
            // label at multiples of labelEvery in value space (not index space)
            if (isWhole && (intVal % labelEvery === 0)) {
                lbl = String(intVal);
            } else if (!isWhole && !opts.hideTicks && showFracTicks) {
                var num = n % denom;
                lbl = num + '/' + denom;
            }
            if (lbl) {
                svgParts.push('<text x="' + tx + '" y="' + (y + 20) + '" text-anchor="middle" font-size="' + (isWhole ? 12 : 10) + '" font-weight="' + (isWhole ? '700' : '400') + '" fill="var(--text-' + (isWhole ? 'primary' : 'secondary') + ')">' + lbl + '</text>');
            }
        }
    }

    // secret chest (game mode)
    if (opts.secretPos !== undefined && opts.secretPos >= 0) {
        var cx = x0 + opts.secretPos * span;
        svgParts.push('<text x="' + cx + '" y="' + (y - 20) + '" text-anchor="middle" font-size="20">' + (opts.secretRevealed ? '✅' : '🎁') + '</text>');
    }

    // marker flag
    if (markerN >= 0) {
        var mx = tickX(markerN);
        svgParts.push('<line x1="' + mx + '" y1="' + (y - 16) + '" x2="' + mx + '" y2="' + (y + 6) + '" stroke="' + mc + '" stroke-width="2.5"/>');
        svgParts.push('<polygon points="' + mx + ',' + (y-16) + ' ' + (mx+14) + ',' + (y-24) + ' ' + (mx+14) + ',' + (y-8) + '" fill="' + mc + '" opacity="0.85" onmousedown="nlMarkerDown(this,event)" style="cursor:grab"/>');
    }

    // frog emoji at current position (frog mode)
    if (opts.frogPos !== undefined) {
        var fp = valX(opts.frogPos);
        svgParts.push('<text x="' + fp + '" y="' + (y - 20) + '" text-anchor="middle" font-size="20">🐸</text>');
    }

    svgParts.push('</svg>');
    return svgParts.join('');
}

// --- FRACTION MODE ---
function nlFractionRender(widget, toolId) {
    var st = nlState[toolId];
    var container = widget.querySelector('.nl-panel-fraction .nl-svg-container');
    if (!container) return;
    container.innerHTML = nlBuildLine({
        rangeStart: 0, rangeEnd: 2,
        denominator: st.denominator,
        markerNumerator: st.markerNumerator,
        showLabels: st.showLabels,
        showBar: st.showBar,
        markerColor: '#3498db',
        mode: 'fraction'
    });

    // fraction label
    var label = widget.querySelector('.nl-fraction-label');
    if (label) {
        var n = st.markerNumerator, d = st.denominator;
        if (n === 0) label.textContent = '0';
        else if (n % d === 0) label.textContent = String(n / d);
        else if (n < d) label.textContent = n + ' / ' + d;
        else { var w = Math.floor(n/d), r = n%d; label.textContent = w + '  ' + r + ' / ' + d; }
    }

    // sync denom select
    var sel = widget.querySelector('.nl-denom-select');
    if (sel) sel.value = String(st.denominator);

    // sync labels btn
    var lbtn = widget.querySelector('.nl-labels-btn');
    if (lbtn) lbtn.textContent = st.showLabels ? '🔢 Labels: ON' : '🔢 Labels: OFF';

    // sync bar btn
    var bbtn = widget.querySelector('.nl-bar-btn');
    if (bbtn) { bbtn.textContent = st.showBar ? '📊 Bar: ON' : '📊 Bar: OFF'; bbtn.className = 'pomo-btn nl-bar-btn' + (st.showBar ? ' primary paused' : ''); }
}

function nlFractionSetDenom(sel) {
    var toolId = nlGetToolId(sel);
    if (!toolId || !nlState[toolId]) return;
    var st = nlState[toolId];
    st.denominator = parseInt(sel.value);
    var maxN = 2 * st.denominator;
    if (st.markerNumerator > maxN) st.markerNumerator = maxN;
    nlRender(toolId);
}

function nlFractionToggleLabels(btn) {
    var toolId = nlGetToolId(btn);
    if (!toolId || !nlState[toolId]) return;
    nlState[toolId].showLabels = !nlState[toolId].showLabels;
    nlRender(toolId);
}

function nlFractionToggleBar(btn) {
    var toolId = nlGetToolId(btn);
    if (!toolId || !nlState[toolId]) return;
    nlState[toolId].showBar = !nlState[toolId].showBar;
    nlRender(toolId);
}

// shared SVG click/drag (fraction + game)
function nlSvgClick(svgEl, event) {
    var widget = nlGetWidget(svgEl);
    var toolId = nlGetToolId(svgEl);
    if (!toolId || !nlState[toolId]) return;
    var st = nlState[toolId];
    if (st._dragging) return;
    var rect = svgEl.getBoundingClientRect();
    var rawX = (event.clientX - rect.left) / rect.width * NL_W;
    if (st.mode === 'fraction') {
        var totalTicks = 2 * st.denominator;
        var n = Math.round((rawX - NL_X0) / (NL_X1 - NL_X0) * totalTicks);
        n = Math.max(0, Math.min(totalTicks, n));
        st.markerNumerator = n;
    } else if (st.mode === 'game') {
        var totalG = st.gameDenominator;
        var gn = Math.round((rawX - NL_X0) / (NL_X1 - NL_X0) * totalG);
        gn = Math.max(0, Math.min(totalG, gn));
        st.gameNumerator = gn;
        st.gameFeedback = '';
        st.gameRevealed = false;
    }
    nlRender(toolId);
}

function nlMarkerDown(el, event) {
    event.stopPropagation();
    var svgEl = el.closest('svg');
    var widget = nlGetWidget(svgEl);
    var toolId = nlGetToolId(svgEl);
    if (!toolId || !nlState[toolId]) return;
    nlState[toolId]._dragging = true;
}

function nlSvgMove(svgEl, event) {
    var toolId = nlGetToolId(svgEl);
    if (!toolId || !nlState[toolId]) return;
    var st = nlState[toolId];
    if (!st._dragging) return;
    var rect = svgEl.getBoundingClientRect();
    var rawX = (event.clientX - rect.left) / rect.width * NL_W;
    if (st.mode === 'fraction') {
        var totalTicks = 2 * st.denominator;
        var n = Math.round((rawX - NL_X0) / (NL_X1 - NL_X0) * totalTicks);
        n = Math.max(0, Math.min(totalTicks, n));
        if (n !== st.markerNumerator) { st.markerNumerator = n; nlRender(toolId); }
    }
}

function nlSvgUp(svgEl, event) {
    var toolId = nlGetToolId(svgEl);
    if (toolId && nlState[toolId]) nlState[toolId]._dragging = false;
}

// --- FROG JUMP MODE ---
function nlFrogRender(widget, toolId) {
    var st = nlState[toolId];
    var container = widget.querySelector('.nl-panel-frog .nl-svg-container');
    if (!container) return;

    // compute range
    var positions = [st.frogStart];
    var cur = st.frogStart;
    var arcs = [];
    st.jumps.forEach(function(j) {
        var prev = cur;
        cur += j.delta;
        positions.push(cur);
        arcs.push({ from: prev, to: cur, delta: j.delta });
    });
    var minV = Math.min.apply(null, positions);
    var maxV = Math.max.apply(null, positions);
    var pad = Math.max(5, (maxV - minV) * 0.1);
    var rs = Math.floor(minV - pad);
    var re = Math.ceil(maxV + pad);
    if (rs === re) { rs -= 5; re += 5; }
    var range = re - rs;
    // choose nice denominator
    var fd = 1;

    container.innerHTML = nlBuildLine({
        rangeStart: rs, rangeEnd: re,
        denominator: fd,
        markerNumerator: -1,
        showLabels: true,
        arcs: arcs,
        frogPos: cur,
        mode: 'frog'
    });

    // update jump chips
    var chipList = widget.querySelector('.nl-jumps-list');
    if (chipList) {
        chipList.innerHTML = st.jumps.length ? st.jumps.map(function(j, i) {
            return '<span class="nl-jump-chip">' + (j.delta >= 0 ? '+' : '') + j.delta + ' <span onclick="nlFrogRemoveJump(' + i + ',this)" style="cursor:pointer;opacity:.6;">✕</span></span>';
        }).join('') : '<span style="font-size:11px;color:var(--text-muted);">No jumps yet</span>';
    }

    // update status
    var status = widget.querySelector('.nl-frog-status');
    if (status) {
        if (st.jumps.length === 0) status.textContent = 'Start: ' + st.frogStart;
        else status.textContent = st.frogStart + ' → ' + cur + '  (net: ' + (cur - st.frogStart) + ')';
    }
}

function nlFrogSetStart(inp) {
    var toolId = nlGetToolId(inp);
    if (!toolId || !nlState[toolId]) return;
    var v = parseFloat(inp.value);
    if (isNaN(v)) return;
    nlState[toolId].frogStart = v;
    nlState[toolId].jumps = [];
    nlRender(toolId);
}

function nlFrogAddJump(btn) {
    var widget = nlGetWidget(btn);
    var toolId = nlGetToolId(btn);
    if (!toolId || !nlState[toolId]) return;
    var valInp = widget.querySelector('.nl-jump-input');
    var signSel = widget.querySelector('.nl-jump-sign');
    if (!valInp) return;
    var val = parseFloat(valInp.value);
    if (isNaN(val) || val === 0) return;
    var sign = signSel ? signSel.value : '+';
    var delta = sign === '-' ? -Math.abs(val) : Math.abs(val);
    nlState[toolId].jumps.push({ delta: delta });
    valInp.value = '';
    nlRender(toolId);
}

function nlFrogClear(btn) {
    var toolId = nlGetToolId(btn);
    if (!toolId || !nlState[toolId]) return;
    nlState[toolId].jumps = [];
    nlRender(toolId);
}

function nlFrogRemoveJump(idx, el) {
    var toolId = nlGetToolId(el);
    if (!toolId || !nlState[toolId]) return;
    nlState[toolId].jumps.splice(idx, 1);
    nlRender(toolId);
}

// --- ZOOM / ROUNDING MODE ---
function nlZoomRender(widget, toolId) {
    var st = nlState[toolId];
    var container = widget.querySelector('.nl-panel-zoom .nl-svg-container');
    if (!container) return;

    var roundTo = st.roundTo;
    var v = st.zoomValue;
    var lo = Math.floor(v / roundTo) * roundTo;
    var hi = lo + roundTo;

    var highlights = [];
    if (st.zoomedIn) {
        // zoomed in: show lo to hi range with tick every 1
        var denom = 1;
        var markerN = v - lo; // position within range as integer
        var totalN = roundTo;
        // highlight lo and hi markers
        highlights.push({ from: lo, to: lo, color: '#3498db' });
        highlights.push({ from: hi, to: hi, color: '#3498db' });

        container.innerHTML = nlBuildLine({
            rangeStart: lo, rangeEnd: hi,
            denominator: denom,
            markerNumerator: markerN,
            showLabels: true,
            highlights: [
                { from: lo, to: lo + 0.01, color: '#3498db' },
                { from: hi - 0.01, to: hi, color: '#3498db' }
            ],
            markerColor: '#e74c3c',
            mode: 'zoom'
        });

        var q = widget.querySelector('.nl-zoom-question');
        if (q && !st.zoomAnswered) q.textContent = 'Is ' + v + ' closer to ' + lo + ' or ' + hi + '?';
        else if (q && st.zoomAnswered) q.textContent = st.zoomFeedback;

        var ab = widget.querySelector('.nl-zoom-answer-btns');
        if (ab) ab.style.display = st.zoomAnswered ? 'none' : 'flex';

        var ans0 = widget.querySelector('.nl-zoom-btn-lo');
        if (ans0) ans0.textContent = String(lo);
        var ans1 = widget.querySelector('.nl-zoom-btn-hi');
        if (ans1) ans1.textContent = String(hi);

        var fb = widget.querySelector('.nl-feedback');
        if (fb) { fb.textContent = st.zoomAnswered ? st.zoomFeedback : ''; fb.className = 'nl-feedback' + (st.zoomAnswered ? (st.zoomCorrect ? ' correct' : ' wrong') : ''); }
    } else {
        // zoomed out: 0 to roundTo*10 (0-100 or 0-1000)
        var maxV = roundTo === 10 ? 100 : 1000;
        var dz = maxV / roundTo; // number of major divisions = 10
        var posN = Math.round((v / maxV) * (maxV / roundTo) * roundTo); // numerator in ticks of size roundTo
        // actually just show whole-number scale
        container.innerHTML = nlBuildLine({
            rangeStart: 0, rangeEnd: maxV,
            denominator: 1,
            markerNumerator: Math.round((v / maxV) * maxV), // position = v itself mapped
            showLabels: true,
            markerColor: '#e74c3c',
            mode: 'zoom',
            // override: we want ticks every roundTo, so set denominator=1 and range 0..maxV
            // but we want 10 ticks → denominator trick: show 0..10 with labels ×roundTo
            _customRange: true
        });

        // Re-render with correct tick spacing
        container.innerHTML = nlBuildLineZoomOut(v, roundTo);

        var q = widget.querySelector('.nl-zoom-question');
        if (q) q.textContent = 'Click near ' + v + ' to zoom in!';

        var ab = widget.querySelector('.nl-zoom-answer-btns');
        if (ab) ab.style.display = 'none';

        var fb = widget.querySelector('.nl-feedback');
        if (fb) { fb.textContent = ''; fb.className = 'nl-feedback'; }
    }

    // sync input
    var inp = widget.querySelector('.nl-number-input');
    if (inp && document.activeElement !== inp) inp.value = String(v);
    var sel = widget.querySelector('.nl-roundto-select');
    if (sel) sel.value = String(roundTo);
}

function nlBuildLineZoomOut(v, roundTo) {
    // Draws a number line from 0 to maxV with ticks every roundTo
    var maxV = roundTo === 10 ? 100 : 1000;
    var numTicks = maxV / roundTo; // = 10
    var x0 = NL_X0, x1 = NL_X1, y = NL_Y;
    var span = x1 - x0;
    var markerX = x0 + (v / maxV) * span;

    var parts = [];
    parts.push('<svg class="nl-svg" viewBox="0 0 ' + NL_W + ' ' + NL_H + '" onclick="nlZoomSvgClick(this,event)" xmlns="http://www.w3.org/2000/svg">');
    parts.push('<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" stroke="var(--text-primary)" stroke-width="2"/>');
    parts.push('<polygon points="' + x1 + ',' + y + ' ' + (x1-8) + ',' + (y-4) + ' ' + (x1-8) + ',' + (y+4) + '" fill="var(--text-primary)"/>');

    for (var i = 0; i <= numTicks; i++) {
        var tx = x0 + (i / numTicks) * span;
        parts.push('<line x1="' + tx + '" y1="' + (y-16) + '" x2="' + tx + '" y2="' + (y+6) + '" stroke="var(--text-secondary)" stroke-width="1.5"/>');
        parts.push('<text x="' + tx + '" y="' + (y+20) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-primary)">' + (i * roundTo) + '</text>');
    }

    // highlight the zone
    var lo = Math.floor(v / roundTo) * roundTo;
    var hi = lo + roundTo;
    var zx0 = x0 + (lo / maxV) * span;
    var zx1 = x0 + (hi / maxV) * span;
    parts.push('<rect x="' + zx0 + '" y="' + (y-16) + '" width="' + (zx1-zx0) + '" height="22" fill="#e74c3c" opacity="0.12" rx="2"/>');

    // marker
    parts.push('<line x1="' + markerX + '" y1="' + (y-20) + '" x2="' + markerX + '" y2="' + (y+6) + '" stroke="#e74c3c" stroke-width="2.5"/>');
    parts.push('<polygon points="' + markerX + ',' + (y-20) + ' ' + (markerX+14) + ',' + (y-28) + ' ' + (markerX+14) + ',' + (y-12) + '" fill="#e74c3c" opacity="0.85"/>');
    parts.push('<text x="' + markerX + '" y="' + (y-32) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#e74c3c">' + v + '</text>');
    parts.push('</svg>');
    return parts.join('');
}

function nlZoomSvgClick(svgEl, event) {
    var toolId = nlGetToolId(svgEl);
    if (!toolId || !nlState[toolId]) return;
    var st = nlState[toolId];
    if (st.zoomedIn) {
        st.zoomedIn = false;
        st.zoomAnswered = false;
        st.zoomFeedback = '';
    } else {
        st.zoomedIn = true;
        st.zoomAnswered = false;
        st.zoomFeedback = '';
    }
    nlRender(toolId);
}

function nlZoomSetValue(inp) {
    var toolId = nlGetToolId(inp);
    if (!toolId || !nlState[toolId]) return;
    var v = parseInt(inp.value);
    if (isNaN(v)) return;
    var maxV = nlState[toolId].roundTo === 10 ? 99 : 999;
    v = Math.max(1, Math.min(maxV, v));
    nlState[toolId].zoomValue = v;
    nlState[toolId].zoomedIn = false;
    nlState[toolId].zoomAnswered = false;
    nlState[toolId].zoomFeedback = '';
    nlRender(toolId);
}

function nlZoomSetRoundTo(sel) {
    var toolId = nlGetToolId(sel);
    if (!toolId || !nlState[toolId]) return;
    nlState[toolId].roundTo = parseInt(sel.value);
    nlState[toolId].zoomedIn = false;
    nlState[toolId].zoomAnswered = false;
    nlState[toolId].zoomFeedback = '';
    nlRender(toolId);
}

function nlZoomAnswer(btn, answer) {
    var toolId = nlGetToolId(btn);
    if (!toolId || !nlState[toolId]) return;
    var st = nlState[toolId];
    var v = st.zoomValue, rt = st.roundTo;
    var lo = Math.floor(v / rt) * rt;
    var hi = lo + rt;
    var correct = (v - lo < hi - v) ? lo : (hi - v < v - lo ? hi : (v % rt === rt/2 ? hi : lo));
    // Standard rounding: if exactly halfway, round up
    var mid = lo + rt / 2;
    var correctAns = v < mid ? lo : hi;
    var chosen = parseInt(answer);
    st.zoomAnswered = true;
    st.zoomCorrect = (chosen === correctAns);
    st.zoomFeedback = st.zoomCorrect ? '✅ Correct! ' + v + ' rounds to ' + correctAns : '❌ ' + v + ' is closer to ' + correctAns;
    nlRender(toolId);
}

// --- GAME MODE ---
function nlGameNew(btn) {
    var toolId = nlGetToolId(btn);
    if (!toolId || !nlState[toolId]) return;
    var st = nlState[toolId];
    var d = st.gameDenominator; // always use the player's chosen denominator
    var n = Math.floor(Math.random() * (d - 1)) + 1; // 1..d-1
    st.secretDenominator = d;
    st.secretNumerator = n;
    st.gameNumerator = -1;
    st.gameRevealed = false;
    st.gameFeedback = '';
    nlRender(toolId);
}

function nlGameSetDenom(sel) {
    var toolId = nlGetToolId(sel);
    if (!toolId || !nlState[toolId]) return;
    nlState[toolId].gameDenominator = parseInt(sel.value);
    nlState[toolId].gameNumerator = -1;
    nlState[toolId].gameFeedback = '';
    nlState[toolId].gameRevealed = false;
    nlRender(toolId);
}

function nlGameRender(widget, toolId) {
    var st = nlState[toolId];
    var container = widget.querySelector('.nl-panel-game .nl-svg-container');
    if (!container) return;

    var sd = st.secretDenominator, sn = st.secretNumerator;
    var gd = st.gameDenominator;
    var secretPos = sn / sd; // 0..1 within 0-1 range

    // We show range 0..1, user picks denominator for their ticks
    container.innerHTML = nlGameBuildSvg(st);

    // feedback
    var fb = widget.querySelector('.nl-feedback');
    if (fb) {
        fb.textContent = st.gameFeedback;
        fb.className = 'nl-feedback' + (st.gameFeedback.startsWith('✅') ? ' correct' : st.gameFeedback.startsWith('❌') ? ' wrong' : '');
    }

    var scoreEl = widget.querySelector('.nl-score');
    if (scoreEl) scoreEl.textContent = 'Score: ' + st.gameScore.correct + ' / ' + st.gameScore.total;

    // hint label — always shows the challenge fraction so the goal is clear
    var hint = widget.querySelector('.nl-game-hint');
    if (hint) {
        if (st.gameRevealed) {
            hint.textContent = '';
            hint.style.fontWeight = 'normal';
            hint.style.color = 'var(--text-muted)';
        } else if (st.gameNumerator >= 0) {
            hint.textContent = 'Find ' + sn + '/' + sd + ' — your flag is at ' + st.gameNumerator + '/' + gd + ' — press Check!';
            hint.style.fontWeight = '600';
            hint.style.color = 'var(--text-primary)';
        } else {
            hint.textContent = 'Find ' + sn + '/' + sd + ' — tap a tick to place your flag 🚩';
            hint.style.fontWeight = '700';
            hint.style.color = 'var(--text-primary)';
        }
    }

    // sync denom select
    var sel = widget.querySelector('.nl-game-denom');
    if (sel) sel.value = String(gd);
}

function nlGameBuildSvg(st) {
    var gd = st.gameDenominator;
    var sd = st.secretDenominator, sn = st.secretNumerator;
    var x0 = NL_X0, x1 = NL_X1, y = NL_Y, span = x1 - x0;
    var secretX = x0 + (sn / sd) * span;
    var parts = [];
    parts.push('<svg class="nl-svg" viewBox="0 0 ' + NL_W + ' ' + NL_H + '" onclick="nlSvgClick(this,event)" xmlns="http://www.w3.org/2000/svg">');
    parts.push('<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" stroke="var(--text-primary)" stroke-width="2"/>');
    parts.push('<polygon points="' + x1 + ',' + y + ' ' + (x1-8) + ',' + (y-4) + ' ' + (x1-8) + ',' + (y+4) + '" fill="var(--text-primary)"/>');

    // user's denominator ticks (no labels — blank line challenge)
    for (var n = 0; n <= gd; n++) {
        var tx = x0 + (n / gd) * span;
        var isWhole = (n === 0 || n === gd);
        parts.push('<line x1="' + tx + '" y1="' + (y - (isWhole?16:10)) + '" x2="' + tx + '" y2="' + (y+6) + '" stroke="var(--text-secondary)" stroke-width="' + (isWhole?1.5:1) + '"/>');
        if (isWhole) parts.push('<text x="' + tx + '" y="' + (y+20) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-primary)">' + n + '</text>');
    }

    // secret chest — only revealed after the player checks their guess
    if (st.gameRevealed) {
        parts.push('<text x="' + secretX + '" y="' + (y-20) + '" text-anchor="middle" font-size="22">' + (st.gameFeedback.startsWith('✅') ? '✅' : '🎁') + '</text>');
    }

    // player flag
    if (st.gameNumerator >= 0) {
        var mx = x0 + (st.gameNumerator / gd) * span;
        var mc = st.gameRevealed ? (st.gameFeedback.startsWith('✅') ? '#27ae60' : '#e74c3c') : '#9b59b6';
        parts.push('<line x1="' + mx + '" y1="' + (y-16) + '" x2="' + mx + '" y2="' + (y+6) + '" stroke="' + mc + '" stroke-width="2.5"/>');
        parts.push('<polygon points="' + mx + ',' + (y-16) + ' ' + (mx+14) + ',' + (y-24) + ' ' + (mx+14) + ',' + (y-8) + '" fill="' + mc + '" opacity="0.85"/>');
        parts.push('<text x="' + (mx+7) + '" y="' + (y-28) + '" text-anchor="middle" font-size="10" fill="' + mc + '" font-weight="600">🚩</text>');
    }

    parts.push('</svg>');
    return parts.join('');
}

function nlGameCheck(btn) {
    var toolId = nlGetToolId(btn);
    if (!toolId || !nlState[toolId]) return;
    var st = nlState[toolId];
    if (st.gameNumerator < 0) { st.gameFeedback = 'Place your flag first!'; nlRender(toolId); return; }
    var gd = st.gameDenominator, gn = st.gameNumerator;
    var sd = st.secretDenominator, sn = st.secretNumerator;
    // compare as fractions: gn/gd === sn/sd → gn*sd === sn*gd
    var correct = (gn * sd === sn * gd);
    st.gameScore.total++;
    if (correct) { st.gameScore.correct++; st.gameFeedback = '✅ You found it! ' + sn + '/' + sd; }
    else { st.gameFeedback = '❌ Not quite! It was ' + sn + '/' + sd; }
    st.gameRevealed = true;
    nlRender(toolId);
}

// =============================================
// ANGLE EXPLORER
// =============================================

// Coordinate convention used throughout this section: x = cx + r*cos(rad), y = cy + r*sin(rad),
// with screen-Y pointing down, so 0deg points east and the angle increases clockwise on screen.
var angTickSvg = '';
(function() {
    var cx = 150, cy = 150, rOuter = 120, rInnerMajor = 108, rInnerMinor = 114, rLabel = 96;
    for (var deg = 0; deg < 360; deg += 10) {
        var isMajor = deg % 30 === 0;
        var rad = deg * Math.PI / 180;
        var x1 = cx + rOuter * Math.cos(rad);
        var y1 = cy + rOuter * Math.sin(rad);
        var rInner = isMajor ? rInnerMajor : rInnerMinor;
        var x2 = cx + rInner * Math.cos(rad);
        var y2 = cy + rInner * Math.sin(rad);
        var w = isMajor ? 2 : 1;
        angTickSvg += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="var(--text-muted)" stroke-width="' + w + '" stroke-linecap="round"/>';
        if (isMajor) {
            var lx = cx + rLabel * Math.cos(rad);
            var ly = cy + rLabel * Math.sin(rad);
            angTickSvg += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" dominant-baseline="central" class="ang-tick-label">' + deg + '</text>';
        }
    }
})();

var angState = {};

function angGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function angGetWidget(el) {
    return el.closest('.ang-widget');
}

function angComputeAngle(svgX, svgY, cx, cy) {
    var dx = svgX - cx;
    var dy = svgY - cy;
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    return angle;
}

function angArcPath(startDeg, sweepDeg, cx, cy, rBase, rGrowth) {
    if (sweepDeg <= 0.5) return '';
    var steps = Math.max(2, Math.ceil(sweepDeg / 4));
    var path = 'M ' + cx + ' ' + cy;
    for (var i = 0; i <= steps; i++) {
        var theta = sweepDeg * i / steps;
        var r = rBase + rGrowth * (theta / 360);
        var rad = (startDeg + theta) * Math.PI / 180;
        var x = cx + r * Math.cos(rad);
        var y = cy + r * Math.sin(rad);
        path += ' L ' + x.toFixed(2) + ' ' + y.toFixed(2);
    }
    path += ' Z';
    return path;
}

function angClassify(a) {
    var EPS = 0.5;
    var turns = Math.floor((a + EPS) / 360);
    var rem = a - turns * 360;
    if (rem < 0) rem = 0;
    var base = null;
    if (rem <= EPS || rem >= 360 - EPS) {
        base = null;
    } else if (Math.abs(rem - 90) <= EPS) {
        base = { label: 'Right Angle (90°)', cls: 'ang-arc-right' };
    } else if (Math.abs(rem - 180) <= EPS) {
        base = { label: 'Straight Angle (180°)', cls: 'ang-arc-straight' };
    } else if (rem < 90) {
        base = { label: 'Acute Angle', cls: 'ang-arc-acute' };
    } else if (rem < 180) {
        base = { label: 'Obtuse Angle', cls: 'ang-arc-obtuse' };
    } else {
        base = { label: 'Reflex Angle', cls: 'ang-arc-reflex' };
    }
    if (turns <= 0) return base || { label: 'Zero / Full Angle', cls: 'ang-arc-zero' };
    var turnLabel = turns === 1 ? 'Full Turn' : turns + ' Full Turns';
    if (!base) return { label: turnLabel + ' (' + a + '°)', cls: 'ang-arc-zero' };
    return { label: turnLabel + ' + ' + base.label, cls: base.cls };
}

function angInit() {
    document.querySelectorAll('.ang-widget').forEach(function(widget) {
        var toolId = angGetToolId(widget);
        if (!toolId) return;
        if (!angState[toolId]) angState[toolId] = { rayAngle: 45, dialRotation: 0, turns: 0, bigMode: false, snap: false, dragging: null };
        angRender(widget);
    });
}

function angRayDown(el, event) {
    event.preventDefault();
    var toolId = angGetToolId(el);
    if (!toolId || !angState[toolId]) return;
    angState[toolId].dragging = 'ray';
}

function angDialDown(el, event) {
    event.preventDefault();
    var toolId = angGetToolId(el);
    if (!toolId || !angState[toolId]) return;
    angState[toolId].dragging = 'dial';
}

function angSvgMove(svgEl, event) {
    var toolId = angGetToolId(svgEl);
    if (!toolId || !angState[toolId]) return;
    var st = angState[toolId];
    if (!st.dragging) return;
    event.preventDefault();
    var rect = svgEl.getBoundingClientRect();
    var point = event.touches ? event.touches[0] : event;
    var svgX = (point.clientX - rect.left) / rect.width * 300;
    var svgY = (point.clientY - rect.top) / rect.height * 300;
    var angle = angComputeAngle(svgX, svgY, 150, 150);
    if (st.snap) {
        angle = Math.round(angle / 5) * 5;
    } else {
        angle = Math.round(angle);
    }
    if (angle >= 360) angle -= 360;
    if (st.dragging === 'dial') {
        st.dialRotation = angle;
    } else {
        st.rayAngle = angle;
    }
    angRender(angGetWidget(svgEl));
}

function angSvgUp(svgEl, event) {
    var toolId = angGetToolId(svgEl);
    if (toolId && angState[toolId]) angState[toolId].dragging = null;
}

function angRender(widget) {
    var toolId = angGetToolId(widget);
    if (!toolId || !angState[toolId]) return;
    var st = angState[toolId];
    var cx = 150, cy = 150, arcR = 60, markerSize = 18, spiralGrowth = st.bigMode ? 18 : 0;

    var baseAngle = ((st.rayAngle - st.dialRotation) % 360 + 360) % 360;
    var totalAngle = st.turns * 360 + baseAngle;
    var info = angClassify(totalAngle);

    var dial = widget.querySelector('.ang-dial');
    if (dial) dial.setAttribute('transform', 'rotate(' + st.dialRotation + ',' + cx + ',' + cy + ')');

    var transform = 'rotate(' + st.rayAngle + ',' + cx + ',' + cy + ')';
    var movable = widget.querySelector('.ang-ray-movable');
    var grab = widget.querySelector('.ang-ray-grab');
    if (movable) movable.setAttribute('transform', transform);
    if (grab) grab.setAttribute('transform', transform);

    var skater = widget.querySelector('.ang-skater');
    if (skater) skater.setAttribute('transform', 'rotate(' + totalAngle + ',30,30)');

    var arc = widget.querySelector('.ang-arc');
    if (arc) {
        arc.setAttribute('d', angArcPath(0, totalAngle, cx, cy, arcR, spiralGrowth));
        arc.setAttribute('class', 'ang-arc ' + info.cls);
    }

    var readout = widget.querySelector('.ang-readout');
    if (readout) readout.textContent = totalAngle + '°';

    var typeLabel = widget.querySelector('.ang-type-label');
    if (typeLabel) {
        typeLabel.textContent = info.label;
        typeLabel.className = 'ang-type-label ' + info.cls.replace('ang-arc-', 'ang-type-');
    }

    var marker = widget.querySelector('.ang-right-marker');
    if (marker) {
        var EPS = 0.5;
        var rem = totalAngle % 360;
        if (Math.abs(rem - 90) <= EPS) {
            marker.setAttribute('x', cx);
            marker.setAttribute('y', cy);
            marker.style.display = '';
        } else if (Math.abs(rem - 270) <= EPS) {
            marker.setAttribute('x', cx);
            marker.setAttribute('y', cy - markerSize);
            marker.style.display = '';
        } else {
            marker.style.display = 'none';
        }
    }

    var turnBtn = widget.querySelector('.ang-turn-btn');
    if (turnBtn) {
        turnBtn.textContent = st.turns ? '− Remove extra turn (360°)' : '+ Add extra turn (360°)';
        turnBtn.disabled = !st.bigMode;
    }
}

function angToggleSnap(checkbox) {
    var widget = angGetWidget(checkbox);
    var toolId = angGetToolId(checkbox);
    if (!toolId || !angState[toolId]) return;
    var st = angState[toolId];
    st.snap = checkbox.checked;
    if (st.snap) {
        st.rayAngle = Math.round(st.rayAngle / 5) * 5 % 360;
        st.dialRotation = Math.round(st.dialRotation / 5) * 5 % 360;
    }
    angRender(widget);
}

function angToggleBigMode(checkbox) {
    var widget = angGetWidget(checkbox);
    var toolId = angGetToolId(checkbox);
    if (!toolId || !angState[toolId]) return;
    var st = angState[toolId];
    st.bigMode = checkbox.checked;
    if (!st.bigMode) st.turns = 0;
    angRender(widget);
}

function angAddTurn(btn) {
    var widget = angGetWidget(btn);
    var toolId = angGetToolId(btn);
    if (!toolId || !angState[toolId]) return;
    var st = angState[toolId];
    if (!st.bigMode) return;
    st.turns = st.turns ? 0 : 1;
    angRender(widget);
}

function angResetDial(btn) {
    var widget = angGetWidget(btn);
    var toolId = angGetToolId(btn);
    if (!toolId || !angState[toolId]) return;
    angState[toolId].dialRotation = 0;
    angRender(widget);
}

// =============================================
// HISTORY TIMELINE
// =============================================

var TL_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var TL_DEFAULT_CATEGORIES = [
    { id: 'tl_default_politics', name: 'Politics', color: '#3498db' },
    { id: 'tl_default_war', name: 'War', color: '#e74c3c' },
    { id: 'tl_default_science', name: 'Science & Tech', color: '#2ecc71' },
    { id: 'tl_default_culture', name: 'Culture', color: '#9b59b6' },
    { id: 'tl_default_economy', name: 'Economy', color: '#f1c40f' },
    { id: 'tl_default_religion', name: 'Religion', color: '#1abc9c' },
    { id: 'tl_default_exploration', name: 'Exploration', color: '#e67e22' },
    { id: 'tl_default_disasters', name: 'Disasters', color: '#95a5a6' },
    { id: 'tl_default_personal', name: 'Personal', color: '#2980b9' },
    { id: 'tl_default_career', name: 'Career', color: '#d35400' },
    { id: 'tl_default_travel', name: 'Travel', color: '#16a085' },
    { id: 'tl_default_milestones', name: 'Milestones', color: '#8e44ad' }
];

var TL_DEFAULT_ERAS = [
    { id: 'tl_default_prehistory', label: 'Prehistory', startYear: -3300000, endYear: -3000, color: '#7f8c8d', type: 'historical' },
    { id: 'tl_default_ancient', label: 'Ancient History', startYear: -3000, endYear: 500, color: '#f39c12', type: 'historical' },
    { id: 'tl_default_medieval', label: 'Middle Ages', startYear: 500, endYear: 1500, color: '#16a085', type: 'historical' },
    { id: 'tl_default_early_modern', label: 'Early Modern Period', startYear: 1500, endYear: 1800, color: '#9b59b6', type: 'historical' },
    { id: 'tl_default_late_modern', label: 'Late Modern Period', startYear: 1800, endYear: 1945, color: '#c0392b', type: 'historical' },
    { id: 'tl_default_contemporary', label: 'Contemporary History', startYear: 1945, endYear: 9999, color: '#34495e', type: 'historical' }
];

var TL_ERA_TYPES = [
    { id: 'historical', label: 'Historical' },
    { id: 'archaeological', label: 'Archaeological' },
    { id: 'geological', label: 'Geological' },
    { id: 'cosmological', label: 'Cosmological' }
];

var TL_ERA_PRESETS = {
    historical: [
        { label: 'Ancient History', startYear: -3000, endYear: 476, color: '#f39c12', type: 'historical' },
        { label: 'Middle Ages', startYear: 476, endYear: 1500, color: '#16a085', type: 'historical' },
        { label: 'Early Modern Period', startYear: 1500, endYear: 1789, color: '#9b59b6', type: 'historical' },
        { label: 'Late Modern Period', startYear: 1789, endYear: 1945, color: '#c0392b', type: 'historical' },
        { label: 'Contemporary Period', startYear: 1945, endYear: 9999, color: '#34495e', type: 'historical' }
    ],
    archaeological: [
        { label: 'Stone Age', startYear: -3400000, endYear: -3300, color: '#7f8c8d', type: 'archaeological' },
        { label: 'Bronze Age', startYear: -3300, endYear: -1200, color: '#d35400', type: 'archaeological' },
        { label: 'Iron Age', startYear: -1200, endYear: -500, color: '#34495e', type: 'archaeological' }
    ],
    geological: [
        { label: 'Paleozoic Era', startYear: -541000000, endYear: -252000000, color: '#27ae60', type: 'geological' },
        { label: 'Mesozoic Era', startYear: -252000000, endYear: -66000000, color: '#2980b9', type: 'geological' },
        { label: 'Cenozoic Era', startYear: -66000000, endYear: 9999, color: '#e67e22', type: 'geological' }
    ],
    cosmological: [
        { label: 'Radiation Era', startYear: -13800000000, endYear: -13799953000, color: '#8e44ad', type: 'cosmological' },
        { label: 'Matter Era', startYear: -13799953000, endYear: -4000000000, color: '#2c3e50', type: 'cosmological' },
        { label: 'Dark Energy Era', startYear: -4000000000, endYear: 9999, color: '#1abc9c', type: 'cosmological' }
    ]
};

function tlEraTypeOptionsHtml(selected) {
    return TL_ERA_TYPES.map(function(t) {
        return '<option value="' + t.id + '"' + (t.id === selected ? ' selected' : '') + '>' + t.label + '</option>';
    }).join('');
}

function tlGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function tlGetWidget(el) {
    return el.closest('.tl-widget');
}

function tlGetData(toolId) {
    var custom = toolCustomizations[toolId] || {};
    var data = custom.timeline || {};
    return {
        events: data.events || [],
        categories: data.categories || [],
        eras: data.eras || [],
        showEras: data.showEras !== false
    };
}

function tlSaveData(toolId, data) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].timeline = data;
    saveToolCustomizations(toolCustomizations);
}

function tlInit() {
    document.querySelectorAll('.tl-widget').forEach(function(widget) {
        var toolId = tlGetToolId(widget);
        if (!toolId) return;
        var custom = toolCustomizations[toolId] || {};
        if (!custom.timeline) {
            tlSaveData(toolId, {
                events: [],
                categories: JSON.parse(JSON.stringify(TL_DEFAULT_CATEGORIES)),
                eras: JSON.parse(JSON.stringify(TL_DEFAULT_ERAS)),
                showEras: true
            });
        }
        tlRender(widget, toolId);
    });
}

function tlGenId() {
    return 'tl_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function tlSafeColor(color, fallback) {
    return (typeof color === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(color)) ? color : fallback;
}

function tlClosePanels(widget) {
    widget.querySelectorAll('.tl-panel.open').forEach(function(panel) { panel.classList.remove('open'); });
    widget.querySelectorAll('.tl-toolbar-btn.active').forEach(function(b) { b.classList.remove('active'); });
}

function tlFormatSingleDate(year, month, day) {
    var isBce = year < 0;
    var absYear = Math.abs(year);
    var suffix = isBce ? ' BCE' : '';
    if (month) {
        var monthName = TL_MONTH_NAMES[month - 1];
        if (day) return monthName + ' ' + day + ', ' + absYear + suffix;
        return monthName + ' ' + absYear + suffix;
    }
    return absYear + suffix;
}

function tlFormatDate(event) {
    var start = tlFormatSingleDate(event.year, event.month, event.day);
    if (event.toYear == null) return start;
    return start + '–' + tlFormatSingleDate(event.toYear, event.toMonth, event.toDay);
}

function tlFormatEraYear(year) {
    var abs = Math.abs(year);
    var str = abs >= 10000 ? abs.toLocaleString() : String(abs);
    return year < 0 ? str + ' BCE' : str;
}

function tlFormatEraRange(era) {
    var end = era.endYear >= 9999 ? 'Present' : tlFormatEraYear(era.endYear);
    return tlFormatEraYear(era.startYear) + '–' + end;
}

function tlContrastColor(hex) {
    var c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(function(ch) { return ch + ch; }).join('');
    if (c.length < 6) return '#000';
    var r = parseInt(c.substr(0, 2), 16);
    var g = parseInt(c.substr(2, 2), 16);
    var b = parseInt(c.substr(4, 2), 16);
    var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.55 ? '#000' : '#fff';
}

function tlSortEvents(events) {
    return events.slice().sort(function(a, b) {
        if (a.year !== b.year) return a.year - b.year;
        var am = a.month || 0, bm = b.month || 0;
        if (am !== bm) return am - bm;
        return (a.day || 0) - (b.day || 0);
    });
}

function tlFindEraForEvent(eras, event) {
    for (var i = 0; i < eras.length; i++) {
        if (event.year >= eras[i].startYear && event.year <= eras[i].endYear) return eras[i];
    }
    return null;
}

function tlGetCategoryById(categories, categoryId) {
    if (!categoryId) return null;
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].id === categoryId) return categories[i];
    }
    return null;
}

function tlRender(widget, toolId) {
    var data = tlGetData(toolId);
    var sorted = tlSortEvents(data.events);
    var lineEl = widget.querySelector('.tl-line');
    if (!lineEl) return;

    if (sorted.length === 0) {
        lineEl.innerHTML = '<div class="tl-empty">No events yet. Click "+ Add Event" to get started.</div>';
    } else {
        var html = '';
        var lastEraId = null;
        sorted.forEach(function(event) {
            var era = tlFindEraForEvent(data.eras, event);
            var eraId = era ? era.id : null;
            if (data.showEras && eraId !== null && eraId !== lastEraId) {
                html += tlRenderEraBanner(era);
            }
            lastEraId = eraId;
            html += tlRenderEvent(event, data.categories);
        });
        lineEl.innerHTML = html;
    }

    tlPopulateCategorySelect(widget, toolId);
    if (widget.querySelector('.tl-category-manager.open')) tlRenderCategoryList(widget, toolId);
    if (widget.querySelector('.tl-era-manager.open')) tlRenderEraList(widget, toolId);
}

function tlRenderEraBanner(era) {
    var color = tlSafeColor(era.color, null);
    var style = color ? ' style="background:' + color + ';color:' + tlContrastColor(color) + '"' : '';
    return '<div class="tl-era-banner"' + style + '>' + escapeHtml(era.label) +
        ' <span class="tl-era-range">(' + tlFormatEraRange(era) + ')</span></div>';
}

function tlRenderEvent(event, categories) {
    var category = tlGetCategoryById(categories, event.categoryId);
    var color = category ? tlSafeColor(category.color, '#95a5a6') : null;
    var dotStyle = color ? ' style="background:' + color + '"' : '';
    var chip = category ? '<div class="tl-event-chip" style="background:' + color + '">' + escapeHtml(category.name) + '</div>' : '';
    var desc = event.description ? '<div class="tl-event-desc">' + parseMarkdown(event.description) + '</div>' : '';
    return '<div class="tl-event">' +
        '<div class="tl-event-dot-col"><div class="tl-event-dot"' + dotStyle + '></div></div>' +
        '<div class="tl-event-content">' +
            '<div class="tl-event-actions">' +
                '<button class="tl-icon-btn" onclick="tlEditEvent(this,\'' + event.id + '\')" title="Edit">✎</button>' +
                '<button class="tl-icon-btn delete" onclick="tlDeleteEvent(this,\'' + event.id + '\')" title="Delete">×</button>' +
            '</div>' +
            '<div class="tl-event-date">' + tlFormatDate(event) + '</div>' +
            '<div class="tl-event-title">' + escapeHtml(event.title) + '</div>' +
            desc +
            chip +
        '</div>' +
    '</div>';
}

function tlPopulateCategorySelect(widget, toolId) {
    var select = widget.querySelector('.tl-form-category');
    if (!select) return;
    var data = tlGetData(toolId);
    var current = select.value;
    select.innerHTML = '<option value="">(none)</option>' + data.categories.map(function(cat) {
        return '<option value="' + cat.id + '">' + escapeHtml(cat.name) + '</option>';
    }).join('');
    select.value = data.categories.some(function(c) { return c.id === current; }) ? current : '';
}

function tlOpenEventForm(btn) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    tlClosePanels(widget);
    var form = widget.querySelector('.tl-event-form');
    form.querySelector('.tl-form-event-id').value = '';
    form.querySelector('.tl-form-year').value = '';
    form.querySelector('.tl-form-month').value = '';
    form.querySelector('.tl-form-day').value = '';
    form.querySelector('.tl-form-to-year').value = '';
    form.querySelector('.tl-form-to-month').value = '';
    form.querySelector('.tl-form-to-day').value = '';
    form.querySelector('.tl-form-title').value = '';
    form.querySelector('.tl-form-textarea').value = '';
    tlPopulateCategorySelect(widget, toolId);
    form.querySelector('.tl-form-category').value = '';
    form.classList.add('open');
    if (btn.classList.contains('tl-toolbar-btn')) btn.classList.add('active');
}

function tlEditEvent(btn, eventId) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    var data = tlGetData(toolId);
    var event = data.events.find(function(e) { return e.id === eventId; });
    if (!event) return;
    tlClosePanels(widget);
    var form = widget.querySelector('.tl-event-form');
    form.querySelector('.tl-form-event-id').value = event.id;
    form.querySelector('.tl-form-year').value = event.year;
    form.querySelector('.tl-form-month').value = event.month || '';
    form.querySelector('.tl-form-day').value = event.day || '';
    form.querySelector('.tl-form-to-year').value = event.toYear != null ? event.toYear : '';
    form.querySelector('.tl-form-to-month').value = event.toMonth || '';
    form.querySelector('.tl-form-to-day').value = event.toDay || '';
    form.querySelector('.tl-form-title').value = event.title || '';
    form.querySelector('.tl-form-textarea').value = event.description || '';
    tlPopulateCategorySelect(widget, toolId);
    var category = tlGetCategoryById(data.categories, event.categoryId);
    form.querySelector('.tl-form-category').value = category ? category.id : '';
    form.classList.add('open');
}

function tlCloseEventForm(btn) {
    var widget = tlGetWidget(btn);
    tlClosePanels(widget);
}

function tlSaveEvent(btn) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    var form = widget.querySelector('.tl-event-form');
    var yearInput = form.querySelector('.tl-form-year');
    var year = parseInt(yearInput.value, 10);
    if (isNaN(year)) {
        yearInput.focus();
        return;
    }
    var monthVal = form.querySelector('.tl-form-month').value;
    var dayVal = form.querySelector('.tl-form-day').value;
    var month = monthVal ? parseInt(monthVal, 10) : null;
    var day = dayVal ? parseInt(dayVal, 10) : null;
    var toYearVal = form.querySelector('.tl-form-to-year').value;
    var toYear = toYearVal !== '' ? parseInt(toYearVal, 10) : null;
    if (toYear !== null && isNaN(toYear)) toYear = null;
    var toMonthVal = form.querySelector('.tl-form-to-month').value;
    var toDayVal = form.querySelector('.tl-form-to-day').value;
    var toMonth = toYear !== null && toMonthVal ? parseInt(toMonthVal, 10) : null;
    var toDay = toYear !== null && toDayVal ? parseInt(toDayVal, 10) : null;
    if (toYear !== null && toYear < year) {
        var swapY = year, swapM = month, swapD = day;
        year = toYear; month = toMonth; day = toDay;
        toYear = swapY; toMonth = swapM; toDay = swapD;
    }
    var title = form.querySelector('.tl-form-title').value.trim();
    var description = form.querySelector('.tl-form-textarea').value;
    var categoryId = form.querySelector('.tl-form-category').value || null;
    var eventId = form.querySelector('.tl-form-event-id').value;

    var data = tlGetData(toolId);
    var eventObj = { id: eventId || tlGenId(), year: year, month: month, day: day, toYear: toYear, toMonth: toMonth, toDay: toDay, title: title || 'Untitled Event', description: description, categoryId: categoryId };
    if (eventId) {
        var idx = data.events.findIndex(function(e) { return e.id === eventId; });
        if (idx !== -1) data.events[idx] = eventObj;
        else data.events.push(eventObj);
    } else {
        data.events.push(eventObj);
    }
    tlSaveData(toolId, data);
    tlCloseEventForm(btn);
    tlRender(widget, toolId);
}

function tlDeleteEvent(btn, eventId) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    var data = tlGetData(toolId);
    data.events = data.events.filter(function(e) { return e.id !== eventId; });
    tlSaveData(toolId, data);
    tlRender(widget, toolId);
}

function tlToggleCategoryManager(btn) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    var panel = widget.querySelector('.tl-category-manager');
    var isOpen = panel.classList.contains('open');
    tlClosePanels(widget);
    if (!isOpen) {
        panel.classList.add('open');
        if (btn.classList.contains('tl-toolbar-btn')) btn.classList.add('active');
        tlRenderCategoryList(widget, toolId);
    }
}

function tlRenderCategoryList(widget, toolId) {
    var data = tlGetData(toolId);
    var listEl = widget.querySelector('.tl-cat-list');
    if (data.categories.length === 0) {
        listEl.innerHTML = '<div class="tl-empty">No categories yet.</div>';
        return;
    }
    listEl.innerHTML = data.categories.map(function(cat) {
        return '<div class="tl-cat-row">' +
            '<input type="color" value="' + tlSafeColor(cat.color, '#3498db') + '" onchange="tlSetCategoryColor(this,\'' + cat.id + '\')">' +
            '<input type="text" value="' + escapeHtml(cat.name) + '" onchange="tlRenameCategory(this,\'' + cat.id + '\')">' +
            '<button class="tl-icon-btn delete" onclick="tlDeleteCategory(this,\'' + cat.id + '\')" title="Delete">×</button>' +
        '</div>';
    }).join('');
}

function tlAddCategory(btn) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    var nameInput = widget.querySelector('.tl-new-cat-name');
    var colorInput = widget.querySelector('.tl-new-cat-color');
    var name = nameInput.value.trim();
    if (!name) return;
    var data = tlGetData(toolId);
    data.categories.push({ id: tlGenId(), name: name, color: colorInput.value });
    tlSaveData(toolId, data);
    nameInput.value = '';
    colorInput.value = '#3498db';
    tlRenderCategoryList(widget, toolId);
    tlRender(widget, toolId);
}

function tlRenameCategory(input, categoryId) {
    var widget = tlGetWidget(input);
    var toolId = tlGetToolId(widget);
    var data = tlGetData(toolId);
    var category = tlGetCategoryById(data.categories, categoryId);
    if (!category) return;
    var name = input.value.trim();
    category.name = name || category.name;
    input.value = category.name;
    tlSaveData(toolId, data);
    tlRender(widget, toolId);
}

function tlSetCategoryColor(input, categoryId) {
    var widget = tlGetWidget(input);
    var toolId = tlGetToolId(widget);
    var data = tlGetData(toolId);
    var category = tlGetCategoryById(data.categories, categoryId);
    if (!category) return;
    category.color = input.value;
    tlSaveData(toolId, data);
    tlRender(widget, toolId);
}

function tlDeleteCategory(btn, categoryId) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    var data = tlGetData(toolId);
    data.categories = data.categories.filter(function(c) { return c.id !== categoryId; });
    data.events.forEach(function(e) {
        if (e.categoryId === categoryId) e.categoryId = null;
    });
    tlSaveData(toolId, data);
    tlRenderCategoryList(widget, toolId);
    tlRender(widget, toolId);
}

function tlToggleEraManager(btn) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    var panel = widget.querySelector('.tl-era-manager');
    var isOpen = panel.classList.contains('open');
    tlClosePanels(widget);
    if (!isOpen) {
        panel.classList.add('open');
        if (btn.classList.contains('tl-toolbar-btn')) btn.classList.add('active');
        tlRenderEraList(widget, toolId);
    }
}

function tlToggleShowEras(checkbox) {
    var widget = tlGetWidget(checkbox);
    var toolId = tlGetToolId(widget);
    var data = tlGetData(toolId);
    data.showEras = checkbox.checked;
    tlSaveData(toolId, data);
    tlRender(widget, toolId);
}

function tlRenderEraList(widget, toolId) {
    var data = tlGetData(toolId);
    var toggle = widget.querySelector('.tl-show-eras-toggle');
    if (toggle) toggle.checked = data.showEras;
    var listEl = widget.querySelector('.tl-era-list');
    if (data.eras.length === 0) {
        listEl.innerHTML = '<div class="tl-empty">No eras yet.</div>';
        return;
    }
    listEl.innerHTML = data.eras.map(function(era) {
        return '<div class="tl-era-row">' +
            '<input type="text" value="' + escapeHtml(era.label) + '" onchange="tlUpdateEraField(this,\'' + era.id + '\',\'label\')">' +
            '<input type="number" value="' + era.startYear + '" onchange="tlUpdateEraField(this,\'' + era.id + '\',\'startYear\')">' +
            '<input type="number" value="' + era.endYear + '" onchange="tlUpdateEraField(this,\'' + era.id + '\',\'endYear\')">' +
            '<select class="tl-era-type" onchange="tlUpdateEraField(this,\'' + era.id + '\',\'type\')">' + tlEraTypeOptionsHtml(era.type) + '</select>' +
            '<input type="color" value="' + tlSafeColor(era.color, '#9b59b6') + '" onchange="tlUpdateEraField(this,\'' + era.id + '\',\'color\')">' +
            '<button class="tl-icon-btn delete" onclick="tlDeleteEra(this,\'' + era.id + '\')" title="Delete">×</button>' +
        '</div>';
    }).join('');
}

function tlAddEra(btn) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    var labelInput = widget.querySelector('.tl-new-era-label');
    var startInput = widget.querySelector('.tl-new-era-start');
    var endInput = widget.querySelector('.tl-new-era-end');
    var typeSelect = widget.querySelector('.tl-new-era-type');
    var colorInput = widget.querySelector('.tl-new-era-color');
    var label = labelInput.value.trim();
    var start = parseInt(startInput.value, 10);
    var end = parseInt(endInput.value, 10);
    if (!label || isNaN(start) || isNaN(end)) return;
    if (start > end) { var tmp = start; start = end; end = tmp; }
    var data = tlGetData(toolId);
    data.eras.push({ id: tlGenId(), label: label, startYear: start, endYear: end, color: colorInput.value, type: typeSelect.value });
    tlSaveData(toolId, data);
    labelInput.value = '';
    startInput.value = '';
    endInput.value = '';
    colorInput.value = '#9b59b6';
    tlRenderEraList(widget, toolId);
    tlRender(widget, toolId);
}

function tlUpdateEraField(input, eraId, field) {
    var widget = tlGetWidget(input);
    var toolId = tlGetToolId(widget);
    var data = tlGetData(toolId);
    var era = null;
    for (var i = 0; i < data.eras.length; i++) {
        if (data.eras[i].id === eraId) { era = data.eras[i]; break; }
    }
    if (!era) return;
    if (field === 'startYear' || field === 'endYear') {
        var num = parseInt(input.value, 10);
        if (isNaN(num)) return;
        era[field] = num;
        if (era.startYear > era.endYear) {
            var tmp = era.startYear;
            era.startYear = era.endYear;
            era.endYear = tmp;
        }
    } else if (field === 'label') {
        era.label = input.value.trim() || era.label;
    } else if (field === 'color') {
        era.color = input.value;
    } else if (field === 'type') {
        era.type = input.value;
    }
    tlSaveData(toolId, data);
    tlRenderEraList(widget, toolId);
    tlRender(widget, toolId);
}

function tlDeleteEra(btn, eraId) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    var data = tlGetData(toolId);
    data.eras = data.eras.filter(function(e) { return e.id !== eraId; });
    tlSaveData(toolId, data);
    tlRenderEraList(widget, toolId);
    tlRender(widget, toolId);
}

function tlLoadEraPreset(btn) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    var select = widget.querySelector('.tl-era-preset-select');
    var preset = TL_ERA_PRESETS[select.value];
    if (!preset) return;
    if (!confirm('Replace the current eras with the ' + select.options[select.selectedIndex].text + ' preset?')) return;
    var data = tlGetData(toolId);
    data.eras = preset.map(function(era) {
        return { id: tlGenId(), label: era.label, startYear: era.startYear, endYear: era.endYear, color: era.color, type: era.type };
    });
    tlSaveData(toolId, data);
    tlRenderEraList(widget, toolId);
    tlRender(widget, toolId);
}

// =============================================
// SCRIPT INJECTION FOR HTML EXPORT
// =============================================

(function injectScriptsForExport() {
    if (document.getElementById('educational-tools-scripts')) return;

    var clockFunctions = [initClock, clockDrag, clockEndDrag, clockRender, clockSetNow, clockRandomize, clockClearChallenge, clockNewChallenge, clockCheckAnswer];
    var moneyFunctions = [moneyInit, moneyGetWidget, moneyRender, moneyAdd, moneyRemove, moneyClear, moneyTotal, moneyFormat, moneySetMode, moneyNewRound, moneyNewChallenge, moneyCheckAnswer, moneyNewChange, moneyNewNameit, moneyCheckNameit, moneyComputeOptimal, moneyNewLeast, moneyCheckLeast, moneyDragStart, moneyDragOver, moneyDragLeave, moneyDrop];
    var ptableFunctions = [ptableGetToolId, ptableGetWidget, ptableBuildGrid, ptableRender, ptableSelect, ptableSearch, ptableFilter, ptableInit];
    var sdtFunctions = [sdtGetToolId, sdtGetWidget, sdtInit, sdtSolveFor, sdtCalculate, sdtFormatNum, sdtClear, sdtKeydown];
    var multFunctions = [multGetToolId, multGetWidget, multInit, multSetTab, multRenderGrid, multSetMax, multSetHalf, multToggleHard, multCellHover, multCellOut, multRenderChallenge, multToggleDigit, multNextQuestion, multCheckAnswer, multSubmitChallenge, multUpdateScore, multNewChallenge];
    var nlFunctions = [nlGetToolId, nlGetWidget, nlDefaultState, nlInit, nlSetMode, nlRender, nlRenderWidget, nlTickLevel, nlBuildLine, nlBuildLineZoomOut, nlFractionRender, nlFractionSetDenom, nlFractionToggleLabels, nlFractionToggleBar, nlSvgClick, nlMarkerDown, nlSvgMove, nlSvgUp, nlFrogRender, nlFrogSetStart, nlFrogAddJump, nlFrogClear, nlFrogRemoveJump, nlZoomRender, nlZoomSvgClick, nlZoomSetValue, nlZoomSetRoundTo, nlZoomAnswer, nlGameNew, nlGameSetDenom, nlGameRender, nlGameBuildSvg, nlGameCheck];
    var angFunctions = [angGetToolId, angGetWidget, angComputeAngle, angArcPath, angClassify, angInit, angRayDown, angDialDown, angSvgMove, angSvgUp, angRender, angToggleSnap, angToggleBigMode, angAddTurn, angResetDial];
    var tlFunctions = [tlGetToolId, tlGetWidget, tlGetData, tlSaveData, tlInit, tlGenId, tlSafeColor, tlClosePanels, tlFormatSingleDate, tlFormatDate, tlFormatEraYear, tlFormatEraRange, tlContrastColor, tlEraTypeOptionsHtml, tlSortEvents, tlFindEraForEvent, tlGetCategoryById, tlRender, tlRenderEraBanner, tlRenderEvent, tlPopulateCategorySelect, tlOpenEventForm, tlEditEvent, tlCloseEventForm, tlSaveEvent, tlDeleteEvent, tlToggleCategoryManager, tlRenderCategoryList, tlAddCategory, tlRenameCategory, tlSetCategoryColor, tlDeleteCategory, tlToggleEraManager, tlRenderEraList, tlAddEra, tlUpdateEraField, tlDeleteEra, tlLoadEraPreset, tlToggleShowEras];
    var allFunctions = clockFunctions.concat(moneyFunctions).concat(ptableFunctions).concat(sdtFunctions).concat(multFunctions).concat(nlFunctions).concat(angFunctions).concat(tlFunctions);

    var code = '(function() {\n' +
        'if (typeof initClock !== "undefined") return;\n' +
        'window.clockState = ' + JSON.stringify(clockState) + ';\n' +
        'window.clockFaceSvg = ' + JSON.stringify(clockFaceSvg) + ';\n' +
        'window.MONEY_DENOMS = ' + JSON.stringify(MONEY_DENOMS) + ';\n' +
        'window.moneyState = ' + JSON.stringify(moneyState) + ';\n' +
        'window.PTABLE_ELEMENTS = ' + JSON.stringify(PTABLE_ELEMENTS) + ';\n' +
        'window.PTABLE_CATEGORIES = ' + JSON.stringify(PTABLE_CATEGORIES) + ';\n' +
        'window.ptableState = {};\n' +
        'window.sdtState = {};\n' +
        'window.MULT_HARD = new Set(' + JSON.stringify(Array.from(MULT_HARD)) + ');\n' +
        'window.multState = {};\n' +
        'window.nlState = {};\n' +
        'window.NL_X0 = 40; window.NL_X1 = 460; window.NL_Y = 75; window.NL_W = 500; window.NL_H = 130;\n' +
        'window.angTickSvg = ' + JSON.stringify(angTickSvg) + ';\n' +
        'window.angState = {};\n' +
        'window.TL_MONTH_NAMES = ' + JSON.stringify(TL_MONTH_NAMES) + ';\n' +
        'window.TL_DEFAULT_CATEGORIES = ' + JSON.stringify(TL_DEFAULT_CATEGORIES) + ';\n' +
        'window.TL_DEFAULT_ERAS = ' + JSON.stringify(TL_DEFAULT_ERAS) + ';\n' +
        'window.TL_ERA_TYPES = ' + JSON.stringify(TL_ERA_TYPES) + ';\n' +
        'window.TL_ERA_PRESETS = ' + JSON.stringify(TL_ERA_PRESETS) + ';\n' +
        'if (typeof escapeHtml === "undefined") { window.escapeHtml = ' + escapeHtml.toString() + '; }\n' +
        'if (typeof parseMarkdown === "undefined") { window.parseMarkdown = ' + parseMarkdown.toString() + '; }\n' +
        allFunctions.map(function(fn) { return 'window.' + fn.name + ' = ' + fn.toString(); }).join(';\n') + ';\n' +
        '})();';
    var encoded = btoa(unescape(encodeURIComponent(code)));

    var script = document.createElement('script');
    script.id = 'educational-tools-scripts';
    script.textContent = 'eval(decodeURIComponent(escape(atob("' + encoded + '"))))';
    (document.body || document.head).appendChild(script);
})();

// =============================================
// REGISTRATIONS
// =============================================

PluginRegistry.registerToolbox({
    id: 'educational-tools',
    name: 'Educational Tools',
    description: 'Learning and practice tools for kids and students',
    icon: '\uD83C\uDF93',
    color: '#2ecc71',
    version: '1.0.0',
    tools: ['analog-clock', 'money-counter', 'periodic-table', 'speed-distance-time', 'multiplication-table', 'number-line-explorer', 'angle-explorer', 'history-timeline'],
    source: 'external'
});

// Analog Clock Reader
PluginRegistry.registerTool({
    id: 'analog-clock',
    name: 'Analog Clock',
    description: 'Interactive analog clock for telling time practice',
    icon: '\uD83D\uDD70',
    version: '1.0.0',
    toolbox: 'educational-tools',
    tags: ['clock', 'time', 'analog', 'practice', 'learn', 'education'],
    title: 'Analog Clock',
    content: '<div class="clock-widget">' +
        '<div class="clock-face-container">' +
            '<svg id="clockSvg" class="clock-svg" viewBox="0 0 200 200">' +
                '<circle class="clock-face" cx="100" cy="100" r="92"/>' +
                clockFaceSvg +
                '<line id="clockHrHand" class="clock-hand-hr" x1="100" y1="100" x2="100" y2="42"/>' +
                '<line id="clockMinHand" class="clock-hand-min" x1="100" y1="100" x2="100" y2="22"/>' +
                '<line id="clockHrGrab" class="clock-hand-grab" x1="100" y1="100" x2="100" y2="42"/>' +
                '<line id="clockMinGrab" class="clock-hand-grab" x1="100" y1="100" x2="100" y2="22"/>' +
                '<circle class="clock-center-dot" cx="100" cy="100" r="4"/>' +
            '</svg>' +
        '</div>' +
        '<div id="clockDigital" class="clock-digital">12:00 AM</div>' +
        '<div class="clock-controls">' +
            '<button class="pomo-btn" onclick="clockSetNow()">Now</button>' +
            '<button class="pomo-btn" onclick="clockRandomize()">Random</button>' +
        '</div>' +
        '<div class="clock-section-title">PRACTICE</div>' +
        '<div id="clockTarget" class="clock-target" style="display:none"></div>' +
        '<div id="clockAnswerWrap" style="display:none;margin-bottom:6px;"><input type="text" id="clockAnswerInput" class="clock-answer-input" placeholder="H:MM AM/PM" onkeydown="if(event.key===\'Enter\')clockCheckAnswer()"></div>' +
        '<div class="clock-controls">' +
            '<select id="clockChallengeMode" class="clock-mode-select"><option value="set">Set the Clock</option><option value="read">Read the Clock</option></select>' +
            '<button class="pomo-btn primary paused" onclick="clockNewChallenge()">New Challenge</button>' +
            '<button id="clockCheckBtn" class="pomo-btn" onclick="clockCheckAnswer()" style="display:none">Check</button>' +
        '</div>' +
        '<div id="clockFeedback" class="clock-feedback"></div>' +
        '<div id="clockScore" class="clock-score"></div>' +
    '</div>',
    onInit: 'initClock',
    defaultWidth: 340,
    defaultHeight: 500,
    source: 'external'
});

// Money Counter
PluginRegistry.registerTool({
    id: 'money-counter',
    name: 'Money Counter',
    description: 'Learn to count US money with coins and bills \u2014 free play, challenge, make change, name it, and least coins modes',
    icon: '\uD83D\uDCB0',
    version: '1.0.0',
    toolbox: 'educational-tools',
    tags: ['money', 'coins', 'bills', 'counting', 'math', 'kids', 'education', 'currency'],
    title: 'Money Counter',
    content: '<div class="money-widget">' +
        '<div class="money-controls">' +
            '<div class="money-mode-buttons">' +
                '<button class="pomo-btn money-mode-btn active" onclick="moneySetMode(this,\'free\')">Free Play</button>' +
                '<button class="pomo-btn money-mode-btn" onclick="moneySetMode(this,\'challenge\')">Challenge</button>' +
                '<button class="pomo-btn money-mode-btn" onclick="moneySetMode(this,\'change\')">Make Change</button>' +
                '<button class="pomo-btn money-mode-btn" onclick="moneySetMode(this,\'nameit\')">Name It</button>' +
                '<button class="pomo-btn money-mode-btn" onclick="moneySetMode(this,\'least\')">Least Coins</button>' +
            '</div>' +
            '<button class="pomo-btn" onclick="moneyClear(this)">Clear</button>' +
        '</div>' +
        '<div class="money-challenge" style="display:none">' +
            '<div class="money-target"></div>' +
            '<div class="money-input-row" style="display:none;margin-top:6px;">' +
                '<span>$</span><input type="text" class="money-answer-input" placeholder="0.00">' +
            '</div>' +
            '<div style="margin-top:6px;">' +
                '<button class="pomo-btn money-new-btn" onclick="moneyNewRound(this)">New Challenge</button>' +
                '<button class="pomo-btn primary paused money-check-btn" onclick="moneyCheckAnswer(this)">Check</button>' +
            '</div>' +
            '<div class="money-feedback"></div>' +
            '<div class="money-score"></div>' +
        '</div>' +
        '<div class="money-tray">' +
            '<div class="money-coin money-coin-penny" data-denom="penny" onclick="moneyAdd(this)" draggable="true" ondragstart="moneyDragStart(event,\'penny\')">1\u00A2</div>' +
            '<div class="money-coin money-coin-nickel" data-denom="nickel" onclick="moneyAdd(this)" draggable="true" ondragstart="moneyDragStart(event,\'nickel\')">5\u00A2</div>' +
            '<div class="money-coin money-coin-dime" data-denom="dime" onclick="moneyAdd(this)" draggable="true" ondragstart="moneyDragStart(event,\'dime\')">10\u00A2</div>' +
            '<div class="money-coin money-coin-quarter" data-denom="quarter" onclick="moneyAdd(this)" draggable="true" ondragstart="moneyDragStart(event,\'quarter\')">25\u00A2</div>' +
            '<div class="money-bill money-bill-1" data-denom="bill1" onclick="moneyAdd(this)" draggable="true" ondragstart="moneyDragStart(event,\'bill1\')">$1</div>' +
            '<div class="money-bill money-bill-5" data-denom="bill5" onclick="moneyAdd(this)" draggable="true" ondragstart="moneyDragStart(event,\'bill5\')">$5</div>' +
            '<div class="money-bill money-bill-10" data-denom="bill10" onclick="moneyAdd(this)" draggable="true" ondragstart="moneyDragStart(event,\'bill10\')">$10</div>' +
            '<div class="money-bill money-bill-20" data-denom="bill20" onclick="moneyAdd(this)" draggable="true" ondragstart="moneyDragStart(event,\'bill20\')">$20</div>' +
        '</div>' +
        '<div class="money-mat" ondrop="moneyDrop(event)" ondragover="moneyDragOver(event)" ondragleave="moneyDragLeave(event)">' +
            '<div class="money-mat-empty">Click or drag coins and bills here</div>' +
            '<div class="money-mat-items"></div>' +
        '</div>' +
        '<div class="money-total">$0.00</div>' +
    '</div>',
    onInit: 'moneyInit',
    defaultWidth: 340,
    defaultHeight: 520,
    source: 'external'
});

// Periodic Table of Elements
PluginRegistry.registerTool({
    id: 'periodic-table',
    name: 'Periodic Table',
    description: 'Interactive periodic table of elements with search, category filtering, and detailed element information',
    icon: '\u269B',
    version: '1.0.0',
    toolbox: 'educational-tools',
    tags: ['periodic', 'table', 'elements', 'chemistry', 'science', 'education', 'atoms'],
    title: 'Periodic Table',
    content: '<div class="ptable-widget">' +
        '<div class="ptable-toolbar">' +
            '<input type="text" class="ptable-search" placeholder="Search elements..." oninput="ptableSearch(this)">' +
            '<select class="ptable-filter" onchange="ptableFilter(this)">' +
                '<option value="all">All Categories</option>' +
                '<option value="alkali">Alkali Metals</option>' +
                '<option value="alkaline">Alkaline Earth</option>' +
                '<option value="transition">Transition Metals</option>' +
                '<option value="post-transition">Post-Transition</option>' +
                '<option value="metalloid">Metalloids</option>' +
                '<option value="nonmetal">Nonmetals</option>' +
                '<option value="halogen">Halogens</option>' +
                '<option value="noble">Noble Gases</option>' +
                '<option value="lanthanide">Lanthanides</option>' +
                '<option value="actinide">Actinides</option>' +
            '</select>' +
        '</div>' +
        '<div class="ptable-detail"><div class="ptable-detail-placeholder">Click an element to see details</div></div>' +
        '<div class="ptable-grid-wrap"><div class="ptable-grid"></div></div>' +
        '<div class="ptable-legend">' +
            '<div class="ptable-legend-item"><div class="ptable-legend-dot ptable-cat-alkali"></div>Alkali</div>' +
            '<div class="ptable-legend-item"><div class="ptable-legend-dot ptable-cat-alkaline"></div>Alk. Earth</div>' +
            '<div class="ptable-legend-item"><div class="ptable-legend-dot ptable-cat-transition"></div>Transition</div>' +
            '<div class="ptable-legend-item"><div class="ptable-legend-dot ptable-cat-post-transition"></div>Post-Trans.</div>' +
            '<div class="ptable-legend-item"><div class="ptable-legend-dot ptable-cat-metalloid"></div>Metalloid</div>' +
            '<div class="ptable-legend-item"><div class="ptable-legend-dot ptable-cat-nonmetal"></div>Nonmetal</div>' +
            '<div class="ptable-legend-item"><div class="ptable-legend-dot ptable-cat-halogen"></div>Halogen</div>' +
            '<div class="ptable-legend-item"><div class="ptable-legend-dot ptable-cat-noble"></div>Noble Gas</div>' +
            '<div class="ptable-legend-item"><div class="ptable-legend-dot ptable-cat-lanthanide"></div>Lanthanide</div>' +
            '<div class="ptable-legend-item"><div class="ptable-legend-dot ptable-cat-actinide"></div>Actinide</div>' +
        '</div>' +
    '</div>',
    onInit: 'ptableInit',
    defaultWidth: 680,
    defaultHeight: 520,
    source: 'external'
});

// Speed/Distance/Time Calculator
PluginRegistry.registerTool({
    id: 'speed-distance-time',
    name: 'Speed/Distance/Time',
    description: 'Calculate speed, distance, or time given any two values with unit conversions',
    icon: '\uD83C\uDFCE',
    version: '1.0.0',
    toolbox: 'educational-tools',
    tags: ['speed', 'distance', 'time', 'calculator', 'physics', 'math', 'velocity', 'education'],
    title: 'Speed / Distance / Time',
    content: '<div class="sdt-widget">' +
        '<div class="sdt-formula">' +
            '<strong>Speed = Distance \u00F7 Time</strong> &nbsp;|&nbsp; ' +
            '<strong>Distance = Speed \u00D7 Time</strong> &nbsp;|&nbsp; ' +
            '<strong>Time = Distance \u00F7 Speed</strong>' +
        '</div>' +
        '<div style="font-size:12px;color:var(--text-muted);text-align:center;">Solve for:</div>' +
        '<div class="sdt-actions">' +
            '<button class="pomo-btn sdt-solve-btn" onclick="sdtSolveFor(this,\'speed\')">Speed</button>' +
            '<button class="pomo-btn sdt-solve-btn" onclick="sdtSolveFor(this,\'distance\')">Distance</button>' +
            '<button class="pomo-btn sdt-solve-btn" onclick="sdtSolveFor(this,\'time\')">Time</button>' +
        '</div>' +
        '<div class="sdt-fields">' +
            '<div class="sdt-field">' +
                '<span class="sdt-field-label">Speed</span>' +
                '<input type="number" class="sdt-field-input sdt-input-speed" placeholder="e.g. 60" onkeydown="sdtKeydown(event)">' +
                '<select class="sdt-field-unit sdt-unit-speed">' +
                    '<option value="kmh">km/h</option>' +
                    '<option value="mph">mph</option>' +
                    '<option value="ms">m/s</option>' +
                '</select>' +
            '</div>' +
            '<div class="sdt-field">' +
                '<span class="sdt-field-label">Distance</span>' +
                '<input type="number" class="sdt-field-input sdt-input-distance" placeholder="e.g. 120" onkeydown="sdtKeydown(event)">' +
                '<select class="sdt-field-unit sdt-unit-distance">' +
                    '<option value="km">km</option>' +
                    '<option value="mi">miles</option>' +
                    '<option value="m">meters</option>' +
                '</select>' +
            '</div>' +
            '<div class="sdt-field">' +
                '<span class="sdt-field-label">Time</span>' +
                '<input type="number" class="sdt-field-input sdt-input-time" placeholder="e.g. 2" onkeydown="sdtKeydown(event)">' +
                '<select class="sdt-field-unit sdt-unit-time">' +
                    '<option value="hr">hours</option>' +
                    '<option value="min">minutes</option>' +
                    '<option value="sec">seconds</option>' +
                '</select>' +
            '</div>' +
        '</div>' +
        '<div class="sdt-actions">' +
            '<button class="pomo-btn primary paused sdt-calc-btn" onclick="sdtCalculate(this)">Calculate</button>' +
            '<button class="pomo-btn" onclick="sdtClear(this)">Clear</button>' +
        '</div>' +
        '<div class="sdt-result-box">' +
            '<span style="color:var(--text-muted);font-size:13px;">Select what to solve for, fill in the other two values, then press Calculate</span>' +
        '</div>' +
    '</div>',
    onInit: 'sdtInit',
    defaultWidth: 660,
    defaultHeight: 460,
    source: 'external'
});

// Multiplication Table
PluginRegistry.registerTool({
    id: 'multiplication-table',
    name: 'Multiplication Table',
    description: 'Interactive multiplication grid with half-table toggle, hard-fact highlights, and quiz challenge mode',
    icon: '✖️',
    version: '1.0.0',
    toolbox: 'educational-tools',
    tags: ['multiplication', 'math', 'table', 'times', 'quiz', 'challenge', 'education'],
    title: 'Multiplication Table',
    content: '<div class="mult-widget">' +
        '<div class="mult-tabs">' +
            '<button class="mult-tab active" onclick="multSetTab(this,\'grid\')">📊 Grid</button>' +
            '<button class="mult-tab" onclick="multSetTab(this,\'challenge\')">🎯 Challenge</button>' +
        '</div>' +
        '<div class="mult-grid-panel">' +
            '<div class="mult-toolbar">' +
                '<label>Size:</label>' +
                '<select class="mult-size-select" onchange="multSetMax(this)">' +
                    '<option value="10" selected>10 × 10</option>' +
                    '<option value="12">12 × 12</option>' +
                    '<option value="15">15 × 15</option>' +
                    '<option value="20">20 × 20</option>' +
                '</select>' +
                '<button class="mult-half-btn" onclick="multSetHalf(this,\'full\')">Full</button>' +
                '<button class="mult-half-btn" onclick="multSetHalf(this,\'upper\')">▲ Upper</button>' +
                '<button class="mult-half-btn active" onclick="multSetHalf(this,\'lower\')">▼ Lower</button>' +
                '<button class="mult-hard-btn active" onclick="multToggleHard(this)">🔥 Hard</button>' +
            '</div>' +
            '<div class="mult-table-wrap"></div>' +
        '</div>' +
        '<div class="mult-challenge-panel">' +
            '<div>' +
                '<div class="mult-digit-label">PRACTICE NUMBERS</div>' +
                '<div class="mult-digit-row"></div>' +
            '</div>' +
            '<div class="mult-quiz-area">' +
                '<div class="mult-question"></div>' +
                '<div class="mult-answer-row">' +
                    '<input type="number" class="mult-answer-input" placeholder="?" onkeydown="if(event.key===\'Enter\')multCheckAnswer(this)">' +
                    '<button class="pomo-btn primary paused" onclick="multSubmitChallenge(this)">Check</button>' +
                '</div>' +
                '<div class="mult-feedback"></div>' +
                '<div class="mult-score">Score: 0 / 0</div>' +
                '<button class="pomo-btn" onclick="multNewChallenge(this)">Reset Score</button>' +
            '</div>' +
        '</div>' +
    '</div>',
    onInit: 'multInit',
    defaultWidth: 560,
    defaultHeight: 580,
    source: 'external'
});

// Number Line Explorer
PluginRegistry.registerTool({
    id: 'number-line-explorer',
    name: 'Number Line Explorer',
    description: 'Interactive number line for fractions, frog jumps, rounding, and a secret coordinate game — designed for 3rd grade math',
    icon: '📏',
    version: '1.0.0',
    toolbox: 'educational-tools',
    tags: ['number line', 'fractions', 'rounding', 'math', 'kids', 'education', 'jump', 'game', '3rd grade'],
    title: 'Number Line Explorer',
    content: '<div class="nl-widget">' +
        '<div class="nl-tabs">' +
            '<button class="nl-tab active" onclick="nlSetMode(this,\'fraction\')">🔢 Fractions</button>' +
            '<button class="nl-tab" onclick="nlSetMode(this,\'frog\')">🐸 Frog Jump</button>' +
            '<button class="nl-tab" onclick="nlSetMode(this,\'zoom\')">🔍 Rounding</button>' +
            '<button class="nl-tab" onclick="nlSetMode(this,\'game\')">🎮 Game</button>' +
        '</div>' +
        // Fraction panel
        '<div class="nl-panel nl-panel-fraction active">' +
            '<div class="nl-controls-row">' +
                '<label>Denominator:</label>' +
                '<select class="nl-denom-select" onchange="nlFractionSetDenom(this)">' +
                    '<option value="2">Halves (2)</option>' +
                    '<option value="3">Thirds (3)</option>' +
                    '<option value="4" selected>Quarters (4)</option>' +
                    '<option value="5">Fifths (5)</option>' +
                    '<option value="6">Sixths (6)</option>' +
                    '<option value="8">Eighths (8)</option>' +
                    '<option value="10">Tenths (10)</option>' +
                    '<option value="12">Twelfths (12)</option>' +
                '</select>' +
                '<button class="pomo-btn nl-labels-btn" onclick="nlFractionToggleLabels(this)">🔢 Labels: ON</button>' +
                '<button class="pomo-btn nl-bar-btn" onclick="nlFractionToggleBar(this)">📊 Bar: OFF</button>' +
            '</div>' +
            '<div class="nl-svg-container"></div>' +
            '<div class="nl-fraction-label">3 / 4</div>' +
        '</div>' +
        // Frog Jump panel
        '<div class="nl-panel nl-panel-frog">' +
            '<div class="nl-controls-row">' +
                '<label>Start:</label>' +
                '<input type="number" class="nl-number-input" value="0" onchange="nlFrogSetStart(this)" style="width:60px">' +
                '<label>Jump:</label>' +
                '<select class="nl-jump-sign"><option value="+">+</option><option value="-">−</option></select>' +
                '<input type="number" class="nl-jump-input" placeholder="amount" min="0" style="width:80px">' +
                '<button class="pomo-btn primary paused" onclick="nlFrogAddJump(this)">Add Jump</button>' +
                '<button class="pomo-btn" onclick="nlFrogClear(this)">Clear</button>' +
            '</div>' +
            '<div class="nl-jumps-list"></div>' +
            '<div class="nl-svg-container"></div>' +
            '<div class="nl-frog-status"></div>' +
        '</div>' +
        // Zoom/Rounding panel
        '<div class="nl-panel nl-panel-zoom">' +
            '<div class="nl-controls-row">' +
                '<label>Number:</label>' +
                '<input type="number" class="nl-number-input" value="63" min="1" max="999" onchange="nlZoomSetValue(this)">' +
                '<label>Round to nearest:</label>' +
                '<select class="nl-roundto-select" onchange="nlZoomSetRoundTo(this)">' +
                    '<option value="10">10</option>' +
                    '<option value="100">100</option>' +
                '</select>' +
            '</div>' +
            '<div class="nl-svg-container"></div>' +
            '<div class="nl-zoom-question"></div>' +
            '<div class="nl-zoom-answer-btns" style="display:none;justify-content:center;gap:12px;">' +
                '<button class="pomo-btn primary paused nl-zoom-btn-lo" onclick="nlZoomAnswer(this,this.textContent)">60</button>' +
                '<button class="pomo-btn primary paused nl-zoom-btn-hi" onclick="nlZoomAnswer(this,this.textContent)">70</button>' +
            '</div>' +
            '<div class="nl-feedback"></div>' +
        '</div>' +
        // Game panel
        '<div class="nl-panel nl-panel-game">' +
            '<div class="nl-controls-row">' +
                '<label>Your splits:</label>' +
                '<select class="nl-game-denom nl-denom-select" onchange="nlGameSetDenom(this)">' +
                    '<option value="2">Halves (2)</option>' +
                    '<option value="3">Thirds (3)</option>' +
                    '<option value="4" selected>Quarters (4)</option>' +
                    '<option value="5">Fifths (5)</option>' +
                    '<option value="6">Sixths (6)</option>' +
                    '<option value="8">Eighths (8)</option>' +
                '</select>' +
                '<button class="pomo-btn primary paused" onclick="nlGameNew(this)">🎲 New Game</button>' +
                '<button class="pomo-btn" onclick="nlGameCheck(this)">Check ✔</button>' +
            '</div>' +
            '<div class="nl-svg-container"></div>' +
            '<div class="nl-game-hint" style="text-align:center;font-size:12px;color:var(--text-muted);min-height:18px;"></div>' +
            '<div class="nl-feedback"></div>' +
            '<div class="nl-score"></div>' +
        '</div>' +
    '</div>',
    onInit: 'nlInit',
    defaultWidth: 600,
    defaultHeight: 400,
    source: 'external'
});

// Angle Explorer
PluginRegistry.registerTool({
    id: 'angle-explorer',
    name: 'Angle Explorer',
    description: 'Interactive protractor for exploring angles — drag a ray to measure 0-360° and learn acute, right, obtuse, straight, and reflex angle types',
    icon: '📐',
    version: '1.0.0',
    toolbox: 'educational-tools',
    tags: ['angle', 'protractor', 'geometry', 'degrees', 'math', 'kids', 'education'],
    title: 'Angle Explorer',
    content: '<div class="ang-widget">' +
        '<div class="ang-top-row">' +
        '<div class="ang-face-container">' +
            '<svg class="ang-svg" viewBox="0 0 300 300" onmousemove="angSvgMove(this,event)" onmouseup="angSvgUp(this,event)" onmouseleave="angSvgUp(this,event)" ontouchmove="angSvgMove(this,event)" ontouchend="angSvgUp(this,event)">' +
                '<g class="ang-dial" transform="rotate(0,150,150)">' +
                    '<circle class="ang-face" cx="150" cy="150" r="120"/>' +
                    '<path class="ang-arc" d=""/>' +
                    '<rect class="ang-right-marker" width="18" height="18" style="display:none"/>' +
                    '<line class="ang-ray-fixed" x1="150" y1="150" x2="260" y2="150"/>' +
                    '<circle class="ang-dial-handle" cx="278" cy="150" r="6"/>' +
                    '<circle class="ang-dial-handle-grab" cx="278" cy="150" r="15" onmousedown="angDialDown(this,event)" ontouchstart="angDialDown(this,event)"><title>Drag to rotate the protractor</title></circle>' +
                    angTickSvg +
                '</g>' +
                '<line class="ang-ray-movable" x1="150" y1="150" x2="260" y2="150"/>' +
                '<line class="ang-ray-grab" x1="150" y1="150" x2="260" y2="150" onmousedown="angRayDown(this,event)" ontouchstart="angRayDown(this,event)"/>' +
                '<circle class="ang-vertex" cx="150" cy="150" r="4"/>' +
            '</svg>' +
        '</div>' +
        '<div class="ang-skater-container">' +
            '<svg class="ang-skater-svg" viewBox="0 0 60 60">' +
                '<g class="ang-skater" transform="rotate(0,30,30)">' +
                    '<rect class="ang-skater-truck" x="10" y="48" width="6" height="2"/>' +
                    '<rect class="ang-skater-truck" x="44" y="48" width="6" height="2"/>' +
                    '<rect class="ang-skater-board" x="6" y="44" width="48" height="6" rx="3"/>' +
                    '<circle class="ang-skater-wheel" cx="14" cy="52" r="3.5"/>' +
                    '<circle class="ang-skater-wheel" cx="46" cy="52" r="3.5"/>' +
                    '<line class="ang-skater-leg" x1="28" y1="34" x2="18" y2="44"/>' +
                    '<line class="ang-skater-leg" x1="28" y1="34" x2="40" y2="44"/>' +
                    '<line class="ang-skater-body" x1="30" y1="18" x2="28" y2="34"/>' +
                    '<line class="ang-skater-arm" x1="29" y1="22" x2="14" y2="16"/>' +
                    '<line class="ang-skater-arm" x1="29" y1="24" x2="44" y2="30"/>' +
                    '<circle class="ang-skater-head" cx="30" cy="12" r="6"/>' +
                '</g>' +
            '</svg>' +
            '<div class="ang-skater-label">🛹 Spin!</div>' +
        '</div>' +
        '</div>' +
        '<div class="ang-readout">45°</div>' +
        '<div class="ang-type-label">Acute Angle</div>' +
        '<div class="ang-controls">' +
            '<label><input type="checkbox" class="ang-snap-checkbox" onchange="angToggleSnap(this)"> Snap to 5°</label>' +
            '<label><input type="checkbox" class="ang-big-checkbox" onchange="angToggleBigMode(this)"> Angles over 360°</label>' +
        '</div>' +
        '<div class="ang-controls">' +
            '<button class="ang-turn-btn" onclick="angAddTurn(this)" disabled>+ Add extra turn (360°)</button>' +
            '<button class="ang-reset-btn" onclick="angResetDial(this)">Reset protractor</button>' +
        '</div>' +
    '</div>',
    onInit: 'angInit',
    defaultWidth: 380,
    defaultHeight: 520,
    source: 'external'
});

// History Timeline
PluginRegistry.registerTool({
    id: 'history-timeline',
    name: 'History Timeline',
    description: 'Build a chronological timeline of events with categories and era overlays — great for history lessons or project timelines',
    icon: '🕰️',
    version: '1.0.0',
    toolbox: 'educational-tools',
    tags: ['history', 'timeline', 'events', 'chronology', 'education', 'dates'],
    title: 'History Timeline',
    content: '<div class="tl-widget">' +
        '<div class="tl-toolbar">' +
            '<button class="tl-toolbar-btn" onclick="tlOpenEventForm(this)">+ Add Event</button>' +
            '<button class="tl-toolbar-btn" onclick="tlToggleCategoryManager(this)">🏷 Categories</button>' +
            '<button class="tl-toolbar-btn" onclick="tlToggleEraManager(this)">📅 Eras</button>' +
        '</div>' +
        '<div class="tl-panel tl-event-form">' +
            '<input type="hidden" class="tl-form-event-id" value="">' +
            '<div class="tl-form-row">' +
                '<label>Year</label>' +
                '<input type="number" class="tl-form-year" placeholder="e.g. -3000 for 3000 BCE">' +
                '<label>Month</label>' +
                '<select class="tl-form-month">' +
                    '<option value="">(none)</option>' +
                    '<option value="1">Jan</option>' +
                    '<option value="2">Feb</option>' +
                    '<option value="3">Mar</option>' +
                    '<option value="4">Apr</option>' +
                    '<option value="5">May</option>' +
                    '<option value="6">Jun</option>' +
                    '<option value="7">Jul</option>' +
                    '<option value="8">Aug</option>' +
                    '<option value="9">Sep</option>' +
                    '<option value="10">Oct</option>' +
                    '<option value="11">Nov</option>' +
                    '<option value="12">Dec</option>' +
                '</select>' +
                '<label>Day</label>' +
                '<input type="number" class="tl-form-day" min="1" max="31" placeholder="(none)">' +
            '</div>' +
            '<div class="tl-form-row">' +
                '<label>To Year</label>' +
                '<input type="number" class="tl-form-to-year" placeholder="(optional, for a date range)">' +
                '<label>Month</label>' +
                '<select class="tl-form-to-month">' +
                    '<option value="">(none)</option>' +
                    '<option value="1">Jan</option>' +
                    '<option value="2">Feb</option>' +
                    '<option value="3">Mar</option>' +
                    '<option value="4">Apr</option>' +
                    '<option value="5">May</option>' +
                    '<option value="6">Jun</option>' +
                    '<option value="7">Jul</option>' +
                    '<option value="8">Aug</option>' +
                    '<option value="9">Sep</option>' +
                    '<option value="10">Oct</option>' +
                    '<option value="11">Nov</option>' +
                    '<option value="12">Dec</option>' +
                '</select>' +
                '<label>Day</label>' +
                '<input type="number" class="tl-form-to-day" min="1" max="31" placeholder="(none)">' +
            '</div>' +
            '<div class="tl-form-row">' +
                '<input type="text" class="tl-form-title" placeholder="Event title">' +
            '</div>' +
            '<div class="tl-form-row">' +
                '<label>Category</label>' +
                '<select class="tl-form-category"><option value="">(none)</option></select>' +
                '<button class="tl-toolbar-btn" onclick="tlToggleCategoryManager(this)">+ Category</button>' +
            '</div>' +
            '<textarea class="tl-form-textarea" placeholder="Description (markdown supported)"></textarea>' +
            '<div class="tl-form-actions">' +
                '<button class="tl-form-save" onclick="tlSaveEvent(this)">Save</button>' +
                '<button class="tl-form-cancel" onclick="tlCloseEventForm(this)">Cancel</button>' +
            '</div>' +
        '</div>' +
        '<div class="tl-panel tl-category-manager">' +
            '<div class="tl-cat-list"></div>' +
            '<div class="tl-manager-add-row">' +
                '<input type="color" class="tl-new-cat-color" value="#3498db">' +
                '<input type="text" class="tl-new-cat-name" placeholder="New category name">' +
                '<button class="tl-toolbar-btn" onclick="tlAddCategory(this)">Add</button>' +
            '</div>' +
        '</div>' +
        '<div class="tl-panel tl-era-manager">' +
            '<div class="tl-era-toggle-row">' +
                '<label><input type="checkbox" class="tl-show-eras-toggle" onchange="tlToggleShowEras(this)" checked> Show era banners on timeline</label>' +
            '</div>' +
            '<div class="tl-era-preset-row">' +
                '<label>Preset</label>' +
                '<select class="tl-era-preset-select">' +
                    '<option value="historical">Historical Eras</option>' +
                    '<option value="archaeological">Archaeological Eras (Stone/Bronze/Iron Age)</option>' +
                    '<option value="geological">Geological Eras (Paleozoic/Mesozoic/Cenozoic)</option>' +
                    '<option value="cosmological">Cosmological Eras (Radiation/Matter/Dark Energy)</option>' +
                '</select>' +
                '<button class="tl-toolbar-btn" onclick="tlLoadEraPreset(this)">Load Preset</button>' +
            '</div>' +
            '<div class="tl-era-list"></div>' +
            '<div class="tl-manager-add-row">' +
                '<input type="text" class="tl-new-era-label" placeholder="Era label">' +
                '<input type="number" class="tl-new-era-start" placeholder="Start year">' +
                '<input type="number" class="tl-new-era-end" placeholder="End year">' +
                '<select class="tl-new-era-type">' + tlEraTypeOptionsHtml('historical') + '</select>' +
                '<input type="color" class="tl-new-era-color" value="#9b59b6">' +
                '<button class="tl-toolbar-btn" onclick="tlAddEra(this)">Add</button>' +
            '</div>' +
        '</div>' +
        '<div class="tl-scroll"><div class="tl-line"></div></div>' +
    '</div>',
    onInit: 'tlInit',
    defaultWidth: 520,
    defaultHeight: 580,
    source: 'external'
});

console.log('Educational Tools plugin loaded (8 tools)');
