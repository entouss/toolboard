// A near miss is offered as a question. A miss is left alone.
import { open, ok, finish, check, OUT } from './cdoc-lib.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const W = JSON.parse(fs.readFileSync(path.join(HERE, '..', 'learn', 'data') + '/westhaven-2026-2027.json', 'utf8'));

// Undo the title_variants that made these resolve, so the catalog is as it was
// when the pathway silently read "1 of 9".
W.courses.forEach(c => { c.title_variants = []; });
const { browser, page, errors } = await open({ doc: W, size: [1100, 780] });

const r = await check(page);
const paths = r.findings.filter(f => f.kind === 'pathway-unresolved');
const said = (title) => {
    const f = paths.find(x => x.message.includes('"' + title + '"'));
    return f ? (f.detail[0] || '') : null;
};
console.log('  unresolved pathway titles: ' + paths.length);

ok('it finds the pathway titles that match nothing', paths.length >= 5, String(paths.length));
ok('"AICE U.S. History" is traced to United States History',
    /AICE United States History/.test(said('AICE U.S. History') || ''), said('AICE U.S. History'));
ok('"AICE Environmental Mgmt." to Environmental Management',
    /AICE Environmental Management/.test(said('AICE Environmental Mgmt.') || ''),
    said('AICE Environmental Mgmt.'));
ok('"AICE International World History" to International History',
    /AICE International History/.test(said('AICE International World History') || ''),
    said('AICE International World History'));
ok('and each suggestion is phrased as a question, not an answer',
    paths.filter(f => f.detail.length).every(f => /^Did you mean: /.test(f.detail[0])),
    JSON.stringify(paths.filter(f => f.detail.length)[0]));

// Nothing invented for a title with no relation to anything in the catalog.
const wild = await check(page, Object.assign({}, W, { courses: W.courses.slice(0, 20),
    program_groupings: [{ name: 'P', groups: [{ name: 'G', courses: ['Underwater Basket Weaving'] }] }] }));
const one = wild.findings.filter(f => f.kind === 'pathway-unresolved');
ok('a title with nothing close gets no suggestion at all',
    one.length === 1 && one[0].detail.length === 0, JSON.stringify(one));

await finish(browser, errors);
