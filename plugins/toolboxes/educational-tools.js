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
/* This row is the mode bar: the framework fades it in on hover and pushes the
   timeline down for it, which is what the rules that used to live here did by hand.
   What is kept is the one thing the framework has no reason to know — that a panel
   left open is a reason to stay open, whatever the pointer is doing. */
.tl-toolbar { display:flex; gap:6px; flex-wrap:wrap; }
.tool.authoring:has(.tl-panel.open) .authoring-overlay { max-height:400px; opacity:1; padding:4px 6px; margin-bottom:6px; pointer-events:auto; }
/* On its own, a timeline is the thing on the board; the buttons that build it are
   not part of it. The mode buttons stay, so there is a way back. */
.tool.authoring-render .tl-toolbar-btn { display:none; }
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
    --map-label:#5a5346; --map-sea-label:#6f96ad; --map-ghost:rgba(155,89,182,0.55); --map-ghost-stroke:#8e44ad;
    --map-capital:#b03a2e; --map-capital-on:#c0392b; --map-halo:rgba(255,255,255,0.7);
    --map-state-capital:#1f5fa8; --map-state-capital-on:#2d7dd2;
    --map-backdrop:#d8d2c4; --map-backdrop-stroke:#bdb7a8;
    --map-hint-cold:#4a6fa5; --map-hint-warm:#e08a1e; --map-hint-hot:#27ae60;
    /* No padding of its own: the framework pads .tool-content. */
    display:flex; flex-direction:column; gap:6px; box-sizing:border-box;
    flex:1; min-height:0; width:100%; font-size:12px;
}
body.dark-mode .map-widget {
    --map-ocean:#16283a; --map-land:#3a465c; --map-land-hover:#4d5c78; --map-stroke:#20293a;
    --map-learned:#3f6048; --map-selected:#f39c12; --map-right:#2ecc71; --map-wrong:#e74c3c;
    --map-label:#dfe4ec; --map-sea-label:#6d8ba6; --map-ghost:rgba(155,89,182,0.6); --map-ghost-stroke:#c39bd3;
    --map-capital:#e8705f; --map-capital-on:#ff8a75; --map-halo:rgba(12,20,32,0.7);
    --map-state-capital:#6ea8e8; --map-state-capital-on:#8dc2ff;
    --map-backdrop:#2e3950; --map-backdrop-stroke:#232c3e;
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
.tool.authoring-render .map-stage { border:none; border-radius:0; }
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
/* Water is named the way an atlas names it: italic, letter-spaced and paler than
   the land, so a sea reads as a region rather than as another country. No halo —
   the names sit in open water with nothing to stand out from. */
.map-seas { pointer-events:none; fill:var(--map-sea-label); text-anchor:middle; dominant-baseline:middle; font-family:inherit; font-style:italic; letter-spacing:0.06em; }
/* An ocean outranks a sea, so it is set larger and wider apart. In em, which means
   the one font-size the script writes on the group still drives both — and the fit
   measurement, taken from the elements themselves, picks the difference up free. */
.map-seas .ocean { font-size:1.35em; letter-spacing:0.18em; }
.map-seas .hidden { display:none; }
.map-svg.quiz .map-seas { display:none; }
.map-ghost { fill:var(--map-ghost); stroke:var(--map-ghost-stroke); stroke-width:1; vector-effect:non-scaling-stroke; pointer-events:none; }
/* The land around the states: drawn, not clickable, and a shade back from them so
   the country being looked at is plainly the subject and Canada is context. */
.map-backdrop { fill:var(--map-backdrop); stroke:var(--map-backdrop-stroke); stroke-width:0.6; vector-effect:non-scaling-stroke; pointer-events:none; }
/* A state capital is blue, which is also how it reads as a different kind of place
   from a national capital — no country on this map has a blue dot. */
.map-svg.states .map-capital { fill:var(--map-state-capital); }
.map-svg.states .map-capital.selected { fill:var(--map-state-capital-on); }
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
/* On its own, a map does not need telling how to be a map. The whole strip goes,
   not just the words in it, so the map gets the height back — but only while that
   is all the strip holds: a country's facts and a quiz's score both stay. */
.tool.authoring-render .map-panel:has(> .map-nudge) { display:none; }
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

/** What the framework calls when the timeline needs to be up to date. A panel left
 *  open belongs to the editing mode, so leaving that mode closes it. */
function tlOnRender(toolId) {
    var tool = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    var widget = tool && tool.querySelector('.tl-widget');
    if (!widget) return;
    if (tool.classList.contains('authoring-render')) tlClosePanels(widget);
    tlRender(widget, toolId);
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
        // "Click + Add Event" is only true where that button is on screen.
        var tool = widget.closest('.tool');
        var bare = tool && tool.classList.contains('authoring-render');
        lineEl.innerHTML = '<div class="tl-empty">' + (bare
            ? 'Nothing on this timeline yet — double-click to start adding events.'
            : 'No events yet. Click "+ Add Event" to get started.') + '</div>';
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
// Simplifying has to respect the borders. Portugal's outline is 6° across and
// Spain's is 13°, so a tolerance taken from each country's own size moves their
// shared border by different amounts and it stops being one line: what is left
// between them is a row of thin wedges with nothing drawn in them, and the ocean
// shows through as a string of lakes along the border. Natural Earth holds the same
// coordinates on both sides of a border, so the fix is to round onto the grid
// first, then let a vertex two countries share be kept by both or by neither.
//
// To rebuild: take both files from github.com/nvkelso/natural-earth-vector under
// geojson/, round coordinates to 2 decimals, simplify as above, and encode as
// described above MAP_GEOMETRY. Capitals join on adm0_a3, but adm0cap flags only
// sovereign capitals, so territories fall through to "Admin-0 region capital"; and
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
const MAP_GEOMETRY = "Bm6,BKR,T,M,CZ,C,Cl,k,5,J,F,A,J,G,BF,BO,DT,2,9,Bc,C,By,BT,E,V,BO,DR,By,DB,Fe,E,K,m,N,FE,X,C6,Da,Cq,BM,e,Bu,EU,BI,e,A,A,h,IO,C7,K,FL,9,CD,6,DX,Bz,ER,DP,DP|BkE,yd,f,A,EV,BJ,f,Bv,Cr,BN,C7,Db,FF,W,n,M,j,g,h,S,CJ,M,CN,Z,r,J,p,i,Dr,D4,N,Kg,GY,C,G,Ga,F,a,G,D,BO,Bv,C6,q,M,BV,CM,3,Ci,R,BG,BQ,F8,Fx,Ce,P,E,EI,CZ,n,CN,Cg,2,DS,z,ES,Bm,CW,Fa,2,i,G,G,R,y,BF,BW,L,s,1,y,H,E,X,C8,BF,M,H,A,F,CY,Dn,BT,BH,D,D7,0,x,Bl,5,L,B5,9,BN,BC,BZ,g,Q,K,P,r,P,I5,C7,e,Br|CvQ,1s,Bp,l,DL,Dp,Yf,Iz,Ch,CI,BR,I4,J,BG,CA,Ds,MA,B1,GI,FQ,Is,BO,w,I,I,V;CNY,xW,H,F,D,I,E,S,G,E,E,N,D,J;CN6,sM,P,H,I,Q,K,E,C,A;COC,tE,F,F,D,A,P,M,O,M,I,N;Cxa,ow,BY,E,BC,X,BP,n,BV,J,Z,E,5,m,q,m|FZq,hg,E,L,A,Z,J,X,C,L,H,H,P,q,V,a,K,A,S,M,I,A;FmS,BHY,J,D,ED,Bn,Db,Gj,KU,Ll,B6,Hz,t,EB,D3,DP,Ef,1,D,B7,Bf,BK,BG,CJ,CH,Ba,BG,B7,Db,Cf,BH,H,BA,Eg,Bz,BG,T,O,BW,Y,o,BO,CS,Q,BS,p,BB,Cu,Bw,K,C,0,Di,BU,U,De,5,CO,q,Bq,F,M,D,W,c,Ba,Bj,Bu,u,w,CZ,Bc,E9,HE,D9,CA,c,BO,By,N,BG,BS,Bz,BW,q,q,Ex,w,f,Ci,Cf,B6,L,U,K,G,6,BG,Bo,9,BI,BC,B8,v,EU,Cm,By,BZ,DC,d,v,5,W,Br;Fh6,cA,H,A,F,E,S,O,D,L,A,F;Fjs,hi,T,N,A,K,O,G,G,G,C,A;Fiu,BFK,F,F,R,M,G,O,M,P;FlG,BGc,d,b,N,A,K,e,G,G,Q,L;Fk0,BFg,L,H,P,A,Q,K,I,M,G,E,A,L;FjQ,BE6,J,D,R,Q,I,K,S,H,E,F,A,F|DKN,de,Z,H,A,E,G,K,O,C,E,E,M,C,E,F,L,F;DT9,j4,G,b,V,X,b,D,X,Q,N,F,l,I,K,O,c,I,G,L,e,J,E,O,Y,U;DYX,jM,N,H,V,G,J,G,G,G,Q,A;DKx,cm,N,F,D,U,e,Y,G,F,D,F,K,H,D,L,N,L;DHn,bk,i,9,Cz,CT,S,BF,4,N,A,f,Cv,BV,O,BP,1,3,Ba,Bn,q,x,G,D,W,x,BT,BV,Fh,Br,f,BZ,GP,CO,B0,CP,i,Dh,CI,5,Gt,E7,j,4,CJ,t,BD,w,1,u,F,O,BB,Di,CH,BS,Bw,CC,Bx,Dg,BO,FY,GT,N,CL,Co,GL,S,Cj,Gs,B1,Q,CM,FU,Ea,DS,H,L,B9,x,BM,C7,Br,Ct,Bk,Cf,B0,CI,BX,EC,FY,Bo,Bl,BW,6,6,BM,CR,D8,BD,0,CL,GG,c,Dm,Bz,Eg,BY,B1,c,Hy,U,DV,r,B4,Cb,E6,BX,Cr,Cd,Eq,E|oI,CLK,D,A,A,C,C,A|Ip4,v1,M,BF,W,E,O,o,S,A,D,b,M,P,O,9,A,L,X,T,BF,L,A,M,b,g,E,o,Z,BK,I,q;IsC,z7,O,F,E,L,4,j,M,X,R,P,f,E,R,P,R,E,V,BS,H,G,V,J,P,Q,K,m,c,H;IvY,2J,G,D,F,L,d,K,X,F,N,I,H,Q,E,K,M,K,G,L,O,J,O,R;Iu4,0t,Z,D,h,G,T,S,a,K,U,U,I,J,I,X,I,H;IvY,4l,a,h,N,V,Z,D,f,G,M,G,H,I,Z,A,G,O,Q,S;Ito,xz,P,J,Z,A,L,G,g,c,i,G;Ium,zh,H,I,N,y,I,s,W,BZ,D,P;Iui,xd,F,N,J,O,F,BE,G,A,K,r;Ira,yt,F,H,X,M,G,O,W,H;Isk,uB,J,L,d,G,C,Q,G,G,O,G,S,J;IsS,s3,F,D,F,C,N,Y,E,I,O,I,O,P,A,P,D,F,J,D;I0E,BDJ,J,L,L,A,P,I,C,K,Q,C;Iyu,BBD,L,X,T,G,T,O,J,O,G,c,I,E,K,D,E,b;IyO,9H,J,L,9,Y,A,g,G,O,O,E,K,D,I,V,Q,H,N,J,U,P|Dq2,CMS,G,E,y,X,BR,d,CF,Bp,Bk,N,i,v,Bs,V,G,s,i,D,O,q,s,BH,4,H,K,h,DA,p,B1,7,j,M,J,l,v,I,Bb,7,CR,U,H,D,N,D,Bt,e,BO,BG,BJ,BC,CP,BP,BJ,W,f,p,M,BN,CF,H,BG,R,Bf,Bt,Cj,M,7,f,P,z,Ce,7,J,Bf,0,1,Bv,CV,D,z,J,P,D,G,v,O,p,N,z,Y,x,I,BB,F,D,W,U,Bs,JN,Dw,EJ,Co,B3,Dk,F1,BA,V,Cm,Eh,B0,Bb,f,BA,BH,BZ,o,Dd,CD,M,B7,Ch,K,1,C,A,u,A,LG,IU,B0,LE,Gr,Ja,s,D0,CV,T,DN,Bk,D,q,Cn,D8,E,Bi,B3,H2,FI;Dp4,CIE,A,E,H,I,L,E,F,D,E,H,K,L;Drs,CEq,f,D,L,E,G,S,P,K,D,K,E,I,I,E,M,P,K,F,U,D,L,P,I,P;Dti,CE2,H,J,J,C,J,G,C,E,M,C,K,E|CwL,Bu1,L,J,Cb,C3,CX,1,EX,G,C9,Bc,CJ,H,B1,B0,w,EU,J,U,Q,e,P,BS,e,e,D,4,w,CC,N,2,s,BK,I,I,M,P,CU,e,Ci,CL,I,9,BS,u,F6,D5,CC,CN,BT,BZ|Idu,RM,C,L,N,E,D,E,I,E;HLm,eo,P,R,D,G,G,I,G,M,G,G,I,C,E,J,H,J;H3M,Xs,D,F,N,C,D,C,C,A,E,C,C,E,F,A,E,C,E,A,C,D,C,F;H36,X8,F,A,A,G,C,C,C,A,G,D,A,D;IOq,V8,L,F,R,C,F,Q,H,E,A,I,M,I,U,H,I,N,F,J|IzO,Sy,F,H,H,A,I,M,E,S,Q,M,A,H,N,J;Iwm,Xk,D,F,V,C,J,E,A,E;I5e,Wu,G,F,Q,A,O,N,V,I,L,A,F,C;I36,XC,a,L,g,E,b,J,N,A,V,I,N,K,C,C;IqW,j8,L,A,E,E,I,A|HkC,8g,H,H,H,E,A,M,I,D,E,D;HkC,0s,F,D,H,C,F,C,D,G,O,A,E,F;Hik,tq,J,L,J,C,F,E,D,E,Q,G,I,D;HkQ,6U,L,F,M,U,E,C,G,H;HkK,wy,A,F,L,A,F,E,G,S,W,K,H,L,D,L;Hj2,wS,J,L,H,Q,A,G,G,G,G,A|DXN,7I,P,D,V,K,Q,E,K,F;DWl,7M,P,F,J,A,F,C,I,G;DW7,5Y,S,J,U,A,X,J,p,D,C,O|Hg4,qw,J,A,J,G,D,c,c,U,K,S,O,F,G,H,h,h|I2v,uT,J,D,L,K,U,G,G,E,Y,D,P,D|DbV,7e,Bm,N,C,d,BJ,3,D9,E,G,u,T,c,U,c;DZF,6a,P,D,N,C,D,G,S,G,W,D,Q,H;Dg7,6Q,H,A,A,C,J,G,C,E,O,A,E,D,A,D,D,A,F,H|G4P,C6W,D,F,j,C,F,K,C,I,O,S,G,S,w,f,G,N,N,H;G4f,C5a,r,U,E,K,Y,M,0,D,C,H,H,P,C,H,F,F;G9R,DB0,D,H,d,C,b,G,P,K,C,E,a,E,Y,J;HiJ,DIo,H,H,T,C,J,E,e,M,G,D;Hgf,DG6,i,c,S,K,W,E,D,J;Hrf,DHw,L,J,p,E,I,M,e,I,i,N;H4Z,DIs,L,A,O,K,I,S,M,D,C,F,V,V;IVN,C2g,D,R,l,O,G,E,a,C;ISF,C1U,H,A,H,C,J,K,A,G,O,F,G,J;ISl,C14,A,R,D,D,H,E,N,F,H,C,C,K,I,C,C,I,D,C,G,I,E,C;IoL,CxS,D,A,H,G,A,E,E,C,I,I,I,E,I,A,C,D,R,P;JJx,CrI,R,F,X,I,C,M;In9,Dbm,A,E,Y,I,q,K;I3t,DTI,B6,W,C0,BF,Cq,N,DH,BJ,Cv,BW,Bt,O,Bf,Z,9,e,i,y;Im9,DIq,c,P,D,r,Y,h,Bp,N,L,T,DN,y,9,o,B6,C,BK,g;H7N,DAW,Be,M,L,b,0,V,n,f,Bt,K,0,f,DZ,9,S,T,BF,n,V,K,2,k,Br,a,c,Z,h,T,BN,BW,i,s,BW,S,BY,BH,f,BE,e,E,r,g,o,K,q,d,2,O,M,i,BA,P;Gvd,C4S,J,L,R,n,W,BJ,l,x,C,H,BN,1,J,E,BV,EM,Dp,Bl,B8,B8,GN,DG,l,Bg,Bs,P,BX,0,BI,K,Ct,m,e,Bc,C5,P,B3,DI,2,Dx,Cn,e,z,CG,Ct,F,DA,B3,Bx,r,KT,EO,Cm,6,Bb,i,DN,9,DN,BU,I1,V,Cb,BC,q,BE,Dv,p,CV,0,6,BO,Fh,h,w,2,Cn,BR,8,f,BP,n,CM,D,Bh,Bl,Eb,z,h,I,L,A,DF,Bv,DP,K,C6,Bi,Bf,Z,BH,a,Bc,Bk,I,Bc,C8,8,EY,d,DJ,6,CU,BE,FP,9,Ch,7,CF,B1,Bx,L,V,C,D,D,BS,z,Et,CN,Cc,Bn,C9,CR,Rd,IL,GB,D,F3,Ch,FS,Dc,Ei,V,D,Bm,JK,D2,f,Bu,BW,c,BF,u,CS,CS,Ed,Br,7,BE,BS,I,CX,D,d,B1,Ej,CG,Fv,BV,Bm,Bg,Ch,Dw,Be,BW,B9,CT,EV,l,Ep,CW,Fq,BK,E5,G,DX,CA,Fm,FY,EW,d,W,G,c,U,GY,Bq,CJ,CQ,B6,BM,GN,BZ,Kv,q,Cj,B2,Ce,a,GP,BM,Ls,DA,Co,F,BR,BJ,BE,d,Im,W,ET,Cc,Ce,Bl,ES,W,Kj,Bs,Kh,EE,B2,Bs,Go,O,HU,Ea,F4,0,k,BB,Bi,w,CP,W,BS,g,KW,CA,C2,7,BR,5,Ck,0,JQ,z,BK,BT,cI,BF,G4,Bf,Q,D,A,eL,GM,I,X,1,e,T,FK,Dh,Dm,CQ,Cs,m,s,T,GA,EL,FG,F3;Ie5,C0s,0,X,5,O,t,X,Bl,D,Br,t,v,E,R,Y,BW,BM,CK,c,0,D;G57,C3G,A,F,f,P,H,L,n,X,C,c,V,S,W,I,k,F,U,I;Gzr,C1q,U,b,C,L,l,D,J,E,D,E,G,O,L,I,N,C,L,F,D,M,I,K,F,M,C,M,M,A,W,L;G2P,C4c,x,A,J,E,A,O,J,G,r,E,J,Y,U,I,s,0,M,D,y,z;Gyn,C2o,P,X,X,N,v,O,H,a,n,X,Z,b,L,K,J,o,o,i,G,w,BI,a,e,V,e,n;G5R,C7w,Y,T,A,j,R,T,9,q,m,1,J,V,BX,D,L,M,H,4,9,q,W,M;G4l,C1E,S,I,e,J,H,b,N,R,V,G,3,q,j,0,j,G,H,K,E,I,a,G,o,Z;HmP,DJA,E,H,2,D,Bn,d,V,a,c,Q;Hql,DG6,b,E,U,W,BY,y,g,i,s,P,BL,r,l,n;HqV,DJA,A,H,H,F,G,L,P,b,H,H,H,D,H,C,C,I,N,A,F,O,I,E,C,K,M,U,E,H,O,K;HrN,DKO,b,D,N,C,E,M,A,G,M,A,Q,F,E,F;H8F,C8K,d,T,P,K,E,Q,M,M,BI,F,G,F,F,F;H6B,DCo,Z,M,I,G,c,K,M,A,G,D,C,F,A,F,H,H;H8V,DAm,H,H,z,Y,A,E,I,C,a,J,M,H;IF1,C4E,H,H,R,A,J,C,F,G,Y,Q,K,C,C,H;IDN,C58,H,G,K,M,q,U,M,A,E,H,P,L;IBd,C6S,L,A,P,G,C,G,U,I,W,D,C,F,F,J;IWV,C2a,a,O,H,P,K,R,K,H,D,F,Z,F,T,E,V,H,H,E,F,c,C,G,K,I,O,E,K,F;Ibn,C04,P,G,H,G,D,G,c,K,G,A,G,L,J,N;IcX,Cze,T,F,T,E,R,I,D,K,q,J;IT5,C1w,F,H,L,D,j,b,N,F,Q,Y,F,Q,O,C,M,M,M,C,M,O,K,D,H,J,M,J,D,J;InH,CyW,l,A,L,S,E,G,K,E,e,E,m,T,C,F;ImN,Cym,F,C,A,I,H,O,M,G,I,A,M,N,Q,F;IXH,DC8,P,F,R,C,N,U,K,A,S,O,2,M;I8j,DIy,c,C,g,V,BV,G,BZ,g,E,Q,a,I,M,V;I05,C8c,V,J,V,C,H,I,A,C,2,I;IzZ,Cue,H,N,1,E,D,E,C,E,g,G,O,A;I2v,Ctm,P,H,F,C,D,I,e,U,O,D,G,F,H,N,J,F;I8V,Csm,R,D,R,C,I,M,W,M,S,F,O,J;Izn,C6s,c,F,O,C,M,D,E,H,Z,L,l,O;JK3,Cq2,L,G,D,Q,G,E,U,N;JJ5,Cro,T,G,J,G,A,G,E,I,Q,A,K,F,I,H,C,F;JNd,Cq0,H,F,Bh,F,F,E,A,E,BU,Q,a,a,O,H,R,T;JSE,Cre,P,F,H,I,A,G,G,E,M,D,I,H;JU2,Cps,j,A,CD,2,0,F;JCY,Cs4,N,A,J,G,t,C,E,I,U,C,c,K,Y,A,J,L;HBZ,C9A,BG,B5,F,Bt,h,K,d,k,F,c,S,Q,d,F,d,O,A,S,j,A,C,W,Y,U,d,K,X,i,r,t,f,F,I,S,L,a,G,S,i,G,i,k;HAd,DBm,Ba,F,i,f,w,BN,V,K,5,BM,V,D,I,f,BE,9,E,T,L,J,M,V,n,L,BH,x,f,G,H,W,a,4,j,g,Z,Ba,f,y,S,D;HDZ,DBk,V,X,Q,L,w,a,BW,V,F,p,BN,L,BK,L,W,b,N,X,CD,m,b,z,t,G,j,s,Bl,8,y,y,k,Z,K,U,8,O;G5r,C5q,U,R,A,f,Bm,n,BY,BX,BL,W,V,Z,q,C,0,l,H,L,F,D,u,H,A,BV,R,T,b,E,f,k,r,I,P,m,R,D,A,V,R,E,BH,4,g,O,Z,U,K,S,3,E,BP,k,2,C,i,Y,b,Y,BN,R,q,m,P,i;G7j,C7A,I,R,H,L,T,F,F,7,T,l,V,E,L,L,P,A,N,Y,K,q,Y,K,r,Y,C,I,X,a,E,S,U,Q,a,C;H4P,DCG,d,f,h,S,N,J,E,R,v,H,H,O,X,X,z,P,Bd,U,BS,q,q,F,P,c,i,G;Iuz,Cvu,x,p,B3,r,6,q,W,m,BA,K,F,a,W,S,8,M,m,R,P,T;IpV,Cxs,o,e,c,P,BD,p,w,H,Bf,t,Cx,t,l,M,B8,i,k,q,o,N,Q,O,BN,U,O,a,BM,O;JB1,CsM,Bs,N,Bb,J,BX,C,X,K;JHf,Cry,DM,o,K,K,l,K,2,U,e,T,H,R,b,L,M,N,t,N;JLp,CrM,Y,C,G,F,A,P,H,F,J,E,1,Z,P,K,Z,R,S,m,a,K,D,K,K,U,U,D,K,J;JP3,Cqg,H,A,b,K,F,E,Q,G,C,I,p,Y,O,I,i,A,Q,N,u,H,b,L,N,T;JVw,Crc,R,H,V,C,L,I,A,K,a,K,e,N;JOU,CrW,T,J,R,M,a,Q,U,C,I,G,I,S,W,D,R,f;I9c,CvA,6,D,BG,f,BL,J,d,N,h,K,N,S,v,K;IGD,9K,z,W,D,BA,h,BM,u,0,P,g,M,W,CC,7,W,X,E,b,2,v,z,p,1,N,v,f;IJh,BGQ,J,N,X,J,h,I,3,C,I,Y;IIt,BFc,k,I,6,n,Z,Z,9,H,H,C,J,k,d,E,R,a,I,O,O,C;IMx,BHO,C,R,O,P,h,J,V,O,N,D,F,K,J,D,I,L,b,A,b,i,H,U,e,C,U,S,M,C,W,f,E,R;ISZ,BIk,f,G,J,I,V,I,J,K,M,U,e,Q,u,A,K,P,J,l;IUx,BIU,H,A,D,I,E,M,M,I,M,Q,K,F,H,J,A,L,P,H;IJ9,BFA,N,H,N,E,F,O,N,Q,W,E,S,L,I,L;D3B,CVK,Dk,C,BW,A,EC,A,BU,A,U,m,S,S,a,H,O,A,O,K,m,J,k,g,D,Y,4,m,BU,DI,Ce,Ca,m,H,D,T,C,P,W,N,W,D,B4,e,BY,3,C,EX,BM,b,J,BD,U,X,y,A,D,H,c,BB,p,f,CH,V,t,p,BR,a,R,z,5,Q,K,u,BP,Bt,DX,3,Bp,CJ,J,J,L,b,L,X,S,h,Y,A,C,L,t,P,t,t,BA,V,Y,n,J,L,W,L,I,d,Q,J,a,H,8,U,X,o,b,I,a,C,a,Z,K,z,CX,l,J,k,Bh,t,D,y,T,N,Z,Y,G,V,P,P,D,l,R,P,z,L,h,C,DN,L,CJ,3,T,L,BD,t,Q,g,I,e,D,W,T,Q,K,X,C,d,F,T,BF,BP,6,b,X,B9,E,o,p,BP,f,N,N,r,Bd,BT,E,q,x,M,BP,4,U,8,BC,c,G,K,V,T,f,H,R,H,N,L,b,d,E,h,g,p,E,n,Q,Z,s,n,V,n,Y,D,G,R,A,P,D,L,F,D,A,I,F,E,H,F,J,f,P,F,N,X,N,N,z,Bb,C,P,X,J,X,T,Z,5,P,W,E,c,S,s,i,o,M,a,R,E,X,A,K,Y,b,Q,O,m,n,R,x,q,G,W,w,G,n,a,b,L,I,W,a,G,P,S,T,H,E,U,Y,F,K,S,R,F,F,a,i,k,m,C,Z,G,a,U,V,D,C,S,V,H,R,h,X,I,H,Z,P,O,L,d,F,F,f,I,c,d,J,V,T,I,O,Z,L,r,I,r,W,h,l,O,X,i,C,P,G,T,u,l,O,l,z,c,l,G,V,a,F,V,X,g,v,J,C,a,o,w,D,W,F,X,r,l,L,p,0,J,c,h,CG,BB,R,r,f,A,CB,Bk,By,Bn,w,V,N,J,U,H,C,d,d,G,L,Z,BB,q,Bi,BZ,Z,N,v,u,CB,W,B2,h,k,3,Bk,C,W,z,a,BZ,u,BV,p,4,R,i,R,8,P,A,H,V,i,BL,BF,i,A,b,BV,b,j,q,A,3,CI,C,D,5,2,2,I,BB,BT,9,BD,K,T,a,h,V,9,U,Bs,1,3,5,7,g,U,Z,Bo,J,U,L,R,V,Cx,x,X,a,G,p,BN,z,l,BH,F,u,N,1,BT,C,j,L,BH,r,3,BX,J,g,L,1,Bf,BD,n,D,D,d,BX,j,3,C,g,T,X,b,t,g,W,v,n,f,C,J,L,T,n,N,I,T,b,T,G,T,T,P,Q,D,X,h,T,F,S,T,P,T,R,G,R,BT,E,P,I,T,DC,G7,M,B5,BP,Cw,Ck,HF,BF,EB,BN,j,BN,F,i,Y,Cz,C2,N,6,N,G,R,Bk,5,T,BX,CC,8,BK,BZ,D,m,DW,DX,DW,CB,a,DR,BP,5,B8,Cv,q,Cb,h,o,u,Bd,l,N,F,X,X,BR,H,s,M,P,Y,J,A,F,e,T,a,b,BD,r,A,BH,D,t,M,BB,T,V,E,Z,b,f,L,CF,q,l,x,CK,G,W,3,u,e,K,v,BN,p,CQ,BX,d,l,DP,Bq,E,BT,BL,g,z,j,Bv,g,I,2,CF,4,BN,5,FF,i,M,s,F,G,L,A,X,j,M,T,Cz,BH,u,i,z,A,I,o,5,L,a,BF,BP,BV,DH,Bh,s,c,CD,Q,s,z,CZ,BD,S,f,BL,f,c,j,f,BH,BF,a,4,t,K,Cb,8,Bf,D,P,GV,Bk,BT,Di,GP,HM,Dx,H,CH,Cb,Dr,B0,B3,De,Et,Dk,D,C,t,A,E9,C,A,Bd,CT,A,BJ,A,Ft,D,MH,EA,O,g,Z,F,HZ,j,A,C,BH,Cc,DD,Ba,V,4,G3,By,C,Bm,Cl,Cg,H,O,p,s,z,4,U,BW,B3,BK,Z,By,Ba,7,BD,Bi,Cw,U,Cx,Q,b,BB,Bj,g,S,q,Cj,CS,b,Cy,Bt,B4,6,DQ,d,B6,f,c,l,CO,BQ,C0,g,IK,CK,R,U,C,H,E,r,U,B9,C,G,BE,S,l,M,u,t,o,2,U,3,Q,H,T,x,CS,5,BA,L,BU,CW,r,DQ,V,m,O,Y,1,Bj,Br,s,K,f,D,Bi,Bs,O,h,h,h,Y,f,F,j,b,G,N,V,N,Y,p,p,BE,H,g,i,G,E,K,A,W,O,J,Bc,e,m,f,g,A,T,b,Q,A,O,Y,I,3,o,i,I,D,g,L,W,T,F,P,S,P,c,SO,A,BW,A,BY,A,BY,A,Fe,A,BY,A,LA,A,BY,A,R2,A,BW,A,Uo,A,BY,A,GQ,A,s,BK,BC,B9,QW,CZ,S,A,EM,u,Kk,ET,BC,Bb,BY,O,e,Bd,Em,CX,BU,Fv,DP,FJ,W,f,B4,h,Du,Bu,B6,S,BY,O,q,O,4,U,BA,W,Bs,0,z,By,Hk,g,CK,CK,DI,B6;DwJ,CIA,CM,c,EL,BV,CT,R,U,O,v,A,Be,4,DC,O,BK,g;Dh9,CTA,N,F,N,C,A,L,D,F,T,I,A,O,M,O,K,G,M,F,K,R;D1V,CGs,L,A,K,S,S,K,G,D,D,N,N,L;Dpd,CJe,5,L,J,G,O,C,S,Q,K,C,S,L;Drz,CJ0,L,H,N,C,G,I,C,K,G,M,E,E,G,C;Dnv,CJI,R,F,j,I,i,I,E,I,A,G;D6B,B1q,D,F,P,W,O,J,C,H;D5r,Bzq,f,F,e,M,M,6,F,o,I,BD,L,j;D6d,Bzg,l,P,F,A,Y,K;D8x,Bxu,H,D,S,a,u,k,f,d;EQp,BXU,H,F,P,E,J,G,F,O,Q,T;EQx,BXo,D,N,L,U,H,W,K,H;ELT,BTG,p,n,Y,o,W,Q,A,O,S,K;EwH,BhK,J,D,j,Q,D,I,Q,G,K,A,a,P;FC7,BcA,H,A,M,W,Q,W,I,C,E,J,R,P;FCJ,Bcy,J,A,I,K,w,a,O,C,G,I,E,A,D,J;FEJ,BZ2,A,S,Q,m,i,0,O,I,n,5;E6l,BgC,L,D,s,e,I,K,M,A,T,T;FDf,BWO,t,CS,D,4,E,U,I,BT;GQH,Bvu,b,C,G,G,I,C,E,D;GNT,BtK,V,A,J,M,K,A,K,D,I,J;GJx,Br4,N,D,N,E,N,U,N,O,G,E,K,P;GPP,Bva,P,F,N,E,R,S,k,E,S,N;GOt,Bv6,o,L,W,E,E,F,D,F,z,J,R,E,A,I,H,I;GJx,Bts,K,R,f,C,J,S,F,E,L,A,D,G,E,E,g,N;GYF,ChA,C,F,J,F,H,A,J,G,F,A,C,P,V,I,D,E,E,G,M,G;GYz,Cgc,E,H,V,E,L,E,H,Q,C,E,K,A,S,P;GXP,Ce6,E,K,a,T,D,P,N,C,L,K,P,C,H,I,H,Y,P,E,N,O,Y,c,M,F,G,P,h,N,U,H;DsP,CJ0,F,F,D,K,E,K,E,A,C,H;D1J,CEA,Z,f,A,G,c,m;D5B,B8O,L,F,e,o,a,u,J,Z,N,X;D87,Bxw,N,C,L,E,D,E,K,D;EOX,BRg,H,F,F,C,A,G,J,M,A,E,U,N,A,F;EMv,BSA,F,A,C,E,I,G,C,D,A,F;EMJ,BSU,H,A,I,I,E,A;ENb,BRu,L,H,L,E,K,E,g,G,N,H;EOp,Bl4,J,x,F,Q,A,S,G,K;EPV,BRU,K,I,E,M,G,L,A,H;EKn,BZu,r,Ba,N,q;EPz,BRK,H,A,A,E,I,E,G,A,A,H;Emv,Bh0,L,L,A,E,I,K,G,E;Elr,Bje,D,F,d,I,D,E,e,H;EkH,Bjk,T,F,b,A,H,C,q,G;Enz,Bi4,L,E,P,A,K,G,C,E,U,M,H,J;Emj,BiK,H,H,G,e,J,a,I,N,E,P;EZ5,Bhm,V,H,X,E,Y,A,m,S,O,C;GYT,CcQ,D,D,F,A,H,I,A,E,E,E,I,L;GWz,Cc4,D,H,J,F,F,C,A,G,D,A,J,H,A,M,E,O,E,A;GXL,Cde,N,E,F,E,E,Q,I,D,C,D;GYN,CgO,F,D,L,C,H,G,D,E,E,M,E,C,E,A,C,L,K,L;DjX,CSk,J,F,J,A,A,K,C,E,C,C|BWt,DCh,A,L,h,K,H,E,K,I,U,A;B5r,Cyb,BS,J,K,f,o,L,Y,M,0,9,i,A,D,h,W,L,7,X,BP,BG,BX,m,CZ,i,N,S,O,I,BT,G,CE,G|Dv0,Xz,F,J,J,F,F,W,N,O,E,A,M,J,E,V,E,G,D,G,C,M,H,K,C,C,I,J,C,H|SX,zn,T,A,A,I,O,K,K,A,A,N;uV,Zt,J,D,D,C,A,G,C,G,E,G,K,H,G,H,F,F|Gp1,BQt,D,D,F,C,F,G,D,G,E,E,G,D,C,H|DRP,6w,h,L,C,G,Y,O,K,D|DD1,CpZ,BW,L,K,L,b,X,4,V,H,g,BG,E,W,Z,f,N,i,N,C3,9,G,h,Bx,Q,a,f,3,H,N,X,b,O,Z,W,Q,o,Bo,w,J,o;DIf,CqB,C4,U,Y,P,CH,Bv,BF,F,V,f,BH,L,3,a,CU,6,BH,M,BE,O,1,e,N,a;DK1,CrF,O,D,O,C,P,h,R,C,T,M,H,I;DCh,Crx,C,T,R,G,H,I,I,G,I,A;DH5,Cpz,d,A,H,I,A,Q,W,C,U,J;DGh,Csf,P,F,H,K,D,I,A,G,I,D,O,J|EOf,BAa,G,F,M,G,e,D,E,J,X,D,R,H,V,C,F,S,G,C;EKB,BBk,D,D,H,C,P,J,J,A,G,G,E,C,M,C,G,A;EJf,BBk,T,D,S,I,G,G,K,D,A,D|DWz,BqK,T,H,H,A,D,C,S,I,Q,Q,E,D|DVv,7i,J,A,C,K,W,C;DWX,7W,R,A,H,C,K,G,Q,C,E,D;DVZ,8c,E,H,P,E,J,A,H,E,S,A|DtL,BIO,D,F,L,I,X,A,F,K,I,C,c,F,G,J;Dt3,BIc,F,D,N,G,A,G,F,A,J,G,C,G,Q,A,G,T;DvV,BIe,W,L,O,A,C,D,L,F,f,D|DOf,2A,A,N,P,E,A,K,I,M|Gh,Ciy,C,L,J,D,J,E,f,D,E,S,c,D|IH,Cjo,J,N,T,E,D,E,W,I,E,A|OP,Cyy,p,b,T,E,T,D,S,e,S,K,U,W,S,G,I,F,I,Z|In,Cqg,C3,r,Ff,Bg,EI,CI,Z,BO,B3,X,BI,8,FG,o,BB,o,m,CK,CV,BO,Bw,BQ,Gx,T,Be,CE,Z,CI,B9,h,BL,CF,B2,Eg,DD,J,BS,a,D,Co,B2,q,z,m,BQ,Bm,GW,M,Df,DZ,HS,G,CV,DZ,CV,p,CE,X,Dn,f,FS,p,C8,D3,Ds,B3,o,Bp,Ch,W,DA,BP,t,BZ,FY,v,h,B5,Dr,CB,DM,X,Bd,BZ,Mx,r,CN,Bj,GZ,h,Eu,Dk,DY,E,CS,Bs;Nj,CwA,K,F,U,C,H,L,7,b,L,K,L,A,R,Q,F,a,W,G,c,A;IP,DFE,X,A,M,M,m,C,F,H;DX,DJM,H,D,V,U,Q,Y,Q,A,E,H,D,H,L,A,E,b;EP,DJS,E,P,K,E,Q,P,W,E,f,BZ,V,b,N,G,Q,o,J,Q,h,F,F,K,h,I,6,O,R,c,Z,E,E,G,m,S,M,A;Cf,DKK,A,D,N,R,A,J,R,C,D,C,F,K,C,K,C,C,G,C,G,D,I,E,E,A;KN,DDo,Z,D,T,M,H,I,C,G,G,C,S,D,I,L,E,L,K,D;Jd,DDe,L,E,N,M,U,E,I,D;J3,DEa,D,H,Q,C,u,L,H,L,P,F,b,K,l,F,L,E,F,M,N,H,L,E,A,O,I,O,M,C,o,J,G,J;Iz,DE6,T,H,H,E,D,O,V,E,T,K,O,G,Y,N,I,L,S,D,C,D;VV,C6i,L,D,D,C,U,O,S,C,L,J;Qf,C22,Z,A,V,G,N,c,E,K,K,I,O,C,S,L,M,V,C,R;Sp,C5u,Bt,L,F,G,G,E,Y,E,I,a,j,M,A,K,q,K,e,Z,m,J;Tx,C4a,O,r,H,N,h,L,N,A,I,M,H,W,f,R,L,C,K,Y,Q,I,M,D;TR,C4C,F,D,P,E,D,O,G,I,a,I,N,E,G,M,c,M,O,C,P,X;UB,DCQ,b,j,t,V,e,D,H,N,Bt,3,Z,M,s,W,p,Q,O,K,T,G,F,M,O,Q,8,H,L,W,Bi,m,Q,A;UR,C7u,H,D,J,A,R,O,W,G,I,F,E,F,A,F;Tz,C9e,A,n,BY,J,I,J,BD,n,J,g,x,F,j,e,x,G,R,Q,M,M,Y,C,J,K,w,I,E,O,m,R;XR,DAE,Y,L,T,V,d,A,n,O,D,E,Q,I,i,A;XZ,C8Q,J,D,T,E,J,M,C,m,c,D;X7,C7w,R,F,J,C,E,K,M,C,K,F,C,F;UF,Cye,BZ,H,F,Y,BH,u,BJ,7,Bl,U,3,m,A,O,BM,W,h,W,BK,O,i,0,g,M,I,H,CQ,k,Ba,V,BC,BD,h,l,8,E,W,h,p,K,M,5,Bp,r;Dd,Cng,R,H,L,N,L,D,N,A,z,Q,y,U,i,J|C5m,BUu,M,R,C,Bx,E,J,BF,x,N,q,l,J,N,CL,i,F,M,h,Br,Z,I,t,BD,Cz,A,f,P,R,IR,BA,DJ,Ds,F,q,I,K,Bo,BN,Gi,o,GM,GE,C,C,I,C,K,F,H,BL,I,L,U,D;C5i,BTa,C,I,D,E,L,A,D,H,D,N,G,A;CwC,BQQ,P,D,P,I,k,O,I,K,I,J,P,T;Ctu,BQW,F,D,F,O,K,G,G,L;Cx8,BQA,A,J,V,C,H,D,j,G,M,I,c,K;Czs,BQ0,D,F,V,E,H,G,O,I,G,J|B9Q,Cb4,H,D,KP,DJ,s,BE,BD,Bz,S,f,p,M,X,m,x,D,V,S,Bv,e,f,C,P,Z,T,F,FZ,o,5,2,DU,O,Cp,B4,W,Bz,Dd,V,Dx,Cr,U,BP,F,R,BB,g,CB,X,F,R,Bb,Y,X,U,K,G,w,I,D,e,Be,BO,C,BU,Dw,J,r,Y,J,6,BB,a,H,BA,BV,s,A,Bg,FH,Bq,C7,n,F,H,L,D,BV,1,Dz,3,Bn,u,EV,c,v,b,H,D,F,C,F,U,P,K,T,D,V,G,N,Q,j,K,Z,e,V,A,C,g,g,Y,S,k,a,g,E,I,I,C,2,F,f,a,C,BW,DO,Ce,BO,e,X,0,Y,Q,Bb,Ba,A,c,L,O,A,C,FW,BU,RA,CL,s,CC,Cm,q,m,D,E,A,Gk,s,B2,Bv,n,Br,Di,t,4,CL,F4,I,CC,Bl,Gi,BH,BR,B1,BA,n,BL,v,BC,BD,l,BP,DH,L;BpQ,CZC,c,L,Bd,M,d,K,L,W,a,V|BvW,DP,X,A,Kj,N,D,D,J,A,X,A,BN,BP,T,F,P,a,t,L,H,A,A,G,BK,HC,EO,D6,Br,BW,i,DO,N,G,G,K,4,y,BS,X,y,Y,BG,5,o,m,CI,i,Bk,Z,y,u,w,u,e,BF,BA,x,C,Bl,BW,B1,W,Cz,DX,FB,J,DP|CvU,CBK,D,J,L,c,H,e,G,K,I,D,H,L;C4k,CJS,0,D,Cg,L,N,B6,Dc,CC,BY,p,BB,BG,Ba,e,Eg,B1,U,Cn,F0,BB,B2,Dl,EI,Cp,JM,Dx,V,Bt,C,X,L,D,CR,u,t,BD,CX,Z,BB,Cj,Ed,Bl,P,BT,Bd,t,EH,BS,R,D,F,I,Z,DK,Ch,A,DX,Cy,Gz,CS,F1,j,CZ,B9,CX,V,D,O,H,E8,CT,BA,BE,CG,Bd,d,BB,CC,q,CE,DA,BR,Cu,BK,C9,Dk,Cr,d,Z,Ch,x,BE,Z,y,B0,BM,Da,m,CW,BN,B2,CL,Bm,E|BVw,CFe,v,H,P,G,O,M,k,I,M,N;CJ4,CJ6,BA,T,W,O,Bu,N,U,Y,k,E,Be,BP,u,P,A,F,E,L,i,b,S,r,f,x,c,BB,J,J,2,X,BI,E,Ba,7,I,L,C,F,I,H,J,A,n,Y,p,BJ,BN,J,y,Bv,G,Bd,e,N,v,Bd,BM,j,F,3,s,f,F,b,A,F,J,G,Bj,n,d,BC,3,R,Dd,e,BB,x,V,F,L,Y,Jh,Bx,It,Y,F,B1,Cb,BB,O,Q,S,C6,Kh,Cz,FB,Cg,FB,CJ,CV,By,E5,D,Ci,BC,DL,L,H,DO,DD,8,e,BK,CQ,n,BP,0,c,Cs,Cj,R,O,Bq,By,BU,HU,D,Cs,BM,CR,Be,Gw,X,G2,C6,Fs,C,EE,Cd,GW,BJ,Jw,Bm;BcW,CLY,F,Z,q,9,Cw,BD,V,t,Cj,O,CL,X,x,5,Db,B9,K,u,Bu,BC,CV,K,H,K,6,s,A,6,2,W,E,K,J,o,j,U,T,E,A,E,0,q,BY,W,4,E,w,h|lG,BtC,I,CT,EH,Cj,h,t,e,B7,BL,Bh,1,X,Z,L,N,w,Bb,FS,CP,BY,Cr,EK,Ca,C4,J,Fw,BM,BW,w,M,DC,BE,CG,B7,CE,BG,B1,C3,CE,DD,Df,Dj,EY,C9;kY,ByG,h,P,G,M,U,Q,G,F;jW,Buw,V,H,d,K,C,Y,E,G,i,A,U,P,E,H|DKB,kE,L,D,C,I,S,O,k,K,F,P;DKz,gq,h,L,CZ,D,4,i,a,G,I,2,J,U,f,Q,4,Q,Bc,I,X,j,D,n,O,h|JHD,BGT,G,G,K,C,A,H,R,V,J,I,d,M,F,K,I,I,A,H,g,L,J,D;JDJ,8J,J,N,F,A,N,M,O,O,G,A,K,F,A,F;JGP,BGt,D,f,L,O,A,G,K,K|C4,jc,H,V,X,Bn,B0,BR,2,DF,P,Gp,y,CR,h,P,BB,P,Z,N,CJ,Cc,g,E0,BB,BM,e,CM,9,M,e,Cq,Bh,BO,S,BQ,P,M,u,L,BC,R,C,J,e,G|GhU,aR,P,j,P,G,O,U,I,G;Gfc,er,J,a,N,S,D,Q,c,E,K,O,A,Q,L,I,b,N,H,C,F,W,W,Q,e,q,CA,g,Co,G,BI,c,BE,V,BP,9,Fh,CN;GcI,eJ,g,Q,w,O,A,L,H,P,T,V,J,F,f,E,J,D,J,I|FVA,lq,F,X,N,I,E,M,E,E;FUa,mq,A,H,L,E,F,D,N,C,H,c,C,G,I,D,S,X;FHc,Ze,D,P,J,A,J,L,F,A,J,e,I,q,E,G,G,N,Q,F,H,b;FM8,BDi,D,N,BU,R,D,CD,CQ,A,z,Gf,Dq,CK,B2,BR,Cm,B6,Be,V,Ci,Cx,Q,DN,Co,Cn,d,Dd,1,t,N,F,D,D,V,X,7,o,FH,V,7,n,BL,Bx,v,L,k,Cz,0,x,F,BH,m,BP,F,D,Dd,DC,DD,C,M,Cg,Ct,C,DF,KF,Q,DZ,B4,E,CS,Gp,BJ,2,FK,DV,8,v,BB,Bf,v,a,Bd,3,b,a,U,m,H,4,l,C,Z,q,BT,S,b,c,V,z,z,BA,FD,Ew,y,FM,c,BI,C6,FC,Bh,GW,DD,EE,CO,Ea,E5,HA,BO,O,2,Du,GY,CC;FMy,fS,D,F,N,O,F,I,M,A,G,J;FMy,e6,C,N,H,P,T,J,H,M,C,Q,C,E,S,A;FLe,VC,F,A,H,Q,I,W,K,d;FIC,Zk,D,D,L,m,O,L;FHI,dM,N,D,C,M,C,G,G,C,C,N;FJm,Ye,E,Z,H,G,H,K,A,Q,C,C|CDa,T5,O,t,N,N,N,G,H,O,J,D,P,Q,P,C,N,U,G,S,F,e,Q,Q,I,a,K,T,O,BB;CEm,P1,F,BJ,L,b,L,L,J,C,N,M,K,0,H,k,W,D;BsM,eX,N,G,C9,BE,F,W,z,G,t,0,BX,K,z,BE,H,Q,H,S,Bp,Da,CL,CW,O,B4,7,Co,Q,BS,A,K,BC,D,BY,BM,4,Bm,BK,BC,D,6,BJ,W,U,Ba,E,G,I,A,w,M,K,o,P,B2,9,BI,H,a,G,C,C,C,Ki,M,W,A,Q,A,Ly,Gn,H,Bd,FM,D1,F,T,BT,EL,Ca,DF,z,El,BY,FD,CU,Bb,C,F,GX,DF,B1,Y,BP,BR,Hn,W,t,D,D,I,BH,Be,M,6,V,Bw,z,Bo,BD,u,X,j,Bh,M,Bj,q;CEG,Zv,L,D,N,K,y,q,M,Q,D,R,R,j,N,D|Dgk,B54,I,O,C,y,Bu,CU,1,0,I,Be,Cf,6,O,y,6,e,Ci,N,Be,Bs,BH,Q,CE,G,N,BM,e,o,BI,X,CO,BO,BI,BD,BP,BH,Bs,f,M,C,A,F,BT,3,B5,y,Bb,V,7,3,M,BB,D2,O,8,p,CK,q,BA,BD,Bc,P,EW,y,K,D,C,L,H,j,o,1,X,Z,U,x,i,R,BA,a,Bs,p,F,BL,e,BF,L,j,u,r,p,d,H,F,D,C,E1,s,FV,Ch,9,Bc,e,Cg,CR,Bw,CP,C1,CR,H,n,BZ,E7,E;Dp4,CIE,H,D,L,K,F,G,E,C,K,F,G,J;DqE,CEe,T,J,L,A,R,S,k,F,I,D|GSW,BK8,j,CP,V,G,CJ,Do,K,By,C6,Ec,Bw,y,BG,BB,Bt,Fz;GJ8,BRG,I,N,F,L,b,G,D,I,K,D|B1w,B12,Ca,BA,E,B0,Is,Z,Jg,Bw,K,Z,A,D,Db,CV,K,CZ,BL,D5,GP,C9,7,d,z,b,Ff,C9,Bd,O,Bj,BC,V,E,I,S,C,M,K,M,J,c,H,G,C,S,J,S,G,O,E,M,G,C,e,a,R,W,G,M,Y,U,4,C,T,S,8,6,R,q,j,O,U,W,L,K,BT,H,R,s,N,DO|es,CdS,G,D,Q,J,F,R,R,Z,L,V,A,P,C,J,C,A,Q,A,I,A,u,L,G,P,y,T,s,a,U,R,A,J,J,b,E,l,BN,A,O,BB,Cz,w,BB,CH,Bt,CA,CD,Bt,CX,F,J,G,F,G,v,q,K,W,N,c,BF,C,r,X,K,P,P,N,n,L,J,O,a,O,H,k,S,e,y,e,G,i,u,U,BE,6,V,O,e,U,6,N,e,Y,a,I,Q,F,Cw,K,h,O,i,S,Cg,l|9i,DAk,T,H,J,P,d,H,F,v,Y,R,b,J,R,Z,t,R,d,l,n,N,c,g,l,m,I,O,D,s,BS,2,2,A,S,S;1U,C5k,V,L,F,BE,s,BA,U,E,2,BW,Y,A,x,BF;ku,DEc,Di,Dc,p,C2,B4,BI,CV,BM,E,GE,GU,B0,Bl,BU,Cq,CU,M,Cq,DC,k,EM,FI,Dq,M,BO,B6,FY,p,Bq,CK,a,C,4,N,Di,Bf,Cu,f,Ci,BX,d,P,L,BX,4,J,T,7,BI,BD,7,BF,A,v,Be,Bb,3,H,Ez,Q,DN,Bv,3,Bp,BO,BJ,Cd,B5,Kz,EZ,h,F1,Fm,Cz,DV,Bh,CI,H,BF,t,Gt,Bh,CS,f,Dh,Hp,Dn,C,Bv,CX,EJ,C,BX,C0,BU,BE,FR,Fo,K,CU;9y,DA0,F,N,L,A,L,K,S,O,e,A,K,F;7a,DEa,P,D,G,K,E,E,M,E,G,D;8A,DF0,H,H,F,I,C,C,C,I,K,E,Q,F,A,D,R,H|BpE,BVv,E,D,S,L,C,T,H,j,O,x,A,BD,H,E,T,A,H,Bl,Bl,C,BV,m,l,BC,T,G,C,BI,BU,B0,i,U,Bu,v|Cyt,RS,BD,Br,a,Cj,BG,B7,l,3,D,BL,BT,Bj,F,D,J,A,BD,2,BV,h,BH,H,z,W,h,1,s,t,D,f,T,L,BZ,S,H,C,J,G,CN,C0,V,Bs,BJ,C,BT,CS,a,CU,B4,o,c,Bs,C,F,q,Be,Dc,7,O,0,DO,G,Cg,l,H,BB|Bvm,Nm,x,v,z,v,Bl,Y,CJ,j,p,n,BH,4,z,Z,BT,W,5,z,H,L,F,I,Dr,Da,r,E,z,t,Bl,W,Bv,f,Cb,CO,J,O,P,Q,f,Bk,CL,BQ,f,B0,DL,CO,n,m,C,6,BJ,BE,Bz,e,V,BK,J,E,C,G,DY,FQ,CG,Q,Ck,DB,Ee,f,Ci,A,Du,DE,Ds,Bp,EI,EU,BL,C4,CG,q,Bi,A,P,Ev,Cg,B1,F,CV,m,A,A,J,D,Cz,Cj,X,5,Bv,C4,BR,Cm,Cv,Bu,Dt,E,F,n,l,C5,C3|Bv6,eg,n,A,E,CU,Ch,B0,O,Eu,Bj,A,CH,r,BK,C5,EJ,EV,Dt,Bo,Dv,DF,Cj,A,Ef,e,Cl,DA,CH,R,DZ,FR,D,H,V,E,Bp,a,R,u,g,6,G,Bi,BR,CE,BF,BG,P,Y,G,W,Bv,FQ,Br,a,Di,I0,DW,k,C,Kw,A,Bc,A,Y,A,BO,DO,A,A,E0,A,Bm,BO,A,lI,A,C,v,B4,Jh,Di,Cb,I,N,BR,Bd,CT,3,V,v,BT,A,V,Cd,Bj,Dx,M,B5,G,5,R,3,BB,D9,Bf,d,Bz,Cl,l,DH,BL,E,v,t,1,Dt|EJ8,fE,N,D,N,S,C,E,C,C,E,A,E,N;EJo,dM,G,P,R,K,L,I,F,G,W,H;EKA,fo,2,D,Be,BZ,CI,DD,Bm,Dr,v,Cx,C9,Bd,CB,i,x,CM,f,EW,I,W,G,3,BA,FC,BG,V|FI,CAu,F,D,h,C,D,I,I,M,M,N,S,D;KK,CEW,y,D,M,R,t,BB,j,T,3,S,V,e,P,E,b,R,b,S,A,I,Bs,8,8,K;N0,CEg,BD,W,V,C,H,E,C,Q,q,E,i,L,S,X;Eq,CBi,J,N,n,I,I,O,I,C,A,K,K,K,q,I,K,H,C,L,b,X;Fx,CQC,BO,j,L,n,Cy,z,D6,X,O,g,CG,h,Q,T,F,L,E,L,A,J,E,F,I,D,m,O,G,A,e,J,i,X,i,O,Bc,R,w,Y,BC,H,G,N,T,Bp,H3,DX,DX,EN,Bs,Cd,Hd,GZ,HT,N,EF,CP,B5,C0,DF,8,x,H,H,Bw,Bi,Be,BP,2,BG,B6,Bv,B6,Bm,K,u,CC,X,CQ,CS,Bk,BV,BU,E7,b,Z,BE,Bp,p,P,D,BF,EA,Ew,B4,S6,BL;0r,Bdi,T,v,R,T,h,L,z,BE,O,I,BC,G,o,e,o,E,A,L;sR,BfQ,N,N,R,E,O,m,c,M,W,E,Q,U,I,J,H,L,H,d,P,L;tz,Bc2,b,X,h,I,a,G,a,S,u,Bk,c,G,G,f,H,l,P,h;xr,Bcy,D,R,G,R,D,Z,L,N,Z,N,V,C,L,E,V,W,A,U,S,O,I,S;3b,BcY,L,D,J,G,L,Q,G,M,G,E,K,A,Q,J,G,L,A,H;5t,Bbs,T,h,b,M,L,K,Y,C,Y,Q;5h,Bd4,H,A,F,O,Z,o,O,Q,a,C,M,N,A,j,F,L|Gke,B72,I,c,BW,BK,DE,G,a,K,o,0,y,Bb,Ck,Dn,F,DR,i,A,x,CV,z,r,B1,F,P,v,CX,Q,C,v,BD,U,R,BL,P,8,CV,Bd,3,BK,BE,e,9,BE,Be,CU,1,Co,BF,Q,BE,w,BO,n,W,Y,BL,Co;GrS,ByQ,T,N,b,Q,H,K,U,M,Q,Q,K,A;GpI,ByS,F,V,P,D,J,O,P,J,J,c,S,K,K,H,O,D;GjM,Bw2,N,D,N,I,C,I,W,S,E,G,S,F,I,J,J,P;GkI,B7u,A,d,V,E,L,e,I,K,Q,J;Gk2,Bww,E,J,R,C,J,I,A,I,K,C;GoQ,Bxq,D,J,L,K,K,K;Gjy,B3s,F,N,N,I,F,c,O,J;GjA,ByC,D,F,J,A,L,O,F,M,J,G,O,I,S,R;GyU,B64,L,H,L,G,D,G,G,G,M,C,G,F;Gjg,BtK,T,D,P,U,G,M,c,S,BK,S,o,H,G,R,N,V,7,V|Bgs,BJl,E,A,4,I,Ck,l,CY,D,S,N,A,L,CQ,Gf,N,En,E,P,H,D,Bv,u,j,V,BV,B1,D,BJ,S,H,k,BD,BU,n,Bk,D,G,Bk,S,A,G,F,S,C,e,H,Bu,C,J,v,Bh,El,Gv,H9,Jd,Ht,Fx,CN,Jv,G,IL,Ch,EH,CS,BH,t,Bz,Eu,Bi,BE,Z,Cc,Fl,KA,H,E,B8,B4,8,x,S,BZ,CG,j,Da,P,BO,BM,Ba,Y,A,Ke,A,BW,K,H,Cc,Dl,V,C5,DO,F,ES,E4,Hy,BR,Fg,HE,GY,EO;Bf2,Bih,6,CG,T,k,CL,Bo,C3,BL,BP,Br,BB,p,BG,CJ,BK,5,2,J,BM,Bk;B8I,Cbb,L,F,p,C,F,I,S,S,W,F,U,N|CJ8,Ff,Bx,Cq,F,L2,Ck,DM,Y,k,I,K,FO,Cm,Eg,O,JA,JM,y,w,e,s,Cm,D8,A,F0,Y,C,HE,By,t,Ef,BK,F,Bf,R,GF,Nd,HB,JT,KN,H1,Gv,H3|Ch2,kU,A,F1,Cn,D9,f,t,BH,A,CJ,A,Jr,DQ,Dr,D0,l,BW,y,BG,C,I,a,m,o,BA,m,f,DE,C9,Em,BU,Ca,T,Cq,BW,E0,Q|ITI,bd,L,D,P,I,H,G,C,K,I,E,K,H,C,J;Iqe,lp,Z,D,N,S,I,E,O,D,E,L;In4,it,h,F,P,P,R,C,H,M,A,E,K,A,E,M,K,G,W,C,c,H;IWA,mF,P,H,P,E,L,E,H,Q,T,K,3,Q,F,I,E,O,Q,F,BM,r;IZI,fF,A,d,P,Q,J,H,H,I,C,i,N,g,K,F;IRg,db,D,D,L,E,N,A,H,I,S,Q,K,H,K,D,A,N;IUq,dD,Q,D,g,b,J,J,P,E,F,D,H,K,P,I,P,A,D,K;IM4,al,O,R,O,n,D,N,N,A,D,J,P,S,h,O,H,k,r,D,L,L,P,E,D,K,C,K,S,K,W,k,M,C,W,J,C,f,I,N;IOU,cd,F,D,F,I,K,W,I,Z;IOC,cB,V,R,P,E,N,O,G,U,M,G,G,G,W,H,E,F,N,L,E,D;ILs,cH,A,F,N,G,Z,a,E,K,e,U,G,N,H,R,H,F,F,P;IJc,Zj,F,F,H,M,H,C,A,M,V,U,D,O,M,O,Q,J,Q,T,S,F,F,N;IJK,aX,D,H,L,a,C,U,E,C,I,d;ILA,aL,F,D,X,A,R,W,A,O,M,O,Q,C,K,F,I,N,C,R,D,N;IGs,W5,V,F,N,G,E,Q,I,I,Y,P;IMi,cR,D,H,L,C,b,K,D,E,a,C;ITU,d5,s,h,BO,C,4,j,m,3,j,P,BF,W,Bh,G,v,0,D,k;ITu,bh,DD,Bk,BH,4,d,s,2,N,4,x,BW,n,BU,9,L,R;IMC,Xp,G,J,R,N,b,S,r,E,p,c,p,2,r,e,J,Y,e,A,BY,z,g,3;IWi,az,y,9,N,n,s,h,q,CH,l,s,BD,u,V,o,X,BG,K,Q,Z,i;IZq,hh,8,T,S,G,k,1,A,P,Q,J,z,A,BF,U,z,e,L,q,p,G,C,a,k,J|BKs,CiS,F,J,b,h,T,l,h,Z,D,h,F,F,FP,c,B5,BT,Dl,b,P,r,DH,F,B5,w,F,A,N,G,t,BI,D,K,S,e,A,C,I,Q,o,k,B0,G,BE,k,O,m,Ba,u,q,E,E,A,W,D,q,V,6,o,BE,v,D,j,8,F,8,q,EI,E,Cq,BF|1S,CaA,T,E,Cj,BD,C,BH,BP,d,O,z,Bx,C,t,k,p,l,Cj,I,M,E,Q,K,e,E,f,e,d,K,G,e,V,C,H,I,e,i,r,G,J,K,E,M,4,c,E,M,I,D,Cm,X,BG,q,Dc,O,Q,g,K,E,m,A,G,H,G,X,I,J,A,J,a,Z|FZY,ES,f,N,j,M,M,S,W,G,k,R|hL,bY,D,J,P,1,r,Z,R,BB,CB,Bt,x,BD,J,I,DD,Ba,C,BK,BN,O,X,BE,BB,4,BO,o,7,L,H,0,e,I,r,W,F,M,0,K,B6,Ck,Du,U,B4,CT,P,n,a,J,Y,BT,r,BD,BI,g;ob,YA,D,H,P,M,BH,U,U,K,u,E,W,N,C,J|C3K,PJ,A,V,L,I,D,M,V,Q,Q,K|BG4,CUm,CW,7,BU,i,c,N,S,R,x,b,o,n,E,D,J,F,P,d,l,P,H,9,g,1,BY,1,3,BB,x,J,H,r,S,f,X,f,R,F,F,C,R,I,n,N,f,E,5,R,N,C,F,G,D,O,Q,I,c,4,BL,Q,C,Q,BH,0,t,Q,J,S,l,N,G,b,j,Z,D,T,b,H,C,E,R,S,CJ,u,BX,BI,A,C,M,K,o,F,K,Q,z,BE,8,E,G,K,Bf,BC,G,i,o,BI,BB,D,H,A,D,G,S,G,H,q,O,C,C,K,y,H,C,I,BT,m,M,a,d,O,G,M,X,k,M,O,C,E,E,A,g,S,m,F,y,g,CM,H,G,F,M,N,Bi,9,D,3,CU,BF,d,d,k,X|nn,vw,S,h,J,n,q,z,M,BF,T,z,s,BB,g,M,S,T,m,BJ,N,BV,O,L,D,R,P,E,DD,R,Bt,m,b,J,F,c,BF,G,BD,C,BF,C,Dr,A,BN,n,Dr,d,J,K,BA,q,9,F,F,BQ,A,Q,DA,U,E,i,Bq,O,c,g,C4,BD,BW,i,f,a,BZ,J,B9,BA,BV,R,R,d,DZ,A,H,U,H,BI,C9,CU,DI,DI,G,W,8,CO,Fg,a,CI,Bp,Be,T,o,Bb,C6,Cl|B5C,BT2,l,e,n,O,H,K,G,I,M,P,g,N,o,f;CLc,16,Q,D,J,G,G,M,W,T,D,d,T,U,X,F,N,G,V,U,F,O,Q,I,E,M,F,K,M,D,G,L,A,n;Crq,9S,x,J,It,BP,GJ,FR,MB,B0,CB,Dt,D,Q,Gj,Kq,Ex,D4,Cp,I0,C9,B2,Hn,ME,Bx,G,i,CI,e,CC,Dm,f,CO,CK,CW,c,Bk,Bk,DT,DM,Gk,Bq,e,W,s,H,DO,f,Fe,Cx,Ic,GF,FY,d,i,I,m,H,CS,R,w,Bf,Ce,C,M,T,FU,Fx,B2,Fx,O,R,M,X,W,X,Y,D,k,K,O,L,m,3,I,A,E,r,DI,Dt,IQ,BB,O,Q,O,X,BO,B5,CJ,Gd,JP,DH;B4E,BU6,D,D,L,G,C,Q,G,K,A,N|X6,FE,H,H,L,E,D,I,Q,U,G,F,C,F,A,H;Ve,Y,V,P,J,E,L,g,C,K,I,M,W,M,M,A,M,P,A,T|oS,CRm,N,D,H,I,I,K,M,C,C,J|I75,rd,W,T,I,Z,J,Z,X,G,r,F,x,2;I5F,tV,5,A,l,K,Z,S,F,K,O,I,Y,C,0,P,G,N,W,J|DLV,qc,H,F,R,O,C,Q,S,O,I,A,E,P,D,T;DLh,p4,D,D,C,A,D,A,D,A,D,C,F,A,A,C,E,D,E,C,A,C,D,A,A,C,C,C,G,C,C,C,A,D,C,A,F,F;DL1,o8,D,D,D,C,C,A,C,C,D,C,A,C,C,A,C,C,A,D,C,D,D,A,D,D|DKd,sk,L,V,X,M,D,S,C,K,M,S,S,Q,E,R|DPt,3O,L,F,J,G,A,O,K,A,I,H;DQD,3m,H,F,J,O,R,C,N,I,C,K,I,C,Q,L,G,N,I,H|Bha,Ef,G,A,s,K,O,b,S,E,BM,BO,W,A,I,A,H,D,G,b,8,BJ,O,B3,L,p,x,N,J,A,F,A,Z,S,7,X,n,Q,N,BP,j,P,BB,F,n,m,d,E,H,N,F,N,T,I,N,u,2,y,C,BO,q,8,m,W|Hkk,CQM,E,D,C,C,E,A,C,D,A,F,D,A,F,D,F,A,A,C,F,E,A,C;HmI,CQu,H,D,J,C,F,A,C,C,G,C,E,A,E,D;HlI,CQC,F,A,A,C,M,G,C,D,D,D;HIg,C1u,Z,j,T,D,P,I,n,A,6,a;Hzw,DEY,R,D,J,E,A,E,Y,K,Q,M,M,N;GP6,Dxw,z,L,t,C,f,O,Y,I,o,C,Y,D;Gdu,D0O,j,E,H,M,S,C,Y,D,U,J;Fgy,EES,z,C,I,I,6,C,W,O,k,A,Q,L,A,H,t,A;Fke,EBK,X,A,H,K,U,M,Y,A,c,H,K,L;FEy,D9G,L,F,X,C,T,I,H,M,O,E;FCa,D7y,L,D,L,C,D,M,c,U,i,J,A,F,R,N;FNC,EIy,t,D,I,S,W,C,u,H;D9m,Dy6,Bt,G,f,I,i,I;ESy,D1A,V,H,v,I,L,G,K,E,e,C,Q,D;EZa,D2M,L,N,BD,K,e,I,BE,G;Efg,D32,BI,C,Y,L,n,X,Bv,E,b,I,O,K;DFU,EOS,r,F,Bl,K,Bg,M,6,P;JWB,DkY,OW,EF,Bm,BF,P,CX,Cu,BR,8,o,Ch,CI,I2,h,Gq,Cz,Fj,3,4,7,FN,k,B0,CD,Cx,p,CO,BX,Ch,f,HP,Bq,CP,CK,Hf,G,Bt,Bs,BU,BM,Dt,t,BE,CJ,CH,Bd;Gxk,CMc,H,G,D,I,H,K,P,K,F,O,K,G,CM,Cm,5,Es,Cy,Bk,EE,p,FI,IC,H,CC,L1,Bz,Bd,Dw,Jr,DC,E1,Je,H3,Cm,JZ,BP,CJ,Bd,CS,CB,Ez,Gj,Ef,Bz,DL,u,r,Q,L,M,Hh,BQ,Ll,Dp,Gx,k,GJ,DM,LB,X,DH,BG,v,Cm,KZ,Ce,DJ,Ct,BE,DL,C3,Bz,I3,4,BL,Bu,GJ,8,On,Ff,D,A,L,C,x,L,J,H,N,D,V,C,F,M,CB,CC,Er,h,GD,Ea,GH,z,CX,Bw,Cb,Br,G3,IE,Ed,Ca,BK,BW,LN,DN,BG,B4,Id,i,BJ,Di,Fr,Q,Mj,DZ,Md,BD,z,BT,Bw,Z,BF,r,C0,5,DV,J,X,CP,C7,BJ,E4,B9,B9,CB,El,r,IH,B2,ER,Bl,DZ,BY,Z,Bh,Dz,DC,IP,y,G9,Dn,a,CN,EF,Bg,Ct,Gb,CC,CL,C0,H,Ci,DD,BX,h,CO,3,E,L,Fx,B9,CZ,Dn,CY,DP,m,BC,n,Ct,DS,Dp,S,P,l,x,BF,d,3,1,Bh,Q,l,w,B7,BI,X,E,F,C,E9,Cw,DX,n,Dd,B6,I9,y,X,K,Kd,Fa,GA,DC,CV,Bw,E4,BY,Cn,W,3,T,B8,Ca,DG,K,k,BO,BD,BC,BK,u,BB,m,BQ,B0,Gj,BG,CD,Bk,F5,J,5,CK,Dj,s,m,Bq,B3,Bu,Gl,t,F,A,A,G,t,CK,5,s,g,k,CU,X,B0,BE,1,2,CR,Y,Q,s,DV,Ca,k,2,j,u,U,6,CN,4,Cb,j,V,0,Dj,Y,b,Q,E,K,E,a,T,u,z,8,r,A,m,Ba,BL,u,Z,C,A,E,m,y,w,M,5,BK,P,B0,BE,0,c,u,y,S,d,W,K,O,Gy,BU,Gb,B8,BP,H,ME,Hq,FB,Co,Bu,BG,DB,C2,Bk,Co,DT,Di,C8,Cg,EN,Bq,t,8,8,BI,BL,M,Bk,W,O,C,e,G,2,y,CQ,a,S,q,CM,V,M,O,L,i,k,D,GG,F,Cv,Z,EY,p,BB,BL,Iw,Y,Qe,Ex,s,C1,IN,Cd,Vx,Dg,JA,D5,5,Bx,CC,DH,Hu,CD,CA,4,Ep,CI,0,BW,JS,B5,CM,o,CB,Co,Hs,C8,GG,Bp,BE,DA,CH,BA,Bc,C4,C5,Bq,IQ,n,Ck,CD,Fx,Bb,FI,B9,Dw,k,q,B6,C0,BC,Lw,Bc,Eg,CG,CO,D,D9,CV,Ss,CY,I,B1,CC,T,D2,CE,Cd,B6,CY,0,Kk,BD,Ne,D7,Ce,CE,HP,B6,BO,D0,CF,BG,FQ,B6,Dm,EI,HM,N,D0,r,DD,D9,Cq,Bn,Z,Gb,DQ,Bl,HL,E5,i,5,IL,W,J2,Bv,Ia,Eo,p,DI,CE,o,EU,Y,Cg,Bp,P,CP,Fo,n,ET,g,BU,Bo,BJ,CE,Mf,8,p,B6,Cc,Cg,ED,Cw,GI,CQ,b,CQ,CY,1,BD,Dt,Bc,h,Km,BD,Jp,DG,G8,A,Ch,o,Co,2,Pu,CJ,Cj,Bf,h,CJ,Cu,8,BF,CN,BS,b,CI,Be,B5,Bw,BO,B2,It,Cm,z,De,UW,BC,Dj,Bd,C2,BF,Cf,4,FW,BW,FF,Bo,D8,I,Ep,6,Fa,BK,Bf,g,XE,Ci,EN,E,BS,Y,Ra,c,DE,BZ,s,BE,DT,BG,JA,J,CP,Be,Ki,Cq,GE,BH,GB,7,Ka,j,DT,BX,PK,q,I2,Cl,BN,BL,DX,2,EI,BP,Cn,BZ,ZH,HP,Se,DE,D3,O,B4,s,I6,X,Be,Bz,BL,Br,Bs,p,Bb,k,CK,Bu,BP,e,Bw,Q,OK,C,Bk,X,Bp,v,EQ,3,JA,V,De,BA,p,Bc,Dm,W,Os,CF,Bn,r,CG,n,Cr,j,Cw,V,A,BJ,FB,BC,Km,FX,FQ,Dy,DW,Bn,Hu,m,F8,Bl,6,Bg,Fo,X,CB,Be,Cq,w,DZ,c,GQ,0,3,8,Ri,Bd,Gt,l,8,T,Hm,a,CV,BL,BJ,6,B1,Bt,Gq,CC,HO,j,Bq,1,Dj,n,Lk,C1,T8,W,D4,BZ,R,CX,De,j,BY,CR,Bj,BN,Dg,DQ,Gc,m,Mm,D,Fo,DD,DA,I,Be,8,Ct,Bm,BE,Bi,Rg,r,NK,C9,A,Mn,Ex,Bh,FT,Bi,Bv,H,C0,n,In,l,E2,s,HA,Bv,w,Cj,Di,Cl,Bd,Bd,Gx,Be,Nb,EP,IH,E1,Dn,CC,Jz,Cb,g,CC,Eh,CF,D5,m,Fv,GT,EG,7,Bh,Bx,B2,DR,Bn,h,o,Bc,BN,H,B5,BT,BL,B5,BQ,Cb,Gl,Bz,J,Db,FD,V,BN,D7,EX,Ct,D1,No,BW,E0,Cy,B4,F,Bk,Eq,u,MO,H6,FS,Bc,Bm,Ea,D0,o,Gr,M,x,DL,Jb,DB,q,BQ,B5,P,Bq,DA,Kb,r,JB,F9,R,BJ,DE,7,MX,BB,DA,BG,Id,Bw,C7,Bp,Pr,e,F7,BV,WB,Nb,FI,t,A,Ct,Cy,Bm,BF,l,Bk,f,B3,BT,EI,BU,R,BX,q,Cc,DY,F,FW,DN,Bt,p,CG,C7,DJ,Ed,BV,Hr,QF,Px,GX,Cr,Eb,By,Db,DB;CdC,EMy,DQ,J,u,l,DJ,c,FF,BD,EB,g;CmM,ENE,Ek,x,JD,BD,t,P,8,d,B5,N,Fp,o,H4,s,e,8;Dgm,D76,Ur,DB,JJ,Cn,GJ,D3,Hh,K,Bv,BW,Hq,CW,Bz,a,C8,BE,B3,q,Ji,CM,b4,Du,Ei,9;C2c,Dye,Dk,X,DV,CH,V,B9,Ds,Cr,Dy,BP,Eb,F,i,f,Iv,y,BH,M,Cg,0,Cb,BS,Ev,N,Bn,BA,c,6,DW,u,8,BM,BN,U,Co,e,Z,0;FBY,ENi,ES,BP,Cb,T,BA,7,x,R,Kr,v,Hl,BI,Fm,BY,CL,D,Bi,q,Gu,4;FFE,EKk,BI,d,BN,1,DE,6,EW,p,3,Bt,CF,H,C2,BF,Hp,b,Of,CK,GM,B6;FV2,EHo,Bh,BV,Ee,BA,E8,Bz,B7,z,Rl,9,Ha,EO,E2,L;HRw,D6m,Ce,p,CK,Bo,Me,B9,EV,Bl,D3,u,Y,Ba,Cv,L,DW,CP,LJ,D,Bf,9,HT,B8,EC,Cs;Hni,D5I,M8,r,x,x,E7,f,JX,BY,6,BK;JS8,Dqe,P,D,d,k,G,W,Cy,BG,Bc,S,A,Bx;Hag,Czc,By,En,b,DT,E4,Kp,CZ,CE,Cz,R,Bv,Et,DS,Ed,f,BF,f,Bs,CF,g,Bz,Cl,r,JI,BG,H8,Bx,DY,g,Dc,CS,W,k,Bc,BP,BO;JTD,Ds4,Bs,L,Cu,BB,Bz,l,EZ,Z,B3,O,A,Bw;B1i,DYQ,G,J,C,N,H,J,C,J,N,F,V,Q,N,A,N,G,H,M,o,K;CNw,DdK,H,D,p,K,F,G,C,E,Q,C,Q,F,M,J;Cuo,DsM,i,Z,Y,F,E,N,h,b,O,L,V,D,5,q,n,O,9,G,D,K,2,M,s,H,A,I,K,A;IuE,C0A,I,L,B5,4,L,O,O,A,Q,N,6,X;IWc,Dqc,P,D,f,C,N,G,A,O,C,C,Y,D;IY2,DkQ,L,A,I,U,BD,W,E,s,R,Q,G,M,BS,i,W,L,D,T,P,N,j,H,F,J,I,1,a,d;H7M,D7i,V,H,v,K,Q,G,o,E;HvI,D9S,Cb,D,BC,U,CO,G,d,H;HLC,Dsq,z,T,z,M,n,F,r,O,s,K,Bu,C;Fla,EEC,t,P,Db,Q,Ds,K;F00,D9K,k,X,b,N,d,G,T,M,f,C,l,Q;FBY,D8E,Q,F,F,J,x,D,L,T,DN,S,O,Q;FAm,EAe,Bb,N,B3,K,EE,m,G,R;Eou,EBA,r,D,h,K,c,O,BG,C,M,H,D,H;D20,DxE,Bz,e,U,S,q,E,Bw,P,t,H,T,N,K,N;D5i,Dy8,h,H,I,K,m,M,BK,G,Y,F,t,T;EVg,D06,d,H,B5,K,Q,I,y,E,Bg,N;DfO,DmS,R,T,h,C,P,G,m,U,W,D;Dcs,Dpi,C,J,L,C,P,K,J,M,F,W,G,G,I,C,A,P;Dn2,Dcg,l,D,n,Q,l,e,G,G,B2,L,F,V,K,H;Clc,EKS,R,D,BV,U,BC,O,BM,D,O,L,z,N;Cp0,EJ2,DH,F,BL,M,Cu,W,BA,J,D,N;Cns,ENc,v,A,X,G,J,I,e,I,o,C,g,F,O,J;C28,EK6,5,J,f,A,P,G,0,O,m,H;Czi,ELk,d,L,Bh,M,S,I,J,I,E,K,Bs,P,G,J;DGi,EJ6,BL,J,BV,M,G,M,B4,Q,0,J,W,T;DDG,ENa,BA,r,DN,J,CX,u,Cs,U;Cew,CWu,D,F,L,S,A,M,G,G,I,V;CmK,DlM,L,d,b,Q,Bf,3,CV,Z,Bh,M,h,w,a,BA,Bu,g,4,A;DSa,EMU,Cv,Y,FG,k,Bi,o,CW,V,a,j;DA8,EKc,CD,I,d,w,l,O,Eu,D,Cg,Z,DL,J,F,V;DOi,EMu,T,r,DV,p,Eh,C,BL,c,BY,2;DLO,ENI,Df,G,Bs,W,Cy,C,W,L;Cwo,EKq,C1,D,BZ,Q,DK,e,CI,d;C8I,ELM,I,h,J,V,T,F,EH,G,6,U,C,c;DAe,EPE,Ca,b,CR,L,g,Z,B1,X,Fl,K,z,Y;C0g,ENq,Jk,BF,F1,h,F1,k;DTU,EPQ,E9,O,CM,I,DM,P;DCE,EPm,BR,A,s,W,EI,A,L,P;Ey8,EJE,Bt,D,Df,8,Di,O,FQ,f;EvY,ENu,BJ,R,EB,K,R,M,D4,G;HU2,D0s,B7,R,v,Q,R,k,o,Q,CE,A,U,F,M,P;HYo,D0Y,Du,BF,e,BD,MR,k,CO,K,CQ,BQ;HEi,D5Q,p,H,9,C,E,O,Y,Y,H,M,K,a,S,Q,o,h,2,R,n,T,D,H,K,L;HFW,D0a,R,F,BV,i,BB,c,D,K,w,H,BU,b,s,X;HK8,C1s,2,N,X,J,d,p,x,b,N,D,p,s,v,R,BI,BU;Ixy,Dmc,Cv,Q,Bz,k,B0,k,Da,h,A,R,T,D;If2,DDC,j,T,J,I,8,y,G,s,Cm,o,S,z,J,R,BH,L;Ipk,C04,A,f,n,c,d,G,p,i,L,W,BD,e,k,M,BI,J,L,P,E,P,e,h;IDY,CjE,V,J,V,E,A,S,q,2,Q,F,F,N,R,V,G,Z;IIi,Cna,J,H,J,C,b,M,H,G,I,K,i,Q,Q,A,G,F,D,T;IG8,CmQ,b,V,3,L,Z,X,h,K,J,i,E,I,W,D,U,Q,y,G,o,4,Y,Q,U,C,A,r;IBC,ChY,J,L,L,G,U,M,I,O,U,D,H,H;IGE,Cn6,T,D,P,M,D,I,U,E,O,F,C,N;H72,CeE,L,L,L,A,F,E,O,O,G,C;H4U,CbS,l,X,P,A,H,I,A,E,c,E,BA,w,Y,G;Hw2,CXO,x,L,s,y,a,I,g,c,BI,k,w,C,BD,p,H,R;HtW,CWM,CP,BF,z,D,Bd,BZ,BB,f,y,BM,CY,Be,G,e,c,Z,0,E,6,o,s,C,J,j;HnQ,CRG,H,F,P,E,A,M,q,M,M,H,E,H;Hlo,CTi,e,R,q,E,L,P,BV,Z,p,f,d,h,l,T,H,n,Z,Q,E,a,6,o,BK,BY;F3w,D2A,B3,9,CR,M,B9,m,BO,C,o,m;D78,EI6,EU,f,DD,D,B7,e;EKK,EMy,DZ,A,w,W,D4,H;Dp8,Dxy,Cb,F,U,c,F,c,BI,Y,Ci,A,Bk,1;ECa,DvM,Cd,G,CS,BA,CQ,R,S,P;EIc,Dwk,CB,G,z,U,Bs,w,o,L,k,Z,A,f;ERE,D5S,K,P,j,D,P,T,P,C,L,M,r,H,f,Q,q,Q,s,J,F,S,W,C,e,C;DJA,Dnk,D,p,Cl,D,d,e,Bx,E,Bj,BO,Bu,o;BFm,C2U,V,V,3,p,BU,R,m,I,G,i,E,e,e,E,CM,t,Bm,A,0,t,f,5,I,f,K,L,J,D,KH,W,g,Q,q,BO,Bw,O,BE,w,K,M;BuW,CYs,O,Y,e,D,Bu,f,U,T,w,C,W,n,o,N,E,H,Ba,BP,Dm,O,n,BD,C9,G,BP,9,ET,BT,BB,e,W,Bw,DZ,8,Do,CC|BdA,CWm,W,V,Ba,Z,E,Q,CA,W,BA,h,F,P,b,BJ,CL,Q,9,Dn,A,N,E1,BY,FJ,Bn,IV,g,W,y,z,Y,P,I,F,C,p,m,w,a,T,Q,d,M,BV,j,CX,6,i,O,l,W,c,c,CV,BE,C,2,Bj,8,N,M,I,E,Cy,i,Cu,D4,Cu,BU,G,G,G,C,u,a,EU,d,Bm,v,Dy,2,BU,0,K,C,S,A,2,V,CC,Cp,Be,BL,i,BH,j,DX,S,T|CpY,BRY,l,L,Z,C,X,W,N,W,I,M,R,B4,w,Bu,0,i,4,z,G,Z,R,1,Y,Bh,r,BT|3d,BsC,c,L,Y,E,w,R,f,X,l,C,r,W,D,I;cV,CLS,Bo,o,Y,BF,E6,a,BU,BV,CT,Bl,W,CR,v,CD,Bn,L,Bu,B7,BH,B7,BO,3,Bj,Bf,G,Bx,R,D,E3,d,m,BS,P,DS,q,H,Br,E,N,s,Be,BW,BJ,BH,BH,M,Ck,GS,p,De;BSv,B5O,A,F,N,C,P,D,J,M,I,E,Q,A,I,F;Bmd,CDI,J,L,V,G,E,W,M,E,M,J;BZX,CAo,F,D,p,G,N,I,H,O,a,G,a,D,S,L,A,N;Bbn,CAY,L,F,1,Q,t,Y,BI,V;BeZ,CAS,V,D,V,Q,c,I,Q,L,C,J;Bcz,CAC,S,J,j,H,V,G,Z,A,R,K,F,M,I,G,W,A;BUv,B8E,Bg,A,D,R,z,J,7,I,V,O,F,M,O,E|BOK,CqM,K,P,A,d,Ba,Bb,Z,R,W,1,BP,f,DP,Cf,D,BX,e,b,3,E,J,D,P,C,Cr,BE,EJ,F,9,r,9,E,C,i,BF,u,7,p,r,U,X,C,A,G,BB,BK,CP,Q,x,k,W,e,Cp,Y,W,n,BJ,d,BZ,BC,q,e,d,S,3,L,C1,BO,v,b,T,A,A,C,q,BO,BX,B2,e,w,p,6,O,i,Bl,BI,4,BC,f,Bs,u,N,d,m,d,C,D,K,C,G,I,F,Lk,C2,Fi,BR,I,G,KG,X,I,C,K,I,g,H,M,P,BE,V,W,Z,A,Z,A,F,Y,BH,6,B1,C,BF,Bl,l,v,r,Bg,3,X,BX|GSo,8E,Ca,BD,BW,g,Z,Cl,BM,Bv,Dp,Fz,BO,Dt,Ba,x,BW,BQ,Bg,B1,s,BA,Bm,t,3,n,w,Bv,BI,P,R,Bh,X,BI,CF,Y,CT,Cy,A,CV,Cp,Ca,Bb,7,CR,e,8,Cu,BL,u,d,BZ,BL,BS,BB,Ei,B6,f,u,Hu;GGa,bO,T,P,BM,B6,Fe,FK,H,4,w,Bm,m,Cv,Bn,Bb,BV,d,5,B5;GXK,le,W,N,u,I,S,P,J,T,2,U,R,BH,5,r,H,j,CJ,x,h,d,e,EA,r,W,c,W;GZM,dO,d,A,Z,0,BB,g,h,BG,O,c,BQ,a,J,BU,g,BQ,4,U,y,P,M,d,BV,C9,D,z,i,BH;Gd0,kk,BK,G,U,h,F,BX,e,f,W,BF,Z,J,D,R,f,k,I,BH,z,c,C,B8,b,k,r,J,Z,CA;GgA,oa,Q,r,s,b,R,x,G,BL,Y,3,J,R,i,n,X,Q,BT,E,p,m,X,s,Q,o,Z,E,p,w,v,a,h,BW;GRW,re,4,C,c,X,Q,K,BG,BH,P,h,K,BJ,b,5,f,R,Z,G,p,0,3,CI,d,S,P,e,V,A,M,W;Gie,eE,6,BN,h,BJ,u,Z,q,D9,BR,BT,A,Bv,BN,DS,b,P,BB,B1,6,Bf,r,B1,j,H,N,Ba,z,p,Cf,BK,v,CQ,u,Bg,Bv,BW,l,D,V,BT,7,6,1,j,t,u,Bj,Cn,l,E,4,DK,CK,q,Bq,Bu,BW,3,L,BP,B6,Bw,BE,J,c,BU,CC,I,H,Ca;GZ8,ee,E,Bq,BC,Bm,BE,Ck,J,Cz,9,3;GVS,86,N,P,H,E,G,O,A,G,G,K,K,E,K,L;GUA,BAc,C,T,N,A,T,M,D,G,E,I;GVa,BDs,F,F,H,C,G,S,K,G,I,D;GVK,BFC,L,R,J,A,C,K,K,S,E,A;GS0,Tm,K,R,O,E,W,F,E,N,Z,P,P,O,d,L,N,G,T,F,L,K,E,M,c,S;GFq,Za,L,P,N,Q,E,g,S,E;GO0,h0,b,H,H,S,S,S,g,P;GPa,nQ,K,F,Q,O,G,R,Q,N,H,P,P,D,P,E,P,H,T,E,d,m,E,U,G,E;GPO,lu,R,H,F,E,D,Q,P,k,M,G,Y,N,G,N,D,J,C,J;GXo,hw,L,D,N,J,F,O,E,Y,a,a,G,A,G,H,C,N,N,f;Gd4,fk,D,J,V,A,Z,Z,x,H,l,E,P,M,L,c,S,U,e,Q,W,c,i,E,w,b,F,f;GP4,Q8,N,T,J,C,H,I,F,L,T,F,L,P,R,F,N,C,C,M,e,U,U,G,S,O,I,C;GV0,Uu,b,D,T,c,N,K,E,K,u,Q,u,V,G,J,P,F,L,V;Gio,fg,D,D,N,Q,C,S,O,a,M,Z,D,P,K,P,H,H;Ghc,f8,F,F,l,u,G,O,A,Y,a,a,E,A,C,L,H,d,K,l;GP8,sW,A,P,j,U,A,M,E,E,S,J;GVQ,rq,S,C,W,T,C,T,Z,j,j,a,D,S,K,e;GV0,n0,R,x,L,Q,E,M,N,Q,O,W,C,g,e,K;GXo,ns,L,F,h,c,F,G,K,G,a,A,O,P,C,J;GZq,pc,S,f,V,W,t,k,R,I,F,G,C,K,Q,A;GbS,oK,A,R,J,G,Z,i,H,M,G,I,S,N;GbG,no,m,Z,a,p,C,t,p,g,V,E,D,O,3,s,BB,7,W,Bg,H,k,BC,d;GdI,r8,F,N,R,E,P,N,Z,Q,F,K,Q,a,A,m,U,U,S,b,W,R,F,n;GWI,tU,D,J,r,e,D,E,C,K;GVo,wa,E,J,H,A,L,R,K,b,H,V,N,A,F,C,E,O,D,M,N,Y,J,I,E,Q,a,C;GdC,iO,H,D,I,W,I,F,C,D,A,L;GgI,gM,C,L,b,a,H,U,K,D,K,H;GYk,X4,C,F,D,H,V,L,J,C,A,O,E,I,K,H,I,G;Ghu,Wc,D,L,N,a,H,G,G,Y,O,N;Gd8,lE,b,A,L,I,P,c,Q,G,O,D,K,L,M,T;Gem,de,H,N,X,K,H,K,C,K,S,C,K,L;GTI,9i,A,N,L,G,F,K,G,Q,G,J;GOo,lM,E,N,H,R,F,D,H,G,P,E,A,I,G,A,O,K;GbO,kY,M,b,R,A,H,U,G,G;GWi,oa,H,H,F,A,D,M,G,G,C,A;GiW,e6,F,F,H,K,G,Y,E,E,E,R;Geu,lY,D,L,N,I,J,Q,D,M,M,J;GGk,ae,P,F,F,M,C,M,K,A,E,F;GbC,dy,C,X,V,H,P,G,L,M,A,G,K,D,W,O|Dnt,Nr,A,N,Cr,a,Gv,DF,z,EX,CB,Bb,x,CH,DU,En,x,BX,Cq,V,w,Bn,C4,I,CQ,Bs,V,FF,DI,M,S,A,a,t,Cc,ET,BP,Dz,o,Bl,Bl,CD,m,Bb,z,BL,B2,CZ,Cn,C7,c,z,A,D,R,N,T,R,b,D,J,J,K,7,b,t,z,Z,x,F,P,O,O3,JQ,D1,EI,O,Cc,IN,PU,D9,F8,Dt,CS,d,Fm,Cg,Co,k,W,c,Bl,BB,b,C,BX,Cs,F,BA,Bj,8,J,CM,FE,FY,Cs,Dk,DU,BA,DI,BN,Ba,6,F,M,G,M,O,FC,D5,CU,Dr,GW,k,Cy,Bd,CF,Dn,BS,H,BC,BJ|DBn,BDD,E,R,BA,Cd,b,Dl,DS,h,Bk,m,B6,v,BY,FT,Ci,c,BQ,x,BN,Ed,D,f,D,BZ,Df,Eh,JV,U,DG,GY,K7,FE,FL,E0,F,G,E,K,BI,FO,Bq,C6,Im,BK,DE,CT|H7c,PX,R,P,f,m,P,Bo,BR,Bw,D5,Ca,BD,S,Q,i,D2,CN,DM,Cx,W,x;H4E,N3,Bk,J,N,Bj,BN,z,U,BR,Bz,T,7,BN,Cl,BL,Ch,D,EP,CA,S,o,Eg,L,0,Bo,S,Bp,CU,O,BY,Bk,BG,Q,R,CM;HUw,db,D,VA,G,A,LO,D7,EK,DN,F,B3,Fs,CB,BE,CF,C5,j,w,Bx,Ee,FZ,CA,E,CK,DL,DK,v,Bt,BV,IP,B2,Fd,GU,H1,CG,6,Bj,BF,1,Eh,A,Du,Cd,HP,1;Hrg,Sz,J,A,F,I,V,I,T,Y,C,c,M,A,o,Z,G,J;HlC,PR,P,H,L,G,F,M,E,O,M,K,I,C,I,H,C,P;H6e,KH,F,T,N,K,L,O,G,I,O,E;H4o,Jh,D,L,H,C,T,S,F,G,E,E,U,P;HxI,FB,D,J,P,E,F,D,Z,W,A,M,G,M,K,D,U,P;H1W,gV,I,A,O,O,O,G,I,J,P,v,3,U,D,S,L,G,X,o,D,M,Q,T,m,d,D,J;HzA,en,F,H,N,E,h,c,E,U,Q,K,W,L,K,d;H1c,cL,C,P,P,O,I,a,D,G,R,K,K,O,O,G,A,V,E,L;IBq,kp,D,N,J,E,X,H,N,C,J,O,U,F,F,M,c,H;HdM,bX,L,A,j,M,L,K,0,F;How,Rh,N,D,X,a,A,K,Y,O,Q,N,C,b;Hoa,GV,BE,P,E,I,E,P,d,H,T,T,5,D,l,I,p,N,F,Q,Q,G,D,Q,M,K;HzS,Il,p,F,P,E,b,e,R,I,c,O,a,E,o,T,E,J;Hzk,eL,c,R,Q,G,I,F,S,T,C,h,L,H,C,I,J,C,b,D,x,I,O,Q,R,W,A,I,C,G;H6W,c5,k,D,I,L,M,F,S,P,J,N,C,J,L,C,L,F,f,K,D,I,P,O,Z,K;H9S,lD,g,L,M,N,r,J,j,O,F,M,P,F,G,K,T,K,H,U;HdM,b1,E,L,f,M,r,a,J,O,Q,L,e,L;HrC,HX,J,N,V,E,K,C,E,K,G,C;H4M,JJ,H,A,A,Q,E,I,K,H,C,P;H0w,iH,F,P,R,E,D,E,C,K,O,A;H9q,NP,D,F,N,E,K,M,E,A;IHG,Vl,L,X,F,I,j,V,BP,c,b,m,D,s,n,U,z,4,H,Bk,BK,l,BO,Bt,BI,v;IC2,Rh,F,D,L,a,A,S,J,W,S,U,K,J,C,T,I,R,H,h|EBl,b6,X,h,4,Bt,f,b,A,b,x,j,j,g,E,h,h,BB,H,G,Bl,Ck,4,BE,BO,1,ET,Cy,BX,H,DF,Cd,Bc,CT,BZ,v,BV,L,r,CM,r,3,Bf,Bo,DF,k,j,t,H,H,f,2,i,W,N,6,m,k,r,c,A,BQ,c,c,g,R,Q,O,M,N,0,Bl,Be,P,X,k,Bu,BL,Fs,Co,De,n,Ck,Br;EGh,aq,F,J,J,U,A,W,I,E,M,D,E,V,D,L;EPP,Xo,N,A,X,I,R,Q,D,M,K,Q,Q,G,M,V,J,H,E,N,Q,L;ERR,eQ,D,L,R,S,I,C,E,A;EHF,am,J,J,F,I,G,K,C,A|GzI,Jw,F,D,F,C,E,E,E,C,E,A,A,F;HAM,Xy,P,F,F,Q,C,S,I,M,K,G,I,S,C,L,H,h,H,N|D9o,B1C,I,T,m,BN,K,T,F,L,ER,Bz,Fp,e,I,Et,EQ,DJ,Cd,BT,O,Cj,I5,J5,Dd,z,BT,BC,Cx,C7,E0,Ix,HX,T,B5,Bd,F,N,CH,c,Dd,FS,Pr,BR,E,C,y,DU,EQ,BW,e,Bg,Bz,e,C,DI,Cz,BA,Cx,Dk,n,o,BO,X,JS,BL,Gs,Bc,CG,Ek,H4,CM,s,De,Cc,2,BN,CU,Du,I,B0,Do,BR,DC,Ee,CS,F0,e,W,I,M,E,Ca,b,O,j,BW,T,a,3,N,BF,2,x,BM,Q,C,Z,i,T|DDa,BDO,R,D,A,a,e,g,S,k,O,h,X,V,P,f;CvQ,1s,Dd,HQ,J,U,c,I,JO,DG,CI,Gc,BP,B4,P,W,A,e,BC,Cy,J,s,Bq,Y,N,g,j,E,M,CK,k,I,M,r,BE,w,U,1,CW,Cl,FA,BT,DU,EN,ET,F1,9,k,BB,BJ,L,D7,DL,3,Bd,Cd,C5,f,BX,Cl,Fr,BD;C5m,BUu,F,F,V,C,J,K,G,BK,L,E,J,D,Q,e,e,G,O,Y,K,H,N,Bt,N,T;C5i,BTa,J,H,H,A,C,M,C,G,K,A,C,F|BEg,Dks,b,D,Br,CL,FZ,o,BP,B7,Dr,N,EN,FJ,DD,l,N,Cr,Cr,CV,Bk,BV,GV,B1,F,GF,CU,BN,B5,BJ,o,C3,Dj,Dd,A,G,Cj,CO,BX,Cb,CB,U,Ef,DH,FH,L,Dd,CC,Cs,2,Bh,U,Bs,Bc,EL,BD,GC,EI,F9,Cz,Bu,Bi,Bx,BE,Bo,w,BV,Z,v,Bg,IW,i,HX,V,BR,Ce,Fy,D,FR,g,Jq,CQ,Eb,D,Cs,BO,DY,z,Bf,BA,BW,Ba,Eo,r,EW,BU,Fz,T,GM,EG,Em,BK,Cj,N,CG,Co,EC,o,C7,P,S,BU,IA,C0,C3,6,I2,CA,DX,U,Fu,DE,Eg,BC,L,BP,CM,Bs,r,B9,CC,k,Z,BQ,EW,R,B9,BS,EQ,c,CK,BR,EO,DS,Dk,f,CX,CZ,Eu,Ck,Q,Bn,BS,U,B8,B2,Ci,X,Bl,9,BM,D,R,BX,CE,B8,Gw,Bf,G7,z,GO,BJ,g,F,K,j,N,P,CN,U,T,r,CR,b,3,z,f,H,R,I,y,B8,ED,BQ,EZ,d,FJ,ET,IL,a,Cj,Bw,DD,p;QA,DLC,T,D,P,C,E,U,U,E,K,L;Qa,DIi,A,Z,T,C,J,I,F,G,C,O,F,O,G,I,G,A,M,N;Bio,DnK,n,H,H,E,K,I,K,Q,O,D,e,N;mm,DZs,P,H,Z,A,D,G,G,K,Q,G,S,D,G,F;bU,DTY,X,D,P,G,BW,Q,E,G,Q,H,F,P;aI,DSU,r,C,T,M,2,M,O,J,A,N;BNm,Dqc,BN,v,x,L,Bh,H,BN,e,DI,K,w,W;BUi,Dre,By,V,F,J,BN,L,Bd,Q;BOM,Dpk,E,T,BN,h,X,F,N,E,D,Q,R,H,T,G,A,I,U,O,u,E,8,W;BPe,Dpo,n,J,X,G,L,I,D,Q,G,I,S,G,O,J,W,D,Y,L;su,DiO,y,F,BH,f,5,L,R,G,H,N,h,F,H,S,U,O,a,A,W,S;p0,Dg6,f,L,c,o,W,K,K,F,F,T;xE,DkY,m,h,L,X,b,L,BF,D,f,O,t,L,f,Q,k,W,y,H,O,Y,i,F,A,W;BBw,Dog,c,F,Q,L,S,F,C,H,n,H,Z,C,P,S,V,K,D,K,Q,A;BFC,DoG,d,H,l,E,L,I,A,G,Q,K,g,G,c,D,G,D;BAI,DoC,Q,N,2,C,5,p,BX,X,b,b,Bp,J,r,M,i,I,Y,a,BC,C,E,W,BK,e,Q,o,Q,C;oW,Dak,R,A,A,I,K,I,O,E,o,C,G,F;oE,DbC,T,A,C,I,Q,I,G,G,C,I,O,E,S,H,A,N,J,L;kO,DXQ,L,H,Z,E,v,F,T,G,O,K,q,M,W,A,Y,P;4c,Dmg,Bm,V,Q,V,d,P,C,b,BP,J,R,I,BV,n,A,I,3,E,g,O,G,s,BK,E,C,M,d,I,s,K;y0,DjK,Bq,BA,2,f,B1,BD,Fj,r,BE,q,Bo,I,BA,k,e,y,Z,K,I,Y,BU,w,w,D,BD,z,Y,7;c3,Dqg,f,C,B2,k,k,W,BG,I,E,N,F,R,CF,V;BAA,D18,Z,J,l,M,Z,Q,M,E,BC,C,S,N;BYs,EFs,f,A,3,O,L,M,K,G,a,A,o,T,s,F;Bq6,EKc,DZ,D,G6,W;BHs,EFi,BY,F,0,BJ,Ds,R,BF,h,Fu,v,Gx,Bj,BN,I,0,u,FT,X,l,a,Cg,BI,El,By;BFa,EK2,Ee,p,CU,BW,Ng,Bz,Kf,CV,MV,8,Bf,U,Dk,g,JP,BQ;2K,EJw,O0,Dx,HP,BL,H5,Fz,It,DA,JY,BQ,Kb,a,LQ,BQ,CV,Q,BE,g,Lt,BX,Fv,CS,DU,A,D1,k,Bt,CC,Js,U,Dp,7,Eu,v,Ck,BY,E2,Cj,Bp,CW;kS,EFk,C,P,B0,V,6,r,DP,u,Bl,6,P,e,BS,L;8c,ELC,t,L,BL,I,a,O,u,D;Bfs,EGi,CG,D,F1,L,CA,Y|GqG,CAk,p,1,b,L,DF,H,BX,BL,J,d,D,C,Cv,o,BV,3,BN,q,0,a,Bz,O,Cw,By,BP,Y,m,CU,CV,S,1,BO,F,A,FQ,C4,CW,Co,Em,BF,V,B6,Cy,K,Cg,BU,o,Bw,B6,BZ,G,H,E,P,O,L,G,L,C,J,G,H,L,H,C1,Bz,L,Cv,G5,Df,l,B1,DC,Bt;Ge6,CDi,N,H,A,K,I,I,I,C|Xi,OQ,V,H,N,C,S,a,I,H,M,D;r4,sM,e,r,i,v,a,l,U,Bh,Be,Bf,J,CB,C1,CJ,F7,MH,CB,CL,CD,B8,Cr,9,D7,Gd,F,A,H7,Bh,B5,Bw,H,Ce,DV,CY,FX,G,N,D,M,Io,2,G,Ci,E6,5,DS,K,O,K,G,A,Ck,DQ,D2,QA,C9,Cw,Bq,GY,x,DI,B8|r4,sM,l,A,DJ,B9,GZ,w,Cx,Br,QB,C8,DR,D3,A,Cl,L,H,P,S,v,c,BX,Ba,Bp,f,I,t,F,V,L,K,3,BK,g,g,b,u,Bv,N,B1,BS,A,BC,q,A,B3,BG,n,2,3,Bs,I,BM,E,I,C,K,CU,E,BI,6,HG,S,BC,BA,BK,C6,K,Hs,A,i,s,I,Ee,8,FS,Ee,My,Hi,Bq,BA,Bq,Z,DM,t,CU,Bz,BK,g,BW,s,W,B3,S,C5,Cg,Dx,Bl,LH,GV,I9|EUR,wW,H,H,t,b,s,Bl,BP,DT,M,C7,R,8,h,r,R,CF,k,t,t,BH,g,BN,O,D,P,b,r,L,z,I,l,o,5,O,5,V,CL,w,h,b,D,G,GN,F0,BE,K,A,G,B8,8,H,Bg,BY,E,6,4,BA,n,CY,C2,Bu,X|JAc,CJL,Cq,BK,f,BJ,B0,i,f,Cb,Fd,FN,Bu,BV,DV,i,c,p,DD,BL,Bf,FN,Fb,Cd,Ib,CK,GE,GE,Ig,D0,EE,G2,CK,w,x,f;JDA,CHz,b,N,G,a,M,I,G,A,M,I,A,R;Ip4,CXT,F,P,T,C,L,E,H,D,H,C,I,M,Y,E;Iqo,CVv,I,Z,T,E,J,I,O,M;IuY,CbL,C,J,X,C,A,J,Y,N,Q,C,A,T,CV,n,E,M,S,M,E,U,S,G,A,K,M,K,F,q,k,C;JIQ,B3D,C,L,R,E,H,I,R,I,D,C,D,S,O,M,U,X;JA6,Byr,DY,BD,BS,FJ,Co,BL,R,CU,CG,Dx,DY,BH,Cu,Ba,Bs,d,CD,FB,Cr,E,x,DD,E7,Er,CL,8,Bq,D2,Eh,Ci,Cs,Bs,BE,DM,BH,CQ,BG,E,Bd,c,7,Bc,q,X,D,BK,Bj,BE,c,Bd,CF,Co,s,s,BD,Z,B7,DK,BE,G;Ixu,CtX,K,L,V,F,T,I,F,G,W,C;IoM,Cnv,E,T,j,G,N,I,J,J,R,C,G,K,e,Q,G,c,a,C,I,H,N,L,C,R,J,F;JKV,CRH,H,H,N,C,X,X,A,Q,H,G,X,F,O,F,C,F,N,J,M,T,K,A,M,R,n,T,R,C,H,O,W,c,J,K,P,G,t,A,S,M,S,D,U,K;JKV,CS9,J,D,C,M,F,G,Q,E,G,L;I8Z,br,D,C,A,C,D,C,C,D,C,D;I4P,eN,A,C,D,C,A,C,C,D,A,D|Izv,9j,V,N,L,O,I,Q,K,E,G,A,I,P|ITT,BGj,V,C,C,I,E,C,I,A,G,F|TU,Cns,V,A,z,S,m,6,BJ,g,3,D,l,m,l,P,T,S,b,P,b,K,N,D,P,V,d,G,T,C,CP,c,Co,P,BD,BG,Bs,Bm,6,CC,EK,Bg,Cc,G,w,d,c,F,j,CD,BD,H,I,h,6,R,N,j,1,b,M,d,Cr,d,y,BJ,b,z,O,J,5,b,m,b;No,Cpw,N,R,3,V,BD,Q,f,J,R,a,Q,C,Bc,J,a,K,U,J;Ua,Cwm,d,H,H,A,C,C;TI,Cwc,p,F,N,C,F,E,u,C;Qe,Cv8,n,R,D,E,Y,M;RM,CwO,d,A,BQ,K;Pw,CvM,V,P,N,E,F,E,G,K,e,S;Mu,Cq4,a,T,b,F,b,M,T,D,H,G,A,E,S,E;Vs,Cw0,T,A,G,G,Q,E,K,A;DiD,nK,J,X,H,K,D,S,F,I,J,E,F,G,A,I,e,P;DRD,4c,F,F,F,A,F,E,A,G,E,D,C,A,A,D;DR9,40,D,A,D,C,A,E,E,A|Dnf,oK,A,H,J,E,N,M,P,K,G,M,O,J,M,T|Djx,m4,L,D,p,S,f,g,D,Q,Q,J,O,X,k,P|EkO,Bb4,I,H,f,Et,I5,BM,Dt,CY,EZ,G,Il,EO,C4,EW,I,F,K,N,DK,u,Mu,Hz,Gi,H|Iqk,Br,F,H,F,A,D,G,A,E,G,C,E,D|BNa,45,q,I,CM,Y,CI,N,g,T,i,h,J,A,FP,CL,BP,Be,HR,BD,C,Lv,DP,J,A,I3,A,H,A,BX,A,Kf,Bb,Z,BP,BN,Db,O,CH,i,T,BY,9,w,B9,B5,X,Q,Eb,HK,Bp,Me,I1,QE,E,s,Eo,4,Cs,Bb,OI,C,Hk,CB,He,BC|Bm6,BKR,c,U,DO,DO,By,EQ,7,DW,8,CC,L,FK,IP,C6,A,g,F,a,f,Bq,I4,C6,q,O,I,H,BS,Bt,CO,g,k,n,G,CR,7,B5,DS,D9,V,By,e,BM,Ba,a,a,Dw,ET,E6,p,D2,Bg,B2,a,A,s,C,Hm,X,BO,BQ,B0,Z,GW,DE,M,X,I,Pz,CV,DJ,Qv,Kh,C2,IZ,L,Ft,It,FF,U,D1,A,F,Bv,D,f,G,T,D,A,BC,P,w,G,i,D,S,T,K,F,C,F,O,M,Em,CR,Ge;Bxu,mv,F,G,H,C,J,D,D,J,I,L,I,A;ByA,nF,G,E,C,G,A,G,F,E,H,C,H,D,F,T,E,F|HL,BzO,BY,BP,W,Eh,B8,Cv,h,BL,Ez,D,Dl,Bb,g,CR,Fv,DP,HP,B9,DJ,CD,F,Cp,A,x,d,A,G,Bv,IZ,x,DX,Gn,Et,Dr,Cx,HF,HR,R,O,Bi,Gi,JG,Bk,E6,Es,FW,Eg,BS,EW,Dc,DE,KS,Hk,Eg,DK,F2,CE,W,CG,CP,HI,T|cd,BbO,c,A,A,j,A,p,A,j,A,Dn,Kx,A,A,IL,Dp,CH,a,Ez,Mt,A,T,Br,L,K,S,Bq,C,I,HQ,Q,Cw,HE,Es,Dq,DW,Gm,IY,w|94,CQa,A,D,BW,BJ,CI,v,Q,T,D,F,Z,H,H,L,d,C,F,H,I,J,E,N,F,P,D,D,D,A,1,P,J,E,F,a,R,A,BN,Bf,Q,V,F,p,f,Q,Bz,BY,E,M,V,D,H,A,J,K,J,I,A,I,C,A,U,Q,R,c,D,s,g,G,K,o,k,Y,k,N,C,O,T,i,q,C|EjQ,Cik,C,A,Om,Fe,GI,9,BK,Bv,I2,5,C2,By,BF,DK,DI,Cs,KY,Cf,u,Cn,DG,BH,LA,W,GI,DN,Gw,l,Lk,Do,Hg,BR,K,N,T,d,DJ,F1,JS,W,Ea,EP,H1,R,MP,F5,Fp,8,Bn,CP,Bs,CJ,E7,DD,Rf,Dx,LP,DC,Qf,k,DX,FC,Ob,C8,W,FA,CJ,C6,Hl,C4,f,By|BX2,Cfq,E,G,C6,m,FG,Br,A,Bh,BU,t,G,BB,BA,b,I,7,q,Z,Dx,I,D,BV,Bf,BP,C,f,x,J,L,H,L,M,T,S,i,DW,j,BG,Bf,BK,CD,Co,3,U|YA,CRI,N,F,A,E,E,E,C,A,G,D|GF1,Bq6,HY,i,Y,E,P,h,MG,EB,Fs,C,BI,A,CS,A,A,Bc,E8,D,s,A,C,D,Es,Dl,B2,Df,Dq,B1,CG,Ca,Dw,G,GO,HN,BS,Dj,GU,Bl,D,r,CR,KH,GQ,MR,Ea,CH,Gy,Bo,C6,t,Ci,C2,BQ,FW,Ks,B2,0,Bb,C9,E3,P,D1,3,BQ,z,BF,F,J,t,F,P,h,3,BL,J,F,f,S,R,H,H,P,A,T,r,A,FP,C,A,B1,BX,C,DM,Cz,H,BD,EL,A,Bd,Cb,Y,z,j,Br,F,E,Gz,Fg,BM,1,C5,BS,EP,CX,E9,4,XN,Kw,CX,De,BU,m,K,C6,B3,Dq,HT,H2,ED,By,E,C4,JT,IC,C3,G8,GF,CU,BO,GF,Jm,Kr,C6,Hp,EA,Cx,B5,B5,Gp,GS,BB,Ea,Ib,E6,C8,N,E,Ca,FP,ES,Ef,IU;Egd,BDe,L,H,H,W,I,W,K,M,i,G,A,H,L,R;Fhj,BHs,H,R,R,G,F,K,D,S,I,C,M,H;Fvx,8c,N,F,T,M,E,K,K,G,K,N;Fur,BSo,G,X,L,E,P,M,J,Q,A,G,C,C,S,L;F3D,Bfs,A,F,V,O,x,q,R,U,D,g,Q,D,S,P,K,f,i,J;F9h,Bci,D,H,j,M,S,Y,D,Y,I,G,G,J,K,h;Fz7,Bfk,R,x,R,A,f,Q,F,I,M,4,K,G,a,I,G,H;GJb,BfW,L,J,X,q,A,K,G,G,M,D,A,L,I,J,E,L;Eft,BGg,C,L,J,I,D,K,C,A,C,F;Evv,8Q,Z,H,F,G,u,U,K,F,X,L;FsP,BP4,F,A,L,K,F,a,C,C,U,h;F79,BoS,J,D,N,K,C,I,C,A,M,H,E,J;FwZ,BV6,C,L,L,G,N,f,F,D,I,o,I,G,K,C;FyV,BQq,D,J,9,k,O,E,Q,D;Fzf,BRM,F,F,V,o,Z,M,Q,g,M,BG,G,P,P,BP|C98,BEF,b,H,d,C,N,O,K,E,D,O,M,g,O,I,G,Q,M,M,Q,C,a,t,D,Z|0z,BBk,P,V,H,I,D,M,S,c,K,E;nn,vw,F,C,C7,Ck,p,Ba,Bf,S,CJ,Bo,Fh,b,9,CP,A,Bc,Bo,FK,Bj,Eu,8,Cy,Cj,Cm,L,v,S,Bq,Ms,A,b,Ey,Do,CG,A,IK,Kw,A,A,Dm,A,i,k,X,LI,Gl,u,d,BJ,A,El,D,De,en,MZ,k,FL,Bt,Bx,Bk,B7,C3|vA,B1o,J,H,T,A,T,K,A,W,U,F,S,P;uK,B2O,N,F,N,G,D,E,Q,E,I,F,E,F|kv,oA,C,Q,P,K,M,BU,n,BI,T,S,h,N,t,BA,S,y,N,BE,r,y,I,m,T,g,k,N,B6,C2,Bw,Bl,FK,Bs,MY,l,Df,em,Ek,C,BI,A,8,p,SS,L7,B6,Cf,Ec,Bj,D,Cb,Ci,F,BC,M,A,j,L,Ht,BL,C7,BD,BB,HH,T,BJ,7,CV,F,D,L,r,O,Cf,O,D5,B5,T,3,Bt,I,C1,DV,CN,W,5,DJ,Cx,Bp,t,EX,D,L,J,C,5,L,n,p,j,I,N,Bk,j,L,C,X,v,U,J,BB,1,D,P,p,BH,Y,d,k,h,D,9,3,H,A,E,O,9,0,P,Bm,BF,E,2,BK,BX,8,9,Cg,5,C,M,l,BN,x,Bz,i,BV,BB,z,BA,BP,n,n,k,Q,k|Dy0,Ka,F,A,F,E,A,E,E,E,G,A,C,F;DzI,Na,H,A,D,C,G,M,E,E,C,D,A,D,D,F,A,F|FM8,Uw,U,y,a,d,BS,T,Y,r,k,D,G,5,V,n,a,b,Bc,2,u,b,BA,Be,i,J,Ds,EX,E,GN,Bs,CL,q,C5,p,0,Bn,7,HD,FC,A,BK,B3,CU,Bz,Hk;GHQ,Nc,Fh,k,EX,JX,C3,r,Dr,BC,CL,Bx,EN,f,C1,Dw,M,d,E6,Bl,E,DW,Fo,CU,Da,Em,C,A,g,X,U,t,U,A,m,x,i,e,M,s,L,O,J,0,m,c,S,I,A,r,Q,9,c,J,O,E,C,C,L,Q,D,i,J,Y,T,e,u,G,Ec,Gm,I,BN,Ba,BE,Ba,Bp,j,Bx,Bm,i,H,BH,EM,BT,DR,BD,6,B9,DF,l;FaM,Iy,L,D,F,C,F,I,K,U,I,V;FNg,RE,H,F,P,C,C,i,K,E,M,H,G,H;FMG,U2,O,X,L,N,L,C,J,J,J,D,J,Q,J,G,D,K,M,C,I,F;GF2,XI,N,L,F,M,A,Q,S,Q,W,C,E,N,D,P,H,J;FQ0,Jo,L,F,A,M,I,I,E,F;FxU,Hy,H,F,L,I,D,8,G,G,G,D,E,L;GIQ,Ng,b,F,V,A,E,G,D,K,K,C,K,D|ByA,nF,J,D,F,E,E,S,G,C,G,D,E,F,A,H,D,H;Bxu,mv,F,N,J,A,J,K,C,I,I,C,G,D;BtG,tN,L,O,h,R,BD,BY,8,BM,K,B4,Bk,4,1,w,C,D6,BS,BG,CZ,Dm,A,E,E,C,Bi,r,Bg,N,W,i,BC,v,y,Bp,U,Bx,N,7,BG,Bf,C,J,b,A,Bh,B3,o,D3,ES,E7,b,Dx,Bb,b,f,BN,U,Bz,DT,D8,6,B4,H,CQ,l,m,CP,h,BT,Bs|Cjy,oH,DC,Jj,3,B1,Bx,Ba,W,EN,IX,Zt,GX,Ch,Dx,B0,Ch,Ic,Dq,H6,BX,IK,Be,Ds,GU,BC,DE,Ds,B8,U,N,DC,C4,Be,A,Cq,BU,BK;Cf6,rH,A,J,b,C,F,a,O,A,C,M,I,A,I,X;ClG,2h,Z,n,I,g,a,s,G,C|BHi,CMS,M,D,4,Q,e,F,m,M,Q,J,E,D,g,d,Q,P,s,P,c,z,K,F,E,J,N,X,F,z,D,F,N,A,1,p,B9,D,BV,1,Bj,D,d,D,A,E,z,M,t,BG,J,y,O,K,G,6,E,C,C,A,e,A,K,o,BK,W,e,R,I,S,M,G|Tu,Clq,D,H,G,Z,Y,V,u,P,D,T,V,X,H,T,D,N,N,G,V,E,N,D,L,J,X,A,H,G,X,G,H,G,G,C,M,S,f,i,C,W,w,y,W,F,E,H|BFm,C2U,N,C,W,W,K,Q,K,c,C,L,F,R,P,d;BLc,CzW,L,K,J,e,e,4,1,s,Bn,A,CN,s,f,F,A,C,n,Ca,A,K,DU,BG,I4,A,Fe,CZ,K,A,A,L,b,5,BC,P,C9,BJ,BB,B5,o,j,x,A,L,a,B5,d,V,l,D5,L,R,E,A,E,A,Y,X,Y,BF,U,N,O,h,G|e4,Cby,R,A,D,A,D,I,A,O,K,U,C,F,A,F,G,P,I,L,D,H|es,Bjg,Y,K,0,W,BK,Bg,f,B6,g,s,EG,Ci,J,CS,g,N,LW,CX,CG,DV,Km,Dh,DM,CO,C,EE,E4,CU,LO,D9,G,N,Bd,Er,4,Zv,A,t,A,Bn,A,E1,DP,A,A,BP,A,Z,Bj,u,YR,MA,CD,7,BN,h,BX,t,BL,h,CV,By,DN,s,Br,Y,V,i,BL,CA,ED,4,Cn,Ew,BU,Bi,M,EA,Bn,Hs|lJ,WS,w,BC,CA,Bs,Q,BA,q,Y,O,0,C,I,K,A,a,E,I,R,4,W,0,n,e,CH,T,5,o,J,c,h,u,I,k,BS,a,E,M,T,G,H,E,D,i,B1,7,Bl,B8,p,y,BN,4,R,T,Ez,Z,E,Ev,CM,G9,FS|Bdk,BjR,BN,Bl,3,I,BL,4,BH,CI,BA,o,BO,Bq,C2,BK,CK,Bp,S,l,7,CH|B2E,Bxs,BS,G,K,L,V,X,i,P,Q,r,9,7,S,T,5,D,Z,V,H,N,Q,X,f,b,H,D,L,L,n,b,F,G,L,F,J,b,R,J,9,A,K,Q,Bc,Cy,I,s,BE,8|BXw,C3k,L,A,Ff,CY,I5,A,DV,BH,J,m,M,By,CI,Ca,Co,e,Di,Cb,CW,4,R,Bs,E,S,DG,k,Dy,Bp,Cy,D,E,A,Y,D,BK,v,n,Bb,q,A,y,9,S,v,F,b,F,L,H,C,t,P,BD,5,Bt,G,BZ,f|FTc,BKM,K,V,Ce,B7,e,Cj,Ew,x,r,r,By,BX,BH,BT,Bz,M,d,BP,D8,CB,E8,HF,CY,Bd,v,x,Bi,Bv,d,Bb,C,X,L,L,CH,BJ,BD,2,f,b,Z,G,z,d,c,7,L,b,j,A,BN,w,l,L,h,q,D,G,M,E,0,s,c,Dc,Cp,Cm,R,DM,Cj,Cw,Bf,U,Cn,B7,B3,BQ,Dr,CL,y,Ge,CR,A,C,CC,BV,Q,C,M,C,K,Y,BK,Q,O,6,M,V,M,k,BE,BO,s,M,U,M,L,E,9,M,J,0,K,g,R,U,M,R,U,E,Bq,d,g,R,0,s,y,U,X,W,K,c,H|Dq4,CFy,G,C,CQ,V,Ba,6,u,J,I,k,i,N,B0,6,DB,o,L,g,5,G,t,BG,P,r,j,C,H,t,Bt,U,j,u,Bl,M,CE,Bo,BQ,c,z,W,H,F,N,I,Cs,Bs,Fq,BV,O,B4,CG,w,Em,BZ,LQ,H,DC,Bj,c,X,E,N,Gz,DZ,EN,V,Bn,CD,CF,J,Z,BC,CV,f,Cv,Bb,3,B3,T,D,L,C,EX,z,Bd,O,BB,BC,CL,r,9,o,D3,P,N,BA,6,2,Ba,U,B4,z,BS,2;Drs,CEq,C,E,J,O,K,O,V,C,L,E,N,O,J,F,F,J,C,L,O,L,H,T,K,F;Dti,CE2,C,K,L,F,N,D,D,F,I,H,I,D;DqE,CEe,A,E,J,C,l,E,Q,T,K,A|Cfu,Bhi,N,F,J,C,V,m,U,k,K,J,Y,h,D,T;CgQ,BeE,Cf,D,x,Be,CT,Q,n,G,g,g,s,4,o,BW,W,Q,Bc,M,BA,Z,D,H,i,BP,j,K,z,v,BE,H,BG,CX|BDm,COK,a,G,C,S,i,Y,H,a,k,M,I,T,s,R,BG,1,D,R,BK,R,d,5,R,J,C,P,E,H,j,H,N,H,J,T,f,Q,BL,X,L,p,f,A,D,A,C,K,A,S,T,q,d,S,X,G,d,k,J,G,C,C,E,O,F,M,J,I,E,G,c,D,G,K|I98,KG,N,H,F,A,O,K,A,D;I9i,J0,P,J,F,E,G,A,K,I,M,A,D,F;JAI,F8,A,H,L,O,J,I,A,C,E,D;JAK,Fi,J,D,G,E,C,E,D,M,E,D,A,F,C,J;JAK,DQ,M,J,H,L,P,R,F,A,O,O,G,K,J,I,H,D,D,I;JE6,Cl,H,H,F,G,E,G,H,Y,J,E,H,I,S,L,G,T;JFw,D5,C,L,F,A,D,E,D,M,F,K,K,N;JAM,EU,H,A,E,E,W,E,C,C,E,D,A,F,N,A;Iy6,Cz,D,D,F,C,C,E,C,A,E,D;I7h,Oj,A,D,E,A,C,C,D,D,H,A,D,C,E,E,C,A,A,D,D,A;I35,KJ,D,A,C,C,A,C,C,A;I4X,OZ,D,D,D,A,D,C,A,C,C,C,C,A,C,D;JE7,PH,C,D,D,A,D,A,D,C,C,D,C,A,D,E,D,A,D,C,C,A;ID3,NN,D,A,J,I,D,A,O,E,C,D;H3n,k5,D,F,F,C,D,E,A,E,C,E,C,A;IGx,SL,L,A,F,C,A,C,M,A,C,D;ILj,GA,g,Z,P,D,j,M,h,W,K,G,E,J,O,J,O,U,Z,Q,K,A,Y,N;ISB,Mo,Q,R,D,J,N,A,H,E,K,A,A,E,J,I,F,A,D,H,H,E,I,K;I53,I7,I,F,E,F,C,L,F,A,F,E,F,C,D,A,A,C,E,A,E,F,E,D,A,E,H,I,J,E,D,D,D,C,C,C|CIO,G9,H,D,E,M,W,O,I,D,C,J;BvW,DP,A,i,I,DO,DW,FA,X,Cy,BX,B0,D,Bk,BB,w,f,BE,o,o,C4,C2,m,k,D,H,Bk,Z,2,Cz,C2,N,Dy,Cd,Eq,l,D8,Ck,DI,7,c,A,Z,l,Cl,DN,E,L3,Bw,Cr,d,j,Dx,Cp,DN,GZ,D,F,FN,D0,G,Bc,Lz,Gm|Cl2,CUq,H,F,L,A,V,W,E,U,I,G,K,C,C,F,P,L,D,N,M,P;CmS,CVE,H,D,F,M,G,M,M,A,F,R;Ct6,CWe,F,D,N,G,L,I,M,M,K,D,G,N;Dq2,CMS,T,J,H3,FJ,Bj,B2,D9,F,r,Cm,Bl,C,S,DM,D1,CU,Jb,t,LF,Gq,IV,B1,A,LH,A,v,L,A,Bn,F,B3,CK,CX,BM,Db,n,B1,BN,F,W,a,Cy,EN,BU,DZ,EK,EK,O,Br,BC,BS,Bo,Fu,H,BZ,w,8,EK,GH,y,GX,CV,E,L,CP,2,BW,g,Cj,DC,C1,G,CD,CK,Cs,Ga,EE,Bh,b,CM,G8,Dm,IO,z,Dy,DD,Y,Bg,DY,BZ,EQ,Bk,IG,B3,Ek,q,B8,CA,E5,B8,C6,BI,W,CO,DU,I,C1,4,BE,q,Bx,Y,y,BS,Mc,BC,Mi,DY,Fq,R,BI,Dj,Ic,j,BH,B5,LM,DM,BL,BX,Ec,Cb,G2,IF,Ca,Bq,CW,Bx,GG,y,GC,Eb,Eq,g,CA,CD,E,N,T,E,Bj,V,p,Bj,Cl,d,3,ET,CP,v,Fr,BK,CV,FR,q,BZ,Cr,s,F3,Bh,B4,b,V,CH,BY,DD,BX,d,d,Cn,F,F,d,W,DD,Bi,LR,G,En,BY,CH,x,P,B5,Fr,BU,Ct,Bt|B1c,Brk,U,F,Bi,BD,Bc,P,Fe,C8,y,a,Q,t,q,CJ,R,F,M,h,q,I,I,X,d,Z,f,X,Gl,Br,DS,DN,Bl,Bl,CX,d,CP,CL,Dn,e,G,a,D,Q,i,B2,A,4,8,CS,F,o,G,e,E,Q,S,q,H,BE,I,c,F,g,E,s,A,E,E,G,c,M|G6O,B2w,L,H,R,C,L,K,E,M,S,K,Q,T;HMQ,B8A,X,C,K,E,I,Y,A,E,P,A,A,S,M,Q,m,g,C,N,N,l,a,D,R,j;HBQ,Bwm,X,T,T,C,L,I,D,I,S,Q,O,U,O,K,U,E,T,d;GxW,Bjm,X,F,N,E,N,a,W,Q,i,V;Gyc,BkE,T,D,A,K,O,c,C,S,M,Y,K,I,E,J,F,f,P,X;Gvm,Bp8,R,J,D,I,H,C,M,K,A,E,J,I,I,Y,D,K,g,E,G,L,A,f;GtC,BwE,P,J,F,O,E,i,a,J,A,L;GtY,Bwy,F,J,V,M,M,e,A,S,Y,Q,G,J,A,X,V,Z;GrE,Bru,G,F,W,E,G,F,I,P,C,J,V,D,J,L,N,C,H,G,D,G;Gwk,Bqk,T,A,H,C,F,G,a,O,S,D;HVE,CWO,J,N,L,S,D,W,S,F;HVy,CVi,P,D,R,I,D,M,K,I,M,F,M,L,E,H;HP6,CLu,L,A,F,Q,E,I,O,G,M,C,L,d;G9Y,BxO,F,F,D,C,P,L,D,K,L,G,D,E,e,C,I,D;HP2,ByC,D,L,N,C,F,G,A,M,M,A;GsY,Br6,H,D,L,Y,G,E,Q,g,I,b,G,D,H,J,J,F;Gts,BtK,P,J,L,A,K,K,A,G,I,O,Q,G,G,A,N,R;Gus,Bu2,P,J,N,G,G,S,E,G,M,H;G3q,BwE,H,J,T,C,I,G,E,I,E,C,E,J;G2q,Bvg,I,J,Y,C,C,D,R,N,T,E,N,A,D,M,C,E;Guc,BoI,H,F,E,Q,Q,O,A,L;HYq,BX2,F,A,N,U,E,C,G,F,I,N;Hd6,CSU,DK,l,B0,BQ,v,CL,o,BL,Bk,S,GB,Bp,CX,C1,Ef,B2,Cx,x,Bp,s,f,3,Co,Bj,Dl,BH,l,Dk,B0,BM,J,BI,DK,F,BQ,D2,T,C8,2,W;GzI,BuY,Bs,A,h,BF,BK,F,L,b,g,p,BJ,Bd,BD,Dd,3,I,G,l,BV,x,S,CO,t,f,G,BP,Bb,u,i,m,b,Bk,Bc,Bs,d,I,K,i,BB,BI,X,R,K,z,e,A,C,f,7,O,5,p,M,g,f,BE,BA,r,BV,BQ,Dg,CM,4,L;G9a,Bwg,4,H,U,BV,BL,r,p,BL,t,o,BF,M,BH,f,BB,Br,l,T,h,C,O,c,r,E,T,Bo,BP,T,B8,BI,8,BU,y,j,BQ,S,E,s,BI,W;HVk,CJc,Ca,GR,DT,EJ,BR,GN,8,Bp,Br,Bv,Bp,3,O,Cc,DR,DX,R,Bg,CD,Bn,Dp,F,1,Bg,K,CX,Dt,Cr,B1,Bq,6,B8,CN,e,H1,Bd,h,Bj,D9,c,Gc,E6,JS,I,DW,F4,Bm,W,Bb,BN,BI,BN,Dc,Bg,Ew,FW,Bu,He,Cg,BD,Y,BE,Bb,I;Gc6,BRG,N,h,J,F,L,C,N,S,I,G,K,F,I,C,S,a,E,F;Gbo,BQU,N,D,f,E,A,G,O,G,A,I,E,E,g,L,A,J;Ggo,BRy,R,F,T,C,C,c,G,F,E,L,O,F;Gpu,BX8,V,J,H,N,1,X,G,X,X,P,C,X,f,N,A,W,Q,W,A,Y,O,E,e,c,N,I,E,M,c,L,i,g,G,Q,Q,P;GsI,Bba,J,F,N,G,F,W,G,M,I,C,I,V,G,J;Gtk,BdA,R,R,r,Y,S,G,A,G,O,K,m,I,S,Q,S,I,E,T,P,F,l,d;GtK,Bco,C,F,V,E,J,S,O,D,E,J;HRG,Bso,F,D,J,G,D,G,C,E,G,A,M,J|EBP,7i,C6,BB,c,x,BB,J,BF,U,T,Z,l,G,R,j,1,e,BB,E,3,6,9,Y,Y,g,BI,O|Wo,CYK,I,H,CW,E,CC,Bs,Bs,CB,BA,CG,Cy,x,P,BA,BM,A,F,k,I,a,G,A,Bc,T,BA,q,DG,U,P,V,0,5,Di,d,q,J,F,N,5,d,F,N,I,L,q,H,f,j,G,J,U,D,H,f,c,L,e,f,f,F,M,I,E3,l,a,D9,Du,CH,DK,ET,FO,BH,1,BR,IQ,EL,Z,BT,Ej,CE,BV,CT,CG,Cb,Dl,Db,BV,S,By,C6,Br,DY,Or,Hu,DF,FC,El,Bg,DX,CB,x,H,k,BI,BJ,E,BX,o,N,i,m,q,J,W,n,K,j,m,Bc,i,O,c,BL,BK,e,a;oI,CLK,A,C,D,A,A,D;oS,CRm,E,K,D,I,N,D,J,L,G,J;hi,COQ,G,J,F,L,C,N,R,K,r,F,F,K,E,E,g,E,O,D;s8,CHU,L,D,J,E,E,I,S,F,A,F;m2,B4k,L,D,N,G,A,K,C,C,O,F,G,J;yQ,B9S,Bj,Cd,o,BT,n,BN,B9,W,x,y,FP,Bu,p,u,6,BK,i,f,BQ,g,Bm,r;fE,CH2,k,BP,j,v,O,z,f,Cv,Bn,O,T,5,BD,H,v,4,F,2,e,BK,d,Q,M,BM,5,BK,G,0,BI,N,CI,BU,BQ,x,P,T;bW,CCC,N,V,N,O,A,M,C,E;au,CIY,J,L,J,C,C,G,K,O,K,E,E,F,F,J|B1m,Bty,F,N,H,P,I,T,D,T,G,H,I,d,L,N,D,N,J,T,N,A,d,N,F,H,A,F,F,t,P,A,Z,W,j,E,Z,P,X,9,G,z,J,P,k,F,O,P,z,f,R,p,I,L,m,E,BA,W,I,A,H,f,E,p,9,CT,A,5,j,B3,P,R,B1,E4,R,q,U,Q,A,O,k,i,L,K,A,C,B6,Ec,G,W,8,A,Q,I,I,a,K,E,E,H,m,a|BxO,Bn2,K,L,l,j,A,P,V,R,J,Q,D,G,m,g;B0q,Bqg,E,h,J,d,G,BF,T,r,F,R,J,A,BB,X,n,F,J,K,Q,o,y,e,P,O,l,E,I,O,H,y,W,8,Y,O,i,F,Y,X|gH,Cx4,A,H,R,I,H,I,r,E,S,I,k,F,I,D;XT,C1s,h,N,j,1,BL,P,g,X,BN,X,A,P,2,n,Bk,V,BI,6,BG,v,E,Z,BY,G,I,J,j,X,BC,DR,BZ,B3,c,V,Gv,BL,A,l,C3,r,Bv,F,0,q,Bv,T,Bq,2,CZ,P,BY,BC,Bd,S,FG,Bg,Dr,X,DM,CE,Dv,o,H,c,BS,K,l,a,BC,Q,BF,K,K,w,p,g,E2,F,BW,BS,CD,I,Bk,Bg,B6,W,C,7,6,BQ,BU,Z,r,V|CMo,B5s,U,E,BA,w,Dc,f,2,Q,c,BD,Bi,m,I,H,G,R,By,DX,C6,z,Cx,F3,CQ,DN,EE,Bv,Be,CD,f,Cj,BE,D,A,Br,Bu,Bp,V,F,Bh,O,A,H,BB,Y,Bd,N,X,R,p,BX,t,5,h,h,j,J,FZ,c,Id,GE,Ff,Cw,DP,e,t,G,c,Y,J,W,r,J,N,g,Q,E,r,CI,R,s,6,c,GO,C8,BK,D4,L,CY,Da,CU|C5Q,BY0,x,t,V,G,BZ,f,X,C,D,O,Be,e,A,c,e,J,8,S,O,L;Cx4,B6c,CW,U,CY,B8,F0,i,Gy,CT,DW,Cz,Cg,A,Y,DL,E,J,E,P,Bx,DV,g,p,BT,v,E,Bd,BU,b,BL,BN,0,FT,Cs,Z,e,BB,CT,DD,1,3,m,p,Cw,Dl,Cy,BB,D,DJ,By,f,f,Bh,ER,BX,z,DV,N,A,Nj,B4,B7,EU,GX,CB,DZ,s,H1,Eg,D5,Gq,Br,j,Bx,Bi,BT,Bt,L,F,Bv,Bo,A,Bq,BF,C,e,Ci,Bf,CC,EF,Bu,CR,DM,Cw,F2,C7,y,Bz,DW,H,Q,A,E,E,a,t,e,E,2,BN,i,u,Bc,f,M,H,Bc,z,Bu,BM,I,o,BI,m,Z,I,A,E,F,8,BP,BG,x,Ba,V,m,H,M,D,e,I,i,A,M,D,DA,B6,Bq,k,BC,5,t,h,k,z,v,L,H,Z,B0,BV,4,G,A,L,8,Cj,GS,Cx,JA,O,I,BM|FEc,Eu,s,7,S,H,c,l,L,BH,N,P,d,I,R,u,n,Y,X,w,t,w,g,D,Y,Y;FJ2,Fv,T,A,x,i,v,BU,Q,u,m,K,M,H,o,Bl,c,n,A,X;GEQ,bx,b,r,Q,P,r,J,Bp,U,A,S,g,H,K,G,F,8,BG,w,y,R,O,N;GAa,aV,y,z,BN,r,T,l,V,L,L,E,K,a,R,a,t,c,v,K,d,q,G,K,Ba,P,q,Y;FgG,FZ,BC,Cj,Bc,X,r,BF,M,j,CL,y,r,CE,CJ,c,w,u,A,e,S,S,a,I,W,p,E,o,m,G;GZW,Or,E,3,R,U,N,H,T,BR,C,L,O,G,U,N,I,X,1,X,Z,v,h,C,P,Y,m,BE,Q,B4,m,u;GXo,RB,T,Z,j,K,F,J,N,A,H,M,K,k,O,O,P,s,I,Q,BE,e,I,L,E,1,f,r;Fna,L4,d,J,R,K,c,Q,A,G,f,I,L,I,J,S,A,M,y,k,C,P,a,h,C,X;FnE,Jr,J,d,X,T,R,C,J,S,R,I,J,P,r,L,G,S,L,M,H,c,W,BI,i,I,u,P,e,V,O,b;HCs,CH,Bo,R,0,z,u,X,P,R,p,L,n,I,R,M,T,8,V,N,t,W;HDA,FJ,CW,N,CO,f,CJ,T,CZ,s;Gx8,A,Bg,f,M,d,R,R,h,I,T,H,BF,4,N,D,c,p,c,L,A,R,f,F,N,c,d,P,L,U,1,M,K,W,O,G,O,H;GqW,Gm,f,F,J,K,J,s,W,i,c,U,a,G,S,b,P,z,P,Z;GpY,FX,T,L,BD,E,l,J,j,S,O,m,m,Y,0,X,w,h;Gio,H5,F,F,N,K,J,g,J,I,J,c,M,W,O,J,D,h,S,p;Gig,Fx,BA,H,BN,V,Bj,F,L,A,J,U,a,I;GfI,Fh,a,H,K,K,K,T,W,D,A,T,9,N,l,K,n,T,t,H,T,e,K,i,U,K;Gzo,Zz,t,A,F,a,K,m,K,C,O,o,S,I,m,q,E,Q,Q,G,U,T,V,P,K,j,P,n,x,x;GlC,Yv,C,P,v,P,X,d,BL,O,BB,V,I,g,c,g,u,L,BS,c;Gd2,aR,E,N,e,I,BM,J,C,b,CP,X,N,E,F,G,O,S,J,K,I,O;Gyk,ER,H,F,Z,E,P,M,X,8,u,O,I,H,S,A,I,L,F,t;FBQ,Q2,Da,F,Jk,Jv,Bs,O,GY,Fb,Bj,BL,Dm,O,v,Cz,DC,Bl,2,E7,Ca,s,CI,Ch,BB,Il,Dl,8,J,BP,Jv,Iy,Jn,QO,C5,Bm,IB,KM;GYE,bx,Fn,BF,Bl,c,CF,N,V,g,M,4,CY,k,Cq,BH,Bs,Y,BI,j,Bs,BE,A,q,g,x;GPI,eP,4,5,q,F,4,7,K,R,b,j,1,R,9,S,Bv,BY,Bp,M,b,m,u,c,B8,A,c,Q;GJa,a1,BM,I,U,b,s,W,o,BN,BP,P,M,V,BF,F,V,m,z,n,Dd,x,3,S,K,Bi,BC,g,BU,N,w,5,g,F,0,c,BX,y,L,m,BK,G;Ge2,DO,CL,CB,Lv,e,BR,1,b,Cr,B8,Cn,C6,Bu,F8,K,Gr,Dj,DA,DV,J,CT,CA,Cf,EJ,BN,G,CK,CX,B0,g,Ce,BT,Q,BT,BP,k,IN,Cz,F,M,FG,f,Bq,Bx,G,d,Cc,CW,F0,BE,K,Z,Ce,Bw,Da,BE,Z,Bi,Bi,JM,Bj,Dy,Cs;FkW,TZ,Ei,Cl,FU,d,BS,Bs,Fg,Bp,Bg,CX,Eg,b,m,DD,Vj,DQ,Il,C0,Co,DA;Fro,Gi,C0,Dx,EM,e,CK,Bw,Dq,BD,C2,q,EW,JW,Fg,l,A,D,q,Bh,CV,P,DQ,EN,5,7,D0,DZ,Dd,Y,BJ,GD,EJ,DR,F,EX,FF,DX,BJ,DA,CD,t,CN,Bs,Dx,CB,j,CI,En,R,5,Fe,CV,Be,BD,Dw,Ba,FC;GoC,Cu,e,F,BG,B0,Bg,i,C,Bf,Bb,BP,CE,Bp,Cj,w,n,F,H,d,S,Bx,Bc,CF,BP,k,BL,Bg,R,Dg,l,6,o,CQ,BU,BK,f,7,Y,B3,BP,BJ;Gui,JR,Co,1,4,BT,J,BF,DJ,Bs,BF,A,J,Z,B9,s,BH,t,BR,6,v,BH,F,4,BC,BI;GlO,J9,i,R,o,t,C,R,D,h,7,b,z,N,5,W,p,U,l,y,A,m,M,M,a,J,BG,Q;Ge8,c1,E,X,G,D,a,M,K,J,A,R,L,P,d,F,C,R,M,T,I,b,P,N,B1,B3,CN,p,f,Q,Y,m,b,W,Y,BK,2,w,M,G,C,J,I,J,I,C,e,F,I,E,S,U,G,O,A,K,c,G,BA,m;HAq,Sb,J,x,K,t,Z,p,p,I,7,2,A,I,e,C,I,k,b,Y,I,G,S,H,e,k,E,S,W,A,G,d;HAA,Ux,J,f,T,T,T,j,Z,N,X,Q,H,M,K,8,Q,C,P,G,D,w,M,C,e,d;HM4,ar,x,d,CH,E,k,Be,y,BK,s,a,Bg,K,s,BB,p,BL;HUu,Ib,C,VB,N,G,Cl,Dw,D9,BD,d,DM,BY,M,B3,y,1,EE,Db,CW,Kr,Do,b,Ce,DB,DR,h,Ce,Ch,Bm,Fk,i,s,Bq,FN,d,BP,CM,DB,k,Ee,DS,FG,BP,s,FF,C4,DX,Iw,GC,Je,Dp;HOE,bF,L,D,1,G,H,M,M,I,M,O,Y,G,U,j;FSG,Gs,K,R,C,N,J,N,D,T,Z,P,V,C,V,i,C,Y,I,K,S,D,U,O;FUa,DM,L,H,V,Y,L,k,A,S,G,K,U,L,Q,Z;FUm,Es,C,b,P,G,N,M,7,Q,N,M,A,K,E,E,BY,Z;FWW,Ca,F,J,J,G,1,I,t,Q,J,G,M,o,I,I,Q,R,BM,n;FWy,Cy,H,H,L,C,p,e,n,K,G,W,M,C,q,V,O,N;FXK,Bu,X,A,H,C,C,S,I,M,K,A,M,T;FXs,CI,F,D,T,a,G,O,E,E,Q,T,G,N;FZi,Dy,O,J,K,G,D,R,N,V,X,E,H,M,E,E,C,K,I,A;FbY,D6,A,R,M,J,C,L,D,T,P,b,R,E,H,M,C,E,L,G,G,I,F,K,n,J,A,S,W,Q,O,E,O,F;FcA,l,G,D,G,K,i,d,N,A,J,J,r,W,b,J,Z,M,K,M,I,e,U,J,C,N,M,F;FbA,BF,U,V,E,J,L,L,H,R,F,D,R,G,L,R,H,Y,P,Q,I,O,I,C,E,F;FYo,BJ,b,H,f,E,E,M,O,O,M,A,W,L,I,J;Fr4,Dz,p,V,L,A,H,I,E,o,G,K,a,C,S,H,I,H,E,P,D,J;F5O,W7,l,A,n,X,BH,A,BN,Q,H,O,c,i,o,E,C4,C,U,T;HBY,Dn,L,D,N,E,L,O,E,M,M,I,K,J,E,L,I,A;Gme,Bn,N,F,P,A,F,W,G,a,M,E,U,F,J,J,G,P;Gng,BD,W,f,R,d,M,R,c,A,I,H,I,T,J,J,R,H,d,W,h,J,F,O,G,U,T,I,R,U,G,g,I,C,S,R,G,O,I,G;G4y,TD,R,T,S,BA,O,M,U,BA,M,J,L,v,f,h;G4a,S3,N,V,P,I,A,i,L,a,O,A,I,L,M,b;Gpy,L1,H,J,N,H,L,C,E,G,D,E,V,H,P,N,L,G,A,M,S,Q,U,C,c,Q,O,D,L,X;GlG,NA,J,F,P,C,D,K,W,m,T,Q,I,q,K,D,M,N,K,n,P,X;GhW,LG,H,H,Z,K,C,S,L,S,D,I,C,K,O,N;GyI,a1,R,H,K,Q,m,k,O,H,S,D,d,R,b,J;Gu0,Zp,N,V,P,C,Z,Y,E,Y,K,C,e,H,G,P;GoU,aJ,k,J,U,C,E,J,V,T,p,O,H,O;Gwe,Fd,Q,X,L,V,I,P,R,D,T,P,Z,D,x,O,f,Y,y,W;FUO,Rr,R,A,f,Y,H,I,I,G,K,A,i,R,I,H;FN8,KR,I,f,Z,U,F,Y,b,Y,F,i,E,G,K,C,o,t,E,J;FNO,I1,P,R,Z,A,F,K,C,Y,H,I,E,Q,E,E,m,j;FME,Hj,C,H,h,S,R,E,P,U,G,a,K,C,O,J,I,Z,S,V;FHm,Bt,N,L,T,K,I,e,M,O,E,Q,X,u,K,C,K,H,Y,x;FBK,Hm,Z,C,BD,u,r,M,T,i,S,S,S,H,U,X,BW,1;GVq,Rj,N,F,Z,W,L,S,C,M,K,M,A,I,I,G,M,D,G,N,I,F,E,N;GZc,Dx,E,N,H,N,I,V,U,c,S,C,U,L,E,L,J,X,N,L,R,D,J,O,N,A,H,d,P,J,L,M,M,O,H,m,1,7,R,g,E,e,Q,U;GVG,BV,K,J,H,L,H,C,b,A,N,J,C,K,Q,O,K,D;GQy,UV,J,h,L,4,I,BS,O,n;GAM,Wf,R,F,R,I,E,S,i,E,O,H,O,P,b,A;GDK,Mf,r,l,H,I,E,m,N,Y,I,w,M,Y,e,S,K,Bp;GYm,jN,Z,C,D,S,G,K,q,M,q,k,U,K,K,l,X,L,V,X;Gc6,a3,N,N,L,X,H,H,R,F,L,W,T,D,I,U,I,G,M,A,I,J,a,g,G,A,G,H;Gbu,ar,d,H,R,Z,P,A,R,f,N,I,R,N,R,K,V,C,y,q,T,I,q,D,k,U;GZy,a7,F,L,3,A,A,M,U,S,S,C,Y,H;HAk,VJ,N,D,H,Q,K,E,K,L;FXm,DY,C,N,P,E,J,M,G,K,G,C,E,N;FY6,Ck,A,H,T,M,A,I,C,E,M,J;FaQ,Cq,N,H,R,U,A,E,E,E,K,J,M,F;Fbs,M,C,H,R,K,Z,e,I,D;Fg2,KM,D,P,P,I,D,O,E,G,K,D;FfK,JO,J,A,H,e,A,K,I,F,G,H,M,H,E,A,H,R;FpQ,JY,L,N,L,I,Q,U,E,C;Fpc,FP,X,J,J,S,Q,G,Q,F;Fkq,JX,J,H,F,G,D,G,E,G,K,C,G,F;Fiy,Jt,F,F,V,I,H,M,M,G,W,H;F7E,XB,D,J,L,C,L,M,E,E,G,C,G,D;F1m,Sv,F,J,V,C,D,I,M,O,I,A,I,F;Fdg,Vb,N,F,L,E,F,G,O,M,O,G,E,J;FD8,Gs,A,H,V,W,Z,M,K,C,S,D,I,F,I,L;E7m,Su,F,H,N,E,N,S,E,E,Y,H,C,J;Gas,Ff,P,D,L,G,C,e,I,G,E,D,G,R,I,J;GZi,NR,V,Z,N,A,T,Q,F,Y,K,K,m,F,I,J;Gbg,GV,E,J,P,C,F,O,A,I;GZQ,F3,P,R,D,K,E,I,K,I;GNW,cN,J,D,H,C,C,S,F,M,I,K,C,S,E,E,G,J,O,D,C,J,F,P,V,R;GMG,al,J,A,D,I,E,I,I,E,E,A,G,J,A,F,F,F;GA6,cT,H,H,V,Q,Q,K,K,J;GHg,Nc,U,A,a,E,I,V,A,J,l,L,X,Y;GHi,Kk,D,H,T,Q,F,M,C,I,S,C,I,H;GcK,TR,D,L,H,K,J,G,C,M,I,F;Gay,RB,D,V,J,A,H,I,D,G,A,G,E,E;GRk,W9,b,A,D,U,Y,J,G,A;GHO,bB,H,A,J,E,E,I,H,O,C,M,M,G,Y,A,A,J;GDi,LL,H,l,N,U,O,Y,G,E;Gm2,Ci,H,H,H,C,F,I,A,G,G,E,G,D;G9c,G1,F,F,D,I,C,M,E,C,E,A,G,F;G62,Nt,K,L,Z,I,j,S,D,M,c,T;GyS,Ch,R,R,BZ,N,Q,S,BE,E,A,I;GxY,Bt,N,A,V,I,M,I,O,G,E,A,I,F,E,H;Gt4,n,J,A,J,M,V,M,N,Y,u,n;GnI,D,A,H,H,K,F,C,G,Y,E,P;GnC,CE,L,D,D,K,E,M,I,A,E,D,C,L;Gmo,Ch,D,F,X,E,F,E,K,c,K,A;GrO,Ld,A,J,D,D,L,C,J,A,H,Q,A,E,Q,H,E,A;Gqs,Ll,j,L,I,U,E,G,S,H;Gkw,Me,A,J,N,U,F,W,K,J,K,R;GlM,MK,D,D,J,E,F,G,A,G,E,E,M,L,A,F;Ggi,Ii,D,F,J,Y,G,M,K,H,C,F,L,L;G1u,XP,D,L,T,Q,N,C,P,I,i,E;GrE,XL,J,H,R,K,F,G,K,K,K,C,G,F,C,F;GnC,Yl,N,H,E,Q,D,M,W,F,F,P;GaI,hP,T,J,A,Q,O,S,M,G,I,L,T,J;GVK,iL,L,D,b,I,U,K,O,O,Q,C,K,F,F,R;HA4,Uv,F,D,A,K,E,I,G,G,I,A;HAa,Vx,D,F,H,I,A,E,G,K,I,G,I,C,D,L;Go2,Jf,L,R,T,A,F,E,W,K;Gno,Kt,E,J,V,G,J,I,M,I;GYs,bl,H,L,N,C,C,M,W,Q,Q,C,K,F,C,F,Z,D|Dh4,BO8,B4,Bc,HW,S,E1,Iw,Cw,C6,BS,BD,Dc,y,I4,J4,P,Ci,Cc,BS,ER,DI,J,Es,Fo,f,EQ,By,E,K,Y,M,Bs,2,U,M,A,D,w,D,w,Cr,CQ,BR,z,z,Bk,E3,Cr,I,BI,B3,A,CF,BM,Q,GE,Dv,E,R,J,E,C5,EX,Ik,EP,EY,H,Ds,CZ,I4,BN,e,Es,J,G,D,G,I,K,6,M,e,Q,k,L,S,j,V,BJ,C,T,O,P,M,J,D,F,d,Z,Y,t,Ca,x,CY,i,BQ,Z,EO,U,G,BW,T,g,BF,I,H,y,A,E,Q,A,Cs,Y,CQ,Ca,Ea,CM,Ce,3,CG,BU,BC,p,t,BF,8,a,c,7,9,BJ,DQ,j,G,F,D,N,BZ,B1,s,Bh,C7,c,Db,CJ,A,Bz,Bp,CD,S,BL,B3,Dx,Cl,k,l,F5,Br,t,N,H,D,O,BB,FQ,BD,C,BB,CT,l,s,Z,V,h,By,q,BY,Bo,W,BI,CM,w,M,BX,u,HL,Y,h,C8,p,v,Bd,BY,n,h,BV,BC,BH,CN,Cy,CD,Bl,P,Bb,Bz,CQ,BL,f,B7,BK,Bj,Y,Dj,F,f,C7,9,l,CW,C,Bv,Dh,B5,X,DB,E1,Bx,Jp,KV,GX,Cv,Bd,RZ,C5,Cb,Bg,BP,DN,R,C5,DV,DJ,Co,KX,YY,CL,K2,N,FQ,Bm,6,B1,L,2,Bs,CD,I,V,DZ,EZ,Bj,Fp,FA,D4,4,BA,Bq,ED,x,Cp,CU,BK,4,B5,Z;E22,WC,N,R,Z,y,L,E,A,Y,E,I,c,M,I,H,O,x;E2W,Xu,T,V,J,M,C,I,Q,K;E0c,am,G,J,L,C,N,K,E,M,E,E;E1a,Za,P,A,N,Q,E,K,K,C,K,P,E,L;E1u,aA,N,J,F,S,A,M,G,K,I,D,F,L;EzU,de,L,D,H,O,G,G,E,C,G,A,E,P;EyY,iC,H,H,V,G,C,U,H,U,U,Y,M,G,M,p;EzA,ks,L,F,J,G,G,I,C,Q,K,L;EzG,lO,n,BE,g,BG,U,E,L,Bw,Y,B2,o,m,C,BF,l,5,U,BT,b,V;E0E,m0,I,d,R,M,F,I;EzG,pe,H,N,D,c,C,E,E,A,E,D;Dww,kI,D,A,A,C,C,G,C,E,C,A,D,F,A,F;Dxs,aq,F,D,D,D,D,A,D,E,C,C,C,F,E,C,E,I,A,C,A,D,A,F|yJ,Dbo,DC,e,Br,5,E0,B3,K,Bd,QZ,FX,M5,BW,Da,Ck,H3,u,G4,m,CB,e,CK,y,Ih,Q,D0,s,Bv,U,BO,BE,DQ,3,Bd,Bs,Ew,BV,z,BB,Bs,Bd,C8,Cq,Ca,BF,CM,BS,CE,Bb,h,BY,Ca,p,E2,B0|BJY,CgK,U,A,Y,f,i,L,M,R,U,H,S,C,O,L,E,V,E,D,H,H,Cv,BV,Cv,D5,Cz,j,J,F,H,E,CN,G,z,h,n,E,h,T,F,A,D,A,Bv,l,Bx,I,EB,CQ,L,C,D,E,b,Y,A,I,J,I,H,W,H,G,n,A,g,W,q,K,G,U,P,U,I,K,F,a,a,E,W,Y,J,O,t,M,a,Q,w,P,4,G,J,a,M,Y,M,K,E,A,B4,x,DG,E,O,q,Dk,a,B4,BS,FO,d|EUR,wW,EL,BJ,Bv,W,CZ,C3,BB,m,7,5,BZ,F,G,Bh,B9,9,C,U,Bb,8,J,E,Q,Q,L,I,M,6,R,Q,n,D,h,W,BF,d,H,a,p,K,BV,BG,t,I,F,C,E,I,i,e,L,0,K,i,DC,CO,U,H,KM,6,CS,j,Bk,BV,BF,D,Cy,BL;Eex,00,h,R,L,A,O,M,Y,K,U,G,Q,D;EdB,1G,R,N,D,G,I,K,I,G,K,A,D,F|Dtj,BBm,O,v,J,p,U,b,h,j,O,1,1,b,w,1,D,9,R,Q,r,W,Cp,R,CD,U,BN,r,B7,BU,o,q,Ey,v,BU,c,G,U,Bf,BS,W,BM,CR,s,A,e,Bq,Y,DY,v;Dw1,8k,F,P,1,Q,r,W,C,K,W,E,y,X;DwZ,BCo,I,H,F,F,V,C,V,I,N,D,N,G,K,G,Y,A|DJ7,Qw,r,w,Bb,Bm,0,2,P,BO,Cu,BU,A,e,5,M,T,BE,Cy,CS,j,8,I,F,Eu,Dp,h,DR,0,Be,BY,N,Ca,B9,E,CB,E,D,d,Bt,B5,p,b,CV,BS,CT,BI,D,U,Bt,CM,C1,I,H,L,D,Cj,G,CT,Bb,BB,O,j,BB,BB,R,BV,k,Bt,Bq,v,Ci,c,C4,8,BG,f,Bc,Bd,e,g,Bw,f,g,Bp,F|15,n0,Dq,c,BM,m,Dq,A,BE,D,A,R,M,X,J,j,x,T,q,r,C,3,DF,v,BL,B1,L,O,I,a,j,X,j,m,I,k,b,C,BU,m,BH,E,T,g,BW,m,CZ,r,d,o,BB,E,G,0,p,J;z9,jq,R,F,L,O,M,E,I,I,K,G,E,A,E,R,F,J;zT,ju,D,H,L,C,C,G,D,C,C,Q,C,C,G,H;yv,kM,A,L,J,C,D,C,G,Q,G,G,K,A,C,D,D,H,F,H;yL,lO,D,H,N,E,Q,S,M,C,A,N;zT,lA,L,J,L,E,F,G,A,K,M,O,I,D;zl,mU,L,Z,N,C,L,Q,A,G,a,C|hL,bY,R,C,BJ,h,q,BC,Z,BS,b,I,O,m,B5,CS,Dv,V,B7,Cl,1,L,D,G,BR,Cu,CZ,BC,BJ,CM,3,V,C,W,BK,B0,DE,u,D,2,r,q,w,S,I,i,N,W,A,Q,BC,D,BE,H,E,d,a,I,Bs,n,DC,Q,O,F,H,F,R,l,m,l,BO,m,y,BB,BU,BA,By,j,BM,w,N,k,4,D,8,Ch,BW,9,3,BL,BE,F,O,Bn,8,1,F,P,F,H,f,h,E,Bh,w,R,F,v,c,X,h,V,D,n,u,f,I,v,Bz,K,F,r,y,j,t,Br,p,I,N,J,H,G,N,S,b,F,l,BT,v,J,d,g,p,I,S,4,f,CG,1,m,5,X,J,Q,b,F|Exj,u6,i,Bq,Z,y,Bc,Ca,EK,A,G,BC,DN,Cy,BW,D,A,B0,FO,D,q,A,D,x,P,Fb,BI,A,K,F,w,X,C,m,BK,t,DD,CP,L,j,K,1,j,f,F,J,F,C,n,J,E,f,Z,N,Z,b,L,C,V,N,h,j,A,T,BP,g,CL,G,CL,8|DNH,mu,N,A,E,I,C,M,I,Q,K,K,K,F,F,j|Bb2,B34,F,D,L,I,A,G,O,G,C,F,A,J;BEe,B9y,C,X,Q,F,S,X,H,P,f,K,J,F,L,C,F,O,L,K,V,L,A,I,M,Y,G,E,I,J,I,C,I,c;BFY,B78,U,V,R,E,T,P,Z,Q,R,Y,O,O,O,R,Q,D;BEu,CAi,J,D,J,C,N,H,I,k,I,M,M,E,G,J,D,h;BE8,B9o,L,D,N,S,H,O,K,A,G,H,C,L,G,H;BCw,CDM,E,L,t,Q,P,a,h,c,A,I,M,G,a,E,S,L,C,F,T,R,K,L,M,f;BNi,CBq,W,f,B6,h,e,BZ,4,P,E,b,t,A,BD,BM,BR,K,H,W,BN,y,BP,O,BQ,g;BOs,CCK,J,H,P,E,R,W;BPE,CCU,L,D,K,Q,Q,I,H,P;BRk,CBM,V,H,H,C,G,I,X,M,C,O,E,E,O,J,E,N;BR4,CHC,Z,J,b,O,A,I,U,U,U,A,O,T,F,J;BN8,B8W,J,H,J,A,H,C,F,E,E,C,E,I,E,C,I,A;BMW,B2u,D,J,V,G,H,I,A,U,E,K,E,C,e,b;BZq,B0a,J,N,J,K,E,K,L,S,S,a,A,M,M,G,D,X,L,R,K,P,E,R;BZK,B5O,V,D,E,O,L,O,Q,J,O,L;BY6,B4e,H,A,c,W,e,M,M,C,Q,J,p,T,Z,D;BUa,B5Q,T,J,N,K,J,S,i,a,G,D,G,J,D,X;BTi,B5k,R,R,P,C,F,G,I,Q,S,I,I,D,D,N;BUM,B3Y,J,L,P,E,G,E,C,E,A,I,D,G,C,A,M,H;BT2,B4S,F,D,P,M,H,I,I,G,W,P;BYg,B78,s,J,E,N,R,D,d,N,Z,O,d,C,M,M;BV8,B7E,L,A,E,I,S,M,0,I,L,L,V,L;BVa,B4q,T,D,H,C,o,U,M,K,M,J,R,F;BXW,B4C,R,H,L,L,N,I,A,K,O,F,I,G,D,G,K,F;BQk,B7O,P,L,D,O,I,Q,M,A,E,H;BQ0,B6c,N,H,E,O,H,I,E,G,I,G,K,P;BRK,B4k,D,R,p,F,C,M,E,E,O,H,G,I;BSc,B66,A,V,H,A,D,E,A,I,C,M;BSm,B7y,H,P,R,Q,R,K,H,K,N,G,D,M,M,G,G,A,O,R,U,D,D,J;BTe,B7S,J,N,N,C,X,M,L,O,I,A,K,H,c,F;BRu,B5G,F,A,F,I,D,I,C,E,I,A,I,P;BWK,B9S,T,N,X,Q,F,G,Q,G,I,K,H,O,X,S,A,M,g,G,U,N,K,A,F,L,E,n,L,F;BXM,CC2,F,N,m,h,A,R,T,I,M,R,h,F,v,M,L,K,g,Y,T,D,X,T,h,I,P,M,O,S,Y,D,a,K,C,I,k,C;BU2,CGa,Z,H,Z,Q,Y,I;BUE,CE8,J,H,H,N,D,R,V,C,D,O,H,A,H,N,b,E,A,e,i,C,M,L,M,E,E,I,Q,C;BT6,B6s,T,D,A,Q,I,E,W,J,A,F;BRG,B5w,H,F,P,E,E,M,I,E,K,F,C,F;Bby,B14,T,F,H,K,I,W,J,U,m,k,BC,Q,A,N,h,x,E,N,Z,F;BO6,B0o,BC,M,L,Z,m,Z,Ek,D,M,v,Bs,o,f,9,Eb,T,BH,u,Cz,U,F,2,i,a;BW4,CKk,S,F,i,V,I,p,F,L,3,X,A,7,7,t,H,I,C7,s,EV,x,B2,B7,B9,k,s,BL,Br,6,o,BH,CT,CK,7,T,J,Bf,CY,Cz,BV,c,e,3,Bn,j,Eo,CF,C,Bx,Br,BI,Bf,f,Bc,Bb,Cd,U,BY,Dh,BP,BG,BV,5,7,Bq,n,7,Cf,Ds,CQ,Ba,Di,BN,u,s,Gl,o,BH,Bk,BI,g,BV,C,B9,B6,V,O,q,N,U,e,O,A,P,k,BI,c,e,BE,c,I,Q,a,P,g,A,O,c,C,Bi,C,BU,0,B8,C,0,o,M,A,W,D,Es,u,Cc,BD,CK,O,s,Q,P,4,a,O|P,j2,O,N,T,BR,Bg,BP,f,Cr,8,N,f,CN,BA,BN,h,E1,CI,Cd,R,J,KD,EL,Df,BC,H,C,E,I,O,A,o,E,O,4,z,4,x,Di,CW,Eg,l,D6,D,K,D,K,R,C4,Z,g,Q,BU,HG,P,BE,w|es,CdS,j,Q,Ch,k,j,T,g,P,Cx,L,R,E,L,E,K,Bw,s,Bi,8,y,D,Q,CN,k,CT,C,BL,8,J,D,C,M,G,S,U,W,C,S,v,O,Z,U,H,Y,C,G,A,E,M,S,k,S,F,a,L,I,T,C,H,K,O,K,v,a,F,E,M,e,n,a,4,a,P,I,a,y,z,BI,Cq,c,N,c,0,a,M,i,7,Q,J,g,BC,G,i,CC,L,K,Bi,BM,Cy,BB,Y,Bk,Du,BF,Cx,BW,x,Co,D,W,u,A,BI,T,BM,K,Y,H,C,F,Y,BH,Dq,T,h,BN,Fk,Be,FY,CZ,C,A,e,Bt,5,BD,Bk,BJ,P,j,o,7,f,x,BW,B3,r,BP,A,D,D,F,Bj,o,K,d,En,Bl,BR,F,3,r,n,Y,BW,BT,Z,h,6,BF,Dg,B5,I,L,D,F,R,r,v,I,CX,Bh,y,CD,Cl,w,Dx,BF,B7,g,1,3,r,u,BX,E;sO,Cza,E,N,F,J,Z,M,X,A,P,T,L,A,p,W,E,k,K,I,C,M,U,M,Q,A,O,R,i,N,C,F,T,R;t0,CyC,D,H,C,L,J,A,Z,D,Z,E,H,M,E,M,T,M,A,O,q,V;kY,Czi,f,A,N,I,N,C,G,K,I,C,e,H,K,N;ay,C0u,H,F,E,c,W,e,I,A,N,P,F,N,C,H,y,D,H,F,z,F;bs,C0e,J,F,V,A,L,E,E,G,K,E,U,D|CQI,CIm,A,E,v,O,Bf,BO,l,F,V,Z,Bv,M,X,P,BB,S,m,m,5,DU,D9,B0,r,W,I8,z,Dc,B7,DW,m,E8,Cx,E,D,F,H,r,Z,F,R,Bk,BN,d,p,BL,W,BP,E,P,Y,9,S,p,D,t,b,F,D,j,F,G,L,EX,T|1b,r0,DY,A,Q,c,BU,Q,B8,BB,BY,I,e,b,BX,j,C5,BC,d,h,Br,P,F,j,DB,V,D,S,L,m,e,c,0,r,DK,o,C9,b,l,Y|q2,G8,A,P,V,Cn,DM,S,y,Bh,B1,Dj,B8,BN,T,ER,BR,B7,1,BI,3,1,Bh,S,BL,Bi,l,Bn,Ct,D,2,ET,BP,e,BN,BT,V,S,EP,EY,BG,R,Bb,k,B3,Da,Be,z,Cl,DI,B6,w,K,CO,Bc,9,o,e,CN,BK,8,G,J,BU,C,I,i,I,e,X,Em,I,D,DC,A,u,C,M,C,O,DQ,A,C6,R|ek,COG,Q,CH,BN,Ch,BP,q,Q,W,j,M,E,i,Z,A,Q,i,b,Y,W,M,X,Q,w,y,BE,Y,e,J,O,BE,U,J;Yk,Cdg,b,J,f,Z,7,M,f,V,U,P,BF,7,v,V,H,j,z,f,T,f,G,l,b,P,I,P,m,K,O,M,L,O,q,W,BE,D,M,d,L,X,u,r,E,H,R,N,f,b,BK,BL,P,d,Bd,j,i,n,m,L,I,X,n,r,M,j,BW,p,BI,F,l,BJ,L,F,A,C,H,C,D,A,F,F,A,F,Z,H,Dr,CD,HJ,Bk,Cx,CF,e,Bf,C,H,BD,G,x,Z,Bd,Q,j,P,j,W,f,I,A,G,G,G,A,E,H,E,d,I,P,A,J,F,H,F,R,S,CH,g,P,h,D7,W,Cz,y,K,m,BP,i,g,G,Bw,Gu,Bs,Bt,B7,EO,C7,Bm,d,BI,Be,M,IT,B6,BV,CU,Kw,W,Bj,DU,HW,v,v,y,Eg,Bw,Q,CE,Cg,k,O,G,w,BJ,BI,G,By,Bf,Bm,P,F,5,BS,D,BA,k,C,BJ,Cs,z,Q,A,G,H,W,H,G,H,W,A,K,I,M,C,U,F,M,H,I,C,BK,9,CS,D,CM,l,C,R,9,z,t,Bj,L,Bx;Dz,CYE,H,R,P,Q,T,O,F,Q,U,L;CVu,p3,N,A,H,E,F,M,E,W,L,S,K,K,I,N,G,A,M,J,F,P,C,H,H,P;C4A,BG1,x,F,p,S,b,q,Q,g,c,G,q,J,k,v;DKP,uu,H,N,J,I,h,A,H,M,Q,O,T,E,J,G,R,e,C,K,Q,G,o,Z,A,P,M,R;DL1,0W,n,A,F,O,I,M,H,O,E,K,I,G,M,J,C,N,I,L,m,V;DMr,zo,R,L,J,E,L,Q,H,w,I,M,W,H,S,N,H,J,E,l;DLh,zQ,R,A,D,M,I,K,G,C,I,L,C,J;C0N,Hg,E,C,BS,Bi,C,BK,k,2,BH,B6,b,Ci,BC,Bq,O,K,w,BM,DE,BJ,B8,Bl,H,j,0,L,M,BN,i,6,i,Bv,C,J,ED,F9,C3,c,BH,v,Bf,m|C5J,Ca0,F,D,P,E,G,G,E,C,I,A,C,D,A,F;C5h,CbG,R,J,H,E,A,G,K,O,N,e,G,G,O,H,C,H,H,T,K,T|JKR,rB,F,D,F,I,G,M,E,E,E,L;JQX,uN,L,A,N,C,H,K,C,G,I,D,G,J,O,F|DRR,6S,X,A,C,E,K,G,I,D,C,D|DQr,5q,H,A,D,E,D,C,C,C,O,D|H2n,1v,D,D,F,E,D,G,A,K,K,H,E,F;HxR,4n,H,F,L,E,F,E,A,G,C,G,S,A,G,F;H2b,2d,J,A,J,E,C,U,C,E,M,H,K,T;Hvr,5F,c,L,G,P,H,L,X,I,L,S,d,F,V,E,N,i,a,M,a,F,K,P;HOd,fT,e,L,I,C,J,L,f,H,L,H,N,E,J,M;HOl,gD,P,R,A,Q,E,C,G,A;HNR,h7,J,D,A,U,O,H,D,H;HR1,cv,V,F,L,A,H,Q,C,K,E,E,g,F,E,J;HR3,eb,F,D,J,M,A,E,O,G,I,D;HUP,5n,C,F,L,C,A,I,K,Q,W,O,I,C,C,D,d,P,J,L,D,L;HQN,c1,N,D,D,K,E,G,G,C,K,F,E,F,A,F;HT1,7T,E,J,V,M,D,G;HUT,6r,C,H,J,E,V,W,D,G,I,F;HFp,7z,F,H,H,I,J,E,R,E,F,E,E,C,G,D;HH1,7L,A,F,V,S,I,A;HMz,BFT,F,F,C,G,H,K,F,C,E,E,I,J;HZt,z7,F,D,E,Q,G,C;Hct,1n,K,L,P,G,T,E,G,C,M,A;HdJ,1p,J,D,V,M,I,A,M,J;Hh5,zL,D,J,F,I,R,U,G,A;HjV,0r,C,F,F,A,J,K,D,K,N,Q,A,S|Ihq,BDV,DM,Br,Bg,Bn,EI,Cp,G,v,Bn,M,D9,CW,Cz,Ci,BF,B0;Isc,BK9,H,J,P,E,F,E,E,Q,S,J;IT8,BAT,D,F,D,g,G,M,E,b;It8,BHJ,K,F,Q,A,F,j,f,F,T,M,A,M,N,a,W,E,M,G,D,H;IpQ,BEx,N,D,O,S,A,M,G,W,D,I,S,J,L,H,F,L,A,N,E,D,H,N;IsA,BGR,L,D,R,O,d,I,N,M,J,Q,Q,E,Q,U,L,G,T,C,C,I,c,K,U,N,D,h,O,L,O,Z|DlK,Cib,BU,c,K,f,v,N,a,R,Cg,o,g,F,Q,Z,j,v,t,S,BV,T,u,f,k,O,c,P,n,Z,DJ,i,N,Z,5,L,M,0,P,q,Q,O,X,S,M,s,i,m,Q,F,M,l,T,t;Dle,CiR,N,D,F,I,A,I,L,O,E,I,o,D,E,N;CrM,CZz,P,D,N,E,J,M,Q,I,Q,N|BCe,DIq,U,A,i,T,P,P,f,D,D,T,v,D,L,E,R,a,E,I,S,E,C,R,M,C,E,Q,R,K,G,I,O,E;BBa,DIK,C,H,J,C,H,D,F,F,J,A,F,I,G,M,Q,C;BEe,DHq,D,F,R,D,H,E,R,A,D,C,G,E,M,C,Q,A|BP6,DaS,Bf,Ba,A,u,6,BE,BJ,BC,S,6,5,I,K,BW,c,O,Cj,BW,Cv,e,Dj,Be,5,M,M,G,DC,o,Ci,Bx,IK,b,FI,ES,EY,c,EC,BR,z,B9,Q,J,P,D,Bl,X,BK,N,9,BJ,s,9,EM,Br,C9,Ch,DS,Dj,Bl,Cp,DA,C3,Bv,BH,FA,Cp,MF,Hr,J,D,PT,CT,FN,Co,o,DE,Bp,DU,Bc,B2,ME,FW,M,CA,Dl,BE;BI6,DIo,P,D,V,K,D,E,I,C,H,I,C,E,Q,H,I,J,J,D,O,H;BGc,DSA,C,F,c,I,K,D,A,L,L,C,N,L,N,D,V,K,P,Q,g,A;BJi,DIu,Y,F,K,C,O,N,X,H,A,J,I,H,C,H,V,A,L,G,F,I,X,K,G,E,E,K;BHM,DJQ,D,L,P,C,P,D,N,K,H,O,C,E,K,E,G,J;BIa,DIA,V,H,H,A,A,M,M,G,U,A;BHw,DH4,T,D,L,G,E,E,M,E,M,A,E,H;BSK,DXo,f,H,Z,E,A,M,O,G,c,E,q,L,X,D|JWo,0L,Bb,Bh,C,X,BK,u,A,t,Bp,P,t,U,n,n,9,R,X,k,V,C,Q,i,W,L,2,m,BS,U,m,a;JRG,4D,BA,5,Q,BZ,CT,l,CF,k,N,s,U,I,I,m,U,S,BC,e,BM,Q;JWj,2l,H,J,A,i,W,S,G,C,I,R,L,R;JWo,2t,P,J,H,I,G,Q,O,S;JRw,9N,A,L,b,H,P,K,b,Z,d,H,N,G,S,M,K,D,W,U,Y,I;JTZ,6B,H,D,F,A,F,E,F,G,G,E,K,H;JSp,6z,D,F,N,G,F,E,M,C,G,A;JRB,55,N,D,L,I,G,I,K,D,G,J;JTT,3t,F,J,F,E,G,Q,J,G,D,E,C,C,M,H,I,J,D,H;JR7,91,D,A,F,C,H,C,A,C,C,E,E,C,C,A,A,D,F,D,E,F,E,D;JWB,9H,A,H,D,A,F,C,D,A,D,D,A,H,F,A,A,E,C,E,A,E,G,E;JNs,3V,L,D,G,Q,K,G,G,A,D,L;JUw,4D,H,F,F,a,I,A,E,D,E,J;JUi,6Z,D,D,T,Q,E,M,I,G,G,L,E,R;JS2,5N,L,F,H,M,I,O,I,A,E,N;JWb,1P,P,J,A,K,M,K,I,C,H,L;JWh,0H,J,F,A,E,G,E,G,A;JWo,1X,D,A,D,E,E,G;JNW,oX,J,D,N,C,D,E,M,C,K,A,C,D;JFU,BIB,D,D,H,C,A,E,C,C,G,D;JSf,BEr,D,A,D,C,A,C,C,A,C,D|Bzw,Rs,F,E,Bv,Ds,Cn,Cu,C5,BQ,4,Bu,Ci,W,C,Cy,A,I,A,K,0,Ds,u,s,BK,F,k,DG,By,Ck,Be,c,BA,D8,Q,2,E,A,CU,m,6,BB,BE,CS,Bw,BX,B4,o,Dm,j,CM,BJ,Eu,E9,S,V,V,f,Bl,CD,C,CT,g,J,B6,c,4,R,Q,A,D,J,z,BH,k,BX,Dq,D1,Jq,DR,CI,A,BG,A,z,x,JB,JN,Eh,P,FP,Cn,J,L,d,A,DJ,6,D9,Cl,Er,k,Dz,Cc,C3,M,3,Cy,Bl,Y|BaO,C9k,F,A,Cz,C,Dz,Bo,DH,l,C,I,o,Ba,Cd,C,1,8,i,a,z,a,M,4,Gg,Ba,IC,j,C,C,c,X,z,T,d,v,BF,1,O,B1,4,BL,x,N,n,z;BK8,DDG,BG,D,BK,h,n,D,BT,r,BL,D,t,z,f,J,D,O,o,e,BB,W,H,I,a,S,Z,W,s,F;BL6,DDw,R,L,P,I,X,X,Z,F,P,E,N,e,BJ,Q,BS,G,I,M,e,M,Q,P,k,H,U,h;BNS,DC2,R,D,p,O,K,K,M,E,g,H,G,P|B3y,uA,H,4,N,B4,Bi,Dw,U,Cc,BS,A,U,u,CS,2,BQ,Bc,8,B3,C0,Hd,O,BI,BG,Bf,DK,BR,GI,Fz,I,X,z,T,V,p,P,J,t,a,P,F,H,F,T,U,Ev,E8,CN,BI,Dn,i,B5,p,Bx,BW,BF,CT,7,BA,CV,n;CFS,z2,G,T,V,G,D,E,I,I,C,E;CFe,yo,I,N,O,M,g,P,D,L,BX,G,H,S,O,J,K,E,L,K,R,C,C,K,K,I,J,M,Q,D,M,J,G,J|cM,MI,i,A,I,L,A,R,h,v,H,V,N,R,v,I,J,O,G,Y,Y,G,M,m,I,O;ki,HA,A,v,C,DD,En,J,f,W,j,J,C,E,r,S,BW,Ci,H,c,E,u,k,b,Dm,A|EoR,ug,E,D,s,J,BU,BH,o,L,G,b,BE,c,g,X,m,C,Q,R,N,7,K,J,R,R,H,D,T,r,Cd,U,k,V,Et,Bm,b,M,A,S,g,i,U,M,K,D,Y,a,Y,M,F,e,m,I|B46,BI8,lJ,A,BP,A,A,s,5,Zu,Bc,Eq,Q,Z,MY,CR,Ge,Ce,Cm,N,q,Bd,Gs,q,E,E,C,H,I,R,Q,r,B0,E5,L,L,CD,FZ,FV,HI,r,BH,LC,SX,R,DN,Dw,DB|D41,X,N,H,7,E,BM,Bb,BB,DJ,Dl,DV,FZ,Ct,CN,FF,9,I,BB,Bi,Ct,E,D,BW,BA,a,d,Bk,E,E,B0,Ci,X,Bo,T,Bj,R,o,3,BL,CH,Ba,G,D0,CA,Be,p,y,BY,Bs,J,CA,EE,Bq,H,g,CM,Bl,Bi,b,8,Bd,C6,f,k,q,Cu,Bl;EKf,Jl,F,J,Z,C,E,m,G,M,O,K,O,G,Q,A,S,N,V,T,N,D,F,F;EGj,EC,N,A,F,I,O,M,E,C;ErZ,Cf,N,A,f,S,C,U,M,M,o,I,Q,N,A,Z,P,R;Eod,C7,Z,J,J,E,H,I,a,U,M,O,U,I,K,F,C,H,H,N,P,J;Eu7,Bf,V,F,R,I,J,K,A,W,m,E,M,N,A,V;Err,EV,J,A,N,I,I,Q,K,F,G,F,E,H;Eub,G,S,z,o,p,E,l,g,f,X,n,t,R,7,E,R,c,BK,w,E,M,z,2,N,2,Z,H,L,K,W,W,a,E;EsL,BF,L,H,n,G,N,M,K,Q,I,G,W,H,Y,T|Dth,6M,C,8,x,0,0,a,P,0,g,i,V,a,I,o,P,u,I,E,k,g,B8,C,DM,x,s,BN,Bo,H,BR,f,CU,b,By,BP,BJ,BT,B3,u,Fr,j,BV,CD,3,BM|DLr,xM,V,F,J,i,N,a,E,U,c,J,I,N,G,h|CPg,lG,p,BB,b,n,R,A,5,Q,B7,d,h,I,D,CS,Bk,CC,U,e,G,E,O,E,s,b,O,I,U,o,y,S,C,L,s,7,G,5,B3,BJ,h,l,Z,C,E,P,CA,O|Bin,EVi,NY,9,UH,5,WS,k,Lm,Bz,bB,Bx,cQ,Z,Gb,Dt,LQ,Cw,ac,l,RN,C3,Cq,j,Bz,f,Lz,x,Du,Cr,G5,Br,B7,DF,HO,C,D1,V,Hi,CR,Nx,x,I2,Bz,BE,DD,It,N,EM,P,X,BT,Da,BE,CS,CF,J3,L,GU,Bb,3,BR,Fh,n,KP,B2,CW,BH,I7,BN,LE,2,Gu,Bl,z,Cl,Hj,C8,Gj,BD,F8,k,W,BR,Bn,Z,Kc,CH,Br,BL,CW,U,u,DF,Cx,P,N,BS,C3,BV,Er,Cs,Hd,BG,Ek,BL,Iz,5,BW,f,Dh,BT,IQ,J,Cz,BV,Fq,BK,LA,x,NV,Ej,O9,CF,EX,BO,i,Bd,H9,FD,EB,C,w,9,G1,Bx,Be,CW,Cz,O,BU,b,Cf,z,BC,9,GX,f,B4,t,E3,9,C6,Bz,Eh,l,DG,j,O,BT,Ct,CL,Ch,e,Bu,x,5,v,DV,F,Ci,f,I,CT,Bj,d,Bd,D3,C1,Q,Ck,Bv,Cj,x,Bn,U,m,BI,Dv,P,CE,Be,EP,J,k,B6,Hd,Bd,BU,u,E5,B4,Be,Bk,Ez,BQ,Bs,B0,B7,t,Dt,DC,EI,Bc,El,L,4,8,EI,w,Ct,Bm,k,Bd,EJ,BT,Bj,DK,Eq,Bc,Gz,n,h,Bi,G4,Cm,Ht,CX,m,Bm,DU,u,EN,W,X,BY,KS,W,KH,E,B4,CI,GY,k,HJ,T,H0,BO,b,Bc,Cg,I,Ch,I,Ci,Ck,Nl,CG,MY,x,Dl,B4,Ca,D,BL,Y,FR,M,EA,Bk,FZ,T,8,u,Bp,Bw,m,Bh,Bn,BZ,FR,S,Ca,Cq,Cd,O,Cw,BW,DB,c,BO,BC,Cn,u,b,B0,DP,A,DI,BS,Hd,Co,K,BG,In,Bg,XB,P,Dv,BA,Ea,y,Jz,BW,Pu,Bc,J7,L,LN,CU,Wi,DK,FU,DA,Jt,k,Im,CU,J6,a,w,CA,Ce,i,MS,Bz,Ij,CA,PO,BM,C0,n,W,Bp,Bu,CK,LO,BT,Er,Bu,DE,C,RI,CP,Bk,B4,ER,BO,Ng,A,Qf,o;CuH,Dnm,CM,b,e,r,GH,BH,BR,c,Bq,O,h,O,Dj,i,a,w,Bg,D,Bp,m,Be,m,Dc,X;Coj,DmW,h,H,N,G,X,k,E,O,H,K,c,M,Y,C,BU,P,P,L,h,J,N,V,A,R;Cwt,DrK,T,D,BB,O,F,G,C,G,S,K,g,O,Y,E,c,X,C,J,H,P;C1f,Dwy,Bx,v,CF,g,DO,Y;DtN,EBc,CR,G,Z,G,A,I,BS,I,CI,R;CUt,EQw,GH,2,B7,y,DE,S,Ew,r,i,R;BUD,Dqw,G,3,Cp,p,BP,U,Ep,N,BE,s,A,m,Dg,F,Ck,g;8N,EQC,X,J,1,E,Bz,g,F,S,8,I,Bm,j;4z,EJg,BZ,Z,CB,C,Bj,a,B4,g,De,E,O,T;9T,EDg,b,H,T,U,R,e,D,e,o,Q,U,E,O,F,D,r,O,V;77,D7S,Z,F,BR,BU,G,0,k,C,e,N;6F,D5Q,W,r,BQ,L,W,X,EJ,J,t,O,G,y,s,O,m,N;55,ECc,p,A,P,G,BC,m,s,A,I,R,T,P;B5d,DZY,h,A,L,Q,E,S,i,E,U,N;CZR,DKE,X,Z,7,W,Z,D,A,E,BS,a,k,G;Cqt,Dqk,Bb,C,H,G,I,O,c,C,BK,X|VX,DNY,F,J,H,A,T,K,R,E,J,M,S,A,a,J;Vn,DMM,E,H,T,I,Z,Q,J,O,A,G,E,A,G,H,c,H,A,H,I,J;XN,DOc,S,J,G,H,X,H,p,G,J,O;VZ,DOu,H,d,h,K,F,F,Y,b,C,H,F,D,5,c,h,o,q,G;Ur,DO0,J,P,P,C,J,E,C,M,A,Q,Q,P|oi,C38,F,b,BB,Z,F,P,i,R,E,V,BD,V,J,BN,n,L,r,BW,BL,C,Z,a,L,2,d,Y,BG,G,e,m,g,E,O,L,D,l,a,H,U,a,L,c,BI,e,BK,N,N,d;fa,C02,Z,G,BN,L,BJ,S,v,A,D,S,J,BY,Bl,k,G,DQ,Bo,X,s,w,BA,J,K,BA,1,C,t,7,9,P,n,m,BG,0,Cm,M,Bs,BU,CG,g,j,l,Q,BD,t,x,F,BP,CG,l,l,p,BP,C,r,BT,1,D,Y,R,BZ,3,Q,t,t,v,0,X;iW,C3Y,i,7,H,n,j,R,l,A,Bd,W,b,o,A,g,BY,S,a,L;ko,C1E,BO,R,G,b,BB,L,BX,c,E,i,o,C;im,C0m,J,A,P,U,w,o,O,W,E,A,H,V;oe,C1U,J,F,f,C,l,P,N,E,E,K,Y,M,C,I,o,J;o2,C3W,V,L,F,C,H,K,Q,O,E,A,G,H;hy,C06,N,D,R,E,d,U,O,D,u,T;gc,C1E,V,F,N,G,T,C,J,e,C,C,K,D,i,P,M,R;iO,C36,F,D,N,C,D,O,E,M,F,K,G,G,S,R,E,H;jo,C8q,J,F,d,G,M,K,g,E,Q,D,T,J;wq,C1e,J,F,h,G,r,O,G,c,M,M,BK,h,C,L|8u,Cjs,F,A,r,F,Bb,v,P,n,BF,l,B1,H,p,l,J,R,F,E,BR,k,Bj,L,DN,y,BP,BT,CF,A,r,g,H,C,J,K,Dh,B4,7,BE,Y,g,BX,BS,m,Z,2,q,BQ,E,Em,Bk,L,c,Bi,p,C,E,S,A,u,a,C0,BP,2,K,c,T,r,f,BY,BD,BI,c,X,m,Co,Z,X,f,w,l,CO,R,BA,BL|Bvq,BzI,Bv,P,A,U,R,M,Bp,P,h,Q,M,D,W,E,M,q,CK,J,DE,BA,CB,BN,D,f|Brg,Bzc,g,R,Bo,O,Q,N,A,V,Bu,O,E,F,G,N,BJ,F,7,t,7,L,X,b,B7,q,X,8,S,H,0,a|EQB,BMs,Gg,3,SS,Ix,Lh,BB,Bk,Cg,C3,Y,B9,Cq,KF,CA,L,Bg,Jp,Cp,Cu,Cm;ECj,BIy,J,H,L,K,F,A,Z,O,F,K,e,D,c,H;EDt,BJ4,F,F,L,I,R,C,L,M,J,E,A,E,O,E,K,D,M,J,G,R;EFp,BKu,c,F,S,E,K,D,O,R,3,A,f,O;EDP,BJY,H,D,V,K,H,G,G,K,C,K,C,A,E,N,Q,H,A,D,K,L;ESV,BHk,7,b,X,A,X,G,P,M,J,S,a,P,Q,I,X,o,A,I,S,W,4,L,Q,Z;EH9,BLG,A,F,j,O,X,U,K,A|ry,CW0,Ci,J,o,k,s,l,Bw,D,P,y,BO,c,D,BG,Ci,BC,S,F,K,D,EA,CR,Bw,J,Bu,k,C,A,D,F,N,P,W,l,H,N,c,P,N,b,BS,n,D,J,z,G,D,L,P,D,G,r,T,H,C,H,P,A,5,q,Cv,A,C3,o,BR,N,x,r,Bn,i,L,BV,BK,z,o,BT,DE,CH,BG,Bt,L,E,CF,BY,C7,a,Cl,CG,4,U,C9,DU,CH,Bh,BP,CG;1s,COs,m,H,a,C,s,N,Bd,D;3c,CPI,Bp,D,9,S,c,E,c,F,I,J;2K,CPk,h,A,r,K,G,O,BO,J,M,J;xI,CSI,E,H,b,M,L,K,A,E;vw,CVG,Z,F,N,G,F,I,V,C,P,M,Q,K,K,O,M,J;v0,CUY,G,L,V,I,R,E,F,G,G,K,M,D,C,F;xA,CTC,H,H,z,k,j,q,g,T,BG,1;xA,CRq,C,F,N,C,z,s,F,I;xk,CR0,O,P,P,C,N,K,J,K;uu,CUE,D,J,N,K,X,u,D,I,I,I,A,I,L,Y,O,G,G,d,Q,N,F,V;4y,CN8,a,P,BT,S,S,C;7e,CNS,A,J,I,J,I,L,n,U,Bp,2,Cf,q,i,E,Bm,l,L,K,a,A,BC,r,u,V|J9,Qi,F,J,d,E,I,I;Zx,gw,G,A,8,2,g,C,c,l,BG,Z,O,o,0,C,I,BA,u,V,D,W,i,K,M,Bl,i,J,m,o,4,K,I,D,M,P,BK,Z,a,BB,BG,t,8,N,Bu,2,B0,F,BS,Bh,U,G,E,E,C,L,k,D7,CX,Eh,w,Dj,y,5,P,5,p,F,D,E,Z,o,p,t,GP,Q,s,R,Hp,Cb,X,H,S,Ey,5,Q,z,BM,B9,o,6,Bk,j,B0,F,C,M,I,o,J,s,Bq,z,i,E,q,By,L,J,u,v,e,C,m,g,U,d,W,E,u,x,Q,F,Bg,e,g|ESV,e4,R,P,h,Q,d,d,A,BR,q,d,n,l,M,7,j,X,e,3,P,W,Bb,Bu,U,BB,BB,O,b,a,S,BY,DD,Bs,b,BE,BD,s,v,c,BM,Bb,t,x,B1,BO,j,BE,k,Be,x,e,i,c,A,E,g,a,CK,x,4,U,4,P,k,p,y,J,q,K,O,a,E,J,2,Bz,CY,CR|BlM,ab,j,H,Fb,3,Bn,CX,y,ET,3,DT,CM,Ch,CY,m,F,EJ,Cf,O,F9,Fw,BH,BR,Cj,Q,CN,2,N,BU,C7,r,BP,Bu,H,C,J,F,Ff,v,Bd,MS,GJ,BC,Bv,DL,Fr,b,Dt,HG,K1,I,P,E,Cd,G,H,K,6,M,E,Bw,P,Q,BO,BE,u,S,C,E,E,G,BC,x,DE,Bu,BI,B3,EI,Dk,u,FI,E6,FQ,BC,IQ,Bw,EK,D,k,D,o,D,CK,C6,Cg,Da,CL,GA,BF,Ba,B4,Im,B4,FG,X,6,T,I,P,Ca,CP,Bu,e,Bk,X,y,s,q,F,Dq,Db,E,J,M,H,j,DP,Bq,BX,EP,D7,BL,HD,A,H,J,F,n,X,r,9,D,BP,3,z,M,v,S,J,A,J,q,7,A,Cx,g,BR,E,f,A,L,R,BT,6,Cp,P,B5,CK,CX,Bo,Db|j4,Mp,BM,BS,BO,f,3,ES,Cs,C,k,Bm,BK,Bj,Bg,T,2,0,0,BJ,BQ,B6,S,EQ,B9,BM,B0,Di,z,Bg,DN,T,U,Cm,A,O,w,A,DY,I,BC,n,Cs,V,BC,v,Y,B2,A,C,O,c,BW,Do,Co,e,CK,n,BA,Y,Q,X,M,H,C,l,Bx,EL,BD,IR,E7,FR,v,FJ,EJ,Dl,BJ,B2,DF,Bv,BD,w,F,H,F,C,j,i,R,E,BX,n,P,f,X,D,l,t,F,E,CF,Cu|CTe,m9,K,d,A,V,H,J,J,E,R,S,h,Q,O,C,S,D,G,K,A,G,I,E;CRQ,nt,O,N,p,G,H,K,A,I,O,D;CQO,mZ,j,M,P,S,G,BC,I,M,I,A,K,J,D,p,W,z|DsF,mQ,Eb,DT,CN,FV,B0,R,Ci,Gt,GK,T,CK,Cp,GS,M,BP,FZ,Bw,Dh,Bx,CD,CG,BT,BA,Dj,E,P,n,J,BF,DC,Bj,BL,BB,u,C,3,FZ,D,A,CH,Bu,D,g,BR,C5,R,F,CV,CK,DZ,Bx,Jt,F,J,L,Q,BD,BI,BT,G,CE,Dm,Cz,Bc,GX,l,CV,Dq,FD,D4,N,P,l,O,Cv,Bk,l,r,C7,e,9,Bc,Bj,a,CN,Bk,H,M,F0,Hs,Bb,8,2,FE,Bx,EY,V,S,g,BA,F,g,i,h,w,i,A,a,e,a,5,Bs,W,g,G,F,Bw,CT,V,CO,EC,Cq,P,CO,Cy,DI,Ba,BH,0,Bw,Cq,F,FK,Dm,BY,Bn;ED9,IM,H,F,L,I,F,K,G,I,I,F,E,H|GJO,BRC,H,N,N,C,A,I,D,C,C,I,C,C,O,H;GVG,Bnk,R,H,1,S,l,S,b,i,y,L,G,P,BC,d;GWg,Bio,F,F,Z,M,d,C,J,K,D,Q,c,A,i,P,I,J;GWG,Bhu,A,F,T,O,J,C,E,G,M,C,K,R;GW0,Bia,D,J,F,A,J,Q,E,G,K,D;GOg,BUI,P,L,L,E,A,M,E,M,F,I,E,K,M,C,E,H,G,D,C,L,H,L,E,H;FuG,BGC,G,H,U,E,E,N,J,L,R,I,d,D,F,G,K,I;GTI,Bcm,T,H,H,A,A,Q,Q,M,I,L;F4U,BLi,A,J,P,O,H,A,N,O,M,A,M,L;F10,BHq,F,F,H,I,D,K,F,G,K,G,E,I,Q,F,L,J,D,F;F1W,BHy,X,F,G,K,S,I;FmS,BHY,EP,Bg,X,Bq,u,4,DD,c,Bz,BY,EV,Cn,B9,u,BJ,BD,Bp,8,7,BH,L,H,J,G,d,G,X,L,V,W,t,z,Q,1,c,h,F,Br,Q,V,V,N,h,Q,1,L,N,I,F,8,N,K,C,C,DD,Z,7,B0,Cb,Y,BG,Cm,CH,u,F,DA,EJ,r,E,Cw,De,Dg,Q,DA,T,Cg,BJ,F,CF,DE,9,z,J,H,H,E,DR,i,8,BI,d,6,9,b,s,BE,BD,o,CH,BV,Cf,2,Eb,CN,CR,Cb,Ct,Z,R,A,A,I,F,e,BH,a,n,X,CX,W,A,g,BN,O,Bb,p,B5,CH,N,d,N,I,P,O,D,S,U,BI,T,i,l,K,f,R,7,N,J,L,C,H,T,C,Gj,G,Mv,Hy,DL,v,L,M,F,Q,GF,Du,BN,R,A,CE,BJ,B2,Cq,J,Bl,E2,y,y,CR,BQ,x,Cq,x,C,A,C,R,F,3,A,B1,a,X,K,J,E,j,S,D,Y,BN,R,3,w,M,BE,b,2,BX,S,P,i,Cb,a,N,F,D,C,h,a,BK,a,I,J,O,F,K,A,G,E,o,c,v,q,K,i,f,BE,E,BK,Bt,o,BB,b,j,Q,V,w,W,Y,p,0,G,i,D,K,S,C,2,B2,Cu,Ba,CU,e,Y,BD,CE,I,Bm,CC,EM,U,Gy,DY,F,M,E,E,c,Cm,BW,c,BZ,DC,U,CG,B5,a,F2,Bg,Cq,t,r,BY,CU,FQ,Fq,BL,CO,u,2,ES,Ck,c,o,Bi,Bi,U,S,F,U,D,M,C,I,G,w,K,K,D,E,J,e,Bz,Hk,C5,CI,C7,X,FB,Oa,C9,DW,FD,Qe,l,LO,DD,Re,Dw,E6,DC,Bt,CI,Bm,CO,Fo,9,MO,F4,H0,Q,Eb,EO,JT,X,DI,F0,S,c,q,R,DK,v,Ee,By,Ey,Gi,CT,CA,CI,Bc,JY,BO,H2,Cn,E0,Jf,Jq,DD,Bc,Dx,L0,By,G,CD,FJ,ID,EF,o,Cz,Bl,4,Et,CN,Cn,L,H,H,G,B7,BY,p,Bx,Ch,BV,Cz,L,U,B7,En,BE,CX,Cp,FR,C5,D,C,KT,EJ,CI,CI,Bx,e,DQ,DO,Dl,BK,HF,Fj,D3,L,Z,CT,EI,BP,i,Ct,FS,CC,GM,BZ,BF,B1,G9,CD,DR,EX,Di,B3,B2,FN,DQ,Ct,F3,Y,CM,I,Du,Db,Fd,CN,GG,BN,B1,BR,Be,C,Br,BL,g,Ct,Cx,5,CJ,EV,Bn,W,6,Bd,CZ,r,Bi,Z,A,B9,Fv,C9,s,t,FJ,EN,G3,BL,P,L,R,E,P,A,P,F,H,H,T,E,Bj,Bs,U,Cr,A,D,F,G,J,D,D,F,A,F,D,D,J3,Cv,1,BT,BM,Bj,BT,p,Bf,CI,2,By,EV,BW,Br,BN;Fvs,BCe,Y,BF,BN,BN,n,Bv,BP,9,Bx,v,Cp,BC,L,CW,CC,Bk,V,C,Q,W,DE,k,BO,R,M,g|F4E,BJm,A,E,C,E,I,C,E,H,L,F|F5y,BKm,G,G,O,E,O,A,Q,F,E,J,D,J,K,F,C,J,L,H,F,P,x,Q,T,F,J,I,A,G,W,K;F6e,BJo,F,D,P,O,D,E,M,C,M,J;F5u,BJo,Z,A,H,C,D,E,I,I,g,K,J,L|Fqh,BZj,f,H,A,K,I,K,W,H,M,A;EGN,Buj,l,F,D,C,C,E,S,M,G,A,Q,H,C,H;DpL,7N,w,E,y,Y,a,s,L,6,I,I,a,C,S,Q,Q,M,C,X,BU,BZ,Y,C9,Bo,Bf,9,DN,By,C1,BC,E5,Bq,J,i,I,k,l,BJ,DV,Dt,B7,m,Hj,EV,Ep,l,Fr,CN,DL,CK,J5,CT,DV,g,Cn,Cj,Ch,BG,Ff,Cz,Dj,H,Hx,BR,Bt,BC,Fz,CI,l,C5,r,CS,Bf,BT,BJ,K,Dd,C7,G5,DJ,Cj,BY,Dv,Cm,M,P,Cx,Bk,Bd,LO,BN,B1,U,Fx,Bp,Bn,Dl,Dl,Bs,CA,b,By,CK,ER,CH,Bn,s,BC,Bi,D6,e,D3,O,BV,Bt,Bt,u,Bs,BI,C3,f,7,Bq,Fu,d,x,CO,BV,Y,B0,BJ,C9,x,CN,BK,0,BU,Dt,B4,Bc,BC,Cq,B3,g,Bc,BF,BH,CH,CE,Ci,B2,T,B4,Bb,BP,BK,DA,B1,Bg,D2,l,BH,Bq,C3,V,Bi,i,BJ,g,i,CE,Eh,E,CE,C4,Dk,Bg,BZ,Cp,CG,BU,X,Cd,Y,Dg,Ck,G,Bh,BI,CU,Bo,B5,BW,Bi,GC,BO,T,BV,Bi,Bm,BU,D3,9,Bd,CM,CY,GI,BZ,GE,Eo,HO,Ce,H2,P,MC,Cy,IY,B0,QC,5,Ji;DjZ,Ct1,F,HH,f,A,CP,D,v,e,Ch,V,En,4,Do,o,U,h,BQ,J,Bx,BW,D,u,BG,y,e,BL,z,F,S,b,BM,x,BY,O,Bk,z,q,e,DF,8,h,s,M,i,CY,w,J,W,DD,D,X,6,BA,e,z,m,Ba,P,Ba,BE,BE,l,Bo,I;DeZ,C15,1,d,Z,W,5,R,BF,I,v,w,m,K,Cw,L,c,R;Dz9,CP1,BH,D,5,a,k,BI,I,B8,U,g,G,BA,Bo,V,W,7,X,Z,M,h,BD,Z,BI,BJ,V,b,r,T;D2R,Cij,J,Bp,M,H,D,V,Z,t,j,A,Z,4,g,BA,x,X,P,BB,Br,K,G,i,k,D,G,c,h,a,c,S,w,A,A,Q,Z,I,0,m,H,c,Q,S,BE,F;D5l,ChT,X,A,H,i,a,0,C,U,L,g,i,K,u,BV,A,n;D19,Cut,CY,f,Bo,5,BZ,I,9,q,BT,E,Bb,BE,c,F;D2j,Cgv,F,H,BF,D,T,S,J,e,h,y,J,W,K,M,s,K,Q,Q,O,D,F,j,Y,X,a,x,F,N;DxP,Cwh,I,V,BS,D,2,t,1,t,BT,V,T,M,o,q,5,G,J,j,b,C,V,O,D,o,f,F,j,i,r,E,g,Y,w,E,BI,V,K,Y;D3X,Cqj,I,n,a,L,Y,Z,d,j,F,Z,h,C,j,u,T,y,U,O,S,F,C,S;Dm1,C1L,Ck,V,Ba,M,M,R,r,Z,BE,V,L,P,w,f,I,h,Bv,m,5,A,F,q,BV,O,N,b,k,j,N,D,BV,g,H,U,9,O,U,2;DsT,CyT,BM,R,E,d,Z,Z,BJ,c,7,A,n,P,F,S,x,g,M,W,e,M;Dz3,CTN,1,f,2,B3,F,f,R,D,F,N,z,C,C,a,X,M,BX,Bk,c,O,F,W,o,O,i,F,K,u,S,K,S,C,o,d;Dxd,CUd,x,R,Z,G,L,M,L,a,i,e,E,c,K,E,k,L,y,b,E,J;D4F,CUz,H,F,H,C,F,G,F,K,G,E,G,A,G,F,E,L;D45,Cnf,H,T,R,C,H,E,D,M,H,G,I,K,E,O,D,K,a,A,k,H,R,P,T,F;D4T,Chj,D,R,d,f,b,T,Z,P,b,G,e,Y,F,O,b,O,M,Q,Be,S;D4T,CeV,R,D,A,G,P,M,i,O,S,A,O,H,C,J,b,J;D23,CQr,d,F,H,G,A,G,E,E,O,C,K,D,G,H,C,F;Dzh,CUl,N,D,H,G,D,K,T,U,A,I,I,K,M,E,G,D,K,N,E,d;D2h,Cpb,A,R,N,J,P,G,h,N,p,G,d,j,V,N,D,O,e,4,W,J,8,W,a,A;D4H,CmR,p,R,N,I,d,A,Y,BE,Bc,V,I,T;D0H,CRZ,E,L,X,A,N,J,h,G,F,E,A,K,i,A,W,I;D1L,Crh,H,D,j,I,R,K,N,Y,G,C,S,H,Q,N,e,N,C,J;D1t,CXZ,N,L,V,F,T,I,Z,F,D,Q,o,u,D,c,Q,S,W,G,E,X,H,l,S,f,D,J;DgB,C4T,3,G,A,E,S,E,y,F;Dcb,C2L,R,J,N,A,H,I,I,I,M,E,U,F;DrB,C1B,m,V,BO,M,c,h,p,X,Z,U,X,H,v,K,1,i,n,J,L,I,O,M;DfF,C37,J,A,N,G,j,G,A,C,C,G,U,I,K,K,G,A,M,V,K,L|BPW,BA4,A,Bd,D,Kx,DX,l,Dj,I1,Bq,b,Bu,FR,H,X,J,C,DZ,7,En,E3,Ed,n,e,5,Br,B7,Jr,Bv,X,A,K,Q,BV,DG,Dn,DU,w,BQ,Ei,G,Br,CE,5,F8,B9,B2,l,A,b,k,j,u,f,q,V,BY,GU,I8,Bk,LG,Ch,Dw,T,C4,X,B2,BM,g,CC,6,YQ,MB|BP4,b8,I,F,U,BL,By,f,BI,BF,D,7,m,n,DK,CP,e,B1,CK,BR,e,Bl,O,R,7,S,FH,W,In,B5,Bb,B5,GB,BE,Db,CK,C7,Ch,C,CL,C,p,N,G,R,W,BB,Z,CL,m,Cp,f,BX,Dp,P,d,J,S,R,Bw,DB,C8,BT,Ce,X,EG,n,i,DE,EQ,U,g,W,A,Jq,Bu,Bq,B6,f,4,Ec,m,Em,E2,DY,6,I,D,O,Z,BE,BH,BQ,CF,H,Bj,h,7,Q,v,Bo,b|BTN,2q,V,F,J,C,H,e,u,U,Q,D,K,T;BNn,wa,N,T,d,A,P,I,R,Y,I,g,A,S,I,D,C,L,g,b;BST,2Q,R,H,L,C,P,G,E,I,Q,I,K,C,K,P;BL7,0Y,S,F,G,C,K,D,M,L,C,N,H,P,X,L,N,A,R,M,I,U;BQb,v6,R,J,L,C,L,I,H,M,E,K,W,M,M,F,G,T;BPt,1m,M,L,N,D,f,I,J,F,J,T,R,a,E,M,W,J;BL1,1u,H,L,N,S,D,W,M,G,G,A;BMx,w0,H,D,J,K,C,M,D,E,I,M,O,A,E,L,A,V|G37,Cym,U,N,0,G,a,d,J,f,BL,b,W,H,2,G,Q,k,F,i,Be,W,t,BZ,P,BT,BR,Z,j,A,v,Y,M,M,0,F,BX,g,p,2,L,u,K,e;G1B,Cvm,U,V,E,l,BH,J,Bo,l,b,Z,g,h,i,A,N,Z,k,D,E,P,V,P,DF,CC,T,e,Y,O,BV,c;GmV,CnW,Fi,BD,CG,Cj,DK,BV,B0,CJ,7,d,Er,BQ,Z,W,BE,BQ,CX,1,BT,Bc,B9,E,BW,y,DL,q,d,0,B9,D,L,BC,BW,L,E,k,B5,R,7,w,BY,Y;Gvd,C4S,Fx,CQ,FH,F2,GB,EK,t,S,Ct,n,Dn,CR,FL,Dg,f,S,W,0,GN,J,A,eK,c,D,SE,DH,CH,BY,E0,B0,Bs,j,7,1,O6,Cw,KL,Cv,Bp,Br,Ei,CO,Co,t,G0,Bu,Dw,Bo,BB,BA,HS,D1,Dw,Ce,Ba,Bf,t,BF,IY,Ba,ZG,Eh,Ev,Bj,8,V,QU,i,Gs,CX,Bp,j,EA,CP,Bl,By,B4,R,Cl,DC,HI,Ce,Jl,7,IQ,CA,FY,Cx,HW,BF,MQ,Q,t,0,Dy,Bd,BA,k,E3,By,Io,X,BT,CZ,DE,Bn,DP,G,CC,BX,z,BC,Cg,BC,j,Ci,GY,B0,BT,BO,Cb,p,Dc,CM,Jv,CW,CK,BG,CL,0,U,BY,FC,CU,Dq,t,HE,FD,Cd,M,BG,p,C7,BN,H8,r,Cp,j,DM,DT,DI,DM,EA,Bd,u,Bf,Br,BL,DQ,Cp,FQ,E0,Co,U,CJ,Dc,JY,f,EM,Bx,CF,1,CM,t,EH,n,EE,DJ,l,BZ,GR,CR,Ff,Bu,EA,CR,JL,BA,Ca,BT,ET,Cf,NX,B6,OM,Cb,FP,D1,Ef,a,Cf,Bz,JV,B0,Js,DX,FZ,7,BW,x,B9,H,E,BP,CN,m,8,d,F9,Fj,p,En,CC,Cf,q,Ba,DC,D,Ca,Ej,BN,BT,HI,8,P0,FP,BA,Br,Jm,D,By,JN,Dw,Bf,s,BN,BV,1,Ca,e,Ca,Br,BH,B4,BI,4,Ba,BZ,Bc,Da,Bz,Fq,CR,CG,GO,CA,EC,D4,BL,EE,FR,C8,D8,EU,BB,Cm,B3,D,CK,CY,CB,CU,Cc,6,I0,Bd,C8,BI,HY,EP,GM,Z,j,DH,DL,L,C8,X,BQ,CB,Cn,Bv,Fm,E,K,CB,CN,1,DS,B4,BG,Bn,EQ,Ck,BK,BL,Bq,DW,Ba,R,BR,BQ,DA,Bk,3,1,EW,Cp,Bx,d,Di,BP,CL,BH,DE,c,CL,Bf,EM,V,Bv,BX,Dw,Bj,p,BL,DJ,e,G8,DT,5,CV,Cw,y,BC,b,BT,BN,B2,BQ,GA,B9,Jr,DD,O,BP,G4,DG,Ce,P,S,CP,Cy,8,CI,Bz,A,B1,Br,V,CA,BT,JF,Ct,FF,DZ,Ut,J,KP,Gf,EX,0,EA,BL,DB,DH,Lx,GP,BJ,r,Bh,V,DJ,B7,CL,CL,Hl,h,y,Bz,Bt,1,BB,X,5,V,r,P,BZ,P,B7,T,Dv,Bv,B5,g,X,e,DO,FI,BV,Fu,En,CW,f,Bc,BZ,P,BD,Ba,Kl,ES,EN,v,T,A,QX,CY,BD,B8,t,BL,GR,A,BZ,A,Up,A,BX,A,R3,A,BZ,A,LB,A,BZ,A,Ff,A,BZ,A,BZ,A,BX,A,SP,A,J,I,p,C,F,L,D,D,F,A,D,C,H,O,P,CA,Ct,R,Bc,Q,9,Bk,1,BP,CF,u,R,Cu,Ct,BV,Cb,S,Bw,e,B9,F,D,BO,D1,S,DS,Bw,DT,r,T,CQ,Dg,b,Bn,Ba,m,BG,Df,DZ,K,Dm,Dn,CA,EA,1,Cb,4,e,BA,DV,B9,Ch,Bg,CS,Bo,Cl,m,Cy,DW,Bl,BT,G,Co;FsR,EFs,Bg,5,Mt,J,Hw,BU;FuV,ED6,Cs,J,ED,v,CM,L,D,1,Fp,l,D5,m,Z,4;GAv,EBi,Ch,t,Bq,p,Bb,J,2,r,ED,BV,Cd,a,W,BS,Dl,CL,B5,m,I,BJ,BN,Z,C5,BC,Gv,L,MS,Dy;FnV,D7W,JE,BL,B9,B9,WX,CP,EZ,2,Ky,By,VN,I,H6,BU,Gh,J,HA,0,FZ,M,GE,q,DZ,a,Cq,o,TU,DN,EN,C2,Ew,BW;F7b,DwK,Eq,BU,Fy,7,BV,BV,FY,CM,HK,EX,Bi,0,DB,EE,Fq,K,Da,BV,DU,D5,Z,Br,Lm,ED,IJ,d,BA,Bh,DI,6,BK,BB,Dl,BL,MJ,CA,JF,Cd,Lz,n,Bz,CS,JH,s,CP,CC,R8,0,TP,BC,Cj,BG,J6,Bq,L5,2,CA,Ce,Fy,Bq,Hm,y;GOR,D1E,HM,Y,G0,CX,Lh,Cp,D7,Bh,Bb,CR,HL,BV,Jt,C0,Gm,Fw,C5,B2,KU,o;DmL,ETy,as,CN,YJ,DZ,Mm,o,Xf,Eb,E0,L,Cr,BB,Rx,z,Ho,Bf,NF,G,NY,BL,Gb,r,D8,l,JH,BP,Bj,B3,Lh,P,NG,Bd,JD,CN,Fl,Bw,8,z,Xr,E,DQ,B2,Fo,W,EJ,Bu,BE,Y,Ju,Bj,G4,CC,HT,Bl,CP,BY,ES,y,CP,M,a,6,Cn,BX,GV,O,CY,B4,QU,q,Il,E,Cq,K,JL,Ck,R,BU,Ta,CH,BK,M,JR,CG,Tw,Bu,GB,S,F4,Bi,NT,Ch,NX,b,Ev,W,Ku,Bq,OR,Bl,FB,y,N6,BO,PH,1,BL,S,Hq,BU,NL,W,Va,BG,FH,w,Fi,u,Rq,B7,Jx,Bw,L6,4,Dr,0,Mg,BT,Ba,O,FB,BS;E8B,EC6,Hk,b,CT,r,G7,G,7,e;E1v,D4C,H,BL,Dp,H,GJ,BW,CG,BO,Dc,m,Do,5;FMl,D0i,JU,h,Br,7,BK,X,Dv,BZ,GG,1,O,3,BF,X,m,Bl,DJ,p,CZ,s,Y,BV,B3,b,Mr,Eq,Bo,BC,DA,BL,Dq,m,BV,6,CS,C,Fd,8,DO,N,Bh,BC;EZ7,DYg,BW,o,H4,Cp,BM,BZ,r,n,Da,O,B0,7,Cj,BH,G5,CQ,HH,DX,BV,B4,Ed,X,DA,Bu,Z,BY,By,EE,B0,H;FFL,D8q,k,BF,BN,BP,Bi,T,O,z,Bv,A,s,3,BV,K,Q,f,HP,J,z,k,BE,M,B3,U,E8,BI,Lp,V,CI,4,Dw,R,C5,4,BA,g,B3,I,4,g,Ga,Br,k,I,BX,g,B0,G,EX,BE,Gc,D,b,c,BA,Q;FXp,EH2,Cu,Bb,CS,q,GA,BL,DQ,CX,DH,r,Dl,BS,LH,U,Bl,u,FQ,s,HJ,BM;Ewb,ENs,Jw,DH,D0,o,z,3,DC,r,BD,BB,HS,9,IV,B7,BX,BC,M,Bf,CX,M,R,BV,ED,BW,Bw,Bb,GN,E,I5,Cg,JQ,BS,MR,R,CD,a,ES,BC,Et,P,C7,Bg,IG,K,G3,c,Cs,I,BP,BI,Gc,h,FH,8,HU,2,DD,q;E4L,EAG,Da,d,9,BD,GY,w,HU,BR,G3,R,IC,Cf,V0,BO,IC,BP,CV,BX,DK,X,IN,Bd,FH,BY,C7,BR,W1,c,C1,B8,y,Bu,DF,Bw,HD,T,FR,Bk;FAV,EFU,Dw,V,c,R,Bb,Z,BS,f,Gp,3,CL,4,CU,M,C1,Q,Bf,q,s,Y,5,m,Dw,C;E0j,D1O,JG,7,Ft,Dn,Gv,C,CK,BD,B7,Bb,DZ,G,BV,Cu,H,Co,DA,J,Bd,y,BW,k;FEV,Dmo,HA,Cn,ET,BN,Jj,B0,Di,8,T,w,Bo,X,z,i,S,i,Bo,I;DLJ,CYM,w,I,j,V,O,J,Z,T,G,L,BC,K,4,s,3,D,BY,BI,O,X,BK,J,N,d,U,L,Bz,BD,5,N,B9,F,j,e,L,s,S,u,Bu,CC,BO,q,Q,D,Q,v,h,Bn;Deh,CVs,z,A,V,W,I,BC,BN,a,D,EW,BZ,2,B5,f,X,C,X,M,D,O,C,S,n,G,Cf,Cb,BV,DJ,5,n,C,Z,l,h,n,I,P,L,P,A,b,G,T,T,V,n,BV,A,ED,A,BX,A,Dl,D,c,I,NE,Ga,Fe,EU,Ko,C4,DE,j,BC,Bx,DR,Bt,Ep,A,Gc,9,CB,CB,Bk,J,6,Cp,Fw,B5,Ci,s,DA,B3,Kh,CZ,Dv,DV,CN,6,A,CI,Fa,Cy,BA,BD,Ce,BG,E1,D,By,Bk,BD,W,ED,CX,D3,R;C25,CqQ,B1,r,u,9,DT,El,CE,Bm,CM,b,CF,BL,C6,X,Z,BZ,Cu,Bc,C0,r,Bv,Bt,Be,X,BV,7,Dc,2,Cr,CF,o,BN,Ci,Bi,7,CB,BQ,0,a,t,BP,Cr,Bz,R,D,Bo,Bt,BB,4,B6,BH,BW,9,Bf,EN,Bt,DQ,Ci,Od,H,D,BM,DC,Bq,Ct,I,Bc,I,BK,Bm,BM,X,t,BS,BW,U,d,q,C2,EO,DQ,By;EfV,DrE,Fs,E,Y,B6,D5,BK,FQ,K,Eb,CM,Ec,Y,Dz,2,MY,B4,EU,DF,DH,Bb,CA,c,BD,Bv,Di,Bu,EA,B1,X,Bg,Dy,j,C5,BQ,Du,i,HE,BX,Cr,B9,FQ,BE,DB,BF,Bm,H,9,Bf,Do,Bw,BF,BN,IQ,Y,Bc,x,Ep,Bd,GU,s,D7,CB,B0,U,X,BT,Dg,CI,F6,l,FD,B1,HG,w,CK,Br,Gp,z,IS,z,Ih,BT,Ia,BV,n,BR,CO,s,BD,BZ,B4,s,Bu,BT,BW,BM,Do,Bh,Cv,t,BG,T,EQ,F,CJ,BX,FG,u,Co,BT,ED,x,By,BN,CD,F,J,BP,Cl,q,f,C9,Fx,Cq,DE,By,Ed,BD,Dv,CC,C1,d,Bq,Bz,Eh,2,Gq,Ef,EC,R,BK,7,Bp,f,Dw,B3,l,Bh,B7,Bq,Bq,Ct,Bb,7,I9,Di,i,BB,D1,4,Jc,Ez,BH,BH,QP,D2,CF,BI,B8,g,Dn,w,Cf,Cc,Er,y,G,BF,HB,1,EP,BO,Cs,Cq,GE,B9,BJ,Be,HQ,m,Cz,CM,HG,De,FL,Eo,B7,X,BZ,Bk,Fn,BN,DC,Bo,LD,Ee,BH,p,B6,t,5,z,IR,g,CW,BL,Pr,BA,CB,BY,E1,t,FD,Cm,He,L,IP,BU,BH,Bs,Ck,Du,Da,Bk,KM,k,FX,DT,Bc,Cx,D2,Bx;DNX,CiW,EB,a,Er,CK,BK,K,EG,v,DW,BZ,Y,d;DT1,CZ4,a,S,Bw,d,Dk,A,Bp,t,K,p,BD,H,t,U,a,K,j,U,Q,U,7,Z,M,J,BL,K,n,m,BJ,G,H,i,1,S,BU,BM,V,5;EQh,DRE,I,Z,f,l,C7,Bb,CN,L,r,2,Bs,Bg;EIn,DPU,q,Z,O,V,L,h,BJ,BR,f,L,Bd,u,D,u,U,g,y,k;D6J,DiY,CA,l,H,Bp,t,v,Bh,Z,Dv,H,t,g,f,8,CA,Bu;EIl,Dzk,G8,X,EK,CJ,LB,Z,Bb,U,x,BK,B7,W,R,0,w,k;EMb,CuK,BN,G,DD,2,m,c,CS,E,BM,7;EGT,C5I,R,F,A,I,K,M,M,e,Q,M,K,A,C,Z,D,N,T,T;EGp,C5g,x,BP,T,G,a,s,J,O,BD,BH,X,C,f,P,0,4,J,I,BL,1,X,I,Bk,BW,M,q,G,T,X,3,e,U,Y,BC,m,f,Y,H,K,V;EKB,C5U,X,A,G,Q,q,Q,i,G,U,O,X,d;Epx,EBQ,BT,N,Cd,Y,h,M,H,i,O,O,2,E,CK,N,Bc,f,G,V;FbT,EA0,CJ,I,Cv,Bw,Bi,C,8,V,BE,t,BW,R,S,T;FIr,EKA,A,n,h,P,BJ,M,t,W,Bj,D,b,Y,K,Q,BI,M,CS,H;Fdp,DxO,FX,B4,BG,m,Di,O,C8,n,H,3;FTx,D7M,s,P,B1,h,CX,F,2,g,CX,H,t,I,m,W,B9,O,Fa,o;FZj,D9C,8,E,CO,j,Bb,V,C3,A,x,y,BQ,S,s,D;GJt,D5y,Bl,N,B1,U,Cc,6,Dm,m;F5N,ECy,Ch,E,BX,o,CQ,W,K,R,CI,j;GyX,Czu,F,A,D,E,K,a,a,D,G,F,D,F,L,J;Gyr,Crm,F,A,H,E,F,G,F,S,E,K,S,L;GwJ,CyE,d,Z,T,E,Z,Q,L,F,A,R,J,E,H,M,M,O,o,U,K,A,U,L;Gu3,Cvg,R,C,t,i,BN,m,O,S,M,D,Bc,l,m,p;GxP,C0q,BM,0,C,R,f,d,n,N;Gqr,Cuw,I,BX,j,v,T,BA,E,g,f,T,l,e,V,o,e,0,BS,j;Giv,CjM,G,T,b,E,J,E,A,I,E,I,S,D;Gcf,Cjw,C,F,BD,Y,H,I,h,S,G,E,o,L,W,N;Gkh,CkC,J,D,N,C,p,W,D,E,K,E,H,Q,U,G,S,H,I,H,K,N,E,P;Gfz,Clm,F,N,h,2,C,I,K,M,I,C,M,H,M,L,O,Z;Gr7,CtY,H,L,l,e,V,W,F,K,C,G,C,C,M,F,o,b,K,N;Gop,CqC,F,D,V,C,L,I,N,Y,C,E,E,E,S,I,G,D,C,H,O,R;GqH,CtC,R,D,I,Q,H,S,A,c,Q,Q,W,A,P,BD;GtJ,Cu6,F,D,R,I,T,W,D,K,C,C,K,F,W,Z;Gsr,CvW,A,D,X,A,H,C,D,E,D,G,Q,Y,A,G,C,C,M,P;GaN,ChQ,J,F,F,A,F,E,N,k,W,N,F,F,O,N,C,H;DG3,CRu,b,J,Z,C,R,I,k,D,q,M;DKp,CWu,J,D,D,E,P,I,A,E,K,E,Y,D,J,L;DNt,Ccg,c,F,N,J,l,C,S,o,BM,o,e,C,R,R,V,A,V,N,r,h;DWH,Cee,F,R,T,N,N,A,E,I,A,O,U,C;DWB,Ces,X,L,O,U,I,A;Dbx,CS2,L,H,C,G,M,S,I,C;DdX,CUI,d,L,M,a,I,K,K,F,A,R;DzV,CWq,P,F,d,E,l,H,W,Q,g,I,i,c,I,A;Dzv,CXE,Z,H,J,C,c,U,e,E;DrJ,CbM,T,D,G,I,Y,M,S,I,K,A,R,R;C3L,Cnm,H,D,H,A,H,C,A,E,G,I,O,E,M,A,A,F,H,J;Cz9,Cj8,x,T,H,C,J,O,A,E,K,A,G,H,K,D,W,M,M,C,E,D;C2l,CrY,L,A,D,C,E,I,K,I,Q,E,F,P;Cyf,Ckc,W,R,1,P,L,C,C,W,E,C,M,H,M,M;Cy7,CdC,L,H,L,A,C,G,S,U,A,G,U,Q,F,R;DXH,DPy,8,D,K,D,K,L,N,P,l,J,x,I,N,I,G,G,S,A,D,K;DiH,DIU,d,C,A,M,4,4,k,L,S,T,F,N,R,L;Do5,DPw,BJ,E,9,s,v,Q,BQ,H,BQ,X,e,X,E,J;DXJ,DL8,H,F,Bt,q,J,S,8,I,BG,H,Y,P,H,Z;DXx,DNm,O,D,C,H,Q,J,E,J,R,H,x,O,N,M,D,I,G,G,Q,C,M,D;DlH,DEc,N,P,R,C,H,F,F,A,I,W,F,K,G,E,U,C,C,N,C,F,E,D;DVx,DIu,H,P,Z,E,z,S,H,S,m,C;DKv,C4w,C,F,h,C,N,G,C,G,G,G,O,E,Y,J,C,F;DNL,C9o,Q,H,E,V,h,A,l,Q,H,M,G,C,I,F,S,G;DhF,DmU,7,I,F,I,u,M,g,A,Q,L;DQN,DeU,b,H,N,G,w,Y,u,A,R,L;EHD,D66,C,N,BB,J,5,C,N,I,CO,2,g,J,r,Z;EJp,C7I,F,D,L,E,D,K,K,I,I,D,G,F;EJL,C9i,D,D,L,A,D,N,F,D,H,I,G,Q,I,I,G,C,G,L;EIh,C6w,H,F,H,A,G,S,H,G,A,E,C,E,E,A,I,H,E,H,C,L;EJ3,Cv6,A,H,N,C,P,I,A,E,E,E,Q,D;EIF,Crk,d,A,Z,M,BA,S,M,D,N,V;GZ9,Chs,D,D,h,O,X,S,J,M,q,f,U,J;GfL,ClY,F,D,H,W,I,O,A,E,K,L,E,J,C,L,A,D;Dzf,Dgo,Cx,E,p,W,P,W,I,K,BE,E,C8,V,K,p;EDP,DSu,u,P,Y,j,b,P,5,L,BD,a,5,k,BA,O;E47,D6W,t,E,f,g,BK,O,O,H,M,T,W,T;ELB,DGU,H,A,E,K,I,C,K,I,I,D,D,H,N,J;EKR,DGy,X,D,K,M,Q,K,Q,C,M,H,L,J;FCN,DxS,h,D,f,O,A,U,Q,M,e,G,0,Z,A,H,P,R;FEF,D2a,9,N,T,I,BE,Y,a,L;FHB,D0S,CR,N,Bd,S,EY,o,BS,H;Eq9,Dl6,E,N,T,T,N,F,b,Q,H,I,W,K,M,C,O,D,E,E;Er5,DlS,R,D,N,I,J,C,F,G,R,A,A,K,G,E,c,C,S,R;D0t,DQA,z,A,BP,S,a,E,BQ,L,S,F;D3j,Die,R,D,BJ,a,T,M,A,M,W,U,S,C,s,L,k,n,H,F,C,L;EFV,DJ4,d,D,M,K,BM,K,J,J;EGx,Dh8,R,D,X,K,E,W,o,C,Q,J,I,J;D9X,DSe,V,D,5,O,9,c,u,S,BM,X,W,P;EIP,DnI,O,R,n,R,Bn,A,O,Z,Cn,k,BG,K,G,M,8,N;EDt,Dm2,M,P,P,H,BZ,X,BP,F,2,g,4,G,U,O;ECd,DUa,P,J,t,C,J,G,0,K,e,F;EUJ,Dby,m,F,R,L,L,D,T,G,R,O,D,G,E,C;EHh,DkG,f,C,L,M,i,a,BA,O,a,Y,c,E,H,O,I,E,BC,I,U,R,Bx,BL;EAZ,DlC,t,A,V,K,N,Q,I,a,u,I,Ba,P,x,p;EgX,DoK,8,A,S,T,r,J,BB,E,5,Q,q,O;EWH,DaQ,Bm,V,f,P,p,O,r,H,S,S,X,G,BB,F,F,e,BF,i,M,I,6,L,BE,X,S,L,P,T;EfX,Dgg,J,D,t,Q,L,S,M,W,X,S,Q,S,k,Y,a,F,Y,N,G,L,I,z,X,f;EZJ,DZi,X,D,f,Y,j,O,R,q,G,K,q,D,k,f,g,p,A,H;E0J,DNe,J,A,V,K,F,G,Y,E,S,L,D,F;FQj,D9C,BP,E,CU,c,CA,D;FWR,EEG,Z,F,b,C,F,G,g,Q,c,E,Q,A,U,L;FSD,ECo,CP,G,V,W,Cs,K,CE,f;Epd,D8y,BZ,C,BT,u,e,M,Be,G,y,V,Z,X;E97,D5k,BP,F,t,V,l,F,h,U,g,O,BG,I,Y,O,Ba,V;E7d,D2W,Bh,I,P,G,m,M,e,A,g,L,Q,P;GSl,D6W,h,A,E,G,m,O,C,G,F,E,K,G,U,A,C,F,J,V;F4V,D9i,EJ,K,BW,S,Bs,C,BM,N,G,L;FZ3,D4E,Bp,E,1,S,w,o,8,Q,Bm,N,q,l,P,R;FNT,Dj8,l,T,R,O,Z,F,H,K,G,Y,D,K,I,I,K,C,m,J,e,V;FMj,Dkm,H,N,l,I,L,M,M,M,I,E,Q,F,G,F;FNl,Dpa,BH,M,H,S,I,E,U,A,W,F,e,N,J,D;E8H,Dma,a,N,F,T,V,P,v,A,M,K,A,I,H,U,N,E,L,A,A,X,R,V,V,I,C,Y,U,U,Q,E;FQX,Dl2,V,D,C,G,H,E,O,E,C,E,Z,I,H,E,C,E,I,E,q,J,O,J,G,J,L,A;FSj,DjQ,Bf,S,w,S,M,M,k,H,U,L,C,H,D,P,N,D;FbP,Diq,BB,I,Z,I,R,O,c,E,BA,F,g,T,F,J;FmF,Dfa,L,R,L,K,f,M,A,S,G,K,D,M,Q,G,M,J,E,P,F,J,Q,J,E,H;FqL,DhS,Y,D,Q,C,M,J,E,N,r,I,N,G,F,E;Fmr,DeK,4,D,F,R,P,L,J,D,Z,S;Fqp,DhU,J,A,d,M,G,K,a,L,E,J;HOh,Dmc,T,J,h,M,e,K,O,A,c,H,K,H|bm,PW,D6,Gc,Cq,8,CC,B9,CA,CK,F6,MG,C0,CI,I,CA,Bf,Be,V,Bg,k,A,B8,B3,4,F9,Bq,CF,Ej,H,x,BR,Dm,DV,BU,DH,L,R,V,h,DF,ER,m,j,W,EH,BS,Cf,DA,C9,Q,Bx,I,T,A,D,Z,B3,BD,u,Ct,U,BD,m,DZ,J,x,A,F,M,C7,Q,DR,A,D,P,D,N,v,A,Dn,A,l,a,E,w,b,E4,CP,G,BZ,CI|FWa,ka,F,D,F,A,F,C,E,S,G,C;FXS,ik,J,J,N,Q,A,E;Fk0,vc,E,N,r,Br,4,CP,V,Df,Dj,BV,D,1,Bx,L,BA,Cv,BT,o,CT,R,p,BP,BX,Z,j,a,CX,M,m,6,n,0,BP,x,t,Cq,A,H,n,BO,E,BG,1,w,l,Cy,u,K,BK,Bw,6,m,FG,U,6,p,U,W,C,C,C,H,g,r,k,K,BM,x,i,A,K,a,d,6,y,c,Y,H,e,a,BC,3,CG,BI|FM8,BDi,Z,M,GZ,CD,3,Dv,BP,P,E4,HB,CP,Eb,DC,EF,Bg,GX,C7,FD,J,D,s,E8,Dd,KI,R,Fg,C1,Cq,R,CP,B3,M,a,BF,DB,CV,J,BO,CP,p,I,B8,Bj,Bl,BM,FA,Bx,Fi,X,BR,Bb,Bg,Bo,O,FP,EI,N,O,d,Bm,e,e,w,l,M,K,L,CC,D,I,M,G,Bq,s,k,F4,Ck,l,B2,Dw,T,BK,Bo,CC,A,By,Da,CI,C6,d,t,Bg,BY,B0,C,M,I,G,8,y,CE,DF,BI,E,S,Ch,R,DB,Df,Dh,F,Cx,EI,q,E,DB,CG,v,BH,Cn,Ca,Z,6,B1,DC,Y,D,D,N,V,BP,t,l,BF,U,N,7,N,R,P,Z,BL;FGy,jU,Q,j,F,J,F,A,H,U,N,M,R,D,S,S;FGs,gC,L,L,D,A,E,S,Q,Q,O,A,D,J,L,N;FG0,lC,A,F,H,C,C,U,U,q,C,N,H,b,F,P;FHy,ma,L,D,F,g,E,E,M,P,Q,L,H,H;FH4,l2,F,p,P,G,H,A,L,s,c,C;FHc,oo,G,H,G,A,D,V,R,Z,P,D,E,i,H,U,C,O,S,H;FGk,nM,D,D,L,E,J,O,G,M,G,A,E,D,C,F,D,P;E4w,zc,P,V,F,c,q,s,E,P,L,Z;FEw,0a,J,D,N,O,D,e,O,K,I,F,E,N;E2O,8Q,F,A,V,Q,R,W,a,E,Y,F,C,N,H,T;E1k,BCK,E,d,P,M,H,c;E2S,BBG,Y,R,I,A,Q,L,L,V,R,H,N,G,H,S,P,I,F,I;FH2,jW,J,A,F,E,K,W;FGY,ls,A,L,N,M,D,g,O,b;FGW,n8,D,J,N,P,L,I,D,G,K,I,M,A,C,C;FHK,qQ,D,j,L,Q,D,k,E,C;E5y,zC,F,H,L,G,U,W,C,J;E0C,BCQ,C,T,J,I,P,a,A,S,K,J|Bki,Hv,F,H,V,Bb,BI,X,C,7,BL,BD,5,Bn,BZ,BN,BD,C,F,e,h,BQ,A,Cw,r,6,A,I,E,M,G,M,c,F,m,n,BA,E,i,O,M,BO,m,R,6,W,Y,T|C4,jc,1,D,f,H,D,I,BD,Q,v,K,v,K,BF,x,HH,O,R,BV,Y,h,Q,C5,C,L,F,F,V,H,BT,Bg,B1,E,Bv,3,9,M,BH,s,b,BA,BL,Y,N,O,C,K,s,EW,Cw,Bo,4,DI,CM,X,C0,DU,Bs,J,S,2,D4,B4,Ce,P,q,P,F,J,J,BN,2,Bt,m,3,B2,BH,r,A,A,BD,B0,BT,Bu,M,a,v,h,h,2,BL,K,L,H,N,P,f,BB,3,Bx,G,Bp,Bf|BcW,CLY,Bj,L,x,g,5,F,BZ,X,1,r,A,F,Z,E,b,P,O,5,t,R,CL,P,Cd,BC,Et,v,X,C,C,E,E,y,M,W,F,I,L,E,d,y,t,O,R,O,h,c,Q,E,W,e,T,e,G,q,w,I,2,BA,BZ,0,h,0,G,8,k,O,O,c,I,E,O,J,y,Z,X,z,IU,h,FI,Bm,E0,BZ,H,x,BZ,V,CH,DB,Bm,BX|F9a,Py,S,f,I,Z,C,j,K,R,D,D,P,F,d,I,R,8,A,q;F9E,Py,T,J,n,d,I,1,K,P,N,t,j,f,n,w,V,A,V,s,h,W,Y,A,BK,a,Be,8,K,A,A,N|Ddv,D6,0,v,BC,x,CI,s,i,5,Gs,E6,CJ,4,j,Dg,B1,CO,GO,CP,e,BY,Fg,Bq,BS,BU,X,w,H,C,S,E,Bo,E,e,h,h,Bx,Bc,f,e,Bd,9,BH,d,C5,u,Cj,Bs,Br,BU,l,BA,Q,i,BA,BA,P,CS,Ba,Ci,H,K,C,G,D,BY,T,S,K,C,e,t,s,g,0,y,X,BG,G,BU,g,BC,3,I,A,G,F,Be,n,BG,u,C2,d,EC,F8,S,i,FW,J5,Gt,IL,CN,l,Fs,B8,Bk,Df,Dg,6,BF,DB,E4,GM,CU,W,I2,Dn,P,Er,Bk,CW,I,BH,Cm,BY,LC,Bj,JA,Gn,Fu,BH,By,Ix,KT,O5,Cr,p,9,P1,F9,N3,DX,DF,IZ,X,Lf,Hn,Bt,K,BE,v,BT,Jn,Kd,LZ,Es,FY,CV,BU,E,CV,FT,Ij,Bd,BH,h,B0,BS,BY,CD,CM,F7,D4,BT,v,J,8,Cj,CK,CV,f,N,O,K,K,FY,Fs,o,D,J,k,GG,De,i,C2,t,By,CH,S,R,A,C,e,BM,Ec,BR,w,Cj,d,BZ,FS,B7,u,Bl,n,DT,g,a,Dk,BB,Cc,F,Q,O,C,B4,GQ,C5,DK,K,DE,F5,C,BF,IA,Od,F0,BV,HU,KZ,Eh,Ct,g,Z,A,T,A,DJ,N,U,FE,CR,Bt,C5,J,x,Bm,Cr,U,w,BW,DV,Em,w,CG,CA,Ba,y,EW,Gu,DE,Cq,b,A,M,E,I,Bw,Js,CL,DY,E,CU,C4,Q,h,BQ,Bv,C,A,CG,FY,C,D,2,BA,v,Bi,BK,BE,DD;CkH,v,Bo,O,CW,d,Bb,Dh,r,Z,b,U,N,n,5,S,R,p,t,R,1,S,Bb,T,z,Bw,k,c,t,m,e,CE,BS,e;CSX,BMp,G,H,N,A,h,J,J,I,S,K,G,K;Cgt,BXL,F,D,P,Y,a,Y,I,L,H,T;CWB,BPF,A,L,J,G,X,F,J,G,e,i,G,F,I,R,F,F;CTj,Jf,V,V,G,Y,D,O,C,O,S,M;CA9,qR,J,F,D,M,W,S,C,S,M,J,C,P;CBf,rd,J,N,J,C,D,I,H,G,C,G,G,E,O,A;CUx,ER,T,P,L,E,C,G,C,D,E,Q,S,D;Ckd,2,I,L,d,r,h,J,X,M,v,C,D,S,Q,U,c,A,y,O;CmR,GQ,V,L,N,E,L,Y,E,U,O,G,Q,F,K,h;CnZ,b,5,p,X,U,I,Y,g,M,O,C,U,F;Cjf,X,3,H,Z,K,Y,W,q,M,U,F,G,N,D,N;Cmr,c,D,f,l,M,C,e,g,a,G,u,K,G,E,D,E,BD;Clx,BQ,X,H,F,G,A,a,G,O,c,C,C,G,I,C,E,L,A,P;CrN,En,X,F,c,y,Y,W,A,u,a,q,a,Q,i,G,S,b,Z,BJ,BL,BD;Cgb,Bbl,N,J,C,w,G,O,U,U,G,L,H,Z,T,d|BTe,5Z,F,L,DA,Ff,DQ,Bz,U,BP,BS,F,D,Bz,8,Bd,DS,3,BE,BP,I,H,v,F,GZ,EP,Fh,HF,Hz,BQ,ET,E5,DP,E,U,C4,Cd,Dk,L,G,A,G,A,I2,DO,I,D,Lu,HQ,BC,BO,Bf,FO,CK|BAa,CUw,p,BJ,H,j,Be,BD,H,L,9,F,y,BF,L,R,p,E,N,L,H,C,r,D,S,j,D,P,l,M,l,Z,L,p,h,H,C,t,Q,d,V,R,D,A,T,G,v,U,BD,q,b,A,R,I,BH,Bs,DF,CG,p,BS,BL,y,K,BU,Bm,j,w,q,BQ,M,C2,p,Cu,A,4,r,O,A,G,A|DmP,4f,A,C,d,y,Cm,C6,B3,CY,y,BK,n,Ba,Bk,CC,p,Bk,BO,Dy,Cd,ES,b,s,Y,A,Cs,h,KY,Eg,BU,HV,Oc,F1,BE,IB,F4,D,L,DF,C4,DL,B5,GR,P,D,E,g,DF,CS,In,BL,Br,C7,BJ,FP,F,L,F,C,h,s,Dh,H,BV,Cl,5,B6,Dv,a,Bd,8,DD,DJ,H,L,j,J,Br,I,BD,E4,Bz,C0,8,DM,Bp,Be,Z,C8,BV,BY|Evk,Bbi,A,F,G,z,BE,J,S,h,H,BX,EP,V,BR,Y,CZ,j,Cb,w,Z,s,c,Y,C,E,M,c,B4,CG,Ba,o,BM,P,A,h,CW,X,m,W,BG,b,E,f|FO,UE,g,O,z,CQ,O,Go,3,DE,B1,BQ,W,Bm,G,U,E,A,Bo,Be,Bw,H,BA,2,O,e,G,M,E,U,J,s,Bo,e,BW,Bb,u,d,O,T,L,P,4,DT,Cj,E7,3,H,N,Ip,BX,J,Bh,P|Enn,5c,A,S,G,O,Q,G,e,T,I,E,2,BK,O,g,s,E,L,X,s,D,I,Z,l,CB,J,DL,B7,CL,E,P,BJ,A,O,Fa;Ejt,5y,L,D,I,K,M,m,I,A,C,D;EjZ,4M,R,d,G,e,O,O,A,K,I,H,D,J|No,Cpw,c,H,O,U,M,C,a,L,a,O,S,T,k,O,k,n,2,C,BI,h,n,7,y,T,U,A,E,F,u,b,P,L,G,L,S,D,K,J,E,b,l,T,N,T,A,F,D,A,F,G,X,E,x,z,D,X,e,j,N,T,H,D,R,A,Ct,y,D,BI,BB,l,BT,C,E,4,Bn,O,Bz,Be,BJ,H,x,BI,Ba,i,2,Q,Y,G,Q,b,e,I,BC,R,2,U|Boc,CsE,n,C,Cn,r,t,CD,RB,CK,FX,BV,A,D,P,U,W,BW,Bh,2,u,q,Bk,k,D,BE,7,B0,Z,BG,Q,F,D4,K,U,k,B4,c,K,b,w,A,p,i,BA,B4,C8,BI,BD,O,a,4,A,K,G,C,BY,e,Bs,H,BC,4,s,O,G,D,a,R,Di,Z,U,1,Ca,i,CM,5,V,7,i,v,l,3,DU,Cb,R,t,CQ,Z,0,3,B1,BF,CV,W,h,l,4,t,s,CL|DF5,qM,H,F,T,I,H,K,D,e,M,E,U,Z,M,L|EnQ,BJQ,Z,Di,BL,Bi,e,B6,CR,BK,Ba,By,Bk,O,Cz,CC,BG,CM,BU,BD,m,g,Bc,BZ,o,u,g,C9,HK,Z,BW,v,x,N,BJ,CN,Bp,X,r,BZ,g,Bz,Y,U,k,t,BA,CS,BC,D,BA,FR,C,P,C,J,K,CD,N,L,x,k,f,f,c,Bn,D,A,Bd,FC,BP,Bs,Bt,5,BJ,DM,BF,b,BC,n,G,C7,BR,Bt,F,BE,1,d,I,Bc,BX,CR,T,Bo,b,Bz,3,6;EuC,BJi,X,P,I,BU,Q,f,E,T;EvW,BKM,L,H,J,G,N,U,G,Y,E,E,S,n;Es0,BJQ,l,J,R,E,g,0,H,q,T,Q,N,s,U,E,O,L,O,j,a,h,J,BD;EwW,BIa,H,R,F,M,G,Y,C,A,E,L;Ewm,BHY,N,D,H,G,C,I,D,c,O,C,E,J,C,P;EsY,BME,E,J,N,G,J,G,F,G,I,G|CnQ,BVe,J,P,H,E,P,c,E,S,J,a,E,I,Y,C,H,J,K,R|ECh,BQO,V,T,Q,J,M,U,M,R,I,3,L,b,p,C,D,W,H,E,J,g,f,k,K,G,O,D,k,K;EBJ,BVi,j,Y,e,c,I,BE,H,O,3,6,BZ,K,Q,I,BE,J,2,1,m,X,G,p,b,T;Dxl,BGW,b,r,x,J,1,A,H,O,C,S,g,S,U,C,k,L,U,K,Q,W,K,D;ECx,BRs,D,z,7,j,V,Y,D,Q,X,D,l,e,U,C,E,L,Q,M,N,U,Y,i,E,U,L,i,K,C,a,N,m,BJ;EFN,BYO,k,H,BM,I,E,L,Cp,n,z,m,m,X,i,Q,G,c;EBh,BSq,X,F,R,E,F,E,G,G,Q,E,Y,A,K,F,C,F;D05,BLS,G,D,P,J,d,K,H,D,H,K,D,Q,S,H,I,L;D2H,BPo,R,X,J,C,E,c,Q,E;D1Z,BJo,P,H,E,M,a,Q,s,q,A,I,P,O,A,I,G,I,U,C,H,L,I,d,b,l,Z,L;D9R,BUO,i,Z,c,J,q,n,J,Bl,f,i,W,A,K,8,r,m,b,G,Z,S,h,A,O,a;D6F,BNo,L,D,z,e,R,C,G,O,M,F,o,h;D3b,BL0,b,k,z,U,Q,G,C,O,l,BC,D,Q,U,Z,g,BT,q,f;D47,BQE,C,L,p,D,S,Q,A,K,R,M,j,0,R,M,C,I,Q,D,a,z;Dxn,BKW,q,J,Q,N,H,J,X,O,3,E,G,Q;DxP,BHY,b,L,D,M,O,I|CUk,CD4,J,G,D,E,U,E,g,K,Y,X,A,R,U,E,q,X,BC,M,D,j,q,d,H,N,a,v,G,P,n,G,Bb,U,BH,w,9,BO;Cho,CAA,5,H,B1,BU,G,Y,u,K,l,y,s,g,BD,4,Br,l,DB,B7,N,C,A,S,T,m,k,G,r,k,W,g,5,G,CB,BQ,BA,I,O,q,Bp,8,P,c,q,k,Br,u,Y,O,j,U,F,I,s,a,o,C,8,T,O,Z,BO,F,BK,X,c,o,Bl,BM,E,Q,q,Y,E,G,W,F,B6,BJ,k,x,Bg,R,2,0,BE,c,k,w,S,L,Ck,DN,C6,Br,Cp,T,n,Ct,Bp,Bt;CW6,CHC,C,G,H,C,H,A,F,D,A,J,G,D;CVO,CIW,F,D,H,C,D,E,A,G,G,C,G,D,C,H|eu,Cce,Q,Y,E,Q,R,I,H,C,G,C,BW,F,q,v,0,2,B6,h,Dw,BE,Ck,x,z,CC,CW,Bg,u,J,Q,q,C,E,G,D,q,h,CE,A,BO,BS,DM,z,Bi,K,BQ,l,E,F,A,D,T,f,C,L,s,BJ,M,H,N,L,N,Z,I,b,5,H,x,O,b,R,s,N,I,P,X,Z,b,F,E,b,J,L,O,V,H,V,r,L,h,X,L,F,R,h,Dd,P,BH,r,Cn,W,J,C,r,I,Dj,c,1,4,O,U,DH,V,BB,r,Bd,S,H,A,A,I,V,Q,t,b,z,S,H,O,v,K,J,A,E,E,C,G,J,K,H,O,A,E|Hb2,mj,B2,Hv,CS,Y,Co,CT,Dg,ND,Hq,EP,DC,G7,DI,E,i,DX,He,IF,Be,Iv,CN,I5,FV,G7,EZ,Mv,Gn,BT,FX,Cl,k,BX,C9,C6,Cd,V,i,Ba,EX,C9,G1,Be,FT,Dk,L,C0,Cd,Ci,BA,o,Dj,v,BE,B4,BX,Cu,BT,DJ,Cn,V,DY,FW,f,DO,Bv,DZ,FJ,EP,El,Hs,J9,DY,Q1,Cl,Fb,CV,CX,C5,Lz,L,HV,Dp,IT,Cs,F,CY,CO,BE,E,E0,IJ,Rw,CI,BD,BR,C4,Ce,CP,Cn,Gk,B8,Ho,Y,B7,IS,F4,N0,DY,EW,Ey,F,DY,CE,CA,B4,Df,K,EM,Du,l,BN,U,I,Cm,CA,K,t,4,Bq,I,2,Cw,0,BL,g,CE,Ei,L,CY,CV,b,B3,Bo,By,DY,BN,s,BA,Bh,Ba,EA,GU,Gu,BA,Cb,DC,J4,DR,Cw,BM,n,BR,Bk,v,BI,Bi,BU,BR,Bl,C1,Bt,P,Bj,FP,MQ,Hx,EE,7,C4,FA,4,MA,Ce,FS;H7y,BVF,H,H,J,K,H,k,Q,y,F,W,m,k,C,S,V,W,Y,Q,S,BF,r,Bd;HQC,1d,R,T,J,C,J,L,n,J,A,W,a,g,BA,O,U,X,d,F;HHA,sh,K,L,I,C,K,S,M,R,V,R,N,r,c,R,M,E,F,P,J,J,Bt,M,F,E,S,Q,D,2,w,k,I,A;Gw0,lr,Q,F,O,Z,X,F,l,O,x,N,J,I,G,W,O,F,M,I,D,Y,J,M,c,c,K,A;GxW,kt,6,O,Q,H,4,e,2,z,R,f,R,C,T,b,BH,t,Bb,BA,T,i,J,0,K,C;F3G,BWD,F,J,p,BA,L,q,I,I,G,C;HJ2,B1T,BE,C,m,Z,X,N,BH,C,R,b,d,J,x,S,N,N,BR,C,t,c,U,c,CO,g,y,H,M,J;HjU,B9t,f,P,N,G,E,O,a,C;Hiu,CAL,K,P,T,I,d,D,S,O,O,D;Huw,BDd,F,D,H,A,L,E,I,a,E,P,K,N;Huc,BDB,H,A,F,C,I,O,I,G,D,T;H1k,BNx,G,H,G,C,G,F,D,N,O,b,N,N,N,I,f,q,G,O;Hzi,BKB,H,A,H,C,E,I,C,M,G,F,G,R;Hxo,BJl,J,H,F,O,C,Q,G,E,E,V;H9S,Bah,T,3,F,A,H,I,A,g,I,U,Q,D;H88,BaJ,F,D,J,S,D,U,C,S,K,E,I,D,J,h;HY6,ih,R,N,L,G,D,S,O,K;HZK,g3,N,N,N,C,F,I,E,K,Q,C;HYm,gv,H,H,J,M,K,O,I,J;Hl2,6z,E,V,I,P,D,L,H,H,N,G,L,S,P,O,F,I,S,D,M,G;HGo,kt,P,N,D,K,I,G,S,e,M,K,E,c,K,C,J,l;HFy,lb,h,R,S,U,q,W,D,J;HIO,y5,J,J,L,I,D,K,L,E,E,I,G,E,E,M,K,P,C,R;HHe,yZ,D,D,A,S,G,I,C,T;HGm,yb,R,A,D,K,E,I,O,C,E,D;HP2,3N,J,F,D,I,K,I,G,M,O,L,C,L;HFe,sl,H,F,T,E,A,I,C,G,G,C,M,Q,I,L,E,R;G3s,kd,F,F,R,g,G,I,J,Q,M,C,I,M,E,d,G,N;Gf2,vD,P,N,J,K,G,U,I,G,I,D,D,R;Gd6,xr,J,H,J,C,A,I,J,I,E,K,E,E,G,A,C,J,K,L;GAa,BFF,N,R,P,E,D,I,I,M,Q,Q,G,L;Hh2,CHl,EI,BN,GI,BA,Y,Eb,b,y,n,7,J,C5,n,N,d,o,e,S,v,Q,Z,l,f,w,L,BZ,z,M,b,Bd,Cr,M,L,i,s,M,BH,G,BP,BK,7,CQ,2,1,K,c,7,e,Bd,Cg,N,Ca;HeS,CFb,H,A,D,c,L,Q,G,Q,D,Q,Q,Q,C,Q,K,A,S,N,G,f,D,R,G,R,H,P,P,N;Hra,CER,k,l,Y,L,D,R,J,H,O,J,D,H,V,N,V,H,J,E,l,u,E,I,H,M,P,A,J,I,g,c;HpW,CQB,L,V,R,E,R,F,L,O,A,E,M,F,M,M,C,I,K,K,G,A;Hru,CNx,L,D,F,C,A,K,D,E,K,K,O,H,G,H,P,H;Hpk,CPf,N,A,F,C,D,K,J,E,E,C,C,I,E,G,K,J;HhC,CGr,H,R,J,U,I,E,G,I,C,D;Hse,CGD,c,Z,P,N,L,D,H,O,X,H,X,C,T,O,K,E,c,A;HsM,CGt,L,P,N,K,D,E,O,E;IQg,C0f,H,J,D,K,M,m,M,I,D,V|FfE,h1,H,P,N,I,N,C,E,K,O,C,I,E;FCY,nT,C,D,E,C,A,D,F,D,F,E,A,K,A,D,C,F;FCo,nV,D,D,D,A,D,C,C,A,E,E,A,C,C,D,D,D|Dzw,Cvb,Z,J,Z,A,N,G,P,Y,T,K,M,C,4,N,y,R|Itu,Bfn,E,D,E,A,C,D,A,F,D,F,D,A,D,D,A,D,D,E,D,C,D,A,A,D,D,A,A,C,D,C,A,C,C,A,A,E,D,A,C,E|Gaq,oH,C,D,H,C,A,C|CUa,CEE,J,K,Bb,6,BJ,F,3,W,I,I,d,BA,e,w,T,q,j,a,F,K,K,C,EW,S,H,K,i,E,E,C,E,J,i,V,Z,P,Bq,v,r,l,O,d,Bo,9,P,r,BB,J,CA,BR,4,H,X,h,q,l,l,H,S,n,A,T,j,A,f,J,N,C,H,O,b,u,G,M,r,c,C,i,BD,N,r,W,V,F,A,Q,Z,W,h,L;CVO,CIW,C,E,D,G,H,C,H,D,A,H,C,F,G,D;CW6,CHC,J,F,H,C,A,I,E,C,G,A,G,D|C91,BjZ,J,J,t,BL,M,3,x,CD,C,5,f,f,O,BT,R,f,F,T,BB,Fn,EY,Db,j,CL,CK,Cp,E3,FJ,NZ,BL,P,Gv,Iz,C,c,D7,B0,BF,CA,BC,k,B5,EX,G,CG,9,DB,B7,BR,Ep,EN,z,CJ,Cj,Co,DH,DA,f,BP,CL,BW,X,FX,DR,Bb,DV,Dd,F,By,h,DD,Cz,8,Br,BV,H,De,CX,L,L,LP,BM,Bl,Bc,O,Cw,Cn,N,BZ,Du,DI,Ci,C6,G4,L,Dc,BS,BI,CT,Be,C4,q,CJ,k,BD,Fy,BQ,Bs,G,Hw,Cy,Di,BH,Fe,Ci,Cg,h,Cm,CS,DU,CL,J4,CM,DK,k,Fq,EU,Eo,n,Hi,Ds,B6,BI,DU,l,k,G,K,DC,DI,Bc,9,Du,b,4,B7,BU,Ck,Dg,G,g,t,E,D,E,H,FK,E1,K6,FF,DH,GZ,JU,V,De,Eg,C,BY,Q,A,CG,T,s,Bz,j,C3,GH,Df,I,l,p,C,FZ,Ft;Djd,C07,E,HG,M,J,BE,BR,n,E,N,p,BI,N,Cu,CX,DY,Bj,Da,f,j,p,Dv,f,Gz,o;DWP,C0h,CW,D,D,J,d,J,BJ,C,BD,V,Z,O;DNn,CCX,C,N,L,A,Z,M,L,Q,Y,F,M,H|DNH,28,H,J,X,C,H,S,O,O,Q,H,K,J,A,L;DNN,4q,D,F,R,K,H,U,E,C,O,F,G,H|qK,O7,D,F,v,T,BP,BF,O,R,F,Bx,7,N,D,G,F,BU,d,4,F,I,k,s,W,C,O,e,BW,m,Q,F,i,j;BPU,jF,E,b,H,Gb,GZ,D,M,Kh,Dq,D5,o,j,BB,N,Hf,BD,Hl,CA,OJ,D,Ct,Ba,Ep,5,I,BO,Ce,LE,EA,FQ,Cj,I4,BO,CM,Dj,HQ,CW,q,M,K,K0,J,Ds,HH,Fq,a,Bu,DK,GI,BD,Bc,MT,Fe,u|Fg,CNG,H,A,n,P,J,C,F,E,A,I,F,K,E,K,G,E,I,E,O,A,c,J,G,F,A,F,H,H|bq,B5K,BN,BX,I,Fx,Cb,C5,Cq,EL,CO,BZ,Ba,FT,M,x,V,L,Bm,Ht,N,EB,BV,Bj,Cm,Ex,EC,5,BK,CB,U,j,Br,BB,Mz,Hj,FT,Ef,Ef,9,t,J,BD,N,Cj,E,C,Ca,Ed,Bi,B7,Ce,ST,L6,9,o,v,c,LJ,Gk,l,W,A,o,A,i,A,w,E,Co,DI,CC,HO,B8,Fu,DO,h,CQ,Dk,Ba,Ey,C,g,BK,B9,Cu,X,Eg,BZ,BO,o,D,Kk,Em,WK,BQ|BAY,CLE,E,o,R,U,BM,Be,Q,A,E,b,I,F,0,O,C,A,I,H,c,l,W,H,c,T,S,r,A,T,D,L,F,D,H,7,P,L,I,z,s,BH,y,N,A,F,A,P,O,h,R,b,d,J,f,BF,BJ,d,O,l,P,A,V,f,r,M,A,S,CN,B8,c,A,Z,y,w,DK,X,s|Dck,B6e,BA,E,w,J,y,Z,o,M,u,P,C,H,C,H,E6,F,m,BY,CQ,G,CO,C0,CQ,Bx,f,Ch,8,Bd,FU,Cg,E0,t,C,D,L,A,P,E,J,I,BL,b,g,b,C,D,X,J,F1,f,Ef,CT,BQ,DD,B1,Dp,Dv,J,BM,CV,Cd,3,t,Df,H5,CN,CH,El,Gt,Bd,JT,BK,BP,W,0,2,CS,DC,f,BA,Ct,Y,1,FS,BK,BM,BV,a,F,Bc,BS,u,h,o,Bw,DU,F,O,Q,C,EG,BT,Bc,s,O,BS,Ec,Bk,BA,Ci,CW,Y,s,BC,CQ,v|EAi,BzQ,L,S,n,BM,J,S,W,L,B0,b,2,A,Q,E,V,N,Bt,3|CXf,DJP,Bk,Z,M,T,v,Q,BB,A,P,M,h,H,F,K,G,I;EsF,Dj7,T,A,F,E,A,E,E,G,A,E,M,A,C,D,C,A,G,H,A,D,C,D,F,F,A,D;C77,DSb,m,1,HD,Bz,s,BF,Dx,S,HF,C5,BQ,x,Bx,3,8,3,Eo,a,Bf,BL,FV,U,K,Bh,DH,Bg,Bl,BV,BE,t,DD,M,b,Bn,CN,P,d,Cb,Cm,A,CB,r,6,5,HM,k,Ct,n,F0,Ez,BX,x,C0,b,Bf,BV,DO,BH,DP,BX,C8,h,D7,p,E8,L,B1,Bt,EI,BH,X,BH,GH,a,D6,Bz,DZ,B3,Dq,F,Lj,DL,C8,h,XN,EH,Vv,E,E8,CR,JW,n,D1,Br,VL,BK,DL,V,NU,CT,JL,1,LR,Cs,Bw,BX,Bt,N,JQ,DX,PE,W,BH,Bp,KB,V,Ke,T,ES,Cf,OK,u,a4,DF,MN,BN,D4,BX,OK,i,HJ,BF,E4,Bf,r,BV,GK,N,R0,EE,SK,BA,Ks,Bx,UO,FC,xC,C8,U5,BM,3,BY,In,P,Kl,B8,HE,D0,Qm,Da,iS,DC,Bd,m,EO,Cw,JQ,Ba,FV,E,4,g,Bn,BE,P6,DS,Bu,B4,Ef,BY,E4,h,Ck,BW,x,m,FO,CX,DC,Y,J,CS,F0,a,BI,f,Bt,Bh,QS,M,Bs,Bb,H4,CS,XU,Co,IQ,B5,Ea,CU,QS,Bl,C2,BE,BS,CT,FW,Q,CC,B2,EI,Bx,DW,BS,IA,B9,Tu,DS,BM,BO,BJ,Ca,Cq,o,CU,H,BP,BT,FA,B3,LY,Bl,ES,Ea,T6,Dy,g,BI,F0,CV,Cu,Cc,Cb,m,Gs,f,t,Ca,Kw,B2,LW,Cb,DX,F,BE,v,CN,BH,BI,N,Ew,y,FO,Bh,hQ,5,BW,CR,BJ,Cf,CV,d,i,Bn,F1,BT,GY,h,I3,It,Co,j,MI,FC,HO,GG,He,A,K8,FY,Rk,Dc,Yc,B6,Xi,d,Ko,Cg,V4,DX,Eq,Cq,HE,4,IM,DJ,FN,CL,Uc,Be,EB,BR,Vu,DQ,IQ,Cd,G6,C6,JO,a,DG,BT,DE,BI,bC,Cb,C2,1,CF,CV,Gc,w,Dk,Cb,Ma,C,BI,Bf,Fw,J,Cq,Bu,FM,CR,Nu,Bn,Hw,E5,j,B6,CG,c,ZE,Dn,BW,Bd,Cr,z,k,Bd,Fv,m,Eg,BJ,5,BD,KB,W,EE,Bd,Hn,Bl,Bv,Bi,H,CD,CC,Bt,Gf,k,DN,Cx,E1,T,GK,Br,BN,Dl,Gk,DN,Bp,3,Eo,k,FQ,CH,OP,r,Dp,BE,Ba,Bf,Df,F,DP,CZ,CO,t,Gb,BV,Gq,H,m,5,B1,N,Be,Z,z,BZ,KW,Cv,Hv,9,LM,c,Mc,CV,DF,p,Bc,T,mW,DN,A,SP,StT,A,A,SO,BN6,Ct,DN,4,Cq,O,bf,BY,Ec,U,D1,Bm,d9,DS,vu,Cb,Uu,Dg,Fh,Bo,Bk,BC,JD,8,Bm,g,bc,BC,IR,Bk,Hu,B0,Zl,DW,BL,U,HC,BO,M5,BA,6,Cw,as,CT,FC,BG,CB,BG,Iu,BN,Bw,6,EF,CO,JR,c,Nk,J,DD,BA,JE,Bu,Is,n,BJ,o,S4,Cw,BC8,o,B6,B4,EK,Bx,Ch,Bt,Hw,m,O,B8,EQ,n,DZ,Cv,pS,G,N3,Ei,Mw,i,M7,BC,p,B0,nU,B7,G4,CE,B4,X,v,Bb,Ic,I,Lq,CL,Cy,Y,a,Bk,Cs,h,V,Bg,FU,B1,GQ,K,p,BP,ai,CW,Ga,DS,GF,Ik,Fm,2,BX,8,CS,EM,Cx,G,K,BW,DM,l,A,B6,Ga,CW,Ca,DA;CV3,EGP,FI,J,CE,DF,Bv,BR,UJ,B5,Ox,E,DG,CG,J0,CC,BR,o,BI,Bm,EM,CW,JG,y,IA,Bv;DGr,ELL,V,BR,Cb,t,T9,CI,Qk,L,Ba,Q,Bl,w,Di,4,EE,Bf;Dn9,DlN,Fm,Fj,O,C7,DJ,CT,Mb,Q,JM,s,Er,F,x,a,De,q,E5,4,Ep,t,w,j,Bf,f,Ed,BG,D0,Bc,GY,I,Cv,q,BI,M,JK,N,D,y,EP,s,FE,0,Gt,BE,J,CG,BT,BA,Fi,BC;FGb,Dt9,R,r,B4,w,u,BB,DI,BI,0,N,Cx,BD,Eq,H,Br,BF,Gz,E,NZ,Bi;GQ5,Dz7,6,v,Cb,l,E,h,EL,P,CH,U,k,Q,Z,Y,0,a,CX,a,BG,i;Gjh,Dyb,Dc,BP,B7,X,Fk,L,A,d,BE,X,J,f,ED,K,FP,Bs,Bn,P,t,2,g,e;IRF,EJd,JH,W,Hx,Bc,DS,Bs,Cy,J,Iu,CF;Iq8,EBb,HU,p,Cr,h,Dp,G,CJ,p,Bp,BE,BU,c,t,a,U,M,Bi,A;BmZ,EJb,4,G,M,Y,Dw,1,Cn,V,Eh,g,l,Y,BC,U;Bvd,EH3,In,I,Dc,m;Do3,EJD,Er,w,EA,By,MS,Bm;DAn,DUn,BM,S,J,L,2,T,G,Z,n,R,Y,P,BR,C,F,O,Z,D,T,X,J,E,G,M,7,J,T,M,4,O,Z,G,D,W,7,D,i,m,Ba,Y,K,X;C3J,DRx,BM,H,Q,Z,Cb,E,Bx,d,b,W,Y,U,BI,O;DBD,DNt,w,D,U,V,Bp,J,E,T,BH,C,Z,X,v,Q,l,J,BC,o;DRz,DV9,V,V,BI,K,S,L,Bb,f,5,D,l,V,Bt,a,U,Y,Bm,g,D,Q,m,Q,0,N,J,N;DPF,DVz,P,J,X,C,P,N,p,G,4,u,E,I,b,S,E,I,c,O,Y,A,M,H,A,L,q,L,b,v;DhV,Dfp,n,T,f,G,l,l,t,J,j,C,x,s,M,Y,CY,B6,CC,i,G,R,z,b,J,n,4,Z,Bx,t;Dzx,Dp3,g,R,EF,7,Et,Z,x,c,Ec,w,k,g,BK,p,a,o;D35,Dm7,k,F,BM,p,d,L,T,b,l,L,C1,Q,P,M,D,M,a,U;D11,Dxz,BD,l,8,l,p,f,ET,4,p,k,o,S,CA,C,I,I,Bl,a,BI,M,DW,V,Y,R;EuF,DyF,BJ,F,M,u,S,M,BB,6,BM,O,BI,D,c,L,K,P,F,L,Z,T,Y,H,G,P,H,P,t,f;Isw,EEF,1,X,Bb,G,CJ,T,h,I,X,i,Cu,V,CE,q;FPu,DZ3,BZ,F,1,K,F,K,K,Q,6,Y,Bg,A,c,P,E,T;BYo,DpD,BR,P,Bf,Q,N,W,G,M,BC,a,8,D,S,H,k,t;TB,Dpl,3,N,5,g,o,A,i,K,Y,H;Kl,Dph,h,D,N,K,q,e,BG,M,w,J,G,N,A,R,N,L;Dbd,EKV,FT,Bs,Fy,P,BY,f,Q,l;De9,EIT,j,L,Dn,M,a,W,BQ,U,DG,J,j,N,N,N;C19,DLf,b,H,d,c,K,I,CU,L,BR,L;C4P,DS9,T,J,5,W,G,G,Bc,E,I,P;C8p,DWT,n,G,F,Q,By,a,N,L,A,L,J,J;C41,DRf,p,T,T,A,p,O,N,K,Y,O,BY,H;C9F,DT1,2,H,Z,J,Z,A,5,G,N,I,w,E;DOB,Dm5,T,D,R,S,L,e,5,o,P,W,a,G,BC,N,8,j,I,N,H,P,V,F,A,N;DJj,DPz,Bi,C,c,P,e,C,BN,d,h,a,CB,N,f,K,BI,e;DuP,Dm1,r,J,B3,S,l,Y,U,U,BS,F;E6j,Dwb,x,E,K,K,CG,a,c,Z;FbP,DyD,Z,J,t,C,j,O,R,c,g,K;GNp,D1F,3,D,T,I,y,S,d,k,B2,G,0,H,Q,P,l,Z;Gm3,D2t,f,F,BT,U,l,O,H,c,4,A,CA,V,Q,L,R,V;Iaj,EUJ,Db,E,Cb,0,DO,F,Du,j;IVp,EPN,LP,o,Ey,Q;Ig8,D3Z,d,A,R,G,F,S,0,Q,q,E;Ids,D5x,l,b,p,G,a,O,o,I;Iz2,Dzb,b,H,v,S,k,Y,D,I,E,G,W,G,W,d,O,L;Ijs,Df3,R,H,N,C,L,M,M,S,F,e,e,P,Q,T,C,H;Iew,Ddj,F,N,L,C,P,K,P,Y,O,C,Q,F,G,N,G,H;Ici,Dcd,L,L,L,C,r,Y,G,K,H,K,A,I,C,C;FBo,DbD,BC,F,Q,J,C,N,T,J,Bv,F,R,G,S,W;FNa,Dbn,b,D,L,G,A,C,S,M,Y,E,D,P;FI2,Dcb,V,D,T,G,N,O,e,C,o,L;FXi,DZJ,N,F,p,G,H,a,BD,O,H,O,a,I,y,N,K,L,A,T;Eys,DaT,3,A,R,O,K,G,o,C,a,H,I,J;Ec0,Dd9,j,H,7,a,L,O,G,M,Bg,L,a,Z;EfK,DdZ,p,F,X,M,e,M,2,L;EbQ,Dc3,X,H,R,A,N,I,D,E,K,M,I,A,G,J;Dni,DuB,b,b,L,C,L,O,K,K,M,G;Di0,DvP,L,A,G,I,a,O,U,S,M,C,W,R,F,N,f,L;DuQ,Dp1,h,C,l,Y,F,M,C,U,M,M,S,E,Q,f,k,T,I,P,F,J;Cgm,Ddb,j,H,R,C,D,K,C,G,M,E,4,A,c,H,C,J;0U,Dn1,N,N,Bn,W,V,U,c,S,q,I,BG,G,BO,L,BB,T;Jy,Dpv,BH,F,R,G,J,M,Bk,e,g,F,G,L,J,P;Jh,Drt,X,H,z,I,R,M,D,Q,c,C;EM,Dop,T,Z,L,A,r,q,A,Q,Q,I,4,G,U,F,K,V;IL,DqT,Ba,L,p,l,Bl,j,F,m,h,I,L,S,Bz,e,Bs,G;Om,DpX,h,F,n,K,L,G,N,a,m,K,w,D,S,J,G,R;BEf,D0X,H,1,s,j,P,j,BL,K,b,q,n,U,Cz,E,C6,i,0,0,6,M,M,l;z7,Dwd,P,F,f,A,b,K,N,O,D,K,M,M,U,C,M,F;oX,Duz,R,H,b,C,j,K,P,Q,Q,M,S,D,e,N;BqV,EJB,x,C,o,a,u,A,s,J,P,J;Cyb,DLv,L,D,N,I,D,E,c,W,G,A,F,Z;DDz,DO9,t,L,d,O,c,I,k,H;DLT,Dnv,f,A,T,K,C,I,M,G,k,F,I,R;DJr,Dj1,H,H,b,E,n,O,M,G,c,D,W,H;DJ7,DqH,h,E,R,S,I,O,BQ,E,U,H,A,N,J,L;DJV,DrN,V,D,d,E,Z,G,J,I,M,I,W,E,i,D,Q,J,C,J;DFl,DPb,d,D,T,K,J,K,k,A,Q,F,K,J;DJL,DRJ,L,D,P,C,A,F,M,F,N,D,P,E,L,K,G,I,O,C;DJp,DUD,b,H,n,K,g,C,C,Y,S,K,e,H,V,N,H,L;DN1,DUt,T,A,E,K,Q,I,c,E;DSR,DXP,f,L,T,A,U,W,S,C,e,M,I,D,R,L;DQB,DRd,J,A,E,I,W,W,q,K,F,L,P,L;Dab,DaZ,r,J,Z,C,G,U,U,G,F,O,O,I,G,M,c,I,m,F,H,V,d,J;Dc1,Dbj,t,X,H,A,F,E,A,E,Q,I,C,Y,e,I,K,D,J,L,G,L;DfT,Ddx,h,D,P,E,S,Q,D,I,Q,E,U,D,O,T;DfR,Dgn,n,F,f,G,A,O,L,G,k,M,c,C,y,H,E,H;DtT,Dor,K,H,s,G,S,L,r,Z,b,A,Z,e;D0V,Dyp,h,D,X,K,U,U,s,W,6,D,d,V,J,R;E2l,DxP,j,A,d,M,M,I,K,A,o,N,I,H;GEl,D1R,Bl,F,j,O,DS,y,u,J,Bf,h,U,H;G3F,D2J,h,N,BB,I,G,I,4,G,m,F;Gyz,D2l,Cf,I,BD,W,BS,W,Cg,T,C,X;HqH,D9R,C,D,f,C,3,O,U,E,a,F,Y,H;Hih,D6P,C7,c,y,O,c,D,BG,R;Hm7,EAR,BN,L,V,E,I,M,R,M,y,G,CC,J,Q,P;HtX,EAb,BV,D,v,G,N,O,Cw,N;Hvt,D9f,DQ,L,CJ,R,Bl,S;HvX,EBf,6,L,Bp,E,t,O,4,E;Hyn,D9r,BZ,D,r,K,G,G,CI,E,U,L;HnN,D79,p,D,1,M,p,K,P,Q,Bg,H;Hnh,D9N,Z,R,BB,I,d,K,Q,O,c,E,0,H;HzL,EBl,Dl,U,Bk,K,CI,b;IAj,EKL,F3,o,Q,M;HvZ,EAx,D9,I,BF,U,C8,W;INp,EQ1,T,D,C7,BE,Du,z|DRn,6S,W,A,A,F,D,H,P,E,H,E|JUG,bf,D,D,A,M,E,J";

// Natural Earth 50m (public domain): ne_50m_admin_1_states_provinces for the
// shapes, ne_10m_populated_places_simple for the capitals.
//
// Simplified in the same pass as the countries, not merely the same way. The coast
// of Oregon and the coast of the United States are the same coordinates in the two
// Natural Earth layers, and simplifying the layers separately moved the two copies
// apart — the state stopped lining up with the country drawn behind it. One pass
// over both makes that coastline one stretch with one answer.
//
// The 50 states and the District of Columbia. DC is here because leaving it out
// would punch a hole in the map between Maryland and Virginia; it is not a state,
// so MAP_NOT_QUIZZABLE stops a round ever asking for it.

// The same eleven fields a country has, so one accessor reads either table:
// [iso2, id, name, region, subregion, population, capital, labelLon, labelLat,
//  capitalLon, capitalLat]. Population is null rather than 0 — not "nobody lives
// there", which is what 0 means for an uninhabited island, but "not recorded here".
const MAP_STATES = [
    ["US","US-AL","Alabama","United States","South",null,"Montgomery",-8672,3286,-8628,3236],
    ["US","US-AK","Alaska","United States","West",null,"Juneau",-15160,6536,-13440,5830],
    ["US","US-AZ","Arizona","United States","West",null,"Phoenix",-11193,3430,-11207,3345],
    ["US","US-AR","Arkansas","United States","South",null,"Little Rock",-9214,3476,-9233,3474],
    ["US","US-CA","California","United States","West",null,"Sacramento",-11959,3675,-12147,3858],
    ["US","US-CO","Colorado","United States","West",null,"Denver",-10554,3900,-10499,3974],
    ["US","US-CT","Connecticut","United States","Northeast",null,"Hartford",-7276,4165,-7268,4177],
    ["US","US-DE","Delaware","United States","South",null,"Dover",-7541,3887,-7552,3916],
    ["US","US-DC","District of Columbia","United States","South",null,"Washington",-7701,3889,-7701,3890],
    ["US","US-FL","Florida","United States","South",null,"Tallahassee",-8162,2816,-8428,3045],
    ["US","US-GA","Georgia","United States","South",null,"Atlanta",-8341,3285,-8437,3374],
    ["US","US-HI","Hawaii","United States","West",null,"Honolulu",-15800,2149,-15786,2130],
    ["US","US-ID","Idaho","United States","West",null,"Boise",-11413,4378,-11623,4361],
    ["US","US-IL","Illinois","United States","Midwest",null,"Springfield",-8920,3995,-8964,3979],
    ["US","US-IN","Indiana","United States","Midwest",null,"Indianapolis",-8614,3989,-8617,3975],
    ["US","US-IA","Iowa","United States","Midwest",null,"Des Moines",-9339,4204,-9362,4158],
    ["US","US-KS","Kansas","United States","Midwest",null,"Topeka",-9833,3850,-9567,3905],
    ["US","US-KY","Kentucky","United States","South",null,"Frankfort",-8557,3740,-8487,3820],
    ["US","US-LA","Louisiana","United States","South",null,"Baton Rouge",-9200,3053,-9114,3046],
    ["US","US-ME","Maine","United States","Northeast",null,"Augusta",-6920,4515,-6978,4431],
    ["US","US-MD","Maryland","United States","South",null,"Annapolis",-7705,3939,-7649,3898],
    ["US","US-MA","Massachusetts","United States","Northeast",null,"Boston",-7200,4237,-7107,4233],
    ["US","US-MI","Michigan","United States","Midwest",null,"Lansing",-8495,4343,-8455,4273],
    ["US","US-MN","Minnesota","United States","Midwest",null,"St. Paul",-9336,4606,-9308,4494],
    ["US","US-MS","Mississippi","United States","South",null,"Jackson",-8972,3287,-9018,3230],
    ["US","US-MO","Missouri","United States","Midwest",null,"Jefferson City",-9245,3855,-9217,3858],
    ["US","US-MT","Montana","United States","West",null,"Helena",-11004,4700,-11204,4659],
    ["US","US-NE","Nebraska","United States","Midwest",null,"Lincoln",-9969,4150,-9668,4082],
    ["US","US-NV","Nevada","United States","West",null,"Carson City",-11702,3943,-11977,3916],
    ["US","US-NH","New Hampshire","United States","Northeast",null,"Concord",-7163,4360,-7154,4321],
    ["US","US-NJ","New Jersey","United States","Northeast",null,"Trenton",-7447,4004,-7474,4022],
    ["US","US-NM","New Mexico","United States","West",null,"Santa Fe",-10602,3450,-10594,3569],
    ["US","US-NY","New York","United States","Northeast",null,"Albany",-7532,4320,-7376,4265],
    ["US","US-NC","North Carolina","United States","South",null,"Raleigh",-7887,3562,-7865,3577],
    ["US","US-ND","North Dakota","United States","Midwest",null,"Bismarck",-10030,4747,-10078,4681],
    ["US","US-OH","Ohio","United States","Midwest",null,"Columbus",-8267,4009,-8299,3998],
    ["US","US-OK","Oklahoma","United States","South",null,"Oklahoma City",-9713,3545,-9752,3547],
    ["US","US-OR","Oregon","United States","West",null,"Salem",-12039,4383,-12302,4493],
    ["US","US-PA","Pennsylvania","United States","Northeast",null,"Harrisburg",-7761,4086,-7688,4027],
    ["US","US-RI","Rhode Island","United States","Northeast",null,"Providence",-7151,4162,-7142,4182],
    ["US","US-SC","South Carolina","United States","South",null,"Columbia",-8065,3386,-8103,3400],
    ["US","US-SD","South Dakota","United States","Midwest",null,"Pierre",-10025,4447,-10035,4437],
    ["US","US-TN","Tennessee","United States","South",null,"Nashville",-8634,3575,-8678,3617],
    ["US","US-TX","Texas","United States","South",null,"Austin",-9876,3113,-9774,3027],
    ["US","US-UT","Utah","United States","West",null,"Salt Lake City",-11154,3950,-11193,4078],
    ["US","US-VT","Vermont","United States","Northeast",null,"Montpelier",-7273,4409,-7258,4426],
    ["US","US-VA","Virginia","United States","South",null,"Richmond",-7824,3774,-7745,3755],
    ["US","US-WA","Washington","United States","West",null,"Olympia",-12036,4749,-12290,4704],
    ["US","US-WV","West Virginia","United States","South",null,"Charleston",-8071,3864,-8163,3835],
    ["US","US-WI","Wisconsin","United States","Midwest",null,"Madison",-8958,4437,-8940,4307],
    ["US","US-WY","Wyoming","United States","West",null,"Cheyenne",-10755,4300,-10482,4114]
];

// Encoded exactly like MAP_GEOMETRY, and read by the same decoder.
const MAP_STATE_GEOMETRY = "EiP,BkA,F,D,X,X,BR,H,s,M,P,Y,J,A,F,e,T,a,b,BD,r,A,L,A,T,E4,BU,Jy,T,O,F,C,Hw,D,g,A,E,b,CM,IV,p,BV,K,Cd,M,Z,BD,A,HT,A,E,p,g,h;EkH,Bjk,T,F,b,A,H,C,q,G|HOl,DHi,E,D,FK,Dh,Dm,CQ,Cs,m,s,T,GA,EL,FG,F3,Fw,CR,J,L,R,n,W,BJ,l,x,C,H,BN,1,J,E,BV,EM,Dp,Bl,B8,B8,GN,DG,l,Bg,Bs,P,BX,0,BI,K,Ct,m,e,Bc,C5,P,B3,DI,2,Dx,Cn,e,z,CG,Ct,F,DA,B3,Bx,r,KT,EO,Cm,6,Bb,i,DN,9,DN,BU,I1,V,Cb,BC,q,BE,Dv,p,CV,0,6,BO,Fh,h,w,2,Cn,BR,8,f,BP,n,CM,D,Bh,Bl,Eb,z,j,I,J,A,DF,Bv,DP,K,C6,Bi,Bf,Z,BH,a,Bc,Bk,I,Bc,C8,8,EY,d,DJ,6,CU,BE,FP,9,Ch,7,CF,B1,Bx,L,X,C,A,D,BS,z,Et,CN,Cc,Bn,C9,CR,Rd,IL,GB,D,F3,Ch,FS,Dc,Ei,V,D,Bm,JK,D2,f,Bu,BW,c,BF,u,CS,CS,Ed,Br,7,BE,BS,I,CX,D,d,B1,Ej,CG,Fv,BV,Bm,Bg,Ch,Dw,Be,BW,B9,CT,EV,l,Ep,CW,Fq,BK,E5,G,DX,CA,Fm,FY,EW,d,W,I,c,S,GY,Bq,CJ,CQ,B6,BM,GN,BZ,Kv,q,Cj,B2,Ce,a,GP,BM,Ls,DA,Co,F,BR,BJ,BE,d,Im,W,ET,Cc,Ce,Bl,ES,W,Kj,Bs,Kh,EE,B2,Bs,Go,O,HU,Ea,F4,0,k,BB,Bi,w,CP,W,BS,g,KW,CA,C2,7,BR,5,Ck,0,JQ,z,BK,BT,cI,BF,G4,Bf,Q,D,A,eL,GM,I,X,1;In9,Dbm,A,E,Y,I,q,K;I3t,DTI,B6,W,C0,BF,Cq,N,DH,BJ,Cv,BW,Bt,O,Bf,Z,9,e,i,y;HrN,DKO,b,D,N,C,E,M,A,G,M,A,Q,F,E,F;I8j,DIy,c,C,g,V,BV,G,BZ,g,E,Q,a,I,M,V;H4Z,DIs,L,A,O,K,I,S,M,D,C,F,V,V;HqV,DJA,A,H,H,F,G,L,P,b,H,H,H,D,H,C,C,I,N,A,F,O,I,E,C,K,M,U,E,H,O,K;HmP,DJA,E,H,2,D,Bn,d,V,a,c,Q;HiJ,DIo,H,H,T,C,J,E,e,M,G,D;Im9,DIq,c,P,D,r,Y,h,Bp,N,L,T,DN,y,9,o,B6,C,BK,g;Hql,DG6,b,E,U,W,BY,y,g,i,s,P,BL,r,l,n;Hrf,DHw,L,J,p,E,I,M,e,I,i,N;Hgf,DG6,i,c,S,K,W,E,D,J;IXH,DC8,P,F,R,C,N,U,K,A,S,O,2,M;H6B,DCo,Z,M,I,G,c,K,M,A,G,D,C,F,A,F,H,H;H4P,DCG,d,f,h,S,N,J,E,R,v,H,H,O,X,X,z,P,Bd,U,BS,q,q,F,P,c,i,G;HAd,DBm,Ba,F,i,f,w,BN,V,K,5,BM,V,D,I,f,BE,9,E,T,L,J,M,V,n,L,BH,x,f,G,H,W,a,4,j,g,Z,Ba,f,y,S,D;G9R,DB0,D,H,d,C,b,G,P,K,C,E,a,E,Y,J;HDZ,DBk,V,X,Q,L,w,a,BW,V,F,p,BN,L,BK,L,W,b,N,X,CD,m,b,z,t,G,j,s,Bl,8,y,y,k,Z,K,U,8,O;H7N,DAW,Be,M,L,b,0,V,n,f,Bt,K,0,f,DZ,9,S,T,BF,n,V,K,2,k,Br,a,c,Z,h,T,BN,BW,i,s,BW,S,BY,BH,f,BE,e,E,r,g,o,K,q,d,2,O,M,i,BA,P;H8V,DAm,H,H,z,Y,A,E,I,C,a,J,M,H;HBZ,C9A,BG,B5,F,Bt,h,K,d,k,F,c,S,Q,d,F,d,O,A,S,j,A,C,W,Y,U,d,K,X,i,r,t,f,F,I,S,L,a,G,S,i,G,i,k;I05,C8c,V,J,V,C,H,I,A,C,2,I;H8F,C8K,d,T,P,K,E,Q,M,M,BI,F,G,F,F,F;G5R,C7w,Y,T,A,j,R,T,9,q,m,1,J,V,BX,D,L,M,H,4,9,q,W,M;G7j,C7A,I,R,H,L,T,F,F,7,T,l,V,E,L,L,P,A,N,Y,K,q,Y,K,r,Y,C,I,X,a,E,S,U,Q,a,C;G4P,C6W,D,F,j,C,F,K,C,I,O,S,G,S,w,f,G,N,N,H;Izn,C6s,c,F,O,C,M,D,E,H,Z,L,l,O;IBd,C6S,L,A,P,G,C,G,U,I,W,D,C,F,F,J;IDN,C58,H,G,K,M,q,U,M,A,E,H,P,L;G2P,C4c,x,A,J,E,A,O,J,G,r,E,J,Y,U,I,s,0,M,D,y,z;G4f,C5a,r,U,E,K,Y,M,0,D,C,H,H,P,C,H,F,F;G5r,C5q,U,R,A,f,Bm,n,BY,BX,BL,W,V,Z,q,C,0,l,H,J,F,F,u,H,A,BV,R,T,b,E,f,k,r,I,P,m,R,D,A,V,R,E,BH,4,g,O,Z,U,K,S,3,E,BP,k,2,C,i,Y,b,Y,BN,R,q,m,P,i;Gyn,C2o,P,X,X,N,v,O,H,a,n,X,Z,b,L,K,J,o,o,i,G,w,BI,a,e,V,e,n;IF1,C4E,H,H,R,A,J,C,F,G,Y,Q,K,C,C,H;G57,C3G,A,F,f,P,H,L,n,X,E,c,X,S,W,I,k,F,U,I;IWV,C2a,a,O,H,P,K,R,K,H,D,F,Z,F,T,E,V,H,H,E,F,c,C,G,K,I,O,E,K,F;IVN,C2g,D,R,l,O,G,E,a,C;G4l,C1E,S,I,e,J,H,b,N,R,V,G,3,q,j,0,j,G,H,K,E,I,a,G,o,Z;IT5,C1w,F,H,L,D,j,b,N,F,Q,Y,F,Q,O,C,M,M,M,C,M,O,K,D,H,J,M,J,D,J;Gzr,C1q,U,b,C,L,l,D,J,E,D,E,G,O,L,I,N,C,L,F,D,M,I,K,F,M,C,M,M,A,W,L;ISl,C14,A,R,D,D,H,E,N,F,H,C,C,K,I,C,C,I,D,C,G,I,E,C;ISF,C1U,H,A,H,C,J,K,A,G,O,F,G,J;Ie5,C0s,0,X,5,O,t,X,Bl,D,Br,t,v,E,R,Y,BW,BM,CK,c,0,D;Ibn,C04,P,G,H,G,D,G,c,K,G,A,G,L,J,N;IcX,Cze,T,F,T,E,R,I,D,K,q,J;ImN,Cym,F,C,A,I,H,O,M,G,I,A,M,N,Q,F;InH,CyW,l,A,L,S,E,G,K,E,e,E,m,T,C,F;IpV,Cxs,o,e,c,P,BD,p,w,H,Bf,t,Cx,t,l,M,B8,i,k,q,o,N,Q,O,BN,U,O,a,BM,O;IoL,CxS,D,A,H,G,A,E,E,C,I,I,I,E,I,A,C,D,R,P;Iuz,Cvu,x,p,B3,r,6,q,W,m,BA,K,F,a,W,S,8,M,m,R,P,T;IzZ,Cue,H,N,1,E,D,E,C,E,g,G,O,A;I2v,Ctm,P,H,F,C,D,I,e,U,O,D,G,F,H,N,J,F;JHf,Cry,DM,o,K,K,l,K,2,U,e,T,H,R,b,L,M,N,t,N;I8V,Csm,R,D,R,C,I,M,W,M,S,F,O,J;JB1,CsM,Bs,N,Bb,J,BX,C,X,K;JJ5,Cro,T,G,J,G,A,G,E,I,Q,A,K,F,I,H,C,F;JLp,CrM,Y,C,G,F,A,P,H,F,J,E,1,Z,P,K,Z,R,S,m,a,K,D,K,K,U,U,D,K,J;JNd,Cq0,H,F,Bh,F,F,E,A,E,BU,Q,a,a,O,H,R,T;JP3,Cqg,H,A,b,K,F,E,Q,G,C,I,p,Y,O,I,i,A,Q,N,u,H,b,L,N,T;JJx,CrI,R,F,X,I,C,M;JK3,Cq2,L,G,D,Q,G,E,U,N|Fpx,BnE,t,A,Ft,D,MH,EA,O,g,c,C,W,k,v,0,A,y,k,m,U,Ba,6,2,x,i,x,BW,A,Q,A,C,E,BI,b,CW,q,Q,BE,b,c,e,A,BY,A,BQ,BA,A,OG,A,BA,A,A,BJ|EpX,B2I,D,F,E,N,z,x,C,T,d,l,J,V,E,X,L,T,Z,N,H,L,A,H,z,x,J,v,BF,BB,A,d,f,N,C,h,h,f,M,CF,A,F,p,A,IH,D,l,A,A,c,D,BS,L,G,T,C,V,A,P,H,P,I,L,K,A,W,I,FQ,h,DI,F,c,4,A,Ne,A,Q,p,9,BB,Bk,C|F7t,By2,A,R,w,BX,w,j,7,3,V,Bb,l,n,A,z,u,1,X,l,d,D,Z,F,HZ,j,A,C,BH,Cc,DD,Ba,V,4,G3,By,C,Bm,Cl,Cg,J,O,n,s,z,4,U,BW,B3,BK,Z,By,Ba,7,BD,Bi,Cw,U,Cx,Q,b,BB,Bj,g,S,q,Cj,CS,b,Cy,Bt,B4,6,DQ,d,B6,F,E,My,A,0,A,A,n,A,JF,Qg,MR;GOt,Bv6,o,L,W,E,E,F,D,F,z,J,R,E,A,I,H,I;GQH,Bvu,b,C,G,G,I,C,E,D;GPP,Bva,P,F,N,E,R,S,k,E,S,N;GJx,Bts,K,R,f,C,J,S,F,E,L,A,D,G,E,E,g,N;GNT,BtK,V,A,J,M,K,A,K,D,I,J;GJx,Br4,N,D,N,E,N,U,N,O,G,E,K,P|Fpx,B5W,A,y,A,LS,A,y,BC,A,OK,A,BC,A,y,A,Fm,A,C,Cz,A,b,A,n,C,Id,A,n,z,A,Bl,A,z,A,BP,A,RF,A|Dtn,CLg,A,L,A,Bv,J,R,T,A,DN,L,CJ,3,L,H,T,W,w,Y,N,Q,K,CI,C,U,Q,D,FK,H|D4F,CAE,CL,A,P,Di,A,g,O,Q,G,G,K,C,Y,A,S,F,J,J,b,d,E,h,g,p,E,n,Q,Z,s,n,V,n,Y,D,G,R|EAf,CBc,F,G,L,E,F,A,Q,O,W,Z,T,R|EiP,BkA,Q,0,h,g,F,o,HS,A,BC,A,I,R,S,p,Ig,f,a,p,U,BU,BG,J,i,D,I,T,DC,G7,M,B5,BP,Cw,Ck,HF,BF,EB,BN,j,BN,F,i,Y,Cz,C2,N,4,N,I,R,Bk,5,T,BX,CC,8,BK,BZ,D,m,DW,DX,DW,CB,a,DR,BP,5,B8,Cv,q,Cb,h,o,u,Bd,l;EZ5,Bhm,V,H,X,E,Y,A,m,S,O,C;EKn,BZu,r,Ba,N,q;EQx,BXo,D,N,L,U,H,W,K,H;EQp,BXU,H,F,P,E,J,G,F,O,Q,T;ELT,BTG,p,n,Y,o,W,Q,A,O,S,K;EMJ,BSU,H,A,I,I,E,A;EMv,BSA,F,A,C,E,I,G,C,D,A,F;ENb,BRu,L,H,L,E,K,E,g,G,N,H;EOX,BRg,H,F,F,C,A,G,J,M,A,E,U,N,A,F;EPV,BRU,K,I,E,M,G,L,A,H;EPz,BRK,H,A,A,E,I,E,G,A,A,H|EaP,BmA,N,Y,L,Cc,o,BU,CN,IU,F,a,BC,A,CG,D,BE,A,8,A,B6,C,BA,A,D,A,x,7,Bo,3,0,BX,DQ,DF,Bo,DH,o,R,L,T,n,N,I,T,b,T,G,T,T,P,Q,D,X,h,T,F,S,T,P,T,R,G,R,BT,E,P,j,C,BH,I,V,BV,b,o,Ih,e,T,o;EOp,Bl4,J,x,F,Q,A,S,G,K|JOL,Bc8,F,A,A,C,E,C,E,A;ISZ,BIk,f,G,J,I,V,I,J,K,M,U,e,Q,u,A,K,P,J,l;IUx,BIU,H,A,D,I,E,M,M,I,M,Q,K,F,H,J,A,L,P,H;IMx,BHO,C,R,O,P,h,J,V,O,N,D,F,K,J,D,I,L,b,A,b,i,H,U,e,C,U,S,M,C,W,f,E,R;IJh,BGQ,J,N,X,J,h,I,3,C,I,Y;IIt,BFc,k,I,6,n,Z,Z,9,H,H,C,J,k,d,E,R,a,I,O,O,C;IJ9,BFA,N,H,N,E,F,O,N,Q,W,E,S,L,I,L;IGD,9K,z,W,D,BA,h,BM,u,0,P,g,M,W,CC,7,W,X,E,b,2,v,z,p,1,N,v,f|GFj,CiC,BC,A,BY,A,w,A,A,DN,BG,Bx,Ec,Cn,p,Db,CU,G,BI,CT,B8,Bn,EW,c,a,q,y,t,O,H,A,h,A,HD,A,h,n,A,Id,A,l,A,BN,A,HN,A,BP,A,A,s,W,GY,7,w,CU,D2,BR,BC,H,I,H,M,X,BG|Eu9,CGQ,K,E,A,c,6,q,e,2,Z,m,E,g,B8,m,0,BC,C,s,BX,BG,N,O,Be,A,Is,D,Bc,D,J,l,V,BN,J,l,f,A,f,A,b,IX,Y,BZ,B1,Cx,M,T,H,F,N,P,E,j,BP,j,E,3,BT,U,l,D,Z,d,E,L,P,M,3,g,b,Bu,Cb,Bm,w,B6,Bt,c,CV,Cc,Z,Bi|EkB,B74,N,S,B0,Cw,Z,BY,a,IW,e,A,e,A,8,A,G0,A,A,N,A,BD,F,GV,A,BF,F,D,I,1,B9,T,B9,Cb,BH,o,x,BB,3,W,3,j,Bd,e,L,b,v,S,f,Z|Eu9,CGQ,T,K,p,m,MP,F,z,A,N,Q,N,CE,j,u,T,BW,9,Bu,H,A,H,Q,Z,i,i,BM,H,Q,P,E,G,W,P,g,e,A,BC,A,Oq,A,BE,A,C,N,Y,X,H,BH,Q,p,4,X,U,P,G,T,C,D,M,P,BW,BH,D,t,1,BD,B9,n,F,h,Y,n,f,3,7,r,A,d|FTF,B5W,A,m,D,Ic,A,m,q,A,UQ,A,k,A,u,b,m,D,b,BJ,Ba,BR,A,Gb,A,b,v,A,WX,A|Enl,B5U,F,K,Y,c,k,C,BS,V,F,2,BO,i,F,i,M,O,G,E,E,C,e,Y,u,T,K,a,Bc,f,2,i,2,X,w,BA,BG,p,B8,Ca,B8,S,J,0,E,C,K,G,BG,H,o,t,Bu,t,Cm,M,0,1,C,A,E,H,C,f,J,Z,BG,Bf,k,Z,a,H,BN,x,BH,h,r,v,1,f,BX,X,V,J,D,D,OR,S,I,n,D1,A,p,A,K,S,O,G,O,H,M,I,O,k,C,U;Eor,B3u,P,A,A,C,A,G,E,E,E,D,E,F|E3X,Bse,k,A,IG,C,o,A,C,L,D,BH,o,BR,BX,Bh,7,Cf,GM,A,R,BR,8,BX,P,F,CF,q,l,x,CK,G,W,3,u,e,K,v,BN,p,CQ,BX,d,l,DP,Bq,E,BT,BL,g,z,j,Bv,g,I,2,CF,4,BN,5,FF,i,M,s,F,G,M,U,C,Bi,m,Bk,Bp,DE,A,C2;Enz,Bi4,L,E,P,A,K,G,C,E,U,M,H,J;Emj,BiK,H,H,G,e,J,a,I,N,E,P;Emv,Bh0,L,L,A,E,I,K,G,E;EwH,BhK,J,D,j,Q,D,I,Q,G,K,A,a,P|Dkv,Cci,A,F,W,N,W,D,B4,e,BY,3,C,EX,BM,b,J,BD,U,X,y,A,D,H,c,BB,p,f,CH,V,t,p,BR,a,R,z,5,Q,K,u,BP,Bt,DX,3,Bp,CJ,J,J,R,S,h,8,X,F4,E,E,m,J,k,g,D,Y,4,m,BU,DI,Ce,Ca,m,H,D,T;Dh9,CTA,N,F,N,C,A,L,D,F,T,I,A,O,M,O,K,G,M,F,K,R;DjX,CSk,J,F,J,A,A,K,C,E,C,C|EAf,CBc,C,R,S,Q,X,Y,R,P,P,G,X,Q,l,M,H,G,G,Q,L,K,d,I,N,I,D,A,Z,y,BD,S,BD,h,5,U,n,l,X,G,BV,3,C,BO,A,a,u,A,Ka,A,w,A,A,h,O,Dj,CK,A,A,H,D,L,F,D,A,I,F,E,H,F,J,f,P,F,N,X,N,N,H,L,x,F,J,L,R,E,X,A,K,Y,b,Q,O,m,n,R,x,q,G,W,w,G,n,a,b,L,I,W,a,G,P,S,T,H,E,U,Y,F,K,S,R,F,F,a,i,k,m,C,Z,G,a,U,V,D,C,S,V,H,R,h,X,I,H,Z,P,O,L,d,F,H,f,K,c,d,J,V,T,I,O,Z,L,r,I,r,W,h,l,O,X,i,C,P,G,T,u,l,O,l,z,c,l,G,V,a,F,V,X,g,v,J,C,a,o,w;D4r,B8s,F,A,E,G,a,u,J,Z,N,X|Dtn,CLg,A,C,FL,G,R,C,H,E,s,B4,I,Q,S,A,B4,F,U,A,e,A,DM,H,Bq,k,F,L,S,h,Y,A,C,L,t,P,t,t,BA,V,Y,n,J,L,W,L,I,d,Q,J,a,H,8,U,X,o,b,I,a,C,a,Z,K,z,CX,l,J,k,Bh,t,D,y,L,H,X,S,A,S,J,C,D,Y,BH,D;Dpd,CJe,5,L,J,G,O,C,S,Q,K,C,S,L;Dnv,CJI,R,F,j,I,i,I,E,I,A,G|Eot,Ce0,I,A,EM,u,Kk,ET,BC,Bb,BY,O,e,Bd,Em,CX,BU,Fv,DP,FJ,E,H,BH,r,DP,H,BH,D,A,M,G1,A,9,A,I,k,U,BM,I,k,J,6,K,EO,BC,Cc,Bc,BO,Cx,s,BH,BP,n,K,D,y,r,A,M,BC,BH,0,GX,BQ,7,y,BS,B8,K,S,Y,i|FDp,CiC,a,A,GQ,A,s,BK,BC,B9,QW,CZ,K,A,BH,Bv,Z,j,j,A,Br,E,Ex,Bx,h,V,A,B3,B9,BX,s,v,T,CR,Ee,CZ,U,n,G,9,BF,A,Or,A,BD,A,A,u,A,FE,BT,8,0,w,G,U,D,Q|Ekb,By4,S,P,BV,Jz,S,E5,7,D,t,M,BB,T,V,E,Z,b,R,H,9,BW,Q,BQ,GN,A,6,Ce,BW,Bg,p,BQ,C,BG,D,K,A,E,N,CE,g,e,D,g,e,M,A,c,BE,BA,I,u,y,w,A,G,y,A,FK,A;Elr,Bje,D,F,d,I,D,E,e,H|EpX,B2I,n,A,Bl,D,8,BA,R,o,Nf,A,5,A,A,a,A,y,A,Y,A,a,A,Ga,Bb,BQ,a,BI,n,C,v,a,D,C,P,S,H,U,p,g,F,W,N,U,H,G,y,A,MO,E,o,n,S,L,N,f,Y,Bj,CU,Cd,Bs,d,x,B7,Ca,Bn,a,Bv,2,h,O,N,G,R,D,V,P,l,N,J,P,G,P,H,L,T,F,D,F,C,D,G,F,E,F,C,F,F,A,H,A,D,E,P,F,N,J,F,D,H,G,L,P,F,F,H,I,L,D,P,N,P|F57,CiC,BE,A,LA,A,BC,A,W,A,R2,A,BC,A,E,JP,A,n,A,v,C,CR,H,D,D,A,t,A,V5,A,A,BP,A,Z,P,G,z,s,b,r,EX,d,B9,Bm,BJ,CS,CV,H,o,Da,Ed,Cm,BH,Bw,A,DM,m,A,Fe,A|FTH,CFC,A,a,D,Cy,Fn,A,z,A,A,y,D,E0,A,y,BI,A,Q4,A,GE,Bj,Q,D,G,A,8,Bv,S,BX,i,v,M,CF,M,R,G,H,M,V,E,X,o,h,G,V,O,T,C,D,l,A,UR,A|F53,B5W,A,BR,A,BZ,d,f,BF,a,r,R,a,CX,F,BJ,A,D,3,q,Qh,MQ,A,JE,A,m,BM,A,HO,A,BM,A,BO,A,HM,A,BM,A,A,h,A,PH|Dst,CVM,U,m,S,S,a,H,O,A,K,G,W,F5,g,9,Q,T,L,b,H,N,Br,l,DN,G,f,A,D,I,P,Y,m,CQ,BE,CS,BW,q,Q,Bi|D4L,CE8,K,I,6,a,Bf,Bc,A,c,Y,c,L,Y,BG,BE,Q,G,U,L,CO,BD,F,R,BF,BP,6,b,X,B9,E,o,p,BP,f,N,N,r,Bd,BT,E,q,x,M,BP,4,U,8,BC,c;D1J,CEA,Z,f,A,G,c,m|Fpx,BnE,A,RK,A,BI,BO,A,RE,A,BO,A,A,Z,A,z,A,b,J,A,H,Oh,Ln,A,U,l,Y,L,t,A,E9,C,A,Bd,CT,A|EJT,CNO,BA,W,Bs,0,z,By,Hk,g,CK,CK,DI,B6,Bg,U,Dk,C,y,A,I,Bx,Z,BR,C,Bj,i,J,H,CZ,G,N,J,R,t,B5,G,F,D,V,L,CJ,M,R,x,Z,S,X,J,F,BD,t,Q,g,I,e,D,W,T,Q,K,X,C,d,A,D,CP,BC,V,K,F,G,CD,B8,OP,A,A,BS;DwJ,CIA,CM,c,EL,BV,CT,R,U,O,v,A,Be,4,DC,O,BK,g;D1V,CGs,L,A,K,S,S,K,G,D,D,N,N,L|EUH,By4,BB,A,B7,D,9,A,G,q,BW,BA,C0,6,6,u,e,N,0,g,w,D,BC,w,G,i,I,Q,E,D,SS,L,F,R,i,BL,BF,i,A,b,BV,b,j,q,A,3,CI,C,D,5,2,2,I,BB,BT,9,BD,K,T,a,h,V,9,U,Bs,1,3,5,7,g,U,Z,Bo,J,U,L,R,V,Cx,x,X,a,G,p,BN,z,l,BH,F,u,N,1,BT,C,f,J,Dh,C8,Dp,G,BB,BE,EN,K,CT,r;D6z,B34,G,A,U,BD,u,BV,p,4,R,i;D6B,B1q,D,F,P,W,O,J,C,H;D5r,Bzq,f,F,e,M,M,6,F,o,I,BD,L,j;D6d,Bzg,l,P,F,A,Y,K;D8x,Bxu,H,D,S,a,u,k,f,d;D87,Bxw,N,C,L,E,D,E,K,D|FEn,CiC,8,A,CI,Jl,C,R,v,A,Wj,A,v,A,A,m,F,JO,U,A|EUJ,CLU,S,Z,B4,h,Du,Bu,B6,S,g,E,A,FF,A,V,Z,L,I,x,3,CR,BR,3,BT,Z,t,BP,Z,Y,P,L,b,BJ,9,p,X,I,D,A,1,0,Cn,N,Bv,s,p,s,BH,G,L,H,A,BE,E,GU,A,BC,BG,C,DO,G|E5P,B3u,E,d,g,DJ,J,FR,A,X,v,K,Bp,0,GJ,v,Gl,Bk,Ct,BM,A,GK,JF,A,n,A,A,a,A,y,A,Y,y,A,Bk,A,y,A,u,A,WW,A,u,A,A,Z,A,z|GPH,CLe,1,A,Mz,A,b,Y,l,CO,BQ,C0,g,IK,CK,R,U,C,U,G,BQ,Bp,Bs,R,QU,BU,w,A,G,J,BQ,BD,CV,D3,6,x,X,GZ,A,t,BN,A,HP,A|ELv,CMg,2,K,q,O,4,U,A,d,A,BT,OO,A,CC,B9,E,H,R,H,BH,BF,K,Z,Z,d,A,d,Be,Bd,7,b,L,J,V,T,f,H,R,H,F,D,T,E,Z,A,L,D,H,H,P,R,x,A,Kb,A,v,A,b,A,C7,A,A,Cm,A,Y,A,U|Dtv,CJW,I,Q,A,Bu,A,K,O,A,BG,C,C,Z,I,D,A,T,W,T,J,H,Z,Y,G,V,P,P,D,l,R,P,z,L;Drz,CJ0,L,H,N,C,G,I,C,K,G,M,E,E,G,C;DsP,CJ0,F,F,D,K,E,K,E,A,C,H|EM3,BpU,p,Q,Bp,DG,DR,DE,1,BW,Bp,2,w,6,C,A,C,A,CS,q,EM,L,BA,BF,Do,H,Dg,C9,F,D,BH,r,3,BX,J,g,L,1,Bf,BD,n,D,D,d,BX,j,3,C,g,T,X,b,t,g,W,v,n,f|FBJ,CQU,f,A,O,h,H,X,O,F,G,R,j,BN,Y,j,G,R,R,C,GF,Bi,Q5,A,BJ,A,A,y,D,E0,A,y,C,A,G,C,D,CQ,A,u,u,A,Wi,A,u,A,H,V,1,x,BS,9,A,FF|EcN,By4,h,A,Hx,C,E,D,3,A,FL,A,z,A,G,K,Y,M,K,S,F,W,I,U,c,k,D,S,y,w,F,M,C,E,A,G,M,O,C,O,J,K,E,G,O,E,H,K,C,G,I,E,E,M,F,O,O,A,E,D,E,C,o,A,D0,A,J,m,OQ,T,C,C,u,D,FS,E,c,D,J,R,H,j,BD,x,x,C,1,h,f,M,7,v,C1,7,BX,BB,H,r,BF,A,CH,C|E4x,Bui,K,L,O,J,O,G,U,A,S,D,K,H,C,BT,A,d,A,Z,A,C3,Bo,DF,n,Bl,D,Bj,N,V,L,A,X,h,M,V,Cz,BH,u,i,z,A,I,o,5,L,a,BF,BP,BV,DH,Bh,s,c,CD,Q,s,z,CZ,BD,S,f,BL,f,c,j,f,BH,BF,a,4,t,K,Cb,8,Bf,D,P,GV,Bk,BT,Di,GP,HM,Dx,H,CH,Cb,Dr,B0,B3,De,Et,Dk,D,C,Z,K,V,k,Lm,A,G,Og,I,A,m,A,JE,A,A,GL,Cs,BN,Gk,Bl,GI,u,Bo,1;E6l,BgC,L,D,s,e,I,K,M,A,T,T;FCJ,Bcy,J,A,I,K,w,a,O,C,G,I,E,A,D,J;FC7,BcA,H,A,M,W,Q,W,I,C,E,J,R,P;FEJ,BZ2,A,S,Q,m,i,0,O,I,n,5;FDf,BWO,t,CS,D,4,E,U,I,BT|Fpx,B5W,BB,A,OH,A,BB,A,A,g,A,PG,A,g,k,A,Ic,A,m,A,A,Z,A,C1,Fo,A,y,A,A,z,A,LT|Dyn,CVM,i,A,EC,A,BU,A,D,F,R,Bj,BX,r,BF,CT,n,CR,O,Z,C,J,V,A,B5,E,T,A,H,M,G,CY,j,I,D,Bi,Y,BQ|EAx,CBm,E,A,K,F,E,H,F,X,r,l,L,p,0,J,c,h,CG,BB,R,r,f,A,CB,Bk,By,Bn,w,V,N,J,U,H,C,d,d,G,L,Z,BB,q,Bi,BZ,Z,N,v,u,CB,W,B2,h,k,3,Bk,C,W,z,G,X,H,A,R,A,ST,K,F,C,d,C,FT,F,v,C,U,I,BW,W,0,e,q,u,BG,g,BM,w,C,H,BM,9,Do,s,Co,Dq,BS,T,C8,DI,Bs,t,M,Y,M,J,c,J,K,L,H,R,G,H,k,N,W,R;D6F,B8a,I,K,w,E,t,BR,C,P,X,J,X,T,Z,5,P,W,E,c,S,s,i,o;D4v,B8s,E,A,V,f,L,F|GYH,CiC,SO,A,U,A,A,IX,W,BH,G,N,x,A,QV,BV,Bt,Q,BR,Bo,V,H,H,E,r,U,B9,C,G,BE,S,l,M,u,t,o,2,U,3,Q,H,T,x,CS,5,BA,L,BU,CW,r,DQ,V,m,O,Y,1,Bj,Br,s,K,f,D,Bi,Bs,O,h,h,h,Y,f,F,j,b,G,N,V,N,Y,p,p,BE,H,g,i,G,C,K,C,W,O,J,Bc,e,m,f,g,A,T,b,Q,A,O,Y,I,3,o,i,I,D,g,L,W,T,F,P,S;GZF,CiC,I,A,D,D,F,A;GYF,ChA,C,F,J,F,H,A,J,G,F,A,C,P,V,I,D,E,E,G,M,G;GYz,Cgc,E,H,V,E,L,E,H,Q,C,E,K,A,S,P;GYN,CgO,F,D,L,C,H,G,D,E,E,M,E,C,E,A,C,L,K,L;GXP,Ce6,E,K,a,T,D,P,N,C,L,K,P,C,H,I,H,Y,P,E,N,O,Y,c,M,F,G,P,h,N,U,H;GXL,Cde,N,E,F,E,E,Q,I,D,C,D;GWz,Cc4,D,H,J,F,F,C,A,G,D,A,J,H,A,M,E,O,E,A;GYT,CcQ,D,D,F,A,H,I,A,E,E,E,I,L|EQb,B7G,b,G,l,Y,BH,Be,I,Y,D,e,F,G,W,J,8,o,a,BI,O,K,Y,Z,s,BO,BS,Y,BQ,2,2,CQ,J,w,Y,K,A,Z,A,Cn,C6,A,a,A,A,b,D,BP,BU,2,W,H,m,k,4,V,BC,g,BC,T,Y,z,C,A,N,Z,Bt,s,C9,DJ,BT,S,Cp,Dr,Dp,t,BN,8|Esb,CNI,D,C,H,S,V,O,5,W,R,o,G,BG,Z,W,D,M,H,8,V,m,Ef,CY,S,CQ,t,u,B8,BW,A,B2,g,U,Ew,Bw,Bq,F,i,A,L,T,BT,B9,6,z,GW,BR,BG,1,N,BD,q,A,C,z,m,L,BG,BO,Cw,t,Bd,BP,BD,Cd,L,EP,I,7,Bd,C,It,C|FZj,CIQ,BD,A,OL,A,BD,A,z,A,Fp,A,A,C0,A,Y,A,g,A,HC,A,g,A,Y,A,BO,V4,A,s,A,A,z,C,E1,A,z,A,z,C,E1";

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
const MAP_SEA_PX = 9;         // and the same for a sea, a shade smaller than a country
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
    Oceania: { lon: [110, 180], lat: [-50, -5] },
    // Wide enough for Alaska and Hawaii as well as the lower 48. An atlas would put
    // those two in insets and frame the rest tightly; this map has no insets, and a
    // round that asks for Alaska has to have Alaska on screen.
    'United States': { lon: [-170, -66], lat: [18, 68] }
};

// The water. [name, lon, lat, width, ocean] — position in hundredths of a degree
// like everything else, and width the span of open water the name has to live in,
// which is what decides when it appears: a sea is labelled once that span is wide
// enough on screen to hold the name, the same rule the countries follow. So the
// oceans are there from the world view and the Banda Sea waits until you go looking.
//
// The last field marks the five oceans, which are set larger than the seas. The
// Atlantic and the Pacific are named north and south as an atlas does, and the
// Southern Ocean twice because at world zoom it runs off both edges of the map.
//
// Open water, not the sea's full extent. The Mediterranean is 38° end to end but
// barely 16° of it is clear of Sicily and Tunisia, and sized by the larger figure
// its name appeared at world zoom lying half-buried under Italy.
//
// There is no geometry behind these, only a point to hang the name on, chosen to
// sit in open water clear of the coast in every projection.
const MAP_SEAS = [
    ['Arctic Ocean', 0, 8300, 12000, 1],
    ['North Atlantic Ocean', -4300, 3000, 7000, 1],
    ['South Atlantic Ocean', -1900, -3300, 7000, 1],
    ['North Pacific Ocean', -14500, 2500, 12000, 1],
    ['South Pacific Ocean', -12500, -2500, 12000, 1],
    ['Indian Ocean', 8000, -3000, 7000, 1],
    ['Southern Ocean', 2000, -6000, 12000, 1],
    ['Southern Ocean', -14000, -6000, 12000, 1],

    ['Bering Sea', -17700, 5800, 1600],
    ['Beaufort Sea', -14000, 7300, 1500],
    ['Gulf of Alaska', -14500, 5500, 1400],
    ['Baffin Bay', -6800, 7300, 1000],
    ['Hudson Bay', -8500, 6000, 1300],
    ['Labrador Sea', -5500, 5900, 1200],
    ['Gulf of Mexico', -9000, 2500, 1200],
    ['Caribbean Sea', -7500, 1450, 2500],
    ['Scotia Sea', -4500, -5700, 1400],
    ['Weddell Sea', -4500, -7200, 2000],
    ['Greenland Sea', -500, 7600, 1200],
    ['Norwegian Sea', 300, 6800, 1300],
    ['North Sea', 350, 5650, 700],
    ['Baltic Sea', 1950, 5800, 700],
    ['Bay of Biscay', -500, 4500, 800],
    ['Mediterranean Sea', 1700, 3500, 1600],
    ['Adriatic Sea', 1600, 4300, 500],
    ['Aegean Sea', 2500, 3800, 500],
    ['Black Sea', 3400, 4300, 1100],
    ['Caspian Sea', 5100, 4200, 700],
    ['Barents Sea', 4000, 7400, 1800],
    ['Kara Sea', 7500, 7400, 1500],
    ['Laptev Sea', 12800, 7600, 1400],
    ['East Siberian Sea', 16000, 7400, 1500],
    ['Sea of Okhotsk', 15000, 5300, 1300],
    ['Sea of Japan', 13500, 4000, 800],
    ['Yellow Sea', 12300, 3500, 600],
    ['East China Sea', 12600, 2900, 800],
    ['South China Sea', 11500, 1400, 1500],
    ['Philippine Sea', 13300, 1800, 1400],
    ['Coral Sea', 15500, -1800, 1600],
    ['Tasman Sea', 16200, -3800, 1400],
    ['Great Australian Bight', 13000, -3800, 1600],
    ['Timor Sea', 12800, -1150, 700],
    ['Arafura Sea', 13500, -900, 800],
    ['Banda Sea', 12700, -600, 600],
    ['Java Sea', 11200, -500, 900],
    ['Celebes Sea', 12200, 350, 500],
    ['Andaman Sea', 9600, 1000, 700],
    ['Bay of Bengal', 8800, 1500, 1200],
    ['Arabian Sea', 6300, 1500, 1600],
    ['Red Sea', 3800, 2000, 700],
    ['Gulf of Aden', 4800, 1250, 800],
    ['Persian Gulf', 5150, 2700, 600],
    ['Mozambique Channel', 4100, -1800, 800],
    ['Gulf of Guinea', 200, 200, 1100],
    ['Ross Sea', -17500, -7500, 1600]
];

/** The region whose places are the US states rather than the countries. */
const MAP_US = 'United States';

// Places a round never asks for, by name. Antarctica is a continent held by treaty
// rather than a country, the Siachen Glacier is a disputed icefield whose
// population is a garrison, and the District of Columbia is not one of the fifty
// states — it is drawn because leaving it out would punch a hole in the map
// between Maryland and Virginia. All three still answer to a click.
const MAP_NOT_QUIZZABLE = ['Antarctica', 'Siachen Glacier', 'District of Columbia'];

// And nowhere no one lives: Heard Island, Ashmore and Cartier, South Georgia,
// Pitcairn, the Fr. S. Antarctic Lands. "Find Ashmore and Cartier Is." is not a
// question anyone can answer, whereas Vatican City — 825 people, the smallest place
// this admits — plainly is.
const MAP_MIN_QUIZ_POP = 500;

/** Whether a round can ask for this place. */
function mapIsQuizzable(row) {
    if (MAP_NOT_QUIZZABLE.indexOf(row[2]) !== -1) return false;
    // null is "not recorded", which is how the states carry their population; 0 is
    // "nobody lives there", which is what rules out an uninhabited island. The two
    // must not be confused, or every state drops out of the quiz.
    return row[5] === null || row[5] >= MAP_MIN_QUIZ_POP;
}

// All keyed by layer, and the path and extent caches by projection as well: the
// countries and the states are two independent sets of shapes.
var mapGeometryCache = {};
var mapPathCache = {};
var mapExtentCache = {};
var mapIso3Index = {};
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

/**
 * Which table a region works in.
 *
 * The map draws one set of places at a time, and the region says which: pick the
 * United States and the states become the places — what is drawn, what a click
 * selects, what a round asks for. Because a state row carries the same eleven
 * fields a country row does, everything downstream reads either without knowing
 * the difference, and the layers stay index-for-index with whichever is in force.
 */
function mapLayerFor(region) {
    return region === MAP_US ? 'states' : 'countries';
}

function mapTableOf(layer) {
    return layer === 'states' ? MAP_STATES : MAP_COUNTRIES;
}

function mapBlobOf(layer) {
    return layer === 'states' ? MAP_STATE_GEOMETRY : MAP_GEOMETRY;
}

/** The layer a widget is currently showing. */
function mapLayerOf(widget) {
    return widget && widget.dataset.mapLayer === 'states' ? 'states' : 'countries';
}

/** One place's row, with names on it. */
function mapCountry(index, layer) {
    const r = mapTableOf(layer)[index];
    if (!r) return null;
    return {
        index: index, iso2: r[0], iso3: r[1], name: r[2], continent: r[3],
        subregion: r[4], pop: r[5], capital: r[6], lon: r[7], lat: r[8],
        capitalLon: r[9], capitalLat: r[10]
    };
}

function mapIndexOf(iso3, layer) {
    const key = layer === 'states' ? 'states' : 'countries';
    if (!mapIso3Index[key]) {
        const index = {};
        mapTableOf(key).forEach(function(row, i) { index[row[1]] = i; });
        mapIso3Index[key] = index;
    }
    const i = mapIso3Index[key][iso3];
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
function mapGeometry(layer) {
    const key = layer === 'states' ? 'states' : 'countries';
    if (mapGeometryCache[key]) return mapGeometryCache[key];
    const alphabet = {};
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('').forEach(function(c, i) {
        alphabet[c] = i;
    });

    mapGeometryCache[key] = mapBlobOf(key).split('|').map(function(blob) {
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
    return mapGeometryCache[key];
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

/** Every shape's path in one projection, built once per projection and layer. */
function mapPaths(key, layer) {
    const id = (layer === 'states' ? 'states' : 'countries') + '|' + key;
    if (mapPathCache[id]) return mapPathCache[id];
    const projection = mapProjectionOf(key);
    mapPathCache[id] = mapGeometry(layer).map(function(rings) {
        return mapRingsToPath(projection, rings);
    });
    return mapPathCache[id];
}

/** A shape's extent in user space, or null where it wraps the antimeridian and
 *  the extent would be the whole map. */
function mapCountryBounds(key, index, layer) {
    const rings = mapGeometry(layer)[index];
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
function mapCountryExtents(key, layer) {
    const id = (layer === 'states' ? 'states' : 'countries') + '|' + key;
    if (mapExtentCache[id]) return mapExtentCache[id];
    const projection = mapProjectionOf(key);
    mapExtentCache[id] = mapGeometry(layer).map(function(rings) {
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
    return mapExtentCache[id];
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

    // A sea is named once there is room for the name between its shores. Only the
    // width is asked about: the oceans are wider than they are tall on this map,
    // and a channel like Mozambique's is long enough to carry a name across it.
    const seas = widget.querySelector('.map-seas');
    if (seas) {
        seas.setAttribute('font-size', MAP_SEA_PX / scale);
        const names = seas.querySelectorAll('.map-sea');
        for (let i = 0; i < names.length; i++) {
            const span = MAP_SEAS[i][3] / 36000 * MAP_W * scale;
            names[i].classList.toggle('hidden', span < Number(names[i].dataset.w || 0) + MAP_LABEL_PAD);
        }
    }
    const extents = mapCountryExtents(widget.dataset.mapProjection || 'equirectangular', mapLayerOf(widget));
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
    const seas = widget.querySelector('.map-seas');
    if (!group) return;
    const reference = 100;
    group.setAttribute('font-size', reference);
    if (seas) seas.setAttribute('font-size', reference);
    // Every write happens before every read, so this costs one layout, not 177.
    const labels = group.querySelectorAll('.map-label');
    for (let i = 0; i < labels.length; i++) {
        labels[i].dataset.w = labels[i].getComputedTextLength() / reference * MAP_LABEL_PX;
    }
    // Measured separately because the sea names are italic and letter-spaced, so
    // the same string is not the same width in the two layers.
    const names = seas ? seas.querySelectorAll('.map-sea') : [];
    for (let i = 0; i < names.length; i++) {
        names[i].dataset.w = names[i].getComputedTextLength() / reference * MAP_SEA_PX;
    }
}

/** The selected country shows its capital however small it is — you asked about
 *  that one, so it stops depending on how much room it happens to have. */
function mapPaintCapitals(widget, data) {
    const dots = widget.querySelector('.map-capitals');
    if (!dots) return;
    const table = mapTableOf(mapLayerFor(data.region));
    const selected = data.mode === 'explore' ? data.selected : null;
    dots.querySelectorAll('.map-capital').forEach(function(dot, i) {
        const isSelected = selected && table[i][1] === selected;
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
    const data = mapGetData(toolId);
    const layer = mapLayerFor(data.region);
    const country = mapCountry(index, layer);
    if (!country) return;
    const bounds = mapCountryBounds(data.projection, index, layer);
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
        mapBuildShapes(widget, data.projection, mapLayerFor(data.region));

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

function mapBuildShapes(widget, key, layer) {
    const svg = widget.querySelector('.map-svg');
    if (!svg) return;
    const projection = mapProjectionOf(key);
    const table = mapTableOf(layer);
    const paths = mapPaths(key, layer);
    const shapes = table.map(function(row, i) {
        return '<path class="map-country" data-iso="' + row[1] + '" d="' + paths[i] + '"></path>';
    }).join('');
    // Antarctica has no capital, so it gets a placeholder circle that is never
    // shown — the layers stay index-for-index with the table in force, which is
    // what lets the scale pass address them without a lookup.
    const capitals = table.map(function(row) {
        if (row[9] === null) return '<circle class="map-capital" r="0"></circle>';
        return '<circle class="map-capital" cx="' + mapProjectX(projection, row[9], row[10]).toFixed(1) +
            '" cy="' + mapProjectY(projection, row[10]).toFixed(1) + '"></circle>';
    }).join('');
    // Labels are their own layer above the shapes so no place can paint over a
    // neighbour's name, and they take no pointer events so they never eat a click.
    const labels = table.map(function(row) {
        return '<text class="map-label" x="' + mapProjectX(projection, row[7], row[8]).toFixed(1) +
            '" y="' + mapProjectY(projection, row[8]).toFixed(1) + '">' + escapeHtml(row[2]) + '</text>';
    }).join('');
    // Showing the states alone would float the country in blue with no Canada or
    // Mexico beside it, so the countries stay as one flat backdrop path. One path
    // and not 242: nothing addresses it, nothing clicks it, it is only the shore.
    const backdrop = layer === 'states'
        ? '<path class="map-backdrop" d="' + mapPaths(key, 'countries').join('') + '"></path>'
        : '';
    // Water names sit under the land, not over it: the point one hangs from is a
    // rough centre, and a wide name like "Great Australian Bight" runs past the
    // coast at some zooms. Drawn beneath, the coastline simply covers the overrun.
    const seas = MAP_SEAS.map(function(sea) {
        return '<text class="map-sea' + (sea[4] ? ' ocean' : '') + '" x="' +
            mapProjectX(projection, sea[1], sea[2]).toFixed(1) +
            '" y="' + mapProjectY(projection, sea[2]).toFixed(1) + '">' + escapeHtml(sea[0]) + '</text>';
    }).join('');
    svg.innerHTML = '<g class="map-seas">' + seas + '</g>' +
        backdrop +
        '<g class="map-shapes">' + shapes + '</g>' +
        '<path class="map-ghost"></path>' +
        '<g class="map-capitals">' + capitals + '</g>' +
        '<g class="map-labels">' + labels + '</g>';
    svg.classList.toggle('states', layer === 'states');
    widget.dataset.mapProjection = key;
    widget.dataset.mapLayer = layer === 'states' ? 'states' : 'countries';
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
    mapBuildShapes(widget, data.projection, mapLayerFor(data.region));
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

    // Out of the places a round can ask for, not out of every shape on the map: the
    // uninhabited ones are never asked, so they could never be learned either.
    //
    // Both tables keep their progress in the one map, so the count has to be of the
    // table in force. Otherwise learning Texas raises the world view's tally, and
    // "Learned 1 / 235" is claiming a country nobody has looked at.
    const table = mapTableOf(mapLayerFor(data.region));
    const pool = table.filter(mapIsQuizzable);
    const learned = pool.filter(function(row) {
        const entry = data.progress[row[1]];
        return entry && entry.right;
    }).length;
    const stat = widget.querySelector('.map-stat');
    if (stat) stat.textContent = 'Learned ' + learned + ' / ' + pool.length;

    const panel = widget.querySelector('.map-panel');
    if (panel) panel.innerHTML = data.mode === 'quiz' ? mapQuizPanel(data) : mapExplorePanel(data);
    mapPaint(widget, data);
}

/** What the framework calls when the map needs to be up to date. The SVG scales
 *  itself to whatever box it is given, so this is about the panel and the painting
 *  rather than the geometry. */
function mapOnRender(toolId) {
    const tool = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    const widget = tool && tool.querySelector('.map-widget');
    if (widget) mapRender(widget);
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
    const layer = mapLayerFor(data.region);
    const index = data.selected ? mapIndexOf(data.selected, layer) : -1;
    const country = index === -1 ? null : mapCountry(index, layer);
    // Its own class, not just .map-hint: that one is also the quiz's score and its
    // round counter, which View has every reason to keep.
    if (!country) return '<span class="map-hint map-nudge">Click a country to see what it is. Drag to pan, scroll to zoom.</span>';
    return '<span class="map-flag">' + mapFlag(country.iso2) + '</span>' +
        '<span class="map-title">' + escapeHtml(country.name) + '</span>' +
        '<dl>' +
            '<dt>Capital</dt><dd>' + escapeHtml(country.capital || '—') + '</dd>' +
            // null is "not recorded" — the states carry no population — and a row
            // reading "Population unknown" for all fifty of them says nothing.
            (country.pop === null ? '' :
                '<dt>Population</dt><dd>' + mapFormatPop(country.pop) + '</dd>') +
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
    const target = mapCountry(mapIndexOf(quiz.target, mapLayerFor(data.region)), mapLayerFor(data.region));
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
            const index = iso ? mapIndexOf(iso, mapLayerFor(data.region)) : -1;
            if (index !== -1) {
                // Dragging a country carries it somewhere it does not belong, so
                // the pan has to give way while a country is in hand.
                runtime.ghost = { iso: iso, index: index, projection: data.projection, layer: mapLayerFor(data.region) };
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
        if (iso) mapZoomToCountry(widget, toolId, mapIndexOf(iso, mapLayerOf(widget)));
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
    const layer = mapLayerOf(widget);
    const country = mapCountry(mapIndexOf(iso, layer), layer);
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
    const layer = mapLayerFor(data.region);
    const country = mapCountry(mapIndexOf(quiz.target, layer), layer);
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
    const layer = mapLayerFor(data.region);
    const index = mapIndexOf(data.compare.iso, layer);
    const country = mapCountry(index, layer);
    if (!country) return '';
    return mapRingsToPath(mapProjectionOf(data.projection), mapGeometry(layer)[index],
        data.compare.lon - country.lon, data.compare.lat - country.lat);
}

function mapDragGhost(widget, ghost, e) {
    const svg = widget.querySelector('.map-svg');
    const path = widget.querySelector('.map-ghost');
    const point = mapClientToUser(svg, e.clientX, e.clientY);
    const country = mapCountry(ghost.index, ghost.layer);
    if (!point || !path || !country) return;
    const projection = mapProjectionOf(ghost.projection);
    const at = mapUnproject(projection, point.x, point.y);
    ghost.lon = at.lon;
    ghost.lat = at.lat;
    // Written straight to the element: a drag redraws continuously and has no
    // business going through storage on the way.
    path.setAttribute('d', mapRingsToPath(projection, mapGeometry(ghost.layer)[ghost.index],
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
    // Crossing into or out of the United States swaps the places themselves, so
    // the shapes, the names and the dots all have to be built again. A selection
    // made among the countries means nothing among the states.
    const layer = mapLayerFor(data.region);
    if (layer !== mapLayerOf(widget)) {
        data.selected = null;
        data.compare = null;
        mapBuildShapes(widget, data.projection, layer);
    }
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
    // Searches whatever is on the map: countries, or the states in that region.
    const data = mapGetData(toolId);
    const table = mapTableOf(mapLayerFor(data.region));
    const matches = table.map(function(row, i) { return i; }).filter(function(i) {
        return table[i][2].toLowerCase().indexOf(query) === 0;
    });
    // Jump only once the query names one place, so typing "i" does not fly off
    // to India before you have finished writing Indonesia.
    const exact = matches.filter(function(i) { return table[i][2].toLowerCase() === query; });
    const hit = exact.length ? exact[0] : (matches.length === 1 ? matches[0] : -1);
    if (hit === -1) return;
    data.selected = table[hit][1];
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
    // In the United States the table is already only the states, and every one of
    // them carries that as its region, so the filter below simply passes them all.
    const table = mapTableOf(mapLayerFor(data.region));
    return table.map(function(row, i) { return i; }).filter(function(i) {
        const row = table[i];
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
    data.quiz.target = mapTableOf(mapLayerFor(data.region))[pick][1];
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
    const layer = mapLayerOf(widget);
    const country = mapCountry(mapIndexOf(targetIso, layer), layer);
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
    var tlFunctions = [tlGetToolId, tlGetWidget, tlGetData, tlSaveData, tlInit, tlOnRender, tlGenId, tlSafeColor, tlClosePanels, tlFormatSingleDate, tlFormatDate, tlFormatEraYear, tlFormatEraRange, tlContrastColor, tlEraTypeOptionsHtml, tlSortEvents, tlFindEraForEvent, tlGetCategoryById, tlRender, tlRenderEraBanner, tlRenderEvent, tlPopulateCategorySelect, tlOpenEventForm, tlEditEvent, tlCloseEventForm, tlSaveEvent, tlDeleteEvent, tlToggleCategoryManager, tlRenderCategoryList, tlAddCategory, tlRenameCategory, tlSetCategoryColor, tlDeleteCategory, tlToggleEraManager, tlRenderEraList, tlAddEra, tlUpdateEraField, tlDeleteEra, tlLoadEraPreset, tlToggleShowEras, tlToggleDates];
    var mapFunctions = [mapGetToolId, mapGetWidget, mapRuntimeFor, mapLayerFor, mapTableOf, mapBlobOf, mapLayerOf, mapCountry, mapIndexOf, mapDecodeInt, mapGeometry, mapRobinson, mapProjectionOf, mapProjectX, mapProjectY, mapUnproject, mapRingsToPath, mapPaths, mapCountryBounds, mapCountryExtents, mapGetData, mapSaveData, mapRegionView, mapClampView, mapApplyView, mapUpdateLabels, mapMeasureLabels, mapPaintCapitals, mapClientToUser, mapViewAround, mapSetView, mapZoomBtn, mapZoomAt, mapResetView, mapZoomToCountry, mapInit, mapOnRender, mapBuildShapes, mapSetProjection, mapRender, mapPaint, mapFlag, mapFormatPop, mapExplorePanel, mapQuizPanel, mapBindStage, mapIsoAt, mapTooltip, mapHideTooltip, mapUpdateArrow, mapHideArrow, mapToggleHint, mapClick, mapSetMode, mapGhostPath, mapDragGhost, mapToggleCompare, mapSetRegion, mapSearch, mapIsQuizzable, mapQuizPool, mapQuizStart, mapQuizAsk, mapHitsTarget, mapQuizAnswer, mapFlash, mapQuizSkip, mapResetProgress];
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
        'window.MAP_STATES = ' + JSON.stringify(MAP_STATES) + ';\n' +
        'window.MAP_STATE_GEOMETRY = ' + JSON.stringify(MAP_STATE_GEOMETRY) + ';\n' +
        'window.MAP_US = ' + JSON.stringify(MAP_US) + ';\n' +
        'window.MAP_REGIONS = ' + JSON.stringify(MAP_REGIONS) + ';\n' +
        'window.MAP_SEAS = ' + JSON.stringify(MAP_SEAS) + ';\n' +
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
        'window.MAP_SEA_PX = ' + MAP_SEA_PX + ';\n' +
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
        '<div class="tl-scroll authoring-result"><div class="tl-line"></div></div>' +
    '</div>',
    // Two modes, not three: the panels are forms you fill in against the timeline,
    // and a mode that showed them without it would be editing something you cannot
    // see. So the editing mode is the one that shows both, and it says Edit.
    //
    // It opens in Edit rather than View, like the image viewer and the QR code: a
    // new timeline has no events, and its one instruction names a button that View
    // hides. Once there is something on it, View sticks.
    authoring: {
        modes: ['split', 'render'],
        defaultMode: 'split',
        labels: { split: 'Edit' },
        titles: { split: 'The timeline, with the buttons that build it' },
        source: '.tl-panel',
        result: '.authoring-result',
        actions: '.tl-toolbar',
        onRender: 'tlOnRender'
    },
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
        '<div class="map-toolbar authoring-source">' +
            '<button class="map-btn map-mode" data-mode="explore" onclick="mapSetMode(this, \'explore\')">Explore</button>' +
            '<button class="map-btn map-mode" data-mode="quiz" onclick="mapSetMode(this, \'quiz\')">Quiz</button>' +
            '<select class="map-select map-region" onchange="mapSetRegion(this)"></select>' +
            '<select class="map-select map-projection" onchange="mapSetProjection(this)" title="How the round world is flattened"></select>' +
            '<button class="map-btn map-compare" onclick="mapToggleCompare(this)" title="Drag a country somewhere else to see its true size there">True size</button>' +
            '<input type="search" class="map-search" placeholder="Search country" oninput="mapSearch(this)">' +
            '<span class="map-spacer"></span>' +
            '<span class="map-stat"></span>' +
        '</div>' +
        '<div class="map-stage authoring-result">' +
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
    // Two modes, not three: the map is the thing, and a mode that showed the
    // controls without it would be choosing a region you cannot see.
    //
    // Alone among the two-mode tools, this one opens in View. The others are empty
    // when new — an image viewer with no picture, a QR code with nothing encoded —
    // so View would have been a blank square. A new map is already a map.
    //
    // The facts panel stays in both modes. It is what clicking a country is for,
    // and in a quiz it holds the question and the score; hiding it would leave View
    // able to ask nothing and answer nothing.
    authoring: {
        modes: ['split', 'render'],
        defaultMode: 'render',
        labels: { split: 'Edit' },
        titles: { split: 'The map, with the regions, projections and quiz' },
        source: '.map-toolbar',
        result: '.map-stage',
        onRender: 'mapOnRender'
    },
    contentType: 'html',
    onInit: 'mapInit',
    defaultWidth: 720,
    defaultHeight: 520,
    source: 'external'
});

console.log('Educational Tools plugin loaded (9 tools)');
