import { ENV } from '../config/env';
import { MockApi } from './mock';

/**
 * Basic JSON fetch wrapper with environment-driven base URL, timeout and error handling.
 * All methods return { data, error, status }.
 */
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

function safeParseJSON(str) {
  try { return JSON.parse(str); } catch { return null; }
}

function buildUrl(path) {
  if (!path) return ENV.apiBase;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = (ENV.apiBase || '').endsWith('/') ? ENV.apiBase.slice(0, -1) : (ENV.apiBase || '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

async function doFetch(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    const contentType = res.headers.get('content-type') || '';
    let payload = null;
    if (contentType.includes('application/json')) {
      payload = await res.json();
    } else {
      payload = await res.text();
      // Try JSON parse if text looks like JSON
      const maybe = typeof payload === 'string' ? safeParseJSON(payload) : null;
      if (maybe) payload = maybe;
    }

    if (!res.ok) {
      return { data: null, error: { message: 'Request failed', status: res.status, payload }, status: res.status };
    }
    return { data: payload, error: null, status: res.status };
  } catch (err) {
    return { data: null, error: { message: err.message || 'Network error', code: err.name }, status: 0 };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Quick probe to see if API base appears reachable. Uses /health if available; falls back to a HEAD on base.
 */
async function probeHealth(timeoutMs = 3000) {
  // If no base configured, it's not reachable
  if (!ENV.apiBase) return { ok: false, reason: 'NO_BASE' };
  // Prefer /health
  const healthUrl = buildUrl('/health');
  const res = await doFetch(healthUrl, { method: 'GET', headers: DEFAULT_HEADERS }, timeoutMs);
  if (res.status === 200 && res.error === null) return { ok: true, reason: 'HEALTH_OK' };
  // Fallback: try base HEAD (some servers may not support it; treat non-network failures as present)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const r = await fetch(buildUrl(''), { method: 'HEAD', signal: controller.signal });
    clearTimeout(timer);
    return { ok: r.ok, reason: r.ok ? 'HEAD_OK' : `HEAD_${r.status}` };
  } catch (e) {
    return { ok: false, reason: 'HEAD_ERROR' };
  }
}

/**
 * Decide if we should use the mock:
 * - Feature flag mockApi true
 * - Or API base missing/unreachable
 */
async function shouldUseMock() {
  if (MockApi.isEnabled()) return true;
  const health = await probeHealth();
  if (!health.ok) return true;
  return false;
}

// PUBLIC_INTERFACE
/**
 * Perform a GET request relative to API base with seamless mock fallback.
 * @param {string} path - The path to fetch (e.g., '/health' or 'health')
 * @param {object} options - Additional fetch options
 */
export async function apiGet(path, options = {}) {
  if (await shouldUseMock()) {
    return MockApi.get(path);
  }
  return doFetch(buildUrl(path), {
    method: 'GET',
    headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) },
    ...options,
  });
}

// PUBLIC_INTERFACE
/**
 * Perform a POST request relative to API base with seamless mock fallback.
 * @param {string} path - The path to post to (e.g., '/chat', 'chat')
 * @param {object} body - JSON serializable body
 * @param {object} options - Additional fetch options
 */
export async function apiPost(path, body = {}, options = {}) {
  // Prefer network; if fails due to network, fall back to mock once.
  if (await shouldUseMock()) {
    return MockApi.post(path, body);
  }
  const res = await doFetch(buildUrl(path), {
    method: 'POST',
    headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) },
    body: JSON.stringify(body),
    ...options,
  });
  if (res.status === 0 || (res.error && (res.error.code === 'AbortError' || res.error.code === 'TypeError'))) {
    // Network-level failure: attempt mock
    const mockRes = await MockApi.post(path, body);
    // Wrap mock response to signal fallback used (non-breaking)
    if (!mockRes.error) {
      return { ...mockRes, fallback: 'mock' };
    }
  }
  return res;
}

// PUBLIC_INTERFACE
/**
 * Perform a streaming POST request (placeholder for future streaming support).
 * Currently behaves like apiPost; update when server supports SSE/streaming.
 */
export async function apiPostStream(path, body = {}, options = {}) {
  return apiPost(path, body, options);
}
