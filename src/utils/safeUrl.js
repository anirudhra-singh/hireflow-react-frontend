// 
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);


export function parseSafeUrl(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return null;

  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    return null; 
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) return null;
  return { href: url.href, host: url.hostname };
}