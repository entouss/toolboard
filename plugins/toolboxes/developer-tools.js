// Developer Tools Toolbox Plugin
// Contains essential tools for software development

// Inject CSS styles for developer tools
(function() {
    if (document.getElementById('developer-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'developer-tools-styles';
    style.textContent = `
/* Diff Viewer Widget Styles */
.tool-content:has(.diff-widget) { display: flex; flex-direction: column; }
.diff-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; }
.diff-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 10px; flex-shrink: 0; flex-wrap: wrap; }
.diff-mode-toggle { display: flex; gap: 4px; }
.diff-mode-btn { padding: 6px 12px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.diff-mode-btn:first-child { border-radius: 4px 0 0 4px; }
.diff-mode-btn:last-child { border-radius: 0 4px 4px 0; }
.diff-mode-btn.active { background: #3498db; color: white; border-color: #3498db; }
.diff-view-options { display: flex; align-items: center; gap: 8px; }
.diff-view-btn { padding: 5px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 10px; border-radius: 3px; }
.diff-view-btn.active { background: #27ae60; color: white; border-color: #27ae60; }
.diff-whitespace-toggle { display: flex; align-items: center; gap: 4px; font-size: 10px; color: var(--text-secondary); }
.diff-whitespace-toggle input { margin: 0; }
.diff-edit-container { display: flex; gap: 10px; flex: 1; min-height: 0; }
.diff-edit-pane { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.diff-edit-pane label { font-weight: 600; margin-bottom: 6px; font-size: 11px; color: var(--text-heading); }
.diff-edit-pane textarea { flex: 1; resize: none; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); min-height: 100px; }
.diff-edit-pane textarea:focus { outline: none; border-color: #3498db; }
.diff-edit-resizer { width: 6px; background: var(--border-color); cursor: col-resize; border-radius: 3px; flex-shrink: 0; }
.diff-edit-resizer:hover { background: #3498db; }
.diff-view-container { flex: 1; min-height: 0; display: none; flex-direction: column; }
.diff-view-container.active { display: flex; }
.diff-edit-container.hidden { display: none; }
.diff-output { flex: 1; overflow: auto; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-tertiary); font-family: monospace; font-size: 12px; }
.diff-split-view { display: flex; min-height: 100%; }
.diff-split-pane { flex: 1; min-width: 0; }
.diff-split-pane:first-child { border-right: 1px solid var(--border-color); }
.diff-split-header { padding: 6px 10px; background: var(--bg-tool-header); color: white; font-weight: 600; font-size: 11px; position: sticky; top: 0; }
.diff-unified-view { min-height: 100%; }
.diff-line { display: flex; line-height: 1.5; min-height: 20px; }
.diff-gutter { width: 40px; padding: 0 6px; text-align: right; color: var(--text-muted); background: var(--bg-tertiary); border-right: 1px solid var(--border-light); flex-shrink: 0; font-size: 10px; user-select: none; }
.diff-content { flex: 1; padding: 0 8px; white-space: pre-wrap; word-break: break-all; min-width: 0; }
.diff-line.addition { background: rgba(39, 174, 96, 0.15); }
.diff-line.addition .diff-gutter { background: rgba(39, 174, 96, 0.3); color: #27ae60; }
.diff-line.deletion { background: rgba(231, 76, 60, 0.15); }
.diff-line.deletion .diff-gutter { background: rgba(231, 76, 60, 0.3); color: #e74c3c; }
.diff-line.unchanged { background: transparent; }
.diff-prefix { width: 16px; text-align: center; flex-shrink: 0; font-weight: bold; }
.diff-line.addition .diff-prefix { color: #27ae60; }
.diff-line.deletion .diff-prefix { color: #e74c3c; }
.diff-stats { display: flex; gap: 16px; padding: 8px 0; font-size: 11px; color: var(--text-secondary); border-top: 1px solid var(--border-light); margin-top: 8px; flex-shrink: 0; }
.diff-stats-additions { color: #27ae60; }
.diff-stats-deletions { color: #e74c3c; }
.diff-empty-message { padding: 20px; text-align: center; color: var(--text-muted); font-style: italic; }
body.dark-mode .diff-line.addition { background: rgba(39, 174, 96, 0.2); }
body.dark-mode .diff-line.addition .diff-gutter { background: rgba(39, 174, 96, 0.35); }
body.dark-mode .diff-line.deletion { background: rgba(231, 76, 60, 0.2); }
body.dark-mode .diff-line.deletion .diff-gutter { background: rgba(231, 76, 60, 0.35); }

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

/* JWT Decoder Widget */
.tool-content:has(.jwt-widget) { display: flex; flex-direction: column; }
.jwt-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 10px; }
.jwt-input-section { flex-shrink: 0; }
.jwt-input-section label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; font-weight: 600; }
.jwt-input-section textarea { width: 100%; min-height: 60px; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 11px; background: var(--input-bg); color: var(--text-primary); resize: vertical; box-sizing: border-box; word-break: break-all; }
.jwt-input-section textarea:focus { outline: none; border-color: #3498db; }
.jwt-output-section { flex: 1; display: flex; flex-direction: column; min-height: 0; overflow: auto; }
.jwt-parts { display: flex; flex-direction: column; gap: 10px; }
.jwt-part { background: var(--bg-tertiary); border-radius: 6px; overflow: hidden; }
.jwt-part-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; font-weight: 600; font-size: 11px; }
.jwt-part-header.header { background: #e74c3c; color: white; }
.jwt-part-header.payload { background: #9b59b6; color: white; }
.jwt-part-header.signature { background: #3498db; color: white; }
.jwt-part-content { padding: 10px 12px; font-family: monospace; font-size: 11px; white-space: pre-wrap; word-break: break-all; background: var(--bg-secondary); color: var(--text-primary); max-height: 200px; overflow-y: auto; }
.jwt-part-content.raw { color: var(--text-muted); font-size: 10px; }
.jwt-error { padding: 12px; background: var(--error-bg); color: var(--error-text); border-radius: 6px; font-size: 12px; }
.jwt-status { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 4px; font-size: 11px; font-weight: 500; }
.jwt-status.valid { background: var(--success-bg); color: var(--success-text); }
.jwt-status.invalid { background: var(--error-bg); color: var(--error-text); }
.jwt-status.info { background: var(--bg-tertiary); color: var(--text-secondary); }
.jwt-claims { margin-top: 8px; }
.jwt-claim { display: flex; padding: 4px 0; border-bottom: 1px solid var(--border-light); font-size: 11px; }
.jwt-claim:last-child { border-bottom: none; }
.jwt-claim-key { min-width: 80px; color: var(--text-muted); font-weight: 500; }
.jwt-claim-value { flex: 1; color: var(--text-primary); word-break: break-all; }
.jwt-claim-value.expired { color: #e74c3c; }
.jwt-claim-value.valid { color: #27ae60; }
.jwt-copy-btn { padding: 2px 8px; font-size: 10px; border: none; background: rgba(255,255,255,0.2); color: inherit; border-radius: 3px; cursor: pointer; }
.jwt-copy-btn:hover { background: rgba(255,255,255,0.3); }
.jwt-toolbar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.jwt-sample-btn { padding: 4px 10px; font-size: 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-secondary); border-radius: 3px; cursor: pointer; }
.jwt-sample-btn:hover { background: var(--table-hover); }

/* Code Formatter Widget Styles */
.tool-content:has(.fmt-widget) { display: flex; flex-direction: column; padding: 0; }
.fmt-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; }
.fmt-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 10px; flex-shrink: 0; flex-wrap: wrap; }
.fmt-format-toggle { display: flex; gap: 0; }
.fmt-format-btn { padding: 6px 12px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; margin-left: -1px; }
.fmt-format-btn:first-child { border-radius: 4px 0 0 4px; margin-left: 0; }
.fmt-format-btn:last-child { border-radius: 0 4px 4px 0; }
.fmt-format-btn.active { background: #3498db; color: white; border-color: #3498db; z-index: 1; }
.fmt-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.fmt-action-btn { padding: 6px 12px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.fmt-action-btn:hover { background: var(--table-hover); }
.fmt-container { flex: 1; display: flex; gap: 10px; min-height: 0; }
.fmt-pane { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.fmt-pane label { font-size: 11px; color: var(--text-secondary); margin-bottom: 4px; font-weight: 500; }
.fmt-pane textarea { flex: 1; resize: none; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); min-height: 100px; line-height: 1.4; white-space: pre; overflow-wrap: normal; overflow-x: auto; }
.fmt-pane textarea:focus { outline: none; border-color: #3498db; }
.fmt-pane textarea::placeholder { color: var(--text-muted); }
.fmt-pane textarea.fmt-output { background: var(--bg-tertiary); }
.fmt-resizer { width: 6px; background: var(--border-color); cursor: col-resize; border-radius: 3px; flex-shrink: 0; }
.fmt-resizer:hover { background: #3498db; }
.fmt-status { margin-top: 8px; font-size: 11px; color: var(--text-muted); min-height: 16px; }
.fmt-status.error { color: #e74c3c; }
.fmt-status.success { color: #27ae60; }

/* Cron Expression Widget Styles */
.tool-content:has(.cron-widget) { display: flex; flex-direction: column; padding: 0; }
.cron-widget { padding: 12px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 12px; }
.cron-input-section { display: flex; flex-direction: column; gap: 8px; }
.cron-input-row { display: flex; gap: 8px; align-items: center; }
.cron-input { flex: 1; padding: 10px 12px; font-family: monospace; font-size: 16px; border: 2px solid var(--border-color); border-radius: 6px; background: var(--input-bg); color: var(--text-primary); text-align: center; letter-spacing: 2px; }
.cron-input:focus { outline: none; border-color: #3498db; }
.cron-input.valid { border-color: #27ae60; }
.cron-input.invalid { border-color: #e74c3c; }
.cron-presets { display: flex; flex-wrap: wrap; gap: 6px; }
.cron-preset-btn { padding: 4px 10px; font-size: 11px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-tertiary); color: var(--text-secondary); cursor: pointer; }
.cron-preset-btn:hover { background: var(--table-hover); color: var(--text-primary); }
.cron-explanation { padding: 12px; background: var(--bg-tertiary); border-radius: 6px; min-height: 40px; }
.cron-explanation-text { font-size: 14px; color: var(--text-primary); line-height: 1.5; }
.cron-explanation-text strong { color: #3498db; }
.cron-error { color: #e74c3c; font-size: 13px; }
.cron-fields { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.cron-field { display: flex; flex-direction: column; align-items: center; padding: 10px 6px; background: var(--bg-tertiary); border-radius: 6px; border: 1px solid var(--border-color); }
.cron-field-value { font-family: monospace; font-size: 18px; font-weight: bold; color: #3498db; margin-bottom: 4px; }
.cron-field-name { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.cron-field-desc { font-size: 10px; color: var(--text-secondary); margin-top: 4px; text-align: center; }
.cron-schedule { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.cron-schedule-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.cron-schedule-title { font-size: 12px; font-weight: 500; color: var(--text-secondary); }
.cron-schedule-count { font-size: 11px; color: var(--text-muted); }
.cron-schedule-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; max-height: 150px; }
.cron-schedule-item { display: flex; justify-content: space-between; padding: 6px 10px; background: var(--bg-tertiary); border-radius: 4px; font-size: 12px; }
.cron-schedule-item:first-child { background: rgba(39, 174, 96, 0.1); border: 1px solid rgba(39, 174, 96, 0.3); }
.cron-schedule-date { color: var(--text-primary); font-family: monospace; }
.cron-schedule-relative { color: var(--text-muted); font-size: 11px; }

/* Regex Tester Widget Styles */
.tool-content:has(.regex-widget) { display: flex; flex-direction: column; padding: 0; }
.regex-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; }
.regex-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 10px; flex-shrink: 0; flex-wrap: wrap; }
.regex-flags { display: flex; gap: 10px; }
.regex-flags label { display: flex; align-items: center; gap: 3px; font-size: 12px; color: var(--text-secondary); cursor: pointer; font-family: monospace; }
.regex-flags input[type="checkbox"] { cursor: pointer; }
.regex-actions { display: flex; gap: 6px; }
.regex-action-btn { padding: 5px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.regex-action-btn:hover { background: var(--table-hover); }
.regex-input-row { margin-bottom: 8px; flex-shrink: 0; }
.regex-input-row label { display: block; font-size: 11px; color: var(--text-secondary); margin-bottom: 4px; font-weight: 500; }
.regex-pattern { width: 100%; padding: 8px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 13px; background: var(--input-bg); color: var(--text-primary); box-sizing: border-box; }
.regex-pattern:focus { outline: none; border-color: #3498db; }
.regex-container { flex: 1; display: flex; gap: 10px; min-height: 0; }
.regex-pane { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.regex-pane label { font-size: 11px; color: var(--text-secondary); margin-bottom: 4px; font-weight: 500; }
.regex-test-string { flex: 1; resize: none; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); min-height: 80px; line-height: 1.5; }
.regex-test-string:focus { outline: none; border-color: #3498db; }
.regex-results-pane { min-width: 0; }
.regex-results { flex: 1; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-tertiary); overflow: auto; font-family: monospace; font-size: 12px; line-height: 1.5; min-height: 80px; }
.regex-results .match-highlight { background: #f1c40f; color: #000; padding: 1px 2px; border-radius: 2px; }
.regex-results .match-group { background: #3498db; color: #fff; padding: 1px 2px; border-radius: 2px; }
.regex-results .match-info { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color); }
.regex-results .match-item { margin-bottom: 8px; padding: 6px 8px; background: var(--bg-secondary); border-radius: 4px; }
.regex-results .match-index { color: var(--text-muted); font-size: 10px; margin-bottom: 2px; }
.regex-results .match-value { color: var(--text-primary); word-break: break-all; }
.regex-results .match-groups { margin-top: 4px; padding-left: 10px; border-left: 2px solid var(--border-color); }
.regex-results .group-item { font-size: 11px; color: var(--text-secondary); }
.regex-results .no-match { color: var(--text-muted); font-style: italic; }
.regex-resizer { width: 6px; background: var(--border-color); cursor: col-resize; border-radius: 3px; flex-shrink: 0; }
.regex-resizer:hover { background: #3498db; }
.regex-status { margin-top: 8px; font-size: 11px; color: var(--text-muted); min-height: 16px; flex-shrink: 0; }
.regex-status.error { color: #e74c3c; }
.regex-status.success { color: #27ae60; }

/* Base64 Encoder/Decoder Widget Styles */
.tool-content:has(.b64-widget) { display: flex; flex-direction: column; padding: 0; }
.b64-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 8px; }
.b64-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
.b64-mode-toggle { display: flex; gap: 4px; }
.b64-mode-btn { padding: 6px 12px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.b64-mode-btn:first-child { border-radius: 4px 0 0 4px; }
.b64-mode-btn:last-child { border-radius: 0 4px 4px 0; }
.b64-mode-btn.active { background: #3498db; color: white; border-color: #3498db; }
.b64-actions { display: flex; gap: 4px; }
.b64-action-btn { padding: 5px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.b64-action-btn:hover { background: var(--table-hover); }
.b64-panes { display: flex; flex-direction: column; flex: 1; gap: 8px; min-height: 0; }
.b64-pane { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.b64-pane label { font-size: 11px; color: var(--text-secondary); font-weight: 500; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; }
.b64-pane label .b64-byte-count { font-weight: 400; color: var(--text-muted); }
.b64-pane textarea { flex: 1; resize: none; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); min-height: 60px; }
.b64-pane textarea:focus { outline: none; border-color: #3498db; }
.b64-status { font-size: 11px; color: var(--text-muted); min-height: 16px; flex-shrink: 0; }
.b64-status.error { color: #e74c3c; }
.b64-status.success { color: #27ae60; }

/* Epoch Converter Widget Styles */
.tool-content:has(.epoch-widget) { display: flex; flex-direction: column; padding: 0; }
.epoch-widget { padding: 12px; font-size: 12px; display: flex; flex-direction: column; gap: 14px; width: 100%; box-sizing: border-box; }
.epoch-section { display: flex; flex-direction: column; gap: 6px; }
.epoch-section > label { font-size: 11px; color: var(--text-secondary); font-weight: 500; }
.epoch-current { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: var(--bg-tertiary); border-radius: 4px; border: 1px solid var(--border-color); }
.epoch-now-value { font-family: monospace; font-size: 14px; color: var(--text-primary); flex: 1; }
.epoch-action-btn { padding: 4px 10px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.epoch-action-btn:hover { background: var(--table-hover); }
.epoch-input-row { display: flex; gap: 8px; }
.epoch-timestamp-input { flex: 1; padding: 8px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 13px; background: var(--input-bg); color: var(--text-primary); }
.epoch-timestamp-input:focus { outline: none; border-color: #3498db; }
.epoch-unit-select, .epoch-tz-select { padding: 8px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); cursor: pointer; }
.epoch-datetime-inputs { display: flex; gap: 8px; flex-wrap: wrap; }
.epoch-date-input, .epoch-time-input { padding: 8px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); font-family: monospace; }
.epoch-date-input:focus, .epoch-time-input:focus { outline: none; border-color: #3498db; }
.epoch-result { padding: 10px; background: var(--bg-tertiary); border-radius: 4px; border: 1px solid var(--border-color); font-family: monospace; font-size: 12px; line-height: 1.6; min-height: 20px; }
.epoch-result .result-row { display: flex; justify-content: space-between; align-items: center; padding: 2px 0; }
.epoch-result .result-label { color: var(--text-secondary); }
.epoch-result .result-value { color: var(--text-primary); font-weight: 500; }
.epoch-result .result-value.copyable { cursor: pointer; padding: 2px 6px; border-radius: 3px; }
.epoch-result .result-value.copyable:hover { background: var(--table-hover); }
.epoch-reference { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; background: var(--bg-tertiary); border-radius: 4px; border: 1px solid var(--border-color); }
.epoch-ref-item { display: flex; justify-content: space-between; align-items: center; font-size: 11px; }
.epoch-ref-item span { color: var(--text-secondary); }
.epoch-ref-item code { font-family: monospace; color: var(--text-primary); background: var(--bg-secondary); padding: 2px 6px; border-radius: 3px; }

/* Lorem Ipsum Generator Widget Styles */
.tool-content:has(.lorem-widget) { display: flex; flex-direction: column; padding: 0; }
.lorem-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 8px; }
.lorem-toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; flex-shrink: 0; }
.lorem-toolbar label { font-size: 11px; color: var(--text-secondary); font-weight: 500; }
.lorem-toolbar select, .lorem-toolbar input[type="number"] { padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); }
.lorem-toolbar input[type="number"] { width: 60px; font-family: monospace; }
.lorem-options { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; flex-shrink: 0; }
.lorem-option { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-secondary); }
.lorem-option input[type="checkbox"] { margin: 0; }
.lorem-actions { display: flex; gap: 4px; flex-shrink: 0; }
.lorem-action-btn { padding: 5px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.lorem-action-btn:hover { background: var(--table-hover); }
.lorem-action-btn.primary { background: #3498db; color: white; border-color: #3498db; }
.lorem-action-btn.primary:hover { background: #2980b9; }
.lorem-output { flex: 1; resize: none; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: system-ui, -apple-system, sans-serif; font-size: 13px; line-height: 1.6; background: var(--input-bg); color: var(--text-primary); min-height: 80px; }
.lorem-output:focus { outline: none; border-color: #3498db; }
.lorem-stats { font-size: 11px; color: var(--text-muted); flex-shrink: 0; display: flex; gap: 12px; }

/* ASCII / HTML Codes Widget Styles */
.tool-content:has(.ascii-widget) { display: flex; flex-direction: column; padding: 0; }
.ascii-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 8px; }
.ascii-toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; flex-shrink: 0; }
.ascii-search { flex: 1; min-width: 120px; padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); font-family: monospace; }
.ascii-search:focus { outline: none; border-color: #3498db; }
.ascii-range-btns { display: flex; gap: 4px; flex-wrap: wrap; }
.ascii-range-btn { padding: 4px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 10px; border-radius: 4px; white-space: nowrap; }
.ascii-range-btn.active { background: #3498db; color: white; border-color: #3498db; }
.ascii-range-btn:hover:not(.active) { background: var(--table-hover); }
.ascii-table-wrap { flex: 1; overflow: auto; min-height: 0; border: 1px solid var(--border-color); border-radius: 4px; }
.ascii-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.ascii-table th { position: sticky; top: 0; background: var(--bg-tool-header); color: white; padding: 6px 8px; text-align: left; font-weight: 600; font-size: 10px; letter-spacing: 0.5px; z-index: 1; }
.ascii-table td { padding: 4px 8px; border-bottom: 1px solid var(--border-light); color: var(--text-primary); font-family: monospace; white-space: nowrap; }
.ascii-table tr:hover td { background: var(--table-hover); }
.ascii-table .ascii-char-cell { font-size: 14px; text-align: center; min-width: 32px; }
.ascii-table .ascii-desc-cell { color: var(--text-secondary); font-family: system-ui, -apple-system, sans-serif; }
.ascii-table .ascii-html-cell { color: #e67e22; }
.ascii-table tr.ascii-control td { opacity: 0.7; }
.ascii-table tr.ascii-highlight td { background: rgba(52,152,219,0.12); }
.ascii-copy-toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #27ae60; color: white; padding: 6px 16px; border-radius: 4px; font-size: 12px; z-index: 9999; pointer-events: none; opacity: 0; transition: opacity 0.2s; }
.ascii-copy-toast.show { opacity: 1; }
.ascii-lookup { display: flex; gap: 8px; align-items: center; flex-shrink: 0; flex-wrap: wrap; }
.ascii-lookup label { font-size: 11px; color: var(--text-secondary); font-weight: 500; }
.ascii-lookup-input { width: 100px; padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); font-family: monospace; }
.ascii-lookup-input:focus { outline: none; border-color: #3498db; }
.ascii-lookup-result { font-family: monospace; font-size: 11px; color: var(--text-primary); padding: 4px 8px; background: var(--bg-tertiary); border-radius: 4px; border: 1px solid var(--border-color); min-width: 60px; }
.ascii-count { font-size: 11px; color: var(--text-muted); flex-shrink: 0; }

/* Hash Generator Widget Styles */
.tool-content:has(.hash-widget) { display: flex; flex-direction: column; padding: 0; }
.hash-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 8px; }
.hash-toolbar { display: flex; justify-content: flex-end; gap: 4px; flex-shrink: 0; }
.hash-action-btn { padding: 5px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.hash-action-btn:hover { background: var(--table-hover); }
.hash-input-pane { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.hash-input-pane label { font-size: 11px; color: var(--text-secondary); font-weight: 500; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; }
.hash-input-pane label .hash-byte-count { font-weight: 400; color: var(--text-muted); }
.hash-input-pane textarea { flex: 1; resize: none; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); min-height: 60px; }
.hash-input-pane textarea:focus { outline: none; border-color: #3498db; }
.hash-results { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
.hash-result-row { display: flex; align-items: center; gap: 8px; }
.hash-result-label { font-size: 11px; font-weight: 600; color: var(--text-secondary); min-width: 52px; flex-shrink: 0; }
.hash-result-value { flex: 1; padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 11px; background: var(--bg-tertiary); color: var(--text-primary); word-break: break-all; min-height: 18px; user-select: all; }
.hash-result-copy { padding: 4px 8px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 10px; border-radius: 4px; flex-shrink: 0; }
.hash-result-copy:hover { background: var(--table-hover); }
.hash-case-toggle { display: flex; gap: 4px; }
.hash-case-btn { padding: 5px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.hash-case-btn:first-child { border-radius: 4px 0 0 4px; }
.hash-case-btn:last-child { border-radius: 0 4px 4px 0; }
.hash-case-btn.active { background: #3498db; color: white; border-color: #3498db; }

/* Password Generator Widget Styles */
.tool-content:has(.pwgen-widget) { display: flex; flex-direction: column; padding: 0; }
.pwgen-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 10px; }
.pwgen-output { display: flex; align-items: center; gap: 8px; }
.pwgen-output-field { flex: 1; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 14px; background: var(--bg-tertiary); color: var(--text-primary); word-break: break-all; min-height: 20px; user-select: all; letter-spacing: 0.5px; }
.pwgen-output-actions { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
.pwgen-btn { padding: 6px 12px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.pwgen-btn:hover { background: var(--table-hover); }
.pwgen-btn-primary { background: #3498db; color: white; border-color: #3498db; }
.pwgen-btn-primary:hover { background: #2980b9; }
.pwgen-controls { display: flex; flex-direction: column; gap: 8px; }
.pwgen-length-row { display: flex; align-items: center; gap: 10px; }
.pwgen-length-row label { font-size: 11px; color: var(--text-secondary); font-weight: 500; min-width: 48px; }
.pwgen-length-row input[type="range"] { flex: 1; }
.pwgen-length-row input[type="number"] { width: 52px; padding: 4px 6px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); text-align: center; font-family: monospace; }
.pwgen-charsets { display: flex; flex-wrap: wrap; gap: 6px; }
.pwgen-charset-toggle { display: flex; align-items: center; gap: 5px; padding: 5px 10px; border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; font-size: 11px; color: var(--text-primary); background: var(--bg-tertiary); user-select: none; }
.pwgen-charset-toggle:hover { background: var(--table-hover); }
.pwgen-charset-toggle.active { background: #3498db; color: white; border-color: #3498db; }
.pwgen-charset-toggle input { display: none; }
.pwgen-custom-row { display: flex; align-items: center; gap: 8px; }
.pwgen-custom-row label { font-size: 11px; color: var(--text-secondary); font-weight: 500; flex-shrink: 0; }
.pwgen-custom-input { flex: 1; padding: 4px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); }
.pwgen-custom-input:focus { outline: none; border-color: #3498db; }
.pwgen-strength { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.pwgen-strength-bar { flex: 1; height: 6px; background: var(--border-color); border-radius: 3px; overflow: hidden; }
.pwgen-strength-fill { height: 100%; border-radius: 3px; transition: width 0.2s, background 0.2s; }
.pwgen-strength-label { font-size: 11px; font-weight: 500; min-width: 70px; text-align: right; }
.pwgen-entropy { font-size: 10px; color: var(--text-muted); }
.pwgen-history { display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 4px; }
.pwgen-history-label { font-size: 11px; color: var(--text-secondary); font-weight: 500; }
.pwgen-history-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; min-height: 0; }
.pwgen-history-item { display: flex; align-items: center; gap: 6px; padding: 3px 6px; border-radius: 3px; font-family: monospace; font-size: 11px; color: var(--text-primary); }
.pwgen-history-item:hover { background: var(--table-hover); }
.pwgen-history-item span { flex: 1; word-break: break-all; user-select: all; }
.pwgen-history-copy { padding: 2px 6px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 10px; border-radius: 3px; flex-shrink: 0; }
.pwgen-history-copy:hover { background: var(--table-hover); }
`;
    document.head.appendChild(style);
})();

// Register the Developer Tools toolbox
PluginRegistry.registerToolbox({
    id: 'developer-tools',
    name: 'Developer Tools',
    description: 'Tools for software development',
    icon: '🛠️',
    color: '#3498db',
    version: '1.0.0',
    tools: ['jwt-decoder', 'code-formatter', 'regex-tester', 'cron-expression', 'epoch-converter', 'base64-encoder', 'lorem-ipsum', 'ascii-codes', 'diff-viewer', 'sequence-diagram', 'http-request-builder', 'hash-generator', 'password-generator'],
    source: 'external'
});

// JWT Decoder
PluginRegistry.registerTool({
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens',
    icon: '🔐',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['jwt', 'token', 'auth', 'decode'],
    title: 'JWT Decoder',
    content: `<div class="jwt-widget">
<div class="jwt-input-section">
<label>Paste JWT Token</label>
<div class="jwt-toolbar">
<button class="jwt-sample-btn" onclick="jwtLoadSample()">Load Sample</button>
<button class="jwt-sample-btn" onclick="jwtClear()">Clear</button>
</div>
<textarea placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" oninput="jwtDecode(this)"></textarea>
</div>
<div class="jwt-output-section">
<div class="jwt-results"></div>
</div>
</div>`,
    contentType: 'html',
    onInit: 'jwtInit',
    source: 'external'
});

// Code Formatter
PluginRegistry.registerTool({
    id: 'code-formatter',
    name: 'Code Formatter',
    description: 'Prettify or minify JSON, XML, CSV, and SQL',
    icon: '🎨',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['json', 'xml', 'csv', 'sql', 'prettify', 'format'],
    title: 'Code Formatter',
    content: `<div class="fmt-widget">
<div class="fmt-toolbar">
<div class="fmt-format-toggle">
<button class="fmt-format-btn active" onclick="fmtSetFormat(this, 'json')">JSON</button>
<button class="fmt-format-btn" onclick="fmtSetFormat(this, 'xml')">XML</button>
<button class="fmt-format-btn" onclick="fmtSetFormat(this, 'csv')">CSV</button>
<button class="fmt-format-btn" onclick="fmtSetFormat(this, 'sql')">SQL</button>
</div>
<div class="fmt-actions">
<button class="fmt-action-btn" onclick="fmtPrettify(this)">Prettify</button>
<button class="fmt-action-btn" onclick="fmtMinify(this)">Minify</button>
<button class="fmt-action-btn" onclick="fmtCopy(this)">Copy</button>
<button class="fmt-action-btn" onclick="fmtSwap(this)">Swap</button>
</div>
</div>
<div class="fmt-container">
<div class="fmt-pane">
<label>Input</label>
<textarea class="fmt-input" placeholder="Paste your code here..." oninput="fmtOnInput(this)"></textarea>
</div>
<div class="fmt-resizer"></div>
<div class="fmt-pane">
<label>Output</label>
<textarea class="fmt-output" readonly placeholder="Formatted output will appear here..."></textarea>
</div>
</div>
<div class="fmt-status"></div>
</div>`,
    contentType: 'html',
    onInit: 'fmtInit',
    source: 'external'
});

// Regex Tester
PluginRegistry.registerTool({
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions with real-time matching and highlighting',
    icon: '🔍',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['regex', 'regexp', 'pattern', 'match'],
    title: 'Regex Tester',
    content: `<div class="regex-widget">
<div class="regex-toolbar">
<div class="regex-flags">
<label title="Global - find all matches"><input type="checkbox" class="regex-flag" data-flag="g" checked onchange="regexOnInput(this)"> g</label>
<label title="Case insensitive"><input type="checkbox" class="regex-flag" data-flag="i" onchange="regexOnInput(this)"> i</label>
<label title="Multiline - ^ and $ match line boundaries"><input type="checkbox" class="regex-flag" data-flag="m" onchange="regexOnInput(this)"> m</label>
<label title="Dot matches newlines"><input type="checkbox" class="regex-flag" data-flag="s" onchange="regexOnInput(this)"> s</label>
</div>
<div class="regex-actions">
<button class="regex-action-btn" onclick="regexCopy(this)">Copy Regex</button>
<button class="regex-action-btn" onclick="regexClear(this)">Clear</button>
</div>
</div>
<div class="regex-input-row">
<label>Pattern</label>
<input type="text" class="regex-pattern" placeholder="Enter regex pattern..." oninput="regexOnInput(this)">
</div>
<div class="regex-container">
<div class="regex-pane">
<label>Test String</label>
<textarea class="regex-test-string" placeholder="Enter text to test against..." oninput="regexOnInput(this)"></textarea>
</div>
<div class="regex-resizer"></div>
<div class="regex-pane regex-results-pane">
<label>Match Results</label>
<div class="regex-results"></div>
</div>
</div>
<div class="regex-status"></div>
</div>`,
    contentType: 'html',
    onInit: 'regexInit',
    source: 'external'
});

// Cron Expression Parser
PluginRegistry.registerTool({
    id: 'cron-expression',
    name: 'Cron Expression',
    description: 'Interactive cron expression parser with schedule preview',
    icon: '⏰',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['cron', 'schedule', 'time'],
    title: 'Cron Expression',
    content: `<div class="cron-widget">
<div class="cron-input-section">
<div class="cron-input-row">
<input type="text" class="cron-input" placeholder="* * * * *" value="0 9 * * MON-FRI" oninput="cronParse(this)">
</div>
<div class="cron-presets">
<button class="cron-preset-btn" onclick="cronSetPreset(this, '* * * * *')">Every minute</button>
<button class="cron-preset-btn" onclick="cronSetPreset(this, '0 * * * *')">Every hour</button>
<button class="cron-preset-btn" onclick="cronSetPreset(this, '0 0 * * *')">Daily midnight</button>
<button class="cron-preset-btn" onclick="cronSetPreset(this, '0 9 * * MON-FRI')">Weekdays 9am</button>
<button class="cron-preset-btn" onclick="cronSetPreset(this, '0 0 * * 0')">Weekly Sunday</button>
<button class="cron-preset-btn" onclick="cronSetPreset(this, '0 0 1 * *')">Monthly 1st</button>
</div>
</div>
<div class="cron-explanation">
<div class="cron-explanation-text"></div>
</div>
<div class="cron-fields"></div>
<div class="cron-schedule">
<div class="cron-schedule-header">
<span class="cron-schedule-title">Next scheduled runs</span>
<span class="cron-schedule-count"></span>
</div>
<div class="cron-schedule-list"></div>
</div>
</div>`,
    contentType: 'html',
    onInit: 'cronInit',
    source: 'external'
});

// Epoch Converter
PluginRegistry.registerTool({
    id: 'epoch-converter',
    name: 'Epoch Converter',
    description: 'Convert between Unix timestamps and human-readable dates',
    icon: '⏱️',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['timestamp', 'unix', 'date', 'time'],
    title: 'Epoch Converter',
    content: `<div class="epoch-widget">
<div class="epoch-section">
<label>Current Time</label>
<div class="epoch-current">
<span class="epoch-now-value">-</span>
<button class="epoch-action-btn" onclick="epochCopyNow(this)">Copy</button>
<button class="epoch-action-btn" onclick="epochUseNow(this)">Use</button>
</div>
</div>
<div class="epoch-section">
<label>Unix Timestamp (seconds or milliseconds)</label>
<div class="epoch-input-row">
<input type="text" class="epoch-timestamp-input" placeholder="e.g. 1700000000 or 1700000000000" oninput="epochFromTimestamp(this)">
<select class="epoch-unit-select" onchange="epochFromTimestamp(this)">
<option value="auto">Auto-detect</option>
<option value="s">Seconds</option>
<option value="ms">Milliseconds</option>
</select>
</div>
<div class="epoch-result epoch-from-ts"></div>
</div>
<div class="epoch-section">
<label>Human Date/Time</label>
<div class="epoch-datetime-inputs">
<input type="date" class="epoch-date-input" oninput="epochFromDatetime(this)">
<input type="time" class="epoch-time-input" step="1" oninput="epochFromDatetime(this)">
<select class="epoch-tz-select" onchange="epochFromDatetime(this)">
<option value="local">Local Time</option>
<option value="utc">UTC</option>
</select>
</div>
<div class="epoch-result epoch-from-dt"></div>
</div>
<div class="epoch-section">
<label>Quick Reference</label>
<div class="epoch-reference">
<div class="epoch-ref-item"><span>Start of today:</span><code class="epoch-ref-today">-</code></div>
<div class="epoch-ref-item"><span>Start of year:</span><code class="epoch-ref-year">-</code></div>
<div class="epoch-ref-item"><span>Unix epoch:</span><code>0 (Jan 1, 1970 00:00:00 UTC)</code></div>
</div>
</div>
</div>`,
    contentType: 'html',
    onInit: 'epochInit',
    source: 'external'
});

// Base64 Encoder/Decoder
PluginRegistry.registerTool({
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    icon: '🔣',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['base64', 'encode', 'decode', 'binary'],
    title: 'Base64 Encoder/Decoder',
    content: `<div class="b64-widget">
<div class="b64-toolbar">
<div class="b64-mode-toggle">
<button class="b64-mode-btn active" onclick="b64SetMode(this, 'encode')">Encode</button>
<button class="b64-mode-btn" onclick="b64SetMode(this, 'decode')">Decode</button>
</div>
<div class="b64-actions">
<button class="b64-action-btn" onclick="b64Swap(this)">⇅ Swap</button>
<button class="b64-action-btn" onclick="b64Copy(this)">Copy Output</button>
<button class="b64-action-btn" onclick="b64Clear(this)">Clear</button>
</div>
</div>
<div class="b64-panes">
<div class="b64-pane">
<label><span class="b64-input-label">Text Input</span><span class="b64-byte-count b64-input-count"></span></label>
<textarea class="b64-input" placeholder="Enter text to encode..." oninput="b64OnInput(this)"></textarea>
</div>
<div class="b64-pane">
<label><span class="b64-output-label">Base64 Output</span><span class="b64-byte-count b64-output-count"></span></label>
<textarea class="b64-output" placeholder="Encoded result will appear here..." readonly></textarea>
</div>
</div>
<div class="b64-status"></div>
</div>`,
    contentType: 'html',
    onInit: 'b64Init',
    source: 'external'
});

// Diff Viewer
PluginRegistry.registerTool({
    id: 'diff-viewer',
    name: 'Diff Viewer',
    description: 'Compare two texts with visual diff highlighting',
    icon: '🔀',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['diff', 'compare', 'text'],
    title: 'Text Diff',
    content: `<div class="diff-widget">
<div class="diff-toolbar">
<div class="diff-mode-toggle">
<button class="diff-mode-btn active" onclick="diffSetMode(this, 'edit')">Edit</button>
<button class="diff-mode-btn" onclick="diffSetMode(this, 'view')">View</button>
</div>
<div class="diff-view-options">
<button class="diff-view-btn active" onclick="diffSetView(this, 'split')">Split</button>
<button class="diff-view-btn" onclick="diffSetView(this, 'unified')">Unified</button>
<label class="diff-whitespace-toggle">
<input type="checkbox" onchange="diffToggleWhitespace(this)">
Hide Whitespace
</label>
</div>
</div>
<div class="diff-edit-container">
<div class="diff-edit-pane">
<label>Original</label>
<textarea placeholder="Enter original text..." oninput="diffOnInput(this, 'original')" onscroll="diffSyncScroll(this, 'original')"></textarea>
</div>
<div class="diff-edit-resizer"></div>
<div class="diff-edit-pane">
<label>Modified</label>
<textarea placeholder="Enter modified text..." oninput="diffOnInput(this, 'modified')" onscroll="diffSyncScroll(this, 'modified')"></textarea>
</div>
</div>
<div class="diff-view-container">
<div class="diff-output"></div>
</div>
<div class="diff-stats"></div>
</div>`,
    contentType: 'html',
    onInit: 'diffInit',
    source: 'external'
});

// Lorem Ipsum Generator
PluginRegistry.registerTool({
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text in various formats',
    icon: '📄',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy'],
    title: 'Lorem Ipsum Generator',
    content: `<div class="lorem-widget">
<div class="lorem-toolbar">
<label>Generate</label>
<input type="number" class="lorem-count-input" value="3" min="1" max="100">
<select class="lorem-type-select" onchange="loremGenerate(this)">
<option value="paragraphs">Paragraphs</option>
<option value="sentences">Sentences</option>
<option value="words">Words</option>
<option value="list">List Items</option>
</select>
<button class="lorem-action-btn primary" onclick="loremGenerate(this)">Generate</button>
</div>
<div class="lorem-options">
<label class="lorem-option"><input type="checkbox" class="lorem-start-lorem" checked onchange="loremGenerate(this)"> Start with "Lorem ipsum..."</label>
<label class="lorem-option"><input type="checkbox" class="lorem-html-tags" onchange="loremGenerate(this)"> HTML tags</label>
</div>
<div class="lorem-actions">
<button class="lorem-action-btn" onclick="loremCopy(this)">Copy</button>
<button class="lorem-action-btn" onclick="loremClear(this)">Clear</button>
</div>
<textarea class="lorem-output" readonly></textarea>
<div class="lorem-stats"></div>
</div>`,
    contentType: 'html',
    onInit: 'loremInit',
    source: 'external'
});

// ASCII & HTML Codes
PluginRegistry.registerTool({
    id: 'ascii-codes',
    name: 'ASCII & HTML Codes',
    description: 'Browse ASCII, Latin, Greek, Cyrillic, symbols, arrows, math operators and more with HTML entities',
    icon: '🔤',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['ascii', 'html', 'entity', 'character', 'code', 'unicode', 'hex'],
    title: 'ASCII & HTML Codes',
    content: `<div class="ascii-widget">
<div class="ascii-toolbar">
<input type="text" class="ascii-search" placeholder="Search char, code, name, or entity..." oninput="asciiFilter(this)">
</div>
<div class="ascii-range-btns">
<button class="ascii-range-btn active" onclick="asciiSetRange(this, 'all')">ASCII (0-127)</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'control')">Control</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'printable')">Printable</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'digits')">Digits</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'symbols')">Symbols</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'latin1')">Latin-1</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'latinext')">Latin Ext</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'greek')">Greek</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'cyrillic')">Cyrillic</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'punctuation')">Punctuation</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'currency')">Currency</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'arrows')">Arrows</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'math')">Math</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'box')">Box Drawing</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'shapes')">Shapes</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'misc')">Misc Symbols</button>
<button class="ascii-range-btn" onclick="asciiSetRange(this, 'dingbats')">Dingbats</button>
</div>
<div class="ascii-lookup">
<label>Lookup:</label>
<input type="text" class="ascii-lookup-input" placeholder="Char or code" oninput="asciiLookup(this)" maxlength="10">
<span class="ascii-lookup-result"></span>
</div>
<div class="ascii-table-wrap">
<table class="ascii-table">
<thead><tr><th>Dec</th><th>Hex</th><th>Unicode</th><th>Char</th><th>HTML</th><th>Description</th></tr></thead>
<tbody class="ascii-table-body"></tbody>
</table>
</div>
<div class="ascii-count"></div>
<div class="ascii-copy-toast">Copied!</div>
</div>`,
    contentType: 'html',
    onInit: 'asciiInit',
    source: 'external'
});

// Sequence Diagram
PluginRegistry.registerTool({
    id: 'sequence-diagram',
    name: 'Sequence Diagram',
    description: 'Create sequence diagrams from simple text notation',
    icon: '📊',
    version: '1.0.0',
    toolbox: 'developer-tools',
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

// Hash Generator
PluginRegistry.registerTool({
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, and SHA-256 hashes from text input',
    icon: '#️⃣',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['hash', 'md5', 'sha1', 'sha256', 'checksum', 'digest', 'crypto'],
    title: 'Hash Generator',
    content: `<div class="hash-widget">
<div class="hash-toolbar">
<div class="hash-case-toggle">
<button class="hash-case-btn active" onclick="hashSetCase(this, 'lower')">lower</button>
<button class="hash-case-btn" onclick="hashSetCase(this, 'upper')">UPPER</button>
</div>
<button class="hash-action-btn" onclick="hashClearAll(this)">Clear</button>
</div>
<div class="hash-input-pane">
<label><span>Text Input</span><span class="hash-byte-count"></span></label>
<textarea class="hash-input" placeholder="Enter text to hash..." oninput="hashOnInput(this)"></textarea>
</div>
<div class="hash-results">
<div class="hash-result-row" data-algo="MD5">
<span class="hash-result-label">MD5</span>
<span class="hash-result-value"></span>
<button class="hash-result-copy" onclick="hashCopyResult(this)">Copy</button>
</div>
<div class="hash-result-row" data-algo="SHA-1">
<span class="hash-result-label">SHA-1</span>
<span class="hash-result-value"></span>
<button class="hash-result-copy" onclick="hashCopyResult(this)">Copy</button>
</div>
<div class="hash-result-row" data-algo="SHA-256">
<span class="hash-result-label">SHA-256</span>
<span class="hash-result-value"></span>
<button class="hash-result-copy" onclick="hashCopyResult(this)">Copy</button>
</div>
</div>
</div>`,
    contentType: 'html',
    onInit: 'hashInit',
    source: 'external'
});

// Password Generator
PluginRegistry.registerTool({
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Configurable secure password generation',
    icon: '🔑',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['password', 'random', 'secure', 'generate', 'crypto'],
    title: 'Password Generator',
    content: `<div class="pwgen-widget">
<div class="pwgen-output">
<div class="pwgen-output-field"></div>
<div class="pwgen-output-actions">
<button class="pwgen-btn pwgen-btn-primary" onclick="pwgenGenerate(this)">Generate</button>
<button class="pwgen-btn" onclick="pwgenCopy(this)">Copy</button>
</div>
</div>
<div class="pwgen-strength">
<div class="pwgen-strength-bar"><div class="pwgen-strength-fill"></div></div>
<span class="pwgen-strength-label"></span>
<span class="pwgen-entropy"></span>
</div>
<div class="pwgen-controls">
<div class="pwgen-length-row">
<label>Length</label>
<input type="range" min="4" max="128" value="20" oninput="pwgenLengthChange(this)">
<input type="number" min="4" max="128" value="20" oninput="pwgenLengthInput(this)">
</div>
<div class="pwgen-charsets">
<label class="pwgen-charset-toggle active" data-charset="upper"><input type="checkbox" checked onchange="pwgenToggleCharset(this)">A-Z</label>
<label class="pwgen-charset-toggle active" data-charset="lower"><input type="checkbox" checked onchange="pwgenToggleCharset(this)">a-z</label>
<label class="pwgen-charset-toggle active" data-charset="digits"><input type="checkbox" checked onchange="pwgenToggleCharset(this)">0-9</label>
<label class="pwgen-charset-toggle active" data-charset="symbols"><input type="checkbox" checked onchange="pwgenToggleCharset(this)">!@#$</label>
</div>
<div class="pwgen-custom-row">
<label>Exclude</label>
<input type="text" class="pwgen-custom-input pwgen-exclude" placeholder="Characters to exclude, e.g. 0OlI1" oninput="pwgenExcludeChange(this)">
</div>
</div>
<div class="pwgen-history">
<span class="pwgen-history-label">History</span>
<div class="pwgen-history-list"></div>
</div>
</div>`,
    contentType: 'html',
    onInit: 'pwgenInit',
    source: 'external'
});

console.log('Developer Tools plugin loaded: 12 tools registered');

// ==================== Diff Viewer Functions ====================
function diffGetToolId(element) {
    const tool = element.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function diffGetData(toolId) {
    const customizations = loadToolCustomizations();
    const custom = customizations[toolId] || {};
    return custom.diffData || { original: '', modified: '', mode: 'edit', viewType: 'split', hideWhitespace: false };
}

function diffSaveData(toolId, data) {
    const customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].diffData = data;
    saveToolCustomizations(customizations);
}

function diffInit() {
    document.querySelectorAll('.diff-widget').forEach(widget => {
        const toolId = diffGetToolId(widget);
        if (!toolId) return;
        const data = diffGetData(toolId);
        const textareas = widget.querySelectorAll('.diff-edit-pane textarea');
        if (textareas[0]) textareas[0].value = data.original;
        if (textareas[1]) textareas[1].value = data.modified;
        widget.querySelectorAll('.diff-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent.toLowerCase() === data.mode);
        });
        widget.querySelectorAll('.diff-view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent.toLowerCase() === data.viewType);
        });
        const wsCheckbox = widget.querySelector('.diff-whitespace-toggle input');
        if (wsCheckbox) wsCheckbox.checked = data.hideWhitespace;
        const editContainer = widget.querySelector('.diff-edit-container');
        const viewContainer = widget.querySelector('.diff-view-container');
        if (data.mode === 'view') {
            editContainer.classList.add('hidden');
            viewContainer.classList.add('active');
            diffRenderOutput(widget, toolId);
        } else {
            editContainer.classList.remove('hidden');
            viewContainer.classList.remove('active');
        }
        diffUpdateStats(widget, toolId);
    });
}

function diffOnInput(textarea, field) {
    const toolId = diffGetToolId(textarea);
    if (!toolId) return;
    const data = diffGetData(toolId);
    data[field] = textarea.value;
    diffSaveData(toolId, data);
    const widget = textarea.closest('.diff-widget');
    diffUpdateStats(widget, toolId);
}

function diffSetMode(btn, mode) {
    const widget = btn.closest('.diff-widget');
    const toolId = diffGetToolId(widget);
    if (!toolId) return;
    const data = diffGetData(toolId);
    data.mode = mode;
    diffSaveData(toolId, data);
    widget.querySelectorAll('.diff-mode-btn').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase() === mode));
    const editContainer = widget.querySelector('.diff-edit-container');
    const viewContainer = widget.querySelector('.diff-view-container');
    if (mode === 'view') {
        editContainer.classList.add('hidden');
        viewContainer.classList.add('active');
        diffRenderOutput(widget, toolId);
    } else {
        editContainer.classList.remove('hidden');
        viewContainer.classList.remove('active');
    }
}

function diffSetView(btn, viewType) {
    const widget = btn.closest('.diff-widget');
    const toolId = diffGetToolId(widget);
    if (!toolId) return;
    const data = diffGetData(toolId);
    data.viewType = viewType;
    diffSaveData(toolId, data);
    widget.querySelectorAll('.diff-view-btn').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase() === viewType));
    if (data.mode === 'view') diffRenderOutput(widget, toolId);
}

function diffToggleWhitespace(checkbox) {
    const widget = checkbox.closest('.diff-widget');
    const toolId = diffGetToolId(widget);
    if (!toolId) return;
    const data = diffGetData(toolId);
    data.hideWhitespace = checkbox.checked;
    diffSaveData(toolId, data);
    if (data.mode === 'view') diffRenderOutput(widget, toolId);
    diffUpdateStats(widget, toolId);
}

function diffSyncScroll(textarea, source) {
    const widget = textarea.closest('.diff-widget');
    const textareas = widget.querySelectorAll('.diff-edit-pane textarea');
    const other = source === 'original' ? textareas[1] : textareas[0];
    if (other && other !== textarea) {
        other.scrollTop = textarea.scrollTop;
        other.scrollLeft = textarea.scrollLeft;
    }
}

function computeDiff(original, modified, hideWhitespace) {
    let origLines = original.split('\n');
    let modLines = modified.split('\n');
    if (hideWhitespace) {
        const normalize = line => line.replace(/\s+/g, ' ').trim();
        const origNorm = origLines.map(normalize);
        const modNorm = modLines.map(normalize);
        const lcs = buildLCSMatrix(origNorm, modNorm);
        return backtrackDiff(lcs, origNorm, modNorm, origLines, modLines);
    }
    const lcs = buildLCSMatrix(origLines, modLines);
    return backtrackDiff(lcs, origLines, modLines, origLines, modLines);
}

function buildLCSMatrix(a, b) {
    const m = a.length, n = b.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp;
}

function backtrackDiff(dp, aNorm, bNorm, aOrig, bOrig) {
    const result = [], stack = [];
    let i = aNorm.length, j = bNorm.length;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && aNorm[i - 1] === bNorm[j - 1]) {
            stack.push({ type: 'unchanged', origLine: i, modLine: j, origContent: aOrig[i - 1], modContent: bOrig[j - 1] });
            i--; j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            stack.push({ type: 'addition', modLine: j, content: bOrig[j - 1] });
            j--;
        } else {
            stack.push({ type: 'deletion', origLine: i, content: aOrig[i - 1] });
            i--;
        }
    }
    while (stack.length) result.push(stack.pop());
    return result;
}

function diffRenderOutput(widget, toolId) {
    const data = diffGetData(toolId);
    const output = widget.querySelector('.diff-output');
    if (!data.original && !data.modified) {
        output.innerHTML = '<div class="diff-empty-message">Enter text in both panes to see the diff</div>';
        return;
    }
    const diff = computeDiff(data.original, data.modified, data.hideWhitespace);
    output.innerHTML = data.viewType === 'split' ? renderSplitView(diff) : renderUnifiedView(diff);
}

function renderSplitView(diff) {
    let leftLines = '', rightLines = '';
    diff.forEach(item => {
        if (item.type === 'unchanged') {
            leftLines += renderDiffLine(item.origLine, item.origContent, 'unchanged');
            rightLines += renderDiffLine(item.modLine, item.modContent, 'unchanged');
        } else if (item.type === 'deletion') {
            leftLines += renderDiffLine(item.origLine, item.content, 'deletion');
            rightLines += renderDiffLine('', '', 'empty');
        } else if (item.type === 'addition') {
            leftLines += renderDiffLine('', '', 'empty');
            rightLines += renderDiffLine(item.modLine, item.content, 'addition');
        }
    });
    return `<div class="diff-split-view"><div class="diff-split-pane"><div class="diff-split-header">Original</div>${leftLines}</div><div class="diff-split-pane"><div class="diff-split-header">Modified</div>${rightLines}</div></div>`;
}

function renderUnifiedView(diff) {
    let lines = '';
    diff.forEach(item => {
        if (item.type === 'unchanged') lines += renderUnifiedLine(item.origLine, item.modLine, item.origContent, 'unchanged', ' ');
        else if (item.type === 'deletion') lines += renderUnifiedLine(item.origLine, '', item.content, 'deletion', '-');
        else if (item.type === 'addition') lines += renderUnifiedLine('', item.modLine, item.content, 'addition', '+');
    });
    return `<div class="diff-unified-view">${lines}</div>`;
}

function renderDiffLine(lineNum, content, type) {
    const escapedContent = escapeHtml(content || '');
    return `<div class="diff-line ${type}"><div class="diff-gutter">${lineNum || ''}</div><div class="diff-content">${escapedContent || '&nbsp;'}</div></div>`;
}

function renderUnifiedLine(origLine, modLine, content, type, prefix) {
    const escapedContent = escapeHtml(content || '');
    const lineInfo = origLine && modLine ? `${origLine}/${modLine}` : (origLine || modLine || '');
    return `<div class="diff-line ${type}"><div class="diff-gutter">${lineInfo}</div><div class="diff-prefix">${prefix}</div><div class="diff-content">${escapedContent || '&nbsp;'}</div></div>`;
}

function diffUpdateStats(widget, toolId) {
    const data = diffGetData(toolId);
    const statsEl = widget.querySelector('.diff-stats');
    if (!data.original && !data.modified) { statsEl.innerHTML = ''; return; }
    const diff = computeDiff(data.original, data.modified, data.hideWhitespace);
    let additions = 0, deletions = 0;
    diff.forEach(item => { if (item.type === 'addition') additions++; if (item.type === 'deletion') deletions++; });
    statsEl.innerHTML = `<span class="diff-stats-additions">+${additions} addition${additions !== 1 ? 's' : ''}</span><span class="diff-stats-deletions">-${deletions} deletion${deletions !== 1 ? 's' : ''}</span>`;
}

// ==================== Sequence Diagram Functions ====================
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

// ==================== JWT Decoder Functions ====================
function jwtGetToolId(element) { return element.closest('.jwt-widget')?.closest('.tool')?.getAttribute('data-tool'); }
function jwtInit() { document.querySelectorAll('.jwt-widget').forEach(widget => { const textarea = widget.querySelector('textarea'); if (textarea && textarea.value) jwtDecode(textarea); }); }
function jwtDecode(textarea) {
    const widget = textarea.closest('.jwt-widget'), results = widget.querySelector('.jwt-results'), token = textarea.value.trim();
    if (!token) { results.innerHTML = '<div class="jwt-status info">Paste a JWT token above to decode it</div>'; return; }
    const parts = token.split('.');
    if (parts.length !== 3) { results.innerHTML = '<div class="jwt-error">Invalid JWT format. A JWT should have 3 parts separated by dots (header.payload.signature)</div>'; return; }
    try {
        const header = JSON.parse(jwtBase64Decode(parts[0])), payload = JSON.parse(jwtBase64Decode(parts[1])), signature = parts[2];
        let html = '<div class="jwt-parts">';
        html += `<div class="jwt-part"><div class="jwt-part-header header"><span>HEADER</span><button class="jwt-copy-btn" onclick="jwtCopyPart(this, 'header')">Copy</button></div><div class="jwt-part-content">${jwtSyntaxHighlight(JSON.stringify(header, null, 2))}</div></div>`;
        html += `<div class="jwt-part"><div class="jwt-part-header payload"><span>PAYLOAD</span><button class="jwt-copy-btn" onclick="jwtCopyPart(this, 'payload')">Copy</button></div><div class="jwt-part-content">${jwtSyntaxHighlight(JSON.stringify(payload, null, 2))}</div>${jwtRenderClaims(payload)}</div>`;
        html += `<div class="jwt-part"><div class="jwt-part-header signature"><span>SIGNATURE</span><button class="jwt-copy-btn" onclick="jwtCopyPart(this, 'signature')">Copy</button></div><div class="jwt-part-content raw">${signature}</div><div style="padding: 8px 12px; font-size: 11px; color: var(--text-muted);">Algorithm: <strong>${header.alg || 'Unknown'}</strong>${header.alg ? ` - Signature cannot be verified without the ${header.alg.startsWith('HS') ? 'secret key' : 'public key'}` : ''}</div></div>`;
        html += '</div>';
        widget._decodedHeader = JSON.stringify(header, null, 2);
        widget._decodedPayload = JSON.stringify(payload, null, 2);
        widget._signature = signature;
        results.innerHTML = html;
    } catch (e) { results.innerHTML = `<div class="jwt-error">Failed to decode JWT: ${e.message}</div>`; }
}
function jwtBase64Decode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
}
function jwtSyntaxHighlight(json) {
    return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
            if (/^"/.test(match)) return /:$/.test(match) ? `<span style="color: #9b59b6">${match}</span>` : `<span style="color: #27ae60">${match}</span>`;
            if (/true|false/.test(match)) return `<span style="color: #e67e22">${match}</span>`;
            if (/null/.test(match)) return `<span style="color: #95a5a6">${match}</span>`;
            return `<span style="color: #3498db">${match}</span>`;
        });
}
function jwtRenderClaims(payload) {
    const standardClaims = { 'iss': 'Issuer', 'sub': 'Subject', 'aud': 'Audience', 'exp': 'Expiration', 'nbf': 'Not Before', 'iat': 'Issued At', 'jti': 'JWT ID' };
    const now = Math.floor(Date.now() / 1000);
    let claimsHtml = '<div class="jwt-claims">';
    for (const [key, value] of Object.entries(payload)) {
        let displayValue = value, valueClass = '';
        if (['exp', 'nbf', 'iat'].includes(key) && typeof value === 'number') {
            const date = new Date(value * 1000), formatted = date.toLocaleString();
            if (key === 'exp') { if (value < now) { displayValue = `${formatted} (EXPIRED)`; valueClass = 'expired'; } else { const diff = value - now, hours = Math.floor(diff / 3600), mins = Math.floor((diff % 3600) / 60); displayValue = `${formatted} (valid for ${hours}h ${mins}m)`; valueClass = 'valid'; } }
            else if (key === 'nbf') { if (value > now) { displayValue = `${formatted} (NOT YET VALID)`; valueClass = 'expired'; } else { displayValue = `${formatted} (active)`; valueClass = 'valid'; } }
            else displayValue = formatted;
        } else if (typeof value === 'object') displayValue = JSON.stringify(value);
        claimsHtml += `<div class="jwt-claim"><span class="jwt-claim-key">${standardClaims[key] || key}</span><span class="jwt-claim-value ${valueClass}">${displayValue}</span></div>`;
    }
    return claimsHtml + '</div>';
}
function jwtCopyPart(btn, part) {
    const widget = btn.closest('.jwt-widget');
    let text = part === 'header' ? widget._decodedHeader : part === 'payload' ? widget._decodedPayload : widget._signature;
    navigator.clipboard.writeText(text).then(() => { const orig = btn.textContent; btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = orig, 1500); });
}
function jwtLoadSample() {
    const widget = event.target.closest('.jwt-widget'), textarea = widget.querySelector('textarea');
    const samplePayload = { sub: '1234567890', name: 'John Doe', email: 'john@example.com', role: 'admin', iat: Math.floor(Date.now() / 1000) - 3600, exp: Math.floor(Date.now() / 1000) + 3600, iss: 'https://example.com' };
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const payload = btoa(JSON.stringify(samplePayload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    textarea.value = `${header}.${payload}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
    jwtDecode(textarea);
}
function jwtClear() { const widget = event.target.closest('.jwt-widget'), textarea = widget.querySelector('textarea'); textarea.value = ''; jwtDecode(textarea); }

// ==================== Epoch Converter Functions ====================
let epochIntervalId = null;
function epochInit() {
    document.querySelectorAll('.epoch-widget').forEach(widget => {
        epochUpdateNow(widget);
        epochUpdateReference(widget);
        if (!epochIntervalId) epochIntervalId = setInterval(() => document.querySelectorAll('.epoch-widget').forEach(w => epochUpdateNow(w)), 1000);
    });
}
function epochUpdateNow(widget) { const nowDisplay = widget.querySelector('.epoch-now-value'); if (nowDisplay) nowDisplay.textContent = Math.floor(Date.now() / 1000); }
function epochUpdateReference(widget) {
    const todayEl = widget.querySelector('.epoch-ref-today'), yearEl = widget.querySelector('.epoch-ref-year');
    if (todayEl) { const today = new Date(); today.setHours(0, 0, 0, 0); todayEl.textContent = Math.floor(today.getTime() / 1000); }
    if (yearEl) { const year = new Date(new Date().getFullYear(), 0, 1); yearEl.textContent = Math.floor(year.getTime() / 1000); }
}
function epochCopyNow(btn) { navigator.clipboard.writeText(Math.floor(Date.now() / 1000).toString()); const orig = btn.textContent; btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = orig, 1000); }
function epochUseNow(btn) { const widget = btn.closest('.epoch-widget'), input = widget.querySelector('.epoch-timestamp-input'); input.value = Math.floor(Date.now() / 1000); epochFromTimestamp(input); }
function epochFromTimestamp(element) {
    const widget = element.closest('.epoch-widget'), input = widget.querySelector('.epoch-timestamp-input'), unitSelect = widget.querySelector('.epoch-unit-select'), resultDiv = widget.querySelector('.epoch-from-ts');
    const value = input.value.trim();
    if (!value) { resultDiv.innerHTML = '<span style="color: var(--text-muted);">Enter a timestamp to convert...</span>'; return; }
    const numValue = parseInt(value);
    if (isNaN(numValue)) { resultDiv.innerHTML = '<span style="color: var(--error-text);">Invalid number</span>'; return; }
    let unit = unitSelect?.value || 'auto', timestamp = numValue;
    if (unit === 'auto') unit = numValue > 32503680000 ? 'ms' : 's';
    timestamp = unit === 'ms' ? numValue : numValue * 1000;
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) { resultDiv.innerHTML = '<span style="color: var(--error-text);">Invalid date</span>'; return; }
    resultDiv.innerHTML = `<div class="result-row"><span class="result-label">Local:</span><span class="result-value copyable" onclick="epochCopyValue(this)">${date.toLocaleString()}</span></div><div class="result-row"><span class="result-label">UTC:</span><span class="result-value copyable" onclick="epochCopyValue(this)">${date.toUTCString()}</span></div><div class="result-row"><span class="result-label">ISO 8601:</span><span class="result-value copyable" onclick="epochCopyValue(this)">${date.toISOString()}</span></div><div class="result-row"><span class="result-label">Relative:</span><span class="result-value">${epochRelativeTime(date)}</span></div><div class="result-row" style="margin-top: 4px; font-size: 10px; color: var(--text-muted);">Detected: ${unit === 'ms' ? 'milliseconds' : 'seconds'}</div>`;
}
function epochFromDatetime(element) {
    const widget = element.closest('.epoch-widget'), dateInput = widget.querySelector('.epoch-date-input'), timeInput = widget.querySelector('.epoch-time-input'), tzSelect = widget.querySelector('.epoch-tz-select'), resultDiv = widget.querySelector('.epoch-from-dt');
    const dateValue = dateInput.value, timeValue = timeInput.value || '00:00:00';
    if (!dateValue) { resultDiv.innerHTML = '<span style="color: var(--text-muted);">Select a date to convert...</span>'; return; }
    const tz = tzSelect?.value || 'local', date = tz === 'utc' ? new Date(`${dateValue}T${timeValue}Z`) : new Date(`${dateValue}T${timeValue}`);
    if (isNaN(date.getTime())) { resultDiv.innerHTML = '<span style="color: var(--error-text);">Invalid date/time</span>'; return; }
    resultDiv.innerHTML = `<div class="result-row"><span class="result-label">Seconds:</span><span class="result-value copyable" onclick="epochCopyValue(this)">${Math.floor(date.getTime() / 1000)}</span></div><div class="result-row"><span class="result-label">Milliseconds:</span><span class="result-value copyable" onclick="epochCopyValue(this)">${date.getTime()}</span></div>`;
}
function epochRelativeTime(date) {
    const diffMs = date.getTime() - Date.now(), diffSec = Math.abs(Math.floor(diffMs / 1000)), isFuture = diffMs > 0;
    const units = [{ name: 'year', seconds: 31536000 }, { name: 'month', seconds: 2592000 }, { name: 'week', seconds: 604800 }, { name: 'day', seconds: 86400 }, { name: 'hour', seconds: 3600 }, { name: 'minute', seconds: 60 }, { name: 'second', seconds: 1 }];
    for (const unit of units) { const value = Math.floor(diffSec / unit.seconds); if (value >= 1) return isFuture ? `in ${value} ${unit.name}${value !== 1 ? 's' : ''}` : `${value} ${unit.name}${value !== 1 ? 's' : ''} ago`; }
    return 'just now';
}
function epochCopyValue(element) { navigator.clipboard.writeText(element.textContent); const orig = element.textContent; element.textContent = 'Copied!'; element.style.color = 'var(--success-color)'; setTimeout(() => { element.textContent = orig; element.style.color = ''; }, 1000); }

// ==================== Code Formatter Functions ====================
function fmtGetToolId(element) { return element.closest('.fmt-widget')?.closest('.tool')?.getAttribute('data-tool'); }
function fmtGetData(toolId) { const customizations = loadToolCustomizations(); return (customizations[toolId]?.fmtData) || { input: '', output: '', format: 'json' }; }
function fmtSaveData(toolId, data) { const customizations = loadToolCustomizations(); if (!customizations[toolId]) customizations[toolId] = {}; customizations[toolId].fmtData = data; saveToolCustomizations(customizations); }
function fmtInit() {
    document.querySelectorAll('.fmt-widget').forEach(widget => {
        const toolId = fmtGetToolId(widget);
        if (!toolId) return;
        const data = fmtGetData(toolId), input = widget.querySelector('.fmt-input'), output = widget.querySelector('.fmt-output');
        if (input && data.input) input.value = data.input;
        if (output && data.output) output.value = data.output;
        if (data.format) widget.querySelectorAll('.fmt-format-btn').forEach(btn => btn.classList.toggle('active', btn.textContent.toLowerCase() === data.format));
        fmtSetupResizer(widget);
    });
}
function fmtSetupResizer(widget) {
    const resizer = widget.querySelector('.fmt-resizer'), container = widget.querySelector('.fmt-container');
    if (!resizer) return;
    const leftPane = container.querySelector('.fmt-pane:first-child'), rightPane = container.querySelector('.fmt-pane:last-child');
    let isResizing = false;
    resizer.addEventListener('mousedown', () => { isResizing = true; document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; });
    document.addEventListener('mousemove', (e) => { if (!isResizing) return; const rect = container.getBoundingClientRect(), x = e.clientX - rect.left, total = rect.width - 6, leftWidth = Math.max(100, Math.min(x, total - 100)); leftPane.style.flex = `0 0 ${leftWidth}px`; rightPane.style.flex = `0 0 ${total - leftWidth}px`; });
    document.addEventListener('mouseup', () => { if (isResizing) { isResizing = false; document.body.style.cursor = ''; document.body.style.userSelect = ''; } });
}
function fmtSetFormat(btn, format) {
    const widget = btn.closest('.fmt-widget');
    widget.querySelectorAll('.fmt-format-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const toolId = fmtGetToolId(widget);
    if (toolId) { const data = fmtGetData(toolId); data.format = format; fmtSaveData(toolId, data); }
    fmtUpdateStatus(widget, '');
}
function fmtGetFormat(widget) { const activeBtn = widget.querySelector('.fmt-format-btn.active'); return activeBtn ? activeBtn.textContent.toLowerCase() : 'json'; }
function fmtOnInput(textarea) { const widget = textarea.closest('.fmt-widget'), toolId = fmtGetToolId(widget); if (toolId) { const data = fmtGetData(toolId); data.input = textarea.value; fmtSaveData(toolId, data); } }
function fmtPrettify(btn) {
    const widget = btn.closest('.fmt-widget'), format = fmtGetFormat(widget), input = widget.querySelector('.fmt-input').value, output = widget.querySelector('.fmt-output');
    if (!input.trim()) { fmtUpdateStatus(widget, 'No input provided', 'error'); return; }
    try {
        let result;
        switch (format) { case 'json': result = fmtPrettifyJSON(input); break; case 'xml': result = fmtPrettifyXML(input); break; case 'csv': result = fmtPrettifyCSV(input); break; case 'sql': result = fmtPrettifySQL(input); break; default: result = input; }
        output.value = result;
        fmtUpdateStatus(widget, `Prettified ${format.toUpperCase()} successfully`, 'success');
        const toolId = fmtGetToolId(widget);
        if (toolId) { const data = fmtGetData(toolId); data.output = result; fmtSaveData(toolId, data); }
    } catch (e) { fmtUpdateStatus(widget, `Error: ${e.message}`, 'error'); }
}
function fmtMinify(btn) {
    const widget = btn.closest('.fmt-widget'), format = fmtGetFormat(widget), input = widget.querySelector('.fmt-input').value, output = widget.querySelector('.fmt-output');
    if (!input.trim()) { fmtUpdateStatus(widget, 'No input provided', 'error'); return; }
    try {
        let result;
        switch (format) { case 'json': result = fmtMinifyJSON(input); break; case 'xml': result = fmtMinifyXML(input); break; case 'csv': result = fmtMinifyCSV(input); break; case 'sql': result = fmtMinifySQL(input); break; default: result = input; }
        output.value = result;
        fmtUpdateStatus(widget, `Minified ${format.toUpperCase()} successfully`, 'success');
        const toolId = fmtGetToolId(widget);
        if (toolId) { const data = fmtGetData(toolId); data.output = result; fmtSaveData(toolId, data); }
    } catch (e) { fmtUpdateStatus(widget, `Error: ${e.message}`, 'error'); }
}
function fmtCopy(btn) { const widget = btn.closest('.fmt-widget'), output = widget.querySelector('.fmt-output').value; if (!output) { fmtUpdateStatus(widget, 'Nothing to copy', 'error'); return; } navigator.clipboard.writeText(output).then(() => { const orig = btn.textContent; btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = orig, 1500); }); }
function fmtSwap(btn) { const widget = btn.closest('.fmt-widget'), input = widget.querySelector('.fmt-input'), output = widget.querySelector('.fmt-output'); const temp = input.value; input.value = output.value; output.value = temp; const toolId = fmtGetToolId(widget); if (toolId) { const data = fmtGetData(toolId); data.input = input.value; data.output = output.value; fmtSaveData(toolId, data); } fmtUpdateStatus(widget, 'Swapped input and output', 'success'); }
function fmtUpdateStatus(widget, message, type = '') { const status = widget.querySelector('.fmt-status'); status.textContent = message; status.className = 'fmt-status' + (type ? ` ${type}` : ''); }
function fmtPrettifyJSON(input) { return JSON.stringify(JSON.parse(input), null, 2); }
function fmtMinifyJSON(input) { return JSON.stringify(JSON.parse(input)); }
function fmtPrettifyXML(input) {
    let xml = input.replace(/>\s+</g, '><').trim();
    if (!xml.startsWith('<')) throw new Error('Invalid XML: must start with <');
    let formatted = '', indent = 0;
    const tab = '  ', parts = xml.split(/(<[^>]+>)/);
    for (let part of parts) {
        part = part.trim();
        if (!part) continue;
        if (part.startsWith('</')) { indent--; formatted += tab.repeat(Math.max(0, indent)) + part + '\n'; }
        else if (part.startsWith('<?') || part.startsWith('<!')) formatted += part + '\n';
        else if (part.startsWith('<') && part.endsWith('/>')) formatted += tab.repeat(indent) + part + '\n';
        else if (part.startsWith('<')) { formatted += tab.repeat(indent) + part + '\n'; indent++; }
        else { indent--; formatted = formatted.trimEnd() + part + '\n'; indent++; }
    }
    return formatted.trim();
}
function fmtMinifyXML(input) { return input.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim(); }
function fmtPrettifyCSV(input) {
    const lines = input.trim().split(/\r?\n/), rows = lines.map(line => fmtParseCSVLine(line)), colWidths = [];
    for (const row of rows) for (let i = 0; i < row.length; i++) if (!colWidths[i] || row[i].length > colWidths[i]) colWidths[i] = row[i].length;
    return rows.map(row => row.map((cell, i) => cell.padEnd(colWidths[i] || 0)).join(' | ')).join('\n');
}
function fmtParseCSVLine(line) {
    const result = []; let current = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') { if (inQuotes && line[i + 1] === '"') { current += '"'; i++; } else inQuotes = !inQuotes; }
        else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
        else current += char;
    }
    result.push(current.trim());
    return result;
}
function fmtMinifyCSV(input) { return input.trim().split(/\r?\n/).map(line => fmtParseCSVLine(line).map(cell => { cell = cell.trim(); return (cell.includes(',') || cell.includes('"') || cell.includes('\n')) ? '"' + cell.replace(/"/g, '""') + '"' : cell; }).join(',')).join('\n'); }
function fmtPrettifySQL(input) {
    const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'SET', 'VALUES', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'CREATE INDEX', 'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS'];
    let sql = input.replace(/\s+/g, ' ').trim();
    for (const keyword of majorKeywords.sort((a, b) => b.length - a.length)) sql = sql.replace(new RegExp(`\\b(${keyword})\\b`, 'gi'), '\n$1');
    let result = '', indent = 0;
    for (let line of sql.split('\n')) {
        line = line.trim();
        if (!line) continue;
        if (line.startsWith(')')) indent = Math.max(0, indent - 1);
        result += '  '.repeat(indent) + line.replace(/\b(SELECT|FROM|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|SET|VALUES|INSERT|INTO|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|UNION|ALL|EXCEPT|INTERSECT|CASE|WHEN|THEN|ELSE|END|AS|LIMIT|OFFSET|NULL|NOT|IN|IS|LIKE|BETWEEN)\b/gi, m => m.toUpperCase()) + '\n';
        if (line.endsWith('(')) indent++;
    }
    return result.trim();
}
function fmtMinifySQL(input) { return input.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([(),])\s*/g, '$1').replace(/\s*([=<>!]+)\s*/g, ' $1 ').trim(); }

// ==================== Cron Expression Functions ====================
function cronGetToolId(element) { return element.closest('.tool')?.getAttribute('data-tool'); }
function cronGetData(toolId) { const customizations = loadToolCustomizations(); return (customizations[toolId]?.cronData) || { expression: '0 9 * * MON-FRI' }; }
function cronSaveData(toolId, data) { const customizations = loadToolCustomizations(); if (!customizations[toolId]) customizations[toolId] = {}; customizations[toolId].cronData = data; saveToolCustomizations(customizations); }
function cronInit() { document.querySelectorAll('.cron-widget').forEach(widget => { const toolId = cronGetToolId(widget); if (!toolId) return; const data = cronGetData(toolId), input = widget.querySelector('.cron-input'); if (input && data.expression) input.value = data.expression; cronParse(input); }); }
function cronSetPreset(btn, expression) { const widget = btn.closest('.cron-widget'), input = widget.querySelector('.cron-input'); input.value = expression; cronParse(input); }
function cronParse(input) {
    const widget = input.closest('.cron-widget'), expression = input.value.trim();
    const explanationEl = widget.querySelector('.cron-explanation-text'), fieldsEl = widget.querySelector('.cron-fields');
    const scheduleList = widget.querySelector('.cron-schedule-list'), scheduleCount = widget.querySelector('.cron-schedule-count');
    const toolId = cronGetToolId(widget);
    if (toolId) cronSaveData(toolId, { expression });
    const result = cronParseExpression(expression);
    if (result.error) { input.classList.remove('valid'); input.classList.add('invalid'); explanationEl.innerHTML = `<span class="cron-error">${result.error}</span>`; fieldsEl.innerHTML = ''; scheduleList.innerHTML = ''; scheduleCount.textContent = ''; return; }
    input.classList.remove('invalid'); input.classList.add('valid');
    explanationEl.innerHTML = result.explanation;
    fieldsEl.innerHTML = result.fields.map(f => `<div class="cron-field"><div class="cron-field-value">${escapeHtml(f.value)}</div><div class="cron-field-name">${f.name}</div><div class="cron-field-desc">${f.desc}</div></div>`).join('');
    const nextRuns = cronGetNextRuns(result.parsed, 10);
    scheduleCount.textContent = `Next ${nextRuns.length} runs`;
    scheduleList.innerHTML = nextRuns.map(run => `<div class="cron-schedule-item"><span class="cron-schedule-date">${cronFormatDate(run)}</span><span class="cron-schedule-relative">${cronRelativeTime(run)}</span></div>`).join('');
}
function cronParseExpression(expr) {
    const parts = expr.split(/\s+/);
    if (parts.length !== 5) return { error: `Invalid cron expression: expected 5 fields, got ${parts.length}` };
    const fieldDefs = [{ name: 'Minute', min: 0, max: 59 }, { name: 'Hour', min: 0, max: 23 }, { name: 'Day', min: 1, max: 31 }, { name: 'Month', min: 1, max: 12 }, { name: 'Weekday', min: 0, max: 7 }];
    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const parsed = [], fields = [];
    for (let i = 0; i < 5; i++) {
        const result = cronParseField(parts[i], fieldDefs[i].min, fieldDefs[i].max, i);
        if (result.error) return { error: `${fieldDefs[i].name}: ${result.error}` };
        parsed.push(result.values);
        fields.push({ value: parts[i], name: fieldDefs[i].name, desc: cronDescribeField(result.values, i, monthNames, dayNames) });
    }
    return { parsed, fields, explanation: cronBuildExplanation(parts, parsed, monthNames, dayNames) };
}
function cronParseField(field, min, max, fieldIndex) {
    const monthMap = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
    const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    let normalized = field.toLowerCase();
    if (fieldIndex === 3) for (const [name, val] of Object.entries(monthMap)) normalized = normalized.replace(new RegExp(name, 'gi'), val);
    else if (fieldIndex === 4) for (const [name, val] of Object.entries(dayMap)) normalized = normalized.replace(new RegExp(name, 'gi'), val);
    const values = new Set();
    for (const part of normalized.split(',')) {
        const stepMatch = part.match(/^(.+)\/(\d+)$/);
        let range = stepMatch ? stepMatch[1] : part;
        const step = stepMatch ? parseInt(stepMatch[2]) : 1;
        if (step < 1) return { error: 'Step must be at least 1' };
        let start, end;
        if (range === '*') { start = min; end = max; }
        else if (range.includes('-')) { const [s, e] = range.split('-').map(Number); if (isNaN(s) || isNaN(e)) return { error: 'Invalid range' }; start = s; end = e; }
        else { const val = parseInt(range); if (isNaN(val)) return { error: `Invalid value: ${range}` }; start = val; end = val; }
        if (fieldIndex === 4) { if (start === 7) start = 0; if (end === 7) end = 0; }
        const actualMin = fieldIndex === 4 ? 0 : min, actualMax = fieldIndex === 4 ? 6 : max;
        if (start < actualMin || start > actualMax || end < actualMin || end > actualMax) return { error: `Value out of range (${actualMin}-${actualMax})` };
        if (start > end && fieldIndex === 4) { for (let v = start; v <= 6; v += step) values.add(v); for (let v = 0; v <= end; v += step) values.add(v); }
        else if (start > end) return { error: 'Start of range must be less than end' };
        else for (let v = start; v <= end; v += step) values.add(v);
    }
    return { values: Array.from(values).sort((a, b) => a - b) };
}
function cronDescribeField(values, fieldIndex, monthNames, dayNames) {
    const fieldDefs = [{ min: 0, max: 59, name: 'minute' }, { min: 0, max: 23, name: 'hour' }, { min: 1, max: 31, name: 'day' }, { min: 1, max: 12, name: 'month' }, { min: 0, max: 6, name: 'weekday' }];
    const def = fieldDefs[fieldIndex], allValues = [];
    for (let i = def.min; i <= def.max; i++) allValues.push(i);
    if (values.length === allValues.length && values.every((v, i) => v === allValues[i])) return 'every ' + def.name;
    if (fieldIndex === 3) return values.map(v => monthNames[v]).join(', ');
    if (fieldIndex === 4) return values.map(v => dayNames[v]).join(', ');
    if (values.length === 1) return 'at ' + values[0];
    if (values.length <= 3) return values.join(', ');
    return `${values.length} values`;
}
function cronBuildExplanation(parts, parsed, monthNames, dayNames) {
    const [minutes, hours, days, months, weekdays] = parsed;
    let result = 'Runs <strong>';
    const isEveryMinute = minutes.length === 60, isEveryHour = hours.length === 24;
    if (isEveryMinute && isEveryHour) result += 'every minute';
    else if (isEveryMinute) result += hours.length === 1 ? `every minute during hour ${hours[0]}` : `every minute during hours ${hours.join(', ')}`;
    else if (isEveryHour) result += minutes.length === 1 ? `at minute ${minutes[0]} of every hour` : `at minutes ${minutes.join(', ')} of every hour`;
    else if (hours.length === 1 && minutes.length === 1) result += `at ${String(hours[0]).padStart(2, '0')}:${String(minutes[0]).padStart(2, '0')}`;
    else if (hours.length <= 3 && minutes.length === 1) result += `at ${hours.map(h => `${String(h).padStart(2, '0')}:${String(minutes[0]).padStart(2, '0')}`).join(', ')}`;
    else result += `at minute ${minutes.join(', ')} past hour ${hours.join(', ')}`;
    result += '</strong>';
    const isEveryDay = days.length === 31, isEveryMonth = months.length === 12, isEveryWeekday = weekdays.length === 7;
    if (!isEveryDay || !isEveryWeekday) {
        if (!isEveryDay && !isEveryWeekday) result += ` on day ${days.join(', ')} and ${weekdays.map(w => dayNames[w]).join(', ')}`;
        else if (!isEveryDay) result += ` on day ${days.join(', ')} of the month`;
        else if (!isEveryWeekday) {
            if (weekdays.length === 5 && !weekdays.includes(0) && !weekdays.includes(6)) result += ' on weekdays';
            else if (weekdays.length === 2 && weekdays.includes(0) && weekdays.includes(6)) result += ' on weekends';
            else result += ` on ${weekdays.map(w => dayNames[w]).join(', ')}`;
        }
    }
    if (!isEveryMonth) result += ` in ${months.map(m => monthNames[m]).join(', ')}`;
    return result;
}
function cronGetNextRuns(parsed, count) {
    const [minutes, hours, days, months, weekdays] = parsed, runs = [];
    let current = new Date();
    current.setSeconds(0); current.setMilliseconds(0); current.setMinutes(current.getMinutes() + 1);
    let iterations = 0;
    while (runs.length < count && iterations < 100000) {
        iterations++;
        const minute = current.getMinutes(), hour = current.getHours(), day = current.getDate(), month = current.getMonth() + 1, weekday = current.getDay();
        if (months.includes(month) && (days.includes(day) || weekdays.includes(weekday)) && hours.includes(hour) && minutes.includes(minute)) runs.push(new Date(current));
        current.setMinutes(current.getMinutes() + 1);
    }
    return runs;
}
function cronFormatDate(date) { const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`; }
function cronRelativeTime(date) { const diffMs = date - new Date(), diffMins = Math.floor(diffMs / 60000), diffHours = Math.floor(diffMins / 60), diffDays = Math.floor(diffHours / 24); if (diffMins < 60) return `in ${diffMins} min${diffMins !== 1 ? 's' : ''}`; if (diffHours < 24) return `in ${diffHours}h ${diffMins % 60}m`; if (diffDays < 7) return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`; return `in ${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''}`; }

// ==================== Regex Tester Functions ====================
function regexGetToolId(element) { return element.closest('.tool')?.getAttribute('data-tool'); }
function regexGetData(toolId) { const customizations = loadToolCustomizations(); return (customizations[toolId]?.regexData) || { pattern: '', testString: '', flags: { g: true, i: false, m: false, s: false } }; }
function regexSaveData(toolId, data) { const customizations = loadToolCustomizations(); if (!customizations[toolId]) customizations[toolId] = {}; customizations[toolId].regexData = data; saveToolCustomizations(customizations); }
function regexInit() {
    document.querySelectorAll('.regex-widget').forEach(widget => {
        const toolId = regexGetToolId(widget);
        if (!toolId) return;
        const data = regexGetData(toolId), patternInput = widget.querySelector('.regex-pattern'), testInput = widget.querySelector('.regex-test-string');
        if (patternInput && data.pattern) patternInput.value = data.pattern;
        if (testInput && data.testString) testInput.value = data.testString;
        if (data.flags) widget.querySelectorAll('.regex-flag').forEach(checkbox => { const flag = checkbox.getAttribute('data-flag'); if (flag && data.flags[flag] !== undefined) checkbox.checked = data.flags[flag]; });
        regexSetupResizer(widget);
        regexExecute(widget);
    });
}
function regexSetupResizer(widget) {
    const resizer = widget.querySelector('.regex-resizer'), container = widget.querySelector('.regex-container');
    if (!resizer) return;
    const leftPane = container.querySelector('.regex-pane:first-child'), rightPane = container.querySelector('.regex-pane:last-child');
    let isResizing = false;
    resizer.addEventListener('mousedown', () => { isResizing = true; document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; });
    document.addEventListener('mousemove', (e) => { if (!isResizing) return; const rect = container.getBoundingClientRect(), x = e.clientX - rect.left, total = rect.width - 6, leftWidth = Math.max(100, Math.min(x, total - 100)); leftPane.style.flex = `0 0 ${leftWidth}px`; rightPane.style.flex = `0 0 ${total - leftWidth}px`; });
    document.addEventListener('mouseup', () => { if (isResizing) { isResizing = false; document.body.style.cursor = ''; document.body.style.userSelect = ''; } });
}
function regexOnInput(element) {
    const widget = element.closest('.regex-widget'), toolId = regexGetToolId(widget);
    if (toolId) {
        const data = regexGetData(toolId);
        data.pattern = widget.querySelector('.regex-pattern').value;
        data.testString = widget.querySelector('.regex-test-string').value;
        data.flags = {};
        widget.querySelectorAll('.regex-flag').forEach(checkbox => { const flag = checkbox.getAttribute('data-flag'); if (flag) data.flags[flag] = checkbox.checked; });
        regexSaveData(toolId, data);
    }
    regexExecute(widget);
}
function regexGetFlags(widget) { let flags = ''; widget.querySelectorAll('.regex-flag:checked').forEach(checkbox => flags += checkbox.getAttribute('data-flag') || ''); return flags; }
function regexExecute(widget) {
    const pattern = widget.querySelector('.regex-pattern').value, testString = widget.querySelector('.regex-test-string').value;
    const resultsDiv = widget.querySelector('.regex-results'), statusDiv = widget.querySelector('.regex-status'), flags = regexGetFlags(widget);
    if (!pattern) { resultsDiv.innerHTML = '<span class="no-match">Enter a regex pattern to see matches</span>'; statusDiv.textContent = ''; statusDiv.className = 'regex-status'; return; }
    try {
        const regex = new RegExp(pattern, flags), matches = [];
        let match;
        if (flags.includes('g')) { while ((match = regex.exec(testString)) !== null) { matches.push({ value: match[0], index: match.index, groups: match.slice(1) }); if (match.index === regex.lastIndex) regex.lastIndex++; } }
        else { match = regex.exec(testString); if (match) matches.push({ value: match[0], index: match.index, groups: match.slice(1) }); }
        if (matches.length === 0) { resultsDiv.innerHTML = '<span class="no-match">No matches found</span>'; statusDiv.textContent = 'No matches'; statusDiv.className = 'regex-status'; return; }
        let highlighted = '', lastIndex = 0;
        for (const m of matches) { highlighted += regexEscapeHtml(testString.slice(lastIndex, m.index)) + `<span class="match-highlight">${regexEscapeHtml(m.value)}</span>`; lastIndex = m.index + m.value.length; }
        highlighted += regexEscapeHtml(testString.slice(lastIndex));
        let details = '<div class="match-info"><strong>Match Details:</strong>';
        matches.forEach((m, i) => { details += `<div class="match-item"><div class="match-index">Match ${i + 1} at index ${m.index}</div><div class="match-value">${regexEscapeHtml(m.value)}</div>`; if (m.groups.length > 0) { details += '<div class="match-groups">'; m.groups.forEach((g, gi) => details += `<div class="group-item">Group ${gi + 1}: ${g !== undefined ? regexEscapeHtml(g) : '<em>undefined</em>'}</div>`); details += '</div>'; } details += '</div>'; });
        details += '</div>';
        resultsDiv.innerHTML = `<div style="white-space:pre-wrap;word-break:break-all;margin-bottom:10px;">${highlighted}</div>${details}`;
        statusDiv.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''} found`;
        statusDiv.className = 'regex-status success';
    } catch (e) { resultsDiv.innerHTML = `<span class="no-match">Invalid regex: ${regexEscapeHtml(e.message)}</span>`; statusDiv.textContent = 'Invalid pattern'; statusDiv.className = 'regex-status error'; }
}
function regexEscapeHtml(str) { return str ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;') : ''; }
function regexCopy(btn) { const widget = btn.closest('.regex-widget'), pattern = widget.querySelector('.regex-pattern').value, flags = regexGetFlags(widget); if (!pattern) return; navigator.clipboard.writeText(`/${pattern}/${flags}`).then(() => { const orig = btn.textContent; btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = orig, 1500); }); }
function regexClear(btn) { const widget = btn.closest('.regex-widget'); widget.querySelector('.regex-pattern').value = ''; widget.querySelector('.regex-test-string').value = ''; regexOnInput(widget.querySelector('.regex-pattern')); }

// ==================== Base64 Encoder/Decoder Functions ====================
function b64GetToolId(element) {
    const tool = element.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function b64GetData(toolId) {
    const customizations = loadToolCustomizations();
    const custom = customizations[toolId] || {};
    return custom.b64Data || { input: '', mode: 'encode' };
}

function b64SaveData(toolId, data) {
    const customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].b64Data = data;
    saveToolCustomizations(customizations);
}

function b64Init() {
    document.querySelectorAll('.b64-widget').forEach(widget => {
        const toolId = b64GetToolId(widget);
        if (!toolId) return;
        const data = b64GetData(toolId);
        widget.querySelectorAll('.b64-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent.toLowerCase() === data.mode);
        });
        const inputArea = widget.querySelector('.b64-input');
        inputArea.value = data.input;
        b64UpdateLabels(widget, data.mode);
        b64Process(widget, toolId);
    });
}

function b64SetMode(btn, mode) {
    const widget = btn.closest('.b64-widget');
    const toolId = b64GetToolId(widget);
    if (!toolId) return;
    const data = b64GetData(toolId);
    data.mode = mode;
    data.input = '';
    b64SaveData(toolId, data);
    widget.querySelectorAll('.b64-mode-btn').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase() === mode));
    widget.querySelector('.b64-input').value = '';
    widget.querySelector('.b64-output').value = '';
    widget.querySelector('.b64-status').textContent = '';
    widget.querySelector('.b64-status').className = 'b64-status';
    widget.querySelector('.b64-input-count').textContent = '';
    widget.querySelector('.b64-output-count').textContent = '';
    b64UpdateLabels(widget, mode);
}

function b64UpdateLabels(widget, mode) {
    const inputLabel = widget.querySelector('.b64-input-label');
    const outputLabel = widget.querySelector('.b64-output-label');
    const inputArea = widget.querySelector('.b64-input');
    const outputArea = widget.querySelector('.b64-output');
    if (mode === 'encode') {
        inputLabel.textContent = 'Text Input';
        outputLabel.textContent = 'Base64 Output';
        inputArea.placeholder = 'Enter text to encode...';
        outputArea.placeholder = 'Encoded result will appear here...';
    } else {
        inputLabel.textContent = 'Base64 Input';
        outputLabel.textContent = 'Decoded Output';
        inputArea.placeholder = 'Enter Base64 string to decode...';
        outputArea.placeholder = 'Decoded result will appear here...';
    }
}

function b64OnInput(textarea) {
    const widget = textarea.closest('.b64-widget');
    const toolId = b64GetToolId(widget);
    if (!toolId) return;
    const data = b64GetData(toolId);
    data.input = textarea.value;
    b64SaveData(toolId, data);
    b64Process(widget, toolId);
}

function b64Process(widget, toolId) {
    const data = b64GetData(toolId);
    const output = widget.querySelector('.b64-output');
    const status = widget.querySelector('.b64-status');
    const inputCount = widget.querySelector('.b64-input-count');
    const outputCount = widget.querySelector('.b64-output-count');
    if (!data.input) {
        output.value = '';
        status.textContent = '';
        status.className = 'b64-status';
        inputCount.textContent = '';
        outputCount.textContent = '';
        return;
    }
    try {
        let result;
        if (data.mode === 'encode') {
            result = btoa(unescape(encodeURIComponent(data.input)));
            inputCount.textContent = new Blob([data.input]).size + ' bytes';
            outputCount.textContent = result.length + ' chars';
            status.textContent = 'Encoded successfully';
            status.className = 'b64-status success';
        } else {
            const cleaned = data.input.replace(/\s/g, '');
            result = decodeURIComponent(escape(atob(cleaned)));
            inputCount.textContent = cleaned.length + ' chars';
            outputCount.textContent = new Blob([result]).size + ' bytes';
            status.textContent = 'Decoded successfully';
            status.className = 'b64-status success';
        }
        output.value = result;
    } catch (e) {
        output.value = '';
        outputCount.textContent = '';
        status.textContent = data.mode === 'encode' ? 'Encoding error: ' + e.message : 'Invalid Base64 string';
        status.className = 'b64-status error';
    }
}

function b64Swap(btn) {
    const widget = btn.closest('.b64-widget');
    const toolId = b64GetToolId(widget);
    if (!toolId) return;
    const data = b64GetData(toolId);
    const outputVal = widget.querySelector('.b64-output').value;
    if (!outputVal) return;
    data.mode = data.mode === 'encode' ? 'decode' : 'encode';
    data.input = outputVal;
    b64SaveData(toolId, data);
    widget.querySelectorAll('.b64-mode-btn').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase() === data.mode));
    widget.querySelector('.b64-input').value = data.input;
    b64UpdateLabels(widget, data.mode);
    b64Process(widget, toolId);
}

function b64Copy(btn) {
    const widget = btn.closest('.b64-widget');
    const output = widget.querySelector('.b64-output').value;
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = orig, 1500);
    });
}

function b64Clear(btn) {
    const widget = btn.closest('.b64-widget');
    const toolId = b64GetToolId(widget);
    if (!toolId) return;
    const data = b64GetData(toolId);
    data.input = '';
    b64SaveData(toolId, data);
    widget.querySelector('.b64-input').value = '';
    widget.querySelector('.b64-output').value = '';
    widget.querySelector('.b64-status').textContent = '';
    widget.querySelector('.b64-status').className = 'b64-status';
    widget.querySelector('.b64-input-count').textContent = '';
    widget.querySelector('.b64-output-count').textContent = '';
}

// ==================== Lorem Ipsum Generator Functions ====================
var LOREM_WORDS = [
    'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
    'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim',
    'ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi',
    'aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit',
    'voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint',
    'occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt',
    'mollit','anim','id','est','laborum','ac','accumsan','aliquet','ante','aptent',
    'arcu','at','auctor','augue','bibendum','blandit','class','convallis','cras',
    'cubilia','curabitur','cursus','dapibus','diam','dictum','dignissim','donec',
    'egestas','eleifend','elementum','euismod','facilisi','fames','faucibus',
    'fermentum','feugiat','fringilla','fusce','gravida','habitant','habitasse','hac',
    'hendrerit','himenaeos','iaculis','imperdiet','integer','interdum','justo','lacinia',
    'lacus','laoreet','lectus','leo','ligula','litora','lobortis','luctus','maecenas',
    'massa','mattis','mauris','metus','mi','morbi','nam','nec','neque','nibh','nisl',
    'nunc','odio','orci','ornare','pellentesque','pharetra','phasellus','placerat',
    'platea','porta','porttitor','posuere','praesent','pretium','primis','proin',
    'pulvinar','purus','quam','quisque','rhoncus','ridiculus','risus','rutrum',
    'sagittis','sapien','scelerisque','semper','senectus','sociosqu','sodales',
    'sollicitudin','suscipit','suspendisse','taciti','tellus','tincidunt','torquent',
    'tortor','tristique','turpis','ultrices','ultricies','urna','varius','vehicula',
    'vel','vestibulum','vitae','vivamus','viverra','volutpat','vulputate'
];

var LOREM_FIRST_SENTENCE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

function loremGetToolId(element) {
    const tool = element.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function loremPickWord() {
    return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function loremSentence(minWords, maxWords) {
    const len = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
    const words = [];
    for (let i = 0; i < len; i++) words.push(loremPickWord());
    words[0] = words[0][0].toUpperCase() + words[0].slice(1);
    // Insert a comma or two in longer sentences
    if (len > 8) {
        const pos = 3 + Math.floor(Math.random() * (len - 6));
        words[pos] = words[pos] + ',';
    }
    return words.join(' ') + '.';
}

function loremParagraph(minSentences, maxSentences) {
    const count = minSentences + Math.floor(Math.random() * (maxSentences - minSentences + 1));
    const sentences = [];
    for (let i = 0; i < count; i++) sentences.push(loremSentence(6, 16));
    return sentences.join(' ');
}

function loremInit() {
    document.querySelectorAll('.lorem-widget').forEach(widget => {
        loremGenerate(widget.querySelector('.lorem-type-select'));
    });
}

function loremGenerate(element) {
    const widget = element.closest('.lorem-widget');
    if (!widget) return;
    const count = parseInt(widget.querySelector('.lorem-count-input').value) || 3;
    const type = widget.querySelector('.lorem-type-select').value;
    const startWithLorem = widget.querySelector('.lorem-start-lorem').checked;
    const htmlTags = widget.querySelector('.lorem-html-tags').checked;
    const output = widget.querySelector('.lorem-output');
    const stats = widget.querySelector('.lorem-stats');

    let text = '';
    const clamped = Math.max(1, Math.min(100, count));

    if (type === 'paragraphs') {
        const paras = [];
        for (let i = 0; i < clamped; i++) {
            let p = loremParagraph(4, 7);
            if (i === 0 && startWithLorem) p = LOREM_FIRST_SENTENCE + ' ' + p;
            paras.push(htmlTags ? '<p>' + p + '</p>' : p);
        }
        text = paras.join(htmlTags ? '\n' : '\n\n');
    } else if (type === 'sentences') {
        const sentences = [];
        for (let i = 0; i < clamped; i++) {
            let s = loremSentence(6, 16);
            if (i === 0 && startWithLorem) s = LOREM_FIRST_SENTENCE;
            sentences.push(s);
        }
        text = sentences.join(' ');
    } else if (type === 'words') {
        const words = [];
        if (startWithLorem) {
            const starter = LOREM_FIRST_SENTENCE.replace('.', '').split(' ');
            for (let i = 0; i < Math.min(clamped, starter.length); i++) words.push(starter[i]);
        }
        while (words.length < clamped) words.push(loremPickWord());
        text = words.slice(0, clamped).join(' ');
    } else if (type === 'list') {
        const items = [];
        for (let i = 0; i < clamped; i++) {
            let s = loremSentence(4, 10);
            if (i === 0 && startWithLorem) s = LOREM_FIRST_SENTENCE;
            items.push(htmlTags ? '<li>' + s + '</li>' : '• ' + s);
        }
        text = htmlTags ? '<ul>\n' + items.join('\n') + '\n</ul>' : items.join('\n');
    }

    if (output) output.value = text;
    if (stats) {
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        const charCount = text.length;
        stats.textContent = wordCount + ' words · ' + charCount + ' characters';
    }
}

function loremCopy(btn) {
    const widget = btn.closest('.lorem-widget');
    const text = widget.querySelector('.lorem-output').value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = orig, 1500);
    });
}

function loremClear(btn) {
    const widget = btn.closest('.lorem-widget');
    widget.querySelector('.lorem-output').value = '';
    widget.querySelector('.lorem-stats').textContent = '';
}

// ==================== ASCII & HTML Codes Functions ====================
var ASCII_CONTROL_NAMES = [
    'NUL','SOH','STX','ETX','EOT','ENQ','ACK','BEL','BS','HT','LF','VT','FF','CR','SO','SI',
    'DLE','DC1','DC2','DC3','DC4','NAK','SYN','ETB','CAN','EM','SUB','ESC','FS','GS','RS','US'
];

var ASCII_CONTROL_DESC = [
    'Null','Start of Heading','Start of Text','End of Text','End of Transmission','Enquiry',
    'Acknowledge','Bell','Backspace','Horizontal Tab','Line Feed','Vertical Tab','Form Feed',
    'Carriage Return','Shift Out','Shift In','Data Link Escape','Device Control 1','Device Control 2',
    'Device Control 3','Device Control 4','Negative Acknowledge','Synchronous Idle',
    'End of Transmission Block','Cancel','End of Medium','Substitute','Escape',
    'File Separator','Group Separator','Record Separator','Unit Separator'
];

var ASCII_HTML_ENTITIES = {
    32:'&nbsp;',34:'&quot;',38:'&amp;',39:'&apos;',60:'&lt;',62:'&gt;',
    160:'&nbsp;',161:'&iexcl;',162:'&cent;',163:'&pound;',164:'&curren;',165:'&yen;',
    166:'&brvbar;',167:'&sect;',168:'&uml;',169:'&copy;',170:'&ordf;',171:'&laquo;',
    172:'&not;',173:'&shy;',174:'&reg;',175:'&macr;',176:'&deg;',177:'&plusmn;',
    178:'&sup2;',179:'&sup3;',180:'&acute;',181:'&micro;',182:'&para;',183:'&middot;',
    184:'&cedil;',185:'&sup1;',186:'&ordm;',187:'&raquo;',188:'&frac14;',189:'&frac12;',
    190:'&frac34;',191:'&iquest;',192:'&Agrave;',193:'&Aacute;',194:'&Acirc;',195:'&Atilde;',
    196:'&Auml;',197:'&Aring;',198:'&AElig;',199:'&Ccedil;',200:'&Egrave;',201:'&Eacute;',
    202:'&Ecirc;',203:'&Euml;',204:'&Igrave;',205:'&Iacute;',206:'&Icirc;',207:'&Iuml;',
    208:'&ETH;',209:'&Ntilde;',210:'&Ograve;',211:'&Oacute;',212:'&Ocirc;',213:'&Otilde;',
    214:'&Ouml;',215:'&times;',216:'&Oslash;',217:'&Ugrave;',218:'&Uacute;',219:'&Ucirc;',
    220:'&Uuml;',221:'&Yacute;',222:'&THORN;',223:'&szlig;',224:'&agrave;',225:'&aacute;',
    226:'&acirc;',227:'&atilde;',228:'&auml;',229:'&aring;',230:'&aelig;',231:'&ccedil;',
    232:'&egrave;',233:'&eacute;',234:'&ecirc;',235:'&euml;',236:'&igrave;',237:'&iacute;',
    238:'&icirc;',239:'&iuml;',240:'&eth;',241:'&ntilde;',242:'&ograve;',243:'&oacute;',
    244:'&ocirc;',245:'&otilde;',246:'&ouml;',247:'&divide;',248:'&oslash;',249:'&ugrave;',
    250:'&uacute;',251:'&ucirc;',252:'&uuml;',253:'&yacute;',254:'&thorn;',255:'&yuml;',
    338:'&OElig;',339:'&oelig;',352:'&Scaron;',353:'&scaron;',376:'&Yuml;',
    402:'&fnof;',
    710:'&circ;',732:'&tilde;',
    913:'&Alpha;',914:'&Beta;',915:'&Gamma;',916:'&Delta;',917:'&Epsilon;',918:'&Zeta;',
    919:'&Eta;',920:'&Theta;',921:'&Iota;',922:'&Kappa;',923:'&Lambda;',924:'&Mu;',
    925:'&Nu;',926:'&Xi;',927:'&Omicron;',928:'&Pi;',929:'&Rho;',931:'&Sigma;',
    932:'&Tau;',933:'&Upsilon;',934:'&Phi;',935:'&Chi;',936:'&Psi;',937:'&Omega;',
    945:'&alpha;',946:'&beta;',947:'&gamma;',948:'&delta;',949:'&epsilon;',950:'&zeta;',
    951:'&eta;',952:'&theta;',953:'&iota;',954:'&kappa;',955:'&lambda;',956:'&mu;',
    957:'&nu;',958:'&xi;',959:'&omicron;',960:'&pi;',961:'&rho;',962:'&sigmaf;',
    963:'&sigma;',964:'&tau;',965:'&upsilon;',966:'&phi;',967:'&chi;',968:'&psi;',969:'&omega;',
    977:'&thetasym;',978:'&upsih;',982:'&piv;',
    8194:'&ensp;',8195:'&emsp;',8201:'&thinsp;',
    8204:'&zwnj;',8205:'&zwj;',8206:'&lrm;',8207:'&rlm;',
    8211:'&ndash;',8212:'&mdash;',8216:'&lsquo;',8217:'&rsquo;',8218:'&sbquo;',
    8220:'&ldquo;',8221:'&rdquo;',8222:'&bdquo;',8224:'&dagger;',8225:'&Dagger;',
    8226:'&bull;',8230:'&hellip;',8240:'&permil;',8242:'&prime;',8243:'&Prime;',
    8249:'&lsaquo;',8250:'&rsaquo;',8254:'&oline;',8260:'&frasl;',
    8364:'&euro;',8465:'&image;',8472:'&weierp;',8476:'&real;',8482:'&trade;',
    8501:'&alefsym;',
    8592:'&larr;',8593:'&uarr;',8594:'&rarr;',8595:'&darr;',8596:'&harr;',
    8629:'&crarr;',8656:'&lArr;',8657:'&uArr;',8658:'&rArr;',8659:'&dArr;',8660:'&hArr;',
    8704:'&forall;',8706:'&part;',8707:'&exist;',8709:'&empty;',8711:'&nabla;',
    8712:'&isin;',8713:'&notin;',8715:'&ni;',8719:'&prod;',8721:'&sum;',
    8722:'&minus;',8727:'&lowast;',8730:'&radic;',8733:'&prop;',8734:'&infin;',
    8736:'&ang;',8743:'&and;',8744:'&or;',8745:'&cap;',8746:'&cup;',8747:'&int;',
    8756:'&there4;',8764:'&sim;',8773:'&cong;',8776:'&asymp;',8800:'&ne;',
    8801:'&equiv;',8804:'&le;',8805:'&ge;',8834:'&sub;',8835:'&sup;',8836:'&nsub;',
    8838:'&sube;',8839:'&supe;',8853:'&oplus;',8855:'&otimes;',8869:'&perp;',8901:'&sdot;',
    8968:'&lceil;',8969:'&rceil;',8970:'&lfloor;',8971:'&rfloor;',
    9674:'&loz;',9824:'&spades;',9827:'&clubs;',9829:'&hearts;',9830:'&diams;'
};

var ASCII_RANGES = {
    all:         [0, 127],
    control:     [0, 31],
    printable:   [32, 126],
    digits:      [48, 57],
    symbols:     null, // custom filter
    latin1:      [128, 255],
    latinext:    [256, 591],
    greek:       [880, 1023],
    cyrillic:    [1024, 1279],
    punctuation: [8192, 8303],
    currency:    [8352, 8399],
    arrows:      [8592, 8703],
    math:        [8704, 8959],
    box:         [9472, 9599],
    shapes:      [9632, 9727],
    misc:        [9728, 9983],
    dingbats:    [9984, 10175]
};

function asciiGetCharData(code) {
    let char, desc, htmlEntity;
    if (code < 32) {
        char = ASCII_CONTROL_NAMES[code];
        desc = ASCII_CONTROL_DESC[code];
    } else if (code === 32) {
        char = '␣';
        desc = 'Space';
    } else if (code === 127) {
        char = 'DEL';
        desc = 'Delete';
    } else if (code > 127 && code < 160) {
        char = '·';
        desc = 'Control character';
    } else {
        char = String.fromCodePoint(code);
        desc = '';
    }
    htmlEntity = ASCII_HTML_ENTITIES[code] || '&#' + code + ';';
    return { code, char, desc, htmlEntity };
}

function asciiBuildRows(start, end) {
    const rows = [];
    for (let i = start; i <= end; i++) rows.push(asciiGetCharData(i));
    return rows;
}

function asciiGetToolId(element) {
    const tool = element.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function asciiInit() {
    document.querySelectorAll('.ascii-widget').forEach(widget => {
        widget._asciiRange = 'all';
        asciiRender(widget);
    });
}

function asciiGetRows(range) {
    if (range === 'symbols') {
        const rows = [];
        for (let i = 33; i <= 47; i++) rows.push(asciiGetCharData(i));
        for (let i = 58; i <= 64; i++) rows.push(asciiGetCharData(i));
        for (let i = 91; i <= 96; i++) rows.push(asciiGetCharData(i));
        for (let i = 123; i <= 126; i++) rows.push(asciiGetCharData(i));
        return rows;
    }
    const bounds = ASCII_RANGES[range] || ASCII_RANGES.all;
    return asciiBuildRows(bounds[0], bounds[1]);
}

function asciiSearchRows(rows, query) {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter(r => {
        return r.code.toString() === q ||
            r.code.toString(16) === q ||
            r.char.toLowerCase().includes(q) ||
            r.desc.toLowerCase().includes(q) ||
            r.htmlEntity.toLowerCase().includes(q) ||
            ('0x' + r.code.toString(16)) === q ||
            ('u+' + r.code.toString(16).padStart(4,'0')) === q;
    });
}

function asciiRender(widget) {
    const range = widget._asciiRange || 'all';
    const query = (widget.querySelector('.ascii-search') || {}).value || '';
    const allRows = asciiGetRows(range);
    const filtered = asciiSearchRows(allRows, query);
    const tbody = widget.querySelector('.ascii-table-body');
    const count = widget.querySelector('.ascii-count');
    const hexPad = range === 'all' || range === 'control' || range === 'printable' || range === 'digits' || range === 'symbols' || range === 'latin1' ? 2 : 4;

    let html = '';
    filtered.forEach(r => {
        const isControl = r.code < 32 || r.code === 127 || (r.code > 127 && r.code < 160);
        const isPrintable = !isControl && r.code >= 32;
        const entityEsc = r.htmlEntity.replace(/&/g, '&amp;');
        html += '<tr class="' + (isControl ? 'ascii-control' : '') + '" onclick="asciiCopyRow(this,' + r.code + ')" style="cursor:pointer;" title="Click to copy">' +
            '<td>' + r.code + '</td>' +
            '<td>0x' + r.code.toString(16).toUpperCase().padStart(hexPad, '0') + '</td>' +
            '<td>U+' + r.code.toString(16).toUpperCase().padStart(4, '0') + '</td>' +
            '<td class="ascii-char-cell">' + (isPrintable ? '&#' + r.code + ';' : r.char) + '</td>' +
            '<td class="ascii-html-cell">' + entityEsc + '</td>' +
            '<td class="ascii-desc-cell">' + r.desc + '</td>' +
            '</tr>';
    });
    if (tbody) tbody.innerHTML = html;
    if (count) count.textContent = filtered.length + ' characters';
}

function asciiFilter(input) {
    const widget = input.closest('.ascii-widget');
    asciiRender(widget);
}

function asciiSetRange(btn, range) {
    const widget = btn.closest('.ascii-widget');
    widget._asciiRange = range;
    widget.querySelectorAll('.ascii-range-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    asciiRender(widget);
}

function asciiCopyRow(tr, code) {
    const isPrintable = code >= 32 && !(code > 127 && code < 160) && code !== 127;
    const text = isPrintable ? String.fromCodePoint(code) : asciiGetCharData(code).htmlEntity;
    navigator.clipboard.writeText(text).then(() => {
        const widget = tr.closest('.ascii-widget');
        const toast = widget.querySelector('.ascii-copy-toast');
        toast.textContent = isPrintable ? 'Copied "' + String.fromCodePoint(code) + '"' : 'Copied ' + asciiGetCharData(code).htmlEntity;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1200);
    });
}

function asciiLookup(input) {
    const widget = input.closest('.ascii-widget');
    const result = widget.querySelector('.ascii-lookup-result');
    const val = input.value.trim();
    if (!val) { result.textContent = ''; return; }

    let code = -1;
    if (/^0x[0-9a-f]+$/i.test(val)) code = parseInt(val, 16);
    else if (/^u\+[0-9a-f]+$/i.test(val)) code = parseInt(val.slice(2), 16);
    else if (/^0[0-7]+$/.test(val)) code = parseInt(val, 8);
    else if (/^\d+$/.test(val)) code = parseInt(val, 10);
    else if ([...val].length === 1) code = val.codePointAt(0);

    if (code >= 0 && code <= 0x10FFFF) {
        const d = asciiGetCharData(code);
        const hex = code.toString(16).toUpperCase().padStart(4,'0');
        const isPrintable = code >= 32 && !(code > 127 && code < 160) && code !== 127;
        const display = isPrintable ? '"' + String.fromCodePoint(code) + '"' : d.char;
        result.textContent = display + ' \u2192 Dec:' + code + ' Hex:0x' + hex + ' U+' + hex + ' ' + d.htmlEntity;
    } else {
        result.textContent = 'Not found';
    }
}

// ==================== Hash Generator Functions ====================

// MD5 implementation (RFC 1321)
function hashMD5(input) {
    // Convert to UTF-8 byte string
    var str = unescape(encodeURIComponent(input));
    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936);  d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);   b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);   d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);  b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);   d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);      b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);  d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510);   d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);  b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);   d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);  b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);    d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);   b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);   b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558);      d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);  b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);  d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);   b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);   d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);   b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);   d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);   b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844);   d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);  d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);    b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);   d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);  b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);   d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);    b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
    function add32(a, b) { return (a + b) & 0xFFFFFFFF; }

    var n = str.length;
    var state = [1732584193, -271733879, -1732584194, 271733878];
    var tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var i, lo;
    for (i = 64; i <= n; i += 64) {
        var block = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        for (var j = 0; j < 64; j += 4) {
            block[j >> 2] = str.charCodeAt(i - 64 + j) | (str.charCodeAt(i - 64 + j + 1) << 8) |
                (str.charCodeAt(i - 64 + j + 2) << 16) | (str.charCodeAt(i - 64 + j + 3) << 24);
        }
        md5cycle(state, block);
    }
    lo = i - 64;
    for (i = 0; i < 16; i++) tail[i] = 0;
    for (i = 0; i < n - lo; i++) tail[i >> 2] |= str.charCodeAt(lo + i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) { md5cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0; }
    tail[14] = n * 8;
    md5cycle(state, tail);

    var hex = '';
    for (i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            hex += ('0' + ((state[i] >> (j * 8)) & 0xFF).toString(16)).slice(-2);
        }
    }
    return hex;
}

function hashGetToolId(element) {
    const tool = element.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function hashGetData(toolId) {
    const customizations = loadToolCustomizations();
    const custom = customizations[toolId] || {};
    return custom.hashData || { input: '', hashCase: 'lower' };
}

function hashSaveData(toolId, data) {
    const customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].hashData = data;
    saveToolCustomizations(customizations);
}

function hashInit() {
    document.querySelectorAll('.hash-widget').forEach(widget => {
        const toolId = hashGetToolId(widget);
        if (!toolId) return;
        const data = hashGetData(toolId);
        const input = widget.querySelector('.hash-input');
        if (input && data.input) {
            input.value = data.input;
            hashCompute(widget, toolId);
        }
        widget.querySelectorAll('.hash-case-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === (data.hashCase === 'upper' ? 'UPPER' : 'lower'));
        });
    });
}

function hashOnInput(textarea) {
    const widget = textarea.closest('.hash-widget');
    const toolId = hashGetToolId(widget);
    if (!toolId) return;
    const data = hashGetData(toolId);
    data.input = textarea.value;
    hashSaveData(toolId, data);
    hashCompute(widget, toolId);
}

async function hashCompute(widget, toolId) {
    const data = hashGetData(toolId);
    const input = data.input || '';
    const upper = data.hashCase === 'upper';
    const byteCount = widget.querySelector('.hash-byte-count');
    if (byteCount) {
        const bytes = new TextEncoder().encode(input).length;
        byteCount.textContent = bytes > 0 ? bytes + ' bytes' : '';
    }

    const rows = widget.querySelectorAll('.hash-result-row');
    if (!input) {
        rows.forEach(row => { row.querySelector('.hash-result-value').textContent = ''; });
        return;
    }

    const encoder = new TextEncoder();
    const encoded = encoder.encode(input);

    // MD5 (pure JS, no Web Crypto support)
    const md5Hex = hashMD5(input);
    const md5Row = widget.querySelector('[data-algo="MD5"] .hash-result-value');
    if (md5Row) md5Row.textContent = upper ? md5Hex.toUpperCase() : md5Hex;

    // SHA-1 and SHA-256 via Web Crypto API
    try {
        const sha1Buf = await crypto.subtle.digest('SHA-1', encoded);
        const sha1Hex = Array.from(new Uint8Array(sha1Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        const sha1Row = widget.querySelector('[data-algo="SHA-1"] .hash-result-value');
        if (sha1Row) sha1Row.textContent = upper ? sha1Hex.toUpperCase() : sha1Hex;

        const sha256Buf = await crypto.subtle.digest('SHA-256', encoded);
        const sha256Hex = Array.from(new Uint8Array(sha256Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        const sha256Row = widget.querySelector('[data-algo="SHA-256"] .hash-result-value');
        if (sha256Row) sha256Row.textContent = upper ? sha256Hex.toUpperCase() : sha256Hex;
    } catch (e) {
        console.warn('Hash computation failed:', e);
    }
}

function hashSetCase(btn, hashCase) {
    const widget = btn.closest('.hash-widget');
    const toolId = hashGetToolId(widget);
    if (!toolId) return;
    const data = hashGetData(toolId);
    data.hashCase = hashCase;
    hashSaveData(toolId, data);
    widget.querySelectorAll('.hash-case-btn').forEach(b => {
        b.classList.toggle('active', b.textContent === (hashCase === 'upper' ? 'UPPER' : 'lower'));
    });
    hashCompute(widget, toolId);
}

function hashCopyResult(btn) {
    const value = btn.previousElementSibling.textContent;
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 1200);
    });
}

function hashClearAll(btn) {
    const widget = btn.closest('.hash-widget');
    const toolId = hashGetToolId(widget);
    if (!toolId) return;
    hashSaveData(toolId, { input: '', hashCase: hashGetData(toolId).hashCase });
    widget.querySelector('.hash-input').value = '';
    widget.querySelector('.hash-byte-count').textContent = '';
    widget.querySelectorAll('.hash-result-value').forEach(el => { el.textContent = ''; });
}

// ==================== Password Generator Functions ====================
const PWGEN_CHARSETS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    digits: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'
};

function pwgenGetToolId(element) {
    const tool = element.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function pwgenGetData(toolId) {
    const customizations = loadToolCustomizations();
    const custom = customizations[toolId] || {};
    return custom.pwgenData || { length: 20, upper: true, lower: true, digits: true, symbols: true, exclude: '', history: [] };
}

function pwgenSaveData(toolId, data) {
    const customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].pwgenData = data;
    saveToolCustomizations(customizations);
}

function pwgenInit() {
    document.querySelectorAll('.pwgen-widget').forEach(widget => {
        const toolId = pwgenGetToolId(widget);
        if (!toolId) return;
        const data = pwgenGetData(toolId);
        widget.querySelector('input[type="range"]').value = data.length;
        widget.querySelector('input[type="number"]').value = data.length;
        widget.querySelectorAll('.pwgen-charset-toggle').forEach(label => {
            const key = label.dataset.charset;
            const checked = data[key] !== false;
            label.classList.toggle('active', checked);
            label.querySelector('input').checked = checked;
        });
        const excludeInput = widget.querySelector('.pwgen-exclude');
        if (excludeInput && data.exclude) excludeInput.value = data.exclude;
        pwgenRenderHistory(widget, data);
        pwgenGenerate(widget.querySelector('.pwgen-btn-primary'));
    });
}

function pwgenBuildCharpool(data) {
    let pool = '';
    if (data.upper) pool += PWGEN_CHARSETS.upper;
    if (data.lower) pool += PWGEN_CHARSETS.lower;
    if (data.digits) pool += PWGEN_CHARSETS.digits;
    if (data.symbols) pool += PWGEN_CHARSETS.symbols;
    if (data.exclude) {
        const excludeSet = new Set(data.exclude);
        pool = pool.split('').filter(c => !excludeSet.has(c)).join('');
    }
    return pool;
}

function pwgenGenerate(btn) {
    const widget = btn.closest('.pwgen-widget');
    const toolId = pwgenGetToolId(widget);
    if (!toolId) return;
    const data = pwgenGetData(toolId);
    const pool = pwgenBuildCharpool(data);
    if (pool.length === 0) {
        widget.querySelector('.pwgen-output-field').textContent = 'No characters available';
        pwgenUpdateStrength(widget, '', 0);
        return;
    }
    const len = Math.max(4, Math.min(128, data.length || 20));
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    let password = '';
    for (let i = 0; i < len; i++) {
        password += pool[arr[i] % pool.length];
    }
    widget.querySelector('.pwgen-output-field').textContent = password;
    pwgenUpdateStrength(widget, password, pool.length);

    // Add to history (max 20)
    data.history = data.history || [];
    data.history.unshift(password);
    if (data.history.length > 20) data.history.pop();
    pwgenSaveData(toolId, data);
    pwgenRenderHistory(widget, data);
}

function pwgenUpdateStrength(widget, password, poolSize) {
    const fill = widget.querySelector('.pwgen-strength-fill');
    const label = widget.querySelector('.pwgen-strength-label');
    const entropyEl = widget.querySelector('.pwgen-entropy');
    if (!password) {
        fill.style.width = '0';
        label.textContent = '';
        entropyEl.textContent = '';
        return;
    }
    const entropy = password.length * Math.log2(poolSize || 1);
    let strength, color, pct;
    if (entropy < 28) { strength = 'Very Weak'; color = '#e74c3c'; pct = 10; }
    else if (entropy < 36) { strength = 'Weak'; color = '#e67e22'; pct = 25; }
    else if (entropy < 60) { strength = 'Fair'; color = '#f1c40f'; pct = 50; }
    else if (entropy < 80) { strength = 'Strong'; color = '#2ecc71'; pct = 75; }
    else { strength = 'Very Strong'; color = '#27ae60'; pct = 100; }
    fill.style.width = pct + '%';
    fill.style.background = color;
    label.textContent = strength;
    label.style.color = color;
    entropyEl.textContent = Math.round(entropy) + ' bits';
}

function pwgenLengthChange(slider) {
    const widget = slider.closest('.pwgen-widget');
    const toolId = pwgenGetToolId(widget);
    if (!toolId) return;
    widget.querySelector('input[type="number"]').value = slider.value;
    const data = pwgenGetData(toolId);
    data.length = parseInt(slider.value);
    pwgenSaveData(toolId, data);
    pwgenGenerate(widget.querySelector('.pwgen-btn-primary'));
}

function pwgenLengthInput(input) {
    const widget = input.closest('.pwgen-widget');
    const toolId = pwgenGetToolId(widget);
    if (!toolId) return;
    const val = Math.max(4, Math.min(128, parseInt(input.value) || 4));
    widget.querySelector('input[type="range"]').value = val;
    const data = pwgenGetData(toolId);
    data.length = val;
    pwgenSaveData(toolId, data);
    pwgenGenerate(widget.querySelector('.pwgen-btn-primary'));
}

function pwgenToggleCharset(checkbox) {
    const label = checkbox.closest('.pwgen-charset-toggle');
    const widget = checkbox.closest('.pwgen-widget');
    const toolId = pwgenGetToolId(widget);
    if (!toolId) return;
    const data = pwgenGetData(toolId);
    const key = label.dataset.charset;
    data[key] = checkbox.checked;
    label.classList.toggle('active', checkbox.checked);
    // Prevent disabling all charsets
    const anyEnabled = data.upper || data.lower || data.digits || data.symbols;
    if (!anyEnabled) {
        data[key] = true;
        checkbox.checked = true;
        label.classList.add('active');
    }
    pwgenSaveData(toolId, data);
    pwgenGenerate(widget.querySelector('.pwgen-btn-primary'));
}

function pwgenExcludeChange(input) {
    const widget = input.closest('.pwgen-widget');
    const toolId = pwgenGetToolId(widget);
    if (!toolId) return;
    const data = pwgenGetData(toolId);
    data.exclude = input.value;
    pwgenSaveData(toolId, data);
    pwgenGenerate(widget.querySelector('.pwgen-btn-primary'));
}

function pwgenCopy(btn) {
    const widget = btn.closest('.pwgen-widget');
    const value = widget.querySelector('.pwgen-output-field').textContent;
    if (!value || value === 'No characters available') return;
    navigator.clipboard.writeText(value).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 1200);
    });
}

function pwgenRenderHistory(widget, data) {
    const list = widget.querySelector('.pwgen-history-list');
    if (!list) return;
    const history = data.history || [];
    list.innerHTML = history.map(pw =>
        `<div class="pwgen-history-item"><span>${pw.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span><button class="pwgen-history-copy" onclick="pwgenCopyHistoryItem(this)">Copy</button></div>`
    ).join('');
}

function pwgenCopyHistoryItem(btn) {
    const text = btn.previousElementSibling.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 1200);
    });
}

// Inject JavaScript functions into DOM for HTML export
// The injected script only defines things if they don't already exist (for exported HTML)
(function injectScriptsForExport() {
    if (document.getElementById('developer-tools-scripts')) return;

    // List all functions to export
    const functionsToExport = [
        diffGetToolId, diffGetData, diffSaveData, diffInit, diffOnInput, diffSetMode, diffSetView,
        diffToggleWhitespace, diffSyncScroll, computeDiff, buildLCSMatrix, backtrackDiff,
        diffRenderOutput, renderSplitView, renderUnifiedView, renderDiffLine, renderUnifiedLine, diffUpdateStats,
        seqGetToolId, seqGetData, seqSaveData, seqInit, seqUpdateContainers, seqOnInput, seqSetMode,
        seqShowHelp, seqParseColors, seqParseText, seqRenderDiagram,
        jwtGetToolId, jwtInit, jwtDecode, jwtBase64Decode, jwtSyntaxHighlight, jwtRenderClaims,
        jwtCopyPart, jwtLoadSample, jwtClear,
        epochInit, epochUpdateNow, epochUpdateReference, epochCopyNow, epochUseNow,
        epochFromTimestamp, epochFromDatetime, epochRelativeTime, epochCopyValue,
        fmtGetToolId, fmtGetData, fmtSaveData, fmtInit, fmtSetupResizer, fmtSetFormat, fmtGetFormat,
        fmtOnInput, fmtPrettify, fmtMinify, fmtCopy, fmtSwap, fmtUpdateStatus,
        fmtPrettifyJSON, fmtMinifyJSON, fmtPrettifyXML, fmtMinifyXML, fmtPrettifyCSV,
        fmtParseCSVLine, fmtMinifyCSV, fmtPrettifySQL, fmtMinifySQL,
        cronGetToolId, cronGetData, cronSaveData, cronInit, cronSetPreset, cronParse,
        cronParseExpression, cronParseField, cronDescribeField, cronBuildExplanation,
        cronGetNextRuns, cronFormatDate, cronRelativeTime,
        regexGetToolId, regexGetData, regexSaveData, regexInit, regexSetupResizer, regexOnInput,
        regexGetFlags, regexExecute, regexEscapeHtml, regexCopy, regexClear,
        b64GetToolId, b64GetData, b64SaveData, b64Init, b64SetMode, b64UpdateLabels,
        b64OnInput, b64Process, b64Swap, b64Copy, b64Clear,
        loremGetToolId, loremPickWord, loremSentence, loremParagraph,
        loremInit, loremGenerate, loremCopy, loremClear,
        asciiGetCharData, asciiBuildRows, asciiGetToolId, asciiInit,
        asciiGetRows, asciiSearchRows, asciiRender, asciiFilter, asciiSetRange, asciiCopyRow, asciiLookup,
        hashMD5, hashGetToolId, hashGetData, hashSaveData, hashInit, hashOnInput, hashCompute,
        hashSetCase, hashCopyResult, hashClearAll,
        pwgenGetToolId, pwgenGetData, pwgenSaveData, pwgenInit, pwgenBuildCharpool,
        pwgenGenerate, pwgenUpdateStrength, pwgenLengthChange, pwgenLengthInput,
        pwgenToggleCharset, pwgenExcludeChange, pwgenCopy, pwgenRenderHistory, pwgenCopyHistoryItem
    ];

    // Wrap in IIFE that checks if already defined (plugin loaded) vs needs defining (exported HTML)
    const code = '(function() {\n' +
        'if (typeof diffGetToolId !== "undefined") return;\n' +
        'var epochIntervalId = null;\n' +
        'window.LOREM_WORDS = ' + JSON.stringify(LOREM_WORDS) + ';\n' +
        'window.LOREM_FIRST_SENTENCE = ' + JSON.stringify(LOREM_FIRST_SENTENCE) + ';\n' +
        'window.ASCII_CONTROL_NAMES = ' + JSON.stringify(ASCII_CONTROL_NAMES) + ';\n' +
        'window.ASCII_CONTROL_DESC = ' + JSON.stringify(ASCII_CONTROL_DESC) + ';\n' +
        'window.ASCII_HTML_ENTITIES = ' + JSON.stringify(ASCII_HTML_ENTITIES) + ';\n' +
        'window.ASCII_RANGES = ' + JSON.stringify(ASCII_RANGES) + ';\n' +
        'window.PWGEN_CHARSETS = ' + JSON.stringify(PWGEN_CHARSETS) + ';\n' +
        functionsToExport.map(fn => 'window.' + fn.name + ' = ' + fn.toString()).join(';\n') + ';\n' +
        '})();';
    const encoded = btoa(unescape(encodeURIComponent(code)));

    const script = document.createElement('script');
    script.id = 'developer-tools-scripts';
    // Use atob to decode at runtime, avoiding HTML special character issues
    script.textContent = 'eval(decodeURIComponent(escape(atob("' + encoded + '"))))';
    // Append to body if it exists (for proper execution order in exported HTML), otherwise head
    (document.body || document.head).appendChild(script);
})();

console.log('Developer Tools plugin loaded');
