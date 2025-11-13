import { ENV } from '../config/env';

/**
 * PUBLIC_INTERFACE
 * A minimal local mock API for chat interactions.
 * - Simulates latency
 * - Generates a deterministic assistant reply from the latest user message
 * - Returns structured responses { data, error, status }
 */

const MOCK_LATENCY_MS = 600;

/**
 * Determine if mock mode is enabled via feature flags.
 * REACT_APP_FEATURE_FLAGS may be a JSON string or CSV-like string.
 */
function isMockEnabled() {
  const flagsRaw = ENV.featureFlags || '';
  try {
    // Try JSON object first: e.g., {"mockApi": true}
    const parsed = JSON.parse(flagsRaw);
    if (parsed && typeof parsed === 'object' && parsed.mockApi === true) {
      return true;
    }
  } catch {
    // Not JSON - try CSV/semicolon space-delimited flags e.g., "mockApi,foo" or "mockApi=true"
    const lowered = flagsRaw.toLowerCase();
    if (/\bmockapi\b/.test(lowered)) return true;
    if (/\bmockapi=true\b/.test(lowered)) return true;
  }
  return false;
}

/**
 * Build a short "assistant-like" response based on the latest user message.
 */
function buildAssistantReply(messages = []) {
  const lastUser = [...messages].reverse().find(m => (m.role || '').toLowerCase() === 'user');
  const base = lastUser?.content?.trim();
  if (!base) {
    return "Hello! I'm your local mock assistant. Ask me anything.";
  }
  // A simple heuristic for mock response
  if (/hello|hi|hey/i.test(base)) {
    return "Hey there! 👋 I'm a mock assistant responding locally. How can I help?";
  }
  if (/help|how to/i.test(base)) {
    return "Sure! While I'm a mock, I can still outline steps: 1) Clarify your goal, 2) Gather inputs, 3) Execute, 4) Iterate.";
  }
  if (/joke|funny/i.test(base)) {
    return "Here's a mock joke: Why did the function break up with the loop? It needed some space (complexity)!";
  }
  // Default echo-style
  const preview = base.length > 140 ? `${base.slice(0, 140)}...` : base;
  return `You said: "${preview}"\n\n(Mocked reply generated locally with slight latency.)`;
}

/**
 * Simulate a fetch-ish call shape for POST /chat.
 * Returns { data, error, status }.
 */
async function mockChat(body) {
  await new Promise(res => setTimeout(res, MOCK_LATENCY_MS));
  const reply = buildAssistantReply(body?.messages || []);
  return {
    data: { reply, model: 'mock-local-v1', mock: true },
    error: null,
    status: 200,
  };
}

/**
 * PUBLIC_INTERFACE
 * Mock API surface mirroring the real client methods.
 */
export const MockApi = {
  isEnabled: isMockEnabled,

  /**
   * PUBLIC_INTERFACE
   * Simulate POST relative to API base. Supports '/chat'.
   * @param {string} path
   * @param {object} body
   * @returns {Promise<{data:any, error:any, status:number}>}
   */
  async post(path, body = {}) {
    if (path === '/chat' || path === 'chat') {
      return mockChat(body);
    }
    // Fallback for unknown paths
    await new Promise(res => setTimeout(res, MOCK_LATENCY_MS / 2));
    return {
      data: null,
      error: { message: `Mock endpoint not implemented for ${path}`, code: 'MOCK_NOT_IMPLEMENTED' },
      status: 404,
    };
  },

  /**
   * PUBLIC_INTERFACE
   * Simulate GET relative to API base. Very minimal; can add health/info.
   * @param {string} path
   */
  async get(path) {
    await new Promise(res => setTimeout(res, MOCK_LATENCY_MS / 3));
    if (path === '/health' || path === 'health') {
      return { data: { ok: true, mock: true }, error: null, status: 200 };
    }
    return { data: null, error: { message: `Mock GET not implemented for ${path}` }, status: 404 };
  },
};
