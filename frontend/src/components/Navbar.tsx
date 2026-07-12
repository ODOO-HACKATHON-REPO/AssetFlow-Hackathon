import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/assets', label: 'Assets' },
  { to: '/bookings', label: 'Bookings' },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 border-b border-border-soft bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo to-teal font-display text-sm font-bold text-base">
              A
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-text">
              AssetFlow<span className="text-teal"> AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-surface-raised text-text'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight text-text">{user.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-wide text-text-faint">{user.role}</p>
            </div>
          )}
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:border-text-faint hover:text-text"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
