import { ENV } from '../config/env';

/**
 * Basic JSON fetch wrapper with environment-driven base URL, timeout and error handling.
 * All methods return { data, error, status }.
 */
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

function buildUrl(path) {
  if (!path) return ENV.apiBase;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = ENV.apiBase.endsWith('/') ? ENV.apiBase.slice(0, -1) : ENV.apiBase;
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

// PUBLIC_INTERFACE
/**
 * Perform a GET request relative to API base.
 * @param {string} path - The path to fetch (e.g., '/health' or 'health')
 * @param {object} options - Additional fetch options
 */
export async function apiGet(path, options = {}) {
  return doFetch(buildUrl(path), {
    method: 'GET',
    headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) },
    ...options,
  });
}

// PUBLIC_INTERFACE
/**
 * Perform a POST request relative to API base.
 * @param {string} path - The path to post to (e.g., '/chat', 'chat')
 * @param {object} body - JSON serializable body
 * @param {object} options - Additional fetch options
 */
export async function apiPost(path, body = {}, options = {}) {
  return doFetch(buildUrl(path), {
    method: 'POST',
    headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) },
    body: JSON.stringify(body),
    ...options,
  });
}

// PUBLIC_INTERFACE
/**
 * Perform a streaming POST request (placeholder for future streaming support).
 * Currently behaves like apiPost; update when server supports SSE/streaming.
 */
export async function apiPostStream(path, body = {}, options = {}) {
  return apiPost(path, body, options);
}
