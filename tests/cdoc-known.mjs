// The test that matters: point it at a file with known bugs and see if it finds them.
// This is the Ashford catalog as it was committed before those bugs were fixed.
import { open, ok, finish, check, OUT } from './cdoc-lib.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const BAD = JSON.parse(fs.readFileSync(path.join(HERE, 'out', 'ashford-before.json'), 'utf8'));
const { browser, page, errors } = await open({ doc: BAD, size: [1100, 780] });

const r = await check(page);
const of = (kind) => r.findings.filter(f => f.kind === kind);

console.log('  summary: ' + r.errors + ' errors, ' + r.warnings + ' warnings, ' +
    r.courses + ' courses');

// 1. The four Theology prerequisites that named a year instead of a course.
const unresolved = of('prereq-unresolved');
const theology = unresolved.filter(f => /grade Theology/.test(f.message));
// Five references across four titles: two grade-12 courses both name the 11th.
ok('it finds every prerequisite naming a year rather than a course', theology.length === 5,
    theology.length + ' — ' + JSON.stringify(theology.map(f => f.path)));
ok('across three distinct titles — two grade-12 courses both name the eleventh',
    new Set(theology.map(f => (f.message.match(/needs "([^"]+)"/) || [])[1])).size === 3,
    JSON.stringify([...new Set(theology.map(f => (f.message.match(/needs "([^"]+)"/) || [])[1]))]));
// "9th grade Theology" shares no word with "Faith and Revelation / Christology",
// so there is nothing to suggest — and inventing one would be worse than silence.
ok('and offers no guess where the words have nothing in common',
    theology.every(f => !f.detail.some(d => /Did you mean/.test(d))),
    JSON.stringify(theology[0] && theology[0].detail));

// 2. The six lines wrongly marked as a choice. They carry the flag, so a check that
//    only looked at unflagged lines would sail past every one of them.
const unclear = of('choice-unclear');
const wrongly = unclear.filter(f => f.detail.some(d => /any one of them will do/.test(d)));
const named = wrongly.map(f => (f.message.match(/"([^"]+)"/) || [])[1]);
ok('it finds every line marked as a choice with nothing to back it', wrongly.length === 7,
    wrongly.length + ' — ' + JSON.stringify(named));
['Advanced Placement Biology', 'Advanced Placement Environmental Science', '3-D Sculpture',
 'Emergency Medical Technician Honors', 'Algebra II Honors'].forEach(t => {
    ok('  including ' + t, named.indexOf(t) !== -1, JSON.stringify(named));
});
ok('and says which way the file currently reads them',
    wrongly.every(f => f.detail.some(d => /nothing in the printed text says so/.test(d))));

// 3. It points at the exact place in the file.
ok('every finding carries a JSON pointer',
    r.findings.every(f => /^\/[a-z_]/.test(f.path)),
    JSON.stringify(r.findings.slice(0, 2).map(f => f.path)));

await page.screenshot({ path: OUT + '/cdoc-known.png' });
await finish(browser, errors);
