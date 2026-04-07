const rawApiBase = process.env.REACT_APP_API_BASE_URL || 'https://api.umtcapply.com';
export const API_BASE = rawApiBase.replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}
