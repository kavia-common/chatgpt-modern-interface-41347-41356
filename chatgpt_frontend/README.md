# ChatGPT Frontend (React)

This frontend provides a modern chat UI and a Hello design screen. It supports environment-driven API configuration with a local mock fallback and includes basic accessibility features and keyboard controls.

## Quick Start

- Install dependencies: run `npm install` in `chatgpt_frontend`
- Start the dev server: run `npm start`
- Open http://localhost:3000

## Routes

- / — Chat route that provides the conversation UI with an input composer and alternating message bubbles.
- /hello — Hello design route that renders the static design translated from Figma assets.

## Environment Variables

The app reads configuration from environment variables (Create React App style, prefixed with REACT_APP_). The primary variables used by this codebase are:

- REACT_APP_API_BASE (primary)
  Sets the base URL for API calls. This is the first priority for API configuration.
  Example: REACT_APP_API_BASE=https://api.example.com

- REACT_APP_BACKEND_URL (fallback)
  Used if REACT_APP_API_BASE is not set. If neither are set, the app falls back to window.location.origin + /api.
  Example: REACT_APP_BACKEND_URL=http://localhost:4000

- REACT_APP_WS_URL (optional)
  Optional WebSocket endpoint for future real-time features. Currently not used by default code paths but surfaced via config.
  Example: REACT_APP_WS_URL=wss://api.example.com/ws

- REACT_APP_FEATURE_FLAGS (mock mode and other flags)
  Enables feature flags. For mock API mode set a JSON object with mockApi: true, or provide a CSV-like string that includes mockApi.
  Examples:
  - REACT_APP_FEATURE_FLAGS={"mockApi": true}
  - REACT_APP_FEATURE_FLAGS=mockApi
  - REACT_APP_FEATURE_FLAGS=mockApi=true,otherFlag

Other environment variables present in the container but not directly used by the main flows include: REACT_APP_FRONTEND_URL, REACT_APP_NODE_ENV, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL, REACT_APP_HEALTHCHECK_PATH, REACT_APP_EXPERIMENTS_ENABLED. They are available under process.env and surfaced in src/config/env.js where applicable.

## How API Configuration Works

The app resolves API base in this priority order:
1) REACT_APP_API_BASE
2) REACT_APP_BACKEND_URL
3) window.location.origin + /api

The client performs a lightweight health probe. If no base is configured or the health check fails, or if REACT_APP_FEATURE_FLAGS enables mockApi, the client falls back to an in-browser mock that simulates /chat and /health.

- GET/POST helpers: src/api/client.js
- Mock implementation: src/api/mock.js
- Env resolution: src/config/env.js

## Installation and Running

From the chatgpt_frontend directory:

1) npm install
   Installs all dependencies.

2) npm start
   Starts the development server on port 3000.

3) npm run build
   Builds the production bundle to the build directory.

4) npm test
   Runs tests in watch mode.

## Assets and Static Files

- Figma images are served from public/figmaimages and referenced in code using getFigmaAsset from src/utils/assetPath.js.
- Hello design HTML/CSS/JS assets that informed the React translation are available under assets/. These are reference artifacts; the running app uses the React route at /hello.
- Global styles for the app are under src/App.css and route-specific styles under src/routes/*.css.

## Accessibility and Keyboard Controls

The chat composer supports keyboard interactions out of the box:
- Enter to send the current message
- Shift+Enter to insert a new line without sending

The UI includes ARIA roles and live regions to announce new messages for screen readers, labeled buttons and inputs, and a visible focus management pattern. A theme toggle button has an accessible label that reflects the next state (e.g., “Switch to dark mode”). The messages region uses aria-live="polite" and role="log" to announce additions.

## Project Structure Overview

- src/App.js: App shell, routes, and theme toggle
- src/routes/Chat.js and Chat.css: Chat UI and input composer
- src/routes/Hello.js and Hello.css: Hello design route and styles
- src/api/client.js: JSON fetch wrapper and mock fallback logic
- src/api/mock.js: Local mock implementation for /chat and /health
- src/config/env.js: Environment variable resolution
- src/utils/assetPath.js: Helpers to build figma image URLs

## Notes

- To fully disable mock mode, ensure REACT_APP_FEATURE_FLAGS does not include mockApi and the configured API base is reachable (a /health endpoint is preferred but not required).
- If no API base is provided, the app will assume /api on the same origin and attempt to connect there.

