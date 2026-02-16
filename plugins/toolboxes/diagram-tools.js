// Diagram Tools Toolbox Plugin
// Contains diagramming and visual tools

// Inject CSS styles for diagram tools
(function() {
    if (document.getElementById('diagram-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'diagram-tools-styles';
    style.textContent = `
/* Sequence Diagram Widget Styles */
.tool-content:has(.seq-widget) { display: flex; flex-direction: column; }
.seq-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; }
.seq-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 10px; flex-shrink: 0; flex-wrap: wrap; }
.seq-mode-toggle { display: flex; gap: 4px; }
.seq-mode-btn { padding: 6px 12px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.seq-mode-btn:first-child { border-radius: 4px 0 0 4px; }
.seq-mode-btn:last-child { border-radius: 0 4px 4px 0; }
.seq-mode-btn.active { background: #3498db; color: white; border-color: #3498db; }
.seq-help-btn { padding: 5px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-secondary); cursor: pointer; font-size: 10px; border-radius: 3px; }
.seq-help-btn:hover { background: var(--table-hover); }
.seq-split-container { flex: 1; display: none; gap: 10px; min-height: 0; }
.seq-split-container.active { display: flex; }
.seq-split-container .seq-edit-pane { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.seq-split-container .seq-edit-pane textarea { flex: 1; resize: none; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); min-height: 100px; line-height: 1.5; }
.seq-split-container .seq-edit-pane textarea:focus { outline: none; border-color: #3498db; }
.seq-split-container .seq-view-pane { flex: 1; display: flex; flex-direction: column; min-width: 0; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-tertiary); overflow: auto; }
.seq-split-resizer { width: 6px; background: var(--border-color); cursor: col-resize; border-radius: 3px; flex-shrink: 0; }
.seq-split-resizer:hover { background: #3498db; }
.seq-edit-container { flex: 1; display: none; flex-direction: column; min-height: 0; }
.seq-edit-container.active { display: flex; }
.seq-edit-container textarea { flex: 1; resize: none; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); min-height: 100px; line-height: 1.5; }
.seq-edit-container textarea:focus { outline: none; border-color: #3498db; }
.seq-edit-container textarea::placeholder { color: var(--text-muted); }
.seq-view-container { flex: 1; min-height: 0; display: none; flex-direction: column; overflow: auto; }
.seq-view-container.active { display: flex; }
.seq-diagram { flex: 1; min-height: 200px; display: flex; justify-content: center; padding: 10px; }
.seq-diagram svg { max-width: 100%; height: auto; }
.seq-participant-box { fill: var(--bg-tertiary); stroke: var(--border-color); stroke-width: 2; }
.seq-participant-text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 600; fill: var(--text-primary); text-anchor: middle; dominant-baseline: middle; }
.seq-lifeline { stroke: var(--border-color); stroke-width: 1; stroke-dasharray: 5, 5; }
.seq-arrow { stroke: var(--text-primary); stroke-width: 1.5; fill: none; }
.seq-arrow-head { fill: var(--text-primary); stroke: none; }
.seq-arrow.dashed { stroke-dasharray: 5, 3; }
.seq-arrow-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; fill: var(--text-primary); dominant-baseline: middle; }
.seq-arrow-number { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: 700; fill: white; }
.seq-arrow-number-bg { fill: #3498db; }
.seq-arrow.dashed + .seq-arrow-number-bg, .seq-dashed-number-bg { fill: #9b59b6; }
.seq-self-arrow { stroke: var(--text-primary); stroke-width: 1.5; fill: none; }
.seq-note-box { fill: #ffffcc; stroke: #cccc00; stroke-width: 1; }
.seq-note-text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; fill: #333; }
body.dark-mode .seq-note-box { fill: #4a4a2a; stroke: #8a8a3a; }
body.dark-mode .seq-note-text { fill: #e4e4e7; }
.seq-error-message { padding: 20px; text-align: center; color: var(--text-muted); font-style: italic; }
.seq-help-text { font-size: 10px; color: var(--text-muted); padding: 8px 0; border-top: 1px solid var(--border-light); margin-top: 8px; flex-shrink: 0; }
.seq-help-text code { background: var(--code-bg); padding: 1px 4px; border-radius: 3px; font-family: monospace; }
.seq-help-modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg); z-index: 10015; justify-content: center; align-items: center; }
.seq-help-modal.open { display: flex; }
.seq-help-content { background: var(--bg-secondary); border-radius: 8px; padding: 20px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; }
.seq-help-content h3 { margin-bottom: 12px; color: var(--text-heading); }
.seq-help-content pre { background: var(--code-bg); padding: 12px; border-radius: 4px; font-size: 11px; overflow-x: auto; margin: 10px 0; }
.seq-help-content p { margin: 8px 0; font-size: 12px; color: var(--text-secondary); }
.seq-help-close { float: right; font-size: 24px; cursor: pointer; color: var(--text-muted); line-height: 1; }
.seq-help-close:hover { color: var(--text-heading); }
body.dark-mode .seq-participant-box { fill: var(--bg-tertiary); stroke: var(--border-color); }
body.dark-mode .seq-arrow-number-bg { fill: #2980b9; }
body.dark-mode .seq-dashed-number-bg { fill: #8e44ad; }

/* Mermaid Diagram Widget Styles */
.mermaid-diag-widget { display: flex; flex-direction: column; height: 100%; box-sizing: border-box; }
.mermaid-diag-toolbar { display: flex; align-items: center; gap: 5px; padding: 6px 8px; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; }
.mermaid-diag-toolbar select, .mermaid-diag-toolbar button { font-size: 12px; }
.mermaid-diag-body { display: flex; flex: 1; min-height: 0; }
.mermaid-diag-editor { width: 50%; display: flex; flex-direction: column; border-right: 1px solid var(--border-color); }
.mermaid-diag-editor textarea { flex: 1; resize: none; border: none; padding: 8px; font-family: monospace; font-size: 12px; line-height: 1.5; background: var(--bg-primary); color: var(--text-primary); outline: none; min-height: 0; }
.mermaid-diag-preview { width: 50%; overflow: auto; padding: 8px; background: #fff; display: flex; align-items: flex-start; justify-content: center; }
.mermaid-diag-preview svg { max-width: 100%; height: auto; }
.mermaid-diag-error { color: #e74c3c; font-size: 11px; font-family: monospace; white-space: pre-wrap; padding: 8px; }
.mermaid-diag-status { font-size: 11px; color: var(--text-muted); padding: 3px 8px; border-top: 1px solid var(--border-color); }

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

/* Diagram Widget Styles */
.tool-content:has(.dgm-widget) { display: flex; flex-direction: column; padding: 0 !important; }
.dgm-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; position: relative; }
.dgm-toolbar { display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; flex-wrap: wrap; background: var(--bg-tertiary); }
.dgm-tool-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); border-radius: 3px; cursor: pointer; font-size: 13px; padding: 0; }
.dgm-tool-btn:hover { background: var(--bg-primary); }
.dgm-tool-btn.active { background: #3498db; color: white; border-color: #3498db; }
.dgm-align-btn { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); border-radius: 3px; cursor: pointer; font-size: 11px; padding: 0; }
.dgm-align-btn:hover { background: var(--bg-primary); }
.dgm-align-btn.active, .dgm-valign-btn.active { background: #3498db; color: white; border-color: #3498db; }
.dgm-valign-btn { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); border-radius: 3px; cursor: pointer; font-size: 11px; padding: 0; }
.dgm-valign-btn:hover { background: var(--bg-primary); }
.dgm-nofill-btn { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); border-radius: 3px; cursor: pointer; padding: 0; flex-shrink: 0; }
.dgm-nofill-btn.active { background: #3498db; color: white; border-color: #3498db; }
.dgm-tool-sep { width: 1px; height: 20px; background: var(--border-color); margin: 0 2px; flex-shrink: 0; }
.dgm-toolbar input[type="color"] { width: 24px; height: 24px; padding: 0; border: 1px solid var(--border-color); border-radius: 3px; cursor: pointer; background: none; flex-shrink: 0; }
.dgm-toolbar select { padding: 2px 4px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; background: var(--bg-secondary); color: var(--text-primary); }
.dgm-toolbar label { font-size: 10px; color: var(--text-muted); flex-shrink: 0; }
.dgm-canvas-wrap { flex: 1; position: relative; min-height: 0; overflow: hidden; background: var(--bg-primary); }
.dgm-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; touch-action: none; }
.dgm-actions { display: flex; align-items: center; gap: 6px; padding: 4px 8px; border-top: 1px solid var(--border-color); flex-shrink: 0; background: var(--bg-tertiary); }
.dgm-actions button { padding: 3px 10px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 3px; }
.dgm-actions button:hover { background: var(--bg-primary); }
.dgm-actions .dgm-spacer { flex: 1; }
.dgm-zoom-label { font-size: 10px; color: var(--text-muted); min-width: 36px; text-align: center; }
.dgm-text-overlay { position: absolute; border: 2px solid #3498db; background: var(--bg-secondary); color: var(--text-primary); font-size: 14px; padding: 2px 4px; resize: none; z-index: 10; outline: none; font-family: sans-serif; box-sizing: border-box; min-width: 60px; min-height: 28px; }
.dgm-context-menu { position: absolute; z-index: 20; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 4px 0; min-width: 160px; font-size: 12px; }
.dgm-context-menu .dgm-ctx-item { display: flex; align-items: center; justify-content: space-between; padding: 5px 12px; cursor: pointer; color: var(--text-primary); white-space: nowrap; }
.dgm-context-menu .dgm-ctx-item:hover { background: var(--bg-tertiary); }
.dgm-context-menu .dgm-ctx-item.disabled { color: var(--text-muted); pointer-events: none; }
.dgm-context-menu .dgm-ctx-shortcut { color: var(--text-muted); font-size: 10px; margin-left: 16px; }
.dgm-context-menu .dgm-ctx-sep { height: 1px; background: var(--border-color); margin: 4px 0; }
.dgm-tabs { display: flex; align-items: center; gap: 0; border-bottom: 1px solid var(--border-color); background: var(--bg-tertiary); overflow-x: auto; flex-shrink: 0; }
.dgm-tab { padding: 4px 12px; border-bottom: 2px solid transparent; cursor: pointer; font-size: 11px; white-space: nowrap; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; user-select: none; }
.dgm-tab:hover { color: var(--text-primary); }
.dgm-tab.active { border-bottom: 2px solid #3498db; color: #3498db; }
.dgm-tab .dgm-tab-close { font-size: 13px; line-height: 1; cursor: pointer; opacity: 0.5; padding: 0 2px; }
.dgm-tab .dgm-tab-close:hover { opacity: 1; color: #e74c3c; }
.dgm-tab-add { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border: none; background: transparent; cursor: pointer; color: var(--text-muted); font-size: 16px; flex-shrink: 0; }
.dgm-tab-add:hover { color: var(--text-primary); }
`;
    document.head.appendChild(style);
})();

// ============================================================
// Toolbox Registration
// ============================================================

PluginRegistry.registerToolbox({
    id: 'diagram-tools',
    name: 'Diagram Tools',
    description: 'Diagramming and visual tools',
    icon: '\uD83D\uDCD0',
    color: '#8e44ad',
    version: '1.0.0',
    tools: ['diagram', 'family-tree', 'mermaid-diagram', 'sequence-diagram'],
    source: 'external'
});

// ============================================================
// Constants and State Variables
// ============================================================

const FTREE_NODE_W = 160;
const FTREE_NODE_H = 60;
const FTREE_H_GAP = 40;
const FTREE_V_GAP = 80;
const FTREE_SPOUSE_GAP = 15;

var mermaidDiagLoaded = false;
var mermaidDiagRenderCounter = 0;

var dgmState = {};
var dgmClipboard = null;
var DGM_BRAIN_PATHS = [
    'M 174 76 L 190 77 L 204 80 L 216 82 L 228 84 L 240 90 L 250 96 L 260 106 L 270 114 L 280 124 L 288 136 L 294 148 L 298 160 L 304 172 L 308 184 L 308 196 L 304 208 L 296 218 L 288 226 L 278 234 L 268 240 L 258 248 L 248 254 L 238 257 L 233 257 L 232 262 L 234 270 L 236 276 L 232 282 L 224 284 L 216 282 L 208 276 L 200 264 L 192 254 L 186 248 L 176 250 L 164 254 L 152 255 L 140 252 L 130 246 L 122 240 L 116 234 L 113 228 L 104 226 L 92 222 L 80 216 L 70 208 L 62 200 L 56 190 L 52 180 L 50 170 L 50 160 L 54 150 L 58 142 L 64 136 L 72 130 L 80 124 L 88 118 L 98 112 L 108 106 L 118 100 L 130 94 L 140 88 L 150 84 L 162 80 Z'
];

// ============================================================
// Sequence Diagram Functions
// ============================================================

function seqGetToolId(element) { return element.closest('.tool')?.dataset.tool || null; }
function seqGetData(toolId) {
    const customizations = loadToolCustomizations();
    return (customizations[toolId]?.seqData) || { text: '', mode: 'split' };
}
function seqSaveData(toolId, data) {
    const customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].seqData = data;
    saveToolCustomizations(customizations);
}
function seqInit() {
    document.querySelectorAll('.seq-widget').forEach(widget => {
        const toolId = seqGetToolId(widget);
        if (!toolId) return;
        const data = seqGetData(toolId);
        widget.querySelectorAll('textarea').forEach(ta => ta.value = data.text);
        widget.querySelectorAll('.seq-mode-btn').forEach(btn => btn.classList.toggle('active', btn.textContent.toLowerCase() === data.mode));
        seqUpdateContainers(widget, data.mode, toolId);
    });
}
function seqUpdateContainers(widget, mode, toolId) {
    const editContainer = widget.querySelector('.seq-edit-container');
    const splitContainer = widget.querySelector('.seq-split-container');
    const viewContainer = widget.querySelector('.seq-view-container');
    editContainer.classList.remove('active');
    splitContainer.classList.remove('active');
    viewContainer.classList.remove('active');
    if (mode === 'edit') editContainer.classList.add('active');
    else if (mode === 'split') { splitContainer.classList.add('active'); seqRenderDiagram(widget, toolId, '.seq-split-container .seq-diagram'); }
    else if (mode === 'view') { viewContainer.classList.add('active'); seqRenderDiagram(widget, toolId, '.seq-view-container .seq-diagram'); }
}
function seqOnInput(textarea) {
    const widget = textarea.closest('.seq-widget');
    const toolId = seqGetToolId(textarea);
    if (!toolId) return;
    const data = seqGetData(toolId);
    data.text = textarea.value;
    seqSaveData(toolId, data);
    widget.querySelectorAll('textarea').forEach(ta => { if (ta !== textarea) ta.value = textarea.value; });
    if (data.mode === 'split') seqRenderDiagram(widget, toolId, '.seq-split-container .seq-diagram');
}
function seqSetMode(btn, mode) {
    const widget = btn.closest('.seq-widget');
    const toolId = seqGetToolId(widget);
    if (!toolId) return;
    const data = seqGetData(toolId);
    data.mode = mode;
    seqSaveData(toolId, data);
    widget.querySelectorAll('.seq-mode-btn').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase() === mode));
    widget.querySelectorAll('textarea').forEach(ta => ta.value = data.text);
    seqUpdateContainers(widget, mode, toolId);
}
function seqShowHelp(btn) {
    let modal = document.querySelector('.seq-help-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'seq-help-modal';
        modal.innerHTML = `<div class="seq-help-content"><span class="seq-help-close" onclick="this.closest('.seq-help-modal').classList.remove('open')">&times;</span><h3>Sequence Diagram Syntax</h3><p><strong>Messages:</strong></p><pre>Participant1 -> Participant2: Message text</pre><p><code>-></code> Solid arrow (request/call)</p><p><code>--></code> Dashed arrow (response/return)</p><p><strong>Self-messages:</strong></p><pre>Alice -> Alice: Think about it</pre><p><strong>Notes:</strong></p><pre>Note left of Actor: Text
Note right of Actor: Text
Note over Actor: Text
Note over Actor1, Actor2: Text</pre><p><strong>Colors:</strong></p><p>Add <code>[color]</code> at end of line:</p><pre>A -> B: Request [red]
A -> B: Request [line:red, text:blue]
Note over A: Info [#90EE90]
Note over A: Info [bg:pink, text:black]</pre><p>Message options: <code>line</code>, <code>text</code>, <code>number</code></p><p>Note options: <code>bg</code>, <code>text</code>, <code>border</code></p><p><strong>Example:</strong></p><pre>Client -> Server: HTTP Request [green]
Note right of Server: Validate [#ffe0b0]
Server -> Database: Query [blue]
Database --> Server: Results [purple]
Server --> Client: HTTP Response [green]</pre><p>Participants are automatically detected. Each arrow is numbered sequentially.</p></div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    }
    modal.classList.add('open');
}
function seqParseColors(text) {
    const colorMatch = text.match(/\s*\[([^\]]+)\]\s*$/);
    if (!colorMatch) return { text: text.trim(), colors: {} };
    const cleanText = text.substring(0, text.lastIndexOf('[')).trim();
    const colorStr = colorMatch[1].trim();
    const colors = {};
    if (colorStr.includes(':')) {
        colorStr.split(',').forEach(part => { const [key, value] = part.split(':').map(s => s.trim()); if (key && value) colors[key] = value; });
    } else { colors.primary = colorStr; }
    return { text: cleanText, colors };
}
function seqParseText(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const participants = [], items = [], participantSet = new Set();
    let messageCount = 0;
    lines.forEach(line => {
        const noteMatch = line.match(/^\s*note\s+(left\s+of|right\s+of|over)\s+([^:]+?)\s*:\s*(.*)$/i);
        if (noteMatch) {
            const position = noteMatch[1].toLowerCase().replace(/\s+/g, '');
            const actors = noteMatch[2].trim().split(',').map(a => a.trim()).filter(a => a);
            const { text: noteText, colors } = seqParseColors(noteMatch[3].trim());
            actors.forEach(actor => { if (!participantSet.has(actor)) { participantSet.add(actor); participants.push(actor); } });
            items.push({ type: 'note', position, actors, text: noteText, colors: { bg: colors.bg || colors.primary || null, text: colors.text || null, border: colors.border || colors.line || null } });
            return;
        }
        const match = line.match(/^\s*([^-]+?)\s*(-->|->)\s*([^:]+?)\s*:\s*(.*)$/);
        if (match) {
            const from = match[1].trim(), arrowType = match[2], to = match[3].trim();
            const { text: message, colors } = seqParseColors(match[4].trim());
            if (!participantSet.has(from)) { participantSet.add(from); participants.push(from); }
            if (!participantSet.has(to)) { participantSet.add(to); participants.push(to); }
            messageCount++;
            items.push({ type: 'message', from, to, message, dashed: arrowType === '-->', number: messageCount, colors: { line: colors.line || colors.primary || null, text: colors.text || null, number: colors.number || colors.bg || null } });
        }
    });
    return { participants, items };
}
function seqRenderDiagram(widget, toolId, containerSelector) {
    const data = seqGetData(toolId);
    const container = widget.querySelector(containerSelector || '.seq-diagram');
    if (!container) return;
    if (!data.text.trim()) { container.innerHTML = '<div class="seq-error-message">Enter sequence diagram notation to see the diagram</div>'; return; }
    const { participants, items } = seqParseText(data.text);
    if (participants.length === 0) { container.innerHTML = '<div class="seq-error-message">No valid entries found. Use syntax: Actor -> Actor: Message</div>'; return; }
    const boxWidth = 100, boxHeight = 36, boxPadding = 40, itemSpacing = 50, topMargin = 20, bottomMargin = 50, numberRadius = 10, noteWidth = 120, noteHeight = 30, notePadding = 8;
    const totalWidth = participants.length * (boxWidth + boxPadding) - boxPadding + 40;
    const totalHeight = topMargin + boxHeight + (items.length * itemSpacing) + boxHeight + bottomMargin;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">`;
    const participantX = {};
    participants.forEach((p, i) => { participantX[p] = 20 + i * (boxWidth + boxPadding) + boxWidth / 2; });
    participants.forEach(p => { const x = participantX[p], y1 = topMargin + boxHeight, y2 = totalHeight - bottomMargin - boxHeight; svg += `<line class="seq-lifeline" x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" />`; });
    participants.forEach(p => { const x = participantX[p] - boxWidth / 2, y = topMargin; svg += `<rect class="seq-participant-box" x="${x}" y="${y}" width="${boxWidth}" height="${boxHeight}" rx="4" /><text class="seq-participant-text" x="${participantX[p]}" y="${y + boxHeight / 2}">${escapeHtml(p)}</text>`; });
    participants.forEach(p => { const x = participantX[p] - boxWidth / 2, y = totalHeight - bottomMargin - boxHeight; svg += `<rect class="seq-participant-box" x="${x}" y="${y}" width="${boxWidth}" height="${boxHeight}" rx="4" /><text class="seq-participant-text" x="${participantX[p]}" y="${y + boxHeight / 2}">${escapeHtml(p)}</text>`; });
    items.forEach((item, i) => {
        const y = topMargin + boxHeight + (i + 1) * itemSpacing - itemSpacing / 2;
        if (item.type === 'note') {
            const actorX = participantX[item.actors[0]] || 0;
            const noteColors = item.colors || {};
            let boxStyle = '', textStyle = '';
            if (noteColors.bg) boxStyle += `fill:${noteColors.bg};`;
            if (noteColors.border) boxStyle += `stroke:${noteColors.border};`;
            if (noteColors.text) textStyle += `fill:${noteColors.text};`;
            let noteX, textAnchor = 'start';
            if (item.position === 'leftof') noteX = actorX - boxWidth / 2 - noteWidth - 10;
            else if (item.position === 'rightof') noteX = actorX + boxWidth / 2 + 10;
            else if (item.position === 'over') {
                if (item.actors.length > 1) { const actor2X = participantX[item.actors[1]] || actorX, minX = Math.min(actorX, actor2X), maxX = Math.max(actorX, actor2X); noteX = minX - noteWidth / 2; const spanWidth = maxX - minX + noteWidth; svg += `<rect class="seq-note-box" x="${noteX}" y="${y - noteHeight / 2}" width="${spanWidth}" height="${noteHeight}" rx="2"${boxStyle ? ` style="${boxStyle}"` : ''} /><text class="seq-note-text" x="${(minX + maxX) / 2}" y="${y}" text-anchor="middle" dominant-baseline="middle"${textStyle ? ` style="${textStyle}"` : ''}>${escapeHtml(item.text)}</text>`; return; }
                noteX = actorX - noteWidth / 2; textAnchor = 'middle';
            }
            svg += `<rect class="seq-note-box" x="${noteX}" y="${y - noteHeight / 2}" width="${noteWidth}" height="${noteHeight}" rx="2"${boxStyle ? ` style="${boxStyle}"` : ''} />`;
            const textX = item.position === 'over' ? actorX : noteX + notePadding;
            svg += `<text class="seq-note-text" x="${textX}" y="${y}" text-anchor="${textAnchor}" dominant-baseline="middle"${textStyle ? ` style="${textStyle}"` : ''}>${escapeHtml(item.text)}</text>`;
        } else if (item.type === 'message') {
            const fromX = participantX[item.from], toX = participantX[item.to], dashedClass = item.dashed ? ' dashed' : '';
            const msgColors = item.colors || {};
            let lineStyle = '', headStyle = '', labelStyle = '', numBgStyle = '';
            if (msgColors.line) { lineStyle = `stroke:${msgColors.line};`; headStyle = `fill:${msgColors.line};`; }
            if (msgColors.text) labelStyle = `fill:${msgColors.text};`;
            if (msgColors.number) numBgStyle = `fill:${msgColors.number};`;
            if (item.from === item.to) {
                const loopWidth = 30, loopHeight = 20;
                svg += `<path class="seq-self-arrow${dashedClass}" d="M ${fromX} ${y} L ${fromX + loopWidth} ${y} L ${fromX + loopWidth} ${y + loopHeight} L ${fromX + 8} ${y + loopHeight}"${lineStyle ? ` style="${lineStyle}"` : ''} />`;
                svg += `<polygon class="seq-arrow-head" points="${fromX + 8},${y + loopHeight - 4} ${fromX + 8},${y + loopHeight + 4} ${fromX},${y + loopHeight}"${headStyle ? ` style="${headStyle}"` : ''} />`;
                svg += `<text class="seq-arrow-label" x="${fromX + loopWidth + 5}" y="${y + loopHeight / 2}"${labelStyle ? ` style="${labelStyle}"` : ''}>${escapeHtml(item.message)}</text>`;
                const numBgClass = item.dashed ? 'seq-dashed-number-bg' : 'seq-arrow-number-bg';
                svg += `<circle class="${numBgClass}" cx="${fromX + loopWidth}" cy="${y}" r="${numberRadius}"${numBgStyle ? ` style="${numBgStyle}"` : ''} /><text class="seq-arrow-number" x="${fromX + loopWidth}" y="${y}" text-anchor="middle" dominant-baseline="middle">${item.number}</text>`;
            } else {
                const direction = toX > fromX ? 1 : -1, arrowLength = 8;
                svg += `<line class="seq-arrow${dashedClass}" x1="${fromX}" y1="${y}" x2="${toX - direction * arrowLength}" y2="${y}"${lineStyle ? ` style="${lineStyle}"` : ''} />`;
                svg += `<polygon class="seq-arrow-head" points="${toX},${y} ${toX - direction * arrowLength},${y - 4} ${toX - direction * arrowLength},${y + 4}"${headStyle ? ` style="${headStyle}"` : ''} />`;
                svg += `<text class="seq-arrow-label" x="${(fromX + toX) / 2}" y="${y - 8}" text-anchor="middle"${labelStyle ? ` style="${labelStyle}"` : ''}>${escapeHtml(item.message)}</text>`;
                const numX = fromX + direction * 15, numBgClass = item.dashed ? 'seq-dashed-number-bg' : 'seq-arrow-number-bg';
                svg += `<circle class="${numBgClass}" cx="${numX}" cy="${y}" r="${numberRadius}"${numBgStyle ? ` style="${numBgStyle}"` : ''} /><text class="seq-arrow-number" x="${numX}" y="${y}" text-anchor="middle" dominant-baseline="middle">${item.number}</text>`;
            }
        }
    });
    svg += '</svg>';
    container.innerHTML = svg;
}

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

    const remaining = new Set(allIds.filter(id => !hidden.has(id)));
    if (remaining.size === 0) return remaining;

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

    // Infer implied parent-child from spouse
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

    // Group children by their parent pair
    const childPairKey = {};
    const pairChildren = {};
    const pairParents = {};
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

    const xPos = {};
    const sortedGens = Object.keys(genGroups).map(Number).sort((a, b) => a - b);

    // First pass: assign initial x positions
    for (const g of sortedGens) {
        const group = genGroups[g];
        if (g === 0 || Object.keys(xPos).length === 0) {
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
            const pairAvgX = {};
            for (const item of withParentX) {
                if (!pairAvgX[item.pairKey]) pairAvgX[item.pairKey] = { sum: 0, count: 0 };
                pairAvgX[item.pairKey].sum += item.parentX;
                pairAvgX[item.pairKey].count++;
            }
            for (const k of Object.keys(pairAvgX)) {
                pairAvgX[k] = pairAvgX[k].count > 0 ? pairAvgX[k].sum / pairAvgX[k].count : Infinity;
            }
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
            withParentX.sort((a, b) => {
                const pa = pairAvgX[a.pairKey] != null ? pairAvgX[a.pairKey] : Infinity;
                const pb = pairAvgX[b.pairKey] != null ? pairAvgX[b.pairKey] : Infinity;
                if (pa !== pb) return pa - pb;
                if (a.pairKey !== b.pairKey) return a.pairKey < b.pairKey ? -1 : 1;
                const aCross = hasCrossFamilySpouse(a.pid) ? 1 : 0;
                const bCross = hasCrossFamilySpouse(b.pid) ? 1 : 0;
                if (aCross !== bCross) return aCross - bCross;
                if (!isFinite(a.parentX) && !isFinite(b.parentX)) return 0;
                return a.parentX - b.parentX;
            });

            const deferToSpouse = new Set();
            for (const item of withParentX) {
                if (spouseOf[item.pid]) {
                    for (const sid of spouseOf[item.pid]) {
                        if (gen[sid] === gen[item.pid] && !deferToSpouse.has(item.pid)) {
                            const myParents = (parentsOf[item.pid] || []).length;
                            const theirParents = (parentsOf[sid] || []).length;
                            if (myParents === 0 && theirParents > 0) {
                                deferToSpouse.add(item.pid);
                            } else if (myParents === 0 && theirParents === 0) {
                                const myChildren = (childrenOf[item.pid] || []).length;
                                const theirChildren = (childrenOf[sid] || []).length;
                                if (myChildren < theirChildren) {
                                    deferToSpouse.add(item.pid);
                                } else if (myChildren === theirChildren && item.pid > sid) {
                                    deferToSpouse.add(item.pid);
                                }
                            }
                        }
                    }
                }
            }

            let curX = 0;
            const added = new Set();
            for (const item of withParentX) {
                if (added.has(item.pid)) continue;
                if (deferToSpouse.has(item.pid)) continue;
                xPos[item.pid] = curX;
                added.add(item.pid);
                let spousePlaced = false;
                if (spouseOf[item.pid]) {
                    for (const sid of spouseOf[item.pid]) {
                        if (gen[sid] === gen[item.pid] && !added.has(sid)) {
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
            const pairsDone = new Set();
            for (const pid of group) {
                const children = childrenOf[pid] || [];
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

        // Position children under their parents
        for (const g of sortedGens) {
            if (g === sortedGens[0]) continue;
            const group = genGroups[g];

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

            for (const unit of cuUnits) {
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

        // Fix overlaps within each generation
        for (const g of sortedGens) {
            const group = genGroups[g];
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
                    xPos[sid] = xPos[pid] + FTREE_NODE_W + FTREE_SPOUSE_GAP;
                    units.push({ members: [pid, sid], x: xPos[pid] });
                } else {
                    units.push({ members: [pid], x: xPos[pid] });
                }
            }
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
            for (let i = 1; i < units.length; i++) {
                const prev = units[i - 1];
                const cur = units[i];
                const prevWidth = prev.members.length === 2
                    ? FTREE_NODE_W * 2 + FTREE_SPOUSE_GAP
                    : FTREE_NODE_W;
                const prevPK = childPairKey[prev.members[0]] || '';
                const curPK = childPairKey[cur.members[0]] || '';
                const diffAsChildren = prevPK && curPK && prevPK !== curPK;
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
    const extentsByGen = {};
    for (const ext of pairExtents) {
        if (!extentsByGen[ext.gen]) extentsByGen[ext.gen] = [];
        extentsByGen[ext.gen].push(ext);
    }
    const CONN_Y_STEP = 12;
    const pairColorIndex = {};
    let globalColorIdx = 0;
    for (const bars of Object.values(extentsByGen)) {
        bars.sort((a, b) => a.left - b.left);
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

        let anchorX;
        if (validParents.length >= 2) {
            anchorX = (nodes[validParents[0]].x + FTREE_NODE_W / 2 + nodes[validParents[1]].x + FTREE_NODE_W / 2) / 2;
        } else {
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

        const midYOff = pairMidYOffset[pairKey] || 0;
        const midY = anchorY + FTREE_V_GAP / 2 + midYOff;
        const ci = pairColorIndex[pairKey] != null ? pairColorIndex[pairKey] : -1;

        connectors.push({ type: 'v', x: anchorX, y: anchorY, h: midY - anchorY, ci });

        if (validChildren.length === 1) {
            const childNode = nodes[validChildren[0]];
            const childCx = childNode.x + FTREE_NODE_W / 2;
            const childTop = childNode.y;
            if (Math.abs(anchorX - childCx) <= 1) {
                connectors.push({ type: 'v', x: childCx, y: midY, h: childTop - midY, ci });
            } else if (Math.abs(anchorX - childCx) <= FTREE_NODE_W) {
                connectors.push({ type: 'v', x: childCx, y: midY, h: childTop - midY, ci });
                const hx = Math.min(anchorX, childCx);
                connectors.push({ type: 'h', x: hx, y: midY, w: Math.abs(anchorX - childCx), ci });
            } else {
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
                connectors.push({ type: 'h', x: minCx, y: midY, w: maxCx - minCx, ci });
                for (const cid of validChildren) {
                    const childNode = nodes[cid];
                    const childCx = childNode.x + FTREE_NODE_W / 2;
                    const childTop = childNode.y;
                    connectors.push({ type: 'v', x: childCx, y: midY, h: childTop - midY, ci });
                }
            } else {
                const bridgeY = anchorY + FTREE_V_GAP * 0.35 + midYOff;
                const barY = anchorY + FTREE_V_GAP * 0.65 + midYOff;

                connectors[connectors.length - 1] = { type: 'v', x: anchorX, y: anchorY, h: bridgeY - anchorY, ci };

                const bridgeTarget = anchorX < minCx ? minCx : maxCx;
                const bLeft = Math.min(anchorX, bridgeTarget);
                const bRight = Math.max(anchorX, bridgeTarget);
                connectors.push({ type: 'h', x: bLeft, y: bridgeY, w: bRight - bLeft, ci });
                connectors.push({ type: 'v', x: bridgeTarget, y: bridgeY, h: barY - bridgeY, ci });
                connectors.push({ type: 'h', x: minCx, y: barY, w: maxCx - minCx, ci });

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

        let toggles = '';
        const hasParents = (parentsOf[pid] || []).length > 0;
        const hasChildren = (childrenOf[pid] || []).length > 0;
        if (hasParents) {
            const isCollapsed = collParents.has(pid);
            const hiddenCount = isCollapsed ? (parentsOf[pid] || []).filter(id => !visible.has(id)).length : 0;
            const label = isCollapsed && hiddenCount > 0 ? `\u25B2 ${hiddenCount}` : '\u25B2';
            toggles += `<div class="ftree-node-toggle ftree-node-toggle-parents${isCollapsed ? ' collapsed' : ''}" onclick="event.stopPropagation(); ftreeNodeToggleParents(this)">${label}</div>`;
        }
        if (hasChildren) {
            const isCollapsed = collChildren.has(pid);
            const hiddenCount = isCollapsed ? (childrenOf[pid] || []).filter(id => !visible.has(id)).length : 0;
            const label = isCollapsed && hiddenCount > 0 ? `\u25BC ${hiddenCount}` : '\u25BC';
            toggles += `<div class="ftree-node-toggle ftree-node-toggle-children${isCollapsed ? ' collapsed' : ''}" onclick="event.stopPropagation(); ftreeNodeToggleChildren(this)">${label}</div>`;
        }

        nodesHtml += `<div class="ftree-node${genderClass}${rootClass}" data-person-id="${pid}" style="left:${pos.x}px;top:${pos.y}px;width:${FTREE_NODE_W}px;${colorStyle}" onclick="ftreeNodeClick(event, this)">
<div class="ftree-node-name">${p.name}</div>${dates}${note}${toggles}</div>`;
    }
    nodesContainer.innerHTML = nodesHtml;

    // Render connectors as SVG
    const connColor = getComputedStyle(widget).getPropertyValue('--border-color').trim() || '#ccc';
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

    const children = ftreeGetChildrenOf(data, personId);
    const parents = ftreeGetParentsOf(data, personId);
    const collChildren = new Set(data.collapsedChildren || []);
    const collParents = new Set(data.collapsedParents || []);
    let toggleBtns = '';
    if (parents.length > 0) {
        const label = collParents.has(personId) ? `Show Parents (${parents.length})` : `Hide Parents (${parents.length})`;
        toggleBtns += `<button class="ftree-popup-btn" onclick="ftreeToggleParents(this.closest('.ftree-widget'), '${toolId}', '${personId}')">\u25B2 ${label}</button>`;
    }
    if (children.length > 0) {
        const label = collChildren.has(personId) ? `Show Children (${children.length})` : `Hide Children (${children.length})`;
        toggleBtns += `<button class="ftree-popup-btn" onclick="ftreeToggleChildren(this.closest('.ftree-widget'), '${toolId}', '${personId}')">\u25BC ${label}</button>`;
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

// Family Tree Form Editor

function ftreeToggleForm(btn) {
    const widget = btn.closest('.ftree-widget');
    const toolId = ftreeGetToolId(widget);
    if (!toolId) return;

    const viewport = widget.querySelector('.ftree-viewport');
    const formEditor = widget.querySelector('.ftree-form-editor');

    if (formEditor.style.display === 'block') {
        btn.classList.remove('active');
        viewport.style.display = '';
        formEditor.style.display = 'none';
        ftreeRender(widget, toolId);
        ftreeApplyTransform(widget);
    } else {
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

        const spouseId = ftreeGetSpouse(data, pid);
        const spouseName = spouseId && data.persons[spouseId] ? data.persons[spouseId].name : null;
        const parentIds = ftreeGetParentsOf(data, pid);
        const parentNames = parentIds.map(id => data.persons[id] ? data.persons[id].name : '?');
        const childIds = ftreeGetChildrenOf(data, pid);
        const childNames = childIds.map(id => data.persons[id] ? data.persons[id].name : '?');

        html += '<div class="ftree-form-card' + (isRoot ? ' root' : '') + '">';

        html += '<div class="ftree-form-header"><span class="ftree-form-icon">' + genderIcon + '</span>';
        if (isRoot) html += ' <span class="ftree-form-badge">ROOT</span>';
        html += '</div>';

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

        html += '<div class="ftree-form-fields">';
        html += '<input type="text" data-field="note" value="' + esc(p.note) + '" placeholder="Note" oninput="ftreeFormEditField(this,\'' + pid + '\',\'note\')">';
        html += '</div>';

        const rels = [];
        if (spouseName) rels.push('Spouse: <span>' + esc(spouseName) + '</span>');
        if (parentNames.length > 0) rels.push('Parents: <span>' + parentNames.map(esc).join(' &amp; ') + '</span>');
        if (childNames.length > 0) rels.push('Children: <span>' + childNames.map(esc).join(', ') + '</span>');
        if (rels.length > 0) {
            html += '<div class="ftree-form-rels">' + rels.join(' \u00B7 ') + '</div>';
        }

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

// ============================================================
// Mermaid Diagram Functions
// ============================================================

function mermDiagGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function mermDiagGetWidget(el) {
    return el.closest('.mermaid-diag-widget');
}

function mermDiagLoadLib(callback) {
    if (window.mermaid) { callback(); return; }
    if (mermaidDiagLoaded) {
        var poll = setInterval(function() {
            if (window.mermaid) { clearInterval(poll); callback(); }
        }, 100);
        return;
    }
    mermaidDiagLoaded = true;
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.onload = function() {
        window.mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
        callback();
    };
    document.head.appendChild(script);
}

function mermDiagSaveData(toolId, code) {
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].mermaidCode = code;
    saveToolCustomizations(customizations);
}

function mermDiagLoadData(toolId) {
    var customizations = loadToolCustomizations();
    var saved = customizations[toolId] && customizations[toolId].mermaidCode;
    return saved || '';
}

function mermDiagRender(widget) {
    var textarea = widget.querySelector('.mermaid-diag-editor textarea');
    var preview = widget.querySelector('.mermaid-diag-preview');
    var statusEl = widget.querySelector('.mermaid-diag-status');
    if (!textarea || !preview) return;

    var code = textarea.value.trim();
    var toolId = mermDiagGetToolId(widget);
    if (toolId) mermDiagSaveData(toolId, textarea.value);

    if (!code) {
        preview.innerHTML = '<span style="color:var(--text-muted);font-size:13px;">Enter Mermaid syntax on the left</span>';
        if (statusEl) statusEl.textContent = '';
        return;
    }

    mermDiagLoadLib(function() {
        mermaidDiagRenderCounter++;
        var id = 'mermaid-diag-svg-' + mermaidDiagRenderCounter;
        try {
            window.mermaid.render(id, code).then(function(result) {
                preview.innerHTML = result.svg;
                if (statusEl) statusEl.textContent = 'Rendered successfully';
                statusEl.style.color = '#27ae60';
            }).catch(function(err) {
                preview.innerHTML = '<div class="mermaid-diag-error">' + (err.message || err) + '</div>';
                if (statusEl) { statusEl.textContent = 'Syntax error'; statusEl.style.color = '#e74c3c'; }
                var badEl = document.getElementById('d' + id);
                if (badEl) badEl.remove();
            });
        } catch (err) {
            preview.innerHTML = '<div class="mermaid-diag-error">' + (err.message || err) + '</div>';
            if (statusEl) { statusEl.textContent = 'Syntax error'; statusEl.style.color = '#e74c3c'; }
        }
    });
}

function mermDiagOnInput(textarea) {
    var widget = mermDiagGetWidget(textarea);
    if (!widget) return;
    if (widget._mermDebounce) clearTimeout(widget._mermDebounce);
    widget._mermDebounce = setTimeout(function() {
        mermDiagRender(widget);
    }, 500);
}

function mermDiagInsertTemplate(sel) {
    var widget = mermDiagGetWidget(sel);
    if (!widget) return;
    var val = sel.value;
    sel.value = '';
    if (!val) return;

    var templates = {
        flowchart: 'flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action 1]\n    B -->|No| D[Action 2]\n    C --> E[End]\n    D --> E',
        sequence: 'sequenceDiagram\n    participant A as Alice\n    participant B as Bob\n    A->>B: Hello Bob\n    B->>A: Hi Alice\n    A->>B: How are you?\n    B-->>A: Great!',
        classDiagram: 'classDiagram\n    class Animal {\n        +String name\n        +int age\n        +makeSound()\n    }\n    class Dog {\n        +fetch()\n    }\n    class Cat {\n        +purr()\n    }\n    Animal <|-- Dog\n    Animal <|-- Cat',
        stateDiagram: 'stateDiagram-v2\n    [*] --> Idle\n    Idle --> Processing: Start\n    Processing --> Success: Done\n    Processing --> Error: Fail\n    Success --> [*]\n    Error --> Idle: Retry',
        erDiagram: 'erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE_ITEM : contains\n    PRODUCT ||--o{ LINE_ITEM : "is in"',
        gantt: 'gantt\n    title Project Plan\n    dateFormat YYYY-MM-DD\n    section Phase 1\n        Task A: a1, 2024-01-01, 7d\n        Task B: a2, after a1, 5d\n    section Phase 2\n        Task C: a3, after a2, 6d\n        Task D: a4, after a3, 4d',
        pie: 'pie title Browser Usage\n    "Chrome" : 65\n    "Firefox" : 15\n    "Safari" : 12\n    "Other" : 8',
        gitgraph: 'gitGraph\n    commit\n    commit\n    branch develop\n    checkout develop\n    commit\n    commit\n    checkout main\n    merge develop\n    commit'
    };

    var textarea = widget.querySelector('.mermaid-diag-editor textarea');
    if (textarea && templates[val]) {
        textarea.value = templates[val];
        mermDiagRender(widget);
    }
}

function mermDiagExportSvg(btn) {
    var widget = mermDiagGetWidget(btn);
    if (!widget) return;
    var preview = widget.querySelector('.mermaid-diag-preview');
    var svg = preview.querySelector('svg');
    if (!svg) return;

    var svgData = new XMLSerializer().serializeToString(svg);
    var blob = new Blob([svgData], { type: 'image/svg+xml' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
}

function mermDiagExportPng(btn) {
    var widget = mermDiagGetWidget(btn);
    if (!widget) return;
    var preview = widget.querySelector('.mermaid-diag-preview');
    var svg = preview.querySelector('svg');
    if (!svg) return;

    var svgData = new XMLSerializer().serializeToString(svg);
    var canvas = document.createElement('canvas');
    var svgRect = svg.getBoundingClientRect();
    var scale = 2;
    canvas.width = svgRect.width * scale;
    canvas.height = svgRect.height * scale;
    var ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    var img = new Image();
    img.onload = function() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, svgRect.width, svgRect.height);
        var a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'diagram.png';
        a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

function mermDiagInit() {
    document.querySelectorAll('.mermaid-diag-widget').forEach(function(widget) {
        var tool = widget.closest('.tool');
        if (!tool) return;
        var toolId = tool.getAttribute('data-tool');
        if (!toolId) return;

        var textarea = widget.querySelector('.mermaid-diag-editor textarea');
        if (!textarea) return;

        var saved = mermDiagLoadData(toolId);
        if (saved) {
            textarea.value = saved;
        } else {
            textarea.value = 'flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Do something]\n    B -->|No| D[Do something else]\n    C --> E[End]\n    D --> E';
        }

        mermDiagRender(widget);
    });
}

// ============================================================
// Diagram Functions
// ============================================================

function dgmGetToolId(el) {
    return el.closest('.tool').getAttribute('data-tool');
}

function dgmNewState() {
    return {
        tool: 'select',
        shapes: [],
        nextId: 1,
        selectedIds: [],
        viewX: 0, viewY: 0, zoom: 1,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        lineDash: 'solid',
        textColor: '#000000',
        textSize: 14,
        textAlign: 'center',
        textVAlign: 'middle',
        textRotation: 0,
        dragging: false,
        dragType: null,
        dragStartX: 0, dragStartY: 0,
        dragOffsetX: 0, dragOffsetY: 0,
        dragHandle: null,
        ghostShape: null,
        undoStack: [],
        canvas: null,
        ctx: null,
        widget: null
    };
}

function dgmGetState(toolId) {
    if (dgmState[toolId]) return dgmState[toolId];
    var s = dgmNewState();
    var customizations = loadToolCustomizations();
    var data = customizations[toolId] && customizations[toolId].diagramData;
    if (data) {
        // Migration: if no tabs array, wrap existing data into single tab
        if (!data.tabs) {
            data = {
                tabs: [{ id: 0, name: 'Tab 1', shapes: data.shapes || [], nextId: data.nextId || 1, viewX: data.viewX || 0, viewY: data.viewY || 0, zoom: data.zoom || 1 }],
                activeTabId: 0,
                nextTabId: 1,
                fill: data.fill || '#ffffff',
                stroke: data.stroke || '#000000',
                strokeWidth: data.strokeWidth || 2
            };
        }
        s.tabs = data.tabs;
        s.activeTabId = data.activeTabId || 0;
        s.nextTabId = data.nextTabId || 1;
        s.fill = data.fill || '#ffffff';
        s.stroke = data.stroke || '#000000';
        s.strokeWidth = data.strokeWidth || 2;
        // Load active tab data into state
        var tab = null;
        for (var i = 0; i < s.tabs.length; i++) {
            if (s.tabs[i].id === s.activeTabId) { tab = s.tabs[i]; break; }
        }
        if (!tab) tab = s.tabs[0];
        if (tab) {
            s.activeTabId = tab.id;
            s.shapes = tab.shapes || [];
            s.nextId = tab.nextId || 1;
            s.viewX = tab.viewX || 0;
            s.viewY = tab.viewY || 0;
            s.zoom = tab.zoom || 1;
        }
    } else {
        s.tabs = [{ id: 0, name: 'Tab 1', shapes: [], nextId: 1, viewX: 0, viewY: 0, zoom: 1 }];
        s.activeTabId = 0;
        s.nextTabId = 1;
    }
    dgmState[toolId] = s;
    return s;
}

function dgmSaveData(toolId) {
    var s = dgmState[toolId];
    if (!s) return;
    // Write current canvas state back into active tab
    for (var i = 0; i < s.tabs.length; i++) {
        if (s.tabs[i].id === s.activeTabId) {
            s.tabs[i].shapes = s.shapes;
            s.tabs[i].nextId = s.nextId;
            s.tabs[i].viewX = s.viewX;
            s.tabs[i].viewY = s.viewY;
            s.tabs[i].zoom = s.zoom;
            break;
        }
    }
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].diagramData = {
        tabs: s.tabs,
        activeTabId: s.activeTabId,
        nextTabId: s.nextTabId,
        fill: s.fill,
        stroke: s.stroke,
        strokeWidth: s.strokeWidth
    };
    saveToolCustomizations(customizations);
}

function dgmPushUndo(state) {
    state.undoStack.push(JSON.parse(JSON.stringify(state.shapes)));
    if (state.undoStack.length > 50) state.undoStack.shift();
}

function dgmScreenToWorld(state, sx, sy) {
    return { x: (sx - state.viewX) / state.zoom, y: (sy - state.viewY) / state.zoom };
}

function dgmWorldToScreen(state, wx, wy) {
    return { x: wx * state.zoom + state.viewX, y: wy * state.zoom + state.viewY };
}

function dgmUnrotatePoint(px, py, shape) {
    var rot = shape.rotation || 0;
    if (!rot) return { x: px, y: py };
    var cx = shape.x + shape.w / 2, cy = shape.y + shape.h / 2;
    var a = -rot * Math.PI / 180;
    var dx = px - cx, dy = py - cy;
    return { x: cx + dx * Math.cos(a) - dy * Math.sin(a), y: cy + dx * Math.sin(a) + dy * Math.cos(a) };
}

function dgmRotatePoint(px, py, cx, cy, angleDeg) {
    var a = angleDeg * Math.PI / 180;
    var dx = px - cx, dy = py - cy;
    return { x: cx + dx * Math.cos(a) - dy * Math.sin(a), y: cy + dx * Math.sin(a) + dy * Math.cos(a) };
}

function dgmPointInRect(px, py, shape) {
    var p = dgmUnrotatePoint(px, py, shape);
    return p.x >= shape.x && p.x <= shape.x + shape.w && p.y >= shape.y && p.y <= shape.y + shape.h;
}

function dgmPointInEllipse(px, py, shape) {
    var p = dgmUnrotatePoint(px, py, shape);
    var cx = shape.x + shape.w / 2, cy = shape.y + shape.h / 2;
    var rx = shape.w / 2, ry = shape.h / 2;
    if (rx === 0 || ry === 0) return false;
    var dx = (p.x - cx) / rx, dy = (p.y - cy) / ry;
    return dx * dx + dy * dy <= 1;
}

function dgmPointInDiamond(px, py, shape) {
    var p = dgmUnrotatePoint(px, py, shape);
    var cx = shape.x + shape.w / 2, cy = shape.y + shape.h / 2;
    var hw = shape.w / 2, hh = shape.h / 2;
    if (hw === 0 || hh === 0) return false;
    return Math.abs(p.x - cx) / hw + Math.abs(p.y - cy) / hh <= 1;
}

function dgmPointNearLine(px, py, shape, threshold) {
    var x1 = shape.x1, y1 = shape.y1, x2 = shape.x2, y2 = shape.y2;
    var dx = x2 - x1, dy = y2 - y1;
    var len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - x1, py - y1) <= threshold;
    var t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
    var projX = x1 + t * dx, projY = y1 + t * dy;
    return Math.hypot(px - projX, py - projY) <= threshold;
}

function dgmGetCurvePoints(shape) {
    var pts = [{ x: shape.x1, y: shape.y1 }];
    var bp = shape.bendPoints || [];
    for (var i = 0; i < bp.length; i++) pts.push({ x: bp[i].x, y: bp[i].y });
    pts.push({ x: shape.x2, y: shape.y2 });
    return pts;
}

function dgmDrawCurvePath(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 2) {
        ctx.lineTo(pts[1].x, pts[1].y);
    } else {
        for (var i = 0; i < pts.length - 1; i++) {
            var p0 = pts[Math.max(0, i - 1)];
            var p1 = pts[i];
            var p2 = pts[i + 1];
            var p3 = pts[Math.min(pts.length - 1, i + 2)];
            var cp1x = p1.x + (p2.x - p0.x) / 6;
            var cp1y = p1.y + (p2.y - p0.y) / 6;
            var cp2x = p2.x - (p3.x - p1.x) / 6;
            var cp2y = p2.y - (p3.y - p1.y) / 6;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
    }
}

function dgmEvalCurveAt(pts, segIndex, t) {
    if (pts.length === 2) {
        return { x: pts[0].x + (pts[1].x - pts[0].x) * t, y: pts[0].y + (pts[1].y - pts[0].y) * t };
    }
    var i = segIndex;
    var p0 = pts[Math.max(0, i - 1)];
    var p1 = pts[i];
    var p2 = pts[i + 1];
    var p3 = pts[Math.min(pts.length - 1, i + 2)];
    var cp1x = p1.x + (p2.x - p0.x) / 6;
    var cp1y = p1.y + (p2.y - p0.y) / 6;
    var cp2x = p2.x - (p3.x - p1.x) / 6;
    var cp2y = p2.y - (p3.y - p1.y) / 6;
    var u = 1 - t;
    return {
        x: u * u * u * p1.x + 3 * u * u * t * cp1x + 3 * u * t * t * cp2x + t * t * t * p2.x,
        y: u * u * u * p1.y + 3 * u * u * t * cp1y + 3 * u * t * t * cp2y + t * t * t * p2.y
    };
}

function dgmCurveTangentAt(pts, segIndex, t) {
    var i = segIndex;
    var p0 = pts[Math.max(0, i - 1)];
    var p1 = pts[i];
    var p2 = pts[i + 1];
    var p3 = pts[Math.min(pts.length - 1, i + 2)];
    var cp1x = p1.x + (p2.x - p0.x) / 6;
    var cp1y = p1.y + (p2.y - p0.y) / 6;
    var cp2x = p2.x - (p3.x - p1.x) / 6;
    var cp2y = p2.y - (p3.y - p1.y) / 6;
    var u = 1 - t;
    return {
        x: 3 * u * u * (cp1x - p1.x) + 6 * u * t * (cp2x - cp1x) + 3 * t * t * (p2.x - cp2x),
        y: 3 * u * u * (cp1y - p1.y) + 6 * u * t * (cp2y - cp1y) + 3 * t * t * (p2.y - cp2y)
    };
}

function dgmGetCurveMidHandles(shape) {
    var pts = dgmGetCurvePoints(shape);
    var handles = [];
    for (var i = 0; i < pts.length - 1; i++) {
        var mid = dgmEvalCurveAt(pts, i, 0.5);
        handles.push({ x: mid.x, y: mid.y, segIndex: i });
    }
    return handles;
}

function dgmHitCurveMidHandle(state, wx, wy) {
    if (state.selectedIds.length !== 1) return null;
    var sh = null;
    for (var i = 0; i < state.shapes.length; i++) {
        if (state.shapes[i].id === state.selectedIds[0]) { sh = state.shapes[i]; break; }
    }
    if (!sh || (sh.type !== 'line' && sh.type !== 'arrow')) return null;
    var handles = dgmGetCurveMidHandles(sh);
    var thr = 7 / state.zoom;
    for (var i = 0; i < handles.length; i++) {
        if (Math.abs(wx - handles[i].x) < thr && Math.abs(wy - handles[i].y) < thr) {
            return { shapeId: sh.id, segIndex: handles[i].segIndex };
        }
    }
    return null;
}

function dgmHitBendPoint(state, wx, wy) {
    if (state.selectedIds.length !== 1) return null;
    var sh = null;
    for (var i = 0; i < state.shapes.length; i++) {
        if (state.shapes[i].id === state.selectedIds[0]) { sh = state.shapes[i]; break; }
    }
    if (!sh || (sh.type !== 'line' && sh.type !== 'arrow') || !sh.bendPoints || sh.bendPoints.length === 0) return null;
    var thr = 7 / state.zoom;
    for (var i = 0; i < sh.bendPoints.length; i++) {
        if (Math.abs(wx - sh.bendPoints[i].x) < thr && Math.abs(wy - sh.bendPoints[i].y) < thr) {
            return { shapeId: sh.id, bendIndex: i };
        }
    }
    return null;
}

function dgmPointToSegmentDist(px, py, ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay;
    var len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - ax, py - ay);
    var t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function dgmClipLineByBox(x1, y1, x2, y2, bx1, by1, bx2, by2) {
    // Returns line segments outside the box
    var dx = x2 - x1, dy = y2 - y1;
    var tmin = 0, tmax = 1;
    var edges = [
        {p: -dx, q: x1 - bx1},
        {p: dx, q: bx2 - x1},
        {p: -dy, q: y1 - by1},
        {p: dy, q: by2 - y1}
    ];
    var t0 = 0, t1 = 1;
    for (var i = 0; i < 4; i++) {
        var p = edges[i].p, q = edges[i].q;
        if (Math.abs(p) < 1e-10) {
            if (q < 0) return [[x1, y1, x2, y2]]; // parallel outside
        } else {
            var t = q / p;
            if (p < 0) { if (t > t0) t0 = t; }
            else { if (t < t1) t1 = t; }
        }
    }
    if (t0 >= t1) return [[x1, y1, x2, y2]]; // no intersection
    var segs = [];
    if (t0 > 0) segs.push([x1, y1, x1 + t0 * dx, y1 + t0 * dy]);
    if (t1 < 1) segs.push([x1 + t1 * dx, y1 + t1 * dy, x2, y2]);
    return segs.length > 0 ? segs : [];
}

function dgmHitLineText(state, wx, wy) {
    // Returns the line/arrow shape if click is on its text label
    for (var i = state.shapes.length - 1; i >= 0; i--) {
        var sh = state.shapes[i];
        if ((sh.type === 'line' || sh.type === 'arrow') && sh.text) {
            var fontSize = sh.textSize || 14;
            var lines = sh.text.split('\n');
            var lineH = Math.round(fontSize * 1.25);
            var totalH = lines.length * lineH;
            var maxW = 0;
            var c = document.createElement('canvas').getContext('2d');
            c.font = fontSize + 'px sans-serif';
            for (var l = 0; l < lines.length; l++) {
                var tw = c.measureText(lines[l]).width;
                if (tw > maxW) maxW = tw;
            }
            var mx = (sh.x1 + sh.x2) / 2 + (sh.textOffX || 0);
            var my = (sh.y1 + sh.y2) / 2 + (sh.textOffY || 0);
            var pad = 4;
            if (wx >= mx - maxW / 2 - pad && wx <= mx + maxW / 2 + pad &&
                wy >= my - totalH / 2 - pad && wy <= my + totalH / 2 + pad) {
                return sh;
            }
        }
    }
    return null;
}

function dgmHitTest(state, wx, wy) {
    for (var i = state.shapes.length - 1; i >= 0; i--) {
        var sh = state.shapes[i];
        if (sh.type === 'line' || sh.type === 'arrow') {
            if (sh.bendPoints && sh.bendPoints.length > 0) {
                // Check proximity to curved path by sampling segments
                var cpts = dgmGetCurvePoints(sh);
                var thr = 6 / state.zoom;
                var hitCurve = false;
                for (var seg = 0; seg < cpts.length - 1 && !hitCurve; seg++) {
                    for (var st = 0; st < 10; st++) {
                        var a = dgmEvalCurveAt(cpts, seg, st / 10);
                        var b = dgmEvalCurveAt(cpts, seg, (st + 1) / 10);
                        if (dgmPointToSegmentDist(wx, wy, a.x, a.y, b.x, b.y) < thr) { hitCurve = true; break; }
                    }
                }
                if (hitCurve) return sh;
            } else if (dgmPointNearLine(wx, wy, sh, 6 / state.zoom)) return sh;
        } else if (sh.type === 'ellipse' || sh.type === 'clock' || sh.type === 'gear') {
            if (dgmPointInEllipse(wx, wy, sh)) return sh;
        } else if (sh.type === 'diamond') {
            if (dgmPointInDiamond(wx, wy, sh)) return sh;
        } else {
            if (dgmPointInRect(wx, wy, sh)) return sh;
        }
    }
    return null;
}

function dgmGetHandles(shape) {
    var x = shape.x, y = shape.y, w = shape.w, h = shape.h;
    return [
        { id: 'nw', x: x, y: y },
        { id: 'n',  x: x + w / 2, y: y },
        { id: 'ne', x: x + w, y: y },
        { id: 'e',  x: x + w, y: y + h / 2 },
        { id: 'se', x: x + w, y: y + h },
        { id: 's',  x: x + w / 2, y: y + h },
        { id: 'sw', x: x, y: y + h },
        { id: 'w',  x: x, y: y + h / 2 }
    ];
}

function dgmHitHandle(state, wx, wy) {
    if (state.selectedIds.length !== 1) return null;
    var selId = state.selectedIds[0];
    var sh = null;
    for (var i = 0; i < state.shapes.length; i++) {
        if (state.shapes[i].id === selId) { sh = state.shapes[i]; break; }
    }
    if (!sh || sh.type === 'line' || sh.type === 'arrow') return null;
    var p = dgmUnrotatePoint(wx, wy, sh);
    var handles = dgmGetHandles(sh);
    var threshold = 7 / state.zoom;
    for (var j = 0; j < handles.length; j++) {
        if (Math.abs(p.x - handles[j].x) <= threshold && Math.abs(p.y - handles[j].y) <= threshold) {
            return handles[j].id;
        }
    }
    return null;
}

function dgmHitRotHandle(state, wx, wy) {
    if (state.selectedIds.length !== 1) return false;
    var selId = state.selectedIds[0];
    var sh = null;
    for (var i = 0; i < state.shapes.length; i++) {
        if (state.shapes[i].id === selId) { sh = state.shapes[i]; break; }
    }
    if (!sh || sh.type === 'line' || sh.type === 'arrow') return false;
    var p = dgmUnrotatePoint(wx, wy, sh);
    var hx = sh.x + sh.w / 2, hy = sh.y - 25 / state.zoom;
    return Math.hypot(p.x - hx, p.y - hy) <= 8 / state.zoom;
}

function dgmHitLineHandle(state, wx, wy) {
    if (state.selectedIds.length !== 1) return null;
    var selId = state.selectedIds[0];
    var sh = null;
    for (var i = 0; i < state.shapes.length; i++) {
        if (state.shapes[i].id === selId) { sh = state.shapes[i]; break; }
    }
    if (!sh || (sh.type !== 'line' && sh.type !== 'arrow')) return null;
    var threshold = 7 / state.zoom;
    if (Math.abs(wx - sh.x1) <= threshold && Math.abs(wy - sh.y1) <= threshold) return 'start';
    if (Math.abs(wx - sh.x2) <= threshold && Math.abs(wy - sh.y2) <= threshold) return 'end';
    return null;
}

function dgmGetPorts(shape) {
    if (shape.type === 'line' || shape.type === 'arrow') return [];
    var ports;
    if (shape.type === 'diamond') {
        var cx = shape.x + shape.w / 2, cy = shape.y + shape.h / 2;
        ports = [
            { id: 'n', x: cx, y: shape.y },
            { id: 'e', x: shape.x + shape.w, y: cy },
            { id: 's', x: cx, y: shape.y + shape.h },
            { id: 'w', x: shape.x, y: cy }
        ];
    } else if (shape.type === 'ellipse') {
        var cx = shape.x + shape.w / 2, cy = shape.y + shape.h / 2;
        var rx = Math.abs(shape.w) / 2, ry = Math.abs(shape.h) / 2;
        ports = [
            { id: 'n', x: cx, y: cy - ry },
            { id: 'e', x: cx + rx, y: cy },
            { id: 's', x: cx, y: cy + ry },
            { id: 'w', x: cx - rx, y: cy }
        ];
    } else {
        ports = [
            { id: 'n', x: shape.x + shape.w / 2, y: shape.y },
            { id: 'e', x: shape.x + shape.w, y: shape.y + shape.h / 2 },
            { id: 's', x: shape.x + shape.w / 2, y: shape.y + shape.h },
            { id: 'w', x: shape.x, y: shape.y + shape.h / 2 }
        ];
    }
    var rot = shape.rotation || 0;
    if (rot) {
        var cx = shape.x + shape.w / 2, cy = shape.y + shape.h / 2;
        for (var i = 0; i < ports.length; i++) {
            var rp = dgmRotatePoint(ports[i].x, ports[i].y, cx, cy, rot);
            ports[i].x = rp.x; ports[i].y = rp.y;
        }
    }
    return ports;
}

function dgmFindSnapPort(state, wx, wy, excludeId) {
    var threshold = 15 / state.zoom;
    var best = null, bestDist = threshold;
    for (var i = 0; i < state.shapes.length; i++) {
        var sh = state.shapes[i];
        if (sh.id === excludeId) continue;
        var ports = dgmGetPorts(sh);
        for (var j = 0; j < ports.length; j++) {
            var d = Math.hypot(wx - ports[j].x, wy - ports[j].y);
            if (d < bestDist) {
                bestDist = d;
                best = { shapeId: sh.id, port: ports[j].id, x: ports[j].x, y: ports[j].y };
            }
        }
    }
    return best;
}

function dgmResolveConnections(state) {
    for (var i = 0; i < state.shapes.length; i++) {
        var sh = state.shapes[i];
        if (sh.type !== 'line' && sh.type !== 'arrow') continue;
        if (sh.startConn) {
            var target = null;
            for (var j = 0; j < state.shapes.length; j++) {
                if (state.shapes[j].id === sh.startConn.shapeId) { target = state.shapes[j]; break; }
            }
            if (target) {
                var ports = dgmGetPorts(target);
                for (var j = 0; j < ports.length; j++) {
                    if (ports[j].id === sh.startConn.port) {
                        sh.x1 = ports[j].x; sh.y1 = ports[j].y; break;
                    }
                }
            } else { sh.startConn = null; }
        }
        if (sh.endConn) {
            var target = null;
            for (var j = 0; j < state.shapes.length; j++) {
                if (state.shapes[j].id === sh.endConn.shapeId) { target = state.shapes[j]; break; }
            }
            if (target) {
                var ports = dgmGetPorts(target);
                for (var j = 0; j < ports.length; j++) {
                    if (ports[j].id === sh.endConn.port) {
                        sh.x2 = ports[j].x; sh.y2 = ports[j].y; break;
                    }
                }
            } else { sh.endConn = null; }
        }
    }
}

function dgmMouseDown(toolId, e) {
    var s = dgmState[toolId];
    if (!s || !s.canvas) return;
    e.preventDefault && e.preventDefault();
    dgmHideContextMenu(toolId);
    dgmFinishTextEdit(toolId);

    if (e.button === 2 || e.button === 1) {
        s.dragging = true;
        s.dragType = 'pan';
        s.dragStartX = e.clientX;
        s.dragStartY = e.clientY;
        s._origView = { x: s.viewX, y: s.viewY };
        return;
    }

    var rect = s.canvas.getBoundingClientRect();
    var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    var w = dgmScreenToWorld(s, sx, sy);

    if (s.tool === 'select') {
        if (dgmHitRotHandle(s, w.x, w.y) && s.selectedIds.length === 1) {
            var rsh = null;
            for (var i = 0; i < s.shapes.length; i++) {
                if (s.shapes[i].id === s.selectedIds[0]) { rsh = s.shapes[i]; break; }
            }
            if (rsh) {
                dgmPushUndo(s);
                s.dragging = true;
                s.dragType = 'rotate';
                var rcx = rsh.x + rsh.w / 2, rcy = rsh.y + rsh.h / 2;
                s._rotCenter = { x: rcx, y: rcy };
                s._rotStart = Math.atan2(w.y - rcy, w.x - rcx);
                s._rotOrig = rsh.rotation || 0;
                return;
            }
        }
        var handle = dgmHitHandle(s, w.x, w.y);
        if (handle && s.selectedIds.length === 1) {
            var sh = null;
            for (var i = 0; i < s.shapes.length; i++) {
                if (s.shapes[i].id === s.selectedIds[0]) { sh = s.shapes[i]; break; }
            }
            if (sh) {
                dgmPushUndo(s);
                s.dragging = true;
                s.dragType = 'resize';
                s.dragHandle = handle;
                s.dragStartX = w.x;
                s.dragStartY = w.y;
                s._origShape = { x: sh.x, y: sh.y, w: sh.w, h: sh.h };
                return;
            }
        }
        var lh = dgmHitLineHandle(s, w.x, w.y);
        if (lh && s.selectedIds.length === 1) {
            dgmPushUndo(s);
            s.dragging = true;
            s.dragType = 'line-handle';
            s.dragHandle = lh;
            return;
        }
        var bpHit = dgmHitBendPoint(s, w.x, w.y);
        if (bpHit) {
            dgmPushUndo(s);
            s.dragging = true;
            s.dragType = 'bend-point';
            s._bendShapeId = bpHit.shapeId;
            s._bendIndex = bpHit.bendIndex;
            dgmDraw(toolId);
            return;
        }
        var cmHit = dgmHitCurveMidHandle(s, w.x, w.y);
        if (cmHit) {
            var cmSh = null;
            for (var i = 0; i < s.shapes.length; i++) {
                if (s.shapes[i].id === cmHit.shapeId) { cmSh = s.shapes[i]; break; }
            }
            if (cmSh) {
                dgmPushUndo(s);
                if (!cmSh.bendPoints) cmSh.bendPoints = [];
                var cpts = dgmGetCurvePoints(cmSh);
                var mid = dgmEvalCurveAt(cpts, cmHit.segIndex, 0.5);
                cmSh.bendPoints.splice(cmHit.segIndex, 0, { x: mid.x, y: mid.y });
                s.dragging = true;
                s.dragType = 'bend-point';
                s._bendShapeId = cmSh.id;
                s._bendIndex = cmHit.segIndex;
                dgmDraw(toolId);
            }
            return;
        }
        var ltHit = dgmHitLineText(s, w.x, w.y);
        if (ltHit) {
            s.selectedIds = [ltHit.id];
            dgmPushUndo(s);
            s.dragging = true;
            s.dragType = 'line-text';
            s.dragStartX = w.x;
            s.dragStartY = w.y;
            s._origTextOff = { x: ltHit.textOffX || 0, y: ltHit.textOffY || 0 };
            s._lineTextId = ltHit.id;
            dgmDraw(toolId);
            return;
        }
        var hit = dgmHitTest(s, w.x, w.y);
        if (hit) {
            var alreadySelected = s.selectedIds.indexOf(hit.id) !== -1;
            if (e.shiftKey) {
                if (alreadySelected) {
                    s.selectedIds = s.selectedIds.filter(function(id) { return id !== hit.id; });
                } else {
                    s.selectedIds.push(hit.id);
                }
                dgmDraw(toolId);
                return;
            }
            if (!alreadySelected) {
                s.selectedIds = [hit.id];
            }
            dgmPushUndo(s);
            s.dragging = true;
            s.dragType = 'move';
            s.dragStartX = w.x;
            s.dragStartY = w.y;
            s._origShapes = {};
            for (var i = 0; i < s.shapes.length; i++) {
                if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) {
                    var ms = s.shapes[i];
                    if (ms.type === 'line' || ms.type === 'arrow') {
                        s._origShapes[ms.id] = { x1: ms.x1, y1: ms.y1, x2: ms.x2, y2: ms.y2 };
                    } else {
                        s._origShapes[ms.id] = { x: ms.x, y: ms.y };
                    }
                }
            }
            dgmDraw(toolId);
        } else {
            if (!e.shiftKey) s.selectedIds = [];
            s.dragging = true;
            s.dragType = 'select-rect';
            s._selectRectStart = { x: w.x, y: w.y };
            s._selectRectEnd = { x: w.x, y: w.y };
            dgmDraw(toolId);
        }
    }
}

function dgmMouseMove(toolId, e) {
    var s = dgmState[toolId];
    if (!s || !s.dragging || !s.canvas) return;
    var rect = s.canvas.getBoundingClientRect();
    var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    var w = dgmScreenToWorld(s, sx, sy);

    if (s.dragType === 'pan') {
        s.viewX = s._origView.x + (e.clientX - s.dragStartX);
        s.viewY = s._origView.y + (e.clientY - s.dragStartY);
    } else if (s.dragType === 'select-rect') {
        s._selectRectEnd = { x: w.x, y: w.y };
    } else if (s.dragType === 'move') {
        var dx = w.x - s.dragStartX, dy = w.y - s.dragStartY;
        for (var i = 0; i < s.shapes.length; i++) {
            var sh = s.shapes[i];
            var orig = s._origShapes && s._origShapes[sh.id];
            if (!orig) continue;
            if (sh.type === 'line' || sh.type === 'arrow') {
                sh.x1 = orig.x1 + dx; sh.y1 = orig.y1 + dy;
                sh.x2 = orig.x2 + dx; sh.y2 = orig.y2 + dy;
            } else {
                sh.x = orig.x + dx; sh.y = orig.y + dy;
            }
        }
    } else if (s.dragType === 'rotate') {
        var sh = null;
        if (s.selectedIds.length === 1) {
            for (var i = 0; i < s.shapes.length; i++) {
                if (s.shapes[i].id === s.selectedIds[0]) { sh = s.shapes[i]; break; }
            }
        }
        if (sh && s._rotCenter) {
            var angle = Math.atan2(w.y - s._rotCenter.y, w.x - s._rotCenter.x);
            var delta = (angle - s._rotStart) * 180 / Math.PI;
            var newRot = s._rotOrig + delta;
            if (e.shiftKey) newRot = Math.round(newRot / 15) * 15;
            sh.rotation = ((newRot % 360) + 360) % 360;
        }
    } else if (s.dragType === 'resize') {
        var sh = null;
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.length === 1 && s.shapes[i].id === s.selectedIds[0]) { sh = s.shapes[i]; break; }
        }
        if (sh) {
            var o = s._origShape;
            var rawDx = w.x - s.dragStartX, rawDy = w.y - s.dragStartY;
            var rot = (sh.rotation || 0) * Math.PI / 180;
            var dx = rawDx * Math.cos(-rot) - rawDy * Math.sin(-rot);
            var dy = rawDx * Math.sin(-rot) + rawDy * Math.cos(-rot);
            var h = s.dragHandle;
            var nx = o.x, ny = o.y, nw = o.w, nh = o.h;
            if (h === 'nw' || h === 'w' || h === 'sw') { nx = o.x + dx; nw = o.w - dx; }
            if (h === 'ne' || h === 'e' || h === 'se') { nw = o.w + dx; }
            if (h === 'nw' || h === 'n' || h === 'ne') { ny = o.y + dy; nh = o.h - dy; }
            if (h === 'sw' || h === 's' || h === 'se') { nh = o.h + dy; }
            if (nw < 0) { nx = nx + nw; nw = -nw; }
            if (nh < 0) { ny = ny + nh; nh = -nh; }
            sh.x = nx; sh.y = ny; sh.w = nw; sh.h = nh;
        }
    } else if (s.dragType === 'line-handle') {
        var sh = null;
        if (s.selectedIds.length === 1) {
            for (var i = 0; i < s.shapes.length; i++) {
                if (s.shapes[i].id === s.selectedIds[0]) { sh = s.shapes[i]; break; }
            }
        }
        if (sh) {
            var snap = dgmFindSnapPort(s, w.x, w.y, null);
            s._snapPort = snap;
            if (s.dragHandle === 'start') {
                sh.x1 = snap ? snap.x : w.x;
                sh.y1 = snap ? snap.y : w.y;
            } else {
                sh.x2 = snap ? snap.x : w.x;
                sh.y2 = snap ? snap.y : w.y;
            }
        }
    } else if (s.dragType === 'bend-point') {
        var sh = null;
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.shapes[i].id === s._bendShapeId) { sh = s.shapes[i]; break; }
        }
        if (sh && sh.bendPoints && sh.bendPoints[s._bendIndex]) {
            sh.bendPoints[s._bendIndex].x = w.x;
            sh.bendPoints[s._bendIndex].y = w.y;
        }
    } else if (s.dragType === 'line-text') {
        var dx = w.x - s.dragStartX, dy = w.y - s.dragStartY;
        var sh = null;
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.shapes[i].id === s._lineTextId) { sh = s.shapes[i]; break; }
        }
        if (sh) {
            sh.textOffX = s._origTextOff.x + dx;
            sh.textOffY = s._origTextOff.y + dy;
        }
    }
    dgmDraw(toolId);
}

function dgmMouseUp(toolId, e) {
    var s = dgmState[toolId];
    if (!s || !s.dragging) return;

    if (s.dragType === 'pan' && s._origView && e && e.button === 2) {
        var dx = (e.clientX || 0) - s.dragStartX;
        var dy = (e.clientY || 0) - s.dragStartY;
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
            s.viewX = s._origView.x;
            s.viewY = s._origView.y;
            s.dragging = false;
            s.dragType = null;
            s._origView = null;
            var rect = s.canvas.getBoundingClientRect();
            var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
            var w = dgmScreenToWorld(s, sx, sy);
            dgmShowContextMenu(toolId, e.clientX, e.clientY, w.x, w.y);
            dgmDraw(toolId);
            return;
        }
    }

    if (s.dragType === 'select-rect') {
        var rx = Math.min(s._selectRectStart.x, s._selectRectEnd.x);
        var ry = Math.min(s._selectRectStart.y, s._selectRectEnd.y);
        var rw = Math.abs(s._selectRectEnd.x - s._selectRectStart.x);
        var rh = Math.abs(s._selectRectEnd.y - s._selectRectStart.y);
        if (rw > 2 || rh > 2) {
            var hit = [];
            for (var i = 0; i < s.shapes.length; i++) {
                var sh = s.shapes[i];
                var bx, by, bx2, by2;
                if (sh.type === 'line' || sh.type === 'arrow') {
                    bx = Math.min(sh.x1, sh.x2); by = Math.min(sh.y1, sh.y2);
                    bx2 = Math.max(sh.x1, sh.x2); by2 = Math.max(sh.y1, sh.y2);
                } else {
                    bx = sh.x; by = sh.y; bx2 = sh.x + sh.w; by2 = sh.y + sh.h;
                }
                if (bx2 >= rx && bx <= rx + rw && by2 >= ry && by <= ry + rh) {
                    hit.push(sh.id);
                }
            }
            if (e && e.shiftKey) {
                for (var i = 0; i < hit.length; i++) {
                    if (s.selectedIds.indexOf(hit[i]) === -1) s.selectedIds.push(hit[i]);
                }
            } else {
                s.selectedIds = hit;
            }
        }
        s._selectRectStart = null;
        s._selectRectEnd = null;
    } else if (s.dragType === 'line-handle') {
        var sh = null;
        if (s.selectedIds.length === 1) {
            for (var i = 0; i < s.shapes.length; i++) {
                if (s.shapes[i].id === s.selectedIds[0]) { sh = s.shapes[i]; break; }
            }
        }
        if (sh) {
            if (s.dragHandle === 'start') {
                sh.startConn = s._snapPort ? { shapeId: s._snapPort.shapeId, port: s._snapPort.port } : null;
            } else {
                sh.endConn = s._snapPort ? { shapeId: s._snapPort.shapeId, port: s._snapPort.port } : null;
            }
        }
        s._snapPort = null;
    } else if (s.dragType === 'bend-point') {
        // Remove collinear bend points (cascading)
        var sh = null;
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.shapes[i].id === s._bendShapeId) { sh = s.shapes[i]; break; }
        }
        if (sh && sh.bendPoints) {
            var threshold = 5 / s.zoom;
            var changed = true;
            while (changed) {
                changed = false;
                var allPts = dgmGetCurvePoints(sh);
                for (var bi = 0; bi < sh.bendPoints.length; bi++) {
                    var prev = bi === 0 ? { x: sh.x1, y: sh.y1 } : sh.bendPoints[bi - 1];
                    var next = bi === sh.bendPoints.length - 1 ? { x: sh.x2, y: sh.y2 } : sh.bendPoints[bi + 1];
                    var bp = sh.bendPoints[bi];
                    var dist = dgmPointToSegmentDist(bp.x, bp.y, prev.x, prev.y, next.x, next.y);
                    if (dist < threshold) {
                        sh.bendPoints.splice(bi, 1);
                        changed = true;
                        break;
                    }
                }
            }
        }
    }

    s.dragging = false;
    s.dragType = null;
    s.dragHandle = null;
    s._origShape = null;
    s._origShapes = null;
    s._origView = null;
    dgmSaveData(toolId);
    dgmDraw(toolId);
}

function dgmWheel(toolId, e) {
    var s = dgmState[toolId];
    if (!s || !s.canvas) return;
    e.preventDefault();
    var rect = s.canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    var oldZoom = s.zoom;
    var factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    var newZoom = Math.max(0.1, Math.min(5, oldZoom * factor));
    s.viewX = mx - (mx - s.viewX) * (newZoom / oldZoom);
    s.viewY = my - (my - s.viewY) * (newZoom / oldZoom);
    s.zoom = newZoom;
    dgmSaveData(toolId);
    dgmDraw(toolId);
}

function dgmDblClick(toolId, e) {
    var s = dgmState[toolId];
    if (!s || !s.canvas) return;
    var rect = s.canvas.getBoundingClientRect();
    var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    var w = dgmScreenToWorld(s, sx, sy);
    var hit = dgmHitTest(s, w.x, w.y);
    if (hit) {
        s.selectedIds = [hit.id];
        dgmDraw(toolId);
        dgmStartTextEdit(toolId, hit.id);
    }
}

function dgmHover(toolId, e) {
    var s = dgmState[toolId];
    if (!s || !s.canvas || s.dragging) return;
    if (s.tool === 'line' || s.tool === 'arrow') {
        var rect = s.canvas.getBoundingClientRect();
        var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
        var w = dgmScreenToWorld(s, sx, sy);
        var snap = dgmFindSnapPort(s, w.x, w.y, null);
        var old = s._snapPort;
        var changed = (!snap && old) || (snap && !old) ||
            (snap && old && (snap.shapeId !== old.shapeId || snap.port !== old.port));
        s._snapPort = snap;
        if (changed) dgmDraw(toolId);
        s.canvas.style.cursor = 'crosshair';
        return;
    }
    if (s.tool !== 'select') {
        s.canvas.style.cursor = 'crosshair';
        return;
    }
    var rect = s.canvas.getBoundingClientRect();
    var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    var w = dgmScreenToWorld(s, sx, sy);
    if (dgmHitRotHandle(s, w.x, w.y)) {
        s.canvas.style.cursor = 'grab';
        return;
    }
    var handle = dgmHitHandle(s, w.x, w.y);
    if (handle) {
        var cursorMap = { nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize', e: 'e-resize', se: 'se-resize', s: 's-resize', sw: 'sw-resize', w: 'w-resize' };
        s.canvas.style.cursor = cursorMap[handle] || 'pointer';
        return;
    }
    var lh = dgmHitLineHandle(s, w.x, w.y);
    if (lh) {
        s.canvas.style.cursor = 'pointer';
        return;
    }
    if (dgmHitBendPoint(s, w.x, w.y) || dgmHitCurveMidHandle(s, w.x, w.y)) {
        s.canvas.style.cursor = 'pointer';
        return;
    }
    if (dgmHitLineText(s, w.x, w.y)) {
        s.canvas.style.cursor = 'move';
        return;
    }
    var hit = dgmHitTest(s, w.x, w.y);
    if (hit) {
        s.canvas.style.cursor = 'move';
        return;
    }
    s.canvas.style.cursor = 'default';
}

function dgmStartTextEdit(toolId, shapeId) {
    var s = dgmState[toolId];
    if (!s || !s.widget) return;
    dgmFinishTextEdit(toolId);
    var sh = null;
    for (var i = 0; i < s.shapes.length; i++) {
        if (s.shapes[i].id === shapeId) { sh = s.shapes[i]; break; }
    }
    if (!sh) return;
    var wrap = s.widget.querySelector('.dgm-canvas-wrap');
    var isLine = sh.type === 'line' || sh.type === 'arrow';
    var scr, sw, shh;
    if (isLine) {
        var mx = (sh.x1 + sh.x2) / 2 + (sh.textOffX || 0);
        var my = (sh.y1 + sh.y2) / 2 + (sh.textOffY || 0);
        var tw = 120, th = 32;
        scr = dgmWorldToScreen(s, mx - tw / 2, my - th / 2);
        sw = tw * s.zoom;
        shh = th * s.zoom;
    } else {
        scr = dgmWorldToScreen(s, sh.x, sh.y);
        sw = sh.w * s.zoom;
        shh = sh.h * s.zoom;
    }
    var ta = document.createElement('textarea');
    ta.className = 'dgm-text-overlay';
    ta.value = sh.text || '';
    ta.style.left = scr.x + 'px';
    ta.style.top = scr.y + 'px';
    ta.style.width = Math.max(60, sw) + 'px';
    ta.style.height = Math.max(28, shh) + 'px';
    ta.style.fontSize = Math.max(10, (sh.textSize || 14) * s.zoom) + 'px';
    ta.style.textAlign = isLine ? 'center' : (sh.textAlign || 'center');
    ta.style.color = sh.textColor || sh.stroke || '#000000';
    ta.setAttribute('data-shape-id', shapeId);
    wrap.appendChild(ta);
    ta.focus();
    ta.select();
    ta.addEventListener('blur', function() { dgmFinishTextEdit(toolId); });
    ta.addEventListener('keydown', function(ev) {
        if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); ta.blur(); }
        if (ev.key === 'Escape') { ta.value = sh.text || ''; ta.blur(); }
    });
    s._editingShapeId = shapeId;
}

function dgmFinishTextEdit(toolId) {
    var s = dgmState[toolId];
    if (!s || !s.widget || !s._editingShapeId) return;
    var wrap = s.widget.querySelector('.dgm-canvas-wrap');
    var ta = wrap.querySelector('.dgm-text-overlay');
    if (!ta) { s._editingShapeId = null; return; }
    var shapeId = parseInt(ta.getAttribute('data-shape-id'));
    var val = ta.value;
    for (var i = 0; i < s.shapes.length; i++) {
        if (s.shapes[i].id === shapeId) { s.shapes[i].text = val; break; }
    }
    ta.remove();
    s._editingShapeId = null;
    dgmSaveData(toolId);
    dgmDraw(toolId);
}

function dgmSetTool(btn, tool) {
    var toolId = dgmGetToolId(btn);
    var s = dgmGetState(toolId);
    s.tool = tool;
    var toolbar = btn.closest('.dgm-toolbar');
    var btns = toolbar.querySelectorAll('.dgm-tool-btn');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    btn.classList.add('active');
    if (s.canvas) {
        s.canvas.style.cursor = tool === 'select' ? 'default' : 'crosshair';
    }
}

function dgmAddShape(btn, type) {
    var toolId = dgmGetToolId(btn);
    var s = dgmGetState(toolId);
    var isBidir = type === 'arrow2';
    var actualType = isBidir ? 'arrow' : type;
    // If a line/arrow is selected and a line type is requested, convert it
    if ((actualType === 'line' || actualType === 'arrow') && s.selectedIds.length === 1) {
        var sel = null;
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.shapes[i].id === s.selectedIds[0]) { sel = s.shapes[i]; break; }
        }
        if (sel && (sel.type === 'line' || sel.type === 'arrow')) {
            dgmPushUndo(s);
            sel.type = actualType;
            sel.bidir = isBidir || undefined;
            if (!isBidir) delete sel.bidir;
            dgmSaveData(toolId);
            dgmDraw(toolId);
            return;
        }
    }
    var rect = s.canvas.getBoundingClientRect();
    var centerScreen = { x: rect.width / 2, y: rect.height / 2 };
    var wc = dgmScreenToWorld(s, centerScreen.x, centerScreen.y);
    dgmPushUndo(s);
    var newShape;
    if (actualType === 'line' || actualType === 'arrow') {
        var defLen = 100;
        newShape = {
            id: s.nextId++, type: actualType,
            x1: wc.x - defLen / 2, y1: wc.y,
            x2: wc.x + defLen / 2, y2: wc.y,
            text: '', textOffX: 0, textOffY: 0, bendPoints: [],
            stroke: s.stroke, strokeWidth: s.strokeWidth, lineDash: s.lineDash,
            textColor: s.textColor, textSize: s.textSize, textRotation: s.textRotation
        };
        if (isBidir) newShape.bidir = true;
    } else {
        var defW = 120, defH = 80;
        if (type === 'human') { defW = 90; defH = 100; }
        else if (type === 'robot') { defW = 90; defH = 100; }
        else if (type === 'text') { defW = 120; defH = 40; }
        else if (type === 'cylinder') { defW = 100; defH = 120; }
        else if (type === 'clock') { defW = 100; defH = 100; }
        else if (type === 'cube') { defW = 100; defH = 100; }
        else if (type === 'cloud') { defW = 140; defH = 90; }
        else if (type === 'note') { defW = 120; defH = 100; }
        else if (type === 'envelope') { defW = 120; defH = 80; }
        else if (type === 'stack') { defW = 120; defH = 120; }
        else if (type === 'gear') { defW = 100; defH = 100; }
        else if (type === 'brain') { defW = 100; defH = 110; }
        newShape = {
            id: s.nextId++, type: type,
            x: wc.x - defW / 2, y: wc.y - defH / 2, w: defW, h: defH, text: '',
            fill: s.fill, stroke: s.stroke, strokeWidth: s.strokeWidth, lineDash: s.lineDash,
            textColor: s.textColor, textSize: s.textSize, textAlign: s.textAlign, textVAlign: s.textVAlign, textRotation: s.textRotation
        };
    }
    s.shapes.push(newShape);
    s.selectedIds = [newShape.id];
    s.tool = 'select';
    if (s.canvas) s.canvas.style.cursor = 'default';
    dgmSaveData(toolId);
    dgmDraw(toolId);
    if (type === 'text') {
        dgmStartTextEdit(toolId, newShape.id);
    }
}

function dgmSetFill(input) {
    var toolId = dgmGetToolId(input);
    var s = dgmGetState(toolId);
    s.fill = input.value;
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1 && s.shapes[i].type !== 'line' && s.shapes[i].type !== 'arrow') {
                s.shapes[i].fill = input.value;
            }
        }
        dgmSaveData(toolId);
        dgmDraw(toolId);
    }
}

function dgmToggleTransparentFill(btn) {
    var toolId = dgmGetToolId(btn);
    var s = dgmGetState(toolId);
    var makeTrans = s.fill !== 'transparent';
    s.fill = makeTrans ? 'transparent' : '#ffffff';
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1 && s.shapes[i].type !== 'line' && s.shapes[i].type !== 'arrow') {
                s.shapes[i].fill = s.fill;
            }
        }
        dgmSaveData(toolId);
    }
    dgmDraw(toolId);
}

function dgmSetStroke(input) {
    var toolId = dgmGetToolId(input);
    var s = dgmGetState(toolId);
    s.stroke = input.value;
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) {
                s.shapes[i].stroke = input.value;
            }
        }
        dgmSaveData(toolId);
        dgmDraw(toolId);
    }
}

function dgmSetStrokeWidth(sel) {
    var toolId = dgmGetToolId(sel);
    var s = dgmGetState(toolId);
    s.strokeWidth = parseInt(sel.value);
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) {
                s.shapes[i].strokeWidth = parseInt(sel.value);
            }
        }
        dgmSaveData(toolId);
        dgmDraw(toolId);
    }
}

function dgmSetLineDash(sel) {
    var toolId = dgmGetToolId(sel);
    var s = dgmGetState(toolId);
    s.lineDash = sel.value;
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) {
                s.shapes[i].lineDash = sel.value;
            }
        }
        dgmSaveData(toolId);
        dgmDraw(toolId);
    }
}

function dgmSetTextColor(input) {
    var toolId = dgmGetToolId(input);
    var s = dgmGetState(toolId);
    s.textColor = input.value;
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) {
                s.shapes[i].textColor = input.value;
            }
        }
        dgmSaveData(toolId);
        dgmDraw(toolId);
    }
}

function dgmSetTextSize(sel) {
    var toolId = dgmGetToolId(sel);
    var s = dgmGetState(toolId);
    s.textSize = parseInt(sel.value);
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) {
                s.shapes[i].textSize = parseInt(sel.value);
            }
        }
        dgmSaveData(toolId);
        dgmDraw(toolId);
    }
}

function dgmSetTextAlign(btn, align) {
    var toolId = dgmGetToolId(btn);
    var s = dgmGetState(toolId);
    s.textAlign = align;
    var toolbar = btn.closest('.dgm-toolbar');
    var alignBtns = toolbar.querySelectorAll('.dgm-align-btn');
    for (var i = 0; i < alignBtns.length; i++) alignBtns[i].classList.remove('active');
    btn.classList.add('active');
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1 && s.shapes[i].type !== 'line' && s.shapes[i].type !== 'arrow') {
                s.shapes[i].textAlign = align;
            }
        }
        dgmSaveData(toolId);
        dgmDraw(toolId);
    }
}

function dgmSetTextVAlign(btn, valign) {
    var toolId = dgmGetToolId(btn);
    var s = dgmGetState(toolId);
    s.textVAlign = valign;
    var toolbar = btn.closest('.dgm-toolbar');
    var vBtns = toolbar.querySelectorAll('.dgm-valign-btn');
    for (var i = 0; i < vBtns.length; i++) vBtns[i].classList.remove('active');
    btn.classList.add('active');
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1 && s.shapes[i].type !== 'line' && s.shapes[i].type !== 'arrow') {
                s.shapes[i].textVAlign = valign;
            }
        }
        dgmSaveData(toolId);
        dgmDraw(toolId);
    }
}

function dgmSetTextRotation(sel) {
    var toolId = dgmGetToolId(sel);
    var s = dgmGetState(toolId);
    s.textRotation = parseInt(sel.value) || 0;
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) {
                s.shapes[i].textRotation = s.textRotation;
            }
        }
        dgmSaveData(toolId);
        dgmDraw(toolId);
    }
}

function dgmDeleteSelected(btn) {
    var toolId = dgmGetToolId(btn);
    var s = dgmGetState(toolId);
    if (s.selectedIds.length === 0) return;
    dgmPushUndo(s);
    var delIds = s.selectedIds.slice();
    s.shapes = s.shapes.filter(function(sh) { return delIds.indexOf(sh.id) === -1; });
    for (var i = 0; i < s.shapes.length; i++) {
        var sh = s.shapes[i];
        if (sh.startConn && delIds.indexOf(sh.startConn.shapeId) !== -1) sh.startConn = null;
        if (sh.endConn && delIds.indexOf(sh.endConn.shapeId) !== -1) sh.endConn = null;
    }
    s.selectedIds = [];
    dgmSaveData(toolId);
    dgmDraw(toolId);
}

function dgmSendToFront(btn) {
    var toolId = dgmGetToolId(btn);
    var s = dgmGetState(toolId);
    if (s.selectedIds.length === 0) return;
    dgmPushUndo(s);
    var sel = [], rest = [];
    for (var i = 0; i < s.shapes.length; i++) {
        if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) sel.push(s.shapes[i]);
        else rest.push(s.shapes[i]);
    }
    s.shapes = rest.concat(sel);
    dgmSaveData(toolId);
    dgmDraw(toolId);
}

function dgmSendToBack(btn) {
    var toolId = dgmGetToolId(btn);
    var s = dgmGetState(toolId);
    if (s.selectedIds.length === 0) return;
    dgmPushUndo(s);
    var sel = [], rest = [];
    for (var i = 0; i < s.shapes.length; i++) {
        if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) sel.push(s.shapes[i]);
        else rest.push(s.shapes[i]);
    }
    s.shapes = sel.concat(rest);
    dgmSaveData(toolId);
    dgmDraw(toolId);
}

function dgmUndo(btn) {
    var toolId = dgmGetToolId(btn);
    var s = dgmGetState(toolId);
    if (s.undoStack.length === 0) return;
    s.shapes = s.undoStack.pop();
    s.selectedIds = [];
    dgmSaveData(toolId);
    dgmDraw(toolId);
}

function dgmExportPNG(btn) {
    var toolId = dgmGetToolId(btn);
    var s = dgmGetState(toolId);
    if (s.shapes.length === 0) return;
    dgmResolveConnections(s);
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (var i = 0; i < s.shapes.length; i++) {
        var sh = s.shapes[i];
        if (sh.type === 'line' || sh.type === 'arrow') {
            minX = Math.min(minX, sh.x1, sh.x2);
            minY = Math.min(minY, sh.y1, sh.y2);
            maxX = Math.max(maxX, sh.x1, sh.x2);
            maxY = Math.max(maxY, sh.y1, sh.y2);
        } else {
            minX = Math.min(minX, sh.x);
            minY = Math.min(minY, sh.y);
            maxX = Math.max(maxX, sh.x + sh.w);
            maxY = Math.max(maxY, sh.y + sh.h);
        }
    }
    var margin = 20;
    var cw = maxX - minX + margin * 2;
    var ch = maxY - minY + margin * 2;
    var offCanvas = document.createElement('canvas');
    offCanvas.width = Math.max(1, Math.ceil(cw));
    offCanvas.height = Math.max(1, Math.ceil(ch));
    var ctx = offCanvas.getContext('2d');
    var isDark = document.body.classList.contains('dark-mode');
    ctx.fillStyle = isDark ? '#1e1e1e' : '#ffffff';
    ctx.fillRect(0, 0, offCanvas.width, offCanvas.height);
    ctx.save();
    ctx.translate(margin - minX, margin - minY);
    var tmpState = { zoom: 1, viewX: 0, viewY: 0 };
    for (var i = 0; i < s.shapes.length; i++) {
        dgmDrawShape(ctx, s.shapes[i], tmpState);
    }
    ctx.restore();
    var link = document.createElement('a');
    link.download = 'diagram.png';
    link.href = offCanvas.toDataURL('image/png');
    link.click();
}

function dgmHideContextMenu(toolId) {
    var s = dgmState[toolId];
    if (s && s._contextMenu) {
        s._contextMenu.remove();
        s._contextMenu = null;
    }
}

function dgmShowContextMenu(toolId, clientX, clientY, worldX, worldY) {
    var s = dgmGetState(toolId);
    dgmHideContextMenu(toolId);
    // Hit test to see if right-clicked on a shape
    var hit = dgmHitTest(s, worldX, worldY);
    if (hit && s.selectedIds.indexOf(hit.id) === -1) {
        s.selectedIds = [hit.id];
        dgmDraw(toolId);
    }
    var hasSel = s.selectedIds.length > 0;
    var hasClip = dgmClipboard && dgmClipboard.length > 0;
    var items = [];
    items.push({ label: 'Cut', action: 'cut', shortcut: 'Ctrl+X', disabled: !hasSel });
    items.push({ label: 'Copy', action: 'copy', shortcut: 'Ctrl+C', disabled: !hasSel });
    items.push({ label: 'Paste', action: 'paste', shortcut: 'Ctrl+V', disabled: !hasClip });
    items.push({ label: 'Duplicate', action: 'duplicate', shortcut: 'Ctrl+D', disabled: !hasSel });
    items.push({ sep: true });
    items.push({ label: 'Send to Front', action: 'front', shortcut: ']', disabled: !hasSel });
    items.push({ label: 'Send to Back', action: 'back', shortcut: '[', disabled: !hasSel });
    items.push({ sep: true });
    items.push({ label: 'Select All', action: 'selectall', shortcut: 'Ctrl+A', disabled: s.shapes.length === 0 });
    items.push({ sep: true });
    items.push({ label: 'Delete', action: 'delete', shortcut: 'Del', disabled: !hasSel });

    var html = '';
    for (var i = 0; i < items.length; i++) {
        var it = items[i];
        if (it.sep) { html += '<div class="dgm-ctx-sep"></div>'; continue; }
        html += '<div class="dgm-ctx-item' + (it.disabled ? ' disabled' : '') + '" data-action="' + it.action + '">' +
            '<span>' + it.label + '</span><span class="dgm-ctx-shortcut">' + it.shortcut + '</span></div>';
    }
    var menu = document.createElement('div');
    menu.className = 'dgm-context-menu';
    menu.innerHTML = html;
    var wrap = s.widget.querySelector('.dgm-canvas-wrap');
    var wrapRect = wrap.getBoundingClientRect();
    menu.style.left = (clientX - wrapRect.left) + 'px';
    menu.style.top = (clientY - wrapRect.top) + 'px';
    wrap.appendChild(menu);
    s._contextMenu = menu;
    // Clamp to stay within wrap bounds
    var mr = menu.getBoundingClientRect();
    if (mr.right > wrapRect.right) menu.style.left = (parseFloat(menu.style.left) - (mr.right - wrapRect.right)) + 'px';
    if (mr.bottom > wrapRect.bottom) menu.style.top = (parseFloat(menu.style.top) - (mr.bottom - wrapRect.bottom)) + 'px';
    // Click handler on items
    menu.addEventListener('mousedown', function(ev) {
        ev.stopPropagation();
        var item = ev.target.closest('.dgm-ctx-item');
        if (item && !item.classList.contains('disabled')) {
            dgmContextAction(toolId, item.getAttribute('data-action'));
        }
        dgmHideContextMenu(toolId);
    });
}

function dgmContextAction(toolId, action) {
    var s = dgmGetState(toolId);
    if (action === 'cut') {
        if (s.selectedIds.length === 0) return;
        var copied = [];
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) {
                copied.push(JSON.parse(JSON.stringify(s.shapes[i])));
            }
        }
        dgmClipboard = copied;
        dgmPushUndo(s);
        var delIds = s.selectedIds.slice();
        s.shapes = s.shapes.filter(function(sh) { return delIds.indexOf(sh.id) === -1; });
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.shapes[i].startConn && delIds.indexOf(s.shapes[i].startConn.shapeId) !== -1) s.shapes[i].startConn = null;
            if (s.shapes[i].endConn && delIds.indexOf(s.shapes[i].endConn.shapeId) !== -1) s.shapes[i].endConn = null;
        }
        s.selectedIds = [];
        dgmSaveData(toolId);
        dgmDraw(toolId);
    } else if (action === 'copy') {
        if (s.selectedIds.length === 0) return;
        var copied = [];
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) {
                copied.push(JSON.parse(JSON.stringify(s.shapes[i])));
            }
        }
        dgmClipboard = copied;
    } else if (action === 'paste') {
        if (!dgmClipboard || dgmClipboard.length === 0) return;
        dgmPushUndo(s);
        var newIds = [];
        for (var ci = 0; ci < dgmClipboard.length; ci++) {
            var clone = JSON.parse(JSON.stringify(dgmClipboard[ci]));
            clone.id = s.nextId++;
            clone.startConn = null;
            clone.endConn = null;
            if (clone.type === 'line' || clone.type === 'arrow') {
                clone.x1 += 20; clone.y1 += 20;
                clone.x2 += 20; clone.y2 += 20;
            } else {
                clone.x += 20; clone.y += 20;
            }
            s.shapes.push(clone);
            newIds.push(clone.id);
        }
        s.selectedIds = newIds;
        for (var ci = 0; ci < dgmClipboard.length; ci++) {
            if (dgmClipboard[ci].type === 'line' || dgmClipboard[ci].type === 'arrow') {
                dgmClipboard[ci].x1 += 20; dgmClipboard[ci].y1 += 20;
                dgmClipboard[ci].x2 += 20; dgmClipboard[ci].y2 += 20;
            } else {
                dgmClipboard[ci].x += 20; dgmClipboard[ci].y += 20;
            }
        }
        dgmSaveData(toolId);
        dgmDraw(toolId);
    } else if (action === 'duplicate') {
        if (s.selectedIds.length === 0) return;
        dgmPushUndo(s);
        var newIds = [];
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) {
                var dup = JSON.parse(JSON.stringify(s.shapes[i]));
                dup.id = s.nextId++;
                dup.startConn = null;
                dup.endConn = null;
                if (dup.type === 'line' || dup.type === 'arrow') {
                    dup.x1 += 20; dup.y1 += 20;
                    dup.x2 += 20; dup.y2 += 20;
                } else {
                    dup.x += 20; dup.y += 20;
                }
                s.shapes.push(dup);
                newIds.push(dup.id);
            }
        }
        s.selectedIds = newIds;
        dgmSaveData(toolId);
        dgmDraw(toolId);
    } else if (action === 'front') {
        if (s.selectedIds.length === 0) return;
        dgmPushUndo(s);
        var sel = [], rest = [];
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) sel.push(s.shapes[i]);
            else rest.push(s.shapes[i]);
        }
        s.shapes = rest.concat(sel);
        dgmSaveData(toolId);
        dgmDraw(toolId);
    } else if (action === 'back') {
        if (s.selectedIds.length === 0) return;
        dgmPushUndo(s);
        var sel = [], rest = [];
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) sel.push(s.shapes[i]);
            else rest.push(s.shapes[i]);
        }
        s.shapes = sel.concat(rest);
        dgmSaveData(toolId);
        dgmDraw(toolId);
    } else if (action === 'selectall') {
        s.selectedIds = s.shapes.map(function(sh) { return sh.id; });
        dgmDraw(toolId);
    } else if (action === 'delete') {
        if (s.selectedIds.length === 0) return;
        dgmPushUndo(s);
        var delIds = s.selectedIds.slice();
        s.shapes = s.shapes.filter(function(sh) { return delIds.indexOf(sh.id) === -1; });
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.shapes[i].startConn && delIds.indexOf(s.shapes[i].startConn.shapeId) !== -1) s.shapes[i].startConn = null;
            if (s.shapes[i].endConn && delIds.indexOf(s.shapes[i].endConn.shapeId) !== -1) s.shapes[i].endConn = null;
        }
        s.selectedIds = [];
        dgmSaveData(toolId);
        dgmDraw(toolId);
    }
}

function dgmSyncToolbar(toolId) {
    var s = dgmState[toolId];
    if (!s || !s.widget) return;
    var w = s.widget;
    var shape = null;
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.shapes[i].id === s.selectedIds[0]) { shape = s.shapes[i]; break; }
        }
    }
    var isLine = shape && (shape.type === 'line' || shape.type === 'arrow');
    var fill = shape && !isLine ? (shape.fill || '#ffffff') : s.fill;
    var stroke = shape ? (shape.stroke || '#000000') : s.stroke;
    var strokeWidth = shape ? (shape.strokeWidth || 2) : s.strokeWidth;
    var lineDash = shape ? (shape.lineDash || 'solid') : (s.lineDash || 'solid');
    var textColor = shape ? (shape.textColor || '#000000') : (s.textColor || '#000000');
    var textSize = shape ? (shape.textSize || 14) : (s.textSize || 14);
    var textAlign = shape && !isLine ? (shape.textAlign || 'center') : (s.textAlign || 'center');
    var textVAlign = shape && !isLine ? (shape.textVAlign || 'middle') : (s.textVAlign || 'middle');
    var textRotation = shape ? (shape.textRotation || 0) : (s.textRotation || 0);
    var isTrans = fill === 'transparent';
    var el;
    el = w.querySelector('.dgm-fill-input');
    if (el) { el.value = isTrans ? '#ffffff' : fill; el.style.opacity = isTrans ? '0.3' : '1'; }
    el = w.querySelector('.dgm-nofill-btn');
    if (el) el.classList.toggle('active', isTrans);
    el = w.querySelector('.dgm-stroke-input');
    if (el) el.value = stroke;
    el = w.querySelector('.dgm-width-select');
    if (el) el.value = strokeWidth;
    el = w.querySelector('.dgm-dash-select');
    if (el) el.value = lineDash;
    el = w.querySelector('.dgm-textcolor-input');
    if (el) el.value = textColor;
    el = w.querySelector('.dgm-textsize-select');
    if (el) el.value = textSize;
    var alignBtns = w.querySelectorAll('.dgm-align-btn');
    for (var i = 0; i < alignBtns.length; i++) {
        alignBtns[i].classList.toggle('active', alignBtns[i].getAttribute('data-align') === textAlign);
    }
    var valignBtns = w.querySelectorAll('.dgm-valign-btn');
    for (var i = 0; i < valignBtns.length; i++) {
        valignBtns[i].classList.toggle('active', valignBtns[i].getAttribute('data-valign') === textVAlign);
    }
    el = w.querySelector('.dgm-textrot-select');
    if (el) el.value = textRotation;
}

function dgmDraw(toolId) {
    var s = dgmState[toolId];
    if (!s || !s.canvas || !s.ctx) return;
    dgmResolveConnections(s);
    var W = s.canvas.width, H = s.canvas.height;
    var ctx = s.ctx;
    var isDark = document.body.classList.contains('dark-mode');
    ctx.fillStyle = isDark ? '#1e1e1e' : '#ffffff';
    ctx.fillRect(0, 0, W, H);
    dgmDrawGrid(ctx, s, W, H);
    ctx.save();
    ctx.translate(s.viewX, s.viewY);
    ctx.scale(s.zoom, s.zoom);
    for (var i = 0; i < s.shapes.length; i++) {
        dgmDrawShape(ctx, s.shapes[i], s);
    }
    // Draw connection ports when in line/arrow mode or dragging lines
    if (s.tool === 'line' || s.tool === 'arrow' || s.dragType === 'draw-line' || s.dragType === 'line-handle') {
        dgmDrawPorts(ctx, s);
    }
    if (s.ghostShape) dgmDrawGhost(ctx, s);
    // Draw selection for all selected shapes
    if (s.selectedIds.length > 0) {
        for (var i = 0; i < s.shapes.length; i++) {
            if (s.selectedIds.indexOf(s.shapes[i].id) !== -1) {
                dgmDrawSelection(ctx, s.shapes[i], s);
            }
        }
    }
    // Draw selection rectangle
    if (s.dragType === 'select-rect' && s._selectRectStart && s._selectRectEnd) {
        ctx.save();
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 1 / s.zoom;
        ctx.setLineDash([6 / s.zoom, 4 / s.zoom]);
        ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
        var rx = Math.min(s._selectRectStart.x, s._selectRectEnd.x);
        var ry = Math.min(s._selectRectStart.y, s._selectRectEnd.y);
        var rw = Math.abs(s._selectRectEnd.x - s._selectRectStart.x);
        var rh = Math.abs(s._selectRectEnd.y - s._selectRectStart.y);
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.restore();
    }
    ctx.restore();
    // Update zoom label
    var label = s.widget && s.widget.querySelector('.dgm-zoom-label');
    if (label) label.textContent = Math.round(s.zoom * 100) + '%';
    dgmSyncToolbar(toolId);
}

function dgmDrawGrid(ctx, state, W, H) {
    var step = 20 * state.zoom;
    if (step < 8) return;
    var isDark = document.body.classList.contains('dark-mode');
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
    var offX = state.viewX % step;
    var offY = state.viewY % step;
    for (var x = offX; x < W; x += step) {
        for (var y = offY; y < H; y += step) {
            ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
        }
    }
}

function dgmInvertColor(hex) {
    if (!hex || hex.charAt(0) !== '#') return hex;
    var c = hex.replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    var r = 255 - parseInt(c.substring(0, 2), 16);
    var g = 255 - parseInt(c.substring(2, 4), 16);
    var b = 255 - parseInt(c.substring(4, 6), 16);
    return '#' + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2);
}

function dgmDrawShape(ctx, shape, state) {
    var _dgmDark = document.body.classList.contains('dark-mode');
    var _fill = shape.fill || '#ffffff';
    var _stroke = shape.stroke || '#000000';
    var _textColor = shape.textColor || shape.stroke || '#000000';
    if (_dgmDark) {
        if (_fill !== 'transparent') _fill = dgmInvertColor(_fill);
        _stroke = dgmInvertColor(_stroke);
        _textColor = dgmInvertColor(shape.textColor || shape.stroke || '#000000');
    }
    var rot = shape.rotation || 0;
    if (rot && shape.type !== 'line' && shape.type !== 'arrow') {
        var rcx = shape.x + shape.w / 2, rcy = shape.y + shape.h / 2;
        ctx.save();
        ctx.translate(rcx, rcy);
        ctx.rotate(rot * Math.PI / 180);
        ctx.translate(-rcx, -rcy);
    }
    ctx.lineWidth = shape.strokeWidth || 2;
    ctx.strokeStyle = _stroke;
    ctx.fillStyle = _fill;
    var ld = shape.lineDash || 'solid';
    var lw = shape.strokeWidth || 2;
    if (ld === 'dashed') ctx.setLineDash([lw * 4, lw * 3]);
    else if (ld === 'dotted') ctx.setLineDash([lw, lw * 2]);
    else ctx.setLineDash([]);

    if (shape.type === 'rect' || shape.type === 'text') {
        ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
    } else if (shape.type === 'ellipse') {
        ctx.beginPath();
        var cx = shape.x + shape.w / 2, cy = shape.y + shape.h / 2;
        var rx = Math.abs(shape.w) / 2, ry = Math.abs(shape.h) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    } else if (shape.type === 'diamond') {
        var cx = shape.x + shape.w / 2, cy = shape.y + shape.h / 2;
        var hw = shape.w / 2, hh = shape.h / 2;
        ctx.beginPath();
        ctx.moveTo(cx, shape.y);
        ctx.lineTo(shape.x + shape.w, cy);
        ctx.lineTo(cx, shape.y + shape.h);
        ctx.lineTo(shape.x, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (shape.type === 'cylinder') {
        var cx = shape.x + shape.w / 2;
        var ry = Math.min(Math.abs(shape.h) * 0.15, 20);
        var rx = Math.abs(shape.w) / 2;
        // Body
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y + ry);
        ctx.lineTo(shape.x, shape.y + shape.h - ry);
        ctx.ellipse(cx, shape.y + shape.h - ry, rx, ry, 0, Math.PI, 0, true);
        ctx.lineTo(shape.x + shape.w, shape.y + ry);
        ctx.ellipse(cx, shape.y + ry, rx, ry, 0, 0, Math.PI, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Top ellipse
        ctx.beginPath();
        ctx.ellipse(cx, shape.y + ry, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    } else if (shape.type === 'human') {
        var cx = shape.x + shape.w / 2;
        var w = Math.abs(shape.w), h = Math.abs(shape.h);
        var lw = Math.max(shape.strokeWidth || 2, 1);
        ctx.lineWidth = lw;
        // Head fills top area, text goes below
        var textZone = shape.text ? h * 0.25 : 0;
        var headArea = h - textZone;
        var headR = Math.min(w, headArea) * 0.42;
        var headCX = cx;
        var headCY = shape.y + headArea / 2;
        // Face circle
        ctx.beginPath();
        ctx.arc(headCX, headCY, headR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Eyes
        var eyeR = headR * 0.09;
        var eyeY = headCY - headR * 0.12;
        var eyeOff = headR * 0.32;
        ctx.fillStyle = _stroke;
        ctx.beginPath();
        ctx.arc(headCX - eyeOff, eyeY, eyeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headCX + eyeOff, eyeY, eyeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = _fill;
        // Smile
        ctx.strokeStyle = _stroke;
        var smileY = headCY + headR * 0.15;
        var smileR = headR * 0.28;
        ctx.beginPath();
        ctx.arc(headCX, smileY, smileR, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
    } else if (shape.type === 'robot') {
        var cx = shape.x + shape.w / 2;
        var w = Math.abs(shape.w), h = Math.abs(shape.h);
        var lw = Math.max(shape.strokeWidth || 2, 1);
        ctx.lineWidth = lw;
        // Head fills top area, text goes below
        var textZone = shape.text ? h * 0.25 : 0;
        var headArea = h - textZone;
        var padBot = shape.text ? headArea * 0.08 : 0;
        var usableH = headArea - padBot;
        var antennaH = usableH * 0.12;
        var headTop = shape.y + antennaH;
        var headH = usableH - antennaH;
        var headW = Math.min(w * 0.85, headH * 1.2);
        var headBot = headTop + headH;
        // Antenna
        ctx.beginPath();
        ctx.moveTo(cx, headTop);
        ctx.lineTo(cx, shape.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, shape.y, Math.max(2, w * 0.05), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Head (rounded rect)
        var hr = Math.min(headW, headH) * 0.15;
        ctx.beginPath();
        ctx.moveTo(cx - headW / 2 + hr, headTop);
        ctx.lineTo(cx + headW / 2 - hr, headTop);
        ctx.arcTo(cx + headW / 2, headTop, cx + headW / 2, headTop + hr, hr);
        ctx.lineTo(cx + headW / 2, headBot - hr);
        ctx.arcTo(cx + headW / 2, headBot, cx + headW / 2 - hr, headBot, hr);
        ctx.lineTo(cx - headW / 2 + hr, headBot);
        ctx.arcTo(cx - headW / 2, headBot, cx - headW / 2, headBot - hr, hr);
        ctx.lineTo(cx - headW / 2, headTop + hr);
        ctx.arcTo(cx - headW / 2, headTop, cx - headW / 2 + hr, headTop, hr);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Eyes
        var eyeR = Math.min(headW, headH) * 0.12;
        var eyeY = headTop + headH * 0.4;
        var eyeOff = headW * 0.22;
        ctx.fillStyle = _stroke;
        ctx.beginPath();
        ctx.arc(cx - eyeOff, eyeY, eyeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + eyeOff, eyeY, eyeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = _fill;
        // Mouth
        ctx.strokeStyle = _stroke;
        var mouthY = headTop + headH * 0.7;
        var mouthW = headW * 0.25;
        ctx.beginPath();
        ctx.moveTo(cx - mouthW, mouthY);
        ctx.lineTo(cx + mouthW, mouthY);
        ctx.stroke();
        // Ears
        var earW = w * 0.08;
        var earH = headH * 0.25;
        var earY = headTop + headH * 0.35;
        ctx.fillRect(cx - headW / 2 - earW, earY, earW, earH);
        ctx.strokeRect(cx - headW / 2 - earW, earY, earW, earH);
        ctx.fillRect(cx + headW / 2, earY, earW, earH);
        ctx.strokeRect(cx + headW / 2, earY, earW, earH);
    } else if (shape.type === 'cube') {
        var x = shape.x, y = shape.y, w = Math.abs(shape.w), h = Math.abs(shape.h);
        var d = Math.min(w, h) * 0.25;
        // Front face
        ctx.beginPath();
        ctx.moveTo(x, y + d);
        ctx.lineTo(x + w - d, y + d);
        ctx.lineTo(x + w - d, y + h);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Top face
        ctx.beginPath();
        ctx.moveTo(x, y + d);
        ctx.lineTo(x + d, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w - d, y + d);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Right face
        ctx.beginPath();
        ctx.moveTo(x + w - d, y + d);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w, y + h - d);
        ctx.lineTo(x + w - d, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (shape.type === 'cloud') {
        var x = shape.x, y = shape.y, w = Math.abs(shape.w), h = Math.abs(shape.h);
        var bubbles = [
            { cx: 0.25, cy: 0.55, rx: 0.22, ry: 0.30 },
            { cx: 0.50, cy: 0.35, rx: 0.24, ry: 0.32 },
            { cx: 0.73, cy: 0.50, rx: 0.22, ry: 0.28 },
            { cx: 0.50, cy: 0.65, rx: 0.40, ry: 0.24 }
        ];
        // Build a single combined path for fill + stroke outer outline
        // Use offscreen canvas to get clean outline
        var ow = Math.ceil(w + 4), oh = Math.ceil(h + 4);
        var oc = document.createElement('canvas');
        oc.width = ow; oc.height = oh;
        var ox = oc.getContext('2d');
        ox.translate(2, 2);
        // Fill all bubbles solid on offscreen
        ox.fillStyle = '#000';
        ox.beginPath();
        for (var bi = 0; bi < bubbles.length; bi++) {
            var b = bubbles[bi];
            ox.moveTo(b.cx * w + b.rx * w, b.cy * h);
            ox.ellipse(b.cx * w, b.cy * h, b.rx * w, b.ry * h, 0, 0, Math.PI * 2);
        }
        ox.fill();
        // Stroke each bubble, then erase interior to leave only outer edge
        ox.strokeStyle = _stroke;
        ox.lineWidth = shape.strokeWidth || 2;
        for (var bi = 0; bi < bubbles.length; bi++) {
            var b = bubbles[bi];
            ox.beginPath();
            ox.ellipse(b.cx * w, b.cy * h, b.rx * w, b.ry * h, 0, 0, Math.PI * 2);
            ox.stroke();
        }
        // Erase filled interior to remove inner strokes
        ox.globalCompositeOperation = 'destination-out';
        ox.beginPath();
        for (var bi = 0; bi < bubbles.length; bi++) {
            var b = bubbles[bi];
            var shrink = (shape.strokeWidth || 2) / 2 + 0.5;
            ox.moveTo(b.cx * w + Math.max(0, b.rx * w - shrink), b.cy * h);
            ox.ellipse(b.cx * w, b.cy * h, Math.max(0, b.rx * w - shrink), Math.max(0, b.ry * h - shrink), 0, 0, Math.PI * 2);
        }
        ox.fill();
        // Now put fill color back
        ox.globalCompositeOperation = 'destination-over';
        ox.fillStyle = _fill;
        ox.fillRect(-2, -2, ow, oh);
        // Draw offscreen result onto main canvas
        ctx.drawImage(oc, x - 2, y - 2);
    } else if (shape.type === 'stack') {
        var x = shape.x, y = shape.y, w = Math.abs(shape.w), h = Math.abs(shape.h);
        var gap = Math.max(2, w * 0.04);
        var rw = (w - gap * 2) / 3, rh = h;
        var lw = shape.strokeWidth || 2;
        ctx.strokeStyle = _stroke;
        ctx.lineWidth = lw;
        // Back rect (left) — dashed
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.rect(x, y, rw, rh);
        if (_fill !== 'transparent') { ctx.fillStyle = _fill; ctx.fill(); }
        ctx.stroke();
        // Middle rect — solid
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.rect(x + rw + gap, y, rw, rh);
        if (_fill !== 'transparent') { ctx.fillStyle = _fill; ctx.fill(); }
        ctx.stroke();
        // Front rect (right) — solid
        ctx.beginPath();
        ctx.rect(x + (rw + gap) * 2, y, rw, rh);
        if (_fill !== 'transparent') { ctx.fillStyle = _fill; ctx.fill(); }
        ctx.stroke();
    } else if (shape.type === 'envelope') {
        var x = shape.x, y = shape.y, w = Math.abs(shape.w), h = Math.abs(shape.h);
        // Outer rectangle
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        if (_fill !== 'transparent') { ctx.fillStyle = _fill; ctx.fill(); }
        ctx.strokeStyle = _stroke;
        ctx.lineWidth = shape.strokeWidth || 2;
        ctx.stroke();
        // Flap lines from top corners to center
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w / 2, y + h * 0.45);
        ctx.lineTo(x + w, y);
        ctx.strokeStyle = _stroke;
        ctx.stroke();
    } else if (shape.type === 'note') {
        var x = shape.x, y = shape.y, w = Math.abs(shape.w), h = Math.abs(shape.h);
        var fold = Math.min(w, h) * 0.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w - fold, y);
        ctx.lineTo(x + w, y + fold);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        if (_fill !== 'transparent') { ctx.fillStyle = _fill; ctx.fill(); }
        ctx.strokeStyle = _stroke;
        ctx.lineWidth = shape.strokeWidth || 2;
        ctx.stroke();
        // Draw the fold
        ctx.beginPath();
        ctx.moveTo(x + w - fold, y);
        ctx.lineTo(x + w - fold, y + fold);
        ctx.lineTo(x + w, y + fold);
        ctx.strokeStyle = _stroke;
        ctx.stroke();
    } else if (shape.type === 'gear') {
        var w = Math.abs(shape.w), h = Math.abs(shape.h);
        var textZone = shape.text ? h * 0.25 : 0;
        var area = h - textZone;
        var padBot = shape.text ? area * 0.08 : 0;
        var usableH = area - padBot;
        var cx = shape.x + shape.w / 2, cy = shape.y + usableH / 2;
        var r = Math.min(w, usableH) / 2;
        var teeth = 8;
        var innerR = r * 0.78;
        var outerR = r * 0.98;
        var toothHalf = Math.PI / teeth * 0.45;
        ctx.beginPath();
        for (var i = 0; i < teeth; i++) {
            var a = (i / teeth) * Math.PI * 2 - Math.PI / 2;
            var a1 = a - toothHalf;
            var a2 = a + toothHalf;
            var gapMid = a + Math.PI / teeth;
            var g1 = gapMid - toothHalf;
            var g2 = gapMid + toothHalf;
            if (i === 0) ctx.moveTo(cx + outerR * Math.cos(a1), cy + outerR * Math.sin(a1));
            ctx.lineTo(cx + outerR * Math.cos(a2), cy + outerR * Math.sin(a2));
            ctx.lineTo(cx + innerR * Math.cos(g1), cy + innerR * Math.sin(g1));
            ctx.lineTo(cx + innerR * Math.cos(g2), cy + innerR * Math.sin(g2));
            var nextA = ((i + 1) / teeth) * Math.PI * 2 - Math.PI / 2;
            var na1 = nextA - toothHalf;
            ctx.lineTo(cx + outerR * Math.cos(na1), cy + outerR * Math.sin(na1));
        }
        ctx.closePath();
        if (_fill !== 'transparent') { ctx.fillStyle = _fill; ctx.fill(); }
        ctx.strokeStyle = _stroke;
        ctx.lineWidth = shape.strokeWidth || 2;
        ctx.stroke();
    } else if (shape.type === 'brain') {
        var w = Math.abs(shape.w), h = Math.abs(shape.h);
        var lw = Math.max(shape.strokeWidth || 2, 1);
        ctx.lineWidth = lw;
        // SVG content bounds: x 50-308 (w=258), y 76-284 (h=208)
        var svgW = 258, svgH = 208, svgX = 50, svgY = 76;
        var scaleX = w / svgW, scaleY = h / svgH;
        var sc = Math.min(scaleX, scaleY);
        var offX = shape.x + (w - svgW * sc) / 2 - svgX * sc;
        var offY = shape.y + (h - svgH * sc) / 2 - svgY * sc;
        ctx.save();
        ctx.translate(offX, offY);
        ctx.scale(sc, sc);
        ctx.lineWidth = lw / sc;
        for (var bi = 0; bi < DGM_BRAIN_PATHS.length; bi++) {
            var bp = new Path2D(DGM_BRAIN_PATHS[bi]);
            if (_fill !== 'transparent') { ctx.fillStyle = _fill; ctx.fill(bp); }
            ctx.strokeStyle = _stroke;
            ctx.stroke(bp);
        }
        ctx.restore();
    } else if (shape.type === 'clock') {
        var w = Math.abs(shape.w), h = Math.abs(shape.h);
        var textZone = shape.text ? h * 0.25 : 0;
        var clockArea = h - textZone;
        var padBot = shape.text ? clockArea * 0.08 : 0;
        var usableH = clockArea - padBot;
        var cx = shape.x + shape.w / 2;
        var cy = shape.y + usableH / 2;
        var r = Math.min(w, usableH) / 2;
        // Face
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Hour markers
        ctx.fillStyle = _stroke;
        for (var hi = 0; hi < 12; hi++) {
            var ha = (hi * 30 - 90) * Math.PI / 180;
            var mr = r * 0.85;
            var ml = hi % 3 === 0 ? r * 0.15 : r * 0.08;
            var mw = hi % 3 === 0 ? 2 : 1;
            ctx.lineWidth = mw;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(ha) * (mr), cy + Math.sin(ha) * (mr));
            ctx.lineTo(cx + Math.cos(ha) * (mr + ml), cy + Math.sin(ha) * (mr + ml));
            ctx.stroke();
        }
        ctx.lineWidth = shape.strokeWidth || 2;
        // Hour hand (10:10)
        var hourA = (310 - 90) * Math.PI / 180;
        ctx.lineCap = 'round';
        ctx.lineWidth = Math.max(2, r * 0.06);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(hourA) * r * 0.5, cy + Math.sin(hourA) * r * 0.5);
        ctx.stroke();
        // Minute hand (10:10 → minute at 2)
        var minA = (60 - 90) * Math.PI / 180;
        ctx.lineWidth = Math.max(1.5, r * 0.04);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(minA) * r * 0.7, cy + Math.sin(minA) * r * 0.7);
        ctx.stroke();
        ctx.lineCap = 'butt';
        // Center dot
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.05, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = _fill;
        ctx.lineWidth = shape.strokeWidth || 2;
    } else if (shape.type === 'line' || shape.type === 'arrow') {
        var cpts = dgmGetCurvePoints(shape);
        var hasBends = shape.bendPoints && shape.bendPoints.length > 0;
        if (!hasBends && shape.text) {
            // Straight line with text gap
            var fontSize = shape.textSize || 14;
            ctx.font = fontSize + 'px sans-serif';
            var textLines = shape.text.split('\n');
            var lineH = Math.round(fontSize * 1.25);
            var totalTextH = textLines.length * lineH;
            var maxW = 0;
            for (var tl = 0; tl < textLines.length; tl++) {
                var tw = ctx.measureText(textLines[tl]).width;
                if (tw > maxW) maxW = tw;
            }
            var pad = 6;
            var gapHW = (maxW / 2 + pad);
            var gapHH = (totalTextH / 2 + pad);
            var tmx = (shape.x1 + shape.x2) / 2 + (shape.textOffX || 0);
            var tmy = (shape.y1 + shape.y2) / 2 + (shape.textOffY || 0);
            var textL = tmx - gapHW, textR = tmx + gapHW;
            var textT = tmy - gapHH, textB = tmy + gapHH;
            var segments = dgmClipLineByBox(shape.x1, shape.y1, shape.x2, shape.y2, textL, textT, textR, textB);
            for (var si = 0; si < segments.length; si++) {
                ctx.beginPath();
                ctx.moveTo(segments[si][0], segments[si][1]);
                ctx.lineTo(segments[si][2], segments[si][3]);
                ctx.stroke();
            }
        } else {
            dgmDrawCurvePath(ctx, cpts);
            ctx.stroke();
        }
        if (shape.type === 'arrow') {
            if (hasBends) {
                var tan = dgmCurveTangentAt(cpts, cpts.length - 2, 1);
                var tlen = Math.sqrt(tan.x * tan.x + tan.y * tan.y) || 1;
                var fakeX1 = shape.x2 - tan.x / tlen;
                var fakeY1 = shape.y2 - tan.y / tlen;
                dgmDrawArrowhead(ctx, fakeX1, fakeY1, shape.x2, shape.y2);
                if (shape.bidir) {
                    var tan0 = dgmCurveTangentAt(cpts, 0, 0);
                    var tlen0 = Math.sqrt(tan0.x * tan0.x + tan0.y * tan0.y) || 1;
                    var fakeX0 = shape.x1 + tan0.x / tlen0;
                    var fakeY0 = shape.y1 + tan0.y / tlen0;
                    dgmDrawArrowhead(ctx, fakeX0, fakeY0, shape.x1, shape.y1);
                }
            } else {
                dgmDrawArrowhead(ctx, shape.x1, shape.y1, shape.x2, shape.y2);
                if (shape.bidir) {
                    dgmDrawArrowhead(ctx, shape.x2, shape.y2, shape.x1, shape.y1);
                }
            }
        }
    }

    ctx.setLineDash([]);

    // Draw text label on lines/arrows
    if (shape.text && (shape.type === 'line' || shape.type === 'arrow')) {
        var fontSize = shape.textSize || 14;
        ctx.font = fontSize + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var mx = (shape.x1 + shape.x2) / 2 + (shape.textOffX || 0);
        var my = (shape.y1 + shape.y2) / 2 + (shape.textOffY || 0);
        var lines = shape.text.split('\n');
        var lineH = Math.round(fontSize * 1.25);
        var totalTextH = lines.length * lineH;
        ctx.fillStyle = _textColor;
        var _tRot = shape.textRotation || 0;
        if (_tRot) {
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(_tRot * Math.PI / 180);
            var startY = -(lines.length - 1) * lineH / 2;
            for (var l = 0; l < lines.length; l++) {
                ctx.fillText(lines[l], 0, startY + l * lineH);
            }
            ctx.restore();
        } else {
            var startY = my - (lines.length - 1) * lineH / 2;
            for (var l = 0; l < lines.length; l++) {
                ctx.fillText(lines[l], mx, startY + l * lineH);
            }
        }
    }

    // Draw text label
    if (shape.text && shape.type !== 'line' && shape.type !== 'arrow') {
        var fontSize = shape.textSize || 14;
        ctx.fillStyle = _textColor;
        ctx.font = fontSize + 'px sans-serif';
        ctx.textBaseline = 'middle';
        var lines = shape.text.split('\n');
        var lineH = Math.round(fontSize * 1.25);
        var totalTextH = lines.length * lineH;
        var _tRot = shape.textRotation || 0;
        if (shape.type === 'robot' || shape.type === 'human' || shape.type === 'clock' || shape.type === 'gear') {
            // Text below the icon, always centered horizontally
            ctx.textAlign = 'center';
            var tx = shape.x + shape.w / 2;
            var textZoneTop = shape.y + Math.abs(shape.h) * 0.75;
            var textZoneH = Math.abs(shape.h) * 0.25;
            var startY = textZoneTop + (textZoneH - totalTextH) / 2 + lineH / 2;
            if (_tRot) {
                var cy = textZoneTop + textZoneH / 2;
                ctx.save();
                ctx.translate(tx, cy);
                ctx.rotate(_tRot * Math.PI / 180);
                var rStartY = -(totalTextH) / 2 + lineH / 2;
                for (var l = 0; l < lines.length; l++) {
                    ctx.fillText(lines[l], 0, rStartY + l * lineH);
                }
                ctx.restore();
            } else {
                for (var l = 0; l < lines.length; l++) {
                    ctx.fillText(lines[l], tx, startY + l * lineH);
                }
            }
        } else {
            var align = shape.textAlign || 'center';
            ctx.textAlign = align;
            var pad = 6;
            var tx;
            if (align === 'left') tx = shape.x + pad;
            else if (align === 'right') tx = shape.x + shape.w - pad;
            else tx = shape.x + shape.w / 2;
            var valign = shape.textVAlign || 'middle';
            var startY;
            if (valign === 'top') startY = shape.y + pad + lineH / 2;
            else if (valign === 'bottom') startY = shape.y + shape.h - pad - totalTextH + lineH / 2;
            else startY = shape.y + shape.h / 2 - (lines.length - 1) * lineH / 2;
            if (_tRot) {
                var cx = shape.x + shape.w / 2;
                var cy = shape.y + shape.h / 2;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(_tRot * Math.PI / 180);
                ctx.textAlign = align;
                var rTx;
                if (align === 'left') rTx = -shape.w / 2 + pad;
                else if (align === 'right') rTx = shape.w / 2 - pad;
                else rTx = 0;
                var rStartY = startY - cy;
                for (var l = 0; l < lines.length; l++) {
                    ctx.fillText(lines[l], rTx, rStartY + l * lineH);
                }
                ctx.restore();
            } else {
                for (var l = 0; l < lines.length; l++) {
                    ctx.fillText(lines[l], tx, startY + l * lineH);
                }
            }
        }
    }
    if (rot && shape.type !== 'line' && shape.type !== 'arrow') {
        ctx.restore();
    }
}

function dgmDrawArrowhead(ctx, x1, y1, x2, y2) {
    var angle = Math.atan2(y2 - y1, x2 - x1);
    var len = 12;
    var spread = Math.PI / 7;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - len * Math.cos(angle - spread), y2 - len * Math.sin(angle - spread));
    ctx.lineTo(x2 - len * Math.cos(angle + spread), y2 - len * Math.sin(angle + spread));
    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
}

function dgmDrawPorts(ctx, state) {
    var portR = 4 / state.zoom;
    for (var i = 0; i < state.shapes.length; i++) {
        var ports = dgmGetPorts(state.shapes[i]);
        for (var j = 0; j < ports.length; j++) {
            var isSnap = state._snapPort &&
                state._snapPort.shapeId === state.shapes[i].id &&
                state._snapPort.port === ports[j].id;
            ctx.beginPath();
            ctx.arc(ports[j].x, ports[j].y, isSnap ? portR * 1.8 : portR, 0, Math.PI * 2);
            ctx.fillStyle = isSnap ? '#3498db' : 'rgba(52, 152, 219, 0.35)';
            ctx.fill();
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 1 / state.zoom;
            ctx.stroke();
        }
    }
}

function dgmDrawSelection(ctx, shape, state) {
    ctx.save();
    var isSingle = state.selectedIds.length === 1;

    if (shape.type === 'line' || shape.type === 'arrow') {
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 1.5 / state.zoom;
        ctx.setLineDash([6 / state.zoom, 4 / state.zoom]);
        if (isSingle) {
            ctx.setLineDash([]);
            var handleR = 5 / state.zoom;
            // Endpoint handles
            var pts = [{ x: shape.x1, y: shape.y1 }, { x: shape.x2, y: shape.y2 }];
            for (var i = 0; i < pts.length; i++) {
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#3498db';
                ctx.lineWidth = 1.5 / state.zoom;
                ctx.beginPath();
                ctx.arc(pts[i].x, pts[i].y, handleR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            // Bend point handles (solid blue circles)
            var bp = shape.bendPoints || [];
            for (var i = 0; i < bp.length; i++) {
                ctx.fillStyle = '#3498db';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5 / state.zoom;
                ctx.beginPath();
                ctx.arc(bp[i].x, bp[i].y, handleR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            // Midpoint curve handles (hollow circles, smaller)
            var midHandles = dgmGetCurveMidHandles(shape);
            var midR = 4 / state.zoom;
            for (var i = 0; i < midHandles.length; i++) {
                ctx.fillStyle = 'rgba(52,152,219,0.15)';
                ctx.strokeStyle = '#3498db';
                ctx.lineWidth = 1 / state.zoom;
                ctx.beginPath();
                ctx.arc(midHandles[i].x, midHandles[i].y, midR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
        } else {
            var mx = Math.min(shape.x1, shape.x2), my = Math.min(shape.y1, shape.y2);
            var mw = Math.abs(shape.x2 - shape.x1), mh = Math.abs(shape.y2 - shape.y1);
            ctx.strokeRect(mx - 4 / state.zoom, my - 4 / state.zoom, mw + 8 / state.zoom, mh + 8 / state.zoom);
        }
    } else {
        // Apply rotation to selection visuals
        var rot = shape.rotation || 0;
        if (rot) {
            var rcx = shape.x + shape.w / 2, rcy = shape.y + shape.h / 2;
            ctx.translate(rcx, rcy);
            ctx.rotate(rot * Math.PI / 180);
            ctx.translate(-rcx, -rcy);
        }
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 1.5 / state.zoom;
        ctx.setLineDash([6 / state.zoom, 4 / state.zoom]);
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
        if (isSingle) {
            ctx.setLineDash([]);
            // 8 resize handles
            var handles = dgmGetHandles(shape);
            var hs = 5 / state.zoom;
            for (var i = 0; i < handles.length; i++) {
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#3498db';
                ctx.lineWidth = 1.5 / state.zoom;
                ctx.fillRect(handles[i].x - hs, handles[i].y - hs, hs * 2, hs * 2);
                ctx.strokeRect(handles[i].x - hs, handles[i].y - hs, hs * 2, hs * 2);
            }
            // Rotation handle — circle above top-center
            var rhx = shape.x + shape.w / 2, rhy = shape.y - 25 / state.zoom;
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 1 / state.zoom;
            ctx.beginPath();
            ctx.moveTo(shape.x + shape.w / 2, shape.y);
            ctx.lineTo(rhx, rhy);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(rhx, rhy, 5 / state.zoom, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 1.5 / state.zoom;
            ctx.stroke();
            // Rotation indicator inside the circle
            ctx.beginPath();
            ctx.arc(rhx, rhy, 3 / state.zoom, -Math.PI * 0.7, Math.PI * 0.5);
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 1 / state.zoom;
            ctx.stroke();
        }
    }
    ctx.restore();
}

function dgmDrawGhost(ctx, state) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    dgmDrawShape(ctx, state.ghostShape, state);
    ctx.restore();
}

function dgmRenderTabs(toolId) {
    var s = dgmState[toolId];
    if (!s || !s.widget) return;
    var tabBar = s.widget.querySelector('.dgm-tabs');
    if (!tabBar) return;
    var addBtn = tabBar.querySelector('.dgm-tab-add');
    // Remove all tab spans
    var existing = tabBar.querySelectorAll('.dgm-tab');
    for (var i = 0; i < existing.length; i++) existing[i].remove();
    // Create tab elements
    for (var i = 0; i < s.tabs.length; i++) {
        var tab = s.tabs[i];
        var span = document.createElement('span');
        span.className = 'dgm-tab' + (tab.id === s.activeTabId ? ' active' : '');
        span.setAttribute('data-tab-id', tab.id);
        span.setAttribute('onclick', 'dgmSwitchTab(this,' + tab.id + ')');
        span.setAttribute('ondblclick', 'dgmRenameTab(this,' + tab.id + ')');
        var nameSpan = document.createElement('span');
        nameSpan.textContent = tab.name;
        span.appendChild(nameSpan);
        if (s.tabs.length > 1) {
            var closeBtn = document.createElement('span');
            closeBtn.className = 'dgm-tab-close';
            closeBtn.textContent = '\u00d7';
            closeBtn.setAttribute('onclick', 'dgmCloseTab(this,' + tab.id + ',event)');
            span.appendChild(closeBtn);
        }
        tabBar.insertBefore(span, addBtn);
    }
}

function dgmSwitchTab(el, tabId) {
    var toolId = el.closest('.tool').getAttribute('data-tool');
    var s = dgmState[toolId];
    if (!s || tabId === s.activeTabId) return;
    // Save current tab state
    for (var i = 0; i < s.tabs.length; i++) {
        if (s.tabs[i].id === s.activeTabId) {
            s.tabs[i].shapes = s.shapes;
            s.tabs[i].nextId = s.nextId;
            s.tabs[i].viewX = s.viewX;
            s.tabs[i].viewY = s.viewY;
            s.tabs[i].zoom = s.zoom;
            break;
        }
    }
    // Load new tab
    s.activeTabId = tabId;
    var tab = null;
    for (var i = 0; i < s.tabs.length; i++) {
        if (s.tabs[i].id === tabId) { tab = s.tabs[i]; break; }
    }
    if (tab) {
        s.shapes = tab.shapes || [];
        s.nextId = tab.nextId || 1;
        s.viewX = tab.viewX || 0;
        s.viewY = tab.viewY || 0;
        s.zoom = tab.zoom || 1;
    }
    s.undoStack = [];
    s.selectedIds = [];
    dgmSaveData(toolId);
    dgmRenderTabs(toolId);
    dgmDraw(toolId);
}

function dgmAddTab(btn) {
    var toolId = btn.closest('.tool').getAttribute('data-tool');
    var s = dgmState[toolId];
    if (!s) return;
    var newTab = { id: s.nextTabId++, name: 'Tab ' + s.nextTabId, shapes: [], nextId: 1, viewX: 0, viewY: 0, zoom: 1 };
    s.tabs.push(newTab);
    dgmSwitchTab(btn, newTab.id);
}

function dgmCloseTab(el, tabId, evt) {
    evt.stopPropagation();
    var toolId = el.closest('.tool').getAttribute('data-tool');
    var s = dgmState[toolId];
    if (!s || s.tabs.length <= 1) return;
    var idx = -1;
    for (var i = 0; i < s.tabs.length; i++) {
        if (s.tabs[i].id === tabId) { idx = i; break; }
    }
    if (idx === -1) return;
    s.tabs.splice(idx, 1);
    if (tabId === s.activeTabId) {
        var newIdx = Math.min(idx, s.tabs.length - 1);
        var newTab = s.tabs[newIdx];
        s.activeTabId = newTab.id;
        s.shapes = newTab.shapes || [];
        s.nextId = newTab.nextId || 1;
        s.viewX = newTab.viewX || 0;
        s.viewY = newTab.viewY || 0;
        s.zoom = newTab.zoom || 1;
        s.undoStack = [];
        s.selectedIds = [];
    }
    dgmSaveData(toolId);
    dgmRenderTabs(toolId);
    dgmDraw(toolId);
}

function dgmRenameTab(el, tabId) {
    var toolId = el.closest('.tool').getAttribute('data-tool');
    var s = dgmState[toolId];
    if (!s) return;
    var tab = null;
    for (var i = 0; i < s.tabs.length; i++) {
        if (s.tabs[i].id === tabId) { tab = s.tabs[i]; break; }
    }
    if (!tab) return;
    var name = prompt('Rename tab:', tab.name);
    if (name !== null && name.trim() !== '') {
        tab.name = name.trim();
        dgmSaveData(toolId);
        dgmRenderTabs(toolId);
    }
}

function dgmInit() {
    document.querySelectorAll('.dgm-widget').forEach(function(widget) {
        if (widget.dataset.dgmInited) return;
        widget.dataset.dgmInited = '1';
        var toolId = widget.closest('.tool').getAttribute('data-tool');
        var s = dgmGetState(toolId);
        s.widget = widget;
        var wrap = widget.querySelector('.dgm-canvas-wrap');
        var canvas = wrap.querySelector('.dgm-canvas');

        // Set canvas size
        var cw = wrap.clientWidth || 400;
        var ch = wrap.clientHeight || 300;
        canvas.width = cw;
        canvas.height = ch;

        s.canvas = canvas;
        s.ctx = canvas.getContext('2d');

        // Make tool container focusable for keyboard events
        var toolEl = widget.closest('.tool');
        toolEl.setAttribute('tabindex', '0');
        toolEl.style.outline = 'none';

        // Prevent context menu on canvas so right-click can pan
        canvas.addEventListener('contextmenu', function(e) { e.preventDefault(); });

        // Mouse events — move/up on document so drag survives leaving canvas
        canvas.addEventListener('mousedown', function(e) { toolEl.focus(); dgmMouseDown(toolId, e); });
        document.addEventListener('mousemove', function(e) { dgmMouseMove(toolId, e); });
        document.addEventListener('mouseup', function(e) { dgmMouseUp(toolId, e); });
        canvas.addEventListener('mousemove', function(e) { dgmHover(toolId, e); });
        canvas.addEventListener('wheel', function(e) { dgmWheel(toolId, e); }, { passive: false });
        canvas.addEventListener('dblclick', function(e) { dgmDblClick(toolId, e); });

        // Touch events
        canvas.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                var t = e.touches[0];
                dgmMouseDown(toolId, { clientX: t.clientX, clientY: t.clientY, button: 0, preventDefault: function(){} });
            }
            if (e.touches.length === 2) {
                e.preventDefault();
                var t0 = e.touches[0], t1 = e.touches[1];
                s._pinchDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
                s._pinchZoom = s.zoom;
                s._pinchMX = (t0.clientX + t1.clientX) / 2;
                s._pinchMY = (t0.clientY + t1.clientY) / 2;
                s._pinchVX = s.viewX;
                s._pinchVY = s.viewY;
            }
        }, { passive: false });
        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if (e.touches.length === 1) {
                var t = e.touches[0];
                dgmMouseMove(toolId, { clientX: t.clientX, clientY: t.clientY });
            }
            if (e.touches.length === 2) {
                var t0 = e.touches[0], t1 = e.touches[1];
                var dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
                var ratio = dist / (s._pinchDist || 1);
                var newZoom = Math.max(0.1, Math.min(5, s._pinchZoom * ratio));
                var rect = canvas.getBoundingClientRect();
                var mx = s._pinchMX - rect.left, my = s._pinchMY - rect.top;
                s.viewX = mx - (mx - s._pinchVX) * (newZoom / s._pinchZoom);
                s.viewY = my - (my - s._pinchVY) * (newZoom / s._pinchZoom);
                s.zoom = newZoom;
                dgmDraw(toolId);
            }
        }, { passive: false });
        canvas.addEventListener('touchend', function(e) {
            if (e.touches.length === 0) {
                dgmMouseUp(toolId, {});
            }
        });

        // Keyboard
        widget.closest('.tool').addEventListener('keydown', function(e) {
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
            if ((e.key === 'Delete' || e.key === 'Backspace') && s.selectedIds.length > 0) {
                e.preventDefault();
                dgmPushUndo(s);
                var delIds = s.selectedIds.slice();
                s.shapes = s.shapes.filter(function(sh) { return delIds.indexOf(sh.id) === -1; });
                for (var ci = 0; ci < s.shapes.length; ci++) {
                    if (s.shapes[ci].startConn && delIds.indexOf(s.shapes[ci].startConn.shapeId) !== -1) s.shapes[ci].startConn = null;
                    if (s.shapes[ci].endConn && delIds.indexOf(s.shapes[ci].endConn.shapeId) !== -1) s.shapes[ci].endConn = null;
                }
                s.selectedIds = [];
                dgmSaveData(toolId);
                dgmDraw(toolId);
            }
            if (e.key === 'z' && (e.ctrlKey || e.metaKey) && s.undoStack.length > 0) {
                e.preventDefault();
                s.shapes = s.undoStack.pop();
                s.selectedIds = [];
                dgmSaveData(toolId);
                dgmDraw(toolId);
            }
            if (e.key === 'Escape') {
                dgmHideContextMenu(toolId);
                s.selectedIds = [];
                dgmFinishTextEdit(toolId);
                dgmDraw(toolId);
            }
            if (e.key === 'x' && (e.ctrlKey || e.metaKey) && s.selectedIds.length > 0) {
                e.preventDefault();
                var copied = [];
                for (var ci = 0; ci < s.shapes.length; ci++) {
                    if (s.selectedIds.indexOf(s.shapes[ci].id) !== -1) {
                        copied.push(JSON.parse(JSON.stringify(s.shapes[ci])));
                    }
                }
                dgmClipboard = copied;
                dgmPushUndo(s);
                var delIds = s.selectedIds.slice();
                s.shapes = s.shapes.filter(function(sh) { return delIds.indexOf(sh.id) === -1; });
                for (var ci = 0; ci < s.shapes.length; ci++) {
                    if (s.shapes[ci].startConn && delIds.indexOf(s.shapes[ci].startConn.shapeId) !== -1) s.shapes[ci].startConn = null;
                    if (s.shapes[ci].endConn && delIds.indexOf(s.shapes[ci].endConn.shapeId) !== -1) s.shapes[ci].endConn = null;
                }
                s.selectedIds = [];
                dgmSaveData(toolId);
                dgmDraw(toolId);
            }
            if (e.key === 'c' && (e.ctrlKey || e.metaKey) && s.selectedIds.length > 0) {
                e.preventDefault();
                var copied = [];
                for (var ci = 0; ci < s.shapes.length; ci++) {
                    if (s.selectedIds.indexOf(s.shapes[ci].id) !== -1) {
                        copied.push(JSON.parse(JSON.stringify(s.shapes[ci])));
                    }
                }
                dgmClipboard = copied;
            }
            if (e.key === 'v' && (e.ctrlKey || e.metaKey) && dgmClipboard && dgmClipboard.length > 0) {
                e.preventDefault();
                dgmPushUndo(s);
                var newIds = [];
                var idMap = {};
                for (var ci = 0; ci < dgmClipboard.length; ci++) {
                    var clone = JSON.parse(JSON.stringify(dgmClipboard[ci]));
                    var oldId = clone.id;
                    clone.id = s.nextId++;
                    idMap[oldId] = clone.id;
                    clone.startConn = null;
                    clone.endConn = null;
                    if (clone.type === 'line' || clone.type === 'arrow') {
                        clone.x1 += 20; clone.y1 += 20;
                        clone.x2 += 20; clone.y2 += 20;
                    } else {
                        clone.x += 20; clone.y += 20;
                    }
                    s.shapes.push(clone);
                    newIds.push(clone.id);
                }
                s.selectedIds = newIds;
                // Advance clipboard position for cascading paste
                for (var ci = 0; ci < dgmClipboard.length; ci++) {
                    if (dgmClipboard[ci].type === 'line' || dgmClipboard[ci].type === 'arrow') {
                        dgmClipboard[ci].x1 += 20; dgmClipboard[ci].y1 += 20;
                        dgmClipboard[ci].x2 += 20; dgmClipboard[ci].y2 += 20;
                    } else {
                        dgmClipboard[ci].x += 20; dgmClipboard[ci].y += 20;
                    }
                }
                dgmSaveData(toolId);
                dgmDraw(toolId);
            }
            if (e.key === 'd' && (e.ctrlKey || e.metaKey) && s.selectedIds.length > 0) {
                e.preventDefault();
                dgmPushUndo(s);
                var newIds = [];
                for (var ci = 0; ci < s.shapes.length; ci++) {
                    if (s.selectedIds.indexOf(s.shapes[ci].id) !== -1) {
                        var dup = JSON.parse(JSON.stringify(s.shapes[ci]));
                        dup.id = s.nextId++;
                        dup.startConn = null;
                        dup.endConn = null;
                        if (dup.type === 'line' || dup.type === 'arrow') {
                            dup.x1 += 20; dup.y1 += 20;
                            dup.x2 += 20; dup.y2 += 20;
                        } else {
                            dup.x += 20; dup.y += 20;
                        }
                        s.shapes.push(dup);
                        newIds.push(dup.id);
                    }
                }
                s.selectedIds = newIds;
                dgmSaveData(toolId);
                dgmDraw(toolId);
            }
            if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                s.selectedIds = s.shapes.map(function(sh) { return sh.id; });
                dgmDraw(toolId);
            }
            if (e.key === ']' && s.selectedIds.length > 0) {
                e.preventDefault();
                dgmPushUndo(s);
                var sel = [], rest = [];
                for (var ci = 0; ci < s.shapes.length; ci++) {
                    if (s.selectedIds.indexOf(s.shapes[ci].id) !== -1) sel.push(s.shapes[ci]);
                    else rest.push(s.shapes[ci]);
                }
                s.shapes = rest.concat(sel);
                dgmSaveData(toolId);
                dgmDraw(toolId);
            }
            if (e.key === '[' && s.selectedIds.length > 0) {
                e.preventDefault();
                dgmPushUndo(s);
                var sel = [], rest = [];
                for (var ci = 0; ci < s.shapes.length; ci++) {
                    if (s.selectedIds.indexOf(s.shapes[ci].id) !== -1) sel.push(s.shapes[ci]);
                    else rest.push(s.shapes[ci]);
                }
                s.shapes = sel.concat(rest);
                dgmSaveData(toolId);
                dgmDraw(toolId);
            }
        });

        // ResizeObserver
        var ro = new ResizeObserver(function() {
            var w = wrap.clientWidth || 400;
            var h = wrap.clientHeight || 300;
            canvas.width = w;
            canvas.height = h;
            dgmDraw(toolId);
        });
        ro.observe(wrap);

        // Sync fill/stroke/text inputs
        var fillInput = widget.querySelector('.dgm-fill-input');
        var strokeInput = widget.querySelector('.dgm-stroke-input');
        var widthSelect = widget.querySelector('.dgm-width-select');
        var textColorInput = widget.querySelector('.dgm-textcolor-input');
        if (fillInput) fillInput.value = s.fill;
        if (strokeInput) strokeInput.value = s.stroke;
        if (widthSelect) widthSelect.value = s.strokeWidth;
        var dashSelect = widget.querySelector('.dgm-dash-select');
        if (dashSelect) dashSelect.value = s.lineDash || 'solid';
        if (textColorInput) textColorInput.value = s.textColor || '#000000';
        var textSizeSelect = widget.querySelector('.dgm-textsize-select');
        if (textSizeSelect) textSizeSelect.value = s.textSize || 14;
        var alignBtns = widget.querySelectorAll('.dgm-align-btn');
        for (var ai = 0; ai < alignBtns.length; ai++) {
            alignBtns[ai].classList.remove('active');
            if (alignBtns[ai].getAttribute('data-align') === (s.textAlign || 'center')) {
                alignBtns[ai].classList.add('active');
            }
        }
        var valignBtns = widget.querySelectorAll('.dgm-valign-btn');
        for (var ai = 0; ai < valignBtns.length; ai++) {
            valignBtns[ai].classList.remove('active');
            if (valignBtns[ai].getAttribute('data-valign') === (s.textVAlign || 'middle')) {
                valignBtns[ai].classList.add('active');
            }
        }

        dgmRenderTabs(toolId);
        dgmDraw(toolId);
    });

    // Watch for dark mode toggle and redraw all instances
    if (!dgmInit._themeObserver) {
        dgmInit._themeObserver = new MutationObserver(function() {
            for (var tid in dgmState) {
                if (dgmState[tid] && dgmState[tid].canvas) dgmDraw(tid);
            }
        });
        dgmInit._themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
}

// =============================================
// SCRIPT INJECTION FOR HTML EXPORT
// =============================================

(function injectScriptsForExport() {
    if (document.getElementById('diagram-tools-scripts')) return;

    var seqFunctions = [seqGetToolId, seqGetData, seqSaveData, seqInit, seqUpdateContainers, seqOnInput, seqSetMode, seqShowHelp, seqParseColors, seqParseText, seqRenderDiagram];
    var ftreeFunctions = [ftreeGetToolId, ftreeGetData, ftreeSaveData, ftreeDefaultData, ftreeGetVisiblePersons, ftreeFilterVisibleData, ftreeInit, ftreeComputeLayout, ftreeRender, ftreeSetupPanZoom, ftreeApplyTransform, ftreeUpdateZoomLabel, ftreeSaveViewState, ftreeZoomIn, ftreeZoomOut, ftreeFitView, ftreeResetView, ftreeNodeClick, ftreeShowNodePopup, ftreeClosePopup, ftreePopupEditField, ftreePopupEditGender, ftreePopupEditColor, ftreeNextPersonId, ftreeShowAddPopup, ftreeCloseAddPopup, ftreeAddPopupSave, ftreeAddParent, ftreeAddChild, ftreeAddSpouse, ftreeDeletePerson, ftreeToggleChildren, ftreeToggleParents, ftreeNodeToggleChildren, ftreeNodeToggleParents, ftreeOpenEditor, ftreeCloseEditor, ftreeEditorSave, ftreeEditorClear, ftreeToggleForm, ftreeGetSpouse, ftreeGetChildrenOf, ftreeGetParentsOf, ftreeRenderForm, ftreeFormEditField, ftreeFormEditGender, ftreeFormAddPerson, ftreeFormAddChild, ftreeFormAddParent, ftreeFormAddSpouse, ftreeFormSetRoot, ftreeFormDelete];
    var mermDiagFunctions = [mermDiagGetToolId, mermDiagGetWidget, mermDiagLoadLib, mermDiagSaveData, mermDiagLoadData, mermDiagRender, mermDiagOnInput, mermDiagInsertTemplate, mermDiagExportSvg, mermDiagExportPng, mermDiagInit];
    var dgmFunctions = [dgmGetToolId, dgmNewState, dgmGetState, dgmSaveData, dgmPushUndo, dgmScreenToWorld, dgmWorldToScreen, dgmUnrotatePoint, dgmRotatePoint, dgmPointInRect, dgmPointInEllipse, dgmPointInDiamond, dgmPointNearLine, dgmGetCurvePoints, dgmDrawCurvePath, dgmEvalCurveAt, dgmCurveTangentAt, dgmGetCurveMidHandles, dgmHitCurveMidHandle, dgmHitBendPoint, dgmPointToSegmentDist, dgmClipLineByBox, dgmHitLineText, dgmHitTest, dgmGetHandles, dgmHitHandle, dgmHitRotHandle, dgmHitLineHandle, dgmGetPorts, dgmFindSnapPort, dgmResolveConnections, dgmMouseDown, dgmMouseMove, dgmMouseUp, dgmWheel, dgmDblClick, dgmHover, dgmHideContextMenu, dgmShowContextMenu, dgmContextAction, dgmSyncToolbar, dgmInvertColor, dgmDraw, dgmDrawGrid, dgmDrawShape, dgmDrawArrowhead, dgmDrawPorts, dgmDrawSelection, dgmDrawGhost, dgmStartTextEdit, dgmFinishTextEdit, dgmSetTool, dgmAddShape, dgmSetFill, dgmToggleTransparentFill, dgmSetStroke, dgmSetStrokeWidth, dgmSetLineDash, dgmSetTextColor, dgmSetTextSize, dgmSetTextAlign, dgmSetTextVAlign, dgmSetTextRotation, dgmDeleteSelected, dgmSendToFront, dgmSendToBack, dgmUndo, dgmExportPNG, dgmRenderTabs, dgmSwitchTab, dgmAddTab, dgmCloseTab, dgmRenameTab, dgmInit];

    var allFunctions = seqFunctions.concat(ftreeFunctions).concat(mermDiagFunctions).concat(dgmFunctions);

    var code = '(function() {\n' +
        'if (typeof seqGetToolId !== "undefined") return;\n' +
        'var mermaidDiagLoaded = false;\n' +
        'var mermaidDiagRenderCounter = 0;\n' +
        'var dgmState = {};\n' +
        'var dgmClipboard = null;\n' +
        'window.DGM_BRAIN_PATHS = ' + JSON.stringify(DGM_BRAIN_PATHS) + ';\n' +
        'window.FTREE_NODE_W = ' + FTREE_NODE_W + ';\n' +
        'window.FTREE_NODE_H = ' + FTREE_NODE_H + ';\n' +
        'window.FTREE_H_GAP = ' + FTREE_H_GAP + ';\n' +
        'window.FTREE_V_GAP = ' + FTREE_V_GAP + ';\n' +
        'window.FTREE_SPOUSE_GAP = ' + FTREE_SPOUSE_GAP + ';\n' +
        allFunctions.map(fn => 'window.' + fn.name + ' = ' + fn.toString()).join(';\n') + ';\n' +
        '})();';
    var encoded = btoa(unescape(encodeURIComponent(code)));

    var script = document.createElement('script');
    script.id = 'diagram-tools-scripts';
    script.textContent = 'eval(decodeURIComponent(escape(atob("' + encoded + '"))))';
    (document.body || document.head).appendChild(script);
})();

// Sequence Diagram
PluginRegistry.registerTool({
    id: 'sequence-diagram',
    name: 'Sequence Diagram',
    description: 'Create sequence diagrams from simple text notation',
    icon: '\uD83D\uDCCA',
    version: '1.0.0',
    toolbox: 'diagram-tools',
    tags: ['diagram', 'uml', 'sequence'],
    title: 'Sequence Diagram',
    content: `<div class="seq-widget">
<div class="seq-toolbar">
<div class="seq-mode-toggle">
<button class="seq-mode-btn" onclick="seqSetMode(this, 'edit')">Edit</button>
<button class="seq-mode-btn active" onclick="seqSetMode(this, 'split')">Split</button>
<button class="seq-mode-btn" onclick="seqSetMode(this, 'view')">View</button>
</div>
<button class="seq-help-btn" onclick="seqShowHelp(this)">? Syntax Help</button>
</div>
<div class="seq-edit-container">
<textarea placeholder="Enter sequence diagram notation..." oninput="seqOnInput(this)"></textarea>
</div>
<div class="seq-split-container active">
<div class="seq-edit-pane">
<textarea placeholder="Enter sequence diagram notation...

Example:
Alice -> Bob: Hello
Bob --> Alice: Hi there!
Bob -> Charlie: Forward
Charlie --> Bob: Reply" oninput="seqOnInput(this)"></textarea>
</div>
<div class="seq-split-resizer"></div>
<div class="seq-view-pane">
<div class="seq-diagram"></div>
</div>
</div>
<div class="seq-view-container">
<div class="seq-diagram"></div>
</div>
<div class="seq-help-text">
<code>A -> B: msg</code> | <code>Note over A: text</code> | Colors: <code>[red]</code> or <code>[line:red, text:blue]</code>
</div>
</div>`,
    contentType: 'html',
    onInit: 'seqInit',
    source: 'external'
});

// Family Tree
PluginRegistry.registerTool({
    id: 'family-tree',
    name: 'Family Tree',
    description: 'Interactive family tree with pan/zoom',
    icon: '\uD83C\uDF33',
    version: '1.0.0',
    toolbox: 'diagram-tools',
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

// Mermaid Diagram
PluginRegistry.registerTool({
    id: 'mermaid-diagram',
    name: 'Mermaid Diagram',
    description: 'Create diagrams from text using Mermaid.js — flowcharts, sequence diagrams, class diagrams, ER diagrams, Gantt charts, and more',
    icon: '\uD83E\uDDDC',
    version: '1.0.0',
    toolbox: 'diagram-tools',
    tags: ['mermaid', 'diagram', 'flowchart', 'sequence', 'class', 'er', 'gantt', 'chart', 'graph', 'uml', 'visualization'],
    title: 'Mermaid Diagram',
    content: '<div class="mermaid-diag-widget">' +
        '<div class="mermaid-diag-toolbar">' +
            '<select onchange="mermDiagInsertTemplate(this)">' +
                '<option value="">Insert template...</option>' +
                '<option value="flowchart">Flowchart</option>' +
                '<option value="sequence">Sequence Diagram</option>' +
                '<option value="classDiagram">Class Diagram</option>' +
                '<option value="stateDiagram">State Diagram</option>' +
                '<option value="erDiagram">ER Diagram</option>' +
                '<option value="gantt">Gantt Chart</option>' +
                '<option value="pie">Pie Chart</option>' +
                '<option value="gitgraph">Git Graph</option>' +
            '</select>' +
            '<span style="flex:1;"></span>' +
            '<button class="pomo-btn" onclick="mermDiagExportSvg(this)" title="Export as SVG">SVG</button>' +
            '<button class="pomo-btn" onclick="mermDiagExportPng(this)" title="Export as PNG">PNG</button>' +
        '</div>' +
        '<div class="mermaid-diag-body">' +
            '<div class="mermaid-diag-editor">' +
                '<textarea spellcheck="false" oninput="mermDiagOnInput(this)" placeholder="Enter Mermaid syntax..."></textarea>' +
            '</div>' +
            '<div class="mermaid-diag-preview"></div>' +
        '</div>' +
        '<div class="mermaid-diag-status"></div>' +
    '</div>',
    onInit: 'mermDiagInit',
    defaultWidth: 600,
    defaultHeight: 400,
    source: 'external'
});

// Diagram
PluginRegistry.registerTool({
    id: 'diagram',
    name: 'Diagram',
    description: 'Diagram editor — draw shapes, connect with arrows, pan and zoom',
    icon: '\uD83D\uDCD0',
    version: '1.0.0',
    toolbox: 'diagram-tools',
    tags: ['diagram', 'flowchart', 'draw', 'shapes', 'arrows', 'excalidraw', 'lucidchart', 'whiteboard'],
    title: 'Diagram',
    content: '<div class="dgm-widget">' +
        '<div class="dgm-toolbar">' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'rect\')" title="Add Rectangle"><svg width="16" height="12" viewBox="0 0 16 12"><rect x="1" y="1" width="14" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'ellipse\')" title="Add Ellipse"><svg width="16" height="14" viewBox="0 0 16 14"><ellipse cx="8" cy="7" rx="7" ry="6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'diamond\')" title="Add Diamond"><svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,1 13,7 7,13 1,7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'cylinder\')" title="Add Cylinder"><svg width="14" height="16" viewBox="0 0 14 16"><ellipse cx="7" cy="3.5" rx="5.5" ry="2.5" fill="none" stroke="currentColor" stroke-width="1.3"/><line x1="1.5" y1="3.5" x2="1.5" y2="12.5" stroke="currentColor" stroke-width="1.3"/><line x1="12.5" y1="3.5" x2="12.5" y2="12.5" stroke="currentColor" stroke-width="1.3"/><path d="M1.5,12.5 A5.5,2.5 0 0,0 12.5,12.5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'cube\')" title="Add Cube"><svg width="16" height="16" viewBox="0 0 16 16"><polygon points="1,5 8,1 15,5 15,12 8,16 1,12" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><line x1="1" y1="5" x2="8" y2="9" stroke="currentColor" stroke-width="1.2"/><line x1="15" y1="5" x2="8" y2="9" stroke="currentColor" stroke-width="1.2"/><line x1="8" y1="9" x2="8" y2="16" stroke="currentColor" stroke-width="1.2"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'stack\')" title="Add Stack"><svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="1" width="4" height="14" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2"/><rect x="6" y="1" width="4" height="14" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="11" y="1" width="4" height="14" fill="none" stroke="currentColor" stroke-width="1.3"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'envelope\')" title="Add Envelope"><svg width="16" height="12" viewBox="0 0 16 12"><rect x="1" y="1" width="14" height="10" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.3"/><polyline points="1,1 8,6 15,1" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'note\')" title="Add Note"><svg width="14" height="16" viewBox="0 0 14 16"><path d="M1,1 L10,1 L13,4 L13,15 L1,15 Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><polyline points="10,1 10,4 13,4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'cloud\')" title="Add Cloud"><svg width="22" height="17" viewBox="0 0 18 14"><path d="M3.5,10 L14.5,10 A2.5,2.5 0 0,0 13,6.5 A2.8,2.8 0 0,0 10,3.5 A3.2,3.2 0 0,0 6,3.8 A2.5,2.5 0 0,0 3.5,7 A2,2 0 0,0 3.5,10 Z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'human\')" title="Add Human"><svg width="22" height="22" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="6.2" cy="7.2" r="0.7" fill="currentColor"/><circle cx="9.8" cy="7.2" r="0.7" fill="currentColor"/><path d="M6,9.5 A2.5,2 0 0,0 10,9.5" fill="none" stroke="currentColor" stroke-width="1"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'robot\')" title="Add Robot"><svg width="20" height="20" viewBox="0 0 16 16"><line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="1" r="1" fill="currentColor"/><rect x="3" y="3" width="10" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="6" cy="7" r="1" fill="currentColor"/><circle cx="10" cy="7" r="1" fill="currentColor"/><line x1="5.5" y1="10" x2="10.5" y2="10" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="5.5" width="1.5" height="3" rx="0.5" fill="none" stroke="currentColor" stroke-width="1"/><rect x="13.5" y="5.5" width="1.5" height="3" rx="0.5" fill="none" stroke="currentColor" stroke-width="1"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'clock\')" title="Add Clock"><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.3"/><line x1="8" y1="8" x2="5" y2="4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="8" x2="11" y2="5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><circle cx="8" cy="8" r="0.8" fill="currentColor"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'gear\')" title="Add Gear"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M7,1.2 L9,1.2 L9.3,2.8 L10.8,3.4 L12.1,2.3 L13.1,3.3 L12,4.6 L12.6,6.1 L14.2,6.4 L14.2,8.4 L12.6,8.7 L12,10.2 L13.1,11.5 L12.1,12.5 L10.8,11.4 L9.3,12 L9,13.6 L7,13.6 L6.7,12 L5.2,11.4 L3.9,12.5 L2.9,11.5 L4,10.2 L3.4,8.7 L1.8,8.4 L1.8,6.4 L3.4,6.1 L4,4.6 L2.9,3.3 L3.9,2.3 L5.2,3.4 L6.7,2.8 Z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'brain\')" title="Add Brain"><svg width="18" height="18" viewBox="40 68 280 224"><path d="M 174 76 L 190 77 L 204 80 L 216 82 L 228 84 L 240 90 L 250 96 L 260 106 L 270 114 L 280 124 L 288 136 L 294 148 L 298 160 L 304 172 L 308 184 L 308 196 L 304 208 L 296 218 L 288 226 L 278 234 L 268 240 L 258 248 L 248 254 L 238 257 L 233 257 L 232 262 L 234 270 L 236 276 L 232 282 L 224 284 L 216 282 L 208 276 L 200 264 L 192 254 L 186 248 L 176 250 L 164 254 L 152 255 L 140 252 L 130 246 L 122 240 L 116 234 L 113 228 L 104 226 L 92 222 L 80 216 L 70 208 L 62 200 L 56 190 L 52 180 L 50 170 L 50 160 L 54 150 L 58 142 L 64 136 L 72 130 L 80 124 L 88 118 L 98 112 L 108 106 L 118 100 L 130 94 L 140 88 L 150 84 L 162 80 Z" fill="none" stroke="currentColor" stroke-width="20" stroke-linejoin="bevel"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'text\')" title="Add Text"><svg width="14" height="14" viewBox="0 0 14 14"><line x1="3" y1="2.5" x2="11" y2="2.5" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="2.5" x2="7" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
            '<div class="dgm-tool-sep"></div>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'line\')" title="Add Line"><svg width="14" height="14" viewBox="0 0 14 14"><line x1="2" y1="12" x2="12" y2="2" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'arrow\')" title="Add Arrow"><svg width="14" height="14" viewBox="0 0 14 14"><line x1="2" y1="12" x2="12" y2="2" stroke="currentColor" stroke-width="1.5"/><polyline points="7,2 12,2 12,7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
            '<button class="dgm-tool-btn" onclick="dgmAddShape(this,\'arrow2\')" title="Add 2-Way Arrow"><svg width="14" height="14" viewBox="0 0 14 14"><line x1="2" y1="12" x2="12" y2="2" stroke="currentColor" stroke-width="1.5"/><polyline points="7,2 12,2 12,7" fill="none" stroke="currentColor" stroke-width="1.5"/><polyline points="7,12 2,12 2,7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
            '<div class="dgm-tool-sep"></div>' +
            '<label>Fill</label>' +
            '<input type="color" class="dgm-fill-input" value="#ffffff" onchange="dgmSetFill(this)" oninput="dgmSetFill(this)">' +
            '<button class="dgm-nofill-btn" onclick="dgmToggleTransparentFill(this)" title="No fill"><svg width="14" height="14" viewBox="0 0 14 14"><rect x="1" y="1" width="12" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><line x1="1" y1="13" x2="13" y2="1" stroke="red" stroke-width="1.5"/></svg></button>' +
            '<label>Line</label>' +
            '<input type="color" class="dgm-stroke-input" value="#000000" onchange="dgmSetStroke(this)" oninput="dgmSetStroke(this)">' +
            '<select class="dgm-width-select" onchange="dgmSetStrokeWidth(this)">' +
                '<option value="1">1px</option>' +
                '<option value="2" selected>2px</option>' +
                '<option value="3">3px</option>' +
                '<option value="4">4px</option>' +
                '<option value="6">6px</option>' +
            '</select>' +
            '<select class="dgm-dash-select" onchange="dgmSetLineDash(this)">' +
                '<option value="solid">\u2500\u2500\u2500</option>' +
                '<option value="dashed">\u2504\u2504\u2504</option>' +
                '<option value="dotted">\u2508\u2508\u2508</option>' +
            '</select>' +
            '<div class="dgm-tool-sep"></div>' +
            '<label>Text</label>' +
            '<input type="color" class="dgm-textcolor-input" value="#000000" onchange="dgmSetTextColor(this)" oninput="dgmSetTextColor(this)">' +
            '<select class="dgm-textsize-select" onchange="dgmSetTextSize(this)">' +
                '<option value="10">10</option>' +
                '<option value="12">12</option>' +
                '<option value="14" selected>14</option>' +
                '<option value="16">16</option>' +
                '<option value="18">18</option>' +
                '<option value="20">20</option>' +
                '<option value="24">24</option>' +
                '<option value="28">28</option>' +
                '<option value="32">32</option>' +
                '<option value="40">40</option>' +
                '<option value="48">48</option>' +
            '</select>' +
            '<select class="dgm-textrot-select" onchange="dgmSetTextRotation(this)" title="Text rotation">' +
                '<option value="0">0\u00B0</option>' +
                '<option value="90">90\u00B0</option>' +
                '<option value="180">180\u00B0</option>' +
                '<option value="270">270\u00B0</option>' +
            '</select>' +
            '<button class="dgm-align-btn" onclick="dgmSetTextAlign(this,\'left\')" title="Align left" data-align="left"><svg width="12" height="10" viewBox="0 0 12 10"><line x1="0" y1="1" x2="10" y2="1" stroke="currentColor" stroke-width="1.5"/><line x1="0" y1="5" x2="7" y2="5" stroke="currentColor" stroke-width="1.5"/><line x1="0" y1="9" x2="10" y2="9" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
            '<button class="dgm-align-btn active" onclick="dgmSetTextAlign(this,\'center\')" title="Align center" data-align="center"><svg width="12" height="10" viewBox="0 0 12 10"><line x1="1" y1="1" x2="11" y2="1" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="5" x2="9" y2="5" stroke="currentColor" stroke-width="1.5"/><line x1="1" y1="9" x2="11" y2="9" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
            '<button class="dgm-align-btn" onclick="dgmSetTextAlign(this,\'right\')" title="Align right" data-align="right"><svg width="12" height="10" viewBox="0 0 12 10"><line x1="2" y1="1" x2="12" y2="1" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="5" x2="12" y2="5" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="9" x2="12" y2="9" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
            '<button class="dgm-valign-btn" onclick="dgmSetTextVAlign(this,\'top\')" title="Align top" data-valign="top"><svg width="12" height="12" viewBox="0 0 12 12"><line x1="1" y1="1" x2="11" y2="1" stroke="currentColor" stroke-width="2"/><line x1="1" y1="5" x2="11" y2="5" stroke="currentColor" stroke-width="1"/><line x1="1" y1="8.5" x2="11" y2="8.5" stroke="currentColor" stroke-width="1"/></svg></button>' +
            '<button class="dgm-valign-btn active" onclick="dgmSetTextVAlign(this,\'middle\')" title="Align middle" data-valign="middle"><svg width="12" height="12" viewBox="0 0 12 12"><line x1="1" y1="2" x2="11" y2="2" stroke="currentColor" stroke-width="1"/><line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" stroke-width="2"/><line x1="1" y1="10" x2="11" y2="10" stroke="currentColor" stroke-width="1"/></svg></button>' +
            '<button class="dgm-valign-btn" onclick="dgmSetTextVAlign(this,\'bottom\')" title="Align bottom" data-valign="bottom"><svg width="12" height="12" viewBox="0 0 12 12"><line x1="1" y1="3.5" x2="11" y2="3.5" stroke="currentColor" stroke-width="1"/><line x1="1" y1="7" x2="11" y2="7" stroke="currentColor" stroke-width="1"/><line x1="1" y1="11" x2="11" y2="11" stroke="currentColor" stroke-width="2"/></svg></button>' +
        '</div>' +
        '<div class="dgm-tabs">' +
            '<button class="dgm-tab-add" onclick="dgmAddTab(this)" title="Add tab">+</button>' +
        '</div>' +
        '<div class="dgm-canvas-wrap">' +
            '<canvas class="dgm-canvas"></canvas>' +
        '</div>' +
        '<div class="dgm-actions">' +
            '<button onclick="dgmUndo(this)">Undo</button>' +
            '<button onclick="dgmDeleteSelected(this)">Delete</button>' +
            '<button onclick="dgmSendToFront(this)" title="Send to front">\u25B2</button>' +
            '<button onclick="dgmSendToBack(this)" title="Send to back">\u25BC</button>' +
            '<span class="dgm-spacer"></span>' +
            '<span class="dgm-zoom-label">100%</span>' +
            '<button onclick="dgmExportPNG(this)">Export PNG</button>' +
        '</div>' +
    '</div>',
    contentType: 'html',
    onInit: 'dgmInit',
    source: 'external',
    defaultWidth: 600,
    defaultHeight: 480
});

console.log('Diagram Tools plugin loaded: 4 tools');
