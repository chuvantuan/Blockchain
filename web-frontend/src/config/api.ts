// Centralized API URL builder for frontend services
// Uses a single API gateway base URL when available (VITE_API_BASE_URL).
// Falls back to per-service VITE_* variables or localhost defaults.


const GATEWAY = import.meta.env.VITE_API_BASE_URL || '';

// API_BASE is the gateway base (no trailing /). If not using gateway, API_BASE can be empty
export const API_BASE = GATEWAY || '';

// Admin service: when gateway exists we expect to call `${API_BASE}/admin/...` (gateway routes it),
// otherwise call the admin service directly at /api/v1/admin/security
export const ADMIN_API = API_BASE
  ? `${API_BASE}/admin`
  : (import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:9003') + '/api/v1/admin/security';

// Identity service (auth)
export const IDENTITY_API = API_BASE
  ? `${API_BASE}/identity`
  : (import.meta.env.VITE_IDENTITY_SERVICE_URL || 'http://localhost:9001') + '/api/v1';

// Exam service
export const EXAM_API = API_BASE
  ? `${API_BASE}/exam`
  : (import.meta.env.VITE_EXAM_API_URL || 'http://localhost:9002') + '/api/v1';

export const COURSE_API = import.meta.env.VITE_COURSE_API_URL || (API_BASE ? `${API_BASE}/course` : 'http://localhost:9004/api/v1');

export const ONLINE_EXAM_API = import.meta.env.VITE_ONLINE_EXAM_API_URL || (API_BASE ? `${API_BASE}/online-exam` : 'http://localhost:9005');

export const MULTISIG_API = import.meta.env.VITE_MULTISIG_SERVICE_URL
  ? `${import.meta.env.VITE_MULTISIG_SERVICE_URL}/api/v1/multisig`
  : (API_BASE ? `${API_BASE}/multisig` : 'http://localhost:9010/api/v1/multisig');

export const TOKEN_REWARD_API = import.meta.env.VITE_TOKEN_REWARD_API_URL
  ? `${import.meta.env.VITE_TOKEN_REWARD_API_URL}/api/tokens`
  : (API_BASE ? `${API_BASE}/token-reward` : 'http://localhost:9009/api/tokens');

export const TOKEN_API = import.meta.env.VITE_TOKEN_API_URL || (API_BASE ? `${API_BASE}/token` : 'http://localhost:9011');

export default {
  API_BASE,
  ADMIN_API,
  IDENTITY_API,
  EXAM_API,
  COURSE_API,
  ONLINE_EXAM_API,
  MULTISIG_API,
  TOKEN_REWARD_API,
  TOKEN_API,
};
