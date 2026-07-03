const rawUrl = import.meta.env.VITE_API_URL?.trim();
const apiUrl = rawUrl
  ? rawUrl.replace(/\/+$/, '') // remove trailing slash
  : '';
const baseUrl = apiUrl ? `${apiUrl}/api` : '/api';

export const API_BASE_URL = baseUrl;
