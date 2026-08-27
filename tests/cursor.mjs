// The same walkthrough, but the visible steps are real clicks with a cursor to
// follow. Playwright records the page, not the pointer, so the pointer is drawn
// into the page — and it is put where the click actually lands.
export const CURSOR_CSS = `
#vcur { position: fixed; z-index: 100000; left: 0; top: 0; width: 22px; height: 22px;
        pointer-events: none; transition: transform .55s cubic-bezier(.4,0,.2,1);
        transform: translate(-100px,-100px); }
#vcur svg { display: block; filter: drop-shadow(0 1px 2px rgba(0,0,0,.45)); }
#vring { position: fixed; z-index: 99999; left: 0; top: 0; width: 34px; height: 34px;
         margin: -17px 0 0 -17px; border-radius: 50%; pointer-events: none;
         border: 2px solid #3498db; opacity: 0; transform: scale(.3); }
#vring.tap { animation: vtap .45s ease-out; }
@keyframes vtap { 0% { opacity: .9; transform: scale(.3) } 100% { opacity: 0; transform: scale(1.5) } }
`;

export async function installCursor(page) {
    await page.evaluate((css) => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        const cur = document.createElement('div');
        cur.id = 'vcur';
        cur.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22">' +
            '<path d="M3 2 L3 17 L7.2 13.2 L10 19.5 L12.6 18.3 L9.9 12.2 L15.5 12 Z" ' +
            'fill="#fff" stroke="#1a1a2e" stroke-width="1.3" stroke-linejoin="round"/></svg>';
        document.body.appendChild(cur);
        const ring = document.createElement('div');
        ring.id = 'vring';
        document.body.appendChild(ring);
    }, CURSOR_CSS);
}

// Glide to an element's centre and stop there. Returns the point, so the click that
// follows lands exactly where the cursor is standing.
export async function moveTo(page, selector, opts = {}) {
    const point = await page.evaluate(({ sel, nth }) => {
        const el = document.querySelectorAll(sel)[nth || 0];
        if (!el) return null;
        el.scrollIntoView({ block: 'center', behavior: 'instant' });
        const b = el.getBoundingClientRect();
        const x = b.left + Math.min(b.width / 2, 120);
        const y = b.top + b.height / 2;
        document.getElementById('vcur').style.transform =
            'translate(' + (x - 3) + 'px,' + (y - 2) + 'px)';
        return { x, y };
    }, { sel: selector, nth: opts.nth });
    await page.waitForTimeout(opts.settle || 620);
    return point;
}

export async function clickAt(page, selector, opts = {}) {
    const p = await moveTo(page, selector, opts);
    if (!p) throw new Error('nothing at ' + selector);
    await page.evaluate(({ x, y }) => {
        const r = document.getElementById('vring');
        r.style.left = x + 'px'; r.style.top = y + 'px';
        r.classList.remove('tap'); void r.offsetWidth; r.classList.add('tap');
    }, p);
    await page.waitForTimeout(120);
    await page.mouse.click(p.x, p.y);
    await page.waitForTimeout(opts.after || 450);
}

// A cell fills from the top, so its centre is a card as soon as one is there, and
// clicking a card is not the same as clicking the cell. Aim at the empty part.
export async function clickEmptyIn(page, selector, opts = {}) {
    const p = await page.evaluate((sel) => {
        const cell = document.querySelector(sel);
        if (!cell) return null;
        cell.scrollIntoView({ block: 'center', behavior: 'instant' });
        const b = cell.getBoundingClientRect();
        const cards = Array.from(cell.querySelectorAll('.curr-card'));
        const floor = cards.length ? cards[cards.length - 1].getBoundingClientRect().bottom : b.top;
        const y = (b.bottom - floor) > 14 ? (floor + b.bottom) / 2 : b.top + 6;
        const x = b.left + Math.min(b.width / 2, 120);
        document.getElementById('vcur').style.transform =
            'translate(' + (x - 3) + 'px,' + (y - 2) + 'px)';
        return { x, y };
    }, selector);
    if (!p) throw new Error('no cell at ' + selector);
    await page.waitForTimeout(opts.settle || 560);
    await page.evaluate(({ x, y }) => {
        const r = document.getElementById('vring');
        r.style.left = x + 'px'; r.style.top = y + 'px';
        r.classList.remove('tap'); void r.offsetWidth; r.classList.add('tap');
    }, p);
    await page.waitForTimeout(120);
    await page.mouse.click(p.x, p.y);
    await page.waitForTimeout(opts.after || 450);
}

// Placing a course the way a person does: tap the row, tap the year.
export async function placeByClick(page, title, level) {
    await page.evaluate((t) => {
        const row = Array.from(document.querySelectorAll('.curr-course'))
            .find(r => (r.querySelector('.curr-course-title') || {}).textContent === t);
        if (row) row.setAttribute('data-vtarget', '1');
    }, title);
    await clickAt(page, '.curr-course[data-vtarget]', { after: 320 });
    await page.evaluate(() => {
        const r = document.querySelector('.curr-course[data-vtarget]');
        if (r) r.removeAttribute('data-vtarget');
    });
    await clickEmptyIn(page, '.curr-cell[data-term="' + level + '-FY"]', { after: 420 });
}
