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
            maxNum: 12,
            halfMode: 'full',
            showHard: true,
            activeTab: 'grid',
            challengeDigits: new Set([1,2,3,4,5,6,7,8,9,10,11,12]),
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

    var html = '<table class="mult-table" style="font-size:' + fontSize + 'px;">';
    html += '<thead><tr>';
    html += '<th class="mult-row-header" style="width:' + cellSize + 'px;height:' + cellSize + 'px;">×</th>';
    for (var c = 1; c <= n; c++) {
        html += '<th style="width:' + cellSize + 'px;height:' + cellSize + 'px;">' + c + '</th>';
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

            html += '<td class="' + cls + '" style="width:' + cellSize + 'px;height:' + cellSize + 'px;">';
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
// SCRIPT INJECTION FOR HTML EXPORT
// =============================================

(function injectScriptsForExport() {
    if (document.getElementById('educational-tools-scripts')) return;

    var clockFunctions = [initClock, clockDrag, clockEndDrag, clockRender, clockSetNow, clockRandomize, clockClearChallenge, clockNewChallenge, clockCheckAnswer];
    var moneyFunctions = [moneyInit, moneyGetWidget, moneyRender, moneyAdd, moneyRemove, moneyClear, moneyTotal, moneyFormat, moneySetMode, moneyNewRound, moneyNewChallenge, moneyCheckAnswer, moneyNewChange, moneyNewNameit, moneyCheckNameit, moneyComputeOptimal, moneyNewLeast, moneyCheckLeast, moneyDragStart, moneyDragOver, moneyDragLeave, moneyDrop];
    var ptableFunctions = [ptableGetToolId, ptableGetWidget, ptableBuildGrid, ptableRender, ptableSelect, ptableSearch, ptableFilter, ptableInit];
    var sdtFunctions = [sdtGetToolId, sdtGetWidget, sdtInit, sdtSolveFor, sdtCalculate, sdtFormatNum, sdtClear, sdtKeydown];
    var multFunctions = [multGetToolId, multGetWidget, multInit, multSetTab, multRenderGrid, multSetMax, multSetHalf, multToggleHard, multRenderChallenge, multToggleDigit, multNextQuestion, multCheckAnswer, multSubmitChallenge, multUpdateScore, multNewChallenge];
    var allFunctions = clockFunctions.concat(moneyFunctions).concat(ptableFunctions).concat(sdtFunctions).concat(multFunctions);

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
    tools: ['analog-clock', 'money-counter', 'periodic-table', 'speed-distance-time', 'multiplication-table'],
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
                    '<option value="10">10 × 10</option>' +
                    '<option value="12" selected>12 × 12</option>' +
                    '<option value="15">15 × 15</option>' +
                    '<option value="20">20 × 20</option>' +
                '</select>' +
                '<button class="mult-half-btn active" onclick="multSetHalf(this,\'full\')">Full</button>' +
                '<button class="mult-half-btn" onclick="multSetHalf(this,\'upper\')">▲ Upper</button>' +
                '<button class="mult-half-btn" onclick="multSetHalf(this,\'lower\')">▼ Lower</button>' +
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

console.log('Educational Tools plugin loaded (5 tools)');
