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
.tool-content:has(.ftree-widget) { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
.ftree-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; position: relative; }
.ftree-toolbar { display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-bottom: 1px solid var(--border-color); background: var(--bg-tertiary); flex-shrink: 0; z-index: 2; }
.ftree-btn { padding: 2px 8px; font-size: 11px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); border-radius: 3px; cursor: pointer; }
.ftree-btn:hover { background: var(--bg-primary); }
.ftree-zoom-label { font-size: 10px; color: var(--text-muted); min-width: 36px; text-align: center; }
.ftree-toolbar-spacer { flex: 1; }
.ftree-viewport { flex: 1; overflow: hidden; cursor: grab; position: relative; background-image: radial-gradient(circle, var(--border-color) 0.8px, transparent 0.8px); background-size: 20px 20px; }
.ftree-viewport.panning { cursor: grabbing; }
.ftree-canvas { position: absolute; transform-origin: 0 0; top: 0; left: 0; }
.ftree-connectors { position: absolute; top: 0; left: 0; }
.ftree-nodes { position: absolute; top: 0; left: 0; }
.ftree-node { position: absolute; background: var(--bg-secondary); border: 2px solid var(--border-color); border-radius: 6px; min-width: 140px; max-width: 200px; text-align: center; padding: 6px 8px; cursor: pointer; user-select: none; transition: border-color 0.15s; box-sizing: border-box; }
.ftree-node:hover { border-color: var(--accent-color, #3498db); }
.ftree-node-male { border-left: 4px solid #3498db; }
.ftree-node-female { border-left: 4px solid #e84393; }
.ftree-node-root { border-color: #c0392b; border-width: 3px; }
.ftree-node-name { font-weight: bold; font-size: 12px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ftree-node-dates { font-size: 10px; color: var(--text-muted); }
.ftree-node-note { font-size: 10px; font-style: italic; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ftree-node-toggle { position: absolute; left: 50%; transform: translateX(-50%); padding: 0 5px; height: 14px; line-height: 14px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 7px; font-size: 8px; text-align: center; cursor: pointer; color: var(--text-muted); white-space: nowrap; opacity: 0; transition: opacity 0.15s; }
.ftree-node:hover .ftree-node-toggle { opacity: 1; }
.ftree-node-toggle:hover { border-color: #3498db; color: var(--text-primary); }
.ftree-node-toggle-parents { top: -9px; }
.ftree-node-toggle-children { bottom: -9px; }
.ftree-node-toggle.collapsed { opacity: 1; background: #3498db; color: white; border-color: #3498db; }
.ftree-node-toggle.collapsed:hover { background: #2980b9; border-color: #2980b9; }
.ftree-conn-v { position: absolute; width: 2px; background: var(--border-color); }
.ftree-conn-h { position: absolute; height: 2px; background: var(--border-color); }
.ftree-conn-spouse { position: absolute; height: 2px; border-top: 2px dashed var(--border-color); background: transparent; }
.ftree-status { padding: 2px 8px; font-size: 10px; color: var(--text-muted); background: var(--bg-tertiary); border-top: 1px solid var(--border-color); flex-shrink: 0; }
.ftree-popup { position: absolute; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 160px; }
.ftree-popup-name { font-weight: bold; font-size: 12px; color: var(--text-primary); margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px solid var(--border-color); }
.ftree-popup-detail { font-size: 10px; color: var(--text-secondary); margin-bottom: 6px; }
.ftree-popup-actions { display: flex; flex-direction: column; gap: 3px; }
.ftree-popup-btn { padding: 3px 8px; font-size: 11px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); border-radius: 3px; cursor: pointer; text-align: left; }
.ftree-popup-btn:hover { background: var(--bg-tertiary); }
.ftree-popup-btn.danger { color: #e74c3c; }
.ftree-popup-btn.danger:hover { background: #e74c3c; color: white; }
.ftree-popup-fields { display: flex; flex-direction: column; gap: 4px; margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid var(--border-color); }
.ftree-popup-fields input, .ftree-popup-fields select { padding: 3px 6px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; background: var(--input-bg); color: var(--text-primary); }
.ftree-popup-fields input:focus, .ftree-popup-fields select:focus { outline: none; border-color: #3498db; }
.ftree-popup-row { display: flex; gap: 4px; align-items: center; }
.ftree-popup-row input[data-field="name"] { flex: 1; font-weight: bold; font-size: 12px; }
.ftree-popup-row input[data-field="birth"], .ftree-popup-row input[data-field="death"] { width: 56px; }
.ftree-popup-row input[data-field="note"] { flex: 1; }
.ftree-popup-row input[type="color"] { width: 24px; height: 22px; padding: 0; border: 1px solid var(--border-color); border-radius: 3px; cursor: pointer; }
.ftree-popup-row label { font-size: 10px; color: var(--text-secondary); }
.ftree-editor-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10010; align-items: center; justify-content: center; }
.ftree-editor-overlay.open { display: flex; }
.ftree-editor-content { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; max-width: 700px; width: 90%; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
.ftree-editor-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-color); }
.ftree-editor-header h3 { margin: 0; font-size: 14px; color: var(--text-primary); }
.ftree-editor-body { padding: 12px 16px; flex: 1; min-height: 0; display: flex; flex-direction: column; }
.ftree-editor-textarea { flex: 1; min-height: 300px; font-family: monospace; font-size: 12px; padding: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); border-radius: 4px; resize: none; }
.ftree-editor-footer { display: flex; gap: 6px; padding: 12px 16px; border-top: 1px solid var(--border-color); justify-content: space-between; }
.ftree-editor-footer-left { display: flex; gap: 6px; }
.ftree-editor-footer-right { display: flex; gap: 6px; }
.ftree-add-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10010; align-items: center; justify-content: center; }
.ftree-add-overlay.open { display: flex; }
.ftree-add-content { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; max-width: 380px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.3); padding: 16px; }
.ftree-add-content h3 { margin: 0 0 12px; font-size: 14px; color: var(--text-heading); }
.ftree-add-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
.ftree-add-row label { font-size: 11px; color: var(--text-secondary); min-width: 48px; flex-shrink: 0; }
.ftree-add-row input, .ftree-add-row select { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); }
.ftree-add-row input:focus, .ftree-add-row select:focus { outline: none; border-color: #3498db; }
.ftree-add-buttons { display: flex; gap: 8px; justify-content: flex-end; margin-top: 14px; }
.ftree-add-buttons button { padding: 6px 16px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; cursor: pointer; }
.ftree-add-buttons .ftree-add-save { background: #3498db; color: white; border-color: #3498db; font-weight: 600; }
.ftree-add-buttons .ftree-add-save:hover { background: #2980b9; }
.ftree-add-buttons .ftree-add-cancel { background: var(--bg-tertiary); color: var(--text-primary); }
.ftree-add-buttons .ftree-add-cancel:hover { background: var(--table-hover); }
.ftree-form-editor { flex: 1; overflow-y: auto; min-height: 0; display: none; padding: 4px 8px; }
.ftree-form-card { border: 1px solid var(--border-color); border-radius: 6px; padding: 8px 10px; margin-bottom: 6px; background: var(--bg-primary); }
.ftree-form-card.root { border-left: 3px solid #e74c3c; }
.ftree-form-header { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 11px; font-weight: 600; color: var(--text-heading); }
.ftree-form-header .ftree-form-icon { font-size: 14px; }
.ftree-form-badge { font-size: 9px; font-weight: 700; background: #e74c3c; color: white; padding: 1px 5px; border-radius: 3px; letter-spacing: 0.5px; }
.ftree-form-fields { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; flex-wrap: wrap; }
.ftree-form-fields input, .ftree-form-fields select { padding: 3px 6px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; background: var(--input-bg); color: var(--text-primary); }
.ftree-form-fields input:focus, .ftree-form-fields select:focus { outline: none; border-color: #3498db; }
.ftree-form-fields input[data-field="name"] { flex: 1; min-width: 80px; }
.ftree-form-fields input[data-field="birth"], .ftree-form-fields input[data-field="death"] { width: 56px; }
.ftree-form-fields input[data-field="note"] { flex: 1; min-width: 60px; }
.ftree-form-rels { font-size: 10px; color: var(--text-secondary); margin-bottom: 6px; line-height: 1.5; }
.ftree-form-rels span { color: var(--text-primary); font-weight: 500; }
.ftree-form-actions { display: flex; gap: 4px; flex-wrap: wrap; }
.ftree-form-actions button { padding: 2px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 10px; border-radius: 3px; }
.ftree-form-actions button:hover { background: var(--table-hover); }
.ftree-form-actions button:disabled { opacity: 0.4; cursor: default; }
.ftree-form-actions button.danger { color: #e74c3c; border-color: #e74c3c; }
.ftree-form-actions button.danger:hover { background: rgba(231, 76, 60, 0.1); }
.ftree-form-empty { padding: 30px; text-align: center; color: var(--text-muted); font-style: italic; }

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

// ============================================================
// Family Tree Constants
// ============================================================

const FTREE_NODE_W = 160;
const FTREE_NODE_H = 60;
const FTREE_H_GAP = 40;
const FTREE_V_GAP = 80;
const FTREE_SPOUSE_GAP = 15;

// ============================================================
// Family Tree Functions
// ============================================================

function ftreeGetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function ftreeGetData(toolId) {
    const customizations = loadToolCustomizations();
    return (customizations[toolId] && customizations[toolId].familyTreeData) || null;
}

function ftreeSaveData(toolId, data) {
    const customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].familyTreeData = data;
    saveToolCustomizations(customizations);
}

function ftreeDefaultData() {
    return {
        title: "Family Tree",
        rootPersonId: 'p1',
        persons: { p1: { id: 'p1', name: '', gender: null, birth: null, death: null, note: null, color: null } },
        relationships: [],
        collapsedChildren: [],
        collapsedParents: [],
        viewState: { panX: 0, panY: 0, zoom: 1 }
    };
}

function ftreeGetVisiblePersons(data) {
    if (!data || !data.persons) return new Set();
    const allIds = Object.keys(data.persons);
    if (allIds.length === 0) return new Set();

    const collChildren = new Set(data.collapsedChildren || []);
    const collParents = new Set(data.collapsedParents || []);
    if (collChildren.size === 0 && collParents.size === 0) return new Set(allIds);

    // Build adjacency
    const childrenOf = {};
    const parentsOf = {};
    const spouseOf = {};
    for (const r of (data.relationships || [])) {
        if (r.type === 'parent-child') {
            if (!childrenOf[r.parent]) childrenOf[r.parent] = [];
            if (!childrenOf[r.parent].includes(r.child)) childrenOf[r.parent].push(r.child);
            if (!parentsOf[r.child]) parentsOf[r.child] = [];
            if (!parentsOf[r.child].includes(r.parent)) parentsOf[r.child].push(r.parent);
        } else if (r.type === 'spouse') {
            if (!spouseOf[r.person1]) spouseOf[r.person1] = [];
            if (!spouseOf[r.person1].includes(r.person2)) spouseOf[r.person1].push(r.person2);
            if (!spouseOf[r.person2]) spouseOf[r.person2] = [];
            if (!spouseOf[r.person2].includes(r.person1)) spouseOf[r.person2].push(r.person1);
        }
    }

    // Prune approach: start with all visible, then hide subtrees
    const hidden = new Set();

    // Hide descendants of collapsed-children nodes (recursive DFS downward)
    for (const pid of collChildren) {
        if (!data.persons[pid]) continue;
        const stack = [...(childrenOf[pid] || [])];
        while (stack.length > 0) {
            const cid = stack.pop();
            if (hidden.has(cid) || !data.persons[cid]) continue;
            hidden.add(cid);
            for (const gc of (childrenOf[cid] || [])) stack.push(gc);
        }
    }

    // Hide ancestors of collapsed-parents nodes (recursive DFS upward)
    for (const pid of collParents) {
        if (!data.persons[pid]) continue;
        const stack = [...(parentsOf[pid] || [])];
        while (stack.length > 0) {
            const aid = stack.pop();
            if (hidden.has(aid) || !data.persons[aid]) continue;
            hidden.add(aid);
            for (const gp of (parentsOf[aid] || [])) stack.push(gp);
        }
    }

    // After initial hiding, only keep persons reachable from the root
    // through visible-only connections. This removes orphaned spouses,
    // siblings whose shared parents were hidden, etc.
    const remaining = new Set(allIds.filter(id => !hidden.has(id)));
    if (remaining.size === 0) return remaining;

    // Find a root for reachability: use data.rootPersonId if visible, else first visible
    const root = remaining.has(data.rootPersonId) ? data.rootPersonId : remaining.values().next().value;
    const reachable = new Set();
    const queue = [root];
    while (queue.length > 0) {
        const pid = queue.shift();
        if (reachable.has(pid) || !remaining.has(pid)) continue;
        reachable.add(pid);
        for (const cid of (childrenOf[pid] || [])) if (remaining.has(cid)) queue.push(cid);
        for (const ppid of (parentsOf[pid] || [])) if (remaining.has(ppid)) queue.push(ppid);
        for (const sid of (spouseOf[pid] || [])) if (remaining.has(sid)) queue.push(sid);
    }

    return reachable;
}

function ftreeFilterVisibleData(data, visible) {
    const filtered = JSON.parse(JSON.stringify(data));
    for (const pid of Object.keys(filtered.persons)) {
        if (!visible.has(pid)) delete filtered.persons[pid];
    }
    filtered.relationships = filtered.relationships.filter(r => {
        if (r.type === 'parent-child') return visible.has(r.parent) && visible.has(r.child);
        if (r.type === 'spouse') return visible.has(r.person1) && visible.has(r.person2);
        return true;
    });
    // If root was hidden, pick a visible person as effective root
    if (filtered.rootPersonId && !visible.has(filtered.rootPersonId)) {
        const visibleIds = Object.keys(filtered.persons);
        filtered.rootPersonId = visibleIds.length > 0 ? visibleIds[0] : null;
    }
    return filtered;
}

function ftreeInit() {
    document.querySelectorAll('.ftree-widget').forEach(widget => {
        const toolId = ftreeGetToolId(widget);
        if (!toolId) return;
        let data = ftreeGetData(toolId);
        const isNew = !data || !data.persons || Object.keys(data.persons).length === 0;
        if (isNew) {
            data = ftreeDefaultData();
            ftreeSaveData(toolId, data);
        }
        if (data.viewState) {
            widget._ftPanX = data.viewState.panX || 0;
            widget._ftPanY = data.viewState.panY || 0;
            widget._ftZoom = data.viewState.zoom || 1;
        } else {
            widget._ftPanX = 0;
            widget._ftPanY = 0;
            widget._ftZoom = 1;
        }
        ftreeRender(widget, toolId);
        ftreeSetupPanZoom(widget, toolId);
        if (isNew) {
            ftreeFitView(widget, toolId);
        } else {
            ftreeApplyTransform(widget);
            ftreeUpdateZoomLabel(widget);
        }
    });
}

function ftreeComputeLayout(data) {
    if (!data || !data.persons || Object.keys(data.persons).length === 0) {
        return { nodes: {}, connectors: [] };
    }

    const persons = data.persons;
    const rels = data.relationships || [];
    const rootId = data.rootPersonId;

    // Build adjacency
    const childrenOf = {}; // parentId -> [childId]
    const parentsOf = {};  // childId -> [parentId]
    const spouseOf = {};   // personId -> [spouseId]

    for (const r of rels) {
        if (r.type === 'parent-child') {
            if (!childrenOf[r.parent]) childrenOf[r.parent] = [];
            if (!childrenOf[r.parent].includes(r.child)) childrenOf[r.parent].push(r.child);
            if (!parentsOf[r.child]) parentsOf[r.child] = [];
            if (!parentsOf[r.child].includes(r.parent)) parentsOf[r.child].push(r.parent);
        } else if (r.type === 'spouse') {
            if (!spouseOf[r.person1]) spouseOf[r.person1] = [];
            if (!spouseOf[r.person1].includes(r.person2)) spouseOf[r.person1].push(r.person2);
            if (!spouseOf[r.person2]) spouseOf[r.person2] = [];
            if (!spouseOf[r.person2].includes(r.person1)) spouseOf[r.person2].push(r.person1);
        }
    }

    // Infer implied parent-child from spouse: if a child has exactly 1 explicit parent
    // and that parent has a spouse, treat the spouse as a second parent so children
    // are centered under the couple and ordered correctly in the layout
    for (const childId of Object.keys(parentsOf)) {
        if (parentsOf[childId].length === 1) {
            const parent = parentsOf[childId][0];
            const spouses = (spouseOf[parent] || []).filter(s => persons[s]);
            for (const sid of spouses) {
                if (!parentsOf[childId].includes(sid)) {
                    parentsOf[childId].push(sid);
                    if (!childrenOf[sid]) childrenOf[sid] = [];
                    if (!childrenOf[sid].includes(childId)) childrenOf[sid].push(childId);
                }
            }
        }
    }

    // Group children by their parent pair (for connector drawing and centering)
    // Each child maps to a sorted pair key like "p1-p2" or just "p1" for single parents
    const childPairKey = {}; // childId -> pairKey
    const pairChildren = {}; // pairKey -> [childId]
    const pairParents = {};  // pairKey -> [parentId, ...]
    for (const childId of Object.keys(parentsOf)) {
        const parents = parentsOf[childId].slice().sort();
        const key = parents.join('-');
        childPairKey[childId] = key;
        if (!pairChildren[key]) { pairChildren[key] = []; pairParents[key] = parents; }
        if (!pairChildren[key].includes(childId)) pairChildren[key].push(childId);
    }
    // Assign generations via BFS from root
    const gen = {};
    const visited = new Set();
    if (rootId && persons[rootId]) {
        gen[rootId] = 0;
        visited.add(rootId);
        const queue = [rootId];
        while (queue.length > 0) {
            const pid = queue.shift();
            const g = gen[pid];
            // Spouses same generation
            if (spouseOf[pid]) {
                for (const sid of spouseOf[pid]) {
                    if (!visited.has(sid) && persons[sid]) {
                        gen[sid] = g;
                        visited.add(sid);
                        queue.push(sid);
                    }
                }
            }
            // Children one generation below
            if (childrenOf[pid]) {
                for (const cid of childrenOf[pid]) {
                    if (!visited.has(cid) && persons[cid]) {
                        gen[cid] = g + 1;
                        visited.add(cid);
                        queue.push(cid);
                    }
                }
            }
            // Parents one generation above
            if (parentsOf[pid]) {
                for (const ppid of parentsOf[pid]) {
                    if (!visited.has(ppid) && persons[ppid]) {
                        gen[ppid] = g - 1;
                        visited.add(ppid);
                        queue.push(ppid);
                    }
                }
            }
        }
    }

    // Assign unvisited persons
    let maxGen = 0;
    for (const g of Object.values(gen)) { if (g > maxGen) maxGen = g; }
    for (const pid of Object.keys(persons)) {
        if (!visited.has(pid)) {
            gen[pid] = maxGen + 1;
            visited.add(pid);
        }
    }

    // Normalize generations so min is 0
    let minGen = Infinity;
    for (const g of Object.values(gen)) { if (g < minGen) minGen = g; }
    if (minGen !== 0 && minGen !== Infinity) {
        for (const pid of Object.keys(gen)) { gen[pid] -= minGen; }
    }

    // Infer implicit spouse relationships from co-parenting for layout
    // If two people are parents of the same child and in the same generation, treat as layout spouses
    for (const [key, parents] of Object.entries(pairParents)) {
        if (parents.length >= 2) {
            for (let i = 0; i < parents.length - 1; i++) {
                for (let j = i + 1; j < parents.length; j++) {
                    const p1 = parents[i], p2 = parents[j];
                    if (gen[p1] !== undefined && gen[p2] !== undefined && gen[p1] === gen[p2]) {
                        if (!spouseOf[p1]) spouseOf[p1] = [];
                        if (!spouseOf[p1].includes(p2)) spouseOf[p1].push(p2);
                        if (!spouseOf[p2]) spouseOf[p2] = [];
                        if (!spouseOf[p2].includes(p1)) spouseOf[p2].push(p1);
                    }
                }
            }
        }
    }

    // Group by generation
    const genGroups = {};
    for (const [pid, g] of Object.entries(gen)) {
        if (!genGroups[g]) genGroups[g] = [];
        genGroups[g].push(pid);
    }

    // Order within each generation: spouse pairs together, children ordered
    // Build a tree-order for each generation based on parent positions
    const xPos = {};

    // Sort generations
    const sortedGens = Object.keys(genGroups).map(Number).sort((a, b) => a - b);

    // First pass: assign initial x positions
    // For each generation, order nodes: keep spouse pairs together
    for (const g of sortedGens) {
        const group = genGroups[g];
        // Try to order by parent's x position
        if (g === 0 || Object.keys(xPos).length === 0) {
            // Root generation: order by ID
            const ordered = [];
            const added = new Set();
            for (const pid of group) {
                if (added.has(pid)) continue;
                ordered.push(pid);
                added.add(pid);
                if (spouseOf[pid]) {
                    for (const sid of spouseOf[pid]) {
                        if (gen[sid] === g && !added.has(sid)) {
                            ordered.push(sid);
                            added.add(sid);
                        }
                    }
                }
            }
            for (let i = 0; i < ordered.length; i++) {
                xPos[ordered[i]] = i * (FTREE_NODE_W + FTREE_H_GAP);
            }
        } else {
            // Order children by parent pair (siblings stay together), then by parent x
            const withParentX = [];
            for (const pid of group) {
                const parents = parentsOf[pid] || [];
                let px = 0;
                let count = 0;
                const counted = new Set();
                for (const ppid of parents) {
                    if (xPos[ppid] !== undefined && !counted.has(ppid)) {
                        px += xPos[ppid]; count++; counted.add(ppid);
                    }
                }
                const pairKey = childPairKey[pid] || '';
                withParentX.push({ pid, parentX: count > 0 ? px / count : Infinity, pairKey });
            }
            // Compute average parentX per pair for group ordering
            const pairAvgX = {};
            for (const item of withParentX) {
                if (!pairAvgX[item.pairKey]) pairAvgX[item.pairKey] = { sum: 0, count: 0 };
                pairAvgX[item.pairKey].sum += item.parentX;
                pairAvgX[item.pairKey].count++;
            }
            for (const k of Object.keys(pairAvgX)) {
                pairAvgX[k] = pairAvgX[k].count > 0 ? pairAvgX[k].sum / pairAvgX[k].count : Infinity;
            }
            // Check if a person has a cross-family spouse (spouse in a different pair group)
            function hasCrossFamilySpouse(pid) {
                const myPK = childPairKey[pid] || '';
                if (!myPK) return false;
                const spouses = (spouseOf[pid] || []).filter(s => gen[s] === g);
                for (const sid of spouses) {
                    const sPK = childPairKey[sid] || '';
                    if (sPK && sPK !== myPK) return true;
                }
                return false;
            }
            // Sort: by pair average X first (keeps siblings together),
            // then cross-family members to boundary of their group, then by individual parentX
            withParentX.sort((a, b) => {
                const pa = pairAvgX[a.pairKey] != null ? pairAvgX[a.pairKey] : Infinity;
                const pb = pairAvgX[b.pairKey] != null ? pairAvgX[b.pairKey] : Infinity;
                if (pa !== pb) return pa - pb;
                if (a.pairKey !== b.pairKey) return a.pairKey < b.pairKey ? -1 : 1;
                // Within same pair group: cross-family members go to the end
                // so they're adjacent to their spouse's family group
                const aCross = hasCrossFamilySpouse(a.pid) ? 1 : 0;
                const bCross = hasCrossFamilySpouse(b.pid) ? 1 : 0;
                if (aCross !== bCross) return aCross - bCross;
                if (!isFinite(a.parentX) && !isFinite(b.parentX)) return 0;
                return a.parentX - b.parentX;
            });

            // Identify people who should be deferred to spouse placement:
            // If someone has a spouse in this generation who has children (i.e. the spouse
            // is the "anchor" in this family), defer the non-anchor partner
            const deferToSpouse = new Set();
            for (const item of withParentX) {
                if (spouseOf[item.pid]) {
                    for (const sid of spouseOf[item.pid]) {
                        if (gen[sid] === gen[item.pid] && !deferToSpouse.has(item.pid)) {
                            const myParents = (parentsOf[item.pid] || []).length;
                            const theirParents = (parentsOf[sid] || []).length;
                            if (myParents === 0 && theirParents > 0) {
                                // I have no parents in the tree — I'm married-in, defer to spouse
                                deferToSpouse.add(item.pid);
                            } else if (myParents === 0 && theirParents === 0) {
                                // Neither has parents — use child count, then ID as tiebreaker
                                const myChildren = (childrenOf[item.pid] || []).length;
                                const theirChildren = (childrenOf[sid] || []).length;
                                if (myChildren < theirChildren) {
                                    deferToSpouse.add(item.pid);
                                } else if (myChildren === theirChildren && item.pid > sid) {
                                    deferToSpouse.add(item.pid);
                                }
                            }
                            // If both have parents, neither is deferred — each stays in their sibling group
                        }
                    }
                }
            }

            // Place nodes, keeping all spouse pairs together
            let curX = 0;
            const added = new Set();
            for (const item of withParentX) {
                if (added.has(item.pid)) continue;
                if (deferToSpouse.has(item.pid)) continue;
                xPos[item.pid] = curX;
                added.add(item.pid);
                // Place spouse next to partner (whether deferred or cross-family)
                let spousePlaced = false;
                if (spouseOf[item.pid]) {
                    for (const sid of spouseOf[item.pid]) {
                        if (gen[sid] === gen[item.pid] && !added.has(sid)) {
                            // Use wider gap for cross-family couples to prevent connector overlap
                            const myPK = childPairKey[item.pid] || '';
                            const sPK = childPairKey[sid] || '';
                            const coupleGap = (myPK && sPK && myPK !== sPK) ? FTREE_H_GAP : FTREE_SPOUSE_GAP;
                            xPos[sid] = curX + FTREE_NODE_W + coupleGap;
                            added.add(sid);
                            curX = xPos[sid] + FTREE_NODE_W + FTREE_H_GAP;
                            spousePlaced = true;
                        }
                    }
                }
                if (!spousePlaced) {
                    curX += FTREE_NODE_W + FTREE_H_GAP;
                }
            }
            // Place any remaining deferred nodes that weren't placed by spouse logic
            for (const item of withParentX) {
                if (added.has(item.pid)) continue;
                xPos[item.pid] = curX;
                added.add(item.pid);
                curX += FTREE_NODE_W + FTREE_H_GAP;
            }
        }
    }

    // Second pass: center parents above their children
    for (let pass = 0; pass < 5; pass++) {
        for (const g of sortedGens) {
            const group = genGroups[g];
            // Center each parent pair above their children
            const pairsDone = new Set();
            for (const pid of group) {
                const children = childrenOf[pid] || [];
                // Find pairs that include this parent and collect their children
                for (const cid of children) {
                    const pk = childPairKey[cid];
                    if (!pk || pairsDone.has(pk)) continue;
                    pairsDone.add(pk);
                    const pairKids = (pairChildren[pk] || []).filter(c => xPos[c] !== undefined);
                    if (pairKids.length === 0) continue;
                    let minChildX = Infinity, maxChildX = -Infinity;
                    for (const c of pairKids) {
                        if (xPos[c] < minChildX) minChildX = xPos[c];
                        if (xPos[c] > maxChildX) maxChildX = xPos[c];
                    }
                    if (minChildX === Infinity) continue;
                    const centerX = (minChildX + maxChildX) / 2;
                    const pp = pairParents[pk];
                    // Center the parent pair (or single parent) above children
                    if (pp.length >= 2 && persons[pp[0]] && persons[pp[1]] && gen[pp[0]] === gen[pp[1]]) {
                        const pairWidth = FTREE_NODE_W * 2 + FTREE_SPOUSE_GAP;
                        const startX = centerX - pairWidth / 2 + FTREE_NODE_W / 2;
                        xPos[pp[0]] = startX;
                        xPos[pp[1]] = startX + FTREE_NODE_W + FTREE_SPOUSE_GAP;
                    } else {
                        const spouses = (spouseOf[pid] || []).filter(s => gen[s] === g);
                        if (spouses.length > 0) {
                            const spouseId = spouses[0];
                            const pairWidth = FTREE_NODE_W * 2 + FTREE_SPOUSE_GAP;
                            const startX = centerX - pairWidth / 2 + FTREE_NODE_W / 2;
                            // Preserve original left-right order of the pair
                            const leftId = xPos[pid] <= xPos[spouseId] ? pid : spouseId;
                            const rightId = leftId === pid ? spouseId : pid;
                            xPos[leftId] = startX;
                            xPos[rightId] = startX + FTREE_NODE_W + FTREE_SPOUSE_GAP;
                        } else {
                            xPos[pid] = centerX;
                        }
                    }
                }
            }
        }

        // Position children under their parents: move each child unit to be
        // centered beneath its parent pair. The overlap fixer (next step) will
        // spread units apart while preserving order.
        for (const g of sortedGens) {
            if (g === sortedGens[0]) continue; // Skip root generation
            const group = genGroups[g];

            // Build units sorted by current x
            const cuInUnit = new Set();
            const cuUnits = [];
            const cuSorted = group.slice().sort((a, b) => (xPos[a] || 0) - (xPos[b] || 0));
            for (const pid of cuSorted) {
                if (cuInUnit.has(pid)) continue;
                cuInUnit.add(pid);
                const cuSpouses = (spouseOf[pid] || []).filter(s => gen[s] === g && !cuInUnit.has(s));
                if (cuSpouses.length > 0) {
                    const sid = cuSpouses[0];
                    cuInUnit.add(sid);
                    cuUnits.push({ members: [pid, sid] });
                } else {
                    cuUnits.push({ members: [pid] });
                }
            }

            // Position each unit centered under its parents
            for (const unit of cuUnits) {
                // Find parent center for this unit using ALL members' parents
                // (handles cross-family couples by averaging both families' positions)
                let parentCenterX = null;
                let px = 0, cnt = 0;
                const counted = new Set();
                for (const m of unit.members) {
                    const mParents = parentsOf[m] || [];
                    for (const ppid of mParents) {
                        if (xPos[ppid] !== undefined && !counted.has(ppid)) {
                            px += xPos[ppid] + FTREE_NODE_W / 2; cnt++; counted.add(ppid);
                        }
                    }
                }
                if (cnt > 0) {
                    parentCenterX = px / cnt;
                }

                if (parentCenterX !== null) {
                    const unitWidth = unit.members.length === 2
                        ? FTREE_NODE_W * 2 + FTREE_SPOUSE_GAP
                        : FTREE_NODE_W;
                    const newX = parentCenterX - unitWidth / 2;
                    xPos[unit.members[0]] = newX;
                    if (unit.members.length === 2) {
                        xPos[unit.members[1]] = newX + FTREE_NODE_W + FTREE_SPOUSE_GAP;
                    }
                }
            }
        }

        // Fix overlaps within each generation (spouse pairs move as atomic units)
        // Sort by parent pair position first to keep siblings grouped together,
        // preventing connector lines from different families from crossing
        for (const g of sortedGens) {
            const group = genGroups[g];
            // Build units: spouse pairs or single nodes
            const inUnit = new Set();
            const units = [];
            const sorted = group.slice().sort((a, b) => (xPos[a] || 0) - (xPos[b] || 0));
            for (const pid of sorted) {
                if (inUnit.has(pid)) continue;
                inUnit.add(pid);
                const sameGenSpouses = (spouseOf[pid] || []).filter(s => gen[s] === g && !inUnit.has(s));
                if (sameGenSpouses.length > 0) {
                    const sid = sameGenSpouses[0];
                    inUnit.add(sid);
                    // pid has smaller xPos (from sorted order), so pid is left
                    xPos[sid] = xPos[pid] + FTREE_NODE_W + FTREE_SPOUSE_GAP;
                    units.push({ members: [pid, sid], x: xPos[pid] });
                } else {
                    units.push({ members: [pid], x: xPos[pid] });
                }
            }
            // Sort units: group siblings (same parent pair) together, ordered by
            // the parent pair's center x, then by individual x within the group
            const pairCenterCache = {};
            for (const unit of units) {
                const pk = childPairKey[unit.members[0]] || '';
                if (pk && pairCenterCache[pk] === undefined) {
                    const pp = pairParents[pk] || [];
                    let cx = 0, cn = 0;
                    for (const ppid of pp) {
                        if (xPos[ppid] !== undefined) { cx += xPos[ppid]; cn++; }
                    }
                    pairCenterCache[pk] = cn > 0 ? cx / cn : unit.x;
                }
            }
            units.sort((a, b) => {
                const aPk = childPairKey[a.members[0]] || '';
                const bPk = childPairKey[b.members[0]] || '';
                const aPc = aPk ? (pairCenterCache[aPk] ?? a.x) : a.x;
                const bPc = bPk ? (pairCenterCache[bPk] ?? b.x) : b.x;
                if (aPc !== bPc) return aPc - bPc;
                if (aPk !== bPk) return aPk < bPk ? -1 : 1;
                return a.x - b.x;
            });
            // Fix overlaps between units (each unit moves as a whole)
            // Use extra gap between different family groups to prevent connector overlap
            for (let i = 1; i < units.length; i++) {
                const prev = units[i - 1];
                const cur = units[i];
                const prevWidth = prev.members.length === 2
                    ? FTREE_NODE_W * 2 + FTREE_SPOUSE_GAP
                    : FTREE_NODE_W;
                // Check if units are from different families (as children OR as parents)
                const prevPK = childPairKey[prev.members[0]] || '';
                const curPK = childPairKey[cur.members[0]] || '';
                const diffAsChildren = prevPK && curPK && prevPK !== curPK;
                // Also check if they parent different child groups
                let prevChildPK = '', curChildPK = '';
                for (const m of prev.members) {
                    const kids = childrenOf[m] || [];
                    if (kids.length > 0) { prevChildPK = childPairKey[kids[0]] || ''; break; }
                }
                for (const m of cur.members) {
                    const kids = childrenOf[m] || [];
                    if (kids.length > 0) { curChildPK = childPairKey[kids[0]] || ''; break; }
                }
                const diffAsParents = prevChildPK && curChildPK && prevChildPK !== curChildPK;
                const gap = (diffAsChildren || diffAsParents) ? FTREE_H_GAP * 3 : FTREE_H_GAP;
                const minX = prev.x + prevWidth + gap;
                if (cur.x < minX) {
                    const shift = minX - cur.x;
                    cur.x += shift;
                    for (const m of cur.members) {
                        xPos[m] += shift;
                    }
                }
            }
        }
    }

    // Normalize x positions so minimum is 50
    let minX = Infinity;
    for (const x of Object.values(xPos)) { if (x < minX) minX = x; }
    const offsetX = 50 - (minX || 0);
    for (const pid of Object.keys(xPos)) { xPos[pid] += offsetX; }

    // Compute y positions from generation
    const yPos = {};
    for (const [pid, g] of Object.entries(gen)) {
        yPos[pid] = 50 + g * (FTREE_NODE_H + FTREE_V_GAP);
    }

    // Build node positions
    const nodes = {};
    for (const pid of Object.keys(persons)) {
        nodes[pid] = {
            x: xPos[pid] || 0,
            y: yPos[pid] || 0,
            w: FTREE_NODE_W,
            h: FTREE_NODE_H
        };
    }

    // Build connectors
    const connectors = [];

    // Parent-child connectors (elbow pattern)
    // Compute horizontal extents for each pair's connectors, then use interval
    // graph coloring to assign Y-offsets that prevent overlapping horizontal bars
    const pairEntries = Object.entries(pairChildren);
    const pairMidYOffset = {};
    const pairExtents = [];
    for (const [pairKey, children] of pairEntries) {
        const parents = pairParents[pairKey];
        const validParents = parents.filter(pid => persons[pid] && nodes[pid]);
        if (validParents.length === 0) continue;
        const validChildren = children.filter(cid => nodes[cid]);
        if (validChildren.length === 0) continue;
        let anchorX;
        if (validParents.length >= 2) {
            anchorX = (nodes[validParents[0]].x + FTREE_NODE_W / 2 + nodes[validParents[1]].x + FTREE_NODE_W / 2) / 2;
        } else {
            const ppid = validParents[0];
            const sp = (spouseOf[ppid] || []).filter(s => gen[s] === gen[ppid] && nodes[s]);
            if (sp.length > 0) {
                anchorX = (nodes[ppid].x + FTREE_NODE_W / 2 + nodes[sp[0]].x + FTREE_NODE_W / 2) / 2;
            } else {
                anchorX = nodes[ppid].x + FTREE_NODE_W / 2;
            }
        }
        let left = anchorX, right = anchorX;
        for (const cid of validChildren) {
            const cx = nodes[cid].x + FTREE_NODE_W / 2;
            if (cx < left) left = cx;
            if (cx > right) right = cx;
        }
        pairExtents.push({ pk: pairKey, left, right, gen: gen[validParents[0]] });
    }
    // Group by generation, then interval-color to find overlapping bars
    const extentsByGen = {};
    for (const ext of pairExtents) {
        if (!extentsByGen[ext.gen]) extentsByGen[ext.gen] = [];
        extentsByGen[ext.gen].push(ext);
    }
    const CONN_Y_STEP = 12;
    const pairColorIndex = {}; // global color index per pair for line coloring
    let globalColorIdx = 0;
    for (const bars of Object.values(extentsByGen)) {
        bars.sort((a, b) => a.left - b.left);
        // Greedy interval coloring: assign lowest color not used by overlapping bars
        for (let i = 0; i < bars.length; i++) {
            const usedColors = new Set();
            for (let j = 0; j < i; j++) {
                if (bars[j].right > bars[i].left) usedColors.add(bars[j].color);
            }
            let c = 0;
            while (usedColors.has(c)) c++;
            bars[i].color = c;
        }
        const maxColor = Math.max(...bars.map(b => b.color));
        for (const bar of bars) {
            pairMidYOffset[bar.pk] = (bar.color - maxColor / 2) * CONN_Y_STEP;
            pairColorIndex[bar.pk] = globalColorIdx++;
        }
    }

    for (const [pairKey, children] of pairEntries) {
        const parents = pairParents[pairKey];
        const validParents = parents.filter(pid => persons[pid] && nodes[pid]);
        if (validParents.length === 0) continue;

        // Anchor point: midpoint of parent pair, or single parent center
        let anchorX;
        if (validParents.length >= 2) {
            anchorX = (nodes[validParents[0]].x + FTREE_NODE_W / 2 + nodes[validParents[1]].x + FTREE_NODE_W / 2) / 2;
        } else {
            // Single parent — check if they have a spouse to use midpoint
            const ppid = validParents[0];
            const spouses = (spouseOf[ppid] || []).filter(s => gen[s] === gen[ppid] && nodes[s]);
            if (spouses.length > 0) {
                anchorX = (nodes[ppid].x + FTREE_NODE_W / 2 + nodes[spouses[0]].x + FTREE_NODE_W / 2) / 2;
            } else {
                anchorX = nodes[ppid].x + FTREE_NODE_W / 2;
            }
        }
        const anchorY = nodes[validParents[0]].y + FTREE_NODE_H;

        const validChildren = children.filter(cid => nodes[cid]);
        if (validChildren.length === 0) continue;

        // Alternate midY offset for adjacent pairs to prevent bar overlap
        const midYOff = pairMidYOffset[pairKey] || 0;
        const midY = anchorY + FTREE_V_GAP / 2 + midYOff;
        const ci = pairColorIndex[pairKey] != null ? pairColorIndex[pairKey] : -1;

        // Vertical from anchor down to mid
        connectors.push({ type: 'v', x: anchorX, y: anchorY, h: midY - anchorY, ci });

        if (validChildren.length === 1) {
            const childNode = nodes[validChildren[0]];
            const childCx = childNode.x + FTREE_NODE_W / 2;
            const childTop = childNode.y;
            if (Math.abs(anchorX - childCx) <= 1) {
                // Directly below anchor — straight vertical
                connectors.push({ type: 'v', x: childCx, y: midY, h: childTop - midY, ci });
            } else if (Math.abs(anchorX - childCx) <= FTREE_NODE_W) {
                // Close to anchor — single-level L-shape
                connectors.push({ type: 'v', x: childCx, y: midY, h: childTop - midY, ci });
                const hx = Math.min(anchorX, childCx);
                connectors.push({ type: 'h', x: hx, y: midY, w: Math.abs(anchorX - childCx), ci });
            } else {
                // Far from anchor — two-level routing to prevent overlap
                const bridgeY = anchorY + FTREE_V_GAP * 0.35 + midYOff;
                const barY = anchorY + FTREE_V_GAP * 0.65 + midYOff;
                connectors[connectors.length - 1] = { type: 'v', x: anchorX, y: anchorY, h: bridgeY - anchorY, ci };
                const bLeft = Math.min(anchorX, childCx);
                const bRight = Math.max(anchorX, childCx);
                connectors.push({ type: 'h', x: bLeft, y: bridgeY, w: bRight - bLeft, ci });
                connectors.push({ type: 'v', x: childCx, y: bridgeY, h: childTop - bridgeY, ci });
            }
        } else {
            let minCx = Infinity, maxCx = -Infinity;
            for (const cid of validChildren) {
                const cx = nodes[cid].x + FTREE_NODE_W / 2;
                if (cx < minCx) minCx = cx;
                if (cx > maxCx) maxCx = cx;
            }

            const anchorInsideSpan = anchorX >= minCx - 1 && anchorX <= maxCx + 1;

            if (anchorInsideSpan) {
                // Anchor is within children span — single level, bar spans children only
                connectors.push({ type: 'h', x: minCx, y: midY, w: maxCx - minCx, ci });
                for (const cid of validChildren) {
                    const childNode = nodes[cid];
                    const childCx = childNode.x + FTREE_NODE_W / 2;
                    const childTop = childNode.y;
                    connectors.push({ type: 'v', x: childCx, y: midY, h: childTop - midY, ci });
                }
            } else {
                // Anchor is outside children span — use two Y-levels to avoid
                // the children bar extending past the children (prevents overlap
                // with other families' bars at cross-family couple junctions)
                const bridgeY = anchorY + FTREE_V_GAP * 0.35 + midYOff;
                const barY = anchorY + FTREE_V_GAP * 0.65 + midYOff;

                // Vertical from anchor down to bridge level (replace the one pushed earlier)
                connectors[connectors.length - 1] = { type: 'v', x: anchorX, y: anchorY, h: bridgeY - anchorY, ci };

                // Horizontal bridge from anchor to nearest edge of children span
                const bridgeTarget = anchorX < minCx ? minCx : maxCx;
                const bLeft = Math.min(anchorX, bridgeTarget);
                const bRight = Math.max(anchorX, bridgeTarget);
                connectors.push({ type: 'h', x: bLeft, y: bridgeY, w: bRight - bLeft, ci });

                // Vertical from bridge down to children bar level
                connectors.push({ type: 'v', x: bridgeTarget, y: bridgeY, h: barY - bridgeY, ci });

                // Horizontal children bar spanning only the children
                connectors.push({ type: 'h', x: minCx, y: barY, w: maxCx - minCx, ci });

                // Vertical drops from children bar to each child
                for (const cid of validChildren) {
                    const childNode = nodes[cid];
                    const childCx = childNode.x + FTREE_NODE_W / 2;
                    const childTop = childNode.y;
                    connectors.push({ type: 'v', x: childCx, y: barY, h: childTop - barY, ci });
                }
            }
        }
    }

    // Spouse connectors
    const spousePairsDone = new Set();
    for (const r of rels) {
        if (r.type !== 'spouse') continue;
        const key = [r.person1, r.person2].sort().join('-');
        if (spousePairsDone.has(key)) continue;
        spousePairsDone.add(key);
        if (!nodes[r.person1] || !nodes[r.person2]) continue;
        const n1 = nodes[r.person1];
        const n2 = nodes[r.person2];
        const leftNode = n1.x < n2.x ? n1 : n2;
        const rightNode = n1.x < n2.x ? n2 : n1;
        const y = leftNode.y + FTREE_NODE_H / 2;
        connectors.push({
            type: 'spouse',
            x: leftNode.x + FTREE_NODE_W,
            y: y,
            w: rightNode.x - (leftNode.x + FTREE_NODE_W)
        });
    }

    return { nodes, connectors };
}

function ftreeRender(widget, toolId) {
    const data = ftreeGetData(toolId);
    if (!data) return;

    const visible = ftreeGetVisiblePersons(data);
    const layoutData = ftreeFilterVisibleData(data, visible);
    const layout = ftreeComputeLayout(layoutData);
    const nodesContainer = widget.querySelector('.ftree-nodes');
    const connContainer = widget.querySelector('.ftree-connectors');
    const status = widget.querySelector('.ftree-status');

    // Build adjacency from ORIGINAL data for toggle indicators
    const childrenOf = {};
    const parentsOf = {};
    for (const r of (data.relationships || [])) {
        if (r.type === 'parent-child') {
            if (!childrenOf[r.parent]) childrenOf[r.parent] = [];
            if (!childrenOf[r.parent].includes(r.child)) childrenOf[r.parent].push(r.child);
            if (!parentsOf[r.child]) parentsOf[r.child] = [];
            if (!parentsOf[r.child].includes(r.parent)) parentsOf[r.child].push(r.parent);
        }
    }
    const collChildren = new Set(data.collapsedChildren || []);
    const collParents = new Set(data.collapsedParents || []);

    // Render nodes
    let nodesHtml = '';
    const allPersonIds = Object.keys(data.persons || {});
    for (const pid of allPersonIds) {
        if (!visible.has(pid)) continue;
        const p = data.persons[pid];
        const pos = layout.nodes[pid];
        if (!pos) continue;
        const genderClass = p.gender === 'm' ? ' ftree-node-male' : p.gender === 'f' ? ' ftree-node-female' : '';
        const rootClass = pid === data.rootPersonId ? ' ftree-node-root' : '';
        const colorStyle = p.color ? ` border-top: 3px solid ${p.color};` : '';
        const dates = (p.birth || p.death) ? `<div class="ftree-node-dates">${p.birth || '?'} - ${p.death || '?'}</div>` : '';
        const note = p.note ? `<div class="ftree-node-note">${p.note}</div>` : '';

        // Toggle indicators for parents/children
        let toggles = '';
        const hasParents = (parentsOf[pid] || []).length > 0;
        const hasChildren = (childrenOf[pid] || []).length > 0;
        if (hasParents) {
            const isCollapsed = collParents.has(pid);
            const hiddenCount = isCollapsed ? (parentsOf[pid] || []).filter(id => !visible.has(id)).length : 0;
            const label = isCollapsed && hiddenCount > 0 ? `▲ ${hiddenCount}` : '▲';
            toggles += `<div class="ftree-node-toggle ftree-node-toggle-parents${isCollapsed ? ' collapsed' : ''}" onclick="event.stopPropagation(); ftreeNodeToggleParents(this)">${label}</div>`;
        }
        if (hasChildren) {
            const isCollapsed = collChildren.has(pid);
            const hiddenCount = isCollapsed ? (childrenOf[pid] || []).filter(id => !visible.has(id)).length : 0;
            const label = isCollapsed && hiddenCount > 0 ? `▼ ${hiddenCount}` : '▼';
            toggles += `<div class="ftree-node-toggle ftree-node-toggle-children${isCollapsed ? ' collapsed' : ''}" onclick="event.stopPropagation(); ftreeNodeToggleChildren(this)">${label}</div>`;
        }

        nodesHtml += `<div class="ftree-node${genderClass}${rootClass}" data-person-id="${pid}" style="left:${pos.x}px;top:${pos.y}px;width:${FTREE_NODE_W}px;${colorStyle}" onclick="ftreeNodeClick(event, this)">
<div class="ftree-node-name">${p.name}</div>${dates}${note}${toggles}</div>`;
    }
    nodesContainer.innerHTML = nodesHtml;

    // Render connectors as SVG for precise, gap-free lines
    const connColor = getComputedStyle(widget).getPropertyValue('--border-color').trim() || '#ccc';
    // Muted palette for parent-child connector groups
    const connPalette = [
        '#8da0cb', '#a6d854', '#e5c494', '#b3b3b3', '#fc8d62',
        '#66c2a5', '#e78ac3', '#ffd92f', '#8dd3c7', '#bebada',
        '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#d9d9d9'
    ];
    let svgParts = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;">`;
    for (const c of layout.connectors) {
        const sc = (c.ci != null && c.ci >= 0) ? connPalette[c.ci % connPalette.length] : connColor;
        if (c.type === 'v') {
            svgParts += `<line x1="${c.x}" y1="${c.y}" x2="${c.x}" y2="${c.y + c.h}" stroke="${sc}" stroke-width="2"/>`;
        } else if (c.type === 'h') {
            svgParts += `<line x1="${c.x}" y1="${c.y}" x2="${c.x + c.w}" y2="${c.y}" stroke="${sc}" stroke-width="2"/>`;
        } else if (c.type === 'spouse') {
            svgParts += `<line x1="${c.x}" y1="${c.y}" x2="${c.x + c.w}" y2="${c.y}" stroke="${connColor}" stroke-width="2" stroke-dasharray="4,3"/>`;
        }
    }
    svgParts += `</svg>`;
    connContainer.innerHTML = svgParts;

    // Status
    if (status) {
        const visibleCount = visible.size;
        const totalCount = allPersonIds.length;
        if (visibleCount < totalCount) {
            status.textContent = `${visibleCount} of ${totalCount} persons shown`;
        } else {
            status.textContent = `${totalCount} person${totalCount !== 1 ? 's' : ''}`;
        }
    }
}

function ftreeSetupPanZoom(widget, toolId) {
    const viewport = widget.querySelector('.ftree-viewport');
    if (!viewport || viewport._ftreeSetup) return;
    viewport._ftreeSetup = true;

    let isPanning = false;
    let startX, startY, startPanX, startPanY;

    viewport.addEventListener('mousedown', e => {
        if (e.target.closest('.ftree-node') || e.target.closest('.ftree-popup')) return;
        isPanning = true;
        startX = e.clientX;
        startY = e.clientY;
        startPanX = widget._ftPanX;
        startPanY = widget._ftPanY;
        viewport.classList.add('panning');
        e.preventDefault();
    });

    window.addEventListener('mousemove', e => {
        if (!isPanning) return;
        widget._ftPanX = startPanX + (e.clientX - startX);
        widget._ftPanY = startPanY + (e.clientY - startY);
        ftreeApplyTransform(widget);
    });

    window.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            viewport.classList.remove('panning');
            ftreeSaveViewState(widget, toolId);
        }
    });

    viewport.addEventListener('wheel', e => {
        e.preventDefault();
        const rect = viewport.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const oldZoom = widget._ftZoom;
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        let newZoom = oldZoom + delta;
        newZoom = Math.max(0.1, Math.min(5, newZoom));

        // Zoom toward cursor
        widget._ftPanX = mx - (mx - widget._ftPanX) * (newZoom / oldZoom);
        widget._ftPanY = my - (my - widget._ftPanY) * (newZoom / oldZoom);
        widget._ftZoom = newZoom;

        ftreeApplyTransform(widget);
        ftreeUpdateZoomLabel(widget);
        ftreeSaveViewState(widget, toolId);
    }, { passive: false });

    // Touch support
    let lastTouchDist = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;

    viewport.addEventListener('touchstart', e => {
        if (e.target.closest('.ftree-node') || e.target.closest('.ftree-popup')) return;
        if (e.touches.length === 1) {
            isPanning = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startPanX = widget._ftPanX;
            startPanY = widget._ftPanY;
        } else if (e.touches.length === 2) {
            isPanning = false;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastTouchDist = Math.sqrt(dx * dx + dy * dy);
            lastTouchX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            lastTouchY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        }
    }, { passive: true });

    viewport.addEventListener('touchmove', e => {
        if (e.touches.length === 1 && isPanning) {
            widget._ftPanX = startPanX + (e.touches[0].clientX - startX);
            widget._ftPanY = startPanY + (e.touches[0].clientY - startY);
            ftreeApplyTransform(widget);
            e.preventDefault();
        } else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (lastTouchDist > 0) {
                const scale = dist / lastTouchDist;
                const rect = viewport.getBoundingClientRect();
                const mx = lastTouchX - rect.left;
                const my = lastTouchY - rect.top;
                const oldZoom = widget._ftZoom;
                let newZoom = oldZoom * scale;
                newZoom = Math.max(0.1, Math.min(5, newZoom));
                widget._ftPanX = mx - (mx - widget._ftPanX) * (newZoom / oldZoom);
                widget._ftPanY = my - (my - widget._ftPanY) * (newZoom / oldZoom);
                widget._ftZoom = newZoom;
                ftreeApplyTransform(widget);
                ftreeUpdateZoomLabel(widget);
            }
            lastTouchDist = dist;
            lastTouchX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            lastTouchY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            e.preventDefault();
        }
    }, { passive: false });

    viewport.addEventListener('touchend', e => {
        isPanning = false;
        lastTouchDist = 0;
        ftreeSaveViewState(widget, toolId);
    });

    // Close popup on viewport click
    viewport.addEventListener('click', e => {
        if (!e.target.closest('.ftree-node') && !e.target.closest('.ftree-popup')) {
            ftreeClosePopup(widget);
        }
    });
}

function ftreeApplyTransform(widget) {
    const canvas = widget.querySelector('.ftree-canvas');
    if (canvas) {
        canvas.style.transform = `translate(${widget._ftPanX}px, ${widget._ftPanY}px) scale(${widget._ftZoom})`;
    }
}

function ftreeUpdateZoomLabel(widget) {
    const label = widget.querySelector('.ftree-zoom-label');
    if (label) {
        label.textContent = Math.round(widget._ftZoom * 100) + '%';
    }
}

function ftreeSaveViewState(widget, toolId) {
    const data = ftreeGetData(toolId);
    if (!data) return;
    data.viewState = {
        panX: widget._ftPanX,
        panY: widget._ftPanY,
        zoom: widget._ftZoom
    };
    ftreeSaveData(toolId, data);
}

function ftreeZoomIn(btn) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    widget._ftZoom = Math.min(5, widget._ftZoom + 0.2);
    ftreeApplyTransform(widget);
    ftreeUpdateZoomLabel(widget);
    ftreeSaveViewState(widget, toolId);
}

function ftreeZoomOut(btn) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    widget._ftZoom = Math.max(0.1, widget._ftZoom - 0.2);
    ftreeApplyTransform(widget);
    ftreeUpdateZoomLabel(widget);
    ftreeSaveViewState(widget, toolId);
}

function ftreeFitView(widget, toolId) {
    const viewport = widget.querySelector('.ftree-viewport');
    const data = ftreeGetData(toolId);
    if (!data || !data.persons || Object.keys(data.persons).length === 0) {
        widget._ftPanX = 0;
        widget._ftPanY = 0;
        widget._ftZoom = 1;
        ftreeApplyTransform(widget);
        ftreeUpdateZoomLabel(widget);
        ftreeSaveViewState(widget, toolId);
        return;
    }

    const layout = ftreeComputeLayout(data);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of Object.values(layout.nodes)) {
        if (n.x < minX) minX = n.x;
        if (n.y < minY) minY = n.y;
        if (n.x + FTREE_NODE_W > maxX) maxX = n.x + FTREE_NODE_W;
        if (n.y + FTREE_NODE_H > maxY) maxY = n.y + FTREE_NODE_H;
    }

    const treeW = maxX - minX + 100;
    const treeH = maxY - minY + 100;
    const vpW = viewport.clientWidth;
    const vpH = viewport.clientHeight;

    const zoom = Math.min(vpW / treeW, vpH / treeH, 1);
    const panX = (vpW - treeW * zoom) / 2 - (minX - 50) * zoom;
    const panY = (vpH - treeH * zoom) / 2 - (minY - 50) * zoom;

    widget._ftZoom = zoom;
    widget._ftPanX = panX;
    widget._ftPanY = panY;
    ftreeApplyTransform(widget);
    ftreeUpdateZoomLabel(widget);
    ftreeSaveViewState(widget, toolId);
}

function ftreeResetView(btn) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    ftreeFitView(widget, toolId);
}

function ftreeNodeClick(event, nodeEl) {
    event.stopPropagation();
    const widget = nodeEl.closest('.ftree-widget');
    const personId = nodeEl.getAttribute('data-person-id');
    const rect = nodeEl.getBoundingClientRect();
    const vpRect = widget.querySelector('.ftree-viewport').getBoundingClientRect();
    const x = rect.right - vpRect.left + 5;
    const y = rect.top - vpRect.top;
    ftreeShowNodePopup(widget, personId, x, y);
}

function ftreeShowNodePopup(widget, personId, x, y) {
    ftreeClosePopup(widget);
    const toolId = ftreeGetToolId(widget);
    const data = ftreeGetData(toolId);
    if (!data || !data.persons[personId]) return;
    const p = data.persons[personId];
    const esc = s => (s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');

    // Editable fields
    const genderOpts = ['', 'm', 'f'].map(v => {
        const label = v === '' ? '-' : v === 'm' ? 'M' : 'F';
        return `<option value="${v}"${(p.gender || '') === v ? ' selected' : ''}>${label}</option>`;
    }).join('');

    const colorVal = p.color || '#cccccc';

    let fieldsHtml = `<div class="ftree-popup-fields">
<div class="ftree-popup-row"><input type="text" data-field="name" value="${esc(p.name)}" placeholder="Name" oninput="ftreePopupEditField(this,'${personId}','name')"></div>
<div class="ftree-popup-row"><label>Born</label><input type="text" data-field="birth" value="${esc(p.birth)}" placeholder="Birth" oninput="ftreePopupEditField(this,'${personId}','birth')"> <label>Died</label><input type="text" data-field="death" value="${esc(p.death)}" placeholder="Death" oninput="ftreePopupEditField(this,'${personId}','death')"> <select onchange="ftreePopupEditGender(this,'${personId}')">${genderOpts}</select> <input type="color" value="${colorVal}" onchange="ftreePopupEditColor(this,'${personId}')"></div>
<div class="ftree-popup-row"><input type="text" data-field="note" value="${esc(p.note)}" placeholder="Note" oninput="ftreePopupEditField(this,'${personId}','note')"></div>
</div>`;

    // Build toggle buttons for collapse/expand
    const children = ftreeGetChildrenOf(data, personId);
    const parents = ftreeGetParentsOf(data, personId);
    const collChildren = new Set(data.collapsedChildren || []);
    const collParents = new Set(data.collapsedParents || []);
    let toggleBtns = '';
    if (parents.length > 0) {
        const label = collParents.has(personId) ? `Show Parents (${parents.length})` : `Hide Parents (${parents.length})`;
        toggleBtns += `<button class="ftree-popup-btn" onclick="ftreeToggleParents(this.closest('.ftree-widget'), '${toolId}', '${personId}')">▲ ${label}</button>`;
    }
    if (children.length > 0) {
        const label = collChildren.has(personId) ? `Show Children (${children.length})` : `Hide Children (${children.length})`;
        toggleBtns += `<button class="ftree-popup-btn" onclick="ftreeToggleChildren(this.closest('.ftree-widget'), '${toolId}', '${personId}')">▼ ${label}</button>`;
    }

    const popup = document.createElement('div');
    popup.className = 'ftree-popup';
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.innerHTML = `${fieldsHtml}
<div class="ftree-popup-actions">
${toggleBtns}<button class="ftree-popup-btn" onclick="ftreeAddParent(this.closest('.ftree-widget'), '${toolId}', '${personId}')">+ Add Parent</button>
<button class="ftree-popup-btn" onclick="ftreeAddChild(this.closest('.ftree-widget'), '${toolId}', '${personId}')">+ Add Child</button>
<button class="ftree-popup-btn" onclick="ftreeAddSpouse(this.closest('.ftree-widget'), '${toolId}', '${personId}')">+ Add Spouse</button>
<button class="ftree-popup-btn danger" onclick="ftreeDeletePerson(this.closest('.ftree-widget'), '${toolId}', '${personId}')">Delete</button>
</div>`;
    widget.querySelector('.ftree-viewport').appendChild(popup);

    // Adjust if off-screen
    requestAnimationFrame(() => {
        const vpRect = widget.querySelector('.ftree-viewport').getBoundingClientRect();
        const pRect = popup.getBoundingClientRect();
        if (pRect.right > vpRect.right) {
            popup.style.left = (x - pRect.width - 10) + 'px';
        }
        if (pRect.bottom > vpRect.bottom) {
            popup.style.top = Math.max(0, vpRect.height - pRect.height - 5) + 'px';
        }
    });
}

function ftreeClosePopup(widget) {
    const existing = widget.querySelector('.ftree-popup');
    if (existing) existing.remove();
}

function ftreePopupEditField(input, personId, field) {
    const widget = input.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;
    const data = ftreeGetData(toolId);
    if (!data || !data.persons[personId]) return;
    data.persons[personId][field] = input.value || null;
    ftreeSaveData(toolId, data);
    // Update node text directly without full re-render
    const node = widget.querySelector(`.ftree-node[data-person-id="${personId}"]`);
    if (!node) return;
    if (field === 'name') {
        const el = node.querySelector('.ftree-node-name');
        if (el) el.textContent = input.value || '';
    } else if (field === 'birth' || field === 'death') {
        const b = data.persons[personId].birth, d = data.persons[personId].death;
        let el = node.querySelector('.ftree-node-dates');
        if (b || d) {
            if (!el) { el = document.createElement('div'); el.className = 'ftree-node-dates'; node.querySelector('.ftree-node-name').after(el); }
            el.textContent = (b || '?') + ' - ' + (d || '?');
        } else if (el) { el.remove(); }
    } else if (field === 'note') {
        let el = node.querySelector('.ftree-node-note');
        if (input.value) {
            if (!el) { el = document.createElement('div'); el.className = 'ftree-node-note'; const toggle = node.querySelector('.ftree-node-toggle'); if (toggle) node.insertBefore(el, toggle); else node.appendChild(el); }
            el.textContent = input.value;
        } else if (el) { el.remove(); }
    }
}

function ftreePopupEditGender(select, personId) {
    const widget = select.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;
    const data = ftreeGetData(toolId);
    if (!data || !data.persons[personId]) return;
    data.persons[personId].gender = select.value || null;
    ftreeSaveData(toolId, data);
    ftreeRender(widget, toolId);
}

function ftreePopupEditColor(input, personId) {
    const widget = input.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;
    const data = ftreeGetData(toolId);
    if (!data || !data.persons[personId]) return;
    data.persons[personId].color = input.value === '#cccccc' ? null : input.value;
    ftreeSaveData(toolId, data);
    ftreeRender(widget, toolId);
}

function ftreeNextPersonId(data) {
    let max = 0;
    for (const pid of Object.keys(data.persons)) {
        const n = parseInt(pid.replace('p', ''));
        if (n > max) max = n;
    }
    return 'p' + (max + 1);
}

function ftreeShowAddPopup(title, callback) {
    let overlay = document.getElementById('ftree-add-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'ftree-add-overlay';
        overlay.className = 'ftree-add-overlay';
        overlay.innerHTML = `<div class="ftree-add-content">
<h3 class="ftree-add-title"></h3>
<div class="ftree-add-row"><label>Name</label><input type="text" id="ftreeAddName" placeholder="Full name"></div>
<div class="ftree-add-row"><label>Gender</label><select id="ftreeAddGender"><option value="">Unknown</option><option value="m">Male</option><option value="f">Female</option></select></div>
<div class="ftree-add-row"><label>Birth</label><input type="text" id="ftreeAddBirth" placeholder="Year or date"></div>
<div class="ftree-add-row"><label>Death</label><input type="text" id="ftreeAddDeath" placeholder="Year or date"></div>
<div class="ftree-add-row"><label>Note</label><input type="text" id="ftreeAddNote" placeholder="Optional note"></div>
<div class="ftree-add-buttons">
<button class="ftree-add-cancel" onclick="ftreeCloseAddPopup()">Cancel</button>
<button class="ftree-add-save" onclick="ftreeAddPopupSave()">Add</button>
</div>
</div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', e => { if (e.target === overlay) ftreeCloseAddPopup(); });
        overlay.querySelector('#ftreeAddName').addEventListener('keydown', e => { if (e.key === 'Enter') ftreeAddPopupSave(); });
    }
    overlay.querySelector('.ftree-add-title').textContent = title;
    overlay.querySelector('#ftreeAddName').value = '';
    overlay.querySelector('#ftreeAddGender').value = '';
    overlay.querySelector('#ftreeAddBirth').value = '';
    overlay.querySelector('#ftreeAddDeath').value = '';
    overlay.querySelector('#ftreeAddNote').value = '';
    overlay._ftreeCallback = callback;
    overlay.classList.add('open');
    setTimeout(() => overlay.querySelector('#ftreeAddName').focus(), 50);
}

function ftreeCloseAddPopup() {
    const overlay = document.getElementById('ftree-add-overlay');
    if (overlay) { overlay.classList.remove('open'); overlay._ftreeCallback = null; }
}

function ftreeAddPopupSave() {
    const overlay = document.getElementById('ftree-add-overlay');
    if (!overlay || !overlay._ftreeCallback) return;
    const name = overlay.querySelector('#ftreeAddName').value.trim();
    if (!name) { overlay.querySelector('#ftreeAddName').focus(); return; }
    const person = {
        name: name,
        gender: overlay.querySelector('#ftreeAddGender').value || null,
        birth: overlay.querySelector('#ftreeAddBirth').value.trim() || null,
        death: overlay.querySelector('#ftreeAddDeath').value.trim() || null,
        note: overlay.querySelector('#ftreeAddNote').value.trim() || null,
        color: null
    };
    const cb = overlay._ftreeCallback;
    ftreeCloseAddPopup();
    cb(person);
}

function ftreeAddParent(widget, toolId, childId) {
    ftreeShowAddPopup('Add Parent', function(person) {
        const data = ftreeGetData(toolId);
        if (!data) return;
        const newId = ftreeNextPersonId(data);
        person.id = newId;
        data.persons[newId] = person;
        data.relationships.push({ type: 'parent-child', parent: newId, child: childId });
        const existingParents = (data.relationships || []).filter(r => r.type === 'parent-child' && r.child === childId && r.parent !== newId);
        if (existingParents.length === 1) {
            const otherParentId = existingParents[0].parent;
            const alreadySpouses = data.relationships.some(r => r.type === 'spouse' && ((r.person1 === newId && r.person2 === otherParentId) || (r.person1 === otherParentId && r.person2 === newId)));
            if (!alreadySpouses) {
                data.relationships.push({ type: 'spouse', person1: otherParentId, person2: newId });
            }
        }
        if (!data.rootPersonId) data.rootPersonId = newId;
        ftreeSaveData(toolId, data);
        ftreeClosePopup(widget);
        ftreeRender(widget, toolId);
        ftreeApplyTransform(widget);
    });
}

function ftreeAddChild(widget, toolId, parentId) {
    ftreeShowAddPopup('Add Child', function(person) {
        const data = ftreeGetData(toolId);
        if (!data) return;
        const newId = ftreeNextPersonId(data);
        person.id = newId;
        data.persons[newId] = person;
        data.relationships.push({ type: 'parent-child', parent: parentId, child: newId });
        ftreeSaveData(toolId, data);
        ftreeClosePopup(widget);
        ftreeRender(widget, toolId);
        ftreeApplyTransform(widget);
    });
}

function ftreeAddSpouse(widget, toolId, personId) {
    ftreeShowAddPopup('Add Spouse', function(person) {
        const data = ftreeGetData(toolId);
        if (!data) return;
        const newId = ftreeNextPersonId(data);
        person.id = newId;
        data.persons[newId] = person;
        data.relationships.push({ type: 'spouse', person1: personId, person2: newId });
        ftreeSaveData(toolId, data);
        ftreeClosePopup(widget);
        ftreeRender(widget, toolId);
        ftreeApplyTransform(widget);
    });
}

function ftreeDeletePerson(widget, toolId, personId) {
    if (!confirm('Delete this person and all their relationships?')) return;
    const data = ftreeGetData(toolId);
    if (!data) return;
    delete data.persons[personId];
    data.relationships = data.relationships.filter(r => {
        if (r.type === 'parent-child') return r.parent !== personId && r.child !== personId;
        if (r.type === 'spouse') return r.person1 !== personId && r.person2 !== personId;
        return true;
    });
    if (data.rootPersonId === personId) {
        const remaining = Object.keys(data.persons);
        data.rootPersonId = remaining.length > 0 ? remaining[0] : null;
    }
    ftreeSaveData(toolId, data);
    ftreeClosePopup(widget);
    ftreeRender(widget, toolId);
    ftreeApplyTransform(widget);
}

function ftreeToggleChildren(widget, toolId, personId) {
    const data = ftreeGetData(toolId);
    if (!data) return;
    if (!data.collapsedChildren) data.collapsedChildren = [];
    const idx = data.collapsedChildren.indexOf(personId);
    if (idx >= 0) data.collapsedChildren.splice(idx, 1);
    else data.collapsedChildren.push(personId);
    ftreeSaveData(toolId, data);
    ftreeClosePopup(widget);
    ftreeRender(widget, toolId);
    ftreeApplyTransform(widget);
}

function ftreeToggleParents(widget, toolId, personId) {
    const data = ftreeGetData(toolId);
    if (!data) return;
    if (!data.collapsedParents) data.collapsedParents = [];
    const idx = data.collapsedParents.indexOf(personId);
    if (idx >= 0) data.collapsedParents.splice(idx, 1);
    else data.collapsedParents.push(personId);
    ftreeSaveData(toolId, data);
    ftreeClosePopup(widget);
    ftreeRender(widget, toolId);
    ftreeApplyTransform(widget);
}

function ftreeNodeToggleChildren(toggleEl) {
    const widget = toggleEl.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    const personId = toggleEl.closest('.ftree-node').getAttribute('data-person-id');
    ftreeToggleChildren(widget, toolId, personId);
}

function ftreeNodeToggleParents(toggleEl) {
    const widget = toggleEl.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    const personId = toggleEl.closest('.ftree-node').getAttribute('data-person-id');
    ftreeToggleParents(widget, toolId, personId);
}

function ftreeOpenEditor(btn) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    const data = ftreeGetData(toolId);

    // Remove viewState from editor display
    const editorData = JSON.parse(JSON.stringify(data || ftreeDefaultData()));
    delete editorData.viewState;

    let overlay = document.getElementById('ftree-editor-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'ftree-editor-overlay';
        overlay.className = 'ftree-editor-overlay';
        overlay.innerHTML = `<div class="ftree-editor-content">
<div class="ftree-editor-header">
<h3>Family Tree Data</h3>
<button class="ftree-btn" onclick="ftreeCloseEditor()">Close</button>
</div>
<div class="ftree-editor-body">
<textarea class="ftree-editor-textarea" spellcheck="false"></textarea>
</div>
<div class="ftree-editor-footer">
<div class="ftree-editor-footer-left">
<button class="ftree-btn" onclick="ftreeEditorClear()">Clear</button>
</div>
<div class="ftree-editor-footer-right">
<button class="ftree-btn" onclick="ftreeEditorSave()" style="font-weight:bold">Save</button>
</div>
</div>
</div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', e => {
            if (e.target === overlay) ftreeCloseEditor();
        });
    }

    overlay._ftreeToolId = toolId;
    overlay._ftreeWidget = widget;
    overlay.querySelector('.ftree-editor-textarea').value = JSON.stringify(editorData, null, 2);
    overlay.classList.add('open');
}

function ftreeCloseEditor() {
    const overlay = document.getElementById('ftree-editor-overlay');
    if (overlay) overlay.classList.remove('open');
}

function ftreeEditorSave() {
    const overlay = document.getElementById('ftree-editor-overlay');
    if (!overlay) return;
    const textarea = overlay.querySelector('.ftree-editor-textarea');
    const toolId = overlay._ftreeToolId;
    const widget = overlay._ftreeWidget;

    let parsed;
    try {
        parsed = JSON.parse(textarea.value);
    } catch (e) {
        alert('Invalid JSON: ' + e.message);
        return;
    }

    // Restore viewState from current widget
    parsed.viewState = {
        panX: widget._ftPanX || 0,
        panY: widget._ftPanY || 0,
        zoom: widget._ftZoom || 1
    };

    ftreeSaveData(toolId, parsed);
    ftreeRender(widget, toolId);
    ftreeApplyTransform(widget);
    ftreeCloseEditor();
}

function ftreeEditorClear() {
    const overlay = document.getElementById('ftree-editor-overlay');
    if (!overlay) return;
    const empty = ftreeDefaultData();
    delete empty.viewState;
    overlay.querySelector('.ftree-editor-textarea').value = JSON.stringify(empty, null, 2);
}

// ── Family Tree Form Editor ──

function ftreeToggleForm(btn) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;

    const viewport = widget.querySelector('.ftree-viewport');
    const formEditor = widget.querySelector('.ftree-form-editor');

    if (formEditor.style.display === 'block') {
        // Switch back to visual
        btn.classList.remove('active');
        viewport.style.display = '';
        formEditor.style.display = 'none';
        ftreeRender(widget, toolId);
        ftreeApplyTransform(widget);
    } else {
        // Switch to form mode
        btn.classList.add('active');
        viewport.style.display = 'none';
        formEditor.style.display = 'block';
        ftreeRenderForm(widget, toolId);
    }
}

function ftreeGetSpouse(data, personId) {
    for (const r of data.relationships) {
        if (r.type === 'spouse') {
            if (r.person1 === personId) return r.person2;
            if (r.person2 === personId) return r.person1;
        }
    }
    return null;
}

function ftreeGetChildrenOf(data, parentId) {
    const children = [];
    for (const r of data.relationships) {
        if (r.type === 'parent-child' && r.parent === parentId && children.indexOf(r.child) === -1) {
            children.push(r.child);
        }
    }
    return children;
}

function ftreeGetParentsOf(data, childId) {
    const parents = [];
    for (const r of data.relationships) {
        if (r.type === 'parent-child' && r.child === childId && parents.indexOf(r.parent) === -1) {
            parents.push(r.parent);
        }
    }
    return parents;
}

function ftreeRenderForm(widget, toolId) {
    const formEditor = widget.querySelector('.ftree-form-editor');
    const data = ftreeGetData(toolId);
    const addBtn = '<div style="margin-bottom:6px"><button class="ftree-btn" onclick="ftreeFormAddPerson(this)" style="width:100%">+ Add Person</button></div>';

    if (!data || !data.persons || Object.keys(data.persons).length === 0) {
        formEditor.innerHTML = addBtn;
        return;
    }

    const personIds = Object.keys(data.persons);

    const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    let html = addBtn;
    for (const pid of personIds) {
        const p = data.persons[pid];
        const isRoot = data.rootPersonId === pid;
        const genderIcon = p.gender === 'm' ? '\u2642' : p.gender === 'f' ? '\u2640' : '\u26A5';

        // Relationships
        const spouseId = ftreeGetSpouse(data, pid);
        const spouseName = spouseId && data.persons[spouseId] ? data.persons[spouseId].name : null;
        const parentIds = ftreeGetParentsOf(data, pid);
        const parentNames = parentIds.map(id => data.persons[id] ? data.persons[id].name : '?');
        const childIds = ftreeGetChildrenOf(data, pid);
        const childNames = childIds.map(id => data.persons[id] ? data.persons[id].name : '?');

        html += '<div class="ftree-form-card' + (isRoot ? ' root' : '') + '">';

        // Header
        html += '<div class="ftree-form-header"><span class="ftree-form-icon">' + genderIcon + '</span>';
        if (isRoot) html += ' <span class="ftree-form-badge">ROOT</span>';
        html += '</div>';

        // Fields row 1: Name, Birth, Death, Gender
        html += '<div class="ftree-form-fields">';
        html += '<input type="text" data-field="name" value="' + esc(p.name) + '" placeholder="Name" oninput="ftreeFormEditField(this,\'' + pid + '\',\'name\')">';
        html += '<input type="text" data-field="birth" value="' + esc(p.birth) + '" placeholder="Born" oninput="ftreeFormEditField(this,\'' + pid + '\',\'birth\')">';
        html += '<input type="text" data-field="death" value="' + esc(p.death) + '" placeholder="Died" oninput="ftreeFormEditField(this,\'' + pid + '\',\'death\')">';
        html += '<select onchange="ftreeFormEditGender(this,\'' + pid + '\')">';
        html += '<option value=""' + (!p.gender ? ' selected' : '') + '>-</option>';
        html += '<option value="m"' + (p.gender === 'm' ? ' selected' : '') + '>M</option>';
        html += '<option value="f"' + (p.gender === 'f' ? ' selected' : '') + '>F</option>';
        html += '</select>';
        html += '</div>';

        // Fields row 2: Note
        html += '<div class="ftree-form-fields">';
        html += '<input type="text" data-field="note" value="' + esc(p.note) + '" placeholder="Note" oninput="ftreeFormEditField(this,\'' + pid + '\',\'note\')">';
        html += '</div>';

        // Relationships
        const rels = [];
        if (spouseName) rels.push('Spouse: <span>' + esc(spouseName) + '</span>');
        if (parentNames.length > 0) rels.push('Parents: <span>' + parentNames.map(esc).join(' &amp; ') + '</span>');
        if (childNames.length > 0) rels.push('Children: <span>' + childNames.map(esc).join(', ') + '</span>');
        if (rels.length > 0) {
            html += '<div class="ftree-form-rels">' + rels.join(' \u00B7 ') + '</div>';
        }

        // Actions
        html += '<div class="ftree-form-actions">';
        html += '<button onclick="ftreeFormAddChild(this,\'' + pid + '\')">+ Child</button>';
        html += '<button onclick="ftreeFormAddParent(this,\'' + pid + '\')">+ Parent</button>';
        if (!spouseId) {
            html += '<button onclick="ftreeFormAddSpouse(this,\'' + pid + '\')">+ Spouse</button>';
        }
        if (isRoot) {
            html += '<button disabled>Root</button>';
        } else {
            html += '<button onclick="ftreeFormSetRoot(this,\'' + pid + '\')">Set Root</button>';
        }
        html += '<button class="danger" onclick="ftreeFormDelete(this,\'' + pid + '\')">Delete</button>';
        html += '</div>';

        html += '</div>';
    }
    formEditor.innerHTML = html;

    // Update status
    const status = widget.querySelector('.ftree-status');
    if (status) {
        status.textContent = personIds.length + ' person' + (personIds.length !== 1 ? 's' : '');
    }
}

function ftreeFormEditField(input, personId, field) {
    const widget = input.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;
    const data = ftreeGetData(toolId);
    if (!data || !data.persons[personId]) return;
    data.persons[personId][field] = input.value || null;
    ftreeSaveData(toolId, data);
}

function ftreeFormEditGender(select, personId) {
    const widget = select.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;
    const data = ftreeGetData(toolId);
    if (!data || !data.persons[personId]) return;
    data.persons[personId].gender = select.value || null;
    ftreeSaveData(toolId, data);
    ftreeRenderForm(widget, toolId);
}

function ftreeFormAddPerson(btn) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;
    ftreeShowAddPopup('Add Person', function(person) {
        let data = ftreeGetData(toolId);
        if (!data) data = ftreeDefaultData();
        const newId = ftreeNextPersonId(data);
        person.id = newId;
        data.persons[newId] = person;
        if (!data.rootPersonId) data.rootPersonId = newId;
        ftreeSaveData(toolId, data);
        ftreeRenderForm(widget, toolId);
    });
}

function ftreeFormAddChild(btn, parentId) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;
    ftreeShowAddPopup('Add Child', function(person) {
        const data = ftreeGetData(toolId);
        if (!data) return;
        const newId = ftreeNextPersonId(data);
        person.id = newId;
        data.persons[newId] = person;
        data.relationships.push({ type: 'parent-child', parent: parentId, child: newId });
        ftreeSaveData(toolId, data);
        ftreeRenderForm(widget, toolId);
    });
}

function ftreeFormAddParent(btn, childId) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;
    ftreeShowAddPopup('Add Parent', function(person) {
        const data = ftreeGetData(toolId);
        if (!data) return;
        const newId = ftreeNextPersonId(data);
        person.id = newId;
        data.persons[newId] = person;
        data.relationships.push({ type: 'parent-child', parent: newId, child: childId });
        const existingParents = data.relationships.filter(r => r.type === 'parent-child' && r.child === childId && r.parent !== newId);
        if (existingParents.length === 1) {
            const otherParentId = existingParents[0].parent;
            const alreadySpouses = data.relationships.some(r => r.type === 'spouse' && ((r.person1 === newId && r.person2 === otherParentId) || (r.person1 === otherParentId && r.person2 === newId)));
            if (!alreadySpouses) {
                data.relationships.push({ type: 'spouse', person1: otherParentId, person2: newId });
            }
        }
        if (!data.rootPersonId) data.rootPersonId = newId;
        ftreeSaveData(toolId, data);
        ftreeRenderForm(widget, toolId);
    });
}

function ftreeFormAddSpouse(btn, personId) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;
    const data = ftreeGetData(toolId);
    if (!data) return;
    if (ftreeGetSpouse(data, personId)) return;
    ftreeShowAddPopup('Add Spouse', function(person) {
        const data2 = ftreeGetData(toolId);
        if (!data2) return;
        const newId = ftreeNextPersonId(data2);
        person.id = newId;
        data2.persons[newId] = person;
        data2.relationships.push({ type: 'spouse', person1: personId, person2: newId });
        ftreeSaveData(toolId, data2);
        ftreeRenderForm(widget, toolId);
    });
}

function ftreeFormSetRoot(btn, personId) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;
    const data = ftreeGetData(toolId);
    if (!data) return;
    data.rootPersonId = personId;
    ftreeSaveData(toolId, data);
    ftreeRenderForm(widget, toolId);
}

function ftreeFormDelete(btn, personId) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;
    const data = ftreeGetData(toolId);
    if (!data) return;
    delete data.persons[personId];
    data.relationships = data.relationships.filter(r => {
        if (r.type === 'parent-child') return r.parent !== personId && r.child !== personId;
        if (r.type === 'spouse') return r.person1 !== personId && r.person2 !== personId;
        return true;
    });
    if (data.rootPersonId === personId) {
        const remaining = Object.keys(data.persons);
        data.rootPersonId = remaining.length > 0 ? remaining[0] : null;
    }
    ftreeSaveData(toolId, data);
    ftreeRenderForm(widget, toolId);
}

// =============================================
// IMAGE VIEWER
// =============================================

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
    if (inputUrl && inputUrl.match(/^https?:\/\//i)) {
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
        imgvCrop: widget._imgvCrop || null
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
// SCRIPT INJECTION FOR HTML EXPORT
// =============================================

(function injectScriptsForExport() {
    if (document.getElementById('creative-tools-scripts')) return;

    var cpkFunctions = [cpkHsvToRgb, cpkRgbToHsv, cpkRgbToHsl, cpkHslToRgb, cpkGetState, cpkDrawWheel, cpkDrawSV, cpkUpdateCursors, cpkUpdateAlpha, cpkUpdateValues, cpkFullUpdate, cpkWheelEvent, cpkSVEvent, cpkAlphaEvent, cpkMakeDraggable, cpkHexTyped, cpkRgbaTyped, cpkHslaTyped, cpkAlphaTyped, cpkCopyVal, cpkSaveColor, cpkInit];
    var emoteFunctions = [emoteInit, emoteSelectTab, emoteRender, emoteSearch, emoteCopy];
    var drawFunctions = [drawGetState, drawInit, drawBeginStroke, drawMoveStroke, drawEndStroke, drawSetColor, drawSetSize, drawToggleEraser, drawClear, drawUndo, drawDownload, drawResizeCanvas, drawColorInput, drawSizeInput];
    var ftreeFunctions = [ftreeGetToolId, ftreeGetData, ftreeSaveData, ftreeDefaultData, ftreeGetVisiblePersons, ftreeFilterVisibleData, ftreeInit, ftreeComputeLayout, ftreeRender, ftreeSetupPanZoom, ftreeApplyTransform, ftreeUpdateZoomLabel, ftreeSaveViewState, ftreeZoomIn, ftreeZoomOut, ftreeFitView, ftreeResetView, ftreeNodeClick, ftreeShowNodePopup, ftreeClosePopup, ftreePopupEditField, ftreePopupEditGender, ftreePopupEditColor, ftreeNextPersonId, ftreeShowAddPopup, ftreeCloseAddPopup, ftreeAddPopupSave, ftreeAddParent, ftreeAddChild, ftreeAddSpouse, ftreeDeletePerson, ftreeToggleChildren, ftreeToggleParents, ftreeNodeToggleChildren, ftreeNodeToggleParents, ftreeOpenEditor, ftreeCloseEditor, ftreeEditorSave, ftreeEditorClear, ftreeToggleForm, ftreeGetSpouse, ftreeGetChildrenOf, ftreeGetParentsOf, ftreeRenderForm, ftreeFormEditField, ftreeFormEditGender, ftreeFormAddPerson, ftreeFormAddChild, ftreeFormAddParent, ftreeFormAddSpouse, ftreeFormSetRoot, ftreeFormDelete];
    var imgvFunctions = [imgvGetWidget, imgvGetToolId, imgvFlash, imgvGetState, imgvBuildFilterString, imgvBuildTransformString, imgvApplyStyles, imgvApplyCropLayout, imgvUpdateValueDisplay, imgvSliderChange, imgvToggleFlip, imgvShowImage, imgvLoad, imgvHandlePaste, imgvHandleDrop, imgvReset, imgvProcessTransparency, imgvTransColorChange, imgvTransToleranceChange, imgvPickToggle, imgvDisplayClick, imgvToggleMode, imgvCropStart, imgvCreateCropOverlay, imgvCropMouseDown, imgvCropMouseMove, imgvCropMouseUp, imgvCropUpdateRect, imgvCropApply, imgvCropCancel, imgvCropExit, imgvSaveState, imgvInit];
    var allFunctions = cpkFunctions.concat(emoteFunctions).concat(drawFunctions).concat(ftreeFunctions).concat(imgvFunctions);

    var code = '(function() {\n' +
        'if (typeof cpkInit !== "undefined") return;\n' +
        'window._cpkState = new WeakMap();\n' +
        'window._drawState = new WeakMap();\n' +
        'window.EMOTE_DATA = ' + JSON.stringify(EMOTE_DATA) + ';\n' +
        'window.FTREE_NODE_W = ' + FTREE_NODE_W + ';\n' +
        'window.FTREE_NODE_H = ' + FTREE_NODE_H + ';\n' +
        'window.FTREE_H_GAP = ' + FTREE_H_GAP + ';\n' +
        'window.FTREE_V_GAP = ' + FTREE_V_GAP + ';\n' +
        'window.FTREE_SPOUSE_GAP = ' + FTREE_SPOUSE_GAP + ';\n' +
        'window.IMGV_DEFAULTS = ' + JSON.stringify(IMGV_DEFAULTS) + ';\n' +
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
    tools: ['color-picker', 'drawing-canvas', 'emoticon-picker', 'family-tree', 'image-viewer'],
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
    description: 'Interactive family tree with pan/zoom',
    icon: '\uD83C\uDF33',
    version: '1.0.0',
    toolbox: 'creative-tools',
    tags: ['family', 'tree', 'genealogy', 'ancestry', 'lineage'],
    title: 'Family Tree',
    content: '<div class="ftree-widget">' +
        '<div class="ftree-toolbar">' +
        '<button class="ftree-btn" onclick="ftreeZoomOut(this)">\u2212</button>' +
        '<span class="ftree-zoom-label">100%</span>' +
        '<button class="ftree-btn" onclick="ftreeZoomIn(this)">+</button>' +
        '<button class="ftree-btn" onclick="ftreeResetView(this)">Fit</button>' +
        '<span class="ftree-toolbar-spacer"></span>' +
        '<button class="ftree-btn" onclick="ftreeToggleForm(this)">\u2630 Form</button>' +
        '<button class="ftree-btn" onclick="ftreeOpenEditor(this)">Edit</button>' +
        '</div>' +
        '<div class="ftree-viewport">' +
        '<div class="ftree-canvas">' +
        '<div class="ftree-connectors"></div>' +
        '<div class="ftree-nodes"></div>' +
        '</div>' +
        '</div>' +
        '<div class="ftree-form-editor"></div>' +
        '<div class="ftree-status">0 persons</div>' +
        '</div>',
    contentType: 'html',
    onInit: 'ftreeInit',
    source: 'external',
    defaultWidth: 600,
    defaultHeight: 450
});

// Image Viewer
PluginRegistry.registerTool({
    id: 'image-viewer',
    name: 'Image Viewer',
    description: 'Load images from URL, paste, or drag-drop with real-time CSS filter and transform editing',
    icon: '\uD83D\uDDBC\uFE0F',
    version: '1.0.0',
    toolbox: 'creative-tools',
    tags: ['image', 'photo', 'picture', 'filter', 'brightness', 'contrast', 'saturate', 'blur', 'rotate', 'flip', 'css', 'viewer'],
    title: 'Image Viewer',
    content: '<div class="imgv-widget">' +
        '<div class="imgv-input-row">' +
            '<input type="text" placeholder="Enter image URL..." spellcheck="false">' +
            '<button onclick="imgvLoad(this)">Load</button>' +
        '</div>' +
        '<div class="imgv-display">' +
            '<button class="imgv-mode-toggle" onclick="imgvToggleMode(this)">Render</button>' +
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
        '</div>' +
    '</div>',
    contentType: 'html',
    onInit: 'imgvInit',
    source: 'external',
    defaultWidth: 420,
    defaultHeight: 520
});

console.log('Creative Tools plugin loaded (5 tools)');
