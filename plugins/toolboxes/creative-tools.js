// Creative Tools Toolbox Plugin
// Contains Color Picker and Emoticon Picker

// Inject CSS styles for creative tools
(function() {
    if (document.getElementById('creative-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'creative-tools-styles';
    style.textContent = `
/* Color Picker Widget Styles */
.tool-content:has(.cpk-widget) { display: flex; flex-direction: column; }
.cpk-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 8px; }
.cpk-canvas-row { display: flex; gap: 8px; flex-shrink: 0; }
.cpk-wheel-wrap { position: relative; width: 180px; height: 180px; flex-shrink: 0; }
.cpk-wheel-canvas, .cpk-wheel-cursor { position: absolute; top: 0; left: 0; }
.cpk-wheel-canvas { border-radius: 50%; cursor: crosshair; }
.cpk-wheel-cursor { pointer-events: none; width: 12px; height: 12px; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 0 2px rgba(0,0,0,0.6); transform: translate(-8px, -8px); }
.cpk-sv-wrap { position: relative; flex: 1; min-width: 80px; height: 180px; }
.cpk-sv-canvas { width: 100%; height: 100%; border-radius: 4px; cursor: crosshair; }
.cpk-sv-cursor { position: absolute; pointer-events: none; width: 12px; height: 12px; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 0 2px rgba(0,0,0,0.6); transform: translate(-8px, -8px); }
.cpk-alpha-row { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.cpk-alpha-label { font-size: 11px; font-weight: 600; color: var(--text-heading); width: 14px; }
.cpk-alpha-track { position: relative; flex: 1; height: 16px; border-radius: 3px; cursor: pointer; overflow: hidden; border: 1px solid var(--border-color); }
.cpk-alpha-checker { position: absolute; inset: 0; background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%); background-size: 8px 8px; background-position: 0 0, 0 4px, 4px -4px, -4px 0; }
.cpk-alpha-gradient { position: absolute; inset: 0; }
.cpk-alpha-thumb { position: absolute; top: -1px; width: 6px; height: 18px; background: #fff; border: 1px solid #888; border-radius: 2px; transform: translateX(-3px); pointer-events: none; }
.cpk-alpha-input { width: 44px; padding: 3px 4px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; font-family: monospace; background: var(--input-bg); color: var(--text-primary); text-align: center; }
.cpk-alpha-input:focus { outline: none; border-color: #3498db; }
.cpk-preview-row { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.cpk-swatch { width: 40px; height: 40px; border-radius: 4px; border: 1px solid var(--border-color); position: relative; overflow: hidden; flex-shrink: 0; }
.cpk-swatch-checker { position: absolute; inset: 0; background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%); background-size: 10px 10px; background-position: 0 0, 0 5px, 5px -5px, -5px 0; }
.cpk-swatch-color { position: absolute; inset: 0; }
.cpk-values { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.cpk-val-row { display: flex; align-items: center; gap: 4px; }
.cpk-val-label { font-size: 10px; font-weight: 600; color: var(--text-secondary); width: 30px; flex-shrink: 0; }
.cpk-val-input { flex: 1; padding: 4px 6px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; font-family: monospace; background: var(--input-bg); color: var(--text-primary); min-width: 0; }
.cpk-val-input:focus { outline: none; border-color: #3498db; }
.cpk-copy-btn { padding: 3px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 10px; border-radius: 3px; flex-shrink: 0; }
.cpk-copy-btn:hover { background: var(--table-hover); }
.cpk-saved-row { display: flex; gap: 4px; flex-wrap: wrap; flex-shrink: 0; align-items: center; }
.cpk-saved-label { font-size: 10px; font-weight: 600; color: var(--text-secondary); }
.cpk-saved-swatch { width: 20px; height: 20px; border-radius: 3px; border: 1px solid var(--border-color); cursor: pointer; position: relative; overflow: hidden; }
.cpk-saved-swatch:hover { border-color: #3498db; }
.cpk-saved-checker { position: absolute; inset: 0; background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%); background-size: 6px 6px; background-position: 0 0, 0 3px, 3px -3px, -3px 0; }
.cpk-saved-color { position: absolute; inset: 0; }
.cpk-save-btn { width: 20px; height: 20px; border-radius: 3px; border: 1px dashed var(--border-color); background: var(--bg-tertiary); cursor: pointer; font-size: 14px; line-height: 18px; text-align: center; color: var(--text-muted); }
.cpk-save-btn:hover { border-color: #3498db; color: #3498db; }

/* Emoticon Picker Widget Styles */
.tool-content:has(.emote-widget) { display: flex; flex-direction: column; }
.emote-widget { padding: 8px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 6px; }
.emote-search { display: flex; gap: 6px; flex-shrink: 0; }
.emote-search input { flex: 1; padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); }
.emote-search input:focus { outline: none; border-color: #3498db; }
.emote-search input::placeholder { color: var(--text-muted); }
.emote-tabs { display: flex; gap: 2px; flex-shrink: 0; overflow-x: auto; }
.emote-tab { padding: 5px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-secondary); cursor: pointer; font-size: 11px; border-radius: 4px; white-space: nowrap; }
.emote-tab:hover { background: var(--table-hover); }
.emote-tab.active { background: #3498db; color: white; border-color: #3498db; }
.emote-grid-wrap { flex: 1; overflow-y: auto; min-height: 0; }
.emote-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(36px, 1fr)); gap: 2px; }
.emote-grid.kaomoji { grid-template-columns: 1fr; gap: 1px; }
.emote-cell { display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 4px; cursor: pointer; font-size: 22px; line-height: 1; user-select: none; aspect-ratio: 1; }
.emote-cell:hover { background: var(--table-hover); }
.emote-cell.copied { background: rgba(39, 174, 96, 0.2); }
.emote-grid.kaomoji .emote-cell { font-size: 13px; aspect-ratio: auto; padding: 6px 8px; justify-content: flex-start; font-family: monospace; }
.emote-category-label { grid-column: 1 / -1; font-size: 10px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 2px 2px; }
.emote-status { font-size: 10px; color: var(--text-muted); text-align: center; flex-shrink: 0; min-height: 16px; }
.emote-status.success { color: var(--success-text, #27ae60); }

/* Drawing Canvas Widget Styles */
.tool-content:has(.draw-widget) { display: flex; flex-direction: column; }
.draw-widget { padding: 0; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; }
.draw-toolbar { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; flex-wrap: wrap; }
.draw-swatch { width: 22px; height: 22px; border-radius: 4px; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; box-sizing: border-box; }
.draw-swatch:hover { border-color: var(--text-muted); }
.draw-swatch.active { border-color: #3498db; box-shadow: 0 0 0 1px #3498db; }
.draw-toolbar input[type="color"] { width: 22px; height: 22px; border: 1px solid var(--border-color); border-radius: 4px; padding: 0; cursor: pointer; background: none; flex-shrink: 0; }
.draw-toolbar input[type="range"] { width: 60px; flex-shrink: 0; }
.draw-toolbar .draw-size-label { font-size: 10px; color: var(--text-secondary); min-width: 20px; text-align: center; }
.draw-toolbar button { padding: 3px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 3px; flex-shrink: 0; }
.draw-toolbar button:hover { background: var(--table-hover); }
.draw-toolbar button.active { background: #3498db; color: white; border-color: #3498db; }
.draw-canvas-wrap { flex: 1; position: relative; min-height: 0; overflow: hidden; background-image: linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0; }
.draw-canvas { position: absolute; top: 0; left: 0; cursor: crosshair; touch-action: none; }
.draw-actions { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-top: 1px solid var(--border-color); flex-shrink: 0; }
.draw-actions button { padding: 4px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 3px; }
.draw-actions button:hover { background: var(--table-hover); }
.draw-actions .draw-status { flex: 1; text-align: right; font-size: 10px; color: var(--text-muted); }

/* Family Tree Widget Styles */
.tool-content:has(.ft-widget) { display: flex; flex-direction: column; }
.ft-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; }
.ft-toolbar { display: flex; gap: 6px; align-items: center; margin-bottom: 8px; flex-shrink: 0; flex-wrap: wrap; }
.ft-btn { padding: 5px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.ft-btn:hover { background: var(--table-hover); }
.ft-btn.primary { background: #27ae60; color: white; border-color: #27ae60; }
.ft-btn.primary:hover { background: #219a52; }
.ft-btn.danger { background: #e74c3c; color: white; border-color: #e74c3c; }
.ft-btn.danger:hover { background: #c0392b; }
.ft-btn.active { background: #3498db; color: white; border-color: #3498db; }
.ft-diagram { flex: 1; min-height: 120px; overflow: auto; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-tertiary); position: relative; }
.ft-diagram svg { display: block; }
.ft-node-rect { fill: var(--bg-primary); stroke: var(--border-color); stroke-width: 2; cursor: pointer; rx: 6; ry: 6; }
.ft-node-rect.male { stroke: #3498db; }
.ft-node-rect.female { stroke: #e91e8f; }
.ft-node-rect.other { stroke: #9b59b6; }
.ft-node-rect.selected { stroke-width: 3; }
.ft-node-rect.selected.male { fill: rgba(52, 152, 219, 0.1); }
.ft-node-rect.selected.female { fill: rgba(233, 30, 143, 0.1); }
.ft-node-rect.selected.other { fill: rgba(155, 89, 182, 0.1); }
.ft-node-name { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 600; fill: var(--text-primary); text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
.ft-node-years { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 9px; fill: var(--text-secondary); text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
.ft-conn-line { stroke: var(--text-secondary); stroke-width: 1.5; fill: none; }
.ft-partner-line { stroke: var(--text-secondary); stroke-width: 1.5; stroke-dasharray: 5, 3; fill: none; }
.ft-edit-panel { padding: 8px; border-top: 1px solid var(--border-color); flex-shrink: 0; }
.ft-edit-title { font-weight: 600; font-size: 11px; margin-bottom: 6px; color: var(--text-heading); }
.ft-edit-row { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; flex-wrap: wrap; }
.ft-edit-row label { font-size: 10px; color: var(--text-secondary); min-width: 40px; }
.ft-edit-row input, .ft-edit-row select { padding: 3px 6px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; background: var(--input-bg); color: var(--text-primary); }
.ft-edit-row input { flex: 1; min-width: 60px; }
.ft-edit-row select { min-width: 50px; }
.ft-edit-actions { display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap; }
.ft-text-editor { flex: 1; min-height: 100px; resize: none; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); line-height: 1.5; display: none; }
.ft-text-editor:focus { outline: none; border-color: #3498db; }
.ft-status { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-light); font-size: 11px; color: var(--text-muted); flex-shrink: 0; }
.ft-empty { padding: 30px; text-align: center; color: var(--text-muted); font-style: italic; }
.ft-form-editor { flex: 1; overflow-y: auto; min-height: 0; display: none; padding: 4px 0; }
.ft-form-card { border: 1px solid var(--border-color); border-radius: 6px; padding: 8px 10px; margin-bottom: 6px; background: var(--bg-primary); }
.ft-form-card.root { border-left: 3px solid #27ae60; }
.ft-form-header { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 11px; font-weight: 600; color: var(--text-heading); }
.ft-form-header .ft-form-icon { font-size: 14px; }
.ft-form-badge { font-size: 9px; font-weight: 700; background: #27ae60; color: white; padding: 1px 5px; border-radius: 3px; letter-spacing: 0.5px; }
.ft-form-fields { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; flex-wrap: wrap; }
.ft-form-fields input, .ft-form-fields select { padding: 3px 6px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; background: var(--input-bg); color: var(--text-primary); }
.ft-form-fields input:focus, .ft-form-fields select:focus { outline: none; border-color: #3498db; }
.ft-form-fields input[data-field="name"] { flex: 1; min-width: 80px; }
.ft-form-fields input[data-field="birthYear"], .ft-form-fields input[data-field="deathYear"] { width: 52px; }
.ft-form-fields select { min-width: 50px; }
.ft-form-rels { font-size: 10px; color: var(--text-secondary); margin-bottom: 6px; line-height: 1.5; }
.ft-form-rels span { color: var(--text-primary); font-weight: 500; }
.ft-form-actions { display: flex; gap: 4px; flex-wrap: wrap; }
.ft-form-actions button { padding: 2px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 10px; border-radius: 3px; }
.ft-form-actions button:hover { background: var(--table-hover); }
.ft-form-actions button:disabled { opacity: 0.4; cursor: default; }
.ft-form-actions button.danger { color: #e74c3c; border-color: #e74c3c; }
.ft-form-actions button.danger:hover { background: rgba(231, 76, 60, 0.1); }
`;
    document.head.appendChild(style);
})();

// =============================================
// COLOR PICKER
// =============================================

// ── Color conversion helpers ──

function cpkHsvToRgb(h, s, v) {
    h = ((h % 360) + 360) % 360;
    const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
    let r, g, b;
    if (h < 60)       { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else               { r = c; g = 0; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function cpkRgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0, s = max === 0 ? 0 : d / max, v = max;
    if (d !== 0) {
        if (max === r) h = 60 * (((g - b) / d) % 6);
        else if (max === g) h = 60 * ((b - r) / d + 2);
        else h = 60 * ((r - g) / d + 4);
    }
    if (h < 0) h += 360;
    return [h, s, v];
}

function cpkRgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0, s = 0, l = (max + min) / 2;
    if (d !== 0) {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = 60 * (((g - b) / d) % 6);
        else if (max === g) h = 60 * ((b - r) / d + 2);
        else h = 60 * ((r - g) / d + 4);
    }
    if (h < 0) h += 360;
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function cpkHslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
    let r, g, b;
    if (h < 60)       { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else               { r = c; g = 0; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

// ── State per widget ──

const _cpkState = new WeakMap();

function cpkGetState(widget) {
    if (!_cpkState.has(widget)) {
        _cpkState.set(widget, { h: 0, s: 1, v: 1, a: 1, saved: [] });
    }
    return _cpkState.get(widget);
}

// ── Drawing ──

function cpkDrawWheel(widget) {
    const canvas = widget.querySelector('.cpk-wheel-canvas');
    const ctx = canvas.getContext('2d');
    const cx = 90, cy = 90, outerR = 88, innerR = 62;
    ctx.clearRect(0, 0, 180, 180);
    for (let angle = 0; angle < 360; angle += 0.5) {
        const rad1 = (angle - 0.5) * Math.PI / 180;
        const rad2 = (angle + 1) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(cx + innerR * Math.cos(rad1), cy + innerR * Math.sin(rad1));
        ctx.lineTo(cx + outerR * Math.cos(rad1), cy + outerR * Math.sin(rad1));
        ctx.arc(cx, cy, outerR, rad1, rad2);
        ctx.lineTo(cx + innerR * Math.cos(rad2), cy + innerR * Math.sin(rad2));
        ctx.arc(cx, cy, innerR, rad2, rad1, true);
        ctx.closePath();
        ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
        ctx.fill();
    }
}

function cpkDrawSV(widget) {
    const st = cpkGetState(widget);
    const canvas = widget.querySelector('.cpk-sv-canvas');
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = Math.max(rect.width, 80);
    const h = 180;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    // White-to-hue horizontal
    const gradH = ctx.createLinearGradient(0, 0, w, 0);
    gradH.addColorStop(0, '#fff');
    gradH.addColorStop(1, `hsl(${st.h}, 100%, 50%)`);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, w, h);
    // Transparent-to-black vertical
    const gradV = ctx.createLinearGradient(0, 0, 0, h);
    gradV.addColorStop(0, 'rgba(0,0,0,0)');
    gradV.addColorStop(1, '#000');
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, w, h);
}

function cpkUpdateCursors(widget) {
    const st = cpkGetState(widget);
    // Wheel cursor
    const wheelCursor = widget.querySelector('.cpk-wheel-cursor');
    const midR = 75;
    const rad = st.h * Math.PI / 180;
    wheelCursor.style.left = (90 + midR * Math.cos(rad)) + 'px';
    wheelCursor.style.top = (90 + midR * Math.sin(rad)) + 'px';
    // SV cursor
    const svCanvas = widget.querySelector('.cpk-sv-canvas');
    const svCursor = widget.querySelector('.cpk-sv-cursor');
    svCursor.style.left = (st.s * svCanvas.width) + 'px';
    svCursor.style.top = ((1 - st.v) * 180) + 'px';
}

function cpkUpdateAlpha(widget) {
    const st = cpkGetState(widget);
    const [r, g, b] = cpkHsvToRgb(st.h, st.s, st.v);
    const grad = widget.querySelector('.cpk-alpha-gradient');
    grad.style.background = `linear-gradient(to right, rgba(${r},${g},${b},0), rgba(${r},${g},${b},1))`;
    const thumb = widget.querySelector('.cpk-alpha-thumb');
    const track = widget.querySelector('.cpk-alpha-track');
    thumb.style.left = (st.a * (track.offsetWidth - 2)) + 'px';
    widget.querySelector('.cpk-alpha-input').value = Math.round(st.a * 100) + '%';
}

function cpkUpdateValues(widget) {
    const st = cpkGetState(widget);
    const [r, g, b] = cpkHsvToRgb(st.h, st.s, st.v);
    const [hh, ss, ll] = cpkRgbToHsl(r, g, b);
    // Swatch
    widget.querySelector('.cpk-swatch-color').style.background = `rgba(${r},${g},${b},${st.a})`;
    // Hex
    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    const hexA = st.a < 1 ? Math.round(st.a * 255).toString(16).padStart(2, '0') : '';
    widget.querySelector('.cpk-hex-input').value = `#${hexR}${hexG}${hexB}${hexA}`.toUpperCase();
    // RGBA
    const aRound = Math.round(st.a * 100) / 100;
    widget.querySelector('.cpk-rgba-input').value = st.a < 1
        ? `rgba(${r}, ${g}, ${b}, ${aRound})`
        : `rgb(${r}, ${g}, ${b})`;
    // HSLA
    widget.querySelector('.cpk-hsla-input').value = st.a < 1
        ? `hsla(${hh}, ${ss}%, ${ll}%, ${aRound})`
        : `hsl(${hh}, ${ss}%, ${ll}%)`;
}

function cpkFullUpdate(widget) {
    cpkDrawSV(widget);
    cpkUpdateCursors(widget);
    cpkUpdateAlpha(widget);
    cpkUpdateValues(widget);
}

// ── Interaction ──

function cpkWheelEvent(widget, e) {
    const canvas = widget.querySelector('.cpk-wheel-canvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 90;
    const y = e.clientY - rect.top - 90;
    const st = cpkGetState(widget);
    st.h = ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
    cpkFullUpdate(widget);
}

function cpkSVEvent(widget, e) {
    const canvas = widget.querySelector('.cpk-sv-canvas');
    const rect = canvas.getBoundingClientRect();
    const st = cpkGetState(widget);
    st.s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    st.v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    cpkUpdateCursors(widget);
    cpkUpdateAlpha(widget);
    cpkUpdateValues(widget);
}

function cpkAlphaEvent(widget, e) {
    const track = widget.querySelector('.cpk-alpha-track');
    const rect = track.getBoundingClientRect();
    const st = cpkGetState(widget);
    st.a = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    cpkUpdateAlpha(widget);
    cpkUpdateValues(widget);
}

function cpkMakeDraggable(widget, selector, handler) {
    const el = widget.querySelector(selector);
    const onMove = (e) => { e.preventDefault(); handler(widget, e); };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        handler(widget, e);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });
}

// ── Input handlers ──

function cpkHexTyped(input) {
    const widget = input.closest('.cpk-widget');
    const val = input.value.trim().replace(/^#/, '');
    let r, g, b, a = 1;
    if (/^[0-9a-f]{6}$/i.test(val)) {
        r = parseInt(val.slice(0, 2), 16); g = parseInt(val.slice(2, 4), 16); b = parseInt(val.slice(4, 6), 16);
    } else if (/^[0-9a-f]{8}$/i.test(val)) {
        r = parseInt(val.slice(0, 2), 16); g = parseInt(val.slice(2, 4), 16); b = parseInt(val.slice(4, 6), 16);
        a = parseInt(val.slice(6, 8), 16) / 255;
    } else if (/^[0-9a-f]{3}$/i.test(val)) {
        r = parseInt(val[0] + val[0], 16); g = parseInt(val[1] + val[1], 16); b = parseInt(val[2] + val[2], 16);
    } else return;
    const st = cpkGetState(widget);
    [st.h, st.s, st.v] = cpkRgbToHsv(r, g, b);
    st.a = a;
    cpkDrawSV(widget); cpkUpdateCursors(widget); cpkUpdateAlpha(widget);
    // Update other fields but not hex
    const [rr, gg, bb] = cpkHsvToRgb(st.h, st.s, st.v);
    const [hh, ss, ll] = cpkRgbToHsl(rr, gg, bb);
    const aRound = Math.round(st.a * 100) / 100;
    widget.querySelector('.cpk-swatch-color').style.background = `rgba(${rr},${gg},${bb},${st.a})`;
    widget.querySelector('.cpk-rgba-input').value = st.a < 1 ? `rgba(${rr}, ${gg}, ${bb}, ${aRound})` : `rgb(${rr}, ${gg}, ${bb})`;
    widget.querySelector('.cpk-hsla-input').value = st.a < 1 ? `hsla(${hh}, ${ss}%, ${ll}%, ${aRound})` : `hsl(${hh}, ${ss}%, ${ll}%)`;
}

function cpkRgbaTyped(input) {
    const widget = input.closest('.cpk-widget');
    const m = input.value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/i);
    if (!m) return;
    const r = Math.min(255, parseInt(m[1])), g = Math.min(255, parseInt(m[2])), b = Math.min(255, parseInt(m[3]));
    const a = m[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(m[4]))) : 1;
    const st = cpkGetState(widget);
    [st.h, st.s, st.v] = cpkRgbToHsv(r, g, b);
    st.a = a;
    cpkDrawSV(widget); cpkUpdateCursors(widget); cpkUpdateAlpha(widget);
    const hexR = r.toString(16).padStart(2, '0'), hexG = g.toString(16).padStart(2, '0'), hexB = b.toString(16).padStart(2, '0');
    const hexA = st.a < 1 ? Math.round(st.a * 255).toString(16).padStart(2, '0') : '';
    widget.querySelector('.cpk-swatch-color').style.background = `rgba(${r},${g},${b},${st.a})`;
    widget.querySelector('.cpk-hex-input').value = `#${hexR}${hexG}${hexB}${hexA}`.toUpperCase();
    const [hh, ss, ll] = cpkRgbToHsl(r, g, b);
    const aRound = Math.round(st.a * 100) / 100;
    widget.querySelector('.cpk-hsla-input').value = st.a < 1 ? `hsla(${hh}, ${ss}%, ${ll}%, ${aRound})` : `hsl(${hh}, ${ss}%, ${ll}%)`;
}

function cpkHslaTyped(input) {
    const widget = input.closest('.cpk-widget');
    const m = input.value.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*(?:,\s*([\d.]+))?\s*\)/i);
    if (!m) return;
    const h = parseInt(m[1]) % 360, s = Math.min(100, parseInt(m[2])), l = Math.min(100, parseInt(m[3]));
    const a = m[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(m[4]))) : 1;
    const [r, g, b] = cpkHslToRgb(h, s, l);
    const st = cpkGetState(widget);
    [st.h, st.s, st.v] = cpkRgbToHsv(r, g, b);
    st.a = a;
    cpkDrawSV(widget); cpkUpdateCursors(widget); cpkUpdateAlpha(widget);
    widget.querySelector('.cpk-swatch-color').style.background = `rgba(${r},${g},${b},${st.a})`;
    const hexR = r.toString(16).padStart(2, '0'), hexG = g.toString(16).padStart(2, '0'), hexB = b.toString(16).padStart(2, '0');
    const hexA = st.a < 1 ? Math.round(st.a * 255).toString(16).padStart(2, '0') : '';
    widget.querySelector('.cpk-hex-input').value = `#${hexR}${hexG}${hexB}${hexA}`.toUpperCase();
    const aRound = Math.round(st.a * 100) / 100;
    widget.querySelector('.cpk-rgba-input').value = st.a < 1 ? `rgba(${r}, ${g}, ${b}, ${aRound})` : `rgb(${r}, ${g}, ${b})`;
}

function cpkAlphaTyped(input) {
    const widget = input.closest('.cpk-widget');
    const val = parseFloat(input.value.replace('%', ''));
    if (isNaN(val)) return;
    const st = cpkGetState(widget);
    st.a = Math.max(0, Math.min(1, val / 100));
    cpkUpdateAlpha(widget);
    cpkUpdateValues(widget);
}

function cpkCopyVal(btn) {
    const input = btn.previousElementSibling;
    navigator.clipboard.writeText(input.value).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = orig, 800);
    });
}

function cpkSaveColor(btn) {
    const widget = btn.closest('.cpk-widget');
    const st = cpkGetState(widget);
    const [r, g, b] = cpkHsvToRgb(st.h, st.s, st.v);
    const color = { r, g, b, a: st.a, h: st.h, s: st.s, v: st.v };
    st.saved.push(color);
    const swatch = document.createElement('div');
    swatch.className = 'cpk-saved-swatch';
    swatch.title = widget.querySelector('.cpk-hex-input').value;
    swatch.innerHTML = `<div class="cpk-saved-checker"></div><div class="cpk-saved-color" style="background:rgba(${r},${g},${b},${st.a})"></div>`;
    swatch.onclick = () => {
        st.h = color.h; st.s = color.s; st.v = color.v; st.a = color.a;
        cpkFullUpdate(widget);
    };
    btn.parentElement.insertBefore(swatch, btn);
}

function cpkInit() {
    document.querySelectorAll('.cpk-widget').forEach(widget => {
        const st = cpkGetState(widget);
        st.h = 210; st.s = 0.8; st.v = 0.9; st.a = 1;

        cpkDrawWheel(widget);
        cpkFullUpdate(widget);

        cpkMakeDraggable(widget, '.cpk-wheel-canvas', cpkWheelEvent);
        cpkMakeDraggable(widget, '.cpk-sv-canvas', cpkSVEvent);
        cpkMakeDraggable(widget, '.cpk-alpha-track', cpkAlphaEvent);
    });
}

// =============================================
// EMOTICON PICKER
// =============================================

// Emoji/emoticon data
const EMOTE_DATA = {
    'Smileys': [
        ['\uD83D\uDE00','grinning'],['\uD83D\uDE03','smiley'],['\uD83D\uDE04','smile'],['\uD83D\uDE01','grin'],['\uD83D\uDE06','laughing'],['\uD83D\uDE05','sweat smile'],['\uD83E\uDD23','rofl'],['\uD83D\uDE02','joy'],
        ['\uD83D\uDE42','slightly smiling'],['\uD83D\uDE43','upside down'],['\uD83D\uDE09','wink'],['\uD83D\uDE0A','blush'],['\uD83D\uDE07','innocent'],['\uD83E\uDD70','love face'],['\uD83D\uDE0D','heart eyes'],
        ['\uD83E\uDD29','star struck'],['\uD83D\uDE18','kiss'],['\uD83D\uDE17','kissing'],['\uD83D\uDE1A','kissing closed'],['\uD83D\uDE19','kissing smiling'],['\uD83E\uDD72','smile tear'],
        ['\uD83D\uDE0B','yum'],['\uD83D\uDE1B','tongue'],['\uD83D\uDE1C','wink tongue'],['\uD83E\uDD2A','zany'],['\uD83D\uDE1D','squinting tongue'],['\uD83E\uDD11','money face'],['\uD83E\uDD17','hugging'],
        ['\uD83E\uDD2D','hand over mouth'],['\uD83E\uDD2B','shushing'],['\uD83E\uDD14','thinking'],['\uD83E\uDEE1','salute'],['\uD83E\uDD10','zipper mouth'],['\uD83E\uDD28','raised brow'],
        ['\uD83D\uDE10','neutral'],['\uD83D\uDE11','expressionless'],['\uD83D\uDE36','no mouth'],['\uD83E\uDEE5','dotted line'],['\uD83D\uDE0F','smirk'],['\uD83D\uDE12','unamused'],
        ['\uD83D\uDE44','eye roll'],['\uD83D\uDE2C','grimacing'],['\uD83E\uDD25','lying'],['\uD83D\uDE0C','relieved'],['\uD83D\uDE14','pensive'],['\uD83D\uDE2A','sleepy'],['\uD83E\uDD24','drooling'],
        ['\uD83D\uDE34','sleeping'],['\uD83D\uDE37','mask'],['\uD83E\uDD12','thermometer'],['\uD83E\uDD15','bandage'],['\uD83E\uDD22','nauseated'],['\uD83E\uDD2E','vomiting'],['\uD83E\uDD75','hot'],
        ['\uD83E\uDD76','cold'],['\uD83E\uDD74','woozy'],['\uD83D\uDE35','dizzy'],['\uD83E\uDD2F','exploding head'],['\uD83E\uDD73','party'],['\uD83E\uDD78','disguised'],['\uD83D\uDE0E','sunglasses cool'],
        ['\uD83E\uDD13','nerd'],['\uD83E\uDDD0','monocle'],['\uD83D\uDE15','confused'],['\uD83E\uDEE4','diagonal mouth'],['\uD83D\uDE1F','worried'],['\uD83D\uDE41','frowning'],['\uD83D\uDE2E','open mouth'],
        ['\uD83D\uDE2F','hushed'],['\uD83D\uDE32','astonished'],['\uD83D\uDE33','flushed'],['\uD83E\uDD7A','pleading'],['\uD83E\uDD79','holding back tears'],['\uD83D\uDE26','frowning open'],
        ['\uD83D\uDE27','anguished'],['\uD83D\uDE28','fearful'],['\uD83D\uDE30','anxious sweat'],['\uD83D\uDE25','sad relieved'],['\uD83D\uDE22','crying'],['\uD83D\uDE2D','sobbing'],
        ['\uD83D\uDE31','screaming'],['\uD83D\uDE16','confounded'],['\uD83D\uDE23','persevering'],['\uD83D\uDE1E','disappointed'],['\uD83D\uDE13','downcast sweat'],['\uD83D\uDE29','weary'],
        ['\uD83D\uDE2B','tired'],['\uD83E\uDD71','yawning'],['\uD83D\uDE24','triumph huff'],['\uD83D\uDE21','angry'],['\uD83D\uDE20','mad'],['\uD83E\uDD2C','swearing'],['\uD83D\uDC7F','imp'],['\uD83D\uDC80','skull'],
        ['\uD83D\uDCA9','poop'],['\uD83E\uDD21','clown'],['\uD83D\uDC79','ogre'],['\uD83D\uDC7A','goblin'],['\uD83D\uDC7B','ghost'],['\uD83D\uDC7D','alien'],['\uD83D\uDC7E','space invader'],['\uD83E\uDD16','robot']
    ],
    'Gestures': [
        ['\uD83D\uDC4B','wave'],['\uD83E\uDD1A','raised back hand'],['\uD83D\uDD90\uFE0F','hand fingers'],['\u270B','raised hand'],['\uD83D\uDD96','vulcan'],['\uD83E\uDEF1','right hand'],
        ['\uD83E\uDEF2','left hand'],['\uD83E\uDEF3','palm down'],['\uD83E\uDEF4','palm up'],['\uD83E\uDEF7','push left'],['\uD83E\uDEF8','push right'],
        ['\uD83D\uDC4C','ok hand'],['\uD83E\uDD0C','pinched'],['\uD83E\uDD0F','pinching'],['\u270C\uFE0F','peace victory'],['\uD83E\uDD1E','crossed fingers'],['\uD83E\uDEF0','love you'],
        ['\uD83E\uDD1F','love gesture'],['\uD83E\uDD18','rock on'],['\uD83E\uDD19','call me'],['\uD83D\uDC48','point left'],['\uD83D\uDC49','point right'],['\uD83D\uDC46','point up'],
        ['\uD83D\uDC47','point down'],['\u261D\uFE0F','index up'],['\uD83E\uDEF5','point at you'],['\uD83D\uDC4D','thumbs up'],['\uD83D\uDC4E','thumbs down'],['\u270A','fist'],
        ['\uD83D\uDC4A','punch'],['\uD83E\uDD1B','left fist'],['\uD83E\uDD1C','right fist'],['\uD83D\uDC4F','clap'],['\uD83D\uDE4C','raised hands'],['\uD83E\uDEF6','heart hands'],
        ['\uD83D\uDC50','open hands'],['\uD83E\uDD32','palms up'],['\uD83E\uDD1D','handshake'],['\uD83D\uDE4F','pray please'],['\uD83D\uDCAA','flexed bicep'],['\uD83E\uDDBE','mechanical arm'],
        ['\uD83D\uDD95','middle finger'],['\u270D\uFE0F','writing'],['\uD83E\uDD33','selfie'],['\uD83D\uDC85','nail polish']
    ],
    'Hearts': [
        ['\u2764\uFE0F','red heart'],['\uD83E\uDDE1','orange heart'],['\uD83D\uDC9B','yellow heart'],['\uD83D\uDC9A','green heart'],['\uD83D\uDC99','blue heart'],['\uD83D\uDC9C','purple heart'],
        ['\uD83D\uDDA4','black heart'],['\uD83E\uDD0D','white heart'],['\uD83E\uDD0E','brown heart'],['\uD83D\uDC94','broken heart'],['\u2764\uFE0F\u200D\uD83D\uDD25','fire heart'],['\u2764\uFE0F\u200D\uD83E\uDE79','mending heart'],
        ['\u2763\uFE0F','exclamation heart'],['\uD83D\uDC95','two hearts'],['\uD83D\uDC9E','revolving hearts'],['\uD83D\uDC93','beating heart'],['\uD83D\uDC97','growing heart'],
        ['\uD83D\uDC96','sparkling heart'],['\uD83D\uDC98','arrow heart cupid'],['\uD83D\uDC9D','ribbon heart'],['\uD83D\uDC9F','heart decoration'],['\u2665\uFE0F','heart suit'],
        ['\uD83E\uDEC0','anatomical heart'],['\uD83D\uDC8C','love letter'],['\uD83D\uDC8B','kiss mark'],['\uD83D\uDC8D','ring'],['\uD83D\uDC8E','gem diamond']
    ],
    'Animals': [
        ['\uD83D\uDC36','dog'],['\uD83D\uDC31','cat'],['\uD83D\uDC2D','mouse'],['\uD83D\uDC39','hamster'],['\uD83D\uDC30','rabbit'],['\uD83E\uDD8A','fox'],['\uD83D\uDC3B','bear'],['\uD83D\uDC3C','panda'],
        ['\uD83D\uDC3B\u200D\u2744\uFE0F','polar bear'],['\uD83D\uDC28','koala'],['\uD83D\uDC2F','tiger'],['\uD83E\uDD81','lion'],['\uD83D\uDC2E','cow'],['\uD83D\uDC37','pig'],['\uD83D\uDC38','frog'],['\uD83D\uDC35','monkey'],
        ['\uD83D\uDE48','see no evil'],['\uD83D\uDE49','hear no evil'],['\uD83D\uDE4A','speak no evil'],['\uD83D\uDC14','chicken'],['\uD83D\uDC27','penguin'],['\uD83D\uDC26','bird'],
        ['\uD83E\uDD86','duck'],['\uD83E\uDD85','eagle'],['\uD83E\uDD89','owl'],['\uD83E\uDD87','bat'],['\uD83D\uDC3A','wolf'],['\uD83D\uDC17','boar'],['\uD83D\uDC34','horse'],['\uD83E\uDD84','unicorn'],
        ['\uD83D\uDC1D','bee'],['\uD83E\uDEB1','worm'],['\uD83D\uDC1B','bug'],['\uD83E\uDD8B','butterfly'],['\uD83D\uDC0C','snail'],['\uD83D\uDC1E','ladybug'],['\uD83D\uDC1C','ant'],['\uD83E\uDEB0','fly'],
        ['\uD83D\uDC22','turtle'],['\uD83D\uDC0D','snake'],['\uD83E\uDD8E','lizard'],['\uD83E\uDD82','scorpion'],['\uD83E\uDD80','crab'],['\uD83E\uDD91','squid'],['\uD83D\uDC19','octopus'],
        ['\uD83D\uDC20','tropical fish'],['\uD83D\uDC1F','fish'],['\uD83D\uDC21','blowfish'],['\uD83D\uDC2C','dolphin'],['\uD83D\uDC33','whale'],['\uD83D\uDC0B','whale2'],['\uD83E\uDD88','shark'],
        ['\uD83D\uDC0A','crocodile'],['\uD83D\uDC05','tiger2'],['\uD83D\uDC06','leopard'],['\uD83E\uDD93','zebra'],['\uD83E\uDD8D','gorilla'],['\uD83D\uDC18','elephant'],['\uD83E\uDD8F','rhino'],
        ['\uD83E\uDD9B','hippo'],['\uD83D\uDC2A','camel'],['\uD83D\uDC2B','camel2'],['\uD83E\uDD92','giraffe'],['\uD83E\uDD98','kangaroo'],['\uD83D\uDC03','water buffalo'],
        ['\uD83E\uDD9C','bison'],['\uD83D\uDC02','ox'],['\uD83D\uDC04','cow2'],['\uD83D\uDC0E','racehorse'],['\uD83D\uDC16','pig2'],['\uD83D\uDC0F','ram'],['\uD83D\uDC11','sheep'],['\uD83E\uDD99','llama'],
        ['\uD83D\uDC10','goat'],['\uD83E\uDD8C','deer'],['\uD83D\uDC15','dog2'],['\uD83D\uDC29','poodle'],['\uD83D\uDC08','cat2'],['\uD83D\uDC13','rooster'],['\uD83E\uDD83','turkey'],['\uD83E\uDD86','dodo'],
        ['\uD83E\uDD9A','peacock'],['\uD83E\uDD9C','parrot'],['\uD83E\uDD9A','swan'],['\uD83E\uDDA9','flamingo'],['\uD83D\uDC07','rabbit2'],['\uD83D\uDC01','mouse2'],['\uD83D\uDC00','rat'],
        ['\uD83D\uDC3F\uFE0F','chipmunk'],['\uD83E\uDD94','hedgehog']
    ],
    'Food': [
        ['\uD83C\uDF4E','apple'],['\uD83C\uDF50','pear'],['\uD83C\uDF4A','orange tangerine'],['\uD83C\uDF4B','lemon'],['\uD83C\uDF4C','banana'],['\uD83C\uDF49','watermelon'],['\uD83C\uDF47','grapes'],
        ['\uD83C\uDF53','strawberry'],['\uD83E\uDED0','blueberry'],['\uD83C\uDF48','melon'],['\uD83C\uDF52','cherry'],['\uD83C\uDF51','peach'],['\uD83E\uDD6D','mango'],['\uD83C\uDF4D','pineapple'],
        ['\uD83E\uDD65','coconut'],['\uD83E\uDD5D','kiwi'],['\uD83C\uDF45','tomato'],['\uD83E\uDD51','avocado'],['\uD83C\uDF46','eggplant'],['\uD83C\uDF36\uFE0F','pepper'],['\uD83E\uDED1','bell pepper'],
        ['\uD83E\uDD52','cucumber'],['\uD83E\uDD6C','leafy green'],['\uD83E\uDD66','broccoli'],['\uD83E\uDDC4','garlic'],['\uD83E\uDDC5','onion'],['\uD83E\uDD54','potato'],['\uD83C\uDF60','sweet potato'],
        ['\uD83E\uDD50','croissant'],['\uD83E\uDD56','baguette'],['\uD83C\uDF5E','bread'],['\uD83E\uDD68','pretzel'],['\uD83E\uDDC0','cheese'],['\uD83E\uDD5A','egg'],['\uD83C\uDF73','fried egg'],
        ['\uD83E\uDD53','bacon'],['\uD83E\uDD69','steak'],['\uD83C\uDF57','drumstick'],['\uD83C\uDF56','meat bone'],['\uD83C\uDF2D','hot dog'],['\uD83C\uDF54','hamburger'],['\uD83C\uDF5F','fries'],
        ['\uD83C\uDF55','pizza'],['\uD83E\uDD6A','sandwich'],['\uD83C\uDF2E','taco'],['\uD83C\uDF2F','burrito'],['\uD83E\uDED4','tamale'],['\uD83E\uDD57','salad'],['\uD83C\uDF5D','spaghetti'],
        ['\uD83C\uDF5C','ramen noodle'],['\uD83C\uDF72','stew'],['\uD83C\uDF5B','curry'],['\uD83C\uDF63','sushi'],['\uD83C\uDF71','bento'],['\uD83E\uDD5F','dumpling'],['\uD83C\uDF64','shrimp'],
        ['\uD83C\uDF59','rice ball'],['\uD83C\uDF5A','rice'],['\uD83C\uDF58','rice cracker'],['\uD83C\uDF65','fish cake'],['\uD83E\uDD6E','moon cake'],['\uD83C\uDF61','dango'],
        ['\uD83E\uDDC1','cupcake'],['\uD83C\uDF70','cake'],['\uD83C\uDF82','birthday cake'],['\uD83C\uDF6E','custard'],['\uD83C\uDF6D','lollipop'],['\uD83C\uDF6C','candy'],['\uD83C\uDF6B','chocolate'],
        ['\uD83C\uDF7F','popcorn'],['\uD83C\uDF69','donut'],['\uD83C\uDF6A','cookie'],['\uD83E\uDD5B','milk'],['\u2615','coffee'],['\uD83C\uDF75','tea'],['\uD83E\uDDC3','juice box'],
        ['\uD83E\uDD64','cup straw'],['\uD83E\uDDCB','boba bubble tea'],['\uD83C\uDF7A','beer'],['\uD83C\uDF7B','beers cheers'],['\uD83E\uDD42','champagne'],['\uD83C\uDF77','wine'],
        ['\uD83C\uDF78','cocktail martini'],['\uD83C\uDF79','tropical drink'],['\uD83E\uDDCA','ice']
    ],
    'Travel': [
        ['\uD83D\uDE97','car'],['\uD83D\uDE95','taxi'],['\uD83D\uDE8C','bus'],['\uD83D\uDE8E','trolley'],['\uD83D\uDE90','minibus'],['\uD83D\uDE91','ambulance'],['\uD83D\uDE92','fire engine'],
        ['\uD83D\uDE93','police car'],['\uD83C\uDFCE\uFE0F','race car'],['\uD83D\uDEB2','bicycle'],['\uD83D\uDEF5','scooter'],['\uD83C\uDFCD\uFE0F','motorcycle'],['\u2708\uFE0F','airplane'],
        ['\uD83D\uDE80','rocket'],['\uD83D\uDEF8','ufo'],['\uD83D\uDE81','helicopter'],['\u26F5','sailboat'],['\uD83D\uDEA2','ship'],['\uD83D\uDE82','train'],['\uD83D\uDE8A','tram'],
        ['\uD83C\uDFE0','house'],['\uD83C\uDFE2','office'],['\uD83C\uDFE5','hospital'],['\uD83C\uDFEB','school'],['\uD83C\uDFF0','castle'],['\u26EA','church'],['\uD83D\uDD4C','mosque'],
        ['\uD83D\uDDFC','tokyo tower'],['\uD83D\uDDFD','statue liberty'],['\uD83C\uDF09','bridge night'],['\uD83C\uDFD6\uFE0F','beach'],['\uD83C\uDFD4\uFE0F','mountain snow'],['\u26F0\uFE0F','mountain'],
        ['\uD83C\uDF0B','volcano'],['\uD83D\uDDFB','mount fuji'],['\uD83C\uDFD5\uFE0F','camping'],['\uD83C\uDF05','sunrise'],['\uD83C\uDF04','sunrise mountains'],['\uD83C\uDF20','shooting star'],
        ['\uD83C\uDF86','fireworks'],['\uD83C\uDF87','sparkler'],['\uD83C\uDF0D','earth africa'],['\uD83C\uDF0E','earth americas'],['\uD83C\uDF0F','earth asia'],['\uD83C\uDF19','crescent moon'],
        ['\u2B50','star'],['\uD83C\uDF1F','glowing star'],['\u2728','sparkles'],['\u2600\uFE0F','sun'],['\uD83C\uDF24\uFE0F','partly sunny'],['\u26C5','partly cloudy'],
        ['\uD83C\uDF27\uFE0F','rain'],['\u26C8\uFE0F','thunderstorm'],['\u2744\uFE0F','snowflake'],['\uD83C\uDF08','rainbow']
    ],
    'Objects': [
        ['\u231A','watch'],['\uD83D\uDCF1','phone'],['\uD83D\uDCBB','laptop'],['\u2328\uFE0F','keyboard'],['\uD83D\uDDA5\uFE0F','desktop'],['\uD83D\uDDA8\uFE0F','printer'],['\uD83D\uDDB1\uFE0F','mouse'],
        ['\uD83D\uDCBE','floppy disk'],['\uD83D\uDCBF','cd'],['\uD83D\uDCC0','dvd'],['\uD83D\uDCF7','camera'],['\uD83D\uDCF9','video camera'],['\uD83C\uDFA5','movie camera'],['\uD83D\uDCFA','tv'],
        ['\uD83D\uDCFB','radio'],['\uD83C\uDF99\uFE0F','microphone'],['\uD83C\uDFA7','headphones'],['\uD83D\uDD14','bell'],['\uD83D\uDCE2','loudspeaker'],['\uD83D\uDCE3','megaphone'],
        ['\uD83D\uDCA1','lightbulb idea'],['\uD83D\uDD26','flashlight'],['\uD83D\uDD6F\uFE0F','candle'],['\uD83D\uDD11','key'],['\uD83D\uDDDD\uFE0F','old key'],['\uD83D\uDD12','lock'],['\uD83D\uDD13','unlock'],
        ['\uD83D\uDEE0\uFE0F','tools hammer wrench'],['\uD83D\uDD27','wrench'],['\uD83D\uDD28','hammer'],['\u2699\uFE0F','gear'],['\uD83E\uDDF2','magnet'],['\uD83D\uDD2C','microscope'],
        ['\uD83D\uDD2D','telescope'],['\uD83D\uDCE1','satellite'],['\uD83D\uDC89','syringe'],['\uD83D\uDC8A','pill'],['\uD83E\uDE79','bandaid'],['\uD83E\uDDEC','dna'],['\uD83E\uDDEA','test tube'],
        ['\uD83D\uDCE6','package box'],['\uD83D\uDCEB','mailbox'],['\uD83D\uDCDD','memo note'],['\uD83D\uDCC1','folder'],['\uD83D\uDCC2','open folder'],['\uD83D\uDCCC','pin'],['\uD83D\uDCCE','paperclip'],
        ['\u2702\uFE0F','scissors'],['\uD83D\uDD8A\uFE0F','pen'],['\u270F\uFE0F','pencil'],['\uD83D\uDCCF','ruler'],['\uD83D\uDCD0','triangle ruler'],['\uD83D\uDDD1\uFE0F','trash wastebasket'],
        ['\uD83D\uDCB0','money bag'],['\uD83D\uDCB5','dollar'],['\uD83D\uDCB4','yen'],['\uD83D\uDCB6','euro'],['\uD83D\uDCB7','pound'],['\uD83E\uDE99','coin'],['\uD83D\uDCB3','credit card'],
        ['\uD83C\uDF81','gift present'],['\uD83C\uDF88','balloon'],['\uD83C\uDF89','party popper'],['\uD83C\uDF8A','confetti'],['\uD83C\uDFC6','trophy'],['\uD83E\uDD47','gold medal'],
        ['\uD83E\uDD48','silver medal'],['\uD83E\uDD49','bronze medal'],['\u26BD','soccer'],['\uD83C\uDFC0','basketball'],['\uD83C\uDFC8','football'],['\u26BE','baseball'],
        ['\uD83C\uDFBE','tennis'],['\uD83C\uDFAE','game controller'],['\uD83C\uDFB2','dice'],['\uD83C\uDFAF','bullseye dart'],['\uD83E\uDDE9','puzzle piece'],['\u265F\uFE0F','chess']
    ],
    'Symbols': [
        ['\u2705','check mark'],['\u274C','cross mark'],['\u2753','question'],['\u2757','exclamation'],['\u203C\uFE0F','double exclamation'],['\u2049\uFE0F','exclamation question'],
        ['\u26A0\uFE0F','warning'],['\uD83D\uDEAB','prohibited'],['\u26D4','no entry'],['\uD83D\uDD34','red circle'],['\uD83D\uDFE0','orange circle'],['\uD83D\uDFE1','yellow circle'],
        ['\uD83D\uDFE2','green circle'],['\uD83D\uDD35','blue circle'],['\uD83D\uDFE3','purple circle'],['\u26AB','black circle'],['\u26AA','white circle'],
        ['\uD83D\uDFE5','red square'],['\uD83D\uDFE7','orange square'],['\uD83D\uDFE8','yellow square'],['\uD83D\uDFE9','green square'],['\uD83D\uDFE6','blue square'],['\uD83D\uDFEA','purple square'],
        ['\u2B1B','black square'],['\u2B1C','white square'],['\uD83D\uDD36','orange diamond large'],['\uD83D\uDD37','blue diamond large'],
        ['\uD83D\uDD38','orange diamond small'],['\uD83D\uDD39','blue diamond small'],['\uD83D\uDD3A','red triangle up'],['\uD83D\uDD3B','red triangle down'],
        ['\uD83D\uDCA0','diamond dot'],['\uD83D\uDD18','radio button'],['\uD83D\uDD33','white square button'],['\uD83D\uDD32','black square button'],
        ['\u2795','plus'],['\u2796','minus'],['\u2797','divide'],['\u2716\uFE0F','multiply'],['\u267B\uFE0F','recycle'],['\uD83D\uDCAF','hundred points'],
        ['\uD83D\uDD25','fire'],['\uD83D\uDCA7','water drop'],['\uD83D\uDCA8','wind dash'],['\uD83C\uDF0A','wave'],['\uD83C\uDFB5','music note'],['\uD83C\uDFB6','music notes'],
        ['\uD83D\uDD07','muted'],['\uD83D\uDD08','low volume'],['\uD83D\uDD09','medium volume'],['\uD83D\uDD0A','loud volume'],['\uD83D\uDCF3','vibration'],
        ['\u2B06\uFE0F','up arrow'],['\u2B07\uFE0F','down arrow'],['\u2B05\uFE0F','left arrow'],['\u27A1\uFE0F','right arrow'],['\u2197\uFE0F','upper right'],['\u2198\uFE0F','lower right'],
        ['\u2199\uFE0F','lower left'],['\u2196\uFE0F','upper left'],['\u2195\uFE0F','up down'],['\u2194\uFE0F','left right'],['\uD83D\uDD04','counterclockwise'],['\uD83D\uDD03','clockwise'],
        ['\u2139\uFE0F','info'],['\uD83C\uDD97','ok button'],['\uD83C\uDD95','new button'],['\uD83C\uDD93','free button'],['\uD83D\uDD1D','top'],['\uD83D\uDD1C','soon'],
        ['\u267E\uFE0F','infinity'],['\uD83D\uDCB2','dollar sign'],['\u00A9\uFE0F','copyright'],['\u00AE\uFE0F','registered'],['\u2122\uFE0F','trademark']
    ],
    'Kaomoji': [
        ['(\u256F\u00B0\u25A1\u00B0)\u256F\uFE35 \u253B\u2501\u253B','table flip angry'],['\u252C\u2500\u252C\u30CE( \u00BA _ \u00BA\u30CE)','table unflip calm'],['\u00AF\\_(\u30C4)_/\u00AF','shrug whatever'],
        ['( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)','lenny face'],['\uFF08\u261E\uFF9F\u30EE\uFF9F\uFF09\u261E','finger guns'],['\u261C(\uFF9F\u30EE\uFF9F\u261C)','finger guns left'],
        ['\u0295\u2022\u1D25\u2022\u0294','bear cute'],['\uFF08\u25D5\u203F\u25D5\uFF09','happy cute'],['\uFF08\u1D54\u1D25\u1D54\uFF09','puppy dog cute'],['\uFF08=^\u30FB\u03C9\u30FB^=\uFF09','cat cute'],
        ['(\u2310\u25A0_\u25A0)','sunglasses cool deal'],['(\u2022_\u2022) ( \u2022_\u2022)>\u2310\u25A0-\u25A0 (\u2310\u25A0_\u25A0)','putting sunglasses'],
        ['(\u30CE\u0CA0\u76CA\u0CA0)\u30CE\u5F61\u253B\u2501\u253B','rage flip'],['\uFF08\u2565_\u2565\uFF09','crying sad'],['(T_T)','tears sad'],['(;_;)','crying'],
        ['(\u0CA5\uFE4F\u0CA5)','crying big'],['\uFF08\u25E0\u203F\u25E0\uFF09','happy smile'],['\uFF08\u273F\u25E0\u203F\u25E0\uFF09','flower happy'],['(*^\u25BD^*)','excited happy'],
        ['(\u2267\u25E1\u2266)','happy squint'],['(\u00B4\u30FB\u03C9\u30FB`)','worried sad'],['\uFF08\u2299_\u2299\uFF09','surprised shocked'],['(O_O)','surprised'],
        ['(\u00B0\u25BD\u00B0)','excited happy'],['\u2570(*\u00B0\u25BD\u00B0*)\u256F','very happy cheering'],['\uFF08\u3065\uFF61\u25D5\u203F\u203F\u25D5\uFF61\uFF09\u3065','hug gimme'],
        ['(\u2283\uFF61\u2022\u0301\u203F\u2022\u0300\uFF61)\u2283','hug reaching'],['\u30FD(>\u2200<\u2606)\u30CE','excited yay'],['\u266A(\u00B4\u03B5` )','singing whistling'],
        ['(\u0E07 \u2022\u0300_\u2022\u0301)\u0E07','fight strong'],['(\u2022\u0300\u1D17\u2022\u0301)\u0648','thumbs up got it'],['( \u02D8 \u00B3\u02D8)\u2665','kiss love'],['\uFF08\u706C\u00BA\u03C9\u00BA\u706C\uFF09','blushing shy'],
        ['(\uFF89\u25D5\u30EE\u25D5)\uFF89*:\u30FB\uFF9F\u2727','magic sparkle'],['\uFF08\u2606\u25BD\u2606\uFF09','star eyes amazed'],['\u250C( \u0CA0_\u0CA0)\u2518','disapproval walking'],
        ['\u0CA0_\u0CA0','disapproval look'],['\u0CA0\u256D\u256E\u0CA0','sad disapproval'],['\uFF08\u1D12\u1D23\u1D15\uFF09\u055E','upset sad'],
        ['(\uFF5E\uFFE3\u25BD\uFFE3)\uFF5E','dancing happy'],['\u266A\u266A \u30FD(\u02C7\u2200\u02C7 )\u309E','dancing groove'],['\u2517(^0^)\u2513','running dancing'],
        ['( \u02C3\u0363\u0323\u0363\u0325\u03C9\u02C2\u0363\u0323\u0363\u0325 )','teary cute'],['\uFF08\u25CD\u2022\u1D17\u2022\u25CD\uFF09','innocent cute'],['\uFF08\uFF61\u2665\u203F\u2665\uFF61\uFF09','love struck'],
        ['\u2727*\u3002\u0669(\u02CA\u1D17\u02CB*)\u0648\u2727*\u3002','celebration success'],['\uFF08\u2229^o^\uFF09\u2283\u2501\u2606\uFF9F.*\u30FB','magic wand cast'],
        ['(\u30CE\u00B0\u2200\u00B0)\u30CE\u2312\u30FB*:..\u3002. .\u3002.:*\u30FB\u309C\uFF9F\u30FB*','throwing stars confetti'],
        ['\u51F8(\u00AC\u203F\u00AC)','smug middle finger'],['( \u2267\u0414\u2266)','shouting loud'],['(\u00AC_\u00AC)','side eye suspicious'],
        ['(\uB208_\uB208)','serious stare'],['(\u2022\u02CB _ \u02CA\u2022)','hmph annoyed'],['(\uFE36\uFE39\uFE3A)','frown upset'],
        ['( \u00B4_\u309D`)','indifferent bored'],['(\u00AC\u203F\u00AC )','sly smirk'],['(*\u2267\u25BD\u2266)','very excited'],
        ['(\u02F5 \u0361\u00B0 \u035C\u0296 \u0361\u00B0\u02F5)','lenny blushing']
    ]
};

function emoteInit() {
    document.querySelectorAll('.emote-widget').forEach(widget => {
        if (widget.dataset.inited) return;
        widget.dataset.inited = '1';
        const tabs = widget.querySelector('.emote-tabs');
        const categories = Object.keys(EMOTE_DATA);
        categories.forEach((cat, i) => {
            const btn = document.createElement('button');
            btn.className = 'emote-tab' + (i === 0 ? ' active' : '');
            btn.textContent = cat;
            btn.onclick = () => emoteSelectTab(widget, cat);
            tabs.appendChild(btn);
        });
        emoteRender(widget, categories[0]);
    });
}

function emoteSelectTab(widget, category) {
    widget.querySelectorAll('.emote-tab').forEach(t => t.classList.toggle('active', t.textContent === category));
    widget.querySelector('.emote-search input').value = '';
    emoteRender(widget, category);
}

function emoteRender(widget, category) {
    const grid = widget.querySelector('.emote-grid');
    const isKaomoji = category === 'Kaomoji';
    grid.className = 'emote-grid' + (isKaomoji ? ' kaomoji' : '');
    grid.innerHTML = '';
    const items = EMOTE_DATA[category] || [];
    items.forEach(([emote]) => {
        const cell = document.createElement('div');
        cell.className = 'emote-cell';
        cell.textContent = emote;
        cell.title = emote;
        cell.onclick = () => emoteCopy(widget, cell, emote);
        grid.appendChild(cell);
    });
    widget.querySelector('.emote-status').textContent = `${items.length} items`;
}

function emoteSearch(input) {
    const widget = input.closest('.emote-widget');
    const query = input.value.toLowerCase().trim();
    const grid = widget.querySelector('.emote-grid');

    if (!query) {
        const activeTab = widget.querySelector('.emote-tab.active');
        emoteRender(widget, activeTab ? activeTab.textContent : 'Smileys');
        return;
    }

    widget.querySelectorAll('.emote-tab').forEach(t => t.classList.remove('active'));
    grid.className = 'emote-grid';
    grid.innerHTML = '';
    let count = 0;
    let hasKaomoji = false;

    for (const [category, items] of Object.entries(EMOTE_DATA)) {
        const matches = items.filter(([, tags]) => tags.toLowerCase().includes(query));
        if (matches.length === 0) continue;

        if (category === 'Kaomoji') { hasKaomoji = true; continue; } // render kaomoji after

        const label = document.createElement('div');
        label.className = 'emote-category-label';
        label.textContent = category;
        grid.appendChild(label);

        matches.forEach(([emote]) => {
            const cell = document.createElement('div');
            cell.className = 'emote-cell';
            cell.textContent = emote;
            cell.title = emote;
            cell.onclick = () => emoteCopy(widget, cell, emote);
            grid.appendChild(cell);
            count++;
        });
    }

    // Render kaomoji matches at the end with proper styling
    if (hasKaomoji) {
        const kMatches = EMOTE_DATA['Kaomoji'].filter(([, tags]) => tags.toLowerCase().includes(query));
        if (kMatches.length > 0) {
            const label = document.createElement('div');
            label.className = 'emote-category-label';
            label.textContent = 'Kaomoji';
            grid.appendChild(label);
            kMatches.forEach(([emote]) => {
                const cell = document.createElement('div');
                cell.className = 'emote-cell';
                cell.style.fontSize = '13px';
                cell.style.aspectRatio = 'auto';
                cell.style.justifyContent = 'flex-start';
                cell.style.fontFamily = 'monospace';
                cell.style.padding = '6px 8px';
                cell.textContent = emote;
                cell.title = emote;
                cell.onclick = () => emoteCopy(widget, cell, emote);
                grid.appendChild(cell);
                count++;
            });
        }
    }

    widget.querySelector('.emote-status').textContent = count > 0 ? `${count} results` : 'No results';
}

function emoteCopy(widget, cell, text) {
    navigator.clipboard.writeText(text).then(() => {
        cell.classList.add('copied');
        setTimeout(() => cell.classList.remove('copied'), 300);
        const status = widget.querySelector('.emote-status');
        status.textContent = `Copied: ${text}`;
        status.className = 'emote-status success';
        setTimeout(() => { status.className = 'emote-status'; }, 1500);
    });
}

// =============================================
// DRAWING CANVAS
// =============================================

const _drawState = new WeakMap();

function drawGetState(widget) {
    if (!_drawState.has(widget)) {
        _drawState.set(widget, {
            color: '#000000',
            size: 4,
            eraser: false,
            isDrawing: false,
            lastX: 0,
            lastY: 0,
            undoStack: [],
            maxUndo: 30
        });
    }
    return _drawState.get(widget);
}

function drawInit() {
    document.querySelectorAll('.draw-widget').forEach(widget => {
        if (widget.dataset.inited) return;
        widget.dataset.inited = '1';
        const st = drawGetState(widget);
        const canvas = widget.querySelector('.draw-canvas');
        const wrap = widget.querySelector('.draw-canvas-wrap');
        const ctx = canvas.getContext('2d');

        // Size canvas to wrapper
        const rect = wrap.getBoundingClientRect();
        canvas.width = Math.max(rect.width, 1);
        canvas.height = Math.max(rect.height, 1);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set initial active swatch
        const firstSwatch = widget.querySelector('.draw-swatch');
        if (firstSwatch) firstSwatch.classList.add('active');

        // Mouse events
        canvas.addEventListener('mousedown', function(e) {
            e.preventDefault();
            drawBeginStroke(widget, e);
            const onMove = function(ev) { ev.preventDefault(); drawMoveStroke(widget, ev); };
            const onUp = function() {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                drawEndStroke(widget);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });

        // Touch events
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            drawBeginStroke(widget, touch);
        }, { passive: false });
        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            drawMoveStroke(widget, touch);
        }, { passive: false });
        canvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            drawEndStroke(widget);
        }, { passive: false });

        // ResizeObserver
        let resizeTimer = null;
        const observer = new ResizeObserver(function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() { drawResizeCanvas(widget); }, 50);
        });
        observer.observe(wrap);

        // Update status
        const status = widget.querySelector('.draw-status');
        if (status) status.textContent = 'Ready';
    });
}

function drawBeginStroke(widget, e) {
    const canvas = widget.querySelector('.draw-canvas');
    const ctx = canvas.getContext('2d');
    const st = drawGetState(widget);
    const rect = canvas.getBoundingClientRect();

    // Save undo snapshot
    st.undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (st.undoStack.length > st.maxUndo) st.undoStack.shift();

    st.isDrawing = true;
    st.lastX = e.clientX - rect.left;
    st.lastY = e.clientY - rect.top;

    // Configure context
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = st.size;
    if (st.eraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = st.color;
    }

    // Draw initial dot
    ctx.beginPath();
    ctx.arc(st.lastX, st.lastY, st.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = st.eraser ? 'rgba(0,0,0,1)' : st.color;
    ctx.fill();
    ctx.globalCompositeOperation = st.eraser ? 'destination-out' : 'source-over';
}

function drawMoveStroke(widget, e) {
    const st = drawGetState(widget);
    if (!st.isDrawing) return;
    const canvas = widget.querySelector('.draw-canvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(st.lastX, st.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    st.lastX = x;
    st.lastY = y;
}

function drawEndStroke(widget) {
    const st = drawGetState(widget);
    st.isDrawing = false;
    const canvas = widget.querySelector('.draw-canvas');
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';

    const status = widget.querySelector('.draw-status');
    if (status) status.textContent = st.undoStack.length + ' undo' + (st.undoStack.length !== 1 ? 's' : '') + ' available';
}

function drawSetColor(widget, color) {
    const st = drawGetState(widget);
    st.color = color;
    st.eraser = false;

    // Update swatch UI
    widget.querySelectorAll('.draw-swatch').forEach(function(sw) {
        sw.classList.toggle('active', sw.dataset.color === color);
    });
    const eraserBtn = widget.querySelector('.draw-eraser-btn');
    if (eraserBtn) eraserBtn.classList.remove('active');

    // Update color input
    const colorInput = widget.querySelector('.draw-color-input');
    if (colorInput) colorInput.value = color;

    // Reset cursor
    const canvas = widget.querySelector('.draw-canvas');
    if (canvas) canvas.style.cursor = 'crosshair';
}

function drawSetSize(widget, size) {
    const st = drawGetState(widget);
    st.size = size;
}

function drawToggleEraser(widget) {
    const st = drawGetState(widget);
    st.eraser = !st.eraser;

    const eraserBtn = widget.querySelector('.draw-eraser-btn');
    if (eraserBtn) eraserBtn.classList.toggle('active', st.eraser);

    // Deactivate swatches when eraser is on
    if (st.eraser) {
        widget.querySelectorAll('.draw-swatch').forEach(function(sw) { sw.classList.remove('active'); });
    } else {
        widget.querySelectorAll('.draw-swatch').forEach(function(sw) {
            sw.classList.toggle('active', sw.dataset.color === st.color);
        });
    }

    const canvas = widget.querySelector('.draw-canvas');
    if (canvas) canvas.style.cursor = st.eraser ? 'cell' : 'crosshair';
}

function drawClear(widget) {
    const canvas = widget.querySelector('.draw-canvas');
    const ctx = canvas.getContext('2d');
    const st = drawGetState(widget);

    // Save undo snapshot before clearing
    st.undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (st.undoStack.length > st.maxUndo) st.undoStack.shift();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const status = widget.querySelector('.draw-status');
    if (status) status.textContent = 'Cleared';
}

function drawUndo(widget) {
    const st = drawGetState(widget);
    if (st.undoStack.length === 0) return;
    const canvas = widget.querySelector('.draw-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = st.undoStack.pop();
    ctx.putImageData(imageData, 0, 0);

    const status = widget.querySelector('.draw-status');
    if (status) status.textContent = st.undoStack.length > 0 ? st.undoStack.length + ' undo' + (st.undoStack.length !== 1 ? 's' : '') + ' available' : 'Nothing to undo';
}

function drawDownload(widget) {
    const canvas = widget.querySelector('.draw-canvas');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    const status = widget.querySelector('.draw-status');
    if (status) status.textContent = 'Downloaded PNG';
}

function drawResizeCanvas(widget) {
    const canvas = widget.querySelector('.draw-canvas');
    const wrap = widget.querySelector('.draw-canvas-wrap');
    const ctx = canvas.getContext('2d');
    const rect = wrap.getBoundingClientRect();
    const newW = Math.max(Math.floor(rect.width), 1);
    const newH = Math.max(Math.floor(rect.height), 1);

    if (newW === canvas.width && newH === canvas.height) return;

    // Save current image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    canvas.width = newW;
    canvas.height = newH;

    // Fill white background then restore old content
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, newW, newH);
    ctx.putImageData(imageData, 0, 0);
}

function drawColorInput(input) {
    const widget = input.closest('.draw-widget');
    drawSetColor(widget, input.value);
}

function drawSizeInput(input) {
    const widget = input.closest('.draw-widget');
    const st = drawGetState(widget);
    st.size = parseInt(input.value, 10) || 4;
    const label = widget.querySelector('.draw-size-label');
    if (label) label.textContent = st.size + 'px';
}

// =============================================
// FAMILY TREE
// =============================================

function ftGetToolId(element) {
    const tool = element.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function ftGetData(toolId) {
    const customizations = loadToolCustomizations();
    const custom = customizations[toolId] || {};
    return custom.ftData || { members: [], relationships: [], selectedId: null, rootId: null, mode: 'visual', viewFilter: null, viewFilterId: null };
}

function ftSaveData(toolId, data) {
    const customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].ftData = data;
    saveToolCustomizations(customizations);
}

function ftGenId() {
    return 'ft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

function ftInit() {
    document.querySelectorAll('.ft-widget').forEach(function(widget) {
        var toolId = ftGetToolId(widget);
        if (!toolId) return;
        var data = ftGetData(toolId);
        ftRender(widget, toolId, data);
    });
}

function ftRender(widget, toolId, data) {
    ftRenderDiagram(widget, toolId, data);
    ftRenderEditPanel(widget, toolId, data);
    ftUpdateStatus(widget, data);

    var diagram = widget.querySelector('.ft-diagram');
    var textEditor = widget.querySelector('.ft-text-editor');
    var formEditor = widget.querySelector('.ft-form-editor');
    if (data.mode === 'text') {
        diagram.style.display = 'none';
        textEditor.style.display = '';
        formEditor.style.display = 'none';
        textEditor.value = ftToText(data);
    } else if (data.mode === 'form') {
        diagram.style.display = 'none';
        textEditor.style.display = 'none';
        formEditor.style.display = '';
        widget.querySelector('.ft-edit-panel').style.display = 'none';
        ftRenderForm(widget, toolId, data);
    } else {
        diagram.style.display = '';
        textEditor.style.display = 'none';
        formEditor.style.display = 'none';
    }
}

function ftUpdateStatus(widget, data) {
    var statusText = widget.querySelector('.ft-status-text');
    if (!statusText) return;
    var mc = data.members.length;
    var rc = data.relationships.length;
    var text = mc + ' member' + (mc !== 1 ? 's' : '') + ' · ' + rc + ' relationship' + (rc !== 1 ? 's' : '');
    if (data.viewFilter && data.viewFilterId) {
        var filterName = '';
        for (var i = 0; i < data.members.length; i++) {
            if (data.members[i].id === data.viewFilterId) { filterName = data.members[i].name; break; }
        }
        text += ' · ' + (data.viewFilter === 'descendants' ? '↓' : '↑') + ' ' + (filterName || 'Unknown');
    }
    statusText.textContent = text;
}

function ftRenderEditPanel(widget, toolId, data) {
    var panel = widget.querySelector('.ft-edit-panel');
    if (!data.selectedId) {
        panel.style.display = 'none';
        panel.innerHTML = '';
        return;
    }
    var member = null;
    for (var i = 0; i < data.members.length; i++) {
        if (data.members[i].id === data.selectedId) { member = data.members[i]; break; }
    }
    if (!member) {
        panel.style.display = 'none';
        panel.innerHTML = '';
        return;
    }
    panel.style.display = '';
    var genderOpts = '<option value="m"' + (member.gender === 'm' ? ' selected' : '') + '>Male</option>' +
        '<option value="f"' + (member.gender === 'f' ? ' selected' : '') + '>Female</option>' +
        '<option value="o"' + (member.gender === 'o' ? ' selected' : '') + '>Other</option>';
    var isRoot = data.rootId === member.id;
    panel.innerHTML =
        '<div class="ft-edit-title">Edit: ' + (member.name || 'Unnamed') + '</div>' +
        '<div class="ft-edit-row">' +
            '<label>Name</label><input type="text" value="' + (member.name || '').replace(/"/g, '&quot;') + '" oninput="ftEditField(this,\'name\')">' +
            '<label>Birth</label><input type="text" value="' + (member.birthYear || '') + '" placeholder="Year" style="max-width:60px" oninput="ftEditField(this,\'birthYear\')">' +
        '</div>' +
        '<div class="ft-edit-row">' +
            '<label>Death</label><input type="text" value="' + (member.deathYear || '') + '" placeholder="Year" style="max-width:60px" oninput="ftEditField(this,\'deathYear\')">' +
            '<label>Gender</label><select onchange="ftEditGender(this)">' + genderOpts + '</select>' +
        '</div>' +
        '<div class="ft-edit-actions">' +
            '<button class="ft-btn" onclick="ftAddChild(this)">Add Child</button>' +
            '<button class="ft-btn" onclick="ftAddPartner(this)">Add Partner</button>' +
            (isRoot ? '<button class="ft-btn active" disabled>Root</button>' : '<button class="ft-btn" onclick="ftSetRoot(this)">Set Root</button>') +
            '<button class="ft-btn' + (data.viewFilter === 'descendants' && data.viewFilterId === member.id ? ' active' : '') + '" onclick="ftSetViewFilter(this,\'descendants\')">↓ Descendants</button>' +
            '<button class="ft-btn' + (data.viewFilter === 'ancestors' && data.viewFilterId === member.id ? ' active' : '') + '" onclick="ftSetViewFilter(this,\'ancestors\')">↑ Ancestors</button>' +
            '<button class="ft-btn danger" onclick="ftDeletePerson(this)">✕ Delete</button>' +
        '</div>';
}

function ftRenderDiagram(widget, toolId, data) {
    var diagram = widget.querySelector('.ft-diagram');
    if (data.members.length === 0) {
        diagram.innerHTML = '<div class="ft-empty">Add a person or load a sample to get started</div>';
        return;
    }
    var viewData = ftFilterData(data);
    var layout = ftLayoutTree(viewData);
    var nodes = layout.nodes;
    var connections = layout.connections;
    var svgW = layout.width;
    var svgH = layout.height;

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + svgW + '" height="' + svgH + '">';

    // Draw connections first (behind nodes)
    for (var ci = 0; ci < connections.length; ci++) {
        var conn = connections[ci];
        if (conn.type === 'partner') {
            svg += '<line x1="' + conn.x1 + '" y1="' + conn.y1 + '" x2="' + conn.x2 + '" y2="' + conn.y2 + '" class="ft-partner-line"/>';
        } else {
            svg += '<path d="' + conn.path + '" class="ft-conn-line"/>';
        }
    }

    // Draw nodes
    for (var ni = 0; ni < nodes.length; ni++) {
        var node = nodes[ni];
        var cls = 'ft-node-rect ' + node.gender;
        if (node.id === data.selectedId) cls += ' selected';
        svg += '<rect class="' + cls + '" x="' + node.x + '" y="' + node.y + '" width="' + node.w + '" height="' + node.h + '" onclick="ftSelectNode(this,\'' + node.id + '\')"/>';
        svg += '<text class="ft-node-name" x="' + (node.x + node.w / 2) + '" y="' + (node.y + 18) + '" onclick="ftSelectNode(this,\'' + node.id + '\')">' + ftEscSvg(node.name || 'Unnamed') + '</text>';
        var years = node.birthYear || '';
        if (node.deathYear) years += '-' + node.deathYear;
        if (years) {
            svg += '<text class="ft-node-years" x="' + (node.x + node.w / 2) + '" y="' + (node.y + 34) + '" onclick="ftSelectNode(this,\'' + node.id + '\')">' + ftEscSvg(years) + '</text>';
        }
    }

    svg += '</svg>';
    diagram.innerHTML = svg;
}

function ftEscSvg(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function ftLayoutTree(data) {
    var nodeW = 120, nodeH = 48, hGap = 30, vGap = 70, padding = 20;

    // Find generations via BFS from root
    var generations = ftFindGenerations(data);
    if (generations.length === 0) {
        // No root or disconnected — just lay out in a single row
        var xs = padding;
        var allNodes = [];
        for (var mi = 0; mi < data.members.length; mi++) {
            var m = data.members[mi];
            allNodes.push({ id: m.id, name: m.name, birthYear: m.birthYear, deathYear: m.deathYear, gender: m.gender, x: xs, y: padding, w: nodeW, h: nodeH });
            xs += nodeW + hGap;
        }
        return { nodes: allNodes, connections: [], width: xs + padding, height: nodeH + padding * 2 };
    }

    // Build a map of member by id
    var memberMap = {};
    for (var mi2 = 0; mi2 < data.members.length; mi2++) {
        memberMap[data.members[mi2].id] = data.members[mi2];
    }

    // Build position map
    var posMap = {}; // id -> {x, y}
    var placedIds = {};
    var maxX = 0;

    for (var g = 0; g < generations.length; g++) {
        var genIds = generations[g];
        var y = padding + g * (nodeH + vGap);
        // Group into units: partner pairs or singles
        var units = [];
        var usedInUnit = {};
        for (var gi = 0; gi < genIds.length; gi++) {
            var mid = genIds[gi];
            if (usedInUnit[mid]) continue;
            var partnerId = ftGetPartner(data, mid);
            if (partnerId && !usedInUnit[partnerId]) {
                // Check partner is in same generation
                var partnerInGen = false;
                for (var gj = 0; gj < genIds.length; gj++) {
                    if (genIds[gj] === partnerId) { partnerInGen = true; break; }
                }
                if (partnerInGen) {
                    units.push([mid, partnerId]);
                    usedInUnit[mid] = true;
                    usedInUnit[partnerId] = true;
                } else {
                    units.push([mid]);
                    usedInUnit[mid] = true;
                }
            } else {
                units.push([mid]);
                usedInUnit[mid] = true;
            }
        }

        // Place units left-to-right
        var x = padding;
        for (var u = 0; u < units.length; u++) {
            var unit = units[u];
            for (var ui = 0; ui < unit.length; ui++) {
                posMap[unit[ui]] = { x: x, y: y };
                placedIds[unit[ui]] = true;
                x += nodeW + (ui < unit.length - 1 ? 15 : 0); // partners closer together
            }
            x += hGap;
        }
        if (x > maxX) maxX = x;
    }

    // Second pass: center children under parents
    for (var g2 = 1; g2 < generations.length; g2++) {
        var genIds2 = generations[g2];
        // Group children by their parent unit
        var parentGroups = {};
        for (var ci = 0; ci < genIds2.length; ci++) {
            var childId = genIds2[ci];
            var parentIds = ftGetParents(data, childId);
            var parentKey = parentIds.sort().join(',');
            if (!parentGroups[parentKey]) parentGroups[parentKey] = { parentIds: parentIds, children: [] };
            parentGroups[parentKey].children.push(childId);
        }

        for (var pk in parentGroups) {
            var grp = parentGroups[pk];
            if (grp.parentIds.length === 0) continue;
            // Find center of parents
            var pMinX = Infinity, pMaxX = -Infinity;
            for (var pi = 0; pi < grp.parentIds.length; pi++) {
                var pp = posMap[grp.parentIds[pi]];
                if (pp) {
                    if (pp.x < pMinX) pMinX = pp.x;
                    if (pp.x + nodeW > pMaxX) pMaxX = pp.x + nodeW;
                }
            }
            var parentCenter = (pMinX + pMaxX) / 2;

            // Get partner pairs among children for width calculation
            var childUnits = [];
            var usedChild = {};
            for (var cc = 0; cc < grp.children.length; cc++) {
                var cid = grp.children[cc];
                if (usedChild[cid]) continue;
                var cp = ftGetPartner(data, cid);
                if (cp && !usedChild[cp]) {
                    var cpInGroup = false;
                    for (var cc2 = 0; cc2 < grp.children.length; cc2++) {
                        if (grp.children[cc2] === cp) { cpInGroup = true; break; }
                    }
                    if (cpInGroup) {
                        childUnits.push([cid, cp]);
                        usedChild[cid] = true;
                        usedChild[cp] = true;
                    } else {
                        childUnits.push([cid]);
                        usedChild[cid] = true;
                    }
                } else {
                    childUnits.push([cid]);
                    usedChild[cid] = true;
                }
            }

            var totalW = 0;
            for (var cu = 0; cu < childUnits.length; cu++) {
                totalW += childUnits[cu].length * nodeW + (childUnits[cu].length - 1) * 15;
                if (cu < childUnits.length - 1) totalW += hGap;
            }

            var startX = parentCenter - totalW / 2;
            if (startX < padding) startX = padding;

            var cx = startX;
            for (var cu2 = 0; cu2 < childUnits.length; cu2++) {
                var cunit = childUnits[cu2];
                for (var cui = 0; cui < cunit.length; cui++) {
                    posMap[cunit[cui]] = { x: cx, y: posMap[cunit[cui]].y };
                    cx += nodeW + (cui < cunit.length - 1 ? 15 : 0);
                }
                cx += hGap;
            }
            if (cx > maxX) maxX = cx;
        }
    }

    // Place any unplaced members
    var unplacedX = maxX + hGap;
    for (var mi3 = 0; mi3 < data.members.length; mi3++) {
        if (!posMap[data.members[mi3].id]) {
            posMap[data.members[mi3].id] = { x: unplacedX, y: padding };
            unplacedX += nodeW + hGap;
        }
    }
    if (unplacedX > maxX) maxX = unplacedX;

    // Build node objects
    var allNodes2 = [];
    for (var mi4 = 0; mi4 < data.members.length; mi4++) {
        var mem = data.members[mi4];
        var pos = posMap[mem.id];
        allNodes2.push({ id: mem.id, name: mem.name, birthYear: mem.birthYear, deathYear: mem.deathYear, gender: mem.gender, x: pos.x, y: pos.y, w: nodeW, h: nodeH });
    }

    // Build connections
    var allConns = [];
    for (var ri = 0; ri < data.relationships.length; ri++) {
        var rel = data.relationships[ri];
        var fromPos = posMap[rel.from];
        var toPos = posMap[rel.to];
        if (!fromPos || !toPos) continue;

        if (rel.type === 'partner') {
            // Dashed horizontal line between partners at mid-height
            var lx1 = fromPos.x + nodeW;
            var lx2 = toPos.x;
            if (lx2 < lx1) { var tmp = lx1; lx1 = lx2 + nodeW; lx2 = tmp - nodeW; }
            var ly = fromPos.y + nodeH / 2;
            allConns.push({ type: 'partner', x1: lx1, y1: ly, x2: lx2, y2: ly });
        } else if (rel.type === 'parent') {
            // Solid line: from parent bottom center to child top center
            var px = fromPos.x + nodeW / 2;
            var py = fromPos.y + nodeH;
            var chx = toPos.x + nodeW / 2;
            var chy = toPos.y;
            var midY = py + (chy - py) / 2;
            var path = 'M' + px + ' ' + py + ' L' + px + ' ' + midY + ' L' + chx + ' ' + midY + ' L' + chx + ' ' + chy;
            allConns.push({ type: 'parent', path: path });
        }
    }

    var finalW = maxX + padding;
    var finalH = padding + generations.length * (nodeH + vGap) - vGap + nodeH + padding;
    // Ensure min height accounts for all nodes
    for (var ni2 = 0; ni2 < allNodes2.length; ni2++) {
        var nb = allNodes2[ni2].y + allNodes2[ni2].h + padding;
        if (nb > finalH) finalH = nb;
    }

    return { nodes: allNodes2, connections: allConns, width: Math.max(finalW, 200), height: Math.max(finalH, 100) };
}

function ftFindGenerations(data) {
    if (!data.rootId || data.members.length === 0) return [];
    // Check root exists
    var rootExists = false;
    for (var i = 0; i < data.members.length; i++) {
        if (data.members[i].id === data.rootId) { rootExists = true; break; }
    }
    if (!rootExists) return [];

    var genMap = {}; // id -> generation number
    var queue = [data.rootId];
    genMap[data.rootId] = 0;

    // Also place root's partner at gen 0
    var rootPartner = ftGetPartner(data, data.rootId);
    if (rootPartner) {
        genMap[rootPartner] = 0;
        queue.push(rootPartner);
    }

    while (queue.length > 0) {
        var current = queue.shift();
        var currentGen = genMap[current];

        // Find children of current (and current's partner)
        var partnerOfCurrent = ftGetPartner(data, current);
        var parentIds = [current];
        if (partnerOfCurrent) parentIds.push(partnerOfCurrent);
        var children = ftGetChildren(data, parentIds);

        for (var c = 0; c < children.length; c++) {
            var childId = children[c];
            if (genMap[childId] !== undefined) continue;
            genMap[childId] = currentGen + 1;
            queue.push(childId);
            // Also place child's partner at same gen
            var childPartner = ftGetPartner(data, childId);
            if (childPartner && genMap[childPartner] === undefined) {
                genMap[childPartner] = currentGen + 1;
                queue.push(childPartner);
            }
        }
    }

    // Build generation arrays
    var maxGen = 0;
    for (var id in genMap) {
        if (genMap[id] > maxGen) maxGen = genMap[id];
    }
    var gens = [];
    for (var g = 0; g <= maxGen; g++) {
        var genArr = [];
        for (var id2 in genMap) {
            if (genMap[id2] === g) genArr.push(id2);
        }
        gens.push(genArr);
    }
    return gens;
}

function ftGetPartner(data, memberId) {
    for (var i = 0; i < data.relationships.length; i++) {
        var rel = data.relationships[i];
        if (rel.type === 'partner') {
            if (rel.from === memberId) return rel.to;
            if (rel.to === memberId) return rel.from;
        }
    }
    return null;
}

function ftGetChildren(data, parentIds) {
    var children = [];
    for (var i = 0; i < data.relationships.length; i++) {
        var rel = data.relationships[i];
        if (rel.type === 'parent') {
            for (var p = 0; p < parentIds.length; p++) {
                if (rel.from === parentIds[p]) {
                    // Check not already added
                    var found = false;
                    for (var j = 0; j < children.length; j++) {
                        if (children[j] === rel.to) { found = true; break; }
                    }
                    if (!found) children.push(rel.to);
                }
            }
        }
    }
    return children;
}

function ftGetParents(data, childId) {
    var parents = [];
    for (var i = 0; i < data.relationships.length; i++) {
        var rel = data.relationships[i];
        if (rel.type === 'parent' && rel.to === childId) {
            parents.push(rel.from);
        }
    }
    return parents;
}

function ftSelectNode(el, memberId) {
    var widget = el.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    var wasSelected = data.selectedId === memberId;
    data.selectedId = wasSelected ? null : memberId;
    // Clear filter when deselecting or selecting a different person
    if (wasSelected || (data.viewFilterId && data.viewFilterId !== memberId)) {
        data.viewFilter = null;
        data.viewFilterId = null;
    }
    ftSaveData(toolId, data);
    ftRender(widget, toolId, data);
}

function ftAddPerson(btn) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    var newId = ftGenId();
    data.members.push({ id: newId, name: 'New Person', birthYear: '', deathYear: '', gender: 'o' });
    if (!data.rootId) data.rootId = newId;
    data.selectedId = newId;
    ftSaveData(toolId, data);
    ftRender(widget, toolId, data);
}

function ftAddChild(btn) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    if (!data.selectedId) return;
    var newId = ftGenId();
    data.members.push({ id: newId, name: 'Child', birthYear: '', deathYear: '', gender: 'o' });
    data.relationships.push({ type: 'parent', from: data.selectedId, to: newId });
    // Also add partner as parent if exists
    var partner = ftGetPartner(data, data.selectedId);
    if (partner) {
        data.relationships.push({ type: 'parent', from: partner, to: newId });
    }
    data.selectedId = newId;
    ftSaveData(toolId, data);
    ftRender(widget, toolId, data);
}

function ftAddPartner(btn) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    if (!data.selectedId) return;
    // Check if already has a partner
    if (ftGetPartner(data, data.selectedId)) return;
    var newId = ftGenId();
    data.members.push({ id: newId, name: 'Partner', birthYear: '', deathYear: '', gender: 'o' });
    data.relationships.push({ type: 'partner', from: data.selectedId, to: newId });
    data.selectedId = newId;
    ftSaveData(toolId, data);
    ftRender(widget, toolId, data);
}

function ftDeletePerson(btn) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    if (!data.selectedId) return;
    var delId = data.selectedId;
    // Remove member
    data.members = data.members.filter(function(m) { return m.id !== delId; });
    // Remove relationships involving this member
    data.relationships = data.relationships.filter(function(r) { return r.from !== delId && r.to !== delId; });
    if (data.rootId === delId) {
        data.rootId = data.members.length > 0 ? data.members[0].id : null;
    }
    data.selectedId = null;
    data.viewFilter = null;
    data.viewFilterId = null;
    ftSaveData(toolId, data);
    ftRender(widget, toolId, data);
}

function ftSetRoot(btn) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    if (!data.selectedId) return;
    data.rootId = data.selectedId;
    ftSaveData(toolId, data);
    ftRender(widget, toolId, data);
}

function ftEditField(input, field) {
    var widget = input.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    if (!data.selectedId) return;
    for (var i = 0; i < data.members.length; i++) {
        if (data.members[i].id === data.selectedId) {
            data.members[i][field] = input.value;
            break;
        }
    }
    ftSaveData(toolId, data);
    // Re-render diagram but not the edit panel (to keep focus)
    ftRenderDiagram(widget, toolId, data);
    ftUpdateStatus(widget, data);
    // Update edit title
    var titleEl = widget.querySelector('.ft-edit-title');
    if (titleEl && field === 'name') {
        titleEl.textContent = 'Edit: ' + (input.value || 'Unnamed');
    }
}

function ftEditGender(select) {
    var widget = select.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    if (!data.selectedId) return;
    for (var i = 0; i < data.members.length; i++) {
        if (data.members[i].id === data.selectedId) {
            data.members[i].gender = select.value;
            break;
        }
    }
    ftSaveData(toolId, data);
    ftRenderDiagram(widget, toolId, data);
}

function ftToggleText(btn) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);

    var diagram = widget.querySelector('.ft-diagram');
    var textEditor = widget.querySelector('.ft-text-editor');
    var formEditor = widget.querySelector('.ft-form-editor');
    var editPanel = widget.querySelector('.ft-edit-panel');
    var formBtn = widget.querySelector('.ft-status .ft-btn:last-child');

    if (data.mode === 'text') {
        // Apply text and switch to visual
        var newData = ftFromText(textEditor.value);
        newData.mode = 'visual';
        newData.selectedId = null;
        ftSaveData(toolId, newData);
        btn.classList.remove('active');
        btn.textContent = '✎ Text';
        diagram.style.display = '';
        textEditor.style.display = 'none';
        formEditor.style.display = 'none';
        ftRender(widget, toolId, newData);
    } else {
        // Switch to text mode (from visual or form)
        if (data.mode === 'form' && formBtn) {
            formBtn.classList.remove('active');
        }
        data.mode = 'text';
        data.selectedId = null;
        ftSaveData(toolId, data);
        btn.classList.add('active');
        btn.textContent = '✓ Apply';
        textEditor.value = ftToText(data);
        diagram.style.display = 'none';
        textEditor.style.display = '';
        formEditor.style.display = 'none';
        editPanel.style.display = 'none';
        textEditor.focus();
        ftUpdateStatus(widget, data);
    }
}

function ftToText(data) {
    if (data.members.length === 0) return '';

    // Build adjacency for tree traversal
    var memberMap = {};
    for (var i = 0; i < data.members.length; i++) {
        memberMap[data.members[i].id] = data.members[i];
    }

    var visited = {};
    var lines = [];

    function formatMember(m) {
        var s = m.name || 'Unnamed';
        s += ' (';
        s += m.birthYear || '?';
        if (m.deathYear) s += '-' + m.deathYear;
        s += ', ' + (m.gender || 'o');
        s += ')';
        return s;
    }

    function traverse(memberId, depth) {
        if (visited[memberId]) return;
        visited[memberId] = true;
        var mem = memberMap[memberId];
        if (!mem) return;
        var indent = '';
        for (var d = 0; d < depth; d++) indent += '  ';
        var line = indent + formatMember(mem);

        // Check for partner
        var partner = ftGetPartner(data, memberId);
        if (partner && !visited[partner]) {
            visited[partner] = true;
            var partnerMem = memberMap[partner];
            if (partnerMem) line += ' + ' + formatMember(partnerMem);
        }
        lines.push(line);

        // Find children
        var parentIds = [memberId];
        if (partner) parentIds.push(partner);
        var children = ftGetChildren(data, parentIds);
        for (var c = 0; c < children.length; c++) {
            traverse(children[c], depth + 1);
        }
    }

    // Start from root
    if (data.rootId && memberMap[data.rootId]) {
        traverse(data.rootId, 0);
    }
    // Add any unvisited members
    for (var j = 0; j < data.members.length; j++) {
        if (!visited[data.members[j].id]) {
            traverse(data.members[j].id, 0);
        }
    }

    return lines.join('\n');
}

function ftFromText(text) {
    var lines = text.split('\n');
    var members = [];
    var relationships = [];
    var rootId = null;
    var idCounter = 1;

    // Stack to track parent at each indent level
    // Each entry: { ids: [parentId, partnerParentId], indent: number }
    var stack = [];

    function parsePerson(str) {
        str = str.trim();
        var id = 'ft_' + Date.now() + '_' + (idCounter++);
        var name = str;
        var birthYear = '';
        var deathYear = '';
        var gender = 'o';

        var parenMatch = str.match(/^(.+?)\s*\(([^)]*)\)\s*$/);
        if (parenMatch) {
            name = parenMatch[1].trim();
            var inside = parenMatch[2].trim();
            var parts = inside.split(',').map(function(p) { return p.trim(); });
            if (parts.length >= 1) {
                var yearPart = parts[0];
                var yearMatch = yearPart.match(/^(\d+|[\?])\s*(?:-\s*(\d+))?\s*$/);
                if (yearMatch) {
                    birthYear = yearMatch[1] === '?' ? '' : yearMatch[1];
                    deathYear = yearMatch[2] || '';
                } else {
                    birthYear = yearPart;
                }
            }
            if (parts.length >= 2) {
                var g = parts[parts.length - 1].toLowerCase();
                if (g === 'm' || g === 'f' || g === 'o') gender = g;
            }
        }
        members.push({ id: id, name: name, birthYear: birthYear, deathYear: deathYear, gender: gender });
        return id;
    }

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.trim() === '') continue;

        // Calculate indent
        var indent = 0;
        while (indent < line.length && line[indent] === ' ') indent++;
        indent = Math.floor(indent / 2);

        // Split by ' + ' for partner
        var personParts = line.trim().split(/\s\+\s/);
        var personId = parsePerson(personParts[0]);
        var partnerId = null;
        if (personParts.length > 1) {
            partnerId = parsePerson(personParts[1]);
            relationships.push({ type: 'partner', from: personId, to: partnerId });
        }

        if (!rootId) rootId = personId;

        // Pop stack to find parent at indent-1
        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }
        if (stack.length > 0) {
            var parentEntry = stack[stack.length - 1];
            for (var pi = 0; pi < parentEntry.ids.length; pi++) {
                relationships.push({ type: 'parent', from: parentEntry.ids[pi], to: personId });
            }
        }

        // Push current onto stack
        var currentIds = [personId];
        if (partnerId) currentIds.push(partnerId);
        stack.push({ ids: currentIds, indent: indent });
    }

    return { members: members, relationships: relationships, selectedId: null, rootId: rootId, mode: 'visual' };
}

function ftCopySvg(btn) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    var text = ftToText(data);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    }
    var orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = orig; }, 1500);
}

function ftLoadSample(btn) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;

    var sampleText =
        'James Wilson (1940-2010, m) + Mary Wilson (1942, f)\n' +
        '  Robert Wilson (1965, m) + Susan Taylor (1967, f)\n' +
        '    Emma Wilson (1990, f)\n' +
        '    David Wilson (1993, m)\n' +
        '  Linda Wilson (1970, f) + Tom Harris (1968, m)\n' +
        '    Sarah Harris (1998, f)\n' +
        '    Jake Harris (2001, m)\n' +
        '    Lily Harris (2004, f)';

    var data = ftFromText(sampleText);
    data.mode = 'visual';
    ftSaveData(toolId, data);
    // Reset mode buttons
    var btns = widget.querySelectorAll('.ft-status .ft-btn');
    if (btns[0]) { btns[0].classList.remove('active'); btns[0].textContent = '✎ Text'; }
    if (btns[1]) { btns[1].classList.remove('active'); }
    widget.querySelector('.ft-diagram').style.display = '';
    widget.querySelector('.ft-text-editor').style.display = 'none';
    widget.querySelector('.ft-form-editor').style.display = 'none';
    ftRender(widget, toolId, data);
}

function ftSetViewFilter(btn, filterType) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    if (!data.selectedId) return;
    // Toggle off if same filter on same person
    if (data.viewFilter === filterType && data.viewFilterId === data.selectedId) {
        data.viewFilter = null;
        data.viewFilterId = null;
    } else {
        data.viewFilter = filterType;
        data.viewFilterId = data.selectedId;
    }
    ftSaveData(toolId, data);
    ftRender(widget, toolId, data);
}

function ftCollectDescendants(data, personId) {
    var ids = {};
    ids[personId] = true;
    // Include partner
    var partner = ftGetPartner(data, personId);
    if (partner) ids[partner] = true;
    var queue = [personId];
    if (partner) queue.push(partner);
    while (queue.length > 0) {
        var current = queue.shift();
        var currentPartner = ftGetPartner(data, current);
        var parentIds = [current];
        if (currentPartner) parentIds.push(currentPartner);
        var children = ftGetChildren(data, parentIds);
        for (var c = 0; c < children.length; c++) {
            if (!ids[children[c]]) {
                ids[children[c]] = true;
                queue.push(children[c]);
                // Include child's partner
                var cp = ftGetPartner(data, children[c]);
                if (cp && !ids[cp]) {
                    ids[cp] = true;
                    queue.push(cp);
                }
            }
        }
    }
    return ids;
}

function ftCollectAncestors(data, personId) {
    var ids = {};
    ids[personId] = true;
    // Include partner
    var partner = ftGetPartner(data, personId);
    if (partner) ids[partner] = true;
    var queue = [personId];
    while (queue.length > 0) {
        var current = queue.shift();
        var parents = ftGetParents(data, current);
        for (var p = 0; p < parents.length; p++) {
            if (!ids[parents[p]]) {
                ids[parents[p]] = true;
                queue.push(parents[p]);
                // Include parent's partner
                var pp = ftGetPartner(data, parents[p]);
                if (pp && !ids[pp]) {
                    ids[pp] = true;
                    queue.push(pp);
                }
            }
        }
    }
    return ids;
}

function ftFilterData(data) {
    if (!data.viewFilter || !data.viewFilterId) return data;
    // Check filter person still exists
    var exists = false;
    for (var i = 0; i < data.members.length; i++) {
        if (data.members[i].id === data.viewFilterId) { exists = true; break; }
    }
    if (!exists) return data;

    var ids;
    if (data.viewFilter === 'descendants') {
        ids = ftCollectDescendants(data, data.viewFilterId);
    } else {
        ids = ftCollectAncestors(data, data.viewFilterId);
    }

    var filtered = {
        members: data.members.filter(function(m) { return ids[m.id]; }),
        relationships: data.relationships.filter(function(r) { return ids[r.from] && ids[r.to]; }),
        selectedId: data.selectedId,
        rootId: data.viewFilter === 'ancestors' ? data.viewFilterId : data.rootId,
        mode: data.mode,
        viewFilter: data.viewFilter,
        viewFilterId: data.viewFilterId
    };
    // For ancestors view, find the topmost ancestor as root
    if (data.viewFilter === 'ancestors' && filtered.members.length > 0) {
        // Find member with no parents in the filtered set
        var topIds = [];
        for (var j = 0; j < filtered.members.length; j++) {
            var mid = filtered.members[j].id;
            var hasParent = false;
            for (var k = 0; k < filtered.relationships.length; k++) {
                if (filtered.relationships[k].type === 'parent' && filtered.relationships[k].to === mid) {
                    hasParent = true;
                    break;
                }
            }
            if (!hasParent) topIds.push(mid);
        }
        if (topIds.length > 0) filtered.rootId = topIds[0];
    }
    return filtered;
}

function ftClearAll(btn) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = { members: [], relationships: [], selectedId: null, rootId: null, mode: 'visual', viewFilter: null, viewFilterId: null };
    ftSaveData(toolId, data);
    // Reset mode buttons
    var btns = widget.querySelectorAll('.ft-status .ft-btn');
    if (btns[0]) { btns[0].classList.remove('active'); btns[0].textContent = '✎ Text'; }
    if (btns[1]) { btns[1].classList.remove('active'); }
    widget.querySelector('.ft-diagram').style.display = '';
    widget.querySelector('.ft-text-editor').style.display = 'none';
    widget.querySelector('.ft-form-editor').style.display = 'none';
    ftRender(widget, toolId, data);
}

// =============================================
// FAMILY TREE — FORM EDITOR
// =============================================

function ftToggleForm(btn) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);

    var diagram = widget.querySelector('.ft-diagram');
    var textEditor = widget.querySelector('.ft-text-editor');
    var formEditor = widget.querySelector('.ft-form-editor');
    var editPanel = widget.querySelector('.ft-edit-panel');
    var textBtn = widget.querySelectorAll('.ft-status .ft-btn')[0];

    if (data.mode === 'form') {
        // Switch back to visual
        data.mode = 'visual';
        data.selectedId = null;
        ftSaveData(toolId, data);
        btn.classList.remove('active');
        diagram.style.display = '';
        formEditor.style.display = 'none';
        ftRender(widget, toolId, data);
    } else {
        // Entering form mode — if in text mode, apply text first
        if (data.mode === 'text') {
            var newData = ftFromText(textEditor.value);
            newData.mode = 'form';
            newData.selectedId = null;
            ftSaveData(toolId, newData);
            data = newData;
            if (textBtn) { textBtn.classList.remove('active'); textBtn.textContent = '✎ Text'; }
        } else {
            data.mode = 'form';
            data.selectedId = null;
            ftSaveData(toolId, data);
        }
        btn.classList.add('active');
        diagram.style.display = 'none';
        textEditor.style.display = 'none';
        formEditor.style.display = '';
        editPanel.style.display = 'none';
        ftRenderForm(widget, toolId, data);
        ftUpdateStatus(widget, data);
    }
}

function ftRenderForm(widget, toolId, data) {
    var formEditor = widget.querySelector('.ft-form-editor');
    if (data.members.length === 0) {
        formEditor.innerHTML = '<div class="ft-empty">No members yet. Add a person to get started.</div>';
        return;
    }

    // Build member map for lookups
    var memberMap = {};
    for (var i = 0; i < data.members.length; i++) {
        memberMap[data.members[i].id] = data.members[i];
    }

    var html = '';
    for (var i = 0; i < data.members.length; i++) {
        var m = data.members[i];
        var isRoot = data.rootId === m.id;
        var genderIcon = m.gender === 'm' ? '\u2642' : m.gender === 'f' ? '\u2640' : '\u26A5';

        // Relationships
        var partnerId = ftGetPartner(data, m.id);
        var partnerName = partnerId && memberMap[partnerId] ? memberMap[partnerId].name || 'Unnamed' : null;
        var parentIds = ftGetParents(data, m.id);
        var parentNames = [];
        for (var p = 0; p < parentIds.length; p++) {
            if (memberMap[parentIds[p]]) parentNames.push(memberMap[parentIds[p]].name || 'Unnamed');
        }
        var childIds = ftGetChildren(data, [m.id]);
        var childNames = [];
        for (var c = 0; c < childIds.length; c++) {
            if (memberMap[childIds[c]]) childNames.push(memberMap[childIds[c]].name || 'Unnamed');
        }

        var esc = function(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

        html += '<div class="ft-form-card' + (isRoot ? ' root' : '') + '">';

        // Header
        html += '<div class="ft-form-header"><span class="ft-form-icon">' + genderIcon + '</span>';
        if (isRoot) html += ' <span class="ft-form-badge">ROOT</span>';
        html += '</div>';

        // Fields row
        html += '<div class="ft-form-fields">';
        html += '<input type="text" data-field="name" value="' + esc(m.name || '') + '" placeholder="Name" oninput="ftFormEditField(this,\'' + m.id + '\',\'name\')">';
        html += '<input type="text" data-field="birthYear" value="' + esc(String(m.birthYear || '')) + '" placeholder="Born" oninput="ftFormEditField(this,\'' + m.id + '\',\'birthYear\')">';
        html += '<input type="text" data-field="deathYear" value="' + esc(String(m.deathYear || '')) + '" placeholder="Died" oninput="ftFormEditField(this,\'' + m.id + '\',\'deathYear\')">';
        html += '<select onchange="ftFormEditGender(this,\'' + m.id + '\')">';
        html += '<option value="m"' + (m.gender === 'm' ? ' selected' : '') + '>Male</option>';
        html += '<option value="f"' + (m.gender === 'f' ? ' selected' : '') + '>Female</option>';
        html += '<option value="o"' + (m.gender === 'o' ? ' selected' : '') + '>Other</option>';
        html += '</select>';
        html += '</div>';

        // Relationships
        var rels = [];
        if (partnerName) rels.push('Partner: <span>' + esc(partnerName) + '</span>');
        if (parentNames.length > 0) rels.push('Parents: <span>' + parentNames.map(esc).join(' &amp; ') + '</span>');
        if (childNames.length > 0) rels.push('Children: <span>' + childNames.map(esc).join(', ') + '</span>');
        if (rels.length > 0) {
            html += '<div class="ft-form-rels">' + rels.join(' \u00B7 ') + '</div>';
        }

        // Actions
        html += '<div class="ft-form-actions">';
        html += '<button onclick="ftFormAddChild(this,\'' + m.id + '\')">+ Child</button>';
        if (!partnerId) {
            html += '<button onclick="ftFormAddPartner(this,\'' + m.id + '\')">+ Partner</button>';
        }
        if (isRoot) {
            html += '<button disabled>Root</button>';
        } else {
            html += '<button onclick="ftFormSetRoot(this,\'' + m.id + '\')">Set Root</button>';
        }
        html += '<button class="danger" onclick="ftFormDelete(this,\'' + m.id + '\')">Delete</button>';
        html += '</div>';

        html += '</div>';
    }
    formEditor.innerHTML = html;
}

function ftFormEditField(input, memberId, field) {
    var widget = input.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    for (var i = 0; i < data.members.length; i++) {
        if (data.members[i].id === memberId) {
            data.members[i][field] = input.value;
            break;
        }
    }
    ftSaveData(toolId, data);
    ftUpdateStatus(widget, data);
}

function ftFormEditGender(select, memberId) {
    var widget = select.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    for (var i = 0; i < data.members.length; i++) {
        if (data.members[i].id === memberId) {
            data.members[i].gender = select.value;
            break;
        }
    }
    ftSaveData(toolId, data);
    ftRenderForm(widget, toolId, data);
}

function ftFormAddChild(btn, memberId) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    var newId = ftGenId();
    data.members.push({ id: newId, name: 'Child', birthYear: '', deathYear: '', gender: 'o' });
    data.relationships.push({ type: 'parent', from: memberId, to: newId });
    var partner = ftGetPartner(data, memberId);
    if (partner) {
        data.relationships.push({ type: 'parent', from: partner, to: newId });
    }
    ftSaveData(toolId, data);
    ftRenderForm(widget, toolId, data);
    ftUpdateStatus(widget, data);
}

function ftFormAddPartner(btn, memberId) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    if (ftGetPartner(data, memberId)) return;
    var newId = ftGenId();
    data.members.push({ id: newId, name: 'Partner', birthYear: '', deathYear: '', gender: 'o' });
    data.relationships.push({ type: 'partner', from: memberId, to: newId });
    ftSaveData(toolId, data);
    ftRenderForm(widget, toolId, data);
    ftUpdateStatus(widget, data);
}

function ftFormSetRoot(btn, memberId) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    data.rootId = memberId;
    ftSaveData(toolId, data);
    ftRenderForm(widget, toolId, data);
}

function ftFormDelete(btn, memberId) {
    var widget = btn.closest('.ft-widget');
    var toolId = ftGetToolId(widget);
    if (!toolId) return;
    var data = ftGetData(toolId);
    data.members = data.members.filter(function(m) { return m.id !== memberId; });
    data.relationships = data.relationships.filter(function(r) { return r.from !== memberId && r.to !== memberId; });
    if (data.rootId === memberId) {
        data.rootId = data.members.length > 0 ? data.members[0].id : null;
    }
    ftSaveData(toolId, data);
    ftRenderForm(widget, toolId, data);
    ftUpdateStatus(widget, data);
}

// =============================================
// SCRIPT INJECTION FOR HTML EXPORT
// =============================================

(function injectScriptsForExport() {
    if (document.getElementById('creative-tools-scripts')) return;

    var cpkFunctions = [cpkHsvToRgb, cpkRgbToHsv, cpkRgbToHsl, cpkHslToRgb, cpkGetState, cpkDrawWheel, cpkDrawSV, cpkUpdateCursors, cpkUpdateAlpha, cpkUpdateValues, cpkFullUpdate, cpkWheelEvent, cpkSVEvent, cpkAlphaEvent, cpkMakeDraggable, cpkHexTyped, cpkRgbaTyped, cpkHslaTyped, cpkAlphaTyped, cpkCopyVal, cpkSaveColor, cpkInit];
    var emoteFunctions = [emoteInit, emoteSelectTab, emoteRender, emoteSearch, emoteCopy];
    var drawFunctions = [drawGetState, drawInit, drawBeginStroke, drawMoveStroke, drawEndStroke, drawSetColor, drawSetSize, drawToggleEraser, drawClear, drawUndo, drawDownload, drawResizeCanvas, drawColorInput, drawSizeInput];
    var ftFunctions = [ftGetToolId, ftGetData, ftSaveData, ftGenId, ftInit, ftRender, ftUpdateStatus, ftRenderEditPanel, ftRenderDiagram, ftEscSvg, ftLayoutTree, ftFindGenerations, ftGetPartner, ftGetChildren, ftGetParents, ftSelectNode, ftAddPerson, ftAddChild, ftAddPartner, ftDeletePerson, ftSetRoot, ftEditField, ftEditGender, ftToggleText, ftToText, ftFromText, ftCopySvg, ftLoadSample, ftSetViewFilter, ftCollectDescendants, ftCollectAncestors, ftFilterData, ftClearAll, ftToggleForm, ftRenderForm, ftFormEditField, ftFormEditGender, ftFormAddChild, ftFormAddPartner, ftFormSetRoot, ftFormDelete];
    var allFunctions = cpkFunctions.concat(emoteFunctions).concat(drawFunctions).concat(ftFunctions);

    var code = '(function() {\n' +
        'if (typeof cpkInit !== "undefined") return;\n' +
        'window._cpkState = new WeakMap();\n' +
        'window._drawState = new WeakMap();\n' +
        'window.EMOTE_DATA = ' + JSON.stringify(EMOTE_DATA) + ';\n' +
        allFunctions.map(function(fn) { return 'window.' + fn.name + ' = ' + fn.toString(); }).join(';\n') + ';\n' +
        '})();';
    var encoded = btoa(unescape(encodeURIComponent(code)));

    var script = document.createElement('script');
    script.id = 'creative-tools-scripts';
    script.textContent = 'eval(decodeURIComponent(escape(atob("' + encoded + '"))))';
    (document.body || document.head).appendChild(script);
})();

// =============================================
// REGISTRATIONS
// =============================================

PluginRegistry.registerToolbox({
    id: 'creative-tools',
    name: 'Creative Tools',
    description: 'Color picking and emoji browsing tools',
    icon: '\uD83C\uDFA8',
    color: '#e74c3c',
    version: '1.0.0',
    tools: ['color-picker', 'drawing-canvas', 'emoticon-picker', 'family-tree'],
    source: 'external'
});

// Color Picker
PluginRegistry.registerTool({
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Color wheel with alpha, hex/rgba/hsla values',
    icon: '\uD83C\uDFA8',
    version: '1.0.0',
    toolbox: 'creative-tools',
    tags: ['color', 'colour', 'picker', 'wheel', 'hex', 'rgb', 'hsl', 'alpha', 'css'],
    title: 'Color Picker',
    content: '<div class="cpk-widget">' +
        '<div class="cpk-canvas-row">' +
            '<div class="cpk-wheel-wrap">' +
                '<canvas class="cpk-wheel-canvas" width="180" height="180"></canvas>' +
                '<div class="cpk-wheel-cursor"></div>' +
            '</div>' +
            '<div class="cpk-sv-wrap">' +
                '<canvas class="cpk-sv-canvas"></canvas>' +
                '<div class="cpk-sv-cursor"></div>' +
            '</div>' +
        '</div>' +
        '<div class="cpk-alpha-row">' +
            '<span class="cpk-alpha-label">A</span>' +
            '<div class="cpk-alpha-track">' +
                '<div class="cpk-alpha-checker"></div>' +
                '<div class="cpk-alpha-gradient"></div>' +
                '<div class="cpk-alpha-thumb"></div>' +
            '</div>' +
            '<input type="text" class="cpk-alpha-input" value="100%" oninput="cpkAlphaTyped(this)">' +
        '</div>' +
        '<div class="cpk-preview-row">' +
            '<div class="cpk-swatch"><div class="cpk-swatch-checker"></div><div class="cpk-swatch-color"></div></div>' +
            '<div class="cpk-values">' +
                '<div class="cpk-val-row"><span class="cpk-val-label">HEX</span><input class="cpk-val-input cpk-hex-input" spellcheck="false" oninput="cpkHexTyped(this)"><button class="cpk-copy-btn" onclick="cpkCopyVal(this)">Copy</button></div>' +
                '<div class="cpk-val-row"><span class="cpk-val-label">RGBA</span><input class="cpk-val-input cpk-rgba-input" spellcheck="false" oninput="cpkRgbaTyped(this)"><button class="cpk-copy-btn" onclick="cpkCopyVal(this)">Copy</button></div>' +
                '<div class="cpk-val-row"><span class="cpk-val-label">HSLA</span><input class="cpk-val-input cpk-hsla-input" spellcheck="false" oninput="cpkHslaTyped(this)"><button class="cpk-copy-btn" onclick="cpkCopyVal(this)">Copy</button></div>' +
            '</div>' +
        '</div>' +
        '<div class="cpk-saved-row">' +
            '<span class="cpk-saved-label">Saved:</span>' +
            '<button class="cpk-save-btn" onclick="cpkSaveColor(this)" title="Save current color">+</button>' +
        '</div>' +
    '</div>',
    contentType: 'html',
    onInit: 'cpkInit',
    source: 'external',
    defaultWidth: 340,
    defaultHeight: 420
});

// Emoticon Picker
PluginRegistry.registerTool({
    id: 'emoticon-picker',
    name: 'Emoticon Picker',
    description: 'Browse and copy emojis, kaomoji, and text emoticons',
    icon: '\uD83D\uDE0E',
    version: '1.0.0',
    toolbox: 'creative-tools',
    tags: ['emoji', 'emoticon', 'kaomoji', 'smiley', 'copy', 'unicode'],
    title: 'Emoticon Picker',
    content: '<div class="emote-widget">' +
        '<div class="emote-search">' +
            '<input type="text" placeholder="Search emojis..." oninput="emoteSearch(this)">' +
        '</div>' +
        '<div class="emote-tabs"></div>' +
        '<div class="emote-grid-wrap">' +
            '<div class="emote-grid"></div>' +
        '</div>' +
        '<div class="emote-status"></div>' +
    '</div>',
    contentType: 'html',
    onInit: 'emoteInit',
    source: 'external',
    defaultWidth: 360,
    defaultHeight: 420
});

// Drawing Canvas
PluginRegistry.registerTool({
    id: 'drawing-canvas',
    name: 'Drawing Canvas',
    description: 'Freehand drawing canvas with colors, brush sizes, eraser, undo, and PNG download',
    icon: '\u270F\uFE0F',
    version: '1.0.0',
    toolbox: 'creative-tools',
    tags: ['draw', 'drawing', 'paint', 'canvas', 'sketch', 'brush', 'pen', 'art', 'freehand'],
    title: 'Drawing Canvas',
    content: '<div class="draw-widget">' +
        '<div class="draw-toolbar">' +
            '<div class="draw-swatch" data-color="#000000" style="background:#000000" onclick="drawSetColor(this.closest(\'.draw-widget\'),\'#000000\')" title="Black"></div>' +
            '<div class="draw-swatch" data-color="#e74c3c" style="background:#e74c3c" onclick="drawSetColor(this.closest(\'.draw-widget\'),\'#e74c3c\')" title="Red"></div>' +
            '<div class="draw-swatch" data-color="#e67e22" style="background:#e67e22" onclick="drawSetColor(this.closest(\'.draw-widget\'),\'#e67e22\')" title="Orange"></div>' +
            '<div class="draw-swatch" data-color="#f1c40f" style="background:#f1c40f" onclick="drawSetColor(this.closest(\'.draw-widget\'),\'#f1c40f\')" title="Yellow"></div>' +
            '<div class="draw-swatch" data-color="#27ae60" style="background:#27ae60" onclick="drawSetColor(this.closest(\'.draw-widget\'),\'#27ae60\')" title="Green"></div>' +
            '<div class="draw-swatch" data-color="#3498db" style="background:#3498db" onclick="drawSetColor(this.closest(\'.draw-widget\'),\'#3498db\')" title="Blue"></div>' +
            '<div class="draw-swatch" data-color="#9b59b6" style="background:#9b59b6" onclick="drawSetColor(this.closest(\'.draw-widget\'),\'#9b59b6\')" title="Purple"></div>' +
            '<div class="draw-swatch" data-color="#ffffff" style="background:#ffffff;border-color:var(--border-color)" onclick="drawSetColor(this.closest(\'.draw-widget\'),\'#ffffff\')" title="White"></div>' +
            '<input type="color" class="draw-color-input" value="#000000" oninput="drawColorInput(this)" title="Custom color">' +
            '<input type="range" min="1" max="40" value="4" oninput="drawSizeInput(this)" title="Brush size">' +
            '<span class="draw-size-label">4px</span>' +
            '<button class="draw-eraser-btn" onclick="drawToggleEraser(this.closest(\'.draw-widget\'))" title="Toggle eraser">Eraser</button>' +
        '</div>' +
        '<div class="draw-canvas-wrap">' +
            '<canvas class="draw-canvas"></canvas>' +
        '</div>' +
        '<div class="draw-actions">' +
            '<button onclick="drawClear(this.closest(\'.draw-widget\'))">Clear</button>' +
            '<button onclick="drawUndo(this.closest(\'.draw-widget\'))">Undo</button>' +
            '<button onclick="drawDownload(this.closest(\'.draw-widget\'))">Download PNG</button>' +
            '<span class="draw-status"></span>' +
        '</div>' +
    '</div>',
    contentType: 'html',
    onInit: 'drawInit',
    source: 'external',
    defaultWidth: 480,
    defaultHeight: 420
});

// Family Tree
PluginRegistry.registerTool({
    id: 'family-tree',
    name: 'Family Tree',
    description: 'Build and visualize multi-generational family trees',
    icon: '🌳',
    version: '1.0.0',
    toolbox: 'creative-tools',
    tags: ['family', 'tree', 'genealogy', 'diagram', 'relationship', 'graph'],
    title: 'Family Tree',
    content: '<div class="ft-widget">' +
        '<div class="ft-toolbar">' +
            '<button class="ft-btn primary" onclick="ftAddPerson(this)">+ Add Person</button>' +
            '<button class="ft-btn" onclick="ftLoadSample(this)">Sample</button>' +
            '<button class="ft-btn" onclick="ftCopySvg(this)">Copy</button>' +
            '<button class="ft-btn danger" onclick="ftClearAll(this)">Clear</button>' +
        '</div>' +
        '<div class="ft-diagram"><div class="ft-empty">Add a person or load a sample to get started</div></div>' +
        '<textarea class="ft-text-editor" placeholder="Name (birthYear-deathYear, gender) + Partner (year, gender)\n  Child Name (year, gender)\n\nGender: m, f, or o"></textarea>' +
        '<div class="ft-form-editor"></div>' +
        '<div class="ft-edit-panel" style="display:none"></div>' +
        '<div class="ft-status"><span class="ft-status-text"></span><span style="display:flex;gap:4px"><button class="ft-btn" onclick="ftToggleText(this)">✎ Text</button><button class="ft-btn" onclick="ftToggleForm(this)">☰ Form</button></span></div>' +
    '</div>',
    contentType: 'html',
    onInit: 'ftInit',
    source: 'external',
    defaultWidth: 500,
    defaultHeight: 500
});

console.log('Creative Tools plugin loaded (4 tools)');
