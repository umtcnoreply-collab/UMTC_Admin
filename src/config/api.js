const rawApiBase = process.env.REACT_APP_API_BASE_URL || 'https://api.umtcapply.com';
export const API_BASE = rawApiBase.replace(/\/$/, '');
const rawFallbackBase = process.env.REACT_APP_API_FALLBACK_URL || '';
const API_FALLBACK_BASE = rawFallbackBase.replace(/\/$/, '');

function isNetworkFailure(error) {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('failed to fetch') || message.includes('name_not_resolved') || message.includes('networkerror');
}

export async function apiRequest(path, options = {}) {
  const urls = [API_BASE, API_FALLBACK_BASE].filter(Boolean);
  let lastError = null;

  for (const baseUrl of urls) {
    try {
      const response = await fetch(`${baseUrl}${path}`, options);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Request failed.');
      }

      return data;
    } catch (error) {
      lastError = error;
      if (!isNetworkFailure(error)) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Request failed.');
}
