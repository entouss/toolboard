// QR Code Generator Tool Plugin
// Generates QR codes from text, URLs, and other data

(function() {
    if (document.getElementById('qr-generator-styles')) return;
    const style = document.createElement('style');
    style.id = 'qr-generator-styles';
    style.textContent = `
.tool-content:has(.qr-widget) { display: flex; flex-direction: column; }
.qr-widget { padding: 10px; font-size: 12px; display: flex; flex-direction: column; flex: 1; width: 100%; box-sizing: border-box; min-height: 0; gap: 10px; }
.qr-input-section { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
.qr-input-section label { font-weight: 600; font-size: 11px; color: var(--text-heading); }
.qr-input-section textarea { resize: none; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; font-family: monospace; font-size: 12px; background: var(--input-bg); color: var(--text-primary); min-height: 60px; }
.qr-input-section textarea:focus { outline: none; border-color: #3498db; }
.qr-options-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.qr-option-group { display: flex; align-items: center; gap: 4px; }
.qr-option-group label { font-weight: 400; font-size: 11px; color: var(--text-secondary); white-space: nowrap; }
.qr-option-group select, .qr-option-group input[type="number"] { padding: 4px 6px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 11px; background: var(--input-bg); color: var(--text-primary); }
.qr-option-group select:focus, .qr-option-group input[type="number"]:focus { outline: none; border-color: #3498db; }
.qr-option-group input[type="color"] { width: 28px; height: 24px; padding: 1px; border: 1px solid var(--border-color); border-radius: 3px; cursor: pointer; background: var(--input-bg); }
.qr-output-section { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; min-height: 180px; position: relative; overflow: hidden; }
.qr-canvas-wrap { display: flex; align-items: center; justify-content: center; padding: 16px; }
.qr-canvas-wrap canvas { image-rendering: pixelated; }
.qr-placeholder { color: var(--text-muted); font-style: italic; font-size: 12px; }
.qr-actions { display: flex; gap: 6px; flex-shrink: 0; }
.qr-action-btn { padding: 6px 12px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); cursor: pointer; font-size: 11px; border-radius: 4px; flex: 1; text-align: center; }
.qr-action-btn:hover { background: var(--table-hover); }
.qr-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.qr-action-btn.primary { background: #3498db; color: white; border-color: #3498db; }
.qr-action-btn.primary:hover { background: #2980b9; }
.qr-action-btn.primary:disabled { background: #3498db; }
.qr-info { font-size: 10px; color: var(--text-muted); text-align: center; flex-shrink: 0; }
`;
    document.head.appendChild(style);
})();

PluginRegistry.registerTool({
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text, URLs, WiFi, and more',
    icon: '📱',
    version: '1.0.0',
    toolbox: 'developer-tools',
    tags: ['qr', 'qrcode', 'barcode', 'generator', 'encode'],
    title: 'QR Code Generator',
    content: `<div class="qr-widget">
<div class="qr-input-section">
<label>Content</label>
<textarea placeholder="Enter text, URL, or data to encode..." oninput="qrGenerate(this)"></textarea>
</div>
<div class="qr-options-row">
<div class="qr-option-group">
<label>Size:</label>
<input type="number" class="qr-size-input" value="256" min="64" max="1024" step="32" onchange="qrGenerate(this)">
</div>
<div class="qr-option-group">
<label>EC:</label>
<select class="qr-ec-select" onchange="qrGenerate(this)">
<option value="L">Low (7%)</option>
<option value="M" selected>Medium (15%)</option>
<option value="Q">Quartile (25%)</option>
<option value="H">High (30%)</option>
</select>
</div>
<div class="qr-option-group">
<label>FG:</label>
<input type="color" class="qr-fg-color" value="#000000" onchange="qrGenerate(this)">
</div>
<div class="qr-option-group">
<label>BG:</label>
<input type="color" class="qr-bg-color" value="#ffffff" onchange="qrGenerate(this)">
</div>
</div>
<div class="qr-output-section">
<div class="qr-canvas-wrap">
<span class="qr-placeholder">Enter text above to generate a QR code</span>
</div>
</div>
<div class="qr-actions">
<button class="qr-action-btn primary" onclick="qrDownloadPNG(this)" disabled>Download PNG</button>
<button class="qr-action-btn" onclick="qrDownloadSVG(this)" disabled>Download SVG</button>
<button class="qr-action-btn" onclick="qrCopyToClipboard(this)" disabled>Copy Image</button>
</div>
<div class="qr-info"></div>
</div>`,
    contentType: 'html',
    onInit: 'qrInit',
    source: 'external',
    defaultWidth: 380,
    defaultHeight: 520
});

// ── QR Code encoding engine (self-contained, no external dependencies) ──

const QR = (function() {
    // Alignment pattern centre coordinates per version (ISO/IEC 18004 Annex E).
    const ALIGNMENT_POSITIONS = [
        [], // 1
        [6, 18], // 2
        [6, 22], // 3
        [6, 26], // 4
        [6, 30], // 5
        [6, 34], // 6
        [6, 22, 38], // 7
        [6, 24, 42], // 8
        [6, 26, 46], // 9
        [6, 28, 50], // 10
        [6, 30, 54], // 11
        [6, 32, 58], // 12
        [6, 34, 62], // 13
        [6, 26, 46, 66], // 14
        [6, 26, 48, 70], // 15
        [6, 26, 50, 74], // 16
        [6, 30, 54, 78], // 17
        [6, 30, 56, 82], // 18
        [6, 30, 58, 86], // 19
        [6, 34, 62, 90], // 20
        [6, 28, 50, 72, 94], // 21
        [6, 26, 50, 74, 98], // 22
        [6, 30, 54, 78, 102], // 23
        [6, 28, 54, 80, 106], // 24
        [6, 32, 58, 84, 110], // 25
        [6, 30, 58, 86, 114], // 26
        [6, 34, 62, 90, 118], // 27
        [6, 26, 50, 74, 98, 122], // 28
        [6, 30, 54, 78, 102, 126], // 29
        [6, 26, 52, 78, 104, 130], // 30
        [6, 30, 56, 82, 108, 134], // 31
        [6, 34, 60, 86, 112, 138], // 32
        [6, 30, 58, 86, 114, 142], // 33
        [6, 34, 62, 90, 118, 146], // 34
        [6, 30, 54, 78, 102, 126, 150], // 35
        [6, 24, 50, 76, 102, 128, 154], // 36
        [6, 28, 54, 80, 106, 132, 158], // 37
        [6, 32, 58, 84, 110, 136, 162], // 38
        [6, 26, 54, 82, 110, 138, 166], // 39
        [6, 30, 58, 86, 114, 142, 170], // 40
    ];

    // Error correction blocks per version and level (ISO/IEC 18004 Table 13-22),
    // as [ecCodewordsPerBlock, group1Blocks, group1DataCodewords, group2Blocks, group2DataCodewords].
    const RS_BLOCKS = {
        L: [
            [7, 1, 19, 0, 0], // 1
            [10, 1, 34, 0, 0], // 2
            [15, 1, 55, 0, 0], // 3
            [20, 1, 80, 0, 0], // 4
            [26, 1, 108, 0, 0], // 5
            [18, 2, 68, 0, 0], // 6
            [20, 2, 78, 0, 0], // 7
            [24, 2, 97, 0, 0], // 8
            [30, 2, 116, 0, 0], // 9
            [18, 2, 68, 2, 69], // 10
            [20, 4, 81, 0, 0], // 11
            [24, 2, 92, 2, 93], // 12
            [26, 4, 107, 0, 0], // 13
            [30, 3, 115, 1, 116], // 14
            [22, 5, 87, 1, 88], // 15
            [24, 5, 98, 1, 99], // 16
            [28, 1, 107, 5, 108], // 17
            [30, 5, 120, 1, 121], // 18
            [28, 3, 113, 4, 114], // 19
            [28, 3, 107, 5, 108], // 20
            [28, 4, 116, 4, 117], // 21
            [28, 2, 111, 7, 112], // 22
            [30, 4, 121, 5, 122], // 23
            [30, 6, 117, 4, 118], // 24
            [26, 8, 106, 4, 107], // 25
            [28, 10, 114, 2, 115], // 26
            [30, 8, 122, 4, 123], // 27
            [30, 3, 117, 10, 118], // 28
            [30, 7, 116, 7, 117], // 29
            [30, 5, 115, 10, 116], // 30
            [30, 13, 115, 3, 116], // 31
            [30, 17, 115, 0, 0], // 32
            [30, 17, 115, 1, 116], // 33
            [30, 13, 115, 6, 116], // 34
            [30, 12, 121, 7, 122], // 35
            [30, 6, 121, 14, 122], // 36
            [30, 17, 122, 4, 123], // 37
            [30, 4, 122, 18, 123], // 38
            [30, 20, 117, 4, 118], // 39
            [30, 19, 118, 6, 119], // 40
        ],
        M: [
            [10, 1, 16, 0, 0], // 1
            [16, 1, 28, 0, 0], // 2
            [26, 1, 44, 0, 0], // 3
            [18, 2, 32, 0, 0], // 4
            [24, 2, 43, 0, 0], // 5
            [16, 4, 27, 0, 0], // 6
            [18, 4, 31, 0, 0], // 7
            [22, 2, 38, 2, 39], // 8
            [22, 3, 36, 2, 37], // 9
            [26, 4, 43, 1, 44], // 10
            [30, 1, 50, 4, 51], // 11
            [22, 6, 36, 2, 37], // 12
            [22, 8, 37, 1, 38], // 13
            [24, 4, 40, 5, 41], // 14
            [24, 5, 41, 5, 42], // 15
            [28, 7, 45, 3, 46], // 16
            [28, 10, 46, 1, 47], // 17
            [26, 9, 43, 4, 44], // 18
            [26, 3, 44, 11, 45], // 19
            [26, 3, 41, 13, 42], // 20
            [26, 17, 42, 0, 0], // 21
            [28, 17, 46, 0, 0], // 22
            [28, 4, 47, 14, 48], // 23
            [28, 6, 45, 14, 46], // 24
            [28, 8, 47, 13, 48], // 25
            [28, 19, 46, 4, 47], // 26
            [28, 22, 45, 3, 46], // 27
            [28, 3, 45, 23, 46], // 28
            [28, 21, 45, 7, 46], // 29
            [28, 19, 47, 10, 48], // 30
            [28, 2, 46, 29, 47], // 31
            [28, 10, 46, 23, 47], // 32
            [28, 14, 46, 21, 47], // 33
            [28, 14, 46, 23, 47], // 34
            [28, 12, 47, 26, 48], // 35
            [28, 6, 47, 34, 48], // 36
            [28, 29, 46, 14, 47], // 37
            [28, 13, 46, 32, 47], // 38
            [28, 40, 47, 7, 48], // 39
            [28, 18, 47, 31, 48], // 40
        ],
        Q: [
            [13, 1, 13, 0, 0], // 1
            [22, 1, 22, 0, 0], // 2
            [18, 2, 17, 0, 0], // 3
            [26, 2, 24, 0, 0], // 4
            [18, 2, 15, 2, 16], // 5
            [24, 4, 19, 0, 0], // 6
            [18, 2, 14, 4, 15], // 7
            [22, 4, 18, 2, 19], // 8
            [20, 4, 16, 4, 17], // 9
            [24, 6, 19, 2, 20], // 10
            [28, 4, 22, 4, 23], // 11
            [26, 4, 20, 6, 21], // 12
            [24, 8, 20, 4, 21], // 13
            [20, 11, 16, 5, 17], // 14
            [30, 5, 24, 7, 25], // 15
            [24, 15, 19, 2, 20], // 16
            [28, 1, 22, 15, 23], // 17
            [28, 17, 22, 1, 23], // 18
            [26, 17, 21, 4, 22], // 19
            [30, 15, 24, 5, 25], // 20
            [28, 17, 22, 6, 23], // 21
            [30, 7, 24, 16, 25], // 22
            [30, 11, 24, 14, 25], // 23
            [30, 11, 24, 16, 25], // 24
            [30, 7, 24, 22, 25], // 25
            [28, 28, 22, 6, 23], // 26
            [30, 8, 23, 26, 24], // 27
            [30, 4, 24, 31, 25], // 28
            [30, 1, 23, 37, 24], // 29
            [30, 15, 24, 25, 25], // 30
            [30, 42, 24, 1, 25], // 31
            [30, 10, 24, 35, 25], // 32
            [30, 29, 24, 19, 25], // 33
            [30, 44, 24, 7, 25], // 34
            [30, 39, 24, 14, 25], // 35
            [30, 46, 24, 10, 25], // 36
            [30, 49, 24, 10, 25], // 37
            [30, 48, 24, 14, 25], // 38
            [30, 43, 24, 22, 25], // 39
            [30, 34, 24, 34, 25], // 40
        ],
        H: [
            [17, 1, 9, 0, 0], // 1
            [28, 1, 16, 0, 0], // 2
            [22, 2, 13, 0, 0], // 3
            [16, 4, 9, 0, 0], // 4
            [22, 2, 11, 2, 12], // 5
            [28, 4, 15, 0, 0], // 6
            [26, 4, 13, 1, 14], // 7
            [26, 4, 14, 2, 15], // 8
            [24, 4, 12, 4, 13], // 9
            [28, 6, 15, 2, 16], // 10
            [24, 3, 12, 8, 13], // 11
            [28, 7, 14, 4, 15], // 12
            [22, 12, 11, 4, 12], // 13
            [24, 11, 12, 5, 13], // 14
            [24, 11, 12, 7, 13], // 15
            [30, 3, 15, 13, 16], // 16
            [28, 2, 14, 17, 15], // 17
            [28, 2, 14, 19, 15], // 18
            [26, 9, 13, 16, 14], // 19
            [28, 15, 15, 10, 16], // 20
            [30, 19, 16, 6, 17], // 21
            [24, 34, 13, 0, 0], // 22
            [30, 16, 15, 14, 16], // 23
            [30, 30, 16, 2, 17], // 24
            [30, 22, 15, 13, 16], // 25
            [30, 33, 16, 4, 17], // 26
            [30, 12, 15, 28, 16], // 27
            [30, 11, 15, 31, 16], // 28
            [30, 19, 15, 26, 16], // 29
            [30, 23, 15, 25, 16], // 30
            [30, 23, 15, 28, 16], // 31
            [30, 19, 15, 35, 16], // 32
            [30, 11, 15, 46, 16], // 33
            [30, 59, 16, 1, 17], // 34
            [30, 22, 15, 41, 16], // 35
            [30, 2, 15, 64, 16], // 36
            [30, 24, 15, 46, 16], // 37
            [30, 42, 15, 32, 16], // 38
            [30, 10, 15, 67, 16], // 39
            [30, 20, 15, 61, 16], // 40
        ],
    };

    // Use the well-tested qrcode-generator library approach with a minimal implementation
    // This is a port of the core algorithm

    const MODE_NUMBER = 1, MODE_ALPHA = 2, MODE_BYTE = 4;
    const PAD0 = 0xEC, PAD1 = 0x11;

    const EC_LEVEL_MAP = { L: 1, M: 0, Q: 3, H: 2 };

    // GF(2^8) math for Reed-Solomon
    const EXP_TABLE = new Array(256);
    const LOG_TABLE = new Array(256);
    (function() {
        let x = 1;
        for (let i = 0; i < 255; i++) {
            EXP_TABLE[i] = x;
            LOG_TABLE[x] = i;
            x <<= 1;
            if (x >= 256) x ^= 0x11d;
        }
        EXP_TABLE[255] = EXP_TABLE[0];
    })();

    function gfMul(a, b) {
        if (a === 0 || b === 0) return 0;
        return EXP_TABLE[(LOG_TABLE[a] + LOG_TABLE[b]) % 255];
    }

    function rsGenPoly(degree) {
        let poly = [1];
        for (let i = 0; i < degree; i++) {
            const newPoly = new Array(poly.length + 1).fill(0);
            for (let j = 0; j < poly.length; j++) {
                newPoly[j] ^= poly[j];
                newPoly[j + 1] ^= gfMul(poly[j], EXP_TABLE[i]);
            }
            poly = newPoly;
        }
        return poly;
    }

    function rsEncode(data, ecCount) {
        const gen = rsGenPoly(ecCount);
        const msg = new Array(data.length + ecCount).fill(0);
        for (let i = 0; i < data.length; i++) msg[i] = data[i];
        for (let i = 0; i < data.length; i++) {
            const coef = msg[i];
            if (coef !== 0) {
                for (let j = 0; j < gen.length; j++) {
                    msg[i + j] ^= gfMul(gen[j], coef);
                }
            }
        }
        return msg.slice(data.length);
    }

    // Data capacity table (byte mode) per version per EC level
    const BYTE_CAPACITY = {
        L: [17,32,53,78,106,134,154,192,230,271,321,367,425,458,520,586,644,718,792,858,929,1003,1091,1171,1273,1367,1465,1528,1628,1732,1840,1952,2068,2188,2303,2431,2563,2699,2809,2953],
        M: [14,26,42,62,84,106,122,152,180,213,251,287,331,362,412,450,504,560,624,666,711,779,857,911,997,1059,1125,1190,1264,1370,1452,1538,1628,1722,1809,1911,1989,2099,2213,2331],
        Q: [11,20,32,46,60,74,86,108,130,151,177,203,241,258,292,322,364,394,442,482,509,565,611,661,715,751,805,868,908,982,1030,1112,1168,1228,1283,1351,1423,1499,1579,1663],
        H: [7,14,24,34,44,58,64,84,98,119,137,155,177,194,220,250,280,310,338,382,403,439,461,511,535,593,625,658,698,742,790,842,898,958,983,1051,1093,1139,1219,1273]
    };

    function bestVersion(dataLen, ecLevel) {
        const caps = BYTE_CAPACITY[ecLevel];
        for (let v = 0; v < 40; v++) {
            if (caps[v] >= dataLen) return v + 1;
        }
        return -1;
    }

    function getSize(version) { return version * 4 + 17; }

    function getAlignmentPositions(version) {
        return ALIGNMENT_POSITIONS[version - 1];
    }

    function makeMatrix(version) {
        const size = getSize(version);
        const matrix = [];
        const reserved = [];
        for (let i = 0; i < size; i++) {
            matrix.push(new Array(size).fill(0));
            reserved.push(new Array(size).fill(false));
        }
        return { matrix, reserved, size };
    }

    function placeFinder(m, row, col) {
        for (let r = -1; r <= 7; r++) {
            for (let c = -1; c <= 7; c++) {
                const rr = row + r, cc = col + c;
                if (rr < 0 || rr >= m.size || cc < 0 || cc >= m.size) continue;
                m.reserved[rr][cc] = true;
                if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
                    if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                        m.matrix[rr][cc] = 1;
                    } else {
                        m.matrix[rr][cc] = 0;
                    }
                }
            }
        }
    }

    function placeAlignment(m, version) {
        const positions = getAlignmentPositions(version);
        for (const row of positions) {
            for (const col of positions) {
                if (m.reserved[row][col]) continue;
                for (let r = -2; r <= 2; r++) {
                    for (let c = -2; c <= 2; c++) {
                        const rr = row + r, cc = col + c;
                        m.reserved[rr][cc] = true;
                        if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
                            m.matrix[rr][cc] = 1;
                        } else {
                            m.matrix[rr][cc] = 0;
                        }
                    }
                }
            }
        }
    }

    function placeTiming(m) {
        for (let i = 8; i < m.size - 8; i++) {
            if (!m.reserved[6][i]) {
                m.reserved[6][i] = true;
                m.matrix[6][i] = i % 2 === 0 ? 1 : 0;
            }
            if (!m.reserved[i][6]) {
                m.reserved[i][6] = true;
                m.matrix[i][6] = i % 2 === 0 ? 1 : 0;
            }
        }
    }

    function reserveFormatInfo(m) {
        for (let i = 0; i < 8; i++) {
            m.reserved[8][i] = true;
            m.reserved[8][m.size - 1 - i] = true;
            m.reserved[i][8] = true;
            m.reserved[m.size - 1 - i][8] = true;
        }
        m.reserved[8][8] = true;
        m.reserved[m.size - 8][8] = true;
        m.matrix[m.size - 8][8] = 1; // dark module
    }

    function reserveVersionInfo(m, version) {
        if (version < 7) return;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {
                m.reserved[i][m.size - 11 + j] = true;
                m.reserved[m.size - 11 + j][i] = true;
            }
        }
    }

    function encodeData(text, version, ecLevel) {
        const bytes = new TextEncoder().encode(text);
        const bits = [];

        function pushBits(val, len) {
            for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
        }

        // Mode indicator (byte mode = 0100)
        pushBits(MODE_BYTE, 4);

        // Character count
        const ccBits = version <= 9 ? 8 : 16;
        pushBits(bytes.length, ccBits);

        // Data
        for (const b of bytes) pushBits(b, 8);

        // Terminator
        const totalDataBits = dataCodewordCount(version, ecLevel) * 8;
        const termLen = Math.min(4, totalDataBits - bits.length);
        pushBits(0, termLen);

        // Pad to byte boundary
        while (bits.length % 8 !== 0) bits.push(0);

        // Pad bytes
        let padToggle = false;
        while (bits.length < totalDataBits) {
            pushBits(padToggle ? PAD1 : PAD0, 8);
            padToggle = !padToggle;
        }

        // Convert bits to bytes
        const dataBytes = [];
        for (let i = 0; i < bits.length; i += 8) {
            let byte = 0;
            for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] || 0);
            dataBytes.push(byte);
        }

        return dataBytes;
    }

    // Block layout for a version and level. Both the block counts and the data
    // codewords per block come from the spec table: they cannot be derived from
    // the byte capacity, which counts encodable characters rather than codewords.
    function getBlockTable(version, ecLevel) {
        const [ecPerBlock, count1, data1, count2, data2] = RS_BLOCKS[ecLevel][version - 1];
        const blocks = [{ count: count1, dataPerBlock: data1, ecPerBlock }];
        if (count2 > 0) blocks.push({ count: count2, dataPerBlock: data2, ecPerBlock });
        return blocks;
    }

    function dataCodewordCount(version, ecLevel) {
        return getBlockTable(version, ecLevel).reduce((total, g) => total + g.count * g.dataPerBlock, 0);
    }

    function interleaveBlocks(dataBytes, version, ecLevel) {
        const blockInfo = getBlockTable(version, ecLevel);
        const allDataBlocks = [];
        const allEcBlocks = [];
        let offset = 0;

        for (const group of blockInfo) {
            for (let i = 0; i < group.count; i++) {
                const block = dataBytes.slice(offset, offset + group.dataPerBlock);
                offset += group.dataPerBlock;
                allDataBlocks.push(block);
                allEcBlocks.push(rsEncode(block, group.ecPerBlock));
            }
        }

        // Interleave data
        const result = [];
        const maxDataLen = Math.max(...allDataBlocks.map(b => b.length));
        for (let i = 0; i < maxDataLen; i++) {
            for (const block of allDataBlocks) {
                if (i < block.length) result.push(block[i]);
            }
        }
        // Interleave EC
        const maxEcLen = Math.max(...allEcBlocks.map(b => b.length));
        for (let i = 0; i < maxEcLen; i++) {
            for (const block of allEcBlocks) {
                if (i < block.length) result.push(block[i]);
            }
        }
        return result;
    }

    function placeData(m, codewords) {
        const bits = [];
        for (const cw of codewords) {
            for (let i = 7; i >= 0; i--) bits.push((cw >> i) & 1);
        }

        let bitIdx = 0;
        let upward = true;
        for (let right = m.size - 1; right >= 1; right -= 2) {
            if (right === 6) right = 5; // skip timing column
            const rows = upward ? Array.from({length: m.size}, (_, i) => m.size - 1 - i) : Array.from({length: m.size}, (_, i) => i);
            for (const row of rows) {
                for (const col of [right, right - 1]) {
                    if (!m.reserved[row][col]) {
                        if (bitIdx < bits.length) {
                            m.matrix[row][col] = bits[bitIdx++];
                        }
                    }
                }
            }
            upward = !upward;
        }
    }

    const MASK_FUNCTIONS = [
        (r, c) => (r + c) % 2 === 0,
        (r, c) => r % 2 === 0,
        (r, c) => c % 3 === 0,
        (r, c) => (r + c) % 3 === 0,
        (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
        (r, c) => (r * c) % 2 + (r * c) % 3 === 0,
        (r, c) => ((r * c) % 2 + (r * c) % 3) % 2 === 0,
        (r, c) => ((r + c) % 2 + (r * c) % 3) % 2 === 0,
    ];

    function applyMask(m, maskIdx) {
        const fn = MASK_FUNCTIONS[maskIdx];
        for (let r = 0; r < m.size; r++) {
            for (let c = 0; c < m.size; c++) {
                if (!m.reserved[r][c] && fn(r, c)) {
                    m.matrix[r][c] ^= 1;
                }
            }
        }
    }

    function penaltyScore(m) {
        let score = 0;
        const s = m.size;
        // Rule 1: consecutive same-color modules in row/col
        for (let r = 0; r < s; r++) {
            let count = 1;
            for (let c = 1; c < s; c++) {
                if (m.matrix[r][c] === m.matrix[r][c - 1]) { count++; }
                else { if (count >= 5) score += count - 2; count = 1; }
            }
            if (count >= 5) score += count - 2;
        }
        for (let c = 0; c < s; c++) {
            let count = 1;
            for (let r = 1; r < s; r++) {
                if (m.matrix[r][c] === m.matrix[r - 1][c]) { count++; }
                else { if (count >= 5) score += count - 2; count = 1; }
            }
            if (count >= 5) score += count - 2;
        }
        // Rule 2: 2x2 blocks
        for (let r = 0; r < s - 1; r++) {
            for (let c = 0; c < s - 1; c++) {
                const v = m.matrix[r][c];
                if (v === m.matrix[r][c+1] && v === m.matrix[r+1][c] && v === m.matrix[r+1][c+1]) score += 3;
            }
        }
        // Rule 3: finder-like pattern
        const pat1 = [1,0,1,1,1,0,1,0,0,0,0];
        const pat2 = [0,0,0,0,1,0,1,1,1,0,1];
        for (let r = 0; r < s; r++) {
            for (let c = 0; c <= s - 11; c++) {
                let match1 = true, match2 = true;
                for (let k = 0; k < 11; k++) {
                    if (m.matrix[r][c+k] !== pat1[k]) match1 = false;
                    if (m.matrix[r][c+k] !== pat2[k]) match2 = false;
                }
                if (match1 || match2) score += 40;
            }
        }
        for (let c = 0; c < s; c++) {
            for (let r = 0; r <= s - 11; r++) {
                let match1 = true, match2 = true;
                for (let k = 0; k < 11; k++) {
                    if (m.matrix[r+k][c] !== pat1[k]) match1 = false;
                    if (m.matrix[r+k][c] !== pat2[k]) match2 = false;
                }
                if (match1 || match2) score += 40;
            }
        }
        // Rule 4: proportion of dark modules
        let dark = 0;
        for (let r = 0; r < s; r++) for (let c = 0; c < s; c++) if (m.matrix[r][c]) dark++;
        const pct = (dark / (s * s)) * 100;
        score += Math.floor(Math.abs(pct - 50) / 5) * 10;
        return score;
    }

    const FORMAT_INFO_STRINGS = (function() {
        const table = {};
        const FORMAT_POLY = 0x537;
        const FORMAT_MASK = 0x5412;
        for (const [level, bits] of [['M',0],['L',1],['H',2],['Q',3]]) {
            table[level] = [];
            for (let mask = 0; mask < 8; mask++) {
                let data = (bits << 3) | mask;
                let encoded = data << 10;
                for (let i = 14; i >= 10; i--) {
                    if (encoded & (1 << i)) encoded ^= FORMAT_POLY << (i - 10);
                }
                encoded = ((data << 10) | encoded) ^ FORMAT_MASK;
                table[level].push(encoded);
            }
        }
        return table;
    })();

    function placeFormatInfo(m, ecLevel, maskIdx) {
        const info = FORMAT_INFO_STRINGS[ecLevel][maskIdx];
        const bits = [];
        for (let i = 14; i >= 0; i--) bits.push((info >> i) & 1);

        // Around top-left finder
        const positions1 = [
            [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],
            [7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]
        ];
        for (let i = 0; i < 15; i++) {
            m.matrix[positions1[i][0]][positions1[i][1]] = bits[i];
        }
        // Bottom-left and top-right
        const positions2 = [
            [m.size-1,8],[m.size-2,8],[m.size-3,8],[m.size-4,8],[m.size-5,8],[m.size-6,8],[m.size-7,8],
            [8,m.size-8],[8,m.size-7],[8,m.size-6],[8,m.size-5],[8,m.size-4],[8,m.size-3],[8,m.size-2],[8,m.size-1]
        ];
        for (let i = 0; i < 15; i++) {
            m.matrix[positions2[i][0]][positions2[i][1]] = bits[i];
        }
    }

    function placeVersionInfo(m, version) {
        if (version < 7) return;
        const VERSION_POLY = 0x1F25;
        let data = version << 12;
        let rem = data;
        for (let i = 17; i >= 12; i--) {
            if (rem & (1 << i)) rem ^= VERSION_POLY << (i - 12);
        }
        const encoded = data | rem;
        const bits = [];
        for (let i = 17; i >= 0; i--) bits.push((encoded >> i) & 1);

        let idx = 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {
                const bit = bits[17 - idx];
                m.matrix[i][m.size - 11 + j] = bit;
                m.matrix[m.size - 11 + j][i] = bit;
                idx++;
            }
        }
    }

    function generate(text, ecLevel) {
        const bytes = new TextEncoder().encode(text);
        const version = bestVersion(bytes.length, ecLevel);
        if (version === -1) return null;

        const dataBytes = encodeData(text, version, ecLevel);
        const codewords = interleaveBlocks(dataBytes, version, ecLevel);

        let bestMask = 0, bestScore = Infinity, bestMatrix = null;
        for (let mask = 0; mask < 8; mask++) {
            const m = makeMatrix(version);
            placeFinder(m, 0, 0);
            placeFinder(m, 0, m.size - 7);
            placeFinder(m, m.size - 7, 0);
            placeAlignment(m, version);
            placeTiming(m);
            reserveFormatInfo(m);
            reserveVersionInfo(m, version);
            placeData(m, codewords);
            applyMask(m, mask);
            placeFormatInfo(m, ecLevel, mask);
            placeVersionInfo(m, version);
            const score = penaltyScore(m);
            if (score < bestScore) {
                bestScore = score;
                bestMask = mask;
                bestMatrix = m;
            }
        }
        return { matrix: bestMatrix.matrix, size: bestMatrix.size, version };
    }

    return { generate, bestVersion };
})();

// ── Rendering ──

function qrInit() {
    // Nothing special needed on init
}

function qrGenerate(element) {
    const widget = element.closest('.qr-widget');
    const text = widget.querySelector('textarea').value;
    const wrap = widget.querySelector('.qr-canvas-wrap');
    const info = widget.querySelector('.qr-info');
    const buttons = widget.querySelectorAll('.qr-action-btn');

    if (!text) {
        wrap.innerHTML = '<span class="qr-placeholder">Enter text above to generate a QR code</span>';
        info.textContent = '';
        buttons.forEach(b => b.disabled = true);
        return;
    }

    const ecLevel = widget.querySelector('.qr-ec-select').value;
    const pixelSize = parseInt(widget.querySelector('.qr-size-input').value) || 256;
    const fgColor = widget.querySelector('.qr-fg-color').value;
    const bgColor = widget.querySelector('.qr-bg-color').value;

    const result = QR.generate(text, ecLevel);
    if (!result) {
        wrap.innerHTML = '<span class="qr-placeholder" style="color: var(--error-text);">Text too long for QR code</span>';
        info.textContent = '';
        buttons.forEach(b => b.disabled = true);
        return;
    }

    const { matrix, size, version } = result;
    const quietZone = 4;
    const totalModules = size + quietZone * 2;
    const scale = pixelSize / totalModules;

    const canvas = document.createElement('canvas');
    canvas.width = pixelSize;
    canvas.height = pixelSize;
    canvas.className = 'qr-canvas';
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, pixelSize, pixelSize);

    // Modules
    ctx.fillStyle = fgColor;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c]) {
                const x = Math.round((c + quietZone) * scale);
                const y = Math.round((r + quietZone) * scale);
                const w = Math.round((c + quietZone + 1) * scale) - x;
                const h = Math.round((r + quietZone + 1) * scale) - y;
                ctx.fillRect(x, y, w, h);
            }
        }
    }

    wrap.innerHTML = '';
    wrap.appendChild(canvas);

    const byteLen = new TextEncoder().encode(text).length;
    info.textContent = `Version ${version} | ${size}×${size} modules | ${byteLen} bytes | EC: ${ecLevel}`;
    buttons.forEach(b => b.disabled = false);
}

function qrDownloadPNG(btn) {
    const widget = btn.closest('.qr-widget');
    const canvas = widget.querySelector('.qr-canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'qrcode.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
}

function qrDownloadSVG(btn) {
    const widget = btn.closest('.qr-widget');
    const text = widget.querySelector('textarea').value;
    if (!text) return;

    const ecLevel = widget.querySelector('.qr-ec-select').value;
    const fgColor = widget.querySelector('.qr-fg-color').value;
    const bgColor = widget.querySelector('.qr-bg-color').value;

    const result = QR.generate(text, ecLevel);
    if (!result) return;

    const { matrix, size } = result;
    const quietZone = 4;
    const total = size + quietZone * 2;
    const moduleSize = 10;
    const svgSize = total * moduleSize;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">`;
    svg += `<rect width="${svgSize}" height="${svgSize}" fill="${bgColor}"/>`;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c]) {
                svg += `<rect x="${(c + quietZone) * moduleSize}" y="${(r + quietZone) * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="${fgColor}"/>`;
            }
        }
    }
    svg += '</svg>';

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.download = 'qrcode.svg';
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
}

function qrCopyToClipboard(btn) {
    const widget = btn.closest('.qr-widget');
    const canvas = widget.querySelector('.qr-canvas');
    if (!canvas) return;
    canvas.toBlob(blob => {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(() => {
            const orig = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = orig, 1000);
        });
    });
}

console.log('QR Code Generator plugin loaded');
