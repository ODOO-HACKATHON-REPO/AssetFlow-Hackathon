AssetFlow Frontend — Setup Instructions
========================================

1. Extract this zip's `src` folder contents INTO your existing
   frontend/src folder (overwrite when prompted — this replaces the
   default Vite scaffold files: App.tsx, main.tsx, index.css, and
   removes the unused App.css).

2. Install the one new dependency (React Router):

   cd frontend
   npm install react-router-dom

3. Make sure your backend is running on http://localhost:5000
   (this frontend's API client at src/lib/api.ts points there).

4. Start the frontend:

   npm run dev

5. Open the printed localhost URL. You'll land on /login since
   there's no session yet. Register a new account, or log in with
   an account you already created via Thunder Client
   (e.g. test@example.com / password123).

What's included
----------------
- src/lib/api.ts            Fetch wrapper, auto-attaches JWT from localStorage
- src/context/AuthContext.tsx   Tracks logged-in user, login/register/logout
- src/components/ProtectedRoute.tsx  Redirects to /login if not authenticated
- src/components/Navbar.tsx     Top nav with role display + logout
- src/components/StatusBadge.tsx   Colored status tags for assets/bookings
- src/pages/Login.tsx
- src/pages/Register.tsx        Includes a role dropdown (Employee/Manager/Admin)
- src/pages/Dashboard.tsx       Asset list; ADMIN/MANAGER can add new assets
- src/pages/Bookings.tsx        Booking list + create form; cancel/complete actions
- src/App.tsx                   Routes
- src/main.tsx                  Entry point (unchanged structure)
- src/index.css                 Tailwind v4 import + Space Grotesk/Inter/JetBrains Mono fonts

Notes
-----
- EMPLOYEE users can view assets and create/cancel their own bookings.
- MANAGER/ADMIN users can additionally create assets and mark bookings
  as Completed.
- Only ADMIN can delete assets (delete UI wasn't added to the dashboard
  yet — the backend route exists at DELETE /api/assets/:id if you want
  it wired up next).
