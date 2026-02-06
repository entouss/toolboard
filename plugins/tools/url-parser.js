// URL Parser Tool Plugin
// Break down URLs into parts, encode/decode components

(function() {
    if (document.getElementById('urlp-styles')) return;
    const style = document.createElement('style');
    style.id = 'urlp-styles';
    style.textContent = `
.tool-content:has(.urlp-widget) { display: flex; flex-direction: column; }
.urlp-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 8px; }
.urlp-input-row { display: flex; gap: 4px; flex-shrink: 0; }
.urlp-input-row input { flex: 1; padding: 7px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); min-width: 0; }
.urlp-input-row input:focus { outline: none; border-color: #3498db; }
.urlp-input-row button { padding: 6px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; white-space: nowrap; flex-shrink: 0; }
.urlp-input-row button:hover { background: var(--table-hover); }
.urlp-tabs { display: flex; gap: 0; flex-shrink: 0; border-bottom: 1px solid var(--border-color); }
.urlp-tab { padding: 6px 12px; border: none; background: none; color: var(--text-secondary); cursor: pointer; font-size: 11px; font-weight: 600; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.urlp-tab:hover { color: var(--text-primary); }
.urlp-tab.active { color: #3498db; border-bottom-color: #3498db; }
.urlp-panel { display: none; flex: 1; flex-direction: column; min-height: 0; overflow: auto; }
.urlp-panel.active { display: flex; }
.urlp-parts-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.urlp-parts-table tr { border-bottom: 1px solid var(--border-light); }
.urlp-parts-table td { padding: 5px 8px; vertical-align: top; }
.urlp-parts-table td:first-child { font-weight: 600; color: var(--text-secondary); white-space: nowrap; width: 80px; }
.urlp-parts-table td:nth-child(2) { font-family: monospace; word-break: break-all; color: var(--text-primary); }
.urlp-parts-table td:last-child { width: 40px; text-align: right; }
.urlp-copy-sm { padding: 1px 6px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-muted); cursor: pointer; font-size: 9px; border-radius: 3px; }
.urlp-copy-sm:hover { background: var(--table-hover); color: var(--text-primary); }
.urlp-params-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.urlp-params-table th { text-align: left; padding: 5px 8px; font-weight: 600; font-size: 10px; color: var(--text-secondary); text-transform: uppercase; border-bottom: 1px solid var(--border-color); }
.urlp-params-table td { padding: 5px 8px; font-family: monospace; word-break: break-all; border-bottom: 1px solid var(--border-light); }
.urlp-params-table td.key { color: #3498db; font-weight: 600; }
.urlp-params-table td.val { color: var(--text-primary); }
.urlp-params-empty { padding: 16px; text-align: center; color: var(--text-muted); font-style: italic; }
.urlp-encode-section { display: flex; flex-direction: column; gap: 6px; flex: 1; min-height: 0; }
.urlp-encode-row { display: flex; flex-direction: column; gap: 3px; flex: 1; min-height: 0; }
.urlp-encode-row label { font-weight: 600; font-size: 11px; color: var(--text-heading); flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; }
.urlp-encode-row textarea { flex: 1; resize: none; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); min-height: 40px; }
.urlp-encode-row textarea:focus { outline: none; border-color: #3498db; }
.urlp-encode-btns { display: flex; gap: 4px; flex-shrink: 0; justify-content: center; }
.urlp-encode-btn { padding: 5px 14px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; }
.urlp-encode-btn:hover { background: var(--table-hover); }
.urlp-encode-btn.primary { background: #3498db; color: white; border-color: #3498db; }
.urlp-encode-btn.primary:hover { background: #2980b9; }
.urlp-error { color: #e74c3c; font-style: italic; padding: 8px; font-size: 11px; }
`;
    document.head.appendChild(style);
})();

PluginRegistry.registerTool({
    id: 'url-parser',
    name: 'URL Parser',
    description: 'Break down URLs into parts, encode/decode components',
    icon: '🔗',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['url', 'uri', 'parse', 'encode', 'decode', 'query', 'parameter', 'percent'],
    title: 'URL Parser',
    content: `<div class="urlp-widget">
<div class="urlp-input-row">
<input type="text" class="urlp-url-input" placeholder="https://example.com/path?key=value#section" oninput="urlpParse(this)" spellcheck="false">
<button onclick="urlpPaste(this)">Paste</button>
</div>
<div class="urlp-tabs">
<button class="urlp-tab active" onclick="urlpSwitchTab(this,'parts')">Parts</button>
<button class="urlp-tab" onclick="urlpSwitchTab(this,'params')">Params</button>
<button class="urlp-tab" onclick="urlpSwitchTab(this,'encode')">Encode/Decode</button>
</div>
<div class="urlp-panel urlp-parts-panel active"></div>
<div class="urlp-panel urlp-params-panel"></div>
<div class="urlp-panel urlp-encode-panel">
<div class="urlp-encode-section">
<div class="urlp-encode-row">
<label>Decoded <button class="urlp-copy-sm" onclick="urlpCopyField(this,'.urlp-decoded')">Copy</button></label>
<textarea class="urlp-decoded" placeholder="Plain text or URL..." oninput="urlpEncodeFromDecoded(this)"></textarea>
</div>
<div class="urlp-encode-btns">
<button class="urlp-encode-btn primary" onclick="urlpEncodeFromDecoded(this.closest('.urlp-widget').querySelector('.urlp-decoded'))">Encode ↓</button>
<button class="urlp-encode-btn primary" onclick="urlpDecodeFromEncoded(this.closest('.urlp-widget').querySelector('.urlp-encoded'))">↑ Decode</button>
</div>
<div class="urlp-encode-row">
<label>Encoded <button class="urlp-copy-sm" onclick="urlpCopyField(this,'.urlp-encoded')">Copy</button></label>
<textarea class="urlp-encoded" placeholder="Percent-encoded string..." oninput="urlpDecodeFromEncoded(this)"></textarea>
</div>
</div>
</div>
</div>`,
    contentType: 'html',
    onInit: 'urlpInit',
    source: 'external',
    defaultWidth: 420,
    defaultHeight: 400
});

// ── Parse & display ──

function urlpParse(input) {
    const widget = input.closest('.urlp-widget');
    const raw = input.value.trim();
    const partsPanel = widget.querySelector('.urlp-parts-panel');
    const paramsPanel = widget.querySelector('.urlp-params-panel');

    if (!raw) {
        partsPanel.innerHTML = '<div class="urlp-params-empty">Enter a URL above to parse</div>';
        paramsPanel.innerHTML = '';
        return;
    }

    let url;
    try {
        url = new URL(raw);
    } catch {
        // Try prepending https://
        try {
            url = new URL('https://' + raw);
        } catch {
            partsPanel.innerHTML = '<div class="urlp-error">Invalid URL</div>';
            paramsPanel.innerHTML = '<div class="urlp-error">Invalid URL</div>';
            return;
        }
    }

    // Parts table
    const parts = [
        ['Protocol', url.protocol],
        ['Host', url.host],
        ['Hostname', url.hostname],
        ['Port', url.port || '(default)'],
        ['Origin', url.origin],
        ['Pathname', url.pathname],
        ['Search', url.search || '(none)'],
        ['Hash', url.hash || '(none)'],
        ['Username', url.username || '(none)'],
        ['Password', url.password || '(none)'],
    ];

    partsPanel.innerHTML = `<table class="urlp-parts-table">
${parts.map(([label, val]) => {
    const escaped = val.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `<tr><td>${label}</td><td>${escaped}</td><td><button class="urlp-copy-sm" onclick="urlpCopyText(this,'${val.replace(/'/g,"\\'")}')">Copy</button></td></tr>`;
}).join('')}
</table>`;

    // Params table
    const entries = [...url.searchParams.entries()];
    if (entries.length === 0) {
        paramsPanel.innerHTML = '<div class="urlp-params-empty">No query parameters</div>';
    } else {
        paramsPanel.innerHTML = `<table class="urlp-params-table">
<thead><tr><th>Key</th><th>Value</th><th></th></tr></thead>
<tbody>
${entries.map(([k, v]) => {
    const ek = k.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const ev = v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `<tr><td class="key">${ek}</td><td class="val">${ev}</td><td><button class="urlp-copy-sm" onclick="urlpCopyText(this,'${v.replace(/'/g,"\\'")}')">Copy</button></td></tr>`;
}).join('')}
</tbody></table>`;
    }
}

// ── Tab switching ──

function urlpSwitchTab(tab, name) {
    const widget = tab.closest('.urlp-widget');
    widget.querySelectorAll('.urlp-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    widget.querySelectorAll('.urlp-panel').forEach(p => p.classList.remove('active'));
    widget.querySelector(`.urlp-${name}-panel`).classList.add('active');
}

// ── Encode / Decode ──

function urlpEncodeFromDecoded(textarea) {
    const widget = textarea.closest('.urlp-widget');
    const val = widget.querySelector('.urlp-decoded').value;
    try {
        widget.querySelector('.urlp-encoded').value = encodeURIComponent(val);
    } catch { /* ignore encoding errors */ }
}

function urlpDecodeFromEncoded(textarea) {
    const widget = textarea.closest('.urlp-widget');
    const val = widget.querySelector('.urlp-encoded').value;
    try {
        widget.querySelector('.urlp-decoded').value = decodeURIComponent(val);
    } catch { /* ignore decoding errors */ }
}

// ── Utility ──

function urlpPaste(btn) {
    const widget = btn.closest('.urlp-widget');
    const input = widget.querySelector('.urlp-url-input');
    navigator.clipboard.readText().then(text => {
        input.value = text;
        urlpParse(input);
    });
}

function urlpCopyText(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'OK';
        setTimeout(() => btn.textContent = orig, 600);
    });
}

function urlpCopyField(btn, selector) {
    const widget = btn.closest('.urlp-widget');
    const val = widget.querySelector(selector).value;
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'OK';
        setTimeout(() => btn.textContent = orig, 600);
    });
}

function urlpInit() {
    document.querySelectorAll('.urlp-widget').forEach(widget => {
        widget.querySelector('.urlp-parts-panel').innerHTML =
            '<div class="urlp-params-empty">Enter a URL above to parse</div>';
    });
}

console.log('URL Parser plugin loaded');
