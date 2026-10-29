function readConfig() {
  const raw = import.meta.env.VITE_API_URL;

  if (typeof raw !== 'string' || raw.trim() === '') {
    return { apiBase: null, error: 'VITE_API_URL is not set. Copy .env.example to .env and fill it in.' };
  }

  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    return { apiBase: null, error: 'VITE_API_URL is not a valid URL.' };
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return { apiBase: null, error: 'VITE_API_URL must start with https:// (or http:// in development).' };
  }

  if (import.meta.env.PROD && url.protocol !== 'https:') {
    return { apiBase: null, error: 'Production builds require an https:// API URL.' };
  }
  return { apiBase: `${url.origin}/api/v1`, error: null };
}

export const config = readConfig();