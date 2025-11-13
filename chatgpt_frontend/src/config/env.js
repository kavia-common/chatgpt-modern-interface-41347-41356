 // PUBLIC_INTERFACE
 /**
  * Resolve environment-driven configuration for API base URLs and other frontend settings.
  * Priority:
  * 1) REACT_APP_API_BASE
  * 2) REACT_APP_BACKEND_URL
  * 3) Default to window.location.origin (same host) + '/api'
  */
export const ENV = (() => {
  const {
    REACT_APP_API_BASE,
    REACT_APP_BACKEND_URL,
    REACT_APP_FRONTEND_URL,
    REACT_APP_WS_URL,
    REACT_APP_NODE_ENV,
    REACT_APP_PORT,
    REACT_APP_LOG_LEVEL,
    REACT_APP_FEATURE_FLAGS,
    REACT_APP_EXPERIMENTS_ENABLED,
  } = process.env;

  // Determine API base URL with fallback logic
  const apiBase =
    (REACT_APP_API_BASE && REACT_APP_API_BASE.trim()) ||
    (REACT_APP_BACKEND_URL && REACT_APP_BACKEND_URL.trim()) ||
    `${(typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : ''}/api`;

  return {
    apiBase,
    frontendUrl: REACT_APP_FRONTEND_URL || (typeof window !== 'undefined' && window.location ? window.location.origin : ''),
    wsUrl: REACT_APP_WS_URL || '',
    nodeEnv: REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development',
    port: REACT_APP_PORT || '',
    logLevel: REACT_APP_LOG_LEVEL || 'info',
    featureFlags: REACT_APP_FEATURE_FLAGS || '',
    experimentsEnabled: REACT_APP_EXPERIMENTS_ENABLED === 'true',
  };
})();
