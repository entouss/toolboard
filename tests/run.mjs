// Runs every suite against a server rooted at the repo, and reports what passed.
//   node tests/run.mjs             all suites
//   node tests/run.mjs curr-grid   just the ones whose name contains that
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(HERE, '..');
const PORT = process.env.PORT || 8777;
const filter = process.argv[2] || '';

// Suites that are not run as part of the sweep: media builders, and anything
// needing a second port.
const SKIP = new Set(['run.mjs', 'curr-lib.mjs', 'cdoc-lib.mjs', 'cursor.mjs', 'video.mjs']);

const suites = fs.readdirSync(HERE)
    .filter((f) => f.endsWith('.mjs') && !SKIP.has(f))
    .filter((f) => !filter || f.includes(filter))
    .sort();

fs.mkdirSync(path.join(HERE, 'out'), { recursive: true });

// cdoc-known reads the catalog as it was before its bugs were fixed, which is a
// commit rather than a file. Produce it if it is not there.
const before = path.join(HERE, 'out', 'ashford-before.json');
if (!fs.existsSync(before)) {
    try {
        const git = spawn('git', ['show', '4563864:learn/data/ashford-2025-2026.json'],
            { cwd: REPO, stdio: ['ignore', 'pipe', 'ignore'] });
        const chunks = [];
        git.stdout.on('data', (c) => chunks.push(c));
        await new Promise((r) => git.on('close', r));
        if (chunks.length) fs.writeFileSync(before, Buffer.concat(chunks));
    } catch (e) { /* cdoc-known will report it */ }
}

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', REPO],
    { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1200));

let pass = 0, fail = 0, broke = [];
for (const suite of suites) {
    const out = await new Promise((resolve) => {
        const p = spawn('node', [path.join(HERE, suite)], { cwd: HERE });
        let text = '';
        p.stdout.on('data', (c) => text += c);
        p.stderr.on('data', (c) => text += c);
        p.on('close', () => resolve(text));
    });
    const p = (out.match(/^ {2}PASS/gm) || []).length;
    const f = (out.match(/^ {2}FAIL/gm) || []).length;
    pass += p; fail += f;
    const errored = /Error:|Cannot find module/.test(out) && !p;
    if (errored) broke.push(suite);
    console.log((f || errored ? '✗' : '✓') + ' ' + suite.replace('.mjs', '').padEnd(18) +
        String(p).padStart(3) + ' pass' + (f ? '  ' + f + ' FAIL' : '') +
        (errored ? '  did not run' : ''));
    if (f) out.split('\n').filter((l) => l.startsWith('  FAIL')).forEach((l) => console.log('   ' + l.trim()));
    if (errored) console.log('   ' + (out.split('\n').find((l) => /Error/.test(l)) || '').trim().slice(0, 100));
}
server.kill();
console.log('\n' + pass + ' passing, ' + fail + ' failing, across ' + suites.length + ' suites');
if (broke.length) console.log('did not run: ' + broke.join(', '));
process.exit(fail || broke.length ? 1 : 0);
