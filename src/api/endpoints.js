// all backend endpoints

import { request, getRefreshToken } from './client.js';

export const authApi = {
  register: (details) => request('/auth/register', { method: 'POST', body: details, auth: false }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  me: () => request('/auth/me'),
  logout: () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return Promise.resolve();
    return request('/auth/logout', { method: 'POST', body: { refresh_token: refreshToken }, auth: false });
  },
};

export const jobsApi = {
  list: () => request('/jobs/'),
  create: (values) => request('/jobs/', { method: 'POST', body: values }),
  update: (id, changes) => request(`/jobs/${encodeURIComponent(id)}`, { method: 'PUT', body: changes }),
  remove: (id) => request(`/jobs/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  aiTip: (id) => request(`/jobs/${encodeURIComponent(id)}/ai-tip`, { method: 'POST' }),
};

export const analyticsApi = {
  summary: () => request('/analytics/summary'),
};