const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('assetflow_token')

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

export const api = {
  register: (body: { name: string; email: string; password: string; role?: string }) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  getAssets: () => request('/api/assets'),
  createAsset: (body: any) => request('/api/assets', { method: 'POST', body: JSON.stringify(body) }),

  getBookings: () => request('/api/bookings'),
  createBooking: (body: any) => request('/api/bookings', { method: 'POST', body: JSON.stringify(body) }),
  cancelBooking: (id: string) => request(`/api/bookings/${id}/cancel`, { method: 'PATCH' }),
}
