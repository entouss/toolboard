// The board's CORS proxy, run here as a plain function: who may ask it for what. The
// published boards may ask for anything public; a page with a "null" origin — a board
// opened from disk, or anything in a sandboxed frame — only for a school platform's
// API over https; nobody else at all.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ok = (l, p, d) => console.log((p ? '  PASS ' : '  FAIL ') + l + (d ? ' — ' + d : ''));
const { icsProxy } = require(path.join(HERE, '..', 'functions', 'ics-proxy', 'index.js'));

const fetched = [];
let redirectTo = null;
globalThis.fetch = async (url, opts) => {
    fetched.push({ url, auth: (opts.headers || {})['Authorization'] || null });
    const body = new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode('{"ok":true}')); c.close(); } });
    return { status: 200, url: redirectTo || url, headers: new Map([['content-type', 'application/json']]), body };
};

function call({ origin, method = 'GET', url, auth }) {
    return new Promise((resolve) => {
        const out = { status: 200, headers: {}, body: '' };
        const res = {
            status(s) { out.status = s; return this; },
            set(h) { Object.assign(out.headers, h); return this; },
            send(b) { out.body = String(b); resolve(out); return this; },
            write(b) { out.body += Buffer.from(b).toString(); return true; },
            end() { resolve(out); },
            destroy() { out.destroyed = true; resolve(out); },
            once() {}
        };
        const headers = {};
        if (origin !== undefined) headers.origin = origin;
        if (auth) headers.authorization = auth;
        icsProxy({ method, headers, query: url ? { url } : {} }, res);
    });
}

const SCHOOL = 'https://school.instructure.com/api/v1/users/self';
let r;

// The published boards, as before.
r = await call({ origin: 'https://toolboard.me', url: 'https://calendar.example.org/feed.ics' });
ok('a published board may still fetch anything public', r.status === 200 && r.headers['Access-Control-Allow-Origin'] === 'https://toolboard.me');
r = await call({ origin: 'https://elsewhere.example.org', url: SCHOOL });
ok('an origin not on the list is refused, as before', r.status === 403 && r.body === 'Forbidden' && !r.headers['Access-Control-Allow-Origin']);
r = await call({ url: SCHOOL });
ok('and so is a request with no origin at all', r.status === 403);

// A board opened from disk.
r = await call({ origin: 'null', method: 'OPTIONS', url: SCHOOL });
ok('from disk, the browser’s permission check is answered', r.status === 204 && r.headers['Access-Control-Allow-Origin'] === 'null' &&
    /Authorization/.test(r.headers['Access-Control-Allow-Headers']));
fetched.length = 0;
r = await call({ origin: 'null', url: SCHOOL, auth: 'Bearer abc' });
ok('from disk, a school platform’s API is reached', r.status === 200 && r.body === '{"ok":true}' && fetched.length === 1);
ok('with the token passed on in the header', fetched[0].auth === 'Bearer abc');
fetched.length = 0;
r = await call({ origin: 'null', url: 'https://calendar.example.org/feed.ics' });
ok('but nothing else is fetched for it', r.status === 403 && fetched.length === 0);
ok('and the refusal can be read by the page', r.body === 'Target host not permitted for this page' && r.headers['Access-Control-Allow-Origin'] === 'null');
r = await call({ origin: 'null', url: 'http://school.instructure.com/api/v1/users/self' });
ok('not over plain http either', r.status === 403);
r = await call({ origin: 'null', url: 'https://instructure.com.example.org/api' });
ok('nor a host that only looks like one', r.status === 403);
redirectTo = 'https://elsewhere.example.org/landing';
r = await call({ origin: 'null', url: SCHOOL });
ok('and what a school host redirects to elsewhere is not passed back', r.status === 403 && !/ok/.test(r.body));
redirectTo = null;
r = await call({ origin: 'https://toolboard.me', url: 'https://localhost/x' });
ok('private hosts are still refused for everyone', r.status === 400);

console.log('  (all ' + 12 + ' assertions reached)');
