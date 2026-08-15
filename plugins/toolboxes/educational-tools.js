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

/* World Map Widget Styles */
/* Map colours are their own variables rather than the shared ones: land, ocean
   and border have to stay distinguishable from each other in both themes, which
   --bg-* cannot promise. */
.map-widget {
    --map-ocean:#cfe6f2; --map-land:#e5dfd1; --map-land-hover:#d3cab4; --map-stroke:#98a3a8;
    --map-learned:#bcd9b8; --map-selected:#f39c12; --map-right:#27ae60; --map-wrong:#e74c3c;
    display:flex; flex-direction:column; gap:6px; padding:8px; box-sizing:border-box;
    flex:1; min-height:0; width:100%; font-size:12px;
}
body.dark-mode .map-widget {
    --map-ocean:#16283a; --map-land:#3a465c; --map-land-hover:#4d5c78; --map-stroke:#20293a;
    --map-learned:#3f6048; --map-selected:#f39c12; --map-right:#2ecc71; --map-wrong:#e74c3c;
}
.tool-content:has(.map-widget) { display:flex; flex-direction:column; }
.map-toolbar { display:flex; align-items:center; gap:5px; flex-wrap:wrap; flex-shrink:0; }
.map-btn { padding:3px 9px; border:1px solid var(--border-color); background:var(--bg-tertiary); color:var(--text-primary); cursor:pointer; font-size:11px; border-radius:4px; }
.map-btn:hover { background:var(--table-hover); }
.map-btn.active { background:#3498db; border-color:#3498db; color:#fff; }
.map-select, .map-search { padding:3px 6px; border:1px solid var(--border-color); border-radius:4px; background:var(--input-bg); color:var(--text-primary); font-size:11px; }
.map-search { width:120px; }
.map-spacer { flex:1; }
.map-stat { font-size:10px; color:var(--text-muted); white-space:nowrap; }
.map-stage { position:relative; flex:1; min-height:60px; border:1px solid var(--border-color); border-radius:4px; overflow:hidden; background:var(--map-ocean); }
.map-svg { display:block; width:100%; height:100%; cursor:grab; touch-action:none; }
.map-svg.dragging { cursor:grabbing; }
.map-country { fill:var(--map-land); stroke:var(--map-stroke); stroke-width:0.35; vector-effect:non-scaling-stroke; }
.map-svg:not(.quiz) .map-country:hover { fill:var(--map-land-hover); }
.map-country.learned { fill:var(--map-learned); }
.map-country.selected { fill:var(--map-selected); }
.map-country.right { fill:var(--map-right); }
.map-country.wrong { fill:var(--map-wrong); }
.map-tooltip { position:absolute; pointer-events:none; padding:2px 6px; border-radius:3px; background:var(--bg-primary); color:var(--text-primary); border:1px solid var(--border-color); font-size:11px; white-space:nowrap; opacity:0; transform:translate(-50%,-140%); }
.map-tooltip.show { opacity:1; }
.map-zoom { position:absolute; right:6px; bottom:6px; display:flex; flex-direction:column; gap:3px; }
.map-zoom .map-btn { width:24px; padding:2px 0; text-align:center; }
.map-panel { flex-shrink:0; display:flex; align-items:baseline; gap:8px; flex-wrap:wrap; min-height:18px; color:var(--text-primary); }
.map-panel .map-flag { font-size:16px; }
.map-panel .map-title { font-weight:600; }
.map-panel dl { display:flex; gap:8px; flex-wrap:wrap; margin:0; font-size:11px; color:var(--text-muted); }
.map-panel dt { display:inline; }
.map-panel dd { display:inline; margin:0 0 0 3px; color:var(--text-secondary); }
.map-prompt { font-size:13px; }
.map-prompt b { color:var(--text-heading); }
.map-hint { font-size:11px; color:var(--text-muted); }
.map-progress { flex:0 0 90px; height:5px; border-radius:3px; background:var(--border-color); overflow:hidden; }
.map-progress span { display:block; height:100%; background:#3498db; }

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
        showEras: data.showEras !== false,
        showDates: data.showDates !== false
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
                showEras: true,
                showDates: true
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
            html += tlRenderEvent(event, data.categories, data.showDates);
        });
        lineEl.innerHTML = html;
    }

    var datesBtn = widget.querySelector('.tl-dates-toggle');
    if (datesBtn) datesBtn.textContent = data.showDates ? '🗓 Hide Dates' : '🗓 Show Dates';

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

function tlRenderEvent(event, categories, showDates) {
    var category = tlGetCategoryById(categories, event.categoryId);
    var color = category ? tlSafeColor(category.color, '#95a5a6') : null;
    var dotStyle = color ? ' style="background:' + color + '"' : '';
    var chip = category ? '<div class="tl-event-chip" style="background:' + color + '">' + escapeHtml(category.name) + '</div>' : '';
    var desc = event.description ? '<div class="tl-event-desc">' + parseMarkdown(event.description) + '</div>' : '';
    var dateHtml = showDates ? '<div class="tl-event-date">' + tlFormatDate(event) + '</div>' : '';
    return '<div class="tl-event">' +
        '<div class="tl-event-dot-col"><div class="tl-event-dot"' + dotStyle + '></div></div>' +
        '<div class="tl-event-content">' +
            '<div class="tl-event-actions">' +
                '<button class="tl-icon-btn" onclick="tlEditEvent(this,\'' + event.id + '\')" title="Edit">✎</button>' +
                '<button class="tl-icon-btn delete" onclick="tlDeleteEvent(this,\'' + event.id + '\')" title="Delete">×</button>' +
            '</div>' +
            dateHtml +
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

function tlToggleDates(btn) {
    var widget = tlGetWidget(btn);
    var toolId = tlGetToolId(widget);
    var data = tlGetData(toolId);
    data.showDates = !data.showDates;
    tlSaveData(toolId, data);
    tlRender(widget, toolId);
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

// ==================== World Map Functions ====================

// Natural Earth 110m (public domain): ne_110m_admin_0_countries for the shapes and
// facts, ne_110m_populated_places_simple for the capitals. Coordinates are kept as
// coordinates rather than as SVG paths so the map is not welded to one projection.
//
// To rebuild: take both files from github.com/nvkelso/natural-earth-vector under
// geojson/, round coordinates to 2 decimals, drop repeated points and rings of
// under four points, then encode as described above MAP_GEOMETRY. Capitals join on
// adm0_a3 — a dozen do not match, and in several more Natural Earth names the
// largest or historical city rather than the capital, so the capitals here are
// corrected by hand and a rebuild must not overwrite them blindly.

// [iso2, iso3, name, continent, subregion, population, capital, labelLon, labelLat]
// Longitudes and latitudes throughout are integer hundredths of a degree.
const MAP_COUNTRIES = [
    ["FJ","FJI","Fiji","Oceania","Melanesia",889953,"Suva",17798,-1783],
    ["TZ","TZA","Tanzania","Africa","Eastern Africa",58005463,"Dodoma",3496,-605],
    ["EH","ESH","W. Sahara","Africa","Northern Africa",603253,"Laayoune",-1263,2397],
    ["CA","CAN","Canada","North America","Northern America",37589262,"Ottawa",-10191,6032],
    ["US","USA","United States of America","North America","Northern America",328239523,"Washington,  D.C.",-9748,3954],
    ["KZ","KAZ","Kazakhstan","Asia","Central Asia",18513930,"Astana",6869,4905],
    ["UZ","UZB","Uzbekistan","Asia","Central Asia",33580650,"Tashkent",6401,4169],
    ["PG","PNG","Papua New Guinea","Oceania","Melanesia",8776109,"Port Moresby",14391,-570],
    ["ID","IDN","Indonesia","Asia","South-Eastern Asia",270625568,"Jakarta",10189,-95],
    ["AR","ARG","Argentina","South America","South America",44938712,"Buenos Aires",-6417,-3350],
    ["CL","CHL","Chile","South America","South America",18952038,"Santiago",-7232,-3815],
    ["CD","COD","Dem. Rep. Congo","Africa","Middle Africa",86790567,"Kinshasa",2346,-186],
    ["SO","SOM","Somalia","Africa","Eastern Africa",10192317,"Mogadishu",4519,357],
    ["KE","KEN","Kenya","Africa","Eastern Africa",52573973,"Nairobi",3791,55],
    ["SD","SDN","Sudan","Africa","Northern Africa",42813238,"Khartoum",2926,1633],
    ["TD","TCD","Chad","Africa","Middle Africa",15946876,"N'Djamena",1865,1514],
    ["HT","HTI","Haiti","North America","Caribbean",11263077,"Port-au-Prince",-7222,1926],
    ["DO","DOM","Dominican Rep.","North America","Caribbean",10738958,"Santo Domingo",-7065,1910],
    ["RU","RUS","Russia","Europe","Eastern Europe",144373535,"Moscow",4469,5825],
    ["BS","BHS","Bahamas","North America","Caribbean",389482,"Nassau",-7715,2640],
    ["FK","FLK","Falkland Is.","South America","South America",3398,"Stanley",-5874,-5161],
    ["NO","NOR","Norway","Europe","Northern Europe",5347896,"Oslo",968,6136],
    ["GL","GRL","Greenland","North America","Northern America",56225,"Nuuk",-3934,7432],
    ["TF","ATF","Fr. S. Antarctic Lands","Seven seas (open ocean)","Seven seas (open ocean)",140,"Port-aux-Français",6912,-4930],
    ["TL","TLS","Timor-Leste","Asia","South-Eastern Asia",1293119,"Dili",12585,-880],
    ["ZA","ZAF","South Africa","Africa","Southern Africa",58558270,"Pretoria",2367,-2971],
    ["LS","LSO","Lesotho","Africa","Southern Africa",2125268,"Maseru",2825,-2948],
    ["MX","MEX","Mexico","North America","Central America",127575529,"Mexico City",-10229,2392],
    ["UY","URY","Uruguay","South America","South America",3461734,"Montevideo",-5597,-3296],
    ["BR","BRA","Brazil","South America","South America",211049527,"Brasília",-4956,-1210],
    ["BO","BOL","Bolivia","South America","South America",11513100,"Sucre",-6459,-1667],
    ["PE","PER","Peru","South America","South America",32510453,"Lima",-7290,-1298],
    ["CO","COL","Colombia","South America","South America",50339443,"Bogota",-7317,337],
    ["PA","PAN","Panama","North America","Central America",4246439,"Panama City",-8035,872],
    ["CR","CRI","Costa Rica","North America","Central America",5047561,"San José",-8408,1007],
    ["NI","NIC","Nicaragua","North America","Central America",6545502,"Managua",-8507,1267],
    ["HN","HND","Honduras","North America","Central America",9746117,"Tegucigalpa",-8689,1479],
    ["SV","SLV","El Salvador","North America","Central America",6453553,"San Salvador",-8889,1369],
    ["GT","GTM","Guatemala","North America","Central America",16604026,"Guatemala City",-9050,1498],
    ["BZ","BLZ","Belize","North America","Central America",390353,"Belmopan",-8871,1720],
    ["VE","VEN","Venezuela","South America","South America",28515829,"Caracas",-6460,718],
    ["GY","GUY","Guyana","South America","South America",782766,"Georgetown",-5894,512],
    ["SR","SUR","Suriname","South America","South America",581363,"Paramaribo",-5591,414],
    ["FR","FRA","France","Europe","Western Europe",67059887,"Paris",255,4670],
    ["EC","ECU","Ecuador","South America","South America",17373662,"Quito",-7819,-126],
    ["PR","PRI","Puerto Rico","North America","Caribbean",3193694,"San Juan",-6648,1823],
    ["JM","JAM","Jamaica","North America","Caribbean",2948279,"Kingston",-7732,1814],
    ["CU","CUB","Cuba","North America","Caribbean",11333483,"Havana",-7798,2133],
    ["ZW","ZWE","Zimbabwe","Africa","Eastern Africa",14645468,"Harare",2993,-1891],
    ["BW","BWA","Botswana","Africa","Southern Africa",2303697,"Gaborone",2418,-2210],
    ["NA","NAM","Namibia","Africa","Southern Africa",2494530,"Windhoek",1711,-2058],
    ["SN","SEN","Senegal","Africa","Western Africa",16296364,"Dakar",-1478,1514],
    ["ML","MLI","Mali","Africa","Western Africa",19658031,"Bamako",-204,1869],
    ["MR","MRT","Mauritania","Africa","Western Africa",4525696,"Nouakchott",-974,1959],
    ["BJ","BEN","Benin","Africa","Western Africa",11801151,"Porto-Novo",235,1032],
    ["NE","NER","Niger","Africa","Western Africa",23310715,"Niamey",950,1745],
    ["NG","NGA","Nigeria","Africa","Western Africa",200963599,"Abuja",750,944],
    ["CM","CMR","Cameroon","Africa","Middle Africa",25876380,"Yaoundé",1247,459],
    ["TG","TGO","Togo","Africa","Western Africa",8082366,"Lomé",106,881],
    ["GH","GHA","Ghana","Africa","Western Africa",30417856,"Accra",-104,772],
    ["CI","CIV","Côte d'Ivoire","Africa","Western Africa",25716544,"Yamoussoukro",-557,749],
    ["GN","GIN","Guinea","Africa","Western Africa",12771246,"Conakry",-1002,1062],
    ["GW","GNB","Guinea-Bissau","Africa","Western Africa",1920922,"Bissau",-1452,1216],
    ["LR","LBR","Liberia","Africa","Western Africa",4937374,"Monrovia",-946,645],
    ["SL","SLE","Sierra Leone","Africa","Western Africa",7813215,"Freetown",-1176,862],
    ["BF","BFA","Burkina Faso","Africa","Western Africa",20321378,"Ouagadougou",-136,1267],
    ["CF","CAF","Central African Rep.","Africa","Middle Africa",4745185,"Bangui",2091,699],
    ["CG","COG","Congo","Africa","Middle Africa",5380508,"Brazzaville",1590,14],
    ["GA","GAB","Gabon","Africa","Middle Africa",2172579,"Libreville",1184,-44],
    ["GQ","GNQ","Eq. Guinea","Africa","Middle Africa",1355986,"Malabo",899,233],
    ["ZM","ZMB","Zambia","Africa","Eastern Africa",17861030,"Lusaka",2640,-1466],
    ["MW","MWI","Malawi","Africa","Eastern Africa",18628747,"Lilongwe",3361,-1339],
    ["MZ","MOZ","Mozambique","Africa","Eastern Africa",30366036,"Maputo",3784,-1394],
    ["SZ","SWZ","eSwatini","Africa","Southern Africa",1148130,"Mbabane",3147,-2653],
    ["AO","AGO","Angola","Africa","Middle Africa",31825295,"Luanda",1798,-1218],
    ["BI","BDI","Burundi","Africa","Eastern Africa",11530580,"Gitega",2992,-333],
    ["IL","ISR","Israel","Asia","Western Asia",9053300,"Jerusalem",3485,3091],
    ["LB","LBN","Lebanon","Asia","Western Asia",6855713,"Beirut",3599,3413],
    ["MG","MDG","Madagascar","Africa","Eastern Africa",26969307,"Antananarivo",4670,-1863],
    ["PS","PSE","Palestine","Asia","Western Asia",4685306,"Ramallah",3529,3205],
    ["GM","GMB","Gambia","Africa","Western Africa",2347706,"Banjul",-1500,1364],
    ["TN","TUN","Tunisia","Africa","Northern Africa",11694719,"Tunis",901,3369],
    ["DZ","DZA","Algeria","Africa","Northern Africa",43053054,"Algiers",281,2740],
    ["JO","JOR","Jordan","Asia","Western Asia",10101694,"Amman",3638,3081],
    ["AE","ARE","United Arab Emirates","Asia","Western Asia",9770529,"Abu Dhabi",5455,2347],
    ["QA","QAT","Qatar","Asia","Western Asia",2832067,"Doha",5114,2524],
    ["KW","KWT","Kuwait","Asia","Western Asia",4207083,"Kuwait City",4731,2941],
    ["IQ","IRQ","Iraq","Asia","Western Asia",39309783,"Baghdad",4326,3309],
    ["OM","OMN","Oman","Asia","Western Asia",4974986,"Muscat",5734,2212],
    ["VU","VUT","Vanuatu","Oceania","Melanesia",299882,"Port Vila",16691,-1537],
    ["KH","KHM","Cambodia","Asia","South-Eastern Asia",16486542,"Phnom Penh",10450,1265],
    ["TH","THA","Thailand","Asia","South-Eastern Asia",69625582,"Bangkok",10107,1546],
    ["LA","LAO","Laos","Asia","South-Eastern Asia",7169455,"Vientiane",10253,1943],
    ["MM","MMR","Myanmar","Asia","South-Eastern Asia",54045420,"Naypyidaw",9580,2157],
    ["VN","VNM","Vietnam","Asia","South-Eastern Asia",96462106,"Hanoi",10539,2172],
    ["KP","PRK","North Korea","Asia","Eastern Asia",25666161,"Pyongyang",12644,3989],
    ["KR","KOR","South Korea","Asia","Eastern Asia",51709098,"Seoul",12813,3638],
    ["MN","MNG","Mongolia","Asia","Eastern Asia",3225167,"Ulaanbaatar",10415,4600],
    ["IN","IND","India","Asia","Southern Asia",1366417754,"New Delhi",7936,2269],
    ["BD","BGD","Bangladesh","Asia","Southern Asia",163046161,"Dhaka",8968,2421],
    ["BT","BTN","Bhutan","Asia","Southern Asia",763092,"Thimphu",9004,2754],
    ["NP","NPL","Nepal","Asia","Southern Asia",28608710,"Kathmandu",8364,2830],
    ["PK","PAK","Pakistan","Asia","Southern Asia",216565318,"Islamabad",6855,2933],
    ["AF","AFG","Afghanistan","Asia","Southern Asia",38041754,"Kabul",6650,3416],
    ["TJ","TJK","Tajikistan","Asia","Central Asia",9321018,"Dushanbe",7259,3820],
    ["KG","KGZ","Kyrgyzstan","Asia","Central Asia",6456900,"Bishkek",7453,4167],
    ["TM","TKM","Turkmenistan","Asia","Central Asia",5942089,"Ashgabat",5868,3986],
    ["IR","IRN","Iran","Asia","Southern Asia",82913906,"Tehran",5493,3217],
    ["SY","SYR","Syria","Asia","Western Asia",17070135,"Damascus",3828,3501],
    ["AM","ARM","Armenia","Asia","Western Asia",2957731,"Yerevan",4480,4046],
    ["SE","SWE","Sweden","Europe","Northern Europe",10285453,"Stockholm",1902,6586],
    ["BY","BLR","Belarus","Europe","Eastern Europe",9466856,"Minsk",2842,5382],
    ["UA","UKR","Ukraine","Europe","Eastern Europe",44385155,"Kyiv",3214,4972],
    ["PL","POL","Poland","Europe","Eastern Europe",37970874,"Warsaw",1949,5199],
    ["AT","AUT","Austria","Europe","Western Europe",8877067,"Vienna",1413,4752],
    ["HU","HUN","Hungary","Europe","Eastern Europe",9769949,"Budapest",1945,4709],
    ["MD","MDA","Moldova","Europe","Eastern Europe",2657637,"Chișinău",2849,4743],
    ["RO","ROU","Romania","Europe","Eastern Europe",19356544,"Bucharest",2497,4573],
    ["LT","LTU","Lithuania","Europe","Northern Europe",2786844,"Vilnius",2409,5510],
    ["LV","LVA","Latvia","Europe","Northern Europe",1912789,"Riga",2546,5707],
    ["EE","EST","Estonia","Europe","Northern Europe",1326590,"Tallinn",2587,5872],
    ["DE","DEU","Germany","Europe","Western Europe",83132799,"Berlin",968,5096],
    ["BG","BGR","Bulgaria","Europe","Eastern Europe",6975761,"Sofia",2516,4251],
    ["GR","GRC","Greece","Europe","Southern Europe",10716322,"Athens",2173,3949],
    ["TR","TUR","Turkey","Asia","Western Asia",83429615,"Ankara",3451,3935],
    ["AL","ALB","Albania","Europe","Southern Europe",2854191,"Tirana",2011,4065],
    ["HR","HRV","Croatia","Europe","Southern Europe",4067500,"Zagreb",1637,4581],
    ["CH","CHE","Switzerland","Europe","Western Europe",8574832,"Bern",746,4672],
    ["LU","LUX","Luxembourg","Europe","Western Europe",619896,"Luxembourg",608,4973],
    ["BE","BEL","Belgium","Europe","Western Europe",11484055,"Brussels",480,5079],
    ["NL","NLD","Netherlands","Europe","Western Europe",17332850,"Amsterdam",561,5242],
    ["PT","PRT","Portugal","Europe","Southern Europe",10269417,"Lisbon",-827,3961],
    ["ES","ESP","Spain","Europe","Southern Europe",47076781,"Madrid",-346,4009],
    ["IE","IRL","Ireland","Europe","Northern Europe",4941444,"Dublin",-780,5308],
    ["NC","NCL","New Caledonia","Oceania","Melanesia",287800,"Nouméa",16508,-2106],
    ["SB","SLB","Solomon Is.","Oceania","Melanesia",669823,"Honiara",15917,-803],
    ["NZ","NZL","New Zealand","Oceania","Australia and New Zealand",4917000,"Wellington",17279,-3976],
    ["AU","AUS","Australia","Oceania","Australia and New Zealand",25364307,"Canberra",13405,-2413],
    ["LK","LKA","Sri Lanka","Asia","Southern Asia",21803000,"Sri Jayawardenepura Kotte",8070,758],
    ["CN","CHN","China","Asia","Eastern Asia",1397715000,"Beijing",10634,3250],
    ["TW","TWN","Taiwan","Asia","Eastern Asia",23568378,"Taipei",12087,2365],
    ["IT","ITA","Italy","Europe","Southern Europe",60297396,"Rome",1108,4473],
    ["DK","DNK","Denmark","Europe","Northern Europe",5818553,"København",902,5597],
    ["GB","GBR","United Kingdom","Europe","Northern Europe",66834405,"London",-212,5440],
    ["IS","ISL","Iceland","Europe","Northern Europe",361313,"Reykjavík",-1867,6478],
    ["AZ","AZE","Azerbaijan","Asia","Western Asia",10023318,"Baku",4721,4040],
    ["GE","GEO","Georgia","Asia","Western Asia",3720382,"Tbilisi",4374,4187],
    ["PH","PHL","Philippines","Asia","South-Eastern Asia",108116615,"Manila",12247,1120],
    ["MY","MYS","Malaysia","Asia","South-Eastern Asia",31949777,"Kuala Lumpur",11384,253],
    ["BN","BRN","Brunei","Asia","South-Eastern Asia",433285,"Bandar Seri Begawan",11455,445],
    ["SI","SVN","Slovenia","Europe","Southern Europe",2087946,"Ljubljana",1492,4606],
    ["FI","FIN","Finland","Europe","Northern Europe",5520314,"Helsinki",2728,6325],
    ["SK","SVK","Slovakia","Europe","Eastern Europe",5454073,"Bratislava",1905,4873],
    ["CZ","CZE","Czechia","Europe","Eastern Europe",10669709,"Prague",1538,4988],
    ["ER","ERI","Eritrea","Africa","Eastern Africa",6081196,"Asmara",3829,1579],
    ["JP","JPN","Japan","Asia","Eastern Asia",126264931,"Tokyo",13844,3614],
    ["PY","PRY","Paraguay","South America","South America",7044636,"Asunción",-6015,-2167],
    ["YE","YEM","Yemen","Asia","Western Asia",29161922,"Sanaa",4587,1533],
    ["SA","SAU","Saudi Arabia","Asia","Western Asia",34268528,"Riyadh",4470,2381],
    ["AQ","ATA","Antarctica","Antarctica","Antarctica",4490,"",3589,-7984],
    ["","-99","N. Cyprus","Asia","Western Asia",326000,"",3369,3522],
    ["CY","CYP","Cyprus","Asia","Western Asia",1198575,"Nicosia",3308,3491],
    ["MA","MAR","Morocco","Africa","Northern Africa",36471769,"Rabat",-719,3165],
    ["EG","EGY","Egypt","Africa","Northern Africa",100388073,"Cairo",2945,2619],
    ["LY","LBY","Libya","Africa","Northern Africa",6777452,"Tripoli",1801,2664],
    ["ET","ETH","Ethiopia","Africa","Eastern Africa",112078730,"Addis Ababa",3909,803],
    ["DJ","DJI","Djibouti","Africa","Eastern Africa",973560,"Djibouti",4250,1198],
    ["","-99","Somaliland","Africa","Eastern Africa",5096159,"",4673,944],
    ["UG","UGA","Uganda","Africa","Eastern Africa",44269594,"Kampala",3295,197],
    ["RW","RWA","Rwanda","Africa","Eastern Africa",12626950,"Kigali",3010,-190],
    ["BA","BIH","Bosnia and Herz.","Europe","Southern Europe",3301000,"Sarajevo",1807,4409],
    ["MK","MKD","North Macedonia","Europe","Southern Europe",2083459,"Skopje",2156,4156],
    ["RS","SRB","Serbia","Europe","Southern Europe",6944975,"Belgrade",2079,4419],
    ["ME","MNE","Montenegro","Europe","Southern Europe",622137,"Podgorica",1914,4280],
    ["XK","-99","Kosovo","Europe","Southern Europe",1794248,"",2086,4259],
    ["TT","TTO","Trinidad and Tobago","North America","Caribbean",1394973,"Port-of-Spain",-6092,1100],
    ["SS","SSD","S. Sudan","Africa","Eastern Africa",11062113,"Juba",3039,723]
];

// One country per '|', one ring per ';', and within a ring a run of ',' separated
// base62 zigzag deltas: dLon,dLat,dLon,dLat… from the previous point. Decoded once
// per page by mapGeometry().
const MAP_GEOMETRY = "JWo,z1,A,Bl,CF,x,CD,r,b,BM,Bm,q,BA,K,B4,BA;JQm,4d,w,g,BI,7,j,Br,CB,d,Bx,a,T,Ba,BO,BG,Be,Z;JV9,zr,b,Bj,R,N,A,Bk,q,K|BvW,DF,i,X,Ls,Gl,O,B3,Em,DP,Bf,D9,M,B1,CE,BL,G,1,5,B7,M,BB,N,Bj,BI,CB,BU,DN,BM,t,Cl,B3,Dh,BR,B7,E,BL,9,CP,F,3,b,D3,4,Cb,R,5,EY,BH,Bg,p,2,DL,m,B1,8,CD,i,BT,i,BX,y,Bv,EE,B3,By,p,B2,U,Bq,l,C8,BU,K,BM,BK,BQ,Bq,w,q,D,BE,r,s,N,BS,6,Y,M,B4,BT,B0,BI,Y,Di,F,Gi,Q|b9,BbO,A,P,D,n,D,E5,Kl,K,G,IR,DB,T,z,Bp,m,Ep,Mp,A,r,BF,I,BW,E,A,HQ,Q,Y,BK,BU,Bc,BE,Ec,Ee,De,Bg,EE,BA,O,BE,Cg,Cs,W,BK,b,Bc,A,BE,u,CA,G,H,Bu,e,A|GYR,CiE,b,A,GR,DK,CT,Ba,F3,BU,Bx,C2,c,B8,EJ,BY,l,Ck,D3,CW,H,Bo,By,Bk,H,CC,Ff,CC,DT,Dq,CD,CU,C7,Bc,CL,BU,Bv,Bq,DP,BF,DJ,Bx,C3,CG,CR,Ba,DJ,4,DN,G,C,SW,A,L8,GC,x,FE,Bj,DY,T,Cy,BW,D6,BA,Ew,Z,E0,BY,FS,y,CM,BV,Ca,u,s,Bg,CO,V,Fc,C5,EU,CM,a,Cd,D8,g,BO,8,D4,N,E6,BX,Hi,BN,Ea,j,DK,O,EW,Bp,Eh,Bn,Fy,r,Is,Y,Cu,i,Dc,B7,Dg,Bo,DT,BW,CE,BG,D6,K,Ck,U,Cm,x,DO,Bv,Dm,Q,Fs,Bd,FA,g,Es,H,Z,CA,C2,k,FA,BH,D,DF,CE,Ck,Cm,H,Bc,DQ,Dd,CA,Dx,BS,Q,Di,Dy,CW,EQ,h,DQ,Bb,EY,Dp,C3,Bl,GA,p,A,DV,ES,Ci,D2,CF,9,Cb,DI,CL,DW,CU,CW,Cw,M,Di,Ek,P,Ew,f,EU,Bn,M,Bl,CZ,Bv,CQ,Bt,b,Bl,GT,CR,Eh,f,DV,8,9,Bn,DH,Cv,7,BZ,Dv,CN,En,P,Cj,BX,P,CH,Dv,Z,D9,Cp,Df,Dn,BR,Cj,L,Dv,Es,j,Be,DB,Be,Cd,Eg,m,GA,BZ,DO,BP,CU,Bh,EC,5,Da,BX,FU,N,Dg,T,j,Cz,BA,DP,CW,Dn,Ey,DF,Ce,BC,Bu,DU,Br,FG,CT,Bs,FK,Bg,Do,CQ,By,CO,R,CK,CN,Cu,D7,Ca,Dy,DY,BZ,C6,BH,FC,CQ,u,Fg,3,DU,V,Cq,0,DA,BF,D8,B3,BA,BR,Fu,R,H,Ct,BE,EF,C8,h,CU,B5,Eq,By,DE,Di,CK,Bg,Cg,C5,EM,EH,Di,D3,BT,CD,ES,Bz,C4,B3,FI,z,CG,BD,BQ,Cv,Cg,b,BS,BP,Q,Dn,CX,BP,CV,BJ,FT,BL,EF,Cp,Fd,h,G5,q,E1,C,DX,P,Ct,CV,EH,Bb,Ep,ET,Dt,C9,Cs,i,FM,EO,Gw,Cq,Ey,U,C2,Bl,DF,CL,BC,Df,BE,Cb,EM,Bn,FU,c,DO,Do,O,CX,CG,BL,EB,CH,HJ,B7,DP,BT,Dl,CV,Cd,O,J,Cu,Fk,Co,FL,H,Dl,Z,CH,By,A,Ea,Bb,4,CL,h,BH,0,Cd,Cd,BB,Cf,BJ,Bf,BX,f,BD,L,X,z,F7,A,E5,D,Bd,l,DZ,CV,b,R,BD,BR,C9,A,DL,A,Bd,h,g,p,S,9,F,X,EP,Bl,DV,h,Dv,Bt,z,A,BH,e,X,e,E,U,s,BI,Bg,Bw,6,B4,p,Cy,r,C6,DX,Bg,Y,i,f,a,3,A,p,g,L,u,p,V,1,G,M,U,x,U,V,0,Cf,BC,Cn,BE,DL,BQ,DD,BK,C3,5,BF,D,D9,0,Cn,b,DJ,BA,DT,g,CR,M,BB,i,l,Bw,BH,D,A,BP,Gr,A,LD,A,K9,A,Jr,A,Jr,A,Jh,A,J1,A,DL,A,Jl,A,JL,A;EW7,DPc,CY,Be,Ea,D,F,n,Dx,Bx,CR,E,t,2;EJX,Dw0,Dj,Bs,K,BK,Bi,O,HY,X,Fi,Bx,S,3,Db,G,Df,E,Dj,d,7,M;ELH,DOS,BQ,8,BU,H,y,p,BR,Bt,Bb,S,1,8,I,O;E19,D32,Bx,BR,Er,Q,D5,0,Bs,Bc,Eo,2,Cy,BJ,BM,BD;E2t,ECE,Bf,H,GD,O,3,2,Gg,D,CQ,n,Z,X;FCH,EGG,D0,BJ,3,BL,Ex,r,Cn,u,BZ,BO,R,BU,EK,J,B4,N;EkX,D18,FN,a,Il,BC,BJ,Bw,Z,Bk,DP,Ba,Gr,Y,Dv,BA,BM,BU,Gq,N,Dk,BD,GU,A,Cy,BF,v,BP,Ds,t,CC,x,EW,J,Es,T,FI,s,Gk,Q,FO,P,Dc,BN,u,BX,CD,1,Ez,t,EJ,Y,JR,f,Gn,F;Fw5,EEG,Ei,f,BH,9,GB,7,Ex,BC,Cm,BC,Es,U;Fv7,EGM,EM,p,D7,n,FX,A,C,c,DU,8,Bu,L;C3X,Cpi,Bt,CD,CL,C1,CI,BG,CK,r,BJ,BJ,C0,5,Bg,y,DM,BB,BB,CX,CQ,i,a,Bt,BA,CB,BX,C1,Bd,J,CJ,m,s,Co,5,Y,Dv,Cz,B7,I,CS,Bg,DH,w,Df,N,GR,G,f,8,CA,BI,BZ,2,Cs,B8,DU,FI,CA,B0,Cy,BG,Be,J,n,3;EWl,DYC,Dg,BH,Ds,BB,S,Bj,CW,Q,CU,BF,C3,BD,FD,w,Bz,Bc,DN,Bt,El,Br,BJ,B4,EX,V,Cy,Bm,a,Cg,BG,C8,CU,R,k,Bb,Bq,e,B2,1;EGH,DvY,DE,BS,HI,Bp,Ec,Bh,a,Bb,GA,u,DW,CF,Hw,BR,C0,BV,DC,DB,F7,Bh,Hm,CH,FI,t,Eo,C9,FE,P,BB,CR,Fr,Dv,D9,BY,FF,DG,EN,b,Z,B1,DY,B3,EY,Bf,BU,3,CG,DN,BH,CV,EH,4,IF,Ck,Ei,Cz,DW,B7,g,BJ,Iv,BS,G5,B2,D7,Bk,BI,4,Ez,Bo,Er,Bk,C,7,JV,h,Cv,BG,CI,CY,GE,E,Go,Y,BF,BK,BI,Bm,EK,DI,5,Bc,BP,BG,E7,Bi,Gj,BG,CE,0,Db,CA,C1,M,Cj,BG,Bt,9,F3,b,Lt,u,G1,6,FP,e,Cr,BI,DW,Be,El,A,BD,DS,Ce,C2,DU,BU,IU,0,CX,CF,Ci,CD,C8,Cm,IK,BU,Fi,DV,f,CJ,GY,6;E41,D1I,Gs,H,GK,x,Ez,C3,D3,p,Dd,Cb,Dr,I,CB,C0,C,Bm,Bq,BW,DO,2;GYT,D7i,Fc,CY,Go,CG,E6,D,Ea,e,d,Cf,Cf,BJ,DB,L,GB,BZ,FL,f,EX,s;G4H,CyU,DG,Q,9,Dr,Cy,Cl,BT,A,B7,Be,BN,Be,Bn,BA,n,Ba,M,BC,Bg,b;FeT,EHy,GU,b,Is,BN,Ce,Bj,BQ,BV,FR,W,FV,BC,HN,I,DI,8,D5,w,P,BO;Gab,Cge,Bn,d,FV,Be,7,BI,C5,BI,l,4,DV,k,BP,Bw,Q,u,DY,t,B8,f,DC,V,BG,BJ,Bm,Bh,DO,BX,BU,Bx;GUF,D2K,Em,r,IO,L,DK,7,Dc,BX,EF,1,H5,CR,EB,CR,A,Bb,If,Bj,Bt,Ba,Hd,Bs,BY,BW,CO,CW,Cy,CI,DL,B8,K4,g;Flz,D6q,C2,g,DY,J,k,Bl,B9,Bh,K7,h,IJ,BZ,E5,H,b,BE,Gs,Ba,Ol,Z,Eh,k,EY,DK,DE,4,JE,BH,Fu,B5,Fm,R,En,DG,C8,BK,DU,X,BG,Bj,BQ,BJ;Fhn,Dxu,Dm,BV,CC,DJ,BA,CT,FY,Bl,F0,Bj,X,Bb,FT,R,CE,BP,BH,BN,F1,g,Fj,2,Dv,N,GF,BH,IL,f,Fv,T,Bv,Bg,Eb,2,C3,X,D9,Ci,CK,W,E8,i,Ei,L,EM,k,GP,u,G5,R,Ej,E,Bt,BM,He,BS,FB,D,Fn,0,Cs,Ca,CO,BS,Io,B6,DS,n,Bn,Bh,HM,BA,Ee,Bp,Do,Bo,C6,BF,Co,DL,Bm,BW,CT,DS,C0,e,DO,h;FOB,Dwi,Dj,CG,Dy,Bi,D2,r,Fu,a,0,7,DB,Bj,E2,BZ,l,C5,FT,BR,DH,S,CP,BO,ID,Ce,E,BC,Gk,Z;Fh3,Dza,EU,I,Cc,t,C1,CJ,FD,CQ,BG,c;FHv,D9e,Cc,Bf,I,Br,Bf,CZ,FV,V,Dd,g,E,B2,FT,R,P,Cg,De,H,E2,BG,Eg,N,Q,a;E9v,EMA,CQ,BA,DS,O,Bb,u,Hg,K,EI,Bv,Fa,r,FS,n,Ci,CJ,D4,BD,Ed,9,F9,Cb,Fr,P,Gt,Y,Dd,BU,C,BK,Ci,2,F3,D,Dl,BG,CD,Bc,CO,Ba;Evd,EQK,Ey,o,Dw,G,GU,g,Eu,BM,EA,L,De,5,Cc,Bu,EQ,g,Fw,W,J2,I,Bs,X,JU,i,G8,N,HA,N,Im,R,G6,b,F4,3,J,3,H3,BZ,Hz,p,C7,v,HC,C,Hn,B9,FR,5,Fh,Cp,Gp,j,CF,p,Jx,X,Ec,Z,CP,l,Cq,Bl,DF,BJ,FB,5,Bh,BR,Eh,9,c,v,Fg,I,E,x,In,B7,Ib,2,Jf,f,Ez,Y,GH,K,b,Bi,F8,u,Bl,CU,B8,O,Im,BZ,EZ,CE,FP,m,Cm,BQ,Fs,w,6,BI,El,BQ,BX,Bo,Iy,J,Ci,X,FC,BK,HR,Y,LT,N,Ft,BG,Cr,BS,Dx,6,t,BG;D4p,Dfi,CH,7,Dn,L,z,Bk,BY,By,C6,c,Ci,5,C,BZ,Z,d;FAh,DmK,B8,BP,CB,BJ,EX,8,Cn,X,Eb,Bc,C0,BA,CQ,BY,Da,5,B6,l,8,n;DWJ,Ck2,BI,S,EO,z,DS,BX,G,l,Bj,F,EN,BA,DB,Bg;DUf,Cbu,BI,Bl,CU,b,DA,E,Bl,BV,BN,N,EH,BW,z,BG,BO,BA|GYR,CiE,JK,A,Jk,A,DK,A,J0,A,Jg,A,Jq,A,Jq,A,K8,A,LC,A,Gq,A,A,BO,BG,C,k,Bx,BA,j,CQ,N,DS,h,DI,BB,Cm,a,D8,1,BE,C,C2,4,DC,BL,DK,BR,Cm,BF,Ce,BD,U,1,w,V,N,V,0,H,o,U,K,v,o,h,2,A,e,b,Z,j,DW,Bh,q,C7,o,Cz,7,B5,Bh,Bx,t,BJ,F,V,W,f,BG,f,y,A,Du,Bs,DU,g,EO,Bk,E,W,T,8,h,o,Bc,g,DK,A,C8,A,BC,BQ,a,Q,DY,CU,Bc,k,E4,C,F6,A,W,y,BC,K,BW,e,BI,Be,BA,Ce,Cc,Cc,BG,1,CK,g,Ba,5,A,Eb,CG,Bz,k,BF,Dd,Bj,DV,BJ,Db,9,Bt,B5,h,t,D,Bt,BE,Bt,BU,H,V,BM,8,v,T,5,CL,h,Bj,C,CZ,j,BZ,L,B5,L,Cr,7,Eu,m,8,n,Eh,9,CF,A,G,Y,BB,5,8,J,t,CV,CX,Cf,P,0,t,K,BF,y,q,Bv,y,l,C,BP,BD,BP,Bz,Cl,T,I,BA,CM,Bp,BO,Z,Cq,n,BZ,q,CF,CJ,g,CO,BD,I,DF,6,P,U,BJ,c,DP,CD,CZ,DX,9,CH,B3,Bn,P,Bp,BN,d,BF,Dj,CH,Bz,Bj,Bj,B5,f,CT,k,CP,BE,Cx,Ba,CT,C,BZ,Bg,Dv,H,CL,J,BR,z,B9,9,b,Bl,Y,h,Ba,BP,u,Bt,Cw,Bh,Ce,f,BQ,q,CI,5,Bw,Ch,Cs,BR,e,DR,Bd,l,K,Bj,Be,CD,y,Dp,b,C3,W,Cd,N,BV,h,k,3,F,BT,q,p,n,b,BN,e,BN,n,CX,G,Cb,Bs,Cz,b,CX,u,CB,P,Ct,v,C7,CZ,DN,BZ,Bx,Bj,v,Bd,D,CP,K,Bj,m,BH,BR,H,CT,s,Ch,BA,5,Bg,t,CQ,B5,B0,BJ,B4,Bn,CM,CR,BS,Cp,F,CD,Cj,Cr,8,Br,8,z,Bw,BF,Bq,B5,Ba,Bp,BC,BN,BI,Fl,A,A,BV,Cj,A,Gb,D,HX,CS,E3,Bk,S,m,EH,X,Dr,P,j,Bo,CF,B0,Bh,Y,X,6,Bz,K,BL,2,DB,U,z,g,Z,Bw,DJ,DO,Ct,Ee,I,u,Bb,BE,Ch,Cs,d,Co,Bt,Bu,s,Cq,H,Cw,BD,Ce,BQ,DC,Y,C6,Y,C4,l,EU,BD,Cw,7,Be,Y,o,Eq,BH,Bs,DD,y,0,h,Co,BH,Co;IFT,BCw,k,T,g,b,y,BJ,F,N,BR,r,BD,h,f,h,z,c,G,4,h,BK,K,W,i,i,P,m,M,U,O,F,BQ,j;IHP,BE8,R,Z,BF,P,l,q,X,Q,D,O,U,Q,BI,T,0,h;IJr,BGU,H,X,Bv,G,Q,Y,Bk,J;INx,BIE,S,P,6,BF,N,N,P,E,BJ,G,Z,u,J,I,0,c;ISH,BJo,E,v,X,V,BH,m,K,O,e,U,u,H;IpB,DIw,Ck,T,S,BP,B9,h,CJ,m,B9,2,DM,i;H8T,DBA,CK,P,BW,BB,Cz,Bh,DP,BR,Bp,0,f,Bg,C6,BK,Bs,e;HUz,Dm2,A,L9,D,SX,DM,H,DI,5,CQ,Bb,C2,CH,DI,Bw,DO,BE,Bu,Br,CK,BV,C6,Bd,CC,CV,DS,Dr,Fe,CD,G,CD,Bz,Bl,Bx,BO,C1,BC,5,Cy,EL,Cm,Bv,DC,DH,O,FJ,E,Dx,6,Gr,DW,DH,m,Fn,BI,Ef,R,GX,Be,Dz,BW,Dl,r,o,CP,Bx,P,Dv,p,C1,BH,Dl,r,d,B2,Bc,DM,Da,8,3,y,EJ,Bx,CN,CL,Ep,CT,CW,Bl,DD,CT,Df,BX,DP,BB,z,Bb,FD,Br,BB,Bh,Dx,BX,CP,O,DB,5,DT,BH,Cr,BF,Fj,7,f,i,Dg,Bg,DK,BA,Dc,Bu,EA,Y,Bk,BU,Ee,B6,s,o,CY,BI,i,Cc,Bo,B4,Dt,9,BF,i,Bv,BN,CH,Bo,3,BL,BP,Bm,DP,BT,B9,A,R,B6,k,BK,CH,BK,EN,n,Ct,Bg,CP,w,A,By,Cf,BY,BQ,B0,Cm,By,BK,Bq,Cm,O,CM,h,Cm,Bi,CW,R,Cc,BA,n,Bc,Bz,k,CY,BQ,B9,D,Db,t,BB,t,Cj,s,Ej,X,Ev,w,BX,BS,EF,B2,Eg,BW,HO,Bk,Co,A,d,Bn,Gy,I,Cn,CA,D9,BO,CT,Bm,DH,BW,Eb,BC,By,Bq,Fs,I,EE,Bc,w,Bk,DS,Bg,DK,Y,GG,Ba,C8,P,E8,Bu,E2,r,CW,Bd,Ba,m,Fc,N,N,v,E6,j,DS,U,Gy,BD,GM,T,Ce,b,ES,g,E4,9,De,d;I59,DTu,CA,n,CA,U,Cm,1,DM,b,R,X,Cd,r,Cd,q,BP,m,C1,N,x,S,M,BM|Ehy,Ciu,Cd,CJ,Cr,T,L,DR,Bz,Bd,GZ,BE,CV,Fx,Bp,t,GZ,BT,C4,Fn,CP,1,Q,B1,CB,e,Bn,BK,Ex,U,FX,G,BL,X,En,BW,Bz,r,h,B5,FV,BI,CH,f,v,BZ,B1,n,ER,CR,Bb,CT,BN,D,3,Bi,EJ,G,p,Co,Bl,A,Q,DQ,D3,CW,Fh,R,Dz,f,DF,C6,Cp,BM,FB,CU,n,S,IT,B5,I,L5,Bp,L,CR,Cg,CN,4,Dr,p,Bb,BH,L,y,w,BU,n,BI,Dv,BG,Bd,C4,Bx,y,H,BE,DI,V,I,CY,Cu,g,Cy,f,k,DI,l,CA,DP,L,Cv,y,Dv,Bb,DB,r,Bp,g,U,Bq,CD,CI,CZ,F,Cv,CK,B0,Cc,7,q,Ck,Dg,DU,B3,Y,CY,Gq,De,FC,G,HG,CP,D0,BV,Da,BW,FG,E,EI,Bp,6,6,Ei,J,y,Bg,FP,CO,DG,Bk,n,2,DG,0,CV,CM,Be,BI,ME,BG,Bk,y,IE,BM,C4,BW,Fy,t,BA,DX,DW,y,EK,BH,R,Bx,DE,M,IG,DC,BL,BB,EG,Ch,HO,IN,Bs,Bs,Ec,B3,Em,0,By,l,Bi,B3,CQ,n,BW,BZ,EK,c,Bs,CB|C4i,CJQ,J,L4,IS,B4,m,T,FA,CV,Co,BN,DE,C7,Dy,e,Fg,Q,D2,CX,R,DR,Bk,A,o,Cp,EI,H,2,Bj,BM,C,Ba,CS,EQ,CQ,B0,m,8,V,Ct,CH,CY,BP,CS,y,D0,Br,EL,CV,Cd,S,BV,F,d,4,q,Be,EV,v,BD,CF,Bh,Bz,Ct,K,1,Bb,CY,x,q,CZ,Bz,DT,Cb,s,Bz,A,G,B8,ET,BY,DZ,Bk,CH,Bg,Dt,CO,Bl,DU,BF,m,Df,L,BR,q,V,Ci,EX,Bs,Ct,B3,Cx,BH,i,Bp,Dp,D|HU0,IZ,Fm,CP,F6,B1,CO,Bp,By,Bp,e,B5,FY,B9,w,Bt,C9,X,s,CL,C2,CH,CG,Db,B2,G,J,Bb,Ce,j,9,n,Da,BX,X,7,CJ,P,z,0,Cx,W,DR,e,Cf,CE,B1,Bw,Br,Cy,EP,Ba,Ct,7,B9,BF,Y,CX,Ch,BJ,Bz,i,DX,I,D,Kg,F,Kg;H6Y,Lz,BO,BD,Y,Br,BB,3,n,B4,v,BQ,Bf,BE,B1,BW,CV,8,4,w,Bu,5,BG,t,BW,x,BS,BX;H2E,S1,Bx,x,Bp,x,Bt,A,Cp,6,B1,4,Q,BA,C4,d,Bw,O,e,Bi,c,G,U,Bt,B0,O,4,BI,By,BI,X,B4,B6,E,o,h,F,Bz,BH,B9,Br,R,h,5;IDO,RP,8,v,Bk,CD,Bg,BH,d,5,5,V,BZ,BO,Bb,CE,t,Cc,c,U,W,9|HU0,IZ,E,Kh,C,Kh,C3,Co,DR,o,z,5,EH,H,BY,Cm,CC,4,1,Dg,Bj,Cs,GR,Cs,Cr,S,E1,C8,7,Bj,BR,T,t,BK,D,Ba,Cd,Bk,De,BK,CS,F,R,2,Ev,A,BR,B4,C5,m,BX,Bk,EW,w,Bo,BE,FM,BV,e,BN,4,FP,DW,B7,Cq,Da,Ds,B8,C2,A,Cu,BJ,Ca,BL,Dc,n;GfI,cr,U,p,E,9,CH,Cb,Cx,t,Z,Y,S,BG,BY,B8,DM,BS;G86,WR,V,Cc,k,BK,q,BE,u,7,D,Bh,Bp,CP;GIQ,NW,B1,C7,CY,DD,j,Bf,Dm,DB,D1,Z,BF,CN,I,C5,DH,CP,H,DN,BP,E7,f,BI,Dr,Bd,BR,B8,CT,M,Bn,BC,D1,BL,BN,Bk,CH,N,Cr,Y,f,EU,Bn,4,Bj,Cu,d,C0,Y,C8,B4,CK,i,CL,CM,B1,CG,q,CE,R,B2,Bo,Bi,S,DE,5,Cm,q,Bo,Ee,BQ,BI,BI,Dq,Ds,A,Cw,j;GtU,JD,Di,7,BK,Cf,Ct,BU,Cr,S,B1,P,CP,I,w,Bw,D8,I;GlQ,MP,CP,k,n,BY,DQ,K,y,BF,BP,BF;Goq,HA,O,Bv,B4,T,U,BV,L,Cz,Br,U,f,B9,BU,Bt,5,Z,BT,CC,9,EI,o,Ck,BE,BK;GYi,C0,Ds,I,DM,CU,i,t,Cl,DN,Cb,n,DJ,m,FX,L,C1,d,d,Cd,C4,C3,Bu,Bc,GA,BG,R,Bf,Bb,e,BZ,B5,C1,BP,DC,EL,l,BH,C4,Dt,D,CJ,Bt,7,BR,BI,Bi,Co,DL,BR,z,4,a,BO,CV,B4,O,DI,CJ,9,Q,Dx,I,En,CD,d,BZ,6,4,C8,f,DI,BX,A,BB,CO,BU,CG,c,Ck,Bo,E0,q,BW,Cu,CY,Cg,9,EE,b;GQE,hH,ET,CQ,DA,o,Bs,BB,BI,9,N,3,BX,F;GTa,bj,CK,Q,C2,BM,d,Bz,E3,5,ET,Y,A,BM,Ck,o,CA,9;GJe,a9,CA,Q,y,BZ,Dv,p,CP,b,Bv,C,BG,B0,Bw,C,2,BI,BK,1;Fn8,Ut,a,BL,GM,V,s,BU,F8,Bj,BM,CF,E0,n,D8,B5,Dt,BP,Dj,BS,C5,H,DX,Q,DB,k,Dv,BO,CZ,U,BV,b,F5,BW,j,BY,C7,O,CM,DE,D6,L,Ck,BT,BW,P;Faq,Df,i,CR,BI,Bz,CW,T,Bk,CD,z,ED,J,E9,Dl,F,Ct,Cq,EL,Co,BX,B8,Cd,Cm,Bn,Ca,Cd,Eg,C1,Cq,7,Cw,BN,Cg,C5,CC,Br,Cw,Cd,By,DX,Di,T,Bo,CG,J,E8,n,C2,DL,Ce,CN,Bw,BX,DE,Dd,DS,F,Cs,CN,B2,Ct,Cc,Bf,BT,Cn,B0,BJ,BK,F|DjZ,Ctz,BO,Bf,Bm,Cb,EM,B7,Eg,z,Bd,Bn,DF,L,Bp,BI,B7,G,Dd,A,A,HM;C95,Bjf,x,Cl,3,DT,C,DP,t,t,R,CH,P,Br,EG,Cx,b,CP,CA,BZ,L,Bl,DH,EJ,Ex,Bv,Gf,r,Dj,U,q,B5,p,Cb,k,Bp,B7,BJ,DT,d,DH,BM,BR,1,c,DP,CM,9,Bu,BC,8,Br,C9,BB,Cl,CD,f,DP,x,Bv,DD,A,Ch,Bp,7,Cb,DK,CX,DG,r,BJ,C3,Dz,B1,CH,Dx,C7,BR,BV,Bh,BC,DX,CK,B3,BX,K,DB,g,Hx,a,BX,B2,E,Ca,CL,N,BJ,BK,T,Da,Ce,Ba,BC,CE,Z,Bm,Bs,Cw,BM,EQ,X,B4,Ba,m,X,BM,Bf,o,BE,BW,Bf,BO,v,Du,BS,o,j,D6,w,DS,2,C2,B6,BM,BB,DI,A,C8,Cc,CG,H,Cs,B0,DK,C,C8,1,k,Bh,Fi,CA,DU,T,DI,BI,C6,CI,DC,CQ,CA,7,BQ,o,BC,H,FY,Dg,Bk,BG,DW,Z,y,Cs,C6,EO,z,B2,CV,BQ,Cm,Dq,J,g,t,F6,FR,Co,f,D6,CZ,DU,BR,e,Bb,DN,E5,DQ,5,Dm,f,Ci,g,C6,Ce,g,C0,Bm,m,Bm,B1,F,Cl,Ct,Bx,CL,BV,Dp,DJ,EV,Eb|DjZ,Ctz,A,HN,Dc,A,B6,H,BF,BT,Cx,BB,Bl,G,B5,Q,CX,8,DZ,e,ED,Bw,DV,Bu,Eb,Dm,Co,r,Ei,CL,EQ,BJ,Bq,Bc,BC,CO,C8,BU,CU,Z;Dmf,4t,Bk,CN,a,CV,Bs,BZ,BD,DH,Bu,Dn,BQ,Ed,CU,a,Y,z,BH,DX,Dh,Bl,G,FZ,p,BD,6,BR,CR,CB,CJ,DD,BJ,C7,S,DJ,CB,DV,Bg,Fj,0,l,D,C9,B1,DL,G,Ct,Cd,CH,A,C9,BA,DJ,B7,BN,3,C3,x,DT,i,D7,BT,p,u,Dv,Be,BP,BF,BX,Be,p,W,BN,Bb,n,W,B5,BN,ER,Bt,Cx,Y,Bn,BD,CF,Cf,Bb,S,Db,BI,BL,CK,M,F,Cb,BW,B3,Hw,b,DA,h,C3,C,Bj,z,C7,BL,h,DB,BX,H,Dp,BE,Dr,CO,ED,B2,BB,CC,4,B4,Bn,CI,b,Fg,BY,DG,DY,Ce,E3,6,DE,C2,BG,FW,Dk,BJ,Bq,Gq,CL,0,BB,ED,CD,e,BA,Em,BG,F8,Be,CM,7,DK,R,Dm,BW,I,CA,FM,CO,FK,BW,Ey,v,E0,8,Co,Z,EA,B2,D6,m,GO,BC,Gs,BA,HO,P,FQ,r,Ei,Bo,0,2,Bo|Bgo,Oh,k,C9,V,Br,o,B3,B2,Bz,Bu,EF,BR,U,EX,j,3,Z,5,CD,s,Bd,j,Dz,b,DP,2,l,CQ,BR,4,k,Q,Df,Cf,C,BV,Bw,BL,BY,Cf,c,v,Bq,B9,BB,Cl,c,BF,Bc,CF,S,Bh,F,L,BA,BJ,E,Bd,M,CB,f,Bb,G,x,T,K,D0,BF,BM,R,B8,e,B6,p,BQ,F,CC,D7,D,S,BK,Bp,A,L,l,CB,J,z,B3,f,z,Bz,c,BF,d,CJ,R,BP,Bq,v,BE,7,B6,x,CY,Jh,E,BL,Z,5,C,BX,b,d,BA,0,W,G,BY,g,0,BM,q,0,V,BG,BO,Bu,D,O,5,BM,l,B4,CC,B2,Bi,0,BC,J,Cq,Ba,DI,Be,Bo,CG,Bk,Y,BC,E,BK,i,BI,N,B0,a,C0,m,CC,8,Bs,M,B6,S,CQ,BQ,Bo,Bu,BC,Co,BH,CE,BN,CW,V,Ca,n,6,B6,c,Q,Be,V,Dk,Bm,BS,r,BC,G,e,w,BM,S,Ca,X,CE,F,BE,U,B8,Cp,Bc,Z,2,i,Be,P,By,q,u,BZ,C0,CJ,N,Dx,BS,d,BD,BJ,BP,3,BP,Br,r,Bf,N,Cn,v,BP,D,Cb,7,5,J,B7,b,P,V,Bx,0,Bd,M,D5|CKK,Fb,B7,Co,D,Lu,C0,Dq,2,BA,CE,E,C2,CS,EM,I,JI,Jq,CQ,Cs,Bc,B8,A,Bq,A,DQ,A,BU,C,E,BC,E,Be,e,Bs,U,Bg,BG,BO,A,E,3,T,B3,C,Bt,t,BL,5,Df,Bj,Dn,CB,EJ,Cx,Et,Cv,Dn,Dz,EZ,DP,Cn,Ez,DP,DB,Cd,Dj,D5,v,Bt,t,v|CCc,PH,En,DO,P,B2,Lt,Gk,j,W,D,Da,6,BU,Bk,CI,BM,CW,Bb,Dq,Z,Bo,Bh,CO,B8,B6,CM,CI,Bq,j,A,Bz,BG,BF,CQ,A,EE,Cv,BC,D,u,G,s,Z,CK,R,6,BW,C8,BW,BS,BH,CO,A,C1,Dr,C,Lv,B6,Cp,CT,BT,x,BX,BP,P,d,CT,BD,BT,p,CL,BT,BF|BRQ,ai,Cd,Ba,BJ,4,P,BC,i,BU,D,BU,B1,CA,Z,BY,E,w,BN,8,D,B2,r,BQ,BJ,N,U,BM,0,BU,Z,BW,BE,8,r,w,2,B8,Bc,CY,Cy,P,L,My,C,BW,Ds,A,A,Gc,M8,A,Mg,A,My,A,BC,DL,t,l,c,DV,BM,D3,BO,x,Bw,BN,Bp,B1,CX,j,BD,9,V,CL,BZ,Ev,W,BT,h,Cx,BV,DL,B7,Bn,BZ,Cd,V,BV,Bh,5,9,DZ,C,C5,D,Cg,d,E,E,Bm,Z,BI,Bp,BQ,Z,CU,Y,CY,Bh,O,P,v,B7,L,w,7,S,B7,Bx,Bx,Bn,CV,Bp,V,Ct,B2,BP,r,V,7,Br,n,H,p,DP,A,d,o,CV,I,BL,j,3,Q,Br,B4,j,2,CV,d,5,Bf,z,C3,BJ,n,9,X,CM,BR|BO4,BBK,K,Mz,Cz,O,Bd,CZ,3,B9,q,x,BF,9,Y,BX,1,BV,V,BN,BI,M,q,BR,C,B3,BM,9,F,x,CD,j,Bp,BT,CV,Dh,DD,Bh,DJ,M,5,T,U,BJ,Br,BJ,BZ,BR,ED,BP,z,s,j,E,l,z,Cr,R,g,2,BD,CO,d,BW,Bb,i,B5,B2,s,Bg,Be,V,4,O,By,D,Bx,C6,I,CK,P,CI,BR,CE,U,Bg,CH,E,C,CG,BX,BM,BY,EO,EI,DE,K,EM,BQ,Gi,q,BY,BV,BG,F,BC,BN,0,z,FA,DQ,Bw,M2,GL,M2,GN|DtV,BBk,S,Bv,R,BP,z,j,0,9,F,5,CJ,i,Bh,N,B9,O,Bh,n,Bv,BA,S,BC,C8,b,Cc,R,BK,s,Bf,BY,C,BO,CF,g,u,4,B8,L,Cy,h|DtV,6M,E,4,1,8,y,i,Q,BO,T,Bu,Y,i,Cg,A,B6,1,0,G,k,BL,Bw,E,H,7,Ba,J,Bk,BN,BN,BT,Bh,q,Bf,J,BF,K,l,l,BR,P,f,y,BF,f,BT,CN,1,g,L,4|JSi,DrW,EG,BW,A,CP,Dj,L,j,BC;CiY,CZq,Bd,B5,DJ,j,DP,DV,C6,DF,V,CL,Dg,Dz,B5,BT,j,1,Bd,O,CN,B8,7,G,CB,u,BB,BU,DB,q,B9,h,j,m,Eb,Bi,Ev,g,Ct,i,Z,Z,EJ,Cu,Dr,BO,Cx,B2,CU,g,Cq,Cs,Bz,BS,Ew,BS,H,s,C5,h,I,Bc,Bo,4,DI,O,g,BE,v,Bw,BU,Bs,D,6,Ex,BE,B3,D,CB,Be,Cd,f,EH,BI,E,m,BL,Ba,Cl,K,R,BA,y,o,CF,B0,DV,V,BB,K,z,v,BN,I,z,CE,v,BE,m,U,Ck,J,BQ,s,5,2,CN,i,M,k,BV,m,CB,CG,q,2,V,Bg,DJ,w,Bt,Z,d,y,DZ,y,BD,B4,T,Bi,Bj,u,BY,BC,9,DA,CS,B2,f,k,Dq,Bw,DZ,Bg,G4,EI,DA,B2,BO,Bo,Ex,CM,BS,CG,C5,Ca,CM,Cw,Dx,Do,DA,Cc,E7,CI,c,CQ,Cm,U,Fe,BS,DU,BI,FU,B9,Iy,x,MM,Dp,Ce,Bh,O,CL,Dl,Br,FT,3,OZ,Cc,CZ,b,FQ,CX,O,Bf,M,DV,EK,9,Cg,1,a,Bi,B7,BY,CE,BO,Hw,CB,Cu,w,CN,CY,Hg,DK,DA,N,DA,BJ,B2,CO,Cr,B4,Bk,B6,CZ,CA,JC,BD,B0,Bz,EF,Z,A,Bz,Ci,BH,E8,q,y,CE,Gu,Bi,LQ,Cw,Ca,L,DL,B9,EA,V,CS,BG,GE,G,Ew,BU,Dq,B7,Dq,CI,DZ,B2,Bq,BE,Jg,9,Ee,BD,Lq,Dr,CK,Bs,DT,Bq,F,s,D5,S,BE,Bi,Bv,Cg,H,BC,F8,C4,CI,C6,CY,o,Ii,1,q,Bz,DF,Cn,CA,BD,BC,CR,v,Eb,Dk,B9,BZ,CL,GV,El,Dq,f,BS,BK,Di,0,2,Bk,Cw,Bi,B3,B0,Bg,CI,Dj,Q,x,By,Ck,DO,EN,Co,Fw,CK,v,CS,Bm,E,Bq,Bx,BR,DH,Dc,n,Bf,CU,Fa,BS,Gq,K,F8,B1,C3,Cq,V,Dc,Fm,o,Hw,J,G8,a,Cn,Bq,Du,CI,Ds,E,GQ,Bm,Ig,a,BE,4,Ie,S,Co,t,HO,Bs,F6,F,4,BY,DE,BY,Hm,BU,Fi,BF,EZ,x,HS,h,2,Bl,C6,w,Jc,D,HQ,Bl,Ck,BN,x,Br,Dl,9,If,Bx,Cb,9,EA,d,Ew,z,C4,m,Bo,CF,Ba,y,FK,g,KW,h,w,Bh,Ne,f,M,Ce,G0,l,FK,C,FM,Bt,Be,CF,B5,BX,EE,Cj,FE,BT,DG,DY,FM,Bd,Fe,2,GQ,BB,CW,4,FS,d,CV,DA,EQ,BY,dI,CH,Cu,B5,Ic,Cf,NC,m,Ga,h,Cq,BX,Z,CX,D8,5,EU,o,Fs,G,GG,p,GI,W,Fm,C3,EA,BC,Cn,CE,Ba,Bc,KS,5,Gs,M,JS,Bj,Eg,Bb,A,M1,D,D,EJ,Bb,EN,Q,C4,Bt,B6,Cr,Be,3,Y,BV,1,3,GD,s,JB,Cb,C3,Z,E7,CR,Er,B9,BN,Bf,En,CO,Ib,Ch,Bd,BM,DH,BZ,EV,c,BD,CJ,D3,DJ,G,BT,Dq,t,b,Et,DB,J,BZ,Cr,BW,BZ,Fp,Br,BJ,Dr,Ez,x,9,DT,Ep,DB,BN,CO,BZ,Es,Bz,HK,Bi,Ee,Cu,B4,K,Bg,FA,u,Fw,EC,Fi,DU,Fy,Ck,Ck,Ei,D5,R,B7,Cr,IN,Dj,Cp,D8,IV,BH,IF,FZ,Co,CB,HN,1,E9,V,O,CU,FD,g,EB,Bn,J1,k,Kn,9,Kd,GT,MX,Hn,FE,b,Bk,CB,DI,t,CE,Bk,Di,N,Eq,Dj,G,Cv,Ch,DP,T,D1,Bd,FL,E3,Er,BF,CP,EZ,Dx,EV,Dt,CH,B5,ET,B5,CD,D,CD,Bi,EV,CX,h,BF,d,k,D,Bm,Bo,G,e,Dy,1,Cw,Cu,BI,D6,l,CK,DK,BG,Dg,BQ,BM,Bs,C4,FX,9,Cx,BR,E5,A,BV,DC,Dz,CS,Fn,BC,BN,DK,BJ,B8,BP,BY,B9,DQ,C1,BM,E1,8,ER,H,ED,l,Cp,Bn,Bw,v,C,Bz,Bz,BD,C5,Db,C,Bb,Ej,CD,D3,BO,D1,R,Bt,BE,B7,W,Et,CT,ER,h,C9,z,EF,g,C9,D,B9,Bo,DL,Bi,DP,c,EH,b,DD,n,El,BW,n,Ca,Dz,0,C7,W,Dn,BW,DV,DX,BS,B5,DJ,CP,Er,y,DN,G,CL,Bg,DZ,E,Cz,8,E5,Bh,GJ,Cx,Db,j,BR,T,Bt,CA,EL,d,BX,BY,CR,m,Bj,B2,Bz,k,En,1,Ed,B2,Bt,Bt,HP,IM,EH,Cg,BK,BA,IH,DD,DF,N,Q,Bw,EL,BG,DX,z,BB,DW,Fz,s,C5,BX,IF,BN,Bl,z,MF,BH,Bf,BJ,CU,CN,DH,1,m,3,DH,Bl,FO,CP,z,Bh,Ej,I,7,7,EJ,Bo,FH,F,Db,BX,D1,BU,HH,CO,FD,H,Gr,Df,Z,CZ,DV,B2,Cl,Dh,6,r,B1,Cd,Cu,CL,CY,E,CC,CJ,V,Br,Bo,h;E2g,ENW,G8,u,GQ,Bn,Hc,DJ,z,C5,HD,Z,JB,4,FX,BQ,Cd,CS,Eb,o,IY,CM;FVu,EHu,IK,B1,7,BT,SN,BR,F2,EO,Cq,Y,Ca,P;HN0,D7m,Ig,L,Lq,Bt,Cj,CZ,L5,G,FV,x,Gb,CG,Bu,CO,EQ,m;HsI,D5E,IG,3,Dt,BR,FL,S,GB,BQ,w,BE,GA,f;HRK,Dyq,DE,BS,EC,S,Ek,BP,Y,3,E3,A,Gn,W,l,K;CUq,EL8,GS,k,E4,C,o,3,B2,w,DC,i,Ew,t,BP,f,EX,b,C5,R,d,h,Dv,j,Dh,w,B0,BA,HL,G;BLU,CzQ,F7,F,D9,Y,u,Ba,Ec,BC,DY,j,Ba,h,X,5,Q,z;Cwm,Dz4,Hs,C0,3,Bc,HO,Bs,Ko,CE,Ku,m,Fg,BM,GS,a,CO,BT,CL,BB,Lb,Bl,J3,Bj,KB,DF,Ez,DL,FF,DH,o,Cr,GM,Cp,B7,T,Kh,a,3,Bc,F1,0,d,Bu,DS,s,J,Bu,Ga,Cw,C9,Y;HbA,CxO,BI,DH,F,DL,BU,DR,DO,Ft,Ex,BE,B9,Er,DI,DT,F,CR,Cd,B6,CJ,Cf,l,Cs,W,DI,Z,De,w,Cc,I,ES,B5,DM,S,EY,DA,Be,BT,Bg,Ba,c,0,CL;JGT,Dey,R,CD,CK,x,v,CU,Iu,f,GU,DB,DN,Bb,FT,V,F,DL,BV,r,DB,G,Cd,BI,ET,6,v,Ba,DR,g,Dr,b,Bv,BI,q,BM,D1,x,Bc,Bh,B1,BX,A,M0,H4,Cd,Ic,DN;JSb,Dqq,EP,N,A,CO,a,I,Cu,A,Eo,7,R,d,DV,x;Bt2,CYS,0,y,CS,r,BC,J,a,p,e,H,C,T,Bk,x,DS,M,p,BL,Dh,j,EZ,B3,Bx,o,s,Bg,Dj,8,k,m,DG,BE,f,Y|EGx,BYa,Bg,Q,CI,H,G,1,Dh,h,P,BM;EC7,BZO,Ci,Bd,j,CT,n,a,E,Bq,Bd,BS,A,W;EEP,BTU,8,J,BI,Cr,C,B3,z,L,z,B2,BP,6,s,CC|DLb,CrR,D2,B6,Cu,z,B6,BS,Ck,Bd,9,BJ,EX,9,Bd,BI,Cv,Bd,Bn,Bc|w0,EJA,BO,BI,Eu,G,EE,BJ,Km,CZ,IH,BT,Bz,CX,C1,n,Bh,Cr,D5,J,G7,B8,C6,BK,E1,4,GT,Cu,Ch,Cg,Iy,BK,Bw,BJ,Ek,C;BmU,DmY,Ff,BT,Cn,V,BY,CS,EL,BQ,FB,BF,Bl,CZ,DF,Bb,Df,w,EN,L,Dn,Bs,B5,1,CB,J,f,CJ,GH,g,1,Bz,DH,A,CJ,CT,DP,Dl,FB,Eh,BK,BH,BJ,BT,DN,E,CH,DD,M,ET,CE,Bp,BF,Dx,Cr,CP,Bb,B1,CL,B8,GZ,Dv,ET,v,Ed,Bo,BL,Dc,BD,Hc,C8,CE,Ig,Cs,GY,DW,F4,Ee,Hu,GO,Fa,Ca,I0,EE,HG,Ba,FS,N,E6,Cq,F2,J,Fy,o,KE,CZ,EJ,1,Dg,CD;Baa,EKQ,Ez,Bv,JX,Z,Jf,i,l,2,Ep,E,Dh,Be,J8,4,Eq,x,DQ,8,IK,z,GU,BJ;BRu,EDI,HN,BV,Fr,w,CO,0,B9,BA,Gq,o,BS,BN,Eo,v|Ca1,ESi,Ky,B6,LU,L,EI,BM,LY,U,Zw,b,UK,Cj,F7,BR,MX,J,RX,V,Bm,l,La,W,Ju,BH,GQ,8,Cq,BL,Dj,B3,IO,BM,Po,BQ,Jq,n,By,BZ,NL,CT,Bz,v,KV,j,He,L,Dx,CX,Cl,CH,G,Dl,D2,CH,FF,L,FT,BB,F8,Bt,u,Cv,Dd,T,EM,Cx,HL,R,Du,BT,BF,BL,Ej,f,Eh,A,EE,CN,C,Bd,GZ,BW,Bp,3,EW,z,EO,B9,BO,Cn,Fx,n,Cf,BQ,D9,B0,BG,CN,Dv,Br,Ie,L,Ec,L,Ip,Cz,Ix,Cj,Jb,BH,Dl,D,DV,BP,Ef,Db,G7,CR,CP,J,EV,z,En,v,Cx,CB,D,CR,Bp,CJ,FR,Cl,BS,Ch,Bd,Cr,Bp,DJ,Ej,N,Ev,Cm,Gd,C,DJ,Bw,CL,DI,Fl,EC,Bp,CG,d,C4,Ed,C8,BK,CY,CL,BI,DM,Dw,E0,BM,BS,BW,q,Cg,Dr,BL,Bx,d,C5,f,D7,BE,P,CM,BQ,Bs,DA,E,Gk,3,Fj,CC,C3,BI,DP,d,Cr,w,Dk,DC,B9,BM,Cj,CO,D3,Da,EJ,BQ,C,BW,Ip,B2,G1,Q,In,L,H3,P,Dv,BC,Fn,CC,Ic,BA,Gg,M,Nz,0,HT,BS,c,BQ,MO,Bi,Ly,Bi,BQ,BM,It,BK,Cy,BS,LK,CO,Es,W,BX,Bc,Ho,0,J4,g,J6,C,Dg,BB,Ii,Bw,Hs,BP,Eg,P,Gs,BF,Hr,Bu,c,BY|DkY,Cg1,CE,BD,DE,Z,G,n,5,Bf,E7,N,H,Bs,e,BU,O,q|GfI,cr,Y,u,Cw,u,CO,G,BC,a,BO,b,BN,3,DX,Bb,Ct,5,F,8,V,o|0s,BeN,Bi,Bm,BS,5,i,BX,Bc,R,CA,n,Bu,Q,C2,Bo,C,L4,2,f,B4,DF,T,B9,s,BJ,CU,U,Bm,Bc,Bg,8,w,Bi,Bk,u,BW,Z,Bi,5,Co,L,CC,u,W,BC,i,Bg,Bw,Q,8,BO,BE,CK,C4,CY,Ei,CY,BU,D,Bi,j,BG,Y,Bs,V,Bi,Ej,0,CT,l,Dl,S,BL,Bp,k,7,P,T,7,3,BP,C,BH,B4,Bx,B4,W,o,Bc,Cc,D,z,CX,Z,Cr,1,Bd,CN,Bp,n,d,BZ,Bp,5,Bp,Bz,CV,Dp,DV,CT,B7,Cd,Bf,DX,BP,Bp,N,b,3,B9,c,Bl,n,Dh,o,B7,b,BX,M,DV,BT,Cv,h,CB,BP,Bd,F,BZ,BK,BF,E,Bb,Ba,J,d,d,2,C,B4,BD,CK,BC,k,H,Ce,CH,DA,Bp,Cu,CV,EM;Bfe,Bfb,Bb,BA,Bh,p,Bv,BR,Bt,CF,Ca,Cf,BK,U,k,BC,By,g,i,BE,BA,Bi,BJ,8|Bfe,Bfb,BI,9,BB,Bj,j,BF,Bz,h,l,BD,BL,V,Cb,Ce,Bs,CE,Bu,BQ,Bg,o,Ba,BB|GF1,Bq8,Dq,O,EG,W,T,n,E2,Bl,HW,CT,Ga,C,Ci,A,A,BU,Fk,A,BM,BJ,Bo,BD,B4,Bb,BE,Br,y,Bx,Bq,9,Cq,9,CC,Ci,Co,E,CQ,BT,Bm,CN,BI,B5,B4,B1,s,CR,4,Bh,Cg,BB,CS,t,BQ,G,BR,C1,j,CV,R,EV,T,Bl,i,Bv,BA,Bl,o,Cf,CI,Cb,w,B1,BQ,Bl,Da,3,BU,BX,C0,4,Cc,U,Ca,k,CC,k,CE,BS,w,B4,Q,Cs,i,6,CM,0,Da,u,C0,H,B8,Q,w,r,J,Bj,Bt,B5,x,B9,k,l,f,BZ,z,Ch,z,0,r,F,n,D,BL,B9,l,Y,Z,J,C,f,DB,C,DB,A,A,B1,Bd,A,BM,BF,BM,v,W,t,g,N,F,BH,EL,A,Bj,Cp,c,n,X,v,H,7,Dp,De,Br,BC,Cn,0,Bz,P,Cl,BP,Bp,V,CR,2,Cb,m,DD,Be,Cb,c,Dp,Be,Ct,Bi,z,2,Bz,M,DT,BA,BX,Be,Dd,B0,Bn,CC,x,Bi,BE,U,V,6,u,0,A,BG,BF,Bc,T,BS,BH,Bm,C1,DO,DR,Cg,Bj,CA,Cx,BU,l,w,e,CA,Bp,w,B5,Bi,z,CQ,Bv,Q,B3,Bs,Bh,Bi,J,BC,Bv,Ca,BJ,Ce,C,BO,CV,BS,BH,L,B1,4,h,BV,i,Bj,U,Cb,BG,BV,CY,CP,i,v,e,R,a,BH,k,E,o,CH,8,z,s,BL,CA,Bp,BG,DB,6,Bb,4,Bf,K,Bt,Bk,H,BS,Bf,BK,Bd,F,j,BX,BN,l,A,3,B8,CH,B0,CV,Bi,Bp,0,G,CW,f,Bu,Bj,BA,CN,Bc,d,b,z,0,CB,w,B5,B2,Q,Q,BU,N,BM,BO,I,Bc,Cf,CS,B5,4,BN,CA,BN,CI,Bf,Ck,BV,C4|C95,Bjf,CG,W,DQ,Cf,BM,G,DU,CF,Cg,Bz,B2,CN,Bb,Bh,4,B1,Bb,CD,Dp,Bx,CX,o,Bx,X,C9,BY,CN,H,B9,Bw,Q,CG,s,s,D,DO,2,DS,w,Ck|CwL,Bu7,5,B0,Ba,Bg,B3,CM,Ch,By,DV,CE,BN,H,DR,Ce,CH,X,EU,Ea,Do,DI,CK,BU,Cs,Bw,E,Ck,Bn,B0,Bn,n,o,B2,c,B4,A,Bw,BL,k,BP,h,BN,I,Z,BQ,T,C6,n,8,CL,2,BV,n,Db,m,O,EY,9,Bw,BC,q,V,B0,2,Ba,k,Ci,v,CA,Bx,4,X,BQ,e,B2,GN,I,BP,Dw,6,C,D,BY,p,8,J,B0,B3,8,CD,D,BX,6,CL,o,BT,BM,Dn,i,Df,C2,Q,CK,Z,BQ,U,Ca,EP,j,Br,BP,C1,BT,t,9,Br,H,CZ,S,Bz,j,Bf,W,O,E4,Cp,B5,C1,G,BP,Bs,CL,M,q,BY,Bx,B8,BX,C4,2,k,A,BW,B6,6,V,Bu,0,BI,O,Bg,Dq,CM,Co,m,c,e,C4,L,Bc,I0,E,Ba,h,B0,Bb,BK,A,CW,B0,i,o,X,G,BQ,B3,U,F,CA,GS,F,BE,BI,4,BD,m,B5,m,Y,Bw,Bt,Cg,O,o,BA,CY,u,BU,g,Y,BY,CS,4,L,q,Cv,S,d,CC,I,CK,Bd,0,m,S,CY,b,Ck,z,6,w,CS,e,Dm,BO,BM,BO,b,4,Bq,I,u,v,b,Bb,BG,f,u,Bf,5,BJ,f,Cv,y,Bp,O,Bf,CA,Bh,Bk,L,W,m,BC,K,Bc,i,BC,2,By,T,w,I,Bu,R,S,o,h,o,U,6,BS,T,Bg,U,B2,r,BY,p,BA,2,u,L,a,5,Bi,O,BO,BO,BA,CY,B4,C8,BG,I,y,Bx,By,Fp,Bu,h,E,CP,Cb,Cr,BA,9,Fs,h,I,DP,Cc,CI,EC,BL,FW,B9,Bk,B5,h,Bx,Du,BA,GS,Bt,Ey,I,Ew,Cr,EI,Dn,Ce,7,Cu,J,BK,BB,BG,EJ,i,B7,BT,FX,Bp,CH,Ej,Ef,CD,Dp,CZ,Cz,z,F,5,CX,O,GF,5,E9,X,CJ,BB,BR,l,EV,DR,EN,j,DX,Cn,BZ,x,B7,Df,A,FH,BP,CR,Bd,Dn,7,Dz,Cl,Cv,DN,d,CZ,i,Bz,n,DR,v,Bj,CR,Bx,Dl,Fr,C1,Cl,CN,Bh,Bd,DF,CJ,B1|DmT,jV,CY,T,Bq,G,s,8,C0,BS,Bq,BO,EO,i,V,Cb,Y,BR,R,CL,De,C3,Dm,j,BS,BN,CK,p,BW,7,CC,C,B2,9,I,B1,o,9,C,BZ,7,D,BO,Dx,GM,J,f,B3,W,BR,Bw,5,u,CB,l,Cj,3,Bb,U,B1,BD,r,D,BA,DD,Bo,C9,E,Fp,7,Bj,C1,F,Bv,BT,D3,h,s,Dr,I,BR,Cn,B3,CU,EP,y,Ct,C7,CV,b,BR,Ec,Bv,Dm,BC,DG,Bt,BY,b,CU,Bl,CM,CC,De,BZ,Cs,u,BG,l,BM,BQ,Bm,E,Cu,K,CQ,q,BG,Cx,FM|Dnd,N3,C5,K,d,f,Cp,n,Dr,CN,P,Bh,1,BJ,U,Bv,B7,7,A,BX,3,l,BW,C5,Bw,B9,r,BZ,CK,N,BO,Bt,C0,H,Co,B4,P,E5,Be,X,By,i,Cw,FN,r,BH,L,CR,F,Cv,BR,Bn,k,BN,v,BH,BY,Ct,CD,Df,3,Bp,Bp,1,DR,B2,R,BU,GZ,DO,Fz,Dg,Cf,CA,BV,Cq,g,4,Cv,EQ,DL,F6,DF,Ga,BV,Be,BB,CY,Ch,CG,CT,BS,BC,Bc,Bj,DE,BA,CQ,Ck,CE,Y,BX,7,x,G,BN,BU,Q,BU,V,BU,Bp,B0,BU,m,CM,B8,Cy,D2,BQ,Di,DY,BA,CG,d,Cc,0,S,CK,Bh,BC,Bh,Be,1,B4,DZ,CY,Z,By,0,BK,j,B6,Q,Cc,Bh,CF,DR,8,H,Bm,Bt|Ddv,EC,n,Z,n,B4,5,BC,BF,BJ,GT,E,E,CB,B2,V,H,BR,p,W,B1,j,A,CX,Ba,BL,g,B1,F,Bb,Bd,I1,Bn,Bs,9,G,CE,DQ,Cd,Bg,B7,R,BL,i,Bz,1,CZ,Y,B5,DY,Bf,0,BD,Bg,CL,Bg,1,T,BZ,u,Bl,BG,7,h,Ct,c,z,BY,n,F,DP,B0,b,BA,BM,Q,J,Bm,u,BK,Bm,O,BW,CC,BO,Bq,BN,w,m,B2,t,C6,q,2,h,Cs,BT,Bs,a,Bk,BC,P,m,8,v,B2,Y,e,Bo,H,Ca,CQ,BW,U,C,BE,k,Cu,B0,Be,CC,E,Q,q,Ci,R,Cg,Bm,BQ,u,Bk,Bi,BI,N,0,3,n,BF,CF,j,1,Bn,BP,7,9,BN,Z,CT,3,B5,Bo,N,a,Bf,s,t,Q,BV,Z,BN,I,r,w,R,w,BJ,EK,U,B2,b,CQ,Cx,BS,W,CU,N,B0,Y,BK,j,l,Bv,t,BH,R,CV,o,CJ,4,9,I,t,Bp,Bn,BK,t,2,BJ,8,DP|EBh,b8,Z,f,u,B3,n,9,BD,O,b,Bl,BF,6,t,Bu,y,2,1,O,l,BE,Bn,4,Bb,P,p,BJ,BT,z,t,H,V,r,Bi,Bv,5,b,d,f,Bh,L,j,B6,b,j,BF,M,p,BS,BV,O,1,W,BZ,A,H,t,Z,g,M,m,Q,q,J,k,e,Y,r,c,A,BU,BO,S,BK,BL,F,r,BS,L,U,Q,2,x,Bk,O,BY,y,B8,o,BG,8,Bw,N,J,V,By,H,Ba,j,BE,9,BO,5|EST,e2,BP,T,A,BV,q,d,f,Z,I,l,R,r,N,n,Bv,s,p,q,W,i,H,s,5,w,BR,o,BJ,a,N,6,3,k,O,7,p,x,v,2,BD,U,d,o,C,BA,a,BA,5,e,u,m,e,a,CI,3,u,a,BA,R,i,r,6,N,w,q,0,Bv,BO,BV,Bg,BX|EV3,jS,x,r,7,M,j,q,BB,Q,v,b,CJ,2,f,b,BJ,BA,Bh,BU,t,BE,BX,BC,Bn,Bc,W,e,i,f,O,O,BA,K,a,s,e,C,H,Bk,w,G,q,D,q,2,8,p,U,Y,m,Y,BG,2,E,q,U,D,a,w,U,G,i,f,o,L,s,a,y,A,BI,a,c,c,BG,F,R,V,L,t,U,BN,v,BH,X,BT,H,Bb,K,1,G,Bd,h,V,T,BZ,O,1,r,1,K,3,e,h|EUP,wY,BH,E,d,d,BJ,b,z,A,t,b,p,K,j,e,V,H,b,x,V,C,F,r,BH,3,n,Z,V,Z,9,o,r,3,r,C,x,H,G,Bl,f,D,b,t,BB,L,j,BC,9,Q,O,BU,d,U,r,O,BZ,X,J,a,9,g,t,o,7,Q,o,0,R,m,Q,o,Bg,4,Bc,BO,W,J,s,i,4,E,U,R,e,K,Bg,T,Be,E,BC,W,Y,Y,BC,N,w,N,0,E,o,S,Bc,d,g,F,BA,n,6,v,BK,f,0,3|EoP,ug,6,R,s,p,8,h,I,b,BY,W,q,P,c,V,P,BV,X,v,B3,C,BL,U,BX,o,Bx,M,7,s,I,c,BG,y,m,W,N,Y,w,M|Exh,u4,G,6,W,u,d,m,Bi,Co,EK,A,E,BG,h,M,X,s,BN,u,BN,BE,Bc,A,A,B0,DA,A,DA,D,D,Cj,R,Dp,8,A,BE,l,Q,e,6,b,Bd,BP,Bh,5,R,p,Q,n,p,1,x,N,M,Z,n,X,BH,z,J,d,Bp,i,CB,E,Bf,o,Bv,BU|Enj,5c,D,e,Y,I,k,Z,BK,B8,m,C,A,f,m,A,D,3,j,Bb,S,f,V,BL,M,T,Z,Bp,n,1,l,J,p,BH,9,A,Q,Do,C,Ci|DJ5,Qw,a,5,BN,BP,Dn,BP,CT,f,7,x,Cl,y,CZ,a,n,T,Bc,1,J,CL,c,CD,Cu,T,K,r,CT,5,Z,BZ,BV,h,CZ,v,p,BB,Ch,P,Bx,Bs,9,DO,3,BI,BL,s,Bo,Bm,J,s,5,8,p,CI,Q,CU,s,BG,k,Bu,BL,i,B1,Z,CV,M,BT,X,CR,Cw,B3,a,EL,V,x,BI,x,Q,J,q,Y,BM,R,BU,t,s,b,Be,Bp,M,2,B4,Y,CS,8,BM,BO,6,0,Bm,CE,i,H,x,B5,Z,BE,Bd,D,Br,Bb,B3,BM,Cl,Ba,O,s,CU,BB,BI,L,Cc,EA,BU,b,Bg,BI,BA,BK,CR,CQ,F,CG,Bx,I,BH,C2,A,Dc,U,B0,Bd,Ce,Z,By,BA,C,y,EA,M,D2,E,Cv,9,BG,Bh,Ck,R,Cc,Bl,g,Cl,Bq,E,BQ,v,Cj,B5,T,BL,BG,BP,x,l,CB,h,E,Bh,3,3,CM,Cd|C6Z,GI,x,J,Bz,S,BD,3,Bd,j,BD,L,X,n,Bl,K,CB,Bg,P,Be,z,Bo,e,Cu,4,BI,v,Be,BH,e,a,Ba,v,u,Br,J,CN,Cc,2,2,F,Bg,CA,g,w,k,BH,BO,S,BK,Ci,B4,CI,BN,CA,CH,G,Br,BM,F,Bu,Bl,BQ,BJ,h,C5,B7,1,K,v,l,Br,Ba,CX,BC,A,a,Bz,B8,Cz|Cz3,Hc,B3,q,Bh,V,BT,S,V,7,g,p,T,p,Bv,Q,B9,Cy,b,By,BD,A,Bb,CW,k,Bq,L,u,B6,0,g,C4,D2,p,W,k,Cm,Q,Dc,3,Br,Cx,Q,CP,BQ,B5,j,BZ,T,Bf,z,BX|Cqp,Na,B5,C9,BB,CZ,BP,BP,Bj,P,b,4,v,K,BB,3,BZ,o,y,BW,S,Be,i,BY,BR,B4,R,CO,Bq,Cw,BG,X,CY,x,Da,Ct,g,BV;T8,Cji,Bg,1,Eo,l,Bp,CP,Z,CT,5,j,Bd,S,G,z,CX,Bz,F,Bf,Bi,g,BG,Bb,J,5,8,BP,BJ,9,0,Ch,Bu,Z,X,Bb,C7,Bz,GX,2,Et,BD,X,B9,Dv,b,Dp,Be,BL,t,F7,Bc,BT,BQ,Bq,B6,m,Ga,DX,DY,CX,Bo,E7,BO,V,CW,EK,s,Fa,1,BB,Dq,DC,BZ,Hg,Cg,8,Co,Cy,o,e,BJ,Be,F,Bg,BT,CQ,Bh,Bo,Q,Cy,Bf,u,T,6,E;cO,CNg,CE,BO,i,Cx,BF,Cf,Bd,o,x,CM,q,BM|D5J,f,c,Cd,BB,CH,Dj,DZ,D3,BR,B9,Cz,n,CN,B1,BV,BV,Bo,BV,U,BV,R,H,BM,6,w,Z,BW,Bs,CY,t,Ba,BP,Bh,B7,Ba,q,4,j,C6,BI,e,k,CC,BO,CE,P,BU,Bw,q,CM,BS,DO,B1,m,E,y,BZ,Cs,d,6,g,Bk,BH,BY,v|Dbz,7s,Bo,R,k,p,1,z,Cb,A,B3,H,N,BW,c,e,Co,D|ECP,7o,CK,T,Bs,x,i,3,CR,F,BB,j,Bz,g,B1,BM,Y,s,BW,O,u,H|ERZ,BMy,Cy,P,Cg,D,DC,BH,BS,BN,DA,W,BK,v,Cs,CB,CC,Bd,BE,C,B4,p,P,5,CY,L,Ca,BV,Z,v,CJ,b,CL,L,CP,Q,Ep,T,CK,Bw,BT,0,CH,O,BH,6,x,B0,Bz,J,DD,2,9,q,EN,e,BJ,o,BM,y,DL,K,CT,Br,BX,F,d,x,Bn,X,BX,U,Bq,8,s,BM,Bc,s,Bo,m,Cc,U,w,W|Bmm,BJx,Bt,U,BH,Z,Bj,i,BV,C,CF,Bc,Cf,e,7,CE,D,BI,BX,W,Dr,Di,BB,B2,p,i,BR,Ck,Dm,X,BE,X,BE,E,By,CG,Cy,Co,BK,Q,Y,BI,B0,BS,Ca,a,O,BN,Cq,E,Bg,r,q,z,Bi,P,Bq,BD,A,EH,p,CP,J,Cb,g,9,X,B3,f,V,3,CV,DZ,Dp|Bg6,BJR,Ej,CZ,C5,CZ,BF,CL,9,BP,Bx,R,j,Bh,X,BD,CD,v,Cp,K,Bj,4,BX,Y,Bl,v,x,Bj,Bh,9,Bn,Bd,CV,V,t,BI,S,B8,B5,DE,3,e,A,Ja,DK,I,G,Le,Ca,G,E8,BI,BO,BV,CE,BQ,8,A,By,u,k,R,BQ,Cl,o,j,BA,B3,Dq,Dj,BW,X,C,BJ,6,CF,Ce,f,CE,Bd|BCM,BR5,D,L5,C3,Bp,Bv,R,CB,m,Bd,Q,j,BW,BT,4,Bj,Bn,CZ,Cc,BR,CW,t,DI,z,CW,BF,E8,F,D0,b,Bw,BR,BU,Br,Cq,Br,D2,t,CA,Cp,DK,N,Ce,Bk,m,B4,i,CG,H,B6,Bd,e,O,NE,I,CQ,Bj,Hy,d,F6,BU,Cm,s,CG,L,BS,v,A,R,Bz,v,9,A,CF,BR,BP,BU,E9,BJ,Cb,H,H,Lf,DL,J,A,Jb|15,r0,BX,Cg,Bn,BK,Ba,m,Bk,CQ,w,Bq,BG,BC,Bm,T,Bi,s,By,C,Bi,9,CI,1,B8,CZ,CI,CN,K,CD,m,B1,BO,5,Q,BR,J,BB,f,L,Bv,Q,R,Z,t,F,CV,y,Bj,C,F9,I,3,X,BF,G,Bt,j,h,Ce,C6,F,w,c,k,C,BM,u,BY,r,BY,F,Ba,u,r,4,BF,h,BB,A,BR,y,BD,F,t,x,Dh,H|lJ,oI,I,BA,R,BQ,BP,4,n,B0,L,CC,BG,k,g,B4,BC,E,CQ,5,By,o,BQ,P,e,u,M6,C,s,CQ,j,a,Bj,N4,Bj,N6,E6,C,K2,HD,K2,HD,w,Bh,CA,5,Bg,j,C,CD,Dk,U,A,Hd,Bx,CL,R,B9,C3,h,EZ,T,BN,BJ,CH,J,CF,D,z,o,Bx,f,DB,BV,n,BB,Ch,Bd,b,1,BX,p,Bl,a,3,x,f,CP,Cj,Cr,E,BF,3,BZ,O,B3,BX,f,v,Z,h,BW,5,X,l,E,l,7,Cf,C,5,e,b,T,BB,4,M,8,b,Y,r,V,I,BE,o,y,BV,BW,Z,4,t,s,p,E,x,d,BD,b,5,t,BX,Q,5,0,j,G,1,b,h,A,L,BK|3D,BFu,q,BE,Mo,A,n,Eo,y,Bo,DA,S,H,IQ,Kk,L,C,E4,MI,H1,E7,D,Bi,N7,Bi,N5,i,b,t,CR,M7,D,f,v,BR,O,Bz,p,CR,4,BD,F,h,B5,BH,l,CJ,CM,B9,CY,CJ,0,Bj,8,Bz,D,Bj,t,Bn,S,BH,BD,T,Bs,4,Bm,Y,DC,X,DM,Z,Bk,U,Bm,1,Bi,Br,BY|Iq,UM,Cp,Z,z,CO,I,Ha,p,o,H,Bm,BJ,BI,BB,6,a,Bs,BG,W,q,Ba,Bk,S,q,8,BG,6,BK,C,Cc,B3,J,BF,u,B7,p,BT,W,3,Bl,CB,BB,9,n,CD,G,CF,N,FN|v4,BLu,y,FB,BM,1,E,BD,BU,BH,r,BZ,BR,Gj,L,EN,EJ,DF,BZ,EP,BW,BN,D,CH,CG,F,V,Bh,7,N,H,BD,l,F,CN,Di,x,I,Ch,Bz,Cf,6,Bv,M,7,d,B5,G,B5,BZ,Bp,F,D5,Bo,Bh,x,Bp,E,BN,BM,DR,BO,Dd,Z,1,t,d,B1,7,BV,P,C3,Cd,B2,BL,D,BH,7,G,CO,Dv,s,H,Bk,Bz,CG,b,Bc,O,Bk,CG,I,BM,BI,EY,S,C2,g,Q,B8,Bw,CK,A,Hc,Ei,Ba,JU,GW,LE,GI,FG,BZ,By,Bx,CS,BM|Iq,UM,M,FM,H,CE,m,CC,BA,8,Bk,CA,X,2,o,BS,v,B6,I,BE,O,C2,6,BU,c,B0,0,s,Dc,Y,DQ,BP,BM,BN,Bo,F,Bg,w,D4,Bp,Bo,E,B4,BY,B4,H,6,c,Bu,N,Ce,7,Cg,By,w,J,CM,Dj,k,E,BS,BR,X,n,L,BF,Cv,Cf,1,CF,d,Br,r,t,r,CR,Bt,BV,h,Bp,t,BT,T,BX,CP,BH,Bz,BW,BP,F,B7,B5,7,D,Bh,DH,1,CT,DX,BL,BP,K,BP,t,Cl,E,Bv,CC,BF,CU,CR,CI,Cd,D,C1,A|uw,pe,BQ,CF,O,CJ,J,CL,Bw,C7,Bz,C,5,P,Bf,U,t,Bh,B4,B3,Ba,j,c,BX,BC,CP,h,3,Bn,DR,x,l,R,Ch,U,BX,R,9,Bg,Br,S,BL,BM,Bp,Bc,BF,K,Bd,U,7,P,Bv,Cj,u,Cn,2,EF,I,b,K,B5,b,B9,c,Bh,P,FR,E,e,Ci,BT,CI,Bd,i,r,Bc,z,e,C,2,0,CS,Bg,DG,6,C,B6,B4,BO,E,By,BX,CO,BG,S,BW,s,BS,g,Bo,Bs,BU,q,CQ,q,s,c,Bq,0,CE,Cu,Ce,K,BE,W,m,BT,BQ,G,BC,6,M|C4,je,b,Bt,BA,7,BI,BJ,G,Bn,o,p,J,Hb,y,CP,Cn,r,t,BI,3,CC,R,Bm,s,C4,z,BM,T,Ci,A,CU,BX,Bq,O,BA,C0,F|E,ji,P,BB,BW,Br,A,CV,S,Cj,y,BN,t,C5,Q,Bn,2,CD,s,BJ,FF,B5,Bx,BH,C5,7,C5,4,K,BS,BZ,Cw,0,Do,BW,Cs,3,Ek,b,Cc,E,By,Fm,K,Ba,P,BC,g,Be,R|Z5,g6,a,S,4,f,Ce,D,k,6,k,F,4,W,g,BX,u,Y,BW,e,Bc,t,i,BF,Bc,r,BI,y,Bg,I,CM,1,2,El,BX,Ct,1,Dp,BY,Cx,L,BT,Bd,D,CR,o,CF,D,Dz,l,CR,5,DN,BN,n,E,O,Cq,U,Y,H,BS,BX,BW,BD,M,7,4,q,Ba,V,Bk,K,6,g,A,M,BY,R,o,U,c,BM,Y,z,Ck,v,BU,Q,BG,o,Q|sN,om,Bi,D,CU,z,s,E,Q,Y,Bu,R,e,K,K,BL,g,A,0,a,i,H,4,1,BW,R,4,s,BC,a,w,c,o,F,s,t,Y,5,BU,BX,p,z,J,BF,q,U,a,Z,N,9,BA,5,p,R,R,BH,u,BV,y,Cl,BN,Z,V,d,Q,p,N,BZ,h,A,5,E,r,BT,5,A,n,s,M,BS,BX,B8,1,X,r,F,5,N,E,BM,h,0,G,6,t,BW,5,BK,Cl,A,v,n,5,F,j,t,X,5,Bv,Bb,Bb,B4,BP,BS,1,a,z,m,X,Bc,f,s,7,g,Ba,Bk,BA,F,0,i,s,A,g,a,T,BE,W,W,E,BG|1z,n6,Bs,i,BE,H,2,W,F8,J,F,BH,X,X,S,BF,h,b,t,A,1,j,BB,E,Bb,Bl,Bt,BW,BZ,M,t,6,A,e,9,q,P,q|bP,Yy,L,7,U,Bl,r,Bb,6,5,BC,N,BW,BX,G,BT,V,Z,P,Cr,1,A,DV,Bg,C7,Cc,Cx,Bw,CL,CG,w,BC,K,6,Bc,Bu,Bg,Bg,q,E,0,W,BW,B9,N,BT,m,t,4,A,q,BS,4,F|qv,cs,Bu,Ba,W,4,i,s,4,E,u,m,Ck,A,4,BL,s,BX,H,7,g,1,F,BN,4,M,Bh,Bh,Bd,Bv,L,7,x,BD,3,O,CV,BS,Br,Bu,j,BK,b,CY|Rb,hc,P,B2,2,BY,F,BE,Ci,Cq,e,CO,2,w,Bk,b,BW,o,a,0,Cg,Bc,m,BA,DA,BU,Bw,e,y,p,CE,C,P,Bl,a,Bd,By,CH,G,Bl,Du,t,H,CP,r,9,Bl,T,r,Bb,BH,X,C1,E,Bf,Q,BD,h,Bb,O,Fn,L,F,Bz,a,Cd,CN,0,Bh,J,BJ,z,Bd,q,j,BE,Bd,s|BaS,Q2,BF,V,CF,E,Cb,W,BN,T,f,x,BD,H,BT,q,Dl,Bn,Bf,U,d,R,7,B7,Cb,m,CX,U,CF,BM,Cp,BG,Bv,BD,BR,Bp,T,CR,CF,M,CN,i,B5,Bt,Bt,DB,V,6,L,Bc,Bd,BE,BN,Bo,T,BK,Bh,Bq,Q,8,V,BW,Q,Cg,w,k,Bm,DQ,Cq,Q,k,y,i,F,y,t,EC,BO,BY,BQ,Bq,BI,V,BI,4,S,DI,N,DC,Bg,CU,Dg,Bo,BS,CC,i,Y,BZ,B0,CB,C,BV,j,BV,O,BD,BI,5,Cc,Bb,Bu,BT,C,BF,CM,Br,BU,BZ,0,B7,CY,BT,g,BD|7g,LS,N,B7,9,Bt,n,CD,b,C1,M,B1,j,BJ,F,BL,Z,BD,CH,Bl,Bf,Bp,Bb,DJ,I,Cr,1,BD,B3,Bj,B5,CD,BN,k,P,4,Bv,C,BH,BP,1,U,BP,BG,9,j,BV,BZ,Cp,Da,Ce,Bw,BP,CI,BG,0,CM,Y,Q,Ba,Bs,Bj,C0,J,BA,Bg,a,CK,X,Cg,Bj,B4,Ba,Du,z,o,Cb,T,5,Bq,Q,Ba,EE,J,Cm,3,Ci,v,O,Bu,Bs,DA,B4,Bs,CM,j,CE,N|kY,HS,Bg,O,B8,d,B4,a,a,L,R,Bb,4,Br,Ca,S,y,p,Bb,Dv,Bi,B5,W,Ch,b,CL,BB,Bh,C1,I,Bt,Bi,R,Bb,CN,Z,BH,1,BO,CJ,Cf,Bx,DT,DQ,CJ,Cq,B9,DU,G,BE,s,BC,w,CW,o,CY,BG,M,Es,D,D,D2|fI,HW,FQ,F,C,D3,Et,C,BH,N,l,e,BG,Dm|BlK,a5,BW,z,BS,j,CC,j,B0,9,Bg,Bd,0,Cv,j,3,r,Cn,o,Cr,BD,BH,9,DB,Bq,1,Jx,Cr,S,CT,Cb,b,B1,BT,Z,BJ,BL,R,Cz,Cp,Bz,CH,BF,F,BF,W,Dn,W,l,Q,A,Q,BT,u,CH,K,Cn,t,CJ,CA,CL,Co,I,KQ,Gu,D,T,BG,e,BO,l,Bg,Y,Bi,X,BA,BI,F,K,BB,Bg,E,CE,T,BE,Bd,Ck,d,B8,BA,u,Br,Ce,d,BK,BZ,BU,Bx,Ce,D,R,De,5,l,CR,BQ,3,k,a,DO,i,Dy,t,Bc,4,CC,2,Y,EW,i,BQ,V|Brq,dx,DK,n,o,3,BG,Bh,4,EZ,5,Cd,4,EN,BI,C,BK,BD,BW,CV,Q,EL,BZ,r,BB,CP,CH,CA,P,CQ,q,Bg,N,BS,BT,y,3,T,B3,Bi,Br,0,8,DA,BC,BG,p,Cq,q,Cm,i,2,1,Cu,Bh,Bc|Bxe,lL,Ca,Q,D2,5,2,a,CO,E,BK,8,B6,F,Dg,BQ,Ck,B2,g,Bd,J,DN,Y,C1,I,FD,k,Bl,9,CV,BR,CP,CF,CB,C7,BP,Dp,Bl,Dp,Dd,BP,l,CR,CT,BV,v,T,CV,Bi,Cb,m,B5,E,9,i,K,H,DL,h,Bh,w,j,f,BV,BX,BL,Cp,BH,D5,Bv,Bb,BN,S,BX,0,P,T,Br,Cd,C,R,Ba,f,Bc,T,BK,k,Dk,1,CS,Bj,Ei,DY,Do,2,CU,e,U,W,B2,h,8,I,Ca,o,CO,A,EG,Br,BC,Bj,O,r,y,Bh,q,Cr,F,P,BM,T,CS,Jw,Cq,B2,Bj,2,S,BS,z,M,BT,r,Bh,O,CR,CG,CB,BA,CO,BY,q,R,EK,BX,CU,BL,BC,BJ,D,5,EM,4,Cc|Bpc,BYP,p,Bd,B5,X,B5,Bw,D,BG,2,BO,S,6,6,O,Bo,l,e,Bd,Q,Bb|p6,Pb,BN,r,h,1,H,BZ,1,X,3,Ca,BU,BY,8,i,BO,BH;nu,Tr,BW,a,4,D,BK,Y,Jg,F,w,CZ,6,B7,u,BF,BO,Br,CI,Q,BE,c,By,d,e,y,y,B2,CA,I,K,k,Bo,A,T,BL,D6,C,E,CD,o,BR,f,B7,Q,B9,BE,BN,L,D1,w,S,Ba,H,CA,e,Bc,N,W,BB,Z,Bj,k,Bh,f,BP,S,BH,Gv,C,J,KR,CK,Cp,CI,CB,F7,BV,Hz,c,CR,Bi,NF,J,f,P,B7,Bc,CH,G,B5,j,Bl,n,T,CC,c,C0,BG,C6,M,BY,BC,C4,w,BU,B0,CI,BC,Ba,W,CY,L,B0,9,BK,3,B6,x,B6,K,q,BA,BS,BB,DG,p,CK,Bn,CE,S,m|BkS,Hx,M,BT,q,t,C,BF,x,r,BR,Br,BN,BL,BV,L,N,D4,1,Bc,B8,R,BA,B0,Bs,N|B1O,Brg,j,BD,BN,c,r,CJ,0,Z,1,b,J,3,Bg,c,E,BR,Bn,FL,V,0,Bx,Es,6,BE,P,M,0,Be,q,Cc,c,y,G,C,BE,A,S,i,2,E,E,BV,d,f,E,D|B1i,BtW,3,F,T,j,BF,A,BI,Co,Bm,CQ,E,G,Bc,L,g,BR,Bv,BP,z,Bv|Cjy,oP,2,BZ,y,CJ,g,D3,0,Bh,V,Bj,l,7,BH,B4,n,9,m,CZ,T,BZ,3,v,N,Ct,BT,Dx,Bl,Ed,CB,GH,BP,Ef,Bd,Dv,Cp,x,Cz,BX,B3,y,Cj,BK,5,Bs,N,C2,BJ,Ci,V,CU,k,CU,Be,k,C,BE,Bg,Cc,S,CC,v,Bi,n,CC,R,C8,BI,By,c,CC,Bk,I,By,q,BM,k,Ba,C,B0,B0,Cq,CA,8,Bm,d,BY,BW,Z,By,CO,C,B6,BE,Bc,BI,BZ|B0M,Bnk,Bh,d,I,2,0,a,1,Y,q,CI,BM,d,A,B9,f,7|15,r0,Dg,G,s,w,BC,E,BQ,z,BA,A,BE,g,q,5,Bb,v,BZ,E,BZ,q,BN,v,l,D,x,d,C7,E,a,Ba|ek,Bjw,BX,Fw,CB,BU,D,w,Cp,B4,T,Cc,CA,By,w,Co,h,DE,o,Bq,Dg,BS,CQ,Z,H,Bp,Cu,BM,O,n,Bn,Bl,D,Bf,BI,z,b,Cz,CJ,Bn,m,Bv,Bq,F,y,Bj,BO,f,N,Cf,Bl,7,9,BD,CP,BP,W,BX,T,BX,Bl,v|cB,BaY,C,m,A,O,A,Dy,FM,CY,DO,e,Co,2,BO,Bm,Dw,BS,I,CY,B2,Q,Bc,BM,EO,i,m,BQ,3,q,BH,Da,N,B8,BP,CE,DG,Bu,De,k,CC,BU,DI,BA,Fc,i,FW,S,Bm,f,DC,BQ,Dc,C,BU,v,CM,M,p,Br,g,DF,x,Cp,CB,Bz,S,Cd,Co,B5,C,x,CA,BV,BW,Fx,BE,C3,K,Bf,l,Cp,Q,Bd,b,Bx,S,CD,BT,BX,B4,CV,I,BZ,BI,Bz,Bg,k,Ci,Bf,Ba,CD,LF,GJ,JV,GX,Ej,Bb,Dl,V,D,CC,Bh,i,CB,4,x,Bg,K3,HC,K3,HC,MJ,H0|B0q,Bqe,i,BC,Dk,BT,GU,Dc,BU,D7,p,f,Gd,Bn,DO,DP,BF,j,j,BH,Cd,b,x,BL,BZ,BB,Dl,g,J,c,Bm,FK,F,BQ,e,6,A,B8|CqY,BQO,k,I,G,3,Ci,g,Co,H,B8,H,CM,CM,Ca,CE,CC,CA,m,BJ,c,Cj,Bp,A,T,CH,k,d,Bd,p,A,BV,9,BV,F,BT,p,r,Jt,Bm,BP,DQ,J,w|Cn4,BR0,P,CW,2,Bs,4,U,8,BB,E,B3,t,B5,5,P,9,m|Ceu,Bis,q,Bd,T,t,BE,Cd,CT,F,z,Bg,C3,U,CW,DG,CK,R|CCc,Bpu,BV,D6,HK,DW,BM,D4,T,CW,Bw,y,Bo,CA,BY,g,Du,b,BI,1,Bi,i,CG,D1,CI,9,O,B5,Bn,BH,v,Ch,CO,DF,D6,Bx,Bq,Cd,h,CX,BA,C,C,Bv,By,Br,B7,K,CL,Q,CX,DH,GB,Q,JH,Ge,Ez,CQ,D3,2|C2G,BLQ,E,BS,8,BU,A,BU,Bc,o,l,c,S,CG,Bo,A,Bc,CN,Bw,BL,CY,b,B4,l,Bc,B3,2,BF,BK,b,A,t,BN,B7,h,5,BX,BD,BN,CN,Bf,K,p,x,h,Bn,Y,CL,V,b,Bf,C,CB,BP,V,Bj,v,r,CB,A,BR,z,A,BT,Bj,5,Bx,S,CL,BF,Bf,N,BF,CQ,Ch,FU,Jq,DO,CK,Gc,Bf,CS;C5e,BU6,n,BI,6,BG,a,T,V,BV,b,n|Ira,zR,CA,B3,BD,b,BH,Ba,I,2;IqC,yj,d,4,F,Cc,Bi,9,g,Cn,3,a,r,N|FU4,nU,v,D2,CE,Cs,EK,m,DC,f,Co,BR,Be,CO,C0,BN,u,CJ,Z,D3,Fb,Cf,Ba,B9,DZ,P,Cz,BT,Cr,c,BV,Bq,Bp,DW|Fda,uC,DD,e,EL,n,CF,Ct,u,D3,C3,Be,Cx,F,e,Cg,C1,A,R,Dj,Bv,Et,BF,C3,O,CV,CG,H,BU,C7,k,Cz,By,B1,B6,Z,Bq,Br,BF,BV,CJ,Z,P,Bo,Cp,Ba,j,l,BT,BQ,j,Bk,Bt,B0,Bl,Bg,h,B5,n,By,W,CA,6,DG,Bk,DU,Bw,DA,BR,C6,C,Bg,X,By,CL,Ci,x,Bm,BI,m,BK,Cy,BV,CI,CD,CW,Bj,C0,BW,k,Bc,De,CS,I,B2,Ba,B2,u,BY,BB,M,B7,CK,L,x,DZ,E,C5,DY,B6,8,l,B4,G,o,BI,Cc,P,Cc,Cn,M,DN,Cm,Cz,L,Cv,BD,Bd|FkY,ty,C1,BM,Bf,CP,Cp,BQ,BC,Bc,K,Cu,Cn,Cy,N,DM,Cd,Cm,Cd,O,p,BJ,B5,H,9,k,DZ,B7,F,C4,w,DY,CL,K,N,B6,BZ,BA,q,BM,Cu,CG,S,x,Bs,H,f,Ds,Bq,c,B2,Ch,Bc,C7,EA,D,BO,Cz,CF,3,5,BJ,D0,B7,Cs,Dz,CC,C3,Ca,CP,y,CT,l,DP|FM8,BD2,B3,v,B3,Bb,CT,J,Bd,Df,BX,l,Bi,C1,CC,CX,BU,CJ,BL,Cz,BJ,n,w,Bn,CK,Cj,W,Bz,D,Bh,BQ,C7,Bx,DB,Bl,DV,T,Ca,8,Cc,BF,B4,Q,Dg,BV,Bq,BD,D2,l,EE,Bb,Cq,CH,Bn,Dr,CV,Bz,S,CB,w,BG,EA,r,DA,Ch,Du,Y,BK,B3,a,CT,Cm,P,Cm,BI,h,E,CU,Bm,w,X,BW,u,BG,I,DW,Cg,v,Ba,Cq,K,Bi,By,Cs,J,B0,EM,CO,CS,l,R,CA,BI,k,P,BO,B2,Q,BG,B5,BY,x,G,Cf,J,Cp,DF,Ct,Z,Dz,Da,g,w,C9,CC,n,7,Cr,CY,BP,Ba,l,CW,6,G,BV,Cv,CH,r,BN|Fai,h0,Cy,BS,DY,O,Bb,B8,Fa,Ce,Y,D2,v,CI,k,DO,z,CS,Cb,CO,CD,C2,Ct,Dy,D1,B6,4,BI,CE,2,BP,Cy,EB,C,Bd,C6,B3,Cg,Bu,y,Ci,D,DK,Y,Cu,Bs,Bi,BN,C8,n,h,B1,Bg,BV,DQ,1,ET,Cv,Ct,DF,t,CP,Ce,Db,DA,EN,C6,CB,B8,Cl,Be,F9,d,Fr,Cr,CJ,Dt,CH,Cn,Cr,ED,DB,BL,CE,4,CM,Cb,B0|Gxa,CMw,c,l,BP,M,BZ,BH,9,BH,I,CV,Br,t,l,j,BP,9,CJ,h,Bb,3,H,Bb,X,X,BQ,h,B0,Bb,d,x,BZ,P,CT,J,BR,Bf,Bb,I,P,T,Bj,m,Z,n,7,R,J,m,1,S,3,g,4,Ba,u,Y,T,k,0,Bu,P,g,B3,W,Bh,2,Cm,CE,Di,Bu,CO,CS,Bg,BD,Cy,H,h,Bq,FA,BY,BQ,B0,CG,B5|GjA,B7w,O,S,Ba,J,BQ,Be,CS,I,BY,O,c,w,Cw,Dz,y,CH,C,Dt,BP,Bx,C5,n,Cl,BV,C5,T,Z,Bu,m,Ca,Bb,DY,CY,g,CP,Cw|EjE,CjC,Da,i,GI,Cw,E4,Bg,Cy,9,DY,F,CK,Bh,DM,H,Eq,z,DI,CO,BT,B4,DU,DW,Dm,BX,C6,X,Dy,1,m,Cb,Ek,BX,DC,m,EG,a,DO,d,DK,Bj,B8,Bp,C8,C,EE,h,C8,y,EQ,g,Es,CS,B6,X,Bs,BF,D0,Q,Bl,Cd,CR,DN,y,BV,B0,Y,DM,f,Cc,BM,Cm,BD,C4,CR,X,BL,Cj,Y,Er,d,CR,5,CX,CJ,E7,BR,DP,Bt,DT,o,B1,S,Br,CF,BC,BR,g,BF,CR,BF,CV,Bv,Dx,BJ,E1,J,FN,BJ,Dx,Bt,Bb,BA,D5,A,Ex,B6,DL,e,ET,d,Gr,u,Dj,F,B5,B4,Bd,C8,CB,W,D5,CC,EX,c,Dz,i,BL,BY,BO,Dw,CP,Ck,En,BO,Ct,Bs,1,CQ|FD8,BdK,O,BP,BJ,l,Q,CB,CT,k,EN,CP,I,B1,Bz,Ct,L,Bj,Bb,Cr,Ch,u,J,DX,v,BH,W,BX,Bn,x,Br,FI,5,D,h,CD,Bx,Bo,BA,B0,Bc,M,Be,Cu,B3,i,DB,F,DF,c,T,CQ,Bh,I,Cl,Ba,BJ,CN,CU,Bt,CB,BN,v,BN,CA,3,j,B7,BI,Cb,e,Cp,d,BN,CN,C,D9,p,K,Cd,Bt,B5,Ep,CL,Dn,Dz,Cb,CD,DP,CH,A,Bf,Bn,z,C5,BL,Bh,L,7,Cd,o,EN,M,Cr,BZ,DF,A,Ff,Br,L,Bd,Cd,8,BF,C7,7,BH,CN,BT,5,DF,DA,Bf,Eg,BP,DQ,BJ,Bg,Bv,DG,x,EC,l,CC,C7,Ea,BV,GQ,9,EI,A,D4,n,DC,Er,B7,CT,Y,EP,D4,Bi,BK,7,BQ,Dx,Cu,CI,CK,HG,A,p,Cw,Bz,Bm,X,Ce,CJ,Bc,Dk,DY,Du,R,DW,DY,CC,DS,DI,DO,D,CS,Cu,B2,Cn,Bk,BJ,CM,BJ,C0,Bk,BY,E4,z,Dk,e,DI,Cs,Dc,Dx,V,Cn,BS,Br,H,Bp,CV,c,4,Dj,DK,CF,Ee,CR,CD,Bd,BR,DD,DI,BN,DC,Bl,EM,B1,Ec,b,B0,Bn,Ce,V,D4,v,Cq,C,W,BS,b,CE,Q,BY,B8,q,Q,Cj,G,p,C4,BP,CC,g,Cu,P,Cm,G,O,B8,BT,BC,Ck,a,C6,CY,Du,CE,Cq,z,CU,BW,Bg,CB,BH,BX,De,f|Ey6,BJG,F,CV,BJ,g,O,Cn,7,Bq,L,Bo,p,Bi,BV,B4,C9,I,S,BX,BD,Bx,BX,o,f,l,5,W,BR,S,f,Co,BJ,Ca,i,B6,CB,2,u,BM,CA,BM,CV,Bs,BI,CM,Ck,Bb,Bg,J,S,CR,DE,d,DA,E,B2,j,Bf,Cv,Bd,N,BB,B1,Bw,Bp,g,CC,4,C,Bq,FJ|Evy,Bbk,BS,BD,P,B9,Cn,H,Cv,O,CD,h,C5,BO,H,o,CK,CY,Bu,0,CS,x,Bs,F,Ba,3|EkQ,Bb6,R,BZ,a,CF,X,BT,Cr,D,D5,u,Cf,U,B1,Bm,Ed,a,EN,B0,DD,Bk,DJ,BM,BQ,DC,CC,Bc,BW,w,Ck,9,DQ,CJ,By,d,BE,Bj,Cg,p,Cm,Bb,Do,v,Dw,T|EDG,B0e,DJ,Ct,Dl,f,E5,y,Bl,BZ,BI,C1,BI,CN,Cm,Bl,Cv,B3,C,CT,DJ,DP,CD,DT,DX,DZ,Dv,Q,Dl,DZ,CI,Bd,W,Cf,By,Bn,o,Cx,HH,A,CJ,CL,CZ,y,7,CU,Ch,Ce,F7,n,FP,F,Ej,d,BM,Du,Eq,Bq,T,Be,Bh,g,H,C0,DH,Ba,BT,B6,Bn,Bs,Fa,Bp,DO,e,B6,b,o,s,CQ,T,EM,BW,G,Cu,By,By,CY,A,W,4,Ce,a,BM,T,BQ,4,N,B6,BY,B8,CC,y,BR,CI,DE,H,4,BK,J,BO,Bk,BW,X,Bm,x,BW,B4,Ba,Dc,q,Ds,Y,Bo,k,B2,W,CY,Bf,6,Cf,FU,BV|Dck,B6g,By,A,Ca,t,BA,Z,CU,BC,BG,n,BC,Be,B6,F,e,e,W,BS,BY,BI,Bu,v,X,BB,8,J,T,Ct,BQ,BF,BI,q,Bc,U,CA,Bc,CO,R,DU,A,k,7,B3,X,Bp,l,Dt,Z,Dd,r,B5,Bb,w,BX,W,Bn,Bl,BX,I,BP,5,BL,DF,G,BQ,CJ,CD,z,BZ,B9,M,B7,BR,5,BN,S,Cf,b,X,5,CZ,A,Bz,Bz,H,Cv,EN,BX,CR,S,p,t,B7,a,DP,f,Fb,Bo,C6,C6,R,CE,Cd,i,R,CC,BD,Ck,BW,Bw,BZ,e,2,CU,BU,EC,DS,BP,Ca,a,q,Be,Ci,e,B0,8,o,Ck,Cs,o,g,BI,Bg,3,8,H|Dgy,B5y,By,DS,r,CY,CZ,w,0,Ba,Cs,L,Bg,By,BC,CE,EU,u,r,Bf,c,5,BU,E,BL,9,Dh,g,V,B1,Dg,O,D8,BD,GI,e,y,C9,BE,U,B6,v,H,BR,e,B1,DV,A,CP,Q,CB,Bd,Bd,V,BJ,r,BR,BE,S,Cs,9,I,W,BA,Bv,u,BZ,BJ,X,BT,f,f,B7,E,BD,Bf,BH,m,CV,BD,BB,Y|Dq4,CMW,u,BY,CG,e,FU,BJ,g,B4,By,q,Em,BX,BK,W,FW,H,Ew,V,Bm,BL,CA,f,d,v,FH,Bv,BJ,BR,EL,Z,BN,CF,Db,a,CP,n,DH,Bj,c,v,5,v,GJ,f,D9,BC,Dh,P,U,B0,Dg,h,BK,8,Cc,T,EK,CU,D1,Bq,CT,z,CZ,BO,Cs,CG,9,U|CtW,CKw,Ba,BG,Dq,o,CM,5,CQ,Ch,Bo,K,Do,C,j,Bo,Cw,BG,Cs,B2,EW,Bt,U,Cj,BQ,r,De,K,BE,n,Bk,DV,Ds,CP,CG,Bh,DY,Bl,ES,BZ,H,B9,9,G,Bh,2,h,BJ,Ct,p,p,Cl,B1,9,Cj,f,r,Bf,Cb,b,DT,BO,T,Cs,CZ,I,Dt,C0,Cj,W,Dl,Bo,CT,S,Bb,l,CL,E,CT,B1,C1,n,l,CS,c,DW,Ch,BG,0,CO,CL,K,u,Cu,DC,z,C0,BC,CX,B6,7,B0,Cl,z,X,CX,BB,CE|Cgq,Bii,Bz,Bq,D,Bu,BB,D,g,CW,Br,Cc,D7,Bw,CP,DE,u,Cg,Bm,BG,P,B4,CJ,8,CH,D0,Bv,Ck,m,BA,BB,Ds,CM,4,g,BN,Bo,Bh,CM,b,BM,G,Dy,CY,BM,O,8,7,BJ,Bn,CA,Br,y,K,BC,CZ,DE,r,CO,Bn,Ek,j,FE,2,S,u,C0,m,CS,B0,CK,F,Ba,k,CS,T,Dk,Bp,Ci,X,Ds,C1,CY,J,S,Ct,BV,ED,3,CV,BY,f,BX,Bx,BC,Cl,Q,CD,Cc,j,Q,CF,C7,C7,Bm,Bt,BS,B7,DG,Bb,G,C1,Bg,h,S,Bf,Er,Br,BN,Dv,GF,8,Dh,u,Dp,a,BZ,D8,Bj,i,Cf,l,DP,Bj,D9,BE,DR,Ce,DH,6,CL,DC,CX,EU,Bv,h,CF,BE,BN,BR|B1O,Brg,F,C,c,e,F,BU,y,Bu,Bu,BO,h,BQ,Bd,K,T,Ce,w,BU,2,s,2,s,K,By,BE,p,Di,4,Bs,n,Co,C,Ds,BM,Bu,F,Dq,g,Bp,CB,Bx,z,S,CX,BN,D5,HL,DX,GV,Dd,Dl,BS|CaC,CBE,BN,H,BT,B2,A,e,Bb,A,9,2,r,H,BR,8,CZ,w,S,Bk,j,BI,Ee,g,q,1,BO,l,p,z,Bs,BH,5,BD,BW,3,Bc,j,G,CP|jk,DD2,Ba,B0,Cq,CO,BE,Dw,CF,Bo,N,ES,CG,DC,DM,F,BI,BS,BL,BG,FA,Eg,DO,Dk,CI,CS,DG,A,0,By,GG,h,e,CI,CA,I,ES,Bl,FC,CN,G,E9,BE,BR,Fj,7,DJ,CP,g,CB,FJ,Cl,GP,Cx,CX,Ej,CS,CR,DG,Bz,C9,Dp,DX,v,BP,Fb,B1,DD,D5,U,B1,Cj,Dv,L,BB,DE,Ct,Do,Cd,Ek|Bc4,C5M,DY,z,c,z,Bs,Y,DI,x,U,Bh,r,3,CA,CH,BU,n,N,l,CM,j,4,3,BR,t,Cl,I,n,V,u,BF,y,CF,Cx,N,BB,t,N,Bn,BT,U,C7,L,1,u,BN,j,BP,c,Cj,E,Dl,w,DR,Q,Ch,F,Bv,3,Bj,J,F,Ba,BB,Bg,B6,o,A,BS,3,BO,L,Ba,DI,A,Dg,BM,u,B0,Co,BC,V,Bc,B8,g,De,BQ|Boi,CsE,BM,J,y,u,BA,L,DU,U,CE,B1,z,p,Q,BB,Ck,L,BK,Bb,F,n,EG,BJ,Cc,e,CA,Bf,B2,C,Ew,BF,C,7,BV,Bt,u,Bx,h,BF,DJ,P,Bp,5,J,Bd,Cj,R,CL,BD,DD,L,Cx,BP,K,Bt,f,G,b,o,BD,I,CT,q,1,z,d,W,FD,y,N,BO,DB,b,BN,Bx,Ch,CZ,Bd,i,Bh,h,Bd,m,0,W,i,BG,2,BC,P,k,q,Q,U,d,B4,H,0,O,l,W,O,c,BJ,0,d,BW,BN,g,O,BG,Bd,2,BV,I,CZ,BA,CJ,V,x,f,BX,A,z,v,CZ,V,BH,f,Bh,w,CF,C,CB,W,BZ,t,P,2,Bx,2,m,BU,4,0,s,N,1,Bc,C6,Cq,Bk,W,W,6,Bn,Cy,Bi,I,Bu,2,Cg,E,DQ,R,Dk,x,Ci,F,BO,d,BM,i,0,v,C6,K,BS,V,M,Bm,BA,s,Cw,M|BNu,Cx4,K,Bb,2,BP,A,BT,B7,p,BA,Bh,E,Bb,Bm,Cz,X,7,Bl,X,C7,Cr,0,Bd,t,M,DF,BO,CV,d,Bh,U,B5,r,Bp,BI,BV,b,N,M,Bf,Bk,CZ,M,V,BA,CN,W,f,z,Bv,o,M,4,Cb,Q,Bh,BE,BV,CE,Q,BG,z,Bs,BN,BK,4,2,v,Bo,CM,6,FC,Be,EE,BG,DO,j,Q,x,DG,D,D8,Z,F6,E,Bo,X,w,BB|2w,CfO,R,BV,Bz,A,m,r,BF,CH,n,j,Cz,F,Bp,v,Cp,Q,En,0,v,BI,DN,l,X,n,B9,c,Bp,G,Bd,k,e,y,J,k,BA,K,Bm,5,c,2,C2,L,CS,k,Bi,H,BA,p,U,i,f,CG,BK,a,BK,Be,CY,BD,By,BS,BI,Q,Cg,BB,Bg,M,Be,n,R,b,U,BJ|BJQ,CgM,Bw,3,O,3,B9,r,Bh,CN,B9,CL,Cl,n,CB,I,Cf,1,BN,f,Cr,m,Cb,BY,BD,Y,n,BG,j,C,BE,CG,n,q,By,A,Q,BU,Bo,z,BM,X,Cs,Y,Q,o,BQ,G,Bk,g,W,P,Bg,a,u,u,BE,M,Dc,9,s,U|BX2,Cfi,w,e,CI,U,CY,BB,BU,J,Bc,3,P,BH,BM,h,c,BX,BI,1,P,d,k,X,1,P,B5,G,V,c,r,R,O,l,3,BD,j,BH,1,X,l,Bc,W,BY,H,Ba,B3,B6,BD,BW,BB,6,9,U|BdE,CWu,Bc,n,Bg,g,Bc,j,G,z,Bl,t,9,S,5,D3,B5,U,CX,BM,Dx,x,Bn,z,Ev,K,Cf,g,BR,R,5,BU,n,k,w,i,z,Y,BB,t,B5,6,R,BU,B9,w,X,BA,Bv,BS,Ck,m,B8,CK,Bg,CM,B8,q,BY,s,CA,X,CE,D,Bg,x,BG,e,CY,U,y,u,BW,A,8,V,BA,7,BC,BX,B2,B7,G,Bb,X,BZ,k,Bd|BXc,C3a,U,Bd,Cp,BD,v,B1,Dh,BN,DJ,A,x,BA,Bp,W,R,y,W,4,Bb,g,DZ,i,r,Cs,Dq,BA,Fa,P,DK,U,c,r,Bs,N,DG,Bj|BaC,C9Y,Bi,v,S,Bj,BC,B5,Df,BR,B9,h,DH,Bi,Bt,M,d,q,DL,V,Fb,O,Dr,BB,G,Ca,Bk,CC,DC,BG,Ck,CZ,Ck,E,m,Cc,Cu,k,Ba,Z,Cw,BN,Cq,D|BcQ,DF2,e,l,CT,B3,8,DB,BZ,BD,Cr,C,Cx,BM,Bb,Y,Cv,l,Y,B4,BN,Z,CD,BI,T,B2,EE,4,EE,c,Dg,h,DU,G|ti,Cxa,u,Bp,5,3,BM,BL,y,Bt,R,BH,BU,CF,Bd,X,1,Y,z,n,CV,p,BN,z,CX,r,k,9,U,BX,Bo,x,B0,BZ,BL,Bf,BL,b,e,CH,V,j,BB,o,Bj,G,CT,l,C3,K,d,3,Bn,4,BB,L,Dd,8,p,t,Cv,C,Y,CS,Bo,CO,Ep,k,Bh,0,K,Ba,p,u,Y,CK,j,DY,B6,A,y,BO,y,C6,l,BG,m,q,Cs,M,k,t,CM,Bk,v,BO,J,By,Ca,b,CE,e,E,BP,DQ,x,D,BJ,DS,m,By,2,Do,BR,Bg,BD|BLG,CSq,4,BV,BQ,Q,Ce,h,Eu,L,Bm,y,Dw,w,CW,BN,B4,V,Br,BX,BN,CT,BE,B1,Cx,a,DT,BB,D,Bn,C7,V,CT,BI,Cl,3,CZ,G,P,CI,Bn,BC,i,c,X,Y,g,BC,BQ,BA,Bl,BY,T,BM,y,s|BWy,Bz2,b,9,Ep,R,E,g,D9,o,m,BY,Bw,BH,Cg,K,CY,P,F,j,Bu,Y;BMC,CJW,CY,H,Ck,2,CS,BJ,C6,U,C,Bm,Bi,3,BB,CB,v,Z,B9,G,Br,U,D7,1,CQ,B1,Bp,h,Bz,A,Bt,Bq,l,t,s,B7,Bm,Bh,BP,t,By,Bf,Bm,7,C,Bz,C9,0,6,Bp,CF,V,BO,C3,CJ,D,Cp,BY,BN,Ck,l,CK,BR,Be,Bp,B0,P,4,Bg,Bk,K,BE,BE,c,E,0,CG,S,BQ,s,Bu,F,g,i,m,I|CUa,B54,Bj,j,BJ,0,Dv,a,BZ,h,Dr,h,Bv,E,Dt,BN,Cp,D,Bt,m,Dj,5,BF,o,L,Bz,3,t,3,t,BN,Bc,BO,BO,B9,R,Ct,u,CN,B3,E5,X,Cn,Bs,Df,I,v,BX,CP,Z,DJ,Bu,Dh,F,B5,DM,CX,By,Bi,Cg,CD,Bg,Dk,DG,E8,I,BW,Cc,GK,b,D2,CG,Du,4,FW,E,Fm,CR,Eo,BR,Du,e,Cw,T,Dy,Bs,Dc,I,DG,Bl,i,BJ,T,Bl,CY,x,BQ,9,CN,5,BA,Dt,n,BB,Bu,Cl;BWQ,CK6,DS,BA,Cw,b,Y,BR,Cy,BD,l,z,D1,L,BZ,BB,Cr,Bv,BD,Bg,E,o,u,Y,BA,CA,Bj,2|BFy,CHu,F,1,BF,d,L,BF,Bh,Bl,j,O,F,u,Bx,BE,T,Bi,Q,CM,c,BA,j,g,P,BC,Ba,Bk,M,n,2,S,q,3,w,V,O,BL,b,BH,e,BZ,BU,z|1a,CaA,BC,Z,Ca,BZ,Cq,n,BM,e,w,BR,BC,5,BP,BP,Bf,s,CP,D,Cx,g,Bh,F,r,r,BL,u,r,BV,Bk,Bh,s,BB,Be,BN,BO,t,BM,BX,C2,BP,X,j,DD,BM,B3,BK,C7,8,Cv,CW,q,Q,Bf,BW,F,BG,CF,e,BB,BZ,7,BG,E,BG,I,E,CO,H,m,g,BG,h,BQ,F,D,4,BI,U,U,BU,Ci,0|e6,CdU,I,l,f,z,Bc,l,Bo,H,R,BV,Bb,j,CZ,a,r,BT,Bj,H,j,e,Bz,BH,Bl,J,BZ,q,BH,Ba,Bj,h,E,Be,CW,By,H,y,Bc,T,4,i,Cu,D,o,s,Dc,9|Te,Cls,o,v,L,Bb,7,F,v,S,W,By,0,I|T2,Cn2,Z,CL,1,J,X,Bz,Cz,Be,Bp,R,CR,Bg,Bh,BS,Bf,E,f,BI,Ck,o,C,A,D,A,CY,R,C8,q,CE,Bb,Bw,x|WS,Cwg,k,BH,z,C7,z,BP,B7,A,i,DZ,Bx,w,CF,Ba,C9,r,CZ,Q,C,A,Bo,2,C0,Eu,EY,BW,Cs,H|dJ,CLG,BK,y,BU,e,y,Bl,B4,A,i,a,B2,J,4,Bn,Bf,3,D,Ch,j,f,J,Bh,BZ,R,BS,B7,3,CJ,BG,7,d,5,BN,BN,S,BF,BV,1,Br,c,Br,X,e,Cg,T,CA,Bd,S,x,BO,Q,CG,BS,BM,O,BS,q,B6,F,BW,p,BK,J,BG|YD,B5q,T,BE,BM,BM,c,4,BH,6,2,CI,BT,B6,BY,Q,I,Bg,i,e,C,Cg,Be,2,5,Bm,B3,I,j,b,B5,A,z,Bk,BV,f,BL,z,K,CS,BV,Ba,Ei,CU,D8,l,EU,A,Da,j,Cq,M,FO,J,BS,BR,F6,Bd,BK,s,Do,Bf,Du,a,K,B3,DF,CJ,EJ,t,T,BF,B9,Bz,BR,Cn,BQ,B1,B3,Bd,r,CH,Cd,p,CT,Cf,EH,D,DF,E,CD,BL,BP,BN,Bl,Q,BN,BG,5,B0,DB,g|UB,Cxw,i,CV,Cd,C3,Ft,B5,El,e,Cm,DW,Br,DS,EY,Cg,Cc,Bg,o,Bt,p,Bv,CA,C,Ca,p|Imw,BGB,Co,CB,Bq,Bf,BP,x,Bx,2,CV,Bc,CF,Bs,CJ,CS,d,BE,BY,D,By,BH,Ba,BH,BC,5|Ia8,hz,4,BJ,CR,C,BP,CA,B6,z,o,H;IZi,e9,f,l,CZ,Cw,r,B6,BG,A,BK,Cl,BS,Bj;IW2,f1,BR,H,B9,W,r,e,M,BS,CI,h,BE,r,g,1;IS8,Z3,w,BD,I,p,Cj,BY,Bv,BK,BP,BE,e,U,Be,x,Co,Bf;IK4,Wp,BS,BF,p,L,Bb,s,BV,BU,K,i,B6,BX|JMm,CFR,BP,Bt,Bn,CP,Cf,BT,j,0,BX,e,B2,Co,BF,Bw,Df,BS,G,BK,CU,BI,i,Ce,J,CG,BV,CK,G,k,Bj,BU,Cj,C0,BV,CS,BM,Q,Bu,Bz,Cg,1,4,C3,CW,DZ,E,CM,Bc,3,e,Cd,Ck,BD,CM,R,B0,BO,Bo,Z,z,C1,9,B5,Cd,E,3,9,S,BZ,d,n;IzU,CQh,Cu,Bs,B8,Bq,Ba,CY,BO,0,e,Bw,CQ,Bg,s,BZ,u,BV,CS,BS,6,BX,A,BX,BN,Bf,CJ,CZ,Bp,BT,BM,Bj,Cf,F,Cx,BN,1,CJ,B1,DR,Cj,Bd,Bn,5,C9,E,CH,BE,Df,O,j,BM,Bu,CY,EC,DM,CG,k,CU,BO|Hqa,CHp,B6,P,O,Dz,BH,BJ,X,Cl,BJ,2,CP,CP,r,K,B9,G,CB,Cw,b,CI,B3,Cy,E,Be,CI,T,DG,BJ,Bw,c,Cg,m;Gi6,Bp7,Db,Bp,Cz,v,n,Br,BN,BV,Cv,F,CD,T,C1,k,CV,X,CP,L,B5,Bt,7,K,Bn,7,Bl,BB,CV,G,CL,A,Dd,CE,Bt,m,E,B2,Bm,a,g,u,H,BK,Y,CO,X,B6,Bt,DQ,h,B0,I,B0,BT,CG,F,6,Bd,BS,Z,Ci,B1,Ci,d,BW,Ba,BZ,BH,DA,Bm,7,6,BR,D,Bo,Bn,Ci,T,BC,x,8,W,B0,q,y,a,Bm,V,B2,BU,CU,Q,Cd,BW,CO,Cm,BE,Bk,BY,Cc,BM,Be,Q,2,b,Ci,BO,B8,W,e,s,0,S,By,H,DY,8,Bu,Ba,0,Bs,B2,Bo,K,BS,E,Bw,CQ,Cs,BW,Cx,BY,o,BL,Bg,BC,Bk,Ba,t,Y,Cc,Bw,Bk,w,BS,Bm,i,E,4,Ba,Z,C,y,Ba,e,Bk,a,CW,Bf,By,B5,CC,D,CC,T,r,Bw,Bi,Ck,Bc,0,h,y,Ba,B0,B6,BK,Bq,Z,Cs,m,F,Bo,CZ,BE,Bu,c,CI,z,Bs,BV,Cs,z,6,U,CA,BB,B2,6,BO,T,u,m,Be,Bl,1,Bv,BP,BT,BJ,H,Y,BT,9,Bn,BJ,Bn,O,5,Ck,Bx,Ce,BD,Bo,BJ,CU,B5,6,A,Bq,z,e,BB,DG,BH,CI,BG,m,Bu,o,Ba,a,Bw,8,Ck,d,Bi,Q,6,Z,B0,a,Cc,m,o,f,BE,w,Bs,m,Bw,E,6,BO,BM,4,Bl,O,CB,y,b,I,BX,BK,Bn,Q,B1,J,BL,BK,Cj,CE,BO,BE,BX,Bi,BR,V,Bd,s,Cx,e,Bl,y,b,2,Cv,V,Br,BE,CN,De,Br,CS,Bj,CK,BZ,b,x,B0,CD,BQ,Df,BS,s,BS,Bb,y,g,i,Db,CS,CB,Be,BP,Ci,Cn,4,Cl,E,B1,P,CB,Bi,Cv,N,C3,j,Bf,3,C3,E,B1,p,CV,Bb,C7,CZ,Bl,BN,Ch,BF,Bl,9,Cx,BP,Bn,z,Cb,b,CP,K,BD,B3,BH,Dn,J,C9,BV,Bf,BR,B7,BZ,Cr,Bc,B9,i,e,Bq,Bv,n,C1,CV,Cx,2,B1,g,B1,O,DJ,6,CH,CA,l,Cc,x,Bm,Bl,BU,DH,Y,BE,Bi,x,Ca,Bl,CR,C3,l,Bq,Bw,e,B2,BQ,Bk,R,CY,Cn,Cv,CD,BH,BP,Cl,Ch,BU,G,Bs,CD,CW,Br,BM,k,u,EJ,B8,CR,G,DH,Bi,Fx,T,EN,BL,Dr,BF,DF,M|EP0,YQ,f,DX,BX,5,Cz,v,Bj,Ci,j,Eo,Bc,FO,CO,Bx,Be,CT,Bk,DX|FrK,6s,Cp,BA,H,Cw,Bk,Bc,Dg,4,B2,F,s,BP,Bb,Bb,v,B3,Cx,Bj;EK4,CMm,R,B0,CO,0,C5,Fm,GY,BS,Bo,s,CU,Fw,GY,BF,By,Bc,K,DQ,Cq,S,Cc,CI,BQ,S,0,CR,Cs,Bt,Em,BP,CO,Cl,BP,Dx,BK,BZ,Dy,j,EW,d,D4,CD,CA,X,Bc,C9,B4,B5,Di,E,Gq,v,ES,c,DK,f,Ew,B7,D4,A,Ba,BB,Dw,Bs,FM,BI,E0,I,Dw,BI,CU,Bu,CQ,BE,h,BE,BD,BQ,Bq,CE,B0,T,DS,p,DO,Bs,E6,BQ,CW,CI,CQ,4,Eq,c,Ci,Z,W,BK,C5,CQ,Cn,BC,Cd,BN,DN,e,B1,Z,z,BU,CQ,DM,Bk,Cc,D2,BP,Ei,CC,D,Ba,C4,Da,By,BC,D,By,Bx,u,Co,Bm,EC,k,EQ,G,E0,9,C0,BN,B8,DR,BO,BZ,BI,B9,BM,DL,Fm,BD,Dy,CT,BU,DD,E4,A,Cw,BQ,FW,8,Bt,C5,BR,BN,BH,Dh,CL,DL,D7,k,Cv,BJ,0,Cx,f,Dz,Bp,H,C,Bn,CH,B4,BR,B1,FB,BZ,g,Br,Cz,G,Bh,BC,CP,CT,Dj,Bv,Cn,CF,Eh,7,CZ,Bh,Df,3,Bu,Be,r,BQ,Ci,CK,Bt,Bs,Cz,BL,Dp,CP,CB,CH,DL,L,Bp,Bf,Bs,CN,Co,h,G,Bd,Ci,7,Dm,CS,C2,BR,CG,H,g,Br,El,5,Bf,Bv,DL,Bn,Bp,CR,De,Bx,BQ,DL,B8,C9,CM,Cf,F,CZ,CD,3,w,Bv,B4,BB,f,Cn,1,Cj,Bx,T,CX,Dh,Cn,EP,DB,D1,Ed,DB,Ef,Ct,Dp,X,B9,Bd,BH,BE,B1,Bn,Eh,Bn,DZ,f,BJ,Db,Bx,N,1,CW,u,BQ,EV,BC,Bh,j,DR,0,Bh,BU,g,B0,C9,m,Bj,BM,Cv,Bt,DL,Z,Cj,C,Bv,z,Br,d,e,Dt,Bt,G,T,w,H,BU,CX,7,Bb,k,CZ,BO,6,Cq,CD,m,x,C8,Db,h,Y,Dy,DE,Cs,I,Co,H,Ce,BZ,w,BH,B4,B3,R,Df,e,BG,BW,Bh,CA,CV,BX,Cr,y,Dv,CF,C7,CZ,Cl,b,Bb,2,Bt,E,CT,w,Bv,1,CL,CZ,R,Ci,B9,r,Dx,S,Dp,u,Cn,Ba,Ch,o,BF,Bi,Bz,c,DR,CI,Cl,8,BX,x,Ef,CQ,DL,CE,5,Di,CU,d,G,Bo,BT,Bq,U,Cm,Dd,Dw,FV,BU,7,Ce,CZ,Be,l,6,f,B0,G,BQ,B7,u,BF,V,z,C8,4,u,d,u,DG,Bi,CO,m,Da,b,BM,CE,EK,Y,BI,BQ,FG,Bu,c,u|GU0,BQq,B7,FL,BZ,Cp,Bt,Cs,X,Ca,B2,DK,Cm,Cc,Bc,9,j,B9|hq,CbQ,B8,d,W,m,DM,k,u,BJ,Em,1,X,Bl,w,BZ,Cl,e,Cn,BL,K,Bl,Z,7,BE,Bp,DC,Bn,Bm,Cr,Dk,Cl,Ci,A,w,t,5,p,C4,BL,CW,9,Cw,Br,U,n,n,BL,Bx,Bg,Cz,g,BX,CF,CU,BP,Z,Br,BV,N,Bv,Cv,BX,R,C,8,o,Bu,s,q,BR,B2,BB,Bo,BV,Y,9,BY,CF,m,BZ,BS,CZ,M,Ch,Bc,C9,CI,CN,B0,BB,DM,Bn,Y,Cn,BE,Bf,d,B3,Bf,BV,R,W,Ba,Bv,Y,1,Cg,BI,8,9,BO,I,4,BY,r,Bk,I,By,BG,i,f,Bi,G,q,BS,CY,b,Ba,i,Q,BU;vm,B9C,Cc,S,BL,Cj,e,BB,r,Bp,Cd,BO,Bp,U,Eh,Bo,c,Bq,Dw,V,DS,W;cG,CH6,Bm,BA,B6,CT,d,ER,Bf,M,BT,BF,BP,0,J,D4,v,B0,Bw,L|gA,C1W,CF,f,Cb,a,BV,By,H,DS,i,2,4,8,C0,M,BK,4,Ck,4,H,Bp,9,BF,Y,5,Bu,f,x,BP,9,W,CV,CV,2,Bl;n4,C5A,BC,Bn,B7,Cn,DZ,By,d,BW,Eu,BE|UB,Cxw,Cb,o,CB,D,o,Bu,p,Bs,Cs,I,Dc,CB,Bv,CN;J9,CwQ,c,B4,CJ,B8,F,E,D5,i,x,2,BK,Bc,BF,2,Bv,Bh,L,DI,Bp,Bo,BK,DU,Cg,Cm,Ck,R,D2,S,Db,Dh,DQ,c,Di,D,1,Cn,C5,C5,DU,N,Q,X,C4,Dz,CM,h,B8,Dp,6,BT,D4,n,Z,CF,Bp,7,BS,Br,C5,Br,EV,A,Ff,3,Bh,o,CJ,Bh,C9,W,CT,BP,Bt,o,Eu,DY,C4,s,D,A,FD,g,7,BS,DY,BA,Bx,Bu,m,CI,Ey,V|uz,DcY,v,CH,Do,CN,EN,Cf,JT,CN,Cz,l,EP,c,JB,BC,DK,Ba,HD,Bk,Fu,m,L,8,Gx,u,CM,CG,E4,e,FA,CN,E4,Bw,EE,7,FQ,Bu,FW,P|CZq,CLC,6,H,CM,B9,Bc,P,i,0,B4,BS,Bs,Bt,Bo,CT,Be,J,BA,3,Cp,R,j,Ch,l,BJ,BL,v,E,Bn,z,L,CB,Bq,BI,Bm,9,6,BN,P,Dz,CZ,H,CO,Bd,i,BX,2,4,BC,Bt,BG,o,y,BP,k,r,0,y,g,CY,7,Bu,N,c,Y,Bl,Bu,y,c;CY0,CA8,CN,a,Bp,Bg,h,BM,q,G,8,3,Ba,A,A,f,BS,B3|CE4,CQG,Y,Y,Cs,j,Eu,h,Ea,Bj,i,n,B8,g,DA,r,BA,BV,CA,v,z,d,Bk,Bv,d,Z,Bv,M,CZ,6,z,h,Ef,h,DH,Bk,Dd,J,e,BW,z,CO,B1,BK,Bz,Y,BL,8|GRw,o8,Bp,Ce,Cw,J,BI,BL,3,Cx,BZ,Bk;GXc,gM,y,4,W,CA,Bw,M,h,CL,CY,DG,V,DF,BL,BF,BB,CD,BB,9,CB,CO,q,2;Gjq,bI,U,CJ,M,Bz,BH,C9,BN,DS,Bh,Bn,BC,CZ,5,Bh,Dz,B2,5,CW,8,Bg,CD,Bg,BB,BV,Bh,I,CZ,Bz,j,6,BQ,Cs,CC,6,Bw,BM,BI,Bd,Cc,2,g,Bc,CS,G,N,Ce,Cm,Bh,S,Bp,O,BN;GKQ,eE,ET,DF,Bk,CQ,CW,B8,B6,CQ,Bq,DM,k,Cp,CJ,Bx,Bt,CN;GWo,6w,j,BV,BI,CV,3,Cr,B5,BF,f,Cn,s,Cj,Bs,X,Ba,Y,EC,Bz,T,Bv,BC,x,V,Bf,Ch,Bk,BN,Bq,1,BL,CF,B4,C5,d,Bn,s,K,BU,BA,0,9,u,b,BL,Bl,B0,f,Ba,J,DE,BU,BF,U,FE,BE,C6,B6,D,CA,5,BA,0,S,1;GVq,k0,h,Bg,B6,BB,CE,A,F,BV,Bf,BZ,CF,9,H,Bg,O,Bo;Gg0,nO,4,Dl,Cf,0,E,BF,y,CB,Bj,v,J,CS,9,K,h,B8,B4,R,D,BM,B9,Ce,DG,F,2,BP|FM2,U0,i,k,Co,Bb,O,Bp,CI,Y,BE,BU,u,T,B4,B9,BW,CJ,M,CN,X,Bd,U,BJ,O,B5,BI,3,BS,C3,F,BH,CT,N,DF,CY,Dz,Ci,Z,Bo,B1,CK,d,Cq,BL,Bu,W,CW,t,BW;GIQ,NW,Cx,i,Dt,A,BJ,Dr,BR,BJ,Bp,Ef,Cn,r,DF,4,Bj,T,B3,Bp,CF,Q,CH,r,CN,B0,j,CK,CY,BJ,Ce,m,o,Cu,BY,m,D2,q,CS,Ci,Bk,CE,Be,Br,q,BG,Bi,H,M,CE,I,Bk,Ce,CO,Bo,Cg,BS,C,Bo,Bp,K,BZ,CI,5,Cq,9,P,BR,CL,L,k,Bl,CZ,BH|GAa,Rk,J,Bl,N,CF,Bj,G,r,BH,Bf,Bq,BS,BM,Cu,Bw|si,CaC,Co,R,Bo,u,Cy,E,m,i,i,D,m,BH,Cj,1,V,BV,BJ,V,C,5,BR,E,BH,g,n,h,CP,G,s,S,x,BY,W,Bk|BeO,Dkw,d,CR,E6,CJ,DB,Cd,Dw,Dp,CN,Cx,C4,Cb,BT,CH,Ew,CN,BP,Bp,DB,B3,G5,EJ,F1,R,Fr,BL,FR,r,B3,Bu,DJ,BE,s,DM,Bj,C4,Bi,B2,C4,CC,HY,De,CK,q,X,BW,Ef,Bi,BF,BQ,H,E8,FD,CM,ET,Bk,B4,0,Dm,Bt,EM,K,De,x,DE,Ba,Bk,CY,FA,BE,EK,BR,BZ,CT|BKw,CiW,5,1,n,BV,t,V,Dd,8,BF,N,v,v,Bh,b,X,O,Bl,h,BR,H,R,p,Ct,Z,BN,W,Bp,y,V,BI,Q,a,c,s,Bc,F,BG,U,E,U,m,I,O,u,u,K,e,k,8,A,M,N,BU,a,Bo,BJ,B4,q,Bg,V,CU,c,DE,BP|wc,Co2,Bg,BF,Ca,R,N,5,Bu,p,e,y,CM,X,U,BB,CY,N,Be,Bl,9,A,f,l,v,L,P,v,n,J,F,V,BH,V,Bd,E,d,t,Bf,m,Bh,N,Ch,BA,BJ,R,Bz,BT,CZ,BC,B1,BY,Bp,w,V,BW,l,8,CW,q,BM,y,CU,o,y,m,0,Z,Bc,W|B3g,ug,X,BS,BY,Eu,U,CK,BC,8,CW,i,Bo,B0,B2,Dv,4,C9,Bu,Bj,Ea,DF,Bw,B1,Bw,B3,BA,BH,Bk,9,9,x,BZ,Q,BH,BE,BV,B2,Bb,BC,1,BI,Cz,BS,CP,C,x,q,B5,v,B7,Bc,BD,Cb,Dv,q|HXq,CCY,C9,DR,E,DV,BP,Cl,i,Bn,Br,CR,EH,Bh,Fr,N,En,Dt,CL,BQ,J,Ca,Fn,t,Dz,Bj,Dx,D,DQ,CZ,CL,Ff,CF,BX,Bl,BQ,y,C4,CF,6,BT,CO,DC,8,Bs,CC,DO,Bq,CY,CM,Ga,8,Dc,p,DW,Fs,CK,Bh,Eu,DO,B0,BQ,CA,D6,j,Dm,BY,CE,Da,k,Bu,Ef,H,Cn;Hge,CRy,CS,BW,s,Dn,Ex,3,C1,DN,FF,CM,Bv,Dj,Dl,D,d,DM,Bk,Ce,Dc,M,6,Ec,8,Cg,Dw,DX,Ce,BH,CQ,r;G3A,Bt6,Bw,B6,B0,Z,BU,BW,CY,r,a,BH,B1,B9,BV,BC,Bp,v,3,B5,CH,6,C,Bg|DBp,BDH,8,Bx,P,EZ,Da,n,BU,m,CK,3,m,9,S,C7,Y,BR,BM,J,BO,g,BK,l,A,Bx,d,B5,p,B3,h,C1,C7,Cf,Cj,h,Dn,e,DR,4,DM,E4,f,Ba,DV,BQ,D7,CY,Cp,e,F7,FQ,BS,D2,E,Bu,Bi,C0,Fo,6,C8,F,DC,Bp,C,BB|Cru,9S,Cg,FV,BE,CR,CV,3,p,Bb,F,BH,DP,BX,FL,Bh,C3,CT,Bb,L,9,M,B5,BX,CD,n,Ct,L,z,N,t,1,3,R,f,z,Bn,E,BB,b,CR,K,1,B2,G,Bw,h,6,p,CY,7,BU,q,K,X,Be,Y,m,J,Ba,Ba,BC,V,BW,0,Bk,BU,1,2,S,Du,E,k,V,DI,V,BO,K,y,BF,Bg,i,CS,DY,DC,Bc,JS,BO|Byw,Bgs,Dk,h,BY,BA,w,BK,Cc,a,i,BG,BE,i,DP,DO,Gc,Bm,o,e,D2,3,Ey,CR,JG,Gf,GA,R,C2,V,y,Bh,CS,E,BQ,Cx,Bk,v,i,BJ,CM,BX,M,BV,V,BH,a,BF,6,5,a,BF,e,z,8,n,4,O,m,BP,I,x,BO,DR,Js,Bn,o,q,Be,CT,CL,Gd,Jr,DP,JT,BP,DD,Bd,CT,DZ,Bh,j,z,BE,BP,L,DJ,U,l,U,Dv,F,3,T,BV,0,1,Bl,U,BX,Bb,BD,b,BW,9,BA,R,BQ,Br,BK,Bt,Cs,5,Co,CP,CM,Bd,i,CJ,DE,Z,CQ,K,B4,B3,Dk,Bh,BQ,Bv,q,BF,B0,M,s,5,Bq,7,u,BR,CY,B9,Cm,Bp,CM,Bn,A,g,Bw,I,BI,a,BS|Cg9,EDx,Bo,A,Ey,s,E2,t,D8,BZ,BY,B9,Y,BZ,I,Bp,FB,BB,FR,z,GF,x,Gv,p,Hp,M,EP,BG,i,BU,G4,2,Cw,BG,CC,BY,Bc,BM,B6,BI,CG,BU;Db1,EK5,HQ,H,G8,V,CY,BU,Bs,BI,DW,BV,9,Bp,7,Bd,Gx,c,HN,N,ED,BE,A,I,Bx,6;D0d,Dr5,CO,Y,Du,J,6,Bo,M,BM,F,Ck,B0,Bg,C8,g,Bs,BN,u,BN,BY,Bd,BE,Bb,4,Bd,Y,Bd,l,BR,3,BN,Dz,d,Dn,n,EP,E,Bk,BQ,Dx,d,Dn,d,Cd,8,N,BU,Dg,BQ;FUH,Dt5,CC,i,EG,b,Eq,R,Di,d,Dg,Y,B4,B1,Ch,Q,D7,J,D9,I,EX,N,DT,m,Bt,BW;GXj,Dzn,q,BG,D2,l,EK,h,D2,k,B1,BJ,DD,1,Ef,Q,DP,BI;Gml,Dy9,CU,q,DO,v,E6,BR,B5,I,EL,S,Eb,4;IgH,EFj,B6,BO,GA,h,DO,BB,Ce,BL,2,Bd,GN,b,EP,BI,B5,BI,J,M,CF,2;JWo,EZR,A,RF,StT,A,A,RE,M,D,C0,B2,Fy,BB,Y,G,Da,BC,a,D,Y,D,Eq,BV,EE,BU,u,M,Je,k,DE,x,Bg,Z,E2,BF,JK,1,HQ,BB,Mc,v,JS,2,Ns,p,Hw,BB,Ig,6,I8,4,s,Bg,Mt,I,Kb,u,Ct,BS,Ir,q,k,Bc,BM,BU,BM,BO,n,BU,FZ,2,Cd,BI,FB,BC,H0,N,Hc,g,Eq,BH,Fu,8,FU,BM,Ck,BE,BJ,BU,EL,4,Ev,6,Gp,M,Fz,c,GR,U,CH,BM,EL,BA,Ch,BI,BD,Dq,Bk,V,C6,BB,FS,U,FI,a,Co,BZ,FI,U,ES,s,EC,2,Dq,BE,E2,U,J,BM,BL,BO,8,BI,EK,k,B4,BH,E6,o,Ds,y,Em,E,EW,U,EW,w,De,q,D6,s,Cg,N,CM,R,Ey,c,ES,l,Ec,E,EO,c,EW,V,Ey,V,Ee,I,Eq,F,Ey,F,Ea,I,DS,6,D4,g,EC,r,D2,i,De,BK,CE,BD,BI,BJ,CG,BF,DW,6,D0,BN,EY,Z,Ds,3,Ei,K,EG,k,E2,J,EW,d,Ea,j,Bs,BY,CF,BE,Bl,BI,EN,Q,Bz,BO,t,BM,BJ,CY,Cc,b,EO,N,EM,M,Dw,h,DS,9,BY,BJ,EW,N,EM,c,Ea,o,D8,W,DS,v,ES,Q,Cw,Cc,Cm,Bd,Ds,l,EE,U,Co,BR,EO,J,D4,Z,D2,r,Cg,BM,BQ,BI,DO,BR,Ea,U,DS,t,CO,BF,ES,U,DW,q,DS,0,D4,c,Ei,W,EG,c,DK,s,B4,BA,w,BY,Z,BU,BB,BQ,BL,BS,BB,BQ,1,BI,L,BQ,S,BQ,Bg,BO,BS,BU,e,BQ,n,BY,Z,BQ,Bk,Bc,Bw,8,CE,BM,CO,BA,Ck,8,BQ,BY,Bw,2,CC,0,DG,M,CC,BA,CQ,o,Co,W,CW,0,B0,BA,Cg,Y,B4,1,BP,BF,DR,7,Bb,t,CZ,g,Cp,V,CP,v,CV,1,Bl,7,d,BR,M,BP,Bg,BF,CP,x,DD,P,Bv,BH,B5,BB,CD,BZ,h,BN,BK,BX,Bs,BB,Co,v,Cc,BD,BU,BR,s,BN,6,BR,Bg,BH,8,BN,a,C9,8,BN,Q,BR,BA,BT,d,Bt,Bx,BV,B3,BF,EV,d,Bd,BJ,B7,BF,E3,BP,ET,f,EF,t,EX,r,Cl,BV,FN,J,Fr,I,FJ,R,Fb,A,BA,BR,E6,l,Dm,5,CA,BJ,Dl,BB,Fl,U,En,1,L,BV,J,BR,Dw,BF,s,BP,EG,BN,G0,h,Fy,3,Em,BB,F2,BD,IC,f,H2,5,Fg,7,GA,BH,DK,Bh,Bk,BN,D4,BI,FU,8,Fm,BA,Gs,0,Fu,2,IC,E,H2,d,Gg,v,CG,BY,Ee,6,IK,E,GW,s,GE,q,Gs,c,HI,k,FA,y,CR,BI,Bb,BK,A,BM,GP,J,Gp,h,GV,A,3,BO,a,CY,Bc,s,Em,u,Fc,w,D4,6,D6,6,C4,BS,Ea,i,EW,c,CO,Q,E8,I,Eu,a,EA,o,D4,w,Di,u,Ee,BA,C0,BG,DC,6,6,BQ,Db,w,BK,BU,CI,BA,DW,o,Di,u,DS,BC,Cg,BQ,Bk,Bg,CU,2,D2,L,Bk,BH,D0,J,I,BO,Bo,BQ,De,V,y,BN,D2,N,EK,i,EC,Y,Dq,N,BY,BV,Di,BG,DS,i,Do,c,Dm,c,DS,u,Dk,g,Cy,q,B6,BK,Ca,1,DW,c,CU,Bh,B0,BJ,Do,m,Bc,BQ,DS,4,EO,N,BS,BN,Co,BM,De,Y,Dw,I,Da,F,Dm,Z,Dc,N,Bg,BF,CG,9,Di,k,Dw,I,Dq,A,Dk,E,DO,c,Da,W,C0,4,DC,i,DS,U,Cc,4,Bw,Bu,B0,BG,DW,h,BQ,BJ,Cw,x,DW,Q,CS,BJ,CY,1,DS,w,BI,BY,C4,k,DW,BE,DK,c,Dw,m,Ci,s,Co,u,Cg,s,DC,Z,C4,BI,CG,4,DC,F,Co,u,o,BK,Cs,2,Co,o,DO,e,C8,Q,C0,N,DE,T,Ck,5,U,BZ,C0,BF,B6,5,D2,Z,CK,3,Co,3,DG,N,Ck,m,Cw,BU,DC,r,DK,Z,DC,Z,DK,P,DO,A,Co,DX,J,1,X,Bd,DH,z,Cj,BP,c,BR,Dm,E,d,BR,Bp,BN,Bh,BV,Cc,BD,Du,T,Ds,i,Bw,BQ,BG,BO,Bu,BA,CC,6,0,BK,Bq,Bk,CC,S,Dq,I,DO,Y,DQ,g,Bk,BQ,8,BM,CM,BM,DK,0,Cu,m,Bu,BG,B0,i,CW,g,DO,V,C4,U,DK,Y,Dg,N,CW,2,Bo,CK,BM,3,Bg,Bh,Cs,p,DG,R,DG,Y,DS,R,DC,F,CC,U,Cs,N,Cc,t,C4,c,De,A,C8,c,DW,d,CI,BE,Bo,BG,CO,2,EC,Ca,CG,d,Cc,3,CK,BL,EG,B7,DK,F,C8,A,De,W,De,c,Co,2,CM,8,Dm,I,CY,q,Ci,n,Bo,BD,CQ,BB,Di,I,CM,1,D2,z,EC,V,DW,Q,Cg,BA,CK,BC,C4,Q,C4,d,DW,V,DC,g,C4,A,C0,V,C8,V,C4,k,De,e,DS,I,Dq,A,C8,U,C4,Q,2,Bk,I,BU,CC,3,i,Bd,BG,BX,BU,BF,Cs,j,Dq,K,EO,E,C4,M,EO,A,DC,E,EO,J,Dm,R,CS,BB,p,BN,CG,9,Dc,v,Dm,1,EK,j,EW,h,DS,f,Dq,F,CE,BE,C2,5,Cc,BB,C0,v,D6,V,Ds,Z,Bk,BR,Dq,x,Cc,BJ,Dm,h,Ds,E,De,N,D0,E,D2,P,Dm,d,DU,x,DW,n,CS,9,Z,BR,Bt,BJ,Bd,Bd,BJ,BJ,Bh,BX,EP,f,B5,BL,EN,r,Bd,BR,CN,BP,CX,BB,BV,BV,z,BN,V,Bd,E,BP,B0,BR,q,BN,Bg,BJ,GA,d,BS,BZ,F1,h,E5,r,GJ,J,Cv,B1,j,Bh,BZ,BN,Bt,BP,ES,BF,Bo,BV,Cw,BN,D6,BH,Ee,BB,E0,BB,Ha,BD,Bm,Bl,JS,r,o,R,CY,7,I6,y,HY,BB,Fi,x|Brk,BzW,O,C,e,w,CU,F,C6,8,CN,BX,O,n,V,G,n,P,f,E,L,J,F,U,R,M,n,C,3,R,n,K|Brk,BzW,m,L,2,Q,m,D,Q,N,E,V,K,I,e,F,m,O,U,H,G,R,DT,BV,Bl,a,v,BS,Bg,I|HB,Bzc,BO,CF,M,B9,BG,Db,2,r,n,BR,EP,j,Bd,BN,B3,R,J,CZ,Dx,BT,BP,Bn,Cp,3,DP,f,FN,CZ,A,Dz,f,A,G,Bv,CB,H,BF,v,Bd,A,BL,a,Ct,X,BF,Ch,BB,P,Bh,EF,Ef,Df,BF,Ed,BV,Bd,Z,BL,HR,R,F,A,K,Bg,BO,2,BE,Bq,P,BG,BI,CQ,Bw,CE,BG,g,2,B2,E,Bu,BK,B8,CK,BM,CC,DS,E,C,Bm,BQ,DA,W,Ci,CM,Bm,2,Cs,Cq,z,EC,BO,Cw,a,Bq,CE,CM,DQ,Be,CY,BU,CK,DW,BA,B8,CY,A,B6,BZ,DE,O,DW,t,BY,D|B46,BI8,Mz,A,Mh,A,M9,A,A,L2,A,Le,9,Ck,0,CA,h,BY,BK,Bi,EU,E,DG,3,DM,7,Be,h,Ce,BC,BW,4,C0,S,CS,b,2,Bn,u,BE,Ck,x,Cg,L,Bm,y,Bw,Et,U,1,5,BT,r,Cd,5,Br,v,j,BF,BC,Bd,Bc,CV,Em,V,T,BU,DZ,CA,DR,Ca,FD,BM,Bv,BE,B1,C2,Dj,p,l,I,CH,Du,C5,k,p|BSo,BI8,A,Gd,Dt,A,D,BX,M3,GM,M3,GK,DR,Bx,CT,BN,Bz,Bw,FH,BY,Bb,CC,Cj,Be,Bh,l,BJ,By,J,BY,B5,CU,BS,BW,T,CC,a,Bw,R,Bc,k,Co,L,Be,BF,C2,Bk,u,S,BW,X,BW,CO,BO,8,BC,Bk,6,M,Ce,Dw,BJ,BW,S,Cs,j,ES,Bb,Be,C3,C4,p,Ei,BX,Dc,Bl,Bi,0,Bi,Be,v,Cc,BA,Bk,CU,Bg,CO,a,EY,p,BG,Bd,BM,A,BC,j,DM,Z,w,BF,BL,Bj,g,BZ,1,CB,8,Cl,A,Lf,A,L3|CeK,Zy,JJ,Jr,EN,J,C3,CT,CF,F,3,BB,CP,A,BT,BG,C9,BX,7,BX,CL,Q,t,Y,v,H,BD,C,EF,Cu,CR,A,BH,BE,A,By,Br,i,B5,De,Bf,w,j,BS,Bp,Bi,CB,O,BG,B0,Bu,G,c,8,D,C4,8,DY,Bg,4,U,BU,BY,Cc,B6,Bm,BU,DK,g,Cw,Du,r,BC,Ca,B6,Bd,B4,u,w,r,CO,D,Cy,BT,0,BJ,Ba,BD,BU,B3,BG,BF,BJ,Bb,BH,Bh,Q,3,E,BB,Bw,F,w,Q,u,l,t,BL,BM,Bx,BM,Bj,BO,BL,Ki,Dz,Cs,A|CMm,oc,BY,R,8,w,w,BB,H,BX,B1,v,BY,5,BN,Bt,v,k,x,R,Bx,E,F,BA,R,2,BG,Bg,BI,Ba|Ch4,ky,D,F,A,BV,A,DR,A,Br,Bd,B9,CR,Ct,Ct,A,Kj,Dy,BP,BK,BN,Bi,BN,Bw,s,BK,BM,Bs,BC,l,o,BX,Bc,BV,Bk,D,DE,0,Dg,Y,C0,BA,Bk,M,BK,m,B0,G|BvW,DF,Gj,R,Dj,E,BJ,Z,B7,BB,x,U,C,Ca,u,BO,M,Cm,q,Be,BO,Bq,BO,2,BC,BI,BT,c,M,Dw,BW,2,CC,t,Cm,u,CQ,A,CA,Be,Bg,CP,Y,Bp,Ba,Dr,BN,CX,Bl,CJ,7,BV,C,Db|BkI,Dp,BS,B1,N,B5,7,Z,Bt,M,BB,B1,B9,Q,U,Bw,a,O,I,B6,6,4,w,V,B6,BA|72,CNk,C3,BO,BN,BW,BP,s,Bf,BM,t,BA,Bl,Bg,q,BU,BK,v,q,q,Bg,E,Cw,h,CO,C,Be,t,BK,A,z,Bb,Bi,BP,f,Bh,v,L,n,T,BD,v,f,Bx|BKM,CMg,Bm,BD,O,CJ,n,J,h,j,Bv,E,BR,t,CH,T,BV,y,f,BY,a,BG,a,D,I,o,B4,g,u,I,BG,K,Be,E|8u,CYG,Ce,0,CA,J,Bu,BT,W,BB,B8,x,Q,BV,B4,7,BA,s,y,Z,x,j,m,l,z,t,S,BN,Bk,BZ,BR,BB,h,BD,W,Z,j,d,Bf,F,BH,L,J,O,Y,Y,Y,w,f,A,n,k,j,K,b,g,l,M,f,c,j,L,d,BH,x,P,Q,S,BP,q,BF,U,f,c,1,i,u,K,e,Bg,Bj,BO,y,Ba,BL,A,BO,BO,BD,4,x,BQ|BCu,CNY,3,T,N,m,Bb,Bl,O,BD,r,Q,5,BC,BZ,o,W,i,e,Bw,BC,u,m,S,0,j,e,d,BE,V,BO,r,R,T,n,t|BEa,CLC,P,BK,x,U,r,2,m,s,w,O,c,BG,i,K,e,d,k,N,a,h,i,L,m,l,e,A,Z,x,Z,Z,I,P,v,J,B5,h,J,p,b,C|DM9,is,B2,a,q,H,J,Cb,Ct,X,l,S,6,4,F,BQ|Blc,LU,C1,CI,v,BY,Bz,r,Bf,O,3,j,Bd,Y,B9,Co,h,BC,CZ,BS,1,B6,BV,BY,CN,Bq,D,BE,Bv,BS,CN,BQ,8,W,BI,m,y,C2,4,Be,CU,c,i,3,Bq,B5,2,R,BK,i,CU,J,c,p,DO,A,G,o,Bq,m,U,6,BO,q,Cs,B3,Bo,U,Bm,CU,Bw,Bw,T,B6,x,6,B6,K,O,u,Bg,P,Z,CZ,Y,CV,Bo,BR,Y,BJ,F,Bn,c,F,C,Ch,d,9,Bv,H,BH,B1,CA,P,Bo,Bj,i,BT,Be,x,B4,Df,CN,CJ,B9,B7,CB,Bf,CR,A,Cn,v,CD,s,BX,3";

// The projected map is 1000x500 user units — equirectangular is 2:1 — and what
// you are looking at is always a viewBox inside it.
const MAP_W = 1000;
const MAP_H = 500;
const MAP_MIN_W = 20;   // furthest you can zoom in
const MAP_ROUND = 10;   // questions in a quiz round
const MAP_TRIES = 2;    // wrong clicks before the answer is given away
const MAP_HIT_PX = 16;  // click tolerance around a country too small to hit

// Framed by hand. A continent's own bounding box is useless where it crosses the
// antimeridian: Russia and Oceania each span the full width of the map, so their
// boxes would frame the world.
const MAP_REGIONS = {
    world: { x: 0, y: 0, w: MAP_W, h: MAP_H },
    Africa: { x: 447, y: 144, w: 200, h: 206 },
    Asia: { x: 569, y: 33, w: 348, h: 248 },
    Europe: { x: 431, y: 50, w: 197, h: 106 },
    'North America': { x: 22, y: 42, w: 339, h: 194 },
    'South America': { x: 269, y: 211, w: 139, h: 197 },
    Oceania: { x: 806, y: 264, w: 194, h: 125 }
};

// Antarctica has no one living in it to learn about, and "Seven seas" is not a
// country at all. Both still draw; neither is ever the answer.
const MAP_NOT_QUIZZABLE = ['Antarctica', 'Seven seas (open ocean)'];

var mapGeometryCache = null;
var mapIso3Index = null;
var mapRuntime = {};

function mapGetToolId(element) {
    const tool = element.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function mapGetWidget(element) {
    return element.closest('.map-widget');
}

/** Transient per-instance state — a drag in flight, a pending flash — that has no
 *  business being written to storage. */
function mapRuntimeFor(toolId) {
    if (!mapRuntime[toolId]) mapRuntime[toolId] = { drag: null, timer: null };
    return mapRuntime[toolId];
}

/** One country's row, with names on it. */
function mapCountry(index) {
    const r = MAP_COUNTRIES[index];
    if (!r) return null;
    return {
        index: index, iso2: r[0], iso3: r[1], name: r[2], continent: r[3],
        subregion: r[4], pop: r[5], capital: r[6], lon: r[7], lat: r[8]
    };
}

function mapIndexOf(iso3) {
    if (!mapIso3Index) {
        mapIso3Index = {};
        MAP_COUNTRIES.forEach(function(row, i) { mapIso3Index[row[1]] = i; });
    }
    const i = mapIso3Index[iso3];
    return i === undefined ? -1 : i;
}

// ---------- geometry ----------

/** Base62 with a zigzag sign, matching the generator. */
function mapDecodeInt(token, alphabet) {
    let u = 0;
    for (let i = 0; i < token.length; i++) u = u * 62 + alphabet[token.charAt(i)];
    return u % 2 ? -(u - 1) / 2 : u / 2;
}

/**
 * The baked geometry decoded once for the page: per country, its rings of
 * hundredths-of-a-degree coordinates and the SVG path they project to. Static, so
 * every instance of the tool shares the one copy.
 */
function mapGeometry() {
    if (mapGeometryCache) return mapGeometryCache;
    const alphabet = {};
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('').forEach(function(c, i) {
        alphabet[c] = i;
    });

    mapGeometryCache = MAP_GEOMETRY.split('|').map(function(blob) {
        const rings = blob.split(';').map(function(text) {
            const parts = text.split(',');
            const ring = new Array(parts.length);
            let lon = 0;
            let lat = 0;
            for (let i = 0; i < parts.length; i += 2) {
                lon += mapDecodeInt(parts[i], alphabet);
                lat += mapDecodeInt(parts[i + 1], alphabet);
                ring[i] = lon;
                ring[i + 1] = lat;
            }
            return ring;
        });
        return { rings: rings, path: mapRingsToPath(rings) };
    });
    return mapGeometryCache;
}

// Equirectangular: longitude is x and latitude is y, which is the projection the
// stored coordinates fall into with the least arithmetic. Kept as two functions
// so a projection that does more work can replace them without touching callers.
function mapProjectX(lon) { return (lon + 18000) / 36; }
function mapProjectY(lat) { return (9000 - lat) / 36; }

function mapRingsToPath(rings) {
    return rings.map(function(ring) {
        let d = '';
        for (let i = 0; i < ring.length; i += 2) {
            d += (i ? 'L' : 'M') + mapProjectX(ring[i]).toFixed(1) + ' ' + mapProjectY(ring[i + 1]).toFixed(1);
        }
        return d + 'Z';
    }).join('');
}

/** A country's extent in user space, or null where it wraps the antimeridian and
 *  the extent would be the whole map. */
function mapCountryBounds(index) {
    const entry = mapGeometry()[index];
    if (!entry) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    entry.rings.forEach(function(ring) {
        for (let i = 0; i < ring.length; i += 2) {
            const x = mapProjectX(ring[i]);
            const y = mapProjectY(ring[i + 1]);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    });
    if (minX > maxX || maxX - minX > MAP_W / 2) return null;
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

// ---------- state ----------

function mapGetData(toolId) {
    const customizations = loadToolCustomizations();
    const saved = (customizations[toolId] || {}).mapData || {};
    return {
        view: saved.view || Object.assign({}, MAP_REGIONS.world),
        region: MAP_REGIONS[saved.region] ? saved.region : 'world',
        mode: saved.mode === 'quiz' ? 'quiz' : 'explore',
        selected: saved.selected || null,
        quiz: saved.quiz || null,
        streak: saved.streak || 0,
        best: saved.best || 0,
        progress: saved.progress || {}
    };
}

function mapSaveData(toolId, data) {
    const customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].mapData = data;
    saveToolCustomizations(customizations);
}

// ---------- view ----------

/** Keep the view inside the world and within the zoom range. */
function mapClampView(view) {
    const ratio = view.h / view.w;
    const w = Math.min(MAP_W, Math.max(MAP_MIN_W, view.w));
    const h = Math.min(MAP_H, w * ratio);
    return {
        x: Math.max(0, Math.min(MAP_W - w, view.x)),
        y: Math.max(0, Math.min(MAP_H - h, view.y)),
        w: w,
        h: h
    };
}

function mapApplyView(widget, view) {
    const svg = widget.querySelector('.map-svg');
    if (svg) svg.setAttribute('viewBox', view.x + ' ' + view.y + ' ' + view.w + ' ' + view.h);
}

/** Client coordinates to map user space. getScreenCTM already knows about the
 *  letterboxing preserveAspectRatio introduces, which hand arithmetic would not. */
function mapClientToUser(svg, clientX, clientY) {
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const point = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: point.x, y: point.y, scale: ctm.a };
}

function mapViewAround(cx, cy, w, h) {
    return mapClampView({ x: cx - w / 2, y: cy - h / 2, w: w, h: h });
}

function mapSetView(widget, toolId, view) {
    const data = mapGetData(toolId);
    data.view = mapClampView(view);
    mapSaveData(toolId, data);
    mapApplyView(widget, data.view);
}

function mapZoomBtn(btn, factor) {
    const widget = mapGetWidget(btn);
    const toolId = mapGetToolId(widget);
    const svg = widget.querySelector('.map-svg');
    const rect = svg.getBoundingClientRect();
    mapZoomAt(widget, toolId, factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
}

/** Zoom about a point, leaving whatever is under it where it is. */
function mapZoomAt(widget, toolId, factor, clientX, clientY) {
    const svg = widget.querySelector('.map-svg');
    const anchor = mapClientToUser(svg, clientX, clientY);
    const data = mapGetData(toolId);
    const view = data.view;
    const next = mapClampView({ x: view.x, y: view.y, w: view.w * factor, h: view.h * factor });
    if (anchor) {
        const ratio = next.w / view.w;
        next.x = anchor.x - (anchor.x - view.x) * ratio;
        next.y = anchor.y - (anchor.y - view.y) * ratio;
    }
    mapSetView(widget, toolId, next);
}

function mapResetView(btn) {
    const widget = mapGetWidget(btn);
    const toolId = mapGetToolId(widget);
    const data = mapGetData(toolId);
    mapSetView(widget, toolId, MAP_REGIONS[data.region] || MAP_REGIONS.world);
}

function mapZoomToCountry(widget, toolId, index) {
    const country = mapCountry(index);
    if (!country) return;
    const bounds = mapCountryBounds(index);
    if (bounds) {
        const pad = Math.max(bounds.w, bounds.h) * 0.35 + 6;
        mapSetView(widget, toolId, {
            x: bounds.x - pad, y: bounds.y - pad,
            w: bounds.w + pad * 2, h: bounds.h + pad * 2
        });
        return;
    }
    // Wraps the antimeridian, so frame its label point instead of its extent.
    mapSetView(widget, toolId, mapViewAround(mapProjectX(country.lon), mapProjectY(country.lat), 300, 150));
}

// ---------- rendering ----------

function mapInit() {
    document.querySelectorAll('.map-widget').forEach(function(widget) {
        if (widget.dataset.mapInited) return;
        widget.dataset.mapInited = '1';
        const toolId = mapGetToolId(widget);
        if (!toolId) return;

        // The 177 shapes are built once and thereafter only recoloured. Rebuilding
        // them the way the rest of the toolbox rebuilds innerHTML would be ~50KB of
        // markup per mouse move.
        const svg = widget.querySelector('.map-svg');
        if (svg) svg.innerHTML = mapBuildShapes();

        const select = widget.querySelector('.map-region');
        if (select) {
            select.innerHTML = Object.keys(MAP_REGIONS).map(function(name) {
                return '<option value="' + escapeHtml(name) + '">' + escapeHtml(name === 'world' ? 'Whole world' : name) + '</option>';
            }).join('');
        }

        mapBindStage(widget, toolId);
        const data = mapGetData(toolId);
        mapApplyView(widget, data.view);
        mapRender(widget);
    });
}

function mapBuildShapes() {
    const geometry = mapGeometry();
    return MAP_COUNTRIES.map(function(row, i) {
        return '<path class="map-country" data-iso="' + row[1] + '" d="' + geometry[i].path + '"></path>';
    }).join('');
}

/** Re-render the panels and recolour the shapes. Never rebuilds the shapes. */
function mapRender(widget) {
    const toolId = mapGetToolId(widget);
    if (!toolId) return;
    const data = mapGetData(toolId);

    widget.querySelectorAll('.map-mode').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.mode === data.mode);
    });
    const select = widget.querySelector('.map-region');
    if (select) select.value = data.region;

    const learned = Object.keys(data.progress).filter(function(iso) { return data.progress[iso].right; }).length;
    const stat = widget.querySelector('.map-stat');
    if (stat) stat.textContent = 'Learned ' + learned + ' / ' + MAP_COUNTRIES.length;

    const panel = widget.querySelector('.map-panel');
    if (panel) panel.innerHTML = data.mode === 'quiz' ? mapQuizPanel(data) : mapExplorePanel(data);
    mapPaint(widget, data);
}

function mapPaint(widget, data) {
    const quizzing = data.mode === 'quiz' && data.quiz && !data.quiz.done;
    const svg = widget.querySelector('.map-svg');
    if (svg) svg.classList.toggle('quiz', Boolean(quizzing));
    widget.querySelectorAll('.map-country').forEach(function(path) {
        const iso = path.getAttribute('data-iso');
        const entry = data.progress[iso];
        path.classList.toggle('learned', Boolean(entry && entry.right));
        path.classList.toggle('selected', data.mode === 'explore' && data.selected === iso);
        path.classList.remove('right', 'wrong');
    });
}

function mapFlag(iso2) {
    if (!iso2 || iso2.length !== 2) return '';
    return String.fromCodePoint(0x1F1E6 + iso2.charCodeAt(0) - 65, 0x1F1E6 + iso2.charCodeAt(1) - 65);
}

function mapFormatPop(value) {
    if (!value) return 'unknown';
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function mapExplorePanel(data) {
    const index = data.selected ? mapIndexOf(data.selected) : -1;
    const country = index === -1 ? null : mapCountry(index);
    if (!country) return '<span class="map-hint">Click a country to see what it is. Drag to pan, scroll to zoom.</span>';
    return '<span class="map-flag">' + mapFlag(country.iso2) + '</span>' +
        '<span class="map-title">' + escapeHtml(country.name) + '</span>' +
        '<dl>' +
            '<dt>Capital</dt><dd>' + escapeHtml(country.capital || '—') + '</dd>' +
            '<dt>Population</dt><dd>' + mapFormatPop(country.pop) + '</dd>' +
            '<dt>Region</dt><dd>' + escapeHtml(country.continent) +
                (country.subregion && country.subregion !== country.continent ? ' · ' + escapeHtml(country.subregion) : '') + '</dd>' +
        '</dl>';
}

function mapQuizPanel(data) {
    const quiz = data.quiz;
    if (!quiz) return '<span class="map-hint">Loading…</span>';
    const score = '<span class="map-hint">Score ' + quiz.correct + ' · Streak ' + data.streak + ' · Best ' + data.best + '</span>';
    if (quiz.done) {
        return '<span class="map-prompt">Round over — <b>' + quiz.correct + ' / ' + quiz.asked.length + '</b></span>' +
            score +
            '<span class="map-spacer"></span>' +
            '<button class="map-btn" onclick="mapQuizStart(this)">Play again</button>' +
            '<button class="map-btn" onclick="mapResetProgress(this)">Reset progress</button>';
    }
    const target = mapCountry(mapIndexOf(quiz.target));
    const done = quiz.asked.length - 1;
    return '<span class="map-prompt">Find <b>' + escapeHtml(target ? target.name : '?') + '</b></span>' +
        '<span class="map-progress"><span style="width:' + Math.round(done / MAP_ROUND * 100) + '%"></span></span>' +
        '<span class="map-hint">' + quiz.asked.length + ' / ' + MAP_ROUND + '</span>' +
        score +
        '<span class="map-spacer"></span>' +
        '<button class="map-btn" onclick="mapQuizSkip(this)">Skip</button>';
}

// ---------- interaction ----------

function mapBindStage(widget, toolId) {
    const svg = widget.querySelector('.map-svg');
    if (!svg) return;
    const runtime = mapRuntimeFor(toolId);

    svg.addEventListener('pointerdown', function(e) {
        runtime.drag = { x: e.clientX, y: e.clientY, moved: 0 };
        // Read once here: a pointermove that went to storage for the current view
        // would parse the whole board's customizations on every mouse position.
        runtime.view = mapGetData(toolId).view;
        svg.setPointerCapture(e.pointerId);
        svg.classList.add('dragging');
    });

    svg.addEventListener('pointermove', function(e) {
        if (!runtime.drag) { mapTooltip(widget, e); return; }
        const info = mapClientToUser(svg, e.clientX, e.clientY);
        if (!info || !info.scale) return;
        const dx = (e.clientX - runtime.drag.x) / info.scale;
        const dy = (e.clientY - runtime.drag.y) / info.scale;
        runtime.drag.moved += Math.abs(e.clientX - runtime.drag.x) + Math.abs(e.clientY - runtime.drag.y);
        runtime.drag.x = e.clientX;
        runtime.drag.y = e.clientY;
        const view = runtime.view;
        // The view is written to the DOM on every move and saved once at the end
        // of the drag.
        runtime.view = mapClampView({ x: view.x - dx, y: view.y - dy, w: view.w, h: view.h });
        mapApplyView(widget, runtime.view);
    });

    const end = function(e) {
        if (!runtime.drag) return;
        const drag = runtime.drag;
        const view = runtime.view;
        runtime.drag = null;
        runtime.view = null;
        svg.classList.remove('dragging');
        // Under a few pixels of travel this was a click, not a pan, and the view
        // has not moved to be saved.
        if (drag.moved < 5) mapClick(widget, toolId, e);
        else if (view) mapSetView(widget, toolId, view);
    };
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', function() { runtime.drag = null; svg.classList.remove('dragging'); });
    svg.addEventListener('pointerleave', function() { mapHideTooltip(widget); });

    svg.addEventListener('wheel', function(e) {
        e.preventDefault();
        mapZoomAt(widget, toolId, e.deltaY > 0 ? 1.2 : 1 / 1.2, e.clientX, e.clientY);
    }, { passive: false });

    svg.addEventListener('dblclick', function(e) {
        const iso = mapIsoAt(e);
        if (iso) mapZoomToCountry(widget, toolId, mapIndexOf(iso));
    });
}

/**
 * The country under a pointer event. `target` is not enough on its own: the drag
 * handler captures the pointer, and a captured pointerup reports the capturing
 * <svg> as its target however far into a country it happened — which silently
 * made every click land on nothing.
 */
function mapIsoAt(e) {
    let el = e.target && e.target.closest ? e.target.closest('path.map-country') : null;
    if (!el) {
        const under = document.elementFromPoint(e.clientX, e.clientY);
        el = under && under.closest ? under.closest('path.map-country') : null;
    }
    return el ? el.getAttribute('data-iso') : null;
}

function mapTooltip(widget, e) {
    const tip = widget.querySelector('.map-tooltip');
    if (!tip) return;
    const iso = mapIsoAt(e);
    if (!iso) { mapHideTooltip(widget); return; }
    const country = mapCountry(mapIndexOf(iso));
    if (!country) { mapHideTooltip(widget); return; }
    const stage = widget.querySelector('.map-stage').getBoundingClientRect();
    tip.textContent = country.name;
    tip.style.left = (e.clientX - stage.left) + 'px';
    tip.style.top = (e.clientY - stage.top) + 'px';
    tip.classList.add('show');
}

function mapHideTooltip(widget) {
    const tip = widget.querySelector('.map-tooltip');
    if (tip) tip.classList.remove('show');
}

function mapClick(widget, toolId, e) {
    const data = mapGetData(toolId);
    const iso = mapIsoAt(e);
    if (data.mode === 'quiz') { mapQuizAnswer(widget, toolId, iso, e); return; }
    data.selected = iso;
    mapSaveData(toolId, data);
    mapRender(widget);
}

function mapSetMode(btn, mode) {
    const widget = mapGetWidget(btn);
    const toolId = mapGetToolId(widget);
    const data = mapGetData(toolId);
    data.mode = mode;
    mapSaveData(toolId, data);
    if (mode === 'quiz' && (!data.quiz || data.quiz.done)) { mapQuizStart(btn); return; }
    mapRender(widget);
}

function mapSetRegion(select) {
    const widget = mapGetWidget(select);
    const toolId = mapGetToolId(widget);
    const data = mapGetData(toolId);
    data.region = MAP_REGIONS[select.value] ? select.value : 'world';
    data.view = mapClampView(MAP_REGIONS[data.region]);
    // The pool the quiz draws from just changed, so the round has to.
    if (data.mode === 'quiz') data.quiz = null;
    mapSaveData(toolId, data);
    mapApplyView(widget, data.view);
    if (data.mode === 'quiz') mapQuizStart(select);
    else mapRender(widget);
}

function mapSearch(input) {
    const widget = mapGetWidget(input);
    const toolId = mapGetToolId(widget);
    const query = input.value.trim().toLowerCase();
    if (query.length < 2) return;
    const matches = MAP_COUNTRIES.map(function(row, i) { return i; }).filter(function(i) {
        return MAP_COUNTRIES[i][2].toLowerCase().indexOf(query) === 0;
    });
    // Jump only once the query names one country, so typing "i" does not fly off
    // to India before you have finished writing Indonesia.
    const exact = matches.filter(function(i) { return MAP_COUNTRIES[i][2].toLowerCase() === query; });
    const hit = exact.length ? exact[0] : (matches.length === 1 ? matches[0] : -1);
    if (hit === -1) return;
    const data = mapGetData(toolId);
    data.selected = MAP_COUNTRIES[hit][1];
    data.mode = 'explore';
    mapSaveData(toolId, data);
    mapZoomToCountry(widget, toolId, hit);
    mapRender(widget);
}

// ---------- quiz ----------

/** The countries a round can ask about: the chosen region, minus the ones that
 *  are not countries, minus the ones already asked this round. */
function mapQuizPool(data) {
    const asked = (data.quiz && data.quiz.asked) || [];
    return MAP_COUNTRIES.map(function(row, i) { return i; }).filter(function(i) {
        const row = MAP_COUNTRIES[i];
        if (MAP_NOT_QUIZZABLE.indexOf(row[3]) !== -1) return false;
        if (data.region !== 'world' && row[3] !== data.region) return false;
        return asked.indexOf(row[1]) === -1;
    });
}

function mapQuizStart(el) {
    const widget = mapGetWidget(el);
    const toolId = mapGetToolId(widget);
    const data = mapGetData(toolId);
    data.mode = 'quiz';
    data.selected = null;
    // Frame the region being quizzed. Starting a round zoomed in on somewhere else
    // asks you to find a country that is not on screen.
    data.view = mapClampView(MAP_REGIONS[data.region] || MAP_REGIONS.world);
    data.quiz = { target: null, asked: [], attempts: 0, correct: 0, done: false };
    mapQuizAsk(data);
    mapSaveData(toolId, data);
    mapApplyView(widget, data.view);
    mapRender(widget);
}

/** Move to the next question, or end the round. */
function mapQuizAsk(data) {
    const pool = mapQuizPool(data);
    if (!pool.length || data.quiz.asked.length >= MAP_ROUND) {
        data.quiz.done = true;
        data.quiz.target = null;
        return;
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    data.quiz.target = MAP_COUNTRIES[pick][1];
    data.quiz.asked.push(data.quiz.target);
    data.quiz.attempts = 0;
}

/**
 * Whether a click counts as hitting the country being asked for. The shape
 * decides when it is big enough to hit; otherwise anything within a few pixels of
 * the country's label point counts, because Luxembourg at world zoom is three
 * pixels across and would be unwinnable on the shape alone.
 */
function mapHitsTarget(widget, iso, targetIso, e) {
    if (iso === targetIso) return true;
    const country = mapCountry(mapIndexOf(targetIso));
    if (!country) return false;
    const svg = widget.querySelector('.map-svg');
    const point = mapClientToUser(svg, e.clientX, e.clientY);
    if (!point || !point.scale) return false;
    const dx = point.x - mapProjectX(country.lon);
    const dy = point.y - mapProjectY(country.lat);
    return Math.sqrt(dx * dx + dy * dy) * point.scale <= MAP_HIT_PX;
}

function mapQuizAnswer(widget, toolId, iso, e) {
    const data = mapGetData(toolId);
    const quiz = data.quiz;
    if (!quiz || quiz.done || !quiz.target) return;
    const runtime = mapRuntimeFor(toolId);
    if (runtime.timer) return;   // a flash is already playing out

    const target = quiz.target;
    const right = mapHitsTarget(widget, iso, target, e);
    if (!data.progress[target]) data.progress[target] = { right: 0, wrong: 0 };

    if (right) {
        quiz.correct++;
        data.progress[target].right++;
        data.streak++;
        if (data.streak > data.best) data.best = data.streak;
    } else {
        quiz.attempts++;
        data.progress[target].wrong++;
        data.streak = 0;
        if (quiz.attempts < MAP_TRIES) {
            mapSaveData(toolId, data);
            mapRender(widget);
            mapFlash(widget, toolId, iso, 'wrong', null);
            return;
        }
    }

    mapSaveData(toolId, data);
    mapRender(widget);
    // Right or given away, the answer is shown before moving on.
    mapFlash(widget, toolId, right ? target : iso, right ? 'right' : 'wrong', target);
}

/** Colour the answer for a moment, then ask the next one. */
function mapFlash(widget, toolId, iso, className, advanceTo) {
    const runtime = mapRuntimeFor(toolId);
    const paint = function(targetIso, cls) {
        const path = targetIso && widget.querySelector('.map-country[data-iso="' + targetIso + '"]');
        if (path) path.classList.add(cls);
    };
    paint(iso, className);
    if (advanceTo && advanceTo !== iso) paint(advanceTo, 'right');
    if (!advanceTo) return;

    runtime.timer = setTimeout(function() {
        runtime.timer = null;
        if (!widget.isConnected) return;
        const data = mapGetData(toolId);
        if (!data.quiz || data.quiz.done) { mapRender(widget); return; }
        mapQuizAsk(data);
        mapSaveData(toolId, data);
        mapRender(widget);
    }, 900);
}

function mapQuizSkip(btn) {
    const widget = mapGetWidget(btn);
    const toolId = mapGetToolId(widget);
    const data = mapGetData(toolId);
    if (!data.quiz || data.quiz.done) return;
    data.streak = 0;
    mapQuizAsk(data);
    mapSaveData(toolId, data);
    mapRender(widget);
}

function mapResetProgress(btn) {
    const widget = mapGetWidget(btn);
    const toolId = mapGetToolId(widget);
    const data = mapGetData(toolId);
    data.progress = {};
    data.streak = 0;
    data.best = 0;
    mapSaveData(toolId, data);
    mapRender(widget);
}

(function injectScriptsForExport() {
    if (document.getElementById('educational-tools-scripts')) return;

    var clockFunctions = [initClock, clockDrag, clockEndDrag, clockRender, clockSetNow, clockRandomize, clockClearChallenge, clockNewChallenge, clockCheckAnswer];
    var moneyFunctions = [moneyInit, moneyGetWidget, moneyRender, moneyAdd, moneyRemove, moneyClear, moneyTotal, moneyFormat, moneySetMode, moneyNewRound, moneyNewChallenge, moneyCheckAnswer, moneyNewChange, moneyNewNameit, moneyCheckNameit, moneyComputeOptimal, moneyNewLeast, moneyCheckLeast, moneyDragStart, moneyDragOver, moneyDragLeave, moneyDrop];
    var ptableFunctions = [ptableGetToolId, ptableGetWidget, ptableBuildGrid, ptableRender, ptableSelect, ptableSearch, ptableFilter, ptableInit];
    var sdtFunctions = [sdtGetToolId, sdtGetWidget, sdtInit, sdtSolveFor, sdtCalculate, sdtFormatNum, sdtClear, sdtKeydown];
    var multFunctions = [multGetToolId, multGetWidget, multInit, multSetTab, multRenderGrid, multSetMax, multSetHalf, multToggleHard, multCellHover, multCellOut, multRenderChallenge, multToggleDigit, multNextQuestion, multCheckAnswer, multSubmitChallenge, multUpdateScore, multNewChallenge];
    var nlFunctions = [nlGetToolId, nlGetWidget, nlDefaultState, nlInit, nlSetMode, nlRender, nlRenderWidget, nlTickLevel, nlBuildLine, nlBuildLineZoomOut, nlFractionRender, nlFractionSetDenom, nlFractionToggleLabels, nlFractionToggleBar, nlSvgClick, nlMarkerDown, nlSvgMove, nlSvgUp, nlFrogRender, nlFrogSetStart, nlFrogAddJump, nlFrogClear, nlFrogRemoveJump, nlZoomRender, nlZoomSvgClick, nlZoomSetValue, nlZoomSetRoundTo, nlZoomAnswer, nlGameNew, nlGameSetDenom, nlGameRender, nlGameBuildSvg, nlGameCheck];
    var angFunctions = [angGetToolId, angGetWidget, angComputeAngle, angArcPath, angClassify, angInit, angRayDown, angDialDown, angSvgMove, angSvgUp, angRender, angToggleSnap, angToggleBigMode, angAddTurn, angResetDial];
    var tlFunctions = [tlGetToolId, tlGetWidget, tlGetData, tlSaveData, tlInit, tlGenId, tlSafeColor, tlClosePanels, tlFormatSingleDate, tlFormatDate, tlFormatEraYear, tlFormatEraRange, tlContrastColor, tlEraTypeOptionsHtml, tlSortEvents, tlFindEraForEvent, tlGetCategoryById, tlRender, tlRenderEraBanner, tlRenderEvent, tlPopulateCategorySelect, tlOpenEventForm, tlEditEvent, tlCloseEventForm, tlSaveEvent, tlDeleteEvent, tlToggleCategoryManager, tlRenderCategoryList, tlAddCategory, tlRenameCategory, tlSetCategoryColor, tlDeleteCategory, tlToggleEraManager, tlRenderEraList, tlAddEra, tlUpdateEraField, tlDeleteEra, tlLoadEraPreset, tlToggleShowEras, tlToggleDates];
    var mapFunctions = [mapGetToolId, mapGetWidget, mapRuntimeFor, mapCountry, mapIndexOf, mapDecodeInt, mapGeometry, mapProjectX, mapProjectY, mapRingsToPath, mapCountryBounds, mapGetData, mapSaveData, mapClampView, mapApplyView, mapClientToUser, mapViewAround, mapSetView, mapZoomBtn, mapZoomAt, mapResetView, mapZoomToCountry, mapInit, mapBuildShapes, mapRender, mapPaint, mapFlag, mapFormatPop, mapExplorePanel, mapQuizPanel, mapBindStage, mapIsoAt, mapTooltip, mapHideTooltip, mapClick, mapSetMode, mapSetRegion, mapSearch, mapQuizPool, mapQuizStart, mapQuizAsk, mapHitsTarget, mapQuizAnswer, mapFlash, mapQuizSkip, mapResetProgress];
    var allFunctions = clockFunctions.concat(moneyFunctions).concat(ptableFunctions).concat(sdtFunctions).concat(multFunctions).concat(nlFunctions).concat(angFunctions).concat(tlFunctions).concat(mapFunctions);

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
        'window.MAP_COUNTRIES = ' + JSON.stringify(MAP_COUNTRIES) + ';\n' +
        'window.MAP_GEOMETRY = ' + JSON.stringify(MAP_GEOMETRY) + ';\n' +
        'window.MAP_REGIONS = ' + JSON.stringify(MAP_REGIONS) + ';\n' +
        'window.MAP_NOT_QUIZZABLE = ' + JSON.stringify(MAP_NOT_QUIZZABLE) + ';\n' +
        'window.MAP_W = ' + MAP_W + '; window.MAP_H = ' + MAP_H + ';\n' +
        'window.MAP_MIN_W = ' + MAP_MIN_W + '; window.MAP_ROUND = ' + MAP_ROUND + ';\n' +
        'window.MAP_TRIES = ' + MAP_TRIES + '; window.MAP_HIT_PX = ' + MAP_HIT_PX + ';\n' +
        'window.mapGeometryCache = null; window.mapIso3Index = null; window.mapRuntime = {};\n' +
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
    tools: ['analog-clock', 'money-counter', 'periodic-table', 'speed-distance-time', 'multiplication-table', 'number-line-explorer', 'angle-explorer', 'history-timeline', 'world-map'],
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
            '<button class="tl-toolbar-btn tl-dates-toggle" onclick="tlToggleDates(this)">🗓 Hide Dates</button>' +
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

// World Map
PluginRegistry.registerTool({
    id: 'world-map',
    name: 'World Map',
    description: 'Interactive world map with country facts and a find-the-country quiz',
    icon: '🌍',
    version: '1.0.0',
    toolbox: 'educational-tools',
    tags: ['map', 'world', 'geography', 'country', 'countries', 'capital', 'atlas', 'quiz', 'learn', 'education'],
    title: 'World Map',
    content: '<div class="map-widget">' +
        '<div class="map-toolbar">' +
            '<button class="map-btn map-mode" data-mode="explore" onclick="mapSetMode(this, \'explore\')">Explore</button>' +
            '<button class="map-btn map-mode" data-mode="quiz" onclick="mapSetMode(this, \'quiz\')">Quiz</button>' +
            '<select class="map-select map-region" onchange="mapSetRegion(this)"></select>' +
            '<input type="search" class="map-search" placeholder="Search country" oninput="mapSearch(this)">' +
            '<span class="map-spacer"></span>' +
            '<span class="map-stat"></span>' +
        '</div>' +
        '<div class="map-stage">' +
            '<svg class="map-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet"></svg>' +
            '<div class="map-tooltip"></div>' +
            '<div class="map-zoom">' +
                '<button class="map-btn" onclick="mapZoomBtn(this, 0.7)" title="Zoom in">+</button>' +
                '<button class="map-btn" onclick="mapZoomBtn(this, 1.4)" title="Zoom out">−</button>' +
                '<button class="map-btn" onclick="mapResetView(this)" title="Back to the whole region">⌂</button>' +
            '</div>' +
        '</div>' +
        '<div class="map-panel"></div>' +
    '</div>',
    contentType: 'html',
    onInit: 'mapInit',
    defaultWidth: 720,
    defaultHeight: 520,
    source: 'external'
});

console.log('Educational Tools plugin loaded (9 tools)');
