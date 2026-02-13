// Productivity Tools Toolbox Plugin
// Contains the Pomodoro Timer, Unit Converter, and other productivity tools

// Inject CSS styles for productivity tools
(function() {
    if (document.getElementById('productivity-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'productivity-tools-styles';
    style.textContent = `
/* Pomodoro Timer Widget Styles */
.pomo-widget { background: var(--bg-tertiary); padding: 15px; border-radius: 6px; text-align: center; }
.pomo-ring-container { position: relative; width: 180px; height: 180px; margin: 0 auto 12px; }
.pomo-ring-svg { transform: rotate(-90deg); width: 180px; height: 180px; }
.pomo-ring-bg { fill: none; stroke: var(--border-color); stroke-width: 8; }
.pomo-ring-fg { fill: none; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 0.5s linear, stroke 0.3s; }
.pomo-ring-fg.work { stroke: #e74c3c; }
.pomo-ring-fg.short-break { stroke: #27ae60; }
.pomo-ring-fg.long-break { stroke: #2980b9; }
.pomo-time-display { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
.pomo-time { font-size: 36px; font-weight: 700; font-family: monospace; color: var(--text-primary); line-height: 1; }
.pomo-mode-label { font-size: 11px; color: var(--text-muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 1px; }
.pomo-controls { display: flex; justify-content: center; gap: 8px; margin-bottom: 12px; }
.pomo-btn { padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; font-size: 13px; transition: background 0.15s, border-color 0.15s; }
.pomo-btn:hover { background: var(--bg-primary); border-color: var(--text-muted); }
.pomo-btn.primary { background: #e74c3c; color: white; border-color: #e74c3c; }
.pomo-btn.primary:hover { background: #c0392b; border-color: #c0392b; }
.pomo-btn.primary.paused { background: #27ae60; border-color: #27ae60; }
.pomo-btn.primary.paused:hover { background: #219a52; border-color: #219a52; }
.pomo-count { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; }
.pomo-count-icons { font-size: 16px; letter-spacing: 2px; }
.pomo-settings-toggle { font-size: 11px; color: var(--text-muted); cursor: pointer; margin-bottom: 6px; user-select: none; }
.pomo-settings-toggle:hover { color: var(--text-secondary); }
.pomo-settings { display: none; background: var(--bg-secondary); border-radius: 4px; padding: 10px; margin-top: 6px; }
.pomo-settings.open { display: block; }
.pomo-settings label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 3px; text-align: left; }
.pomo-settings input { width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 13px; background: var(--input-bg); color: var(--text-primary); margin-bottom: 8px; box-sizing: border-box; }
.pomo-settings-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }

/* Unit Converter Widget Styles */
.tool-content:has(.uc-widget) { display: flex; flex-direction: column; padding: 0; }
.uc-widget { padding: 12px; font-size: 12px; display: flex; flex-direction: column; gap: 10px; width: 100%; box-sizing: border-box; flex: 1; min-height: 0; }
.uc-category-bar { display: flex; flex-wrap: wrap; gap: 4px; }
.uc-cat-btn { padding: 5px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.uc-cat-btn.active { background: #3498db; color: white; border-color: #3498db; }
.uc-cat-btn:hover:not(.active) { background: var(--table-hover); }
.uc-converter { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.uc-row { display: flex; gap: 8px; align-items: center; }
.uc-input-group { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.uc-input-group label { font-size: 11px; color: var(--text-secondary); font-weight: 500; }
.uc-input-group input { width: 100%; padding: 8px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 14px; background: var(--input-bg); color: var(--text-primary); box-sizing: border-box; }
.uc-input-group input:focus { outline: none; border-color: #3498db; }
.uc-input-group select { width: 100%; padding: 8px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); cursor: pointer; box-sizing: border-box; }
.uc-swap-btn { padding: 6px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 14px; border-radius: 4px; flex-shrink: 0; align-self: flex-end; margin-bottom: 1px; }
.uc-swap-btn:hover { background: var(--table-hover); }
.uc-formula { font-size: 11px; color: var(--text-muted); padding: 8px 10px; background: var(--bg-tertiary); border-radius: 4px; border: 1px solid var(--border-color); font-family: monospace; min-height: 16px; }
.uc-common { display: flex; flex-direction: column; gap: 2px; flex: 1; overflow-y: auto; min-height: 0; }
.uc-common-title { font-size: 11px; color: var(--text-secondary); font-weight: 500; margin-bottom: 2px; }
.uc-common-row { display: flex; justify-content: space-between; font-size: 11px; padding: 3px 8px; border-radius: 3px; }
.uc-common-row:nth-child(even) { background: var(--bg-tertiary); }
.uc-common-row .uc-common-unit { color: var(--text-secondary); }
.uc-common-row .uc-common-val { color: var(--text-primary); font-family: monospace; font-weight: 500; }

/* Playback Speed Calculator Widget Styles */
.tool-content:has(.pbs-widget) { display: flex; flex-direction: column; }
.pbs-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 10px; }
.pbs-input-row { display: flex; gap: 8px; align-items: flex-end; flex-shrink: 0; flex-wrap: wrap; }
.pbs-field { display: flex; flex-direction: column; gap: 3px; }
.pbs-field label { font-weight: 600; font-size: 11px; color: var(--text-heading); }
.pbs-field input { width: 60px; padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 13px; font-family: monospace; background: var(--input-bg); color: var(--text-primary); text-align: center; }
.pbs-field input:focus { outline: none; border-color: #3498db; }
.pbs-colon { font-size: 18px; font-weight: 700; color: var(--text-muted); padding-bottom: 6px; }
.pbs-total { font-size: 11px; color: var(--text-muted); flex-shrink: 0; }
.pbs-speed-section { flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; }
.pbs-speed-label { font-weight: 600; font-size: 11px; color: var(--text-heading); }
.pbs-presets { display: flex; gap: 4px; flex-wrap: wrap; }
.pbs-preset { padding: 5px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; font-family: monospace; }
.pbs-preset:hover { background: var(--table-hover); border-color: #3498db; }
.pbs-preset.active { background: #3498db; color: white; border-color: #3498db; }
.pbs-custom-row { display: flex; align-items: center; gap: 6px; }
.pbs-custom-row label { font-size: 11px; color: var(--text-secondary); }
.pbs-custom-row input[type="range"] { flex: 1; min-width: 80px; }
.pbs-custom-row .pbs-speed-val { font-family: monospace; font-size: 12px; font-weight: 600; min-width: 40px; color: var(--text-primary); }
.pbs-results { flex: 1; display: flex; flex-direction: column; gap: 6px; min-height: 0; }
.pbs-result-card { padding: 10px 12px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
.pbs-result-label { font-size: 11px; color: var(--text-secondary); }
.pbs-result-value { font-family: monospace; font-size: 16px; font-weight: 700; color: var(--text-primary); }
.pbs-result-value.saved { color: #27ae60; }
.pbs-result-value.longer { color: #e74c3c; }
.pbs-table-wrap { flex: 1; overflow: auto; min-height: 0; border: 1px solid var(--border-color); border-radius: 4px; }
.pbs-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.pbs-table th { position: sticky; top: 0; background: var(--bg-tool-header); color: white; padding: 6px 10px; text-align: left; font-weight: 600; font-size: 10px; text-transform: uppercase; }
.pbs-table td { padding: 5px 10px; border-bottom: 1px solid var(--border-light); }
.pbs-table tr:hover td { background: var(--table-hover); }
.pbs-table .mono { font-family: monospace; }
.pbs-table .saved-cell { color: #27ae60; font-weight: 600; }
.pbs-table .longer-cell { color: #e74c3c; font-weight: 600; }
/* Calendar Widget Styles */
.tool-content:has(.calendar-widget) {
    display: flex;
    flex-direction: column;
}

.calendar-widget {
    padding: 10px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    min-height: 0;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    gap: 10px;
    flex-shrink: 0;
}

.calendar-year-nav {
    display: flex;
    align-items: center;
    gap: 8px;
}

.calendar-year-nav button {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    color: var(--text-primary);
    font-size: 14px;
}

.calendar-year-nav button:hover {
    background: var(--table-hover);
}

.calendar-year-nav span {
    font-weight: 600;
    font-size: 16px;
    min-width: 50px;
    text-align: center;
}

.calendar-manage-btn {
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 11px;
}

.calendar-manage-btn:hover {
    background: #2980b9;
}

.calendar-year-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 12px;
    flex: 1;
    min-height: 0;
}

.calendar-month {
    background: var(--bg-tertiary);
    border-radius: 6px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.calendar-month-name {
    font-weight: 600;
    text-align: center;
    margin-bottom: 6px;
    font-size: 11px;
    color: var(--text-heading);
    flex-shrink: 0;
    border-radius: 3px;
    padding: 2px 4px;
    transition: background 0.15s;
}

.calendar-month-name:hover {
    background: var(--table-hover);
    color: #3498db;
}

.calendar-month-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: auto repeat(6, 1fr);
    gap: 1px;
    flex: 1;
    min-height: 0;
}

.calendar-dow {
    text-align: center;
    font-size: 8px;
    color: var(--text-muted);
    padding: 2px 0;
}

.calendar-day {
    text-align: center;
    padding: 2px;
    font-size: 9px;
    position: relative;
    min-height: 16px;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.calendar-day:hover {
    background: var(--table-hover);
}

.calendar-day.other-month {
    cursor: default;
}

.calendar-day.today {
    background: #3498db;
    color: white;
    border-radius: 50%;
    font-weight: 600;
}

.calendar-day.other-month {
    color: var(--text-muted);
    opacity: 0.4;
}

.calendar-event-dots {
    display: flex;
    justify-content: center;
    gap: 1px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}

.calendar-event-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
}

.calendar-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 10px;
    border-top: 1px solid var(--border-light);
    font-size: 11px;
    flex-shrink: 0;
}

.calendar-legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.calendar-legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.calendar-legend-count {
    color: var(--text-muted);
    margin-left: 2px;
}

/* Calendar View Toggle */
.calendar-view-toggle {
    display: flex;
    gap: 4px;
}

.calendar-view-btn {
    padding: 4px 10px;
    border: 1px solid var(--border-color);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    cursor: pointer;
    font-size: 11px;
    border-radius: 4px;
}

.calendar-view-btn:first-child {
    border-radius: 4px 0 0 4px;
}

.calendar-view-btn:last-child {
    border-radius: 0 4px 4px 0;
}

.calendar-view-btn.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
}

/* Month View */
.calendar-month-view {
    display: none;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.calendar-month-view.active {
    display: flex;
}

.calendar-year-grid.hidden {
    display: none;
}

.calendar-month-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 12px;
}

.calendar-month-nav button {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
    color: var(--text-primary);
    font-size: 14px;
}

.calendar-month-nav button:hover {
    background: var(--table-hover);
}

.calendar-month-nav .calendar-month-title {
    font-weight: 600;
    font-size: 16px;
    min-width: 150px;
    text-align: center;
}

.calendar-month-nav .calendar-today-btn {
    background: #27ae60;
    color: white;
    border: none;
    font-size: 10px;
    padding: 4px 8px;
}

.calendar-month-detail {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: auto repeat(6, 1fr);
    gap: 4px;
    min-height: 0;
}

.calendar-month-detail .calendar-dow {
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    padding: 8px 4px;
}

.calendar-month-detail .calendar-day-cell {
    background: var(--bg-tertiary);
    border-radius: 4px;
    padding: 4px;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    cursor: pointer;
}

.calendar-month-detail .calendar-day-cell:hover {
    background: var(--table-hover);
}

.calendar-month-detail .calendar-day-cell.other-month {
    opacity: 0.4;
    background: transparent;
}

.calendar-month-detail .calendar-day-cell.today {
    box-shadow: inset 0 0 0 2px #3498db;
}

.calendar-day-number {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--text-primary);
}

.calendar-day-cell.today .calendar-day-number {
    background: #3498db;
    color: white;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.calendar-day-events {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.calendar-day-event {
    font-size: 9px;
    padding: 2px 4px;
    border-radius: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
}

.calendar-day-more {
    font-size: 9px;
    color: var(--text-muted);
    text-align: center;
}

/* Calendar Management Modal */
.calendar-manage-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--overlay-bg);
    z-index: 10020;
    justify-content: center;
    align-items: center;
}

.calendar-manage-modal.open {
    display: flex;
}

.calendar-manage-content {
    background: var(--bg-secondary);
    border-radius: 8px;
    padding: 20px;
    width: 90%;
    max-width: 450px;
    max-height: 80vh;
    overflow-y: auto;
}

.calendar-manage-content h3 {
    margin-bottom: 15px;
    color: var(--text-heading);
}

.calendar-manage-close {
    float: right;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-muted);
    line-height: 1;
}

.calendar-manage-close:hover {
    color: var(--text-heading);
}

.calendar-list {
    margin-bottom: 15px;
}

.calendar-list-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    margin-bottom: 8px;
}

.calendar-list-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    flex-shrink: 0;
}

.calendar-list-name {
    flex: 1;
    font-weight: 500;
}

.calendar-list-count {
    color: var(--text-muted);
    font-size: 11px;
}

.calendar-list-remove {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    font-size: 16px;
    padding: 2px 6px;
}

.calendar-list-remove:hover {
    background: rgba(231, 76, 60, 0.1);
    border-radius: 4px;
}

.calendar-add-form {
    border-top: 1px solid var(--border-light);
    padding-top: 15px;
}

.calendar-add-form h4 {
    margin-bottom: 10px;
    font-size: 13px;
    color: var(--text-heading);
}

.calendar-add-row {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}

.calendar-add-name {
    flex: 1;
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 13px;
    background: var(--input-bg);
    color: var(--text-primary);
}

.calendar-color-picker {
    display: flex;
    gap: 4px;
    margin-bottom: 10px;
}

.calendar-color-option {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
}

.calendar-color-option:hover {
    transform: scale(1.1);
}

.calendar-color-option.selected {
    border-color: var(--text-heading);
}

.calendar-add-btn {
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 12px;
}

.calendar-add-btn:hover {
    background: #229954;
}

.calendar-import-section {
    border-top: 1px solid var(--border-light);
    padding-top: 15px;
    margin-top: 15px;
}

.calendar-import-section h4 {
    margin-bottom: 10px;
    font-size: 13px;
    color: var(--text-heading);
}

.calendar-import-row {
    display: flex;
    gap: 8px;
    align-items: center;
}

.calendar-import-file {
    flex: 1;
}

.calendar-import-select {
    padding: 6px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 12px;
    background: var(--input-bg);
    color: var(--text-primary);
}

/* Calendar Day Tooltip */
.calendar-day-tooltip {
    position: absolute;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 8px;
    min-width: 150px;
    max-width: 250px;
    z-index: 10030;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 11px;
}

.calendar-day-tooltip-date {
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--text-heading);
}

.calendar-day-tooltip-event {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 0;
}

.calendar-day-tooltip-text {
    flex: 1;
}

.calendar-event-delete {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 14px;
    padding: 0 4px;
    line-height: 1;
    opacity: 0.5;
}

.calendar-event-delete:hover {
    color: #e74c3c;
    opacity: 1;
}

.calendar-day-tooltip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.calendar-day-add-form {
    display: flex;
    gap: 4px;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--border-light);
}

.calendar-day-add-input {
    flex: 1;
    min-width: 0;
    padding: 4px 6px;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-size: 11px;
    background: var(--input-bg);
    color: var(--text-primary);
}

.calendar-day-add-select {
    padding: 4px;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-size: 10px;
    background: var(--input-bg);
    color: var(--text-primary);
    max-width: 80px;
}

.calendar-day-add-btn {
    padding: 4px 8px;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
}

.calendar-day-add-btn:hover {
    background: #229954;
}
/* Random Picker */
.picker-widget {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 10px;
}

.picker-input-row {
    display: flex;
    gap: 8px;
}

.picker-input-row input {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 13px;
    background: var(--input-bg);
    color: var(--text-primary);
}

.picker-input-row button {
    padding: 8px 14px;
    background: #9b59b6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
}

.picker-input-row button:hover {
    background: #8e44ad;
}

.picker-items {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 20px;
}

.picker-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: var(--bg-tertiary, rgba(0,0,0,0.08));
    border-radius: 12px;
    font-size: 12px;
    color: var(--text-primary);
}

.picker-chip .picker-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.picker-chip .picker-remove {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 14px;
    padding: 0 2px;
    line-height: 1;
}

.picker-chip .picker-remove:hover {
    color: #e74c3c;
}

.picker-wheel-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    margin: 10px 0;
}

.picker-wheel-container {
    position: relative;
    width: 260px;
    height: 260px;
}

.picker-wheel-svg {
    width: 260px;
    height: 260px;
    transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
}

.picker-wheel-svg.spinning {
    transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
}

.picker-pointer {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 20px solid #e74c3c;
    z-index: 2;
    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
}

.picker-result {
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    min-height: 28px;
    color: var(--text-primary);
    margin-top: 8px;
}

.picker-result.highlight {
    animation: pickerPulse 0.6s ease-out;
}

@keyframes pickerPulse {
    0% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
}

.picker-spin-btn {
    padding: 10px 32px;
    font-size: 15px;
    font-weight: 600;
    background: #9b59b6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    align-self: center;
    transition: background 0.15s;
}

.picker-spin-btn:hover {
    background: #8e44ad;
}

.picker-spin-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.picker-empty-msg {
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
    padding: 30px 0;
}
/* Dice Roller Widget */
.dice-widget {
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    user-select: none;
}

.dice-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.dice-count-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
}

.dice-count-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.dice-count-btn {
    width: 28px;
    height: 28px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    line-height: 1;
}

.dice-count-btn:hover {
    background: var(--bg-secondary);
}

.dice-count-value {
    font-size: 18px;
    font-weight: 700;
    min-width: 24px;
    text-align: center;
    color: var(--text-primary);
}

.dice-tray {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    min-height: 64px;
    padding: 8px;
}

.dice-die {
    width: 56px;
    height: 56px;
    border-radius: 10px;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.12);
    transition: transform 0.2s, border-color 0.2s;
    position: relative;
}

.dice-die.rolling {
    animation: dice-spin 0.4s ease-out;
}

@keyframes dice-spin {
    0%   { transform: rotateZ(0deg) scale(0.7); opacity: 0.5; }
    40%  { transform: rotateZ(180deg) scale(1.1); opacity: 0.8; }
    70%  { transform: rotateZ(300deg) scale(1.05); }
    100% { transform: rotateZ(360deg) scale(1); opacity: 1; }
}

/* Pip-based die faces */
.dice-die .pip {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--text-primary);
    position: absolute;
}

/* Pip positions on a 3x3 grid inside the die */
.dice-die .pip-tl { top: 10px; left: 10px; }
.dice-die .pip-tc { top: 10px; left: 50%; transform: translateX(-50%); }
.dice-die .pip-tr { top: 10px; right: 10px; }
.dice-die .pip-ml { top: 50%; left: 10px; transform: translateY(-50%); }
.dice-die .pip-mc { top: 50%; left: 50%; transform: translate(-50%, -50%); }
.dice-die .pip-mr { top: 50%; right: 10px; transform: translateY(-50%); }
.dice-die .pip-bl { bottom: 10px; left: 10px; }
.dice-die .pip-bc { bottom: 10px; left: 50%; transform: translateX(-50%); }
.dice-die .pip-br { bottom: 10px; right: 10px; }

.dice-total-row {
    min-height: 24px;
}

.dice-total {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
}

.dice-roll-btn {
    padding: 10px 36px;
    border: none;
    border-radius: 6px;
    background: #27ae60;
    color: white;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    letter-spacing: 0.5px;
}

.dice-roll-btn:hover {
    background: #219a52;
}

.dice-roll-btn:active {
    transform: scale(0.96);
}

.dice-history {
    width: 100%;
    max-height: 100px;
    overflow-y: auto;
    font-size: 12px;
    color: var(--text-muted);
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.dice-history-entry {
    padding: 3px 0;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
}

.dice-history-entry .dice-hist-values {
    opacity: 0.7;
}

.dice-history-entry .dice-hist-total {
    font-weight: 600;
    color: var(--text-secondary);
}

/* Stopwatch Widget */
.stopwatch-widget {
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.sw-display {
    font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 2px;
    color: var(--text-primary);
    text-align: center;
    padding: 10px 0;
}

.sw-display .sw-ms {
    font-size: 20px;
    opacity: 0.6;
}

.sw-buttons {
    display: flex;
    gap: 8px;
}

.sw-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 5px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    min-width: 70px;
}

.sw-btn:disabled {
    opacity: 0.4;
    cursor: default;
}

.sw-start {
    background: #27ae60;
    color: white;
}

.sw-start.running {
    background: #e74c3c;
}

.sw-lap {
    background: #3498db;
    color: white;
}

.sw-reset {
    background: #95a5a6;
    color: white;
}

.sw-laps {
    width: 100%;
    max-height: 180px;
    overflow-y: auto;
    font-size: 12px;
}

.sw-laps table {
    width: 100%;
    border-collapse: collapse;
}

.sw-laps th, .sw-laps td {
    padding: 4px 8px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}

.sw-laps th {
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 11px;
    position: sticky;
    top: 0;
    background: var(--bg-primary);
}

.sw-laps td {
    font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
}

.sw-laps .sw-lap-best {
    color: #27ae60;
    font-weight: 600;
}

.sw-laps .sw-lap-worst {
    color: #e74c3c;
    font-weight: 600;
}

/* YouTube Embed Widget */
.ytembed-widget {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    box-sizing: border-box;
}

.ytembed-input-row {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
}

.ytembed-input {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 13px;
    background: var(--bg-primary);
    color: var(--text-primary);
    outline: none;
    font-family: inherit;
    min-width: 0;
}

.ytembed-input:focus {
    border-color: #3498db;
}

.ytembed-load-btn {
    padding: 8px 14px;
    border: none;
    border-radius: 4px;
    background: #e74c3c;
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s;
}

.ytembed-load-btn:hover {
    background: #c0392b;
}

.ytembed-player {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ytembed-player iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 6px;
    min-height: 180px;
}

.ytembed-placeholder {
    color: var(--text-muted);
    font-size: 13px;
    text-align: center;
    padding: 20px;
}

.ytembed-error {
    color: #e74c3c;
    font-size: 12px;
    text-align: center;
    padding: 8px;
}

`;
    document.head.appendChild(style);
})();

// =============================================
// POMODORO TIMER
// =============================================

var pomodoroState = {
    running: false,
    timeLeft: 25 * 60,
    totalTime: 25 * 60,
    mode: 'work',
    completedCount: 0,
    intervalId: null,
    settings: {
        work: 25,
        shortBreak: 5,
        longBreak: 15
    }
};

var POMO_RING_CIRCUMFERENCE = 2 * Math.PI * 78;

function initPomodoro() {
    updatePomodoroDisplay();
}

function getModeLabel(mode) {
    if (mode === 'work') return 'Work';
    if (mode === 'shortBreak') return 'Short Break';
    return 'Long Break';
}

function getModeClass(mode) {
    if (mode === 'work') return 'work';
    if (mode === 'shortBreak') return 'short-break';
    return 'long-break';
}

function getDurationForMode(mode) {
    var s = pomodoroState.settings;
    if (mode === 'work') return s.work * 60;
    if (mode === 'shortBreak') return s.shortBreak * 60;
    return s.longBreak * 60;
}

function playPomodoroBeep() {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
        var osc2 = ctx.createOscillator();
        var gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.value = 1100;
        gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.6);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.1);
        osc2.start(ctx.currentTime + 0.6);
        osc2.stop(ctx.currentTime + 1.1);
    } catch(e) {}
}

function advancePomodoroMode() {
    var st = pomodoroState;
    if (st.mode === 'work') {
        st.completedCount++;
        if (st.completedCount % 4 === 0) {
            st.mode = 'longBreak';
        } else {
            st.mode = 'shortBreak';
        }
    } else {
        st.mode = 'work';
    }
    st.totalTime = getDurationForMode(st.mode);
    st.timeLeft = st.totalTime;
    st.running = false;
}

function togglePomodoro() {
    var st = pomodoroState;
    if (st.running) {
        clearInterval(st.intervalId);
        st.intervalId = null;
        st.running = false;
    } else {
        st.running = true;
        st.intervalId = setInterval(function() {
            st.timeLeft--;
            if (st.timeLeft <= 0) {
                st.timeLeft = 0;
                clearInterval(st.intervalId);
                st.intervalId = null;
                st.running = false;
                playPomodoroBeep();
                updatePomodoroDisplay();
                setTimeout(function() {
                    advancePomodoroMode();
                    updatePomodoroDisplay();
                }, 1200);
                return;
            }
            updatePomodoroDisplay();
        }, 1000);
    }
    updatePomodoroDisplay();
}

function resetPomodoro() {
    var st = pomodoroState;
    clearInterval(st.intervalId);
    st.intervalId = null;
    st.running = false;
    st.totalTime = getDurationForMode(st.mode);
    st.timeLeft = st.totalTime;
    updatePomodoroDisplay();
}

function skipPomodoro() {
    var st = pomodoroState;
    clearInterval(st.intervalId);
    st.intervalId = null;
    st.running = false;
    advancePomodoroMode();
    updatePomodoroDisplay();
}

function togglePomodoroSettings() {
    var el = document.getElementById('pomoSettings');
    if (el) el.classList.toggle('open');
}

function applyPomodoroSettings() {
    var workEl = document.getElementById('pomoWorkMin');
    var shortEl = document.getElementById('pomoShortMin');
    var longEl = document.getElementById('pomoLongMin');
    if (!workEl || !shortEl || !longEl) return;

    var w = parseInt(workEl.value) || 25;
    var s = parseInt(shortEl.value) || 5;
    var l = parseInt(longEl.value) || 15;
    w = Math.max(1, Math.min(99, w));
    s = Math.max(1, Math.min(30, s));
    l = Math.max(1, Math.min(60, l));

    pomodoroState.settings.work = w;
    pomodoroState.settings.shortBreak = s;
    pomodoroState.settings.longBreak = l;

    if (!pomodoroState.running) {
        pomodoroState.totalTime = getDurationForMode(pomodoroState.mode);
        pomodoroState.timeLeft = pomodoroState.totalTime;
        updatePomodoroDisplay();
    }
}

function updatePomodoroDisplay() {
    var st = pomodoroState;
    var mins = Math.floor(st.timeLeft / 60);
    var secs = st.timeLeft % 60;
    var timeStr = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;

    var timeEl = document.getElementById('pomoTime');
    if (timeEl) timeEl.textContent = timeStr;

    var modeEl = document.getElementById('pomoModeLabel');
    if (modeEl) modeEl.textContent = getModeLabel(st.mode);

    var ringEl = document.getElementById('pomoRing');
    if (ringEl) {
        var progress = st.totalTime > 0 ? st.timeLeft / st.totalTime : 1;
        var offset = POMO_RING_CIRCUMFERENCE * (1 - progress);
        ringEl.style.strokeDashoffset = offset;
        ringEl.className.baseVal = 'pomo-ring-fg ' + getModeClass(st.mode);
    }

    var btnEl = document.getElementById('pomoBtnToggle');
    if (btnEl) {
        btnEl.textContent = st.running ? 'Pause' : 'Start';
        if (st.running) {
            btnEl.classList.remove('paused');
        } else {
            btnEl.classList.add('paused');
        }
    }

    var countEl = document.getElementById('pomoCount');
    if (countEl) {
        var icons = '';
        for (var i = 0; i < st.completedCount; i++) icons += '\uD83C\uDF45';
        if (st.completedCount === 0) icons = '\u2014';
        countEl.innerHTML = '<span class="pomo-count-icons">' + icons + '</span><br>Completed: ' + st.completedCount;
    }
}

// =============================================
// UNIT CONVERTER
// =============================================

var UC_UNITS = {
    length: {
        name: 'Length', icon: '📏',
        units: {
            m: { name: 'Meters', factor: 1 },
            km: { name: 'Kilometers', factor: 1000 },
            cm: { name: 'Centimeters', factor: 0.01 },
            mm: { name: 'Millimeters', factor: 0.001 },
            mi: { name: 'Miles', factor: 1609.344 },
            yd: { name: 'Yards', factor: 0.9144 },
            ft: { name: 'Feet', factor: 0.3048 },
            'in': { name: 'Inches', factor: 0.0254 },
            nmi: { name: 'Nautical Miles', factor: 1852 },
            um: { name: 'Micrometers', factor: 1e-6 }
        }
    },
    weight: {
        name: 'Weight', icon: '⚖️',
        units: {
            kg: { name: 'Kilograms', factor: 1 },
            g: { name: 'Grams', factor: 0.001 },
            mg: { name: 'Milligrams', factor: 1e-6 },
            lb: { name: 'Pounds', factor: 0.45359237 },
            oz: { name: 'Ounces', factor: 0.028349523 },
            t: { name: 'Metric Tons', factor: 1000 },
            st: { name: 'Stones', factor: 6.35029318 },
            ust: { name: 'US Tons', factor: 907.18474 }
        }
    },
    temperature: {
        name: 'Temperature', icon: '🌡️',
        units: {
            c: { name: 'Celsius' },
            f: { name: 'Fahrenheit' },
            k: { name: 'Kelvin' }
        },
        custom: true
    },
    volume: {
        name: 'Volume', icon: '🧪',
        units: {
            l: { name: 'Liters', factor: 1 },
            ml: { name: 'Milliliters', factor: 0.001 },
            gal: { name: 'US Gallons', factor: 3.785411784 },
            qt: { name: 'US Quarts', factor: 0.946352946 },
            pt: { name: 'US Pints', factor: 0.473176473 },
            cup: { name: 'US Cups', factor: 0.236588236 },
            floz: { name: 'US Fl Oz', factor: 0.029573529 },
            tbsp: { name: 'Tablespoons', factor: 0.014786764 },
            tsp: { name: 'Teaspoons', factor: 0.004928921 },
            m3: { name: 'Cubic Meters', factor: 1000 },
            igal: { name: 'Imperial Gallons', factor: 4.54609 }
        }
    },
    area: {
        name: 'Area', icon: '📐',
        units: {
            m2: { name: 'Square Meters', factor: 1 },
            km2: { name: 'Square Kilometers', factor: 1e6 },
            cm2: { name: 'Square Centimeters', factor: 1e-4 },
            ha: { name: 'Hectares', factor: 1e4 },
            ac: { name: 'Acres', factor: 4046.8564224 },
            sqft: { name: 'Square Feet', factor: 0.09290304 },
            sqyd: { name: 'Square Yards', factor: 0.83612736 },
            sqmi: { name: 'Square Miles', factor: 2589988.11 },
            sqin: { name: 'Square Inches', factor: 6.4516e-4 }
        }
    },
    speed: {
        name: 'Speed', icon: '🚀',
        units: {
            ms: { name: 'Meters/Second', factor: 1 },
            kmh: { name: 'Kilometers/Hour', factor: 0.277778 },
            mph: { name: 'Miles/Hour', factor: 0.44704 },
            kn: { name: 'Knots', factor: 0.514444 },
            fts: { name: 'Feet/Second', factor: 0.3048 },
            mach: { name: 'Mach', factor: 343 }
        }
    },
    time: {
        name: 'Time', icon: '⏱️',
        units: {
            s: { name: 'Seconds', factor: 1 },
            ms_t: { name: 'Milliseconds', factor: 0.001 },
            min: { name: 'Minutes', factor: 60 },
            hr: { name: 'Hours', factor: 3600 },
            day: { name: 'Days', factor: 86400 },
            wk: { name: 'Weeks', factor: 604800 },
            yr: { name: 'Years', factor: 31557600 }
        }
    },
    data: {
        name: 'Data', icon: '💾',
        units: {
            B: { name: 'Bytes', factor: 1 },
            KB: { name: 'Kilobytes', factor: 1024 },
            MB: { name: 'Megabytes', factor: 1048576 },
            GB: { name: 'Gigabytes', factor: 1073741824 },
            TB: { name: 'Terabytes', factor: 1099511627776 },
            PB: { name: 'Petabytes', factor: 1125899906842624 },
            b: { name: 'Bits', factor: 0.125 },
            Kb: { name: 'Kilobits', factor: 128 },
            Mb: { name: 'Megabits', factor: 131072 },
            Gb: { name: 'Gigabits', factor: 134217728 }
        }
    }
};

function ucGetToolId(element) {
    var tool = element.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function ucGetData(toolId) {
    var customizations = loadToolCustomizations();
    var custom = customizations[toolId] || {};
    return custom.ucData || { category: 'length', fromUnit: 'km', toUnit: 'mi', value: '' };
}

function ucSaveData(toolId, data) {
    var customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].ucData = data;
    saveToolCustomizations(customizations);
}

function ucInit() {
    document.querySelectorAll('.uc-widget').forEach(function(widget) {
        var toolId = ucGetToolId(widget);
        if (!toolId) return;
        var data = ucGetData(toolId);
        ucRenderCategories(widget, data.category);
        ucRenderSelects(widget, data.category, data.fromUnit, data.toUnit);
        var input = widget.querySelector('.uc-value-input');
        if (input) input.value = data.value;
        ucConvert(widget, toolId);
    });
}

function ucRenderCategories(widget, activeCategory) {
    var bar = widget.querySelector('.uc-category-bar');
    if (!bar) return;
    var html = '';
    for (var cat in UC_UNITS) {
        html += '<button class="uc-cat-btn' + (cat === activeCategory ? ' active' : '') + '" onclick="ucSetCategory(this, \'' + cat + '\')">' + UC_UNITS[cat].icon + ' ' + UC_UNITS[cat].name + '</button>';
    }
    bar.innerHTML = html;
}

function ucRenderSelects(widget, category, fromUnit, toUnit) {
    var catData = UC_UNITS[category];
    if (!catData) return;
    var fromSelect = widget.querySelector('.uc-from-select');
    var toSelect = widget.querySelector('.uc-to-select');
    var opts = '';
    for (var key in catData.units) {
        opts += '<option value="' + key + '">' + catData.units[key].name + ' (' + key + ')</option>';
    }
    if (fromSelect) { fromSelect.innerHTML = opts; fromSelect.value = fromUnit; }
    if (toSelect) { toSelect.innerHTML = opts; toSelect.value = toUnit; }
}

function ucSetCategory(btn, category) {
    var widget = btn.closest('.uc-widget');
    var toolId = ucGetToolId(widget);
    if (!toolId) return;
    var data = ucGetData(toolId);
    data.category = category;
    var keys = Object.keys(UC_UNITS[category].units);
    data.fromUnit = keys[0] || '';
    data.toUnit = keys.length > 1 ? keys[1] : keys[0];
    ucSaveData(toolId, data);
    ucRenderCategories(widget, category);
    ucRenderSelects(widget, category, data.fromUnit, data.toUnit);
    ucConvert(widget, toolId);
}

function ucOnInput(input) {
    var widget = input.closest('.uc-widget');
    var toolId = ucGetToolId(widget);
    if (!toolId) return;
    var data = ucGetData(toolId);
    data.value = input.value;
    ucSaveData(toolId, data);
    ucConvert(widget, toolId);
}

function ucOnUnitChange(select, which) {
    var widget = select.closest('.uc-widget');
    var toolId = ucGetToolId(widget);
    if (!toolId) return;
    var data = ucGetData(toolId);
    if (which === 'from') data.fromUnit = select.value;
    else data.toUnit = select.value;
    ucSaveData(toolId, data);
    ucConvert(widget, toolId);
}

function ucSwap(btn) {
    var widget = btn.closest('.uc-widget');
    var toolId = ucGetToolId(widget);
    if (!toolId) return;
    var data = ucGetData(toolId);
    var tmp = data.fromUnit;
    data.fromUnit = data.toUnit;
    data.toUnit = tmp;
    ucSaveData(toolId, data);
    var fromSelect = widget.querySelector('.uc-from-select');
    var toSelect = widget.querySelector('.uc-to-select');
    if (fromSelect) fromSelect.value = data.fromUnit;
    if (toSelect) toSelect.value = data.toUnit;
    ucConvert(widget, toolId);
}

function ucConvertTemp(value, from, to) {
    if (from === to) return value;
    var celsius;
    if (from === 'c') celsius = value;
    else if (from === 'f') celsius = (value - 32) * 5 / 9;
    else celsius = value - 273.15;
    if (to === 'c') return celsius;
    if (to === 'f') return celsius * 9 / 5 + 32;
    return celsius + 273.15;
}

function ucFormatNumber(num) {
    if (num === 0) return '0';
    var abs = Math.abs(num);
    if (abs >= 1e15 || (abs < 1e-10 && abs > 0)) return num.toExponential(6);
    if (abs >= 1) {
        var s = num.toPrecision(10);
        return parseFloat(s).toString();
    }
    var s2 = num.toPrecision(8);
    return parseFloat(s2).toString();
}

function ucConvert(widget, toolId) {
    var data = ucGetData(toolId);
    var output = widget.querySelector('.uc-result-input');
    var formula = widget.querySelector('.uc-formula');
    var commonDiv = widget.querySelector('.uc-common');
    var val = parseFloat(data.value);

    if (!data.value || isNaN(val)) {
        if (output) output.value = '';
        if (formula) formula.textContent = 'Enter a value to convert';
        if (commonDiv) commonDiv.innerHTML = '';
        return;
    }

    var catData = UC_UNITS[data.category];
    var result;
    if (catData.custom) {
        result = ucConvertTemp(val, data.fromUnit, data.toUnit);
    } else {
        var fromFactor = catData.units[data.fromUnit].factor;
        var toFactor = catData.units[data.toUnit].factor;
        result = val * fromFactor / toFactor;
    }

    if (output) output.value = ucFormatNumber(result);

    var fromName = catData.units[data.fromUnit].name;
    var toName = catData.units[data.toUnit].name;
    if (formula) formula.textContent = ucFormatNumber(val) + ' ' + fromName + ' = ' + ucFormatNumber(result) + ' ' + toName;

    // Show all conversions
    if (commonDiv) {
        var html = '<div class="uc-common-title">All conversions</div>';
        for (var key in catData.units) {
            var converted;
            if (catData.custom) {
                converted = ucConvertTemp(val, data.fromUnit, key);
            } else {
                converted = val * catData.units[data.fromUnit].factor / catData.units[key].factor;
            }
            var isCurrent = (key === data.toUnit);
            html += '<div class="uc-common-row" style="' + (isCurrent ? 'background:rgba(52,152,219,0.12);' : '') + '"><span class="uc-common-unit">' + catData.units[key].name + '</span><span class="uc-common-val">' + ucFormatNumber(converted) + '</span></div>';
        }
        commonDiv.innerHTML = html;
    }
}

// =============================================
// PLAYBACK SPEED CALCULATOR
// =============================================

// Fraction display lookup: decimal -> label
var PBS_FRACTIONS = {
    0.125: '\u215Bx', 0.25: '\u00BCx', 0.5: '\u00BDx', 0.75: '\u00BEx',
    1: '1x', 1.25: '1\u00BCx', 1.5: '1\u00BDx', 1.75: '1\u00BEx',
    2: '2x', 2.5: '2\u00BDx', 3: '3x', 4: '4x', 5: '5x', 6: '6x', 8: '8x',
    0.333: '\u2153x', 0.667: '\u2154x', 1.333: '1\u2153x', 1.667: '1\u2154x',
    2.25: '2\u00BCx', 2.75: '2\u00BEx', 3.5: '3\u00BDx'
};

function pbsSpeedLabel(speed) {
    if (speed < 1) {
        // Check known Unicode fractions first
        for (var k in PBS_FRACTIONS) {
            if (parseFloat(k) < 1 && Math.abs(parseFloat(k) - speed) < 0.005) return PBS_FRACTIONS[k];
        }
        // Try to compute a fraction
        var frac = pbsToFraction(speed);
        if (frac) return frac + 'x';
    }
    // >= 1x: always use decimals
    return speed.toFixed(2).replace(/\.?0+$/, '') + 'x';
}

function pbsToFraction(val) {
    for (var den = 2; den <= 64; den++) {
        var num = Math.round(val * den);
        if (num <= 0 || num >= den) continue;
        if (Math.abs(val - num / den) < 0.005) {
            var a = num, b = den;
            while (b) { var t = b; b = a % b; a = t; }
            return (num / a) + '/' + (den / a);
        }
    }
    return null;
}

// Preset speeds
var PBS_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

function pbsFmtDuration(totalSec) {
    var neg = totalSec < 0;
    var abs = Math.abs(Math.round(totalSec));
    var h = Math.floor(abs / 3600);
    var m = Math.floor((abs % 3600) / 60);
    var s = abs % 60;
    var parts = [];
    if (h > 0) parts.push(h.toString());
    parts.push(h > 0 ? m.toString().padStart(2, '0') : m.toString());
    parts.push(s.toString().padStart(2, '0'));
    return (neg ? '-' : '') + parts.join(':');
}

function pbsGetTotalSeconds(widget) {
    var h = parseInt(widget.querySelector('.pbs-hours').value) || 0;
    var m = parseInt(widget.querySelector('.pbs-minutes').value) || 0;
    var s = parseInt(widget.querySelector('.pbs-seconds').value) || 0;
    return h * 3600 + m * 60 + s;
}

function pbsGetSpeed(widget) {
    return parseFloat(widget.querySelector('.pbs-range').value) || 1;
}

function pbsCalc(el) {
    var widget = el.closest('.pbs-widget');
    var totalSec = pbsGetTotalSeconds(widget);
    var speed = pbsGetSpeed(widget);

    // Total label
    widget.querySelector('.pbs-total').textContent = 'Original: ' + pbsFmtDuration(totalSec);

    // Adjusted
    var adjusted = totalSec / speed;
    var saved = totalSec - adjusted;
    widget.querySelector('.pbs-adjusted-dur').textContent = pbsFmtDuration(adjusted);

    var savedEl = widget.querySelector('.pbs-time-saved');
    savedEl.textContent = (saved >= 0 ? '' : '+') + pbsFmtDuration(Math.abs(saved));
    savedEl.classList.toggle('saved', saved >= 0);
    savedEl.classList.toggle('longer', saved < 0);
    widget.querySelector('.pbs-saved-label').textContent = saved >= 0 ? 'Time Saved' : 'Extra Time';

    // Table
    var tableSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 6, 8];
    var tbody = widget.querySelector('.pbs-table-body');
    tbody.innerHTML = tableSpeeds.map(function(sp) {
        var dur = totalSec / sp;
        var sv = totalSec - dur;
        var cls = sv > 0 ? 'saved-cell' : sv < 0 ? 'longer-cell' : '';
        var svText = sv === 0 ? '\u2014' : (sv > 0 ? '-' : '+') + pbsFmtDuration(Math.abs(sv));
        return '<tr><td class="mono">' + pbsSpeedLabel(sp) + '</td><td class="mono">' + pbsFmtDuration(dur) + '</td><td class="mono ' + cls + '">' + svText + '</td></tr>';
    }).join('');
}

function pbsSetSpeed(btn, speed) {
    var widget = btn.closest('.pbs-widget');
    widget.querySelectorAll('.pbs-preset').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var range = widget.querySelector('.pbs-range');
    range.value = speed;
    widget.querySelector('.pbs-speed-val').textContent = pbsSpeedLabel(speed);
    pbsCalc(btn);
}

function pbsRangeChanged(range) {
    var widget = range.closest('.pbs-widget');
    var speed = parseFloat(range.value);
    widget.querySelector('.pbs-speed-val').textContent = pbsSpeedLabel(speed);
    // Update preset highlights
    widget.querySelectorAll('.pbs-preset').forEach(function(b) {
        var presetSpeed = parseFloat(b.getAttribute('data-speed'));
        b.classList.toggle('active', Math.abs(presetSpeed - speed) < 0.01);
    });
    pbsCalc(range);
}

function pbsInit() {
    document.querySelectorAll('.pbs-widget').forEach(function(widget) {
        // Build preset buttons
        var presetsDiv = widget.querySelector('.pbs-presets');
        presetsDiv.innerHTML = PBS_PRESETS.map(function(sp) {
            return '<button class="pbs-preset' + (sp === 1.25 ? ' active' : '') + '" data-speed="' + sp + '" onclick="pbsSetSpeed(this,' + sp + ')">' + pbsSpeedLabel(sp) + '</button>';
        }).join('');
        pbsCalc(widget.querySelector('.pbs-hours'));
    });
}

const CALENDAR_COLORS = [
    '#3498db', '#e74c3c', '#27ae60', '#9b59b6',
    '#f39c12', '#1abc9c', '#e67e22', '#34495e'
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function calendarGetToolId(widget) {
    const tool = widget.closest('.tool');
    return tool ? tool.dataset.tool: null;
}

function calendarGetData(toolId) {
    const customizations = loadToolCustomizations();
    const custom = customizations[toolId] || {};
    const data = custom.calendarData || { calendars: [], events: [] };
    return data;
}

function calendarSaveData(toolId, data) {
    const customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].calendarData = data;
    saveToolCustomizations(customizations);
}

function calendarInit() {
    document.querySelectorAll('.calendar-widget').forEach(widget => {
        const toolId = calendarGetToolId(widget);
        if (!toolId) return;

        const data = calendarGetData(toolId);
        const now = new Date();
        const view = data.viewState || {};
        const year = view.year || now.getFullYear();
        const savedView = view.mode || 'year';

        calendarRender(widget, toolId, year);

        if (savedView === 'month') {
            widget.dataset.viewMonth = view.month != null ? view.month : now.getMonth();
            widget.dataset.viewYear = view.monthYear || year;
            const monthBtn = widget.querySelector('.calendar-view-btn:last-child');
            if (monthBtn) calendarSetView(monthBtn, 'month');
        }

        // Refresh ICS subscriptions in the background
        calendarRefreshSubscriptions(widget, toolId);
    });
}

async function calendarFetchICS(url) {
    const cacheBust = (u) => u + (u.includes('?') ? '&' : '?') + '_t=' + Date.now();
    // Try direct fetch first
    try {
        const response = await fetch(cacheBust(url), { cache: 'no-store' });
        if (response.ok) {
            const text = await response.text();
            if (text.includes('BEGIN:VCALENDAR')) return text;
        }
    } catch (e) {
        // Direct fetch failed (likely CORS), try proxy
    }
    // Fallback: CORS proxy
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(cacheBust(url));
    const response = await fetch(proxyUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error('Fetch failed: ' + response.status);
    const text = await response.text();
    if (!text.includes('BEGIN:VCALENDAR')) throw new Error('Not valid ICS data');
    return text;
}

async function calendarRefreshSubscriptions(widget, toolId) {
    const data = calendarGetData(toolId);
    if (!data.subscriptions || data.subscriptions.length === 0) return;

    let updated = false;

    for (const sub of data.subscriptions) {
        try {
            const content = await calendarFetchICS(sub.url);

            const freshData = calendarGetData(toolId);
            freshData.events = freshData.events.filter(e => e.calendarId !== sub.calendarId);

            const events = parseICSContent(content, sub.calendarId);
            events.forEach(event => freshData.events.push(event));

            calendarSaveData(toolId, freshData);
            updated = true;
            console.log('Calendar subscription refreshed:', sub.url, events.length, 'events');
        } catch (e) {
            console.warn('Calendar subscription error:', sub.url, e.message);
        }
    }

    if (updated) {
        const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
        calendarRender(widget, toolId, year);
        if (widget.dataset.viewMonth !== undefined) {
            calendarRenderMonthView(widget, toolId);
        }
    }
}

function calendarRender(widget, toolId, year) {
    const data = calendarGetData(toolId);
    const grid = widget.querySelector('.calendar-year-grid');
    const legend = widget.querySelector('.calendar-legend');
    const yearDisplay = widget.querySelector('.calendar-year-display');

    if (yearDisplay) yearDisplay.textContent = year;

    // Render 12 months in year grid
    let html = '';
    for (let month = 0; month < 12; month++) {
        html += calendarRenderMonth(year, month, data);
    }
    grid.innerHTML = html;

    // Also update month view if it exists and has data
    const monthView = widget.querySelector('.calendar-month-view');
    if (monthView && widget.dataset.viewMonth !== undefined) {
        calendarRenderMonthView(widget, toolId);
    }

    // Render legend with event counts
    const counts = calendarCountByType(data, year);
    let legendHtml = '';
    data.calendars.forEach(cal => {
        const count = counts[cal.id] || 0;
        legendHtml += `<div class="calendar-legend-item">
            <span class="calendar-legend-dot" style="background:${cal.color}"></span>
            <span>${cal.name}</span>
            <span class="calendar-legend-count">${count}</span>
        </div>`;
    });
    legend.innerHTML = legendHtml;
}

function calendarRenderMonth(year, month, data) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    let html = `<div class="calendar-month">
        <div class="calendar-month-name" onclick="calendarGoToMonth(this, ${year}, ${month})" style="cursor:pointer" title="Click for month view">${MONTH_NAMES[month]}</div>
        <div class="calendar-month-grid">`;

    // Day of week headers
    DAY_NAMES.forEach(d => {
        html += `<div class="calendar-dow">${d}</div>`;
    });

    // Empty cells before first day
    for (let i = 0; i < startDow; i++) {
        html += `<div class="calendar-day other-month"></div>`;
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = calendarGetEventsForDate(data, dateStr);
        const isToday = isCurrentMonth && day === todayDate;

        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (dayEvents.length > 0) classes += ' has-events';

        html += `<div class="${classes}" data-date="${dateStr}" onclick="calendarShowDayEvents(this, '${dateStr}')">
            ${day}`;

        if (dayEvents.length > 0) {
            html += `<div class="calendar-event-dots">`;
            // Show up to 3 dots
            const uniqueCals = [...new Set(dayEvents.map(e => e.calendarId))];
            uniqueCals.slice(0, 3).forEach(calId => {
                const cal = data.calendars.find(c => c.id === calId);
                if (cal) {
                    html += `<span class="calendar-event-dot" style="background:${cal.color}"></span>`;
                }
            });
            html += `</div>`;
        }

        html += `</div>`;
    }

    html += `</div></div>`;
    return html;
}

function calendarGetEventsForDate(data, dateStr) {
    return data.events.filter(event => {
        // Check if date falls within event range or matches single day
        const startDate = event.startDate.split('T')[0];
        const endDate = event.endDate ? event.endDate.split('T')[0] : startDate;
        return dateStr >= startDate && dateStr <= endDate;
    });
}

function calendarCountByType(data, year, month) {
    const counts = {};
    data.calendars.forEach(cal => counts[cal.id] = 0);

    const rangeStart = month !== undefined ? new Date(year, month, 1) : new Date(year, 0, 1);
    const rangeEnd = month !== undefined ? new Date(year, month + 1, 0) : new Date(year, 11, 31);

    data.events.forEach(event => {
        if (!counts.hasOwnProperty(event.calendarId)) return;

        const startDate = new Date(event.startDate.split('T')[0]);
        const endDate = new Date((event.endDate || event.startDate).split('T')[0]);

        const countStart = startDate < rangeStart ? rangeStart : startDate;
        const countEnd = endDate > rangeEnd ? rangeEnd : endDate;

        if (countStart <= countEnd) {
            const days = Math.round((countEnd - countStart) / (1000 * 60 * 60 * 24)) + 1;
            counts[event.calendarId] += days;
        }
    });

    return counts;
}

function calendarCountTotal(data) {
    const counts = {};
    data.calendars.forEach(cal => counts[cal.id] = 0);

    data.events.forEach(event => {
        if (!counts.hasOwnProperty(event.calendarId)) return;

        const startDate = new Date(event.startDate.split('T')[0]);
        const endDate = new Date((event.endDate || event.startDate).split('T')[0]);

        // Count number of days
        const days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        counts[event.calendarId] += days;
    });

    return counts;
}

function calendarSaveViewState(widget, toolId, state) {
    const data = calendarGetData(toolId);
    data.viewState = Object.assign(data.viewState || {}, state);
    calendarSaveData(toolId, data);
}

function calendarPrevYear(btn) {
    const widget = btn.closest('.calendar-widget');
    const toolId = calendarGetToolId(widget);
    const yearDisplay = widget.querySelector('.calendar-year-display');
    const year = parseInt(yearDisplay.textContent) - 1;
    calendarSaveViewState(widget, toolId, { year });
    calendarRender(widget, toolId, year);
}

function calendarNextYear(btn) {
    const widget = btn.closest('.calendar-widget');
    const toolId = calendarGetToolId(widget);
    const yearDisplay = widget.querySelector('.calendar-year-display');
    const year = parseInt(yearDisplay.textContent) + 1;
    calendarSaveViewState(widget, toolId, { year });
    calendarRender(widget, toolId, year);
}

function calendarSetView(btn, view) {
    const widget = btn.closest('.calendar-widget');
    const toolId = calendarGetToolId(widget);

    // Update toggle buttons
    widget.querySelectorAll('.calendar-view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const yearGrid = widget.querySelector('.calendar-year-grid');
    const monthView = widget.querySelector('.calendar-month-view');
    const yearNav = widget.querySelector('.calendar-year-nav');

    if (view === 'month') {
        yearGrid.classList.add('hidden');
        monthView.classList.add('active');
        yearNav.style.display = 'none';

        // Initialize month view with current month if not set
        if (!widget.dataset.viewMonth) {
            const now = new Date();
            widget.dataset.viewMonth = now.getMonth();
            widget.dataset.viewYear = now.getFullYear();
        }
        calendarSaveViewState(widget, toolId, { mode: 'month', month: parseInt(widget.dataset.viewMonth), monthYear: parseInt(widget.dataset.viewYear) });
        calendarRenderMonthView(widget, toolId);
    } else {
        yearGrid.classList.remove('hidden');
        monthView.classList.remove('active');
        yearNav.style.display = 'flex';
        calendarSaveViewState(widget, toolId, { mode: 'year' });

        // Re-render legend with year counts
        const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
        const data = calendarGetData(toolId);
        const legend = widget.querySelector('.calendar-legend');
        if (legend) {
            const counts = calendarCountByType(data, year);
            let legendHtml = '';
            data.calendars.forEach(cal => {
                const count = counts[cal.id] || 0;
                legendHtml += `<div class="calendar-legend-item">
                    <span class="calendar-legend-dot" style="background:${cal.color}"></span>
                    <span>${cal.name}</span>
                    <span class="calendar-legend-count">${count}</span>
                </div>`;
            });
            legend.innerHTML = legendHtml;
        }
    }
}

function calendarPrevMonth(btn) {
    const widget = btn.closest('.calendar-widget');
    const toolId = calendarGetToolId(widget);
    let month = parseInt(widget.dataset.viewMonth);
    let year = parseInt(widget.dataset.viewYear);

    month--;
    if (month < 0) {
        month = 11;
        year--;
    }

    widget.dataset.viewMonth = month;
    widget.dataset.viewYear = year;
    calendarSaveViewState(widget, toolId, { month, monthYear: year });
    calendarRenderMonthView(widget, toolId);
}

function calendarNextMonth(btn) {
    const widget = btn.closest('.calendar-widget');
    const toolId = calendarGetToolId(widget);
    let month = parseInt(widget.dataset.viewMonth);
    let year = parseInt(widget.dataset.viewYear);

    month++;
    if (month > 11) {
        month = 0;
        year++;
    }

    widget.dataset.viewMonth = month;
    widget.dataset.viewYear = year;
    calendarSaveViewState(widget, toolId, { month, monthYear: year });
    calendarRenderMonthView(widget, toolId);
}

function calendarGoToMonth(el, year, month) {
    const widget = el.closest('.calendar-widget');
    const toolId = calendarGetToolId(widget);

    // Set the month/year
    widget.dataset.viewMonth = month;
    widget.dataset.viewYear = year;

    // Switch to month view (calendarSetView will save the state)
    const monthBtn = widget.querySelector('.calendar-view-btn:last-child');
    calendarSetView(monthBtn, 'month');
}

function calendarGoToToday(btn) {
    const widget = btn.closest('.calendar-widget');
    const toolId = calendarGetToolId(widget);
    const now = new Date();

    widget.dataset.viewMonth = now.getMonth();
    widget.dataset.viewYear = now.getFullYear();
    calendarSaveViewState(widget, toolId, { month: now.getMonth(), monthYear: now.getFullYear() });
    calendarRenderMonthView(widget, toolId);
}

function calendarRenderMonthView(widget, toolId) {
    const data = calendarGetData(toolId);
    const month = parseInt(widget.dataset.viewMonth);
    const year = parseInt(widget.dataset.viewYear);

    const monthTitle = widget.querySelector('.calendar-month-title');
    const monthDetail = widget.querySelector('.calendar-month-detail');

    monthTitle.textContent = `${MONTH_NAMES[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    let html = '';

    // Day of week headers
    DAY_NAMES.forEach(d => {
        html += `<div class="calendar-dow">${d}</div>`;
    });

    // Days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        html += `<div class="calendar-day-cell other-month" data-date="${dateStr}" onclick="calendarShowDayEvents(this, '${dateStr}')">
            <div class="calendar-day-number">${day}</div>
        </div>`;
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = calendarGetEventsForDate(data, dateStr);
        const isToday = isCurrentMonth && day === todayDate;

        let classes = 'calendar-day-cell';
        if (isToday) classes += ' today';

        html += `<div class="${classes}" data-date="${dateStr}" onclick="calendarShowDayEvents(this, '${dateStr}')">
            <div class="calendar-day-number">${day}</div>
            <div class="calendar-day-events">`;

        // Show up to 3 events
        dayEvents.slice(0, 3).forEach(event => {
            const cal = data.calendars.find(c => c.id === event.calendarId);
            const color = cal ? cal.color : '#999';
            html += `<div class="calendar-day-event" style="background:${color}" title="${event.summary}">${event.summary}</div>`;
        });

        if (dayEvents.length > 3) {
            html += `<div class="calendar-day-more">+${dayEvents.length - 3} more</div>`;
        }

        html += `</div></div>`;
    }

    // Days from next month to fill the grid
    const totalCells = startDow + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let day = 1; day <= remainingCells; day++) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        html += `<div class="calendar-day-cell other-month" data-date="${dateStr}" onclick="calendarShowDayEvents(this, '${dateStr}')">
            <div class="calendar-day-number">${day}</div>
        </div>`;
    }

    monthDetail.innerHTML = html;

    // Update legend with month-specific counts
    const legend = widget.querySelector('.calendar-legend');
    if (legend) {
        const counts = calendarCountByType(data, year, month);
        let legendHtml = '';
        data.calendars.forEach(cal => {
            const count = counts[cal.id] || 0;
            legendHtml += `<div class="calendar-legend-item">
                <span class="calendar-legend-dot" style="background:${cal.color}"></span>
                <span>${cal.name}</span>
                <span class="calendar-legend-count">${count}</span>
            </div>`;
        });
        legend.innerHTML = legendHtml;
    }
}

function calendarShowDayEvents(dayEl, dateStr) {
    // Remove existing tooltip
    document.querySelectorAll('.calendar-day-tooltip').forEach(t => t.remove());

    const widget = dayEl.closest('.calendar-widget');
    const toolId = calendarGetToolId(widget);
    const data = calendarGetData(toolId);
    const events = calendarGetEventsForDate(data, dateStr);

    const date = new Date(dateStr + 'T00:00:00');
    const dateFormatted = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    let html = `<div class="calendar-day-tooltip" data-tool-id="${toolId}" data-date="${dateStr}">
        <div class="calendar-day-tooltip-date">${dateFormatted}</div>`;

    events.forEach(event => {
        const cal = data.calendars.find(c => c.id === event.calendarId);
        const color = cal ? cal.color : '#999';
        html += `<div class="calendar-day-tooltip-event">
            <span class="calendar-day-tooltip-dot" style="background:${color}"></span>
            <span class="calendar-day-tooltip-text">${event.summary}</span>
            <button class="calendar-event-delete" onclick="calendarDeleteEvent('${event.uid}')" title="Delete event">&times;</button>
        </div>`;
    });

    // Add event form
    if (data.calendars.length > 0) {
        const calendarOptions = data.calendars.map(cal =>
            `<option value="${cal.id}">${cal.name}</option>`
        ).join('');
        html += `<div class="calendar-day-add-form">
            <input type="text" class="calendar-day-add-input" placeholder="New event..." id="calendarDayEventTitle">
            <select class="calendar-day-add-select" id="calendarDayEventCalendar">${calendarOptions}</select>
            <button class="calendar-day-add-btn" onclick="calendarAddEventFromDay(this)">+</button>
        </div>`;
    } else {
        html += `<div style="font-size:10px;color:var(--text-muted);margin-top:6px;">Add a calendar first to create events</div>`;
    }

    html += `</div>`;

    const tooltip = document.createElement('div');
    tooltip.innerHTML = html;
    const tooltipEl = tooltip.firstChild;
    document.body.appendChild(tooltipEl);

    // Position tooltip
    const rect = dayEl.getBoundingClientRect();
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 5;

    // Adjust if tooltip would go off-screen
    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';

    // Focus the input and add Enter key support
    setTimeout(() => {
        const input = tooltipEl.querySelector('.calendar-day-add-input');
        if (input) {
            input.focus();
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const btn = tooltipEl.querySelector('.calendar-day-add-btn');
                    if (btn) btn.click();
                }
            });
        }
    }, 0);

    // Close on click outside
    const closeHandler = (e) => {
        if (!tooltipEl.contains(e.target) && e.target !== dayEl) {
            tooltipEl.remove();
            document.removeEventListener('click', closeHandler);
        }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 0);
}

function calendarOpenManage(btn) {
    const widget = btn.closest('.calendar-widget');
    const toolId = calendarGetToolId(widget);
    const data = calendarGetData(toolId);

    // Create modal if it doesn't exist
    let modal = document.getElementById('calendarManageModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'calendarManageModal';
        modal.className = 'calendar-manage-modal';
        modal.innerHTML = `
            <div class="calendar-manage-content">
                <span class="calendar-manage-close" onclick="calendarCloseManage()">&times;</span>
                <h3>Manage Calendars</h3>
                <div class="calendar-list" id="calendarManageList"></div>
                <div class="calendar-add-form">
                    <h4>Add New Calendar</h4>
                    <div class="calendar-add-row">
                        <input type="text" class="calendar-add-name" id="calendarAddName" placeholder="Calendar name...">
                    </div>
                    <div class="calendar-color-picker" id="calendarColorPicker"></div>
                    <button class="calendar-add-btn" onclick="calendarAddCalendar()">Add Calendar</button>
                </div>
                <div class="calendar-import-section">
                    <h4>Add Event</h4>
                    <div class="calendar-import-row" style="margin-bottom:8px;">
                        <label style="font-size:11px;color:var(--text-muted);min-width:60px;">Title:</label>
                        <input type="text" class="calendar-add-name" id="calendarEventTitle" placeholder="Event title..." style="flex:1;">
                    </div>
                    <div class="calendar-import-row" style="margin-bottom:8px;">
                        <label style="font-size:11px;color:var(--text-muted);min-width:60px;">Start:</label>
                        <input type="date" class="calendar-add-name" id="calendarEventStart" style="flex:1;">
                    </div>
                    <div class="calendar-import-row" style="margin-bottom:8px;">
                        <label style="font-size:11px;color:var(--text-muted);min-width:60px;">End:</label>
                        <input type="date" class="calendar-add-name" id="calendarEventEnd" style="flex:1;">
                    </div>
                    <div class="calendar-import-row" style="margin-bottom:8px;">
                        <label style="font-size:11px;color:var(--text-muted);min-width:60px;">Calendar:</label>
                        <select class="calendar-import-select" id="calendarEventCalendar" style="flex:1;"></select>
                    </div>
                    <button class="calendar-add-btn" onclick="calendarAddEvent()">Add Event</button>
                </div>
                <div class="calendar-import-section">
                    <h4>Import .ics</h4>
                    <div class="calendar-import-row" style="margin-bottom:8px;">
                        <label style="font-size:11px;color:var(--text-muted);min-width:60px;">From file:</label>
                        <input type="file" class="calendar-import-file" id="calendarImportFile" accept=".ics">
                    </div>
                    <div class="calendar-import-row" style="margin-bottom:8px;">
                        <label style="font-size:11px;color:var(--text-muted);min-width:60px;">From URL:</label>
                        <input type="text" class="calendar-add-name" id="calendarImportUrl" placeholder="https://example.com/calendar.ics" style="flex:1;">
                        <button class="calendar-add-btn" onclick="calendarImportFromUrl()" style="padding:6px 10px;">Fetch</button>
                    </div>
                    <div class="calendar-import-row">
                        <label style="font-size:11px;color:var(--text-muted);min-width:60px;">To calendar:</label>
                        <select class="calendar-import-select" id="calendarImportSelect"></select>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // File import handler
        document.getElementById('calendarImportFile').addEventListener('change', calendarHandleFileImport);
    }

    modal.dataset.toolId = toolId;
    modal.classList.add('open');

    // Render color picker
    const colorPicker = document.getElementById('calendarColorPicker');
    colorPicker.innerHTML = CALENDAR_COLORS.map((color, i) =>
        `<div class="calendar-color-option${i === 0 ? ' selected' : ''}"
             style="background:${color}"
             data-color="${color}"
             onclick="calendarSelectColor(this)"></div>`
    ).join('');

    // Render calendar list
    calendarRenderManageList(data);
}

function calendarCloseManage() {
    const modal = document.getElementById('calendarManageModal');
    if (modal) modal.classList.remove('open');
}

function calendarSelectColor(el) {
    document.querySelectorAll('.calendar-color-option').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');
}

function calendarRenderManageList(data) {
    const list = document.getElementById('calendarManageList');
    const importSelect = document.getElementById('calendarImportSelect');
    const eventSelect = document.getElementById('calendarEventCalendar');

    if (data.calendars.length === 0) {
        list.innerHTML = '<p style="color:var(--text-muted);font-size:12px;">No calendars yet. Add one below.</p>';
        const emptyOption = '<option value="">Add a calendar first</option>';
        importSelect.innerHTML = emptyOption;
        eventSelect.innerHTML = emptyOption;
        importSelect.disabled = true;
        eventSelect.disabled = true;
    } else {
        const counts = calendarCountTotal(data);

        list.innerHTML = data.calendars.map(cal => `
            <div class="calendar-list-item">
                <span class="calendar-list-color" style="background:${cal.color}"></span>
                <span class="calendar-list-name">${cal.name}</span>
                <span class="calendar-list-count">${counts[cal.id] || 0} days</span>
                <button class="calendar-list-remove" onclick="calendarRemoveCalendar('${cal.id}')">&times;</button>
            </div>
        `).join('');

        const calendarOptions = data.calendars.map(cal =>
            `<option value="${cal.id}">${cal.name}</option>`
        ).join('');
        importSelect.innerHTML = calendarOptions;
        eventSelect.innerHTML = calendarOptions;
        importSelect.disabled = false;
        eventSelect.disabled = false;
    }
}

function calendarAddCalendar() {
    const modal = document.getElementById('calendarManageModal');
    const toolId = modal.dataset.toolId;
    const nameInput = document.getElementById('calendarAddName');
    const colorEl = document.querySelector('.calendar-color-option.selected');

    const name = nameInput.value.trim();
    if (!name) {
        nameInput.focus();
        return;
    }

    const color = colorEl ? colorEl.dataset.color : CALENDAR_COLORS[0];
    const data = calendarGetData(toolId);

    const newCal = {
        id: 'cal_' + Date.now(),
        name: name,
        color: color
    };

    data.calendars.push(newCal);
    calendarSaveData(toolId, data);

    nameInput.value = '';
    calendarRenderManageList(data);

    // Re-render calendar
    const widget = document.querySelector(`.tool[data-tool="${toolId}"] .calendar-widget`);
    if (widget) {
        const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
        calendarRender(widget, toolId, year);
    }
}

function calendarAddEvent() {
    const modal = document.getElementById('calendarManageModal');
    const toolId = modal.dataset.toolId;

    const titleInput = document.getElementById('calendarEventTitle');
    const startInput = document.getElementById('calendarEventStart');
    const endInput = document.getElementById('calendarEventEnd');
    const calendarSelect = document.getElementById('calendarEventCalendar');

    const title = titleInput.value.trim();
    const startDate = startInput.value;
    const endDate = endInput.value || startDate;
    const calendarId = calendarSelect.value;

    if (!title) {
        titleInput.focus();
        return;
    }

    if (!startDate) {
        startInput.focus();
        return;
    }

    if (!calendarId) {
        alert('Please create a calendar first.');
        return;
    }

    const data = calendarGetData(toolId);

    const newEvent = {
        uid: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        calendarId: calendarId,
        summary: title,
        startDate: startDate,
        endDate: endDate
    };

    data.events.push(newEvent);
    calendarSaveData(toolId, data);

    // Clear inputs
    titleInput.value = '';
    startInput.value = '';
    endInput.value = '';

    calendarRenderManageList(data);

    // Re-render calendar
    const widget = document.querySelector(`.tool[data-tool="${toolId}"] .calendar-widget`);
    if (widget) {
        const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
        calendarRender(widget, toolId, year);
    }
}

function calendarAddEventFromDay(btn) {
    const tooltip = btn.closest('.calendar-day-tooltip');
    const toolId = tooltip.dataset.toolId;
    const dateStr = tooltip.dataset.date;

    const titleInput = tooltip.querySelector('.calendar-day-add-input');
    const calendarSelect = tooltip.querySelector('.calendar-day-add-select');

    const title = titleInput.value.trim();
    const calendarId = calendarSelect.value;

    if (!title) {
        titleInput.focus();
        return;
    }

    const data = calendarGetData(toolId);

    const newEvent = {
        uid: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        calendarId: calendarId,
        summary: title,
        startDate: dateStr,
        endDate: dateStr
    };

    data.events.push(newEvent);
    calendarSaveData(toolId, data);

    // Close tooltip
    tooltip.remove();

    // Re-render calendar
    const widget = document.querySelector(`.tool[data-tool="${toolId}"] .calendar-widget`);
    if (widget) {
        const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
        calendarRender(widget, toolId, year);
    }
}

function calendarDeleteEvent(eventUid) {
    const tooltip = document.querySelector('.calendar-day-tooltip');
    if (!tooltip) return;

    const toolId = tooltip.dataset.toolId;
    const dateStr = tooltip.dataset.date;
    const data = calendarGetData(toolId);

    data.events = data.events.filter(e => e.uid !== eventUid);
    calendarSaveData(toolId, data);

    // Close tooltip
    tooltip.remove();

    // Re-render calendar
    const widget = document.querySelector(`.tool[data-tool="${toolId}"] .calendar-widget`);
    if (widget) {
        const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
        calendarRender(widget, toolId, year);
    }
}

function calendarRemoveCalendar(calId) {
    const modal = document.getElementById('calendarManageModal');
    const toolId = modal.dataset.toolId;
    const data = calendarGetData(toolId);

    data.calendars = data.calendars.filter(c => c.id !== calId);
    data.events = data.events.filter(e => e.calendarId !== calId);
    if (data.subscriptions) data.subscriptions = data.subscriptions.filter(s => s.calendarId !== calId);
    calendarSaveData(toolId, data);

    calendarRenderManageList(data);

    // Re-render calendar
    const widget = document.querySelector(`.tool[data-tool="${toolId}"] .calendar-widget`);
    if (widget) {
        const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
        calendarRender(widget, toolId, year);
    }
}

function calendarHandleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const content = evt.target.result;
        calendarImportICS(content);
    };
    reader.readAsText(file);

    // Clear the input
    e.target.value = '';
}

async function calendarImportFromUrl() {
    const urlInput = document.getElementById('calendarImportUrl');
    const url = urlInput.value.trim();

    if (!url) {
        urlInput.focus();
        return;
    }

    // Validate URL
    try {
        new URL(url);
    } catch {
        alert('Please enter a valid URL.');
        return;
    }

    const select = document.getElementById('calendarImportSelect');
    if (!select.value) {
        alert('Please create a calendar first before importing events.');
        return;
    }

    // Show loading state
    const fetchBtn = document.querySelector('.calendar-import-section .calendar-add-btn');
    const originalText = fetchBtn.textContent;
    fetchBtn.textContent = 'Fetching...';
    fetchBtn.disabled = true;

    try {
        const content = await calendarFetchICS(url);

        const modal = document.getElementById('calendarManageModal');
        const toolId = modal.dataset.toolId;
        const calendarId = select.value;

        calendarImportICS(content);

        // Save the URL as a subscription for auto-refresh on load
        const data = calendarGetData(toolId);
        if (!data.subscriptions) data.subscriptions = [];
        const existing = data.subscriptions.find(s => s.url === url && s.calendarId === calendarId);
        if (!existing) {
            data.subscriptions.push({ url, calendarId });
            calendarSaveData(toolId, data);
        }

        urlInput.value = '';
    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            alert('Could not fetch the URL. This may be due to CORS restrictions. Try downloading the .ics file and importing it manually.');
        } else {
            alert('Error fetching calendar: ' + error.message);
        }
    } finally {
        fetchBtn.textContent = originalText;
        fetchBtn.disabled = false;
    }
}

function calendarImportICS(content) {
    const modal = document.getElementById('calendarManageModal');
    const toolId = modal.dataset.toolId;
    const select = document.getElementById('calendarImportSelect');
    const calendarId = select.value;

    if (!calendarId) {
        alert('Please create a calendar first before importing events.');
        return;
    }

    const events = parseICSContent(content, calendarId);

    if (events.length === 0) {
        alert('No events found in the ICS file.');
        return;
    }

    const data = calendarGetData(toolId);

    // Add events (avoiding duplicates by UID)
    const existingUids = new Set(data.events.map(e => e.uid));
    let added = 0;

    events.forEach(event => {
        if (!existingUids.has(event.uid)) {
            data.events.push(event);
            existingUids.add(event.uid);
            added++;
        }
    });

    calendarSaveData(toolId, data);
    calendarRenderManageList(data);

    // Re-render calendar
    const widget = document.querySelector(`.tool[data-tool="${toolId}"] .calendar-widget`);
    if (widget) {
        const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
        calendarRender(widget, toolId, year);
    }

    alert(`Imported ${added} event(s).`);
}

function parseICSContent(text, calendarId) {
    const events = [];
    const lines = text.replace(/\r\n /g, '').replace(/\r/g, '\n').split('\n');

    let inEvent = false;
    let currentEvent = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === 'BEGIN:VEVENT') {
            inEvent = true;
            currentEvent = { calendarId };
        } else if (line === 'END:VEVENT') {
            if (currentEvent.startDate && currentEvent.summary) {
                if (!currentEvent.uid) {
                    currentEvent.uid = 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                }
                if (!currentEvent.endDate) {
                    currentEvent.endDate = currentEvent.startDate;
                }
                events.push(currentEvent);
            }
            inEvent = false;
            currentEvent = {};
        } else if (inEvent) {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) continue;

            let key = line.substring(0, colonIndex);
            const value = line.substring(colonIndex + 1);

            // Handle parameters in key (e.g., DTSTART;VALUE=DATE:20240101)
            const semiIndex = key.indexOf(';');
            if (semiIndex !== -1) {
                key = key.substring(0, semiIndex);
            }

            switch (key) {
                case 'UID':
                    currentEvent.uid = value;
                    break;
                case 'SUMMARY':
                    currentEvent.summary = value.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/g, '\n');
                    break;
                case 'DTSTART':
                    currentEvent.startDate = parseICSDate(value);
                    break;
                case 'DTEND':
                    // ICS end dates are exclusive for all-day events
                    // If date-only (length 8), subtract one day
                    const cleanedEnd = value.replace('Z', '');
                    if (cleanedEnd.length === 8) {
                        const d = new Date(
                            parseInt(cleanedEnd.substring(0, 4)),
                            parseInt(cleanedEnd.substring(4, 6)) - 1,
                            parseInt(cleanedEnd.substring(6, 8))
                        );
                        d.setDate(d.getDate() - 1);
                        currentEvent.endDate = d.toISOString().split('T')[0];
                    } else {
                        currentEvent.endDate = parseICSDate(value);
                    }
                    break;
                case 'RRULE':
                    // Basic recurring event support - expand first year of occurrences
                    currentEvent.rrule = value;
                    break;
            }
        }
    }

    // Expand recurring events for current year
    const expandedEvents = [];
    events.forEach(event => {
        if (event.rrule) {
            const expanded = expandRRULE(event);
            expandedEvents.push(...expanded);
        } else {
            expandedEvents.push(event);
        }
    });

    return expandedEvents;
}

function parseICSDate(value) {
    // Handle formats: 20240115, 20240115T103000, 20240115T103000Z
    const cleaned = value.replace('Z', '');

    if (cleaned.length === 8) {
        // Date only: YYYYMMDD
        return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 6)}-${cleaned.substring(6, 8)}`;
    } else if (cleaned.length >= 15) {
        // DateTime: YYYYMMDDTHHMMSS
        return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 6)}-${cleaned.substring(6, 8)}T${cleaned.substring(9, 11)}:${cleaned.substring(11, 13)}:${cleaned.substring(13, 15)}`;
    }

    return value;
}

function expandRRULE(event) {
    const events = [event];
    const rrule = event.rrule;

    // Parse RRULE components
    const parts = {};
    rrule.split(';').forEach(part => {
        const [key, val] = part.split('=');
        parts[key] = val;
    });

    if (!parts.FREQ) return events;

    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
    const duration = endDate - startDate;

    const count = parts.COUNT ? parseInt(parts.COUNT) : 52; // Default to 1 year of weekly events
    const interval = parts.INTERVAL ? parseInt(parts.INTERVAL) : 1;

    let until = parts.UNTIL ? new Date(parseICSDate(parts.UNTIL)) : null;
    if (!until) {
        until = new Date(startDate);
        until.setFullYear(until.getFullYear() + 1);
    }

    let currentDate = new Date(startDate);
    let occurrences = 1;

    while (occurrences < count && currentDate < until) {
        // Advance to next occurrence
        switch (parts.FREQ) {
            case 'DAILY':
                currentDate.setDate(currentDate.getDate() + interval);
                break;
            case 'WEEKLY':
                currentDate.setDate(currentDate.getDate() + (7 * interval));
                break;
            case 'MONTHLY':
                currentDate.setMonth(currentDate.getMonth() + interval);
                break;
            case 'YEARLY':
                currentDate.setFullYear(currentDate.getFullYear() + interval);
                break;
            default:
                return events;
        }

        if (currentDate > until) break;

        const newEndDate = new Date(currentDate.getTime() + duration);
        events.push({
            ...event,
            uid: event.uid + '_' + occurrences,
            startDate: currentDate.toISOString().split('T')[0],
            endDate: newEndDate.toISOString().split('T')[0],
            rrule: undefined
        });

        occurrences++;
    }

    return events;
}
// Random Picker
const PICKER_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#e91e63', '#00bcd4'];

function pickerGetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function pickerGetData(toolId) {
    const custom = toolCustomizations[toolId] || {};
    return custom.pickerItems || [];
}

function pickerSaveData(toolId, items) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].pickerItems = items;
    saveToolCustomizations(toolCustomizations);
}

function pickerInit() {
    document.querySelectorAll('.picker-widget').forEach(widget => {
        const toolId = pickerGetToolId(widget);
        if (toolId) {
            pickerRender(widget, toolId);
        }
    });
}

function pickerRender(widget, toolId) {
    const items = pickerGetData(toolId);
    const chipsEl = widget.querySelector('.picker-items');
    const spinBtn = widget.querySelector('.picker-spin-btn');

    // Render chips
    chipsEl.innerHTML = items.map((item, idx) =>
        `<span class="picker-chip">
            <span class="picker-dot" style="background:${PICKER_COLORS[idx % PICKER_COLORS.length]}"></span>
            ${escapeHtml(item)}
            <button class="picker-remove" onclick="pickerRemoveItem(this,${idx})">×</button>
        </span>`
    ).join('');

    // Draw wheel
    pickerDrawWheel(widget, items);

    // Enable/disable spin
    spinBtn.disabled = items.length < 2;
}

function pickerAddItem(btn) {
    const widget = btn.closest('.picker-widget');
    const input = widget.querySelector('.picker-input');
    const toolId = pickerGetToolId(widget);

    if (!toolId || !input.value.trim()) return;

    const items = pickerGetData(toolId);
    items.push(input.value.trim());
    pickerSaveData(toolId, items);

    input.value = '';
    pickerRender(widget, toolId);
    input.focus();
}

function pickerRemoveItem(btn, idx) {
    const widget = btn.closest('.picker-widget');
    const toolId = pickerGetToolId(widget);
    if (!toolId) return;

    const items = pickerGetData(toolId);
    items.splice(idx, 1);
    pickerSaveData(toolId, items);
    pickerRender(widget, toolId);
}

function pickerSpin(btn) {
    const widget = btn.closest('.picker-widget');
    const toolId = pickerGetToolId(widget);
    if (!toolId) return;

    const items = pickerGetData(toolId);
    if (items.length < 2) return;

    const svg = widget.querySelector('.picker-wheel-svg');
    const resultEl = widget.querySelector('.picker-result');
    btn.disabled = true;

    // Pick random winner
    const winnerIdx = Math.floor(Math.random() * items.length);

    // Calculate target angle: segment center should land at top (under pointer)
    const segAngle = 360 / items.length;
    // Segments are drawn clockwise from top (12 o'clock).
    // Pointer is at top. We rotate clockwise, so the winner segment center
    // needs to end up at top. Segment i center is at i*segAngle + segAngle/2.
    // We need to rotate so that center comes to 360 (top).
    const targetAngle = 360 - (winnerIdx * segAngle + segAngle / 2);

    // Add multiple full rotations for effect
    const spins = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
    const totalRotation = spins * 360 + targetAngle;

    // Reset transition, set starting rotation to 0
    svg.style.transition = 'none';
    svg.style.transform = 'rotate(0deg)';

    // Force reflow
    svg.offsetHeight;

    // Apply spin
    svg.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    svg.style.transform = `rotate(${totalRotation}deg)`;

    resultEl.textContent = '';
    resultEl.classList.remove('highlight');

    setTimeout(() => {
        resultEl.textContent = items[winnerIdx];
        resultEl.classList.add('highlight');
        btn.disabled = false;

        // Normalize rotation for next spin
        svg.style.transition = 'none';
        svg.style.transform = `rotate(${targetAngle}deg)`;
    }, 4100);
}

function pickerDrawWheel(widget, items) {
    const svg = widget.querySelector('.picker-wheel-svg');
    if (!svg) return;

    const cx = 130, cy = 130, r = 120;

    if (items.length === 0) {
        svg.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--bg-tertiary, #eee)" stroke="var(--border-color)" stroke-width="2"/>
            <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" fill="var(--text-muted)" font-size="14">Add options above</text>`;
        return;
    }

    if (items.length === 1) {
        svg.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PICKER_COLORS[0]}" stroke="white" stroke-width="2"/>
            <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="14" font-weight="600">${escapeHtml(items[0])}</text>`;
        return;
    }

    const segAngle = (2 * Math.PI) / items.length;
    let html = '';

    for (let i = 0; i < items.length; i++) {
        // Start from top (12 o'clock = -90deg)
        const startAngle = i * segAngle - Math.PI / 2;
        const endAngle = (i + 1) * segAngle - Math.PI / 2;

        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);

        const largeArc = segAngle > Math.PI ? 1 : 0;
        const color = PICKER_COLORS[i % PICKER_COLORS.length];

        html += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z" fill="${color}" stroke="white" stroke-width="2"/>`;

        // Label at midpoint of segment
        const midAngle = startAngle + segAngle / 2;
        const labelR = r * 0.65;
        const lx = cx + labelR * Math.cos(midAngle);
        const ly = cy + labelR * Math.sin(midAngle);

        // Rotate text to align with segment
        const textAngle = (midAngle * 180) / Math.PI + 90;

        // Truncate long labels
        const label = items[i].length > 12 ? items[i].slice(0, 11) + '…' : items[i];

        html += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="${items.length > 8 ? 10 : 12}" font-weight="600" transform="rotate(${textAngle},${lx},${ly})">${escapeHtml(label)}</text>`;
    }

    // Center circle
    html += `<circle cx="${cx}" cy="${cy}" r="18" fill="white" stroke="var(--border-color)" stroke-width="2"/>`;
    html += `<circle cx="${cx}" cy="${cy}" r="6" fill="#333"/>`;

    svg.innerHTML = html;

    // Reset rotation
    svg.style.transition = 'none';
    svg.style.transform = 'rotate(0deg)';
}
// ============================================================
// Stopwatch Widget
// ============================================================
const swInstances = new Map();

function swGetWidget(el) {
    return el.closest('.stopwatch-widget');
}

function swGetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function swGetState(toolId) {
    if (!swInstances.has(toolId)) {
        swInstances.set(toolId, { running: false, elapsed: 0, startTime: 0, timer: null, laps: [] });
    }
    return swInstances.get(toolId);
}

function swFormatTime(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    const ms3 = String(millis).padStart(3, '0');
    return { main: `${hh}:${mm}:${ss}`, ms: `.${ms3}` };
}

function swUpdateDisplay(widget, ms) {
    const display = widget.querySelector('.sw-display');
    const t = swFormatTime(ms);
    display.innerHTML = `${t.main}<span class="sw-ms">${t.ms}</span>`;
}

function swTick(toolId, widget) {
    const state = swGetState(toolId);
    if (!state.running) return;
    state.elapsed = Date.now() - state.startTime;
    swUpdateDisplay(widget, state.elapsed);
    state.timer = requestAnimationFrame(() => swTick(toolId, widget));
}

function swToggle(btn) {
    const widget = swGetWidget(btn);
    const toolId = swGetToolId(btn);
    const state = swGetState(toolId);
    const lapBtn = widget.querySelector('.sw-lap');
    const resetBtn = widget.querySelector('.sw-reset');

    if (state.running) {
        // Stop
        state.running = false;
        cancelAnimationFrame(state.timer);
        state.elapsed = Date.now() - state.startTime;
        btn.textContent = 'Start';
        btn.classList.remove('running');
        lapBtn.disabled = true;
        resetBtn.disabled = false;
    } else {
        // Start
        state.startTime = Date.now() - state.elapsed;
        state.running = true;
        btn.textContent = 'Stop';
        btn.classList.add('running');
        lapBtn.disabled = false;
        resetBtn.disabled = true;
        swTick(toolId, widget);
    }
}

function swLap(btn) {
    const widget = swGetWidget(btn);
    const toolId = swGetToolId(btn);
    const state = swGetState(toolId);
    if (!state.running) return;

    const lapTime = state.elapsed;
    const prevTotal = state.laps.length > 0 ? state.laps[state.laps.length - 1].total : 0;
    const split = lapTime - prevTotal;
    state.laps.push({ total: lapTime, split: split });
    swRenderLaps(widget, state);
}

function swReset(btn) {
    const widget = swGetWidget(btn);
    const toolId = swGetToolId(btn);
    const state = swGetState(toolId);

    state.running = false;
    cancelAnimationFrame(state.timer);
    state.elapsed = 0;
    state.laps = [];

    swUpdateDisplay(widget, 0);
    widget.querySelector('.sw-laps').innerHTML = '';
    const startBtn = widget.querySelector('.sw-start');
    startBtn.textContent = 'Start';
    startBtn.classList.remove('running');
    widget.querySelector('.sw-lap').disabled = true;
    btn.disabled = true;
}

function swRenderLaps(widget, state) {
    const container = widget.querySelector('.sw-laps');
    if (state.laps.length === 0) { container.innerHTML = ''; return; }

    const splits = state.laps.map(l => l.split);
    const bestSplit = Math.min(...splits);
    const worstSplit = Math.max(...splits);
    const showBestWorst = state.laps.length >= 3;

    let html = '<table><thead><tr><th>#</th><th>Lap</th><th>Total</th></tr></thead><tbody>';
    for (let i = state.laps.length - 1; i >= 0; i--) {
        const lap = state.laps[i];
        const splitT = swFormatTime(lap.split);
        const totalT = swFormatTime(lap.total);
        let cls = '';
        if (showBestWorst && lap.split === bestSplit) cls = 'sw-lap-best';
        else if (showBestWorst && lap.split === worstSplit) cls = 'sw-lap-worst';
        html += `<tr class="${cls}"><td>${i + 1}</td><td>${splitT.main}<span class="sw-ms">${splitT.ms}</span></td><td>${totalT.main}<span class="sw-ms">${totalT.ms}</span></td></tr>`;
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

function stopwatchInit() {
    document.querySelectorAll('.stopwatch-widget').forEach(widget => {
        const toolId = swGetToolId(widget);
        if (toolId) swUpdateDisplay(widget, 0);
    });
}

// ============================================================
// Dice Roller Widget
// ============================================================

const dicePipLayouts = {
    1: ['mc'],
    2: ['tl', 'br'],
    3: ['tl', 'mc', 'br'],
    4: ['tl', 'tr', 'bl', 'br'],
    5: ['tl', 'tr', 'mc', 'bl', 'br'],
    6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br']
};

function diceGetWidget(el) {
    return el.closest('.dice-widget');
}

function diceGetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function diceRenderFace(value) {
    const pips = (dicePipLayouts[value] || []).map(p => `<span class="pip pip-${p}"></span>`).join('');
    return pips;
}

function diceChangeCount(btn, delta) {
    const widget = diceGetWidget(btn);
    const valueEl = widget.querySelector('.dice-count-value');
    let count = parseInt(valueEl.textContent) || 1;
    count = Math.max(1, Math.min(6, count + delta));
    valueEl.textContent = count;

    // Update tray preview with empty dice
    const tray = widget.querySelector('.dice-tray');
    tray.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const die = document.createElement('div');
        die.className = 'dice-die';
        tray.appendChild(die);
    }
    widget.querySelector('.dice-total').textContent = '';
}

function diceRoll(btn) {
    const widget = diceGetWidget(btn);
    const count = parseInt(widget.querySelector('.dice-count-value').textContent) || 1;
    const tray = widget.querySelector('.dice-tray');
    const totalEl = widget.querySelector('.dice-total');

    // Clear tray and build dice with staggered animation
    tray.innerHTML = '';
    const results = [];
    const animDuration = 400;

    for (let i = 0; i < count; i++) {
        const value = Math.floor(Math.random() * 6) + 1;
        results.push(value);

        const die = document.createElement('div');
        die.className = 'dice-die rolling';
        die.style.animationDelay = (i * 80) + 'ms';
        tray.appendChild(die);

        // After animation, show pips
        setTimeout(() => {
            die.classList.remove('rolling');
            die.innerHTML = diceRenderFace(value);
        }, animDuration + i * 80);
    }

    // Show total after all animations
    totalEl.textContent = '';
    setTimeout(() => {
        const total = results.reduce((a, b) => a + b, 0);
        if (count > 1) {
            totalEl.textContent = 'Total: ' + total;
        }
        // Add to history
        diceAddHistory(widget, results, total);
    }, animDuration + count * 80);
}

function diceAddHistory(widget, results, total) {
    const history = widget.querySelector('.dice-history');
    const entry = document.createElement('div');
    entry.className = 'dice-history-entry';
    const valuesStr = results.join(', ');
    entry.innerHTML = `<span class="dice-hist-values">${results.length}d6: [${valuesStr}]</span><span class="dice-hist-total">= ${total}</span>`;
    history.insertBefore(entry, history.firstChild);

    // Keep max 20 entries
    while (history.children.length > 20) {
        history.removeChild(history.lastChild);
    }
}

function diceRollerInit() {
    document.querySelectorAll('.dice-widget').forEach(widget => {
        const count = parseInt(widget.querySelector('.dice-count-value').textContent) || 1;
        const tray = widget.querySelector('.dice-tray');
        tray.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const die = document.createElement('div');
            die.className = 'dice-die';
            tray.appendChild(die);
        }
    });
}
// ============================================================
// YouTube Embed Widget
// ============================================================

function ytembedGetWidget(el) {
    return el.closest('.ytembed-widget');
}

function ytembedGetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function ytembedExtractId(url) {
    url = url.trim();
    // youtu.be/VIDEO_ID
    let m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (m) return { videoId: m[1], timestamp: ytembedParseTimestamp(url) };
    // youtube.com/watch?v=VIDEO_ID
    m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (m) return { videoId: m[1], timestamp: ytembedParseTimestamp(url) };
    // youtube.com/embed/VIDEO_ID
    m = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) return { videoId: m[1], timestamp: ytembedParseTimestamp(url) };
    // youtube.com/shorts/VIDEO_ID
    m = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (m) return { videoId: m[1], timestamp: 0 };
    // youtube.com/live/VIDEO_ID
    m = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
    if (m) return { videoId: m[1], timestamp: 0 };
    // bare video ID (11 chars)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return { videoId: url, timestamp: 0 };
    return null;
}

function ytembedParseTimestamp(url) {
    // ?t=123 or &t=123 (seconds)
    const m = url.match(/[?&]t=(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
}

function ytembedLoad(btn) {
    const widget = ytembedGetWidget(btn);
    const input = widget.querySelector('.ytembed-input');
    const player = widget.querySelector('.ytembed-player');
    const url = input.value.trim();

    if (!url) {
        player.innerHTML = '<div class="ytembed-placeholder">Paste a YouTube URL above</div>';
        ytembedSaveState(widget, '');
        return;
    }

    const parsed = ytembedExtractId(url);
    if (!parsed) {
        player.innerHTML = '<div class="ytembed-error">Could not parse YouTube URL</div>';
        return;
    }

    const src = 'https://www.youtube-nocookie.com/embed/' + parsed.videoId +
        '?rel=0' + (parsed.timestamp ? '&start=' + parsed.timestamp : '');
    player.innerHTML = '<iframe src="' + src + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    ytembedSaveState(widget, url);
}

function ytembedSaveState(widget, url) {
    const toolId = ytembedGetToolId(widget);
    if (!toolId) return;
    const custom = toolCustomizations[toolId] || {};
    custom.ytembedUrl = url;
    toolCustomizations[toolId] = custom;
    saveToolCustomizations(toolCustomizations);
}

function ytembedInit() {
    document.querySelectorAll('.ytembed-widget').forEach(widget => {
        const toolId = ytembedGetToolId(widget);
        if (!toolId) return;
        const custom = toolCustomizations[toolId] || {};
        const savedUrl = custom.ytembedUrl || '';
        const input = widget.querySelector('.ytembed-input');
        const player = widget.querySelector('.ytembed-player');

        if (savedUrl) {
            input.value = savedUrl;
            const parsed = ytembedExtractId(savedUrl);
            if (parsed) {
                const src = 'https://www.youtube-nocookie.com/embed/' + parsed.videoId +
                    '?rel=0' + (parsed.timestamp ? '&start=' + parsed.timestamp : '');
                player.innerHTML = '<iframe src="' + src + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            }
        } else {
            player.innerHTML = '<div class="ytembed-placeholder">Paste a YouTube URL above</div>';
        }

        // Allow Enter key to load
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                ytembedLoad(widget.querySelector('.ytembed-load-btn'));
            }
        });
    });
}

// =============================================
// SCRIPT INJECTION FOR HTML EXPORT
// =============================================

(function injectScriptsForExport() {
    if (document.getElementById('productivity-tools-scripts')) return;

    var pomoFunctions = [initPomodoro, getModeLabel, getModeClass, getDurationForMode, playPomodoroBeep, advancePomodoroMode, togglePomodoro, resetPomodoro, skipPomodoro, togglePomodoroSettings, applyPomodoroSettings, updatePomodoroDisplay];
    var ucFunctions = [ucGetToolId, ucGetData, ucSaveData, ucInit, ucRenderCategories, ucRenderSelects, ucSetCategory, ucOnInput, ucOnUnitChange, ucSwap, ucConvertTemp, ucFormatNumber, ucConvert];
    var pbsFunctions = [pbsSpeedLabel, pbsToFraction, pbsFmtDuration, pbsGetTotalSeconds, pbsGetSpeed, pbsCalc, pbsSetSpeed, pbsRangeChanged, pbsInit];
    var calendarFunctions = [calendarGetToolId, calendarGetData, calendarSaveData, calendarInit, calendarFetchICS, calendarRefreshSubscriptions, calendarRender, calendarRenderMonth, calendarGetEventsForDate, calendarCountByType, calendarCountTotal, calendarSaveViewState, calendarPrevYear, calendarNextYear, calendarSetView, calendarPrevMonth, calendarNextMonth, calendarGoToMonth, calendarGoToToday, calendarRenderMonthView, calendarShowDayEvents, calendarOpenManage, calendarCloseManage, calendarSelectColor, calendarRenderManageList, calendarAddCalendar, calendarAddEvent, calendarAddEventFromDay, calendarDeleteEvent, calendarRemoveCalendar, calendarHandleFileImport, calendarImportFromUrl, calendarImportICS, parseICSContent, parseICSDate, expandRRULE];
    var pickerFunctions = [pickerGetToolId, pickerGetData, pickerSaveData, pickerInit, pickerRender, pickerAddItem, pickerRemoveItem, pickerSpin, pickerDrawWheel];
    var diceFunctions = [diceGetWidget, diceGetToolId, diceRenderFace, diceChangeCount, diceRoll, diceAddHistory, diceRollerInit];
    var swFunctions = [swGetWidget, swGetToolId, swGetState, swFormatTime, swUpdateDisplay, swTick, swToggle, swLap, swReset, swRenderLaps, stopwatchInit];
    var ytFunctions = [ytembedGetWidget, ytembedGetToolId, ytembedExtractId, ytembedParseTimestamp, ytembedLoad, ytembedSaveState, ytembedInit];
    var allFunctions = pomoFunctions.concat(ucFunctions).concat(pbsFunctions).concat(calendarFunctions).concat(pickerFunctions).concat(diceFunctions).concat(swFunctions).concat(ytFunctions);

    var code = '(function() {\n' +
        'if (typeof initPomodoro !== "undefined") return;\n' +
        'window.pomodoroState = ' + JSON.stringify(pomodoroState) + ';\n' +
        'window.POMO_RING_CIRCUMFERENCE = ' + POMO_RING_CIRCUMFERENCE + ';\n' +
        'window.UC_UNITS = ' + JSON.stringify(UC_UNITS) + ';\n' +
        'window.PBS_FRACTIONS = ' + JSON.stringify(PBS_FRACTIONS) + ';\n' +
        'window.PBS_PRESETS = ' + JSON.stringify(PBS_PRESETS) + ';\n' +
        'window.CALENDAR_COLORS = ' + JSON.stringify(CALENDAR_COLORS) + ';\n' +
        'window.MONTH_NAMES = ' + JSON.stringify(MONTH_NAMES) + ';\n' +
        'window.DAY_NAMES = ' + JSON.stringify(DAY_NAMES) + ';\n' +
        'window.PICKER_COLORS = ' + JSON.stringify(PICKER_COLORS) + ';\n' +
        'window.dicePipLayouts = ' + JSON.stringify(dicePipLayouts) + ';\n' +
        'window.swInstances = new Map();\n' +
        'if (typeof escapeHtml === "undefined") { window.escapeHtml = ' + escapeHtml.toString() + '; }\n' +
        allFunctions.map(function(fn) { return 'window.' + fn.name + ' = ' + fn.toString(); }).join(';\n') + ';\n' +
        '})();';
    var encoded = btoa(unescape(encodeURIComponent(code)));

    var script = document.createElement('script');
    script.id = 'productivity-tools-scripts';
    script.textContent = 'eval(decodeURIComponent(escape(atob("' + encoded + '"))))';
    (document.body || document.head).appendChild(script);
})();

// =============================================
// REGISTRATIONS
// =============================================

PluginRegistry.registerToolbox({
    id: 'productivity',
    name: 'Productivity',
    description: 'General productivity tools',
    icon: '\uD83D\uDCCB',
    color: '#9b59b6',
    version: '1.0.0',
    tools: ['calendar', 'dice-roller', 'playback-speed-calc', 'pomodoro-timer', 'random-picker', 'stopwatch', 'unit-converter', 'youtube-embed'],
    source: 'external'
});

// Pomodoro Timer
PluginRegistry.registerTool({
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    description: 'Focus timer with work/break cycles and progress tracking',
    icon: '\uD83C\uDF45',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['pomodoro', 'timer', 'focus', 'productivity', 'break', 'work'],
    title: 'Pomodoro Timer',
    content: '<div class="pomo-widget">' +
        '<div class="pomo-ring-container">' +
            '<svg class="pomo-ring-svg" viewBox="0 0 180 180">' +
                '<circle class="pomo-ring-bg" cx="90" cy="90" r="78"></circle>' +
                '<circle id="pomoRing" class="pomo-ring-fg work" cx="90" cy="90" r="78" stroke-dasharray="' + (2 * Math.PI * 78).toFixed(2) + '" stroke-dashoffset="0"></circle>' +
            '</svg>' +
            '<div class="pomo-time-display">' +
                '<div id="pomoTime" class="pomo-time">25:00</div>' +
                '<div id="pomoModeLabel" class="pomo-mode-label">Work</div>' +
            '</div>' +
        '</div>' +
        '<div class="pomo-controls">' +
            '<button id="pomoBtnToggle" class="pomo-btn primary paused" onclick="togglePomodoro()">Start</button>' +
            '<button class="pomo-btn" onclick="resetPomodoro()">Reset</button>' +
            '<button class="pomo-btn" onclick="skipPomodoro()">Skip</button>' +
        '</div>' +
        '<div id="pomoCount" class="pomo-count"><span class="pomo-count-icons">\u2014</span><br>Completed: 0</div>' +
        '<div class="pomo-settings-toggle" onclick="togglePomodoroSettings()">\u2699 Settings</div>' +
        '<div id="pomoSettings" class="pomo-settings">' +
            '<div class="pomo-settings-grid">' +
                '<div><label>Work (min)</label><input type="number" id="pomoWorkMin" value="25" min="1" max="99" onchange="applyPomodoroSettings()"></div>' +
                '<div><label>Short Break</label><input type="number" id="pomoShortMin" value="5" min="1" max="30" onchange="applyPomodoroSettings()"></div>' +
                '<div><label>Long Break</label><input type="number" id="pomoLongMin" value="15" min="1" max="60" onchange="applyPomodoroSettings()"></div>' +
            '</div>' +
        '</div>' +
    '</div>',
    onInit: 'initPomodoro',
    defaultWidth: 320,
    defaultHeight: 420,
    source: 'external'
});

// Unit Converter
PluginRegistry.registerTool({
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between units of length, weight, temperature, volume, area, speed, time, and data',
    icon: '🔄',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['unit', 'convert', 'length', 'weight', 'temperature', 'volume', 'area', 'speed', 'data'],
    title: 'Unit Converter',
    content: '<div class="uc-widget">' +
        '<div class="uc-category-bar"></div>' +
        '<div class="uc-converter">' +
            '<div class="uc-row">' +
                '<div class="uc-input-group">' +
                    '<label>From</label>' +
                    '<select class="uc-from-select" onchange="ucOnUnitChange(this, \'from\')"></select>' +
                '</div>' +
                '<button class="uc-swap-btn" onclick="ucSwap(this)" title="Swap units">⇄</button>' +
                '<div class="uc-input-group">' +
                    '<label>To</label>' +
                    '<select class="uc-to-select" onchange="ucOnUnitChange(this, \'to\')"></select>' +
                '</div>' +
            '</div>' +
            '<div class="uc-row">' +
                '<div class="uc-input-group">' +
                    '<label>Value</label>' +
                    '<input type="number" class="uc-value-input" placeholder="Enter value..." oninput="ucOnInput(this)">' +
                '</div>' +
                '<div class="uc-input-group">' +
                    '<label>Result</label>' +
                    '<input type="text" class="uc-result-input" readonly placeholder="—">' +
                '</div>' +
            '</div>' +
            '<div class="uc-formula">Enter a value to convert</div>' +
            '<div class="uc-common"></div>' +
        '</div>' +
    '</div>',
    onInit: 'ucInit',
    defaultWidth: 380,
    defaultHeight: 450,
    source: 'external'
});

// Playback Speed Calculator
PluginRegistry.registerTool({
    id: 'playback-speed-calc',
    name: 'Playback Speed Calculator',
    description: 'Calculate duration and time saved at different playback speeds',
    icon: '\u23E9',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['playback', 'speed', 'duration', 'video', 'audio', 'podcast', 'time', 'calculator'],
    title: 'Playback Speed Calculator',
    content: '<div class="pbs-widget">' +
        '<div class="pbs-input-row">' +
            '<div class="pbs-field"><label>Hours</label><input type="number" class="pbs-hours" value="1" min="0" max="999" oninput="pbsCalc(this)"></div>' +
            '<span class="pbs-colon">:</span>' +
            '<div class="pbs-field"><label>Minutes</label><input type="number" class="pbs-minutes" value="30" min="0" max="59" oninput="pbsCalc(this)"></div>' +
            '<span class="pbs-colon">:</span>' +
            '<div class="pbs-field"><label>Seconds</label><input type="number" class="pbs-seconds" value="0" min="0" max="59" oninput="pbsCalc(this)"></div>' +
        '</div>' +
        '<div class="pbs-total"></div>' +
        '<div class="pbs-speed-section">' +
            '<span class="pbs-speed-label">Speed</span>' +
            '<div class="pbs-presets"></div>' +
            '<div class="pbs-custom-row">' +
                '<label>Custom:</label>' +
                '<input type="range" class="pbs-range" min="0.125" max="8" step="0.025" value="1.25" oninput="pbsRangeChanged(this)">' +
                '<span class="pbs-speed-val">1\u00BCx</span>' +
            '</div>' +
        '</div>' +
        '<div class="pbs-results">' +
            '<div class="pbs-result-card">' +
                '<span class="pbs-result-label">Adjusted Duration</span>' +
                '<span class="pbs-result-value pbs-adjusted-dur">\u2014</span>' +
            '</div>' +
            '<div class="pbs-result-card">' +
                '<span class="pbs-result-label pbs-saved-label">Time Saved</span>' +
                '<span class="pbs-result-value pbs-time-saved">\u2014</span>' +
            '</div>' +
            '<div class="pbs-table-wrap">' +
                '<table class="pbs-table">' +
                    '<thead><tr><th>Speed</th><th>Duration</th><th>Saved</th></tr></thead>' +
                    '<tbody class="pbs-table-body"></tbody>' +
                '</table>' +
            '</div>' +
        '</div>' +
    '</div>',
    onInit: 'pbsInit',
    defaultWidth: 340,
    defaultHeight: 480,
    source: 'external'
});

// Calendar
PluginRegistry.registerTool({
    id: 'calendar',
    name: 'Calendar',
    description: 'Year view calendar with .ics import and event tracking',
    icon: '\uD83D\uDCC5',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['date', 'events', 'schedule', 'ics'],
    title: 'Calendar ' + new Date().getFullYear(),
    content: '<div class="calendar-widget">' +
        '<div class="calendar-header">' +
            '<div class="calendar-view-toggle">' +
                '<button class="calendar-view-btn active" onclick="calendarSetView(this, \'year\')">Year</button>' +
                '<button class="calendar-view-btn" onclick="calendarSetView(this, \'month\')">Month</button>' +
            '</div>' +
            '<div class="calendar-year-nav">' +
                '<button onclick="calendarPrevYear(this)">&lt;</button>' +
                '<span class="calendar-year-display">' + new Date().getFullYear() + '</span>' +
                '<button onclick="calendarNextYear(this)">&gt;</button>' +
            '</div>' +
            '<button class="calendar-manage-btn" onclick="calendarOpenManage(this)">Manage</button>' +
        '</div>' +
        '<div class="calendar-year-grid"></div>' +
        '<div class="calendar-month-view">' +
            '<div class="calendar-month-nav">' +
                '<button onclick="calendarPrevMonth(this)">&lt;</button>' +
                '<span class="calendar-month-title"></span>' +
                '<button onclick="calendarNextMonth(this)">&gt;</button>' +
                '<button class="calendar-today-btn" onclick="calendarGoToToday(this)">Today</button>' +
            '</div>' +
            '<div class="calendar-month-detail"></div>' +
        '</div>' +
        '<div class="calendar-legend"></div>' +
    '</div>',
    onInit: 'calendarInit',
    defaultWidth: 800,
    defaultHeight: 600,
    source: 'external'
});

// Random Picker
PluginRegistry.registerTool({
    id: 'random-picker',
    name: 'Random Picker',
    description: 'Spin the wheel to randomly pick from a list of options',
    icon: '\uD83C\uDFB2',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['random', 'picker', 'spin', 'wheel', 'choose', 'chores', 'games'],
    title: 'Random Picker',
    content: '<div class="picker-widget">' +
        '<div class="picker-input-row">' +
            '<input type="text" class="picker-input" placeholder="Add an option..." onkeydown="if(event.key===\'Enter\'){pickerAddItem(this.nextElementSibling);event.preventDefault();}">' +
            '<button onclick="pickerAddItem(this)">Add</button>' +
        '</div>' +
        '<div class="picker-items"></div>' +
        '<div class="picker-wheel-area">' +
            '<div class="picker-wheel-container">' +
                '<div class="picker-pointer"></div>' +
                '<svg class="picker-wheel-svg" viewBox="0 0 260 260"></svg>' +
            '</div>' +
            '<div class="picker-result"></div>' +
        '</div>' +
        '<button class="picker-spin-btn" onclick="pickerSpin(this)">Spin!</button>' +
    '</div>',
    onInit: 'pickerInit',
    defaultWidth: 320,
    defaultHeight: 520,
    source: 'external'
});

PluginRegistry.registerTool({
    id: 'dice-roller',
    name: 'Dice Roller',
    description: 'Roll 1-6 dice with animation for board games',
    icon: '\uD83C\uDFB2',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['dice', 'roll', 'board game', 'random', 'd6', 'game'],
    title: 'Dice Roller',
    content: '<div class="dice-widget">' +
        '<div class="dice-controls">' +
            '<label class="dice-count-label">Dice</label>' +
            '<div class="dice-count-row">' +
                '<button class="dice-count-btn" onclick="diceChangeCount(this,-1)">&#8722;</button>' +
                '<span class="dice-count-value">1</span>' +
                '<button class="dice-count-btn" onclick="diceChangeCount(this,1)">+</button>' +
            '</div>' +
        '</div>' +
        '<div class="dice-tray"></div>' +
        '<div class="dice-total-row"><span class="dice-total"></span></div>' +
        '<button class="dice-roll-btn" onclick="diceRoll(this)">Roll</button>' +
        '<div class="dice-history"></div>' +
    '</div>',
    onInit: 'diceRollerInit',
    defaultWidth: 290,
    defaultHeight: 380,
    source: 'external'
});

PluginRegistry.registerTool({
    id: 'stopwatch',
    name: 'Stopwatch',
    description: 'Stopwatch with lap times',
    icon: '\u23F1\uFE0F',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['timer', 'time', 'lap', 'clock'],
    title: 'Stopwatch',
    content: '<div class="stopwatch-widget">' +
        '<div class="sw-display">00:00:00<span class="sw-ms">.000</span></div>' +
        '<div class="sw-buttons">' +
            '<button class="sw-btn sw-start" onclick="swToggle(this)">Start</button>' +
            '<button class="sw-btn sw-lap" onclick="swLap(this)" disabled>Lap</button>' +
            '<button class="sw-btn sw-reset" onclick="swReset(this)" disabled>Reset</button>' +
        '</div>' +
        '<div class="sw-laps"></div>' +
    '</div>',
    onInit: 'stopwatchInit',
    defaultWidth: 290,
    defaultHeight: 380,
    source: 'external'
});

PluginRegistry.registerTool({
    id: 'youtube-embed',
    name: 'YouTube Embed',
    description: 'Embed YouTube videos by providing a URL',
    icon: '\u25B6\uFE0F',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['youtube', 'video', 'embed', 'watch', 'stream', 'media', 'player'],
    title: 'YouTube',
    content: '<div class="ytembed-widget">' +
        '<div class="ytembed-input-row">' +
            '<input type="text" class="ytembed-input" placeholder="Paste YouTube URL..." spellcheck="false">' +
            '<button class="ytembed-load-btn" onclick="ytembedLoad(this)">Load</button>' +
        '</div>' +
        '<div class="ytembed-player"></div>' +
    '</div>',
    onInit: 'ytembedInit',
    defaultWidth: 480,
    defaultHeight: 360,
    source: 'external'
});

console.log('Productivity Tools plugin loaded (8 tools)');
