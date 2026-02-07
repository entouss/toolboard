// Productivity Tools Toolbox Plugin
// Contains the Pomodoro Timer and Analog Clock Reader

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

/* Analog Clock Widget Styles */
.clock-widget { background: var(--bg-tertiary); padding: 15px; border-radius: 6px; text-align: center; }
.clock-face-container { width: 200px; height: 200px; margin: 0 auto 8px; }
.clock-svg { width: 100%; height: 100%; display: block; }
.clock-face { fill: var(--bg-primary); stroke: var(--text-muted); stroke-width: 2; }
.clock-number { font-size: 14px; font-weight: 600; fill: var(--text-primary); font-family: system-ui, -apple-system, sans-serif; }
.clock-hand-hr { stroke: var(--text-primary); stroke-width: 4.5; stroke-linecap: round; }
.clock-hand-min { stroke: var(--text-secondary); stroke-width: 2.5; stroke-linecap: round; }
.clock-hand-grab { stroke: transparent; stroke-width: 22; stroke-linecap: round; cursor: grab; pointer-events: stroke; }
.clock-hand-grab:active { cursor: grabbing; }
.clock-center-dot { fill: var(--text-primary); }
.clock-digital { font-size: 28px; font-weight: 700; font-family: monospace; color: var(--text-primary); margin-bottom: 8px; line-height: 1.2; }
.clock-controls { display: flex; justify-content: center; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }
.clock-section-title { font-size: 11px; font-weight: 600; color: var(--text-muted); margin: 8px 0 6px; letter-spacing: 1px; }
.clock-target { font-size: 14px; font-weight: 600; color: var(--text-primary); padding: 8px; background: var(--bg-secondary); border-radius: 4px; margin-bottom: 8px; }
.clock-feedback { font-size: 13px; font-weight: 600; margin-top: 6px; min-height: 18px; }
.clock-score { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.clock-answer-input { padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 16px; font-family: monospace; width: 80px; text-align: center; background: var(--input-bg); color: var(--text-primary); margin-bottom: 6px; }
.clock-mode-select { padding: 5px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--input-bg); color: var(--text-primary); cursor: pointer; }

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
// ANALOG CLOCK READER
// =============================================

// Pre-build SVG tick marks and numbers for the clock face
var clockFaceSvg = '';
(function() {
    var i, angle, isHour, len, w, r1, r2, rad, x1, y1, x2, y2;
    for (i = 0; i < 60; i++) {
        angle = i * 6;
        isHour = i % 5 === 0;
        len = isHour ? 8 : 4;
        w = isHour ? 2 : 1;
        r1 = 88;
        r2 = r1 - len;
        rad = angle * Math.PI / 180;
        x1 = 100 + r1 * Math.sin(rad);
        y1 = 100 - r1 * Math.cos(rad);
        x2 = 100 + r2 * Math.sin(rad);
        y2 = 100 - r2 * Math.cos(rad);
        clockFaceSvg += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="var(--text-muted)" stroke-width="' + w + '" stroke-linecap="round"/>';
    }
    for (i = 1; i <= 12; i++) {
        rad = i * 30 * Math.PI / 180;
        x1 = 100 + 72 * Math.sin(rad);
        y1 = 100 - 72 * Math.cos(rad) + 1;
        clockFaceSvg += '<text x="' + x1.toFixed(1) + '" y="' + y1.toFixed(1) + '" text-anchor="middle" dominant-baseline="central" class="clock-number">' + i + '</text>';
    }
})();

var clockState = {
    hour: 12,
    minute: 0,
    dragging: null,
    challengeMode: null,
    targetHour: 0,
    targetMinute: 0,
    score: 0,
    total: 0
};

function initClock() {
    // Clean up any previous document-level listeners
    document.removeEventListener('mousemove', clockDrag);
    document.removeEventListener('touchmove', clockDrag);
    document.removeEventListener('mouseup', clockEndDrag);
    document.removeEventListener('touchend', clockEndDrag);

    var minGrab = document.getElementById('clockMinGrab');
    var hrGrab = document.getElementById('clockHrGrab');

    if (minGrab) {
        minGrab.addEventListener('mousedown', function(e) { e.preventDefault(); clockState.dragging = 'minute'; });
        minGrab.addEventListener('touchstart', function(e) { e.preventDefault(); clockState.dragging = 'minute'; }, {passive: false});
    }
    if (hrGrab) {
        hrGrab.addEventListener('mousedown', function(e) { e.preventDefault(); clockState.dragging = 'hour'; });
        hrGrab.addEventListener('touchstart', function(e) { e.preventDefault(); clockState.dragging = 'hour'; }, {passive: false});
    }

    document.addEventListener('mousemove', clockDrag);
    document.addEventListener('touchmove', clockDrag, {passive: false});
    document.addEventListener('mouseup', clockEndDrag);
    document.addEventListener('touchend', clockEndDrag);

    clockState.hour = 12;
    clockState.minute = 0;
    clockState.challengeMode = null;
    clockState.score = 0;
    clockState.total = 0;
    clockRender();
}

function clockDrag(e) {
    if (!clockState.dragging) return;
    if (clockState.challengeMode === 'read') { clockState.dragging = null; return; }
    e.preventDefault();
    var svg = document.getElementById('clockSvg');
    if (!svg) return;
    var rect = svg.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    var svgX = (clientX - rect.left) / rect.width * 200;
    var svgY = (clientY - rect.top) / rect.height * 200;
    var dx = svgX - 100;
    var dy = -(svgY - 100);
    var angle = Math.atan2(dx, dy) * 180 / Math.PI;
    if (angle < 0) angle += 360;

    if (clockState.dragging === 'minute') {
        clockState.minute = Math.round(angle / 6) % 60;
    } else if (clockState.dragging === 'hour') {
        var h = Math.round(angle / 30);
        if (h === 0) h = 12;
        clockState.hour = h;
    }
    clockRender();
}

function clockEndDrag() {
    clockState.dragging = null;
}

function clockRender() {
    var st = clockState;
    var minAngle = st.minute * 6;
    var hrAngle = (st.hour % 12) * 30 + st.minute * 0.5;

    var minHand = document.getElementById('clockMinHand');
    var hrHand = document.getElementById('clockHrHand');
    var minGrab = document.getElementById('clockMinGrab');
    var hrGrab = document.getElementById('clockHrGrab');

    var minTrans = 'rotate(' + minAngle + ', 100, 100)';
    var hrTrans = 'rotate(' + hrAngle + ', 100, 100)';
    if (minHand) minHand.setAttribute('transform', minTrans);
    if (hrHand) hrHand.setAttribute('transform', hrTrans);
    if (minGrab) minGrab.setAttribute('transform', minTrans);
    if (hrGrab) hrGrab.setAttribute('transform', hrTrans);

    var digitalEl = document.getElementById('clockDigital');
    if (digitalEl) {
        if (st.challengeMode === 'read') {
            digitalEl.textContent = '??:??';
        } else {
            digitalEl.textContent = st.hour + ':' + (st.minute < 10 ? '0' : '') + st.minute;
        }
    }
}

function clockSetNow() {
    var now = new Date();
    var h = now.getHours();
    clockState.hour = h === 0 ? 12 : (h > 12 ? h - 12 : h);
    clockState.minute = now.getMinutes();
    clockState.challengeMode = null;
    clockClearChallenge();
    clockRender();
}

function clockRandomize() {
    clockState.hour = Math.floor(Math.random() * 12) + 1;
    clockState.minute = Math.floor(Math.random() * 12) * 5;
    clockState.challengeMode = null;
    clockClearChallenge();
    clockRender();
}

function clockClearChallenge() {
    var targetEl = document.getElementById('clockTarget');
    var feedbackEl = document.getElementById('clockFeedback');
    var checkBtn = document.getElementById('clockCheckBtn');
    var answerWrap = document.getElementById('clockAnswerWrap');
    if (targetEl) targetEl.style.display = 'none';
    if (feedbackEl) feedbackEl.textContent = '';
    if (checkBtn) checkBtn.style.display = 'none';
    if (answerWrap) answerWrap.style.display = 'none';
}

function clockNewChallenge() {
    var st = clockState;
    var modeEl = document.getElementById('clockChallengeMode');
    var mode = modeEl ? modeEl.value : 'set';

    st.targetHour = Math.floor(Math.random() * 12) + 1;
    st.targetMinute = Math.floor(Math.random() * 12) * 5;
    st.challengeMode = mode;

    var targetEl = document.getElementById('clockTarget');
    var feedbackEl = document.getElementById('clockFeedback');
    var checkBtn = document.getElementById('clockCheckBtn');
    var answerWrap = document.getElementById('clockAnswerWrap');

    if (mode === 'set') {
        if (targetEl) {
            targetEl.style.display = 'block';
            targetEl.textContent = 'Set the clock to ' + st.targetHour + ':' + (st.targetMinute < 10 ? '0' : '') + st.targetMinute;
        }
        st.hour = 12;
        st.minute = 0;
        if (answerWrap) answerWrap.style.display = 'none';
    } else {
        st.hour = st.targetHour;
        st.minute = st.targetMinute;
        if (targetEl) {
            targetEl.style.display = 'block';
            targetEl.textContent = 'What time does the clock show?';
        }
        if (answerWrap) {
            answerWrap.style.display = 'block';
            var input = document.getElementById('clockAnswerInput');
            if (input) { input.value = ''; input.focus(); }
        }
    }

    if (checkBtn) checkBtn.style.display = '';
    if (feedbackEl) feedbackEl.textContent = '';
    clockRender();
}

function clockCheckAnswer() {
    var st = clockState;
    var correct = false;

    if (st.challengeMode === 'set') {
        correct = (st.hour === st.targetHour && st.minute === st.targetMinute);
    } else if (st.challengeMode === 'read') {
        var input = document.getElementById('clockAnswerInput');
        if (input) {
            var val = input.value.trim();
            var parts = val.split(':');
            if (parts.length === 2) {
                var ih = parseInt(parts[0], 10);
                var im = parseInt(parts[1], 10);
                correct = (ih === st.targetHour && im === st.targetMinute);
            }
        }
    }

    st.total++;
    if (correct) st.score++;

    var feedbackEl = document.getElementById('clockFeedback');
    var answer = st.targetHour + ':' + (st.targetMinute < 10 ? '0' : '') + st.targetMinute;
    if (feedbackEl) {
        if (correct) {
            feedbackEl.innerHTML = '<span style="color:#27ae60;">\u2713 Correct!</span>';
        } else {
            feedbackEl.innerHTML = '<span style="color:#e74c3c;">\u2717 The answer is ' + answer + '</span>';
        }
    }

    // Reveal the time
    st.challengeMode = null;
    clockRender();

    var scoreEl = document.getElementById('clockScore');
    if (scoreEl) scoreEl.textContent = 'Score: ' + st.score + ' / ' + st.total;
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

// =============================================
// SCRIPT INJECTION FOR HTML EXPORT
// =============================================

(function injectScriptsForExport() {
    if (document.getElementById('productivity-tools-scripts')) return;

    var pomoFunctions = [initPomodoro, getModeLabel, getModeClass, getDurationForMode, playPomodoroBeep, advancePomodoroMode, togglePomodoro, resetPomodoro, skipPomodoro, togglePomodoroSettings, applyPomodoroSettings, updatePomodoroDisplay];
    var clockFunctions = [initClock, clockDrag, clockEndDrag, clockRender, clockSetNow, clockRandomize, clockClearChallenge, clockNewChallenge, clockCheckAnswer];
    var ucFunctions = [ucGetToolId, ucGetData, ucSaveData, ucInit, ucRenderCategories, ucRenderSelects, ucSetCategory, ucOnInput, ucOnUnitChange, ucSwap, ucConvertTemp, ucFormatNumber, ucConvert];
    var pbsFunctions = [pbsSpeedLabel, pbsToFraction, pbsFmtDuration, pbsGetTotalSeconds, pbsGetSpeed, pbsCalc, pbsSetSpeed, pbsRangeChanged, pbsInit];
    var allFunctions = pomoFunctions.concat(clockFunctions).concat(ucFunctions).concat(pbsFunctions);

    var code = '(function() {\n' +
        'if (typeof initPomodoro !== "undefined") return;\n' +
        'window.pomodoroState = ' + JSON.stringify(pomodoroState) + ';\n' +
        'window.POMO_RING_CIRCUMFERENCE = ' + POMO_RING_CIRCUMFERENCE + ';\n' +
        'window.clockState = ' + JSON.stringify(clockState) + ';\n' +
        'window.clockFaceSvg = ' + JSON.stringify(clockFaceSvg) + ';\n' +
        'window.UC_UNITS = ' + JSON.stringify(UC_UNITS) + ';\n' +
        'window.PBS_FRACTIONS = ' + JSON.stringify(PBS_FRACTIONS) + ';\n' +
        'window.PBS_PRESETS = ' + JSON.stringify(PBS_PRESETS) + ';\n' +
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
    tools: ['analog-clock', 'dice-roller', 'playback-speed-calc', 'pomodoro-timer', 'stopwatch', 'unit-converter', 'youtube-embed'],
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

// Analog Clock Reader
PluginRegistry.registerTool({
    id: 'analog-clock',
    name: 'Analog Clock',
    description: 'Interactive analog clock for telling time practice',
    icon: '\uD83D\uDD70',
    version: '1.0.0',
    toolbox: 'productivity',
    tags: ['clock', 'time', 'analog', 'practice', 'learn', 'education'],
    title: 'Analog Clock',
    content: '<div class="clock-widget">' +
        '<div class="clock-face-container">' +
            '<svg id="clockSvg" class="clock-svg" viewBox="0 0 200 200">' +
                '<circle class="clock-face" cx="100" cy="100" r="92"/>' +
                clockFaceSvg +
                '<line id="clockHrHand" class="clock-hand-hr" x1="100" y1="100" x2="100" y2="42"/>' +
                '<line id="clockMinHand" class="clock-hand-min" x1="100" y1="100" x2="100" y2="22"/>' +
                '<line id="clockHrGrab" class="clock-hand-grab" x1="100" y1="100" x2="100" y2="42"/>' +
                '<line id="clockMinGrab" class="clock-hand-grab" x1="100" y1="100" x2="100" y2="22"/>' +
                '<circle class="clock-center-dot" cx="100" cy="100" r="4"/>' +
            '</svg>' +
        '</div>' +
        '<div id="clockDigital" class="clock-digital">12:00</div>' +
        '<div class="clock-controls">' +
            '<button class="pomo-btn" onclick="clockSetNow()">Now</button>' +
            '<button class="pomo-btn" onclick="clockRandomize()">Random</button>' +
        '</div>' +
        '<div class="clock-section-title">PRACTICE</div>' +
        '<div id="clockTarget" class="clock-target" style="display:none"></div>' +
        '<div id="clockAnswerWrap" style="display:none;margin-bottom:6px;"><input type="text" id="clockAnswerInput" class="clock-answer-input" placeholder="H:MM" onkeydown="if(event.key===\'Enter\')clockCheckAnswer()"></div>' +
        '<div class="clock-controls">' +
            '<select id="clockChallengeMode" class="clock-mode-select"><option value="set">Set the Clock</option><option value="read">Read the Clock</option></select>' +
            '<button class="pomo-btn primary paused" onclick="clockNewChallenge()">New Challenge</button>' +
            '<button id="clockCheckBtn" class="pomo-btn" onclick="clockCheckAnswer()" style="display:none">Check</button>' +
        '</div>' +
        '<div id="clockFeedback" class="clock-feedback"></div>' +
        '<div id="clockScore" class="clock-score"></div>' +
    '</div>',
    onInit: 'initClock',
    defaultWidth: 340,
    defaultHeight: 500,
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

console.log('Productivity Tools plugin loaded (10 tools)');
