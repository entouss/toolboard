'use strict';

const ALLOWED_ORIGINS = new Set(['https://toolboard.me', 'https://webpagestickynotes.com', 'https://toolboard.webpagestickynotes.com']);
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const UPSTREAM_TIMEOUT_MS = 15_000;

const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^\[?::1\]?$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^169\.254\.\d+\.\d+$/,         // blocks GCP metadata endpoint 169.254.169.254
  /^\[?fe80:/i,
  /^metadata\.google\.internal$/i,
  /^\[?fc[0-9a-f]{2}:/i,
  /^\[?fd[0-9a-f]{2}:/i,
];

function isBlockedHost(h) { return BLOCKED_HOST_PATTERNS.some(re => re.test(h)); }

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '3600',
    'Vary': 'Origin',
  };
}

exports.icsProxy = async (req, res) => {
  const origin = req.headers['origin'] || '';
  if (!ALLOWED_ORIGINS.has(origin)) {
    res.status(403).set({ 'Content-Type': 'text/plain' }).send('Forbidden');
    return;
  }

  if (req.method === 'OPTIONS') {
    res.status(204).set(corsHeaders(origin)).send('');
    return;
  }

  const rawUrl = req.query.url;
  if (!rawUrl) {
    res.status(400).set(corsHeaders(origin)).send('Missing ?url=');
    return;
  }

  let target;
  try { target = new URL(rawUrl); } catch {
    res.status(400).set(corsHeaders(origin)).send('Invalid URL');
    return;
  }

  if (target.protocol !== 'https:' && target.protocol !== 'http:') {
    res.status(400).set(corsHeaders(origin)).send('Only http/https URLs permitted');
    return;
  }

  const hostname = target.hostname.replace(/^\[|\]$/g, '');
  if (isBlockedHost(hostname)) {
    res.status(400).set(corsHeaders(origin)).send('Target host not permitted');
    return;
  }

  // Forward body for methods that carry one
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  let upstreamBody;
  if (hasBody && req.rawBody && req.rawBody.length > 0) {
    if (req.rawBody.length > MAX_BODY_BYTES) {
      res.status(413).set(corsHeaders(origin)).send('Request body too large');
      return;
    }
    upstreamBody = req.rawBody;
  }

  const upstreamHeaders = { 'User-Agent': 'toolboard-cors-proxy/1.0 (toolboard.me)' };
  if (hasBody && req.headers['content-type']) {
    upstreamHeaders['Content-Type'] = req.headers['content-type'];
  }
  if (req.headers['authorization']) {
    upstreamHeaders['Authorization'] = req.headers['authorization'];
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let upstreamRes;
  try {
    upstreamRes = await fetch(target.toString(), {
      method: req.method,
      signal: controller.signal,
      redirect: 'follow',
      headers: upstreamHeaders,
      body: upstreamBody,
    });
  } catch (err) {
    clearTimeout(timer);
    res
      .status(err.name === 'AbortError' ? 504 : 502)
      .set(corsHeaders(origin))
      .send(err.name === 'AbortError' ? 'Upstream timed out' : 'Upstream fetch failed');
    return;
  }
  clearTimeout(timer);

  const contentLength = parseInt(upstreamRes.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_BODY_BYTES) {
    res.status(502).set(corsHeaders(origin)).send('Upstream response too large');
    return;
  }

  const reader = upstreamRes.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      reader.cancel();
      res.status(502).set(corsHeaders(origin)).send('Upstream response too large');
      return;
    }
    chunks.push(value);
  }

  const body = Buffer.concat(chunks.map(c => Buffer.from(c)));
  const contentType = upstreamRes.headers.get('content-type') || 'application/octet-stream';

  res
    .status(upstreamRes.status)
    .set({ ...corsHeaders(origin), 'Content-Type': contentType, 'Cache-Control': 'no-store' })
    .send(body);
};
