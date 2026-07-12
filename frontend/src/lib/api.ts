const API_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, body: unknown) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: unknown) =>
    request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
};

export interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'AVAILABLE' | 'ALLOCATED' | 'MAINTENANCE' | 'RETIRED';
  location: string | null;
  qrCode: string | null;
  createdAt: string;
}

export interface Booking {
  id: string;
  assetId: string;
  userId: string;
  startTime: string;
  endTime: string;
  purpose: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  asset?: Asset;
}
