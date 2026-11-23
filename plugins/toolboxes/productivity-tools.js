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
    cursor: pointer;
    user-select: none;
}

.calendar-legend-item:hover {
    opacity: 0.75;
}

.calendar-legend-item.hidden-cal .calendar-legend-dot {
    opacity: 0.25;
}

.calendar-legend-item.hidden-cal span {
    opacity: 0.35;
    text-decoration: line-through;
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
    flex-direction: column;
    gap: 0;
    padding: 6px 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    margin-bottom: 8px;
}

.cal-edit-row {
    display: flex;
    align-items: center;
    gap: 5px;
}

.cal-order-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 11px;
    padding: 1px 3px;
    line-height: 1;
    flex-shrink: 0;
}

.cal-order-btn:hover:not(:disabled) { color: var(--text-heading); }
.cal-order-btn:disabled { opacity: 0.25; cursor: default; }

.calendar-list-color {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
}

.calendar-list-color.cal-color-btn {
    cursor: pointer;
    width: 16px;
    height: 16px;
    transition: box-shadow 0.15s;
}

.calendar-list-color.cal-color-btn:hover {
    box-shadow: 0 0 0 2px var(--text-muted);
}

.cal-name-input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-heading);
    font-size: 13px;
    font-weight: 500;
    padding: 2px 4px;
    border-radius: 3px;
}

.cal-name-input:hover { border-color: var(--border-color); }
.cal-name-input:focus { border-color: var(--border-color); background: rgba(0,0,0,0.12); outline: none; }

.calendar-list-count {
    color: var(--text-muted);
    font-size: 11px;
    flex-shrink: 0;
}

.calendar-list-remove {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    font-size: 16px;
    padding: 2px 6px;
    flex-shrink: 0;
}

.calendar-list-remove:hover {
    background: rgba(231, 76, 60, 0.1);
    border-radius: 4px;
}

.cal-url-row { padding-top: 5px; }

.cal-url-input {
    width: 100%;
    background: rgba(0,0,0,0.12);
    border: 1px solid var(--border-color);
    color: var(--text-muted);
    font-size: 11px;
    padding: 3px 6px;
    border-radius: 3px;
    box-sizing: border-box;
}

.cal-url-input:focus { outline: none; color: var(--text-primary); }

.cal-color-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding-top: 7px;
    padding-bottom: 2px;
}

.cal-color-swatch {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    flex-shrink: 0;
    transition: transform 0.1s;
}

.cal-color-swatch:hover { transform: scale(1.2); }
.cal-color-swatch.selected { border-color: #fff; box-shadow: 0 0 0 1px rgba(0,0,0,0.35); }

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

.calendar-day-tooltip-time {
    font-size: 10px;
    color: var(--text-muted);
    white-space: nowrap;
    flex-shrink: 0;
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

/* Breathing Exercise Widget Styles */
.breathing-widget {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    gap: 10px;
}

.breathing-circle-container {
    position: relative;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.breathing-circle-svg {
    transform: rotate(-90deg);
    width: 200px;
    height: 200px;
}

.breathing-circle-bg {
    fill: none;
    stroke: var(--border-color);
    stroke-width: 6;
}

.breathing-circle-fg {
    fill: none;
    stroke-width: 6;
    stroke-linecap: round;
    stroke: var(--text-muted);
    transition: stroke-dashoffset 0.4s linear, stroke 0.5s;
}

.breathing-circle-fg.inhale { stroke: #3498db; }
.breathing-circle-fg.hold { stroke: #f39c12; }
.breathing-circle-fg.exhale { stroke: #27ae60; }

.breathing-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.breathing-label {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: color 0.5s;
}

.breathing-label.inhale { color: #3498db; }
.breathing-label.hold { color: #f39c12; }
.breathing-label.exhale { color: #27ae60; }

.breathing-timer {
    font-size: 36px;
    font-weight: 700;
    font-family: monospace;
    color: var(--text-primary);
    line-height: 1;
    margin-top: 4px;
}

.breathing-scale-wrap {
    transition: transform 1s ease-in-out;
}

.breathing-scale-wrap.inhale { transform: scale(1.15); }
.breathing-scale-wrap.hold { transform: scale(1.15); }
.breathing-scale-wrap.exhale { transform: scale(0.9); }

.breathing-controls {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.breathing-btn {
    padding: 8px 16px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    cursor: pointer;
    font-size: 13px;
    transition: background 0.15s, border-color 0.15s;
}

.breathing-btn:hover {
    background: var(--bg-primary);
    border-color: var(--text-muted);
}

.breathing-btn.primary {
    background: #3498db;
    color: white;
    border-color: #3498db;
}

.breathing-btn.primary:hover {
    background: #2980b9;
    border-color: #2980b9;
}

.breathing-btn.primary.running {
    background: #e67e22;
    border-color: #e67e22;
}

.breathing-btn.primary.running:hover {
    background: #d35400;
    border-color: #d35400;
}

.breathing-cycle-count {
    font-size: 12px;
    color: var(--text-muted);
    text-align: center;
}

.breathing-preset-row {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: center;
}

.breathing-preset {
    padding: 4px 10px;
    border: 1px solid var(--border-color);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    cursor: pointer;
    font-size: 11px;
    border-radius: 4px;
    font-family: monospace;
}

.breathing-preset:hover {
    background: var(--table-hover);
    border-color: #3498db;
}

.breathing-preset.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
}

.breathing-settings {
    width: 100%;
    box-sizing: border-box;
}

.breathing-settings-toggle {
    font-size: 11px;
    color: var(--text-muted);
    cursor: pointer;
    user-select: none;
    text-align: center;
}

.breathing-settings-toggle:hover {
    color: var(--text-secondary);
}

.breathing-settings-panel {
    display: none;
    background: var(--bg-secondary);
    border-radius: 4px;
    padding: 10px;
    margin-top: 6px;
}

.breathing-settings-panel.open {
    display: block;
}

.breathing-settings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
}

.breathing-settings-grid label {
    display: block;
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 3px;
    text-align: left;
}

.breathing-settings-grid input {
    width: 100%;
    padding: 6px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 13px;
    background: var(--input-bg);
    color: var(--text-primary);
    box-sizing: border-box;
    text-align: center;
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

/* Kanban Board Widget Styles */
.tool-content:has(.kb-widget) { display: flex; flex-direction: column; padding: 0; }
.kb-widget { display: flex; flex-direction: column; flex: 1; min-height: 0; font-size: 12px; }
.kb-toolbar { display: flex; align-items: center; gap: 6px; padding: 8px 10px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; flex-wrap: wrap; }
.kb-toolbar input { flex: 1; min-width: 80px; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); }
.kb-toolbar input:focus { outline: none; border-color: #3498db; }
.kb-toolbar button { padding: 5px 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; white-space: nowrap; }
.kb-toolbar button:hover { background: var(--table-hover); border-color: #3498db; }
.kb-board { display: flex; flex: 1; overflow-x: auto; overflow-y: hidden; gap: 8px; padding: 8px; min-height: 0; }
.kb-column { min-width: 200px; width: 200px; max-width: 280px; flex-shrink: 0; background: var(--bg-tertiary); border-radius: 6px; display: flex; flex-direction: column; max-height: 100%; border: 2px solid transparent; transition: border-color 0.15s; }
.kb-column.kb-col-drag-over { border-color: #3498db; }
.kb-col-header { display: flex; align-items: center; gap: 6px; padding: 8px 10px; flex-shrink: 0; cursor: grab; }
.kb-col-header:active { cursor: grabbing; }
.kb-col-title { font-weight: 600; font-size: 12px; color: var(--text-heading); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-col-title-input { flex: 1; min-width: 0; padding: 2px 4px; border: 1px solid #3498db; border-radius: 3px; font-size: 12px; font-weight: 600; background: var(--input-bg); color: var(--text-primary); outline: none; }
.kb-col-count { font-size: 10px; color: var(--text-muted); background: var(--bg-secondary); border-radius: 10px; padding: 1px 7px; flex-shrink: 0; }
.kb-col-menu { opacity: 0; font-size: 14px; cursor: pointer; color: var(--text-muted); padding: 0 2px; flex-shrink: 0; transition: opacity 0.15s; }
.kb-col-header:hover .kb-col-menu { opacity: 1; }
.kb-col-menu:hover { color: var(--text-primary); }
.kb-col-body { flex: 1; overflow-y: auto; padding: 0 6px 6px; display: flex; flex-direction: column; gap: 4px; min-height: 40px; }
.kb-card { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 4px; padding: 8px 10px; cursor: grab; transition: box-shadow 0.15s, opacity 0.15s, border-color 0.15s; position: relative; }
.kb-card:hover { box-shadow: 0 1px 4px var(--shadow-light); }
.kb-card:active { cursor: grabbing; }
.kb-card.kb-card-dragging { opacity: 0.4; }
.kb-card.kb-card-drag-over { border-color: #3498db; border-style: dashed; }
.kb-card-title { font-size: 12px; color: var(--text-primary); word-break: break-word; line-height: 1.4; }
.kb-card-desc { font-size: 11px; color: var(--text-muted); margin-top: 4px; word-break: break-word; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.kb-card-tags { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 5px; }
.kb-card-tag { font-size: 9px; padding: 1px 6px; border-radius: 3px; font-weight: 600; color: white; }
.kb-card-actions { position: absolute; top: 4px; right: 4px; display: none; gap: 2px; }
.kb-card:hover .kb-card-actions { display: flex; }
.kb-card-action { width: 20px; height: 20px; border: none; background: var(--bg-tertiary); color: var(--text-muted); border-radius: 3px; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; }
.kb-card-action:hover { background: var(--bg-secondary); color: var(--text-primary); }
.kb-add-card { padding: 6px 8px; font-size: 11px; color: var(--text-muted); cursor: pointer; border-radius: 4px; flex-shrink: 0; text-align: center; }
.kb-add-card:hover { background: var(--bg-secondary); color: var(--text-primary); }
.kb-add-form { padding: 6px; flex-shrink: 0; }
.kb-add-form textarea { width: 100%; padding: 6px 8px; border: 1px solid #3498db; border-radius: 4px; font-size: 12px; font-family: inherit; background: var(--input-bg); color: var(--text-primary); resize: none; outline: none; box-sizing: border-box; }
.kb-add-form-btns { display: flex; gap: 4px; margin-top: 4px; }
.kb-add-form-btns button { padding: 4px 10px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; cursor: pointer; }
.kb-add-form-btns .kb-add-confirm { background: #3498db; color: white; border-color: #3498db; }
.kb-add-form-btns .kb-add-confirm:hover { background: #2980b9; }
.kb-add-form-btns .kb-add-cancel { background: var(--bg-tertiary); color: var(--text-primary); }
.kb-add-form-btns .kb-add-cancel:hover { background: var(--table-hover); }
.kb-empty { display: flex; align-items: center; justify-content: center; flex: 1; color: var(--text-muted); font-style: italic; font-size: 12px; padding: 20px; text-align: center; }
.kb-edit-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10; border-radius: 6px; }
.kb-edit-modal { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; width: 90%; max-width: 340px; max-height: 90%; overflow-y: auto; box-shadow: 0 4px 20px var(--shadow-medium); }
.kb-edit-modal label { display: block; font-size: 11px; font-weight: 600; color: var(--text-heading); margin-bottom: 3px; margin-top: 10px; }
.kb-edit-modal label:first-child { margin-top: 0; }
.kb-edit-modal input, .kb-edit-modal textarea { width: 100%; padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; font-family: inherit; background: var(--input-bg); color: var(--text-primary); box-sizing: border-box; }
.kb-edit-modal input:focus, .kb-edit-modal textarea:focus { outline: none; border-color: #3498db; }
.kb-edit-modal textarea { resize: vertical; min-height: 60px; }
.kb-edit-btns { display: flex; gap: 6px; margin-top: 12px; justify-content: flex-end; }
.kb-edit-btns button { padding: 6px 14px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; cursor: pointer; }
.kb-edit-btns .kb-save-btn { background: #3498db; color: white; border-color: #3498db; }
.kb-edit-btns .kb-save-btn:hover { background: #2980b9; }
.kb-edit-btns .kb-del-btn { background: #e74c3c; color: white; border-color: #e74c3c; }
.kb-edit-btns .kb-del-btn:hover { background: #c0392b; }
.kb-edit-btns .kb-cancel-btn { background: var(--bg-tertiary); color: var(--text-primary); }
.kb-col-drop-placeholder { min-width: 200px; width: 200px; flex-shrink: 0; border: 2px dashed var(--border-color); border-radius: 6px; background: transparent; }

/* World Clock Widget */
.wc-widget { padding: 10px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; gap: 8px; }
.wc-toolbar { display: flex; gap: 6px; flex-shrink: 0; }
.wc-toolbar input { flex: 1; padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); font-family: inherit; }
.wc-toolbar input:focus { outline: none; border-color: #3498db; }
.wc-toolbar button { padding: 6px 12px; border: none; border-radius: 4px; background: #3498db; color: white; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; }
.wc-toolbar button:hover { background: #2980b9; }
.wc-list { flex: 1; overflow-y: auto; display: grid; grid-template-columns: 1fr auto auto auto auto; gap: 4px 0; }
.wc-row { display: grid; grid-template-columns: subgrid; grid-column: 1 / -1; align-items: center; padding: 8px 10px; background: var(--bg-secondary); border-radius: 6px; gap: 0 8px; }
.wc-city { font-size: 12px; font-weight: 600; color: var(--text-heading); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wc-time { font-family: 'Monaco', 'Menlo', 'Courier New', monospace; font-size: 16px; font-weight: bold; color: var(--text-primary); letter-spacing: 1px; text-align: right; white-space: nowrap; }
.wc-date { font-size: 10px; color: var(--text-muted); white-space: nowrap; text-align: right; }
.wc-offset { font-size: 10px; color: var(--text-muted); background: var(--bg-tertiary); padding: 2px 5px; border-radius: 3px; white-space: nowrap; text-align: center; }
.wc-remove { width: 20px; height: 20px; border: none; background: transparent; color: var(--text-muted); cursor: pointer; font-size: 14px; border-radius: 3px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 0; line-height: 1; }
.wc-remove:hover { background: var(--bg-tertiary); color: #e74c3c; }

/* Ambient Sound Generator Widget Styles */
.tool-content:has(.bnoise-widget) { display: flex; flex-direction: column; }
.bnoise-widget { padding: 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; min-height: 0; box-sizing: border-box; }
.bnoise-type-row { display: flex; gap: 5px; }
.bnoise-type-btn { flex: 1; padding: 5px 6px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-secondary); cursor: pointer; font-size: 11px; font-weight: 600; border-radius: 20px; transition: all 0.15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bnoise-type-btn:hover { background: var(--table-hover); color: var(--text-primary); }
.bnoise-type-btn.active { background: #8e44ad; color: #fff; border-color: #8e44ad; }
.bnoise-canvas { display: block; width: 100%; height: 76px; border-radius: 6px; background: #0d0517; }
.bnoise-controls { display: flex; align-items: center; gap: 10px; }
.bnoise-play-btn { width: 48px; height: 48px; border-radius: 50%; border: 2px solid #8e44ad; background: #8e44ad; color: #fff; font-size: 20px; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: background 0.15s, transform 0.1s; line-height: 1; padding: 0; }
.bnoise-play-btn:hover { background: #7d3c98; transform: scale(1.05); }
.bnoise-play-btn.playing { background: #2c3e50; border-color: #2c3e50; }
.bnoise-play-btn.playing:hover { background: #1a252f; }
.bnoise-vol-col { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
.bnoise-vol-label { font-size: 10px; font-weight: 600; color: var(--text-secondary); display: flex; justify-content: space-between; }
.bnoise-vol-slider { width: 100%; accent-color: #8e44ad; cursor: pointer; }
.bnoise-timer-row { display: flex; align-items: center; gap: 8px; }
.bnoise-timer-label { font-size: 11px; color: var(--text-secondary); flex-shrink: 0; }
.bnoise-timer-select { flex: 1; padding: 5px 6px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 11px; background: var(--input-bg); color: var(--text-primary); cursor: pointer; }
.bnoise-status { font-size: 11px; color: var(--text-muted); text-align: center; min-height: 16px; }
.bnoise-status.playing { color: #8e44ad; font-weight: 600; }

/* Recipe Widget Styles */
.tool-content:has(.rcp-widget) { display: flex; flex-direction: column; }
/* --rcp-accent tints the widget's own chrome (active mode button, focus ring).
   --rcp-border is the table rule colour, kept neutral so the recipe reads as a
   document rather than a branded widget.
   font-size is inherited, not fixed, so per-tool and per-board font settings reach
   the table instead of being overridden here. */
.rcp-widget { --rcp-accent: #2e7d32; --rcp-border: #4a4a4a; position: relative; font-size: inherit; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; }
body.dark-mode .rcp-widget { --rcp-accent: #5cb860; --rcp-border: #8b9096; }
/* The four mode buttons and the panes are the framework's now; what is left here
   is what the recipe itself looks like. rcpActions is lifted into the tool header
   by applyToolMode, so these buttons are styled to sit there. */
.rcp-actions { display: flex; align-items: center; gap: 4px; }
.rcp-btn { padding: 2px 7px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-secondary); cursor: pointer; font-size: 10px; border-radius: 3px; white-space: nowrap; }
.rcp-btn:hover { background: var(--table-hover); }
.rcp-edit-pane { flex: 1 1 50%; display: flex; flex-direction: column; min-width: 0; }
.rcp-widget textarea { flex: 1; resize: none; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); min-height: 100px; line-height: 1.5; tab-size: 4; white-space: pre; overflow-wrap: normal; overflow-x: auto; }
.rcp-widget textarea:focus { outline: none; border-color: var(--rcp-accent); }
.rcp-view-pane { flex: 1 1 50%; display: flex; flex-direction: column; min-width: 0; border: 1px solid var(--border-color); border-radius: 4px; background: transparent; overflow: auto; }
.tool.authoring-render .rcp-view-pane { border: none; border-radius: 0; }
.rcp-output { flex: 1; padding: 10px; overflow: auto; }
/* Natural width, never wider than the pane. A percentage width here would make the
   table stretch to fill any measuring container and break double-click auto-resize. */
.rcp-table { border-collapse: collapse; width: auto; max-width: 100%; background: transparent; table-layout: auto; font-size: inherit; }
/* The app zebra-stripes and hover-highlights every table. Both fight this layout,
   where a single operation cell spans rows that would otherwise alternate — so give
   the cells their own background and opt the rows out. */
.rcp-table tr:nth-child(even), .rcp-table tr:hover { background: transparent; }
.rcp-table td { border: 1px solid var(--rcp-border); padding: 5px 8px; color: inherit; vertical-align: middle; line-height: 1.35; background: transparent; }
.rcp-table td.rcp-title { text-align: center; font-weight: 700; font-size: 1.1em; }
.rcp-table td.rcp-prep { text-align: center; }
/* Ingredients take the slack; operation columns shrink to their text so long step
   descriptions wrap into a narrow column, as in the reference layout. */
.rcp-table td.rcp-ingredient { text-align: left; width: 99%; overflow-wrap: break-word; }
.rcp-table td.rcp-op { text-align: center; width: 1%; }
.rcp-table td.rcp-empty { border: 1px solid var(--rcp-border); }
.rcp-placeholder { color: var(--text-muted); font-size: 11px; padding: 12px; text-align: center; }
.rcp-error { color: #c0392b; font-size: 11px; padding: 12px; font-family: monospace; }
.rcp-help-text { font-size: 10px; color: var(--text-muted); padding: 8px 0; border-top: 1px solid var(--border-light); margin-top: 8px; flex-shrink: 0; }
.rcp-help-text code { background: var(--code-bg); padding: 1px 4px; border-radius: 3px; font-family: monospace; }
.rcp-help-modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--overlay-bg); z-index: 10015; justify-content: center; align-items: center; }
.rcp-help-modal.open { display: flex; }
.rcp-help-content { background: var(--bg-secondary); border-radius: 8px; padding: 20px; width: 90%; max-width: 560px; max-height: 80vh; overflow-y: auto; }
.rcp-help-content h3 { margin-bottom: 12px; color: var(--text-heading); }
.rcp-help-content pre { background: var(--code-bg); padding: 12px; border-radius: 4px; font-size: 11px; overflow-x: auto; margin: 10px 0; line-height: 1.45; }
.rcp-help-content p { margin: 8px 0; font-size: 12px; color: var(--text-secondary); }
.rcp-help-content code { background: var(--code-bg); padding: 1px 4px; border-radius: 3px; font-family: monospace; }
.rcp-help-close { float: right; font-size: 24px; cursor: pointer; color: var(--text-muted); line-height: 1; }
.rcp-help-close:hover { color: var(--text-heading); }

/* ---- Agenda Timer ---- */
.agt-widget { display: flex; flex-direction: column; gap: 8px; height: 100%; font-size: 12px; color: var(--text-primary); }
.agt-head, .agt-row { display: grid; grid-template-columns: 16px 1fr 64px 40px 22px 20px; gap: 6px; align-items: center; }
.agt-notes-btn { font-size: 13px; opacity: .35; filter: grayscale(1); }
.agt-notes-btn:hover, .agt-notes-btn[aria-expanded="true"] { opacity: .8; }
.agt-notes-btn.agt-has-notes { opacity: 1; filter: none; }
.agt-notes-box { grid-column: 2 / -1; }
.agt-notes-box[hidden] { display: none; }
.agt-notes {
    width: 100%; min-height: 54px; resize: vertical; padding: 5px 7px; font-family: inherit; font-size: 12px;
    line-height: 1.45; border: 1px solid var(--border-color); border-radius: 4px; background: var(--input-bg);
    color: var(--text-primary);
}
.agt-widget.agt-running .agt-run { height: 100%; }
.agt-run-notes {
    flex: 1 1 auto; min-height: 60px; overflow: auto; padding: 8px 10px; border: 1px solid var(--border-light);
    border-radius: 6px; background: var(--bg-secondary); font-size: 13px; line-height: 1.5;
}
.agt-run-notes > :first-child { margin-top: 0; }
.agt-run-notes > :last-child { margin-bottom: 0; }
.agt-run-notes li.agt-task { list-style: none; margin-left: -1.2em; }
.agt-run-notes li.agt-task input { margin-right: 6px; cursor: pointer; }
.agt-run-notes li.agt-task:has(input:checked) { color: var(--text-muted); text-decoration: line-through; }
.agt-short-text { color: #b9770e; font-weight: 600; }
.agt-notes-panel { position: relative; flex: 1 1 auto; min-height: 60px; display: flex; flex-direction: column; }
.agt-notes-panel .agt-run-notes { flex: 1 1 auto; padding-right: 64px; }
.agt-notes-panel.agt-notes-empty { flex: 0 0 auto; min-height: 0; align-items: center; }
.agt-notes-corner { position: absolute; top: 6px; right: 6px; padding: 2px 8px; font-size: 11px; opacity: .75; }
.agt-notes-corner:hover, .agt-notes-corner:focus-visible { opacity: 1; }
.agt-notes-bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
.agt-run-edit {
    flex: 1 1 auto; width: 100%; min-height: 80px; resize: none; padding: 8px 10px; font-family: inherit; font-size: 13px;
    line-height: 1.5; border: 1px solid var(--link-color); border-radius: 6px; background: var(--input-bg); color: var(--text-primary);
}
.agt-done-notes { margin-top: 8px; }
.agt-done-notes > summary { cursor: pointer; font-weight: 600; }
.agt-done-section { margin-top: 8px; }
.agt-done-name { font-weight: 600; margin-bottom: 4px; }
.agt-done-notes .agt-run-notes { padding-right: 10px; }
.agt-head { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: .04em; padding: 0 2px; }
.agt-head span:first-child { grid-column: 2; }
.agt-head span:last-child { text-align: center; }
.agt-rows { display: flex; flex-direction: column; gap: 4px; }
.agt-row { padding: 2px; border-radius: 4px; }
.agt-row.agt-dragging { opacity: .5; }
.agt-row.agt-drop-before { box-shadow: inset 0 2px 0 var(--link-color); }
.agt-row.agt-drop-after { box-shadow: inset 0 -2px 0 var(--link-color); }
.agt-grip { cursor: grab; color: var(--text-muted); text-align: center; user-select: none; }
.agt-name, .agt-mins, .agt-for, .agt-until {
    width: 100%; min-width: 0; padding: 4px 6px; font-size: 12px; border: 1px solid var(--border-color);
    border-radius: 4px; background: var(--input-bg); color: var(--text-primary);
}
.agt-mins { text-align: right; }
.agt-for { width: 60px; }
.agt-until { width: auto; }
.agt-fixed { display: flex; align-items: center; justify-content: center; gap: 2px; cursor: pointer; font-size: 11px; }
.agt-fixed input { margin: 0; }
.agt-x { border: none; background: transparent; color: var(--text-muted); cursor: pointer; font-size: 15px; line-height: 1; }
.agt-x:hover { color: #e74c3c; }
.agt-foot { display: flex; align-items: center; justify-content: space-between; }
.agt-total { color: var(--text-secondary); }
.agt-actions { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.agt-actions[hidden], .agt-start[hidden] { display: none; }
.agt-btn {
    padding: 5px 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-tertiary);
    color: var(--text-primary); cursor: pointer; font-size: 12px; white-space: nowrap;
}
.agt-btn:hover:not(:disabled) { background: var(--table-hover); }
.agt-btn:disabled { opacity: .45; cursor: default; }
.agt-btn.primary { background: var(--link-color); border-color: var(--link-color); color: #fff; }
.agt-btn.primary:hover:not(:disabled) { filter: brightness(1.1); background: var(--link-color); }
.agt-btn.agt-confirm { background: #e74c3c; border-color: #e74c3c; color: #fff; }
.agt-start { display: flex; flex-direction: column; gap: 6px; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-secondary); }
.agt-start-q { font-weight: 600; }
.agt-start-opt { display: flex; align-items: center; gap: 6px; }
.agt-note { color: var(--text-secondary); }
.agt-note.agt-short { color: #b9770e; }
.agt-note.agt-bad { color: #e74c3c; }
.agt-preview-rows { display: flex; flex-direction: column; gap: 2px; margin-top: 4px; }
.agt-preview-row { display: flex; justify-content: space-between; gap: 8px; }
.agt-preview-len s { color: var(--text-muted); }
/* Running. */
.agt-run { display: flex; flex-direction: column; gap: 8px; }
.agt-strip { display: flex; gap: 2px; height: 10px; }
.agt-seg { position: relative; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; min-width: 4px; }
.agt-seg-fill { position: absolute; inset: 0 auto 0 0; width: 0; background: var(--link-color); opacity: .45; }
.agt-seg.done .agt-seg-fill { width: 100%; opacity: .3; }
.agt-seg.current { outline: 1px solid var(--link-color); }
.agt-seg.current .agt-seg-fill { opacity: .8; }
.agt-now { text-align: center; padding: 6px 0; border-radius: 8px; }
.agt-count { font-size: 11px; color: var(--text-muted); }
.agt-title { font-size: 16px; font-weight: 600; margin-top: 2px; }
.agt-clock { font-size: 44px; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1.15; }
.agt-of { color: var(--text-secondary); }
.agt-was { color: var(--text-muted); }
.agt-now.agt-warn .agt-clock { color: #e67e22; }
.agt-now.agt-over { background: rgba(231, 76, 60, .12); }
.agt-now.agt-over .agt-clock { color: #e74c3c; }
.agt-now.agt-paused .agt-clock { opacity: .55; }
.agt-next { text-align: center; color: var(--text-secondary); }
.agt-status { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; color: var(--text-secondary); }
.agt-delta.agt-behind { color: #e74c3c; font-weight: 600; }
.agt-delta.agt-ahead { color: #27ae60; font-weight: 600; }
.agt-controls { justify-content: center; }
.agt-msg { text-align: center; color: var(--text-secondary); min-height: 1em; }
.agt-summary { margin-top: 6px; }
.agt-over-text { color: #e74c3c; font-weight: 600; }
.agt-done .agt-title, .agt-done .agt-of { text-align: center; }
.agt-done .agt-actions { justify-content: center; margin-top: 6px; }

/* Vacation Planner */
.vac-widget { display: flex; flex-direction: column; flex: 1; height: 100%; min-height: 0; gap: 6px; font-size: 12px; color: var(--text-primary); container-type: inline-size; }
.vac-head { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; }
.vac-widget input, .vac-widget select, .vac-widget textarea { font: inherit; color: var(--text-primary); background: var(--input-bg, var(--bg-secondary)); border: 1px solid var(--border-color); border-radius: 4px; padding: 3px 5px; box-sizing: border-box; }
.vac-name { font-weight: 600; font-size: 14px !important; flex: 1 1 140px; min-width: 120px; }
.vac-dates { display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
.vac-btn { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; white-space: nowrap; text-decoration: none; }
.vac-btn:hover { background: var(--table-hover); }
.vac-btn.vac-on { border-color: #3498db; color: #3498db; }
.vac-btn.vac-off { opacity: .45; cursor: default; }
.vac-btn.vac-danger { color: #e74c3c; }
.vac-icon { border: none; background: none; cursor: pointer; padding: 0 3px; font-size: 13px; color: var(--text-secondary); text-decoration: none; line-height: 1; }
.vac-icon:hover { color: var(--text-primary); }
.vac-meal-list { display: flex; flex-direction: column; gap: 6px; }
.vac-meal-list .vac-meal-row input[data-f="label"] { width: 140px; }
.vac-meals { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-tertiary); }
.vac-meal-row { display: inline-flex; align-items: center; gap: 4px; }
.vac-meal-row input[data-f="label"] { width: 90px; }
.vac-meals .vac-hint { flex-basis: 100%; margin: 0; }
.vac-meal-tag { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: .04em; padding: 0 4px; border-radius: 3px; background: #e67e22; color: #fff; line-height: 14px; }
.vac-tabs { display: flex; gap: 2px; overflow-x: auto; border-bottom: 1px solid var(--border-color); margin-top: 6px; }
.vac-tab { border: 1px solid transparent; border-bottom: none; background: none; color: var(--text-secondary); padding: 4px 9px; cursor: pointer; font-size: 11px; white-space: nowrap; border-radius: 4px 4px 0 0; }
.vac-tab:hover { color: var(--text-primary); }
.vac-tab.vac-on { border-color: var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-weight: 600; margin-bottom: -1px; }
.vac-body { display: flex; flex: 1; min-height: 0; gap: 8px; }
.vac-main { flex: 1; min-width: 0; overflow: auto; position: relative; }
.vac-side { width: 250px; flex: none; display: flex; flex-direction: column; gap: 6px; border-left: 1px solid var(--border-color); padding-left: 8px; overflow: auto; }
@container (max-width: 560px) {
    .vac-body { flex-direction: column; overflow: auto; }
    .vac-main { flex: none; max-height: 70vh; }
    .vac-side { width: auto; border-left: none; border-top: 1px solid var(--border-color); padding: 6px 0 0; overflow: visible; }
}
.vac-empty { padding: 30px 10px; text-align: center; color: var(--text-secondary); line-height: 1.6; }
.vac-hint { color: var(--text-secondary); line-height: 1.5; font-size: 11px; }
.vac-day-head { position: sticky; top: 0; z-index: 4; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 4px 0 6px; background: var(--bg-secondary); }
.vac-day-head b { font-size: 13px; }
.vac-day-label { margin-right: auto; flex: 0 1 220px; min-width: 90px; border-color: transparent !important; background: transparent !important; font-size: 12px; }
.vac-day-label:hover, .vac-day-label:focus { border-color: var(--border-color) !important; background: var(--input-bg, var(--bg-secondary)) !important; }
.vac-trip-labelled .vac-thead { height: 38px; }
.vac-tlabel, .vac-cdlabel { display: block; font-weight: normal; font-size: 10px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vac-cdlabel { white-space: normal; max-width: 110px; }
.vac-grid-wrap { padding: 6px 0 10px; }
.vac-grid { position: relative; user-select: none; touch-action: none; cursor: copy; }
.vac-hour { position: absolute; left: 0; right: 0; height: var(--vac-px, 30px); border-top: 1px solid var(--border-color); box-sizing: border-box; }
.vac-hour::after { content: ''; position: absolute; left: 50px; right: 0; top: calc(var(--vac-px, 30px) / 2); border-top: 1px dashed var(--border-color); opacity: .5; }
.vac-hour span { position: absolute; left: 2px; top: -7px; padding-right: 4px; font-size: 10px; color: var(--text-secondary); background: var(--bg-secondary); }
.vac-lane { position: absolute; top: 0; bottom: 0; left: 50px; right: 4px; }
.vac-block { --vac-c: #3498db; position: absolute; box-sizing: border-box; overflow: hidden; border-radius: 4px; border-left: 3px solid var(--vac-c);
    background: color-mix(in srgb, var(--vac-c) 18%, var(--bg-secondary)); padding: 2px 5px; font-size: 11px; line-height: 1.3; cursor: grab; }
.vac-block:hover { z-index: 2; box-shadow: 0 1px 4px rgba(0,0,0,.2); }
.vac-k-food { --vac-c: #e67e22; }
.vac-k-activity { --vac-c: #3498db; }
.vac-k-travel { --vac-c: #9b59b6; }
.vac-k-flight { --vac-c: #16a085; }
.vac-k-drive { --vac-c: #b7950b; }
.vac-break { position: absolute; left: -3px; right: 0; border-top: 1px dashed var(--vac-c); pointer-events: none; }
.vac-break span { position: absolute; right: 3px; top: 1px; font-size: 9px; color: var(--text-secondary); }
.vac-events { flex-basis: 100%; display: flex; flex-wrap: wrap; gap: 4px; }
.vac-event { font-size: 11px; padding: 1px 7px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); text-decoration: none; }
a.vac-event:hover { background: var(--table-hover); }
.vac-sec { font-weight: 600; margin-top: 6px; padding-bottom: 2px; border-bottom: 1px solid var(--border-color); }
.vac-trow { display: block; width: 100%; text-align: left; border: none; background: none; color: var(--text-primary); padding: 3px 2px; cursor: pointer; font-size: 11px; border-radius: 3px; }
.vac-trow:hover { background: var(--table-hover); }
.vac-park { padding: 6px 0; border-bottom: 1px dashed var(--border-color); }
.vac-park-links { flex: 1; }
.vac-park-add, .vac-flight-add { align-self: flex-start; margin-top: 4px; }
.vac-stops { display: flex; flex-direction: column; gap: 4px; }
.vac-stops .vac-btn { align-self: flex-start; }
.vac-stop { display: flex; gap: 4px; align-items: center; }
.vac-stop input { flex: 1; min-width: 0; }
.vac-form label.vac-inline { flex-direction: row; align-items: center; gap: 4px; flex: none; font-size: 11px; }
.vac-out-bar { flex-wrap: wrap; }
.vac-people { display: flex; flex-direction: column; gap: 4px; }
.vac-person-row { display: flex; align-items: center; gap: 6px; }
.vac-person-row input[type="color"] { width: 26px; height: 22px; padding: 0 1px; cursor: pointer; }
.vac-person-row input[data-f="name"] { width: 110px; }
.vac-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; flex: none; }
.vac-who { display: inline-flex; align-items: center; gap: 4px; }
.vac-clothes { display: flex; flex-direction: column; gap: 8px; padding-bottom: 8px; }
.vac-cbar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; position: sticky; left: 0; }
.vac-presets { border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-tertiary); padding: 6px 8px; display: flex; flex-direction: column; gap: 6px; overflow-x: auto; }
.vac-ptable, .vac-ctable { border-collapse: collapse; font-size: 11px; }
.vac-ptable th, .vac-ptable td { padding: 2px 3px; text-align: left; font-weight: 600; color: var(--text-secondary); }
.vac-ptable td { font-weight: normal; }
.vac-ptable input:not([type]) { width: 92px; font-size: 11px !important; }
.vac-pauto { text-align: center !important; }
.vac-tname { display: inline-flex; align-items: center; gap: 1px; }
.vac-tname input { font-weight: 600; }
.vac-csum { font-size: 11px; color: var(--text-secondary); margin-bottom: 4px; }
.vac-ctable { width: 100%; min-width: max-content; }
.vac-ctable th { position: sticky; top: 0; z-index: 2; background: var(--bg-secondary); text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-secondary); padding: 4px; border-bottom: 1px solid var(--border-color); }
.vac-ctable td { padding: 2px 3px; border-bottom: 1px solid var(--border-light, var(--border-color)); vertical-align: middle; }
.vac-ctable tr.vac-cfirst td { border-top: 2px solid var(--border-color); }
.vac-cdate { vertical-align: top !important; min-width: 84px; padding-top: 5px !important; }
.vac-ccount { font-size: 10px; color: var(--text-secondary); margin: 2px 0 4px; }
.vac-cadd { padding: 1px 6px; font-size: 10px; }
.vac-ctable select { font-size: 11px !important; padding: 2px 3px !important; }
.vac-cwho select { border-left: 4px solid var(--vac-who) !important; }
.vac-cell { white-space: nowrap; }
.vac-cell input[type="checkbox"] { vertical-align: middle; margin: 0 2px 0 0; }
.vac-ctext { width: 96px; font-size: 11px !important; padding: 2px 4px !important; }
.vac-packed .vac-ctext { text-decoration: line-through; color: var(--text-secondary) !important; }
.vac-cacts { white-space: nowrap; }
.vac-k-rest { --vac-c: #27ae60; }
.vac-meal { background-image: repeating-linear-gradient(135deg, transparent 0 6px, color-mix(in srgb, var(--vac-c) 8%, transparent) 6px 12px); }
.vac-block.vac-sel { outline: 2px solid var(--vac-c); outline-offset: -1px; z-index: 3; }
.vac-block.vac-done { opacity: .55; }
.vac-block.vac-done .vac-b-title { text-decoration: line-through; }
.vac-b-title { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 22px; }
.vac-b-time, .vac-b-place { color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 10px; }
.vac-block.vac-short { display: flex; gap: 6px; align-items: baseline; padding-top: 0; }
.vac-block.vac-short .vac-b-place { display: none; }
.vac-block .vac-meal-tag { position: absolute; top: 2px; right: 3px; }
.vac-b-resize { position: absolute; left: 0; right: 0; bottom: 0; height: 6px; cursor: ns-resize; }
.vac-ghost { --vac-c: #3498db; border: 1px dashed #3498db; background: rgba(52,152,219,.15); pointer-events: none; }
.vac-dragging, .vac-dragging .vac-block { cursor: grabbing; }
.vac-trip { display: flex; gap: 4px; min-width: min-content; padding-bottom: 6px; }
.vac-tcol { flex: 1 0 96px; min-width: 96px; display: flex; flex-direction: column; }
.vac-taxis { flex: 0 0 40px; min-width: 40px; }
.vac-thead { position: sticky; top: 0; z-index: 4; height: 26px; flex: none; border: none; border-bottom: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vac-taxis .vac-thead { cursor: default; }
button.vac-thead:hover { color: #3498db; }
.vac-tgrid { position: relative; margin-top: 4px; }
.vac-tstays { position: relative; flex: none; border-bottom: 1px solid var(--border-color); }
.vac-tstays-label { position: absolute; right: 4px; top: 3px; font-size: 12px; }
.vac-tstay { position: absolute; left: -2px; right: -2px; height: 17px; background: color-mix(in srgb, #8e44ad 22%, var(--bg-secondary));
    border-top: 1px solid #8e44ad; border-bottom: 1px solid #8e44ad; box-sizing: border-box; cursor: pointer; font-size: 10px; line-height: 15px; }
.vac-tstay span { position: relative; z-index: 2; padding-left: 5px; white-space: nowrap; font-weight: 600; }
.vac-tstay-in { left: 50%; border-left: 1px solid #8e44ad; border-radius: 8px 0 0 8px; z-index: 1; }
.vac-tstay-out { right: 50%; border-right: 1px solid #8e44ad; border-radius: 0 8px 8px 0; }
.vac-tstay-in.vac-tstay-out { left: 25%; right: 25%; border-radius: 8px; }
.vac-tstay-cruise { background: color-mix(in srgb, #2980b9 20%, var(--bg-secondary)); border-color: #2980b9 !important; }
.vac-tstay .vac-tport { font-weight: normal; color: var(--text-secondary); }
.vac-pane.vac-pane-wide { max-width: 860px; }
.vac-cdays { display: flex; flex-direction: column; gap: 2px; padding: 4px 0 4px 8px; border-left: 3px solid #2980b9; }
.vac-crow2 { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 11px; min-height: 24px; }
.vac-cday { width: 78px; font-weight: 600; flex: none; }
.vac-cport-in { flex: 0 1 220px; min-width: 120px; }
.vac-atsea .vac-cport-in:not(:focus) { border-style: dashed !important; background: transparent !important; }
.vac-crow2 input[type="time"] { font-size: 11px !important; padding: 1px 3px !important; }
.vac-tstay:hover { background: color-mix(in srgb, #8e44ad 35%, var(--bg-secondary)); }
.vac-taxis .vac-tgrid span { position: absolute; right: 4px; font-size: 9px; color: var(--text-secondary); transform: translateY(-50%); }
.vac-thour { position: absolute; left: 0; right: 0; border-top: 1px solid var(--border-color); opacity: .5; }
.vac-tcol .vac-block { padding: 0 3px; font-size: 10px; cursor: pointer; }
.vac-tcol .vac-b-title { padding-right: 0; font-weight: 500; }
.vac-tcol .vac-block { touch-action: none; }
.vac-tcol .vac-b-resize { height: 4px; }
.vac-tcol .vac-block.vac-tdrag { z-index: 5; box-shadow: 0 2px 8px rgba(0,0,0,.25); opacity: .9; }
.vac-tpin { float: right; font-size: 9px; line-height: 14px; margin-left: 2px; }
.vac-short .vac-tpin { order: 2; margin-left: auto; flex: none; }
.vac-short .vac-b-title { min-width: 0; }
.vac-sbody { display: flex; flex-direction: column; gap: 6px; }
.vac-home input { flex: 1; min-width: 0; }
.vac-journey { display: flex; flex-direction: column; gap: 3px; }
.vac-jstep { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; padding: 3px 0 3px 8px; border-left: 3px solid var(--border-color); margin-left: 10px; }
.vac-jstep select, .vac-jstep input { font-size: 11px !important; padding: 1px 3px !important; }
.vac-jicon { width: 18px; text-align: center; }
.vac-jtext { flex: 1 1 200px; min-width: 0; }
.vac-jwhen { color: var(--text-secondary); font-size: 11px; }
.vac-jstate { font-size: 11px; color: #27ae60; }
.vac-j-home, .vac-j-airport, .vac-j-checkin, .vac-j-checkout, .vac-j-park, .vac-j-return { color: var(--text-secondary); }
.vac-rental-card > label.vac-wide { flex: none; }
.vac-subtabs { display: flex; flex-wrap: wrap; gap: 4px; padding: 2px 0 8px; margin-bottom: 4px; border-bottom: 1px solid var(--border-color); }
.vac-subtab { border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); border-radius: 14px; padding: 3px 11px;
    font-size: 11px; cursor: pointer; white-space: nowrap; }
.vac-subtab:hover { background: var(--table-hover); }
.vac-subtab.vac-on { background: #3498db; border-color: #3498db; color: #fff; }
.vac-subtab.vac-on .vac-count, .vac-subtab.vac-on .vac-jstate { color: #fff; }
.vac-subpane { display: flex; flex-direction: column; gap: 6px; }
.vac-subpane > .vac-tcard:first-child, .vac-subpane > .vac-park:first-child { padding-top: 0; }
.vac-tcard, .vac-subpane > .vac-park { border: 1px solid var(--border-color); border-radius: 6px; padding: 8px 10px !important; background: var(--bg-secondary); }
.vac-tcard .vac-row > label { flex: 1 1 90px; }
.vac-trip-bar { justify-content: flex-end; margin-bottom: 6px; }
.vac-tab[draggable="true"] { cursor: pointer; }
.vac-tab.vac-tab-dragging { opacity: .4; }
.vac-tab.vac-drop-before { box-shadow: inset 3px 0 0 #3498db; }
.vac-tab.vac-drop-after { box-shadow: inset -3px 0 0 #3498db; }
.vac-tabsep { flex: none; width: 1px; margin: 4px 6px; background: var(--border-color); }
.vac-pane { max-width: 640px; display: flex; flex-direction: column; gap: 6px; padding: 4px 2px 10px; }
.vac-pane .vac-park { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; }
.vac-pane .vac-park > label:first-child, .vac-pane .vac-park > label:nth-last-child(2), .vac-pane .vac-park > .vac-row:last-child { grid-column: 1 / -1; }
.vac-pane .vac-stay-card > label:nth-child(2), .vac-pane .vac-park > .vac-wide { grid-column: 1 / -1; }
.vac-stay-links { flex: 1; display: inline-flex; gap: 6px; }
.vac-form { display: flex; flex-direction: column; gap: 6px; }
.vac-form label { display: flex; flex-direction: column; gap: 2px; font-size: 10px; color: var(--text-secondary); flex: 1; min-width: 0; }
.vac-form label.vac-check { flex-direction: row; align-items: center; gap: 5px; font-size: 11px; color: var(--text-primary); }
.vac-form textarea { resize: vertical; }
.vac-form input, .vac-form select, .vac-form textarea { font-size: 11px; color: var(--text-primary); }
.vac-row { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.vac-form-links:empty { display: none; }
.vac-meal-note { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-secondary); }
.vac-place { display: flex; align-items: center; gap: 4px; padding: 4px 0; border-bottom: 1px solid var(--border-color); }
.vac-pname { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
.vac-pname:hover { color: var(--link-color, #1f6fb2); }
.vac-pedit { flex-direction: column; align-items: stretch; gap: 4px; }
.vac-paddr { font-size: 10px; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vac-use { padding: 1px 6px; }
.vac-add-place { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; }
.vac-add-place .vac-btn { align-self: flex-start; }
.vac-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.vac-chip { border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); border-radius: 10px; padding: 2px 8px; cursor: pointer; font-size: 11px; }
.vac-chip.vac-on { border-color: #3498db; background: color-mix(in srgb, #3498db 15%, var(--bg-secondary)); }
.vac-count { color: var(--text-secondary); font-size: 10px; }
.vac-list { display: flex; flex-direction: column; gap: 2px; }
.vac-item { display: flex; align-items: flex-start; gap: 5px; padding: 2px 0; }
.vac-item input[type="checkbox"] { margin-top: 2px; }
.vac-itext { flex: 1; min-width: 0; overflow-wrap: anywhere; cursor: text; line-height: 1.4; }
.vac-idone .vac-itext { text-decoration: line-through; color: var(--text-secondary); }
.vac-item-edit { flex: 1; min-width: 0; }
.vac-item-new { margin-top: 4px; }
.vac-list-actions { margin-top: 6px; }
.vac-body { position: relative; }
.vac-out { position: absolute; inset: 0; z-index: 10; display: flex; flex-direction: column; gap: 6px; padding: 8px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; box-shadow: 0 4px 16px var(--shadow-medium); }
.vac-out-bar label.vac-check { display: inline-flex; align-items: center; gap: 4px; }
.vac-out-gap { flex: 1; }
.vac-warn-slot { display: contents; }
.vac-warn-btn.vac-warn-on { background: #fdf2d0; border-color: #e0a800; color: #7a5a00; font-weight: 600; }
.vac-warn-btn.vac-warn-on.vac-on { background: #e0a800; color: #fff; }
.vac-warn-list { flex: 1; overflow: auto; display: flex; flex-direction: column; gap: 4px; }
.vac-warn-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border: 1px solid var(--border-color); border-left: 3px solid #e0a800; border-radius: 4px; background: var(--bg-primary); }
.vac-warn-row.vac-warn-off { opacity: .6; border-left-color: var(--border-color); }
.vac-warn-when { flex: none; width: 86px; color: var(--text-secondary); font-size: 11px; }
.vac-warn-text { flex: 1; min-width: 0; }
.vac-bud-set { gap: 14px; }
.vac-bud-cur { width: 44px; } .vac-bud-limit { width: 90px; }
.vac-bud-figs { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0; }
.vac-bud-fig { display: flex; flex-direction: column; padding: 6px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-secondary); min-width: 90px; }
.vac-bud-fig span { font-size: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .03em; }
.vac-bud-fig b { font-size: 16px; }
.vac-bud-fig.vac-bud-over { border-color: #c0392b; } .vac-bud-fig.vac-bud-over b { color: #c0392b; }
.vac-bud-bar { height: 8px; border-radius: 4px; background: var(--bg-tertiary); overflow: hidden; margin: 2px 0 8px; }
.vac-bud-bar span { display: block; height: 100%; background: #27ae60; }
.vac-bud-bar.vac-bud-over span { background: #c0392b; }
.vac-bud-cats { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.vac-bud-cat { font-size: 11px; padding: 2px 8px; border-radius: 10px; background: var(--bg-tertiary); }
.vac-bud-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px; }
.vac-bud-table th { text-align: left; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); padding: 4px 6px; }
.vac-bud-table td { border-bottom: 1px solid var(--border-color); padding: 3px 6px; vertical-align: middle; }
.vac-bud-table .vac-bud-amt { text-align: right; white-space: nowrap; }
.vac-bud-table input:not([type="checkbox"]) { width: 100%; box-sizing: border-box; }
.vac-bud-table .vac-bud-amt input { text-align: right; width: 90px; }
.vac-link { border: none; background: none; padding: 0; color: #3498db; cursor: pointer; text-align: left; font: inherit; }
.vac-link:hover { text-decoration: underline; }
.vac-pmain { flex: 1; min-width: 0; }
.vac-head .vac-dest { width: 200px; }
.vac-ptarget { font-size: 11px; color: var(--text-secondary); margin-top: 2px; font-weight: normal; }
.vac-ptarget a { color: #3498db; }
.vac-ptarget-none { color: #b9770e; }
.vac-gap { position: absolute; right: 6px; z-index: 4; transform: translateY(-50%); border: 1px dashed var(--border-color); background: var(--bg-primary);
    color: var(--text-secondary); border-radius: 10px; padding: 0 7px; font-size: 10px; line-height: 16px; cursor: pointer; white-space: nowrap; }
.vac-gap.vac-gap-set { border-style: solid; color: var(--text-primary); }
.vac-fcheck { display: flex; flex-direction: column; gap: 2px; font-size: 11px; }
.vac-fcheck .vac-row { align-items: center; }
.vac-ftime { font-weight: 600; }
.vac-b-link { font-size: 10px; margin-right: 2px; }
.vac-hours { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: var(--text-secondary); }
.vac-hours select { font-size: 11px; padding: 1px 2px; }
.vac-hour.vac-midnight { border-top: 1px dashed var(--text-secondary); }
.vac-hour.vac-midnight span { font-weight: 600; font-size: 9px; color: var(--text-primary); max-width: 46px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vac-thour.vac-tmidnight { border-top: 1px dashed var(--text-secondary); opacity: 1; }
.vac-block.vac-nextday { opacity: .85; }
/* Text past a short block's edge, into the free time under it: shown down to where the next block starts. */
.vac-block.vac-spill { overflow: visible; clip-path: inset(-4px -4px calc(-1 * var(--vac-spill)) -4px); }
.vac-dragging .vac-block.vac-spill { overflow: hidden; clip-path: none; }
.vac-edge { position: absolute; left: 50%; transform: translate(-50%, -50%); z-index: 4; font-size: 10px; line-height: 1.4; padding: 0 8px; white-space: nowrap; max-width: 90%;
    overflow: hidden; text-overflow: ellipsis; border-radius: 9px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-secondary); cursor: pointer; }
.vac-edge:hover { color: var(--text-primary); border-color: var(--text-secondary); }
.vac-edge-top { top: 0; }
.vac-edge-bottom { top: 100%; }
.vac-tday .vac-edge { padding: 0 4px; font-size: 9px; }
.vac-block.vac-linked { border-top-style: dashed; }
.vac-blink { font-size: 11px; color: var(--text-secondary); display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin: 2px 0; }
.vac-blink b { color: var(--text-primary); }
.vac-gap-linkrow { font-size: 11px; }
.vac-btime { font-size: 11px; color: var(--text-secondary); display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin: 2px 0; }
.vac-btime b { color: var(--text-primary); }
.vac-btime.vac-offer { background: #fdf2d0; color: #7a5a00; border-radius: 4px; padding: 3px 6px; }
.vac-jauto { font-size: 11px; color: var(--text-secondary); font-style: italic; }
.vac-gap.vac-gap-on { background: var(--bg-secondary); border-style: solid; }
.vac-gap.vac-gap-on.vac-gap-short { background: #fdf2d0; }
.vac-gap.vac-gap-missing { border-style: dashed; color: var(--text-secondary); }
.vac-gap.vac-gap-compact { right: 1px; padding: 0 3px; font-size: 9px; line-height: 12px; border-radius: 6px; }
.vac-gap-pop.vac-gap-pop-l { right: auto; left: 1px; }
.vac-gap.vac-gap-est { font-style: italic; color: var(--text-primary); }
.vac-gap-ests { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
.vac-gap-ests .vac-hint { width: 100%; }
.vac-gap.vac-gap-short { border-color: #e0a800; background: #fdf2d0; color: #7a5a00; font-weight: 600; }
.vac-gap-pop { position: absolute; right: 6px; z-index: 6; width: 230px; padding: 8px; display: flex; flex-direction: column; gap: 6px; background: var(--bg-secondary);
    border: 1px solid var(--border-color); border-radius: 6px; box-shadow: 0 4px 14px var(--shadow-medium); font-size: 12px; }
.vac-gap-route { font-weight: 600; }
.vac-block.vac-warned { box-shadow: inset 0 0 0 2px #e0a800; }
.vac-b-warn { margin-right: 2px; cursor: help; }
.vac-cal-body { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 4px 2px; }
.vac-cal-body p { margin: 0; }
.vac-out-views { display: inline-flex; border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; }
.vac-out-view { border: none; background: var(--bg-tertiary); color: var(--text-primary); padding: 3px 10px; font-size: 11px; cursor: pointer; }
.vac-out-view + .vac-out-view { border-left: 1px solid var(--border-color); }
.vac-out-view.vac-on { background: #3498db; color: #fff; }
.vac-out-view:disabled { opacity: .5; cursor: default; }
.vac-out-preview { flex: 1; min-height: 120px; overflow: auto; padding: 4px 12px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 4px; user-select: text; }
.vac-out-preview[hidden], .vac-out-text[hidden] { display: none; }
.vac-out-preview ul { margin: 2px 0 6px; padding-left: 20px; }
.vac-out-preview h1 { font-size: 18px; margin: 8px 0 2px; }
.vac-out-preview h2 { font-size: 14px; margin: 12px 0 2px; }
.vac-out-text { flex: 1; min-height: 120px; resize: none; font-family: monospace; font-size: 12px !important; line-height: 1.5; white-space: pre; }

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
    // Fallback: self-hosted CORS proxy (GCP Cloud Function, project toolboard-me, us-east1)
    const ICS_PROXY = 'https://ics-proxy-esjyexqdtq-ue.a.run.app';
    const proxyUrl = ICS_PROXY + '?url=' + encodeURIComponent(cacheBust(url));
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

function calendarBuildLegendHtml(data, counts, toolId) {
    let html = '';
    data.calendars.forEach(cal => {
        const count = counts[cal.id] || 0;
        const hiddenClass = cal.hidden ? ' hidden-cal' : '';
        html += `<div class="calendar-legend-item${hiddenClass}" onclick="calendarToggleCalendar('${cal.id}', '${toolId}')">
            <span class="calendar-legend-dot" style="background:${cal.color}"></span>
            <span>${cal.name}</span>
            <span class="calendar-legend-count">${count}</span>
        </div>`;
    });
    return html;
}

function calendarToggleCalendar(calId, toolId) {
    const data = calendarGetData(toolId);
    const cal = data.calendars.find(c => c.id === calId);
    if (!cal) return;
    cal.hidden = !cal.hidden;
    calendarSaveData(toolId, data);
    const widget = document.querySelector(`.tool[data-tool="${toolId}"] .calendar-widget`);
    if (!widget) return;
    const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
    calendarRender(widget, toolId, year);
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
    legend.innerHTML = calendarBuildLegendHtml(data, counts, toolId);
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

function formatEventTime(dateStr) {
    if (!dateStr || !dateStr.includes('T')) return null;
    const timePart = dateStr.split('T')[1];
    let h = parseInt(timePart.substring(0, 2), 10);
    const m = timePart.substring(3, 5);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return m === '00' ? `${h} ${ampm}` : `${h}:${m} ${ampm}`;
}

function calendarGetEventsForDate(data, dateStr) {
    const hiddenIds = new Set(data.calendars.filter(c => c.hidden).map(c => c.id));
    return data.events.filter(event => {
        if (hiddenIds.has(event.calendarId)) return false;
        const startDate = event.startDate.split('T')[0];
        const endDate = event.endDate ? event.endDate.split('T')[0] : startDate;
        return dateStr >= startDate && dateStr <= endDate;
    }).sort((a, b) => a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0);
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
            legend.innerHTML = calendarBuildLegendHtml(data, counts, toolId);
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
            const timeStr = formatEventTime(event.startDate);
            const label = timeStr ? `${timeStr} ${event.summary}` : event.summary;
            html += `<div class="calendar-day-event" style="background:${color}" title="${event.summary}">${label}</div>`;
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
        legend.innerHTML = calendarBuildLegendHtml(data, counts, toolId);
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
        const timeStr = formatEventTime(event.startDate);
        html += `<div class="calendar-day-tooltip-event">
            <span class="calendar-day-tooltip-dot" style="background:${color}"></span>
            ${timeStr ? `<span class="calendar-day-tooltip-time">${timeStr}</span>` : ''}
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
        const last = data.calendars.length - 1;

        list.innerHTML = data.calendars.map((cal, idx) => {
            const subUrl = (data.subscriptions || []).find(s => s.calendarId === cal.id)?.url || '';
            const safeName = cal.name.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
            const safeUrl = subUrl.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
            const swatches = CALENDAR_COLORS.map(c =>
                `<span class="cal-color-swatch${c === cal.color ? ' selected' : ''}" style="background:${c}" data-color="${c}" onclick="calendarApplyColor('${cal.id}','${c}')"></span>`
            ).join('');
            return `<div class="calendar-list-item" data-cal-id="${cal.id}">
                <div class="cal-edit-row">
                    <button class="cal-order-btn" onclick="calendarMoveCalendar('${cal.id}',-1)" ${idx === 0 ? 'disabled' : ''} title="Move up">↑</button>
                    <button class="cal-order-btn" onclick="calendarMoveCalendar('${cal.id}',1)" ${idx === last ? 'disabled' : ''} title="Move down">↓</button>
                    <span class="calendar-list-color cal-color-btn" style="background:${cal.color}" onclick="calendarPickColor('${cal.id}')" title="Change color"></span>
                    <input class="cal-name-input" type="text" value="${safeName}" onchange="calendarSaveName('${cal.id}',this.value)" placeholder="Calendar name">
                    <span class="calendar-list-count">${counts[cal.id] || 0} days</span>
                    <button class="calendar-list-remove" onclick="calendarRemoveCalendar('${cal.id}')">&times;</button>
                </div>
                <div class="cal-url-row">
                    <input class="cal-url-input" type="text" value="${safeUrl}" onchange="calendarSaveUrl('${cal.id}',this.value)" placeholder="iCal subscription URL (optional)">
                </div>
                <div class="cal-color-strip" id="cal-color-strip-${cal.id}" style="display:none;">${swatches}</div>
            </div>`;
        }).join('');

        const calendarOptions = data.calendars.map(cal =>
            `<option value="${cal.id}">${cal.name}</option>`
        ).join('');
        importSelect.innerHTML = calendarOptions;
        eventSelect.innerHTML = calendarOptions;
        importSelect.disabled = false;
        eventSelect.disabled = false;
    }
}

function calendarSaveName(calId, name) {
    name = name.trim();
    if (!name) return;
    const modal = document.getElementById('calendarManageModal');
    const toolId = modal.dataset.toolId;
    const data = calendarGetData(toolId);
    const cal = data.calendars.find(c => c.id === calId);
    if (!cal || cal.name === name) return;
    cal.name = name;
    calendarSaveData(toolId, data);
    const opts = data.calendars.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    const importSelect = document.getElementById('calendarImportSelect');
    const eventSelect = document.getElementById('calendarEventCalendar');
    if (importSelect) importSelect.innerHTML = opts;
    if (eventSelect) eventSelect.innerHTML = opts;
    const widget = document.querySelector(`.tool[data-tool="${toolId}"] .calendar-widget`);
    if (widget) {
        const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
        calendarRender(widget, toolId, year);
    }
}

function calendarPickColor(calId) {
    const strip = document.getElementById('cal-color-strip-' + calId);
    if (!strip) return;
    const isOpen = strip.style.display !== 'none';
    document.querySelectorAll('.cal-color-strip').forEach(s => { s.style.display = 'none'; });
    if (!isOpen) strip.style.display = 'flex';
}

function calendarApplyColor(calId, color) {
    const modal = document.getElementById('calendarManageModal');
    const toolId = modal.dataset.toolId;
    const data = calendarGetData(toolId);
    const cal = data.calendars.find(c => c.id === calId);
    if (!cal) return;
    cal.color = color;
    calendarSaveData(toolId, data);
    calendarRenderManageList(data);
    const widget = document.querySelector(`.tool[data-tool="${toolId}"] .calendar-widget`);
    if (widget) {
        const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
        calendarRender(widget, toolId, year);
    }
}

function calendarSaveUrl(calId, url) {
    url = url.trim();
    const modal = document.getElementById('calendarManageModal');
    const toolId = modal.dataset.toolId;
    const data = calendarGetData(toolId);
    if (!data.subscriptions) data.subscriptions = [];
    const existing = data.subscriptions.find(s => s.calendarId === calId);
    if (url) {
        if (existing) { existing.url = url; } else { data.subscriptions.push({ url, calendarId: calId }); }
    } else if (existing) {
        data.subscriptions = data.subscriptions.filter(s => s.calendarId !== calId);
    }
    calendarSaveData(toolId, data);
}

function calendarMoveCalendar(calId, direction) {
    const modal = document.getElementById('calendarManageModal');
    const toolId = modal.dataset.toolId;
    const data = calendarGetData(toolId);
    const idx = data.calendars.findIndex(c => c.id === calId);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= data.calendars.length) return;
    const [cal] = data.calendars.splice(idx, 1);
    data.calendars.splice(newIdx, 0, cal);
    calendarSaveData(toolId, data);
    calendarRenderManageList(data);
    const widget = document.querySelector(`.tool[data-tool="${toolId}"] .calendar-widget`);
    if (widget) {
        const year = parseInt(widget.querySelector('.calendar-year-display')?.textContent) || new Date().getFullYear();
        calendarRender(widget, toolId, year);
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

            // Handle parameters in key (e.g., DTSTART;TZID=America/New_York:20240101)
            let tzid = null;
            const semiIndex = key.indexOf(';');
            if (semiIndex !== -1) {
                const params = key.substring(semiIndex + 1);
                const tzidMatch = params.match(/TZID=([^;:]+)/);
                if (tzidMatch) tzid = tzidMatch[1];
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
                    currentEvent.startDate = parseICSDate(value, tzid);
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
                        currentEvent.endDate = parseICSDate(value, tzid);
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

function parseICSDate(value, tzid) {
    // Handle formats: 20240115, 20240115T103000, 20240115T103000Z, 20240115T103000 with TZID
    const isUTC = value.endsWith('Z');
    const cleaned = value.replace('Z', '');

    if (cleaned.length === 8) {
        // Date only: YYYYMMDD — no timezone conversion needed
        return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 6)}-${cleaned.substring(6, 8)}`;
    } else if (cleaned.length >= 15) {
        const localStr = `${cleaned.substring(0, 4)}-${cleaned.substring(4, 6)}-${cleaned.substring(6, 8)}T${cleaned.substring(9, 11)}:${cleaned.substring(11, 13)}:${cleaned.substring(13, 15)}`;

        if (isUTC) {
            // UTC timestamp: convert to browser-local time so date parts reflect the local calendar day
            return toLocalISOString(new Date(localStr + 'Z'));
        }

        if (tzid) {
            // Named timezone: convert from tzid to browser-local time
            return toLocalISOString(fromTimezoneToUTC(localStr, tzid));
        }

        // No timezone info — treat as local (unchanged)
        return localStr;
    }

    return value;
}

function fromTimezoneToUTC(localStr, tzid) {
    // Convert a wall-clock datetime string in `tzid` to a UTC Date.
    // Strategy: treat localStr as UTC to get a reference point, then measure
    // how far off that reference is from what tzid shows, and correct.
    try {
        const referenceDate = new Date(localStr + 'Z');
        const parts = new Intl.DateTimeFormat('en-CA', {
            timeZone: tzid,
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        }).formatToParts(referenceDate);
        const p = {};
        parts.forEach(({ type, value }) => p[type] = value);
        const tzShownStr = `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
        // Both strings are parsed as browser-local, so the local offset cancels out in the diff
        const diff = new Date(localStr) - new Date(tzShownStr);
        return new Date(referenceDate.getTime() + diff);
    } catch (e) {
        return new Date(localStr);
    }
}

function toLocalISOString(date) {
    const y = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${mo}-${d}T${h}:${mi}:${s}`;
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

    // Date-only strings (YYYY-MM-DD) must be parsed as LOCAL midnight, not UTC midnight.
    // new Date("YYYY-MM-DD") parses as UTC, which in negative-offset zones becomes the previous day.
    const parseICSDateLocal = s => {
        if (s.includes('T')) return new Date(s);
        const [y, m, d] = s.split('-');
        return new Date(+y, +m - 1, +d);
    };

    const startDate = parseICSDateLocal(event.startDate);
    const endDate = event.endDate ? parseICSDateLocal(event.endDate) : new Date(startDate);
    const duration = endDate - startDate;

    const maxCount = parts.COUNT ? parseInt(parts.COUNT) : 500;
    const interval = parts.INTERVAL ? parseInt(parts.INTERVAL) : 1;

    // Fix UNTIL: preserve Z for UTC datetimes; parse date-only as local midnight
    let until = null;
    if (parts.UNTIL) {
        const u = parts.UNTIL;
        until = u.endsWith('Z')
            ? new Date(u.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/, '$1-$2-$3T$4:$5:$6Z'))
            : parseICSDateLocal(parseICSDate(u));
    }
    if (!until) {
        until = new Date(startDate);
        until.setFullYear(until.getFullYear() + 1);
    }

    const toLocalDateStr = d => {
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };
    const toOccurrenceStartStr = (d, origStartDate) => {
        const dateOnly = toLocalDateStr(d);
        if (!origStartDate.includes('T')) return dateOnly;
        return dateOnly + origStartDate.substring(10);
    };

    // Handle WEEKLY+BYDAY (e.g. every weekday: BYDAY=MO,TU,WE,TH,FR)
    if (parts.FREQ === 'WEEKLY' && parts.BYDAY) {
        const dayMap = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
        const targetDays = new Set(parts.BYDAY.split(',').map(d => dayMap[d.replace(/[+\-\d]/g, '')]));
        const wkstDay = parts.WKST ? (dayMap[parts.WKST] ?? 0) : 0;

        // Rewind to the start of the week containing startDate
        const weekStart = new Date(startDate);
        while (((weekStart.getDay() - wkstDay + 7) % 7) !== 0) {
            weekStart.setDate(weekStart.getDate() - 1);
        }

        let occurrences = 1;
        const weekCursor = new Date(weekStart);

        outer: while (occurrences < maxCount) {
            for (let d = 0; d < 7; d++) {
                const day = new Date(weekCursor);
                day.setDate(weekCursor.getDate() + d);
                if (day > until) break outer;
                if (day <= startDate) continue; // base event already included
                if (!targetDays.has(day.getDay())) continue;

                const newEnd = new Date(day.getTime() + duration);
                events.push({
                    ...event,
                    uid: `${event.uid}_${occurrences}`,
                    startDate: toOccurrenceStartStr(day, event.startDate),
                    endDate: toLocalDateStr(newEnd),
                    rrule: undefined
                });
                if (++occurrences >= maxCount) break outer;
            }
            weekCursor.setDate(weekCursor.getDate() + 7 * interval);
        }

        return events;
    }

    let currentDate = new Date(startDate);
    let occurrences = 1;

    while (occurrences < maxCount && currentDate < until) {
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
            startDate: toOccurrenceStartStr(currentDate, event.startDate),
            endDate: toLocalDateStr(newEndDate),
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
// Breathing Exercise Widget
// ============================================================

var breathingInstances = new Map();
var BREATHING_CIRCLE_R = 80;
var BREATHING_CIRCUMFERENCE = 2 * Math.PI * BREATHING_CIRCLE_R;

var BREATHING_PRESETS = {
    '4-4-4': { inhale: 4, hold: 4, exhale: 4 },
    '4-7-8': { inhale: 4, hold: 7, exhale: 8 },
    '5-5-5': { inhale: 5, hold: 5, exhale: 5 },
    '4-0-4': { inhale: 4, hold: 0, exhale: 4 }
};

function breathingGetWidget(el) {
    return el.closest('.breathing-widget');
}

function breathingGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function breathingGetState(toolId) {
    if (!breathingInstances.has(toolId)) {
        breathingInstances.set(toolId, {
            running: false,
            phase: 'idle',
            timeLeft: 0,
            cycleCount: 0,
            intervalId: null,
            pattern: { inhale: 4, hold: 4, exhale: 4 },
            activePreset: '4-4-4'
        });
    }
    return breathingInstances.get(toolId);
}

function breathingInit() {
    document.querySelectorAll('.breathing-widget').forEach(function(widget) {
        var toolId = breathingGetToolId(widget);
        if (toolId) breathingUpdateDisplay(widget, toolId);
    });
}

function breathingToggle(btn) {
    var widget = breathingGetWidget(btn);
    var toolId = breathingGetToolId(btn);
    var state = breathingGetState(toolId);

    if (state.running) {
        // Pause
        state.running = false;
        clearInterval(state.intervalId);
        state.intervalId = null;
        breathingUpdateDisplay(widget, toolId);
    } else {
        // Start
        if (state.phase === 'idle') {
            state.phase = 'inhale';
            state.timeLeft = state.pattern.inhale;
            state.cycleCount = 0;
        }
        state.running = true;
        breathingUpdateDisplay(widget, toolId);
        state.intervalId = setInterval(function() {
            breathingTick(widget, toolId);
        }, 1000);
    }
}

function breathingReset(btn) {
    var widget = breathingGetWidget(btn);
    var toolId = breathingGetToolId(btn);
    var state = breathingGetState(toolId);

    state.running = false;
    if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
    }
    state.phase = 'idle';
    state.timeLeft = 0;
    state.cycleCount = 0;
    breathingUpdateDisplay(widget, toolId);
}

function breathingTick(widget, toolId) {
    var state = breathingGetState(toolId);
    if (!state.running) return;

    state.timeLeft--;
    if (state.timeLeft <= 0) {
        breathingAdvancePhase(toolId);
    }
    breathingUpdateDisplay(widget, toolId);
}

function breathingAdvancePhase(toolId) {
    var state = breathingGetState(toolId);
    if (state.phase === 'inhale') {
        if (state.pattern.hold > 0) {
            state.phase = 'hold';
            state.timeLeft = state.pattern.hold;
        } else {
            state.phase = 'exhale';
            state.timeLeft = state.pattern.exhale;
        }
    } else if (state.phase === 'hold') {
        state.phase = 'exhale';
        state.timeLeft = state.pattern.exhale;
    } else if (state.phase === 'exhale') {
        state.cycleCount++;
        state.phase = 'inhale';
        state.timeLeft = state.pattern.inhale;
    }
}

function breathingUpdateDisplay(widget, toolId) {
    var state = breathingGetState(toolId);

    // Phase label
    var label = widget.querySelector('.breathing-label');
    var timer = widget.querySelector('.breathing-timer');
    var circle = widget.querySelector('.breathing-circle-fg');
    var scaleWrap = widget.querySelector('.breathing-scale-wrap');
    var toggleBtn = widget.querySelector('.breathing-toggle');
    var cycleDisplay = widget.querySelector('.breathing-cycle-count');

    if (state.phase === 'idle') {
        label.textContent = 'Press Start';
        label.className = 'breathing-label';
        timer.textContent = '';
        circle.setAttribute('stroke-dashoffset', '0');
        circle.className = 'breathing-circle-fg';
        scaleWrap.className = 'breathing-scale-wrap';
        toggleBtn.textContent = 'Start';
        toggleBtn.classList.remove('running');
    } else {
        label.textContent = state.phase.charAt(0).toUpperCase() + state.phase.slice(1);
        label.className = 'breathing-label ' + state.phase;
        timer.textContent = state.timeLeft;

        // Circle progress
        var phaseDuration = state.pattern[state.phase];
        var progress = phaseDuration > 0 ? (phaseDuration - state.timeLeft) / phaseDuration : 0;
        var offset = BREATHING_CIRCUMFERENCE * (1 - progress);
        circle.setAttribute('stroke-dashoffset', offset.toFixed(2));
        circle.className = 'breathing-circle-fg ' + state.phase;

        // Scale animation
        scaleWrap.className = 'breathing-scale-wrap ' + state.phase;

        // Button
        if (state.running) {
            toggleBtn.textContent = 'Pause';
            toggleBtn.classList.add('running');
        } else {
            toggleBtn.textContent = 'Resume';
            toggleBtn.classList.remove('running');
        }
    }

    cycleDisplay.textContent = 'Cycles: ' + state.cycleCount;
}

function breathingSetPreset(btn, name) {
    var widget = breathingGetWidget(btn);
    var toolId = breathingGetToolId(btn);
    var state = breathingGetState(toolId);
    var preset = BREATHING_PRESETS[name];
    if (!preset) return;

    state.pattern = { inhale: preset.inhale, hold: preset.hold, exhale: preset.exhale };
    state.activePreset = name;

    // Update inputs
    var panel = widget.querySelector('.breathing-settings-panel');
    if (panel) {
        var inputs = panel.querySelectorAll('input');
        inputs[0].value = preset.inhale;
        inputs[1].value = preset.hold;
        inputs[2].value = preset.exhale;
    }

    // Update preset buttons
    widget.querySelectorAll('.breathing-preset').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-preset') === name);
    });

    if (!state.running) {
        state.phase = 'idle';
        state.timeLeft = 0;
        breathingUpdateDisplay(widget, toolId);
    }
}

function breathingApplySettings(el) {
    var widget = breathingGetWidget(el);
    var toolId = breathingGetToolId(el);
    var state = breathingGetState(toolId);
    var panel = widget.querySelector('.breathing-settings-panel');
    var inputs = panel.querySelectorAll('input');

    var inhale = Math.max(1, Math.min(15, parseInt(inputs[0].value) || 4));
    var hold = Math.max(0, Math.min(15, parseInt(inputs[1].value) || 0));
    var exhale = Math.max(1, Math.min(15, parseInt(inputs[2].value) || 4));

    inputs[0].value = inhale;
    inputs[1].value = hold;
    inputs[2].value = exhale;

    state.pattern = { inhale: inhale, hold: hold, exhale: exhale };
    state.activePreset = null;

    // Clear active preset buttons
    widget.querySelectorAll('.breathing-preset').forEach(function(b) {
        b.classList.remove('active');
    });

    if (state.phase === 'idle') {
        breathingUpdateDisplay(widget, toolId);
    }
}

function breathingToggleSettings(el) {
    var widget = breathingGetWidget(el);
    var panel = widget.querySelector('.breathing-settings-panel');
    panel.classList.toggle('open');
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
// KANBAN BOARD
// =============================================

const KB_TAG_COLORS = ['#3498db', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#2c3e50'];

let kbDragState = { type: null, colIdx: null, cardIdx: null, sourceColIdx: null, toolId: null };

function kbGetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function kbGetData(toolId) {
    const custom = toolCustomizations[toolId] || {};
    return custom.kanbanColumns || [
        { title: 'To Do', cards: [] },
        { title: 'In Progress', cards: [] },
        { title: 'Done', cards: [] }
    ];
}

function kbSaveData(toolId, columns) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].kanbanColumns = columns;
    saveToolCustomizations(toolCustomizations);
}

function kbRender(widget, toolId) {
    const columns = kbGetData(toolId);
    const board = widget.querySelector('.kb-board');
    if (!board) return;

    board.innerHTML = columns.map((col, ci) =>
        '<div class="kb-column" data-col="' + ci + '" draggable="true" ondragstart="kbColDragStart(event,' + ci + ')" ondragover="kbColDragOver(event,' + ci + ')" ondragleave="kbColDragLeave(event)" ondrop="kbColDrop(event,' + ci + ')">' +
            '<div class="kb-col-header">' +
                '<span class="kb-col-title" ondblclick="kbEditColTitle(this,' + ci + ')">' + kbEsc(col.title) + '</span>' +
                '<span class="kb-col-count">' + col.cards.length + '</span>' +
                '<span class="kb-col-menu" onclick="kbColMenu(this,' + ci + ')">&#8230;</span>' +
            '</div>' +
            '<div class="kb-col-body" data-col="' + ci + '" ondragover="kbCardDragOver(event)" ondragleave="kbCardDragLeave(event)" ondrop="kbCardDrop(event,' + ci + ')">' +
                col.cards.map((card, cdi) =>
                    '<div class="kb-card" data-card="' + cdi + '" draggable="true" ondragstart="kbCardDragStart(event,' + ci + ',' + cdi + ')" ondblclick="kbEditCard(this,' + ci + ',' + cdi + ')">' +
                        '<div class="kb-card-actions">' +
                            '<button class="kb-card-action" onclick="kbEditCard(this,' + ci + ',' + cdi + ')" title="Edit">&#9998;</button>' +
                        '</div>' +
                        '<div class="kb-card-title">' + kbEsc(card.title) + '</div>' +
                        (card.desc ? '<div class="kb-card-desc">' + kbEsc(card.desc) + '</div>' : '') +
                        (card.tags && card.tags.length ? '<div class="kb-card-tags">' + card.tags.map(t =>
                            '<span class="kb-card-tag" style="background:' + kbTagColor(t) + '">' + kbEsc(t) + '</span>'
                        ).join('') + '</div>' : '') +
                    '</div>'
                ).join('') +
            '</div>' +
            '<div class="kb-add-card" onclick="kbShowAddForm(this,' + ci + ')">+ Add card</div>' +
        '</div>'
    ).join('');

    if (columns.length === 0) {
        board.innerHTML = '<div class="kb-empty">No columns yet. Add one above.</div>';
    }
}

function kbEsc(str) {
    if (typeof escapeHtml === 'function') return escapeHtml(str);
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

function kbTagColor(tag) {
    let h = 0;
    for (let i = 0; i < tag.length; i++) h = ((h << 5) - h + tag.charCodeAt(i)) | 0;
    return KB_TAG_COLORS[Math.abs(h) % KB_TAG_COLORS.length];
}

function kbAddColumn(btn) {
    const widget = btn.closest('.kb-widget');
    const toolId = kbGetToolId(widget);
    if (!toolId) return;
    const input = widget.querySelector('.kb-toolbar input');
    const name = (input.value || '').trim();
    if (!name) return;
    const columns = kbGetData(toolId);
    columns.push({ title: name, cards: [] });
    kbSaveData(toolId, columns);
    input.value = '';
    kbRender(widget, toolId);
}

function kbShowAddForm(addBtn, colIdx) {
    const widget = addBtn.closest('.kb-widget');
    const col = addBtn.closest('.kb-column');
    addBtn.style.display = 'none';
    const form = document.createElement('div');
    form.className = 'kb-add-form';
    form.innerHTML =
        '<textarea rows="2" placeholder="Card title..." onkeydown="kbAddFormKey(event,this,' + colIdx + ')"></textarea>' +
        '<div class="kb-add-form-btns">' +
            '<button class="kb-add-confirm" onclick="kbAddCard(this,' + colIdx + ')">Add</button>' +
            '<button class="kb-add-cancel" onclick="kbCancelAdd(this,' + colIdx + ')">Cancel</button>' +
        '</div>';
    col.appendChild(form);
    form.querySelector('textarea').focus();
}

function kbAddFormKey(e, ta, colIdx) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        kbAddCard(ta, colIdx);
    }
    if (e.key === 'Escape') {
        kbCancelAdd(ta, colIdx);
    }
}

function kbAddCard(el, colIdx) {
    const widget = el.closest('.kb-widget');
    const toolId = kbGetToolId(widget);
    if (!toolId) return;
    const form = el.closest('.kb-add-form');
    const title = (form.querySelector('textarea').value || '').trim();
    if (!title) return;
    const columns = kbGetData(toolId);
    if (!columns[colIdx]) return;
    columns[colIdx].cards.push({ title: title, desc: '', tags: [] });
    kbSaveData(toolId, columns);
    kbRender(widget, toolId);
}

function kbCancelAdd(el, colIdx) {
    const widget = el.closest('.kb-widget');
    const toolId = kbGetToolId(widget);
    const col = el.closest('.kb-column');
    const form = col.querySelector('.kb-add-form');
    if (form) form.remove();
    const addBtn = col.querySelector('.kb-add-card');
    if (addBtn) addBtn.style.display = '';
    // if no add button, re-render
    if (!addBtn) kbRender(widget, toolId);
}

function kbEditColTitle(span, colIdx) {
    const widget = span.closest('.kb-widget');
    const toolId = kbGetToolId(widget);
    if (!toolId) return;
    const columns = kbGetData(toolId);
    const current = columns[colIdx].title;
    const input = document.createElement('input');
    input.className = 'kb-col-title-input';
    input.value = current;
    span.replaceWith(input);
    input.focus();
    input.select();
    const save = () => {
        const val = (input.value || '').trim();
        if (val && val !== current) {
            columns[colIdx].title = val;
            kbSaveData(toolId, columns);
        }
        kbRender(widget, toolId);
    };
    input.addEventListener('blur', save);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
        if (e.key === 'Escape') { input.value = current; input.blur(); }
    });
}

function kbColMenu(menuEl, colIdx) {
    const widget = menuEl.closest('.kb-widget');
    const toolId = kbGetToolId(widget);
    if (!toolId) return;
    const columns = kbGetData(toolId);
    const action = prompt('Column: "' + columns[colIdx].title + '"\nType "delete" to remove this column, or "clear" to remove all its cards.');
    if (!action) return;
    const cmd = action.trim().toLowerCase();
    if (cmd === 'delete') {
        columns.splice(colIdx, 1);
        kbSaveData(toolId, columns);
        kbRender(widget, toolId);
    } else if (cmd === 'clear') {
        columns[colIdx].cards = [];
        kbSaveData(toolId, columns);
        kbRender(widget, toolId);
    }
}

function kbEditCard(el, colIdx, cardIdx) {
    const widget = el.closest('.kb-widget');
    const toolId = kbGetToolId(widget);
    if (!toolId) return;
    const columns = kbGetData(toolId);
    const card = columns[colIdx] && columns[colIdx].cards[cardIdx];
    if (!card) return;

    // Remove any existing overlay
    const existing = widget.querySelector('.kb-edit-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'kb-edit-overlay';
    overlay.innerHTML =
        '<div class="kb-edit-modal" onclick="event.stopPropagation()">' +
            '<label>Title</label>' +
            '<input class="kb-edit-title" value="' + kbEsc(card.title).replace(/"/g, '&quot;') + '">' +
            '<label>Description</label>' +
            '<textarea class="kb-edit-desc" rows="3">' + kbEsc(card.desc || '') + '</textarea>' +
            '<label>Tags (comma separated)</label>' +
            '<input class="kb-edit-tags" value="' + kbEsc((card.tags || []).join(', ')).replace(/"/g, '&quot;') + '">' +
            '<div class="kb-edit-btns">' +
                '<button class="kb-del-btn" onclick="kbDeleteCard(this,' + colIdx + ',' + cardIdx + ')">Delete</button>' +
                '<button class="kb-cancel-btn" onclick="this.closest(\'.kb-edit-overlay\').remove()">Cancel</button>' +
                '<button class="kb-save-btn" onclick="kbSaveCard(this,' + colIdx + ',' + cardIdx + ')">Save</button>' +
            '</div>' +
        '</div>';
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    widget.style.position = 'relative';
    widget.appendChild(overlay);
    overlay.querySelector('.kb-edit-title').focus();

    // Enter to save on title input
    overlay.querySelector('.kb-edit-title').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); kbSaveCard(overlay.querySelector('.kb-save-btn'), colIdx, cardIdx); }
    });
}

function kbSaveCard(btn, colIdx, cardIdx) {
    const widget = btn.closest('.kb-widget');
    const toolId = kbGetToolId(widget);
    if (!toolId) return;
    const overlay = btn.closest('.kb-edit-overlay');
    const columns = kbGetData(toolId);
    if (!columns[colIdx] || !columns[colIdx].cards[cardIdx]) return;
    const title = (overlay.querySelector('.kb-edit-title').value || '').trim();
    if (!title) return;
    columns[colIdx].cards[cardIdx].title = title;
    columns[colIdx].cards[cardIdx].desc = (overlay.querySelector('.kb-edit-desc').value || '').trim();
    const tagsStr = (overlay.querySelector('.kb-edit-tags').value || '').trim();
    columns[colIdx].cards[cardIdx].tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
    kbSaveData(toolId, columns);
    overlay.remove();
    kbRender(widget, toolId);
}

function kbDeleteCard(btn, colIdx, cardIdx) {
    const widget = btn.closest('.kb-widget');
    const toolId = kbGetToolId(widget);
    if (!toolId) return;
    const columns = kbGetData(toolId);
    if (!columns[colIdx]) return;
    columns[colIdx].cards.splice(cardIdx, 1);
    kbSaveData(toolId, columns);
    const overlay = widget.querySelector('.kb-edit-overlay');
    if (overlay) overlay.remove();
    kbRender(widget, toolId);
}

// --- Card drag and drop ---
function kbCardDragStart(e, colIdx, cardIdx) {
    kbDragState = { type: 'card', colIdx: colIdx, cardIdx: cardIdx, sourceColIdx: colIdx, toolId: kbGetToolId(e.target.closest('.kb-widget')) };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    e.target.classList.add('kb-card-dragging');
    // Prevent column drag from firing
    e.stopPropagation();
}

function kbCardDragOver(e) {
    if (kbDragState.type !== 'card') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const card = e.target.closest('.kb-card');
    const body = e.target.closest('.kb-col-body');
    if (body) {
        body.querySelectorAll('.kb-card.kb-card-drag-over').forEach(c => c.classList.remove('kb-card-drag-over'));
    }
    if (card && !card.classList.contains('kb-card-dragging')) {
        card.classList.add('kb-card-drag-over');
    }
}

function kbCardDragLeave(e) {
    const card = e.target.closest('.kb-card');
    if (card) card.classList.remove('kb-card-drag-over');
}

function kbCardDrop(e, targetColIdx) {
    e.preventDefault();
    e.stopPropagation();
    if (kbDragState.type !== 'card') return;

    const { colIdx: srcCol, cardIdx: srcCard, toolId } = kbDragState;
    if (!toolId) return;

    const columns = kbGetData(toolId);
    if (!columns[srcCol] || !columns[srcCol].cards[srcCard]) return;

    // Determine target card index
    let targetCard = columns[targetColIdx] ? columns[targetColIdx].cards.length : 0;
    const overCard = e.target.closest('.kb-card');
    if (overCard) {
        targetCard = parseInt(overCard.getAttribute('data-card'));
    }

    // Move the card
    const [moved] = columns[srcCol].cards.splice(srcCard, 1);
    // Adjust target index if same column and after source
    if (srcCol === targetColIdx && targetCard > srcCard) targetCard--;
    columns[targetColIdx].cards.splice(targetCard, 0, moved);

    kbSaveData(toolId, columns);
    const widget = document.querySelector('.tool[data-tool="' + toolId + '"] .kb-widget');
    if (widget) kbRender(widget, toolId);
    kbDragState = { type: null, colIdx: null, cardIdx: null, sourceColIdx: null, toolId: null };
}

// --- Column drag and drop ---
function kbColDragStart(e, colIdx) {
    if (kbDragState.type === 'card') return; // card drag takes priority
    const toolId = kbGetToolId(e.target.closest('.kb-widget'));
    kbDragState = { type: 'column', colIdx: colIdx, cardIdx: null, sourceColIdx: null, toolId: toolId };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
}

function kbColDragOver(e, colIdx) {
    if (kbDragState.type !== 'column') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const col = e.target.closest('.kb-column');
    if (col && parseInt(col.getAttribute('data-col')) !== kbDragState.colIdx) {
        col.classList.add('kb-col-drag-over');
    }
}

function kbColDragLeave(e) {
    const col = e.target.closest('.kb-column');
    if (col) col.classList.remove('kb-col-drag-over');
}

function kbColDrop(e, targetColIdx) {
    e.preventDefault();
    if (kbDragState.type !== 'column') return;

    const { colIdx: srcCol, toolId } = kbDragState;
    if (!toolId || srcCol === targetColIdx) {
        kbDragState = { type: null, colIdx: null, cardIdx: null, sourceColIdx: null, toolId: null };
        return;
    }

    const columns = kbGetData(toolId);
    const [moved] = columns.splice(srcCol, 1);
    columns.splice(targetColIdx > srcCol ? targetColIdx : targetColIdx, 0, moved);

    kbSaveData(toolId, columns);
    const widget = document.querySelector('.tool[data-tool="' + toolId + '"] .kb-widget');
    if (widget) kbRender(widget, toolId);
    kbDragState = { type: null, colIdx: null, cardIdx: null, sourceColIdx: null, toolId: null };
}

// Global dragend cleanup for kanban
document.addEventListener('dragend', () => {
    document.querySelectorAll('.kb-card-dragging').forEach(el => el.classList.remove('kb-card-dragging'));
    document.querySelectorAll('.kb-card-drag-over').forEach(el => el.classList.remove('kb-card-drag-over'));
    document.querySelectorAll('.kb-col-drag-over').forEach(el => el.classList.remove('kb-col-drag-over'));
    kbDragState = { type: null, colIdx: null, cardIdx: null, sourceColIdx: null, toolId: null };
});

// ---- ✨: Chrome's own model, for a board ----------------------------------------

var KB_AI_SYSTEM = 'You help a team plan and track work on a kanban board. Be brief and concrete. ' +
    'Reply with the result only: no preface, no closing remarks.';
var KB_AI_MAX = 15;

/** The board as words the model can read: each column, its cards in order. */
function kbAIText(columns) {
    return columns.map(function(col) {
        return '## ' + col.title + ' (' + col.cards.length + (col.cards.length === 1 ? ' card' : ' cards') + ')' +
            (col.cards.length ? '\n' + col.cards.map(function(c) {
                return '- ' + c.title + (c.desc ? ' — ' + String(c.desc).replace(/\s+/g, ' ') : '') +
                    (c.tags && c.tags.length ? ' [' + c.tags.join(', ') + ']' : '');
            }).join('\n') : '');
    }).join('\n\n');
}

function kbAITarget(toolId) {
    var columns = kbGetData(toolId);
    var cards = columns.reduce(function(n, c) { return n + c.cards.length; }, 0);
    return { scope: 'whole', kind: 'board', text: cards ? kbAIText(columns) : '', first: (columns[0] || {}).title || '',
        label: 'On this board (' + cards + (cards === 1 ? ' card' : ' cards') + ' in ' + columns.length + (columns.length === 1 ? ' column' : ' columns') + ')',
        emptyLabel: 'No cards yet: draft some for a goal.' };
}

/** Cards from the model made into cards the board can hold — or nothing usable. */
function kbAICleanCards(json) {
    var text = function(s, n) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, n); };
    var cards = (json && Array.isArray(json.cards) ? json.cards : []).map(function(c) {
        var tags = (Array.isArray(c && c.tags) ? c.tags : []).map(function(t) { return text(t, 20).replace(/^#/, ''); })
            .filter(function(t, i, all) { return t && all.indexOf(t) === i; }).slice(0, 3);
        var card = { title: text(c && c.title, 100) };
        var desc = text(c && c.description, 300);
        if (desc) card.desc = desc;
        if (tags.length) card.tags = tags;
        return card;
    }).filter(function(c) { return c.title; }).slice(0, KB_AI_MAX);
    if (!cards.length) throw new Error('No cards came back. Try saying a little more about it.');
    return cards;
}

function kbAICardsPreview(cards) {
    var esc = function(s) { return s.replace(/([\\`*_[\]<>#])/g, '\\$1'); };
    return cards.map(function(c) {
        return '- **' + esc(c.title) + '**' + (c.desc ? ' — ' + esc(c.desc) : '') + (c.tags ? ' · ' + c.tags.map(function(t) { return '`' + t + '`'; }).join(' ') : '');
    }).join('\n');
}

/** Cards into the board's first column, after what is there, through the ordinary save so Undo takes them out. */
function kbAIApply(toolId, result, how, target, info) {
    if (!info || info.action !== 'cards' || !Array.isArray(info.data) || how !== 'insert') return false;
    var columns = kbGetData(toolId);
    if (!columns.length) columns.push({ title: 'To Do', cards: [] });
    columns[0].cards = columns[0].cards.concat(info.data.map(function(c) { return Object.assign({}, c, c.tags ? { tags: c.tags.slice() } : {}); }));
    kbSaveData(toolId, columns);
    var widget = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"] .kb-widget');
    if (widget) kbRender(widget, toolId);
    return true;
}

function kbInit() {
    document.querySelectorAll('.kb-widget').forEach(widget => {
        const toolId = kbGetToolId(widget);
        if (!toolId) return;
        kbRender(widget, toolId);

        // Enter key on column name input
        const input = widget.querySelector('.kb-toolbar input');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    kbAddColumn(widget.querySelector('.kb-toolbar button'));
                }
            });
        }
    });
}

// =============================================
// WORLD CLOCK
// =============================================

const wcInstances = new Map();
const WC_DEFAULT_ZONES = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];
var wcSearchIndex = null;

function wcBuildSearchIndex() {
    if (wcSearchIndex) return wcSearchIndex;
    var allZones;
    try { allZones = Intl.supportedValuesOf('timeZone'); } catch(e) { allZones = WC_DEFAULT_ZONES; }
    var now = new Date();
    wcSearchIndex = allZones.map(function(tz) {
        var longName = '';
        try {
            var parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'long' }).formatToParts(now);
            var tzPart = parts.find(function(p) { return p.type === 'timeZoneName'; });
            if (tzPart) longName = tzPart.value;
        } catch(e) {}
        var city = tz.split('/').pop().replace(/_/g, ' ');
        return { id: tz, longName: longName, city: city, search: (tz + ' ' + longName + ' ' + city).toLowerCase() };
    });
    return wcSearchIndex;
}

function wcGetWidget(el) {
    return el.closest('.wc-widget');
}

function wcGetToolId(el) {
    const tool = el.closest('.tool');
    return tool ? tool.dataset.tool : null;
}

function wcGetState(toolId) {
    if (!wcInstances.has(toolId)) {
        wcInstances.set(toolId, { zones: [], timer: null });
    }
    return wcInstances.get(toolId);
}

function wcFormatTime(tz) {
    const now = new Date();
    const timeFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true });
    const dateFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' });
    const time = timeFmt.format(now);
    const date = dateFmt.format(now);

    // Calculate UTC offset
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    const diffMin = Math.round((tzDate - utcDate) / 60000);
    const sign = diffMin >= 0 ? '+' : '-';
    const absMin = Math.abs(diffMin);
    const offH = Math.floor(absMin / 60);
    const offM = absMin % 60;
    const offset = 'UTC' + sign + offH + (offM ? ':' + String(offM).padStart(2, '0') : '');

    return { time: time, date: date, offset: offset };
}

function wcRender(widget) {
    const toolId = wcGetToolId(widget);
    const state = wcGetState(toolId);
    const list = widget.querySelector('.wc-list');
    list.innerHTML = state.zones.map(function(tz, idx) {
        const info = wcFormatTime(tz);
        const label = tz.replace(/_/g, ' ').replace(/\//g, ' / ');
        return '<div class="wc-row">' +
            '<span class="wc-city">' + escapeHtml(label) + '</span>' +
            '<span class="wc-time" data-tz="' + escapeHtml(tz) + '">' + info.time + '</span>' +
            '<span class="wc-date" data-tz="' + escapeHtml(tz) + '">' + info.date + '</span>' +
            '<span class="wc-offset">' + info.offset + '</span>' +
            '<button class="wc-remove" onclick="wcRemoveZone(this,' + idx + ')" title="Remove">\u00D7</button>' +
        '</div>';
    }).join('');
}

function wcTick(widget) {
    widget.querySelectorAll('.wc-time').forEach(function(el) {
        const tz = el.getAttribute('data-tz');
        if (tz) {
            const info = wcFormatTime(tz);
            el.textContent = info.time;
            const dateEl = el.closest('.wc-row').querySelector('.wc-date');
            if (dateEl) dateEl.textContent = info.date;
        }
    });
}

function wcAddZone(btn) {
    const widget = wcGetWidget(btn);
    const toolId = wcGetToolId(btn);
    const state = wcGetState(toolId);
    const input = widget.querySelector('.wc-toolbar input');
    const val = input.value.trim();
    if (!val) return;

    var index = wcBuildSearchIndex();
    var lowerVal = val.toLowerCase();

    // Exact match on IANA ID
    var entry = index.find(function(e) { return e.id.toLowerCase() === lowerVal; });
    // Exact match on long name (e.g. "India Standard Time")
    if (!entry) entry = index.find(function(e) { return e.longName.toLowerCase() === lowerVal; });
    // Partial match on IANA ID, long name, or city
    if (!entry) entry = index.find(function(e) { return e.search.includes(lowerVal); });

    if (!entry) { input.style.borderColor = '#e74c3c'; setTimeout(function() { input.style.borderColor = ''; }, 1000); return; }
    if (state.zones.indexOf(entry.id) !== -1) { input.value = ''; return; }

    state.zones.push(entry.id);
    input.value = '';
    wcRender(widget);
    wcSaveState(widget);
}

function wcRemoveZone(btn, index) {
    const widget = wcGetWidget(btn);
    const toolId = wcGetToolId(btn);
    const state = wcGetState(toolId);
    state.zones.splice(index, 1);
    wcRender(widget);
    wcSaveState(widget);
}

function wcSaveState(widget) {
    const toolId = wcGetToolId(widget);
    const state = wcGetState(toolId);
    const customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].wcZones = state.zones;
    saveToolCustomizations(customizations);
}

function wcInit() {
    document.querySelectorAll('.wc-widget').forEach(function(widget) {
        const toolId = wcGetToolId(widget);
        if (!toolId) return;
        const state = wcGetState(toolId);

        // Restore state or use defaults
        const customizations = loadToolCustomizations();
        const custom = customizations[toolId] || {};
        state.zones = custom.wcZones || WC_DEFAULT_ZONES.slice();

        wcRender(widget);

        // Start ticking
        if (state.timer) clearInterval(state.timer);
        state.timer = setInterval(function() { wcTick(widget); }, 1000);

        // Allow Enter key to add zone
        var input = widget.querySelector('.wc-toolbar input');
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { wcAddZone(widget.querySelector('.wc-toolbar button')); }
        });

        // Add datalist for autocomplete with long timezone names
        var index = wcBuildSearchIndex();
        var listId = 'wc-tz-list-' + toolId.replace(/[^a-zA-Z0-9]/g, '');
        if (!document.getElementById(listId)) {
            var datalist = document.createElement('datalist');
            datalist.id = listId;
            datalist.innerHTML = index.map(function(e) {
                var label = e.longName ? e.id + ' \u2014 ' + e.longName : e.id;
                return '<option value="' + e.id + '">' + label + '</option>';
            }).join('');
            document.body.appendChild(datalist);
        }
        input.setAttribute('list', listId);
    });
}

// =============================================
// BROWN NOISE GENERATOR
// =============================================

var bnoiseState = {};

var BNOISE_LABELS = {
    brown: 'Brown noise', pink: 'Pink noise', white: 'White noise',
    waves: 'Ocean waves', wind: 'Wind', rain: 'Rain', fire: 'Fire crackling'
};

var BNOISE_COLORS = {
    brown: { bg1: '#1a0a24', bg2: '#0d0517', wave: '#c39bd3', glow: '#8e44ad' },
    pink:  { bg1: '#1f0a14', bg2: '#12000a', wave: '#f1948a', glow: '#c0392b' },
    white: { bg1: '#0d1117', bg2: '#06090d', wave: '#d5d8dc', glow: '#808b96' },
    waves: { bg1: '#071526', bg2: '#030c17', wave: '#5dade2', glow: '#1a6fa0' },
    wind:  { bg1: '#071a07', bg2: '#030f03', wave: '#7dcea0', glow: '#1e8449' },
    rain:  { bg1: '#070f1a', bg2: '#030810', wave: '#85c1e9', glow: '#2980b9' },
    fire:  { bg1: '#1a0800', bg2: '#0f0400', wave: '#f39c12', glow: '#e74c3c' }
};

function bnoiseGetToolId(el) {
    var tool = el.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function bnoiseGetWidget(el) {
    return el.closest('.bnoise-widget');
}

function bnoiseInit() {
    document.querySelectorAll('.bnoise-widget').forEach(function(widget) {
        var toolId = bnoiseGetToolId(widget);
        if (!toolId) return;
        if (!bnoiseState[toolId]) {
            bnoiseState[toolId] = {
                playing: false,
                type: 'brown',
                volume: 0.6,
                timerMinutes: 0,
                timerHandle: null,
                audioCtx: null,
                gainNode: null,
                analyser: null,
                source: null,
                lfoNodes: [],
                schedulerActive: false,
                schedulerHandle: null,
                rafId: null
            };
        }
        var canvas = widget.querySelector('.bnoise-canvas');
        if (canvas) bnoiseDrawIdle(canvas, 'brown');
    });
}

// ---- Buffer helpers ----

function bnoiseBuildBrownBuffer(audioCtx, seconds) {
    var sampleRate = audioCtx.sampleRate;
    var bufferSize = Math.floor(sampleRate * seconds);
    var buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    var data = buffer.getChannelData(0);
    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
        var w = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * w) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
    }
    return buffer;
}

function bnoiseBuildWhiteBuffer(audioCtx, seconds) {
    var sampleRate = audioCtx.sampleRate;
    var bufferSize = Math.floor(sampleRate * seconds);
    var buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    return buffer;
}

function bnoiseBuildBuffer(audioCtx, type) {
    var sampleRate = audioCtx.sampleRate;
    var i;
    if (type === 'brown') {
        return bnoiseBuildBrownBuffer(audioCtx, 10);
    } else if (type === 'pink') {
        var bufferSize = sampleRate * 10;
        var buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
        var data = buffer.getChannelData(0);
        var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (i = 0; i < bufferSize; i++) {
            var pw = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + pw * 0.0555179;
            b1 = 0.99332 * b1 + pw * 0.0750759;
            b2 = 0.96900 * b2 + pw * 0.1538520;
            b3 = 0.86650 * b3 + pw * 0.3104856;
            b4 = 0.55000 * b4 + pw * 0.5329522;
            b5 = -0.7616 * b5 - pw * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + pw * 0.5362) * 0.11;
            b6 = pw * 0.115926;
        }
        return buffer;
    } else if (type === 'waves') {
        // 30s brown noise with 3 overlapping sine LFOs baked in — long enough to avoid audible loop
        var wBufSize = Math.floor(sampleRate * 30);
        var wBuf = audioCtx.createBuffer(1, wBufSize, sampleRate);
        var wData = wBuf.getChannelData(0);
        var wLastOut = 0;
        for (i = 0; i < wBufSize; i++) {
            var ww = Math.random() * 2 - 1;
            wData[i] = (wLastOut + 0.02 * ww) / 1.02;
            wLastOut = wData[i];
            wData[i] *= 3.5;
            var t = i / sampleRate;
            var lfo = Math.sin(2 * Math.PI * 0.08 * t) +
                      Math.sin(2 * Math.PI * 0.13 * t + 1.5) * 0.6 +
                      Math.sin(2 * Math.PI * 0.19 * t + 3.2) * 0.3;
            wData[i] *= Math.max(0.05, (lfo / 1.9 + 1.0) * 0.5);
        }
        return wBuf;
    } else {
        return bnoiseBuildWhiteBuffer(audioCtx, 10);
    }
}

// ---- Type-specific setup ----

function bnoiseSetupWind(st) {
    var windBuf = bnoiseBuildWhiteBuffer(st.audioCtx, 10);
    st.source = st.audioCtx.createBufferSource();
    st.source.buffer = windBuf;
    st.source.loop = true;

    var filter = st.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.8;

    // Intermediate gain so LFO doesn't override user's volume control
    var windGain = st.audioCtx.createGain();
    windGain.gain.value = 0.7;

    // LFO1: filter frequency sweep (gusts)
    var lfo1 = st.audioCtx.createOscillator();
    lfo1.type = 'sine';
    lfo1.frequency.value = 0.07;
    var lfo1Gain = st.audioCtx.createGain();
    lfo1Gain.gain.value = 200; // ±200 Hz sweep
    lfo1.connect(lfo1Gain);
    lfo1Gain.connect(filter.frequency);

    // LFO2: amplitude breathing
    var lfo2 = st.audioCtx.createOscillator();
    lfo2.type = 'sine';
    lfo2.frequency.value = 0.13;
    var lfo2Gain = st.audioCtx.createGain();
    lfo2Gain.gain.value = 0.3;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(windGain.gain);

    lfo1.start();
    lfo2.start();
    st.lfoNodes = [lfo1, lfo2];

    st.source.connect(filter);
    filter.connect(windGain);
    windGain.connect(st.gainNode);
    st.source.start();
}

function bnoiseSetupRain(st) {
    // Base: high-pass white noise (rain hiss)
    var hissBuf = bnoiseBuildWhiteBuffer(st.audioCtx, 10);
    st.source = st.audioCtx.createBufferSource();
    st.source.buffer = hissBuf;
    st.source.loop = true;
    var hpFilter = st.audioCtx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.value = 1200;
    hpFilter.Q.value = 0.5;
    var hissGain = st.audioCtx.createGain();
    hissGain.gain.value = 0.15;
    st.source.connect(hpFilter);
    hpFilter.connect(hissGain);
    hissGain.connect(st.gainNode);
    st.source.start();

    // Individual raindrop bursts via chained setTimeout
    st.schedulerActive = true;
    bnoiseScheduleRainDrop(st);
}

function bnoiseScheduleRainDrop(st) {
    if (!st.schedulerActive || !st.audioCtx) return;
    var sampleRate = st.audioCtx.sampleRate;
    var dropLen = Math.floor(sampleRate * (0.008 + Math.random() * 0.035));
    var dropBuf = st.audioCtx.createBuffer(1, dropLen, sampleRate);
    var dropData = dropBuf.getChannelData(0);
    var decay = 25 + Math.random() * 80;
    for (var i = 0; i < dropLen; i++) {
        dropData[i] = (Math.random() * 2 - 1) * Math.exp(-i / decay);
    }
    var dropGain = st.audioCtx.createGain();
    dropGain.gain.value = 0.3 + Math.random() * 0.7;
    var dropSrc = st.audioCtx.createBufferSource();
    dropSrc.buffer = dropBuf;
    dropSrc.connect(dropGain);
    dropGain.connect(st.gainNode);
    dropSrc.start(st.audioCtx.currentTime);
    st.schedulerHandle = setTimeout(function() { bnoiseScheduleRainDrop(st); }, 12 + Math.random() * 55);
}

function bnoiseSetupFire(st) {
    // Base: low-pass brown noise (fire roar)
    var fireBuf = bnoiseBuildBrownBuffer(st.audioCtx, 10);
    st.source = st.audioCtx.createBufferSource();
    st.source.buffer = fireBuf;
    st.source.loop = true;
    var lpFilter = st.audioCtx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.value = 800;
    lpFilter.Q.value = 0.5;
    var baseGain = st.audioCtx.createGain();
    baseGain.gain.value = 0.5;
    st.source.connect(lpFilter);
    lpFilter.connect(baseGain);
    baseGain.connect(st.gainNode);
    st.source.start();

    // Random crackles via chained setTimeout
    st.schedulerActive = true;
    bnoiseScheduleFireCrackle(st);
}

function bnoiseScheduleFireCrackle(st) {
    if (!st.schedulerActive || !st.audioCtx) return;
    var sampleRate = st.audioCtx.sampleRate;
    var crackleLen = Math.floor(sampleRate * (0.004 + Math.random() * 0.022));
    var crackleBuf = st.audioCtx.createBuffer(1, crackleLen, sampleRate);
    var crackleData = crackleBuf.getChannelData(0);
    var decay = 40 + Math.random() * 180;
    for (var i = 0; i < crackleLen; i++) {
        crackleData[i] = (Math.random() * 2 - 1) * Math.exp(-i / decay);
    }
    var crackleGain = st.audioCtx.createGain();
    crackleGain.gain.value = 0.25 + Math.random() * 0.75;
    var crackleSrc = st.audioCtx.createBufferSource();
    crackleSrc.buffer = crackleBuf;
    crackleSrc.connect(crackleGain);
    crackleGain.connect(st.gainNode);
    crackleSrc.start(st.audioCtx.currentTime);
    st.schedulerHandle = setTimeout(function() { bnoiseScheduleFireCrackle(st); }, 55 + Math.random() * 340);
}

// ---- Core start / stop ----

function bnoiseStart(toolId) {
    var st = bnoiseState[toolId];
    if (!st) return;
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    st.audioCtx = new AudioCtx();
    st.gainNode = st.audioCtx.createGain();
    st.gainNode.gain.value = st.volume;
    st.analyser = st.audioCtx.createAnalyser();
    st.analyser.fftSize = 256;
    st.analyser.smoothingTimeConstant = 0.85;
    st.lfoNodes = [];
    st.schedulerActive = false;

    if (st.type === 'wind') {
        bnoiseSetupWind(st);
    } else if (st.type === 'rain') {
        bnoiseSetupRain(st);
    } else if (st.type === 'fire') {
        bnoiseSetupFire(st);
    } else {
        // brown, pink, white, waves — pre-filled looping buffer
        var buffer = bnoiseBuildBuffer(st.audioCtx, st.type);
        st.source = st.audioCtx.createBufferSource();
        st.source.buffer = buffer;
        st.source.loop = true;
        st.source.connect(st.gainNode);
        st.source.start();
    }

    st.gainNode.connect(st.analyser);
    st.analyser.connect(st.audioCtx.destination);
    st.playing = true;

    var widget = document.querySelector('.tool[data-tool="' + toolId + '"] .bnoise-widget');
    if (widget) {
        var canvas = widget.querySelector('.bnoise-canvas');
        if (canvas) bnoiseDrawFrame(toolId, canvas);
    }
}

function bnoiseStop(toolId) {
    var st = bnoiseState[toolId];
    if (!st) return;

    // Kill scheduler chain first — flag checked by any pending callback
    st.schedulerActive = false;
    if (st.schedulerHandle) { clearTimeout(st.schedulerHandle); st.schedulerHandle = null; }

    if (st.rafId) { cancelAnimationFrame(st.rafId); st.rafId = null; }
    if (st.lfoNodes) {
        st.lfoNodes.forEach(function(n) { try { n.stop(); } catch(e) {} });
        st.lfoNodes = [];
    }
    if (st.source) { try { st.source.stop(); } catch(e) {} st.source = null; }
    if (st.timerHandle) { clearTimeout(st.timerHandle); st.timerHandle = null; }
    if (st.audioCtx) { try { st.audioCtx.close(); } catch(e) {} st.audioCtx = null; }
    st.playing = false;

    var widget = document.querySelector('.tool[data-tool="' + toolId + '"] .bnoise-widget');
    if (widget) {
        var canvas = widget.querySelector('.bnoise-canvas');
        if (canvas) bnoiseDrawIdle(canvas, st.type);
        var playBtn = widget.querySelector('.bnoise-play-btn');
        if (playBtn) { playBtn.textContent = '▶'; playBtn.classList.remove('playing'); }
        var status = widget.querySelector('.bnoise-status');
        if (status) { status.textContent = 'Stopped'; status.classList.remove('playing'); }
        var timerSel = widget.querySelector('.bnoise-timer-select');
        if (timerSel) timerSel.value = '0';
    }
}

// ---- Canvas drawing ----

function bnoiseDrawIdle(canvas, type) {
    var colors = BNOISE_COLORS[type] || BNOISE_COLORS.brown;
    var ctx = canvas.getContext('2d');
    var w = canvas.offsetWidth || canvas.clientWidth || 280;
    var h = canvas.offsetHeight || canvas.clientHeight || 76;
    canvas.width = w;
    canvas.height = h;
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, colors.bg1);
    grad.addColorStop(1, colors.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = colors.wave;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
}

function bnoiseDrawFrame(toolId, canvas) {
    var st = bnoiseState[toolId];
    if (!st || !st.playing || !st.analyser) return;

    var colors = BNOISE_COLORS[st.type] || BNOISE_COLORS.brown;
    var bufferLen = st.analyser.frequencyBinCount;
    var timeData = new Uint8Array(bufferLen);
    st.analyser.getByteTimeDomainData(timeData);

    var ctx = canvas.getContext('2d');
    var w = canvas.offsetWidth || canvas.clientWidth || 280;
    var h = canvas.offsetHeight || canvas.clientHeight || 76;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;

    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, colors.bg1);
    grad.addColorStop(1, colors.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.lineWidth = 2;
    ctx.strokeStyle = colors.wave;
    ctx.shadowBlur = 6;
    ctx.shadowColor = colors.glow;
    ctx.beginPath();
    var sliceWidth = w / bufferLen;
    var x = 0;
    for (var i = 0; i < bufferLen; i++) {
        var v = timeData[i] / 128.0;
        var y = (v * h) / 2;
        if (i === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
        x += sliceWidth;
    }
    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    st.rafId = requestAnimationFrame(function() { bnoiseDrawFrame(toolId, canvas); });
}

// ---- UI handlers ----

function bnoiseToggle(btn) {
    var widget = bnoiseGetWidget(btn);
    var toolId = bnoiseGetToolId(widget);
    if (!toolId) return;
    var st = bnoiseState[toolId];
    if (!st) return;

    if (st.playing) {
        bnoiseStop(toolId);
    } else {
        bnoiseStart(toolId);
        btn.textContent = '⏹';
        btn.classList.add('playing');
        var status = widget.querySelector('.bnoise-status');
        if (status) {
            status.textContent = (BNOISE_LABELS[st.type] || st.type) + ' playing…';
            status.classList.add('playing');
        }
        var timerSel = widget.querySelector('.bnoise-timer-select');
        if (timerSel && parseInt(timerSel.value, 10) > 0) {
            bnoiseSetTimer(timerSel);
        }
    }
}

function bnoiseSetVolume(slider) {
    var widget = bnoiseGetWidget(slider);
    var toolId = bnoiseGetToolId(widget);
    if (!toolId) return;
    var st = bnoiseState[toolId];
    if (!st) return;
    var vol = parseFloat(slider.value);
    st.volume = vol;
    if (st.gainNode) st.gainNode.gain.value = vol;
    var label = widget.querySelector('.bnoise-vol-pct');
    if (label) label.textContent = Math.round(vol * 100) + '%';
}

function bnoiseSetType(btn, type) {
    var widget = bnoiseGetWidget(btn);
    var toolId = bnoiseGetToolId(widget);
    if (!toolId) return;
    var st = bnoiseState[toolId];
    if (!st) return;

    widget.querySelectorAll('.bnoise-type-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');

    var wasPlaying = st.playing;
    if (wasPlaying) bnoiseStop(toolId);
    st.type = type;

    // Update idle canvas to new type's colors even while stopped
    var canvas = widget.querySelector('.bnoise-canvas');
    if (canvas && !wasPlaying) bnoiseDrawIdle(canvas, type);

    if (wasPlaying) {
        bnoiseStart(toolId);
        var playBtn = widget.querySelector('.bnoise-play-btn');
        if (playBtn) { playBtn.textContent = '⏹'; playBtn.classList.add('playing'); }
        var status = widget.querySelector('.bnoise-status');
        if (status) {
            status.textContent = (BNOISE_LABELS[type] || type) + ' playing…';
            status.classList.add('playing');
        }
    }
}

function bnoiseSetTimer(select) {
    var widget = bnoiseGetWidget(select);
    var toolId = bnoiseGetToolId(widget);
    if (!toolId) return;
    var st = bnoiseState[toolId];
    if (!st) return;
    if (st.timerHandle) { clearTimeout(st.timerHandle); st.timerHandle = null; }
    var minutes = parseInt(select.value, 10);
    st.timerMinutes = minutes;
    if (minutes > 0 && st.playing) {
        st.timerHandle = setTimeout(function() { bnoiseStop(toolId); }, minutes * 60 * 1000);
    }
}

// =============================================
// RECIPE
// =============================================

function rcpGetToolId(element) { return element.closest('.tool')?.dataset.tool || null; }
// No mode here any more — that is the framework's, under its own key. Leaving a
// default one behind made every new tool look like it had been left in Split.
function rcpGetData(toolId) {
    const customizations = loadToolCustomizations();
    return (customizations[toolId]?.rcpData) || { text: '' };
}
function rcpSaveData(toolId, data) {
    const customizations = loadToolCustomizations();
    if (!customizations[toolId]) customizations[toolId] = {};
    customizations[toolId].rcpData = data;
    saveToolCustomizations(customizations);
}

// Indentation is the tree: a node with children is an operation, a leaf is an
// ingredient. Depth comes from an indent stack, so any consistent indent width works.
function rcpParse(text) {
    var result = { title: '', prep: [], roots: [], error: null };
    var lines = String(text || '').split('\n');
    var stack = [];
    var indents = [];

    for (var i = 0; i < lines.length; i++) {
        var raw = lines[i].replace(/\t/g, '    ').replace(/\s+$/, '');
        if (!raw.trim()) continue;

        var indent = raw.length - raw.replace(/^ +/, '').length;
        var body = raw.trim();

        if (body.indexOf('//') === 0) continue;
        if (body.charAt(0) === '#') { result.title = body.slice(1).trim(); continue; }
        if (body.charAt(0) === '@') { result.prep.push(body.slice(1).trim()); continue; }

        var node = { text: body, children: [] };
        while (indents.length && indent <= indents[indents.length - 1]) {
            indents.pop();
            stack.pop();
        }
        if (!stack.length) {
            if (indent !== 0) {
                result.error = 'Line ' + (i + 1) + ': unexpected indentation — the first step must start at column 1.';
                return result;
            }
            result.roots.push(node);
        } else {
            stack[stack.length - 1].children.push(node);
        }
        indents.push(indent);
        stack.push(node);
    }
    return result;
}

// Turns the forest into positioned table cells: leaves become rows, each operation
// spans exactly the ingredients it consumes, and leftover holes merge into rectangles.
function rcpLayout(roots) {
    var rows = [];
    var cells = [];
    var maxCol = 0;

    function walk(node) {
        if (!node.children.length) {
            var r = rows.length;
            rows.push(node.text);
            node.rowStart = r;
            node.rowEnd = r;
            node.col = 0;
            node.isOp = false;
            return node;
        }
        node.isOp = true;
        var start = rows.length;
        var deepest = 0;
        for (var i = 0; i < node.children.length; i++) {
            var c = walk(node.children[i]);
            if (c.isOp && c.col > deepest) deepest = c.col;
        }
        node.rowStart = start;
        node.rowEnd = rows.length - 1;
        node.col = deepest + 1;
        if (node.col > maxCol) maxCol = node.col;
        return node;
    }
    for (var i = 0; i < roots.length; i++) walk(roots[i]);

    var totalCols = maxCol + 1;

    // Stretch each operation rightwards until it meets its parent, so a shallow
    // branch stays flush with a deeper sibling.
    function emit(node, parentCol) {
        if (!node.isOp) return;
        cells.push({
            text: node.text,
            row: node.rowStart,
            rowSpan: node.rowEnd - node.rowStart + 1,
            col: node.col,
            colSpan: parentCol - node.col,
            kind: 'op'
        });
        for (var j = 0; j < node.children.length; j++) emit(node.children[j], node.col);
    }
    for (var k = 0; k < roots.length; k++) emit(roots[k], totalCols);

    for (var m = 0; m < rows.length; m++) {
        cells.push({ text: rows[m], row: m, rowSpan: 1, col: 0, colSpan: 1, kind: 'ingredient' });
    }

    var occupied = [];
    for (var r = 0; r < rows.length; r++) occupied.push(new Array(totalCols).fill(false));
    for (var c = 0; c < cells.length; c++) {
        var cell = cells[c];
        for (var rr = cell.row; rr < cell.row + cell.rowSpan; rr++) {
            for (var cc = cell.col; cc < cell.col + cell.colSpan; cc++) occupied[rr][cc] = true;
        }
    }
    for (var r2 = 0; r2 < rows.length; r2++) {
        for (var c2 = 0; c2 < totalCols; c2++) {
            if (occupied[r2][c2]) continue;
            var w = 0;
            while (c2 + w < totalCols && !occupied[r2][c2 + w]) w++;
            // Grow down only while the hole stays exactly this wide, so a row that
            // opens up an extra column starts a new, wider cell.
            var h = 1;
            outer: while (r2 + h < rows.length) {
                for (var x = c2; x < c2 + w; x++) {
                    if (occupied[r2 + h][x]) break outer;
                }
                if (c2 + w < totalCols && !occupied[r2 + h][c2 + w]) break;
                h++;
            }
            for (var yy = r2; yy < r2 + h; yy++) {
                for (var xx = c2; xx < c2 + w; xx++) occupied[yy][xx] = true;
            }
            cells.push({ text: '', row: r2, rowSpan: h, col: c2, colSpan: w, kind: 'empty' });
        }
    }
    return { rows: rows, totalCols: totalCols, cells: cells };
}

function rcpBuildTableHtml(parsed) {
    var layout = rcpLayout(parsed.roots);
    var totalCols = layout.totalCols;
    var html = '<table class="rcp-table">';

    if (parsed.title) {
        html += '<tr><td class="rcp-title" colspan="' + totalCols + '">' + escapeHtml(parsed.title) + '</td></tr>';
    }
    for (var p = 0; p < parsed.prep.length; p++) {
        html += '<tr><td class="rcp-prep" colspan="' + totalCols + '">' + escapeHtml(parsed.prep[p]) + '</td></tr>';
    }

    // Bucket cells by their starting row so each <tr> emits them in column order.
    var byRow = [];
    for (var i = 0; i < layout.rows.length; i++) byRow.push([]);
    layout.cells.forEach(function(cell) { byRow[cell.row].push(cell); });

    for (var r = 0; r < layout.rows.length; r++) {
        html += '<tr>';
        byRow[r].sort(function(a, b) { return a.col - b.col; }).forEach(function(cell) {
            var attrs = '';
            if (cell.rowSpan > 1) attrs += ' rowspan="' + cell.rowSpan + '"';
            if (cell.colSpan > 1) attrs += ' colspan="' + cell.colSpan + '"';
            html += '<td class="rcp-' + cell.kind + '"' + attrs + '>' + escapeHtml(cell.text) + '</td>';
        });
        html += '</tr>';
    }
    return html + '</table>';
}

/** The widget, from anywhere inside the tool — the action buttons live in the
 *  header once the framework has lifted them out of the widget itself. */
function rcpGetWidget(element) {
    return element.closest('.rcp-widget');
}

/** What the framework calls when the result needs to be up to date. */
function rcpRender(toolId) {
    var tool = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    var widget = tool && tool.querySelector('.rcp-widget');
    if (widget) rcpRenderTable(widget, toolId, '.rcp-output');
}

function rcpRenderTable(widget, toolId, containerSelector) {
    var container = widget.querySelector(containerSelector);
    if (!container) return;
    var data = rcpGetData(toolId);
    var parsed = rcpParse(data.text);

    if (parsed.error) {
        container.innerHTML = '<div class="rcp-error">' + escapeHtml(parsed.error) + '</div>';
        return;
    }
    if (!parsed.roots.length && !parsed.prep.length && !parsed.title) {
        container.innerHTML = '<div class="rcp-placeholder">Write your recipe — indent each ingredient under the step that uses it.</div>';
        return;
    }
    container.innerHTML = rcpBuildTableHtml(parsed);
}

function rcpActiveOutput(widget) {
    return widget.querySelector('.rcp-output');
}

// The mode is the framework's; all this has to do is put the text back — and, once,
// hand over the mode this tool used to keep for itself. "view" no longer exists;
// what it meant is what render means now.
function rcpInit() {
    document.querySelectorAll('.rcp-widget').forEach(widget => {
        const toolId = rcpGetToolId(widget);
        if (!toolId) return;
        const data = rcpGetData(toolId);
        widget.querySelector('textarea').value = data.text;

        // Only for a tool that really was left in a mode: read the stored object,
        // not the defaulted one, or a tool that has never been opened inherits a
        // mode it was never in.
        const customizations = loadToolCustomizations();
        const custom = customizations[toolId];
        const stored = custom && custom.rcpData;
        if (custom && !custom.viewMode && stored && stored.mode) {
            custom.viewMode = stored.mode === 'view' ? 'render' : stored.mode;
            saveToolCustomizations(customizations);
        }
    });
}

function rcpOnInput(textarea) {
    const widget = textarea.closest('.rcp-widget');
    const toolId = rcpGetToolId(textarea);
    if (!toolId) return;
    const data = rcpGetData(toolId);
    data.text = textarea.value;
    rcpSaveData(toolId, data);
    // Only Split has both on screen at once; in Edit the result is redrawn when
    // the mode changes, which is the only time anyone will see it.
    rcpRenderTable(widget, toolId, '.rcp-output');
}

// Keep Tab inside the editor — indentation is the syntax, so losing focus mid-recipe
// would be maddening.
function rcpOnKeyDown(textarea, event) {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    textarea.value = textarea.value.slice(0, start) + '  ' + textarea.value.slice(end);
    textarea.selectionStart = textarea.selectionEnd = start + 2;
    rcpOnInput(textarea);
}

function rcpWrapText(ctx, text, maxWidth) {
    var words = text.split(/\s+/);
    var lines = [];
    var line = '';
    for (var i = 0; i < words.length; i++) {
        var test = line ? line + ' ' + words[i] : words[i];
        if (line && ctx.measureText(test).width > maxWidth) {
            lines.push(line);
            line = words[i];
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines;
}

// Drawn straight onto a canvas from each cell's measured rect rather than via
// html2canvas, which mis-sizes rowspan cells and clips their text.
// First opaque background colour above this element, or '' if everything up the
// chain is see-through (in which case the export keeps its alpha channel).
function rcpEffectiveBackground(el) {
    for (var node = el; node && node !== document.documentElement; node = node.parentElement) {
        var c = getComputedStyle(node).backgroundColor;
        if (!c) continue;
        var m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) continue;
        var parts = m[1].split(',').map(function(v) { return parseFloat(v); });
        var alpha = parts.length > 3 ? parts[3] : 1;
        // Only an effectively opaque layer can stand in as the backdrop. Anything
        // see-through (including a colour mid-transition) means keep looking up.
        if (alpha >= 0.99) return c;
    }
    var bodyBg = getComputedStyle(document.body).backgroundColor;
    return /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/.test(bodyBg) ? '' : bodyBg;
}

function rcpExportPng(btn) {
    var widget = rcpGetWidget(btn);
    if (!widget) return;
    var output = rcpActiveOutput(widget);
    var table = output && output.querySelector('.rcp-table');
    if (!table) return;

    // Paint whatever the table is actually sitting on. The table and its panes are
    // transparent by design, so walk up until something opaque is found; if nothing
    // is, leave the canvas transparent rather than inventing a white plate.
    var bg = rcpEffectiveBackground(table);
    var borderColor = (getComputedStyle(widget).getPropertyValue('--rcp-border') || '').trim() || '#4a4a4a';

    var tableRect = table.getBoundingClientRect();
    var scale = 2;
    var pad = 8;
    var canvas = document.createElement('canvas');
    canvas.width = Math.ceil(tableRect.width * scale);
    canvas.height = Math.ceil(tableRect.height * scale);
    var ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    if (bg) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, tableRect.width, tableRect.height);
    }
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;
    ctx.strokeStyle = borderColor;

    Array.prototype.forEach.call(table.querySelectorAll('td'), function(td) {
        var r = td.getBoundingClientRect();
        var x = r.left - tableRect.left;
        var y = r.top - tableRect.top;
        var cs = getComputedStyle(td);
        ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(r.width) - 1, Math.round(r.height) - 1);

        var text = td.textContent.trim();
        if (!text) return;
        ctx.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        // Take the cell's own colour so a per-tool font colour carries into the PNG.
        ctx.fillStyle = cs.color;
        var leftAligned = cs.textAlign === 'left' || cs.textAlign === 'start';
        var lines = rcpWrapText(ctx, text, r.width - pad * 2);
        var lineHeight = parseFloat(cs.fontSize) * 1.35;
        var firstY = y + r.height / 2 - (lines.length - 1) * lineHeight / 2;
        ctx.textAlign = leftAligned ? 'left' : 'center';
        var textX = leftAligned ? x + pad : x + r.width / 2;
        for (var i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], textX, firstY + i * lineHeight);
        }
    });

    var a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'recipe.png';
    a.click();
}

// Inline the styles so the table survives a paste into a doc or email.
function rcpCopyHtml(btn) {
    var widget = rcpGetWidget(btn);
    if (!widget) return;
    var output = rcpActiveOutput(widget);
    var table = output && output.querySelector('.rcp-table');
    if (!table) return;

    var cs = getComputedStyle(table.querySelector('td') || table);
    var accent = (getComputedStyle(widget).getPropertyValue('--rcp-border') || '').trim() || '#4a4a4a';
    var textColor = cs.color || '#1a1a1a';
    var html = table.outerHTML
        .replace('<table class="rcp-table"', '<table cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:' + cs.fontSize + ';color:' + textColor + '"')
        .replace(/<td class="rcp-title"/g, '<td style="border:1px solid ' + accent + ';padding:5px 8px;text-align:center;font-weight:700"')
        .replace(/<td class="rcp-prep"/g, '<td style="border:1px solid ' + accent + ';padding:5px 8px;text-align:center"')
        .replace(/<td class="rcp-ingredient"/g, '<td style="border:1px solid ' + accent + ';padding:5px 8px;text-align:left"')
        .replace(/<td class="rcp-op"/g, '<td style="border:1px solid ' + accent + ';padding:5px 8px;text-align:center;vertical-align:middle"')
        .replace(/<td class="rcp-empty"/g, '<td style="border:1px solid ' + accent + ';padding:5px 8px"');

    var label = btn.textContent;
    navigator.clipboard.writeText(html).then(function() {
        btn.textContent = 'Copied!';
        setTimeout(function() { btn.textContent = label; }, 1200);
    });
}

function rcpShowHelp(btn) {
    let modal = document.querySelector('.rcp-help-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'rcp-help-modal';
        modal.innerHTML = `<div class="rcp-help-content"><span class="rcp-help-close" onclick="this.closest('.rcp-help-modal').classList.remove('open')">&times;</span><h3>Recipe Syntax</h3><p>Indentation is the recipe. <strong>A step with things indented under it is an operation; anything with nothing under it is an ingredient.</strong> Each operation's cell automatically spans exactly the ingredients it consumes.</p><p>Write it outside-in: the last thing you do goes on the top line, and everything it needs is indented beneath.</p><pre># Espresso Brownies
@ Butter and flour an 8x8-in pan
@ Preheat oven to 350&deg;F (170&deg;C)

bake 350&deg;F (170&deg;C) 30 to 40 min
  fold in
    mix
      mix
        melt
          4 oz (115 g) unsalted butter
        1 cup (200 g) sugar
        1/4 tsp. (2.5 mL) vanilla extract
        1 shot (4 Tbs; 60 mL) espresso
      2 large (100 g) eggs
    1/2 cup (80 g) all-purpose flour
    1/3 cup (80 g) cocoa powder
    1/4 tsp. (1.3 g) baking soda
    1/4 tsp. (1.5 g) table salt</pre><p><strong>Line prefixes:</strong></p><p><code>#</code> Title row, spanning the whole table</p><p><code>@</code> Prep row (oven, pans) — full width, shown at the top</p><p><code>//</code> Comment, not rendered</p><p><strong>Notes:</strong></p><p>Tabs or spaces both work, and any indent width is fine as long as you're consistent — each extra level of indentation is one step deeper.</p><p>Pressing <code>Tab</code> in the editor inserts two spaces instead of moving focus.</p><p>Two steps written at the left margin become two separate tracks stacked in one table — that's how you handle a sauce made alongside the main mixture.</p></div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    }
    modal.classList.add('open');
}

// =============================================
// SCRIPT INJECTION FOR HTML EXPORT
// =============================================

// =============================================
// AGENDA TIMER
// =============================================
// A timer for something with parts — an interview, a meeting, a talk. Its sections
// and their minutes are written ahead of time. Start asks how long there really is
// and, when that is less than planned, shrinks every section that is not fixed by
// the same proportion. Running, it counts each section down, says how far ahead or
// behind the whole is, and never moves on by itself: a section that runs over counts
// its overtime until Next.
//
// Time is kept as clock time — when the current section was entered, and how long
// each section has had — not as ticks, so a reload, a sleeping laptop or a tab in the
// background loses none of it.

const AGT_DEFAULT_SECTIONS = [
    { name: 'Introductions', minutes: 5 },
    { name: 'Background', minutes: 10 },
    { name: 'Technical', minutes: 20 },
    { name: 'Their questions', minutes: 5 },
    { name: 'Wrap-up', minutes: 5, fixed: true }
];
/** The last minute of a section is shown amber. */
const AGT_WARN_SECS = 60;
let agtTimer = null;
/** The section each running timer has chimed for, so a section chimes once. */
const agtChimed = new Map();
let agtDrag = null;
let agtAudio = null;

function agtGetToolId(el) { return el.closest('.tool')?.dataset.tool || null; }
function agtGetWidget(el) { return el.closest('.agt-widget'); }

function agtGetData(toolId) {
    const c = loadToolCustomizations()[toolId] || {};
    return {
        sections: Array.isArray(c.agtSections) ? c.agtSections : AGT_DEFAULT_SECTIONS.map(s => Object.assign({}, s)),
        run: c.agtRun || null,
        sound: c.agtSound !== false
    };
}

function agtSaveData(toolId, data) {
    const all = loadToolCustomizations();
    const c = all[toolId] = all[toolId] || {};
    c.agtSections = data.sections;
    if (data.run) c.agtRun = data.run; else delete c.agtRun;
    if (data.sound === false) c.agtSound = false; else delete c.agtSound;
    saveToolCustomizations(all);
}

/** 4:05, or 1:02:05 past the hour. */
function agtClock(secs) {
    const s = Math.max(0, Math.round(secs));
    const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), r = s % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(r).padStart(2, '0');
}

/** A length as a plan says it: "5 min", or 4:30 when it is not whole minutes. */
function agtLength(secs) {
    secs = Math.round(secs);
    return secs % 60 === 0 ? (secs / 60) + ' min' : agtClock(secs);
}

function agtTimeOfDay(ms) {
    return new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * Lengths fitted into `target` seconds. The ones not fixed shrink by one proportion,
 * rounded to `unit` seconds with the total kept exact: units left over go to the
 * largest remainders, and anything less than a unit to the longest. If the fixed ones
 * alone do not fit, everything shrinks together. Never stretches.
 */
function agtScale(secs, fixed, target, unit) {
    const total = secs.reduce((a, b) => a + b, 0);
    if (target >= total) return secs.slice();
    target = Math.max(0, Math.floor(target));
    const fixedSum = secs.reduce((a, s, i) => a + (fixed[i] ? s : 0), 0);
    let flex = secs.map((s, i) => !fixed[i] && s > 0);
    if (fixedSum >= target || !flex.some(Boolean)) flex = secs.map(s => s > 0);
    const keep = secs.reduce((a, s, i) => a + (flex[i] ? 0 : s), 0);
    const room = Math.max(0, target - keep);
    const flexSum = secs.reduce((a, s, i) => a + (flex[i] ? s : 0), 0);
    const exact = secs.map((s, i) => flex[i] ? s * room / flexSum : s);
    const out = exact.map((x, i) => flex[i] ? Math.floor(x / unit) * unit : x);
    let left = room - out.reduce((a, x, i) => a + (flex[i] ? x : 0), 0);
    const order = out.map((x, i) => i).filter(i => flex[i])
        .sort((a, b) => (exact[b] - out[b]) - (exact[a] - out[a]) || a - b);
    for (const i of order) {
        if (left < unit) break;
        out[i] += unit;
        left -= unit;
    }
    if (left > 0 && order.length) {
        const longest = order.slice().sort((a, b) => out[b] - out[a] || a - b)[0];
        out[longest] += left;
    }
    return out;
}

/** Where a running timer is, now. All in seconds but the two times of day. */
function agtLive(run, now) {
    const going = run.since != null && !run.done ? (now - run.since) / 1000 : 0;
    const cur = run.spent[run.index] / 1000 + going;
    const elapsed = run.spent.reduce((a, b) => a + b, 0) / 1000 + going;
    const dur = run.durs[run.index];
    // Behind the plan: what the sections before took over theirs, and this one's overtime.
    let behind = Math.max(0, cur - dur);
    for (let j = 0; j < run.index; j++) behind += run.spent[j] / 1000 - run.durs[j];
    let rest = Math.max(0, dur - cur);
    for (let j = run.index + 1; j < run.durs.length; j++) rest += Math.max(0, run.durs[j] - run.spent[j] / 1000);
    const left = run.endAt ? (run.endAt - now) / 1000 : run.budget - elapsed;
    return { cur, dur, remaining: dur - cur, elapsed, behind, rest, left,
        projectedEnd: now + rest * 1000, plannedEnd: now + left * 1000 };
}

// ---- the plan ----

function agtPlanSecs(sections) {
    return sections.map(s => Math.round((Number(s.minutes) || 0) * 60));
}

function agtEditHtml(toolId, data) {
    const total = agtPlanSecs(data.sections).reduce((a, b) => a + b, 0);
    const group = 'agt-mode-' + String(toolId).replace(/[^a-zA-Z0-9]/g, '');
    return '<div class="agt-edit">' +
        '<div class="agt-head"><span>Section</span><span>Minutes</span><span title="Fixed sections keep their length when time is short">Fixed</span><span></span></div>' +
        '<div class="agt-rows">' + data.sections.map((s, i) =>
            '<div class="agt-row" data-i="' + i + '" ondragover="agtDragOver(this, event)" ' +
                'ondragleave="agtDragLeave(this)" ondrop="agtDrop(this, event)">' +
                '<span class="agt-grip" draggable="true" title="Drag to reorder (or Alt+↑/↓ in its name)" ' +
                    'ondragstart="agtDragStart(this, event)" ondragend="agtDragEnd(this)">☰</span>' +
                '<input class="agt-name" value="' + escapeHtml(s.name || '') + '" placeholder="Section name" ' +
                    'aria-label="Section name" oninput="agtEdit(this)" onkeydown="agtNameKey(this, event)">' +
                '<input class="agt-mins" type="number" min="0" step="0.5" value="' + (Number(s.minutes) || 0) + '" ' +
                    'aria-label="Minutes" oninput="agtEdit(this)">' +
                '<label class="agt-fixed" title="Fixed: kept at its length when time is short">' +
                    '<input type="checkbox"' + (s.fixed ? ' checked' : '') + ' onchange="agtEdit(this)" ' +
                    'aria-label="Fixed length"><span aria-hidden="true">🔒</span></label>' +
                '<button class="agt-x agt-notes-btn' + (s.notes ? ' agt-has-notes' : '') + '" onclick="agtNotesToggle(this)" ' +
                    'title="Notes for this section" aria-label="Notes for this section" aria-expanded="false">📝</button>' +
                '<button class="agt-x agt-remove" onclick="agtRemove(this)" title="Remove this section" ' +
                    'aria-label="Remove this section">×</button>' +
                '<div class="agt-notes-box" hidden><textarea class="agt-notes" rows="3" spellcheck="true" ' +
                    'aria-label="Notes for this section" oninput="agtEdit(this)" ' +
                    'placeholder="Notes for this section, in Markdown. A line “- [ ] question” is a tick-box while it runs.">' +
                    escapeHtml(s.notes || '') + '</textarea></div>' +
            '</div>').join('') + '</div>' +
        '<div class="agt-foot">' +
            '<button class="agt-btn" onclick="agtAdd(this)">+ Section</button>' +
            '<span class="agt-total">Total <b>' + agtLength(total) + '</b></span>' +
        '</div>' +
        '<div class="agt-start" hidden>' +
            '<div class="agt-start-q">How much time do you have?</div>' +
            '<label class="agt-start-opt"><input type="radio" name="' + group + '" value="for" checked ' +
                'onchange="agtPreview(this)"> For <input class="agt-for" type="number" min="1" step="1" ' +
                'value="' + Math.round(total / 60) + '" oninput="agtPick(this, \'for\')"> min</label>' +
            '<label class="agt-start-opt"><input type="radio" name="' + group + '" value="until" ' +
                'onchange="agtPreview(this)"> Until <input class="agt-until" type="time" ' +
                'oninput="agtPick(this, \'until\')"></label>' +
            '<div class="agt-preview"></div>' +
            '<div class="agt-actions">' +
                '<button class="agt-btn primary agt-go" onclick="agtStartGo(this)">Start</button>' +
                '<button class="agt-btn" onclick="agtStartCancel(this)">Cancel</button>' +
            '</div>' +
        '</div>' +
        '<div class="agt-actions agt-plan-actions">' +
            '<button class="agt-btn primary agt-start-btn" onclick="agtStartOpen(this)"' + (total ? '' : ' disabled') + '>Start…</button>' +
            agtSoundHtml(data) +
        '</div>' +
    '</div>';
}

function agtSoundHtml(data) {
    return '<button class="agt-btn agt-sound" onclick="agtSound(this)" aria-pressed="' + data.sound + '" ' +
        'title="' + (data.sound ? 'A chime when a section’s time is up — click to mute' : 'Muted — click for a chime when a section’s time is up') + '">' +
        (data.sound ? '🔔' : '🔕') + '</button>';
}

/** The plan as the rows now say it. */
function agtReadRows(widget) {
    return Array.from(widget.querySelectorAll('.agt-row')).map(r => {
        const s = {
            name: r.querySelector('.agt-name').value,
            minutes: Math.max(0, Number(r.querySelector('.agt-mins').value) || 0)
        };
        if (r.querySelector('.agt-fixed input').checked) s.fixed = true;
        const notes = r.querySelector('.agt-notes').value;
        if (notes.trim()) s.notes = notes;
        return s;
    });
}

/** Typing keeps the caret: the rows are read and saved, and only the total redrawn. */
function agtEdit(el) {
    const widget = agtGetWidget(el), toolId = agtGetToolId(el);
    if (!widget || !toolId) return;
    const data = agtGetData(toolId);
    data.sections = agtReadRows(widget);
    agtSaveData(toolId, data);
    const total = agtPlanSecs(data.sections).reduce((a, b) => a + b, 0);
    widget.querySelector('.agt-total b').textContent = agtLength(total);
    widget.querySelector('.agt-start-btn').disabled = !total;
    if (!widget.querySelector('.agt-start').hidden) agtPreview(widget);
    if (el.classList.contains('agt-notes')) {
        agtGrow(el);
        el.closest('.agt-row').querySelector('.agt-notes-btn').classList.toggle('agt-has-notes', !!el.value.trim());
    }
}

/** A notes box as tall as what is in it, within reason. */
function agtGrow(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(240, textarea.scrollHeight + 2) + 'px';
}

/** Which rows have their notes open, by place; kept on the widget across redraws. */
function agtOpenNotes(widget) {
    widget._agtOpen = widget._agtOpen || new Set();
    return widget._agtOpen;
}

function agtNotesToggle(btn) {
    const widget = agtGetWidget(btn);
    const row = btn.closest('.agt-row');
    const box = row.querySelector('.agt-notes-box');
    box.hidden = !box.hidden;
    btn.setAttribute('aria-expanded', String(!box.hidden));
    const open = agtOpenNotes(widget), i = +row.dataset.i;
    if (box.hidden) open.delete(i); else open.add(i);
    if (!box.hidden) {
        const ta = box.querySelector('textarea');
        agtGrow(ta);
        ta.focus();
    }
}

function agtAdd(btn) {
    const widget = agtGetWidget(btn), toolId = agtGetToolId(btn);
    const data = agtGetData(toolId);
    data.sections = agtReadRows(widget).concat([{ name: '', minutes: 5 }]);
    agtSaveData(toolId, data);
    agtRender(widget);
    const names = widget.querySelectorAll('.agt-name');
    names[names.length - 1].focus();
}

function agtRemove(btn) {
    const widget = agtGetWidget(btn), toolId = agtGetToolId(btn);
    const i = +btn.closest('.agt-row').dataset.i;
    const data = agtGetData(toolId);
    data.sections = agtReadRows(widget).filter((s, j) => j !== i);
    agtSaveData(toolId, data);
    widget._agtOpen = new Set(Array.from(agtOpenNotes(widget)).filter(j => j !== i).map(j => j > i ? j - 1 : j));
    agtRender(widget);
}

function agtMove(widget, from, to) {
    const toolId = agtGetToolId(widget);
    const data = agtGetData(toolId);
    const rows = agtReadRows(widget);
    if (to < 0 || to >= rows.length || from === to) return false;
    const [moved] = rows.splice(from, 1);
    rows.splice(to, 0, moved);
    data.sections = rows;
    agtSaveData(toolId, data);
    // An open notes box goes with its section.
    const order = rows.map((r, k) => k);
    const [m] = order.splice(from, 1);
    order.splice(to, 0, m);
    const open = agtOpenNotes(widget);
    widget._agtOpen = new Set(order.map((old, k) => open.has(old) ? k : -1).filter(k => k >= 0));
    agtRender(widget);
    return true;
}

function agtNameKey(input, event) {
    if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return;
    event.preventDefault();
    const widget = agtGetWidget(input);
    const i = +input.closest('.agt-row').dataset.i;
    const to = i + (event.key === 'ArrowUp' ? -1 : 1);
    if (agtMove(widget, i, to)) widget.querySelectorAll('.agt-name')[to].focus();
}

function agtDragStart(grip, event) {
    const row = grip.closest('.agt-row');
    agtDrag = { toolId: agtGetToolId(grip), from: +row.dataset.i };
    event.dataTransfer.effectAllowed = 'move';
    try { event.dataTransfer.setData('text/plain', ''); } catch (e) { /* some browsers insist */ }
    row.classList.add('agt-dragging');
}

function agtDragOver(row, event) {
    if (!agtDrag || agtDrag.toolId !== agtGetToolId(row)) return;
    event.preventDefault();
    const r = row.getBoundingClientRect();
    const after = event.clientY > r.top + r.height / 2;
    row.classList.toggle('agt-drop-before', !after);
    row.classList.toggle('agt-drop-after', after);
}

function agtDragLeave(row) {
    row.classList.remove('agt-drop-before', 'agt-drop-after');
}

function agtDrop(row, event) {
    if (!agtDrag || agtDrag.toolId !== agtGetToolId(row)) return;
    event.preventDefault();
    const after = row.classList.contains('agt-drop-after');
    agtDragLeave(row);
    const from = agtDrag.from;
    let to = +row.dataset.i + (after ? 1 : 0);
    if (from < to) to--;
    agtDrag = null;
    agtMove(agtGetWidget(row), from, to);
}

function agtDragEnd(grip) {
    agtDrag = null;
    const widget = agtGetWidget(grip);
    if (widget) widget.querySelectorAll('.agt-row').forEach(r => r.classList.remove('agt-dragging', 'agt-drop-before', 'agt-drop-after'));
}

function agtSound(btn) {
    const widget = agtGetWidget(btn), toolId = agtGetToolId(btn);
    const data = agtGetData(toolId);
    if (!data.run) data.sections = agtReadRows(widget);
    data.sound = !data.sound;
    agtSaveData(toolId, data);
    btn.outerHTML = agtSoundHtml(data);
}

// ---- starting: how much time there really is ----

function agtStartOpen(btn) {
    const widget = agtGetWidget(btn);
    const panel = widget.querySelector('.agt-start');
    const total = agtPlanSecs(agtReadRows(widget)).reduce((a, b) => a + b, 0);
    widget.querySelector('.agt-for').value = Math.max(1, Math.round(total / 60));
    // Until: the plan's length from now, to the next minute.
    const until = new Date(Math.ceil((Date.now() + total * 1000) / 60000) * 60000);
    widget.querySelector('.agt-until').value = String(until.getHours()).padStart(2, '0') + ':' + String(until.getMinutes()).padStart(2, '0');
    panel.hidden = false;
    widget.querySelector('.agt-plan-actions').hidden = true;
    agtPreview(widget);
    widget.querySelector('.agt-for').select();
}

function agtStartCancel(btn) {
    const widget = agtGetWidget(btn);
    widget.querySelector('.agt-start').hidden = true;
    widget.querySelector('.agt-plan-actions').hidden = false;
}

/** Typing a number or a time is choosing it. */
function agtPick(input, mode) {
    const widget = agtGetWidget(input);
    widget.querySelector('.agt-start input[type="radio"][value="' + mode + '"]').checked = true;
    agtPreview(widget);
}

/** The time there is, in seconds, from what the start panel says. */
function agtTarget(widget, now) {
    const mode = widget.querySelector('.agt-start input[type="radio"]:checked').value;
    if (mode === 'for') {
        const min = Number(widget.querySelector('.agt-for').value);
        if (!(min > 0)) return { error: 'How many minutes?' };
        return { secs: Math.round(min * 60), endAt: null };
    }
    const m = /^(\d{1,2}):(\d{2})/.exec(widget.querySelector('.agt-until').value || '');
    if (!m) return { error: 'Until when?' };
    const end = new Date(now);
    end.setHours(+m[1], +m[2], 0, 0);
    if (end.getTime() <= now) return { error: 'That time has already passed.' };
    return { secs: Math.floor((end.getTime() - now) / 1000), endAt: end.getTime() };
}

/** The plan fitted to the time there is: what Start would run. */
function agtFitted(sections, target) {
    const planned = agtPlanSecs(sections);
    const fixed = sections.map(s => !!s.fixed);
    const durs = agtScale(planned, fixed, target, 60);
    return { planned, fixed, durs };
}

function agtPreview(el) {
    const widget = el.classList && el.classList.contains('agt-widget') ? el : agtGetWidget(el);
    const box = widget.querySelector('.agt-preview');
    const sections = agtReadRows(widget);
    const t = agtTarget(widget, Date.now());
    widget.querySelector('.agt-go').disabled = !!t.error;
    if (t.error) { box.innerHTML = '<div class="agt-note agt-bad">' + escapeHtml(t.error) + '</div>'; return; }
    const f = agtFitted(sections, t.secs);
    const total = f.planned.reduce((a, b) => a + b, 0);
    const fixedSum = f.planned.reduce((a, s, i) => a + (f.fixed[i] ? s : 0), 0);
    let note;
    if (t.secs >= total) {
        note = agtLength(total) + ' planned, ' + agtLength(t.secs) + ' available' +
            (t.secs > total ? ' — ' + agtLength(t.secs - total) + ' to spare.' : '.');
    } else {
        note = agtLength(t.secs) + ' available for ' + agtLength(total) + ' planned — ' +
            (fixedSum >= t.secs ? 'not even enough for the fixed sections, so every section shrinks.'
                : 'sections that are not fixed shrink by ' + Math.round((total - t.secs) * 100 / (total - fixedSum)) + '%.');
    }
    box.innerHTML = '<div class="agt-note' + (t.secs < total ? ' agt-short' : '') + '">' + escapeHtml(note) + '</div>' +
        '<div class="agt-preview-rows">' + sections.map((s, i) => f.planned[i] ? '<div class="agt-preview-row">' +
            '<span class="agt-preview-name">' + (s.fixed ? '🔒 ' : '') + escapeHtml(s.name || 'Section ' + (i + 1)) + '</span>' +
            '<span class="agt-preview-len">' + (f.durs[i] !== f.planned[i]
                ? '<s>' + agtLength(f.planned[i]) + '</s> → <b>' + agtLength(f.durs[i]) + '</b>'
                : agtLength(f.planned[i])) + '</span></div>' : '').join('') + '</div>';
}

function agtStartGo(btn) {
    const widget = agtGetWidget(btn), toolId = agtGetToolId(btn);
    const now = Date.now();
    const t = agtTarget(widget, now);
    if (t.error) return agtPreview(widget);
    const data = agtGetData(toolId);
    data.sections = agtReadRows(widget);
    const f = agtFitted(data.sections, t.secs);
    // A section of no minutes is left out of the run, not shown as one to skip.
    const keep = f.planned.map((s, i) => i).filter(i => f.planned[i] > 0);
    data.run = {
        names: keep.map(i => data.sections[i].name || 'Section ' + (i + 1)),
        fixed: keep.map(i => f.fixed[i]),
        planned: keep.map(i => f.planned[i]),
        durs: keep.map(i => f.durs[i]),
        spent: keep.map(() => 0),
        notes: keep.map(i => data.sections[i].notes || ''),
        // Ticks start as the notes have them ([x]), every Start: they are this run's.
        ticks: keep.map(i => agtTickItems(data.sections[i].notes).map((c, k) => c ? k : -1).filter(k => k >= 0)),
        index: 0,
        since: now,
        startedAt: now,
        endAt: t.endAt,
        budget: t.endAt ? null : t.secs,
        done: false
    };
    agtSaveData(toolId, data);
    agtChimed.delete(toolId);
    agtRender(widget);
}

// ---- running ----

/** The tick-box lines in a section's notes, as whether each starts ticked. */
function agtTickItems(notes) {
    return (String(notes || '').match(/^[ \t]*[-*+][ \t]+\[[ xX]\][ \t]/gm) || []).map(l => /\[[xX]\]/.test(l));
}

/** A section's notes as they read, its tick-boxes ticked as this run has them. */
function agtNotesHtml(notes, ticks) {
    if (!String(notes || '').trim()) return '';
    const t = document.createElement('template');
    t.innerHTML = parseMarkdown(notes);
    t.content.querySelectorAll('input[type="checkbox"]').forEach((box, k) => {
        box.removeAttribute('disabled');
        box.dataset.k = String(k);
        box.setAttribute('onchange', 'agtTickItem(this)');
        if ((ticks || []).includes(k)) box.setAttribute('checked', ''); else box.removeAttribute('checked');
        const li = box.closest('li');
        if (li) li.classList.add('agt-task');
    });
    t.content.querySelectorAll('a[href]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
    return '<div class="agt-run-notes markdown-content">' + t.innerHTML + '</div>';
}

/** Ticking a box keeps it with the run, and leaves the notes where they are scrolled to. */
function agtTickItem(box) {
    const widget = agtGetWidget(box), toolId = agtGetToolId(box);
    const data = agtGetData(toolId);
    const run = data.run;
    if (!run) return;
    run.ticks = run.ticks || run.durs.map(() => []);
    const k = +box.dataset.k;
    const mine = (run.ticks[run.index] || []).filter(x => x !== k);
    if (box.checked) mine.push(k);
    run.ticks[run.index] = mine.sort((a, b) => a - b);
    agtSaveData(toolId, data);
    widget._agtRun = run;
}

/** A section's notes with this run's ticks written into them, as "- [x]", for editing. */
function agtBakeTicks(notes, ticks) {
    let k = -1;
    return String(notes || '').replace(/^([ \t]*[-*+][ \t]+)\[[ xX]\]([ \t])/gm, (m, a, b) => {
        k++;
        return a + ((ticks || []).includes(k) ? '[x]' : '[ ]') + b;
    });
}

/**
 * The current section's notes while it runs: as they read, with ✎ Edit to change
 * them, or as a box to write in. What is written here is this run's — the plan keeps
 * its own notes for the next time.
 */
function agtRunNotesHtml(run, editing) {
    const i = run.index, notes = (run.notes || [])[i] || '';
    if (editing) {
        return '<div class="agt-notes-panel agt-notes-editing">' +
            '<div class="agt-notes-bar"><span>Notes for this run — the plan keeps its own</span>' +
                '<button class="agt-btn agt-notes-done" onclick="agtNotesDone(this)" title="Done (Ctrl+Enter)">Done</button></div>' +
            '<textarea class="agt-run-edit" spellcheck="true" aria-label="Notes for this section" ' +
                'oninput="agtNotesInput(this)" onkeydown="agtNotesKey(event, this)" ' +
                'placeholder="Notes, in Markdown. A line “- [ ] question” is a tick-box.">' +
                escapeHtml(agtBakeTicks(notes, (run.ticks || [])[i])) + '</textarea>' +
        '</div>';
    }
    if (!notes.trim()) {
        return '<div class="agt-notes-panel agt-notes-empty">' +
            '<button class="agt-btn agt-notes-edit" onclick="agtNotesEdit(this)" title="Notes for this run">+ Add notes</button></div>';
    }
    return '<div class="agt-notes-panel">' + agtNotesHtml(notes, (run.ticks || [])[i]) +
        '<button class="agt-btn agt-notes-edit agt-notes-corner" onclick="agtNotesEdit(this)" ' +
            'title="Edit these notes — for this run; the plan keeps its own">✎ Edit</button></div>';
}

function agtNotesEdit(btn) {
    const widget = agtGetWidget(btn);
    const run = widget._agtRun;
    if (!run) return;
    widget._agtEditing = run.index;
    agtRender(widget);
}

function agtNotesDone(el) {
    const widget = agtGetWidget(el);
    widget._agtEditing = null;
    agtRender(widget);
}

function agtNotesKey(event, textarea) {
    event.stopPropagation();
    if (event.key === 'Escape' || (event.key === 'Enter' && (event.ctrlKey || event.metaKey))) {
        event.preventDefault();
        agtNotesDone(textarea);
    }
}

/** Kept as it is typed, ticks and all: a "- [x]" written here is a tick. */
function agtNotesInput(textarea) {
    const widget = agtGetWidget(textarea), toolId = agtGetToolId(textarea);
    const data = agtGetData(toolId);
    const run = data.run;
    if (!run) return;
    run.notes = run.notes || run.durs.map(() => '');
    run.ticks = run.ticks || run.durs.map(() => []);
    run.notes[run.index] = textarea.value;
    run.ticks[run.index] = agtTickItems(textarea.value).map((c, k) => c ? k : -1).filter(k => k >= 0);
    agtSaveData(toolId, data);
    widget._agtRun = run;
    agtGrow(textarea);
}

/** Every section's notes as this run left them, as Markdown. */
function agtCopyNotes(btn) {
    const run = agtGetWidget(btn)._agtRun;
    if (!run) return;
    const text = run.names.map((name, j) => {
        const notes = agtBakeTicks((run.notes || [])[j], (run.ticks || [])[j]).trim();
        return notes ? '## ' + name + '\n\n' + notes : '';
    }).filter(Boolean).join('\n\n');
    copyTextToClipboard(text, 'Notes copied');
}

/** "4 to cover" for a section with tick-boxes. */
function agtCoverText(notes) {
    const n = agtTickItems(notes).length;
    return n ? n + ' to cover' : '';
}

function agtRunHtml(data, editing) {
    const run = data.run;
    if (run.done) return agtDoneHtml(run);
    const n = run.durs.length, i = run.index;
    return '<div class="agt-run">' +
        '<div class="agt-strip">' + run.durs.map((d, j) =>
            '<div class="agt-seg' + (j < i ? ' done' : j === i ? ' current' : '') + '" style="flex:' + Math.max(d, 1) + '" ' +
                'title="' + escapeHtml(run.names[j] + ' · ' + agtLength(d)) + '"><div class="agt-seg-fill"></div></div>').join('') +
        '</div>' +
        '<div class="agt-now">' +
            '<div class="agt-count">Section ' + (i + 1) + ' of ' + n + (run.since == null ? ' · paused' : '') + '</div>' +
            '<div class="agt-title">' + escapeHtml(run.names[i]) + '</div>' +
            '<div class="agt-clock" role="timer" aria-live="off"></div>' +
            '<div class="agt-of">of ' + agtLength(run.durs[i]) + (run.durs[i] !== run.planned[i] ? ' <span class="agt-was">(planned ' + agtLength(run.planned[i]) + ')</span>' : '') + '</div>' +
        '</div>' +
        '<div class="agt-status"><span class="agt-delta"></span><span class="agt-end"></span></div>' +
        agtRunNotesHtml(run, editing === i) +
        '<div class="agt-next">' + (i + 1 < n ? 'Next: <b>' + escapeHtml(run.names[i + 1]) + '</b> · ' + agtLength(run.durs[i + 1]) +
            (agtCoverText((run.notes || [])[i + 1]) ? ' · ' + agtCoverText(run.notes[i + 1]) : '') : 'Last section') + '</div>' +
        '<div class="agt-actions agt-controls">' +
            '<button class="agt-btn" onclick="agtBack(this)"' + (i ? '' : ' disabled') + ' title="Back to the section before">‹ Back</button>' +
            '<button class="agt-btn agt-pause" onclick="agtPause(this)">' + (run.since == null ? '▶ Resume' : '⏸ Pause') + '</button>' +
            '<button class="agt-btn" onclick="agtAddMinute(this)" title="One more minute for this section">+1 min</button>' +
            '<button class="agt-btn primary agt-next-btn" onclick="agtNext(this)">' + (i + 1 < n ? 'Next ›' : 'Finish') + '</button>' +
        '</div>' +
        '<div class="agt-actions agt-controls">' +
            '<button class="agt-btn agt-fit" onclick="agtFit(this)" title="Shrink what is left of the plan to end on time">Fit the rest</button>' +
            '<button class="agt-btn agt-stop" onclick="agtStop(this)" title="Stop, and go back to the plan">Stop</button>' +
            agtSoundHtml(data) +
        '</div>' +
        '<div class="agt-msg" aria-live="polite"></div>' +
    '</div>';
}

function agtDoneHtml(run) {
    const took = run.spent.reduce((a, b) => a + b, 0) / 1000;
    const planned = run.planned.reduce((a, b) => a + b, 0);
    const items = run.names.map((n, j) => agtTickItems((run.notes || [])[j]).length);
    const covered = items.some(Boolean);
    return '<div class="agt-run agt-done">' +
        '<div class="agt-title">Done</div>' +
        '<div class="agt-of">Took <b>' + agtClock(took) + '</b> of ' + agtLength(planned) + ' planned' +
            (run.durs.reduce((a, b) => a + b, 0) !== planned ? ' (' + agtLength(run.durs.reduce((a, b) => a + b, 0)) + ' fitted)' : '') + '</div>' +
        '<table class="agt-summary"><thead><tr><th>Section</th><th>Planned</th><th>Took</th>' +
            (covered ? '<th>Covered</th>' : '') + '</tr></thead><tbody>' +
            // Against the plan as written: what it was fitted to, and what Fit the rest
            // made of the parts already done, are not what anybody planned.
            run.names.map((name, j) => {
                const spent = run.spent[j] / 1000;
                const over = spent - run.planned[j] > 30;
                return '<tr><td>' + escapeHtml(name) + '</td><td>' + agtLength(run.planned[j]) + '</td>' +
                    '<td class="' + (over ? 'agt-over-text' : '') + '">' + agtClock(spent) + '</td>' +
                    (covered ? '<td' + (items[j] && ((run.ticks || [])[j] || []).length < items[j] ? ' class="agt-short-text"' : '') + '>' +
                        (items[j] ? ((run.ticks || [])[j] || []).length + ' of ' + items[j] : '') + '</td>' : '') + '</tr>';
            }).join('') +
        '</tbody></table>' +
        ((run.notes || []).some(n => String(n || '').trim()) ?
            '<details class="agt-done-notes" open><summary>Notes, as this run left them</summary>' +
                run.names.map((name, j) => String((run.notes || [])[j] || '').trim()
                    ? '<div class="agt-done-section"><div class="agt-done-name">' + escapeHtml(name) + '</div>' +
                        agtNotesHtml(run.notes[j], (run.ticks || [])[j]).replace(/ onchange="agtTickItem\(this\)"/g, ' disabled') + '</div>'
                    : '').join('') +
                '<div class="agt-note">They go with the run when you go back to the plan: copy them to keep them.</div>' +
            '</details>' : '') +
        '<div class="agt-actions">' +
            ((run.notes || []).some(n => String(n || '').trim())
                ? '<button class="agt-btn agt-copy-notes" onclick="agtCopyNotes(this)">Copy notes</button>' : '') +
            '<button class="agt-btn primary" onclick="agtStop(this, true)">Back to the plan</button></div>' +
    '</div>';
}

function agtRender(widget) {
    const toolId = agtGetToolId(widget);
    if (!toolId) return;
    const data = agtGetData(toolId);
    const run = data.run;
    widget._agtRun = run;
    widget.classList.toggle('agt-running', !!run && !run.done);
    widget.innerHTML = run ? agtRunHtml(data, widget._agtEditing) : agtEditHtml(toolId, data);
    const editor = widget.querySelector('.agt-run-edit');
    if (editor) {
        agtGrow(editor);
        editor.focus();
        editor.setSelectionRange(editor.value.length, editor.value.length);
    }
    if (!run) agtOpenNotes(widget).forEach(i => {
        const row = widget.querySelector('.agt-row[data-i="' + i + '"]');
        if (!row) return;
        row.querySelector('.agt-notes-box').hidden = false;
        row.querySelector('.agt-notes-btn').setAttribute('aria-expanded', 'true');
        agtGrow(row.querySelector('.agt-notes'));
    });
    // A section already over when it is drawn — after a reload, say — has had its chime.
    if (run && !run.done && agtLive(run, Date.now()).remaining <= 0) agtChimed.set(toolId, run.index);
    if (run && !run.done) { agtTick(widget); agtEnsureTicker(); }
}

/** The parts of a running timer that change by the second, without redrawing its buttons. */
function agtTick(widget) {
    const run = widget._agtRun;
    if (!run || run.done) return;
    const now = Date.now();
    const live = agtLive(run, now);
    const over = live.remaining <= 0;
    const clock = widget.querySelector('.agt-clock');
    if (!clock) return;
    clock.textContent = over ? '+' + agtClock(Math.floor(-live.remaining)) : agtClock(Math.ceil(live.remaining));
    const now$ = widget.querySelector('.agt-now');
    now$.classList.toggle('agt-warn', !over && live.remaining <= AGT_WARN_SECS);
    now$.classList.toggle('agt-over', over);
    now$.classList.toggle('agt-paused', run.since == null);
    const fill = widget.querySelector('.agt-seg.current .agt-seg-fill');
    if (fill) fill.style.width = Math.min(100, live.cur / Math.max(1, live.dur) * 100) + '%';
    const delta = widget.querySelector('.agt-delta');
    const b = Math.round(live.behind);
    delta.textContent = Math.abs(b) < 5 ? 'On time' : agtClock(Math.abs(b)) + (b > 0 ? ' behind' : ' ahead');
    delta.className = 'agt-delta' + (b >= 5 ? ' agt-behind' : b <= -5 ? ' agt-ahead' : '');
    const late = live.rest - live.left;
    widget.querySelector('.agt-end').textContent = 'Ends ~' + agtTimeOfDay(live.projectedEnd) +
        (Math.abs(late) >= 60 ? ' · time is up ' + agtTimeOfDay(live.plannedEnd) : '');
    const fit = widget.querySelector('.agt-fit');
    fit.disabled = !(late >= 30 && live.left > 0);
    const toolId = agtGetToolId(widget);
    if (over && run.since != null && agtChimed.get(toolId) !== run.index) {
        agtChimed.set(toolId, run.index);
        if (agtGetData(toolId).sound) agtChime();
    }
}

function agtEnsureTicker() {
    if (agtTimer) return;
    agtTimer = setInterval(() => {
        const running = document.querySelectorAll('.agt-widget.agt-running');
        if (!running.length) { clearInterval(agtTimer); agtTimer = null; return; }
        running.forEach(agtTick);
    }, 250);
}

/** Two soft notes: time is up for this section. */
function agtChime() {
    try {
        agtAudio = agtAudio || new (window.AudioContext || window.webkitAudioContext)();
        const t0 = agtAudio.currentTime;
        [880, 660].forEach((f, k) => {
            const o = agtAudio.createOscillator(), g = agtAudio.createGain();
            o.type = 'sine';
            o.frequency.value = f;
            g.gain.setValueAtTime(0.0001, t0 + k * 0.25);
            g.gain.exponentialRampToValueAtTime(0.2, t0 + k * 0.25 + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + k * 0.25 + 0.6);
            o.connect(g).connect(agtAudio.destination);
            o.start(t0 + k * 0.25);
            o.stop(t0 + k * 0.25 + 0.65);
        });
    } catch (e) { /* no sound to be had */ }
}

/** Change a running timer: `change` gets the run and now, after the time so far is counted. */
function agtChange(el, change) {
    const widget = agtGetWidget(el), toolId = agtGetToolId(el);
    const data = agtGetData(toolId);
    const run = data.run;
    if (!run) return;
    const now = Date.now();
    if (run.since != null && !run.done) {
        run.spent[run.index] += now - run.since;
        run.since = now;
    }
    const was = run.index;
    const msg = change(run, now);
    if (run.index !== was || run.done) widget._agtEditing = null;
    agtSaveData(toolId, data);
    agtRender(widget);
    if (msg) {
        const box = widget.querySelector('.agt-msg');
        if (box) box.textContent = msg;
    }
}

function agtNext(btn) {
    agtChange(btn, (run, now) => {
        if (run.index + 1 >= run.durs.length) {
            run.done = true;
            run.finishedAt = now;
            run.since = null;
        } else {
            run.index++;
        }
    });
}

function agtBack(btn) {
    agtChange(btn, (run) => { if (run.index > 0) run.index--; });
}

function agtPause(btn) {
    agtChange(btn, (run, now) => { run.since = run.since == null ? now : null; });
}

function agtAddMinute(btn) {
    agtChange(btn, (run) => { run.durs[run.index] += 60; });
}

/**
 * What is left of the plan, shrunk to the time that is left. The sections already
 * done count as what they took, so the plan stops saying the timer is behind for
 * time it can no longer get back.
 */
function agtFit(btn) {
    agtChange(btn, (run, now) => {
        const live = agtLive(run, now);
        if (live.left <= 0 || live.rest <= live.left) return '';
        const idx = [];
        for (let j = run.index; j < run.durs.length; j++) idx.push(j);
        const used = idx.map(j => Math.round(run.spent[j] / 1000));
        const rest = idx.map((j, k) => Math.max(0, Math.round(run.durs[j] - run.spent[j] / 1000)));
        const fitted = agtScale(rest, idx.map(j => run.fixed[j]), live.left, 15);
        idx.forEach((j, k) => { run.durs[j] = used[k] + fitted[k]; });
        for (let j = 0; j < run.index; j++) run.durs[j] = Math.round(run.spent[j] / 1000);
        return 'The rest now fits, to end at ' + agtTimeOfDay(live.plannedEnd) + '.';
    });
}

/** Stop asks once: the second press within a few seconds is the one that stops. */
function agtStop(btn, now) {
    if (!now && !btn.classList.contains('agt-confirm')) {
        btn.classList.add('agt-confirm');
        btn.textContent = 'Stop?';
        setTimeout(() => { if (btn.isConnected) { btn.classList.remove('agt-confirm'); btn.textContent = 'Stop'; } }, 3000);
        return;
    }
    const widget = agtGetWidget(btn), toolId = agtGetToolId(btn);
    const data = agtGetData(toolId);
    data.run = null;
    agtSaveData(toolId, data);
    agtChimed.delete(toolId);
    agtRender(widget);
}

// ---- ✨: what Chrome's own model can do for an agenda -------------------------

var AGT_AI_SYSTEM = 'You help people run interviews, meetings and talks. Be brief and concrete. ' +
    'Reply with the result only: no preface, no closing remarks.';
var AGT_AI_MAX_SECTIONS = 15;

/** "7.5 min" for the model, which could take 7:30 for a time of day. */
function agtAIMins(secs) {
    return (Math.round(secs / 30) / 2) + ' min';
}

/** What ✨ works on: the plan, the run so far, or the run as it ended. */
function agtAITarget(toolId) {
    const data = agtGetData(toolId);
    const run = data.run;
    if (!run) {
        const total = agtPlanSecs(data.sections).reduce((a, b) => a + b, 0);
        const text = data.sections.filter(s => String(s.name || '').trim() || s.minutes).map(s =>
            '## ' + (String(s.name || '').trim() || 'Untitled') + ' — ' + agtAIMins(agtPlanSecs([s])[0]) + (s.fixed ? ' (fixed)' : '') +
            (String(s.notes || '').trim() ? '\n\n' + String(s.notes).trim() : '')).join('\n\n');
        return { scope: 'whole', kind: 'plan', text: text ? 'Agenda, ' + agtAIMins(total) + ' planned.\n\n' + text : '',
            label: 'On this agenda (' + data.sections.length + ' section' + (data.sections.length === 1 ? '' : 's') + ', ' + agtLength(total) + ')',
            emptyLabel: 'No sections yet: draft some, or add them by hand.' };
    }
    const now = Date.now();
    const live = run.done ? null : agtLive(run, now);
    const took = (j) => live && j === run.index ? live.cur : run.spent[j] / 1000;
    const shown = run.done ? run.names.length : run.index + 1;
    const text = run.names.slice(0, shown).map((name, j) => {
        const notes = agtBakeTicks((run.notes || [])[j], (run.ticks || [])[j]).trim();
        return '## ' + name + ' — planned ' + agtAIMins(run.planned[j]) + ', took ' + agtClock(took(j)) +
            (!run.done && j === run.index ? ' so far' : '') + (notes ? '\n\n' + notes : '');
    }).join('\n\n');
    const head = run.done
        ? 'A run of this agenda, finished: it took ' + agtClock(run.spent.reduce((a, b) => a + b, 0) / 1000) + ' of ' +
            agtAIMins(run.planned.reduce((a, b) => a + b, 0)) + ' planned. Times taken are minutes:seconds. ' +
            '"[x]" is a point covered, "[ ]" one that was not.'
        : 'A run of this agenda, under way: section ' + (run.index + 1) + ' of ' + run.names.length + '. Times taken are ' +
            'minutes:seconds. "[x]" is a point covered.';
    return { scope: 'whole', kind: run.done ? 'done' : 'run', text: head + '\n\n' + text,
        label: run.done ? 'On this run, as it ended' : 'On this run so far' };
}

/** A draft from the model made into sections the plan can hold — or nothing usable. */
function agtAICleanDraft(json) {
    const list = json && Array.isArray(json.sections) ? json.sections : [];
    const sections = list.map(s => {
        const name = String((s && s.name) || '').replace(/\s+/g, ' ').trim().slice(0, 80);
        const minutes = Math.min(480, Math.max(0.5, Math.round((Number(s && s.minutes) || 0) * 2) / 2));
        const points = (Array.isArray(s && s.points) ? s.points : []).map(t =>
            String(t || '').replace(/^\s*(?:[-*+]\s*)?(?:\[[ xX]?\]\s*)?/, '').replace(/\s+/g, ' ').trim().slice(0, 160)).filter(Boolean).slice(0, 6);
        const out = { name, minutes };
        if (s && s.fixed === true) out.fixed = true;
        if (points.length) out.notes = points.map(t => '- [ ] ' + t).join('\n');
        return out;
    }).filter(s => s.name).slice(0, AGT_AI_MAX_SECTIONS);
    if (!sections.length) throw new Error('No sections came back. Try saying a little more about it.');
    return sections;
}

/** The draft as it will read in the plan. */
function agtAIDraftPreview(sections) {
    const total = sections.reduce((a, s) => a + s.minutes, 0);
    return sections.map((s, i) => (i + 1) + '. **' + s.name.replace(/([*_`\\])/g, '\\$1') + '** — ' + s.minutes + ' min' + (s.fixed ? ' 🔒' : '') +
        (s.notes ? '\n' + s.notes.split('\n').map(l => '    ' + l).join('\n') : '')).join('\n') +
        '\n\nTotal ' + total + ' min. Start still fits it to the time you have.';
}

/** A draft into the plan, through the ordinary save so Undo takes it back. Not while it runs. */
function agtAIApply(toolId, result, how, target, info) {
    if (!info || info.action !== 'draft' || !Array.isArray(info.data)) return false;
    const data = agtGetData(toolId);
    if (data.run) { if (typeof showToolToast === 'function') showToolToast('The timer is running: stop it to change the plan'); return false; }
    const draft = info.data.map(s => Object.assign({}, s));
    data.sections = how === 'replace' ? draft : data.sections.concat(draft);
    agtSaveData(toolId, data);
    document.querySelectorAll('.tool[data-tool="' + CSS.escape(toolId) + '"] .agt-widget').forEach(agtRender);
    return true;
}

function agtInit() {
    document.querySelectorAll('.agt-widget').forEach(widget => {
        if (widget.dataset.inited || !agtGetToolId(widget)) return;
        widget.dataset.inited = '1';
        agtRender(widget);
    });
}

// =============================================
// VACATION PLANNER
// =============================================
// A trip from one date to another, one tab a day. Each day is a time grid of
// blocks: every new day starts with its AM, XM and PM meals (breakfast, lunch,
// dinner), which move, change and go like any other block. A block can have a
// place, opened in Google Maps, and a day's places in time order make its route.
// Checklists beside it: packing, booking, before leaving, and one for each day.
// Nothing goes to Google until a link is clicked.
// Pixels to the hour, at the least: each view stretches its hours to fill the height it
// has (vacFit), and scrolls only when even these would not fit.
const VAC_PX = 30;          // a day's grid
const VAC_TRIP_PX = 16;     // the Trip view's columns
const VAC_SNAP = 15;        // the minutes a block moves and stretches by
const VAC_MAX_DAYS = 60;
const VAC_MAX_WAYPOINTS = 9; // Google Maps takes this many stops between the start and the end
const VAC_KINDS = [
    { id: 'food', label: 'Food', icon: '🍽️' },
    { id: 'activity', label: 'Activity', icon: '🎟️' },
    { id: 'flight', label: 'Flight', icon: '\u2708\uFE0F' },
    { id: 'drive', label: 'Drive', icon: '\uD83D\uDE97' },
    { id: 'travel', label: 'Other travel', icon: '\uD83D\uDE86' },
    { id: 'rest', label: 'Rest', icon: '🛏️' }
];
// The meals each new day starts with, times in minutes after midnight.
const VAC_MEALS = [
    { key: 'am', label: 'Breakfast', icon: '☕', start: 480, end: 540 },
    { key: 'xm', label: 'Lunch', icon: '🥪', start: 750, end: 810 },
    { key: 'pm', label: 'Dinner', icon: '🍽️', start: 1110, end: 1200 }
];
const VAC_LISTS = [
    { name: 'Packing', items: ['Passports and IDs', 'Phone chargers', 'Medicines', 'Toiletries', 'Swimwear'] },
    { name: 'To book', items: ['Travel there and back', 'Where to stay', 'Parking', 'Car rental'] },
    { name: 'Before we leave', items: ['Hold the mail', 'Water the plants', 'Out-of-office reply'] }
];
// The clothes table: a column for each type, and the outfits every day starts with.
const VAC_CLOTHES_TYPES = [
    { id: 'top', label: 'Top' }, { id: 'bottom', label: 'Bottom' }, { id: 'shoes', label: 'Shoes' },
    { id: 'layer', label: 'Layer' }, { id: 'extras', label: 'Extras' }
];
const VAC_OUTFIT_PRESETS = [
    { id: 'day', name: 'Day', auto: true, items: { top: 'T-shirt', bottom: 'Shorts', shoes: 'Sneakers' } },
    { id: 'evening', name: 'Evening', auto: true, items: { top: 'Shirt', bottom: 'Trousers', shoes: 'Loafers', layer: 'Light jacket' } }
];
// A colour for each new person, in turn.
const VAC_PEOPLE_COLORS = ['#27ae60', '#8e44ad', '#2980b9', '#d35400', '#c0392b', '#16a085', '#b7950b', '#7f8c8d'];
// The trip-wide tabs, before the days.
const VAC_PANES = [
    { id: 'people', label: '\uD83D\uDC65 People' }, { id: 'clothes', label: '\uD83D\uDC55 Clothes' }, { id: 'travel', label: '\u2708\uFE0F Travel' },
    { id: 'stay', label: '\uD83C\uDFE8 Stay' }, { id: 'cruise', label: '\uD83D\uDEA2 Cruise' }, { id: 'places', label: '\uD83D\uDCCD Places' }, { id: 'lists', label: '\u2611\uFE0F Lists' }, { id: 'meals', label: '\uD83C\uDF7D\uFE0F Meals' }, { id: 'budget', label: '\uD83D\uDCB0 Budget' }
];
// What the money goes on, for the Budget tab.
const VAC_BUDGET_CATS = [
    { id: 'stay', label: 'Stay', icon: '\uD83C\uDFE8' }, { id: 'travel', label: 'Travel', icon: '\u2708\uFE0F' },
    { id: 'cruise', label: 'Cruise', icon: '\uD83D\uDEA2' }, { id: 'food', label: 'Food', icon: '\uD83C\uDF7D\uFE0F' },
    { id: 'activity', label: 'Activities', icon: '\uD83C\uDF9F\uFE0F' }, { id: 'other', label: 'Other', icon: '\uD83D\uDCE6' }
];
// What is being looked at, per tool: not saved, so switching days is not an undo step.
const vacUi = new Map();

function vacGetToolId(el) { return el.closest('.tool')?.dataset.tool || null; }
function vacGetWidget(el) { return el.closest('.vac-widget'); }
function vacEsc(s) { return escapeHtml(s == null ? '' : String(s)); }
function vacNewId(prefix) { return (prefix || 'b') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function vacUiOf(toolId) {
    if (!vacUi.has(toolId)) vacUi.set(toolId, { view: 'trip', panel: 'block', list: null, sel: null, meals: false });
    return vacUi.get(toolId);
}

function vacDefaultPlan() {
    return {
        name: '', start: '', end: '',
        stays: [],
        home: null,          // where the trip starts and ends
        journeys: {},        // getting there and back: { out: {…}, back: {…} }
        meals: VAC_MEALS.map(m => ({ key: m.key, label: m.label, start: m.start, end: m.end })),
        hours: [6, 23],
        airportLead: 120,   // minutes before a flight to be at the airport
        breakEvery: 120,    // minutes between breaks on a drive; 0 for none
        days: {},
        parking: [],
        rentals: [],
        cruises: [],
        people: [],
        clothesTypes: VAC_CLOTHES_TYPES.map(t => Object.assign({}, t)),
        outfitPresets: JSON.parse(JSON.stringify(VAC_OUTFIT_PRESETS)),
        places: [],
        lists: VAC_LISTS.map((l, i) => ({ id: 'l' + (i + 1), name: l.name, items: l.items.map(t => ({ text: t, done: false })) }))
    };
}

/** One place to stay, as kept before there were several: the first stay, the whole trip long. */
function vacMigrateStay(plan) {
    if (plan.stay && !(plan.stays || []).length) {
        const dates = vacDates(plan);
        plan.stays = [{ id: 's-1', place: vacCopyPlace(plan.stay), inDate: dates[0] || '', inTime: null,
            outDate: dates[dates.length - 1] || '', outTime: null, conf: '', cost: '', phone: '', notes: '' }];
    }
    delete plan.stay;
    delete plan.geo;   // positions found for a map the planner no longer has
    plan.stays = plan.stays || [];
}

/** Where a cruise is on a date: its boarding port, the port it calls at, or where you leave it; at sea, nowhere. */
function vacCruisePlaceOn(c, date) {
    if (date === c.boardDate) return c.boardPlace || null;
    if (date === c.leaveDate) return c.leavePlace || c.boardPlace || null;
    const day = (c.days || {})[date];
    return day && day.port ? day.port : null;
}

/** Each cruise as a stay for a date: the ship is where you sleep, at the port it is in. */
function vacCruiseStays(plan, date) {
    return (plan.cruises || []).filter(c => c.boardDate).map(c => ({ id: c.id, cruise: true, name: c.ship || 'the ship',
        place: vacCruisePlaceOn(c, date), inDate: c.boardDate, inTime: c.boardTime, outDate: c.leaveDate || c.boardDate, outTime: c.leaveTime }));
}

/** A port call's all-aboard: as set, else half an hour before it sails. */
function vacAllAboard(day) { return day.aboard != null ? day.aboard : day.depart != null ? Math.max(0, day.depart - 30) : null; }

/** Where you wake on a date (checked in before it, not yet out) and where you sleep (in by it, out after it). */
function vacStaysOn(plan, date) {
    const live = (plan.stays || []).concat(vacCruiseStays(plan, date)).filter(s => s.place && s.inDate);
    const out = (s) => s.outDate || s.inDate;
    return {
        morning: live.find(s => s.inDate < date && out(s) >= date) || null,
        night: live.find(s => s.inDate <= date && out(s) > date) || null
    };
}

/** The place a day starts from: where you woke, else where you will sleep. */
function vacDayHome(plan, date) {
    const st = vacStaysOn(plan, date);
    return (st.morning || st.night || {}).place || null;
}

function vacStayPlaces(plan) { return (plan.stays || []).map(s => s.place).filter(Boolean); }

function vacGetData(toolId) {
    const c = loadToolCustomizations()[toolId] || {};
    const plan = Object.assign(vacDefaultPlan(), c.vacPlan ? JSON.parse(JSON.stringify(c.vacPlan)) : {});
    vacMigrateStay(plan);
    vacFixPins(plan);
    vacApplyNear(plan);
    vacEnsureDays(plan);
    vacEnsureOutfits(plan);
    return plan;
}

function vacSaveData(toolId, plan) {
    // Saved as drawn: a day's outfits from its presets are made before it is kept,
    // and linked blocks put in step.
    vacEnsureDays(plan);
    vacChainSettle(plan);
    vacEnsureOutfits(plan);
    const all = loadToolCustomizations();
    (all[toolId] = all[toolId] || {}).vacPlan = plan;
    saveToolCustomizations(all);
}

function vacIso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function vacDateOf(s) { return new Date(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)); }

/** The trip's days, first to last: the start alone when there is no end, at most VAC_MAX_DAYS. */
function vacDates(plan) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(plan.start || '')) return [];
    const last = plan.end && plan.end >= plan.start ? plan.end : plan.start;
    const out = [];
    for (let d = vacDateOf(plan.start); out.length < VAC_MAX_DAYS; d.setDate(d.getDate() + 1)) {
        const iso = vacIso(d);
        if (iso > last) break;
        out.push(iso);
    }
    return out;
}

function vacSeedDay(plan) {
    return { blocks: plan.meals.map(m => ({ id: vacNewId(), title: m.label, kind: 'food', meal: m.key, start: m.start, end: m.end })), list: [] };
}

function vacEnsureDays(plan) {
    vacDates(plan).forEach(d => {
        if (!plan.days[d]) plan.days[d] = vacSeedDay(plan);
        plan.days[d].blocks = plan.days[d].blocks || [];
        plan.days[d].list = plan.days[d].list || [];
        plan.days[d].outfits = plan.days[d].outfits || [];
        plan.days[d].outfitKeys = plan.days[d].outfitKeys || [];
    });
}

function vacPresetOf(plan, id) { return plan.outfitPresets.find(p => p.id === id) || null; }

/** A preset's items as an outfit's cells, nothing packed. */
function vacPresetItems(plan, pr) {
    const out = {};
    plan.clothesTypes.forEach(t => { const v = pr && pr.items[t.id]; if (v) out[t.id] = { text: v, packed: false }; });
    return out;
}

/** Whether an outfit is more than its preset made it: one added by hand, a cell changed, or anything packed. */
function vacRowTouched(plan, r) {
    if (!/^o\|/.test(r.id)) return true;
    const pr = vacPresetOf(plan, r.preset);
    return plan.clothesTypes.some(t => {
        const c = r.items[t.id];
        return (c && c.packed) || ((c && c.text) || '') !== ((pr && pr.items[t.id]) || '');
    }) || Object.keys(r.items).some(k => !plan.clothesTypes.some(t => t.id === k) && r.items[k] && r.items[k].text);
}

/**
 * Each day has an outfit for each preset marked every day, for each person (or for
 * everyone, when nobody has been added). Their ids are made from what they are, so
 * reading the plan twice makes the same ones; outfitKeys remembers what was made, so
 * one taken out stays out. Clothes kept as a list before there was a table move into
 * that person's Day outfit, under Extras.
 */
function vacEnsureOutfits(plan) {
    const people = plan.people || [];
    const whos = people.length ? people.map(p => p.id) : [''];
    const auto = plan.outfitPresets.filter(p => p.auto);
    vacDates(plan).forEach(d => {
        const day = plan.days[d];
        day.outfits = day.outfits || [];
        day.outfitKeys = day.outfitKeys || [];
        if (day.clothes && day.clothes.length) {
            const by = new Map();
            day.clothes.forEach(it => { const w = vacPerson(plan, it.who) ? it.who : ''; if (!by.has(w)) by.set(w, []); by.get(w).push(it.text); });
            by.forEach((texts, w) => {
                const key = w + '|day';
                if (day.outfitKeys.includes(key)) return;
                day.outfitKeys.push(key);
                day.outfits.push({ id: 'o|' + d + '|' + key, preset: 'day', who: w, items: { extras: { text: texts.join(', '), packed: false } } });
            });
        }
        delete day.clothes;
        // Once there are people, everyone's outfits that were never changed give way to theirs.
        if (people.length) day.outfits = day.outfits.filter(r => {
            if (r.who || vacRowTouched(plan, r)) return true;
            day.outfitKeys = day.outfitKeys.filter(k => k !== '|' + r.preset);
            return false;
        });
        whos.forEach(w => auto.forEach(pr => {
            const key = w + '|' + pr.id;
            if (day.outfitKeys.includes(key)) return;
            day.outfitKeys.push(key);
            day.outfits.push({ id: 'o|' + d + '|' + key, preset: pr.id, who: w, items: vacPresetItems(plan, pr) });
        }));
    });
}

/** A day's outfits in the table's order: by preset, then by person. */
function vacSortedOutfits(plan, outfits) {
    const pi = (id) => { const i = plan.outfitPresets.findIndex(p => p.id === id); return i < 0 ? 99 : i; };
    const wi = (id) => id ? (plan.people || []).findIndex(p => p.id === id) + 1 : 0;
    return outfits.slice().sort((a, b) => pi(a.preset) - pi(b.preset) || wi(a.who) - wi(b.who));
}

/** Whether leaving a day out loses anything: more than its meals, as they came. */
function vacHasPlans(plan, day) {
    return !!day && (!!(day.label || '').trim() || day.list.length > 0 || (day.outfits || []).some(r => vacRowTouched(plan, r)) ||
        day.blocks.some(b => !b.meal || b.place || b.notes || b.done));
}

function vacParseTime(s) {
    const m = /^(\d{1,2}):(\d{2})/.exec(s || '');
    return m ? Math.min(1440, +m[1] * 60 + +m[2]) : null;
}

function vacTimeValue(min) {
    const t = Math.min(min, 1439);
    return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
}

function vacTimeLabel(min) {
    return new Date(2000, 0, 1, Math.floor(min / 60), min % 60).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function vacHourLabel(h) {
    return new Date(2000, 0, 1, h).toLocaleTimeString([], { hour: 'numeric' });
}

function vacDayLabel(date, style) {
    return vacDateOf(date).toLocaleDateString([], style === 'long'
        ? { weekday: 'long', month: 'long', day: 'numeric' }
        : { weekday: 'short', month: 'short', day: 'numeric' });
}

const VAC_TAB_LABEL = 16;   // characters of a day's label shown on its tab

function vacDayText(plan, date) { return ((plan.days[date] || {}).label || '').trim(); }

/** A day's date and, when it has one, its label: "Fri, Jul 9 · Beach day". */
function vacDayName(plan, date, style) {
    const label = vacDayText(plan, date);
    return vacDayLabel(date, style) + (label ? ' · ' + label : '');
}

function vacTabText(plan, date) {
    const label = vacDayText(plan, date);
    return vacDayLabel(date, 'short') + (label ? ' · ' + (label.length > VAC_TAB_LABEL ? label.slice(0, VAC_TAB_LABEL - 1) + '…' : label) : '');
}

/** A day's label, kept as typed. Only its tab changes, so the field moved to keeps the focus. */
function vacSetDayLabel(el) {
    const date = el.closest('.vac-day').dataset.date, widget = vacGetWidget(el);
    vacMutate(el, (plan) => {
        if (!plan.days[date]) return 'none';
        const label = el.value.trim();
        if (label) plan.days[date].label = label; else delete plan.days[date].label;
    }, { draw: false });
    const plan = vacGetData(vacGetToolId(widget)), tab = widget.querySelector('.vac-tab[data-view="' + date + '"]');
    if (tab) { tab.textContent = vacTabText(plan, date); tab.title = vacDayName(plan, date, 'long'); }
}

/**
 * A place from what was typed: an address, or a Google Maps link. A link keeps its
 * address, and gives up what it carries itself — the place's name and where its pin
 * is. A short maps.app.goo.gl link carries neither, so it stays a link.
 */
function vacParsePlace(text) {
    const s = String(text || '').trim();
    if (!s) return null;
    if (!/^https?:\/\//i.test(s)) return { label: '', address: s };
    const p = { label: '', address: '', url: s };
    let u;
    try { u = new URL(s); } catch (e) { return p; }
    let path = u.pathname;
    try { path = decodeURIComponent(path.replace(/\+/g, ' ')); } catch (e) { /* kept as it came */ }
    const named = /\/maps\/place\/([^/]+)/.exec(path);
    if (named) p.label = named[1].trim();
    // The place's own pin (!3d…!4d…), never @lat,lng: that is the middle of the map as it
    // was scrolled when the link was copied, which can be streets away from the place.
    const pin = /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/.exec(s);
    if (pin) { p.lat = +pin[1]; p.lng = +pin[2]; }
    const q = (u.searchParams.get('query') || u.searchParams.get('q') || u.searchParams.get('destination') || '').trim();
    const at = /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/.exec(q);
    if (at) { p.lat = +at[1]; p.lng = +at[2]; }
    else if (q) p.address = q;
    return p;
}

/** What directions to a place go to, said: its address, its pin, its name, or nothing Maps can use. */
function vacPlaceTarget(p) {
    if (!p) return { kind: 'none', text: '' };
    if (p.address) return { kind: 'address', text: vacPlaceText(p) };
    if (p.lat != null && p.lng != null) return { kind: 'pin', text: p.lat + ', ' + p.lng };
    if (p.label) return { kind: 'name', text: vacPlaceQuery(p) };
    return { kind: 'none', text: '' };
}

/** The line under a place: where directions go, and a link to see exactly that spot. */
function vacPlaceTargetHtml(p) {
    const t = vacPlaceTarget(p);
    if (t.kind === 'none') return p && p.url ? '<div class="vac-ptarget vac-ptarget-none">Directions cannot find it: a short Maps link carries no address or pin. Give it an address.</div>' : '';
    const check = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(t.kind === 'pin' ? p.lat + ',' + p.lng : t.text);
    return '<div class="vac-ptarget">Directions go to: ' + (t.kind === 'pin' ? '📍 pin ' : t.kind === 'name' ? 'the name ' : '') + vacEsc(t.text) +
        ' <a href="' + vacEsc(check) + '" target="_blank" rel="noopener noreferrer" title="Open Maps at exactly this">Check</a>' +
        (t.kind === 'name' ? ' <span class="vac-hint">(' + (p.near ? 'looked for in the destination; an address is surer' : 'a name alone can match another place near you: set the trip\u2019s destination, or give it an address') + ')</span>' : '') + '</div>';
}

/** Two names for the same place: one in the other, or a long word they share. */
function vacNamesAgree(a, b) {
    const n = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    const x = n(a), y = n(b);
    if (!x || !y || x.includes(y) || y.includes(x)) return true;
    const words = new Set(x.split(' ').filter(w => w.length >= 4));
    return y.split(' ').some(w => w.length >= 4 && words.has(w));
}

/** Renamed: a link (and its pin) for some other place is let go, so the name and where it goes agree. */
function vacRenamePlace(p, label) {
    p.label = label;
    if (!p.url) return p;
    const linkName = (vacParsePlace(p.url) || {}).label;
    if (label && linkName && !vacNamesAgree(linkName, label)) { delete p.url; delete p.lat; delete p.lng; }
    return p;
}

/** Saved before: a pin taken from a link's map centre (@lat,lng), not the place's own, is let go. */
function vacFixPins(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(vacFixPins); return; }
    if (typeof node.url === 'string' && node.lat != null && !/!3d-?\d/.test(node.url) &&
        !/[?&](query|q|destination)=-?\d+(\.\d+)?(%2C|,)/i.test(node.url)) { delete node.lat; delete node.lng; }
    Object.keys(node).forEach(k => { if (node[k] && typeof node[k] === 'object') vacFixPins(node[k]); });
}

/**
 * What Maps is asked to find for a place: its name and address; for a place with only
 * a name, the trip's destination after it (`near`, set on reading), so "The Getty"
 * is looked for as "The Getty, Los Angeles, CA" and not near wherever you are.
 */
function vacPlaceQuery(p) {
    const t = vacPlaceText(p);
    return t && p.near && !p.address && p.lat == null ? t + ', ' + p.near : t;
}

/**
 * On reading: each place that has only a name, where the trip is, is given the
 * destination to be looked for in — not kept (it is not enumerable, so it is never
 * saved), so changing the destination changes them all. Airports, parking lots and
 * home are left out: they are where you set off from.
 */
function vacApplyNear(plan) {
    const dest = String(plan.destination || '').trim();
    if (!dest) return;
    const lots = (plan.parking || []).map(pk => pk.lot).filter(Boolean);
    const near = (p) => {
        if (!p || typeof p !== 'object' || !p.label || p.address || p.lat != null) return;
        if (/\bairport\b/i.test(p.label) || lots.some(l => vacSamePlace(l, p)) || vacIsHome(plan, p)) return;
        Object.defineProperty(p, 'near', { value: dest, enumerable: false, configurable: true, writable: true });
    };
    (plan.places || []).forEach(near);
    (plan.stays || []).forEach(s => near(s.place));
    (plan.rentals || []).forEach(r => { near(r.pickPlace); near(r.dropPlace); });
    Object.values(plan.days || {}).forEach(day => (day.blocks || []).forEach(b => {
        near(b.place);
        if (b.drive) { near(b.drive.from); near(b.drive.to); (b.drive.stops || []).forEach(near); }
    }));
}

function vacPlaceText(p) {
    return p ? [p.label, p.address].filter(Boolean).join(', ') : '';
}

function vacPlaceName(p) {
    return p ? (p.label || p.address || (p.url ? 'Google Maps link' : '')) : '';
}

/** Where the place opens in Google Maps: its own link, or a search for it. */
function vacPlaceUrl(p) {
    if (!p) return '';
    if (p.url) return p.url;
    const q = vacPlaceQuery(p) || (p.lat != null ? p.lat + ',' + p.lng : '');
    return q ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q) : '';
}

/**
 * A place as a stop on a route, as Google Maps is told it: its name and address where
 * it has an address (Maps finds the place, and shows it by name); else its pin, exact;
 * else its name alone.
 */
function vacRouteStop(p) {
    if (!p) return '';
    if (p.address) return vacPlaceText(p);
    if (p.lat != null && p.lng != null) return p.lat + ',' + p.lng;
    return vacPlaceQuery(p);
}

function vacSamePlace(a, b) {
    return !!a && !!b && (a.label || '') === (b.label || '') && (a.address || '') === (b.address || '') && (a.url || '') === (b.url || '');
}

function vacCopyPlace(p) {
    if (!p) return null;
    const out = { label: p.label || '', address: p.address || '' };
    if (p.url) out.url = p.url;
    if (p.lat != null && p.lng != null) { out.lat = p.lat; out.lng = p.lng; }
    return out;
}

/** The day's places in time order, from where you woke and to where you sleep, when those are known. */
function vacRouteStops(plan, date) {
    const day = plan.days[date];
    const stops = [];
    const push = (p) => { const q = vacRouteStop(p); if (q && stops[stops.length - 1] !== q) stops.push(q); };
    const st = vacStaysOn(plan, date);
    const from = (st.morning || st.night || {}).place, to = (st.night || st.morning || {}).place;
    if (from) push(from);
    (day ? day.blocks : []).slice().sort((a, b) => a.start - b.start || a.end - b.end).forEach(b => vacBlockStops(b).forEach(push));
    if (to && stops.length > 1) push(to);
    return stops;
}

function vacRouteUrl(stops) {
    if (stops.length < 2) return '';
    return vacDirUrl(stops[0], stops.slice(1, -1), stops[stops.length - 1]);
}

/** Google Maps directions; with no origin, Maps starts from wherever you are. */
function vacDirUrl(origin, mid, dest) {
    const via = mid.slice(0, VAC_MAX_WAYPOINTS);
    return 'https://www.google.com/maps/dir/?api=1' + (origin ? '&origin=' + encodeURIComponent(origin) : '') +
        '&destination=' + encodeURIComponent(dest) + (via.length ? '&waypoints=' + encodeURIComponent(via.join('|')) : '');
}

function vacAddDays(iso, n) {
    const d = vacDateOf(iso);
    d.setDate(d.getDate() + n);
    return vacIso(d);
}

/** An airport, as a place to find: its code or name, as an airport. */
function vacAirportPlace(code) {
    const c = String(code || '').trim();
    return c ? { label: /airport/i.test(c) ? c : c + ' airport', address: '' } : null;
}

function vacFlightStatusUrl(fl) {
    return fl && fl.number ? 'https://www.google.com/search?q=' + encodeURIComponent(fl.number + ' flight status') : '';
}

/** The places a block takes you to, in order: a flight its airport, a drive its start, stops and end. */
function vacBlockStops(b) {
    if (b.kind === 'flight') return b.flight && b.flight.from ? [vacAirportPlace(b.flight.from)] : [];
    if (b.kind === 'drive') { const d = b.drive || {}; return [d.from].concat(d.stops || [], [d.to]).filter(Boolean); }
    return b.place ? [b.place] : [];
}

/** Whether a place is home: what is passed on (the list, the calendar) says Home, never its address. */
function vacIsHome(plan, p) { return !!(p && plan.home && vacSamePlace(p, plan.home)); }

/** A length of time in words: 25 min, 1 h, 1 h 15 min. */
function vacDur(min) {
    const h = Math.floor(min / 60), m = min % 60;
    return h ? h + ' h' + (m ? ' ' + m + ' min' : '') : m + ' min';
}

/** A drive's directions: from its start (or wherever you are), through its stops, to its end. */
function vacDriveUrl(b, plan, date) {
    const d = b.drive || {}, to = vacRouteStop(d.to);
    if (!to) return '';
    const from = vacRouteStop(d.from) || (plan && date ? vacRouteStop(vacDriveOrigin(plan, date, b)) : '');
    return vacDirUrl(from || null, (d.stops || []).map(vacRouteStop).filter(Boolean), to);
}

/**
 * Where a drive with no start of its own sets off: where the day's last block before
 * it ended up (a place, or a drive's end), else where you woke. Without it, Google
 * Maps would start from wherever the phone is.
 */
function vacDriveOrigin(plan, date, b) {
    const day = plan.days[date];
    const before = (day ? day.blocks : []).filter(x => x !== b && x.start < b.start).sort((x, y) => y.start - x.start || y.end - x.end);
    for (const x of before) {
        // After a flight, you are where it lands, not where it left from.
        if (x.kind === 'flight') {
            const fl = x.flight || {};
            if (!(fl.arriveDay > 0) && fl.to) return vacAirportPlace(fl.to);
            continue;
        }
        const p = x.kind === 'drive' ? (x.drive || {}).to : x.place;
        if (vacRouteStop(p)) return p;
    }
    // A flight from an earlier day that lands this day, before it.
    const landed = vacAllFlights(plan).filter(f => f.date < date && vacAddDays(f.date, (f.b.flight || {}).arriveDay || 0) === date &&
        ((f.b.flight || {}).arrive != null ? f.b.flight.arrive : 0) <= b.start && (f.b.flight || {}).to);
    if (landed.length) return vacAirportPlace(landed[landed.length - 1].b.flight.to);
    return vacDayHome(plan, date);
}

/**
 * A flight's check-in times: online check-in opening (`checkinH` hours before take-off,
 * 24 unless set; 0 for none), and at the airport bag drop closing and the gate closing
 * (`bagMin`, `gateMin` minutes before; none unless set). Each as { date, at }.
 */
function vacFlightTimes(date, b) {
    const fl = b.flight || {}, out = {};
    const h = fl.checkinH == null ? 24 : +fl.checkinH;
    if (h > 0) { const t = b.start - h * 60, days = Math.floor(t / 1440); out.online = { date: vacAddDays(date, days), at: t - days * 1440 }; }
    if (fl.bagMin) out.bag = { date, at: Math.max(0, b.start - fl.bagMin) };
    if (fl.gateMin) out.gate = { date, at: Math.max(0, b.start - fl.gateMin) };
    return out;
}

/** In a flight's panel or card: when to check in, and when bags and the gate close. */
function vacFlightTimesHtml(plan, date, b) {
    const fl = b.flight || {}, on = ' onchange="vacEditField(this)"', t = date ? vacFlightTimes(date, b) : {};
    const sel = (key, values, cur, label) => '<select data-f="' + key + '"' + on + '>' + values.map(v => '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + label(v) + '</option>').join('') + '</select>';
    const when = (x) => x ? ' <span class="vac-ftime">' + vacEsc(vacDayLabel(x.date, 'short')) + ' ' + vacTimeLabel(x.at) + '</span>' : '';
    const at = (x) => x ? ' <span class="vac-ftime">' + vacTimeLabel(x.at) + '</span>' : '';
    return '<div class="vac-fcheck">' +
        '<div class="vac-row"><label class="vac-inline">✅ Online check-in opens ' + sel('f_checkinH', [24, 30, 36, 48, 72, 0], fl.checkinH == null ? 24 : +fl.checkinH,
            v => v ? v + ' h before' : 'not online') + '</label>' + when(t.online) + '</div>' +
        '<div class="vac-row"><label class="vac-inline">🧳 Bag drop closes ' + sel('f_bagMin', [0, 30, 40, 45, 60, 75, 90], fl.bagMin || 0, v => v ? vacDur(v) + ' before' : 'not set') + '</label>' + at(t.bag) + '</div>' +
        '<div class="vac-row"><label class="vac-inline">🚪 Gate closes ' + sel('f_gateMin', [0, 10, 15, 20, 25, 30, 45], fl.gateMin || 0, v => v ? vacDur(v) + ' before' : 'not set') + '</label>' + at(t.gate) + '</div>' +
    '</div>';
}

/** A flight's end on its day: its landing when that is the same day, else midnight. */
function vacFlightEnd(b) {
    const fl = b.flight || (b.flight = {});
    if (fl.arriveDay > 0) b.end = 1440;
    else b.end = fl.arrive != null && fl.arrive > b.start ? fl.arrive : Math.min(1440, b.start + 60);
}

/** A place from what was typed: a place kept by that name, or an address or Maps link. */
function vacResolvePlace(plan, text) {
    const t = String(text || '').trim();
    if (!t) return null;
    const known = vacStayPlaces(plan).concat(plan.places).find(x => x && x.label && x.label.toLowerCase() === t.toLowerCase());
    return known ? vacCopyPlace(known) : vacParsePlace(t);
}

function vacPlaceInput(p) { return p ? (p.url || p.label || p.address || '') : ''; }

/** What happens on a day besides its blocks: flights landing from an earlier day, and parking. */
function vacDayEvents(plan, date) {
    const out = [];
    vacDates(plan).forEach(d => plan.days[d].blocks.forEach(b => {
        if (b.kind !== 'flight') return;
        const nm = vacBlockInfo(plan, b).title, t = vacFlightTimes(d, b);
        if (t.online && t.online.date === date) out.push({ icon: '\u2705', text: 'Online check-in opens ' + vacTimeLabel(t.online.at) + ' \u00B7 ' + nm, url: '', at: t.online.at });
        if (t.bag && d === date) out.push({ icon: '\uD83E\uDDF3', text: 'Bag drop closes ' + vacTimeLabel(t.bag.at) + ' \u00B7 ' + nm, url: '', at: t.bag.at });
        if (t.gate && d === date) out.push({ icon: '\uD83D\uDEAA', text: 'Gate closes ' + vacTimeLabel(t.gate.at) + ' \u00B7 ' + nm, url: '', at: t.gate.at });
    }));
    vacDates(plan).forEach(d => plan.days[d].blocks.forEach(b => {
        const fl = b.flight;
        if (b.kind === 'flight' && fl && fl.arriveDay > 0 && vacAddDays(d, fl.arriveDay) === date)
            out.push({ icon: '✈️', text: vacBlockInfo(plan, b).title + ' arrives' + (fl.arrive != null ? ' ' + vacTimeLabel(fl.arrive) : '') +
                (fl.to ? ' at ' + fl.to : ''), url: '', at: fl.arrive || 0 });
    }));
    (plan.stays || []).forEach(st => {
        const name = vacPlaceName(st.place), url = vacPlaceUrl(st.place);
        if (st.outDate && st.outDate === date) out.push({ icon: '\uD83C\uDFE8', text: 'Check out' + (st.outTime != null ? ' ' + vacTimeLabel(st.outTime) : '') +
            (name ? ' \u00B7 ' + name : ''), url, at: st.outTime != null ? st.outTime : 600 });
        if (st.inDate === date) out.push({ icon: '\uD83C\uDFE8', text: 'Check in' + (st.inTime != null ? ' ' + vacTimeLabel(st.inTime) : '') +
            (name ? ' \u00B7 ' + name : ''), url, at: st.inTime != null ? st.inTime : 900 });
    });
    (plan.cruises || []).forEach(c => {
        if (!c.boardDate || date < c.boardDate || date > (c.leaveDate || c.boardDate)) return;
        const ship = c.ship || 'the ship';
        if (date === c.boardDate) out.push({ icon: '\uD83D\uDEA2', text: 'Board ' + ship + (c.boardTime != null ? ' ' + vacTimeLabel(c.boardTime) : '') +
            (c.allAboard != null ? ' \u00B7 all aboard ' + vacTimeLabel(c.allAboard) : ''), url: vacPlaceUrl(c.boardPlace), at: c.boardTime != null ? c.boardTime : 780 });
        else if (date === c.leaveDate) out.push({ icon: '\uD83D\uDEA2', text: 'Leave ' + ship + (c.leaveTime != null ? ' ' + vacTimeLabel(c.leaveTime) : ''),
            url: vacPlaceUrl(c.leavePlace || c.boardPlace), at: c.leaveTime != null ? c.leaveTime : 480 });
        else {
            const day = (c.days || {})[date] || {};
            if (!day.port) out.push({ icon: '\uD83C\uDF0A', text: 'At sea', url: '', at: 0 });
            else out.push({ icon: '\u2693', text: 'In port: ' + vacPlaceName(day.port) +
                (day.arrive != null ? ' ' + vacTimeLabel(day.arrive) + (day.depart != null ? '\u2013' + vacTimeLabel(day.depart) : '') : '') +
                (vacAllAboard(day) != null ? ' \u00B7 all aboard ' + vacTimeLabel(vacAllAboard(day)) : ''), url: vacPlaceUrl(day.port), at: day.arrive || 0 });
        }
    });
    (plan.rentals || []).forEach(r => {
        const name = r.company || vacPlaceName(r.pickPlace) || 'Rental car', back = r.dropPlace || r.pickPlace;
        if (r.pickDate === date) out.push({ icon: '\uD83D\uDE99', text: 'Pick up' + (r.pickTime != null ? ' ' + vacTimeLabel(r.pickTime) : '') + ' \u00B7 ' + name,
            url: vacPlaceUrl(r.pickPlace), at: r.pickTime != null ? r.pickTime : 600 });
        if (r.dropDate === date) out.push({ icon: '\uD83D\uDE99', text: 'Return' + (r.dropTime != null ? ' ' + vacTimeLabel(r.dropTime) : '') + ' \u00B7 ' + name,
            url: vacPlaceUrl(back), at: r.dropTime != null ? r.dropTime : 600 });
    });
    (plan.parking || []).forEach(pk => {
        const lot = vacPlaceName(pk.lot), url = vacPlaceUrl(pk.lot);
        if (pk.fromDate === date) out.push({ icon: '🅿️', text: 'Drop off' + (pk.fromTime != null ? ' ' + vacTimeLabel(pk.fromTime) : '') +
            (lot ? ' · ' + lot : ''), url, at: pk.fromTime || 0 });
        if (pk.toDate === date) out.push({ icon: '🅿️', text: 'Pick up' + (pk.toTime != null ? ' ' + vacTimeLabel(pk.toTime) : '') +
            (lot ? ' · ' + lot : '') + (pk.spot ? ' · ' + pk.spot : ''), url, at: pk.toTime || 0 });
    });
    return out.sort((a, b) => a.at - b.at);
}

/** Blocks that overlap sit side by side: for each, its column and how many share its stretch. */
function vacLayout(blocks) {
    const sorted = blocks.slice().sort((a, b) => a.start - b.start || b.end - a.end);
    const out = new Map();
    let cluster = [], ends = [], clusterEnd = -1;
    const flush = () => { cluster.forEach(x => out.set(x.id, { col: x.col, cols: ends.length })); cluster = []; ends = []; };
    sorted.forEach(b => {
        if (b.start >= clusterEnd) { flush(); clusterEnd = -1; }
        let col = ends.findIndex(e => e <= b.start);
        if (col < 0) { col = ends.length; ends.push(b.end); } else ends[col] = b.end;
        cluster.push({ id: b.id, col });
        clusterEnd = Math.max(clusterEnd, b.end);
    });
    flush();
    return out;
}

/** The hours shown: the trip's, stretched to take in any block outside them. */
function vacSpan(plan, blocks) {
    // Each end chosen (`plan.showHours`, the end up to 28: 4 AM the next day), or the trip's, stretched to take in any block.
    const fix = plan.showHours || [];
    let h0 = fix[0] != null ? fix[0] : plan.hours[0], h1 = fix[1] != null ? fix[1] : plan.hours[1];
    blocks.forEach(b => {
        if (fix[0] == null) h0 = Math.min(h0, Math.floor(b.start / 60));
        if (fix[1] == null) h1 = Math.max(h1, Math.ceil(b.end / 60));
    });
    return [h0, Math.max(h1, h0 + 1)];
}

/**
 * What a day's column shows from h0 to h1: its blocks in the hours, and past midnight
 * the next day's (`shift` 1440); its blocks wholly before or after the hours, for the
 * markers on its edges.
 */
function vacColumn(plan, date, h0, h1) {
    const shown = [], above = [], below = [];
    (plan.days[date] || { blocks: [] }).blocks.forEach(b => {
        if (b.end <= h0 * 60 && b.end > b.start) above.push(b);
        else if (b.start >= h1 * 60) below.push(b);
        else shown.push({ b, date, shift: 0 });
    });
    const next = vacAddDays(date, 1);
    if (h1 > 24 && plan.days[next]) plan.days[next].blocks.forEach(b => { if (b.start < (h1 - 24) * 60) shown.push({ b, date: next, shift: 1440 }); });
    above.sort((a, b) => b.end - a.end || b.start - a.start);
    below.sort((a, b) => a.start - b.start || a.end - b.end);
    const lay = vacLayout(shown.map(x => ({ id: x.b.id, start: x.b.start + x.shift, end: x.b.end + x.shift })));
    // Room under each block: to the next block below it that shares any of its width, else the end of the hours.
    const room = new Map(), side = (x) => { const l = lay.get(x.b.id); return [l.col / l.cols, (l.col + 1) / l.cols]; };
    shown.forEach(x => {
        const [l0, r0] = side(x), end = x.b.end + x.shift;
        let at = h1 * 60;
        shown.forEach(y => {
            if (y === x) return;
            const s = y.b.start + y.shift, [l1, r1] = side(y);
            if (s >= end && s < at && l1 < r0 && l0 < r1) at = s;
        });
        room.set(x.b.id, at);
    });
    return { shown, above, below, next: plan.days[next] ? next : null, lay, room };
}

/** A marker on the top or bottom edge, for the blocks outside the hours shown: the nearest named, the rest counted. */
function vacEdgeHtml(plan, list, where, date, compact) {
    if (!list.length) return '';
    const name = (b) => vacBlockInfo(plan, b).title, b = list[0];
    const tip = (list.length === 1 ? 'Outside the hours shown: ' : list.length + ' blocks outside the hours shown:\n') +
        list.map(x => vacTimeLabel(x.start) + ' ' + name(x)).join('\n') + '\nClick to choose ' + (list.length === 1 ? 'it' : 'the nearest');
    const arrow = where === 'top' ? '▲' : '▼';
    return '<button class="vac-edge vac-edge-' + where + '" data-id="' + vacEsc(b.id) + '" data-date="' + date + '" onpointerdown="event.stopPropagation()" onclick="vacEdgePick(this)" title="' + vacEsc(tip) + '">' +
        (compact ? arrow + list.length : arrow + ' ' + vacEsc(name(b)) + ' ' + vacTimeLabel(b.start) + (list.length > 1 ? ' +' + (list.length - 1) + ' more' : '')) + '</button>';
}

/** A marker clicked: its block chosen, on its day. */
function vacEdgePick(el) {
    vacMutate(el, (plan, ui) => { ui.view = el.dataset.date; ui.sel = el.dataset.id; return false; });
}

/** The hours to show, on each day and in the Trip view: each end Auto or chosen. */
function vacHoursHtml(plan) {
    const fix = plan.showHours || [];
    const opt = (h, cur, label) => '<option value="' + h + '"' + (h === cur ? ' selected' : '') + '>' + label + '</option>';
    const from = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => opt(h, fix[0], h === 0 ? 'Midnight' : vacHourLabel(h))).join('');
    const to = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28].map(h => opt(h, fix[1], h === 24 ? 'Midnight' : h > 24 ? vacHourLabel(h) + ' +1' : vacHourLabel(h))).join('');
    return '<span class="vac-hours" title="The hours shown, on each day and in the Trip view. Past midnight, the next day’s first hours">🕘 ' +
        '<select class="vac-hours-from" onchange="vacSetHours(this)"><option value=""' + (fix[0] == null ? ' selected' : '') + '>Auto</option>' + from + '</select>–' +
        '<select class="vac-hours-to" onchange="vacSetHours(this)"><option value=""' + (fix[1] == null ? ' selected' : '') + '>Auto</option>' + to + '</select></span>';
}

function vacSetHours(el) {
    const box = el.closest('.vac-hours'), from = box.querySelector('.vac-hours-from').value, to = box.querySelector('.vac-hours-to').value;
    vacMutate(el, (plan) => {
        if (from === '' && to === '') delete plan.showHours;
        else plan.showHours = [from === '' ? null : +from, to === '' ? null : +to];
    });
}

function vacBlockInfo(plan, b) {
    const meal = b.meal && VAC_MEALS.find(m => m.key === b.meal);
    const kind = VAC_KINDS.find(k => k.id === b.kind) || VAC_KINDS[1];
    const fl = kind.id === 'flight' ? b.flight || {} : null, dr = kind.id === 'drive' ? b.drive || {} : null;
    const auto = fl && fl.number ? 'Flight ' + fl.number : dr && dr.to ? 'Drive to ' + vacPlaceName(dr.to) : kind.label;
    const where = fl ? [fl.from, fl.to].filter(Boolean).join(' → ')
        : dr ? [dr.from, dr.to].filter(Boolean).map(vacPlaceName).join(' → ')
        : vacPlaceName(b.place);
    const times = vacTimeLabel(b.start) + '–' + (fl && fl.arriveDay > 0
        ? (fl.arrive != null ? vacTimeLabel(fl.arrive) : '?') + ' +' + fl.arriveDay
        : vacTimeLabel(b.end));
    return { meal, kind, icon: meal ? meal.icon : kind.icon, title: b.title || auto, auto, where, times };
}

function vacBlockHtml(plan, b, h0, px, lay, opts) {
    const info = vacBlockInfo(plan, b);
    // Cut to the hours shown (`opts.span`, in the grid's minutes), so nothing hangs over its edges.
    const s0 = b.start + (opts.shift || 0), e0 = b.end + (opts.shift || 0), sp = opts.span || [-Infinity, Infinity];
    const cs = Math.max(s0, sp[0]), ce = Math.min(e0, sp[1]);
    const top = (cs - h0 * 60) * px / 60;
    const height = Math.max((ce - cs) * px / 60, opts.compact ? 6 : 14);
    // How tall its text is: one line in the Trip view; on a day, the title, the time and the place.
    const full = opts.compact ? 13 : 33 + ((b.place || (b.drive && b.drive.to) || b.kind === 'flight') ? 13 : 0);
    const avail = opts.below != null ? (Math.min(opts.below, sp[1]) - cs) * px / 60 : height;
    const roomy = !opts.compact && height < 30 && avail >= full;   // short, with room for all of it below
    const need = opts.compact || roomy || height >= 30 ? full : 16;
    const spill = Math.min(avail, need) - height;
    const left = lay.col / lay.cols * 100, width = 100 / lay.cols;
    const place = info.where;
    const tip = info.times + ' · ' + info.title + (info.meal ? ' (' + info.meal.key.toUpperCase() + ')' : '') +
        (place ? ' · ' + place : '') + (b.notes ? '\n' + b.notes : '') +
        (opts.compact ? '\nClick to open its day; drag to move it, to another day too; drag its bottom edge to change when it ends' : '');
    const warn = opts.warn && opts.warn.get(b.id);
    if (opts.linked === undefined) {
        const day = plan.days[opts.date], P = day && vacLinkPrev(day, b);
        opts = Object.assign({}, opts, { linked: P ? 'Linked: right after ' + vacBlockInfo(plan, P).title + ', and moves with it' : '' });
    }
    const cls = 'vac-block vac-k-' + info.kind.id + (opts.linked ? ' vac-linked' : '') + (info.meal ? ' vac-meal' : '') + (b.done ? ' vac-done' : '') + (warn ? ' vac-warned' : '') +
        (opts.sel ? ' vac-sel' : '') + (height < 30 && !roomy ? ' vac-short' : '') + (opts.shift ? ' vac-nextday' : '') + (spill > 1 ? ' vac-spill' : '');
    // A long drive shows where its breaks fall.
    let breaks = '';
    if (info.kind.id === 'drive' && !opts.compact && plan.breakEvery > 0)
        for (let t = b.start + plan.breakEvery; t < b.end - 10; t += plan.breakEvery)
            breaks += '<div class="vac-break" style="top:' + ((t - b.start) * px / 60) + 'px" title="A break around ' + vacTimeLabel(t) + '"><span>☕ ' + vacTimeLabel(t) + '</span></div>';
    return '<div class="' + cls + '" data-id="' + vacEsc(b.id) + '" data-date="' + opts.date + '"' +
        (opts.compact ? ' onpointerdown="vacTripDown(event)"' : '') +
        ' style="top:' + top + 'px;height:' + height + 'px;left:calc(' + left + '% + 1px);width:calc(' + width + '% - 3px)' + (spill > 1 ? ';--vac-spill:' + Math.floor(spill) + 'px' : '') + '"' +
        ' title="' + vacEsc(tip) + '">' + breaks +
        (info.meal && !opts.compact ? '<span class="vac-meal-tag">' + info.meal.key.toUpperCase() + '</span>' : '') +
        // In the Trip view, a pin where the block has a place, before the title can cut it off.
        (opts.compact && (b.place || (b.drive && b.drive.to)) ? '<span class="vac-tpin" title="' + vacEsc(info.where) + '">\uD83D\uDCCD</span>' : '') +
        '<div class="vac-b-title">' + (warn ? '<span class="vac-b-warn" title="' + vacEsc(warn) + '">\u26A0\uFE0F</span>' : '') +
            (opts.linked ? '<span class="vac-b-link" title="' + vacEsc(opts.linked) + '">\uD83D\uDD17</span>' : '') + info.icon + ' ' + vacEsc(info.title) + '</div>' +
        (opts.compact ? '<div class="vac-b-resize" title="Drag to change when it ends"></div>' : '<div class="vac-b-time">' + info.times + '</div>' +
            (place ? '<div class="vac-b-place">' + (info.kind.id === 'flight' || info.kind.id === 'drive' ? '' : '📍 ') + vacEsc(place) + '</div>' : '') +
            '<div class="vac-b-resize" title="Drag to change when it ends"></div>') +
        '</div>';
}

function vacDayHtml(plan, date, ui) {
    const day = plan.days[date];
    const [h0, h1] = vacSpan(plan, day.blocks);
    const col = vacColumn(plan, date, h0, h1), lay = col.lay;
    const stops = vacRouteStops(plan, date), route = vacRouteUrl(stops);
    const missing = plan.meals.filter(m => !day.blocks.some(b => b.meal === m.key));
    const warn = vacWarnings(plan).byBlock;
    let lines = '';
    const px = vacPxOf(ui, 'day');
    for (let h = h0; h < h1; h++) lines += '<div class="vac-hour' + (h === 24 ? ' vac-midnight' : '') + '" style="top:' + ((h - h0) * px) + 'px"><span>' +
        (h === 24 ? vacEsc(col.next ? vacDayLabel(col.next, 'short') : 'Midnight') : vacHourLabel(h)) + '</span></div>';
    const routeTip = 'Directions in Google Maps through ' + stops.length + ' stops' +
        (vacDayHome(plan, date) ? ', from where you\u2019re staying' : '') +
        (stops.length - 2 > VAC_MAX_WAYPOINTS ? ' (Google Maps takes ' + VAC_MAX_WAYPOINTS + ' between the first and the last; the rest are left out)' : '');
    return '<div class="vac-day" data-date="' + date + '">' +
        '<div class="vac-day-head"><b>' + vacEsc(vacDayLabel(date, 'long')) + '</b>' +
            '<input class="vac-day-label" value="' + vacEsc(day.label || '') + '" placeholder="Add a label" title="A name for the day: \u201CBeach day\u201D, \u201CParis\u201D" onchange="vacSetDayLabel(this)">' +
            (route
                ? '<a class="vac-btn vac-route" href="' + vacEsc(route) + '" target="_blank" rel="noopener noreferrer" title="' + vacEsc(routeTip) + '">🗺️ Route for the day</a>'
                : '<span class="vac-btn vac-route vac-off" title="Give two blocks a place, or one and where you’re staying, for a route">🗺️ Route for the day</span>') +
            (missing.length ? '<button class="vac-btn vac-restore" onclick="vacRestoreMeals(this)" title="Put back ' +
                vacEsc(missing.map(m => m.label).join(', ')) + '">Restore meals</button>' : '') +
            '<button class="vac-btn vac-todo" data-date="' + date + '" onclick="vacOpenDayList(this)" title="This day\u2019s own list, in Lists">\u2611\uFE0F To do' +
                (day.list.length ? ' <span class="vac-count">' + day.list.filter(x => x.done).length + '/' + day.list.length + '</span>' : '') + '</button>' +
            vacDayEventsHtml(plan, date) + vacHoursHtml(plan) +
        '</div>' +
        '<div class="vac-grid-wrap"><div class="vac-grid" style="height:' + ((h1 - h0) * px) + 'px;--vac-px:' + px + 'px" data-h0="' + h0 + '" data-h1="' + h1 + '" data-px="' + px + '" data-date="' + date + '" onpointerdown="vacGridDown(event)">' +
            lines + '<div class="vac-lane">' +
            col.shown.map(x => vacBlockHtml(plan, x.b, h0, px, lay.get(x.b.id), { sel: ui.sel === x.b.id, date: x.date, warn, shift: x.shift, span: [h0 * 60, h1 * 60], below: col.room.get(x.b.id) })).join('') +
            vacGapsHtml(plan, date, ui, h0, px, { max: (h1 - h0) * px }) +
            vacEdgeHtml(plan, col.above, 'top', date) + vacEdgeHtml(plan, col.below, 'bottom', date) +
        '</div></div></div></div>';
}

function vacDayEventsHtml(plan, date) {
    const ev = vacDayEvents(plan, date);
    if (!ev.length) return '';
    return '<div class="vac-events">' + ev.map(e => e.url
        ? '<a class="vac-event" href="' + vacEsc(e.url) + '" target="_blank" rel="noopener noreferrer" title="Open in Google Maps">' + e.icon + ' ' + vacEsc(e.text) + '</a>'
        : '<span class="vac-event">' + e.icon + ' ' + vacEsc(e.text) + '</span>').join('') + '</div>';
}

function vacPerson(plan, id) { return id ? (plan.people || []).find(p => p.id === id) || null : null; }

/** A day's clothes by whom: Everyone first, then each person in order; only those with something. */
function vacWearGroups(plan, day) {
    const groups = [{ person: null, outfits: [] }].concat((plan.people || []).map(p => ({ person: p, outfits: [] })));
    vacSortedOutfits(plan, day.outfits || []).forEach(r => {
        const items = plan.clothesTypes.map(t => r.items[t.id] && r.items[t.id].text).filter(Boolean);
        if (!items.length) return;
        const g = groups.find(x => x.person && x.person.id === r.who) || groups[0];
        const pr = vacPresetOf(plan, r.preset);
        g.outfits.push({ name: pr ? pr.name : 'Outfit', items });
    });
    return groups.filter(g => g.outfits.length);
}

function vacWearText(g) { return g.outfits.map(o => o.name + ': ' + o.items.join(', ')).join(' · '); }

function vacWhoName(person) { return person ? person.name || 'Someone' : 'Everyone'; }
function vacWhoColor(person) { return person ? person.color : '#95a5a6'; }


function vacPersonAdd(el) {
    const widget = vacGetWidget(el);
    vacMutate(el, (plan, ui) => {
        plan.people = plan.people || [];
        const used = new Set(plan.people.map(p => p.color));
        const color = VAC_PEOPLE_COLORS.find(c => !used.has(c)) || VAC_PEOPLE_COLORS[plan.people.length % VAC_PEOPLE_COLORS.length];
        plan.people.push({ id: vacNewId('u'), name: '', color });
    });
    const names = widget.querySelectorAll('.vac-person-row [data-f="name"]');
    if (names.length) names[names.length - 1].focus();
}

/** A person's name or colour: saved, the form left as it is so the next field keeps the focus. */
function vacPersonField(el) {
    const id = el.closest('.vac-person-row').dataset.id;
    vacMutate(el, (plan) => {
        const p = vacPerson(plan, id);
        if (!p) return 'none';
        if (el.dataset.f === 'name') p.name = el.value.trim();
        else p.color = el.value;
    }, { draw: false });
}

function vacPersonRemove(btn) {
    const id = btn.closest('.vac-person-row').dataset.id;
    vacMutate(btn, (plan, ui) => {
        const p = vacPerson(plan, id);
        if (!p) return 'none';
        const touched = Object.values(plan.days).some(d => (d.outfits || []).some(r => r.who === id && vacRowTouched(plan, r)));
        if (touched && !window.confirm('Remove ' + vacWhoName(p) + ', and the clothes planned for them?')) return 'none';
        Object.values(plan.days).forEach(d => {
            d.outfits = (d.outfits || []).filter(r => r.who !== id);
            d.outfitKeys = (d.outfitKeys || []).filter(k => k.split('|')[0] !== id);
        });
        plan.people = plan.people.filter(x => x.id !== id);
        if (ui.cwho === id) ui.cwho = '';
    });
}

function vacPeopleHtml(plan) {
    return '<div class="vac-sec">👥 Who is going</div>' +
        '<div class="vac-people">' + (plan.people || []).map(p =>
        '<div class="vac-person-row" data-id="' + vacEsc(p.id) + '">' +
            '<input type="color" data-f="color" value="' + vacEsc(p.color) + '" onchange="vacPersonField(this)" title="Their colour">' +
            '<input data-f="name" value="' + vacEsc(p.name) + '" placeholder="Name" onchange="vacPersonField(this)">' +
            '<button class="vac-icon" onclick="vacPersonRemove(this)" title="Remove">×</button></div>').join('') + '</div>' +
        ((plan.people || []).length ? '' : '<div class="vac-hint">Nobody yet: the clothes are everyone’s.</div>') +
        '<button class="vac-btn vac-park-add" onclick="vacPersonAdd(this)">+ Add person</button>' +
        '<div class="vac-hint">Each person has their own outfits in the Clothes tab.</div>';
}

/** The Clothes tab: who and which day, the presets when open, and the table. */
function vacClothesHtml(plan, ui) {
    const dates = vacDates(plan), people = plan.people || [];
    if (!dates.length) return '<div class="vac-empty">Pick the dates of the trip, above, to plan what to wear each day.</div>';
    const who = vacPerson(plan, ui.cwho) ? ui.cwho : '';
    const day = dates.includes(ui.cday) ? ui.cday : '';
    const chip = (id, label, color) => '<button class="vac-chip vac-who' + (id === who ? ' vac-on' : '') + '" data-k="who" data-v="' + vacEsc(id) +
        '" onclick="vacClothesFilter(this)">' + (color ? '<span class="vac-dot" style="background:' + vacEsc(color) + '"></span>' : '') + vacEsc(label) + '</button>';
    return '<div class="vac-clothes">' +
        '<div class="vac-cbar">' +
            (people.length ? '<span class="vac-chips">' + chip('', 'All') + people.map(p => chip(p.id, vacWhoName(p), p.color)).join('') + '</span>' : '') +
            '<select class="vac-cday-pick" data-k="day" onchange="vacClothesFilter(this)"><option value="">Every day</option>' +
                dates.map(d => '<option value="' + d + '"' + (d === day ? ' selected' : '') + '>' + vacEsc(vacDayName(plan, d, 'short')) + '</option>').join('') + '</select>' +
            '<span class="vac-out-gap"></span>' +
            '<button class="vac-btn' + (ui.presets ? ' vac-on' : '') + '" onclick="vacTogglePresets(this)" title="The outfits each day starts with, and the kinds of clothes">⚙️ Presets &amp; types</button>' +
            '<button class="vac-btn" onclick="vacClothesToPacking(this)" title="Everything in the table, counted, in the Packing list">🧳 Add to packing</button>' +
        '</div>' +
        (ui.presets ? vacPresetsHtml(plan) : '') +
        vacClothesTableHtml(plan, ui) +
        '</div>';
}

function vacClothesTableHtml(plan, ui) {
    const dates = vacDates(plan), people = plan.people || [], types = plan.clothesTypes;
    const who = vacPerson(plan, ui.cwho) ? ui.cwho : '';
    const shown = dates.includes(ui.cday) ? [ui.cday] : dates;
    const listId = (t) => 'vac-ct-' + ui.toolId + '-' + t.id;
    let body = '', packed = 0, total = 0;
    shown.forEach(d => {
        const rows = vacSortedOutfits(plan, plan.days[d].outfits.filter(r => !who || r.who === who));
        const n = vacPackedCount(plan, rows);
        packed += n.packed; total += n.total;
        const dayCell = '<td class="vac-cdate" rowspan="' + Math.max(1, rows.length) + '"><b>' + vacEsc(vacDayLabel(d, 'short')) + '</b>' +
            (vacDayText(plan, d) ? '<div class="vac-cdlabel">' + vacEsc(vacDayText(plan, d)) + '</div>' : '') +
            '<div class="vac-ccount" data-date="' + d + '">' + n.packed + '/' + n.total + ' packed</div>' +
            '<button class="vac-btn vac-cadd" data-date="' + d + '" onclick="vacOutfitAdd(this)" title="Another outfit this day">+ Outfit</button></td>';
        if (!rows.length) { body += '<tr class="vac-cfirst">' + dayCell + '<td colspan="' + (types.length + 3) + '" class="vac-hint">No outfits this day.</td></tr>'; return; }
        rows.forEach((r, i) => {
            const person = vacPerson(plan, r.who);
            body += '<tr class="vac-crow' + (i === 0 ? ' vac-cfirst' : '') + '" data-row="' + vacEsc(r.id) + '" data-date="' + d + '">' + (i === 0 ? dayCell : '') +
                '<td><select data-k="preset" onchange="vacOutfitField(this)">' + plan.outfitPresets.map(p => '<option value="' + vacEsc(p.id) + '"' +
                    (p.id === r.preset ? ' selected' : '') + '>' + vacEsc(p.name) + '</option>').join('') +
                    (vacPresetOf(plan, r.preset) ? '' : '<option selected>Outfit</option>') + '</select></td>' +
                '<td class="vac-cwho" style="--vac-who:' + vacEsc(vacWhoColor(person)) + '"><select data-k="who" onchange="vacOutfitField(this)">' +
                    '<option value="">Everyone</option>' + people.map(p => '<option value="' + vacEsc(p.id) + '"' + (p.id === r.who ? ' selected' : '') + '>' +
                    vacEsc(vacWhoName(p)) + '</option>').join('') + '</select></td>' +
                types.map(t => {
                    const c = r.items[t.id] || {};
                    return '<td class="vac-cell' + (c.packed ? ' vac-packed' : '') + '"><input type="checkbox" data-c="' + vacEsc(t.id) + '" title="Packed"' +
                        (c.packed ? ' checked' : '') + (c.text ? '' : ' disabled') + ' onchange="vacCellPacked(this)">' +
                        '<input class="vac-ctext" data-c="' + vacEsc(t.id) + '" value="' + vacEsc(c.text || '') + '" list="' + vacEsc(listId(t)) + '" onchange="vacCellText(this)"></td>';
                }).join('') +
                '<td class="vac-cacts"><button class="vac-icon" onclick="vacOutfitFill(this)" title="Fill the empty ones from the preset">↻</button>' +
                    '<button class="vac-icon" onclick="vacOutfitRemove(this)" title="Remove this outfit">×</button></td></tr>';
        });
    });
    // What has been worn in each column before, and the presets', offered as you type.
    const lists = types.map(t => {
        const seen = new Set();
        plan.outfitPresets.forEach(p => p.items[t.id] && seen.add(p.items[t.id]));
        dates.forEach(d => plan.days[d].outfits.forEach(r => r.items[t.id] && r.items[t.id].text && seen.add(r.items[t.id].text)));
        return '<datalist id="' + vacEsc(listId(t)) + '">' + Array.from(seen).map(v => '<option value="' + vacEsc(v) + '">').join('') + '</datalist>';
    }).join('');
    return '<div class="vac-ctable-wrap"><div class="vac-csum">' + packed + '/' + total + ' packed</div>' +
        '<table class="vac-ctable"><thead><tr><th>Day</th><th>Outfit</th><th>Person</th>' +
        types.map(t => '<th>' + vacEsc(t.label) + '</th>').join('') + '<th></th></tr></thead><tbody>' + body + '</tbody></table>' + lists + '</div>';
}

function vacPackedCount(plan, rows) {
    let packed = 0, total = 0;
    rows.forEach(r => plan.clothesTypes.forEach(t => { const c = r.items[t.id]; if (c && c.text) { total++; if (c.packed) packed++; } }));
    return { packed, total };
}

/** The presets, one to a row, a column for each type; the types' names head the columns. */
function vacPresetsHtml(plan) {
    const types = plan.clothesTypes;
    return '<div class="vac-presets"><table class="vac-ptable"><thead><tr><th>Preset</th><th title="Every day starts with one, for each person">Every day</th>' +
        types.map(t => '<th><span class="vac-tname"><input data-t="' + vacEsc(t.id) + '" value="' + vacEsc(t.label) + '" onchange="vacTypeField(this)" title="The name of this kind of clothes">' +
            '<button class="vac-icon" data-t="' + vacEsc(t.id) + '" onclick="vacTypeRemove(this)" title="Remove this column">×</button></span></th>').join('') +
        '<th><button class="vac-btn" onclick="vacTypeAdd(this)">+ Type</button></th></tr></thead><tbody>' +
        plan.outfitPresets.map(p => '<tr data-p="' + vacEsc(p.id) + '">' +
            '<td><input data-k="name" value="' + vacEsc(p.name) + '" onchange="vacPresetField(this)"></td>' +
            '<td class="vac-pauto"><input type="checkbox" data-k="auto"' + (p.auto ? ' checked' : '') + ' onchange="vacPresetField(this)"></td>' +
            types.map(t => '<td><input data-k="item" data-t="' + vacEsc(t.id) + '" value="' + vacEsc(p.items[t.id] || '') + '" onchange="vacPresetField(this)"></td>').join('') +
            '<td><button class="vac-icon" onclick="vacPresetRemove(this)" title="Remove this preset">×</button></td></tr>').join('') +
        '</tbody></table>' +
        '<div class="vac-row"><button class="vac-btn" onclick="vacPresetAdd(this)">+ Preset</button>' +
        '<span class="vac-hint">A new outfit starts from its preset. A change here reaches every outfit still showing the old item.</span></div></div>';
}

function vacTogglePresets(el) { vacMutate(el, (plan, ui) => { ui.presets = !ui.presets; return false; }); }

function vacClothesFilter(el) {
    vacMutate(el, (plan, ui) => {
        if (el.dataset.k === 'who') ui.cwho = el.dataset.v || '';
        else ui.cday = el.value;
        return false;
    });
}

/** The table drawn again, the rest left as it is: a field being moved to keeps its place. */
function vacClothesRefresh(widget) {
    const wrap = widget.querySelector('.vac-ctable-wrap');
    if (!wrap) return;
    const toolId = vacGetToolId(widget), plan = vacGetData(toolId), ui = vacUiOf(toolId);
    const main = widget.querySelector('.vac-main'), top = main ? main.scrollTop : 0;
    // Only when it changes, so a click that ended the edit still lands on what it was aimed at.
    const next = document.createElement('div');
    next.innerHTML = vacClothesTableHtml(plan, ui);
    if (next.firstElementChild.outerHTML === wrap.outerHTML) return;
    wrap.replaceWith(next.firstElementChild);
    if (main) main.scrollTop = top;
}

/** A cell's item or its tick: saved, and the counts brought up to date, the table left as it is. */
function vacCellEdit(el, fn) {
    const tr = el.closest('.vac-crow'), id = tr.dataset.row, date = tr.dataset.date, t = el.dataset.c, widget = vacGetWidget(el);
    vacMutate(el, (plan) => {
        const r = (plan.days[date] ? plan.days[date].outfits : []).find(x => x.id === id);
        if (!r) return 'none';
        const c = r.items[t] || (r.items[t] = { text: '', packed: false });
        fn(c);
        if (!c.text) delete r.items[t];
    }, { draw: false });
    const toolId = vacGetToolId(widget), plan = vacGetData(toolId), ui = vacUiOf(toolId);
    const r = plan.days[date].outfits.find(x => x.id === id), c = (r && r.items[t]) || {};
    const td = el.closest('.vac-cell'), cb = td.querySelector('input[type="checkbox"]');
    cb.disabled = !c.text;
    cb.checked = !!c.packed;
    td.classList.toggle('vac-packed', !!c.packed);
    const who = vacPerson(plan, ui.cwho) ? ui.cwho : '';
    let packed = 0, total = 0;
    vacDates(plan).filter(d => !vacDates(plan).includes(ui.cday) || d === ui.cday).forEach(d => {
        const n = vacPackedCount(plan, plan.days[d].outfits.filter(x => !who || x.who === who));
        packed += n.packed; total += n.total;
        const cell = widget.querySelector('.vac-ccount[data-date="' + d + '"]');
        if (cell) cell.textContent = n.packed + '/' + n.total + ' packed';
    });
    const sum = widget.querySelector('.vac-csum');
    if (sum) sum.textContent = packed + '/' + total + ' packed';
}

function vacCellText(el) { vacCellEdit(el, (c) => { c.text = el.value.trim(); if (!c.text) c.packed = false; }); }
function vacCellPacked(el) { vacCellEdit(el, (c) => { c.packed = el.checked; }); }

function vacOutfitRow(plan, el) {
    const tr = el.closest('.vac-crow'), day = plan.days[tr.dataset.date];
    const index = day ? day.outfits.findIndex(x => x.id === tr.dataset.row) : -1;
    return index < 0 ? null : { day, index, row: day.outfits[index] };
}

/** An outfit's preset or person. Its cells still showing the old preset's items take the new one's. */
function vacOutfitField(el) {
    vacMutate(el, (plan) => {
        const f = vacOutfitRow(plan, el);
        if (!f) return 'none';
        const r = f.row;
        if (el.dataset.k === 'who') { r.who = el.value; return; }
        const was = vacPresetOf(plan, r.preset), now = vacPresetOf(plan, el.value);
        if (!now) return 'none';
        plan.clothesTypes.forEach(t => {
            const c = r.items[t.id], old = (was && was.items[t.id]) || '';
            if (((c && c.text) || '') !== old) return;
            if (now.items[t.id]) r.items[t.id] = { text: now.items[t.id], packed: !!(c && c.packed && c.text === now.items[t.id]) };
            else delete r.items[t.id];
        });
        r.preset = now.id;
    });
}

function vacOutfitAdd(btn) {
    vacMutate(btn, (plan, ui) => {
        const day = plan.days[btn.dataset.date];
        if (!day) return 'none';
        const pr = plan.outfitPresets.find(p => !p.auto) || plan.outfitPresets[0] || null;
        const who = vacPerson(plan, ui.cwho) ? ui.cwho : ((plan.people || [])[0] || {}).id || '';
        day.outfits.push({ id: vacNewId('o'), preset: pr ? pr.id : '', who, items: vacPresetItems(plan, pr) });
    });
}

function vacOutfitFill(btn) {
    vacMutate(btn, (plan) => {
        const f = vacOutfitRow(plan, btn), pr = f && vacPresetOf(plan, f.row.preset);
        if (!pr) return 'none';
        plan.clothesTypes.forEach(t => {
            const c = f.row.items[t.id];
            if ((!c || !c.text) && pr.items[t.id]) f.row.items[t.id] = { text: pr.items[t.id], packed: false };
        });
    });
}

function vacOutfitRemove(btn) {
    vacMutate(btn, (plan) => {
        const f = vacOutfitRow(plan, btn);
        if (!f) return 'none';
        f.day.outfits.splice(f.index, 1);
    });
}

/** A preset's name, item or every-day mark. An item changed reaches the outfits still showing the old one. */
function vacPresetField(el) {
    const id = el.closest('tr').dataset.p, k = el.dataset.k, widget = vacGetWidget(el);
    vacMutate(el, (plan) => {
        const pr = vacPresetOf(plan, id);
        if (!pr) return 'none';
        if (k === 'name') pr.name = el.value.trim() || pr.name;
        else if (k === 'auto') {
            pr.auto = el.checked;
            // Taken off every day: the outfits it made that were never changed go.
            if (!pr.auto) Object.values(plan.days).forEach(d => {
                d.outfits = (d.outfits || []).filter(r => r.preset !== id || !/^o\|/.test(r.id) || vacRowTouched(plan, r));
                d.outfitKeys = (d.outfitKeys || []).filter(key => key.split('|')[1] !== id || d.outfits.some(r => r.id.endsWith('|' + key)));
            });
        } else {
            const t = el.dataset.t, old = pr.items[t] || '', now = el.value.trim();
            Object.values(plan.days).forEach(d => (d.outfits || []).forEach(r => {
                if (r.preset !== id || ((r.items[t] || {}).text || '') !== old) return;
                if (now) r.items[t] = { text: now, packed: !!(r.items[t] && r.items[t].packed) }; else delete r.items[t];
            }));
            if (now) pr.items[t] = now; else delete pr.items[t];
        }
    }, k === 'auto' ? undefined : { draw: false });
    if (k !== 'auto') vacClothesRefresh(widget);
}

function vacPresetAdd(btn) {
    vacMutate(btn, (plan) => { plan.outfitPresets.push({ id: vacNewId('p'), name: 'Outfit ' + (plan.outfitPresets.length + 1), auto: false, items: {} }); });
    const names = vacGetWidget(btn) && document.querySelectorAll('.vac-ptable [data-k="name"]');
    if (names && names.length) { names[names.length - 1].focus(); names[names.length - 1].select(); }
}

function vacPresetRemove(btn) {
    const id = btn.closest('tr').dataset.p;
    vacMutate(btn, (plan) => {
        const pr = vacPresetOf(plan, id);
        if (!pr) return 'none';
        const used = Object.values(plan.days).some(d => (d.outfits || []).some(r => r.preset === id && vacRowTouched(plan, r)));
        if (used && !window.confirm('Remove the ' + pr.name + ' preset? Outfits made from it that you have changed are kept.')) return 'none';
        Object.values(plan.days).forEach(d => {
            d.outfits = (d.outfits || []).filter(r => r.preset !== id || vacRowTouched(plan, r));
            d.outfitKeys = (d.outfitKeys || []).filter(key => key.split('|')[1] !== id);
        });
        plan.outfitPresets = plan.outfitPresets.filter(p => p.id !== id);
    });
}

function vacTypeAdd(btn) {
    const widget = vacGetWidget(btn);
    vacMutate(btn, (plan) => { plan.clothesTypes.push({ id: vacNewId('t'), label: 'New' }); });
    const names = widget.querySelectorAll('.vac-tname input');
    if (names.length) { names[names.length - 1].focus(); names[names.length - 1].select(); }
}

function vacTypeField(el) {
    const widget = vacGetWidget(el);
    vacMutate(el, (plan) => {
        const t = plan.clothesTypes.find(x => x.id === el.dataset.t);
        if (!t) return 'none';
        t.label = el.value.trim() || t.label;
    }, { draw: false });
    vacClothesRefresh(widget);
}

function vacTypeRemove(btn) {
    const id = btn.dataset.t;
    vacMutate(btn, (plan) => {
        const t = plan.clothesTypes.find(x => x.id === id);
        if (!t) return 'none';
        const n = Object.values(plan.days).reduce((sum, d) => sum + (d.outfits || []).filter(r => r.items[id] && r.items[id].text).length, 0);
        if (n && !window.confirm('Remove the ' + t.label + ' column, and what is in it in ' + n + (n === 1 ? ' outfit' : ' outfits') + '?')) return 'none';
        Object.values(plan.days).forEach(d => (d.outfits || []).forEach(r => { delete r.items[id]; }));
        plan.outfitPresets.forEach(p => { delete p.items[id]; });
        plan.clothesTypes = plan.clothesTypes.filter(x => x.id !== id);
    });
}

/** The trip's stays in rows: each in the first row where it does not overlap another (a changeover day is shared). */
function vacStayLanes(plan, dates) {
    if (!dates.length) return [];
    const first = dates[0], last = dates[dates.length - 1];
    const cruises = (plan.cruises || []).filter(c => c.boardDate).map(c => ({ id: c.id, cruise: c, place: { label: c.ship || 'Cruise', address: '' },
        inDate: c.boardDate, inTime: c.boardTime, outDate: c.leaveDate || c.boardDate, outTime: c.leaveTime }));
    const stays = (plan.stays || []).concat(cruises).filter(st => st.place && st.inDate && st.inDate <= last && (st.outDate || st.inDate) >= first)
        .slice().sort((a, b) => a.inDate < b.inDate ? -1 : a.inDate > b.inDate ? 1 : 0);
    const lanes = [];
    stays.forEach(st => {
        const lane = lanes.find(l => (l[l.length - 1].outDate || l[l.length - 1].inDate) <= st.inDate);
        if (lane) lane.push(st); else lanes.push([st]);
    });
    return lanes;
}

/** A day's part of each stay: from midday where it starts, to midday where it ends, the whole day between. */
function vacStaySegmentsHtml(plan, lanes, date, dates) {
    return lanes.map((lane, row) => lane.map(st => {
        const out = st.outDate || st.inDate;
        if (date < st.inDate || date > out) return '';
        const starts = date === st.inDate, ends = date === out;
        const shown = starts || date === dates[0];
        const name = vacPlaceName(st.place);
        const tip = name + ' · ' + vacDayLabel(st.inDate, 'short') + (st.inTime != null ? ' ' + vacTimeLabel(st.inTime) : '') +
            ' – ' + vacDayLabel(out, 'short') + (st.outTime != null ? ' ' + vacTimeLabel(st.outTime) : '');
        const c = st.cruise, day = c && (c.days || {})[date];
        const port = c && !starts && !ends ? (day && day.port ? '\u2693 ' + vacPlaceName(day.port) : '\uD83C\uDF0A') : '';
        return '<div class="vac-tstay' + (c ? ' vac-tstay-cruise' : '') + (starts ? ' vac-tstay-in' : '') + (ends ? ' vac-tstay-out' : '') + '" style="top:' + (row * 20 + 2) + 'px" ' +
            'data-view="' + (c ? 'cruise' : 'stay') + '"' + (c ? '' : ' data-sub="stays"') + ' onclick="vacView(this)" title="' + vacEsc(tip + (port ? ' \u00B7 ' + port : '')) + '">' +
            (shown ? '<span>' + (c ? '\uD83D\uDEA2 ' : '\uD83C\uDFE8 ') + vacEsc(name) + '</span>' : port ? '<span class="vac-tport">' + vacEsc(port) + '</span>' : '') + '</div>';
    }).join('')).join('');
}

/**
 * The whole trip as Google Maps directions, in parts: Maps takes VAC_MAX_WAYPOINTS
 * stops between the start and the end, so each part starts where the last ended.
 */
function vacTripRouteLinks(plan) {
    const stops = [];
    vacDates(plan).forEach(d => vacRouteStops(plan, d).forEach(q => {
        if (!stops.length || stops[stops.length - 1].q !== q) stops.push({ q, d });
    }));
    const size = VAC_MAX_WAYPOINTS + 2, out = [];
    for (let i = 0; i < stops.length - 1; i += size - 1) {
        const part = stops.slice(i, i + size);
        if (part.length < 2) break;
        out.push({ url: vacDirUrl(part[0].q, part.slice(1, -1).map(x => x.q), part[part.length - 1].q), from: part[0].d, to: part[part.length - 1].d });
    }
    return out;
}

function vacTripHtml(plan, dates, ui) {
    if (!dates.length) return '<div class="vac-empty">Pick the dates of the trip, above, to plan its days.<br>Each day starts with breakfast, lunch and dinner.</div>';
    const [h0, h1] = vacSpan(plan, dates.flatMap(d => plan.days[d].blocks));
    const tpx = vacPxOf(ui, 'trip'), height = (h1 - h0) * tpx, warn = vacWarnings(plan).byBlock;
    let axis = '', lines = '';
    for (let h = h0; h < h1; h++) {
        if ((h - h0) % (tpx >= 28 ? 1 : 2) === 0) axis += '<span style="top:' + ((h - h0) * tpx) + 'px">' + vacHourLabel(h) + '</span>';
        lines += '<div class="vac-thour' + (h === 24 ? ' vac-tmidnight' : '') + '" style="top:' + ((h - h0) * tpx) + 'px"></div>';
    }
    // Stays across the days, a row for each that overlap: in at midday on its first, out at midday on its last.
    const lanes = vacStayLanes(plan, dates);
    const band = (html) => lanes.length ? '<div class="vac-tstays" style="height:' + (lanes.length * 20 + 4) + 'px">' + html + '</div>' : '';
    const routes = vacTripRouteLinks(plan);
    const bar = '<div class="vac-cbar vac-trip-bar">' + vacHoursHtml(plan) + (routes.length > 1 ? '<span class="vac-hint">Route for the trip:</span>' : '') +
        routes.map(r => '<a class="vac-btn" href="' + vacEsc(r.url) + '" target="_blank" rel="noopener noreferrer" title="Directions in Google Maps">\uD83D\uDDFA\uFE0F ' +
            (routes.length === 1 ? 'Route for the trip' : vacEsc(vacDayLabel(r.from, 'short') + (r.to !== r.from ? ' \u2013 ' + vacDayLabel(r.to, 'short') : ''))) + '</a>').join('') +
        '</div>';
    return bar + '<div class="vac-trip' + (dates.some(d => vacDayText(plan, d)) ? ' vac-trip-labelled' : '') + '">' +
        '<div class="vac-tcol vac-taxis"><div class="vac-thead"></div>' + band('<span class="vac-tstays-label" title="Where you\u2019re staying">\uD83C\uDFE8</span>') +
            '<div class="vac-tgrid" data-hours="' + (h1 - h0) + '" style="height:' + height + 'px">' + axis + '</div></div>' +
        dates.map(d => {
            const col = vacColumn(plan, d, h0, h1), lay = col.lay;
            return '<div class="vac-tcol"><button class="vac-thead" data-view="' + d + '" onclick="vacView(this)" title="Plan this day">' +
                vacEsc(vacDayLabel(d, 'short')) + (vacDayText(plan, d) ? '<span class="vac-tlabel">' + vacEsc(vacDayText(plan, d)) + '</span>' : '') + '</button>' +
                band(vacStaySegmentsHtml(plan, lanes, d, dates)) +
                '<div class="vac-tgrid vac-tday" data-date="' + d + '" data-h0="' + h0 + '" data-px="' + tpx + '" style="height:' + height + 'px">' + lines +
                col.shown.map(x => vacBlockHtml(plan, x.b, h0, tpx, lay.get(x.b.id), { compact: true, date: x.date, warn, shift: x.shift, span: [h0 * 60, h1 * 60], below: col.room.get(x.b.id) })).join('') +
                vacGapsHtml(plan, d, ui, h0, tpx, { compact: true, left: dates.indexOf(d) < dates.length / 2, max: height }) +
                vacEdgeHtml(plan, col.above, 'top', d, true) + vacEdgeHtml(plan, col.below, 'bottom', d, true) +
                '</div></div>';
        }).join('') +
        '</div>';
}

/** The block, as found anywhere in the trip. */
function vacFind(plan, id) {
    if (!id) return null;
    for (const date of Object.keys(plan.days)) {
        const day = plan.days[date], index = day.blocks.findIndex(b => b.id === id);
        if (index >= 0) return { date, day, index, block: day.blocks[index] };
    }
    return null;
}

function vacFormLinksHtml(plan, b) {
    const a = (url, label, tip) => '<a class="vac-btn" href="' + vacEsc(url) + '" target="_blank" rel="noopener noreferrer" title="' + vacEsc(tip || url) + '">' + label + '</a>';
    if (b.kind === 'flight') {
        const fl = b.flight || {};
        return (fl.number ? a(vacFlightStatusUrl(fl), '🔎 Flight status', 'Search for ' + fl.number + '’s status') : '') +
            (fl.from ? a(vacPlaceUrl(vacAirportPlace(fl.from)), '📍 ' + vacEsc(fl.from)) : '') +
            (fl.to ? a(vacPlaceUrl(vacAirportPlace(fl.to)), '📍 ' + vacEsc(fl.to)) : '');
    }
    if (b.kind === 'drive') {
        const f = vacFind(plan, b.id), dr = b.drive || {}, url = vacDriveUrl(b, plan, f && f.date);
        if (!url) return '<span class="vac-hint">Say where it goes for directions.</span>';
        const own = vacRouteStop(dr.from), from = own ? null : f && vacDriveOrigin(plan, f.date, b);
        const start = own ? '' : vacRouteStop(from) ? ' Starts from ' + vacPlaceName(from) + ', where you were before it.' : '';
        return a(url, '🗺️ Directions', 'Directions in Google Maps, through the stops.' + start) +
            (!own && dr.from ? '<span class="vac-hint">Its start is only a short Maps link, so directions start from ' +
                (vacRouteStop(from) ? vacEsc(vacPlaceName(from)) : 'where you are') + ': give it a name or address.</span>'
                : !own && !vacRouteStop(from) ? '<span class="vac-hint">No start: Maps will start from where you are. Say where it starts from.</span>' : '') +
            (dr.to && !vacRouteStop(dr.to) ? '<span class="vac-hint">Give where it goes a name or address.</span>' : '');
    }
    const url = vacPlaceUrl(b.place);
    const saved = !b.place || plan.places.concat(vacStayPlaces(plan)).some(x => vacSamePlace(x, b.place));
    return (url ? a(url, '📍 Open in Maps') : '') +
        (saved ? '' : '<button class="vac-btn" onclick="vacSavePlace(this)" title="Keep it in Places, to use again">☆ Save to places</button>');
}

function vacMinutesOptions(values, cur, none) {
    return values.map(v => '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' +
        (v === 0 ? none : (v >= 60 ? (v / 60) + ' h' : v + ' min')) + '</option>').join('');
}

function vacBlockFormHtml(plan, dates, ui) {
    const f = vacFind(plan, ui.sel);
    if (!f) return '<div class="vac-hint">' + (ui.view === 'trip'
        ? 'Pick a day, or a block in one, to plan it.'
        : 'Click a time on the day to add a block, or drag down to say how long. Click a block to change it, drag it to move it, and drag its bottom edge to change when it ends.') + '</div>';
    const b = f.block, info = vacBlockInfo(plan, b), p = b.place || {}, k = info.kind.id;
    const kinds = VAC_KINDS.map(x => '<option value="' + x.id + '"' + (x.id === k ? ' selected' : '') + '>' + x.icon + ' ' + x.label + '</option>').join('');
    const days = dates.map(d => '<option value="' + d + '"' + (d === f.date ? ' selected' : '') + '>' + vacEsc(vacDayName(plan, d, 'short')) + '</option>').join('');
    const on = ' onchange="vacEditField(this)"';
    const field = (label, key, value, extra) => '<label>' + label + '<input data-f="' + key + '" value="' + vacEsc(value || '') + '"' + (extra || '') + on + '></label>';
    const list = ' list="vac-places-' + vacEsc(ui.toolId) + '"';
    let times, details;
    if (k === 'flight') {
        const fl = b.flight || {};
        times = '<div class="vac-row"><label>Departs<input type="time" step="300" data-f="start" value="' + vacTimeValue(b.start) + '"' + on + '></label>' +
            '<label>Lands<input type="time" step="300" data-f="f_arrive" value="' + vacTimeValue(fl.arrive != null ? fl.arrive : b.end) + '"' + on + '></label>' +
            '<label>On<select data-f="f_arriveDay"' + on + '>' + [0, 1, 2].map(n => '<option value="' + n + '"' + ((fl.arriveDay || 0) === n ? ' selected' : '') + '>' +
                (n ? '+' + n + ' day' : 'the same day') + '</option>').join('') + '</select></label></div>' +
            '<div class="vac-hint">Times are local at each airport.</div>';
        details = '<div class="vac-row">' + field('Flight', 'f_number', fl.number, ' placeholder="XY 123"') + field('Seat', 'f_seat', fl.seat) + '</div>' +
            '<div class="vac-row">' + field('From', 'f_from', fl.from, ' placeholder="Airport"') + field('To', 'f_to', fl.to, ' placeholder="Airport"') + '</div>' +
            '<div class="vac-row">' + field('Terminal / gate', 'f_gate', fl.gate) + field('Confirmation', 'f_conf', fl.conf) + '</div>' +
            vacFlightTimesHtml(plan, f.date, b) +
            '<div class="vac-row vac-form-links">' + vacFormLinksHtml(plan, b) + '</div>' +
            '<div class="vac-row"><button class="vac-btn" onclick="vacAirportDrive(this)" title="A drive that gets you to the airport in time">🚗 Add the trip to the airport</button>' +
            '<label class="vac-inline">be there <select data-f="lead"' + on + '>' + vacMinutesOptions([60, 90, 120, 150, 180, 240], plan.airportLead) + '</select> before</label></div>';
    } else {
        times = '<div class="vac-row"><label>From<input type="time" step="900" data-f="start" value="' + vacTimeValue(b.start) + '"' + on + '></label>' +
            '<label>To<input type="time" step="900" data-f="end" value="' + vacTimeValue(b.end) + '"' + on + '></label></div>';
        if (k === 'drive') {
            const dr = b.drive || {};
            details = field('Starting from', 'd_from', vacPlaceInput(dr.from), list + ' placeholder="Address, Maps link or a saved place"') +
                '<div class="vac-stops">' + (dr.stops || []).map((st, i) => '<div class="vac-stop">' +
                    '<input data-f="d_stop" data-i="' + i + '" value="' + vacEsc(vacPlaceInput(st)) + '"' + list + ' placeholder="A stop: fuel, food, a sight"' + on + '>' +
                    '<button class="vac-icon" data-i="' + i + '" onclick="vacStopRemove(this)" title="Remove the stop">×</button></div>').join('') +
                    '<button class="vac-btn" onclick="vacStopAdd(this)">+ Stop on the way</button></div>' +
                field('Going to', 'd_to', vacPlaceInput(dr.to), list + ' placeholder="Address, Maps link or a saved place"') +
                '<div class="vac-row vac-form-links">' + vacFormLinksHtml(plan, b) + '</div>' +
                '<label class="vac-inline">A break every <select data-f="breakEvery"' + on + '>' + vacMinutesOptions([0, 60, 90, 120, 150, 180], plan.breakEvery, 'never') + '</select></label>' +
                '<div class="vac-hint">How long the drive takes is the block’s length: see it in Directions, then set it.</div>';
        } else {
            details = '<label>Place<input data-f="plabel"' + list + ' value="' + vacEsc(p.label || '') + '" placeholder="Its name"' + on + '></label>' +
                '<label>Address or Google Maps link<input data-f="paddress" value="' + vacEsc(p.address || p.url || '') + '" placeholder="Paste a link from Google Maps"' + on + '></label>' +
                (b.place ? vacPlaceTargetHtml(b.place) : '') +
                '<div class="vac-row vac-form-links">' + vacFormLinksHtml(plan, b) + '</div>';
        }
    }
    return '<div class="vac-form" data-id="' + vacEsc(b.id) + '">' +
        (info.meal ? '<div class="vac-meal-note"><span class="vac-meal-tag">' + info.meal.key.toUpperCase() + '</span> one of the day’s meals</div>' : '') +
        '<label>What<input data-f="title" value="' + vacEsc(b.title) + '" placeholder="' + vacEsc(info.auto) + '"' + on + '></label>' +
        '<div class="vac-row"><label>Kind<select data-f="kind"' + on + '>' + kinds + '</select></label>' +
            '<label>Day<select data-f="date"' + on + '>' + days + '</select></label></div>' +
        times + '<div class="vac-btravel">' + vacBlockTravelHtml(plan, f.date, b, ui) + '</div>' +
        '<div class="vac-blinks">' + vacBlockLinkHtml(plan, f.date, b) + '</div>' + details +
        '<label>Notes<textarea data-f="notes" rows="3"' + on + '>' + vacEsc(b.notes || '') + '</textarea></label>' +
        '<div class="vac-row">' + field('Cost', 'cost', b.cost, ' placeholder="Tickets, a meal\u2026" inputmode="decimal"') + '</div>' +
        '<label class="vac-check"><input type="checkbox" data-f="done"' + (b.done ? ' checked' : '') + on + '> Done</label>' +
        '<div class="vac-row"><button class="vac-btn vac-danger" onclick="vacDeleteBlock(this)">Delete</button></div>' +
    '</div>';
}

function vacPlacesHtml(plan, ui) {
    const row = (p, i) => {
        const url = vacPlaceUrl(p);
        if (String(ui.editPlace) === String(i)) return '<div class="vac-place vac-pedit" data-i="' + i + '">' +
            '<input class="vac-pe-label" value="' + vacEsc(p.label || '') + '" placeholder="Name" onkeydown="vacPlaceEditKey(this, event)">' +
            '<input class="vac-pe-addr" value="' + vacEsc(p.url || p.address || '') + '" placeholder="Address or Google Maps link" onkeydown="vacPlaceEditKey(this, event)">' +
            '<div class="vac-row"><button class="vac-btn" onclick="vacPlaceSave(this)">Save</button><button class="vac-btn" onclick="vacPlaceEditCancel(this)">Cancel</button></div></div>';
        return '<div class="vac-place">' +
            '<div class="vac-pmain"><div class="vac-pname" data-i="' + i + '" onclick="vacPlaceEdit(this)" title="Click to change">' + vacEsc(vacPlaceName(p)) +
                (p.label && p.address ? '<div class="vac-paddr">' + vacEsc(p.address) + '</div>' : '') + '</div>' + vacPlaceTargetHtml(p) + '</div>' +
            (url ? '<a class="vac-icon" href="' + vacEsc(url) + '" target="_blank" rel="noopener noreferrer" title="Open in Google Maps">📍</a>' : '') +
            '<button class="vac-icon vac-pedit-btn" data-i="' + i + '" onclick="vacPlaceEdit(this)" title="Change it">✎</button>' +
            '<button class="vac-icon" data-i="' + i + '" onclick="vacRemovePlace(this)" title="Remove">×</button>' +
        '</div>';
    };
    return plan.places.map((p, i) => row(p, i)).join('') +
        (plan.places.length ? '' : '<div class="vac-hint">Places kept here are offered when you name a block\u2019s place, a drive\u2019s or a parking lot. Paste a link from Google Maps to keep its pin.</div>') +
        '<div class="vac-add-place"><input class="vac-np-label" placeholder="Name">' +
            '<input class="vac-np-addr" placeholder="Address or Google Maps link" onkeydown="vacPlaceKey(this, event)">' +
            '<button class="vac-btn" onclick="vacAddPlace(this)">Add place</button></div>';
}

function vacPlaceEdit(el) {
    const widget = vacGetWidget(el);
    vacMutate(el, (plan, ui) => { ui.editPlace = el.dataset.i; return false; });
    const input = widget.querySelector('.vac-pedit .vac-pe-label');
    if (input) { input.focus(); input.select(); }
}

function vacPlaceEditCancel(el) { vacMutate(el, (plan, ui) => { ui.editPlace = null; return false; }); }

function vacPlaceEditKey(input, e) {
    if (e.key === 'Enter') { e.preventDefault(); vacPlaceSave(input); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); vacPlaceEditCancel(input); }
}

/**
 * Where a place is copied into the plan: block places, drives' starts, stops and
 * ends, and parking lots, each still exactly as the place was. Calls fn(holder, key)
 * for each, so the copy can be read or replaced.
 */
function vacPlaceCopies(plan, old, fn) {
    const counts = { block: 0, drive: 0, parking: 0 };
    Object.values(plan.days).forEach(d => d.blocks.forEach(b => {
        if (vacSamePlace(b.place, old)) { counts.block++; fn(b, 'place'); }
        const dr = b.drive;
        if (!dr) return;
        let hit = false;
        ['from', 'to'].forEach(k => { if (vacSamePlace(dr[k], old)) { hit = true; fn(dr, k); } });
        (dr.stops || []).forEach((st, i) => { if (vacSamePlace(st, old)) { hit = true; fn(dr.stops, i); } });
        if (hit) counts.drive++;
    }));
    (plan.parking || []).forEach(pk => { if (vacSamePlace(pk.lot, old)) { counts.parking++; fn(pk, 'lot'); } });
    return counts;
}

/** Asks whether the copies of a place still exactly as it was should change with it, and changes them if so. */
function vacReplaceCopies(plan, old, now) {
    const counts = vacPlaceCopies(plan, old, () => {});
    const parts = [['block', 'blocks'], ['drive', 'drives'], ['parking', 'parking']].filter(([k]) => counts[k])
        .map(([k, many]) => counts[k] + ' ' + (counts[k] === 1 ? k : many));
    if (parts.length && window.confirm('Change ' + (vacPlaceName(old) || 'it') + ' where it is used too: ' + parts.join(', ') + '?'))
        vacPlaceCopies(plan, old, (holder, key) => { holder[key] = vacCopyPlace(now); });
}

/**
 * A saved place changed. Where the plan holds a copy still
 * exactly as it was, it asks whether to change those too.
 */
function vacPlaceSave(el) {
    const box = el.closest('.vac-pedit'), i = box.dataset.i;
    const label = box.querySelector('.vac-pe-label').value.trim(), addr = box.querySelector('.vac-pe-addr').value;
    vacMutate(el, (plan, ui) => {
        const old = plan.places[+i];
        ui.editPlace = null;
        if (!old) return false;
        const got = vacParsePlace(addr) || { label: '', address: '' };
        if (label) vacRenamePlace(got, label);
        if (!got.label && !got.address && !got.url) return false;
        const now = vacCopyPlace(got);
        if (vacSamePlace(now, old) && now.lat === old.lat && now.lng === old.lng) return false;
        vacReplaceCopies(plan, old, now);
        plan.places[+i] = Object.assign({ id: old.id }, now);
    });
}

/** Each cruise: the ship and booking, boarding and leaving, and its days at sea or in port. */
function vacCruisesHtml(plan, ui) {
    const list = (plan.cruises || []).map((c, i) => vacCruiseCardHtml(plan, c, i, ui.toolId)).join('');
    return '<div class="vac-sec">🚢 Cruise</div>' +
        (list || '<div class="vac-hint">No cruise. The ship is where you sleep while on it: each port day’s route starts and ends at the port, and getting there and back can go to and from it.</div>') +
        '<button class="vac-btn vac-park-add vac-cruise-add" onclick="vacCruiseAdd(this)">+ Add cruise</button>';
}

function vacCruiseCardHtml(plan, c, i, toolId) {
    const on = ' onchange="vacCruiseField(this)"';
    const field = (label, key, extra) => '<label>' + label + '<input data-f="' + key + '" value="' + vacEsc(c[key] || '') + '"' + (extra || '') + on + '></label>';
    const place = (label, key, ph) => '<label>' + label + '<input data-f="' + key + '" list="vac-places-' + vacEsc(toolId || '') + '" value="' +
        vacEsc(vacPlaceInput(c[key])) + '" placeholder="' + ph + '"' + on + '></label>';
    const date = (key) => '<input type="date" data-f="' + key + '" value="' + vacEsc(c[key] || '') + '"' + on + '>';
    const time = (key, v, extra) => '<input type="time" step="300" data-f="' + key + '" value="' + (v != null ? vacTimeValue(v) : '') + '"' + (extra || '') + on + '>';
    const days = [];
    if (c.boardDate) for (let d = c.boardDate, n = 0; d <= (c.leaveDate || c.boardDate) && n < VAC_MAX_DAYS; d = vacAddDays(d, 1), n++) days.push(d);
    const rows = days.map(d => {
        const label = '<span class="vac-cday">' + vacEsc(vacDayLabel(d, 'short')) + '</span>';
        if (d === c.boardDate) return '<div class="vac-crow2">' + label + '🚢 Board' + (c.boardPlace ? ' · ' + vacEsc(vacPlaceName(c.boardPlace)) : '') +
            (c.boardTime != null ? ' · ' + vacTimeLabel(c.boardTime) : '') + (c.allAboard != null ? ' · all aboard ' + vacTimeLabel(c.allAboard) : '') + '</div>';
        if (d === c.leaveDate) return '<div class="vac-crow2">' + label + '🚢 Leave the ship' + (c.leavePlace || c.boardPlace ? ' · ' +
            vacEsc(vacPlaceName(c.leavePlace || c.boardPlace)) : '') + (c.leaveTime != null ? ' · ' + vacTimeLabel(c.leaveTime) : '') + '</div>';
        const day = (c.days || {})[d] || {}, dk = ' data-d="' + d + '"';
        return '<div class="vac-crow2 vac-cport' + (day.port ? '' : ' vac-atsea') + '">' + label + (day.port ? '⚓' : '🌊') +
            '<input class="vac-cport-in" data-f="port"' + dk + ' list="vac-places-' + vacEsc(toolId || '') + '" value="' + vacEsc(vacPlaceInput(day.port)) +
                '" placeholder="At sea, or a port"' + on + '>' +
            (day.port ? '<label class="vac-inline">in' + time('arrive', day.arrive, dk) + '</label><label class="vac-inline">out' + time('depart', day.depart, dk) + '</label>' +
                '<label class="vac-inline">all aboard' + time('aboard', vacAllAboard(day), dk) + '</label>' +
                (vacPlaceUrl(day.port) ? '<a class="vac-icon" href="' + vacEsc(vacPlaceUrl(day.port)) + '" target="_blank" rel="noopener noreferrer" title="Open in Google Maps">📍</a>' : '') : '') +
            '</div>';
    }).join('');
    return '<div class="vac-tcard vac-cruise-card vac-form" data-i="' + i + '">' +
        '<div class="vac-row">' + field('Cruise line', 'line') + field('Ship', 'ship', ' placeholder="Example Star"') + field('Cabin', 'cabin') + '</div>' +
        '<div class="vac-row">' + place('Boards at', 'boardPlace', 'The port: address, Maps link or a saved place') +
            '<label>On' + date('boardDate') + '</label><label>Boarding' + time('boardTime', c.boardTime) + '</label><label>All aboard' + time('allAboard', c.allAboard) + '</label></div>' +
        '<div class="vac-row">' + place('Leave the ship at', 'leavePlace', 'Where it boarded') +
            '<label>On' + date('leaveDate') + '</label><label>At' + time('leaveTime', c.leaveTime) + '</label></div>' +
        (rows ? '<div class="vac-cdays">' + rows + '</div>' : '') +
        '<div class="vac-row">' + field('Booking', 'conf') + field('Cost', 'cost') + '</div>' +
        '<label>Notes<textarea data-f="notes" rows="2"' + on + '>' + vacEsc(c.notes || '') + '</textarea></label>' +
        '<div class="vac-row"><span class="vac-out-gap"></span><button class="vac-btn vac-danger" onclick="vacCruiseRemove(this)">Remove</button></div>' +
        '</div>';
}

/** A cruise starts on the trip's first day and ends on its last. */
function vacCruiseAdd(btn) {
    const widget = vacGetWidget(btn);
    vacMutate(btn, (plan) => {
        const dates = vacDates(plan);
        (plan.cruises = plan.cruises || []).push({ id: vacNewId('c'), line: '', ship: '', cabin: '', conf: '', cost: '', notes: '',
            boardPlace: null, boardDate: dates[0] || '', boardTime: null, allAboard: null, leavePlace: null, leaveDate: dates[dates.length - 1] || '', leaveTime: null, days: {} });
    });
    const ships = widget.querySelectorAll('.vac-cruise-card [data-f="ship"]');
    if (ships.length) ships[ships.length - 1].focus();
}

function vacCruiseRemove(btn) {
    const i = +btn.closest('.vac-cruise-card').dataset.i;
    vacMutate(btn, (plan) => {
        const c = (plan.cruises || [])[i];
        if (!c) return 'none';
        if ((c.ship || c.boardPlace) && !window.confirm('Remove the cruise' + (c.ship ? ' on ' + c.ship : '') + '?')) return 'none';
        plan.cruises.splice(i, 1);
    });
}

/**
 * A field of a cruise. Its dates, a port given or taken away, change the days shown, so
 * those draw the tab again; anything else is saved with the card left as it is.
 */
function vacCruiseField(el) {
    const card = el.closest('.vac-cruise-card'), i = +card.dataset.i, k = el.dataset.f, d = el.dataset.d;
    const redraw = k === 'boardDate' || k === 'leaveDate' || k === 'port' || k === 'boardPlace' || k === 'leavePlace' || k === 'boardTime' || k === 'allAboard' || k === 'leaveTime';
    vacMutate(el, (plan) => {
        const c = (plan.cruises || [])[i];
        if (!c) return 'none';
        const time = () => el.value ? vacParseTime(el.value) : null;
        if (d) {
            c.days = c.days || {};
            const day = c.days[d] = c.days[d] || {};
            if (k === 'port') { day.port = vacResolvePlace(plan, el.value); if (!day.port) delete c.days[d]; }
            else day[k] = time();
        } else if (k === 'boardPlace' || k === 'leavePlace') c[k] = vacResolvePlace(plan, el.value);
        else if (k === 'boardTime' || k === 'allAboard' || k === 'leaveTime') c[k] = time();
        else if (k === 'boardDate' || k === 'leaveDate') {
            c[k] = el.value;
            if (c.leaveDate && c.boardDate && c.leaveDate < c.boardDate) c[k === 'boardDate' ? 'leaveDate' : 'boardDate'] = el.value;
        } else c[k] = k === 'notes' ? el.value : el.value.trim();
    }, redraw ? undefined : { draw: false });
    // All aboard, when not set, follows the time it sails.
    if (d && k === 'depart') {
        const c = (vacGetData(vacGetToolId(card)).cruises || [])[i], day = c && (c.days || {})[d];
        const aboard = card.querySelector('[data-f="aboard"][data-d="' + d + '"]');
        if (day && aboard && day.aboard == null) aboard.value = vacAllAboard(day) != null ? vacTimeValue(vacAllAboard(day)) : '';
    }
}

/** Each place to stay: where, when in and out, the booking, and how to reach them. */
function vacStaysHtml(plan, ui) {
    const on = ' onchange="vacStayField(this)"';
    const stays = (plan.stays || []).map((st, i) => {
        const p = st.place || {}, url = vacPlaceUrl(st.place);
        const date = (key) => '<input type="date" data-f="' + key + '" value="' + vacEsc(st[key] || '') + '"' + on + '>';
        const time = (key) => '<input type="time" step="900" data-f="' + key + '" value="' + (st[key] != null ? vacTimeValue(st[key]) : '') + '"' + on + '>';
        const field = (label, key, extra) => '<label>' + label + '<input data-f="' + key + '" value="' + vacEsc(st[key] || '') + '"' + (extra || '') + on + '></label>';
        return '<div class="vac-park vac-stay-card vac-form" data-i="' + i + '">' +
            '<label>Name<input data-f="label" value="' + vacEsc(p.label || '') + '" placeholder="Lake House, Hotel Example"' + on + '></label>' +
            '<label>Address or Google Maps link<input data-f="address" value="' + vacEsc(p.url || p.address || '') + '" placeholder="Paste a link from Google Maps"' + on + '></label>' +
            '<div class="vac-stay-target vac-wide">' + vacPlaceTargetHtml(st.place) + '</div>' +
            '<div class="vac-row"><label>Check in' + date('inDate') + '</label><label>&nbsp;' + time('inTime') + '</label></div>' +
            '<div class="vac-row"><label>Check out' + date('outDate') + '</label><label>&nbsp;' + time('outTime') + '</label></div>' +
            '<div class="vac-row">' + field('Confirmation', 'conf') + field('Cost', 'cost') + '</div>' +
            '<div class="vac-row">' + field('Phone', 'phone', ' type="tel"') + '</div>' +
            '<label class="vac-wide">Notes<textarea data-f="notes" rows="2"' + on + '>' + vacEsc(st.notes || '') + '</textarea></label>' +
            '<div class="vac-row vac-wide"><span class="vac-stay-links">' + vacStayLinksHtml(st) + '</span>' +
                '<button class="vac-btn vac-danger" onclick="vacStayRemove(this)">Remove</button></div>' +
            '</div>';
    }).join('');
    const homeUrl = vacPlaceUrl(plan.home);
    const sections = [
        { id: 'stays', label: '\uD83C\uDFE8 Stays', count: (plan.stays || []).length },
        { id: 'home', label: '\uD83C\uDFE0 Home', done: !!plan.home }
    ];
    const cur = sections.some(x => x.id === ui.stayTab) ? ui.stayTab : 'stays';
    const body = cur === 'home'
        ? '<div class="vac-row vac-home"><input class="vac-home-in" value="' + vacEsc(plan.home ? (plan.home.url || plan.home.address || plan.home.label) : '') +
            '" placeholder="Where the trip starts and ends: an address or a Maps link" onchange="vacHomeField(this)">' +
            '<span class="vac-home-link">' + (homeUrl ? '<a class="vac-icon" href="' + vacEsc(homeUrl) + '" target="_blank" rel="noopener noreferrer" title="Open in Google Maps">\uD83D\uDCCD</a>' : '') + '</span></div>' +
            '<div class="vac-hint">Getting there starts here and getting back ends here (Travel).</div>'
        : (stays || '<div class="vac-hint">Add where you’re staying: each day’s route starts from it, and its days show checking in and out.</div>') +
            '<button class="vac-btn vac-park-add" onclick="vacStayAdd(this)">+ Add stay</button>';
    return vacSubtabsHtml(sections, cur, 'vacStayTab', 'Set') + '<div class="vac-subpane" data-sub="' + cur + '">' + body + '</div>';
}

/** Which Stay section shows: kept while the planner is open, not with the plan. */
function vacStayTab(btn) { vacMutate(btn, (plan, ui) => { ui.view = 'stay'; ui.stayTab = btn.dataset.sub; return false; }); }

/** Home: where getting there starts and getting back ends. Drives already from or to it can follow it. */
function vacHomeField(el) {
    const box = el.closest('.vac-home');
    vacMutate(el, (plan) => {
        const now = vacParsePlace(el.value), old = plan.home;
        if (old && now && !vacSamePlace(old, now)) vacReplaceCopies(plan, old, now);
        plan.home = now ? vacCopyPlace(now) : null;
    }, { draw: false });
    const plan = vacGetData(vacGetToolId(box)), url = vacPlaceUrl(plan.home);
    const pill = vacGetWidget(box).querySelector('.vac-subtab[data-sub="home"]');
    if (pill) pill.innerHTML = '\uD83C\uDFE0 Home' + (plan.home ? ' <span class="vac-jstate" title="Set">\u2713</span>' : '');
    box.querySelector('.vac-home-link').innerHTML = url ? '<a class="vac-icon" href="' + vacEsc(url) + '" target="_blank" rel="noopener noreferrer" title="Open in Google Maps">📍</a>' : '';
}

function vacStayLinksHtml(st) {
    const url = vacPlaceUrl(st.place), tel = String(st.phone || '').replace(/[^\d+]/g, '');
    return (url ? '<a class="vac-btn" href="' + vacEsc(url) + '" target="_blank" rel="noopener noreferrer">📍 Open in Maps</a>' : '') +
        (tel ? '<a class="vac-btn" href="tel:' + vacEsc(tel) + '">📞 Call</a>' : '');
}

/** A new stay starts where the last one ends, or on the trip's first day, and runs to its last. */
function vacStayAdd(btn) {
    const widget = vacGetWidget(btn);
    vacMutate(btn, (plan) => {
        const dates = vacDates(plan), last = (plan.stays || [])[plan.stays.length - 1];
        const inDate = (last && last.outDate) || dates[0] || '';
        plan.stays.push({ id: vacNewId('s'), place: null, inDate, inTime: null,
            outDate: dates.length && dates[dates.length - 1] > inDate ? dates[dates.length - 1] : inDate, outTime: null,
            conf: '', cost: '', phone: '', notes: '' });
    });
    const names = widget.querySelectorAll('.vac-stay-card [data-f="label"]');
    if (names.length) names[names.length - 1].focus();
}

function vacStayRemove(btn) {
    const i = +btn.closest('.vac-stay-card').dataset.i;
    vacMutate(btn, (plan) => {
        const st = plan.stays[i];
        if (!st) return 'none';
        if (st.place && !window.confirm('Remove ' + (vacPlaceName(st.place) || 'this stay') + '?')) return 'none';
        plan.stays.splice(i, 1);
    });
}

/**
 * A field of a stay, saved with the form left as it is. Its name or address changed,
 * the copies of it still exactly as it was (a drive from it, say) can change too.
 */
function vacStayField(el) {
    const card = el.closest('.vac-stay-card'), i = +card.dataset.i, k = el.dataset.f;
    vacMutate(el, (plan) => {
        const st = plan.stays[i];
        if (!st) return 'none';
        if (k === 'label' || k === 'address') {
            const old = st.place;
            const label = card.querySelector('[data-f="label"]').value.trim();
            const got = vacParsePlace(card.querySelector('[data-f="address"]').value) || { label: '', address: '' };
            if (label) vacRenamePlace(got, label);
            const now = got.label || got.address || got.url ? vacCopyPlace(got) : null;
            if (old && now && !vacSamePlace(old, now)) vacReplaceCopies(plan, old, now);
            st.place = now;
        } else if (k === 'inTime' || k === 'outTime') st[k] = el.value ? vacParseTime(el.value) : null;
        else st[k] = k === 'notes' ? el.value : el.value.trim();
    }, { draw: false });
    const st = (vacGetData(vacGetToolId(card)).stays || [])[i];
    if (!st) return;
    // A pasted Maps link gives its name, when none was typed.
    const name = card.querySelector('[data-f="label"]');
    if (k === 'address' && st.place && st.place.label && !name.value) name.value = st.place.label;
    const links = card.querySelector('.vac-stay-links'), next = document.createElement('span');
    next.innerHTML = vacStayLinksHtml(st);
    if (next.innerHTML !== links.innerHTML) links.innerHTML = next.innerHTML;
}

/** A flight to fill in, in Travel: the same flight as the block on its day, and the same fields. */
function vacFlightCardHtml(plan, dates, d, b) {
    const fl = b.flight || {}, on = ' onchange="vacEditField(this)"';
    const field = (label, key, value, extra) => '<label>' + label + '<input data-f="' + key + '" value="' + vacEsc(value || '') + '"' + (extra || '') + on + '></label>';
    return '<div class="vac-tcard vac-form" data-id="' + vacEsc(b.id) + '">' +
        '<div class="vac-row"><label>Day<select data-f="date"' + on + '>' + dates.map(x => '<option value="' + x + '"' + (x === d ? ' selected' : '') + '>' +
            vacEsc(vacDayName(plan, x, 'short')) + '</option>').join('') + '</select></label>' + field('Flight', 'f_number', fl.number, ' placeholder="XY 123"') + '</div>' +
        '<div class="vac-row">' + field('From', 'f_from', fl.from, ' placeholder="Airport"') + field('To', 'f_to', fl.to, ' placeholder="Airport"') + '</div>' +
        '<div class="vac-row"><label>Departs<input type="time" step="300" data-f="start" value="' + vacTimeValue(b.start) + '"' + on + '></label>' +
            '<label>Lands<input type="time" step="300" data-f="f_arrive" value="' + vacTimeValue(fl.arrive != null ? fl.arrive : b.end) + '"' + on + '></label>' +
            '<label>On<select data-f="f_arriveDay"' + on + '>' + [0, 1, 2].map(n => '<option value="' + n + '"' + ((fl.arriveDay || 0) === n ? ' selected' : '') + '>' +
                (n ? '+' + n + ' day' : 'the same day') + '</option>').join('') + '</select></label></div>' +
        '<div class="vac-row">' + field('Seat', 'f_seat', fl.seat) + field('Terminal / gate', 'f_gate', fl.gate) + field('Confirmation', 'f_conf', fl.conf) + '</div>' +
        vacFlightTimesHtml(plan, d, b) +
        '<div class="vac-row"><span class="vac-row vac-form-links">' + vacFormLinksHtml(plan, b) + '</span><span class="vac-out-gap"></span>' +
            '<button class="vac-btn" data-date="' + d + '" data-id="' + vacEsc(b.id) + '" onclick="vacTripPick(this)" title="The flight on its day">Open on its day</button>' +
            '<button class="vac-btn vac-danger" onclick="vacFlightRemove(this)">Remove</button></div>' +
        '</div>';
}

/** A flight added from Travel: a flight block on the trip's first day, to fill in. */
function vacFlightAdd(btn) {
    const widget = vacGetWidget(btn);
    let id = null;
    vacMutate(btn, (plan) => {
        const dates = vacDates(plan);
        if (!dates.length) return 'none';
        id = vacNewId();
        plan.days[dates[0]].blocks.push({ id, title: '', kind: 'flight', start: 540, end: 660, flight: { arrive: 660, arriveDay: 0 } });
    });
    const number = id && widget.querySelector('.vac-tcard[data-id="' + id + '"] [data-f="f_number"]');
    if (number) number.focus();
}

function vacFlightRemove(btn) {
    const id = btn.closest('.vac-tcard').dataset.id;
    vacMutate(btn, (plan, ui) => {
        const f = vacFind(plan, id);
        if (!f) return 'none';
        f.day.blocks.splice(f.index, 1);
        if (ui.sel === id) ui.sel = null;
    });
}

// ---- Getting there and getting back: home, parking, the flight and where you stay, in order.
const VAC_TRANSFER_MODES = [
    { id: 'taxi', label: 'Taxi', icon: '🚕', kind: 'travel' },
    { id: 'rental', label: 'Rental car', icon: '🚗', kind: 'drive' },
    { id: 'shuttle', label: 'Shuttle', icon: '🚌', kind: 'travel' },
    { id: 'train', label: 'Train', icon: '🚆', kind: 'travel' },
    { id: 'drive', label: 'Drive', icon: '🚗', kind: 'drive' }
];
// Getting from one place to the next, and how: the mode Google Maps is asked for.
// For an estimate: the way is `detour` times the straight line, at `kmh`, plus `extra`
// minutes (parking, waiting); a drive past 30 km goes faster, on bigger roads.
const VAC_GAP_MODES = [
    { id: 'walk', label: 'Walk', icon: '\uD83D\uDEB6', maps: 'walking', detour: 1.3, kmh: 4.8, extra: 0 },
    { id: 'drive', label: 'Drive', icon: '\uD83D\uDE97', maps: 'driving', detour: 1.35, kmh: 40, extra: 5 },
    { id: 'transit', label: 'Transit', icon: '\uD83D\uDE8C', maps: 'transit', detour: 1.4, kmh: 20, extra: 10 },
    { id: 'taxi', label: 'Taxi', icon: '\uD83D\uDE95', maps: 'driving', detour: 1.35, kmh: 35, extra: 5 }
];
const VAC_GAP_LENGTHS = [5, 10, 15, 20, 25, 30, 40, 45, 60, 75, 90, 120, 150, 180, 240];
const VAC_STEP_LENGTHS = [5, 10, 15, 20, 30, 40, 45, 60, 75, 90, 120, 150, 180, 240, 300, 360, 480];

function vacLen(min) { return min >= 60 ? (min / 60) + ' h' : min + ' min'; }

/** A journey's settings, with their defaults: how long each step takes, and which flight it is built on. */
function vacJourneyOpts(plan, which) {
    plan.journeys = plan.journeys || {};
    const base = { flight: '', driveMin: null, shuttleMin: 20, exitMin: 30, transferMin: null, transferMode: 'taxi', pickupMin: 30, returnMin: 15, leave: which === 'out' ? 540 : 600 };
    plan.journeys[which] = Object.assign(base, plan.journeys[which] || {});
    return plan.journeys[which];
}

/** Every flight in the trip, by day and time. */
function vacAllFlights(plan) {
    return vacDates(plan).flatMap(d => plan.days[d].blocks.filter(b => b.kind === 'flight').sort((a, b) => a.start - b.start).map(b => ({ date: d, b })));
}

/** The flight a journey is built on: the one chosen, else the first going and the last (if another) coming back. */
function vacJourneyFlight(plan, which, o) {
    if (o.flight === 'none') return null;
    const all = vacAllFlights(plan);
    const chosen = o.flight && all.find(x => x.b.id === o.flight);
    if (chosen) return chosen;
    if (!all.length) return null;
    return which === 'out' ? all[0] : (all.length > 1 ? all[all.length - 1] : null);
}

/** The parking going: dropped off that day, else the first; coming back: picked up that day, else the last. */
function vacJourneyParking(plan, which, date) {
    const ps = (plan.parking || []);
    if (!ps.length) return null;
    return which === 'out' ? (ps.find(p => p.fromDate === date) || ps[0]) : (ps.find(p => p.toDate === date) || ps[ps.length - 1]);
}

/** The rental a journey uses: going, picked up the day it lands, else the first; back, returned that day, else the last. */
function vacJourneyRental(plan, which, date) {
    const rs = plan.rentals || [];
    if (!rs.length) return null;
    return which === 'out' ? (rs.find(r => r.pickDate === date) || rs[0]) : (rs.find(r => r.dropDate === date) || rs[rs.length - 1]);
}

/** For the airport step: when bags and the gate close, where set. */
function vacCutoffText(date, b) {
    const t = vacFlightTimes(date, b);
    return (t.bag ? ' · bags by ' + vacTimeLabel(t.bag.at) : '') + (t.gate ? ' · gate closes ' + vacTimeLabel(t.gate.at) : '');
}

/**
 * A journey's steps, worked out from its flight: going, back from take-off (home, the
 * drive, parking, the shuttle, the airport) and on from landing (the transfer, checking
 * in); coming back the other way round. With no flight it is a drive between home and
 * the first or last stay. A step with a kind and both times becomes a block.
 */
function vacJourneyPlan(plan, which) {
    const o = vacJourneyOpts(plan, which), dates = vacDates(plan), home = plan.home;
    const steps = [], notes = [];
    if (!dates.length) return { o, F: null, steps, notes: ['Pick the dates of the trip, above, first.'] };
    const F = vacJourneyFlight(plan, which, o);
    const clamp = (t) => Math.max(0, Math.min(1440, t));
    const after = (t, len) => len != null ? clamp(t + len) : null;
    const before = (t, len) => len != null ? clamp(t - len) : null;
    const mode = VAC_TRANSFER_MODES.find(m => m.id === o.transferMode) || VAC_TRANSFER_MODES[0];
    const homeStep = { leg: 'home', icon: '🏠', title: home ? vacPlaceName(home) : 'Home', place: home };
    const stayName = (st) => st ? vacPlaceName(st.place) : 'where you\u2019re staying';
    // A step's length: as chosen, else the travel time between its two places (set, or estimated).
    const modeOf = (key) => key === 'driveMin' ? 'drive' : ({ rental: 'drive', drive: 'drive', taxi: 'taxi' })[o.transferMode] || 'transit';
    const L = (key, from, to) => { if (o[key] != null) return o[key]; const t = vacTravelTime(plan, from, to, modeOf(key)); return t ? t.min : null; };
    const inStep = (st) => st.cruise ? { leg: 'checkin', icon: '\uD83D\uDEA2', title: 'Board ' + st.name, date: st.inDate, start: st.inTime, end: null }
        : { leg: 'checkin', icon: '\uD83C\uDFE8', title: 'Check in \u00B7 ' + stayName(st), date: st.inDate, start: st.inTime, end: null };
    const outStep = (st, d) => st.cruise ? { leg: 'checkout', icon: '\uD83D\uDEA2', title: 'Leave ' + st.name, date: st.outDate || d, start: st.outTime, end: null }
        : { leg: 'checkout', icon: '\uD83C\uDFE8', title: 'Check out \u00B7 ' + stayName(st), date: st.outDate || d, start: st.outTime, end: null };
    if (which === 'out') {
        steps.push(homeStep);
        if (F) {
            const fl = F.b.flight || {}, d = F.date, airport = vacAirportPlace(fl.from);
            const at = clamp(F.b.start - plan.airportLead), pk = vacJourneyParking(plan, 'out', d);
            if (pk) {
                const shStart = clamp(at - o.shuttleMin);
                steps.push({ leg: 'drive', icon: '🚗', kind: 'drive', title: 'Drive to ' + (vacPlaceName(pk.lot) || 'the parking'), date: d,
                    start: before(shStart, L('driveMin', home, pk.lot)), end: shStart, from: home, to: pk.lot, len: 'driveMin' });
                steps.push({ leg: 'park', icon: '🅿️', title: 'Drop off · ' + (vacPlaceName(pk.lot) || 'the parking'), date: d, start: shStart, parking: pk.id, end: null, at: 'from' });
                steps.push({ leg: 'shuttle', icon: '🚌', kind: 'travel', title: 'Shuttle to ' + (fl.from || 'the airport'), date: d, start: shStart, end: at, to: airport, len: 'shuttleMin' });
            } else {
                steps.push({ leg: 'drive', icon: '🚗', kind: 'drive', title: 'Drive to ' + (fl.from ? fl.from + ' airport' : 'the airport'), date: d,
                    start: before(at, L('driveMin', home, airport)), end: at, from: home, to: airport, len: 'driveMin' });
            }
            // The time at the airport, check-in, security and the gate, is a block of its own.
            steps.push({ leg: 'airport', icon: '⏱️', kind: 'travel', title: 'At the airport, ' + vacLen(plan.airportLead) + ' before' + vacCutoffText(d, F.b), date: d, start: at, end: F.b.start,
                to: vacAirportPlace(fl.from) });
            steps.push({ leg: 'flight', icon: '✈️', title: vacBlockInfo(plan, F.b).title + (fl.from || fl.to ? ' · ' + [fl.from, fl.to].filter(Boolean).join(' → ') : ''),
                date: d, start: F.b.start, end: fl.arrive != null ? fl.arrive : F.b.end, plus: fl.arriveDay || 0 });
            const ld = vacAddDays(d, fl.arriveDay || 0), land = fl.arrive != null ? fl.arrive : F.b.end;
            const st = vacStaysOn(plan, ld).night || vacStaysOn(plan, ld).morning, ts = clamp(land + o.exitMin);
            steps.push({ leg: 'arrive', icon: '\uD83D\uDEC4', kind: 'travel', title: 'Bags and out' + (fl.to ? ' \u00B7 ' + fl.to : ''), date: ld, start: land, end: ts, to: vacAirportPlace(fl.to) });
            const rental = mode.id === 'rental' && vacJourneyRental(plan, 'out', ld);
            if (rental) {
                const drive = clamp(ts + o.pickupMin);
                steps.push({ leg: 'pickup', icon: '\uD83D\uDE99', kind: 'travel', title: 'Pick up the rental car \u00B7 ' + (rental.company || vacPlaceName(rental.pickPlace) || 'the counter'),
                    date: ld, start: ts, end: drive, rental: rental.id, at: 'pick', len: 'pickupMin', exit: true, mode: true, to: rental.pickPlace || vacAirportPlace(fl.to) });
                steps.push({ leg: 'transfer', icon: '\uD83D\uDE97', kind: 'drive', title: 'Drive to ' + stayName(st), date: ld, start: drive, end: after(drive, L('transferMin', rental.pickPlace || vacAirportPlace(fl.to), st && st.place)),
                    from: rental.pickPlace || vacAirportPlace(fl.to), to: st && st.place, len: 'transferMin' });
            } else steps.push({ leg: 'transfer', icon: mode.icon, kind: mode.kind, title: mode.label + ' to ' + stayName(st), date: ld, start: ts, end: after(ts, L('transferMin', vacAirportPlace(fl.to), st && st.place)),
                from: vacAirportPlace(fl.to), to: st && st.place, len: 'transferMin', exit: true, mode: true });
            if (st) steps.push(inStep(st));
            if (!dates.includes(ld)) notes.push('It lands after the trip’s last day: change the dates to plan from there.');
        } else {
            const d = dates[0], st = vacStaysOn(plan, d).night;
            steps.push({ leg: 'drive', icon: '🚗', kind: 'drive', title: 'Drive to ' + stayName(st), date: d, start: o.leave, end: after(o.leave, L('driveMin', home, st && st.place)),
                from: home, to: st && st.place, len: 'driveMin', leave: true });
            if (st) steps.push(inStep(st));
        }
    } else {
        if (F) {
            const fl = F.b.flight || {}, d = F.date, at = clamp(F.b.start - plan.airportLead);
            const st = vacStaysOn(plan, d).morning || vacStaysOn(plan, d).night;
            if (st) steps.push(outStep(st, d));
            const rental = mode.id === 'rental' && vacJourneyRental(plan, 'back', d);
            if (rental) {
                // Back by the shuttle's start, the return taking its own time before it.
                const back = rental.dropPlace || rental.pickPlace, shStart = clamp(at - o.shuttleMin), ret = clamp(shStart - (o.returnMin || 0));
                steps.push({ leg: 'transfer', icon: '\uD83D\uDE97', kind: 'drive', title: 'Drive to ' + (vacPlaceName(back) || 'return the car'), date: d,
                    start: before(ret, L('transferMin', st && st.place, back || vacAirportPlace(fl.from))), end: ret, from: st && st.place, to: back || vacAirportPlace(fl.from), len: 'transferMin', mode: true });
                steps.push({ leg: 'return', icon: '\uD83D\uDE99', kind: 'travel', title: 'Return the rental car \u00B7 ' + (rental.company || vacPlaceName(back) || 'the counter'),
                    date: d, start: ret, end: shStart, rental: rental.id, at: 'drop', len: 'returnMin', to: back || vacAirportPlace(fl.from) });
                steps.push({ leg: 'rshuttle', icon: '\uD83D\uDE8C', kind: 'travel', title: 'Shuttle to ' + (fl.from || 'the airport'), date: d, start: shStart, end: at,
                    to: vacAirportPlace(fl.from), len: 'shuttleMin' });
            } else steps.push({ leg: 'transfer', icon: mode.icon, kind: mode.kind, title: mode.label + ' to ' + (fl.from || 'the airport'), date: d, start: before(at, L('transferMin', st && st.place, vacAirportPlace(fl.from))), end: at,
                from: st && st.place, to: vacAirportPlace(fl.from), len: 'transferMin', mode: true });
            // The time at the airport, check-in, security and the gate, is a block of its own.
            steps.push({ leg: 'airport', icon: '⏱️', kind: 'travel', title: 'At the airport, ' + vacLen(plan.airportLead) + ' before' + vacCutoffText(d, F.b), date: d, start: at, end: F.b.start,
                to: vacAirportPlace(fl.from) });
            steps.push({ leg: 'flight', icon: '✈️', title: vacBlockInfo(plan, F.b).title + (fl.from || fl.to ? ' · ' + [fl.from, fl.to].filter(Boolean).join(' → ') : ''),
                date: d, start: F.b.start, end: fl.arrive != null ? fl.arrive : F.b.end, plus: fl.arriveDay || 0 });
            const ld = vacAddDays(d, fl.arriveDay || 0), land = fl.arrive != null ? fl.arrive : F.b.end, ex = clamp(land + o.exitMin);
            steps.push({ leg: 'arrive', icon: '\uD83D\uDEC4', kind: 'travel', title: 'Bags and out' + (fl.to ? ' \u00B7 ' + fl.to : ''), date: ld, start: land, end: ex, to: vacAirportPlace(fl.to) });
            const pk = vacJourneyParking(plan, 'back', ld);
            if (pk) {
                const shEnd = clamp(ex + o.shuttleMin);
                steps.push({ leg: 'shuttle', icon: '🚌', kind: 'travel', title: 'Shuttle to ' + (vacPlaceName(pk.lot) || 'the parking'), date: ld, start: ex, end: shEnd,
                    to: pk.lot, len: 'shuttleMin', exit: true });
                steps.push({ leg: 'park', icon: '🅿️', title: 'Pick up · ' + (vacPlaceName(pk.lot) || 'the parking'), date: ld, start: shEnd, end: null, parking: pk.id, at: 'to' });
                steps.push({ leg: 'drive', icon: '🚗', kind: 'drive', title: 'Drive home', date: ld, start: shEnd, end: after(shEnd, L('driveMin', pk.lot, home)), from: pk.lot, to: home, len: 'driveMin' });
            } else {
                steps.push({ leg: 'drive', icon: '🚗', kind: 'drive', title: 'Drive home', date: ld, start: ex, end: after(ex, L('driveMin', vacAirportPlace(fl.to), home)),
                    from: vacAirportPlace(fl.to), to: home, len: 'driveMin', exit: true });
            }
            if (!dates.includes(ld)) notes.push('It lands after the trip’s last day: change the dates to plan the way home.');
        } else {
            const d = dates[dates.length - 1], st = vacStaysOn(plan, d).morning;
            if (st) steps.push(outStep(st, d));
            steps.push({ leg: 'drive', icon: '🚗', kind: 'drive', title: 'Drive home', date: d, start: o.leave, end: after(o.leave, L('driveMin', st && st.place, home)),
                from: st && st.place, to: home, len: 'driveMin', leave: true });
        }
        steps.push(homeStep);
    }
    steps.forEach(st => {
        if (st.len && st.len !== 'shuttleMin' && st.len !== 'pickupMin' && st.len !== 'returnMin' && o[st.len] == null && st.from && st.to) st.auto = vacTravelTime(plan, st.from, st.to, modeOf(st.len));
    });
    // Online check-in, before setting off: on its own day, first (after home going; first coming back).
    if (F) {
        const t = vacFlightTimes(F.date, F.b);
        if (t.online) steps.splice(which === 'out' ? 1 : 0, 0, { leg: 'online', icon: '\u2705', title: 'Online check-in opens', date: t.online.date, start: t.online.at, end: null });
    }
    // Checked out by the time you leave, checked in once you are there: the steps stay in order.
    steps.forEach((st, i) => {
        if (st.leg === 'checkout' && st.start != null) {
            const next = steps.slice(i + 1).find(x => x.start != null && x.date === st.date);
            if (next && next.start < st.start) st.start = next.start;
        }
        if (st.leg === 'checkin' && st.start != null) {
            const prev = steps.slice(0, i).reverse().find(x => x.date === st.date && (x.end != null || x.start != null));
            const at = prev && (prev.end != null ? prev.end : prev.start);
            if (at != null && at > st.start) st.start = at;
        }
    });
    if (!home) notes.push('Set Home, in the Stay tab, so the drives know where they start and end.');
    return { o, F, steps, notes };
}

/** Where a journey's step is on the schedule, if it is. */
function vacFindLeg(plan, key) {
    for (const d of Object.keys(plan.days)) {
        const i = plan.days[d].blocks.findIndex(b => b.leg === key);
        if (i >= 0) return { date: d, index: i, block: plan.days[d].blocks[i] };
    }
    return null;
}

/** A step the planner put on the schedule that has since been changed by hand: moved, stretched or taken to another day. */
function vacLegEdited(block, date) {
    const at = block.legAt;
    return !at || at.date !== date || at.start !== block.start || at.end !== block.end;
}

/**
 * Puts a journey on the schedule: each step with both times as a block, updated where
 * the planner made it and nobody has changed it since; parking's drop-off or pick-up
 * set from it; steps it made before and no longer needs taken away, unless changed.
 */
function vacJourneyApplyTo(plan, which) {
    const { steps, F } = vacJourneyPlan(plan, which), made = new Set();
    let prev = null;   // the block of the step before, and that step, for the links
    const chain = (b, st, mine) => {
        if (prev && prev.date === st.date && mine && !b.nolink && prev.block !== b) {
            b.link = prev.block.id;
            b.linkGap = Math.max(0, st.start - (prev.st.end != null ? prev.st.end : prev.st.start));
        }
        prev = { block: b, st, date: st.date };
    };
    steps.forEach(st => {
        if (st.leg === 'flight' && F) { chain(F.b, st, which === 'out'); return; }
        if (st.leg === 'park') {
            const pk = (plan.parking || []).find(p => p.id === st.parking);
            if (pk) { pk[st.at + 'Date'] = st.date; pk[st.at + 'Time'] = st.start; }
            return;
        }
        if (st.rental) {
            const r = (plan.rentals || []).find(x => x.id === st.rental);
            if (r) { r[st.at + 'Date'] = st.date; r[st.at + 'Time'] = st.start; }
            if (!st.kind) return;   // picking up and returning go on as blocks too
        }
        if (!st.kind || st.start == null || st.end == null || !plan.days[st.date]) return;
        const key = which + ':' + st.leg;
        made.add(key);
        const fresh = { title: st.title, kind: st.kind, start: st.start, end: Math.min(1440, Math.max(st.end, st.start + VAC_SNAP)) };
        const found = vacFindLeg(plan, key);
        if (found && vacLegEdited(found.block, found.date)) { prev = { block: found.block, st: { end: found.block.end }, date: found.date }; return; }
        let b = found && found.block;
        if (found && found.date !== st.date) { plan.days[found.date].blocks.splice(found.index, 1); plan.days[st.date].blocks.push(b); }
        if (!b) { b = { id: vacNewId(), leg: key }; plan.days[st.date].blocks.push(b); }
        Object.assign(b, fresh);
        if (st.rental) b.rentalId = st.rental;
        delete b.place; delete b.drive;
        if (st.kind === 'drive') b.drive = { from: vacCopyPlace(st.from), to: vacCopyPlace(st.to), stops: [] };
        else if (st.to) b.place = vacCopyPlace(st.to);
        b.legAt = { date: st.date, start: b.start, end: b.end };
        chain(b, st, true);
    });
    Object.keys(plan.days).forEach(d => {
        plan.days[d].blocks = plan.days[d].blocks.filter(b => !b.leg || b.leg.indexOf(which + ':') !== 0 || made.has(b.leg) || vacLegEdited(b, d));
    });
}

function vacJourneyOnSchedule(plan, which) {
    return Object.values(plan.days).some(d => d.blocks.some(b => b.leg && b.leg.indexOf(which + ':') === 0));
}

function vacJourneyApply(btn) { vacMutate(btn, (plan) => { vacJourneyApplyTo(plan, btn.dataset.j); }); }

/** A journey's setting. Once it is on the schedule, the schedule follows. */
function vacJourneyField(el) {
    const which = el.dataset.j, k = el.dataset.k;
    vacMutate(el, (plan) => {
        const o = vacJourneyOpts(plan, which);
        if (k === 'flight' || k === 'transferMode') o[k] = el.value;
        else if (k === 'leave') { const t = vacParseTime(el.value); if (t == null) return 'none'; o.leave = t; }
        else o[k] = el.value === '' ? null : +el.value;
        if (vacJourneyOnSchedule(plan, which)) vacJourneyApplyTo(plan, which);
    });
}

function vacStepTimes(st) {
    if (st.start == null) return '';
    return vacTimeLabel(st.start) + (st.end != null ? '–' + vacTimeLabel(st.end) + (st.plus ? ' +' + st.plus : '') : '');
}

function vacJourneyHtml(plan, which) {
    const { o, F, steps, notes } = vacJourneyPlan(plan, which);
    const flights = vacAllFlights(plan), on = (k) => ' data-j="' + which + '" data-k="' + k + '" onchange="vacJourneyField(this)"';
    const lenSel = (k, v, none) => '<select class="vac-jlen"' + on(k) + '><option value=""' + (v == null ? ' selected' : '') + '>' + none + '</option>' +
        VAC_STEP_LENGTHS.map(n => '<option value="' + n + '"' + (n === v ? ' selected' : '') + '>' + vacLen(n) + '</option>').join('') + '</select>';
    const placed = vacJourneyOnSchedule(plan, which);
    const rows = steps.map(st => {
        const leg = st.kind ? vacFindLeg(plan, which + ':' + st.leg) : null;
        const edited = leg && vacLegEdited(leg.block, leg.date);
        const times = edited ? vacTimeLabel(leg.block.start) + '–' + vacTimeLabel(leg.block.end) : vacStepTimes(st);
        const dir = st.kind === 'drive' && st.from && st.to ? vacDirUrl(vacRouteStop(st.from), [], vacRouteStop(st.to)) : '';
        return '<div class="vac-jstep vac-j-' + st.leg + '">' +
            '<span class="vac-jicon">' + st.icon + '</span>' +
            '<span class="vac-jtext"><b>' + vacEsc(st.title) + '</b>' +
                (st.date && st.leg !== 'home' ? ' <span class="vac-jwhen">' + vacEsc(vacDayLabel(edited ? leg.date : st.date, 'short')) + (times ? ' · ' + times : '') + '</span>' : '') + '</span>' +
            (st.mode ? '<select' + on('transferMode') + '>' + VAC_TRANSFER_MODES.map(m => '<option value="' + m.id + '"' + (m.id === o.transferMode ? ' selected' : '') + '>' +
                m.icon + ' ' + m.label + '</option>').join('') + '</select>' : '') +
            (st.exit ? '<label class="vac-inline">leaving <select class="vac-jlen"' + on('exitMin') + '>' + [10, 15, 20, 30, 45, 60, 90].map(n => '<option value="' + n + '"' +
                (n === o.exitMin ? ' selected' : '') + '>' + vacLen(n) + '</option>').join('') + '</select> after landing</label>' : '') +
            (st.leave ? '<label class="vac-inline">leaving at <input type="time" step="900" value="' + vacTimeValue(o.leave) + '"' + on('leave') + '></label>' : '') +
            (st.len ? lenSel(st.len, o[st.len], st.auto ? 'Travel time' : 'How long?') : '') +
            (st.auto ? '<span class="vac-jauto" title="' + (st.auto.estimate ? 'Estimated from the two places\u2019 pins' : 'The travel time set for these two places') +
                ': choose a length to use your own">' + (st.auto.estimate ? '\u2248 ' : '') + vacDur(st.auto.min) + '</span>' : '') +
            (dir ? '<a class="vac-icon" href="' + vacEsc(dir) + '" target="_blank" rel="noopener noreferrer" title="Directions in Google Maps, to see how long it takes">🗺️</a>' : '') +
            (st.leg === 'home' && !plan.home ? '<button class="vac-btn" data-view="stay" onclick="vacView(this)">Set home</button>' : '') +
            (edited ? '<span class="vac-jstate" title="Changed by hand: planning again leaves it as it is">✎ changed</span>'
                : leg ? '<span class="vac-jstate" title="On the schedule">✓</span>'
                : st.kind && st.len && o[st.len] == null && !st.auto ? '<span class="vac-jstate vac-hint">needs a length</span>' : '') +
            '</div>';
    }).join('');
    return '<div class="vac-journey" data-j="' + which + '">' +
        '<div class="vac-row"><label class="vac-inline">Flight <select' + on('flight') + '>' +
            '<option value=""' + (!o.flight ? ' selected' : '') + '>' + (which === 'out' ? 'The first' : 'The last') + (F && !o.flight ? ': ' + vacEsc(vacBlockInfo(plan, F.b).title) : '') + '</option>' +
            flights.map(x => '<option value="' + vacEsc(x.b.id) + '"' + (o.flight === x.b.id ? ' selected' : '') + '>' + vacEsc(vacDayLabel(x.date, 'short') + ' · ' + vacBlockInfo(plan, x.b).title) + '</option>').join('') +
            '<option value="none"' + (o.flight === 'none' ? ' selected' : '') + '>No flight: drive</option></select></label>' +
            '<span class="vac-out-gap"></span>' +
            '<button class="vac-btn" data-j="' + which + '" onclick="vacJourneyApply(this)" title="Each step with its times, as a block on its day">📅 ' +
                (placed ? 'Update the schedule' : 'Put it on the schedule') + '</button></div>' +
        rows + notes.map(n => '<div class="vac-hint">' + vacEsc(n) + '</div>').join('') + '</div>';
}

/** A row of sub-tabs, each with its count or a ✓ (titled `doneTip`) when it has one. */
function vacSubtabsHtml(sections, cur, handler, doneTip) {
    return '<div class="vac-subtabs" role="tablist">' + sections.map(x => '<button class="vac-subtab' + (x.id === cur ? ' vac-on' : '') + '" role="tab" ' +
        'data-sub="' + x.id + '" onclick="' + handler + '(this)">' + x.label + (x.count ? ' <span class="vac-count">' + x.count + '</span>' : '') +
        (x.done ? ' <span class="vac-jstate" title="' + vacEsc(doneTip) + '">\u2713</span>' : '') + '</button>').join('') + '</div>';
}

/** Which Travel section shows: kept while the planner is open, not with the plan. */
function vacTravelTab(btn) { vacMutate(btn, (plan, ui) => { ui.view = 'travel'; ui.travelTab = btn.dataset.sub; return false; }); }

function vacTravelHtml(plan, ui) {
    const dates0 = vacDates(plan);
    const flights = dates0.flatMap(d => plan.days[d].blocks.filter(b => b.kind === 'flight').sort((a, b) => a.start - b.start)
        .map(b => vacFlightCardHtml(plan, dates0, d, b))).join('');
    const on = ' onchange="vacParkField(this)"';
    const dates = vacDates(plan);
    const park = (plan.parking || []).map((pk, i) => {
        const url = vacPlaceUrl(pk.lot);
        const date = (key, value) => '<input type="date" data-f="' + key + '" value="' + vacEsc(value || '') + '"' +
            (dates.length ? ' min="' + vacAddDays(dates[0], -7) + '"' : '') + on + '>';
        const time = (key, value) => '<input type="time" step="900" data-f="' + key + '" value="' + (value != null ? vacTimeValue(value) : '') + '"' + on + '>';
        return '<div class="vac-park vac-form" data-i="' + i + '">' +
            '<label>Where<input data-f="lot" list="vac-places-' + vacEsc(ui.toolId) + '" value="' + vacEsc(vacPlaceInput(pk.lot)) + '" placeholder="The lot: address, Maps link or a saved place"' + on + '></label>' +
            '<div class="vac-row"><label>Drop off' + date('fromDate', pk.fromDate) + '</label><label>&nbsp;' + time('fromTime', pk.fromTime) + '</label></div>' +
            '<div class="vac-row"><label>Pick up' + date('toDate', pk.toDate) + '</label><label>&nbsp;' + time('toTime', pk.toTime) + '</label></div>' +
            '<div class="vac-row"><label>Reservation<input data-f="conf" value="' + vacEsc(pk.conf || '') + '"' + on + '></label>' +
                '<label>Cost<input data-f="cost" value="' + vacEsc(pk.cost || '') + '"' + on + '></label></div>' +
            '<label>Where we parked<input data-f="spot" value="' + vacEsc(pk.spot || '') + '" placeholder="Level, row, spot"' + on + '></label>' +
            '<div class="vac-row"><span class="vac-park-links">' + (url ? '<a class="vac-btn" href="' + vacEsc(url) + '" target="_blank" rel="noopener noreferrer">📍 Open in Maps</a>' : '') + '</span>' +
                '<button class="vac-btn vac-danger" onclick="vacParkRemove(this)">Remove</button></div>' +
            '</div>';
    }).join('');
    const nRent = (plan.rentals || []).length, nFlights = vacAllFlights(plan).length, nPark = (plan.parking || []).length;
    const sections = [
        { id: 'out', label: '🛫 Getting there', done: vacJourneyOnSchedule(plan, 'out') },
        { id: 'back', label: '🛬 Getting back', done: vacJourneyOnSchedule(plan, 'back') },
        { id: 'flights', label: '✈️ Flights', count: nFlights },
        { id: 'parking', label: '🅿️ Parking', count: nPark },
        { id: 'rental', label: '🚙 Car rental', count: nRent }
    ];
    const cur = sections.some(x => x.id === ui.travelTab) ? ui.travelTab : 'out';
    const pills = vacSubtabsHtml(sections, cur, 'vacTravelTab', 'On the schedule');
    const noDates = '<div class="vac-hint">Pick the dates of the trip, above, first.</div>';
    let body;
    if (cur === 'out' || cur === 'back') body = dates0.length ? vacJourneyHtml(plan, cur) +
        (nFlights ? '' : '<div class="vac-row"><span class="vac-hint">No flight: this journey is a drive.</span>' +
            '<button class="vac-btn" data-sub="flights" onclick="vacTravelTab(this)">✈️ Add a flight</button></div>') : noDates;
    else if (cur === 'flights') body = (flights || '<div class="vac-hint">No flights yet.</div>') +
        (dates0.length ? '<button class="vac-btn vac-flight-add" onclick="vacFlightAdd(this)">+ Add flight</button>' : noDates);
    else if (cur === 'parking') body = (park || '<div class="vac-hint">No parking. Booked, getting there and back drop the car off and pick it up.</div>') +
        '<button class="vac-btn vac-park-add" onclick="vacParkAdd(this)">+ Add parking</button>';
    else body = ((plan.rentals || []).map((r, i) => vacRentalCardHtml(plan, r, i, ui.toolId)).join('') ||
            '<div class="vac-hint">No car rental. Booked, getting there and back can use it: set their transfer to Rental car.</div>') +
        '<button class="vac-btn vac-park-add vac-rental-add" onclick="vacRentalAdd(this)">+ Add car rental</button>';
    return pills + '<div class="vac-subpane" data-sub="' + cur + '">' + body + '</div>';
}

/** The lists to choose from: the day being looked at has one of its own. */
function vacListChoices(plan, ui) {
    return plan.lists.concat(vacDates(plan).map(d => ({ id: 'day:' + d, icon: '\uD83D\uDCC5 ', name: vacDayName(plan, d, 'short'),
        items: plan.days[d].list, day: true })));
}

function vacLinkify(text) {
    return typeof checklistLinkify === 'function' ? checklistLinkify(text) : vacEsc(text);
}

function vacListsHtml(plan, ui) {
    const lists = vacListChoices(plan, ui);
    const cur = lists.find(l => l.id === ui.list) || lists[0];
    const chips = lists.map(l => {
        const done = l.items.filter(x => x.done).length;
        return '<button class="vac-chip' + (l === cur ? ' vac-on' : '') + '" data-list="' + vacEsc(l.id) + '" onclick="vacPickList(this)">' +
            (l.icon || '') + vacEsc(l.name) + (l.items.length ? ' <span class="vac-count">' + done + '/' + l.items.length + '</span>' : '') + '</button>';
    }).join('') + '<button class="vac-chip" onclick="vacAddList(this)" title="Add a list">+</button>';
    if (!cur) return '<div class="vac-chips">' + chips + '</div>';
    return '<div class="vac-chips">' + chips + '</div>' +
        '<div class="vac-list" data-list="' + vacEsc(cur.id) + '">' +
        (cur.items.map((it, i) => '<div class="vac-item' + (it.done ? ' vac-idone' : '') + '" data-i="' + i + '">' +
            '<input type="checkbox"' + (it.done ? ' checked' : '') + ' onchange="vacItemToggle(this)">' +
            '<span class="vac-itext" onclick="vacItemEdit(this)" title="Click to change">' + vacLinkify(it.text) + '</span>' +
            '<button class="vac-icon" onclick="vacItemRemove(this)" title="Remove">×</button></div>').join('')) +
        '<input class="vac-item-new" placeholder="Add an item, then Enter" onkeydown="vacItemKey(this, event)">' +
        (cur.day ? '' : '<div class="vac-row vac-list-actions"><button class="vac-btn" onclick="vacRenameList(this)">Rename</button>' +
            '<button class="vac-btn vac-danger" onclick="vacDeleteList(this)">Delete list</button></div>') +
        '</div>';
}

function vacSideHtml(plan, dates, ui) {
    return '<div class="vac-sbody">' + vacBlockFormHtml(plan, dates, ui) + '</div>';
}

/** The saved places' names, offered wherever a place is typed: a block's, a drive's, a parking lot's. */
function vacPlacesDatalist(plan, ui) {
    const names = vacStayPlaces(plan).concat(plan.places).filter(p => p && p.label);
    return '<datalist class="vac-places-list" id="vac-places-' + vacEsc(ui.toolId) + '">' + names.map(p => '<option value="' + vacEsc(p.label) + '">').join('') + '</datalist>';
}

function vacHeadHtml(plan, ui) {
    return '<div class="vac-head">' +
        '<input class="vac-name" placeholder="Name the trip" value="' + vacEsc(plan.name) + '" onchange="vacSetName(this)">' +
        '<input class="vac-dest" placeholder="\uD83D\uDCCD Destination: city, region" value="' + vacEsc(plan.destination || '') + '" onchange="vacSetDest(this)" ' +
            'title="Where the trip is: added to places that have only a name, so Maps looks for them there and not near you">' +
        '<span class="vac-dates">📅 <input type="date" class="vac-start" value="' + vacEsc(plan.start) + '" onchange="vacSetDates(this)" title="First day">' +
            ' – <input type="date" class="vac-end" value="' + vacEsc(plan.end || plan.start) + '" min="' + vacEsc(plan.start) + '" onchange="vacSetDates(this)" title="Last day"></span>' +
        '<span class="vac-warn-slot">' + vacWarnBtnHtml(plan, ui) + '</span>' +
        '<button class="vac-btn' + (ui.out ? ' vac-on' : '') + '" onclick="vacOutToggle(this)" title="The plan as a bullet list, to copy">\uD83D\uDCCB Bullet list</button>' +
        '<button class="vac-btn vac-cal-btn' + (ui.cal ? ' vac-on' : '') + '" onclick="vacCalToggle(this)" title="The plan as a calendar file, to import">\uD83D\uDCC5 Calendar</button>' +
        '</div>';
}

/** The key a travel time is kept under: the two places, either way round. */
function vacGapKey(a, b) {
    const k = (p) => p.address ? vacPlaceText(p) : p.lat != null && p.lng != null ? p.lat + ',' + p.lng : vacPlaceText(p);
    return [k(a), k(b)].sort().join(' ↔ ');
}

/**
 * Each place-to-place move on a day that nothing on the schedule already covers:
 * between a block and the next one with a place, when the places differ and no drive,
 * other travel or flight lies between them. With how long it takes, if set
 * (`plan.travelTimes`, kept by the pair of places so it fills in on any day), the
 * time there is, and by how much it falls short.
 */
function vacGaps(plan, date) {
    const day = plan.days[date];
    if (!day) return [];
    const moving = (b) => b.kind === 'drive' || b.kind === 'travel' || b.kind === 'flight';
    const endOf = (b) => b.kind === 'drive' ? (b.drive || {}).to : b.kind === 'flight' ? null : b.place;
    const bs = day.blocks.slice().sort((x, y) => x.start - y.start || x.end - y.end);
    const out = [];
    let prev = null;
    bs.forEach(b => {
        if (moving(b)) { if (b.kind !== 'travel' || !b.place) prev = b.kind === 'drive' && endOf(b) ? b : null; else prev = b; return; }
        if (!b.place) return;
        if (prev && endOf(prev) && b.start >= prev.end) {
            const from = endOf(prev), to = b.place;
            if (!vacSamePlace(from, to) && vacRouteStop(from) !== vacRouteStop(to)) {
                const key = vacGapKey(from, to), t = (plan.travelTimes || {})[key] || null, gap = b.start - prev.end;
                const nm = (p) => vacIsHome(plan, p) ? 'Home' : vacPlaceName(p);
                const g = { a: prev, b, from, to, key, gap, fromName: nm(from), toName: nm(to), km: vacKm(from, to), estimate: false };
                if (t) Object.assign(g, { min: t.min, mode: t.mode, short: Math.max(0, t.min - gap) });
                else if (g.km != null) {
                    // Not set, but both have a pin: an estimate, which warns only when it is well over.
                    const mode = g.km <= 1.5 ? 'walk' : 'drive', min = vacEstimate(g.km, mode), over = min - gap;
                    Object.assign(g, { min, mode, estimate: true, short: over >= Math.max(10, min * 0.3) ? over : 0 });
                } else Object.assign(g, { min: null, mode: null, short: 0 });
                out.push(g);
            }
        }
        prev = b;
    });
    return out;
}

/** The straight line between two places with a pin, in km; null without both pins. */
function vacKm(a, b) {
    if (!a || !b || a.lat == null || b.lat == null || a.lng == null || b.lng == null) return null;
    const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** About how long, in minutes to the nearest 5 (5 at least): rough, from the straight line, never a route. */
function vacEstimate(km, modeId) {
    const m = vacGapMode(modeId), way = km * m.detour;
    const kmh = (m.id === 'drive' || m.id === 'taxi') && way > 30 ? 70 : m.kmh;
    return Math.max(5, Math.round((way / kmh * 60 + m.extra) / 5) * 5);
}

/** The travel time from one place to another: as set for the pair, else estimated from their pins (in `modeId`), else null. */
function vacTravelTime(plan, from, to, modeId) {
    if (!from || !to || vacSamePlace(from, to)) return null;
    const key = vacGapKey(from, to), set = key.split(' ↔ ').every(Boolean) ? (plan.travelTimes || {})[key] : null;
    if (set) return { key, min: set.min, mode: set.mode, estimate: false };
    const km = vacKm(from, to);
    return km != null ? { key, min: vacEstimate(km, modeId || 'drive'), mode: modeId || 'drive', estimate: true } : null;
}

/** For a drive or other travel block: where it comes from and goes to, and how long that takes. */
function vacBlockTravel(plan, date, b) {
    if (b.kind !== 'drive' && b.kind !== 'travel') return null;
    const dr = b.drive || {}, to = b.kind === 'drive' ? dr.to : b.place;
    const from = (b.kind === 'drive' && vacRouteStop(dr.from) ? dr.from : null) || vacDriveOrigin(plan, date, b);
    if (!to || !from) return null;
    const t = vacTravelTime(plan, from, to, b.kind === 'drive' ? 'drive' : 'transit');
    return { from, to, key: vacGapKey(from, to), t, fromName: vacIsHome(plan, from) ? 'Home' : vacPlaceName(from), toName: vacIsHome(plan, to) ? 'Home' : vacPlaceName(to) };
}

/** The block's travel time in its panel: Fit to it; and, after a resize by hand, keep the new length as the pair's. */
function vacBlockTravelHtml(plan, date, b, ui) {
    const x = vacBlockTravel(plan, date, b);
    if (!x) return '';
    const len = b.end - b.start, t = x.t, m = t && vacGapMode(t.mode);
    let html = '';
    if (t) html += '<div class="vac-btime">Travel time ' + vacEsc(x.fromName) + ' → ' + vacEsc(x.toName) + ': <b>' + (t.estimate ? '≈ ' : '') + vacDur(t.min) + '</b> ' +
        m.icon + (t.estimate ? ' <span class="vac-hint">(estimated from their pins)</span>' : '') +
        (t.min !== len ? ' <button class="vac-btn vac-fit" data-min="' + t.min + '" onclick="vacDriveFit(this)" title="Make the block ' + vacDur(t.min) + ' long">Fit to it</button>'
            : ' <span class="vac-jstate" title="The block is as long as the travel time">✓</span>') + '</div>';
    const offer = ui && ui.offer && ui.offer.id === b.id ? ui.offer : null;
    if (offer && (!t || t.estimate || t.min !== offer.min) && x.key.split(' ↔ ').every(Boolean))
        html += '<div class="vac-btime vac-offer">Keep <b>' + vacDur(offer.min) + '</b> as the travel time from ' + vacEsc(x.fromName) + ' to ' + vacEsc(x.toName) + ', on any day? ' +
            '<button class="vac-btn vac-keep" onclick="vacTravelKeep(this)">Keep</button><button class="vac-icon vac-offer-no" onclick="vacTravelKeep(this)" title="No">×</button></div>';
    return html;
}

/** Fit to it: the block as long as the travel time; one set for the pair, it follows from then on. */
function vacDriveFit(btn) {
    const id = btn.closest('.vac-form').dataset.id;
    vacMutate(btn, (plan, ui) => {
        const f = vacFind(plan, id), x = f && vacBlockTravel(plan, f.date, f.block);
        if (!x || !x.t) return 'none';
        f.block.end = Math.min(1440, f.block.start + x.t.min);
        if (x.t.estimate) delete f.block.fit; else f.block.fit = x.key;
        ui.offer = null;
    });
}

/** Keep: the new length is the pair's travel time, and the block follows it. × leaves it. */
function vacTravelKeep(btn) {
    const id = btn.closest('.vac-form').dataset.id, keep = btn.classList.contains('vac-keep');
    vacMutate(btn, (plan, ui) => {
        const offer = ui.offer;
        ui.offer = null;
        if (!keep || !offer) return false;
        const f = vacFind(plan, id), x = f && vacBlockTravel(plan, f.date, f.block);
        if (!x) return false;
        plan.travelTimes = plan.travelTimes || {};
        plan.travelTimes[x.key] = { min: offer.min, mode: x.t && !x.t.estimate ? x.t.mode : f.block.kind === 'drive' ? 'drive' : 'transit' };
        f.block.fit = x.key;
        vacFollowTravel(plan, x.key);
    });
}

/** A block's length changed by hand: it no longer follows the travel time, and keeping its length is offered. */
function vacLengthByHand(plan, ui, date, b) {
    const x = vacBlockTravel(plan, date, b);
    if (!x) return;
    delete b.fit;
    ui.offer = { id: b.id, min: b.end - b.start };
}

/** Blocks fitted to a pair's travel time follow it when it changes. */
function vacFollowTravel(plan, key) {
    const t = (plan.travelTimes || {})[key];
    if (!t) return;
    Object.values(plan.days).forEach(day => day.blocks.forEach(b => { if (b.fit === key) b.end = Math.min(1440, b.start + t.min); }));
    ['out', 'back'].forEach(which => { if (vacJourneyOnSchedule(plan, which)) vacJourneyApplyTo(plan, which); });
}

/**
 * A chip on each drive or travel block whose two ends are known: how long getting from
 * one to the other takes (set, or estimated), and by how much the block is too short.
 */
function vacDriveChips(plan, date) {
    const day = plan.days[date];
    if (!day) return [];
    return day.blocks.filter(b => (b.kind === 'drive' || b.kind === 'travel') && !/:(airport|arrive|pickup|return)$/.test(b.leg || '') && !b.rental).map(b => {
        const x = vacBlockTravel(plan, date, b), dr = b.drive || {}, to = b.kind === 'drive' ? dr.to : b.place;
        if (!x || !vacRouteStop(x.to) || !vacRouteStop(x.from)) {
            // Not timed: the chip says what is missing, and where to set it.
            const toParking = /:(drive|shuttle)$/.test(b.leg || '') && (plan.parking || []).length && !(plan.parking || []).some(pk => pk.lot);
            const why = toParking ? 'The parking has no lot yet: set it in Travel › Parking, and how long the drive takes shows here.'
                : !to ? 'It has no place to go to: say where it goes, and how long it takes shows here.'
                : !vacRouteStop(to) ? vacPlaceName(to) + ' is only a short Maps link: give it an address.'
                : 'Where it starts from is not known: say where it starts.';
            return { onBlock: true, missing: true, id: 'blk:' + b.id, block: b, why, view: toParking ? 'travel:parking' : '' };
        }
        const t = x.t, len = b.end - b.start, over = t ? t.min - len : 0;
        const short = !t ? 0 : t.estimate ? (over >= Math.max(10, t.min * 0.3) ? over : 0) : Math.max(0, over);
        return { onBlock: true, id: 'blk:' + b.id, block: b, from: x.from, to: x.to, key: x.key, fromName: x.fromName, toName: x.toName,
            min: t ? t.min : null, mode: t ? t.mode : (b.kind === 'drive' ? 'drive' : 'transit'), estimate: !!(t && t.estimate), km: vacKm(x.from, x.to), short, len };
    });
}

/** A block that is a way from one place to another: it is the travel itself. */
function vacMoving(b) { return b.kind === 'drive' || b.kind === 'travel' || b.kind === 'flight'; }

/** The block a linked block follows, on the same day; null when it has none there. */
function vacLinkPrev(day, b) {
    return b.link ? day.blocks.find(x => x.id === b.link && x !== b) || null : null;
}

/** The blocks that follow this one, on the same day. */
function vacLinkNext(day, b) { return day.blocks.filter(x => x.link === b.id && x !== b); }

/**
 * How long after the block before it a linked block starts: the travel time set for
 * their two places, when neither is itself travel; else the time kept with the link.
 */
function vacLinkGap(plan, P, N) {
    const from = P.kind === 'drive' ? (P.drive || {}).to : P.kind === 'flight' ? null : P.place;
    if (!vacMoving(N) && from && N.place && !vacSamePlace(from, N.place) && vacRouteStop(from) !== vacRouteStop(N.place)) {
        const t = (plan.travelTimes || {})[vacGapKey(from, N.place)];
        if (t) return t.min;
    }
    return N.linkGap > 0 ? N.linkGap : 0;
}

/** Moves a block by `delta` minutes; one the planner made, and not changed since, stays the planner's. */
function vacShiftBlock(b, date, delta, keepLeg) {
    const mine = keepLeg && b.leg && !vacLegEdited(b, date);
    b.start += delta; b.end += delta;
    if (b.kind === 'flight') { const fl = b.flight || (b.flight = {}); if (!(fl.arriveDay > 0) && fl.arrive != null) fl.arrive = b.end; }
    if (mine) b.legAt = { date, start: b.start, end: b.end };
}

/**
 * Linked blocks put in step: each starts its gap after the block it follows ends, and
 * the ones after it with it. A flight is never moved by what is before it. A chain that
 * would run past midnight stops at the end of the day. Links to a block that is gone,
 * or on another day, are left alone (and do nothing).
 */
function vacChainSettle(plan) {
    const all = new Set();
    Object.values(plan.days).forEach(day => day.blocks.forEach(b => all.add(b.id)));
    Object.keys(plan.days).forEach(date => {
        const day = plan.days[date], seen = new Set();
        day.blocks.forEach(b => { if (b.link && !all.has(b.link)) { delete b.link; delete b.linkGap; } });
        const visit = (P) => {
            if (seen.has(P.id)) return;
            seen.add(P.id);
            vacLinkNext(day, P).forEach(N => {
                if (N.kind !== 'flight') {
                    const len = N.end - N.start, s = Math.max(0, Math.min(P.end + vacLinkGap(plan, P, N), 1440 - len));
                    if (s !== N.start) vacShiftBlock(N, date, s - N.start, true);
                }
                visit(N);
            });
        };
        day.blocks.filter(b => !vacLinkPrev(day, b) || b.kind === 'flight').forEach(visit);
    });
}

/**
 * The blocks that move with one: those linked to it, and to them, on its day. Moving a
 * step of a journey does not move the flight, nor what is on its other side; moving the
 * flight moves it all.
 */
function vacChainOf(plan, date, b) {
    const day = plan.days[date], out = [b], seen = new Set([b.id]);
    if (!day) return out;
    for (let i = 0; i < out.length; i++) {
        const x = out[i];
        if (x.kind === 'flight' && x !== b) continue;
        const near = vacLinkNext(day, x).concat([vacLinkPrev(day, x)].filter(Boolean));
        near.forEach(y => { if (!seen.has(y.id)) { seen.add(y.id); out.push(y); } });
    }
    return out.filter(x => x.kind !== 'flight' || x === b);
}

/** How far a chain can move in a day: from its earliest start to midnight past its latest end. */
function vacChainRoom(chain) {
    return { lo: -Math.min.apply(null, chain.map(x => x.start)), hi: 1440 - Math.max.apply(null, chain.map(x => x.end)) };
}

/**
 * Moves the chain of `b` by `delta`, on its day or to another (`to`). Where it leaves a
 * link behind (the flight, when a step moved), the time kept with that link is the new gap.
 */
function vacChainMove(plan, date, b, delta, to) {
    const chain = vacChainOf(plan, date, b), day = plan.days[date], room = vacChainRoom(chain);
    delta = Math.max(room.lo, Math.min(room.hi, delta));
    const flightMoved = b.kind === 'flight';
    chain.forEach(x => vacShiftBlock(x, date, delta, flightMoved));
    const inChain = new Set(chain.map(x => x.id));
    day.blocks.forEach(x => {
        const P = vacLinkPrev(day, x);
        if (P && inChain.has(x.id) !== inChain.has(P.id)) x.linkGap = Math.max(0, x.start - P.end);
    });
    if (to && to !== date && plan.days[to]) {
        day.blocks = day.blocks.filter(x => !inChain.has(x.id));
        chain.forEach(x => { if (x.legAt && flightMoved) x.legAt.date = to; plan.days[to].blocks.push(x); });
    }
    if (flightMoved) ['out', 'back'].forEach(which => {
        const F = vacJourneyFlight(plan, which, vacJourneyOpts(plan, which));
        if (F && F.b === b && vacJourneyOnSchedule(plan, which)) vacJourneyApplyTo(plan, which);
    });
    return chain;
}

/** A block's place in its chain, in its panel: what it follows, what follows it, and the links on offer. */
function vacBlockLinkHtml(plan, date, b) {
    const day = plan.days[date];
    if (!day) return '';
    const name = (x) => vacEsc(vacBlockInfo(plan, x).title);
    const P = vacLinkPrev(day, b), next = vacLinkNext(day, b);
    const others = day.blocks.filter(x => x !== b);
    const before = others.filter(x => x.end <= b.start).sort((x, y) => y.end - x.end || y.start - x.start)[0];
    const after = others.filter(x => x.start >= b.end).sort((x, y) => x.start - y.start || x.end - y.end)[0];
    let html = '';
    if (P) {
        const gap = vacLinkGap(plan, P, b);
        html += '<div class="vac-blink">🔗 Right after <b>' + name(P) + '</b>' + (gap ? ', ' + vacDur(gap) + ' later' : '') +
            ' <button class="vac-btn vac-unlink" data-op="unlink" data-id="' + vacEsc(b.id) + '" onclick="vacLinkSet(this)" title="It no longer moves with it">Unlink</button></div>';
    }
    next.forEach(N => {
        html += '<div class="vac-blink">🔗 <b>' + name(N) + '</b> right after it' +
            ' <button class="vac-btn vac-unlink" data-op="unlink" data-id="' + vacEsc(N.id) + '" onclick="vacLinkSet(this)" title="It no longer moves with this one">Unlink</button></div>';
    });
    const offers = [];
    if ((b.kind === 'drive' || b.kind === 'travel') && ((before && !P) || (after && !next.length)))
        offers.push('<button class="vac-btn vac-link-around" data-op="around" onclick="vacLinkSet(this)" title="It starts when ' +
            (before ? vacEsc(vacBlockInfo(plan, before).title) : 'the one before') + ' ends, and what is after starts when it ends; they move together">🔗 Link to the blocks around it</button>');
    else {
        if (before && !P) offers.push('<button class="vac-btn vac-link-before" data-op="before" onclick="vacLinkSet(this)" title="It keeps its time after ' +
            name(before) + ', and they move together">🔗 Link to ' + name(before) + '</button>');
        if (after && !next.length && after.kind !== 'flight' && after.link !== b.id) offers.push('<button class="vac-btn vac-link-after" data-op="after" onclick="vacLinkSet(this)" title="' +
            name(after) + ' keeps its time after it, and they move together">🔗 Link ' + name(after) + ' to it</button>');
    }
    if (offers.length) html += '<div class="vac-row vac-blink-offers">' + offers.join('') + '</div>';
    if (P || next.length) html += '<div class="vac-hint">Linked blocks move together, and follow when one before them gets longer or shorter.</div>';
    return html;
}

/** Link or unlink: to the block before, the one after, both (for a drive), or a link undone. */
function vacLinkSet(btn) {
    const form = btn.closest('.vac-form'), op = btn.dataset.op;
    vacMutate(btn, (plan) => {
        const f = vacFind(plan, form.dataset.id);
        if (!f) return 'none';
        const b = f.block, others = f.day.blocks.filter(x => x !== b);
        const before = others.filter(x => x.end <= b.start).sort((x, y) => y.end - x.end || y.start - x.start)[0];
        const after = others.filter(x => x.start >= b.end).sort((x, y) => x.start - y.start || x.end - y.end)[0];
        const link = (N, P, gap) => { N.link = P.id; N.linkGap = gap; delete N.nolink; };
        if (op === 'unlink') {
            const g = vacFind(plan, btn.dataset.id);
            if (!g) return 'none';
            delete g.block.link; delete g.block.linkGap;
            if (g.block.leg || g.block.kind === 'flight') g.block.nolink = true;
        } else if (op === 'around') {
            if (before && !vacLinkPrev(f.day, b)) link(b, before, 0);
            if (after && !vacLinkNext(f.day, b).length && after.kind !== 'flight') link(after, b, 0);
        } else if (op === 'before' && before) link(b, before, Math.max(0, b.start - before.end));
        else if (op === 'after' && after) link(after, b, Math.max(0, after.start - b.end));
        else return 'none';
    });
}

function vacGapMode(id) { return VAC_GAP_MODES.find(m => m.id === id) || VAC_GAP_MODES[0]; }

/** The chips in the day's gaps, and the one being set. */
function vacGapsHtml(plan, date, ui, h0, px, opts) {
    const o = opts || {};
    return vacGaps(plan, date).concat(vacDriveChips(plan, date)).map(g => {
        // In a gap, in its middle; on a drive or travel block, at its middle, on its right edge.
        const id = g.onBlock ? g.id : g.a.id + '|' + g.b.id;
        const y = (g.onBlock ? (g.block.start + g.block.end) / 2 - h0 * 60 : (g.a.end - h0 * 60) + g.gap / 2) * px / 60;
        if (o.max != null && (y < 0 || y > o.max)) return '';
        if (g.missing) {
            const chip0 = '<button class="vac-gap vac-gap-on vac-gap-missing' + (o.compact ? ' vac-gap-compact' : '') + '" data-g="' + vacEsc(id) + '" style="top:' + y + 'px" ' +
                'onpointerdown="event.stopPropagation()" onclick="vacGapOpen(this)" title="' + vacEsc(g.why) + '">\u23F1' + (o.compact ? '' : ' ?') + '</button>';
            if (ui.gap !== id) return chip0;
            return chip0 + '<div class="vac-gap-pop' + (o.left ? ' vac-gap-pop-l' : '') + '" data-g="' + vacEsc(id) + '" style="top:' + (y + 14) + 'px" onpointerdown="event.stopPropagation()">' +
                '<div class="vac-gap-route">' + vacEsc(vacBlockInfo(plan, g.block).title) + '</div><div class="vac-hint">' + vacEsc(g.why) + '</div>' +
                '<div class="vac-row">' + (g.view ? '<button class="vac-btn vac-gap-goto" data-view="' + g.view + '" data-id="" onclick="vacGoTo(this)">Set the parking</button>' : '') +
                '<button class="vac-icon vac-gap-close" data-g="' + vacEsc(id) + '" onclick="vacGapOpen(this)" title="Close">\u00D7</button></div></div>';
        }
        const m = vacGapMode(g.mode), day = plan.days[date];
        const linked = g.onBlock ? !!(vacLinkPrev(day, g.block) || vacLinkNext(day, g.block).length) : g.b.link === g.a.id;
        const tip = (linked ? 'Linked: they move together. ' : '') + 'From ' + g.fromName + ' to ' + g.toName + (g.min == null ? ': how long does it take? Click to set'
            : g.estimate ? ': about ' + vacDur(g.min) + ' by ' + m.label.toLowerCase() + ', estimated from ' + g.km.toFixed(1) + ' km in a straight line. Click to set it'
            : ': ' + vacDur(g.min) + ' by ' + m.label.toLowerCase());
        const chip = '<button class="vac-gap' + (linked ? ' vac-gap-linked' : '') + (g.onBlock ? ' vac-gap-on' : '') + (o.compact ? ' vac-gap-compact' : '') + (g.min != null && !g.estimate ? ' vac-gap-set' : '') + (g.estimate ? ' vac-gap-est' : '') + (g.short ? ' vac-gap-short' : '') + '" data-g="' + vacEsc(id) + '" style="top:' + y + 'px" ' +
            'onpointerdown="event.stopPropagation()" onclick="vacGapOpen(this)" title="' + vacEsc(tip) + '">' +
            (linked && !o.compact ? '\uD83D\uDD17 ' : '') + (o.compact ? (g.min != null ? (g.estimate ? '\u2248' : '') + m.icon + vacDur(g.min).replace(' min', 'm').replace(' h', 'h') : '\u23F1')
                : g.min != null ? (g.estimate ? '\u2248 ' : '') + m.icon + ' ' + vacDur(g.min) + (g.short ? ' \u00B7 ' + vacDur(g.short) + ' short' : '') : '\u23F1 travel?') + '</button>';
        const popY = y + 14;
        if (ui.gap !== id) return chip;
        const dir = vacDirUrl(vacRouteStop(g.from), [], vacRouteStop(g.to)) + '&travelmode=' + m.maps;
        return chip + '<div class="vac-gap-pop' + (o.left ? ' vac-gap-pop-l' : '') + '" data-g="' + vacEsc(id) + '" data-key="' + vacEsc(g.key) + '" style="top:' + popY + 'px" onpointerdown="event.stopPropagation()">' +
            '<div class="vac-gap-route">' + vacEsc(g.fromName) + ' → ' + vacEsc(g.toName) + '</div>' +
            '<div class="vac-row"><select class="vac-gap-mode" onchange="vacGapSet(this)">' + VAC_GAP_MODES.map(x => '<option value="' + x.id + '"' + (x.id === (g.mode || 'walk') ? ' selected' : '') + '>' +
                x.icon + ' ' + x.label + '</option>').join('') + '</select>' +
            '<select class="vac-gap-min" onchange="vacGapSet(this)"><option value="">How long?</option>' + VAC_GAP_LENGTHS.map(n => '<option value="' + n + '"' + (n === g.min && !g.estimate ? ' selected' : '') + '>' +
                vacDur(n) + '</option>').join('') + '</select></div>' +
            (g.km != null ? '<div class="vac-gap-ests"><span class="vac-hint">About, from ' + g.km.toFixed(1) + ' km in a straight line:</span>' +
                VAC_GAP_MODES.map(x => { const n = vacEstimate(g.km, x.id);
                    return '<button class="vac-btn vac-gap-use" data-mode="' + x.id + '" data-min="' + n + '" onclick="vacGapSet(this)" title="Keep this">' + x.icon + ' ' + vacDur(n) + '</button>'; }).join('') + '</div>'
                : '<div class="vac-hint">Paste a Google Maps link with a pin for both places, and it is estimated.</div>') +
            (g.onBlock ? '' : '<label class="vac-check vac-gap-linkrow" title="When the time is set, ' + vacEsc(vacBlockInfo(plan, g.b).title) + ' starts that long after ' +
                vacEsc(vacBlockInfo(plan, g.a).title) + ' ends, and they move together"><input type="checkbox" class="vac-gap-link" data-a="' + vacEsc(g.a.id) + '" data-b="' + vacEsc(g.b.id) + '"' +
                (linked || (ui.gapUnlink !== id && !(g.min != null && !g.estimate)) ? ' checked' : '') + ' onchange="vacGapLink(this)"> \uD83D\uDD17 Keep ' + vacEsc(vacBlockInfo(plan, g.b).title) + ' right after the trip</label>') +
            '<div class="vac-row"><a class="vac-btn" href="' + vacEsc(dir) + '" target="_blank" rel="noopener noreferrer" title="' +
                vacEsc('From ' + (vacPlaceTarget(g.from).text || 'where you are') + ' to ' + (vacPlaceTarget(g.to).text || '?')) + '">\uD83D\uDDFA\uFE0F Directions</a>' +
            (g.min != null && !g.estimate ? '<button class="vac-btn vac-gap-clear" onclick="vacGapSet(this)">Clear</button>' : '') +
            '<button class="vac-icon vac-gap-close" data-g="' + vacEsc(id) + '" onclick="vacGapOpen(this)" title="Close">×</button></div>' +
            (!vacRouteStop(g.from) ? '<div class="vac-hint">' + vacEsc(g.fromName) + ' is only a short Maps link, so Maps will start from where you are: give it a name or address.</div>' : '') +
            '<div class="vac-hint">' + (g.estimate ? 'An estimate, not a route: set it to be sure. ' : '') + 'Kept for these two places, on any day.</div></div>';
    }).join('');
}

function vacGapOpen(el) { const id = el.dataset.g; vacMutate(el, (plan, ui) => { ui.gap = ui.gap === id ? null : id; return false; }, { side: false }); }

/** How long it takes, and how: kept for the pair of places. Clear forgets it. */
function vacGapSet(el) {
    const pop = el.closest('.vac-gap-pop'), key = pop.dataset.key, g = pop.dataset.g || '';
    const tick = pop.querySelector('.vac-gap-link');
    vacMutate(el, (plan, ui) => {
        plan.travelTimes = plan.travelTimes || {};
        let set = false;
        if (el.classList.contains('vac-gap-use')) { plan.travelTimes[key] = { min: +el.dataset.min, mode: el.dataset.mode }; set = true; }
        else {
            const min = pop.querySelector('.vac-gap-min').value, mode = pop.querySelector('.vac-gap-mode').value;
            if (el.classList.contains('vac-gap-clear') || !min) {
                if (el.classList.contains('vac-gap-mode') && !min) return false;
                delete plan.travelTimes[key];
            } else { plan.travelTimes[key] = { min: +min, mode }; set = true; }
        }
        // Set between two blocks, with the tick: the one after keeps right after the trip.
        if (set && tick && tick.checked) {
            const a = vacFind(plan, tick.dataset.a), b = vacFind(plan, tick.dataset.b);
            if (a && b && a.date === b.date) { b.block.link = a.block.id; b.block.linkGap = plan.travelTimes[key].min; delete b.block.nolink; }
        }
        // Set on a drive or travel block that is linked: it is as long as the trip, and what follows moves.
        if (set && /^blk:/.test(g)) {
            const f = vacFind(plan, g.slice(4));
            if (f && (vacLinkPrev(f.day, f.block) || vacLinkNext(f.day, f.block).length)) f.block.fit = key;
        }
        vacFollowTravel(plan, key);
    }, { side: false });
}

/** The tick: with a time set, links (it moves at once) or unlinks; before, it says what setting one does. */
function vacGapLink(el) {
    const pop = el.closest('.vac-gap-pop'), key = pop.dataset.key, id = pop.dataset.g;
    vacMutate(el, (plan, ui) => {
        const a = vacFind(plan, el.dataset.a), b = vacFind(plan, el.dataset.b), t = (plan.travelTimes || {})[key];
        if (!a || !b) return 'none';
        if (!el.checked) {
            if (b.block.link === a.block.id) { delete b.block.link; delete b.block.linkGap; if (b.block.leg) b.block.nolink = true; }
            else { ui.gapUnlink = id; return false; }
        } else if (t && a.date === b.date) { b.block.link = a.block.id; b.block.linkGap = t.min; delete b.block.nolink; ui.gapUnlink = null; }
        else { ui.gapUnlink = null; return false; }
    }, { side: false });
}

/**
 * What in the plan cannot all happen: worked out from what is there, never kept.
 * Each warning has a key that stays the same while its cause does (so it can be
 * ignored), the date and blocks it is about, and where to go to fix it.
 */
function vacConflicts(plan) {
    const out = [], dates = vacDates(plan), lead = plan.airportLead || 0;
    const add = (key, date, ids, icon, text, view) => out.push({ key, date, ids: ids || [], icon, text, view: view || date });
    const name = (b) => vacBlockInfo(plan, b).title;
    const on = (d) => (plan.days[d] || { blocks: [] }).blocks;
    const span = (b) => vacTimeLabel(b.start) + '\u2013' + vacTimeLabel(b.end);
    // Flights: where each leaves and lands.
    const flights = vacAllFlights(plan).map(({ date, b }) => {
        const fl = b.flight || {};
        return { date, b, land: vacAddDays(date, fl.arriveDay || 0), arrive: fl.arrive != null ? fl.arrive : b.end };
    });
    // 1. Blocks at the same time, and blocks while a flight from the day before is still in the air.
    dates.forEach(d => {
        const bs = on(d).slice().sort((a, b) => a.start - b.start || a.end - b.end);
        for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length && bs[j].start < bs[i].end; j++) {
            const a = bs[i], b = bs[j];
            if (b.start >= a.end || a.end <= a.start || b.end <= b.start) continue;
            // A meal during a flight is had on board; at the airport, there.
            const aboard = (x) => x.kind === 'flight' || /:(airport|arrive)$/.test(x.leg || '');
            if ((aboard(a) && b.kind === 'food') || (aboard(b) && a.kind === 'food')) continue;
            add('overlap:' + [a.id, b.id].sort().join('|'), d, [a.id, b.id], '\u23F1\uFE0F',
                name(a) + ' (' + span(a) + ') and ' + name(b) + ' (' + span(b) + ') are at the same time');
        }
        flights.filter(f => f.land === d && f.date !== d).forEach(f => on(d).filter(b => b.start < f.arrive).forEach(b =>
            add('inair:' + f.b.id + '|' + b.id, d, [b.id, f.b.id], '\u2708\uFE0F',
                name(b) + ' (' + span(b) + ') is before ' + name(f.b) + ' lands, at ' + vacTimeLabel(f.arrive))));
    });
    // 2. Not at the airport in time: something else still going on in the time before take-off.
    flights.forEach(f => {
        const at = f.b.start - lead;
        on(f.date).forEach(b => {
            if (b === f.b || b.kind === 'food' || b.kind === 'flight' || /:(airport|arrive)$/.test(b.leg || '') || b.end <= at || b.end > f.b.start || b.start >= f.b.start) return;
            add('late:' + f.b.id + '|' + b.id, f.date, [b.id, f.b.id], '\u23F0',
                name(b) + ' ends at ' + vacTimeLabel(b.end) + ', ' + vacLen(f.b.start - b.end) + ' before ' + name(f.b) +
                ' takes off: be at the airport ' + vacLen(lead) + ' before, by ' + vacTimeLabel(Math.max(0, at)));
        });
    });
    // 2b. Getting to the airport after bag drop closes: bags would miss the flight.
    flights.forEach(f => {
        const t = vacFlightTimes(f.date, f.b);
        if (!t.bag) return;
        on(f.date).filter(b => (b.kind === 'drive' || b.kind === 'travel') && !/:(airport|arrive)$/.test(b.leg || '') && b.end > t.bag.at && b.end <= f.b.start).forEach(b =>
            add('bagdrop:' + f.b.id + '|' + b.id, f.date, [b.id, f.b.id], '\uD83E\uDDF3', name(b) + ' gets there at ' + vacTimeLabel(b.end) + ', after bag drop for ' + name(f.b) +
                ' closes, at ' + vacTimeLabel(t.bag.at)));
    });
    // 3. The car, around the flights there and back.
    const there = vacJourneyFlight(plan, 'out', vacJourneyOpts(plan, 'out'));
    const backO = vacJourneyOpts(plan, 'back'), back = vacJourneyFlight(plan, 'back', backO);
    const fOf = (x) => x && flights.find(f => f.b === x.b);
    const fOut = fOf(there), fBack = fOf(back);
    const before = (d1, t1, d2, t2) => d1 < d2 || (d1 === d2 && t1 < t2);
    (plan.rentals || []).forEach(r => {
        const nm = r.company || vacPlaceName(r.pickPlace) || 'the rental car';
        if (fOut && r.pickDate && r.pickTime != null && before(r.pickDate, r.pickTime, fOut.land, fOut.arrive) && r.pickDate >= fOut.date)
            add('rentpick:' + r.id, r.pickDate, [fOut.b.id], '\uD83D\uDE99', 'Picking up ' + nm + ' at ' + vacTimeLabel(r.pickTime) + ', before ' +
                name(fOut.b) + ' lands at ' + vacTimeLabel(fOut.arrive), 'travel:rental');
        if (fBack && r.dropDate && r.dropTime != null && !before(r.dropDate, r.dropTime, fBack.date, fBack.b.start - lead) && r.dropDate <= fBack.date)
            add('rentdrop:' + r.id, r.dropDate, [fBack.b.id], '\uD83D\uDE99', 'Returning ' + nm + ' at ' + vacTimeLabel(r.dropTime) + ' leaves less than ' +
                vacLen(lead) + ' before ' + name(fBack.b) + ' takes off', 'travel:rental');
    });
    (plan.parking || []).forEach(pk => {
        const lot = vacPlaceName(pk.lot) || 'the parking';
        if (fOut && pk.fromDate && pk.fromTime != null && !before(pk.fromDate, pk.fromTime, fOut.date, fOut.b.start - lead) && pk.fromDate <= fOut.date)
            add('parkdrop:' + pk.id, pk.fromDate, [fOut.b.id], '\uD83C\uDD7F\uFE0F', 'Dropping the car at ' + lot + ' at ' + vacTimeLabel(pk.fromTime) +
                ' leaves less than ' + vacLen(lead) + ' before ' + name(fOut.b) + ' takes off', 'travel:parking');
        const fB = fBack || (fOut && flights.length > 1 ? flights[flights.length - 1] : null);
        if (fB && pk.toDate && pk.toTime != null && before(pk.toDate, pk.toTime, fB.land, fB.arrive) && pk.toDate >= fB.date)
            add('parkpick:' + pk.id, pk.toDate, [fB.b.id], '\uD83C\uDD7F\uFE0F', 'Picking up the car at ' + lot + ' at ' + vacTimeLabel(pk.toTime) +
                ', before ' + name(fB.b) + ' lands at ' + vacTimeLabel(fB.arrive), 'travel:parking');
    });
    // 4. Nights: somewhere to sleep, and only one place.
    const stays = (plan.stays || []).filter(s => s.inDate);
    stays.forEach(s => {
        if (s.outDate && s.outDate < s.inDate) add('stayorder:' + s.id, s.inDate, [], '\uD83C\uDFE8',
            (vacPlaceName(s.place) || 'A stay') + ' checks out (' + vacDayLabel(s.outDate, 'short') + ') before it checks in (' + vacDayLabel(s.inDate, 'short') + ')', 'stay:stays');
    });
    const cruises = (plan.cruises || []).filter(c => c.boardDate);
    if (stays.length || cruises.length) dates.slice(0, -1).forEach(d => {
        const sleep = stays.filter(s => s.inDate <= d && (s.outDate || s.inDate) > d).map(s => vacPlaceName(s.place) || 'a stay')
            .concat(cruises.filter(c => c.boardDate <= d && (c.leaveDate || c.boardDate) > d).map(c => c.ship || 'the ship'));
        if (!sleep.length) add('nostay:' + d, d, [], '\uD83D\uDECF\uFE0F', 'Nowhere to sleep the night of ' + vacDayLabel(d, 'short'), 'stay:stays');
        else if (sleep.length > 1) add('twostays:' + d, d, [], '\uD83C\uDFE8', 'Two places to sleep the night of ' + vacDayLabel(d, 'short') + ': ' + sleep.join(' and '), 'stay:stays');
    });
    // 5. Cruises: back on board in time.
    cruises.forEach(c => {
        const ship = c.ship || 'the ship';
        const late = (d, aboard, b) => add('aboard:' + c.id + '|' + d + '|' + b.id, d, [b.id], '\uD83D\uDEA2',
            name(b) + ' (' + span(b) + ') runs past all aboard for ' + ship + ', at ' + vacTimeLabel(aboard));
        if (c.allAboard != null) {
            on(c.boardDate).filter(b => ['drive', 'travel', 'flight'].includes(b.kind) && b.start < c.allAboard && b.end > c.allAboard).forEach(b => late(c.boardDate, c.allAboard, b));
            flights.filter(f => f.land === c.boardDate && f.date !== c.boardDate && f.arrive > c.allAboard).forEach(f =>
                add('aboard:' + c.id + '|' + c.boardDate + '|' + f.b.id, c.boardDate, [f.b.id], '\uD83D\uDEA2',
                    name(f.b) + ' lands at ' + vacTimeLabel(f.arrive) + ', after all aboard for ' + ship + ', at ' + vacTimeLabel(c.allAboard)));
        }
        Object.keys(c.days || {}).forEach(d => {
            const day = c.days[d], aboard = day && day.port ? vacAllAboard(day) : null;
            if (aboard == null || d === c.boardDate || d === c.leaveDate) return;
            on(d).filter(b => b.kind !== 'food' && b.kind !== 'rest' && b.start < aboard && b.end > aboard).forEach(b => late(d, aboard, b));
        });
    });
    // 6. At a stay before checking in, or after checking out.
    (plan.stays || []).filter(s => s.place).forEach(s => {
        const nm = vacPlaceName(s.place) || 'the stay';
        // Time spent there, not getting there: arriving early is only waiting.
        const at = (b) => b.place && b.kind !== 'travel' && b.kind !== 'drive' && vacSamePlace(b.place, s.place);
        if (s.inTime != null) on(s.inDate).filter(b => at(b) && b.start < s.inTime).forEach(b =>
            add('beforein:' + s.id + '|' + b.id, s.inDate, [b.id], '🏨', name(b) + ' at ' + nm + ' (' + span(b) + ') is before check-in, at ' + vacTimeLabel(s.inTime)));
        if (s.outDate && s.outTime != null) on(s.outDate).filter(b => at(b) && b.end > s.outTime).forEach(b =>
            add('afterout:' + s.id + '|' + b.id, s.outDate, [b.id], '🏨', name(b) + ' at ' + nm + ' (' + span(b) + ') is after check-out, at ' + vacTimeLabel(s.outTime)));
    });
    // 7. A drive with no car: your own is parked at the airport, or far away, and no rental covers it.
    const at = (d, t) => d + ' ' + String(t).padStart(4, '0');
    let away = (plan.parking || []).filter(pk => pk.fromDate && pk.toDate).map(pk => [at(pk.fromDate, pk.fromTime != null ? pk.fromTime : 1440), at(pk.toDate, pk.toTime != null ? pk.toTime : 0)]);
    if (!away.length && fOut && fBack) away = [[at(fOut.land, fOut.arrive), at(fBack.date, fBack.b.start)]];
    const cars = (plan.rentals || []).filter(r => r.pickDate).map(r => [at(r.pickDate, r.pickTime != null ? r.pickTime : 0), at(r.dropDate || r.pickDate, r.dropTime != null ? r.dropTime : 1440)]);
    if (away.length) dates.forEach(d => on(d).filter(b => b.kind === 'drive').forEach(b => {
        const t = at(d, b.start), inside = (iv) => t >= iv[0] && t < iv[1];
        if (away.some(inside) && !cars.some(inside))
            add('nocar:' + b.id, d, [b.id], '🚗', name(b) + ' (' + span(b) + ') needs a car: yours is ' +
                ((plan.parking || []).length ? 'parked' : 'at home') + ' and no rental covers ' + vacDayLabel(d, 'short'), (plan.rentals || []).length ? 'travel:rental' : d);
    }));
    // 8. Ashore on a day at sea.
    cruises.forEach(c => {
        const ship = c.ship || 'the ship';
        dates.filter(d => d > c.boardDate && d < (c.leaveDate || c.boardDate) && !((c.days || {})[d] || {}).port).forEach(d =>
            on(d).filter(b => b.kind !== 'food' && b.kind !== 'rest' && (b.place || b.kind === 'drive')).forEach(b =>
                add('atsea:' + c.id + '|' + b.id, d, [b.id], '🌊', name(b) + (b.place ? ' at ' + vacPlaceName(b.place) : '') + ' is on a day ' + ship + ' is at sea')));
    });
    // 9. Not enough time to get from one place to the next.
    dates.forEach(d => vacGaps(plan, d).filter(g => g.short > 0).forEach(g =>
        add('gap:' + g.a.id + '|' + g.b.id, d, [g.a.id, g.b.id], '\u23F1\uFE0F', 'Getting from ' + g.fromName + ' to ' + g.toName + ' takes ' + (g.estimate ? 'about ' : '') + vacDur(g.min) + (g.estimate ? ' (estimated)' : '') +
            ', and there ' + (g.gap > 0 ? 'are only ' + vacDur(g.gap) : 'is no time') + ' between ' + name(g.a) + ' and ' + name(g.b))));
    dates.forEach(d => on(d).forEach(N => {
        const P = plan.days[d] && vacLinkPrev(plan.days[d], N);
        if (!P || N.kind === 'flight') return;
        const want = P.end + vacLinkGap(plan, P, N);
        if (want + (N.end - N.start) > 1440 && N.start < want)
            add('chainend:' + N.id, d, [N.id, P.id], '\uD83D\uDD17', name(N) + ' is linked to start ' + (want > P.end ? vacDur(want - P.end) + ' after ' : 'right after ') + name(P) +
                ', but that runs past midnight: it stops at the end of the day');
    }));
    dates.forEach(d => vacDriveChips(plan, d).filter(g => !g.missing && g.short > 0).forEach(g =>
        add('drivegap:' + g.block.id, d, [g.block.id], '\u23F1\uFE0F', name(g.block) + ' is ' + vacDur(g.len) + ' long, but getting from ' + g.fromName + ' to ' + g.toName +
            ' takes ' + (g.estimate ? 'about ' : '') + vacDur(g.min) + (g.estimate ? ' (estimated)' : ''))));
    return out.sort((a, b) => (a.date || '').localeCompare(b.date || '') || a.text.localeCompare(b.text));
}

/** The warnings not ignored, and for each block the reasons it is in one. */
function vacWarnings(plan) {
    const ignored = new Set(plan.ignoredWarnings || []), all = vacConflicts(plan);
    const active = all.filter(w => !ignored.has(w.key)), byBlock = new Map();
    active.forEach(w => w.ids.forEach(id => byBlock.set(id, (byBlock.get(id) ? byBlock.get(id) + '\n' : '') + '\u26A0\uFE0F ' + w.text)));
    return { all, active, ignored: all.filter(w => ignored.has(w.key)), byBlock };
}

/** The header's ⚠️: how many, there only when there is something to say. */
function vacWarnBtnHtml(plan, ui) {
    const w = vacWarnings(plan);
    if (!w.active.length && !w.ignored.length && !ui.warn) return '';
    return '<button class="vac-btn vac-warn-btn' + (w.active.length ? ' vac-warn-on' : '') + (ui.warn ? ' vac-on' : '') + '" onclick="vacWarnToggle(this)" title="' +
        (w.active.length ? w.active.length + ' thing' + (w.active.length === 1 ? '' : 's') + ' in the plan cannot all happen' : 'Nothing clashes') +
        (w.ignored.length ? ' (' + w.ignored.length + ' ignored)' : '') + '">\u26A0\uFE0F ' + w.active.length + '</button>';
}

function vacWarnRowsHtml(plan, ui) {
    const w = vacWarnings(plan), show = ui.warn && ui.warn.ignored;
    const row = (x, off) => '<div class="vac-warn-row' + (off ? ' vac-warn-off' : '') + '" data-key="' + vacEsc(x.key) + '">' +
        '<span class="vac-warn-icon">' + x.icon + '</span>' +
        '<span class="vac-warn-when">' + (x.date ? vacEsc(vacDayLabel(x.date, 'short')) : '') + '</span>' +
        '<span class="vac-warn-text">' + vacEsc(x.text) + '</span>' +
        '<button class="vac-btn vac-warn-go" data-view="' + vacEsc(x.view) + '" data-id="' + vacEsc(x.ids[0] || '') + '" onclick="vacWarnGo(this)">Go to</button>' +
        '<button class="vac-btn vac-warn-ignore" onclick="vacWarnIgnore(this)" title="' + (off ? 'Warn about it again' : 'It is meant: stop warning about it') + '">' +
            (off ? 'Warn again' : 'Ignore') + '</button></div>';
    return (w.active.length ? w.active.map(x => row(x, false)).join('') : '<div class="vac-hint">Nothing clashes.' +
            (w.ignored.length && !show ? ' ' + w.ignored.length + ' ignored.' : '') + '</div>') +
        (show ? w.ignored.map(x => row(x, true)).join('') : '');
}

function vacWarnHtml(plan, ui) {
    return '<div class="vac-out vac-warn" role="dialog" aria-label="What clashes">' +
        '<div class="vac-row vac-out-bar"><b>\u26A0\uFE0F What clashes</b>' +
            '<label class="vac-check"><input type="checkbox" class="vac-warn-show"' + (ui.warn.ignored ? ' checked' : '') + ' onchange="vacWarnShowIgnored(this)"> Show ignored</label>' +
            '<span class="vac-out-gap"></span>' +
            '<button class="vac-icon vac-out-close vac-warn-close" onclick="vacWarnToggle(this)" title="Close">\u00D7</button>' +
        '</div><div class="vac-warn-list">' + vacWarnRowsHtml(plan, ui) + '</div></div>';
}

/** One panel over the schedule at a time: the bullet list, the calendar or the warnings. */
function vacWarnToggle(el) {
    vacMutate(el, (plan, ui) => { ui.warn = ui.warn ? null : { ignored: false }; if (ui.warn) { ui.out = null; ui.cal = null; } return false; });
}

function vacWarnShowIgnored(el) { vacMutate(el, (plan, ui) => { ui.warn = { ignored: el.checked }; return false; }); }

/** Ignoring a warning is kept with the plan, so it can be undone. */
function vacWarnIgnore(btn) {
    const key = btn.closest('.vac-warn-row').dataset.key;
    vacMutate(btn, (plan) => {
        const set = new Set(plan.ignoredWarnings || []);
        if (set.has(key)) set.delete(key); else set.add(key);
        plan.ignoredWarnings = Array.from(set);
    });
}

/** To where it can be fixed: the day with its block chosen, or the tab it is set in. */
function vacGoTo(btn) { vacWarnGo(btn); }

function vacWarnGo(btn) {
    vacMutate(btn, (plan, ui) => {
        const [view, sub] = btn.dataset.view.split(':');
        ui.warn = null;
        ui.view = view;
        if (view === 'travel' && sub) ui.travelTab = sub;
        if (view === 'stay' && sub) ui.stayTab = sub;
        const f = btn.dataset.id && vacFind(plan, btn.dataset.id);
        ui.sel = f && f.date === view ? btn.dataset.id : null;
        return false;
    });
}

/** Text in an iCalendar value: backslashes, commas, semicolons and line breaks escaped. */
function vacIcsText(s) { return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); }

/** A line folded at 75 bytes, as iCalendar asks, never inside a character. */
function vacIcsFold(line) {
    const enc = new TextEncoder(), parts = [];
    let cur = '', n = 0, limit = 75;
    for (const ch of line) {
        const len = enc.encode(ch).length;
        if (n + len > limit) { parts.push(cur); cur = ''; n = 0; limit = 74; }
        cur += ch; n += len;
    }
    parts.push(cur);
    return parts.join('\r\n ');
}

/** A date and minutes as a floating local time: the same clock time wherever the calendar is. */
function vacIcsTime(date, min) {
    const d = vacAddDays(date, Math.floor(min / 1440)), m = ((min % 1440) + 1440) % 1440;
    return d.replace(/-/g, '') + 'T' + String(Math.floor(m / 60)).padStart(2, '0') + String(m % 60).padStart(2, '0') + '00';
}

function vacIcsDate(date) { return date.replace(/-/g, ''); }

/**
 * The plan as an iCalendar file: each block an event (a flight ending the day it
 * lands), stays and cruises across their days with checking in and out, boarding,
 * port calls and all aboard, parking and the rental car. opts.date gives that day
 * alone; opts.alarms adds reminders (2 h before a flight or all aboard, 30 min before
 * the rest, none for meals); opts.conf adds the booking numbers. Each event's UID
 * comes from what it is, so importing again updates it.
 */
function vacIcs(plan, opts) {
    const o = opts || {}, dates = vacDates(plan).filter(d => !o.date || d === o.date), events = [];
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    const ev = (e) => events.push(e);
    const where = (p) => p ? (vacPlaceQuery(p) || vacPlaceName(p)) : '';
    const timed = (uid, date, start, end, summary, more) => ev(Object.assign({ uid, start: vacIcsTime(date, start), end: vacIcsTime(date, Math.max(end, start)), summary }, more));
    dates.forEach(d => plan.days[d].blocks.slice().sort((a, b) => a.start - b.start).forEach(b => {
        const info = vacBlockInfo(plan, b), desc = [];
        let loc = '', url = '', end = vacIcsTime(d, b.end), alarm = b.meal ? null : 30;
        if (info.kind.id === 'flight') {
            const fl = b.flight || {};
            loc = [fl.from, fl.to].filter(Boolean).join(' \u2192 ');
            if (fl.arriveDay > 0 && fl.arrive != null) end = vacIcsTime(vacAddDays(d, fl.arriveDay), fl.arrive);
            if (fl.seat) desc.push('Seat ' + fl.seat);
            if (fl.gate) desc.push(fl.gate);
            if (fl.conf && o.conf) desc.push('Confirmation ' + fl.conf);
            if (fl.number) desc.push('Flight status: ' + vacFlightStatusUrl(fl));
            alarm = 120;
        } else if (info.kind.id === 'drive') {
            const dr = b.drive || {}, home = vacIsHome(plan, dr.from) || vacIsHome(plan, dr.to);
            loc = vacIsHome(plan, dr.to) ? 'Home' : where(dr.to);
            url = home ? '' : vacDriveUrl(b, plan, d);
            if (dr.from) desc.push('From ' + (vacIsHome(plan, dr.from) ? 'Home' : where(dr.from)));
            (dr.stops || []).filter(Boolean).forEach(s => desc.push('Stop: ' + where(s)));
            if (url) desc.push('Directions: ' + url);
        } else if (b.place && vacIsHome(plan, b.place)) loc = 'Home';
        else if (b.place) {
            loc = where(b.place);
            url = vacPlaceUrl(b.place);
            if (url) desc.push('Map: ' + url);
        }
        String(b.notes || '').split('\n').map(l => l.trim()).filter(Boolean).forEach(l => desc.push(l));
        ev({ uid: b.id, start: vacIcsTime(d, b.start), end, summary: info.icon + ' ' + info.title, loc, url, desc, alarm, cat: info.kind.label });
    }));
    // Point events: checking in and out, boarding, parking, the car.
    const point = (uid, date, t, len, summary, place, desc, alarm) => {
        if (!date || (o.date && date !== o.date)) return;
        if (t == null) ev({ uid, allDay: date, endDay: vacAddDays(date, 1), summary, loc: where(place), url: vacPlaceUrl(place), desc: desc || [] });
        else timed(uid, date, t, Math.min(1440, t + len), summary, { loc: where(place), url: vacPlaceUrl(place), desc: desc || [], alarm });
    };
    (plan.stays || []).filter(s => s.inDate).forEach(s => {
        const nm = vacPlaceName(s.place) || 'Stay', desc = [];
        if (s.phone) desc.push('Phone ' + s.phone);
        if (s.conf && o.conf) desc.push('Confirmation ' + s.conf);
        if (vacPlaceUrl(s.place)) desc.push('Map: ' + vacPlaceUrl(s.place));
        String(s.notes || '').split('\n').map(l => l.trim()).filter(Boolean).forEach(l => desc.push(l));
        const outD = s.outDate && s.outDate > s.inDate ? s.outDate : vacAddDays(s.inDate, 1);
        if (!o.date) ev({ uid: s.id + '-stay', allDay: s.inDate, endDay: outD, summary: '\uD83C\uDFE8 ' + nm, loc: where(s.place), url: vacPlaceUrl(s.place), desc });
        point(s.id + '-in', s.inDate, s.inTime, 30, '\uD83C\uDFE8 Check in \u00B7 ' + nm, s.place, desc, 30);
        if (s.outDate) point(s.id + '-out', s.outDate, s.outTime, 30, '\uD83C\uDFE8 Check out \u00B7 ' + nm, s.place, [], 30);
    });
    (plan.cruises || []).filter(c => c.boardDate).forEach(c => {
        const ship = c.ship || 'Cruise', desc = [];
        if (c.line) desc.push(c.line);
        if (c.cabin) desc.push('Cabin ' + c.cabin);
        if (c.conf && o.conf) desc.push('Confirmation ' + c.conf);
        const leave = c.leaveDate && c.leaveDate > c.boardDate ? c.leaveDate : c.boardDate;
        if (!o.date) ev({ uid: c.id + '-cruise', allDay: c.boardDate, endDay: vacAddDays(leave, 1), summary: '\uD83D\uDEA2 ' + ship, loc: where(c.boardPlace), url: vacPlaceUrl(c.boardPlace), desc });
        point(c.id + '-board', c.boardDate, c.boardTime, 30, '\uD83D\uDEA2 Board ' + ship, c.boardPlace,
            desc.concat(c.allAboard != null ? ['All aboard ' + vacTimeLabel(c.allAboard)] : []), 30);
        if (c.allAboard != null) point(c.id + '-aboard', c.boardDate, c.allAboard, 15, '\u23F0 All aboard \u00B7 ' + ship, c.boardPlace, [], 120);
        if (c.leaveDate && c.leaveDate !== c.boardDate) point(c.id + '-leave', c.leaveDate, c.leaveTime, 30, '\uD83D\uDEA2 Leave ' + ship, c.leavePlace || c.boardPlace, [], 30);
        Object.keys(c.days || {}).sort().forEach(d => {
            const day = c.days[d];
            if (!day || !day.port || d === c.boardDate || d === c.leaveDate) return;
            const aboard = vacAllAboard(day);
            if (day.arrive != null) point(c.id + '-port-' + d, d, day.arrive, Math.max(15, (day.depart != null ? day.depart : day.arrive + 60) - day.arrive),
                '\u2693 In port: ' + vacPlaceName(day.port), day.port, aboard != null ? ['All aboard ' + vacTimeLabel(aboard)] : [], 30);
            else point(c.id + '-port-' + d, d, null, 0, '\u2693 In port: ' + vacPlaceName(day.port), day.port, []);
            if (aboard != null) point(c.id + '-aboard-' + d, d, aboard, 15, '\u23F0 All aboard \u00B7 ' + ship, day.port, [], 120);
        });
    });
    vacDates(plan).forEach(d => plan.days[d].blocks.filter(b => b.kind === 'flight').forEach(b => {
        const nm = vacBlockInfo(plan, b).title, t = vacFlightTimes(d, b), fl = b.flight || {};
        if (t.online) point(b.id + '-online', t.online.date, t.online.at, 15, '\u2705 Online check-in opens \u00B7 ' + nm, null,
            [fl.conf && o.conf ? 'Confirmation ' + fl.conf : ''].filter(Boolean), 0);
        if (t.bag) point(b.id + '-bag', d, t.bag.at, 5, '\uD83E\uDDF3 Bag drop closes \u00B7 ' + nm, vacAirportPlace(fl.from), [], 30);
        if (t.gate) point(b.id + '-gate', d, t.gate.at, 5, '\uD83D\uDEAA Gate closes \u00B7 ' + nm, vacAirportPlace(fl.from), fl.gate ? [fl.gate] : [], 30);
    }));
    (plan.parking || []).forEach(pk => {
        const lot = vacPlaceName(pk.lot) || 'Parking', desc = [];
        if (pk.conf && o.conf) desc.push('Reservation ' + pk.conf);
        point(pk.id + '-drop', pk.fromDate, pk.fromTime, 15, '\uD83C\uDD7F\uFE0F Drop off \u00B7 ' + lot, pk.lot, desc, 30);
        point(pk.id + '-pick', pk.toDate, pk.toTime, 15, '\uD83C\uDD7F\uFE0F Pick up \u00B7 ' + lot, pk.lot, pk.spot ? ['Spot ' + pk.spot] : [], 30);
    });
    (plan.rentals || []).forEach(r => {
        const nm = r.company || 'Rental car', desc = [];
        if (r.car) desc.push(r.car);
        if (r.conf && o.conf) desc.push('Confirmation ' + r.conf);
        point(r.id + '-pick', r.pickDate, r.pickTime, 30, '\uD83D\uDE99 Pick up \u00B7 ' + nm, r.pickPlace, desc, 30);
        point(r.id + '-drop', r.dropDate, r.dropTime, 30, '\uD83D\uDE99 Return \u00B7 ' + nm, r.dropPlace || r.pickPlace, [], 30);
    });
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Toolboard//Vacation Planner//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
        'X-WR-CALNAME:' + vacIcsText(plan.name || 'Trip')];
    events.forEach(e => {
        lines.push('BEGIN:VEVENT', 'UID:' + vacIcsText(e.uid) + '@vacation-planner.toolboard', 'DTSTAMP:' + stamp);
        if (e.allDay) lines.push('DTSTART;VALUE=DATE:' + vacIcsDate(e.allDay), 'DTEND;VALUE=DATE:' + vacIcsDate(e.endDay), 'TRANSP:TRANSPARENT');
        else lines.push('DTSTART:' + e.start, 'DTEND:' + e.end);
        lines.push('SUMMARY:' + vacIcsText(e.summary));
        if (e.loc) lines.push('LOCATION:' + vacIcsText(e.loc));
        if (e.url) lines.push('URL:' + e.url);
        if (e.desc && e.desc.length) lines.push('DESCRIPTION:' + vacIcsText(e.desc.join('\n')));
        if (e.cat) lines.push('CATEGORIES:' + vacIcsText(e.cat));
        if (o.alarms && !e.allDay && e.alarm != null) lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + vacIcsText(e.summary),
            'TRIGGER:' + (e.alarm ? '-PT' + (e.alarm % 60 ? e.alarm + 'M' : (e.alarm / 60) + 'H') : 'PT0M'), 'END:VALARM');
        lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return { text: lines.map(vacIcsFold).join('\r\n') + '\r\n', count: events.length };
}

function vacCalHtml(plan, ui) {
    const o = ui.cal, day = plan.days[ui.view] ? ui.view : null;
    const scope = day && o.scope === 'day' ? day : null;
    const n = vacIcs(plan, { date: scope, alarms: o.alarms, conf: o.conf }).count;
    return '<div class="vac-out vac-cal" role="dialog" aria-label="The plan as a calendar file">' +
        '<div class="vac-row vac-out-bar"><b>\uD83D\uDCC5 Calendar</b>' +
            '<select class="vac-cal-scope" onchange="vacCalOption(this)">' +
                '<option value="trip"' + (scope ? '' : ' selected') + '>Whole trip</option>' +
                (day ? '<option value="day"' + (scope ? ' selected' : '') + '>' + vacEsc(vacDayLabel(day, 'short')) + ' only</option>' : '') +
            '</select>' +
            '<label class="vac-check" title="2 hours before a flight or all aboard, 30 minutes before the rest; none for meals"><input type="checkbox" class="vac-cal-alarms"' + (o.alarms ? ' checked' : '') + ' onchange="vacCalOption(this)"> Reminders</label>' +
            '<label class="vac-check" title="Flight, stay, cruise, parking and rental bookings: left out unless wanted, as a calendar is often shared"><input type="checkbox" class="vac-cal-conf"' + (o.conf ? ' checked' : '') + ' onchange="vacCalOption(this)"> Include booking numbers</label>' +
            '<span class="vac-out-gap"></span>' +
            '<button class="vac-icon vac-out-close vac-cal-close" onclick="vacCalToggle(this)" title="Close">\u00D7</button>' +
        '</div>' +
        '<div class="vac-cal-body"><p><b class="vac-cal-count">' + n + '</b> event' + (n === 1 ? '' : 's') + ', as an .ics file that Google Calendar, Apple Calendar and Outlook open.</p>' +
            '<button class="vac-btn vac-cal-download"' + (n ? '' : ' disabled') + ' onclick="vacCalDownload(this)">\u2B07\uFE0F Download .ics</button>' +
            '<div class="vac-hint">Times are local: 3:00 PM shows at 3:00 PM wherever the calendar is. Importing again updates the events rather than adding them twice, in most calendars.</div></div>' +
        '</div>';
}

function vacCalToggle(el) {
    vacMutate(el, (plan, ui) => { ui.cal = ui.cal ? null : { scope: 'trip', alarms: true, conf: false }; if (ui.cal) { ui.out = null; ui.warn = null; } return false; });
}

function vacCalOption(el) {
    const bar = el.closest('.vac-cal');
    vacMutate(el, (plan, ui) => {
        ui.cal = { scope: bar.querySelector('.vac-cal-scope').value, alarms: bar.querySelector('.vac-cal-alarms').checked, conf: bar.querySelector('.vac-cal-conf').checked };
        return false;
    });
}

/** A file name from the trip's name. */
function vacFileName(plan, date) {
    const base = String(plan.name || 'trip').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'trip';
    return base + (date ? '-' + date : '');
}

function vacCalDownload(btn) {
    const widget = vacGetWidget(btn), toolId = vacGetToolId(widget), plan = vacGetData(toolId), ui = vacUiOf(toolId);
    const date = ui.cal && ui.cal.scope === 'day' && plan.days[ui.view] ? ui.view : null;
    const { text } = vacIcs(plan, { date, alarms: ui.cal && ui.cal.alarms, conf: ui.cal && ui.cal.conf });
    const url = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = vacFileName(plan, date) + '.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Export as PDF: the plan as it reads, rather than the schedule's grid, which does not fit a page. */
function vacPrintHtml(toolId) {
    const plan = vacGetData(toolId);
    const md = vacMarkdown(plan, { lists: true, conf: false });
    return vacMdHtml(md) || '<pre>' + vacEsc(md) + '</pre>';
}

/** Text in a Markdown link's label, its brackets kept as text. */
function vacMdText(s) { return String(s || '').replace(/([\\\[\]])/g, '\\$1'); }

function vacMdLink(label, url) {
    return url ? '[' + vacMdText(label) + '](' + url.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/ /g, '%20') + ')' : vacMdText(label);
}

/**
 * The plan as a Markdown bullet list: the trip, then each day's blocks in time
 * order — its time, what, which meal, where (a Maps link) and ✓ when done, its notes
 * under it — the day's route and its own list; then the checklists, when wanted.
 * opts.date gives that day alone; opts.lists false leaves the checklists out.
 */
function vacMarkdown(plan, opts) {
    const o = opts || {};
    const dates = vacDates(plan).filter(d => !o.date || d === o.date);
    const all = vacDates(plan);
    const out = ['# ' + (plan.name || 'Trip')];
    const sub = [];
    if (all.length) sub.push(vacDayLabel(all[0], 'short') + (all.length > 1 ? ' – ' + vacDayLabel(all[all.length - 1], 'short') : ''));
    if (sub.length) out.push('', sub.join(' · '));
    const items = (list) => list.map(it => '- [' + (it.done ? 'x' : ' ') + '] ' + it.text);
    const isHome = (p) => vacIsHome(plan, p);
    const nameOf = (p) => isHome(p) ? 'Home' : vacPlaceName(p);
    if (all.length && !o.date) ['out', 'back'].forEach(which => {
        const { steps } = vacJourneyPlan(plan, which);
        if (!steps.some(st => st.kind)) return;
        out.push('', which === 'out' ? '## Getting there' : '## Getting back');
        let last = null;
        steps.forEach(st => {
            if (!st.date || st.leg === 'home') { last = null; out.push('- ' + st.icon + ' ' + (st.leg === 'home' ? 'Home' : vacMdText(st.title))); return; }
            if (st.date !== last) { last = st.date; out.push('- ' + vacDayLabel(st.date, 'short')); }
            out.push('  - ' + st.icon + ' ' + (vacStepTimes(st) ? vacStepTimes(st) + ' \u00B7 ' : '') + vacMdText(st.title));
        });
    });
    const when = (date, t) => vacDayLabel(date, 'short') + (t != null ? ' ' + vacTimeLabel(t) : '');
    dates.forEach(d => {
        const day = plan.days[d];
        out.push('', '## ' + vacMdText(vacDayName(plan, d, 'long')));
        vacDayEvents(plan, d).forEach(e => out.push('- ' + e.icon + ' ' + vacMdText(e.text)));
        const gaps = vacGaps(plan, d);
        day.blocks.slice().sort((a, b) => a.start - b.start || a.end - b.end).forEach(b => {
            const info = vacBlockInfo(plan, b);
            let line = '- ' + info.icon + ' ' + info.times + ' · ' + vacMdText(info.title) + (info.meal ? ' (' + info.meal.key.toUpperCase() + ')' : '');
            const sublines = [];
            if (info.kind.id === 'flight') {
                const fl = b.flight || {};
                if (info.where) line += ' · ' + vacMdText(info.where);
                if (fl.seat) line += ' · Seat ' + vacMdText(fl.seat);
                if (fl.gate) line += ' · ' + vacMdText(fl.gate);
                if (fl.conf && o.conf) line += ' · Confirmation ' + vacMdText(fl.conf);
                if (fl.number) line += ' · ' + vacMdLink('Flight status', vacFlightStatusUrl(fl));
            } else if (info.kind.id === 'drive') {
                const dr = b.drive || {}, home = isHome(dr.from) || isHome(dr.to);
                const where = [dr.from, dr.to].filter(Boolean).map(nameOf).join(' \u2192 '), url = home ? '' : vacDriveUrl(b, plan, d);
                if (where || url) line += ' · ' + vacMdLink(where || 'Directions', url);
                ((b.drive || {}).stops || []).filter(Boolean).forEach(st => sublines.push('Stop: ' + vacMdLink(vacPlaceText(st) || vacPlaceName(st), vacPlaceUrl(st))));
            } else {
                const where = isHome(b.place) ? 'Home' : b.place ? vacPlaceText(b.place) || vacPlaceName(b.place) : '';
                if (where) line += ' · ' + vacMdLink(where, isHome(b.place) ? '' : vacPlaceUrl(b.place));
            }
            out.push(line + (b.done ? ' ✓' : ''));
            sublines.concat(String(b.notes || '').split('\n').map(l => l.trim()).filter(Boolean)).forEach(l => out.push('  - ' + l));
            gaps.filter(g => g.a === b && g.min != null && !g.estimate).forEach(g => out.push('  - \u21B3 ' + vacGapMode(g.mode).icon + ' ' + vacDur(g.min) + ' to ' + vacMdText(g.toName)));
        });
        if (!day.blocks.length) out.push('- Nothing planned');
        const homeStop = plan.home ? vacRouteStop(plan.home) : null;
        const route = vacRouteUrl(vacRouteStops(plan, d).filter(x => x !== homeStop));
        if (route) out.push('- \uD83D\uDDFA\uFE0F Route for the day: ' + vacMdLink('Google Maps', route));
        const wear = vacWearGroups(plan, day);
        if (wear.length === 1 && !wear[0].person) out.push('- \uD83D\uDC55 Wear: ' + vacMdText(vacWearText(wear[0])));
        else if (wear.length) out.push('- \uD83D\uDC55 Wear:', ...wear.map(g => '  - ' + vacMdText(vacWhoName(g.person)) + ' — ' + vacMdText(vacWearText(g))));
        if (day.list.length) out.push('- \u2611\uFE0F To do:', ...items(day.list).map(l => '  ' + l));
    });
    if (!all.length) out.push('', 'No dates yet.');
    const stays = (plan.stays || []).filter(st => st.place && (!o.date || (st.inDate <= o.date && (st.outDate || st.inDate) >= o.date)));
    if (stays.length) {
        out.push('', '## Stay');
        stays.forEach(st => {
            out.push('- \uD83C\uDFE8 ' + vacMdLink(vacPlaceText(st.place) || vacPlaceName(st.place), vacPlaceUrl(st.place)) +
                (st.inDate ? ' \u00B7 ' + when(st.inDate, st.inTime) : '') + (st.outDate ? ' \u2013 ' + when(st.outDate, st.outTime) : '') +
                (st.phone ? ' \u00B7 \uD83D\uDCDE ' + vacMdText(st.phone) : '') + 
                (st.conf && o.conf ? ' \u00B7 Confirmation ' + vacMdText(st.conf) : ''));
            String(st.notes || '').split('\n').map(l => l.trim()).filter(Boolean).forEach(l => out.push('  - ' + l));
        });
    }
    const parking = (plan.parking || []).filter(pk => !o.date || pk.fromDate === o.date || pk.toDate === o.date);
    if (parking.length) {
        out.push('', '## Parking');
        parking.forEach(pk => out.push('- 🅿️ ' + (pk.lot ? vacMdLink(vacPlaceText(pk.lot) || vacPlaceName(pk.lot), vacPlaceUrl(pk.lot)) : 'Parking') +
            (pk.fromDate ? ' · Drop off ' + when(pk.fromDate, pk.fromTime) : '') +
            (pk.toDate ? ' · Pick up ' + when(pk.toDate, pk.toTime) : '') +
            (pk.spot ? ' · Parked at ' + vacMdText(pk.spot) : '') +
            (pk.conf && o.conf ? ' · Reservation ' + vacMdText(pk.conf) : '')));
    }
    const cruises = (plan.cruises || []).filter(c => c.boardDate && (!o.date || (c.boardDate <= o.date && (c.leaveDate || c.boardDate) >= o.date)));
    if (cruises.length) {
        out.push('', '## Cruise');
        cruises.forEach(c => {
            const at = (p) => p ? ' ' + vacMdLink(vacPlaceText(p) || vacPlaceName(p), vacPlaceUrl(p)) : '';
            out.push('- \uD83D\uDEA2 ' + vacMdText([c.ship, c.line].filter(Boolean).join(' \u00B7 ') || 'Cruise') + (c.cabin ? ' \u00B7 Cabin ' + vacMdText(c.cabin) : '') +
                ' \u00B7 Board' + at(c.boardPlace) + ' ' + when(c.boardDate, c.boardTime) + (c.allAboard != null ? ' (all aboard ' + vacTimeLabel(c.allAboard) + ')' : '') +
                (c.leaveDate ? ' \u00B7 Leave' + at(c.leavePlace) + ' ' + when(c.leaveDate, c.leaveTime) : '') +
(c.conf && o.conf ? ' \u00B7 Booking ' + vacMdText(c.conf) : ''));
            for (let d = vacAddDays(c.boardDate, 1), n = 0; c.leaveDate && d < c.leaveDate && n < VAC_MAX_DAYS; d = vacAddDays(d, 1), n++) {
                if (o.date && d !== o.date) continue;
                const day = (c.days || {})[d];
                out.push('  - ' + (day && day.port ? '\u2693 ' + vacDayLabel(d, 'short') + ' \u00B7' + at(day.port) +
                    (day.arrive != null ? ' ' + vacTimeLabel(day.arrive) + (day.depart != null ? '\u2013' + vacTimeLabel(day.depart) : '') : '') +
                    (vacAllAboard(day) != null ? ', all aboard ' + vacTimeLabel(vacAllAboard(day)) : '') : '\uD83C\uDF0A ' + vacDayLabel(d, 'short') + ' \u00B7 At sea'));
            }
            String(c.notes || '').split('\n').map(l => l.trim()).filter(Boolean).forEach(l => out.push('  - ' + l));
        });
    }
    const rentals = (plan.rentals || []).filter(r => !o.date || (r.pickDate <= o.date && (r.dropDate || r.pickDate) >= o.date));
    if (rentals.length) {
        out.push('', '## Car rental');
        rentals.forEach(r => {
            const at = (p) => p ? ' ' + vacMdLink(vacPlaceText(p) || vacPlaceName(p), vacPlaceUrl(p)) : '';
            out.push('- \uD83D\uDE99 ' + vacMdText([r.company, r.car].filter(Boolean).join(' \u00B7 ') || 'Rental car') +
                (r.pickDate ? ' \u00B7 Pick up' + at(r.pickPlace) + ' ' + when(r.pickDate, r.pickTime) : '') +
                (r.dropDate ? ' \u00B7 Return' + (r.dropPlace ? at(r.dropPlace) : '') + ' ' + when(r.dropDate, r.dropTime) : '') +
(r.conf && o.conf ? ' \u00B7 Confirmation ' + vacMdText(r.conf) : ''));
            String(r.notes || '').split('\n').map(l => l.trim()).filter(Boolean).forEach(l => out.push('  - ' + l));
        });
    }
    if (o.lists !== false) plan.lists.filter(l => l.items.length).forEach(l => out.push('', '## ' + l.name, ...items(l.items)));
    return out.join('\n') + '\n';
}

function vacOutHtml(plan, ui) {
    const o = ui.out, day = plan.days[ui.view] ? ui.view : null;
    const scope = day && o.scope === 'day' ? day : null;
    const md = vacMarkdown(plan, { date: scope, lists: o.lists, conf: o.conf }), html = vacMdHtml(md);
    const view = o.view === 'md' || html == null ? 'md' : 'preview';
    const seg = (v, label) => '<button class="vac-out-view' + (view === v ? ' vac-on' : '') + '" data-v="' + v + '" onclick="vacOutView(this)"' +
        (v === 'preview' && html == null ? ' disabled title="The Markdown library did not load"' : '') + '>' + label + '</button>';
    return '<div class="vac-out" role="dialog" aria-label="The plan as a bullet list">' +
        '<div class="vac-row vac-out-bar"><b>Bullet list</b>' +
            '<span class="vac-out-views" role="group">' + seg('preview', 'Preview') + seg('md', 'Markdown') + '</span>' +
            '<select class="vac-out-scope" onchange="vacOutOption(this)">' +
                '<option value="trip"' + (scope ? '' : ' selected') + '>Whole trip</option>' +
                (day ? '<option value="day"' + (scope ? ' selected' : '') + '>' + vacEsc(vacDayLabel(day, 'short')) + ' only</option>' : '') +
            '</select>' +
            '<label class="vac-check"><input type="checkbox" class="vac-out-lists"' + (o.lists ? ' checked' : '') + ' onchange="vacOutOption(this)"> Include lists</label>' +
            '<label class="vac-check" title="Flight confirmations and parking reservations: left out unless wanted, as a list is often passed on"><input type="checkbox" class="vac-out-conf"' + (o.conf ? ' checked' : '') + ' onchange="vacOutOption(this)"> Include confirmation numbers</label>' +
            '<span class="vac-out-gap"></span>' +
            '<button class="vac-btn vac-out-copy-rich" onclick="vacOutCopyRich(this)" title="Headings, bullets and links, to paste into a chat or an email; plain text where formatting is not taken"' +
                (html == null ? ' disabled' : '') + '>Copy formatted</button>' +
            '<button class="vac-btn vac-out-copy" onclick="vacOutCopy(this)" title="The Markdown itself">Copy Markdown</button>' +
            '<button class="vac-icon vac-out-close" onclick="vacOutToggle(this)" title="Close">×</button>' +
        '</div>' +
        (html == null && o.view !== 'md' ? '<div class="vac-hint">The preview needs the Markdown library, which did not load: here is the Markdown.</div>' : '') +
        '<div class="vac-out-preview markdown-content"' + (view === 'preview' ? '' : ' hidden') + '>' + (html || '') + '</div>' +
        '<textarea class="vac-out-text" readonly spellcheck="false"' + (view === 'md' ? '' : ' hidden') + '>' + vacEsc(md) + '</textarea>' +
        '</div>';
}

/** The bullet list as HTML: its own text escaped first, so a name is never markup; boxes as ☐ and ☑, which paste anywhere. Null without marked. */
function vacMdHtml(md) {
    if (typeof marked === 'undefined' || !marked.parse) return null;
    const src = String(md).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/^(\s*)- \[ \] /gm, '$1- ☐ ').replace(/^(\s*)- \[x\] /gm, '$1- ☑ ');
    let html;
    try { html = marked.parse(src, { gfm: true, breaks: false }); } catch (e) { return null; }
    const t = document.createElement('template');
    t.innerHTML = html;
    t.content.querySelectorAll('a').forEach(a => {
        if (!/^https?:\/\//i.test(a.getAttribute('href') || '')) a.removeAttribute('href');
        else { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    });
    return t.innerHTML;
}

/**
 * The bullet list as plain text, for a chat that takes no formatting: headings as
 * lines of their own, • and ◦ for bullets, ☐ and ☑ for boxes, a link as its name and
 * then its address.
 */
function vacMdPlain(md) {
    const unesc = (s) => s.replace(/\\([\\\[\]])/g, '$1');
    const link = (s) => s.replace(/\[((?:\\.|[^\]\\])*)\]\(([^)\s]+)\)/g, (m, label, url) => {
        const l = unesc(label);
        return l === url ? url : l + ' – ' + url;
    });
    return String(md).split('\n').map(line => {
        const h = /^(#{1,6})\s+(.*)$/.exec(line);
        if (h) return unesc(link(h[2]));
        const b = /^(\s*)- (.*)$/.exec(line);
        if (!b) return unesc(link(line));
        const depth = Math.floor(b[1].length / 2);
        const body = b[2].replace(/^\[ \] /, '☐ ').replace(/^\[x\] /, '☑ ');
        return '    '.repeat(depth) + (depth ? '◦ ' : '• ') + unesc(link(body));
    }).join('\n').replace(/\n{3,}/g, '\n\n');
}

function vacOutView(btn) { vacMutate(btn, (plan, ui) => { if (ui.out) ui.out.view = btn.dataset.v; return false; }); }

function vacOutToggle(el) {
    vacMutate(el, (plan, ui) => {
        ui.out = ui.out ? null : { scope: 'trip', lists: true, conf: false, view: 'preview' };
        if (ui.out) { ui.cal = null; ui.warn = null; }
        return false;
    });
}

function vacOutOption(el) {
    const bar = el.closest('.vac-out');
    vacMutate(el, (plan, ui) => {
        ui.out = { scope: bar.querySelector('.vac-out-scope').value, lists: bar.querySelector('.vac-out-lists').checked,
            conf: bar.querySelector('.vac-out-conf').checked, view: (ui.out || {}).view || 'preview' };
        return false;
    });
}

async function vacOutCopy(btn) {
    const text = btn.closest('.vac-out').querySelector('.vac-out-text');
    let done = false;
    try { await navigator.clipboard.writeText(text.value); done = true; } catch (e) {
        text.select();
        try { done = document.execCommand('copy'); } catch (e2) { done = false; }
    }
    btn.textContent = done ? 'Copied' : 'Select and copy';
    setTimeout(() => { btn.textContent = 'Copy Markdown'; }, 1500);
}

/** The list as it reads: HTML where formatting is taken, plain text where it is not. */
async function vacOutCopyRich(btn) {
    const box = btn.closest('.vac-out'), md = box.querySelector('.vac-out-text').value, html = vacMdHtml(md);
    if (html == null) return;
    const plain = vacMdPlain(md);
    let done = false;
    try {
        await navigator.clipboard.write([new ClipboardItem({
            'text/html': new Blob(['<meta charset="utf-8">' + html], { type: 'text/html' }),
            'text/plain': new Blob([plain], { type: 'text/plain' })
        })]);
        done = true;
    } catch (e) {
        // No rich clipboard: the preview itself, selected and copied.
        const pv = box.querySelector('.vac-out-preview'), was = pv.hidden;
        pv.hidden = false;
        const r = document.createRange(), sel = window.getSelection();
        r.selectNodeContents(pv);
        sel.removeAllRanges();
        sel.addRange(r);
        try { done = document.execCommand('copy'); } catch (e2) { done = false; }
        sel.removeAllRanges();
        pv.hidden = was;
    }
    btn.textContent = done ? 'Copied' : 'Could not copy';
    setTimeout(() => { btn.textContent = 'Copy formatted'; }, 1500);
}

/**
 * The main pane drawn again, touching only what changed: on a day, its header and
 * its grid each only if different, so a click on the one that ended an edit in the
 * other still lands.
 */
function vacSwapMain(main, html) {
    const t = document.createElement('div');
    t.innerHTML = html;
    const next = t.firstElementChild;
    if (next.outerHTML === main.outerHTML) return;
    if (main.dataset.view === next.dataset.view && main.querySelector('.vac-day-head') && next.querySelector('.vac-day-head')) {
        ['.vac-day-head', '.vac-grid-wrap'].forEach(sel => {
            const a = main.querySelector(sel), b = next.querySelector(sel);
            if (a && b && a.outerHTML !== b.outerHTML) a.replaceWith(b);
        });
        return;
    }
    main.replaceWith(next);
}

function vacPxOf(ui, view) { return Math.max(view === 'day' ? VAC_PX : VAC_TRIP_PX, (ui.px || {})[view] || 0); }

/**
 * The hours stretched to the height there is: after drawing, how much room the grid
 * has below what sits above it; if that gives another scale, it is kept for the view
 * and drawn again. Returns whether it changed.
 */
function vacFit(widget, ui) {
    const main = widget.querySelector('.vac-main');
    const view = ui.view === 'trip' ? 'trip' : /^\d{4}-/.test(ui.view) ? 'day' : null;
    if (!main || !view || !main.clientHeight) return false;
    const grid = main.querySelector(view === 'day' ? '.vac-grid' : '.vac-taxis .vac-tgrid');
    if (!grid) return false;
    const hours = view === 'day' ? (+grid.dataset.h1 - +grid.dataset.h0) : +grid.dataset.hours;
    if (!hours) return false;
    // Room below the grid's top, less what follows it inside the pane.
    const top = grid.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop;
    const below = view === 'day' ? 12 : 8;
    const px = Math.max(view === 'day' ? VAC_PX : VAC_TRIP_PX, Math.floor((main.clientHeight - top - below) / hours));
    ui.px = ui.px || {};
    if (Math.abs((ui.px[view] || 0) - px) < 1) return false;
    ui.px[view] = px;
    return true;
}

/** The trip-wide tabs in the order chosen: any not placed yet (a new one, say) after, in their own order. */
function vacTabOrder(plan) {
    const known = ['trip'].concat(VAC_PANES.map(x => x.id));
    const saved = (plan.tabOrder || []).filter((id, i, a) => known.includes(id) && a.indexOf(id) === i);
    return saved.concat(known.filter(id => !saved.includes(id)));
}

function vacTabLabel(id) { return id === 'trip' ? 'Trip' : (VAC_PANES.find(x => x.id === id) || {}).label || id; }

/** A tab moved to before or after another; kept with the plan. */
function vacMoveTab(el, from, to, after) {
    vacMutate(el, (plan) => {
        if (from === to) return 'none';
        const order = vacTabOrder(plan).filter(x => x !== from), i = order.indexOf(to);
        if (i < 0) return 'none';
        order.splice(after ? i + 1 : i, 0, from);
        plan.tabOrder = order;
    });
}

function vacTabDragStart(e) {
    e.dataTransfer.setData('text/plain', 'vac-tab:' + e.currentTarget.dataset.view);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('vac-tab-dragging');
}

function vacTabSide(e) { const r = e.currentTarget.getBoundingClientRect(); return e.clientX > r.left + r.width / 2; }

function vacTabDragOver(e) {
    if (!Array.from(e.dataTransfer.types || []).includes('text/plain')) return;
    e.preventDefault();
    const after = vacTabSide(e);
    e.currentTarget.classList.toggle('vac-drop-before', !after);
    e.currentTarget.classList.toggle('vac-drop-after', after);
}

function vacTabDragLeave(e) { e.currentTarget.classList.remove('vac-drop-before', 'vac-drop-after'); }

function vacTabDrop(e) {
    const data = e.dataTransfer.getData('text/plain') || '';
    if (data.indexOf('vac-tab:') !== 0) return;
    e.preventDefault();
    const t = e.currentTarget;
    t.classList.remove('vac-drop-before', 'vac-drop-after');
    vacMoveTab(t, data.slice(8), t.dataset.view, vacTabSide(e));
}

function vacTabDragEnd(e) {
    const w = vacGetWidget(e.currentTarget);
    if (w) w.querySelectorAll('.vac-tab-dragging, .vac-drop-before, .vac-drop-after').forEach(x => x.classList.remove('vac-tab-dragging', 'vac-drop-before', 'vac-drop-after'));
}

/** Alt+← and Alt+→ move the tab with the focus, which keeps it. */
function vacTabKey(e) {
    if (!e.altKey || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault();
    const id = e.currentTarget.dataset.view, widget = vacGetWidget(e.currentTarget);
    vacMutate(e.currentTarget, (plan) => {
        const order = vacTabOrder(plan), i = order.indexOf(id), j = i + (e.key === 'ArrowLeft' ? -1 : 1);
        if (i < 0 || j < 0 || j >= order.length) return 'none';
        order.splice(i, 1);
        order.splice(j, 0, id);
        plan.tabOrder = order;
    });
    const tab = widget.querySelector('.vac-tab[data-view="' + id + '"]');
    if (tab) tab.focus();
}

/** Draws the planner. With side: false only the day is drawn again, so a field being moved to keeps its place. */
function vacRender(widget, opts) {
    const toolId = vacGetToolId(widget);
    if (!toolId) return;
    const plan = vacGetData(toolId), dates = vacDates(plan), ui = vacUiOf(toolId);
    ui.toolId = toolId;
    if (ui.view !== 'trip' && !VAC_PANES.some(x => x.id === ui.view) && !dates.includes(ui.view)) ui.view = 'trip';
    const isDay = dates.includes(ui.view);
    if (ui.sel && !vacFind(plan, ui.sel)) ui.sel = null;
    // The side panel is the chosen block's, and is there only on a day.
    const keepSide = opts && opts.side === false && widget.querySelector('.vac-side') && isDay;
    // head: false keeps only the header, being typed in, and draws the rest again.
    const keepHead = opts && opts.head === false && widget.querySelector('.vac-head-wrap');
    const main = widget.querySelector('.vac-main'), side = widget.querySelector('.vac-side');
    const scroll = main && main.dataset.view === ui.view ? [main.scrollTop, main.scrollLeft] : null;
    const sideScroll = side ? side.scrollTop : 0;
    // Lists, places and travel are wanted before there are dates; the days come with them.
    const tabs = '<div class="vac-tabs">' +
        vacTabOrder(plan).map(id => '<button class="vac-tab' + (ui.view === id ? ' vac-on' : '') + '" data-view="' + id + '" draggable="true" ' +
            'onclick="vacView(this)" ondragstart="vacTabDragStart(event)" ondragover="vacTabDragOver(event)" ondragleave="vacTabDragLeave(event)" ' +
            'ondrop="vacTabDrop(event)" ondragend="vacTabDragEnd(event)" onkeydown="vacTabKey(event)" title="Drag to move it, or Alt+\u2190 / Alt+\u2192">' +
            vacTabLabel(id) + '</button>').join('') +
        '<span class="vac-tabsep"></span>' +
        dates.map(d => '<button class="vac-tab' + (ui.view === d ? ' vac-on' : '') + '" data-view="' + d + '" onclick="vacView(this)" title="' +
            vacEsc(vacDayName(plan, d, 'long')) + '">' + vacEsc(vacTabText(plan, d)) + '</button>').join('') + '</div>';
    const mainHtml = '<div class="vac-main" data-view="' + ui.view + '">' + (ui.view === 'trip' ? vacTripHtml(plan, dates, ui) : ui.view === 'clothes' ? vacClothesHtml(plan, ui)
        : ui.view === 'travel' ? '<div class="vac-pane">' + vacTravelHtml(plan, ui) + '</div>'
        : ui.view === 'people' ? '<div class="vac-pane">' + vacPeopleHtml(plan) + '</div>'
        : ui.view === 'stay' ? '<div class="vac-pane">' + vacStaysHtml(plan, ui) + '</div>'
        : ui.view === 'cruise' ? '<div class="vac-pane vac-pane-wide">' + vacCruisesHtml(plan, ui) + '</div>'
        : ui.view === 'places' ? '<div class="vac-pane">' + vacPlacesHtml(plan, ui) + '</div>'
        : ui.view === 'lists' ? '<div class="vac-pane">' + vacListsHtml(plan, ui) + '</div>'
        : ui.view === 'meals' ? '<div class="vac-pane">' + vacMealsHtml(plan) + '</div>'
        : ui.view === 'budget' ? '<div class="vac-pane vac-pane-wide">' + vacBudgetHtml(plan) + '</div>'
        : vacDayHtml(plan, ui.view, ui)) + '</div>';
    if (keepHead) {
        vacSwapMain(main, mainHtml);
        const sideEl = widget.querySelector('.vac-side');
        if (sideEl) { sideEl.innerHTML = vacSideHtml(plan, dates, ui); sideEl.scrollTop = sideScroll; }
        widget.querySelector('.vac-places-list').outerHTML = vacPlacesDatalist(plan, ui);
    } else if (keepSide) {
        // An edit to the chosen block changes only the day: the header and the
        // panel stay, so a click that ended the edit lands on what it was aimed at.
        vacSwapMain(main, mainHtml);
    } else {
        widget.innerHTML = '<div class="vac-head-wrap">' + vacHeadHtml(plan, ui) + tabs + '</div>' +
            '<div class="vac-body">' + mainHtml + (isDay ? '<div class="vac-side">' + vacSideHtml(plan, dates, ui) + '</div>' : '') +
            (ui.out ? vacOutHtml(plan, ui) : '') + (ui.cal ? vacCalHtml(plan, ui) : '') + (ui.warn ? vacWarnHtml(plan, ui) : '') + '</div>' + vacPlacesDatalist(plan, ui);
        if (isDay) widget.querySelector('.vac-side').scrollTop = sideScroll;
    }
    if (keepHead || keepSide) {
        // An open bullet list keeps up, its controls left where they are.
        const outText = widget.querySelector('.vac-out-text');
        if (outText) {
            const day = ui.out && ui.out.scope === 'day' && plan.days[ui.view] ? ui.view : null;
            outText.value = vacMarkdown(plan, { date: day, lists: ui.out.lists, conf: ui.out.conf });
            const pv = widget.querySelector('.vac-out-preview'), html = vacMdHtml(outText.value);
            if (pv && html != null) pv.innerHTML = html;
        }
        // The header was kept: its warnings' count, the open warnings and calendar keep up.
        const slot = widget.querySelector('.vac-warn-slot'), btnHtml = vacWarnBtnHtml(plan, ui);
        if (slot && slot.innerHTML !== btnHtml) slot.innerHTML = btnHtml;
        const list = widget.querySelector('.vac-warn-list');
        if (list) list.innerHTML = vacWarnRowsHtml(plan, ui);
        const count = widget.querySelector('.vac-cal-count');
        if (count && ui.cal) count.textContent = vacIcs(plan, { date: ui.cal.scope === 'day' && plan.days[ui.view] ? ui.view : null }).count;
    }
    const nextMain = widget.querySelector('.vac-main');
    if (scroll) { nextMain.scrollTop = scroll[0]; nextMain.scrollLeft = scroll[1]; }
    // Hours that fill the height: once more if the room asks for another scale.
    if (!(opts && opts.fitted) && vacFit(widget, ui)) vacRender(widget, Object.assign({}, opts, { fitted: true }));
}

/**
 * The common path of an edit: read the plan, change it, save it, draw it. fn
 * returns false for a change that is not saved (what is being looked at), and
 * 'none' to leave everything as it is.
 */
function vacMutate(el, fn, opts) {
    const widget = vacGetWidget(el), toolId = widget && vacGetToolId(widget);
    if (!toolId) return;
    const plan = vacGetData(toolId), ui = vacUiOf(toolId);
    const r = fn(plan, ui, widget);
    if (r === 'none') return;
    if (r !== false) vacSaveData(toolId, plan);
    if (opts && opts.draw === false) return;
    vacRender(widget, opts);
}

function vacSetName(el) { vacMutate(el, (plan) => { plan.name = el.value.trim(); }); }

/** Where the trip is: the rest drawn again, the header (being typed in) kept. */
function vacSetDest(el) { vacMutate(el, (plan) => { plan.destination = el.value.trim(); }, { head: false }); }

function vacSetDates(el) {
    vacMutate(el, (plan, ui, widget) => {
        let start = widget.querySelector('.vac-start').value, end = widget.querySelector('.vac-end').value;
        if (!start && end && el.classList.contains('vac-end')) start = end;
        if (!start) end = '';
        if (start && (!end || end < start)) end = start;
        const next = vacDates({ start, end });
        if (next.length) end = next[next.length - 1];
        const gone = Object.keys(plan.days).filter(d => !next.includes(d));
        const busy = gone.filter(d => vacHasPlans(plan, plan.days[d])).sort();
        if (busy.length && !window.confirm('Leave out ' + (busy.length === 1 ? vacDayLabel(busy[0], 'long') : busy.length + ' days') +
            ', and what is planned on ' + (busy.length === 1 ? 'it' : 'them') + '?')) return false;
        gone.forEach(d => delete plan.days[d]);
        plan.start = start;
        plan.end = end;
        vacEnsureDays(plan);
    });
}


/**
 * An amount typed as text, as a number: "$1,240", "€85.50", "1.240,50", "85". A comma
 * is the decimal point when it is the last separator and has one or two digits after
 * it. Null when there is no number in it ("free", "included").
 */
function vacMoney(text) {
    let t = String(text == null ? '' : text).replace(/[^\d.,-]/g, '');
    if (!/\d/.test(t)) return null;
    const lastC = t.lastIndexOf(','), lastD = t.lastIndexOf('.');
    if (lastC > lastD && /^,\d{1,2}$/.test(t.slice(lastC))) t = t.slice(0, lastC).replace(/[.,]/g, '') + '.' + t.slice(lastC + 1);
    else if (lastD > lastC && lastC >= 0) t = t.replace(/,/g, '');
    else t = t.replace(/,/g, '');
    if ((t.match(/\./g) || []).length > 1) { const i = t.lastIndexOf('.'); t = t.slice(0, i).replace(/\./g, '') + t.slice(i); }
    const n = parseFloat(t);
    return isFinite(n) ? n : null;
}

/** An amount with the trip's currency: $1,240 or $85.50. */
function vacMoneyText(plan, n) {
    const cents = Math.round(n * 100) % 100 !== 0;
    const cur = plan.currency == null ? '$' : plan.currency;
    return (n < 0 ? '−' : '') + cur + (/^[A-Za-z]{2,}$/.test(cur) ? ' ' : '') +
        Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 });
}

/** Every cost in the plan, from where it was typed: stays, parking, rentals, cruises, blocks, and lines of its own. */
function vacBudgetLines(plan) {
    const out = [], add = (x) => { if (String(x.text || '').trim()) out.push(Object.assign({ amount: vacMoney(x.text) }, x)); };
    (plan.stays || []).forEach(s => add({ src: 'stay', id: s.id, label: vacPlaceName(s.place) || 'Stay', cat: 'stay', date: s.inDate, at: s.inTime, text: s.cost, paid: !!s.paid, view: 'stay:stays' }));
    (plan.parking || []).forEach(pk => add({ src: 'parking', id: pk.id, label: 'Parking' + (pk.lot ? ' · ' + vacPlaceName(pk.lot) : ''), cat: 'travel', date: pk.fromDate, at: pk.fromTime, text: pk.cost, paid: !!pk.paid, view: 'travel:parking' }));
    (plan.rentals || []).forEach(r => add({ src: 'rental', id: r.id, label: 'Car rental' + (r.company ? ' · ' + r.company : ''), cat: 'travel', date: r.pickDate, at: r.pickTime, text: r.cost, paid: !!r.paid, view: 'travel:rental' }));
    (plan.cruises || []).forEach(c => add({ src: 'cruise', id: c.id, label: c.ship || 'Cruise', cat: 'cruise', date: c.boardDate, at: c.boardTime, text: c.cost, paid: !!c.paid, view: 'cruise' }));
    vacDates(plan).forEach(d => plan.days[d].blocks.slice().sort((a, b) => a.start - b.start).forEach(b => add({ src: 'block', id: b.id, label: vacBlockInfo(plan, b).title,
        cat: b.kind === 'food' ? 'food' : b.kind === 'activity' ? 'activity' : b.kind === 'rest' ? 'other' : 'travel', date: d, at: b.start, text: b.cost, paid: !!b.paid, view: d })));
    (plan.extras || []).forEach(x => out.push({ src: 'extra', id: x.id, label: x.label, cat: x.cat || 'other', date: x.date || '', text: x.cost, amount: vacMoney(x.cost), paid: !!x.paid, extra: true }));
    // By day, then by time; what has neither after.
    const at = (l) => l.at != null ? l.at : 1441;
    return out.sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999') || at(a) - at(b));
}

/** The totals: all, paid, to pay, by category, per person, and against the budget set. */
function vacBudgetTotals(plan) {
    const lines = vacBudgetLines(plan), counted = lines.filter(l => l.amount != null);
    const sum = (ls) => ls.reduce((t, l) => t + l.amount, 0);
    const total = sum(counted), paid = sum(counted.filter(l => l.paid));
    const byCat = VAC_BUDGET_CATS.map(c => ({ cat: c, total: sum(counted.filter(l => l.cat === c.id)) })).filter(x => x.total);
    const people = (plan.people || []).length, limit = vacMoney(plan.budget);
    return { lines, total, paid, toPay: total - paid, byCat, people, perPerson: people ? total / people : null, limit,
        left: limit != null ? limit - total : null, uncounted: lines.filter(l => l.amount == null) };
}

function vacBudgetSumHtml(plan) {
    const t = vacBudgetTotals(plan), m = (n) => vacMoneyText(plan, n);
    const pct = t.limit ? Math.min(100, Math.round(t.total / t.limit * 100)) : 0, over = t.left != null && t.left < 0;
    return '<div class="vac-bud-figs">' +
            '<div class="vac-bud-fig"><span>Total</span><b class="vac-bud-total">' + m(t.total) + '</b></div>' +
            '<div class="vac-bud-fig"><span>Paid</span><b class="vac-bud-paid">' + m(t.paid) + '</b></div>' +
            '<div class="vac-bud-fig"><span>To pay</span><b class="vac-bud-topay">' + m(t.toPay) + '</b></div>' +
            (t.perPerson != null ? '<div class="vac-bud-fig"><span>Per person (' + t.people + ')</span><b class="vac-bud-pp">' + m(t.perPerson) + '</b></div>' : '') +
            (t.limit != null ? '<div class="vac-bud-fig' + (over ? ' vac-bud-over' : '') + '"><span>' + (over ? 'Over budget' : 'Left') + '</span><b class="vac-bud-left">' + m(Math.abs(t.left)) + '</b></div>' : '') +
        '</div>' +
        (t.limit != null ? '<div class="vac-bud-bar' + (over ? ' vac-bud-over' : '') + '" title="' + vacEsc(m(t.total) + ' of ' + m(t.limit)) + '"><span style="width:' + pct + '%"></span></div>' : '') +
        (t.byCat.length ? '<div class="vac-bud-cats">' + t.byCat.map(x => '<span class="vac-bud-cat" data-cat="' + x.cat.id + '">' + x.cat.icon + ' ' + x.cat.label + ' <b>' + m(x.total) + '</b></span>').join('') + '</div>' : '') +
        (t.uncounted.length ? '<div class="vac-hint">Not counted, as no amount could be read: ' + t.uncounted.map(l => vacEsc(l.label) + ' (“' + vacEsc(l.text) + '”)').join(', ') + '.</div>' : '');
}

/** The Budget tab: the totals, then every cost, each ticked when paid; costs of its own added here. */
function vacBudgetHtml(plan) {
    const lines = vacBudgetLines(plan), dates = vacDates(plan);
    const catSel = (x) => '<select data-f="cat" onchange="vacExtraField(this)">' + VAC_BUDGET_CATS.map(c => '<option value="' + c.id + '"' + (c.id === x.cat ? ' selected' : '') + '>' + c.icon + ' ' + c.label + '</option>').join('') + '</select>';
    const dateSel = (x) => '<select data-f="date" onchange="vacExtraField(this)"><option value="">Any day</option>' + dates.map(d => '<option value="' + d + '"' + (d === x.date ? ' selected' : '') + '>' +
        vacEsc(vacDayLabel(d, 'short')) + '</option>').join('') + '</select>';
    const rows = lines.map(l => {
        const cat = VAC_BUDGET_CATS.find(c => c.id === l.cat) || VAC_BUDGET_CATS[5];
        const paid = '<input type="checkbox" class="vac-bud-paidbox" title="Paid"' + (l.paid ? ' checked' : '') + ' onchange="vacBudgetPaid(this)">';
        if (l.extra) return '<tr class="vac-bud-row vac-bud-extra" data-src="extra" data-id="' + vacEsc(l.id) + '"><td>' + paid + '</td>' +
            '<td><input data-f="label" value="' + vacEsc(l.label || '') + '" placeholder="Souvenirs, insurance…" onchange="vacExtraField(this)"></td>' +
            '<td>' + catSel(l) + '</td><td>' + dateSel(l) + '</td>' +
            '<td class="vac-bud-amt"><input data-f="cost" value="' + vacEsc(l.text || '') + '" placeholder="0" inputmode="decimal" onchange="vacExtraField(this)"></td>' +
            '<td><button class="vac-icon" onclick="vacExtraRemove(this)" title="Remove">×</button></td></tr>';
        return '<tr class="vac-bud-row" data-src="' + l.src + '" data-id="' + vacEsc(l.id) + '"><td>' + paid + '</td>' +
            '<td><button class="vac-link" data-view="' + vacEsc(l.view) + '" data-id="' + (l.src === 'block' ? vacEsc(l.id) : '') + '" onclick="vacGoTo(this)" title="Where it is set">' + vacEsc(l.label) + '</button></td>' +
            '<td>' + cat.icon + ' ' + cat.label + '</td><td>' + (l.date ? vacEsc(vacDayLabel(l.date, 'short')) : '') + '</td>' +
            '<td class="vac-bud-amt">' + (l.amount != null ? vacMoneyText(plan, l.amount) : '<span class="vac-hint">' + vacEsc(l.text) + '</span>') + '</td><td></td></tr>';
    }).join('');
    return '<div class="vac-sec">💰 Budget</div>' +
        '<div class="vac-row vac-bud-set"><label class="vac-inline">Currency <input class="vac-bud-cur" value="' + vacEsc(plan.currency == null ? '$' : plan.currency) + '" maxlength="4" onchange="vacBudgetSet(this)"></label>' +
            '<label class="vac-inline">Budget <input class="vac-bud-limit" value="' + vacEsc(plan.budget || '') + '" placeholder="None" inputmode="decimal" onchange="vacBudgetSet(this)"></label></div>' +
        '<div class="vac-bud-sum">' + vacBudgetSumHtml(plan) + '</div>' +
        (rows ? '<table class="vac-bud-table"><thead><tr><th title="Paid">✓</th><th>What</th><th>Category</th><th>Day</th><th class="vac-bud-amt">Amount</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>'
            : '<div class="vac-hint">No costs yet. Give a stay, parking, a rental, a cruise or a block a cost, or add one here.</div>') +
        '<button class="vac-btn vac-bud-add" onclick="vacExtraAdd(this)">+ Add cost</button>' +
        '<div class="vac-hint">The budget stays here: it is left out of the bullet list and the calendar.</div>';
}

/** The totals brought up to date, the fields left as they are, so the next one keeps the focus. */
function vacBudgetRefresh(el) {
    const w = vacGetWidget(el), box = w && w.querySelector('.vac-bud-sum');
    if (box) box.innerHTML = vacBudgetSumHtml(vacGetData(vacGetToolId(w)));
}

function vacBudgetSet(el) {
    vacMutate(el, (plan) => {
        if (el.classList.contains('vac-bud-cur')) plan.currency = el.value.trim();
        else plan.budget = el.value.trim();
    }, { draw: false });
    vacBudgetRefresh(el);
}

/** Paid, kept on the cost where it was typed. */
function vacBudgetPaid(box) {
    const row = box.closest('.vac-bud-row'), src = row.dataset.src, id = row.dataset.id;
    vacMutate(box, (plan) => {
        const lists = { stay: plan.stays, parking: plan.parking, rental: plan.rentals, cruise: plan.cruises, extra: plan.extras };
        const item = src === 'block' ? (vacFind(plan, id) || {}).block : (lists[src] || []).find(x => x.id === id);
        if (!item) return 'none';
        item.paid = box.checked;
    }, { draw: false });
    vacBudgetRefresh(box);
}

function vacExtraAdd(btn) {
    const widget = vacGetWidget(btn);
    vacMutate(btn, (plan) => { (plan.extras = plan.extras || []).push({ id: vacNewId('x'), label: '', cat: 'other', date: '', cost: '', paid: false }); });
    const rows = widget.querySelectorAll('.vac-bud-extra [data-f="label"]');
    if (rows.length) rows[rows.length - 1].focus();
}

function vacExtraRemove(btn) {
    const id = btn.closest('.vac-bud-row').dataset.id;
    vacMutate(btn, (plan) => { plan.extras = (plan.extras || []).filter(x => x.id !== id); });
}

function vacExtraField(el) {
    const id = el.closest('.vac-bud-row').dataset.id, k = el.dataset.f;
    vacMutate(el, (plan) => {
        const x = (plan.extras || []).find(e => e.id === id);
        if (!x) return 'none';
        x[k] = k === 'label' || k === 'cost' ? el.value.trim() : el.value;
    }, { draw: false });
    vacBudgetRefresh(el);
}

/** The Meals tab: the meals each new day starts with, and their times. */
function vacMealsHtml(plan) {
    const missing = vacDates(plan).filter(d => plan.meals.some(m => !plan.days[d].blocks.some(b => b.meal === m.key))).length;
    return '<div class="vac-sec">\uD83C\uDF7D\uFE0F Meals each day</div>' +
        '<div class="vac-meal-list">' + plan.meals.map(m => {
            const on = ' data-k="' + m.key + '" onchange="vacSetMeal(this)"';
            return '<div class="vac-meal-row" data-k="' + m.key + '"><span class="vac-meal-tag">' + m.key.toUpperCase() + '</span>' +
                '<input data-f="label" value="' + vacEsc(m.label) + '"' + on + '>' +
                '<input type="time" step="900" data-f="start" value="' + vacTimeValue(m.start) + '"' + on + '> \u2013 ' +
                '<input type="time" step="900" data-f="end" value="' + vacTimeValue(m.end) + '"' + on + '></div>';
        }).join('') + '</div>' +
        '<div class="vac-hint">Each new day starts with these. A meal still at its old time, on any day, moves to the new one; one moved by hand stays where it was put.</div>' +
        (missing ? '<div class="vac-hint">' + missing + (missing === 1 ? ' day is' : ' days are') + ' missing a meal: Restore meals, on that day, puts it back.</div>' : '');
}

/** A meal's default changes; on each day, that meal moves with it where it has not been moved. Saved without drawing, so the next field keeps the focus. */
function vacSetMeal(el) {
    vacMutate(el, (plan) => {
        const m = plan.meals.find(x => x.key === el.dataset.k);
        if (!m) return 'none';
        const old = Object.assign({}, m), f = el.dataset.f;
        if (f === 'label') m.label = el.value.trim() || old.label;
        else {
            const t = vacParseTime(el.value);
            if (t == null) return false;
            m[f] = t;
            if (m.end <= m.start) {
                if (f === 'start') m.end = Math.min(1440, m.start + (old.end - old.start));
                else m.start = Math.max(0, m.end - (old.end - old.start));
            }
        }
        Object.values(plan.days).forEach(day => day.blocks.forEach(b => {
            if (b.meal !== m.key) return;
            if (b.start === old.start && b.end === old.end) { b.start = m.start; b.end = m.end; }
            if (b.title === old.label) b.title = m.label;
        }));
    }, { draw: false });
    // A start past the end moved the end with it (or the other way): the row shows it.
    const row = el.closest('.vac-meal-row'), m = vacGetData(vacGetToolId(el)).meals.find(x => x.key === el.dataset.k);
    if (row && m) ['start', 'end'].forEach(f => { const x = row.querySelector('[data-f="' + f + '"]'); if (x !== el) x.value = vacTimeValue(m[f]); });
}

function vacRestoreMeals(btn) {
    vacMutate(btn, (plan) => {
        const day = plan.days[btn.closest('.vac-day').dataset.date];
        if (!day) return 'none';
        plan.meals.filter(m => !day.blocks.some(b => b.meal === m.key)).forEach(m =>
            day.blocks.push({ id: vacNewId(), title: m.label, kind: 'food', meal: m.key, start: m.start, end: m.end }));
    });
}

function vacView(btn) {
    vacMutate(btn, (plan, ui) => {
        ui.view = btn.dataset.view;
        if (ui.view === 'stay' && btn.dataset.sub) ui.stayTab = btn.dataset.sub;
        const f = vacFind(plan, ui.sel);
        if (!f || f.date !== ui.view) ui.sel = null;
        return false;
    });
}


function vacTripPick(el) {
    // The day of the column it is in: past midnight, the night before its own day.
    const col = el.closest('.vac-tday'), d = col ? col.dataset.date : el.dataset.date;
    vacMutate(el, (plan, ui) => { ui.view = d; ui.sel = el.dataset.id; return false; });
}

/**
 * In the Trip view: a block dragged moves, up and down to another time and across to
 * another day; its bottom edge dragged changes when it ends; clicked, its day opens
 * with it chosen.
 */
function vacTripDown(e) {
    if (e.button !== 0) return;
    const el = e.currentTarget, widget = vacGetWidget(el), toolId = vacGetToolId(el);
    const grid0 = el.closest('.vac-tday');
    if (!grid0) return;
    const plan = vacGetData(toolId), ui = vacUiOf(toolId), f = vacFind(plan, el.dataset.id);
    if (!f) return;
    e.preventDefault();
    // Held by the planner, not the block, which moves from one day's column to another.
    widget.setPointerCapture(e.pointerId);
    const b = f.block, px = +grid0.dataset.px || VAC_TRIP_PX;
    // Drawn past midnight in the column before its own day's: its times a day on.
    const off = f.date !== grid0.dataset.date ? 1 : 0, h0 = +grid0.dataset.h0 - off * 24;
    const mode = e.target.closest('.vac-b-resize') ? 'resize' : 'move';
    const x0 = e.clientX, y0 = e.clientY, orig = { start: b.start, end: b.end };
    const grids = Array.from(widget.querySelectorAll('.vac-tday'));
    const chain = mode === 'move' ? vacChainOf(plan, f.date, b) : [b], room = vacChainRoom(chain);
    const was = new Map(f.day.blocks.map(x => [x.id, { start: x.start, end: x.end }]));
    const elOf = (x) => x === b ? el : grid0.querySelector('.vac-block[data-id="' + x.id + '"]') || widget.querySelector('.vac-tday .vac-block[data-id="' + x.id + '"]');
    const placeOne = (x, xel) => {
        if (!xel) return;
        xel.style.top = ((x.start - h0 * 60) * px / 60) + 'px';
        xel.style.height = Math.max((x.end - x.start) * px / 60, 6) + 'px';
    };
    const snap = (m) => Math.round(m / VAC_SNAP) * VAC_SNAP;
    let moved = false, date = f.date, col = grid0.dataset.date;
    const place = () => {
        el.style.top = ((b.start - h0 * 60) * px / 60) + 'px';
        el.style.height = Math.max((b.end - b.start) * px / 60, 6) + 'px';
        el.title = vacTimeLabel(b.start) + '–' + vacTimeLabel(b.end) + ' · ' + vacDayLabel(date, 'short');
    };
    const move = (ev) => {
        const dx = ev.clientX - x0, dy = ev.clientY - y0;
        if (!moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
        if (!moved) { moved = true; widget.classList.add('vac-dragging'); el.classList.add('vac-tdrag'); el.style.left = '1px'; el.style.width = 'calc(100% - 3px)'; }
        const dm = snap(dy / px * 60);
        if (mode === 'resize') {
            b.end = Math.max(b.start + VAC_SNAP, Math.min(1440, orig.end + dm));
            vacChainSettle(plan);
            f.day.blocks.forEach(x => { const w = was.get(x.id); if (x !== b && w && (x.start !== w.start || x.end !== w.end)) placeOne(x, elOf(x)); });
        } else {
            const delta = Math.max(room.lo, Math.min(room.hi, dm));
            chain.forEach(x => { const w = was.get(x.id); x.start = w.start + delta; x.end = w.end + delta; });
            // Across: the day whose column the pointer is over, or the nearest; the chain goes with it.
            const g = grids.reduce((best, x) => {
                const r = x.getBoundingClientRect(), dist = ev.clientX < r.left ? r.left - ev.clientX : ev.clientX > r.right ? ev.clientX - r.right : 0;
                return !best || dist < best.dist ? { x, dist } : best;
            }, null);
            const els = chain.map(elOf);
            if (g && g.x.dataset.date !== col) { col = g.x.dataset.date; date = off ? vacAddDays(col, 1) : col; els.forEach(xel => { if (xel) g.x.appendChild(xel); }); }
            chain.forEach((x, i) => { if (x !== b) { placeOne(x, els[i]); if (els[i]) { els[i].style.left = '1px'; els[i].style.width = 'calc(100% - 3px)'; } } });
        }
        place();
    };
    const up = (ev) => {
        widget.removeEventListener('pointermove', move);
        widget.removeEventListener('pointerup', up);
        widget.removeEventListener('pointercancel', up);
        widget.classList.remove('vac-dragging');
        if (ev.type === 'pointercancel') { vacRender(widget); return; }
        if (!moved) { vacTripPick(el); return; }
        if (mode === 'move') {
            const delta = b.start - orig.start;
            chain.forEach(x => { const w = was.get(x.id); x.start = w.start; x.end = w.end; });
            vacChainMove(plan, f.date, b, delta, date !== f.date && plan.days[date] ? date : null);
        }
        if (b.kind === 'flight') {
            const fl = b.flight || (b.flight = {});
            if (fl.arriveDay > 0) b.end = 1440; else fl.arrive = b.end;
        }
        if (mode === 'resize' && b.end - b.start !== orig.end - orig.start) vacLengthByHand(plan, ui, f.date, b);
        ui.sel = b.id;
        vacSaveData(toolId, plan);
        vacRender(widget);
    };
    widget.addEventListener('pointermove', move);
    widget.addEventListener('pointerup', up);
    widget.addEventListener('pointercancel', up);
}

/** Where a block sits, while it is dragged. */
function vacPlaceBlock(el, b, h0) {
    const px = +(el.closest('.vac-grid') || {}).dataset.px || VAC_PX;
    el.style.top = ((b.start - h0 * 60) * px / 60) + 'px';
    el.style.height = Math.max((b.end - b.start) * px / 60, 14) + 'px';
    const time = el.querySelector('.vac-b-time');
    if (time) time.textContent = vacTimeLabel(b.start) + '–' + vacTimeLabel(b.end);
}

/**
 * On a day's grid: a block dragged moves, its bottom edge dragged changes when it
 * ends, and either clicked is chosen. Empty time clicked adds an hour's block there;
 * dragged down, a block as long as the drag.
 */
function vacGridDown(e) {
    if (e.button !== 0) return;
    const grid = e.currentTarget, widget = vacGetWidget(grid), toolId = vacGetToolId(grid);
    const h0 = +grid.dataset.h0, h1 = +grid.dataset.h1 || 24, date = grid.dataset.date;
    const plan = vacGetData(toolId), ui = vacUiOf(toolId), day = plan.days[date];
    if (!day) return;
    const next = vacAddDays(date, 1);
    const blockEl = e.target.closest('.vac-block');
    // A block past midnight is the next day's: its times are its own day's, drawn a day on.
    const bdate = blockEl ? blockEl.dataset.date || date : date, bday = plan.days[bdate];
    const b = blockEl && bday && bday.blocks.find(x => x.id === blockEl.dataset.id);
    if (blockEl && !b) return;
    const hb = bdate !== date ? h0 - 24 : h0;
    const rect = grid.getBoundingClientRect();
    const px = +grid.dataset.px || VAC_PX;
    const minAt = (y) => h0 * 60 + (y - rect.top) / px * 60;
    const snap = (m) => Math.round(m / VAC_SNAP) * VAC_SNAP;
    const mode = !b ? 'create' : e.target.closest('.vac-b-resize') ? 'resize' : 'move';
    const y0 = e.clientY;
    const first = Math.max(0, Math.min(h1 * 60 - VAC_SNAP, Math.floor(minAt(y0) / VAC_SNAP) * VAC_SNAP));
    // Made past midnight: on the next day, if the trip has it.
    const toNext = !b && first >= 1440;
    if (toNext && !plan.days[next]) return;
    const cap = toNext ? Math.min(h1 * 60, 2880) : 1440;
    e.preventDefault();
    grid.setPointerCapture(e.pointerId);
    const orig = b ? { start: b.start, end: b.end } : { start: first, end: Math.min(cap, first + 60) };
    // The blocks linked to it, where they were; and every block's, for what follows a resize.
    const chain = b && mode === 'move' ? vacChainOf(plan, bdate, b) : b ? [b] : [];
    const room = vacChainRoom(chain.length ? chain : [orig]);
    const was = new Map((bday || day).blocks.map(x => [x.id, { start: x.start, end: x.end }]));
    const redraw = () => (bday || day).blocks.forEach(x => {
        const w = was.get(x.id), xel = grid.querySelector('.vac-block[data-id="' + x.id + '"]');
        if (xel && (x === b || x.start !== w.start || x.end !== w.end)) vacPlaceBlock(xel, x, hb);
    });
    let moved = false, ghost = null;
    const move = (ev) => {
        const dy = ev.clientY - y0;
        if (!moved && Math.abs(dy) < 4) return;
        moved = true;
        widget.classList.add('vac-dragging');
        const dm = snap(dy / px * 60);
        if (mode === 'move') {
            const delta = Math.max(room.lo, Math.min(room.hi, dm));
            chain.forEach(x => { const w = was.get(x.id); x.start = w.start + delta; x.end = w.end + delta; });
            redraw();
        } else if (mode === 'resize') {
            b.end = Math.max(b.start + VAC_SNAP, Math.min(1440, orig.end + dm));
            vacChainSettle(plan);
            redraw();
        } else {
            if (!ghost) {
                ghost = document.createElement('div');
                ghost.className = 'vac-block vac-ghost';
                ghost.innerHTML = '<div class="vac-b-time"></div>';
                ghost.style.left = '1px';
                ghost.style.width = 'calc(100% - 3px)';
                grid.querySelector('.vac-lane').appendChild(ghost);
            }
            orig.end = Math.max(orig.start + VAC_SNAP, Math.min(cap, snap(minAt(ev.clientY))));
            vacPlaceBlock(ghost, orig, h0);
        }
    };
    const up = (ev) => {
        grid.removeEventListener('pointermove', move);
        grid.removeEventListener('pointerup', up);
        grid.removeEventListener('pointercancel', up);
        widget.classList.remove('vac-dragging');
        if (ev.type === 'pointercancel') { vacRender(widget); return; }
        if (mode === 'create') {
            const off = toNext ? 1440 : 0, to = toNext ? plan.days[next] : day;
            const nb = { id: vacNewId(), title: '', kind: 'activity', start: orig.start - off, end: Math.min(1440, Math.min(cap, orig.end) - off) };
            if (nb.end <= nb.start) nb.start = nb.end - VAC_SNAP;
            to.blocks.push(nb);
            ui.sel = nb.id;
            vacSaveData(toolId, plan);
            vacRender(widget);
            const title = widget.querySelector('.vac-form [data-f="title"]');
            if (title) title.focus();
            return;
        }
        ui.sel = b.id;
        if (moved && mode === 'move') {
            // Moved for real from where it was, with the rest of its chain.
            const delta = b.start - orig.start;
            chain.forEach(x => { const w = was.get(x.id); x.start = w.start; x.end = w.end; });
            vacChainMove(plan, bdate, b, delta);
        }
        if (moved && b.kind === 'flight') {
            const fl = b.flight || (b.flight = {});
            if (fl.arriveDay > 0) b.end = 1440; else fl.arrive = b.end;
        }
        if (moved && mode === 'resize' && b.end - b.start !== orig.end - orig.start) vacLengthByHand(plan, ui, bdate, b);
        if (moved) vacSaveData(toolId, plan);
        vacRender(widget);
    };
    grid.addEventListener('pointermove', move);
    grid.addEventListener('pointerup', up);
    grid.addEventListener('pointercancel', up);
}

/** A field of the chosen block. The panel stays as it is, so moving on to the next field keeps its place. */
function vacEditField(el) {
    const k = el.dataset.f, v = el.type === 'checkbox' ? el.checked : el.value;
    const form = el.closest('.vac-form');
    // From the side panel only the day is drawn again; from a card in Travel nothing is,
    // so the next field keeps the focus.
    const inSide = !!el.closest('.vac-side');
    let full = false;
    vacMutate(el, (plan, ui) => {
        const f = vacFind(plan, form.dataset.id);
        if (!f) return 'none';
        const b = f.block;
        if (k === 'title') b.title = v.trim();
        else if (k === 'kind') {
            b.kind = v;
            if (v === 'flight') { b.flight = b.flight || { arrive: b.end, arriveDay: 0 }; vacFlightEnd(b); }
            if (v === 'drive' && !b.drive) b.drive = { from: vacCopyPlace(vacDayHome(plan, f.date)), to: vacCopyPlace(b.place), stops: [] };
            full = true;
        } else if (/^f_/.test(k)) {
            const fl = b.flight || (b.flight = {});
            if (k === 'f_arrive') { const t = vacParseTime(v); if (t == null) return 'none'; fl.arrive = t; }
            else if (k === 'f_checkinH' || k === 'f_bagMin' || k === 'f_gateMin') fl[k.slice(2)] = +v || 0;
            else if (k === 'f_arriveDay') fl.arriveDay = +v || 0;
            else fl[k.slice(2)] = v.trim();
            vacFlightEnd(b);
        } else if (k === 'd_from' || k === 'd_to') {
            const dr = b.drive || (b.drive = { stops: [] });
            dr[k.slice(2)] = vacResolvePlace(plan, v);
        } else if (k === 'd_stop') {
            const dr = b.drive || (b.drive = { stops: [] }), i = +el.dataset.i;
            dr.stops = dr.stops || [];
            dr.stops[i] = vacResolvePlace(plan, v);
            if (!dr.stops[i]) { dr.stops.splice(i, 1); full = true; }
        } else if (k === 'lead') plan.airportLead = +v;
        else if (k === 'breakEvery') plan.breakEvery = +v;
        else if (k === 'date') {
            if (v === f.date || !plan.days[v]) return 'none';
            vacChainMove(plan, f.date, b, 0, v);
            if (inSide) ui.view = v;
            full = true;
        } else if (k === 'start' || k === 'end') {
            let t = vacParseTime(v);
            if (t == null) return 'none';
            const len = b.end - b.start;
            if (k === 'start' && vacChainOf(plan, f.date, b).length > 1) {
                // Linked: the start moves it, and its chain, keeping how long it is.
                vacChainMove(plan, f.date, b, t - b.start);
                if (b.kind === 'flight') vacFlightEnd(b);
            } else if (k === 'start') {
                b.start = Math.min(t, 1440 - VAC_SNAP);
                if (b.end <= b.start) b.end = Math.min(1440, b.start + len);
                if (b.kind === 'flight') vacFlightEnd(b);
            } else {
                if (t === 0) t = 1440;
                b.end = Math.max(t, VAC_SNAP);
                if (b.end <= b.start) b.start = Math.max(0, b.end - len);
            }
            if (b.end - b.start !== len) vacLengthByHand(plan, ui, f.date, b);
        } else if (k === 'plabel' || k === 'paddress') {
            const p = b.place ? vacCopyPlace(b.place) : { label: '', address: '' };
            if (k === 'plabel') {
                vacRenamePlace(p, v.trim());
                const known = vacStayPlaces(plan).concat(plan.places).find(x => x && x.label && x.label.toLowerCase() === p.label.toLowerCase());
                if (known && !p.address && !p.url) Object.assign(p, vacCopyPlace(known), { label: known.label });
            } else {
                const got = vacParsePlace(v) || { label: '', address: '' };
                delete p.url; delete p.lat; delete p.lng;
                p.address = got.address || '';
                if (got.url) p.url = got.url;
                if (got.lat != null) { p.lat = got.lat; p.lng = got.lng; }
                if (!p.label && got.label) p.label = got.label;
            }
            b.place = p.label || p.address || p.url ? p : null;
        } else if (k === 'notes') b.notes = v;
        else if (k === 'cost') b.cost = v.trim();
        else if (k === 'done') b.done = !!v;
        else return 'none';
    }, inSide ? { side: false } : { draw: false });
    const widget = vacGetWidget(el) || document.querySelector('.vac-widget');
    if (full) { vacRender(widget); return; }
    // What the edit changed in the panel itself.
    const toolId = vacGetToolId(form), plan = vacGetData(toolId), f = vacFind(plan, form.dataset.id);
    if (!f) return;
    const set = (key, value) => { const x = form.querySelector('[data-f="' + key + '"]'); if (x && x !== el) x.value = value; };
    set('start', vacTimeValue(f.block.start));
    set('end', vacTimeValue(f.block.end));
    const title = form.querySelector('[data-f="title"]');
    if (title) title.placeholder = vacBlockInfo(plan, f.block).auto;
    if (k === 'plabel' || k === 'paddress') {
        const p = f.block.place || {};
        set('plabel', p.label || '');
        set('paddress', p.address || p.url || '');
    }
    if (k === 'd_from' || k === 'd_to') set(k, vacPlaceInput(f.block.drive[k.slice(2)]));
    // Only when they change, so a click on one that ended the edit still lands.
    const links = form.querySelector('.vac-form-links');
    if (links) {
        const next = document.createElement('div');
        next.innerHTML = vacFormLinksHtml(plan, f.block);
        if (next.innerHTML !== links.innerHTML) links.innerHTML = next.innerHTML;
    }
    const fcheck = form.querySelector('.vac-fcheck');
    if (fcheck && f.block.kind === 'flight') {
        const t = vacFlightTimes(f.date, f.block), spans = fcheck.querySelectorAll('.vac-row');
        [[t.online, true], [t.bag], [t.gate]].forEach(([x, withDay], i) => {
            const row = spans[i]; if (!row) return;
            let s = row.querySelector('.vac-ftime');
            if (!x) { if (s) s.remove(); return; }
            if (!s) { s = document.createElement('span'); s.className = 'vac-ftime'; row.appendChild(document.createTextNode(' ')); row.appendChild(s); }
            s.textContent = (withDay ? vacDayLabel(x.date, 'short') + ' ' : '') + vacTimeLabel(x.at);
        });
    }
    const travel = form.querySelector('.vac-btravel');
    if (travel) {
        const next = document.createElement('div');
        next.innerHTML = vacBlockTravelHtml(plan, f.date, f.block, vacUiOf(toolId));
        if (next.innerHTML !== travel.innerHTML) travel.innerHTML = next.innerHTML;
    }
}

/** A drive to the airport, ending when you should be there: from where you're staying, when that is known. */
function vacAirportDrive(btn) {
    vacMutate(btn, (plan, ui) => {
        const f = vacFind(plan, btn.closest('.vac-form').dataset.id);
        if (!f) return 'none';
        const fl = f.block.flight || {};
        const end = Math.max(VAC_SNAP, f.block.start - plan.airportLead);
        const nb = { id: vacNewId(), title: 'To the airport', kind: 'drive', start: Math.max(0, end - 60), end,
            drive: { from: vacCopyPlace(vacDayHome(plan, f.date)), to: vacAirportPlace(fl.from), stops: [] } };
        f.day.blocks.push(nb);
        ui.sel = nb.id;
    });
}

function vacStopAdd(btn) {
    const id = btn.closest('.vac-form').dataset.id, widget = vacGetWidget(btn);
    vacMutate(btn, (plan) => {
        const f = vacFind(plan, id);
        if (!f) return 'none';
        const dr = f.block.drive || (f.block.drive = { stops: [] });
        (dr.stops = dr.stops || []).push(null);
    });
    const stops = widget.querySelectorAll('.vac-form [data-f="d_stop"]');
    if (stops.length) stops[stops.length - 1].focus();
}

function vacStopRemove(btn) {
    const id = btn.closest('.vac-form').dataset.id;
    vacMutate(btn, (plan) => {
        const f = vacFind(plan, id);
        if (!f || !f.block.drive) return 'none';
        f.block.drive.stops.splice(+btn.dataset.i, 1);
    });
}

function vacDeleteBlock(btn) {
    vacMutate(btn, (plan, ui) => {
        const f = vacFind(plan, btn.closest('.vac-form').dataset.id);
        if (!f) return 'none';
        f.day.blocks.splice(f.index, 1);
        ui.sel = null;
    });
}

function vacSavePlace(btn) {
    vacMutate(btn, (plan) => {
        const f = vacFind(plan, btn.closest('.vac-form').dataset.id);
        if (!f || !f.block.place) return 'none';
        plan.places.push(Object.assign({ id: vacNewId('p') }, vacCopyPlace(f.block.place)));
    });
}

function vacAddPlace(el) {
    const box = el.closest('.vac-add-place');
    const label = box.querySelector('.vac-np-label').value.trim(), addr = box.querySelector('.vac-np-addr').value;
    vacMutate(el, (plan) => {
        const p = vacParsePlace(addr) || { label: '', address: '' };
        if (label) p.label = label;
        if (!p.label && !p.address && !p.url) return 'none';
        plan.places.push(Object.assign({ id: vacNewId('p') }, vacCopyPlace(p)));
    });
}

function vacPlaceKey(input, e) { if (e.key === 'Enter') { e.preventDefault(); vacAddPlace(input); } }

function vacRemovePlace(btn) {
    vacMutate(btn, (plan) => { plan.places.splice(+btn.dataset.i, 1); });
}

/** A car rental's card: who, what, where and when it is picked up and returned, the booking. */
function vacRentalCardHtml(plan, r, i, toolId) {
    const on = ' onchange="vacRentalField(this)"';
    const field = (label, key, extra) => '<label>' + label + '<input data-f="' + key + '" value="' + vacEsc(r[key] || '') + '"' + (extra || '') + on + '></label>';
    const place = (label, key, ph) => '<label class="vac-wide">' + label + '<input data-f="' + key + '" list="vac-places-' + vacEsc(toolId || '') +
        '" value="' + vacEsc(vacPlaceInput(r[key])) + '" placeholder="' + ph + '"' + on + '></label>';
    const date = (key) => '<input type="date" data-f="' + key + '" value="' + vacEsc(r[key] || '') + '"' + on + '>';
    const time = (key) => '<input type="time" step="900" data-f="' + key + '" value="' + (r[key] != null ? vacTimeValue(r[key]) : '') + '"' + on + '>';
    return '<div class="vac-tcard vac-rental-card vac-form" data-i="' + i + '">' +
        '<div class="vac-row">' + field('Company', 'company', ' placeholder="Example Rentals"') + field('Car', 'car', ' placeholder="Compact SUV"') + '</div>' +
        place('Pick up at', 'pickPlace', 'The counter: address, Maps link or a saved place') +
        '<div class="vac-row"><label>Pick up' + date('pickDate') + '</label><label>&nbsp;' + time('pickTime') + '</label></div>' +
        place('Return to', 'dropPlace', 'Where it was picked up') +
        '<div class="vac-row"><label>Return' + date('dropDate') + '</label><label>&nbsp;' + time('dropTime') + '</label></div>' +
        '<div class="vac-row">' + field('Confirmation', 'conf') + field('Cost', 'cost') + '</div>' +
        '<label>Notes<textarea data-f="notes" rows="2"' + on + '>' + vacEsc(r.notes || '') + '</textarea></label>' +
        '<div class="vac-row vac-rental-schedrow">' + vacRentalSchedHtml(plan, r) + '</div>' +
        '<div class="vac-row"><span class="vac-row vac-rental-links">' + vacRentalLinksHtml(r) + '</span><span class="vac-out-gap"></span>' +
            '<button class="vac-btn vac-danger" onclick="vacRentalRemove(this)">Remove</button></div>' +
        '</div>';
}

/** A rental's pick-up or return on the schedule: one made by getting there, or by its card. */
function vacRentalBlock(plan, r, at) {
    for (const d of Object.keys(plan.days)) {
        const b = plan.days[d].blocks.find(x => (x.rental === r.id && x.rentalAt === at) || (x.leg && x.rentalId === r.id && (at === 'pick' ? /:pickup$/ : /:return$/).test(x.leg)));
        if (b) return { date: d, block: b };
    }
    return null;
}

function vacRentalSchedHtml(plan, r) {
    const btn = (at, label) => {
        const on = vacRentalBlock(plan, r, at), date = r[at + 'Date'];
        if (on) return '<span class="vac-jstate" title="On the schedule, following this card">✓ ' + label + ' on the schedule</span>';
        return date && plan.days[date] ? '<button class="vac-btn vac-rental-sched" data-at="' + at + '" onclick="vacRentalSchedule(this)">📅 ' + label + ' on the schedule</button>' : '';
    };
    return btn('pick', 'Pick-up') + btn('drop', 'Return');
}

/** The block for a pick-up (half an hour) or a return (a quarter), at the card's day and time. */
function vacRentalSchedule(btn) {
    const i = +btn.closest('.vac-rental-card').dataset.i, at = btn.dataset.at;
    vacMutate(btn, (plan) => {
        const r = (plan.rentals || [])[i];
        if (!r || !plan.days[r[at + 'Date']] || vacRentalBlock(plan, r, at)) return 'none';
        const start = r[at + 'Time'] != null ? r[at + 'Time'] : 600, len = at === 'pick' ? 30 : 15;
        plan.days[r[at + 'Date']].blocks.push({ id: vacNewId(), kind: 'travel', rental: r.id, rentalAt: at, start, end: Math.min(1440, start + len),
            title: (at === 'pick' ? 'Pick up the rental car' : 'Return the rental car') + (r.company ? ' · ' + r.company : ''),
            place: vacCopyPlace(at === 'pick' ? r.pickPlace : (r.dropPlace || r.pickPlace)) });
    }, { draw: false });
    const card = btn.closest('.vac-rental-card'), plan = vacGetData(vacGetToolId(card)), r = (plan.rentals || [])[i];
    if (r) card.querySelector('.vac-rental-schedrow').innerHTML = vacRentalSchedHtml(plan, r);
}

/** A rental's blocks follow its card: the day, the time (keeping their length) and the place. */
function vacRentalFollow(plan, r) {
    ['pick', 'drop'].forEach(at => {
        const f = vacRentalBlock(plan, r, at);
        if (!f || f.block.leg) return;
        const b = f.block, len = b.end - b.start, date = r[at + 'Date'];
        if (r[at + 'Time'] != null) { b.start = r[at + 'Time']; b.end = Math.min(1440, b.start + len); }
        const p = at === 'pick' ? r.pickPlace : (r.dropPlace || r.pickPlace);
        b.place = vacCopyPlace(p);
        b.title = (at === 'pick' ? 'Pick up the rental car' : 'Return the rental car') + (r.company ? ' · ' + r.company : '');
        if (date && date !== f.date && plan.days[date]) {
            plan.days[f.date].blocks = plan.days[f.date].blocks.filter(x => x !== b);
            plan.days[date].blocks.push(b);
        }
    });
}

function vacRentalLinksHtml(r) {
    const a = (p, label) => { const url = vacPlaceUrl(p); return url ? '<a class="vac-btn" href="' + vacEsc(url) + '" target="_blank" rel="noopener noreferrer">📍 ' + label + '</a>' : ''; };
    return a(r.pickPlace, 'Pick-up') + (r.dropPlace ? a(r.dropPlace, 'Return') : '');
}

/** A rental starts on the trip's first day and ends on its last. */
function vacRentalAdd(btn) {
    const widget = vacGetWidget(btn);
    vacMutate(btn, (plan) => {
        const dates = vacDates(plan);
        (plan.rentals = plan.rentals || []).push({ id: vacNewId('r'), company: '', car: '', pickPlace: null, pickDate: dates[0] || '', pickTime: null,
            dropPlace: null, dropDate: dates[dates.length - 1] || '', dropTime: null, conf: '', cost: '', notes: '' });
    });
    const names = widget.querySelectorAll('.vac-rental-card [data-f="company"]');
    if (names.length) names[names.length - 1].focus();
}

function vacRentalRemove(btn) {
    const i = +btn.closest('.vac-rental-card').dataset.i;
    vacMutate(btn, (plan) => { (plan.rentals || []).splice(i, 1); });
}

/** A field of a rental: saved, the card left as it is so the next field keeps the focus. */
function vacRentalField(el) {
    const card = el.closest('.vac-rental-card'), i = +card.dataset.i, k = el.dataset.f;
    vacMutate(el, (plan) => {
        const r = (plan.rentals || [])[i];
        if (!r) return 'none';
        if (k === 'pickPlace' || k === 'dropPlace') r[k] = vacResolvePlace(plan, el.value);
        else if (k === 'pickTime' || k === 'dropTime') r[k] = el.value ? vacParseTime(el.value) : null;
        else r[k] = k === 'notes' ? el.value : el.value.trim();
        vacRentalFollow(plan, r);
    }, { draw: false });
    const r = (vacGetData(vacGetToolId(card)).rentals || [])[i];
    if (!r) return;
    const links = card.querySelector('.vac-rental-links'), next = document.createElement('span');
    next.innerHTML = vacRentalLinksHtml(r);
    if (next.innerHTML !== links.innerHTML) links.innerHTML = next.innerHTML;
    const sched = card.querySelector('.vac-rental-schedrow'), html = vacRentalSchedHtml(vacGetData(vacGetToolId(card)), r);
    if (sched && sched.innerHTML !== html) sched.innerHTML = html;
}

function vacParkAdd(btn) {
    vacMutate(btn, (plan) => {
        const dates = vacDates(plan);
        (plan.parking = plan.parking || []).push({ id: vacNewId('k'), lot: null, fromDate: dates[0] || '', fromTime: null,
            toDate: dates[dates.length - 1] || '', toTime: null, conf: '', cost: '', spot: '' });
    });
}

function vacParkRemove(btn) {
    const i = +btn.closest('.vac-park').dataset.i;
    vacMutate(btn, (plan) => { (plan.parking || []).splice(i, 1); });
}

/** A field of a parking booking: saved, the form left as it is so the next field keeps the focus. */
function vacParkField(el) {
    const box = el.closest('.vac-park'), i = +box.dataset.i, k = el.dataset.f;
    vacMutate(el, (plan) => {
        const pk = (plan.parking || [])[i];
        if (!pk) return 'none';
        if (k === 'lot') pk.lot = vacResolvePlace(plan, el.value);
        else if (k === 'fromTime' || k === 'toTime') pk[k] = el.value ? vacParseTime(el.value) : null;
        else pk[k] = el.value.trim();
    }, { draw: false });
    if (k === 'lot') {
        const toolId = vacGetToolId(box), pk = (vacGetData(toolId).parking || [])[i], url = pk && vacPlaceUrl(pk.lot);
        const links = box.querySelector('.vac-park-links');
        const html = url ? '<a class="vac-btn" href="' + vacEsc(url) + '" target="_blank" rel="noopener noreferrer">📍 Open in Maps</a>' : '';
        const next = document.createElement('div');
        next.innerHTML = html;
        if (next.innerHTML !== links.innerHTML) links.innerHTML = next.innerHTML;
    }
}

function vacPickList(btn) { vacMutate(btn, (plan, ui) => { ui.list = btn.dataset.list; return false; }); }

/** The items of a list, by its id: 'day' is the day being looked at. */
function vacItemsOf(plan, ui, id) {
    if (/^day:/.test(id)) { const d = plan.days[id.slice(4)]; return d ? d.list : null; }
    const l = plan.lists.find(x => x.id === id);
    return l ? l.items : null;
}

/** From a day, its own list in the Lists tab. */
function vacOpenDayList(btn) {
    vacMutate(btn, (plan, ui) => { ui.view = 'lists'; ui.list = 'day:' + btn.dataset.date; return false; });
}

/**
 * The clothes table, counted, into the Packing list: "Shorts × 3". An item
 * already there by that name is updated rather than added again, and one this put
 * there that is no longer worn goes, unless it was ticked.
 */
function vacClothesToPacking(btn) {
    vacMutate(btn, (plan, ui) => {
        const tally = new Map();
        vacDates(plan).forEach(d => plan.days[d].outfits.forEach(r => plan.clothesTypes.forEach(ty => {
            const name = ((r.items[ty.id] || {}).text || '').trim(), who = vacPerson(plan, r.who) ? r.who : '';
            if (!name) return;
            const key = who + '|' + name.toLowerCase();
            const t = tally.get(key) || { name, who, n: 0 };
            t.n++;
            tally.set(key, t);
        })));
        let pack = plan.lists.find(l => l.name.toLowerCase() === 'packing');
        if (!pack) { pack = { id: vacNewId('l'), name: 'Packing', items: [] }; plan.lists.unshift(pack); }
        const base = (text) => text.replace(/\s*×\s*\d+$/, '').trim().toLowerCase();
        // Kept before there were people: a key that is the name alone is everyone's.
        pack.items.forEach(it => { if (it.clothes && it.clothes.indexOf('|') < 0) it.clothes = '|' + it.clothes; });
        pack.items = pack.items.filter(it => !it.clothes || tally.has(it.clothes) || it.done);
        tally.forEach((t, key) => {
            const person = vacPerson(plan, t.who);
            const text = (t.n > 1 ? t.name + ' × ' + t.n : t.name) + (person ? ' (' + vacWhoName(person) + ')' : '');
            const it = pack.items.find(x => x.clothes === key) || (!t.who && pack.items.find(x => !x.clothes && base(x.text) === t.name.toLowerCase()));
            if (it) { it.text = text; it.clothes = key; } else pack.items.push({ text, done: false, clothes: key });
        });
        ui.list = pack.id;
    });
}

function vacAddList(btn) {
    const name = (window.prompt('Name the new list') || '').trim();
    if (!name) return;
    vacMutate(btn, (plan, ui) => {
        const id = vacNewId('l');
        plan.lists.push({ id, name, items: [] });
        ui.list = id;
    });
}

function vacRenameList(btn) {
    const id = btn.closest('.vac-list').dataset.list;
    vacMutate(btn, (plan) => {
        const l = plan.lists.find(x => x.id === id);
        const name = l && (window.prompt('Name the list', l.name) || '').trim();
        if (!name) return 'none';
        l.name = name;
    });
}

function vacDeleteList(btn) {
    const id = btn.closest('.vac-list').dataset.list;
    vacMutate(btn, (plan, ui) => {
        const i = plan.lists.findIndex(x => x.id === id);
        if (i < 0) return 'none';
        if (plan.lists[i].items.length && !window.confirm('Delete “' + plan.lists[i].name + '” and its ' + plan.lists[i].items.length + ' items?')) return 'none';
        plan.lists.splice(i, 1);
        ui.list = null;
    });
}

function vacItemToggle(cb) {
    const id = cb.closest('.vac-list').dataset.list, i = +cb.closest('.vac-item').dataset.i;
    vacMutate(cb, (plan, ui) => {
        const items = vacItemsOf(plan, ui, id);
        if (!items || !items[i]) return 'none';
        items[i].done = cb.checked;
    });
}

function vacItemRemove(btn) {
    const id = btn.closest('.vac-list').dataset.list, i = +btn.closest('.vac-item').dataset.i;
    vacMutate(btn, (plan, ui) => {
        const items = vacItemsOf(plan, ui, id);
        if (!items || !items[i]) return 'none';
        items.splice(i, 1);
    });
}

function vacItemKey(input, e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const text = input.value.trim(), id = input.closest('.vac-list').dataset.list, widget = vacGetWidget(input);
    if (!text) return;
    vacMutate(input, (plan, ui) => {
        const items = vacItemsOf(plan, ui, id);
        if (!items) return 'none';
        items.push({ text, done: false });
        ui.list = id;
    });
    const next = widget.querySelector('.vac-item-new');
    if (next) next.focus();
}

/** An item's text, as typed, to change: Enter or leaving it keeps it, Escape puts it back, emptied it goes. */
function vacItemEdit(span) {
    const id = span.closest('.vac-list').dataset.list, i = +span.closest('.vac-item').dataset.i;
    const widget = vacGetWidget(span), toolId = vacGetToolId(span);
    const items = vacItemsOf(vacGetData(toolId), vacUiOf(toolId), id);
    if (!items || !items[i]) return;
    const input = document.createElement('input');
    input.className = 'vac-item-edit';
    input.value = items[i].text;
    span.replaceWith(input);
    input.focus();
    let finished = false;
    const finish = (keep) => {
        if (finished) return;
        finished = true;
        if (!keep) { vacRender(widget); return; }
        const text = input.value.trim();
        vacMutate(widget, (plan, ui) => {
            const list = vacItemsOf(plan, ui, id);
            if (!list || !list[i]) return false;
            if (text) list[i].text = text; else list.splice(i, 1);
        });
    };
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); finish(true); }
        else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); }
    });
    input.addEventListener('blur', () => finish(true));
}

function vacInit() {
    document.querySelectorAll('.vac-widget').forEach(widget => {
        if (widget.dataset.inited || !vacGetToolId(widget)) return;
        widget.dataset.inited = '1';
        vacRender(widget);
        if (window.ResizeObserver) {
            let last = 0, timer = null;
            new ResizeObserver(() => {
                const h = widget.clientHeight;
                if (!widget.isConnected || Math.abs(h - last) < 4) return;
                last = h;
                clearTimeout(timer);
                timer = setTimeout(() => { if (widget.isConnected && !widget.querySelector('.vac-main input:focus, .vac-side input:focus, .vac-side textarea:focus')) vacRender(widget); }, 120);
            }).observe(widget);
        }
    });
}

(function injectScriptsForExport() {
    if (document.getElementById('productivity-tools-scripts')) return;

    var pomoFunctions = [initPomodoro, getModeLabel, getModeClass, getDurationForMode, playPomodoroBeep, advancePomodoroMode, togglePomodoro, resetPomodoro, skipPomodoro, togglePomodoroSettings, applyPomodoroSettings, updatePomodoroDisplay];
    var ucFunctions = [ucGetToolId, ucGetData, ucSaveData, ucInit, ucRenderCategories, ucRenderSelects, ucSetCategory, ucOnInput, ucOnUnitChange, ucSwap, ucConvertTemp, ucFormatNumber, ucConvert];
    var pbsFunctions = [pbsSpeedLabel, pbsToFraction, pbsFmtDuration, pbsGetTotalSeconds, pbsGetSpeed, pbsCalc, pbsSetSpeed, pbsRangeChanged, pbsInit];
    var calendarFunctions = [calendarGetToolId, calendarGetData, calendarSaveData, calendarInit, calendarFetchICS, calendarRefreshSubscriptions, calendarBuildLegendHtml, calendarToggleCalendar, calendarRender, calendarRenderMonth, calendarGetEventsForDate, calendarCountByType, calendarCountTotal, calendarSaveViewState, calendarPrevYear, calendarNextYear, calendarSetView, calendarPrevMonth, calendarNextMonth, calendarGoToMonth, calendarGoToToday, calendarRenderMonthView, calendarShowDayEvents, calendarOpenManage, calendarCloseManage, calendarSelectColor, calendarRenderManageList, calendarSaveName, calendarPickColor, calendarApplyColor, calendarSaveUrl, calendarMoveCalendar, calendarAddCalendar, calendarAddEvent, calendarAddEventFromDay, calendarDeleteEvent, calendarRemoveCalendar, calendarHandleFileImport, calendarImportFromUrl, calendarImportICS, parseICSContent, parseICSDate, fromTimezoneToUTC, toLocalISOString, expandRRULE];
    var pickerFunctions = [pickerGetToolId, pickerGetData, pickerSaveData, pickerInit, pickerRender, pickerAddItem, pickerRemoveItem, pickerSpin, pickerDrawWheel];
    var diceFunctions = [diceGetWidget, diceGetToolId, diceRenderFace, diceChangeCount, diceRoll, diceAddHistory, diceRollerInit];
    var swFunctions = [swGetWidget, swGetToolId, swGetState, swFormatTime, swUpdateDisplay, swTick, swToggle, swLap, swReset, swRenderLaps, stopwatchInit];
    var ytFunctions = [ytembedGetWidget, ytembedGetToolId, ytembedExtractId, ytembedParseTimestamp, ytembedLoad, ytembedSaveState, ytembedInit];
    var kbFunctions = [kbGetToolId, kbGetData, kbSaveData, kbRender, kbEsc, kbTagColor, kbAddColumn, kbShowAddForm, kbAddFormKey, kbAddCard, kbCancelAdd, kbEditColTitle, kbColMenu, kbEditCard, kbSaveCard, kbDeleteCard, kbCardDragStart, kbCardDragOver, kbCardDragLeave, kbCardDrop, kbColDragStart, kbColDragOver, kbColDragLeave, kbColDrop, kbAIText, kbAITarget, kbAICleanCards, kbAICardsPreview, kbAIApply, kbInit];
    var breathingFunctions = [breathingGetWidget, breathingGetToolId, breathingGetState, breathingInit, breathingToggle, breathingReset, breathingTick, breathingAdvancePhase, breathingUpdateDisplay, breathingSetPreset, breathingApplySettings, breathingToggleSettings];
    var wcFunctions = [wcBuildSearchIndex, wcGetWidget, wcGetToolId, wcGetState, wcFormatTime, wcRender, wcTick, wcAddZone, wcRemoveZone, wcSaveState, wcInit];
    var bnoiseFunctions = [bnoiseGetToolId, bnoiseGetWidget, bnoiseInit, bnoiseBuildBrownBuffer, bnoiseBuildWhiteBuffer, bnoiseBuildBuffer, bnoiseSetupWind, bnoiseSetupRain, bnoiseScheduleRainDrop, bnoiseSetupFire, bnoiseScheduleFireCrackle, bnoiseStart, bnoiseStop, bnoiseDrawIdle, bnoiseDrawFrame, bnoiseToggle, bnoiseSetVolume, bnoiseSetType, bnoiseSetTimer];
    var rcpFunctions = [rcpGetToolId, rcpGetData, rcpSaveData, rcpParse, rcpLayout, rcpBuildTableHtml, rcpGetWidget, rcpRender, rcpRenderTable, rcpActiveOutput, rcpInit, rcpOnInput, rcpOnKeyDown, rcpWrapText, rcpExportPng, rcpCopyHtml, rcpShowHelp];
    var agtFunctions = [agtGetToolId, agtGetWidget, agtGetData, agtSaveData, agtClock, agtLength, agtTimeOfDay, agtScale, agtLive, agtPlanSecs, agtEditHtml, agtSoundHtml, agtReadRows, agtEdit, agtGrow, agtOpenNotes, agtNotesToggle, agtAdd, agtRemove, agtMove, agtNameKey, agtDragStart, agtDragOver, agtDragLeave, agtDrop, agtDragEnd, agtSound, agtStartOpen, agtStartCancel, agtPick, agtTarget, agtFitted, agtPreview, agtStartGo, agtTickItems, agtNotesHtml, agtTickItem, agtBakeTicks, agtRunNotesHtml, agtNotesEdit, agtNotesDone, agtNotesKey, agtNotesInput, agtCopyNotes, agtCoverText, agtRunHtml, agtDoneHtml, agtRender, agtTick, agtEnsureTicker, agtChime, agtChange, agtNext, agtBack, agtPause, agtAddMinute, agtFit, agtStop, agtAIMins, agtAITarget, agtAICleanDraft, agtAIDraftPreview, agtAIApply, agtInit];
    var vacFunctions = [vacGetToolId, vacGetWidget, vacEsc, vacNewId, vacUiOf, vacDefaultPlan, vacMigrateStay, vacCruisePlaceOn, vacCruiseStays, vacAllAboard, vacStaysOn, vacDayHome, vacIsHome, vacDur, vacStayPlaces, vacGetData, vacSaveData, vacIso, vacDateOf, vacDates, vacSeedDay, vacEnsureDays, vacPresetOf, vacPresetItems, vacRowTouched, vacEnsureOutfits, vacSortedOutfits, vacHasPlans, vacParseTime, vacTimeValue, vacTimeLabel, vacHourLabel, vacDayLabel, vacDayText, vacDayName, vacTabText, vacSetDayLabel, vacParsePlace, vacPlaceQuery, vacApplyNear, vacPlaceTarget, vacPlaceTargetHtml, vacNamesAgree, vacRenamePlace, vacFixPins, vacPlaceText, vacPlaceName, vacPlaceUrl, vacRouteStop, vacSamePlace, vacCopyPlace, vacRouteStops, vacRouteUrl, vacDirUrl, vacAddDays, vacAirportPlace, vacFlightStatusUrl, vacBlockStops, vacDriveUrl, vacDriveOrigin, vacFlightTimes, vacFlightTimesHtml, vacFlightEnd, vacResolvePlace, vacPlaceInput, vacDayEvents, vacDayEventsHtml, vacPerson, vacWearGroups, vacWearText, vacClothesHtml, vacClothesTableHtml, vacPackedCount, vacPresetsHtml, vacTogglePresets, vacClothesFilter, vacClothesRefresh, vacCellEdit, vacCellText, vacCellPacked, vacOutfitRow, vacOutfitField, vacOutfitAdd, vacOutfitFill, vacOutfitRemove, vacPresetField, vacPresetAdd, vacPresetRemove, vacTypeAdd, vacTypeField, vacTypeRemove, vacWhoName, vacWhoColor, vacPersonAdd, vacPersonField, vacPersonRemove, vacPeopleHtml, vacLayout, vacSpan, vacColumn, vacEdgeHtml, vacEdgePick, vacHoursHtml, vacSetHours, vacBlockInfo, vacBlockHtml, vacDayHtml, vacStayLanes, vacStaySegmentsHtml, vacTripRouteLinks, vacTripHtml, vacFind, vacFormLinksHtml, vacMinutesOptions, vacBlockFormHtml, vacCruisesHtml, vacCruiseCardHtml, vacCruiseAdd, vacCruiseRemove, vacCruiseField, vacStaysHtml, vacStayTab, vacHomeField, vacStayLinksHtml, vacStayAdd, vacStayRemove, vacStayField, vacFlightCardHtml, vacFlightAdd, vacFlightRemove, vacLen, vacJourneyOpts, vacAllFlights, vacJourneyFlight, vacJourneyParking, vacJourneyRental, vacCutoffText, vacJourneyPlan, vacFindLeg, vacLegEdited, vacJourneyApplyTo, vacJourneyOnSchedule, vacJourneyApply, vacJourneyField, vacStepTimes, vacJourneyHtml, vacSubtabsHtml, vacTravelTab, vacTravelHtml, vacRentalCardHtml, vacRentalBlock, vacRentalSchedHtml, vacRentalSchedule, vacRentalFollow, vacRentalLinksHtml, vacRentalAdd, vacRentalRemove, vacRentalField, vacParkAdd, vacParkRemove, vacParkField, vacAirportDrive, vacStopAdd, vacStopRemove, vacClothesToPacking, vacPlacesHtml, vacPlaceEdit, vacPlaceEditCancel, vacPlaceEditKey, vacPlaceCopies, vacReplaceCopies, vacPlaceSave, vacListChoices, vacLinkify, vacListsHtml, vacSideHtml, vacPlacesDatalist, vacSwapMain, vacHeadHtml, vacPrintHtml, vacGapKey, vacGaps, vacKm, vacEstimate, vacTravelTime, vacBlockTravel, vacBlockTravelHtml, vacDriveFit, vacTravelKeep, vacLengthByHand, vacFollowTravel, vacMoving, vacLinkPrev, vacLinkNext, vacLinkGap, vacShiftBlock, vacChainSettle, vacChainOf, vacChainRoom, vacChainMove, vacBlockLinkHtml, vacLinkSet, vacDriveChips, vacGapMode, vacGapsHtml, vacGapOpen, vacGapSet, vacGapLink, vacConflicts, vacWarnings, vacWarnBtnHtml, vacWarnRowsHtml, vacWarnHtml, vacWarnToggle, vacWarnShowIgnored, vacWarnIgnore, vacWarnGo, vacIcsText, vacIcsFold, vacIcsTime, vacIcsDate, vacIcs, vacCalHtml, vacCalToggle, vacCalOption, vacFileName, vacCalDownload, vacMdText, vacMdLink, vacMarkdown, vacOutHtml, vacMdHtml, vacMdPlain, vacOutView, vacOutToggle, vacOutOption, vacOutCopy, vacOutCopyRich, vacTabOrder, vacTabLabel, vacMoveTab, vacTabDragStart, vacTabSide, vacTabDragOver, vacTabDragLeave, vacTabDrop, vacTabDragEnd, vacTabKey, vacPxOf, vacFit, vacRender, vacMutate, vacSetName, vacSetDest, vacSetDates, vacMoney, vacMoneyText, vacBudgetLines, vacBudgetTotals, vacBudgetSumHtml, vacBudgetHtml, vacBudgetRefresh, vacBudgetSet, vacBudgetPaid, vacExtraAdd, vacExtraRemove, vacExtraField, vacGoTo, vacMealsHtml, vacSetMeal, vacRestoreMeals, vacView, vacTripPick, vacTripDown, vacPlaceBlock, vacGridDown, vacEditField, vacDeleteBlock, vacSavePlace, vacAddPlace, vacPlaceKey, vacRemovePlace, vacPickList, vacItemsOf, vacOpenDayList, vacAddList, vacRenameList, vacDeleteList, vacItemToggle, vacItemRemove, vacItemKey, vacItemEdit, vacInit];
    var allFunctions = pomoFunctions.concat(ucFunctions).concat(pbsFunctions).concat(calendarFunctions).concat(pickerFunctions).concat(diceFunctions).concat(swFunctions).concat(ytFunctions).concat(kbFunctions).concat(breathingFunctions).concat(wcFunctions).concat(bnoiseFunctions).concat(rcpFunctions).concat(agtFunctions).concat(vacFunctions);

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
        'window.KB_TAG_COLORS = ' + JSON.stringify(KB_TAG_COLORS) + ';\n' +
        'window.kbDragState = { type: null, colIdx: null, cardIdx: null, sourceColIdx: null, toolId: null };\n' +
        'window.breathingInstances = new Map();\n' +
        'window.BREATHING_CIRCLE_R = ' + BREATHING_CIRCLE_R + ';\n' +
        'window.BREATHING_CIRCUMFERENCE = ' + BREATHING_CIRCUMFERENCE + ';\n' +
        'window.BREATHING_PRESETS = ' + JSON.stringify(BREATHING_PRESETS) + ';\n' +
        'window.wcInstances = new Map();\n' +
        'window.wcSearchIndex = null;\n' +
        'window.WC_DEFAULT_ZONES = ' + JSON.stringify(WC_DEFAULT_ZONES) + ';\n' +
        'window.bnoiseState = {};\n' +
        'window.BNOISE_LABELS = ' + JSON.stringify(BNOISE_LABELS) + ';\n' +
        'window.BNOISE_COLORS = ' + JSON.stringify(BNOISE_COLORS) + ';\n' +
        'window.AGT_DEFAULT_SECTIONS = ' + JSON.stringify(AGT_DEFAULT_SECTIONS) + ';\n' +
        'window.AGT_WARN_SECS = ' + AGT_WARN_SECS + ';\n' +
        'window.agtTimer = null;\n' +
        'window.agtChimed = new Map();\n' +
        'window.agtDrag = null;\n' +
        'window.agtAudio = null;\n' +
        'window.VAC_PX = ' + VAC_PX + ';\n' +
        'window.VAC_TRIP_PX = ' + VAC_TRIP_PX + ';\n' +
        'window.VAC_SNAP = ' + VAC_SNAP + ';\n' +
        'window.VAC_MAX_DAYS = ' + VAC_MAX_DAYS + ';\n' +
        'window.VAC_TAB_LABEL = ' + VAC_TAB_LABEL + ';\n' +
        'window.VAC_MAX_WAYPOINTS = ' + VAC_MAX_WAYPOINTS + ';\n' +
        'window.VAC_KINDS = ' + JSON.stringify(VAC_KINDS) + ';\n' +
        'window.VAC_MEALS = ' + JSON.stringify(VAC_MEALS) + ';\n' +
        'window.VAC_LISTS = ' + JSON.stringify(VAC_LISTS) + ';\n' +
        'window.VAC_CLOTHES_TYPES = ' + JSON.stringify(VAC_CLOTHES_TYPES) + ';\n' +
        'window.VAC_OUTFIT_PRESETS = ' + JSON.stringify(VAC_OUTFIT_PRESETS) + ';\n' +
        'window.VAC_PEOPLE_COLORS = ' + JSON.stringify(VAC_PEOPLE_COLORS) + ';\n' +
        'window.VAC_PANES = ' + JSON.stringify(VAC_PANES) + ';\n' +
        'window.VAC_TRANSFER_MODES = ' + JSON.stringify(VAC_TRANSFER_MODES) + ';\n' +
        'window.VAC_STEP_LENGTHS = ' + JSON.stringify(VAC_STEP_LENGTHS) + ';\n' +
        'window.VAC_GAP_MODES = ' + JSON.stringify(VAC_GAP_MODES) + ';\n' +
        'window.VAC_GAP_LENGTHS = ' + JSON.stringify(VAC_GAP_LENGTHS) + ';\n' +
        'window.VAC_BUDGET_CATS = ' + JSON.stringify(VAC_BUDGET_CATS) + ';\n' +
        'window.vacUi = new Map();\n' +
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
    tools: ['agenda-timer', 'breathing-exercise', 'brown-noise', 'calendar', 'dice-roller', 'kanban-board', 'playback-speed-calc', 'pomodoro-timer', 'random-picker', 'recipe', 'stopwatch', 'unit-converter', 'vacation-planner', 'world-clock', 'youtube-embed'],
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

// Breathing Exercise
PluginRegistry.registerTool({
    id: 'breathing-exercise',
    name: 'Breathing Exercise',
    description: 'Guided breathing with customizable inhale/hold/exhale patterns',
    icon: '\uD83C\uDF2C\uFE0F',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['breathing', 'meditation', 'relax', 'focus', 'wellness'],
    title: 'Breathing Exercise',
    content: '<div class="breathing-widget">' +
        '<div class="breathing-circle-container">' +
            '<div class="breathing-scale-wrap">' +
                '<svg class="breathing-circle-svg" viewBox="0 0 200 200">' +
                    '<circle class="breathing-circle-bg" cx="100" cy="100" r="' + BREATHING_CIRCLE_R + '"></circle>' +
                    '<circle class="breathing-circle-fg" cx="100" cy="100" r="' + BREATHING_CIRCLE_R + '" stroke-dasharray="' + BREATHING_CIRCUMFERENCE.toFixed(2) + '" stroke-dashoffset="0"></circle>' +
                '</svg>' +
            '</div>' +
            '<div class="breathing-overlay">' +
                '<div class="breathing-label">Press Start</div>' +
                '<div class="breathing-timer"></div>' +
            '</div>' +
        '</div>' +
        '<div class="breathing-controls">' +
            '<button class="breathing-btn primary breathing-toggle" onclick="breathingToggle(this)">Start</button>' +
            '<button class="breathing-btn" onclick="breathingReset(this)">Reset</button>' +
        '</div>' +
        '<div class="breathing-cycle-count">Cycles: 0</div>' +
        '<div class="breathing-preset-row">' +
            '<button class="breathing-preset active" data-preset="4-4-4" onclick="breathingSetPreset(this,\'4-4-4\')">4-4-4</button>' +
            '<button class="breathing-preset" data-preset="4-7-8" onclick="breathingSetPreset(this,\'4-7-8\')">4-7-8</button>' +
            '<button class="breathing-preset" data-preset="5-5-5" onclick="breathingSetPreset(this,\'5-5-5\')">5-5-5</button>' +
            '<button class="breathing-preset" data-preset="4-0-4" onclick="breathingSetPreset(this,\'4-0-4\')">4-0-4</button>' +
        '</div>' +
        '<div class="breathing-settings">' +
            '<div class="breathing-settings-toggle" onclick="breathingToggleSettings(this)">\u2699 Settings</div>' +
            '<div class="breathing-settings-panel">' +
                '<div class="breathing-settings-grid">' +
                    '<div><label>Inhale (s)</label><input type="number" value="4" min="1" max="15" onchange="breathingApplySettings(this)"></div>' +
                    '<div><label>Hold (s)</label><input type="number" value="4" min="0" max="15" onchange="breathingApplySettings(this)"></div>' +
                    '<div><label>Exhale (s)</label><input type="number" value="4" min="1" max="15" onchange="breathingApplySettings(this)"></div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>',
    onInit: 'breathingInit',
    defaultWidth: 320,
    defaultHeight: 440,
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

// Kanban Board
PluginRegistry.registerTool({
    id: 'kanban-board',
    name: 'Kanban Board',
    description: 'Drag-and-drop kanban board with customizable columns and cards',
    icon: '\uD83D\uDCCB',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['kanban', 'board', 'task', 'project', 'workflow', 'todo', 'agile', 'cards', 'columns'],
    title: 'Kanban Board',
    content: '<div class="kb-widget">' +
        '<div class="kb-toolbar">' +
            '<input type="text" placeholder="New column name...">' +
            '<button onclick="kbAddColumn(this)">+ Column</button>' +
        '</div>' +
        '<div class="kb-board"></div>' +
    '</div>',
    onInit: 'kbInit',
    // ✨ where Chrome's own model can run: cards for a goal, shown first and added to the
    // board's first column; the rest is read, to copy. Nothing it writes moves a card.
    ai: {
        target: 'kbAITarget',
        apply: 'kbAIApply',
        actions: ['ask'],
        custom: [
            { id: 'cards', group: 'Board', label: 'Draft cards', system: KB_AI_SYSTEM, needsText: false,
                input: 'What is the goal or project? “launch the new help page”',
                applyHow: ['insert'],
                applyLabels: function(t) { return { insert: 'Add to \u201C' + (t.first || 'To Do') + '\u201D' }; },
                schema: { type: 'object', required: ['cards'], properties: { cards: { type: 'array', items: { type: 'object',
                    required: ['title', 'description', 'tags'], properties: { title: { type: 'string' }, description: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } } } } } } },
                parse: kbAICleanCards,
                preview: kbAICardsPreview,
                prompt: function(text, goal) { return 'Draft the kanban cards for the work this needs: ' + goal + '\n\nGive 4 to 10 ' +
                    'cards, each a short title starting with a verb, a one-sentence description, and one or two one-word tags ' +
                    '(such as design, writing, review).' + (text ? '\n\nThe board already has these, so do not repeat them:\n' + text : ''); } },
            { id: 'status', group: 'Board', label: 'Status update', system: KB_AI_SYSTEM, apply: false,
                show: function(t) { return !!t.text; },
                prompt: function(text) { return 'Write a short status update from this board for a team stand-up, under three ' +
                    'headings: "Done", "Doing" and "Next", each a few bullets taken from the matching columns. Use only what the ' +
                    'board says.\n\n' + text; } },
            { id: 'stuck', group: 'Board', label: 'What’s stuck', system: KB_AI_SYSTEM, apply: false,
                show: function(t) { return !!t.text; },
                prompt: function(text) { return 'Look at this board for what may be stuck or unclear: too many cards in progress at ' +
                    'once, cards with no description, cards whose title says too little to act on. List each finding as a bullet ' +
                    'naming the card. If nothing stands out, say so.\n\n' + text; } }
        ]
    },
    defaultWidth: 700,
    defaultHeight: 450,
    source: 'external'
});

// World Clock
PluginRegistry.registerTool({
    id: 'world-clock',
    name: 'World Clock',
    description: 'Live clocks showing current time in multiple time zones',
    icon: '\uD83C\uDF0D',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['clock', 'time', 'timezone', 'world', 'utc', 'international'],
    title: 'World Clock',
    content: '<div class="wc-widget">' +
        '<div class="wc-toolbar">' +
            '<input type="text" placeholder="Add timezone (e.g. Europe/Paris)..." spellcheck="false">' +
            '<button onclick="wcAddZone(this)">+ Add</button>' +
        '</div>' +
        '<div class="wc-list"></div>' +
    '</div>',
    onInit: 'wcInit',
    defaultWidth: 300,
    defaultHeight: 380,
    source: 'external'
});

// Brown Noise Generator
PluginRegistry.registerTool({
    id: 'brown-noise',
    name: 'Brown Noise',
    description: 'Ambient noise generator for focus and relaxation — brown, pink, and white noise with visualizer and auto-stop timer',
    icon: '🎵',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['noise', 'brown', 'pink', 'white', 'focus', 'relax', 'sleep', 'ambient', 'audio', 'sound'],
    title: 'Brown Noise',
    content: '<div class="bnoise-widget">' +
        '<div class="bnoise-type-row">' +
            '<button class="bnoise-type-btn active" onclick="bnoiseSetType(this,\'brown\')">🟤 Brown</button>' +
            '<button class="bnoise-type-btn" onclick="bnoiseSetType(this,\'pink\')">🌸 Pink</button>' +
            '<button class="bnoise-type-btn" onclick="bnoiseSetType(this,\'white\')">⬜ White</button>' +
        '</div>' +
        '<div class="bnoise-type-row">' +
            '<button class="bnoise-type-btn" onclick="bnoiseSetType(this,\'waves\')">🌊 Waves</button>' +
            '<button class="bnoise-type-btn" onclick="bnoiseSetType(this,\'wind\')">💨 Wind</button>' +
            '<button class="bnoise-type-btn" onclick="bnoiseSetType(this,\'rain\')">🌧 Rain</button>' +
            '<button class="bnoise-type-btn" onclick="bnoiseSetType(this,\'fire\')">🔥 Fire</button>' +
        '</div>' +
        '<canvas class="bnoise-canvas"></canvas>' +
        '<div class="bnoise-controls">' +
            '<button class="bnoise-play-btn" onclick="bnoiseToggle(this)" title="Play / Stop">▶</button>' +
            '<div class="bnoise-vol-col">' +
                '<div class="bnoise-vol-label"><span>Volume</span><span class="bnoise-vol-pct">60%</span></div>' +
                '<input type="range" class="bnoise-vol-slider" min="0" max="1" step="0.01" value="0.6" oninput="bnoiseSetVolume(this)">' +
            '</div>' +
        '</div>' +
        '<div class="bnoise-timer-row">' +
            '<span class="bnoise-timer-label">Auto-stop:</span>' +
            '<select class="bnoise-timer-select" onchange="bnoiseSetTimer(this)">' +
                '<option value="0">Off</option>' +
                '<option value="5">5 minutes</option>' +
                '<option value="15">15 minutes</option>' +
                '<option value="30">30 minutes</option>' +
                '<option value="60">60 minutes</option>' +
            '</select>' +
        '</div>' +
        '<div class="bnoise-status">Ready</div>' +
    '</div>',
    onInit: 'bnoiseInit',
    defaultWidth: 320,
    defaultHeight: 330,
    source: 'external'
});

// ✨ in the Recipe: the outline is what people find hard to write, so most of what the
// model is asked for is that outline — drafted, turned from an ordinary recipe or scaled
// — and every one is read by rcpParse before it is offered. The rest is read, to copy.
var RCP_AI_OUTLINE = 'A recipe here is an indented outline, written outside-in. ' +
    'The first line is "# " and the title. Each line starting "@ " is something done before cooking, such as heating the oven or greasing a pan. ' +
    'Then the steps: the last thing done is at the left margin, and indented two spaces under each step is everything it uses — ' +
    'its ingredients, and the earlier steps whose results go into it, each with what they use indented under them in turn. ' +
    'An ingredient is a line with nothing under it: its amount, then what it is. A step always has something under it. ' +
    'Something made alongside, such as a sauce, is a second step at the left margin. ' +
    'No bullets, no numbers, no blank lines between steps.\n\nFor example:\n\n' +
    '# Espresso Brownies\n@ Butter and flour an 8x8-in pan\n@ Preheat oven to 350°F (170°C)\n' +
    'bake 350°F (170°C) 30 to 40 min\n  fold in\n    mix\n      mix\n        melt\n          4 oz (115 g) unsalted butter\n' +
    '        1 cup (200 g) sugar\n        1/4 tsp. (2.5 mL) vanilla extract\n        1 shot (60 mL) espresso\n' +
    '      2 large (100 g) eggs\n    1/2 cup (80 g) all-purpose flour\n    1/3 cup (80 g) cocoa powder\n' +
    '    1/4 tsp. (1.3 g) baking soda\n    1/4 tsp. (1.5 g) table salt\n\n' +
    'Here the butter is melted; sugar, vanilla and espresso are mixed into it; that is mixed with the eggs; ' +
    'the flour, cocoa, soda and salt are folded in; and it is baked.';
var RCP_AI_SYSTEM = 'You write recipes. ' + RCP_AI_OUTLINE +
    '\n\nReply with the recipe outline only: no Markdown fences, no explanation.';
var RCP_AI_READ_SYSTEM = 'You help people cook. ' + RCP_AI_OUTLINE + '\n\nBe brief. Reply with the result only.';

/** The outline's shape, line by line: how many things each step uses, in order. */
function rcpAIShape(roots) {
    var walk = function(n) { return '(' + n.children.map(walk).join('') + ')'; };
    return roots.map(walk).join('');
}

/** What the recipe holds, and whether it is an outline yet. */
function rcpAITarget(toolId) {
    var tool = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    var textarea = tool && tool.querySelector('.rcp-widget textarea');
    var text = textarea ? textarea.value : rcpGetData(toolId).text;
    var parsed = rcpParse(text);
    var steps = 0, ingredients = 0;
    var count = function(n) { if (n.children.length) { steps++; n.children.forEach(count); } else ingredients++; };
    parsed.roots.forEach(count);
    var outline = !parsed.error && steps > 0;
    return { scope: 'whole', kind: 'recipe', text: String(text || '').trim() ? text : '', outline: outline, title: parsed.title,
        shape: outline ? rcpAIShape(parsed.roots) : '',
        label: outline ? 'This recipe' + (parsed.title ? ', ' + parsed.title : '') + ' (' + steps + (steps === 1 ? ' step, ' : ' steps, ') +
                ingredients + (ingredients === 1 ? ' ingredient)' : ' ingredients)') :
            'This text, not an outline yet: turn it into one',
        emptyLabel: 'No recipe yet: describe one and it is drafted.' };
}

/** What the model wrote, as an outline: no fences, no preface, no bullets or numbers. */
function rcpAIClean(text) {
    var t = String(text || '').replace(/\r/g, '');
    var fence = /```[^\n]*\n([\s\S]*?)(?:\n```|$)/.exec(t);
    if (fence) t = fence[1];
    var lines = t.replace(/\t/g, '    ').split('\n').map(function(l) {
        return l.replace(/^(\s*)(?:[-*•]\s+|\d+[.)]\s+)/, '$1').replace(/\s+$/, '');
    });
    var start = lines.findIndex(function(l) { return /^#\s*\S/.test(l); });
    if (start > 0) lines = lines.slice(start);
    return lines.filter(function(l) { return l.trim(); }).join('\n');
}

function rcpAIFormat(outline) {
    return '```\n' + outline + '\n```';
}

/** Whether an outline can be used: '' when it can, else why not. */
function rcpAICheck(outline) {
    var parsed = rcpParse(outline);
    if (parsed.error) return parsed.error;
    if (!parsed.roots.length) return 'It has no steps.';
    if (!parsed.roots.some(function(n) { return n.children.length; })) return 'Nothing is indented: every step needs what it uses indented under it.';
    return '';
}

/** Scaled, it must be the same recipe: every line where it was. */
function rcpAICheckScaled(outline, target) {
    var problem = rcpAICheck(outline);
    if (problem) return problem;
    return target && target.shape && rcpAIShape(rcpParse(outline).roots) !== target.shape ?
        'The steps changed: it must keep every line, in the same order and indentation, with only the amounts changed.' : '';
}

function rcpAIRepair(text, outline, problem) {
    return 'This recipe outline cannot be used: ' + problem + '\n\n' + outline +
        '\n\nFix it, changing as little as possible. Reply with the whole recipe outline.';
}

/** An outline into the editor, over what was there, through the ordinary save so Undo takes it back. */
function rcpAIApply(toolId, outline, how) {
    if (how !== 'replace' || !outline || rcpAICheck(outline)) return false;
    var tool = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    var textarea = tool && tool.querySelector('.rcp-widget textarea');
    if (!textarea) { rcpSaveData(toolId, { text: outline }); return true; }
    textarea.value = outline;
    rcpOnInput(textarea);
    return true;
}

// Recipe
PluginRegistry.registerTool({
    id: 'recipe',
    name: 'Recipe',
    description: 'Write a recipe as an indented outline and render it as a Cooking-for-Engineers style table, where each step spans exactly the ingredients it uses',
    icon: '🍳',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['recipe', 'cooking', 'food', 'table', 'kitchen', 'baking', 'ingredients'],
    title: 'Recipe',
    content: '<div class="rcp-widget">' +
        // Lifted into the tool header by the framework, so there is one copy of
        // these buttons whether the chrome is showing or hovered into view.
        '<div class="rcp-actions">' +
            '<button class="rcp-btn" onclick="rcpExportPng(this)" title="Download the table as a PNG">PNG</button>' +
            '<button class="rcp-btn" onclick="rcpCopyHtml(this)" title="Copy the table as HTML">Copy</button>' +
            '<button class="rcp-btn" onclick="rcpShowHelp(this)">? Syntax</button>' +
        '</div>' +
        '<div class="authoring-split">' +
            '<div class="authoring-source rcp-edit-pane">' +
                '<textarea spellcheck="false" oninput="rcpOnInput(this)" onkeydown="rcpOnKeyDown(this, event)" placeholder="Outermost step first, ingredients indented beneath.&#10;&#10;# Espresso Brownies&#10;@ Butter and flour an 8x8-in pan&#10;@ Preheat oven to 350°F (170°C)&#10;&#10;bake 350°F (170°C) 30 to 40 min&#10;  fold in&#10;    mix&#10;      mix&#10;        melt&#10;          4 oz (115 g) unsalted butter&#10;        1 cup (200 g) sugar&#10;        1/4 tsp. (2.5 mL) vanilla extract&#10;        1 shot (60 mL) espresso&#10;      2 large (100 g) eggs&#10;    1/2 cup (80 g) all-purpose flour&#10;    1/3 cup (80 g) cocoa powder&#10;    1/4 tsp. (1.3 g) baking soda&#10;    1/4 tsp. (1.5 g) table salt"></textarea>' +
            '</div>' +
            '<div class="authoring-resizer"></div>' +
            '<div class="authoring-result rcp-view-pane"><div class="rcp-output"></div></div>' +
        '</div>' +
        '<div class="rcp-help-text authoring-chrome">' +
            'Indent ingredients under the step that uses them. <code>#</code> title | <code>@</code> prep row | <code>//</code> comment' +
        '</div>' +
    '</div>',
    // Opting in to the shared modes. Everything the framework needs to know about
    // this tool's shape is here; it owns the buttons, the panes and the divider.
    authoring: {
        modes: ['edit', 'split', 'render'],
        defaultMode: 'render',
        source: '.authoring-source',
        result: '.authoring-result',
        actions: '.rcp-actions',
        onRender: 'rcpRender'
    },
    contentType: 'html',
    onInit: 'rcpInit',
    ai: {
        target: 'rcpAITarget',
        apply: 'rcpAIApply',
        actions: ['ask'],
        custom: [
            { id: 'draft', group: 'Recipe', label: 'Draft a recipe', system: RCP_AI_SYSTEM, needsText: false,
                input: 'What should it be? “brownies for 8”',
                applyHow: ['replace'], applyLabels: { replace: 'Use this recipe' },
                clean: rcpAIClean, format: rcpAIFormat, check: rcpAICheck, repair: rcpAIRepair,
                prompt: function(text, what) { return 'Write a recipe for: ' + what + '\n\nUse the outline exactly as described, ' +
                    'with each amount in US and metric units, as in the example.'; } },
            { id: 'outline', group: 'Recipe', label: 'Turn into an outline', system: RCP_AI_SYSTEM,
                show: function(t) { return !!t.text && !t.outline; },
                applyHow: ['replace'], applyLabels: { replace: 'Use this recipe' },
                clean: rcpAIClean, format: rcpAIFormat, check: rcpAICheck, repair: rcpAIRepair,
                prompt: function(text) { return 'Rewrite this recipe as the outline:\n\n' + text +
                    '\n\nKeep every ingredient with its amount, and every step.'; } },
            { id: 'scale', group: 'Recipe', label: 'Scale it', system: RCP_AI_SYSTEM,
                input: 'How? “double it”, “for 2”',
                show: function(t) { return !!t.outline; },
                applyHow: ['replace'], applyLabels: { replace: 'Use this recipe' },
                clean: rcpAIClean, format: rcpAIFormat, check: rcpAICheckScaled, repair: rcpAIRepair,
                prompt: function(text, how) { return 'Here is a recipe outline:\n\n' + text + '\n\nScale it: ' + how +
                    '. Change only the amounts, and how many it serves if it says. Keep every line, its order and its ' +
                    'indentation exactly as they are. Reply with the whole recipe outline.'; } },
            { id: 'steps', group: 'Recipe', label: 'Steps in words', system: RCP_AI_READ_SYSTEM, apply: false,
                show: function(t) { return !!t.outline; },
                prompt: function(text) { return 'Write this recipe out for someone cooking from it: the title, then ' +
                    '"Ingredients" with each one as a bullet, then "Method" with numbered steps in the order they are done — ' +
                    'the most indented steps first.\n\n' + text; } },
            { id: 'shopping', group: 'Recipe', label: 'Shopping list', system: RCP_AI_READ_SYSTEM, apply: false,
                show: function(t) { return !!t.outline; },
                prompt: function(text) { return 'List what to buy for this recipe as Markdown bullets, grouped under short ' +
                    'headings by where it is found in a shop. Where the same ingredient is used twice, give it once with both ' +
                    'amounts.\n\n' + text; } }
        ]
    },
    defaultWidth: 640,
    defaultHeight: 480,
    source: 'external'
});

// Agenda Timer
PluginRegistry.registerTool({
    id: 'agenda-timer',
    name: 'Agenda Timer',
    description: 'Keep an interview, a meeting or a talk on track: sections with their minutes, fitted to the time there really is',
    icon: '\u23F1\uFE0F',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['timer', 'agenda', 'interview', 'meeting', 'sections', 'countdown', 'schedule', 'talk', 'time'],
    title: 'Agenda Timer',
    content: '<div class="agt-widget"></div>',
    onInit: 'agtInit',
    // ✨ where Chrome's own model can run: a first draft of the plan, and after a run a
    // write-up of its notes. What it writes is shown first; only a draft goes in, by Replace or Add.
    ai: {
        target: 'agtAITarget',
        apply: 'agtAIApply',
        actions: ['ask'],
        custom: [
            { id: 'draft', group: 'Agenda', label: 'Draft an agenda', system: AGT_AI_SYSTEM, needsText: false,
                input: 'What is it for, and how long? “45-minute interview for a senior engineer”',
                show: function(t) { return t.kind === 'plan'; },
                applyLabels: { replace: 'Replace the plan', insert: 'Add to the plan' },
                schema: { type: 'object', required: ['sections'], properties: { sections: { type: 'array', items: {
                    type: 'object', required: ['name', 'minutes', 'points'], properties: {
                        name: { type: 'string' }, minutes: { type: 'number' }, fixed: { type: 'boolean' },
                        points: { type: 'array', items: { type: 'string' } } } } } } },
                parse: agtAICleanDraft,
                preview: agtAIDraftPreview,
                prompt: function(text, what) { return 'Plan an agenda for: ' + what + '\n\nGive 3 to 8 sections in the order they ' +
                    'happen. Each has a short name, its length in minutes, fixed set true only for a part that must keep its ' +
                    'length however short time is (a wrap-up, say), and 2 to 4 short points or questions to cover. If a length ' +
                    'is given, the minutes add up to it.'; } },
            { id: 'writeup', group: 'Agenda', label: 'Write-up', system: AGT_AI_SYSTEM, apply: false,
                show: function(t) { return t.kind === 'done'; },
                prompt: function(text) { return 'Write up this run from its notes for someone who was not there. Start with two ' +
                    'or three sentences on how it went, then a "## " heading for each section that has notes with its key points ' +
                    'as bullets, then "## Not covered" listing the "[ ]" points, if any. Use only what the notes say.\n\n' + text; } },
            { id: 'actions', group: 'Agenda', label: 'Action items', system: AGT_AI_SYSTEM, apply: false,
                show: function(t) { return t.kind !== 'plan'; },
                prompt: function(text) { return 'List the follow-ups and action items in these notes as a Markdown checklist, one ' +
                    '"- [ ] " line each, naming who where the notes say. Add a follow-up for each "[ ]" point that was not ' +
                    'covered. If there are none, say so in a sentence.\n\n' + text; } }
        ]
    },
    defaultWidth: 380,
    defaultHeight: 480,
    source: 'external'
});

// Vacation Planner
PluginRegistry.registerTool({
    id: 'vacation-planner',
    name: 'Vacation Planner',
    description: 'Plan a trip day by day: blocks of time, each day starting with its AM, XM and PM meals, places opened in Google Maps and a route for the day, and checklists for packing, booking and before leaving',
    icon: '🏖️',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['vacation', 'trip', 'travel', 'holiday', 'itinerary', 'planner', 'schedule', 'packing', 'checklist', 'map', 'meals'],
    title: 'Vacation Planner',
    content: '<div class="vac-widget"></div>',
    onInit: 'vacInit',
    printHtml: 'vacPrintHtml',
    defaultWidth: 900,
    defaultHeight: 620,
    source: 'external'
});

console.log('Productivity Tools plugin loaded (15 tools)');
