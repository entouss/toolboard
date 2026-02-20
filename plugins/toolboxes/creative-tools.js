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

/* Image Viewer Widget Styles */
.tool-content:has(.imgv-widget) { display: flex; flex-direction: column; }
.imgv-widget { padding: 0; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; }
.imgv-input-row { display: flex; gap: 4px; padding: 6px 8px; flex-shrink: 0; border-bottom: 1px solid var(--border-color); }
.imgv-input-row input { flex: 1; padding: 4px 8px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; background: var(--input-bg); color: var(--text-primary); min-width: 0; }
.imgv-input-row input:focus { outline: none; border-color: #3498db; }
.imgv-input-row input::placeholder { color: var(--text-muted); }
.imgv-input-row button { padding: 4px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 3px; flex-shrink: 0; }
.imgv-input-row button:hover { background: var(--table-hover); }
.imgv-display { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; background-image: linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0; position: relative; }
.imgv-display.dragover { outline: 2px dashed #3498db; outline-offset: -4px; }
.imgv-display img { width: 100%; height: 100%; object-fit: contain; display: block; }
.imgv-display .imgv-placeholder { color: var(--text-muted); font-size: 11px; text-align: center; padding: 20px; line-height: 1.6; }
.imgv-controls { max-height: 200px; overflow-y: auto; border-top: 1px solid var(--border-color); flex-shrink: 0; padding: 6px 8px; }
.imgv-section-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin: 4px 0 2px; }
.imgv-section-label:first-child { margin-top: 0; }
.imgv-slider-row { display: flex; align-items: center; gap: 4px; margin-bottom: 2px; }
.imgv-slider-row label { font-size: 10px; color: var(--text-secondary); width: 62px; flex-shrink: 0; }
.imgv-slider-row input[type="range"] { flex: 1; min-width: 0; }
.imgv-slider-row .imgv-val { font-size: 10px; font-family: monospace; color: var(--text-primary); width: 36px; text-align: right; flex-shrink: 0; }
.imgv-flip-row { display: flex; gap: 4px; margin-top: 4px; align-items: center; }
.imgv-flip-btn { padding: 2px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 10px; border-radius: 3px; }
.imgv-flip-btn:hover { background: var(--table-hover); }
.imgv-flip-btn.active { background: #3498db; color: white; border-color: #3498db; }
.imgv-reset-btn { margin-left: auto; padding: 2px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 10px; border-radius: 3px; }
.imgv-reset-btn:hover { background: var(--table-hover); }
.imgv-trans-row { display: flex; align-items: center; gap: 4px; margin-bottom: 2px; }
.imgv-trans-row label { font-size: 10px; color: var(--text-secondary); width: 62px; flex-shrink: 0; }
.imgv-trans-color { width: 24px; height: 20px; padding: 0; border: 1px solid var(--border-color); border-radius: 3px; cursor: pointer; flex-shrink: 0; }
.imgv-pick-btn { padding: 2px 6px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 10px; border-radius: 3px; }
.imgv-pick-btn:hover { background: var(--table-hover); }
.imgv-pick-btn.active { background: #e74c3c; color: white; border-color: #e74c3c; }
.imgv-display.eyedropper { cursor: crosshair; }
.imgv-display.eyedropper img { cursor: crosshair; }
.imgv-widget.render-mode .imgv-input-row { display: none; }
.imgv-widget.render-mode .imgv-controls { display: none; }
.imgv-widget.render-mode .imgv-display { background-image: none; background: transparent; }
.tool:has(.imgv-widget.render-mode) { background: transparent; box-shadow: none; }
.imgv-mode-toggle { position: absolute; top: 6px; right: 6px; padding: 3px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 10px; border-radius: 3px; opacity: 0; transition: opacity 0.2s; z-index: 2; }
.imgv-display:hover .imgv-mode-toggle { opacity: 1; }
.imgv-widget.render-mode .imgv-mode-toggle { opacity: 0; }
.imgv-widget.render-mode .imgv-display:hover .imgv-mode-toggle { opacity: 0.8; }

/* Image Viewer Crop Mode */
.imgv-crop-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; cursor: crosshair; z-index: 3; display: none; }
.imgv-widget.crop-mode .imgv-crop-overlay { display: block; }
.imgv-crop-rect { position: absolute; border: 2px dashed #3498db; box-shadow: 0 0 0 9999px rgba(0,0,0,0.5); cursor: move; min-width: 20px; min-height: 20px; box-sizing: border-box; }
.imgv-crop-handle { position: absolute; width: 10px; height: 10px; background: #fff; border: 1px solid #3498db; box-sizing: border-box; z-index: 1; }
.imgv-crop-handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
.imgv-crop-handle.n  { top: -5px; left: 50%; margin-left: -5px; cursor: n-resize; }
.imgv-crop-handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
.imgv-crop-handle.e  { top: 50%; margin-top: -5px; right: -5px; cursor: e-resize; }
.imgv-crop-handle.se { bottom: -5px; right: -5px; cursor: se-resize; }
.imgv-crop-handle.s  { bottom: -5px; left: 50%; margin-left: -5px; cursor: s-resize; }
.imgv-crop-handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
.imgv-crop-handle.w  { top: 50%; margin-top: -5px; left: -5px; cursor: w-resize; }
.imgv-crop-info { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #fff; background: rgba(0,0,0,0.6); padding: 1px 6px; border-radius: 3px; white-space: nowrap; pointer-events: none; }
.imgv-crop-bar { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); display: none; gap: 6px; z-index: 4; }
.imgv-widget.crop-mode .imgv-crop-bar { display: flex; }
.imgv-crop-bar button { padding: 4px 12px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; cursor: pointer; }
.imgv-crop-bar .imgv-crop-apply { background: #27ae60; color: white; border-color: #27ae60; }
.imgv-crop-bar .imgv-crop-apply:hover { background: #219a52; }
.imgv-crop-bar .imgv-crop-cancel-btn { background: var(--bg-tertiary); color: var(--text-primary); }
.imgv-crop-bar .imgv-crop-cancel-btn:hover { background: var(--table-hover); }
.imgv-widget.crop-mode .imgv-mode-toggle { display: none; }
.imgv-widget.crop-mode .imgv-controls { pointer-events: none; opacity: 0.5; }
.imgv-widget.crop-mode .imgv-input-row { pointer-events: none; opacity: 0.5; }
.imgv-meme-text { position: absolute; left: 0; right: 0; text-align: center; padding: 8px 10px; font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif; font-size: 32px; text-transform: uppercase; color: white; -webkit-text-stroke: 2px black; text-shadow: 2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black; line-height: 1.1; word-wrap: break-word; pointer-events: none; z-index: 1; user-select: none; }
.imgv-meme-top { top: 0; }
.imgv-meme-bottom { bottom: 0; }
.imgv-meme-row { display: flex; align-items: center; gap: 4px; margin-bottom: 2px; }
.imgv-meme-row label { font-size: 10px; width: 62px; min-width: 62px; color: var(--text-muted); }
.imgv-meme-input { flex: 1; padding: 2px 4px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; background: var(--bg-primary); color: var(--text-primary); }
.imgv-svg-row { display: flex; gap: 4px; margin-top: 4px; align-items: center; }
.imgv-svg-row select { padding: 2px 4px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 10px; background: var(--bg-tertiary); color: var(--text-primary); }
.imgv-svg-modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg, rgba(0,0,0,0.6)); z-index: 10015; justify-content: center; align-items: center; }
.imgv-svg-modal.open { display: flex; }
.imgv-svg-preview { background: var(--bg-secondary, #fff); border-radius: 8px; max-width: 90%; max-height: 80vh; overflow: auto; padding: 16px; position: relative; }
.imgv-svg-preview svg { max-width: 100%; height: auto; display: block; }
.imgv-svg-actions { display: flex; gap: 6px; margin-bottom: 10px; }
.imgv-svg-actions button { padding: 4px 12px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 3px; }
.imgv-svg-actions button:hover { background: var(--table-hover); }

/* Music Sheet Widget Styles */
.msheet-widget { padding: 6px; display: flex; flex-direction: column; user-select: none; position: relative; height: 100%; box-sizing: border-box; }
.msheet-toolbar { display: flex; align-items: center; gap: 5px; margin-bottom: 4px; flex-wrap: wrap; }
.msheet-toolbar select, .msheet-toolbar input { font-size: 12px; padding: 2px 4px; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 3px; }
.msheet-toolbar input[type="range"] { width: 60px; }
.msheet-tempo-label { font-size: 11px; color: var(--text-secondary); min-width: 30px; }
.msheet-canvas-wrap { flex: 1; min-height: 0; overflow-x: auto; overflow-y: hidden; border: 1px solid var(--border-color); border-radius: 4px; background: #fff; position: relative; cursor: crosshair; }
.msheet-canvas-wrap canvas { display: block; }
.msheet-hint { font-size: 10px; color: var(--text-muted); text-align: center; margin-top: 3px; }
.msheet-playing { box-shadow: inset 0 0 0 2px #3498db; }

/* Pixel Art Editor Widget Styles */
.tool-content:has(.paed-widget) { display: flex; flex-direction: column; }
.paed-widget { padding: 0; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; }
.paed-toolbar { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; flex-wrap: wrap; }
.paed-toolbar select { font-size: 11px; padding: 2px 4px; background: var(--input-bg); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 3px; }
.paed-toolbar button { padding: 3px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 3px; flex-shrink: 0; }
.paed-toolbar button:hover { background: var(--table-hover); }
.paed-toolbar button.active { background: #3498db; color: white; border-color: #3498db; }
.paed-toolbar .paed-sep { width: 1px; height: 18px; background: var(--border-color); flex-shrink: 0; }
.paed-palette { display: flex; align-items: center; gap: 3px; padding: 4px 8px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; flex-wrap: wrap; }
.paed-swatch { width: 18px; height: 18px; border-radius: 3px; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; box-sizing: border-box; }
.paed-swatch:hover { border-color: var(--text-muted); }
.paed-swatch.active { border-color: #3498db; box-shadow: 0 0 0 1px #3498db; }
.paed-palette input[type="color"] { width: 18px; height: 18px; border: 1px solid var(--border-color); border-radius: 3px; padding: 0; cursor: pointer; background: none; flex-shrink: 0; }
.paed-canvas-wrap { flex: 1; position: relative; min-height: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; background-image: linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0; }
.paed-canvas { image-rendering: pixelated; cursor: crosshair; touch-action: none; }
.paed-actions { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-top: 1px solid var(--border-color); flex-shrink: 0; }
.paed-actions button { padding: 4px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 3px; }
.paed-actions button:hover { background: var(--table-hover); }
.paed-actions .paed-status { flex: 1; text-align: right; font-size: 10px; color: var(--text-muted); }

/* Color Palette Generator Styles */
.tool-content:has(.cpal-widget) { display: flex; flex-direction: column; }
.cpal-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 8px; }
.cpal-toolbar { display: flex; align-items: center; gap: 6px; flex-shrink: 0; flex-wrap: wrap; }
.cpal-toolbar select { padding: 4px 6px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; background: var(--input-bg); color: var(--text-primary); cursor: pointer; }
.cpal-toolbar select:focus { outline: none; border-color: #3498db; }
.cpal-toolbar input[type="color"] { width: 28px; height: 28px; border: 1px solid var(--border-color); border-radius: 4px; padding: 0; cursor: pointer; background: none; flex-shrink: 0; }
.cpal-toolbar button { padding: 4px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 3px; flex-shrink: 0; }
.cpal-toolbar button:hover { background: var(--table-hover); }
.cpal-grid { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; align-content: flex-start; min-height: 0; overflow-y: auto; padding: 4px 0; }
.cpal-swatch { position: relative; flex: 1 1 60px; min-width: 60px; max-width: 120px; min-height: 80px; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; overflow: hidden; transition: transform 0.1s; }
.cpal-swatch:hover { transform: scale(1.04); }
.cpal-swatch-color { position: absolute; inset: 0; border-radius: 5px; }
.cpal-swatch-label { position: relative; z-index: 1; font-size: 10px; font-family: monospace; padding: 3px 6px; background: rgba(0,0,0,0.45); color: #fff; width: 100%; text-align: center; box-sizing: border-box; letter-spacing: 0.3px; }
.cpal-swatch-lock { position: absolute; top: 4px; right: 4px; z-index: 1; width: 20px; height: 20px; border: none; border-radius: 3px; background: rgba(0,0,0,0.3); color: rgba(255,255,255,0.7); cursor: pointer; font-size: 11px; line-height: 20px; text-align: center; padding: 0; opacity: 0; transition: opacity 0.15s; }
.cpal-swatch:hover .cpal-swatch-lock { opacity: 1; }
.cpal-swatch-lock.locked { opacity: 1; background: rgba(0,0,0,0.55); color: #fff; }
.cpal-swatch.copied .cpal-swatch-label { background: rgba(39,174,96,0.8); }
.cpal-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.cpal-actions button { padding: 4px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 3px; }
.cpal-actions button:hover { background: var(--table-hover); }
.cpal-status { flex: 1; text-align: right; font-size: 10px; color: var(--text-muted); min-height: 16px; }
.cpal-status.success { color: var(--success-text, #27ae60); }

/* SVG Path Editor Styles */
.tool-content:has(.spe-widget) { display: flex; flex-direction: column; }
.spe-widget { padding: 0; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; }
.spe-toolbar { display: flex; align-items: center; gap: 4px; padding: 6px 8px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; flex-wrap: wrap; }
.spe-sep { width: 1px; height: 18px; background: var(--border-color); flex-shrink: 0; }
.spe-tool-btn { padding: 3px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 3px; flex-shrink: 0; }
.spe-tool-btn:hover { background: var(--table-hover); }
.spe-tool-btn.active { background: #3498db; color: white; border-color: #3498db; }
.spe-canvas-wrap { flex: 1; position: relative; min-height: 0; overflow: hidden; }
.spe-svg { width: 100%; height: 100%; background-image: linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px); background-size: 20px 20px; cursor: crosshair; display: block; }
.spe-svg.move-mode { cursor: default; }
.spe-path { fill: none; stroke: #3498db; stroke-width: 2; }
.spe-point { fill: #3498db; stroke: #fff; stroke-width: 1.5; cursor: grab; }
.spe-point.selected { fill: #e74c3c; stroke: #fff; }
.spe-point.dragging { cursor: grabbing; }
.spe-control-point { fill: #e67e22; stroke: #fff; stroke-width: 1.5; cursor: grab; }
.spe-control-point.dragging { cursor: grabbing; }
.spe-control-line { stroke: #e67e22; stroke-width: 1; stroke-dasharray: 4 3; fill: none; opacity: 0.6; }
.spe-output-wrap { display: flex; gap: 4px; padding: 4px 8px; border-top: 1px solid var(--border-color); flex-shrink: 0; }
.spe-output { flex: 1; padding: 4px 6px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; font-family: monospace; background: var(--input-bg); color: var(--text-primary); resize: none; height: 22px; min-width: 0; }
.spe-output:focus { outline: none; border-color: #3498db; }
.spe-actions { display: flex; align-items: center; gap: 6px; padding: 4px 8px; border-top: 1px solid var(--border-color); flex-shrink: 0; }
.spe-btn { padding: 3px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 3px; }
.spe-btn:hover { background: var(--table-hover); }
.spe-status { flex: 1; text-align: right; font-size: 10px; color: var(--text-muted); min-height: 14px; }
.spe-status.success { color: var(--success-text, #27ae60); }
.spe-hint { font-size: 10px; color: var(--text-muted); text-align: center; padding: 2px 8px 4px; flex-shrink: 0; }

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
        ['\uD83D\uDC3F\uFE0F','chipmunk'],['\uD83E\uDD94','hedgehog'],['\uD83E\uDDA5','sloth'],['\uD83E\uDDA6','otter'],['\uD83E\uDDA8','skunk'],['\uD83E\uDDA1','badger'],['\uD83E\uDDAB','beaver'],
        ['\uD83E\uDDA3','mammoth'],['\uD83E\uDDA4','dodo'],['\uD83E\uDEB6','feather'],['\uD83D\uDC3E','paw prints'],
        ['\uD83E\uDDAD','seal'],['\uD83E\uDEBC','jellyfish'],['\uD83E\uDD9E','lobster'],
        ['\uD83E\uDD9F','mosquito'],['\uD83E\uDEB3','cockroach'],['\uD83E\uDEB2','beetle'],['\uD83E\uDD97','cricket'],['\uD83D\uDD77\uFE0F','spider'],['\uD83D\uDD78\uFE0F','spider web'],
        ['\uD83E\uDDA0','microbe virus bacteria'],['\uD83D\uDC09','dragon'],['\uD83D\uDC32','dragon face']
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
        ['\uD83C\uDF78','cocktail martini'],['\uD83C\uDF79','tropical drink'],['\uD83E\uDDCA','ice'],
        ['\uD83E\uDD67','pie'],['\uD83C\uDF6F','honey pot'],['\uD83E\uDD5C','peanuts'],['\uD83C\uDF30','chestnut'],['\uD83E\uDED8','beans'],
        ['\uD83E\uDD62','chopsticks'],['\uD83C\uDF7D\uFE0F','plate fork knife'],['\uD83E\uDD44','spoon'],['\uD83D\uDD2A','knife'],['\uD83C\uDFFA','amphora jar'],
        ['\uD83C\uDF76','sake'],['\uD83E\uDED6','teapot'],['\uD83E\uDD43','whiskey tumbler'],['\uD83C\uDF7E','champagne bottle'],
        ['\uD83E\uDD6B','canned food'],['\uD83E\uDED5','fondue'],['\uD83E\uDED3','flatbread'],['\uD83E\uDD59','falafel wrap'],['\uD83E\uDDC6','butter'],
        ['\uD83C\uDF67','shaved ice'],['\uD83C\uDF66','soft ice cream'],['\uD83C\uDF68','ice cream sundae'],['\uD83E\uDD6F','bagel'],['\uD83E\uDDC7','waffle']
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
        ['\uD83C\uDFBE','tennis'],['\uD83C\uDFAE','game controller'],['\uD83C\uDFB2','dice'],['\uD83C\uDFAF','bullseye dart'],['\uD83E\uDDE9','puzzle piece'],['\u265F\uFE0F','chess'],
        ['\uD83D\uDCF2','mobile arrow phone'],['\uD83D\uDD0B','battery'],['\uD83D\uDD0C','electric plug'],['\uD83E\uDE9F','wifi wireless'],
        ['\uD83D\uDCE7','email envelope'],['\uD83D\uDCE8','incoming envelope'],['\uD83D\uDCE9','envelope arrow'],
        ['\uD83D\uDCDA','books stack'],['\uD83D\uDCD6','open book'],['\uD83D\uDCD3','notebook'],['\uD83D\uDCD5','closed book'],
        ['\uD83D\uDD70\uFE0F','mantel clock'],['\u23F0','alarm clock'],['\u23F1\uFE0F','stopwatch timer'],['\u23F3','hourglass flowing'],
        ['\uD83E\uDDF3','suitcase luggage'],['\uD83E\uDDF0','toolbox'],['\uD83E\uDDEE','abacus'],['\uD83E\uDDED','compass'],
        ['\uD83C\uDFA8','art palette paint'],['\uD83C\uDFAC','clapper board film'],['\uD83C\uDFAD','theater masks drama'],
        ['\uD83D\uDECE\uFE0F','bed sleep'],['\uD83E\uDE91','chair seat'],['\uD83D\uDEBF','shower'],['\uD83E\uDEA5','toothbrush'],
        ['\uD83E\uDD7D','goggles'],['\uD83D\uDC53','glasses spectacles'],['\uD83E\uDDE2','billed cap hat'],['\uD83C\uDFA9','top hat'],
        ['\u2602\uFE0F','umbrella'],['\uD83D\uDC5F','shoe sneaker'],['\uD83D\uDC5E','shoe flat'],['\uD83D\uDC62','boot woman']
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
    'People': [
        ['👶','baby'],['🧒','child'],['👦','boy'],['👧','girl'],['👨','man'],['👩','woman'],['🧑','person'],['👴','old man'],['👵','old woman'],
        ['👮','police officer'],['🕵️','detective'],['💂','guard'],['🥷','ninja'],['👷','construction worker'],['🫅','person crown'],['🤴','prince'],['👸','princess'],
        ['👳','person turban'],['👲','person cap'],['🧕','person headscarf'],['🤵','person tuxedo'],['👰','person veil'],['🤰','pregnant'],
        ['🧑‍🍳','chef cook'],['🧑‍🎓','student graduate'],['🧑‍🏫','teacher'],['🧑‍⚖️','judge'],['🧑‍🌾','farmer'],['🧑‍🔧','mechanic'],['🧑‍🔬','scientist'],['🧑‍💻','technologist programmer'],
        ['🧑‍🎤','singer'],['🧑‍🎨','artist'],['🧑‍✈️','pilot'],['🧑‍🚀','astronaut'],['🧑‍🚒','firefighter'],['🧑‍⚕️','health worker doctor nurse'],
        ['🏃','running'],['💃','dancing woman'],['🕺','dancing man'],['🧗','climbing'],['🏄','surfing'],['🏊','swimming'],['🚴','biking cycling'],['🧘','meditating yoga'],
        ['🧙','mage wizard'],['🧚','fairy'],['🧛','vampire'],['🧜','merperson'],['🧝','elf'],['🧞','genie'],['🧟','zombie'],['🦸','superhero'],['🦹','supervillain'],
        ['👁️','eye'],['👀','eyes looking'],['👅','tongue'],['👄','mouth lips'],['🫦','biting lip'],['🧠','brain'],['🫀','anatomical heart'],['🫁','lungs'],['🦴','bone'],['🦷','tooth']
    ],
    'Nature': [
        ['🌸','cherry blossom'],['🌹','rose'],['🌺','hibiscus'],['🌻','sunflower'],['🌼','blossom'],['🌷','tulip'],['🌱','seedling'],['🪴','potted plant'],
        ['🌲','evergreen tree'],['🌳','deciduous tree'],['🌴','palm tree'],['🌵','cactus'],['🍀','four leaf clover luck'],['🍁','maple leaf'],['🍂','fallen leaf'],['🍃','leaf wind'],
        ['🪵','wood log'],['🪨','rock'],['🪸','coral'],['🍄','mushroom'],['🌾','rice sheaf'],['💐','bouquet flowers'],['🪻','hyacinth'],['🪷','lotus'],
        ['☀️','sun'],['🌤️','sun small cloud'],['⛅','sun behind cloud'],['🌥️','sun large cloud'],['🌦️','sun rain cloud'],['🌧️','rain cloud'],['⛈️','thunderstorm'],
        ['🌩️','lightning cloud'],['🌪️','tornado'],['🌫️','fog'],['🌬️','wind face'],['❄️','snowflake'],['☃️','snowman'],['⛄','snowman no snow'],['🌈','rainbow'],
        ['🌊','ocean wave'],['💧','droplet water'],['💨','wind dash'],['🔥','fire flame'],['⭐','star'],['🌟','glowing star'],['✨','sparkles'],
        ['☄️','comet'],['🌍','earth globe'],['🌙','crescent moon'],['🌝','full moon face'],['🌞','sun face'],['🪐','ringed planet saturn']
    ],
    'Flags': [
        ['🏁','checkered flag'],['🚩','triangular flag'],['🎌','crossed flags'],['🏴','black flag'],['🏳️','white flag'],['🏳️‍🌈','rainbow pride flag'],['🏳️‍⚧️','transgender flag'],['🏴‍☠️','pirate flag'],
        ['🇺🇸','us usa america'],['🇬🇧','uk britain england'],['🇫🇷','france french'],['🇩🇪','germany german'],['🇮🇹','italy italian'],['🇪🇸','spain spanish'],['🇵🇹','portugal'],
        ['🇨🇦','canada canadian'],['🇲🇽','mexico mexican'],['🇧🇷','brazil brazilian'],['🇦🇷','argentina'],['🇨🇴','colombia'],
        ['🇯🇵','japan japanese'],['🇰🇷','south korea korean'],['🇨🇳','china chinese'],['🇮🇳','india indian'],['🇦🇺','australia australian'],['🇳🇿','new zealand'],
        ['🇷🇺','russia russian'],['🇺🇦','ukraine ukrainian'],['🇵🇱','poland polish'],['🇳🇱','netherlands dutch'],['🇸🇪','sweden swedish'],['🇳🇴','norway norwegian'],
        ['🇩🇰','denmark danish'],['🇫🇮','finland finnish'],['🇨🇭','switzerland swiss'],['🇦🇹','austria'],['🇧🇪','belgium'],['🇮🇪','ireland irish'],
        ['🇹🇷','turkey turkish'],['🇸🇦','saudi arabia'],['🇦🇪','uae emirates'],['🇮🇱','israel'],['🇪🇬','egypt'],['🇿🇦','south africa'],['🇳🇬','nigeria'],['🇰🇪','kenya'],
        ['🇹🇭','thailand thai'],['🇻🇳','vietnam'],['🇮🇩','indonesia'],['🇵🇭','philippines'],['🇸🇬','singapore'],['🇲🇾','malaysia'],['🇹🇼','taiwan']
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
// IMAGE VIEWER
// =============================================

var imgvTracerLoaded = false;

var IMGV_DEFAULTS = {
    brightness: 100, contrast: 100, saturate: 100, 'hue-rotate': 0,
    blur: 0, grayscale: 0, sepia: 0, invert: 0, opacity: 100,
    rotate: 0, scale: 100, flipH: false, flipV: false
};

function imgvGetWidget(el) {
    return el.closest('.imgv-widget');
}

function imgvGetToolId(el) {
    return el.closest('.tool').getAttribute('data-tool');
}

function imgvFlash(widget, msg) {
    var display = widget.querySelector('.imgv-display');
    var el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = 'position:absolute;top:8px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#fff;padding:4px 12px;border-radius:4px;font-size:11px;z-index:10;white-space:nowrap;pointer-events:none;';
    display.appendChild(el);
    setTimeout(function() { el.remove(); }, 3000);
}

function imgvGetState(widget) {
    var state = {};
    widget.querySelectorAll('input[data-filter]').forEach(function(inp) {
        state[inp.getAttribute('data-filter')] = parseFloat(inp.value);
    });
    widget.querySelectorAll('input[data-transform]').forEach(function(inp) {
        state[inp.getAttribute('data-transform')] = parseFloat(inp.value);
    });
    var flipH = widget.querySelector('.imgv-flip-btn[data-flip="H"]');
    var flipV = widget.querySelector('.imgv-flip-btn[data-flip="V"]');
    state.flipH = flipH ? flipH.classList.contains('active') : false;
    state.flipV = flipV ? flipV.classList.contains('active') : false;
    return state;
}

function imgvBuildFilterString(state) {
    var parts = [];
    if (state.brightness !== 100) parts.push('brightness(' + (state.brightness / 100) + ')');
    if (state.contrast !== 100) parts.push('contrast(' + (state.contrast / 100) + ')');
    if (state.saturate !== 100) parts.push('saturate(' + (state.saturate / 100) + ')');
    if (state['hue-rotate'] !== 0) parts.push('hue-rotate(' + state['hue-rotate'] + 'deg)');
    if (state.blur !== 0) parts.push('blur(' + state.blur + 'px)');
    if (state.grayscale !== 0) parts.push('grayscale(' + (state.grayscale / 100) + ')');
    if (state.sepia !== 0) parts.push('sepia(' + (state.sepia / 100) + ')');
    if (state.invert !== 0) parts.push('invert(' + (state.invert / 100) + ')');
    if (state.opacity !== 100) parts.push('opacity(' + (state.opacity / 100) + ')');
    return parts.length > 0 ? parts.join(' ') : 'none';
}

function imgvBuildTransformString(state) {
    var parts = [];
    if (state.rotate !== 0) parts.push('rotate(' + state.rotate + 'deg)');
    var sx = (state.scale / 100) * (state.flipH ? -1 : 1);
    var sy = (state.scale / 100) * (state.flipV ? -1 : 1);
    if (sx !== 1 || sy !== 1) parts.push('scale(' + sx + ',' + sy + ')');
    return parts.length > 0 ? parts.join(' ') : 'none';
}

function imgvApplyStyles(widget) {
    var img = widget.querySelector('.imgv-display img');
    if (!img) return;
    var state = imgvGetState(widget);
    img.style.filter = imgvBuildFilterString(state);
    var crop = widget._imgvCrop;
    var hasCrop = crop && (crop.top > 0 || crop.right > 0 || crop.bottom > 0 || crop.left > 0);
    if (hasCrop) {
        imgvApplyCropLayout(widget, img, crop, state);
    } else {
        if (widget._imgvCropResizeObs) {
            widget._imgvCropResizeObs.disconnect();
            widget._imgvCropResizeObs = null;
        }
        img.style.position = '';
        img.style.left = '';
        img.style.top = '';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.transformOrigin = '';
        img.style.clipPath = '';
        img.style.transform = imgvBuildTransformString(state);
        // Restore original image aspect ratio
        var toolEl = widget.closest('.tool');
        if (toolEl && img.naturalWidth && img.naturalHeight) {
            toolEl.setAttribute('data-aspect-ratio', (img.naturalWidth / img.naturalHeight).toFixed(6));
        }
    }
}

function imgvApplyCropLayout(widget, img, crop, state) {
    var natW = img.naturalWidth, natH = img.naturalHeight;
    if (!natW || !natH) return;
    var display = widget.querySelector('.imgv-display');
    var dispW = display.clientWidth, dispH = display.clientHeight;
    if (!dispW || !dispH) return;
    // Crop region in natural pixels
    var cropNatW = natW * (100 - crop.left - crop.right) / 100;
    var cropNatH = natH * (100 - crop.top - crop.bottom) / 100;
    if (cropNatW <= 0 || cropNatH <= 0) return;
    var isRender = widget.classList.contains('render-mode');
    var toolEl = widget.closest('.tool');
    if (isRender) {
        // Render mode: tool is frameless, display fills tool — set aspect ratio to crop ratio
        if (toolEl) toolEl.setAttribute('data-aspect-ratio', (cropNatW / cropNatH).toFixed(6));
        // Use cover-fit so crop fills display completely (clip-path trims any excess)
        var scale = Math.max(dispW / cropNatW, dispH / cropNatH);
    } else {
        // Edit mode: tool has header/controls — keep original image aspect ratio
        if (toolEl) toolEl.setAttribute('data-aspect-ratio', (natW / natH).toFixed(6));
        // Use contain-fit so full crop region is visible
        var scale = Math.min(dispW / cropNatW, dispH / cropNatH);
    }
    var imgW = natW * scale;
    var imgH = natH * scale;
    var cropDispW = cropNatW * scale;
    var cropDispH = cropNatH * scale;
    // Center the crop region in the display
    var padX = (dispW - cropDispW) / 2;
    var padY = (dispH - cropDispH) / 2;
    var left = -(crop.left / 100 * natW) * scale + padX;
    var top = -(crop.top / 100 * natH) * scale + padY;
    img.style.position = 'absolute';
    img.style.objectFit = 'fill';
    img.style.width = imgW + 'px';
    img.style.height = imgH + 'px';
    img.style.left = left + 'px';
    img.style.top = top + 'px';
    // Clip to exactly the crop region within the img element
    var clipT = (crop.top / 100 * natH) * scale;
    var clipR = (crop.right / 100 * natW) * scale;
    var clipB = (crop.bottom / 100 * natH) * scale;
    var clipL = (crop.left / 100 * natW) * scale;
    img.style.clipPath = 'inset(' + clipT + 'px ' + clipR + 'px ' + clipB + 'px ' + clipL + 'px)';
    // Transform origin at visible crop center
    var originX = clipL + cropDispW / 2;
    var originY = clipT + cropDispH / 2;
    img.style.transformOrigin = originX + 'px ' + originY + 'px';
    img.style.transform = imgvBuildTransformString(state);
    // ResizeObserver to recalculate on display resize
    if (!widget._imgvCropResizeObs) {
        widget._imgvCropResizeObs = new ResizeObserver(function() {
            if (widget._imgvCrop) imgvApplyStyles(widget);
        });
        widget._imgvCropResizeObs.observe(display);
    }
}

function imgvUpdateValueDisplay(input) {
    var row = input.closest('.imgv-slider-row');
    if (!row) return;
    var valSpan = row.querySelector('.imgv-val');
    if (!valSpan) return;
    var unit = input.getAttribute('data-unit') || '';
    valSpan.textContent = input.value + unit;
}

function imgvSliderChange(input) {
    imgvUpdateValueDisplay(input);
    var widget = imgvGetWidget(input);
    imgvApplyStyles(widget);
    imgvSaveState(widget);
}

function imgvToggleFlip(btn) {
    btn.classList.toggle('active');
    var widget = imgvGetWidget(btn);
    imgvApplyStyles(widget);
    imgvSaveState(widget);
}

function imgvShowImage(widget, src) {
    widget._imgvOrigSrc = src;
    var display = widget.querySelector('.imgv-display');
    var existing = display.querySelector('img');
    if (!existing) {
        var placeholder = display.querySelector('.imgv-placeholder');
        if (placeholder) placeholder.remove();
        existing = document.createElement('img');
        display.appendChild(existing);
    }
    // Set aspect ratio on tool element for constrained SE resize
    existing.onload = function() {
        if (existing.naturalWidth && existing.naturalHeight) {
            widget.closest('.tool').setAttribute('data-aspect-ratio',
                (existing.naturalWidth / existing.naturalHeight).toFixed(6));
        }
    };
    imgvProcessTransparency(widget);
}

function imgvLoad(btn) {
    var widget = imgvGetWidget(btn);
    var input = widget.querySelector('.imgv-input-row input');
    var url = input.value.trim();
    if (!url) return;
    imgvShowImage(widget, url);
    imgvSaveState(widget);
}

function imgvHandlePaste(widget, e) {
    var items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault();
            var file = items[i].getAsFile();
            var reader = new FileReader();
            reader.onload = function(ev) {
                imgvShowImage(widget, ev.target.result);
                widget.querySelector('.imgv-input-row input').value = '';
                imgvSaveState(widget);
            };
            reader.readAsDataURL(file);
            return;
        }
    }
    // If no image in clipboard, check for pasted text (URL)
    var text = (e.clipboardData || e.originalEvent.clipboardData).getData('text');
    if (text && (text.match(/^https?:\/\/.+/i) || text.match(/^data:image\//i))) {
        e.preventDefault();
        widget.querySelector('.imgv-input-row input').value = text;
        imgvShowImage(widget, text.trim());
        imgvSaveState(widget);
    }
}

function imgvHandleDrop(widget, e) {
    e.preventDefault();
    widget.querySelector('.imgv-display').classList.remove('dragover');
    var files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.indexOf('image') !== -1) {
        var reader = new FileReader();
        reader.onload = function(ev) {
            imgvShowImage(widget, ev.target.result);
            widget.querySelector('.imgv-input-row input').value = '';
            imgvSaveState(widget);
        };
        reader.readAsDataURL(files[0]);
        return;
    }
    var url = e.dataTransfer.getData('text/plain');
    if (url && url.match(/^https?:\/\/.+/i)) {
        widget.querySelector('.imgv-input-row input').value = url;
        imgvShowImage(widget, url.trim());
        imgvSaveState(widget);
    }
}

function imgvReset(btn) {
    var widget = imgvGetWidget(btn);
    if (widget.classList.contains('crop-mode')) imgvCropExit(widget);
    widget.querySelectorAll('input[data-filter]').forEach(function(inp) {
        inp.value = IMGV_DEFAULTS[inp.getAttribute('data-filter')];
        imgvUpdateValueDisplay(inp);
    });
    widget.querySelectorAll('input[data-transform]').forEach(function(inp) {
        inp.value = IMGV_DEFAULTS[inp.getAttribute('data-transform')];
        imgvUpdateValueDisplay(inp);
    });
    widget.querySelector('.imgv-flip-btn[data-flip="H"]').classList.remove('active');
    widget.querySelector('.imgv-flip-btn[data-flip="V"]').classList.remove('active');
    // Reset color key
    var transColor = widget.querySelector('.imgv-trans-color');
    if (transColor) transColor.value = '#00ff00';
    var transTol = widget.querySelector('input[data-trans="tolerance"]');
    if (transTol) { transTol.value = 0; imgvUpdateValueDisplay(transTol); }
    var pickBtn = widget.querySelector('.imgv-pick-btn');
    if (pickBtn) pickBtn.classList.remove('active');
    widget.querySelector('.imgv-display').classList.remove('eyedropper');
    widget._imgvCrop = null;
    // Reset meme text
    widget.querySelectorAll('.imgv-meme-input').forEach(function(inp) { inp.value = ''; });
    widget.querySelectorAll('.imgv-meme-text').forEach(function(el) { el.textContent = ''; el.style.fontSize = ''; });
    var memeSizeSlider = widget.querySelector('input[data-meme-size]');
    if (memeSizeSlider) { memeSizeSlider.value = 32; var span = memeSizeSlider.parentElement.querySelector('.imgv-val'); if (span) span.textContent = '32px'; }
    imgvProcessTransparency(widget);
    imgvSaveState(widget);
}

function imgvProcessTransparency(widget) {
    var img = widget.querySelector('.imgv-display img');
    if (!img) return;
    var origSrc = widget._imgvOrigSrc;
    if (!origSrc) return;

    var tolInput = widget.querySelector('input[data-trans="tolerance"]');
    var tolerance = tolInput ? parseInt(tolInput.value) : 0;

    if (tolerance === 0) {
        img.src = origSrc;
        imgvApplyStyles(widget);
        return;
    }

    var colorInput = widget.querySelector('.imgv-trans-color');
    var hex = colorInput ? colorInput.value : '#00ff00';
    var r0 = parseInt(hex.substr(1, 2), 16);
    var g0 = parseInt(hex.substr(3, 2), 16);
    var b0 = parseInt(hex.substr(5, 2), 16);

    var tempImg = new Image();
    tempImg.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = tempImg.naturalWidth;
        canvas.height = tempImg.naturalHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(tempImg, 0, 0);
        try {
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var d = imageData.data;
            var tolSq = tolerance * tolerance;
            for (var i = 0; i < d.length; i += 4) {
                var dr = d[i] - r0;
                var dg = d[i + 1] - g0;
                var db = d[i + 2] - b0;
                if (dr * dr + dg * dg + db * db <= tolSq) {
                    d[i + 3] = 0;
                }
            }
            ctx.putImageData(imageData, 0, 0);
            img.src = canvas.toDataURL('image/png');
        } catch (ex) {
            img.src = origSrc;
            imgvFlash(widget, 'Transparency requires a pasted image (remote URLs blocked by CORS)');
        }
        imgvApplyStyles(widget);
    };
    tempImg.onerror = function() {
        img.src = origSrc;
        imgvApplyStyles(widget);
    };
    tempImg.src = origSrc;
}

function imgvTransColorChange(input) {
    var widget = imgvGetWidget(input);
    imgvProcessTransparency(widget);
    imgvSaveState(widget);
}

function imgvTransToleranceChange(input) {
    imgvUpdateValueDisplay(input);
    var widget = imgvGetWidget(input);
    clearTimeout(widget._imgvTransDebounce);
    widget._imgvTransDebounce = setTimeout(function() {
        imgvProcessTransparency(widget);
        imgvSaveState(widget);
    }, 150);
}

function imgvPickToggle(btn) {
    var widget = imgvGetWidget(btn);
    var display = widget.querySelector('.imgv-display');
    var active = btn.classList.toggle('active');
    display.classList.toggle('eyedropper', active);
}

function imgvDisplayClick(widget, e) {
    if (widget.classList.contains('crop-mode')) return;
    var pickBtn = widget.querySelector('.imgv-pick-btn');
    if (!pickBtn || !pickBtn.classList.contains('active')) return;

    var img = widget.querySelector('.imgv-display img');
    if (!img) return;

    var origSrc = widget._imgvOrigSrc || img.src;
    var natW = img.naturalWidth;
    var natH = img.naturalHeight;
    var px, py;
    var crop = widget._imgvCrop;
    var hasCrop = crop && (crop.top > 0 || crop.right > 0 || crop.bottom > 0 || crop.left > 0);
    if (hasCrop) {
        // Use display bounds — img has absolute positioning + clip-path
        var display = widget.querySelector('.imgv-display');
        var dispRect = display.getBoundingClientRect();
        var dispW = dispRect.width, dispH = dispRect.height;
        var cropNatW = natW * (100 - crop.left - crop.right) / 100;
        var cropNatH = natH * (100 - crop.top - crop.bottom) / 100;
        var isRender = widget.classList.contains('render-mode');
        var scale = isRender ? Math.max(dispW / cropNatW, dispH / cropNatH) : Math.min(dispW / cropNatW, dispH / cropNatH);
        var cropDispW = cropNatW * scale;
        var cropDispH = cropNatH * scale;
        var padX = (dispW - cropDispW) / 2;
        var padY = (dispH - cropDispH) / 2;
        var cx = e.clientX - dispRect.left - padX;
        var cy = e.clientY - dispRect.top - padY;
        if (cx < 0 || cy < 0 || cx >= cropDispW || cy >= cropDispH) return;
        px = Math.floor(cx / scale + natW * crop.left / 100);
        py = Math.floor(cy / scale + natH * crop.top / 100);
    } else {
        // Normal object-fit: contain math
        var rect = img.getBoundingClientRect();
        var dispW = rect.width;
        var dispH = rect.height;
        var scale = Math.min(dispW / natW, dispH / natH);
        var rendW = natW * scale;
        var rendH = natH * scale;
        var offX = (dispW - rendW) / 2;
        var offY = (dispH - rendH) / 2;
        var cx = e.clientX - rect.left - offX;
        var cy = e.clientY - rect.top - offY;
        if (cx < 0 || cy < 0 || cx >= rendW || cy >= rendH) return;
        px = Math.floor(cx / scale);
        py = Math.floor(cy / scale);
    }

    var tempImg = new Image();
    tempImg.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = natW;
        canvas.height = natH;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(tempImg, 0, 0);
        try {
            var p = ctx.getImageData(px, py, 1, 1).data;
            var hex = '#' + ('000000' + ((p[0] << 16) | (p[1] << 8) | p[2]).toString(16)).slice(-6);
            widget.querySelector('.imgv-trans-color').value = hex;
            // Auto-set tolerance to 30 if still at 0
            var tolInput = widget.querySelector('input[data-trans="tolerance"]');
            if (tolInput && parseInt(tolInput.value) === 0) {
                tolInput.value = 30;
                imgvUpdateValueDisplay(tolInput);
            }
            imgvProcessTransparency(widget);
            imgvSaveState(widget);
        } catch (ex) {
            imgvFlash(widget, 'Color pick requires a pasted image (remote URLs blocked by CORS)');
        }
    };
    tempImg.src = origSrc;

    // Exit pick mode
    pickBtn.classList.remove('active');
    widget.querySelector('.imgv-display').classList.remove('eyedropper');
}

function imgvToggleMode(btn) {
    var widget = imgvGetWidget(btn);
    var toolEl = widget.closest('.tool');
    var isRender = widget.classList.toggle('render-mode');
    toolEl.classList.toggle('frameless', isRender);
    btn.textContent = isRender ? 'Edit' : 'Render';
    // Persist frameless in toolCustomizations so the framework restores it
    var toolId = imgvGetToolId(widget);
    var customizations = loadToolCustomizations();
    customizations[toolId] = customizations[toolId] || {};
    customizations[toolId].frameless = isRender;
    customizations[toolId].imgvRenderMode = isRender;
    saveToolCustomizations(customizations);
    // Re-apply styles so crop layout recalculates for new mode
    if (widget._imgvCrop) imgvApplyStyles(widget);
}

// ── Crop functions ──

function imgvCropStart(btn) {
    var widget = imgvGetWidget(btn);
    var img = widget.querySelector('.imgv-display img');
    if (!img || !widget._imgvOrigSrc) return;
    widget.classList.add('crop-mode');
    // Reset image to normal uncropped layout so overlay aligns with what user sees
    img.style.position = '';
    img.style.left = '';
    img.style.top = '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.transformOrigin = '';
    img.style.clipPath = '';
    img.style.transform = imgvBuildTransformString(imgvGetState(widget));
    // Compute rendered image bounds within display area
    var display = widget.querySelector('.imgv-display');
    var dispRect = display.getBoundingClientRect();
    var natW = img.naturalWidth, natH = img.naturalHeight;
    var dispW = dispRect.width, dispH = dispRect.height;
    var scale = Math.min(dispW / natW, dispH / natH);
    var rendW = natW * scale, rendH = natH * scale;
    var offX = (dispW - rendW) / 2, offY = (dispH - rendH) / 2;
    var imgBounds = { x: offX, y: offY, w: rendW, h: rendH, scale: scale, natW: natW, natH: natH };
    widget._imgvCropBounds = imgBounds;
    // Create overlay if needed
    if (!widget._imgvCropOverlay) imgvCreateCropOverlay(widget);
    widget._imgvCropOverlay.style.display = 'block';
    widget._imgvCropBar.style.display = 'flex';
    // If existing crop, restore that rect; otherwise 80% centered
    var existingCrop = widget._imgvCrop;
    if (existingCrop) {
        var rx = offX + (existingCrop.left / 100) * rendW;
        var ry = offY + (existingCrop.top / 100) * rendH;
        var rw = rendW * (1 - existingCrop.left / 100 - existingCrop.right / 100);
        var rh = rendH * (1 - existingCrop.top / 100 - existingCrop.bottom / 100);
        widget._imgvCropRect = { x: rx, y: ry, w: Math.max(20, rw), h: Math.max(20, rh) };
    } else {
        var pad = 0.1;
        var rx = offX + rendW * pad, ry = offY + rendH * pad;
        var rw = rendW * 0.8, rh = rendH * 0.8;
        widget._imgvCropRect = { x: rx, y: ry, w: rw, h: rh };
    }
    imgvCropUpdateRect(widget);
}

function imgvCreateCropOverlay(widget) {
    var display = widget.querySelector('.imgv-display');
    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'imgv-crop-overlay';
    // Crop rect
    var rect = document.createElement('div');
    rect.className = 'imgv-crop-rect';
    var handles = ['nw','n','ne','e','se','s','sw','w'];
    handles.forEach(function(h) {
        var handle = document.createElement('div');
        handle.className = 'imgv-crop-handle ' + h;
        handle.setAttribute('data-handle', h);
        rect.appendChild(handle);
    });
    var info = document.createElement('div');
    info.className = 'imgv-crop-info';
    info.textContent = '0 \u00d7 0';
    rect.appendChild(info);
    overlay.appendChild(rect);
    display.appendChild(overlay);
    // Crop bar (apply/cancel)
    var bar = document.createElement('div');
    bar.className = 'imgv-crop-bar';
    var applyBtn = document.createElement('button');
    applyBtn.className = 'imgv-crop-apply';
    applyBtn.textContent = 'Apply';
    applyBtn.onclick = function() { imgvCropApply(applyBtn); };
    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'imgv-crop-cancel-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = function() { imgvCropCancel(cancelBtn); };
    bar.appendChild(applyBtn);
    bar.appendChild(cancelBtn);
    display.appendChild(bar);
    widget._imgvCropOverlay = overlay;
    widget._imgvCropRectEl = rect;
    widget._imgvCropInfo = info;
    widget._imgvCropBar = bar;
    // Mouse events
    overlay.addEventListener('mousedown', function(e) { imgvCropMouseDown(widget, e); });
    var moveHandler = function(e) { imgvCropMouseMove(widget, e); };
    var upHandler = function(e) { imgvCropMouseUp(widget, e); };
    widget._imgvCropMoveHandler = moveHandler;
    widget._imgvCropUpHandler = upHandler;
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
}

function imgvCropMouseDown(widget, e) {
    e.preventDefault();
    var target = e.target;
    var cr = widget._imgvCropRect;
    if (!cr) return;
    var overlay = widget._imgvCropOverlay;
    var overlayRect = overlay.getBoundingClientRect();
    var mx = e.clientX - overlayRect.left, my = e.clientY - overlayRect.top;
    if (target.classList.contains('imgv-crop-handle')) {
        widget._imgvCropDrag = { type: 'resize', handle: target.getAttribute('data-handle'), startX: mx, startY: my, startRect: { x: cr.x, y: cr.y, w: cr.w, h: cr.h } };
    } else if (target.classList.contains('imgv-crop-rect')) {
        widget._imgvCropDrag = { type: 'move', startX: mx, startY: my, startRect: { x: cr.x, y: cr.y, w: cr.w, h: cr.h } };
    } else {
        // Draw new rect
        var b = widget._imgvCropBounds;
        var cx = Math.max(b.x, Math.min(mx, b.x + b.w));
        var cy = Math.max(b.y, Math.min(my, b.y + b.h));
        widget._imgvCropRect = { x: cx, y: cy, w: 1, h: 1 };
        widget._imgvCropDrag = { type: 'draw', startX: cx, startY: cy, startRect: null };
        imgvCropUpdateRect(widget);
    }
}

function imgvCropMouseMove(widget, e) {
    var drag = widget._imgvCropDrag;
    if (!drag) return;
    var overlay = widget._imgvCropOverlay;
    var overlayRect = overlay.getBoundingClientRect();
    var mx = e.clientX - overlayRect.left, my = e.clientY - overlayRect.top;
    var b = widget._imgvCropBounds;
    var bx = b.x, by = b.y, bw = b.w, bh = b.h;
    var MIN = 20;
    if (drag.type === 'move') {
        var dx = mx - drag.startX, dy = my - drag.startY;
        var nx = drag.startRect.x + dx, ny = drag.startRect.y + dy;
        nx = Math.max(bx, Math.min(nx, bx + bw - drag.startRect.w));
        ny = Math.max(by, Math.min(ny, by + bh - drag.startRect.h));
        widget._imgvCropRect.x = nx;
        widget._imgvCropRect.y = ny;
        widget._imgvCropRect.w = drag.startRect.w;
        widget._imgvCropRect.h = drag.startRect.h;
    } else if (drag.type === 'resize') {
        var sr = drag.startRect;
        var h = drag.handle;
        var nx = sr.x, ny = sr.y, nw = sr.w, nh = sr.h;
        var dx = mx - drag.startX, dy = my - drag.startY;
        if (h.indexOf('w') !== -1) { nx = sr.x + dx; nw = sr.w - dx; }
        if (h.indexOf('e') !== -1) { nw = sr.w + dx; }
        if (h.indexOf('n') !== -1) { ny = sr.y + dy; nh = sr.h - dy; }
        if (h.indexOf('s') !== -1) { nh = sr.h + dy; }
        // Enforce minimum
        if (nw < MIN) { if (h.indexOf('w') !== -1) nx = sr.x + sr.w - MIN; nw = MIN; }
        if (nh < MIN) { if (h.indexOf('n') !== -1) ny = sr.y + sr.h - MIN; nh = MIN; }
        // Clamp to image bounds
        if (nx < bx) { nw -= (bx - nx); nx = bx; }
        if (ny < by) { nh -= (by - ny); ny = by; }
        if (nx + nw > bx + bw) nw = bx + bw - nx;
        if (ny + nh > by + bh) nh = by + bh - ny;
        if (nw < MIN) nw = MIN;
        if (nh < MIN) nh = MIN;
        widget._imgvCropRect = { x: nx, y: ny, w: nw, h: nh };
    } else if (drag.type === 'draw') {
        var sx = drag.startX, sy = drag.startY;
        var cx = Math.max(bx, Math.min(mx, bx + bw));
        var cy = Math.max(by, Math.min(my, by + bh));
        var rx = Math.min(sx, cx), ry = Math.min(sy, cy);
        var rw = Math.abs(cx - sx), rh = Math.abs(cy - sy);
        if (rw < MIN) rw = MIN;
        if (rh < MIN) rh = MIN;
        if (rx + rw > bx + bw) rx = bx + bw - rw;
        if (ry + rh > by + bh) ry = by + bh - rh;
        widget._imgvCropRect = { x: rx, y: ry, w: rw, h: rh };
    }
    imgvCropUpdateRect(widget);
}

function imgvCropMouseUp(widget, e) {
    widget._imgvCropDrag = null;
}

function imgvCropUpdateRect(widget) {
    var cr = widget._imgvCropRect;
    var el = widget._imgvCropRectEl;
    if (!cr || !el) return;
    el.style.left = cr.x + 'px';
    el.style.top = cr.y + 'px';
    el.style.width = cr.w + 'px';
    el.style.height = cr.h + 'px';
    // Update dimension info in natural pixels
    var b = widget._imgvCropBounds;
    if (b) {
        var nw = Math.round(cr.w / b.scale);
        var nh = Math.round(cr.h / b.scale);
        widget._imgvCropInfo.textContent = nw + ' \u00d7 ' + nh;
    }
}

function imgvCropApply(btn) {
    var widget = imgvGetWidget(btn);
    var cr = widget._imgvCropRect;
    var b = widget._imgvCropBounds;
    if (!cr || !b) return;
    // Convert display-space rect to percentage insets of the natural image
    var top = ((cr.y - b.y) / b.h) * 100;
    var left = ((cr.x - b.x) / b.w) * 100;
    var bottom = (1 - (cr.y - b.y + cr.h) / b.h) * 100;
    var right = (1 - (cr.x - b.x + cr.w) / b.w) * 100;
    // Clamp to valid range
    top = Math.max(0, Math.min(top, 99));
    left = Math.max(0, Math.min(left, 99));
    bottom = Math.max(0, Math.min(bottom, 99));
    right = Math.max(0, Math.min(right, 99));
    widget._imgvCrop = { top: top, right: right, bottom: bottom, left: left };
    imgvCropExit(widget);
    imgvApplyStyles(widget);
    imgvSaveState(widget);
}

function imgvCropCancel(btn) {
    var widget = imgvGetWidget(btn);
    imgvCropExit(widget);
}

function imgvCropExit(widget) {
    widget.classList.remove('crop-mode');
    widget._imgvCropDrag = null;
    widget._imgvCropRect = null;
    widget._imgvCropBounds = null;
    if (widget._imgvCropOverlay) widget._imgvCropOverlay.style.display = 'none';
    if (widget._imgvCropBar) widget._imgvCropBar.style.display = 'none';
}

function imgvMemeChange(input) {
    var widget = imgvGetWidget(input);
    var which = input.getAttribute('data-meme');
    var overlay = widget.querySelector('.imgv-meme-' + which);
    if (overlay) overlay.textContent = input.value;
    imgvSaveState(widget);
}

function imgvMemeSizeChange(input) {
    var widget = imgvGetWidget(input);
    var size = input.value + 'px';
    widget.querySelectorAll('.imgv-meme-text').forEach(function(el) {
        el.style.fontSize = size;
    });
    var span = input.parentElement.querySelector('.imgv-val');
    if (span) span.textContent = size;
    imgvSaveState(widget);
}

function imgvMemeApply(widget) {
    var topInput = widget.querySelector('.imgv-meme-input[data-meme="top"]');
    var bottomInput = widget.querySelector('.imgv-meme-input[data-meme="bottom"]');
    var sizeInput = widget.querySelector('input[data-meme-size]');
    var topOverlay = widget.querySelector('.imgv-meme-top');
    var bottomOverlay = widget.querySelector('.imgv-meme-bottom');
    if (topOverlay && topInput) topOverlay.textContent = topInput.value;
    if (bottomOverlay && bottomInput) bottomOverlay.textContent = bottomInput.value;
    if (sizeInput) {
        var size = sizeInput.value + 'px';
        if (topOverlay) topOverlay.style.fontSize = size;
        if (bottomOverlay) bottomOverlay.style.fontSize = size;
        var span = sizeInput.parentElement.querySelector('.imgv-val');
        if (span) span.textContent = size;
    }
}

function imgvLoadTracer(callback) {
    if (window.ImageTracer) { callback(); return; }
    if (imgvTracerLoaded) {
        var poll = setInterval(function() {
            if (window.ImageTracer) { clearInterval(poll); callback(); }
        }, 100);
        return;
    }
    imgvTracerLoaded = true;
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/imagetracerjs@1.2.6/imagetracer_v1.2.6.js';
    script.onload = function() { callback(); };
    document.head.appendChild(script);
}

function imgvTraceSvg(btn) {
    var widget = imgvGetWidget(btn);
    if (!widget) return;
    var img = widget.querySelector('.imgv-display img');
    if (!img || !widget._imgvOrigSrc) {
        imgvFlash(widget, 'Load an image first');
        return;
    }
    var preset = widget.querySelector('.imgv-svg-preset').value;
    btn.textContent = 'Tracing\u2026';
    btn.disabled = true;
    imgvLoadTracer(function() {
        try {
            var tempCanvas = document.createElement('canvas');
            var tempImg = new Image();
            tempImg.crossOrigin = 'anonymous';
            tempImg.onload = function() {
                tempCanvas.width = tempImg.naturalWidth;
                tempCanvas.height = tempImg.naturalHeight;
                var ctx = tempCanvas.getContext('2d');
                ctx.drawImage(tempImg, 0, 0);
                var imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                var svgStr = ImageTracer.imagedataToSVG(imageData, preset);
                btn.textContent = 'Trace SVG';
                btn.disabled = false;
                imgvShowSvgModal(widget, svgStr);
            };
            tempImg.onerror = function() {
                // Fallback for CORS issues — draw from the displayed img element directly
                try {
                    tempCanvas.width = img.naturalWidth;
                    tempCanvas.height = img.naturalHeight;
                    var ctx = tempCanvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    var imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                    var svgStr = ImageTracer.imagedataToSVG(imageData, preset);
                    btn.textContent = 'Trace SVG';
                    btn.disabled = false;
                    imgvShowSvgModal(widget, svgStr);
                } catch (e2) {
                    btn.textContent = 'Trace SVG';
                    btn.disabled = false;
                    imgvFlash(widget, 'Could not trace image (CORS)');
                }
            };
            tempImg.src = widget._imgvOrigSrc;
        } catch (e) {
            btn.textContent = 'Trace SVG';
            btn.disabled = false;
            imgvFlash(widget, 'Trace failed: ' + e.message);
        }
    });
}

function imgvShowSvgModal(widget, svgStr) {
    var modal = widget.querySelector('.imgv-svg-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'imgv-svg-modal';
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.classList.remove('open');
        });
        widget.appendChild(modal);
    }
    modal.innerHTML =
        '<div class="imgv-svg-preview">' +
            '<div class="imgv-svg-actions">' +
                '<button class="imgv-svg-download-btn">Download SVG</button>' +
                '<button class="imgv-svg-close-btn">Close</button>' +
            '</div>' +
            '<div class="imgv-svg-content"></div>' +
        '</div>';
    modal.querySelector('.imgv-svg-content').innerHTML = svgStr;
    modal.querySelector('.imgv-svg-download-btn').onclick = function() {
        var blob = new Blob([svgStr], { type: 'image/svg+xml' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'traced-image.svg';
        a.click();
        URL.revokeObjectURL(url);
    };
    modal.querySelector('.imgv-svg-close-btn').onclick = function() {
        modal.classList.remove('open');
    };
    modal.classList.add('open');
}

function imgvSaveState(widget) {
    var toolId = imgvGetToolId(widget);
    if (!toolId) return;
    var customizations = loadToolCustomizations();
    var state = imgvGetState(widget);
    var inputEl = widget.querySelector('.imgv-input-row input');
    var inputUrl = inputEl ? inputEl.value : '';
    var orig = widget._imgvOrigSrc || '';
    // For URL-loaded images, store just the URL; for pasted/dropped, store data URL (capped at 500KB)
    var src = '';
    if (inputUrl && inputUrl.match(/^(https?:\/\/|file:\/\/\/|\/)/i)) {
        src = inputUrl;
    } else if (orig && orig.indexOf('blob:') !== 0) {
        src = orig;
    }
    // Preserve previously saved URL if current source is non-persistable
    var existing = customizations[toolId] || {};
    if (!src && existing.imgvUrl) src = existing.imgvUrl;
    if (!inputUrl && existing.imgvInputUrl) inputUrl = existing.imgvInputUrl;
    var transColor = widget.querySelector('.imgv-trans-color');
    var transTol = widget.querySelector('input[data-trans="tolerance"]');
    customizations[toolId] = Object.assign(existing, {
        imgvUrl: src,
        imgvInputUrl: inputUrl,
        imgvFilters: {
            brightness: state.brightness, contrast: state.contrast, saturate: state.saturate,
            'hue-rotate': state['hue-rotate'], blur: state.blur, grayscale: state.grayscale,
            sepia: state.sepia, invert: state.invert, opacity: state.opacity
        },
        imgvTransforms: {
            rotate: state.rotate, scale: state.scale, flipH: state.flipH, flipV: state.flipV
        },
        imgvTransColor: transColor ? transColor.value : '#00ff00',
        imgvTransTolerance: transTol ? parseInt(transTol.value) : 0,
        imgvCrop: widget._imgvCrop || null,
        imgvMemeTop: widget.querySelector('.imgv-meme-input[data-meme="top"]')?.value || '',
        imgvMemeBottom: widget.querySelector('.imgv-meme-input[data-meme="bottom"]')?.value || '',
        imgvMemeFontSize: parseInt(widget.querySelector('input[data-meme-size]')?.value) || 32
    });
    saveToolCustomizations(customizations);
}

function imgvInit() {
    var toolEl = document.querySelector('.tool[data-tool] .imgv-widget');
    if (!toolEl) return;
    // Find all imgv-widgets that haven't been initialized
    document.querySelectorAll('.imgv-widget').forEach(function(widget) {
        if (widget._imgvInited) return;
        widget._imgvInited = true;

        var toolId = imgvGetToolId(widget);
        var customizations = loadToolCustomizations();
        var saved = customizations[toolId] || {};

        // Restore filter sliders
        if (saved.imgvFilters) {
            widget.querySelectorAll('input[data-filter]').forEach(function(inp) {
                var key = inp.getAttribute('data-filter');
                if (saved.imgvFilters[key] !== undefined) inp.value = saved.imgvFilters[key];
                imgvUpdateValueDisplay(inp);
            });
        } else {
            widget.querySelectorAll('input[data-filter]').forEach(function(inp) {
                imgvUpdateValueDisplay(inp);
            });
        }

        // Restore transform sliders
        if (saved.imgvTransforms) {
            widget.querySelectorAll('input[data-transform]').forEach(function(inp) {
                var key = inp.getAttribute('data-transform');
                if (saved.imgvTransforms[key] !== undefined) inp.value = saved.imgvTransforms[key];
                imgvUpdateValueDisplay(inp);
            });
            if (saved.imgvTransforms.flipH) widget.querySelector('.imgv-flip-btn[data-flip="H"]').classList.add('active');
            if (saved.imgvTransforms.flipV) widget.querySelector('.imgv-flip-btn[data-flip="V"]').classList.add('active');
        } else {
            widget.querySelectorAll('input[data-transform]').forEach(function(inp) {
                imgvUpdateValueDisplay(inp);
            });
        }

        // Restore color key settings (before image, so processTransparency picks them up)
        if (saved.imgvTransColor) {
            var tc = widget.querySelector('.imgv-trans-color');
            if (tc) tc.value = saved.imgvTransColor;
        }
        if (saved.imgvTransTolerance) {
            var tt = widget.querySelector('input[data-trans="tolerance"]');
            if (tt) { tt.value = saved.imgvTransTolerance; imgvUpdateValueDisplay(tt); }
        }

        // Restore image
        if (saved.imgvInputUrl) widget.querySelector('.imgv-input-row input').value = saved.imgvInputUrl;
        var restoreUrl = saved.imgvUrl || saved.imgvInputUrl || '';
        if (restoreUrl) imgvShowImage(widget, restoreUrl);

        // Restore crop
        if (saved.imgvCrop) {
            widget._imgvCrop = saved.imgvCrop;
            imgvApplyStyles(widget);
        }

        // Restore meme text
        if (saved.imgvMemeTop || saved.imgvMemeBottom || saved.imgvMemeFontSize) {
            var memeTopInput = widget.querySelector('.imgv-meme-input[data-meme="top"]');
            var memeBottomInput = widget.querySelector('.imgv-meme-input[data-meme="bottom"]');
            var memeSizeInput = widget.querySelector('input[data-meme-size]');
            if (memeTopInput) memeTopInput.value = saved.imgvMemeTop || '';
            if (memeBottomInput) memeBottomInput.value = saved.imgvMemeBottom || '';
            if (memeSizeInput) memeSizeInput.value = saved.imgvMemeFontSize || 32;
            imgvMemeApply(widget);
        }

        // Restore render mode
        if (saved.imgvRenderMode) {
            widget.classList.add('render-mode');
            widget.closest('.tool').classList.add('frameless');
            widget.querySelector('.imgv-mode-toggle').textContent = 'Edit';
        }

        // Enter key on URL input
        widget.querySelector('.imgv-input-row input').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                imgvLoad(widget.querySelector('.imgv-input-row button'));
            }
        });

        // Paste handler on display area
        var display = widget.querySelector('.imgv-display');
        widget.addEventListener('paste', function(e) { imgvHandlePaste(widget, e); });

        // Drag-drop handlers
        display.addEventListener('dragover', function(e) {
            e.preventDefault();
            display.classList.add('dragover');
        });
        display.addEventListener('dragleave', function(e) {
            display.classList.remove('dragover');
        });
        display.addEventListener('drop', function(e) { imgvHandleDrop(widget, e); });

        // Eyedropper click handler
        display.addEventListener('click', function(e) { imgvDisplayClick(widget, e); });
    });
}

// =============================================
// MUSIC SHEET
// =============================================

var msheetState = {};

// Note names from bottom line E4 up to top of staff and beyond
// Staff lines (bottom to top): E4, G4, B4, D5, F5
// Spaces: F4, A4, C5, E5
// Ledger lines below: C4 (middle C), D4
// Ledger lines above: A5, B5
var MSHEET_NOTES = ['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5'];
var MSHEET_NOTE_NAMES = { 'C4':261.63,'D4':293.66,'E4':329.63,'F4':349.23,'G4':392.00,'A4':440.00,'B4':493.88,'C5':523.25,'D5':587.33,'E5':659.25,'F5':698.46,'G5':783.99,'A5':880.00,'B5':987.77 };
var MSHEET_DURATIONS = ['whole','half','quarter','eighth','sixteenth'];
var MSHEET_DUR_BEATS = { whole: 4, half: 2, quarter: 1, eighth: 0.5, sixteenth: 0.25 };
var MSHEET_LINE_H = 10; // pixels between staff lines
var MSHEET_NOTE_W = 36; // horizontal spacing per note slot
var MSHEET_MARGIN_LEFT = 50;
var MSHEET_MARGIN_TOP = 50;

function msheetGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function msheetGetWidget(el) {
    return el.closest('.msheet-widget');
}

function msheetGetState(toolId) {
    if (!msheetState[toolId]) {
        var customizations = loadToolCustomizations();
        var saved = customizations[toolId] && customizations[toolId].msheetData;
        if (saved) {
            msheetState[toolId] = {
                notes: saved.notes || [],
                tempo: saved.tempo || 120,
                duration: saved.duration || 'quarter',
                instrument: saved.instrument || 'sine',
                playing: false,
                playIndex: -1,
                playTimer: null,
                audioCtx: null
            };
        } else {
            msheetState[toolId] = null;
        }
    }
    return msheetState[toolId];
}

function msheetSaveData(toolId) {
    var s = msheetState[toolId];
    if (!s) return;
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].msheetData = {
        notes: s.notes,
        tempo: s.tempo,
        duration: s.duration,
        instrument: s.instrument
    };
    saveToolCustomizations(customizations);
}

function msheetNoteYPos(noteIndex) {
    // noteIndex 0 = C4 (below staff), higher = higher pitch
    // E4 (index 2) sits on bottom staff line
    // Staff bottom line y = MSHEET_MARGIN_TOP + 4 * MSHEET_LINE_H
    var bottomLineY = MSHEET_MARGIN_TOP + 4 * MSHEET_LINE_H;
    // Each note step is half a line height
    var halfStep = MSHEET_LINE_H / 2;
    return bottomLineY - (noteIndex - 2) * halfStep;
}

function msheetYToNote(y) {
    var bottomLineY = MSHEET_MARGIN_TOP + 4 * MSHEET_LINE_H;
    var halfStep = MSHEET_LINE_H / 2;
    var noteIndex = Math.round((bottomLineY - y) / halfStep) + 2;
    if (noteIndex < 0) noteIndex = 0;
    if (noteIndex >= MSHEET_NOTES.length) noteIndex = MSHEET_NOTES.length - 1;
    return noteIndex;
}

function msheetXToSlot(x, totalNotes) {
    var slot = Math.floor((x - MSHEET_MARGIN_LEFT + MSHEET_NOTE_W / 2) / MSHEET_NOTE_W);
    if (slot < 0) slot = 0;
    if (slot > totalNotes) slot = totalNotes;
    return slot;
}

function msheetDraw(toolId) {
    var s = msheetState[toolId];
    if (!s) return;

    var tools = document.querySelectorAll('.tool[data-tool="' + toolId + '"]');
    tools.forEach(function(tool) {
        var widget = tool.querySelector('.msheet-widget');
        if (!widget) return;

        var wrap = widget.querySelector('.msheet-canvas-wrap');
        var canvas = wrap.querySelector('canvas');
        if (!canvas) return;

        // Sync controls
        var tempoSlider = widget.querySelector('.msheet-tempo');
        if (tempoSlider) tempoSlider.value = s.tempo;
        var tempoLabel = widget.querySelector('.msheet-tempo-label');
        if (tempoLabel) tempoLabel.textContent = s.tempo;
        var durSel = widget.querySelector('.msheet-duration');
        if (durSel) durSel.value = s.duration;
        var instSel = widget.querySelector('.msheet-instrument');
        if (instSel) instSel.value = s.instrument;

        // Playing highlight
        if (s.playing) {
            wrap.classList.add('msheet-playing');
        } else {
            wrap.classList.remove('msheet-playing');
        }

        // Canvas sizing
        var minW = Math.max(wrap.clientWidth, MSHEET_MARGIN_LEFT + (s.notes.length + 4) * MSHEET_NOTE_W);
        var h = wrap.clientHeight || 180;
        canvas.width = minW;
        canvas.height = h;

        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw staff lines
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        for (var i = 0; i < 5; i++) {
            var ly = MSHEET_MARGIN_TOP + i * MSHEET_LINE_H;
            ctx.beginPath();
            ctx.moveTo(MSHEET_MARGIN_LEFT - 10, ly);
            ctx.lineTo(minW - 10, ly);
            ctx.stroke();
        }

        // Draw treble clef symbol
        ctx.font = '48px serif';
        ctx.fillStyle = '#555';
        ctx.fillText('\uD834\uDD1E', 8, MSHEET_MARGIN_TOP + 3.5 * MSHEET_LINE_H);

        // Draw notes
        for (var n = 0; n < s.notes.length; n++) {
            var note = s.notes[n];
            var nx = MSHEET_MARGIN_LEFT + n * MSHEET_NOTE_W;
            var ny = msheetNoteYPos(note.noteIndex);
            var isPlaying = s.playing && s.playIndex === n;

            // Ledger lines
            var bottomLineY = MSHEET_MARGIN_TOP + 4 * MSHEET_LINE_H;
            var topLineY = MSHEET_MARGIN_TOP;
            // Below staff
            if (ny > bottomLineY) {
                ctx.strokeStyle = '#aaa';
                ctx.lineWidth = 1;
                for (var ll = bottomLineY + MSHEET_LINE_H; ll <= ny + 1; ll += MSHEET_LINE_H) {
                    ctx.beginPath();
                    ctx.moveTo(nx - 8, ll);
                    ctx.lineTo(nx + 8, ll);
                    ctx.stroke();
                }
            }
            // Above staff
            if (ny < topLineY) {
                ctx.strokeStyle = '#aaa';
                ctx.lineWidth = 1;
                for (var ll2 = topLineY - MSHEET_LINE_H; ll2 >= ny - 1; ll2 -= MSHEET_LINE_H) {
                    ctx.beginPath();
                    ctx.moveTo(nx - 8, ll2);
                    ctx.lineTo(nx + 8, ll2);
                    ctx.stroke();
                }
            }

            // Note head
            var dur = note.duration || 'quarter';
            var filled = (dur === 'quarter' || dur === 'eighth' || dur === 'sixteenth');

            ctx.save();
            ctx.translate(nx, ny);
            ctx.beginPath();
            ctx.ellipse(0, 0, 6, 4.5, -0.3, 0, Math.PI * 2);
            ctx.fillStyle = isPlaying ? '#3498db' : '#222';
            if (filled) {
                ctx.fill();
            } else {
                ctx.strokeStyle = isPlaying ? '#3498db' : '#222';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
            ctx.restore();

            // Stem (not for whole notes)
            if (dur !== 'whole') {
                ctx.strokeStyle = isPlaying ? '#3498db' : '#222';
                ctx.lineWidth = 1.5;
                var stemUp = ny > MSHEET_MARGIN_TOP + 2 * MSHEET_LINE_H;
                ctx.beginPath();
                if (stemUp) {
                    ctx.moveTo(nx + 5.5, ny);
                    ctx.lineTo(nx + 5.5, ny - 28);
                } else {
                    ctx.moveTo(nx - 5.5, ny);
                    ctx.lineTo(nx - 5.5, ny + 28);
                }
                ctx.stroke();

                // Flags for eighth/sixteenth
                if (dur === 'eighth' || dur === 'sixteenth') {
                    ctx.strokeStyle = isPlaying ? '#3498db' : '#222';
                    ctx.lineWidth = 1.5;
                    if (stemUp) {
                        ctx.beginPath();
                        ctx.moveTo(nx + 5.5, ny - 28);
                        ctx.quadraticCurveTo(nx + 14, ny - 18, nx + 6, ny - 12);
                        ctx.stroke();
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(nx - 5.5, ny + 28);
                        ctx.quadraticCurveTo(nx - 14, ny + 18, nx - 6, ny + 12);
                        ctx.stroke();
                    }
                }
                if (dur === 'sixteenth') {
                    if (stemUp) {
                        ctx.beginPath();
                        ctx.moveTo(nx + 5.5, ny - 22);
                        ctx.quadraticCurveTo(nx + 14, ny - 12, nx + 6, ny - 6);
                        ctx.stroke();
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(nx - 5.5, ny + 22);
                        ctx.quadraticCurveTo(nx - 14, ny + 12, nx - 6, ny + 6);
                        ctx.stroke();
                    }
                }
            }

            // Note name label
            ctx.font = '9px sans-serif';
            ctx.fillStyle = isPlaying ? '#3498db' : '#888';
            ctx.textAlign = 'center';
            var noteLabel = MSHEET_NOTES[note.noteIndex];
            ctx.fillText(noteLabel, nx, ny > MSHEET_MARGIN_TOP + 2 * MSHEET_LINE_H ? ny + 16 : ny - 12);
            ctx.textAlign = 'start';
        }
    });
}

function msheetCanvasClick(e) {
    var canvas = e.target;
    if (canvas.tagName !== 'CANVAS') return;
    var widget = canvas.closest('.msheet-widget');
    var tool = canvas.closest('.tool');
    if (!widget || !tool) return;
    var toolId = tool.getAttribute('data-tool');
    var s = msheetGetState(toolId);
    if (!s || s.playing) return;

    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var noteIndex = msheetYToNote(y);
    var slot = msheetXToSlot(x, s.notes.length);

    // Check if clicking on existing note to remove it
    for (var i = 0; i < s.notes.length; i++) {
        var nx = MSHEET_MARGIN_LEFT + i * MSHEET_NOTE_W;
        var ny = msheetNoteYPos(s.notes[i].noteIndex);
        if (Math.abs(x - nx) < 10 && Math.abs(y - ny) < 8) {
            s.notes.splice(i, 1);
            msheetSaveData(toolId);
            msheetDraw(toolId);
            return;
        }
    }

    // Insert note at slot
    s.notes.splice(slot, 0, { noteIndex: noteIndex, duration: s.duration });
    msheetSaveData(toolId);
    msheetDraw(toolId);

    // Preview sound
    msheetPlayNote(toolId, noteIndex, 0.2);
}

function msheetPlayNote(toolId, noteIndex, duration) {
    var s = msheetState[toolId];
    if (!s) return;
    if (!s.audioCtx) {
        s.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    var ctx = s.audioCtx;
    var freq = MSHEET_NOTE_NAMES[MSHEET_NOTES[noteIndex]];
    if (!freq) return;

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = s.instrument;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.05);
}

function msheetPlay(btn) {
    var toolId = msheetGetToolId(btn);
    if (!toolId) return;
    var s = msheetGetState(toolId);
    if (!s || s.notes.length === 0) return;

    if (s.playing) {
        msheetStop(toolId);
        return;
    }

    s.playing = true;
    s.playIndex = 0;
    msheetDraw(toolId);
    msheetPlaySequence(toolId);
}

function msheetPlaySequence(toolId) {
    var s = msheetState[toolId];
    if (!s || !s.playing || s.playIndex >= s.notes.length) {
        msheetStop(toolId);
        return;
    }

    var note = s.notes[s.playIndex];
    var beats = MSHEET_DUR_BEATS[note.duration] || 1;
    var beatDuration = 60.0 / s.tempo;
    var noteDuration = beats * beatDuration;

    msheetPlayNote(toolId, note.noteIndex, noteDuration * 0.9);
    msheetDraw(toolId);

    s.playTimer = setTimeout(function() {
        s.playIndex++;
        msheetPlaySequence(toolId);
    }, noteDuration * 1000);
}

function msheetStop(toolId) {
    var s = msheetState[toolId];
    if (!s) return;
    s.playing = false;
    s.playIndex = -1;
    if (s.playTimer) { clearTimeout(s.playTimer); s.playTimer = null; }
    msheetDraw(toolId);
}

function msheetClear(btn) {
    var toolId = msheetGetToolId(btn);
    if (!toolId) return;
    var s = msheetGetState(toolId);
    if (!s) return;
    msheetStop(toolId);
    s.notes = [];
    msheetSaveData(toolId);
    msheetDraw(toolId);
}

function msheetSetTempo(input) {
    var toolId = msheetGetToolId(input);
    if (!toolId) return;
    var s = msheetGetState(toolId);
    if (!s) return;
    s.tempo = parseInt(input.value) || 120;
    var label = input.closest('.msheet-toolbar').querySelector('.msheet-tempo-label');
    if (label) label.textContent = s.tempo;
    msheetSaveData(toolId);
}

function msheetSetDuration(sel) {
    var toolId = msheetGetToolId(sel);
    if (!toolId) return;
    var s = msheetGetState(toolId);
    if (s) s.duration = sel.value;
    msheetSaveData(toolId);
}

function msheetSetInstrument(sel) {
    var toolId = msheetGetToolId(sel);
    if (!toolId) return;
    var s = msheetGetState(toolId);
    if (s) s.instrument = sel.value;
    msheetSaveData(toolId);
}

function msheetInit() {
    document.querySelectorAll('.msheet-widget').forEach(function(widget) {
        var tool = widget.closest('.tool');
        if (!tool) return;
        var toolId = tool.getAttribute('data-tool');
        if (!toolId) return;

        var s = msheetGetState(toolId);
        if (!s) {
            msheetState[toolId] = {
                notes: [],
                tempo: 120,
                duration: 'quarter',
                instrument: 'sine',
                playing: false,
                playIndex: -1,
                playTimer: null,
                audioCtx: null
            };
        }

        // Canvas click handler
        var wrap = widget.querySelector('.msheet-canvas-wrap');
        if (wrap && !wrap._msheetBound) {
            wrap._msheetBound = true;
            // Create canvas if not present
            if (!wrap.querySelector('canvas')) {
                var c = document.createElement('canvas');
                wrap.appendChild(c);
            }
            wrap.addEventListener('click', msheetCanvasClick);
            // Resize observer
            var ro = new ResizeObserver(function() { msheetDraw(toolId); });
            ro.observe(wrap);
        }

        msheetDraw(toolId);
    });
}

// =============================================
// PIXEL ART EDITOR
// =============================================

const _paedState = new WeakMap();

const PAED_PALETTE = [
    '#000000', '#ffffff', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
    '#3498db', '#9b59b6', '#1abc9c', '#bdc3c7', '#7f8c8d', '#8e44ad',
    '#d35400', '#2c3e50', '#f39c12', '#c0392b'
];

function paedGetToolId(widget) {
    var tool = widget.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function paedGetState(widget) {
    if (!_paedState.has(widget)) {
        _paedState.set(widget, {
            gridSize: 16,
            pixels: null,
            color: '#000000',
            tool: 'draw',
            showGrid: true,
            isDrawing: false,
            undoStack: [],
            redoStack: [],
            maxUndo: 30
        });
    }
    return _paedState.get(widget);
}

function paedSaveData(widget) {
    var toolId = paedGetToolId(widget);
    if (!toolId) return;
    var st = paedGetState(widget);
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].paedData = {
        gridSize: st.gridSize,
        pixels: st.pixels,
        color: st.color,
        tool: st.tool,
        showGrid: st.showGrid
    };
    saveToolCustomizations(customizations);
}

function paedInitPixels(size) {
    var pixels = [];
    for (var r = 0; r < size; r++) {
        var row = [];
        for (var c = 0; c < size; c++) {
            row.push(null);
        }
        pixels.push(row);
    }
    return pixels;
}

function paedRender(widget) {
    var st = paedGetState(widget);
    var canvas = widget.querySelector('.paed-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var size = st.gridSize;
    var cellW = canvas.width / size;
    var cellH = canvas.height / size;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw checkerboard background for empty cells, fill colored cells
    for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
            var x = c * cellW;
            var y = r * cellH;
            if (st.pixels[r][c]) {
                ctx.fillStyle = st.pixels[r][c];
                ctx.fillRect(x, y, cellW, cellH);
            } else {
                // Checkerboard for transparency
                var light = '#ffffff';
                var dark = '#e0e0e0';
                ctx.fillStyle = (r + c) % 2 === 0 ? light : dark;
                ctx.fillRect(x, y, cellW, cellH);
            }
        }
    }

    // Draw grid lines
    if (st.showGrid && cellW >= 3) {
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (var i = 0; i <= size; i++) {
            var gx = Math.floor(i * cellW) + 0.5;
            var gy = Math.floor(i * cellH) + 0.5;
            ctx.moveTo(gx, 0);
            ctx.lineTo(gx, canvas.height);
            ctx.moveTo(0, gy);
            ctx.lineTo(canvas.width, gy);
        }
        ctx.stroke();
    }
}

function paedCoordsToCell(widget, e) {
    var st = paedGetState(widget);
    var canvas = widget.querySelector('.paed-canvas');
    var rect = canvas.getBoundingClientRect();
    var x, y;
    if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    var col = Math.floor(x / (rect.width / st.gridSize));
    var row = Math.floor(y / (rect.height / st.gridSize));
    if (row < 0 || row >= st.gridSize || col < 0 || col >= st.gridSize) return null;
    return { row: row, col: col };
}

function paedSaveSnapshot(widget) {
    var st = paedGetState(widget);
    var snap = st.pixels.map(function(row) { return row.slice(); });
    st.undoStack.push(snap);
    if (st.undoStack.length > st.maxUndo) st.undoStack.shift();
    st.redoStack = [];
    paedUpdateStatus(widget);
}

function paedApplyTool(widget, row, col) {
    var st = paedGetState(widget);
    if (st.tool === 'draw') {
        st.pixels[row][col] = st.color;
    } else if (st.tool === 'erase') {
        st.pixels[row][col] = null;
    } else if (st.tool === 'fill') {
        var target = st.pixels[row][col];
        if (target === st.color) return;
        paedFloodFill(widget, row, col, target, st.color);
    } else if (st.tool === 'eyedropper') {
        var picked = st.pixels[row][col];
        if (picked) {
            paedSetColor(widget, picked);
        }
    }
    paedRender(widget);
}

function paedFloodFill(widget, row, col, target, fill) {
    var st = paedGetState(widget);
    var size = st.gridSize;
    var queue = [{ r: row, c: col }];
    var visited = {};
    while (queue.length > 0) {
        var p = queue.shift();
        var key = p.r + ',' + p.c;
        if (visited[key]) continue;
        if (p.r < 0 || p.r >= size || p.c < 0 || p.c >= size) continue;
        if (st.pixels[p.r][p.c] !== target) continue;
        visited[key] = true;
        st.pixels[p.r][p.c] = fill;
        queue.push({ r: p.r - 1, c: p.c });
        queue.push({ r: p.r + 1, c: p.c });
        queue.push({ r: p.r, c: p.c - 1 });
        queue.push({ r: p.r, c: p.c + 1 });
    }
}

function paedHandleStart(widget, e) {
    var st = paedGetState(widget);
    var cell = paedCoordsToCell(widget, e);
    if (!cell) return;
    st.isDrawing = true;
    paedSaveSnapshot(widget);
    paedApplyTool(widget, cell.row, cell.col);
    st._lastCell = cell;
}

function paedHandleMove(widget, e) {
    var st = paedGetState(widget);
    if (!st.isDrawing) return;
    var cell = paedCoordsToCell(widget, e);
    if (!cell) return;
    if (st._lastCell && cell.row === st._lastCell.row && cell.col === st._lastCell.col) return;
    if (st.tool === 'draw' || st.tool === 'erase') {
        paedApplyTool(widget, cell.row, cell.col);
    }
    st._lastCell = cell;
}

function paedHandleEnd(widget) {
    var st = paedGetState(widget);
    st.isDrawing = false;
    st._lastCell = null;
    paedSaveData(widget);
}

function paedSetTool(widget, tool) {
    var st = paedGetState(widget);
    st.tool = tool;
    var btns = widget.querySelectorAll('.paed-tool-btn');
    btns.forEach(function(b) {
        b.classList.toggle('active', b.dataset.tool === tool);
    });
    paedSaveData(widget);
}

function paedSetColor(widget, color) {
    var st = paedGetState(widget);
    st.color = color;
    var swatches = widget.querySelectorAll('.paed-swatch');
    swatches.forEach(function(s) {
        s.classList.toggle('active', s.dataset.color === color);
    });
    var inp = widget.querySelector('.paed-color-input');
    if (inp) inp.value = color;
    // Switch to draw tool when a color is picked
    if (st.tool === 'eyedropper') {
        paedSetTool(widget, 'draw');
    }
    paedSaveData(widget);
}

function paedSetSize(widget, size) {
    var st = paedGetState(widget);
    st.gridSize = size;
    st.pixels = paedInitPixels(size);
    st.undoStack = [];
    st.redoStack = [];
    paedResizeCanvas(widget);
    paedRender(widget);
    paedUpdateStatus(widget);
    paedSaveData(widget);
}

function paedColorInput(input) {
    var widget = input.closest('.paed-widget');
    if (!widget) return;
    paedSetColor(widget, input.value);
    // Deactivate all palette swatches since custom color
    widget.querySelectorAll('.paed-swatch').forEach(function(s) {
        s.classList.remove('active');
    });
}

function paedUndo(widget) {
    var st = paedGetState(widget);
    if (st.undoStack.length === 0) return;
    var snap = st.pixels.map(function(row) { return row.slice(); });
    st.redoStack.push(snap);
    st.pixels = st.undoStack.pop();
    paedRender(widget);
    paedUpdateStatus(widget);
    paedSaveData(widget);
}

function paedRedo(widget) {
    var st = paedGetState(widget);
    if (st.redoStack.length === 0) return;
    var snap = st.pixels.map(function(row) { return row.slice(); });
    st.undoStack.push(snap);
    st.pixels = st.redoStack.pop();
    paedRender(widget);
    paedUpdateStatus(widget);
    paedSaveData(widget);
}

function paedClear(widget) {
    var st = paedGetState(widget);
    paedSaveSnapshot(widget);
    st.pixels = paedInitPixels(st.gridSize);
    paedRender(widget);
    paedSaveData(widget);
}

function paedToggleGrid(widget) {
    var st = paedGetState(widget);
    st.showGrid = !st.showGrid;
    var btn = widget.querySelector('.paed-grid-btn');
    if (btn) btn.classList.toggle('active', st.showGrid);
    paedRender(widget);
    paedSaveData(widget);
}

function paedExport(widget) {
    var st = paedGetState(widget);
    var size = st.gridSize;
    var scale;
    if (size <= 16) scale = 16;
    else if (size <= 32) scale = 8;
    else scale = 4;
    var outW = size * scale;
    var outH = size * scale;
    var offscreen = document.createElement('canvas');
    offscreen.width = outW;
    offscreen.height = outH;
    var ctx = offscreen.getContext('2d');
    for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
            if (st.pixels[r][c]) {
                ctx.fillStyle = st.pixels[r][c];
                ctx.fillRect(c * scale, r * scale, scale, scale);
            }
        }
    }
    var link = document.createElement('a');
    link.download = 'pixel-art-' + size + 'x' + size + '.png';
    link.href = offscreen.toDataURL('image/png');
    link.click();
}

function paedResizeCanvas(widget) {
    var st = paedGetState(widget);
    var wrap = widget.querySelector('.paed-canvas-wrap');
    var canvas = widget.querySelector('.paed-canvas');
    if (!wrap || !canvas) return;
    var rect = wrap.getBoundingClientRect();
    var available = Math.min(rect.width - 8, rect.height - 8);
    var dim = Math.max(Math.floor(available / st.gridSize) * st.gridSize, st.gridSize);
    canvas.width = dim;
    canvas.height = dim;
    canvas.style.width = dim + 'px';
    canvas.style.height = dim + 'px';
    paedRender(widget);
}

function paedUpdateStatus(widget) {
    var st = paedGetState(widget);
    var el = widget.querySelector('.paed-status');
    if (el) {
        el.textContent = st.gridSize + '\u00d7' + st.gridSize + '  \u2502  Undo: ' + st.undoStack.length + '  Redo: ' + st.redoStack.length;
    }
}

function paedInit() {
    document.querySelectorAll('.paed-widget').forEach(function(widget) {
        if (widget.dataset.inited) return;
        widget.dataset.inited = '1';
        var st = paedGetState(widget);

        // Restore saved state
        var toolId = paedGetToolId(widget);
        var customizations = loadToolCustomizations();
        var saved = (toolId && customizations[toolId]) ? customizations[toolId].paedData : null;
        if (saved) {
            st.gridSize = saved.gridSize || 16;
            st.pixels = saved.pixels || paedInitPixels(st.gridSize);
            st.color = saved.color || '#000000';
            st.tool = saved.tool || 'draw';
            st.showGrid = saved.showGrid !== undefined ? saved.showGrid : true;
            // Update grid size select
            var sel = widget.querySelector('.paed-toolbar select');
            if (sel) sel.value = String(st.gridSize);
            // Update color input
            var cinp = widget.querySelector('.paed-color-input');
            if (cinp) cinp.value = st.color;
        } else {
            st.pixels = paedInitPixels(st.gridSize);
        }

        var canvas = widget.querySelector('.paed-canvas');
        var wrap = widget.querySelector('.paed-canvas-wrap');

        // Initial canvas sizing
        paedResizeCanvas(widget);

        // Set initial active states
        var swatches = widget.querySelectorAll('.paed-swatch');
        swatches.forEach(function(s) {
            s.classList.toggle('active', s.dataset.color === st.color);
        });
        var toolBtns = widget.querySelectorAll('.paed-tool-btn');
        toolBtns.forEach(function(b) {
            b.classList.toggle('active', b.dataset.tool === st.tool);
        });
        var gridBtn = widget.querySelector('.paed-grid-btn');
        if (gridBtn) gridBtn.classList.toggle('active', st.showGrid);

        // Mouse events
        canvas.addEventListener('mousedown', function(e) {
            e.preventDefault();
            paedHandleStart(widget, e);
            var onMove = function(ev) { ev.preventDefault(); paedHandleMove(widget, ev); };
            var onUp = function() {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                paedHandleEnd(widget);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });

        // Touch events
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            paedHandleStart(widget, e);
        }, { passive: false });
        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            paedHandleMove(widget, e);
        }, { passive: false });
        canvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            paedHandleEnd(widget);
        }, { passive: false });

        // Resize observer
        var ro = new ResizeObserver(function() { paedResizeCanvas(widget); });
        ro.observe(wrap);

        paedUpdateStatus(widget);
    });
}

// =============================================
// COLOR PALETTE GENERATOR
// =============================================

function cpalGetToolId(widget) {
    return widget.closest('.tool').getAttribute('data-tool');
}

function cpalHslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c / 2;
    var r, g, b;
    if (h < 60)       { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else              { r = c; g = 0; b = x; }
    var ri = Math.round((r + m) * 255);
    var gi = Math.round((g + m) * 255);
    var bi = Math.round((b + m) * 255);
    return '#' + ((1 << 24) + (ri << 16) + (gi << 8) + bi).toString(16).slice(1);
}

function cpalHexToHsl(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    var r = parseInt(hex.substring(0, 2), 16) / 255;
    var g = parseInt(hex.substring(2, 4), 16) / 255;
    var b = parseInt(hex.substring(4, 6), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        else if (max === g) h = ((b - r) / d + 2) * 60;
        else h = ((r - g) / d + 4) * 60;
    }
    return { h: h, s: s, l: l };
}

function cpalGenerate(widget) {
    var select = widget.querySelector('.cpal-mode');
    var input = widget.querySelector('.cpal-base');
    var mode = select ? select.value : 'complementary';
    var baseHex = input ? input.value : '#3498db';
    var base = cpalHexToHsl(baseHex);
    var h = base.h, s = base.s, l = base.l;

    var colors = [];
    switch (mode) {
        case 'complementary':
            colors = [
                { h: h, s: s, l: l },
                { h: (h + 180) % 360, s: s, l: l }
            ];
            break;
        case 'analogous':
            colors = [
                { h: (h - 30 + 360) % 360, s: s, l: l },
                { h: (h - 15 + 360) % 360, s: s, l: l },
                { h: h, s: s, l: l },
                { h: (h + 15) % 360, s: s, l: l },
                { h: (h + 30) % 360, s: s, l: l }
            ];
            break;
        case 'triadic':
            colors = [
                { h: h, s: s, l: l },
                { h: (h + 120) % 360, s: s, l: l },
                { h: (h + 240) % 360, s: s, l: l }
            ];
            break;
        case 'tetradic':
            colors = [
                { h: h, s: s, l: l },
                { h: (h + 90) % 360, s: s, l: l },
                { h: (h + 180) % 360, s: s, l: l },
                { h: (h + 270) % 360, s: s, l: l }
            ];
            break;
        case 'split-complementary':
            colors = [
                { h: h, s: s, l: l },
                { h: (h + 150) % 360, s: s, l: l },
                { h: (h + 210) % 360, s: s, l: l }
            ];
            break;
        case 'monochromatic':
            colors = [
                { h: h, s: s, l: Math.max(0.1, l - 0.3) },
                { h: h, s: s, l: Math.max(0.1, l - 0.15) },
                { h: h, s: s, l: l },
                { h: h, s: s, l: Math.min(0.9, l + 0.15) },
                { h: h, s: s, l: Math.min(0.9, l + 0.3) }
            ];
            break;
    }

    var hexColors = colors.map(function(c) {
        return cpalHslToHex(c.h, c.s, c.l);
    });

    if (!widget._cpalPalette) widget._cpalPalette = [];
    if (!widget._cpalLocked) widget._cpalLocked = [];

    var palette = [];
    for (var i = 0; i < hexColors.length; i++) {
        if (widget._cpalLocked[i]) {
            palette.push(widget._cpalPalette[i] || hexColors[i]);
        } else {
            palette.push(hexColors[i]);
        }
    }
    widget._cpalLocked = widget._cpalLocked.slice(0, hexColors.length);
    widget._cpalPalette = palette;

    cpalRender(widget);
    cpalSaveState(widget);
}

function cpalRender(widget) {
    var grid = widget.querySelector('.cpal-grid');
    if (!grid) return;
    var palette = widget._cpalPalette || [];
    var locked = widget._cpalLocked || [];
    var html = '';
    for (var i = 0; i < palette.length; i++) {
        var hex = palette[i];
        var isLocked = locked[i] ? ' locked' : '';
        var lockIcon = locked[i] ? '\uD83D\uDD12' : '\uD83D\uDD13';
        html += '<div class="cpal-swatch" onclick="cpalCopyColor(this, ' + i + ')" title="Click to copy ' + hex + '">' +
            '<div class="cpal-swatch-color" style="background:' + hex + '"></div>' +
            '<button class="cpal-swatch-lock' + isLocked + '" onclick="event.stopPropagation(); cpalToggleLock(this, ' + i + ')" title="' + (locked[i] ? 'Unlock' : 'Lock') + '">' + lockIcon + '</button>' +
            '<div class="cpal-swatch-label">' + hex.toUpperCase() + '</div>' +
        '</div>';
    }
    grid.innerHTML = html;
}

function cpalSetMode(select) {
    var widget = select.closest('.cpal-widget');
    widget._cpalLocked = [];
    cpalGenerate(widget);
}

function cpalSetBase(input) {
    var widget = input.closest('.cpal-widget');
    cpalGenerate(widget);
}

function cpalRandomize(btn) {
    var widget = btn.closest('.cpal-widget');
    var input = widget.querySelector('.cpal-base');
    var h = Math.floor(Math.random() * 360);
    var s = 0.5 + Math.random() * 0.4;
    var l = 0.35 + Math.random() * 0.3;
    var hex = cpalHslToHex(h, s, l);
    if (input) input.value = hex;
    cpalGenerate(widget);
}

function cpalToggleLock(btn, index) {
    var widget = btn.closest('.cpal-widget');
    if (!widget._cpalLocked) widget._cpalLocked = [];
    widget._cpalLocked[index] = !widget._cpalLocked[index];
    cpalRender(widget);
    cpalSaveState(widget);
}

function cpalCopyColor(el, index) {
    var widget = el.closest('.cpal-widget');
    var palette = widget._cpalPalette || [];
    var hex = palette[index];
    if (!hex) return;
    navigator.clipboard.writeText(hex.toUpperCase()).then(function() {
        el.classList.add('copied');
        var status = widget.querySelector('.cpal-status');
        if (status) { status.textContent = 'Copied ' + hex.toUpperCase(); status.className = 'cpal-status success'; }
        setTimeout(function() { el.classList.remove('copied'); }, 600);
    });
}

function cpalCopyAll(btn) {
    var widget = btn.closest('.cpal-widget');
    var palette = widget._cpalPalette || [];
    var text = palette.map(function(h) { return h.toUpperCase(); }).join(', ');
    navigator.clipboard.writeText(text).then(function() {
        var status = widget.querySelector('.cpal-status');
        if (status) { status.textContent = 'Copied all colors'; status.className = 'cpal-status success'; }
    });
}

function cpalSaveState(widget) {
    var toolId = cpalGetToolId(widget);
    var select = widget.querySelector('.cpal-mode');
    var input = widget.querySelector('.cpal-base');
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].cpalMode = select ? select.value : 'complementary';
    customizations[toolId].cpalBase = input ? input.value : '#3498db';
    customizations[toolId].cpalPalette = widget._cpalPalette || [];
    customizations[toolId].cpalLocked = widget._cpalLocked || [];
    saveToolCustomizations(customizations);
}

function cpalInit() {
    document.querySelectorAll('.cpal-widget').forEach(function(widget) {
        if (widget._cpalReady) return;
        widget._cpalReady = true;

        var toolId = cpalGetToolId(widget);
        var customizations = loadToolCustomizations();
        var data = (customizations[toolId]) || {};

        var select = widget.querySelector('.cpal-mode');
        var input = widget.querySelector('.cpal-base');

        if (data.cpalMode && select) select.value = data.cpalMode;
        if (data.cpalBase && input) input.value = data.cpalBase;
        widget._cpalPalette = data.cpalPalette || [];
        widget._cpalLocked = data.cpalLocked || [];

        if (widget._cpalPalette.length > 0) {
            cpalRender(widget);
        } else {
            cpalGenerate(widget);
        }
    });
}

// =============================================
// SVG PATH EDITOR
// =============================================

const _speState = new WeakMap();

function speGetToolId(widget) {
    var tool = widget.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function speGetState(widget) {
    if (!_speState.has(widget)) {
        _speState.set(widget, {
            tool: 'line',
            commands: [],
            selectedIdx: -1,
            dragging: null,
            undoStack: [],
            maxUndo: 30,
            _justDragged: false,
            _debounceTimer: null
        });
    }
    return _speState.get(widget);
}

function speSaveData(widget) {
    var toolId = speGetToolId(widget);
    if (!toolId) return;
    var st = speGetState(widget);
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].speData = {
        tool: st.tool,
        commands: st.commands
    };
    saveToolCustomizations(customizations);
}

function speSvgCoords(svg, e) {
    var pt = svg.createSVGPoint();
    var touch = e.touches ? e.touches[0] : e;
    pt.x = touch.clientX;
    pt.y = touch.clientY;
    var ctm = svg.getScreenCTM();
    if (ctm) pt = pt.matrixTransform(ctm.inverse());
    return { x: Math.round(pt.x), y: Math.round(pt.y) };
}

function speCommandsToD(commands) {
    var parts = [];
    for (var i = 0; i < commands.length; i++) {
        var c = commands[i];
        if (c.type === 'M') parts.push('M ' + c.x + ' ' + c.y);
        else if (c.type === 'L') parts.push('L ' + c.x + ' ' + c.y);
        else if (c.type === 'Q') parts.push('Q ' + c.cx + ' ' + c.cy + ' ' + c.x + ' ' + c.y);
        else if (c.type === 'C') parts.push('C ' + c.c1x + ' ' + c.c1y + ' ' + c.c2x + ' ' + c.c2y + ' ' + c.x + ' ' + c.y);
    }
    return parts.join(' ');
}

function speParseDString(d) {
    if (!d || !d.trim()) return [];
    var commands = [];
    var re = /([MLQC])\s*([\d.\-e+,\s]+)/gi;
    var match;
    while ((match = re.exec(d)) !== null) {
        var type = match[1].toUpperCase();
        var nums = match[2].trim().split(/[\s,]+/).map(Number);
        if (type === 'M' && nums.length >= 2) {
            commands.push({ type: 'M', x: nums[0], y: nums[1] });
        } else if (type === 'L' && nums.length >= 2) {
            commands.push({ type: 'L', x: nums[0], y: nums[1] });
        } else if (type === 'Q' && nums.length >= 4) {
            commands.push({ type: 'Q', cx: nums[0], cy: nums[1], x: nums[2], y: nums[3] });
        } else if (type === 'C' && nums.length >= 6) {
            commands.push({ type: 'C', c1x: nums[0], c1y: nums[1], c2x: nums[2], c2y: nums[3], x: nums[4], y: nums[5] });
        }
    }
    return commands;
}

function speSaveSnapshot(widget) {
    var st = speGetState(widget);
    st.undoStack.push(JSON.parse(JSON.stringify(st.commands)));
    if (st.undoStack.length > st.maxUndo) st.undoStack.shift();
}

function speRender(widget) {
    var st = speGetState(widget);
    var svg = widget.querySelector('.spe-svg');
    if (!svg) return;
    var path = svg.querySelector('.spe-path');
    if (path) path.setAttribute('d', speCommandsToD(st.commands));

    // Remove old control elements
    svg.querySelectorAll('.spe-point, .spe-control-point, .spe-control-line').forEach(function(el) { el.remove(); });

    var ns = 'http://www.w3.org/2000/svg';
    for (var i = 0; i < st.commands.length; i++) {
        var c = st.commands[i];

        // Draw control lines and control points for bezier commands
        if (c.type === 'Q') {
            var line1 = document.createElementNS(ns, 'line');
            var prev = i > 0 ? st.commands[i - 1] : c;
            line1.setAttribute('x1', prev.x); line1.setAttribute('y1', prev.y);
            line1.setAttribute('x2', c.cx); line1.setAttribute('y2', c.cy);
            line1.setAttribute('class', 'spe-control-line');
            svg.appendChild(line1);
            var line2 = document.createElementNS(ns, 'line');
            line2.setAttribute('x1', c.cx); line2.setAttribute('y1', c.cy);
            line2.setAttribute('x2', c.x); line2.setAttribute('y2', c.y);
            line2.setAttribute('class', 'spe-control-line');
            svg.appendChild(line2);
            var cp = document.createElementNS(ns, 'circle');
            cp.setAttribute('cx', c.cx); cp.setAttribute('cy', c.cy);
            cp.setAttribute('r', 5);
            cp.setAttribute('class', 'spe-control-point');
            cp.setAttribute('data-idx', i); cp.setAttribute('data-handle', 'c');
            svg.appendChild(cp);
        } else if (c.type === 'C') {
            var prev2 = i > 0 ? st.commands[i - 1] : c;
            var cl1 = document.createElementNS(ns, 'line');
            cl1.setAttribute('x1', prev2.x); cl1.setAttribute('y1', prev2.y);
            cl1.setAttribute('x2', c.c1x); cl1.setAttribute('y2', c.c1y);
            cl1.setAttribute('class', 'spe-control-line');
            svg.appendChild(cl1);
            var cl2 = document.createElementNS(ns, 'line');
            cl2.setAttribute('x1', c.c2x); cl2.setAttribute('y1', c.c2y);
            cl2.setAttribute('x2', c.x); cl2.setAttribute('y2', c.y);
            cl2.setAttribute('class', 'spe-control-line');
            svg.appendChild(cl2);
            var cp1 = document.createElementNS(ns, 'circle');
            cp1.setAttribute('cx', c.c1x); cp1.setAttribute('cy', c.c1y);
            cp1.setAttribute('r', 5);
            cp1.setAttribute('class', 'spe-control-point');
            cp1.setAttribute('data-idx', i); cp1.setAttribute('data-handle', 'c1');
            svg.appendChild(cp1);
            var cp2 = document.createElementNS(ns, 'circle');
            cp2.setAttribute('cx', c.c2x); cp2.setAttribute('cy', c.c2y);
            cp2.setAttribute('r', 5);
            cp2.setAttribute('class', 'spe-control-point');
            cp2.setAttribute('data-idx', i); cp2.setAttribute('data-handle', 'c2');
            svg.appendChild(cp2);
        }

        // Draw endpoint
        var circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', c.x); circle.setAttribute('cy', c.y);
        circle.setAttribute('r', 5);
        circle.setAttribute('class', 'spe-point' + (i === st.selectedIdx ? ' selected' : ''));
        circle.setAttribute('data-idx', i);
        svg.appendChild(circle);
    }
}

function speUpdateOutput(widget) {
    var st = speGetState(widget);
    var textarea = widget.querySelector('.spe-output');
    if (textarea) textarea.value = speCommandsToD(st.commands);
}

function speSetTool(btn, tool) {
    var widget = btn.closest('.spe-widget');
    if (!widget) return;
    var st = speGetState(widget);
    st.tool = tool;
    widget.querySelectorAll('.spe-tool-btn[data-tool]').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-tool') === tool);
    });
    var svg = widget.querySelector('.spe-svg');
    if (svg) svg.classList.toggle('move-mode', tool === 'move');
    speSaveData(widget);
}

function speHandleClick(widget, e) {
    var st = speGetState(widget);
    if (st._justDragged) { st._justDragged = false; return; }
    if (st.tool === 'move') return;
    if (e.target.classList.contains('spe-point') || e.target.classList.contains('spe-control-point')) {
        // Select point instead of adding
        if (e.target.classList.contains('spe-point')) {
            st.selectedIdx = parseInt(e.target.getAttribute('data-idx'));
            speRender(widget);
        }
        return;
    }
    var svg = widget.querySelector('.spe-svg');
    if (!svg) return;
    var coords = speSvgCoords(svg, e);

    speSaveSnapshot(widget);

    if (st.commands.length === 0) {
        // First point is always M
        st.commands.push({ type: 'M', x: coords.x, y: coords.y });
    } else {
        var last = st.commands[st.commands.length - 1];
        if (st.tool === 'line') {
            st.commands.push({ type: 'L', x: coords.x, y: coords.y });
        } else if (st.tool === 'quad') {
            // Default control point: midpoint offset 40px up
            var mx = (last.x + coords.x) / 2;
            var my = (last.y + coords.y) / 2 - 40;
            st.commands.push({ type: 'Q', cx: mx, cy: my, x: coords.x, y: coords.y });
        } else if (st.tool === 'cubic') {
            // Default control points: 1/3 and 2/3, offset 30px up
            var dx = coords.x - last.x;
            var dy = coords.y - last.y;
            st.commands.push({
                type: 'C',
                c1x: Math.round(last.x + dx / 3), c1y: Math.round(last.y + dy / 3 - 30),
                c2x: Math.round(last.x + 2 * dx / 3), c2y: Math.round(last.y + 2 * dy / 3 - 30),
                x: coords.x, y: coords.y
            });
        }
    }
    st.selectedIdx = st.commands.length - 1;
    speRender(widget);
    speUpdateOutput(widget);
    speSaveData(widget);
}

function speHandleMouseDown(widget, e) {
    var target = e.target;
    if (!target.classList.contains('spe-point') && !target.classList.contains('spe-control-point')) return;
    e.preventDefault();
    var st = speGetState(widget);
    var idx = parseInt(target.getAttribute('data-idx'));

    speSaveSnapshot(widget);

    if (target.classList.contains('spe-point')) {
        st.selectedIdx = idx;
        st.dragging = { idx: idx, handle: null };
    } else {
        st.dragging = { idx: idx, handle: target.getAttribute('data-handle') };
    }
    target.classList.add('dragging');

    var svg = widget.querySelector('.spe-svg');
    var onMove = function(ev) {
        ev.preventDefault();
        speHandleMouseMove(widget, ev);
    };
    var onUp = function(ev) {
        speHandleMouseUp(widget, ev);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
}

function speHandleMouseMove(widget, e) {
    var st = speGetState(widget);
    if (!st.dragging) return;
    var svg = widget.querySelector('.spe-svg');
    if (!svg) return;
    var coords = speSvgCoords(svg, e);
    var c = st.commands[st.dragging.idx];
    if (!c) return;

    if (!st.dragging.handle) {
        c.x = coords.x; c.y = coords.y;
    } else if (st.dragging.handle === 'c') {
        c.cx = coords.x; c.cy = coords.y;
    } else if (st.dragging.handle === 'c1') {
        c.c1x = coords.x; c.c1y = coords.y;
    } else if (st.dragging.handle === 'c2') {
        c.c2x = coords.x; c.c2y = coords.y;
    }
    speRender(widget);
    speUpdateOutput(widget);
}

function speHandleMouseUp(widget, e) {
    var st = speGetState(widget);
    if (!st.dragging) return;
    st._justDragged = true;
    widget.querySelectorAll('.dragging').forEach(function(el) { el.classList.remove('dragging'); });
    st.dragging = null;
    speSaveData(widget);
}

function speDFromInput(widget) {
    var st = speGetState(widget);
    var textarea = widget.querySelector('.spe-output');
    if (!textarea) return;
    if (st._debounceTimer) clearTimeout(st._debounceTimer);
    st._debounceTimer = setTimeout(function() {
        speSaveSnapshot(widget);
        st.commands = speParseDString(textarea.value);
        st.selectedIdx = -1;
        speRender(widget);
        speSaveData(widget);
    }, 500);
}

function speUndo(btn) {
    var widget = btn.closest('.spe-widget');
    if (!widget) return;
    var st = speGetState(widget);
    if (st.undoStack.length === 0) return;
    st.commands = st.undoStack.pop();
    st.selectedIdx = -1;
    speRender(widget);
    speUpdateOutput(widget);
    speSaveData(widget);
}

function speClear(btn) {
    var widget = btn.closest('.spe-widget');
    if (!widget) return;
    var st = speGetState(widget);
    speSaveSnapshot(widget);
    st.commands = [];
    st.selectedIdx = -1;
    speRender(widget);
    speUpdateOutput(widget);
    speSaveData(widget);
}

function speCopy(btn) {
    var widget = btn.closest('.spe-widget');
    if (!widget) return;
    var st = speGetState(widget);
    var d = speCommandsToD(st.commands);
    var status = widget.querySelector('.spe-status');
    if (!d) {
        if (status) { status.textContent = 'Nothing to copy'; setTimeout(function() { status.textContent = ''; }, 1500); }
        return;
    }
    navigator.clipboard.writeText(d).then(function() {
        if (status) { status.textContent = 'Copied!'; status.classList.add('success'); setTimeout(function() { status.textContent = ''; status.classList.remove('success'); }, 1500); }
    });
}

function speDeleteSelected(btn) {
    var widget = btn.closest('.spe-widget');
    if (!widget) return;
    var st = speGetState(widget);
    if (st.selectedIdx < 0 || st.selectedIdx >= st.commands.length) return;
    speSaveSnapshot(widget);
    st.commands.splice(st.selectedIdx, 1);
    // Ensure first command is M if commands remain
    if (st.commands.length > 0 && st.commands[0].type !== 'M') {
        st.commands[0] = { type: 'M', x: st.commands[0].x, y: st.commands[0].y };
    }
    st.selectedIdx = Math.min(st.selectedIdx, st.commands.length - 1);
    speRender(widget);
    speUpdateOutput(widget);
    speSaveData(widget);
}

function speInit() {
    document.querySelectorAll('.spe-widget').forEach(function(widget) {
        if (widget._speReady) return;
        widget._speReady = true;

        var st = speGetState(widget);
        var toolId = speGetToolId(widget);
        var customizations = loadToolCustomizations();
        var data = customizations[toolId] && customizations[toolId].speData;
        if (data) {
            if (data.tool) st.tool = data.tool;
            if (data.commands) st.commands = data.commands;
        }

        // Set active tool button
        widget.querySelectorAll('.spe-tool-btn[data-tool]').forEach(function(b) {
            b.classList.toggle('active', b.getAttribute('data-tool') === st.tool);
        });

        var svg = widget.querySelector('.spe-svg');
        if (!svg) return;
        svg.classList.toggle('move-mode', st.tool === 'move');

        // Click to add points
        svg.addEventListener('click', function(e) { speHandleClick(widget, e); });

        // Mousedown for drag
        svg.addEventListener('mousedown', function(e) { speHandleMouseDown(widget, e); });
        svg.addEventListener('touchstart', function(e) {
            if (e.target.classList.contains('spe-point') || e.target.classList.contains('spe-control-point')) {
                e.preventDefault();
                speHandleMouseDown(widget, e);
            }
        }, { passive: false });

        // Textarea input
        var textarea = widget.querySelector('.spe-output');
        if (textarea) textarea.addEventListener('input', function() { speDFromInput(widget); });

        // ResizeObserver to match viewBox to container size
        var wrap = widget.querySelector('.spe-canvas-wrap');
        if (wrap && svg) {
            var ro = new ResizeObserver(function(entries) {
                var entry = entries[0];
                var w = Math.round(entry.contentRect.width) || 400;
                var h = Math.round(entry.contentRect.height) || 300;
                svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
            });
            ro.observe(wrap);
        }

        speRender(widget);
        speUpdateOutput(widget);
    });
}

// =============================================
// SCRIPT INJECTION FOR HTML EXPORT
// =============================================

(function injectScriptsForExport() {
    if (document.getElementById('creative-tools-scripts')) return;

    var cpkFunctions = [cpkHsvToRgb, cpkRgbToHsv, cpkRgbToHsl, cpkHslToRgb, cpkGetState, cpkDrawWheel, cpkDrawSV, cpkUpdateCursors, cpkUpdateAlpha, cpkUpdateValues, cpkFullUpdate, cpkWheelEvent, cpkSVEvent, cpkAlphaEvent, cpkMakeDraggable, cpkHexTyped, cpkRgbaTyped, cpkHslaTyped, cpkAlphaTyped, cpkCopyVal, cpkSaveColor, cpkInit];
    var emoteFunctions = [emoteInit, emoteSelectTab, emoteRender, emoteSearch, emoteCopy];
    var drawFunctions = [drawGetState, drawInit, drawBeginStroke, drawMoveStroke, drawEndStroke, drawSetColor, drawSetSize, drawToggleEraser, drawClear, drawUndo, drawDownload, drawResizeCanvas, drawColorInput, drawSizeInput];
    var imgvFunctions = [imgvGetWidget, imgvGetToolId, imgvFlash, imgvGetState, imgvBuildFilterString, imgvBuildTransformString, imgvApplyStyles, imgvApplyCropLayout, imgvUpdateValueDisplay, imgvSliderChange, imgvToggleFlip, imgvShowImage, imgvLoad, imgvHandlePaste, imgvHandleDrop, imgvReset, imgvProcessTransparency, imgvTransColorChange, imgvTransToleranceChange, imgvPickToggle, imgvDisplayClick, imgvToggleMode, imgvCropStart, imgvCreateCropOverlay, imgvCropMouseDown, imgvCropMouseMove, imgvCropMouseUp, imgvCropUpdateRect, imgvCropApply, imgvCropCancel, imgvCropExit, imgvMemeChange, imgvMemeSizeChange, imgvMemeApply, imgvLoadTracer, imgvTraceSvg, imgvShowSvgModal, imgvSaveState, imgvInit];
    var msheetFunctions = [msheetGetToolId, msheetGetWidget, msheetGetState, msheetSaveData, msheetNoteYPos, msheetYToNote, msheetXToSlot, msheetDraw, msheetCanvasClick, msheetPlayNote, msheetPlay, msheetPlaySequence, msheetStop, msheetClear, msheetSetTempo, msheetSetDuration, msheetSetInstrument, msheetInit];
    var paedFunctions = [paedGetToolId, paedGetState, paedSaveData, paedInitPixels, paedRender, paedCoordsToCell, paedSaveSnapshot, paedApplyTool, paedFloodFill, paedHandleStart, paedHandleMove, paedHandleEnd, paedSetTool, paedSetColor, paedSetSize, paedColorInput, paedUndo, paedRedo, paedClear, paedToggleGrid, paedExport, paedResizeCanvas, paedUpdateStatus, paedInit];
    var cpalFunctions = [cpalGetToolId, cpalHslToHex, cpalHexToHsl, cpalGenerate, cpalRender, cpalSetMode, cpalSetBase, cpalRandomize, cpalToggleLock, cpalCopyColor, cpalCopyAll, cpalSaveState, cpalInit];
    var speFunctions = [speGetToolId, speGetState, speSaveData, speSvgCoords, speCommandsToD, speParseDString, speSaveSnapshot, speRender, speUpdateOutput, speSetTool, speHandleClick, speHandleMouseDown, speHandleMouseMove, speHandleMouseUp, speDFromInput, speUndo, speClear, speCopy, speDeleteSelected, speInit];
    var allFunctions = cpkFunctions.concat(emoteFunctions).concat(drawFunctions).concat(imgvFunctions).concat(msheetFunctions).concat(paedFunctions).concat(cpalFunctions).concat(speFunctions);

    var code = '(function() {\n' +
        'if (typeof cpkInit !== "undefined") return;\n' +
        'window._cpkState = new WeakMap();\n' +
        'window._drawState = new WeakMap();\n' +
        'window._paedState = new WeakMap();\n' +
        'window._speState = new WeakMap();\n' +
        'window.PAED_PALETTE = ' + JSON.stringify(PAED_PALETTE) + ';\n' +
        'window.EMOTE_DATA = ' + JSON.stringify(EMOTE_DATA) + ';\n' +
        'var imgvTracerLoaded = false;\n' +
        'window.IMGV_DEFAULTS = ' + JSON.stringify(IMGV_DEFAULTS) + ';\n' +
        'window.msheetState = ' + JSON.stringify(msheetState) + ';\n' +
        'window.MSHEET_NOTES = ' + JSON.stringify(MSHEET_NOTES) + ';\n' +
        'window.MSHEET_NOTE_NAMES = ' + JSON.stringify(MSHEET_NOTE_NAMES) + ';\n' +
        'window.MSHEET_DURATIONS = ' + JSON.stringify(MSHEET_DURATIONS) + ';\n' +
        'window.MSHEET_DUR_BEATS = ' + JSON.stringify(MSHEET_DUR_BEATS) + ';\n' +
        'window.MSHEET_LINE_H = ' + MSHEET_LINE_H + ';\n' +
        'window.MSHEET_NOTE_W = ' + MSHEET_NOTE_W + ';\n' +
        'window.MSHEET_MARGIN_LEFT = ' + MSHEET_MARGIN_LEFT + ';\n' +
        'window.MSHEET_MARGIN_TOP = ' + MSHEET_MARGIN_TOP + ';\n' +
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
    tools: ['color-picker', 'drawing-canvas', 'emoticon-picker', 'music-sheet', 'pixel-art-editor', 'color-palette', 'svg-path-editor'],
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

// Image Viewer
PluginRegistry.registerTool({
    id: 'image-viewer',
    name: 'Image Viewer',
    description: 'Load images from URL, paste, or drag-drop with real-time CSS filter and transform editing',
    icon: '\uD83D\uDDBC\uFE0F',
    version: '1.0.0',
    toolbox: 'core',
    tags: ['image', 'photo', 'picture', 'filter', 'brightness', 'contrast', 'saturate', 'blur', 'rotate', 'flip', 'css', 'viewer'],
    title: 'Image Viewer',
    content: '<div class="imgv-widget">' +
        '<div class="imgv-input-row">' +
            '<input type="text" placeholder="Enter image URL..." spellcheck="false">' +
            '<button onclick="imgvLoad(this)">Load</button>' +
        '</div>' +
        '<div class="imgv-display">' +
            '<button class="imgv-mode-toggle" onclick="imgvToggleMode(this)">Render</button>' +
            '<div class="imgv-meme-text imgv-meme-top"></div>' +
            '<div class="imgv-meme-text imgv-meme-bottom"></div>' +
            '<div class="imgv-placeholder">Paste, drag &amp; drop, or enter a URL above</div>' +
        '</div>' +
        '<div class="imgv-controls">' +
            '<div class="imgv-section-label">Filters</div>' +
            '<div class="imgv-slider-row"><label>Brightness</label><input type="range" min="0" max="300" value="100" data-filter="brightness" data-unit="%" oninput="imgvSliderChange(this)"><span class="imgv-val">100%</span></div>' +
            '<div class="imgv-slider-row"><label>Contrast</label><input type="range" min="0" max="300" value="100" data-filter="contrast" data-unit="%" oninput="imgvSliderChange(this)"><span class="imgv-val">100%</span></div>' +
            '<div class="imgv-slider-row"><label>Saturate</label><input type="range" min="0" max="300" value="100" data-filter="saturate" data-unit="%" oninput="imgvSliderChange(this)"><span class="imgv-val">100%</span></div>' +
            '<div class="imgv-slider-row"><label>Hue Rotate</label><input type="range" min="0" max="360" value="0" data-filter="hue-rotate" data-unit="\u00B0" oninput="imgvSliderChange(this)"><span class="imgv-val">0\u00B0</span></div>' +
            '<div class="imgv-slider-row"><label>Blur</label><input type="range" min="0" max="20" step="0.5" value="0" data-filter="blur" data-unit="px" oninput="imgvSliderChange(this)"><span class="imgv-val">0px</span></div>' +
            '<div class="imgv-slider-row"><label>Grayscale</label><input type="range" min="0" max="100" value="0" data-filter="grayscale" data-unit="%" oninput="imgvSliderChange(this)"><span class="imgv-val">0%</span></div>' +
            '<div class="imgv-slider-row"><label>Sepia</label><input type="range" min="0" max="100" value="0" data-filter="sepia" data-unit="%" oninput="imgvSliderChange(this)"><span class="imgv-val">0%</span></div>' +
            '<div class="imgv-slider-row"><label>Invert</label><input type="range" min="0" max="100" value="0" data-filter="invert" data-unit="%" oninput="imgvSliderChange(this)"><span class="imgv-val">0%</span></div>' +
            '<div class="imgv-slider-row"><label>Opacity</label><input type="range" min="0" max="100" value="100" data-filter="opacity" data-unit="%" oninput="imgvSliderChange(this)"><span class="imgv-val">100%</span></div>' +
            '<div class="imgv-section-label">Color Key</div>' +
            '<div class="imgv-trans-row"><label>Color</label><input type="color" class="imgv-trans-color" value="#00ff00" onchange="imgvTransColorChange(this)"><button class="imgv-pick-btn" onclick="imgvPickToggle(this)" title="Pick color from image">Pick</button></div>' +
            '<div class="imgv-slider-row"><label>Tolerance</label><input type="range" min="0" max="150" value="0" data-trans="tolerance" oninput="imgvTransToleranceChange(this)"><span class="imgv-val">0</span></div>' +
            '<div class="imgv-section-label">Transform</div>' +
            '<div class="imgv-slider-row"><label>Rotate</label><input type="range" min="0" max="360" value="0" data-transform="rotate" data-unit="\u00B0" oninput="imgvSliderChange(this)"><span class="imgv-val">0\u00B0</span></div>' +
            '<div class="imgv-slider-row"><label>Scale</label><input type="range" min="10" max="300" value="100" data-transform="scale" data-unit="%" oninput="imgvSliderChange(this)"><span class="imgv-val">100%</span></div>' +
            '<div class="imgv-flip-row">' +
                '<button class="imgv-flip-btn" data-flip="H" onclick="imgvToggleFlip(this)">Flip H</button>' +
                '<button class="imgv-flip-btn" data-flip="V" onclick="imgvToggleFlip(this)">Flip V</button>' +
                '<button class="imgv-reset-btn" onclick="imgvReset(this)">Reset</button>' +
            '</div>' +
            '<div class="imgv-section-label">Crop</div>' +
            '<div class="imgv-flip-row">' +
                '<button class="imgv-flip-btn" onclick="imgvCropStart(this)">Crop</button>' +
            '</div>' +
            '<div class="imgv-section-label">Trace to SVG</div>' +
            '<div class="imgv-svg-row">' +
                '<select class="imgv-svg-preset">' +
                    '<option value="posterized2">Posterized</option>' +
                    '<option value="detailed">Detailed</option>' +
                    '<option value="curvy">Curvy</option>' +
                    '<option value="sharp">Sharp</option>' +
                    '<option value="artistic1">Artistic</option>' +
                    '<option value="grayscale">Grayscale</option>' +
                '</select>' +
                '<button class="imgv-flip-btn" onclick="imgvTraceSvg(this)">Trace SVG</button>' +
            '</div>' +
            '<div class="imgv-section-label">Meme Text</div>' +
            '<div class="imgv-meme-row"><label>Top Text</label><input type="text" class="imgv-meme-input" data-meme="top" placeholder="Top text..." oninput="imgvMemeChange(this)"></div>' +
            '<div class="imgv-meme-row"><label>Bottom Text</label><input type="text" class="imgv-meme-input" data-meme="bottom" placeholder="Bottom text..." oninput="imgvMemeChange(this)"></div>' +
            '<div class="imgv-slider-row"><label>Font Size</label><input type="range" min="12" max="72" value="32" data-meme-size="1" oninput="imgvMemeSizeChange(this)"><span class="imgv-val">32px</span></div>' +
        '</div>' +
    '</div>',
    contentType: 'html',
    onInit: 'imgvInit',
    source: 'external',
    defaultWidth: 420,
    defaultHeight: 520
});

// Music Sheet
PluginRegistry.registerTool({
    id: 'music-sheet',
    name: 'Music Sheet',
    description: 'Compose melodies on a musical staff — click to place notes and play them back with sound',
    icon: '\uD83C\uDFB5',
    version: '1.0.0',
    toolbox: 'creative-tools',
    tags: ['music', 'notes', 'sheet', 'compose', 'melody', 'sound', 'audio', 'staff'],
    title: 'Music Sheet',
    content: '<div class="msheet-widget">' +
        '<div class="msheet-toolbar">' +
            '<button class="pomo-btn" onclick="msheetPlay(this)">\u25B6 Play</button>' +
            '<button class="pomo-btn" onclick="msheetClear(this)">Clear</button>' +
            '<select class="msheet-duration" onchange="msheetSetDuration(this)">' +
                '<option value="whole">\uD834\uDD5D Whole</option>' +
                '<option value="half">\uD834\uDD5E Half</option>' +
                '<option value="quarter" selected>\u2669 Quarter</option>' +
                '<option value="eighth">\u266A Eighth</option>' +
                '<option value="sixteenth">\u266C 16th</option>' +
            '</select>' +
            '<select class="msheet-instrument" onchange="msheetSetInstrument(this)">' +
                '<option value="sine">Sine</option>' +
                '<option value="triangle">Triangle</option>' +
                '<option value="square">Square</option>' +
                '<option value="sawtooth">Sawtooth</option>' +
            '</select>' +
            '<input type="range" class="msheet-tempo" min="40" max="240" value="120" onchange="msheetSetTempo(this)" oninput="msheetSetTempo(this)">' +
            '<span class="msheet-tempo-label">120</span>' +
        '</div>' +
        '<div class="msheet-canvas-wrap"></div>' +
        '<div class="msheet-hint">Click on the staff to add notes \u2022 Click a note to remove it</div>' +
    '</div>',
    onInit: 'msheetInit',
    defaultWidth: 500,
    defaultHeight: 280,
    source: 'external'
});

// Pixel Art Editor
PluginRegistry.registerTool({
    id: 'pixel-art-editor',
    name: 'Pixel Art Editor',
    description: 'Grid-based canvas for creating pixel art with draw, erase, fill, and eyedropper tools',
    icon: '\uD83D\uDFE7',
    version: '1.0.0',
    toolbox: 'creative-tools',
    tags: ['pixel', 'art', 'sprite', 'draw', 'grid', 'canvas', 'editor', '8bit', 'retro'],
    title: 'Pixel Art Editor',
    content: '<div class="paed-widget">' +
        '<div class="paed-toolbar">' +
            '<select onchange="paedSetSize(this.closest(\'.paed-widget\'), parseInt(this.value))">' +
                '<option value="8">8\u00d78</option>' +
                '<option value="16" selected>16\u00d716</option>' +
                '<option value="32">32\u00d732</option>' +
                '<option value="64">64\u00d764</option>' +
            '</select>' +
            '<span class="paed-sep"></span>' +
            '<button class="paed-tool-btn" data-tool="draw" onclick="paedSetTool(this.closest(\'.paed-widget\'), \'draw\')">\u270F Draw</button>' +
            '<button class="paed-tool-btn" data-tool="erase" onclick="paedSetTool(this.closest(\'.paed-widget\'), \'erase\')">\u2395 Erase</button>' +
            '<button class="paed-tool-btn" data-tool="fill" onclick="paedSetTool(this.closest(\'.paed-widget\'), \'fill\')">\uD83E\uDEA3 Fill</button>' +
            '<button class="paed-tool-btn" data-tool="eyedropper" onclick="paedSetTool(this.closest(\'.paed-widget\'), \'eyedropper\')">\uD83D\uDCA7 Pick</button>' +
            '<span class="paed-sep"></span>' +
            '<button class="paed-grid-btn" onclick="paedToggleGrid(this.closest(\'.paed-widget\'))"># Grid</button>' +
        '</div>' +
        '<div class="paed-palette">' +
            PAED_PALETTE.map(function(c) {
                return '<div class="paed-swatch" data-color="' + c + '" style="background:' + c + '" onclick="paedSetColor(this.closest(\'.paed-widget\'), \'' + c + '\')"></div>';
            }).join('') +
            '<input type="color" class="paed-color-input" value="#000000" oninput="paedColorInput(this)">' +
        '</div>' +
        '<div class="paed-canvas-wrap">' +
            '<canvas class="paed-canvas"></canvas>' +
        '</div>' +
        '<div class="paed-actions">' +
            '<button onclick="paedClear(this.closest(\'.paed-widget\'))">Clear</button>' +
            '<button onclick="paedUndo(this.closest(\'.paed-widget\'))">Undo</button>' +
            '<button onclick="paedRedo(this.closest(\'.paed-widget\'))">Redo</button>' +
            '<button onclick="paedExport(this.closest(\'.paed-widget\'))">Export PNG</button>' +
            '<span class="paed-status"></span>' +
        '</div>' +
    '</div>',
    onInit: 'paedInit',
    defaultWidth: 480,
    defaultHeight: 520,
    source: 'external'
});

// Color Palette Generator
PluginRegistry.registerTool({
    id: 'color-palette',
    name: 'Color Palette Generator',
    description: 'Generate harmonious color palettes from a base color using color theory rules',
    icon: '\uD83C\uDFA8',
    version: '1.0.0',
    toolbox: 'creative-tools',
    tags: ['color', 'palette', 'harmony', 'complementary', 'analogous', 'triadic', 'tetradic', 'monochromatic', 'scheme', 'generator'],
    title: 'Color Palette Generator',
    content: '<div class="cpal-widget">' +
        '<div class="cpal-toolbar">' +
            '<select class="cpal-mode" onchange="cpalSetMode(this)">' +
                '<option value="complementary">Complementary</option>' +
                '<option value="analogous">Analogous</option>' +
                '<option value="triadic">Triadic</option>' +
                '<option value="tetradic">Tetradic</option>' +
                '<option value="split-complementary">Split-Comp.</option>' +
                '<option value="monochromatic">Monochromatic</option>' +
            '</select>' +
            '<input type="color" class="cpal-base" value="#3498db" onchange="cpalSetBase(this)" oninput="cpalSetBase(this)" title="Base color">' +
            '<button onclick="cpalRandomize(this)" title="Random base color">\uD83C\uDFB2 Random</button>' +
        '</div>' +
        '<div class="cpal-grid"></div>' +
        '<div class="cpal-actions">' +
            '<button onclick="cpalCopyAll(this)">Copy All</button>' +
            '<span class="cpal-status"></span>' +
        '</div>' +
    '</div>',
    contentType: 'html',
    onInit: 'cpalInit',
    source: 'external',
    defaultWidth: 340,
    defaultHeight: 380
});

// SVG Path Editor
PluginRegistry.registerTool({
    id: 'svg-path-editor',
    name: 'SVG Path Editor',
    description: 'Visually create and edit SVG paths with bezier curves',
    icon: '\u270F\uFE0F',
    version: '1.0.0',
    toolbox: 'creative-tools',
    tags: ['svg', 'path', 'vector', 'bezier', 'curve', 'draw', 'editor', 'pen'],
    title: 'SVG Path Editor',
    content: '<div class="spe-widget">' +
        '<div class="spe-toolbar">' +
            '<button class="spe-tool-btn" data-tool="move" onclick="speSetTool(this, \'move\')">\u2630 Move</button>' +
            '<button class="spe-tool-btn active" data-tool="line" onclick="speSetTool(this, \'line\')">\u2571 Line</button>' +
            '<button class="spe-tool-btn" data-tool="quad" onclick="speSetTool(this, \'quad\')">\u223F Quad</button>' +
            '<button class="spe-tool-btn" data-tool="cubic" onclick="speSetTool(this, \'cubic\')">\u0053 Cubic</button>' +
            '<span class="spe-sep"></span>' +
            '<button class="spe-tool-btn" onclick="speDeleteSelected(this)">\u2715 Del Pt</button>' +
        '</div>' +
        '<div class="spe-canvas-wrap">' +
            '<svg class="spe-svg" viewBox="0 0 400 300"><path class="spe-path" d=""></path></svg>' +
        '</div>' +
        '<div class="spe-output-wrap">' +
            '<textarea class="spe-output" spellcheck="false" placeholder="SVG path d attribute..."></textarea>' +
        '</div>' +
        '<div class="spe-actions">' +
            '<button class="spe-btn" onclick="speCopy(this)">Copy</button>' +
            '<button class="spe-btn" onclick="speUndo(this)">Undo</button>' +
            '<button class="spe-btn" onclick="speClear(this)">Clear</button>' +
            '<span class="spe-status"></span>' +
        '</div>' +
        '<div class="spe-hint">Click to place points \u2022 Drag to move \u2022 Edit d attribute below</div>' +
    '</div>',
    contentType: 'html',
    onInit: 'speInit',
    source: 'external',
    defaultWidth: 500,
    defaultHeight: 480
});

console.log('Creative Tools plugin loaded (8 tools: 7 creative + image-viewer registered to core)');
