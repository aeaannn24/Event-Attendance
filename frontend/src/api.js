const rawUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedBase = rawUrl ? rawUrl.replace(/\/+$/, '') : '';
const baseUrl = normalizedBase
  ? normalizedBase.endsWith('/api')
    ? normalizedBase
    : `${normalizedBase}/api`
  : '/api';

export const API_BASE_URL = baseUrl;
export const AUTH_API_BASE_URL = `${baseUrl}/auth`;
