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
    --map-label:#5a5346; --map-ghost:rgba(155,89,182,0.55); --map-ghost-stroke:#8e44ad;
    --map-capital:#b03a2e; --map-capital-on:#c0392b; --map-halo:rgba(255,255,255,0.7);
    --map-hint-cold:#4a6fa5; --map-hint-warm:#e08a1e; --map-hint-hot:#27ae60;
    display:flex; flex-direction:column; gap:6px; padding:8px; box-sizing:border-box;
    flex:1; min-height:0; width:100%; font-size:12px;
}
body.dark-mode .map-widget {
    --map-ocean:#16283a; --map-land:#3a465c; --map-land-hover:#4d5c78; --map-stroke:#20293a;
    --map-learned:#3f6048; --map-selected:#f39c12; --map-right:#2ecc71; --map-wrong:#e74c3c;
    --map-label:#dfe4ec; --map-ghost:rgba(155,89,182,0.6); --map-ghost-stroke:#c39bd3;
    --map-capital:#e8705f; --map-capital-on:#ff8a75; --map-halo:rgba(12,20,32,0.7);
    --map-hint-cold:#7fa3d6; --map-hint-warm:#f0a842; --map-hint-hot:#2ecc71;
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
/* non-scaling-stroke, so this is screen pixels at every zoom. 0.35 was enough for
   the old 110m outlines, which ran in long straight segments that landed on a pixel
   and stayed there; 50m borders change direction constantly, and a sub-pixel stroke
   on a diagonal is split across two pixels and washes out. */
.map-country { fill:var(--map-land); stroke:var(--map-stroke); stroke-width:0.6; vector-effect:non-scaling-stroke; }
.map-svg:not(.quiz) .map-country:hover { fill:var(--map-land-hover); }
.map-country.learned { fill:var(--map-learned); }
.map-country.selected { fill:var(--map-selected); }
.map-country.right { fill:var(--map-right); }
.map-country.wrong { fill:var(--map-wrong); }
.map-svg.comparing .map-country { cursor:move; }
/* Above the shapes so no country paints over a neighbour's name, and deaf to the
   pointer so a label never swallows a click meant for the country under it. */
/* stroke-width is set in script, not here: it is measured in user units, so a
   fixed one grows with the zoom until the halo is tens of pixels of paint and the
   label swallows the island it names — coastline, border, capital dot and all.
   vector-effect would fix that on a shape, but Chrome does not honour it on text. */
.map-labels { pointer-events:none; fill:var(--map-label); text-anchor:middle; dominant-baseline:middle; font-family:inherit; paint-order:stroke; stroke:var(--map-halo); stroke-linejoin:round; }
.map-labels .hidden { display:none; }
.map-svg.quiz .map-labels { display:none; }
.map-ghost { fill:var(--map-ghost); stroke:var(--map-ghost-stroke); stroke-width:1; vector-effect:non-scaling-stroke; pointer-events:none; }
.map-capitals { pointer-events:none; }
.map-capital { fill:var(--map-capital); stroke:var(--map-land); stroke-width:1; vector-effect:non-scaling-stroke; }
.map-capital.hidden { display:none; }
.map-capital.selected { fill:var(--map-capital-on); stroke:#fff; }
.map-svg.quiz .map-capitals { display:none; }
/* Positioned from script rather than by a transform, so it can be kept inside the
   stage: at this size a tooltip near an edge would otherwise hang off the map. */
.map-tooltip { position:absolute; pointer-events:none; display:flex; flex-direction:column; gap:2px; padding:7px 13px; border-radius:6px; background:var(--bg-primary); color:var(--text-primary); border:1px solid var(--border-color); font-size:18px; line-height:1.25; white-space:nowrap; opacity:0; box-shadow:0 2px 10px var(--shadow-light); }
/* The flag outsizes the name it sits beside, so the row centres on it rather
   than on a baseline the emoji does not share. */
.map-tip-name { display:flex; align-items:center; gap:9px; font-weight:600; }
.map-tip-flag { font-size:32px; line-height:1; }
.map-tip-capital { font-size:14px; color:var(--text-muted); }
.map-tooltip.show { opacity:1; }
/* The arrow is the pointer while a hint is on, so it centres on the cursor and
   its colour carries the distance: cold far away, hot on top of the answer. */
.map-svg.hinting { cursor:none; }
.map-arrow { position:absolute; pointer-events:none; opacity:0; color:var(--map-hint-cold); line-height:0; filter:drop-shadow(0 1px 2px rgba(0,0,0,0.35)); transform:translate(-50%,-50%) rotate(var(--map-arrow-turn,0deg)); transition:color 0.15s, opacity 0.1s; }
.map-arrow.show { opacity:1; }
.map-arrow.warm { color:var(--map-hint-warm); }
.map-arrow.hot { color:var(--map-hint-hot); }
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

// Natural Earth 50m (public domain): ne_50m_admin_0_countries for the shapes and
// facts, ne_10m_populated_places_simple for the capitals. Coordinates are kept as
// coordinates rather than as SVG paths so the map is not welded to one projection.
//
// 50m rather than 110m because 110m carries 177 features and leaves out every small
// island state — no Malta, Singapore, Maldives, Barbados, Bahrain or Mauritius, and
// no Martinique, Guadeloupe, Réunion or Mayotte inside France. 50m has 242, at nine
// times the points; each ring is then simplified with a tolerance scaled to its own
// size, which takes Canada from 11,573 points to 2,066 and leaves Malta at 15. The
// islands are the reason for the upgrade, so they keep the detail they have.
//
// To rebuild: take both files from github.com/nvkelso/natural-earth-vector under
// geojson/, round coordinates to 2 decimals, simplify, and encode as described
// above MAP_GEOMETRY. Capitals join on adm0_a3, but adm0cap flags only sovereign
// capitals, so territories fall through to the "Admin-0 region capital" class; and
// in a dozen more Natural Earth names the largest or the historical city rather
// than the capital. Those, and the island towns missing from the layer entirely,
// are corrected by hand — a rebuild must not overwrite them blindly.
//
// Identity is ISO_A3, or ADM0_A3 where that is "-99" (France, Norway, Kosovo,
// N. Cyprus, Somaliland). Not ISO_A3_EH: it files a dependency under its parent
// state, which would give Australia and its two island territories one code
// between them.

// [iso2, iso3, name, continent, subregion, population, capital, labelLon, labelLat,
//  capitalLon, capitalLat]
// Longitudes and latitudes throughout are integer hundredths of a degree.
const MAP_COUNTRIES = [
    ["ZW","ZWE","Zimbabwe","Africa","Eastern Africa",14645468,"Harare",2993,-1891,3104,-1782],
    ["ZM","ZMB","Zambia","Africa","Eastern Africa",17861030,"Lusaka",2640,-1466,2828,-1541],
    ["YE","YEM","Yemen","Asia","Western Asia",29161922,"Sanaa",4587,1533,4420,1536],
    ["VN","VNM","Vietnam","Asia","South-Eastern Asia",96462106,"Hanoi",10539,2172,10585,2104],
    ["VE","VEN","Venezuela","South America","South America",28515829,"Caracas",-6460,718,-6692,1050],
    ["VA","VAT","Vatican","Europe","Southern Europe",825,"Vatican City",1245,4190,1245,4190],
    ["VU","VUT","Vanuatu","Oceania","Melanesia",299882,"Port Vila",16691,-1537,16832,-1773],
    ["UZ","UZB","Uzbekistan","Asia","Central Asia",33580650,"Tashkent",6401,4169,6927,4130],
    ["UY","URY","Uruguay","South America","South America",3461734,"Montevideo",-5597,-3296,-5619,-3491],
    ["FM","FSM","Micronesia","Oceania","Micronesia",113815,"Palikir",15823,689,15815,692],
    ["MH","MHL","Marshall Is.","Oceania","Micronesia",58791,"Majuro",17119,708,17138,710],
    ["MP","MNP","N. Mariana Is.","Oceania","Micronesia",57216,"Capitol Hill",14573,1519,14575,1521],
    ["VI","VIR","U.S. Virgin Is.","North America","Caribbean",106631,"Charlotte Amalie",-6478,1775,-6493,1834],
    ["GU","GUM","Guam","Oceania","Micronesia",167294,"Hagåtña",14470,1335,14475,1348],
    ["AS","ASM","American Samoa","Oceania","Polynesia",55312,"Pago Pago",-17075,-1433,-17071,-1428],
    ["PR","PRI","Puerto Rico","North America","Caribbean",3193694,"San Juan",-6648,1823,-6613,1844],
    ["US","USA","United States of America","North America","Northern America",328239523,"Washington,  D.C.",-9748,3954,-7701,3890],
    ["GS","SGS","S. Geo. and the Is.","South America","Seven seas (open ocean)",30,"Grytviken",-3106,-5568,-3651,-5428],
    ["IO","IOT","Br. Indian Ocean Ter.","Africa","Seven seas (open ocean)",3000,"Diego Garcia",7135,-619,7241,-731],
    ["SH","SHN","Saint Helena","Africa","Western Africa",4534,"Jamestown",-571,-1595,-572,-1593],
    ["PN","PCN","Pitcairn Is.","Oceania","Polynesia",54,"Adamstown",-12832,-2436,null,null],
    ["AI","AIA","Anguilla","North America","Caribbean",14731,"The Valley",-6303,1824,-6306,1822],
    ["FK","FLK","Falkland Is.","South America","South America",3398,"Stanley",-5874,-5161,-5785,-5170],
    ["KY","CYM","Cayman Is.","North America","Caribbean",64948,"George Town",-8124,1932,-8137,1929],
    ["BM","BMU","Bermuda","North America","Northern America",63918,"Hamilton",-6476,3230,-6478,3229],
    ["VG","VGB","British Virgin Is.","North America","Caribbean",30030,"Road Town",-6464,1843,-6462,1843],
    ["TC","TCA","Turks and Caicos Is.","North America","Caribbean",38191,"Grand Turk",-7175,2182,null,null],
    ["MS","MSR","Montserrat","North America","Caribbean",4649,"Brades",-6219,1674,-6221,1679],
    ["JE","JEY","Jersey","Europe","Northern Europe",107800,"Saint Helier",-209,4922,-210,4919],
    ["GG","GGY","Guernsey","Europe","Northern Europe",62792,"Saint Peter Port",-256,4946,-254,4946],
    ["IM","IMN","Isle of Man","Europe","Northern Europe",84584,"Douglas",-453,5422,-448,5415],
    ["GB","GBR","United Kingdom","Europe","Northern Europe",66834405,"London",-212,5440,-12,5150],
    ["AE","ARE","United Arab Emirates","Asia","Western Asia",9770529,"Abu Dhabi",5455,2347,5437,2447],
    ["UA","UKR","Ukraine","Europe","Eastern Europe",44385155,"Kyiv",3214,4972,3051,5044],
    ["UG","UGA","Uganda","Africa","Eastern Africa",44269594,"Kampala",3295,197,3258,32],
    ["TM","TKM","Turkmenistan","Asia","Central Asia",5942089,"Ashgabat",5868,3986,5838,3795],
    ["TR","TUR","Turkey","Asia","Western Asia",83429615,"Ankara",3451,3935,3286,3993],
    ["TN","TUN","Tunisia","Africa","Northern Africa",11694719,"Tunis",901,3369,1018,3680],
    ["TT","TTO","Trinidad and Tobago","North America","Caribbean",1394973,"Port-of-Spain",-6092,1100,-6152,1065],
    ["TO","TON","Tonga","Oceania","Polynesia",104494,"Nuku'alofa",-17516,-2121,-17522,-2114],
    ["TG","TGO","Togo","Africa","Western Africa",8082366,"Lomé",106,881,122,613],
    ["TL","TLS","Timor-Leste","Asia","South-Eastern Asia",1293119,"Dili",12585,-880,12558,-856],
    ["TH","THA","Thailand","Asia","South-Eastern Asia",69625582,"Bangkok",10107,1546,10051,1375],
    ["TZ","TZA","Tanzania","Africa","Eastern Africa",58005463,"Dodoma",3496,-605,3575,-618],
    ["TJ","TJK","Tajikistan","Asia","Central Asia",9321018,"Dushanbe",7259,3820,6877,3856],
    ["TW","TWN","Taiwan","Asia","Eastern Asia",23568378,"Taipei",12087,2365,12157,2504],
    ["SY","SYR","Syria","Asia","Western Asia",17070135,"Damascus",3828,3501,3630,3350],
    ["CH","CHE","Switzerland","Europe","Western Europe",8574832,"Bern",746,4672,747,4692],
    ["SE","SWE","Sweden","Europe","Northern Europe",10285453,"Stockholm",1902,6586,1807,5932],
    ["SZ","SWZ","eSwatini","Africa","Southern Africa",1148130,"Mbabane",3147,-2653,3113,-2632],
    ["SR","SUR","Suriname","South America","South America",581363,"Paramaribo",-5591,414,-5517,584],
    ["SS","SSD","S. Sudan","Africa","Eastern Africa",11062113,"Juba",3039,723,3158,483],
    ["SD","SDN","Sudan","Africa","Northern Africa",42813238,"Khartoum",2926,1633,3253,1559],
    ["LK","LKA","Sri Lanka","Asia","Southern Asia",21803000,"Sri Jayawardenepura Kotte",8070,758,7995,690],
    ["ES","ESP","Spain","Europe","Southern Europe",47076781,"Madrid",-346,4009,-369,4040],
    ["KR","KOR","South Korea","Asia","Eastern Asia",51709098,"Seoul",12813,3638,12700,3757],
    ["ZA","ZAF","South Africa","Africa","Southern Africa",58558270,"Pretoria",2367,-2971,2823,-2570],
    ["SO","SOM","Somalia","Africa","Eastern Africa",10192317,"Mogadishu",4519,357,4536,207],
    ["","SOL","Somaliland","Africa","Eastern Africa",5096159,"Hargeisa",4673,944,4407,956],
    ["SB","SLB","Solomon Is.","Oceania","Melanesia",669823,"Honiara",15917,-803,15995,-944],
    ["SK","SVK","Slovakia","Europe","Eastern Europe",5454073,"Bratislava",1905,4873,1712,4815],
    ["SI","SVN","Slovenia","Europe","Southern Europe",2087946,"Ljubljana",1492,4606,1451,4606],
    ["SG","SGP","Singapore","Asia","South-Eastern Asia",5703569,"Singapore",10382,137,10385,129],
    ["SL","SLE","Sierra Leone","Africa","Western Africa",7813215,"Freetown",-1176,862,-1324,847],
    ["SC","SYC","Seychelles","Africa","Eastern Africa",97625,"Victoria",5548,-468,5545,-462],
    ["RS","SRB","Serbia","Europe","Southern Europe",6944975,"Belgrade",2079,4419,2047,4482],
    ["SN","SEN","Senegal","Africa","Western Africa",16296364,"Dakar",-1478,1514,-1748,1472],
    ["SA","SAU","Saudi Arabia","Asia","Western Asia",34268528,"Riyadh",4470,2381,4672,2463],
    ["ST","STP","São Tomé and Principe","Africa","Middle Africa",215056,"São Tomé",702,97,673,34],
    ["SM","SMR","San Marino","Europe","Southern Europe",33860,"San Marino",1244,4393,1244,4394],
    ["WS","WSM","Samoa","Oceania","Polynesia",197097,"Apia",-17244,-1364,-17177,-1384],
    ["VC","VCT","St. Vin. and Gren.","North America","Caribbean",110589,"Kingstown",-6134,1309,-6122,1316],
    ["LC","LCA","Saint Lucia","North America","Caribbean",182790,"Castries",-6098,1389,-6099,1401],
    ["KN","KNA","St. Kitts and Nevis","North America","Caribbean",52834,"Basseterre",-6276,1734,-6272,1730],
    ["RW","RWA","Rwanda","Africa","Eastern Africa",12626950,"Kigali",3010,-190,3006,-195],
    ["RU","RUS","Russia","Europe","Eastern Europe",144373535,"Moscow",4469,5825,3761,5575],
    ["RO","ROU","Romania","Europe","Eastern Europe",19356544,"Bucharest",2497,4573,2610,4444],
    ["QA","QAT","Qatar","Asia","Western Asia",2832067,"Doha",5114,2524,5153,2529],
    ["PT","PRT","Portugal","Europe","Southern Europe",10269417,"Lisbon",-827,3961,-915,3872],
    ["PL","POL","Poland","Europe","Eastern Europe",37970874,"Warsaw",1949,5199,2101,5223],
    ["PH","PHL","Philippines","Asia","South-Eastern Asia",108116615,"Manila",12247,1120,12098,1461],
    ["PE","PER","Peru","South America","South America",32510453,"Lima",-7290,-1298,-7705,-1205],
    ["PY","PRY","Paraguay","South America","South America",7044636,"Asunción",-6015,-2167,-5763,-2529],
    ["PG","PNG","Papua New Guinea","Oceania","Melanesia",8776109,"Port Moresby",14391,-570,14719,-946],
    ["PA","PAN","Panama","North America","Central America",4246439,"Panama City",-8035,872,-7953,897],
    ["PW","PLW","Palau","Oceania","Micronesia",18008,"Melekeok",13458,752,13463,749],
    ["PK","PAK","Pakistan","Asia","Southern Asia",216565318,"Islamabad",6855,2933,7308,3369],
    ["OM","OMN","Oman","Asia","Western Asia",4974986,"Muscat",5734,2212,5838,2359],
    ["NO","NOR","Norway","Europe","Northern Europe",5347896,"Oslo",968,6136,1075,5992],
    ["KP","PRK","North Korea","Asia","Eastern Asia",25666161,"Pyongyang",12644,3989,12575,3902],
    ["NG","NGA","Nigeria","Africa","Western Africa",200963599,"Abuja",750,944,749,905],
    ["NE","NER","Niger","Africa","Western Africa",23310715,"Niamey",950,1745,211,1352],
    ["NI","NIC","Nicaragua","North America","Central America",6545502,"Managua",-8507,1267,-8627,1215],
    ["NZ","NZL","New Zealand","Oceania","Australia and New Zealand",4917000,"Wellington",17279,-3976,17478,-4129],
    ["NU","NIU","Niue","Oceania","Polynesia",1620,"Alofi",-16986,-1905,-16991,-1907],
    ["CK","COK","Cook Is.","Oceania","Polynesia",17459,"Avarua",-15979,-2122,-15979,-2120],
    ["NL","NLD","Netherlands","Europe","Western Europe",17332850,"Amsterdam",561,5242,491,5235],
    ["AW","ABW","Aruba","North America","Caribbean",106314,"Oranjestad",-6997,1252,-7003,1252],
    ["CW","CUW","Curaçao","North America","Caribbean",157538,"Willemstad",-6892,1215,-6887,1211],
    ["NP","NPL","Nepal","Asia","Southern Asia",28608710,"Kathmandu",8364,2830,8531,2772],
    ["NR","NRU","Nauru","Oceania","Micronesia",12581,"Yaren",16693,-52,16692,-55],
    ["NA","NAM","Namibia","Africa","Southern Africa",2494530,"Windhoek",1711,-2058,1708,-2257],
    ["MZ","MOZ","Mozambique","Africa","Eastern Africa",30366036,"Maputo",3784,-1394,3259,-2595],
    ["MA","MAR","Morocco","Africa","Northern Africa",36471769,"Rabat",-719,3165,-684,3403],
    ["EH","ESH","W. Sahara","Africa","Northern Africa",603253,"Laayoune",-1263,2397,-1320,2715],
    ["ME","MNE","Montenegro","Europe","Southern Europe",622137,"Podgorica",1914,4280,1927,4247],
    ["MN","MNG","Mongolia","Asia","Eastern Asia",3225167,"Ulaanbaatar",10415,4600,10691,4792],
    ["MD","MDA","Moldova","Europe","Eastern Europe",2657637,"Chișinău",2849,4743,2886,4701],
    ["MC","MCO","Monaco","Europe","Western Europe",38964,"Monaco",740,4374,741,4374],
    ["MX","MEX","Mexico","North America","Central America",127575529,"Mexico City",-10229,2392,-9913,1944],
    ["MU","MUS","Mauritius","Africa","Eastern Africa",1265711,"Port Louis",5757,-2030,5750,-2017],
    ["MR","MRT","Mauritania","Africa","Western Africa",4525696,"Nouakchott",-974,1959,-1598,1809],
    ["MT","MLT","Malta","Europe","Southern Europe",502653,"Valletta",1443,3589,1451,3590],
    ["ML","MLI","Mali","Africa","Western Africa",19658031,"Bamako",-204,1869,-800,1265],
    ["MV","MDV","Maldives","Asia","Southern Asia",530953,"Malé",7351,417,7351,417],
    ["MY","MYS","Malaysia","Asia","South-Eastern Asia",31949777,"Kuala Lumpur",11384,253,10169,314],
    ["MW","MWI","Malawi","Africa","Eastern Africa",18628747,"Lilongwe",3361,-1339,3378,-1398],
    ["MG","MDG","Madagascar","Africa","Eastern Africa",26969307,"Antananarivo",4670,-1863,4751,-1891],
    ["MK","MKD","North Macedonia","Europe","Southern Europe",2083459,"Skopje",2156,4156,2143,4200],
    ["LU","LUX","Luxembourg","Europe","Western Europe",619896,"Luxembourg",608,4973,613,4961],
    ["LT","LTU","Lithuania","Europe","Northern Europe",2786844,"Vilnius",2409,5510,2532,5468],
    ["LI","LIE","Liechtenstein","Europe","Western Europe",38019,"Vaduz",956,4711,952,4713],
    ["LY","LBY","Libya","Africa","Northern Africa",6777452,"Tripoli",1801,2664,1318,3289],
    ["LR","LBR","Liberia","Africa","Western Africa",4937374,"Monrovia",-946,645,-1080,631],
    ["LS","LSO","Lesotho","Africa","Southern Africa",2125268,"Maseru",2825,-2948,2748,-2932],
    ["LB","LBN","Lebanon","Asia","Western Asia",6855713,"Beirut",3599,3413,3551,3387],
    ["LV","LVA","Latvia","Europe","Northern Europe",1912789,"Riga",2546,5707,2410,5695],
    ["LA","LAO","Laos","Asia","South-Eastern Asia",7169455,"Vientiane",10253,1943,10260,1797],
    ["KG","KGZ","Kyrgyzstan","Asia","Central Asia",6456900,"Bishkek",7453,4167,7458,4288],
    ["KW","KWT","Kuwait","Asia","Western Asia",4207083,"Kuwait City",4731,2941,4798,2937],
    ["XK","KOS","Kosovo","Europe","Southern Europe",1794248,"Pristina",2086,4259,2117,4267],
    ["KI","KIR","Kiribati","Oceania","Micronesia",117606,"Tarawa",-15738,182,17302,134],
    ["KE","KEN","Kenya","Africa","Eastern Africa",52573973,"Nairobi",3791,55,3681,-128],
    ["KZ","KAZ","Kazakhstan","Asia","Central Asia",18513930,"Astana",6869,4905,7143,5118],
    ["JO","JOR","Jordan","Asia","Western Asia",10101694,"Amman",3638,3081,3593,3195],
    ["JP","JPN","Japan","Asia","Eastern Asia",126264931,"Tokyo",13844,3614,13975,3569],
    ["JM","JAM","Jamaica","North America","Caribbean",2948279,"Kingston",-7732,1814,-7677,1798],
    ["IT","ITA","Italy","Europe","Southern Europe",60297396,"Rome",1108,4473,1248,4190],
    ["IL","ISR","Israel","Asia","Western Asia",9053300,"Jerusalem",3485,3091,3521,3178],
    ["PS","PSE","Palestine","Asia","Western Asia",4685306,"Ramallah",3529,3205,3521,3190],
    ["IE","IRL","Ireland","Europe","Northern Europe",4941444,"Dublin",-780,5308,-626,5335],
    ["IQ","IRQ","Iraq","Asia","Western Asia",39309783,"Baghdad",4326,3309,4439,3334],
    ["IR","IRN","Iran","Asia","Southern Asia",82913906,"Tehran",5493,3217,5142,3567],
    ["ID","IDN","Indonesia","Asia","South-Eastern Asia",270625568,"Jakarta",10189,-95,10683,-617],
    ["IN","IND","India","Asia","Southern Asia",1366417754,"New Delhi",7936,2269,7720,2860],
    ["IS","ISL","Iceland","Europe","Northern Europe",361313,"Reykjavík",-1867,6478,-2194,6414],
    ["HU","HUN","Hungary","Europe","Eastern Europe",9769949,"Budapest",1945,4709,1908,4750],
    ["HN","HND","Honduras","North America","Central America",9746117,"Tegucigalpa",-8689,1479,-8722,1410],
    ["HT","HTI","Haiti","North America","Caribbean",11263077,"Port-au-Prince",-7222,1926,-7234,1854],
    ["GY","GUY","Guyana","South America","South America",782766,"Georgetown",-5894,512,-5817,680],
    ["GW","GNB","Guinea-Bissau","Africa","Western Africa",1920922,"Bissau",-1452,1216,-1560,1187],
    ["GN","GIN","Guinea","Africa","Western Africa",12771246,"Conakry",-1002,1062,-1368,953],
    ["GT","GTM","Guatemala","North America","Central America",16604026,"Guatemala City",-9050,1498,-9053,1462],
    ["GD","GRD","Grenada","North America","Caribbean",112003,"Saint George's",-6168,1211,-6174,1205],
    ["GR","GRC","Greece","Europe","Southern Europe",10716322,"Athens",2173,3949,2373,3799],
    ["GH","GHA","Ghana","Africa","Western Africa",30417856,"Accra",-104,772,-22,555],
    ["DE","DEU","Germany","Europe","Western Europe",83132799,"Berlin",968,5096,1340,5252],
    ["GE","GEO","Georgia","Asia","Western Asia",3720382,"Tbilisi",4374,4187,4479,4173],
    ["GM","GMB","Gambia","Africa","Western Africa",2347706,"Banjul",-1500,1364,-1659,1345],
    ["GA","GAB","Gabon","Africa","Middle Africa",2172579,"Libreville",1184,-44,946,39],
    ["FR","FRA","France","Europe","Western Europe",67059887,"Paris",255,4670,235,4886],
    ["PM","SPM","St. Pierre and Miquelon","North America","Northern America",5997,"Saint-Pierre",-5633,4704,-5617,4678],
    ["WF","WLF","Wallis and Futuna Is.","Oceania","Polynesia",11558,"Mata-Utu",-17814,-1429,-17617,-1328],
    ["MF","MAF","St-Martin","North America","Caribbean",38002,"Marigot",-6305,1808,-6308,1807],
    ["BL","BLM","St-Barthélemy","North America","Caribbean",9961,"Gustavia",-6283,1790,-6285,1790],
    ["PF","PYF","Fr. Polynesia","Oceania","Polynesia",279287,"Papeete",-14946,-1763,-14957,-1753],
    ["NC","NCL","New Caledonia","Oceania","Melanesia",287800,"Nouméa",16508,-2106,16644,-2226],
    ["TF","ATF","Fr. S. Antarctic Lands","Antarctica","Seven seas (open ocean)",140,"Port-aux-Français",6912,-4930,7022,-4935],
    ["AX","ALA","Åland","Europe","Northern Europe",29884,"Mariehamn",1987,6016,1994,6010],
    ["FI","FIN","Finland","Europe","Northern Europe",5520314,"Helsinki",2728,6325,2493,6016],
    ["FJ","FJI","Fiji","Oceania","Melanesia",889953,"Suva",17798,-1783,17844,-1813],
    ["ET","ETH","Ethiopia","Africa","Eastern Africa",112078730,"Addis Ababa",3909,803,3870,904],
    ["EE","EST","Estonia","Europe","Northern Europe",1326590,"Tallinn",2587,5872,2473,5943],
    ["ER","ERI","Eritrea","Africa","Eastern Africa",6081196,"Asmara",3829,1579,3893,1533],
    ["GQ","GNQ","Eq. Guinea","Africa","Middle Africa",1355986,"Malabo",899,233,878,375],
    ["SV","SLV","El Salvador","North America","Central America",6453553,"San Salvador",-8889,1369,-8922,1370],
    ["EG","EGY","Egypt","Africa","Northern Africa",100388073,"Cairo",2945,2619,3125,3005],
    ["EC","ECU","Ecuador","South America","South America",17373662,"Quito",-7819,-126,-7850,-21],
    ["DO","DOM","Dominican Rep.","North America","Caribbean",10738958,"Santo Domingo",-7065,1910,-6993,1847],
    ["DM","DMA","Dominica","North America","Caribbean",71808,"Roseau",-6134,1546,-6139,1530],
    ["DJ","DJI","Djibouti","Africa","Eastern Africa",973560,"Djibouti",4250,1198,4315,1160],
    ["GL","GRL","Greenland","North America","Northern America",56225,"Nuuk",-3934,7432,-5173,6420],
    ["FO","FRO","Faeroe Is.","Europe","Northern Europe",48678,"Tórshavn",-706,6219,-677,6201],
    ["DK","DNK","Denmark","Europe","Northern Europe",5818553,"København",902,5597,1256,5568],
    ["CZ","CZE","Czechia","Europe","Eastern Europe",10669709,"Prague",1538,4988,1442,5009],
    ["","CYN","N. Cyprus","Asia","Western Asia",326000,"North Nicosia",3369,3522,3336,3519],
    ["CY","CYP","Cyprus","Asia","Western Asia",1198575,"Nicosia",3308,3491,3337,3517],
    ["CU","CUB","Cuba","North America","Caribbean",11333483,"Havana",-7798,2133,-8237,2313],
    ["HR","HRV","Croatia","Europe","Southern Europe",4067500,"Zagreb",1637,4581,1600,4580],
    ["CI","CIV","Côte d'Ivoire","Africa","Western Africa",25716544,"Yamoussoukro",-557,749,-528,682],
    ["CR","CRI","Costa Rica","North America","Central America",5047561,"San José",-8408,1007,-8408,993],
    ["CD","COD","Dem. Rep. Congo","Africa","Middle Africa",86790567,"Kinshasa",2346,-186,1531,-433],
    ["CG","COG","Congo","Africa","Middle Africa",5380508,"Brazzaville",1590,14,1528,-426],
    ["KM","COM","Comoros","Africa","Eastern Africa",850886,"Moroni",4332,-1173,4324,-1170],
    ["CO","COL","Colombia","South America","South America",50339443,"Bogota",-7317,337,-7409,460],
    ["CN","CHN","China","Asia","Eastern Asia",1397715000,"Beijing",10634,3250,11639,3990],
    ["MO","MAC","Macao","Asia","Eastern Asia",640445,"Macau",11356,2213,11354,2219],
    ["HK","HKG","Hong Kong","Asia","Eastern Asia",7507400,"Hong Kong",11410,2245,11418,2231],
    ["CL","CHL","Chile","South America","South America",18952038,"Santiago",-7232,-3815,-7065,-3344],
    ["TD","TCD","Chad","Africa","Middle Africa",15946876,"N'Djamena",1865,1514,1505,1212],
    ["CF","CAF","Central African Rep.","Africa","Middle Africa",4745185,"Bangui",2091,699,1856,437],
    ["CV","CPV","Cabo Verde","Africa","Western Africa",549935,"Praia",-2364,1507,-2352,1492],
    ["CA","CAN","Canada","North America","Northern America",37589262,"Ottawa",-10191,6032,-7570,4542],
    ["CM","CMR","Cameroon","Africa","Middle Africa",25876380,"Yaoundé",1247,459,1151,387],
    ["KH","KHM","Cambodia","Asia","South-Eastern Asia",16486542,"Phnom Penh",10450,1265,10491,1155],
    ["MM","MMR","Myanmar","Asia","South-Eastern Asia",54045420,"Naypyidaw",9580,2157,9612,1977],
    ["BI","BDI","Burundi","Africa","Eastern Africa",11530580,"Gitega",2992,-333,2984,-343],
    ["BF","BFA","Burkina Faso","Africa","Western Africa",20321378,"Ouagadougou",-136,1267,-153,1237],
    ["BG","BGR","Bulgaria","Europe","Eastern Europe",6975761,"Sofia",2516,4251,2331,4269],
    ["BN","BRN","Brunei","Asia","South-Eastern Asia",433285,"Bandar Seri Begawan",11455,445,11493,488],
    ["BR","BRA","Brazil","South America","South America",211049527,"Brasília",-4956,-1210,-4792,-1578],
    ["BW","BWA","Botswana","Africa","Southern Africa",2303697,"Gaborone",2418,-2210,2591,-2465],
    ["BA","BIH","Bosnia and Herz.","Europe","Southern Europe",3301000,"Sarajevo",1807,4409,1838,4385],
    ["BO","BOL","Bolivia","South America","South America",11513100,"Sucre",-6459,-1667,-6526,-1904],
    ["BT","BTN","Bhutan","Asia","Southern Asia",763092,"Thimphu",9004,2754,8964,2747],
    ["BJ","BEN","Benin","Africa","Western Africa",11801151,"Porto-Novo",235,1032,262,648],
    ["BZ","BLZ","Belize","North America","Central America",390353,"Belmopan",-8871,1720,-8877,1725],
    ["BE","BEL","Belgium","Europe","Western Europe",11484055,"Brussels",480,5079,433,5084],
    ["BY","BLR","Belarus","Europe","Eastern Europe",9466856,"Minsk",2842,5382,2756,5390],
    ["BB","BRB","Barbados","North America","Caribbean",287025,"Bridgetown",-5957,1316,-5962,1310],
    ["BD","BGD","Bangladesh","Asia","Southern Asia",163046161,"Dhaka",8968,2421,9041,2373],
    ["BH","BHR","Bahrain","Asia","Western Asia",1641172,"Manama",5055,2606,5058,2624],
    ["BS","BHS","Bahamas","North America","Caribbean",389482,"Nassau",-7715,2640,-7735,2508],
    ["AZ","AZE","Azerbaijan","Asia","Western Asia",10023318,"Baku",4721,4040,4986,4040],
    ["AT","AUT","Austria","Europe","Western Europe",8877067,"Vienna",1413,4752,1636,4820],
    ["AU","AUS","Australia","Oceania","Australia and New Zealand",25364307,"Canberra",13405,-2413,14913,-3528],
    ["AU","IOA","Indian Ocean Ter.","Asia","Seven seas (open ocean)",2387,"",10567,-1049,null,null],
    ["HM","HMD","Heard I. and McDonald Is.","Antarctica","Seven seas (open ocean)",0,"",7351,-5310,null,null],
    ["NF","NFK","Norfolk Island","Oceania","Australia and New Zealand",2169,"Kingston",16795,-2903,16796,-2906],
    ["AU","ATC","Ashmore and Cartier Is.","Oceania","Australia and New Zealand",0,"",12359,-1243,null,null],
    ["AM","ARM","Armenia","Asia","Western Asia",2957731,"Yerevan",4480,4046,4451,4018],
    ["AR","ARG","Argentina","South America","South America",44938712,"Buenos Aires",-6417,-3350,-5843,-3461],
    ["AG","ATG","Antigua and Barb.","North America","Caribbean",97118,"Saint John's",-6179,1735,-6185,1712],
    ["AO","AGO","Angola","Africa","Middle Africa",31825295,"Luanda",1798,-1218,1323,-884],
    ["AD","AND","Andorra","Europe","Southern Europe",77142,"Andorra la Vella",154,4255,152,4251],
    ["DZ","DZA","Algeria","Africa","Northern Africa",43053054,"Algiers",281,2740,305,3677],
    ["AL","ALB","Albania","Europe","Southern Europe",2854191,"Tirana",2011,4065,1982,4133],
    ["AF","AFG","Afghanistan","Asia","Southern Asia",38041754,"Kabul",6650,3416,6918,3452],
    ["","KAS","Siachen Glacier","Asia","Southern Asia",6000,"",7713,3534,null,null],
    ["AQ","ATA","Antarctica","Antarctica","Antarctica",4490,"",3589,-7984,null,null],
    ["SX","SXM","Sint Maarten","North America","Caribbean",40733,"Philipsburg",-6307,1804,-6305,1803],
    ["TV","TUV","Tuvalu","Oceania","Polynesia",11646,"Funafuti",17921,-851,17922,-852]
];

// One country per '|', one ring per ';', and within a ring a run of ',' separated
// base62 zigzag deltas: dLon,dLat,dLon,dLat… from the previous point. Decoded once
// per page by mapGeometry().
const MAP_GEOMETRY = "Bm6,BKR,GP,q,EX,CE,BB,DS,E7,DM,C7,Fo,Fq,j,C6,Da,Cq,BM,e,Bu,Co,BI,KY,Dd,z,HN,6,DX,Bz,ER,Dr,Dj|BkE,yd,Ez,BJ,G3,Gn,K9,BS,EV,Ec,N,Kg,GY,C,C,G0,BU,Bx,C6,q,CY,CN,Do,BA,F8,Fx,Ce,P,E,EI,CZ,n,CN,Cg,E,Hk,Bm,CW,F8,8,H4,Ep,Be,C9,BT,BH,y,Et,Ct,EB,Bs,BX,Jl,DL,i,CH|CvQ,1s,Ez,EP,Yf,Iz,Br,S,Cr,IK,CO,HS,MO,Bv,Gm,FY,JA,BO,Dk,Hl;CNY,xW,H,F,D,I,E,S,G,E,E,N,H,P;CN6,sM,P,H,I,Q,K,E,C,A,H,P;COC,tE,F,F,D,A,P,M,O,M,I,N,D,J;Cxa,ow,BY,E,BC,X,BP,n,BV,J,Z,E,5,m,q,m,u,R|FZq,hg,E,L,A,Z,J,X,C,L,H,H,P,q,V,a,K,A,S,M,I,A,G,J;FmS,BHY,EL,Bp,Db,Gj,KU,Ll,CA,I9,Bd,EF,Hr,C1,D,B7,Bf,BK,BY,B3,CZ,BK,BG,B7,Eh,Cl,BC,EW,CJ,Be,CA,Bm,Dk,Z,BB,Cu,FW,CU,c,JW,IF,K6,EF,CG,DW,CU,BJ,CC,Ex,w,f,Ci,Cp,CQ,BG,BM,Eu,r,EU,Cm,E0,B1,Z,Cl,EO,Bh;Fh6,cA,H,A,F,E,S,O,D,L,A,F,H,F;Fjs,hi,T,N,A,K,O,G,G,G,C,A,F,L;Fiu,BFK,F,F,L,I,H,E,G,O,M,P,C,J;FlG,BGc,d,b,N,A,K,e,G,G,Q,L,I,A;Fk0,BFg,L,H,P,A,Q,K,I,M,G,E,A,L,H,L;FjQ,BE6,J,D,R,Q,I,K,S,H,E,F,A,F,H,L|DKN,de,Z,H,A,E,G,K,O,C,M,G,I,F,L,F,H,J;DT9,j4,G,b,V,X,b,D,X,Q,N,F,l,I,K,O,c,I,U,R,Q,D,E,O,Y,U,I,J;DYX,jM,N,H,V,G,J,G,G,G,Q,A,O,J,E,F;DKx,cm,N,F,D,U,E,E,a,U,G,F,D,F,K,H,D,L,N,L,R,H;DHn,bk,i,9,Cz,CT,BM,Bv,Cl,BB,x,Cb,Cc,DZ,HN,EN,GP,CO,CY,Fv,CI,5,HB,E7,ER,Bs,BF,Dw,CH,BS,Bw,CC,Bx,Dg,BO,FY,GT,N,CR,Cq,GF,Q,Cj,Gs,B1,Q,CM,FU,Ea,DS,CF,7,BM,C7,Br,Ct,BW,Cb,Bc,S,v,Fy,FY,Bo,Bl,BW,6,6,BM,CR,D8,BD,0,CL,GG,c,Dm,Bz,Eg,BY,B1,c,Hy,U,DV,r,B4,Cb,CW,W,Ck,Bt,Cr,Cd,FK,L|oI,CLK,D,A,A,C,C,A,A,D|Ip4,v1,M,BF,W,E,O,o,S,A,D,b,M,P,O,9,X,d,BF,L,A,M,b,g,E,o,Z,BK,I,q,I,A,c,n;IsC,z7,O,F,E,L,c,T,I,A,U,R,M,X,R,P,f,E,R,P,R,E,V,BS,H,G,V,J,P,Q,K,m,c,H,O,l;IvY,2J,G,D,F,L,d,K,d,D,H,G,H,Q,E,K,M,K,i,j,Q,F;Iu4,0t,Z,D,h,G,N,K,H,I,K,G,Q,E,U,U,I,J,I,X,M,P,A,J;IvY,4l,U,d,G,F,N,V,Z,D,f,G,M,G,H,I,Z,A,W,g,k,C;Ito,xz,P,J,Z,A,L,G,g,c,i,G,T,h;Ium,zh,H,I,N,y,I,s,W,BZ,D,P,L,D;Iui,xd,F,N,J,O,F,BE,G,A,K,r,A,b;Ira,yt,F,H,X,M,G,O,W,H,D,P;Isk,uB,J,L,X,E,H,C,C,Q,G,G,O,G,S,J,F,R;IsS,s3,F,D,F,C,N,Y,E,I,O,I,O,P,A,H,D,N,J,D,D,H;I0E,BDJ,J,L,L,A,P,I,C,K,Q,C,E,D,K,J;Iyu,BBD,L,X,T,G,T,O,J,O,G,c,I,E,K,D,E,b,a,R;IyO,9H,J,L,J,C,1,W,A,g,G,O,O,E,K,D,I,V,Q,H,N,J,U,P,G,P|Dq2,CMS,Cb,CZ,D0,BR,2,BW,Ew,CX,Er,CJ,Dh,M,p,Cq,DN,x,C5,EB,Df,T,C8,EF,B5,DX,EB,k,K,CI,JF,Ds,EJ,Co,B3,Dk,F1,BA,V,Cm,Eh,B0,Bb,f,BC,BF,Bb,m,Dd,CD,M,B7,DX,M,A,L0,IU,B0,LE,Gr,Ja,s,D0,CV,T,DN,Bk,D,q,Cn,D8,E,Bi,B3,IK,FQ;Dp4,CIE,A,E,H,I,L,E,F,D,E,H,K,L,G,C;Drs,CEq,L,D,f,E,G,S,P,K,D,K,E,I,G,E,C,A,M,P,K,F,U,D,L,P,I,P,D,F;Dti,CE2,H,J,J,C,J,G,C,E,M,C,G,C,E,C,D,L|CwL,Bu1,BX,CF,Dl,Bx,EX,G,C9,Bc,CR,A,B1,CW,BI,Ca,V,DY,Bu,Fc,Co,Y,Ci,CL,I,9,BS,u,F6,D5,CC,CN,BT,BZ,g,B1|Idu,RM,C,L,N,E,D,E,I,E,E,D;HLm,eo,P,R,D,G,M,U,G,G,I,C,E,J,H,J,J,D;H3M,Xs,D,F,N,C,D,C,C,A,E,C,C,E,F,A,E,C,E,A,C,D,C,F,A,D;H36,X8,F,A,A,G,C,C,C,A,G,D,A,D,H,F;IOq,V8,L,F,R,C,F,Q,H,E,A,I,M,I,U,H,I,N,F,J,A,J|IzO,Sy,F,H,H,A,I,M,E,S,K,G,G,G,A,H,N,J,H,X;Iwm,Xk,D,F,V,C,J,E,A,E,e,H;I5e,Wu,G,F,Q,A,O,N,H,C,J,E,H,C,L,A,F,C,D,G;I36,XC,a,L,g,E,f,J,d,I,N,K,C,C,K,H;IqW,j8,H,A,F,A,E,E,G,A,C,A,D,F|HkC,8g,H,H,H,E,A,M,I,D,E,D,A,H;HkC,0s,F,D,H,C,F,C,D,G,O,A,E,F,D,F;Hik,tq,J,L,J,C,F,E,D,E,Q,G,I,D,D,F;HkQ,6U,L,F,M,U,E,C,G,H,N,N;HkK,wy,A,F,L,A,F,E,G,S,Q,I,G,C,H,L,D,L,H,J;Hj2,wS,J,L,H,Q,A,G,G,G,G,A,C,T|DXN,7I,P,D,V,K,Q,E,K,F,I,J;DWl,7M,P,F,J,A,F,C,I,G,S,F;DW7,5Y,S,J,U,A,X,J,p,D,C,O,W,E|Hg4,qw,J,A,L,K,A,Y,c,U,K,S,I,D,M,J,h,h,J,f|I2v,uT,J,D,L,K,a,K,Y,D,P,D,T,P|DbV,7e,Bm,N,C,d,BJ,3,D9,E,G,u,T,c,U,c,DU,N;DZF,6a,b,A,D,G,S,G,W,D,Q,H,d,F;Dg7,6Q,F,A,D,C,H,E,D,C,C,E,C,A,M,A,E,D,A,D,H,J|G4P,C6W,D,F,Z,A,L,C,F,K,Q,a,G,S,k,X,M,J,G,N,l,L;G4V,C5c,X,C,f,Q,A,E,c,S,0,D,C,H,H,P,C,H,F,F,X,J;G9R,DB0,D,H,d,C,b,G,P,K,C,E,a,E,Y,J,S,N;HiJ,DIo,H,H,T,C,J,E,e,M,G,D,F,L;HgX,DG8,J,D,i,c,S,K,W,E,D,J,f,N,j,V;Hrf,DHw,L,J,p,E,I,M,e,I,i,N,X,F;H4Z,DIs,L,A,O,K,I,S,M,D,C,F,V,V,H,D;IVN,C2g,D,R,d,K,J,E,G,E,a,C,G,F;ISF,C1U,H,A,H,C,J,K,A,G,O,F,G,J,A,H;ISl,C14,A,R,D,D,H,E,N,F,H,C,C,G,A,E,I,C,C,I,D,C,G,I,E,C,G,R;IoL,CxS,D,A,H,G,A,E,M,K,Q,E,C,D,J,J,J,H,H,J;JJx,CrI,R,F,X,I,C,M,k,R;In1,Dbo,J,D,A,E,Y,I,q,K,7,V;I5H,DTS,DU,M,C0,BF,Cq,N,b,d,Bp,A,BD,r,Cv,BW,EF,I,I,4,6,N;In7,DIw,BU,P,E,x,Y,h,Bp,N,L,T,DN,y,9,o,B6,C,BK,g,BG,A;H7P,DAg,Bg,C,L,b,0,Z,n,b,Bt,K,0,f,DZ,9,S,T,BF,n,V,K,4,i,Bd,e,d,J,o,T,h,T,BN,BW,i,s,BW,S,BY,BH,f,BE,e,E,t,a,O,O,BI,b,2,O,M,i,BA,P,L,R;Gvd,C4S,Bx,Dn,Bh,BQ,E,DA,Dh,Br,B0,CE,GN,DG,l,Bg,Bs,P,BX,0,BI,K,Ct,m,e,Bc,C5,P,B3,DI,2,Dx,Cn,e,z,CG,Ct,F,DA,B3,Bx,r,KT,EO,Cm,6,Bb,i,DN,9,DN,BU,I1,V,Cb,BC,q,BE,Bz,7,ER,BI,m,BU,GV,R,9,B1,CM,D,Bh,Bl,DJ,Y,E7,Cx,DT,E,C4,Bm,Cl,C,Bs,DG,HO,c,DJ,6,CA,BE,Ll,D3,BK,9,E5,Ct,CY,BV,QR,In,Jz,Bf,F3,Ch,FS,Dc,Ei,V,D,Bm,JK,D2,f,Bu,BW,c,BF,u,CS,CS,Ed,Br,BB,w,BW,a,CX,D,d,B1,Ej,CG,Fv,BV,Bm,Bg,Ch,Dw,Bg,BS,CB,CP,EV,l,Ep,CW,Fq,BK,E5,G,w,k,EN,Bu,Ei,Cu,BI,CU,Dm,j,Hm,B8,Bz,Ce,B6,BM,F3,BX,LF,o,Cj,B2,Ce,a,GP,BM,Ls,DA,Co,F,BR,BJ,BE,d,Im,W,ET,Cc,G2,Bt,VL,GQ,B2,Bs,Im,4,FW,Du,Fq,0,y,BB,Bi,w,CP,W,BS,g,KW,CA,C2,7,BR,5,DU,w,Ig,v,BK,BT,cI,BF,HK,Bh,A,eL,GM,I,FS,Ep,GU,C2,Gs,Ed,FG,F3,Fw,CR;IfX,C1W,U,h,8,f,5,O,t,X,Bl,D,Br,t,v,E,R,Y,BW,BM,CK,c,BE,P;G6D,C3K,G,J,f,P,H,L,n,X,C,c,V,S,W,I,k,F,U,I,I,F;Gzr,C1q,U,b,C,L,l,D,J,E,D,E,G,O,L,I,N,C,L,F,D,M,I,K,F,W,C,C,M,A,W,L,M,b;G2L,C5A,F,j,x,A,L,I,C,K,J,G,r,E,J,Y,U,I,s,0,M,D,y,z,J,b;Gyh,C3A,V,t,X,N,v,O,H,a,n,X,Z,b,L,K,J,o,o,i,G,w,BI,a,2,v,G,N,D,l;G6P,C72,8,H,Y,T,D,p,J,N,BF,q,i,t,F,d,BX,D,L,M,H,4,9,q,W,M,Bm,P;G4l,C1E,S,I,e,J,H,b,N,R,V,G,p,c,x,BE,j,G,H,K,E,I,a,G,o,Z,w,BD;HmP,DJA,E,H,2,D,Bn,d,V,a,c,Q,i,H;Hql,DG6,b,E,U,W,BY,y,g,i,s,P,BL,r,l,n,x,R;HqV,DJA,A,H,H,F,G,L,P,b,H,H,H,D,H,C,A,C,C,G,N,A,F,O,I,E,M,c,C,C,E,H,O,K,G,J;HrN,DKO,b,D,N,C,A,C,E,K,A,G,M,A,Q,F,E,F,C,L;H7l,C8Q,f,H,d,T,P,K,E,Q,M,M,BO,J,F,F,R,D;H55,DCq,H,D,Z,M,I,G,c,K,S,D,C,F,A,F,b,R;H8V,DAm,H,H,F,C,l,Q,L,G,A,E,I,C,a,J,W,R;IF1,C4E,H,H,R,A,J,C,F,G,Y,Q,G,C,E,A,C,H,D,P;IC9,C6E,P,H,F,C,D,E,K,M,W,M,U,I,M,A,E,H,P,L,j,R;IBd,C6S,L,A,P,G,C,G,U,I,W,D,C,F,F,J,T,H;IWV,C2a,I,C,S,M,H,P,K,R,K,H,D,F,Z,F,T,E,V,H,H,E,D,i,K,I,O,E,K,F,D,P;Ibj,C06,F,D,P,G,H,G,D,G,c,K,G,A,E,H,C,F,J,N,H,F;IcX,Cze,T,F,T,E,R,I,D,K,i,H,U,N;ITt,C10,j,T,b,V,N,F,Q,Y,F,Q,I,A,S,O,M,C,M,O,K,D,H,J,M,J,H,L;Im9,Cya,P,F,b,A,N,M,D,G,O,K,e,E,o,X,f,H;ImF,Cyo,J,D,F,C,A,I,H,O,U,G,M,N,Q,F,f,N;IXH,DC8,f,D,N,U,K,A,S,O,2,M,p,t;I9P,DJC,q,P,c,C,g,V,BV,G,BZ,g,E,Q,a,I,M,V,Y,L;I05,C8c,V,J,V,C,H,K,2,I,J,N;IzZ,Cue,H,N,h,E,V,A,D,E,C,E,g,G,O,A,M,H;I2v,Ctm,P,H,F,C,D,I,e,U,O,D,G,F,D,H,F,H,J,F,R,D;I8V,Csm,R,D,R,C,I,M,W,M,S,F,O,J,f,N;Izn,C6s,c,F,O,C,M,D,E,H,Z,L,J,C,d,M,C,G;JKr,CrE,N,N,L,G,D,Q,G,E,U,N,D,D;JJz,Cru,H,H,T,G,J,G,A,G,E,I,Q,A,K,F,K,L,J,H;JNd,Cq0,Bn,J,F,E,A,E,BU,Q,S,W,M,E,K,H,R,T,D,T;JSE,Cre,P,F,H,I,A,G,G,E,M,D,I,H,H,H;JU2,Cps,j,A,CD,2,0,F,Bu,z;JCY,Cs4,N,A,J,G,t,C,E,I,U,C,c,K,Y,A,J,L,F,T;HBZ,C9A,BI,CD,D,BX,L,R,b,M,j,w,U,g,d,F,d,O,A,S,j,A,C,W,Y,U,d,K,X,i,r,t,f,F,I,S,L,k,o,O,i,k,Bi,l;HAd,DBm,Ba,F,2,3,e,x,X,I,z,BG,b,E,I,f,BE,9,E,T,L,J,M,R,Bt,BB,X,A,N,Q,Y,BG,j,g,1,CS,w,n;HD1,DB2,c,T,V,X,Q,L,0,a,BS,V,F,p,BN,L,BK,L,W,b,N,X,CD,m,b,z,t,G,j,s,Bl,8,y,y,k,Z,K,U,BK,I;G63,C5u,BM,F,Y,b,F,V,Bm,n,BY,BX,BH,W,Z,Z,q,C,0,h,L,V,u,D,J,Bj,j,A,f,k,r,I,P,m,R,D,A,V,R,E,BH,4,g,O,Z,U,K,S,3,E,BP,k,2,C,i,Y,b,Y,BN,R,q,m,J,m;G8P,C7W,O,N,S,A,S,b,H,L,T,F,F,7,P,h,J,H,R,G,L,L,P,A,N,Y,K,q,Y,K,r,Y,C,I,V,U,C,Y,U,Q,a,C,e,T;H5r,DCQ,U,K,m,J,g,N,D,P,b,R,h,S,N,J,E,R,v,H,N,M,R,V,z,P,Bd,U,BS,q,q,F,P,c,u,G,m,T;Itz,CwG,BB,X,x,p,B3,r,6,q,W,m,BA,K,F,a,W,S,s,M,w,L,J,Z,T,J;Ipf,Cx2,Y,F,a,Y,c,P,BD,v,w,A,Bf,t,Cx,t,l,M,CK,q,Y,i,o,N,Q,O,BF,O,L,S,Q,O,BM,O,K,X;JB1,CsM,Bs,N,Cp,H,f,O,Ba,E;JFf,Cr2,CB,F,DM,o,K,K,l,K,2,U,e,T,H,R,b,L,M,N,Bz,V;JLp,CrU,A,J,e,D,D,R,N,C,1,Z,P,K,Z,R,S,m,a,K,D,K,K,U,U,D,K,J,J,P;JPz,Cqm,L,H,b,K,F,E,Q,G,C,I,p,Y,O,I,i,A,e,R,g,D,b,L,X,b;JVw,Crc,R,H,V,C,L,I,A,K,a,K,e,N,L,N;JOU,CrW,T,J,R,M,a,Q,U,C,I,G,I,S,W,D,P,X,D,J,j,P;I9c,CvA,6,D,BG,f,BL,J,d,N,h,K,N,S,v,K,BC,O;IF3,9U,V,J,p,U,D,BA,h,BM,u,0,P,g,M,W,CC,7,W,X,E,b,2,v,z,p,1,N,v,f,J,V;ILJ,BGc,Bm,N,J,N,X,J,h,I,3,C,I,Y,I,D;IIz,BFg,q,E,6,n,Z,Z,9,H,H,C,J,k,d,E,R,a,I,O,O,C,U,V;IND,BHO,Q,A,C,R,O,P,h,J,V,O,N,D,F,K,J,D,I,L,b,A,b,i,H,U,e,C,U,S,M,C,g,x;ISH,BIu,T,L,f,G,J,I,V,I,J,K,M,U,e,Q,u,A,K,P,A,J,P,l;IUt,BIc,F,J,H,A,D,I,E,M,Y,Y,K,F,H,J,A,L,P,H,H,J;IJ9,BFA,N,H,N,E,F,O,N,Q,W,E,M,H,O,P,J,N;D3B,CVK,MY,2,FQ,HE,Em,BP,C,EX,Cm,C5,E9,B1,v,BA,E3,C5,Ch,EV,Di,CH,Ep,Y,b,BX,H9,CD,E,Bm,X,Et,CT,Cj,CX,Bk,Bc,Bk,Br,BH,Bw,D5,C3,EJ,2,Ck,CN,Cc,Bg,Ck,CR,x,u,Dz,C3,BC,o,Bi,v,7,DO,CT,Cv,4,Cq,Dn,DJ,4,EC,BX,Bg,Dh,BX,Cs,a,Bx,C7,Y,DI,BR,BV,Bl,Cz,k,B6,CP,DJ,X,Br,Cj,JR,Ez,CJ,ER,Ei,N7,BZ,FH,CD,T,B9,Cs,DN,E4,8,BK,BZ,D,m,DW,DX,DW,FR,z,5,B8,FL,K,o,u,DR,BH,A,Be,b,BD,HF,T,DA,v,BD,BZ,CQ,BX,BL,t,Ch,By,L,Bb,Df,m,B7,Bw,BN,5,FH,BW,C9,B7,1,BC,z,CZ,Eb,z,s,z,CZ,BD,5,Cn,BF,a,BU,FJ,Fp,B2,HV,Km,DH,Y,C9,Cx,Dr,B0,Br,DQ,E7,D0,Oz,Bd,L3,Eg,Hx,n,Ed,Ey,G3,By,GB,Ji,BY,N,x,Bs,Cg,K,Ev,P,ER,HS,y,D4,Bh,EW,Bw,LA,Ce,P,Cv,a,u,CM,Cz,Ek,GO,x,BL,Cb,B8,Bs,Bn,Ch,BE,H,Be,C4,Bx,DK,BbI,A,A,BO,Bu,CD,KA,CN,KI,w,No,Fr,FK,D1,BU,Fv,DR,En,Be,Bf,Lw,Dm,m,Cg,Gi,K,Gy,Ea;Dv5,CIO,P,P,CM,c,EL,BV,CT,R,U,O,v,A,Be,4,DC,O,BK,g,x,h;Dh9,CTA,N,F,N,C,D,P,T,I,A,O,M,O,K,G,M,F,K,R,A,H;D1V,CGs,L,A,K,S,S,K,G,D,A,H,D,H,N,L,L,F;Dpd,CJe,5,L,J,G,O,C,S,Q,K,C,S,L,E,H;Drz,CJ0,L,H,N,C,G,I,C,K,G,M,E,E,G,C,D,h;Dnv,CJI,R,F,j,I,i,I,E,O,M,b;D6B,B1q,D,F,P,W,O,J,C,H,A,F;D5r,Bzq,f,F,e,M,M,6,F,o,I,r,A,X,L,j,H,J;D6d,Bzg,l,P,F,A,Y,K,Q,E;D8x,Bxu,H,D,S,a,k,e,K,G,f,d,d,h;EQp,BXU,H,F,P,E,J,G,F,O,Q,T,Q,D;EQx,BXo,D,N,L,U,H,W,K,H,I,Z;ELT,BTG,p,n,Y,o,W,Q,A,O,S,K,Z,r;EwH,BhK,J,D,j,Q,D,I,Q,G,K,A,W,N,E,D,D,H,H,J;FC7,BcA,H,A,M,W,Q,W,I,C,E,J,R,P,T,Z;FCJ,Bcy,J,A,I,K,Q,G,g,U,O,C,K,I,D,J,BJ,n;FED,BaE,H,N,A,S,Q,m,i,0,O,I,n,5,V,x;E6l,BgC,L,D,s,e,I,K,M,A,T,T,l,V;FDd,BWY,D,L,t,CS,C,BO,I,BT,k,CF;GQH,Bvu,L,A,R,C,G,G,I,C,M,L;GNT,BtK,J,A,N,A,J,M,K,A,K,D,I,J,A,D;GJx,Br4,N,D,N,E,N,U,N,O,G,E,K,P,g,b;GPP,Bva,P,F,N,E,R,S,k,E,S,N,N,L;GOt,Bv6,o,L,W,E,E,F,D,F,z,J,R,E,H,Q,I,C;GJx,Bts,K,R,f,C,J,S,F,E,L,A,D,G,E,E,g,N,I,H;GYF,ChA,C,F,P,F,N,G,C,L,A,F,V,I,D,E,E,G,Q,G,Y,J;GYz,Cgc,E,H,V,E,L,E,D,E,F,M,C,E,K,A,S,P,C,J;GXZ,CfW,K,b,E,K,a,T,D,P,H,A,R,M,P,C,J,O,F,S,P,E,L,M,E,K,S,U,S,N,A,H,h,N,U,H,G,J;DsP,CJ0,F,F,D,K,E,K,E,A,C,H,F,L;D1J,CEA,Z,f,A,G,c,m,F,P;D5B,B8O,L,F,e,o,a,u,J,Z,n,7;D87,Bxw,F,A,J,C,L,E,D,E,K,D,O,J;EOX,BRg,H,F,F,C,A,G,J,M,A,E,U,N,A,F,D,F;EMv,BSA,F,A,C,E,I,G,C,D,A,F,J,F;EMJ,BSU,H,A,I,I,E,A,H,J;ENb,BRu,L,H,L,E,K,E,g,G,N,H,L,D;EOp,Bl4,J,x,F,Q,A,S,G,K,G,E;EPJ,BRW,N,D,K,I,E,M,G,L,A,H,J,D;EKr,BaA,E,R,r,Ba,N,q,y,B1;EPz,BRK,H,A,A,E,I,E,G,A,A,H,J,D;Emv,Bh0,L,L,A,E,I,K,G,E,F,J;Elr,Bje,D,F,T,G,L,C,D,E,e,H,C,D;EkH,Bjk,T,F,h,C,q,G,I,F;Enz,BjC,A,J,L,E,P,A,g,W,H,J,D,L;Emj,BiK,H,H,G,e,J,a,I,N,E,P,F,Z;EZ5,Bhm,V,H,X,E,Y,A,m,S,O,C,j,T;GYT,CcQ,D,D,F,A,H,I,A,E,E,E,I,L,A,F;GWz,Cc4,D,H,J,F,F,C,A,G,D,A,J,H,A,M,E,O,E,A,G,J,K,L;GXL,Cdg,A,D,N,E,F,E,C,K,C,G,C,A,I,F,C,T;GYN,CgO,F,D,L,C,H,G,D,E,E,M,E,C,E,A,C,L,K,L,D,F;DjX,CSk,J,F,J,A,A,K,C,E,C,C,E,F,I,J|BWt,DCh,A,L,h,K,H,E,K,I,U,A,E,F,E,J;B5r,Cyb,BS,J,K,f,BC,C,0,9,i,A,D,h,W,L,7,X,Cl,Bs,CZ,i,C,a,BT,G,C8,N|Dv0,Xz,F,J,J,F,F,W,N,O,E,A,M,J,E,V,E,G,D,G,C,G,H,Q,C,C,I,J,A,Z|SX,zn,T,A,A,I,O,K,K,A,A,N,H,H;uV,Zt,J,D,D,C,A,G,G,M,E,D,M,L,F,F,J,D|Gp1,BQt,D,D,F,C,F,G,D,G,E,E,G,D,C,H,A,J|DRP,6w,h,L,C,G,Y,O,K,D,F,J|DD1,CpZ,BW,L,K,L,b,X,w,T,C,e,4,I,i,d,f,N,i,N,C3,9,G,h,Bx,Q,a,f,3,H,N,X,b,O,Z,W,Q,o,Bo,w,J,o,y,s;DIf,CqB,C4,U,Y,P,CH,Bv,BF,F,b,h,BB,J,3,a,CU,6,BH,M,BE,O,1,e,N,a,4,V;DK1,CrF,O,D,O,C,P,h,R,C,Z,U,U,G,G,E;DCh,Crx,C,T,R,G,H,I,I,G,I,A,E,D;DH5,Cpz,d,A,H,I,A,Q,W,C,U,J,D,H,H,N;DGh,Csf,P,F,D,C,F,I,D,I,A,G,I,D,O,J,A,L|EOf,BAa,G,F,I,C,E,E,e,D,E,J,X,D,R,H,V,C,F,S,G,C,E,H;EKB,BBk,D,D,H,C,P,J,J,A,K,I,S,C,C,D;EJf,BBk,L,D,J,A,Y,O,K,D,A,D,R,J|DWz,BqK,T,H,J,C,S,I,Q,Q,E,D,N,T|DVv,7i,F,A,F,A,A,C,C,I,W,C,R,N;DWX,7W,R,A,H,C,K,G,Q,C,E,D,J,J;DVZ,8c,E,H,P,E,J,A,F,C,D,C,S,A,G,D|DtL,BIO,D,F,L,I,X,A,F,K,I,C,c,F,G,J,F,F;Dt3,BIc,F,D,N,G,A,G,F,A,J,G,C,G,Q,A,G,T,E,F;DvV,BIe,W,L,O,A,C,D,L,F,f,D,A,I,C,K|DOf,2A,A,N,P,E,A,K,G,K,C,C,G,P|Gh,Ciy,C,L,J,D,J,E,f,D,E,S,c,D,M,H|IH,Cjo,J,N,T,E,D,E,W,I,E,A,C,F|OP,Cyy,p,b,T,E,T,D,S,e,S,K,U,W,S,G,I,F,I,Z,P,R|In,Cqg,C3,r,Ff,Bg,Dk,Bc,K,B4,B3,X,BU,BE,E4,i,BB,o,m,CK,CV,BO,Bw,BQ,Gx,T,Be,CE,Z,CI,B3,d,BR,CJ,B2,Eg,DD,J,BS,a,D,Co,B2,q,z,m,BQ,Bm,GW,M,Df,DZ,HS,G,CD,DJ,Cn,5,CE,X,Dn,f,FS,p,C8,D3,Ds,B3,o,Bp,Ch,W,DA,BP,t,BZ,Fc,BF,ER,Dl,DM,X,Bd,BZ,Mx,r,CN,Bj,GZ,h,Eu,Dk,DY,E,CS,Bs,x,Z;Nj,CwA,e,D,H,L,7,b,L,K,L,A,R,Q,F,a,W,G,c,A,Y,V;IP,DFE,X,A,M,M,M,C,a,A,F,H,Z,J;DX,DJM,H,D,V,U,Q,Y,Q,A,E,H,D,H,L,A,A,D,C,N,C,N,D,F;EP,DJS,E,P,K,E,Q,P,W,E,f,BZ,V,b,N,G,Q,o,D,I,H,I,h,F,F,K,d,E,F,I,6,K,R,c,Z,E,q,Y,M,A,D,P;Cf,DKK,A,D,N,R,A,J,R,C,D,C,F,K,C,K,C,C,G,C,G,D,I,E,E,A,G,F;KN,DDo,Z,D,T,M,H,I,C,G,G,C,S,D,I,L,E,L,K,D,A,D;Jd,DDe,D,A,J,E,N,M,U,E,I,D,D,H,F,N;J3,DEa,D,H,BA,J,P,P,h,K,l,F,L,E,F,M,T,H,F,K,I,W,M,C,o,J,G,J,J,H;Iz,DE6,T,H,H,E,D,O,f,I,J,G,O,G,Y,N,I,L,S,D,C,D,D,H;VV,C6i,L,D,D,C,U,O,M,C,G,A,L,J,R,J;Qf,C22,Z,A,V,G,N,c,E,K,K,I,O,C,M,H,S,Z,C,R,F,J;Sp,C5u,BT,L,b,A,F,G,G,E,Y,E,I,a,l,Q,G,I,m,I,e,Z,m,J,F,f;Tx,C4a,O,r,A,F,H,J,t,L,I,M,H,M,C,I,D,C,n,R,G,W,K,I,O,E,G,D,k,O;TR,C4C,P,A,H,I,A,I,G,I,a,I,N,E,G,M,c,M,O,C,P,X,j,p;UB,DCQ,b,j,t,V,e,D,H,N,Bt,3,Z,M,s,W,p,Q,O,K,V,K,A,Q,M,I,8,H,L,W,Bu,o,I,d;UR,C7u,H,D,J,A,H,E,L,K,W,G,I,F,E,F,A,F,F,H;Tz,C9e,A,n,BY,J,I,J,BD,n,J,g,7,A,Z,a,x,G,R,Q,k,O,J,K,w,I,E,O,W,F,W,f;XR,DAE,Y,L,T,V,d,A,n,O,I,K,o,C,M,E;XZ,C8Q,V,A,H,C,J,M,A,I,C,O,A,Q,W,A,G,D,E,z;X7,C7w,R,F,J,C,A,C,E,I,M,C,K,F,C,F,F,D;UF,Cye,BZ,H,BL,BI,BB,5,7,C,Bt,BA,BQ,c,h,W,BK,O,BE,BC,Dg,a,BU,BT,h,l,8,E,W,h,p,K,M,5,BV,t,p,I;Dd,Cng,R,H,L,N,L,D,N,A,r,Q,J,A,I,G,q,O,i,J,O,J|C5m,BUu,S,CL,BF,x,N,q,p,R,J,CD,u,l,Br,Z,BJ,ER,IR,BA,DN,D2,I,q,8,BJ,GY,S,Bo,o,Fa,Fu,s,BV;C5i,BTa,C,I,D,E,L,A,D,H,D,N,G,A,I,G;CwC,BQQ,P,D,P,I,c,K,I,E,I,K,I,J,P,T,L,F;Ctu,BQW,F,D,F,M,A,C,K,G,G,L,J,J;Cx8,BQA,A,J,V,C,H,D,j,G,M,I,c,K,U,R;Czs,BQ0,D,F,H,C,P,C,H,G,K,G,E,C,G,J,I,H|B9Q,Cb4,KV,DL,s,BE,5,CT,KF,Bw,5,2,DU,O,Cp,B4,W,Bz,Dd,V,Dx,Cr,Q,Bf,DF,H,Bx,s,Ca,DQ,Dw,J,DP,E8,FH,Bq,Il,Cd,Gf,u,CZ,CA,CQ,Bg,b,B0,Ec,C8,Bj,De,Ca,0,T6,B7,Ba,Cg,I4,6,CI,Bz,n,Br,Di,t,4,CL,F4,I,Ik,Cr,9,Fd,Ej,5,h,Br;BpQ,CZC,c,L,Bd,M,d,K,L,W,a,V,BM,P|BvW,DP,J9,C,C1,Bj,BJ,Q,BK,HI,EO,D6,Br,BW,BC,EG,Ca,O,BG,5,Cw,BK,Bk,Z,Bk,Be,Be,B1,Bu,GP,DX,FB,J,Dx|CvU,CBK,D,J,L,c,H,e,G,K,I,D,H,L,K,x;C4k,CJS,DW,N,N,B6,Dc,CC,Ba,n,BD,BE,Ba,e,Eg,B1,U,Cn,F0,BB,B2,Dl,EI,Cp,JE,Dt,L,CJ,Cb,s,DF,Bb,BB,Cj,HH,Dx,DZ,Bc,d,DS,Mr,FG,F1,j,Ev,CT,J,FM,CT,BA,BE,CG,Bd,d,BB,CC,q,CE,DA,BR,Cq,BW,C5,DY,Cr,d,Z,Ch,BL,B2,FQ,By,GA,DT|BVw,CFe,v,H,P,G,O,M,k,I,M,N,D,J;CJ4,CJ6,EI,I,Cs,CD,I,Cl,Ds,Bj,Cl,3,Ca,HP,Gd,u,LB,CP,It,Y,Bt,DJ,R,De,Kh,Cz,G7,Cq,n,B7,Cd,X,CV,By,E5,D,Ci,BC,DL,L,H,DO,DD,8,e,BK,CQ,n,BP,0,c,Cs,Cj,R,O,Bq,Ly,Ca,CP,Bi,Gw,X,Gi,C2,Fk,M,K2,Dr,GG,I,EA,By;BcW,CLY,m,BX,Cw,BD,V,t,Cj,O,CL,X,x,5,Db,B9,K,u,Bu,BC,CN,F,P,Y,6,s,A,6,6,g,J,o,z,i,C6,BC,6,j,Bi,K|lG,BtC,A,Cf,D9,CX,L,C5,CR,Bx,Bj,F6,CT,Bg,Cr,EK,Ca,C4,J,Fw,BM,BW,Dk,BS,Bo,b,q,Bj,CE,BG,B1,C3,CE,DD,Dd,Dz,Eq,C1;kY,ByG,h,P,G,M,U,Q,G,F,A,L;jW,Buw,V,H,d,K,G,e,i,A,U,P,E,H,R,P|DKB,kE,L,D,C,I,S,O,k,K,F,P,r,R;DKz,gq,h,L,CZ,D,4,i,a,G,E,BE,j,Y,4,Q,Bc,I,X,j,D,n,O,h,J,n|JHD,BGT,C,A,E,G,K,C,A,H,R,V,J,I,d,M,F,K,I,I,A,H,g,L,J,D,I,D;JDJ,8J,J,N,F,A,J,I,F,E,O,O,G,A,K,F,A,F,H,H;JGP,BGt,D,f,L,O,A,G,M,K|C4,jc,d,B7,B0,BR,2,DF,P,Gp,y,CR,B5,p,CJ,Cc,g,Eq,BD,Be,g,CE,9,M,e,Cq,Bh,BY,E,BS,DI,b|GhU,aR,P,j,P,G,O,U,O,I;Gfc,er,X,8,c,E,K,e,r,D,F,W,0,6,CA,g,Co,G,BI,c,BE,V,BP,9,E3,Bz,BH,v;GcI,eJ,g,Q,w,O,H,Z,T,V,J,F,n,C,L,Q|FVA,lq,F,X,N,I,E,M,E,E,I,D;FUa,mq,A,H,L,E,F,D,N,C,H,c,C,G,I,D,M,P,K,R;FHc,Ze,D,P,J,A,N,L,J,e,I,q,E,G,G,N,Q,F,H,b,C,N;FM8,BDi,BQ,Cf,CQ,A,z,Gf,Dq,CK,By,BR,CC,B4,CI,T,Fc,Il,B1,En,GD,U,C1,Cj,B8,F5,Dh,DA,DD,C,M,Cg,DD,R,Cx,Lr,S,Bf,B4,E,B2,Gx,Fa,DF,DN,B7,N,B6,DB,o,GF,GY,Bq,HO,Cu,Dm,Bh,GQ,DD,EE,CO,Ea,E5,HA,CG,D8,Gw,B0;FMy,fS,D,F,H,G,H,I,F,I,M,A,G,J,A,L;FMy,e6,C,N,H,P,T,J,H,M,C,Q,C,E,S,A,G,C;FLe,VC,F,A,H,Q,I,W,K,d,J,L;FIC,Zk,D,D,L,m,O,L,D,b;FHI,dM,N,D,C,M,C,G,G,C,C,N,A,H;FJm,Ye,E,Z,H,G,H,K,A,Q,C,C,G,L|CDa,T5,O,t,D,J,R,F,N,U,J,D,P,Q,P,C,N,U,C,w,Q,Q,I,a,Y,BT,O,L;CEm,P1,F,BJ,L,b,L,L,V,O,K,0,H,k,W,D,S,G;BsM,eX,GT,Cw,En,HO,d,GA,Ei,EC,BR,BO,Be,CM,BL,De,LK,M,Ly,Gn,H,Bd,FM,D1,BX,Ed,Ca,DF,z,El,BY,FD,CW,Bf,J9,ED,Hx,a,CF,F8,Eh,BC;CEG,Zv,L,D,N,K,y,q,M,Q,D,R,R,j,N,D,L,P|Dgk,B54,B4,DW,t,CU,Cf,6,O,y,DU,O,Bo,Bw,BH,Q,CE,G,S,B0,DW,2,BI,BD,BP,BH,B2,n,El,T,v,B3,HA,Q,Cc,BR,Eg,w,i,Ct,DQ,f,BA,Dd,Fn,O,Fh,Cd,T,D4,CR,Bw,FH,EV,E9,K;Dp4,CIE,H,D,L,K,F,G,E,C,K,F,G,J,A,F;DqE,CEe,T,J,L,A,P,O,D,E,k,F,I,D,A,F|GSW,BK8,j,CP,V,G,CJ,Do,K,By,C6,Ec,Bw,y,BG,BB,Bt,Fz,BR,Bx;GJ8,BRG,I,N,F,L,b,G,D,I,K,D,O,K|B1w,B12,Ca,BA,E,B0,Is,Z,EW,BW,FU,C,Db,CX,BB,GT,Nd,Gz,DV,BU,k,DO,B8,Bk,p,Ba,BT,H,T,EK|es,CdS,H,Bf,DG,h,F,BJ,BH,K,I,BL,Cr,0,BJ,CL,Bt,CA,CD,Bt,CX,F,9,Bq,Cj,3,m,Be,C2,C0,Eg,W,Y,k,DE,1|9i,DAk,3,b,F,v,Y,R,b,J,R,Z,t,R,d,l,n,N,c,g,l,m,I,O,D,s,BS,2,k,G,S,H,S,S,k,R;1U,C5k,V,L,H,O,C,0,s,BA,U,E,2,BW,Y,A,P,J,A,P,3,BT,z,Br;ku,DEc,Di,Dc,p,C2,B4,BI,CV,BM,h,FE,Ci,CS,EW,i,Bl,BU,Cq,CU,M,Cq,GA,C8,r,Be,Fk,Bc,w,B0,F0,j,e,CI,LW,Dd,n,Bl,Bu,CH,7,Bz,Be,Bb,Fr,K,DN,Bv,3,Bp,BO,BJ,Cd,B5,K5,Ej,b,Fr,Fm,Cz,DV,Bh,CI,H,BF,t,Gt,Bh,CS,f,C9,HV,EL,T,Bv,CX,EJ,C,BX,C0,BU,BE,FR,Fo,c,CK;9y,DA0,F,N,L,A,L,K,S,O,e,A,K,F,j,J;7a,DEa,L,D,F,A,G,K,E,E,M,E,G,D,P,P;8A,DF0,H,H,F,I,C,C,C,I,K,E,Q,F,A,D,R,H,F,F|BpE,BVv,W,N,K,Cp,Z,E,H,Bl,Bl,C,BV,m,l,BC,T,G,A,8,8,Bi,6,w,Bk,x,Q,E|Cyt,RS,7,BJ,A,Br,Be,C5,BV,Dp,1,b,BD,2,Cb,n,v,W,l,1,k,BT,CZ,k,B7,EU,BJ,C,BP,B8,e,C0,B0,i,BG,DC,Dc,7,O,0,Eu,L,BA,V,X,Bd|Bvm,Nm,Bl,Bf,Ij,3,EL,Ds,EZ,7,NB,OC,C6,FI,CW,a,Cw,DD,HC,f,Du,DE,Ds,Bp,EG,EQ,BJ,C8,Do,q,P,Ev,Cg,B1,m,E1,Dj,Ch,Fg,EB,By,Dx,EL,EH|Bv6,eg,DF,EK,O,Eu,Bj,A,CH,r,BI,C9,EH,ER,Dt,Bo,Dv,DF,HD,e,Cx,DC,CX,b,Bv,Eh,DN,P,W,DO,EN,JK,Br,a,Di,I0,DW,m,C,Ny,DO,A,A,Gc,mW,A,B6,KR,Dq,Cn,FL,DF,C1,N3,DT,DD,l,DH,B5,p,1,D3|EJ8,fE,N,D,L,O,D,E,C,E,C,C,E,A,E,N,M,L;EJo,dM,G,P,b,S,F,G,W,H,C,F;EKA,fo,2,D,Be,BZ,CI,DD,Bm,Dr,v,Cx,C9,Bd,CB,i,x,CM,f,EW,I,W,G,3,BA,FC,BG,V,Bd,BE|FI,CAu,F,D,P,C,T,A,D,I,I,M,M,N,S,D,A,H;KK,CEW,y,D,M,R,t,BB,j,T,3,S,V,e,P,E,b,R,b,S,A,I,BU,w,BO,Y,I,R,L,V;N0,CEg,D,D,BB,Y,V,C,H,E,C,Q,q,E,i,L,S,X,H,R;Eq,CBi,J,N,f,E,J,E,I,O,I,C,A,K,K,K,q,I,K,H,C,L,b,X,J,D;Fx,CQC,Fo,CV,Ke,1,I,Bl,IN,Dn,DX,EN,Bs,Cd,Hd,GZ,HT,N,EF,CP,B5,C0,D1,2,BU,GE,Bv,B6,By,c,K,D4,CU,Bq,BV,BU,HN,D,BF,EA,Ew,B4,TE,BJ;0r,Bdi,T,v,Z,Z,Z,F,b,c,Z,m,O,I,4,E,w,g,o,E,A,L,r,f;sR,BfQ,N,N,R,E,I,c,G,K,c,M,W,E,I,O,I,G,I,J,H,L,H,d,P,L,j,L;tz,Bc2,b,X,h,I,a,G,a,S,u,Bk,K,G,S,A,G,f,V,BH,3,R;xr,Bcy,C,5,L,N,Z,N,V,C,L,E,V,W,A,U,S,O,I,S,4,A;3b,BcY,L,D,J,G,L,Q,G,M,G,E,K,A,Q,J,G,L,A,H,R,N;5t,Bbs,T,h,b,M,L,K,Y,C,Y,Q,G,J;5h,Bd4,H,A,F,O,Z,o,O,Q,a,C,M,N,C,P,F,H,C,P,F,L,P,R|Gke,B72,Be,Bm,DE,G,BE,BA,DY,FD,F,DR,g,V,BJ,Cf,CR,R,P,v,CX,Q,C,v,BD,U,R,BL,P,8,CV,Bd,3,BK,BE,e,9,BE,Be,CU,1,Co,BF,Q,BE,w,Bk,P,BJ,Cs;GrS,ByQ,T,N,b,Q,H,K,k,c,K,A,E,r;GpI,ByS,F,V,P,D,J,O,J,H,H,D,H,Q,D,M,S,K,K,H,O,D,G,P;GjM,Bw2,N,D,N,I,C,I,a,Y,S,F,I,J,J,P,X,N;GkI,B7u,A,d,N,C,J,C,D,G,J,Y,I,K,Q,J,G,J;Gk2,Bww,E,J,R,C,J,I,A,I,K,C,K,N;GoQ,Bxq,D,J,L,K,K,K,C,N;Gjy,B3s,F,N,N,I,F,c,O,J,G,R;GjA,ByC,D,F,J,A,L,O,F,M,J,G,O,I,S,R,A,V;GyU,B64,L,H,L,G,D,G,G,G,M,C,G,F,D,L;Gjg,BtK,T,D,P,U,i,e,BK,S,o,H,G,R,N,V,7,V,z,F|Bgs,BJl,GO,r,CM,GZ,F,FH,CZ,Y,BT,DF,DA,Br,y,Bk,C4,H,Bp,FV,Gv,H9,H1,Gt,HZ,DN,Jv,G,IL,Ch,EH,CS,7,3,B9,E4,Bi,BE,Z,Cc,Fr,KE,BY,Bk,B0,B1,Fy,p,CW,Bc,A,L0,Cm,Dr,V,C5,DO,F,Ea,E6,Hq,BT,FU,G2,HU,Ee;Bes,BjH,BK,k,6,CG,T,k,CL,Bo,C3,BL,Bd,B3,v,X,BE,CP,BK,5,BA,H,BE,Bi,BI,K;B8I,Cbb,L,F,p,C,F,I,S,S,W,F,U,N,H,J|CJ8,Ff,Bx,Cq,A,L8,DW,EM,Ja,Ce,Jy,J8,DG,Eq,A,F0,Hc,B0,t,Ef,BI,L,Bd,L,V,C7,JN,P5,Oj,Mh,GR,Hf|Ch2,kU,A,F1,DH,Er,DP,A,Jj,DM,EZ,FM,B4,C4,Dq,Dd,Em,BU,Ca,T,Cq,BW,E8,S|ITI,bd,L,D,P,I,H,G,C,K,I,E,K,H,C,J,I,N;Iqe,lp,T,D,H,A,N,S,I,E,O,D,E,L,K,J;In4,it,h,F,P,P,R,C,H,M,A,E,K,A,E,M,K,G,W,C,c,H,H,P;IWA,mF,P,H,P,E,L,E,H,Q,T,K,3,Q,D,S,C,E,Q,F,BM,r,a,V;IZI,fF,A,d,P,Q,J,H,H,I,C,i,N,g,K,F,c,1;IRg,db,Z,C,H,I,I,I,K,I,K,H,K,D,A,N,J,H;IUq,dD,Q,D,g,b,J,J,P,E,F,D,H,K,P,I,P,A,D,K,O,G;IM4,al,c,3,D,N,N,A,D,J,P,S,h,O,H,k,r,D,L,L,P,E,D,K,C,K,S,K,W,k,M,C,W,J,C,f,I,N,W,F;IOU,cd,F,D,F,I,K,W,G,R,C,J,L,F;IOC,cB,V,R,P,E,N,O,G,U,M,G,G,G,W,H,E,F,N,L,G,J,C,H;ILs,cH,A,F,N,G,Z,a,E,K,Y,S,G,C,G,N,H,R,H,F,F,P,M,N;IJc,Zj,F,F,N,O,A,M,V,U,D,O,M,O,Q,J,Q,T,S,F,F,N,V,d;IJK,aX,D,H,L,a,C,U,E,C,I,d,D,P;ILA,aL,F,D,X,A,R,W,A,O,M,O,Q,C,K,F,I,N,C,R,D,N,F,H;IGs,W5,V,F,N,G,E,Q,I,I,Y,P,F,N;IMi,cR,D,H,L,C,b,K,D,E,Q,C,K,A,O,N;ITU,d5,s,h,BO,C,4,j,m,3,j,P,BF,W,Br,M,n,6,E,g,Y,I;ITu,bh,DD,Bk,BH,4,d,s,2,N,BO,9,BC,b,BU,9,L,R,S,Z;IMC,Xp,G,J,R,N,b,S,r,E,B9,By,J,Y,e,A,BY,z,g,3,e,Z,e,L;IWi,az,y,9,N,n,s,h,q,CH,l,s,BD,u,V,o,X,BG,K,Q,Z,i,C,I,e,E;IZq,hh,Y,N,2,A,k,BF,Q,J,z,A,BF,U,z,e,L,q,p,G,C,a,k,J,w,f|BKs,CiS,BZ,CN,FP,c,Bv,BP,Dv,f,P,r,Df,E,Cf,B2,2,Bc,Ha,Cc,BK,BV,FA,w,D0,BL|1S,CaA,p,G,T,h,B5,j,C,BH,BN,b,J,7,Bd,I,t,k,p,l,Cb,A,y,a,BP,BO,c,m,z,Q,BC,0,Cu,Z,BG,q,Dc,O,a,k,m,A,w,BL|FZY,ES,f,N,j,M,M,S,W,G,k,R,H,J|hL,bY,BN,CX,Cx,Cv,DL,Bi,C,BK,BN,O,X,BE,BB,4,BO,o,7,L,H,0,e,I,v,i,0,K,B6,Ck,Du,U,B2,CP,N,r,a,J,Y,BN,r,BJ,BY,e;ob,YA,D,H,P,M,BH,U,U,K,u,E,W,N,C,J,H,V|C3K,PJ,A,V,L,I,D,M,N,I,J,I,Q,K,Q,b|BG4,CUm,CW,7,CC,O,t,Z,q,z,BH,Bf,B8,B5,Bp,BJ,L,Bp,Cx,R,m,BW,DF,B4,Bf,BZ,Dn,CA,4,m,z,BE,BE,O,Bf,BC,u,Bq,BJ,E,c,8,0,C,BT,m,h,Ba,CO,BC,CM,H,B0,BP,C,5,CQ,BD,d,d,k,X,j,P|nn,vw,u,Dz,CI,CP,A,Bv,MT,4,E3,BF,2,0,BF,E,Y,Bq,Co,C,CM,BS,C4,BD,BW,i,EJ,BS,Er,t,N,Bc,C9,CU,CQ,Bs,B6,EA,EI,e,Eq,Bv,D8,ET|B5C,BT2,F,A,h,e,n,O,H,K,G,I,M,P,g,N,o,f,L,H;CLc,16,Q,D,J,K,G,I,W,T,D,d,T,U,X,F,N,G,V,U,F,O,Q,I,E,M,F,K,M,D,G,L,C,h,D,H,I,H;Crq,9S,Jf,BX,GJ,FR,MB,B0,CB,Dt,Gl,K6,Ex,D4,Cp,I0,C9,B2,Hn,ME,Bx,G,BC,EK,Dm,f,Eg,Ck,Bo,Bm,DT,DM,HE,CC,Ja,DX,Ic,GF,MG,CJ,Fg,GF,CS,GZ,Bw,X,Ds,FT,Ie,v,Bc,CR,CJ,Gd,Jr,DP;B4E,BU6,D,D,L,G,C,Q,G,K,A,N,E,T|X6,FE,H,H,L,E,D,I,M,Q,E,E,G,F,C,F,A,H,H,N;Ve,Y,V,P,J,E,L,g,C,K,I,M,W,M,M,A,M,P,A,T,T,Z|oS,CRm,N,D,H,I,I,K,M,C,C,J,F,L|I75,rd,W,T,I,Z,J,Z,X,G,r,F,x,2,W,A,BG,K;I5F,tV,5,A,l,K,Z,S,F,K,m,K,0,P,G,N,W,J,C,P|DLV,qc,H,F,R,O,C,Q,S,O,I,A,E,P,D,T,J,J;DLh,p4,D,D,C,A,D,A,F,C,F,A,A,C,E,D,E,C,A,C,D,C,K,G,C,D,F,F,F,H;DL1,o8,D,D,D,C,C,A,C,C,D,C,A,C,C,A,C,C,A,D,C,D,F,D,A,D|DKd,sk,L,V,X,M,D,S,C,K,M,S,S,Q,E,R,D,n|DPt,3O,L,F,J,G,A,O,K,A,I,H,A,L;DQD,3m,H,F,J,O,R,C,N,I,A,G,C,E,I,C,Q,L,Q,X|Bha,Ef,y,K,U,b,BY,BS,e,A,A,d,8,BJ,E,Ch,5,N,d,S,7,X,n,Q,N,BP,j,P,BB,F,7,q,T,Z,T,I,N,u,2,y,C,BO,q,8,u,a|Hkk,CQM,E,D,G,C,C,D,A,F,L,D,D,E,D,C,A,C,C,A;HmI,CQu,H,D,N,C,I,E,I,D,C,D;HlI,CQC,F,A,A,C,E,C,I,E,C,D,D,D,J,F;HIg,C1u,Z,j,T,D,P,I,n,A,6,a,k,C;Hzw,DEY,R,D,J,E,A,E,Y,K,Q,M,I,J,E,F,d,R;GP6,Dxw,z,L,t,C,f,O,BC,K,8,R;Gdu,D0O,N,A,X,E,H,M,S,C,Y,D,U,J,X,J;Fgy,EES,z,C,I,I,6,C,W,O,k,A,Q,L,A,H,t,A,v,L;Fke,EBK,X,A,H,K,U,M,Y,A,c,H,K,L,3,H;FEy,D9G,L,F,X,C,T,I,H,M,O,E,q,X;FCa,D7y,L,D,N,E,A,K,S,M,C,E,I,E,W,F,M,J,R,N,Z,J;FNC,EIy,t,D,I,S,W,C,u,H,h,N;D9m,Dy6,Bt,G,f,I,i,I,Bo,X;ESy,D1A,V,H,v,I,L,G,o,G,Q,D,U,N;EZa,D2M,L,N,5,G,J,E,6,M,m,C,X,N;Efg,D32,BI,C,Y,L,n,X,Bv,E,b,I,O,K,BC,I;DFU,EOS,CR,G,Bg,M,6,P,N,F;JWB,DkY,OW,EF,Bm,BF,P,CX,Cu,BR,8,o,Ch,CI,I2,h,Gq,Cz,Fj,3,4,7,FN,k,B0,CD,Cx,p,CO,BX,Ch,f,HX,Bu,CH,CG,Hf,G,Bt,Bs,BU,BM,Dt,t,BE,CJ,CH,Bd,o,Me;Gxk,CMc,3,BY,Cs,CG,5,Es,Cy,Bk,EE,p,FS,IW,R,Bs,L9,Bv,BV,Ds,Jr,DC,E1,Je,H3,Cm,LX,Cd,B0,t,E,B7,El,GJ,Ef,Bz,Lh,Cc,Ll,Dp,Gx,k,GJ,DM,LB,X,DR,BQ,l,Cc,KZ,Ce,DZ,Dd,BU,Cb,C3,Bz,I3,4,BL,Bu,GJ,8,P5,Fv,CZ,CQ,Er,h,GD,Ea,GH,z,CX,Bw,Cb,Br,G3,IE,Ed,Ca,BK,BW,LF,DN,8,B4,Id,i,BJ,Di,Fr,Q,Mj,DZ,Md,BD,z,BT,Bw,V,BF,v,C0,5,DV,J,N,CD,DH,BV,E4,B9,B9,CB,El,r,Fb,B6,G7,Bp,DZ,BY,R,Bh,D7,DC,IP,y,G9,Dn,a,CN,ET,BY,Cf,GT,CC,CL,C0,H,Ci,DD,BX,h,CS,BD,Fx,B9,CZ,Dn,CY,DP,m,BC,n,Ct,Dk,D3,DZ,B9,GB,EK,SV,C4,Kv,Fg,F6,DG,CV,Bw,E0,BS,Dd,4,FG,B0,8,Fc,Il,Cq,F5,J,5,CK,Dj,s,m,Bq,CJ,By,GZ,x,Bn,C8,Eq,BS,GL,EY,W,Ci,If,Bk,CF,Ci,r,GQ,CC,DM,Gy,k,FX,CU,CT,d,ME,Hq,FB,Co,Bu,BG,DB,C2,Bk,Co,DT,Di,C8,Cg,EN,Bq,Q,CG,BL,M,Lg,DY,DU,v,C9,T,6,f,Dc,L,BB,BL,Iw,Y,Qe,Ex,s,C1,IN,Cd,Vx,Dg,JA,D5,5,Bx,CC,DH,Hu,CD,CA,4,Ex,CQ,8,BO,JS,B5,CM,o,CB,Co,Hs,C8,GG,Bp,BE,DA,CH,BA,BW,DO,Cz,BW,IQ,n,Ck,CD,Fx,Bb,FI,B9,Dw,k,q,B6,C0,BC,Lw,Bc,Eg,CG,CO,D,D9,CV,Ss,CY,I,B1,CC,T,D2,CE,Cd,B6,CY,0,Kk,BD,N4,Dz,CE,B6,HP,B6,BO,D0,CF,BG,FQ,B6,Dm,EI,Gy,L,EO,t,DD,D9,Cq,Bn,Z,Gb,DQ,Bl,HL,E5,i,5,IL,W,J2,Bv,Is,E4,BP,CG,CW,Ba,EU,Y,Cg,Bp,P,CP,Fo,n,ET,g,BU,Bo,BJ,CE,Mf,8,p,B6,Cc,Cg,ED,Cw,GI,CQ,p,CK,Cm,v,BD,Dt,Bc,h,Km,BD,Jp,DG,G8,A,Ch,o,Dc,4,O6,CL,Cj,Bf,h,CJ,Cu,8,BF,CN,BS,b,CI,Be,B5,Bw,BO,B2,It,Cm,z,De,UW,BC,Dj,Bd,C2,BF,Cf,4,FW,BW,FF,Bo,D8,I,Ep,6,Fa,BK,Bf,g,XE,Ci,EN,E,BS,Y,Ra,c,Dk,r,v,v,6,BG,DT,BG,JA,J,CP,Be,KA,Cq,Gm,BH,GB,7,Ka,j,DT,BX,PK,q,I2,Cl,7,BJ,Dj,2,EE,BR,Cn,BZ,ZH,HP,Se,DE,D3,O,B4,s,I6,X,Be,Bz,BL,Br,Bs,p,Bb,k,CK,Bu,BP,e,Bw,Q,OK,C,Bk,X,Bp,v,EQ,3,JA,V,De,BA,p,Bc,Dm,W,Os,CF,Bn,r,CG,n,Cr,j,Cw,V,A,BJ,FB,BC,Km,FX,FQ,Dy,DW,Bn,Hu,m,F8,Bl,6,Bg,Fo,X,CB,Be,Cq,w,DZ,c,GQ,0,3,8,Ri,Bd,Gt,l,8,T,Hm,a,CV,BL,BJ,6,B1,Bt,Gq,CC,HO,j,Bq,1,Dj,n,Lk,C1,T8,W,D4,BZ,R,CX,De,j,BY,CR,Bj,BN,CS,BM,H,Bg,FW,BE,PC,E,Fo,DD,DA,I,Be,8,Ct,Bm,BE,Bi,Rg,r,NK,C9,A,Mn,Ex,Bh,FT,Bi,Bv,H,C0,n,In,l,E2,s,HA,Bv,w,Cj,Di,Cl,Bd,Bd,Gx,Be,Nb,EP,IH,E1,Dn,CC,Gd,n,DH,Bx,Q,CA,Eh,CF,D5,m,Fv,GT,EG,7,Bh,Bx,B2,DR,Bn,h,o,Bc,BN,H,B5,BT,BL,B5,BQ,Cb,Gl,Bz,J,Db,FD,V,BN,D7,EX,Ct,D1,No,BW,E0,Cy,B4,F,Bk,Eq,u,MO,H6,FS,Bc,Bm,Ea,D0,o,Gr,M,x,DL,Jb,DB,q,BQ,B5,P,Bq,DA,Kb,r,JB,F9,d,9,DQ,BH,MX,BB,DA,BG,Id,Bw,C7,Bp,Pr,e,F7,BV,WB,Nb,FI,t,A,Ct,Cy,Bm,BF,l,Bk,f,B3,BT,EI,BU,R,BX,q,Cc,DY,F,FW,DN,Bt,p,CG,C7,DJ,Ed,BV,Hr,QF,Px,GX,Cr,D7,B6,ED,DP;CdC,EMy,DQ,J,u,l,DJ,c,FF,BD,EB,g,IM,w;CmM,ENE,Ek,x,JD,BD,t,P,8,d,B5,N,Fp,o,H4,s,e,8,DW,W;Dgm,D76,Ur,DB,JJ,Cn,GJ,D3,Hh,K,Bv,BW,I0,D0,CP,g,J4,CW,b4,Du,Ei,9,Dx,Bh;C2c,Dye,Dk,X,DV,CH,V,B9,Ds,Cr,Dy,BP,Eb,F,i,f,Iv,y,BH,M,Cg,0,Cb,BS,Ev,N,Bn,BA,c,6,DW,u,8,BM,BN,U,Co,e,Z,0,Gq,a;FBY,ENi,ES,BP,Cb,T,BA,7,x,R,Kr,v,Hl,BI,EO,0,BY,i,CH,E,Ca,s,H2,y,CW,p;FFE,EKk,BI,d,BN,1,DE,6,EW,p,3,Bt,CF,H,C2,BF,Hp,b,Of,CK,GM,B6,Io,M;FV2,EHo,Bh,BV,Ee,BA,E8,Bz,B7,z,Rl,9,Ha,EO,E2,L,t,L;HRw,D6m,Ce,p,CK,Bo,Me,B9,EV,Bl,Fh,CG,X,9,DA,BX,LJ,D,B3,9,G7,CK,EE,Cg,F6,5;Hni,D5I,M8,r,x,x,E7,f,JX,BY,6,BK,BK,n;JS8,Dqe,P,D,d,k,G,W,Cy,BG,Bc,S,A,Bx,BJ,T,Cj,P;Hag,Czc,By,En,b,DT,E4,Kp,CJ,B8,DF,L,Bv,Et,DS,Ed,f,BF,f,Bs,CR,c,Bn,Ch,z,Bs,BI,FC,BB,CY,BG,H8,Bx,DY,g,Dc,CS,W,k,Bc,BP,BO,BY,W;JTD,Ds4,Bs,L,Cu,BB,BD,f,EV,b,Ct,K,A,Bw,Dm,I;B1i,DYQ,G,J,C,N,H,J,C,J,N,F,V,Q,N,A,N,G,H,M,M,E,E,D,Y,I,S,F;CNw,DdK,H,D,p,K,F,G,C,E,Q,C,Q,F,M,J,E,J;Cuo,DsM,i,Z,Y,F,E,N,h,b,O,L,V,D,5,q,n,O,1,E,L,M,2,M,s,H,A,I,i,J;IuE,C0A,I,L,B5,4,L,O,O,A,Q,N,6,X,g,b;IWc,Dqc,P,D,f,C,N,G,A,O,C,C,Y,D,O,J,Q,N;IY2,DkQ,L,A,I,U,BD,W,E,s,R,Q,G,M,BS,i,W,L,D,T,P,N,j,H,F,J,I,1,a,d,L,P;H7M,D7i,V,H,v,K,Q,G,g,E,M,H,G,J;HvI,D9S,Cb,D,BC,U,CO,G,1,Z;HLC,Dsq,z,T,z,M,n,F,r,O,s,K,Bu,C,c,R;Fla,EEC,t,P,Db,Q,Dg,K,m,N;F00,D9K,e,P,G,J,b,N,Bz,k,BW,C,S,F;FBY,D8E,Q,F,1,L,L,T,DN,S,O,Q,Ds,D;FAm,EAe,Bb,N,B3,K,EE,m,G,N,3,Z;Eou,EBA,r,D,h,K,c,O,BG,C,M,H,j,T;D20,DxE,Bz,e,U,S,q,E,Bw,P,t,H,T,N,K,N,J,J;D5i,Dy8,h,H,I,K,m,M,BK,G,Y,F,t,T,BF,A;EVg,D06,d,H,B5,K,BE,M,Bg,N,P,F;DfO,DmS,R,T,h,C,P,G,m,U,W,D,C,J;Dcs,Dpi,C,J,L,C,P,K,J,M,F,W,K,I,E,A,A,P,U,h;Dn2,Dcg,l,D,n,Q,l,e,G,G,B2,L,F,V,K,H,T,P;Clc,EKS,R,D,BV,U,BC,O,BM,D,O,L,z,N,F,J;Cp0,EJ2,DH,F,BL,M,Cu,W,BA,J,D,N,i,L;Cns,ENc,v,A,f,O,BI,K,g,F,O,J,p,N;C28,EK6,5,J,f,A,P,G,0,O,m,H,K,H;Czi,ELk,d,L,Bh,M,S,I,J,I,E,K,Bs,P,G,J,F,H;DGi,EJ6,BL,J,BV,M,G,M,B4,Q,0,J,W,T,t,H;DDG,ENa,BA,r,7,N,CR,E,CX,u,Cs,U,B0,R;Cew,CWu,D,F,L,S,A,M,G,G,I,V,D,N;CmK,DlM,L,d,b,Q,Bf,3,CV,Z,Bh,M,h,w,a,BA,Bu,g,4,A,DW,BD;DSa,EMU,Cv,Y,FG,k,Bi,o,B4,N,2,r,Gr,v;DA8,EKc,CD,I,d,w,l,O,Eu,D,Cg,Z,Cx,F,Bb,p;DOi,EMu,T,r,DV,p,Eh,C,BL,c,BY,2,H4,D;DLO,ENI,Df,G,Bs,W,Cy,C,W,L,BZ,V;Cwo,EKq,C1,D,BZ,Q,DK,e,CI,d,BF,R;C8I,ELM,I,h,J,V,T,F,EH,G,6,U,C,c,Da,C;DAe,EPE,Ca,b,CR,L,g,Z,B1,X,Fl,K,z,Y,Hi,w;C0g,ENq,Jk,BF,F1,h,F1,k,CG,BA;DTU,EPQ,E9,O,CM,I,DM,P,b,J;DCE,EPm,BR,A,s,W,EI,A,L,P,Db,J;Ey8,EJE,Bt,D,Df,8,Di,O,FQ,f,Dn,r;EvY,ENu,BJ,R,EB,K,R,M,FY,H;HU2,D0s,B7,R,v,Q,R,k,o,Q,CE,A,U,F,M,P,T,j;HYo,D0Y,Du,BF,e,BD,MR,k,CO,K,CQ,BQ,Di,G;HEi,D5Q,Bn,F,E,O,Y,Y,H,M,E,O,Y,c,o,h,2,R,n,T,D,H,K,L,P,H;HFW,D0a,R,F,CV,BA,D,K,w,H,BU,b,s,X,N,P;HK8,C1s,2,N,X,J,d,p,x,b,N,D,p,s,v,R,K,U,8,BA,BK,X;Ixy,Dmc,Cv,Q,Bz,k,2,a,8,K,Da,h,t,5;If2,DDC,j,T,J,I,8,y,G,s,Cm,o,S,z,J,R,BH,L,CF,x;Ipk,C04,A,f,BX,y,x,y,x,U,k,M,BI,J,L,P,E,P,BS,BF;IDY,CjE,V,J,V,E,A,S,q,2,Q,F,F,N,R,V,G,Z,F,J;IIi,Cna,J,H,J,C,b,M,H,G,I,K,i,Q,Q,A,G,F,D,T,P,T;IG8,CmQ,b,V,3,L,Z,X,h,K,A,Y,J,K,u,W,y,G,o,4,s,S,A,r,l,1;IBC,ChY,J,L,J,E,D,C,U,M,I,O,O,A,G,D,H,H,Z,P;IGE,Cn6,T,D,J,G,H,G,D,I,U,E,O,F,C,N,D,H;H72,CeE,L,L,L,A,F,E,O,O,G,C,E,L;H4U,CbS,l,X,P,A,H,M,c,E,BA,w,Y,G,7,x;Hw2,CXO,x,L,s,y,a,I,g,c,BQ,m,o,A,BD,p,H,R,Bp,7;HtW,CWM,CP,BF,z,D,Bd,BZ,BB,f,BI,Be,CE,BM,G,e,c,Z,0,E,6,o,o,G,G,f,x,J;HnQ,CRG,H,F,P,E,C,O,o,K,M,H,E,H,n,N;Hlo,CTi,e,R,q,E,L,P,BV,Z,p,f,d,h,l,T,H,n,Z,Q,E,a,6,o,BK,BY,U,A;F3w,D2A,B9,9,CL,M,B9,m,BO,C,o,m,EO,f;D78,EI6,EU,f,DD,D,D,K,Bl,I,V,M,o,C;EKK,EMy,DZ,A,w,W,D4,H,BT,R;Dp8,Dxy,Cb,F,U,c,F,c,BI,Y,CK,E,B8,5,DH,Z;ECa,DvM,Cd,G,CS,BA,CQ,R,S,P,CZ,n;EIc,Dwk,CB,G,z,U,G,I,Bm,o,o,L,k,Z,J,p;ERE,D5S,K,P,j,D,P,T,P,C,L,M,r,H,f,Q,q,Q,s,J,F,S,W,C,e,C,A,V;DJA,Dnk,D,p,CV,F,t,g,Bx,E,Bj,BO,B2,m,Eg,Bt;BFm,C2U,BN,9,B6,J,K,BC,e,E,Dy,t,y,n,d,BB,S,p,KP,U,BM,Be,Bw,O,Ba,6;BuW,CYs,s,W,C0,v,Ce,CJ,Dm,O,n,BD,C9,G,BP,9,ET,BT,BB,e,W,Bw,DZ,8,Ds,Bw,P,e|BdA,CWm,E0,n,f,BX,CL,Q,9,Dz,E1,BY,FJ,Bn,IV,g,p,Cg,EZ,s,a,BC,ED,DG,C0,i,C0,D8,Dq,B2,Fo,BN,F2,Bu,EY,EJ,c,E7|CpY,BRY,9,J,X,W,X,CU,y,B2,0,i,4,z,L,BP,Y,Bh,l,BP,h,N|3d,BsC,c,L,Y,E,w,R,f,X,l,C,r,W,D,I,K,M;cV,CLS,Bo,o,Y,BF,E6,a,BU,BV,CV,Br,L,D5,Bz,d,Bu,B7,BH,B7,BO,3,Bj,Bf,G,Bx,BX,j,Dx,E,Y,Ek,q,H,Bv,G,J,q,Be,BW,CN,BJ,Ci,Gg,V,D0;BSv,B5O,A,F,N,C,P,D,J,M,I,E,Q,A,I,F,C,J;Bmd,CDI,J,L,R,E,F,C,E,W,M,E,M,J,A,P;BZX,CAo,F,D,p,G,N,I,H,O,I,E,S,C,a,D,S,L,A,N,J,J;Bbn,CAY,L,F,1,Q,V,I,Z,Q,Bs,l;BeZ,CAS,V,D,V,Q,c,I,Q,L,C,J,H,F;Bcz,CAC,S,J,j,H,V,G,Z,A,R,K,F,M,I,G,W,A,y,V;BUv,B8E,Bg,A,D,R,N,F,n,F,7,I,V,O,F,M,O,E,a,P|BOK,CqM,Bi,DN,Ed,C9,U,B5,MZ,BO,EH,C6,Db,r,BL,By,Ev,o,n,FY,Bl,BI,BY,DC,BL,U,Mi,C8,C2,Bl,Mm,I,By,z,Ba,Dl,CT,CZ,BY,Cf|GSo,8E,Ca,BD,BW,g,Z,Cl,BM,Bv,Dp,Fz,BO,Dt,Ba,x,BW,BQ,Bg,B1,s,BA,Bm,t,3,n,w,Bv,BI,P,R,Bh,X,BI,CF,Y,CT,Cy,A,CV,Cp,Ca,Bb,7,CR,e,8,Cu,BL,u,d,BZ,BL,BS,BB,Ei,B6,f,u,Hu,Bm,W;GGa,bO,T,P,a,BG,GC,Fs,S,Bk,w,BG,c,Cn,Bn,Bb,BV,d,BJ,CJ,Dn,Cp;GXK,le,W,N,u,I,S,P,J,T,2,U,J,z,V,j,t,b,H,j,B1,p,z,l,e,D2,H,Q,l,O,G,M,W,K,Bg,5;GZM,dO,d,A,Z,0,BB,g,h,BG,O,c,BQ,a,J,BU,g,BQ,4,U,y,P,M,d,BV,C9,D,z,i,BH,n,r;Gd0,kk,BK,G,U,h,F,BX,e,f,W,BF,Z,J,D,R,f,k,I,BH,z,c,J,2,K,BG,b,k,r,J,Z,CA,w,p;GgA,oa,Q,r,s,b,R,x,G,BL,Y,3,J,R,a,R,I,X,X,Q,BT,E,p,m,X,s,Q,o,Z,E,p,w,v,a,h,BW,DE,J;GRW,re,4,C,c,X,Q,K,BC,9,L,p,O,7,f,BH,f,R,Z,G,p,0,3,CI,d,S,L,a,Z,E,M,W,8,J;Gie,eE,6,BN,h,BJ,BC,BT,Y,DF,BR,BT,A,Bv,BN,DS,b,P,BB,B1,6,CT,BD,BP,Z,Bg,9,n,Cv,Bq,T,B4,s,BU,Bv,BW,5,BV,7,6,1,j,t,u,Bj,Cn,l,E,4,DK,CK,q,Bq,Bu,BW,3,L,BP,B6,Bw,BE,J,c,BU,CC,I,H,Ca,Bu,Bb;GZ8,ee,E,Bq,BC,Bm,BE,Ck,J,Cz,9,3,BF,CN;GVS,86,N,P,H,E,M,e,K,E,K,L,P,P;GUA,BAc,C,T,N,A,T,M,D,G,C,E,C,E,a,J;GVa,BDs,F,F,H,C,G,S,K,G,I,D,P,V;GVK,BFC,L,R,J,A,C,K,K,S,E,A,C,N;GS0,Tm,K,R,O,E,W,F,E,N,Z,P,P,O,d,L,N,G,T,F,L,K,E,M,c,S,Y,F;GFq,Za,L,P,N,Q,C,a,C,G,S,E,A,n;GO0,h0,b,H,H,S,S,S,U,J,M,H,T,R;GPa,nQ,K,F,I,E,I,K,G,R,Q,N,H,P,d,C,P,H,T,E,d,m,E,U,G,E,k,f;GPO,lu,R,H,F,E,D,Q,P,k,M,G,Y,N,G,N,D,J,C,J,H,R;GXo,hw,L,D,N,J,F,O,E,Y,W,W,K,E,G,H,C,N,N,f,H,H;Gd4,fk,D,J,V,A,Z,Z,x,H,l,E,P,M,L,c,S,U,e,Q,W,c,i,E,w,b,F,f,G,T;GP4,Q8,N,T,P,K,F,L,T,F,L,P,R,F,N,C,C,M,e,U,U,G,S,O,I,C,I,R;GV0,Uu,b,D,R,U,D,I,N,K,E,K,u,Q,u,V,G,J,P,F,L,V,X,L;Gio,fg,D,D,N,Q,C,S,O,a,M,Z,D,P,K,P,H,H,R,A;Ghc,f8,F,F,l,u,G,m,e,a,C,L,H,d,K,l,D,h;GP8,sW,A,P,j,U,A,M,E,E,S,J,M,P;GVQ,rq,S,C,W,T,C,T,R,b,J,J,Z,Q,L,K,D,S,K,e,I,H;GV0,n0,R,x,L,Q,E,M,N,Q,O,W,C,g,e,K,N,9;GXo,ns,L,F,l,i,K,G,a,A,O,P,C,J,H,P;GZq,pc,S,f,V,W,V,O,Z,W,V,O,C,K,Q,A,i,p,O,N;GbS,oK,A,R,J,G,f,u,G,I,S,N,O,h;GbG,no,m,Z,a,p,C,t,p,g,Z,I,C,K,3,s,BB,7,W,Bg,H,k,BC,d,g,f;GdI,r8,F,N,R,E,P,N,Z,Q,F,K,Q,a,A,m,U,U,S,b,W,R,F,n,L,L;GWI,tU,D,J,r,e,D,K,C,E,s,l;GVo,wa,E,J,H,A,L,R,K,b,H,V,N,A,F,C,E,O,D,M,V,g,E,Q,a,C,M,J;GdC,iO,H,D,I,W,I,F,C,D,A,L,N,F;GgI,gM,C,L,b,a,H,U,K,D,K,H,K,d;GYk,X4,C,F,D,H,V,L,J,C,A,O,E,I,K,H,I,G,G,F;Ghu,Wc,D,L,T,g,G,Y,O,N,A,j;Gd8,lE,b,A,L,I,P,c,Q,G,O,D,K,L,M,T,D,N;Gem,de,H,N,X,K,H,K,C,K,M,C,G,A,K,L,E,L;GTI,9i,A,N,L,G,F,K,C,I,E,I,G,J,C,N;GOo,lM,E,N,H,R,F,D,H,G,P,E,A,I,G,A,O,K,G,C;GbO,kY,M,b,R,A,H,U,G,G,E,A;GWi,oa,H,H,F,A,D,M,G,G,C,A,E,N;GiW,e6,F,F,H,K,G,Y,E,E,E,R,F,T;Geu,lY,D,L,N,I,J,Q,D,M,M,J,G,L,G,J;GGk,ae,P,F,F,M,C,M,K,A,E,F,C,R;GbC,dy,C,X,V,H,P,G,L,M,A,G,K,D,W,O,K,J|Dnt,Nr,Cr,O,Gv,DF,z,EX,Cx,Dh,DU,En,x,BX,Cq,V,o,Bl,FS,By,V,FF,Da,M,C2,FB,CX,KJ,B2,CR,Dh,GD,Bl,d,Rx,MA,JJ,TY,D9,F8,Dt,CS,0,BW,Bf,DI,DS,EI,h,DX,Eq,Bv,CM,FE,I8,GC,BA,DC,BN,Bg,BU,Q,HW,Hl,GW,k,Cy,Bd,CF,Dn,Ce,Bf|DBn,BDD,o,GT,Gy,p,BY,FT,Dy,V,Br,IB,DF,C1,JV,U,DG,GY,K7,FE,FP,E6,C2,IU,Im,BK,DA,Cz|H7c,PX,R,P,f,m,P,Bo,BR,Bw,D5,Ca,BD,S,Q,i,D2,CN,DM,Cx,W,x,h,BV;H4E,N3,Bk,J,N,Bj,BN,z,U,BR,Bz,T,7,BN,Cd,BH,Cp,H,EP,CA,S,o,Eg,L,0,Bo,S,Bp,CU,O,BY,Bk,BG,Q,R,CM,BE,V;HUw,db,D,VA,LU,D7,EK,DN,F,B3,F2,CJ,4,B7,C5,j,w,Bx,Ee,FZ,CA,E,CK,DL,DK,v,Bt,BV,IP,B2,Fn,Ga,Hr,CA,6,Bj,BF,1,Eh,A,Du,Cd,CV,BN,FZ,q;Hrg,Sz,J,A,F,I,V,I,T,Y,C,c,M,A,o,Z,G,J,F,X,H,P;HlC,PR,P,H,L,G,F,M,E,O,M,K,I,C,I,H,C,P,H,T;H6e,KH,F,T,N,K,L,O,G,I,O,E,G,T;H4o,Jh,D,L,H,C,X,Y,E,E,U,P,G,H;HxI,FB,D,J,P,E,F,D,Z,W,A,M,G,M,K,D,U,P,I,Z;H1W,gV,I,A,O,O,O,G,I,J,P,v,3,U,D,S,L,G,Z,0,Q,T,m,d,D,J,I,J;HzA,en,F,H,N,E,h,c,E,U,Q,K,W,L,K,d,F,T;H1c,cL,C,P,P,O,G,S,A,O,R,K,K,O,O,G,A,V,E,L,H,h;IBq,kp,D,N,J,E,X,H,N,C,J,O,U,F,F,M,c,H,I,F;HdM,bX,L,A,j,M,L,K,0,F,C,T;How,Rh,N,D,X,a,A,K,Y,O,Q,N,C,b,J,L;Hoa,GV,BE,P,E,I,E,P,V,D,b,X,Bf,G,p,N,F,Q,Q,G,D,Q,M,K,BU,C;HzS,Il,p,F,P,E,b,e,R,I,c,O,a,E,o,T,E,P,D,Z;Hzk,eL,c,R,Q,G,I,F,S,T,C,h,L,H,C,I,J,C,BN,G,O,Q,R,W,C,O,S,C;H6W,c5,k,D,I,L,U,L,K,J,J,N,C,J,V,D,f,K,D,I,P,O,Z,K,W,K;H9S,lD,g,L,M,N,r,J,H,G,d,I,F,M,P,F,G,K,T,K,H,U,BG,h;HdM,b1,E,L,f,M,d,U,P,G,J,O,Q,L,e,L,e,X;HrC,HX,J,N,P,C,H,C,K,C,E,K,G,C,I,H;H4M,JJ,H,A,A,Q,E,I,K,H,C,P,L,F;H0w,iH,F,P,R,E,D,E,C,K,O,A,G,F;H9q,NP,D,F,N,E,K,M,E,A,A,N;IHG,Vl,L,X,n,N,BP,c,b,m,D,s,n,U,z,4,H,Bk,BK,l,BO,Bt,BI,v,c,BB;IC2,Rh,F,D,L,a,F,g,F,I,S,U,K,J,C,T,I,R,H,h,L,L|EBl,b6,i,CP,BH,BT,t,a,d,Bh,Br,Cq,4,BE,BO,1,ET,Cy,BX,H,DF,Cd,Bc,CT,CJ,3,v,K,h,CA,r,3,Bf,Bo,DF,k,p,z,f,2,8,B2,r,c,c,Bs,CU,CJ,8,G,X,k,Bu,BL,Fs,Co,Bg,N,DU,9,CS,B3;EGh,aq,F,J,J,U,A,W,I,E,I,A,E,D,E,V,D,L,L,H;EPP,Xo,N,A,X,I,R,Q,D,M,K,Q,Q,G,M,V,J,H,E,N,Q,L,C,L;ERR,eQ,D,L,R,S,I,C,E,A,G,L;EHF,am,J,J,F,I,G,K,C,A,E,L|GzI,Jw,F,D,F,C,C,C,C,C,E,C,E,A,A,F,F,D;HAM,Xy,P,F,F,Q,C,S,I,M,K,G,I,S,C,L,H,h,H,N,A,N|D9o,B1C,4,Bx,Bf,BN,If,T,I,Et,ES,C7,Cf,Bf,O,Cj,I5,J5,Ev,O,Cx,C7,E0,Ix,HT,T,CJ,Bz,CB,m,Dz,FW,PV,BV,2,DW,EQ,BW,c,Bm,Bv,U,A,DM,Cz,BA,DZ,EO,Kg,Bh,G2,Bi,B6,Ee,H4,CM,s,De,Cc,2,BN,CU,Du,I,B0,Do,BZ,Cw,DI,CI,Jo,2,FO,EP|DDa,BDO,R,D,A,a,e,g,S,k,O,h,X,V,P,f,L,L;CvQ,1s,Dl,Hk,Jq,DO,CI,Gc,Bb,DU,2,C6,Bq,Y,n,Cm,B4,W,CW,DP,FU,Bf,DU,EN,ET,F1,9,k,BB,BJ,L,D7,DL,3,Bd,Cd,C5,f,BX,Cl,GX,BR;C5m,BUu,L,F,X,M,G,BK,T,C,Q,e,e,G,O,Y,K,H,D,t,L,BB,P,f;C5i,BTa,J,H,H,A,C,M,C,G,K,A,C,F,D,J|BEg,Dks,Bn,F,f,CJ,FZ,o,BP,B7,Dr,N,EN,FJ,DD,l,N,Cr,Cr,CV,BU,Bj,GF,Bn,F,GF,CU,BN,B5,BJ,o,C3,Cn,Br,J,CJ,Cn,y,v,B2,BX,Cb,KR,DN,Ex,CS,Cs,2,Bh,U,Bo,Be,EH,BF,GC,EI,F9,Cz,Bu,Bi,Bx,BE,Bo,w,Bt,L,X,BS,IW,i,ID,F,l,CO,Fy,D,FJ,6,Ji,B0,Eb,D,Cs,BO,DY,z,Bf,BA,BW,Ba,HC,d,CQ,Bu,GH,7,Ky,FQ,Cj,N,CG,Co,EC,o,C7,P,S,BU,IA,C0,C3,6,I2,CA,DX,U,Fo,DC,Em,BE,L,BP,CM,Bs,r,B9,CC,k,Z,BQ,EW,R,B9,BS,EQ,c,CK,BR,Ei,DU,DS,n,CZ,CT,Eu,Ck,Q,Bn,BS,U,B8,B2,Ci,X,Bl,9,BM,D,R,BX,CE,B8,G2,Br,HD,n,G4,Bn,GT,CD,i,CG,Ef,BQ,Fb,BN,Dp,Dj,IL,a,Cp,Bw,DJ,v;QA,DLC,T,D,P,C,E,U,I,C,M,C,K,L,D,P;Qa,DIi,A,Z,T,C,N,O,C,O,F,O,G,I,G,A,M,N,I,R;Bio,DnK,n,H,H,E,U,Y,O,D,e,N,V,J;mm,DZs,P,H,Z,A,D,G,G,K,Q,G,S,D,G,F,H,L;bU,DTY,l,E,BW,Q,E,G,Q,H,A,J,F,H,BD,H;aI,DSU,r,C,P,I,F,E,2,M,O,J,A,N,J,H;BNm,Dqc,BN,v,x,L,Bh,H,BN,e,DI,K,w,W,w,A;BUi,Dre,BK,J,a,P,O,C,F,J,BN,L,Bd,Q,4,W;BOM,Dpk,E,T,BN,h,j,A,D,Q,R,H,T,G,E,M,Q,K,u,E,8,W,O,P;BPe,Dpo,n,J,X,G,L,I,D,Q,G,I,S,G,O,J,W,D,Y,L,N,R;su,DiO,y,F,BH,f,5,L,R,G,H,N,h,F,H,S,U,O,a,A,W,S,BE,E;p0,Dg6,f,L,M,U,Q,U,W,K,K,F,F,L,A,J,b,T;xE,DkY,m,h,L,X,b,L,BF,D,f,O,t,L,f,Q,k,W,y,H,O,Y,i,F,A,W,S,A,Q,N;BBw,Dog,c,F,Q,L,S,F,C,H,R,F,v,A,P,S,V,K,D,K,Q,A,S,L;BFC,DoG,d,H,l,E,L,I,A,G,Q,K,g,G,i,F,J,Z;BAI,DoC,BI,L,5,p,BD,N,v,l,Bp,J,r,M,i,I,Y,a,BC,C,E,W,BK,e,Q,o,Q,C,K,l;oW,Dak,R,A,A,I,K,I,O,E,o,C,G,F,3,T;oE,DbC,T,A,C,I,Q,I,I,O,O,E,S,H,A,N,J,L,h,H;kO,DXQ,L,H,Z,E,v,F,T,G,O,K,q,M,W,A,Y,P,F,J;4c,Dmg,Bm,V,Q,V,d,P,C,b,Bf,A,BV,n,3,M,g,O,G,s,BK,E,C,M,d,I,s,K,K,O;y0,DjK,Bq,BA,2,f,B1,BD,Fj,r,BE,q,Bo,I,BA,k,e,y,Z,K,I,Y,BU,w,w,D,BD,z,Y,7,j,j;c3,Dqg,f,C,B2,k,k,W,BG,I,E,N,F,R,DF,p;BAA,D18,Z,J,l,M,Z,Q,M,E,BC,C,S,N,L,P;BYs,EFs,f,A,3,O,L,M,K,G,a,A,o,T,s,F,b,L;Bq6,EKc,DZ,D,G6,W,Dj,V;BHs,EFi,BY,F,0,BJ,Ds,R,BF,h,Fu,v,Gx,Bj,BN,I,0,u,Fr,T,CU,Be,El,By,Ec,Y;BFa,EK2,Ee,p,CU,BW,Ng,Bz,Kf,CV,MV,8,Bf,U,Dk,g,JP,BQ,Jm,W;2K,EJw,O0,Dx,HP,BL,H5,Fz,It,DA,JY,BQ,Kb,a,LQ,BQ,CV,Q,BE,g,Gv,M,E9,Bj,Fv,CS,DU,A,D1,k,Bt,CC,Js,U,Dp,7,Eg,v,Cy,BY,E2,Cj,Bp,CW,DG,o;kS,EFk,C,P,B0,V,6,r,DP,u,Bl,6,P,e,BS,L,m,b,P,H,i,R;8c,ELC,t,L,BL,I,K,I,Q,G,u,D,s,L;Bfs,EGi,CG,D,F1,L,CA,Y,Bu,N|GqG,CAk,BF,BB,DF,H,Bf,Bn,Cx,q,BV,3,BN,q,s,e,Br,K,Cw,By,BP,Y,m,CU,CV,S,z,Bi,FK,Ck,C6,C0,EC,BR,V,B6,Cy,K,Du,DA,B8,CL,DB,B5,L,Cv,HD,Dv,d,Bl,DK,B5;Ge6,CDi,N,H,A,K,I,I,I,C,F,P|Xi,OQ,V,H,N,C,S,a,I,H,M,D,H,P;r4,sM,DI,HB,C1,CJ,Hb,OB,EF,Bg,F9,H3,D5,g,h,BF,f,BE,S,BJ,CP,T,B3,BM,b,DG,DV,CY,Fj,E,M,Io,DQ,Ee,b,Gu,Ce,Dm,Dc,s,Eq,Cx,C2,BE,Fw,Bt,Cw,Bq,GY,x,Ds,B8|r4,sM,Dt,B9,GZ,w,Cx,Br,QB,C8,DR,D3,L,Cr,Cj,CM,BX,Bj,7,Ck,Dl,BG,q,BC,DX,Dq,O,Be,Dc,BA,HG,S,CM,D6,K,IQ,FM,BG,Tw,NC,HQ,C5,Cc,BO,o,Ex,Cg,Dx,Bl,LH,Gh,IL,g,CN|EUR,wW,z,h,s,Bl,BP,DT,M,C7,R,8,h,r,R,CF,k,t,t,BH,g,Bp,GD,BS,h,b,GP,F6,CS,e,y,0,F,Bc,BS,C,6,4,BA,n,CY,C2,Bu,X,EK,BI|JAc,CJL,EC,k,f,Cb,Fd,FN,By,BP,DZ,c,c,p,DD,BL,Bf,FN,Fb,Cd,Ib,CK,GE,GE,Im,D6,D8,Gw,CK,w,x,f,BW,B9;JDA,CHz,b,N,G,a,M,I,G,A,M,I,A,R,L,P;Ip4,CXT,F,P,T,C,L,E,H,D,H,C,I,M,Y,E,M,J;Iqo,CVv,I,Z,T,E,J,I,O,M,E,A;IuY,CbL,C,J,X,C,A,J,Y,N,Q,C,A,T,t,L,X,N,b,A,V,N,h,F,E,M,S,M,E,U,S,G,A,K,M,K,H,W,C,U,k,C,k,j;JIQ,B3D,C,L,R,E,H,I,T,K,D,S,K,K,E,C,U,X,G,V;JA6,Byr,DY,BD,BS,FJ,Co,BL,R,CU,CG,Dx,Du,BH,CY,Ba,Bs,d,CD,FB,Cr,E,x,DD,E7,Er,CL,BC,Bq,Dy,Eh,Ci,Cs,Bs,BE,DM,BH,CQ,BG,E,Bd,c,7,Bc,q,X,D,BK,Bj,BE,c,Bd,CF,Co,s,s,BD,Z,B7,DK,BE,G,u,Bn;Ixu,CtX,K,L,V,F,T,I,F,G,M,A,K,C,K,D;IoM,Cnv,E,T,j,G,N,I,J,J,P,A,D,C,G,K,e,Q,G,c,a,C,I,H,N,L,C,R,J,F,I,L;JKV,CRH,T,F,X,X,A,Q,H,G,X,F,Q,J,N,J,M,T,K,A,M,R,A,F,n,P,R,C,H,O,A,G,W,W,J,K,P,G,t,A,S,M,S,D,U,K,BQ,F;JKV,CS9,J,D,C,M,F,G,Q,E,G,L,N,L;I8Z,br,F,G,C,D,C,D,A,D;I4P,eN,D,E,A,C,C,D,A,D,A,D|Izv,9j,V,N,L,O,I,Q,K,E,G,A,I,P,D,J|ITT,BGj,H,A,P,C,A,C,C,G,E,C,I,A,G,F,A,H,A,D|TU,Cns,BJ,S,g,BA,Cf,BC,CJ,X,C9,k,Co,P,BD,BG,Bs,Bm,6,CC,Di,Ba,DE,M,BO,h,j,CD,BH,Z,BE,1,9,n,E,j,Cj,X,y,BJ,P,9,3,Z,m,b,N,f;No,Cpw,N,R,3,V,BD,Q,f,J,R,a,w,E,6,L,a,K,U,J,Y,G;Ua,Cwm,d,H,H,A,C,C,Y,E,I,A;TI,Cwc,p,F,R,G,u,C,K,F;Qe,Cv8,n,R,D,E,Y,M,Q,A;RM,CwO,V,D,J,C,u,I,g,C,z,L;Pw,CvM,V,P,N,E,F,E,G,K,e,S,A,X;Mu,Cq4,U,N,G,H,b,F,b,M,T,D,H,G,A,E,S,E,g,D;Vs,Cw0,T,A,G,G,Q,E,K,A,P,L;DiD,nK,J,X,H,K,D,S,F,I,J,E,F,G,A,I,e,P,C,T;DRD,4c,F,F,F,A,F,E,A,G,E,D,C,D,G,D;DR9,40,D,A,D,C,A,E,C,A,C,A,A,F,A,D|Dnf,oK,A,H,J,E,N,M,P,K,E,K,C,C,O,J,O,Z|Djx,m4,L,D,p,S,f,g,D,Q,Q,J,O,X,k,P,Q,V|EkO,Bb4,N,Ep,Cd,P,Gx,BU,Dj,CU,EZ,G,Ip,EW,By,Dg,EA,BS,NW,H5,G0,J|Iqk,Br,F,H,F,A,D,G,A,E,G,C,E,D,A,F|BNa,45,GE,f,FX,CL,BP,Be,HR,BD,A,L3,DN,A,A,Uz,GF,BX,DX,Cs,B9,B5,Dv,EW,Cr,Pi,Ip,OW,J,Ca,EY,4,C8,Bb,OI,C,Hk,CB,Ie,BO|Bm6,BKR,Fe,Hy,J,Ki,IN,CW,l,DM,Jk,DK,Ba,Bz,CY,e,b,Ev,DS,D9,CA,HM,ET,E6,M,Fm,I2,T,J8,EC,U,QL,CV,DJ,Qv,Kh,C0,IP,J,F3,It,FF,U,D5,Ch,C,Z,Hq,CR,Go;Bxu,mv,F,G,H,C,J,D,D,J,I,L,I,A,E,M;ByA,nF,G,E,C,G,A,G,F,E,H,C,H,D,D,J,D,L,E,F,I,C|HL,BzO,DM,Jp,IN,BX,U,CX,O1,GZ,BV,7,X,FF,IZ,x,DX,Gn,Et,Dr,Cx,HF,HR,R,IW,Pk,Cq,Bk,CC,Dw,Eg,BS,EW,Dc,Bs,CW,d,EO,By,Ds,Hk,Eg,DK,F2,CE,W,CG,CP,Hw,X|cd,BbO,c,FX,Kx,A,A,IL,Dp,CH,a,Ez,Mt,A,d,Bh,U,By,HQ,Q,Cw,HE,Es,Dq,DW,Gm,IY,w,H,Bu|94,CQa,BW,BL,CY,BD,9,T,E,p,b,L,f,H,N,e,R,A,BN,Bf,Q,V,F,p,C5,CG,W,Y,T,BK,g,G,K,o,k,Y,k,N,R,w,w,A|EjQ,Cik,Oo,Fe,GI,9,BK,Bv,I2,5,C2,By,BV,Ca,DY,Dc,KY,Cf,k,Cd,DQ,BR,LA,W,GI,DN,Gw,l,Lk,Do,Gm,7,BE,h,Db,GT,JS,W,Eg,ED,H7,d,Mb,F7,Fd,BA,Bn,CP,Bs,CJ,E7,DD,Rf,Dx,LP,DC,Qf,k,DX,FC,Ob,C8,e,Ea,CR,Dg,Hl,C4,j,B6|BX2,Cfq,DA,s,FG,Br,A,Bh,BU,t,G,BB,BA,b,I,7,q,Z,Dx,I,D,BV,Bd,Bt,7,P,d,e,i,DW,j,BG,Dh,Dy,BL,U|YA,CRI,N,F,A,E,E,E,C,A,G,D,A,D|GF1,Bq6,Hw,m,L2,Eh,Oy,Bc,E6,D1,Bq,DR,Dq,B1,CG,Ca,Dw,G,GO,HN,BS,Dj,GU,Bl,CP,LJ,GM,L5,Es,CH,Gg,Bo,C6,t,Ci,C2,BQ,FW,KY,B8,BK,Bh,C9,E3,X,EJ,3,Bg,Dh,DT,F5,C,A,B1,BX,C,DG,D1,EL,A,Bn,E5,G3,Fk,BM,1,C5,BS,FN,Cf,WX,Io,Gl,FU,2,E2,B3,Dq,HT,H2,ET,CI,U,Ck,JT,IC,C3,G8,GF,CU,BO,GF,Jm,Kr,C6,Hp,EA,Cx,BT,Bz,HR,GM,V,Dc,DN,DW,Bb,v,Ef,DS,C8,N,E,Ca,FP,ES,Et,I6;Egd,BDe,L,H,H,W,I,W,K,M,U,C,O,E,A,H,l,z;Fhj,BHs,H,R,R,G,F,K,D,S,I,C,M,H,I,P;Fvx,8c,N,F,T,M,E,K,K,G,K,N,G,N;Fur,BSo,G,X,L,E,P,M,J,Q,A,G,C,C,S,L,G,J;F3D,Bfs,A,F,V,O,x,q,R,U,D,g,Q,D,S,P,I,P,C,R,i,J,I,z;F9h,Bci,D,H,j,M,S,Y,D,Y,I,G,G,J,K,h,F,V;Fz7,Bfk,R,x,R,A,f,Q,F,I,M,4,K,G,a,I,S,v;GJb,BfW,L,J,X,q,A,K,G,G,M,D,A,L,I,J,E,L,C,V;Eft,BGg,C,L,D,C,H,G,D,K,C,A,G,J;Evv,8Q,Z,H,F,G,u,U,I,D,C,D,X,L,H,H;FsP,BP4,F,A,L,K,F,a,C,C,U,h,F,H;F79,BoS,J,D,N,K,C,I,C,A,M,H,E,J,A,D;FwZ,BV6,C,J,A,D,L,G,N,f,F,D,I,o,I,G,K,C,D,N;FyV,BQq,D,J,9,k,O,E,Q,D,g,f;Fzf,BRM,V,U,F,Q,Z,M,Q,g,M,BG,G,P,P,BP,c,7|C98,BEF,b,H,d,C,N,O,K,E,E,k,G,K,O,I,G,Q,M,M,Q,C,a,t,D,Z,L,J,F,N,N,L|0z,BBk,P,V,H,I,D,M,S,c,K,E,H,h;nn,vw,HR,F8,Fh,b,9,CP,Bk,Hq,Bf,Dq,8,Cy,CV,C0,Z,9,S,Bq,Ms,A,b,Ey,Do,CG,A,IK,Kw,A,A,EK,Mc,HZ,Ft,D,De,en,MZ,k,FL,Bt,Bx,Bk,Ch,Cr|vA,B1o,J,H,T,A,T,K,A,W,U,F,Y,X;uK,B2O,N,F,N,G,D,E,Q,E,I,F,E,F,D,D|kv,oA,C3,Hw,Cg,Cq,Bw,Bl,FK,Bs,MY,l,Df,em,Fs,C,VM,PF,Ec,Bj,a,Ct,DI,a,L,IR,CN,D7,Nd,7,GN,Ct,CT,DF,DV,h,V,Ch,Cx,Bp,v,Eh,Bp,x,v,Bs,Cd,B3,DJ,E,Dp,HY,FJ,Bx,CN,Bm|Dy0,Ka,F,A,F,E,A,E,E,E,G,A,C,F,D,F,D,F;DzI,Na,F,A,D,A,D,C,G,M,E,E,C,D,F,R|FM8,Uw,c,w,Ci,Bb,M,B7,Bc,2,u,b,Bi,BW,Cq,Cj,BI,CZ,D,Fn,BM,BJ,Ba,D1,3,u,Bn,7,HD,FC,A,BK,B3,CU,B7,H8;GHQ,Nc,GH,E,Dx,I1,Gj,W,CL,Bx,EN,f,DH,DM,FY,Bd,E,DW,Fy,Ce,DI,Ea,CE,Bv,BO,Cw,6,Bt,U,DW,EY,FG,C,BP,BG,BK,Bq,Bn,f,B5,Bm,i,H,BH,EK,BH,DP,BP,6,B9,DL,r;FaM,Iy,L,D,F,C,F,I,I,S,C,C,I,V,A,J;FNg,RE,H,F,P,C,C,i,K,E,M,H,G,H,L,Z;FMG,U2,O,X,L,N,L,C,J,J,J,D,J,Q,J,G,D,K,M,C,I,F,U,M;GF2,XI,N,L,F,M,A,Q,S,Q,W,C,E,N,D,P,H,J,V,D;FQ0,Jo,L,F,A,G,A,G,I,I,E,F,D,N;FxU,Hy,H,F,L,I,D,8,G,G,G,D,E,L,C,7;GIQ,Ng,b,F,V,A,E,G,D,K,K,C,K,D,Y,N|ByA,nF,J,D,F,E,C,K,C,I,G,C,G,D,E,F,A,H,D,H,H,F;Bxu,mv,F,N,J,A,J,K,C,I,I,C,G,D,E,H;BtG,tN,Bt,BW,BI,DG,Bk,4,z,Es,BS,BG,CP,Ds,DU,V,Bq,Bt,Ba,FB,B7,B3,o,D3,ES,E7,b,Dx,B5,Bn,U,Bz,DT,D8,0,EK,Cz,G,Bb,By|Cjy,oH,Cw,KV,t,BF,Br,Ba,9,JH,HD,Uz,Gp,Cb,Df,Bu,Ch,Ic,Dq,H6,BX,IK,Bm,Dw,GM,8,DE,Ds,B8,U,F,DQ,Cw,BQ,BU,D0,BE,BJ;Cf6,rH,A,J,b,C,F,a,O,A,C,M,I,A,I,X,D,L;ClG,2h,Z,n,I,g,a,s,G,C,R,p|BHi,CMS,CM,W,By,BF,o,7,P,BP,BF,t,B9,D,BV,1,Ct,I,z,BK,M,B4,k,C,K,o,4,U,u,P,2,e|Tu,Clq,D,T,S,X,Y,R,i,J,D,T,V,X,J,f,h,K,j,L,t,S,S,U,f,i,C,W,w,y,W,F,G,H|BFm,C2U,N,C,W,W,K,Q,G,U,E,I,D,b,P,d,P,P;BLc,CzW,K,Bo,z,m,ET,o,n,Cm,DU,BG,I4,A,Fo,CZ,b,BF,BC,P,C9,BJ,BB,B5,a,n,t,e,CP,BD,D5,L,Cj,Ba|e4,Cby,T,A,D,I,A,O,K,U,G,R,I,N,C,F,H,L|es,Bjg,CQ,Bw,K,C4,D8,CW,A,Ce,L2,Cj,Bs,DH,LA,Dv,DM,CO,R,Ds,DU,CK,Do,c,Di,CT,FW,1,G,mj,DP,A,A,Bn,Zz,Mu,Fr,Cr,HR,C4,Bf,Ci,Dz,s,C7,FO,Bg,CQ,BN,K4|lJ,WS,Cw,Cu,BM,CW,CA,F,6,Cf,T,5,B0,h,BA,BW,4,B9,9,Bz,Ds,CL,T,Ez,FJ,CQ,Hr,GA|Bes,BjH,BJ,L,BF,Bj,BB,G,BL,4,BF,CO,u,W,Bc,B2,C2,BK,CK,Bp,S,l,7,CH,BL,l|B2E,Bxs,BS,G,K,L,V,X,i,P,Q,r,9,7,S,T,BJ,N,R,X,Q,X,Bl,BB,J,b,BP,J,Bm,DE,I,s,BE,8,A,Q|BXw,C3k,Fp,CY,I5,A,DV,BH,F,B0,CQ,DA,Co,e,Di,Cb,CW,4,N,CA,DS,i,IC,Cb,n,Bb,Bo,CT,FD,Bh|FTc,BKM,Co,CR,e,Cj,Ew,x,r,r,By,BX,DX,CV,EE,CH,E2,G9,CY,Bd,C,Ex,Dz,R,h,Bz,Cp,4,BQ,Es,Cp,Cm,A,Cq,Cz,DS,CJ,S,CD,B5,Bz,BQ,D1,CD,8,GW,Cj,S,x,DE,DG,DK,W,BN,Bw,C,5,DW,B8,a|Dq4,CFy,HC,B0,Ex,CW,3,BX,D5,BW,DY,CA,BH,k,Bs,Ba,Gq,BN,O,B4,CG,w,P2,Bf,Dm,CV,G3,DL,D5,N,B5,CL,Ex,a,Dn,DT,OR,M,u,B2,Em,c;Drs,CEq,C,E,J,O,K,O,V,C,L,E,N,O,D,A,H,F,F,J,C,L,O,L,H,T,e,F,K,C;Dti,CE2,C,K,F,D,H,D,N,D,D,F,I,H,I,D,G,I;DqE,CEe,A,E,J,C,l,E,C,F,O,P,K,A,S,I|Cfu,Bhi,N,F,J,C,V,m,Q,g,E,E,i,p,D,T,N,P;CgQ,BeE,Cf,D,x,Be,C5,W,BO,Ba,w,Be,B6,Q,u,V,g,BV,j,K,z,v,BE,H,BQ,Cp|BDm,COK,4,o,A,i,k,M,B6,BZ,D,R,BK,V,v,BD,I,R,j,H,V,Z,v,O,5,V,L,p,f,A,T,BI,z,Y,l,q,D,q,6,O|I98,KG,N,H,F,A,O,K,C,F;I9i,J0,P,J,F,E,G,A,K,I,M,A,D,F,J,A;JAI,F8,A,H,T,W,A,C,I,H,K,N;JAK,Fi,J,D,G,E,C,E,D,M,E,D,C,N,F,F;JAK,DQ,M,J,H,L,P,R,F,A,O,O,G,K,J,I,H,D,D,I,I,F;JE6,Cl,H,H,F,G,E,G,H,Y,J,E,H,I,S,L,I,h;JFw,D5,C,L,F,A,F,Q,F,K,E,F,G,J,A,F;JAM,EU,H,A,E,E,Y,G,E,D,A,F,D,A,L,A,P,F;Iy6,Cz,D,D,F,C,C,E,C,A,E,D,D,D;I7h,Oj,A,D,G,C,D,D,H,A,D,C,E,E,C,A,A,D,D,A,A,D;I35,KJ,D,A,C,E,C,A,D,F;I4X,OZ,D,D,D,A,D,C,A,C,C,C,C,A,C,D,A,D;JE7,PH,C,D,F,A,D,C,C,D,C,A,F,E,D,C,C,A,E,F;ID3,NN,H,E,F,E,D,A,O,E,C,D,D,F,D,H;H3n,k5,D,F,F,C,D,E,A,E,C,E,C,A,C,F,C,H;IGx,SL,H,A,F,A,F,C,A,C,M,A,C,D,A,D;ILj,GA,g,Z,P,D,j,M,h,W,K,G,E,J,O,J,O,U,Z,Q,K,A,Y,N,F,X;ISB,Mo,Q,R,D,J,N,A,H,E,K,A,A,E,F,E,F,E,F,A,D,H,H,E,I,K,G,A;I53,I7,I,F,E,F,C,L,F,A,L,G,A,C,E,A,I,H,A,E,F,G,D,C,J,E,D,D,D,C,C,C,E,D|CIO,G9,H,D,E,M,W,O,I,D,C,J,F,D,b,N;BvW,DP,I,Dw,DW,FK,DP,H4,EK,EG,Ca,DT,Gq,Cp,Eg,n,EI,Cm,Dk,7,C9,Dx,E,L3,Bw,Cr,EP,DN,Ct,GR,FH,DG,h,CA,MF,Gm|Cl2,CUq,H,F,L,A,V,W,E,U,S,I,C,F,P,L,D,N,M,P,Q,H;CmS,CVE,H,D,F,M,G,M,M,A,F,R,F,H;Ct6,CWe,F,D,N,G,L,I,M,M,K,D,G,N,D,L;Dq2,CMS,IL,FR,Bj,B2,D9,F,r,Cm,Bl,C,S,DM,D1,CU,Jb,t,LF,Gq,IV,B1,A,L1,GB,DS,FR,Bz,W,DK,EN,BU,DZ,EK,EK,O,Bt,BQ,BU,Ba,Fu,H,BZ,w,8,EK,GH,y,GT,Cf,CB,u,BI,o,Cj,DC,C1,G,CD,CK,g,Dg,CM,C4,EE,Bh,b,CM,G8,Dm,IO,z,D6,DD,Q,Bg,DY,BZ,G6,Bo,Fa,B7,Ek,q,B8,CA,E5,B8,DG,BU,M,CC,DU,I,C1,4,BE,u,Bx,U,y,BS,Mc,BC,Mi,DY,Fq,R,BI,Dj,Ic,j,9,B5,LE,DM,BL,BX,Ec,Cb,G2,IF,Ca,Bq,CW,Bx,GG,y,GC,Eb,Eq,g,CE,CP,FF,CR,3,ET,H5,a,CT,FL,o,Bf,Ij,z,B8,j,BA,FB,B3,DJ,Df,B4,P3,Be,CH,x,P,B5,Fl,BU,Cn,B1|B1c,Brk,DU,BV,GS,DY,2,Db,y,P,BF,z,Gd,Bn,DS,DN,Bp,Bn,CT,b,CZ,CN,Dd,g,Bk,Fu,a,E2,s,S|G6O,B2w,L,H,R,C,L,K,E,M,S,K,Q,T,D,L;HMQ,B8A,X,C,K,E,I,Y,A,E,P,A,A,S,M,Q,m,g,C,N,N,l,a,D,R,j,h,R;HBQ,Bwm,X,T,T,C,L,I,D,I,S,Q,O,U,a,O,I,A,T,d,E,X;GxW,Bjm,X,F,N,E,N,a,W,Q,c,R,G,F,L,X;Gyc,BkE,T,D,A,K,O,c,C,S,M,Y,K,I,E,J,F,f,P,X,H,b;Gvm,Bp8,R,J,D,I,H,C,M,K,A,E,J,I,I,Y,D,K,g,E,G,L,A,f,Z,X;GtC,BwE,P,J,F,O,E,i,a,J,A,L,N,X;GtY,Bwy,F,J,V,M,M,e,A,S,Y,Q,G,J,A,X,V,Z,C,P;GrE,Bru,G,F,W,E,G,F,K,X,V,D,J,L,N,C,H,G,D,G,E,Y;Gwk,Bqk,T,A,H,C,F,G,a,O,S,D,R,V;HVE,CWO,J,N,L,S,D,W,S,F,C,L,A,P;HVy,CVi,P,D,R,I,D,M,K,I,M,F,Q,R,H,H;HP6,CLu,F,A,H,A,F,Q,E,I,O,G,M,C,L,d,H,F;G9Y,BxO,F,F,D,C,P,L,D,K,L,G,D,E,e,C,I,D,F,J;HP2,ByC,D,L,N,C,F,G,A,M,M,A,G,L;GsY,Br6,H,D,L,Y,G,E,Q,g,I,b,G,D,H,J,J,F,H,T;Gts,BtK,P,J,L,A,K,K,I,U,W,G,N,R,F,N;Gus,Bu2,P,J,N,G,G,S,E,G,M,H,E,R;G3q,BwE,H,J,T,C,I,G,E,I,E,C,E,J,E,D;G2q,Bvg,I,J,Y,C,C,D,R,N,T,E,N,A,D,M,C,E,M,A;Guc,BoI,H,F,E,Q,Q,O,A,L,P,R;HYq,BX2,F,A,N,U,E,C,G,F,I,N,D,H;Hd6,CSU,C4,n,CG,BS,v,CL,o,BL,Bk,S,GB,Bp,CX,C1,Ef,B2,Cx,x,Bp,s,f,3,Co,Bj,Dl,BH,l,Dk,B0,BM,J,BI,DK,F,BQ,D2,T,C8,2,W,GE,Ef;GzI,BuY,Bs,A,h,BF,BK,F,U,BN,BH,BV,BD,Dd,3,I,G,l,BV,x,S,CO,t,f,G,BP,Bb,u,i,m,b,i,A,BC,Bc,Bs,d,I,K,i,BB,BI,X,R,K,z,e,A,C,f,7,O,5,p,T,Bk,BA,r,BV,BQ,Dq,CO,u,N,s,3;G9a,Bwg,4,H,U,BV,BL,r,p,BL,t,o,BF,M,BH,f,Bl,B9,h,C,O,c,r,E,T,Bo,BP,T,B8,BI,8,BU,y,j,BQ,S,E,s,BI,W,BU,T;HVk,CJc,Ca,GR,DT,EJ,BR,GN,8,Bp,Br,Bv,Bp,3,D,Ca,DN,DX,Z,Bm,Bt,Br,Dp,F,1,Bg,K,CX,Dt,Cr,B1,Bq,6,B8,CN,e,H1,Bd,h,Bj,D9,c,Gc,E6,Jm,U,DC,Fs,Bi,c,BX,BT,BI,BN,Dc,Bg,Ew,FW,i,Fw,BW,By,CW,BJ,Y,BE,Bb,I,BY,Y;Gc6,BRG,N,h,J,F,L,C,N,S,I,G,K,F,I,C,S,a,E,F,H,L;Gbo,BQU,N,D,f,E,A,G,O,G,A,I,E,E,g,L,A,J,J,J;Ggo,BRy,R,F,T,C,C,c,G,F,E,L,O,F,I,J;Gpu,BX8,BB,n,R,F,G,X,X,P,C,X,P,L,R,D,A,W,Q,W,A,Y,S,I,a,Y,N,I,E,M,c,L,K,G,e,q,Q,P,P,h;GsI,Bba,J,F,N,G,F,W,G,M,I,C,I,V,G,J,F,L;Gtk,BdA,R,R,r,Y,S,G,A,G,O,K,m,I,k,Y,E,T,P,F,l,d,D,N;GtK,Bco,C,F,V,E,J,S,O,D,E,J,I,J;HRG,Bso,F,D,J,G,D,G,C,E,G,A,M,J,H,H|EBP,7i,C6,BB,c,x,BB,J,BF,U,T,Z,l,G,R,j,h,Y,BV,K,3,6,9,Y,Y,g,BI,O,B8,N|Wo,CYK,Eg,Bq,B6,B7,4,CG,Cg,3,BM,CC,Fi,s,E6,Bz,BD,1,Bk,CH,FL,h,a,D9,Du,CH,DK,ET,FO,BH,1,BR,Gm,Cv,Ba,Cd,Et,By,BV,CT,CG,Cb,Er,Db,Bk,DO,Br,DY,Oz,H0,DZ,FK,EJ,BS,EJ,CH,e,BQ,CZ,k,3,CW,Bq,BA,b,Bw;oI,CLK,A,C,D,A,A,D,C,A;oS,CRm,E,K,D,I,N,D,J,L,G,J,M,C;hi,COQ,G,N,F,H,C,N,R,K,b,F,R,A,F,K,E,E,u,C,I,I;s8,CHU,L,D,F,C,F,C,E,I,S,F,A,F,F,D;m2,B4k,L,D,N,G,A,K,C,C,O,F,G,J,A,F;yQ,B9S,Bj,Cd,o,BT,n,BN,B9,W,x,y,FP,Bu,p,u,6,BK,i,f,BQ,g,Bm,r,Fw,w;fE,CH2,k,BP,j,v,O,z,f,Cv,Bn,O,T,5,BD,H,v,4,F,2,e,BK,d,Q,M,BM,5,BK,G,0,BI,N,CI,BU,BQ,x,P,T,Q,L;bW,CCC,N,V,N,O,A,M,C,E,O,H,I,F;au,CIY,J,L,J,C,M,U,K,E,E,F,F,J,H,F|B1m,Bty,K,Bj,BH,Bv,BL,a,v,BN,A,BH,w,P,BD,BP,B0,W,Bx,Gd,CH,Fk,4,BC,B2,FA,8,A,BY,BG|BxO,Bn2,K,L,l,j,A,P,V,R,L,W,m,g,S,U;B0q,Bqg,C,CD,X,7,BJ,X,t,A,O,u,y,e,P,O,l,E,C,BC,W,8,Y,O,i,F,m,X|gH,Cx4,A,H,R,I,H,I,r,E,S,I,k,F,I,D,C,R;XT,C1s,C9,CF,Bs,BB,B6,2,BK,BJ,Bg,D,j,X,BC,DR,BZ,B3,c,V,Gv,BL,A,l,C3,r,Bv,F,0,q,Bv,T,Bq,2,CZ,P,BY,BC,Bd,S,FG,Bg,Dr,X,DM,CE,Dv,o,H,c,BS,K,l,a,BC,Q,BF,K,K,w,p,g,E2,F,BW,BS,CD,I,Bk,Bg,B6,W,C,7,6,BQ,BU,Z,1,f|CMo,B5s,Ho,M,CC,Dt,C6,z,Cz,Fz,CS,DR,EE,Bv,Be,CD,f,Cj,Cy,DX,ET,Q,CP,DD,F1,S,Ij,GG,Jb,DW,BP,EC,HK,Da,BA,GS,Da,CW|C5Q,BY0,x,t,V,G,BZ,f,X,C,D,K,Be,i,A,c,e,J,8,S,O,L,T,H;Cx4,B6c,Eu,CS,F0,i,M0,FV,W,Db,Cj,Fz,BY,p,BL,BN,0,FT,Cs,Z,e,Bh,DJ,DZ,DY,EP,Cy,BB,D,DJ,By,f,f,Bh,ER,BX,z,DV,Nv,B4,BJ,Dm,CB,6,FL,CP,DZ,s,H1,Eg,D5,Gq,Br,j,Bx,Bi,B1,Bh,Db,Hq,EF,Bu,CT,DQ,Cy,Fy,D7,CQ,Ct,Eo,n,Eu,B0,BQ,FG,C5,F4,Cm,BC,5,BD,Bx,Cy,BV,q,Cf,Gk,DB,JM,Q,N,Bq|FEc,Eu,s,7,S,H,c,l,L,BH,N,P,d,I,R,u,n,Y,X,w,t,w,g,D,Y,Y,Y,P;FJ2,Fv,T,A,x,i,v,BU,Q,u,m,K,M,H,o,Bl,c,n,A,X,X,J;GEQ,bx,b,r,Q,P,r,J,d,E,BN,Q,D,I,C,K,q,A,F,8,g,c,k,U,BC,d,C,L,T,t;GAa,aV,y,z,BN,r,X,p,R,H,L,E,K,a,R,a,t,c,v,K,d,q,G,K,Ba,P,q,Y,8,T;FgG,FZ,BC,Cj,Bc,X,r,BF,M,j,CL,y,r,CE,x,U,r,L,r,S,M,Y,k,W,A,e,S,S,a,I,W,p,E,o,m,G,c,j;GZW,Or,E,3,R,U,N,H,T,BR,C,L,O,G,U,N,I,X,t,R,h,1,h,C,N,i,k,4,Q,B4,U,k,Y,K,W,h;GXo,RB,T,Z,j,K,F,J,N,A,H,M,K,k,O,O,P,s,I,Q,BE,e,I,L,E,1,f,r,I,b;Fna,L4,d,J,R,K,c,W,f,I,T,a,A,M,y,k,C,P,a,h,A,f,P,f;FnE,Jr,J,d,X,T,R,C,J,S,R,I,J,P,r,L,G,S,R,o,I,M,O,6,i,I,u,P,e,V,O,b,R,j;HCs,CH,Bo,R,0,z,u,X,P,R,f,J,x,G,R,M,T,8,V,N,t,W,L,Y;HDA,FJ,CW,N,CO,f,CJ,T,CZ,s,F,Q;Gx8,A,Bg,f,M,d,Z,R,Z,I,T,H,BF,4,N,D,c,p,c,L,A,R,f,F,N,c,d,P,L,U,1,M,Y,c,O,H,BO,U;GqW,Gm,f,F,J,K,J,s,W,i,c,U,a,G,S,b,P,z,P,Z,V,L;GpY,FX,T,L,f,E,BJ,J,j,S,C,K,M,c,m,Y,0,X,w,h,A,N;Gio,H5,F,F,N,K,Z,BG,M,W,I,D,G,H,D,h,S,p,D,R;Gig,Fx,BA,H,BN,V,Bj,F,L,A,J,U,a,I,Bm,C;GfI,Fh,S,H,a,G,C,P,Y,H,D,P,9,N,l,K,n,T,t,H,T,e,S,o,w,E,BA,P;Gzo,Zz,t,A,F,a,K,m,K,C,O,o,4,y,E,Q,Q,G,U,T,V,P,K,j,P,n,x,x,L,b;GlC,Yv,C,P,v,P,X,d,BZ,M,x,T,I,g,c,g,u,L,BS,c,m,V;Gd2,aR,E,N,e,I,8,F,O,F,C,b,CP,X,N,E,F,G,O,S,J,K,I,O,Q,I,O,A;Gyk,ER,H,F,Z,E,P,M,X,8,u,O,I,H,S,A,I,L,F,t,L,b;FBQ,Q2,Da,F,Jk,Jv,Bs,O,GY,Fb,Bj,BL,Dm,O,v,Cz,C8,Bf,6,FD,Ca,s,CE,CX,7,Iv,Dl,8,J,BP,Jv,Iy,Jn,QO,Jv,JC,BJ,C4,EE,BF;GYE,bx,Fn,BF,Bl,c,CF,N,V,g,M,4,CY,k,Cq,BH,Bs,Y,BI,j,Bs,BE,O,Q,h,G,g,Q,S,t,v,5;GPI,eP,4,5,2,P,s,x,E,f,BL,l,l,K,CJ,Bg,Bp,M,b,m,BG,e,Bm,D,c,Q,O,P;GJa,a1,BM,I,U,b,s,W,o,BN,BP,P,Q,T,BJ,H,V,m,n,j,Dp,1,3,S,K,Bi,BC,g,BU,N,w,5,g,F,0,c,BX,y,L,m,BK,G,Y,p;Ge2,DO,Dr,CP,KP,s,BR,1,b,Cr,B8,Cn,C6,Bu,F8,K,Gr,Dj,DA,DV,J,CT,CA,Cf,EJ,BN,G,CK,CX,B0,g,Ce,BT,Q,BR,5,i,Ih,Cz,F,M,FG,f,Bq,B7,W,T,CM,CW,F0,BE,K,Z,Ce,Bw,Da,BE,Z,Bi,Bi,JM,Bj,Dy,Cs,t,CP;FkW,TZ,EO,Ch,Fo,h,BS,Bs,Fg,Bp,Bg,CX,Eg,b,i,DL,Vf,DY,Il,C0,Co,DA,EK,V;Fro,Gi,C0,Dx,GW,CQ,Gi,X,Dw,I0,Ek,e,CM,CH,CV,P,DQ,EN,5,7,D0,DZ,Dd,Y,BJ,GD,EJ,DR,F,EX,FF,DX,BJ,DA,CD,t,CN,Bs,Dx,CB,j,CI,En,R,5,Fe,CV,Be,BD,Dw,c,Dq,Bw,Bs;GoC,Cu,e,F,BG,B0,Bg,i,C,Bf,Bb,BP,CE,Bp,C9,y,T,j,S,Bx,Bc,CF,BP,k,BL,Bg,R,Dg,l,6,o,CQ,BU,BK,f,BN,Y,Bn,BL,BD,Q,h;Gui,JR,Co,1,6,Bb,L,7,DJ,Bs,BF,A,J,Z,B9,s,BH,t,BR,6,v,BH,F,4,BC,BI,FA,A;GlO,J9,i,R,o,t,A,x,Bv,n,Bj,q,f,m,H,y,M,M,a,J,BG,Q,8,F;Ge8,c1,E,X,q,C,L,f,d,F,W,9,X,h,Bt,Bj,z,H,BD,h,t,G,H,S,W,c,b,W,Y,BK,BE,2,Q,R,o,C,Y,s,Bi,y;HAq,Sb,A,j,J,P,K,t,L,b,P,P,p,I,7,2,A,I,e,C,I,k,b,Y,a,A,e,k,E,S,M,C,K,D,G,d,K,F,K,X;HAA,Ux,J,f,T,T,T,j,Z,N,X,Q,H,M,K,8,Q,C,P,G,D,w,M,C,y,r,Y,L;HM4,ar,x,d,CH,E,k,Be,y,BK,s,a,Bg,K,m,p,G,X,p,BL,z,r;HUu,Ib,C,VB,Cx,D2,D9,BD,d,DM,BY,M,B3,y,1,EE,Db,CW,Kr,Do,b,Ce,DB,DR,h,Ce,Ch,Bm,Fk,i,s,Bq,FN,d,BP,CM,DB,c,Ee,Da,FG,BP,s,FF,Da,Db,IQ,GG,KM,Dp;HOE,bF,L,D,1,G,H,M,M,I,M,O,Y,G,U,j,A,L;FSG,Gs,K,R,C,N,J,N,D,T,Z,P,V,C,H,G,P,c,C,Y,I,K,S,D,U,O,O,L;FUa,DM,L,H,V,Y,L,k,A,S,G,K,U,L,Q,Z,D,x;FUm,Es,C,b,v,Y,n,K,N,M,A,K,E,E,BY,Z,E,L;FWW,Ca,F,J,Br,e,J,G,M,o,I,I,k,d,2,b,G,X;FWy,Cy,H,H,L,C,p,e,n,K,G,W,M,C,q,V,O,N,U,d;FXK,Bu,X,A,H,C,C,S,I,M,K,A,M,T,F,P;FXs,CI,F,D,T,a,G,O,E,E,Q,T,G,N,L,N;FZi,Dy,O,J,K,G,D,R,N,V,X,E,H,M,E,E,C,K,I,A,E,I;FbY,D6,A,R,M,J,C,L,D,T,P,b,R,E,H,M,C,E,L,G,G,I,F,K,n,J,A,S,W,Q,O,E,O,F,S,I;FcA,l,G,D,G,K,i,d,N,A,J,J,r,W,b,J,Z,M,K,M,I,e,U,J,C,N,a,V;FbA,BF,Y,d,R,b,F,D,R,G,L,R,H,Y,P,Q,I,O,I,C,E,F,W,O;FYo,BJ,b,H,f,E,E,M,O,O,M,A,W,L,I,J,F,H;Fr4,Dz,p,V,L,A,H,I,E,o,G,K,a,C,S,H,I,H,E,P,D,J,J,H;F5O,W7,l,A,n,X,BH,A,BN,Q,H,O,c,i,o,E,C4,C,U,T,v,f;HBY,Dn,L,D,N,E,L,O,E,M,M,I,K,J,E,L,I,A,H,T;Gme,Bn,N,F,P,A,F,W,G,a,M,E,U,F,J,J,G,P,H,X;Gng,BD,W,f,R,d,M,R,c,A,Q,Z,Z,P,T,K,L,M,h,J,F,O,G,U,T,I,R,U,G,g,I,C,S,R,O,U,I,D;G4y,TD,R,T,S,BA,O,M,U,BA,G,D,G,H,L,v,f,h,J,h;G4a,S3,N,V,L,I,F,A,D,K,C,Y,L,a,O,A,I,L,M,b,C,N;Gpy,L1,H,J,N,H,L,C,E,G,D,E,J,D,b,R,L,G,A,I,S,U,U,C,c,Q,O,D,L,f;GlG,NA,X,D,D,K,W,m,T,Q,I,q,K,D,M,N,K,n,P,X,H,f;GhW,LG,H,H,Z,K,C,S,N,a,C,K,O,N,Y,v;GyI,a1,R,H,K,Q,m,k,O,H,S,D,d,R,b,J,L,P;Gu0,Zp,N,V,P,C,Z,Y,E,Y,K,C,e,H,G,P,A,N;GoU,aJ,k,J,U,C,E,J,V,T,p,O,H,O,G,E;Gwe,Fd,E,N,M,L,L,V,I,P,R,D,T,P,Z,D,J,G,p,I,f,Y,y,W,BK,O;FUO,Rr,R,A,f,Y,H,I,I,G,K,A,i,R,I,H,J,R;FN8,KR,I,f,Z,U,F,Y,b,Y,F,i,E,G,K,C,o,t,C,Z,H,N;FNO,I1,P,R,Z,A,F,K,C,Y,H,I,E,Q,E,E,m,j,A,N;FME,Hj,C,H,h,S,R,E,P,U,G,a,K,C,O,J,I,Z,W,h;FHm,Bt,N,L,T,K,Y,8,X,u,U,F,Y,x,R,3;FBK,Hm,Z,C,BD,u,r,M,T,i,S,S,S,H,U,X,BW,1,I,h;GVq,Rj,N,F,Z,W,L,S,C,M,K,M,A,I,I,G,M,D,G,N,I,F,E,N,F,t;GZc,Dx,E,N,H,N,I,V,U,c,S,C,U,L,E,L,J,X,N,L,R,D,J,O,N,A,H,d,P,J,L,M,M,O,H,m,1,7,R,g,E,e,Q,U,8,C;GVG,BV,K,J,H,L,H,C,T,A,J,A,J,H,F,D,C,K,Q,O,K,D,M,C;GQy,UV,J,h,L,4,I,BS,O,n,F,BF;GAM,Wf,R,F,R,I,E,S,i,E,W,N,G,J,b,A,J,H;GDK,Mf,r,l,H,I,E,m,N,Y,I,w,M,Y,e,S,G,CB;GYm,jN,Z,C,D,S,G,K,q,M,q,k,U,K,K,l,X,L,V,X,1,V;Gc6,a3,N,N,L,X,H,H,R,F,L,W,T,D,I,U,I,G,M,A,I,J,a,g,K,D,C,F,D,V;Gbu,ar,d,H,R,Z,P,A,R,f,N,I,R,N,R,K,V,C,y,q,T,I,c,C,O,F,k,U,c,R;GZy,a7,F,L,3,A,A,M,U,S,S,C,Y,H,F,R;HAk,VJ,N,D,H,Q,K,E,K,L,D,J;FXm,DY,C,N,P,E,J,M,G,K,G,C,E,N,E,F;FY6,Ck,A,H,T,M,A,I,C,E,M,J,E,L;FaQ,Cq,N,H,R,U,C,G,C,C,K,J,M,F,C,L;Fbs,M,C,H,V,O,V,a,I,D,Y,Z,G,J;Fg2,KM,D,P,P,I,D,O,E,G,K,D,E,N;FfK,JO,J,A,D,G,F,i,O,L,Q,H,H,R,L,J;FpQ,JY,L,N,L,I,Q,U,E,C,A,T;Fpc,FP,X,J,J,S,Q,G,Q,F,D,N;Fkq,JX,J,H,F,G,D,G,E,G,K,C,G,F,H,L;Fiy,Jt,F,F,N,E,N,K,D,G,M,G,W,H,F,R;F7E,XB,D,J,L,C,L,M,E,E,G,C,G,D,G,L;F1m,Sv,F,J,V,C,D,I,M,O,I,A,I,F,D,N;Fdg,Vb,N,F,L,E,F,G,O,M,I,E,G,C,E,J,H,R;FD8,Gs,A,H,V,W,Z,M,K,C,a,H,I,L,A,P;E7m,Su,F,H,N,E,N,S,E,E,Y,H,C,J,D,H;Gas,Ff,P,D,L,G,C,e,I,G,E,D,G,R,I,J,F,P;GZi,NR,V,Z,N,A,T,Q,F,Y,K,K,m,F,I,J,D,P;Gbg,GV,E,J,P,C,F,O,A,I,O,R;GZQ,F3,P,R,D,K,E,I,E,E,G,E,C,L;GNW,cN,J,D,H,C,C,S,F,M,I,K,C,S,E,E,G,J,O,D,C,J,F,P,V,R,E,P;GMG,al,J,A,D,I,E,I,I,E,E,A,G,J,A,F,F,F,J,F;GA6,cT,H,H,R,M,F,E,M,I,E,C,K,J,A,N;GHg,Nc,U,A,a,E,I,d,l,L,X,Y,E,K;GHi,Kk,D,H,T,Q,F,M,C,I,S,C,I,H,F,b;GcK,TR,D,L,H,K,J,G,C,M,I,F,G,P;Gay,RB,D,V,J,A,H,I,D,G,A,G,E,E,O,F;GRk,W9,V,A,H,A,D,U,Y,J,G,A,D,N;GHO,bB,H,A,J,E,E,I,H,O,C,M,M,G,Y,A,A,J,X,l;GDi,LL,H,l,N,U,O,Y,G,E,D,N;Gm2,Ci,H,H,H,C,F,I,A,G,G,E,G,D,E,N;G9c,G1,F,F,D,I,C,M,E,C,E,A,G,F,L,P;G62,Nt,K,L,Z,I,j,S,D,M,c,T,W,L;GyS,Ch,R,R,BZ,N,Q,S,BE,E,A,I,U,D;GxY,Bt,N,A,V,I,M,I,S,G,I,F,E,H,L,N;Gt4,n,J,A,J,M,V,M,N,Y,u,n,C,L;GnI,D,A,H,H,K,F,C,E,U,C,E,E,P,A,R;GnC,CE,J,D,D,A,D,K,E,M,I,A,E,D,C,L,H,J;Gmo,Ch,D,F,X,E,F,E,K,c,K,A,I,d,A,F;GrO,Ld,A,J,D,D,L,C,J,A,H,Q,A,E,U,H,G,H;Gqs,Ll,j,L,I,U,E,G,S,H,E,L;Gkw,Me,A,J,N,U,F,W,K,J,K,R,F,L;GlM,MK,D,D,J,E,F,G,A,G,E,E,M,L,A,F,D,F;Ggi,Ii,D,F,J,Y,G,M,K,H,C,F,L,L,C,N;G1u,XP,D,L,J,G,L,K,V,G,H,E,i,E,M,V;GrE,XL,J,H,R,K,F,G,K,K,K,C,G,F,C,F,A,H,A,J;GnC,Yl,N,H,E,Q,D,M,W,F,D,L,D,F,J,F;GaI,hP,T,J,A,Q,O,S,M,G,G,J,C,D,T,J,C,P;GVK,iL,L,D,V,G,H,C,U,K,O,O,Q,C,K,F,F,R,V,N;HA4,Uv,F,D,A,K,E,I,G,G,I,A,P,X;HAa,Vx,D,F,H,I,A,E,G,K,I,G,I,C,D,L,N,R;Go2,Jf,L,R,T,A,F,E,W,K,K,C;Gno,Kt,E,J,V,G,J,I,I,G,E,C,M,P;GYs,bl,H,L,N,C,C,M,G,G,Q,K,Q,C,K,F,C,F,Z,D,L,N|Dh4,BO8,B8,Bc,HS,S,E1,Iw,Cw,C6,Eu,P,I4,J4,P,Ci,Cc,BS,ER,DI,J,Es,Fo,f,Gu,DO,Dw,D3,y,Fz,Cr,E,BI,D3,HU,Dv,DD,ET,Ik,EP,RA,Dr,c,FE,CI,M,BI,D1,JM,G,BN,C6,C8,Y,Gq,Em,Ce,3,CG,BU,Bu,CP,9,BJ,DW,n,Bb,CD,s,Bh,C7,c,Db,CJ,DP,Ix,Cl,k,BX,Gr,BH,D,BD,Fe,CD,CR,Bd,B6,EM,EY,Ih,BI,h,C8,EN,BI,7,CL,Cy,CD,DB,CD,CQ,BL,BE,Id,BV,Bg,Br,Bj,l,CW,C,Bv,Dh,B5,X,DB,E1,Bx,Jp,KV,GX,Cv,Bd,RZ,C5,Cb,Bg,BP,DN,R,C5,DV,DJ,Co,KX,YY,CL,K2,N,FQ,Bm,6,B1,L,2,Bs,CD,I,h,Dl,E7,BD,E5,Eq,D4,4,BA,Bq,ED,x,Cp,CU,BK,4,B9,C;E22,WC,N,R,Z,y,L,E,A,Y,E,I,c,M,I,H,O,x,J,d;E2W,Xu,T,V,J,M,C,I,Q,K,I,L;E0c,am,G,J,L,C,N,K,E,M,E,E,I,V;E1a,Za,P,A,N,Q,E,K,K,C,K,P,E,L,D,F;E1u,aA,L,J,D,A,F,e,G,K,I,D,F,L,G,V;EzU,de,L,D,F,I,D,G,G,G,E,C,G,A,E,P,F,H;EyY,iC,H,H,V,G,C,U,H,U,E,I,Q,Q,M,G,M,p,P,f;EzA,ks,L,F,J,G,G,I,C,Q,K,L,A,L,A,H;EzG,lO,n,BE,e,BC,W,I,P,BA,c,Co,o,m,C,BF,l,5,U,BT,b,V,d,C5;E0E,m0,I,d,R,M,F,I,I,G,E,C;EzG,pe,H,N,D,c,C,E,E,A,E,D,D,T;Dww,kI,D,A,A,C,C,G,C,E,C,A,D,J,D,F;Dxs,aq,F,D,D,D,D,A,D,E,C,C,C,F,E,C,E,K,A,D,A,F,D,F|yJ,Dbo,DC,e,Br,5,E0,B3,K,Bd,QZ,FX,M5,BW,Da,Ck,H3,u,G4,m,CB,e,CK,y,Ih,Q,D0,s,Bv,U,BO,BE,DQ,3,Bd,Bs,Ew,BV,z,BB,Bs,Bd,C8,Cq,CU,BF,CE,BU,CS,Bd,h,BY,Ca,p,EM,By,CS,7|BJY,CgK,Ca,Bf,C1,Bb,DH,EH,J7,Bh,GD,Dg,B4,CM,1,a,CG,I,Q,8,FE,t,Fs,CY,FS,Z|EUR,wW,F5,x,CZ,C3,BB,m,CV,9,K,Bb,BJ,BD,Cb,BU,C,Bk,CN,J,C1,B0,s,CG,Eo,Cs,Iy,Q,CS,j,Bk,BV,BF,D,DC,BV;Eex,00,h,R,L,A,O,M,Y,K,U,G,Q,D,h,L;EdB,1G,R,N,D,G,I,K,I,G,K,A,D,F,H,H|Dtj,BBm,a,Bz,h,j,O,1,1,b,w,1,D,9,7,m,Cp,R,Bp,U,Bl,r,B3,BI,O,u,g,I,Eo,v,BU,c,G,U,Bf,BS,W,BM,CR,s,Q,m,Ba,Q,Di,r;Dw1,8k,F,P,1,Q,r,W,C,K,W,E,U,J,e,P,Y,R;DwZ,BCo,I,H,F,F,p,K,N,D,N,G,K,G,Y,A,a,L|DJ7,Qw,CH,CY,w,Ca,Ck,BA,BN,Bu,Cy,CS,j,8,E2,Dt,h,DR,BM,Bk,Dc,CR,E,DL,CL,BD,j,Ch,FE,G9,Ct,E,E1,Cd,BV,k,Cd,EO,Ba,EA,f,Bc,Bd,e,C,CS,B7,J|15,n0,Dq,c,BM,m,Eu,D,E,BL,x,b,q,j,C,3,DF,v,BL,B1,D,o,j,X,j,m,I,k,b,C,BU,m,BZ,Y,BW,y,Cx,l,E,e,BV,W,S,m,Bh,W;z9,jq,R,F,L,O,M,E,I,I,I,E,G,C,E,R,F,J,J,F;zT,ju,D,H,L,C,C,G,D,C,C,Q,C,C,G,H,C,R;yv,kM,A,L,J,C,D,C,G,Q,G,G,K,A,C,D,D,H,F,H,J,D;yL,lO,D,H,N,E,Q,S,M,C,A,N,L,F,F,D;zT,lA,L,J,L,E,F,G,A,K,M,O,I,D,E,Z;zl,mU,L,Z,N,C,L,Q,A,G,a,C,G,D|hL,bY,BZ,f,q,BI,CT,EK,D7,R,Cx,Cv,BT,C0,CZ,BC,BJ,CM,3,V,BM,CM,DE,u,A,DA,Hi,3,Q,BP,BO,m,s,BB,FY,Bm,CE,DV,3,BL,BE,F,BI,CT,f,Ch,Be,Dh,Bt,O,A,C3,Bd,U,Bf,Bh,BH,o,N,DA,Cd,c|Exj,u6,i,Bq,b,q,Be,Ci,EK,A,G,BC,DN,Cy,BW,D,A,B0,F4,D,R,GN,CE,b,C,m,BK,t,DD,CP,A,BZ,DB,Cz,EJ,y,Cx,By|DNH,mu,N,A,E,I,C,M,I,Q,K,K,K,F,F,j,T,J|Bb2,B34,F,D,L,I,A,G,K,E,E,C,C,F,A,J,D,H;BEe,B9y,C,X,Q,F,S,X,H,P,f,K,J,F,L,C,F,O,L,K,V,L,A,I,M,Y,G,E,I,J,I,C,I,c,K,T;BFY,B78,U,V,R,E,T,P,Z,Q,R,Y,O,O,O,R,Q,D,K,H;BEu,CAi,X,D,H,F,C,Q,G,U,I,M,M,E,G,J,D,h,F,H;BE8,B9o,L,D,N,S,H,O,G,A,E,A,G,H,A,F,C,H,K,P;BCw,CDM,E,L,t,Q,P,a,h,c,A,I,M,G,a,E,S,L,C,F,T,R,K,L,G,X,G,J,Y,J;BNi,CBq,W,f,B6,h,e,BZ,4,P,E,b,t,A,BD,BM,BR,K,H,W,BN,y,BP,O,BQ,g,g,P;BOs,CCK,J,H,P,E,R,W,m,V;BPE,CCU,L,D,K,Q,Q,I,H,P,L,J;BRk,CBM,V,H,H,C,G,I,X,M,C,O,E,E,O,J,E,N,S,P;BR4,CHC,Z,J,b,O,A,I,O,Q,G,E,U,A,O,T,F,J,A,J;BN8,B8W,J,H,J,A,H,C,F,E,E,C,E,I,E,C,I,A,C,F,E,J;BMW,B2u,D,J,V,G,H,I,A,U,I,M,K,L,U,R,L,N;BZq,B0a,J,N,J,K,E,K,L,S,S,a,A,M,M,G,D,X,L,R,K,P,E,R,L,D;BZK,B5O,V,D,E,O,L,O,Q,J,K,J,E,D,D,F,D,F;BY6,B4e,H,A,I,I,U,O,e,M,M,C,Q,J,p,T,Z,D,R,J;BUa,B5Q,T,J,N,K,J,S,i,a,G,D,G,J,D,X,H,P;BTi,B5k,R,R,P,C,F,G,I,Q,S,I,I,D,D,N,C,D;BUM,B3Y,J,L,P,E,G,E,C,E,A,I,D,G,C,A,M,H,C,L;BT2,B4S,F,D,P,M,H,I,I,G,W,P,H,L;BYg,B78,s,J,E,N,t,P,Z,O,d,C,M,M,k,G;BV8,B7E,L,A,E,I,S,M,Y,C,c,G,L,L,V,L,j,J;BVa,B4q,Z,A,o,U,M,K,M,J,R,F,Z,T;BXW,B4C,R,H,L,L,N,I,A,K,O,F,I,G,D,G,K,F,I,H;BQk,B7O,P,L,D,O,I,Q,M,A,E,H,J,P;BQ0,B6c,N,H,E,O,H,I,E,G,I,G,K,P,J,P;BRK,B4k,D,R,p,F,G,Q,O,H,G,I,Q,C;BSc,B66,A,V,H,A,D,E,A,I,C,M,G,F;BSm,B7y,H,P,R,Q,R,K,H,K,N,G,D,M,S,G,O,R,U,D,D,J,I,V;BTe,B7S,J,N,N,C,X,M,L,O,I,A,K,H,c,F,G,H;BRu,B5G,F,A,F,I,D,I,C,E,I,A,I,P,J,H;BWK,B9S,T,N,X,Q,F,G,Q,G,I,K,H,O,X,S,A,M,g,G,U,N,K,A,F,L,E,n,L,F,F,N;BXM,CC2,F,N,m,h,A,R,T,I,M,R,h,F,v,M,L,K,g,Y,T,D,X,T,h,I,P,M,O,S,k,C,O,G,C,I,k,C,M,L;BU2,CGa,Z,H,Z,Q,Y,I,S,N,G,H;BUE,CE8,P,T,D,R,V,C,D,O,H,A,H,N,N,A,P,E,A,e,i,C,M,L,Q,M,Q,C,D,L;BT6,B6s,T,D,A,Q,I,E,W,J,A,F,N,H;BRG,B5w,H,F,P,E,E,M,I,E,K,F,C,F,F,J;Bby,B14,T,F,H,K,I,W,J,U,m,k,BC,Q,A,N,T,h,P,R,E,N,Z,F,b,Z;BO6,B0o,BC,M,N,V,w,d,Ec,D,M,v,Bs,o,f,9,Eb,T,BH,u,Cz,U,F,2,i,a,W,Z;BW4,CKk,8,BD,Bp,CH,DR,w,EV,x,B2,B7,B9,k,s,BL,ER,Bs,J,Bf,CY,Cz,BV,c,e,3,Bn,j,Eg,B5,S,B1,Bz,BC,Bf,f,Bc,Bb,Cd,U,BY,Dh,Bb,BG,7,BB,BJ,Bw,BH,j,N,Bs,Bz,Bm,4,BA,Fu,P,Cd,BA,EB,T,BV,Bq,BI,g,Cp,8,9,BO,CI,BU,8,CW,KA,CM,GA,t,BS,BU|P,j2,F,Bd,Bg,BP,f,Cr,8,N,h,CF,BC,BV,h,E1,CI,Cd,KT,ET,Dl,BE,BK,BG,Bl,Ec,CW,Eg,BD,JA,I4,Y|es,CdS,GT,S,By,EY,Fx,Bi,BR,Hk,Dc,Bg,BF,0,Bq,Dm,EK,1,Y,Bk,B4,F,B0,BB,Dr,CY,BC,y,7,BK,Hi,Br,T,BP,FW,Bg,Dq,BD,Bu,BX,b,Cv,Bk,BJ,BG,En,JR,Cr,Fe,Fb,DV,Bj,y,CD,LR,I;sO,Cza,E,N,F,J,Z,M,X,A,P,T,L,A,j,Q,H,G,E,k,K,I,C,M,U,M,Q,A,O,R,i,N,C,F,T,R,E,H,W,L;t0,CyC,D,H,C,L,h,D,Z,E,H,M,E,M,T,M,A,O,BO,l;kY,Czi,f,A,N,I,N,C,G,K,I,C,e,H,K,N,A,F;ay,C0u,H,F,E,c,W,e,I,A,N,P,F,N,C,H,y,D,H,F,z,F,J,N;bs,C0e,J,F,V,A,L,E,E,G,K,E,I,A,M,D,E,J|CQI,CIm,CP,Bg,EB,N,y,Bc,3,CO,E3,Cc,I8,z,Dc,B7,DW,m,Ci,x,F,BB,Ci,BD,x,3,Bi,BF,r,t,Dz,BO,F7,BH|1b,r0,DY,A,BS,s,EI,BT,BX,j,C5,BC,d,h,Br,P,F,j,DB,V,N,4,e,c,0,r,DK,o,C9,b,r,y|q2,G8,P,C7,DG,Y,y,Bh,B1,Dj,B8,BN,T,ER,BR,B7,1,BI,3,1,Bh,S,BT,Bi,d,Bn,Ct,D,2,ET,BP,e,BN,BT,E3,FA,B3,Da,Be,z,Cl,DI,B6,w,K,CO,Bc,9,o,e,CN,BK,8,G,H,Bc,Fo,H,C,EM,GQ,d|ek,COG,O,CN,BL,Cb,BP,q,Q,W,j,M,E,i,Z,A,Q,i,X,M,F,M,W,M,X,Q,w,y,BE,Y,i,F,K,BA,U,J,E,j;Yk,Cdg,CH,d,DP,EB,Cm,o,BM,DR,Br,BF,2,CX,CY,l,f,BR,Eb,CR,HJ,Bk,Cx,CF,g,Bl,Dz,R,LR,CQ,BF,BK,CS,G0,Bs,Bt,B7,EO,C7,Bm,d,BI,Be,M,IT,B6,BN,s,Ba,0,Br,e,K4,o,Bj,DU,HW,v,v,y,Eg,Bw,Q,CE,Cu,q,FW,Dr,CE,m,CO,CF,Ic,Bv,Bp,Ed;Dz,CYE,H,R,P,Q,T,O,F,Q,U,L,W,V;CVu,p3,N,A,H,E,F,M,E,W,L,S,K,K,I,N,S,J,D,V,H,P,A,N;C4A,BG1,d,H,V,C,p,S,b,q,Q,g,c,G,q,J,k,v,J,p;DKP,uu,D,L,F,D,J,I,h,A,H,M,Q,O,T,E,J,G,R,e,C,K,Q,G,o,Z,A,P,M,R,I,Z;DL1,0W,n,A,F,O,I,M,H,O,E,K,I,G,M,J,C,N,I,L,m,V,h,H;DMr,zo,R,L,J,E,L,Q,H,w,I,M,W,H,S,N,H,J,E,l,H,J;DLh,zQ,N,A,F,A,D,M,I,K,G,C,I,L,C,J,H,H;C0N,Hg,BW,Bk,q,Ce,BL,Be,Z,Cw,Bw,Cw,DS,BH,B8,Bl,H,j,U,S,g,d,M,BN,i,6,k,B3,CN,C1,BN,Cp,BB,l,Cd,i,BL,v,Bl,q|C5J,Ca0,F,D,P,E,G,G,E,C,I,A,C,D,A,F,D,F;C5h,CbG,R,J,H,E,K,U,N,e,G,G,O,H,C,H,H,T,K,T,D,F|JKR,rB,F,D,F,I,G,M,E,E,E,L,H,N;JQX,uN,L,A,N,C,H,K,C,G,I,D,G,J,O,F,D,F|DRR,6S,X,A,C,E,K,G,I,D,C,D,A,H|DQr,5q,F,A,D,A,F,G,C,C,O,D,F,F,D,D|H2n,1v,D,D,F,E,D,G,A,K,K,H,E,F,H,J;HxR,4n,H,F,L,E,F,E,A,G,C,G,S,A,G,F,H,N;H2b,2d,J,A,J,E,C,U,C,E,M,H,K,T,L,F;Hvr,5F,c,L,G,P,H,L,X,I,L,S,d,F,V,E,L,W,D,M,G,G,U,G,a,F,K,P,C,V;HOd,fT,e,L,I,C,J,L,f,H,L,H,N,E,J,M,e,O;HOl,gD,P,R,A,Q,E,C,G,A,E,D;HNR,h7,J,D,A,U,K,F,E,D,D,H,F,H;HR1,cv,V,F,L,A,H,Q,C,K,E,E,g,F,E,J,D,H,F,J;HR3,eb,F,D,J,M,A,E,O,G,I,D,L,T;HUP,5n,C,F,L,C,A,I,K,Q,I,G,O,I,I,C,C,D,d,P,L,T,A,D,E,D;HQN,c1,N,D,D,K,E,G,G,C,K,F,E,F,A,F,L,F;HT1,7T,E,J,H,E,P,I,D,G,S,L;HUT,6r,C,H,J,E,J,K,N,M,D,G,I,F,U,X;HFp,7z,F,H,D,E,Z,M,F,A,F,E,E,C,G,D,U,L,I,F;HH1,7L,A,F,V,S,I,A,M,P;HMz,BFT,F,F,C,G,H,K,F,C,E,E,I,J,A,L;HZt,z7,F,D,E,Q,G,C,H,R;Hct,1n,K,L,P,G,T,E,G,C,Q,D;HdJ,1p,J,D,V,M,I,A,M,J,I,D;Hh5,zL,D,J,F,I,R,U,G,A,Q,V;HjV,0r,C,F,F,A,J,K,J,U,H,G,A,S,Y,z|Ihq,BDV,DM,Br,Bg,Bn,EI,Cp,G,v,Bn,M,E9,DI,Bz,Bw,BF,B0,g,R;Isc,BK9,H,J,J,C,H,C,F,E,E,Q,S,J,C,J;IT8,BAT,D,F,D,g,G,M,E,b,H,P;It8,BHJ,K,F,Q,A,F,j,f,F,H,G,N,G,A,M,N,a,W,E,M,G,D,H,G,N;IpQ,BEx,N,D,O,S,E,q,I,D,K,H,L,H,F,L,A,N,E,D,H,N,J,J;IsA,BGR,L,D,R,O,d,I,N,M,J,Q,Q,E,Q,U,L,G,T,C,C,I,c,K,U,N,D,h,O,L,O,Z,H,V|DlK,Cib,BU,c,K,f,v,N,a,R,Cg,o,g,F,Q,Z,j,v,t,S,BV,T,u,f,k,O,c,P,n,Z,DJ,i,h,j,l,A,M,0,P,q,Q,O,X,S,M,s,i,m,Q,F,M,l,T,t,a,H;Dle,CiR,N,D,F,I,A,I,L,O,E,I,U,A,U,D,E,N,P,R,J,H;CrM,CZz,P,D,N,E,J,M,Q,I,Q,N,C,L|BCe,DIq,U,A,i,T,P,P,f,D,D,T,5,C,R,a,E,I,S,E,C,R,M,C,E,Q,R,K,G,I,O,E,U,N;BBa,DIK,C,H,J,C,H,D,F,F,J,A,F,I,G,M,Q,C,G,N;BEe,DHq,D,F,R,D,H,E,R,A,D,C,G,E,M,C,Q,A,I,H|BP6,DaS,Bf,Ba,6,By,Bv,CG,m,Bk,Jv,Dg,DI,u,Co,Bx,IK,b,FI,ES,Ia,z,CL,Dz,E4,Cp,C9,Ch,DS,Dj,Bl,Cp,DA,C3,Bv,BH,E8,Cv,MD,Hl,Pn,CT,w,m,CZ,C,Y,BI,Dr,s,i,DM,Bp,DU,Bc,B2,ME,FW,M,CA,D1,BE;BI6,DIo,P,D,V,K,D,E,I,C,H,I,C,E,Q,H,I,J,J,D,O,H,C,F;BGc,DSA,C,F,M,C,Q,G,K,D,A,L,L,C,N,L,N,D,V,K,P,Q,g,A,F,J;BJi,DIu,Y,F,K,C,O,N,X,H,A,J,I,H,C,H,V,A,L,G,F,I,X,K,K,O,K,C;BHM,DJQ,D,L,d,A,N,K,H,O,C,E,K,E,G,J,e,P;BIa,DIA,V,H,H,A,A,M,M,G,U,A,H,N;BHw,DH4,T,D,L,G,E,E,M,E,M,A,E,H,F,H;BSK,DXo,f,H,Z,E,A,M,O,G,c,E,q,L,X,D,J,J|JWo,0L,Bb,Bh,C,X,BK,u,A,t,Bp,P,t,U,n,n,9,R,X,k,V,C,Q,i,u,D,e,e,BS,U,m,a,Bc,Q;JRG,4D,BA,5,Q,BZ,CT,l,CF,k,N,s,g,Y,F,W,U,S,BC,e,BM,Q,S,N;JWj,2l,H,J,A,i,W,S,G,C,I,R,L,R,V,P;JWo,2t,P,J,H,I,G,Q,O,S,A,j;JRw,9N,A,L,b,H,P,K,b,Z,d,H,N,G,S,M,K,D,W,U,Y,I,g,J;JTZ,6B,H,D,F,A,F,E,F,G,G,E,K,H,C,H;JSp,6z,D,F,N,G,F,E,M,C,G,A,A,J;JRB,55,N,D,L,I,G,I,K,D,G,J,A,F;JTT,3t,F,J,F,E,E,K,C,G,J,G,D,E,C,C,M,H,G,H,C,D,D,H,J,F;JR7,91,D,A,F,C,H,C,A,C,C,E,E,C,C,A,F,F,C,D,C,D,E,D,A,D;JWB,9H,A,H,D,A,F,C,F,D,A,H,F,A,A,E,C,I,G,E,G,F;JNs,3V,L,D,G,Q,G,E,K,C,D,L,L,L;JUw,4D,H,F,F,a,I,A,E,D,E,J,H,N;JUi,6Z,D,D,T,Q,C,G,C,G,I,G,G,L,E,R,D,H;JS2,5N,L,F,H,M,I,O,I,A,E,N,F,L;JWb,1P,P,J,A,K,M,K,I,C,H,L,A,F;JWh,0H,J,F,A,E,G,E,G,A,F,F;JWo,1X,D,A,D,E,E,G,A,L;JNW,oX,J,D,N,C,D,E,M,C,K,A,C,D,D,F;JFU,BIB,D,D,H,C,A,E,C,C,G,D,A,F;JSf,BEr,D,A,D,C,A,C,C,A,C,D,A,D|Bzw,Rs,Bz,Dw,Ff,EK,De,CC,m,GS,F4,HG,BU,E6,DY,X,BA,CQ,Je,CZ,FC,FT,B3,Ez,Dm,E,R,Cl,Dq,D1,M4,DR,Jz,J9,EZ,N,Ff,Cz,Dl,6,EJ,Cn,LN,DQ,Cb,DS|BaO,C9k,C3,C,Dz,Bo,DH,l,q,Bi,Cd,C,1,8,i,a,z,a,M,4,Gg,Ba,IE,h,c,X,CV,B3,BI,C9,BZ,BH;BK8,DDG,BG,D,BK,h,n,D,BT,r,BL,D,t,z,f,J,D,O,o,e,BB,W,H,I,a,S,Z,W,BU,C,M,O,6,I;BL6,DDw,R,L,P,I,X,X,Z,F,P,E,N,e,BJ,Q,BS,G,m,Y,Q,P,k,H,U,h,T,A;BNS,DC2,R,D,p,O,K,K,M,E,g,H,G,P,F,H|B3y,uA,T,Cy,B2,GO,BS,A,D2,DE,Dy,JV,O,BI,EQ,Cv,GQ,GL,CZ,x,HP,Ga,Fh,H,Bx,BW,BB,CR,BB,8,CZ,n;CFS,z2,G,T,V,G,D,E,I,I,C,E,G,F;CFe,yo,I,N,K,G,E,G,g,P,D,L,BX,G,H,S,O,J,K,E,L,K,R,C,C,K,K,I,J,M,Q,D,M,J,G,J,C,V|cM,MI,i,A,I,L,A,R,z,BV,v,I,J,O,G,Y,Y,G,U,0,M,E;ki,HA,C,Dx,En,J,f,W,j,J,p,W,BW,Ci,D,BM,k,b,EW,A|EoR,ug,w,L,B8,BR,G,b,BE,c,BW,f,T,Bx,BL,b,Bp,Y,k,V,FJ,By,K,g,Bm,BG,F,e,q,G|B46,BI8,mX,A,b,eG,DW,6,KQ,Cj,Ge,Ce,Cm,N,q,Bd,Gw,u,CQ,F7,CN,Fj,FV,HI,r,BH,LC,SX,R,DN,Dw,DF|D41,X,BJ,D,BM,Bh,BB,DD,Dl,DV,FZ,Ct,CN,FF,B9,Bq,Ct,E,D,BW,BA,a,d,Bk,B4,Cm,X,Bo,T,Bj,R,o,3,BL,CH,Ba,G,D0,CA,Be,p,y,BY,Bs,C,CK,Dq,BO,I,y,Es,Dd,C6,f,s,o,DM,Bx;EKf,Jl,F,J,Z,C,E,m,G,M,c,Q,Q,A,S,N,V,T,R,H,J,Z;EGj,EC,N,A,F,I,O,M,E,C,D,X;ErZ,Cf,N,A,f,S,C,U,M,M,o,I,Q,N,A,Z,P,R,P,H;Eod,C7,Z,J,N,I,D,E,O,M,M,I,M,O,U,I,G,D,G,J,H,N,P,J,N,R;Eu7,Bf,V,F,R,I,J,K,A,W,m,E,M,N,A,V,H,J;Err,EV,J,A,N,I,I,Q,K,F,G,F,E,H,J,L;Eub,G,M,P,G,l,o,p,E,l,g,f,X,n,t,R,7,E,R,c,i,e,m,S,E,M,z,2,N,2,Z,H,L,K,W,W,a,E,S,V;EsL,BF,L,H,n,G,N,M,K,Q,I,G,W,H,Y,T,F,L|Dth,6M,C,8,x,0,0,a,P,0,g,i,b,By,s,k,FK,v,s,BN,Bo,H,BR,f,DC,t,BG,7,BJ,BT,B3,u,Fr,j,BV,CD,BF,BS|DLr,xM,V,F,J,i,N,a,E,U,c,J,I,N,G,h,H,Z|CPg,lG,BF,Bn,BL,Q,B7,d,h,I,D,CS,CI,Cq,y,d,i,w,y,S,u,BH,G,5,CZ,Bt,Z,C,M,P,Be,S,q,T|Bin,EVi,NY,9,UH,5,WS,k,Lm,Bz,bB,Bx,cQ,Z,Gb,Dt,LQ,Cw,ac,h,RN,C7,Co,d,Bx,l,Lz,x,Du,Cr,G5,Br,B7,DF,HO,C,D1,V,Hi,CR,Nx,x,I2,Bz,BE,DD,It,N,EA,L,a,BZ,C0,BG,CS,CF,J3,L,GU,Bb,3,BR,Fh,n,KP,B2,CY,BB,I9,BT,LE,2,Gu,Bl,z,Cl,Hj,C8,Gj,BD,F8,k,W,BR,Bn,Z,Kc,CH,Br,BL,CW,U,u,DF,Cx,P,N,BS,C3,BV,D9,Ce,IL,BU,Ek,BL,Iz,5,BW,f,Dh,BT,IQ,J,Cz,BV,F8,BK,Ks,x,Nx,En,Oh,CB,EX,BO,i,Bd,H9,FD,EB,C,w,9,G1,Bx,Bg,CS,C1,S,BU,b,Cf,z,BC,9,GX,f,B4,t,E3,9,C6,Bz,Eh,l,DG,j,O,BT,Ct,CL,Ch,e,Bu,x,5,v,DV,F,Ci,f,I,CT,Bj,d,Bd,D3,C1,Q,Ck,Bv,Cj,x,Bn,U,m,BI,Dv,P,CA,Be,EL,J,k,B6,Hd,Bd,BU,u,E5,B4,Be,Bk,Ez,BQ,Bs,B0,B7,t,Dv,D0,EK,o,Er,A,FI,Bk,Ct,Bm,w,BT,D3,B3,CB,Dk,Eq,Bc,Et,BD,Ct,B4,HA,Cq,Ht,CX,m,Bm,DU,u,EN,W,X,BY,KS,W,KH,E,B4,CI,GY,k,HJ,T,BG,BA,GK,D,BE,m,Bd,L,i,BQ,Cg,I,Ch,I,Cc,Co,Nl,CK,Ma,9,Dh,B8,Ca,D,Gx,BA,EU,BM,FX,V,8,u,Bp,Bw,m,Bh,Bn,BZ,FR,S,Ca,Cm,Cd,S,Cw,BW,DB,c,BO,BC,Cn,u,0,o,BR,BM,DP,A,DI,BS,Hd,Co,K,BG,PZ,CI,QP,1,Dv,BA,Ea,y,Jz,BW,Pu,Bc,J7,L,LN,CU,Wi,DK,FU,DA,Jt,k,Im,CU,J6,a,w,CA,Ce,i,MS,Bz,Ij,CA,PO,BM,C0,n,W,Bp,Bu,CK,LO,BT,Er,Bu,DE,C,RI,CP,BS,CO,D9,4,Ng,A,Qf,o,1U,B8;CuH,Dnm,CM,b,e,r,F9,BH,BZ,c,Bq,O,h,O,Dj,i,a,w,Bg,D,Bp,m,Be,m,Dc,X,B0,3;Coj,DmW,h,H,N,G,X,k,E,O,H,K,0,O,BU,P,v,T,N,V,A,R,J,H;Cwt,DrK,T,D,3,M,N,I,C,G,y,Y,Y,E,c,X,C,J,H,P,R,J;C1f,Dwy,Bx,v,CF,g,s,M,Bg,A,BA,M,m,L;DtN,EBc,BJ,D,Bh,O,K,M,BI,E,CI,R,x,N;CUt,EQw,GH,2,B7,y,DE,S,Ew,r,i,R,X,BD;BUD,Dqw,G,3,Cp,p,BP,U,Ep,N,BW,BW,DO,H,Ck,g,BQ,Z;8N,EQC,BN,F,Bz,g,F,S,8,I,Bm,j,e,V;4z,EJg,BZ,Z,CB,C,Bj,a,B4,g,De,E,O,T,r,X;9T,EDg,b,H,j,y,D,e,o,Q,U,E,O,F,D,r,O,V,Z,d;77,D7S,Z,F,BR,BU,G,0,k,C,e,N,e,B7;6F,D5Q,W,r,BQ,L,W,X,EJ,J,t,O,G,y,s,O,m,N,Bc,Q;55,ECc,p,A,P,G,BC,m,s,A,I,R,T,P,t,P;B5d,DZY,h,A,L,Q,E,S,i,E,U,N,J,R,J,L;CZR,DKE,X,Z,Z,G,L,K,x,E,A,E,B2,g,N,h;Cqt,Dqk,Bb,C,H,G,I,O,c,C,BK,X,P,D|VX,DNY,F,J,H,A,j,O,J,M,S,A,a,J,G,H,C,F;Vn,DMM,E,H,T,I,Z,Q,J,O,A,G,E,A,G,H,c,H,A,H,I,J,A,N;XN,DOc,Y,P,L,F,b,A,b,E,J,O,k,C,K,D;VZ,DOu,H,d,h,K,F,F,Y,b,D,J,5,c,h,o,q,G,BE,T;Ur,DO0,J,P,T,E,F,C,C,M,A,Q,Q,P,M,H|oi,C38,F,b,v,P,V,Z,i,R,E,V,BD,V,J,BN,n,L,r,BW,BL,C,Z,a,L,2,d,Y,BG,G,e,m,g,E,O,L,D,l,a,H,W,o,N,O,BI,e,BK,N,D,3;fa,C02,Dd,O,L,Bq,Bl,k,G,DQ,Bo,X,s,w,BA,J,K,BA,d,G,BH,BB,9,P,p,g,BI,6,Cm,M,Bs,BU,CG,g,j,l,Q,BD,t,x,F,BP,CG,l,l,p,BZ,H,d,BH,5,H,Y,R,BZ,3,Q,t,t,v,4,P,C,d;iW,C3Y,i,7,H,n,j,R,l,A,Bd,W,b,o,A,g,BY,S,s,L,c,K;ko,C1E,k,N,o,F,G,b,BB,L,BX,c,E,i,o,C,U,N;im,C0m,J,A,P,U,w,o,O,W,E,A,H,V,n,BB;oe,C1U,J,F,f,C,l,P,N,E,I,M,U,K,C,I,I,F,g,F,Q,L;o2,C3W,V,L,F,C,H,K,K,I,G,G,E,A,G,H,E,L;hy,C06,N,D,R,E,d,U,8,V,F,D;gc,C1E,V,F,N,G,T,C,J,e,C,C,K,D,i,P,M,V;iO,C36,F,D,N,C,D,O,E,M,F,K,G,G,S,R,E,H,H,L,F,L;jo,C8q,J,F,d,G,M,K,g,E,Q,D,Z,P;wq,C1e,J,F,h,G,r,O,G,c,M,M,BK,h,C,L,L,P|8u,Cjs,GF,C7,GV,BS,9,BT,Bn,F,E3,Cq,B5,C2,JW,CS,Ea,BR,f,p,BY,BD,w,BE,Co,Z,Do,Cl|Bvq,BzI,Br,P,V,g,Bf,P,r,Q,i,C,M,q,CK,J,DE,BA,CB,BN,H,T,S,b|Brg,Bzc,q,R,Be,O,U,h,BQ,S,k,V,BJ,F,7,t,Bh,j,P,Q,BX,O,b,s,F,a,BU,S|EQB,BMs,Gg,3,SS,Ix,Lh,BB,Bk,Cg,C3,Y,B9,Cq,KF,CA,C,Be,J1,Cn,Cu,Cm,HG,Bk;ECj,BIy,J,H,L,K,N,E,R,K,F,K,e,D,c,H,J,V;EDt,BJ4,F,F,L,I,R,C,L,M,J,E,A,E,O,E,K,D,M,J,G,R,G,F;EFp,BKu,c,F,c,C,O,R,X,D,h,C,Z,K,H,E,O,E;EDP,BJY,H,D,V,K,H,G,G,K,C,K,C,A,E,N,Q,H,K,N,J,F;ESV,BHk,7,b,X,A,X,G,X,Y,A,G,a,P,Q,I,X,o,S,e,4,L,Q,Z,O,p;EH9,BLG,A,F,j,O,X,U,K,A,u,f|ry,CW0,Fq,L,2,CQ,CS,BK,Ey,CZ,Di,c,S,Bt,BS,r,Bf,BD,Gh,BU,CD,3,Bn,i,L,BV,F8,F5,CP,Bc,C7,a,Cl,CG,4,U,C9,DU,CP,Bf,5,CM;1s,COs,Ba,J,U,J,r,C,b,H,f,G,L,O;3c,CPI,Bp,D,9,S,c,E,c,F,I,J,Bk,J;2K,CPk,h,A,d,E,P,G,G,O,BO,J,M,J,V,J;xI,CSI,E,H,b,M,L,K,A,E,g,V;vw,CVG,Z,F,N,G,F,I,V,C,P,M,Q,K,K,O,w,x;v0,CUY,G,L,V,I,R,E,F,G,G,K,M,D,C,F,O,N;xA,CTC,H,H,z,k,H,K,d,g,g,T,BG,1,L,D;xA,CRq,C,F,N,C,z,s,F,I,Q,L,w,p;xk,CR0,O,P,P,C,N,K,J,K,U,J;uu,CUE,D,J,N,K,X,u,D,I,I,I,A,I,L,Y,I,E,G,C,G,d,Q,N,F,V,I,r;4y,CN8,a,P,BT,S,S,C,k,H;7e,CNS,Q,b,CR,BM,Cf,q,i,E,Bm,l,L,K,a,A,CE,BH|J9,Qi,F,J,d,E,I,I,Y,F;Zx,gw,Bk,4,Bi,9,Cc,B2,c,Br,By,w,DA,CX,Ei,m,Bq,BX,m,EH,CX,FD,BW,E1,BP,o,f,t,GP,Q,s,R,IB,Ch,S,Ey,Dt,CK,8,Bg,n,B2,Bi,Bq,v,BO,By,L,Bf,Dg,e,CI|ESV,e4,BP,b,A,BR,q,d,9,B3,e,3,BV,B4,l,K,k,9,BB,O,b,a,Y,m,b,BI,Ct,BW,b,BE,BD,s,v,c,BM,Bb,t,x,Bp,BC,v,BQ,k,Be,x,e,BE,6,CK,x,By,G,BY,x,4,k,6,B7,Ci,CZ|BlM,ab,F9,9,Bn,CX,Q,IX,B2,Bv,CY,m,F,EJ,CL,I,GT,F2,Dp,BB,CZ,CM,C7,r,BV,Bw,Fd,BD,Bn,Mg,GJ,BC,Bv,DL,Fr,b,Dt,HG,Nn,c,CA,DS,E6,Ba,BI,B3,EI,Dk,u,FI,E6,FQ,Co,Pg,Bm,CC,CA,u,Cy,CJ,GA,BF,Ba,B4,Ns,Bi,De,Cv,Ey,w,D6,Dp,j,DP,Bu,BB,ET,ET,BL,HJ,CV,Db,CM,Md,D4,GF|j4,Mp,Ca,y,3,ES,Cs,C,c,Bm,BS,Bj,CY,i,0,BJ,BQ,B6,S,EQ,B9,BM,B0,Di,z,Bg,DH,Z,O,C6,I6,Bj,Bw,F4,GG,S,Cb,NZ,E7,FR,BJ,Fp,Dv,DF,BJ,B2,DF,Bv,B9,BU,Ch,B1,C3,De|CTe,m9,K,d,A,V,H,J,J,E,R,S,h,Q,g,A,G,Q,I,E,G,D;CRQ,nt,O,N,p,G,H,K,A,I,O,D,S,L;CQO,mZ,F,D,f,O,P,S,G,BC,I,M,I,A,K,J,D,p,W,z,F,J|DsF,mQ,Eb,DT,CN,FV,B0,R,Ci,Gt,GE,R,CQ,Cr,GS,M,BP,FZ,Bw,Dh,Bx,CD,CG,BT,BE,DV,Br,Cc,H5,BV,A,CH,CQ,BT,C5,R,CG,Ft,B1,J1,Cf,Be,CE,Dm,Cz,Bc,GX,l,GB,HE,IZ,B4,FR,D8,GS,HY,Bb,8,e,Ho,Bt,CG,CQ,CY,n,CK,B6,CT,b,CE,EI,C0,P,CO,Cy,DI,Ba,BH,0,Bw,Cq,F,FK,Dm,Bc,R,N,Bj;ED9,IM,H,F,L,I,F,K,G,I,I,F,E,H,C,N|GJO,BRC,H,N,N,C,A,I,D,C,C,I,C,C,O,H,C,F;GVG,Bnk,R,H,1,S,l,S,b,i,y,L,G,P,S,L,u,T,K,N;GWg,Bio,F,F,Z,M,d,C,J,K,D,Q,c,A,i,P,I,J,F,P;GWG,Bhu,A,F,T,O,J,C,E,G,M,C,K,V;GW0,Bia,D,J,F,A,J,Q,E,G,K,D,A,N;GOg,BUI,P,L,L,E,A,M,E,M,F,I,E,K,M,C,M,N,A,H,H,L,E,H,D,F;FuG,BGC,G,H,U,E,E,N,J,L,R,I,d,D,F,G,K,I,Q,E;GTI,Bcm,T,H,H,A,A,Q,Q,M,E,F,E,H,A,N;F4U,BLi,A,J,P,O,H,A,H,G,H,I,M,A,M,L,I,L;F10,BHq,F,F,H,I,D,K,F,G,K,G,E,I,M,D,E,D,N,N,D,T;F1W,BHy,T,F,F,A,G,K,S,I,D,P;FmS,BHY,EP,Bg,Y,Ck,E1,B0,EV,Cn,HN,L,E,ET,CH,B6,DB,5,v,Bw,Cb,Y,BG,Cm,CH,u,F,DA,EJ,r,0,EU,Cs,B8,D,Fg,DN,DA,Ed,T,8,BI,Bv,CO,CH,BV,Cf,2,Ih,FH,Gt,By,DR,DJ,3,Ce,If,l,Mv,Hy,DB,7,Hl,EE,BN,D6,Cq,F,z,Fy,CP,BI,x,Cq,GB,BE,BH,Cs,Et,Bk,CY,y,5,DQ,DX,q,j,Cs,D4,DU,Ew,b,B4,CK,D4,M,G0,DG,P,CC,CA,Bk,BB,FA,B9,i,Ii,y,p,Be,CS,FK,H4,b,q,EC,D2,Cg,C8,O,i,B7,Hg,C1,CU,Dl,f,Eb,Oa,C9,DW,FD,Qe,l,LO,DD,Re,Dw,E6,DC,Bt,CI,Bm,CO,Fc,BB,Ma,F6,H0,Q,Eb,EO,IZ,7,BN,Ba,Ds,Fc,D0,BB,Ee,By,Ey,Gi,CT,CA,DE,By,Ic,2,Gk,Bp,GI,Kd,Jq,DD,Bc,Dx,L0,By,Q,Bt,FT,IX,EF,o,Cz,Bl,4,Et,CX,Ct,CD,Be,p,Bx,FV,Bf,U,B7,En,BE,H5,Fz,KD,D1,CI,CI,Bx,e,DM,DG,BZ,Bg,JN,Fx,D3,L,Z,CT,EI,BP,BI,C5,Es,CO,GM,BZ,BF,B1,G9,CD,DR,EX,Di,B3,B2,FN,DK,Cd,Fx,I,CM,I,Dk,C9,FT,Cp,GG,BN,B1,BR,Be,C,Br,BL,g,Ct,Cx,5,CT,Ed,Bd,e,6,Bd,CZ,r,Bi,Z,A,B9,Fv,C9,s,t,FJ,EN,H5,Bb,Bn,B4,G,Cz,KJ,C3,P,DZ,Bf,O,K,Dm,BL,q,BX,1,CL,Bg,Bp,BR;Fvs,BCe,Y,BF,BN,BN,n,Bv,BP,9,Bx,v,Cp,BC,H,Cc,B8,Be,V,C,Q,W,C6,i,BW,P,M,g,w,f|F4E,BJm,A,E,C,E,I,C,E,H,P,F|F5y,BKm,U,K,e,F,E,J,D,J,K,F,C,J,L,H,F,P,x,Q,T,F,J,O,W,K,C,G;F6e,BJo,F,D,P,O,D,E,M,C,M,J,D,H,D,F;F5u,BJo,Z,A,H,C,D,E,I,I,g,K,J,L,A,P|Fqh,BZj,f,H,A,K,I,K,i,H,N,J;EGN,Buj,n,D,C,E,U,M,U,H,C,F,A,D,H,D;DpL,7N,C6,Cs,BW,Bv,D4,PZ,Cy,l,BJ,DV,D3,CV,w,HL,EV,Ep,l,Fr,CN,DL,CK,J5,CT,DV,g,Cn,Cj,Ch,BG,Ff,Cz,Dj,H,Hx,BR,Bt,BC,Fz,CI,l,C5,r,CS,Bf,BJ,El,C7,G5,DJ,Cj,BY,Dv,Cm,M,P,Cx,Ba,BX,LU,BF,Hj,Bj,Bn,Dl,Dl,Bs,CA,b,By,CK,ER,CH,Bn,s,BC,Bi,D6,e,D3,O,BV,Bt,Bt,u,Bs,BI,C3,f,7,Bq,Fu,d,F,Bw,CD,0,B0,BJ,C9,x,CN,BK,0,BU,Dt,B4,Bc,BC,Cq,B3,g,Bc,BF,BH,CH,CE,Ci,B2,T,B4,Bb,BP,BK,DA,B1,Bg,D0,f,BF,Bk,DB,J,Bq,W,BJ,g,i,CE,Eh,Q,Fo,EO,BZ,Cp,CG,BU,X,Cd,Y,Dg,Ck,G,Bh,BI,CU,Bo,B5,BW,Bm,GK,BK,b,BV,Bi,Bm,BU,El,x,x,Ce,Ca,Fo,BZ,GE,Eo,HO,Ce,H2,P,MC,Cy,IY,M,J4,Bm,Fs,BF,KI;DjZ,Ct1,F,HH,Kf,y,U,i,DO,U,U,h,BQ,J,Bx,BW,D,u,BG,y,e,BL,z,F,S,b,BM,x,BY,O,Bk,z,q,e,DF,8,h,s,M,i,CW,8,DJ,I,X,6,BA,e,z,m,Ba,P,Bs,BE,w,l,Bu,E;DeZ,C15,1,d,f,W,5,R,9,I,v,w,m,K,Cw,L,c,R,G,T;Dz9,CP1,BH,D,5,a,k,BI,I,B8,U,g,G,BA,Bo,V,W,7,X,Z,M,h,BD,Z,BI,BJ,V,b,r,T,F,n;D2R,Cij,J,Bh,M,P,b,BD,j,A,Z,4,g,BA,x,X,X,BD,Bj,M,G,i,k,D,G,c,h,a,c,S,w,A,A,Q,Z,I,0,m,H,c,Q,S,BI,J,O,BP;D5l,ChT,X,A,H,i,a,0,C,U,L,g,i,K,u,BV,A,n,BJ,d;D19,Cut,CY,f,Bo,5,BZ,I,9,q,BT,E,Bb,BE,BC,j;D2j,Cgv,BJ,J,T,S,J,e,h,y,J,W,K,M,s,K,Q,Q,O,D,F,j,Y,X,W,r,K,z;DxP,Cwh,I,V,BS,D,2,t,p,n,Bf,b,T,M,k,Y,E,S,5,G,J,j,b,C,T,K,D,q,h,D,j,i,r,E,g,Y,w,E,BI,V,K,Y,a,T;D3X,Cqj,I,n,a,L,W,V,b,n,F,Z,h,C,j,u,T,y,U,O,S,F,C,S,S,E;Dm1,C1L,Ck,V,Ba,M,M,R,r,Z,BE,V,L,P,w,f,I,h,7,a,Bt,M,F,q,9,O,X,A,N,b,k,j,v,G,x,Y,D,S,BD,Q,U,2,k,J;DsT,CyT,BM,R,E,d,d,Z,BF,c,7,A,n,P,F,S,x,g,M,W,e,M,B8,f;Dz3,CTN,x,V,F,V,i,z,U,5,F,f,V,P,z,C,C,a,X,M,BX,Bk,c,O,F,W,BS,Q,E,o,S,K,S,C,o,d,J,Z;Dxd,CUd,x,R,Z,G,L,M,L,a,i,e,E,c,K,E,k,L,y,b,E,J,v,v;D4F,CUz,H,F,H,C,F,G,F,K,G,E,G,A,G,F,E,L,D,F;D45,Cnf,H,T,R,C,H,E,D,M,H,G,M,Y,D,K,BA,H,R,P,T,F,D,R;D4T,Chj,D,R,d,f,b,T,Z,P,P,A,N,G,e,Y,F,O,b,O,M,Q,Be,S,C,P;D4T,CeV,R,D,A,G,P,M,i,O,S,A,O,H,C,J,b,J,N,J;D23,CQr,d,F,H,G,A,G,E,E,O,C,K,D,G,H,A,H;Dzh,CUl,N,D,H,G,D,K,T,U,A,I,I,K,S,C,K,N,E,d,D,P;D2h,Cpb,A,R,N,J,X,G,Z,N,p,G,V,Z,d,X,D,O,e,4,W,J,8,W,a,A,K,P;D4H,CmR,p,R,N,I,d,A,Y,BE,Bc,V,I,T,r,V;D0H,CRZ,E,L,X,A,N,J,l,K,A,K,i,A,W,I,K,L;D1L,Crh,H,D,j,I,R,K,N,Y,Y,F,Q,N,e,N,C,F,F,J;D1t,CXZ,N,L,V,F,T,I,Z,F,D,Q,o,u,D,c,Q,S,W,G,E,X,H,l,S,f,D,J,P,J;DgB,C4T,z,G,F,E,S,E,w,D,C,D,P,L;Dcb,C2L,R,J,N,A,F,E,D,E,I,I,Q,E,Q,F,H,J;DrB,C1B,M,P,a,H,BO,M,c,h,F,J,l,P,Z,U,BH,E,1,i,n,J,L,I,O,M,BO,J;DfF,C37,J,A,N,G,j,G,A,C,K,K,M,E,K,K,G,A,W,f,H,J|BPW,BA4,D,MN,DX,n,Dj,I1,Bq,b,Bo,Fn,Dh,5,En,E3,Ed,n,BT,C3,J7,Bt,E1,HA,FY,BC,Cl,IC,Eh,GE,Gg,IK,Bk,LG,Ch,Dw,p,Ew,DO,Bc,Zy,Mv|BP4,b8,Ke,Lf,GD,o,In,B5,Bb,B5,Jb,DO,C7,Ch,E,Cz,Gd,G,BZ,EB,Er,Hg,7,Ey,DW,Em,J6,Bs,BE,Cs,Fm,BU,Ei,E4,Co,U,Ci,Dj,X,DP,B8,f|BTN,2q,V,F,J,C,H,e,u,U,Q,D,K,T,J,J,f,V;BNn,wa,N,T,d,A,P,I,R,Y,I,y,I,D,C,L,g,b,U,b;BST,2Q,R,H,L,C,P,G,E,I,Q,I,K,C,K,P,A,H;BL7,0Y,S,F,Q,A,M,L,C,N,H,P,X,L,N,A,R,M,I,U,A,S;BQb,v6,R,J,L,C,L,I,H,M,E,K,W,M,M,F,G,T,D,P;BPt,1m,M,L,N,D,f,I,J,F,J,T,R,a,E,M,W,J,k,F;BL1,1u,H,L,J,O,F,E,D,W,M,G,G,A,A,X,C,P;BMx,w0,H,D,J,K,A,Q,I,M,O,A,E,L,A,V,N,H|G37,Cym,U,N,0,G,a,d,D,X,BP,h,G,J,BG,G,Q,k,F,i,Be,W,t,BZ,J,BF,R,X,Bp,R,v,Y,M,M,0,H,BX,i,p,2,L,u,K,e,BQ,H;G1B,Cvm,U,V,E,l,BH,J,Bo,l,b,Z,g,h,i,A,N,Z,k,D,E,P,V,P,DF,CC,T,e,Y,O,BV,c,CI,S,c,H;GmV,CnW,Fi,BD,CG,Cj,Cq,BB,CU,Cd,7,d,Er,BQ,q,Bm,CX,1,BT,Bc,B9,E,BW,y,DL,q,d,0,B9,D,L,BC,BW,L,E,k,B5,R,7,o,BY,g,CU,t;Gvd,C4S,Fx,CQ,FH,F2,Gt,Ec,GV,C3,FT,Eo,GN,J,A,eK,Sg,DJ,CH,BY,E0,B0,Bs,j,7,1,O6,Cw,KL,Cv,Bp,Br,Ei,CO,Co,t,G0,Bu,Dw,Bo,BB,BA,HS,D1,Dw,Ce,s,Cj,IY,Ba,ZG,Eh,Ev,Bn,8,R,QU,i,Gs,CX,Bp,j,EA,CP,Bl,By,B4,R,Cl,DC,HI,Ce,Jl,7,BM,8,HE,BC,FY,Cx,HA,BD,Mm,O,t,0,Dy,Bd,BA,k,E3,By,EA,c,DK,n,7,3,Ca,q,BT,CZ,DE,Bn,DP,I,CC,BZ,z,BC,Cg,BC,p,Cc,Ge,B6,BT,BO,Cb,p,Dc,CM,Jv,CW,CK,BG,CL,0,U,BY,F6,Ca,J0,F1,Cd,M,BG,p,C7,BN,H8,r,Cp,j,DM,DT,DI,DM,EA,Bd,q,Bp,Bj,BJ,DE,Cf,Ck,8,Cy,D0,Co,U,CF,De,KI,r,BP,f,Ea,9,B3,BB,CS,d,EN,7,EE,DF,l,BZ,GR,CR,Ff,Bu,EA,CR,JL,BA,Ca,BT,Ez,Ch,M1,B8,OM,Cb,Df,DT,GP,J,Cf,Bz,JV,B0,Jo,Cv,P,BF,FH,f,BW,v,B9,J,E,BP,CN,m,8,d,F9,Fj,p,En,CC,Cf,q,Ba,DC,D,Ca,Ej,BN,BT,HI,8,P0,FP,BA,Br,Jm,D,By,JN,Dw,Bf,s,BN,BV,1,Ca,e,Ca,Br,BH,B4,BQ,2,BS,BX,Bc,Da,Bx,Fm,CT,CK,GO,CA,EC,D4,BL,EE,FP,C2,D6,Ea,BB,Cm,B3,D,CK,CY,CB,CU,Cc,6,I0,Bd,C8,BI,HY,EP,GS,f,p,DB,DL,L,C8,X,BQ,CB,Cn,Bv,Fs,F,E,B3,CN,1,DS,B4,BG,Bn,EQ,Ck,BK,BL,Bq,DW,Ba,R,BR,BQ,DA,Bk,3,1,EW,Cp,Bx,d,Di,BP,CL,BH,DE,c,CL,Bf,EM,V,Bv,BX,Dw,Bj,J,BF,Dp,Y,G8,DT,5,CV,Cw,y,BC,b,BT,BN,B2,BQ,GA,B9,Jr,DD,O,BP,Hu,Cq,BP,U,C2,J,S,CP,EY,A,i,Cr,Br,V,CG,BJ,EP,CX,E7,h,FF,DZ,Ut,J,KP,Gf,EX,0,EA,BL,Ez,EN,J1,EH,BI,l,JN,Fj,Gj,L,n,Ch,Lx,Dn,Bf,Be,DQ,Em,BV,Fu,FL,D0,Np,Fq,KJ,x,KB,CM,Bv,CC,A,BP,BcF,D,X,CQ,Ct,R,Bc,Q,z,Be,Bd,BN,Bn,y,R,Cu,D9,BN,BZ,By,D1,S,DS,Bw,DT,r,T,CQ,Dg,b,Bj,BS,i,BO,Df,DZ,K,Dm,Dn,CA,EA,1,Cb,4,e,BA,DV,B9,Ch,Bg,CS,Bo,Cl,m,Cy,DW,Bl,BT,E,Cq;FsR,EFs,Bg,5,Mt,J,Hw,BU,Da,T;FuV,ED6,Cs,J,ED,v,CU,P,L,x,Fp,l,D5,m,Z,4,JG,6;GAv,EBi,Ch,t,Bq,p,Bb,J,8,n,EJ,BZ,Cd,a,W,BS,Dl,CL,B5,m,K,BF,BP,d,DD,BC,Gn,L,MS,Dy,La,K;FnV,D7W,JE,BL,B9,B9,Uv,CL,GB,y,Ky,By,VN,I,H6,BU,Gh,J,HA,0,FZ,M,GE,q,DZ,a,Cq,o,TE,DN,D7,C2,Ew,BW,Bu,Cd;F7b,DwK,Eq,BU,Fy,7,BV,BV,FY,CM,HG,EX,Bm,0,DB,EE,Fq,K,Da,BV,DU,D5,Z,Br,Lm,ED,IJ,d,BA,Bh,ES,F,Dl,BL,MJ,CA,JF,Cd,Ld,p,CL,CU,JH,s,CP,CC,R8,0,TP,BC,Cj,BG,J6,Bq,L5,2,CA,Ce,Fy,Bq,Hm,y,BB,CT;GOR,D1E,HM,Y,G0,CX,Lh,Cp,D7,Bh,Bb,CR,HL,BV,Jt,C0,Gm,Fw,C5,B2,KU,o,Fq,Bb;DmL,ETy,as,CN,YJ,DZ,Mm,o,Xf,Eb,E0,L,Cr,BB,Rx,z,Ho,Bf,NF,G,NY,BL,Gb,r,D8,l,JH,BP,Bj,B3,Lh,P,NG,Bd,JD,CN,Fl,Bw,8,z,Xr,E,DQ,B2,Fo,W,D5,B6,LY,BV,GG,CA,HT,Bl,CP,BY,ES,y,CP,M,a,6,Cn,BX,GV,O,CY,B4,QU,q,Il,E,Cq,K,JL,Ck,R,BU,Ta,CH,BK,M,JR,CG,Tw,Bu,GB,S,F4,Bi,NT,Ch,NX,b,Ev,W,Ku,Bq,OR,Bl,FB,y,N6,BO,PH,1,BL,S,Hq,BU,NL,W,Va,BG,FH,w,Fi,u,Rq,B7,Jx,Bw,L6,4,Dr,0,Mg,BT,Ba,O,FB,BS,Ym,C;E8B,EC6,Hk,b,CT,r,G7,G,7,e,Ck,g;E1v,D4C,H,BL,DH,H,Gr,BQ,CG,BU,Dc,m,DI,r,BU,5,J,X;FMl,D0i,JU,h,Br,7,BK,X,Dv,BZ,GG,1,O,3,BF,X,m,Bl,DJ,p,CZ,s,Y,BV,DJ,P,El,Cg,G1,B8,Bo,BC,DA,BL,Dq,m,BV,6,CS,C,Fd,4,DO,J,Bh,BC,DM,k;EZ7,DYg,BW,o,H4,Cp,BM,BZ,r,n,Da,O,B0,7,Cj,BH,HR,CM,Gv,DT,BP,B2,Ej,V,DA,Bu,Z,BY,By,EE,B0,H,BC,Bv;FFL,D8q,i,BL,BL,BJ,Bi,T,O,z,Bv,A,s,3,BV,K,Q,f,HP,J,z,k,BE,M,B3,U,E8,BI,Lp,V,CI,4,Dw,R,C5,4,BA,g,B3,I,BI,i,GM,Bt,k,I,BX,g,B0,G,EX,BE,Gc,D,b,c,BA,Q,DQ,t;FXp,EH2,Cu,Bb,C0,o,Fc,BJ,DQ,CX,DH,r,Dl,BS,LH,U,Bl,u,FQ,s,HJ,BM,G6,q;Ewb,ENs,Jw,DH,D0,o,z,3,DC,r,BD,BB,HS,9,IV,B7,BX,BC,M,Bf,Cd,I,R,BR,D7,BW,Bw,Bb,GN,E,I5,Cg,JQ,BS,MR,R,CD,a,ES,BC,Et,P,C7,Bg,IG,K,G3,a,Cs,K,BP,BI,Gc,h,EV,Ba,Gi,a,DD,q,HY,r;E4L,EAG,De,h,BD,9,HK,u,Gi,BP,G3,R,IC,Cf,V0,BO,IC,BP,CV,BX,DK,X,IN,Bd,FH,BY,C7,BR,W1,c,C1,B8,o,B4,C5,Bm,HD,T,FR,Bk,Ia,g;FAV,EFU,EI,d,BV,h,BS,f,Gp,3,CL,4,CU,M,Dl,k,3,e,0,Q,5,m,DG,G,Dy,z;E0j,D1O,JG,7,Ft,Dn,Gv,C,CK,BD,B7,Bb,DZ,G,BV,Cu,H,Co,DA,J,BZ,s,g,g,Fy,Y;FEV,Dmo,HA,Cn,ET,BN,Jj,B0,Da,4,L,0,Bo,X,1,q,s,g,CE,n;DLJ,CYM,w,I,j,V,O,J,Z,T,G,L,BC,K,4,s,3,D,BY,BI,O,X,BK,J,N,d,U,L,Bz,BD,5,N,B9,F,j,e,L,s,S,u,Bu,CC,BO,q,Q,D,Q,v,h,Bn,CB,BF;Deh,CVs,CN,By,D,EW,En,BO,FR,HF,MZ,3,Ng,Gi,Fe,EU,Ko,C4,DE,j,BC,Bx,DR,Bt,Ep,A,Gc,9,CB,CB,Bk,J,6,Cp,Fw,B5,Ci,s,DA,B3,Kh,CZ,D1,DV,CH,6,I,CO,Iw,Cw,E1,D,By,Bk,BD,W,ED,CX,EB,L;C25,CqQ,B1,r,u,9,DT,El,CE,Bm,CM,b,CF,BL,C6,X,Z,BZ,Cu,Bc,C0,r,Bv,Bt,Bc,b,BT,3,De,w,Ct,B9,u,D,t,t,m,d,Ck,Be,9,B7,BQ,0,a,t,BX,Cz,Br,J,D,Bo,B1,3,BC,By,BH,BW,9,Bf,EN,Bt,DQ,Ci,Od,H,R,8,DQ,B4,Ct,I,Bc,I,BC,Bi,BU,T,t,BS,BW,U,d,q,C2,EO,DQ,By,B0,H;EfV,DrE,Fs,E,Y,B6,D5,BK,FQ,K,Eb,CM,Ee,Q,D1,BA,MY,B4,ES,DB,DF,Bf,CA,c,BD,Bv,Di,Bu,EA,B1,X,Bg,Dy,j,C5,BQ,E6,e,F2,BT,Cv,B7,FU,BC,DB,BF,Bm,H,9,Bf,Do,Bw,BF,BN,IQ,Y,Bc,x,Ep,Bd,GU,s,D7,CB,B8,O,f,BN,EW,CQ,FG,t,FD,B1,HG,w,CK,Br,Gp,z,IS,z,Ih,BT,Ia,BV,r,BP,CS,q,BD,BZ,B4,s,Bu,BT,BW,BM,Do,Bh,CZ,z,FA,R,CJ,BX,FG,u,Co,BT,ED,x,By,BN,CD,F,J,BP,Cl,q,f,C9,Fx,Cq,DE,By,Ed,BD,Dv,CC,C3,h,Bs,Bv,Eh,2,Gm,Ed,EG,T,BK,7,Bp,f,Dw,B3,z,Bf,Bt,Bo,Bq,Ct,Bb,7,I9,Di,i,BB,D1,4,Jc,Ez,BH,BH,QP,D2,CF,BI,B8,g,Dn,w,Cf,Cc,Ej,y,D,BF,HB,1,EP,BO,Cs,Cq,GE,B9,BJ,Be,HQ,m,Cz,CM,HG,De,FR,Eq,B1,Z,BZ,Bk,Fn,BN,DC,Bo,LD,Ee,BH,p,B6,t,5,z,IR,g,CW,BL,Pr,BA,CB,BY,E1,t,FD,Cm,He,L,IP,BU,BH,Bs,EQ,Eq,L6,BO,FX,DT,Bc,Cx,D2,Bx,FF,BH;DNX,CiW,EB,a,Er,CK,BK,K,EG,v,DW,BZ,Y,d,V,L;DT1,CZ4,a,S,Bw,d,Dk,A,Bp,t,K,p,BD,H,t,U,a,K,j,U,Q,U,v,h,BL,K,n,m,BJ,G,H,i,1,S,BU,BM,V,5,4,BB;EQh,DRE,I,Z,f,l,C7,Bb,CN,L,r,2,Bs,Bg,Ec,K;EIn,DPU,q,Z,O,V,L,h,BJ,BR,f,L,Bd,u,C,6,w,u,e,M,BC,C;D6J,DiY,B6,f,D,Bv,X,j,B3,l,C7,J,BB,G,t,w,T,o,Q,c,Bk,BO,Da,S;EIl,Dzk,Hg,f,Dm,CB,LB,Z,Bb,U,x,BK,B7,W,R,BG,EQ,F;EMb,CuK,BN,G,DD,2,m,c,CS,E,BM,7,I,j;EGT,C5I,R,F,A,I,Q,Y,G,S,Q,M,K,A,C,Z,D,N,J,L,Z,N;EGp,C5g,x,BP,T,G,a,s,J,O,BD,BH,1,N,0,4,J,I,BL,1,X,I,Bk,BW,M,q,G,T,X,3,e,U,Y,BC,BA,l,K,V,H,L;EKB,C5U,X,A,G,Q,q,Q,U,C,i,S,X,d,7,Z;Epx,EBQ,BT,N,Cd,Y,h,M,H,i,O,O,2,E,CK,N,Bc,f,C,b,Z,J;FbT,EA0,CJ,I,Cv,Bw,Bi,C,8,V,BE,t,BW,R,S,T,X,X;FIr,EKA,A,n,h,P,B1,i,Bj,D,b,Y,Q,S,BC,K,CS,H,u,b;Fdp,DxO,FX,B4,BG,m,Di,O,C8,n,H,3,CL,BR;FTx,D7M,s,P,B1,h,CX,F,2,g,CX,H,t,I,m,W,B9,O,Fa,o,Bm,9;FZj,D9C,8,E,CO,j,Bb,V,C3,A,x,y,BQ,S,y,H,N,N;GJt,D5y,Bl,N,B1,U,Cc,6,Dm,m,Cp,Br;F5N,ECy,Ch,E,BX,o,CQ,W,K,R,CI,j,r,R;GyX,Czu,F,A,D,E,C,I,I,S,e,F,C,D,D,F,L,J,Z,N;Gyr,Crm,F,A,H,E,F,G,F,S,E,K,S,L,F,d;GwJ,CyE,d,Z,T,E,P,M,R,E,F,V,F,C,L,O,M,O,o,U,a,J,Q,T;Gu3,Cvg,R,C,t,i,BN,m,O,S,M,D,Bc,l,m,p,V,P;GxP,C0q,BM,0,C,R,f,d,n,N,J,E;Gqr,Cuw,I,BX,j,v,L,O,J,w,E,g,R,R,P,D,l,e,V,i,e,6,BS,j,Q,j;Giv,CjM,G,T,b,E,J,E,A,I,E,I,S,D,G,F;Gcf,Cjw,C,F,t,Q,7,i,U,A,a,H,W,N,g,d;Gkh,CkC,V,A,p,W,D,E,K,E,A,E,H,M,U,G,S,H,S,T,E,P,A,L,D,F;Gfz,Clm,F,N,h,2,M,U,I,C,M,H,W,Z,E,L,X,Z;Gr7,CtY,H,L,l,e,V,W,D,Q,C,C,M,F,o,b,K,N,A,T;Gop,CqC,F,D,J,A,N,C,L,I,N,Y,C,E,E,E,S,I,G,D,Q,X,A,Z;GqH,CtC,R,D,I,Q,H,S,A,c,Q,Q,W,A,P,BD,L,N;GtJ,Cu6,F,D,J,E,J,E,T,W,D,K,C,C,K,F,W,Z,G,N;Gsr,CvW,A,D,X,A,H,C,D,E,D,G,E,I,M,Q,A,G,C,C,I,J,E,H,C,d;GaN,ChQ,J,F,F,A,F,E,N,k,G,D,Q,L,F,F,O,N,C,H,H,D;DG3,CRu,b,J,Z,C,R,I,y,A,c,K,N,N;DKp,CWu,J,D,D,E,P,I,A,E,K,E,Y,D,J,L,D,H;DNt,Ccg,c,F,N,J,l,C,S,o,BM,o,e,C,R,R,V,A,V,N,r,h,F,N;DWH,Cee,F,R,T,N,J,A,F,A,E,I,A,O,O,C,G,A,K,E;DWB,Ces,X,L,K,O,E,G,E,A,E,A,A,L;Dbx,CS2,L,H,C,G,M,S,I,C,N,V;DdX,CUI,d,L,M,a,I,K,K,F,D,X;DzV,CWq,BR,H,W,Q,g,I,i,c,I,A,T,v;Dzv,CXE,Z,H,J,C,c,U,e,E,b,V;DrJ,CbM,T,D,G,I,Y,M,S,I,K,A,R,R,Z,L;C3L,Cnm,H,D,H,A,H,C,A,E,G,I,O,E,M,A,A,F,P,N;Cz9,Cj8,x,T,H,C,J,O,A,E,K,A,K,J,G,A,W,M,M,C,E,D,D,H;C2l,CrY,L,A,D,C,E,I,K,I,Q,E,F,P,P,J;Cyf,Ckc,W,R,1,P,L,C,C,W,E,C,M,H,M,M,K,D;Cy7,CdC,L,H,L,A,C,G,S,U,E,K,I,E,I,I,F,R,R,b;DXH,DPy,8,D,U,N,N,P,l,J,x,I,N,I,G,G,U,C,F,I,G,E;DiH,DIU,T,D,L,E,A,M,u,y,K,G,W,F,g,Z,F,N,R,L,BB,V;Do5,DPw,BZ,K,t,m,v,Q,BQ,H,BQ,X,i,f,P,H;DXJ,DL8,L,D,Bp,o,J,S,8,I,BG,H,Y,P,H,Z,b,V;DXx,DNm,O,D,I,L,O,J,A,F,R,H,x,O,N,M,D,I,G,G,Q,C,M,D,I,L;DlH,DEc,N,P,R,C,L,F,G,O,C,I,F,K,G,E,U,C,C,N,C,F,E,D,A,F;DVx,DIu,H,P,9,Q,P,G,H,S,m,C,w,d;DKv,C4w,C,F,h,C,L,E,D,C,C,G,G,G,O,E,Y,J,C,F,H,J;DNL,C9o,Q,H,E,V,h,A,l,Q,H,K,G,E,I,F,S,G,W,H;DhF,DmU,7,I,F,I,BA,M,Q,A,Q,L,h,T;DQN,DeU,b,H,N,G,w,Y,u,A,5,Z;EHD,D66,C,N,BB,J,l,A,h,K,CO,2,g,J,r,Z,A,N;EJp,C7I,F,D,L,E,D,K,K,I,I,D,G,F,D,F,H,L;EJL,C9i,D,D,L,A,D,N,F,D,H,I,E,I,A,E,C,E,I,I,G,C,C,D,E,J,D,J;EIh,C6w,H,F,H,A,G,S,H,G,A,E,C,E,E,A,I,H,E,H,C,H,A,F,F,F,F,D;EJ3,Cv6,A,H,N,C,J,E,H,E,A,E,E,E,Q,D,G,L;EIF,Crk,d,A,Z,M,BA,S,M,D,N,V,L,J;GZ9,Chs,D,D,h,O,f,e,q,f,U,J,C,F;GfL,ClY,F,D,H,W,G,K,C,E,A,E,K,L,E,J,C,L,A,D,P,J;Dzf,Dgo,Cx,E,p,W,P,W,BM,O,DC,Z,G,l,r,D;EDP,DSu,k,J,g,d,C,N,b,P,5,L,BD,a,5,k,BA,O,BI,F;E47,D6W,t,E,f,g,BS,M,o,p,v,J;ELB,DGU,H,A,A,C,E,I,I,C,K,I,I,D,D,H,X,N;EKR,DGy,X,D,K,M,Q,K,Q,C,M,H,L,J,X,J;FCN,DxS,h,D,f,O,D,M,G,O,q,M,0,Z,P,X,X,F;FEF,D2a,9,N,T,I,BE,Y,a,L,P,L;FHB,D0S,CR,N,Bd,S,EY,o,BS,H,B9,p;Eq9,Dl6,E,N,Z,V,N,A,V,O,H,I,i,M,O,D,E,E,G,F;Er5,DlS,R,D,N,I,J,C,F,G,R,A,A,K,G,E,Q,C,M,A,S,R,E,J,A,H;D0t,DQA,z,A,BP,S,O,E,Bc,L,S,F,E,J;D3j,Die,R,D,BJ,a,T,M,A,M,W,U,s,D,S,H,k,n,H,F,C,L,N,J;EFV,DJ4,d,D,M,K,BM,K,J,J,z,L;EGx,Dh8,R,D,X,K,E,W,o,C,Q,J,I,J,f,R;D9X,DSe,x,E,Bb,k,u,S,BM,X,W,P,H,X;EIP,DnI,O,R,n,R,Bn,A,O,Z,Cn,k,BC,K,K,M,q,A,S,N,CO,K;EDt,Dm2,M,P,P,H,BZ,X,BP,F,2,g,4,G,U,O,i,H;ECd,DUa,P,J,t,C,J,G,I,E,s,G,e,F,R,H;EUJ,Dby,i,D,E,D,R,L,L,D,f,Q,H,K,E,C,U,N;EHh,DkG,f,C,L,M,i,a,BA,O,g,a,W,C,C,S,BC,I,U,T,CB,BP,BL,P;EAZ,DlC,t,A,V,K,N,Q,I,a,u,I,BK,J,Q,H,x,p,T,H;EgX,DoK,8,A,S,T,r,J,BB,E,5,Q,q,O,o,J;EWH,DaQ,Bm,V,f,P,v,O,l,H,S,S,X,G,BB,F,F,e,BF,i,M,I,CA,h,S,L,P,T,I,H;EfX,Dgg,X,C,l,S,F,M,M,W,X,S,Q,S,k,Y,a,F,e,X,E,7,T,X,X,J;EZJ,DZi,X,D,f,Y,j,O,P,k,E,Q,q,D,k,f,g,p,H,N,J,F;E0J,DNe,J,A,V,K,F,G,Y,E,S,L,D,F,J,H;FQj,D9C,BP,E,CU,c,CA,D,DH,f;FWR,EEG,Z,F,b,C,F,G,g,Q,c,E,Q,A,U,L,r,P;FSD,ECo,CP,G,R,I,D,U,Cq,E,Bc,N,m,T,CP,J;Epd,D8y,x,F,n,G,BT,u,e,M,Be,G,y,V,Z,X,E,P,O,L;E97,D5k,BP,F,BT,Z,h,U,CG,k,BU,V,Z,J;E7d,D2W,Bh,I,P,G,m,M,e,A,u,V,H,H;GSl,D6W,h,A,E,G,m,O,C,G,F,E,K,G,U,A,C,F,F,P,F,H,h,N;F4V,D9i,EJ,K,DE,U,BM,N,G,L,P,J;FZ3,D4E,Bp,E,1,S,w,o,8,Q,Bm,N,q,l,j,X,BB,J;FNT,Dj8,H,H,f,N,V,O,V,F,H,K,G,Y,D,K,S,K,W,D,Q,H,e,V,J,T;FMj,Dkm,H,N,Z,E,N,E,L,M,M,M,I,E,Q,F,G,F,K,R;FNl,Dpa,BB,K,H,C,H,S,I,E,U,A,0,R,J,D,C,R;E8H,Dma,a,N,F,T,V,P,v,A,M,S,H,U,N,E,L,A,A,X,R,V,V,I,C,Y,U,U,i,C,o,L;FQX,Dl2,V,D,C,G,H,E,O,E,C,E,Z,I,H,E,C,E,I,E,O,D,c,H,U,R,T,F,R,J;FSj,DjQ,Bf,S,w,S,M,M,k,H,O,H,I,L,D,P,N,D,N,L;FbP,Diq,BB,I,n,Q,D,G,c,E,BA,F,g,T,F,J,R,F;FmF,Dfa,L,R,L,K,f,M,A,S,G,K,D,M,Q,G,M,J,E,P,F,J,Q,J,E,H,D,J;FqL,DhS,Y,D,Q,C,M,J,E,J,H,F,l,I,N,G,F,E,C,C;Fmr,DeK,4,D,F,R,P,L,J,D,Z,S,H,M;Fqp,DhU,J,A,d,M,G,K,a,L,E,J,A,F;HOh,Dmc,T,J,h,M,e,K,q,H,K,H,h,D|bm,PW,D6,Gc,Cq,8,CC,B9,CA,CK,F6,MG,Cw,CA,Bn,FI,BS,N,D0,Jt,FZ,BD,FG,GT,Dp,Ff,CC,Gv,DO,DX,Q,D1,FD,Bi,O1,H,7,GG,CP,G,Bb,CK|FWa,ka,F,D,F,A,F,C,C,M,C,G,G,C,C,V;FXS,ik,J,J,N,Q,A,E,U,N;Fk0,vc,n,B3,4,CP,P,DR,Dp,Bj,D,1,Bx,L,BA,Cv,Dl,Y,p,BP,BX,Z,Ct,c,a,BG,n,0,BP,x,Cr,Ie,CS,CS,Fo,k,EK,Bp,T,BW,y,c,CS,f,B2,BO|FM8,BDi,Gx,B1,CH,D9,E4,HB,CP,Eb,DC,EF,Bg,GR,DZ,Fp,BC,Fc,Dd,KI,R,Fg,C1,Cq,R,CP,B3,M,a,BF,DB,CV,J,BO,CP,p,I,B8,Bj,Bl,BM,FA,Bx,Fi,X,BR,Bb,Bg,Bo,O,Cz,BW,DF,Em,BW,F,H,CS,B2,y,k,F4,Ck,l,DO,Iw,Da,CI,C6,d,t,Bg,CI,C8,Dk,DD,S,Cz,R,Ct,Df,Dh,F,Cx,EI,q,E,DB,CG,v,BD,Cr,CW,V,6,B1,C8,4,DR,El;FGy,jU,Q,j,F,J,F,A,H,U,N,M,R,D,S,S,I,H;FGs,gC,L,L,D,A,E,S,Q,Q,O,A,D,J,L,N,L,F;FG0,lC,A,F,H,C,C,U,U,q,C,N,H,b,F,P,J,J;FHy,ma,L,D,F,g,E,E,M,P,Q,L,H,H,N,F;FH4,l2,F,p,P,G,H,A,L,s,c,C,G,N;FHc,oo,G,H,G,A,D,V,R,Z,P,D,E,i,H,U,C,O,S,H,C,L;FGk,nM,D,D,F,C,H,C,J,O,E,K,C,C,G,A,E,D,C,F,D,J,A,H,E,J;E4w,zc,P,V,F,c,U,S,W,a,E,P,L,Z,T,P;FEw,0a,J,D,N,O,D,e,O,K,I,F,E,N,F,l;E2O,8Q,F,A,V,Q,R,W,a,E,Y,F,C,N,H,T,H,J;E1k,BCK,E,d,P,M,F,O,D,O,Q,N;E2S,BBG,Y,R,I,A,Q,L,F,N,H,J,R,H,N,G,H,S,P,I,F,I,O,M;FH2,jW,J,A,F,E,K,W,C,b;FGY,ls,A,L,N,M,D,g,K,V,E,H,A,J;FGW,n8,D,J,N,P,L,I,D,G,K,I,M,A,C,C,C,D;FHK,qQ,D,j,L,Q,D,S,A,S,E,C,K,V;E5y,zC,F,H,J,E,D,C,U,W,C,J,J,P;E0C,BCQ,C,T,J,I,P,a,A,S,K,J,K,b|Bki,Hv,b,x,C,v,BI,X,C,7,BL,BD,Bj,CV,v,f,BD,C,n,CA,C,Cg,p,y,I,o,w,P,S,d,BA,E,i,O,M,BO,m,R,6,W,c,T|C4,jc,MD,C,M,FH,Bd,Bi,Ej,n,C3,CU,u,Eg,Cw,Bo,4,DI,Cu,H,CS,DE,Bi,N,Eo,C4,C2,h,q,DD,Ce,B9,r,BD,D6,Bn,Q,Cv,Ef,CR|BcW,CLY,Ef,D,CR,CH,En,y,FF,t,Q,BS,CJ,B0,a,Bs,Bo,BI,Bj,BE,V,Bc,BA,2,BC,h,X,z,IU,h,FI,Bm,E0,BZ,Dl,EH,Bs,Bn|F9a,Py,a,3,C,j,K,R,J,H,l,I,N,m,F,BC,W,A;F9E,Py,5,l,S,BF,N,t,b,b,R,C,f,q,V,A,V,s,h,W,BK,O,B2,BK,K,A,F,Z|Ddv,D6,Ei,Bt,Gk,Eu,CB,BG,CZ,Fu,GO,CP,e,BY,Fg,Bq,BI,CM,CI,d,h,Bx,B6,B7,Bb,EB,BC,DD,Cm,Bx,Fm,Cm,Du,f,A,CI,Jq,BH,E0,G2,FC,KL,Gt,IL,CN,l,Fs,B8,Bk,Df,Dg,6,BF,DB,E4,GM,Cu,S,Ic,Dj,P,Er,Bk,CW,I,BH,Cm,BY,LC,Bj,JA,Gn,FO,t,BA,Bb,2,JL,Kj,OT,B9,K,9,P1,F9,N3,DX,DF,IZ,X,Lf,Hn,Bt,K,BE,v,BT,Jn,Kd,LZ,Es,FY,CV,BU,E,CV,Gv,Jp,w,DO,CD,CM,F7,D4,BT,v,Cr,DI,Ch,R,GE,Ga,GG,De,i,C2,BH,CG,B9,A,BO,E6,Dz,U,BP,FK,HF,8,d,Hc,CC,E6,C5,DK,K,DE,F5,C,BF,IA,Od,F0,BV,HU,KZ,Eh,Gh,U,U,FE,FT,Bz,p,Bk,Cr,U,w,BW,DV,Em,Cw,Dg,y,EW,Gu,DE,Cq,b,B0,KC,CH,Fs,C4,Q,CR,BS,A,CG,H4,BU,Bq,C5;CkH,v,Bo,O,CW,d,Bb,Dh,r,Z,b,U,N,n,5,S,R,p,t,R,1,S,Bb,T,z,Bw,G,W,e,G,t,m,e,CE,BS,e,CA,X;CSX,BMp,G,H,N,A,h,J,J,I,S,K,G,K,W,P;Cgt,BXL,F,D,P,Y,a,Y,I,L,H,T,L,T;CWB,BPF,A,L,J,G,X,F,J,G,e,i,K,L,E,L,H,N;CTj,Jf,V,V,G,Y,D,O,C,O,S,M,F,t;CA9,qR,J,F,D,M,W,S,C,S,M,J,C,P,d,X;CBf,rd,J,N,J,C,D,I,H,G,C,G,G,E,O,A,C,P;CUx,ER,P,L,F,F,L,E,C,G,C,D,E,Q,S,D,C,J;Ckd,2,I,L,d,r,R,H,R,D,X,M,v,C,D,S,Q,U,c,A,y,O,c,H;CmR,GQ,V,L,N,E,L,Y,E,U,O,G,Q,F,K,h,D,J;CnZ,b,5,p,T,O,F,G,I,Y,g,M,O,C,U,F,E,P;Cjf,X,3,H,Z,K,Y,W,q,M,U,F,G,N,D,N,N,L;Cmr,c,D,f,l,M,C,e,g,a,G,u,K,G,E,D,E,BD,V,Z;Clx,BQ,X,H,F,G,A,a,G,O,c,C,C,G,I,C,E,L,A,P,X,b;CrN,En,X,F,c,y,Y,W,A,u,a,q,a,Q,i,G,S,b,Z,BJ,BL,BD,n,T;Cgb,Bbl,N,J,C,w,Q,a,K,I,G,L,H,Z,T,d,C,N|BTe,5Z,C6,Fp,E6,DN,BA,DT,EW,CF,HV,Ef,FV,G3,HZ,BW,Et,FB,DP,E,U,C4,Cn,Dq,A,I8,DM,A,A,L2,HQ,BC,BO,Bf,FW,CK|BAa,CUw,v,Br,Be,BD,BF,P,u,BN,Bt,P,Q,x,l,M,BV,BP,A,BV,Cv,BO,BD,Bo,DJ,CK,Bz,CG,Q,BY,Bg,n,CC,2,H0,BT|DmP,4f,CK,Dw,B3,CQ,CW,KI,C3,FA,DG,h,KY,Eg,BU,HV,Oc,F1,BE,IB,F4,D,L,DF,C4,DL,B5,GR,DP,Cw,In,BL,C3,IV,EH,o,BV,Cl,5,B6,FN,BY,Ez,Dh,DZ,H8,6,DQ,DX,GI|Evk,Bbi,J,p,Bk,3,H,BX,EP,V,BR,Y,B5,n,CV,i,9,BA,CY,C0,Bm,y,BM,P,A,h,CK,X,y,W,BM,h,D,h|FO,UE,F,JI,Cn,FW,CE,CY,Bw,H,BQ,Ck,Ba,g,Ci,CN,u,Dh,Cj,E7,3,H,N,Ip,Dh,f|Enn,5c,G,g,BC,A,6,Bi,s,E,L,X,s,D,l,Fj,B3,CZ,BJ,A,Q,GM;Ejt,5y,L,D,I,K,M,m,I,A,C,D,V,t;EjZ,4M,R,d,A,I,G,W,O,O,A,K,I,H,D,J,L,N|No,Cpw,Ck,Q,Ck,BH,n,7,B6,x,Y,5,CB,BT,Q,BN,BB,J,CF,4,L,BK,CL,l,E,4,Bj,M,B3,Bg,BJ,H,x,BI,Cq,4,Bw,j,BE,k|Boc,CsE,DP,p,t,CD,PV,CG,HD,BT,I,Bq,Bh,y,CY,Bi,Bb,Dw,HU,s,W,Cc,C8,BI,n,BS,E6,Bi,JA,B3,X,Cj,GK,EZ,Er,BT,Bm,C9|DF5,qM,H,F,T,I,H,K,D,e,M,E,U,Z,M,L,N,P|EnQ,BJQ,Z,Di,BL,Bi,e,B6,CR,BK,Ba,By,Bk,O,Cz,CC,BG,CM,DE,Bz,8,o,g,C9,HK,Z,Ba,3,1,F,BJ,CN,Bp,X,r,BZ,g,Bz,8,Z,BA,CS,BC,D,BO,Hp,BX,K,W,B1,Bf,FC,BP,Bs,Bt,5,BJ,DM,BF,b,BC,n,G,C7,BR,Bt,F,BE,7,J,O,BI,BX,CR,T,Bo,b,Bz,9,BM;EuC,BJi,X,P,I,BU,Q,f,E,T,H,V;EvW,BKM,L,H,J,G,N,U,G,Y,E,E,M,b,I,X;Es0,BJQ,1,F,g,0,H,q,T,Q,N,s,U,E,O,L,O,j,a,h,J,BD,L,P;EwW,BIa,H,R,F,M,G,Y,C,A,E,L,D,L;Ewm,BHY,N,D,H,G,C,I,D,c,O,C,G,X,D,V;EsY,BME,E,J,N,G,J,G,F,G,I,G,M,R|CnQ,BVe,J,P,V,g,E,S,J,a,E,I,Y,C,H,J,K,R,A,x|ECh,BQO,A,F,V,P,Q,J,M,U,M,R,I,3,L,b,p,C,D,W,H,E,J,g,f,k,K,G,O,D,k,K,I,J;EBJ,BVi,j,Y,e,c,I,BE,H,O,3,6,BZ,K,Q,I,BE,J,2,1,m,X,G,p,b,T,N,BH;Dxl,BGW,b,r,Bn,J,F,I,A,Y,S,G,O,M,U,C,k,L,U,K,Q,W,K,D,F,X;ECx,BRs,D,z,7,j,X,o,X,D,l,e,U,C,E,L,Q,M,N,U,Y,i,E,U,L,i,K,C,k,Z,C,R,u,7;EFN,BYO,Y,H,BY,I,E,L,Cp,n,z,m,m,X,i,Q,G,c,W,P;EBh,BSq,X,F,V,I,G,G,Q,E,Y,A,M,J,R,H;D05,BLS,G,D,P,J,d,K,H,D,J,S,A,I,S,H,I,L,Y,J;D2H,BPo,R,X,J,C,E,c,M,E,E,A,E,N;D1Z,BJo,P,H,E,M,BC,w,G,K,P,W,G,Q,U,C,H,L,I,d,b,l,Z,L,Z,V;D9R,BUO,BA,h,q,n,J,Bl,f,i,W,A,K,8,r,m,b,G,Z,S,h,A,O,a,M,P;D6F,BNo,L,D,P,G,l,Y,R,C,G,O,M,F,o,h,S,J;D3b,BL0,D,F,Z,o,z,U,Q,G,C,O,l,BC,D,Q,q,BH,K,l,q,f,C,X;D47,BQE,C,L,p,D,S,Q,A,K,R,M,j,0,R,M,C,I,Q,D,a,z,q,v;Dxn,BKW,q,J,Q,N,H,J,X,O,3,E,G,Q,S,H;DxP,BHY,b,L,D,M,O,I,O,L|CUk,CD4,L,K,0,O,c,p,Q,G,q,X,BC,M,D,j,q,d,H,N,g,9,CD,a,BH,w,BD,BS;Cho,CAA,Cz,BU,6,i,n,s,s,g,BD,4,E3,Cf,D,CG,C5,BW,BO,y,Bp,8,c,BC,B5,Ba,4,g,EC,BL,c,o,Bl,BM,y,u,EY,CP,Cy,B4,Ck,DN,C6,Br,Cp,T,CN,Fp;CW6,CHC,C,G,H,C,H,A,F,D,A,J,G,D,I,E;CVO,CIW,F,D,H,C,D,E,A,G,G,C,G,D,C,H,D,F|eu,Cce,s,BA,BY,9,Gi,Ba,Ck,x,p,CM,DO,B8,C0,j,8,BS,GG,9,2,CP,R,9,CH,J,0,b,t,Br,Bn,BH,Ej,5,Gr,2,BB,BU,Gl,v,B7,BW|Hb2,mj,B2,Hv,CS,Y,Co,CT,Dg,ND,Hq,EP,DC,G7,C8,O,s,Dh,He,IF,Be,Iv,CN,I5,FV,G7,Dh,HR,3,Ff,Gn,BT,FX,Cl,k,BX,C9,C6,Cd,V,i,Ba,EX,C9,G1,Be,FT,Dk,L,C0,Cd,Ci,BA,o,Dj,v,BE,B4,BX,Cu,BT,DJ,Cn,V,DY,FW,f,DO,Bv,DZ,FJ,EP,El,Hs,J9,DY,Q1,Cl,Fb,CV,CX,C5,Lz,L,Gb,Df,JN,Ci,F,CY,CO,BE,E,E0,IJ,Rw,CI,BD,BR,C4,Ce,CP,Cl,F8,B6,IQ,Y,B7,IS,F4,N0,DY,EW,Ey,T,DI,CS,CQ,B4,Df,K,EM,Du,l,BN,U,I,Cm,CA,K,t,4,Bq,I,2,Cw,BQ,v,G,Bo,Ei,L,CY,CV,b,B3,Bo,By,DY,BN,s,BA,Bh,Ba,EA,GU,Gu,BA,Cb,DC,J4,DR,C2,BK,t,BP,BO,r,Be,Be,BU,BR,Bl,C1,Bt,P,Bj,FP,MQ,Hx,EE,7,C4,FA,4,MA,Ce,FS,CU,EB;H7y,BVF,H,H,J,K,H,k,Q,y,F,W,m,k,C,S,V,W,Y,Q,I,n,M,N,D,R,3,CP;HQC,1d,R,T,J,C,J,L,n,J,A,W,a,g,8,O,W,X,d,F,L,J;HHA,sh,K,L,I,C,K,S,I,J,E,J,Z,Z,J,Z,I,T,U,J,M,E,N,X,x,C,BB,O,S,Q,D,2,w,k,I,A,C,Z;Gw0,lr,Y,N,G,R,X,F,l,O,x,N,J,I,G,W,O,F,M,I,D,Y,J,M,c,c,K,A,Y,BH;GxW,kt,a,A,g,O,W,F,y,c,2,z,R,f,R,C,T,b,BH,t,Bb,BA,T,i,J,0,w,n;F3G,BWD,F,J,p,BA,L,q,I,I,G,C,o,Bt;HJ2,B1T,BE,C,m,Z,Bd,L,R,b,d,J,x,S,N,N,BR,C,t,c,U,c,CO,g,y,H,E,Z;HjU,B9t,f,P,N,G,E,O,a,C,M,J;Hiu,CAL,K,P,T,I,d,D,S,O,O,D,E,F;Huw,BDd,F,D,H,A,L,E,I,a,E,P,K,N,D,D;Huc,BDB,H,A,F,C,E,I,E,G,I,G,D,T,F,F;H1k,BNx,G,H,G,C,G,F,D,N,O,b,N,N,N,I,f,q,G,O,S,H;Hzi,BKB,H,A,H,C,E,I,C,M,G,F,G,R,H,D;Hxo,BJl,J,H,F,O,C,Q,G,E,E,d;H9S,Bah,T,3,F,A,H,I,A,g,I,U,U,H;H88,BaJ,F,D,J,S,D,U,C,S,K,E,I,D,J,h,C,Z;HY6,ih,R,N,L,G,D,M,A,G,O,K,O,X;HZK,g3,N,N,N,C,F,I,E,K,Q,C,I,L;HYm,gv,H,H,J,M,K,O,I,J,F,N;Hl2,6z,E,V,I,P,D,L,H,H,N,G,L,S,P,O,F,I,S,D,M,G,G,A;HGo,kt,P,N,D,K,a,k,M,K,E,c,K,C,J,l,d,n;HFy,lb,h,R,S,U,q,W,D,J,b,T;HIO,y5,J,J,L,I,D,K,L,E,E,I,G,E,E,M,K,P,C,R,E,J;HHe,yZ,D,D,A,S,G,I,C,T,H,H;HGm,yb,N,A,F,A,D,K,E,I,O,C,E,D,F,T;HP2,3N,J,F,D,I,K,I,G,M,O,L,C,L,X,F;HFe,sl,H,F,T,E,A,I,C,G,G,C,M,Q,I,L,E,R,J,H;G3s,kd,F,F,R,g,G,I,J,Q,M,C,I,M,C,H,C,X,G,N,J,b;Gf2,vD,P,N,J,K,G,U,I,G,I,D,A,X;Gd6,xr,J,H,J,C,A,I,J,I,I,O,G,A,C,J,K,L,D,J;GAa,BFF,N,R,P,E,D,I,I,M,Q,Q,G,L,D,P;Hh2,CHl,EI,BN,Bs,D,c,k,DK,q,y,P,Y,Eb,b,y,n,7,J,C5,n,N,d,o,e,S,v,Q,Z,l,f,w,L,BZ,z,M,b,Bd,Cr,M,L,i,s,M,BH,G,BP,BK,7,CQ,2,1,K,c,7,e,Bf,Cm,L,CU,BC,Z;HeS,CFb,H,A,F,M,C,Q,L,Q,I,o,M,I,C,Q,K,A,S,N,G,f,D,R,G,R,H,P,l,V;Hra,CER,k,l,Y,L,D,R,J,H,O,J,D,H,p,T,t,y,E,I,H,M,P,A,J,I,O,I,S,U,O,H;HpW,CQB,L,V,R,E,R,F,L,O,A,E,M,F,Y,e,G,A,K,Z;Hru,CNx,L,D,F,C,A,K,D,E,K,K,O,H,G,H,P,H,A,H;Hpk,CPf,N,A,F,C,D,K,J,E,E,C,C,I,E,G,K,J,G,Z;HhC,CGr,H,R,J,U,I,E,G,I,C,D,D,P;Hse,CGD,S,N,K,N,P,N,L,D,H,O,X,H,X,C,T,O,K,E,c,A,a,K;HsM,CGt,L,P,N,K,D,E,O,E,G,D,E,D;IQg,C0f,H,J,D,K,M,m,M,I,D,V,P,d|FfE,h1,H,P,N,I,N,C,E,K,O,C,I,E,E,N;FCY,nT,C,D,E,C,A,D,F,D,F,E,A,G,A,E,C,H,A,D,A,D;FCo,nV,D,D,D,A,D,C,C,A,C,C,C,C,A,C,C,D,D,D,A,D|Dzw,Cvb,Z,J,Z,A,b,e,L,C,J,I,BG,L,y,R,b,H|Itu,Bfn,K,F,A,F,D,F,F,D,A,D,D,E,D,C,D,A,A,D,D,A,D,E,A,C,C,C,A,C,D,A,C,E,E,D|Gaq,oH,C,D,H,C,A,C,E,D|CUa,CEE,Bj,BG,CB,S,V,BI,e,w,5,BQ,FC,k,m,d,Z,P,Bq,v,r,l,O,d,Bo,9,P,r,BB,J,C4,BX,X,h,q,l,l,H,S,5,BP,H,BL,CM,7,P,BZ,4,1,P;CVO,CIW,C,E,D,G,H,C,H,D,A,H,C,F,G,D,E,C;CW6,CHC,J,F,H,C,A,I,E,C,G,A,G,D,D,H|C91,BjZ,C9,NR,EY,Db,r,Bv,CI,Bl,D,B1,Er,Ex,NZ,BL,P,Gv,D7,3,Er,BI,Q,EL,B0,BF,CA,BC,k,B5,EX,G,CG,9,DB,B7,BR,Ep,EN,z,CJ,Cj,Co,DH,DA,f,BP,CL,BW,X,FX,DR,Bb,DV,Dd,F,By,h,DD,Cz,8,Br,BV,H,De,CX,Lj,BI,Bb,BW,O,Cw,Cn,N,BZ,Du,DI,Ci,C6,G4,BI,Ek,CT,Be,C4,q,CJ,k,O,Dq,BT,y,BS,DC,l,EY,Bs,Fo,Bu,BG,BF,Fq,Ci,Cg,h,Cm,CS,DU,CR,JW,CS,Ds,k,Fq,EU,Eo,n,Hi,Ds,B6,i,D4,DI,DS,FM,BZ,4,B7,BU,Ck,De,G,F0,Fr,K6,FF,DH,GZ,JU,V,C0,Cc,q,Dc,CW,T,K,Er,GH,Df,GF,Gb;Djd,C07,E,HG,BQ,BZ,n,E,N,p,BE,L,Cy,CZ,DY,Bj,Da,f,7,v,DX,Z,G5,k;DWP,C0h,CW,D,D,J,d,J,BJ,C,BD,V,Z,O,q,W;DNn,CCX,C,N,L,A,Z,M,L,Q,Y,F,M,H,G,H|DNH,28,H,J,X,C,H,S,O,O,Q,H,G,H,E,D,A,L,H,D;DNN,4q,D,F,R,K,H,S,A,C,E,C,G,D,I,D,G,H,A,T|qK,O7,x,X,BP,BF,O,R,F,Bx,7,N,L,a,E,BA,h,BC,k,s,W,C,O,e,BW,m,2,p;BPU,jF,D,G1,GZ,D,M,Kh,EU,Ed,If,BP,Hl,CA,OJ,D,C9,Ba,EZ,5,Cm,MS,DY,Ds,y,EA,Cv,Gc,BO,CM,Df,HW,NU,m,Ds,HH,Fq,a,Bu,DK,GI,BD,Bc,MT,Fm,y|Fg,CNG,l,N,R,A,F,E,F,S,E,K,G,E,I,E,O,A,c,J,G,J,H,N|bq,B5K,BN,BX,I,Fx,Cb,C5,E8,Fr,Ce,JV,O,IP,Bf,Bj,Cs,FD,EC,5,Be,Cj,Tx,ND,IV,Bh,b,Cs,Ed,Bi,B7,Ce,ft,T8,A,Eg,BU,6,O0,GY,V,CW,IM,BW,DN,Jo,LO,Ek,Xm,BW|BAY,CLE,N,8,BW,Bi,S,j,2,O,Be,BP,H,C5,s,BH,s,H,U,5,BN,Bn,BJ,d,O,l,j,f,r,M,f,BE,Bt,BM,c,A,Z,y,w,DK,A,e,x,Q|Dck,B6e,I8,v,FG,EU,CQ,Bx,S,D5,Fg,Cc,E2,v,Lz,Dl,BQ,DD,B1,Dp,Dv,J,BM,CV,Cd,3,t,Df,H5,CN,CH,El,Gt,Bd,Kh,Bg,DI,DY,f,Bg,Ct,Y,1,FC,BK,Bc,BZ,B2,Ce,E6,Em,BL,F2,De,BA,Ci,DE,Ba,Ca,t|EAi,BzQ,5,Bw,CM,l,BI,E,Cb,BR|CXf,DJP,s,H,c,P,a,F,M,T,v,Q,BB,A,P,M,h,H,D,E,E,O,q,C;EsF,Dj7,R,A,H,G,A,C,C,C,C,G,O,A,E,D,C,D,E,H,F,F,D,D;C77,DSb,m,1,HD,Bz,s,BF,Dx,S,HF,C5,BQ,x,Bx,3,8,3,Eo,a,Bf,BL,FV,U,K,Bh,Dn,BY,BF,BN,BE,t,DD,M,b,Bn,CN,P,d,Cb,Cm,A,CB,r,6,5,HM,k,Ct,n,F0,Ez,BX,x,C0,b,Bf,BV,DO,BH,DP,BX,C8,h,D7,p,E8,L,B1,Bt,EI,BH,X,BH,GH,a,D6,Bz,DZ,B3,Dq,F,Lj,DL,C8,h,WH,D7,W1,H,GI,Cf,IM,Z,D1,Br,VL,BK,DL,V,NU,CT,JL,1,LR,Cs,Bw,BX,Bt,N,JQ,DX,PE,W,BH,Bp,KB,V,Ke,T,ES,Cf,OK,u,a4,DF,MN,BN,D4,BX,OK,i,HJ,BF,E4,Bf,r,BV,GK,N,R0,EE,Y6,y,1,Bn,CW,J,Wo,FM,xC,C8,Ul,BK,BN,Ba,In,P,Kl,B8,HE,D0,Qm,Da,iS,DC,Bd,m,EO,Cw,JQ,Ba,FV,E,4,g,Bn,BE,P6,DS,Bk,CG,EV,BM,E4,h,Ck,BW,x,m,FO,CX,DC,Y,J,CS,F0,a,BI,f,Bt,Bh,QS,M,Bs,Bb,H4,CS,XU,Co,IQ,B5,Ea,CU,QS,Bl,C2,BE,BS,CT,FW,Q,CC,B2,EI,Bx,DW,BS,IA,B9,Tu,DS,BM,BO,BJ,Ca,Cq,o,CU,H,BP,BT,FA,B3,LY,Bl,ES,Ea,T6,Dy,g,BI,F0,CV,Cu,Cc,Cb,m,Gs,f,t,Ca,Kw,B2,LW,Cb,DX,F,BE,v,CN,BH,BI,N,Ew,y,FO,Bh,hQ,5,BW,CR,BJ,Cf,CV,d,i,Bn,F1,BT,GY,h,I3,It,Co,j,Mw,Fa,Gk,Fs,He,A,K8,FY,Rk,Dc,Yc,B6,Xi,d,Ko,Cg,V4,DX,Eq,Cq,HE,4,IM,DJ,FN,CL,Uc,Be,EB,BR,Vu,DQ,IQ,Cd,G6,C6,JO,a,DG,BT,DE,BI,bC,Cb,C2,1,CF,CV,Gc,w,Dk,Cb,Ma,C,BI,Bf,Fw,J,Cq,Bu,FM,CR,Nu,Bn,Hw,E5,j,B6,CG,c,ZE,Dn,BW,Bd,Cr,z,k,Bd,Fv,m,Eg,BJ,5,BD,KB,W,EE,Bd,Hn,Bl,Bv,Bi,H,CD,CC,Bt,Gf,k,DN,Cx,E1,T,GK,Br,BN,Dl,Gk,DN,Bp,3,Eo,k,FQ,CH,OP,r,DJ,BK,4,Bl,Df,F,DP,CZ,CO,t,Gb,BV,Gq,H,m,5,B1,N,Be,Z,z,BZ,KW,Cv,Hv,9,LM,c,Mc,CV,DF,p,Bc,T,mW,DN,A,SP,StT,A,A,SO,BN6,Ct,DN,4,Cq,O,bf,BY,Ec,U,D1,Bm,d9,DS,vu,Cb,Uu,Dg,Fh,Bo,Cc,w,J5,BO,Bm,g,bc,BC,IR,Bk,Hu,B0,Zl,DW,BL,U,HC,BO,M5,BA,6,Cw,as,CT,FC,BG,CB,BG,Iu,BN,Bw,6,EF,CO,JR,c,Nk,J,DD,BA,JE,Bu,Is,n,BJ,o,S4,Cw,BC8,o,B6,B4,EK,Bx,Ch,Bt,Hw,m,O,B8,EQ,n,DZ,Cv,pS,G,N3,Ei,Mw,i,M7,BC,p,B0,nU,B7,G4,CE,B4,X,v,Bb,UI,CD,Cy,Y,a,Bk,Cs,h,V,Bg,FU,B1,GQ,K,p,BP,ZE,CK,FM,BG,Cs,CY,GF,Ik,Fm,2,BX,8,CS,EM,Cx,G,K,BW,DM,l,A,B6,Ga,CW,Ca,DA,Vu,FW;CV3,EGP,FI,J,CE,DF,Bv,BR,UJ,B5,Ox,E,DG,CG,Jo,B6,BF,u,Bo,CK,Dq,By,JG,y,IA,Bv,Ep,Bh;DGr,ELL,V,BR,Cb,t,T9,CI,Qk,L,Ba,Q,Bl,w,Di,4,EE,Bf,BV,d;Dn9,DlN,Fm,Fj,O,C7,DJ,CT,Mb,Q,JM,s,Er,F,x,a,De,q,E5,4,Ep,t,w,j,Bf,f,Ed,BG,Dq,Ba,Gi,K,Cv,q,BI,M,JK,N,D,y,EP,s,FE,0,Gz,BI,D,CC,BT,BA,Fi,BC,BM,BT;FGb,Dt9,R,r,B4,w,u,BB,DI,BI,0,N,Cx,BD,Eq,H,Br,BF,Gz,E,NZ,Bi,Nm,i;GQ5,Dz7,6,v,CV,j,D,j,EL,P,CH,U,k,Q,Z,Y,0,a,CX,a,BG,i,H4,T;Gjh,Dyb,Dc,BP,B7,X,EQ,I,Bm,d,X,N,BI,d,J,f,ED,K,Ez,Bo,CD,L,t,2,g,e,DC,C;IRF,EJd,JH,W,Hx,Bc,DS,Bs,Cy,J,Iu,CF,CC,BV;Iq8,EBb,HU,p,Cr,h,Dp,G,CJ,p,Bp,BE,BU,c,t,a,U,M,Bi,A,S,b;BmZ,EJb,4,G,M,Y,Dw,1,Cn,V,Eh,g,l,Y,BC,U,By,j;Bvd,EH3,In,I,Dc,m,FK,v;Do3,EJD,Er,w,EA,By,MS,Bm,Ln,EN;DAn,DUn,BM,S,J,L,2,T,F,P,K,L,n,R,Y,P,BR,C,F,O,Z,D,T,X,J,E,G,M,7,J,T,M,4,O,Z,G,D,W,7,D,i,m,BG,W,U,C,K,P,P,l;C3J,DRx,BM,H,Q,Z,Cb,E,Bx,d,b,W,Y,U,BI,O,Bc,G,M,J;DBD,DNt,w,D,U,V,Bp,J,H,X,7,G,T,V,1,O,l,J,BC,o,CQ,U;DRz,DV9,V,V,BI,K,S,L,Bb,f,5,D,l,V,Bt,a,U,Y,Bm,g,D,Q,m,Q,0,N,J,N,S,T;DPF,DVz,P,J,X,C,P,N,p,G,4,u,E,I,b,S,O,O,S,I,Y,A,M,H,A,L,q,L,H,T,R,P,F,P,d,L;DhV,Dfp,n,T,p,A,p,j,x,F,5,e,J,Q,M,Y,CY,B6,CC,i,G,R,z,b,J,n,4,Z,Bx,t,u,L,E,L;Dzx,Dp3,g,R,EF,7,Et,Z,x,c,Ec,w,k,g,BK,p,m,q,CO,N;D35,Dm7,k,F,BM,p,d,L,T,b,l,L,C1,Q,P,M,Y,g,CO,e;D11,Dxz,BD,l,8,l,p,f,ET,4,p,k,o,S,BQ,L,u,M,Bd,i,BI,M,DW,V,Y,R,b,V;EuF,DyF,BJ,F,M,u,S,M,BB,6,BM,O,BI,D,c,L,G,Z,Z,T,Y,H,A,d,t,f,h,J;Isw,EEF,1,X,Bb,G,CJ,T,h,I,X,i,Cu,V,CE,q,c,f;FPu,DZ3,BZ,F,p,G,R,O,c,a,o,O,Bg,A,k,b,5,f;BYo,DpD,P,J,BZ,D,BJ,M,N,W,G,M,BC,a,8,D,S,H,k,t,D,L;TB,Dpl,3,N,5,g,o,A,i,K,U,F,Q,b;Kl,Dph,h,D,N,K,BE,k,BK,E,U,H,G,N,A,R,N,L,Bv,F;Dbd,EKV,FT,Bs,Fy,P,BY,f,Q,l,CL,b;De9,EIT,j,L,Dn,M,a,W,BQ,U,DG,J,j,N,N,N,I,N;C19,DLf,b,H,d,c,K,I,CU,L,BR,L,X,L;C4P,DS9,T,J,t,O,N,I,G,G,BI,G,U,D,I,P,f,L;C8p,DWT,n,G,F,Q,By,a,N,L,A,L,J,J,z,V;C41,DRf,p,T,T,A,p,O,N,K,Y,O,BY,H,A,P;C9F,DT1,q,D,M,F,x,J,5,G,N,I,BA,A;DOB,Dm5,T,D,R,S,L,e,5,o,P,W,a,G,o,H,BW,p,I,N,H,P,V,F,A,N,T,b;DJj,DPz,Bi,C,6,N,BN,d,h,a,CB,N,f,K,A,I,k,A,i,W,k,R;DuP,Dm1,r,J,B3,S,l,Y,E,M,Q,I,BS,F,Bg,z;E6j,Dwb,x,E,K,K,CG,a,c,d,B7,N;FbP,DyD,Z,J,t,C,j,O,R,c,g,K,BY,v;GNp,D1F,3,D,T,I,y,S,d,k,B2,G,0,H,Q,P,l,Z,Bl,X;Gm3,D2t,f,F,BT,U,l,O,H,c,C4,V,Q,L,R,V,d,J;Iaj,EUJ,Db,E,Cb,0,G8,n,BJ,T;IVp,EPN,LP,o,Ey,Q,Ga,5;Ig8,D3Z,d,A,R,G,F,S,0,Q,q,E,v,t;Ids,D5x,l,b,b,C,P,E,a,O,Y,G,a,A;Iz2,Dzb,b,H,v,S,k,Y,D,I,E,G,W,G,W,d,O,L,V,N,F,H;Ijs,Df3,R,H,N,C,L,M,M,S,F,Y,A,G,e,P,Q,T,C,H,T,T;Iew,Ddj,F,N,L,C,P,K,P,Y,O,C,Q,F,M,T,A,F;Ici,Dcd,L,L,L,C,r,Y,G,K,H,K,C,K,8,v;FBo,DbD,BC,F,Q,J,C,N,T,J,Bv,F,R,G,S,W,q,I;FNa,Dbn,b,D,L,G,A,C,S,M,Y,E,D,P,F,J;FI2,Dcb,V,D,T,G,N,O,e,C,o,L,V,L;FXi,DZJ,N,F,h,E,J,C,H,a,BD,O,H,O,I,G,S,C,y,N,K,L,A,T,q,Z;Eys,DaT,b,D,d,C,R,O,K,G,o,C,a,H,G,H,C,D,P,J;Ec0,Dd9,j,H,7,a,L,O,G,M,Bg,L,a,Z,Z,N;EfK,DdZ,X,F,T,A,X,M,K,G,U,G,2,L,X,L;EbQ,Dc3,X,H,R,A,N,I,D,E,K,M,I,A,G,J,c,L;Dni,DuB,b,b,L,C,L,O,K,K,M,G,Y,H;Di0,DvP,L,A,G,I,a,O,U,S,M,C,W,R,F,N,f,L,r,F;DuQ,Dp1,h,C,l,Y,F,M,C,U,M,M,S,E,Q,f,Y,L,O,N,G,L,F,J,R,F;Cgm,Ddb,z,F,D,K,C,G,M,E,4,A,c,H,D,L,t,A;0U,Dn1,N,N,Bx,a,L,Q,c,S,q,I,BG,G,BO,L,BB,T,V,j;Jy,Dpv,BH,F,R,G,J,M,Bk,e,g,F,G,L,J,P,l,R;Jh,Drt,X,H,d,C,X,G,T,Q,A,M,c,C,BA,h;EM,Dop,T,Z,L,A,N,Q,X,Q,J,K,A,Q,Q,I,4,G,U,F,K,V,h,Z;IL,DqT,Ba,L,5,t,BV,b,F,m,h,I,L,S,Bz,e,Bs,G,Bo,V;Om,DpX,h,F,n,K,L,G,N,a,m,K,w,D,S,J,G,R,H,N,N,L;BEf,D0X,H,1,s,j,A,Z,P,L,BF,I,h,s,n,U,Cz,E,C6,i,0,0,k,K,W,C,M,T,T,l;z7,Dwd,P,F,f,A,b,K,N,O,D,K,M,M,U,C,M,F,o,p;oX,Duz,R,H,b,C,j,K,P,Q,Q,M,S,D,e,N,a,V;BqV,EJB,j,D,P,E,o,a,u,A,s,J,H,H,BP,P;Cyb,DLv,L,D,N,I,D,E,O,K,O,M,G,A,F,Z,H,J;DDz,DO9,t,L,d,O,c,I,k,H,I,H;DLT,Dnv,f,A,T,K,C,I,M,G,k,F,I,R,L,F;DJr,Dj1,H,H,b,E,n,O,M,G,c,D,W,H,I,L;DJ7,DqH,h,E,R,S,I,O,BQ,E,U,H,A,N,J,L,z,N;DJV,DrN,x,C,Z,G,J,I,M,I,W,E,i,D,Q,J,C,J,H,L;DFl,DPb,d,D,b,U,k,A,Q,F,K,J,J,H;DJL,DRJ,L,D,P,C,A,F,M,F,N,D,P,E,L,K,G,I,O,C,c,P;DJp,DUD,b,H,n,K,g,C,C,Y,S,K,e,H,V,N,H,L,I,N;DN1,DUt,T,A,E,K,Q,I,c,E,f,X;DSR,DXP,f,L,T,A,U,W,S,C,e,M,I,D,R,L,N,P;DQB,DRd,J,A,E,I,W,W,q,K,F,L,P,L,r,V;Dab,DaZ,r,J,Z,C,A,I,G,M,U,G,F,O,O,I,G,M,c,I,m,F,H,V,d,J,J,f;Dc1,Dbj,t,X,L,E,A,E,Q,I,C,Y,e,I,K,D,J,L,G,L,D,F;DfT,Ddx,h,D,P,E,S,Q,D,I,Q,E,U,D,O,T,V,L;DfR,Dgn,n,F,f,G,A,O,L,G,BC,O,i,D,U,L,p,Z;DtT,Dor,K,H,s,G,S,L,V,P,X,L,b,A,Z,e,U,E;D0V,Dyp,T,F,l,M,E,I,Q,M,s,W,g,C,a,F,d,V,J,R,h,N;E2l,DxP,j,A,d,M,M,I,K,A,w,T,J,D;GEl,D1R,Bl,F,j,O,DS,y,u,J,BZ,f,O,J,v,P;G3F,D2J,h,N,BB,I,G,I,4,G,m,F,H,H;Gyz,D2l,Cf,I,BD,W,BS,W,Cg,T,C,X,V,N;HqH,D9R,C,D,f,C,3,O,U,E,a,F,Y,H,M,J;Hih,D6P,C7,c,y,O,c,D,BG,R,k,Z;Hm7,EAR,Bh,H,I,M,R,M,y,G,CC,J,Q,P,Bd,D;HtX,EAb,CF,E,N,O,Cw,N,h,H;Hvt,D9f,DQ,L,CJ,R,Bl,S,c,I;HvX,EBf,6,L,Bp,E,t,O,4,E,g,N;Hyn,D9r,BZ,D,r,K,CO,K,U,L,f,J;HnN,D79,p,D,Bf,W,P,Q,Bg,H,0,f;Hnh,D9N,Z,R,BB,I,d,K,Q,O,c,E,0,H,S,P;HzL,EBl,Dl,U,Bk,K,CI,b,J,F;IAj,EKL,F3,o,Q,M,Fm,1;HvZ,EAx,D9,I,BF,U,C8,W,CE,z;INp,EQ1,DP,BC,Du,z,h,P|DRn,6S,W,A,A,F,D,H,P,E,H,E,A,C|JUG,bf,D,D,A,E,A,I,C,F,C,F,D,D";

// Every projection lays the world out 1000 units wide; only the height differs.
const MAP_W = 1000;
// Decimals kept when a ring is written out as an SVG path. One user unit is 0.36°,
// so a single decimal quantises the path to 0.036° — wider than the Vatican, Tuvalu
// or Ashmore and Cartier, each of which then collapsed to a straight line and drew
// nothing at all, at every zoom. Two decimals is 0.0036°, and they survive.
const MAP_PATH_DP = 2;
const MAP_MIN_W = 20;   // furthest you can zoom in
const MAP_ROUND = 10;   // questions in a quiz round
const MAP_TRIES = 2;    // wrong clicks before the answer is given away
const MAP_HIT_PX = 16;  // click tolerance around a country too small to hit
const MAP_LABEL_PX = 10;      // label size on screen, whatever the zoom
const MAP_LABEL_PAD = 6;      // room a name needs beyond its own size to be drawn
const MAP_HALO_PX = 2.5;      // width of the halo behind a label, on screen
const MAP_HINT_HOT_PX = 70;   // this close to the answer, the hint arrow goes hot
const MAP_HINT_WARM_PX = 230; // and this close, warm
const MAP_CAPITAL_PX = 2.6;   // radius of a capital's dot on screen

// Robinson is defined by a table rather than a formula: a multiplier for the
// length of each parallel and for its distance from the equator, every 5° from
// the equator to the pole, interpolated in between.
const MAP_ROBINSON_X = [1, 0.9986, 0.9954, 0.99, 0.9822, 0.973, 0.96, 0.9427, 0.9216,
    0.8962, 0.8679, 0.835, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322];
const MAP_ROBINSON_Y = [0, 0.062, 0.124, 0.186, 0.248, 0.31, 0.372, 0.434, 0.4958,
    0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1];

/**
 * The projections, each mapping hundredths of a degree into a space MAP_W wide
 * and `height` tall.
 *
 * They exist to be compared. Mercator is the one every wall map uses and the one
 * that makes Greenland the size of Africa; equirectangular and Robinson disagree
 * with it in different ways, and dragging a country between latitudes under each
 * of them is the whole lesson.
 */
const MAP_PROJECTIONS = {
    equirectangular: {
        label: 'Equirectangular', height: 500, maxLat: 9000,
        y: function(lat) { return (9000 - lat) / 36; }
    },
    mercator: {
        // Beyond about 85° the projection runs off to infinity, which is why no
        // Mercator map has ever shown the poles.
        label: 'Mercator', height: 1000, maxLat: 8505,
        y: function(lat) {
            const phi = Math.max(-8505, Math.min(8505, lat)) * Math.PI / 18000;
            return 500 - 500 * Math.log(Math.tan(Math.PI / 4 + phi / 2)) / Math.PI;
        }
    },
    robinson: {
        label: 'Robinson', height: 507, maxLat: 9000,
        y: function(lat) {
            return 253.5 - (lat < 0 ? -1 : 1) * mapRobinson(MAP_ROBINSON_Y, Math.abs(lat)) * 253.5;
        },
        xScale: function(lat) { return mapRobinson(MAP_ROBINSON_X, Math.abs(lat)); }
    }
};

// Degrees, not projected units: the box a region occupies is a fact about the
// world, and each projection turns it into its own viewBox. Framed by hand
// because a continent's own bounding box is useless where it crosses the
// antimeridian — Russia and Oceania each span the full width of the map.
const MAP_REGIONS = {
    world: { lon: [-180, 180], lat: [-90, 90] },
    Africa: { lon: [-19, 53], lat: [-36, 38] },
    Asia: { lon: [25, 150], lat: [-11, 78] },
    Europe: { lon: [-25, 46], lat: [34, 72] },
    'North America': { lon: [-172, -50], lat: [5, 75] },
    'South America': { lon: [-83, -33], lat: [-57, 14] },
    Oceania: { lon: [110, 180], lat: [-50, -5] }
};

// Places a round never asks for, by name. Antarctica is a continent held by treaty
// rather than a country, and the Siachen Glacier is a disputed icefield whose
// population is a garrison. Both still draw and still answer to a click.
const MAP_NOT_QUIZZABLE = ['Antarctica', 'Siachen Glacier'];

// And nowhere no one lives: Heard Island, Ashmore and Cartier, South Georgia,
// Pitcairn, the Fr. S. Antarctic Lands. "Find Ashmore and Cartier Is." is not a
// question anyone can answer, whereas Vatican City — 825 people, the smallest place
// this admits — plainly is.
const MAP_MIN_QUIZ_POP = 500;

/** Whether a round can ask for this country. */
function mapIsQuizzable(row) {
    return MAP_NOT_QUIZZABLE.indexOf(row[2]) === -1 && row[5] >= MAP_MIN_QUIZ_POP;
}

var mapGeometryCache = null;
var mapPathCache = {};
var mapExtentCache = {};
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
        subregion: r[4], pop: r[5], capital: r[6], lon: r[7], lat: r[8],
        capitalLon: r[9], capitalLat: r[10]
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
        return blob.split(';').map(function(text) {
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
    });
    return mapGeometryCache;
}

// ---------- projection ----------

/** Read a Robinson table at a latitude, interpolating between its 5° steps. */
function mapRobinson(table, lat) {
    const step = Math.min(17.999, lat / 500);
    const i = Math.floor(step);
    return table[i] + (table[i + 1] - table[i]) * (step - i);
}

function mapProjectionOf(key) {
    return MAP_PROJECTIONS[key] || MAP_PROJECTIONS.equirectangular;
}

/** Longitude is x in all three, though Robinson shortens the parallels. */
function mapProjectX(projection, lon, lat) {
    const scale = projection.xScale ? projection.xScale(lat) : 1;
    return MAP_W / 2 + (lon / 18000) * (MAP_W / 2) * scale;
}

function mapProjectY(projection, lat) {
    return projection.y(Math.max(-projection.maxLat, Math.min(projection.maxLat, lat)));
}

/**
 * The latitude and longitude at a point on the map. Latitude is found by bisection
 * rather than by an inverse formula: y is monotonic in latitude for every
 * projection here, so one search serves all of them and a fourth projection needs
 * no inverse of its own.
 */
function mapUnproject(projection, x, y) {
    let lo = -projection.maxLat;
    let hi = projection.maxLat;
    for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        if (mapProjectY(projection, mid) > y) lo = mid; else hi = mid;
    }
    const lat = (lo + hi) / 2;
    const scale = projection.xScale ? projection.xScale(lat) : 1;
    return { lon: (x - MAP_W / 2) * 18000 / ((MAP_W / 2) * scale), lat: lat };
}

/** The rings of one country as an SVG path, optionally shifted in degrees — which
 *  is how the same country is drawn somewhere it does not belong. */
function mapRingsToPath(projection, rings, dLon, dLat) {
    return rings.map(function(ring) {
        let d = '';
        for (let i = 0; i < ring.length; i += 2) {
            const lon = ring[i] + (dLon || 0);
            const lat = ring[i + 1] + (dLat || 0);
            d += (i ? 'L' : 'M') + mapProjectX(projection, lon, lat).toFixed(MAP_PATH_DP) +
                ' ' + mapProjectY(projection, lat).toFixed(MAP_PATH_DP);
        }
        return d + 'Z';
    }).join('');
}

/** Every country's path in one projection, built once per projection. */
function mapPaths(key) {
    if (mapPathCache[key]) return mapPathCache[key];
    const projection = mapProjectionOf(key);
    mapPathCache[key] = mapGeometry().map(function(rings) {
        return mapRingsToPath(projection, rings);
    });
    return mapPathCache[key];
}

/** A country's extent in user space, or null where it wraps the antimeridian and
 *  the extent would be the whole map. */
function mapCountryBounds(key, index) {
    const rings = mapGeometry()[index];
    if (!rings) return null;
    const projection = mapProjectionOf(key);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    rings.forEach(function(ring) {
        for (let i = 0; i < ring.length; i += 2) {
            const x = mapProjectX(projection, ring[i], ring[i + 1]);
            const y = mapProjectY(projection, ring[i + 1]);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    });
    if (minX > maxX || maxX - minX > MAP_W / 2) return null;
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/**
 * The size of the box a country's name has to fit inside: the width and height of
 * its biggest landmass.
 *
 * Measured per ring rather than over all of them together, and the biggest ring is
 * the one that counts. A country with territory either side of the antimeridian
 * would otherwise measure as wide as the world, and one with distant islands would
 * claim room for a label that its mainland does not have.
 */
function mapCountryExtents(key) {
    if (mapExtentCache[key]) return mapExtentCache[key];
    const projection = mapProjectionOf(key);
    mapExtentCache[key] = mapGeometry().map(function(rings) {
        let best = { w: 0, h: 0 };
        rings.forEach(function(ring) {
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;
            for (let i = 0; i < ring.length; i += 2) {
                const x = mapProjectX(projection, ring[i], ring[i + 1]);
                const y = mapProjectY(projection, ring[i + 1]);
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
            const w = Math.min(maxX - minX, MAP_W / 2);
            const h = maxY - minY;
            if (w * h > best.w * best.h) best = { w: w, h: h };
        });
        return best;
    });
    return mapExtentCache[key];
}

// ---------- state ----------

function mapGetData(toolId) {
    const customizations = loadToolCustomizations();
    const saved = (customizations[toolId] || {}).mapData || {};
    const projection = MAP_PROJECTIONS[saved.projection] ? saved.projection : 'equirectangular';
    return {
        view: saved.view || mapRegionView(projection, 'world'),
        region: MAP_REGIONS[saved.region] ? saved.region : 'world',
        projection: projection,
        mode: saved.mode === 'quiz' ? 'quiz' : 'explore',
        hint: Boolean(saved.hint),
        selected: saved.selected || null,
        comparing: Boolean(saved.comparing),
        compare: saved.compare || null,
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

/**
 * The viewBox that frames a region under a projection. Sampled along the box's
 * edges rather than taken from its corners: Robinson shortens parallels towards
 * the poles, so a box's widest point can be in the middle of one of its sides.
 */
function mapRegionView(key, name) {
    const projection = mapProjectionOf(key);
    const region = MAP_REGIONS[name] || MAP_REGIONS.world;
    const lat0 = Math.max(-projection.maxLat, region.lat[0] * 100);
    const lat1 = Math.min(projection.maxLat, region.lat[1] * 100);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i <= 8; i++) {
        const lat = lat0 + (lat1 - lat0) * i / 8;
        [region.lon[0] * 100, region.lon[1] * 100].forEach(function(lon) {
            const x = mapProjectX(projection, lon, lat);
            const y = mapProjectY(projection, lat);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        });
    }
    return mapClampView(key, { x: minX, y: minY, w: maxX - minX, h: maxY - minY });
}

/** Keep the view inside the world and within the zoom range. */
function mapClampView(key, view) {
    const height = mapProjectionOf(key).height;
    const ratio = view.h / view.w;
    const w = Math.min(MAP_W, Math.max(MAP_MIN_W, view.w));
    const h = Math.min(height, w * ratio);
    return {
        x: Math.max(0, Math.min(MAP_W - w, view.x)),
        y: Math.max(0, Math.min(height - h, view.y)),
        w: w,
        h: h
    };
}

function mapApplyView(widget, view) {
    const svg = widget.querySelector('.map-svg');
    if (!svg) return;
    svg.setAttribute('viewBox', view.x + ' ' + view.y + ' ' + view.w + ' ' + view.h);
    mapUpdateLabels(widget);
}

/**
 * Size the labels and decide which of them fit.
 *
 * Both depend only on how many pixels a user unit is worth, so panning — which
 * changes the view several times a second — does no work at all, and the 177
 * labels are only reconsidered when the zoom or the tool's size actually changes.
 */
function mapUpdateLabels(widget) {
    const svg = widget.querySelector('.map-svg');
    const group = widget.querySelector('.map-labels');
    const dots = widget.querySelector('.map-capitals');
    if (!svg || !group) return;
    const ctm = svg.getScreenCTM();
    if (!ctm || !ctm.a) return;
    const scale = ctm.a;
    if (Math.abs(scale - Number(group.dataset.scale || 0)) < 0.0001) return;
    group.dataset.scale = scale;

    group.setAttribute('font-size', MAP_LABEL_PX / scale);
    group.setAttribute('stroke-width', MAP_HALO_PX / scale);
    const radius = MAP_CAPITAL_PX / scale;
    const extents = mapCountryExtents(widget.dataset.mapProjection || 'equirectangular');
    const labels = group.querySelectorAll('.map-label');
    const circles = dots ? dots.querySelectorAll('.map-capital') : [];
    // A name shows once the country is big enough to hold it — its own name, not
    // some average one. "Puerto Rico" is wider than Puerto Rico until you have
    // zoomed a long way in, and drawn before then it covers the island whole.
    for (let i = 0; i < labels.length; i++) {
        const box = extents[i];
        const fits = box.w * scale >= Number(labels[i].dataset.w || 0) + MAP_LABEL_PAD &&
            box.h * scale >= MAP_LABEL_PX + MAP_LABEL_PAD;
        labels[i].classList.toggle('hidden', !fits);
        if (circles[i]) {
            circles[i].classList.toggle('hidden', !fits);
            if (circles[i].getAttribute('cx') !== null) circles[i].setAttribute('r', radius);
        }
    }
}

/**
 * How wide each name draws, in screen pixels, recorded once.
 *
 * Labels hold a constant size on screen however far the map is zoomed, so their
 * widths are constants too — measured here at a font size chosen to be large
 * enough that rounding does not matter, then scaled to the size they are drawn at.
 */
function mapMeasureLabels(widget) {
    const group = widget.querySelector('.map-labels');
    if (!group) return;
    const reference = 100;
    group.setAttribute('font-size', reference);
    // Every write happens before every read, so this costs one layout, not 177.
    const labels = group.querySelectorAll('.map-label');
    for (let i = 0; i < labels.length; i++) {
        labels[i].dataset.w = labels[i].getComputedTextLength() / reference * MAP_LABEL_PX;
    }
}

/** The selected country shows its capital however small it is — you asked about
 *  that one, so it stops depending on how much room it happens to have. */
function mapPaintCapitals(widget, data) {
    const dots = widget.querySelector('.map-capitals');
    if (!dots) return;
    const selected = data.mode === 'explore' ? data.selected : null;
    dots.querySelectorAll('.map-capital').forEach(function(dot, i) {
        const isSelected = selected && MAP_COUNTRIES[i][1] === selected;
        dot.classList.toggle('selected', Boolean(isSelected));
        if (isSelected) dot.classList.remove('hidden');
    });
}

/** Client coordinates to map user space. getScreenCTM already knows about the
 *  letterboxing preserveAspectRatio introduces, which hand arithmetic would not. */
function mapClientToUser(svg, clientX, clientY) {
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const point = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: point.x, y: point.y, scale: ctm.a };
}

function mapViewAround(key, cx, cy, w, h) {
    return mapClampView(key, { x: cx - w / 2, y: cy - h / 2, w: w, h: h });
}

function mapSetView(widget, toolId, view) {
    const data = mapGetData(toolId);
    data.view = mapClampView(data.projection, view);
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
    const next = mapClampView(data.projection, { x: view.x, y: view.y, w: view.w * factor, h: view.h * factor });
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
    mapSetView(widget, toolId, mapRegionView(data.projection, data.region));
}

function mapZoomToCountry(widget, toolId, index) {
    const country = mapCountry(index);
    if (!country) return;
    const data = mapGetData(toolId);
    const bounds = mapCountryBounds(data.projection, index);
    if (bounds) {
        const pad = Math.max(bounds.w, bounds.h) * 0.35 + 6;
        mapSetView(widget, toolId, {
            x: bounds.x - pad, y: bounds.y - pad,
            w: bounds.w + pad * 2, h: bounds.h + pad * 2
        });
        return;
    }
    // Wraps the antimeridian, so frame its label point instead of its extent.
    const projection = mapProjectionOf(data.projection);
    mapSetView(widget, toolId, mapViewAround(data.projection,
        mapProjectX(projection, country.lon, country.lat), mapProjectY(projection, country.lat), 300, 150));
}

// ---------- rendering ----------

function mapInit() {
    document.querySelectorAll('.map-widget').forEach(function(widget) {
        if (widget.dataset.mapInited) return;
        widget.dataset.mapInited = '1';
        const toolId = mapGetToolId(widget);
        if (!toolId) return;

        const data = mapGetData(toolId);

        // The 177 shapes are built once and thereafter only recoloured. Rebuilding
        // them the way the rest of the toolbox rebuilds innerHTML would be ~50KB of
        // markup per mouse move.
        mapBuildShapes(widget, data.projection);

        const regions = widget.querySelector('.map-region');
        if (regions) {
            regions.innerHTML = Object.keys(MAP_REGIONS).map(function(name) {
                return '<option value="' + escapeHtml(name) + '">' + escapeHtml(name === 'world' ? 'Whole world' : name) + '</option>';
            }).join('');
        }
        const projections = widget.querySelector('.map-projection');
        if (projections) {
            projections.innerHTML = Object.keys(MAP_PROJECTIONS).map(function(key) {
                return '<option value="' + key + '">' + escapeHtml(MAP_PROJECTIONS[key].label) + '</option>';
            }).join('');
        }

        mapBindStage(widget, toolId);
        mapApplyView(widget, data.view);
        mapRender(widget);
    });
}

function mapBuildShapes(widget, key) {
    const svg = widget.querySelector('.map-svg');
    if (!svg) return;
    const projection = mapProjectionOf(key);
    const paths = mapPaths(key);
    const shapes = MAP_COUNTRIES.map(function(row, i) {
        return '<path class="map-country" data-iso="' + row[1] + '" d="' + paths[i] + '"></path>';
    }).join('');
    // Antarctica has no capital, so it gets a placeholder circle that is never
    // shown — the layers stay index-for-index with MAP_COUNTRIES, which is what
    // lets the scale pass address them without a lookup.
    const capitals = MAP_COUNTRIES.map(function(row) {
        if (row[9] === null) return '<circle class="map-capital" r="0"></circle>';
        return '<circle class="map-capital" cx="' + mapProjectX(projection, row[9], row[10]).toFixed(1) +
            '" cy="' + mapProjectY(projection, row[10]).toFixed(1) + '"></circle>';
    }).join('');
    // Labels are their own layer above the shapes so no country can paint over a
    // neighbour's name, and they take no pointer events so they never eat a click.
    const labels = MAP_COUNTRIES.map(function(row) {
        return '<text class="map-label" x="' + mapProjectX(projection, row[7], row[8]).toFixed(1) +
            '" y="' + mapProjectY(projection, row[8]).toFixed(1) + '">' + escapeHtml(row[2]) + '</text>';
    }).join('');
    svg.innerHTML = '<g class="map-shapes">' + shapes + '</g>' +
        '<path class="map-ghost"></path>' +
        '<g class="map-capitals">' + capitals + '</g>' +
        '<g class="map-labels">' + labels + '</g>';
    widget.dataset.mapProjection = key;
    mapMeasureLabels(widget);
}

/** Redraw every shape and label in a different projection. */
function mapSetProjection(select) {
    const widget = mapGetWidget(select);
    const toolId = mapGetToolId(widget);
    const data = mapGetData(toolId);
    data.projection = MAP_PROJECTIONS[select.value] ? select.value : 'equirectangular';
    // The coordinate space itself changed, so the old viewBox describes nothing.
    data.view = mapRegionView(data.projection, data.region);
    data.compare = null;
    mapSaveData(toolId, data);
    mapBuildShapes(widget, data.projection);
    mapApplyView(widget, data.view);
    mapRender(widget);
}

/** Re-render the panels and recolour the shapes. Never rebuilds the shapes. */
function mapRender(widget) {
    const toolId = mapGetToolId(widget);
    if (!toolId) return;
    const data = mapGetData(toolId);

    widget.querySelectorAll('.map-mode').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.mode === data.mode);
    });
    const regions = widget.querySelector('.map-region');
    if (regions) regions.value = data.region;
    const projections = widget.querySelector('.map-projection');
    if (projections) projections.value = data.projection;
    const compare = widget.querySelector('.map-compare');
    if (compare) {
        compare.classList.toggle('active', Boolean(data.comparing));
        compare.style.display = data.mode === 'explore' ? '' : 'none';
    }
    const ghost = widget.querySelector('.map-ghost');
    if (ghost) ghost.setAttribute('d', mapGhostPath(data));

    const learned = Object.keys(data.progress).filter(function(iso) { return data.progress[iso].right; }).length;
    const stat = widget.querySelector('.map-stat');
    // Out of the countries a round can ask for, not out of every shape on the map:
    // the uninhabited ones are never asked, so they could never be learned either.
    if (stat) stat.textContent = 'Learned ' + learned + ' / ' + MAP_COUNTRIES.filter(mapIsQuizzable).length;

    const panel = widget.querySelector('.map-panel');
    if (panel) panel.innerHTML = data.mode === 'quiz' ? mapQuizPanel(data) : mapExplorePanel(data);
    mapPaint(widget, data);
}

function mapPaint(widget, data) {
    const quizzing = data.mode === 'quiz' && data.quiz && !data.quiz.done;
    const svg = widget.querySelector('.map-svg');
    if (svg) {
        // Labels are hidden in quiz mode by CSS keyed off this class: naming every
        // country on screen would answer every question before it was asked.
        svg.classList.toggle('quiz', Boolean(quizzing));
        svg.classList.toggle('comparing', Boolean(data.comparing) && data.mode === 'explore');
        // The arrow replaces the pointer rather than trailing it, so the real one
        // is hidden while the hint is on.
        svg.classList.toggle('hinting', Boolean(quizzing && data.hint));
    }
    if (!quizzing || !data.hint) { mapHideArrow(widget); mapHideTooltip(widget); }
    widget.querySelectorAll('.map-country').forEach(function(path) {
        const iso = path.getAttribute('data-iso');
        const entry = data.progress[iso];
        path.classList.toggle('learned', Boolean(entry && entry.right));
        path.classList.toggle('selected', data.mode === 'explore' && data.selected === iso);
        path.classList.remove('right', 'wrong');
    });
    mapPaintCapitals(widget, data);
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
        '<button class="map-btn map-hint-btn' + (data.hint ? ' active' : '') +
            '" onclick="mapToggleHint(this)" title="Turn the pointer into an arrow that points at the answer, and warms as you close in">Hint</button>' +
        '<button class="map-btn" onclick="mapQuizSkip(this)">Skip</button>';
}

// ---------- interaction ----------

function mapBindStage(widget, toolId) {
    const svg = widget.querySelector('.map-svg');
    if (!svg) return;
    const runtime = mapRuntimeFor(toolId);

    svg.addEventListener('pointerdown', function(e) {
        // Neither drag feeds the tooltip, so without this it hangs where the
        // pointer was when the drag began.
        mapHideTooltip(widget);
        const data = mapGetData(toolId);
        if (data.comparing && data.mode === 'explore') {
            const iso = mapIsoAt(e);
            const index = iso ? mapIndexOf(iso) : -1;
            if (index !== -1) {
                // Dragging a country carries it somewhere it does not belong, so
                // the pan has to give way while a country is in hand.
                runtime.ghost = { iso: iso, index: index, projection: data.projection };
                svg.setPointerCapture(e.pointerId);
                return;
            }
        }
        runtime.drag = { x: e.clientX, y: e.clientY, moved: 0 };
        // Read once here: a pointermove that went to storage for the current view
        // would parse the whole board's customizations on every mouse position.
        runtime.view = data.view;
        runtime.projection = data.projection;
        svg.setPointerCapture(e.pointerId);
        svg.classList.add('dragging');
    });

    svg.addEventListener('pointermove', function(e) {
        if (runtime.ghost) { mapDragGhost(widget, runtime.ghost, e); return; }
        if (!runtime.drag) {
            const data = mapGetData(toolId);
            if (data.mode !== 'quiz') { mapTooltip(widget, e, false); return; }
            mapUpdateArrow(widget, data, e);
            if (data.hint) mapTooltip(widget, e, true);
            else mapHideTooltip(widget);
            return;
        }
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
        runtime.view = mapClampView(runtime.projection, { x: view.x - dx, y: view.y - dy, w: view.w, h: view.h });
        mapApplyView(widget, runtime.view);
    });

    const end = function(e) {
        if (runtime.ghost) {
            const ghost = runtime.ghost;
            runtime.ghost = null;
            if (ghost.lon === undefined) return;   // picked up and put straight back
            const data = mapGetData(toolId);
            data.compare = { iso: ghost.iso, lon: ghost.lon, lat: ghost.lat };
            mapSaveData(toolId, data);
            mapRender(widget);
            return;
        }
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
    svg.addEventListener('pointerleave', function() { mapHideTooltip(widget); mapHideArrow(widget); });

    svg.addEventListener('wheel', function(e) {
        e.preventDefault();
        mapZoomAt(widget, toolId, e.deltaY > 0 ? 1.2 : 1 / 1.2, e.clientX, e.clientY);
    }, { passive: false });

    svg.addEventListener('dblclick', function(e) {
        const iso = mapIsoAt(e);
        if (iso) mapZoomToCountry(widget, toolId, mapIndexOf(iso));
    });

    // Resizing the tool changes how many pixels a country is worth without
    // changing the view, so the labels have to be reconsidered.
    if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(function() { mapUpdateLabels(widget); }).observe(widget.querySelector('.map-stage'));
    }
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

/**
 * Name whatever is under the pointer.
 *
 * `hinting` is the assisted quiz: the name is help the round is already offering,
 * but the capital is not, and the tooltip has to clear the hint arrow standing
 * where the cursor would be. Outside a hint, a quiz shows no tooltip at all —
 * naming countries would answer the question being asked.
 */
function mapTooltip(widget, e, hinting) {
    const tip = widget.querySelector('.map-tooltip');
    if (!tip) return;
    const iso = mapIsoAt(e);
    if (!iso) { mapHideTooltip(widget); return; }
    const country = mapCountry(mapIndexOf(iso));
    if (!country) { mapHideTooltip(widget); return; }
    const stage = widget.querySelector('.map-stage').getBoundingClientRect();
    tip.innerHTML = '<span class="map-tip-name">' +
            (country.iso2 ? '<span class="map-tip-flag">' + mapFlag(country.iso2) + '</span>' : '') +
            escapeHtml(country.name) + '</span>' +
        (country.capital && !hinting ? '<span class="map-tip-capital">◉ ' + escapeHtml(country.capital) + '</span>' : '');
    // Measured after the content is in, then kept inside the stage: above the
    // cursor by preference, below it when there is no room above, and never
    // hanging off either side.
    tip.classList.add('show');
    const x = e.clientX - stage.left;
    const y = e.clientY - stage.top;
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    const gap = hinting ? 30 : 14;   // clear of the arrow, which stands on the cursor
    tip.style.left = Math.max(4, Math.min(stage.width - w - 4, x - w / 2)) + 'px';
    tip.style.top = (y - h - gap >= 4 ? y - h - gap : Math.min(stage.height - h - 4, y + gap + 6)) + 'px';
}

function mapHideTooltip(widget) {
    const tip = widget.querySelector('.map-tooltip');
    if (tip) tip.classList.remove('show');
}

/**
 * The hint arrow: the pointer itself, aimed at the country being asked for.
 *
 * Aimed in screen space rather than by bearing, because the answer to "which way
 * do I go" is the direction the country appears in, and on a flattened map those
 * two are not the same thing. How far away it is shows as the arrow's colour, so
 * the hint says warmer and colder without ever saying where.
 */
function mapUpdateArrow(widget, data, e) {
    const arrow = widget.querySelector('.map-arrow');
    if (!arrow) return;
    const quiz = data.quiz;
    if (!data.hint || data.mode !== 'quiz' || !quiz || quiz.done || !quiz.target) { mapHideArrow(widget); return; }
    const country = mapCountry(mapIndexOf(quiz.target));
    const svg = widget.querySelector('.map-svg');
    if (!country || !svg) { mapHideArrow(widget); return; }

    const projection = mapProjectionOf(data.projection);
    const ctm = svg.getScreenCTM();
    if (!ctm) { mapHideArrow(widget); return; }
    const at = new DOMPoint(mapProjectX(projection, country.lon, country.lat),
        mapProjectY(projection, country.lat)).matrixTransform(ctm);

    const dx = at.x - e.clientX;
    const dy = at.y - e.clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const stage = widget.querySelector('.map-stage').getBoundingClientRect();
    arrow.style.left = (e.clientX - stage.left) + 'px';
    arrow.style.top = (e.clientY - stage.top) + 'px';
    // Below a pixel or two the angle is noise, so the arrow keeps the way it last
    // pointed rather than spinning on the spot.
    if (distance > 3) arrow.style.setProperty('--map-arrow-turn', (Math.atan2(dy, dx) * 180 / Math.PI) + 'deg');
    arrow.classList.toggle('hot', distance <= MAP_HINT_HOT_PX);
    arrow.classList.toggle('warm', distance > MAP_HINT_HOT_PX && distance <= MAP_HINT_WARM_PX);
    arrow.classList.add('show');
}

function mapHideArrow(widget) {
    const arrow = widget.querySelector('.map-arrow');
    if (arrow) arrow.classList.remove('show');
}

function mapToggleHint(btn) {
    const widget = mapGetWidget(btn);
    const toolId = mapGetToolId(widget);
    const data = mapGetData(toolId);
    data.hint = !data.hint;
    mapSaveData(toolId, data);
    if (!data.hint) mapHideArrow(widget);
    mapRender(widget);
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

/**
 * The dragged country, drawn where it has been dragged to.
 *
 * The shape is re-projected at its new latitude rather than moved as a picture,
 * which is the entire point: on Mercator, Greenland leaving the Arctic loses four
 * fifths of itself on the way to the equator.
 */
function mapGhostPath(data) {
    if (!data.compare) return '';
    const index = mapIndexOf(data.compare.iso);
    const country = mapCountry(index);
    if (!country) return '';
    return mapRingsToPath(mapProjectionOf(data.projection), mapGeometry()[index],
        data.compare.lon - country.lon, data.compare.lat - country.lat);
}

function mapDragGhost(widget, ghost, e) {
    const svg = widget.querySelector('.map-svg');
    const path = widget.querySelector('.map-ghost');
    const point = mapClientToUser(svg, e.clientX, e.clientY);
    const country = mapCountry(ghost.index);
    if (!point || !path || !country) return;
    const projection = mapProjectionOf(ghost.projection);
    const at = mapUnproject(projection, point.x, point.y);
    ghost.lon = at.lon;
    ghost.lat = at.lat;
    // Written straight to the element: a drag redraws continuously and has no
    // business going through storage on the way.
    path.setAttribute('d', mapRingsToPath(projection, mapGeometry()[ghost.index],
        at.lon - country.lon, at.lat - country.lat));
}

function mapToggleCompare(btn) {
    const widget = mapGetWidget(btn);
    const toolId = mapGetToolId(widget);
    const data = mapGetData(toolId);
    data.comparing = !data.comparing;
    if (!data.comparing) data.compare = null;
    mapSaveData(toolId, data);
    mapRender(widget);
}

function mapSetRegion(select) {
    const widget = mapGetWidget(select);
    const toolId = mapGetToolId(widget);
    const data = mapGetData(toolId);
    data.region = MAP_REGIONS[select.value] ? select.value : 'world';
    data.view = mapRegionView(data.projection, data.region);
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
        if (!mapIsQuizzable(row)) return false;
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
    data.view = mapRegionView(data.projection, data.region);
    data.compare = null;
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
function mapHitsTarget(widget, key, iso, targetIso, e) {
    if (iso === targetIso) return true;
    const country = mapCountry(mapIndexOf(targetIso));
    if (!country) return false;
    const svg = widget.querySelector('.map-svg');
    const point = mapClientToUser(svg, e.clientX, e.clientY);
    if (!point || !point.scale) return false;
    const projection = mapProjectionOf(key);
    const dx = point.x - mapProjectX(projection, country.lon, country.lat);
    const dy = point.y - mapProjectY(projection, country.lat);
    return Math.sqrt(dx * dx + dy * dy) * point.scale <= MAP_HIT_PX;
}

function mapQuizAnswer(widget, toolId, iso, e) {
    const data = mapGetData(toolId);
    const quiz = data.quiz;
    if (!quiz || quiz.done || !quiz.target) return;
    const runtime = mapRuntimeFor(toolId);
    if (runtime.timer) return;   // a flash is already playing out

    const target = quiz.target;
    const right = mapHitsTarget(widget, data.projection, iso, target, e);
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
    var mapFunctions = [mapGetToolId, mapGetWidget, mapRuntimeFor, mapCountry, mapIndexOf, mapDecodeInt, mapGeometry, mapRobinson, mapProjectionOf, mapProjectX, mapProjectY, mapUnproject, mapRingsToPath, mapPaths, mapCountryBounds, mapCountryExtents, mapGetData, mapSaveData, mapRegionView, mapClampView, mapApplyView, mapUpdateLabels, mapMeasureLabels, mapPaintCapitals, mapClientToUser, mapViewAround, mapSetView, mapZoomBtn, mapZoomAt, mapResetView, mapZoomToCountry, mapInit, mapBuildShapes, mapSetProjection, mapRender, mapPaint, mapFlag, mapFormatPop, mapExplorePanel, mapQuizPanel, mapBindStage, mapIsoAt, mapTooltip, mapHideTooltip, mapUpdateArrow, mapHideArrow, mapToggleHint, mapClick, mapSetMode, mapGhostPath, mapDragGhost, mapToggleCompare, mapSetRegion, mapSearch, mapIsQuizzable, mapQuizPool, mapQuizStart, mapQuizAsk, mapHitsTarget, mapQuizAnswer, mapFlash, mapQuizSkip, mapResetProgress];
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
        'window.MAP_MIN_QUIZ_POP = ' + MAP_MIN_QUIZ_POP + ';\n' +
        'window.MAP_ROBINSON_X = ' + JSON.stringify(MAP_ROBINSON_X) + ';\n' +
        'window.MAP_ROBINSON_Y = ' + JSON.stringify(MAP_ROBINSON_Y) + ';\n' +
        // The projections carry functions, so they are rebuilt rather than JSON'd.
        'window.MAP_PROJECTIONS = {' + Object.keys(MAP_PROJECTIONS).map(function(key) {
            var p = MAP_PROJECTIONS[key];
            return JSON.stringify(key) + ':{label:' + JSON.stringify(p.label) +
                ',height:' + p.height + ',maxLat:' + p.maxLat +
                ',y:' + p.y.toString() + (p.xScale ? ',xScale:' + p.xScale.toString() : '') + '}';
        }).join(',') + '};\n' +
        'window.MAP_W = ' + MAP_W + '; window.MAP_PATH_DP = ' + MAP_PATH_DP + ';\n' +
        'window.MAP_MIN_W = ' + MAP_MIN_W + '; window.MAP_ROUND = ' + MAP_ROUND + ';\n' +
        'window.MAP_TRIES = ' + MAP_TRIES + '; window.MAP_HIT_PX = ' + MAP_HIT_PX + ';\n' +
        'window.MAP_LABEL_PX = ' + MAP_LABEL_PX + '; window.MAP_LABEL_PAD = ' + MAP_LABEL_PAD + ';\n' +
        'window.MAP_HALO_PX = ' + MAP_HALO_PX + ';\n' +
        'window.MAP_HINT_HOT_PX = ' + MAP_HINT_HOT_PX + '; window.MAP_HINT_WARM_PX = ' + MAP_HINT_WARM_PX + ';\n' +
        'window.MAP_CAPITAL_PX = ' + MAP_CAPITAL_PX + ';\n' +
        'window.mapGeometryCache = null; window.mapPathCache = {}; window.mapExtentCache = {};\n' +
        'window.mapIso3Index = null; window.mapRuntime = {};\n' +
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
            '<select class="map-select map-projection" onchange="mapSetProjection(this)" title="How the round world is flattened"></select>' +
            '<button class="map-btn map-compare" onclick="mapToggleCompare(this)" title="Drag a country somewhere else to see its true size there">True size</button>' +
            '<input type="search" class="map-search" placeholder="Search country" oninput="mapSearch(this)">' +
            '<span class="map-spacer"></span>' +
            '<span class="map-stat"></span>' +
        '</div>' +
        '<div class="map-stage">' +
            '<svg class="map-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet"></svg>' +
            '<div class="map-tooltip"></div>' +
            '<div class="map-arrow">' +
                '<svg viewBox="0 0 24 24" width="36" height="36">' +
                    '<path d="M23 12 L4.5 21 L9.5 12 L4.5 3 Z" fill="currentColor" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/>' +
                '</svg>' +
            '</div>' +
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
