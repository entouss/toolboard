// Core Tools Toolbox Plugin
// Contains the Checklist tool

// Inject CSS styles for core tools
(function() {
    if (document.getElementById('core-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'core-tools-styles';
    style.textContent = `
/* Checklist Widget */
.checklist-items {
    list-style: none;
    padding: 0;
    margin: 0;
}

.checklist-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    margin-bottom: 2px;
    transition: background 0.15s, opacity 0.15s, box-shadow 0.15s;
}

.checklist-item:hover {
    background: var(--table-hover);
}

.checklist-item.dragging {
    opacity: 0.5;
    box-shadow: 0 2px 8px var(--shadow-medium);
}

.checklist-item.drag-over {
    border-top: 2px solid #3498db;
    margin-top: -2px;
}

.checklist-item.completed {
    opacity: 0.6;
}

.checklist-item.completed .checklist-text {
    text-decoration: line-through;
    color: var(--text-muted);
}

.checklist-item.in_progress .checklist-status {
    background: #f39c12;
    border-color: #f39c12;
}

.checklist-item.in_progress .checklist-status::after {
    content: '▶';
    color: white;
    font-size: 9px;
    margin-left: 1px;
}

.checklist-drag {
    cursor: grab;
    color: var(--text-muted);
    font-size: 12px;
    padding: 2px;
    opacity: 0.4;
    transition: opacity 0.15s;
}

.checklist-item:hover .checklist-drag {
    opacity: 1;
}

.checklist-drag:active {
    cursor: grabbing;
}

.checklist-status {
    width: 18px;
    height: 18px;
    min-width: 18px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    background: transparent;
}

.checklist-status:hover {
    border-color: #3498db;
}

.checklist-item.completed .checklist-status {
    background: #27ae60;
    border-color: #27ae60;
}

.checklist-item.completed .checklist-status::after {
    content: '✓';
    color: white;
    font-size: 12px;
    font-weight: bold;
}

.checklist-text {
    flex: 1;
    font-size: 13px;
    word-break: break-word;
    cursor: text;
    padding: 2px 4px;
    border-radius: 3px;
    min-height: 1.4em;
}

.checklist-text:hover {
    background: rgba(0,0,0,0.05);
}

.checklist-text:focus {
    outline: none;
    background: var(--input-bg);
    box-shadow: 0 0 0 2px #3498db;
}

.checklist-actions {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.15s;
}

.checklist-item:hover .checklist-actions {
    opacity: 1;
}

.checklist-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 14px;
    padding: 2px 5px;
    border-radius: 3px;
    transition: color 0.15s, background 0.15s;
}

.checklist-btn:hover {
    background: rgba(0,0,0,0.1);
    color: var(--text-primary);
}

.checklist-btn.delete:hover {
    color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
}

/* Sub-items */
.checklist-subitems {
    list-style: none;
    padding: 0;
    margin: 4px 0 0 24px;
    border-left: 2px solid var(--border-light);
    padding-left: 8px;
}

.checklist-subitems .checklist-item {
    background: transparent;
    padding: 4px 6px;
    margin-bottom: 2px;
}

.checklist-subitems .checklist-item:hover {
    background: var(--bg-tertiary);
}


.checklist-input:focus {
    outline: none;
    border-color: #3498db;
}

/* A pane now, not a box that appears in place of the list: no frame of its own, and
   it fills the side it is given. */
.checklist-markdown-editor {
    flex: 1;
    width: 100%;
    min-height: 0;
    padding: 0;
    border: none;
    background: transparent;
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-primary);
    resize: none;
    outline: none;
    box-sizing: border-box;
    tab-size: 2;
}

.checklist-widget {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
}

.checklist-source, .checklist-list-pane {
    flex: 1 1 50%;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.checklist-list-pane { overflow: auto; }

.tool.authoring-split .checklist-source { padding-right: 10px; }

.checklist-add-row {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    flex-shrink: 0;
    flex-wrap: wrap;
}

.checklist-add-row .checklist-input {
    flex: 1 1 120px;
    min-width: 0;
    padding: 8px 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 13px;
    background: var(--input-bg);
    color: var(--text-primary);
}

.checklist-add-btn {
    padding: 8px 14px;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
}

.checklist-summary {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid var(--border-light);
    font-size: 11px;
    color: var(--text-muted);
    flex-shrink: 0;
}

.tool-content:has(.calc-container) {
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.calc-container {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 8px;
    background: #2c3e50;
    padding: 15px;
    box-sizing: border-box;
}

.calc-container input {
    flex-shrink: 0;
    box-sizing: border-box;
    width: 100%;
}

.calc-btn-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, minmax(0, 1fr));
    gap: 8px;
}
`;
    document.head.appendChild(style);
})();

// =============================================
// CHECKLIST
// =============================================

// Checklist Widget Functions
let checklistDragState = { dragging: null, toolId: null, parentIdx: null };

function checklistGetToolId(element) {
    const tool = element.closest('.tool');
    return tool ? tool.getAttribute('data-tool') : null;
}

function checklistGetData(toolId) {
    const custom = toolCustomizations[toolId] || {};
    // Migrate old format: convert completed boolean to status
    let items = custom.checklistItems || [];
    items = items.map(item => {
        if (typeof item.completed === 'boolean' && !item.status) {
            return { ...item, status: item.completed ? 'completed' : 'pending', children: item.children || [] };
        }
        return { ...item, children: item.children || [] };
    });
    return items;
}

function checklistSaveData(toolId, items) {
    toolCustomizations[toolId] = toolCustomizations[toolId] || {};
    toolCustomizations[toolId].checklistItems = items;
    saveToolCustomizations(toolCustomizations);
}

function checklistInit() {
    document.querySelectorAll('.checklist-widget').forEach(widget => {
        const toolId = checklistGetToolId(widget);
        if (toolId) {
            checklistRender(widget, toolId);
        }
    });
}

function checklistRenderItem(item, idx, parentIdx = null) {
    const statusClass = item.status || 'pending';
    const path = parentIdx !== null ? `${parentIdx}.${idx}` : `${idx}`;
    const isSubitem = parentIdx !== null;

    let childrenHtml = '';
    if (!isSubitem && item.children && item.children.length > 0) {
        childrenHtml = `<ul class="checklist-subitems">${item.children.map((child, cIdx) =>
            checklistRenderItem(child, cIdx, idx)
        ).join('')}</ul>`;
    }

    return `
        <div class="checklist-item-wrapper" data-path="${path}">
            <li class="checklist-item ${statusClass}" data-path="${path}" draggable="true"
                ondragstart="checklistDragStart(event, '${path}')"
                ondragover="checklistDragOver(event)"
                ondragleave="checklistDragLeave(event)"
                ondrop="checklistDrop(event, '${path}')">
                <span class="checklist-drag">⋮⋮</span>
                <span class="checklist-status" onclick="checklistCycleStatus(this, '${path}')" title="Click to change status"></span>
                <span class="checklist-text" contenteditable="true"
                    onblur="checklistUpdateText(this, '${path}')"
                    onkeydown="checklistTextKeydown(event, this)">${escapeHtml(item.text)}</span>
                <span class="checklist-actions">
                    ${!isSubitem ? `<button class="checklist-btn" onclick="checklistAddSub(this, ${idx})" title="Add sub-item">+</button>` : ''}
                    <button class="checklist-btn delete" onclick="checklistDelete(this, '${path}')" title="Delete">×</button>
                </span>
            </li>
            ${childrenHtml}
        </div>
    `;
}

/**
 * Draw the list, and keep the markdown in step with it.
 *
 * `keepSource` is for the one caller that must not be written back to: the textarea
 * itself. Regenerating the text from the items it just produced would renormalise
 * the line under the cursor as you typed it.
 */
function checklistRender(widget, toolId, keepSource) {
    const items = checklistGetData(toolId);
    const listEl = widget.querySelector('.checklist-items');
    const summaryEl = widget.querySelector('.checklist-summary');

    if (!listEl) return;

    if (!keepSource) {
        const source = widget.querySelector('.checklist-markdown-editor');
        if (source) source.value = checklistToMarkdown(items);
    }

    listEl.innerHTML = items.map((item, idx) => checklistRenderItem(item, idx)).join('');

    // Update summary with all items including children
    let total = 0, completed = 0, inProgress = 0;
    const countItems = (arr) => {
        arr.forEach(item => {
            total++;
            if (item.status === 'completed') completed++;
            else if (item.status === 'in_progress') inProgress++;
            if (item.children) countItems(item.children);
        });
    };
    countItems(items);

    const summaryText = summaryEl.querySelector('.checklist-summary-text');
    if (summaryText) {
        if (total > 0) {
            let summary = `${completed}/${total} done`;
            if (inProgress > 0) summary += ` · ${inProgress} in progress`;
            summaryText.textContent = summary;
        } else {
            summaryText.textContent = 'No items yet';
        }
    }
}

function checklistGetItemByPath(items, path) {
    const parts = path.split('.').map(Number);
    let item = items[parts[0]];
    if (parts.length > 1 && item && item.children) {
        item = item.children[parts[1]];
    }
    return item;
}

function checklistSetItemByPath(items, path, value) {
    const parts = path.split('.').map(Number);
    if (parts.length === 1) {
        if (value === null) {
            items.splice(parts[0], 1);
        } else {
            items[parts[0]] = value;
        }
    } else if (items[parts[0]] && items[parts[0]].children) {
        if (value === null) {
            items[parts[0]].children.splice(parts[1], 1);
        } else {
            items[parts[0]].children[parts[1]] = value;
        }
    }
}

function checklistAddItem(btn) {
    const widget = btn.closest('.checklist-widget');
    const input = widget.querySelector('.checklist-input');
    const toolId = checklistGetToolId(widget);

    if (!toolId || !input.value.trim()) return;

    const items = checklistGetData(toolId);
    items.push({ text: input.value.trim(), status: 'pending', children: [] });
    checklistSaveData(toolId, items);

    input.value = '';
    checklistRender(widget, toolId);
}

function checklistAddSub(el, parentIdx) {
    const widget = el.closest('.checklist-widget');
    const toolId = checklistGetToolId(widget);
    if (!toolId) return;

    const items = checklistGetData(toolId);
    if (!items[parentIdx].children) items[parentIdx].children = [];
    items[parentIdx].children.push({ text: 'New sub-item', status: 'pending' });
    checklistSaveData(toolId, items);
    checklistRender(widget, toolId);

    // Focus the new item for editing
    setTimeout(() => {
        const newItem = widget.querySelector(`[data-path="${parentIdx}.${items[parentIdx].children.length - 1}"] .checklist-text`);
        if (newItem) {
            newItem.focus();
            document.execCommand('selectAll', false, null);
        }
    }, 10);
}

function checklistCycleStatus(el, path) {
    const widget = el.closest('.checklist-widget');
    const toolId = checklistGetToolId(widget);
    if (!toolId) return;

    const items = checklistGetData(toolId);
    const item = checklistGetItemByPath(items, path);
    if (!item) return;

    // Cycle: pending -> in_progress -> completed -> pending
    const cycle = { 'pending': 'in_progress', 'in_progress': 'completed', 'completed': 'pending' };
    item.status = cycle[item.status] || 'pending';

    checklistSaveData(toolId, items);
    checklistRender(widget, toolId);
}

function checklistUpdateText(el, path) {
    const widget = el.closest('.checklist-widget');
    const toolId = checklistGetToolId(widget);
    if (!toolId) return;

    const items = checklistGetData(toolId);
    const item = checklistGetItemByPath(items, path);
    if (!item) return;

    const newText = el.textContent.trim();
    if (newText && newText !== item.text) {
        item.text = newText;
        checklistSaveData(toolId, items);
    } else if (!newText) {
        el.textContent = item.text; // Restore if empty
    }
}

function checklistTextKeydown(e, el) {
    if (e.key === 'Enter') {
        e.preventDefault();
        el.blur();
    } else if (e.key === 'Escape') {
        const widget = el.closest('.checklist-widget');
        const toolId = checklistGetToolId(widget);
        const path = el.closest('.checklist-item').dataset.path;
        const items = checklistGetData(toolId);
        const item = checklistGetItemByPath(items, path);
        if (item) el.textContent = item.text;
        el.blur();
    }
}

function checklistDelete(btn, path) {
    const widget = btn.closest('.checklist-widget');
    const toolId = checklistGetToolId(widget);
    if (!toolId) return;

    const items = checklistGetData(toolId);
    checklistSetItemByPath(items, path, null);
    checklistSaveData(toolId, items);
    checklistRender(widget, toolId);
}

// Drag and drop for reordering
function checklistDragStart(e, path) {
    const widget = e.target.closest('.checklist-widget');
    checklistDragState.dragging = path;
    checklistDragState.toolId = checklistGetToolId(widget);
    checklistDragState.parentIdx = path.includes('.') ? parseInt(path.split('.')[0]) : null;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function checklistDragOver(e) {
    e.preventDefault();
    const item = e.target.closest('.checklist-item');
    if (item && !item.classList.contains('dragging')) {
        item.classList.add('drag-over');
    }
}

function checklistDragLeave(e) {
    const item = e.target.closest('.checklist-item');
    if (item) item.classList.remove('drag-over');
}

function checklistDrop(e, targetPath) {
    e.preventDefault();
    const targetItem = e.target.closest('.checklist-item');
    if (targetItem) targetItem.classList.remove('drag-over');

    const sourcePath = checklistDragState.dragging;
    const toolId = checklistDragState.toolId;

    if (!sourcePath || !toolId || sourcePath === targetPath) {
        checklistDragState = { dragging: null, toolId: null, parentIdx: null };
        return;
    }

    // Only allow reordering within same level (both top-level or both same parent)
    const sourceParent = sourcePath.includes('.') ? sourcePath.split('.')[0] : null;
    const targetParent = targetPath.includes('.') ? targetPath.split('.')[0] : null;

    if (sourceParent !== targetParent) {
        checklistDragState = { dragging: null, toolId: null, parentIdx: null };
        return;
    }

    const items = checklistGetData(toolId);
    const sourceIdx = parseInt(sourcePath.split('.').pop());
    const targetIdx = parseInt(targetPath.split('.').pop());

    let arr = items;
    if (sourceParent !== null) {
        arr = items[parseInt(sourceParent)].children;
    }

    // Move item
    const [moved] = arr.splice(sourceIdx, 1);
    arr.splice(targetIdx > sourceIdx ? targetIdx : targetIdx, 0, moved);

    checklistSaveData(toolId, items);

    const widget = document.querySelector(`.tool[data-tool="${toolId}"] .checklist-widget`);
    if (widget) checklistRender(widget, toolId);

    checklistDragState = { dragging: null, toolId: null, parentIdx: null };
}

document.addEventListener('dragend', (e) => {
    document.querySelectorAll('.checklist-item.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.checklist-item.drag-over').forEach(el => el.classList.remove('drag-over'));
    checklistDragState = { dragging: null, toolId: null, parentIdx: null };
});

// Add enter key support for checklist input
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('checklist-input')) {
        e.preventDefault();
        const widget = e.target.closest('.checklist-widget');
        const addBtn = widget.querySelector('button[onclick*="checklistAddItem"]');
        if (addBtn) checklistAddItem(addBtn);
    }
});

// Checklist Markdown editing
function checklistToMarkdown(items) {
    let lines = [];
    items.forEach(item => {
        const prefix = item.status === 'completed' ? 'x' : item.status === 'in_progress' ? '+' : '-';
        lines.push(`${prefix} ${item.text}`);
        if (item.children && item.children.length > 0) {
            item.children.forEach(child => {
                const childPrefix = child.status === 'completed' ? 'x' : child.status === 'in_progress' ? '+' : '-';
                lines.push(`  ${childPrefix} ${child.text}`);
            });
        }
    });
    return lines.join('\n');
}

function checklistFromMarkdown(text) {
    const lines = text.split('\n');
    const items = [];
    let currentParent = null;

    lines.forEach(line => {
        const indentedMatch = line.match(/^(\s{2,})([-x+])\s+(.+)/);
        const topMatch = line.match(/^([-x+])\s+(.+)/);

        if (indentedMatch && currentParent) {
            const marker = indentedMatch[2];
            const itemText = indentedMatch[3].trim();
            const status = marker === 'x' ? 'completed' : marker === '+' ? 'in_progress' : 'pending';
            currentParent.children.push({ text: itemText, status: status });
        } else if (topMatch) {
            const marker = topMatch[1];
            const itemText = topMatch[2].trim();
            const status = marker === 'x' ? 'completed' : marker === '+' ? 'in_progress' : 'pending';
            currentParent = { text: itemText, status: status, children: [] };
            items.push(currentParent);
        }
    });
    return items;
}

/** Typing the list out: parse, save, redraw the list — but leave the text alone. */
function checklistOnSourceInput(textarea) {
    const widget = textarea.closest('.checklist-widget');
    const toolId = checklistGetToolId(textarea);
    if (!widget || !toolId) return;
    checklistSaveData(toolId, checklistFromMarkdown(textarea.value));
    checklistRender(widget, toolId, true);
}

/** What the framework calls when the list needs to be up to date. */
function checklistOnRender(toolId) {
    const tool = document.querySelector('.tool[data-tool="' + CSS.escape(toolId) + '"]');
    const widget = tool && tool.querySelector('.checklist-widget');
    if (widget) checklistRender(widget, toolId);
}

// ============================================================
// Simple Calculator Widget
// ============================================================
let calcState = { current: '0', previous: '', operator: '', newNumber: true };

function calcInit() {
    calcState = { current: '0', previous: '', operator: '', newNumber: true };
    const display = document.getElementById('calcDisplay');
    if (display) {
        display.value = '0';
        // Add keyboard support
        display.removeAttribute('readonly');
        display.addEventListener('keydown', calcKeyHandler);
        display.addEventListener('input', calcInputHandler);
        display.focus();
    }
}

function calcKeyHandler(e) {
    const key = e.key;

    // Prevent default for keys we handle
    if (/^[0-9.]$/.test(key) || ['+', '-', '*', '/', 'Enter', 'Escape', 'Backspace', '='].includes(key)) {
        e.preventDefault();
    }

    if (/^[0-9.]$/.test(key)) {
        calcNum(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        calcOp(key);
    } else if (key === 'Enter' || key === '=') {
        calcEquals();
    } else if (key === 'Escape' || key === 'Delete') {
        calcClear();
    } else if (key === 'Backspace') {
        calcBackspace();
    }
}

function calcInputHandler(e) {
    // Reset display to current state (prevent direct typing)
    const display = document.getElementById('calcDisplay');
    if (display) display.value = calcState.current;
}

function calcNum(num) {
    const display = document.getElementById('calcDisplay');
    if (!display) return;

    if (calcState.newNumber) {
        calcState.current = (num === '.') ? '0.' : num;
        calcState.newNumber = false;
    } else {
        if (num === '.' && calcState.current.includes('.')) return;
        calcState.current += num;
    }
    display.value = calcState.current;
}

function calcOp(op) {
    const display = document.getElementById('calcDisplay');
    if (!display) return;

    if (calcState.operator && !calcState.newNumber) {
        calcEquals();
    }
    calcState.previous = calcState.current;
    calcState.operator = op;
    calcState.newNumber = true;
}

function calcEquals() {
    const display = document.getElementById('calcDisplay');
    if (!display || !calcState.operator) return;

    const prev = parseFloat(calcState.previous);
    const curr = parseFloat(calcState.current);
    let result;

    switch (calcState.operator) {
        case '+': result = prev + curr; break;
        case '-': result = prev - curr; break;
        case '*': result = prev * curr; break;
        case '/': result = curr !== 0 ? prev / curr : 'Error'; break;
        default: return;
    }

    calcState.current = typeof result === 'number' ? String(Math.round(result * 1e10) / 1e10) : result;
    calcState.operator = '';
    calcState.newNumber = true;
    display.value = calcState.current;
}

function calcClear() {
    calcInit();
}

function calcBackspace() {
    const display = document.getElementById('calcDisplay');
    if (!display) return;

    if (calcState.current.length > 1) {
        calcState.current = calcState.current.slice(0, -1);
    } else {
        calcState.current = '0';
        calcState.newNumber = true;
    }
    display.value = calcState.current;
}

// =============================================
// SCRIPT INJECTION FOR HTML EXPORT
// =============================================

(function injectScriptsForExport() {
    if (document.getElementById('core-tools-scripts')) return;

    var checklistFunctions = [checklistGetToolId, checklistGetData, checklistSaveData, checklistInit, checklistRenderItem, checklistRender, checklistGetItemByPath, checklistSetItemByPath, checklistAddItem, checklistAddSub, checklistCycleStatus, checklistUpdateText, checklistTextKeydown, checklistDelete, checklistDragStart, checklistDragOver, checklistDragLeave, checklistDrop, checklistToMarkdown, checklistFromMarkdown, checklistOnSourceInput, checklistOnRender];
    var calcFunctions = [calcInit, calcKeyHandler, calcInputHandler, calcNum, calcOp, calcEquals, calcClear, calcBackspace];
    var allFunctions = checklistFunctions.concat(calcFunctions);

    var code = '(function() {\n' +
        'if (typeof checklistInit !== "undefined") return;\n' +
        'window.checklistDragState = ' + JSON.stringify(checklistDragState) + ';\n' +
        'window.calcState = ' + JSON.stringify(calcState) + ';\n' +
        'if (typeof escapeHtml === "undefined") { window.escapeHtml = ' + escapeHtml.toString() + '; }\n' +
        allFunctions.map(function(fn) { return 'window.' + fn.name + ' = ' + fn.toString(); }).join(';\n') + ';\n' +
        '})();';
    var encoded = btoa(unescape(encodeURIComponent(code)));

    var script = document.createElement('script');
    script.id = 'core-tools-scripts';
    script.textContent = 'eval(decodeURIComponent(escape(atob("' + encoded + '"))))';
    (document.body || document.head).appendChild(script);
})();

// =============================================
// REGISTRATIONS
// =============================================

PluginRegistry.registerTool({
    id: 'checklist',
    name: 'Checklist',
    description: 'Interactive checklist with add, check, and delete functionality',
    icon: '\u2705',
    version: '1.0.0',
    toolbox: 'core',
    tags: ['todo', 'tasks', 'list'],
    title: 'Checklist',
    content: '<div class="checklist-widget">' +
        '<div class="authoring-split">' +
            '<div class="authoring-source checklist-source">' +
                '<textarea class="checklist-markdown-editor" spellcheck="false" oninput="checklistOnSourceInput(this)" ' +
                    'placeholder="One per line. &#10;&#10;- to do&#10;+ in progress&#10;x done&#10;  - indent two spaces for a subitem"></textarea>' +
            '</div>' +
            '<div class="authoring-resizer"></div>' +
            '<div class="authoring-result checklist-list-pane">' +
                '<div class="checklist-add-row">' +
                    '<input type="text" class="checklist-input" placeholder="Add new item...">' +
                    '<button class="checklist-add-btn" onclick="checklistAddItem(this)">Add</button>' +
                '</div>' +
                '<ul class="checklist-items"></ul>' +
            '</div>' +
        '</div>' +
        '<div class="checklist-summary authoring-chrome">' +
            '<span class="checklist-summary-text"></span>' +
        '</div>' +
    '</div>',
    // The markdown was already this tool's second way of saying the same thing \u2014
    // behind a button that swapped one for the other and carried its own state in
    // its label. As modes it can also be had side by side, and ticking something off
    // rewrites the text while typing the text rebuilds the list.
    //
    // The row that adds an item stays with the list rather than with the chrome:
    // ticking and adding is what this tool is for, and both belong in View.
    authoring: {
        modes: ['edit', 'split', 'render'],
        defaultMode: 'render',
        source: '.authoring-source',
        result: '.authoring-result',
        onRender: 'checklistOnRender'
    },
    onInit: 'checklistInit',
    defaultWidth: 290,
    defaultHeight: 350,
    source: 'external'
});

PluginRegistry.registerTool({
    id: 'simple-calculator',
    name: 'Simple Calculator',
    description: 'Basic arithmetic calculator for quick math',
    icon: '\uD83D\uDD22',
    version: '1.0.0',
    toolbox: 'core',
    tags: ['math', 'arithmetic', 'numbers'],
    title: 'Calculator',
    content: '<div class="calc-container">' +
        '<input type="text" id="calcDisplay" value="0" readonly style="padding:12px;font-size:24px;text-align:right;border:none;border-radius:4px;background:#ecf0f1;font-family:monospace;">' +
        '<div class="calc-btn-grid">' +
        '<button onclick="calcClear()" style="grid-column:span 2;padding:15px;font-size:16px;border:none;border-radius:4px;background:#e74c3c;color:white;cursor:pointer;">C</button>' +
        '<button onclick="calcBackspace()" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#95a5a6;color:white;cursor:pointer;">\u232B</button>' +
        '<button onclick="calcOp(\'/\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#3498db;color:white;cursor:pointer;">\u00F7</button>' +
        '<button onclick="calcNum(\'7\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#ecf0f1;cursor:pointer;">7</button>' +
        '<button onclick="calcNum(\'8\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#ecf0f1;cursor:pointer;">8</button>' +
        '<button onclick="calcNum(\'9\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#ecf0f1;cursor:pointer;">9</button>' +
        '<button onclick="calcOp(\'*\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#3498db;color:white;cursor:pointer;">\u00D7</button>' +
        '<button onclick="calcNum(\'4\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#ecf0f1;cursor:pointer;">4</button>' +
        '<button onclick="calcNum(\'5\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#ecf0f1;cursor:pointer;">5</button>' +
        '<button onclick="calcNum(\'6\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#ecf0f1;cursor:pointer;">6</button>' +
        '<button onclick="calcOp(\'-\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#3498db;color:white;cursor:pointer;">\u2212</button>' +
        '<button onclick="calcNum(\'1\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#ecf0f1;cursor:pointer;">1</button>' +
        '<button onclick="calcNum(\'2\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#ecf0f1;cursor:pointer;">2</button>' +
        '<button onclick="calcNum(\'3\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#ecf0f1;cursor:pointer;">3</button>' +
        '<button onclick="calcOp(\'+\')" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#3498db;color:white;cursor:pointer;">+</button>' +
        '<button onclick="calcNum(\'0\')" style="grid-column:span 2;padding:15px;font-size:16px;border:none;border-radius:4px;background:#ecf0f1;cursor:pointer;">0</button>' +
        '<button onclick="calcNum(\'.\') " style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#ecf0f1;cursor:pointer;">.</button>' +
        '<button onclick="calcEquals()" style="padding:15px;font-size:16px;border:none;border-radius:4px;background:#27ae60;color:white;cursor:pointer;">=</button>' +
        '</div>' +
    '</div>',
    onInit: 'calcInit',
    defaultWidth: 270,
    defaultHeight: 430,
    source: 'external'
});

console.log('Core Tools plugin loaded (2 tools)');
