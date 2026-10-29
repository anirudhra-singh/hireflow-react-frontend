import { config } from './config.js';

const REQUEST_TIMEOUT_MS = 60_000; 
const SLOW_AFTER_MS = 4_000;       

let accessToken = null;
let refreshToken = null;
let refreshPromise = null;     
let authFailureHandler = null;

export function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  refreshPromise = null;
}

export function getRefreshToken() {
  return refreshToken;
}

export function setAuthFailureHandler(handler) {
  authFailureHandler = handler;
}


export class ApiError extends Error {
  constructor(status, message, kind = 'http') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.kind = kind;
  }
}

function extractDetail(data) {
  const detail = data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const messages = detail.map((item) => item?.msg).filter(Boolean);
    if (messages.length > 0) return messages.join('. ');
  }
  return null;
}

function buildMessage(status, data) {
  if (status >= 500) return 'The server had a problem. Please try again in a moment.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  return extractDetail(data) ?? 'Something went wrong. Please try again.';
}


// slow request tracking ui show waking up the server
let slowCount = 0;
const slowListeners = new Set();
function notifySlow() {
  slowListeners.forEach((listener) => listener(slowCount > 0));
}
export function subscribeToSlowRequests(listener) {
  slowListeners.add(listener);
  return () => {
    slowListeners.delete(listener);
  };
}


async function parseJson(response) {
  if (response.status === 204) return null; // delete returns no body
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function send(path, { method, body, token }) {
  const controller = new AbortController();
  const abortTimer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let flaggedSlow = false;
  const slowTimer = setTimeout(() => {
    flaggedSlow = true;
    slowCount += 1;
    notifySlow();
  }, SLOW_AFTER_MS);

  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${config.apiBase}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      credentials: 'omit',
    });
    
    const data = await parseJson(response);
    return { ok: response.ok, status: response.status, data };
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new ApiError(0, 'The server took too long to respond. Please try again.', 'timeout');
    }
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.', 'network');
  } finally {
    clearTimeout(abortTimer);
    clearTimeout(slowTimer);
    if (flaggedSlow) {
      slowCount -= 1;
      notifySlow();
    }
  }
}

function unwrap({ ok, status, data }) {
  if (ok) return data;
  throw new ApiError(status, buildMessage(status, data));
}

// refreshe token
async function performRefresh() {
  if (!refreshToken) return false;
  try {
    const result = await send('/auth/refresh', {
      method: 'POST',
      body: { refresh_token: refreshToken },
      token: null,
    });
    if (result.ok && result.data?.access_token) {
      accessToken = result.data.access_token;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// session expired handling 
function endSession() {
  clearTokens();
  if (authFailureHandler) authFailureHandler();
  throw new ApiError(401, 'Your session expired. Please sign in again.');
}

export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const tokenUsed = auth ? accessToken : null;
  const first = await send(path, { method, body, token: tokenUsed });

  if (first.status !== 401 || !auth) return unwrap(first);

  
  const alreadyRefreshed = accessToken !== null && accessToken !== tokenUsed;
  const refreshed = alreadyRefreshed ? true : await refreshAccessToken();
  if (!refreshed) return endSession();

  const second = await send(path, { method, body, token: accessToken });
  if (second.status === 401) return endSession();
  return unwrap(second);
}