# AssetFlow AI — Frontend Starter

A polished, ready-to-run React + TypeScript + Tailwind v4 starter with the full
"command center" design system already wired in: dark theme, indigo/teal accents,
animated health rings, status badges, and pages for Login, Register, Dashboard,
Assets, and Bookings.

## Design system

| Token | Value | Use |
|---|---|---|
| `--color-base` | `#0b0e14` | Page background |
| `--color-surface` | `#10141f` | Cards |
| `--color-indigo` | `#6366f1` | Primary actions |
| `--color-teal` | `#2dd4bf` | Secondary accent |
| `--color-status-available` | `#34d399` | Available/confirmed states |
| `--color-status-risk` | `#fb923c` | At-risk/maintenance states |
| `--color-status-critical` | `#f87171` | Cancelled/critical states |

Fonts: **Space Grotesk** (display/headings), **Inter** (body), **IBM Plex Mono**
(labels, timestamps, data — reinforces the "data-dense" feel).

Signature element: the animated **HealthRing** component — an SVG circular
progress ring used for asset condition scores, color-shifting from teal/green
to amber to red based on score.

## Setup

```bash
npm install
cp .env.example .env
# edit .env to point VITE_API_URL at your backend
npm run dev
```

Runs on `http://localhost:5173`.

## Connecting to your backend

This starter expects a backend exposing:

```
POST /api/auth/register   { name, email, password, role }
POST /api/auth/login      { email, password }
GET  /api/assets
POST /api/assets          { name, category, location, status }
GET  /api/bookings
POST /api/bookings        { assetId, startTime, endTime, purpose }
```

All authenticated requests automatically attach `Authorization: Bearer <token>`
via `src/lib/api.ts`, using the token stored in `localStorage` on login.

## Structure

```
src/
├── components/     # Navbar, Card, StatusBadge, HealthRing, ProtectedRoute
├── context/        # AuthContext (login state, token storage)
├── lib/            # api.ts — fetch wrapper for your backend
├── pages/          # Login, Register, Dashboard, Assets, Bookings
├── App.tsx         # Routes
├── main.tsx        # Entry point
└── index.css       # Tailwind v4 theme tokens + global styles
```
